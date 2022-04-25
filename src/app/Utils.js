import AsyncStorage from '@react-native-community/async-storage';
import { Alert, Linking, Image, Platform } from 'react-native';
import isUrl from 'is-url'
import { connect } from 'react-redux';
import { nkey } from './keys/keyStore';
import { appConfig } from './Config';
import * as actions from '../srcRedux/actions/index';
import { AppgetGlobal, AppgetRootGlobal, AppsetGlobal } from './data/dataGlobal';
import moment, { utc } from 'moment';
import { RootLang } from './data/locales';
import RNFS from 'react-native-fs';
import ImageEditor from "@react-native-community/image-editor";
import { nGlobalKeys } from './keys/globalKey';
import { CommonActions } from '@react-navigation/native';
import { StackActions } from '@react-navigation/native';
import QuickActions from "react-native-quick-actions";
import { appConfig as AppConfigNew } from './ConfigJeePlatform'
import { CheckTokenAfterCallAPI } from '../apis/JeePlatform/apiUser';
import { NavigationActions } from '@react-navigation/compat';
import videoExtensions from 'video-extensions';
import imageExtensions from 'image-extensions'
import path from 'path';
import NoNetWork from '../Component_old/NoNetWork';
import OneSignal from 'react-native-onesignal';
import { case_priority_0_istime, case_priority_0_notistime, case_priority_1_istime, case_priority_1_notistime, case_priority_3_istime } from '../components/NewComponents/format_TimeAgo'
import { store } from '../srcRedux/store';
import UtilsApp from './UtilsApp';

// --call API
async function post_api_domain(domain, strUrl, strBody = '', showMsg = false, tokenExten = '') {
    let isConected = getGlobal(nGlobalKeys.isConnected, true);
    if (isConected == false) {
        return {
            status: 0,
            error: {
                message: 'Vui lòng kiểm tra kết nối internet'
            }
        }
    } else {
        var smethod = 'POST';
        if (strBody == '')
            smethod = 'GET'
        let token = tokenExten == '' ? getGlobal(nGlobalKeys.loginToken, '') : tokenExten;
        try {
            const response = await fetch(domain + strUrl,
                {
                    method: smethod,
                    headers: {
                        // 'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'token': token,
                    },
                    body: strBody
                });
            const res = await response.json();
            if (res.status == 5) {
                clearInterval()
                navigate("Modal_KTDangNhap");
                return { status: 1 };
            }
            if (res.ExceptionMessage != undefined) { // edit tuỳ từng object api
                nlog('[API]Lỗi API:', res);
                return -3;
            }
            const result = handleResponse(res);
            return result;
        }
        catch (error) {
            nlog('[API]Lỗi error:', error);
            if (showMsg)
                Alert.alert('Lỗi mạng', 'Kết nối server thất bại');
            return -1;
        }
    }
}



async function post_api_domain_Author(domain, strUrl, strBody = '', showMsg = false, Authorization = '') {
    let isConected = getGlobal(nGlobalKeys.isConnected, true);
    if (isConected == false) {
        return {
            status: 0,
            error: {
                message: 'Vui lòng kiểm tra kết nối internet'
            }
        }
    } else {
        var smethod = 'POST';
        if (strBody == '')
            smethod = 'GET'
        try {

            const response = await fetch(domain + strUrl,
                {
                    method: smethod,
                    headers: {
                        // 'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': Authorization,
                    },
                    body: strBody
                });
            const res = await response.json();
            if (res.status == 5) {
                navigate("Modal_KTDangNhap");
                return { status: 1 };
            }
            if (res.ExceptionMessage != undefined) { // edit tuỳ từng object api
                nlog('[API]Lỗi API:', res);
                return -3;
            }
            const result = handleResponse(res);
            return result;
        }
        catch (error) {
            nlog('[API]Lỗi error:', error);
            if (showMsg)
                Alert.alert('Lỗi mạng', 'Kết nối server thất bại');
            return -1;
        }
    }
}

// -1 Lỗi không lấy dữ liệu, -2 lỗi không lấy được token, -3 lỗi API
async function post_api(strUrl, strBody = '{}', showMsg = false, chktoken = true, log = false) {

    let isConected = getGlobal(nGlobalKeys.isConnected, true);
    if (isConected == false) {
        return {
            status: 0,
            error: {
                message: 'Vui lòng kiểm tra kết nối internet'
            }
        }
    } else {
        var smethod = 'POST';
        if (strBody == '')
            smethod = 'GET'
        let token = ""
        if (token == '') {
            token = await ngetStorage(nkey.token, '');
        }
        if ((token == null || token.length < 3) && chktoken) {
            if (showMsg)
                Alert.alert('Bảo mật', 'Không tồn tại token người dùng');
            return -2;
        }
        try {
            let lang = await getGlobal(nGlobalKeys.lang, 'vi');
            const response = await fetch(appConfig.domain + strUrl,
                {
                    method: smethod,
                    headers: {
                        // 'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'token': token,
                        'langcode': lang
                        // 'InternalAPI': appConfig.InternalAPI
                    },
                    body: strBody
                });
            const res = await response.json();
            log == true ? console.log("=-=-=response", response) : null
            if (res.status == 0) {
                clearInterval()
                if (String(res.error.message).includes("Phiên đăng nhập hết hiệu lực")) {
                    nsetStorage(nkey.biometrics, false);
                    nsetStorage(nkey.quickChamCong, false);
                    nsetStorage(nkey.shortcut, false)
                    clearInterval(getGlobal('IntervalHome'));
                    QuickActions.clearShortcutItems();
                    navigate("Modal_KTDangNhap");
                }
            }
            if (res.status == 5) {
                // alert(2)
                nsetStorage(nkey.biometrics, false);
                nsetStorage(nkey.quickChamCong, false);
                nsetStorage(nkey.shortcut, false)
                clearInterval(getGlobal('IntervalHome'));
                nsetStorage(nkey.logout, true)
                QuickActions.clearShortcutItems();

                navigate("Modal_KTDangNhap");
                return { status: 1 };
            }
            if (res.ExceptionMessage != undefined) { // edit tuỳ từng object api
                nlog('[API]Lỗi API:', res);
                return -3;
            }
            const result = handleResponse(res);
            return result;
        }
        catch (error) {
            nlog('[API]Lỗi error:', error);
            if (showMsg)
                Alert.alert('Lỗi mạng', 'Kết nối server thất bại');
            return -1;
        }
    }

}



