import { nkey } from "../../app/keys/keyStore";
import Utils from "../../app/Utils";
import { appConfig } from '../../app/ConfigJeePlatform'

const doaminUser = appConfig.domainIdentity
const domainJeeAccount = appConfig.domainJeeAccount


const apiUser = 'user/'

const apiRole = 'api/accountmanagement/'



async function LoginJee(Username = '', Password = '') {

    let strBody = JSON.stringify({
        "username": Username,
        "password": Password
    })
    let res = await Utils.CallAPILogin(apiUser + 'login', "POST", strBody, false);
    return res;
}
async function RegisterJee(Body) {
    let strBody = JSON.stringify(Body)
    let res = await Utils.CallAPI(domainJeeAccount + apiRole + 'createAccount', "POST", strBody);
    return res;
}

async function LogoutJee() {
    let res = await Utils.CallAPI(doaminUser + apiUser + 'logout', "POST", '', false, true, '');
    return res;
}

async function CheckRole(id) {
    let res = await Utils.CallAPI(domainJeeAccount + apiRole + `GetListAppByCustomerID?userID=${id}`, "GET", '', true);
    return res;
}

async function CheckToken() {
    let res = await Utils.CallAPI(doaminUser + apiUser + 'me', "GET", '', false, false, '');
    return res;
}


async function CheckTokenAfterCallAPI(Root = false) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", await Utils.ngetStorage(nkey.access_token, ""));
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    const response = await fetch("https://identityserver.jee.vn/user/me", requestOptions)
    const res = await response.json();
    const result = ReturnResponse(response.status, res)
    if (result.status == 1) {
        return result
    }
    else {
        return await Utils.RefreshAPI(Root).then(async (result) => {
            return result
        })

    }
}


function ReturnResponse(status, res) {
    if (status == 200)
        return True(res);
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




export {
    LoginJee, LogoutJee, CheckToken, CheckTokenAfterCallAPI, CheckRole, RegisterJee
}


