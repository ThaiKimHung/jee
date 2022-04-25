import React, { Component } from 'react';
import { Image, ImageBackground, Platform, Text, TouchableOpacity, View } from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper';
import Utils from '../app/Utils';
import { Images } from '../images';
import { colors } from '../styles';
import { fonts } from '../styles/font';
import { sizes } from '../styles/size';
import { heightHed, nstyles, paddingTopMul, Width } from '../styles/styles';
import LottieView from 'lottie-react-native';
class HeaderChat extends Component {
    constructor(props) {
        super(props);
    }
    _onPressLeft = () => {
        var { isGoBack = false, OnGoBack, Screen = false } = this.props
        if (isGoBack == true) {
            OnGoBack();
        } else if (Screen == true) {
            // Utils.nlog("vao----------------------")
            Utils.goback(this.props.nthis)
            // onGoBack();
        } else {
            Utils.goscreen(this.props.nthis, 'sw_HomePage')
            // Utils.goback(this.nthis);
        }
    }
    render() {
        this.textRef = React.createRef();
        const {
            title = '', textSub = '', isGoBack = false, OnGoBack, Screen = false, checkOn = false,
            iconRight = '', iconLeft = '', styTextLeft = {}, styIconLeft = {}, onPressLeft = this._onPressLeft, onPressRight = () => { },
            styIconRight = {}, styTouchRight = {}, styBorder = {}, avatar, checkTextOn = null, isNhom = false, onPressCall = () => { }, onPressMain = () => { }
        } = this.props
        return (
            <View
                style={[nstyles.nHcontent, styBorder, { paddingHorizontal: 15, height: isIphoneX() ? heightHed : heightHed + 20, paddingTop: paddingTopMul, width: '100%', zIndex: 1 }]} resizeMode='cover' >
                <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity
                        style={{ paddingRight: 10, alignItems: 'flex-start', justifyContent: 'center', height: 80, width: Width(9), }}
                        activeOpacity={0.5}
                        onPress={onPressLeft}
                    >
                        {
                            iconLeft ?
                                <Image
                                    source={iconLeft}
                                    resizeMode={'cover'}
                                    style={[styIconLeft, { tintColor: "#707070" }]}
                                />
                                : null
                        }
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onPressMain} style={{ flex: 1, marginRight: iconRight ? 0 : 50, flexDirection: 'row', alignItems: 'center' }}>
                        <View>
                            {
                                !isNhom ?
                                    <Image source={avatar ? { uri: avatar } : Images.icAva} style={{ ...nstyles.nAva40, borderRadius: Width(8), marginRight: 5 }} />
                                    : null
                            }
                            {
                                checkOn == true ?
                                    <LottieView style={{ height: Width(6), position: 'absolute', bottom: -2, right: -1 }} source={require('../images/lottieJee/icOnline.json')} autoPlay loop />
                                    :
                                    <View style={{ backgroundColor: colors.black_10 }}></View>
                            }
                        </View>
                        <View style={{ justifyContent: 'space-around' }}>
                            <Text style={{ lineHeight: sizes.sText24, fontSize: sizes.sText15, fontFamily: fonts.Helveticab, color: colors.black, fontWeight: "bold" }}>{title}</Text>
                            {!isNhom ? <Text style={{ fontSize: sizes.sText10, fontFamily: fonts.Helveticab, color: colors.black_50, fontWeight: "bold" }}>{checkTextOn ? 'Đang hoạt động' : 'Không hoạt động'}</Text> : null}
                        </View>
                    </TouchableOpacity>
                    <View style={{ width: Width(10), flexDirection: 'row', marginRight: iconRight ? 5 : -10, height: Width(10), justifyContent: 'center' }}>
                        <TouchableOpacity onPress={onPressCall} style={{ width: Width(8), justifyContent: 'center', alignItems: 'center' }}>
                            <Image source={Images.ImageJee.icCallChat} style={{ width: Width(5), height: Width(5), alignSelf: 'center', tintColor: colors.greenTab }} />
                        </TouchableOpacity>
                    </View>
                    {iconRight ?
                        <TouchableOpacity onPress={onPressRight} style={[{ falignItems: 'center', justifyContent: 'center', height: 30 }, styTouchRight]}>
                            <Image source={iconRight} style={[styIconRight, {}]} />
                        </TouchableOpacity>
                        : null
                    }
                </View>
            </View >
        );
    }
}
const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(HeaderChat, mapStateToProps, true)



