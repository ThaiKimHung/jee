import React, { Component } from 'react';
import {
    Animated,
    Image,
    StyleSheet, Text,
    TouchableOpacity, View
} from 'react-native';
import { getChiTietPhepTon } from '../../../../apis/apiPhepTon';
import { appConfig } from '../../../../app/Config';
import { RootLang } from '../../../../app/data/locales';
import { nkey } from '../../../../app/keys/keyStore';
import Utils from '../../../../app/Utils';
import ButtonCom from '../../../../components/Button/ButtonCom';
import { Images } from '../../../../images/index';
import { colors } from '../../../../styles/color';
import { fonts } from '../../../../styles/font';
import { sizes } from '../../../../styles/size';
import { Height, nHeight, nstyles, paddingBotX } from '../../../../styles/styles';
// import HeaderModal from '../../Component/HeaderModal';
// import { RootLang } from '../../app/data/locales';
// import { appConfig } from '../../app/Config';
import { ModalTop } from '../../../Modal/NhanSu/ModalTop';
import { ModalButtonBottom } from '../../../Modal/NhanSu/ModalButtonBottom';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
class ModalThongTinUngDung extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: Utils.ngetParam(this, 'itemchon', {}),
            DsHanMuc: [],
            SoNgayPhepThamNien: '',
            TongNgayPhepNam: '',
            listNam: [],
            Selectnam: null,
            _page: 1,
            _allPage: 1,
            record: 10,
            refreshing: true,
            isVisible: true,
            opacity: new Animated.Value(0),
            showDevice: false,
            deviceID: ''
        }
    }
    async componentDidMount() {

        this._startAnimation(0.8)
        Utils.nlog("param", Utils.ngetParam(this, 'itemchon', null));
        this.setState({ deviceID: await Utils.ngetStorage(nkey.userId_OneSignal, '') })
    }
    _getDsHanMuc = async (nextPage = 1) => {
        var { DsHanMuc, TongNgayPhepNam,
            SoNgayPhepThamNien, Selectnam,
            _page, _allPage, record } = this.state
        if (nextPage == 1) {
            DsHanMuc = [];
        }
        let value = `${this.state.data.year.name}|${this.state.data.ID_NV}`
        let res = await getChiTietPhepTon(value, nextPage, record);
        Utils.nlog('get Chi tiết phép tồn ', res)
        if (res.status == 1) {
            var { data = [], SoNgayPhepThamNien = '', TongNgayPhepNam = '', page = {} } = res;
            if (Array.isArray(data) && data.length > 0) {
                DsHanMuc = DsHanMuc.concat(data);
                TongNgayPhepNam = res.TongNgayPhepNam;
                SoNgayPhepThamNien = res.SoNgayPhepThamNien;
            } else {
                DsHanMuc = []
            }
            var { Page = 1, AllPage = 1 } = page;
            _page = Page;
            _allPage = AllPage;
        }
        this.setState({ DsHanMuc, _page, _allPage, SoNgayPhepThamNien, refreshing: false, TongNgayPhepNam })
    }
    _onRefresh = () => {
        this.setState({ refreshing: true }, () => this._getDsHanMuc());

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
        const { opacity, deviceID } = this.state

        var item = this.state.data
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
                                title={RootLang.lang.sccaidat.thongtinungdung}
                            />
                            <View style={{ backgroundColor: 'white', borderRadius: 10, paddingVertical: 15, marginTop: 20 }}>
                                <View style={{ alignItems: 'center' }}>
                                    <Text style={{
                                        fontSize: sizes.sText14,
                                        marginBottom: 10
                                    }}>
                                        {`${RootLang.lang.sccaidat.phienban} ${appConfig.version}`}
                                    </Text>
                                    {/* <Text style={{
                                color: colors.colorPlayhoder, fontSize: sizes.sText14, paddingHorizontal: 20, lineHeight: 22
                            }}>
                                Website: <Text style={{ color: colors.softBlue }}
                                    onPress={() => Utils.openWebInApp(this, 'https://jeehr.com')}>
                                    https://jeehr.com</Text>
                            </Text>
                            <Text style={{
                                color: colors.colorPlayhoder, fontSize: sizes.sText14, paddingHorizontal: 20, lineHeight: 22
                            }}>
                                Email: <Text style={{ color: colors.softBlue }}
                                    onPress={() => Utils.openUrl('mailto:info@jeehr.com')}>
                                    info@jeehr.com</Text>
                            </Text> */}
                                    <Text
                                        style={{
                                            color: colors.colorPlayhoder, fontSize: sizes.sText14,
                                            paddingHorizontal: 20
                                        }}>
                                        {`©2022 DPS CO., LTD. All rights reserved.`}
                                    </Text>
                                    {this.state.showDevice ?
                                        <Text style={{
                                            color: colors.colorPlayhoder, fontSize: sizes.sText14,
                                            paddingHorizontal: 20, paddingTop: 10
                                        }}>
                                            {"Device ID thiết bị " + deviceID}
                                        </Text>
                                        : null}

                                </View>
                            </View>
                            <View style={{
                                marginTop: 30, marginBottom: 10 + paddingBotX,
                            }}>
                                <ModalButtonBottom
                                    textButton={RootLang.lang.thongbaochung.dong}
                                    colorTextButton={colors.orangeText}
                                    _onPress={this._goback}
                                    _onLongPress={() => { this.setState({ showDevice: true }) }}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        )
    }
}
var styler = StyleSheet.create({
    row: {
        flex: 4, flexDirection: 'row'
    },
    titleRow: { color: colors.colorTextBack80, flex: 6 }
    ,
    textDot: {
        fontSize: sizes.sText14, lineHeight: 19,
        fontFamily: fonts.Helvetica, color: colors.colorTextBack80
    },
    valueRow: {
        fontSize: sizes.sText14, lineHeight: 19, paddingRight: 30,
        marginLeft: 10,
        fontFamily: fonts.Helvetica, color: colors.colorTextBack80
    }
})

const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(ModalThongTinUngDung, mapStateToProps, true)