// import { nkey } from "../../app/keys/keyStore";
import Utils from "../../../app/Utils";
import { appConfig } from '../../../app/ConfigJeePlatform'

const doaminJee = appConfig.domainJeeSocial

const apiBaiDang = 'api/baidang/'
const apiPhanQuyenLoaiBaiDang = 'api/PhanQuyen_Loai/'
const apiGroup = 'api/Group/'
const apiUser = 'api/user/'
const apiCEO = 'api/ceoletter/'
const apiGroupMember = 'api/GroupMember/'
const apiMenu = 'api/menu/'
const apiComment = 'api/Comment/'
const apiKhenThuong = 'api/khenthuong/'
const apiTinTuc = 'api/tintuc/'

async function LoadDanhSachBaiDang(status, sortOrder = '', sortField = '', page) {
    let res = await Utils.CallAPI(doaminJee + apiBaiDang + `getDSBaiDang?status_load=${status}&sortOrder=` + sortOrder + '&sortField='
        + sortField + '&page=' + page + '&record=10', "GET");
    return res;
}

async function LoadDanhSachComment(id_baidang, page, record) {
    let res = await Utils.CallAPI(doaminJee + apiBaiDang + `Load_Comment?id_baidang=${id_baidang}&sortOrder=&sortField=&page=${page}&record=${record}`, 'GET')
    return res;
}

async function BaiDangLike(id_baidang, type) {
    let res = await Utils.CallAPI(doaminJee + apiBaiDang + `Baidang_like?id=${id_baidang}&type=${type}`, 'POST',)
    return res;
}

async function BaiDang_LuuTru(id_baidang) {
    let res = await Utils.CallAPI(doaminJee + apiBaiDang + `LuutruBaiDang?id_baidang=${id_baidang}`, 'POST')
    return res;
}

async function PhanQuyenLoaiBaiDang() {
    let res = await Utils.CallAPI(doaminJee + apiPhanQuyenLoaiBaiDang + `PhanQuyenLoaiBaiDang`, 'GET')
    return res;
}

async function DsGroup() {
    let res = await Utils.CallAPI(doaminJee + apiGroup + `getDSGroup`, 'GET')
    return res;
}

async function addBaiDang(strbody) {
    let res = await Utils.CallAPI(doaminJee + apiBaiDang + `addBaiDang`, 'POST', strbody, false, true)
    return res;
}

async function getAllUser() {
    let res = await Utils.CallAPI(doaminJee + apiUser + `GetAllUser`, 'GET')
    return res;
}

async function getDSThongDiep() {
    let res = await Utils.CallAPI(doaminJee + apiCEO + `getDSThongDiep`, 'GET')
    return res;
}

async function getDetailDSThongDiep(id) {
    let res = await Utils.CallAPI(doaminJee + apiCEO + `getThongTinSubmenu?id_submenu=${id}`, 'GET',)
    return res;
}

async function LoadDanhSachBaiDang_Group(sortOrder = '', sortField = '', page) {
    let res = await Utils.CallAPI(doaminJee + apiBaiDang + 'getDSBaiDang_Group?sortOrder=' + sortOrder + '&sortField='
        + sortField + '&page=' + page + '&record=10', "GET");
    return res;
}

async function deleteBaiDang(id) {
    let res = await Utils.CallAPI(doaminJee + apiBaiDang + `deleteBaiDang?id_baidang=${id}`, 'DELETE')
    return res;
}

async function taoNhomMoi(strbody) {
    let res = await Utils.CallAPI(doaminJee + apiGroup + `addGroup`, 'POST', strbody, true, true)
    return res;
}

//chưa sử dụng
async function editNhom(strbody) {
    let res = await Utils.CallAPI(doaminJee + apiGroup + `UpdateGroup`, 'POST', strbody,)
    return res;
}

async function LoadDanhSachBaiDang_InGroup(id, sortOrder = '', sortField = '', page) {
    let res = await Utils.CallAPI(doaminJee + apiBaiDang + 'getDSBaiDang_In_Group?id_group=' + id + '&sortOrder=' + sortOrder + '&sortField='
        + sortField + '&page=' + page + '&record=10', "GET");
    return res;
}

