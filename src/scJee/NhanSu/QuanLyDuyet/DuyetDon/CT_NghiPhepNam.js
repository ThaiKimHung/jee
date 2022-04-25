import React, { Component } from 'react';
import { BackHandler, Text, TextInput, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Get_ChiTietDuyetPhep, PostDuyetPhep } from '../../../../apis/apileaveapproval';
import { appConfig } from '../../../../app/Config';
import { RootLang } from '../../../../app/data/locales';
import { nGlobalKeys } from '../../../../app/keys/globalKey';
import Utils from '../../../../app/Utils';
import IsLoading from '../../../../components/IsLoading';
import { Images } from '../../../../images';
import { colors } from '../../../../styles/color';
import { reText } from '../../../../styles/size';
import { nkey } from '../../../../app/keys/keyStore';
import UtilsApp from '../../../../app/UtilsApp';
import { ROOTGlobal } from '../../../../app/data/dataGlobal';
import { Height, nstyles, Width, paddingBotX, nHeight } from '../../../../styles/styles';
import moment from 'moment';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import HeaderAnimationJee from '../../../../components/HeaderAnimationJee';

class CT_NghiPhepNam extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ChiTietDuyetPhep: {},
            BatDauTu: '',
            Den: '',
            NgayDuyet: '',
            IsAccept: true,
            isVisible: true,
            itemId: Utils.ngetParam(this, 'itemId', 0),
            idtab: Utils.ngetParam(this, "idtab", 0), // Phân biệt Tab danh sách hay Lịch Sử
            tinhtrangSelect: { name: RootLang.lang.scduyetphep.chuaduyet, value: "2" },
            done: { name: RootLang.lang.scduyetphep.daduyet, value: "1" },
            dataItem: {},
            NguoiDuyet: '',
            isGoBak: Utils.ngetParam(this, "isGoBak", false),
            Data_ApprovingUser: {},
            GhiChu: '',
            CheckNote: '',
            AvatarCapDuyet: '',
            cungngay: false,
            checkAPI: false
        }
        this.IDKHDPS = 0;
    }
    componentDidMount() {
        nthisLoading.show();
        this.backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            this._backHandlerButton
        );
        this._Get_ChiTietDuyetPhep();
    }
    _backHandlerButton = () => {
        this._goback()
        return true
    }
    async componentWillUnmount() {
        this.IDKHDPS = await Utils.ngetStorage(nkey.IDKH_DPS, 0)
        this.backHandler.remove();
    }

    _DuyetDon = async (IsAccept) => {
        const { dataItem, itemId, GhiChu } = this.state
        if (IsAccept == false) {
            Utils.showMsgBoxYesNo(this, RootLang.lang.thongbaochung.thongbao, RootLang.lang.thongbaochung.hanhdonghoi2, RootLang.lang.thongbaochung.xacnhan, RootLang.lang.thongbaochung.thoat, async () => {
                nthisLoading.show();
                let res = await PostDuyetPhep(this.state.itemId, 1, IsAccept, GhiChu)
                if (res.status == 1) {
                    this.props.RemoveItemDuyet({ RowID: itemId })
                    nthisPush.show({
                        appIconSource: Images.JeeGreen,
                        appTitle: appConfig.TenAppHome,
                        title: RootLang.lang.thongbaochung.thongbao,
                        body: RootLang.lang.scduyetphep.dondaduocxuly,
                        slideOutTime: 2000
                    });
                    Utils.setGlobal(nGlobalKeys.ScreenChiTiet, "")
                    nthisLoading.hide();
                    ROOTGlobal.GetSoLuongNhacNho.GetSLNhacNho()
                    this.state.isGoBak == true ? Utils.goback(this) : Utils.goscreen(this, "sw_HomePage");

                }
                else {
                    nthisLoading.hide();
                    UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.scduyetphep.xulythatbai, 2)
                }
            }, () => { })
        }
        if (IsAccept == true) {
            nthisLoading.show();
            let res = await PostDuyetPhep(this.state.itemId, 1, IsAccept, GhiChu)
            if (res.status == 1) {
                this.props.RemoveItemDuyet({ RowID: itemId })
                nthisPush.show({
                    appIconSource: Images.JeeGreen,
                    appTitle: appConfig.TenAppHome,
                    title: RootLang.lang.thongbaochung.thongbao,
                    body: RootLang.lang.scduyetphep.dondaduocxuly,
                    slideOutTime: 2000
                });
                Utils.setGlobal(nGlobalKeys.ScreenChiTiet, "")
                nthisLoading.hide();
                ROOTGlobal.GetSoLuongNhacNho.GetSLNhacNho()
                this.state.isGoBak == true ? Utils.goback(this) : Utils.goscreen(this, "sw_HomePage");

            } else {
                nthisLoading.hide();
                UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.scduyetphep.xulythatbai, 2)
            }
        }
    }
    _Get_ChiTietDuyetPhep = async () => {
        var { BatDauTu, ChiTietDuyetPhep, Den, NguoiDuyet, NgayDuyet, idtab, CheckNote, AvatarCapDuyet, itemId } = this.state
        let res = await Get_ChiTietDuyetPhep(itemId, 1)
        if (res.status == 1) {
            if (res.IsDaHuy) {
                UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, 'Đơn đã bị xoá', 2)
            }
            ChiTietDuyetPhep = res
            NguoiDuyet = res.Data_CapDuyet.length > 0 ? res.Data_CapDuyet[0].hoten : null
            CheckNote = res.Data_CapDuyet.length > 0 ? res.Data_CapDuyet[0].CheckNote : null
            AvatarCapDuyet = res.Data_CapDuyet.length > 0 ? res.Data_CapDuyet[0].Avatar : null
            NgayDuyet = res.Data_CapDuyet.length > 0 ? res.Data_CapDuyet[0].CheckedDate : null
            BatDauTu = res.BatDauTu.split(' ')
            Den = res.Den.split(' ')

            var data_Data_ApprovingUser = res.Data_ApprovingUser ? res.Data_ApprovingUser[0] : {}
            nthisLoading.hide()
        } else {
            nthisLoading.hide()
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : "Có lỗi xảy ra", 2)
        }
        this.setState({ NgayDuyet, NguoiDuyet, ChiTietDuyetPhep, BatDauTu, Den, Data_ApprovingUser: data_Data_ApprovingUser, CheckNote, AvatarCapDuyet, checkAPI: true }, () => { this._checkDay() })
    }

    _checkDay = () => {
        const { BatDauTu, Den } = this.state
        const x = new Date(moment(BatDauTu[1], 'DD/MM/YYYY').format());
        const y = new Date(moment(Den[1], 'DD/MM/YYYY').format());
        if ((+x === +y) == true) {
            this.setState({ cungngay: true })
        }
        else {
            this.setState({ cungngay: false })
        }
    }

    _goback = () => {
        if (this.state.isGoBak) {
            Utils.goback(this);
            Utils.setGlobal(nGlobalKeys.ScreenChiTiet, "")
        } else {
            Utils.goscreen(this, "sw_HomePage");
            Utils.setGlobal(nGlobalKeys.ScreenChiTiet, "")
        }
    }
    render() {
        let { BatDauTu, ChiTietDuyetPhep, Den, IsAccept, idtab, NguoiDuyet, NgayDuyet, cungngay, checkAPI } = this.state
        let Data_ApprovingUser = ChiTietDuyetPhep && ChiTietDuyetPhep.Data_ApprovingUser ? ChiTietDuyetPhep.Data_ApprovingUser : ''
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: colors.backgroudJeeHR }]}>
                <HeaderAnimationJee isGoBack={true} OnGoBack={this._goback} nthis={this} title={RootLang.lang.sckhac.chitietduyet} />
                <KeyboardAwareScrollView keyboardShouldPersistTaps='handled' style={{ flex: 1 }}
                    showsVerticalScrollIndicator={false}>
                    {Data_ApprovingUser.length == 0 && checkAPI && NgayDuyet ?
                        <>
                            <View style={{ backgroundColor: ChiTietDuyetPhep.IsDuyet != true ? colors.bgRed : colors.bgGreen, paddingHorizontal: 10, marginHorizontal: 10, marginTop: 10, paddingVertical: 15, flexDirection: 'row', borderRadius: 10 }}>
                                <Image source={ChiTietDuyetPhep.IsDuyet ? Images.ImageJee.icBrowser : Images.ImageJee.icUnBrowser} />
                                <View style={{ alignSelf: 'center', paddingRight: 10 }}>
                                    {ChiTietDuyetPhep.IsDuyet ?
                                        <Text style={{ fontSize: reText(12), color: colors.checkGreen, marginLeft: 5 }}>{`${RootLang.lang.thongbaochung.yeucauduocduyetvao} `}
                                            {NgayDuyet ? Utils.formatTimeAgo(moment(NgayDuyet, 'YYYY-MM-DD HH:mm:ssZ'), 1, true) : '--'} {RootLang.lang.thongbaochung.boi} <Text style={{ fontWeight: 'bold' }}>{NguoiDuyet}</Text>
                                        </Text>
                                        : <Text style={{ fontSize: reText(12), color: colors.checkCancle, marginLeft: 5 }}><Text style={{ fontWeight: 'bold' }}>{NguoiDuyet}</Text>{` ${RootLang.lang.thongbaochung.datuchoiyeucauvao} `}
                                            {NgayDuyet ? Utils.formatTimeAgo(moment(NgayDuyet, 'YYYY-MM-DD HH:mm:ssZ'), 1, true) : '--'}
                                        </Text>}

                                </View>
                            </View>
                        </> : null}
                    <View style={{ justifyContent: "center", alignItems: 'center', marginTop: 20 }}>
                        <Image source={ChiTietDuyetPhep.Avatar ? { uri: ChiTietDuyetPhep.Avatar } : Images.icAva} style={{ width: 56, height: 56, borderRadius: 56 }} />
                        <Text style={styler.hoten}> {ChiTietDuyetPhep.HoTen ? ChiTietDuyetPhep.HoTen : '--'}</Text>
                        <Text style={styler.chucVu}> {ChiTietDuyetPhep.ChucVu ? ChiTietDuyetPhep.ChucVu : '--'}</Text>
                    </View>
                    <Text style={{ color: colors.colorTitleJee, fontSize: reText(14), paddingHorizontal: 20, marginTop: 20 }}>{RootLang.lang.thongbaochung.thongtindangky.toUpperCase()}</Text>
                    <View style={styler.khungtren}>
                        <View style={styler.marginTop}>
                            <View style={styler.khungdata}>
                                <Image source={Images.ImageJee.icProjectS} style={{ width: Width(5), height: Width(5), marginRight: Width(1) }} />
                                <Text style={styler.title}>{RootLang.lang.scduyettangca.hinhthuc}</Text>
                                <Text numberOfLines={1} style={[styler.noidung, { color: colors.checkGreen, fontWeight: 'bold' }]}>{ChiTietDuyetPhep.HinhThuc ? ChiTietDuyetPhep.HinhThuc : "..."}</Text>
                            </View>
                            <View style={{ height: 0.5, backgroundColor: colors.colorLineJee, marginLeft: Width(7) }} />
                            <View style={styler.khungdata}>
                                <Image source={Images.ImageJee.icTimeJee} style={{ width: Width(5), height: Width(5), marginRight: Width(1) }} />
                                <Text style={styler.title}>{RootLang.lang.scduyettangca.thoigian}</Text>
                                {
                                    cungngay == true ? (
                                        <Text style={[styler.noidung, {}]}>{`${BatDauTu ? `${Utils.ChuyenSangThu(Den[1])}, ${Den[1]} ${BatDauTu[0]}` : '--'} - ${Den[0]}`}</Text>
                                    ) : (
                                        checkAPI ?
                                            <View>
                                                <Text style={[styler.noidung, {}]}>{
                                                    Utils.ChuyenSangThu(BatDauTu[1]) + `, ${BatDauTu ? `${BatDauTu[1]} ${BatDauTu[0]} ` : '--'} `
                                                }</Text>
                                                <Text style={[styler.noidung, {}]}>{
                                                    Utils.ChuyenSangThu(Den[1]) + `, ${Den ? `${Den[1]} ${Den[0]}` : '--'} `
                                                }</Text>
                                            </View> : <Text style={[styler.noidung, {}]}>{'--'}</Text>
                                    )
                                }
                            </View>
                            <View style={{ height: 0.5, backgroundColor: colors.colorLineJee, marginLeft: Width(7) }} />
                            <View style={styler.khungdata}>
                                <Image source={Images.ImageJee.icClock} style={{ width: Width(5), height: Width(5), marginRight: Width(1) }} />
                                <Text style={styler.title}>{RootLang.lang.scduyettangca.songay}</Text>
                                <Text numberOfLines={1} style={[styler.noidung, {}]}> {ChiTietDuyetPhep.SoGio ? `${ChiTietDuyetPhep.SoGio + " " + RootLang.lang.common.ngay}` : "--"}</Text>
                            </View>
                            <View style={{ height: 0.5, backgroundColor: colors.colorLineJee, marginLeft: Width(7) }} />
                            <View style={styler.khungdata}>
                                <Image source={Images.ImageJee.icTimeJee} style={{ width: Width(5), height: Width(5), marginRight: Width(1) }} />
                                <Text style={styler.title}>{RootLang.lang.scduyettangca.ngaygui}</Text>
                                <Text numberOfLines={1} style={[styler.noidung, {}]}> {ChiTietDuyetPhep.NgayGui ? UtilsApp.convertTimeLocal(ChiTietDuyetPhep.NgayGui, ' HH:mm ddd, DD/MM/YYYY ') : "--"}</Text>
                            </View>
                            {/* <View style={styler.khungborder}>
                                <View style={styler.khungdata}>
                                    <Text style={styler.title}>{RootLang.lang.scduyetphep.diadiem}</Text>
                                    <Text numberOfLines={1} style={[styler.noidung, {}]}> {ChiTietDuyetPhep.DiaDiem ? ChiTietDuyetPhep.DiaDiem : "..."}</Text>
                                </View>
                            </View> */}
                            <View style={{ height: 0.5, backgroundColor: colors.colorLineJee, marginLeft: Width(7) }} />
                            <View style={styler.khungdata}>
                                <Image source={Images.ImageJee.icOClock} style={{ width: Width(5), height: Width(5), marginRight: Width(1) }} />
                                <Text style={styler.title}>{RootLang.lang.scduyettangca.lydo}</Text>
                                <Text style={[styler.noidung, {}]}>
                                    {
                                        this.IDKHDPS === 1219 ? (
                                            <Text style={[styler.lydo, {}]}> {ChiTietDuyetPhep.IsNghiDiDuLich === true ? (ChiTietDuyetPhep.LyDo + " ( " + RootLang.lang.scduyetphep.didulich + " )") : ChiTietDuyetPhep.LyDo}</Text>
                                        ) : (
                                            <Text style={[styler.lydo, {}]}> {ChiTietDuyetPhep.LyDo ? `${ChiTietDuyetPhep.LyDo}` : "--"}</Text>
                                        )
                                    }
                                </Text>
                            </View>
                        </View>
                    </View>
                    <>
                        <Text style={{ color: colors.colorTitleJee, fontSize: reText(14), paddingHorizontal: 20, marginTop: 20, marginBottom: 5 }}>{RootLang.lang.err.ghichu.toUpperCase()}</Text>
                        <View style={{ backgroundColor: colors.white, marginHorizontal: 10, borderRadius: 10, paddingVertical: 10 }}>
                            {Data_ApprovingUser.length == 0 ?
                                <Text style={{ fontSize: reText(14), color: colors.blackJee, marginHorizontal: 10, paddingVertical: 5 }}>{ChiTietDuyetPhep.Data_CapDuyet && ChiTietDuyetPhep.Data_CapDuyet.length && ChiTietDuyetPhep.Data_CapDuyet[0].CheckNote > 0 ? ChiTietDuyetPhep.Data_CapDuyet[0].CheckNote : '--'}</Text> :
                                <TextInput
                                    placeholder={RootLang.lang.err.nhapghichu}
                                    multiline={true}
                                    textAlignVertical={"top"}
                                    value={this.state.textGChu}
                                    style={[nstyles.ntextinput, { maxHeight: nHeight(12), fontSize: reText(14), height: nHeight(12) }]}
                                    onChangeText={(text) => this.setState({ GhiChu: text })} />
                            }
                        </View>
                    </>

                </KeyboardAwareScrollView>
                {
                    Data_ApprovingUser.length == 0 ?
                        <TouchableOpacity onPress={() => this.state.isGoBak == true ? Utils.goback(this) : Utils.goscreen(this, "sw_HomePage")} style={{ backgroundColor: colors.white, marginBottom: paddingBotX + 15, justifyContent: 'center', alignItems: 'center', borderRadius: 10, paddingVertical: 15, marginHorizontal: 10 }}>
                            <Text style={{ fontSize: reText(14), color: colors.checkAwait }}>{RootLang.lang.thongbaochung.dong}</Text>
                        </TouchableOpacity> :
                        <View style={{ flexDirection: 'row', marginBottom: paddingBotX + 15, justifyContent: 'space-between', marginHorizontal: 10, marginTop: 10, borderTopLeftRadius: 5, borderTopRightRadius: 5 }}>
                            <TouchableOpacity onPress={() => { this._DuyetDon(IsAccept == false) }} style={{ width: Width(46.5), backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center', borderRadius: 10, paddingVertical: 15, }}>
                                <Text style={{ fontSize: reText(14), color: colors.checkAwait, fontWeight: 'bold' }}>{RootLang.lang.thongbaochung.tuchoi}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { this._DuyetDon(IsAccept == true) }} style={{ width: Width(46.5), backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center', borderRadius: 10, paddingVertical: 15, }}>
                                <Text style={{ fontSize: reText(14), color: colors.checkGreen, fontWeight: 'bold' }}>{RootLang.lang.thongbaochung.duyet}</Text>
                            </TouchableOpacity>
                        </View>
                }
                <IsLoading />
            </View >
        )
    }
}

