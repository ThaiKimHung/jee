import NetInfo from "@react-native-community/netinfo";
import moment from 'moment';
import React, { Component } from 'react';
import { FlatList, Image, Platform, ScrollView, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { isIphoneX } from "react-native-iphone-x-helper";
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import { CheckToken } from "../../apis/apiControllergeneral";
import { getDSChamCong } from '../../apis/apiTimesheets';
import { getTinNoiBat } from '../../apis/JeePlatform/Api_JeeSocial/apiJeeSocial';
import { Get_DSNhacNho } from "../../apis/JeePlatform/API_JeeWork/apilayout";
import { Get_MenuThuongDung } from "../../apis/JeePlatform/API_JeeWork/apiMenu";
import { ROOTGlobal } from '../../app/data/dataGlobal';
import { RootLang } from '../../app/data/locales';
import { nGlobalKeys } from '../../app/keys/globalKey';
import { nkey } from '../../app/keys/keyStore';
import Utils from '../../app/Utils';
import { Images } from '../../images';
import { colors } from '../../styles';
import { reText } from '../../styles/size';
import { nstyles, paddingTopMul, Width } from '../../styles/styles';
import Menu from './AllMenu/Menu';
import { objectMenuGlobal } from './AllMenu/MenuGlobal';
import ConnectSocket from '../Chat/WebSocket/Connecttion';
import dataComment from "../Chat/WebSocket/dataComment";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import Tooltip from 'react-native-walkthrough-tooltip';
import * as Animatable from 'react-native-animatable';
import { getDuLieuTongHop } from "../../apis/apiDuLieuChamCong";
import UtilsApp from '../../app/UtilsApp'


class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.IsChamCongWifi = false
        this.loaiChamCong = null
        this.state = {
            textSearch: '',
            selectedItems: {},
            ListNhacNho: [],
            ListMenuThuongDung: [],
            cavao: '',
            DSChiTiet: {},
            toDay: Utils.getGlobal(nGlobalKeys.TimeNow, '') ? moment(Utils.getGlobal(nGlobalKeys.TimeNow, '')).add(-7, "hours").format("DD/MM/YYYY") : moment(Date.now()).format("DD/MM/YYYY"),
            curTime: '',
            wifi: true,
            dataTinNoiBat: '',
            roleJeeHR: undefined,
            dataCongTac: [],
            dataDiLam: [],
            dataNghiPhep: [],
            dataDiTre: [],
            dataVang: [],
        };
        this.MenuThuongDung = []
        ROOTGlobal.GetMenuThuongDung.GetMenuTD = this._callback
        ROOTGlobal.GetSoLuongTongHop.GetSLTongHop = this._getDuLieuTongHop
        ROOTGlobal.GetSoLuongNhacNho.GetSLNhacNho = this._getDSNhacNho
        ROOTGlobal.GetTinNoiBat.GetTinnoiBat = this._getTinNoiBat
    }

    componentDidMount = async () => {
        let dataChamCong = Utils.getGlobal(nGlobalKeys.dataChamCong, {})
        this.setState({ DSChiTiet: dataChamCong ? dataChamCong : {}, cavao: dataChamCong?.vao ? dataChamCong.vao : '' })
        this.onLoadAndCheckAuth()
        this._getDSNhacNho()
        this._getDuLieuTongHop()
        let isConected = Utils.getGlobal(nGlobalKeys.isConnected, true);
        isConected && this.MenuThuongDung.length == 0 ? this._getDSMenu()
            : this.MenuThuongDung = await Utils.ngetStorage(nkey.menuThuongDung, [])
        this._getCongChiTiet()
        this._getTinNoiBat()
        setInterval(() => {
            this.setState({
                curTime: moment(Date()).format('HH : mm')
            })
            NetInfo.fetch("wifi").then(state => {
                if (state.isWifiEnabled == false) {
                    this.setState({ wifi: false })
                }
                else this.setState({ wifi: true })
            });
        }, 1000)
        this.avatar = await Utils.ngetStorage(nkey.avatar)
        let roleHR = await Utils.ngetStorage(nkey.roleJeeHR, false)
        this.setState({ roleJeeHR: roleHR })
        // await dataSocket.ChatMessage();
        // await dataPresence.Presence();
        await dataComment.Comment()
        ConnectSocket.initConnection();
    }

    _getDuLieuTongHop = async () => {
        let res = await getDuLieuTongHop(this.state.toDay);
        if (res.status == 1) {
            this.setState({
                dataCongTac: res.dataCongTac, dataDiLam: res.dataDiLam, dataDiLam: res.dataDiLam,
                dataNghiPhep: res.dataNghiPhep, dataTre: res.dataTre, dataVang: res.dataVang
            })
        }
    }

    openApp = (routerName = '') => {
        setTimeout(() => {
            // this.setStatusBar(false);
            Utils.goscreen(this, routerName);
        }, 500);
    }

    // setStatusBar = (val = true) => {
    //     StatusBar.setBarStyle('light-content', true)
    //     if (!isIphoneX()) {
    //         StatusBar.setHidden(val);
    //     }
    // }

    onLoadAndCheckAuth = async () => {
        let res = await CheckToken();
        if (res.status == 1) {
            // Utils.setGlobal(nGlobalKeys.loginToken, token);
            Utils.setGlobal(nGlobalKeys.allowRegister, res.allowRegister);
            Utils.setGlobal(nGlobalKeys.isCheckCapcha, res.isCheckCapcha);
            // Utils.setGlobal(nGlobalKeys.Id_nv, res.id);
            Utils.setGlobal(nGlobalKeys.IDKH_DPS, res.data);
            Utils.setGlobal(nGlobalKeys.TimeNow, res.DateNow);
            this.IsTongHopCong = res.IsTongHopCong
            Utils.setGlobal(nGlobalKeys.ThemNhanVien, res.IsThemNhanVien);
            // Utils.setGlobal(nGlobalKeys.IsQuetMaQR, res.IsQuetMaQR);
            // Utils.nsetStorage(nkey.shortcut, true)
            // Utils.nsetStorage(nkey.isWifi, res.IsChamCong_Wifi)
            this.IsChamCongWifi = res.IsChamCongWiFi
        }
        else {
            this.IsChamCongWifi = false
        }
    }

    _getDSNhacNho = async () => {
        let listnhacnho = await Utils.ngetStorage(nkey.listnhacnho, [])
        this.setState({ ListNhacNho: listnhacnho })
        const res = await Get_DSNhacNho();
        if (res.status == 1) {
            if (res.data == null) {
                this.setState({ ListNhacNho: [] })
                await Utils.nsetStorage(nkey.listnhacnho, [])
            } else {
                this.setState({ ListNhacNho: res.data })
                await Utils.nsetStorage(nkey.listnhacnho, res.data)
            }
        } else {
            this.setState({ ListNhacNho: [] })
            await Utils.nsetStorage(nkey.listnhacnho, [])
        }
    }

    _callback = async () => {
        await this.setState({
            ListMenuThuongDung: []
        })
        await this._getDSMenu()
    }
    _getDSMenu = async () => {
        let menu = await Utils.ngetStorage(nkey.menuThuongDung, [])
        this.setState({ ListMenuThuongDung: menu })
        const res = await Get_MenuThuongDung();
        if (res.status == 1) {
            let arrayMenu = []
            res.data.map(item => objectMenuGlobal.AllMenu.map(item2 => {
                if (item.RowID == item2.RowID) {
                    arrayMenu = arrayMenu.concat(item2)
                }
            }))
            if (JSON.stringify(arrayMenu) != JSON.stringify(menu)) {
                this.setState({ ListMenuThuongDung: arrayMenu })
                await Utils.nsetStorage(nkey.menuThuongDung, arrayMenu)
            }
        }
        else {
            await Utils.nsetStorage(nkey.menuThuongDung, [])
            this.setState({ ListMenuThuongDung: [] })
        }
    }
    _getTinNoiBat = async () => {
        let tinnoibat = await Utils.ngetStorage(nkey.tinnoibat, [])
        this.setState({ dataTinNoiBat: tinnoibat })
        const res = await getTinNoiBat()
        if (res.status == 1) {
            this.setState({ dataTinNoiBat: res.data[0] })
            await Utils.nsetStorage(nkey.tinnoibat, res.data[0])
        }
        // else {
        //     this.setState({ dataTinNoiBat: [] })
        //     await Utils.nsetStorage(nkey.tinnoibat, [])
        // }
    }

    _getCongChiTiet = async () => {
        this.loaiChamCong = await Utils.ngetStorage(nkey.loaiChamCong, null)
        this.GetChamCong()
        setTimeout(() => {
            this.GetChamCong()
        }, 2000)
    }

    GetChamCong = async () => {
        const { toDay } = this.state
        var val = `${toDay}|${toDay}`;
        var DSChiTiet = {}
        let res = await getDSChamCong(val, 1, 10);
        if (res.status == 1) {
            var { data = [] } = res;
            if (Array.isArray(data) && data.length > 0) {
                DSChiTiet = data[0]
                // await Utils.nsetStorage(nkey.dsChiTietCa, DSChiTiet)
                // await Utils.setGlobal(nGlobalKeys.giobatdau, data[0]?.GioBatDau);
                // await Utils.setGlobal(nGlobalKeys.gioketthuc, data[0]?.GioKetThuc);
            } else {
                DSChiTiet = {}
            }
        }
        this.setState({ DSChiTiet, cavao: DSChiTiet.vao })
    }

    _renderLoaiHinh = (loai) => {
        switch (loai) {
            case 101:
                return Images.ImageJee.icDNPCT
                break;
            case 102:
                return Images.ImageJee.icDKTC
                break;
            case 201:
                return Images.ImageJee.icYCCD
                break;
            case 401:
                return Images.ImageJee.icYCJRCD
                break;
            case 501:
                return Images.ImageJee.icNVPT
                break;
            case 502:
                return Images.ImageJee.icNVTD
                break;
            case 503:
                return Images.ImageJee.icCVPT
                break;
            case 802:
                return Images.ImageJee.icCVQH
                break;
            case 803:
                return Images.ImageJee.icVHHTN
                break;
            case 804:
                return Images.ImageJee.icDAQH
                break;
            default:
                break;
        }
    }
    _goScreen = (loai) => {
        switch (loai) {
            case 101://Hình thức nghỉ phép/công tác id:1
                Utils.goscreen(this, 'sc_QuanLyDuyet', { screen: 'sc_homeduyet' })
                // this.props.SetValueTypeDSDuyet(1);
                break;
            // case 102://Hình thức tăng ca
            //     Utils.goscreen(this, 'sc_QuanLyDuyet', { screen: 'sc_homeduyet' })
            //     this.props.SetValueTypeDSDuyet(12);
            //     break;
            case 201: //Văn phòng phẩm
                break;
            case 401: //Yêu cầu chờ duyệt
                Utils.goscreen(this, 'sc_DuyetYeuCau', { screen: 'sc_DSDuyetYeuCau' })
                // Utils.goscreen(this, 'sc_DuyetYeuCau', { screen: 'sc_DSDuyetYeuCau', params: { isTab: 1 } })
                break;
            case 501: //Nhiệm vụ phụ trách
                Utils.goscreen(this, 'sc_JeeWorkFlow', { screen: 'sc_JeeWorkFlow' })
                break;
            case 502: //Nhiệm vụ theo dõi
                // Utils.goscreen(this, 'sc_DuyetYeuCau')
                break;
            case 503: //công việc phụ trách
                Utils.goscreen(this, "ManHinh_CongViecCaNhan", { screen: "sc_CongViecCaNhan", params: { type: 1 } })
                break;
            case 802: //công việc quá hạn
                Utils.goscreen(this, "ManHinh_CongViecCaNhan", { screen: "sc_CongViecCaNhan", params: { type: 2 } })
                break;
            case 803: //Việc hết hạn trong ngày
                Utils.goscreen(this, "sc_CVHetHanTrongNgay", { screen: "sc_CVHetHanTrongNgay" })
                break;
            case 804: //Dự án quá hạn
                Utils.goscreen(this, "sc_QuanLyDuAnQuaHan")
                break;
        }
    }
    _ListNhacNho = ({ item, index }) => {
        return (
            <View style={{ backgroundColor: "white", marginTop: 10, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 15 }}>
                <TouchableOpacity onPress={() => this._goScreen(item.Loai)} style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <View style={{ flexDirection: "row" }}>
                        <Image source={this._renderLoaiHinh(item.Loai)} style={nstyles.nIcon24} resizeMode={'contain'} />
                        <Text style={{ fontWeight: '600', fontSize: 14, alignSelf: "center", marginLeft: 10, maxWidth: Width(65) }} numberOfLines={1}>{item.LoaiNhacNho ? item.LoaiNhacNho : "..."}</Text>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ flexDirection: "row" }}>
                            <View style={{
                                height: Width(7), width: Width(7), borderRadius: 99, backgroundColor: '#0BB7AF',
                                borderColor: colors.grey,
                                borderWidth: 0, justifyContent: "center", marginHorizontal: 3, marginRight: 10
                            }}>
                                <Text style={{ textAlign: "center", color: colors.white, fontWeight: '700', fontSize: 14 }}>{item.Soluong ? item.Soluong : 0}</Text>
                            </View>
                            <Image source={Images.ImageJee.icArrowBack} style={{ width: 5, height: 8, alignSelf: "center" }} />
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    _goChiTietChamcong = async (item) => {
        Utils.goscreen(this, 'Modal_ChamCong', {
            item: item
        });
    }

    render() {
        const {
            selectedItems, ListNhacNho, ListMenuThuongDung,
            cavao, DSChiTiet, toDay, curTime, wifi, dataTinNoiBat,
            dataCongTac, dataDiLam, dataVang, dataNghiPhep, dataDiTre
        } = this.state
        const colorCheckInOut = (cavao == "" || cavao == null) && (DSChiTiet.ra == "" || DSChiTiet.ra == null) ? colors.textTabActive : colors.colorOrangeMN
        return (

            <View style={[nstyles.ncontainer]}>
                <View style={{ flexDirection: "row", paddingTop: paddingTopMul + 8, backgroundColor: "white", paddingBottom: 10, }}  >
                    <TouchableOpacity
                        onPress={() => Utils.goscreen(this, 'sc_TimKiem')}
                        style={styles.khungTimKiemContainer}>
                        <View style={styles.khungTimKiem}>
                            <Text style={{ color: colors.gray1 }}>{RootLang.lang.sckhac.timkiem}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginLeft: 15, marginTop: 5 }} onPress={() => Utils.goscreen(this, "sc_Information", { screen: 'sc_Information' })}>
                        <Image source={this.avatar ? { uri: this.avatar } : Images.icAva} style={nstyles.nAva35}></Image>
                    </TouchableOpacity>
                </View>
                <ScrollView style={{
                    marginHorizontal: 10,
                    marginTop: 10,
                    flex: 1, nestedScrollEnabled: true,
                }} contentContainerStyle={{ flexGrow: 1 }} >
                    {
                        dataTinNoiBat && dataTinNoiBat.length != 0 ?
                            <TouchableOpacity onPress={() => Utils.goscreen(this, 'sc_ChiTietSocail', { tinnoibat: true })} style={{ backgroundColor: "white", borderRadius: 10, marginBottom: 10, paddingTop: 10 }}>
                                <View style={{ width: '100%' }}>
                                    <SwiperFlatList
                                        autoplay
                                        autoplayDelay={5}
                                        autoplayLoop
                                        showPagination
                                        style={{ paddingBottom: 5 }}
                                        paginationStyleItemActive={{ backgroundColor: '#219B3C' }}
                                        paginationStyleItem={{ height: 7, width: 7 }}
                                        data={dataTinNoiBat.Attachment}
                                        renderItem={({ item }) => {
                                            return (
                                                <TouchableOpacity onPress={() => Utils.goscreen(this, 'sc_ChiTietSocail', { tinnoibat: true })}>
                                                    <Image source={{ uri: item.hinhanh }} style={{ width: Width(95), height: 150, borderRadius: 0 }}></Image>
                                                </TouchableOpacity>
                                            )
                                        }}
                                    />
                                </View>
                                <View style={{ paddingHorizontal: 10 }}>
                                    <Text style={{ fontWeight: '600', fontSize: reText(16), marginBottom: 5 }} numberOfLines={2}>{dataTinNoiBat.title}</Text>
                                    <Text style={{ fontSize: reText(12), color: colors.black_50, fontStyle: 'italic', marginBottom: 10 }}>{dataTinNoiBat.CreatedDate ? UtilsApp.convertDatetime(dataTinNoiBat.CreatedDate, 'YYYY-MM-DD HH:mm', 'HH:mm, ddd DD-MM-YYYY') : 'HH:mm'}</Text>
                                    {/* <Text style={{ fontSize: 12, maxHeight: Width(20) }} numberOfLines={4}>{dataTinNoiBat?.NoiDung}</Text> */}
                                </View>
                            </TouchableOpacity>
                            : null
                        // <View style={{ backgroundColor: colors.white, padding: 10, borderRadius: 5, marginBottom: 10 }}>
                        //     <SkeletonPlaceholder>
                        //         <View style={{ width: Width(90), height: 150 }} />
                        //         <View style={{ width: Width(30), height: 8, marginTop: 10 }} />
                        //         <View style={{ width: Width(90), height: 10, marginTop: 10 }} />
                        //     </SkeletonPlaceholder>
                        // </View>
                    }
                    <View style={{ backgroundColor: "white", marginTop: 0, borderRadius: 10, paddingBottom: 20 }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 20 }}>
                            <Text style={{ fontWeight: '600', fontSize: 18 }}>{RootLang.lang.thongbaochung.ungdung}</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} onPress={() => Utils.goscreen(this, 'sc_AllMenu', { screen: 'CustomMenu' }, Utils.setGlobal("ListMenuThuongDung", ListMenuThuongDung))}>
                                    {/* <Image source={Images.ImageJee.icCheckPlusTwo} style={{ ...nstyles.nIcon15, resizeMode: 'contain' }} /> */}
                                    <Text style={{ fontSize: 14, paddingLeft: 10, color: colors.colorJeeNew.colorBlueHome }} >{RootLang.lang.thongbaochung.tuychinh}</Text>
                                </TouchableOpacity>
                                <View style={{ width: 10 }} />
                                <TouchableOpacity onPress={() => (
                                    Utils.setGlobal("ListMenuThuongDung", ListMenuThuongDung),
                                    Utils.goscreen(this, 'sc_AllMenu', { screen: 'sc_AllMenu', params: { quayve: this._callback } })
                                )}>
                                    <Text style={{ fontSize: 14, color: colors.black_70 }}>{RootLang.lang.thongbaochung.xemtatca}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Menu nthis={this} menu={this.MenuThuongDung.length > 0 ? this.MenuThuongDung : ListMenuThuongDung} />
                    </View>
                    {this.IsTongHopCong == true ?
                        <TouchableOpacity style={{ marginTop: 8, height: Width(15), flexDirection: "column", backgroundColor: "white", borderRadius: 10 }}
                            onPress={() => Utils.goscreen(this, 'sc_TongHopTrongNgay')}
                            onLongPress={() => { this.setState({ toolTipVisible: true }) }} >
                            <View style={{ flexDirection: "row", height: Width(15), marginHorizontal: 10, justifyContent: "space-between" }}>
                                <View style={{ flexDirection: "row", alignSelf: 'center' }}>
                                    <Text style={{ fontSize: reText(14), alignSelf: 'center', flex: 1 }}>{RootLang.lang.menu.tonghoptrongngay}</Text>
                                    <Tooltip
                                        contentStyle={{ width: Width(40) }}
                                        arrowSize={{ width: 25, height: 25 }}
                                        isVisible={this.state.toolTipVisible}
                                        content=
                                        {
                                            <Animatable.View animation={"fadeInRightBig"} >
                                                <View style={{ flexDirection: "column" }}>
                                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                        <View style={{
                                                            height: Width(7), width: Width(7), borderRadius: 99, backgroundColor: "#c42e3c", borderColor: colors.grey,
                                                            borderWidth: 0, justifyContent: "center", marginHorizontal: 3
                                                        }}>
                                                            <Text style={{ textAlign: "center", color: colors.white }}>{dataVang.length}</Text>
                                                        </View>
                                                        <Text style={{ textAlign: "left", paddingLeft: 5 }}>{RootLang.lang.scTongHopNgay.vang} </Text>
                                                    </View>

                                                    <View style={{ flexDirection: "row", paddingTop: 10, alignItems: "center" }}>
                                                        <View style={{
                                                            height: Width(7), width: Width(7), borderRadius: 99, backgroundColor: "#fbc248",
                                                            borderColor: colors.grey,
                                                            borderWidth: 0, justifyContent: "center", marginHorizontal: 3
                                                        }}>
                                                            <Text style={{ textAlign: "center", color: colors.white }}>{dataDiTre.length}</Text>
                                                        </View>
                                                        <Text style={{ textAlign: "left", paddingLeft: 5 }}> {RootLang.lang.scTongHopNgay.tre} </Text>
                                                    </View>
                                                    <View style={{ flexDirection: "row", paddingTop: 10, alignItems: "center" }}>
                                                        <View style={{
                                                            height: Width(7), width: Width(7), borderRadius: 99, backgroundColor: "#ed8c32",
                                                            borderColor: colors.grey,
                                                            borderWidth: 0, justifyContent: "center", marginHorizontal: 3
                                                        }}>
                                                            <Text style={{ textAlign: "center", color: colors.white }}>{dataNghiPhep.length}</Text>
                                                        </View>
                                                        <Text style={{ textAlign: "left", paddingLeft: 5 }}>{RootLang.lang.scTongHopNgay.nghiphep} </Text>
                                                    </View>
                                                    <View style={{ flexDirection: "row", paddingTop: 10, alignItems: "center" }}>
                                                        <View style={{
                                                            height: Width(7), width: Width(7), borderRadius: 99, backgroundColor: "#7cb54f",
                                                            borderColor: colors.grey,
                                                            borderWidth: 0, justifyContent: "center", marginHorizontal: 3
                                                        }}>
                                                            <Text style={{ textAlign: "center", color: colors.white }}>{dataCongTac.length}</Text>
                                                        </View>
                                                        <Text style={{ textAlign: "left", paddingLeft: 5 }}>{RootLang.lang.scTongHopNgay.congtac} </Text>
                                                    </View>
                                                    <View style={{ flexDirection: "row", paddingVertical: 10, alignItems: "center" }}>
                                                        <View style={{
                                                            height: Width(7), width: Width(7), borderRadius: 99, backgroundColor: "#197eb8",
                                                            borderColor: colors.grey,
                                                            borderWidth: 0, justifyContent: "center", marginHorizontal: 3
                                                        }}>
                                                            <Text style={{ textAlign: "center", color: colors.white }}>{dataDiLam.length}</Text>
                                                        </View>
                                                        <Text style={{ textAlign: "left", paddingLeft: 5 }}>{RootLang.lang.scTongHopNgay.dilam} </Text>
                                                    </View>

                                                </View>
                                            </Animatable.View>
                                        }
                                        placement="left"
                                        onClose={() => this.setState({ toolTipVisible: false })}
                                    >
                                        <View style={{ flexDirection: "row", }}>

                                            <View style={{
                                                height: Width(7), width: Width(7), borderRadius: 99, backgroundColor: "#c42e3c", borderColor: colors.grey,
                                                borderWidth: 0, justifyContent: "center", marginHorizontal: 3
                                            }}>
                                                <Text style={{ textAlign: "center", color: colors.white }}>{dataVang.length}</Text>
                                            </View>
                                            <View style={{
                                                height: Width(7), width: Width(7), borderRadius: 99, backgroundColor: "#fbc248",
                                                borderColor: colors.grey,
                                                borderWidth: 0, justifyContent: "center", marginHorizontal: 3
                                            }}>
                                                <Text style={{ textAlign: "center", color: colors.white }}>{dataDiTre.length}</Text>
                                            </View>
                                            <View style={{
                                                height: Width(7), width: Width(7), borderRadius: 99, backgroundColor: "#ed8c32",
                                                borderColor: colors.grey,
                                                borderWidth: 0, justifyContent: "center", marginHorizontal: 3
                                            }}>
                                                <Text style={{ textAlign: "center", color: colors.white }}>{dataNghiPhep.length}</Text>
                                            </View>
                                            <View style={{
                                                height: Width(7), width: Width(7), borderRadius: 99, backgroundColor: "#7cb54f",
                                                borderColor: colors.grey,
                                                borderWidth: 0, justifyContent: "center", marginHorizontal: 3
                                            }}>
                                                <Text style={{ textAlign: "center", color: colors.white }}>{dataCongTac.length}</Text>
                                            </View>
                                            <View style={{
                                                height: Width(7), width: Width(7), borderRadius: 99, backgroundColor: "#197eb8",
                                                borderColor: colors.grey,
                                                borderWidth: 0, justifyContent: "center", marginHorizontal: 3
                                            }}>
                                                <Text style={{ textAlign: "center", color: colors.white }}>{dataDiLam.length}</Text>
                                            </View>
                                        </View>

                                    </Tooltip>
                                </View>
                            </View>
                        </TouchableOpacity>
                        : null}
                    {this.state.roleJeeHR == true ?
                        <View style={{ marginTop: 10, flexDirection: "column", backgroundColor: "white", borderRadius: 10, paddingVertical: 20 }}>
                            <View style={{ flex: 1, flexDirection: "row", paddingBottom: 10, marginHorizontal: 10, justifyContent: "space-between" }}>
                                <View style={{ flexDirection: "row" }}>
                                    <Text style={{ fontSize: reText(15), color: colors.black_70 }}>{RootLang.lang.menu.chamcong}:</Text>
                                    <Text style={{ fontSize: reText(14), alignSelf: 'center', fontWeight: "bold", marginLeft: 5 }}>{toDay}</Text>
                                </View>
                                <View style={{ flexDirection: "row", alignSelf: 'center' }}>
                                    {/* <Text style={{ color: colors.textTabActive, fontSize: reText(16), fontWeight: "bold" }}>{cavao ? cavao : '  '} - {DSChiTiet.ra ? DSChiTiet.ra : '  '}</Text> */}
                                    {DSChiTiet.TenCa ?
                                        <Text style={{ color: colors.textTabActive, fontSize: isIphoneX() ? reText(14) : reText(16), fontWeight: "bold", alignSelf: 'center' }}>{DSChiTiet.TenCa + " " + DSChiTiet.GioBatDau + " - " + DSChiTiet.GioKetThuc}</Text> :
                                        <SkeletonPlaceholder>
                                            <View style={{ width: Width(30), height: Width(3), borderRadius: 3 }} />
                                        </SkeletonPlaceholder>}
                                </View>
                            </View>
                            {/* <Text style={{ flex: 1, marginHorizontal: 10, color: colors.black_20_2, paddingBottom: 10 }}>{DSChiTiet.TenCa ? DSChiTiet.TenCa + " " + DSChiTiet.GioBatDau + " - " + DSChiTiet.GioKetThuc : "----"}</Text> */}
                            <View style={{ flex: 1, flexDirection: "row" }}>

                                <TouchableOpacity
                                    onPress={() => this._goChiTietChamcong(DSChiTiet)} style={{ width: "33%", height: Width(15), flexDirection: "row", marginLeft: 10, borderRadius: 5, borderWidth: 1, borderColor: colorCheckInOut }}>
                                    <Text style={{ flex: 1, alignSelf: "center", textAlign: "center", color: colorCheckInOut, fontSize: reText(15), fontWeight: "bold" }}>{cavao ? cavao : ''} - {DSChiTiet.ra ? DSChiTiet.ra : ''}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={{ width: "60%", backgroundColor: colorCheckInOut, height: Width(15), flexDirection: "row", marginLeft: 10, borderRadius: 5 }}
                                    onPress={() => {
                                        this.IsChamCongWifi == false ?
                                            Utils.goscreen(this, 'sc_ChamCongCamera', { isMode: 1, CapNhatLaiDuLieu: this._getCongChiTiet }) :
                                            this.loaiChamCong == null ?
                                                Utils.showMsgBoxYesNoVerImg(this, (cavao == "" || cavao == null) && (DSChiTiet.ra == "" || DSChiTiet.ra == null) ? "Check in" : "Check out"
                                                    , RootLang.lang.menu.xacnhnachamcong, RootLang.lang.menu.vitri, "Wifi", Images.icViTriMenu, Images.icWifiMenu
                                                    , () => { Utils.nsetStorage(nkey.loaiChamCong, 'sc_ChamCongCamera'), Utils.goscreen(this, 'sc_ChamCongCamera', { isMode: 1, CapNhatLaiDuLieu: this._getCongChiTiet }) }
                                                    , () => { Utils.nsetStorage(nkey.loaiChamCong, 'sc_ChamCongWifi'), Utils.goscreen(this, "sc_ChamCongWifi", { CapNhatLaiDuLieu: this._getCongChiTiet }) }, false, true, wifi == true ? false : true)
                                                :
                                                this.loaiChamCong == 'sc_ChamCongCamera' ?
                                                    Utils.goscreen(this, 'sc_ChamCongCamera', { isMode: 1, CapNhatLaiDuLieu: this._getCongChiTiet })
                                                    :
                                                    Utils.goscreen(this, "sc_ChamCongWifi", { CapNhatLaiDuLieu: this._getCongChiTiet })
                                    }}
                                    onLongPress={() =>
                                        this.IsChamCongWifi == false ?
                                            Utils.goscreen(this, 'sc_ChamCongCamera', { isMode: 1, CapNhatLaiDuLieu: this._getCongChiTiet }) :
                                            Utils.showMsgBoxYesNoVerImg(this, (cavao == "" || cavao == null) && (DSChiTiet.ra == "" || DSChiTiet.ra == null) ? "CHECK IN" : "CHECK OUT"
                                                , RootLang.lang.menu.xacnhnachamcong, RootLang.lang.menu.vitri, "Wifi", Images.icViTriMenu, Images.icWifiMenu
                                                , () => { Utils.nsetStorage(nkey.loaiChamCong, 'sc_ChamCongCamera'), Utils.goscreen(this, 'sc_ChamCongCamera', { isMode: 1, CapNhatLaiDuLieu: this._getCongChiTiet }) }
                                                , () => { Utils.nsetStorage(nkey.loaiChamCong, 'sc_ChamCongWifi'), Utils.goscreen(this, "sc_ChamCongWifi", { CapNhatLaiDuLieu: this._getCongChiTiet }) }
                                                , false, true, wifi == true ? false : true)
                                    }
                                >

                                    <Image
                                        style={[{ alignSelf: 'center', marginHorizontal: 20, width: Width(5), height: Width(5) }]}
                                        source={this.loaiChamCong == 'sc_ChamCongWifi' && this.IsChamCongWifi == true ? Images.icWifiMenu : Images.icCameraMenu}
                                        resizeMode={'contain'} />
                                    <Text style={{ fontWeight: "bold", alignSelf: 'center', color: "white", fontSize: reText(15) }}>{(cavao == "" || cavao == null) && (DSChiTiet.ra == "" || DSChiTiet.ra == null) ? "Check in" : "Check out"}</Text>
                                    <Text style={{ marginHorizontal: 15, alignSelf: 'center', alignItems: "flex-end", fontWeight: "bold", color: "white", fontSize: isIphoneX() ? reText(16) : reText(18) }}>{curTime}</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                        : null}
                    <FlatList
                        data={ListNhacNho}
                        renderItem={this._ListNhacNho}
                        keyExtractor={(item, index) => index.toString()}
                        style={{ paddingBottom: ListNhacNho ? 10 : 0 }}
                    />
                </ScrollView>
            </View >
        );
    }
};

export const styles = StyleSheet.create({
    khungTimKiemContainer: {
        height: 45, width: "80%", marginLeft: 10, justifyContent: 'center'
    },
    khungTimKiem: {
        borderWidth: 0.3, padding: 8, justifyContent: 'center', borderColor: '#bbb', borderRadius: 16
    },
})

const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(HomeScreen, mapStateToProps, true)

