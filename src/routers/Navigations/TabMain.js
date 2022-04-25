
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import * as React from 'react';
import CaiDat from '../../scJee/CaiDat/CaiDat';
import HomeScreen from '../../scJee/home/HomeScreen';
import TabHomeSocial from '../../scJee/Social/Tab/TabHomeSocial';
import TabbarJee from '../../scJee/TabBottom/tabbar';
import ThongBaoNew from '../../scJee/ThongBao/ThongBaoNew';
import { Router } from './Router';

const ScreenOptions = {
    headerMode: 'none', navigationOptions: { gesturesEnabled: false },
    cardStyleInterpolator: ({ current: { progress } }) => ({
        cardStyle: {
            opacity: progress.interpolate({
                inputRange: [0, 0.5, 0.9, 1],
                outputRange: [0, 0.25, 0.7, 1],
            }),
        },
        overlayStyle: {
            opacity: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.2],
                extrapolate: 'clamp',
            }),
        },

    }),
    ...TransitionPresets.ScaleFromCenterAndroid,

}




const StackTabHome = createStackNavigator();
const Stack_TabHome = () => {
    return (
        <StackTabHome.Navigator headerMode={'none'} >
            {/* {ManHinh_Home} */}
            <StackTabHome.Screen name={'HomeSCreen'} component={HomeScreen} />
        </StackTabHome.Navigator>
    )
}


const StackTabSocial = createStackNavigator();
const Stack_TabSocial = () => {
    return (
        <StackTabSocial.Navigator headerMode={'none'} initialRouteName={'sc_TabHomeSocial'} >
            {/* {ManHinh_Home} */}
            <StackTabSocial.Screen name={'sc_TabHomeSocial'} component={TabHomeSocial} />
            <StackTabSocial.Screen name={'sc_BinhLuan'} component={Router.BinhLuan} />
            <StackTabSocial.Screen name={'sc_LocBaiDang'} component={Router.LocBaiDang} />
            <StackTabSocial.Screen name={'sc_TaoBaiDangTheoLoai'} component={Router.TaoBaiDangTheoLoai} />
            <StackTabSocial.Screen name={'sc_TaoBaiVietMoi'} component={Router.TaoBaiVietMoi} />
            <StackTabSocial.Screen name={'sc_HomeSuKien'} component={Router.HomeSuKien} />
            <StackTabSocial.Screen name={'sc_ChiTietSuKien'} component={Router.ChiTietSuKien} />
            <StackTabSocial.Screen name={'sc_TaoBaiDang_CEO'} component={Router.TaoBaiDang_CEO} />
            <StackTabSocial.Screen name={'sc_XemBaiDangTrongNhom'} component={Router.XemBaiDangTrongNhom} />
            <StackTabSocial.Screen name={'sc_TimKiem_ThanVienNhom'} component={Router.TimKiem_ThanVienNhom} />
            <StackTabSocial.Screen name={'sc_TimKiemNhom'} component={Router.TimKiemNhom} />
            <StackTabSocial.Screen name={'sc_TaoNhom'} component={Router.TaoNhom} />
            <StackTabSocial.Screen name={'sc_ChiTietCEOLetter'} component={Router.ChiTiet_CEO_Letter} />
            <StackTabSocial.Screen name={'sc_ThemThanhVien'} component={Router.ThemThanhVien} />
            <StackTabSocial.Screen name={'sc_XemBaiDangLoc'} component={Router.XemBaiDangLoc} />
            <StackTabSocial.Screen name={'sc_ChiTietTinTuc'} component={Router.ChiTietTinTuc} />
            <StackTabSocial.Screen name={'sc_XemAnh_File'} component={Router.XemAnh_File} />

            {/* <StackTabSocial.Screen name={'Modal_ChiTietSocailNoti'} component={Router.ChiTietSocailNoti} /> */}

        </StackTabSocial.Navigator>
    )
}


const StackNoti = createStackNavigator();
const Stack_Noti = () => {
    return (
        <StackNoti.Navigator headerMode={'none'} initialRouteName={"sc_ThongBao"}  >
            {/* {ManHinh_Home} */}
            <StackNoti.Screen name={'sc_ThongBao'} component={ThongBaoNew} />
            <StackNoti.Screen name={'Modal_ChiTietThongBao'} component={Router.ChiTietThongBao} />
            {/* <StackNoti.Screen name={'Modal_ChiTietSocailNoti'} component={Router.ChiTietSocailNoti} /> */}
        </StackNoti.Navigator>
    )
}


// const StackChat = createStackNavigator();
// const Stack_Chat = () => {
//     return (
//         <StackChat.Navigator headerMode={'none'} initialRouteName={"ChatMess"}  >
//             {/* {ManHinh_Home} */}
//             <StackChat.Screen name={'ChatMess'} component={Router.ChatMess} />
//         </StackChat.Navigator>
//     )
// }
const StackChat = createStackNavigator();
const Stack_Chat = () => {
    return (
        <StackChat.Navigator headerMode={'none'} initialRouteName={"sc_Message"}  >
            <StackChat.Screen name={'sc_Message'} component={Router.ListMessage} />
            <StackChat.Screen name={'ChatMess'} component={Router.ChatMess} />
            <StackChat.Screen name={'ModalEditGroup'} component={Router.ModalEditGroup} />
        </StackChat.Navigator>
    )
}

const stackMessage = createStackNavigator();
const StackMessage = () => {
    return (
        <stackMessage.Navigator headerMode={'none'} initialRouteName={"sc_ScreenMain"}  >
            {/* {Màn hình chính Messge} */}
            <stackMessage.Screen name={'sc_ScreenMain'} component={Router.ScreenMain} />
            {/* <stackMessage.Screen name={'StackChat'} component={Stack_Chat} /> */}
            <stackMessage.Screen name={'sc_DanhBa'} component={Router.DanhBa} />
            <stackMessage.Screen name={'sc_Message'} component={Router.ListMessage} />
            <stackMessage.Screen name={'ChatMess'} component={Router.ChatMess} />
            <stackMessage.Screen name={'ModalEditGroup'} component={Router.ModalEditGroup} />

        </stackMessage.Navigator>
    )
}


const StackSetting = createStackNavigator();
const Stack_Setting = () => {
    return (
        <StackSetting.Navigator headerMode={'none'} initialRouteName={"sc_Setting"}  >
            {/* {ManHinh_Home} */}
            <StackSetting.Screen name={'sc_Setting'} component={CaiDat} />
        </StackSetting.Navigator>
    )
}

const Tab = createBottomTabNavigator();

export const TabMain = ({ navigation, route }) => {

    return (

        <Tab.Navigator
            lazy
            tabBar={props => (<TabbarJee {...props} />)}
            initialRouteName={'tab_Home'} >
            <Tab.Screen name="tab_Social"
                component={Stack_TabSocial}
                options={({ route }) => ({
                    tabBarVisible: false
                })}
            />
            <Tab.Screen name="tab_Noti" component={Stack_Noti} />
            <Tab.Screen name="tab_Home" component={Stack_TabHome} />
            <Tab.Screen
                options={({ route }) => ({
                    tabBarVisible: false
                })}
                name="tab_Mesage" component={StackMessage} />
            <Tab.Screen name="tab_Setting" component={Stack_Setting} />
        </Tab.Navigator>
    )
}

