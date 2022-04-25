import moment from 'moment';
import React, { Component } from 'react';
import { Animated, FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import DateTimePicker from 'react-native-datepicker';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { getDSDatPhongHop, getDSTaiSan, postKT_ThoiGianDat } from '../../../../apis/JeePlatform/API_JeeMeeting/apiTaoCuocHop';
import { RootLang } from '../../../../app/data/locales';
import Utils from '../../../../app/Utils';
import UtilsApp from '../../../../app/UtilsApp';
import ListEmpty from '../../../../components/ListEmpty';
import HeaderModalCom from '../../../../Component_old/HeaderModalCom';
import { Images } from '../../../../images';
import { colors } from '../../../../styles';
import { reText } from '../../../../styles/size';
import { nHeight, nstyles, nWidth, paddingBotX, Width } from '../../../../styles/styles';
export class ModalDKTaiSan extends Component {
    constructor(props) {
        super(props);
        this.time = Utils.ngetParam(this, 'time')
        this.date = Utils.ngetParam(this, 'date')
        this.callback = Utils.ngetParam(this, 'callback')
        this.state = {
            opacity: new Animated.Value(0),
            listTime: [],
            timeTuGio: '',
            timeDenGio: '',
            pickDate: '',
            pickTime: '',
            thu: RootLang.lang.JeeMeeting.thu,
            ngaythangnam: RootLang.lang.JeeMeeting.ngay,
            thoigian: RootLang.lang.JeeMeeting.thoigian,
            listTaiSan: [],
            listDatTaiSan: [],
            tenTaiSan: RootLang.lang.JeeMeeting.taisan,
            IdTaiSan: '',
            noiDungHop: '',
        }
    }
    componentDidMount = async () => {
        this.loadThoiGian()
        this._startAnimation(0.8)
        this.pickDateTime(this.date, 1)
        this.pickDateTime(this.time, 2)
        this.loadDSPhong().then(res => {
            this.loadDSDatPhong()
        })
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
    loadDSPhong = async () => {
        let res = await getDSTaiSan(2)
        if (res.status == 1) {
            this.setState({ listTaiSan: res.data, tenTaiSan: res.data[0].Title, IdTaiSan: res.data[0].RowID })
        } else {
            UtilsApp.MessageShow(RootLang.lang.JeeMeeting.thongbao, res.error ? res.error.message : RootLang.lang.JeeMeeting.loitruyxuatdulieu, 2)
        }
    }
    loadDSDatPhong = async (RowID = this.state.IdTaiSan, ngaythangnam = this.state.ngaythangnam) => {
        let res = await getDSDatPhongHop(RowID, ngaythangnam, 2)
        let isDay = true
        const nowDay = new Date(), selectDay = new Date(moment(ngaythangnam, "DD/MM/YYYY").format("MM/DD/YYYY"))
        if (selectDay.getFullYear() > nowDay.getFullYear())
            isDay = false
        else if (selectDay.getMonth() > nowDay.getMonth())
            isDay = false
        else if (selectDay.getDate() == nowDay.getDate() && selectDay.getMonth() == nowDay.getMonth() && selectDay.getFullYear() == nowDay.getFullYear())
            isDay = false
        else if (selectDay.getDate() > nowDay.getDate() && selectDay.getMonth() == nowDay.getMonth())
            isDay = false
        //isDay so sánh chỉ so sanh ngày, không so sánh giờ
        const isHomNay = moment().format("DD/MM/YYYY") == moment(ngaythangnam, "DD/MM/YYYY").format("DD/MM/YYYY")
        if (res.status == 1) {
            let ArrayNew = []
            if (res.data) { // có data
                this.state.listTime.map(item => {
                    let check = 0;
                    res.data.map(val => {
                        let start = moment(val.start).format('HH:mm').toString(), end = moment(val.end).format('HH:mm').toString()
                        if ((start == item.timeStart && end == item.timeEnd) || (start <= item.timeStart && end > item.timeStart)) {
                            check = 1
                            let checkActive = val.id == 0 ? 3 : val.id == 1 ? 4 : val.id == -1 ? 2 : 1 // id -1: đã đặt, 0: chờ, 1: đã được xác nhận
                            if (moment().format("HH:mm").toString() > item.timeStart && isHomNay || isDay) {
                                ArrayNew.push({ ...item, ...val, active: checkActive, isQuaHan: true })
                            }
                            else {
                                ArrayNew.push({ ...item, ...val, active: checkActive, isQuaHan: false })
                            }
                        }
                    })
                    if (check == 0) {
                        if (moment().format("HH:mm").toString() > item.timeStart && isHomNay || isDay) //quá hạn trong ngày
                            ArrayNew.push({ ...item, active: 1, isQuaHan: true })
                        else
                            ArrayNew.push({ ...item, active: 1, isQuaHan: false })
                    }
                })
            } else { // không có data
                this.state.listTime.map(item => {
                    if (moment().format("HH:mm").toString() > item.timeStart && isHomNay || isDay)
                        ArrayNew.push({ ...item, active: 1, isQuaHan: true })
                    else
                        ArrayNew.push({ ...item, active: 1, isQuaHan: false })
                })
            }
            this.setState({ listDatPhong: res.data, listTime: ArrayNew })
        } else {
            UtilsApp.MessageShow(RootLang.lang.JeeMeeting.thongbao, res.error ? res.error.message : RootLang.lang.JeeMeeting.loitruyxuatdulieu, 2)
        }
    }


    loadThoiGian = () => {
        const { listTime } = this.state
        let gio = 5, phut = '30', mang = [], tempGio = '', tempTruoc = '', tempSau = '', flag = true
        for (let i = 0; i < 13 * 2; i++) {
            if (i % 2 == 0) {
                gio++
            }
            flag = !flag
            if (gio < 10)
                tempGio = '0' + gio
            else
                tempGio = '' + gio
            if (phut == '00')
                phut = '30'
            else
                phut = '00'
            tempTruoc = tempGio + ':' + phut
            if (flag && gio < 10)
                tempSau = phut == '00' ? tempGio + ':' + '30' : (gio == 9 ? '' : '0') + (gio + 1) + ':' + '00'
            else if (flag && gio >= 10)
                tempSau = phut == '00' ? tempGio + ':' + '30' : '' + (gio + 1) + ':' + '00'
            else
                tempSau = phut == '00' ? tempGio + ':' + '30' : tempGio + ':' + '00'


            mang.push({ id: i, time: tempTruoc + ' - ' + tempSau, timeStart: tempTruoc, timeEnd: tempSau, active: 1 })
        }
        this.setState({ listTime: mang })
    }
    pickDateTime = (time, type) => {
        const { IdPhong } = this.state
        const temp = time ? new Date(moment(time, 'DD/MM/YYYY').format('YYYY/MM/DD')) : new Date()
        if (type == 1) {
            const thu = this.getThu(temp)
            const ngay = temp.getDate() + '/' + (temp.getMonth() + 1) + '/' + temp.getFullYear()
            this.setState({ thu: thu, ngaythangnam: ngay, pickDate: ngay })
            this.loadDSDatPhong(IdPhong, ngay)
        }
        if (type == 2) {
            const gio = temp.getHours() + ':' + temp.getMinutes()
            this.setState({ thoigian: gio, pickTime: gio })
        }
    }
    getThu = (time) => {
        let temp = time.getDay()
        let thu = ''
        switch (temp) {
            case 0:
                thu = RootLang.lang.JeeMeeting.chunhat
                break;
            case 1:
                thu = RootLang.lang.JeeMeeting.thu2
                break;
            case 2:
                thu = RootLang.lang.JeeMeeting.thu3
                break;
            case 3:
                thu = RootLang.lang.JeeMeeting.thu4
                break;
            case 4:
                thu = RootLang.lang.JeeMeeting.thu5
                break;
            case 5:
                thu = RootLang.lang.JeeMeeting.thu6
                break;
            case 6:
                thu = RootLang.lang.JeeMeeting.thu7
                break;
            default:
                break;
        }
        return thu
    }
    _selectDateDangKy = () => {
        this.refDKPhong.hide()
        const { pickDate } = this.state
        Utils.goscreen(this, 'Modal_CalandaSingalCom', {
            date: pickDate || moment(new Date()).format('DD/MM/YYYY'),
            // disable: true,
            // month: pickDate || new Date().getMonth() + 1,
            // years: pickDate || new Date().getFullYear(),
            setTimeFC: (time, type) => this.pickDateTimeDangKy(time, type = 1)
        })
    }
    _selectTime = (timeDefault, type) => {//type: 1-Tu gio, 2-Den gio
        this.refDKPhong.hide()
        Utils.goscreen(this, 'Modal_GioPhutPickerBasic',
            {
                time: timeDefault,
                _setGioPhut: (time) =>
                    type == 1 ? this.setState({ timeTuGio: time }, this.refDKPhong.show()) :
                        type == 2 ? this.setState({ timeDenGio: time }, this.refDKPhong.show()) : null
            })
    }
    pickDateTimeDangKy = (time, type) => {
        const temp = time ? new Date(moment(time, 'DD/MM/YYYY').format('YYYY/MM/DD')) : new Date()
        if (type == 1) {
            const thu = this.getThu(temp)
            const ngay = temp.getDate() + '/' + (temp.getMonth() + 1) + '/' + temp.getFullYear()
            this.setState({ thu: thu, ngaythangnam: ngay, pickDate: ngay })
        }
        this.refDKPhong.show()
    }
    dangkyTaiSan = async () => {
        const { timeTuGio, timeDenGio, ngaythangnam, IdTaiSan, noiDungHop, tenTaiSan } = this.state
        if (this.state.noiDungHop == '') {
            this.inputRef.focus()
            UtilsApp.MessageShow(RootLang.lang.JeeMeeting.thongbao, RootLang.lang.JeeMeeting.noidungkhongduocdetrong, 4)
            return
        }
        const body = {
            "RoomID": IdTaiSan,
            "BookingDate": moment(ngaythangnam, 'DD/MM/YYYY').format('YYYY-MM-DD') + 'T00:00:00.0000000',
            "FromTime": timeTuGio,
            "ToTime": timeDenGio
        }
        let res = await postKT_ThoiGianDat(body)
        if (res.status == 1) {
            const itemback = {
                "IdPhieu": -1,
                "RoomID": IdTaiSan,
                "BookingDate": moment(ngaythangnam, 'DD/MM/YYYY').format('YYYY-MM-DD') + 'T00:00:00.0000000',
                "FromTime": timeTuGio,
                "ToTime": timeDenGio,
                "MeetingContent": noiDungHop,
                "TenPhong": tenTaiSan,
                "IdPhieu": -1,
            }
            this.callback(itemback)
            Utils.goback(this)
        } else {
            UtilsApp.MessageShow(RootLang.lang.JeeMeeting.thongbao, res.error ? res.error.msg : RootLang.lang.JeeMeeting.dangkykhongthanhcong, 2)
        }
    }
    _handleBookRoom = (item) => {
        this.loadDSDatPhong(item.RowID)
        this.setState({ tenTaiSan: item.Title, IdTaiSan: item.RowID }, () => this.refDanhSachTaiSan.hide())
    }
    _renderTaiSan = ({ item, index }) => {
        return (
            <TouchableOpacity style={styles.btnPhong} onPress={() => this._handleBookRoom(item)}>
                <Text style={{ fontSize: reText(14) }}>{item.Title}</Text>
                {item.Description ? <Text style={{ fontSize: reText(12), color: colors.textGray, marginTop: 5 }}>{item.Description}</Text> : null}
            </TouchableOpacity>
        )
    }
    _selectDate = () => {
        const { ngaythangnam } = this.state
        Utils.goscreen(this, 'Modal_CalandaSingalCom', {
            date: ngaythangnam || moment(new Date()).format('DD/MM/YYYY'),
            // disable: true,
            // month: ngaythangnam || new Date().getMonth() + 1,
            // years: ngaythangnam || new Date().getFullYear(),
            setTimeFC: (time, type) => this.pickDateTime(time, type = 1)
        })
    }
    _pickTaiSan = (item) => {
        if (item.isQuaHan) {
            UtilsApp.MessageShow(RootLang.lang.JeeMeeting.thongbao, RootLang.lang.JeeMeeting.daquathoigianhientai, 4)
            return
        }
        if (item.active == 2) {
            UtilsApp.MessageShow(RootLang.lang.JeeMeeting.thongbao, RootLang.lang.JeeMeeting.phongdaduocdat, 4)
            return
        }
        if (item.active == 3) {
            UtilsApp.MessageShow(RootLang.lang.JeeMeeting.thongbao, RootLang.lang.JeeMeeting.phongdaduocdat, 4)
            return
        }
        if (item.active == 4) {
            UtilsApp.MessageShow(RootLang.lang.JeeMeeting.thongbao, RootLang.lang.JeeMeeting.phongdaduocdat, 4)
            return
        }
        this.setState({ timeTuGio: item.timeStart, timeDenGio: item.timeEnd }, () => this.refDKPhong.show())
    }
    _renderListTime = ({ item, index }) => {
        let icon = Images.ImageJee.icCHChon, txtColor = 'green'
        if (item?.active == 1) //Trống
            icon = Images.ImageJee.icCHRong, txtColor = null
        if (item?.active == 2) //Đã đặt
            icon = Images.ImageJee.icCHDaDat, txtColor = 'blue'
        if (item?.active == 3) //Đang chờ xác nhận
            icon = Images.ImageJee.icCHChoXacNhan, txtColor = 'orange'
        if (item?.active == 4) //Đã được xác nhận
            icon = Images.ImageJee.icCHXacNhan, txtColor = 'red'
        return (
            <TouchableOpacity onPress={() => this._pickTaiSan(item)}
                style={[styles.btnTime, { backgroundColor: item.isQuaHan ? colors.black_10 : 'white' }]}>
                <Text style={{ width: Width(30), textAlign: 'center', color: txtColor }}>{item?.time ? item.time : '---'}</Text>
                <Image source={icon} style={nstyles.nIcon15}></Image>
            </TouchableOpacity>
        )
    }
    render() {
        const { opacity, listTime, thu, ngaythangnam, pickDate, listTaiSan, tenTaiSan, timeTuGio, timeDenGio } = this.state
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: 'transparent', justifyContent: 'flex-end', opacity: 1, }]}>
                <Animated.View onTouchEnd={() => Utils.goback(this)}
                    style={{
                        position: 'absolute', top: 0,
                        bottom: 0, left: 0, right: 0,
                        backgroundColor: colors.backgroundModal, opacity
                    }} />
                <KeyboardAwareScrollView scrollEnabled={false} style={{ backgroundColor: colors.white, flex: 1, marginTop: isIphoneX() ? nHeight(5) : 10, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                    <Image source={Images.icTopModal} style={styles.imgTopHeader}></Image>
                    <View style={styles.viewHeader}>
                        <TouchableOpacity onPress={() => Utils.goback(this)} style={styles.btnBack}>
                            <Image source={Images.ImageJee.icGoBack} style={nstyles.nIcon24}></Image>
                            <Text style={styles.txtBack}>{RootLang.lang.JeeMeeting.dangkytaisan}</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.viewGroup} onPress={this._selectDate}>
                        <Text>{thu}, {ngaythangnam}</Text>
                        <Image source={Images.icTime} style={[nstyles.nIcon17, { tintColor: 'black' }]}></Image>
                    </TouchableOpacity>
                    <View style={styles.viewList}>
                        <View style={{ alignItems: 'flex-start' }}>
                            <TouchableOpacity style={styles.btnPhongHop} onPress={() => this.refDanhSachTaiSan.show()}>
                                <Text style={{ color: colors.bluishGreen, fontWeight: '400' }}>{tenTaiSan}</Text>
                                <Image source={Images.ImageJee.icDropdownn} style={{ width: 10, height: 6, tintColor: colors.textTabActive, marginLeft: 5 }}></Image>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={listTime}
                            extraData={this.state}
                            renderItem={this._renderListTime}
                            onEndReachedThreshold={0.1}
                            initialNumToRender={10}
                            showsVerticalScrollIndicator={true}
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item, index) => index.toString()}
                            ListEmptyComponent={listTime.length == 0 ? <ListEmpty style={{ justifyContent: 'center', alignItems: 'center', }} textempty={RootLang.lang.JeeMeeting.khongcodulieu} /> : null} />
                    </View>
                    <View style={styles.viewNote}>
                        {[1, 2, 3].map(item => {
                            return (
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ backgroundColor: (item == 1 ? 'blue' : item == 2 ? 'orange' : 'red'), ...nstyles.nIcon15, marginRight: 5 }}></View>
                                    <Text>{item == 1 ? RootLang.lang.JeeMeeting.dadat : item == 2 ? RootLang.lang.JeeMeeting.dangchoxacnhan : RootLang.lang.JeeMeeting.daduocxacnhan}</Text>
                                </View>
                            )
                        })}
                    </View>
                </KeyboardAwareScrollView>
                <ActionSheet ref={ref => this.refDanhSachTaiSan = ref}>
                    <View style={{ height: nHeight(50), paddingHorizontal: 10, paddingBottom: paddingBotX }}>
                        <HeaderModalCom title={RootLang.lang.JeeMeeting.danhsachtaisan} onPress={() => this.refDanhSachPhong.hide()}></HeaderModalCom>
                        <ScrollView>
                            <FlatList
                                data={listTaiSan}
                                extraData={this.state}
                                renderItem={this._renderTaiSan}
                                onEndReachedThreshold={0.1}
                                initialNumToRender={10}
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={(item, index) => index.toString()}
                                ListEmptyComponent={listTaiSan.length == 0 ? <ListEmpty style={{ justifyContent: 'center', alignItems: 'center', }} textempty={RootLang.lang.JeeMeeting.khongcodulieu} /> : null} />
                        </ScrollView>
                    </View>
                </ActionSheet>
                <ActionSheet ref={ref => this.refDKPhong = ref}>
                    <View style={{ height: nHeight(50), paddingHorizontal: 10, paddingBottom: paddingBotX }}>
                        <HeaderModalCom title={RootLang.lang.JeeMeeting.thongtindangky} onPress={() => this.refDKPhong.hide()}></HeaderModalCom>
                        <View style={styles.viewGroupRef}>
                            <TouchableOpacity style={styles.btnPickDatetime} onPress={this._selectDateDangKy} >
                                <Text style={{ width: '25%' }}>{RootLang.lang.JeeMeeting.ngay}:</Text>
                                <View style={styles.viewTime(false)}>
                                    <Text style={styles.txtTime}>{pickDate || 'Ngày'}</Text>
                                    <Image source={Images.ImageJee.icLichChiTietTQ} style={{ tintColor: 'black', ...nstyles.nIcon17 }}></Image>
                                </View>
                            </TouchableOpacity>
                            <View style={{ flex: 1 }}></View>
                        </View>
                        <View style={styles.viewGroupRef}>
                            <TouchableOpacity style={styles.btnPickDatetime} onPress={() => this._selectTime(timeTuGio, 1)} >
                                <Text style={{ width: '25%' }}>{RootLang.lang.JeeMeeting.tugio}:</Text>
                                <View style={styles.viewTime(false)}>
                                    <Text style={styles.txtTime}>{timeTuGio}</Text>
                                    <Image source={Images.icTime} style={{ tintColor: 'black', ...nstyles.nIcon17 }}></Image>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnPickDatetime} onPress={() => this._selectTime(timeDenGio, 2)} >
                                <Text style={{ width: '30%' }}>{RootLang.lang.JeeMeeting.dengio}:</Text>
                                <View style={styles.viewTime(false)}>
                                    <Text style={styles.txtTime}>{timeDenGio}</Text>
                                    <Image source={Images.icTime} style={{ tintColor: 'black', ...nstyles.nIcon17 }}></Image>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
                            <Text>{RootLang.lang.JeeMeeting.noidung}: </Text>
                            <TextInput placeholder={RootLang.lang.JeeMeeting.nhapnoidung} onChangeText={(value) => this.setState({ noiDungHop: value })} ref={ref => this.inputRef = ref}></TextInput>
                        </View>
                        <View style={styles.viewBtnRef}>
                            <TouchableOpacity style={[styles.btnRef, { backgroundColor: colors.colorBtnOrange }]} onPress={() => this.setState({ pickDate: ngaythangnam }, () => this.refDKPhong.hide())}>
                                <Text style={styles.txtRef}>{RootLang.lang.JeeMeeting.huy}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.btnRef, { backgroundColor: colors.colorTextGreen }]} onPress={() => this.dangkyTaiSan()}>
                                <Text style={styles.txtRef}>{RootLang.lang.JeeMeeting.dangky}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ActionSheet >
            </View >
        )
    }
}
const styles = StyleSheet.create({
    viewGroup: {
        height: nHeight(6), borderTopColor: colors.colorVeryLightPink, borderTopWidth: 1, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
    },
    viewHeader: {
        paddingHorizontal: 10, paddingVertical: 10, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center'
    },
    btnBack: {
        flexDirection: 'row', alignItems: 'center',
    },
    txtBack: {
        marginLeft: 10, fontSize: 18
    },
    imgTopHeader: {
        alignSelf: 'center', width: 70, height: 4, marginVertical: 5
    },
    btnPhongHop: {
        flexDirection: 'row', alignItems: 'center', paddingVertical: 5, borderRadius: 5, justifyContent: 'space-between',
        paddingHorizontal: 10, borderWidth: 0.5, borderColor: colors.textGray, marginLeft: 20
    },
    viewList: {
        borderTopColor: colors.colorVeryLightPink, borderTopWidth: 1, paddingVertical: 20, height: nHeight(75)
    },
    btnTime: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 20
    },
    viewNote: {
        flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'
    },
    btnPhong: {
        justifyContent: 'center', alignItems: 'center', paddingVertical: 15, borderBottomColor: colors.textbrownGrey, borderBottomWidth: 0.5
    },
    viewGroupRef: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 15
    },
    viewBtnRef: {
        flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: nHeight(15)
    },
    btnRef: {
        width: nWidth(40), alignItems: 'center', justifyContent: 'center', borderRadius: 10, paddingVertical: 10
    },
    txtRef: {
        color: 'white', fontSize: 16, fontWeight: '500'
    },
    viewTime: (isWarning) => ({
        flexDirection: 'row', alignItems: 'center', paddingVertical: 3, borderBottomColor: isWarning ? colors.redStar : colors.textGray, borderBottomWidth: 1,
        width: '70%'
    }),
    txtTime: {
        fontSize: 16, flex: 1, textAlign: 'center'
    },
    btnPickDatetime: {
        flex: 1, flexDirection: 'row', alignItems: 'center'
    }
})
export default ModalDKTaiSan
