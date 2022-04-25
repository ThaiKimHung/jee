import { appConfig } from '../app/Config';
import Utils from '../app/Utils';

const Times = 'api/timesheets/';
import { appConfig as appConfigDomain } from "../../src/app/ConfigJeePlatform";
const domainJeeHR = appConfigDomain.domainJeeHR

async function Get_DSCong(filter_vals = '2019|9', filter_keys = 'Thang|ID_NV|Nam') {
    let res = await Utils.CallAPI(domainJeeHR + Times + 'Get_BangChamCong_App?query.filter.keys=' + filter_keys +
        '&query.filter.vals=' + filter_vals, "GET");
    return res;
}
async function Get_XNBangCong(thang = '9', nam = '2019') {
    let res = await Utils.CallAPI(domainJeeHR + Times + 'Confirm_BCC?thang=' + thang + '&nam=' + nam, "GET");
    return res;
}
async function getDSChamCong(filter_vals = '01/08/2018|31/08/2019', page = 1, record = 10, filter_keys = 'TuNgay|DenNgay') {
    let res = await Utils.CallAPI(appConfig.domain + Times + 'Get_ChiTietChamCong?query.filter.keys=' + filter_keys +
        '&query.filter.vals=' + filter_vals +
        '&query.page=' + page + '&query.record=' + record, 'GET');
    return res;
}
async function getDSChamCongNgay(filter_vals = '', page = 1, record = 10, filter_keys = 'Ngay') {
    let res = await Utils.CallAPI(domainJeeHR + Times + 'Get_DSChamCong?query.filter.keys=' + filter_keys +
        '&query.filter.vals=' + filter_vals +
        '&query.page=' + page + '&query.record=' + record, "GET");
    return res;
}

async function PostComment(ID = '', thang, nam, Comment) {
    let strBody = ID !== '' ? JSON.stringify({
        "ID": ID,
        "thang": thang,
        "nam": nam,
        "Comment": Comment
    }) :
        JSON.stringify({
            "thang": thang,
            "nam": nam,
            "Comment": Comment
        })
    let res = await Utils.CallAPI(domainJeeHR + Times + 'SendComment', "POST", strBody);
    res = Utils.handleResponse(res);
    return res;
}


export {
    Get_DSCong, Get_XNBangCong, PostComment, getDSChamCong, getDSChamCongNgay
}
