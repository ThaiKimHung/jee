import moment from 'moment'
import React, { Component, Fragment } from 'react'
import ReactNative, { Animated, Image, Platform, StyleSheet, Text, TextInput, View, BackHandler } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Get_ThoigianTinhCong } from '../../../../apis/apiControllergeneral'
import { Get_DSNgay, Insert_ChiTietGiaiTrinh } from '../../../../apis/apiGiaiTrinh'
import { ROOTGlobal } from '../../../../app/data/dataGlobal'
import { RootLang } from '../../../../app/data/locales'
import Utils from '../../../../app/Utils'
import ButtonCom from '../../../../components/Button/ButtonCom'
import { Images } from '../../../../images'
import { colors, nstyles } from '../../../../styles'
import { reText, sizes } from '../../../../styles/size'
import { Height, nHeight, paddingBotX, Width } from '../../../../styles/styles'
import HeaderModalCom from '../../../../Component_old/HeaderModalCom'
import _ from 'lodash'
import UtilsApp from '../../../../app/UtilsApp';
import { nGlobalKeys } from '../../../../app/keys/globalKey';
import { getDSChamCong } from '../../../../apis/apiTimesheets';
class Modal_GiaiTrinh extends Component {
    constructor(props) {
        super(props)
        this.Enable = Utils.ngetParam(this, 'Enable', true) //Mặc định cho bật cho người dùng có thể thao tác, ngc lại chỉ xem
        this.Hide = Utils.ngetParam(this, 'Hide', false)
        this.Item = Utils.ngetParam(this, 'item', {})
        this.date = (Utils.ngetParam(this, "date", ''))
        this.state = {
            opacity: new Animated.Value(0),
            dateValue: '',
            timeValue: { id: -1, time: '' },
            LyDo: '',
            // timeIn: Utils.getGlobal(nGlobalKeys.giobatdau, ''),
            // timeOut: Utils.getGlobal(nGlobalKeys.gioketthuc, ''),
            timeIn: '',
            timeOut: '',
            isEnable: this.Enable,
            RowID: Utils.ngetParam(this, 'RowID', 0),
            dataNgay: {},
            congThang: '',
            congNam: '',
            congngay: new Date().getDay() + 1,
            date: this.date != "Invalid date" && this.date ? this.date : this.Item.Ngay,
            listTime: [
                {
                    id: 0,
                    time: RootLang.lang.scgiaitrinhchamcong.vao
                },

                {
                    id: 1,
                    time: RootLang.lang.scgiaitrinhchamcong.ra
                },
                {
                    id: 2,
                    time: RootLang.lang.scgiaitrinhchamcong.vaora
                }
            ]
        }
    }

