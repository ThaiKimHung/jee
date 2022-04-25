import React, { Component } from 'react';
import {
    Image, StyleSheet, Text,
    TextInput, TouchableOpacity, View
} from 'react-native';
import DatePicker from 'react-native-datepicker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AddNhanVien, getChucVu, getCoCau, getLoaiNhanVien, getNoiSinh, GenderCodeNhanVien } from '../../../apis/apiNhanVien';
import { RootLang } from '../../../app/data/locales';
import Utils from '../../../app/Utils';
import ButtonCom from '../../../components/Button/ButtonCom';
import IsLoading from '../../../components/IsLoading';
import { Images } from '../../../images/index';
import { TouchDropNew, TouchDropNewVer2, TouchTextInput } from '../../../Component_old/itemcom/itemcom';
import { colors } from '../../../styles/color';
import { reSize, reText, sizes } from '../../../styles/size';
import { nstyles } from '../../../styles/styles';
import _ from "lodash";
import moment from 'moment';
import * as Animatable from 'react-native-animatable';
import { nGlobalKeys } from '../../../app/keys/globalKey';
import UtilsApp from '../../../app/UtilsApp';


class ModalThemNhanVien extends Component {
    constructor(props) {
        super(props);

        this.state = {
            coCau: {},
            noiSinh: {},
            chucVu: {},
            loaiNhanVien: {},
            _dateLamViec: Utils.getGlobal(nGlobalKeys.TimeNow, '') ? moment(Utils.getGlobal(nGlobalKeys.TimeNow, '')).add(-7, "hours").format("DD/MM/YYYY") : moment(Date.now()).format("DD/MM/YYYY"),
            _dateNgaySinh: '',
            maNhanVien: '',
            maChamCong: null,
            hoVaTen: '',
            listNoiSinh: [],
            listLoaiNhanVien: [],
            listCoCau: [],
            listChildCoCcau: [],
            listChucVu: [],
            gioiTinh: {},
            listGioiTinh: [],
            noiSinhEmpty: true,
            coCauEmpty: true,
            chucVuEmpty: true,
            loaiNhanVienEmpty: true,
            _dateLamViecEmpty: true,
            _dateNgaySinhEmpty: true,
            maNhanVienEmpty: true,
            hoVaTenEmpty: true,
            gioiTinhEmpty: true,

        }
        Utils.setGlobal("Select", null)

    }
    componentDidMount() {
        this._getListCoCau()
        this._getListNoiSinh()
        this._getLoaiNhanVien()
        this._getListGioiTinh()

    }



    _genderMaNhanVien = async () => {
        var { _dateLamViec, coCau,
        } = this.state

        var body = {
            "ID": coCau ? coCau.RowID : "",
            "Date": _dateLamViec,
            "Type": 20,
        }

        const res = await GenderCodeNhanVien(body)
        // Utils.nlog('res GenderCodeNhanVien ', res)
        if (res.status == 1) {
            this.setState({
                maNhanVien: res.data
            })
        }
        else this.setState({
            maNhanVien
        })
    }

    _getListCoCau = async () => {
        const res = await getCoCau();
        // Utils.nlog('res getCoCau', res)
        if (res.status == 1) {
            this.setState({
                listCoCau: res.data,
            })

        } else {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
        }
    }

    _CoCau = () => {
        Utils.goscreen(this.props.nthis, 'Modal_ComponentSelectTree', { callback: this._callbackCoCau, item: this.state.coCau, AllThaoTac: this.state.listCoCau, ViewItem: null })
    }
    _callbackCoCau = (coCau) => {
        try {
            this.setState({ coCau, chucVu: {}, coCauEmpty: true }, _.isEmpty(this.state._dateLamViec) == false ? () => {
                this._genderMaNhanVien()
            } : null


            );
            this._getListChucVu(coCau.RowID)
        } catch (error) {
        }
    }

