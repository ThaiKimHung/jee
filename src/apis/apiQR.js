import Utils from "../app/Utils";
import { nkey } from "../app/keys/keyStore";



const domain = 'https://api-hrm.vts-demo.com/'
const domainProxy = 'https://api-proxy.vts-demo.com/'
const apiUser = 'api/user/'
const apiThongKeTaiSan = 'apiscbt/qlts-khai-bao-tai-san/'
const apiLichSu = 'apiscbt/dieu-chinh-gia-tri-tai-san/'


async function Login() {
    let strBody = JSON.stringify({
        "Username": "thvl.huytran",
        "Password": "123456"
    })
    let res = await Utils.post_apiCustomQR('', domain + apiUser + 'Login', strBody, false, false);
    return res;
}


async function TS_KhaiBaoTaiSan_Detail(token, id) {

    let res = await Utils.post_apiCustomQR(token, domainProxy + apiThongKeTaiSan + `TS_KhaiBaoTaiSan_Detail?Id=${id}`, '', false, false);
    return res
}



async function ThongTinXe(token, IdMH, IDLo) {
    let res = await Utils.post_apiCustomQR(token, domainProxy + apiThongKeTaiSan + `ThongTinXe?IdMH=${IdMH}&IDLo=${IDLo}`, '', false, false);
    return res
}


async function KhauHao_History(page = 1, record = 10, MaTS, IdTS) {
    let res = await Utils.post_apiCustomQR('', domainProxy + apiThongKeTaiSan + `KhauHao_History?sortOrder=asc&sortField=&page=${page}&record=${record}&filter.keys=MaTS|IdTS&filter.vals=${MaTS}|${IdTS}`, '', false, false)
    return res
}



async function DieuChuyen_CapPhat_History(page = 1, record = 10, IdTS) {
    let res = await Utils.post_apiCustomQR('', domainProxy + apiThongKeTaiSan + `DieuChuyen_CapPhat_History?sortOrder=asc&sortField=&page=${page}&record=${record}&filter.keys=IdTS&filter.vals=${IdTS}`, '', false, false);
    return res
}


async function DieuChinhGTTS_List(page = 1, record = 10, MaTS, IdTS) {
    let res = await Utils.post_apiCustomQR('', domainProxy + apiLichSu + `DieuChinhGTTS_List?sortOrder=asc&sortField=&page=${page}&record=${record}&filter.keys=MaTS|IdTS&filter.vals=${MaTS}|${IdTS}`, '', false, false)
    return res
}


export {
    Login, TS_KhaiBaoTaiSan_Detail, ThongTinXe,
    DieuChuyen_CapPhat_History,
    KhauHao_History, DieuChinhGTTS_List
}