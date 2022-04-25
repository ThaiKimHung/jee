import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Platform } from 'react-native'
import Utils from './src/app/Utils';

const PER_LOCATION = {
    android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    ios: PERMISSIONS.IOS.LOCATION_ALWAYS
}
const REQUEST_PERMISSION_TYPE = {
    location: PER_LOCATION
}
const PERMISSION_TYPE = {
    location: 'location'
}
class AppPermission {
    checkPermisstion = async (type): Promise<boolean> => {
        // Utils.nlog("vao 111 Permission")
        const permission = REQUEST_PERMISSION_TYPE[type][Platform.OS]
        if (!permission) {
            Utils.nlog("vao khac Permission")
            return true
        }
        try {
            const result = await check(permission)
            if (result == RESULTS.GRANTED) {
                Utils.nlog(" Permission GRANTED")
                return true
            }
            if (result == RESULTS.BLOCKED) {
                return true
            }
            else {
                // Utils.nlog("vao kt Permission")
                return this.requestPermission(permission);
            }
        } catch (error) {
            return false
        }
    }
    requestPermission = async (permission): Promise<boolean> => {
        try {
            const result = await request(permission)
            return result === RESULTS.GRANTED
        } catch (error) {
            return false
        }
    }
}
const Permission = new AppPermission();
export { Permission, PERMISSION_TYPE }