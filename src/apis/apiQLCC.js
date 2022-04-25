import Utils from '../app/Utils';

const diadiemchamcong = 'api/diadiemchamcong/'

const chamcongwifi = 'api/chamcongwifi/'
const apiNhanVien = 'api/controllergeneral/';
import _ from "lodash";
import { appConfig as appConfigJee } from "../../src/app/Config";
import { appConfig as config } from "../../src/app/ConfigJeePlatform";
const domainJeeHR = config.domainJeeHR

/*
controllergeneral/Get_DSNhanVien - api danh sách nhân viên có quyền

diadiemchamcong/Get_DSDiaDiamChamCong - api danh sách địa điểm chấm công

diadiemchamcong/Update_DiaDiamChamCong - api cập nhật địa điểm chấm công

diadiemchamcong/Delete_DiaDiamChamCong - api xóa dữ liệu chấm công

diadiemchamcong/Add_NhanVien - api thêm nhân viên vào địa điểm chấm công


diadiemchamcong/Delete_NhanVien - api xóa nhân viên khỏi địa điểm chấm công

diadiemchamcong/updateStatus - api cập nhật tình trạng nhân viên địa điểm chấm công

chamcongwifi/Get_DSThietBiWiFi - api danh sách địa chỉ wifi
chamcongwifi/Update_ThietBiWiFi - api cập nhật địa chỉ wifi
chamcongwifi/Delete_DiaDiamChamCong - api xóa địa chỉ wifi
chamcongwifi/Add_NhanVien - api thêm nhân viên áp dụng chấm công wifi
chamcongwifi/Delete_NhanVien - api xóa nhân viên áp dụng chấm công wifi
*/

/////// VỊ TRÍ VỊ TRÍ VỊ TRÍ VỊ TRÍ  //////////////////


async function Get_DSDiaDiamChamCong() {
    let res = await Utils.CallAPI(domainJeeHR + diadiemchamcong + 'Get_DSDiaDiamChamCong', "GET");
    return res;
}

async function Get_DSNhanVienViTri(nhanvien, diaDiem, TinhTrangID = -1) {
    let filter_keys = `DiaDiemID|keyword${TinhTrangID == -1 ? '' : "|TinhTrangID"}`
    let res = await Utils.CallAPI(domainJeeHR + diadiemchamcong + `Get_DSNhanVien?query.more=true&query.filter.keys=${filter_keys}&query.filter.vals=${diaDiem}|${nhanvien}${TinhTrangID == -1 ? "" : "|" + TinhTrangID}`, "GET");
    return res;
}

async function Add_ViTri(body) {
    let strBody = JSON.stringify(body)
    let res = await Utils.CallAPI(domainJeeHR + diadiemchamcong + `Update_DiaDiamChamCong`, "POST", strBody);
    return res
}
async function Delete_ViTri(id) {
    //JeeHR là Post
    let res = await Utils.CallAPI(domainJeeHR + diadiemchamcong + `Delete_DiaDiamChamCong?id=${id}`, "GET");
    return res
}
async function Delete_NhanVienViTri(id) {
    let res = await Utils.CallAPI(domainJeeHR + diadiemchamcong + `Delete_NhanVien?id=${id}`, "GET");
    return res
}
async function Add_NhanVienViTri(IDNV, RowID, _TuNgay, TenDiaDiem) {
    let body = {
        "NVID": IDNV,
        "DiaDiemID": RowID,
        "TuNgay": _TuNgay,
        "TenDiaDiem": TenDiaDiem

    }
    let strBody = JSON.stringify(body)
    let res = await Utils.CallAPI(domainJeeHR + diadiemchamcong + 'Add_NhanVien', "POST", strBody);
    return res
}

async function UpdateStatusNV(id, tinhtrangid, sdate) {
    //JeeHR là post
    if (tinhtrangid == 1) {
        sdate = null
    }
    let res = await Utils.CallAPI(domainJeeHR + diadiemchamcong + `updateStatus?id=${id}&tinhtrangid=${tinhtrangid}&sdate=${sdate}`, "GET");
    return res
}




