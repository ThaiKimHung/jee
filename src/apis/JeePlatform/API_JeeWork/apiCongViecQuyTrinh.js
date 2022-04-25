import Utils from "../../../app/Utils";
import { appConfig } from '../../../app/ConfigJeePlatform'
import { nkey } from "../../../app/keys/keyStore";
import moment from "moment";

const domainJeeWorkFlow = appConfig.domainJeeWorkFlow
const domainJeeAccount = appConfig.domainJeeAccount
const apiChiTietCongViec = "api/workprocess/"
const apiListWorkQuyTrinh = "api/task/list?"
const apiListQuyTrinh = 'api/controllergeneral/processes'

async function Get_NodeDetail(id) {
    let res = await Utils.CallAPI(domainJeeWorkFlow + apiChiTietCongViec + `Get_NodeDetail?id=${id}`, "GET", false, false);
    return res
}

async function Get_ProcessDetail(id) {
    let res = await Utils.CallAPI(domainJeeWorkFlow + apiChiTietCongViec + `Get_ProcessDetail?id=${id}`, "GET", false, false);
    return res
}
async function getListWorkQuyTrinh({
    page = 1, record = 10, isprocess = true, processid = '', sortOrder = 'desc', sortField = 'assigndate', idType, from, to, keyword, isHoanThanh = true, isHetHan = false, typeid = ''
} = {}) {
    var keys = 'isprocess|processid|iscompleted|isexpired'
    var vals = `${isprocess}|${processid}|${isHoanThanh}|${isHetHan}`
    if (keyword) {
        keys += '|keyword'
        vals += `|${keyword}`
    }
    if (typeid || typeid === 0) {
        keys += '|typeid'
        vals += `|${typeid}`
    }
    switch (idType) {
        case 1:
            keys += '|createddate_from|createddate_to'
            vals += `|${from}|${to}`
            break;
        case 2:
            keys += '|deadline_from|deadline_to'
            vals += `|${from}|${to}`
            break;
        case 3:
            keys += '|startdate_from|startdate_to'
            vals += `|${from}|${to}`
            break;
        case 4:
            keys += '|assigndate_from|assigndate_to'
            vals += `|${from}|${to}`
            break;
    }
    const paramester = `sortOrder=${sortOrder}&sortField=${sortField}&page=${page}&record=${record}&more=true&filter.keys=${keys}&filter.vals=${vals}`
    let res = await Utils.CallAPI(domainJeeWorkFlow + apiListWorkQuyTrinh + paramester, "GET", false, false);
    return res
}
async function getListQuyTrinh() {
    let res = await Utils.CallAPI(domainJeeWorkFlow + apiListQuyTrinh, "GET", false, false);
    return res
}
async function GetControlList() {
    let res = await Utils.CallAPI(domainJeeWorkFlow + "api/controllergeneral/GetControlList", "GET", false, false);
    return res
}

// https://jeeworkflow-api.jee.vn/api/comments/getByComponentName/kt-process-work-details1020
async function getByComponentName(id = '') {
    let res = await Utils.CallAPI_Get1Data(domainJeeWorkFlow + `api/comments/getByComponentName/kt-process-work-details${id}`, "GET", "", false);
    return res
}
// https://jeeworkflow-api.jee.vn/api/workprocess/updateThongTinCanNhap
async function UpdateThongTinCanNhap(body) {
    let str = JSON.stringify(body)
    let res = await Utils.CallAPI(domainJeeWorkFlow + apiChiTietCongViec + `updateThongTinCanNhap`, "POST", str, false, false);
    return res
}

// https://jeeworkflow-api.jee.vn/api/workprocess/updateTaiLieu
async function UpdateTaiLieu(body) {
    let str = JSON.stringify(body)
    let res = await Utils.CallAPI(domainJeeWorkFlow + apiChiTietCongViec + `updateTaiLieu`, "POST", str, false);
    return res
}
// https://jeeaccount-api.jee.vn/api/accountmanagement/usernamesByCustermerID
async function GetListNhanVien() {
    let res = await Utils.CallAPI(domainJeeAccount + "api/accountmanagement/usernamesByCustermerID", "GET", false, false);
    return res
}
// https://jeeworkflow-api.jee.vn/api/workprocess/updateToDo
async function TaoCongViec(body) {
    let str = JSON.stringify(body)
    let res = await Utils.CallAPI(domainJeeWorkFlow + apiChiTietCongViec + `updateToDo`, "POST", str, false);
    return res
}
// https://jeeworkflow-api.jee.vn/api/workprocess/getToDoDetail?id=1034
async function GetCongViecChiTiet(rowid) {
    let res = await Utils.CallAPI(domainJeeWorkFlow + apiChiTietCongViec + `getToDoDetail?id=${rowid}`, "GET", false, false);
    return res
}

