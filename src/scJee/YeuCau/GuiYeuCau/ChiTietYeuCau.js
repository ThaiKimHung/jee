import React, { Component } from 'react'
import { BackHandler, FlatList, Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import ActionSheet from 'react-native-actions-sheet'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { postDuyetYeuCau } from '../../../apis/JeePlatform/API_JeeRequest/apiDuyetYeuCau'
import { getChiTietYeuCau, getTopPicId, postDanhDau, postXoaYeuCau } from '../../../apis/JeePlatform/API_JeeRequest/apiGuiYeuCau'
import { ROOTGlobal } from '../../../app/data/dataGlobal'
import { RootLang } from '../../../app/data/locales'
import Utils from '../../../app/Utils'
import UtilsApp from '../../../app/UtilsApp'
import HeaderComStackV3 from '../../../components/HeaderComStackV3'
import IsLoading from '../../../components/IsLoading'
import IsLoadingBasic from '../../../components/IsLoadingBasic'
import nAvatar from '../../../components/pickChartColorofAvatar'
import { Images } from '../../../images'
import { colors } from '../../../styles'
import { reText } from '../../../styles/size'
import { Height, nstyles, paddingBotX, Width } from '../../../styles/styles'
import Modal_BinhLuan from '../../Social/ModalSocial/Modal_BinhLuan'

export class ChiTietYeuCau extends Component {
    constructor(props) {
        super(props)
        this.typeScreen = Utils.ngetParam(this, 'typeScreen') //typeScreen: 1-List gửi yêu cầu, 2-List duyệt yêu cầu
        this.LoaiManHinh = Utils.ngetParam(this, 'loaimanhinh')
        this.RowID = Utils.ngetParam(this, 'rowid')
        this.index = Utils.ngetParam(this, 'index')
        this.ChiTietYC = Utils.ngetParam(this, 'chitietyc')
        this.Reload = Utils.ngetParam(this, 'reload')
        this.filter = Utils.ngetParam(this, 'valuesFilter')
        this.state = {
            isThongTinYeuCau: true,
            isThongTinKhoiTao: true,
            isLichSuHoatDong: true,
            isBinhLuan: true,
            data: '',
            dsControls: [],
            dsBinhLuan: [],
            isDisable: true,
            topicId: '',
        }
        this.mang = [
            { position: true, type: true, url: Images.ImageJee.icGoBack, title: '', style: {}, onPress: () => { this.Reload ? Utils.goback(this) : Utils.goscreen(this, 'sw_HomePage') } }, // type(true: icon, false:text) // postion(true: trái, false phải)
            { position: false, type: true, url: Images.ImageJee.icFilter, title: '', style: {}, onPress: () => { this.refMenuDropdown.show() } },
        ]
        this.isRemoveItem = false
    }
    componentDidMount = async () => {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        this._getIdTopic()
        this.refIsLoading.show()
        this._loadDS().then(temp => {
            if (temp)
                this.refIsLoading.hide()
        })
    }

    componentWillUnmount() {
        this.backHandler.remove()
    }

    handleBackButton = () => {
        this.goback()
        return true
    };
    replaceItem = (type, item) => {
        //type: 1 đánh dấu, 2 chỉnh sửa, 3 xoá, 4 nhân bản, 5 tình trạng duyệt
        const { isRemoveItem } = this.state
        if (this.ChiTietYC) {
            if (type == 1) {
                if (this.filter == 5 && item.DanhDau == "0" && !this.isRemoveItem) { //filter: Đã đánh dấu, Bỏ đánh dấu, Chưa xoá dữ liệu
                    this.isRemoveItem = !this.isRemoveItem
                    this.Reload(1, this.index)
                } else if (this.filter == 5 && item.DanhDau != "0" && this.isRemoveItem) {//filter: Đã đánh dấu, Đánh dấu, Đã xoá dữ liệu
                    this.isRemoveItem = !this.isRemoveItem
                    this.Reload(4, this.index, this.ChiTietYC)
                }
                else { //filter: Còn lại
                    this.ChiTietYC.DanhDau = item.DanhDau
                    this.Reload(2, this.index, this.ChiTietYC)
                }
            }
            if (type == 2) {
                this.ChiTietYC.TenYeuCau = item.TenYeuCau
                this.ChiTietYC.MoTa = item.MoTa
                this.Reload(2, this.index, this.ChiTietYC)
            }
            if (type == 3)
                this.Reload(1, this.index)
            if (type == 4)
                this.Reload(3)
            if (type == 5) {
                if (this.filter == 0 || this.filter == 5) {
                    if (this.typeScreen == 2)
                        this.ChiTietYC.TinhTrangDuyet = item.TinhTrangDuyet
                    else
                        this.ChiTietYC.Id_TinhTrang = item.Id_TinhTrang
                    if (!this.isRemoveItem)
                        this.Reload(2, this.index, this.ChiTietYC)
                }
                else
                    this.Reload(1, this.index)
            }
        }
    }
    _loadDS = async (type) => {
        //type để check xem có update data không, nếu có thì sẽ replace item bên list data || check replaceItem để biết chi tiết
        let res = await getChiTietYeuCau(this.RowID, this.LoaiManHinh)
        // console.log('res: ', res);
        if (res.status == 1) {
            const data = res.data[0]
            this.setState({ data, dsControls: data.Value })
            if (type == 2 || type == 5)
                this.replaceItem(type, data)
            if (type == 4)
                this.replaceItem(type)
        }
        else {
            UtilsApp.MessageShow(RootLang.lang.JeeRequest.thongbao.thongbao, res.error ? res.error.message : RootLang.lang.JeeRequest.thongbao.loitruyxuatdulieu, 2)
            Utils.goback(this)
        }
        return true
    }
    _getIdTopic = async () => {
        let res = await getTopPicId(this.RowID)
        if (res.status == 1) {
            this.setState({
                topicId: res.data.topicObjectID
            })
        }
    }
    onTick = async () => {
        const { data } = this.state
        let res = await postDanhDau(data.DanhDau, this.RowID)
        if (res.status == 1) {
            this.replaceItem(1, res.data[0])
            this._loadDS()
            this.refMenuDropdown.hide()
        }
    }
    goback = () => {
        Utils.goback(this)
    }
    removeYeuCau = async () => {
        let res = await postXoaYeuCau(this.RowID)
        if (res.status == 1) {
            UtilsApp.MessageShow(RootLang.lang.JeeRequest.thongbao.thongbao, RootLang.lang.JeeRequest.thongbao.xoayeucauthanhcong, 1)
            this.replaceItem(3)
            Utils.goback(this)
        }
        else
            UtilsApp.MessageShow(RootLang.lang.JeeRequest.thongbao.thongbao, res.error ? res.error.message : RootLang.lang.JeeRequest.thongbao.xoayeucauthatbai, 2)
    }
    duyetYeuCau = async (ResultID, NodeID, ResultText) => {
        if (this.state.isDisable) {
            this.setState({ isDisable: false })
            let res = await postDuyetYeuCau(this.RowID, ResultID, NodeID, ResultText)
            if (res.status == 1) {
                ROOTGlobal.GetSoLuongNhacNho.GetSLNhacNho() //Load lại nhắc nhở ở Home
                this._loadDS(5)
            }
            else
                UtilsApp.MessageShow(RootLang.lang.JeeRequest.thongbao.thongbao, res.error.message, 2)
        }

    }
    _loadDSControls = ({ item, index }) => {
        let temp = ''
        if (item.ControlID == 10 || item.ControlID == 12 || item.ControlID == 13 || item.ControlID == 14) {
            temp = JSON.parse(item.Value).map(x => ({ ...x, url: x.src }))
        }
        return (
            <View style={{ marginVertical: 5, marginTop: 5 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                    <Text style={{ width: Width(7), color: colors.gray1, alignSelf: 'flex-start' }}>{index < 9 ? '0' : null}{index + 1 + '. '}</Text>
                    <Text style={{ color: colors.gray1 }}>{item.Title}</Text>
                </View>
                <View style={{ marginLeft: Width(7) }}>
                    {item.ControlID == 10 || item.ControlID == 12 || item.ControlID == 13 || item.ControlID == 14 ?
                        temp.map((x, y) =>
                            item.ControlID == 10 || item.ControlID == 12 ?
                                <TouchableOpacity style={{ marginBottom: 5 }} onPress={() => UtilsApp.showImageZoomViewerr(this, temp)}>
                                    <Text style={{ color: 'blue' }} numberOfLines={1}>{x.filename}</Text>
                                </TouchableOpacity>
                                :
                                item.ControlID == 13 || item.ControlID == 14 ?
                                    <TouchableOpacity style={{ marginBottom: 5 }} onPress={() => UtilsApp.downloadFile(this, x.src, x.filename, '', x.type)}>
                                        <Text style={{ color: 'blue' }} numberOfLines={1}>{x.filename}</Text>
                                    </TouchableOpacity>
                                    :
                                    <Text>{x.filename}</Text>)
                        :
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text >{item.Value}</Text>
                            {item.ControlID == 15 || item.ControlID == 3 ? <Image source={item.ControlID == 15 ? Images.ImageJee.icTime : item.ControlID == 3 ? Images.ImageJee.icDate : null} style={[nstyles.nIcon12, { marginLeft: 5 }]}></Image> : null}
                        </View>}
                </View>
            </View>
        )
    }
    _renderInitializationInformation = (type, item) => {
        var img = Images.JeeCheck, title = '', children = undefined
        switch (type) {
            case 0:
                img = Images.ImageJee.icManyPeople
                title = 'Người yêu cầu'
                children = item?.NhanVien ? <Text style={{ fontSize: 16 }}>{(item.NhanVien[0]?.HoTen).toUpperCase()}</Text> : null
                break;
            case 1:
                img = Images.ImageJee.icDateTime
                title = 'Ngày yêu cầu'
                children = <Text>{Utils.formatTimeAgo(UtilsApp.convertDatetime(item.NgayTao, '', 'MM/DD/YYYY HH:mm') || new Date(), 2)}</Text>
                break;
            case 2:
                img = Images.ImageJee.icAccepter
                title = 'Người duyệt'
                children = (
                    <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
                        <ScrollView horizontal   >
                            {item.NguoiDuyet ?
                                item.NguoiDuyet.map((x, y) =>
                                    <View >
                                        {x.Image ?
                                            <View style={{ marginRight: 5 }}>
                                                <Image source={{ uri: x.Image }} style={[nstyles.nAva35]}></Image>
                                            </View>
                                            :
                                            <View style={[nstyles.nAva28, { backgroundColor: nAvatar(x?.HoTen).color, borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginRight: 5 }]}>
                                                <Text style={{ color: 'white', fontWeight: 'bold' }}>{nAvatar(x?.HoTen).chart}</Text>
                                            </View>}
                                        {x.Status != 0 ?
                                            <Image source={x.Status == 1 ? Images.ImageJee.icBinhChon : Images.ImageJee.icUnBrowser}
                                                style={[nstyles.nIcon12, { position: 'absolute', right: 3, bottom: 0, tintColor: x.Status == 1 ? colors.blurredGreen : null, backgroundColor: 'white', borderRadius: 10 }]}>
                                            </Image>
                                            : null}
                                    </View>
                                )
                                : null}
                        </ScrollView>
                    </View>
                )
                break;
            case 3:
                img = Images.ImageJee.icOClock
                title = 'Ngày hết hạn'
                children = <Text style={{ color: colors.red1, fontWeight: '500', fontSize: 16 }}>{UtilsApp.convertDatetime(item.NgayHetHan || new Date(), 'MM/DD/YYYY HH:mm:ss', 'ddd DD/MM/YYYY HH:mm')}</Text>
                break;
            case 4:
                img = Images.ImageJee.icClock
                title = 'Thời gian xử lý'
                children = <Text>{item.ThoiGianXuLyLoaiYeuCau}h</Text>
                break;

            default:
                break;
        }
        return (
            <View style={{
                paddingVertical: 5, borderBottomColor: colors.colorVeryLightPink, borderBottomWidth: type != 4 ? 1 : 0,
                flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 45
            }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <Image source={img} style={[nstyles.nIcon26, { marginHorizontal: 5 }]} resizeMode='contain'></Image>
                    <Text style={{ color: colors.grey, fontSize: 16, marginLeft: 5 }}>{title}</Text>
                </View>
                {children}
            </View>
        )
    }
    _renderButtonStatus = (status) => {
        var title = RootLang.lang.JeeRequest.boloc.choduyet, color = colors.colorOrange
        if (status == 1) {
            title = RootLang.lang.JeeRequest.boloc.daduyet
            color = colors.textTabActive
        } else if (status == 2) {
            title = RootLang.lang.JeeRequest.boloc.khongduyet
            color = colors.redStar
        }
        return (
            <View style={{ paddingVertical: 5, paddingHorizontal: 10, borderRadius: 20, backgroundColor: color }}>
                <Text style={{ color: 'white', fontWeight: '500', fontSize: 12 }}>{title}</Text>
            </View >
        )
    }

    scrollToBot = () => {
        setTimeout(() => { this.scroll?.props?.scrollToEnd(true) }, Platform.OS == 'ios' ? 1200 : 2200)
    }

    render() {
        const { isThongTinYeuCau, isThongTinKhoiTao, isLichSuHoatDong, isBinhLuan, data, dsControls, topicId } = this.state
        return (
            <View style={{ flex: 1 }}>
                <HeaderComStackV3
                    nthis={this}
                    title={RootLang.lang.JeeRequest.sc_ChiTietYeuCau.chitietyeucau}
                    styleTitle={{ fontWeight: 'bold' }}
                    mang={this.mang}></HeaderComStackV3>
                <View style={{ flex: 1 }}>
                    <KeyboardAwareScrollView
                        innerRef={ref => {
                            this.scroll = ref
                        }}
                        enableAutomaticScroll={true}
                        extraScrollHeight={Platform.OS == 'ios' ? Height(4) : Height(16)}
                        enableOnAndroid={true}
                        nestedScrollEnabled={true}
                        keyboardShouldPersistTaps={"handled"} style={{ backgroundColor: '#E4E6EB', flex: 1 }}>
                        <View style={styles.groupview}>
                            {this.LoaiManHinh == 1 || this.LoaiManHinh == undefined ?
                                (
                                    data.TinhTrangDuyet == 1 ?
                                        <View style={[styles.tinhtrang, { backgroundColor: colors.green3 }]}>
                                            <Image source={Images.ImageJee.icBrowser} style={[styles.image, nstyles.nAva18]}></Image>
                                            <Text style={{ color: colors.grey }}>{RootLang.lang.JeeRequest.sc_ChiTietYeuCau.bandaduyetyeucaunay} {Utils.formatTimeAgo(UtilsApp.convertDatetime(data.ThoiGianDuyet, '', 'MM/DD/YYYY HH:mm:ss') || new Date(), 1, true)}</Text>
                                        </View>
                                        : data.TinhTrangDuyet == 2 ?
                                            <View style={[styles.tinhtrang, { backgroundColor: colors.red2 }]}>
                                                <Image source={Images.ImageJee.icUnBrowser} style={[styles.image, nstyles.nAva18]}></Image>
                                                <Text style={{ color: colors.redtext }}>{RootLang.lang.JeeRequest.sc_ChiTietYeuCau.bandatuchoiyeucaunay} {Utils.formatTimeAgo(UtilsApp.convertDatetime(data.ThoiGianDuyet, '', 'MM/DD/YYYY HH:mm:ss') || new Date(), 1, true)}</Text>
                                            </View> : null
                                )
                                : null
                            }
                            <View style={{ paddingHorizontal: 5, justifyContent: 'center', backgroundColor: 'white' }}>
                                <Text style={{ color: colors.gray1, fontSize: 12, marginBottom: 3 }}>{data.TenLoaiYeuCau || 'Loại yêu cầu'}</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image source={data.DanhDau == '0' ? Images.ImageJee.icNoStar : Images.ImageJee.icStar} style={nstyles.nIcon15}></Image>
                                    <Text style={{ marginLeft: 5, fontSize: 20, fontWeight: 'bold', flex: 1 }}>{data.TenYeuCau || RootLang.lang.JeeRequest.sc_ChiTietYeuCau.tenyeucau}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 5 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={styles.chumonho}>
                                            {RootLang.lang.JeeRequest.sc_ChiTietYeuCau.trangthai + ':  '}
                                        </Text>
                                        {this._renderButtonStatus(data.Id_TinhTrang)}
                                    </View>
                                </View>
                                <Text>{data.MoTa || 'Mô tả'}</Text>
                            </View>
                            <View style={{ marginTop: 20 }}>
                                {Array.from(Array(5), (_, x) => x).map((x, y) =>
                                    this._renderInitializationInformation(y, data)
                                )}
                            </View>
                        </View>

                        <View style={styles.groupview}>
                            <TouchableOpacity
                                style={{ flexDirection: 'row', justifyContent: 'space-between' }}
                                onPress={() => this.setState({ isThongTinYeuCau: !isThongTinYeuCau })}>
                                <Text style={styles.header}>{RootLang.lang.JeeRequest.sc_ChiTietYeuCau.thongtinyeucau}</Text>
                                <Image source={isThongTinYeuCau ? Images.ImageJee.icDropdown : Images.ImageJee.icNoDropDown} style={{ width: 15, height: 15, tintColor: colors.greenTab }}></Image>
                            </TouchableOpacity>
                            {isThongTinYeuCau ?
                                <View>
                                    <FlatList
                                        data={dsControls}
                                        extraData={this.state}
                                        renderItem={this._loadDSControls}
                                        showsVerticalScrollIndicator={false}
                                        keyExtractor={(item, index) => index.toString()}></FlatList>
                                </View> : null}
                        </View>

                        {/* <View style={styles.groupview}>
                            <TouchableOpacity
                                style={{ flexDirection: 'row', justifyContent: 'space-between' }}
                                onPress={() => this.setState({ isThongTinKhoiTao: !isThongTinKhoiTao })}>
                                <Text style={styles.header}>{RootLang.lang.JeeRequest.sc_ChiTietYeuCau.thongtinkhoitao}</Text>
                                <Image source={isThongTinKhoiTao ? Images.ImageJee.icDropdown : Images.ImageJee.icNoDropDown} style={{ width: 15, height: 15, tintColor: colors.greenTab }}></Image>
                            </TouchableOpacity>
                            {isThongTinKhoiTao ?
                                <View>
                                    <View style={styles.gachchan}>
                                        <Text style={styles.chumolon}>{RootLang.lang.JeeRequest.sc_ChiTietYeuCau.nguoitao}</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            {data.NhanVien ?
                                                data.NhanVien[0]?.Image ?
                                                    <Image source={{ uri: data.NhanVien[0]?.Image }} style={[nstyles.nAva35, { marginRight: 5 }]}></Image>
                                                    :
                                                    <View style={[nstyles.nIcon35, { backgroundColor: nAvatar(data.NhanVien[0]?.HoTen).color, borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginRight: 5 }]}>
                                                        <Text style={{ color: 'white', fontSize: reText(16), fontWeight: 'bold' }}>{nAvatar(data.NhanVien[0]?.HoTen).chart}</Text>
                                                    </View>
                                                : null
                                            }
                                            <View>
                                                <Text style={styles.khoangcach}>{data.NhanVien ? data.NhanVien[0]?.HoTen : null}</Text>
                                                <Text style={styles.chumonho}>{data.NhanVien ? data.NhanVien[0]?.ChucVu : null}</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={styles.gachchan}>
                                        <Text style={styles.chumolon}>{RootLang.lang.JeeRequest.sc_ChiTietYeuCau.nguoiduyet}</Text>
                                        {data.NguoiDuyet ?
                                            data.NguoiDuyet.map((x, y) =>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                                                    {x.Image ?
                                                        <View style={{ marginRight: 5 }}>
                                                            <Image source={{ uri: x.Image }} style={[nstyles.nAva35]}></Image>
                                                            {x.Status != 0 ?
                                                                <Image source={x.Status == 1 ? Images.ImageJee.icBinhChon : Images.ImageJee.icUnBrowser}
                                                                    style={[nstyles.nIcon15, { position: 'absolute', right: -3, bottom: 0, tintColor: x.Status == 1 ? colors.blurredGreen : null, backgroundColor: 'white', borderRadius: 10 }]}>
                                                                </Image>
                                                                : null}
                                                        </View>
                                                        :
                                                        <View style={[nstyles.nIcon35, { backgroundColor: nAvatar(x?.HoTen).color, borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginRight: 5 }]}>
                                                            <Text style={{ color: 'white', fontSize: reText(16), fontWeight: 'bold' }}>{nAvatar(x?.HoTen).chart}</Text>
                                                        </View>}
                                                    <View>
                                                        <Text style={styles.khoangcach}>{x?.HoTen}</Text>
                                                        <Text style={styles.chumonho}>{x?.ChucVu}</Text>
                                                    </View>
                                                </View>)
                                            : null}
                                    </View>
                                    <View style={styles.canhngang}>
                                        <Text style={styles.chumolon}>{RootLang.lang.JeeRequest.sc_ChiTietYeuCau.loaiyeucau}</Text>
                                        <Text style={{ color: colors.colorTextOrange }}>{data.TenLoaiYeuCau}</Text>
                                    </View>
                                    <View style={styles.canhngang}>
                                        <Text style={styles.chumolon}>{RootLang.lang.JeeRequest.sc_ChiTietYeuCau.ngaykhoitao}</Text>
                                        <Text>{UtilsApp.convertDatetime(data.NgayTao || new Date())} <Image source={Images.ImageJee.icTime} style={nstyles.nIcon12}></Image></Text>
                                    </View>
                                    <View style={styles.canhngang}>
                                        <Text style={styles.chumolon}>{'Ngày hết hạn'}</Text>
                                        <Text>{UtilsApp.convertDatetime(data.NgayHetHan || new Date(), 'MM/DD/YYYY HH:mm:ss')} <Image source={Images.ImageJee.icTime} style={nstyles.nIcon12}></Image></Text>
                                    </View>
                                    <View style={{ paddingTop: 7.5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} >
                                        <Text style={styles.chumolon}>{RootLang.lang.JeeRequest.sc_ChiTietYeuCau.thoigianxuly + ' (h)'}</Text>
                                        <Text>{data.ThoiGianXuLyLoaiYeuCau}h</Text>
                                    </View>
                                </View> : null
                            }
                        </View> */}

                        <View style={styles.groupview}>
                            <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between' }} onPress={() => this.setState({ isLichSuHoatDong: !isLichSuHoatDong })}>
                                <Text style={[styles.header, { marginBottom: 5 }]}>{RootLang.lang.JeeRequest.sc_ChiTietYeuCau.lichsuhoatdong}</Text>
                                <Image source={isLichSuHoatDong ? Images.ImageJee.icDropdown : Images.ImageJee.icNoDropDown} style={{ width: 15, height: 15, tintColor: colors.greenTab }}></Image>
                            </TouchableOpacity>
                            {isLichSuHoatDong ?
                                <View>
                                    {data.HoatDong ?
                                        data.HoatDong.map((x, y) =>
                                            <View style={[y != data.HoatDong.length - 1 ? styles.gachchan : null, { paddingVertical: 7.5, paddingBottom: y == data.HoatDong.length - 1 ? 0 : 7.5, flexDirection: 'row', }]}>
                                                <Image source={x.Action == 1 ? Images.ImageJee.icTick : x.Action == 2 ? Images.ImageJee.icBrowser : x.Action == 3 ? Images.ImageJee.icUnBrowser : Images.ImageJee.icPen}
                                                    style={[nstyles.nIcon16, { marginRight: 5 }]}></Image>
                                                <View>
                                                    <View style={[styles.khoangcach, { flexDirection: 'row' }]}>
                                                        <Text style={{ fontWeight: 'bold' }}>{x.HoTen}</Text>
                                                        <Text> {x.Content}</Text>
                                                    </View>
                                                    <Text style={styles.chumonho}>{UtilsApp.convertDatetime(x.NgayTao)}</Text>
                                                </View>
                                            </View>)
                                        : null}
                                </View>
                                : null}
                        </View>

                        <View style={[styles.groupview, { paddingHorizontal: 0 }]}>
                            <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, marginBottom: 10 }} onPress={() => this.setState({ isBinhLuan: !isBinhLuan })}>
                                <Text style={styles.header}>{RootLang.lang.JeeRequest.sc_ChiTietYeuCau.binhluan}</Text>
                                <Image source={isBinhLuan ? Images.ImageJee.icDropdown : Images.ImageJee.icNoDropDown} style={{ width: 15, height: 15, tintColor: colors.greenTab }}></Image>
                            </TouchableOpacity>
                            {
                                topicId != '' && isBinhLuan ? (
                                    <Modal_BinhLuan topicId={topicId} nthis={this} request={true} onToDo={this.scrollToBot}></ Modal_BinhLuan>
                                ) : (null)
                            }

                        </View>
                    </KeyboardAwareScrollView>
                    {this.typeScreen == 2 || this.typeScreen == undefined ?
                        <View style={{ marginVertical: 2.5, paddingBottom: paddingBotX, backgroundColor: 'white' }}>
                            {data.NodeKetQua && data.NodeKetQua.length > 0 ?
                                <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 }}>
                                    {data.NodeKetQua.map(obj =>
                                        <TouchableOpacity style={{ width: Width(35), backgroundColor: obj.Color, height: 35, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}
                                            onPress={() => this.duyetYeuCau(obj.ResultID, obj.NodeID, obj.Title)}>
                                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}>{obj.Title}</Text>
                                        </TouchableOpacity>)}
                                </View>
                                : null}
                        </View>
                        : null
                    }
                    <IsLoadingBasic ref={ref => this.refIsLoadingBasic = ref}></IsLoadingBasic>
                    <IsLoading ref={ref => this.refIsLoading = ref}></IsLoading>
                </View >
                <ActionSheet ref={ref => this.refMenuDropdown = ref} style={{ flex: 1 }}>
                    <View style={{ paddingHorizontal: 10, marginBottom: Platform.OS == 'ios' ? 15 : 0 }}>
                        <View style={{ backgroundColor: 'white' }}>
                            <TouchableOpacity
                                style={styles.buttondropdown}
                                onPress={() => {
                                    this.refMenuDropdown.hide()
                                    Utils.goscreen(this, 'sc_GuiYC', {
                                        nhanbanyeucau: 1,
                                        chitietnhanban: data,
                                        id_loaiyeucau: data.Id_LoaiYeuCau,
                                        reload: () => this._loadDS(4)
                                    })
                                }}>
                                <Image source={Images.ImageJee.icNhanBan} style={{ marginHorizontal: 10 }}></Image>
                                <Text style={{ fontSize: reText(16) }}>{RootLang.lang.JeeRequest.boloc.nhanbanyeucau}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.buttondropdown}
                                onPress={() => this.onTick()}>
                                <Image source={data.DanhDau == '0' ? Images.ImageJee.icStar : Images.ImageJee.icNoStar} style={{ marginHorizontal: 10 }}></Image>
                                <Text style={{ fontSize: reText(16) }}>{data.DanhDau == '0' ? RootLang.lang.JeeRequest.boloc.danhdau : RootLang.lang.JeeRequest.boloc.botheodoi}</Text>
                            </TouchableOpacity>
                            {data.IsDelete ?
                                <TouchableOpacity
                                    style={styles.buttondropdown}
                                    onPress={() => { this.refMenuDropdown.hide(), Utils.showMsgBoxYesNo(this, RootLang.lang.JeeRequest.thongbao.thongbao, RootLang.lang.JeeRequest.thongbao.bancochacchanmuonxoayeucau, RootLang.lang.JeeRequest.dungchung.co, RootLang.lang.JeeRequest.dungchung.khong, () => this.removeYeuCau()) }}>
                                    <Image source={Images.ImageJee.icDeleteRequest} style={{ marginHorizontal: 10 }}></Image>
                                    <Text style={{ fontSize: reText(16) }}>{RootLang.lang.JeeRequest.boloc.xoayeucau}</Text>
                                </TouchableOpacity>
                                : null}
                            {data.IsEdit ?
                                <TouchableOpacity
                                    style={styles.buttondropdown}
                                    onPress={() => {
                                        this.refMenuDropdown.hide()
                                        Utils.goscreen(this, 'sc_GuiYC', {
                                            nhanbanyeucau: 2,
                                            chitietnhanban: data,
                                            id_loaiyeucau: data.Id_LoaiYeuCau,
                                            reload: () => this._loadDS(2)
                                        })
                                    }}>
                                    <Image source={Images.ImageJee.icPen} style={{ marginHorizontal: 10 }}></Image>
                                    <Text style={{ fontSize: reText(16) }}>{RootLang.lang.JeeRequest.boloc.chinhsuayeucau}</Text>
                                </TouchableOpacity>
                                : null}
                        </View>
                    </View>
                </ActionSheet>
            </View >
        )
    }
}
const styles = StyleSheet.create({
    image: {
        marginRight: 5,
    },
    header: {
        fontWeight: 'bold',
        fontSize: 18,
        color: colors.green2
    },
    groupview: {
        margin: 7,
        justifyContent: 'center',
        backgroundColor: 'white',
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderRadius: 10
    },
    chumonho: {
        fontSize: 12,
        color: colors.colorText
    },
    chumolon: {
        color: colors.colorText,
        marginBottom: 5,
    },
    tinhtrang: {
        flexDirection: 'row',
        paddingHorizontal: 5,
        alignItems: 'center',
        paddingVertical: 10,
        marginBottom: 10
    },
    canhngang: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: colors.colorLineGray,
        paddingVertical: 7.5
    },
    gachchan: {
        borderBottomWidth: 1,
        borderColor: colors.colorLineGray,
        paddingVertical: 7.5,
    },
    khoangcach: {
        marginBottom: 3,
        fontWeight: 'bold'
    },
    buttondropdown: {
        borderBottomWidth: 1,
        borderBottomColor: colors.lightBlack,
        paddingVertical: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
})

export default ChiTietYeuCau