    _getListChucVu = async (RowID) => {
        const res = await getChucVu(RowID);
        // Utils.nlog('res getChucVu', res)
        if (res.status == 1) {
            this.setState({
                listChucVu: res.data,
            })
        }
        else {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
        }

    }
    ViewItemChucVu = (item) => {
        return (
            <View key={item.ID.toString()} >
                <Text style={{
                    textAlign: "center", fontSize: sizes.sText16,
                    color: this.state.chucVu.ID == item.ID ? colors.textblack : colors.colorTextBTGray,
                    fontWeight: this.state.chucVu.ID == item.ID ? "bold" : 'normal'
                }}>{item.Title ? item.Title : ""}</Text>
            </View>
        )
    }
    _ChucVu = () => {

        Utils.goscreen(this.props.nthis, 'Modal_ComponentSelectCom', { callback: this._callbackChucVu, item: this.state.chucVu, AllThaoTac: this.state.listChucVu, ViewItem: this.ViewItemChucVu })
    }

    _callbackChucVu = (chucVu) => {
        try {
            this.setState({ chucVu, chucVuEmpty: true });
        } catch (error) {

        }
    }


    _getLoaiNhanVien = async () => {
        const res = await getLoaiNhanVien();
        // Utils.nlog('res getLoaiNhanVien', res)
        if (res.status == 1) {
            this.setState({
                listLoaiNhanVien: res.data,
            });
        } else {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
        }
    }
    ViewItemLoaiNhanVien = (item) => {
        return (
            <View key={item.id_row.toString()} >
                <Text style={{
                    textAlign: "center", fontSize: sizes.sText16,
                    color: this.state.loaiNhanVien.id_row == item.id_row ? colors.textblack : colors.colorTextBTGray,
                    fontWeight: this.state.loaiNhanVien.id_row == item.id_row ? "bold" : 'normal'
                }}>{item.Title ? item.Title : ""}</Text>
            </View>
        )
    }
    _LoaiNhanVien = () => {
        Utils.goscreen(this.props.nthis, 'Modal_ComponentSelectCom', { callback: this._callbackLoaiNhanVien, item: this.state.loaiNhanVien, AllThaoTac: this.state.listLoaiNhanVien, ViewItem: this.ViewItemLoaiNhanVien })
    }
    _callbackLoaiNhanVien = (loaiNhanVien) => {
        try {
            this.setState({ loaiNhanVien, loaiNhanVienEmpty: true });
        } catch (error) {
        }
    }

    _selectDateVaoLam = () => {
        var { _dateLamViec } = this.state;
        Utils.goscreen(this.props.nthis, "Modal_CalandaSingalCom", {
            date: _dateLamViec,
            setTimeFC: this._SetNgayThang

        })
    }
    _SetNgayThang = (_dateLamViec) => {
        this.setState({ _dateLamViec: _dateLamViec, _dateLamViecEmpty: true },
            _.isEmpty(this.state.coCau) == false ? () => {
                this._genderMaNhanVien()
            } : null
        )
    }


    _getListGioiTinh = async () => {
        this.setState({
            listGioiTinh: [
                { sex: "Nam", row: 0 },
                { sex: "Nữ", row: 1 }

            ],
        })
    }

    ViewItemGioiTinh = (item) => {
        return (
            <View key={item.row.toString()} >
                <Text style={{
                    textAlign: "center", fontSize: sizes.sText16,
                    color: this.state.gioiTinh.row == item.row ? colors.textblack : colors.colorTextBTGray,
                    fontWeight: this.state.gioiTinh.row == item.row ? "bold" : 'normal'
                }}>{item.sex ? item.sex : ""}</Text>
            </View>
        )
    }
    _GioiTinh = () => {
        Utils.goscreen(this.props.nthis, 'Modal_ComponentSelectCom', { callback: this._callbackGioiTinh, item: this.state.gioiTinh, AllThaoTac: this.state.listGioiTinh, ViewItem: this.ViewItemGioiTinh })
    }
    _callbackGioiTinh = (gioiTinh) => {
        try {
            this.setState({ gioiTinh, gioiTinhEmpty: true });
        } catch (error) {

        }
    }

    _getListNoiSinh = async () => {
        const res = await getNoiSinh();
        // Utils.nlog('res getNoiSinh', res)
        if (res.status == 1) {
            this.setState({
                listNoiSinh: res.data,
            })
        } else {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
        }
    }

