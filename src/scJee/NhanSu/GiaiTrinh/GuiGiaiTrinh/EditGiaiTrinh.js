import moment from 'moment';
import React, { Component } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, BackHandler } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Get_DSChiTietGiaiTrinh, Get_TenNguoiDuyet, GuiGiaiTrinh, HuyChiTietGiaiTrinh } from '../../../../apis/apiGiaiTrinh';
import { ROOTGlobal } from '../../../../app/data/dataGlobal';
import { RootLang } from '../../../../app/data/locales';
import Utils from '../../../../app/Utils';
import ButtonCom from '../../../../components/Button/ButtonCom';
import HeaderAnimationJee from '../../../../components/HeaderAnimationJee';
import { Images } from '../../../../images';
import { colors } from '../../../../styles';
import { reText, sizes } from '../../../../styles/size';
import { nstyles, paddingBotX, Width } from '../../../../styles/styles';
import { TouchDropNewVer2, TouchTextInput } from '../../../../Component_old/itemcom/itemcom';
import ItemGiaiTrinhGui from '../components/itemGiaiTrinhGui';
import DatePicker from 'react-native-datepicker';
import { Get_ThoigianTinhCong } from '../../../../apis/apiControllergeneral';
import IsLoading from '../../../../components/IsLoading';
import UtilsApp from '../../../../app/UtilsApp';