async function post_apiCustom(url = '', strBody = '', showMsg = false, chktoken = true, type, log = false) {
    try {
        let Content = ''
        if (type == 0) {
            Content = 'application/x-www-form-urlencoded;charset=UTF-8'
        }
        if (type == 1) {
            Content = 'formdata'
        }
        if (type == 2) {
            Content = 'application/json'
        }
        let token = getGlobal(nGlobalKeys.loginToken, '');
        if (token == '') {
            token = await ngetStorage(nkey.token, '');
        }
        var smethod = 'POST';
        if (strBody == '')
            smethod = 'GET'
        if ((token == null || token.length < 3) && chktoken) {
            if (showMsg)
                Alert.alert('Bảo mật', 'Không tồn tại token người dùng');
            return -2;
        }
        var details = strBody
        var formBody = [];
        for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
        const response = await fetch(url,
            {
                method: smethod,
                headers: {
                    'Content-Type': Content,
                    'Accept': 'application/json',
                    'token': "916ff493-0c03-43bf-9b98-fe70654aefb0",
                },
                body: type == 2 ? strBody : formBody
            });
        const res = await response.json();
        log == true ? nlog("=-=-=response", response) : null
        const result = handleResponse(res);
        return result;
    }
    catch (error) {
        nlog('[API]Lỗi error:', error);
        if (showMsg)
            Alert.alert('Lỗi mạng', 'Kết nối server thất bại');
        return -1;
    }
}


async function post_api_OneSignal(strBody = '{}', showMsg = false, chktoken = true, log = false, smethod = '') {
    let domain = 'https://onesignal.com/api/v1/notifications/';
    let isConected = getGlobal(nGlobalKeys.isConnected, true);
    if (isConected == false) {
        return {
            status: 0,
            error: {
                message: 'Vui lòng kiểm tra kết nối internet'
            }
        }
    } else {

        try {
            const response = await fetch(domain,
                {
                    method: smethod,
                    headers: {
                        // 'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': appConfig.APIKEYONESIGNAL,
                        // 'InternalAPI': appConfig.InternalAPI
                    },
                    body: strBody
                });
            const res = await response.json();
            return res
            // if (res?.error) {


            //     // nsetStorage(nkey.biometrics, false);
            //     // nsetStorage(nkey.quickChamCong, false);
            //     // nsetStorage(nkey.shortcut, false)
            //     // clearInterval(getGlobal('IntervalHome'));
            //     // QuickActions.clearShortcutItems();
            //     // navigate("Modal_KTDangNhap");
            //     return { status: 0 }

            // }
            // if (res?.id) {
            //     // alert(2)
            //     // nsetStorage(nkey.biometrics, false);
            //     // nsetStorage(nkey.quickChamCong, false);
            //     // nsetStorage(nkey.shortcut, false)
            //     // clearInterval(getGlobal('IntervalHome'));
            //     // nsetStorage(nkey.logout, true)
            //     // QuickActions.clearShortcutItems();

            //     // navigate("Modal_KTDangNhap");
            //     return { status: 1 };
            // }
            // if (res.ExceptionMessage != undefined) { // edit tuỳ từng object api
            //     nlog('[API]Lỗi API:', res);
            //     return -3;
            // }
            // const result = handleResponse(res);
            // return result;
        }
        catch (error) {
            nlog('[API]Lỗi error:', error);
            if (showMsg)
                Alert.alert('Lỗi mạng', 'Kết nối server thất bại');
            return -1;
        }
    }

}


// -1 Lỗi không lấy dữ liệu, -2 lỗi không lấy được token, -3 lỗi API
async function get_api(strUrl, showMsg = false, chktoken = true, log = false) {
    const res = await post_api(strUrl, '', showMsg, chktoken, log);
    return res;
}

async function get_apiCustom(strUrl, showMsg = false, chktoken = true, type = 2, log = false) {
    const res = await post_apiCustom(strUrl, '', showMsg, chktoken, type, log);
    return res;
}

// -- custom AynsStore
function ngetParam(nthis, keys, defaultValue) {
    if (nthis.props.route.params) {
        if (nthis.props.route.params.hasOwnProperty(keys) && nthis.props.route?.params[keys] != undefined && nthis.props.route?.params[keys] != null) {
            return nthis.props.route?.params[keys];
        } else {
            return defaultValue
        }
    } else {
        return defaultValue;
    }
}


// --


//--Thông số cấu hình mặc

function nlog(...val) {
    console.log(...val);
}

// -- custom AynsStore
async function ngetStorage(keys, defaultValue = null) {
    let temp = await AsyncStorage.getItem(keys);
    if (temp == null)
        return defaultValue;
    try {
        let tempValue = JSON.parse(temp);
        return tempValue;
    } catch (error) {
        return temp;
    }

}

