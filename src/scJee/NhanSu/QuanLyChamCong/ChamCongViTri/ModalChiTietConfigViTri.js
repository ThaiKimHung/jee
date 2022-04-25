import _ from "lodash";
import moment from 'moment';
import React from 'react';
import { Animated, Text, TextInput, View, PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Delete_ViTri, getAddressGG, Add_ViTri } from '../../../../apis/apiQLCC';
import { appConfig } from "../../../../app/Config";
import { RootLang } from '../../../../app/data/locales';
import Utils from '../../../../app/Utils';
import ButtonCom from '../../../../components/Button/ButtonCom';
import { Images } from "../../../../images";
import { colors, fonts, nstyles } from '../../../../styles';
import { reSize, reText, sizes } from '../../../../styles/size';
import { Height, Width } from '../../../../styles/styles';
import HeaderModalCom from '../../../../Component_old/HeaderModalCom';
import { ItemLineText, TouchDropNew } from '../../../../Component_old/itemcom/itemcom';
import apiViettelMaps from "../../../../apis/apiViettelMaps";
import UtilsApp from "../../../../app/UtilsApp";


class ModalChiTietConfigViTri extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible: true,
            item: Utils.ngetParam(this, "item", ''),
            listXacDinh: Utils.ngetParam(this, "listXacDinh", []),
            opacity: new Animated.Value(0),
            edit: false,
            tenWifi: '',
            bssid: '',


            DSViTri: [],
            refreshing: true,
            showload: false,
            ToaDo: '',
            tendiadiem: '',
            ghichu: '',
            bankinhhieuluc: '',
            xacdinh: {},
            initialPosition: {
                latitude: 0,
                longitude: 0,
                latitudeDelta: 0,
                longitudeDelta: 0,
            },
            enableThemDiaDiem: false,
            findLocation: false,
            latlng: {},
            latlngtmp: {},

            listlatlng: {},
            diaDiem: '',
            toadoTB: '',
            toadoDB: '',
            toadoTN: '',
            toadoDN: '',
            latlong: '',
        }
        this.callback = Utils.ngetParam(this, 'callback');

    }

    componentDidMount = async () => {
        this._startAnimation(0.8)
        const { item } = this.state
        await this.FindLocation()
        { appConfig.isServiceViettel ? this.getDiaDiem() : null }
        this.setState({
            xacdinh: item.CachXacDinh,
            toadoDB: item.HuongDongBac,
            toadoDN: item.HuongDongNam,
            toadoTB: item.HuongTayBac,
            toadoTN: item.HuongTayNam,
            tendiadiem: item.TenDiaDiem,
            bankinhhieuluc: item.KhoangCachHieuLuc,
            ToaDo: item.ToaDo,
            ghichu: item.GhiChu,
        })
    }

    getDiaDiem = async () => {
        const { item } = this.state
        let lat = String(item.ToaDo).split(",", 1).toString()
        let long = String(item.ToaDo).split(",").slice(1).toString()
        let res = await apiViettelMaps.getAddressViettel(lat, long)
        if (res) {
            this.setState({ diaDiem: res.full_address })
        }
    }


    _goback = async () => {
        this._endAnimation(0)
        Utils.goback(this, null)
    }


    _EditConfig = async () => {
        await this.setState({ edit: true })

    }
    _UnEditConfig = async () => {
        this.setState({ edit: false })
    }


    _DeleteVitri = async () => {
        var { item } = this.state
        Utils.showMsgBoxYesNo(this, RootLang.lang.thongbaochung.thongbao, RootLang.lang.scQuanLyChamCong.banmuonxoavitrinay,
            RootLang.lang.scQuanLyChamCong.xoavitri, RootLang.lang.scQuanLyChamCong.thoat, async () => {
                const res = await Delete_ViTri(item.RowID)
                // Utils.nlog('res _DeleteVitri', res)
                if (res.status == 1) {
                    UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.scQuanLyChamCong.xoavitrithanhcong, 1)
                    this.callback()
                    this._endAnimation(0)
                    this._goback()
                    return
                } else {
                    UtilsApp.MessageShow(RootLang.lang.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.thuchienthatbai, 2)
                }

            }, () => { }, true)
    }
    _startAnimation = (value) => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: value,
                duration: 100
            }).start();
        }, 20);
    };

    _XacDinh = () => {
        Utils.goscreen(this, 'Modal_ComponentSelectCom', {
            callback: this._callbackXacDinh,
            item: this.state.xacdinh,
            AllThaoTac: this.state.listXacDinh, ViewItem: this.ViewItemXacDinh
        })
    }

    _callbackXacDinh = (xacdinh) => {
        try {
            this.setState({ xacdinh });
            this.setState({
                bankinhhieuluc: '',
                toadoDB: "",
                toadoDN: "",
                toadoTB: "",
                toadoTN: "",


            })
        } catch (error) {

        }
    }

    ViewItemXacDinh = (item) => {
        return (
            <View key={item.row.toString()} >
                <Text style={{
                    textAlign: "center", fontSize: sizes.sText16,
                    color: this.state.xacdinh.row == item.row ? colors.textblack : colors.colorTextBTGray,
                    fontWeight: this.state.xacdinh.row == item.row ? "bold" : 'normal'
                }}>{item.type ? item.type : ""}</Text>
            </View>
        )
    }

    getCurrentPosition = async (enableThemDiaDiem) => {
        Geolocation.setRNConfiguration({ skipPermissionRequests: true, authorizationLevel: 'whenInUse' });
        Geolocation.requestAuthorization();

        if (Platform.OS == 'android') {
            this.granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
                title: 'Tự động lấy vị trí',
                message: 'Bạn có muốn tự động lấy thông tin vị trí hiện tại của bạn?\n' +
                    'Để tự động lấy vị trí thì bạn cần cấp quyền truy cập vị tri cho ứng dụng.',
                buttonNegative: 'Để sau',
                buttonPositive: 'Cấp quyền'
            })
            if (this.granted == PermissionsAndroid.RESULTS.GRANTED) {
                Geolocation.getCurrentPosition(
                    (position) => {
                        Utils.nlog('geolocation-android', JSON.stringify(position));
                        var { coords = {} } = position;
                        var { latitude, longitude } = coords;
                        let latlng = {
                            latitude: latitude,
                            longitude: longitude
                        };
                        this.setState({
                            enableThemDiaDiem,
                            latlng: latlng,
                            latlong: latitude + ',' + longitude
                        }, this.onPressFindLocation)
                    },
                    error => Utils.nlog('getCurrentPosition error: ', JSON.stringify(error)),
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
                );
            }
        } else {
            Geolocation.getCurrentPosition(
                (position) => {
                    Utils.nlog('geolocation-ios', JSON.stringify(position));
                    var { coords = {} } = position;
                    var { latitude, longitude } = coords;
                    if (Platform.OS == 'ios' && (!latitude || !longitude)) {
                        Utils.showMsgBoxYesNo(this, 'Dịch vụ vị trí bị tắt', 'Ứng dụng cần truy cập vị trí của bạn. Hãy bật Dịch vụ vị trí trong phần cài đặt điện thoại của bạn.',
                            'Chuyển tới cài đặt', 'Không, cảm ơn',
                            () => {
                                Linking.openURL('app-settings:').catch((err) => {
                                    Utils.nlog('app-settings:', err);
                                });
                            });
                    } else {
                        this.granted = 'granted';
                        let latlng = {
                            latitude: latitude,
                            longitude: longitude
                        }
                        this.setState({
                            enableThemDiaDiem,
                            latlng: latlng,
                            latlong: latitude + ',' + longitude
                        }, this.onPressFindLocation)
                    }
                },
                (error) => {
                    let {
                        code
                    } = error;
                    if (code == 1) {
                        Utils.showMsgBoxYesNo(this, 'Dịch vụ vị trí bị tắt',
                            'Ứng dụng cần truy cập vị trí của bạn. Hãy bật dịch vụ vị trí trong phần cài đặt điện thoại của bạn.',
                            'Chuyển tới cài đặt', 'Không, cảm ơn',
                            () => {
                                Linking.openURL('app-settings:').catch((err) => {
                                    nlog('app-settings:', err);
                                });
                            });
                    }
                    Utils.nlog('getCurrentPosition error: ', JSON.stringify(error))
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
            );
        }
    }

    onPressFindLocation = async () => {
        let { latlng } = this.state;
        var diaDiem = 'Đang lấy dữ liệu vị trí hiện tại';
        this.setState({
            findLocation: true,
            diaDiem: diaDiem,
        });

        //---
        let {
            latitude,
            longitude
        } = latlng
        if (appConfig.isServiceViettel) {
            let res = await apiViettelMaps.getAddressViettel(latitude, longitude)
            if (res) {
                this.setState({ diaDiem: res.full_address });
            }
        }
        else {
            let res = await getAddressGG(latitude, longitude);
            var { results = [] } = res;
            let display_name = '';
            if (results[1]) {
                display_name = results[1]?.formatted_address;
            }
            this.setState({ diaDiem: display_name });
        }
        //---
    }

    FindLocation = async () => {
        var { item } = this.state
        let lat = String(item.ToaDo).split(",", 1).toString()
        let long = String(item.ToaDo).split(",").slice(1).toString()
        let res = await getAddressGG(lat, long);
        var { results = [] } = res;
        let display_name = '';
        if (results[1]) {
            display_name = results[1]?.formatted_address;
        }
        this.setState({ diaDiem: display_name });
    }

    callbackDataMapsMode1 = (diaDiem, latlng) => {
        let toado = latlng.latitude + ',' + latlng.longitude
        this.setState({ diaDiem: diaDiem, latlng: latlng, latlong: toado });

    }

    AddDiaDiem = async () => {
        const { item } = this.state
        var { tendiadiem, ghichu, bankinhhieuluc, xacdinh, toadoTB, toadoTN, toadoDB, toadoDN, latlong } = this.state
        if (isNaN(bankinhhieuluc) && (xacdinh.row == 1 || xacdinh == 1)) {
            return UtilsApp.MessageShow("Thông báo", "Bán kính hiệu lực phải là số", 3)
        }

        let latlongtmp = _.size(latlong) > 0 ? latlong : item.ToaDo
        let xd = _.size(xacdinh) > 0 ? xacdinh.row : xacdinh

        var body = {
            "RowID": item.RowID,
            "TenDiaDiem": tendiadiem,
            "ToaDo": latlongtmp,
            "GhiChu": ghichu,
            "KhoangCachHieuLuc": bankinhhieuluc,
            "CachXacDinh": xd,
            "HuongTayBac": toadoTB,
            "HuongTayNam": toadoTN,
            "HuongDongBac": toadoDB,
            "HuongDongNam": toadoDN
        }
        const res = await Add_ViTri(body);
        // Utils.nlog('res Add_ViTri', res)
        if (res.status == 1) {
            Utils.showMsgBoxYesNo(this, RootLang.lang.thongbaochung.thongbao, RootLang.lang.scQuanLyChamCong.thongbaoluu, RootLang.lang.scQuanLyChamCong.luulai, RootLang.lang.scQuanLyChamCong.thoat,
                () => {
                    this._endAnimation(0)
                    nthisPush.show({
                        appIconSource: Images.JeeGreen,
                        appTitle: appConfig.TenAppHome,
                        title: RootLang.lang.thongbaochung.thongbao,
                        body: RootLang.lang.scQuanLyChamCong.capnhatvitrichamcongthanhcong,
                        slideOutTime: 2000
                    });
                    this.callback();
                    this._goback();
                }
            )
        }
        else
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
    }




    handleToaDo = async (latlong) => {
        let lat = String(latlong).split(",", 1).toString()
        let long = String(latlong).split(",").slice(1).toString()
        this.setState({ latlong })
        let res = await getAddressGG(lat, long);

        var { results = [] } = res;
        let display_name = '';
        if (results[1]) {
            display_name = results[1]?.formatted_address;
        }
        this.setState({ diaDiem: display_name });

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

    render() {
        const { item, edit, opacity } = this.state

        var { ghichu, tendiadiem, xacdinh, diaDiem, bankinhhieuluc,
            toadoTB,
            toadoDB,
            toadoTN,
            toadoDN,
            latlong,
            latlng,
            ToaDo,
        } = this.state
        latlong = latlng.latitude + "," + latlng.longitude
        return (
            <View style={[nstyles.nstyles.ncontainer, {
                backgroundColor: `transparent`,
                justifyContent: 'flex-end', opacity: 1,
            }]}>
                <Animated.View onTouchEnd={this._goback}
                    style={{
                        position: 'absolute', top: 0,
                        bottom: 0, left: 0, right: 0,
                        backgroundColor: colors.backgroundModal,
                        alignItems: 'flex-end',
                        flex: 1, opacity
                    }} />
                <View style={{
                    flex: 1, marginTop: Height(15),
                    backgroundColor: colors.white,
                    borderTopLeftRadius: 20, borderTopRightRadius: 20,
                    zIndex: 1,
                    paddingHorizontal: 10,
                }}>
                    <KeyboardAwareScrollView
                        extraScrollHeight={100}
                        innerRef={ref => {
                            this.scroll = ref
                        }} style={{ flex: 1, paddingHorizontal: 15, paddingVertical: 20 }}>
                        <HeaderModalCom onPress={() => Utils.goback(this)} title={RootLang.lang.scQuanLyChamCong.titlechitietvitri} />

                        <ItemLineText
                            edit={edit}
                            title={RootLang.lang.scQuanLyChamCong.tendiadiem}
                            component={
                                <TextInput
                                    style={{
                                        fontSize: reText(14), textAlign: 'center',
                                        borderBottomColor: colors.grey,
                                        borderBottomWidth: 0.7
                                    }}
                                    onChangeText={(tendiadiem) => this.setState({ tendiadiem })}
                                    ref={ref => tendiadiem = ref}
                                >
                                    {tendiadiem}
                                </TextInput>
                            }
                            value={tendiadiem ? tendiadiem : "..."} />
                        <ItemLineText
                            edit={edit}
                            styteTitle={{ flex: 1 }}
                            title={RootLang.lang.scQuanLyChamCong.toado}
                            component={
                                <View style={{ flexDirection: "column" }}>
                                    <TextInput
                                        style={{
                                            fontSize: reText(14), textAlign: 'center',
                                            borderBottomColor: colors.grey,
                                            borderBottomWidth: 0.7
                                        }}
                                        onChangeText={(latlong) => this.handleToaDo(latlong)}
                                        ref={ref => latlong = ref}
                                    >

                                        {_.size(latlng) > 0 ? latlong : ToaDo}
                                    </TextInput>
                                    <View style={{
                                        alignItems: "center", marginVertical: 10,
                                        alignSelf: "center", flexDirection: "row"
                                    }}>
                                        <ButtonCom
                                            text={RootLang.lang.scQuanLyChamCong.tudonglaytoado}
                                            style={{
                                                backgroundColor: colors.colorButtomleft,
                                                backgroundColor1: colors.colorButtomright,
                                                fontSize: sizes.sText14,
                                                width: reSize(140),
                                            }}
                                            onPress={() => { this.getCurrentPosition(true); }}
                                        />
                                        <View style={{ paddingHorizontal: 10 }} />
                                        <ButtonCom
                                            text={RootLang.lang.scQuanLyChamCong.chontrenbando}
                                            style={{
                                                backgroundColor: colors.colorButtomleft,
                                                backgroundColor1: colors.colorButtomright,
                                                fontSize: sizes.sText14,
                                                width: reSize(140),
                                            }}
                                            onPress={() => {
                                                Utils.goscreen(this, "Modal_BanDo", {
                                                    callbackDataMapsMode1: this.callbackDataMapsMode1,
                                                    mode: 1
                                                })
                                            }}
                                        />
                                    </View>
                                </View>
                            }
                            value={ToaDo ? ToaDo : "..."} />
                        <ItemLineText
                            title={RootLang.lang.scQuanLyChamCong.diadiem}
                            value={diaDiem ? diaDiem : "..."} />
                        <ItemLineText
                            edit={edit}
                            component={
                                <TouchDropNew
                                    title={_.size(xacdinh.type) > 0 ? xacdinh.type : item.CachXacDinh ? item.CachXacDinh == 1 ?
                                        RootLang.lang.scQuanLyChamCong.bankinh : RootLang.lang.scQuanLyChamCong.khuvuc : "..."}
                                    required={true}
                                    styteTouch={{ justifyContent: 'flex-start', alignItems: 'flex-start', paddingVertical: 0 }}
                                    styTitle={{
                                        color: colors.black, fontFamily: fonts.Helvetica,
                                        lineHeight: reText(16), width: Width(50), textAlign: "right",
                                    }}
                                    _onPress={this._XacDinh} />
                            }
                            title={RootLang.lang.scQuanLyChamCong.cachxacdinh}
                            value={item.CachXacDinh ? item.CachXacDinh == 1 ? RootLang.lang.scQuanLyChamCong.bankinh : RootLang.lang.scQuanLyChamCong.khuvuc : "..."}
                        />

                        {xacdinh == 1 || xacdinh.row == 1 ?
                            <ItemLineText
                                edit={edit}
                                title={RootLang.lang.scQuanLyChamCong.bankinhhieuluc}
                                component={
                                    <TextInput
                                        style={{
                                            fontSize: reText(14), textAlign: 'center',
                                            borderBottomColor: colors.grey,
                                            borderBottomWidth: 0.7, minWidth: 100,
                                        }}
                                        onChangeText={(bankinhhieuluc) => this.setState({ bankinhhieuluc })}
                                        ref={ref => bankinhhieuluc = ref}
                                    >
                                        {bankinhhieuluc}
                                    </TextInput>
                                }
                                value={bankinhhieuluc ? bankinhhieuluc + "(m)" : 0} />
                            : <>
                                <ItemLineText
                                    edit={edit}
                                    title={RootLang.lang.scQuanLyChamCong.toadoTB}
                                    component={
                                        <TextInput
                                            style={{
                                                fontSize: reText(14), textAlign: 'center',
                                                borderBottomColor: colors.grey,
                                                borderBottomWidth: 0.7, minWidth: 100,
                                            }}
                                            onChangeText={(toadoTB) => this.setState({ toadoTB })}
                                            ref={ref => toadoTB = ref}
                                        >
                                            {toadoTB}
                                        </TextInput>
                                    }
                                    value={toadoTB ? toadoTB : "..."} />
                                <ItemLineText
                                    edit={edit}
                                    title={RootLang.lang.scQuanLyChamCong.toadoDB}
                                    component={
                                        <TextInput
                                            style={{
                                                fontSize: reText(14), textAlign: 'center',
                                                borderBottomColor: colors.grey,
                                                borderBottomWidth: 0.7, minWidth: 100,
                                            }}
                                            onChangeText={(toadoDB) => this.setState({ toadoDB })}
                                            ref={ref => toadoDB = ref}
                                        >
                                            {toadoDB}
                                        </TextInput>
                                    }
                                    value={toadoDB ? toadoDB : "..."} />
                                <ItemLineText
                                    edit={edit}
                                    title={RootLang.lang.scQuanLyChamCong.toadoDN}
                                    component={
                                        <TextInput
                                            style={{
                                                fontSize: reText(14), textAlign: 'center',
                                                borderBottomColor: colors.grey,
                                                borderBottomWidth: 0.7, minWidth: 100,
                                            }}
                                            onChangeText={(toadoDN) => this.setState({ toadoDN })}
                                            ref={ref => toadoDN = ref}
                                        >
                                            {toadoDN}
                                        </TextInput>
                                    }
                                    value={toadoDN ? toadoDN : "..."} />
                                <ItemLineText
                                    edit={edit}
                                    title={RootLang.lang.scQuanLyChamCong.toadoTN}
                                    component={
                                        <TextInput
                                            style={{
                                                fontSize: reText(14), textAlign: 'center',
                                                borderBottomColor: colors.grey,
                                                borderBottomWidth: 0.7, minWidth: 100,
                                            }}
                                            onChangeText={(toadoTN) => this.setState({ toadoTN })}
                                            ref={ref => toadoTN = ref}
                                        >
                                            {toadoTN}
                                        </TextInput>
                                    }
                                    value={toadoTN ? toadoTN : "..."} />
                            </>}
                        <ItemLineText
                            edit={edit}
                            title={RootLang.lang.scQuanLyChamCong.ghichu}
                            component={
                                <TextInput
                                    style={{
                                        fontSize: reText(14), textAlign: 'center',
                                        borderBottomColor: colors.grey,
                                        borderBottomWidth: 0.7
                                    }}
                                    onChangeText={(ghichu) => this.setState({ ghichu })}
                                    ref={ref => ghichu = ref}
                                >
                                    {ghichu}
                                </TextInput>
                            }
                            value={ghichu ? ghichu : "..."} />
                        <ItemLineText
                            title={RootLang.lang.scQuanLyChamCong.soluongnhanvien}
                            value={item.SoLuongNV >= 0 ? item.SoLuongNV : "..."} />
                        <ItemLineText
                            title={RootLang.lang.scQuanLyChamCong.ngaythem}
                            value={item.NgayCapNhat ? moment(item.NgayCapNhat).format("DD-MM-YYYY") : "..."} />
                        <View style={{
                            width: '100%',
                            paddingVertical: 50, justifyContent: 'flex-end', alignItems: 'center',
                            flexDirection: 'row', justifyContent: 'space-evenly',
                        }}>
                            {edit == false ?
                                <>
                                    <ButtonCom
                                        text={RootLang.lang.scQuanLyChamCong.xoa}
                                        style={{
                                            backgroundColor: colors.colorBtnOrange,
                                            backgroundColor1: colors.colorBtnOrange,
                                            fontSize: sizes.sText14,
                                            width: reSize(120),
                                        }}
                                        onPress={this._DeleteVitri}
                                    />
                                    <ButtonCom
                                        text={RootLang.lang.scQuanLyChamCong.chinhsua}
                                        style={{
                                            backgroundColor: colors.colorButtomleft,
                                            backgroundColor1: colors.colorButtomright,
                                            fontSize: sizes.sText14,
                                            width: reSize(120),
                                        }}
                                        onPress={this._EditConfig}
                                    />
                                </> :
                                <>
                                    <ButtonCom
                                        text={RootLang.lang.scQuanLyChamCong.huy}
                                        style={{
                                            backgroundColor: colors.colorBtnOrange,
                                            backgroundColor1: colors.colorBtnOrange,
                                            fontSize: sizes.sText14,
                                            width: reSize(120),
                                        }}
                                        onPress={this._UnEditConfig}
                                    />
                                    <ButtonCom
                                        text={RootLang.lang.scQuanLyChamCong.xacnhan}
                                        style={{
                                            backgroundColor: colors.colorButtomleft,
                                            backgroundColor1: colors.colorButtomright,
                                            fontSize: sizes.sText14,
                                            width: reSize(120),
                                        }}
                                        onPress={this.AddDiaDiem}
                                    />
                                </>

                            }
                        </View>
                    </KeyboardAwareScrollView>
                </View>
            </View >
        );
    }
}

const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(ModalChiTietConfigViTri, mapStateToProps, true)
