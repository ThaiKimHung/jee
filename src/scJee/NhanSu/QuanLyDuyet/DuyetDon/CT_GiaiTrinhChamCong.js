import moment from 'moment'
import React, { Component } from 'react'
import { BackHandler, FlatList, Image, ScrollView, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native'
import { DuyetDanhGia, Duyet_CT, Get_ChiTietDGT } from '../../../../apis/giaitrinhchamcongapproval'
import { appConfig } from '../../../../app/Config'
import { RootLang } from '../../../../app/data/locales'
import { nGlobalKeys } from "../../../../app/keys/globalKey"
import Utils from '../../../../app/Utils'
import HeaderComStack from '../../../../components/HeaderComStack'
import IsLoading from '../../../../components/IsLoading'
import ListEmpty from '../../../../components/ListEmpty'
import { Images } from '../../../../images'
import { colors } from '../../../../styles'
import { reSize, reText } from '../../../../styles/size'
import { ButtomCustom, ItemLineText, ItemLineTextAva } from '../../../../Component_old/itemcom/itemcom';
import UtilsApp from '../../../../app/UtilsApp'
import { ROOTGlobal } from '../../../../app/data/dataGlobal'
import { Height, nstyles, Width, paddingBotX, nHeight, nwidth } from '../../../../styles/styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import HeaderAnimationJee from '../../../../components/HeaderAnimationJee'

export class CT_GiaiTrinhChamCong extends Component {
    constructor(props) {
        super(props);
        this.check = 'false'
        this.state = {
            dataList: [],
            LyDo: '',
            // RowID: Utils.ngetParam(this, "RowID", ''),
            isGoBak: Utils.ngetParam(this, "isGoBak", false),
            itemId: Utils.ngetParam(this, 'itemId', 0),
            idtab: Utils.ngetParam(this, 'idtab', 0),
            Data_CapDuyet: [],
            data: '',
            isChose: true,
            Data_ApprovingUse: {},
            checkAPI: false
        }
        this.DuyetAll = ''
    }
    _DuyetDanhGia = async (IsAccept) => {
        const { itemId, LyDo } = this.state;
        var body = {
            ID: itemId,
            IsAccept: IsAccept,
            GhiChu: LyDo,
        }
        if (IsAccept == false) {
            Utils.showMsgBoxYesNo(this, RootLang.lang.thongbaochung.thongbao, RootLang.lang.thongbaochung.hanhdonghoi2, RootLang.lang.thongbaochung.xacnhan, RootLang.lang.thongbaochung.thoat, async () => {
                nthisLoading.show();
                const res = await DuyetDanhGia(body)
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
            const res = await DuyetDanhGia(body)
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
    onPressDetail = (item) => {
        Utils.goscreen(this, 'Modal_CTChoDuyetGT', { Item: item, Enable: false })
    }
    _Get_ChiTietDGT = async () => {
        var { data, itemId } = this.state;
        nthisLoading.show()
        const res = await Get_ChiTietDGT(itemId);
        if (res.status == 1) {
            this.setState({
                data: res,
                dataList: res.data,
                Data_CapDuyet: res.Data_CapDuyet,
                Data_ApprovingUser: res.Data_ApprovingUser[0],
                checkAPI: true
            })
            nthisLoading.hide()
        } else {
            this.setState({ checkAPI: true })
            nthisLoading.hide()
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
        }
    }
    _DuyetCTGT = async (item) => {
        const { Data_ApprovingUser } = this.state;
        if (Data_ApprovingUser && Data_ApprovingUser.IsEnable_Duyet == true) {
            var body = { ID: item.RowID, IsAccept: !item.IsDuyet }
            const res = await Duyet_CT(body);
            if (res.status == 1) {
                this._Get_ChiTietDGT();
            } else {
                UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error : RootLang.lang.scduyetgiaitrinhchamcong.capnhatchitietthatbai, 2)
            }
        }
    }

    _onChose = () => {
        this.setState({ isChose: !this.state.isChose })
    }
    componentDidMount() {
        this.backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            this._backHandlerButton
        );
        this._Get_ChiTietDGT();
    }
    _backHandlerButton = () => {
        this._goback()
        return true
    }
    componentWillUnmount() {
        this.backHandler.remove();
    }
    _renderItem = ({ item, index }) => {
        const { data } = this.state
        return (
            <View style={{ flexDirection: 'row', marginHorizontal: 10, paddingHorizontal: 10, backgroundColor: colors.white, marginTop: 5, borderRadius: 10, paddingVertical: 15 }}>
                <TouchableOpacity onPress={() => this._DuyetCTGT(item)} style={{ width: Width(8) }}>
                    <Image
                        source={item.IsDuyet == true ? Images.ImageJee.icBrowser : Images.ImageJee.ic_ChoDuyet}
                        style={{}} />
                </TouchableOpacity>
                <TouchableOpacity style={{ flex: 1 }}
                    onPress={() => Utils.goscreen(this, 'Modal_CTGiaiTrinh', { data: this.state.dataList[index] })}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ color: colors.checkGreen, fontWeight: 'bold', fontSize: reText(14) }}>{moment(item.Ngay).format('ddd, DD/MM/YYYY')}</Text>
                        <Text style={{ fontSize: reText(14), color: colors.checkAwait, fontWeight: 'bold', flex: 1 }}> ({item.GioChamCongVao ? item.GioChamCongVao : '#'} {'-'} {item.GioChamCongRa ? item.GioChamCongRa : '#'})</Text>
                        <View style={{ flexDirection: 'row' }}>
                            {item.GioChamCongVao && !item.GioVaoDung ?
                                <Image source={Images.ImageJee.icClockJee} style={{ width: Width(5), height: Width(5), alignSelf: 'center' }} /> :
                                <Text style={{ fontSize: reText(14), color: colors.colorNoteJee, fontWeight: 'bold', alignSelf: 'center' }}>{item.GioVaoDung ? item.GioVaoDung : '#'}</Text>}
                            <Text style={{ fontSize: reText(14), color: colors.colorNoteJee, fontWeight: 'bold', alignSelf: 'center' }}>{' - '}</Text>
                            {item.GioChamCongRa && !item.GioRaDung ?
                                <Image source={Images.ImageJee.icClockJee} style={{ width: Width(5), height: Width(5), alignSelf: 'center' }} /> :
                                <Text style={{ fontSize: reText(14), color: colors.colorNoteJee, fontWeight: 'bold', alignSelf: 'center' }}>{item.GioRaDung ? item.GioRaDung : '#'}</Text>
                            }
                        </View>
                    </View>
                    <Text style={{ fontSize: reText(12), color: colors.colorNoteJee }}>{item.LyDo}</Text>
                </TouchableOpacity>
            </View >
        )
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
        var { dataList, LyDo, Data_CapDuyet, idtab, data, Data_ApprovingUser, checkAPI } = this.state
        var dem = 0;
        let NguoiDuyet = Data_CapDuyet[0] && Data_CapDuyet[0].hoten ? Data_CapDuyet[0] && Data_CapDuyet[0].hoten : "--"
        let NgayDuyet = Data_CapDuyet[0] ? Data_CapDuyet[0].CheckedDate : "--"
        for (let i = 0; i < dataList.length; i++) {
            if (dataList[i].IsDuyet == false) {
                this.check = 'false';
            }
            else {
                dem++;
            }
        }
        if (dem == dataList.length)
            this.check = 'true';
        return (
            <View style={{ flex: 1, backgroundColor: colors.backgroudJeeHR }}>
                <HeaderAnimationJee nthis={this} title={RootLang.lang.sckhac.chitietduyet} isGoBack={true} OnGoBack={this._goback} />
                <KeyboardAwareScrollView
                    style={{ flex: 1 }}
                    showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled'>
                    {!Data_ApprovingUser && checkAPI ?
                        <>
                            <View style={{ backgroundColor: data.IsDuyet != true ? colors.bgRed : colors.bgGreen, paddingHorizontal: 10, marginHorizontal: 10, marginTop: 10, paddingVertical: 15, flexDirection: 'row', borderRadius: 10 }}>
                                <Image source={data.IsDuyet ? Images.ImageJee.icBrowser : Images.ImageJee.icUnBrowser} />
                                <View style={{ alignSelf: 'center', paddingRight: 10 }}>
                                    {data.IsDuyet ?
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
                        <Image source={data.Image ? { uri: data.Image } : Images.icAva} style={{ width: 56, height: 56, borderRadius: 56 }} />
                        <Text style={styler.hoten}> {data.HoTen ? data.HoTen : '--'}</Text>
                        <Text style={styler.chucVu}> {data.ChucVu ? data.ChucVu : '--'}</Text>
                    </View>
                    <Text style={{ color: colors.colorTitleJee, fontSize: reText(14), paddingHorizontal: 20, marginTop: 20 }}>{RootLang.lang.thongbaochung.thongtindangky.toUpperCase()}</Text>
                    <View style={styler.khungtren}>
                        <View style={styler.khungdata}>
                            <Image source={Images.ImageJee.icProjectS} style={{ width: Width(5), height: Width(5), marginRight: Width(1) }} />
                            <Text style={styler.title}>{RootLang.lang.scduyettangca.hinhthuc}</Text>
                            <Text numberOfLines={1} style={[styler.noidung, { color: '#6844BA', fontWeight: 'bold' }]}>{RootLang.lang.scduyetgiaitrinhchamcong.giaitrinhchamcong + " " + moment(data.NgayGui).format('MM')}</Text>
                        </View>
                        <View style={{ height: 0.5, backgroundColor: colors.colorLineJee, marginLeft: Width(7) }} />
                        <View style={styler.khungdata}>
                            <Image source={Images.ImageJee.icTimeJee} style={{ width: Width(5), height: Width(5), marginRight: Width(1) }} />
                            <Text style={styler.title}>{RootLang.lang.scduyettangca.ngaygui}</Text>
                            <Text numberOfLines={1} style={[styler.noidung, {}]}> {data.NgayGui ? UtilsApp.convertTimeLocal(data.NgayGui, ' HH:mm ddd, DD/MM/YYYY') : "--"}</Text>
                        </View>

                    </View>

                    <Text style={{ color: colors.colorTitleJee, fontSize: reText(14), paddingHorizontal: 20, marginTop: 20 }}>{RootLang.lang.thongbaochung.thongtingiaitrinh.toUpperCase()}</Text>
                    <FlatList
                        style={{}}
                        data={dataList}
                        renderItem={this._renderItem}
                        ListEmptyComponent={<ListEmpty textempty={RootLang.lang.thongbaochung.khongcodulieu} />}
                        keyExtractor={(item, index) => index.toString()}
                    />
                    <>
                        <Text style={{ color: colors.colorTitleJee, fontSize: reText(14), paddingHorizontal: 20, marginTop: 20, marginBottom: 5 }}>{RootLang.lang.err.ghichu.toUpperCase()}</Text>
                        <View style={{ backgroundColor: colors.white, marginHorizontal: 10, borderRadius: 10, paddingVertical: 10, marginBottom: 20 }}>
                            {Data_CapDuyet && Data_CapDuyet.length > 0 ?
                                <Text style={{ fontSize: reText(14), color: colors.blackJee, marginHorizontal: 10, paddingVertical: 5 }}>{Data_CapDuyet && Data_CapDuyet[0].CheckNote ? Data_CapDuyet[0].CheckNote : '--'}</Text> :
                                <TextInput
                                    placeholder={RootLang.lang.err.nhapghichu}
                                    multiline={true}
                                    textAlignVertical={"top"}
                                    value={this.state.textGChu}
                                    style={[nstyles.ntextinput, { maxHeight: nHeight(12), fontSize: reText(14), height: nHeight(12) }]}
                                    onChangeText={(LyDo) => this.setState({ LyDo })} />}
                        </View>
                    </>
                </KeyboardAwareScrollView>
                {
                    !Data_ApprovingUser ?
                        <TouchableOpacity onPress={() => this.state.isGoBak == true ? Utils.goback(this) : Utils.goscreen(this, "sw_HomePage")} style={{ backgroundColor: colors.white, marginBottom: paddingBotX + 15, justifyContent: 'center', alignItems: 'center', borderRadius: 10, paddingVertical: 15, marginHorizontal: 10 }}>
                            <Text style={{ fontSize: reText(14), color: colors.checkAwait }}>{RootLang.lang.thongbaochung.dong}</Text>
                        </TouchableOpacity> :
                        <View style={{ flexDirection: 'row', marginBottom: paddingBotX + 15, justifyContent: 'space-between', marginHorizontal: 10, marginTop: 10, borderTopLeftRadius: 5, borderTopRightRadius: 5 }}>
                            <TouchableOpacity onPress={() => this._DuyetDanhGia(false)} style={{ width: Width(46.5), backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center', borderRadius: 10, paddingVertical: 15, }}>
                                <Text style={{ fontSize: reText(14), color: colors.checkAwait, fontWeight: 'bold' }}>{RootLang.lang.thongbaochung.tuchoi}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this._DuyetDanhGia(true)} style={{ width: Width(46.5), backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center', borderRadius: 10, paddingVertical: 15, }}>
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
        fontSize: reText(14), color: colors.colorNoteJee, flex: 1, marginTop: 2, marginLeft: 5,
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
export default Utils.connectRedux(CT_GiaiTrinhChamCong, mapStateToProps, true)