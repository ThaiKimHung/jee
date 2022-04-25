import Utils from "../../../app/Utils";
import { appConfig } from '../../../app/ConfigJeePlatform'

const domainJeeMeeting = appConfig.domainJeeMeeting
const apiChiTietCuocHop = 'api/Meeting/Get_ChiTietCuocHop?'
const apiDongCuocHop = 'api/Meeting/DongCuocHop?'
const apiXoaCuocHop = 'api/Meeting/XoaCuocHop?'
const apiXacNhanThamGia = 'api/Meeting/XacNhanThamGia?'
const apiTaoCongViec = 'api/Meeting/TaoCongViec'
const apiCapNhatTomTatKetLuan = 'api/Meeting/CapNhatTomTatKetLuan'

async function getChiTietCuocHop(id = 130) {
    const params = `meetingid=${id}`
    let res = await Utils.CallAPI(domainJeeMeeting + apiChiTietCuocHop + params, 'GET')
    return res
}
async function getDongCuocHop(id = 130) {
    const params = `meetingid=${id}`
    let res = await Utils.CallAPI(domainJeeMeeting + apiDongCuocHop + params, 'GET')
    return res
}
async function getXoaCuocHop(id = 130) {
    const params = `meetingid=${id}`
    let res = await Utils.CallAPI(domainJeeMeeting + apiXoaCuocHop + params, 'GET')
    return res
}
async function getXacNhanThamGia(id = 130) {
    const params = `meetingid=${id}`
    let res = await Utils.CallAPI(domainJeeMeeting + apiXacNhanThamGia + params, 'GET')
    return res
}

async function postTaoCongViec(body) {
    let strBody = JSON.stringify(body)
    let res = await Utils.CallAPI(domainJeeMeeting + apiTaoCongViec, 'POST', strBody)
    return res
}
async function postCapNhatTomTatKetLuan(body) {
    const strBody = JSON.stringify(body)
    let res = await Utils.CallAPI(domainJeeMeeting + apiCapNhatTomTatKetLuan, 'POST', strBody)
    return res
}
export {
    getChiTietCuocHop, getDongCuocHop, getXoaCuocHop, getXacNhanThamGia, postTaoCongViec, postCapNhatTomTatKetLuan
}