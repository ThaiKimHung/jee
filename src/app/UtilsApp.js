import Utils from "./Utils";
import { nkey } from "./keys/keyStore";
import { Platform, Linking } from "react-native";
import { nGlobalKeys } from "./keys/globalKey";
import { UpdateDeviceToken, LogoutJeeHR } from "../apis/apiUser";
import QuickActions from "react-native-quick-actions";
import _ from 'lodash'
import moment from "moment";
import AsyncStorage from "@react-native-community/async-storage";
import { showMessage } from "react-native-flash-message";
import { RootLang } from "./data/locales";
import { reText } from "../styles/size";
import { check, request, PERMISSIONS } from 'react-native-permissions';
import Voice from '@react-native-community/voice';
import 'moment/locale/vi'
import { versionIOS } from "../styles/styles";
import { Images } from "../images";

async function logOutOneSignal(nthis, isLogoutJeeHR = true) {
    let pushtoken = Utils.ngetStorage(nkey.pushToken_OneSignal, '');
    let platform = Platform.OS == 'ios' ? 'ios' : 'android'
    // let token = '8a3bdf9d-9bf4-4e32-b694-6a90ad931103'//Utils.ngetStorage(nkey.userId_OneSignal, '');
    let token = await Utils.ngetStorage(nkey.userId_OneSignal, '');
    Utils.nlog("gia tri ", token);
    let isturnon = false;
    if (pushtoken) {
        isturnon = true
    }
    let status = 1
    let IsLogout = true
    // let res = await UpdateDeviceToken(platform, token, status, isturnon, IsLogout);
    // Utils.nlog('dk onesignal', res);
    if (res && res.status == 1 && isLogoutJeeHR) {

        Utils.nlog('LogoutJeeHR', res);
        Utils.setGlobal(nGlobalKeys.loginToken, '');
        await Utils.nsetStorage(nkey.token, '')
        await Utils.nsetStorage(nkey.Password, '')
        await Utils.nsetStorage(nkey.Id_nv, '')
        await Utils.nsetStorage(nkey.menuThuongDung, [])
        await Utils.nsetStorage(nkey.menuCongViec, [])
        await Utils.nsetStorage(nkey.menuHanhChinh, [])
        await Utils.nsetStorage(nkey.menuNhanSu, [])
        await Utils.nsetStorage(nkey.menuYeuCau, [])
        await Utils.nsetStorage(nkey.biometrics, false);
        await Utils.nsetStorage(nkey.quickChamCong, false);
        await Utils.nsetStorage(nkey.shortcut, false)
        await Utils.nsetStorage(nkey.logout, true)



        clearInterval(Utils.getGlobal('IntervalHome'));
        QuickActions.clearShortcutItems();
        Utils.replace(nthis, 'sc_login');

        let res = await LogoutJeeHR();

    }
}

function showImageZoomViewer(nthis, arrImage = [], index = 0) {
    let imagesURL = [ // định dạng chuẩn
        {
            url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Image_of_none.svg/1200px-Image_of_none.svg.png',
        }
    ];


    imagesURL = [];
    if (Array.isArray(arrImage)) { //--Định dạng lại mảng nếu mảng img truyền vào ko đúng định dạng
        for (let i = 0; i < arrImage.length; i++) {
            imagesURL.push({ url: arrImage[i] });
        }
    }
    else {
        imagesURL = [{ url: arrImage }]

    }
    Utils.goscreen(nthis, 'Modal_ViewImageListShow', { ListImages: imagesURL, index });
}


function showImageZoomViewerChat(nthis, arrImage = [], index = 0) {
    let imagesURL = [ // định dạng chuẩn
        {
            url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Image_of_none.svg/1200px-Image_of_none.svg.png',
        }
    ];


    imagesURL = [];
    if (Array.isArray(arrImage)) { //--Định dạng lại mảng nếu mảng img truyền vào ko đúng định dạng
        for (let i = 0; i < arrImage.length; i++) {
            imagesURL.push({ url: arrImage[i].hinhanh });
        }
    }
    else {
        imagesURL = [{ url: arrImage.hinhanh }]

    }
    Utils.goscreen(nthis, 'Modal_ViewImageListShow', { ListImages: imagesURL, index });
}

