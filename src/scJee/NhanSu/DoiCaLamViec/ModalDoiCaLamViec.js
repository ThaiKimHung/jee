import moment from 'moment';
import React, { Component } from 'react';
import {
    Image,
    ScrollView, StyleSheet, Text,
    TextInput, TouchableOpacity, View, Animated
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SwipeListView } from 'react-native-swipe-list-view';
import { getNgDuyet, Send_ChangeShift } from '../../../apis/apiChangeshiftnv';
import { GetListCaLamViec } from '../../../apis/apiUser';
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import { RootLang } from '../../../app/data/locales';
import Utils from '../../../app/Utils';
import IsLoading from '../../../components/IsLoading';
import { Images } from '../../../images';
import { colors } from '../../../styles';
import { reText, sizes } from '../../../styles/size';
import { nHeight, nstyles, paddingBotX, Width } from '../../../styles/styles';
import UtilsApp from '../../../app/UtilsApp';
import { getDSChamCong } from '../../../apis/apiTimesheets';

class ModalDoiCaLamViec extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listmodalVisible: true,
            timemodalVisible: false,
            listType: [],
            textGChu: '',
            isType: RootLang.lang.scdoicalamviec.nghiphepnam,
            listDon: [],
            loading: false,
            keyWord: '',
            isTimeFr: '',
            isTimeTo: '',
            songay: 0,
            ngDuyet: '',
            idType: '134',
            date: new Date(),
            // _dateDk: moment(new Date()).format('DD/MM/YYYY'),
            // _dateKt: moment(new Date()).format('DD/MM/YYYY'),
            _dateDk: '',
            _dateKt: '',
            dateTimeF: '',
            dateTimeT: '',
            objectType: { Title: '', ID_Row: -100 },
            opacity: new Animated.Value(0),
            caCurrent: '--'
        }
        //mag nao 
    }



    componentDidMount() {
        let date = Utils.ngetParam(this, "date", "");
        if (date) {
            this.setState({ _dateDk: date, _dateKt: date }, this._getListDoiCa)
            this.getCa(date)
        } else {
            this._getListDoiCa();
        }
        this._startAnimation(0.8)
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

    _callback = (objectType) => {
        try {
            var number = Number(objectType.SoNgay)
            if (number <= 0) {
                nthisPush.show({
                    appIconSource: Images.JeeGreen,
                    appTitle: "JeePlatform",
                    title: RootLang.lang.thongbaochung.thongbao,
                    body: RootLang.lang.scdoicalamviec.bandahetphep,
                    slideOutTime: 2000
                });
            } else {
                this.setState({ objectType });
            }
        } catch (error) {
            nthisPush.show({
                appIconSource: Images.JeeGreen,
                appTitle: "JeePlatform",
                title: RootLang.lang.thongbaochung.thongbao,
                body: RootLang.lang.scdoicalamviec.loaiphep + " " + `${objectType.title}` + " " + RootLang.lang.scdoicalamviec.biloi,
                slideOutTime: 2000
            });
        }
    }

    ViewItem = (item) => {
        return (
            <View key={item.ID_Row.toString()} >
                <Text style={{
                    textAlign: "center", fontSize: sizes.sText16,
                    color: this.state.objectType.ID_Row == item.ID_Row ? colors.textblack : colors.colorTextBTGray,
                    fontWeight: this.state.objectType.ID_Row == item.ID_Row ? "bold" : 'normal'
                }}>{item.Title_Merge ? item.Title_Merge : ""}</Text>
            </View>
        )
    }
    _DropDown = () => {
        Utils.goscreen(this, 'Modal_ComponentSelectCom', { callback: this._callback, item: this.state.objectType, AllThaoTac: this.state.listType, ViewItem: this.ViewItem })
    }

    _getListDoiCa = async () => {
        const res = await GetListCaLamViec();
        var { data = [] } = res
        if (res.status == 1 && data.length > 0) {
            this.setState({
                listType: data,
                objectType: {}
            })

        } else {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
        }

        return
    }
    ThemDon = () => {
        var { _dateDk, _dateKt, objectType, listDon, textGChu } = this.state;
        if (_dateDk == '' || _dateKt == '') {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.thongbaochung.chuachonngay, 4)
        } else if (!objectType.Title) {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.scdoicalamviec.banchuachonca, 4)
        } else {
            if (listDon.length > 0) {
                var isItem = false, isIndex = 0
                for (let index = 0; index < listDon.length; index++) {
                    const element = listDon[index];
                    if (element.ngaylamviec == _dateDk) {
                        isItem = true
                        isIndex = index;
                    }
                    if (element.ketthuc == _dateKt) {
                        isItem = true
                        isIndex = index;
                    }
                }
                if (isItem == true) {
                    Utils.showMsgBoxYesNo(this, RootLang.lang.thongbaochung.xacnhan,
                        RootLang.lang.thongbaochung.xacnhandoicalamviec,
                        RootLang.lang.thongbaochung.xacnhan,
                        RootLang.lang.thongbaochung.thoat, () => {
                            listDon.splice(isIndex, 1);
                            listDon.push({
                                ngaylamviec: _dateDk,
                                denngay: _dateKt,
                                CaThayDoiID: objectType.ID_Row,
                                Title_Merge: objectType.Title_Merge,
                                caCurrent: this.state.caCurrent

                            })
                            this.setState({ listDon, _dateDk: '', _dateKt: '', caCurrent: '--' }, this._getNgDuyet)
                        })

                }
                else {
                    listDon.push({
                        ngaylamviec: _dateDk,
                        denngay: _dateKt,
                        CaThayDoiID: objectType.ID_Row,
                        Title_Merge: objectType.Title_Merge,
                        caCurrent: this.state.caCurrent
                    })
                    this.setState({ listDon, _dateDk: '', _dateKt: '', caCurrent: '--' }, this._getNgDuyet)
                }
            }
            else {
                listDon.push({
                    ngaylamviec: _dateDk,
                    denngay: _dateKt,
                    CaThayDoiID: objectType.ID_Row,
                    Title_Merge: objectType.Title_Merge,
                    caCurrent: this.state.caCurrent
                })
                this.setState({ listDon, _dateDk: '', _dateKt: '', caCurrent: '--' }, this._getNgDuyet)
            }
        }
    }
    _getNgDuyet = async () => {
        let res = await getNgDuyet()
        if (res.status == 1) {
            this.setState({ ngDuyet: res.NguoiDuyet })
        } else {
            this.setState({ ngDuyet: '' })
        }

    }

    SendChangeShift = async () => {
        var { listDon, textGChu } = this.state;
        var list = listDon.map(item => {
            return {
                ngaylamviec: item.ngaylamviec,
                denngay: item.denngay,
                CaThayDoiID: item.CaThayDoiID
            }
        });
        if (!list || list.length == 0) {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.scdoicalamviec.banchuachonca, 3)
            return
        }
        if (textGChu == '') {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.scdoicalamviec.banchuanhaplydo, 3)
            return
        }
        let res = await Send_ChangeShift(textGChu, list);
        nthisLoading.show();
        if (res.status == 1) {
            nthisLoading.hide();
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.scdoicalamviec.themmoithanhcong, 1)
            this._goback()
            this.handleClearData()
            ROOTGlobal.QLDoiCa.refreshDSDoiCa();
        }
        else {
            nthisLoading.hide();
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.thuchienthatbai, 2)
        }
    }
    handleClearData = () => {
        let date = Utils.ngetParam(this, "date", "");
        if (date) {
            this.setState({ textGChu: '', listDon: [], _dateDk: date, _dateKt: date }, this._getListDoiCa)
        } else {
            this.setState({ textGChu: '', listDon: [], _dateDk: moment(new Date()).format('DD/MM/YYYY'), _dateKt: moment(new Date()).format('DD/MM/YYYY'), }, this._getListDoiCa);
        }

    }
    nutNguoiDuyet() {
        var { listDon, ngDuyet } = this.state;
        return (
            <TouchableOpacity onPress={listDon.length > 0 && ngDuyet ? this.SendChangeShift : null} style={{
                marginTop: 20, marginHorizontal: 10,
                backgroundColor: listDon.length > 0 && ngDuyet ? colors.white : colors.btnJeeUnActive, borderRadius: 10,
                fontSize: sizes.sText14, paddingVertical: 15, justifyContent: 'center', alignItems: 'center'
            }}>
                < Text style={{ fontSize: reText(14), color: listDon.length > 0 && ngDuyet ? colors.checkGreen : colors.black, borderRadius: 10, }}>
                    {listDon.length > 0 && ngDuyet ? (RootLang.lang.scdoicalamviec.gui) : RootLang.lang.scdoicalamviec.khongtimthaynguoiduyet} {listDon.length > 0 && ngDuyet ? <Text style={{ fontWeight: 'bold' }}>{ngDuyet}</Text> : null}
                </Text>
            </TouchableOpacity >
        )

    }

    _SetNgayThang = (dateDk, dateKt) => {
        this.setState({ _dateDk: dateDk, _dateKt: dateKt })
        this.getCa(dateDk)
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
    _setDate = (date) => {
        this.setState({ _dateDk: date }, this._getListDoiCa)
    }

    getCa = async (date) => {
        let res = await getDSChamCong(`${date}|${date}`, 1, 10);
        if (res.status == 1) {
            this.setState({ caCurrent: res.data[0].TenCa })
        } else {
            this.setState({ caCurrent: '--' })
        }
    }
    renderItem = (item, index) => {
        return (
            <View>
                {
                    index != 0 ? <View style={{ width: '100%', height: 1, backgroundColor: colors.veryLightPinkTwo }}></View> : null
                }
                <View key={index.toString()} style={{ backgroundColor: colors.white, flexDirection: 'row' }}>
                    <Image
                        source={Images.icCalendar}
                        style={{ tintColor: colors.orangeSix, marginTop: 15, marginLeft: 10 }}
                    />
                    <View style={{ marginTop: 10, marginLeft: 20 }}>
                        <Text style={{ fontSize: sizes.sText16, }}>{item.ngaylamviec}</Text>
                        <Text style={{ fontSize: sizes.sText12, color: colors.black_20, paddingTop: 12, paddingBottom: 20 }}>{`${item.Title_Merge}`}</Text>
                    </View>
                </View>
            </View>

        )
    }

    _XoaChiTietDoiCa = (index) => {
        var { listDon } = this.state;
        listDon.splice(index, 1);
        this.setState({ listDon });
    }

    render() {
        let { _dateDk, _dateKt, objectType, listDon, opacity } = this.state
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
                                    {RootLang.lang.scdoicalamviec.dangkydoica}
                                </Text>
                            </View>
                            <View style={{ width: Width(12) }} />
                        </View>
                        <Text style={{ color: colors.colorTitleJee, fontSize: reText(14), paddingHorizontal: 20, marginTop: 15 }}>{RootLang.lang.thongbaochung.thongtindangky.toUpperCase()}</Text>
                        {listDon.length > 0 ?
                            <ScrollView style={{ marginHorizontal: 10, borderRadius: 10, backgroundColor: colors.white, paddingHorizontal: 10, paddingVertical: 5, maxHeight: nHeight(35), marginVertical: 5 }}>
                                <SwipeListView
                                    contentContainerStyle={listDon.length > 0 ? {} : { flex: 1 }}
                                    disableRightSwipe
                                    showsVerticalScrollIndicator={false}
                                    onRowOpen={(rowKey, rowMap) => this.setState({ key: rowKey, map: rowMap })}
                                    data={listDon}
                                    renderItem={data => {
                                        var { item, index } = data
                                        let caLam = item.Title_Merge ? item.Title_Merge.split(' (', 1) : '---'
                                        return (
                                            <View style={{ backgroundColor: colors.white }}>
                                                {
                                                    index != 0 ? <View style={{ width: '100%', height: 0.5, backgroundColor: colors.colorLineJee }}></View> : null
                                                }
                                                <View key={item.ngaylamviec.toString()} style={{ paddingVertical: 15 }}>
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <Text style={{ fontSize: reText(14), color: colors.titleJeeHR, flex: 1 }}>
                                                            {moment(item.ngaylamviec, 'DD/MM/YYYY').format('ddd, DD/MM')} - {moment(item.denngay, 'DD/MM/YYYY').format('ddd, DD/MM')}
                                                        </Text>
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <Text style={{ fontSize: reText(14), color: colors.checkGreen, fontWeight: 'bold' }}>
                                                                {item.caCurrent}
                                                            </Text>
                                                            <Image source={Images.ImageJee.icArrowRight} style={{ alignSelf: 'center', marginHorizontal: Width(2) }} />
                                                            <Text style={{ fontSize: reText(14), color: colors.checkGreen, fontWeight: 'bold' }}>
                                                                {caLam}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        )
                                    }

                                    }
                                    keyExtractor={(item, index) => index.toString()}
                                    renderHiddenItem={(data, rowMap) => <View
                                        style={styles.rowBack}>
                                        <TouchableOpacity
                                            activeOpacity={0.5}
                                            style={styles.backRightBtnLeft}
                                            onPress={() => this._XoaChiTietDoiCa(data.index)}
                                        >
                                            <Text style={{ color: '#FFF', fontSize: sizes.sText14 }}>{RootLang.lang.thongbaochung.xoa}</Text>
                                        </TouchableOpacity>

                                    </View>}
                                    leftOpenValue={75}
                                    rightOpenValue={-75}
                                    previewRowKey={listDon.length > 0 ? `${listDon[0].ngaylamviec}` : null}
                                    previewOpenValue={-30}
                                    previewOpenDelay={3000}
                                    ListEmptyComponent={this.renderListEmpty}
                                />
                            </ScrollView> : null}

                        <View style={{ backgroundColor: colors.white, paddingHorizontal: 10, paddingVertical: 15, borderRadius: 10, marginHorizontal: 10, marginTop: 5, flexDirection: 'row' }}>
                            <TouchableOpacity onPress={this._selectDate} style={{ width: Width(20), justifyContent: 'center', alignItems: 'center', paddingVertical: 10, borderWidth: 0.5, borderColor: colors.colorLineWrap, borderRadius: 5 }}>
                                {_dateDk == '' ? <Image source={Images.ImageJee.icAddDate} style={{ width: Width(3.6), height: Width(4) }} />
                                    :
                                    <Text style={{ fontSize: reText(14), color: colors.titleJeeHR }}>{moment(_dateDk, 'DD/MM/YYYY').format('ddd, DD/MM')}</Text>
                                }
                            </TouchableOpacity>
                            <Text style={{ color: colors.colorLineWrap, alignSelf: 'center' }}> - </Text>
                            <TouchableOpacity onPress={this._selectDate} style={{ width: Width(20), justifyContent: 'center', alignItems: 'center', paddingVertical: 10, borderWidth: 0.5, borderColor: colors.colorLineWrap, borderRadius: 5 }}>
                                {_dateKt == '' ? <Image source={Images.ImageJee.icAddDate} style={{ width: Width(3.6), height: Width(4) }} />
                                    :
                                    <Text style={{ fontSize: reText(14), color: colors.titleJeeHR }}>{moment(_dateKt, 'DD/MM/YYYY').format('ddd, DD/MM')}</Text>
                                }
                            </TouchableOpacity>
                            <View style={{ width: Width(14), justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: reText(14), color: this.state.caCurrent != '--' ? colors.checkGreen : colors.colorTitleJee, fontWeight: 'bold', alignSelf: 'center', marginLeft: Width(1), }}>{this.state.caCurrent}</Text>
                            </View>
                            <Image source={Images.ImageJee.icArrowRight} style={{ alignSelf: 'center', marginRight: Width(2) }} />
                            <TouchableOpacity onPress={this._DropDown} style={{ width: Width(20), justifyContent: 'center', paddingVertical: 10, borderWidth: 0.5, borderColor: colors.lightGreen, borderRadius: 5, flexDirection: 'row' }}>
                                {objectType.Title ?
                                    <Text style={{ fontSize: reText(14), color: colors.lightGreen, fontWeight: 'bold' }}>{objectType.Title}</Text>
                                    :
                                    <>
                                        <Text style={{ fontSize: reText(12), color: colors.lightGreen, fontWeight: 'bold', alignSelf: 'center' }}>{'Ca đổi'}</Text>
                                        <Image source={Images.ImageJee.icDropdownn} style={{ width: Width(2), height: Width(1.5), marginLeft: 2, tintColor: colors.lightGreen, alignSelf: 'center' }} />
                                    </>}
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.ThemDon} style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#DBEFE7', borderRadius: 9999, marginLeft: Width(2), width: Width(7), height: Width(7), alignSelf: 'center' }}>
                                <Image source={Images.ImageJee.icPlusJee} style={{}} />
                            </TouchableOpacity>
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

                    </Animated.View>
                </View>
                <IsLoading />
            </KeyboardAwareScrollView>
        )
    }
}
const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(ModalDoiCaLamViec, mapStateToProps, true)
const styles = StyleSheet.create({
    containerTab: {
        backgroundColor: colors.white,
        padding: 5,
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: colors.borderGray
    },
    tabStyle: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 15
    },
    tabLineActive: {
        paddingVertical: 1,
        width: '30%',
        marginTop: 15,
        borderRadius: 5
    },
    datePickStyle: {
        backgroundColor: colors.white,
        marginHorizontal: 15,
        marginVertical: 10,
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        ...nstyles.nrow,
        ...nstyles.shadow
    },
    rowBack: {
        flex: 1,
        ...nstyles.nrow,
        justifyContent: 'flex-end',

    },
    backRightBtn: {
        bottom: 0,
        ...nstyles.nmiddle,
        position: 'absolute',
        top: 0,
        width: 75,
    },
    backRightBtnLeft: {
        ...nstyles.nmiddle,
        backgroundColor: '#FF453B',
        width: 50,
        height: '100%',
        borderTopRightRadius: 10, borderBottomRightRadius: 10
    },
    backRightBtnRight: {
        ...nstyles.nmiddle,
        backgroundColor: colors.colorOrange,
        width: 75,
        height: '100%'
    },
})