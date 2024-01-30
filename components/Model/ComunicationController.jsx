import { Alert } from "react-native";


export default class CommunicationController {
    static BASE_URL = "https://develop.ewlab.di.unimi.it/mc/twittok/"
    static async serverReq(endpoint, parameters) {
        const url = this.BASE_URL + endpoint;
/*         console.log("sending request to: " + url);
        console.log("with theese parameters: " + JSON.stringify(parameters)) */
        let httpResponse = await fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(parameters)
        });
        const status = httpResponse.status;
        try {
            let deserializedObject = await httpResponse.json();
            return deserializedObject;
        } catch(err) {
            console.log(status + " An error occurred")
            Alert.alert("errore di rete\nRiprovare più tardi")
        }
    }
}