function showImageZoomViewerr(nthis, arrImage = [], index = 0) {
    let imagesURL = [ // định dạng chuẩn
        {
            url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Image_of_none.svg/1200px-Image_of_none.svg.png',
        }
    ];
    let flag = 0
    imagesURL = [];
    if (arrImage[0].url) { //Đúng định dạng
        for (let i = 0; i < arrImage.length; i++) {
            imagesURL.push({ url: arrImage[i].url });
        }
        flag = 1
    }

    if (flag == 1)
        Utils.goscreen(nthis, 'Modal_ViewImageListShow', { ListImages: imagesURL, index });
    else
        Utils.showMsgBoxOK(nthis, 'Thông báo', 'Đã có lỗi xảy ra', 'OK')
}


function showImageZoomViewerBsse64(nthis, arrImage = [], index = 0) {


    var imagesURL = arrImage.map((res) =>

    ({
        fileName: res.filename,
        url: `data:image/png;base64,${res.strBase64}`
    })
    )
    Utils.goscreen(nthis, 'Modal_ViewImageListShowBase64', { ListImages: imagesURL, index });
}
function downloadFile(nthis, url, fileName = '', fileSize = '', fileType = '') {
    Utils.goscreen(nthis, 'Modal_DownloadFile', { url: url, fileName: fileName, fileSize: fileSize, fileType: fileType });
}

//Dùng hiện thị UI
function convertDatetime(time, fotmarMe = 'YYYY-MM-DD HH:mm:ss', fotmar = 'DD/MM/YYYY HH:mm') {
    return moment(time, fotmarMe).add(+7, 'hours').format(fotmar);
}

function convertDatetimeChat(time, fotmar = 'DD/MM/YYYY HH:mm', fotmarMe = 'YYYY-MM-DD HH:mm:ss') {
    return moment(time, fotmarMe).add(+7, 'hours').format(fotmar);

}


//Khi api trả về giờ có biến Z vd: "2021-09-15 03:16:50Z"
function convertTimeLocal(time, fotmarTime = 'DD/MM/YYYY HH:mm', fotmar = 'YYYY/MM/DD HH:mmZ') {
    return moment(time, fotmar).format(fotmarTime);
}

//Khi call API, chuyển sang giờ UTC
function convertUTC(time, fotmatTime = 'DD/MM/YYYY HH:mm') {
    let ntime = moment(time, fotmatTime).utc().format()
    return ntime
}

//Message show thông báo   //1- thành công (Xanh lá), 2- thất bại(đỏ), 3- info(Xanh dương), 4-warning(Vàng)
function MessageShow(thongbao = RootLang.lang.thongbaochung.thongbao, title = "", type = 1) {
    showMessage({
        message: thongbao,
        description: title,
        icon: type == 1 ? 'success' : type == 2 ? "danger" : type == 3 ? "info" : type == 4 ? "warning" : "default",
        titleStyle: { color: 'white', fontWeight: 'bold', fontSize: reText(14) },
        textStyle: { fontSize: reText(12), paddingRight: 5 },
        duration: 3000,
        type: type == 1 ? 'success' : type == 2 ? "danger" : type == 3 ? "info" : type == 4 ? "warning" : "default",
    });
}

