import Utils from "../app/Utils";
const apiEmployee = 'api/employee/'

async function Get_HinhNhanVien(id_nv = '') {
    let res = await Utils.get_api(apiEmployee + 'Get_HinhNhanVien?id_nv=' + id_nv);
    return res;
}

export {
    Get_HinhNhanVien
}