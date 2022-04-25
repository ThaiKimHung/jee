import React, { Component } from 'react'
import { Text, View, StyleSheet, Image, ScrollView, TouchableOpacity, FlatList, Linking } from 'react-native'
import ButtonCom from '../../../components/Button/ButtonCom'
import { Images } from '../../../images'
import { colors } from '../../../styles'
import { Height, nstyles, nWidth, Width } from '../../../styles/styles'
import { getChiTietCuocHop, getXacNhanThamGia, postCapNhatTomTatKetLuan } from '../../../apis/JeePlatform/API_JeeMeeting/apiChiTietCuocHop'
import Utils from '../../../app/Utils'
import UtilsApp from '../../../app/UtilsApp'
import nAvatar from '../../../components/pickChartColorofAvatar'
import { initZoom, joinMeeting, startMeeting } from '../../Metting/AwesomeZoomSDK';
import { nkey } from '../../../app/keys/keyStore'
import moment from 'moment'
import HTML from "react-native-render-html";
import IsLoading from '../../../components/IsLoading'
import { RootLang } from '../../../app/data/locales'
import { reText } from '../../../styles/size'
import { check } from 'react-native-permissions'
// const CONFIGZOOM = {
//     apiKey: "y-bG145KQM-U89jP0ZPBpQ",
//     apiSecret: "qda0lOqF2vd38y8sqHgVgMu97b90USgEbivh",
//     idUser: "-l_KZ4uLTQSxtPOGx_hUSA",
//     SDKKey: 'uoyUpPOEocuc7NpVLH9AnaEPSwBeo5UYvuMB',
//     SDKSecret: 'kFNPYEkKEFkbscmVZzTYY6UqJUnppOkuaH9Z',
// }

export class TongQuan extends Component {
    constructor(props) {
        super(props)
        this.rowid = this.props.rowid
        this.state = {
            dataChiTiet: '',
            IdRoom: '',
            pass: '',
            accessToken: '',
            Name: 'Member',
            showXacNhan: false,
            LinkGoogle: '',
            checkDay: '',
        }
    }
    async componentDidMount() {
        this.setState({ Name: await Utils.ngetStorage(nkey.nameuser, ''), })
        this.loadChiTietCuocHop()
    }
    loadChiTietCuocHop = async () => {
        let res = await getChiTietCuocHop(this.rowid)
        // Utils.nlog('Chi tiết cuộc họp: ', res)
        if (res.status == 1) {
            const userid = await Utils.ngetStorage(nkey.UserId)
            const check = res.data[0].XacNhanThamGiaTuBan?.find(item => item.idUser == userid)
            this.setState({ dataChiTiet: res.data[0], LinkGoogle: res.data[0].LinkGoogle, IdRoom: res.data[0].IdZoom, pass: res.data[0].PwdZoom, showXacNhan: check ? true : false, accessToken: res.data[0].token }, () => this._init())
            this._checkDay()
        } else {
            UtilsApp.MessageShow(RootLang.lang.JeeMeeting.thongbao, res.error ? res.error.message : RootLang.lang.JeeMeeting.loitruyxuatdulieu, 2)
        }

    }

