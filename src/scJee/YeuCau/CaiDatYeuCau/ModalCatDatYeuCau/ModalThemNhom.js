import React, { Component } from 'react';
import {
    Animated, BackHandler, StyleSheet, Text,
    TextInput,
    TouchableOpacity, View
} from 'react-native';
import { postThemNhomYC } from '../../../../apis/JeePlatform/API_JeeRequest/apiCaiDatYeuCau';
import { RootLang } from '../../../../app/data/locales';
import Utils from '../../../../app/Utils';
import UtilsApp from '../../../../app/UtilsApp';
import HeaderModalCom from '../../../../Component_old/HeaderModalCom';
import { colors } from '../../../../styles/color';
import { Height, nstyles, Width } from '../../../../styles/styles';


class ModalThemNhom extends Component {
    constructor(props) {
        super(props);
        this._load = Utils.ngetParam(this, '_load')
        this.state = ({
            tennhom: '',
            tenNhomRong: RootLang.lang.JeeRequest.Modal_ThemNhomYeuCau.tennhom + '*',
            opacity: new Animated.Value(0)

        })
    }
    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        this._startAnimation(0.8)
    }
    componentWillUnmount() {
        this.backHandler.remove()
    }

    handleBackButton = () => {
        this._goBack()
        return true
    };
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

    _goBack = () => {
        this._endAnimation(0)
        this._load()
        Utils.goback(this, null)
    };
    _saveButton = async () => {
        let strBody = {
            "tenNhom": this.state.tennhom
        }
        if (this.state.tennhom.length == 0) {
            this.refs.refTenNhom.focus()
            this.setState({ tenNhomRong: RootLang.lang.JeeRequest.Modal_ThemNhomYeuCau.tennhomkhongduocdetrong })
            return
        }
        let res = await postThemNhomYC(strBody)
        if (res.status == 1) {
            UtilsApp.MessageShow(RootLang.lang.JeeRequest.thongbao.thongbao, RootLang.lang.JeeRequest.thongbao.themmoinhomyeucauthanhcong, 1)
            this._goBack()
        }
        else {
            UtilsApp.MessageShow(RootLang.lang.JeeRequest.thongbao.thongbao, res.error ? res.error.message : RootLang.lang.JeeRequest.thongbao.themmoinhomyeucauthatbai, 2)
        }
    }

    render() {
        const { opacity, tenNhomRong, tennhom } = this.state

        return (
            <View style={[nstyles.ncontainer,
            { backgroundColor: `transparent`, justifyContent: 'flex-end', opacity: 1, }]}>
                <Animated.View onTouchEnd={this._goBack} style={{
                    position: 'absolute', top: 0,
                    bottom: 0, left: 0, right: 0,
                    backgroundColor: colors.backgroundModal, opacity

                }} />
                <View style={{
                    backgroundColor: colors.white, flex: 1, marginTop: Height(20),
                    borderTopLeftRadius: 20, borderTopRightRadius: 20,
                    flexDirection: 'column', paddingHorizontal: 15, paddingBottom: 13
                }}>
                    <HeaderModalCom onPress={this._goBack} title={RootLang.lang.JeeRequest.Modal_ThemNhomYeuCau.themmoinhomyeucau} />
                    <View style={{ flex: 1 }}>
                        <View style={styles.viewgroup}>
                            <TextInput
                                style={{ padding: 0 }}
                                placeholder={tenNhomRong}
                                placeholderTextColor={tenNhomRong == RootLang.lang.JeeRequest.Modal_ThemNhomYeuCau.tennhomkhongduocdetrong ? colors.colorPink3 : null}
                                fontStyle={tennhom.length == 0 && tenNhomRong == RootLang.lang.JeeRequest.Modal_ThemNhomYeuCau.tennhomkhongduocdetrong ? 'italic' : 'normal'}
                                ref={'refTenNhom'}
                                onChangeText={(value) => { this.setState({ tennhom: value }), value.length == 0 ? this.setState({ tenNhomRong: RootLang.lang.JeeRequest.Modal_ThemNhomYeuCau.tennhomkhongduocdetrong }) : null }}>
                            </TextInput>
                        </View>
                        <View style={{ marginVertical: 30, flexDirection: 'row', justifyContent: 'space-around' }}>
                            <TouchableOpacity style={[{ backgroundColor: colors.colorInput }, styles.button]}
                                onPress={this._goBack}>
                                <Text style={{ color: colors.colorPlayhoder, fontWeight: 'bold' }}>{RootLang.lang.JeeRequest.dungchung.dong}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[{ backgroundColor: colors.colorTabActive }, styles.button]}
                                onPress={this._saveButton}>
                                <Text style={{ color: 'white', fontWeight: 'bold' }}>{RootLang.lang.JeeRequest.dungchung.luu}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    viewgroup: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: colors.colorButtonGray,
    },
    tieude: {
        flex: 1,
        color: colors.textGray
    },
    button: {
        width: Width(40),
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5
    }
})
const mapStateToProps = state => ({
    lang: state.changeLanguage.language,
    reducerBangCong: state.reducerBangCong
});
export default Utils.connectRedux(ModalThemNhom, mapStateToProps, true)