// https://jeeworkflow-api.jee.vn/api/workprocess/updateToDo
async function UpdateMoTaCongViec(body) {
    let str = JSON.stringify(body)
    let res = await Utils.CallAPI(domainJeeWorkFlow + apiChiTietCongViec + `updateToDo`, "POST", str, false);
    return res
}

// https://jeeworkflow-api.jee.vn/api/workprocess/updateTaiLieuCongViec
async function UpdatTaiLieuCongViec(body) {
    let str = JSON.stringify(body)
    let res = await Utils.CallAPI(domainJeeWorkFlow + apiChiTietCongViec + `updateTaiLieuCongViec`, "POST", str, false, true);
    return res
}

// https://jeeworkflow-api.jee.vn/api/comments/getByComponentName/kt-cong-viec-dialog1046
async function getToppicIDCTCV(id = '') {
    let res = await Utils.CallAPI_Get1Data(domainJeeWorkFlow + `api/comments/getByComponentName/kt-cong-viec-dialog${id}`, "GET", "", false);
    return res
}

// https://jeeworkflow-api.jee.vn/api/workprocess/updateStatusToDo
async function UpdateStatusToDo(body) {
    let str = JSON.stringify(body)
    let res = await Utils.CallAPI(domainJeeWorkFlow + apiChiTietCongViec + `updateStatusToDo`, "POST", str, false);
    return res
}

// https://jeeworkflow-api.jee.vn/api/workprocess/updateImplementer
async function UpdateNVTheoDoi(body) {
    let str = JSON.stringify(body)
    let res = await Utils.CallAPI(domainJeeWorkFlow + apiChiTietCongViec + `updateImplementer`, "POST", str, false);
    return res
}

// https://jeeworkflow-api.jee.vn/api/workprocess/updateStatusNode
async function UpdateStatusNode(body) {
    let str = JSON.stringify(body)
    let res = await Utils.CallAPI(domainJeeWorkFlow + apiChiTietCongViec + `updateStatusNode`, "POST", str, false);
    return res
}

// https://jeeworkflow-api.jee.vn/api/workprocess/ChuyenGiaiDoan
async function ChuyenGiaiDoan(body) {
    let str = JSON.stringify(body)
    let res = await Utils.CallAPI(domainJeeWorkFlow + apiChiTietCongViec + `ChuyenGiaiDoan`, "POST", str, false);
    return res
}

// https://jeeworkflow-api.jee.vn/api/workprocess/Get_FieldsNode?id=135&nodelistid=0 
async function Get_FieldsNode(rowid) {
    let res = await Utils.CallAPI(domainJeeWorkFlow + apiChiTietCongViec + `Get_FieldsNode?id=${rowid}&nodelistid=0`, "GET", false, false);
    return res
}

// https://jeeworkflow-api.jee.vn/api/workprocess/getNguoiThucHienDuKien?id=1326
async function GetNguoiThucHienDuKien(id) {
    let res = await Utils.CallAPI(domainJeeWorkFlow + apiChiTietCongViec + `getNguoiThucHienDuKien?id=${id}`, "GET", false, false);
    return res
}

//https://jeeworkflow-api.jee.vn/api/workprocess/delToDo?id=1045
async function delToDo(id) {
    let res = await Utils.CallAPI(domainJeeWorkFlow + apiChiTietCongViec + `delToDo?id=${id}`, "GET", false, false);
    return res
}

// https://jeeworkflow-api.jee.vn/api/workprocess/activity-log?sortOrder=&sortField=&pageNumber=1&pageSize=100&more=true&filter.keys=stageid&filter.vals=1349
async function LoadDanhSachHoatDong(page, pageSize = 100, id, more = true) {
    let res = await Utils.CallAPI(domainJeeWorkFlow + apiChiTietCongViec + `activity-log?sortOrder=&sortField=&pageNumber=${page}&pageSize=${pageSize}&more=true&filter.keys=stageid&filter.vals=${id}`, "GET");
    return res;
}
export {
    Get_NodeDetail, Get_ProcessDetail, getListQuyTrinh, getListWorkQuyTrinh, GetControlList, getByComponentName, UpdateThongTinCanNhap
    , UpdateTaiLieu, GetListNhanVien, TaoCongViec, GetCongViecChiTiet, UpdateMoTaCongViec, UpdatTaiLieuCongViec, getToppicIDCTCV,
    UpdateStatusToDo, UpdateNVTheoDoi, UpdateStatusNode, ChuyenGiaiDoan, Get_FieldsNode, GetNguoiThucHienDuKien, delToDo, LoadDanhSachHoatDong
}