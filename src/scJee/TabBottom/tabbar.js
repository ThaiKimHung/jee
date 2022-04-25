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
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';
import { Get_ThongBao, Get_ThongBaoChat } from '../../srcRedux/actions';
import { isIphoneX } from 'react-native-iphone-x-helper';

const { width } = Dimensions.get("window");
const height = isIphoneX() ? 50 : 60;


const tabWidth = width / 5;
const backgroundColor = "white";

class Tabbar extends React.Component {
  constructor(props) {
    super(props);
    nthistabhome = this;
    let tab = [
      {
        name: RootLang.lang.thongbaochung.social,
        icon: Images.ImageJee.icMNTab_1,
        iconA: Images.ImageJee.icMNTabA_1,
        screen: 'tab_Social',
      },
      {
        name: RootLang.lang.thongbaochung.thongbao,
        icon: Images.ImageJee.icMNTab_2,
        iconA: Images.ImageJee.icMNTabA_2,
        screen: 'tab_Noti'
      },
      {
        name: RootLang.lang.thongbaochung.trangchu,
        icon: Images.ImageJee.icMNTab_3,
        iconA: Images.ImageJee.icMNTabA_3,
        screen: 'tab_Home'
      },
      {
        name: RootLang.lang.thongbaochung.tinnhan,
        icon: Images.ImageJee.icMNTab_4,
        iconA: Images.ImageJee.icMNTabA_4,
        screen: 'tab_Mesage'
      },
      {
        name: RootLang.lang.thongbaochung.caidat,
        icon: Images.ImageJee.icMNTab_5,
        iconA: Images.ImageJee.icMNTabA_5,
        screen: 'tab_Setting'
      },
    ];

    this.state = {
      indexTab: 2,
      ishow: true,
      tabbottom: tab,
      tabactive: tab,
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
    this.GetThongBaoCount();
  }
  GetThongBaoCount = () => {
    //thông báo
    this.props.GetThongBao();
    //thông báo chát
    this.props.GetThongBaoChat();
  }
  onReceived(notification) {
    // Utils.nlog("gia trị Notifi onReceived 1111-----------------------------", notification);
    {
      Platform.OS == 'android' ?
        Utils.getPopUP().show({
          onPress: () => Linking.openURL(notification?.payload?.launchURL ? notification.payload.launchURL : 'jeeplatform://app/root/jeenew'),
          appIconSource: Images.JeeGreen,
          appTitle: "JeePlatform",
          timeText: 'Now',
          title: notification.payload.title ? notification.payload.title : 'JeePlatform',
          body: notification.payload.body ? notification.payload.body : 'JeePlatform',
          slideOutTime: 5000
        }) : null
    }
    // let isModeMayChamCong = Utils.getGlobal(nGlobalKeys.isModeMayChamCong, false);
    // if (isModeMayChamCong)
    //   return;
    //Show_A là đếm số thông báo ở chuông Home cũ JeeHR
    // this.props.show_A();
  }

  async onOpened(openResult) {
    // Utils.nlog("gia trị onOpened 2222222-----------------------------", openResult);
    {
      if (Platform.OS == 'ios') {
        openResult?.notification?.payload?.launchURL ? Linking.openURL(openResult.notification.payload.launchURL) : null
      }
    }
  }


  componentDidUpdate() {
    let { indexTab, tabactive, tabbottom } = this.state;

    let index = this.props.state.index
    let itemindex = this.props.state.routes[this.props.state.index];

    let indexactive = tabactive.findIndex(item => item.screen == tabbottom[index].screen)
    if (indexactive != -1 && indexTab != indexactive) {

      this.setState({ indexTab: indexactive }, () => nthistab.onPress(indexactive))
      this.GetThongBaoCount();
    }

  }
  render() {
    const { indexTab, tabbottom, ishow, tabactive } = this.state
    const { value } = this;
    if (ishow == true && indexTab != 0 && indexTab != 3) {
      return (
        <>
          <View style={{
            height, width,//: tabWidth * tabbottom.length,
            backgroundColor: 'white',
            elevation: 6,
          }}>
            <View style={StyleSheet.absoluteFill}>
              <StaticTabbar {...this.props} {...{ tabs: tabactive, value, indexTab, nthisTabBarHome: this }} />
            </View>
          </View>
          <SafeAreaView style={styles.container} />
        </>
      );
    } else {
      return <>
      </>
    }

  }
}

const mapStateToProps = state => ({
  lang: state.changeLanguage.language,
  menuData: state.GetMenuApp,
  notification: state.Notifi.notification
});

const mapDispatchToProps = (dispatch) => {
  return {
    GetThongBao: () => dispatch(Get_ThongBao()),
    GetThongBaoChat: () => dispatch(Get_ThongBaoChat())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tabbar)

const styles = StyleSheet.create({
  container: {
    backgroundColor,
  },
});