import Utils from "../../../app/Utils";
import { appConfig } from '../../../app/ConfigJeePlatform'

const domainJeeMeeting = appConfig.domainJeeMeeting
const domainJeeAdmin = appConfig.domainJeeAdmin
const apiDSNhanVien = 'api/General/LoadDSNhanVien?'
const apiDSTaiSan = 'api/taisan/Get_ListTaiSan?'
const apiDSDatPhongHop = 'api/datphonghop/Get_DSDatPhongHop?'
const apiCTCuocHopSua = 'api/Meeting/Get_ChiTietCuocHopEdit?'
const apiKT_ThoiGianDat = 'api/datphonghop/KT_ThoiGianDat'
const apiTaoCuocHop = 'api/Meeting/Insert_CuocHop'
const apiListKey = 'api/Meeting/List-Key'

async function getDSNhanVien(pageNumber = 1, pageSize = 10000) {
    const params = `sortOrder=&sortField=&pageNumber=${pageNumber}&pageSize=${pageSize}`
    let res = await Utils.CallAPI(domainJeeMeeting + apiDSNhanVien + params, 'GET')
    return res
}
async function getDSTaiSan(loai = 1) {
    const params = `loai=${loai}`
    let res = await Utils.CallAPI(domainJeeAdmin + apiDSTaiSan + params, 'GET')
    return res
}
async function getDSDatPhongHop(RoomID, TuNgay, LoaiID = 1) { //Tu ngay | Tu ngay(den ngay)
    const params = `sortOrder=asc&sortField=&pageNumber=1&pageSize=10&more=true&filter.keys=RoomID|TuNgay|DenNgay|LoaiID&filter.vals=${RoomID}|${TuNgay}|${TuNgay}|${LoaiID}`
    let res = await Utils.CallAPI(domainJeeAdmin + apiDSDatPhongHop + params, 'GET')
    return res
}
async function getCTCuocHopSua(rowid = 1) {
    const params = `meetingid=${rowid}`
    let res = await Utils.CallAPI(domainJeeMeeting + apiCTCuocHopSua + params, 'GET')
    return res
}
async function postKT_ThoiGianDat(body) {
    const strBody = JSON.stringify(body)
    let res = await Utils.CallAPI(domainJeeAdmin + apiKT_ThoiGianDat, 'POST', strBody)
    return res
}
async function postTaoCuocHop(body) {
    const strBody = JSON.stringify(body)
    let res = await Utils.CallAPI(domainJeeMeeting + apiTaoCuocHop, 'POST', strBody)
    return res
}
async function getListKey() {
    let res = await Utils.CallAPI(domainJeeMeeting + apiListKey, 'GET')
    return res
}
export {
    getDSNhanVien, getDSTaiSan, getDSDatPhongHop, getCTCuocHopSua, postKT_ThoiGianDat, postTaoCuocHop, getListKey
}

