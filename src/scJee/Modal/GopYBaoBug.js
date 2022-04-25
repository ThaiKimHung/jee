import LottieView from 'lottie-react-native'
import React, { Component } from 'react'
import { Animated, Platform, Linking, Text, TextInput, TouchableOpacity, View, Alert, Keyboard } from 'react-native'
import * as Animatable from 'react-native-animatable'
import Dash from 'react-native-dash'
import { colors } from '../../../src/styles/color'
import { reText } from '../../../src/styles/size'
import { Height, nstyles, Width } from '../../../src/styles/styles'
import { RootLang } from '../../app/data/locales'
import Utils from '../../../src/app/Utils'
import { SendFeedBackorBugs } from '../../../src/apis/apiTemp'
import { Images } from '../../images'
import { appConfig } from '../../app/Config'
import RNRestart from 'react-native-restart';
import Mailer from 'react-native-mail';
import DeviceInfo from 'react-native-device-info';
import moment from 'moment'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';

export class GopYBaoBug extends Component {
    constructor(props) {
        super(props)
        this.state = {
            opacity: new Animated.Value(0),
            textGChu: '',
            height: 0,
            keyboardStatus: true
        }
    }

    componentDidMount() {
        this._startAnimation(0.4)
        this.keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            this._keyboardDidShow,
        );
        this.keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            this._keyboardDidHide,
        );
    }

    _keyboardDidShow = () => {
        this.setState({ keyboardStatus: true });
    }

    _keyboardDidHide = () => {
        this.setState({ keyboardStatus: false });
    }


    _startAnimation = (value) => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: value,
                duration: 300
            }).start();
        }, 350);
    };

    _goback = () => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: 0,
                duration: 250
            }).start(() => {
                Utils.goback(this)
            });
        }, 100);
    }

    _sendFeedBack = async () => {
        const date = new Date();
        const systemVersion = DeviceInfo.getSystemVersion();
        const brand = DeviceInfo.getBrand();
        const { textGChu } = this.state
        Mailer.mail({
            subject: 'Góp Ý hoặc Báo Bug ' + appConfig.TenAppHome + " Phiên bản " + appConfig.version,
            recipients: ['bachbonglong@gmail.com'],
            body: "Vào ngày " + moment(date).format('DD/MM/YYY') + "\n\n" + "Thiết bị " + brand + "Phiên bản " + systemVersion + "\n\n" + "Đã gởi phản hồi hoặc báo lỗi  " + textGChu,

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

    render() {
        let { opacity } = this.state
        return (
            <View style={[nstyles.ncontainer, {
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'transparent',

            }]}
            >
                <Animated.View onTouchEnd={this._goback} style={{
                    position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
                    backgroundColor: 'black', opacity,
                }} />

                <Animatable.View animation={'zoomInDown'} style={{
                    width: Width(80),
                    height: Height(46),
                    backgroundColor: colors.colorBGHome,
                    borderRadius: 15
                }}>
                    <KeyboardAwareScrollView
                        keyboardDismissMode='on-drag'
                        showsVerticalScrollIndicator={false}
                        style={{ paddingTop: 10, paddingBottom: Width(20) }}>
                        <View style={{ alignSelf: "center", height: Height(45), }}>
                            <View style={{ flex: 1, height: Height(16), }}>
                                <Text style={{ position: "absolute", fontSize: reText(20), color: colors.textTabActive, paddingLeft: 20 }}>{RootLang.lang.thongbaochung.gopybaoloi}</Text>
                                <LottieView style={{ height: Height(24), width: Width(70), opacity: 0.6, bottom: 10, alignSelf: "center" }} source={require('../../../src/images/lottie/support.json')} autoPlay loop />
                            </View>
                            <View style={{ height: Height(28), }}>
                                <View style={{ height: Height(40), flex: 1, }}>
                                    <TextInput
                                        placeholder={RootLang.lang.sccaidat.nhapnoidungphanhoi}
                                        multiline={true}
                                        textAlignVertical={"center"}
                                        onContentSizeChange={(event) => {
                                            this.setState({ height: event.nativeEvent.contentSize.height })
                                        }}
                                        ref={(ref) => { this.IpGhiChu = ref }}
                                        value={this.state.textGChu}
                                        style={[nstyles.ntextinput]}
                                        onChangeText={(textGChu) => this.setState({ textGChu: textGChu })}
                                    />
                                </View>
                                <View style={{ justifyContent: 'flex-end', height: Height(6.5) }}>
                                    <Dash
                                        dashColor={colors.colorTextBTGray}
                                        style={{ width: '90%', height: 0.8, paddingTop: 10, alignSelf: "center", }}
                                        dashGap={0}
                                        dashThickness={0.5} />
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                        <TouchableOpacity onPress={this._goback} activeOpacity={0.5}
                                            style={{
                                                alignItems: 'center', justifyContent: 'center',
                                                width: Width(40),
                                            }}>
                                            <Text style={{ fontSize: reText(14), padding: 20, }}>{RootLang.lang.common.huy}</Text>
                                        </TouchableOpacity>

                                        <View style={{ alignSelf: "center" }}>
                                            <Dash
                                                dashColor={colors.colorTextBTGray}
                                                style={{ height: Height(4), flexDirection: 'column' }}
                                                dashGap={0}
                                                dashThickness={0.5} />
                                        </View>
                                        <TouchableOpacity onPress={() => { this._sendFeedBack() }} activeOpacity={0.5}
                                            style={{
                                                alignItems: 'center', justifyContent: 'center',
                                                width: Width(40),
                                            }}>
                                            <Text style={{ fontSize: reText(14), padding: 20, color: colors.textTabActive, fontWeight: '600' }}>{RootLang.lang.thongbaochung.gui}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View >

                            </View>

                        </View>
                    </KeyboardAwareScrollView>
                </Animatable.View>
            </View >
        )
    }
}

const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(GopYBaoBug, mapStateToProps, true)


