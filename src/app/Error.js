import moment from 'moment';
import { Alert, Linking, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import email from 'react-native-email';
import { setJSExceptionHandler } from 'react-native-exception-handler';
import RNRestart from 'react-native-restart';
import { appConfig } from './Config';
import Mailer from 'react-native-mail';

const date = new Date();
const systemVersion = DeviceInfo.getSystemVersion();
const brand = DeviceInfo.getBrand();


export default class AppCrash {
    static handleCrashException() {
        // JS exception handler
        const errorHandler = (e, isFatal) => {
            if (isFatal) {
                Alert.alert(
                    'Đã xảy ra lỗi không mong muốn',
                    `\nLỗi: \n${e.name} ${e.message} \n\nHãy gởi báo lỗi này với chúng tôi bằng cách gởi mail, chúng tôi sẽ cố gắng sửa chữa nó. Xin lỗi vì sự bất tiện này`,
                    [
                        {
                            text: 'Khởi động lại',
                            onPress: () => {
                                RNRestart.Restart()
                            }
                        }
                        ,
                        {
                            text: 'Gởi mail', onPress: () => AppCrash.handleEmail(e)
                        },
                    ]
                );


            } else {
                console.log(e); // So that we can see it in the ADB logs in case of Android if needed
            }
        };
        setJSExceptionHandler(errorHandler, true);
    }

    static async handleEmail(e) {
        Mailer.mail({
            subject: 'Báo lỗi app ' + appConfig.TenAppHome + " Phiên bản " + appConfig.version,
            recipients: ['nthoang7398@gmail.com'],
            body: "Vào ngày" + moment(date).format('DD/MM/YYY') + "\n\n" + "Thiết bị " + brand + "Phiên bản " + systemVersion + "\n\n" + "Lỗi " + e,
            isHTML: true,
        }, (error, event) => {
            Alert.alert(
                "Không tìm thấy ứng dụng Gmail",
                "Vui lòng tải Gmail để thực hiện tính năng này",
                [
                    { text: 'Tải về', onPress: () => Linking.openURL(Platform.OS == 'android' ? 'https://play.google.com/store/apps/details?id=com.google.android.gm&hl=en&gl=US' : 'https://apps.apple.com/us/app/gmail-email-by-google/id422689480') },
                    { text: 'Huỷ', onPress: () => RNRestart.Restart() }
                ],
                { cancelable: true }
            )
        });
    }
}


