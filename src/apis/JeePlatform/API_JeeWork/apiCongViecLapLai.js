import Utils from "../../../app/Utils";
import { appConfig } from '../../../app/ConfigJeePlatform'
import { nkey } from "../../../app/keys/keyStore";
const domainJeeWork = appConfig.domainJeeWork

const apiRepeated = 'api/repeated/'
const apiWework = 'api/wework-lite/lite_project_team_byuser?'

async function Get_ListCVLL() {
    // frequency = 1 (hàng tuần)
    // frequency = 2 (Hàng tháng)
    // const api = apiRepeated + `List?sortOrder=asc&sortField=&page=${page}&record=10`
    const api = apiRepeated + `List?more=true`
    let res = await Utils.CallAPI(domainJeeWork + api, "GET", false, false);
    return res
}
// https://jeework-api.jee.vn/api/repeated/Insert
async function Tao_CongViecLapLai(body) {
    let strBody = JSON.stringify(body)
    let res = await Utils.CallAPI(domainJeeWork + apiRepeated + 'Insert', 'POST', strBody, false, false);
    return res
}

// https://jeework-api.jee.vn/api/repeated/Update
async function Update_CongViecLapLai(body) {
    let strBody = JSON.stringify(body)
    // console.log('strbody', strBody)
    let res = await Utils.CallAPI(domainJeeWork + apiRepeated + 'Update', 'POST', strBody, false, false);
    return res
}

// https://jeework-api.jee.vn/api/repeated/Update
async function Get_DetailCongViec(id) {
    let res = await Utils.CallAPI(domainJeeWork + apiRepeated + `Detail?id=${id}`, 'GET');
    return res
}

// https://jeework-api.jee.vn/api/repeated/Delete?id=44
async function DeleteCongViec(id) {
    let res = await Utils.CallAPI(domainJeeWork + apiRepeated + `Delete?id=${id}`, "GET");
    return res
}

// https://jeework-api.jee.vn/api/repeated/forcerun?id_repeated=61
async function Repeated(id) {
    let res = await Utils.CallAPI(domainJeeWork + apiRepeated + `forcerun?id_repeated=${id}`, "GET");
    return res
}
export {
    Get_ListCVLL, Tao_CongViecLapLai, DeleteCongViec, Update_CongViecLapLai, Get_DetailCongViec, Repeated
}