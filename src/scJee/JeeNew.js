// -- ROOT APP ---
// File quan trọng, thay thế App.js. Khỏi tạo notifi, đa ngôn ngữ.
import moment from 'moment';
import React, { Component } from 'react';
import { Image, Linking, Platform, StatusBar, View, ActivityIndicator } from 'react-native';
import { openSettings } from 'react-native-permissions';
import RNRestart from 'react-native-restart';
import TouchID from "react-native-touch-id";
import { appConfig } from '../app/Config';
import { ROOTGlobal } from '../app/data/dataGlobal';
import { changeLangue, RootLang } from '../app/data/locales';
import { nGlobalKeys } from '../app/keys/globalKey';
import { nkey } from '../app/keys/keyStore';
import Utils from '../app/Utils';
import { Images } from '../images';
import { Height, Width } from '../styles/styles';
import LottieView from 'lottie-react-native';
import { getDSChamCong } from '../apis/apiTimesheets';

const cheerio = require('cheerio');

const optionalConfigObject = {
    title: RootLang.lang.scTouchID.tieude, // Android
    imageColor: '#338FF4', // Android
    imageErrorColor: '#ff0000', // Android
    sensorDescription: RootLang.lang.scTouchID.cambien, // Android
    sensorErrorDescription: RootLang.lang.scTouchID.thatbai, // Android
    cancelText: RootLang.lang.scTouchID.huy, // Android
    fallbackLabel: '', // iOS (if empty, then label is hidden)
    passcodeFallback: false, // iOS - allows the device to fall back to using the passcode, if faceid/touch is not available. this does not mean that if touchid/faceid fails the first few times it will revert to passcode, rather that if the former are not enrolled, then it will use the passcode.
};


class JeeNew extends Component {
    constructor(props) {
        super(props);
        this.state = {
            background: '',
            isShow: false,
            biometryType: null,
            auth: true,
            DSChiTiet: {},
            cavao: '',
            shortcut: false,
            isUpdate: false,
            release: [],
            verSion: "",
            errorUpdate: false,
            appCode: [],
            toDay: Utils.getGlobal(nGlobalKeys.TimeNow, '') ? moment(Utils.getGlobal(nGlobalKeys.TimeNow, '')).add(-7, "hours").format("DD/MM/YYYY") : moment(Date.now()).format("DD/MM/YYYY"),
        };
        ROOTGlobal.Common.checkversion = this._CheckVerSionApp;
        this.enablebiometrics = Utils.ngetStorage(nkey.biometrics,)
        this.Internet = Utils.getGlobal("Internet", false)
        this.CheckTokenShortcut = Utils.ngetParam(this, 'CheckTokenShortcut');

    }

    componentWillUnmount = async () => {
        let tlang = await Utils.ngetStorage(nkey.lang, appConfig.defaultLang);
        changeLangue(tlang);
        this.setStatusBar();
    }

    async componentDidMount() {
        this.refresh_token = await Utils.ngetStorage(nkey.refresh_token, '')
        this.access_token = await Utils.ngetStorage(nkey.access_token, '')
        if (this.access_token != 1 && this.access_token != 0 && this.refresh_token) {
            this.GetChamCong()
        }
        let lang = await Utils.ngetStorage(nkey.lang, 'vi');
        this.props.ChangeLanguage(lang);
        Platform.OS == 'android' ? await this._getDataAndroid() : await this._getDataIOS()
        Utils.setGlobal(nGlobalKeys.lang, lang)
        if (await this.enablebiometrics == true) {
            TouchID.isSupported()
                .then(biometryType => {
                    this.setState({ biometryType }, this._authenticate);
                }).catch(async (error) => {
                    this.enablebiometrics == false, this._CheckVerSionApp()
                })
        }
        else {
            return this._CheckVerSionApp()
        }
        // let isMayChamCong = await Utils.ngetStorage(nkey.isModeMayChamCong, false);
        // Utils.setGlobal(nGlobalKeys.isModeMayChamCong, isMayChamCong);
        // if (isMayChamCong) {
        //     Utils.goscreen(this, 'sc_MayChamCong', { isMode: 3 })
        //     return;
        // }
    }
    GetChamCong = async () => {
        const { toDay } = this.state
        var val = `${toDay}|${toDay}`;
        let res = await getDSChamCong(val, 1, 10);
        if (res.data.length >= 1) {
            Utils.setGlobal(nGlobalKeys.dataChamCong, res.data[0])
        } else {
            Utils.setGlobal(nGlobalKeys.dataChamCong, {})
        }


    }