async function nsetStorage(keys, value) {
    if (typeof (value) !== 'string')
        value = JSON.stringify(value);
    await AsyncStorage.setItem(keys, value);
}
// --navigation, [core] pass param on all of app
function goscreen(nthis, routeName, param = null) {
    try {

        if (param == null)
            nthis.props.navigation.navigate(routeName,
                { lang: nthis.lang });
        else nthis.props.navigation.navigate(routeName,
            { ...param, lang: nthis.lang });
    } catch (error) {
    }

}

function goscreenPush(nthis, routeName, param = null) {
    if (param == null)
        nthis.props.navigation.push(routeName,
            { lang: nthis.lang });
    else nthis.props.navigation.push(routeName,
        { ...param, lang: nthis.lang });
}

function goscreenReplace(nthis, routeName, param = null) {
    if (param == null)
        nthis.props.navigation.replace(routeName,
            { lang: nthis.lang });
    else nthis.props.navigation.replace(routeName,
        { ...param, lang: nthis.lang });
}


function goback(nthis, routeName = '') {
    if (routeName == '')
        nthis.props.navigation.goBack();
    else nthis.props.navigation.goBack(routeName);
}

function toggleDrawer(nthis, isClose = false, mode = 'toggleDrawer') {
    if (isClose)
        nthis.props.navigation.closeDrawer();
    else {
        nthis.props.navigation[mode]();
    }
}

// -- Alert native, custom call func
function msgAlert(title, message = '', btnTextOk = 'OK', onPress = () => { }) {
    setTimeout(() => {
        Alert.alert(title, message, [{ text: btnTextOk, onPress }]);
    }, 520);
}

function msgAlertYesNo(title, message = '', btnTextYes = RootLang.lang.thongbaochung.xacnhan,
    btnTextNo = RootLang.lang.thongbaochung.xemlai, funcYes = () => { },
    funcNo = function () {
    }) {
    Alert.alert(
        title,
        message,
        [
            { text: btnTextNo, onPress: funcNo },
            { text: btnTextYes, onPress: funcYes, style: 'cancel' }
        ],
        { cancelable: false }
    )
}

// -- Alert custom 
function showMsgBoxOK(nthis, title = '', message = '', btnTextOk = 'OK', onPressOK = () => { }, isdelete = false) {
    goscreen(nthis, 'Modal_MsgBox', { title, message, buttons: [{ text: btnTextOk, onPress: onPressOK }], isdelete, dataMsgBox: nthis.dataMsgBox });
}

function showMsgBoxOKScreen(nthis, title = '', message = '', btnTextOk = 'OK', onPressOK = () => { }, isdelete = false) {
    goscreen(nthis, 'sc_MsgBox', { title, message, buttons: [{ text: btnTextOk, onPress: onPressOK }], isdelete, dataMsgBox: nthis.dataMsgBox });
}

function showMsgBoxYesNo(nthis, title, message = '', btnTextOk = 'OK', btnTextCancel = 'Cancel', onPressOK = () => { }, onPressCancel = () => { }, isdelete = false) {
    goscreen(nthis, 'Modal_MsgBox', { title, message, buttons: [{ text: btnTextOk, onPress: onPressOK }, { text: btnTextCancel, onPress: onPressCancel }], isdelete, dataMsgBox: nthis.dataMsgBox });
}
function showMsgBoxYesNoVerImg(nthis, title, message = '', btnTextOk = 'OK', btnTextCancel = 'Cancel', imgOK = undefined, imgCancel = undefined, onPressOK = () => { }, onPressCancel = () => { },
    isdelete = false, goBack = false, disable = false, colorButtonLeft = undefined, colorButtonRight = undefined) {
    goscreen(nthis, 'Modal_MsgBox', {
        title, message, buttons: [{ text: btnTextOk, img: imgOK, onPress: onPressOK }, { text: btnTextCancel, img: imgCancel, onPress: onPressCancel }],
        isdelete, goBack, disable, dataMsgBox: nthis.dataMsgBox, colorButtonLeft, colorButtonRight
    });
}

// -- get domain from a link. ex: abc.com/home/abc -> abc.com
function getDomain(url) {
    if (url == undefined || url == null)
        url = '';
    len = 0;
    count = 0;
    for (let index = 0; index < url.length; index++) {
        const element = url[index];
        if (element == '/')
            count++;
        if (count == 3)
            break;
        len++;
    }
    return url.substr(0, len);
}

// -- check the link is a uri
function isUrlCus(val) {
    if (isUrl(val))
        return val;
    urls = ['google.com',
        'facebook.com',
        'youtube.com',
        'zing.vn',
        'vnexpress.net',
        '24h.com.vn',
        'dkn.tv',
        'amazon.com',
        'webtretho.com',
        'wikipedia.org']
    for (let i = 0; i < urls.length; i++) {
        if (val.toLowerCase().indexOf(urls[i]) == 0) {
            return 'http://' + urls[i];
        }
    }
    return '';
}

// -- open uri on Website in App
function openWebInApp(nthis, link, params) {
    let optionDef = { //option default
        istitle: false,
        title: '',
        isEditUrl: false,
        isHtml: false
    };
    goscreen(nthis, 'Modal_BrowserInApp', { goback: goback, link, ...optionDef, ...params });
}

// --format
function formatMoney(value) {
    var stemp = '';
    var svalue = value.toString();
    let icount = 0;
    for (var i = svalue.length - 1; i >= 0; i--) {
        stemp = svalue[i] + stemp;
        icount++;
        if (icount == 3 && i > 0) {
            icount = 0;
            stemp = ',' + stemp;
        }
    }
    return stemp;
}

