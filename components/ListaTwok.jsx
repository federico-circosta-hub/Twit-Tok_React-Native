import React, { Component, useContext, useEffect, useState } from 'react';
import { View, Button, Text, StyleSheet, Alert, Dimensions, FlatList, ActivityIndicator, Pressable } from 'react-native';
import TwokLine from './TwokLine';
import UserProfile from './UserProfile';
import TwokLoader from './ViewModel/TwokLoader';
import MapView, { Marker } from 'react-native-maps';
import ComunicationController from './Model/ComunicationController';
import { UserContext } from './Model/UserContext';

const ListaTwok = () => {

  const SID = useContext(UserContext)

  const [Twoks, setTwoks] = useState([])
  const [ProfilePic, setProfilePic] = useState([])
  const [TwoksAndPictures, setTwoksAndPictures] = useState([])
  const [fetching, setFetching] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selTwok, setSelTwok] = useState(null)
  const [map, setMap] = useState(false)
  const [bigMap, setBigMap] = useState(false)
  const [ProfilePage, setProfilePage] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  useEffect(() => {
    fillBuffer();
  }, [])

  const adderList = (list, item) => {
    let l = list
    l.push(item)
    return l
  }

  const fillBuffer = async () => {
    setLoading(true)
    for (let index = 0; index < 5; index++) {
      await handleTwok()
    }
    setFetching(false)
    setLoading(false)
  }

  const handleTwok = async () => {
    let twokAndPic = await ottieniTwok()
    setTwoksAndPictures(prevState => [...prevState, twokAndPic]);
  }

  const ottieniTwok = async () => {
    let endpoint = "getTwok"
    let params = { sid: SID }
    let req = await ComunicationController.serverReq(endpoint, params)
    console.log("ricevuto twok " + JSON.stringify(req))
    setTwoks(adderList(Twoks, req))
    let picObj = await ottieniPic(req.uid)
    let twokAndPic = await Object.assign(req, picObj)
    return twokAndPic
  }

  const ottieniPic = async (uid) => {
    let picObj = null
    let presente = false
    ProfilePic.forEach((element) => {
      if (element.uid == uid) presente = true, picObj = element
    })
    if (!(presente)) {
      let endpoint = "getPicture"
      let params = { sid: SID, uid: uid }
      picObj = await ComunicationController.serverReq(endpoint, params)
      setProfilePic(adderList(ProfilePic, picObj))
    }
    return picObj
  }

  function clearAll() {
    setTwoksAndPictures([])
    setProfilePic([])
    setTwoks([])
  }

  const giveMap = (t) => {
    if (t.lat != null && t.lon != null) setMap(true), setSelTwok(t)
    else Alert.alert("Nessuna posizione per il twok selezionato!")
  }

  const renderFooter = () => {
    if (loading) return <ActivityIndicator color={'#ff5c69'} size={'large'} />
  };

  const showProfile = (i) => {
    console.log("premo sul nome " + i.name)
    setSelectedUser(i.uid)
    setProfilePage(true)
  }

  function getMarker() {
    let arr = []
    TwoksAndPictures.forEach(element => {
      if (element.lat != null && element.lon != null) arr.push(element)
    });
    return arr.map(element => (
            <Marker
            coordinate={{ latitude: element.lat, longitude: element.lon }}
            title={element.name}
            description={element.text}
             />
            ));
  }

  if (map) {
    console.log("coordinate del twok: latitude: " + selTwok.lat + ", longitude: " + selTwok.lon)
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: selTwok.lat,
            longitude: selTwok.lon,
            latitudeDelta: 12,
            longitudeDelta: 12,
          }}>{<Marker
            coordinate={{ latitude: selTwok.lat, longitude: selTwok.lon }}
            title={selTwok.name}
            description={selTwok.text} />}
        </MapView>
        <Pressable style={styles.pressable} onPress={() => setMap(false)}>
          <Text style={{
            fontSize: 22, fontWeight: "800",
            color: 'white',
          }}>Torna</Text>
        </Pressable>
      </View>)
  } else if (ProfilePage) {
    return (
      <View style={styles.map}>
        <UserProfile dati={selectedUser} onBack={() => setProfilePage(false)} />
      </View>)
      } else if (bigMap) {
        return (
          <View style={styles.container}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: 45,
                longitude: 9,
                latitudeDelta: 40,
                longitudeDelta: 40,
              }}>{getMarker()}
            </MapView>
            <Pressable style={styles.pressable} onPress={() => setBigMap(false)}>
              <Text style={{
                fontSize: 22, fontWeight: "800",
                color: 'white',
              }}>Torna</Text>
            </Pressable>
          </View>)
  } else {
    return (
        <View style={styles.container}>
           <FlatList style={styles.listStyle}
            data={TwoksAndPictures}
            renderItem={({ item }) => { return <TwokLine p={false} dati={item} onMap={() => giveMap(item)} onProfile={() => showProfile(item)} onBigMap={() => {console.log("visualizza big mappa"), setBigMap(true)}} /> }}
            snapToAlignment='start'
            decelerationRate={'fast'}
            snapToInterval={Dimensions.get('window').height / 1.23}
            onRefresh={() => { setFetching(true), clearAll(), fillBuffer() }}
            refreshing={fetching}
            onEndReached={() => fillBuffer()}
            ListFooterComponent={() => renderFooter()}
            onEndReachedThreshold={0.1}
          />
        </View>
)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listStyle: {
    width: "100%"
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  pressable: {
    position: 'absolute',
    top: Dimensions.get('window').height / 1.4,
    right: 0,
    bottom: 0,
    left: Dimensions.get('window').width / 2.7,
    borderRadius: 8,
    padding: 6,
    height: "9%",
    width: '25%',
    backgroundColor: '#ff5c69',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
  }
});

export default ListaTwok;