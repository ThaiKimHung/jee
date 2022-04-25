import Utils from "../../../app/Utils";
import { appConfig } from '../../../app/ConfigJeePlatform'

const domainJeeRequest = appConfig.domainJeeRequest
const apiGetDSGuiYeuCau = 'api/YeuCau/getDSYeuCauGui?'
const apiLoaiHinhThuc = 'api/LoaiYeuCau/getDSLoaiHinhThucCaNhan?'
const apiGetChiTietLoaiYeuCau = 'api/LoaiYeuCau/getLoaiYeuCauTheoId?'
const apiGetControls = 'api/LoaiYeuCau/getControls?'
const apiDanhDau = 'api/YeuCau/DanhDauYeuCau?'
const apiGetChiTietYeuCau = 'api/YeuCau/loadChiTietYeuCau?'
const apiDSBinhLuan = 'api/YeuCau/loadChiTietBinhLuan?'
const apiBinhLuan = 'api/YeuCau/BinhLuan'
const apiTraLoiBinhLuan = 'api/YeuCau/TraLoiBinhLuan'
const apiXoaYeuCau = 'api/YeuCau/XoaYeuCau?'
const apiGetChiTietItem = 'api/LoaiYeuCau/GetValueList?'
const apiGuiYeuCau = 'api/YeuCau/LuuData'
const apiLoadChiTietControl = 'api/YeuCau/loadChiTietConTrol?'
const apiChinhSuaYeuCau = 'api/YeuCau/ChinhSuaYeuCau'
const apiGetTopPicId = 'api/YeuCau/topicObjectID'
const apiDanhDauYeuCauGui = 'api/YeuCau/DanhDauYeuCauGui?'

async function getDSGuiYeuCau(pageNumber = 1, pageSize = 10, keys = '', values = '0') {
    keys = keys == '' ? 'status' : keys;
    let paramres = `pageNumber=${pageNumber}&pageSize=${pageSize}&filter.keys=${keys}&filter.vals=${values}`;
    let res = await Utils.CallAPI(domainJeeRequest + apiGetDSGuiYeuCau + paramres, 'GET');
    return res
}
async function getLoaiHinhThucCaNhan(pageNumber, pageSize, keys, values) {
    let paramres = `pageNumber=${pageNumber}&pageSize=${pageSize}${keys}${values}`;
    let res = await Utils.CallAPI(domainJeeRequest + apiLoaiHinhThuc + paramres, "GET");
    return res
}
async function getChiTietGuiYeuCau(id_loaiyeucau = '') {
    let id = 'id_loaiyeucau=' + id_loaiyeucau
    let res = await Utils.CallAPI(domainJeeRequest + apiGetChiTietLoaiYeuCau + id, "GET");
    return res
}
async function getControls(id_loaiyeucau = 10117, pageNumber = '1', pageSize = '10') {
    let paramres = `sortOrder=asc&sortField=&pageNumber=${pageNumber}&pageSize=${pageSize}&filter.keys=Id_LoaiYeuCau&filter.vals=${id_loaiyeucau}`
    let res = await Utils.CallAPI(domainJeeRequest + apiGetControls + paramres, "GET");
    return res
}
async function postDanhDau(value = '', id = '') {
    let paramres = `value=${value}&id=${id}`
    let res = await Utils.CallAPI(domainJeeRequest + apiDanhDau + paramres, 'POST');
    return res
}
async function postDanhDauYeuCauGui(value = '', id = '') {
    let paramres = `value=${value}&id=${id}`
    let res = await Utils.CallAPI(domainJeeRequest + apiDanhDauYeuCauGui + paramres, 'POST');
    return res
}
async function getChiTietYeuCau(id_loaiyeucau, NodeID) {
    let paramres = `idRowYeuCau=${id_loaiyeucau}&NodeID=${NodeID}`
    let res = await Utils.CallAPI(domainJeeRequest + apiGetChiTietYeuCau + paramres, 'GET');
    return res
}
async function getDSBinhLuan(ID_YeuCau, pageNumber = 1, pageSize = 10) {
    let paramres = `ID_YeuCau=${ID_YeuCau}&sortOrder=&sortField=&pageNumber=${pageNumber}&pageSize=${pageSize}`
    let res = await Utils.CallAPI(domainJeeRequest + apiDSBinhLuan + paramres, 'GET');
    return res
}
async function postBinhLuan(strBody) {
    let res = await Utils.CallAPI(domainJeeRequest + apiBinhLuan, 'POST', JSON.stringify(strBody));
    return res
}
async function postTraLoiBinhLuan(strBody) {
    let res = await Utils.CallAPI(domainJeeRequest + apiTraLoiBinhLuan, 'POST', JSON.stringify(strBody));
    return res
}
async function postXoaYeuCau(id = 0) {
    let paramres = `id=${id}`
    let res = await Utils.CallAPI(domainJeeRequest + apiXoaYeuCau + paramres, 'POST');
    return res
}
async function getChiTietItem(id = 0) {
    let paramres = `id=${id}`
    let res = await Utils.CallAPI(domainJeeRequest + apiGetChiTietItem + paramres, 'GET');
    return res
}
async function postGuiYeuCau(strBody) {
    let res = await Utils.CallAPI(domainJeeRequest + apiGuiYeuCau, 'POST', JSON.stringify(strBody));
    return res
}
async function postChinhSuaYeuCau(strBody) {
    let res = await Utils.CallAPI(domainJeeRequest + apiChinhSuaYeuCau, 'POST', JSON.stringify(strBody));
    return res
}
async function getLoadChiTietControls(idRowYeuCau) {
    let paramres = `idRowYeuCau=${idRowYeuCau}`
    let res = await Utils.CallAPI(domainJeeRequest + apiLoadChiTietControl + paramres, 'GET');
    return res
}
async function getTopPicId(IdRequest) {
    let paramres = `?IdRequest=${IdRequest}`
    let res = await Utils.CallAPI(domainJeeRequest + apiGetTopPicId + paramres, 'GET');
    return res
}
export {
    getDSGuiYeuCau, getChiTietGuiYeuCau, getControls, postDanhDau, getChiTietYeuCau, getDSBinhLuan, postBinhLuan, postTraLoiBinhLuan,
    postXoaYeuCau, getChiTietItem, postGuiYeuCau, getLoadChiTietControls, postChinhSuaYeuCau, getLoaiHinhThucCaNhan, getTopPicId, postDanhDauYeuCauGui
}


