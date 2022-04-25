
import Utils from "../app/Utils";

const changeshiftapproval = "api/changeshiftapproval/";
import { appConfig } from "../../src/app/ConfigJeePlatform";
const domainJeeHR = appConfig.domainJeeHR
async function getDuyetDoica(vals = '', page = 1, record = 10) {
    if (vals) {
        let res = await Utils.CallAPI(domainJeeHR + changeshiftapproval + 'Get_DSDuyetDonXinDoiCaApp?sortOrder=asc&sortField=id&page=' + page + '&record=' + record + '&filter.keys=ID_TinhTrang&filter.vals=' + vals, "GET")
        return res;
    } else {
        let res = await Utils.CallAPI(domainJeeHR + changeshiftapproval + 'Get_DSDuyetDonXinDoiCaApp?sortOrder=asc&sortField=id&page=' + page + '&record=' + record, "GET")
        return res;
    }

}
// /https://api.jeehr.com/API/changeshiftapproval/Get_ChiTietDonXinDoiCa?ID=68
async function Get_ChiTietDonXinDoiCa(ID = '') {
    let res = await Utils.CallAPI(domainJeeHR + changeshiftapproval + 'Get_ChiTietDonXinDoiCa?ID=' + ID, "GET")
    return res;
}
//https://api.jeehr.com/API/changeshiftapproval/DuyetDonXinDoiCa
// {ID: 68, IsAccept: true, LangCode: "vi"}
async function DuyetDonXinDoiCa(body = {}) {
    let strBody = JSON.stringify(body)
    let res = await Utils.CallAPI(domainJeeHR + changeshiftapproval + 'DuyetDonXinDoiCa', "POST", strBody);
    res = Utils.handleResponse(res);
    return res;
}
export {
    getDuyetDoica, Get_ChiTietDonXinDoiCa, DuyetDonXinDoiCa
}