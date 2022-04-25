import Utils from '../app/Utils';

import { appConfig as congfig } from '../app/ConfigJeePlatform';
import { appConfig } from '../app/Config'
const domain = congfig.domainJeeHR

const LEAVE = 'API/attendancedata/'
const CONTROL = 'api/controllergeneral/'

//http://apitest.jeehr.com/API/controllergeneral/GetListJuniorEmployeeByManager

async function getDSDuLieuChamCong(filter_vals = '01/01/2019|23/11/2020|0|', page = 1, record = 10, filter_keys = 'TuNgay|DenNgay|MaNV') {
    let res = await Utils.get_api(LEAVE + 'Get_DuLieuChamCong?query.filter.keys=' + filter_keys +
        '&query.filter.vals=' + filter_vals +
        '&query.page=' + page + '&query.record=' + record);
    return res;
}

async function getDuLieuTongHop(filter_vals, page = 1, record = 10, filter_keys = 'Ngay') {
    // let res = await Utils.get_api(LEAVE + 'getDuLieuTongHop?query.filter.keys=' + filter_keys +
    //     '&query.filter.vals=' + filter_vals +
    //     '&query.page=' + page + '&query.record=' + record);

    let url = LEAVE + 'getDuLieuTongHop?query.filter.keys=' + filter_keys + '&query.filter.vals=' + filter_vals + '&query.page=' + page + '&query.record=' + record
    let res = await Utils.CallAPI(domain + url, 'GET');
    return res
}
async function getListJuniorEmployeeByManager() {
    let value = `${CONTROL}GetListJuniorEmployeeByManager`
    let res = await Utils.get_api(value);
    res = Utils.handleResponse(res);
    return res;
}

async function getListJuniorEmployeeByManager_PT(page = 1, search = '', TinhTrang = '', record = 10) {
    let value = `${CONTROL}GetListJuniorEmployeeByManager_PT?query.more=false&query.page=${page}
    &query.record=${record}&query.filter.keys=HoTen${TinhTrang == '' ? '' : '|TinhTrang'}&query.filter.vals=${search}${(TinhTrang == "" && search != "" ? "" : "|") + TinhTrang}`
    let res = await Utils.CallAPI(domain + value, 'GET');
    res = Utils.handleResponse(res);
    return res;
}

async function getAddressGG(latlong = '') {
    let url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latlong}&key=` + appConfig.apiKeyGoogle
    // Utils.nlog('getAddress', url);
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
        return res;
    }
    catch (error) {
        Utils.nlog('[API]Lỗi error:', error);
        return -1;
    }
}

async function updateStatusFaceID(IdNV, isDangKy = true) {
    let value = `${CONTROL}updateStatusFaceID?id=${IdNV}&value=${isDangKy}`
    let res = await Utils.CallAPI(domain + value, "GET");
    res = Utils.handleResponse(res);
    return res;
}

async function updateStatusFaceID_EM(isDangKy = true) {
    let value = `${CONTROL}updateStatusFaceID_EM?value=${isDangKy}`
    let res = await Utils.CallAPI(domain + value, "GET");
    res = Utils.handleResponse(res);
    return res;
}

export {
    getDSDuLieuChamCong, getListJuniorEmployeeByManager, updateStatusFaceID,
    updateStatusFaceID_EM, getListJuniorEmployeeByManager_PT, getAddressGG, getDuLieuTongHop
}
