import moment from 'moment';
import React, { Component } from 'react';
import { BackHandler, Image, StyleSheet, Text, TouchableOpacity, View, ScrollView, TextInput } from 'react-native';
import { getChiTietDuyetTangCa, PostGuiDuyetTangCa } from '../../../../apis/apiDuyetTangca';
import { appConfig } from '../../../../app/Config';
import { RootLang } from '../../../../app/data/locales';
import { nGlobalKeys } from "../../../../app/keys/globalKey";
import Utils from '../../../../app/Utils';
import IsLoading from '../../../../components/IsLoading';
import { Images } from '../../../../images';
import { colors } from '../../../../styles/color';
import { reText, sizes } from '../../../../styles/size';
import UtilsApp from '../../../../app/UtilsApp';
import { ROOTGlobal } from '../../../../app/data/dataGlobal';
import { Height, nstyles, Width, paddingBotX, nHeight, nwidth } from '../../../../styles/styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import HeaderAnimationJee from '../../../../components/HeaderAnimationJee';

class CT_TangCa extends Component {
    constructor(props) {
        super(props);
        // this.isType = Utils.ngetParam(this,'isType')
        this.isduyet = false;
        this.result = false;
        this.state = {
            ChiTietTangCa: {},
            BatDauTu: '',
            Den: '',
            IsAccept: true,
            HTChiTraSelect: { value: '1', label: RootLang.lang.scduyettangca.tinhtientangca },
            data: [
                // { value: '', label: RootLang.lang.scduyettangca.chonhinhthucchitra },
                { value: '1', label: RootLang.lang.scduyettangca.tinhtientangca },
                { value: '2', label: RootLang.lang.scduyettangca.tinhvaophepnghibu },
            ],
            isVisible: true,
            error: false,
            resData: {},
            dataItem: {},
            itemId: Utils.ngetParam(this, 'itemId', 0),
            isGoBak: Utils.ngetParam(this, "isGoBak", false),
            Data_ApprovingUser: {},
            isTab: 0,
            GhiChu: '',
            checkAPI: false
        }
    }
    componentDidMount() {
        this.backHandler = BackHandler.addEventListener("hardwareBackPress", this._backHandlerButton);

        this._Get_ChiTietDuyetTangCa();
    }
    componentWillUnmount() {
        this.backHandler.remove();
    }
    _backHandlerButton = () => {
        this._goback()
        return true
    }


