import LottieView from 'lottie-react-native'
import moment from 'moment'
import React, { Component } from 'react'
import { Alert, Animated, Keyboard, Linking, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native'
import * as Animatable from 'react-native-animatable'
import Dash from 'react-native-dash'
import DeviceInfo from 'react-native-device-info'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Mailer from 'react-native-mail'
import RNRestart from 'react-native-restart'
import Utils from '../../src/app/Utils'
import { colors } from '../../src/styles/color'
import { reText } from '../../src/styles/size'
import { Height, nstyles, Width } from '../../src/styles/styles'
import { appConfig } from '../app/Config'
import { RootLang } from '../app/data/locales'

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
            subject: 'G??p ?? ho???c B??o Bug ' + appConfig.TenAppHome + " Phi??n b???n " + appConfig.version,
            recipients: ['nthoang7398@gmail.com'],
            body: "V??o ng??y " + moment(date).format('DD/MM/YYY') + "\n\n" + "Thi???t b??? " + brand + "Phi??n b???n " + systemVersion + "\n\n" + "???? g???i ph???n h???i ho???c b??o l???i  " + textGChu,

        }, (error, event) => {
            Alert.alert(
                "Kh??ng t??m th???y ???ng d???ng Gmail",
                "Vui l??ng t???i Gmail ????? th???c hi???n t??nh n??ng n??y",
                [
                    { text: 'T???i v???', onPress: () => Linking.openURL(Platform.OS == 'android' ? 'https://play.google.com/store/apps/details?id=com.google.android.gm&hl=en&gl=US' : 'https://apps.apple.com/us/app/gmail-email-by-google/id422689480') },
                    { text: 'Hu???', onPress: () => RNRestart.Restart() }
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
                    height: Width(100),
                    backgroundColor: colors.colorBGHome,
                    borderRadius: 15
                }}>
                    <KeyboardAwareScrollView
                        keyboardDismissMode='on-drag'
                        showsVerticalScrollIndicator={false}
                        style={{ paddingTop: 10, paddingBottom: Width(20) }}>
                        <View style={{ alignSelf: "center", height: Width(98) }}>
                            <View style={{ flex: 1, height: Width(45) }}>
                                <Text style={{ position: "absolute", fontSize: reText(20), color: colors.textTabActive, paddingLeft: 20 }}>{RootLang.lang.thongbaochung.gopybaoloi}</Text>
                                <LottieView style={{ height: Width(60), width: Width(70), opacity: 0.6, bottom: 10, alignSelf: "center" }} source={require('../images/lottieJeeHR/support.json')} autoPlay loop />
                            </View>
                            <View style={{ height: Width(45) }}>
                                <View style={{ maxHeight: Width(35), flex: 1 }}>
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
                                <View style={{ flex: 1, position: 'absolute', bottom: 0 }}>
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


