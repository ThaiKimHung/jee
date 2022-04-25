import Utils from '../app/Utils';
import { nGlobalKeys } from '../app/keys/globalKey';

const LEAVE = 'API/tonghopphep/'
const CONTROL = 'api/controllergeneral/'
import { appConfig } from "../../src/app/ConfigJeePlatform";
import { nkey } from '../app/keys/keyStore';
const domainJeeHR = appConfig.domainJeeHR

async function getDSPhepTon(filter_vals = '2018', page = 1, record = 10, filter_keys = 'Nam|ID_HinhThuc') {
    let res = await Utils.CallAPI(domainJeeHR + LEAVE + 'Get_ChiTietTongHopPhepApp?query.filter.keys=' + filter_keys +
        '&query.filter.vals=' + filter_vals +
        '&query.page=' + page + '&query.record=' + record, "GET");
    return res;
}
async function getChiTietPhepTon(filter_vals = '2018|11111', page = 1, record = 10, filter_keys = 'Nam|ID_NV|ID_HinhThuc') {
    let res = await Utils.CallAPI(domainJeeHR + LEAVE + 'Get_ChiTietTongHopPhep?query.filter.keys=' + filter_keys +
        '&query.filter.vals=' + filter_vals +
        '&query.page=' + page + '&query.record=' + record, "GET");
    return res;
}


async function getListNam() {
    let res = await Utils.CallAPI(domainJeeHR + CONTROL + 'GetListYearByEmp?id_nv=' + await Utils.ngetStorage(nkey.Id_nv, ''), "GET")
    return res;
}



export {
    getDSPhepTon, getListNam, getChiTietPhepTon
}