async function StartVoice(nthis = {}, Stop = false, keyState = 'html') { //mặc định là gửi phản ánh state noiDungGui
    // Muốn dùng startVoice thì yêu cầu dùng biến state là noiDungGui hoặc NoiDung để lấy được text
    // Utils.nlog('nthis', nthis)
    if (!Stop) { // trường StartVoice
        try {

            nthis.oldContent = nthis.state[keyState]
            nthis.newContent = '';
            let checkPerMic = false;
            let isVoiceOK = await Voice.isAvailable();
            // Utils.nlog('isVoiceOK', isVoiceOK)
            if (Platform.OS == 'ios') {
                checkPerMic = await check(PERMISSIONS.IOS.MICROPHONE);
                // Utils.nlog('check', checkPerMic)
                if (!(checkPerMic == 'granted' && isVoiceOK == 1
                    // || nthis.checkMicFirst
                )
                ) {
                    if (checkPerMic == 'denied' && !nthis.checkMicFirst) {
                        let tempMic = await request(PERMISSIONS.IOS.MICROPHONE);
                        //--FIx TH iphone 5s
                        if (tempMic == 'denied' && versionIOS) {
                            try {
                                await Voice.start('vi');
                                // setTimeout(() => {
                                //     nthis.checkMicFirst = true;
                                //     Voice.stop();
                                // }, 1500);
                            } catch (error) {

                            }
                        }
                        //--
                    }
                    else {
                        Utils.showMsgBoxYesNo(this, 'Thông báo', 'Bạn cần cấp quyền nhận dạng giọng nói và microphone để sử dụng chức năng này.', 'Đến cài đặt', 'Đóng', () => { Linking.openURL('app-settings:') });
                    }
                    return;
                }
            } else { //Android
                const result = await check(PERMISSIONS.ANDROID.RECORD_AUDIO);
                if (result === 'denied') {
                    await request(PERMISSIONS.ANDROID.RECORD_AUDIO);
                    return;
                }
                if (result === 'blocked') {
                    Utils.showMsgBoxYesNo(this, 'Thông báo', 'Bạn cần cấp quyền  microphone để sử dụng chức năng này.', 'Đến cài đặt', 'Đóng', () => { Linking.openSettings() });
                    return;
                }
            }
            //--Code OK...
            // nthis.setState({ isLoading: true })
            await Voice.start('vi')
        } catch (error) {
            return;
        }
    }
    else { // StopVoice
        try {
            await Voice.stop();
            // nthis.setState({ isLoading: false })
        } catch (error) {
            return;

        }
    }
}

const colorPrioritize = (id) => {
    if (id == 0) return "grey"
    if (id == 1) return "#DA3849"
    if (id == 2) return '#F2C132'
    if (id == 3) return '#6E47C9'
    if (id == 4) return '#6F777F'
}

const colorDeadline = (dateDeadline, child = false) => {
    let dateToday = moment().format('YYYY-MM-DD')
    let dateDead = child ? moment(dateDeadline, 'DD/MM/YYYY HH:mm').format('DD/MM/YYYY') : moment(dateDeadline, 'DD/MM/YYYY HH:mm').format('YYYY-MM-DD')
    let timeToday = moment().format('HH:mm')
    let timeDead = child ? moment(dateDeadline, 'DD/MM/YYYY HH:mm').format('HH:mm') : moment(dateDeadline, 'DD/MM/YYYY HH:mm').format('HH:mm')
    if (dateToday == dateDead) {
        if (timeToday <= timeDead)
            return '#FF6A00'
        else
            return '#FF0000'
    }
    if (dateToday < dateDead) return '#4FC62B'
    if (dateToday > dateDead) return '#FF0000'

}

