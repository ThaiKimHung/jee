
import Utils from "../../../app/Utils";
import { appConfig } from '../../../app/ConfigJeePlatform'

const domainJeeWork = appConfig.domainJeeWork


const apiDSNhanVien = "api/wework-lite/"
const apiDSNhanVienDuAn = 'api/project-team/'

async function getListNhanVien(id, keyword) {
    let res = await Utils.CallAPI(domainJeeWork + apiDSNhanVien + `lite_account?keys=id_project_team&vals=${id}`, "GET", false, false);
    return res
}







export {
    getListNhanVien
}


