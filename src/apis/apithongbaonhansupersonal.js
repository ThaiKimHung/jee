import Utils from "../app/Utils";
import { appConfig as appConfigDomain } from "../../src/app/ConfigJeePlatform";
const domainJeeHR = appConfigDomain.domainJeeHR
const apithongbaonhansu = 'api/thongbaonhansupersonal/'

async function GetThongBao(IDType = '', id = 0) {
    let res = await Utils.CallAPI(domainJeeHR + apithongbaonhansu + `GetThongBao?loai=${IDType}&id=` + id, "GET");
    return res;

}

export {
    GetThongBao
}