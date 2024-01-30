/*
Esercizio 1
Crea un’app che, alla pressione di un pulsante, richieda al server i twok con tid 1, 2, 3e4
(Nota, le API di twok prevedono una funzione di test specifica, leggi la documentazione fornita)
I twok devono essere mostrati in una lista che contenga
Il testo del twok
L’immagine dell’autore (che deve essere scaricata con apposita richiesta)
Usa un sid hardcoded
ATTENZIONE: l’esercizio è difficile. Ragionate su come suddividerlo in sotto-esercizi che vi facciano arrivare gradualmente alla soluzione
*/

import React, { useEffect, useState, createContext } from 'react';
import { View, ActivityIndicator, Dimensions, Text, StyleSheet, StatusBar, SafeAreaViewBase } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import ListaTwok from './components/ListaTwok'
import CreaTwok from './components/CreaTwok'
import Storage from './components/Model/Storage.jsx'
import ComunicationController from './components/Model/ComunicationController';
import PersonalProfile from './components/PersonalProfile'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { UserContext } from './components/Model/UserContext';
import Seguiti from './components/Seguiti';

const App = () => {

  const [SID, setSID] = useState(null);

  useEffect(() => {
    Storage.getSID().then(
      s => {
        if (s == null || s.length != 20) ottieniSid()
        else setSID(s)
        console.log(SID)
      }
    )
  }, [])


  const ottieniSid = async () => {
    let endpoint = "register"
    let params = {}
    let sidObj = await ComunicationController.serverReq(endpoint, params)
    console.log("ottenuto " + sidObj.sid)
    setSID(sidObj.sid)
    Storage.storeSID(sidObj.sid)
  }

  return (SID != null ?
    <UserContext.Provider value={SID}>
      <NavigationContainer >
        <Tab.Navigator
          screenOptions={setIcons}
        ><Tab.Screen name="Home" component={ListaTwok} />
          <Tab.Screen name="Profilo" component={PersonalProfile} />
          <Tab.Screen name="Seguiti" component={Seguiti} />
          <Tab.Screen name="Aggiungi Twok" component={CreaTwok} />
        </Tab.Navigator>

      </NavigationContainer>
    </UserContext.Provider>
    :
    <View style={{position: 'absolute',
    alignSelf:'center',
    bottom: Dimensions.get('window').height/2}}>
      <Text style={{fontSize:24, fontWeight:'700', color:'#ff5c69'}}>Benvenuto su Twit-Tok</Text>
      <Text style={{fontSize:18, fontWeight:'500', color:'#ff5c69'}}>Caricando profilo. . .</Text>
      <ActivityIndicator color={'#ff5c69'} size={'large'} />
    </View>
  )
}

const Tab = createBottomTabNavigator();

const setIcons = ({ route }) => ({
  tabBarIcon: ({ focused, color, size }) => {
    let iconName;
    if (route.name === 'Home') {
      iconName = focused ? 'book' : 'book-outline';
    } else if (route.name === 'Profilo') {
      iconName = focused ? 'person' : 'person-outline';
    } else if (route.name === 'Seguiti') {
      iconName = focused ? 'people' : 'people-outline';
    } else if (route.name === 'Aggiungi Twok') {
      iconName = focused ? 'text' : 'text-outline';
    }
    return <Ionicons name={iconName} size={size} color={color} />;
  },
  tabBarActiveTintColor: '#ff5c69',
  tabBarInactiveTintColor: 'gray',
})

export default App;