    ViewItemNoiSinh = (item) => {
        return (
            <View key={item.id_row.toString()} >
                <Text style={{
                    textAlign: "center", fontSize: sizes.sText16,
                    color: this.state.noiSinh.id_row == item.id_row ? colors.textblack : colors.colorTextBTGray,
                    fontWeight: this.state.noiSinh.id_row == item.id_row ? "bold" : 'normal'
                }}>{item.Province ? item.Province : ""}</Text>
            </View>
        )
    }
    _NoiSinh = () => {
        Utils.goscreen(this.props.nthis, 'Modal_ComponentSelectCom',
            {
                callback: this._callbackNoiSinh, item: this.state.noiSinh,
                AllThaoTac: this.state.listNoiSinh,
                ViewItem: this.ViewItemNoiSinh,
                key: 'Province',
                height: 80, search: true,
                minHeight: "85%"
            })
    }
    _callbackNoiSinh = (noiSinh) => {
        try {
            this.setState({ noiSinh, noiSinhEmpty: true });
        } catch (error) {

        }
    }


    _ThemNhanVien = async () => {
        var { _dateLamViec, noiSinh, loaiNhanVien, coCau, chucVu,
            maNhanVien, maChamCong, hoVaTen, _dateNgaySinh, gioiTinh
        } = this.state


        if (noiSinh.id_row == '' || noiSinh.id_row == null) {
            this.setState({ noiSinhEmpty: false })
        }
        if (_dateNgaySinh == '' || _dateNgaySinh == null) {
            this.setState({ _dateNgaySinhEmpty: false })
        }
        if (gioiTinh.sex == '' || gioiTinh.sex == null) {
            this.setState({ gioiTinhEmpty: false })
        }
        if (hoVaTen == '' || hoVaTen == null) {
            this.setState({ hoVaTenEmpty: false })
        }
        if (maNhanVien == '' || maNhanVien == null) {
            this.setState({ maNhanVienEmpty: false })
        }
        if (_dateLamViec == null || _dateLamViec == '') {
            this.setState({ _dateLamViecEmpty: false })
        }
        if (loaiNhanVien.id_row == null || loaiNhanVien.id_row == '') {
            this.setState({ loaiNhanVienEmpty: false })
        }
        if (chucVu.ID == null || chucVu.ID == '') {
            this.setState({ chucVuEmpty: false })
        }

        if (coCau.RowID == null || coCau.RowID == '') {
            this.setState({ coCauEmpty: false })
        }

        if (parseInt(moment(Date().now).format("YYYY")) - parseInt(_dateNgaySinh.slice(-4)) < 18) {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.scQuanLyNhanVien.nhanvienkhongdungdotuoilaodong, 3)
        }


