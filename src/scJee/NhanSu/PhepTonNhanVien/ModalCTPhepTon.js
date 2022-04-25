import moment from 'moment';
import React, { Component } from 'react';
import { Animated, ScrollView, StyleSheet, View } from 'react-native';
import { getChiTietPhepTon } from '../../../apis/apiPhepTon';
import { RootLang } from '../../../app/data/locales';
import Utils from '../../../app/Utils';
import ButtonCom from '../../../components/Button/ButtonCom';
import { colors } from '../../../styles/color';
import { fonts } from '../../../styles/font';
import { sizes } from '../../../styles/size';
import { Height, nstyles } from '../../../styles/styles';
import HeaderModalCom from '../../../Component_old/HeaderModalCom';
import { ItemChiTietCom } from '../../../Component_old/itemcom/itemcom';

class ModalCTDSPhepTon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: Utils.ngetParam(this, 'itemchon', {}),
            dataItem: {},
            opacity: new Animated.Value(0)

        }
    }
    componentDidMount() {
        this._startAnimation(0.8)
        this._getDsHanMuc();
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
    _getDsHanMuc = async () => {
        let value = `${moment(this.state.data.year).format('YYYY')}|${this.state.data.ID_NV}|${this.state.data.ID_HinhThuc}`;
        let res = await getChiTietPhepTon(value, 1, 10);
        if (res.status == 1) {
            this.setState({ dataItem: res.data[0] })
        }
    }
    _goBack = () => {
        this._endAnimation(0)
        Utils.goback(this)
    };

    render() {
        const { opacity } = this.state
        var { dataItem, data } = this.state
        return (
            <View style={[nstyles.ncontainer,
            { backgroundColor: `transparent`, justifyContent: 'flex-end', opacity: 1, }]}>
                <Animated.View onTouchEnd={this._goBack} style={{
                    position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
                    backgroundColor: colors.backgroundModal, alignItems: 'flex-end',
                    opacity
                }} />
                <View style={{
                    flex: 1, backgroundColor: colors.white, marginTop: Height(15),
                    borderTopLeftRadius: 20, borderTopRightRadius: 20,
                    flexDirection: 'column', paddingHorizontal: 15
                }}>
                    <HeaderModalCom onPress={this._goBack} title={`${RootLang.lang.scquanlyphepton.title.toUpperCase()}\n${data.HoTen ? data.HoTen : ''}`} />

                    <View style={{ flex: 1 }}>

                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            style={{ marginLeft: 5, flex: 1 }}>
                            <ItemChiTietCom title={RootLang.lang.scquanlyphepton.loaiphep}
                                value={dataItem.LoaiPhep} />
                            <View style={{ height: 1, backgroundColor: colors.veryLightPink, width: '100%' }}></View>


                            <ItemChiTietCom title={RootLang.lang.scquanlyphepton.pheptonnamtruoc}
                                value={dataItem.PhepTon ? dataItem.PhepTon : '0'} />
                            <View style={{ height: 1, backgroundColor: colors.veryLightPink, width: '100%' }}></View>

                            <ItemChiTietCom title={RootLang.lang.scquanlyphepton.songaynghidatruphepton}
                                value={dataItem.NghiTruPhepTon ? dataItem.NghiTruPhepTon : '0'} />
                            <View style={{ height: 1, backgroundColor: colors.veryLightPink, width: '100%' }}></View>

                            <ItemChiTietCom title={RootLang.lang.scquanlyphepton.ngayhethansudungphepton}
                                value={dataItem.NgayHetHan ? dataItem.NgayHetHan : RootLang.lang.thongbaochung.chuacapnhat} />
                            <View style={{ height: 1, backgroundColor: colors.veryLightPink, width: '100%' }}></View>
                            <ItemChiTietCom title={RootLang.lang.scquanlyphepton.sopheptrongnamdenhientai}
                                value={dataItem.PhepDuocHuong ? dataItem.PhepDuocHuong : '0'} />
                            <View style={{ height: 1, backgroundColor: colors.veryLightPink, width: '100%' }}></View>

                            <ItemChiTietCom title={RootLang.lang.scquanlyphepton.songaydanghitruphepnam}
                                value={dataItem.NghiTruPhepNam ? dataItem.NghiTruPhepNam : '0'} />
                            <View style={{ height: 1, backgroundColor: colors.veryLightPink, width: '100%' }}></View>

                            <ItemChiTietCom title={RootLang.lang.scquanlyphepton.tongsongaynghiconlai}
                                value={dataItem.Tong} />
                            <View style={{ height: 1, backgroundColor: colors.veryLightPink, width: '100%' }}></View>

                            <View style={{ width: '40%', justifyContent: 'center', alignSelf: 'center', paddingVertical: 30 }}>
                                <ButtonCom
                                    text={RootLang.lang.thongbaochung.quaylai}
                                    style={{
                                        backgroundColor: colors.colorButtomleft,
                                        backgroundColor1: colors.colorButtomright,
                                    }}
                                    onPress={this._goBack} />
                            </View>
                        </ScrollView>

                    </View>
                </View>
            </View>
        )
    }
}
var styler = StyleSheet.create({
    row: {
        flex: 4, flexDirection: 'row'
    },
    titleRow: { color: colors.black_20, flex: 2, fontSize: sizes.sText12 }
    ,
    textDot: {
        fontSize: sizes.sText14, lineHeight: 19,
        fontFamily: fonts.Helvetica, color: colors.colorTextBack80
    },
    valueRow: {
        fontSize: sizes.sText16, lineHeight: 19,
        marginLeft: 10,
        fontFamily: fonts.Helvetica, color: colors.colorTextBack80,
    }
})

const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(ModalCTDSPhepTon, mapStateToProps, true)