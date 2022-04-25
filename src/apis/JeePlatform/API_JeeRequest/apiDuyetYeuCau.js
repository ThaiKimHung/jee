import { nkey } from "../../../app/keys/keyStore";
import Utils from "../../../app/Utils";
import { appConfig } from '../../../app/ConfigJeePlatform'

const domainJeeRequest = appConfig.domainJeeRequest
const apiGetDSDuyetYeuCau = 'api/YeuCau/getDSYeuCauDuyet?'
const apiDuyetYeuCau = 'api/YeuCau/PheDuyetYeuCau?'
const apiDanhDauYCDuyet = 'api/YeuCau/DanhDauYeuCauDuyet?'
const apiChiTietConTrol = 'api/YeuCau/arrFilter'

async function getDSDuyetYeuCau(pageNumber = 1, pageSize = 10, sortField = '', keys = 'status', val = 0) {
    let paramres = `pageNumber=${pageNumber}&pageSize=${pageSize}&sortField=${sortField}&filter.keys=${keys}&filter.vals=${val}`;
    let res = await Utils.CallAPI(domainJeeRequest + apiGetDSDuyetYeuCau + paramres, "GET", '');
    return res
}
async function postDuyetYeuCau(ID_YeuCau, ResultID, NodeID, ResultText) {
    let paramres = `idyeucau=${ID_YeuCau}&ResultID=${ResultID}&NodeID=${NodeID}&ResultText=${ResultText}`;
    let res = await Utils.CallAPI(domainJeeRequest + apiDuyetYeuCau + paramres, 'GET');
    return res
}
async function postDanhDauYCDuyet(value = '', id = '') {
    let paramres = `value=${value}&id=${id}`
    let res = await Utils.CallAPI(domainJeeRequest + apiDanhDauYCDuyet + paramres, 'POST');
    return res
}
async function getChiTietConTrol() {
    let res = await Utils.CallAPI(domainJeeRequest + apiChiTietConTrol, 'GET');
    return res
}
export {
    getDSDuyetYeuCau, postDuyetYeuCau, postDanhDauYCDuyet, getChiTietConTrol
}