    async componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this._backHandlerButton)
        this._startAnimation(0.8)
        await this._getThangTinhCong()
        _.size(this.Item) > 0 || this.date.length > 17 ? this._setUpduLieu() : null
        this.GetCongTheoNgay(this.Item.Ngay ? moment(this.Item.Ngay).format("DD/MM/YYYY") : moment(this.date).format("DD/MM/YYYY"))

    }
    componentWillUnmount() {
        this.backHandler.remove()
    }
    _backHandlerButton = () => {
        this.goback()
        return true
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

    GetCongTheoNgay = async (date = moment(this.Item.Ngay).format("DD/MM/YYYY")) => {
        let val = `${date}|${date}`
        let res = await getDSChamCong(val, 1, 10);
        if (res.status == 1) {
            // this.setState({ timeIn: res.data[0].GioBatDau, timeOut: res.data[0].GioKetThuc })
            //Đoạn này viết tăng giảm thời gian sẳn cho giải trình
            if (res.data[0].vao != "" && res.data[0].ra != "") {
                this.setState({ timeIn: res.data[0].GioBatDau, timeOut: res.data[0].GioKetThuc })
            }
            else {
                if (res.data[0].vao == "" && res.data[0].ra == "") {
                    this.setState({ timeIn: res.data[0].GioBatDau, timeOut: res.data[0].GioKetThuc })
                }
                if (res.data[0].vao != "") {
                    if (res.data[0].vao <= res.data[0].GioBatDau) {
                        this.setState({ timeOut: res.data[0].GioKetThuc })
                    } else {
                        var _chamvao = moment(res.data[0].vao, "HH:mm")
                        var _giobatdau = moment(res.data[0].GioBatDau, "HH:mm")
                        let phut = _chamvao.diff(_giobatdau, 'minutes')
                        if (phut > 0) {
                            let addGioRa = moment(res.data[0].GioKetThuc, 'HH:mm').add(phut, 'minute').format('HH:mm')
                            this.setState({ timeOut: addGioRa })
                        } else {
                            this.setState({ timeOut: res.data[0].GioKetThuc })
                        }
                    }
                }
                if (res.data[0].ra != "") {
                    if (res.data[0].ra >= res.data[0].GioKetThuc)
                        this.setState({ timeIn: res.data[0].GioBatDau })
                    else {
                        this.setState({ timeIn: res.data[0].GioBatDau })
                    }

                }
            }
        }
    }

    _setUpduLieu = () => {
        if (this.state.RowID != 0) {
            if (this.state.date == undefined) {
                var day = ''
            }
            else {
                var day = moment(this.state.date).format('DD/MM/YYYY');

            }
            this.setState({ dateValue: day }, this._Get_DSNgay);
        }
        //Hoàng bổ sung tạm thời
        else {
            if (this.state.date) {
                var day = moment(this.state.date).format('DD/MM/YYYY');
                this.setState({ dateValue: day }, this._Get_DSNgay);
            }
        }
    }
    _getThangTinhCong = async () => {
        let res = await Get_ThoigianTinhCong();
        // Utils.nlog('res Get_ThoigianTinhCong ', res)
        if (res.status == 1) {
            this.setState({ congThang: res.Thang, congNam: res.Nam })
        }
    }

    _Get_DSNgay = async () => {
        const { RowID, dateValue, listTime } = this.state;
        var vals = `${RowID}|${dateValue}`;
        const res = await Get_DSNgay(vals);
        // Utils.nlog("gia tri ds ngày-------------------------", res);
        if (res.status == 1) {
            var dateObject = res.data ? res.data[res.data.length - 1] : {};
            if (dateObject.GioCanSua == 0 || dateObject.GioCanSua == 1 || dateObject.GioCanSua == 2) {
                var object = listTime.find(item => item.id == dateObject.GioCanSua);
            }
            this.setState({ dataNgay: dateObject, timeValue: object ? object : { id: -1, time: '' } })
        } else {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
            this.setState({ dataNgay: {}, dateValue: '', timeValue: { id: -1, time: '' } })
        }
    }


    _chooseDate = () => {
        if (this.state.isEnable == false || this.Hide) {
            return;
        }
        else {
            var { dateValue, date } = this.state;
            let thang = date.split("-").slice(1)
            let nam = date.split("-").slice(0, 1)
            Utils.goscreen(this, "Modal_CalandaSingalCom", {
                date: dateValue ? dateValue : '',
                disable: true,
                month: dateValue ? this.state.congThang : thang,
                years: dateValue ? this.state.congNam : nam,
                setTimeFC: this._setDate
            })
        }
    }
    _Insert_ChiTietGiaiTrinh = async () => {
        let { dateValue, timeValue, LyDo, timeIn, timeOut, isEnable, dataNgay, RowID } = this.state;
        const split = dateValue.split('/');
        const month = split[1]
        const year = split[2]
        if (dateValue == '') {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.scgiaitrinhchamcong.chuachonngaygiaitrinh, 3)
            // this._endAnimation(0)
            return this;
        }
        if (timeValue.id == 2) {
            if (timeIn == '') {
                UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.scgiaitrinhchamcong.chuachongiovao, 3)
                // this._endAnimation(0)
                return this;
            }
            if (timeOut == '') {
                UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.scgiaitrinhchamcong.chuachongiora, 3)
                // this._endAnimation(0)
                return this;
            }
        }
        if (timeValue.id == 0) {
            if (timeIn == '') {
                UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.scgiaitrinhchamcong.chuachongiovao, 3)
                // this._endAnimation(0)
                return this;
            }

        }
        if (timeValue.id == 1) {
            if (timeOut == '') {
                UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.scgiaitrinhchamcong.chuachongiora, 3)
                this._endAnimation(0)
                return this;
            }
        }
        if (LyDo == '') {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.scgiaitrinhchamcong.chuanhaplydo, 3)
            this._endAnimation(0)
            return this;
        }
        var arrtimeIn = timeIn.split(":")
        var arrtimeOut = timeOut.split(":")
        let body = {
            RowID: this.state.RowID,
            Thang: month,
            Nam: year,
            Ngay: moment(dateValue, 'DD/MM/YYYY').format('DD/MM/YYYY'),
            GioVao: timeIn ? `${[0] < 10 ? `${arrtimeIn[0]}` : arrtimeIn[0]}:${arrtimeIn[1] < 10 ? `${arrtimeIn[1]}` : arrtimeIn[1]}` : "",
            GioRa: timeOut ? `${arrtimeOut[0] < 10 ? `${arrtimeOut[0]}` : arrtimeOut[0]}:${arrtimeOut[1] < 10 ? `${arrtimeOut[1]}` : arrtimeOut[1]}` : "",
            GioCanSua: timeValue.id,
            LyDo: LyDo ? LyDo : "",
        }
        this._endAnimation(0)
        Utils.goback(this, null)
        const res = await Insert_ChiTietGiaiTrinh(body);
        // Utils.nlog("=-=-=body", body)
        {
            if (res.status == 1) {
                UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.thongbaochung.themngaythanhcong, 1)
                if (ROOTGlobal.GTChamCong.getDSGTChiTiet) {
                    ROOTGlobal.GTChamCong.getDSGTChiTiet();
                }
            } else {
                UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.thuchienthatbai, 2)
            }
        }
    }

    _setDate = (date) => {
        this.setState({ dateValue: date }, this._Get_DSNgay)

        let dateNew = moment().format("DD/MM/YYYY")
        if (date <= dateNew) {
            this.GetCongTheoNgay(date)
        }
    }

    _DropDown = () => {
        if (this.state.isEnable == false) {
            return;
        }
        else if (this.state.dateValue == '') {
            UtilsApp.MessageShow("Thông báo", "Vui lòng chọn ngày", 3)
        }
        else {
            Utils.goscreen(this, 'Modal_DropDownCus', { callback: this._callback, item: this.state.timeValue, AllThaoTac: this.state.listTime, Key: 'id', Value: 'time' })
        }
    }

    _callback = (timeValue) => {
        this.setState({ timeValue }, () => this._renderProgress());
    }
    goback = () => {
        this._endAnimation(0)
        Utils.goback(this, null);
    }
    _SetGioVao = (timeIn) => {
        const { dateValue } = this.state
        if (dateValue == String(timeIn).split(" ").slice(0, 1).toString()) {
            this.setState({ timeIn: String(timeIn).split(" ").slice(1).toString() })
        }
        else
            this.setState({ timeIn: timeIn })
    }

    _SetGioRa = (timeOut) => {
        const { dateValue } = this.state
        if (dateValue == String(timeOut).split(" ").slice(0, 1).toString()) {
            this.setState({ timeOut: String(timeOut).split(" ").slice(1).toString() })
        }
        else
            this.setState({ timeOut: timeOut })
    }

    // _selectTime = (val) => {
    //     var { timeIn,
    //         timeOut, dateValue } = this.state;
    //     Utils.goscreen(this, 'Modal_NgayGioPhutPicker',
    //         {
    //             isFrom: val,
    //             timeFrom: timeIn,
    //             timeTo: timeOut,
    //             // timeFrom: '',
    //             // timeTo: '',
    //             textTitleF: RootLang.lang.thongbaochung.giovaodung,
    //             textTitleT: RootLang.lang.thongbaochung.gioradung,
    //             DateTime: [moment(dateValue, 'DD/MM/YYYY').subtract(1, 'day').format("DD/MM/YYYY"), moment(dateValue, 'DD/MM/YYYY').format("DD/MM/YYYY"), moment(dateValue, 'DD/MM/YYYY').add(1, 'day').format("DD/MM/YYYY")],
    //             _setGoPhut: (_timeIn, _timeOut) => {

    //                 let timeIn = _timeIn.length > 10 ? _timeIn : _timeIn
    //                 let timeOut = _timeOut.length > 10 ? _timeOut : _timeOut
    //                 let result = moment(timeOut, "DD/MM/YYYY HH:mm").isSameOrAfter(moment(timeIn, "DD/MM/YYYY HH:mm"), "minute");
    //                 if (result == true) {
    //                     if (dateValue == String(timeOut).split(" ").slice(0, 1).toString())
    //                         this.setState({ timeOut: String(timeOut).split(" ").slice(1).toString() })
    //                     else if (dateValue != String(timeOut).split(" ").slice(0, 1).toString())
    //                         this.setState({ timeOut: timeOut })
    //                     if (dateValue == String(timeIn).split(" ").slice(0, 1).toString())
    //                         this.setState({ timeIn: String(timeIn).split(" ").slice(1).toString() })
    //                     else if (dateValue != String(timeIn).split(" ").slice(0, 1).toString())
    //                         this.setState({ timeIn: timeIn })
    //                 } else {
    //                     UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.scgiaitrinhchamcong.giokhonghople, 3)
    //                 }
    //             }
    //         })
    // }
    _goScreenModal = (type) => {
        const { dateValue, timeIn, timeOut } = this.state

        const _dateTime = [moment(dateValue, 'DD/MM/YYYY').subtract(1, 'day').format("DD/MM/YYYY"), moment(dateValue, 'DD/MM/YYYY').format("DD/MM/YYYY"), moment(dateValue, 'DD/MM/YYYY').add(1, 'day').format("DD/MM/YYYY")]
        const _textTitle = type ? RootLang.lang.thongbaochung.giovaodung : RootLang.lang.thongbaochung.gioradung
        const _setgiophut = type ? this._SetGioVao : this._SetGioRa
        const _time = type ? timeIn : timeOut

        Utils.goscreen(this, "Modal_NgayGioPhutPickerSingal", {
            _setGoPhut: _setgiophut,
            Time: _time,
            textTitle: _textTitle,
            DateTime: _dateTime
        })
    }

    _renderProgress = () => {
        const { timeValue, LyDo, timeIn, timeOut, isEnable, dataNgay, dateValue } = this.state;

        switch (timeValue.id) {
            case 0:
                return (
                    <Fragment>
                        <View style={{ height: 0.5, backgroundColor: colors.colorLineJee }} />
                        <View style={{ flexDirection: 'row', marginTop: 15 }}>
                            <View style={{ width: Width(6), marginTop: 5 }}>
                                <Image source={Images.ImageJee.icClockJee} style={{ width: 18, height: 18, }} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                                    <Text style={{ fontSize: reText(14), color: colors.colorNoteJee }}>{RootLang.lang.thongbaochung.giovaodung}</Text>
                                    <TouchableOpacity onPress={() => this._goScreenModal(true)} style={{ backgroundColor: colors.backgroundHistory, flexDirection: 'row', paddingVertical: 5, justifyContent: 'center', alignItems: 'center', borderRadius: 5, paddingHorizontal: 10, minWidth: Width(30) }}>
                                        <Text numberOfLines={1} style={{ fontSize: reText(14), maxWidth: Width(55), color: colors.blackJee }}>{timeIn ? timeIn : '--'}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Fragment>
                )

            case 1:
                return (<Fragment>
                    <Fragment>
                        <View style={{ height: 0.5, backgroundColor: colors.colorLineJee }} />
                        <View style={{ flexDirection: 'row', marginTop: 15 }}>
                            <View style={{ width: Width(6), marginTop: 5 }}>
                                <Image source={Images.ImageJee.icClockJee} style={{ width: 18, height: 18, }} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                                    <Text style={{ fontSize: reText(14), color: colors.colorNoteJee }}>{RootLang.lang.thongbaochung.gioradung}</Text>
                                    <TouchableOpacity onPress={() => this._goScreenModal(false)} style={{ backgroundColor: colors.backgroundHistory, flexDirection: 'row', paddingVertical: 5, justifyContent: 'center', alignItems: 'center', borderRadius: 5, paddingHorizontal: 10, minWidth: Width(30) }}>
                                        <Text numberOfLines={1} style={{ fontSize: reText(14), maxWidth: Width(55), color: colors.blackJee }}>{timeOut ? timeOut : '--'}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                    </Fragment>
                </Fragment>)

            case 2:
                return (<Fragment>
                    <View style={{ height: 0.5, backgroundColor: colors.colorLineJee }} />
                    <View style={{ flexDirection: 'row', marginTop: 15 }}>
                        <View style={{ width: Width(6), marginTop: 5 }}>
                            <Image source={Images.ImageJee.icClockJee} style={{ width: 18, height: 18, }} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                                <Text style={{ fontSize: reText(14), color: colors.colorNoteJee }}>{RootLang.lang.thongbaochung.giovaodung}</Text>
                                {/* onPress={() => this._selectTime(true)} ? */}
                                <TouchableOpacity onPress={() => this._goScreenModal(true)} style={{ backgroundColor: colors.backgroundHistory, flexDirection: 'row', paddingVertical: 5, justifyContent: 'center', alignItems: 'center', borderRadius: 5, paddingHorizontal: 10, minWidth: Width(30) }}>
                                    <Text numberOfLines={1} style={{ fontSize: reText(14), maxWidth: Width(55), color: colors.blackJee }}>{timeIn ? timeIn : '--'}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ height: 0.5, backgroundColor: colors.colorLineJee }} />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 15 }}>
                        <View style={{ width: Width(6), marginTop: 5 }}>
                            <Image source={Images.ImageJee.icClockJee} style={{ width: 18, height: 18, }} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                                {/* onPress={() => this._selectTime(false) */}
                                <Text style={{ fontSize: reText(14), color: colors.colorNoteJee }}>{RootLang.lang.thongbaochung.gioradung}</Text>
                                <TouchableOpacity onPress={() => this._goScreenModal(false)} style={{ backgroundColor: colors.backgroundHistory, flexDirection: 'row', paddingVertical: 5, justifyContent: 'center', alignItems: 'center', borderRadius: 5, paddingHorizontal: 10, minWidth: Width(30) }}>
                                    <Text numberOfLines={1} style={{ fontSize: reText(14), maxWidth: Width(55), color: colors.blackJee }}>{timeOut ? timeOut : '--'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Fragment>)

            default:
                break;
        }
    }
    render() {
        const { opacity, dateValue, timeValue, LyDo, dataNgay, date } = this.state;
        let dateValueNew = dateValue ? moment(dateValue, 'DD/MM/YYYY').format('ddd, DD/MM/YYYY') : undefined
        let ChamVao = dataNgay.GioChamCong ? (dataNgay.GioChamCong.split('-')[0].length > 1 ? true : false) : false//xét có chấm vào 
        let ChamRa = dataNgay.GioChamCong ? (dataNgay.GioChamCong.split('-')[1].length > 1 ? true : false) : false//xét có chấm vào 
        let giochamcong = dataNgay.GioChamCong ? dataNgay.GioChamCong : ' - '
        return (
            <KeyboardAwareScrollView style={{ flex: 1, backgroundColor: `transparent`, height: nHeight(100) }} keyboardShouldPersistTaps='handled'>
                <View style={[nstyles.ncontainer, { backgroundColor: `transparent`, justifyContent: 'flex-end', height: nHeight(100) }]}>
                    <Animated.View onTouchEnd={this.goback} style={{
                        position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
                        alignItems: 'flex-end', backgroundColor: colors.backgroundModal, opacity
                    }} />
                    <Animated.View style={{ backgroundColor: colors.backgroudJeeHR, width: '100%', borderTopLeftRadius: 15, borderTopRightRadius: 15, paddingBottom: 20 + paddingBotX }}>
                        <View style={{ alignSelf: 'center', width: 300, height: 25, justifyContent: 'center' }}>
                            <Image source={Images.icTopModal} style={{ alignSelf: 'center' }} />
                        </View>
                        <View style={{ flexDirection: 'row', paddingHorizontal: 15 }}>
                            <TouchableOpacity onPress={this.goback} style={{ width: Width(12), height: nHeight(3), justifyContent: 'center' }}>
                                <Text style={{ fontSize: reText(14), color: colors.checkAwait }}>{RootLang.lang.sckhac.huy}</Text>
                            </TouchableOpacity>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: reText(18), fontWeight: 'bold', color: colors.titleJeeHR }}>
                                    {RootLang.lang.scgiaitrinhchamcong.giaitrinh}
                                </Text>
                            </View>
                            <View style={{ width: Width(12) }} />
                        </View>
                        <Text style={{ color: colors.colorTitleJee, fontSize: reText(14), paddingHorizontal: 20, marginTop: 15 }}>{RootLang.lang.thongbaochung.thongtindangky.toUpperCase()}</Text>
                        <View style={{ backgroundColor: colors.white, paddingHorizontal: 10, paddingTop: 15, paddingBottom: 5, marginHorizontal: 10, borderRadius: 10, marginTop: 5 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ width: Width(6), marginTop: 5 }}>
                                    <Image source={Images.ImageJee.icTimeJee} style={{ width: 18, height: 18, }} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                                        <Text style={{ fontSize: reText(14), color: colors.colorNoteJee }}>{RootLang.lang.scgiaitrinhchamcong.ngaygiaitrinh}</Text>
                                        <TouchableOpacity onPress={this._chooseDate} style={{ backgroundColor: colors.backgroundHistory, flexDirection: 'row', paddingVertical: 5, justifyContent: 'center', alignItems: 'center', borderRadius: 5, paddingHorizontal: 10, minWidth: Width(30) }}>
                                            <Text numberOfLines={1} style={{ fontSize: reText(14), maxWidth: Width(55), color: colors.blackJee }}>{dateValueNew ? dateValueNew : RootLang.lang.scgiaitrinhchamcong.chonngay}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ height: 0.5, backgroundColor: colors.colorLineJee }} />
                                </View>
                            </View>

                            {/* Ngày chấm công */}
                            <View style={{ flexDirection: 'row', marginTop: 15 }}>
                                <View style={{ width: Width(6) }}>
                                    <Image source={Images.ImageJee.icClock} style={{ width: 18, height: 18, }} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                                        <Text style={{ fontSize: reText(14), color: colors.colorNoteJee }}>{RootLang.lang.scgiaitrinhchamcong.giochamcong}</Text>
                                        <Text style={{ fontSize: reText(14), maxWidth: Width(55), color: colors.blackJee }}>{ChamVao ? '' : '#'}{giochamcong}{ChamRa ? '' : '#'}</Text>
                                    </View>
                                    <View style={{ height: 0.5, backgroundColor: colors.colorLineJee }} />
                                </View>
                            </View>

                            <View style={{ flexDirection: 'row', marginTop: 15 }}>
                                <View style={{ width: Width(6), marginTop: 5 }}>
                                    <Image source={Images.ImageJee.jwTime} style={{ width: 18, height: 18, }} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                                        <Text style={{ fontSize: reText(14), color: colors.colorNoteJee }}>{RootLang.lang.scgiaitrinhchamcong.giocansua}</Text>
                                        <TouchableOpacity onPress={this._DropDown} style={{ backgroundColor: colors.backgroundHistory, flexDirection: 'row', paddingVertical: 5, justifyContent: 'center', alignItems: 'center', borderRadius: 5, paddingHorizontal: 10, minWidth: Width(30) }}>
                                            <Text numberOfLines={1} style={{ fontSize: reText(14), maxWidth: Width(55), color: colors.blackJee }}>{timeValue.time ? timeValue.time : RootLang.lang.thongbaochung.chon}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            {this._renderProgress()}

                        </View>
                        <Text style={{ color: colors.colorTitleJee, fontSize: reText(14), paddingHorizontal: 20, marginTop: 20, marginBottom: 5 }}>{RootLang.lang.thongbaochung.lydo.toUpperCase()}</Text>
                        <View style={{ backgroundColor: colors.white, marginHorizontal: 10, borderRadius: 10, paddingVertical: 10 }}>
                            <TextInput
                                placeholder={RootLang.lang.err.nhaplyloJee}
                                multiline={true}
                                textAlignVertical={"top"}
                                // editable={isEnable}
                                value={LyDo}
                                style={[nstyles.ntextinput, { maxHeight: nHeight(12), fontSize: reText(14), height: nHeight(12), paddingHorizontal: 10 }]}
                                onChangeText={(LyDo) => this.setState({ LyDo })}

                            />
                        </View>
                        <TouchableOpacity onPress={this._Insert_ChiTietGiaiTrinh} style={styles.create} >
                            <Text style={{ fontSize: reText(14), color: colors.greenButtonJeeHR, fontWeight: 'bold' }}>{RootLang.lang.thongbaochung.xacnhan}</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View >
            </KeyboardAwareScrollView>
        )
    }
}
const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(Modal_GiaiTrinh, mapStateToProps, true)

const styles = StyleSheet.create({
    containerDrop: {
        justifyContent: 'space-between',
        marginHorizontal: 10,
        marginVertical: 8,
        padding: 13,
        borderWidth: 1,
        // flex: 1,
        backgroundColor: colors.white,
        borderColor: colors.borderGray,
        ...nstyles.nstyles.nrow,
        ...nstyles.nstyles.shadow,
        shadowOpacity: 0.1,
        shadowColor: colors.black_10
    },
    textInput: {
        flex: 1,
        minHeight: 100,
        borderWidth: 1,
        borderColor: colors.borderGray,
        marginHorizontal: 10,
        marginVertical: 8,
        backgroundColor: colors.white,
        ...nstyles.nstyles.ntextinput,
        ...nstyles.nstyles.shadow,
        shadowOpacity: 0.1,
        shadowColor: colors.black_10
    },
    create: {
        width: '95%', borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', paddingVertical: 15, marginHorizontal: 10,
        backgroundColor: colors.white, marginBottom: paddingBotX, marginTop: 36
    }
})
