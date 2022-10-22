import { View, Text, ActivityIndicator, StyleSheet, Image} from 'react-native';
import { useCallback, useEffect, useState } from 'react';

export default function DetailGamePage( {route, navigation}) {

    const specificGameUrl = 'https://www.freetogame.com/api/game?id=';
    const {gameId} = route.params;
    const [gameSelected, setGameSelected] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect (() =>{
        getGameFromAPI();
        navigation.setOptions({title: gameSelected.title});
    },[getGameFromAPI, isLoading]);

    const getGameFromAPI = async () =>{
        let completeUrl = specificGameUrl+`${gameId}`;
        let obtainedData = null;
        const response = await ( await fetch(completeUrl)).json()
        .then((data)=>{
            obtainedData = data;
            setGameSelected(obtainedData);
            setIsLoading(false);            
        }).catch(function (error){
            console.log('Si è verificato un errore nel recupero dei dettagli', error);
          });
    }
    

    return(
        isLoading ? <ActivityIndicator size="large"/>  :
        <View style={styles.container}>
            <Image source={{uri: `${gameSelected.thumbnail}`}} style={styles.gameImage}/>
            <Text style={{fontSize: 20, fontWeight: 'bold', color: 'white', paddingTop: 10}}>Descrizione: </Text>
            <Text style={styles.descriptionTextStyle}>{gameSelected.description}</Text>
        </View>
    );
    
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#2b2d42',
      padding: 15,
      height: '100%'
    },
    descriptionTextStyle:{
        fontSize: 15,
        color: 'white',
        paddingTop: 10
    },
    gameImage: {
        flex:1, 
        width: '100%',
        height: 100,
      },
});