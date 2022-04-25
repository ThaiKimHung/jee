import React, { Component } from 'react'
import { Dimensions, Text, View, TouchableOpacity, StyleSheet, LayoutAnimation, Image, BackHandler, ScrollView, Linking, FlatList } from 'react-native'
import { Height, heightHed, heightStatusBar, nstyles, paddingBotX, paddingTopMul, Width } from '../../../styles/styles'
import HeaderCom from '../../../components/HeaderComStackV2'
import Utils from '../../../app/Utils'
import { Images } from '../../../images'
import { colors } from '../../../styles'
import { reText, sizes } from '../../../styles/size'
import TongQuan from './TongQuan'
import BinhLuan from './BinhLuan'
import CongViec from './CongViec'
import { getChiTietCuocHop, getXoaCuocHop, getDongCuocHop, getXacNhanThamGia, postCapNhatTomTatKetLuan } from '../../../apis/JeePlatform/API_JeeMeeting/apiChiTietCuocHop'
import ActionSheet from 'react-native-actions-sheet'
import UtilsApp from '../../../app/UtilsApp'
import { GetCongViecJeeMetting } from '../../../apis/JeePlatform/API_JeeWork/apiDuAn';
import CongViecJeeWork from '../../CongViec/QuanLyDuAn/ChiTietDuAn/CongViec';
import { RootLang } from '../../../app/data/locales'
import IsLoading from '../../../components/IsLoading'
import HeaderMeeting from '../../../components/HeaderMeeting'
import Modal_BinhLuan from '../../Social/ModalSocial/Modal_BinhLuan'
import { getIdTopic } from '../../../apis/JeePlatform/API_JeeMeeting/apiBinhLuan'
import { initZoom, joinMeeting, startMeeting } from '../AwesomeZoomSDK'
import moment from 'moment'
import { nkey } from '../../../app/keys/keyStore'
import nAvatar from '../../../components/pickChartColorofAvatar'
import HTML from 'react-native-render-html'
import ButtonCom from '../../../components/Button/ButtonCom'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default class HomeChiTietTouch extends Component {
    constructor(props) {
        super(props)
        this.index = Utils.ngetParam(this, 'index')
        this.item = Utils.ngetParam(this, 'item', undefined)
        this.rowid = Utils.ngetParam(this, 'rowid')
        this.reload = Utils.ngetParam(this, 'reload')
        this.refLoading = React.createRef()
        this.state = {
            // index: 0,
            dataChiTiet: '',
            IdRoom: '',
            pass: '',
            accessToken: '',
            Name: 'Member',
            showXacNhan: false,
            LinkGoogle: '',
            checkDay: '',
            // routes: [
            //     { key: 'tongquan', title: RootLang.lang.JeeMeeting.tongquan },
            //     { key: 'binhluan', title: RootLang.lang.JeeMeeting.binhluan },
            //     { key: 'congviec', title: RootLang.lang.JeeMeeting.congviec },
            // ],
            // item: [],
            // keyRout: 'tongquan'

            topicId: '',
        }
    }
    componentDidMount() {
        this.backHandler = BackHandler.addEventListener("hardwareBackPress", this._backHandlerButton);
        this.loadChiTietCuocHop()
        this._loadTopPicId()
    }

    componentWillUnmount() {
        this.backHandler.remove()
    }

    loadChiTietCuocHop = async () => {
        this.refLoading.current.show()
        let res = await getChiTietCuocHop(this.rowid)
        if (res.status == 1) {
            if (res.data[0].listid != null) {
                this._GetCongViecJeeMetting(res.data[0].listid)
            }
            this.refLoading.current.hide()
            const userid = await Utils.ngetStorage(nkey.UserId)
            const check = res.data[0].XacNhanThamGiaTuBan?.find(item => item.idUser == userid)
            this.setState({ dataChiTiet: res.data[0], LinkGoogle: res.data[0].LinkGoogle, IdRoom: res.data[0].IdZoom, pass: res.data[0].PwdZoom, showXacNhan: check ? true : false, accessToken: res.data[0].token }, () => this._init())
            this._checkDay()
        } else {
            this.refLoading.current.hide()
            UtilsApp.MessageShow(RootLang.lang.JeeMeeting.thongbao, res.error ? res.error.message : RootLang.lang.JeeMeeting.loitruyxuatdulieu, 2)
        }

    }

    _loadTopPicId = async () => {
        let res = await getIdTopic(this.rowid)
        if (res.status == 1) {
            this.setState({ topicId: res.data?.topicObjectID })
        }
        // nthisLoading.hide()
    }

    _backHandlerButton = () => {
        this._goback()
        return true
    }
    callback = (type, index, item) => {
        this.reload(type, index, item)
        this.loadChiTietCuocHop()
        this.refTongQuan.loadChiTietCuocHop()
    }
    _goback = () => {
        if (this.reload) {
            Utils.goback(this)
        } else {
            Utils.goscreen(this, 'sw_HomePage')
        }
    }

    // loadChiTietCuocHop = async (check = false) => {
    //     nthisLoading.show()
    //     let res = await getChiTietCuocHop(this.rowid)
    //     if (res.status == 1) {
    //         this.setState({ dataChiTiet: res.data[0] })
    //         if (res.data[0].listid != null) {
    //             this._GetCongViecJeeMetting(res.data[0].listid).then(temp => {
    //                 // if (temp) {
    //                 //     this.setState({
    //                 //         routes: [
    //                 //             { key: 'tongquan', title: RootLang.lang.JeeMeeting.tongquan },
    //                 //             { key: 'binhluan', title: RootLang.lang.JeeMeeting.binhluan },
    //                 //             { key: 'congviecJeeWork', title: RootLang.lang.JeeMeeting.congviec },
    //                 //         ],
    //                 //     })
    //                 //     check ? this.setState({ keyRout: 'congviecJeeWork' }) : null
    //                 // }
    //             })
    //         }
    //         nthisLoading.hide()
    //     }
    //     else {
    //         UtilsApp.MessageShow(RootLang.lang.JeeMeeting.thongbao, res.error ? res.error.message : RootLang.lang.JeeMeeting.loitruyxuatdulieu, 2)
    //         nthisLoading.hide()
    //     }
    // }

    _GetCongViecJeeMetting = async (listid) => {
        let res = await GetCongViecJeeMetting(listid)
        if (res.status == 1)
            this.setState({ item: res.data })
        else
            UtilsApp.MessageShow(RootLang.lang.JeeMeeting.tongquan, res.error ? res.error.message : RootLang.lang.JeeMeeting.loitruyxuatdulieu, 2)
        return true
    }


    xoaCuocHop = async () => {
        const { dataChiTiet } = this.state
        let res = await getXoaCuocHop(dataChiTiet.RowID)
        if (res.status == 1) {
            this.reload(1, this.index)
            UtilsApp.MessageShow(RootLang.lang.JeeMeeting.thongbao, RootLang.lang.JeeMeeting.xoacuochopthanhcong, 1)
            this._goback(true)
        }
        else
            UtilsApp.MessageShow(RootLang.lang.JeeMeeting.thongbao, RootLang.lang.JeeMeeting.xoacuochopthatbai, 2)

    }
    dongCuocHop = async () => {
        const { dataChiTiet } = this.state
        let res = await getDongCuocHop(dataChiTiet.RowID)
        if (res.status == 1) {
            this.reload(3)
            UtilsApp.MessageShow(RootLang.lang.JeeMeeting.thongbao, RootLang.lang.JeeMeeting.dongcuochopthanhcong, 1)
        }
        else
            UtilsApp.MessageShow(RootLang.lang.JeeMeeting.thongbao, RootLang.lang.JeeMeeting.dongcuochopthatbai, 2)
        this.loadChiTietCuocHop()
    }

    _checkDay = () => {
        const { dataChiTiet, } = this.state
        let thoiGianKT = moment(dataChiTiet?.BookingDate).add(dataChiTiet?.TimeLimit, 'minutes').format("HH:mm:ss")
        let ngayDienra = moment(dataChiTiet.BookingDate).format('MM/DD/YYYY')
        let ngayTonghop = ngayDienra + ' ' + thoiGianKT
        const x = new Date(ngayTonghop);  // x : ngày và thời gian diễn ra cuộc hợp
        const y = new Date(); // y: ngày và thời gian hiện tại, lấy theo thời gian thật
        if ((x > y) == true) {
            // thời gian diễn ra lơn hơn thời gian hiện tại: => hiện
            this.setState({ checkDay: true })        // false: tắt, true: còn hiện
        }
        else if ((x < y) == true) {
            // thời gian diễn ra bé hơn thời gian hiện tại: => tắt
            this.setState({ checkDay: false })
        }
        else if ((+x === +y) == true) {
            this.setState({ checkDay: true })
        }
        else {
            this.setState({ checkDay: false })
        }
    }

    XacNhanThamGia = async () => {
        let res = await getXacNhanThamGia(this.rowid)
        if (res.status == 1) {
            UtilsApp.MessageShow(RootLang.lang.JeeMeeting.thongbao, RootLang.lang.JeeMeeting.xacnhanthamgiathanhcong, 1)
            this.loadChiTietCuocHop()
        } else {
            UtilsApp.MessageShow(RootLang.lang.JeeMeeting.thongbao, res.error ? res.error.message : RootLang.lang.JeeMeeting.loitruyxuatdulieu, 2)
        }
    }
    renderListUser = (list) => {
        return (
            <View style={{ alignItems: 'flex-end', justifyContent: 'center', width: Width(50), flex: 1, marginRight: 10 }}>

                <TouchableOpacity style={[styles.viewAvatar, { alignItems: 'center' }]}
                    onPress={() => { Utils.goscreen(this, 'Modal_ListUser', { data: list }) }}>
                    {
                        list.length < 6 ? (
                            list.map((item, index) => {
                                return (
                                    item.Image ?
                                        <Image source={{ uri: item.Image }} style={{ width: 30, height: 30, borderRadius: 15 }}></Image>
                                        :
                                        <View style={{ backgroundColor: nAvatar(item.HoTen).color, justifyContent: 'center', alignItems: 'center', width: 30, height: 30, borderRadius: 15 }}>
                                            <Text style={{ color: 'white', fontWeight: 'bold' }}>{nAvatar(item.HoTen).chart}</Text>
                                        </View>
                                )
                            })
                        ) : (
                                <View style={[styles.viewAvatar, { alignItems: 'center' }]}>
                                    {
                                        list.map((item, index) => {
                                            return (
                                                index <= 4 ?
                                                    item.Image ?
                                                        <Image source={{ uri: item.Image }} style={nstyles.nAva32}></Image>
                                                        :
                                                        <View style={{ backgroundColor: nAvatar(item.HoTen).color, justifyContent: 'center', alignItems: 'center', width: 30, height: 30, borderRadius: 15 }}>
                                                            <Text style={{ color: 'white', fontWeight: 'bold' }}>{nAvatar(item.HoTen).chart}</Text>
                                                        </View>
                                                    : null
                                            )
                                        })
                                    }
                                    <View style={{ backgroundColor: colors.checkGreen, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', width: 30, height: 30, borderRadius: 15 }}>
                                        <Text style={{ color: colors.white, fontSize: reText(14), fontWeight: 'bold' }}> +{list.length - 5}</Text>
                                    </View>
                                </View >
                            )
                    }
                </TouchableOpacity>
            </View >
        )
    }
    _renderTaiSanSuDung = ({ item, index }) => {
        let date = moment(this.state.dataChiTiet.BookingDate, 'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DD') == moment(item.BookingDate, 'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DD') ? '' : moment(item.BookingDate, 'YYYY-MM-DDTHH:mm:ss').format('DD/MM/YYYY') + ', '
        let fromTime = moment(item.FromTime).format('HH:mm')
        let toTime = moment(item.ToTime).format('HH:mm')
        return (
            <View style={{ flexDirection: 'row', marginHorizontal: 10, alignItems: 'center', marginTop: 10, justifyContent: 'space-between' }}>
                <View style={{ width: Width(80) }}>
                    <Text style={{ fontSize: reText(14), color: colors.blackJee }}>{item.TenTaiSan} <Text style={{ fontSize: reText(14), color: colors.colorNoteJee }}> ({date}{fromTime + ' - ' + toTime})</Text></Text>
                </View>
                <Image
                    source={item.Status == 1 ? Images.ImageJee.icBrowser : item.Status == 2 ? Images.ImageJee.icUnBrowser : Images.ImageJee.icTime}
                    style={[nstyles.nIcon15, { tintColor: item.Status == 1 || item.Status == 2 ? null : colors.orange }]}
                />
            </View>
        )
    }

    // _initJWT = async () => {
    //     let { accessToken } = this.state
    //     await initZoomJWT(accessToken, "zoom.us")

    // }

    _init = async () => {
        let { dataChiTiet } = this.state
        if (dataChiTiet?.LinkZoom) {
            if (dataChiTiet?.SDKKey && dataChiTiet?.SDKSecret) {
                await initZoom(dataChiTiet?.SDKKey, dataChiTiet?.SDKSecret, "zoom.us")
            }
            else
                UtilsApp.MessageShow(RootLang.lang.JeeMeeting.thongbao, RootLang.lang.JeeMeeting.daxayraloi, 2)
        }
    }

    _joinZoom = async () => {
        let { IdRoom, pass, Name, } = this.state
        await joinMeeting(Name, IdRoom, pass)

    }
    _StartZoom = async () => {
        let { dataChiTiet, IdRoom, Name } = this.state
        await startMeeting(IdRoom, Name, dataChiTiet?.idUserZoom, dataChiTiet?.APIKey, dataChiTiet?.APISecret)
    }

    _JoinGGMeeting = () => {
        if (this.state.LinkGoogle)
            Linking.openURL(this.state.LinkGoogle)
        else
            UtilsApp.MessageShow(RootLang.lang.JeeMeeting.thongbao, RootLang.lang.JeeMeeting.daxayraloi, 2)
    }
    _goInsertTTKL = (type) => { //type: 1-ket luan, 2-tom tat
        const { dataChiTiet } = this.state
        Utils.goscreen(this, 'Modal_EditHTML', {
            title: type == 1 ? 'Kết luận cuộc họp' : 'Tóm tắt cuộc họp',
            isEdit: true,
            content: type == 1 ? dataChiTiet?.KetLuan : dataChiTiet?.TomTatNoiDung,
            callback: (html) => this._saveTTKL(html, dataChiTiet?.RowID, type == 1 ? 2 : 1)
        })
    }
    _saveTTKL = async (html, rowid, type) => {
        const body = {
            "NoiDung": html,
            "meetingid": rowid,
            "type": type
        }
        let res = await postCapNhatTomTatKetLuan(body)
        if (res.status == 1) {
            UtilsApp.MessageShow('Thông báo', 'Cập nhật thành công', 1)
            this.loadChiTietCuocHop()
        }
        else {
            UtilsApp.MessageShow('Thông báo', 'Cập nhật không thành công', 2)
        }
    }

    _goScreenWork = () => {
        this.state.item ?
            Utils.goscreen(this, 'ModalCongViecMeeting',
                {
                    item: this.state.item, jeemeting: true,
                    reload: () => this.loadChiTietCuocHop(true)
                }) :
            Utils.goscreen(this, 'ModalCongViec',
                {
                    rowid: this.rowid,
                    reload: () => this.loadChiTietCuocHop(true)
                })

    }

    render() {
        const { dataChiTiet, SDKKey, SDKSecret, IdRoom, pass, Name, showXacNhan, checkDay } = this.state
        return (
            <View style={[nstyles.ncontainerX, { backgroundColor: colors.backgroudJeeHR }]}>
                <HeaderMeeting
                    // iconLeft={Images.ImageJee.icGoBack}
                    iconRight={Images.ImageJee.icFilter}
                    onPressLeft={() => { Utils.goback(this, null) }}
                    onPressRight={() => this.refChucNang.show()}
                    nthis={this}
                    title={this.item ? this.item.MeetingContent : (dataChiTiet.MeetingContent ? dataChiTiet.MeetingContent : '--')} />
                <KeyboardAwareScrollView style={{ flex: 1 }}>
                    <View>
                        {
                            checkDay ? (
                                dataChiTiet?.GoogleMeet ?
                                    <ButtonCom
                                        check={true}
                                        text={'Tham gia phòng họp'}
                                        onPress={() => this._JoinGGMeeting()}
                                        img={Images.ImageJee.icGoogleMeet}
                                        styleButton={{ marginHorizontal: 10, marginBottom: 24, marginTop: 10 }}
                                        style={{ backgroundColor: colors.checkGreen, backgroundColor1: colors.checkGreen, borderRadius: 10, paddingVertical: 15 }}
                                        txtStyle={{ color: 'white', fontWeight: 'bold', marginLeft: 5, fontSize: reText(14) }}
                                    /> : dataChiTiet.ZoomMeeting ?
                                        <>
                                            {dataChiTiet?.isHost ?
                                                <ButtonCom
                                                    check={true}
                                                    text={'Tham gia phòng họp'}
                                                    onPress={() => dataChiTiet.isHost ? this._StartZoom() : this._joinZoom()}
                                                    img={Images.ImageJee.icZoom}
                                                    styleButton={{ marginHorizontal: 15, marginBottom: 24, marginTop: 10 }}
                                                    style={{ backgroundColor: colors.checkGreen, backgroundColor1: colors.checkGreen, borderRadius: 10, paddingVertical: 15 }}
                                                    txtStyle={{ color: 'white', fontWeight: 'bold', marginLeft: 5, fontSize: reText(14) }}
                                                /> : null}
                                        </>
                                        : null
                            )
                                : null
                        }

                    </View>
                    <View style={[styles.viewGroup, { marginTop: (checkDay && dataChiTiet?.GoogleMeet) || (checkDay && dataChiTiet.ZoomMeeting) ? 0 : 10 }]}>
                        <View style={[styles.viewNguoi, { borderBottomWidth: 0.5, borderColor: colors.grayLine, paddingVertical: 15 }]}>
                            <Text style={{ marginRight: 10, fontSize: reText(14), color: colors.colorNoteJee }}>{RootLang.lang.JeeMeeting.thoigian}</Text>
                            <Text style={{ color: colors.blackJee, marginRight: 10 }}>{!dataChiTiet ? '--' : `${moment(dataChiTiet?.BookingDate).format(" HH:mm - ")}${moment(dataChiTiet?.BookingDate).add(dataChiTiet?.TimeLimit, 'minutes').format("HH:mm")}, ${Utils.formatTimeAgo(moment(dataChiTiet?.BookingDate).format('MM/DD/YYYY HH:mm:ss'), 2, false)}  `}</Text>
                        </View>
                        <View style={[styles.viewNguoi, { borderBottomWidth: 0.5, borderColor: colors.grayLine, paddingVertical: dataChiTiet.ThanhPhanThamGia && dataChiTiet.ThanhPhanThamGia.length > 0 ? 8 : 15 }]}>
                            <Text style={{ marginRight: 10, fontSize: reText(14), color: colors.colorNoteJee }}>{RootLang.lang.JeeMeeting.nguoithamgia}</Text>
                            {dataChiTiet ? this.renderListUser(dataChiTiet.ThanhPhanThamGia) : <Text style={{ color: colors.blackJee, marginRight: 10 }}>{'--'}</Text>}
                        </View>
                        <View style={[styles.viewNguoi, { borderBottomWidth: 0.5, borderColor: colors.grayLine, paddingVertical: dataChiTiet.ThanhPhanTheoDoi && dataChiTiet.ThanhPhanTheoDoi.length > 0 ? 8 : 15 }]}>
                            <Text style={{ marginRight: 10, fontSize: reText(14), color: colors.colorNoteJee }}>{RootLang.lang.JeeMeeting.nguoitheodoi}</Text>
                            {dataChiTiet ? this.renderListUser(dataChiTiet.ThanhPhanTheoDoi) : <Text style={{ color: colors.blackJee, marginRight: 10 }}>{'--'}</Text>}
                        </View>
                        <View style={[styles.viewNguoinhaptomttat, { paddingVertical: dataChiTiet.ThanhPhanNhapTTKT && dataChiTiet.ThanhPhanNhapTTKT.length > 0 ? 8 : 15 }]}>
                            <Text style={{ marginRight: 10, fontSize: reText(14), color: colors.colorNoteJee }}>{RootLang.lang.JeeMeeting.nguoinhap}</Text>
                            {dataChiTiet ? this.renderListUser(dataChiTiet.ThanhPhanNhapTTKT) : <Text style={{ color: colors.blackJee, marginRight: 10 }}>{'--'}</Text>}
                        </View>
                    </View>
                    {[1, 2].map(item =>
                        <View style={[styles.viewGroup, { marginTop: 3, paddingVertical: 15 }]}>
                            <View style={styles.viewTomTat} >
                                <Text style={styles.txtHeaderTTKL}>{item == 1 ? RootLang.lang.JeeMeeting.ketluancuochop : RootLang.lang.JeeMeeting.tomtatcuochop}</Text>
                                {dataChiTiet?.DuocPhepNhapTomTat ?
                                    <TouchableOpacity style={{ width: Width(10) }} onPress={() => this._goInsertTTKL(item)}>
                                        <Image source={Images.ImageJee.icPenJee} style={styles.imgDropdown} />
                                    </TouchableOpacity>
                                    : null
                                }
                            </View>
                            {dataChiTiet?.KetLuan && item == 1 || dataChiTiet?.TomTatNoiDung ?
                                <HTML
                                    source={{ html: item == 1 ? dataChiTiet?.KetLuan : dataChiTiet?.TomTatNoiDung }}

                                    containerStyle={{ paddingHorizontal: 10, paddingVertical: 10, backgroundColor: colors.colorBGHome, borderRadius: 5, marginRight: 10 }} />
                                : dataChiTiet?.DuocPhepNhapTomTat ?
                                    <TouchableOpacity style={styles.btnVietNgay} onPress={() => this._goInsertTTKL(item)}>
                                        <Text style={styles.txtBTNVietNgay}>{item == 1 ? 'Cuộc họp đang chờ kết luận từ bạn.' : 'Cuộc họp đang chờ tóm tắt từ bạn.'} <Text style={{ fontWeight: 'bold' }}>{'Viết Ngay!'}</Text></Text>
                                    </TouchableOpacity>
                                    :
                                    <Text style={styles.txtKoCoNoiDung}>{'--'}</Text>
                            }
                        </View>
                    )}
                    <View style={[styles.viewGroup, { marginTop: 3, paddingVertical: 15, paddingHorizontal: 10 }]}>
                        <Text style={{ fontSize: reText(14), color: colors.blackJee, fontWeight: 'bold' }}>{RootLang.lang.JeeMeeting.taisansudung}</Text>
                        {dataChiTiet?.TaiSanSuDung ?
                            <FlatList
                                data={dataChiTiet?.TaiSanSuDung}
                                extraData={this.state}
                                renderItem={this._renderTaiSanSuDung}
                                onEndReachedThreshold={0.1}
                                initialNumToRender={10}
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                                maxToRenderPerBatch={10}
                                windowSize={7}
                                updateCellsBatchingPeriod={100}
                                keyExtractor={(item, index) => index.toString()}
                                ListEmptyComponent={dataChiTiet ? <Text style={{ marginLeft: 10, color: colors.colorNoteJee, fontSize: reText(14), marginTop: 5 }}>{'--'}</Text> : null}
                            // ListFooterComponent={showload ? <ActivityIndicator size='small' /> : null} 
                            /> :
                            <Text style={{ color: colors.colorNoteJee }}>{'--'}</Text>}
                    </View>
                    <View style={[styles.viewGroup, { marginTop: 3, paddingVertical: 15, paddingHorizontal: 10 }]}>
                        <Text style={{ fontSize: reText(14), color: colors.blackJee, fontWeight: 'bold' }}>{RootLang.lang.JeeMeeting.ghichu}</Text>
                        <Text style={{ color: colors.colorNoteJee, fontSize: reText(14), }}>{dataChiTiet.MeetingNote ? dataChiTiet.MeetingNote : '--'}</Text>
                    </View>

                    <TouchableOpacity onPress={() => this._goScreenWork()} style={{ flexDirection: 'row', backgroundColor: colors.white, marginHorizontal: 10, paddingHorizontal: 10, paddingVertical: this.state.item ? 10 : 15, borderRadius: 10, marginTop: 20, alignItems: 'center' }}>
                        <Image source={Images.ImageJee.icWorkJee} style={{ width: Width(5), height: Width(5) }} />
                        <Text style={{ flex: 1, fontSize: reText(14), marginLeft: 5, color: colors.colorNoteJee }}>{'Công việc'} {this.state.item ? '(' + this.state.item.title + ')' : ''}</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            {this.state.item ? <View style={{ padding: 8, borderRadius: 9999, backgroundColor: '#E7F4EF', marginRight: 5 }}>
                                <Text style={{ fontSize: reText(14), fontWeight: 'bold', color: colors.checkGreen }}>+{this.state.item.Count.tong}</Text>
                            </View> : null}
                            <Image source={Images.ImageJee.icArrowBack} style={{ width: Width(1.2), height: Width(2) }} />
                        </View>
                    </TouchableOpacity>
                    {/* </ScrollView > */}

                    <View style={{ backgroundColor: colors.white, marginHorizontal: 10, paddingVertical: 15, borderRadius: 10, marginTop: 25, marginBottom: showXacNhan ? paddingBotX + 80 : paddingBotX }}>
                        <Text style={{ marginHorizontal: 15, fontSize: reText(14), fontWeight: 'bold', color: colors.checkGreen }}>Bình luận</Text>
                        {this.state.topicId != '' ?
                            <Modal_BinhLuan topicId={this.state.topicId} nthis={this} />
                            : null
                        }
                    </View>
                </KeyboardAwareScrollView>
                {/* {
                        showXacNhan ?
                            <TouchableOpacity style={styles.btnXacNhan
                            } onPress={() => this.XacNhanThamGia()
                            }>
                                <Text style={styles.txtXacNhan}>{RootLang.lang.JeeMeeting.xacnhan}</Text>
                            </TouchableOpacity >
                            : null
                    } */}
                {showXacNhan ?
                    <View style={{
                        backgroundColor: colors.backgroudJeeHR, position: 'absolute', bottom: 0, left: 0, paddingBottom: 15 + paddingBotX,
                        margin: 0, width: Width(100), paddingTop: 15
                    }}>
                        <TouchableOpacity onPress={() => this.XacNhanThamGia()}
                            style={styles.create} >
                            <Text style={{ fontSize: reText(14), color: colors.greenButtonJeeHR, fontWeight: 'bold' }}> {RootLang.lang.JeeMeeting.xacnhan} </Text>
                        </TouchableOpacity>
                    </View> : null}
                <ActionSheet ref={ref => this.refChucNang = ref}>
                    <View style={{ paddingHorizontal: 15, paddingBottom: paddingBotX }}>
                        {
                            dataChiTiet?.isDel == 1 ?
                                <TouchableOpacity style={styles.btnChucNang} onPress={() => { this.refChucNang.hide(), this.xoaCuocHop() }}>
                                    <Image source={Images.ImageJee.icDeleteRequest} style={styles.imgChucNang}></Image>
                                    <Text>{RootLang.lang.JeeMeeting.xoacuochop}</Text>
                                </TouchableOpacity> : null
                        }
                        {
                            dataChiTiet?.Status == 0 && dataChiTiet?.isDel == 1 ?
                                <TouchableOpacity style={styles.btnChucNang}
                                    onPress={() => {
                                        this.refChucNang.hide()
                                        Utils.goscreen(this, 'Modal_TaoCuocHop', {
                                            rowid: this.item.RowID,
                                            index: this.index,
                                            item: this.item,
                                            rowid: dataChiTiet.RowID,
                                            reload: (type, index, item) => this.callback(type, index, item),
                                            type: 1
                                        })
                                    }}>
                                    <Image source={Images.ImageJee.icEditMessage} style={styles.imgChucNang}></Image>
                                    <Text>{RootLang.lang.JeeMeeting.chinhsuacuochop}</Text>
                                </TouchableOpacity> : null
                        }
                        {
                            dataChiTiet.Status != 2 && dataChiTiet.isDel == 1 ?
                                <TouchableOpacity style={styles.btnChucNang} onPress={() => { this.refChucNang.hide(), this.dongCuocHop() }}>
                                    <Image source={Images.ImageJee.icXoaAnh} style={styles.imgChucNang}></Image>
                                    <Text>{RootLang.lang.JeeMeeting.dongcuochop}</Text>
                                </TouchableOpacity>
                                : null
                        }
                        {
                            !(dataChiTiet.Status != 2 && dataChiTiet.isDel == 1) || !(dataChiTiet?.Status == 0 && dataChiTiet?.isDel == 1) || !(dataChiTiet?.isDel == 1) ?
                                <TouchableOpacity style={styles.btnChucNang} onPress={() => this.refChucNang.hide()}>
                                    <Image source={Images.ImageJee.icXoaAnh} style={styles.imgChucNang}></Image>
                                    <Text>{RootLang.lang.JeeMeeting.thoat}</Text>
                                </TouchableOpacity>
                                : null
                        }
                    </View>
                </ActionSheet>
                <IsLoading ref={this.refLoading} />
            </View >
        )
    }
}
const styles = StyleSheet.create({
    viewHeader: {
        paddingTop: paddingTopMul + 10, paddingBottom: 10,
        justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10
    },
    viewHeader1: {
        justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', flex: 1, paddingHorizontal: 10,
    },
    btnBack: {
        flexDirection: 'row', alignItems: 'center'
    },
    btnChucNang: {
        paddingVertical: 15, borderBottomWidth: 0.5, borderBottomColor: colors.colorButtonGray, flexDirection: 'row', alignItems: 'center'
    },
    imgChucNang: {
        ...nstyles.nIcon20, marginRight: 10
    },
    viewNguoi: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    },
    viewAvatar: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: 'blue'
    },
    viewGroup: {
        backgroundColor: colors.white, marginHorizontal: 10, marginBottom: 5, paddingLeft: 10, borderRadius: 10,
    },
    viewGhiChu: {
        // backgroundColor: 'white', paddingVertical: 15, paddingHorizontal: 10, marginTop: 3,
        backgroundColor: 'white', marginHorizontal: 10, marginBottom: 10, padding: 10, borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.25,
        shadowRadius: 1,
        elevation: 5,
    },
    imgGhiChu: {
        marginRight: 10
    },
    viewNote: {
        flexDirection: 'row', alignItems: 'center', marginBottom: 10
    },
    viewAvatar: {
        flexDirection: 'row',
    },
    imgDropdown: {
        ...nstyles.nIcon20, marginRight: 10, alignSelf: 'flex-end'
    },
    viewTomTat: {
        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5
    },
    btnXacNhan: {
        alignSelf: 'center', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.greenTab, paddingVertical: 15, width: Width(95), borderRadius: 10,
        marginBottom: 5, marginTop: 25
        // position: 'absolute', top: nHeight(70)
    },
    txtXacNhan: {
        color: 'white', fontWeight: 'bold', fontSize: reText(14)
    },
    btnVietNgay: {
        paddingVertical: 10, marginVertical: 15, alignSelf: 'center', paddingHorizontal: 20, borderRadius: 22.5, backgroundColor: '#E7F4EF', marginLeft: -10
    },
    txtBTNVietNgay: {
        fontSize: reText(12), color: colors.checkGreen, textAlign: 'center'
    },
    txtKoCoNoiDung: {
        color: colors.colorNoteJee
    },
    txtHeaderTTKL: {
        fontWeight: 'bold', fontSize: reText(14), color: colors.blackJee,
    },
    txtNgayThangNam: {
        color: colors.grey
    },
    viewNguoinhaptomttat: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    },
    create: {
        borderRadius: 10, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', paddingVertical: 15,
        borderColor: colors.black_20, marginHorizontal: 10,
        backgroundColor: colors.white, width: Width(95)
    }
})
