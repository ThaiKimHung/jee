import {
    GoogleSignin, statusCodes
} from '@react-native-google-signin/google-signin';
import moment from 'moment';
import React, { Component } from 'react';
import { Animated, BackHandler, FlatList, Image, Platform, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import * as Animatable from 'react-native-animatable';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { color } from 'react-native-reanimated';
import { getCTCuocHopSua, getListKey, postTaoCuocHop } from '../../../../apis/JeePlatform/API_JeeMeeting/apiTaoCuocHop';
import { RootLang } from '../../../../app/data/locales';
import Utils from '../../../../app/Utils';
import UtilsApp from '../../../../app/UtilsApp';
import ButtonCom from '../../../../components/Button/ButtonCom';
import IsLoading from '../../../../components/IsLoading';
import ListEmpty from '../../../../components/ListEmpty';
import nAvatar from '../../../../components/pickChartColorofAvatar';
import { Images } from '../../../../images';
import { colors } from '../../../../styles';
import { reText } from '../../../../styles/size';

const DOMAIN_CHECK_TOKEN_GOOGLE = "https://www.googleapis.com/oauth2/v3/tokeninfo?access_token="

import { nHeight, nstyles, nWidth, paddingBotX, paddingTopMul, Width } from '../../../../styles/styles';
export class ModalTaoCuocHop extends Component {
    constructor(props) {
        super(props);
        this.type = Utils.ngetParam(this, 'type') //1 - Sửa, undefined - tạo mới
        this.index = Utils.ngetParam(this, 'index')
        this.item = Utils.ngetParam(this, 'item')
        this.rowid = Utils.ngetParam(this, 'rowid')
        this.reload = Utils.ngetParam(this, 'reload')
        this.listUserThamGiaChat = Utils.ngetParam(this, 'listUserThamGiaChat', undefined) //Luồng từ chat
        this.refLoading = React.createRef()
        this.state = ({
            opacity: new Animated.Value(0),
            ngaythangnam: '',
            thoigian: '',
            dengio: '',
            listUserThamGia: [],
            listUserTheoDoi: [],
            listUserTomTat: [],
            dsTaiSan: [],
            dsKeyZoom: [],
            itemKeyZoom: { Id: 0, TenPhong: 'Chọn phòng họp Zoom' },
            isTomTat: false,
            isXacThucThamDu: false,
            isZoom: false,
            isGoogleMeet: false,
            pPhut: '',
            pTenCuocHop: '',
            pGhiChu: '',
            phongDangky: '',
            warning: false,
        })
    }
    componentDidMount = async () => {
        this._configureGoogleSignIn()
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this._backHandlerButton)
        this._startAnimation(0.8)
        this.loadDSKeyZoom().then(temp => {
            if (temp)
                this.loadDSEdit()
        })
        if (this.listUserThamGiaChat) //Luồng chat tạo room
            this.setState({ listUserThamGia: this.listUserThamGiaChat })
    }
    componentWillUnmount() {
        this.backHandler.remove()
    }
    _backHandlerButton = () => {
        this._goback()
        return true
    }
    _goback = () => {
        Utils.goback(this)
    }
    _startAnimation = (value) => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: value,
                duration: 300
            }).start();
        }, 400);
    };

    signIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            await GoogleSignin.signIn();
            const user = await GoogleSignin.addScopes({
                scopes: ['https://www.googleapis.com/auth/calendar'],
            });
            this.setState({ user });
            if (user) {
                const { accessToken } = await GoogleSignin.getTokens();
                await Utils.nsetStorage("TOKEN_GOOGLE", accessToken)
                this._openZoomORGoogleMeet(2)
            }
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (e.g. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
            } else {
                // some other error happened
            }
        }
    };


    async _configureGoogleSignIn() {
        GoogleSignin.configure({
            webClientId: "118969447164-94fpkqt31tfpk55vrp48baik7vshp1b3.apps.googleusercontent.com",
            offlineAccess: false,
        });
    }


    loadDSEdit = async () => {
        const { dsKeyZoom, itemKeyZoom } = this.state
        if (this.type == 1) {
            let res = await getCTCuocHopSua(this.rowid)
            // console.log("getCTCuocHopSua:", res)
            if (res.status == 1) {
                const temp = res.data
                var keyZoom = dsKeyZoom.find(item => item.Id == temp.IDPhongHop)
                if (!keyZoom)
                    keyZoom = itemKeyZoom
                this.pickFirstDateTime(temp.thoigiandate, 1)
                this.pickFirstDateTime(temp.thoigiantime, 2, temp.thoigianminute)
                this.setState({
                    isZoom: temp.ZoomMeeting, isGoogleMeet: temp.GoogleMeeting, isTomTat: temp.NhapTomTat, isXacThucThamDu: temp.XacNhanThamGia,
                    listUserThamGia: temp.ListThamGia, listUserTheoDoi: temp.ListTheoDoi, listUserTomTat: temp.ListTomTat, pPhut: temp.thoigianminute,
                    pTenCuocHop: temp.TenCuocHop, pGhiChu: temp.GhiChu, phongDangky: temp.PhongHopDangKy, dsTaiSan: temp.TaiSanKhac,
                    itemKeyZoom: keyZoom
                })
            }
            else
                UtilsApp.MessageShow(RootLang.lang.JeeMeeting.thongbao, res.error ? res.error.message : RootLang.lang.JeeMeeting.loitruyxuatdulieu, 2)
        }
    }
    loadDSKeyZoom = async () => {
        let res = await getListKey()
        if (res.status == 1) {
            this.setState({ dsKeyZoom: res.data })
        }
        else {
            UtilsApp.MessageShow(RootLang.lang.JeeMeeting.thongbao, res.error.message ? res.error.message : RootLang.lang.JeeMeeting.loitruyxuatdulieu, 2)
        }
        return true
    }
    _endAnimation = (value) => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: value,
                duration: 1
            }).start();
        }, 1);
    };
    _selectDate = () => {
        const { ngaythangnam } = this.state
        Utils.goscreen(this, 'Modal_CalandaSingalCom', {
            date: ngaythangnam || moment(new Date()).format('DD/MM/YYYY'),
            setTimeFC: (time, type) => this.pickDateTime(time, type = 1)
        })
    }
    pickDateTime = (time, type) => { //type: 1 - Cập nhật ngày tháng, 2 - cập nhật giờ, undefined - dựa vào showpick khi chọn giờ)

        this.setState({ warning: false })
        if (type == 1) {
            this.setState({ ngaythangnam: time })
        }
        if (type == 2) {
            let phut = moment(time, 'HH:mm').diff(moment(moment(time, 'HH:mm').add(1, 'hours').format('HH:mm'), 'HH:mm'), 'minute')
            this.setState({ thoigian: time, dengio: time ? moment(time, 'HH:mm').add(1, 'hours').format('HH:mm') : '', pPhut: Math.abs(phut) })
        }

    }
    pickFirstDateTime = (time, type, timeAPI = 0) => {
        const temp = moment(time).format('DD/MM/YYYY')
        if (type == 1) {
            this.setState({ ngaythangnam: temp })
        }
        if (type == 2) {
            this.setState({ thoigian: time, dengio: moment(time, 'HH:mm').add(timeAPI, 'minutes').format('HH:mm'), pPhut: timeAPI })
        }
    }
    pickNhanVien = (listuser, type) => {//type: 1 - tham gia, 2 - theo doi, 3 - tom tat
        let list = []
        listuser.map(item => {
            list.push(item)
        })
        if (type == 1) {
            this.setState({ listUserThamGia: list })
            return
        }
        if (type == 2) {
            this.setState({ listUserTheoDoi: list })
            return
        }
        if (type == 3) {
            this.setState({ listUserTomTat: list })
            return
        }
    }
    pickPhong_DSTaiSan = (listPhong, listTS) => {
        // console.log("listPhong", listPhong)
        // console.log("listTS", listTS)
        this.setState({ dsTaiSan: listTS, phongDangky: listPhong })
    }

    removeTaiSan = (index) => {
        var { dsTaiSan } = this.state
        dsTaiSan.splice(index, 1)
        this.setState({ dsTaiSan })
    }
    luu = async () => {

        this.refLoading.current.show()
        const {
            pTenCuocHop, ngaythangnam, thoigian, pPhut, isXacThucThamDu, isTomTat, pGhiChu, phongDangky, dsTaiSan, isGoogleMeet, isZoom,
            listUserThamGia, listUserTheoDoi, listUserTomTat, itemKeyZoom
        } = this.state
        if (pTenCuocHop == '') {
            this.refTenCuocHop.focus()
            UtilsApp.MessageShow(RootLang.lang.JeeMeeting.thongbao, RootLang.lang.JeeMeeting.tencuochopkhongdetrong, 4)
            this.refLoading.current.hide()
            return
        }
        if (!ngaythangnam || !thoigian) {
            UtilsApp.MessageShow(RootLang.lang.JeeMeeting.thongbao, RootLang.lang.JeeMeeting.thoigiankhongduocdetrong, 4)
            this.setState({ warning: true })
            this.refLoading.current.hide()
            return
        }
        if (!pPhut) {
            UtilsApp.MessageShow(RootLang.lang.JeeMeeting.thongbao, 'Thời gian họp không hợp lệ', 4)
            this.setState({ warning: true })
            this.refLoading.current.hide()
            return
        }
        const body = {
            "RowID": this.rowid ? this.rowid : 0,
            "TenCuocHop": pTenCuocHop,
            "Thoigiandate": moment(ngaythangnam, 'DD/MM/YYYY').format('YYYY-MM-DD') + ' 00:00:00.000',
            "Thoigiantime": thoigian,
            "Thoigianminute": pPhut,
            "XacNhanThamGia": isXacThucThamDu,
            "NhapTomTat": isTomTat,
            "GhiChu": pGhiChu,
            "ListThamGia": listUserThamGia,
            "ListTheoDoi": listUserTheoDoi,
            "ListTomTat": listUserTomTat,
            "PhongHopDangKy": phongDangky,
            "TaiSanKhac": dsTaiSan,
            "ZoomMeeting": isZoom,
            "GoogleMeeting": isGoogleMeet,
            "IDPhongHop": isZoom ? itemKeyZoom.Id : 0,
            "Token": isGoogleMeet ? await Utils.ngetStorage("TOKEN_GOOGLE", "") : "",
            "TimeZone": Intl.DateTimeFormat().resolvedOptions().timeZone
        }
        let res = await postTaoCuocHop(body)
        // Utils.nlog('res after saving: ', res)
        if (res.status == 1) {
            Utils.goback(this)
            this.refLoading.current.hide()
            UtilsApp.MessageShow(RootLang.lang.JeeMeeting.thongbao, this.type == 1 ? RootLang.lang.JeeMeeting.suacuonhopthanhcong : RootLang.lang.JeeMeeting.themcuochopthanhcong, 1)
            if (this.type) {
                this.reload(2, this.index, res.data[0])
            } else
                this.reload(3)
        } else {
            this.refLoading.current.hide()
            UtilsApp.MessageShow(RootLang.lang.JeeMeeting.thongbao, res.error ? res.error.message : RootLang.lang.JeeMeeting.loitruyxuatdulieu, 4)
        }
    }
    _renderListTaiSan = ({ item, index }) => {
        return (
            <View style={{ alignItems: 'center', flexDirection: 'row', marginTop: 5, backgroundColor: '#E7E5EE', borderRadius: 22.5, marginHorizontal: 10, paddingHorizontal: 10, paddingVertical: 8 }}>
                <Text style={{ fontSize: reText(14), color: colors.blackJee, flex: 1, }}><Text style={{ fontWeight: "bold" }}>{item.TenPhong}, </Text>{moment(item.BookingDate).format('DD/MM/YYYY')}  {item.FromTime} - {item.ToTime}</Text>
                <TouchableOpacity onPress={() => this.removeTaiSan(index)} style={{ width: Width(10), justifyContent: 'flex-end', }}>
                    <View style={{ backgroundColor: colors.bgRed, width: 20, height: 20, borderRadius: 15, alignSelf: 'flex-end', justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={Images.ImageJee.icDeleteJee} />
                    </View>
                </TouchableOpacity>
            </View>

        )
    }
    renderListUser = (list) => {
        return (
            <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
                <ScrollView horizontal>
                    <View style={[styles.viewAvatar, { alignItems: 'center' }]}>
                        {
                            list.map(item => {
                                return (
                                    item.Image ?
                                        <Image source={{ uri: item.Image }} style={{ width: 30, height: 30, borderRadius: 30 }}></Image>
                                        :
                                        <View style={{ width: 30, height: 30, borderRadius: 30, backgroundColor: nAvatar(item.HoTen).color, justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ color: 'white', fontWeight: 'bold' }}>{nAvatar(item.HoTen).chart}</Text>
                                        </View>
                                )
                            })
                        }
                    </View>
                </ScrollView >
            </View >
        )
    }
    _renderDSKeyZoom = ({ item, index }) => {
        return (
            <TouchableOpacity style={styles.btnKeyZoom} onPress={() => this._selectKeyZoom(item)}>
                <Text>{item.TenPhong}</Text>
            </TouchableOpacity>
        )
    }
    _selectKeyZoom = (item) => {
        this.refKeyZoom.hide()
        this.setState({ itemKeyZoom: item })
    }
    _openZoomORGoogleMeet = async (type = 1, time = 0) => { //type: 1-zoom, 2-meet
        let { isZoom, isGoogleMeet } = this.state

        if (type == 1) {
            isZoom = !isZoom
            isGoogleMeet = isZoom ? false : isGoogleMeet
        }
        if (type == 2 && time < 5) {
            try {
                const { accessToken } = await GoogleSignin.getTokens();
                await Utils.nsetStorage("TOKEN_GOOGLE", accessToken)
                if (await Utils.ngetStorage("TOKEN_GOOGLE", '')) {
                    try {
                        const response = await fetch(DOMAIN_CHECK_TOKEN_GOOGLE + accessToken,
                            {
                                method: "GET",
                                headers: {
                                    // 'Accept': 'application/json',
                                    'Content-Type': 'application/json',
                                },
                            });
                        const resToken = await response.json()
                        if (resToken && resToken?.exp) {
                            isGoogleMeet = !isGoogleMeet
                            isZoom = isGoogleMeet ? false : isZoom
                        }
                        else {
                            await GoogleSignin.signInSilently()
                            this._openZoomORGoogleMeet(2, time + 1)
                        }
                    } catch (error) {
                        Utils.nlog("=-=-=erorr", error)
                    }
                }
                else {
                    this.signIn()
                }
            } catch (error) {
                if (JSON.stringify(error).includes('to be signed in')) {
                    this.signIn()
                }
            }
        }
        if (type == 2 && time >= 5) {
            UtilsApp.MessageShow(RootLang.lang.JeeMeeting.thongbao, res.error ? res.error.message : RootLang.lang.JeeMeeting.loitruyxuatdulieu, 4)
        }
        this.setState({ isGoogleMeet, isZoom })
    }

    handleDenGio = (val) => {
        if (this.state.thoigian != '' && moment(this.state.thoigian, 'HH:mm').diff(moment(val, 'HH:mm'), 'minute') > 0) {
            UtilsApp.MessageShow('Thông báo', 'Đến giờ phải lớn hơn giờ từ giờ', 4)
        } else {
            let phut = moment(this.state.thoigian, 'HH:mm').diff(moment(val, 'HH:mm'), 'minute')
            this.setState({ dengio: val, pPhut: phut ? Math.abs(phut) : 0 })
        }
    }

    removePhong = () => {
        this.setState({ phongDangky: '' })
    }

    render() {
        const {
            opacity, ngaythangnam, thoigian, listUserThamGia, listUserTheoDoi, listUserTomTat, isTomTat,
            isXacThucThamDu, isZoom, isGoogleMeet, pPhut, pTenCuocHop, pGhiChu, phongDangky, dsTaiSan, warning,
            dsKeyZoom, itemKeyZoom, dengio
        } = this.state
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: colors.backgroudJeeHR, flex: 1, paddingTop: paddingTopMul }]} >
                <View style={styles.touchBack}>
                    <TouchableOpacity onPress={() => this._goback()} style={styles.touchBackChild} >
                        <Text style={styles.titleBack}>{'Huỷ'}</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>{this.type == 1 ? 'Sửa cuộc họp' : 'Tạo cuộc họp'}</Text>
                    <View style={{ width: Width(15) }} />
                </View>
                <KeyboardAwareScrollView keyboardShouldPersistTaps='handled' style={{ backgroundColor: colors.backgroundColor, flex: 1, }}>
                    <View style={styles.coverView}>
                        <TextInput style={styles.inputHeader} placeholder={RootLang.lang.JeeMeeting.nhaptencuochop} placeholderTextColor={colors.colorNoteJee} ref={ref => this.refTenCuocHop = ref} onChangeText={(value) => this.setState({ pTenCuocHop: value })}>{pTenCuocHop}</TextInput>
                    </View>
                    <View style={styles.coverViewTime}>
                        <View style={styles.itemTime}>
                            <Image source={Images.ImageJee.icTimeJee} style={styles.styleIcon} />
                            <Text style={styles.titleItem}>{'Ngày họp'}</Text>
                            <TouchableOpacity onPress={this._selectDate} style={styles.coverTouch}>
                                {ngaythangnam ?
                                    <Text style={[styles.titleItem, { color: colors.blackJee }]}>{ngaythangnam}</Text> :
                                    <Image source={Images.ImageJee.icAddDate} />}
                            </TouchableOpacity>
                        </View>
                        <View style={styles.line} />
                        <View style={[styles.itemTime]}>
                            <Image source={Images.ImageJee.jwTime} style={styles.styleIcon} />
                            <Text style={styles.titleItem}>{'Thời gian'}</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <TouchableOpacity onPress={() => Utils.goscreen(this, 'Modal_GioPhutPickerBasic', { time: thoigian, _setGioPhut: (time, type) => this.pickDateTime(time, type = 2) })} style={styles.coverTouchTime}>
                                    <Text style={[styles.titleText, { color: thoigian ? colors.blackJee : colors.colorNoteJee }]}>{thoigian || 'Từ giờ'}</Text>
                                </TouchableOpacity>
                                <Text style={styles.gach}>{' - '}</Text>
                                <TouchableOpacity onPress={() => Utils.goscreen(this, 'Modal_GioPhutPickerBasic', { time: dengio, _setGioPhut: (time) => this.handleDenGio(time) })} style={styles.coverTouchTime}>
                                    <Text style={[styles.titleText, { color: dengio ? colors.blackJee : colors.colorNoteJee }]}>{dengio || 'Đến giờ'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    {/* <View style={{ backgroundColor: 'white', marginHorizontal: 10, paddingHorizontal: 10, paddingVertical: 10, borderRadius: 10, marginTop: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Image source={Images.ImageJee.icTaiSanJee} style={styles.styleIcon} />
                            <Text style={styles.titleItem}>{'Phòng họp - Tài sản'}</Text>
                            <TouchableOpacity
                                style={styles.btnDangky}
                                onPress={() => Utils.goscreen(this, 'Modal_DKPhongHop', { date: ngaythangnam, time: thoigian, phongdk: phongDangky, dstaisan: dsTaiSan, callback: (listPhong, listTS) => this.pickPhong_DSTaiSan(listPhong, listTS) })}>
                                <Text style={{ fontSize: reText(14), color: colors.checkGreen }}>{RootLang.lang.JeeMeeting.dangky}</Text>
                            </TouchableOpacity>
                        </View>
                    </View> */}

                    <View style={{ backgroundColor: 'white', marginHorizontal: 10, paddingHorizontal: 10, paddingVertical: 10, borderRadius: 10, marginTop: 24 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Image source={Images.ImageJee.icTaiSanJee} style={styles.styleIcon} />
                            <Text style={styles.titleItem}>{'Phòng họp - Tài sản'}</Text>
                            <TouchableOpacity
                                style={styles.btnDangky}
                                onPress={() => {
                                    if (!pTenCuocHop) {
                                        UtilsApp.MessageShow('Thông báo', 'Vui lòng nhập tên cuộp họp', 4)
                                        return
                                    }
                                    if (ngaythangnam == '' || thoigian == '' || dengio == '') {
                                        UtilsApp.MessageShow('Thông báo', 'Vui lòng chọn thời gian họp', 4)
                                        return
                                    }
                                    Utils.goscreen(this, 'ModalDangKyChung', {
                                        date: ngaythangnam, timeIn: thoigian, timeOut: dengio, listPhongHop: phongDangky, listTaiSan: dsTaiSan, noidunghop: pTenCuocHop,
                                        callback: (listPhong, listTS) => this.pickPhong_DSTaiSan(listPhong, listTS)
                                    })
                                }}>
                                <Text style={{ fontSize: reText(14), color: colors.checkGreen }}>{RootLang.lang.JeeMeeting.dangky}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {
                        phongDangky ?
                            <View style={{ alignItems: 'center', flexDirection: 'row', marginTop: 8, backgroundColor: '#E7E5EE', borderRadius: 22.5, marginHorizontal: 10, paddingHorizontal: 10, paddingVertical: 8 }}>
                                <Text style={{ fontSize: reText(14), color: colors.blackJee, flex: 1, }}><Text style={{ fontWeight: "bold" }}>{phongDangky.TenPhong}, </Text>{moment(phongDangky.BookingDate).format('DD/MM/YYYY')}  {phongDangky.FromTime} - {phongDangky.ToTime}</Text>
                                <TouchableOpacity onPress={() => this.removePhong()} style={{ width: Width(10), justifyContent: 'flex-end', }}>
                                    <View style={{ backgroundColor: colors.bgRed, width: 20, height: 20, borderRadius: 15, alignSelf: 'flex-end', justifyContent: 'center', alignItems: 'center' }}>
                                        <Image source={Images.ImageJee.icDeleteJee} />
                                    </View>
                                </TouchableOpacity>
                            </View> : null
                    }
                    {
                        dsTaiSan.length > 0 ?
                            <FlatList
                                data={dsTaiSan}
                                extraData={this.state}
                                renderItem={this._renderListTaiSan}
                                onEndReachedThreshold={0.1}
                                initialNumToRender={10}
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={(item, index) => index.toString()}
                                ListEmptyComponent={dsTaiSan.length == 0 ? <ListEmpty style={{ justifyContent: 'center', alignItems: 'center', }} textempty={RootLang.lang.JeeMeeting.khongcodulieu} /> : null} />
                            : null
                    }
                    <View style={styles.viewPhongZoom}>
                        <View style={{ flexDirection: 'row', alignSelf: 'center', paddingVertical: 15 }}>
                            <Image source={Images.ImageJee.icZoom} style={{ marginRight: 10, alignSelf: 'center' }} />
                            <Text style={[styles.titleItem, { alignSelf: 'center' }]}>{RootLang.lang.JeeMeeting.sudungzoom}</Text>
                            <Switch
                                style={{ marginRight: -10, transform: [{ scaleX: Platform.OS == 'ios' ? 0.7 : 1 }, { scaleY: Platform.OS == 'ios' ? 0.7 : 1 }] }}
                                trackColor={{ false: colors.black_20, true: colors.checkGreen }}
                                thumbColor="white"
                                ios_backgroundColor={colors.black_20}
                                onValueChange={(value) => this._openZoomORGoogleMeet(1)}
                                value={isZoom}
                            />
                        </View>
                        {
                            isZoom ?
                                <Animatable.View animation={'slideInRight'} >
                                    <View style={{ height: 0.5, backgroundColor: '#C5C4C9' }} />
                                    <TouchableOpacity
                                        style={{ paddingVertical: 15, flexDirection: 'row' }}
                                        onPress={() => this.refKeyZoom.show()}>
                                        <Image source={Images.ImageJee.icPhonghop} style={{ marginRight: 10, alignSelf: 'center', width: Width(5), height: Width(5) }} />
                                        <Text style={[styles.titleItem, { alignSelf: 'center' }]}>{'Phòng họp'}</Text>
                                        {/* itemKeyZoom.TenPhong */}
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ color: colors.blackJee, fontSize: reText(14) }}>{itemKeyZoom.TenPhong}</Text>
                                            <Image source={Images.ImageJee.icDropdown} style={[nstyles.nIcon8, { marginLeft: 3, alignSelf: 'center', tintColor: colors.blackJee, marginBottom: 3 }]}></Image>
                                        </View>
                                    </TouchableOpacity>
                                </Animatable.View>
                                : null
                        }
                    </View>
                    <View style={styles.viewPhong}>
                        <Image source={Images.ImageJee.icGoogleMeet} style={{ marginRight: 10 }} />
                        <Text style={styles.titleItem}>{RootLang.lang.JeeMeeting.sudungggmeet}</Text>
                        <Switch
                            style={{ marginRight: -10, transform: [{ scaleX: Platform.OS == 'ios' ? 0.7 : 1 }, { scaleY: Platform.OS == 'ios' ? 0.7 : 1 }] }}
                            trackColor={{ false: colors.black_20, true: colors.checkGreen }}
                            thumbColor="white"
                            ios_backgroundColor={colors.black_20}
                            onValueChange={(value) => this._openZoomORGoogleMeet(2)}
                            value={isGoogleMeet}
                        />
                    </View>

                    <View style={styles.viewGroup1}>
                        <View style={styles.viewlistnv}>
                            <Image source={Images.ImageJee.icManyPeople} style={{ marginRight: 10, alignSelf: 'center', width: Width(5), height: Width(5) }} />
                            <Text style={styles.titleItem}>{RootLang.lang.JeeMeeting.nguoithamgia}</Text>
                            {this.renderListUser(listUserThamGia)}
                            <TouchableOpacity style={{ width: Width(8), alignItems: 'flex-end', paddingRight: 10, marginLeft: 6 }} onPress={() => Utils.goscreen(this, 'Modal_NhanVien', { callback: (listuser, type) => this.pickNhanVien(listuser, type), list: listUserThamGia, type: 1 })}>
                                <Image source={Images.ImageJee.icChonNguoiThamGia} style={{ width: 30, height: 30, borderRadius: 30 }}></Image>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.lineInfo} />
                        <View style={styles.viewlistnv}>
                            <Image source={Images.ImageJee.icUserJee} style={{ marginRight: 10, alignSelf: 'center', width: Width(5), height: Width(5) }} />
                            <Text style={styles.titleItem}>{RootLang.lang.JeeMeeting.nguoitheodoi}</Text>
                            {this.renderListUser(listUserTheoDoi)}
                            <TouchableOpacity style={{ width: Width(8), alignItems: 'flex-end', paddingRight: 10, marginLeft: 6 }} onPress={() => Utils.goscreen(this, 'Modal_NhanVien', { callback: (listuser, type) => this.pickNhanVien(listuser, type), list: listUserTheoDoi, type: 2 })}>
                                <Image source={Images.ImageJee.icChonNguoiThamGia} style={{ width: 30, height: 30, borderRadius: 30 }}></Image>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.lineInfo} />
                        <TouchableOpacity style={styles.viewGroup} onPress={() => this.setState({ isXacThucThamDu: !isXacThucThamDu })}>
                            <Image source={Images.ImageJee.icTinhTrangJee} style={{ marginRight: 10, alignSelf: 'center', width: Width(5), height: Width(5) }} />
                            <Text style={styles.titleItem}>{RootLang.lang.JeeMeeting.yeucauxacthucthamdu}</Text>
                            <Image
                                source={isXacThucThamDu ? Images.ImageJee.icCheckedJee : Images.ImageJee.icTouchChuaChon}
                                style={[nstyles.nIcon22, { marginRight: 10 }]}
                            ></Image>
                        </TouchableOpacity>
                        <View style={styles.lineInfo} />
                        <View style={{}}>
                            <TouchableOpacity style={styles.viewNguoi} onPress={() => this.setState({ isTomTat: !isTomTat })}>
                                <Image source={Images.ImageJee.icListJee} style={{ marginRight: 10, alignSelf: 'center', width: Width(5), height: Width(5) }} />
                                <Text style={styles.titleItem}>{RootLang.lang.JeeMeeting.batbuoc}</Text>
                                <Image source={isTomTat ? Images.ImageJee.icCheckedJee : Images.ImageJee.icTouchChuaChon} style={[nstyles.nIcon22, { marginRight: 10 }]} />
                            </TouchableOpacity>
                        </View>

                        {
                            isTomTat ?
                                <>
                                    <View style={styles.lineInfo} />
                                    <View style={styles.viewlistnv}>
                                        <Image source={Images.ImageJee.icAccepter} style={{ marginRight: 10, alignSelf: 'center', width: Width(5), height: Width(6) }} />
                                        <Text style={styles.titleItem}>{RootLang.lang.JeeMeeting.nguoinhaptomtat}</Text>
                                        {this.renderListUser(listUserTomTat)}
                                        <TouchableOpacity style={{ paddingRight: 10 }} onPress={() => Utils.goscreen(this, 'Modal_NhanVien', { callback: (listuser, type) => this.pickNhanVien(listuser, type), list: listUserTomTat, type: 3 })}>
                                            <Image source={Images.ImageJee.icChonNguoiThamGia} style={{ width: 30, height: 30, borderRadius: 30 }}></Image>
                                        </TouchableOpacity>
                                    </View>
                                </>
                                : null
                        }
                    </View>

                    <Text style={{ color: colors.colorTitleJee, fontSize: reText(14), paddingHorizontal: 20, marginTop: 20, marginBottom: 5 }}>{'LÝ DO'}</Text>
                    <View style={{ backgroundColor: colors.white, marginHorizontal: 10, borderRadius: 10, paddingVertical: 10, marginBottom: paddingBotX + 130 }}>
                        <TextInput
                            placeholder={RootLang.lang.err.nhaplyloJee}
                            enablesReturnKeyAutomatically={true}
                            multiline={true}
                            blurOnSubmit={true}
                            textAlignVertical={"top"}
                            value={this.state.pGhiChu}
                            style={[nstyles.ntextinput, { maxHeight: nHeight(10), fontSize: reText(14), height: nHeight(8) }]}
                            onChangeText={(textGChu) => this.setState({ pGhiChu: textGChu })}
                        />
                    </View>
                    {/* <View style={styles.viewGhiChu}>
                        <Image source={Images.icChonNgay} style={[nstyles.nIcon20, { marginRight: 10, alignSelf: 'center' }]}></Image>
                        <TextInput
                            placeholder={RootLang.lang.JeeMeeting.nhapghichu}
                            style={{ padding: 0, flex: 1 }}
                            onChangeText={(value) => this.setState({ pGhiChu: value })}
                            multiline={true}
                        >
                            {pGhiChu}
                        </TextInput>
                    </View> */}
                    {/* <ButtonCom
                        text={RootLang.lang.JeeMeeting.luu}
                        styleButton={{ width: Width(80), alignSelf: 'center', marginTop: 30 }}
                        style={{ backgroundColor: colors.greenTab, backgroundColor1: colors.greenTab, borderRadius: 5, }}
                        txtStyle={{ color: 'white', fontSize: 16, fontWeight: '700' }}
                        onPress={() => this.luu()}
                    /> */}


                </KeyboardAwareScrollView >
                <View style={{
                    backgroundColor: colors.backgroudJeeHR, position: 'absolute', bottom: 0, left: 0, paddingBottom: 15 + paddingBotX,
                    margin: 0, width: Width(100), paddingTop: 15
                }}>
                    <TouchableOpacity onPress={() => this.luu()}
                        style={styles.create} >
                        <Text style={{ fontSize: reText(14), color: colors.greenButtonJeeHR, fontWeight: 'bold' }}> {this.type == 1 ? 'Sửa cuộc họp' : 'Tạo cuộc họp'} </Text>
                    </TouchableOpacity>
                </View>
                <ActionSheet ref={ref => this.refKeyZoom = ref}>
                    <ScrollView style={{ maxHeight: nHeight(50) }}>
                        <FlatList
                            style={{ paddingBottom: paddingBotX, }}
                            data={dsKeyZoom}
                            extraData={this.state}
                            renderItem={this._renderDSKeyZoom}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item, index) => index.toString()}
                            ListEmptyComponent={dsKeyZoom.length == 0 ? <ListEmpty style={{ justifyContent: 'center', alignItems: 'center', }} textempty={RootLang.lang.JeeMeeting.khongcodulieu} /> : null} />
                    </ScrollView>
                </ActionSheet>
                <IsLoading ref={this.refLoading} />
            </View >
        )
    }
}
const styles = StyleSheet.create({
    touchBack: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15, marginTop: 15 },
    touchBackChild: { width: Width(15), height: 30 },
    titleBack: { color: colors.checkAwait, fontSize: reText(14) },
    title: { fontSize: reText(18), color: colors.titleJeeHR, fontWeight: 'bold' },
    coverView: { backgroundColor: colors.white, paddingHorizontal: 10, marginHorizontal: 10, paddingVertical: Platform.OS == 'ios' ? 16 : 6, borderRadius: 10 },
    coverViewTime: { backgroundColor: colors.white, marginHorizontal: 10, borderRadius: 10, marginTop: 10 },
    itemTime: { flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 15, justifyContent: 'center', alignItems: 'center' },
    styleIcon: { width: Width(5), height: Width(5), marginRight: 10 },
    titleItem: { fontSize: reText(14), color: colors.colorNoteJee, flex: 1, alignSelf: 'center' },
    titleText: { fontSize: reText(14), color: colors.colorNoteJee },
    gach: { fontSize: reText(14), color: colors.colorNoteJee },
    coverTouch: { width: Width(35), paddingVertical: 6, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.backgroundHistory, borderRadius: 5 },
    coverTouchTime: { width: Width(20), paddingVertical: 6, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.backgroundHistory, borderRadius: 5 },
    line: { height: 0.5, backgroundColor: '#C5C4C9', marginLeft: Width(10) },
    lineInfo: { height: 0.5, backgroundColor: '#C5C4C9', marginLeft: Width(5) },
    inputHeader: {
        padding: 0, fontSize: reText(14), color: colors.blackJee
    },
    viewGroup: {
        flexDirection: 'row', paddingVertical: 15
    },
    btnDangky: {
        paddingVertical: 7, paddingHorizontal: 31, backgroundColor: '#E7F4EF', borderRadius: 5
    },
    viewGroup1: {
        backgroundColor: colors.white, borderTopColor: colors.colorVeryLightPink, marginHorizontal: 10, marginTop: 24, borderRadius: 10, paddingLeft: 10
    },
    viewNguoi: {
        flex: 1, flexDirection: 'row', paddingVertical: 15
    },
    viewlistnv: {
        flex: 1, flexDirection: 'row', paddingVertical: 12
    },
    viewPhong: {
        flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.white, marginHorizontal: 10, marginTop: 5, paddingHorizontal: 10, paddingVertical: 15, borderRadius: 10
    },
    viewPhongZoom: {
        flex: 1, justifyContent: 'space-between', backgroundColor: colors.white, marginHorizontal: 10, marginTop: 24, paddingHorizontal: 10, borderRadius: 10
    },
    viewAvatar: {
        flexDirection: 'row', alignItems: 'center'
    },
    viewGhiChu: {
        backgroundColor: 'white', paddingVertical: 10, paddingHorizontal: 20, flexDirection: 'row', borderTopColor: colors.colorVeryLightPink, borderTopWidth: 1,
    },
    viewHeader: {
        paddingHorizontal: 10
    },
    imgTopHeader: {
        alignSelf: 'center', width: 70, height: 4, marginVertical: 5
    },
    viewDSTaiSan: {
        flexDirection: 'row', alignItems: 'center'
    },
    viewBtnDSTaiSan: {
        backgroundColor: colors.textGray, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 10
    },
    txtTitleAvartar: {
        width: nWidth(36)
    },
    btnKeyZoom: {
        paddingVertical: 15, alignItems: 'center', justifyContent: 'center', borderBottomColor: colors.colorVeryLightPink, borderBottomWidth: 0.5,
    },
    // viewTime: (isWarning) => ({
    //     flexDirection: 'row', alignItems: 'center', width: '28%', paddingVertical: 8, borderBottomColor: isWarning ? colors.redStar : colors.textGray, borderBottomWidth: 0.5
    // }),
    // viewTimeNew: (isWarning) => ({
    //     flexDirection: 'row', alignItems: 'center', width: '39%', paddingVertical: 8, borderBottomColor: isWarning ? colors.redStar : colors.textGray, borderBottomWidth: 0.5
    // }),
    // viewPhut: (isWarning) => ({
    //     flexDirection: 'row', alignItems: 'center', width: '25%', paddingVertical: Platform.OS == 'ios' ? 8 : 5, borderBottomColor: isWarning ? colors.redStar : colors.textGray, borderBottomWidth: 0.5
    // }),
    txtTime: {
        fontSize: 16, flex: 1, textAlign: 'center', color: colors.black_50
    },
    create: {
        borderRadius: 10, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', paddingVertical: 15,
        borderColor: colors.black_20, marginHorizontal: 10,
        backgroundColor: colors.white, width: Width(95)
    }
})
export default ModalTaoCuocHop
