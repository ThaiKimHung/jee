import { appConfig } from "../app/Config";
import Utils from "../app/Utils";

async function MobileSubscribe(fullname, email, mobile, company) {
    let strBody = JSON.stringify({
        "companyname": company,
        "name": fullname,
        "email": email,
        "phone": mobile
    })
    let res = await Utils.post_api_domain_Author(appConfig.domainRegister, `api/ApiSubscribe/MobileSubscribe`, strBody, false, appConfig.Authorization);
    return res;
}

async function MobileVerifyEmail(email, code) {
    let strBody = JSON.stringify({
        "email": email,
        "guid": code
    })
    let res = await Utils.post_api_domain_Author(appConfig.domainRegister, `api/ApiSubscribe/MobileVerifyEmail`, strBody, false, appConfig.Authorization);
    return res;
}

export { MobileSubscribe, MobileVerifyEmail }