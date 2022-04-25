import React, { Component } from 'react'
import { Dimensions, Text, View, TouchableOpacity, StyleSheet, LayoutAnimation, Image, BackHandler } from 'react-native'
import { Height, heightHed, heightStatusBar, nstyles, paddingBotX, paddingTopMul, Width } from '../../../styles/styles'
import HeaderCom from '../../../components/HeaderComStackV2'
import Utils from '../../../app/Utils'
import { TabView, SceneMap } from 'react-native-tab-view'
import { Images } from '../../../images'
import { colors } from '../../../styles'
import { reText, sizes } from '../../../styles/size'
import TongQuan from './TongQuan'
import BinhLuan from './BinhLuan'
import CongViec from './CongViec'
import { getChiTietCuocHop, getXoaCuocHop, getDongCuocHop } from '../../../apis/JeePlatform/API_JeeMeeting/apiChiTietCuocHop'
import ActionSheet from 'react-native-actions-sheet'
import UtilsApp from '../../../app/UtilsApp'
import { ChiTietDuAn, GetCongViecJeeMetting } from '../../../apis/JeePlatform/API_JeeWork/apiDuAn';
import CongViecJeeWork from '../../CongViec/QuanLyDuAn/ChiTietDuAn/CongViec';
import { RootLang } from '../../../app/data/locales'
import moment from 'moment'
// import IsLoading from '../../../components/IsLoading'

export default class HomeChiTiet extends Component {
    constructor(props) {
        super(props)
        this.index = Utils.ngetParam(this, 'index')
        this.item = Utils.ngetParam(this, 'item')
        this.rowid = Utils.ngetParam(this, 'rowid')
        this.reload = Utils.ngetParam(this, 'reload')
        this.state = {
            index: 0,
            dataChiTiet: '',
            routes: [
                { key: 'tongquan', title: RootLang.lang.JeeMeeting.tongquan },
                { key: 'binhluan', title: RootLang.lang.JeeMeeting.binhluan },
                { key: 'congviec', title: RootLang.lang.JeeMeeting.congviec },
            ],
            item: []
        }
    }
    componentDidMount() {
        this.backHandler = BackHandler.addEventListener("hardwareBackPress", this._backHandlerButton);
        this.loadChiTietCuocHop()
    }

