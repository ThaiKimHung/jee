import Utils from '../../app/Utils';
import produce from "immer";
import * as Types from '../actions/type'
import PushNotificationIOS from '@react-native-community/push-notification-ios';

var initialState = {
    isLoading: false,
    dataThongBao: [],
};
export default reducerThongBao = produce((state = initialState, action) => {
    const { payload, type } = action;
    switch (type) {
        case Types.Action_Loading_ThongBao:
            state.isLoading = true;
            break;
        case Types.Action_ThongBao_Success:
            state.isLoading = false;
            let a = Object.values(payload);
            a.splice(a.length - 3, 3);
            state.dataThongBao = a;
            if (Platform.OS == 'ios') {
                PushNotificationIOS.setApplicationIconBadgeNumber(a.length);
            }
            break;
        default:
            return state;
    }

})