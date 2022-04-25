import Utils from "../../../app/Utils";
import { appConfig } from '../../../app/ConfigJeePlatform'
import { nkey } from "../../../app/keys/keyStore";
import moment from "moment";
const domainJeeWork = appConfig.domainJeeWork

const apiListNhanVienCapDuoi = "api/tp-tasks/"
const apiListStatus = "api/wework-lite/"


async function getDSNhanVienCapDuoi(keyword = '', dateDk = '', dateKt = '', collect_by = '') {
    var startDate = dateDk.length > 0 ? dateDk : moment().add(-1, 'month').format('DD/MM/YYYY')
    var endDate = dateKt.length > 0 ? dateKt : moment().format('DD/MM/YYYY')
    let id_nv = await Utils.ngetStorage(nkey.UserId, '')
    // var key = 'filter.keys=groupby|keyword|id_nv|displayChild|workother|TuNgay|DenNgay|collect_by'
    // var val = `&filter.vals=project|${keyword}|${id_nv}|1|false|01/01/2010|${endDate}|${collect_by}`
    let res = await Utils.CallAPI(domainJeeWork + apiListNhanVienCapDuoi + `list-work-user-by-manager?filter.keys=id_nv|groupby|TuNgay|DenNgay|collect_by|keyword&filter.vals=${id_nv}|member|${startDate}|${endDate}|${collect_by}|${keyword}&more=true`, "GET", false, false);
    return res
}

async function getListStaus() {
    let res = await Utils.CallAPI(domainJeeWork + apiListStatus + `list-all-status-dynamic`, "GET", false, false);
    return res
}


export {
    getDSNhanVienCapDuoi, getListStaus
}


