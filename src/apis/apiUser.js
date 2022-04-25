import Utils from "../app/Utils";
import { nkey } from "../app/keys/keyStore";
import { appConfig } from "../app/ConfigJeePlatform";
const domain = appConfig.domainJeeHR
const domainJeeAccount = appConfig.domainJeeAccount
const apiUser = 'api/user/'
const apiChangePass = 'api/password/'
const apiControllergeneral = 'api/controllergeneral/'
const apiDiemDanh = 'api/checkinout/'
const apiChangePassword = 'api/accountmanagement/changePassword'


async function LoginJeeHR(Username = '', Password = '') {
    let strBody = JSON.stringify({
        "Username": Username,
        "Password": Password
    })
    let res = await Utils.CallAPI(domain + apiUser + 'Login', "POST", strBody, false, false);
    return res;
}


async function JeePlatform(Username = '', Password = '') {
    let strBody = JSON.stringify({
        "Username": Username,
        "Password": Password
    })
    let res = await Utils.CallAPI(domain + apiUser + 'Login', "POST", strBody, false, false);
    return res;
}

async function CheckLocation(stLocation = '', IdNV = 0) {
    let strBody = JSON.stringify({
        "Address": stLocation,
        "IdNV": IdNV
    })
    let res = await Utils.CallAPI(domain + apiDiemDanh + 'CheckLocation', "POST", strBody, false, false);
    return res;
}

async function CheckInOut_Location(stBase64 = '', stLocation = '') {
    let strBody = JSON.stringify({
        "Image": stBase64,
        "Address": stLocation,
    })
    let res = await Utils.CallAPI(domain + apiDiemDanh + 'CheckInOut_Location', "POST", strBody, false, true);
    return res;
}

async function CheckInOut_LocationCCNV(stBase64 = '', stLocation = '', IdNV = 0) {
    let strBody = JSON.stringify({
        "Image": stBase64,
        "Address": stLocation,
        "IdNV": IdNV
    })
    let res = await Utils.CallAPI(domain + apiDiemDanh + 'CheckInOut_LocationCCNV', "POST", strBody, false, true);
    return res;
}

async function CheckInOut_LocationMCC(stBase64 = '', stLocation = '', IdNV = 0) {
    let strBody = JSON.stringify({
        "Image": stBase64,
        "Address": stLocation,
        "IdNV": IdNV
    })
    let res = await Utils.CallAPI(domain + apiDiemDanh + 'CheckInOut_LocationMCC', "POST", strBody, false, true);
    return res;
}

async function CheckInOutDetect(stBase64 = '', stLocation = '', IdNV, AddressName, DateTime, checksum, istimekeeper) {
    //istimekeeper: true - máy chấm công, false - chấm công user, nv
    //checksum chuỗi mã hoá md5
    let convert_md5 = require("crypto-js/md5")
    console.log("convert_md5(checksum):", checksum, convert_md5(checksum).toString())
    let strBody = JSON.stringify({
        "Image": stBase64,
        "Address": stLocation,
        "IdNV": IdNV,
        "AddressName": AddressName,
        "DateTime": DateTime,
        "checksum": convert_md5(checksum).toString(),
        "istimekeeper": istimekeeper
    })
    // console.log("BODY:", strBody)
    let res = await Utils.CallAPI(domain + 'api/checkinout/location', "POST", strBody, false, false);
    // console.log("RESSSSS:", res, DateTime)
    return res;
}

async function LogoutJeeHR() {
    let res = await Utils.CallAPI(domain + apiUser + 'LogOut', 'GET');
    return res;
}

async function ChangePasswordJeeHR(Id = '', OldPassword = '', NewPassword = '', RePassword = '') {
    let strBody = JSON.stringify({
        "Id": Id,
        "OldPassword": OldPassword,
        "NewPassword": NewPassword,
        "RePassword": RePassword,
        "Logout": true,
    })
    let res = await Utils.CallAPI(domain + apiChangePass + 'ChangePassword', 'POST', strBody, false, true);
    return res;
}
async function ChangePassword(Username = '', OldPassword = '', NewPassword = '') {
    let strBody = JSON.stringify({
        "Username": Username,
        "PasswordOld": OldPassword,
        "PaswordNew": NewPassword
    })
    let res = await Utils.CallAPI(domainJeeAccount + apiChangePassword, 'POST', strBody, true);
    return res;
}
async function UpdateDeviceToken(platform = '', token = '', status = 1, isturnon = true, IsLogout = false) {
    let strBody = JSON.stringify({
        "name": platform,
        "token": token,
        "status": status,
        "isturnon": isturnon,
        "IsLogout": IsLogout
    })
    let res = await Utils.CallAPI(domain + apiControllergeneral + 'UpdateDeviceToken', "POST", strBody, false, true);
    return res;
}
async function GetListCaLamViec() {
    let res = await Utils.CallAPI(domain + apiControllergeneral + 'GetListCaLamViec', 'GET');
    return res;
}
async function GetListChamCongInWifi() {
    let res = await Utils.CallAPI(domain + apiDiemDanh + 'Get_DSChamCongWifi?query.more=true', 'GET', false, false)
    return res
}

async function checkInOutWifi(Address = '') {
    let devicetoken = await Utils.ngetStorage(nkey.userId_OneSignal, '');
    let strBody = JSON.stringify({
        "Address": Address,
        "devicetoken": devicetoken,
    })
    let res = await Utils.CallAPI(domain + apiDiemDanh + 'checkInOutWifi', 'POST', strBody);
    return res;
}
//http://192.168.1.62:8001/api/checkinout/getAutoTimekeeping

async function getAutoTimekeeping() {

    let res = await Utils.CallAPI(domain + apiDiemDanh + 'getAutoTimekeeping', 'GET', false, false);
    return res;
}
//api/checkinout/updateAutoTimekeeping?isauto={isauto}
async function updateAutoTimekeeping(isauto = false) {
    let res = await Utils.CallAPI(domain + apiDiemDanh + `updateAutoTimekeeping?isauto=${isauto}`, '', false, false);
    return res;
}
// checkinout/updateDeviceToken

// checkinout / getAutoTimekeeping
async function updateDeviceToken(devicetoken = '') {
    let res = await Utils.CallAPI(domain + apiDiemDanh + 'updateDeviceToken?devicetoken=' + devicetoken, 'GET', false, false);
    return res;
}

async function WriteLog(content = '') {
    let strBody = JSON.stringify({
        "content": content
    })
    let res = await Utils.CallAPI(domain + apiDiemDanh + 'WriteLog', "POST", strBody);
    return res;
}

export {
    LoginJeeHR, LogoutJeeHR, ChangePasswordJeeHR, UpdateDeviceToken, GetListChamCongInWifi,
    CheckInOut_Location, GetListCaLamViec, checkInOutWifi, getAutoTimekeeping, updateAutoTimekeeping,
    CheckInOut_LocationCCNV, CheckInOut_LocationMCC, updateDeviceToken, CheckLocation, WriteLog, ChangePassword, CheckInOutDetect
}