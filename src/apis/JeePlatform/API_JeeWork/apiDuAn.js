import Utils from "../../../app/Utils";
import { appConfig } from '../../../app/ConfigJeePlatform'
import { nkey } from "../../../app/keys/keyStore";
import moment from "moment";

const domainJeeWork = appConfig.domainJeeWork


const apiDuAnCongViec = "api/wework-lite/"
// const apiDuAnPhongBan = 'api/project-team/'
const apiDuAnPhongBan = 'api/tp-project/'
const apiChiTietCongViec = 'api/tp-tasks/'
const apiTaiLieuDuAn = 'api/documents/'
const apiUploadTaiLieu = 'api/attachment/Insert'
async function getListDuAnTaoCongViec(keyword) {
    let res = await Utils.CallAPI(domainJeeWork + apiDuAnCongViec + `lite_project_team_byuser?keyword=${keyword}`, "GET", false, true);
    return res
}
async function getDuAnPhongBan(page = 1, keyword = '', type = '', hienthi = 0) {

    let keyval = '&filter.keys='

    keyword.toString().length > 1 ? keyval += 'keyword|' : null
    Number.isInteger(type) ? keyval += 'status|' : null
    keyval += 'locked'
    let vals = '&filter.vals='
    keyword.toString().length > 1 ? vals += keyword + '|' : null
    Number.isInteger(type) ? vals += type + '|' : null
    vals += hienthi
    let res = await Utils.CallAPI(domainJeeWork + apiDuAnPhongBan + `List?sortOrder=asc&sortField=id&page=${page}&record=10` + keyval + vals, "GET", false, false);
    return res
}

async function getDuAnPhongBanDuocTaoBoiToi(page = 1, keyword = '', type = '', hienthi = 0) {

    let keyval = '&filter.keys='
    // let id_nv = await Utils.ngetStorage(nkey.UserId, '')
    keyword.toString().length > 1 ? keyval += 'keyword|' : null
    Number.isInteger(type) ? keyval += 'status|' : null
    keyval += 'locked'
    let vals = '&filter.vals='
    keyword.toString().length > 1 ? vals += keyword + '|' : null
    Number.isInteger(type) ? vals += type + '|' : null
    vals += hienthi
    let res = await Utils.CallAPI(domainJeeWork + apiDuAnPhongBan + `List?sortOrder=asc&sortField=id&page=${page}&record=1000` + keyval + vals, "GET", false, false);
    return res
}


async function getDuAnPhongBanDangThamGia(page = 1, keyword = '', type = '', hienthi = 0) {

    let keyval = '&filter.keys='
    let id_nv = await Utils.ngetStorage(nkey.UserId, '')
    keyword.toString().length > 1 ? keyval += 'keyword|' : null
    Number.isInteger(type) ? keyval += 'status|' : null
    keyval += 'locked|join'
    let vals = '&filter.vals='
    keyword.toString().length > 1 ? vals += keyword + '|' : null
    Number.isInteger(type) ? vals += type + '|' : null
    vals += hienthi + '|' + 1

    let res = await Utils.CallAPI(domainJeeWork + apiDuAnPhongBan + `List?sortOrder=asc&sortField=id&page=${page}&record=1000` + keyval + vals, "GET", false, false);
    return res
}


async function ChiTietDuAn(search, idDuAn, groupBy = "status", keyword = '', dateDk = '', dateKt = '', collect_by = '') {

    var startDate = dateDk.length > 0 ? dateDk : '01/01/2010'
    var endDate = dateKt.length > 0 ? dateKt : moment(new Date()).format('DD/MM/YYYY')
    var key = 'filter.keys=keyword|id_project_team|groupby|TuNgay|DenNgay|collect_by|task_done|subtask_done'
    var val = `&filter.vals=${search}|${idDuAn}|${groupBy}|${startDate}|${endDate}|${collect_by}|1|1`
    let res = await Utils.CallAPI(domainJeeWork + apiChiTietCongViec + `list-task?` + key + val, "GET", false, false);
    return res
}



async function GetActivityPhongBan(id) {
    let res = await Utils.CallAPI(domainJeeWork + apiDuAnPhongBan + `list-activities?filter.keys=id_project_team&filter.vals=${id}`, "GET", false, false);
    return res
}



async function DetailDuAn(id) {
    let res = await Utils.CallAPI(domainJeeWork + apiDuAnPhongBan + `Detail?id=${id}`, "GET", false, true);
    return res
}

async function GetTaiLieuDuAn(id) {
    let res = await Utils.CallAPI(domainJeeWork + apiTaiLieuDuAn + `List?more=true&filter.keys=id_project_team&filter.vals=${id}`, "GET", false, false);
    return res
}

async function GetCongViecJeeMetting(id) {
    let res = await Utils.CallAPI(domainJeeWork + apiDuAnPhongBan + `Detail?id=${id}`, "GET", false, false);
    return res
}
async function postUploadTaiLieu(body) {
    const strBody = JSON.stringify(body)
    let res = await Utils.CallAPI(domainJeeWork + apiUploadTaiLieu, "POST", strBody, false, false);
    return res
}





export {
    getListDuAnTaoCongViec, getDuAnPhongBan, ChiTietDuAn, getDuAnPhongBanDuocTaoBoiToi, getDuAnPhongBanDangThamGia,
    GetActivityPhongBan, GetTaiLieuDuAn, DetailDuAn, GetCongViecJeeMetting, postUploadTaiLieu
}