        var body = {
            "MaNV": maNhanVien,
            "SoThe": maChamCong,
            "HoTen": hoVaTen,
            "GioiTinh": gioiTinh.sex,
            "NgaySinh": _dateNgaySinh.replace(/-/g, "/"),
            "ID_NoiSinh": noiSinh.id_row,
            "ID_LoaiNhanVien": loaiNhanVien.id_row,
            "NgayBatDau": _dateLamViec,
            "ID_ChucVu": chucVu.ID,
            "StructureID": coCau.RowID
        }
        const res = await AddNhanVien(body);
        if (res.status == 1) {
            Utils.showMsgBoxOK(this.props.nthis, RootLang.lang.thongbaochung.thongbao, RootLang.lang.scQuanLyNhanVien.themnhanvienthanhcong, RootLang.lang.thongbaochung.xacnhan, () => {
                this.setState({
                    coCau: {},
                    noiSinh: {},
                    chucVu: {},
                    loaiNhanVien: {},
                    _dateLamViec: '',
                    _dateNgaySinh: '',
                    maNhanVien: '',
                    maChamCong: null,
                    hoVaTen: '',
                    gioiTinh: {},
                    countTemp: 0
                })
            }, Utils.setGlobal("Select", null))
        }
        else
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
    }

    render() {
        var { _dateLamViec, noiSinh, loaiNhanVien, coCau, chucVu,
            maNhanVien, maChamCong, hoVaTen, gioiTinh, _dateNgaySinh
        } = this.state
        const {
            noiSinhEmpty,
            coCauEmpty,
            chucVuEmpty,
            loaiNhanVienEmpty,
            _dateLamViecEmpty,
            _dateNgaySinhEmpty,
            maNhanVienEmpty,
            hoVaTenEmpty,
            gioiTinhEmpty } = this.state
        return (
            <View style={{ flex: 1, backgroundColor: colors.backgroundColor }}>
                <KeyboardAwareScrollView
                    extraHeight={150}
                    keyboardDismissMode='on-drag'
                    showsVerticalScrollIndicator={false}
                    style={{ flex: 1, paddingHorizontal: 15, paddingVertical: 10, height: 'auto' }}>
                    <Animatable.View animation={coCauEmpty == false ? 'jello' : null} >
                        <TouchDropNew
                            title={RootLang.lang.scQuanLyNhanVien.phongbanbophan}
                            value={coCau.Title}
                            required={true}
                            styView={{ marginVertical: 5, borderColor: coCauEmpty == false ? colors.redFresh : null, borderWidth: coCauEmpty == false ? 1.5 : 0 }}
                            _onPress={this._CoCau} />
                    </Animatable.View>
                    <Animatable.View animation={chucVuEmpty == false ? 'jello' : null}>
                        <TouchDropNew value={chucVu.Title}
                            styView={{ marginVertical: 5, borderColor: chucVuEmpty == false ? colors.redFresh : null, borderWidth: chucVuEmpty == false ? 1.5 : 0 }}
                            title={RootLang.lang.scQuanLyNhanVien.chucvu}
                            required={true}
                            _onPress={this._ChucVu} />
                    </Animatable.View>
                    <Animatable.View animation={loaiNhanVienEmpty == false ? 'jello' : null}>
                        <TouchDropNew value={loaiNhanVien.Title}
                            styView={{ marginVertical: 5, borderColor: loaiNhanVienEmpty == false ? colors.redFresh : null, borderWidth: loaiNhanVienEmpty == false ? 1.5 : 0 }}
                            title={RootLang.lang.scQuanLyNhanVien.loainhanvien}
                            required={true}
                            _onPress={this._LoaiNhanVien} />
                    </Animatable.View>
                    <Animatable.View animation={_dateLamViecEmpty == false ? 'jello' : null}>
                        <TouchDropNewVer2
                            styText={{ color: colors.textTabActive, fontWeight: "800", fontSize: reText(16) }}
                            icon={Images.icCalandaS}
                            styView={{ marginVertical: 5, borderColor: _dateLamViecEmpty == false ? colors.redFresh : null, borderWidth: _dateLamViecEmpty == false ? 1.5 : 0 }}
                            title={RootLang.lang.scQuanLyNhanVien.ngayvaolam}
                            required={true}
                            _onPress={() => this._selectDateVaoLam()}
                            value={_dateLamViec ? _dateLamViec : ''}
                        />
                    </Animatable.View>

                    <TouchTextInput
                        styView={{ marginVertical: 5 }}
                        textInput={
                            <TextInput
                                editable={false}
                                style={styles.textInput}
                                placeholder={RootLang.lang.scQuanLyNhanVien.manhanvien}
                                placeholderTextColor={colors.colorPlayhoder}
                                onChangeText={(maNhanVien) => this.setState({ maNhanVien })}
                                ref={ref => maNhanVien = ref}
                            >
                                {maNhanVien}
                            </TextInput>
                        }
                        required={true}
                    />
                    <TouchTextInput
                        textInput={
                            <TextInput
                                style={styles.textInput}
                                placeholder={RootLang.lang.scQuanLyNhanVien.machamcong}
                                placeholderTextColor={colors.colorPlayhoder}
                                onChangeText={(maChamCong) => this.setState({ maChamCong })}
                                ref={ref => maChamCong = ref}
                            >
                                {maChamCong}
                            </TextInput>
                        }
                        required={false}
                    />
                    <Animatable.View animation={hoVaTenEmpty == false ? 'jello' : null} style={{}}>
                        <TouchTextInput
                            styView={{ marginVertical: 5, borderColor: hoVaTenEmpty == false ? colors.redFresh : null, borderWidth: hoVaTenEmpty == false ? 1.5 : 0 }}
                            textInput={
                                <TextInput
                                    style={styles.textInput}
                                    placeholder={RootLang.lang.scQuanLyNhanVien.hovaten}
                                    placeholderTextColor={colors.colorPlayhoder}
                                    onChangeText={(hoVaTen) => this.setState({ hoVaTen, hoVaTenEmpty: true })}
                                    ref={ref => hoVaTen = ref}
                                >
                                    {hoVaTen}
                                </TextInput>
                            }
                            required={true}
                        />
                    </Animatable.View >
                    <Animatable.View animation={gioiTinhEmpty == false ? 'jello' : null}>
                        <TouchDropNew
                            value={gioiTinh.sex}
                            styView={{ marginVertical: 5, borderColor: gioiTinhEmpty == false ? colors.redFresh : null, borderWidth: gioiTinhEmpty == false ? 1.5 : 0 }}
                            title={RootLang.lang.scQuanLyNhanVien.gioitinh}
                            required={true}
                            _onPress={this._GioiTinh} />
                    </Animatable.View>
                    <Animatable.View animation={_dateNgaySinhEmpty == false ? 'jello' : null}>
                        <TouchTextInput
                            styView={{ marginVertical: 5, borderColor: _dateNgaySinhEmpty == false ? colors.redFresh : null, borderWidth: _dateNgaySinhEmpty == false ? 1.5 : 0 }}
                            textInput={

                                <View style={{ flexDirection: "row" }}>
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder={RootLang.lang.scQuanLyNhanVien.ngaysinh}
                                        placeholderTextColor={colors.colorPlayhoder}
                                        onChangeText={(_dateNgaySinh) => this.setState({ _dateNgaySinh, _dateNgaySinhEmpty: true })}
                                        ref={ref => _dateNgaySinh = ref}
                                    >
                                        {_dateNgaySinh}
                                    </TextInput>

                                    <TouchableOpacity style={{ position: "absolute", alignSelf: "center", marginLeft: "91%" }}
                                        onPress={() => this.datePickerRef.onPressDate()}>
                                        <Image source={Images.icCalandaS} style={[nstyles.nIcon20, {}]} />
                                    </TouchableOpacity>
                                    <View>
                                        <DatePicker
                                            showIcon={false}
                                            hideText={true}
                                            ref={(ref) => this.datePickerRef = ref}
                                            locale={this.props.lang == 'en' ? 'en' : 'vi'}
                                            date={_dateNgaySinh}
                                            mode="date"
                                            format="DD/MM/YYYY"
                                            confirmBtnText={RootLang.lang.scQuanLyNhanVien.xacnhan}
                                            cancelBtnText={RootLang.lang.scQuanLyNhanVien.huy}
                                            androidMode={'spinner'}
                                            iconSource={null}
                                            allowFontScaling={false}
                                            customStyles={{
                                                datePicker: {
                                                    backgroundColor: '#d1d3d8',
                                                    justifyContent: "center"
                                                },
                                                dateInput: {
                                                    borderColor: colors.white,
                                                    backgroundColor: colors.white,
                                                },

                                            }}
                                            onDateChange={(date) => { this.setState({ _dateNgaySinh: date, _dateNgaySinhEmpty: true }) }}
                                        />
                                    </View>
                                </View>
                            }
                            required={true}
                        />
                    </Animatable.View>
                    <Animatable.View animation={noiSinhEmpty == false ? 'jello' : null}>
                        <TouchDropNew
                            value={noiSinh.Province}
                            styView={{ marginVertical: 5, borderColor: noiSinhEmpty == false ? colors.redFresh : null, borderWidth: noiSinhEmpty == false ? 1.5 : 0 }}
                            title={RootLang.lang.scQuanLyNhanVien.noisinh}
                            required={true}
                            _onPress={this._NoiSinh} />
                    </Animatable.View>
                    <ButtonCom
                        text={RootLang.lang.scQuanLyNhanVien.themnhanvien}
                        style={{
                            width: reSize(160), marginTop: 20, marginBottom: 30,
                            alignItems: "center", justifyContent: "center", alignSelf: "center",
                            backgroundColor: colors.colorButtomleft,
                            backgroundColor1: colors.colorButtomright,
                        }}
                        onPress={() => this._ThemNhanVien()} />
                </KeyboardAwareScrollView>
                <IsLoading></IsLoading>
            </View>
        )
    }
}
const mapStateToProps = state => ({
    lang: state.changeLanguage.language,
});
const styles = StyleSheet.create({
    contentInput: {
        fontWeight: '600',
        backgroundColor: 'transparent',
        color: colors.black_80,
    },
    textThongbao: {
        color: colors.black_20,
        fontSize: sizes.sText18,
        fontWeight: '600'
    },
    textInput: {
        margin: 2,
        paddingHorizontal: 20,
        width: '100%',
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
        paddingVertical: 15, backgroundColor: colors.white,
    }
});
export default Utils.connectRedux(ModalThemNhanVien, mapStateToProps, true)
