import React, { Component } from 'react';
import {
    Animated,
    BackHandler, Image,
    Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput,
    TouchableOpacity, View
} from "react-native";
import { EditNameGroup } from '../../../apis/JeePlatform/Api_JeeSocial/apiJeeSocial';
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import { RootLang } from '../../../app/data/locales';
import Utils from '../../../app/Utils';
import UtilsApp from '../../../app/UtilsApp';
import IsLoading from '../../../components/IsLoading';
import { Images } from '../../../images';
import { colors } from '../../../styles';
import { reText } from '../../../styles/size';
import ImageCus from '../../../components/NewComponents/ImageCus';
import { nstyles, paddingBotX } from '../../../styles/styles';
class Modal_EditTenGroup extends Component {
    constructor(props) {
        super(props);
        this.data = Utils.ngetParam(this, 'idgroup', '')
        this.state = {
            opacity: new Animated.Value(0),
            animationEmoji: new Animated.Value(0),
            msgtext: Utils.ngetParam(this, 'tengroup', ''),
            autoFocus: Utils.ngetParam(this, 'focus', false)
        }
    }

    componentDidMount = async () => {
        this._startAnimation(0.8)
        BackHandler.addEventListener("hardwareBackPress", this._goback);
    }

    componentWillUnmount() {
        try {
            BackHandler.removeEventListener('hardwareBackPress', this._goback)
        }
        catch (error) {
        }
    }

    _goback = async () => {
        this._endAnimation(0)
        Utils.goback(this, null)
        return true
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

    _updateName = async () => {
        nthisLoading.show()
        if (this.state.msgtext == '') {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.JeeSocial.khongduocbotrongtenhom, 4)
            this.setState({ autoFocus: true })
            nthisLoading.hide()
            return
        }
        let res = await EditNameGroup(this.state.msgtext, this.data);
        // Utils.nlog('res edit name =--=-=-==-=-=-=-', res)
        if (res.status == 1) {
            Keyboard.dismiss()
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.JeeSocial.capnhatthanhcong, 1)
            this._goback()
            ROOTGlobal.LoadDanhSachBaiDang_Nhom.LoadDSBaiDang_InNhom()
            ROOTGlobal.LoadDanhSachBaiDang_Nhom.LoadDSBaiDang_Nhom()
            ROOTGlobal.LoadDanhSachGroup.LoadDSGroup()
            ROOTGlobal.LoadDanhSachBaiDang.LoadDSBaiDang()
            ROOTGlobal.LoadDanhSachGroup.GetDSUser_Group()
            nthisLoading.hide()
        } else {
            nthisLoading.hide()
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
        }
    }

    _cancel = () => {
        Utils.showMsgBoxYesNo(this, RootLang.lang.thongbaochung.thongbao, RootLang.lang.JeeSocial.tieptuchinhsua, RootLang.lang.scchamcong.dongy, RootLang.lang.scchamcong.huy, {}
            , () => { this._goback() }
        )
    }


    render() {
        const { opacity, msgtext, animationEmoji, onchange } = this.state
        const animatedStyle = { marginBottom: animationEmoji }
        return (
            <View style={[nstyles.ncontainer, {
                flexGrow: 1,
                backgroundColor: `transparent`,
                opacity: 1,
            }]}>
                <Animated.View onTouchEnd={this._goback}
                    style={{
                        backgroundColor: colors.backgroundModal, flex: 1, opacity
                    }} />
                <View style={{ height: '95%', backgroundColor: colors.white, flexDirection: 'column', paddingBottom: paddingBotX, justifyContent: 'flex-end', }}>
                    <View style={{ flex: 1, }}>
                        <View
                            style={[{
                                paddingHorizontal: 15,
                                borderBottomColor: colors.black_20,
                                borderBottomWidth: 0.3,
                                paddingVertical: 15
                            }]} >
                            <View style={[nstyles.nrow, { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }]}>
                                <TouchableOpacity
                                    style={{ alignItems: 'center', justifyContent: 'center' }}
                                    activeOpacity={0.5}
                                    onPress={this._goback}>
                                    <Image
                                        source={Images.ImageJee.icBack}
                                        resizeMode={'cover'}
                                        style={[nstyles.nIconH16W8, { tintColor: colors.black }]}
                                    />
                                </TouchableOpacity>
                                <View
                                    style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
                                    <Text style={{
                                        fontSize: reText(15), color: colors.black, fontWeight: "bold"
                                    }}>{RootLang.lang.JeeSocial.chinhsua}</Text>
                                </View>
                            </View>
                        </View >
                        <KeyboardAvoidingView
                            keyboardVerticalOffset={Platform.select({ ios: 0, android: 500 })}
                            behavior={(Platform.OS === 'ios') ? "padding" : null}
                            style={{ flex: 1 }}
                        >
                            <View style={{ flex: 1, padding: 10, }}>
                                <View style={[{ flexDirection: "row", }]}>
                                    <View style={{ paddingRight: 5 }}>
                                        <ImageCus
                                            style={[nstyles.nAva35, {}]}
                                            source={{ uri: this.state.avatar, }}
                                            resizeMode={"cover"}
                                            defaultSourceCus={Images.icAva}
                                        />
                                    </View>
                                    <View style={{ flex: 1, paddingHorizontal: Platform.OS == 'ios' ? 10 : 0, justifyContent: "center", paddingVertical: Platform.OS == 'ios' ? 10 : 0, backgroundColor: "#f1f0f5", borderRadius: 20, }}>
                                        <TextInput
                                            style={{}}
                                            placeholder={RootLang.lang.JeeSocial.nhaptennhom}
                                            onChangeText={(text) => {
                                                this.setState({ msgtext: text });
                                            }}
                                            onContentSizeChange={e =>
                                                this.setState({ numLine: e.nativeEvent.contentSize.height })
                                            }
                                            underlineColorAndroid="transparent"
                                            multiline={true}
                                            underlineColorAndroid="rgba(0,0,0,0)"
                                            value={msgtext}
                                            autoFocus={this.state.autoFocus}
                                        />
                                    </View>
                                </View>

                                <View style={{ justifyContent: 'flex-end', flexDirection: 'row', paddingVertical: 10 }}>
                                    <TouchableOpacity
                                        onPress={() => this._cancel()}
                                        style={{ paddingHorizontal: 15, paddingVertical: 10, borderRadius: 10, backgroundColor: colors.black_20, marginRight: 5 }} >
                                        <Text style={{ fontSize: reText(15), color: colors.white, fontWeight: "bold" }}>{RootLang.lang.scchamcong.huy}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => this._updateName()}
                                        style={{ paddingHorizontal: 15, paddingVertical: 10, borderRadius: 10, backgroundColor: '#2D86FF', justifyContent: 'center', alignItems: 'center', }} >
                                        <Text style={{ fontSize: reText(15), color: colors.white, fontWeight: "bold", textAlign: 'center' }}>{RootLang.lang.JeeSocial.capnhat}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </KeyboardAvoidingView>
                    </View>
                </View>
                <IsLoading />
            </View>
        )
    }
}


const styles = StyleSheet.create({
    textInput: {
        margin: 2,
        paddingHorizontal: 20,
        width: '100%',
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
        paddingVertical: 15, backgroundColor: colors.white,
    }
});


const mapStateToProps = state => ({
    lang: state.changeLanguage.language,
});
export default Utils.connectRedux(Modal_EditTenGroup, mapStateToProps, true)