import moment from 'moment';
import React, { Component } from 'react';
import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native';
import Dash from 'react-native-dash';
import { getDSChamCong } from '../../../apis/apiTimesheets';
import { RootLang } from '../../../app/data/locales';
import { nGlobalKeys } from '../../../app/keys/globalKey';
import Utils from '../../../app/Utils';
import { colors, nstyles } from '../../../styles';
import { fonts } from '../../../styles/font';
import { reText, sizes } from '../../../styles/size';
import HeaderModalCom from '../../../Component_old/HeaderModalCom';
import { ButtomCustom } from '../../../Component_old/itemcom/itemcom';
import { Get_DSChiTietGiaiTrinh } from '../../../apis/apiGiaiTrinh';

const ItemLineText = (props) => {
    const { title = '', value = '', stTextRight = {} } = props
    return (
        <View style={{ flexDirection: 'row', marginBottom: 15 }}>
            <Text style={{ fontSize: reText(14), color: colors.colorTextBTGray }}>{title}</Text>
            <Text style={[{ fontSize: reText(14), textAlign: 'right', paddingLeft: 20 }, stTextRight]}>{value}</Text>
        </View>
    )
}
const stNgayCong = StyleSheet.create({
    title: {
        flex: 1, textAlign: 'center', fontWeight: 'bold',
        fontSize: sizes.sText10, color: colors.black,
        paddingVertical: 15
    },
    contentNgayThuong: {
        flex: 1, textAlign: 'center', fontWeight: '500',
        fontSize: sizes.sText12, color: colors.black,
        paddingVertical: 15
    },
    contentThuBay: {
        color: colors.emerald,
        backgroundColor: colors.buff
    },
    contentChuNhat: {
        color: colors.coral,
        backgroundColor: colors.black_5
    },
    contentNgayLe: {
        color: colors.white,
        backgroundColor: colors.coral
    },
    contentDacBiet: {
        color: colors.emerald,
        backgroundColor: colors.brightCyan
    }
})
class ModalCongNgay extends Component {
    constructor(props) {
        super(props)
        this.pageAll = 0;
        this.state = {
            isVisible: true,
            data: Utils.ngetParam(this, 'data', {}),
            ngay: Utils.ngetParam(this, 'index', ''),
            refreshing: true,
            dataCong: [],
            isColum: 0,
            date: '',
            opacity: new Animated.Value(0),
            RowID: 0

        }

    }
    renderStyle = (idStyle) => {
        var style = {};
        switch (idStyle) {
            case '1':
                style = stNgayCong.contentNgayThuong;
                break;
            case '2':
                style = stNgayCong.contentThuBay;
                break;
            case '3':
                style = stNgayCong.contentChuNhat;
                break;
            case '4':
                style = stNgayCong.contentNgayLe
                break;
            case '5':
                style = stNgayCong.contentDacBiet;
                break;
            default:
                style = stNgayCong.contentNgayThuong;
                break;
        }
        return style;
    }
    async componentDidMount() {
        this._GetchamCong();
        this._startAnimation(0.8)

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
    _GetchamCong = async (page = 1) => {
        const { reducerBangCong } = this.props;
        const { ngay } = this.state
        let strngay = `${reducerBangCong.dateBangCong}-${ngay >= 10 ? ngay : '0' + ngay}`

        // const res = await getDSChamCongNgay(, 1, 10);
        let date = moment(strngay, "YYYY-MM-DD").format('DD/MM/YYYY');

        var val = `${date}|${date}`;
        this.setState({ date: date })
        let res = await getDSChamCong(val)
        Utils.nlog("gia tri ress congo ngay--------------------", res)
        // Utils.nlog("gia tri ress congo ngay--------------------", res.data[0])
        if (res.status == 1) {
            this.setState({ dataCong: res.data[0] })
            let resIDRow = await Get_DSChiTietGiaiTrinh(moment(res.data[0].ngaychuan).format("MM"), moment(res.data[0].ngaychuan).format("YYYY"));
            if (resIDRow.status == 1) {
                this.setState({ RowID: resIDRow.RowID })
            }
        } else {
            this.setState({ dataCong: [] })
        }
    }
    render() {
        const { dataCong, data, opacity } = this.state;
        let item = data;
        return (
            <View style={[nstyles.ncontainer,
            {
                flexGrow: 1,
                backgroundColor: `transparent`,
                opacity: 1,
            }]}>
                <Animated.View onTouchEnd={this._goback}
                    style={{
                        backgroundColor: colors.backgroundModal,
                        flex: 1, opacity
                    }} />
                <View style={{
                    height: '90%',
                    backgroundColor: colors.white,
                    borderTopLeftRadius: 20, borderTopRightRadius: 20,
                    flexDirection: 'column',
                    paddingHorizontal: 15,
                    paddingVertical: 13,
                    justifyContent: 'flex-end'
                }}>
                    <HeaderModalCom onPress={this._goback} title={(RootLang.lang.scbangcong.chitietngay.toUpperCase())} />
                    <ScrollView>
                        <View>
                            <ItemLineText title={RootLang.lang.scbangcong.ngay} value={dataCong && dataCong.ngay ? dataCong.ngay : '---'} />
                            <ItemLineText title={RootLang.lang.scbangcong.chamcongvao + " - " + RootLang.lang.scbangcong.chamcongra} value={`${dataCong && dataCong.vao ? dataCong.vao : '...'} - ${dataCong && dataCong.ra ? dataCong.ra : '...'}`} />
                            {/* <ItemLineText title={RootLang.lang.scbangcong.ghichu} value={dataCong && dataCong.ghichu != '' ? dataCong.ghichu : '---'} /> */}
                            <View style={{ flexDirection: 'row' }}>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={stNgayCong.title}>
                                    {RootLang.lang.scbangcong.cong}
                                </Text>
                                <Text style={stNgayCong.title}>
                                    {RootLang.lang.scbangcong.ot}
                                </Text>
                                <Text style={stNgayCong.title}>
                                    {RootLang.lang.scbangcong.otbn}
                                </Text>
                                <Text style={stNgayCong.title}>
                                    {RootLang.lang.scbangcong.cdem}
                                </Text>
                                <Text style={stNgayCong.title}>
                                    {RootLang.lang.scbangcong.phep}
                                </Text>
                                <Text style={stNgayCong.title}>
                                    {RootLang.lang.scbangcong.ca}
                                </Text>
                            </View>
                            <Dash
                                dashColor={colors.black_70}
                                style={{ width: '100%', height: 1, }}
                                dashGap={0}
                                dashThickness={1} />
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={[stNgayCong.contentNgayThuong, this.renderStyle(item.LoaiNgay_CongNgayThuong)]}>
                                    {item.CongNgayThuong}
                                </Text>
                                <Text style={[stNgayCong.contentNgayThuong, this.renderStyle(item.LoaiNgay_TangCa)]}>
                                    {item.TangCa}
                                </Text>
                                <Text style={[stNgayCong.contentNgayThuong, this.renderStyle(item.LoaiNgay_TangCaNB)]}>
                                    {item.TangCaNB}
                                </Text>
                                <Text style={[stNgayCong.contentNgayThuong, this.renderStyle(item.LoaiNgay_TangCaDem)]}>
                                    {item.TangCaDem}
                                </Text>
                                <Text style={[stNgayCong.contentNgayThuong, this.renderStyle(item.LoaiNgay_Phep)]}>
                                    {item.Phep}
                                </Text>
                                <Text style={[stNgayCong.contentNgayThuong, this.renderStyle(item.LoaiNgay_CaLamViec)]}>
                                    {item.CaLamViec}
                                </Text>
                            </View>
                            <Dash
                                dashColor={colors.black_70}
                                style={{ width: '100%', height: 1, }}
                                dashGap={0}
                                dashThickness={1} />


                        </View>
                        <View style={{ paddingVertical: 10, flexDirection: 'row' }}>
                            <ButtomCustom
                                onpress={() => {
                                    this.props.SetDateDKPhep(this.state.date)
                                    this._endAnimation(0)
                                    Utils.goscreen(this, "ModalTangCa", { "date": this.state.date })
                                }}
                                stColor={{ borderRadius: 10 }}
                                title={RootLang.lang.scbangcong.guitangca}
                            />
                            <View style={{ marginHorizontal: 2, }}></View>
                            <ButtomCustom
                                onpress={() => {
                                    this.props.SetDateDKPhep(this.state.date)
                                    this._endAnimation(0)
                                    Utils.goscreen(this, "ModalNghiPhep", { "date": this.state.date })
                                }}
                                title={RootLang.lang.scbangcong.guiphep}
                                stColor={{ backgroundColor: colors.colorTabActive, borderRadius: 10 }}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', marginBottom: 15 }}>
                            <ButtomCustom
                                title={RootLang.lang.scbangcong.guigiaitrinh}
                                onpress={() => {
                                    this.props.SetDateDKPhep(this.state.date)
                                    this._endAnimation(0)
                                    // Utils.goscreen(this, "Modal_GiaiTrinhChamCong", { "date": this.state.date, isScreen: 1 })
                                    Utils.goscreen(this, 'Modal_GiaiTrinh', {
                                        isAdd: true,
                                        RowID: this.state.RowID,
                                        date: moment(dataCong.ngaychuan).format("YYYY-MM-DD" + 'T00:00:00'),
                                        Hide: true
                                    })
                                }}
                                stColor={{ backgroundColor: colors.colorTabActive, borderRadius: 10 }}
                            />
                            <View style={{ marginHorizontal: 2 }}></View>
                            <ButtomCustom
                                title={RootLang.lang.scbangcong.guidoica}
                                stColor={{ borderRadius: 10 }}
                                onpress={() => {
                                    this.props.SetDateDKPhep(this.state.date)
                                    this._endAnimation(0)
                                    Utils.goscreen(this, "ModalDoiCaLamViec", { "date": this.state.date })
                                }}
                            />
                        </View>
                        {/* <View style={{ flexDirection: 'row', marginBottom: 50 }}>
                            <ButtomCustom
                                onpress={() => {
                                    Utils.goscreen(this, "Modal_TaoGhiChu", {})
                                }}
                                title={RootLang.lang.scbangcong.taoghichu}
                            />
                            <View style={{ marginHorizontal: 2 }}></View>
                            <ButtomCustom
                                onpress={() => {

                                }}
                                title={'Quay lại'}
                                stColor={{ backgroundColor: colors.black_20 }}
                            />
                        </View> */}
                        <ButtomCustom
                            title={RootLang.lang.scbangcong.quaylai}
                            stColor={{ backgroundColor: colors.black_20, marginBottom: 50, borderRadius: 10 }}
                            onpress={this._goback}
                        />
                    </ScrollView>

                </View>
            </View>
        )
    }
}

// export default ModalChamCong

const mapStateToProps = state => ({
    lang: state.changeLanguage.language,
    reducerBangCong: state.reducerBangCong
});
export default Utils.connectRedux(ModalCongNgay, mapStateToProps, true)
var styler = StyleSheet.create({
    row: {
        flex: 4, flexDirection: 'row'
    },
    titleRow: { color: colors.colorTextBack80, }
    ,
    textDot: {
        fontSize: sizes.sText14, lineHeight: sizes.sText19,
        fontFamily: fonts.Helvetica, color: colors.colorTextBack80
    },
    valueRow: {
        fontSize: sizes.sText14, lineHeight: sizes.sText19, paddingRight: 30,
        marginLeft: 10,
        fontFamily: fonts.Helvetica, color: colors.colorTextBack80
    }
})
