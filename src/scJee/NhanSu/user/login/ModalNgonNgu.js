import React, { Component } from 'react';
import {
    Animated,
    Image, Text,
    TouchableOpacity, View
} from 'react-native';
import RNRestart from 'react-native-restart';
import { changeLangue, RootLang } from '../../../../app/data/locales';
import { nkey } from '../../../../app/keys/keyStore';
import Utils from '../../../../app/Utils';
import ButtonCom from '../../../../components/Button/ButtonCom';
import { Images } from '../../../../images/index';
import { colors } from '../../../../styles/color';
import { fonts } from '../../../../styles/font';
import { sizes } from '../../../../styles/size';
import { Height, nHeight, nstyles, paddingBotX } from '../../../../styles/styles';
// import HeaderModal from '../../Component/HeaderModal';
import { ModalTop } from '../../../Modal/NhanSu/ModalTop';
import { ModalButtonBottom } from '../../../Modal/NhanSu/ModalButtonBottom';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
class ModalNgonNgu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // isLang: '',
            isVisible: true,
            isLag: this.props.lang,
            opacity: new Animated.Value(0)
            // isLag: 'vi'  
        }
    }
    componentDidMount() {
        this._startAnimation(0.8)
    }
    switchlanguge = async (val) => {
        if (val == this.props.lang) {
            this._goback()
        }
        else {
            changeLangue(val);
            await Utils.nsetStorage(nkey.lang, val)
            this.props.ChangeLanguage(val);
            RNRestart.Restart();
        }
        // Utils.nlog('ngon ngu ', this.props.lang)
    }
    _goback = async () => {
        this._endAnimation(0)
        Utils.goback(this, null)
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
    render() {
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
                                title={RootLang.lang.sccaidat.ngonngu}
                            />
                            <View style={{ backgroundColor: 'white', paddingHorizontal: 10, marginTop: 25, borderRadius: 10 }}>
                                <TouchableOpacity
                                    onPress={() => this.setState({ isLag: 'vi' })}
                                    style={{ flexDirection: 'row', paddingVertical: 5, alignItems: 'center', justifyContent: 'space-between' }}>

                                    <View style={{ flexDirection: 'row', paddingVertical: 10, alignItems: 'center' }}>
                                        <Image
                                            source={Images.icTiengViet}
                                            style={{ height: 26, width: 26, }}
                                            resizeMode={'contain'}>
                                        </Image>
                                        <Text style={{ marginHorizontal: 10, fontSize: sizes.sText14 }}>{'Tiếng Việt'}</Text>
                                    </View>
                                    <TouchableOpacity >
                                        <Image
                                            source={this.state.isLag == 'vi' ? Images.JeeCheck : Images.JeeUnCheck} />
                                    </TouchableOpacity>

                                </TouchableOpacity>
                                <View style={{ height: 1, backgroundColor: colors.colorLineGray, }}></View>
                                <TouchableOpacity
                                    onPress={() => this.setState({ isLag: 'en' })}
                                    style={{ flexDirection: 'row', paddingVertical: 5, alignItems: 'center', justifyContent: 'space-between' }}>

                                    <View style={{ flexDirection: 'row', paddingVertical: 10, alignItems: 'center' }}>
                                        <Image
                                            source={Images.icTiengAnh}
                                            style={{ height: 26, width: 26, }}
                                            resizeMode={'contain'}>
                                        </Image>
                                        <Text style={{ marginHorizontal: 10, fontSize: sizes.sText14 }}>{'English'}</Text>
                                    </View>
                                    <TouchableOpacity >
                                        <Image
                                            source={this.state.isLag == 'en' ? Images.JeeCheck : Images.JeeUnCheck} />
                                    </TouchableOpacity>

                                </TouchableOpacity>
                            </View>
                            <View style={{
                                marginTop: 30, marginBottom: 10 + paddingBotX,
                            }}>
                                <ModalButtonBottom
                                    textButton={RootLang.lang.sccaidat.xacnhan}
                                    _fontWeight='bold'
                                    _onPress={() => this.switchlanguge(this.state.isLag)}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        )


    }
}
const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(ModalNgonNgu, mapStateToProps, true)