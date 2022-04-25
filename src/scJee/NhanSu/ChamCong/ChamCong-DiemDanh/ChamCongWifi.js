import NetInfo from "@react-native-community/netinfo";
import moment from 'moment';
import React, { Component, createRef } from 'react';
import {
    BackHandler, Image, Linking, PermissionsAndroid, Platform, ScrollView, StyleSheet,
    Text,
    TouchableOpacity, View
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { openSettings } from 'react-native-permissions';
import { Permission, PERMISSION_TYPE } from '../../../../../AppPermission';
import { getDSChamCong } from '../../../../apis/apiTimesheets';
import { checkInOutWifi, getAutoTimekeeping, GetListChamCongInWifi, updateDeviceToken } from '../../../../apis/apiUser';
import { appConfig } from '../../../../app/Config';
import { RootLang } from '../../../../app/data/locales';
import { nGlobalKeys } from "../../../../app/keys/globalKey";
import { nkey } from '../../../../app/keys/keyStore';
import Utils from '../../../../app/Utils';
import ButtonCom from "../../../../components/Button/ButtonCom";
import HeaderComStack from '../../../../components/HeaderComStack';
import HeaderAnimationJee from "../../../../components/HeaderAnimationJee";
import IsLoading from '../../../../components/IsLoading';
import { Images } from '../../../../images';
import { colors, fonts, sizes } from '../../../../styles';
import { reText } from '../../../../styles/size';
import { Height, Width, paddingBotX } from '../../../../styles/styles';
import { ItemChiTietComSize14, TouchTime } from '../../../Component/itemcom/itemcom';
var _ = require('lodash');
import ActionSheet from "react-native-actions-sheet";
import { ROOTGlobal } from "../../../../app/data/dataGlobal";
import UtilsApp from "../../../../app/UtilsApp";


const actionSheetRef = createRef();

const Permissions = require('react-native-permissions');

class ChamCongWifi extends Component {
    constructor(props) {
        super(props);
        this.granted = '';
        this.Timeout = 0
        this.CapNhatLaiDuLieu = Utils.ngetParam(this, 'CapNhatLaiDuLieu', () => { })
        this.Shorcut_ChuyenVao = Utils.ngetParam(this, 'Shorcut_ChuyenVao');
        this.state = {
            isCheck: true,
            Visible: false,
            date: moment(new Date()).format('DD/MM/YYYY'),
            dateTimeF: '',
            dateTimeT: '',
            DSChiTiet: {},
            isChechIn: true,
            isCheckOut: true,
            IsShowRe_Regi: false,
            IsShowRegi: false,
            wifi: true,
            tenwifi: "",
            bssid: "",
            location: false,
            wifiIsEnabled: "",
            refreshing: false,
            DataDSChiTiet: [],
            deviceToken: "",
            deviceTokenHT: "",
            ListChamCongRa: [],
            ListChamCongVao: [],
            ListChamCong: [],
            ListChamCongFull: [],
            timer: 5,
            toDay: Utils.getGlobal(nGlobalKeys.TimeNow, '') ? moment(Utils.getGlobal(nGlobalKeys.TimeNow, '')).add(-7, "hours").format("DD/MM/YYYY") : moment(Date.now()).format("DD/MM/YYYY"),
        };

    }

    async componentDidUpdate() {

        if (this.state.timer <= 0) {
            Utils.setGlobal(nGlobalKeys.checkCCWifi, false)
            BackHandler.exitApp()
        }
        else {
            null
        }
    }

    componentDidMount = async () => {
        this.backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            this.backAction
        );
        this.setState({ deviceTokenHT: await Utils.ngetStorage(nkey.userId_OneSignal, '') })
        await this._getCongChiTiet();
        await this._getConfig();
        Platform.OS == 'ios' ? await Permissions.request('ios.permission.LOCATION_WHEN_IN_USE').then(async res => {
            if (res == "blocked") {
                this.setState({ wifi: false })
                this.onGoSeting()
            }
            else {
                await this.kiemTraQuyenViTri()
            }

        }) : await this.kiemTraQuyenViTri()
        // this._GetListChamCongInWifi()
        Utils.getGlobal(nGlobalKeys.checkCCWifi, false) === true ? this._onPressChamCong() : null

    }

    backAction = () => {
        // ROOTGlobal.GetDuLieuChamCong.GetDLCC()
        this.CapNhatLaiDuLieu()
    };


    componentWillUnmount() {
        this.backHandler.remove();
    }

    onGoSeting = () => {
        this.granted = 'off';
        Utils.showMsgBoxYesNo(this, RootLang.lang.scchamcong.dichvuvitribitat, appConfig.TenAppHome + ' ' + RootLang.lang.scchamcong.cantruycapvitri_dienthoaicuaban,
            RootLang.lang.scchamcong.chuyentoicaidat, RootLang.lang.scchamcong.khongcamon,
            () => {
                if (Platform.OS == 'ios') {
                    Linking.openURL('app-settings:').catch((err) => {
                        Utils.nlog('app-settings:', err);
                    });
                }
                else
                    openSettings();
            });
    }


    checkWifi = async () => {
        nthisLoading.show();
        if (this.state.location == true) {
            NetInfo.fetch("wifi").then(state => {
                if (state.isWifiEnabled == false) {
                    this.setState({ wifi: false })
                    nthisLoading.hide();
                    this.Shorcut_ChuyenVao == true ? Utils.showMsgBoxOKScreen(this, RootLang.lang.thongbaochung.thongbao, RootLang.lang.scchamcongwifi.thongbaowifi, "OK",
                        () => { Utils.goscreen(this, "sw_HomePage", null) }) :
                        Utils.showMsgBoxOK(this, RootLang.lang.thongbaochung.thongbao, RootLang.lang.scchamcongwifi.thongbaowifi, "OK",
                            () => { Utils.goscreen(this, "sw_HomePage", null) })
                }
                else {
                    nthisLoading.hide();
                    this.setState({ wifi: true })
                    this.setState({ tenwifi: state.details.ssid, bssid: state.details.bssid })
                }

            });
        }
        if (this.state.location == false) {
            nthisLoading.hide();
            if (Platform.OS == 'ios') {
                Linking.openURL('app-settings:').catch((err) => {
                    Utils.nlog('app-settings:', err);
                });
            }
            else
                openSettings();
        }
    }

    kiemTraQuyenViTri = async () => {
        Geolocation.setRNConfiguration({ skipPermissionRequests: true, authorizationLevel: 'whenInUse' });
        Geolocation.requestAuthorization();
        if (Platform.OS == 'android') {
            this.granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
                title: RootLang.lang.scchamcong.cungcapvitri,
                message: RootLang.lang.scchamcongwifi.thongbaowifi,
                buttonPositive: 'OK'
            })
            if (this.granted == 'never_ask_again') {
                setTimeout(() => {
                    this.onGoSeting();
                }, 1100);
            }
            if (this.granted == PermissionsAndroid.RESULTS.GRANTED) {
                this.setState({ location: true }, async () => { await this.checkWifi() })


            } else {
                this.granted = 'off';
                this.setState({ location: false, wifi: false })

            }
            Utils.nlog('this.granted:', this.granted);
        }
        else {
            Geolocation.getCurrentPosition(
                async (position) => {
                    var { coords = {} } = position;
                    var { latitude, longitude } = coords;
                    if (!latitude || !longitude) {
                        this.latlongLocation = '';
                    } else {
                        nthisLoading.hide(),
                            this.setState({
                                location: true
                            }, async () => { await this.checkWifi() }
                            )
                    }
                },
                (error) => {
                    this.onGoSeting();
                    this.setState({ location: false, wifi: false })
                    Utils.nlog('error:', error);
                },
            );
        }
    }


    onGoSetingCamera = () => {
        Utils.showMsgBoxYesNo(this, RootLang.lang.scchamcong.xinquyencamera, RootLang.lang.scchamcong.chophepsudungcamera,
            RootLang.lang.scchamcong.chuyentoicaidat, RootLang.lang.scchamcong.khongcamon,
            async () => {
                if (Platform.OS == 'ios') {
                    Linking.openURL('app-settings:').catch((err) => {
                        Utils.nlog('app-settings:', err);
                    });
                }
                else
                    openSettings();
            })
    }
    _getCongChiTiet = async () => {
        nthisLoading.show();
        let date = moment(new Date).format('DD/MM/YYYY');
        var DSChiTiet = {}
        var val = `${date}|${date}`;
        let res = await getDSChamCong(val, 1, 10);
        if (res.status == 1) {
            nthisLoading.hide();
            var { data = [] } = res;
            if (Array.isArray(data) && data.length > 0) {
                DSChiTiet = data[0]
            } else {
                DSChiTiet = {}
            }
        }
        else {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res && res.message ? res.message : RootLang.lang.thongbaochung.khongcodulieu, 2)
            nthisLoading.hide();
        }
        this.setState({ DSChiTiet, cavao: DSChiTiet.vao })

    }

    _GetListChamCongInWifi = async () => {
        nthisLoading.show();
        let res = await GetListChamCongInWifi(this.state.toDay);
        if (res.status == 1) {
            nthisLoading.hide();
            this.setState({
                ListChamCongFull: res.dt_checkinout
            })
            for (let i = 0; i <= this.state.ListChamCongFull.length; i++) {
                if (i % 2 == 0) {
                    this.setState({
                        ListChamCong: res.dt_checkinout[i],
                        ListChamCongVao: this.state.ListChamCongVao.concat(this.state.ListChamCong)
                    })
                }
                else {
                    this.setState({
                        ListChamCong: res.dt_checkinout[i],
                        ListChamCongRa: this.state.ListChamCongRa.concat(this.state.ListChamCong)
                    })
                }
            }
        }
        else {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res && res.message ? res.message : RootLang.lang.thongbaochung.khongcodulieu, 2)
            nthisLoading.hide();
        }

    }
    _getConfig = async () => {
        let res = await getAutoTimekeeping();
        if (res.status == 1) {
            this.setState({ Visible: res.IsAutoTimekeeping, IsShowRegi: res.IsShowRegi, IsShowRe_Regi: res.IsShowRe_Regi, deviceToken: res.DeviceToken })
        }
        else {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.thuchienthatbai, 2)
        }
    }


    _onPressChamCong = () => {
        Permission.checkPermisstion(PERMISSION_TYPE.location).then(result => {
            if (result == true) {
                NetInfo.fetch("wifi").then(state => {
                    this._checkInOutWifi(state.details.bssid);
                });
            }
            else this.setState({
                wifi: false
            })
        })

    }

    // BackHandler.exitApp())




    _checkInOutWifi = async (bssid = '') => {
        this.Timeout = Utils.getGlobal(nGlobalKeys.checkCCWifi, false) == false ? null : setInterval(() => { this.setState({ timer: --this.state.timer }) }, 1000);
        let res = await checkInOutWifi(bssid);
        // Utils.nlog("gia trị check wifi", res);
        if (res.status == 1) {
            if (Utils.getGlobal(nGlobalKeys.checkCCWifi, false) == false) {
                UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.thongbaochung.thuchienthanhcong, 1)
                await this._getCongChiTiet()
                Utils.setGlobal(nGlobalKeys.checkCCWifi, false)
                Utils.goback(this)
                this.CapNhatLaiDuLieu()
            } else {
                actionSheetRef.current?.show();
            }
        } else {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.thuchienthatbai, 2)
        }
    }

    _updateDeviceToken = async () => {
        let devicetoken = await Utils.ngetStorage(nkey.userId_OneSignal, '');
        if (devicetoken != '') {
            let res = await updateDeviceToken(devicetoken);
            if (res.status == 1) {
                UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.thongbaochung.thuchienthanhcong, 1)
                this._getConfig()
            } else {
                UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.thuchienthatbai, 2)
            }
        }

    }
    _onRefresh = () => {
        this.setState({ refreshing: true }, this._getCongChiTiet);
    }

    _renderItemDSChiTiet = ({ item, index }) => {
        let loai1 = item[0] ? item[0].Loai ? item[0].Loai == 1 ? RootLang.lang.scchamcongwifi.vitri ? item[0].Loai == 2 ? "Wifi" ? item[0].Loai == null ? RootLang.lang.scchamcongwifi.maychamcong : null : null : null : null : null : null : null
        let loai2 = item[1] ? item[1].Loai ? item[1].Loai == 1 ? RootLang.lang.scchamcongwifi.vitri ? item[1].Loai == 2 ? "Wifi" ? item[1].Loai == null ? RootLang.lang.scchamcongwifi.maychamcong : null : null : null : null : null : null : null
        return (
            <View style={{ flex: 1, marginVertical: 10, flexDirection: "column", backgroundColor: "white", }} >
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignContent: "space-between", alignItems: "center", marginHorizontal: 10, marginVertical: 10 }}>
                    <View style={{ flexDirection: "column" }}>
                        <Text style={{ marginBottom: 10 }}>{index + 1}. {RootLang.lang.scchamcongwifi.vao} - {RootLang.lang.scchamcongwifi.ra}</Text>
                        <Text>{RootLang.lang.scchamcongwifi.loai}:
                            {loai1} - {loai2} </Text>

                    </View>
                    <Text style={{ fontSize: reText(14), color: "#1863AD", fontWeight: "bold" }}>
                        {item[0] ? moment(item[0].Ngay).format("HH:mm") : null} - {item[1] ? moment(item[1].Ngay).format("HH:mm") : null}
                    </Text>
                </View>
            </View >
        )
    }

    render() {
        const { deviceTokenHT, deviceToken,
            tenwifi, bssid, wifi, cavao,
            DSChiTiet } = this.state
        return (
            <View style={[{ flex: 1, backgroundColor: colors.backgroundColor }]}>
                <HeaderAnimationJee
                    nthis={this}
                    title={RootLang.lang.scchamcongwifi.title}
                    onPressLeft={() => {
                        this.CapNhatLaiDuLieu()
                        this.Shorcut_ChuyenVao == true ? Utils.goscreen(this, "sw_HomePage") : Utils.goback(this, null)
                        Utils.setGlobal(nGlobalKeys.checkCCWifi, false)
                    }}
                />
                <ScrollView style={{ padding: 10 }}>
                    {
                        deviceToken != deviceTokenHT || deviceToken == '' || deviceToken == null ?
                            <View style={{
                                marginVertical: 5,
                                paddingVertical: 10,
                                paddingHorizontal: 10,
                            }}>
                                <TouchableOpacity onPress={this._updateDeviceToken} style={{
                                    backgroundColor: colors.textTabActive, alignItems: 'center',
                                    justifyContent: 'center', paddingVertical: 10, borderRadius: 10
                                }}>
                                    <Text style={{ color: colors.white, fontSize: sizes.sizes.sText14 }}>{deviceToken == '' || deviceToken == null ? RootLang.lang.scchamcongwifi.dangkylaithietbi : RootLang.lang.scchamcongwifi.dangkythietbi}</Text>
                                </TouchableOpacity>
                            </View> : null
                    }
                    <Text style={{ color: colors.colorTitleJee, fontSize: reText(14), marginTop: 5, marginHorizontal: 10 }}>{RootLang.lang.scbangcong.caLamViec.toUpperCase()}</Text>
                    <View style={{ flex: 1, marginVertical: 5, flexDirection: "column", backgroundColor: "white", borderRadius: 10 }} >
                        <View style={{ flexDirection: "row", marginHorizontal: 10, paddingVertical: 10, justifyContent: "space-between" }}>
                            <Text style={{ fontSize: reText(14), alignSelf: 'center', color: colors.grayText }}>{RootLang.lang.scbangcong.caLamViec}</Text>
                            <Text style={{ fontSize: reText(14), alignSelf: 'center', color: colors.grey }}>{DSChiTiet.TenCa ? DSChiTiet.TenCa + " " + DSChiTiet.GioBatDau + " - " + DSChiTiet.GioKetThuc : " "}</Text>
                        </View>
                    </View>

                    <Text style={{ color: colors.colorTitleJee, fontSize: reText(14), marginTop: 5, marginHorizontal: 10 }}>{RootLang.lang.scbangcong.ketnoiinternet.toUpperCase()}</Text>

                    <View style={{ flex: 1, marginVertical: 10, flexDirection: "column", backgroundColor: "white", borderRadius: 10, paddingVertical: 10 }} >
                        <View style={{ flexDirection: "row", marginHorizontal: 10, justifyContent: "space-between" }}>
                            <View style={{ flexDirection: "row" }}>
                                <Image
                                    style={[{ alignSelf: 'center', marginHorizontal: 5, width: Width(5), height: Width(5) }]}
                                    source={wifi == false ? Images.UncheckNew : Images.checkNew}
                                    resizeMode={'contain'} />
                                <Text style={{ fontSize: reText(14), alignSelf: 'center', fontWeight: "bold" }}>{RootLang.lang.scchamcongwifi.ketnoiwifi}</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => { this.kiemTraQuyenViTri() }}
                                style={{ marginRight: 10, paddingHorizontal: 10 }}>
                                <Image source={wifi == false ? Images.icReload : null}
                                    style={{ width: Width(6), height: Width(6), padding: 10, }}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={{
                            flex: 1,
                            backgroundColor: colors.white,
                            marginHorizontal: 15,
                        }}>
                            <ItemChiTietComSize14 title={RootLang.lang.scchamcongwifi.tenwifi}
                                value={tenwifi} styleContent={{ paddingVertical: 5 }} />
                            <ItemChiTietComSize14 title={"bssid"}
                                value={bssid} styleContent={{ paddingVertical: 5 }} />
                        </View>
                    </View>

                    {/* {DSChiTiet.vao == '' || DSChiTiet.vao == null ? null :
                        <View style={{ paddingBottom: 30 }}>
                            <Text style={{ color: colors.grey, fontSize: reText(12), marginTop: 5 }}>{RootLang.lang.menu.chamcong}</Text>

                            <View style={{ flex: 1, marginVertical: 5, flexDirection: "column", backgroundColor: "white", }} >
                                <FlatList
                                    data={_.zip(this.state.ListChamCongRa, this.state.ListChamCongVao)}
                                    ListEmptyComponent={() => {
                                        return (
                                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                <Image source={Images.icListEmpty} style={{ width: sizes.nImgSize200, height: sizes.nImgSize200 }} resizeMode={'cover'} />
                                                <Text style={{ fontSize: sizes.sText16, color: colors.brownGreyTwo }}>{RootLang.lang.thongbaochung.khongcodulieu}</Text>
                                            </View>
                                        )
                                    }}
                                    refreshing={this.state.refreshing}
                                    style={{ width: '100%', }}
                                    onRefresh={this._onRefresh}
                                    renderItem={this._renderItemDSChiTiet}
                                    showsVerticalScrollIndicator={false}
                                    onEndReachedThreshold={0.2}
                                    keyExtractor={(item, index) => index.toString()} />
                            </View>
                        </View>
                    } */}
                    <IsLoading />
                </ScrollView>

                <ActionSheet ref={actionSheetRef}>

                    <Text style={{
                        textAlign: 'center',
                        fontSize: sizes.reText(18),
                        marginVertical: 5,
                        fontFamily: fonts.Helvetica,
                        color: colors.colorTabActive,
                        marginHorizontal: 5
                    }}>Thông Báo</Text>
                    <Text style={{
                        textAlign: 'center',
                        fontSize: sizes.reText(14),
                        marginVertical: 5
                    }}>{`Bạn đã chấm công thành công.\n\n Đếm ngược sau ${this.state.timer} giây sẽ tự động tắt phần mềm.\n\nVui lòng bấm huỷ để tiếp tục sử dụng phần mềm`}</Text>
                    <View style={{ width: '40%', marginTop: 20, justifyContent: "center", alignSelf: "center", height: 100 }}>
                        <ButtonCom
                            text={"Huỷ"}
                            style={{
                                backgroundColor: colors.colorButtomleft,
                                backgroundColor1: colors.colorButtomright,
                            }}
                            styleButton={{ flex: 1, marginRight: 10, }}
                            txtStyle={{ color: colors.white }}
                            onPress={() => {
                                clearInterval(this.Timeout)
                                Utils.setGlobal(nGlobalKeys.checkCCWifi, false)
                                actionSheetRef.current.hide()
                            }}
                        />
                    </View>

                </ActionSheet>
                <View style={{ justifyContent: "flex-end", marginBottom: paddingBotX + 10 }}>
                    <View style={{ flexDirection: "row", justifyContent: 'space-evenly' }}>
                        <View style={{ width: '45%' }}>
                            <ButtonCom
                                disabled={(cavao == "" || cavao == null) && (DSChiTiet.ra == "" || DSChiTiet.ra == null) ? false : true}
                                text={"Check in"}
                                img={Images.checkIn}
                                style={{
                                    backgroundColor: (cavao == "" || cavao == null) && (DSChiTiet.ra == "" || DSChiTiet.ra == null) ? colors.colorButtomleft : "#E2E2E2",
                                    backgroundColor1: (cavao == "" || cavao == null) && (DSChiTiet.ra == "" || DSChiTiet.ra == null) ? colors.colorButtomright : "#E2E2E2",
                                    borderRadius: 10
                                }}
                                onPress={() => this._onPressChamCong()} />

                        </View>
                        <View style={{ width: '45%' }}>
                            <ButtonCom
                                disabled={(cavao == "" || cavao == null) && (DSChiTiet.ra == "" || DSChiTiet.ra == null) ? true : false}
                                text={"Check out"}
                                img={Images.checkOut}
                                style={{
                                    backgroundColor: (cavao == "" || cavao == null) && (DSChiTiet.ra == "" || DSChiTiet.ra == null) ? "#E2E2E2" : "#FFBE68",
                                    backgroundColor1: (cavao == "" || cavao == null) && (DSChiTiet.ra == "" || DSChiTiet.ra == null) ? "#E2E2E2" : "#F5892A",
                                    borderRadius: 10
                                }}
                                onPress={() => this._onPressChamCong()} />
                        </View>
                    </View>
                </View>
            </View>

        );
    }
}
const styles = StyleSheet.create({
    stTitle: {
        fontSize: sizes.sizes.sText16,
        fontFamily: fonts.Helvetica
    }

})
const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(ChamCongWifi, mapStateToProps, true)
