
import {
    Platform
} from 'react-native';
import { appConfig } from './Config';
import { ROOTGlobal } from './data/dataGlobal';


if (appConfig.isSocketConnect) {
    //--Socket Client
    // function onLogin(data) {
    //     if (data.success === false) {
    //         console.log({ message: "oops...try a different username", data });
    //     } else {
    //         // dataApp.callData.callResponse = 'Đã kết nối';
    //         dataApp.callData.username = data.username;
    //         dataApp.callData.listUsers = data.userlist;
    //         console.log("LoginApp Successfull - User:" + data.username, dataApp.callData.listUsers);
    //     }
    // }

    //----

    dataApp.socket.on('exchange', function (data) {
        if (data.dataEx == undefined)
            ROOTGlobal.socket.emit('exchange', { 'to': fromId, 'sdp': JSON.stringify(desc) });
        else {
            if (data.dataEx.IdMsg == undefined)
                dataApp.callData.isSpeaker_Camera_Friend = data.dataEx.isCamera;
            else {
                dataApp.callData.IdMsg = data.dataEx.IdMsg;
            }
            // console.log('- exchange:', data);
        }
    });


    ROOTGlobal.socket.on('connect', function () {
        // console.log('connect socket...');
    });

    ROOTGlobal.socket.on('disconnect', function () {
        // console.log('DISconnect socket...');
    });

    // lắng nghe dữ liệu đến
    ROOTGlobal.socket.on('message', function (message) {
        // console.log('XXXX:', message);
    })

    //---END SOCKET CONNECT
}


class socketUtils {
    onCreateSocket() {
        // console.log('Socket Create!');
    }
}

export default socketUtils
//--end Socket