async function getAppCongig() {
    var val = 'api/congfigapp/GetConfig?idapp=1'
    let res = await Utils.get_api(val, false, false);
    return res;
}
export default { getAppCongig }