const _returnImageFile = (filename) => {
    let getItem = String(filename).split('.').slice(-1).toString()
    switch (getItem) {
        case 'jpg':
            return Images.ImageJee.icjpg
            break;
        case 'JPG':
            return Images.ImageJee.icjpg
            break;
        case 'png':
            return Images.ImageJee.icpng
            break;
        case 'PNG':
            return Images.ImageJee.icpng
            break;
        case 'JPEG':
            return Images.ImageJee.icjpeg
            break;
        case 'jpeg':
            return Images.ImageJee.icjpeg
            break;
        case 'JS':
            return Images.ImageJee.icjavacript
            break;
        case 'js':
            return Images.ImageJee.icjavacript
            break;
        case 'MP4':
            return Images.ImageJee.icmp4
            break;
        case 'mp4':
            return Images.ImageJee.icmp4
            break;
        case 'MOV':
            return Images.ImageJee.icmov
            break;
        case 'mov':
            return Images.ImageJee.icmov
            break;
        case 'PDF':
            return Images.ImageJee.icpdf
            break;
        case 'pdf':
            return Images.ImageJee.icpdf
            break;
        case 'XML':
            return Images.ImageJee.icxml
            break;
        case 'xml':
            return Images.ImageJee.icxml
            break;
        case 'ZIP':
            return Images.ImageJee.iczip
            break;
        case 'zip':
            return Images.ImageJee.iczip
            break;
        case 'html':
            return Images.ImageJee.ichtml
            break;
        case 'HTML':
            return Images.ImageJee.ichtml
            break;
        case 'doc':
            return Images.ImageJee.icdoc
            break;
        case 'DOC':
            return Images.ImageJee.icdoc
            break;
        case 'DOCX':
            return Images.ImageJee.icdoc
            break;
        case 'docx':
            return Images.ImageJee.icdoc
            break;
        case 'xls':
            return Images.ImageJee.icExcel
            break;
        case 'XLS':
            return Images.ImageJee.icExcel
            break;
        case 'xlsx':
            return Images.ImageJee.icExcel
            break;
        case 'XLSX':
            return Images.ImageJee.icExcel
            break;
        case 'xlsm':
            return Images.ImageJee.icExcel
            break;
        case 'XLSM':
            return Images.ImageJee.icExcel
            break;
        case 'csv':
            return Images.ImageJee.iccsv
            break;
        case 'CSV':
            return Images.ImageJee.iccsv
            break;
        case 'CSS':
            return Images.ImageJee.iccss
            break;
        case 'css':
            return Images.ImageJee.iccss
            break;
        case 'heic':
            return Images.ImageJee.heic
            break;
        case 'HEIC':
            return Images.ImageJee.heic
            break;
        default:
            return Images.ImageJee.icfileDefault
            break;
    }
}

const calculateImageSize = (base64String) => {
    let padding;

    if (base64String.endsWith("==")) {
        padding = 2;
    }
    else if (base64String.endsWith("=")) {
        padding = 1;
    }
    else {
        padding = 0;
    }

    const base64StringLength = base64String.length;

    const bytes = (3 * base64StringLength / 4) - padding;

    const kBytes = bytes / 1000;

    return kBytes;
}

