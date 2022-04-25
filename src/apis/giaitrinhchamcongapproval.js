import Utils from "../app/Utils"
import { appConfig } from "../../src/app/ConfigJeePlatform";
const domainJeeHR = appConfig.domainJeeHR
const PREFIX = 'api/giaitrinhchamcongapproval/'

// https://api.jeehr.com/API/giaitrinhchamcongapproval/Get_DSDuyetGiaiTrinh?sortOrder=asc&sortField=id&page=1&record=10&filter.keys=ID_TinhTrang&filter.vals=0
async function Get_DSDuyetGiaiTrinh(vals = '', page = 1, record = 10) {
    if (vals) {
        let res = await Utils.CallAPI(domainJeeHR + PREFIX + `Get_DSDuyetGiaiTrinhApp?more=false&page=${page}&record=${record}&filter.keys=ID_TinhTrang&filter.vals=` + vals, "GET");
        return res;
    } else {
        let res = await Utils.CallAPI(domainJeeHR + PREFIX + `Get_DSDuyetGiaiTrinhApp?page=${page}&record=${record}`, "GET");
        return res;
    }

}
//https://api.jeehr.com/API/giaitrinhchamcongapproval/DuyetDanhGia
// {ID: 72, IsAccept: true, GhiChu: "", LangCode: "vi"}
async function DuyetDanhGia(body = {}) {

    let strBody = JSON.stringify(body)
    let res = await Utils.CallAPI(domainJeeHR + PREFIX + 'DuyetDanhGia', "POST", strBody);
    res = Utils.handleResponse(res);
    return res;
}

//https://api.jeehr.com/API/giaitrinhchamcongapproval/Duyet
// {ID: 133, IsAccept: false}
// ID: 133
// IsAccept: false
async function Duyet_CT(body = {}) {
    let strBody = JSON.stringify(body)
    let res = await Utils.CallAPI(domainJeeHR + PREFIX + 'Duyet', "POST", strBody);
    res = Utils.handleResponse(res);
    return res;
}
//https://api.jeehr.com/API/giaitrinhchamcongapproval/Get_ChiTiet?id=66
async function Get_ChiTietDGT(vals = '') {

    let res = await Utils.CallAPI(domainJeeHR + PREFIX + `Get_ChiTiet?id=` + vals, "GET");
    return res;


}
export {
    Get_DSDuyetGiaiTrinh, DuyetDanhGia, Duyet_CT, Get_ChiTietDGT
}