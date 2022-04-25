import moment, { months } from 'moment'
import React, { Component } from 'react'
import { ScrollView, Text, TextInput, View, StyleSheet, Image } from 'react-native'
import { getInfoNguoiDuyet, GuiDonXinThoiViec } from '../../../apis/apiThoiViec'
import { RootLang } from '../../../app/data/locales'
import Utils from '../../../app/Utils'
import UtilsApp from '../../../app/UtilsApp'
import HeaderComStack from '../../../components/HeaderComStack'
import IsLoading from '../../../components/IsLoading'
import { colors } from '../../../styles'
import { reSize, reText } from '../../../styles/size'
import { ButtomCustom, TouchTime } from '../../Component/itemcom/itemcom'
import { Images } from '../../../images';
import { Get_Info } from '../../../apis/searchemployee';
import HeaderAnimationJee from '../../../components/HeaderAnimationJee'

export class GuiDonThoiViec extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: new Date(),
            _dateDk: moment(new Date()).format('DD/MM/YYYY'),
            GhiChu: '',
            ngDuyet: '',
            Status: '', //Nếu =0 thì hiện nút, khác 0 thì ẩn,
            chitiet: Utils.ngetParam(this, 'chitiet', false),
            dataThoiViec: [],
            deeplink: Utils.ngetParam(this, 'deeplink', false), // true; không phải vào từ noti, false: vào từ noti
        }
        this.reLoad = Utils.ngetParam(this, 'reLoad')
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
            // this._getThoiGianLamViec();
        })
    }
    getInfoThoiViec = async () => {
        nthisLoading.show();
        let res = await Get_Info();
        // console.log('res getInfoThoiViec', res)
        if (res.status == 1) {
            nthisLoading.hide();
            this.setState({ dataThoiViec: res, chitiet: res.Status == 0 ? false : true })
        }
        else nthisLoading.hide();
    }

    _getNgDuyet = async () => {
        let res = await getInfoNguoiDuyet()
        // Utils.nlog('Giá trị khi get info', res);
        if (res.status == 1) {
            this.setState({ ngDuyet: res.NguoiDuyet, Status: res.Status })

        } else {
            this.setState({ ngDuyet: '' })
        }
    }

    _onRefresh = () => {
        this.setState({
            GhiChu: '',
        })
        Utils.goback(this);
    }

    _ConfirmThoiViec = async () => {
        Utils.showMsgBoxYesNo(this, RootLang.lang.thongbaochung.thongbao, RootLang.lang.thongbaochung.bancochacmuonthoivieckhong, RootLang.lang.thongbaochung.co, RootLang.lang.thongbaochung.khong, async () => await this._GuiDonThoiViec())
    }

    _GuiDonThoiViec = async () => {
        const { GhiChu, _dateDk } = this.state;
        let res = await GuiDonXinThoiViec(GhiChu, _dateDk);
        if (res.status == 1) {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.thongbaochung.thuchienthanhcong, 1)
            await this.reLoad()
            await this._onRefresh()
        } else {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.thongbaochung.thuchienthatbai, 2)
        }
    }

    componentDidMount() {
        this._getNgDuyet()
        this.getInfoThoiViec()

    }

    _goBack() {
        if (this.state.deeplink == true) {
            Utils.goback(this)
        }
        else {
            Utils.goscreen(this, 'sw_HomePage')
        }
    }

    Capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    render() {
        const { _dateDk, ngDuyet, Status, chitiet, dataThoiViec } = this.state;
        return (
            <View style={{ flex: 1, backgroundColor: colors.colorBGHome }}>
                <HeaderAnimationJee nthis={this} isGoBack={true} OnGoBack={() => this._goBack()} title={chitiet ? (RootLang.lang.scthongtincanhan.chitietdonxinthoiviec.toUpperCase()) : (RootLang.lang.scthoiviec.donxinthoiviec.toUpperCase())} />
                <ScrollView style={{ marginHorizontal: 15, paddingTop: 15 }}>
                    {chitiet == false ? (
                        <>
                            <TouchTime
                                isShow={false}
                                icon={''}
                                title={RootLang.lang.scthoiviec.ngaythoiviecdukien}
                                _onPress={() => this._selectDate()}
                                value={_dateDk ? _dateDk : ''}
                            />
                            <TextInput
                                multiline={true}
                                style={{ backgroundColor: colors.white, height: reSize(80), paddingHorizontal: 15, marginTop: 20 }}
                                placeholder={RootLang.lang.scthoiviec.nhapvaolydothoiviec}
                                placeholderTextColor={colors.black_20}
                                value={this.state.GhiChu}
                                textAlignVertical='top'
                                onChangeText={(text) => this.setState({ GhiChu: text })}
                            />
                            {Status && Status == 0 ?
                                <ButtomCustom
                                    onpress={this._ConfirmThoiViec}
                                    title={RootLang.lang.scthoiviec.gui + " " + ngDuyet}
                                    stColor={{ backgroundColor: colors.colorTabActive, width: 200, alignSelf: 'center', flex: 1, marginTop: 30 }}
                                /> :
                                <View style={{ backgroundColor: colors.black_5, paddingVertical: 14, borderRadius: 2, flex: 1, marginHorizontal: 70, marginTop: 30 }}>
                                    <Text style={{ color: colors.white, fontSize: reText(12), fontWeight: 'bold', alignSelf: 'center' }}>
                                        {RootLang.lang.scthoiviec.gui + " " + ngDuyet}</Text>
                                </View>}
                        </>
                    ) : (
                            <View style={styles.borderChiTiet}>
                                <View style={[styles.khungBorder]}>
                                    <View style={styles.row}>
                                        <Image source={Images.ImageJee.icClock} style={styles.icon20}></Image>
                                        <Text style={[styles.title]}>{RootLang.lang.scthoiviec.ngaynghi}</Text>
                                    </View>
                                    <Text style={[styles.data, { textAlign: 'right', flex: 1, }]}>{moment(dataThoiViec?.Ngay, 'MM/DD/YYYY HH:mm:ss').format('DD/MM/YYYY')}</Text>
                                </View >
                                <View style={[styles.khungBorder]}>
                                    <View style={styles.row}>
                                        <Image source={Images.ImageJee.icAccepter} style={styles.icon20}></Image>
                                        <Text style={[styles.title]}>{RootLang.lang.scphepthemdon.nguoiduyet}</Text>
                                    </View>
                                    <Text style={[styles.data, { textAlign: 'right', flex: 1, }]}  >{dataThoiViec.NguoiDuyet ? `${dataThoiViec.NguoiDuyet}`.toUpperCase() : ' -- '}</Text>
                                </View >

                                <View style={[styles.khungBorder]}>
                                    <View style={styles.row}>
                                        <Image source={Images.ImageJee.icNgayDuyet} style={styles.icon20}></Image>
                                        <Text style={[styles.title]}>{RootLang.lang.scphepthemdon.ngayduyet}</Text>
                                    </View>
                                    <Text style={[styles.data, { textAlign: 'right', flex: 1, }]}>{dataThoiViec.Status == 2 ? UtilsApp.convertTimeLocal(dataThoiViec?.KhungDuyet[0]?.CheckedDate, 'DD/MM/YYYY') : " -- "}</Text>
                                </View >
                                <View style={[styles.khungBorder]}>
                                    <View style={styles.row}>
                                        <Image source={Images.ImageJee.jwTinhTrang} style={styles.icon20}></Image>
                                        <Text style={[styles.title]}>{RootLang.lang.scthoiviec.tinhtrang}</Text>
                                    </View>
                                    <Text style={[styles.data, { textAlign: 'right', flex: 1, color: dataThoiViec.Status == 2 ? colors.textTabActive : colors.colorOrange }]}  >{dataThoiViec.Status == 2 ? 'Đã duyệt' : 'Chờ duyệt'}</Text>
                                </View >
                                {
                                    dataThoiViec.Status == 2 &&
                                    <View style={[styles.khungBorder]}>
                                        <View style={styles.row}>
                                            <Image source={Images.ImageJee.icOClock} style={styles.icon20}></Image>
                                            <Text style={[styles.title]}>{RootLang.lang.scphepthemdon.ghichu}</Text>
                                        </View>
                                        <Text style={[styles.data, { textAlign: 'right', flex: 1, }]}>{dataThoiViec.Status == 2 ? this.Capitalize(`${dataThoiViec?.KhungDuyet[0]?.CheckNote}`) : " -- "}</Text>
                                    </View >
                                }
                                <View style={[styles.khungLydo]}>
                                    <View style={styles.row}>
                                        <Image source={Images.ImageJee.ic_Lydo} style={styles.icon20}></Image>
                                        <Text style={[styles.title]}>{RootLang.lang.scphepthemdon.lydo}</Text>
                                    </View>
                                    <Text style={[styles.data, { flex: 1, paddingLeft: 25, paddingTop: 10 }]}>{this.Capitalize(`${dataThoiViec?.Lydo}`)}</Text>
                                </View >
                                <ButtomCustom
                                    onpress={() => { this._goBack() }}
                                    title={RootLang.lang.thongbaochung.xacnhan}
                                    stColor={{ backgroundColor: colors.colorTabActive, width: 200, alignSelf: 'center', flex: 1, marginTop: 30 }}
                                />
                            </View>
                        )}
                </ScrollView>
                <IsLoading />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    khungBorder: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', paddingVertical: 18, width: '100%',
        borderBottomWidth: 0.3, borderColor: colors.colorBrownGrey
    },
    khungLydo: {
        paddingVertical: 15, width: '100%'
    },
    row: {
        flexDirection: 'row'
    },
    icon18: {
        width: 18, height: 18, marginRight: 5
    },
    icon20: {
        width: 20, height: 20, marginRight: 5
    },
    title: {
        color: colors.grey,
        fontSize: reText(15),
    },
    data: {
        fontSize: reText(16),
        color: '#404040'
    },
    borderChiTiet: {
        backgroundColor: colors.white, padding: 10, borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.25,
        shadowRadius: 1,
        elevation: 5,
    }
})

export default GuiDonThoiViec
