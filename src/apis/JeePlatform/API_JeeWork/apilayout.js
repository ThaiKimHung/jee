import Utils from "../../../app/Utils";
import { appConfig } from '../../../app/ConfigJeePlatform'

const domainJeeGobal = appConfig.domainJeeGlobal


const apiWidgets = "api/widgets/"
// https://jeeglobal-api.jee.vn/api/widgets/Get_DSNhacNho?langcode=vi
async function Get_DSNhacNho() {
    let res = await Utils.CallAPI(domainJeeGobal + apiWidgets + `Get_DSNhacNho?langcode=vi`, "GET", false, false, false);
    return res
}



export {
    Get_DSNhacNho,
}


