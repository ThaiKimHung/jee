import Utils from "../../../app/Utils";
import { appConfig } from '../../../app/ConfigJeePlatform'

const domainJeeRequest = appConfig.domainJeeRequest

const apiLoaiHinhThuc = 'api/LoaiYeuCau/getDSLoaiHinhThuc?'
const apiDanhDauLoaiYC = 'api/LoaiYeuCau/DanhDauLoaiYeuCau?'
const apiDongMoLoaiYC = 'api/LoaiYeuCau/updateStatusLoaiYeuCau?'
const apiThemNhomYC = 'api/LoaiYeuCau/TaoNhomLoaiYeuCau'
const apiDSNhomYeuCau = 'api/LoaiYeuCau/getDSNhomLoaiYeuCau?'
const apiChiTietLoaiYC = 'api/LoaiYeuCau/getLoaiYeuCauTheoId?'
const apiDSQuyTrinhDuyet = 'api/quy-trinh/ds-quy-trinh-lite?'
const apiDSNhanVien = 'api/YeuCau/LoadDSNhanVien?'
const apiTaoLoaiYC = 'api/LoaiYeuCau/TaoLoaiYeuCau'
const apiControlsChiTietYC = 'api/LoaiYeuCau/getListDetail?'
const apiBatBuocMauDeXuat = 'api/LoaiYeuCau/updateCheckDetailLoaiYeuCau?'
const apiDSControls = 'api/LoaiYeuCau/GetControlList'
const apiThemMauDeXuat = 'api/LoaiYeuCau/Update_LoaiYeuCauDetails'
const apiUpdateViTriMau = 'api/LoaiYeuCau/updateViTriTuDo'
const apiXoaLoaiYC = 'api/LoaiYeuCau/XoaLoaiYeuCua?'
const apiXoaMau = 'api/LoaiYeuCau/DeleteDetailLoaiYeuCau?'
const apiUpdateViTriXuongMau = 'api/LoaiYeuCau/updateViTriXuong?'
const apiUpdateViTriLenMau = 'api/LoaiYeuCau/updateViTriLen?'
const apiUpdateLoaiYeuCau = 'api/LoaiYeuCau/UpdateLoaiYeuCau'