function inputMoney(value, isNeg = false, dec = 9) {
    if (value == undefined)
        value = '0';
    let stemp = '';
    let svalue = value.toString();
    //check dấu âm
    let iam = "";
    if (isNeg && svalue.length > 0 && svalue[0] == '-') {
        iam = "-";
    }
    //xoá ký tự khác số trước khi format
    for (let i = 0; i < svalue.length; i++) { //xoá tất cả kí tự không phải là số hợp lệ
        let tchar = svalue[i];
        if (tchar != '.' && isNaN(parseInt(tchar)))
            while (true) {
                svalue = svalue.replace(tchar, "");
                if (!svalue.includes(tchar)) {
                    i = i - 1;
                    break;
                }
            };
    }
    //kiểm tra lấy thập phân
    let mval = svalue.split('.');
    let thapphan = '';
    if (mval.length >= 2) {
        svalue = mval[0].slice();
        thapphan = mval[1];
        if (dec != 0 && thapphan == '')
            thapphan = '.';
        else {
            thapphan = thapphan.substr(0, thapphan.length < dec ? thapphan.length : dec);
            thapphan = '.' + thapphan;
        }
    }
    //format chuỗi số
    if (!isNaN(parseFloat(svalue)))
        svalue = parseFloat(svalue).toString();
    let icount = 0;
    for (let i = svalue.length - 1; i >= 0; i--) {
        stemp = svalue[i] + stemp;
        icount++;
        if (icount == 3 && i > 0) {
            icount = 0;
            stemp = ',' + stemp;
        }
    }
    if (stemp == '')
        stemp = "0";
    else
        stemp = iam + stemp;
    return stemp + thapphan;
}

function formatNumber(value) {
    if (value == null || value == undefined || value == '' || isNaN(parseFloat(value)))
        value = '0';
    for (let i = 0; i < value.length; i++) {
        const inum = value[i];
        if (isNaN(parseFloat(inum)) && inum != ".") {
            value = value.replace(inum, "");
            i--;
        }
    }
    return parseFloat(value);
}

// -- Các hàm xử lý thao tác với biến gốc rootGlobal
// Hàm get giá trị theo keys - read only. Giá trị thay đổi không làm thay đổi giá trị root
function getGlobal(keys, defaultValue) {
    return AppgetGlobal(keys, defaultValue);
}
// Hàm get giá trị gốc theo keys - read write. Giá trị thay đổi làm thay đổi giá trị root
function getRootGlobal(keys, defaultValue) {
    return AppgetRootGlobal(keys, defaultValue);
}
// Hàm khởi tạo một biến gốc, cũng có thể dùng để thay đổi một gốc.
function setGlobal(keys, value) {
    AppsetGlobal(keys, value);
}
//--

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{1,3}))$/;
    return re.test(email);
}

let resTrue = (res = {}, message = 'Xử lý thành công') => {

    return {
        status: 1,
        title: 'Thông báo',
        message,
        ...res
    }
}

let resFalse = (res = null, message = 'Xử lý thất bại') => {
    try {
        if (res.data != undefined || res.error != undefined || res.status != undefined || res.message != undefined)
            return {
                data: null,
                status: 0,
                title: 'Cảnh báo',
                message,
                ...res
            }
        return {
            data: res,
            status: 0,
            title: 'Cảnh báo',
            message
        }
    } catch (error) {
        return {
            data: res,
            status: 0,
            title: 'Cảnh báo',
            message
        }
    }
}

let resEmpty = (message = 'Vui lòng nhập đủ dữ liệu!') => {
    return {
        data: null,
        status: -1,
        title: 'Cảnh báo',
        message
    }
}


/**
 * Hàm xử lý dữ liệu trả về từ api
 * @param {*} res response api trả về hoặc các trường hợp lỗi internet trả về -1 và -2.
 */
function handleResponse(res) {
    if (res < 0 || res.status == undefined)
        return resFalse(res);
    if (res.status >= 1) {
        return resTrue(res);
    }
    return resFalse(res);
}

function handleSelectedDate(date) {
    let str = date.toString().split(' ');
    let selectedDate = str[2] + ' ' + str[1] + ' ' + str[3];
    return selectedDate;
}

function getNumberStar(numberStar) { // example numberStar = '2est'
    let sl = Number.parseInt(numberStar);
    if (Number.isNaN(sl)) return sl = 0;
    return sl;
}

function formatPhoneCode(phoneCode) {
    let value = phoneCode;
    if (value[0] != '+') {
        value = '+' + value;
    }
    return value;
}

function formatDate(dates, format, location = RootLang._keys) {
    return moment(dates).format(format);
}

// tính khoảng cách giữa 2 ngày
function datesDiff(date1, date2, isSecond = false, isFloat = false) {
    date1 = new Date(date1);
    date2 = new Date(date2);
    //isFloat:trả về số lẻ or nguyên, mặc định trả về số nguyên 
    //isSecond:trả ngày or giây,  mặc dinh trả về số ngày days  
    let oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    if (isSecond)
        oneDay = 1000;
    let diffDays = Math.round(Math.abs((date2.getTime() - date1.getTime()) / (oneDay)));
    if (isFloat)
        diffDays = Math.abs((date2.getTime() - date1.getTime()) / (oneDay));
    return diffDays;
};
// truyền vào second trả về mảng [day, hour, minute, second]
function sformat(s) {
    let fm = [
        Math.floor(s / 60 / 60 / 24), // DAYS
        Math.floor(s / 60 / 60) % 24, // HOURS
        Math.floor(s / 60) % 60, // MINUTES
        s % 60 // SECONDS
    ];
    return fm
}
// làm tròn rating , max Rating là 5. 
function roundRating(number) {
    let rating = null;
    if (`${number}`.length <= 3) {
        rating = number.toFixed(1);
        return rating;
    }
    else {
        rating = Math.floor(number * 10 + 1) / 10;
        return rating;
    }
};

