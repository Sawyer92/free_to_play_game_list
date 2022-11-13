import { View, Text, ActivityIndicator, StyleSheet, Image, ScrollView, Button, TouchableOpacity} from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import logoSteam from './../assets/images/steam-icon.png';
import logoBrowser from './../assets/images/chrome-icon2.png';
import logoSwitch from './../assets/images/switch-icon.png';
import logoPlaystation from './../assets/images/ps-icon.png';
import logoXbox from './../assets/images/xbox-icon.png';
import { AntDesign } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';

export default function DetailGamePage( {route, navigation}) {

    const specificGameUrl = 'https://www.freetogame.com/api/game?id=';
    const {gameId} = route.params;
    const [gameSelected, setGameSelected] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [lineToShow, setLineToShow] = useState(5);
    const [platformToShow, setPlatformToShow] = useState(null);
    const [screenShootsList, setScreenShootsList] = useState([]);
    const [currentImageToShow, setCurrentImageToShow] = useState(0);
    const [requirements, setRequirements] = useState({os: '', processor: '', memory: '', graphics:'', storage:''});

    useEffect (() =>{
        getGameFromAPI();
        navigation.setOptions({title: gameSelected.title, headerStyle: {backgroundColor: '#2b2d42'},headerTitleStyle: {
        color: 'white',}, headerTintColor: 'white'
    });
        console.log("ID:", gameId);
    },[getGameFromAPI,isLoading]);

    const getGameFromAPI = async () =>{
        let completeUrl = specificGameUrl+`${gameId}`;
        const response = await ( await fetch(completeUrl)).json()
        .then((data)=>{
            setGameSelected(data);
            if(data.platform === 'Windows'){
                setPlatformToShow(require('./../assets/images/steam-logo.png'));
        } else if(data.platform === 'Web Browser'){
            setPlatformToShow(require('./../assets/images/chrome-icon.png'));
        }
        if(data.minimum_system_requirements!== undefined){
            setRequirements(
                {os:data.minimum_system_requirements.os !== null ? data.minimum_system_requirements.os : 'Not Available',
                processor: data.minimum_system_requirements.processor !== null ? data.minimum_system_requirements.processor : 'Not Available',
                memory: data.minimum_system_requirements.memory !== null ? data.minimum_system_requirements.memory : 'Not Available',
                graphics: data.minimum_system_requirements.graphics !== null ? data.minimum_system_requirements.graphics : 'Not Available',
                storage: data.minimum_system_requirements.storage !== null ? data.minimum_system_requirements.storage : 'Not Available'
            });
        }
        setScreenShootsList(data.screenshots);
        setIsLoading(false);            
        }).catch(function (error){
            console.log('Si è verificato un errore nel recupero dei dettagli', error);
        });
    }
    
  function nextImage () {
    let count = currentImageToShow;
    count === screenShootsList.length-1 ? count =0 : count ++;
    setCurrentImageToShow(count);
  }

  function previousImage () {
    let count = currentImageToShow;
    count === 0 ? count= screenShootsList.length-1 : count --;
    setCurrentImageToShow(count);
  }

  const showRequirements = () => {
    if(gameSelected.platform === 'Windows') {
        return (
            <View>
                <Text style={styles.paragraphText}>Minimum Requirements:</Text>
                <Text style={styles.requirementsText}>OS: <Text style={{fontSize: 13}}>{requirements.os}</Text></Text>
                <Text style={styles.requirementsText}>Processor: <Text style={{fontSize: 13}}>{requirements.processor}</Text></Text>
                <Text style={styles.requirementsText}>Memory: <Text style={{fontSize: 13}}>{requirements.memory}</Text></Text>  
                <Text style={styles.requirementsText}>Graphics: <Text style={{fontSize: 13}}>{requirements.graphics}</Text></Text>   
                <Text style={styles.requirementsText}>Storage: <Text style={{fontSize: 13}}>{requirements.storage}</Text></Text> 
            </View>
        );
    } 
  }

    return(
        isLoading ? <ActivityIndicator key="indicator" size="large"/>  :
        <View key="a" style={styles.container} >
            <ScrollView nestedScrollEnabled={true}>
                <View style={{flexDirection: 'row', justifyContent:'space-between', alignContent: 'space-between'}}>
                    <Image source={{uri: `${gameSelected.thumbnail}`}} style={styles.gameImage}/>
                    <View style={{padding: 10, flexDirection: 'column'}}>
                        <Text style={styles.descriptionTextStyle}>Platforms:</Text>
                        <Image source={platformToShow} style={{marginTop: 5, height:35, width: 35,  color: 'red'}}/>
                    </View>
                </View>
                <Text style={styles.paragraphText}>Description: </Text>
                <Text numberOfLines={lineToShow} style={styles.descriptionTextStyle} 
                onPress={()=>{lineToShow=== 200 ? setLineToShow(5) : setLineToShow(200)}}>{gameSelected.description}</Text>
                <Text onPress={()=>{ lineToShow=== 200 ? setLineToShow(5) : setLineToShow(200)}} 
                style={{color: '#00b4d8', fontSize: 15}}> {lineToShow===5 ? 'Show more' : 'Show less'}</Text>
                <View>
                <Text style={styles.paragraphText}>Screenshoots: </Text>
                <View style={{width: '100%', height:250, flexDirection: 'row', alignItems: 'center', marginTop: 10,
                 justifyContent: 'space-around', alignContent:'space-around'}}>
                    <TouchableOpacity  onPress={previousImage}>
                        <AntDesign name="leftcircleo" size={24} color="white" style={{alignItems: 'center',marginRight: 10}}/>
                    </TouchableOpacity>
                    <Image source={{uri: `${screenShootsList[currentImageToShow].image}`}} style={styles.gameScreenShoot}/>
                    <TouchableOpacity onPress={nextImage}>
                        <AntDesign name="rightcircleo" size={24} color="white" style={{alignItems: 'center',marginLeft: 10}}/>
                    </TouchableOpacity>                    
                </View>
                <View style={{ alignItems: 'center', justifyContent:'center' ,paddingTop: 10, flexDirection: 'row'}} >
                    {screenShootsList.map( (item, index) =>{
                        return (<Octicons name={ index===currentImageToShow ? "dot-fill" : "dot"} size={24} color="white" style={{marginRight: 10}}/>);                         
                    })}                 
                </View>
                    {showRequirements()} 
                </View>
            </ScrollView>         
        </View>
    );
    
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#2b2d42',
      padding: 15,
      height: '100%',
      width: '100%'
    },
    descriptionTextStyle:{
        fontSize: 15,
        color: 'white',
    },
    gameImage: {
        flex:1,
        width: '70%',
        height: '50%',
        paddingTop: 150,
        borderRadius: 5
      },
    gameScreenShoot: {
        width: '100%',
        height: '100%',
        flex: 1,
        borderRadius: 10
    },
    navigationScreenButton: {
        borderRadius: 15,
        backgroundColor: '#2A6F97',
        width: 35,
        height: 40,
    },
    paragraphText: {
        fontSize: 20, 
        fontWeight: 'bold',
        color: 'white', 
        paddingTop: 10, 
        paddingBottom: 10
    },
    requirementsText: {
        fontSize: 15, 
        fontWeight: 'bold',
        color: 'white', 
    }
});