    _checkDay = () => {
        const { dataChiTiet, } = this.state
        let thoiGianKT = moment(dataChiTiet?.BookingDate).add(dataChiTiet?.TimeLimit, 'minutes').format("HH:mm:ss")
        let ngayDienra = moment(dataChiTiet.BookingDate).format('MM/DD/YYYY')
        let ngayTonghop = ngayDienra + ' ' + thoiGianKT
        const x = new Date(ngayTonghop);  // x : ngày và thời gian diễn ra cuộc hợp
        const y = new Date(); // y: ngày và thời gian hiện tại, lấy theo thời gian thật
        // console.log('x', x)
        // console.log('y', y)
        // console.log('x < y', x < y); // false
        // console.log('x > y', x > y); // false
        // console.log('+x === +y', +x === +y); // true
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
        const { nthis } = this.props
        return (
            <View style={{ alignItems: 'flex-end', justifyContent: 'center', width: Width(50) }}>

                <TouchableOpacity style={[styles.viewAvatar, { alignItems: 'center' }]}
                    onPress={() => { Utils.goscreen(nthis, 'Modal_ListUser', { data: list }) }}>
                    {
                        list.length < 6 ? (
                            list.map((item, index) => {
                                return (
                                    item.Image ?
                                        <Image source={{ uri: item.Image }} style={nstyles.nAva32}></Image>
                                        :
                                        <View style={[nstyles.nAva32, { backgroundColor: nAvatar(item.HoTen).color, justifyContent: 'center', alignItems: 'center' }]}>
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
                                                        <View style={[nstyles.nAva32, { backgroundColor: nAvatar(item.HoTen).color, justifyContent: 'center', alignItems: 'center' }]}>
                                                            <Text style={{ color: 'white', fontWeight: 'bold' }}>{nAvatar(item.HoTen).chart}</Text>
                                                        </View>
                                                    : null
                                            )
                                        })
                                    }
                                    <View style={[nstyles.nAva35, { backgroundColor: colors.colorPink2, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }]}>
                                        <Text style={{ textAlign: 'center', color: colors.white }}> +{list.length - 5}</Text>
                                    </View>
                                </View>
                            )
                    }
                </TouchableOpacity>
            </View>
        )
    }
    _renderTaiSanSuDung = ({ item, index }) => {
        const fromTime = moment(item.FromTime).format('HH:mm'), toTime = moment(item.ToTime).format('HH:mm')
        return (
            <View style={{ flexDirection: 'row', marginHorizontal: 10, alignItems: 'center', marginTop: 10, justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                    <Text> - </Text>
                    <Text>{item.TenTaiSan}</Text>
                    <Text style={{ color: colors.textGray, fontSize: 12 }}> ({fromTime + ' - ' + toTime}) </Text>
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
    // _StartZoomZak = async () => {
    //     let { IdRoom, Name } = this.state
    //     await startMeetingZAK(IdRoom, Name, CONFIGZOOM.idUser, "eyJ0eXAiOiJKV1QiLCJzdiI6IjAwMDAwMSIsInptX3NrbSI6InptX28ybSIsImFsZyI6IkhTMjU2In0.eyJhdWQiOiJjbGllbnRzbSIsInVpZCI6Ii1sX0taNHVMVFFTeHRQT0d4X2hVU0EiLCJpc3MiOiJ3ZWIiLCJzdHkiOjEsIndjZCI6InVzMDQiLCJjbHQiOjAsInN0ayI6IndtdFMzN3VaS1lqWVgtd1VXaDFMWkxsT0F6dGVGbDBCaGltNUdqeG03Z3cuQUcuRG5EUm5wYUZzRXp6Q3FEa3dpdXBhNWxyanlqNDdmeDB1czYtVDV4U3Z2eURER0lMcnVjUEdZdGhJLWNtZjBQZDQySi1XSEFieUt6NFIzMVQuZzRyNUNjUjdnMGg0dFhMNFNKSGctdy4xNklNTndWUmtGXzM5V09DIiwiZXhwIjoxNjMxODk3OTUzLCJpYXQiOjE2MzE4OTc2NTMsImFpZCI6Ikw4dE1pTE11UVFTUnQySW14aC15UXciLCJjaWQiOiIifQ.gaajJb04vb1eChfWcy-ofZngFkgpfOV_Pb8UcKlOCtM")
    // }

    _JoinGGMeeting = () => {
        if (this.state.LinkGoogle)
            Linking.openURL(this.state.LinkGoogle)
        else
            UtilsApp.MessageShow(RootLang.lang.JeeMeeting.thongbao, RootLang.lang.JeeMeeting.daxayraloi, 2)
    }
    _goInsertTTKL = (type) => { //type: 1-ket luan, 2-tom tat
        const { dataChiTiet } = this.state
        const { nthis } = this.props
        // const param = {
        //     text: type == 1 ? dataChiTiet?.KetLuan : dataChiTiet?.TomTatNoiDung,
        //     type: type == 1 ? 2 : 1,
        //     edit: dataChiTiet?.DuocPhepNhapTomTat,
        //     rowid: dataChiTiet?.RowID,
        //     reload: () => this.loadChiTietCuocHop()
        // }
        // Utils.goscreen(nthis, 'Modal_EditText', param)
        Utils.goscreen(nthis, 'Modal_EditHTML', {
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
    render() {
        const { dataChiTiet, SDKKey, SDKSecret, IdRoom, pass, Name, showXacNhan, checkDay } = this.state
        const { nthis } = this.props
        return (
            <View style={{}}>
                {/* <ScrollView style={{ flex: 1, marginTop: 10 }}> */}
                <View>
                    {
                        checkDay ? (
                            dataChiTiet?.GoogleMeet ?
                                <ButtonCom
                                    text={RootLang.lang.JeeMeeting.thamgiaggmeet}
                                    onPress={() => this._JoinGGMeeting()}
                                    img={Images.ImageJee.icGoogleMeet}
                                    styleButton={{ marginHorizontal: 15, marginVertical: 20 }}
                                    style={{ backgroundColor: colors.textTabActive, backgroundColor1: colors.colorOrangeMN, borderRadius: 10 }}
                                    txtStyle={{ color: 'white' }}
                                /> : dataChiTiet.ZoomMeeting ?

                                    <>
                                        {/* <ButtonCom
                                        text={'init jwt '}
                                        onPress={() => this._init()}
                                        img={Images.ImageJee.icZoom}
                                        styleButton={{ marginHorizontal: 15, marginVertical: 20 }}
                                        style={{ backgroundColor: colors.blueHide, backgroundColor1: colors.blueHide, borderRadius: 10 }}
                                        txtStyle={{ color: 'white' }}
                                    /> */}
                                        {dataChiTiet?.isHost ?
                                            <ButtonCom
                                                text={RootLang.lang.JeeMeeting.thamgiazoomm}
                                                onPress={() => this._StartZoom()}
                                                img={Images.ImageJee.icZoom}
                                                styleButton={{ marginHorizontal: 15, marginVertical: 20 }}
                                                style={{ backgroundColor: colors.blueHide, backgroundColor1: colors.blueHide, borderRadius: 10 }}
                                                txtStyle={{ color: 'white' }}
                                            /> :
                                            <ButtonCom
                                                text={RootLang.lang.JeeMeeting.thamgiazoom}
                                                onPress={() => this._joinZoom()}
                                                img={Images.ImageJee.icZoom}
                                                styleButton={{ marginHorizontal: 15, marginVertical: 20 }}
                                                style={{ backgroundColor: colors.blueHide, backgroundColor1: colors.blueHide, borderRadius: 10 }}
                                                txtStyle={{ color: 'white' }}
                                            />}
                                        {/* <ButtonCom
                                        text={'Start Zoom ZAK'}
                                        onPress={() => this._StartZoomZak()}
                                        img={Images.ImageJee.icZoom}
                                        styleButton={{ marginHorizontal: 15, marginVertical: 20 }}
                                        style={{ backgroundColor: colors.blueHide, backgroundColor1: colors.blueHide, borderRadius: 10 }}
                                        txtStyle={{ color: 'white' }}
                                    /> */}
                                    </>
                                    : null
                        )
                            : null
                    }

                </View>
                {/* <Text style={{ marginTop: 15 }}>DEMO (đoạn này test demo- xong xoá):</Text>
                <TextInput value={SDKKey} onChangeText={text => this.setState({ SDKKey: text })} />
                <TextInput value={SDKSecret} onChangeText={text => this.setState({ SDKSecret: text })} />
                <TextInput value={IdRoom} onChangeText={text => this.setState({ IdRoom: text })} />
                <TextInput value={pass} onChangeText={text => this.setState({ pass: text })} />
                <TextInput value={Name} onChangeText={text => this.setState({ Name: text })} /> */}
                <View style={[styles.viewGroup, { marginTop: dataChiTiet?.GoogleMeet || dataChiTiet.ZoomMeeting ? 0 : 10 }]}>
                    <View style={[styles.viewNguoi, { borderBottomWidth: 1, borderColor: colors.colorLineGray, paddingTop: 9, paddingBottom: 14 }]}>
                        <Text style={{ marginRight: 10, fontSize: reText(16), color: '#808080' }}>{RootLang.lang.JeeMeeting.thoigian}</Text>
                        <Text style={[styles.txtNgayThangNam, { color: '#404040' }]}>{`${moment(dataChiTiet?.BookingDate).format(" HH:mm - ")}${moment(dataChiTiet?.BookingDate).add(dataChiTiet?.TimeLimit, 'minutes').format("HH:mm")}, ${Utils.formatTimeAgo(moment(dataChiTiet?.BookingDate).format('MM/DD/YYYY HH:mm:ss'), 2, false)}  `}</Text>
                    </View>
                    <View style={[styles.viewNguoi, { borderBottomWidth: 1, borderColor: colors.colorLineGray, paddingVertical: dataChiTiet.ThanhPhanThamGia?.length > 0 ? 8 : 14 }]}>
                        <Text style={{ marginRight: 10, fontSize: reText(16), color: '#808080' }}>{RootLang.lang.JeeMeeting.nguoithamgia}</Text>
                        {dataChiTiet ? this.renderListUser(dataChiTiet.ThanhPhanThamGia) : null}
                    </View>
                    <View style={[styles.viewNguoi, { borderBottomWidth: 1, borderColor: colors.colorLineGray, paddingVertical: dataChiTiet?.ThanhPhanTheoDoi?.length > 0 ? 8 : 14 }]}>
                        <Text style={{ marginRight: 10, fontSize: reText(16), color: '#808080' }}>{RootLang.lang.JeeMeeting.nguoitheodoi}</Text>
                        {dataChiTiet ? this.renderListUser(dataChiTiet.ThanhPhanTheoDoi) : null}
                    </View>
                    <View style={[styles.viewNguoinhaptomttat, { paddingTop: dataChiTiet?.ThanhPhanNhapTTKT?.length > 0 ? 8 : 13, paddingBottom: dataChiTiet?.ThanhPhanNhapTTKT?.length > 0 ? 0 : 5 }]}>
                        <Text style={{ marginRight: 10, fontSize: reText(16), color: '#808080', }}>{RootLang.lang.JeeMeeting.nguoinhap}</Text>
                        {dataChiTiet ? this.renderListUser(dataChiTiet.ThanhPhanNhapTTKT) : null}
                    </View>
                </View>
                {[1, 2].map(item =>
                    <View style={[styles.viewGroup, { marginTop: 3 }]}>
                        <View style={styles.viewTomTat} >
                            <Text style={styles.txtHeaderTTKL}>{item == 1 ? RootLang.lang.JeeMeeting.ketluancuochop : RootLang.lang.JeeMeeting.tomtatcuochop}</Text>
                            {dataChiTiet?.DuocPhepNhapTomTat ?
                                <TouchableOpacity onPress={() => this._goInsertTTKL(item)}>
                                    <Image source={Images.ImageJee.icEditMessage} style={styles.imgDropdown}></Image>
                                </TouchableOpacity>
                                : null
                            }
                        </View>
                        {dataChiTiet?.KetLuan && item == 1 || dataChiTiet?.TomTatNoiDung ?
                            <HTML
                                source={{ html: item == 1 ? dataChiTiet?.KetLuan : dataChiTiet?.TomTatNoiDung }}
                                containerStyle={{ paddingHorizontal: 10, paddingVertical: 10, backgroundColor: colors.colorBGHome, borderRadius: 5, marginVertical: 5 }} />
                            : dataChiTiet?.DuocPhepNhapTomTat ?
                                <TouchableOpacity style={styles.btnVietNgay} onPress={() => this._goInsertTTKL(item)}>
                                    <Text style={styles.txtBTNVietNgay}>{item == 1 ? 'Cuộc họp đang chờ kết luận từ bạn.' : 'Cuộc họp đang chờ tóm tắt từ bạn.'} <Text style={{ fontWeight: 'bold' }}>{'Viết Ngay!'}</Text></Text>
                                </TouchableOpacity>
                                :
                                <Text style={styles.txtKoCoNoiDung}>- {RootLang.lang.JeeMeeting.chuanhap}</Text>
                        }
                    </View>
                )}
                <View style={[styles.viewGroup, { marginTop: 3 }]}>
                    <Text style={{ fontSize: reText(16), color: colors.black_60, }}>{RootLang.lang.JeeMeeting.taisansudung}</Text>
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
                        ListEmptyComponent={dataChiTiet ? <Text style={{ marginLeft: 10, color: colors.textGray, fontSize: 12, marginTop: 5 }}>- {RootLang.lang.JeeMeeting.khongsudungtaisan}</Text> : null}
                    // ListFooterComponent={showload ? <ActivityIndicator size='small' /> : null} 
                    />
                </View>
                <View style={[styles.viewGhiChu, { marginTop: 3 }]}>
                    <View style={styles.viewNote}>
                        <Image source={Images.icChonNgay} style={[nstyles.nIcon17, styles.imgGhiChu]}></Image>
                        <Text style={{ fontSize: reText(16), color: colors.black_60 }}>{RootLang.lang.JeeMeeting.ghichu}</Text>
                    </View>
                    {dataChiTiet.MeetingNote ? <Text style={{ color: colors.textGray }}>{dataChiTiet.MeetingNote}</Text> : null}
                </View>
                {/* </ScrollView > */}
                {
                    showXacNhan ?
                        <TouchableOpacity style={styles.btnXacNhan
                        } onPress={() => this.XacNhanThamGia()
                        }>
                            <Text style={styles.txtXacNhan}>{RootLang.lang.JeeMeeting.xacnhan}</Text>
                        </TouchableOpacity >
                        : null
                }
                <IsLoading />
            </View >
        )
    }
}
const styles = StyleSheet.create({
    viewNguoi: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    },
    viewAvatar: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: 'blue'
    },
    viewGroup: {
        backgroundColor: 'white', marginHorizontal: 10, marginBottom: 10, padding: 10, borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
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
        ...nstyles.nIcon20, tintColor: colors.colorSoftBlue, marginRight: 10
    },
    viewTomTat: {
        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5
    },
    btnXacNhan: {
        alignSelf: 'center', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.greenTab, paddingVertical: 10, width: nWidth(60), borderRadius: 10,
        marginBottom: 10
        // position: 'absolute', top: nHeight(70)
    },
    txtXacNhan: {
        color: 'white', fontWeight: '700', fontSize: 16
    },
    btnVietNgay: {
        borderWidth: 1, borderColor: colors.colorTabActive, paddingVertical: 10, marginVertical: 20, marginHorizontal: 20, alignSelf: 'center', paddingHorizontal: 10, borderRadius: 5
    },
    txtBTNVietNgay: {
        fontSize: reText(12), color: colors.colorTabActive, textAlign: 'center'
    },
    txtKoCoNoiDung: {
        fontWeight: '700', marginLeft: 10, color: colors.textGray
    },
    txtHeaderTTKL: {
        fontWeight: '700', fontSize: reText(17), color: colors.textTabActive, marginLeft: 10
    },
    txtNgayThangNam: {
        fontWeight: 'bold', color: colors.grey
    },
    viewNguoinhaptomttat: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    }
})
export default TongQuan
