import moment from 'moment'
import React, { Component } from 'react'
import { BackHandler, TextInput, View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { DuyenDonThoiViec, Get_ChiTietThoiViec } from '../../../../apis/apiThoiViec'
import { appConfig } from '../../../../app/Config'
import { RootLang } from '../../../../app/data/locales'
import { nGlobalKeys } from "../../../../app/keys/globalKey"
import Utils from '../../../../app/Utils'
import IsLoading from '../../../../components/IsLoading'
import { Images } from '../../../../images'
import { colors } from '../../../../styles'
import { reText } from '../../../../styles/size';
import { Height, nstyles, Width, paddingBotX, nHeight, nwidth } from '../../../../styles/styles';
import UtilsApp from '../../../../app/UtilsApp'
import { ROOTGlobal } from '../../../../app/data/dataGlobal'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import HeaderAnimationJee from '../../../../components/HeaderAnimationJee'
import HTML from 'react-native-render-html';

export class CT_ThoiViec extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible: true,
            RowID: Utils.ngetParam(this, "RowID", ''),
            isGoBak: Utils.ngetParam(this, "isGoBak", false),
            Data_ApprovingUser: [],
            item: {},
            GhiChu: '',
            dataItem: '',
            TrangThaiDuyet: false,
            idtab: Utils.ngetParam(this, "idtab", 0),
            checkAPI: false
        }
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            this._backHandlerButton
        );
        this._GetChiTietThoIViec();
    }

    componentWillUnmount() {
        this.backHandler.remove();
    }

    _backHandlerButton = () => {
        this._goback()
        return true
    }

    _GetChiTietThoIViec = async () => {
        nthisLoading.show();
        const { RowID } = this.state
        const res = await Get_ChiTietThoiViec(RowID);
        if (res.status == 1) {

            nthisLoading.hide();
            this.setState({
                item: res,
                Data_ApprovingUser: res.Data_ApprovingUser,
                Data_CapDuyet: res.Data_CapDuyet,
                checkAPI: true
            })
        } else {
            nthisLoading.hide();
            this.setState({ item: {}, checkAPI: true });
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
        }
    }

    _DuyetThoiViec = async (IsAccept) => {
        const { RowID, GhiChu } = this.state;
        if (IsAccept == false) {
            Utils.showMsgBoxYesNo(this, RootLang.lang.thongbaochung.thongbao, RootLang.lang.thongbaochung.hanhdonghoi2, RootLang.lang.thongbaochung.xacnhan, RootLang.lang.thongbaochung.thoat, async () => {
                nthisLoading.show();
                var body = {
                    ID: RowID,
                    IsAccept: IsAccept,
                    LangCode: "vi",
                    GhiChu: GhiChu
                }
                // console.log('body', body)
                let res = await DuyenDonThoiViec(body)
                // console.log('res', res)
                if (res.status == 1) {
                    this.props.RemoveItemDuyet({ RowID: RowID })
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
            var body = {
                ID: RowID,
                IsAccept: IsAccept,
                LangCode: "vi",
                GhiChu: GhiChu
            }
            nthisLoading.show();
            let res = await DuyenDonThoiViec(body)
            if (res.status == 1) {
                this.props.RemoveItemDuyet({ RowID: RowID })
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
        const { item, Data_CapDuyet, GhiChu, idtab, Data_ApprovingUser, checkAPI } = this.state
        var itemduyet = '';
        if (Data_CapDuyet && Data_CapDuyet.length > 0) {
            itemduyet = Data_CapDuyet[Data_CapDuyet.length - 1];
        }
        let NguoiDuyet = itemduyet.hoten ? itemduyet.hoten : ''
        let NgayDuyet = itemduyet.CheckedDate ? itemduyet.CheckedDate : false
        return (
            <View style={{ flex: 1, backgroundColor: colors.backgroudJeeHR, }}>
                <HeaderAnimationJee nthis={this} title={RootLang.lang.sckhac.chitietduyet} OnGoBack={this._goback} isGoBack={true} />
                <KeyboardAwareScrollView keyboardShouldPersistTaps='handled' style={{ flex: 1 }}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}>
                    {Data_ApprovingUser.length == 0 && checkAPI ?
                        <>
                            <View style={{ backgroundColor: item.IsDuyet != true ? colors.bgRed : colors.bgGreen, paddingHorizontal: 10, marginHorizontal: 10, marginTop: 10, paddingVertical: 15, flexDirection: 'row', borderRadius: 10 }}>
                                <Image source={item.IsDuyet ? Images.ImageJee.icBrowser : Images.ImageJee.icUnBrowser} />
                                <View style={{ alignSelf: 'center', paddingRight: 10 }}>
                                    {item.IsDuyet ?
                                        <Text style={{ fontSize: reText(12), color: colors.checkGreen, marginLeft: 5 }}>{`${RootLang.lang.thongbaochung.yeucauduocduyetvao} `}
                                            {NgayDuyet ? Utils.formatTimeAgo(moment(NgayDuyet), 1, true) : '--'} {RootLang.lang.thongbaochung.boi} <Text style={{ fontWeight: 'bold' }}>{NguoiDuyet}</Text>
                                        </Text>
                                        : <Text style={{ fontSize: reText(12), color: colors.checkCancle, marginLeft: 5 }}><Text style={{ fontWeight: 'bold' }}>{NguoiDuyet}</Text>{` ${RootLang.lang.thongbaochung.datuchoiyeucauvao} `}
                                            {NgayDuyet ? Utils.formatTimeAgo(moment(NgayDuyet), 1, true) : '--'}
                                        </Text>}

                                </View>
                            </View>
                        </> : null}
                    <View style={{ justifyContent: "center", alignItems: 'center', marginTop: 20 }}>
                        <Image source={{ uri: item.Avatar ? item.Avatar : '' }} style={{ width: 56, height: 56, borderRadius: 56 }} />
                        <Text style={styler.hoten}> {item.HoTen ? item.HoTen : '--'}</Text>
                        <Text style={styler.chucVu}> {item.TenChucDanh ? item.TenChucDanh : '--'}</Text>
                    </View>
                    <Text style={{ color: colors.colorTitleJee, fontSize: reText(14), paddingHorizontal: 20, marginTop: 20 }}>{RootLang.lang.thongbaochung.thongtindangky.toUpperCase()}</Text>

                    <View style={styler.khungtren}>

                        <View style={styler.khungdata}>
                            <Image source={Images.ImageJee.icProjectS} style={{ width: Width(5), height: Width(5), marginRight: Width(1) }} />
                            <Text style={styler.title}>{RootLang.lang.scduyettangca.hinhthuc}</Text>
                            <Text numberOfLines={1} style={[styler.noidung, { color: '#FF453B', fontWeight: 'bold' }]}>{RootLang.lang.scthoiviec.donthoiviec}</Text>
                        </View>

                        <View style={{ height: 0.5, backgroundColor: colors.colorLineJee, marginLeft: Width(7) }} />
                        <View style={styler.khungdata}>
                            <Image source={Images.ImageJee.icTimeJee} style={{ width: Width(5), height: Width(5), marginRight: Width(1) }} />
                            <Text style={styler.title}>{RootLang.lang.scthoiviec.ngaythoiviecdukien}</Text>
                            <Text numberOfLines={1} style={[styler.noidung, {}]}>{item && item?.NgayNghiDuKien && item?.NgayNghiDuKien != '' ? UtilsApp.convertDatetime(item?.NgayNghiDuKien, "", 'DD/MM/YYYY ') : "..."}</Text>
                        </View>

                        <View style={{ height: 0.5, backgroundColor: colors.colorLineJee, marginLeft: Width(7) }} />
                        <View style={styler.khungdata}>
                            <Image source={Images.ImageJee.icTimeJee} style={{ width: Width(5), height: Width(5), marginRight: Width(1) }} />
                            <Text style={styler.title}>{RootLang.lang.scduyettangca.ngaygui}</Text>
                            <Text numberOfLines={1} style={[styler.noidung, {}]}> {item?.NgayGui ? moment(item.NgayGui, 'YYYY-MM-DD HH:mm:ss').format("HH:mm ddd, DD/MM/YYYY") : "--"}</Text>
                        </View>

                        <View style={{ height: 0.5, backgroundColor: colors.colorLineJee, marginLeft: Width(7) }} />

                        <View style={styler.khungdata}>
                            <Image source={Images.ImageJee.icOClock} style={{ width: Width(5), height: Width(5), marginRight: Width(1) }} />
                            <Text style={[styler.title, {}]}>{RootLang.lang.scduyettangca.lydo}</Text>
                            {item.LyDo ?
                                <View style={{ maxWidth: Width(65) }}>
                                    <HTML
                                        source={{ html: '<div>' + String(item.LyDo).fixed() + '</div>' }}
                                        containerStyle={{ paddingHorizontal: 5, paddingVertical: 5 }}
                                        contentWidth={Width(50)}
                                        tagsStyles={{
                                            div: { fontSize: reText(14), color: colors.blackJee },
                                        }}
                                    />

                                </View> : <Text numberOfLines={1} style={[styler.noidung, {}]}>{'--'}</Text>
                            }
                        </View>
                    </View>
                    <>
                        <Text style={{ color: colors.colorTitleJee, fontSize: reText(14), paddingHorizontal: 20, marginTop: 20, marginBottom: 5 }}>{RootLang.lang.err.ghichu.toUpperCase()}</Text>
                        <View style={{ backgroundColor: colors.white, marginHorizontal: 10, borderRadius: 10, paddingVertical: 10 }}>
                            {item.Data_CapDuyet && item.Data_CapDuyet.length > 0 ?
                                <Text style={{ fontSize: reText(14), color: colors.blackJee, marginHorizontal: 10, paddingVertical: 5 }}>{item.Data_CapDuyet && item.Data_CapDuyet[0].CheckNote ? item.Data_CapDuyet[0].CheckNote : '--'}</Text> :
                                <TextInput
                                    placeholder={RootLang.lang.err.nhapghichu}
                                    multiline={true}
                                    textAlignVertical={"top"}
                                    value={this.state.textGChu}
                                    style={[nstyles.ntextinput, { maxHeight: nHeight(12), fontSize: reText(14), height: nHeight(12) }]}
                                    onChangeText={(text) => this.setState({ GhiChu: text })} />}

                        </View>
                    </>
                </KeyboardAwareScrollView>

                {
                    Data_ApprovingUser.length == 0 ?
                        <TouchableOpacity onPress={() => this.state.isGoBak == true ? Utils.goback(this) : Utils.goscreen(this, "sw_HomePage")} style={{ backgroundColor: colors.white, marginBottom: paddingBotX + 15, justifyContent: 'center', alignItems: 'center', borderRadius: 10, paddingVertical: 15, marginHorizontal: 10 }}>
                            <Text style={{ fontSize: reText(14), color: colors.checkAwait }}>{RootLang.lang.thongbaochung.dong}</Text>
                        </TouchableOpacity> :
                        <View style={{ flexDirection: 'row', marginBottom: paddingBotX + 15, justifyContent: 'space-between', marginHorizontal: 10, marginTop: 10, borderTopLeftRadius: 5, borderTopRightRadius: 5 }}>
                            <TouchableOpacity onPress={() => this._DuyetThoiViec(false)} style={{ width: Width(46.5), backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center', borderRadius: 10, paddingVertical: 15, }}>
                                <Text style={{ fontSize: reText(14), color: colors.checkAwait, fontWeight: 'bold' }}>{RootLang.lang.thongbaochung.tuchoi}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this._DuyetThoiViec(true)} style={{ width: Width(46.5), backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center', borderRadius: 10, paddingVertical: 15, }}>
                                <Text style={{ fontSize: reText(14), color: colors.checkGreen, fontWeight: 'bold' }}>{RootLang.lang.thongbaochung.duyet}</Text>
                            </TouchableOpacity>
                        </View>
                }
                <IsLoading />
            </View>
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
export default Utils.connectRedux(CT_ThoiViec, mapStateToProps, true)