
import moment from "moment";
import { appConfig } from '../../../app/ConfigJeePlatform';
import { nkey } from "../../../app/keys/keyStore";
import Utils from "../../../app/Utils";
const domainJeeWork = appConfig.domainJeeWork

const apiListConGViec = "api/tp-tasks/"


async function getDSCongViecTheoDoi(keyword = '', dateDk = '', dateKt = '', collect_by = '') {

    var startDate = dateDk.length > 0 ? dateDk : '01/01/2010'
    var endDate = dateKt.length > 0 ? dateKt : moment(new Date()).format('DD/MM/YYYY')
    let id_nv = await Utils.ngetStorage(nkey.UserId, '')
    var key = 'filter.keys=groupby|keyword|id_nv|displayChild|TuNgay|DenNgay|collect_by|filter' //filter==3 là theo dõi
    var val = `&filter.vals=project|${keyword}|${id_nv}|1|01/01/2010|${endDate}|${collect_by}|3`
    let res = await Utils.CallAPI(domainJeeWork + apiListConGViec + `my-list?` + key + val, "GET", false, false);
    return res
}


export {
    getDSCongViecTheoDoi
};

