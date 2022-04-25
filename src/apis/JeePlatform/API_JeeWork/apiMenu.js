import Utils from "../../../app/Utils";
import { appConfig } from '../../../app/ConfigJeePlatform'
import { nkey } from "../../../app/keys/keyStore";

const domainJeeGobal = appConfig.domainJeeGlobal
const apiChucNang = "api/chucnang/"
const apiMenu = "api/menu/"



async function Get_ChucNangByUser() {
    let res = await Utils.CallAPI(domainJeeGobal + apiChucNang + `Get_ChucNangByUser`, "GET", false, false, false);
    return res
}
async function Get_MenuThuongDung() {

    let res = await Utils.CallAPI(domainJeeGobal + apiChucNang + `Get_ChucNangThuongDung`, "GET", false, false, false);
    return res
}
async function LayMenuChucNang_MobileApp() {
    let res = await Utils.CallAPI(domainJeeGobal + apiMenu + `LayMenuChucNang_MobileApp`, "GET", false, false, false);
    return res
}
async function Update_ChucNangThuongDung(strbody) {
    let res = await Utils.CallAPI(domainJeeGobal + apiChucNang + `Update_ChucNangThuongDung`, "POST", strbody, false, false);
    return res
}
// https://jeeglobal-api.jee.vn/api/menu/LayMenuChucNang_MobileApp
// /api/chucnang/Update_ChucNangThuongDung
export {
    Get_ChucNangByUser, Get_MenuThuongDung, LayMenuChucNang_MobileApp, Update_ChucNangThuongDung
}
