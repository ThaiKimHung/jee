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
import { nstyles } from '../styles/styles';
class Header_TaoBaiDang extends Component {
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
        var { title = '', isSubtitle = false, textSub = '', isGoBack = false, OnGoBack, Screen = false, khenthuong = false,
            textRight = '', iconLeft = '', textleft = '', styTextLeft = {}, styIconLeft = {}, onPressLeft = this._onPressLeft, onPressRight = () => { }, styTextRight = {}, styTouchRight = {}, styBorder = {}, } = this.props

        return (
            <View
                style={[nstyles.nHcontent, {
                    paddingHorizontal: 15,
                    height: isIphoneX() ? 80 : 60,
                    width: '100%',
                }, styBorder]} resizeMode='cover' >
                <View style={[nstyles.nrow, {
                    flexDirection: 'row', flex: 1,
                    height: isIphoneX() ? 80 : 60,

                    justifyContent: 'center', alignItems: 'center'
                }]}>
                    <TouchableOpacity
                        style={{
                            paddingRight: textleft ? 5 : khenthuong == true ? 20 : 50, height: isIphoneX() ? 80 : 60,
                            alignItems: 'center', justifyContent: 'center'
                        }}
                        activeOpacity={0.5}
                        onPress={onPressLeft}>
                        {
                            iconLeft && textleft ?
                                <View style={{ flexDirection: 'row', }}>
                                    <Image
                                        source={iconLeft}
                                        resizeMode={'cover'}
                                        style={styIconLeft}
                                    />
                                    <Text style={[styTextLeft, { paddingLeft: 10 }]}>{textleft}</Text>
                                </View>

                                :
                                <View style={{ flexDirection: 'row', }}>
                                    <Image
                                        source={iconLeft}
                                        resizeMode={'cover'}
                                        style={[styIconLeft, { tintColor: "#707070" }]}
                                    />
                                </View>
                        }
                    </TouchableOpacity>
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: textRight ? 0 : 60,
                            height: isIphoneX() ? 80 : 60,
                            // backgroundColor: 'red',
                            marginLeft: iconLeft ? 0 : 10
                        }}
                    >
                        <Text style={{
                            lineHeight: sizes.sText24,
                            fontSize: sizes.sText15,
                            fontFamily: fonts.Helveticab,
                            color: colors.black,
                            fontWeight: "bold"
                        }}>{title}</Text>
                    </View>
                    {textRight ?
                        <TouchableOpacity onPress={onPressRight} style={[{ paddingLeft: 20, paddingVertical: 5 }, styTouchRight]}>
                            <Text style={styTextRight} >{textRight}</Text>
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
export default Utils.connectRedux(Header_TaoBaiDang, mapStateToProps, true)



