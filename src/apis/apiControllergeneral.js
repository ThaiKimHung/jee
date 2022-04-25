import { appConfig } from "../app/Config";
import { nkey } from "../app/keys/keyStore";
import Utils from "../app/Utils";
import { appConfig as appConfigDomain } from "../../src/app/ConfigJeePlatform";
const domainJeeHR = appConfigDomain.domainJeeHR
const apiControllergeneral = 'api/controllergeneral/'

async function CheckToken() {
    // let token = await Utils.ngetStorage(nkey.token, '');
    // if (token == '') {
    //     return { status: 0 };
    // } else {
    let res = await Utils.CallAPI(domainJeeHR + apiControllergeneral + 'CheckToken?code=app', "GET");
    res = Utils.handleResponse(res);
    return res;
    // }

}
async function Get_ThoigianTinhCong() {
    let res = await Utils.CallAPI(domainJeeHR + apiControllergeneral + 'Get_ThoiGianCKTinhCong', "GET");
    res = Utils.handleResponse(res);
    return res;
}
async function GetDanhSachNhanVienCapDuoi() {
    let res = await Utils.CallAPI(domainJeeHR + apiControllergeneral + 'GetListJuniorEmployeeByManager', "GET");
    res = Utils.handleResponse(res);
    return res;
}
// api/controllergeneral/GetListTypeNotify
async function GetListTypeNotify() {
    let res = await Utils.CallAPI(domainJeeHR + apiControllergeneral + 'GetListTypeNotify', "GET");
    res = Utils.handleResponse(res);
    return res;
}
//Get_ThoiGianCKTinhCong

//Get dropdow
async function GetListTypeApproval() {
    let res = await Utils.CallAPI(appConfig.domain + apiControllergeneral + 'GetListTypeApproval', 'GET', false, false);
    res = Utils.handleResponse(res);
    return res;
}

async function updateCheDoMCC(onoffMCC = true, pass = '') {
    let res = await Utils.CallAPI(domainJeeHR + apiControllergeneral + 'updateCheDoMCC?ison=' + onoffMCC + (pass == '' ? '' : '&pass=' + pass), "GET");
    res = Utils.handleResponse(res);
    return res;
}

async function getParametersConfig() {
    let res = await Utils.CallAPI(domainJeeHR + apiControllergeneral + 'getParametersConfig', "GET");
    res = Utils.handleResponse(res);
    return res;
}


export {
    CheckToken, Get_ThoigianTinhCong, GetDanhSachNhanVienCapDuoi, GetListTypeNotify, GetListTypeApproval,
    updateCheDoMCC, getParametersConfig
}