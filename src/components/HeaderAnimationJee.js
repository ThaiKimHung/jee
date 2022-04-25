import React, { Component } from 'react';
import {
    Image, ImageBackground, Text, TouchableOpacity, View
} from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper';
import Utils from '../app/Utils';
import { Images } from '../images';
import { colors } from '../styles';
import { fonts } from '../styles/font';
import { reText, sizes } from '../styles/size';
import { heightHed, heightStatusBar, nstyles, paddingTopMul, Width } from '../styles/styles';

const height = (Platform.OS == 'android' ? heightHed + heightStatusBar / 2 : heightHed)

class HeaderAnimationJee extends Component {
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
            iconRight = '', iconLeft = '', textleft = '', styTextLeft = {}, styIconLeft = {}, onPressLeft = this._onPressLeft, onPressRight = () => { }, styIconRight = {}, styTouchRight = {}, count = -1 } = this.props

        return (

            // <View style={[nstyles.shadow, { marginBottom: 1, alignItems: 'center', justifyContent: 'center' }]}>
            <View
                style={{
                    paddingTop: paddingTopMul + 8,
                    backgroundColor: colors.backgroudJeeHR,
                    paddingHorizontal: 15,
                    height: height,
                    width: '100%',
                }} resizeMode='cover' >
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
                                <View style={{ flexDirection: 'row' }}>
                                    <Image
                                        source={iconLeft}
                                        resizeMode={'cover'}
                                        style={styIconLeft}
                                    />
                                    <Text style={[styTextLeft, { paddingLeft: 10 }]}>{textleft}</Text>
                                </View>

                                :
                                <Image
                                    source={Images.ImageJee.icBackJeeHR}
                                    resizeMode={'cover'}
                                    style={{}}
                                />
                        }
                    </TouchableOpacity>
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: iconRight ? 0 : Width(13),
                            height: isIphoneX() ? 80 : 60, flexDirection: 'row'
                            // backgroundColor: 'red',
                        }}
                    >
                        <Text style={{
                            lineHeight: sizes.sText24,
                            fontSize: sizes.sText18,
                            fontFamily: fonts.Helveticab,
                            color: colors.titleJeeHR,
                            fontWeight: "bold",
                        }}>{title}</Text>
                        {isSubtitle == true ?
                            <Text style={{
                                fontSize: sizes.sText12,
                                lineHeight: sizes.sText16,
                                fontFamily: fonts.HelveticaBold,
                                color: colors.white
                            }}>{textSub}</Text>
                            : null}
                        {count == -1 ? null :
                            <View style={{ width: count > 99 ? Width(8) : Width(6.5), height: Width(6.5), borderRadius: Width(5), backgroundColor: count == 0 ? colors.black_20 : colors.redtext, justifyContent: 'center', alignItems: 'center', marginLeft: 2, alignSelf: 'center' }}>
                                <Text style={{ color: colors.white, fontSize: count > 99 ? reText(13) : reText(14) }}>{count}</Text>
                            </View>
                        }
                    </View>

                    {iconRight ?
                        <TouchableOpacity onPress={onPressRight} style={[{ paddingLeft: 20, paddingVertical: 5 }, styTouchRight]}>
                            <Image source={iconRight} style={styIconRight} />
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
export default Utils.connectRedux(HeaderAnimationJee, mapStateToProps, true)



