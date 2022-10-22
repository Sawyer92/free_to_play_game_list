import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Button,  FlatList,  Image,  StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';

export default function MainPageScreen({navigation}) {

const baseUrl = 'https://www.freetogame.com/api/games';

let dataToShow = [{id: 1, value: '10'},{id: 2, value: '20'}, {id: 3, value: '30'}, {id: 4, value: 'Tutti'}];
//const baseUrl = 'https://free-to-play-games-database.p.rapidapi.com/api/games';

const specificGameUrl = 'https://www.freetogame.com/api/game?id=51';
const alphabeticalOrderCondition = '?sort-by=alphabetical';
const [gamesRetrieved, setGamesRetrieved] = useState([]);
const [topTenGames, setTopTenGames] = useState();
const [isLoading, setIsLoading] = useState(true);
const [limitToShow, setLimitToShow] = useState(dataToShow[0].value);
const [isDropDownFocus, setIsDropDownFocus] = useState(false);


const options = {
  method: 'GET',
  url: 'https://free-to-play-games-database.p.rapidapi.com/api/games',
  headers: {
    'X-RapidAPI-Key': '13fac7e3d2msh046e201bc1fc59dp1ca848jsn63c7525a6eb4',
    'X-RapidAPI-Host': 'free-to-play-games-database.p.rapidapi.com'
  }
};



function getTop10GamesFromAPI (){
  let result = [];
  fetch(baseUrl).then((response) => response.json())
  .then((data) => {
    limitToShow == 'Tutti' ? result=data : result = data.slice(0,limitToShow);
    setGamesRetrieved(result)
    setIsLoading(false);
  }).catch(function (error){
    console.log('Si è verificato un errore', error);
  });
}

  useEffect(() => {
    getTop10GamesFromAPI();
  },[limitToShow]);
  

  const getContenuto = () => {
   if(isLoading) {
     return  <ActivityIndicator size="large"/> 
    } else {
      return ( 
        <FlatList numColumns={2} contentContainerStyle={styles.gameGridView}
          data={gamesRetrieved}
          renderItem ={({item})=>
          <TouchableOpacity style={styles.boxGameContainer} 
          onPress={() => navigation.navigate('DetailGamePage', {gameId: item.id})} >
              <Image source={{uri: `${item.thumbnail}`}} style={styles.gameImage} />
              <Text style={styles.gameTitle}>{item.title}</Text>
          </TouchableOpacity> 
          }
        />
      );
    }
  }

  const getTitle = () =>{
    if(limitToShow==='Tutti') {
     return  <Text style={styles.headerTextStyle}>Elenco giochi free-to-play</Text> 
    }  else {
      return <Text style={styles.headerTextStyle}>Top {limitToShow} giochi free-to-play</Text> 
    }
  }

  

  return (
    <View style={styles.container}>
        {getTitle()}
        <View style={styles.dropDownView}>
          <Text style={{color: '#EDF2F4', fontSize: 20}}>Mostra: </Text>
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
              setLimitToShow(item.value);
            }}
          />
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
    height: '100%'
  },
  headerTextStyle:{
    fontWeight:'bold',
    fontSize: 25,
    color: 'white',
    marginTop: 15,
    marginLeft: 5
  },
  gameGridView:{
    marginTop: 20,
    justifyContent: 'space-between',
    marginVertical: 8,
  },
   boxGameContainer: {
    width: '50%',
    height: 150,
    backgroundColor: '#3B6CD4',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    marginBottom: 15,
    marginLeft: 5,
    alignItems: 'center'
  },
  dropDownView:{
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignContent: 'stretch',
    marginTop: 20
  },
  gameImage: {
    flex:1, 
    width: '100%',
    height: 100,
  },
  gameTitle: {
    fontSize: 20,
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
    width: 75,
    borderColor: 'white',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 10,
  },

});