async function getDSGroupMember(id) {
    let res = await Utils.CallAPI(doaminJee + apiGroupMember + `DS_ThanhVien_Group?id_group=${id}`, 'GET',)
    return res;
}

async function deleteGroup(id) {
    let res = await Utils.CallAPI(doaminJee + apiGroup + `deleteGroup?id_group=${id}`, 'DELETE')
    return res;
}

async function deleteMember_InGroup(idgroup, iduser) {
    let res = await Utils.CallAPI(doaminJee + apiGroupMember + `Delete_Member?id_group=${idgroup}&id_user=${iduser}`, 'POST')
    return res;
}

async function GetDSUser_NotIn_InGroup(id) {
    let res = await Utils.CallAPI(doaminJee + apiGroupMember + `GetDSUser_NotIn_InGroup?id_group=${id}`, 'GET',)
    return res;
}

async function themThanhVien(id, strbody) {
    let res = await Utils.CallAPI(doaminJee + apiGroupMember + `addUserGroup?id_group=${id}`, 'POST', strbody)
    return res;
}

async function Update_Quyen_Member(idgroup, iduser) {
    let res = await Utils.CallAPI(doaminJee + apiGroupMember + `Update_Quyen_Member?id_group=${idgroup}&id_user=${iduser}`, 'POST')
    return res;
}

async function GetMenu_Left_Home() {
    let res = await Utils.CallAPI(doaminJee + apiMenu + `GetMenu_Left_Home`, 'GET',)
    return res;
}

async function addKhenThuong(strbody) {
    let res = await Utils.CallAPI(doaminJee + apiKhenThuong + `addKhenThuong`, 'POST', strbody)
    return res;
}

async function getChiTietBaiDang(id) {
    let res = await Utils.CallAPI(doaminJee + apiBaiDang + `getChiTietBaiDang?id_baidang=${id}`, 'GET',)
    return res;
}

async function UpdateBaiDang(strbody) {
    let res = await Utils.CallAPI(doaminJee + apiBaiDang + `UpdateBaiDang`, 'POST', strbody,)
    return res;
}

async function updateKhenThuong(id, strbody) {
    let res = await Utils.CallAPI(doaminJee + apiKhenThuong + `UpdateKhenThuong?id_baidang=${id}`, 'POST', strbody)
    return res;
}

async function GetMenu() {
    let res = await Utils.CallAPI(doaminJee + apiMenu + `GetMenu`, 'GET',)
    return res;
}

async function getDS_TinTuc(strbody) {
    let res = await Utils.CallAPI(doaminJee + apiTinTuc + `DS_TinTuc`, 'POST', strbody)
    return res;
}

async function GetDetail_TinTuc(id) {
    let res = await Utils.CallAPI(doaminJee + apiTinTuc + `GetDetail_TinTuc?id_tintuc=${id}`, 'GET',)
    return res;
}

async function GetMenu_Left() {
    let res = await Utils.CallAPI(doaminJee + apiMenu + `GetMenu_Left`, 'GET',)
    return res;
}

async function addGhimBaiDang(id) {
    let res = await Utils.CallAPI(doaminJee + apiBaiDang + `addGhimBaiDang?id_baidang=${id}`, 'POST', '', true)
    return res;
}


async function UpdateTagName(idbaidang, strbody) {
    let res = await Utils.CallAPI(doaminJee + apiBaiDang + `UpdateTagName?id_baidang=${idbaidang}`, 'POST', strbody)
    return res;
}

async function UpdateThongDiep(strbody) {
    let res = await Utils.CallAPI(doaminJee + apiCEO + `UpdateSubmeNenu`, 'POST', strbody)
    return res;
}

async function InserItem_DanhMuc_MemuLeft(strbody) {
    let res = await Utils.CallAPI(doaminJee + apiMenu + `InserItem_DanhMuc_MemuLeft`, 'POST', strbody)
    return res;
}

async function Update_FileBaiDang(strbody) {
    let body = JSON.stringify(strbody)
    let res = await Utils.CallAPI(doaminJee + apiBaiDang + `Update_FileBaiDang`, 'POST', body)
    return res;
}

async function AddTinNoiBat(id) {
    let res = await Utils.CallAPI(doaminJee + apiBaiDang + `AddTinNoiBat?id_baidang=${id}`, 'POST')
    return res;
}

