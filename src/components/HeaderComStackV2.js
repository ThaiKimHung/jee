import React, { Component } from 'react';
import {
    Image, ImageBackground, Text, TouchableOpacity, View
} from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper';
import Utils from '../app/Utils';
import { Images } from '../images';
import { colors } from '../styles';
import { fonts } from '../styles/font';
import { sizes } from '../styles/size';
import { heightHed, heightStatusBar, nstyles, Width } from '../styles/styles';

const height = (Platform.OS == 'android' ? heightHed + heightStatusBar / 2 : heightHed)

class HeaderComStackV2 extends Component {
    constructor(props) {
        super(props);


        // this.state = {
        //     User: {}
        // }

    }
    componentDidMount() {

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
        var { title = '', isSubtitle = false, textSub = '', isGoBack = false, OnGoBack, Screen = false,
            iconRight = '', iconLeft = '', textleft = '', styTextLeft = {}, styIconLeft = {}, onPressLeft = this._onPressLeft, onPressRight = () => { }, styIconRight = {}, styTouchRight = {}, styBorder = {}, } = this.props

        return (

            // <View style={[nstyles.shadow, { marginBottom: 1, alignItems: 'center', justifyContent: 'center' }]}>
            <View
                style={[nstyles.nHcontent, {
                    paddingHorizontal: 15,
                    height: height,
                    width: '100%',
                }, styBorder]} resizeMode='cover' >
                <View style={[nstyles.nrow, {
                    flexDirection: 'row', flex: 1,
                    height: height,

                    justifyContent: 'center', alignItems: 'center'
                }]}>
                    <TouchableOpacity
                        style={{
                            paddingRight: 20, height: height, width: Width(13),
                            alignItems: 'flex-start', justifyContent: 'center'
                        }}
                        activeOpacity={0.5}
                        onPress={onPressLeft}>
                        {
                            iconLeft && textleft ?
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image
                                        source={iconLeft}
                                        resizeMode={'cover'}
                                        style={styIconLeft}
                                    />
                                    <Text style={[styTextLeft, { paddingLeft: 10 }]}>{textleft}</Text>
                                </View>

                                :
                                <View style={{ flexDirection: 'row', }}>
                                    <View>
                                        {iconLeft ? (
                                            <Image
                                                source={iconLeft}
                                                resizeMode={'cover'}
                                                style={[styIconLeft, { tintColor: "#707070" }]}
                                            />
                                        ) : (null)}
                                    </View>

                                </View>
                        }
                    </TouchableOpacity>
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: iconRight ? 0 : Width(13),
                            height: isIphoneX() ? 80 : 60,
                            // backgroundColor: 'red',

                        }}
                    >
                        <Text style={{
                            lineHeight: sizes.sText24,
                            fontSize: sizes.sText15,
                            fontFamily: fonts.Helveticab,
                            color: colors.black,
                            fontWeight: "bold"
                        }}>{title}</Text>
                        {isSubtitle == true ?
                            <Text style={{
                                fontSize: sizes.sText12,
                                lineHeight: sizes.sText16,
                                fontFamily: fonts.HelveticaBold,
                                color: colors.white
                            }}>{textSub}</Text>
                            : null}
                    </View>
                    {iconRight ?
                        <TouchableOpacity onPress={onPressRight} style={[{ paddingLeft: 20, paddingVertical: 5 }, styTouchRight]}>
                            <Image source={iconRight} style={[styIconRight, {}]} />
                        </TouchableOpacity> : null
                    }
                </View>
            </View >
            // </View >



        );
    }
}
const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(HeaderComStackV2, mapStateToProps, true)



