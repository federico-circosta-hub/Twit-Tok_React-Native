import React, { Component, useContext, useEffect, useState } from 'react';
import { Font } from "expo";
import { View, TextInput, Text, StyleSheet, Dimensions, Pressable, ActivityIndicator, Alert, Switch } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown'
import { Ionicons } from '@expo/vector-icons';
import { BottomTabBar } from '@react-navigation/bottom-tabs';
import ComunicationController from './Model/ComunicationController';
import LocationController from './Model/LocationController';
import { UserContext } from './Model/UserContext';

const CreaTwok = () => {

  const SID = useContext(UserContext)

  const [editMode, setEditMode] = useState(false)
  const [sending, setSending] = useState(false)
  const [text, onChangeText] = useState("Tieni premuto per modificare");
  const [background, setBackground] = useState("white")
  const [fontcol, setFontcol] = useState("black")
  const [fontsize, setFontsize] = useState(1)
  const [fonttype, setFonttype] = useState(0)
  const [halign, setHalingn] = useState(1)
  const [valign, setValign] = useState(1)
  const [isEnabled, setIsEnabled] = useState(false)

  const colours = [{ nome: "grigio", codice: "808080" }, { nome: "acqua", codice: '00ffff' }, { nome: "nero", codice: "000000" }, { nome: "blu", codice: "0000ff" }, { nome: "corallo", codice: "ff7f50" }, { nome: "arancione", codice: "ff8c00" }, { nome: "rosa", codice: "ff69b4" }, { nome: "verde", codice: "008000" }, { nome: "giallo", codice: "ffff00" }, { nome: "pomodoro", codice: "ff6347" }, { nome: "bianco", codice: "ffffff" }]
  const size = ["piccolo", "medio", "grande"]
  const family = ["System", "monospace", "serif"]
  const hpos = ["sinistra", "centro", "destra"]
  const vpos = ["alto", "centro", "basso"]

  const handleFontFamily = () => {
    switch (fonttype) {
      case 0:
        return "System"
      case 1:
        return "monospace"
      case 2:
        return "serif"
    }
  }

  const handleSize = () => {
    switch (fontsize) {
      case 0:
        return 12
      case 1:
        return 22
      case 2:
        return 32
    }
  }
  const handleAlign = (align) => {
    switch (align) {
      case 0:
        return "flex-start"
      case 1:
        return "center"
      case 2:
        return "flex-end"
    }
  }

  const verifyLocation = async () => {
    return await LocationController.locationPermissionAsync()
  }

  const handleSend = async () => {
    setSending(true)
    let endpoint = "addTwok"
    let position;
    if (isEnabled) position = await verifyLocation()
    else position = { coords: { latitude: null, longitude: null } }
    let params = {
      sid: SID, text: text, bgcol: background, fontcol: fontcol, fontsize: fontsize, fonttype: fonttype, halign: halign, valign: valign, lat: position.coords.latitude, lon: position.coords.longitude
    }
    console.log("invio " + JSON.stringify(params) + " all'endpoint " + endpoint)
    let res = await ComunicationController.serverReq(endpoint, params)
    await sleep(2000)
    setSending(false)
    if (!(res == null)) Alert.alert("Twok inviato correttamente!")
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const createSendingButton = () => {
    if (sending) return <ActivityIndicator color={'#ff5c69'} size={'large'} animating={sending} />
    else return (
      <Pressable onPress={() => handleSend()} disabled={sending} style>
      <View style={styles.button}>
        <Text style={styles.buttonText}>{"Invia twok!  "}<Ionicons style={styles.icon} size={18} name={"send-sharp"} /></Text>
      </View>
    </Pressable>
    )
  }

  return (editMode ?
    <View style={{ flex: 1 }}>
      <View style={{ flex: 2 }}>
        <TextInput placeholder={"Cosa stai pensando?"} maxLength={100} style={{
          fontSize: 25,
          fontWeight: "700"
        }} onEndEditing={() => setEditMode(false)} onChangeText={txt => { if (txt.trim() != "") onChangeText(txt) }} />
      </View>
    </View>
    :
    <View>
      <View style={{
        backgroundColor: "#" + background,
        borderBottomColor: '#000000',
        borderWidth: 2,
        height: Dimensions.get('window').height / 2.2,
        width: Dimensions.get('window').width,
        justifyContent: handleAlign(valign),
        alignItems: handleAlign(halign),
      }}>
        <Text style={{
          color: "#" + fontcol,
          fontSize: handleSize(),
          fontFamily: handleFontFamily()
        }}
          onLongPress={() => setEditMode(true)}>{text}</Text></View>
      <View style={styles.container}>
        <SelectDropdown
          defaultButtonText={"background"}
          rowTextForSelection={(selectedItem, index) => { return selectedItem.nome }}
          data={colours}
          onSelect={(selectedItem) => { setBackground(selectedItem.codice) }}
          buttonTextAfterSelection={(selectedItem, index) => { return "bgcol: " + selectedItem.nome }} />
        <SelectDropdown
          defaultButtonText={"fontCol"}
          rowTextForSelection={(selectedItem, index) => { return selectedItem.nome }}
          data={colours}
          onSelect={(selectedItem) => { setFontcol(selectedItem.codice) }}
          buttonTextAfterSelection={(selectedItem, index) => { return "fcol: " + selectedItem.nome }} />
        <SelectDropdown
          defaultButtonText={"fontSize"}
          data={size}
          onSelect={(selectedItem, index) => { setFontsize(index) }}
          buttonTextAfterSelection={(selectedItem, index) => { return "fsize: " + selectedItem }} />
        < SelectDropdown
          defaultButtonText={"fontType"}
          data={family}
          onSelect={(selectedItem, index) => { setFonttype(index) }}
          buttonTextAfterSelection={(selectedItem, index) => { return "ftype: " + selectedItem }} />
        <SelectDropdown
          defaultButtonText={"halign"}
          data={hpos}
          onSelect={(selectedItem, index) => { setHalingn(index) }}
          buttonTextAfterSelection={(selectedItem, index) => { return "halign: " + selectedItem }} />
        <SelectDropdown
          defaultButtonText={"valign"}
          data={vpos}
          onSelect={(selectedItem, index) => { setValign(index) }}
          buttonTextAfterSelection={(selectedItem, index) => { return "valign: " + selectedItem }} />
      </View>
      <View style={styles.container}>
        <View style={{justifyContent: 'center', padding:8}}><Text style={{ fontSize: 16, fontWeight: '500' }}>Invia posizione</Text></View>
        <View ><Switch
          onValueChange={() => setIsEnabled(prev => !prev)}
          value={isEnabled}
          thumbColor={isEnabled ? '#ff5c69' : '#f5f5f5'}
          trackColor={{true : '#ffc0cb', false : '#c0c0c0'}}
          />
          </View>
      </View>
      <View>
        {createSendingButton()}
      </View>


    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: "wrap",
  },
  button: {
    alignItems: "center",
    backgroundColor: "#ff5c69",
    padding: 6
  },
  buttonText: {
    fontSize: 22,
    padding: 2
  },
})

export default CreaTwok;