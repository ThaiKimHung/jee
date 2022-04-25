import React, { Component } from 'react';
import {
    Dimensions, SafeAreaView, Text, TouchableOpacity, View, Platform, Image, Animated, StyleSheet, ScrollView,
    TextInput, Switch, FlatList, BackHandler
} from 'react-native';
import { TabView } from 'react-native-tab-view';
import { RootLang } from '../../../../app/data/locales';
import Utils from '../../../../app/Utils';
import UtilsApp from '../../../../app/UtilsApp'
import HeaderComStack from '../../../../components/HeaderComStack';
import { Images } from '../../../../images';
import { colors } from '../../../../styles/color';
import { fonts } from '../../../../styles/font';
import { reText, sizes } from '../../../../styles/size';
import { nstyles, Width, heightHed, heightStatusBar, paddingBotX, nHeight, paddingTopMul, Height } from '../../../../styles/styles';
import { Get_DetailCongViec, } from "../../../../apis/JeePlatform/API_JeeWork/apiCongViecLapLai";
import { ROOTGlobal } from '../../../../app/data/dataGlobal';
import moment from 'moment';
import HangTuan from '../HangTuan/HangTuan'
import HangThang from '../HangThang/HangThang'
import { isIphoneX } from 'react-native-iphone-x-helper';
import HeaderModalCom from '../../../../Component_old/HeaderModalCom';
import IsLoading from '../../../../components/IsLoading';
import ImageCus from '../../../../components/NewComponents/ImageCus';
import _ from 'lodash';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import HTML from 'react-native-render-html';
import { getListNhanVien } from '../../../../apis/JeePlatform/API_JeeWork/apiDSNhanVien';
import { Tao_CongViecLapLai, Update_CongViecLapLai } from '../../../../apis/JeePlatform/API_JeeWork/apiCongViecLapLai';
import { getListDuAnTaoCongViec } from '../../../../apis/JeePlatform/API_JeeWork/apiDuAn';

const dataChuKyLap = [
    {
        id: 1,
        title: 'Hàng tuần'
    },
    {
        id: 2,
        title: 'Hàng tháng'
    },
]

const hashCode = (str) => {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
}

