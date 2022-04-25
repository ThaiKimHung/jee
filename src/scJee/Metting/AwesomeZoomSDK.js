import { NativeModules } from 'react-native';

const { AwesomeZoomSDK } = NativeModules;

//to see what is loaded
// Utils.nlog("=-=-=-=", NativeModules);

async function initZoom(publicKey, privateKey, domain) {
    // Utils.nlog('calling zoom', AwesomeZoomSDK);
    const response = await AwesomeZoomSDK.initZoom(publicKey, privateKey, domain);

    // Utils.nlog('Response', response);
}

async function joinMeeting(displayName = "Stefan", meetingNo, password) {
    // Utils.nlog('calling zoom - join meeting', displayName, meetingNo, password);
    const response = await AwesomeZoomSDK.joinMeeting(displayName, meetingNo, password);

    // Utils.nlog('Response - Join Meeting', response);
}


async function startMeeting(meetingNumber, username, userId, jwtAccessToken, jwtApiKey) {
    // Utils.nlog('calling zoom', meetingNumber, username, userId, jwtAccessToken, jwtApiKey);
    const response = await AwesomeZoomSDK.startMeeting(meetingNumber, username, userId, jwtAccessToken, jwtApiKey);

    // Utils.nlog('Response - Start Meeting', response);
}


export { initZoom, joinMeeting, startMeeting };