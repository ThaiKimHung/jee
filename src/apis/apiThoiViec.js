import Utils from '../app/Utils';
import { appConfig } from "../../src/app/ConfigJeePlatform";
const domainJeeHR = appConfig.domainJeeHR
const ThoiViec = 'api/p_resign/';
const ChiTiet = 'api/resignapproval/'

async function GuiDonXinThoiViec(LyDo = '', NgayDuKien = '') {
    let strbody = JSON.stringify({
        "Ngay": NgayDuKien,
        "Lydo": LyDo
    })
    let res = await Utils.CallAPI(domainJeeHR + ThoiViec + 'GuiDonXinThoiViec', 'POST', strbody, false, false);
    return res;
}
async function getInfoNguoiDuyet() {
    let res = await Utils.CallAPI(domainJeeHR + ThoiViec + 'GetInfo', 'GET', false, false);
    return res;
}
async function Get_ChiTietThoiViec(rowID) {
    let res = await Utils.CallAPI(domainJeeHR + ChiTiet + 'Get_ChiTietDonThoiViec?ID=' + rowID, 'GET', false, false)
    return res;
}

async function DuyenDonThoiViec(body = {}) {
    let strBody = JSON.stringify(body)
    let res = await Utils.CallAPI(domainJeeHR + ChiTiet + 'DuyetDonThoiViec', 'POST', strBody, false, false);
    res = Utils.handleResponse(res);
    return res;
}

export {
    GuiDonXinThoiViec, getInfoNguoiDuyet, Get_ChiTietThoiViec, DuyenDonThoiViec
}