const styler = StyleSheet.create({
    container: {
        flex: 1
    },
    row: {
        flexDirection: 'row'
    },
    padding: {
        padding: 10
    },
    khungtren: {
        backgroundColor: colors.white, borderRadius: 10, marginTop: 5, marginHorizontal: 10, paddingHorizontal: 10
    },
    khungduoi: {
        backgroundColor: colors.white, margin: 10, borderRadius: 10
    },
    hoten: {
        fontSize: reText(14), color: colors.titleJeeHR, marginTop: 3,
    },
    chucVu: {
        fontSize: reText(11), color: colors.colorNoteJee, marginTop: 3,
    },
    marginTop: {

    },
    khungborder: {
        borderTopWidth: 0.5, borderColor: colors.colorLineJee, marginLeft: Width(6)
    },
    khungdata: {
        flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15
    },
    khunghinhthuctinh: {
        flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5
    },
    khungborderLydo: {
        borderTopWidth: 0.5, borderColor: colors.colorLineGray,
    },
    khungLydo: {
        paddingVertical: 5
    },
    title: {
        fontSize: reText(14), color: colors.colorNoteJee, flex: 1, marginTop: 2, marginLeft: 5
    },
    noidung: {
        fontSize: reText(14), textAlign: 'right', color: colors.blackJee, maxWidth: Width(60), marginTop: 2,
    },
    lydo: {
        fontSize: reText(14), flex: 1, color: colors.blackJee, marginHorizontal: 10, marginVertical: 10,
    },
    marginLeft: {
        marginLeft: 10
    },
    margin: {
        margin: 20
    },
    khungkhongduyetvaduyet: {
        flexDirection: 'row', marginTop: Height(3), marginBottom: 25, paddingHorizontal: 20
    },
    tinhtrangduyet: {
        fontSize: reText(12),
    },
    khungtinhtrang: {
        paddingVertical: 15, alignItems: 'center', flexDirection: 'row', marginTop: 5
    },
    khungtext: {
        flexDirection: 'row', flex: 1, flexWrap: 'wrap'
    }
})
const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(CT_NghiPhepNam, mapStateToProps, true);