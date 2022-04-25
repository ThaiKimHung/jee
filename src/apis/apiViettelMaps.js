import { appConfig } from "../app/Config";
import Utils from "../app/Utils";

//Get Key Viettel Map bên PAHT khi key die  - domain PAHT
// async function GetConfigByCode(code = 'apiViettelMap') {
//     var val = `api/dungchung/GetConfigByCode?code=${code}`;
//     let res = await Utils.get_api(val, false, false);
//     return res;
// }

//  getAddressViettel
async function getAddressViettel(latitude = '', longitude = '') {
    let urlVM = 'https://api-maps.viettel.vn/gateway/searching/v1/place-api/reverse-geocoding?'
    let paramVM = `latlng=${latitude},${longitude}&access_token=${appConfig.apiViettelMap}`
    urlVM = urlVM + paramVM
    try {
        const response = await fetch(urlVM,
            {
                method: 'GET',
                redirect: 'follow'
            });
        const res = await response.json();
        Utils.nlog('[LOG] viettel map', res)
        if (res.ExceptionMessage != undefined) { // edit tuỳ từng object api
            Utils.nlog('[API]Lỗi API:', res);
            return -3;
        }
        let result = {
            latitude: latitude,
            longitude: longitude,
            full_address: ''
        }
        if (res.data && res.data.properties) {
            const { full_address, name } = res.data.properties
            return { ...result, full_address: full_address ? full_address : name ? name : `${latitude}, ${longitude}` }
        } else {
            return { ...result }
        }
    }
    catch (error) {
        Utils.nlog('[API]Lỗi error:', error);
        return -1;
    }
}

// getListAddressViettel
async function getListAddressViettel(input = '') {
    let url = `https://api-maps.viettel.vn/gateway/searching/v1/place-api/autocomplete?input=${input}&access_token=${appConfig.apiViettelMap}`
    try {
        const response = await fetch(url,
            {
                method: 'GET',
                redirect: 'follow'
            });
        const res = await response.json();
        if (res.ExceptionMessage != undefined) { // edit tuỳ từng object api
            Utils.nlog('[API]Lỗi API:', res);
            return -3;
        }
        return res
    }
    catch (error) {
        Utils.nlog('[API]Lỗi error:', error);
        return -1;
    }
    //----
}

// getDetailsAddress
async function getDetailsAddress(placeId = '') {
    let url = `https://api-maps.viettel.vn/gateway/searching/v1/place-api/detail?placeId=${placeId}&access_token=${appConfig.apiViettelMap}`
    try {
        const response = await fetch(url,
            {
                method: 'GET',
                redirect: 'follow'
            });
        const res = await response.json();
        if (res.ExceptionMessage != undefined) { // edit tuỳ từng object api
            Utils.nlog('[API]Lỗi API:', res);
            return -3;
        }
        return res
    }
    catch (error) {
        Utils.nlog('[API]Lỗi error:', error);
        return -1;
    }
    //----
}

export default { getAddressViettel, getListAddressViettel, getDetailsAddress }