function AdultChildrenRoom(adults = 1, children = 0, rooms = 1) {
    const data = `${adults} ${RootLang.lang.Adult}, ${children.length == 0 ? '' : children.length}${children.length == 0 ? '' : RootLang.lang.Children}${children.length == 0 ? '' : children.length != 0 && rooms != '' ? ', ' : ''}${rooms} ${rooms != '' ? RootLang.lang.rooms : ''}`
    return data;
}

/**
 * @description Mở link url 
 * @param {*} url 
 */


/**
 * @description Trả về queryStrings cho param phương thức get.
 * @param {*} param Là 1 object chứa các param của phương 
 */
function objToQueryString(param) {
    const keyValuePairs = [];
    for (const key in param) {
        keyValuePairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(param[key]));
    }
    return keyValuePairs.join('&');
}
function connectRedux(Component, StateToProps = null, isActions = false) {
    return connect(StateToProps, isActions ? actions : null, null, { forwardRef: true })(Component);
}
function openUrl(url) {
    Linking.canOpenURL(url).then(supported => {
        if (!supported) {
            return false;
        } else {
            Linking.openURL(url);
            return true;

        }
    }).catch(err => {
        return false;
    });
}

//--parseBase64_Custom: tính năng resize chỉ dùng riêng cho chức năng chấm công, dùng cho chức năng khác thì kt lại
async function parseBase64_Custom(files = {}, heightResize = 0, widthResize = 0,
    downSize = 0.3, isVideo = false, isBase64 = true) {
    let { uri = '', height = 0, width = 0 } = files; // giá trị mặc định của data files
    try {
        let uriReturn = uri;
        if (!isVideo) {
            if (heightResize != 0)
                height = height - 120 * (Platform.OS == 'ios' ? 4 : 2) * 1.328147;
            uriReturn = await ImageEditor.cropImage(
                uri,
                {
                    offset: { x: 0, y: 0 },
                    size: { width, height },
                    displaySize: { width: (widthResize ? widthResize * downSize : width), height: (heightResize ? heightResize * downSize : height) },
                    resizeMode: 'cover'
                }
            );
        }
        if (Platform.OS == 'ios' && isVideo) {
            const dest = `${RNFS.TemporaryDirectoryPath}${Math.random().toString(36).substring(7)}.mp4`;
            uriReturn = await RNFS.copyAssetsVideoIOS(uri, dest);

        }
        if (uriReturn && isBase64) {
            //-------
            try {
                const data64 = await RNFS.readFile(uriReturn, 'base64');
                //POSTDATA
                return data64;
            } catch (error) {
                nlog('error-----:', error)
                return '';
            };
        };
        return uriReturn;
    } catch (cropError) {
        nlog('error----- 2:', cropError);
        return '';
    };

}

async function parseBase64(uri, isVideo = false) {
    try {
        let uriReturn = uri;
        if (!isVideo) {
            uriReturn = await uri
        }
        else {
            if (Platform.OS == 'ios') {
                const dest = `${RNFS.TemporaryDirectoryPath}${Math.random().toString(36).substring(7)}.mp4`;
                uriReturn = await RNFS.copyAssetsVideoIOS(uri, dest);
            }
            else {
                // RNFetchBlob.fs.readFile(uriReturn, 'base64')
                //     .then((data) => {
                //         nlog("gia tri data base 64", data)
                //     })
                // nlog("gia tri file", uriReturn)
            }
        }
        if (uriReturn) {
            //-------
            try {

                const data64 = await RNFS.readFile(uriReturn, 'base64');

                //POSTDATA
                return data64;
            } catch (error) {
                nlog('error-----:', error)
                return '';
            };
        };
    } catch (cropError) {
        nlog('error----- 2:', cropError)
        return '';
    };


}

async function parseBase64_PAHT(uri, height = 0, width = 0, downSize = 0.3, isVideo = false, isFile = false) {
    try {
        nlog("gia tri uri basse64", uri)
        let uriReturn = uri;
        if (!isVideo && height != 0 && width != 0) {
            nlog("vao image")
            uriReturn = await ImageEditor.cropImage(
                uri,
                {
                    offset: { x: 0, y: 0 },
                    size: { width, height },
                    displaySize: { width: width * downSize, height: height * downSize },
                    resizeMode: 'contain'
                }
            );
        }
        if (Platform.OS == 'ios' && isVideo) {
            nlog("vao video")
            const dest = `${RNFS.TemporaryDirectoryPath}${Math.random().toString(36).substring(7)}.mp4`;
            uriReturn = await RNFS.copyAssetsVideoIOS(uri, dest);

        }
        // if(Platform.OS == 'ios' && !isVideo&&!height && !width){
        //     nlog("vao file  nha")
        //    var arr= uri.split('.')
        //     const dest = `${RNFS.TemporaryDirectoryPath}${Math.random().toString(36).substring(7)}.${arr[arr.length-1]}`;
        //     uriReturn=await RNFS.copyAssetsFileIOS(uri,dest)
        // }
        if (uriReturn) {
            nlog("vao file conf lai")
            //-------
            try {
                const data64 = await RNFS.readFile(uriReturn, 'base64');
                // console.log('data64:', data64);
                //POSTDATA
                return data64;
            } catch (error) {
                nlog('error-----:', error)
                return '';
            };
        };
    } catch (cropError) {
        nlog('error----- 2:', cropError);
        return '';
    };
}


