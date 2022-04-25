import { appConfig } from "../app/ConfigJeePlatform";
import api from "../app/UtilisTest";
import Utils from "../app/Utils";


const config = appConfig.domainNotification

async function getDsThongBao(status = '') {
    let res = await Utils.CallAPI(appConfig.domainNotification + `notification/pull?status=${status}`, "GET");
    return res;
}

async function PostDsRead(id = '') { // đọc từng tin
    const bodyNew = JSON.stringify({
        "id": id
    })
    let res = await Utils.CallAPI(appConfig.domainNotification + `notification/read`, "POST", bodyNew, false, true);
    return res;
}
async function PostDsReadAll() { // đọc all tin
    let res = await Utils.CallAPI(appConfig.domainNotification + `notification/readall`, "POST", {}, false, true);
    return res;
}
export {
    getDsThongBao,
    PostDsRead,
    PostDsReadAll,

}