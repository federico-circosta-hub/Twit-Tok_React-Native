import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Storage {

  static async checkFirstRun() {
    let firstrun = false
    const SID = await AsyncStorage.getItem("SID")
    if (SID != null && SID.length == 20) {
      console.log("Second run");
    } else {
      console.log("first run");
      firstrun = true
    }
    return firstrun
  }

  static async getSID() {
    const SID = await AsyncStorage.getItem("SID")
    return SID
  }

  static async storeSID(s) {
    const SID = await AsyncStorage.getItem("SID")
    if (SID == s) {
      console.log("already logged");
      return false
    } else {
      console.log("sid salvato in precedenza " +SID)
      console.log("sid che voglio salvare "+s)
      console.log("almost logged");
      await AsyncStorage.setItem("SID", s);
      return true
    }
  }
}