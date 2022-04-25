// leaveapproval/getApprovalRequest;

import Utils from "../app/Utils";
const leaveapp = 'api/leaveapproval/'

async function Get_DSDuyetPhepTongHop(filter_vals = '', page = 1, record = 10, filter_keys = 'StatusID|TypeID', ) {
    var apiGet_DSDuyetPhepTonghop = leaveapp + 'getApprovalRequest?query.page=' + page + '&query.record=' + record + "&more=true";
    if (filter_vals != '') {
        apiGet_DSDuyetPhepTonghop = apiGet_DSDuyetPhepTonghop
            + '&query.filter.keys=' + filter_keys
            + '&query.filter.vals=' + filter_vals;
    }
    let res = await Utils.get_api(apiGet_DSDuyetPhep);
    return res;
}
export {
    Get_DSDuyetPhepTongHop
}