const intToRGB = (i) => {
    var c = (i & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();
    return "#" + "00000".substring(0, 6 - c.length) + c;
}

let indexTam = 0
class TaoCongViecMoi extends Component {
    constructor(props) {
        super(props);
        this.type = Utils.ngetParam(this, 'type', '')
        this.reLoad = Utils.ngetParam(this, 'reLoad', () => { })
        this.chinhSua = Utils.ngetParam(this, 'chinhSua', false)
        this.nhanBan = Utils.ngetParam(this, 'nhanBan', false)
        this.rowid = Utils.ngetParam(this, 'rowid', '')
        this.refLoading = React.createRef()
        this.state = {
            opacity: new Animated.Value(0),
            tenCV: '',
            soGio: '',
            listPiority: [
                { row: 0, name: RootLang.lang.JeeWork.khongcodouutien, color: "grey" },
                { row: 1, name: RootLang.lang.JeeWork.douutienkhancap, color: "#DA3849" },
                { row: 2, name: RootLang.lang.JeeWork.douutiencao, color: '#F2C132' },
                { row: 3, name: RootLang.lang.JeeWork.douutienbinhthuong, color: '#6E47C9' },
                { row: 4, name: RootLang.lang.JeeWork.douutienthap, color: '#6F777F' },

            ],
            piority: { row: 0, name: RootLang.lang.JeeWork.khongcodouutien, color: "grey" },
            _dateDk: '',
            _dateKt: '',
            moTa: '',
            QuickID: true,
            // chuKyLap: { id: 0, title: 'Không chọn' },
            chuKyLap: {},
            dataChuKy: [],
            dataDuAn: {},
            nguoiTH: [],
            listNv: [],
            dataCongViecCon: [],
            dataCongViecCuThe: [],
            listDuAn: [],
            dataChinhSua: []
        }
    }

    componentDidMount = () => {
        BackHandler.addEventListener("hardwareBackPress", this._goBack);
        this._startAnimation(0.8)
        this._KiemTraLoaiChuKy()
        this.chinhSua == true || this.nhanBan == true ? this._GetDetailCV() : null
    }

    componentWillUnmount() {
        try {
            BackHandler.removeEventListener('hardwareBackPress', this._goBack)
        }
        catch (error) {
        }
    }

    _GetDetailCV = async () => {
        this.refLoading.current.show()
        let res = await Get_DetailCongViec(this.rowid)
        // console.log('res _getDetailCV', res)
        if (res.status == 1) {
            this.setState({
                dataChinhSua: res.data
            }, () => {
                this._getDSDuAn()
            })
        }
        else {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.JeeWork.laydulieuthatbai, 2)
            this.refLoading.current.hide()
        }
    }

    _getDSDuAn = async () => {
        const res = await getListDuAnTaoCongViec('')
        // console.log('res du an', res)
        if (res.status == 1) {
            this.setState({ listDuAn: res.data, }, () => {
                this._GanData()
            })
        }
        else {
            // UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, res.error ? res.error.message : RootLang.lang.JeeWork.laydulieuthatbai, 2)
        }
    }

    _GanData = () => {
        const { listDuAn, dataChinhSua } = this.state
        let duan = {}
        listDuAn.map(item => {
            if (item.id_row == dataChinhSua.id_project_team) {
                duan = item
            }
        })
        let datachuky = []
        let obj = dataChinhSua.repeated_day.split(',')
        obj.map((item, index) => {
            if (this.type == 'Hàng tuần') {
                let ngayDaydu = ''
                if (item == 'T2') {
                    ngayDaydu = 'Thứ 2'
                }
                else if (item == 'T3') {
                    ngayDaydu = 'Thứ 3'
                }
                else if (item == 'T4') {
                    ngayDaydu = 'Thứ 4'
                }
                else if (item == 'T5') {
                    ngayDaydu = 'Thứ 5'
                }
                else if (item == 'T6') {
                    ngayDaydu = 'Thứ 6'
                }
                else if (item == 'T7') {
                    ngayDaydu = 'Thứ 7'
                }
                else if (item == 'CN') {
                    ngayDaydu = 'Chủ nhật'
                }
                datachuky.push({ 'ngay': ngayDaydu, 'ngayRutgon': item, 'check': true })
            }
            else {
                datachuky.push({ 'ngay': item, 'ngayRutgon': item, 'check': true })
            }
        })
        let CVCon = []
        let CVCuThe = []
        dataChinhSua.Tasks.map(item => {
            if (item.IsTodo == false) {
                CVCon.push(item)
            }
            else {
                CVCuThe.push(item)
            }
        })
        let tencv = this.nhanBan == true ? dataChinhSua.title + ' (Copy)' : dataChinhSua.title

        this.setState({
            tenCV: tencv,
            nguoiTH: dataChinhSua.Users,
            dataCongViecCon: CVCon,
            dataCongViecCuThe: CVCuThe,
            _dateDk: moment(dataChinhSua.start_date, 'YYYY/MM/DD HH:mm:ss').format('DD/MM/YYYY'),
            _dateKt: dataChinhSua?.end_date ? moment(dataChinhSua.end_date, 'YYYY/MM/DD HH:mm:ss').format('DD/MM/YYYY') : '',
            chuKyLap: dataChinhSua.frequency == 1 ? { id: 1, title: 'Hàng tuần' } : { id: 2, title: 'Hàng tháng' },
            soGio: dataChinhSua.deadline != null ? (dataChinhSua.deadline).toString() : 0,
            QuickID: dataChinhSua.Locked == false ? true : false,
            dataDuAn: duan,
            dataChuKy: datachuky,
        }, () => { this._loadDsNhanVien(this.state.dataDuAn?.id_row) })
    }

    _Tao_CongViecLapLai = async () => {
        const { moTa, _dateDk, _dateKt, QuickID, dataChuKy, nguoiTH, tenCV, soGio, chuKyLap, dataDuAn, dataCongViecCon, dataCongViecCuThe } = this.state
        let checkDataRong = this._CheckDataRong()
        // console.log('cehck', checkDataRong)
        if (checkDataRong) {
            this.refLoading.current.show()

            let dataNguoiTH = []
            let dataCVcon = []
            if (nguoiTH.length > 0) {
                nguoiTH.map(item => {
                    dataNguoiTH.push({
                        'id_row': 0,
                        'id_user': item.id_nv,
                        'loai': 1,
                        '_defaultFieldName': "",
                        '_isDeleted': false,
                        '_isEditMode': false,
                        '_isNew': false,
                        '_isUpdated': false,
                        '_prevState': null,
                        '_userId': 0,
                    })
                })
            }
            // console.log('dataNguoiTH', dataNguoiTH)

            if (dataCongViecCon.length > 0) {
                dataCongViecCon.map(item => {
                    dataCVcon.push({
                        'Deadline': item.Deadline,
                        'IsTodo': false,
                        'Title': item.Title,
                        'UserID': item.id_nv,
                        'id_repeated': 0,
                        'id_row': 0,
                        '_defaultFieldName': "",
                        '_isDeleted': false,
                        '_isEditMode': false,
                        '_isNew': false,
                        '_isUpdated': false,
                        '_prevState': null,
                        '_userId': 0,
                    })
                })
            }
            if (dataCongViecCuThe.length > 0) {
                dataCongViecCuThe.map(item => {
                    dataCVcon.push({
                        'IsTodo': true,
                        'Title': item.Title,
                        'UserID': item.id_nv,
                        'id_repeated': 0,
                        'id_row': 0,
                        '_defaultFieldName': "",
                        '_isDeleted': false,
                        '_isEditMode': false,
                        '_isNew': false,
                        '_isUpdated': false,
                        '_prevState': null,
                        '_userId': 0,
                    })
                })
            }
            // console.log('dataCVcon', dataCVcon)
            // console.log('datachu ky', dataChuKy)

            let repeated_day = ''
            dataChuKy.map((item, index) => {
                if (chuKyLap.title == 'Hàng tuần') {
                    if (index == dataChuKy.length - 1) {
                        repeated_day += item.ngayRutgon
                    }
                    else {
                        repeated_day += item.ngayRutgon + ','
                    }
                }
                else {
                    if (index == dataChuKy.length - 1) {
                        repeated_day += item.ngay
                    }
                    else {
                        repeated_day += item.ngay + ','
                    }
                }
            })

            let body = {}
            if (_dateKt) {
                body = {
                    'Locked': QuickID == false ? true : false, // false : đang có hiệu lực QuickID = true, true: vô hiệu hoá QuickID = false
                    'Tasks': dataCVcon,
                    'Users': dataNguoiTH,
                    'deadline': soGio ? soGio : 0,
                    'description': moTa,
                    'end_date': _dateKt ? moment(_dateKt, 'DD/MM/YYYY').format('YYYY/MM/DD') : '',
                    'frequency': chuKyLap.id == 1 ? "1" : "2",
                    'id_project_team': dataDuAn?.id_row,
                    'id_row': 0,
                    'repeated_day': repeated_day,
                    'start_date': moment(_dateDk, 'DD/MM/YYYY').format('YYYY/MM/DD'),
                    'title': tenCV,
                    '_defaultFieldName': "",
                    '_isDeleted': false,
                    '_isEditMode': false,
                    '_isNew': false,
                    '_isUpdated': false,
                    '_prevState': null,
                    '_userId': 0,
                }
            }
            else {
                body = {
                    'Locked': QuickID == false ? true : false, // false : đang có hiệu lực QuickID = true, true: vô hiệu hoá QuickID = false
                    'Tasks': dataCVcon,
                    'Users': dataNguoiTH,
                    'deadline': soGio ? soGio : 0,
                    'description': moTa,
                    'frequency': chuKyLap.id == 1 ? "1" : "2",
                    'id_project_team': dataDuAn?.id_row,
                    'id_row': 0,
                    'repeated_day': repeated_day,
                    'start_date': moment(_dateDk, 'DD/MM/YYYY').format('YYYY/MM/DD'),
                    'title': tenCV,
                    '_defaultFieldName': "",
                    '_isDeleted': false,
                    '_isEditMode': false,
                    '_isNew': false,
                    '_isUpdated': false,
                    '_prevState': null,
                    '_userId': 0,
                }
            }

            // console.log('body', body)
            let res = await Tao_CongViecLapLai(body)
            // console.log('res _Tao_CongViecLapLai', res)
            if (res.status == 1) {
                UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.JeeWork.taocongviecthanhcong, 1)
                if ((this.type == 'Hàng tuần' && chuKyLap.id == 1) || (this.type == 'Hàng tháng' && chuKyLap.id == 2) || this.nhanBan == true) {
                    this.reLoad()
                }
                this._goBack()
                if (this.type == 'Hàng tuần' && chuKyLap.id == 2) {
                    ROOTGlobal.GetCongViecLapLaiThang.GetCVLapLaiThang()
                }
                else if (this.type == 'Hàng tháng' && chuKyLap.id == 1) {
                    ROOTGlobal.GetCongViecLapLaiTuan.GetCVLapLaiTuan()
                }
                this.refLoading.current.hide()
            }
            else {
                UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
                this.refLoading.current.hide()
            }
        }
        else {
            this.refLoading.current.hide()
        }
    }

    _Update_CongViecLapLai = async () => {
        const { moTa, _dateDk, _dateKt, QuickID, dataChuKy, nguoiTH, tenCV, soGio, chuKyLap, dataDuAn, dataCongViecCon, dataCongViecCuThe, dataChinhSua } = this.state
        let checkDataRong = this._CheckDataRong()
        // console.log('cehck', checkDataRong)
        if (checkDataRong) {
            this.refLoading.current.show()
            let dataNguoiTH = []
            let dataCVcon = []
            if (nguoiTH.length > 0) {
                nguoiTH.map(item => {
                    dataNguoiTH.push({
                        'id_row': item.id_row,
                        'id_user': item.id_nv,
                        'loai': 1,
                        '_defaultFieldName': "",
                        '_isDeleted': false,
                        '_isEditMode': false,
                        '_isNew': false,
                        '_isUpdated': false,
                        '_prevState': null,
                        '_userId': 0,
                    })
                })
            }
            // console.log('dataNguoiTH', dataNguoiTH)

            if (dataCongViecCon.length > 0) {
                dataCongViecCon.map(item => {
                    item.UserID ?
                        dataCVcon.push({
                            'Deadline': item.Deadline,
                            'IsTodo': false,
                            'Title': item.Title,
                            'UserID': item.UserID.id_nv,
                            'id_repeated': item.id_repeated,
                            'id_row': item.id_row,
                            '_defaultFieldName': "",
                            '_isDeleted': false,
                            '_isEditMode': false,
                            '_isNew': false,
                            '_isUpdated': false,
                            '_prevState': null,
                            '_userId': 0,
                        })
                        :
                        dataCVcon.push({
                            'Deadline': item.Deadline,
                            'IsTodo': false,
                            'Title': item.Title,
                            'UserID': item.id_nv,
                            'id_repeated': 0,
                            'id_row': dataChinhSua.id_row,
                            '_defaultFieldName': "",
                            '_isDeleted': false,
                            '_isEditMode': false,
                            '_isNew': false,
                            '_isUpdated': false,
                            '_prevState': null,
                            '_userId': 0,
                        })
                })
            }
            if (dataCongViecCuThe.length > 0) {
                dataCongViecCuThe.map(item => {
                    item.UserID ?
                        dataCVcon.push({
                            'IsTodo': true,
                            'Title': item.Title,
                            'UserID': item.UserID.id_nv,
                            'id_repeated': item.id_repeated,
                            'id_row': item.id_row,
                            '_defaultFieldName': "",
                            '_isDeleted': false,
                            '_isEditMode': false,
                            '_isNew': false,
                            '_isUpdated': false,
                            '_prevState': null,
                            '_userId': 0,
                        })
                        :
                        dataCVcon.push({
                            'IsTodo': true,
                            'Title': item.Title,
                            'UserID': item.id_nv,
                            'id_repeated': 0,
                            'id_row': dataChinhSua.id_row,
                            '_defaultFieldName': "",
                            '_isDeleted': false,
                            '_isEditMode': false,
                            '_isNew': false,
                            '_isUpdated': false,
                            '_prevState': null,
                            '_userId': 0,
                        })
                })
            }
            // console.log('dataCVcon', dataCVcon)
            // console.log('datachu ky', dataChuKy)

            let repeated_day = ''
            dataChuKy.map((item, index) => {
                if (this.type == 'Hàng tuần') {
                    if (index == dataChuKy.length - 1) {
                        repeated_day += item.ngayRutgon
                    }
                    else {
                        repeated_day += item.ngayRutgon + ','
                    }
                }
                else {
                    if (index == dataChuKy.length - 1) {
                        repeated_day += item.ngay
                    }
                    else {
                        repeated_day += item.ngay + ','
                    }
                }
            })

            let body = {}
            if (_dateKt) {
                body = {
                    'Locked': QuickID == false ? true : false, // false : đang có hiệu lực QuickID = true, true: vô hiệu hoá QuickID = falselse,
                    'Tasks': dataCVcon,
                    'Users': dataNguoiTH,
                    'deadline': soGio,
                    'description': moTa,
                    'end_date': moment(_dateKt, 'DD/MM/YYYY').format('YYYY/MM/DD'),
                    'frequency': dataChinhSua?.frequency,
                    'id_project_team': dataChinhSua?.id_project_team,
                    'id_row': dataChinhSua?.id_row,
                    'repeated_day': repeated_day,
                    'start_date': moment(_dateDk, 'DD/MM/YYYY').format('YYYY/MM/DD'),
                    'title': tenCV,
                    '_defaultFieldName': "",
                    '_isDeleted': false,
                    '_isEditMode': false,
                    '_isNew': false,
                    '_isUpdated': false,
                    '_prevState': null,
                    '_userId': 0,
                }
            }
            else {
                body = {
                    'Locked': QuickID == false ? true : false, // false : đang có hiệu lực QuickID = true, true: vô hiệu hoá QuickID = falselse,
                    'Tasks': dataCVcon,
                    'Users': dataNguoiTH,
                    'deadline': soGio,
                    'description': moTa,
                    'frequency': dataChinhSua?.frequency,
                    'id_project_team': dataChinhSua?.id_project_team,
                    'id_row': dataChinhSua?.id_row,
                    'repeated_day': repeated_day,
                    'start_date': moment(_dateDk, 'DD/MM/YYYY').format('YYYY/MM/DD'),
                    'title': tenCV,
                    '_defaultFieldName': "",
                    '_isDeleted': false,
                    '_isEditMode': false,
                    '_isNew': false,
                    '_isUpdated': false,
                    '_prevState': null,
                    '_userId': 0,
                }
            }

            // console.log('body', body)
            let res = await Update_CongViecLapLai(body)
            // console.log('res _Update_CongViecLapLai', res)
            if (res.status == 1) {
                UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.JeeWork.capnhatthanhcong, 1)
                this.reLoad()
                this._goBack()
                this.refLoading.current.hide()
            }
            else {
                UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
                this.refLoading.current.hide()
            }
        }
        else {
            this.refLoading.current.hide()
        }
    }


    _CheckDataRong = () => {
        let check = true // true: data được nhập hết, false : data còn thiếu
        const { moTa, _dateDk, _dateKt, QuickID, dataChuKy, nguoiTH, tenCV, soGio, chuKyLap, dataDuAn } = this.state
        let checkDay = this._checkDay(_dateDk, _dateKt)
        if (tenCV == '') {
            Utils.showMsgBoxOK(this, RootLang.lang.thongbaochung.thongbao, 'Tên công việc không được bỏ trống!!', RootLang.lang.thongbaochung.xacnhan,)
            check = false
        }
        else if (_.isEmpty(dataDuAn) == true) {
            Utils.showMsgBoxOK(this, RootLang.lang.thongbaochung.thongbao, 'Dự án không được bỏ trống!!', RootLang.lang.thongbaochung.xacnhan,)
            check = false
        }
        else if (_dateDk == '') {
            Utils.showMsgBoxOK(this, RootLang.lang.thongbaochung.thongbao, 'Ngày bắt đầu không được bỏ trống!!', RootLang.lang.thongbaochung.xacnhan,)
            check = false
        }
        else if (dataChuKy == '') {
            Utils.showMsgBoxOK(this, RootLang.lang.thongbaochung.thongbao, 'Ngày lặp trong chu kỳ không được bỏ trống!!', RootLang.lang.thongbaochung.xacnhan,)
            check = false
        }
        else if (checkDay == false) {
            Utils.showMsgBoxOK(this, RootLang.lang.thongbaochung.thongbao, 'Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu !!', RootLang.lang.thongbaochung.xacnhan,)
            check = false
        }
        return check
    }

    _checkDay = (dateDk, dateKt) => {
        let check = false
        if (dateKt != '') {
            const x = new Date(moment(dateDk, 'DD/MM/YYYY').format('MM/DD/YYYY'));
            const y = new Date(moment(dateKt, 'DD/MM/YYYY').format('MM/DD/YYYY'));
            // console.log('x', x)
            // console.log('y', y)
            // console.log('x < y', x < y); // false
            // console.log('x > y', x > y); // false
            // console.log('+x === +y', +x === +y); // true
            if (x < y == true) {
                check = true
            }
            else if (+x === +y == true) {
                check = true
            }
            return check
        }
    }

    _KiemTraLoaiChuKy = () => {
        if (this.type == 'Hàng tuần') {
            this.setState({
                chuKyLap: {
                    id: 1,
                    title: 'Hàng tuần'
                },
            })
        }
        else {
            this.setState({
                chuKyLap: {
                    id: 2,
                    title: 'Hàng tháng'
                },
            })
        }
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

    _goBack = () => {
        this._endAnimation(0)
        Utils.goback(this)
        return true;
    }

    _FlagPiority = () => {
        Utils.goscreen(this, 'Modal_ComponentSelectCom', { callback: this._callbackFlagPiority, item: this.state.piority, AllThaoTac: this.state.listPiority, ViewItem: this.ViewItemlagPiority })
    }

    _callbackFlagPiority = (piority) => {
        const { ChiTietCongViec } = this.state
        try {
            this.setState({ piority })
        } catch (error) {

        }
    }

    ViewItemlagPiority = (item) => {
        return (
            <View key={item.row.toString()} style={{ flexDirection: "row", alignSelf: "center" }}>
                <View style={{ paddingHorizontal: 10 }}>
                    <Image source={item.row == 0 ? Images.JeeCloseModal : Images.ImageJee.icCoKhongUuTien} resizeMode={"contain"} style={{ tintColor: item.color, width: 20, height: 20 }} />
                </View>
                <Text style={{
                    textAlign: "center", fontSize: sizes.sText16,
                    alignSelf: "center",
                    color: this.state.piority.row == item.row ? colors.colorTabActive : 'black',
                    fontWeight: this.state.piority.row == item.row ? "bold" : 'normal'
                }}>{item.name ? item.name : ""}</Text>
            </View>
        )
    }

    _chonChuKyLap = () => {
        Utils.goscreen(this, 'Modal_ComponentSelectCom', { callback: this._callbackChuKyLap, item: this.state.chuKyLap, AllThaoTac: dataChuKyLap, ViewItem: this.ViewItemhuKyLap })
    }

    _callbackChuKyLap = (chuKyLap) => {
        try {
            this.setState({ chuKyLap, dataChuKy: [] })
        } catch (error) {

        }
    }

    ViewItemhuKyLap = (item) => {
        return (
            <View key={item.id.toString()} style={{ flexDirection: "row", alignSelf: "center" }}>
                <Text style={{
                    textAlign: "center", fontSize: sizes.sText16,
                    alignSelf: "center",
                    color: this.state.chuKyLap.id == item.id ? colors.colorTabActive : 'black',
                    fontWeight: this.state.chuKyLap.id == item.id ? "bold" : 'normal'
                }}>{item.title ? item.title : ""}</Text>
            </View>
        )
    }

    _SetNgayThang = (dateDk, dateKt) => {
        this.setState({ _dateDk: dateDk, _dateKt: dateKt })
    }

    _selectDateTuNgay = (val) => {
        var { _dateDk, _dateKt } = this.state;
        Utils.goscreen(this, 'Modal_CalandaSingalCom', {
            date: _dateDk || moment(new Date()).format('DD/MM/YYYY'),
            setTimeFC: (time, type) => this.pickDateTimeDangKy(time, type = 1)
        })
    }

    _selectDateDenNgay = (val) => {
        var { _dateDk, _dateKt } = this.state;
        Utils.goscreen(this, 'Modal_CalandaSingalCom', {
            date: _dateKt || moment(new Date()).format('DD/MM/YYYY'),
            setTimeFC: (time, type) => this.pickDateTimeDangKy(time, type = 2)
        })
    }

    pickDateTimeDangKy = (time, type) => {
        const temp = moment(time, 'DD/MM/YYYY').format('DD/MM/YYYY')
        if (type == 1) {
            this.setState({ _dateDk: temp })
        }
        else {
            this.setState({ _dateKt: temp })
        }
    }

    _pickDataChuKy = (item) => {
        Utils.goscreen(this, 'Modal_PickDataChuKy', { type: item, callback: this.__callbackPickDataChuKy, dataCu: this.state.dataChuKy })
    }

    __callbackPickDataChuKy = (dataChuKy) => {
        this.setState({ dataChuKy })
    }

    _taoCongViecCon = () => {
        const { dataDuAn, listNv } = this.state
        if (_.isEmpty(dataDuAn)) {
            UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, RootLang.lang.JeeWork.vuilongchonduan, 3)
            this._PickDuAn()
        }
        else {
            Utils.goscreen(this, 'Modal_ThemCVCon', { callback: this._callBackTaoCVCon, listNV: listNv })
        }
    }

    _callBackTaoCVCon = (data) => {
        const { dataCongViecCon } = this.state
        let obj = dataCongViecCon
        obj.push(data)
        this.setState({ dataCongViecCon: obj })
    }

    _PickDuAn = () => {
        Utils.goscreen(this, 'sc_ChonDuAnTaoCongViec', { callback: this._callbackDuAn })
    }

    _callbackDuAn = (DuAn) => {
        nthisLoading.show()
        this.setState({ dataDuAn: DuAn, }, () => {
            this._loadDsNhanVien(DuAn?.id_row)
        })
    }

    _loadDsNhanVien = async (idrow) => {
        const { nvCoSan, dataDuAn } = this.state
        const res = await getListNhanVien(idrow)
        // console.log('res _loadDsNhanVien', res)
        if (res.status == 1) {
            this.setState({
                listNv: res.data
            })
            this.refLoading.current.hide()
        }
        else {
            this.refLoading.current.hide()
        }
    }

    _ThemNguoiTH = () => {
        const { dataDuAn, listNv } = this.state
        if (dataDuAn && dataDuAn?.title) {

            let dataNVChuyenqua = []
            listNv.map(item => {
                dataNVChuyenqua.push({ ...item, 'hoten': item.hoten, 'id_nv': item.id_nv, 'image': item.image, 'tenchucdanh': item.tenchucdanh })
            })
            Utils.goscreen(this, "sc_PickUser",
                {
                    dataNV: dataNVChuyenqua, callback: this._callback, onlyOne: true
                }
            )
        }
        else {
            UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, RootLang.lang.JeeWork.vuilongchonduan, 3)
            this._PickDuAn()
        }
    }

    _callback = (list) => {
        let obj = []
        obj.push(list)
        this.setState({
            nguoiTH: obj
        })
    }

    _EditCongViecCon = (item, index, type = 1) => {
        const { dataDuAn, listNv } = this.state
        indexTam = index
        if (_.isEmpty(dataDuAn)) {
            UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, RootLang.lang.JeeWork.vuilongchonduan, 3)
            this._PickDuAn()
        }
        else {
            if (type == 1) {
                Utils.goscreen(this, 'Modal_ThemCVCon', { callbackEdit: this._callBackEditCVCon, listNV: listNv, dataCu: item, })
            }
            else {
                Utils.goscreen(this, 'Modal_ThemCVCuThe', { callbackEdit: this._callBackEditCVCuThe, listNV: listNv, dataCu: item, })
            }
        }
    }

    _callBackEditCVCon = (data) => {
        const { dataCongViecCon } = this.state
        let obj = dataCongViecCon
        obj.map((item, index) => {
            if (index == indexTam) {
                return obj[index] = {
                    ...item,
                    'Title': data.Title,
                    'UserID': {
                        'hoten': data.hoten,
                        'id_nv': data.id_nv,
                        'image': data.image,
                        'mobile': data.mobile,
                        'username': data.username
                    },
                    'Deadline': data.Deadline
                }
            }
        })
        this.setState({ dataCongViecCon: obj })
    }

    _callBackEditCVCuThe = (data) => {
        const { dataCongViecCuThe } = this.state
        let obj = dataCongViecCuThe
        obj.map((item, index) => {
            if (index == indexTam) {
                return obj[index] = {
                    ...item,
                    'Title': data.Title,
                    'UserID': {
                        'hoten': data.hoten,
                        'id_nv': data.id_nv,
                        'image': data.image,
                        'mobile': data.mobile,
                        'username': data.username
                    }
                }
            }
        })
        this.setState({ dataCongViecCuThe: obj })
    }

    _taoCongViecCuThe = () => {
        const { dataDuAn, listNv } = this.state
        if (_.isEmpty(dataDuAn)) {
            UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, RootLang.lang.JeeWork.vuilongchonduan, 3)
            this._PickDuAn()
        }
        else {
            Utils.goscreen(this, 'Modal_ThemCVCuThe', { callback: this._callBackTaoCVCuThe, listNV: listNv })
        }
    }

    _callBackTaoCVCuThe = (data) => {
        const { dataCongViecCuThe } = this.state
        let obj = dataCongViecCuThe
        obj.push(data)
        this.setState({ dataCongViecCuThe: obj })
    }

    _renderItem = ({ item, index }) => {
        const { dataCongViecCon } = this.state
        return (
            <View style={styles.itemCongVieccon}>
                <View style={[styles.viewContainerCVCon, { borderBottomWidth: 0.3, }]}>
                    <TouchableOpacity style={styles.touchEdit}>
                        <View style={styles.center} >
                            {
                                item?.UserID ?
                                    (
                                        item?.UserID.image ?
                                            <ImageCus
                                                style={nstyles.nAva35}
                                                source={{ uri: item?.UserID.image }}
                                                resizeMode={"cover"}
                                                defaultSourceCus={Images.icAva}
                                            /> :
                                            <View
                                                style={[nstyles.nAva35, {
                                                    borderRadius: Width(8), backgroundColor: intToRGB(hashCode(item.UserID.hoten ? item.UserID.hoten : '')), alignSelf: 'center',
                                                    justifyContent: 'center', alignItems: 'center'
                                                }]} key={index}>
                                                <Text style={styles.textName}> {String(item.UserID.hoten ? item.UserID.hoten : '').split(" ").slice(-1).toString().slice(0, 2).toString()}</Text>
                                            </View>
                                    ) : (
                                        item.image ?
                                            <ImageCus
                                                style={nstyles.nAva35}
                                                source={{ uri: item.image }}
                                                resizeMode={"cover"}
                                                defaultSourceCus={Images.icAva}
                                            />
                                            :
                                            <View
                                                style={[nstyles.nAva35, {
                                                    borderRadius: Width(8), backgroundColor: intToRGB(hashCode(item.hoten ? item.hoten : '')), alignSelf: 'center',
                                                    justifyContent: 'center', alignItems: 'center'
                                                }]} key={index}>
                                                <Text style={styles.textName}> {String(item.hoten ? item.hoten : '').split(" ").slice(-1).toString().slice(0, 2).toString()}</Text>
                                            </View>
                                    )
                            }
                        </View>
                        <View style={styles.viewitemCongVieccon}>
                            <Text style={{}}>{item.Title}</Text>
                            <Text style={{ color: '#8F9294', }}>{item.Deadline + 'h'}</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this._EditCongViecCon(item, index, 1)}
                        style={{ paddingHorizontal: 15, paddingVertical: 10 }}>
                        <Image source={Images.ImageJee.icEditMessage} style={[nstyles.nIcon20, { tintColor: colors.colorBlueLight }]}></Image>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this._deleteCongViecCon(item, index, 1)}
                        style={{ paddingLeft: 20, paddingVertical: 10 }}>
                        <Image source={Images.ImageJee.icDahuy} style={[nstyles.nIcon20, { tintColor: colors.red1 }]}></Image>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    _renderItemCvCuThe = ({ item, index }) => {
        const { dataCongViecCuThe } = this.state
        return (
            <View style={styles.itemCongVieccon}>
                <View style={[styles.viewContainerCVCon, { borderBottomWidth: 0.3, }]}>
                    <TouchableOpacity style={styles.touchEdit}>
                        <View style={styles.center} >
                            {
                                item?.UserID ?
                                    (
                                        item?.UserID.image ?
                                            <ImageCus
                                                style={nstyles.nAva35}
                                                source={{ uri: item?.UserID.image }}
                                                resizeMode={"cover"}
                                                defaultSourceCus={Images.icAva}
                                            /> :
                                            <View
                                                style={[nstyles.nAva35, {
                                                    borderRadius: Width(8), backgroundColor: intToRGB(hashCode(item.UserID.hoten ? item.UserID.hoten : '')), alignSelf: 'center',
                                                    justifyContent: 'center', alignItems: 'center'
                                                }]} key={index}>
                                                <Text style={styles.textName}> {String(item.UserID.hoten ? item.UserID.hoten : '').split(" ").slice(-1).toString().slice(0, 2).toString()}</Text>
                                            </View>
                                    ) : (
                                        item.image ?
                                            <ImageCus
                                                style={nstyles.nAva35}
                                                source={{ uri: item.image }}
                                                resizeMode={"cover"}
                                                defaultSourceCus={Images.icAva}
                                            />
                                            :
                                            <View
                                                style={[nstyles.nAva35, {
                                                    borderRadius: Width(8), backgroundColor: intToRGB(hashCode(item.hoten ? item.hoten : '')), alignSelf: 'center',
                                                    justifyContent: 'center', alignItems: 'center'
                                                }]} key={index}>
                                                <Text style={styles.textName}> {String(item.hoten ? item.hoten : '').split(" ").slice(-1).toString().slice(0, 2).toString()}</Text>
                                            </View>
                                    )
                            }
                        </View>
                        <View style={styles.viewitemCongVieccon}>
                            <Text style={{}}>{item.Title}</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this._EditCongViecCon(item, index, 2)}
                        style={{ paddingHorizontal: 15, paddingVertical: 10 }}>
                        <Image source={Images.ImageJee.icEditMessage} style={[nstyles.nIcon20, { tintColor: colors.colorBlueLight }]}></Image>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this._deleteCongViecCon(item, index, 2)}
                        style={{ paddingLeft: 20, paddingVertical: 10 }}>
                        <Image source={Images.ImageJee.icDahuy} style={[nstyles.nIcon20, { tintColor: colors.red1 }]}></Image>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    _deleteCongViecCon = (data, index, type = 1) => {
        const { dataCongViecCon, dataCongViecCuThe } = this.state
        const itemToBeRemoved = data
        Utils.showMsgBoxYesNo(this, RootLang.lang.thongbaochung.thongbao, RootLang.lang.JeeWork.bancomuonxoacongviec, RootLang.lang.JeeWork.xoacongviec, RootLang.lang.JeeWork.dong,
            () => {
                if (type == 1) {
                    dataCongViecCon.splice(dataCongViecCon.findIndex(a => a.id_nv === itemToBeRemoved.id_nv), 1)
                    this.setState({ dataCongViecCon: dataCongViecCon })
                }
                else {
                    dataCongViecCuThe.splice(dataCongViecCuThe.findIndex(a => a.id_nv === itemToBeRemoved.id_nv), 1)
                    this.setState({ dataCongViecCuThe: dataCongViecCuThe })
                }
            },
            () => { }
        )
    }

    render() {
        const { opacity, tenCV, soGio, piority, _dateDk, _dateKt, moTa, QuickID, chuKyLap, dataChuKy, dataDuAn, nguoiTH,
            dataCongViecCon, dataCongViecCuThe } = this.state
        const test = {}
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: colors.backgroundModal, justifyContent: 'flex-end', opacity: 1, }]} >
                <Animated.View onTouchEnd={() => this._goBack()}
                    style={{
                        position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
                        backgroundColor: colors.backgroundModal, opacity
                    }} />
                <View style={styles.viewHome}>
                    <View style={styles.width100}>
                        <View style={styles.headerContainer}>
                            <View style={styles.itemheaderContainer}>
                                <Image source={Images.icTopModal} ></Image>
                            </View>
                        </View>
                        <View style={styles.viewLuuVaDong}>
                            <TouchableOpacity onPress={() => { this._goBack() }} >
                                <Image
                                    source={Images.ImageJee.icCloseModal}
                                    resizeMode={'cover'}
                                    style={[nstyles.nIcon21, { tintColor: colors.gray1 }]}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.touchLuu}
                                onPress={this.chinhSua == false ? this._Tao_CongViecLapLai : this._Update_CongViecLapLai}>
                                <Text style={styles.textLuu}> {RootLang.lang.JeeWork.luu}</Text>
                            </TouchableOpacity>
                        </View>
                    </View >
                    <View style={styles.container}>
                        <View style={styles.viewSearch}>
                            <TextInput
                                returnKeyType='next'
                                style={styles.searchText}
                                onChangeText={(tenCV) => {
                                    this.setState({ tenCV })
                                }}
                                value={tenCV}
                                underlineColorAndroid="transparent"
                                placeholder={RootLang.lang.JeeWork.nhaptencongviec}
                                placeholderTextColor={colors.colorPlayhoder}
                            />
                        </View>
                        <KeyboardAwareScrollView
                            innerRef={ref => {
                                this.scroll = ref
                            }}
                            extraScrollHeight={Platform.OS == 'ios' ? 0 : Height(16)}
                            enableOnAndroid={true}
                            nestedScrollEnabled={true} keyboardShouldPersistTaps={"handled"} style={{ flex: 1, backgroundColor: '#E5E6EB' }}>

                            <View style={styles.itemContainer}>
                                <View style={styles.viewChinh}>
                                    <View style={styles.viewTong}>
                                        <View style={[styles.viewItem, { paddingVertical: 5 }]}>
                                            <View style={styles.viewBenTrai}>
                                                <Image source={Images.ImageJee.icProjectS} style={[nstyles.nIcon24, {}]}></Image>
                                                <Text style={styles.textBenTrai}>{RootLang.lang.JeeWork.duan}</Text>
                                            </View>
                                            <TouchableOpacity style={[styles.touchChonDuAn, { backgroundColor: this.chinhSua ? colors.colorButtonGray : '#F3F6F9', }]}
                                                onPress={() => { this._PickDuAn() }}
                                                disabled={this.chinhSua ? true : false}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15 }}>
                                                    <Text style={{ color: this.chinhSua ? colors.black : '#289FFB', fontSize: reText(15) }}>
                                                        {dataDuAn?.title ? dataDuAn?.title : '--' + RootLang.lang.JeeWork.chonduan + '--'}
                                                    </Text>
                                                    {
                                                        this.chinhSua == false &&
                                                        <Image source={Images.icDropdown} style={{ width: Width(2.7), height: Width(1.5), marginLeft: 10, tintColor: '#65676B' }} />
                                                    }
                                                </View>
                                            </TouchableOpacity>
                                        </View>

                                        <ChonNguoi icon={Images.ImageJee.icAccepter} title={RootLang.lang.JeeWork.nguoithamgia} data={nguoiTH} toDo={() => { this._ThemNguoiTH() }} ></ChonNguoi>

                                        <View style={[styles.viewItem, { paddingTop: 7, paddingBottom: 7 }]}>
                                            <View style={[styles.viewBenTrai, { paddingVertical: 5, }]}>
                                                <Image source={Images.ImageJee.icClock} style={[nstyles.nIcon24, {}]}></Image>
                                                <Text style={styles.textBenTrai} >{RootLang.lang.JeeWork.hethansau}</Text>
                                            </View>
                                            <View style={styles.khungHethansau}>
                                                <View style={{ borderWidth: 0.3, paddingHorizontal: 5, borderRadius: 10, alignItems: 'center' }}>
                                                    <TextInput
                                                        returnKeyType='next'
                                                        style={styles.search}
                                                        onChangeText={(soGio) => {
                                                            this.setState({ soGio })
                                                        }}
                                                        value={soGio}
                                                        underlineColorAndroid="transparent"
                                                        placeholder={RootLang.lang.JeeWork.nhapsogio}
                                                        keyboardType='number-pad'
                                                    />
                                                </View>
                                                <Text style={{ paddingLeft: 10, color: '#404040' }}>{(RootLang.lang.scphepthemdon.gio).toLowerCase()}</Text>
                                            </View>
                                        </View>

                                        {/* <ChonNguoi icon={Images.ImageJee.icManyPeople} title={RootLang.lang.JeeWork.nguoitheodoi} data={test} toDo={() => { console.log('hi') }} ></ChonNguoi> */}

                                        <View style={[styles.viewItem, {}]}>
                                            <View style={styles.viewBenTrai}>
                                                <Image source={Images.ImageJee.icArrowsCircles} style={[nstyles.nIcon24, {}]}></Image>
                                                <Text style={styles.textBenTrai} >{RootLang.lang.JeeWork.chukylap}</Text>
                                            </View>
                                            <View style={[styles.viewChuKyLap, { justifyContent: 'flex-end', }]}>
                                                <TouchableOpacity
                                                    onPress={() => { this._pickDataChuKy(chuKyLap) }}
                                                    style={[styles.touchDataChuKyLap, { maxWidth: Width(26), }]}>
                                                    {
                                                        dataChuKy.length > 0 ?
                                                            (
                                                                <Text numberOfLines={1} style={{ color: '#289FFB', fontSize: reText(15), flex: 1 }}>
                                                                    {
                                                                        dataChuKy.map((item, index) => {
                                                                            return item.ngay + ", "
                                                                        })
                                                                    }
                                                                </Text>
                                                            ) :
                                                            (
                                                                <Text numberOfLines={1} style={{ color: '#289FFB', fontSize: reText(15), flex: 1 }}>{RootLang.lang.JeeWork.chonngay}</Text>
                                                            )
                                                    }
                                                    <Image source={Images.icDropdown} style={{ width: Width(2.7), height: Width(1.5), marginLeft: dataChuKy.length > 0 ? 10 : 0, tintColor: chuKyLap.id == 0 ? colors.colorTextBTGray : '#65676B', }} />
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    disabled={this.chinhSua ? true : false}
                                                    onPress={() => { this._chonChuKyLap() }}
                                                    style={[styles.touchChuKyLap, { maxWidth: Width(26), backgroundColor: this.chinhSua ? colors.colorButtonGray : '#F3F6F9' }]}>
                                                    <Text numberOfLines={1} style={{ color: this.chinhSua ? colors.black : '#289FFB', fontSize: reText(15), flex: 1, textAlign: 'center' }}>{chuKyLap.title}</Text>
                                                    {
                                                        this.chinhSua == false &&
                                                        <Image source={Images.icDropdown} style={{ width: Width(2.7), height: Width(1.5), marginLeft: 10, tintColor: '#65676B' }} />
                                                    }
                                                </TouchableOpacity>
                                            </View>
                                        </View>

                                        {/* <View style={[styles.viewItem, { paddingVertical: 8 }]}>
                                            <View style={styles.viewBenTrai}>
                                                <Image source={Images.ImageJee.jwMucDo} style={[nstyles.nIcon24, {}]}></Image>
                                                <Text style={styles.textBenTrai} >{RootLang.lang.JeeWork.mucdouutien}</Text>
                                            </View>
                                            <TouchableOpacity
                                                onPress={() => { this._FlagPiority() }}
                                                style={[styles.touchDoUuTien, { paddingVertical: piority?.row == 0 ? 8 : 10 }]}>
                                                <Image source={piority?.row == 0 ? Images.JeeCloseModal : Images.ImageJee.icCoKhongUuTien}
                                                    style={[piority?.row == 0 ? nstyles.nIcon22 : null, { tintColor: piority?.color ? piority?.color : null }]} />
                                                <Text style={[styles.textDoUuTien, { color: piority?.color, }]}> {piority?.name} </Text>
                                            </TouchableOpacity>
                                        </View> */}
                                        <View style={[styles.viewItem, { paddingTop: 7, paddingBottom: 7 }]}>
                                            <View style={[styles.viewBenTrai, { paddingVertical: 5, }]}>
                                                <Image source={Images.ImageJee.jwTime} style={[nstyles.nIcon24, {}]}></Image>
                                                <Text style={styles.textBenTrai} >{RootLang.lang.JeeWork.batdautu}</Text>
                                            </View>

                                            <View style={{ flexDirection: 'row', }}>
                                                <View style={{ paddingHorizontal: _dateDk ? 5 : 10, alignSelf: 'center' }}>
                                                    <TouchableOpacity
                                                        onPress={() => this._selectDateTuNgay(true)}
                                                        style={styles.viewDate}>
                                                        {
                                                            _dateDk == '' ?
                                                                <Image
                                                                    source={Images.ImageJee.jwAddTime}
                                                                    style={[nstyles.nIcon24]}
                                                                    resizeMode={'contain'}>
                                                                </Image> : null
                                                        }
                                                        {
                                                            _dateDk ? <Text numberOfLines={2} style={styles.textDate}>{_dateDk}</Text> : null
                                                        }
                                                    </TouchableOpacity>
                                                </View>
                                                <Text style={{ alignSelf: 'center', color: '#808080' }}>-</Text>
                                                <View style={{ paddingHorizontal: _dateKt ? 5 : 10, alignSelf: 'center' }}>
                                                    <TouchableOpacity
                                                        onPress={() => this._selectDateDenNgay(true)}
                                                        style={styles.viewDate}>
                                                        {
                                                            _dateKt == '' ?
                                                                <Image
                                                                    source={Images.ImageJee.jwAddTime}
                                                                    style={[nstyles.nIcon24]}
                                                                    resizeMode={'contain'}>
                                                                </Image> : null
                                                        }
                                                        {
                                                            _dateKt ? <Text numberOfLines={2} style={styles.textDate}>{_dateKt}</Text> : null
                                                        }
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>

                                        <View style={[styles.viewItem, { paddingTop: 7, paddingBottom: 7 }]}>
                                            <View style={[styles.viewBenTrai, { paddingVertical: 5, }]}>
                                                <Image source={Images.ImageJee.jwTinhTrang} style={[nstyles.nIcon24, {}]}></Image>
                                                <Text style={styles.textBenTrai} >{RootLang.lang.JeeWork.danghieuluc}</Text>
                                            </View>
                                            <View style={{}}>
                                                <Switch
                                                    style={{ alignContent: "flex-end", alignSelf: "center", transform: [{ scaleX: .8 }, { scaleY: .8 }] }}
                                                    trackColor={{ false: 'gray', true: 'teal' }}
                                                    thumbColor="white"
                                                    ios_backgroundColor="gray"
                                                    onValueChange={(QuickID) => this.setState({ QuickID })}
                                                    value={QuickID}
                                                />
                                            </View>
                                        </View>
                                        <View style={styles.viewMota}>
                                            <View style={styles.viewBenTraiMota}>
                                                <Image source={Images.ImageJee.icOClock} style={[nstyles.nIcon24, {}]}></Image>
                                                <Text style={styles.textBenTrai} >{RootLang.lang.JeeWork.mota}</Text>
                                            </View>
                                            <View style={{}}>
                                                {
                                                    <TouchableOpacity
                                                        style={{}}
                                                        onPress={() => Utils.goscreen(this, 'Modal_EditHTML', {
                                                            title: 'Mô tả công việc',
                                                            isEdit: true,
                                                            content: moTa,
                                                            isVoice: false,
                                                            callback: (html) => {
                                                                this.setState({ moTa: html })
                                                            }
                                                        })}
                                                    >
                                                        {moTa ?
                                                            <HTML
                                                                source={{ html: moTa }}
                                                                containerStyle={{ paddingHorizontal: 5, paddingVertical: 5 }}
                                                                contentWidth={Width(90)}
                                                                tagsStyles={{
                                                                    div: { fontSize: reText(18) },
                                                                }}
                                                            />
                                                            :
                                                            <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 10 }}>
                                                                <View style={{ borderWidth: 1, borderColor: colors.textGray, paddingVertical: 5, paddingHorizontal: 100, borderRadius: 5, borderStyle: 'dashed', }}>
                                                                    <Text style={{ fontSize: reText(15), color: colors.textGray }}>{RootLang.lang.thongbaochung.nhapmota}</Text>
                                                                </View>
                                                            </View>}
                                                    </TouchableOpacity>
                                                }
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                <View style={
                                    styles.headerCvCon
                                }>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: dataCongViecCon.length > 0 ? 0 : Platform.OS == 'android' ? 10 : 0 }}>
                                        <Text style={styles.textTileCVcon}>{RootLang.lang.JeeWork.congvieccon}</Text>
                                        <TouchableOpacity style={{ padding: 10, backgroundColor: '#F3F6F9', borderRadius: 5 }}
                                            onPress={() => { this._taoCongViecCon() }}>
                                            <View style={styles.viewThemMoi}>
                                                <Text style={styles.textThemMoi}>{RootLang.lang.JeeWork.them}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{}}>
                                        <FlatList
                                            data={dataCongViecCon}
                                            renderItem={this._renderItem}
                                            keyExtractor={(item, index) => index.toString()}
                                            extraData={this.state}
                                            initialNumToRender={5}
                                            maxToRenderPerBatch={10}
                                            windowSize={7}
                                            updateCellsBatchingPeriod={100}
                                            onRefresh={this._onRefresh}
                                            onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
                                            onEndReachedThreshold={0.2}
                                            ref={ref => { this.ref = ref }}
                                        />
                                    </View>
                                </View>

                                <View style={
                                    [styles.headerCvCon, { marginBottom: paddingBotX + 10 }]}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: dataCongViecCon.length > 0 ? 0 : Platform.OS == 'android' ? 10 : 0 }}>
                                        <Text style={styles.textTileCVcon}>{RootLang.lang.JeeWork.danhsachcongvieccuthe}</Text>
                                        <TouchableOpacity style={{ padding: 10, backgroundColor: '#F3F6F9', borderRadius: 5 }}
                                            onPress={() => { this._taoCongViecCuThe() }}>
                                            <View style={styles.viewThemMoi}>
                                                <Text style={styles.textThemMoi}>{RootLang.lang.JeeWork.them}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{}}>
                                        <FlatList
                                            data={dataCongViecCuThe}
                                            renderItem={this._renderItemCvCuThe}
                                            keyExtractor={(item, index) => index.toString()}
                                            extraData={this.state}
                                            initialNumToRender={5}
                                            maxToRenderPerBatch={10}
                                            windowSize={7}
                                            updateCellsBatchingPeriod={100}
                                            onRefresh={this._onRefresh}
                                            onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
                                            onEndReachedThreshold={0.2}
                                            ref={ref => { this.ref = ref }}
                                        />
                                    </View>
                                </View>
                            </View>

                        </KeyboardAwareScrollView>

                    </View>
                    <IsLoading ref={this.refLoading}></IsLoading>
                </View >
            </View >
        );
    }
};

