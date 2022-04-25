import Utils from "../../../app/Utils";
import { appConfig } from '../../../app/ConfigJeePlatform'

const domainJeeWork = appConfig.domainJeeWork


const apiTaoCongViec = "api/tp-tasks/"

async function postTaoCongViec(body) {
    let res = await Utils.CallAPI(domainJeeWork + apiTaoCongViec + `Insert`, "POST", body, false, true);
    return res
}

async function lite_tag(id_project_team) {
    let res = await Utils.CallAPI(domainJeeWork + `api/wework-lite/lite_tag?id_project_team=${id_project_team}`, "GET", '', false);
    return res
}

async function Delete_tag(id) {
    let res = await Utils.CallAPI(domainJeeWork + `api/tag/Delete?id=${id}`, "GET", '', false);
    return res
}

async function Insert_tag(body) {
    let res = await Utils.CallAPI(domainJeeWork + `api/tag/Insert`, "POST", body, false);
    return res
}



export {
    postTaoCongViec, lite_tag, Delete_tag, Insert_tag
}