    _authenticate = () => {
        return TouchID.authenticate('', optionalConfigObject)
            .then(async (success) => {
                this.setState({
                    auth: true
                }, this._CheckVerSionApp)
            })
            .catch(async (error) => {
                // mai chỉnh lại chỗ này là được
                if (error.name == "LAErrorAuthenticationFailed") {
                    Utils.showMsgBoxYesNo(this, RootLang.lang.scTouchID.canhbao, RootLang.lang.scTouchID.noidungcanhbao, RootLang.lang.scTouchID.khoidong, RootLang.lang.scTouchID.dangnhapthucong,
                        () => { RNRestart.Restart(); }, () => { this._CheckVerSionApp(), this.setState({ auth: false }) })
                }
                else if (error.name == "LAErrorUserCancel" || error.name == "Touch ID Error") {
                    this.setState({ auth: false })
                    return this._CheckVerSionApp()
                }
                else if (error.name == "LAErrorTouchIDNotEnrolled" || error.name == "LAErrorTouchIDNotAvailable") {
                    return this.onGoSeting()
                }
                else if (error.name == "RCTTouchIDUnknownError") {
                    return Utils.showMsgBoxOK(this, RootLang.lang.scTouchID.canhbao, RootLang.lang.scTouchID.loikhongxacdinh + " " + this.state.biometryType + ". " + RootLang.lang.scTouchID.cachgiaiquyet, "OK", () => {
                        this._CheckVerSionApp()
                    })
                }
                else if (error.name == "LAErrorSystemCancel") {
                    return this._authenticate()
                }
                else return this._CheckVerSionApp()
            });
    }

    onGoSeting = async () => {
        await (Utils.showMsgBoxYesNo(this, RootLang.lang.scTouchID.canhbaoIOS, RootLang.lang.scTouchID.noidungcanhbaoIOS,
            RootLang.lang.scTouchID.chuyentoicaidat, RootLang.lang.scTouchID.tatchucnangmokhoakhuonmat,
            async () => {
                if (Platform.OS == 'ios') {
                    Linking.openURL('app-settings:').catch((err) => {
                        Utils.nlog('app-settings:', err);
                    });
                }
                else
                    openSettings();
            }, async () => {
                await (this.enablebiometrics = Utils.ngetStorage(nkey.biometrics, false))
                this.setState({ auth: false })
                this._CheckVerSionApp()
            }))
    }


    _getDataAndroid = async () => {
        try {
            const searchUrl = `https://play.google.com/store/apps/details?id=${appConfig.packageAppAndroid}`;
            const response = await fetch(searchUrl);
            const htmlString = await response.text();
            const $ = cheerio.load(htmlString);
            const ReleaseNoteTemp = $('[class=DWPxHb]')
            const ReleaseNote = await ReleaseNoteTemp[1].children[0].children
            const ReleaseVersionTemp = $('[class="IQ1z0d"]')
            const ReleaseVersion = await ReleaseVersionTemp[3].children[0].children[0].data
            this.setState({ verSion: ReleaseVersion })
            for (var i = 0; i < ReleaseNote.length; i++) {
                if (ReleaseNote[i].data != null) {
                    await this.setState({ release: this.state.release.concat(ReleaseNote[i].data) })
                }
            }
        } catch (error) {
            this.setState({ errorUpdate: true })

        }
    }


