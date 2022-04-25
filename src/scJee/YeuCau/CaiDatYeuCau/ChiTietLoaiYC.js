import React, { Component } from 'react'
import { BackHandler, FlatList, Image, Platform, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native'
import ActionSheet from 'react-native-actions-sheet'
import { getChiTietLoaiYC, getConTrolsChiTietYC, getXoaLoaiYC, postBatBuocLoaiYC, postDanhDauLoaiYC, postUpdateViTriLenMau, postUpdateViTriXuongMau, postXoaMauYC } from '../../../apis/JeePlatform/API_JeeRequest/apiCaiDatYeuCau'
import { RootLang } from '../../../app/data/locales'
import Utils from '../../../app/Utils'
import UtilsApp from '../../../app/UtilsApp'
import HeaderComStackV3 from '../../../components/HeaderComStackV3'
import IsLoading from '../../../components/IsLoading'
import nAvatar from '../../../components/pickChartColorofAvatar'
import { Images } from '../../../images'
import { colors } from '../../../styles'
import { nstyles, Width } from '../../../styles/styles'

export class ChiTietLoaiYC extends Component {
    constructor(props) {
        super(props)
        this.Id_LoaiYeuCau = Utils.ngetParam(this, 'Id_LoaiYeuCau')
        this.ReloadLoaiYC = Utils.ngetParam(this, 'reloadLoaiYC')
        this.state = {
            isThongTinMoTa: true,
            isThongTinKhoiTao: true,
            isLichSuHoatDong: true,
            isSwitch: true,
            chiTietYC: '',
            thongTinNguoiTao: '',
            dsControls: [],
            dsNguoiDuyet: [],
            viTriNutBanDau: -1
        }
        this.mang = [
            { position: true, type: true, url: Images.ImageJee.icGoBack, title: '', style: {}, onPress: () => this.goBack() }, // type(true: icon, false:text) // postion(true: trái, false phải)
            { position: false, type: true, url: Images.ImageJee.icFilter, title: '', style: {}, onPress: () => { this.refs.refActionSheet.show() } },
        ]
    }
    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        nthisLoading.show()
        this._loadChiTietLoaiYC().then(res => {
            if (res)
                nthisLoading.hide()
        })
        this._loadControls()
    }

    componentWillUnmount() {
        this.backHandler.remove()
    }

    handleBackButton = () => {
        this.goBack()
        return true
    };
    _loadChiTietLoaiYC = async () => {
        let res = await getChiTietLoaiYC(this.Id_LoaiYeuCau)
        Utils.nlog('==> chi tiet loai yeu cau: ', res.data[0])
        if (res.status == 1) {
            this.setState({ chiTietYC: res.data[0], thongTinNguoiTao: res.data[0].CreatedBy[0], dsNguoiDuyet: res.data[0].listValues })
        }
        return true
    }
    _loadControls = async () => {
        const { dsControls } = this.state
        let res = await getConTrolsChiTietYC('', '', this.Id_LoaiYeuCau)
        if (res.status == 1) {
            const mangControls = res.data.length == 0 ? [] : res.data.map((obj, y) => ({ ...obj, check: obj.RowID == dsControls.find(item => item.check == true)?.RowID ? true : false }))
            this.setState({ dsControls: mangControls })
        }
    }
    onTick = async () => {
        const { chiTietYC } = this.state
        let res = await postDanhDauLoaiYC(chiTietYC.DanhDau, this.Id_LoaiYeuCau)
        if (res.status == 1) {
            this._loadChiTietLoaiYC()
        }
    }
    onForced = async (id_row, value, index) => {
        const { dsControls } = this.state
        dsControls[index].IsRequired = !dsControls[index].IsRequired
        this.setState({ dsControls: dsControls })
        let res = await postBatBuocLoaiYC(id_row, value)
        if (res.status == 1) {

        }
        else
            UtilsApp.MessageShow(RootLang.lang.JeeRequest.thongbao.thongbao, res.error ? res.error.message : RootLang.lang.JeeRequest.thongbao.loitruyxuatdulieu, 2)
    }
    removeLoaiYC = async () => {
        const { chiTietYC } = this.state
        let res = await getXoaLoaiYC(this.Id_LoaiYeuCau)
        if (res.status == 1) {
            UtilsApp.MessageShow(RootLang.lang.JeeRequest.thongbao.thongbao, RootLang.lang.JeeRequest.thongbao.xoayeucauthanhcong, 1)
            this.goBack()
        }
        else {
            UtilsApp.MessageShow(RootLang.lang.JeeRequest.thongbao.thongbao, res.error ? res.error.message : RootLang.lang.JeeRequest.thongbao.xoayeucauthatbai, 2)
        }
    }
    goBack = () => {
        this.ReloadLoaiYC().then(() => Utils.goback(this))
    }
    removeMau = async (Id_row) => {
        let res = await postXoaMauYC(Id_row, this.Id_LoaiYeuCau)
        if (res.status == 1)
            this._loadControls()
    }
    updateViTriXuong = async (Id_row, index) => {
        let res = await postUpdateViTriXuongMau(Id_row, this.Id_LoaiYeuCau, index + 1)
        if (res.status == 1)
            this.setState({ viTriNutBanDau: index + 1 }, () => this._loadControls())
    }
    updateViTriLen = async (Id_row, index) => {
        let res = await postUpdateViTriLenMau(Id_row, this.Id_LoaiYeuCau, index + 1)
        if (res.status == 1)
            this.setState({ viTriNutBanDau: index - 1 }, () => this._loadControls())
    }
    onOpen = (index) => {
        const { dsControls } = this.state
        const temp = dsControls[index].check
        if (temp == true)
            dsControls[index].check = false
        else {
            dsControls.forEach((x, y) => {
                dsControls[y].check = false
            })
            dsControls[index].check = true
        }
        this.setState({ dsControls: dsControls })
    }
    _loadMauDeXuat = ({ item, index }) => {
        return (
            <View style={{ paddingHorizontal: 10, paddingVertical: 10, backgroundColor: 'white', borderColor: colors.colorButtonGray, borderTopWidth: index == 0 ? 0 : 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={Images.ImageJee.icIconMuc} style={[{ tintColor: 'black', marginRight: 5 }, nstyles.nIcon13]}></Image>
                    <Text>{item.Title}</Text>
                </View>
                {item.Description ? <Text style={[styles.chumonho, { color: colors.colorGrayText }]}>{item.Description}</Text> : null}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ backgroundColor: colors.lightBlack, width: 70, height: 20, alignItems: 'center', justifyContent: 'center', borderRadius: 15 }}>
                            <Text style={{ fontSize: 10 }}>{item.Control}</Text>
                        </View>
                        <Switch
                            style={{ transform: [{ scaleX: Platform.OS == 'ios' ? 0.5 : 0.8 }, { scaleY: Platform.OS == 'ios' ? 0.5 : 0.8 }] }}
                            trackColor={{ false: 'gray', true: 'teal' }}
                            thumbColor="white"
                            ios_backgroundColor="gray"
                            onValueChange={(value) => this.onForced(item.RowID, value, index)}
                            value={item.IsRequired}
                        />
                        {item.IsRequired ? <Text style={{ color: colors.orangeSix, fontSize: 12 }}>Bắt buộc*</Text> : <Text style={{ fontSize: 12 }}>Không bắt buộc</Text>}
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {item.check ?
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TouchableOpacity onPress={() => Utils.goscreen(this, 'Modal_MauYC', { id_loaiyeucau: this.Id_LoaiYeuCau, rowid: 0, reloadControls: () => this._loadControls(), vitrithem: index, mau: item, typescreen: 1 })}>
                                    <Image source={Images.ImageJee.icThemLuaChon} style={[nstyles.nIcon16, styles.icMauDeXuat]}></Image>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => Utils.showMsgBoxYesNo(this, 'Thông báo', 'Bạn có chắc chắn muốn xoá', 'Có', 'Không', () => this.removeMau(item.RowID))}>
                                    <Image source={Images.ImageJee.icXoaLuaChon} style={[nstyles.nIcon16, styles.icMauDeXuat]}></Image>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.setState({ viTriNutBanDau: index }, () => Utils.goscreen(this, 'Modal_MauYC', { id_loaiyeucau: this.Id_LoaiYeuCau, rowid: item.RowID, reloadControls: () => this._loadControls(), mau: item, typescreen: 2 }))}>
                                    <Image source={Images.ImageJee.icPen} style={[nstyles.nIcon16, styles.icMauDeXuat]}></Image>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.updateViTriXuong(item.RowID, index)}>
                                    <Image source={Images.ImageJee.icDropdown} style={[nstyles.nIcon16, styles.icMauDeXuat]}></Image>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.updateViTriLen(item.RowID, index)}>
                                    <Image source={Images.ImageJee.icDropdownReverse} style={[nstyles.nIcon16, styles.icMauDeXuat]}></Image>
                                </TouchableOpacity>
                            </View> : null}
                        <TouchableOpacity onPress={() => this.onOpen(index)}>
                            <Image source={Images.ImageJee.icFilter} style={[nstyles.nIcon20, { marginHorizontal: 10 }]}></Image>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
    render() {
        const { isThongTinMoTa, isThongTinKhoiTao, isLichSuHoatDong, chiTietYC, thongTinNguoiTao, dsControls, dsNguoiDuyet } = this.state
        return (
            <View style={{ flex: 1 }}>
                <HeaderComStackV3
                    nthis={this}
                    mang={this.mang}
                    title={RootLang.lang.JeeRequest.sc_ChiTietLoaiYC.chitietloaiyeucau}>
                </HeaderComStackV3>
                <ScrollView>
                    <View style={styles.groupview}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>{chiTietYC.TenLoaiYeuCau}</Text>
                        <Text style={styles.chumonho}>{chiTietYC.MoTa}</Text>
                    </View>
                    <View style={{ backgroundColor: 'white', paddingVertical: 5, paddingHorizontal: 10 }}>
                        <View style={{ flexDirection: 'row', paddingVertical: 5, alignItems: 'center', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image source={Images.ImageJee.icIconMuc} style={[styles.image, nstyles.nIcon13]}></Image>
                                <Text>{RootLang.lang.JeeRequest.sc_ChiTietLoaiYC.tenyeucau}</Text>
                            </View>
                            <View style={{ width: 60, height: 20, backgroundColor: colors.lightBlack, alignItems: 'center', justifyContent: 'center', borderRadius: 20 }}>
                                <Text style={{ fontSize: 12 }}>Text</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', paddingVertical: 5, alignItems: 'center', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image source={Images.ImageJee.icIconMuc} style={[styles.image, nstyles.nIcon13]}></Image>
                                <Text>{RootLang.lang.JeeRequest.sc_ChiTietLoaiYC.motayeucau}</Text>
                            </View>
                            <View style={{ width: 60, height: 20, backgroundColor: colors.lightBlack, alignItems: 'center', justifyContent: 'center', borderRadius: 20 }}>
                                <Text style={{ fontSize: 12 }}>Text</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.groupview}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={styles.header}>{RootLang.lang.JeeRequest.sc_ChiTietLoaiYC.maudexuat.toUpperCase()}</Text>
                            <TouchableOpacity onPress={() => Utils.goscreen(this, 'Modal_MauYC', { id_loaiyeucau: this.Id_LoaiYeuCau, rowid: 0, reloadControls: () => this._loadControls(), typescreen: 0 })}>
                                <Image source={Images.ImageJee.icImportKind} style={[{ tintColor: 'black' }, nstyles.nIcon20]}></Image>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={dsControls}
                            extraData={this.state}
                            renderItem={this._loadMauDeXuat}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(item, index) => index.toString()} />
                    </View>
                    <View style={styles.groupview}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={styles.header}>{RootLang.lang.JeeRequest.sc_ChiTietLoaiYC.thongtinkhoitao.toUpperCase()}</Text>
                            <TouchableOpacity onPress={() => this.setState({ isThongTinKhoiTao: !isThongTinKhoiTao })}>
                                <Image source={Images.ImageJee.icDropdown} style={{ width: 15, height: 15, tintColor: colors.greenTab }}></Image>
                            </TouchableOpacity>
                        </View>
                        {isThongTinKhoiTao ?
                            <View>
                                <View style={styles.gachchan}>
                                    <Text style={styles.chumolon}>{RootLang.lang.JeeRequest.sc_ChiTietLoaiYC.nguoitao}</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        {!thongTinNguoiTao?.Image ?
                                            <View style={[nstyles.nIcon35, { backgroundColor: nAvatar(thongTinNguoiTao.Hoten).color, borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginRight: 5 }]}>
                                                <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>{nAvatar(thongTinNguoiTao.Hoten).chart}</Text>
                                            </View> :
                                            <Image source={{ uri: thongTinNguoiTao.Image }} style={[nstyles.nAva35, { marginRight: 5 }]}></Image>
                                        }
                                        <View>
                                            <Text style={styles.khoangcach}>{thongTinNguoiTao ? thongTinNguoiTao.Hoten : null}</Text>
                                            <Text style={styles.chumonho}>{thongTinNguoiTao?.ChucVu}</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.canhngang}>
                                    <Text style={styles.chumolon}>{RootLang.lang.JeeRequest.sc_ChiTietLoaiYC.ngaykhoitao}</Text>
                                    <Text>{UtilsApp.convertDatetime(chiTietYC.CreatedDate)} <Image source={Images.ImageJee.icTime} style={nstyles.nIcon12}></Image></Text>
                                </View>
                                <View style={styles.gachchan}>
                                    <Text style={styles.chumolon}>{RootLang.lang.JeeRequest.sc_ChiTietLoaiYC.nguoiduyet}</Text>
                                    {dsNguoiDuyet ? dsNguoiDuyet.map((item, index) =>
                                        item.Item.map((x, y) =>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                                                {!x.Image ?
                                                    <View style={[nstyles.nIcon35, { backgroundColor: nAvatar(x.HoTen).color, borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginRight: 5 }]}>
                                                        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>{nAvatar(x.HoTen).chart}</Text>
                                                    </View> :
                                                    <Image source={{ uri: x.Image }} style={[nstyles.nAva35, { marginRight: 5 }]}></Image>}
                                                <View style={{ flex: 1 }}>
                                                    <Text style={styles.khoangcach}>{x.HoTen}</Text>
                                                    <Text style={styles.chumonho}>{x.ChucVu}</Text>
                                                </View>
                                            </View>)
                                    ) : null}
                                </View>
                                <View style={styles.canhngang}>
                                    <Text style={styles.chumolon}>{RootLang.lang.JeeRequest.sc_ChiTietLoaiYC.thuocnhom}</Text>
                                    <Text style={{ color: colors.colorTextOrange }}>{chiTietYC.TenNhom}</Text>
                                </View>
                                <View style={styles.canhngang}>
                                    <Text style={styles.chumolon}>{RootLang.lang.JeeRequest.sc_ChiTietLoaiYC.thoigiankhoitao}</Text>
                                    <Text>{UtilsApp.convertDatetime(chiTietYC.CreatedDate)}</Text>
                                </View>
                                <View style={styles.canhngang}>
                                    <Text style={styles.chumolon}>{RootLang.lang.JeeRequest.sc_ChiTietLoaiYC.capnhatgannhat}</Text>
                                    <Text>{chiTietYC.CapNhatGanNhat ? Utils.formatTimeAgo(chiTietYC.CapNhatGanNhat + 'Z', 1, true) : null}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 7.5 }}>
                                    <Text style={styles.chumolon}>{RootLang.lang.JeeRequest.sc_ChiTietLoaiYC.hinhthuccapnhat}</Text>
                                    <Text style={{ color: colors.colorTextOrange }}>{chiTietYC.TenQuyTrinh}</Text>
                                </View>
                            </View> : null
                        }
                    </View>
                    <View style={{ flexDirection: 'row', backgroundColor: 'white', marginTop: 1, paddingVertical: 10 }}>
                        <View style={{ width: Width(33), justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderRightColor: colors.colorLineGray }}>
                            <Text style={styles.chumolon}>{RootLang.lang.JeeRequest.sc_ChiTietLoaiYC.khoitao}</Text>
                            <Text style={{ fontSize: 20, color: 'black', fontWeight: 'bold' }}>{chiTietYC.ThongTin?.KhoiTao}</Text>
                        </View>
                        <View style={{ width: Width(33), justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderRightColor: colors.colorLineGray }}>
                            <Text style={styles.chumolon}>{RootLang.lang.JeeRequest.sc_ChiTietLoaiYC.daxuly}</Text>
                            <Text style={{ fontSize: 20, color: colors.colorTextOrange, fontWeight: 'bold' }}>{chiTietYC.ThongTin?.DaXuLy}</Text>
                        </View>
                        <View style={{ width: Width(33), justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={styles.chumolon}>{RootLang.lang.JeeRequest.sc_ChiTietLoaiYC.daduyet}</Text>
                            <Text style={{ fontSize: 20, color: colors.colorTabActive, fontWeight: 'bold' }}>{chiTietYC.ThongTin?.DaDuyet}</Text>
                        </View>
                    </View>
                    <ActionSheet ref={'refActionSheet'} style={{ flex: 1 }}>
                        <View style={{ marginBottom: Platform.OS == 'ios' ? 15 : 0 }} >
                            {/* <HeaderModalCom onPress={() => this.refs.refActionSheet.hide()} title='Lọc loại yêu cầu' /> */}
                            <TouchableOpacity style={styles.refActionSheet}
                                onPress={() => { this.refs.refActionSheet.hide(), Utils.goscreen(this, 'Modal_ThemLoaiYeuCau', { Id_LoaiYeuCau: this.Id_LoaiYeuCau, chiTietYeuCau: chiTietYC, _load: () => this._loadChiTietLoaiYC() }) }}>
                                <Image source={Images.ImageJee.icPen} style={[nstyles.nIcon20, styles.textRef]}></Image>
                                <Text style={{ fontSize: 16 }}>{RootLang.lang.JeeRequest.boloc.chinhsualoaiyeucau}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.refActionSheet} onPress={() => this.onTick()}>
                                <Image source={chiTietYC.DanhDau != '0' ? Images.ImageJee.icNoStar : Images.ImageJee.icStar} style={[nstyles.nIcon20, styles.textRef]}></Image>
                                <Text style={{ fontSize: 16 }}>{chiTietYC.DanhDau != '0' ? RootLang.lang.JeeRequest.boloc.khongdanhdau : RootLang.lang.JeeRequest.boloc.danhdau}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.refActionSheet}
                                onPress={() => { this.refs.refActionSheet.hide(), Utils.showMsgBoxYesNo(this, RootLang.lang.JeeRequest.thongbao.thongbao, RootLang.lang.JeeRequest.thongbao.bancomuonxoaloaiyeucau, RootLang.lang.JeeRequest.dungchung.co, RootLang.lang.JeeRequest.dungchung.khong, () => this.removeLoaiYC()) }}>
                                <Image source={Images.ImageJee.icDeleteRequest} style={[nstyles.nIcon20, styles.textRef]}></Image>
                                <Text style={{ fontSize: 16 }}>{RootLang.lang.JeeRequest.boloc.xoaloaiyeucau}</Text>
                            </TouchableOpacity>
                        </View>
                    </ActionSheet>
                    <IsLoading></IsLoading>
                </ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    image: {
        marginRight: 5,
        tintColor: 'black'
    },
    header: {
        fontWeight: 'bold',
        fontSize: 16,
        color: colors.greenTab
    },
    groupview: {
        paddingHorizontal: 10,
        backgroundColor: 'white',
        marginBottom: 5,
        paddingVertical: 15
    },
    chumonho: {
        fontSize: 12,
        // color: colors.colorText
    },
    chumolon: {
        fontSize: 14,
        color: colors.colorText,
        marginBottom: 5
    },
    tinhtrang: {
        flexDirection: 'row',
        paddingLeft: Width(5),
        alignItems: 'center',
        height: Width(6),
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
    refActionSheet:
    {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 0.5,
        borderBottomColor: colors.lightBlack,
        paddingVertical: 20
    },
    textRef: {
        marginHorizontal: 10
    },
    icMauDeXuat: {
        tintColor: colors.textGray, marginHorizontal: 5
    }
})

export default ChiTietLoaiYC