    _DuyetDon = async (IsAccept) => {
        const { dataItem, itemId, GhiChu } = this.state
        this.isduyet = IsAccept;
        var { HTChiTraSelect, ChiTietTangCa } = this.state;
        if (HTChiTraSelect.value == '') {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.scduyettangca.banchuachonhinhthucchitra, 3)
            return;
        }
        if (!HTChiTraSelect && ChiTietTangCa.Data_ApprovingUser.length > 0 && dataItem.IsFinal && IsAccept != false) {
            this.setState({ error: true })
        }
        if (IsAccept == false) {
            Utils.showMsgBoxYesNo(this, RootLang.lang.thongbaochung.thongbao, RootLang.lang.thongbaochung.hanhdonghoi2, RootLang.lang.thongbaochung.xacnhan, RootLang.lang.thongbaochung.thoat, async () => {
                nthisLoading.show();
                let res = await PostGuiDuyetTangCa(ChiTietTangCa.ID_Row, IsAccept, HTChiTraSelect.value, GhiChu)
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
            let res = await PostGuiDuyetTangCa(ChiTietTangCa.ID_Row, IsAccept, HTChiTraSelect.value, GhiChu)
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
    _Get_ChiTietDuyetTangCa = async () => {
        nthisLoading.show();
        const { itemId } = this.state
        let res = await getChiTietDuyetTangCa(itemId)
        if (res.status == 1) {
            nthisLoading.hide();
            var ChiTietTangCa = res
            var BatDauTu = res.ThoiGian.split(' ')
            if (res.IsFinal == true) {
                // var ht = await res.HinhThucChiTra === "Tính vào phép nghỉ bù" ? this.state.data[2] : this.state.data[1];
                this.setState({ ChiTietTangCa, BatDauTu, checkAPI: true })
            } else {
                this.setState({ ChiTietTangCa, BatDauTu, checkAPI: true })
            }
        } else {
            nthisLoading.hide();
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
        }
    }

    _callback = (HTChiTraSelect) => {
        // Utils.nlog("callback   --------------", HTChiTraSelect)
        this.setState({ HTChiTraSelect });
    }
    _ViewItem = (item) => {
        return (
            <Text key={item.value} style={{
                fontSize: sizes.sText16, color: this.state.HTChiTraSelect.value == item.value ? colors.black : colors.colorGrayText, textAlign: 'center',
                fontWeight: this.state.HTChiTraSelect.value == item.value ? 'bold' : null
            }}>{`${item.label}`}</Text>)
    }
    _DropDown = () => {
        Utils.goscreen(this, 'Modal_ComponentSelectCom', { callback: this._callback, item: this.state.HTChiTraSelect, AllThaoTac: this.state.data, ViewItem: this._ViewItem })
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
        var { ChiTietTangCa, BatDauTu, IsAccept, error = false, data, isTab, GhiChu, checkAPI } = this.state;
        var Data_ApprovingUser = ChiTietTangCa && ChiTietTangCa.Data_ApprovingUser ? ChiTietTangCa.Data_ApprovingUser : ''
        const Data_CapDuyet = ChiTietTangCa.Data_CapDuyet ? ChiTietTangCa.Data_CapDuyet : [];
        let NguoiDuyet = Data_CapDuyet.length > 0 && Data_CapDuyet[0].hoten
        let NgayDuyet = Data_CapDuyet.length > 0 && Data_CapDuyet[0].CheckedDate
        return (
            <View style={{ flex: 1, backgroundColor: colors.backgroudJeeHR }}>
                <HeaderAnimationJee isGoBack={true} OnGoBack={this._goback} nthis={this} title={(RootLang.lang.sckhac.chitietduyet)} />
                <KeyboardAwareScrollView keyboardShouldPersistTaps='handled' style={{ flex: 1 }}
                    showsVerticalScrollIndicator={false}>
                    {Data_ApprovingUser.length == 0 && checkAPI ?
                        <>
                            <View style={{ backgroundColor: ChiTietTangCa.IsDuyet != true ? colors.bgRed : colors.bgGreen, paddingHorizontal: 10, marginHorizontal: 10, marginTop: 10, paddingVertical: 15, flexDirection: 'row', borderRadius: 10 }}>
                                <Image source={ChiTietTangCa.IsDuyet ? Images.ImageJee.icBrowser : Images.ImageJee.icUnBrowser} />
                                <View style={{ alignSelf: 'center', paddingRight: 10 }}>
                                    {ChiTietTangCa.IsDuyet ?
                                        <Text style={{ fontSize: reText(12), color: colors.checkGreen, marginLeft: 5 }}>{`${RootLang.lang.thongbaochung.yeucauduocduyetvao} `}
                                            {Utils.formatTimeAgo(moment(NgayDuyet), 1, true)} {RootLang.lang.thongbaochung.boi} <Text style={{ fontWeight: 'bold' }}>{NguoiDuyet}</Text>
                                        </Text>
                                        : <Text style={{ fontSize: reText(12), color: colors.checkCancle, marginLeft: 5 }}><Text style={{ fontWeight: 'bold' }}>{NguoiDuyet}</Text>{` ${RootLang.lang.thongbaochung.datuchoiyeucauvao} `}
                                            {Utils.formatTimeAgo(moment(NgayDuyet), 1, true)}
                                        </Text>}

                                </View>
                            </View>
                        </> : null}
                    <View style={{ justifyContent: "center", alignItems: 'center', marginTop: 20 }}>
                        <Image source={ChiTietTangCa.Avatar ? { uri: ChiTietTangCa.Avatar } : Images.icAva} style={{ width: 56, height: 56, borderRadius: 56 }} />
                        <Text style={styler.hoten}> {ChiTietTangCa.HoTenNV ? ChiTietTangCa.HoTenNV : '--'}</Text>
                        <Text style={styler.chucVu}> {ChiTietTangCa.ChucVu ? ChiTietTangCa.ChucVu : '--'}</Text>
                    </View>

                    <Text style={{ color: colors.colorTitleJee, fontSize: reText(14), paddingHorizontal: 20, marginTop: 20 }}>{RootLang.lang.thongbaochung.thongtindangky.toUpperCase()}</Text>
                    <View style={styler.khungtren}>
                        <View style={styler.khungdata}>
                            <Image source={Images.ImageJee.icProjectS} style={{ width: Width(5), height: Width(5), marginRight: Width(1) }} />
                            <Text style={styler.title}>{RootLang.lang.scduyettangca.hinhthuc}</Text>
                            <Text numberOfLines={1} style={[styler.noidung, { color: colors.checkAwait, fontWeight: 'bold' }]}>{RootLang.lang.scduyettangca.tangca}</Text>
                        </View>
                        <View style={{ height: 0.5, backgroundColor: colors.colorLineJee, marginLeft: Width(7) }} />
                        <View style={styler.khungdata}>
                            <Image source={Images.ImageJee.icTimeJee} style={{ width: Width(5), height: Width(5), marginRight: Width(1) }} />
                            <Text style={styler.title}>{RootLang.lang.scduyettangca.thoigian}</Text>
                            <Text style={[styler.noidung, {}]}>{ChiTietTangCa.NgayTangCa ? Utils.ChuyenSangThu(ChiTietTangCa.NgayTangCa) + ', ' + ChiTietTangCa.NgayTangCa + ' ' + ChiTietTangCa.ThoiGian : "..."}</Text>
                        </View>
                        <View style={{ height: 0.5, backgroundColor: colors.colorLineJee, marginLeft: Width(7) }} />
                        <View style={styler.khungdata}>
                            <Image source={Images.ImageJee.icClock} style={{ width: Width(5), height: Width(5), marginRight: Width(1) }} />
                            <Text style={styler.title}>{RootLang.lang.scduyettangca.sogio}</Text>
                            <Text numberOfLines={1} style={[styler.noidung, {}]}> {ChiTietTangCa.SoGio ? + ChiTietTangCa.SoGio + " " + RootLang.lang.scduyettangca.gio : "..."}</Text>
                        </View>
                        <View style={{ height: 0.5, backgroundColor: colors.colorLineJee, marginLeft: Width(7) }} />
                        <View style={styler.khungdata}>
                            <Image source={Images.ImageJee.icTimeJee} style={{ width: Width(5), height: Width(5), marginRight: Width(1) }} />
                            <Text style={styler.title}>{RootLang.lang.scduyettangca.ngaygui}</Text>
                            <Text numberOfLines={1} style={[styler.noidung, {}]}> {ChiTietTangCa.NgayGui ? moment(ChiTietTangCa.NgayGui, 'YYYY-MM-DD HH:mm:ssZ').format('HH:mm ddd, DD/MM/YYYY') : '--'}</Text>
                        </View>
                        {
                            ChiTietTangCa.OverTime == true ? (
                                <>
                                    <View style={{ height: 0.5, backgroundColor: colors.colorLineJee, marginLeft: Width(7) }} />
                                    <View style={styler.khungdata}>
                                        <Image source={Images.ImageJee.icAttachJee} style={{ width: Width(5), height: Width(5), marginRight: Width(1) }} />
                                        <Text style={styler.title}>{RootLang.lang.scduyettangca.ghichu}   </Text>
                                        <Text numberOfLines={1} style={[styler.noidung, {}]}> {RootLang.lang.scduyettangca.lamthemtronggiogiailao}</Text>
                                    </View>
                                </>
                            ) : null
                        }
                        {
                            ChiTietTangCa.IsFixHours == true ?
                                <>
                                    <View style={{ height: 0.5, backgroundColor: colors.colorLineJee, marginLeft: Width(7) }} />
                                    <View style={styler.khungdata}>
                                        <Image source={Images.ImageJee.icAttachJee} style={{ width: Width(5), height: Width(5), marginRight: Width(1) }} />
                                        <Text style={styler.title}>{ChiTietTangCa.OverTime ? "" : RootLang.lang.scduyettangca.ghichu}</Text>
                                        <Text style={[styler.noidung, {}]}> {RootLang.lang.scduyettangca.lamviecbenngoai}</Text>
                                    </View></>
                                : null
                        }
                        <View style={{ height: 0.5, backgroundColor: colors.colorLineJee, marginLeft: Width(7) }} />
                        <View style={[Data_ApprovingUser.length > 0 ? styler.khunghinhthuctinh : styler.khungdata, { alignItems: 'center' }]}>
                            <Image source={Images.ImageJee.icCoinJee} style={{ width: Width(5), height: Width(5), marginRight: Width(1) }} />
                            <Text style={styler.title}>{RootLang.lang.scduyettangca.hinhthuctinh}</Text>
                            {Data_ApprovingUser.length > 0 ?
                                <TouchableOpacity style={{
                                    paddingVertical: 10, paddingHorizontal: 10, flexDirection: 'row', maxWidth: Width(55),
                                    backgroundColor: colors.backgroundHistory, borderRadius: 5
                                }}
                                    onPress={this._DropDown}>
                                    <Text style={{ fontSize: reText(14) }}>{this.state.HTChiTraSelect.label}</Text>
                                    <Image source={Images.ImageJee.icDropdown} style={{ alignSelf: 'center', marginLeft: 5, width: Width(2), height: Width(2) }} />
                                </TouchableOpacity> :
                                <Text numberOfLines={1} style={[styler.noidung, { alignSelf: 'center' }]}> {ChiTietTangCa.HinhThucChiTra ? ChiTietTangCa.HinhThucChiTra : "..."}</Text>
                            }
                        </View>
                        <View style={{ height: 0.5, backgroundColor: colors.colorLineJee, marginLeft: Width(7) }} />
                        <View style={styler.khungdata}>
                            <Image source={Images.ImageJee.icOClock} style={{ width: Width(5), height: Width(5), marginRight: Width(1) }} />
                            <Text style={styler.title}>{RootLang.lang.scduyettangca.lydo}</Text>
                            <Text style={[styler.noidung, {}]}>
                                <Text style={[styler.lydo, {}]}>{ChiTietTangCa.Lydo ? ChiTietTangCa.Lydo : "--"}</Text>
                            </Text>
                        </View>
                    </View>

                    <View style={{ marginBottom: 36 }}>
                        <Text style={{ color: colors.colorTitleJee, fontSize: reText(14), paddingHorizontal: 20, marginTop: 20, marginBottom: 5 }}>{RootLang.lang.err.ghichu.toUpperCase()}</Text>
                        <View style={{ backgroundColor: colors.white, marginHorizontal: 10, borderRadius: 10, paddingVertical: 10 }}>
                            {Data_CapDuyet && Data_CapDuyet.length > 0 ?
                                <Text style={{ fontSize: reText(14), color: colors.blackJee, marginHorizontal: 10, paddingVertical: 5 }}>{Data_CapDuyet && Data_CapDuyet[0].CheckNote ? Data_CapDuyet[0].CheckNote : '--'}</Text> :
                                <TextInput
                                    placeholder={RootLang.lang.err.nhapghichu}
                                    multiline={true}
                                    textAlignVertical={"top"}
                                    value={this.state.textGChu}
                                    style={[nstyles.ntextinput, { maxHeight: nHeight(12), fontSize: reText(14), height: nHeight(12) }]}
                                    onChangeText={(text) => this.setState({ GhiChu: text })} />}

                        </View>
                    </View>
                </KeyboardAwareScrollView>
                {
                    Data_ApprovingUser.length == 0 ?
                        <TouchableOpacity onPress={() => this.state.isGoBak == true ? Utils.goback(this) : Utils.goscreen(this, "sw_HomePage")} style={{ backgroundColor: colors.white, marginBottom: paddingBotX + 15, justifyContent: 'center', alignItems: 'center', borderRadius: 10, paddingVertical: 15, marginHorizontal: 10 }}>
                            <Text style={{ fontSize: reText(14), color: colors.checkAwait }}>{RootLang.lang.thongbaochung.dong}</Text>
                        </TouchableOpacity> :
                        <View style={{ flexDirection: 'row', marginBottom: paddingBotX + 15, justifyContent: 'space-between', marginHorizontal: 10, marginTop: 10, borderTopLeftRadius: 5, borderTopRightRadius: 5 }}>
                            <TouchableOpacity onPress={() => this._DuyetDon(IsAccept == false)} style={{ width: Width(46.5), backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center', borderRadius: 10, paddingVertical: 15, }}>
                                <Text style={{ fontSize: reText(14), color: colors.checkAwait, fontWeight: 'bold' }}>{RootLang.lang.thongbaochung.tuchoi}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this._DuyetDon(IsAccept == true)} style={{ width: Width(46.5), backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center', borderRadius: 10, paddingVertical: 15, }}>
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
export default Utils.connectRedux(CT_TangCa, mapStateToProps, true)