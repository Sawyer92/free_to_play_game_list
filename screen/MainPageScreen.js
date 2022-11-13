import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Button,  FlatList,  Image,  StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';

export default function MainPageScreen({navigation}) {

const baseUrl = 'https://www.freetogame.com/api/games?platform=';

const dataToShow = [{id: 1, value: '10'},{id: 2, value: '20'}, {id: 3, value: '30'}, {id: 4, value: 'All'}];
const platformToShow = [{id: 1, value: 'all'}, {id: 2, value: 'browser'}, {id: 3, value: 'pc'}]; 

const platformUrl ='?platform=';
const alphabeticalOrderCondition = '?sort-by=alphabetical';
const [gamesRetrieved, setGamesRetrieved] = useState([]);
const [isLoading, setIsLoading] = useState(true);
const [limitToShow, setLimitToShow] = useState(dataToShow[0].value);
const [isDropDownFocus, setIsDropDownFocus] = useState(false);
const [platformChoosed, setPlatformChoosed] = useState(platformToShow[0].value);


const options = {
  method: 'GET',
  url: 'https://free-to-play-games-database.p.rapidapi.com/api/games',
  headers: {
    'X-RapidAPI-Key': '13fac7e3d2msh046e201bc1fc59dp1ca848jsn63c7525a6eb4',
    'X-RapidAPI-Host': 'free-to-play-games-database.p.rapidapi.com'
  }
};

function getGamesByPlatform (platformType) {
  let urlToUse = baseUrl+platformType;
  let result = [];
  fetch(urlToUse).then((response) => response.json())
  .then((data) => {
    result = data.slice(0,10);
    setGamesRetrieved(result);
    setIsLoading(false);
    setLimitToShow(dataToShow[0].value);
    setPlatformChoosed(platformType)
  }).catch(function (error){
    console.log('Si è verificato un errore', error);
  });
}


function getTop10GamesFromAPI (dataLimit){
  let result = [];
  let url = baseUrl+platformChoosed;
  fetch(url).then((response) => response.json())
  .then((data) => {
    dataLimit == 'All' ? result=data : result = data.slice(0,dataLimit);
    setGamesRetrieved(result)
    setLimitToShow(dataLimit);
    setIsLoading(false);
  }).catch(function (error){
    console.log('Si è verificato un errore', error);
  });
}

  useEffect(() => {
    getTop10GamesFromAPI(limitToShow);
    navigation.setOptions({headerShown: false});
  },[]);
  

  const getContenuto = () => {
   if(isLoading) {
     return  <ActivityIndicator size="large"/> 
    } else {
      return ( 
        <FlatList numColumns={2} contentContainerStyle={styles.gameGridView} ItemSeparatorComponent={() => <View style={{height: 2}} />}
          data={gamesRetrieved}
          renderItem ={({item, index})=>
          <TouchableOpacity style={styles.boxGameContainer} 
          onPress={() => navigation.navigate('DetailGamePage', {gameId: item.id})} >
              <Image source={{uri: `${item.thumbnail}`}} style={styles.gameImage} />
          </TouchableOpacity> 
          }
        />
      );
    }
  }

  const getTitle = () =>{
    if(limitToShow==='Tutti') {
     return  <Text style={styles.headerTextStyle}>Free-to-play games list</Text> 
    }  else {
      return <Text style={styles.headerTextStyle}>Top {limitToShow} free-to-play games</Text> 
    }
  }

  

  return (
    <View style={styles.container}>
        {getTitle()}
        <View style={{flexDirection: 'row'}}>
          <View style={styles.dropDownView}>
            <Text style={{color: '#EDF2F4', fontSize: 20}}>Show: </Text>
            <Dropdown 
              style={[styles.dropdown, isDropDownFocus && { borderColor: 'blue' }]}
              data={dataToShow}
              labelField="value"
              valueField="id"
              placeholder={limitToShow}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              value={limitToShow}
              onChange={item => {
               // 
                getTop10GamesFromAPI(item.value);
              }}
            />
          <Text style={{color: '#EDF2F4', fontSize: 20, paddingLeft: 25}}>Filter : </Text>
          <Dropdown 
              style={[styles.dropdown, isDropDownFocus && { borderColor: 'blue' }]}
              data={platformToShow}
              labelField="value"
              valueField="id"
              placeholder={platformChoosed}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              value={platformChoosed}
              onChange={item => {
                getGamesByPlatform(item.value);
              }}
            />
          </View>        
        </View>
        {
        getContenuto()       
        }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2b2d42',
    height: '100%',
  },
  headerTextStyle:{
    fontWeight:'bold',
    fontSize: 25,
    color: 'white',
    marginTop: 45,
    marginLeft: 5
  },
  gameGridView:{
    marginTop: 25,
    marginRight: 5,
    alignContent: 'space-between',
  },
   boxGameContainer: {
    width: '50%',
    height: 150,
    backgroundColor: '#3B6CD4',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    marginBottom: 5,
    marginRight: 5,
    alignItems: 'center'
  },
  dropDownView:{
    flexDirection: 'row',
    alignContent: 'stretch',
    marginTop: 20,
    marginLeft: 10,
    alignItems: 'center'
  },
  gameImage: {
    flex:1, 
    width: '100%',
    height: '100%',
    borderRadius: 10,
    transform: [{ scale: 0.999 }]
  },
  gameTitle: {
    fontSize: 15,
    fontWeight: 'bold'
  },
  dropDownButton:{
    backgroundColor: 'rgba(0,0,0,0,2)',
    padding: 8,
    borderRadius: 6
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#EDF2F4'
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#EDF2F4'
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  dropdown: {
    height: 40,
    width: 100,
    borderColor: 'white',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginLeft: 10
  },

});
