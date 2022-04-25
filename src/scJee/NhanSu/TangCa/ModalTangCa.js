import { default as Moment, default as moment } from 'moment';
import React, { Component, createRef } from 'react';
import {
    Image, Text,
    TextInput, TouchableOpacity, View, Animated, Switch
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { getNgDuyet, Get_ThoiGian, Guitangca, SoNgayTangCa } from '../../../apis/apiTangca';
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import { RootLang } from '../../../app/data/locales';
import Utils from '../../../app/Utils';
import ButtonCom from '../../../components/Button/ButtonCom';
import IsLoading from '../../../components/IsLoading';
import { Images } from '../../../images/index';
import { colors } from '../../../styles/color';
import { sizes, reText } from '../../../styles/size';
import { nHeight, nstyles, paddingBotX, Width } from '../../../styles/styles';
import { TouchTime, TouchDropNewVer2 } from '../../../Component_old/itemcom/itemcom';
import UtilsApp from '../../../app/UtilsApp';

class ModalTangCa extends Component {
    constructor(props) {
        super(props);
        this.refLoading = React.createRef()
        this.state = {
            isShowTimeFrom: true,
            overTimeChecked: false,
            outTimeChecked: false,
            ngDuyet: [],
            _dateDk: Utils.ngetParam(this, 'date') ? Utils.ngetParam(this, 'date') : Moment(new Date()).format('DD/MM/YYYY'),
            listgio: [],
            timemodalVisible: false,
            isTimeFr: '',
            isTimeTo: '',
            giotc: 0,
            textGChu: '',
            dateTimeF: '',
            dateTimeT: '',
            date: new Date(),
            GioTC: "",
            isError: false,
            opacity: new Animated.Value(0),
        }

    }

    componentDidMount() {
        this._startAnimation(0.8)
        this._getNgDuyet()
        let date = Utils.ngetParam(this, "date", "");
        if (date) {
            this.setState({ _dateDk: date }, this._getThoiGianLamViec)
        } else {
            this._getThoiGianLamViec();
        }
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

    _goback = () => {
        this._endAnimation(0)
        Utils.goback(this, null)
    };

    _getNgDuyet = async () => {
        // this.refLoading.current.show();
        let res = await getNgDuyet()
        var ngDuyet = []
        if (res.status == 1) {
            // this.refLoading.current.hide()
            ngDuyet = res.NguoiDuyet
        } else {
            // this.refLoading.current.hide()
            ngDuyet = ''
        }
        this.setState({ ngDuyet })
    }
    _GuiTangca = async () => {
        var { giotc, _dateDk, overTimeChecked, dateTimeF, textGChu, dateTimeT, outTimeChecked } = this.state;
        if (textGChu == '' || textGChu == undefined) {
            this.refLoading.current.hide()
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.sctangca.vuilongnhaplydo, 3)
            return;
        }
        if (!dateTimeF) {
            this.refLoading.current.hide()
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.sctangca.chonthoigianbatdau, 3)
            return;
        }
        if (!dateTimeT) {
            this.refLoading.current.hide()
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.sctangca.chonthoigianketthuc, 3)
            return;
        }
        if (giotc == 0) {
            this.refLoading.current.hide()
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.sctangca.giotangcalonhon0, 3)
            return;
        }
        Utils.showMsgBoxYesNo(this, RootLang.lang.thongbaochung.thongbao, RootLang.lang.thongbaochung.bancomuonguidonnay,
            RootLang.lang.thongbaochung.xacnhan, RootLang.lang.thongbaochung.thoat, async () => {
                this.refLoading.current.show()
                var timeF = dateTimeF.split(':');
                var timeT = dateTimeT.split(':');
                var valF = `${timeF[0].length < 2 ? `${timeF[0]}` : timeF[0]}:${timeF[1].length < 2 ? `${timeF[1]}` : timeF[1]}`
                var valT = `${timeT[0].length < 2 ? `${timeT[0]}` : timeT[0]}:${timeT[1].length < 2 ? `${timeT[1]}` : timeT[1]}`
                let res = await Guitangca(_dateDk, valF, valT, giotc, overTimeChecked, outTimeChecked, textGChu)
                // Utils.nlog('_GuiTangca', res)
                if (res.status == 1) {
                    this.refLoading.current.hide()
                    UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.thongbaochung.thuchienthanhcong, 1)
                    this._goback()
                    this.handleClearData()
                    ROOTGlobal.dataAppGlobal.reloadDSTangCa();
                } else {
                    this.refLoading.current.hide()
                    UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.sctangca.guitangcathatbai, 2)
                }
            }, () => {
                this.refLoading.current.hide()
            })
    }
    handleClearData = () => {
        let date = Utils.ngetParam(this, "date", "");
        if (date) {
            this.setState({ _dateDk: date, textGChu: '', overTimeChecked: false, outTimeChecked: false }, this._getThoiGianLamViec)
        } else {
            this.setState({ _dateDk: Moment(new Date()).format('DD/MM/YYYY'), textGChu: '', overTimeChecked: false, outTimeChecked: false }, this._getThoiGianLamViec);
        }
    }
    _CheckGioTangCa = (timeF = "", timeT = "") => {

        const { dateTimeF, dateTimeT, GioTC = "" } = this.state;
        if (GioTC == "") {
            if (timeF && timeT) {
                this.setState({ dateTimeF: timeF, dateTimeT: timeT }, this._Songay)
            }
        } else {
            if ((timeF || timeT)) {
                let result = true;
                if (result == true) {
                    this.setState({ dateTimeF: timeF, dateTimeT: timeT }, this._Songay)
                } else {
                    let timeTo = moment(GioTC, "HH:mm").add(+2, 'hours').format('HH:mm');
                    this.setState({ dateTimeF: GioTC, dateTimeT: timeTo }, this._Songay)
                }

            } else {

                if (dateTimeF && dateTimeT && GioTC) {
                    let result = true;
                    if (result == true) {
                        this._Songay();
                    } else {
                        let timeTo = moment(GioTC, "HH:mm").add(+2, 'hours').format('HH:mm');
                        this.setState({ dateTimeF: GioTC, dateTimeT: timeTo }, this._Songay)
                    }
                } else {
                    let timeTo = moment(GioTC, "HH:mm").add(+2, 'hours').format('HH:mm');
                    this.setState({ dateTimeF: GioTC, dateTimeT: timeTo }, this._Songay)
                }
            }
        }
    }
    _getThoiGianLamViec = async () => {

        const { _dateDk } = this.state;
        let res = await Get_ThoiGian(_dateDk, _dateDk);
        if (res.status == 1) {
            if (res.TuGioTC) {
                this.setState({ GioTC: res.TuGioTC }, this._CheckGioTangCa(res.TuGioTC, moment(res.TuGioTC, 'HH:mm').add(+2, 'hours').format('HH:mm')));
            }
            else {
                this.setState({ dateTimeT: '', dateTimeF: '', giotc: 0 })
            }

        }

    }
    _Songay = async () => {
        var { giotc, _dateDk, overTimeChecked, dateTimeF,
            dateTimeT } = this.state;
        if (dateTimeT && dateTimeF && _dateDk) {
            var timeF = dateTimeF.split(':');
            var timeT = dateTimeT.split(':');
            var valF = `${timeF[0].length < 2 ? `${timeF[0]}` : timeF[0]}:${timeF[1].length < 2 ? `${timeF[1]}` : timeF[1]}`
            var valT = `${timeT[0].length < 2 ? `${timeT[0]}` : timeT[0]}:${timeT[1].length < 2 ? `${timeT[1]}` : timeT[1]}`
            let res = await SoNgayTangCa(_dateDk, valF, valT, overTimeChecked);
            if (res.status == 1) {
                giotc = res.SoGio;
                this.setState({ giotc }, this._getNgDuyet)
            } else {
                giotc = '0';
                UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.sctangca.thoigiankhongphuhop, 3)
                this.setState({ giotc })
            }

        }

    }

    nutNguoiDuyet() {
        var { giotc, ngDuyet } = this.state;
        var disabled = giotc > 0 && ngDuyet ? false : true;
        var name = giotc > 0 && ngDuyet ? (RootLang.lang.sctangca.gui + " " + ngDuyet) : RootLang.lang.sctangca.khongtimthaynguoiduyet
        return (
            <TouchableOpacity onPress={giotc > 0 && ngDuyet != '' ? this._GuiTangca : null} style={{
                marginTop: 20, marginHorizontal: 10,
                backgroundColor: giotc > 0 && ngDuyet != '' ? colors.white : colors.btnJeeUnActive, borderRadius: 10,
                fontSize: sizes.sText14, paddingVertical: 15, justifyContent: 'center', alignItems: 'center'
            }}>
                < Text style={{ fontSize: reText(14), color: giotc > 0 && ngDuyet != '' ? colors.checkGreen : colors.black, borderRadius: 10, }}>
                    {giotc > 0 && ngDuyet != '' ? (RootLang.lang.scdoicalamviec.gui) : RootLang.lang.scdoicalamviec.khongtimthaynguoiduyet} {giotc > 0 && ngDuyet != '' ? <Text style={{ fontWeight: 'bold' }}>{ngDuyet}</Text> : null}
                </Text>
            </TouchableOpacity >
        )

    }

    _selectDate = () => {
        var { _dateDk } = this.state;
        Utils.goscreen(this, "Modal_CalandaSingalCom", {
            date: _dateDk,
            setTimeFC: this._setDate

        })
    }
    _setDate = (date) => {
        this.setState({ _dateDk: date }, () => {
            this._getThoiGianLamViec();

        })
    }

    _selectTime = (val) => {
        let { dateTimeF,
            dateTimeT } = this.state;
        Utils.goscreen(this, 'Modal_GioPhutPicker', {
            isFrom: val, timeFrom: dateTimeF, timeTo: dateTimeT, _setGoPhut: (dateTimeF, dateTimeT) => {
                if (dateTimeF || dateTimeT) {
                    let timeFF = dateTimeF ? dateTimeF : moment(dateTimeF, 'HH:mm').add(+2, 'hours').format('HH:mm');
                    let timeTT = dateTimeT ? dateTimeT : moment(dateTimeT, 'HH:mm').add(+2, 'hours').format('HH:mm');
                    this._CheckGioTangCa(timeFF, timeTT);
                } else {

                }

            }
        })
    }
    render() {
        const {
            ngDuyet, _dateDk,
            listgio, isTimeFr, isTimeTo, giotc, textGChu,
            overTimeChecked, dateTimeF, dateTimeT, outTimeChecked, opacity
        } = this.state;
        if (dateTimeF && _dateDk) {
            let timeF = dateTimeF.split(':');
            var valF = `${timeF[0].length < 2 ? `${timeF[0]}` : timeF[0]}:${timeF[1].length < 2 ? `${timeF[1]}` : timeF[1]}`
        }
        if (dateTimeT && _dateDk) {
            let timeT = dateTimeT.split(':');
            var valT = `${timeT[0].length < 2 ? `${timeT[0]}` : timeT[0]}:${timeT[1].length < 2 ? `${timeT[1]}` : timeT[1]}`
        }

        return (
            <KeyboardAwareScrollView style={{ flex: 1, backgroundColor: `transparent`, height: nHeight(100) }} keyboardShouldPersistTaps='handled'>
                <View style={[nstyles.ncontainer, { backgroundColor: `transparent`, justifyContent: 'flex-end', height: nHeight(100) }]}>
                    <Animated.View onTouchEnd={this._goback} style={{
                        position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
                        alignItems: 'flex-end', backgroundColor: colors.backgroundModal,
                        opacity
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
                                    {RootLang.lang.sctangca.dangkylam}
                                </Text>
                            </View>
                            <View style={{ width: Width(12) }} />
                        </View>
                        <Text style={{ color: colors.colorTitleJee, fontSize: reText(14), paddingHorizontal: 20, marginTop: 15 }}>{RootLang.lang.thongbaochung.thongtindangky.toUpperCase()}</Text>
                        <View style={{ backgroundColor: colors.white, paddingHorizontal: 10, paddingVertical: 15, marginHorizontal: 10, borderRadius: 10, marginTop: 5 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ width: Width(6), marginTop: 5 }}>
                                    <Image source={Images.ImageJee.icDateTime} style={{ width: 18, height: 18, }} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                                        <Text style={{ fontSize: reText(14), color: colors.colorNoteJee }}>{RootLang.lang.sctangca.ngay}</Text>
                                        <TouchableOpacity onPress={this._selectDate} style={{ backgroundColor: colors.backgroundHistory, flexDirection: 'row', paddingVertical: 5, justifyContent: 'center', alignItems: 'center', borderRadius: 5, paddingHorizontal: 10, minWidth: Width(30) }}>
                                            <Text numberOfLines={1} style={{ fontSize: reText(14), maxWidth: Width(55), color: colors.blackJee }}>{_dateDk ? _dateDk : '--'}</Text>
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
                                        <Text style={{ fontSize: reText(14), color: colors.colorNoteJee }}>{RootLang.lang.sctangca.giolamthem}</Text>
                                        <View style={{ flexDirection: 'row' }}>
                                            <TouchableOpacity onPress={() => this._selectTime(true)} style={{
                                                backgroundColor: colors.backgroundHistory,
                                                paddingVertical: 5, justifyContent: 'center', alignItems: 'center', borderRadius: 5, paddingHorizontal: 10, minWidth: Width(20)
                                            }}>
                                                <Text numberOfLines={1} style={{ fontSize: reText(14), color: colors.blackJee }}>{dateTimeF ? valF : '--'}</Text>
                                            </TouchableOpacity>
                                            <Text style={{ fontSize: reText(14), color: colors.black_20_2, alignSelf: 'center' }}>{' - '}</Text>
                                            <TouchableOpacity onPress={() => this._selectTime(false)} style={{
                                                backgroundColor: colors.backgroundHistory,
                                                paddingVertical: 5, justifyContent: 'center', alignItems: 'center', borderRadius: 5, paddingHorizontal: 10, minWidth: Width(20)
                                            }}>
                                                <Text numberOfLines={1} style={{ fontSize: reText(14), color: colors.blackJee }}>{dateTimeT ? valT : '--'}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={{ height: 0.5, backgroundColor: colors.colorLineJee }} />
                                </View>
                            </View>

                            <View style={{ flexDirection: 'row', marginTop: 15 }}>
                                <View style={{ width: Width(6) }}>
                                    <Image source={Images.ImageJee.icClock} style={{ width: 18, height: 18, }} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                                        <Text style={{ fontSize: reText(14), color: colors.colorNoteJee }}>{RootLang.lang.sctangca.sogio}</Text>
                                        <Text numberOfLines={1} style={{ fontSize: reText(14), maxWidth: Width(55), color: colors.blackJee }}>{giotc ? giotc : '--'} {RootLang.lang.thongbaochung.gio}</Text>
                                    </View>
                                    <View style={{ height: 0.5, backgroundColor: colors.colorLineJee }} />
                                </View>
                            </View>

                            <View style={{ flexDirection: 'row', marginTop: 15 }}>
                                <View style={{ width: Width(6), marginTop: 5 }}>
                                    <Image source={Images.ImageJee.icCafeJee} style={{ width: 18, height: 18, }} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                                        <Text style={{ fontSize: reText(14), color: colors.colorNoteJee }}>{RootLang.lang.sctangca.lamthemtronggiogiailao}</Text>
                                        <Switch
                                            style={{ alignContent: "flex-end", alignSelf: "center", transform: [{ scaleX: .8 }, { scaleY: .8 }] }}
                                            trackColor={{ false: 'gray', true: 'teal' }}
                                            thumbColor="white"
                                            ios_backgroundColor="gray"
                                            onValueChange={(value) => this.setState({ overTimeChecked: !overTimeChecked }, this._Songay)}
                                            value={this.state.overTimeChecked}
                                        />

                                    </View>
                                    <View style={{ height: 0.5, backgroundColor: colors.colorLineJee }} />
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 15 }}>
                                <View style={{ width: Width(6), marginTop: 5 }}>
                                    <Image source={Images.ImageJee.icNotFaceJee} style={{ width: 18, height: 18, }} />
                                </View>
                                <View style={{ flex: 1, marginLeft: -4 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text style={{ fontSize: reText(14), color: colors.colorNoteJee }}> {RootLang.lang.sctangca.lamviecbenngoai}</Text>
                                        <Switch
                                            style={{ alignContent: "flex-end", alignSelf: "center", transform: [{ scaleX: .8 }, { scaleY: .8 }] }}
                                            trackColor={{ false: 'gray', true: 'teal' }}
                                            thumbColor="white"
                                            ios_backgroundColor="gray"
                                            onValueChange={(value) => this.setState({ outTimeChecked: !outTimeChecked }, this._Songay)}
                                            value={this.state.outTimeChecked}
                                        />

                                    </View>
                                </View>
                            </View>
                        </View>
                        <Text style={{ color: colors.colorTitleJee, fontSize: reText(14), paddingHorizontal: 20, marginTop: 20, marginBottom: 5 }}>{RootLang.lang.thongbaochung.lydo.toUpperCase()}</Text>
                        <View style={{ backgroundColor: colors.white, marginHorizontal: 10, borderRadius: 10, paddingVertical: 10 }}>
                            <TextInput
                                placeholder={RootLang.lang.err.nhaplyloJee}
                                enablesReturnKeyAutomatically={true}
                                multiline={true}
                                blurOnSubmit={true}
                                textAlignVertical={"top"}
                                value={this.state.textGChu}
                                style={[nstyles.ntextinput, { maxHeight: nHeight(12), fontSize: reText(14), height: nHeight(12) }]}
                                onChangeText={(textGChu) => this.setState({ textGChu })}
                            />
                        </View>

                        <View style={{ marginBottom: 0 + paddingBotX, }}>
                            {this.nutNguoiDuyet()}
                        </View>
                    </Animated.View >
                </View>
                <IsLoading ref={this.refLoading} />
            </KeyboardAwareScrollView>
        )
    }
}
const mapStateToProps = state => ({
    lang: state.changeLanguage.language,
});
export default Utils.connectRedux(ModalTangCa, mapStateToProps, true)
