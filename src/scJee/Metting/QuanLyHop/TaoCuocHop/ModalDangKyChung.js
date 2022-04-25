import moment from 'moment';
import React, { Component } from 'react';
import { Animated, BackHandler, FlatList, Image, Platform, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { getDSTaiSan, postKT_ThoiGianDat } from '../../../../apis/JeePlatform/API_JeeMeeting/apiTaoCuocHop';
import { RootLang } from '../../../../app/data/locales';
import Utils from '../../../../app/Utils';
import UtilsApp from '../../../../app/UtilsApp';
import IsLoading from '../../../../components/IsLoading';
import { Images } from '../../../../images';
import { colors } from '../../../../styles';
import { reText } from '../../../../styles/size';
import { CheckTaiSan } from '../../../../apis/JeePlatform/API_JeeHanhChanh/apiJeeHanhChanh'
import { nHeight, nstyles, nWidth, paddingBotX, paddingTopMul, Width } from '../../../../styles/styles';

export class ModalDangKyChung extends Component {
    constructor(props) {
        super(props);
        this.callback = Utils.ngetParam(this, 'callback', () => { })
        this.noidunghop = Utils.ngetParam(this, 'noidunghop', '--')
        this.refLoading = React.createRef()
        this.state = {
            date: Utils.ngetParam(this, 'date'),
            timeIn: Utils.ngetParam(this, 'timeIn'),
            timeOut: Utils.ngetParam(this, 'timeOut'),
            listPhongHop: [],
            selectPhong: Utils.ngetParam(this, 'listPhongHop', {}),// Phòng chỉ cho chọn 1 
            listTaiSan: [],
            selectTaiSan: Utils.ngetParam(this, 'listTaiSan', []),
            TSDaDangKy: [],//list tài sản đã đăng ký trong ngày --
        }
    }
    componentDidMount = async () => {
        this.refLoading.current.show()
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this._backHandlerButton)
        this.LoadAPIListTS().then(val => {
            this.refLoading.current.show()
            if (val) {
                this.loadDSPhong()
                this.loadTaiSan()
            }
        })

    }
    componentWillUnmount() {
        this.backHandler.remove()
    }
    _backHandlerButton = () => {
        this._goback()
        return true
    }

    LoadAPIListTS = async () => {
        let res = await CheckTaiSan(this.state.date)
        if (res.status == 1 && res.data && res.data.length > 0) {
            this.setState({ TSDaDangKy: res.data })
        } else {
            this.setState({ TSDaDangKy: [] })
        }
        return true
    }

    loadDSPhong = async () => {
        this.refLoading.current.show()
        let { TSDaDangKy, timeIn, timeOut } = this.state
        let res = await getDSTaiSan(1)
        if (res.status == 1 && res.data) {
            let list = []
            res.data.map(item => {
                let _check = ''
                let dadat = false
                let objItem = {}
                console.log("this.state.selectPhong:", this.state.selectPhong)
                if (item.RowID == this.state.selectPhong.RoomID) {
                    _check = true
                    objItem = { ...item, check: _check, date: this.state.selectPhong.BookingDate, tugio: this.state.selectPhong.FromTime, dengio: this.state.selectPhong.ToTime }
                } else {
                    _check = false
                    objItem = { ...item, check: _check }
                }
                // console.log("ITEM:", item)
                TSDaDangKy.map(val => {
                    // console.log("VAL::::", val)
                    var start = moment(val.start).format('HH:mm'),
                        end = moment(val.end).format('HH:mm'),
                        _timeIn = moment(timeIn, 'HH:mm').format('HH:mm'),
                        _timeOut = moment(timeOut, 'HH:mm').format('HH:mm')
                    let isCheck = (start >= _timeIn && start <= _timeOut) || (end >= _timeIn && end <= _timeOut) || (_timeIn >= start && _timeIn <= end) || (_timeOut >= start && _timeOut <= end) ? true : false
                    if (val.propertyid == item.RowID && isCheck) {
                        dadat = true
                        objItem = { ...objItem, dadat: dadat }
                    } else {
                        if (dadat == false)
                            objItem = { ...objItem, dadat: dadat }
                    }
                })
                list.push(objItem)
            })
            this.setState({
                listPhongHop: list
            }, () => this.refLoading.current.hide())

        } else {
            this.refLoading.current.hide()
            UtilsApp.MessageShow(RootLang.lang.JeeMeeting.thongbao, res.error ? res.error.msg : RootLang.lang.JeeMeeting.loitruyxuatdulieu, 4)
        }
        return true
    }
    loadTaiSan = async () => {
        this.refLoading.current.show()
        let { TSDaDangKy, timeIn, timeOut } = this.state
        let res = await getDSTaiSan(2)
        if (res.status == 1 && res.data) {
            let list = []
            res.data.map(item => {
                let _check = ''
                let dadat = false
                let objItem = {}
                let check = ''
                // let check = false
                if (this.state.selectTaiSan.length > 0) {
                    this.state.selectTaiSan.map(val => {
                        if (item.RowID == val.RoomID) {
                            check = true
                            _check = true
                            objItem = { ...item, check: _check, date: val.BookingDate, tugio: val.FromTime, dengio: val.ToTime }
                        }
                        else {
                            if (check == false) {
                                _check = false
                                objItem = { ...item, check: _check }
                            }
                        }
                    })
                } else {
                    objItem = { ...item, check: _check }
                }
                TSDaDangKy.map(value => {
                    var start = moment(value.start).format('HH:mm'),
                        end = moment(value.end).format('HH:mm'),
                        _timeIn = moment(timeIn, 'HH:mm').format('HH:mm'),
                        _timeOut = moment(timeOut, 'HH:mm').format('HH:mm')
                    let isCheck = (start >= _timeIn && start <= _timeOut) || (end >= _timeIn && end <= _timeOut) || (_timeIn >= start && _timeIn <= end) || (_timeOut >= start && _timeOut <= end) ? true : false
                    if (value.propertyid == item.RowID && isCheck) {
                        dadat = true
                        objItem = { ...objItem, dadat: dadat }
                    } else {
                        if (dadat == false)
                            objItem = { ...objItem, dadat: dadat }
                    }
                })
                list.push(objItem)
            })
            this.setState({
                listTaiSan: list
            }, () => this.refLoading.current.hide())
        } else {
            this.refLoading.current.hide()
            UtilsApp.MessageShow(RootLang.lang.JeeMeeting.thongbao, res.error ? res.error.msg : RootLang.lang.JeeMeeting.loitruyxuatdulieu, 4)
        }
        return true
    }

    _goback = () => {
        Utils.goback(this)
    }

    _checkPhong = (val) => {
        console.log("VAL:", val)
        let { timeIn, timeOut, date } = this.state
        let noiDungHop = this.noidunghop // Lấy nội dung theo bên ngoài đơn - mục lí do
        let thu = moment(date, 'DD/MM/YYYY').format('ddd').replace('T', 'Thứ ') //này tính theo date
        this.refLoading.current.show()
        if (val.dadat && val.check) {
            this.setState({ selectPhong: {} }, () => this.loadDSPhong())
        } else {
            this.checkDangKy(val.RowID).then(res => {
                if (res) {
                    let list = this.state.listPhongHop.map(item => {
                        if (val.RowID == item.RowID) {
                            let itemback = {
                                "IdPhieu": -1,
                                "RoomID": item.RowID,
                                "BookingDate": moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD') + 'T00:00:00.0000000',
                                "FromTime": timeIn,
                                "ToTime": timeOut,
                                "meetingContent": noiDungHop,
                                "DiaDiem": item.Title + ', ' + thu + ' ' + date + ', ' + timeIn + ' - ' + timeOut,
                                "TenPhong": item.Title
                            }
                            // console.log("itemback:", itemback)
                            this.setState({ selectPhong: itemback })
                            return { ...item, check: true }

                        }
                        else
                            return { ...item, check: false }
                    })
                    this.setState({ listPhongHop: list }, () => {
                        this.refLoading.current.hide()
                    })
                } else {
                    this.refLoading.current.hide()
                }
            })
        }
    }

    _checkTS = (val) => {
        let { timeIn, timeOut, date } = this.state
        let noiDungHop = this.noidunghop // Lấy nội dung theo bên ngoài đơn - mục lí do
        let thu = moment(date, 'DD/MM/YYYY').format('ddd').replace('T', 'Thứ ') //này tính theo date
        this.refLoading.current.show()
        if (val.dadat && val.check) {
            let list = this.state.listTaiSan.map(item => {
                if (val.RowID == item.RowID) {
                    let temp = this.state.selectTaiSan
                    if (item.check) {
                        for (let i = 0; i < temp.length; i++) {
                            if (temp[i].RoomID == item.RowID) {
                                temp.splice(i, 1)
                            }
                        }
                    }
                    this.setState({ selectTaiSan: temp }, () => this.loadTaiSan())
                }
            })
        } else {
            this.checkDangKy(val.RowID).then(res => {
                if (res) {
                    let list = this.state.listTaiSan.map(item => {
                        if (val.RowID == item.RowID) {
                            let temp = this.state.selectTaiSan
                            if (!item.check) {
                                let itemback = {
                                    "IdPhieu": -1,
                                    "RoomID": item.RowID,
                                    "BookingDate": moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD') + 'T00:00:00.0000000',
                                    "FromTime": timeIn,
                                    "ToTime": timeOut,
                                    "meetingContent": noiDungHop,
                                    "DiaDiem": item.Title + ', ' + thu + ' ' + date + ', ' + timeIn + ' - ' + timeOut,
                                    "TenPhong": item.Title
                                }
                                temp.push(itemback)
                            } else {
                                for (let i = 0; i < temp.length; i++) {
                                    if (temp[i].RoomID == item.RowID) {
                                        temp.splice(i, 1)
                                    }
                                }

                            }
                            this.setState({ selectTaiSan: temp })
                            return { ...item, check: !item.check }
                        }
                        else
                            return { ...item }
                    })

                    this.setState({ listTaiSan: list }, () => {
                        this.refLoading.current.hide()
                    })
                } else {
                    this.refLoading.current.hide()
                }
            })
        }
    }

    callbackTS = () => {
        let { selectPhong, selectTaiSan } = this.state
        this.callback(selectPhong, selectTaiSan)
        Utils.goback(this)
    }

    checkDangKy = async (Id) => {
        let { timeIn, timeOut, date, listPhongHop, listTaiSan } = this.state
        let body = {
            "RoomID": Id,
            "BookingDate": moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD') + 'T00:00:00.0000000',
            "FromTime": timeIn,
            "ToTime": timeOut
        }
        let res = await postKT_ThoiGianDat(body)
        if (res.status == 1) {
            return true
        } else {
            let listP = []
            let listTS = []
            UtilsApp.MessageShow(RootLang.lang.JeeMeeting.thongbao, res.error ? res.error.msg : RootLang.lang.JeeMeeting.dangkykhongthanhcong, 2)
            listPhongHop.map(val => {
                if (val.RowID == Id) {
                    listP.push({ ...val, showdadat: true, })
                } else {
                    listP.push({ ...val, showdadat: false })
                }
            })
            listTaiSan.map(val => {
                if (val.RowID == Id) {
                    listTS.push({ ...val, showdadat: true })
                } else {
                    listTS.push({ ...val, showdadat: false })
                }
            })
            this.setState({ listPhongHop: listP, listTaiSan: listTS })
            return false
        }

    }
    _addItemSelect = (val, loai) => {
        console.log("HHHHOAN:", val)
        let listTS = this.state.selectTaiSan
        if (loai == 1) {
            this.setState({ selectPhong: val }, () => this.loadDSPhong())
        } else {
            this.setState({ selectTaiSan: [...listTS, { ...val }] }, () => this.loadTaiSan())
        }
    }
    render() {
        let { date, timeIn, timeOut, listPhongHop, listTaiSan, selectTaiSan, selectPhong } = this.state
        console.log("Dữ liệu đã chọn PHONG:", selectPhong, listPhongHop)
        console.log("Dữ liệu đã chọn TS:", selectTaiSan, listTaiSan)
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: colors.backgroudJeeHR, flex: 1, paddingTop: paddingTopMul }]} >
                <View style={styles.touchBack}>
                    <TouchableOpacity onPress={() => this._goback()} style={styles.touchBackChild} >
                        <Text style={styles.titleBack}>{'Huỷ'}</Text>
                    </TouchableOpacity>
                    <Text style={styles.titleTop}>{'Đăng ký phòng, tài sản'}</Text>
                    <View style={{ width: Width(15) }} />
                </View>

                <ScrollView style={{ flex: 1 }}>
                    <Text style={{ color: colors.colorTitleJee, fontSize: reText(14), paddingHorizontal: 20, marginTop: 15 }}>{RootLang.lang.thongbaochung.thongtindangky.toUpperCase()}</Text>
                    <View style={styles.coverView}>
                        <View style={styles.viewRow}>
                            <Image source={Images.ImageJee.icTimeJee} style={{ width: Width(5), height: Width(5), alignSelf: 'center' }} />
                            <Text style={styles.title}>{'Ngày'}</Text>
                            {/* <TouchableOpacity onPress={() => Utils.goscreen(this, 'Modal_CalandaSingalCom', {
                                date: date || moment(new Date()).format('DD/MM/YYYY'),
                                setTimeFC: (val) => this.setState({ date: val })
                            })} style={styles.viewTouch}>
                                <Text>{date}</Text>
                            </TouchableOpacity> */}
                            <View style={styles.viewTouch}>
                                <Text>{date}</Text>
                            </View>
                        </View>
                        <View style={styles.line} />
                        <View style={styles.viewRow}>
                            <Image source={Images.ImageJee.icClock} style={{ width: Width(5), height: Width(5), alignSelf: 'center' }} />
                            <Text style={styles.title}>{'Thời gian'}</Text>
                            <View style={{ flexDirection: 'row' }}>
                                {/* <TouchableOpacity onPress={() => Utils.goscreen(this, 'Modal_GioPhutPickerBasic', { time: timeIn, _setGioPhut: (time) => this.setState({ timeIn: time }) })} style={styles.viewTouchTime}>
                                    <Text>{timeIn}</Text>
                                </TouchableOpacity>
                                <Text style={{ fontSize: reText(14), color: colors.colorNoteJee, alignSelf: 'center' }}>{' - '}</Text>
                                <TouchableOpacity onPress={() => Utils.goscreen(this, 'Modal_GioPhutPickerBasic', { time: timeOut, _setGioPhut: (time) => this.setState({ timeOut: time }) })} style={styles.viewTouchTime}>
                                    <Text>{timeOut}</Text>
                                </TouchableOpacity> */}
                                <View style={styles.viewTouchTime}>
                                    <Text>{timeIn}</Text>
                                </View>
                                <Text style={{ fontSize: reText(14), color: colors.blackJee, alignSelf: 'center' }}>{' - '}</Text>
                                <View style={styles.viewTouchTime}>
                                    <Text>{timeOut}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    {listPhongHop.length > 0 ?
                        <ScrollView style={[styles.coverView, { marginTop: 20, maxHeight: nHeight(15) }]}>
                            {listPhongHop.map((item, index) => {
                                let selectTaiSan = { "RowID": item.RowID, "Title": item.Title }
                                // console.log("item:", item)
                                return (
                                    <>
                                        <View style={styles.coverItem}>
                                            <Text style={{ width: Width(80), alignSelf: 'center' }}>
                                                <Text style={[styles.titleItem, { color: item.dadat ? colors.checkAwait : colors.blackJee }]}>{item.Title}</Text>
                                                {item.dadat && item.check ? <Text style={[styles.titleItem, { color: colors.colorTitleJee }]}> ({moment(item.date, 'YYYY-MM-DDTHH:mm:ss').format('ddd, DD/MM ')}{item.tugio} - {item.dengio} )</Text> : null}
                                            </Text>
                                            <TouchableOpacity style={{ width: Width(10), paddingVertical: item.dadat && item.showdadat ? 0 : 15, paddingTop: item.dadat && item.showdadat ? 15 : 15, justifyContent: 'flex-end', alignItems: 'flex-end' }} onPress={() => this._checkPhong(item)}>
                                                <Image source={item.check ? Images.ImageJee.icBrowser : Images.ImageJee.ic_ChoDuyet} style={{ tintColor: item.dadat && !item.check ? colors.checkAwait : null }} />
                                            </TouchableOpacity>
                                        </View>
                                        {item.dadat && item.showdadat ?
                                            <TouchableOpacity onPress={() => Utils.goscreen(this, 'Modal_DangKyTaiSan', {
                                                selectTaiSan: selectTaiSan, type: 1, date: date, timeIn: timeIn, noiDungHop: this.noidunghop, loai: 1,
                                                callbackItem: (val) => this._addItemSelect(val, 1)
                                            })} style={{ marginBottom: item.dadat && item.showdadat ? 15 : 0, width: Width(80) }}>
                                                <Text style={{ color: '#FF453B', fontSize: reText(11), fontStyle: 'italic', }}>Phòng họp đã được đăng ký trong thời gian này.</Text>
                                                <Text style={{ color: '#FF453B', fontSize: reText(11), fontStyle: 'italic', textDecorationLine: 'underline' }}>Xem lịch đã được đăng ký</Text>
                                            </TouchableOpacity> : null}
                                        {index == listPhongHop.length - 1 ? null :
                                            <View style={styles.lineItem} />}
                                    </>
                                )
                            })}
                        </ScrollView>
                        : null}
                    {listTaiSan.length > 0 ?
                        <ScrollView style={[styles.coverView, { marginTop: 20, maxHeight: nHeight(40) }]}>
                            {listTaiSan.map((item, index) => {
                                let selectTaiSan = { "RowID": item.RowID, "Title": item.Title }
                                return (
                                    <>
                                        <View style={styles.coverItem}>
                                            <Text style={{ width: Width(80), alignSelf: 'center' }}>
                                                <Text style={[styles.titleItem, { color: item.dadat ? colors.checkAwait : colors.blackJee }]}>{item.Title}</Text>
                                                {item.dadat && item.check ? <Text style={[styles.titleItem, { color: colors.colorTitleJee }]}> ({moment(item.date, 'YYYY-MM-DDTHH:mm:ss').format('ddd, DD/MM ')}{item.tugio} - {item.dengio} )</Text> : null}
                                            </Text>
                                            <TouchableOpacity style={{ width: Width(10), paddingVertical: item.dadat && item.showdadat ? 0 : 15, paddingTop: item.dadat && item.showdadat ? 15 : 15, justifyContent: 'flex-end', alignItems: 'flex-end' }} onPress={() => this._checkTS(item)}>
                                                <Image source={item.check ? Images.ImageJee.icBrowser : Images.ImageJee.ic_ChoDuyet} style={{ tintColor: item.dadat && !item.check ? colors.checkAwait : null }} />
                                            </TouchableOpacity>
                                        </View>
                                        {item.dadat && item.showdadat ?
                                            <TouchableOpacity onPress={() => Utils.goscreen(this, 'Modal_DangKyTaiSan', {
                                                selectTaiSan: selectTaiSan, type: 1, date: date, timeIn: timeIn, noiDungHop: this.noidunghop, loai: 2,
                                                callbackItem: (val) => this._addItemSelect(val, 2)
                                            })} style={{ marginBottom: item.dadat && item.showdadat ? 15 : 0, width: Width(80) }}>
                                                <Text style={{ color: '#FF453B', fontSize: reText(11), fontStyle: 'italic', }}>Phòng họp đã được đăng ký trong thời gian này.</Text>
                                                <Text style={{ color: '#FF453B', fontSize: reText(11), fontStyle: 'italic', textDecorationLine: 'underline' }}>Xem lịch đã được đăng ký</Text>
                                            </TouchableOpacity> : null}
                                        {index == listPhongHop.length - 1 ? null :
                                            <View style={styles.lineItem} />}
                                    </>
                                )
                            })}
                        </ScrollView>
                        : null}
                </ScrollView>

                <View style={{ backgroundColor: colors.backgroudJeeHR, position: 'absolute', bottom: 0, left: 0, paddingBottom: 15 + paddingBotX, margin: 0, width: Width(100), paddingTop: 15 }}>
                    <TouchableOpacity onPress={() => this.callbackTS()} style={styles.create}>
                        <Text style={{ fontSize: reText(14), color: colors.greenButtonJeeHR, fontWeight: 'bold' }}> {'Đăng ký'} </Text>
                    </TouchableOpacity>
                </View>
                <IsLoading ref={this.refLoading} />
            </View >
        )
    }
}
const styles = StyleSheet.create({
    touchBack: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15, marginTop: 15 },
    touchBackChild: { width: Width(15), height: 30 },
    titleBack: { color: colors.checkAwait, fontSize: reText(14) },
    titleTop: { fontSize: reText(18), color: colors.titleJeeHR, fontWeight: 'bold' },
    coverView: { backgroundColor: colors.white, marginHorizontal: 10, paddingHorizontal: 10, borderRadius: 10, marginTop: 10 },
    title: { fontSize: reText(14), color: colors.colorNoteJee, marginLeft: 10, flex: 1, alignSelf: 'center' },
    viewTouch: { justifyContent: 'center', alignItems: 'center', paddingVertical: 5, borderRadius: 5 },
    viewTouchTime: { justifyContent: 'center', alignItems: 'center', paddingVertical: 5, borderRadius: 5 },
    line: { height: 0.5, backgroundColor: colors.grayLine, marginRight: -10, marginLeft: Width(7.5) },
    lineItem: { height: 0.5, backgroundColor: colors.grayLine, marginRight: -10 },
    viewRow: { flexDirection: 'row', paddingVertical: 11 },
    coverItem: { flexDirection: 'row' },
    titleItem: { color: colors.blackJee, fontSize: reText(14), alignSelf: 'center' },
    create: {
        borderRadius: 10, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', paddingVertical: 15,
        borderColor: colors.black_20, marginHorizontal: 10,
        backgroundColor: colors.white, width: Width(95)
    }
})
export default ModalDangKyChung
