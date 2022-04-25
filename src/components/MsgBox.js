import React from 'react';
import { Animated, BackHandler, Easing, Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Utils from '../app/Utils';
import { Images } from '../images';
import HeaderModal from '../Component_old/HeaderModal';
import { colors } from '../styles/color';
import { fonts } from '../styles/font';
import { sizes } from '../styles/size';
import { Height, nstyles, nwidth } from '../styles/styles';
import ButtonCom from './Button/ButtonCom';
//styles màn hình popup
export const stMsgBox = StyleSheet.create({
    npopupContain: {
        position: 'absolute',
        left: 0, right: 0, bottom: 0, top: 0,
        flexDirection: 'column'
    },
    npopupBgr: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: colors.black,
        opacity: 0.28
    },
    ntext: {
        textAlign: 'center',
        fontSize: sizes.sText16,
        marginVertical: 5
    },
    btnContain: {
        borderRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 8,
        marginHorizontal: 15,
        justifyContent: 'center',
        backgroundColor: colors.colorGrayText
    }
});

export default class MsgBox extends React.PureComponent {

    constructor(props) {
        super(props);
        // this.title = this.props.route.params.getParam('title', '');
        this.title = Utils.ngetParam(this, 'title', '')
        this.message = Utils.ngetParam(this, 'message', null);
        this.buttons = Utils.ngetParam(this, 'buttons', [{ text: 'OK', img: [], color: [], onPress: () => { } }]);
        this.isdelete = Utils.ngetParam(this, 'isdelete', false);
        this.goBack = Utils.ngetParam(this, 'goBack', false);
        this.dataMsgBox = Utils.ngetParam(this, 'dataMsgBox', {});
        this.disable = Utils.ngetParam(this, 'disable', false);
        this.colorButtonLeft = Utils.ngetParam(this, 'colorButtonLeft', null);
        this.colorButtonRight = Utils.ngetParam(this, 'colorButtonRight', null);

        // --
        this.state = {
            isShowMsg: true,
            opacityView: new Animated.Value(0),
            widthView: new Animated.Value(0.15 * nwidth),
            isOK: 0,
            opacity: new Animated.Value(0)
        }
    }



    componentDidMount() {
        this.backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            this.backAction
        );
        const ani1 = Animated.timing(
            this.state.opacityView,
            {
                toValue: 0.96,
                duration: 500
            }
        );
        const ani2 = Animated.timing(
            this.state.widthView,
            {
                toValue: 0.88 * nwidth,
                duration: 700,
                easing: Easing.bounce
            }
        );
        Animated.parallel([ani1, ani2]).start();
        this._startAnimation(0.8)
    }


    componentWillUnmount() {
        this.backHandler.remove();
    }

    backAction = () => {
        if (this.goback) {
            this._endAnimation(0)

            Utils.goback(this, null);
        }
        return true;
    };

    static show(params) {
        this.setState({ isShowMsg: false });
    }

    onOK = async () => {
        this._endAnimation(0)
        Utils.goback(this);
        this.buttons[0].onPress();
        if (this.dataMsgBox)
            this.dataMsgBox.img = undefined;
    }

    onCancel = async () => {
        this._endAnimation(0)
        Utils.goback(this)
        this.buttons[1].onPress()
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
    _goback = () => {
        this._endAnimation(0)
        Utils.goback(this);
    }
    //Menu popup More...
    render() {
        var isdelete = this.isdelete
        const { opacity } = this.state
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: `transparent`, justifyContent: 'flex-end', }]}>
                <Animated.View style={{
                    position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
                    backgroundColor: colors.backgroundModal, alignItems: 'flex-end',
                    opacity
                }} />
                <View style={{
                    justifyContent: 'flex-end', backgroundColor: colors.white,
                    borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 60
                }}>
                    <HeaderModal />
                    {this.goBack == true ?
                        <TouchableOpacity style={{ marginLeft: 20 }} onPress={this._goback} >
                            <Image
                                source={Images.icGoBackback}
                                style={{ height: 26, width: 26, tintColor: colors.colorGrayIcon }}
                                resizeMode={'contain'}>
                            </Image>
                        </TouchableOpacity> : null}
                    <View style={{ margin: 10, flexDirection: 'column', }}>
                        {isdelete == true ?
                            <Text style={[stMsgBox.ntext, {
                                fontFamily: fonts.Helvetica, color: colors.colorTabActiveJeeHR,
                                fontSize: sizes.sText18, marginHorizontal: 5
                            }]}>{`${this.title}`.toUpperCase()}</Text> :
                            <Text style={[stMsgBox.ntext, {
                                fontFamily: fonts.Helvetica, color: colors.colorTabActiveJeeHR,
                                fontSize: sizes.sText18, marginHorizontal: 5
                            }]}>{`${this.title}`.toUpperCase()}</Text>
                        }
                        {
                            this.message == null || this.message == '' ? null :
                                <Text style={[stMsgBox.ntext, { marginHorizontal: 5 }]}>{this.message}</Text>
                        }
                        {
                            this.dataMsgBox?.img ?
                                <Image defaultSource={Images.JeeAvatarBig}
                                    source={{ uri: this.dataMsgBox?.img }}
                                    style={{
                                        width: Height(20), height: Height(26), backgroundColor: colors.colorGrayBgr,
                                        alignSelf: 'center', marginTop: 10
                                    }}
                                    resizeMode='contain' /> : null
                        }

                        <View style={{
                            marginTop: 35,
                            flexDirection: 'row', justifyContent: 'space-evenly'
                        }}>
                            {
                                this.buttons.length == 2 ?
                                    <View style={{ width: '40%' }}>

                                        <ButtonCom
                                            disabled={this.disable}
                                            text={this.buttons[1].text}
                                            style={{
                                                backgroundColor: this.disable == true ? colors.colorBtnGray : "#FFBE68",
                                                backgroundColor1: this.disable == true ? colors.colorBtnGray : "#F5892A",
                                                color: this.buttons[1].img || this.disable == false ? colors.white : colors.colorTextBack80
                                            }}
                                            img={this.buttons[1].img}
                                            onPress={this.onCancel} />
                                    </View>

                                    : null
                            }

                            <View style={{ width: '40%' }} >
                                {
                                    isdelete == true ? <ButtonCom
                                        text={this.buttons[0].text}
                                        style={{

                                            //  width: '100%',
                                            backgroundColor: colors.colorButtonLeftJeeHR,
                                            backgroundColor1: colors.colorButtomrightJeeHR,
                                        }}
                                        onPress={this.onOK} /> :
                                        <ButtonCom
                                            text={this.buttons[0].text}
                                            img={this.buttons[0].img}
                                            style={{
                                                //  width: '100%',
                                                backgroundColor: colors.colorButtonLeftJeeHR,
                                                backgroundColor1: colors.colorButtomrightJeeHR,
                                            }}
                                            onPress={this.onOK} />

                                }
                            </View>
                        </View>
                    </View>
                </View>
            </View >


        );
    }
}