/////// WIFI WIFI WIFI WIFI WIFI WIFI //////////////////

async function Get_DSNhanVienWifi(nhanvien) {
    let searchNhanVien = nhanvien != '' ? `&query.filter.keys=keyword&query.filter.vals=${nhanvien}` : ''
    let res = await Utils.CallAPI(domainJeeHR + chamcongwifi + `Get_DSNhanVien?query.more=true` + searchNhanVien, "GET");
    return res;
}

async function Add_NhanVien(IDNV) {
    let body = {
        "NVID": IDNV
    }
    let strBody = JSON.stringify(body)
    let res = await Utils.CallAPI(domainJeeHR + chamcongwifi + 'Add_NhanVien', "POST", strBody);
    return res
}

async function Get_DSNhanVienMinus(ListIDNhanVien) {
    let res = await Utils.CallAPI(domainJeeHR + apiNhanVien + `Get_DSNhanVien?query.more=true&query.filter.keys=ID_NhanVien&query.filter.vals=${ListIDNhanVien}`, "GET")
    return res
}
async function Get_DSNhanVienMinusTmp() {
    let res = await Utils.CallAPI(domainJeeHR + apiNhanVien + `Get_DSNhanVien?query.more=true`, "GET")
    return res
}
async function Get_DSThietBiWiFi() {
    let res = await Utils.CallAPI(domainJeeHR + chamcongwifi + `Get_DSThietBiWiFi?query.more=true`, "GET");
    return res
}

async function Get_DSListDiaDiem() {
    let res = await Utils.CallAPI(domainJeeHR + apiNhanVien + `GetListWorkplaceByBranch?id_dv=0`, "GET");
    return res
}

async function Add_Wifi(body) {
    let strBody = JSON.stringify(body)
    let res = await Utils.CallAPI(domainJeeHR + chamcongwifi + `Update_ThietBiWiFi`, "POST", strBody);
    return res
}


async function Delete_Wifi(id) {
    let res = await Utils.CallAPI(domainJeeHR + chamcongwifi + `Delete_ThietBiWiFi?id=${id}`, "POST");
    return res
}

async function Delete_NhanVienWifi(id) {
    let res = await Utils.CallAPI(domainJeeHR + chamcongwifi + `Delete_NhanVien?id=${id}`, "GET");
    return res
}


async function getAddressGG(latitude = '', longitude = '') {
    // let lat = `lat=${latitude}`; //API cũ Free: 5k request/day
    // let lon = `lon=${longitude}`;
    // let url = `https://us1.locationiq.com/v1/reverse.php?key=0ffe3daba9bd24&${lat}&${lon}&format=json`

    let url = 'https://maps.googleapis.com/maps/api/geocode/json?';

    let param = `latlng=${latitude},${longitude}&key=${appConfigJee.apiKeyGoogle}`
    url = url + param;
    try {
        const response = await fetch(url,
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
        const res = await response.json();
        if (res.ExceptionMessage != undefined) { // edit tuỳ từng object api
            Utils.nlog('[API]Lỗi API:', res);
            return -3;
        }
        Utils.nlog('getAddressGG', res, url);
        return res;
    }
    catch (error) {
        Utils.nlog('[API]Lỗi error:', error);
        return -1;
    }
    //----
}

async function GetDSTinhTrangChamCongDD(langcode = "vi") {
    let params = apiNhanVien + `GetDSTinhTrangChamCongDD?langcode=${langcode}`
    let res = await Utils.CallAPI(domainJeeHR + params, 'GET');
    Utils.nlog("DANH SACH:", res)
    return res;
}


export {
    Get_DSDiaDiamChamCong, Get_DSNhanVienWifi, Get_DSNhanVienMinus, Get_DSThietBiWiFi, Get_DSListDiaDiem, Add_Wifi, Add_NhanVienViTri,
    Delete_Wifi, Delete_NhanVienWifi, Add_NhanVien, Get_DSNhanVienViTri, getAddressGG, Delete_ViTri,
    Add_ViTri, Delete_NhanVienViTri, Get_DSNhanVienMinusTmp, UpdateStatusNV, GetDSTinhTrangChamCongDD
}
