import Utils from "../../../app/Utils";
import { appConfig } from '../../../app/ConfigJeePlatform'

const domainJeeMeeting = appConfig.domainJeeMeeting
const apiCHDaTao = 'api/Meeting/Get_DanhSachCuocHopCuaToi'
const apiCHThamGia = 'api/Meeting/Get_DanhSachCuocHopToiThamGia'

async function postCHDaTao(body = '') {
    const strBody = JSON.stringify(body)
    let res = await Utils.CallAPI(domainJeeMeeting + apiCHDaTao, 'POST', strBody)
    return res
}
async function postCHThamGia(body = '') {
    const strBody = JSON.stringify(body)
    let res = await Utils.CallAPI(domainJeeMeeting + apiCHThamGia, 'POST', strBody)
    return res
}
export {
    postCHDaTao, postCHThamGia
}

