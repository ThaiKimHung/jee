import moment from 'moment';
import Moment from 'moment';
import React, { Component } from 'react';
import {
    Image,
    RefreshControl, ScrollView, Text, TouchableOpacity, View
} from 'react-native';
import { GetDSBangLuong, InPhieuLuong_App } from '../../../apis/apiBangLuong';
import { Get_ThoigianTinhCong } from '../../../apis/apiControllergeneral';
import { RootLang } from '../../../app/data/locales';
import { nGlobalKeys } from '../../../app/keys/globalKey';
import Utils from '../../../app/Utils';
import HeaderComStack from '../../../components/HeaderComStack';
import IsLoading from '../../../components/IsLoading';
import { Images } from '../../../images/index';
import { fonts } from '../../../styles';
import { colors } from '../../../styles/color';
import { reText, sizes } from '../../../styles/size';
import { nstyles } from '../../../styles/styles';
import { TouchDropNew, TouchDropNewVer2, TouchDropNewLichBangLuong } from '../../../Component_old/itemcom/itemcom';
import WebViewCus from '../../../Component_old/WebViewCus';
import UtilsApp from '../../../app/UtilsApp';
import HeaderAnimationJee from '../../../components/HeaderAnimationJee';

if (Platform.OS === 'android') { // only android needs polyfill
    require('intl'); // import intl object
    require('intl/locale-data/jsonp/en-US'); // load the required locale details
    require('intl/locale-data/jsonp/vi-VN'); // load the required locale details
}
class BangLuongChiTiet extends Component {
    constructor(props) {
        super(props);
        this.refLoading = React.createRef()
        this.state = {
            listNam: [],
            SelectThang: Moment(new Date()),
            DSLuong: [],
            dataLuong: [],
            dataThuNhapThem: [],
            dataTruLuong: [],
            data: '',
            refreshing: true,
            date: '2021-1',
            listDSBangLuong: [],
            loaiBangluong: []

        };
    }
    async componentDidMount() {
        await this._getThangTinhCong()

    }

