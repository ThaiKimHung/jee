import Utils from "../../../app/Utils";
import { appConfig } from '../../../app/ConfigJeePlatform'
import { nkey } from "../../../app/keys/keyStore";
import moment from "moment";
const domainJeeWork = appConfig.domainJeeWork

const apiListConGViec = "api/tp-tasks/"
const apiStatusCongViec = "api/wework-lite/"
const apiChiTietCongViec = "api/tp-tasks/"
const apiDinhkem = 'api/attachment/'
const apiComment = 'api/comment/'

//api/tp-tasks/my-list-mobile
//filter 1- cv tôi 2- tôi giao 3- theo dõi (loai)
//Done = 1, k bao gồm cv đã hoàn thành
//danglam = 1 -> chỉ bao gồm cv đã/ sắp hết hạn
//sort = "CreatedDate_Giam" || "CreatedDate_Tang" || "Prioritize_Cao" || "Prioritize_Thap" || "Deadline_Tang" ||"Deadline_Giam"
async function getDSCongViecCaNhan(page, keyword = '', dateDk = '', dateKt = '', collect_by = 'CreateDate', HoanThanhCV = 0, HanCV = 0, keySort = 'CreatedDate_Giam', idTrangThai = 0, loai) {
    let id_nv = await Utils.ngetStorage(nkey.UserId, '')
    let key = `filter.keys=id_nv|displayChild|groupby|keyword|TuNgay|DenNgay|collect_by|filter|task_done${HanCV == 0 ? '' : '|hethan_quahan'}|sort${idTrangThai == 1 ? '|New' : idTrangThai == 2 ? '|Doing' : idTrangThai == 3 ? '|Done' : ''}`
    let val = `&filter.vals=${id_nv}|0|project|${keyword}|${dateDk}|${dateKt}|${collect_by}|${loai}|${HoanThanhCV == 1 ? '' : '0'}${HanCV == 0 ? '' : '|1'}|${keySort}${idTrangThai == 0 ? '' : '|1'}`
    let loadmore = `&more=false&page=${page}&record=10`
    let res = await Utils.CallAPI(domainJeeWork + "api/tp-tasks/my-list-mobile?" + key + val + loadmore, "GET", false, false);
    // console.log("API:", domainJeeWork + "api/tp-tasks/my-list-mobile?" + key + val + loadmore)
    // console.log("RES:", res)
    return res
}


async function getDSCongViecDaGiao(keyword = '', dateDk = '', dateKt = '', collect_by = '', id_project_team = '', status = '') {

    var startDate = dateDk.length > 0 ? dateDk : '01/01/2010'
    var endDate = dateKt.length > 0 ? dateKt : moment(new Date()).format('DD/MM/YYYY')
    let id_nv = await Utils.ngetStorage(nkey.UserId, '')
    var key = `filter.keys=id_project_team|status|groupby|keyword|id_nv|displayChild|TuNgay|DenNgay|collect_by|filter${collect_by == '' ? '|sort_activity' : ''}` // sort_activity=1 filter theo những active công việc mới nhất.
    var val = `&filter.vals=${id_project_team}|${status}|project|${keyword}|${id_nv}|1|${startDate}|${endDate}|${collect_by}|2${collect_by == '' ? '|1' : ''}`
    let res = await Utils.CallAPI(domainJeeWork + apiListConGViec + `my-list?` + key + val, "GET", false, false);
    return res
}


async function getCTCongViecCaNhan(id) {
    let res = await Utils.CallAPI(domainJeeWork + apiChiTietCongViec + `detail-task?id=${id}`, "GET", false, false);//Detail
    return res
}

async function DeleteCTCongViecCaNhan(id) {
    let res = await Utils.CallAPI(domainJeeWork + apiChiTietCongViec + `Delete?id=${id}`, "GET", false, false);
    return res
}

async function DeleteXoaFileDinhKem(rowID) {
    let res = await Utils.CallAPI(domainJeeWork + apiDinhkem + `Delete?id=${rowID}`, "GET", false, false);
    return res
}


async function UpdateFileDinhkem(body) {
    let res = await Utils.CallAPI(domainJeeWork + apiDinhkem + `Insert`, "POST", body, false, true);
    return res
}

async function UpdateChiTietCongViec(body) {
    let res = await Utils.CallAPI(domainJeeWork + apiListConGViec + `Update-by-key`, "POST", body, false);
    return res
}

async function getCTHoatDongCongViec(id) {
    let res = await Utils.CallAPI(domainJeeWork + apiChiTietCongViec + `log-detail-by-work?id=${id}`, "GET", false, false);
    return res
}

async function InsertComment(body) {
    let res = await Utils.CallAPI(domainJeeWork + apiComment + `Insert`, "POST", body, false);
    return res
}

async function luu_log_comment(body) {
    let res = await Utils.CallAPI(domainJeeWork + apiComment + `luu-log-comment`, "POST", body, false);
    return res
}

async function getChiTietComment(type = 1, id) {
    let res = await Utils.CallAPI(domainJeeWork + apiComment + `List?sortOrder=desc&filter.keys=object_type|object_id&filter.vals=${type}|${id}`, "GET", false, false);
    return res
}

async function CloseCV(id) {
    let res = await Utils.CallAPI(domainJeeWork + apiChiTietCongViec + `Close?id=${id}&closed=true`, "GET", false);
    return res
}

//Get dự án theo user - https://jeework-api.jee.vn/api/wework-lite/lite_project_team_byuser
async function GetDuAn_User() {
    let res = await Utils.CallAPI(domainJeeWork + apiStatusCongViec + `lite_project_team_byuser`, "GET", false, false);
    return res
}

//Get status theo dự án
async function GetStatus_DuAn(id_project_team = '') {
    let res = await Utils.CallAPI(domainJeeWork + apiStatusCongViec + `list-status-dynamic?id_project_team=${id_project_team}&isDepartment=false`, "GET", false, false);
    return res
}
//https://jeework-api.jee.vn/api/comments/getByComponentName_Mobile/kt-task_218956
async function getByComponentName_Mobile(id = '') {
    let res = await Utils.CallAPI(domainJeeWork + `api/comments/getByComponentName_Mobile/kt-task_${id}`, "GET", false, false);
    return res
}


export {
    getDSCongViecCaNhan, getDSCongViecDaGiao, UpdateChiTietCongViec, getCTHoatDongCongViec, getChiTietComment, GetStatus_DuAn, GetDuAn_User,
    getCTCongViecCaNhan, DeleteCTCongViecCaNhan, DeleteXoaFileDinhKem, UpdateFileDinhkem, InsertComment, CloseCV, getByComponentName_Mobile, luu_log_comment
}


