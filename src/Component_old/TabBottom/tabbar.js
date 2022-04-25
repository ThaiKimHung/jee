import PushNotificationIOS from '@react-native-community/push-notification-ios';
import * as React from "react";
import { Animated, AppState, Dimensions, Image, Linking, Platform, SafeAreaView, StyleSheet, View } from "react-native";
import OneSignal from 'react-native-onesignal';
import PushNotification from 'react-native-push-notification';
import { appConfig } from "../../app/Config";
import { RootLang } from "../../app/data/locales";
import { nGlobalKeys } from "../../app/keys/globalKey";
import Utils from "../../app/Utils";
import { Images } from "../../images";
import StaticTabbar from "./StaticTabbar";

const { width } = Dimensions.get("window");
const height = 50;


const tabWidth = width / 5;
const backgroundColor = "white";

class Tabbar extends React.Component {
  constructor(props) {
    super(props);
    nthistabhome = this;
    let tab = [
      {
        name: RootLang.lang.menu.thongbao,
        icon: Images.icBTThongBao,
        iconA: Images.icBTThongBaoA,
        screen: 'sc_ThongBaoBT',
      },
      {
        name: RootLang.lang.menu.giaiTrinhChamCong,
        icon: Images.icBTGiaiTrinh,
        iconA: Images.icBTGiaiTrinhA,
        screen: 'sc_GiaiTrinhBT'
      },
      {
        name: RootLang.lang.menu.menu,
        icon: Images.icBTTatca,
        iconA: Images.icBTTatcaA,
        screen: 'sw_HomePage'
      },
      {
        name: RootLang.lang.menu.hoso,
        icon: Images.icBTThongTinCaNhan,
        iconA: Images.icBTThongTinCaNhanA,
        screen: 'sc_InfoUser'
      },
      {
        name: RootLang.lang.menu.caidat,
        icon: Images.icBTCaiDat,
        iconA: Images.icBTCaiDatA,
        screen: 'sc_Setting'
      },
    ];
    let tab2 = tab.filter(item => {
      if (!item.LoaiHinh || item.LoaiHinh == this.LoaiHinh) {
        return true
      } else {
        return false;
      }

    });
    this.state = {
      indexTab: 2,
      ishow: true,
      tabbottom: tab,
      tabactive: tab2,
      appState: AppState.currentState,
      foreground: false,

    }

  }
  value = new Animated.Value(0);
  hide = () => {
    this.setState({ ishow: !this.state.ishow })
  }
  _handleAppStateChange = nextAppState => {
    this.onOpened = this.onOpened.bind(this);
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) (
      OneSignal.addEventListener('received', this.onReceived)
    )
    else (
      OneSignal.addEventListener('received', this.onOpened)
    )
    this.setState({ appState: nextAppState });
  };

  componentDidMount() {
    AppState.addEventListener("change", this._handleAppStateChange);
    this.onReceived = this.onReceived.bind(this);
    this.onOpened = this.onOpened.bind(this);

    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
  }
  onReceived(notification) {

    Utils.nlog("gia trị Notifi 1111-----------------------------", notification);
    let isModeMayChamCong = Utils.getGlobal(nGlobalKeys.isModeMayChamCong, false);

    if (isModeMayChamCong)
      return;
    let data = notification.payload;
    Utils.nlog("data gia trị 1111:", data)
    if (data) {
      if (data.additionalData && data.additionalData.link) {
        const arrkey = data.additionalData.link.split('/');
        const loai = data.additionalData.loai
        if (arrkey && arrkey.length >= 2) {
          switch (arrkey[arrkey.length - 2]) {
            //Cá nhân đôi ca
            case 'CN_doicalamviec': {
              Utils.getPopUP().show({
                onPress: () => Linking.openURL(`${appConfig.appDevLink}app/root/rootcn/home/CN_doicalamviec/ctDoiCaLamViec/${arrkey[arrkey.length - 1]}`),
                appIconSource: Images.JeeGreen,
                appTitle: "JeeHR",
                timeText: 'Now',
                title: data.title,
                body: data.body,
                slideOutTime: 5000
              });
            } break;
            //Xem ct giải trình đã XL
            case 'CN_giaitrinh': {
              Utils.getPopUP().show({
                onPress: () => Linking.openURL(`${appConfig.appDevLink}app/root/rootcn/home/CN_giaitrinh/ctGiaiTrinh/${arrkey[arrkey.length - 1]}`),
                appIconSource: Images.JeeGreen,
                appTitle: "JeeHR",
                timeText: 'Now',
                title: data.title,
                body: data.body,
                slideOutTime: 5000
              });
            } break;
            case 'CN_dsthongbao': {
              Utils.getPopUP().show({
                onPress: () => Linking.openURL(`${appConfig.appDevLink}app/root/rootcn/home/CN_dsthongbao/ctThongbaoNhanSu/${arrkey[arrkey.length - 1]}`),
                appIconSource: Images.JeeGreen,
                appTitle: "JeeHR",
                timeText: 'Now',
                title: data.title,
                body: data.body,
                slideOutTime: 5000
              });
            } break;
            //Xem gui don nghi phep đã XL
            case `CN_guidonxinnghiphep`: {
              Utils.getPopUP().show({
                onPress: () => Linking.openURL(`${appConfig.appDevLink}app/root/rootcn/CN_guidonxinnghiphep/ctPhep/${arrkey[arrkey.length - 1]}`),
                appIconSource: Images.JeeGreen,
                appTitle: "JeeHR",
                timeText: 'Now',
                title: data.title,
                body: data.body,
                slideOutTime: 5000
              });
            } break;
            case `sc_GuiPhepTheoBuoi`: {
              Utils.getPopUP().show({
                onPress: () => Linking.openURL(`${appConfig.appDevLink}app/root/rootcn/sc_GuiPhepTheoBuoi/ctPhep/${arrkey[arrkey.length - 1]}`),
                appIconSource: Images.JeeGreen,
                appTitle: "JeeHR",
                timeText: 'Now',
                title: data.title,
                body: data.body,
                slideOutTime: 5000
              });
            } break;
            //Xem chi tiết đổi ca làm việc
            case 'QL_duyetdoicalamviec': {
              Utils.getPopUP().show({
                onPress: () => (
                  Utils.getGlobal(nGlobalKeys.ScreenChiTiet, "") == 'QL_duyetdoicalamviec' ? Utils.goscreenPush(this, "sc_chitietDoiCa", { itemId: arrkey[arrkey.length - 1], isGoBak: true }) :
                    Linking.openURL(`${appConfig.appDevLink}app/root/rootcn/home/HDuyetRoot/ctDuyetDoiCaLamViec/${arrkey[arrkey.length - 1]}`),
                  Utils.setGlobal(nGlobalKeys.ScreenChiTiet, arrkey[arrkey.length - 2])), appIconSource: Images.JeeGreen,
                appTitle: "JeeHR",
                timeText: 'Now',
                title: data.title,
                body: data.body,
                slideOutTime: 5000
              });
            } break;
            // Chi tiết giải trình
            case 'QL_duyetgiaitrinh': {
              Utils.getPopUP().show({
                onPress: () => (
                  Utils.getGlobal(nGlobalKeys.ScreenChiTiet, "") == 'QL_duyetgiaitrinh' ? Utils.goscreenPush(this, "sc_ChiTietDuyetGiaiTrinh", { itemId: arrkey[arrkey.length - 1], isGoBak: true, idtab: 0, }) :
                    Linking.openURL(`${appConfig.appDevLink}app/root/rootcn/home/HDuyetRoot/ctDuyetGiaiTrinh/${arrkey[arrkey.length - 1]}`),
                  Utils.setGlobal(nGlobalKeys.ScreenChiTiet, arrkey[arrkey.length - 2])),
                appIconSource: Images.JeeGreen,
                appTitle: "JeeHR",
                timeText: 'Now',
                title: data.title,
                body: data.body,
                slideOutTime: 5000
              });
            } break;
            //Xem chi tiết duyệt phép
            case 'QL_duyetnghiphep': {
              Utils.getPopUP().show({
                onPress: data.additionalData.loai == 0 ? null : () => (
                  Utils.getGlobal(nGlobalKeys.ScreenChiTiet, "") == 'QL_duyetnghiphep' ? Utils.goscreenPush(this, "sc_CTDuyetPhep", { itemId: arrkey[arrkey.length - 1], isGoBak: true, idtab: 0, }) :
                    Linking.openURL(`${appConfig.appDevLink}app/root/rootcn/home/HDuyetRoot/ctDuyetPhep/${arrkey[arrkey.length - 1]}`),
                  Utils.setGlobal(nGlobalKeys.ScreenChiTiet, arrkey[arrkey.length - 2])),
                appIconSource: Images.JeeGreen,
                appTitle: "JeeHR",
                timeText: 'Now',
                title: data.title,
                body: data.body,
                slideOutTime: 5000
              });
            } break;
            //Chi tiết tăng ca
            case 'QL_duyetdangkytangca': {
              Utils.getPopUP().show({
                onPress: () => (
                  Utils.getGlobal(nGlobalKeys.ScreenChiTiet, "") == 'QL_duyetdangkytangca' ? Utils.goscreenPush(this, "sc_CTDuyetTangCa", { itemId: arrkey[arrkey.length - 1], isGoBak: true }) :
                    Linking.openURL(`${appConfig.appDevLink}app/root/rootcn/home/HDuyetRoot/ctDuyetTangCa/${arrkey[arrkey.length - 1]}`),
                  Utils.setGlobal(nGlobalKeys.ScreenChiTiet, arrkey[arrkey.length - 2])
                ),
                appIconSource: Images.JeeGreen,
                appTitle: "JeeHR",
                timeText: 'Now',
                title: data.title,
                body: data.body,
                slideOutTime: 5000
              });
            } break;
            //.........
            case 'QL_duyetthoiviec': {
              Utils.getPopUP().show({
                onPress: () => (
                  Utils.getGlobal(nGlobalKeys.ScreenChiTiet, "") == 'QL_duyetthoiviec' ? Utils.goscreenPush(this, "sc_ChiTietThoiViec", { itemId: arrkey[arrkey.length - 1], isGoBak: true, idtab: 0 }) :
                    Linking.openURL(`${appConfig.appDevLink}app/root/rootcn/home/HDuyetRoot/ctDuyetThoiViec/${arrkey[arrkey.length - 1]}`),
                  Utils.setGlobal(nGlobalKeys.ScreenChiTiet, arrkey[arrkey.length - 2])),
                appIconSource: Images.JeeGreen,
                appTitle: "JeeHR",
                timeText: 'Now',
                title: data.title,
                body: data.body,
                slideOutTime: 5000
              });
            } break;
            case 'HDuyetRoot': {
              Utils.getPopUP().show({
                onPress: () => (
                  loai && loai != 0 ? this.props.SetValueTypeDSDuyet(loai) : null,
                  Linking.openURL(`${appConfig.appDevLink}app/root/rootcn/home/HDuyetRoot`)),
                appIconSource: Images.JeeGreen,
                appTitle: "JeeHR",
                timeText: 'Now',
                title: data.title,
                body: data.body,
                slideOutTime: 5000
              });
            } break;
            default: {
              Utils.getPopUP().show({
                onPress: () =>
                  Linking.openURL(`${appConfig.appDevLink}app/root/rootcn/home`),
                appIconSource: Images.JeeGreen,
                appTitle: "JeeHR",
                timeText: 'Now',
                title: data.title,
                body: data.body,
                slideOutTime: 5000
              });
            } break
          }
        } else {

        }

      }


    }
    // this.props.show_A();
  }

  async onOpened(openResult) {
    Utils.nlog("gia trị 2222222-----------------------------", openResult);
    let isModeMayChamCong = Utils.getGlobal(nGlobalKeys.isModeMayChamCong, false);
    if (isModeMayChamCong)
      return;
    Utils.nlog('Message: ', openResult.notification.payload.body);
    Utils.nlog('Data: ', openResult.notification.payload.additionalData);
    Utils.nlog('isActive: ', openResult.notification.isAppInFocus);
    Utils.nlog('openResult: ', openResult);
    Utils.setGlobal(nGlobalKeys.isDeeplink, true)
    var url = openResult.notification.payload.additionalData && openResult.notification.payload.additionalData.link ? openResult.notification.payload.additionalData.link : ''
    if (url) {
      Utils.nlog("URL giá trị 222----:", url)
      const arrkey = url.split('/');
      Utils.nlog("arrkey giá trị 222----:", arrkey[arrkey.length - 2])
      if (arrkey && arrkey.length >= 2) {
        switch (arrkey[arrkey.length - 2]) {
          //Xem đổi ca đã XL
          case 'CN_doicalamviec': {
            Linking.openURL(`${appConfig.appDevLink}app/root/rootcn/home/CN_doicalamviec/ctDoiCaLamViec/${arrkey[arrkey.length - 1]}`)
            Utils.setGlobal(nGlobalKeys.ScreenChiTiet, arrkey[arrkey.length - 2])
          } break;
          //Xem ct giai trình đã XL
          case 'CN_giaitrinh': {
            Linking.openURL(`${appConfig.appDevLink}app/root/rootcn/home/CN_giaitrinh/ctGiaiTrinh/${arrkey[arrkey.length - 1]}`)
            Utils.setGlobal(nGlobalKeys.ScreenChiTiet, arrkey[arrkey.length - 2])
          } break;
          case 'CN_dsthongbao': {
            Linking.openURL(`${appConfig.appDevLink}app/root/rootcn/home/CN_dsthongbao/ctThongbaoNhanSu/${arrkey[arrkey.length - 1]}`)
            Utils.setGlobal(nGlobalKeys.ScreenChiTiet, arrkey[arrkey.length - 2])
          } break;
          //Xem nghỉ phép đã XL
          case `CN_guidonxinnghiphep`: {
            Linking.openURL(`${appConfig.appDevLink}app/root/rootcn/CN_guidonxinnghiphep/ctPhep/${arrkey[arrkey.length - 1]}`)
            Utils.setGlobal(nGlobalKeys.ScreenChiTiet, arrkey[arrkey.length - 2])
          } break;
          case `sc_GuiPhepTheoBuoi`: {
            Linking.openURL(`${appConfig.appDevLink}app/root/rootcn/sc_GuiPhepTheoBuoi/ctPhep/${arrkey[arrkey.length - 1]}`)
            Utils.setGlobal(nGlobalKeys.ScreenChiTiet, arrkey[arrkey.length - 2])
          } break;
          //Xem chi tiết đổi ca làm việc
          case 'QL_duyetdoicalamviec': {
            Utils.getGlobal(nGlobalKeys.ScreenChiTiet, "") == 'QL_duyetdoicalamviec' ?
              Utils.goscreenPush(this, "sc_chitietDoiCa", { itemId: arrkey[arrkey.length - 1], isGoBak: true }) :
              Linking.openURL(`${appConfig.appDevLink}app/root/rootcn/home/HDuyetRoot/ctDuyetDoiCaLamViec/${arrkey[arrkey.length - 1]}`),
              Utils.setGlobal(nGlobalKeys.ScreenChiTiet, arrkey[arrkey.length - 2])
          } break;
          //Chi tiết duyệt giải trình
          case 'QL_duyetgiaitrinh': {
            Utils.getGlobal(nGlobalKeys.ScreenChiTiet, "") == 'QL_duyetgiaitrinh' ?
              Utils.goscreenPush(this, "sc_ChiTietDuyetGiaiTrinh", { itemId: arrkey[arrkey.length - 1], isGoBak: true, idtab: 0, }) :
              Linking.openURL(`${appConfig.appDevLink}app/root/rootcn/home/HDuyetRoot/ctDuyetGiaiTrinh/${arrkey[arrkey.length - 1]}`),
              Utils.setGlobal(nGlobalKeys.ScreenChiTiet, arrkey[arrkey.length - 2])
          } break;
          //Xem chi tiết duyệt nghỉ phép
          case 'QL_duyetnghiphep': {
            Utils.getGlobal(nGlobalKeys.ScreenChiTiet, "") == 'QL_duyetnghiphep' ?
              Utils.goscreenPush(this, "sc_CTDuyetPhep", { itemId: arrkey[arrkey.length - 1], isGoBak: true, idtab: 0, }) :
              Linking.openURL(`${appConfig.appDevLink}app/root/rootcn/home/HDuyetRoot/ctDuyetPhep/${arrkey[arrkey.length - 1]}`),
              Utils.setGlobal(nGlobalKeys.ScreenChiTiet, arrkey[arrkey.length - 2])
          } break;
          //Chi tiết tăng ca
          case 'QL_duyetdangkytangca': {
            Utils.getGlobal(nGlobalKeys.ScreenChiTiet, "") == 'QL_duyetdangkytangca' ?
              Utils.goscreenPush(this, "sc_CTDuyetTangCa", { itemId: arrkey[arrkey.length - 1], isGoBak: true }) :
              Linking.openURL(`${appConfig.appDevLink}app/root/rootcn/home/HDuyetRoot/ctDuyetTangCa/${arrkey[arrkey.length - 1]}`),
              Utils.setGlobal(nGlobalKeys.ScreenChiTiet, arrkey[arrkey.length - 2])
          } break;
          //....
          case 'QL_duyetthoiviec': {
            Utils.getGlobal(nGlobalKeys.ScreenChiTiet, "") == 'QL_duyetthoiviec' ?
              Utils.goscreenPush(this, "sc_ChiTietThoiViec", { itemId: arrkey[arrkey.length - 1], isGoBak: true, idtab: 0 }) :
              Linking.openURL(`${appConfig.appDevLink}app/root/rootcn/home/HDuyetRoot/ctDuyetThoiViec/${arrkey[arrkey.length - 1]}`),
              Utils.setGlobal(nGlobalKeys.ScreenChiTiet, arrkey[arrkey.length - 2])
          } break;
          //ctDuyetThoiViec

          case 'ChamCongWifi': {
            openResult && openResult.action.actionID == "Check" ? (
              Linking.openURL(`${appConfig.appDevLink}app/root/rootcn/home/ChamCongWifi`),
              Utils.setGlobal(nGlobalKeys.ScreenChiTiet, arrkey[arrkey.length - 2]),
              Utils.setGlobal(nGlobalKeys.checkCCWifi, true)
            ) : Linking.openURL(`${appConfig.appDevLink}app/root/rootcn/home`)
            Utils.setGlobal(nGlobalKeys.ScreenChiTiet, arrkey[arrkey.length - 2])
          } break;

          default: {
            Linking.openURL(`${appConfig.appDevLink}app/root/rootcn/home`)
            Utils.setGlobal(nGlobalKeys.ScreenChiTiet, arrkey[arrkey.length - 2])
          } break
        }
      } else {
        Linking.openURL(`${appConfig.appDevLink}app/root/rootcn/home`)
        Utils.setGlobal(nGlobalKeys.ScreenChiTiet, "")
      }
    } else {
      Linking.openURL(`${appConfig.appDevLink}app/root/rootcn/home`);
      Utils.setGlobal(nGlobalKeys.ScreenChiTiet, arrkey[arrkey.length - 2])
    }

  }


  componentDidUpdate() {
    let { indexTab, tabactive, tabbottom } = this.state;
    let index = this.props.navigation.state.index
    // Utils.nlog("vao dĩ update-qqqqqqqqqqqqqqqqqqqqqq", this.props.navigation.state);
    // let itemindex = this.props.navigation.state.routes[this.props.navigation.state.index];

    let indexactive = tabactive.findIndex(item => item.screen == tabbottom[index].screen)
    if (indexactive != -1 && indexTab != indexactive) {
      this.setState({ indexTab: indexactive }, () => nthistab.onPress(indexactive))
    }

  }
  render() {
    const { indexTab, tabbottom, ishow, tabactive } = this.state
    const { value } = this;
    const translateX = value.interpolate({
      inputRange: [0, 10],
      outputRange: [-10, 0],
    });
    if (ishow == true) {
      return (
        <>
          <View style={{
            height, width,//: tabWidth * tabbottom.length,
            backgroundColor: 'white',
            elevation: 6,
            shadowOffset: {
              width: 2,
              height: 2
            },
            shadowRadius: 2,
            shadowOpacity: 0.5,
            shadowColor: '#000'
          }}>
            <Animated.View width={tabWidth} style={[{
              top: -height + 26, left: 10,
              transform: [{ translateX }],
            }]}>
              <Image source={Images.tabBottom}
                style={{ width: tabWidth, height: 40, }}
                resizeMode={'cover'}>
              </Image>
            </Animated.View>
            <View style={StyleSheet.absoluteFill}>
              <StaticTabbar {...{ tabs: tabactive, value, indexTab, nthisTabBarHome: this }} />
            </View>
          </View>
          <SafeAreaView style={styles.container} />
        </>
      );
    } else {
      return null
    }

  }
}

const mapStateToProps = state => ({
  lang: state.changeLanguage.language,
  menuData: state.GetMenuApp,
  notification: state.Notifi.notification
});
export default Utils.connectRedux(Tabbar, mapStateToProps, true);

const styles = StyleSheet.create({
  container: {
    backgroundColor,
  },
});