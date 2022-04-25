import Utils from "../app/Utils"
import { appConfig } from "../../src/app/ConfigJeePlatform";

const domainJeeHR = appConfig.domainJeeHR
const PREFIX = 'api/giaitrinhchamcong/';

async function Get_DSGiaiTrinh(more = true, page = 1, record = 10) {
    let res = await Utils.CallAPI(domainJeeHR + PREFIX + `Get_DSGiaiTrinhApp?more=${more}&page=${page}&record=${record}`, "GET");
    return res;
}
// https://api.jeehr.com/API/giaitrinhchamcong/Get_DSChiTietGiaiTrinh?sortOrder=&sortField=&page=1&record=10&more=true
async function Get_DSChiTietGiaiTrinh(thang, nam) {
    let res = await Utils.CallAPI(domainJeeHR + PREFIX + `Get_DSChiTietGiaiTrinh?more=true&filter.keys=Thang|Nam&filter.vals=${thang}|${nam}`, "GET");
    return res;
}
////https://api.jeehr.com/API/giaitrinhchamcong/Get_DSNgay?sortOrder=&sortField=&page=1&record=10&more=true&filter.keys=ID%7CNgay&filter.vals=12%7C2020-03-10T00:00:00

async function Get_DSNgay(vals = '', more = true, page = 1, record = 10) {
    let res = await Utils.CallAPI(domainJeeHR + PREFIX + `Get_DSNgay?more=${true}&page=${page}&record=${record}` + `&filter.keys=ID|Ngay&filter.vals=` + vals, "GET");
    return res;
}
async function Get_TenNguoiDuyet() {
    let res = await Utils.CallAPI(domainJeeHR + PREFIX + `Get_TenNguoiDuyet?rowid=0`, "GET")
    return res;
}

// https://api.jeehr.com/API/giaitrinhchamcong/Insert_ChiTietGiaiTrinh

async function Insert_ChiTietGiaiTrinh(body = {}) {

    let strBody = JSON.stringify({ ...body })
    let res = await Utils.CallAPI(domainJeeHR + PREFIX + 'Insert_ChiTietGiaiTrinh', "POST", strBody);
    res = Utils.handleResponse(res);
    return res;
}
// https://api.jeehr.com/API/giaitrinhchamcong/Get_DSChiTietGiaiTrinh?sortOrder=&sortField=&page=1&record=10&more=true&filter.keys=ID&filter.vals=63

async function Get_DSChiTietGiaiTrinhID(id = '') {
    let res = await Utils.CallAPI(domainJeeHR + PREFIX + `Get_DSChiTietGiaiTrinh??sortOrder=&sortField=&page=1&record=10&more=true&filter.keys=ID&filter.vals=` + id, "GET")
    return res;
}
//https://api.jeehr.com/API/giaitrinhchamcong/HuyGiaiTrinh?id=69
// https://api.jeehr.com/API/giaitrinhchamcong/HuyGiaiTrinh?id=147

async function HuyGiaiTrinh(id = '') {
    let res = await Utils.CallAPI(domainJeeHR + PREFIX + `HuyGiaiTrinh?id=${id}`, "GET")
    return res;
}
//https://api.jeehr.com/API/giaitrinhchamcong/HuyChiTietGiaiTrinh?id=125
async function HuyChiTietGiaiTrinh(id = '') {
    let res = await Utils.CallAPI(domainJeeHR + PREFIX + `HuyChiTietGiaiTrinh?id=${id}`, "GET")
    return res;
}
//{RowID: "71", TimeStr: "03/2020"}
// https://api.jeehr.com/API/giaitrinhchamcong/GuiGiaiTrinh

async function GuiGiaiTrinh(body = {}) {
    let strBody = JSON.stringify({ ...body })
    let res = await Utils.CallAPI(domainJeeHR + PREFIX + 'GuiGiaiTrinh', "POST", strBody);
    res = Utils.handleResponse(res);
    return res;
}
export {
    Get_DSGiaiTrinh, Get_TenNguoiDuyet, Get_DSChiTietGiaiTrinh, Get_DSNgay, GuiGiaiTrinh,
    Insert_ChiTietGiaiTrinh, Get_DSChiTietGiaiTrinhID, HuyGiaiTrinh, HuyChiTietGiaiTrinh
}