const styles = StyleSheet.create({
    viewHome: {
        backgroundColor: colors.white, paddingTop: 10, height: '96%', borderTopLeftRadius: 20, borderTopRightRadius: 20
    },
    width100: {
        width: '100%',
    },
    headerContainer: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    },
    itemheaderContainer: {
        alignItems: 'center', flex: 1
    },
    viewLuuVaDong: {
        flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, alignItems: 'center', paddingHorizontal: 10
    },
    touchLuu: {
        flexDirection: 'row', justifyContent: 'center', backgroundColor: '#207FF9', paddingVertical: 12,
        paddingHorizontal: 40, borderRadius: 20
    },
    textLuu: {
        fontSize: reText(16), color: colors.white, textAlign: 'center',
    },
    container: {
        flex: 1,
    },
    viewSearch: {
        paddingHorizontal: 10, paddingBottom: 5
    },
    search: {
        paddingVertical: Platform.OS == 'ios' ? 5 : 0, width: Width(25), textAlign: 'center'
    },
    searchText: {
        paddingVertical: Platform.OS == 'ios' ? 8 : 0, fontSize: reText(18),
    },
    itemContainer: {
        flex: 1, backgroundColor: '#E5E6EB', paddingTop: 5, paddingBottom: paddingBotX
    },
    viewChinh: {
        backgroundColor: colors.white,
        marginHorizontal: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.25,
        shadowRadius: 1,
        elevation: 5,
        borderRadius: 10,
        paddingBottom: 10,
        marginTop: 10,
    },
    textBenTrai: {
        fontSize: reText(15), color: '#8F9294', paddingHorizontal: 10
    },
    viewTong: {
        paddingHorizontal: 10, paddingTop: 10
    },
    viewItem: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 0.3, borderColor: colors.gray1, paddingBottom: 2,
    },
    viewBenTrai: {
        flexDirection: 'row', alignItems: 'center'
    },
    touchChonDuAn: {
        paddingVertical: 10, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, borderRadius: 5
    },
    viewtouchChonDuAn: {
        flex: 1, justifyContent: 'center', alignItems: 'center'
    },
    khungScroll: {
        maxWidth: Width(45), alignItems: 'flex-end',
    },
    khungHethansau: {
        flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, justifyContent: 'space-between'
    },
    touchDoUuTien: {
        alignItems: 'center', flexDirection: 'row', justifyContent: 'center'
    },
    textDoUuTien: {
        fontSize: sizes.sText16, textAlign: 'center', alignSelf: "center"
    },
    viewDate: {
        flexDirection: 'row', alignItems: 'center'
    },
    textDate: {

    },
    viewMota: {
        paddingBottom: 5, paddingTop: 15
    },
    viewBenTraiMota: {
        flexDirection: 'row', alignItems: 'center'
    },
    touchChuKyLap: {
        backgroundColor: '#F3F6F9', paddingVertical: 8, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, borderRadius: 5,
    },
    touchDataChuKyLap: {
        paddingVertical: 8, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10,
        borderRadius: 5, marginRight: 10, backgroundColor: '#F3F6F9',
    },
    viewChuKyLap: {
        flexDirection: 'row', paddingVertical: 5
    },
    headerCvCon: {
        borderRadius: 10, backgroundColor: 'white', marginTop: 10, marginHorizontal: 10, padding: 10, shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.25,
        shadowRadius: 1,
        elevation: 5,
    },
    textTileCVcon: {
        color: colors.colorTabActive, fontSize: reText(17), fontWeight: 'bold'
    },
    viewThemMoi: {
        flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15
    },
    textThemMoi: {
        color: '#289FFB', fontSize: reText(15)
    },
    itemCongVieccon: {
        flex: 1, marginBottom: 10, paddingTop: 10
    },
    viewContainerCVCon: {
        flexDirection: 'row', paddingBottom: 5, borderColor: colors.gray1, alignItems: 'center'
    },
    viewitemCongVieccon: {
        flex: 1, paddingHorizontal: 10
    },
    touchEdit: {
        flexDirection: 'row', flex: 1, alignItems: 'center'
    },
    center: {
        justifyContent: 'center', alignItems: 'center'
    },
    textName: {
        alignSelf: "center", fontWeight: "bold", fontSize: reText(12), color: colors.white
    }
});


