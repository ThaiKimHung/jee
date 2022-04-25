import { Platform } from 'react-native';
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import Utils from '../app/Utils';
const PLATFROM_STORAGE_PERMISSION = {
    ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
    android: PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
};

const REQUEST_PERMISSION_TYPE = {
    storage: PLATFROM_STORAGE_PERMISSION
}

const PERMISSION_TYPE = {
    storage: 'storage'
};

class AppPermission {
    checkPermissions = async (type) => {
        Utils.nlog('AppPermission Type', type)

        const permissions = REQUEST_PERMISSION_TYPE[type][Platform.OS]
        Utils.nlog('permissions', permissions)

        if (!permissions) {
            return true;
        };
        try {
            const result = await check(permissions)
            Utils.nlog('result', result)
            if (result === RESULTS.GRANTED) return true;
            return this.requestPermission(permissions)// request permission
        } catch (error) {
            return false
        };
    };
    requestPermission = async (permissions) => {
        try {
            const result = await request(permissions)
            Utils.nlog('requestPermission', result)
            return result === RESULTS.GRANTED;
        } catch (error) {
            return false;
        };
    };
}
const Permission = new AppPermission()
export {
    Permission,
    PERMISSION_TYPE,
    REQUEST_PERMISSION_TYPE
}

/// use  const checkPermis = await Permission.checkPermissions(PERMISSION_TYPE.location);