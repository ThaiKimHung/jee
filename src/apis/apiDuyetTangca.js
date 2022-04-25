import Utils from '../app/Utils';

const LEAVE = 'API/otapproval/'
const CONTROL = 'api/controllergeneral/'
//http://apitest.jeehr.com/API/controllergeneral/GetListJuniorEmployeeByManager
import { appConfig } from "../../src/app/ConfigJeePlatform";
const domainJeeHR = appConfig.domainJeeHR

async function getDSDuyetTangCa(filter_vals = '01/01/2019|23/11/2020', page = 1, record = 10, filter_keys = 'TuNgay|DenNgay|ID_TinhTrang|ID') {
    let res = await Utils.CallAPI(domainJeeHR + LEAVE + 'Get_DSDuyetTangCa?query.filter.keys=' + filter_keys +
        '&query.filter.vals=' + filter_vals +
        '&query.page=' + page + '&query.record=' + record + '&sortOrder=asc' + '&sortField=ngaytangca', "GET");
    return res;
}
async function Get_DSTongHopTangCa(filter_vals = '01/01/2019|23/11/2020', page = 1, record = 10, filter_keys = 'ID_NV|TuNgay|DenNgay|ID_TinhTrang') {
    let res = await Utils.CallAPI(domainJeeHR + LEAVE + 'Get_DSTongHopTangCaApp?query.filter.keys=' + filter_keys +
        '&query.filter.vals=' + filter_vals + "|" +
        '&query.page=' + page + '&query.record=' + record, "GET");
    return res;
}
async function getChiTietDuyetTangCa(ID) {
    let res = await Utils.CallAPI(domainJeeHR + LEAVE + 'Get_ChiTietDuyetTangCa?ID=' + ID, "GET");
    return res;
}
async function GetListJuniorEmployeeByManager() {
    let res = await Utils.CallAPI(domainJeeHR + CONTROL + `GetListJuniorEmployeeByManager`, "GET");
    return res;
}

async function PostGuiDuyetTangCa(ID, IsAccept, HinhThucChiTra = 0, GhiChu) {

    let strBody = JSON.stringify({
        "ID": ID,
        "IsAccept": IsAccept,
        "HinhThucChiTra": HinhThucChiTra,
        "GhiChu": GhiChu
    })
    let res = await Utils.CallAPI(domainJeeHR + LEAVE + 'DuyetTangCa', "POST", strBody);
    res = Utils.handleResponse(res);
    return res;
}

async function getDSTypeLeave() {
    let res = await Utils.CallAPI(domainJeeHR + CONTROL + 'GetListTypeLeave_App', "GET");
    return res;
}

//https://jeehr-api.jee.vn/api/otapproval/Get_ChiTietDuyetTangCa?ID=62 chi tiết tăng ca
async function Get_ChiTietDuyetTangCa(id) {
    let res = await Utils.CallAPI(domainJeeHR + LEAVE + `Get_ChiTietDuyetTangCa?ID=${id}`, "GET");
    return res;
}
export {
    getDSDuyetTangCa, getDSTypeLeave, getChiTietDuyetTangCa, GetListJuniorEmployeeByManager, Get_DSTongHopTangCa, PostGuiDuyetTangCa, Get_ChiTietDuyetTangCa
}
