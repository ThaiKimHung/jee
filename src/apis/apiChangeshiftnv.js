import { appConfig } from "../app/Config";
import Utils from "../app/Utils";
// https://api.jeehr.com/API/changeshiftnv/Send_ChangeShift
const apiChangeshiftnv = "api/changeshiftnv/";



async function Send_ChangeShift(Lydo = '', CaThayDoiList = []) {
    let strBody = JSON.stringify({
        "CaThayDoiList": CaThayDoiList,
        "LyDo": Lydo,
        "GhiChu": ""
    })
    let res = await Utils.CallAPI(appConfig.domain + apiChangeshiftnv + 'Send_ChangeShift', 'POST', strBody, false, false);
    return res;
}
//api.jeehr.com/API/changeshiftnv/Get_ChangeShiftList?sortOrder=&sortField=&page=1&record=10&filter.keys=ID_TinhTrang&filter.vals=-1
async function Get_ChangeShiftList(page = 1, record = 10, ID = '') {
    if (ID != '') {

        let res = await Utils.CallAPI(appConfig.domain + apiChangeshiftnv + 'Get_ChangeShiftList?query.filter.keys=ID' +
            '&query.filter.vals=' + ID +
            '&query.page=' + page + '&query.record=' + record, 'GET');
        return res;
    } else {
        let res = await Utils.CallAPI(appConfig.domain + apiChangeshiftnv + 'Get_ChangeShiftList?' +
            '&query.page=' + page + '&query.record=' + record, 'GET');
        return res;
    }

}
//https://api.jeehr.com/API/changeshiftnv/Del_ChangeShift?id=7&&LangCode=vi
async function Del_ChangeShift(id) {
    let res = await Utils.CallAPI(appConfig.domain + apiChangeshiftnv + `Del_ChangeShift?id=${id}&langcode=vi`, 'GET')

    return res;
}
async function getNgDuyet() {
    let res = await Utils.CallAPI(appConfig.domain + apiChangeshiftnv + `Get_TenNguoiDuyet`, 'GET')
    return res;
}


export {
    Send_ChangeShift, Get_ChangeShiftList, Del_ChangeShift, getNgDuyet
}