import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Button,  FlatList,  Image,  StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import { ScrollView } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import MainPageScreen from './screen/MainPageScreen';
import DetailGamePage from './screen/DetailGamePage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


export default function App() {

  const Stack = createNativeStackNavigator();

  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="MainPageScreen" >
          <Stack.Screen name="Giochi Free-to-Play" component={MainPageScreen} />
          <Stack.Screen name="DetailGamePage" component={DetailGamePage} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2b2d42',
    height: '100%'
  },
});



