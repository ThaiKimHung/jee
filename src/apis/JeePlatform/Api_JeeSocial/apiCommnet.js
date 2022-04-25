import Utils from "../../../app/Utils";
import { appConfig } from '../../../app/ConfigJeePlatform'
const doaminJeeSocail = appConfig.domainJeeSocial
const doaminJee = appConfig.domainJeeComment
const domainJeeacount = appConfig.domainJeeAccount
const apiComment = 'api/comments/'
const apiNotifi = 'api/notifi/'

async function LoadDanhSachComment(id, more = false, sort = 'desc', page = 1, record = 30) {
    //desc: từ mới tới cũ, asc: từ cũ đến mới
    // query.more false là lấy theo page và record, true là lấy all 
    let res = await Utils.CallAPI(doaminJee + apiComment + `showFilterPage/${id}?query.more=${more}&query.page=${page}&query.record=${record}&query.sortOrder=${sort}`, 'GET')
    return res;
}

async function Load_ChiTietCommentByID(id, commentid, more = false, sort = 'desc', page = 1, record = 30) {
    // query.false là lấy theo page và record
    let res = await Utils.CallAPI(doaminJee + apiComment + `showFilterPage/${id}/${commentid}?query.more=${more}&query.record=${record}&query.page=${page}&query.sortOrder=${sort}`, 'GET')
    return res;
}

async function addComment(strbody) {
    let str = JSON.stringify(strbody)
    let res = await Utils.CallAPI(doaminJee + apiComment + `postcomment`, 'POST', str)
    return res;
}

async function postReactionComment(strbody) {
    let str = JSON.stringify(strbody)
    let res = await Utils.CallAPI(doaminJee + apiComment + `postReactionComment/mobile`, 'POST', str)
    return res;
}

async function deleteComment(idtoppic, idcmt) {
    let res = await Utils.CallAPI(doaminJee + apiComment + `delete/${idtoppic}/${idcmt}`, 'DELETE', '', true, true)
    return res;
}

async function deleteComment_Child(idtoppic, idcmt, repid) {
    let res = await Utils.CallAPI(doaminJee + apiComment + `delete/${idtoppic}/${idcmt}/${repid}`, 'DELETE', '', true, true)
    return res;
}

async function showChange(idtoppic, date) {
    let res = await Utils.CallAPI(doaminJee + apiComment + `showChange/mobile/${idtoppic}?ViewLengthComment=10&Date=${date}`, 'GET')
    return res;
}

async function showChangeKMobile(idtoppic, date) {
    let res = await Utils.CallAPI(doaminJee + apiComment + `showChange/${idtoppic}?ViewLengthComment=10&Date=${date}`, 'GET')
    return res;
}

async function updateComment(strbody) {
    let str = JSON.stringify(strbody)
    let res = await Utils.CallAPI(doaminJee + apiComment + `editComment`, 'POST', str)
    return res;
}

async function PushNotifi(strbody) {
    let str = JSON.stringify(strbody)
    let res = await Utils.CallAPI(doaminJeeSocail + apiNotifi + `PushNotifi`, 'POST', str, true, true)
    return res;
}
// https://jeesocial-api.jee.vn/api/notifi/PushNotifi
// https://jeeaccount-api.jee.vn/api/accountmanagement/GetListAccountManagement
async function GetListAccountManagemen() {
    let res = await Utils.CallAPI(domainJeeacount + `api/accountmanagement/GetListAccountManagement?more=true`, 'GET')
    return res;
}

// https://jeesocial-api.jee.vn/api/notifi/PushNotifiTagNameComment
async function PushNotifiTagNameComment(strbody) {
    let str = JSON.stringify(strbody)
    let res = await Utils.CallAPI(doaminJeeSocail + apiNotifi + `PushNotifiTagNameComment`, 'POST', str, true, true)
    return res;
}

export {
    LoadDanhSachComment, Load_ChiTietCommentByID, addComment, postReactionComment, deleteComment, deleteComment_Child,
    showChange, showChangeKMobile, updateComment, PushNotifi, GetListAccountManagemen, PushNotifiTagNameComment
}
