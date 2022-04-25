import { appConfig } from '../app/Config';
import { nkey } from '../app/keys/keyStore';
import Utils from '../app/Utils';



const thietlapchamcongcamerahanet = "api/thietlapchamcongcamerahanet/"
const controllergeneral = 'api/controllergeneral/'




async function Get_QuyenHanet() {
    let res = await Utils.get_api(thietlapchamcongcamerahanet + `Check_HanetCode`, false, false, false)
    return res
}

async function Connect_Hanet(code) {
    let res = await Utils.get_api(thietlapchamcongcamerahanet + `/Connect_Hanet?code=${code}`)
    return res
}





async function Get_DSNhanVien(placeID = 0, sortBy = '') {
    // if (sortBy.length > 0) {
    //     let res = await Utils.get_api(thietlapchamcongcamerahanet + `Get_DSNhanVienList?sortOrder=asc&sortField=${sortBy}&filter.keys=placeID&filter.vals=${placeID}&query.more=true`, false, false, true);
    //     return res;
    // }
    let keys = 'keyword'
    let vals = 'bach'
    let res = await Utils.get_api(thietlapchamcongcamerahanet + `Get_DSEmployeeByPlaceID?placeID=${placeID}&LoadNhanVienChuaDKHanet=true&query.filter.keys=${keys}&query.filter.vals=${vals}` , false, false, true);
    return res;

}

async function Get_DiaDiemHN() {
    let res = await Utils.get_api(thietlapchamcongcamerahanet + `Get_DSPlaces`, false, false, false);
    return res;
}


async function Get_DSNhanVienForAdd(placeID = 0) {
    let res = await Utils.get_api(thietlapchamcongcamerahanet + `Get_DSNotRegisterByPlaceID?placeID=${placeID}`, false, false, true);
    return res;
}

// async function Get_DSNhanVienBGPhongBan() {
//     let res = await Utils.get_api(controllergeneral + `GetListSearchbyKeyWord`, false, false, false)
//     return res
// }

async function Delete_NhanVienHanet(idNV, PlaceID) {
    let body = {
        "ID_NV": idNV,
        "placeID": PlaceID
    }
    let strBody = JSON.stringify(body)
    let res = await Utils.post_api(thietlapchamcongcamerahanet + `delNhanVienChamCong`, strBody, false, false, true)
    return res
}


async function Add_NhanVien(id_nv, placeID) {
    let body = {
        "cautrucs": [],
        "nhanviens": [id_nv],
        "placeID": placeID,

    }
    let strBody = JSON.stringify(body)
    let res = await Utils.post_api(thietlapchamcongcamerahanet + `DK_DSNhanVien_NoImage_with_hanet`, strBody, false, false, false);
    return res;
}


async function Register(path, idnv, name, placeID, chucdanh) {
    try {
        const token = await Utils.ngetStorage(nkey.token, '');
        let dataBody = new FormData();
        dataBody.append("Image", { uri: path, name: 'photo.jpg', type: 'image/jpg' });
        dataBody.append("Id_nv", idnv);
        dataBody.append("Token", token);
        dataBody.append("name", name);
        dataBody.append("placeID", placeID);
        dataBody.append("chucdanh", chucdanh);
        let response = await fetch(appConfig.domain + thietlapchamcongcamerahanet + `DK_with_hanet_After`, {
            method: "post",
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            body: dataBody
        });

        const res = await response.json();
        return res;
    } catch (e) {
        Utils.nlog('error:', e);
        return -1;
    }
}

async function Update(idnv, placeID, path) {
    try {
        const token = await Utils.ngetStorage(nkey.token, '');
        let dataBody = new FormData();
        dataBody.append("ID_NV", idnv);
        dataBody.append("Token", token);
        dataBody.append("placeID", placeID);
        dataBody.append("Image", { uri: path, name: 'photo.jpg', type: 'image/jpg' });
        let response = await fetch(appConfig.domain + thietlapchamcongcamerahanet + `Update_Image_with_hanet`, {
            method: "post",
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            body: dataBody
        });
        const res = await response.json();
        return res;
    } catch (e) {
        Utils.nlog('error:', e);
        return -1;
    }
}


export {
    Get_DSNhanVien, Register, Get_DiaDiemHN, Get_DSNhanVienForAdd, Add_NhanVien,
    Delete_NhanVienHanet, Update, Get_QuyenHanet,Connect_Hanet
}
