import Utils from '../app/Utils';
import { nGlobalKeys } from '../app/keys/globalKey';
import { appConfig } from "../../src/app/ConfigJeePlatform";
import { nkey } from '../app/keys/keyStore';
const domainJeeHR = appConfig.domainJeeHR
const Search = 'api/infopersonal/'

async function Get_LyLich() {
    let t = await Utils.ngetStorage(nkey.Id_nv, '')
    let res = await Utils.CallAPI(domainJeeHR + Search + 'Get_LyLich_Nhanvien?id=' + t, "GET")
    return res;
}

async function Get_LyLichID(rowID) {
    let res = await Utils.CallAPI(domainJeeHR + Search + 'Get_LyLich_Nhanvien?id_nv=' + rowID, "GET")
    return res;
}

async function Get_RowLyLich() {
    let res = await Utils.CallAPI(domainJeeHR + Search + 'Get_Info_Display', "GET")
    return res;
}

async function Get_Info() {
    let res = await Utils.CallAPI(domainJeeHR + 'API/p_resign/GetInfo', "GET")
    return res;
}
export {
    Get_LyLich, Get_RowLyLich, Get_LyLichID, Get_Info
}