async function getLoaiHinhThuc(pageNumber = '', pageSize = '', keys = 'status', values = 0) {
    if (pageNumber == '' && pageSize == '') {
        pageNumber = 1
        pageSize = 999
    }
    let paramres = `pageNumber=${pageNumber}&pageSize=${pageSize}&filter.keys=${keys}&filter.vals=${values}`;
    let res = await Utils.CallAPI(domainJeeRequest + apiLoaiHinhThuc + paramres, "GET");
    return res
}
async function postDanhDauLoaiYC(value = '', id = '') {
    let paramres = `value=${value}&id=${id}`
    let res = await Utils.CallAPI(domainJeeRequest + apiDanhDauLoaiYC + paramres, 'POST');
    return res
}
async function postDongMoLoaiYC(status = '', id = '') {
    let paramres = `status=${status}&id=${id}`
    let res = await Utils.CallAPI(domainJeeRequest + apiDongMoLoaiYC + paramres, 'POST');
    return res
}
async function postThemNhomYC(strBody) {
    let res = await Utils.CallAPI(domainJeeRequest + apiThemNhomYC, 'POST', JSON.stringify(strBody), true);
    return res
}
async function getDSNhomYeuCau(pageNumber, pageSize) {
    let paramres = `pageNumber=${pageNumber}&pageSize=${pageSize}`
    let res = await Utils.CallAPI(domainJeeRequest + apiDSNhomYeuCau + paramres, 'GET');
    return res
}
async function getChiTietLoaiYC(id_loaiyeucau) {
    let paramres = `id_loaiyeucau=${id_loaiyeucau}`
    let res = await Utils.CallAPI(domainJeeRequest + apiChiTietLoaiYC + paramres, 'GET',);
    return res
}
async function getDSQuyTrinhDuyet(AppCode = 'REQ') {
    let paramres = `AppCode=${AppCode}`
    let res = await Utils.CallAPI('https://jeeflow-api.jee.vn/' + apiDSQuyTrinhDuyet + paramres, 'GET');
    return res
}
async function getDSNhanVien() {
    let paramres = `pageNumber=1&pageSize=9999`;
    let res = await Utils.CallAPI(domainJeeRequest + apiDSNhanVien + paramres, 'GET');
    return res
}
async function postTaoLoaiYC(strBody) {
    let res = await Utils.CallAPI(domainJeeRequest + apiTaoLoaiYC, 'POST', JSON.stringify(strBody));
    return res
}
async function getConTrolsChiTietYC(pageNumber = '', pageSize = '', Id_LoaiYeuCau = 0) {
    let paramres = `sortOrder=&sortField=&pageNumber=${pageNumber}&pageSize=${pageSize}&filter.keys=Id_LoaiYeuCau&filter.vals=${Id_LoaiYeuCau}`;
    let res = await Utils.CallAPI(domainJeeRequest + apiControlsChiTietYC + paramres, "GET");
    return res
}
async function postBatBuocLoaiYC(Id_row = 0, value = true) {
    let paramres = `value=${value}&Id_row=${Id_row}`;
    let res = await Utils.CallAPI(domainJeeRequest + apiBatBuocMauDeXuat + paramres, 'POST');
    return res
}
async function getDSControls() {
    let res = await Utils.CallAPI(domainJeeRequest + apiDSControls, 'GET');
    return res
}
async function postThemMauDeXuat(strBody) {
    let res = await Utils.CallAPI(domainJeeRequest + apiThemMauDeXuat, 'POST', JSON.stringify(strBody));
    return res
}
async function postUpdateViTriMau(strBody) {
    let res = await Utils.CallAPI(domainJeeRequest + apiUpdateViTriMau, 'POST', JSON.stringify(strBody));
    return res
}
async function getXoaLoaiYC(id = '') {
    let paramres = `id=${id}`;
    let res = await Utils.CallAPI(domainJeeRequest + apiXoaLoaiYC + paramres, 'GET');
    return res
}
async function postXoaMauYC(Id_row = 0, Id_LoaiYeuCau = 0, value = true) {
    let paramres = `value=${value}&Id_row=${Id_row}&Idloaiyeucau=${Id_LoaiYeuCau}`;
    let res = await Utils.CallAPI(domainJeeRequest + apiXoaMau + paramres, 'POST');
    return res
}
async function postUpdateViTriXuongMau(Id_row = 0, Id_LoaiYeuCau = 0, value = 0) {
    let paramres = `value=${value}&Id_row=${Id_row}&idloaiyeucau=${Id_LoaiYeuCau}`;
    let res = await Utils.CallAPI(domainJeeRequest + apiUpdateViTriXuongMau + paramres, 'POST');
    return res
}
async function postUpdateViTriLenMau(Id_row = 0, Id_LoaiYeuCau = 0, value = 0) {
    let paramres = `value=${value}&Id_row=${Id_row}&idloaiyeucau=${Id_LoaiYeuCau}`;
    let res = await Utils.CallAPI(domainJeeRequest + apiUpdateViTriLenMau + paramres, 'POST');
    return res
}
async function postUpdateLoaiYeuCau(strBody) {
    let res = await Utils.CallAPI(domainJeeRequest + apiUpdateLoaiYeuCau, 'POST', JSON.stringify(strBody));
    return res
}
export {
    getLoaiHinhThuc, postDanhDauLoaiYC, postDongMoLoaiYC, postThemNhomYC, getDSNhomYeuCau, getChiTietLoaiYC, getDSQuyTrinhDuyet, getDSNhanVien, postTaoLoaiYC,
    getConTrolsChiTietYC, postBatBuocLoaiYC, getDSControls, postThemMauDeXuat, postUpdateViTriMau, getXoaLoaiYC, postXoaMauYC, postUpdateViTriXuongMau, postUpdateViTriLenMau,
    postUpdateLoaiYeuCau
}


