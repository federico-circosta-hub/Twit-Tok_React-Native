import React, { Component, useContext, useEffect, useState } from 'react';
import { View, Button, Text, StyleSheet, StatusBar, Dimensions, FlatList, ActivityIndicator, TouchableHighlight } from 'react-native';
import { UserContext } from '../Model/UserContext';
import ComunicationController from '../Model/ComunicationController.jsx'
import TwokLine from '../TwokLine.jsx'


const ATTEMPT = 20
const TwokLoader = (props) => {

  const SID = useContext(UserContext)

  const [Twoks, setTwoks] = useState([])
  const [profileInfo, setProfileInfo] = useState((null))
  const [loading, setLoading] = useState(false)
  const [tids, setTids] = useState([])
  const [failed, setFailed] = useState(0)

  const MINE = props.MINE //se vero carica i twok fatti da me, altrimenti prende dalle props lo uid del profilo di cui visualizzare i twok

  useEffect(() => {
    fillBuffer()
  }, [])

  const fillBuffer = async () => {
    setLoading(true)
    await getTwok()
    setLoading(false)
  }

  async function checkProfile() {
    let p = profileInfo
    if (MINE) {
      if (profileInfo == null) {
        p = await getProfileInfo()
      }
    } else {
      setProfileInfo(props.profilo)
      p = props.profilo
    }
    return p
  }

  const adderList = (list, item) => {
    let l = list
    l.push(item)
    return l
  }

  const getTwok = async () => {
    console.log("ottengo twok...")
    let buffer = []
    let td = tids
    console.log(td)
    let f = 0
    let p = await checkProfile()
    let endpoint = "getTwok"
    let params = { sid: SID, uid: p.uid }
    for (let i = 0; buffer.length < 5 && f < ATTEMPT; i++) {
      let t = await ComunicationController.serverReq(endpoint, params)
      if (td.includes(t.tid)) {
        console.log(t.tid + " gia presente, scartato")
        f += 1
      } else {
        console.log(t.tid + " non presente, aggiungo...")
        f = 0
        buffer.push(t)
        td.push(t.tid)
        setTids(adderList(tids, t.tid))
        console.log(t.tid + " aggiunto")
      }
    }
    buffer.forEach(element => {
      if (element != undefined) setTwoks(prev => [...prev, element])
    });
    setFailed(f)
  }

  const getProfileInfo = async () => {
    let endpoint = "getProfile"
    let params = { sid: SID }
    let prof = await ComunicationController.serverReq(endpoint, params)
    if (prof != 0) setProfileInfo(prof)
    return prof
  }

  const renderFooter = () => {
    if (loading) return <ActivityIndicator color={'#ff5c69'} size={'large'} />
    if (failed >= ATTEMPT && Twoks.length > 0) return <View style={{ paddingBottom: 64 }}><Text>Caricati tutti i twok! (:</Text></View>
    else if (Twoks.length == 0) return <View style={{ paddingVertical: 16 }}><Text>Non ci sono twok da mostrare ):</Text></View>
  };

  return (
    <View>
      <FlatList
        data={Twoks}
        extraData={Twoks}
        renderItem={({ item }) => { return <TwokLine p={true} dati={item} onMap={() => giveMap(item)} /> }}
        /* keyExtractor={item => item.tid} */
        snapToAlignment='start'
        decelerationRate={'fast'}
        snapToInterval={Dimensions.get('window').height / 1.44}
        onEndReached={() => fillBuffer()}
        ListFooterComponent={() => renderFooter()}
        onEndReachedThreshold={0.01}
      />
    </View>)
}

export default TwokLoader;