async function HuyTinNoiBat(id) {
    let res = await Utils.CallAPI(doaminJee + apiBaiDang + `DeleteTinNoiBat?id_baidang=${id}`, 'POST')
    return res;
}

async function getTinNoiBat() {
    let res = await Utils.CallAPI(doaminJee + apiBaiDang + `getTinNoiBat`, 'GET')
    return res;
}

async function On_OffThongBao(id) {
    let res = await Utils.CallAPI(doaminJee + apiBaiDang + `On_OffThongBao?id_baidang=${id}`, 'POST')
    return res;
}

async function CountReaction(idbaidang) {
    let res = await Utils.CallAPI(doaminJee + apiBaiDang + `CountReaction?id_badang=${idbaidang}`, 'GET')
    return res;
}

async function GetDSReaction(idbaidang, idlike) {
    let res = await Utils.CallAPI(doaminJee + apiBaiDang + `GetDSReaction?id_badang=${idbaidang}&id_like=${idlike}`, 'GET')
    return res;
}

async function GetDSUser_Group(idgroup) {
    let res = await Utils.CallAPI(doaminJee + apiGroup + `getDSUser_Group?id_group=${idgroup}`, 'GET')
    return res;
}

async function GetMenu_Group() {
    let res = await Utils.CallAPI(doaminJee + apiGroup + `getMenu_Group`, 'GET')
    return res;
}

async function GetImage_inGroup(idgroup) {
    let res = await Utils.CallAPI(doaminJee + apiGroup + `getImage_inGroup?id_group=${idgroup}`, 'GET')
    return res;
}

async function GetVideo_inGroup(idgroup) {
    let res = await Utils.CallAPI(doaminJee + apiGroup + `getVideo_inGroup?id_group=${idgroup}`, 'GET')
    return res;
}

async function GetFile_inGroup(idgroup) {
    let res = await Utils.CallAPI(doaminJee + apiGroup + `getFile_inGroup?id_group=${idgroup}`, 'GET')
    return res;
}

async function GetDSBaiDang_TypeIn_Group(idgroup, key, page, record) {
    let res = await Utils.CallAPI(doaminJee + apiBaiDang + `getDSBaiDang_TypeIn_Group?id_group=${idgroup}&key=${key}&sortOrder=&sortField=&page=${page}&record=${record}`, 'GET')
    return res;
}

async function UpdateAvatarGroup(idgroup, strbody) {
    let str = JSON.stringify(strbody)
    let res = await Utils.CallAPI(doaminJee + apiGroup + `UpdateAvatarGroup?idgroup=${idgroup}`, 'POST', str)
    return res;
}

async function EditNameGroup(name, idgroup) {
    let res = await Utils.CallAPI(doaminJee + apiGroup + `EditNameGroup?namegroup=${name}&idgroup=${idgroup}`, 'POST')
    return res;
}

export {
    LoadDanhSachBaiDang, LoadDanhSachComment, BaiDangLike, BaiDang_LuuTru, PhanQuyenLoaiBaiDang, DsGroup, addBaiDang, getAllUser, getDSThongDiep,
    getDetailDSThongDiep, LoadDanhSachBaiDang_Group, deleteBaiDang, taoNhomMoi, editNhom, LoadDanhSachBaiDang_InGroup, getDSGroupMember, deleteGroup,
    deleteMember_InGroup, GetDSUser_NotIn_InGroup, themThanhVien, Update_Quyen_Member, GetMenu_Left_Home, addKhenThuong, getChiTietBaiDang, UpdateBaiDang,
    updateKhenThuong, GetMenu, getDS_TinTuc, GetDetail_TinTuc, GetMenu_Left, addGhimBaiDang, UpdateTagName, UpdateThongDiep, InserItem_DanhMuc_MemuLeft,
    Update_FileBaiDang, AddTinNoiBat, getTinNoiBat, On_OffThongBao, GetDSReaction, CountReaction, GetDSUser_Group, GetMenu_Group, GetImage_inGroup, GetFile_inGroup, GetDSBaiDang_TypeIn_Group,
    UpdateAvatarGroup, EditNameGroup, GetVideo_inGroup, HuyTinNoiBat
}
