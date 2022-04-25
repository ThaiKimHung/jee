import moment from 'moment';
import React, { Component } from 'react';
import { DeviceEventEmitter, View } from 'react-native';
import { CheckToken } from './src/apis/apiControllergeneral';
import { getDSChamCong } from './src/apis/apiTimesheets';
import { appConfig } from './src/app/Config';
import { ROOTGlobal } from './src/app/data/dataGlobal';
import { RootLang } from './src/app/data/locales';
import { nGlobalKeys } from './src/app/keys/globalKey';
import { nkey } from './src/app/keys/keyStore';
import Utils from './src/app/Utils';
var QuickActions = require("react-native-quick-actions");

export default class Shortcut extends Component {
    constructor(props) {
        super(props);
        this.state = {
            DSChiTiet: {},
            cavao: '',
            toDay: Utils.getGlobal(nGlobalKeys.TimeNow, '') ? moment(Utils.getGlobal(nGlobalKeys.TimeNow, '')).add(-7, "hours").format("DD/MM/YYYY") : moment(Date.now()).format("DD/MM/YYYY"),
            authToken: false,

        };
        this.handleQuickAction = this.handleQuickAction.bind(this);
        this.month = new Date().getMonth()
        this.year = new Date().getFullYear();
        ROOTGlobal.AuthSuccess.authsuccess = this.AuthSuccess;


    }
    componentWillUnmount() {
        DeviceEventEmitter.removeListener(
            "quickActionShortcut",
            this.handleQuickAction
        );

    }
    AuthSuccess = async () => {
        let res = await CheckToken();
        let AuthToken = res.status == 1 ? true : null
        let loaihinhApp = await Utils.ngetStorage(nkey.loaihinhApp, 0)
        var month = this.month
        var years = this.year
        var _getCongChiTiet = this._getCongChiTiet
        if (AuthToken == true) {
            if (await Utils.ngetStorage(nkey.shortcut, false) == true && await Utils.ngetStorage(nkey.isWifi, false) == true) {
                QuickActions.setShortcutItems([
                    {
                        type: "GUIDON",
                        title: "Gửi đơn xin nghỉ phép",
                        icon: "guidon",
                        userInfo: {
                            url: appConfig.appDevLink
                        }
                    },
                    {
                        type: "VITRI",
                        title: "Chấm công vị trí",
                        icon: "vitri",
                        userInfo: {
                            url: appConfig.appDevLink
                        }
                    },
                    {
                        type: "WIFI",
                        title: "Chấm công Wifi",
                        icon: "wifi",
                        userInfo: {
                            url: appConfig.appDevLink

                        }
                    },
                    {
                        type: "CHAMCONG",
                        title: "Xem bảng chấm công",
                        icon: "chamcong",
                        userInfo: {
                            url: appConfig.appDevLink
                        }
                    },

                ]);
            }
            if (await Utils.ngetStorage(nkey.shortcut, false) == true && await Utils.ngetStorage(nkey.isWifi, false) == false) {
                QuickActions.setShortcutItems([
                    {
                        type: "GUIDON",
                        title: "Gửi đơn xin nghỉ phép",
                        icon: "guidon",
                        userInfo: {
                            url: appConfig.appDevLink
                        }
                    },
                    {
                        type: "VITRI",
                        title: "Chấm công vị trí",
                        icon: "vitri",
                        userInfo: {
                            url: appConfig.appDevLink
                        }
                    },
                    {
                        type: "CHAMCONG",
                        title: "Xem bảng chấm công",
                        icon: "chamcong",
                        userInfo: {
                            url: appConfig.appDevLink
                        }
                    },
                ])
            }
            await Utils.ngetStorage(nkey.shortcut, false) == true && await Utils.ngetStorage(nkey.logout, false) == false
                ? QuickActions.popInitialAction()
                    .then(function (data) {
                        if (data == null) return;
                        else {
                            switch (data.type) {
                                case "WIFI":
                                    Utils.navigate("sc_ChamCongWifi"
                                        , { CapNhatLaiDuLieu: _getCongChiTiet, Shorcut_ChuyenVao: true }
                                    )
                                    break;

                                case "VITRI":
                                    Utils.navigate("sc_ChamCongCamera"
                                        , { isMode: 1, CapNhatLaiDuLieu: _getCongChiTiet, Shorcut_ChuyenVao: true }
                                    )
                                    break;
                                case "GUIDON":
                                    Utils.navigate(loaihinhApp == 2 ? "sc_NghiPhepBuoi" : "sc_NghiPhep", { Shorcut_ChuyenVao: true })
                                    break;
                                case "CHAMCONG":
                                    Utils.navigate('sc_CongChiTiet', {
                                        isMonth: month,
                                        isTimeYear: years,
                                        title: RootLang.lang.scbangcong.thongtinchamcong.toUpperCase(),
                                        type: 1,
                                        Shorcut_ChuyenVao: true
                                    })
                            }
                        }
                    })
                    .catch(console.error) : null
            DeviceEventEmitter.addListener(
                "quickActionShortcut",
                this.handleQuickAction
            );

        }
        else {
            QuickActions.clearShortcutItems();
            Utils.navigate("sc_Root")

        }
    }

    async handleQuickAction(data) {
        let res = await CheckToken();
        let AuthToken = res.status == 1 ? true : null
        let loaihinhApp = await Utils.ngetStorage(nkey.loaihinhApp, 0)
        try {
            if (data == null) {

            }
            else {
                if (AuthToken == true) {
                    switch (data.type) {
                        case "WIFI":
                            Utils.navigate("sc_ChamCongWifi"
                                , { CapNhatLaiDuLieu: this._getCongChiTiet, Shorcut_ChuyenVao: true }
                            )
                            break;

                        case "VITRI":
                            Utils.navigate("sc_ChamCongCamera"
                                , { isMode: 1, CapNhatLaiDuLieu: this._getCongChiTiet }
                            )
                            break;
                        case "GUIDON":
                            Utils.navigate(loaihinhApp == 2 ? "sc_NghiPhepBuoi" : "sc_NghiPhep")
                            break;
                        case "CHAMCONG":
                            Utils.navigate('sc_CongChiTiet', {
                                isMonth: this.month,
                                isTimeYear: this.year,
                                title: RootLang.lang.scbangcong.thongtinchamcong.toUpperCase(),
                                type: 1
                            })
                    }
                }
                else {
                    QuickActions.clearShortcutItems();
                    Utils.navigate("sc_Root")
                }
            }

        } catch (error) {
            Utils.nlog("=-=-=error", error)
        }
    }

    _getCongChiTiet = async () => {
        const { toDay } = this.state
        var val = `${toDay}|${toDay}`;
        var DSChiTiet = {}
        let res = await getDSChamCong(val, 1, 10);
        if (res.status == 1) {
            var { data = [] } = res;
            if (Array.isArray(data) && data.length > 0) {
                DSChiTiet = data[0]
            } else {
                DSChiTiet = {}
            }
        }
        else {
            Utils.showMsgBoxOK(this, RootLang.lang.thongbaochung.thongbao, res && res.message ? res.message :
                RootLang.lang.thongbaochung.khongcodulieu, "OK")
        }
        this.setState({ DSChiTiet, cavao: DSChiTiet.vao })
    }

    render() {
        return (
            <View />
        );
    }
}