function change_alias(alias) {
    var str = alias;
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
    str = str.replace(/ + /g, " ");
    str = str.trim();
    return str.toLowerCase();
}
let popupNotify;
function setTopLevelPopUp(navigatorRef) {
    popupNotify = navigatorRef;
}

function getPopUP() {
    return popupNotify;
}

//gán biến cục bộ để goscreen
let _navigator;

function setTopLevelNavigator(navigatorRef) {
    _navigator = navigatorRef;
}
function navigate(routeName, params = {}) {
    _navigator.dispatch(
        NavigationActions.navigate({
            name: routeName,
            params,
        }),
    );
}

async function replace(nthis, routeName) {
    try {
        nthis.props.navigation.reset({
            index: 0,
            routes: [{ name: routeName }],
        });
    } catch (error) {
        nlog('ERROR:', error);
    }
}


function PendingPromise(timePend = 1000, funcProcess = () => { return null }) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve(funcProcess());
        }, timePend)
    })
}
function removeAccents(str) {
    return String(str).normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd').replace(/Đ/g, 'D');
}



async function CallAPILogin(strUrl, smethod, strBody, logHeader) {
    let isConected = getGlobal(nGlobalKeys.isConnected, true);
    if (isConected == false) {
        return {
            status: 0,
            error: {
                message: 'Vui lòng kiểm tra kết nối internet'
            }
        }
    } else {
        try {
            const response = await fetch(AppConfigNew.domainIdentity + strUrl,
                {
                    method: smethod,
                    headers: {
                        // 'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: strBody
                });

            const res = await response.json();
            logHeader == true ? console.log("=-=-=response", response) : null
            const result = ReturnResponse(response.status, res);
            return result;
        }
        catch (error) {
            console.log('Lỗi error:', error);
            return -1;
        }
    }

}


async function CallAPI(strUrl, smethod, strBody, logHeader, StatusCode = false, Bearer = "Bearer ") {
    let isConected = getGlobal(nGlobalKeys.isConnected, true);
    // console.log('strUrl', strUrl)
    if (isConected == false) {
        return {
            status: 0,
            error: {
                message: 'Vui lòng kiểm tra kết nối internet'
            }
        }
    } else {
        return await CheckTokenAfterCallAPI(true).then(async (res) => {
            if (res.status == 1) {

                let token = await ngetStorage(nkey.access_token, '');
                // console.log('token', token)
                try {
                    const response = await fetch(strUrl,
                        {
                            method: smethod,
                            headers: {
                                // 'Accept': 'application/json',
                                'Content-Type': 'application/json',
                                'Authorization': Bearer + token,
                                'TimeZone': (new Date()).getTimezoneOffset().toString() // Này của phần JeeWork BE kêu bổ sung 
                            },
                            body: strBody
                        });
                    const res = StatusCode ? null : await response.json()
                    logHeader == true ? console.log("=-=-=response", response) : null
                    const result = ReturnResponse(response.status, res)
                    return result;
                }
                catch (error) {
                    console.log('Lỗi error:', error);
                    return -1;
                }
            }
            else {
                OneSignal.removeExternalUserId((results) => {
                    console.log('Results :', results);
                });
                await UtilsApp.SetStorageLogOut()
                _navigator.dispatch(
                    StackActions.replace("sc_login")
                );
            }
        })
    }
}

async function CallAPICus(strUrl, smethod, strBody, logHeader, StatusCode = false, tokenAI = '') { // dùng chổ user đăng ký chấm công
    let isConected = getGlobal(nGlobalKeys.isConnected, true);
    if (isConected == false) {
        return {
            status: 0,
            error: {
                message: 'Vui lòng kiểm tra kết nối internet'
            }
        }
    } else {
        return await CheckTokenAfterCallAPI(true).then(async (res) => {
            if (res.status == 1) {

                let token = tokenAI
                // console.log('token', token)
                try {
                    const response = await fetch(strUrl,
                        {
                            method: smethod,
                            headers: {
                                // 'Accept': 'application/json',
                                'Content-Type': 'multipart/form-data',
                                'token': token,
                            },
                            body: strBody
                        });
                    const res = StatusCode ? null : await response.json()
                    logHeader == true ? console.log("=-=-=response", response) : null
                    const result = ReturnResponse(response.status, res)
                    return result;
                }
                catch (error) {
                    console.log('Lỗi error:', error);
                    return -1;
                }
            }
            else {
                OneSignal.removeExternalUserId((results) => {
                    console.log('Results :', results);
                });
                _navigator.dispatch(
                    StackActions.replace("sc_login")
                );
            }
        })

    }


}
async function CallAPI_StatusDefault(strUrl, smethod, strBody, logHeader, StatusCode = false, Bearer = "Bearer ") { //Trả ra data k đổi
    let isConected = getGlobal(nGlobalKeys.isConnected, true);
    if (isConected == false) {
        return {
            status: 0,
            error: {
                message: 'Vui lòng kiểm tra kết nối internet'
            }
        }
    } else {
        return await CheckTokenAfterCallAPI(true).then(async (res) => {
            if (res.status == 1) {
                let token = await ngetStorage(nkey.access_token, '');
                try {
                    const response = await fetch(strUrl,
                        {
                            method: smethod,
                            headers: {
                                // 'Accept': 'application/json',
                                'Content-Type': 'application/json',
                                'Authorization': Bearer + token,
                                'TimeZone': (new Date()).getTimezoneOffset().toString() // Này của phần JeeWork BE kêu bổ sung 
                            },
                            body: strBody
                        });
                    const res = await response.json()
                    return res;
                }
                catch (error) {
                    console.log('Lỗi error:', error);
                    return -1;
                }
            }
            else {
                OneSignal.removeExternalUserId((results) => {
                    console.log('Results :', results);
                });
                _navigator.dispatch(
                    StackActions.replace("sc_login")
                );
            }
        })
    }
}
async function CallAPI_Get1Data(strUrl, smethod, strBody, logHeader, StatusCode = false, Bearer = "Bearer ") {
    let isConected = getGlobal(nGlobalKeys.isConnected, true);
    // console.log('strUrl', strUrl)
    if (isConected == false) {
        return {
            status: 0,
            error: {
                message: 'Vui lòng kiểm tra kết nối internet'
            }
        }
    } else {
        let token = await ngetStorage(nkey.access_token, '');
        const response = await fetch(strUrl,
            {
                method: smethod,
                headers: {
                    // 'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': Bearer + token,
                    // 'TimeZone': (new Date()).getTimezoneOffset().toString() // Này của phần JeeWork BE kêu bổ sung 
                },
                body: strBody
            });
        const res = await response.text()
        return res
    }


}

async function RefreshAPI(Root = false) {
    let isConected = getGlobal(nGlobalKeys.isConnected, true);
    if (isConected == false) {
        return {
            status: 0,
            error: {
                message: 'Vui lòng kiểm tra kết nối internet'
            }
        }
    } else {
        let refreshToken = await ngetStorage(nkey.refresh_token, '');
        try {

            const response = await fetch(AppConfigNew.domainIdentity + "user/refresh",
                {
                    method: "POST",
                    headers: {
                        // 'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': refreshToken,
                    },
                });
            if (response.status < 300 && response.status >= 200) {
                const res = await response.json();
                const result = ReturnResponse(response.status, res)
                if (result.status == 1) {
                    await nsetStorage(nkey.refresh_token, res.refresh_token);
                    await nsetStorage(nkey.access_token, res.access_token);
                    return result;
                }
                else {
                    return -1
                }
            }
            else {
                await nsetStorage(nkey.access_token, " ");
                await nsetStorage(nkey.refresh_token, " ");
                _navigator.dispatch(
                    StackActions.replace("sc_login")
                )
            }

        }
        catch (error) {
            console.log('Lỗi error:', error);
            return -1;
        }
    }


}


async function CallAPITokenStatic(strUrl, smethod, strBody, logHeader, StatusCode = false, Bearer = "Bearer ") {
    let isConected = getGlobal(nGlobalKeys.isConnected, true);
    if (isConected == false) {
        return {
            status: 0,
            error: {
                message: 'Vui lòng kiểm tra kết nối internet'
            }
        }
    } else {
        let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMmY2YzU1ZjAtMzc0ZC00NjUxLTkzZGYtODllNjAwMDYxOTgyIiwidXNlcklkIjoiNjA2ZDEyNjliNDMwNDYwMDFkZTgyZjZlIiwidXNlcm5hbWUiOiJodXlwYWQiLCJjdXN0b21kYXRhIjp7InBlcnNvbmFsSW5mbyI6eyJCaXJ0aGRheSI6IjAyLzAyLzIwMjAiLCJQaG9uZW51bWJlciI6IjA5Njc3MDQ5NzkiLCJGdWxsbmFtZSI6Ikh1eSBQYWQiLCJOYW1lIjoiUGFkIiwiQXZhdGFyIjoiIiwiSm9idGl0bGUiOiJEZXYiLCJEZXBhcnRtZW10IjoiMSJ9LCJqZWUtcmVxdWVzdCI6eyJyb2xlcyI6IiJ9LCJqZWUtd29yayI6eyJyb2xlIjpbMTM0LDI1NCwzNTRdfSwiamVlLWFjY291bnQiOnsiY3VzdG9tZXJJRCI6MTExOSwiYXBwQ29kZSI6WyJIUiIsIkFETUlOIiwiTGFuZCIsIlJFUSIsIldGIiwiV1ciXSwidXNlcklEIjo1NjYwOX0sImlkZW50aXR5U2VydmVyIjp7ImFjdGlvbnMiOlsiY3JlYXRlX25ld191c2VyIiwidXBkYXRlX2N1c3RvbV9kYXRhIiwiY2hhbmdlX3VzZXJfc3RhdGUiXX0sImFwcENvZGUiOiIiLCJhcHAtY29kZSI6IiJ9LCJpYXQiOjE2MjE1Nzk0MTgsImV4cCI6MTYyMTU3OTcxOH0.eylWadHSwvNfzHsYtKTJoW4joBB-BAN9NqQ2b63klxg"
        try {
            const response = await fetch(strUrl,
                {
                    method: smethod,
                    headers: {
                        // 'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': Bearer + token
                    },
                    body: strBody
                });
            console.log("=-=-=response", response)
            const res = StatusCode ? null : await response.json()
            logHeader == true ? console.log("=-=-=response", response) : null
            const result = ReturnResponse(response.status, res)
            return result;
        }
        catch (error) {
            console.log('Lỗi error:', error);
            return -1;
        }
    }

}






function ReturnResponse(status, res) {
    if (status < 300 && status >= 200)
        return True(res);
    else if (status == 413) {
        return Flase_BigData(res);
    }
    else
        return Flase(res);
}

let True = (res = {}, message = 'Xử lý thành công') => {
    return {
        status: 1,
        title: 'Thông báo',
        message,
        ...res
    }
}

let Flase = (res = null, message = 'Xử lý thất bại') => {
    try {
        if (res.data != undefined || res.error != undefined || res.status != undefined || res.message != undefined)
            return {
                data: null,
                status: 0,
                title: 'Cảnh báo',
                message,
                ...res
            }
        return {
            data: res,
            status: 0,
            title: 'Cảnh báo',
            message
        }
    } catch (error) {
        return {
            data: res,
            status: 0,
            title: 'Cảnh báo',
            message
        }
    }
}

let Flase_BigData = (res = null, message = 'Xử lý thất bại') => {
    try {
        if (res.data != undefined || res.error != undefined || res.status != undefined || res.message != undefined)
            return {
                data: null,
                status: -1,
                title: 'Dữ liệu bạn gửi quá lớn',
                message,
                ...res
            }
        return {
            data: res,
            status: -1,
            title: 'Dữ liệu bạn gửi quá lớn',
            message
        }
    } catch (error) {
        return {
            data: res,
            status: -1,
            title: 'Dữ liệu bạn gửi quá lớn',
            message
        }
    }
}

function cloneData(data) {
    let _data = JSON.parse(JSON.stringify(data));
    return _data;
}

function checkIsVideo(url = '') {
    const extensionsVideo = new Set(videoExtensions);
    return extensionsVideo.has(path.extname(url).slice(1).toLowerCase());
}

function checkIsImage(url = '') {
    const extensionsImage = new Set(imageExtensions);
    return extensionsImage.has(path.extname(url).slice(1).toLowerCase());
}

async function getBase64FromUrl(url) {
    const data = await fetch(url);
    const blob = await data.blob();
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
            const base64data = reader.result;
            resolve(base64data);
        }
    });
}
//Value: Thời gian (2021-06-08 14:33:12Z), Type: 1-Thời gian rút gọn, 2-Thời gian đầy đủ, 3-Đếm ngày, IsTime: true có hiện thị giờ, false không hiển thị giờ
function formatTimeAgo(Value, Type, IsTime) {
    if (Value == "" || Value == null) {
        return "";
    }
    let langcode = store.getState().changeLanguage.language;
    //Giá trị đầu vào
    let date_value = new Date(Value);
    let date_now = new Date();
    //Convert ngày về dạng string MM/dd/yyyy
    let str_tmp1 = moment(date_value).format('MM/DD/YYYY');
    let str_tmp2 = moment(date_now).format('MM/DD/YYYY');

    //Part giá trị này về lại dạng ngày
    var date_tmp1 = new Date(str_tmp1);
    var date_tmp2 = new Date(str_tmp2);
    //Tính ra số ngày
    let days = (date_tmp1.getTime() - date_tmp2.getTime()) / 1000 / 60 / 60 / 24;

    let date_return = '';

    if (Type == 1) {
        if (IsTime) {
            date_return = case_priority_1_istime(days, date_value, date_now, langcode)
        } else {
            date_return = case_priority_1_notistime(days, date_value, date_now, langcode)
        }
    }
    if (Type == 2) {
        if (IsTime) {
            date_return = case_priority_0_istime(days, date_value, date_now, langcode)
        } else {
            date_return = case_priority_0_notistime(days, date_value, date_now, langcode)
        }
    }
    if (Type == 3) {
        if (IsTime) {
            date_return = case_priority_3_istime(days, date_value, date_now, langcode)
        }
    }
    return date_return;
}