const mapStateToProps = state => ({
    lang: state.changeLanguage.language,

});
export default Utils.connectRedux(TaoCongViecMoi, mapStateToProps, true)

class ChonNguoi extends Component {

    render() {
        const { icon, title = '', toDo = () => { }, data } = this.props

        return (
            <View style={[styles.viewItem, { paddingTop: 7, paddingBottom: 7 }]}>
                <View style={[styles.viewBenTrai, { paddingVertical: 5, }]}>
                    <Image source={icon} style={[nstyles.nIcon24, {}]}></Image>
                    <Text style={styles.textBenTrai} >{title}</Text>
                </View>
                {data.length > 0 ?
                    <View style={styles.khungScroll}>
                        <ScrollView horizontal={true} tyle={{}} scrollEnabled={data.length <= 2 ? false : true}>
                            {data.map((item, index) => {
                                return (
                                    <TouchableOpacity onPress={() => { toDo() }} style={{ justifyContent: 'center', alignItems: 'center' }} >
                                        {item.image ?
                                            <ImageCus
                                                style={nstyles.nAva35}
                                                source={{ uri: item.image }}
                                                resizeMode={"cover"}
                                                defaultSourceCus={Images.icAva}
                                            /> :
                                            <View
                                                style={[nstyles.nAva35, {
                                                    borderRadius: Width(8), backgroundColor: intToRGB(hashCode(item.hoten ? item.hoten : '')), alignSelf: 'center',
                                                    justifyContent: 'center', alignItems: 'center'
                                                }]} key={index}>
                                                <Text style={{ alignSelf: "center", fontWeight: "bold", fontSize: reText(12), color: colors.white }}> {String(item.hoten ? item.hoten : '').split(" ").slice(-1).toString().slice(0, 2).toString()}</Text>
                                            </View>}
                                    </TouchableOpacity>
                                )
                            })}
                        </ScrollView>
                    </View>
                    :
                    <TouchableOpacity onPress={() => { toDo() }} >
                        <Image source={Images.ImageJee.icChonNguoiThamGia} style={[nstyles.nAva35, {}]} />
                    </TouchableOpacity>

                }

            </View>
        )
    }
}