import React, { Component } from 'react';
import { Alert, Image, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { updateCheDoMCC } from '../../../../apis/apiControllergeneral';
import { RootLang } from '../../../../app/data/locales';
import { nkey } from '../../../../app/keys/keyStore';
import Utils from '../../../../app/Utils';
import UtilsApp from '../../../../app/UtilsApp';
import ButtonCom from '../../../../components/Button/ButtonCom';
import IsLoading from '../../../../components/IsLoading';
import { Images } from '../../../../images';
import { colors } from '../../../../styles/color';
import { fonts } from '../../../../styles/font';
import { sizes } from '../../../../styles/size';
import { nstyles } from '../../../../styles/styles';

export default class ModalConfirmPass extends Component {
    constructor(props) {
        super(props);
        this.nthis = props.nthis;
        this.Password = '';
        this.state = {
            modalVisible: false,
            ShowPassword: false,
            statusCheck: ''
        }
    }

    componentDidMount() {

    }

    _goback = async () => {
        Utils.goback(this)
    }

    onPressShowPassword = () => {
        this.setState({
            ShowPassword: !this.state.ShowPassword
        })
    }

    onDangXuat_Thoat = async () => {
        if (this.Password == '') {
            this.setState({ statusCheck: RootLang.lang.scchamcong.vuilongnhapmatkhauxacnhan });
            return;
        }
        this.waitting.show();
        // let tempUsername = Utils.getGlobal(nGlobalKeys.Username, '');
        let res = await updateCheDoMCC(false, this.Password);
        Utils.nlog('XXXXXX:', res);
        if (res < 0 || !res || res.status == 0) {
            this.waitting.hide();
            var { error = undefined } = res;
            this.setState({ statusCheck: error ? error.message : RootLang.lang.scchamcong.cosucokhongthedangxuat });
            return;
        }
        if (res.status == 1) {
            this.waitting.hide()
            Utils.nsetStorage(nkey.isModeMayChamCong, false);
            Utils.goscreen(this.nthis, 'sc_login');
            this.setState({
                modalVisible: !this.state.modalVisible
            })
            // await UtilsApp.logOutOneSignal(this.nthis);
        }

    }

    onShow_Hide_Modal = () => {
        this.setState({
            modalVisible: !this.state.modalVisible
        })
    }

    render() {
        var { modalVisible = true, ShowPassword = false } = this.state
        var { } = this.props;
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                }}
            >
                <View style={{ flex: 1, backgroundColor: colors.black_70 }}>
                    <KeyboardAwareScrollView>
                        <View style={{ flex: 1, alignItems: 'center', marginTop: '40%' }}>
                            <View style={{ width: '90%', backgroundColor: colors.white, alignItems: 'center', borderRadius: 5, paddingVertical: 20 }}>
                                <Text
                                    style={{
                                        color: colors.textblack,
                                        fontSize: sizes.sText16, marginBottom: 20
                                    }}>{RootLang.lang.scchamcong.vuilongnhapmatkhauxacnhan}</Text>
                                {
                                    this.state.statusCheck == '' ? null :
                                        <Text
                                            style={{
                                                color: colors.redStar, textAlign: 'center',
                                                fontSize: sizes.sText13, maxWidth: '60%'
                                            }}>{this.state.statusCheck}</Text>
                                }
                                <View style={{
                                    marginTop: 5,
                                    backgroundColor: colors.colorInput,
                                    borderColor: 'transparent',
                                    borderBottomColor: colors.colorInput,
                                    borderWidth: 0.5,
                                    borderRadius: 30,
                                    flexDirection: 'row',
                                    width: '70%',
                                    alignItems: 'center',
                                    paddingHorizontal: 20
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
                                            placeholder={RootLang.lang.sclogin.matkhau}
                                            placeholderTextColor={colors.colorPlayhoder}
                                            style={{
                                                color: colors.textblack,
                                                fontSize: sizes.sText16, alignSelf: 'center',
                                                justifyContent: 'center', textAlign: 'center',
                                                padding: 10, flex: 1, fontFamily: fonts.Helvetica
                                            }}
                                            underlineColorAndroid={'transparent'}
                                            secureTextEntry={!ShowPassword}
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
                                                source={!ShowPassword ? Images.JeehrHidepass : Images.JeehrShowpass} style={{ tintColor: colors.colorTabActive }} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <ButtonCom
                                    text={RootLang.lang.scchamcong.dangxuat}
                                    styleButton={{ width: '70%' }}
                                    style={{
                                        width: '100%', marginTop: 20,
                                        backgroundColor: colors.colorButtomleft,
                                        backgroundColor1: colors.colorButtomright,
                                    }}
                                    onPress={this.onDangXuat_Thoat} />
                                <ButtonCom
                                    text={RootLang.lang.thongbaochung.xemlai}
                                    styleButton={{ width: '70%' }}
                                    style={{
                                        width: '100%', marginTop: 8, color: colors.textblack,
                                        backgroundColor: colors.colorButtonGray,
                                        backgroundColor1: colors.colorButtonGray,
                                    }}
                                    onPress={this.onShow_Hide_Modal} />
                                <IsLoading ref={refs => this.waitting = refs} />
                            </View>

                        </View>
                    </KeyboardAwareScrollView>
                </View>
            </Modal>
        )
    }
}

