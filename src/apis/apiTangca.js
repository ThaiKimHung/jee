import { appConfig } from '../app/Config';
import Utils from '../app/Utils';

const OVER = 'api/overtimeregister/'
const DASHBOARD = 'API/dashboard/'


async function getDSTangca(page = 1, record = 10) {
    let res = await Utils.CallAPI(appConfig.domain + OVER + 'Get_DSDangKyTangCaApp?query.page=' + page + '&query.record=' + record, 'GET');
    return res;
}
async function getHuyTangCa(id = '') {
    let res = await Utils.CallAPI(appConfig.domain + OVER + 'HuyTangCa?id=' + id, 'GET')
    return res;
}
async function getNgDuyet() {
    let res = await Utils.CallAPI(appConfig.domain + OVER + `Get_TenNguoiDuyet`, 'GET')
    return res;
}
async function SoNgayTangCa(NgayTangCa = '', GioBatDau = '', GioKetThuc = '', OverTime = '') {
    let strBody = JSON.stringify({
        "NgayTangCa": NgayTangCa,
        "OverTime": OverTime,
        "GioBatDau": GioBatDau,
        "GioKetThuc": GioKetThuc,
    })
    let res = await Utils.CallAPI(appConfig.domain + OVER + 'Get_SoGio', 'POST', strBody, false, false);
    res = Utils.handleResponse(res);
    return res;
}
async function Guitangca(NgayTangCa = '', GioBatDau = '', GioKetThuc = '', SoGio = '', OverTime = '', outTimeChecked = false, LyDo = '') {
    let strBody = JSON.stringify({
        "NgayTangCa": NgayTangCa,
        "OverTime": OverTime,
        "GioBatDau": GioBatDau,
        "GioKetThuc": GioKetThuc,
        "LyDo": LyDo,
        "SoGio": SoGio,
        "IsFixHours": outTimeChecked
    })
    let res = await Utils.CallAPI_StatusDefault(appConfig.domain + OVER + 'GuiTangCa', 'POST', strBody, false, true);
    res = Utils.handleResponse(res);
    return res;
}
//nGlobalKeys
async function Get_ThoiGian(tungay, denngay) {
    let value = `tungay=${tungay}&denngay=${denngay}`
    let res = await Utils.CallAPI(appConfig.domain + DASHBOARD + 'Get_ThoiGian?' + value, 'GET')
    return res;
}
export {
    getDSTangca, getNgDuyet, SoNgayTangCa, Guitangca, getHuyTangCa, Get_ThoiGian
}