    _getDataIOS = async () => {
        try {
            const searchUrl = `https://apps.apple.com/app/id${appConfig.keyIDAppStore}`;
            const response = await fetch(searchUrl);
            const htmlString = await response.text();
            const $ = cheerio.load(htmlString);
            const ReleaseNoteTemp = $('[class="we-truncate we-truncate--multi-line we-truncate--interactive "]')
            const ReleaseNote = await ReleaseNoteTemp[0].children[1].children
            const ReleaseVersionTemp = $('[class="l-column small-6 medium-12 whats-new__latest__version"]')
            const ReleaseVersion = await ReleaseVersionTemp[0].children[0].data
            this.setState({ verSion: ReleaseVersion })
            for (var i = 0; i < ReleaseNote.length; i++) {
                if (ReleaseNote[i].data != null) {
                    await this.setState({ release: this.state.release.concat(ReleaseNote[i].data) })
                }
            }
        } catch (error) {
            this.setState({ errorUpdate: true })
        }
    }

    callback = (val) => {
        if (val == 1 || val == 0)
            Utils.replace(this, "sc_login")
        else
            Utils.replace(this, "sw_HomePage")

    }

    _CheckVerSionApp = async () => {
        var { isUpdate, release, verSion } = this.state
        let linkStore = ''
        try {
            let isCheckUpdate = false;
            isCheckUpdate = Platform.OS == 'ios' ? appConfig.version != verSion.split(" ").slice(1).toString() : appConfig.version != verSion
            linkStore = Platform.OS == 'ios' ? appConfig.linkIOS : appConfig.linkAndroid;

            if (isCheckUpdate && this.state.errorUpdate == false && verSion) {
                let item = { verSion, release }
                Utils.goscreen(this, 'Modal_ThongBaoUpdate', { item: item, linkStore: linkStore, callback: this.callback })
            }
            else { //Check xem có bắt buộc update mới cho vào App hay ko?
                //--Code xử lý vào app
                var lag = await Utils.ngetStorage(nkey.lang, 'vi');
                changeLangue(lag)
                this.props.ChangeLanguage(lag);
                this.openApp()
                //---
            }

        }
        catch (error) {
            Utils.nlog("=-=-=error", error)
        }
    }

    openApp = async () => {
        let isMayChamCong = await Utils.ngetStorage(nkey.isModeMayChamCong, false);
        Utils.setGlobal(nGlobalKeys.isModeMayChamCong, isMayChamCong);
        if (isMayChamCong) {
            Utils.goscreen(this, 'sc_MayChamCong', { isMode: 3 })
            return;
        }
        this.setStatusBar(false);
        if (this.access_token != 1 && this.access_token != 0 && this.refresh_token) {
            Utils.replace(this, this.state.auth ? "sw_HomePage" : "sc_login");
        }
        else
            Utils.replace(this, "sc_login");
    }
    setStatusBar = (val = true) => {
        StatusBar.setHidden(false, true)
        StatusBar.setBarStyle("dark-content", true)
        Platform.OS == 'android' ? StatusBar.setBackgroundColor("white", true) : null

    }

    render() {
        return (
            <View style={{ alignItems: "center", flex: 1, backgroundColor: "white", }}>
                <View style={{ alignItems: "center", width: "100%", height: "100%" }}>
                    {/* <LogoAnimation /> */}
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 100 }}  >
                        <Image resizeMode={"contain"} source={Images.ImageJee.iclogoText} style={{ width: Width(90), height: Width(90) }} />
                    </View>
                    <LottieView style={{ height: Width(25), position: 'absolute', bottom: Platform.OS == 'ios' ? Height(14) : Height(18) }} source={require('../images/lottieJeeHR/loadLaunchScreen.json')} autoPlay loop />
                </View>
            </View >
        );
    }
}

const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(JeeNew, mapStateToProps, true)