function ChuyenSangThu(day) {

    let langcode = store.getState().changeLanguage.language;
    let ngay = moment(day, "DD/MM/YYYY").format("ddd")
    let ngayChuan = ''
    if (langcode == 'vi') {
        ngayChuan = ngay
    }
    else {
        if (ngay == 'T2') {
            ngayChuan = 'Mon'
        }
        else if (ngay == 'T3') {
            ngayChuan = 'Tue'
        }
        else if (ngay == 'T4') {
            ngayChuan = 'Wed'
        }
        else if (ngay == 'T5') {
            ngayChuan = 'Thu'
        }
        else if (ngay == 'T6') {
            ngayChuan = 'Fri'
        }
        else if (ngay == 'T7') {
            ngayChuan = 'Sat'
        }
        else ngayChuan = 'Sun'
    }
    return ngayChuan;
}

function ThuNgayGio(day) {
    let ngay = moment(day).format("DD/MM/YYYY HH:mm")
    let thu = ChuyenSangThu(ngay)
    let ngayChuan = thu + " " + ngay
    return ngayChuan
}


//-------END---------
export default {
    goscreen, nlog, goback, isUrlCus, getDomain, openWebInApp, showMsgBoxOK, showMsgBoxYesNo, getRootGlobal, setGlobal,
    formatMoney, inputMoney, formatNumber, post_api, get_api, validateEmail, handleResponse, getGlobal, goscreenPush,
    resTrue, resFalse, resEmpty, toggleDrawer, handleSelectedDate, ngetStorage, nsetStorage, ngetParam,
    getNumberStar, formatPhoneCode, datesDiff, formatDate, sformat, roundRating, AdultChildrenRoom, connectRedux,
    post_api_domain, openUrl, parseBase64_Custom, change_alias, setTopLevelPopUp, getPopUP, setTopLevelNavigator, navigate,
    PendingPromise, showMsgBoxYesNoVerImg, removeAccents, post_apiCustom, get_apiCustom, parseBase64, post_api_domain_Author,
    showMsgBoxOKScreen, post_api_OneSignal, replace, CallAPILogin, CallAPI, RefreshAPI, CallAPITokenStatic, goscreenReplace,
    cloneData, checkIsVideo, checkIsImage, parseBase64_PAHT, getBase64FromUrl, CallAPICus, CallAPI_Get1Data, formatTimeAgo,
    CallAPI_StatusDefault, ChuyenSangThu, ThuNgayGio
};