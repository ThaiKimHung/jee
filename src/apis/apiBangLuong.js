import Utils from "../app/Utils";
const payroll = 'api/p_payroll'
const DSBangLuong = 'api/controllergeneral'
//api/p_payroll/InPhieuLuong_App
import { appConfig } from "../../src/app/ConfigJeePlatform";
const domainJeeHR = appConfig.domainJeeHR
async function InPhieuLuong_App(Nam = '', Thang = '', ID) {
    let res = await Utils.CallAPI(domainJeeHR + payroll + `/InPhieuLuong?Thang=${Thang}&Nam=${Nam}&bangluongid=${ID}`, "GET");
    return res;
}

async function GetDSBangLuong(Nam = '', Thang = '') {
    let res = await Utils.CallAPI(domainJeeHR + DSBangLuong + '/getDSBangLuongPhieuLuong?nam=' + Nam +
        '&Thang=' + Thang, "GET");
    return res;
}

export {
    InPhieuLuong_App, GetDSBangLuong
}