    componentWillUnmount() {
        this.backHandler.remove()
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
    loadChiTietCuocHop = async () => {
        // nthisLoading.show()
        let res = await getChiTietCuocHop(this.rowid)
        Utils.nlog('Chi tiết cuộc họp: ', res)
        if (res.status == 1) {
            this.setState({ dataChiTiet: res.data[0] })
            if (res.data[0].listid != null) {
                this._GetCongViecJeeMetting(res.data[0].listid).then(temp => {
                    if (temp) {
                        this.setState({
                            routes: [
                                { key: 'tongquan', title: RootLang.lang.JeeMeeting.tongquan },
                                { key: 'binhluan', title: RootLang.lang.JeeMeeting.binhluan },
                                { key: 'congviecJeeWork', title: RootLang.lang.JeeMeeting.congviec },
                            ],
                        })
                    }
                })
            }
        }
        else {
            UtilsApp.MessageShow(RootLang.lang.JeeMeeting.thongbao, res.error ? res.error.message : RootLang.lang.JeeMeeting.loitruyxuatdulieu, 2)
        }
        // nthisLoading.hide()
    }

    _GetCongViecJeeMetting = async (listid) => {
        let res = await GetCongViecJeeMetting(listid)
        if (res.status == 1)
            this.setState({ item: res.data })
        else
            UtilsApp.MessageShow(RootLang.lang.JeeMeeting.tongquan, res.error ? res.error.message : RootLang.lang.JeeMeeting.loitruyxuatdulieu, 2)
        return true
    }

    _renderScene = SceneMap({
        tongquan: () => <TongQuan nthis={this} rowid={this.rowid} ref={ref => this.refTongQuan = ref} />,
        binhluan: () => <BinhLuan nthis={this} rowid={this.rowid} />,
        congviec: () => <CongViec nthis={this} rowid={this.rowid} reload={() => this.loadChiTietCuocHop()} />,
        congviecJeeWork: () => <CongViecJeeWork nthis={this} item={this.state.item} jeemeting={true} />,
    });
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
    _renderTabBar = props => {
        LayoutAnimation.easeInEaseOut()
        var { index = 0 } = props.navigationState
        const { dataChiTiet, item } = this.state
        const tenTaiSan = dataChiTiet?.DiaDiem?.split(',')[0]
        const thoigianTaiSan = dataChiTiet?.DiaDiem?.split(',')[1] + ',' + dataChiTiet?.DiaDiem?.split(',')[2]
        return (
            <View>
                {/* {
                    index == 0 && dataChiTiet?.DiaDiem ?
                        <View
                            style={[nstyles.shadowTabTop, {
                                height: Height(5), flexDirection: 'row', width: Width(100), backgroundColor: 'white', justifyContent: 'space-between',
                                borderTopColor: colors.textGray, borderTopWidth: 0.5, paddingHorizontal: 15, alignItems: 'center'
                            }]}>
                            <Text style={styles.txtNgayThangNam}>{thoigianTaiSan}</Text>
                            <Text style={styles.txtNgayThangNam}>{tenTaiSan}</Text>
                        </View> : dataChiTiet.BookingDate ? <View
                            style={[nstyles.shadowTabTop, {
                                height: Height(5), flexDirection: 'row', width: Width(100), backgroundColor: 'white', justifyContent: 'space-between',
                                borderTopColor: colors.textGray, borderTopWidth: 0.5, paddingHorizontal: 15, alignItems: 'center'
                            }]}>
                            <Text style={styles.txtNgayThangNam}>{`${moment(dataChiTiet.BookingDate).format("ddd, DD/MM/YYYY, HH:mm - ")} ${moment(dataChiTiet.BookingDate).add(dataChiTiet.TimeLimit, 'minutes').format("HH:mm")} `}</Text>
                        </View>
                            :
                            null
                } */}
                {
                    index == 2 && dataChiTiet?.listid != null ?
                        <View
                            style={[nstyles.shadowTabTop, {
                                height: Height(5), flexDirection: 'row', width: Width(100), backgroundColor: 'white',
                                borderTopColor: colors.textGray, borderTopWidth: 0.5, paddingHorizontal: 15, alignItems: 'center'
                            }]}>
                            <Text style={styles.txtNgayThangNam}>{item.title}</Text>
                        </View>
                        : null
                }
                <View style={[nstyles.shadowTabTop, { height: Height(5), flexDirection: 'row', width: Width(100), borderTopColor: colors.textGray, borderTopWidth: 0.5 }]}>
                    {
                        props.navigationState.routes.map((x, i) => {
                            return (
                                <TouchableOpacity
                                    key={i.toString()}
                                    onPress={() => { this.setState({ index: i }) }}
                                    style={{ flex: 1, backgroundColor: colors.white, flexDirection: 'row', justifyContent: 'center' }}>
                                    <View
                                        style={{
                                            height: '100%', justifyContent: 'center', alignItems: 'center',
                                            borderBottomWidth: i == index ? 2 : 0, borderBottomColor: i == index ? colors.colorTabActive : null
                                        }}>
                                        <Text style={{ fontWeight: 'bold', fontSize: sizes.sText14, color: i == index ? colors.colorTabActive : null, textAlign: 'center', }}>{x.title}</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        })
                    }
                </View >
            </View>
        )
    }
    render() {
        const { dataChiTiet } = this.state
        return (
            <View style={[nstyles.ncontainerX]}>
                {/* <HeaderCom
                    iconLeft={Images.ImageJee.icGoBack}
                    iconRight={Images.ImageJee.icFilter}
                    onPressLeft={() => { Utils.goback(this, null) }}
                    nthis={this} textleft={dataChiTiet.MeetingContent} /> */}
                <View style={styles.viewHeader}>
                    <TouchableOpacity style={styles.btnBack} onPress={() => this._goback()}>
                        <Image source={Images.ImageJee.icGoBack} style={nstyles.nIcon24}></Image>
                        <Text style={{ marginLeft: 5, fontWeight: 'bold', maxWidth: Width(80), fontSize: reText(18) }}>{dataChiTiet ? dataChiTiet.MeetingContent : 'Tên cuộc họp'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnBack} onPress={() => this.refChucNang.show()}>
                        <Image source={Images.ImageJee.icFilter} style={nstyles.nIcon24}></Image>
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }}>
                    <TabView
                        lazy
                        navigationState={this.state}
                        renderScene={this._renderScene}
                        renderTabBar={this._renderTabBar}
                        onIndexChange={index => this.setState({ index })}
                    // initialLayout={{ width: Width(100) }}
                    />
                    {/* <IsLoading></IsLoading> */}
                </View>
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
            </View >
        )
    }
}
const styles = StyleSheet.create({
    txtNgayThangNam: {
        color: colors.grey, fontWeight: '500'
    },
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
    }
})
