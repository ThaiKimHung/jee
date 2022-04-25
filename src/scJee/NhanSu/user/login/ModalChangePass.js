import React, { Component } from 'react';
import {
    Animated,
    Image,
    StyleSheet, Text,
    TouchableOpacity, View, Platform
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { ChangePassword, } from '../../../../apis/apiUser';
import { RootLang } from '../../../../app/data/locales';
import { nGlobalKeys } from '../../../../app/keys/globalKey';
import Utils from '../../../../app/Utils';
import ButtonCom from '../../../../components/Button/ButtonCom';
import { Images } from '../../../../images/index';
import { colors } from '../../../../styles/color';
import { fonts } from '../../../../styles/font';
import { reSize, sizes } from '../../../../styles/size';
import { Height, nHeight, nstyles, paddingBotX } from '../../../../styles/styles';
// import HeaderModal from '../../Component/HeaderModal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import OneSignal from 'react-native-onesignal';
import UtilsApp from '../../../../app/UtilsApp';
import { ModalTop } from '../../../Modal/NhanSu/ModalTop';
import { ModalButtonBottom } from '../../../Modal/NhanSu/ModalButtonBottom';
class ModalChangePass extends Component {
    constructor(props) {
        super(props);
        this.Password = '';
        this.Password1 = '';
        this.Password2 = '';
        this.showWarning = false
        this.state = {
            ShowPassword: true,
            ShowPassword1: true,
            ShowPassword2: true,
            res: {},
            warning: '',
            opacity: new Animated.Value(0)
        }
    }
    componentDidMount() {
        this._startAnimation(0.8)
    }
    _goback = async () => {
        this._endAnimation(0)
        Utils.goback(this)
    }
    _startAnimation = (value) => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: value,
                duration: 300
            }).start();
        }, 400);
    };

    _endAnimation = (value) => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: value,
                duration: 1
            }).start();
        }, 1);
    };
    logout = async () => {
        OneSignal.removeExternalUserId((results) => {
            Utils.nlog("removeExternalUserId_DangKyOneSignal:", results)
        });
        this._goback()
        Utils.replace(this, 'sc_login');

        // const res = await LogoutJee();
        // // Utils.nlog('LOGOUT', res)
        // if (res.status == 1) {
        //     this._goback()
        //     Utils.replace(this, 'sc_login');
        //     Utils.nsetStorage(nkey.token, '')
        //     Utils.nsetStorage(nkey.access_token, '');
        //     Utils.nsetStorage(nkey.biometrics, false)
        //     // Utils.replace(this, 'sc_login');

        // }
    }
    onChangePassword = async () => {
        Utils.showMsgBoxYesNo(this, RootLang.lang.thongbaochung.thongbao, RootLang.lang.sccaidat.xacnhandoimatkhau,
            RootLang.lang.thongbaochung.xacnhan,
            RootLang.lang.thongbaochung.thoat, async () => {
                var { warning = '' } = this.state;
                this.showWarning = false;
                if (this.Password.length <= 0) {
                    warning += RootLang.lang.sccaidat.nhapmatkhaucu;
                    this.showWarning = true;
                }
                if (this.Password1.length <= 0) {
                    warning += RootLang.lang.sccaidat.nhapmatkhaumoi;
                    this.showWarning = true;
                }
                if (this.Password2.length <= 0) {
                    warning += RootLang.lang.sccaidat.nhaplaimatkhaumoi;
                    this.showWarning = true;
                }
                if (this.Password1 != this.Password2) {
                    warning += RootLang.lang.sccaidat.matkhauphaigiongnhau;
                    this.showWarning = true;
                }
                // if (this.Password.length < 6 || this.Password1.length < 6 || this.Password2.length < 6) {
                //     warning += RootLang.lang.sccaidat.matkhautoithieu6kytu;
                //     this.showWarning = true;
                // }
                if (this.showWarning == true) {
                    UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, warning, 4)
                    this.showWarning == false
                    return;

                }
                let username = Utils.getGlobal(nGlobalKeys.Username, '')
                let res = await ChangePassword(username, this.Password, this.Password1);
                Utils.nlog("CHANGPASS:", res)
                if (res.status == 1) {
                    UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.sccaidat.doimatkhauthanhcong, 1)
                    this.logout()
                } else {
                    UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error : RootLang.lang.sccaidat.doimatkhauthatbai, 2)
                }

            }, () => { }, true)
    }

    render() {
        let viewDotGreen = <View style={{ backgroundColor: colors.colorTabActive, width: 6, height: 6, borderRadius: 3, }} />
        const { ShowPassword, ShowPassword1, ShowPassword2 } = this.state
        var item = this.state.data
        const { opacity } = this.state
        return (
            <KeyboardAwareScrollView style={{ flex: 1, }} keyboardShouldPersistTaps='handled'>
                <View style={{
                    backgroundColor: `transparent`,
                    justifyContent: 'flex-end', opacity: 1,
                    height: nHeight(100)
                }}>
                    <Animated.View onTouchEnd={this._goback} style={{
                        position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
                        backgroundColor: colors.backgroundModal, alignItems: 'flex-end',
                        opacity
                    }} />
                    <View style={{
                        backgroundColor: colors.backgroundColor,
                        paddingBottom: paddingBotX,
                        borderTopLeftRadius: 15,
                        borderTopRightRadius: 15,
                        flexDirection: 'column',
                        paddingHorizontal: 15,
                    }}>
                        <View style={{
                            backgroundColor: colors.backgroundColor,
                        }}>
                            {/* <HeaderModal />
                            <TouchableOpacity onPress={this._goback} >
                                <Image
                                    source={Images.icGoBackback}
                                    style={{ height: 26, width: 26, tintColor: colors.colorGrayIcon }}
                                    resizeMode={'contain'}>
                                </Image>
                            </TouchableOpacity>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                            }}>
                                <Text style={{
                                    fontSize: sizes.sText18, fontFamily: fonts.HelveticaBold,
                                    lineHeight: 24, color: colors.colorTabActive, paddingVertical: 10,
                                }}>
                                    {RootLang.lang.sccaidat.doimatkhaunguoidung.toUpperCase()}</Text>
                            </View> */}
                            <ModalTop
                                imgHeaderLine={Images.icTopModal}
                                title={RootLang.lang.sccaidat.doimatkhaunguoidung}
                            />
                            <View style={{
                                marginTop: 20,
                                borderColor: colors.colorInput,
                                borderWidth: 1,
                                borderRadius: 10,
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingHorizontal: 20,
                                backgroundColor: 'white'
                            }}>
                                <Image
                                    style={[nstyles.nIcon16]}
                                    resizeMode={'contain'}
                                    source={Images.JeehrPassword} />
                                <View style={{
                                    flexDirection: 'row', flex: 1,
                                    alignItems: 'center',
                                    justifyContent: 'space-between',

                                }}>
                                    <TextInput
                                        placeholder={RootLang.lang.sccaidat.matkhauhientai}
                                        placeholderTextColor={colors.colorPlayhoder}
                                        style={{
                                            color: colors.colortext,
                                            fontSize: sizes.sText16, alignSelf: 'center',
                                            justifyContent: 'center', textAlign: 'center',
                                            padding: 10, flex: 1, fontFamily: fonts.Helvetica
                                        }}
                                        underlineColorAndroid={'transparent'}
                                        secureTextEntry={ShowPassword}
                                        onChangeText={text => this.Password = text}
                                        ref={ref => this.refPassword = ref}>
                                        {this.Password}
                                    </TextInput>
                                    <TouchableOpacity
                                        activeOpacity={0.5}
                                        onPress={() => this.setState({ ShowPassword: !this.state.ShowPassword })}
                                    >
                                        <Image
                                            source={ShowPassword == true ? Images.JeehrHidepass : Images.JeehrShowpass} style={{ tintColor: colors.colorTabActive }} />
                                    </TouchableOpacity>
                                </View>
                            </View>


                            <View style={{
                                marginTop: 20,
                                borderColor: colors.colorInput,
                                borderWidth: 1,
                                borderRadius: 10,
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingHorizontal: 20,
                                backgroundColor: 'white'
                            }}>
                                <Image
                                    style={[nstyles.nIcon16]}
                                    resizeMode={'contain'}
                                    source={Images.JeehrPassword} />
                                <View style={{
                                    flexDirection: 'row', flex: 1,
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}>
                                    <TextInput
                                        placeholder={RootLang.lang.sccaidat.matkhaumoi}
                                        placeholderTextColor={colors.colorPlayhoder}
                                        style={{
                                            color: colors.colortext,
                                            fontSize: sizes.sText16, alignSelf: 'center',
                                            justifyContent: 'center', textAlign: 'center',
                                            padding: 10, flex: 1, fontFamily: fonts.Helvetica
                                        }}
                                        underlineColorAndroid={'transparent'}
                                        secureTextEntry={ShowPassword1}
                                        onChangeText={text => this.Password1 = text}
                                        ref={ref => this.refPassword1 = ref}>
                                        {this.Password1}
                                    </TextInput>
                                    <TouchableOpacity
                                        activeOpacity={0.5}

                                        onPress={() => this.setState({ ShowPassword1: !this.state.ShowPassword1 })}
                                    >
                                        <Image
                                            source={ShowPassword1 == true ? Images.JeehrHidepass : Images.JeehrShowpass} style={{ tintColor: colors.colorTabActive }} />
                                    </TouchableOpacity>
                                </View>
                            </View>


                            <View style={{
                                marginTop: 20,
                                borderColor: colors.colorInput,
                                borderWidth: 1,
                                borderRadius: 10,
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingHorizontal: 20,
                                backgroundColor: 'white'
                            }}>
                                <Image
                                    style={[nstyles.nIcon16]}
                                    resizeMode={'contain'}
                                    source={Images.JeehrPassword} />
                                <View style={{
                                    flexDirection: 'row', flex: 1,
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}>
                                    <TextInput
                                        placeholder={RootLang.lang.sccaidat.nhaplaimatkhaumoi}
                                        placeholderTextColor={colors.colorPlayhoder}
                                        style={{
                                            color: colors.colortext,
                                            fontSize: sizes.sText16, alignSelf: 'center',
                                            justifyContent: 'center', textAlign: 'center',
                                            padding: 10, flex: 1, fontFamily: fonts.Helvetica
                                        }}
                                        underlineColorAndroid={'transparent'}
                                        secureTextEntry={ShowPassword2}
                                        onChangeText={text => this.Password2 = text}
                                        ref={ref => this.refPassword2 = ref}>
                                    </TextInput>
                                    <TouchableOpacity
                                        activeOpacity={0.5}
                                        onPress={() => this.setState({ ShowPassword2: !this.state.ShowPassword2 })}
                                    >
                                        <Image
                                            source={ShowPassword2 == true ? Images.JeehrHidepass : Images.JeehrShowpass} style={{ tintColor: colors.colorTabActive }} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {/* <Text style={{
                                color: colors.black, fontSize: sizes.sText14,
                                marginTop: 28, paddingHorizontal: 8, lineHeight: 22
                            }}>
                                {RootLang.lang.sccaidat.quydinh}
                            </Text>
                            <Text style={{
                                color: colors.black, fontSize: sizes.sText14,
                                marginTop: 4, marginLeft: 8,
                                lineHeight: 20, textAlignVertical: 'top'
                            }}>
                                {viewDotGreen}   {RootLang.lang.sccaidat.cotu8kytutrolen}
                                {viewDotGreen}   {RootLang.lang.sccaidat.mkphaichuacachuso}
                                {viewDotGreen}   {RootLang.lang.sccaidat.mkphaichuahoathuong}
                                {viewDotGreen}   {RootLang.lang.sccaidat.mkphaichuacackitudacbiet}
                            </Text> */}
                            <View style={{
                                marginTop: 30, marginBottom: 10 + paddingBotX,
                            }}>
                                {/* <ButtonCom
                                    text={RootLang.lang.sccaidat.doimatkhau}
                                    style={{
                                        backgroundColor: colors.colorButtomleft,
                                        backgroundColor1: colors.colorButtomright,
                                        fontSize: sizes.sText14,
                                        width: reSize(160),
                                    }}
                                    onPress={this.onChangePassword} /> */}
                                <ModalButtonBottom
                                    textButton={RootLang.lang.sccaidat.doimatkhau}
                                    _fontWeight='bold'
                                    _onPress={this.onChangePassword}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        )
    }
}
const styler = StyleSheet.create({
})

const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(ModalChangePass, mapStateToProps, true)