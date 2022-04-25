import React, { Component, Fragment } from 'react';
import { Animated, BackHandler, ScrollView, Text, TouchableOpacity, View, Image, TextInput, StyleSheet, Switch, Platform } from 'react-native';
import { Get_ListTaiSan, Get_ListDepartment, GetUser_ByDepartment, Insert_DatPhongHop } from '../../apis/JeePlatform/API_JeeHanhChanh/apiJeeHanhChanh';
import { RootLang } from '../../app/data/locales';
import Utils from '../../app/Utils';
import UtilsApp from '../../app/UtilsApp';
import { Images } from '../../images';
import { colors, nstyles, sizes } from '../../styles';
import { reText } from '../../styles/size';
import { Height, nHeight, paddingBotX, Width } from '../../styles/styles';
import moment from 'moment'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { postKT_ThoiGianDat } from '../../apis/JeePlatform/API_JeeMeeting/apiTaoCuocHop';

// const ModalCreate = Platform.select({
//     ios: () => KeyboardAwareScrollView,
//     android: () => View
// })();

export class FormDangKyTS extends Component {
    constructor(props) {
        super(props);
        this.callback = Utils.ngetParam(this, 'callback');
        this.type = Utils.ngetParam(this, 'type', 0);
        this.noiDungHop = Utils.ngetParam(this, 'noiDungHop', '');
        this.valDateForm = Utils.ngetParam(this, 'valDate') ? moment(Utils.ngetParam(this, 'valDate')).format('HH:mm').toString() : '06:00'
        this.valDateTo = Utils.ngetParam(this, 'valDate') ? moment(Utils.ngetParam(this, 'valDate')).add(1, 'hours').format('HH:mm').toString() : '19:00'
        this.state = {
            textempty: RootLang.lang.thongbaochung.khongcodulieu,
            opacity: new Animated.Value(0),
            heightCus: new Animated.Value(Height(55)),
            iconHeader: 0,
            content: '',
            fulldate: false,
            dataTaiSan: [],
            selectTaiSan: Utils.ngetParam(this, 'selectTaiSan'),
            listUser: [],
            selectUser: {},
            date: Utils.ngetParam(this, 'valDate') ? moment(Utils.ngetParam(this, 'valDate')).format('YYYY/MM/DD').toString() : moment().format('YYYY/MM/DD').toString(),
            FormTime: this.valDateForm ? this.valDateForm : '06:00',
            ToTime: this.valDateTo ? this.valDateTo : '19:00'
        }

    };

