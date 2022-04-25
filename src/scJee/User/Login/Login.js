import React from "react";
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    StatusBar,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Dimensions,
    Image,
    TextInput,
    Keyboard
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Get_HinhNhanVien } from "../../../apis/apiEmployee";
import { LoginJeeHR, UpdateDeviceToken } from "../../../apis/apiUser";
import { CheckRole, LoginJee, CheckTokenAfterCallAPI } from "../../../apis/JeePlatform/apiUser";
import { RootLang } from "../../../app/data/locales";
import { nGlobalKeys } from "../../../app/keys/globalKey";
import { nkey } from "../../../app/keys/keyStore";
import Utils from "../../../app/Utils";
import { Images } from "../../../images";
import { colors, fonts } from "../../../styles";
import { reSize, reText, sizes } from "../../../styles/size";
import { Height, nstyles, Width } from "../../../styles/styles";
import Minion from "./components/minion";
import MyTextInput from "./components/textinput";
import Colors from "./constants/colors";
import ButtonCom from '../../../components/Button/ButtonCom';
import OneSignal from 'react-native-onesignal';
import { LayMenuChucNang_MobileApp } from "../../../apis/JeePlatform/API_JeeWork/apiMenu";
import LottieView from 'lottie-react-native';
import UtilsApp from "../../../app/UtilsApp";
import IsLoading from "../../../components/IsLoading";