    _getBangLuong = async (Nam, Thang, ID) => {
        let res = await InPhieuLuong_App(Nam, Thang, ID)
        // Utils.nlog('res InPhieuLuong_App', res)
        if (res.status == 1) {
            var { data = '' } = res;
            if (data) {

                this.setState({ data, refreshing: false })
            } else {
                this.setState({ refreshing: false, data: '' })
                UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.scbangluong.khongcobangluong, 3)
            }
        } else {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 3)
            this.setState({ refreshing: false, data: '' })

        }
    }


    _getDSBangLuong = async (Nam, Thang) => {
        this.refLoading.current.show()
        let res = await GetDSBangLuong(Nam, Thang);
        Utils.nlog('res GetDSBangLuong', res)
        if (res.status == 1) {
            if (res.data.length > 0) {
                this.refLoading.current.hide()
                this.setState({ listDSBangLuong: res.data }, () => {
                    res.data.length == 1 ? this._getBangLuong(Nam, Thang, res.data[0].RowID) : null
                })
            }
            else {
                this.setState({ refreshing: false, data: '', listDSBangLuong: [] })
                UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.scbangluong.khongcobangluong, 3)
                this.refLoading.current.hide()

            }
        }
        else {
            this.refLoading.current.hide()
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
        }
    }



    _getThangTinhCong = async () => {
        this.refLoading.current.show()
        let res = await Get_ThoigianTinhCong();
        // Utils.nlog('res Get_ThoigianTinhCong', res)
        if (res.status == 1) {
            this.refLoading.current.hide()
            this.setState({ date: String(res.Nam) + "-" + String(res.Thang) }, () => { this._getDSBangLuong(res.Nam, res.Thang) })
        }
        else {
            this.refLoading.current.hide()
        }
    }
    onRefresh = () => {
        const { date, loaiBangluong } = this.state
        let thang = date.split("-").slice(1)
        let nam = date.split("-").slice(0, 1)
        this._getBangLuong(nam, thang, loaiBangluong.RowID);
        this.setState({ refreshing: true });
    }


    chooseMonthYear = () => {
        var { date } = this.state
        Utils.goscreen(this, 'Modal_MonthYearPicker', { MonthYear: date, _setMonthYear: this._setMonthYear })
    }

    _setMonthYear = (date) => {
        this.setState({ date: moment(date, 'YYYY-MM').format('YYYY-MM') }, () => {

            let thang = date.split("-").slice(1)
            let nam = date.split("-").slice(0, 1)
            this._getDSBangLuong(nam, thang)

        })
    }


    ViewItemLoaiBangLuong = (item) => {
        return (
            <View key={item.RowID.toString()} >
                <Text style={{
                    textAlign: "center", fontSize: sizes.sText16,
                    color: this.state.loaiBangluong.RowID == item.RowID ? colors.textblack : colors.colorTextBTGray,
                    fontWeight: this.state.loaiBangluong.RowID == item.RowID ? "bold" : 'normal'
                }}>{item.Title ? item.Title : ""}</Text>
            </View>
        )
    }

    _bangluong = () => {
        Utils.goscreen(this, 'Modal_ComponentSelectCom',
            {
                callback: this._callbackBangLuong, item: this.state.loaiBangluong, AllThaoTac: this.state.listDSBangLuong,
                ViewItem: this.ViewItemLoaiBangLuong
            })
    }

    _callbackBangLuong = (item) => {
        const { date } = this.state
        let thang = date.split("-").slice(1)
        let nam = date.split("-").slice(0, 1)
        this.setState({
            loaiBangluong: item
        }, () => {
            this._getBangLuong(nam, thang, item.RowID)
        })
    }

    render() {
        var { SelectThang, data, date, listDSBangLuong } = this.state
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: colors.backgroundColor }]}>
                {/* Header  */}
                <HeaderAnimationJee onPressLeft={() => { Utils.goback(this, null) }}
                    nthis={this} title={RootLang.lang.scbangluong.title} />
                {/* BODY */}
                <ScrollView
                    style={{ flex: 1, backgroundColor: colors.backgroundColor, paddingHorizontal: 15, marginTop: 5 }}
                    refreshControl={<RefreshControl
                        onRefresh={() => this.onRefresh()}
                        refreshing={this.state.refreshing}
                    />}
                    showsVerticalScrollIndicator={false}
                >



                    <View style={{}}>
                        <TouchDropNewLichBangLuong
                            disable={this.close}
                            icon1={Images.ImageJee.icCalendarS}
                            icon2={Images.ImageJee.icProjectS}
                            value1={moment(date, 'YYYY-MM').format("MM/YYYY")}
                            value2={listDSBangLuong.length == 1 ? listDSBangLuong[0].Title : ''}
                            title1={RootLang.lang.scbangluong.luongthang}
                            _onPress1={this.chooseMonthYear}
                            _onPress2={this._bangluong}
                            title2={RootLang.lang.scbangluong.bangluong}
                            styText={{}} />
                        {/* <TouchDropNew
                            title={RootLang.lang.scbangluong.chonbanluong}
                            value={listDSBangLuong.length == 1 ? listDSBangLuong[0].Title : ''}
                            // styView={{ marginVertical: 5, borderColor: coCauEmpty == false ? colors.redFresh : null, borderWidth: coCauEmpty == false ? 1.5 : 0 }}
                            _onPress={this._bangluong} /> */}
                    </View>


                    {data ?
                        <View style={{ backgroundColor: colors.backgroundWhite, paddingHorizontal: 10, paddingTop: -40, paddingBottom: 10, borderWidth: 0, borderRadius: 10, marginTop: 20, marginBottom: 60 }}>
                            <WebViewCus
                                style={{ marginTop: -15 }}
                                // scrollEnabled={false}
                                source={{ html: data }}
                            />
                        </View> :
                        <View style={{ flex: 1, marginTop: "50%", alignContent: "center", justifyContent: 'center', alignItems: 'center' }}>
                            <Image source={Images.icListEmpty} style={{ width: sizes.nImgSize200, height: sizes.nImgSize200 }} resizeMode={'cover'} />
                            <Text style={{ fontSize: sizes.sText16, color: colors.brownGreyTwo }}>{RootLang.lang.thongbaochung.khongcodulieu}</Text>
                        </View>
                    }

                </ScrollView>
                <IsLoading ref={this.refLoading} />
            </View>
        )
    }
}
const mapStateToProps = state => ({
    dsCTCong: state.dsCTCong,
    lang: state.changeLanguage.language
});

export default Utils.connectRedux(BangLuongChiTiet, mapStateToProps, true)