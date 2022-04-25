import Utils from '../app/Utils';

const LEAVE = 'API/leavelist/'
const CONTROL = 'api/controllergeneral/'
import { appConfig } from "../../src/app/ConfigJeePlatform";
const domainJeeHR = appConfig.domainJeeHR
async function getDSNghiPhep(filter_vals = '|', page = 1, record = 10, filter_keys = 'ID_HinhThuc|TenNV') {
    let res = await Utils.CallAPI(domainJeeHR + LEAVE + 'Get_DSNghiPhepApp?query.filter.keys=' + filter_keys +
        '&query.filter.vals=' + filter_vals +
        '&query.page=' + page + '&query.record=' + record + '&sortOrder=desc' + '&sortField=tungay', "GET");
    return res;
}
async function getDSTypeLeave() {
    let res = await Utils.CallAPI(domainJeeHR + CONTROL + 'GetListTypeLeave_App', "GET");
    return res;
}



export {
    getDSNghiPhep, getDSTypeLeave
}
