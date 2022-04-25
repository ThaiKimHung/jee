import Utils from '../app/Utils';
import { nGlobalKeys } from '../app/keys/globalKey';
import { appConfig } from '../app/Config';
import { nkey } from '../app/keys/keyStore'
const LEAVE = 'api/leave/'
const CONTROL = 'api/controllergeneral/'


async function getDSNghiPhep(filter_vals = '|1', page = 1, record = 10, filter_keys = 'ID_TinhTrang|ID') {
    let res = await Utils.CallAPI(appConfig.domain + LEAVE + 'Get_DSNghiPhepApp?query.filter.keys=' + filter_keys +
        '&query.filter.vals=' + filter_vals +
        '&query.page=' + page + '&query.record=' + record + `&sortOrder=desc&sortField=ngaygui`, 'GET');
    return res;
}



//Utils.setGlobal(nGlobalKeys.Id_nv, data.Id);

async function getDSHanMuc(filter_vals = '2019', page = 1, record = 10, filter_keys = 'ID_NV|Nam',) {
    const id_nv = await Utils.ngetStorage(nkey.Id_nv)
    let res = await Utils.CallAPI(appConfig.domain + LEAVE + 'Get_DSHanMucPhep?query.filter.keys=' + filter_keys +
        '&query.filter.vals=' + id_nv + "|" + filter_vals +
        '&query.page=' + page + '&query.record=' + record, 'GET');
    return res;
}
async function getListNam() {
    let res = await Utils.get_api(CONTROL + 'GetListYearByEmp?id_nv=' + Utils.getGlobal(nGlobalKeys.Id_nv, ''))
    return res;
}

async function getDSTypeLeave() {
    let res = await Utils.CallAPI(appConfig.domain + CONTROL + 'GetListTypeLeave_App', 'GET');
    return res;
}
async function PostGuiDon(NgayBatDau, NgayKetThuc, GioBatDau, GioKetThuc, ID_HinhThuc, GhiChu, HinhThuc) {
    let strBody = JSON.stringify({
        "NgayBatDau": NgayBatDau,
        "NgayKetThuc": NgayKetThuc,
        "GioBatDau": GioBatDau,
        "GioKetThuc": GioKetThuc,
        "ID_HinhThuc": ID_HinhThuc,
        "GhiChu": GhiChu,
        "HinhThuc": HinhThuc,
    })
    let res = await Utils.CallAPI(appConfig.domain + LEAVE + 'GuiDonXinPhep', 'POST', strBody, false, false);
    res = Utils.handleResponse(res);
    return res;
}

async function GuiDonXinPhep_CBCC(NgayBatDau, NgayKetThuc, BuoiNgayNghi, BuoiNgayVaoLam, ID_HinhThuc, GhiChu, HinhThuc, SoNgay, IsDuLich, DiaDiem) {
    let strBody = JSON.stringify({
        "NgayBatDau": NgayBatDau,
        "NgayKetThuc": NgayKetThuc,
        "ID_HinhThuc": ID_HinhThuc,
        "HinhThuc": HinhThuc,
        "GhiChu": GhiChu,
        "Buoi_NgayNghi": BuoiNgayNghi,
        "Buoi_NgayVaoLam": BuoiNgayVaoLam,
        "SoNgay": SoNgay,
        "IsNghiDiDuLich": IsDuLich,
        "DiaDiem": DiaDiem
    })
    let res = await Utils.post_api(LEAVE + 'GuiDonXinPhep_CBCC', strBody, false, false);
    res = Utils.handleResponse(res);
    return res;
}
async function PostSoNgay(NgayBatDau = '', NgayKetThuc = '', GioBatDau = '', GioKetThuc = '', ID_HinhThuc = '', HinhThuc = '', GhiChu = '') {
    let strBody = JSON.stringify({
        "NgayBatDau": NgayBatDau,
        "NgayKetThuc": NgayKetThuc,
        "GioBatDau": GioBatDau,
        "GioKetThuc": GioKetThuc,
        "ID_HinhThuc": ID_HinhThuc,
        "HinhThuc": HinhThuc,
        "GhiChu": GhiChu,
    })
    Utils.nlog("gia tri body", strBody)
    let res = await Utils.CallAPI(appConfig.domain + LEAVE + 'Get_SoNgay', 'POST', strBody, false, false);
    res = Utils.handleResponse(res);
    return res;
}
// api get số ngày phép của CBCC 
async function Get_SoNgay_CBCC(NgayBatDau = '', NgayKetThuc = '', BuoiNgayNghi = '', BuoiNgayVaoLam = '', ID_HinhThuc = '', HinhThuc = '', GhiChu = '', IsNghiDiDuLich, DiaDiem) {
    let strBody = JSON.stringify({
        "NgayBatDau": NgayBatDau,
        "NgayKetThuc": NgayKetThuc,
        "ID_HinhThuc": ID_HinhThuc,
        "HinhThuc": HinhThuc,
        "GhiChu": GhiChu,
        "Buoi_NgayNghi": BuoiNgayNghi,
        "Buoi_NgayVaoLam": BuoiNgayVaoLam,
        "IsNghiDiDuLich": IsNghiDiDuLich,
        "DiaDiem": DiaDiem
    })
    let res = await Utils.post_api(LEAVE + 'Get_SoNgay_CBCC', strBody, false, false);
    res = Utils.handleResponse(res);
    return res;
}
async function getHuyDonPhep(id = '') {
    let value = `HuyDonXinPhep?id=${id}`
    let res = await Utils.CallAPI(appConfig.domain + LEAVE + value, 'GET')
    return res;
}

export {
    getDSNghiPhep, getDSHanMuc, getListNam, getDSTypeLeave, PostGuiDon, PostSoNgay, getHuyDonPhep, Get_SoNgay_CBCC, GuiDonXinPhep_CBCC
}
