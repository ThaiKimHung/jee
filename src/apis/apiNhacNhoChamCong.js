import Utils from "../app/Utils";
import { appConfig } from "../app/Config";
import { Platform } from "react-native";
import { nkey } from "../app/keys/keyStore";
import { nGlobalKeys } from "../app/keys/globalKey";

const domain = 'https://onesignal.com/api/v1/notifications';



async function PostNhacNhoChamCong(link, date, time, id) {
    let strBody = {
        "android_group": "",
        "app_id": appConfig.onesignalID,
        "buttons": [
            {
                "id": "Cancel",
                "text": "Bỏ qua",
                "icon": "https://image.flaticon.com/icons/png/32/1450/1450571.png"
            },
            {
                "id": "Check",
                "text": "Chấm công",
                "icon": "https://image.flaticon.com/icons/png/32/3688/3688641.png"
            }
        ],
        "contents": {
            "en": "\nChấm công là nghĩa vụ và là trách nhiệm của mỗi thành viên DPS khi có mặt ở công ty. Hãy chấm công đi"
        },
        "data": {
            "link": link
        },
        "headings": {
            "en": "🔔 Thông báo đã đến giờ chấm công"
        },
        "send_after": `${date} ${time} GMT+0700`,
        "include_player_ids": ['105cfe22-ad71-4150-be63-9e6fda88d5bc'],
        "large_icon": "https://img.onesignal.com/n/92525cef-3355-448d-b1f7-70f0713022a2.jpg"
    };
    strBody = JSON.stringify(strBody);
    let res = await Utils.post_api_OneSignal(strBody, false, false, false, 'POST');
    return res;
}

async function CancelNhacNhoChamCong(id) {
    let cancel = id + `?app_id=${appConfig.onesignalID}`;
    let res = await Utils.post_api_OneSignal(cancel, false, false, true, 'DELETE')
    return res;
}

export {
    PostNhacNhoChamCong, CancelNhacNhoChamCong
}