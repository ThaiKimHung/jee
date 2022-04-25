import Utils from "../app/Utils";


const apiNhanVien = 'api/controllergeneral/';
const apiThemNhanVien = 'api/searchemployee/'
import { appConfig } from "../../src/app/ConfigJeePlatform";
const domainJeeHR = appConfig.domainJeeHR

async function getQuyen() {
    let res = await Utils.CallAPI(domainJeeHR + apiNhanVien + 'CheckRole_ThemNhanVien', "GET")
    return res;
}


async function getNhanVien(nhanvien) {
    let searchNhanVien = nhanvien != '' ? `&query.filter.keys=keyword&query.filter.vals=` + nhanvien : ''
    let res = await Utils.CallAPI(domainJeeHR + apiNhanVien + `Get_DSNhanVien?query.more=true` + searchNhanVien, "GET")
    return res;
}

async function getNoiSinh() {
    let res = await Utils.CallAPI(domainJeeHR + apiNhanVien + 'GetListProvinces', "GET")
    return res;
}

async function getLoaiNhanVien() {
    let res = await Utils.CallAPI(domainJeeHR + apiNhanVien + 'GetListStaffType', "GET")
    return res;

}

async function getCoCau() {
    let res = await Utils.CallAPI(domainJeeHR + apiNhanVien + 'Get_CoCauToChuc_HR', "GET")
    return res;

}

async function getChucVu(RowID) {
    let res = await Utils.CallAPI(domainJeeHR + apiNhanVien + 'GetListJobtitleByStructure?id_cv=0&&structureid=' + RowID, "GET")
    return res;

}

async function AddNhanVien(body = {}) {
    let strBody = JSON.stringify(body)
    let res = await Utils.CallAPI(domainJeeHR + apiThemNhanVien + 'Insert_NhanVien_Nhanh', "POST", strBody);
    return res;

}

async function GenderCodeNhanVien(body) {
    let strBody = JSON.stringify(body)
    let res = await Utils.CallAPI(domainJeeHR + apiNhanVien + 'CreateCode', "POST", strBody)

    return res
}




export {
    getNhanVien, getNoiSinh, getLoaiNhanVien, getCoCau, getChucVu, AddNhanVien, GenderCodeNhanVien, getQuyen
}