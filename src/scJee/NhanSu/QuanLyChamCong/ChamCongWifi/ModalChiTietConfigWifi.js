import moment from 'moment';
import React from 'react';
import { Animated, TextInput, View, Text } from 'react-native';
import { Delete_Wifi, Add_Wifi } from '../../../../apis/apiQLCC';
import { RootLang } from '../../../../app/data/locales';
import Utils from '../../../../app/Utils';
import ButtonCom from '../../../../components/Button/ButtonCom';
import { colors, fonts, nstyles } from '../../../../styles';
import { reSize, reText, sizes } from '../../../../styles/size';
import { Height, Width } from '../../../../styles/styles';
import HeaderModalCom from '../../../../Component_old/HeaderModalCom';
import { ItemLineText, TouchDropNew } from '../../../../Component_old/itemcom/itemcom';
import _ from "lodash";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Permission, PERMISSION_TYPE } from '../../../../../AppPermission';
import NetInfo from "@react-native-community/netinfo";
import { appConfig } from '../../../../app/Config';
import { Images } from '../../../../images';
import UtilsApp from '../../../../app/UtilsApp';

class ModalChiTietConfigWifi extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible: true,
            item: Utils.ngetParam(this, "item", ''),
            listDiaDiem: Utils.ngetParam(this, "listDiaDiem", []),
            opacity: new Animated.Value(0),
            edit: false,
            tenWifi: '',
            bssid: '',
            diadiem: {},
        }
        this.callback = Utils.ngetParam(this, 'callback');

    }

    componentDidMount = async () => {
        this._startAnimation(0.8)
    }

    _goback = async () => {
        this._endAnimation(0)
        Utils.goback(this)
    }


    _EditConfig = async () => {
        await this.setState({ edit: true })

    }
    _UnEditConfig = async () => {
        this.setState({ edit: false })
    }
    getBSSID = async () => {
        Permission.checkPermisstion(PERMISSION_TYPE.location).then(result => {
            if (result == true) {

                NetInfo.fetch("wifi").then(state => {
                    if (state.isWifiEnabled == false) {
                        UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.scQuanLyChamCong.thongbaowifi, 3)
                    }
                    else
                        this.setState({ bssid: state.details.bssid })
                });
            }
        })
    }


    _DeleteWifi = async () => {
        var { item } = this.state
        Utils.showMsgBoxYesNo(this, RootLang.lang.thongbaochung.thongbao, RootLang.lang.scQuanLyChamCong.banmuonxoawifinay,
            RootLang.lang.scQuanLyChamCong.xoawifi, RootLang.lang.scQuanLyChamCong.thoat, async () => {
                const res = await Delete_Wifi(item.RowID)
                if (res.status == 1) {
                    UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.scQuanLyChamCong.xoawifithanhcong, 1)
                    this._endAnimation(0)
                    this.callback();
                    this._goback();
                    return
                } else {
                    UtilsApp.MessageShow(RootLang.lang.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.thuchienthatbai, 2)
                }

            }, () => { }, true)
    }

    AddWifi = async () => {
        var { diadiem, bssid, tenWifi, item } = this.state
        var body = {
            "RowID": item.RowID,
            "TenThietBi": String(tenWifi).length > 0 ? tenWifi : item.TenThietBi,
            "DiaChiMac": String(bssid).length > 0 ? bssid : item.DiaChiMac,
            "DiaDiemID": _.size(diadiem) > 0 ? diadiem.id_row : item.DiaDiem
        }
        const res = await Add_Wifi(body);
        if (res.status == 1) {
            Utils.showMsgBoxYesNo(this, RootLang.lang.thongbaochung.thongbao, RootLang.lang.scQuanLyChamCong.thongbaoluu, RootLang.lang.scQuanLyChamCong.luulai, RootLang.lang.scQuanLyChamCong.thoat,
                () => {
                    this._endAnimation(0)
                    nthisPush.show({
                        appIconSource: Images.JeeGreen,
                        appTitle: appConfig.TenAppHome,
                        title: RootLang.lang.thongbaochung.thongbao,
                        body: RootLang.lang.scQuanLyChamCong.capnhatwifithanhcong,
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

    _DiaDiem = () => {
        Utils.goscreen(this, 'Modal_ComponentSelectCom', {
            callback: this._callbackDiaDiem, item: this.state.diadiem,
            AllThaoTac: this.state.listDiaDiem, ViewItem: this.ViewItemDiaDiem
        })
    }
    _callbackDiaDiem = (diadiem) => {
        try {
            this.setState({ diadiem });
        } catch (error) {

        }
    }
    ViewItemDiaDiem = (item) => {
        return (
            <View
                key={item.id_row.toString()}
            >
                <Text style={{
                    textAlign: "center", fontSize: sizes.sText16,
                    color: this.state.diadiem.id_row == item.id_row ? colors.colorTabActive : 'black',
                    fontWeight: this.state.diadiem.id_row == item.id_row ? "bold" : 'normal'
                }}>{item.Tendiadiemlamviec ? item.Tendiadiemlamviec : ""}</Text>
            </View>
        )
    }

    render() {
        const { item, edit, opacity } = this.state
        var { tenWifi, bssid, diadiem } = this.state
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
                        <HeaderModalCom onPress={() => Utils.goback(this)} title={RootLang.lang.scQuanLyChamCong.titilechitietwifi} />

                        <ItemLineText
                            edit={edit}
                            title={RootLang.lang.scQuanLyChamCong.tenthietbi}
                            component={
                                <TextInput
                                    style={{
                                        fontSize: reText(14), textAlign: 'center',
                                        borderBottomColor: colors.grey,
                                        borderBottomWidth: 0.7
                                    }}
                                    onChangeText={(tenWifi) => this.setState({ tenWifi })}
                                    ref={ref => tenWifi = ref}
                                >
                                    {item.TenThietBi}
                                </TextInput>
                            }
                            value={item.TenThietBi ? item.TenThietBi : "..."} />
                        <ItemLineText
                            edit={edit}
                            styteTitle={{ flex: 1 }}
                            title={"BSSID"}
                            component={
                                <View style={{ flexDirection: "column" }}>
                                    <TextInput
                                        style={{
                                            fontSize: reText(14), textAlign: 'center',
                                            borderBottomColor: colors.grey,
                                            borderBottomWidth: 0.7
                                        }}
                                        onChangeText={(bssid) => this.setState({ bssid })}
                                        ref={ref => bssid = ref}
                                    >
                                        {item.DiaChiMac}
                                    </TextInput>
                                    <ButtonCom
                                        text={RootLang.lang.scQuanLyChamCong.layBSSIDDienThoai}
                                        style={{
                                            backgroundColor: colors.colorButtomleft,
                                            backgroundColor1: colors.colorButtomright,
                                            fontSize: sizes.sText14,
                                            width: reSize(140),
                                            marginTop: 20,
                                        }}
                                        onPress={this.getBSSID}
                                    />
                                </View>
                            }
                            value={item.DiaChiMac ? item.DiaChiMac : "..."} />
                        <ItemLineText
                            title={RootLang.lang.scQuanLyChamCong.ngaythem}
                            value={item.NgayThem ? moment(item.NgayThem).format("DD-MM-YYYY") : "..."} />
                        <ItemLineText
                            edit={edit}
                            component={
                                <TouchDropNew
                                    title={_.size(diadiem) > 0 ? diadiem.Tendiadiemlamviec : item.DiaDiem}
                                    required={true}
                                    styteTouch={{ justifyContent: 'flex-start', alignItems: 'flex-start', paddingVertical: 0 }}
                                    styTitle={{
                                        color: colors.black, fontFamily: fonts.Helvetica,
                                        lineHeight: reText(16), width: Width(50), textAlign: "right",
                                    }}
                                    _onPress={this._DiaDiem} />
                            }
                            style={{ marginBottom: 0 }}
                            title={RootLang.lang.scQuanLyChamCong.diadiem}
                            value={item.DiaDiem ? item.DiaDiem : "..."}
                        />
                        <View style={{
                            width: '100%',
                            paddingVertical: 100, justifyContent: 'flex-end', alignItems: 'center',
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
                                        onPress={this._DeleteWifi}
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
                                        onPress={this.AddWifi}
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
export default Utils.connectRedux(ModalChiTietConfigWifi, mapStateToProps, true)
