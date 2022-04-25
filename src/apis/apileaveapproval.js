import Utils from "../app/Utils";
const leaveapp = 'api/leaveapproval/'
import { appConfig } from "../../src/app/ConfigJeePlatform";
const domainJeeHR = appConfig.domainJeeHR
async function Get_ChiTietDuyetPhep(ID = '', Loai = '') {
    let res = await Utils.CallAPI(domainJeeHR + leaveapp + 'Get_ChiTietDuyetPhep?ID=' + ID + '&Loai=' + Loai, "GET");
    return res;
}
async function Get_DSDuyetPhep(filter_vals = '', page = 1, record = 10, filter_keys = 'ID_TinhTrang|ID',) {

    var apiGet_DSDuyetPhep = leaveapp + 'Get_DSDuyetPhep?query.page=' + page + '&query.record=' + record;
    if (filter_vals != '') {
        apiGet_DSDuyetPhep = apiGet_DSDuyetPhep
            + '&query.filter.keys=' + filter_keys
            + '&query.filter.vals=' + filter_vals;
    }
    let res = await Utils.CallAPI(domainJeeHR + apiGet_DSDuyetPhep, "GET");
    return res;
}
async function PostDuyetPhep(ID, loai, IsAccept, GhiChu) {
    let strBody = JSON.stringify({
        "ID": ID,
        "IsAccept": IsAccept,
        "loai": loai,
        "GhiChu": GhiChu,
    })
    let res = await Utils.CallAPI(domainJeeHR + leaveapp + 'DuyetPhep', "POST", strBody);
    res = Utils.handleResponse(res);
    return res;
}

async function getApprovalRequest(page = 1, record = 10, filter_vals = '', filter_keys = 'StatusID|TypeID', querySort = '') {
    var apiGetApprovalRequest = domainJeeHR + leaveapp + 'getApprovalRequest?query.page=' + page + '&query.record=' + record;
    if (filter_vals != '') {
        apiGetApprovalRequest = apiGetApprovalRequest
            + '&query.filter.keys=' + filter_keys
            + '&query.filter.vals=' + filter_vals + querySort;
        let res = await Utils.CallAPI(apiGetApprovalRequest, "GET");
        return res;
    } else {
        apiGetApprovalRequest = apiGetApprovalRequest + querySort;
        let res = await Utils.CallAPI(apiGetApprovalRequest + querySort, "GET");
        return res;
        // Utils.nlog("gia tri url--------------------", apiGetApprovalRequest)
    }
}
async function getApprovalRequestTong(filter_vals = '2', filter_keys = 'StatusID') {
    var apiGetApprovalRequest = domainJeeHR + leaveapp + 'getApprovalRequest?query.more=true' + '&query.filter.keys=' + filter_keys
        + '&query.filter.vals=' + filter_vals;

    Utils.nlog("gia tri url", apiGetApprovalRequest)

    let res = await Utils.CallAPI(apiGetApprovalRequest, "GET");
    return res;
}
export {
    Get_DSDuyetPhep, Get_ChiTietDuyetPhep, PostDuyetPhep, getApprovalRequest, getApprovalRequestTong
}