    _goback = () => {
        this._endAnimation(0)
        Utils.goback(this);
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
    componentDidMount() {
        this.handlerBack = BackHandler.addEventListener('hardwareBackPress', this._handlerBackButton)
        this._startAnimation(0.8)
        this.Get_ListTaiSan()
        // this.Get_ListDepartment()
    }

    componentWillUnmount() {
        this.handlerBack.remove()
    }
    _handlerBackButton = () => {
        this._goback()
        return true
    }

    Get_ListTaiSan = async () => {
        let res = await Get_ListTaiSan()
        if (res.status == 1) {
            this.setState({
                dataTaiSan: res.data
            })
        }
    }


    ViewTaiSan = (item) => {
        return (
            <View key={item.RowID} >
                <Text style={{
                    textAlign: "center", fontSize: reText(16),
                    color: this.state.selectTaiSan.RowID == item.RowID ? colors.yellowColor : 'black',
                    fontWeight: this.state.selectTaiSan.RowID == item.RowID ? "bold" : 'normal'
                }}>{item.Title ? item.Title : ""}</Text>
            </View>
        )
    }

    _DropDown = () => {
        Utils.goscreen(this, 'Modal_ComponentSelectCom', {
            callback: this._callback, item: this.state.selectTaiSan,
            AllThaoTac: this.state.dataTaiSan, ViewItem: this.ViewTaiSan
        })
    }

    _callback = (item) => {
        this.setState({ selectTaiSan: item })
    }

    _selectDate = () => {
        const { date } = this.state
        Utils.goscreen(this, 'Modal_CalandaSingalCom', {
            date: moment(date, 'YYYY/MM/DD').format('DD/MM/YYYY') || moment(new Date()).format('DD/MM/YYYY'),
            setTimeFC: (time) => {
                let timeNew = moment(time, 'DD/MM/YYYY').format('YYYY/MM/DD')
                this.setState({ date: timeNew })
            }
        })
    }

    setTimeFullDate = (val) => {
        this.setState({ fulldate: val })
        if (val) {
            this.setState({ FormTime: '06:00', ToTime: '19:00' })
        }
    }

    FormTime = () => {
        Utils.goscreen(this, 'Modal_GioPhutPickerBasic', {
            time: this.state.FormTime.toString() || moment(new Date()).format('HH:mm').toString(),
            _setGioPhut: (time) => this.setState({ FormTime: time })
        })
    }
    ToTime = () => {
        Utils.goscreen(this, 'Modal_GioPhutPickerBasic', {
            time: this.state.ToTime.toString() || moment(new Date()).format('HH:mm').toString(),
            _setGioPhut: (time) => this.setState({ ToTime: time })
        })
    }

    Save = async () => {
        let { FormTime, ToTime, date, selectTaiSan } = this.state
        let thu = moment(date, 'YYYY-MM-DD').format('ddd').replace('T', 'Thứ ') //này tính theo date
        if (this.type == 1) {
            this.checkDangKy().then(res => {
                if (res) {
                    let itemback = {
                        "IdPhieu": -1,
                        "RoomID": selectTaiSan.RowID,
                        "BookingDate": moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD') + 'T00:00:00.0000000',
                        "FromTime": FormTime,
                        "ToTime": ToTime,
                        "meetingContent": this.noiDungHop,
                        "DiaDiem": selectTaiSan.Title + ', ' + thu + ' ' + date + ', ' + FormTime + ' - ' + ToTime,
                        "TenPhong": selectTaiSan.Title
                    }
                    console.log("HHHHHHHH:", itemback)
                    Utils.goback(this)
                    this.callback(this.type, itemback)
                } else {
                    return
                }
            })

        } else {
            let { date, FormTime, ToTime, content, selectTaiSan } = this.state
            if (!content || selectTaiSan.RowID == -1) {
                UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.thongbaochung.vuilongnhapduthongtindangky, 4)
                return
            }

            let res = await Insert_DatPhongHop(date, FormTime, ToTime, content, selectTaiSan.RowID)
            if (res.status == 1) {
                UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.thongbaochung.dangkythanhcong, 1)
                Utils.goback(this)
                this.callback()
            } else {
                UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error.msg ? res.error.msg : RootLang.lang.thongbaochung.dangkythatbai, 2)
                Utils.goback(this)
            }
        }
    }


    checkDangKy = async () => {
        let { FormTime, ToTime, date, selectTaiSan } = this.state
        console.log("selectTaiSan:", selectTaiSan)
        let body = {
            "RoomID": selectTaiSan.RowID,
            "BookingDate": moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD') + 'T00:00:00.0000000',
            "FromTime": FormTime,
            "ToTime": ToTime
        }
        let res = await postKT_ThoiGianDat(body)
        console.log("RES:", res, body, date)
        if (res.status == 1) {
            return true
        } else {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.msg : RootLang.lang.thongbaochung.khongthedangky, 4)
            return false
        }
    }
    render() {
        const { opacity, content, fulldate, selectTaiSan, date, FormTime, ToTime } = this.state
        return (
            <KeyboardAwareScrollView style={{ flex: 1, backgroundColor: `transparent`, height: nHeight(100) }}>
                <View style={[nstyles.nstyles.ncontainer, { backgroundColor: `transparent`, justifyContent: 'flex-end', height: nHeight(100) }]}>
                    <Animated.View onTouchEnd={this._goback} style={{
                        position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
                        alignItems: 'flex-end',
                        opacity
                    }} />
                    <Animated.View style={{ backgroundColor: '#F1F4FB', width: '100%', borderTopLeftRadius: 10, borderTopRightRadius: 10, paddingBottom: 20 + paddingBotX }}>
                        <View style={{ alignSelf: 'center', width: 300, height: 25, justifyContent: 'center' }}>
                            <Image source={Images.icTopModal} style={{ alignSelf: 'center' }} />
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15, marginBottom: 10 }}>
                            <TouchableOpacity onPress={() => Utils.goback(this)} style={{ alignSelf: 'center' }} >
                                <Image source={Images.ImageJee.icCloseModal} style={{ width: Width(5), height: Width(5), alignSelf: 'center', tintColor: colors.black_70 }} />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.Save()} style={{ width: '30%', paddingVertical: 10, backgroundColor: colors.blueColor, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: colors.white }}>{RootLang.lang.thongbaochung.luu}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ paddingHorizontal: 10 }}>
                            {this.type == 1 ? null :
                                <>
                                    <TextInput
                                        placeholder={RootLang.lang.thongbaochung.nhapnoidungdangky}
                                        style={{ fontSize: reText(20) }}
                                        value={content}
                                        onChangeText={(t) => this.setState({ content: t })}
                                    // autoFocus={true}
                                    />
                                    <View style={{ height: 0.5, backgroundColor: colors.black_20_2, width: Width(100), marginLeft: -10, marginVertical: 15 }} />
                                </>}
                            <View style={{ flexDirection: 'row', }}>
                                <Image source={Images.ImageJee.icEarth} style={{ width: Width(5), height: Width(5), marginRight: 10, tintColor: colors.colorTitleNew }} />
                                <Text style={[styles.TextDrop, { color: selectTaiSan.RowID == -1 ? colors.black_50 : colors.orange1, fontWeight: selectTaiSan.RowID == -1 ? null : 'bold' }]}>{selectTaiSan.Title}</Text>
                            </View>
                            <View style={{ height: 0.5, backgroundColor: colors.black_20_2, width: Width(100), marginLeft: -10, marginTop: 15, marginBottom: 10 }} />

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image source={Images.ImageJee.icTime} style={{ width: Width(5), height: Width(5), alignSelf: 'center', tintColor: colors.colorTitleNew, marginRight: 10 }} />
                                    <Text style={styles.TextDrop}>{RootLang.lang.thongbaochung.cangay}</Text>
                                </View>
                                <Switch
                                    style={{ alignContent: "flex-end", alignSelf: "center", transform: [{ scaleX: Platform.OS == 'ios' ? 0.8 : 1.2 }, { scaleY: Platform.OS == 'ios' ? 0.8 : 1.2 }] }}
                                    trackColor={{ false: 'gray', true: 'teal' }}
                                    thumbColor="white"
                                    ios_backgroundColor="gray"
                                    onValueChange={(value) => this.setTimeFullDate(value)}
                                    value={fulldate}
                                />
                            </View>
                            <View style={{ height: 0.5, backgroundColor: colors.black_20_2, width: Width(100), marginLeft: -10, marginTop: 10, marginBottom: 5 }} />
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <TouchableOpacity onPress={() => this._selectDate()} style={{ marginTop: 7, flexDirection: 'row' }}>
                                    <Image source={Images.icCalendar} style={{ width: Width(5), height: Width(5), tintColor: colors.colorTitleNew, marginRight: 10, alignSelf: 'center' }} />
                                    <Text style={styles.TextTime}>{UtilsApp.RenderThu(date, this.props.lang)}, {moment(date).format('DD/MM/YYYY')}</Text>
                                </TouchableOpacity>
                                <View style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity onPress={() => this.FormTime()} style={{ flexDirection: 'row', marginTop: 10, borderWidth: 0.5, padding: 5, marginRight: 10, borderRadius: 7, borderColor: colors.greenTab }}>
                                        <Text style={[styles.TextTime, { color: colors.greenTab, fontWeight: 'bold' }]}>{FormTime}</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => this.ToTime()} style={{ flexDirection: 'row', marginTop: 10, borderWidth: 0.5, padding: 5, borderRadius: 7, borderColor: colors.greenTab }}>
                                        <Text style={[styles.TextTime, { color: colors.greenTab, fontWeight: 'bold' }]}>{ToTime}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Animated.View>
                </View >
            </KeyboardAwareScrollView>
        );
    }
}
const styles = StyleSheet.create({
    titleText: { fontSize: reText(14), color: colors.colorTitleNew },
    ViewDrop: { width: '100%', flexDirection: 'row', borderWidth: 0.5, borderColor: colors.black_20_2, paddingVertical: 10, paddingHorizontal: 10, justifyContent: 'space-between', borderRadius: 10, marginTop: 3, alignItems: 'center' },
    TextDrop: { color: colors.black_50, fontSize: reText(16), },
    iconDrop: { tintColor: colors.black_50, alignSelf: 'center' },
    TextTime: { fontSize: reText(16), alignSelf: 'center' }
})

const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});

export default Utils.connectRedux(FormDangKyTS, mapStateToProps, true)
