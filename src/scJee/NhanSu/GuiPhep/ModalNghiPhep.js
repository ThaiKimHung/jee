import React, { Component } from 'react';
import { Text, TextInput, View, Animated, Image, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { getDSTypeLeave, PostGuiDon, PostSoNgay } from '../../../apis/apiPhep';
import { getNgDuyet, Get_ThoiGian } from '../../../apis/apiTangca';
import { RootLang } from '../../../app/data/locales';
import Utils from '../../../app/Utils';
import ButtonCom from '../../../components/Button/ButtonCom';
import { Images } from '../../../images/index';
import { colors } from '../../../styles/color';
import { reText, sizes } from '../../../styles/size';
import { nHeight, nstyles, paddingBotX, Width } from '../../../styles/styles';
import { TouchTime, TouchTimeVer2 } from '../../../Component_old/itemcom/itemcom';
import UtilsApp from '../../../app/UtilsApp';
import { ROOTGlobal } from '../../../app/data/dataGlobal';

class ModalNghiPhep extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listmodalVisible: true,
            timemodalVisible: false,
            listType: [],
            listgio: [],
            loading: false,
            keyWord: '',
            isTimeFr: '',
            isTimeTo: '',
            songay: 0,
            ngDuyet: '',
            idType: '134',// Mặc định là nghỉ phép năm,
            date: new Date(),
            _dateDk: '',
            _dateKt: '',
            dateTimeF: '',
            dateTimeT: '',
            objectType: { title: '', ID_type: -100 },
            opacity: new Animated.Value(0),
        }
    }
    componentDidMount() {
        let date = Utils.ngetParam(this, "date", "");
        if (date) {
            this._SetNgayThang(date, date)
        }
        this._startAnimation(0.8)
        this._getListType()
        this._getNgDuyet()
    }

    _goback = () => {
        this._endAnimation(0)
        Utils.goback(this)
    }

    _startAnimation = (value) => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: value,
                duration: 400
            }).start();
        }, 300);
    };

    _endAnimation = (value) => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: value,
                duration: 1
            }).start();
        }, 1);
    };
    _SetThoiGian = (timeF, timeT) => {
        this.setState({ dateTimeF: timeF, dateTimeT: timeT }, this._DemNgay)
    }
    _SetNgayThang = (dateDk, dateKt) => {

        this.setState({ _dateDk: dateDk, _dateKt: dateKt }, this._GetThoiGianBatDau)
    }
    //lấy thời gian để nghỉ phép
    _GetThoiGianBatDau = async () => {
        var { _dateDk, _dateKt, dateTimeF, dateTimeT } = this.state;
        const res = await Get_ThoiGian(_dateDk, _dateKt);
        if (res.status == 1) {
            var { dateTimeF, dateTimeT } = this.state
            var arrF = res.TuGio.split(':');
            var arrT = res.DenGio.split(':');
            if (arrF.length > 1 && arrT.length > 1) {
                dateTimeF = res.TuGio
                dateTimeT = res.DenGio
                this.setState({ dateTimeF: dateTimeF, dateTimeT: dateTimeT }, this._DemNgay)
            } else {

            }
        } else {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
        }


    }
    _callback = (objectType) => {
        try {
            var number = Number(objectType.SoNgay)
            if (number <= 0) {
                nthisPush.show({
                    appIconSource: Images.JeeGreen,
                    appTitle: "JeePlatform",
                    title: RootLang.lang.thongbaochung.thongbao,
                    body: RootLang.lang.scphepthemdon.bandahetphep,
                    slideOutTime: 2000
                });
            } else {
                this.setState({ objectType }, this._DemNgay);
            }
        } catch (error) {
            nthisPush.show({
                appIconSource: Images.JeeGreen,
                appTitle: "JeePlatform",
                title: RootLang.lang.thongbaochung.thongbao,
                body: RootLang.lang.scphepthemdon.bandahetphep,
                slideOutTime: 2000
            });
        }
    }

    _DropDown = () => {
        Utils.goscreen(this, 'Modal_Select', { callback: this._callback, item: this.state.objectType, AllThaoTac: this.state.listType })
    }

    _getListType = async () => {
        const res = await getDSTypeLeave();
        var { data = [] } = res
        if (res.status == 1 && data.length > 0) {
            this.setState({ listType: data })
        } else {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.err.loilayloaiphep, 2)
        }
        return
    }
    _getNgDuyet = async () => {
        let res = await getNgDuyet()
        if (res.status == 1) {
            this.setState({ ngDuyet: res.NguoiDuyet })
        } else {
            this.setState({ ngDuyet: '' })
        }

    }
    _DemNgay = async () => {
        const { _dateDk, _dateKt, dateTimeF, dateTimeT, objectType } = this.state;
        var timebd = dateTimeF;
        var timekt = dateTimeT;
        let res = await PostSoNgay(_dateDk, _dateKt, timebd, timekt, objectType.ID_type)
        if (res.status == 1) {
            this.setState({ songay: res.SoNgay, ngDuyet: res.NguoiDuyet })
        }
    }

    _refreshData = () => {
        this.setState({
            _dateDk: '',
            _dateKt: '',
            dateTimeF: '',
            dateTimeT: '',
            objectType: { title: RootLang.lang.scphepthemdon.chonloaiphep, ID_type: -100 },
            textGChu: '',
            songay: 0
        })
    }
    _GuiDon = async () => {

        const { _dateDk, _dateKt, dateTimeT, dateTimeF, objectType, textGChu, songay } = this.state
        if (objectType.ID_type == -100) {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.err.chuachonphep, 3)
            return
        }
        if (songay == 0) {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.err.songaykhonghople, 3)
            return
        }
        if (textGChu == '' || textGChu == undefined) {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.err.nhaplylo, 3)
            return
        }
        Utils.showMsgBoxYesNo(this, RootLang.lang.thongbaochung.thongbao, RootLang.lang.thongbaochung.hanhdonghoi,
            RootLang.lang.thongbaochung.xacnhan, RootLang.lang.thongbaochung.thoat, async () => {
                const res = await PostGuiDon(_dateDk, _dateKt, dateTimeF, dateTimeT, objectType.ID_type, textGChu, objectType.title);
                // Utils.nlog("gia tri res gửi đơn phép", res);
                if (res.status == 1) {
                    this._refreshData();
                    ROOTGlobal.QLCNPhep.refreshphep()
                    // this.props.onRefesh()
                    UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.thongbaochung.thuchienthanhcong, 1)
                    this._goback()
                    // this.props.setIndex();
                } else
                    UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.guidonthatbai, 2)
                return
            })
    }

    nutNguoiDuyet() {
        var { songay, ngDuyet } = this.state;
        var disabled = songay > 0 && ngDuyet ? false : true;
        var name = songay > 0 && ngDuyet ? (RootLang.lang.scphepthemdon.gui + " " + ngDuyet) : RootLang.lang.scphepthemdon.khongtimthaynguoiduyet
        return (
            <TouchableOpacity onPress={songay > 0 && ngDuyet ? this._GuiDon : null} style={{
                marginTop: 20, marginHorizontal: 10,
                backgroundColor: songay > 0 && ngDuyet ? colors.white : colors.btnJeeUnActive, borderRadius: 10,
                fontSize: sizes.sText14, paddingVertical: 15, justifyContent: 'center', alignItems: 'center'
            }}>
                < Text style={{ fontSize: reText(14), color: songay > 0 && ngDuyet ? colors.checkGreen : colors.black, borderRadius: 10, }}>
                    {songay > 0 && ngDuyet ? (RootLang.lang.scdoicalamviec.gui) : RootLang.lang.scdoicalamviec.khongtimthaynguoiduyet} {songay > 0 && ngDuyet ? <Text style={{ fontWeight: 'bold' }}>{ngDuyet}</Text> : null}
                </Text>
            </TouchableOpacity >
        )
    }

    _selectDate = (val) => {
        var { _dateDk, _dateKt } = this.state;
        if (_dateDk && _dateKt) {
            Utils.goscreen(this, "Modal_Calanda", {
                dateF: _dateDk,
                dateT: _dateKt,
                isTimeF: val,
                setTimeFC: this._SetNgayThang,
                arrTitle: [RootLang.lang.scphepthemdon.tungay, RootLang.lang.scphepthemdon.denngay]
            })
        } else {
            Utils.goscreen(this, "Modal_Calanda", {
                dateF: _dateDk,
                dateT: _dateKt,
                isTimeF: val,
                setTimeFC: this._SetNgayThang,
                arrTitle: [RootLang.lang.scphepthemdon.tungay, RootLang.lang.scphepthemdon.denngay]
            })
        }
    }
    _setGioPhutA = (dateTimeF, dateTimeT) => {
        this.setState({ dateTimeF, dateTimeT }, this._DemNgay)

    }
    _selectTime = (val) => {
        var { dateTimeF,
            dateTimeT } = this.state;
        Utils.goscreen(this, 'Modal_GioPhutPicker',
            {
                isFrom: val, timeFrom: dateTimeF, timeTo: dateTimeT,
                _setGoPhut: this._setGioPhutA
            })
    }
    render() {
        var { _dateDk, _dateKt, songay, objectType, dateTimeF, dateTimeT, opacity } = this.state
        return (
            <KeyboardAwareScrollView style={{ flex: 1, backgroundColor: `transparent`, height: nHeight(100) }} keyboardShouldPersistTaps='handled'>
                <View style={[nstyles.ncontainer, { backgroundColor: `transparent`, justifyContent: 'flex-end', height: nHeight(100) }]}>
                    <Animated.View onTouchEnd={this._goback} style={{
                        position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
                        alignItems: 'flex-end', backgroundColor: colors.backgroundModal, opacity
                    }} />
                    <Animated.View style={{ backgroundColor: colors.backgroudJeeHR, width: '100%', borderTopLeftRadius: 15, borderTopRightRadius: 15, paddingBottom: 20 + paddingBotX }}>
                        <View style={{ alignSelf: 'center', width: 300, height: 25, justifyContent: 'center' }}>
                            <Image source={Images.icTopModal} style={{ alignSelf: 'center' }} />
                        </View>
                        <View style={{ flexDirection: 'row', paddingHorizontal: 15 }}>
                            <TouchableOpacity onPress={this._goback} style={{ width: Width(12), height: nHeight(3), justifyContent: 'center' }}>
                                <Text style={{ fontSize: reText(14), color: colors.checkAwait }}>{RootLang.lang.sckhac.huy}</Text>
                            </TouchableOpacity>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: reText(18), fontWeight: 'bold', color: colors.titleJeeHR }}>
                                    {RootLang.lang.scphepthemdon.dangkynghiphep}
                                </Text>
                            </View>
                            <View style={{ width: Width(12) }} />
                        </View>
                        <Text style={{ color: colors.colorTitleJee, fontSize: reText(14), paddingHorizontal: 20, marginTop: 15 }}>{RootLang.lang.thongbaochung.thongtindangky.toUpperCase()}</Text>
                        <View style={{ backgroundColor: colors.white, paddingHorizontal: 10, paddingVertical: 15, marginHorizontal: 10, borderRadius: 10, marginTop: 5 }}>
                            <View style={{}}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ width: Width(6), marginTop: 5 }}>
                                        <Image source={Images.ImageJee.icProjectS} style={{ width: 18, height: 18, }} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                                            <Text style={{ fontSize: reText(14), color: colors.colorNoteJee }}>{RootLang.lang.scphepthemdon.hinhthuc}</Text>
                                            <TouchableOpacity onPress={this._DropDown} style={{ backgroundColor: colors.backgroundHistory, flexDirection: 'row', paddingVertical: 5, justifyContent: 'center', alignItems: 'center', borderRadius: 5, paddingHorizontal: 10, minWidth: Width(35) }}>
                                                <Text numberOfLines={1} style={{ fontSize: reText(14), maxWidth: Width(55), fontWeight: objectType.title ? 'bold' : null, color: objectType.title ? colors.checkGreen : null }}>{objectType.title ? objectType.title : RootLang.lang.thongbaochung.chonloaiphep}</Text>
                                                <Image source={Images.ImageJee.icDropdown} style={{ tintColor: '#BDBDBD', width: Width(2), height: Width(2), alignSelf: 'center', marginLeft: 5 }} />
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ height: 0.5, backgroundColor: colors.colorLineJee }} />
                                    </View>
                                </View>

                                <View style={{ flexDirection: 'row', marginTop: 15 }}>
                                    <View style={{ width: Width(6), marginTop: 5 }}>
                                        <Image source={Images.ImageJee.icTimeJee} style={{ width: 18, height: 18, }} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                                            <Text style={{ fontSize: reText(14), color: colors.colorNoteJee, width: Width(20) }}>{RootLang.lang.scphepthemdon.tungay}</Text>
                                            <View style={{ marginLeft: 10, flexDirection: 'row', justifyContent: 'space-between', }}>
                                                <TouchableOpacity onPress={() => this._selectDate(true)} style={{
                                                    backgroundColor: colors.backgroundHistory, paddingVertical: 7, justifyContent: 'center', alignItems: 'center', borderRadius: 5, paddingHorizontal: 10,
                                                    width: Width(35), marginRight: 10
                                                }}>
                                                    {_dateDk ? <Text style={{ fontSize: reText(14) }}>{_dateDk}</Text> :
                                                        <Image source={Images.ImageJee.icAddTimeJee} style={{ width: 12.5, height: 14 }} />}
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => this._selectTime(true)} style={{
                                                    backgroundColor: colors.backgroundHistory, flexDirection: 'row', paddingVertical: 7, justifyContent: 'center', alignItems: 'center', borderRadius: 5, paddingHorizontal: 10,
                                                    width: Width(20)
                                                }}>
                                                    {dateTimeF ? <Text style={{ fontSize: reText(14) }}>{dateTimeF}</Text> :
                                                        <Image source={Images.ImageJee.icLockJee} style={{ width: 14, height: 14 }} />}
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        <View style={{ height: 0.5, backgroundColor: colors.colorLineJee }} />
                                    </View>
                                </View>

                                <View style={{ flexDirection: 'row', marginTop: 15 }}>
                                    <View style={{ width: Width(6), marginTop: 5 }}>
                                        <Image source={Images.ImageJee.icTimeJee} style={{ width: 18, height: 18, }} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                                            <Text style={{ fontSize: reText(14), color: colors.colorNoteJee, width: Width(20) }}>{RootLang.lang.scphepthemdon.denngay}</Text>
                                            <View style={{ marginLeft: 10, flexDirection: 'row', justifyContent: 'space-between', }}>
                                                <TouchableOpacity onPress={() => this._selectDate(false)} style={{
                                                    backgroundColor: colors.backgroundHistory, paddingVertical: 7, justifyContent: 'center', alignItems: 'center', borderRadius: 5, paddingHorizontal: 10,
                                                    width: Width(35), marginRight: 10
                                                }}>
                                                    {_dateKt ? <Text style={{ fontSize: reText(14) }}>{_dateKt}</Text> :
                                                        <Image source={Images.ImageJee.icAddTimeJee} style={{ width: 12.5, height: 14 }} />}
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => this._selectTime(false)} style={{
                                                    backgroundColor: colors.backgroundHistory, flexDirection: 'row', paddingVertical: 7, justifyContent: 'center', alignItems: 'center', borderRadius: 5, paddingHorizontal: 10,
                                                    width: Width(20)
                                                }}>
                                                    {dateTimeT ? <Text style={{ fontSize: reText(14) }}>{dateTimeT}</Text> :
                                                        <Image source={Images.ImageJee.icLockJee} style={{ width: 14, height: 14 }} />}
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        <View style={{ height: 0.5, backgroundColor: colors.colorLineJee }} />
                                    </View>
                                </View>

                                {/* {
                                    objectType && objectType.ID_type != -100 ?
                                        <View style={{ justifyContent: "flex-end", flexDirection: 'row', paddingVertical: 12 }}>
                                            <Text style={{ color: colors.colorTextGreen, fontSize: sizes.sText16 }}>{RootLang.lang.scphepthemdon.songayduocsudung}: </Text>
                                            <Text style={{ color: colors.colorTextGreen, fontSize: sizes.sText16 }}>{objectType.SoNgay ? objectType.SoNgay : '0'}</Text>
                                        </View> : null
                                } */}
                                {/* <View style={{ height: 1, paddingVertical: 5, backgroundColor: colors.colorBGHome, }} /> */}
                                <View style={{ flexDirection: 'row', marginTop: 15 }}>
                                    <View style={{ width: Width(6) }}>
                                        <Image source={Images.ImageJee.icProjectS} style={{ width: 18, height: 18, }} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                                            <Text style={{ fontSize: reText(14), color: colors.colorNoteJee }}>{RootLang.lang.scphepthemdon.songaynghi}</Text>
                                            <Text style={{ fontSize: reText(14) }}>{songay ? songay : '--'} {RootLang.lang.thongbaochung.ngay}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>


                        <Text style={{ color: colors.colorTitleJee, fontSize: reText(14), paddingHorizontal: 20, marginTop: 20, marginBottom: 5 }}>{RootLang.lang.thongbaochung.lydo.toUpperCase()}</Text>
                        <View style={{ backgroundColor: colors.white, marginHorizontal: 10, borderRadius: 10, paddingVertical: 10 }}>
                            <TextInput
                                placeholder={RootLang.lang.err.nhaplyloJee}
                                multiline={true}
                                textAlignVertical={"top"}
                                value={this.state.textGChu}
                                style={[nstyles.ntextinput, { maxHeight: nHeight(12), fontSize: reText(14), height: nHeight(12) }]}
                                onChangeText={(textGChu) => {
                                    if (textGChu.length < 500) {
                                        this.setState({ textGChu })
                                    }
                                }
                                }
                            />
                        </View>
                        <View style={{ marginBottom: 0 + paddingBotX, marginTop: 20 }}>
                            {this.nutNguoiDuyet()}
                        </View>

                    </Animated.View>
                </View >
            </KeyboardAwareScrollView>
        )
    }
}

const mapStateToProps = state => ({
    lang: state.changeLanguage.language,
    DKPhepReducer: state.DKPhepReducer
});
export default Utils.connectRedux(ModalNghiPhep, mapStateToProps, true)