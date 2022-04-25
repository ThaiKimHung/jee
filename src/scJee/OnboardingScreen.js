
// -- ROOT APP ---
// File quan trọng, thay thế App.js. Khỏi tạo notifi, đa ngôn ngữ.
// Bắt buộc dữ lại. Có thể làm Flash Screen nếu ko dùng màn hình này gì
import LottieView from 'lottie-react-native';
import moment from 'moment';
import React, { Component } from 'react';
import { Image, Linking, Platform, StatusBar, View, Text } from 'react-native';
import { openSettings } from 'react-native-permissions';
import RNRestart from 'react-native-restart';
import TouchID from "react-native-touch-id";
import { Get_DSMenu } from '../apis/apiMenu';
import { CheckTokenAfterCallAPI } from '../apis/JeePlatform/apiUser';
import { appConfig } from '../app/Config';
import { ROOTGlobal } from '../app/data/dataGlobal';
import { changeLangue, RootLang } from '../app/data/locales';
import { nGlobalKeys } from '../app/keys/globalKey';
import { nkey } from '../app/keys/keyStore';
import Utils from '../app/Utils';
import { Images } from '../images';
import { Width } from '../styles/styles';
import * as Animatable from 'react-native-animatable'
import Onboarding from 'react-native-onboarding-swiper';
import AsyncStorage from '@react-native-community/async-storage';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { sizes } from '../styles/size';


class OnboardingScreen extends Component {

    _onSkip = async () => {
        await Utils.nsetStorage(nkey.alredyLaunched, true)
        Utils.goscreenReplace(this, "JeeNew")
    }

    _onDone = async () => {
        await Utils.nsetStorage(nkey.alredyLaunched, false)
        Utils.goscreenReplace(this, "JeeNew")
    }

    Skip = ({ ...props }) => {
        return (
            <TouchableOpacity style={{ paddingLeft: 20 }} {...props}>
                <Text style={{ fontSize: sizes.sText15, }}>
                    Skip
                </Text>
            </TouchableOpacity>
        )
    }

    Next = ({ ...props }) => {
        return (
            <TouchableOpacity style={{ paddingRight: 20 }} {...props}>
                <Text style={{ fontSize: sizes.sText15, }}>
                    Next
                </Text>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View style={{ alignItems: "center", flex: 1, backgroundColor: "white", }}>
                <Onboarding
                    // SkipButtonComponent={this.Skip}
                    // NextButtonComponent={this.Next}
                    onSkip={() => { this._onSkip() }}
                    onDone={() => { this._onDone() }}
                    pages={[
                        {
                            backgroundColor: '#fff',
                            image: <Image source={require('../images/imgAppJee/icBrowser.png')} />,
                            title: 'Onboarding 11',
                            subtitle: 'Onboarding 1',
                        },
                        {
                            backgroundColor: '#fff',
                            image: <Image source={require('../images/imgAppJee/icCalenda.png')} />,
                            title: 'Onboarding 22',
                            subtitle: 'Onboarding 2',
                        },
                    ]}
                />
            </View >
        );
    }
}

const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(OnboardingScreen, mapStateToProps, true)