const changeMonthEN = (thang) => {
    switch (thang) {
        case '1':
            return 'Jan'
            break;
        case '2':
            return 'Feb'
            break;
        case '3':
            return 'Mar'
            break;
        case '4':
            return 'Apr'
            break;
        case '5':
            return 'May'
            break;
        case '6':
            return 'Jun'
            break;
        case '7':
            return 'Jul'
            break;
        case '8':
            return 'Aug'
            break;
        case '9':
            return 'Sep'
            break;
        case '10':
            return 'Oct'
            break;
        case '11':
            return 'Nov'
            break;
        case '12':
            return 'Dec'
            break;
        default:
            return ''
            break;
    }
}
const changeMonthEnAbbreviation_Full = (lich, NgonNgu, type = 1) => {
    let thang = moment(lich, 'YYYY/MM/DD').format('M')
    switch (thang) {
        case '1':
            if (NgonNgu == 'vi') {
                return "Tháng 01"
            }
            else {
                if (type == 1) {
                    return 'Jan'
                } else return 'January'
            }
            break;
        case '2':
            if (NgonNgu == 'vi') {
                return "Tháng 02"
            }
            else {
                if (type == 1) {
                    return 'Feb'
                } else return 'February'
            }
            break;
        case '3':
            if (NgonNgu == 'vi') {
                return "Tháng 03"
            }
            else {
                if (type == 1) {
                    return 'Mar'
                } else return 'March'
            }
            break;
        case '4':
            if (NgonNgu == 'vi') {
                return "Tháng 04"
            }
            else {
                if (type == 1) {
                    return 'Apr'
                } else return 'April'
            }
            break;
        case '5':
            if (NgonNgu == 'vi') {
                return "Tháng 05"
            }
            else {
                if (type == 1) {
                    return 'May'
                } else return 'May'
            }
            break;
        case '6':
            if (NgonNgu == 'vi') {
                return "Tháng 06"
            }
            else {
                if (type == 1) {
                    return 'Jun'
                } else return 'June'
            }
            break;
        case '7':
            if (NgonNgu == 'vi') {
                return "Tháng 07"
            }
            else {
                if (type == 1) {
                    return 'Jul'
                } else return 'July'
            }
            break;
        case '8':
            if (NgonNgu == 'vi') {
                return "Tháng 08"
            }
            else {
                if (type == 1) {
                    return 'Aug'
                } else return 'August'
            }
            break;
        case '9':
            if (NgonNgu == 'vi') {
                return "Tháng 09"
            }
            else {
                if (type == 1) {
                    return 'Sep'
                } else return 'September'
            }
            break;
        case '10':
            if (NgonNgu == 'vi') {
                return "Tháng 10"
            }
            else {
                if (type == 1) {
                    return 'Oct'
                } else return 'October'
            }
            break;
        case '11':
            if (NgonNgu == 'vi') {
                return "Tháng 11"
            }
            else {
                if (type == 1) {
                    return 'Nov'
                } else return 'November'
            }
            break;
        case '12':
            if (NgonNgu == 'vi') {
                return "Tháng 12"
            }
            else {
                if (type == 1) {
                    return 'Dec'
                } else return 'December'
            }
            break;
        default:
            return ''
            break;
    }
}
const RenderThu = (lich, NgonNgu, type = 1) => {
    let ngay = moment(lich).format('ddd')
    switch (ngay) {
        case 'T2':
            if (NgonNgu == 'vi') {
                if (type == 1) {
                    return 'T2'
                } else return 'Thứ 2'
            }
            else {
                if (type == 1) {
                    return 'Mon'
                } else return 'Monday'
            }
            break;
        case 'T3':
            if (NgonNgu == 'vi') {
                if (type == 1) {
                    return 'T3'
                } else return 'Thứ 3'
            }
            else {
                if (type == 1) {
                    return 'Tue'
                } else return 'Tuesday'
            }
            break;
        case 'T4':
            if (NgonNgu == 'vi') {
                if (type == 1) {
                    return 'T4'
                } else return 'Thứ 4'
            }
            else {
                if (type == 1) {
                    return 'Wed'
                } else return 'Wednesday'
            }
            break;
        case 'T5':
            if (NgonNgu == 'vi') {
                if (type == 1) {
                    return 'T5'
                } else return 'Thứ 5'
            }
            else {
                if (type == 1) {
                    return 'Thu'
                } else return 'Thursday'
            }
            break;
        case 'T6':
            if (NgonNgu == 'vi') {
                if (type == 1) {
                    return 'T6'
                } else return 'Thứ 6'
            }
            else {
                if (type == 1) {
                    return 'Fri'
                } else return 'Friday'
            }
            break;
        case 'T7':
            if (NgonNgu == 'vi') {
                if (type == 1) {
                    return 'T7'
                } else return 'Thứ 7'
            }
            else {
                if (type == 1) {
                    return 'Sat'
                } else return 'Saturday'
            }
            break;
        case 'CN':
            if (NgonNgu == 'vi') {
                if (type == 1) {
                    return 'CN'
                } else return 'Chủ Nhật'
            }
            else {
                if (type == 1) {
                    return 'Sun'
                } else return 'Sunday'
            }
            break;
        default:
            return ''
            break;
    }
}
const SetStorageLogOut = async () => {
    await Utils.nsetStorage(nkey.token, '')
    await Utils.nsetStorage(nkey.access_token, '');
    await Utils.nsetStorage(nkey.biometrics, false)
    await Utils.nsetStorage(nkey.roleJeeHR, false)
    await Utils.nsetStorage(nkey.tinnoibat, [])
    await Utils.nsetStorage(nkey.listnhacnho, [])
    await Utils.nsetStorage(nkey.dataThongBao, [])
    await Utils.nsetStorage(nkey.dataContact, [])
    await Utils.nsetStorage(nkey.listBaiDang, [])
    // await Utils.nsetStorage(nkey.menuThuongDung, [])
    await Utils.nsetStorage(nkey.dataMenuPhoBien, [])
}

//-------END---------
export default {
    logOutOneSignal, showImageZoomViewer, showImageZoomViewerBsse64, showImageZoomViewerr, downloadFile, convertDatetime, convertUTC, MessageShow, showImageZoomViewerChat,
    convertTimeLocal, StartVoice, convertDatetimeChat, colorPrioritize, colorDeadline, _returnImageFile, calculateImageSize, SetStorageLogOut, changeMonthEN, changeMonthEnAbbreviation_Full, RenderThu
};