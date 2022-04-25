/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import NetInfo from '@react-native-community/netinfo';
import React, { Component } from 'react';
import { AppState, Platform, ScrollView, StatusBar, Text, TextInput } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import OneSignal from 'react-native-onesignal';
import NotificationPopup from 'react-native-push-notification-popup';
import RNRestart from 'react-native-restart';
import { Provider } from 'react-redux';
import { appConfig } from './src/app/Config';
import { ROOTGlobal } from './src/app/data/dataGlobal';
import { nGlobalKeys } from './src/app/keys/globalKey';
import { nkey } from './src/app/keys/keyStore';
import Utils from './src/app/Utils';
import PushNoti from './src/Component_old/PushNoti';
import AppStack from './src/routers/AppStack';
import { store, persistor } from './src/srcRedux/store';
import withCodePush from './codepush'
import FlashMessage from 'react-native-flash-message';
import { PersistGate } from 'redux-persist/integration/react';
import { withDevMenuOnTouch } from './DevMenu';
import SplashScreen from 'react-native-splash-screen'

class App extends Component {
  constructor(props) {
    super(props);
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.allowFontScaling = false;
    TextInput.defaultProps = TextInput.defaultProps || {};
    TextInput.defaultProps.allowFontScaling = false;
    TextInput.defaultProps.autoCapitalize = "none";
    TextInput.defaultProps.autoCorrect = false;
    TextInput.defaultProps.spellCheck = false;
    KeyboardAwareScrollView.defaultProps = KeyboardAwareScrollView.defaultProps || {};
    KeyboardAwareScrollView.defaultProps.keyboardShouldPersistTaps = 'always'
    ScrollView.defaultProps = ScrollView.defaultProps || {};
    ScrollView.defaultProps.showsHorizontalScrollIndicator = false
    ScrollView.defaultProps.showsVerticalScrollIndicator = false

    this.state = {
      background: '',
      isShow: false,
      appState: AppState.currentState,
      isCheck: false,
      isConnected: true,
      tryConnect: false,
      isNotCheck: false

    };

  }


  componentDidMount = async () => {
    SplashScreen.hide();
    StatusBar.setHidden(false, true)
    StatusBar.setBarStyle("dark-content", true)
    Platform.OS == 'android' ? StatusBar.setBackgroundColor("white", true) : null
    this.routerName = await Utils.ngetStorage("RouterName", "")
    NetInfo.addEventListener(state => {
      Utils.setGlobal("Internet", state)
      const { isNotCheck } = this.state;
      const { isConnected = falses } = state;
      if (isConnected == true) {
        Utils.setGlobal(nGlobalKeys.isConnected, true);
        if (isNotCheck == true) {

          RNRestart.Restart();
        } else {
          this.setState({ isConnected: isConnected, isNotCheck: false })
        }

      } else {
        Utils.setGlobal(nGlobalKeys.isConnected, false);
        this.setState({ isConnected: isConnected })
      }
    });
    OneSignal.init(appConfig.onesignalID);
    OneSignal.inFocusDisplaying(2);
    this.onIds = this.onIds.bind(this);
    OneSignal.addEventListener('ids', this.onIds);
    // OneSignal.cancelNotification
    AppState.addEventListener("change", this._handleAppStateChange);

  }
  componentWillUnmount() {
    AppState.removeEventListener("change", this._handleAppStateChange);
  }
  _handleAppStateChange = nextAppState => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      let token = Utils.getGlobal(nGlobalKeys.loginToken, '');
      if (token != '') {
        ROOTGlobal.Common.checkversion();
      }
    }
    this.setState({ appState: nextAppState });
  };

  onIds(device) {
    Utils.nlog('Init Notification--: ', device)
    Utils.nsetStorage(nkey.pushToken_OneSignal, device.pushToken);
    Utils.nsetStorage(nkey.userId_OneSignal, device.userId);
  }

  render() {
    return (
      <Provider store={store}>
        <AppStack />
        <FlashMessage
          position="top"
        />
        <NotificationPopup ref={ref => {
          Utils.setTopLevelPopUp(ref)
        }} style={{ marginTop: 40 }} />
        <PushNoti />
        <PersistGate persistor={persistor} loading={null}>
          {/* <Shortcut /> */}
        </PersistGate>
      </Provider>
    );
  }
}

// export default App
export default withCodePush(withDevMenuOnTouch(App));
