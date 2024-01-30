import * as Location from 'expo-location';

export default class LocationController {
    static async locationPermissionAsync() {
        let canUseLocation = false;
        const grantedPermission = await Location.getForegroundPermissionsAsync()
        if (grantedPermission.status === "granted") {
            canUseLocation = true;
        } else {
            const permissionResponse = await Location.requestForegroundPermissionsAsync()
            if (permissionResponse.status === "granted") {
                canUseLocation = true;
            }
        }
        if (canUseLocation) {
            const location = await Location.getCurrentPositionAsync()
            console.log("received location:", location);
            return location;
           }
           else {
            console.log("Utente non ha dato permessi")
            return null 
           }
    }
}