const { width, height } = Dimensions.get("window");

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.Password = '';
        this.state = {
            rememberPassword: true,
            ShowPassword: true,
            Username: '',
            UsernameAccount: '',
            UsernameTemp: '',
            appCode: [],
            check: false,
            avatar: ''
        }

    }


    componentDidMount = async () => {

        let temp = ''
        temp = await Utils.ngetStorage(nkey.Password, '')
        this.Password = temp.toString()
        this.setState({
            Username: await Utils.ngetStorage(nkey.Username, ''),
            UsernameTemp: await Utils.ngetStorage(nkey.Username, ''),
            UsernameAccount: await Utils.ngetStorage(nkey.nameuser, ''),
            avatar: await Utils.ngetStorage(nkey.avatar, '')
        })
    }

    DangKyOneSignal = async (username) => {
        let externalUserId = username;
        OneSignal.setExternalUserId(externalUserId, (results) => {
            Utils.nlog("setExternalUserId_DangKyOneSignal:", results)
        })
    }


    hashCode = (str) => {
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return hash;
    }

    intToRGB = (i) => {
        var c = (i & 0x00FFFFFF)
            .toString(16)
            .toUpperCase();

        return "#" + "00000".substring(0, 6 - c.length) + c;
    }

    checkRuleHR = async (id) => {
        const res = await CheckRole(id)
        if (res.status == 1) {
            res.data.map(res => {
                if (res.AppCode == 'JeeHR') {
                    Utils.nsetStorage(nkey.roleJeeHR, true)
                }
            })
        }
    }

    UserLogin = async () => {
        nthisLoading.show()
        var { rememberPassword, Username } = this.state;

        var warning = '', showWarning = false;
        if (Username == '') {
            warning += RootLang.lang.sclogin.tenbatbuoc;
            showWarning = true;
            // this.refUsername.focus();
        }
        if (this.Password == '') {
            warning += RootLang.lang.sclogin.matkhaukhonghople;
            if (showWarning != true) {
                showWarning = true;
                // this.refPassword.focus();
            }
        }
        // Utils.nlog('warning', warning);
        if (showWarning == true) {
            nthisLoading.hide()
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.canhbao, warning, 4)
            return;
        }
        let res = await LoginJee(Username, this.Password);
        // Utils.nlog('res logijn', res)
        // this.waitting.hide();
        if (res.status == 1) {

            await Utils.nsetStorage(nkey.access_token, res.access_token);
            // Set global để lưu toàn cục.
            Utils.setGlobal(nGlobalKeys.Username, Username);


            // Set Storage lưu xuống app.
            Utils.nsetStorage(nkey.Username, Username);
            Utils.nsetStorage(nkey.Password, this.Password)
            // personalInfo
            Utils.nsetStorage(nkey.UserId, res.user?.customData[`jee-account`].userID)
            Utils.nsetStorage(nkey.avatar, res.user?.customData.personalInfo.Avatar)
            Utils.nsetStorage(nkey.nameuser, res.user?.customData.personalInfo.Fullname)
            Utils.nsetStorage(nkey.role, res.user?.customData[`jee-social`] ? res.user?.customData[`jee-social`] : '')
            Utils.nsetStorage(nkey.appCode, res.user?.customData[`jee-account`].appCode ? res.user?.customData[`jee-account`].appCode : [])
            Utils.nsetStorage(nkey.IDKH_DPS, res.user?.customData[`jee-account`].customerID);
            Utils.nsetStorage(nkey.Id_nv, res.user?.customData[`jee-account`].staffID);
            Utils.nsetStorage(nkey.customerID, res.user?.customData[`jee-account`].customerID)

            //Tắt touch id
            Utils.nsetStorage(nkey.biometrics, false);

            //set global and set Storage



            this.setState({
                appCode: await Utils.ngetStorage(nkey.appCode, [])
            }, () => {
                this.state.appCode?.find((o, i) => {
                    if (o == "SOCIAL") {
                        this.setState({ check: true })
                    }
                })
            })
            Utils.nsetStorage(nkey.checkAppCode, this.state.check)

            //đăng ký onesignal
            this.DangKyOneSignal(Username)
            this.GetRefreshNewToken().then(async (res) => {
                if (res) {
                    await this.checkRuleHR(res.user?.customData[`jee-account`].customerID)
                    Utils.goscreenReplace(this, "JeeNew", { screen: 'sw_Root' })
                    nthisLoading.hide()
                } else {
                    UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, 'Đã xảy ra lỗi, vui lòng thử lại!', 2)
                    nthisLoading.hide()
                }
            })

        }
        else {
            nthisLoading.hide()
            var { error = undefined } = res;

            UtilsApp.MessageShow(RootLang.lang.thongbaochung.canhbao, error ? error.message : "Tài khoản hoặc mật khẩu chưa chính xác!", 4)
            return
        }


    }

    GetRefreshNewToken = async () => {
        const res = await CheckTokenAfterCallAPI(false);
        Utils.nsetStorage(nkey.refresh_token, res.refresh_token);
        Utils.nsetStorage(nkey.access_token, res.access_token);
        return true
    }

    onPressShowPassword = () => {
        this.setState({
            ShowPassword: !this.state.ShowPassword
        })
    }


    render() {
        const { ShowPassword, domainTest, Username, UsernameAccount, UsernameTemp, avatar } = this.state

        return (
            <ImageBackground
                source={Images.ImageJee.backgroundLogin}
                style={{ flex: 1 }}>
                <View style={{ marginTop: Height(3), marginLeft: 20 }}>
                    <Image
                        style={{ height: sizes.nImgSize75 }}
                        resizeMode={'contain'}
                        source={Images.ImageJee.logoLogin} />
                </View>
                <KeyboardAwareScrollView onTouchStart={Keyboard.dismiss} style={{ flex: 1 }} scrollEnabled={false}>
                    <View
                        style={[nstyles.nbody, {
                            paddingTop: Username && Username == UsernameTemp ? Height(10) : Height(20), marginHorizontal: '5%',
                            height: Height(100)
                        }]}>

                        {Username && Username == UsernameTemp ?
                            <View>
                                {avatar ?
                                    <Image source={{ uri: avatar }} style={{ width: Width(15), height: Width(15), alignSelf: 'center', borderRadius: 99999, marginBottom: 30 }} resizeMode={"cover"} />
                                    :
                                    <View
                                        style={{
                                            // marginRight: 10,
                                            borderRadius: 99999,
                                            width: Width(15),
                                            height: Width(15),
                                            backgroundColor: this.intToRGB(this.hashCode(UsernameAccount)),
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            alignSelf: "center",
                                            marginBottom: 30
                                        }}
                                    >
                                        <Text style={{ fontWeight: "bold", marginRight: 5, marginBottom: 5, fontSize: reText(30), color: "white" }}> {String(UsernameAccount).split(" ").slice(-1).toString().slice(0, 2).toString()}</Text>

                                    </View>}
                                <View>
                                    <Text style={{ fontWeight: "bold", marginRight: 5, marginBottom: 5, fontSize: reText(16), textAlign: "center", color: "white" }}> {UsernameAccount}</Text>

                                </View>
                            </View>
                            :
                            <View style={{
                                marginTop: 20,
                                backgroundColor: "#52AE8E",
                                borderColor: 'transparent',
                                // borderBottomColor: colors.colorInput,
                                borderWidth: 0.5,
                                width: Width(90),
                                flexDirection: 'row',
                                alignItems: 'center',
                                borderRadius: 8,
                                paddingHorizontal: 20
                            }}>
                                <Image
                                    style={[nstyles.nIcon20, { justifyContent: 'flex-start' }]}
                                    resizeMode={'contain'}
                                    source={Images.ImageJee.icloginUserName} />
                                <TextInput
                                    autoCapitalize={'none'}
                                    autoCorrect={false}
                                    placeholder={RootLang.lang.sclogin.tendangnhap}
                                    placeholderTextColor={"#96C9B7"}

                                    style={{
                                        fontSize: sizes.sText16, alignSelf: 'center',
                                        padding: 10, flex: 1, fontFamily: fonts.Helvetica, paddingLeft: 20,
                                        color: "white",
                                    }}
                                    underlineColorAndroid={'transparent'}
                                    onChangeText={text => this.setState({ Username: text })}
                                    ref={ref => this.refUsername = ref}>
                                    {Username}
                                </TextInput>
                            </View>
                        }
                        <View style={{
                            marginTop: 20,
                            backgroundColor: "#52AE8E",
                            borderColor: 'transparent',
                            // borderBottomColor: colors.colorInput,
                            borderWidth: 0.5,
                            width: Width(90),
                            flexDirection: 'row',
                            alignItems: 'center',
                            borderRadius: 8,
                            paddingHorizontal: 20

                        }}>
                            <Image
                                style={[nstyles.nIcon20, { justifyContent: 'flex-start' }]}
                                resizeMode={'contain'}
                                source={Images.ImageJee.icloginPassWord} />
                            <View style={{
                                flexDirection: 'row', flex: 1,
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}>
                                <TextInput
                                    autoCapitalize={'none'}
                                    autoCorrect={false}
                                    placeholder={RootLang.lang.sclogin.matkhau}
                                    placeholderTextColor={"#96C9B7"}
                                    style={{
                                        color: "white",
                                        fontSize: sizes.sText16, alignSelf: 'center',
                                        padding: 10, flex: 1, fontFamily: fonts.Helvetica,
                                        paddingLeft: 20
                                    }}
                                    underlineColorAndroid={'transparent'}
                                    secureTextEntry={ShowPassword}
                                    onChangeText={text => this.Password = text}
                                    ref={ref => this.refPassword = ref}>
                                    {this.Password}
                                </TextInput>
                                <TouchableOpacity
                                    activeOpacity={0.5}
                                    style={{ padding: 3 }}
                                    onPress={() => this.onPressShowPassword()}
                                >
                                    <Image
                                        source={ShowPassword == false ? Images.JeehrShowpass : Images.JeehrHidepass} style={{ tintColor: "white" }} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <ButtonCom
                            text={RootLang.lang.sclogin.dangnhap}
                            style={{
                                width: Width(90), marginTop: 30,
                                height: Width(10),
                                alignItems: "center", justifyContent: "center", alignSelf: "center",
                                backgroundColor: "#00B471",
                                backgroundColor1: "#00B479",
                                borderRadius: 8
                            }}
                            onPress={() => (
                                Keyboard.dismiss(),
                                this.UserLogin())} />

                        {Username && Username == UsernameTemp ?
                            <TouchableOpacity
                                activeOpacity={0.5}
                                onPress={() => {
                                    this.setState({ Username: "" })
                                    this.Password = ''
                                }}>
                                <View style={{ flexDirection: 'column' }}>
                                    <Text style={{
                                        fontSize: sizes.sText13, color: "white",
                                        marginLeft: 10, marginTop: 28, lineHeight: 18,
                                        alignSelf: 'center', fontWeight: "500"

                                    }}>
                                        {RootLang.lang.thongbaochung.dangnhapbangtaikhoankhac}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            :
                            <View style={{ flexDirection: 'row', paddingVertical: 20, justifyContent: 'center' }}>
                                <Text style={styles.txtRegistration}>{RootLang.lang.thongbaochung.chuacotaikhoan}? </Text>
                                <TouchableOpacity onPress={() => {
                                    Utils.goscreen(this, 'sc_registration')
                                }} style={{}}>
                                    {/* <Text style={styles.txtRegistration}>{RootLang.lang.thongbaochung.chuacotaikhoan}?</Text> */}
                                    <View style={{ paddingHorizontal: 5 }}></View>
                                    <Text style={styles.txtRegistration2}>{RootLang.lang.thongbaochung.dangky}</Text>
                                </TouchableOpacity>
                            </View>
                        }
                        {/* <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={() => {
                                // Utils.goscreen(this, "Modal_Register");
                            }}>
                            <View style={{ flexDirection: 'column' }}>
                                <Text style={{
                                    fontSize: sizes.sText13, color: "white",
                                    marginLeft: 10, marginTop: 28, lineHeight: 18,
                                    alignSelf: 'center', fontWeight: "500"

                                }}>
                                    {"Quên mật khẩu?"}
                                </Text>
                            </View>
                        </TouchableOpacity> */}
                    </View>
                </KeyboardAwareScrollView >
                <IsLoading />
            </ImageBackground >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFEA00",
        alignItems: "center",
        justifyContent: "center"
    },
    text: {
        color: Colors.main,
        fontWeight: "600",
        marginBottom: 8,
        marginTop: 32,
        fontSize: 18,
    },
    txtRegistration: {
        color: 'white',
        fontSize: reText(14)
    },
    txtRegistration2: {
        color: 'white',
        fontSize: reText(14),
        fontWeight: 'bold'
    },
});