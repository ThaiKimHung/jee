import Utils from "../app/Utils";
// const apiNotification = `api/dashboard/Get_DSThongBao`
import { nGlobalKeys } from "../app/keys/globalKey";
const LANG = Utils ? Utils.getGlobal(nGlobalKeys.lang, 'vi') : 'vi'
const apiNotification = `api/dashboard/Get_DSThongBao?filter.keys=langcode&filter.vals=${LANG}`

async function Get_DSThongBao(id_nv = '') {
    let res = await Utils.get_api(apiNotification);
    return res;
}

export {
    Get_DSThongBao
}