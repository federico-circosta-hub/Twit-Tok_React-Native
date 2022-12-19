import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, FlatList } from 'react-native';
import { UserContext } from './Model/UserContext';
import ComunicationController from './Model/ComunicationController';
import UserLine from './UserLine';


const Seguiti = () => {

  const SID = useContext(UserContext)

  const [seguiti, setSeguiti] = useState([])
  const [fetching, setFetching] = useState(false)

  useEffect(() => {
    getFollowed()
  }, [])

  const getFollowed = async () => {
    let params = { sid: SID }
    let r = await ComunicationController.serverReq("getFollowed", params)
    if (r != null) setSeguiti(r)
    setFetching(false)
  }

  return (
    <View style={styles.container}>
      <Text>{seguiti.length}</Text>
      <FlatList style={{width:"100%"}}
        renderItem={({ item }) => { return <UserLine dati={item}/>}}
        data={seguiti}
        refreshing={fetching}
        onRefresh={() => {setFetching(true), setSeguiti([]), getFollowed()}}
      />
    </View>)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    borderRadius: 100,
    width: 60,
    height: 60,
  },
})

export default Seguiti;