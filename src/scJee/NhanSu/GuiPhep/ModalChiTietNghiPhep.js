import moment from 'moment';
import React, { Component } from 'react';
import { Animated, BackHandler, Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { getDSNghiPhep, getHuyDonPhep } from '../../../apis/apiPhep';
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import { RootLang } from '../../../app/data/locales';
import Utils from '../../../app/Utils';
import UtilsApp from '../../../app/UtilsApp';
import { Images } from '../../../images';
import { colors, nstyles } from '../../../styles';
import { reText } from '../../../styles/size';
import { nHeight, paddingBotX, Width } from '../../../styles/styles';

const RenderInfo = (props) => {
    let { title, value, icon, line = true, especially = false, color = null } = props;
    return (
        <View style={{ flexDirection: 'row', marginTop: 15 }}>
            <View style={{ width: Width(6) }}>
                <Image source={icon} style={{ width: 18, height: 18 }} />
            </View>
            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                    <Text style={{ fontSize: reText(14), color: colors.colorNoteJee }}>{title}</Text>
                    <Text numberOfLines={1} style={{ fontSize: reText(14), maxWidth: Width(60), fontWeight: especially ? 'bold' : null, color: especially ? color : null }}>{value}</Text>
                </View>
                {line ? <View style={{ height: 0.5, backgroundColor: colors.colorLineJee }} /> : null}
            </View>
        </View>
    )
}
class ModalChiTietNghiPhep extends Component {
    constructor(props) {
        super(props);
        this.deeplink = Utils.ngetParam(this, "deeplink")
        this.state = {
            isVisible: true,
            item: {},
            itemId: Utils.ngetParam(this, "itemId", ''),
            opacity: new Animated.Value(0),
            checkDay: false,
            checkAPI: false
        }
    }
    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this._backHandlerButton)
        this._startAnimation(0.8)
        this._GetChiTietPhep();
    }
    _goback = () => {
        this._endAnimation(0)
        if (this.deeplink)
            Utils.goback(this);
        else
            Utils.goscreen(this, 'sw_HomePage')
    }
    _backHandlerButton = () => {
        this._goback()
        return true
    }
    _DeteleDonPhep = async () => {
        var { itemId } = this.state
        Utils.showMsgBoxYesNo(this, RootLang.lang.thongbaochung.thongbao, RootLang.lang.thongbaochung.banmuonxoadonnay,
            RootLang.lang.scphepthemdon.xoadon, RootLang.lang.thongbaochung.thoat, async () => {
                const res = await getHuyDonPhep(itemId)
                if (res.status == 1) {
                    UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.scdanhsachnghiphep.xoadonthanhcong, 1)
                    if (ROOTGlobal.QLCNPhep.refreshphep) {
                        ROOTGlobal.QLCNPhep.refreshphep();
                    }
                    this._goback();
                    return
                } else {
                    UtilsApp.MessageShow(RootLang.lang.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.thuchienthatbai, 2)
                }

            }, () => { }, true)
    }

    _GetChiTietPhep = async () => {
        if (this.state.itemId) {
            const res = await getDSNghiPhep(`|${this.state.itemId}`, 1, 10);
            if (res.status == 1 && res.data) {
                this.setState({ item: res.data[0], checkAPI: true }, () => {
                    this._checkDay(res.data[0].GioBatDau, res.data[0].GioKetThuc)
                })
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

    Capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    _checkDay = (batdau, ketthuc) => {
        let ngayBD = moment(batdau).format('YYYY/MM/DD HH:mm:ss')
        let ngayKT = moment(ketthuc).format('YYYY/MM/DD HH:mm:ss')
        let kq = false
        if ((ngayBD === ngayKT) == true) {
            kq = true
        }
        this.setState({
            checkDay: kq
        })
        return kq
    }

    Title(date, loaiphep) {
        let data = String(date)
        var datathu = data.split(' ')
        var thu1 = data.split('(')
        var thu2 = thu1[thu1.length - 1].split(')')
        let ketqua = thu2
        return ketqua
    }

    _renderNgay = (thu, giobd, giokt, check) => {
        let data = String(thu)
        let giobatdau = String(giobd)
        let gioketthuc = String(giokt)
        var datathu = data.split(' ')

        return (
            <View style={{}}>
                {
                    check ? (
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={[styles.data, {}]}  >{datathu[0] + " " + moment(giobatdau).format("DD/MM/YYYY") + " " + datathu[2] + " - " + datathu[4]}</Text>
                        </View>
                    ) : (
                        <View style={{ flex: 1, }}>
                            <Text style={[styles.data, {}]}  >{datathu[0] + " " + moment(giobatdau).format("DD/MM/YYYY") + " " + datathu[2]}</Text>
                            <Text style={[styles.data, {}]}  >{datathu[4] + " " + moment(gioketthuc).format("DD/MM/YYYY") + " " + datathu[6]}</Text>
                        </View>
                    )
                }
            </View>
        )
    }

    renderInfo = (item) => {
        let colorBg = item.Valid ? colors.bgGreen : item.Valid == false ? colors.bgRed : (item.TinhTrangID == 2 ? colors.bgRed : colors.bgYellow)
        let colorText = item.Valid ? colors.checkGreen : item.Valid == false ? colors.checkCancle : (item.TinhTrangID == 2 ? colors.checkCancle : colors.checkAwait)
        let Icon = item.Valid ? Images.ImageJee.icBrowser : item.Valid == false ? Images.ImageJee.icUnBrowser : (item.TinhTrangID == 2 ? Images.ImageJee.icDahuy : Images.ImageJee.ic_ChoDuyet)
        let ngDuyet = item.NguoiDuyet ? item.NguoiDuyet : ''
        let ngHuy = item.NguoiHuy ? item.NguoiHuy : ''
        return (
            <View style={{ flexDirection: 'row', backgroundColor: colorBg, marginHorizontal: 10, paddingHorizontal: 10, paddingVertical: 15, borderRadius: 10, marginTop: 20 }}>
                <Image source={Icon} style={{ tintColor: item.Valid == null ? colorText : null }} />
                {item.Valid ?
                    <Text style={{ fontSize: reText(13), color: colorText, marginLeft: 10, alignSelf: 'center', flex: 1 }}>
                        {RootLang.lang.thongbaochung.yeucauduocduyetvao} {item.NgayDuyet ? Utils.formatTimeAgo(moment(item.NgayDuyet, 'YYYY-MM-DD HH:mm:ssZ'), 1, true) : ''} {RootLang.lang.thongbaochung.boi} <Text style={{ fontWeight: 'bold' }}>{ngDuyet}</Text>
                    </Text> :
                    item.Valid == false ?
                        <Text style={{ fontSize: reText(13), color: colorText, marginLeft: 10, alignSelf: 'center', flex: 1 }}>
                            <Text style={{ fontWeight: 'bold' }}>{ngDuyet}</Text> {RootLang.lang.thongbaochung.datuchoiyeucauvao} {item.NgayDuyet ? Utils.formatTimeAgo(moment(item.NgayDuyet, 'YYYY-MM-DD HH:mm:ssZ'), 1, true) + '.' : ''} {item.GhiChu ? RootLang.lang.thongbaochung.lydo + " " + item.GhiChu : ''}
                        </Text> :
                        item.TinhTrangID == 2 ?
                            <Text style={{ fontSize: reText(13), color: colorText, marginLeft: 10, alignSelf: 'center', flex: 1 }}>
                                <Text style={{ fontWeight: 'bold' }}>{ngHuy}</Text> {RootLang.lang.thongbaochung.daxoadonvao} {item.NgayHuy ? Utils.formatTimeAgo(moment(item.NgayHuy, 'YYYY-MM-DD HH:mm:ss').add(7, 'hours'), 1, true) + '.' : ''}
                            </Text> :
                            <Text style={{ fontSize: reText(13), color: colorText, marginLeft: 10, alignSelf: 'center', flex: 1 }}>
                                {RootLang.lang.thongbaochung.yeucaudangduocchopheduyet}
                            </Text>}
            </View>
        )
    }

    render() {
        const { opacity, item, checkAPI } = this.state
        let thoigian = item.ThoiGian ? item.ThoiGian.split(' (', 1) : '--'
        let colorText = item.Valid ? colors.checkGreen : item.Valid == false ? colors.checkCancle : (item.TinhTrangID == 2 ? colors.checkCancle : colors.checkAwait)
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
                                {item.LoaiPhep ? item.LoaiPhep : '--'}
                            </Text>
                            <Text style={{ fontSize: reText(11), color: colors.colorNoteJee, marginTop: 5 }}>
                                {item.NgayGui ? Utils.formatTimeAgo(moment(item.NgayGui, 'YYYY-MM-DD HH:mm:ssZ'), 1, true) : RootLang.lang.thongbaochung.chuacapnhat}
                            </Text>

                        </View>

                        {checkAPI ? this.renderInfo(item) : null}
                        <Text style={{ color: colors.colorTitleJee, fontSize: reText(14), paddingHorizontal: 20, marginTop: 25 }}>{RootLang.lang.thongbaochung.thongtindangky.toUpperCase()}</Text>
                        <View style={{ backgroundColor: colors.white, paddingHorizontal: 10, marginHorizontal: 10, borderRadius: 10, marginTop: 5 }}>
                            <RenderInfo icon={Images.ImageJee.icProjectS} title={RootLang.lang.scphepthemdon.hinhthuc} value={item.LoaiPhep ? item.LoaiPhep : ''} especially={true} color={colorText} />
                            <RenderInfo icon={Images.ImageJee.icTimeJee} title={RootLang.lang.thongbaochung.thoigian} value={thoigian} />
                            <RenderInfo icon={Images.ImageJee.icClock} title={RootLang.lang.thongbaochung.songaynghi} value={item.SoNgay ? item.SoNgay + ' ' + RootLang.lang.thongbaochung.ngay : '--'} line={false} />
                        </View>

                        <Text style={{ color: colors.colorTitleJee, fontSize: reText(14), paddingHorizontal: 20, marginTop: 25 }}>{RootLang.lang.thongbaochung.lydo.toUpperCase()}</Text>
                        <View style={{ backgroundColor: colors.white, paddingHorizontal: 10, paddingTop: 15, paddingBottom: 20, marginHorizontal: 10, borderRadius: 10, marginTop: 5 }}>
                            <Text style={{ fontSize: reText(14), color: colors.black }}>{item.LyDo ? item.LyDo : '---'}</Text>
                        </View>
                        {checkAPI ?
                            <View style={{
                                width: '100%',
                                justifyContent: 'flex-end', alignItems: 'center', marginTop: 36, marginBottom: 0 + paddingBotX,
                                flexDirection: 'row', justifyContent: 'space-evenly', paddingHorizontal: 10
                            }}>
                                <TouchableOpacity onPress={() => this._goback()} style={{ width: item.Valid == null && item.TinhTrangID != 2 ? '49%' : '100%', backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center', paddingVertical: 15, borderRadius: 10 }}>
                                    <Text style={{ fontSize: reText(14), color: colors.checkAwait }}>{RootLang.lang.thongbaochung.dong}</Text>
                                </TouchableOpacity>
                                {
                                    item.Valid == null && item.TinhTrangID != 2 ? <TouchableOpacity onPress={this._DeteleDonPhep} style={{ width: '49%', backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center', paddingVertical: 15, borderRadius: 10 }}>
                                        <Text style={{ fontSize: reText(14), color: colors.checkCancle, fontWeight: 'bold' }}>{RootLang.lang.thongbaochung.xoa}</Text>
                                    </TouchableOpacity>
                                        : null
                                }
                            </View> : null}
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
        fontSize: reText(14),
        color: '#404040'
    }
})
export default Utils.connectRedux(ModalChiTietNghiPhep, mapStateToProps, true)