class EditGiaiTrinh extends Component {
    constructor(props) {
        super(props);
        this.date = moment(Utils.ngetParam(this, "date", '')).format("YYYY-MM")
        this.callBack = Utils.ngetParam(this, "callBack", () => { })
        this.close = Utils.ngetParam(this, "close")
        this.state = {
            tenNguoiDuyet: '',
            dataChitietGT: [],
            _page: 1,
            _allPage: 1,
            record: 10,
            refreshing: false,
            RowID: 0,
            ngayThem: moment(new Date()).format('YYYY-MM-DD'),
            Timestr: '',
            date: this.date != "Invalid date" ? this.date : '2021-1',
            checkEmpty: false,
        };
        ROOTGlobal.GTChamCong.getDSGTChiTiet = this._Get_DSChiTietGiaiTrinh;
    }
    async componentDidMount() {
        nthisLoading.show();
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this._backHandlerButton)
        this.date != "Invalid date" ? null : await this._getThangTinhCong()
        await this._Get_DSChiTietGiaiTrinh();
        await this._getTenNguoiDuyet()
    }
    componentWillUnmount() {
        this.backHandler.remove()
    }
    _backHandlerButton = () => {
        this._goback()
        return true
    }
    _goback = () => {
        Utils.goback(this)
    }

    _getThangTinhCong = async () => {
        let res = await Get_ThoigianTinhCong();
        // Utils.nlog('res Get_ThoigianTinhCong', res)
        if (res.status == 1) {
            // nthisLoading.hide();
            this.setState({ date: String(res.Nam) + "-" + String(res.Thang) })
        }
        else {
            // nthisLoading.hide();

        }
    }
    _Get_DSChiTietGiaiTrinh = async (date = this.state.date) => {
        let thang = date.split("-").slice(1)
        let nam = date.split("-").slice(0, 1)
        const res = await Get_DSChiTietGiaiTrinh(thang, nam);
        // Utils.nlog('res Get_DSChiTietGiaiTrinh', res)
        nthisLoading.show();
        if (res.status == 1) {
            nthisLoading.hide();
            this.setState({
                dataChitietGT: res.data,
                RowID: res.RowID,
                Timestr: res.Timestr,
                checkEmpty: true
            })
        }
        else {
            this.setState({
                dataChitietGT: [],
                RowID: 0,
                Timestr: '',
                checkEmpty: true
            })
            nthisLoading.hide();
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.thuchienthatbai, 2)
        }

    }
    _HuyChiTietGiaiTrinh = async (data) => {
        const { map, key } = this.state;
        const { item, index } = data;
        if (item.RowID != null) {
            Utils.showMsgBoxYesNo(this, RootLang.lang.thongbaochung.thongbao, RootLang.lang.scgiaitrinhchamcong.bancomuon_xoadon, RootLang.lang.thongbaochung.xacnhan, RootLang.lang.thongbaochung.thoat, async () => {
                const res = await HuyChiTietGiaiTrinh(item.RowID);
                if (res.status == 1) {
                    UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.thongbaochung.thuchienthanhcong, 1)
                    this._Get_DSChiTietGiaiTrinh();
                    map[key].closeRow()
                } else {
                    UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.thuchienthatbai, 2)
                    map[key].closeRow()
                }
            })
        } else {
            Utils.showMsgBoxYesNo(this, RootLang.lang.thongbaochung.thongbao, RootLang.lang.scgiaitrinhchamcong.bancomuon_xoadon, RootLang.lang.thongbaochung.xacnhan, RootLang.lang.thongbaochung.thoat, async () => {
                let { dataChitietGT = [] } = this.state;
                dataChitietGT.splice(index, 1)
                this.setState({ dataChitietGT }, () => {
                    if (index < dataChitietGT.length) {
                        map[key].closeRow()
                    }
                });
            },
                () => map[key].closeRow()
            )

        }


    }
    _getTenNguoiDuyet = async () => {
        let res = await Get_TenNguoiDuyet();
        if (Number.isInteger(res) && res < 0) {
            nthisIsLoading.hide();
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.thongbaochung.loimang, 4)
            return;
        };
        if (res.status == 1) {
            this.setState({ tenNguoiDuyet: res.NguoiDuyet })
        }
    }
    _guiGiaiTrinh = async () => {
        const { RowID,
            Timestr, dataChitietGT } = this.state
        if (dataChitietGT && dataChitietGT.length > 0) {
            var body = {
                RowID: RowID,
                TimeStr: Timestr
            }
            const res = await GuiGiaiTrinh(body);
            if (res.status == 1) {
                UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.thongbaochung.thuchienthanhcong, 1)
                if (ROOTGlobal.GTChamCong.getDSGT) {
                    ROOTGlobal.GTChamCong.getDSGT();
                    Utils.goback(this, null)
                }
                else Utils.goback(this, null)
            } else {
                UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
            }
        } else {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.scgiaitrinhchamcong.themchitietgiaitrinh, 3)
        }
    }
    renderListEmpty = () => {
        return (
            <View style={{ flex: 1, marginTop: "50%", alignItems: 'center' }}>

                <Image source={Images.icListEmpty} style={{ width: sizes.nImgSize200, height: sizes.nImgSize200 }} resizeMode={'cover'} />
                <Text style={{ fontSize: sizes.sText16, color: colors.brownGreyTwo }}>{RootLang.lang.thongbaochung.khongcodulieu}</Text>


            </View>
        )
    }

    chooseMonthYear = () => {
        var { date } = this.state
        Utils.goscreen(this, 'Modal_MonthYearPicker', { MonthYear: date, _setMonthYear: this._setMonthYear })
    }
    _setMonthYear = (date) => {
        this.setState({ date: moment(date, 'YYYY-MM').format('YYYY-MM') }, () => { this._Get_DSChiTietGiaiTrinh(date) })
        // this.date = moment(date, 'YYYY-MM').format('YYYY-MM')
    }

    render() {
        const { dataChitietGT = [], tenNguoiDuyet } = this.state;
        var { date, checkEmpty } = this.state
        // console.log("THIS.date:", this.date)
        return (
            <View style={[{ flex: 1, backgroundColor: colors.backgroudJeeHR, }]}>
                <HeaderAnimationJee nthis={this} title={RootLang.lang.scgiaitrinhchamcong.themdongiaitrinh}
                    onPressLeft={() => { this.callBack(), Utils.goback(this, null) }}
                />
                {/* <View style={{ marginHorizontal: 15 }}>
                    <TouchDropNewVer2
                        disable={this.close}
                        icon={Images.icCalandaS}
                        value={moment(date, 'YYYY-MM').format("MM/YYYY")}
                        title={RootLang.lang.scbangcong.guigiaitrinhchamcong} _onPress={this.chooseMonthYear}
                        styText={{ color: colors.textTabActive, fontWeight: "800", fontSize: reText(16) }} />

                </View> */}
                <View style={{ flexDirection: 'row', backgroundColor: colors.white, marginHorizontal: 10, marginTop: 5, paddingHorizontal: 15, paddingVertical: 10, borderRadius: 10, justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: reText(14), color: colors.colorNoteJee, alignSelf: 'center' }}>{RootLang.lang.scbangcong.guigiaitrinhchamcong}</Text>
                    <TouchableOpacity onPress={() => this.chooseMonthYear()} style={{ flexDirection: 'row', backgroundColor: '#E7F4EF', paddingVertical: 7, paddingHorizontal: 15, borderRadius: 5, alignSelf: 'center' }}>
                        <Text style={{ color: colors.checkGreen, fontWeight: 'bold', fontSize: reText(14), alignSelf: 'center' }}>{moment(date, 'YYYY-MM').format("MM/YYYY")}</Text>
                        <Image source={Images.ImageJee.icAddDate} style={{ marginLeft: 5, tintColor: colors.checkGreen, alignSelf: 'center' }} />
                    </TouchableOpacity>
                </View>
                <Text style={{ color: colors.colorTitleJee, fontSize: reText(14), paddingHorizontal: 20, marginTop: 25 }}>{RootLang.lang.thongbaochung.thongtingiaitrinh.toUpperCase()}</Text>
                <SwipeListView
                    style={{ flex: 1 }}
                    contentContainerStyle={dataChitietGT.length > 0 ? { paddingBottom: 150 + paddingBotX } : { flex: 1 }}
                    disableRightSwipe
                    showsVerticalScrollIndicator={false}
                    onRowOpen={(rowKey, rowMap) => this.setState({ key: rowKey, map: rowMap })}
                    data={dataChitietGT ? dataChitietGT : []}
                    // data={[]}
                    renderItem={data => (
                        <ItemGiaiTrinhGui item={data.item}
                            onPress={
                                data.item.RowID != null ? () => { } : () => Utils.goscreen(this, 'Modal_GiaiTrinh', {
                                    isAdd: true,
                                    RowID: this.state.RowID,
                                    item: data.item,
                                })
                            }
                        />

                    )}
                    keyExtractor={(item, index) => index.toString()}
                    renderHiddenItem={(data, rowMap) =>
                        <View
                            style={styles.rowBack}>
                            <TouchableOpacity
                                activeOpacity={0.5}
                                style={styles.backRightBtnLeft}
                                onPress={() => this._HuyChiTietGiaiTrinh(data)}
                            >
                                <Text style={{ color: '#FFF', fontSize: sizes.sText14 }}>{RootLang.lang.thongbaochung.xoa}</Text>
                            </TouchableOpacity>
                        </View>}
                    leftOpenValue={75}
                    rightOpenValue={-75}
                    previewRowKey={dataChitietGT.length > 0 ? `${dataChitietGT[0].RowID}` : null}
                    previewOpenValue={-30}
                    previewOpenDelay={3000}
                    ListEmptyComponent={checkEmpty ? this.renderListEmpty : null}
                />
                {dataChitietGT == null || dataChitietGT == "" ? null :
                    <View style={{
                        backgroundColor: colors.backgroudJeeHR, position: 'absolute', bottom: 0, left: 0, paddingBottom: 15 + paddingBotX,
                        margin: 0, width: Width(100), paddingTop: 15
                    }}>
                        <TouchableOpacity onPress={this._guiGiaiTrinh} style={styles.create} >
                            <Text style={{ fontSize: reText(14), color: colors.greenButtonJeeHR }}>{RootLang.lang.scgiaitrinhchamcong.gui}<Text style={{ fontWeight: 'bold' }}> {tenNguoiDuyet.toString()} </Text></Text>
                        </TouchableOpacity>
                    </View>
                }
                <TouchableOpacity onPress={() => Utils.goscreen(this, 'Modal_GiaiTrinh', {
                    isAdd: true,
                    RowID: this.state.RowID,
                    date: this.date != "Invalid date" ? this.date : date
                })} style={{
                    width: Width(12), height: Width(12), borderRadius: 9999, backgroundColor: colors.checkGreen,
                    justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: 100, right: 10, elevation: 5
                }}>
                    <Image source={Images.ImageJee.icAddgiaitrinh} />
                </TouchableOpacity>
                <IsLoading />
            </View>
        );
    }
}
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
        paddingTop: 10
    },
    tabLineActive: {
        paddingVertical: 1,
        width: '30%',
        marginTop: 10,
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
        ...nstyles.shadowButTon
    },
    rowBack: {
        flex: 1,
        ...nstyles.nrow,
        justifyContent: 'flex-end',
        marginRight: 15,
        marginTop: 8,
        borderRadius: 10,
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
        width: 75,
        height: '90%',
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
    },
    create: {
        borderRadius: 10, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', paddingVertical: 15,
        borderColor: colors.black_20, marginHorizontal: 10,
        backgroundColor: colors.white, width: Width(95)
    }
})

// export default EditGiaiTrinh;
const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(EditGiaiTrinh, mapStateToProps, true)
