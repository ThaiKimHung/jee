import moment from 'moment';
import React, { Component } from 'react';
import { Animated, BackHandler, Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Get_ChiTietDuyetTangCa } from '../../../apis/apiDuyetTangca';
import { getDSNghiPhep, getHuyDonPhep } from '../../../apis/apiPhep';
import { getHuyTangCa } from '../../../apis/apiTangca';
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import { RootLang } from '../../../app/data/locales';
import Utils from '../../../app/Utils';
import UtilsApp from '../../../app/UtilsApp';
import { Images } from '../../../images';
import { colors, nstyles } from '../../../styles';
import { reText } from '../../../styles/size';
import { nHeight, paddingBotX, Width } from '../../../styles/styles';

const RenderInfo = (props) => {
    let { title, value, icon, line = true, especially = false, color = null, ghichi = false, OverTime = false, IsFixHours = false } = props;
    return (
        <View style={{ flexDirection: 'row', marginTop: 15 }}>
            <View style={{ width: Width(6) }}>
                <Image source={icon} style={{ width: 18, height: 18 }} />
            </View>
            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                    <Text style={{ fontSize: reText(14), color: colors.colorNoteJee }}>{title}</Text>
                    {ghichi ?
                        <View>
                            {OverTime ? <Text numberOfLines={1} style={{ fontSize: reText(14), maxWidth: Width(70) }}>{RootLang.lang.sctangca.lamthemtronggiogiailao}</Text> : null}
                            {IsFixHours ? <Text numberOfLines={1} style={{ fontSize: reText(14), maxWidth: Width(70) }}>{RootLang.lang.sctangca.lamviecbenngoai}</Text> : null}
                            {!OverTime && !IsFixHours ? <Text numberOfLines={1} style={{ fontSize: reText(14), maxWidth: Width(70) }}>{'--'}</Text> : null}


                        </View> :
                        <Text numberOfLines={1} style={{ fontSize: reText(14), maxWidth: Width(60), fontWeight: especially ? 'bold' : null, color: especially ? color : null }}>{value}</Text>
                    }
                </View>
                {line ? <View style={{ height: 0.5, backgroundColor: colors.colorLineJee }} /> : null}
            </View>
        </View>
    )
}
class DetailsDoiCa extends Component {
    constructor(props) {
        super(props);
        this.deeplink = Utils.ngetParam(this, "deeplink")
        this.state = {
            isVisible: true,
            item: {},
            itemId: Utils.ngetParam(this, "itemId", ''),
            opacity: new Animated.Value(0),
            checkDay: false
        }
    }
    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this._backHandlerButton)
        this._startAnimation(0.8)
        this._GetChiTietPhep();
    }
    _goback = () => {
        this._endAnimation(0)
        if (this.props.navigation.canGoBack())
            Utils.goback(this);
        else
            Utils.replace(this, 'sw_HomePage')
    }
    _backHandlerButton = () => {
        this._goback()
        return true
    }

    _DeteleDonTangCa = async (ID_Row) => {
        Utils.showMsgBoxYesNo(this, RootLang.lang.thongbaochung.thongbao, RootLang.lang.thongbaochung.banmuonxoadonnay,
            RootLang.lang.thongbaochung.xoa, RootLang.lang.thongbaochung.thoat, async () => {
                const res = await getHuyTangCa(ID_Row)
                if (res.status == 1) {
                    UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.thongbaochung.thuchienthanhcong, 1)
                    this._goback()
                    ROOTGlobal.dataAppGlobal.reloadDSTangCa()
                } else
                    UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.thuchienthatbai, 2)

            }, () => { }, true)
    }


    _GetChiTietPhep = async () => {

        if (this.state.itemId) {
            const res = await Get_ChiTietDuyetTangCa(this.state.itemId)
            // console.log("RES:", res)
            if (res.status == 1) {
                this.setState({ item: res })
            } else {
                UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.thongbaochung.loilaydulieu, 2)
            }
        }
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

    // _checkDay = (batdau, ketthuc) => {
    //     let ngayBD = moment(batdau).format('YYYY/MM/DD HH:mm:ss')
    //     let ngayKT = moment(ketthuc).format('YYYY/MM/DD HH:mm:ss')
    //     let kq = false
    //     if ((ngayBD === ngayKT) == true) {
    //         kq = true
    //     }
    //     this.setState({
    //         checkDay: kq
    //     })
    //     return kq
    // }

    renderInfo = (item) => {
        let colorBg = item.Data_CapDuyet ? (item.Data_CapDuyet[0].Valid ? colors.bgGreen : item.Data_CapDuyet[0].Valid == false ? colors.bgRed : colors.bgYellow) : null
        let colorText = item.Data_CapDuyet ? (item.Data_CapDuyet[0].Valid ? colors.checkGreen : item.Data_CapDuyet[0].Valid == false ? colors.checkCancle : colors.checkAwait) : null
        let Icon = item.Data_CapDuyet ? (item.Data_CapDuyet[0].Valid ? Images.ImageJee.icBrowser : item.Data_CapDuyet[0].Valid == false ? Images.ImageJee.icUnBrowser : Images.ImageJee.ic_ChoDuyet) : null
        let ngDuyet = item.Data_CapDuyet ? (item.Data_CapDuyet[0].hoten ? item.Data_CapDuyet[0].hoten : '') : null
        return (
            item.Data_CapDuyet ?
                <View style={{ flexDirection: 'row', backgroundColor: colorBg, marginHorizontal: 10, paddingHorizontal: 10, paddingVertical: 15, borderRadius: 10, marginTop: 20 }}>
                    <Image source={Icon} style={{ tintColor: item.Data_CapDuyet[0].Valid == null ? colorText : null }} />
                    {item.Data_CapDuyet[0].Valid ?
                        <Text style={{ fontSize: reText(13), color: colorText, marginLeft: 10, alignSelf: 'center', flex: 1 }}>
                            {RootLang.lang.thongbaochung.yeucauduocduyetvao} {item.Data_CapDuyet[0].CheckedDate ? Utils.formatTimeAgo(moment(item.Data_CapDuyet[0].CheckedDate, 'YYYY-MM-DD HH:mm:ssZ'), 1, true) : ''} {RootLang.lang.thongbaochung.boi} <Text style={{ fontWeight: 'bold' }}>{ngDuyet}</Text>
                        </Text> :
                        item.Data_CapDuyet[0].Valid == false ?
                            <Text style={{ fontSize: reText(13), color: colorText, marginLeft: 10, alignSelf: 'center', flex: 1 }}>
                                <Text style={{ fontWeight: 'bold' }}>{ngDuyet}</Text> {RootLang.lang.thongbaochung.datuchoiyeucauvao} {item.Data_CapDuyet[0].CheckedDate ? Utils.formatTimeAgo(moment(item.Data_CapDuyet[0].CheckedDate, 'YYYY-MM-DD HH:mm:ssZ'), 1, true) + '.' : ''} {item.Data_CapDuyet[0].CheckNote ? RootLang.lang.thongbaochung.lydo + ' ' + item.Data_CapDuyet[0].CheckNote : ''}
                            </Text> :
                            <Text style={{ fontSize: reText(13), color: colorText, marginLeft: 10, alignSelf: 'center', flex: 1 }}>
                                {RootLang.lang.thongbaochung.yeucaudangduocchopheduyet}
                            </Text>}
                </View> : null
        )
    }

    render() {
        const { opacity, item } = this.state
        let thoigian = item.ThoiGian ? item.ThoiGian : '--'
        let colorText = item.Data_CapDuyet ? (item.Data_CapDuyet[0].Valid ? colors.checkGreen : item.Data_CapDuyet[0].Valid == false ? colors.checkCancle : colors.checkAwait) : null
        let checkBtn = item.Data_CapDuyet ? (item.Data_CapDuyet[0].Valid == null ? true : false) : false
        return (
            <View style={{ flex: 1, backgroundColor: `transparent`, height: nHeight(100) }}>
                <View style={[nstyles.ncontainer, { backgroundColor: `transparent`, justifyContent: 'flex-end', height: nHeight(100) }]}>
                    <Animated.View onTouchEnd={this._goback} style={{
                        position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
                        alignItems: 'flex-end', backgroundColor: colors.backgroundModal,
                        opacity
                    }} />
                    <Animated.View style={{ backgroundColor: colors.backgroudJeeHR, width: '100%', borderTopLeftRadius: 15, borderTopRightRadius: 15, paddingBottom: 20 + paddingBotX }}>
                        <View style={{ alignSelf: 'center', width: 300, height: 25, justifyContent: 'center' }}>
                            <Image source={Images.icTopModal} style={{ alignSelf: 'center' }} />
                        </View>
                        <View style={{ paddingHorizontal: 15, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: reText(18), fontWeight: 'bold', color: colors.titleJeeHR, textAlign: 'center' }}>
                                {RootLang.lang.sctangca.dangkylam}
                            </Text>
                            <Text style={{ fontSize: reText(11), color: colors.colorNoteJee, marginTop: 5 }}>
                                {item.NgayGui ? Utils.formatTimeAgo(moment(item.NgayGui, 'YYYY-MM-DD HH:mm:ssZ'), 1, true) : RootLang.lang.thongbaochung.chuacapnhat}
                            </Text>

                        </View>

                        {this.renderInfo(item)}
                        <Text style={{ color: colors.colorTitleJee, fontSize: reText(14), paddingHorizontal: 20, marginTop: 25 }}>{RootLang.lang.thongbaochung.thongtindangky.toUpperCase()}</Text>
                        <View style={{ backgroundColor: colors.white, paddingHorizontal: 10, marginHorizontal: 10, borderRadius: 10, marginTop: 5 }}>
                            <RenderInfo icon={Images.ImageJee.icDateTime} title={RootLang.lang.sctangca.ngay} value={item.NgayTangCa ? item.NgayTangCa : '--'} especially={true} color={colorText} />
                            <RenderInfo icon={Images.ImageJee.icClockJee} title={RootLang.lang.sctangca.giolamthem} value={thoigian} />
                            <RenderInfo icon={Images.ImageJee.icClock} title={RootLang.lang.sctangca.sogio} value={item.SoGio ? item.SoGio + ' ' + RootLang.lang.thongbaochung.gio : '--'} />
                            <RenderInfo icon={Images.ImageJee.icAttachJee} title={RootLang.lang.sctangca.ghichu} line={false} ghichi={true} OverTime={item.OverTime} IsFixHours={item.IsFixHours} />
                        </View>

                        <Text style={{ color: colors.colorTitleJee, fontSize: reText(14), paddingHorizontal: 20, marginTop: 25 }}>{RootLang.lang.thongbaochung.lydo.toUpperCase()}</Text>
                        <View style={{ backgroundColor: colors.white, paddingHorizontal: 10, paddingTop: 15, paddingBottom: 20, marginHorizontal: 10, borderRadius: 10, marginTop: 5 }}>
                            <Text style={{ fontSize: reText(14), color: colors.black }}>{item.Lydo ? item.Lydo : '---'}</Text>
                        </View>

                        <View style={{
                            width: '100%',
                            justifyContent: 'flex-end', alignItems: 'center', marginTop: 36, marginBottom: 0 + paddingBotX,
                            flexDirection: 'row', justifyContent: 'space-evenly', paddingHorizontal: 10
                        }}>
                            <TouchableOpacity onPress={() => this._goback()} style={{ width: checkBtn ? '49%' : '100%', backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center', paddingVertical: 15, borderRadius: 10 }}>
                                <Text style={{ fontSize: reText(14), color: colors.checkAwait }}>{RootLang.lang.thongbaochung.dong}</Text>
                            </TouchableOpacity>
                            {
                                checkBtn ? <TouchableOpacity onPress={() => this._DeteleDonTangCa(item.ID_Row)} style={{ width: '49%', backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center', paddingVertical: 15, borderRadius: 10 }}>
                                    <Text style={{ fontSize: reText(14), color: colors.checkCancle, fontWeight: 'bold' }}>{RootLang.lang.thongbaochung.xoa}</Text>
                                </TouchableOpacity>
                                    : null
                            }
                        </View>

                    </Animated.View>
                </View>
            </View >
        );
    }
}

const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
const styles = StyleSheet.create({
    khungBorder: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', paddingVertical: 18, width: '100%',
        borderBottomWidth: 0.3, borderColor: colors.colorBrownGrey
    },
    khungLydo: {
        paddingVertical: 15, width: '100%'
    },
    row: {
        flexDirection: 'row'
    },
    icon18: {
        width: 18, height: 18, marginRight: 5
    },
    icon20: {
        width: 20, height: 20, marginRight: 5
    },
    title: {
        color: colors.grey,
        fontSize: reText(15),
    },
    data: {
        fontSize: reText(16),
        color: '#404040'
    }
})
export default Utils.connectRedux(DetailsDoiCa, mapStateToProps, true)
