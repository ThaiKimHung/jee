import { default as Moment, default as moment } from 'moment';
import React, { Component } from 'react';
import ReactNative, {
    Text,
    TextInput, TouchableOpacity, View, Image, Platform
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Get_ThoigianTinhCong } from '../../../apis/apiControllergeneral';
import { Get_DSCong, Get_XNBangCong, PostComment } from '../../../apis/apiTimesheets';
import { RootLang } from '../../../app/data/locales';
import { nGlobalKeys } from '../../../app/keys/globalKey';
import Utils from '../../../app/Utils';
import ButtonCom from '../../../components/Button/ButtonCom';
import HeaderComStack from '../../../components/HeaderComStack';
import IsLoading from '../../../components/IsLoading';
import { Images } from '../../../images';
import { colors } from '../../../styles/color';
import { fonts } from '../../../styles/font';
import { reSize, reText, sizes } from '../../../styles/size';
import { nstyles, nwidth, paddingBotX } from '../../../styles/styles';
import { TouchDropNewVer2, TouchDropBangChamCongThang, TouchDropNewXemChiTietNgayVaBangCong } from '../../../Component_old/itemcom/itemcom';
import CongNghiPhep from './CongNghiPhep';
import CongTangca from './CongTangca';
import CongTrongThang from './CongTrongThang';
import GhiChuChamCong from './GhiChuChamCong';
import { nkey } from '../../../app/keys/keyStore';
import UtilsApp from '../../../app/UtilsApp';
import { Width } from '../../../styles/styles';
import HeaderAnimationJee from '../../../components/HeaderAnimationJee';

class BangChamCongRoot extends Component {
    constructor(props) {
        super(props);
        this.state = {
            textGChu: '',
            data_ghichu: [],
            SongayTrongThang: {},
            data_nghiphep: [],
            SelectYear: Moment().year() + 1 + '',
            timemodalVisible: false,
            mothmodalVisible: false,
            refreshing: true,
            date: '',
            isEdit: false,
            SelectEdit: ''
        };
        this.showBangChamCong = this.showBangChamCong.bind(this);
        this.showDuLieuChamCong = this.showDuLieuChamCong.bind(this);

    }
    componentDidMount() {
        this._getNam();

    }

    ButtonXacNhanCong = () => {
        var { SongayTrongThang } = this.state
        return (
            <View style={{}}>
                <TouchableOpacity onPress={this._XNBangCong}
                    disabled={SongayTrongThang.IsConfirm == true ? true : false}
                    style={{
                        height: Width(13), borderRadius: 10, justifyContent: 'center', alignItems: 'center',
                        backgroundColor: SongayTrongThang.IsConfirm == false ? colors.textTabActive : colors.disableButton,
                    }}>
                    <Text style={{ fontSize: reSize(14), color: SongayTrongThang.IsConfirm == true ? colors.colorTextBack80 : colors.white, fontWeight: 'bold' }}>
                        {SongayTrongThang.IsConfirm == false ? RootLang.lang.scbangcong.xacnhancong : RootLang.lang.scbangcong.congdaxacnhan}
                    </Text>
                </TouchableOpacity>
            </View >
        )
    }

    _getDScong = async () => {
        nthisLoading.show();
        var { date, SongayTrongThang, data_nghiphep, data_ghichu } = this.state
        var value = `${moment(date, 'YYYY-MM').format('MM')}|${await Utils.ngetStorage(nkey.Id_nv, '')}|${moment(date, 'YYYY-MM').format('YYYY')}`;
        let res = await Get_DSCong(value);
        Utils.nlog("dữ liệu chấm công ", res);
        this.props.loadCTChamCong(res);
        if (res.status == 1) {
            if (res.error && res.error.message) {
                UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error && res.error.message ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
                return;
            }
            nthisLoading.hide();
            SongayTrongThang = res
            data_nghiphep = res.data_nghiphep
            data_ghichu = res.data_ghichu

        } else {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error && res.error.message ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
            SongayTrongThang = {}
            data_nghiphep = []
            data_ghichu = []
        }

        nthisLoading.hide();
        this.setState({ SongayTrongThang, data_nghiphep, data_ghichu, refreshing: false })

    }
    _getNam = async () => {
        let res1 = await Get_ThoigianTinhCong();
        let nam;
        Utils.nlog('Thời gian tinh cong', res1)
        if (res1.status == 1) {
            var { Nam, Thang } = res1;
            Thang = Thang < 10 ? '0' + Thang : '' + Thang;

            this.props.SetDateBangCong(`${Nam}-${Thang}`)//YYYY-MM
            this.setState({ date: `${Nam}-${Thang}` }, this._getDScong);
        }

    }
    _XNBangCong = async () => {
        nthisLoading.show();
        var { date } = this.state
        let res = await Get_XNBangCong(moment(date, 'YYYY-MM').format('MM'), moment(date, 'YYYY-MM').format('YYYY'))
        Utils.nlog('_XNBangCong', res, moment(date, 'YYYY-MM').format('MM'), moment(date, 'YYYY-MM').format('YYYY'))
        if (res.status == 1) {
            nthisLoading.hide();
            UtilsApp.MessageShow(RootLang.lang.thongbao, RootLang.lang.scbangcong.xacnhanbangchamcongthanhcong, 1)
            this.onRefresh()
            return this
        } else {
            nthisLoading.hide();
            UtilsApp.MessageShow(RootLang.lang.thongbao, res.error ? res.error.message : RootLang.lang.scbangcong.xacnhanbangchamcongthatbai, 2)
            return this
        }
    }

    _GuiComment = async () => {
        nthisLoading.show();
        var { textGChu, date, SongayTrongThang, data_ghichu, SelectEdit } = this.state;
        // if (SongayTrongThang.IsConfirm == true) {
        //     nthisLoading.hide();
        //     UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, 'Dữ liệu công tháng này đã được xử lý!', 3)
        //     this.IpGhiChu.clear();
        //     this.setState({ textGChu: '' })
        //     return this
        // } else {

        if (SelectEdit != '') {
            let res = await PostComment(SelectEdit.ID, moment(date, 'YYYY-MM').format('MM'), moment(date, 'YYYY-MM').format('YYYY'), textGChu)
            if (res.status == 1) {
                nthisLoading.hide();
                UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.scbangcong.guithanhcong, 1)
                this.onRefresh()
                this.IpGhiChu.clear();
                this._getDScong();
                this.setState({ textGChu: '', SelectEdit: '' })
                return this

            } else {
                nthisLoading.hide();
                UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.scbangcong.guighichuthatbai, 2)
            }
        }
        else {
            let res = await PostComment('', moment(date, 'YYYY-MM').format('MM'), moment(date, 'YYYY-MM').format('YYYY'), textGChu)
            if (res.status == 1) {
                nthisLoading.hide();
                UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.scbangcong.guithanhcong, 1)
                this.onRefresh()
                this.IpGhiChu.clear();
                this._getDScong();
                this.setState({ textGChu: '' })
                return this

            } else {
                nthisLoading.hide();
                UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.scbangcong.guighichuthatbai, 2)
            }
        }
        // }
    }
    showBangChamCong() {
        var { SongayTrongThang = {} } = this.state;
        var { data = [] } = SongayTrongThang;
        const { date } = this.state;
        Utils.goscreen(this, 'Modal_ModalNgayCongDangDung', {
            dataCong: data,
            month: moment(date, 'YYYY-MM').format('M'),

        })
    }

    showDuLieuChamCong() {
        const { date } = this.state;
        Utils.goscreen(
            this, 'Modal_ModalCongChiTiet', {
            isMonth: moment(date, 'YYYY-MM').month(),
            isTimeYear: moment(date, 'YYYY-MM').year(),
            title: RootLang.lang.scbangcong.chitietngay,
            type: 2
        })

    }


    onRefresh = () => {
        this._getDScong();
    }
    chooseMonthYear = () => {
        var { date } = this.state
        Utils.goscreen(this, 'Modal_MonthYearPicker', { MonthYear: date, _setMonthYear: this._setMonthYear })
    }

    _setMonthYear = (date) => {
        // Utils.nlog('date', date)
        this.props.SetDateBangCong(moment(date, 'YYYY-MM').format('YYYY-MM'))//YYYY-MM
        this.setState({ date: moment(date, 'YYYY-MM').format('YYYY-MM'), data_nghiphep: [] }, this._getDScong)
    }
    _setEditComment = (SelectEdit) => {
        Utils.nlog("gia tri foscus", this.IpGhiChu, SelectEdit)
        this.setState({ SelectEdit: SelectEdit, textGChu: SelectEdit.Noidung }, () => {
            this.IpGhiChu.focus()
        });
    }
    // _scrollToInput(reactNode: any) {

    //     // this.scroll.props.scrollToPosition(reactNode)
    // }
    render() {
        var { SongayTrongThang, date, data_ghichu, isEdit, SelectEdit } = this.state;
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: colors.backgroundColor }]}>
                {/* Header  */}
                <HeaderAnimationJee onPressLeft={() => { Utils.goback(this, null) }}

                    nthis={this} title={RootLang.lang.scbangcong.title} />
                {/* BODY */}
                <View >
                    <View style={{ paddingHorizontal: 15, marginTop: 10, }}>
                        <TouchDropBangChamCongThang
                            icon={Images.ImageJee.icProjectS}
                            value={date ? moment(date, 'YYYY-MM').format('MM/YYYY') : ''}
                            title={RootLang.lang.common.thang} _onPress={this.chooseMonthYear}
                            styText={{ color: colors.textTabActive, fontWeight: "800", fontSize: reText(16) }} />
                    </View>
                    <View style={{ marginTop: 15, marginBottom: 15, marginHorizontal: 15 }}>
                        <TouchDropNewXemChiTietNgayVaBangCong
                            title1={RootLang.lang.scbangcong.xemchitietngay}
                            title2={RootLang.lang.scbangcong.chitietbangcong}
                            _onPress1={this.showDuLieuChamCong}
                            _onPress2={this.showBangChamCong}
                        />
                    </View>
                </View>
                <KeyboardAwareScrollView keyboardShouldPersistTaps='handled' style={{ flex: 1, backgroundColor: colors.backgroundColor, paddingHorizontal: 15, paddingTop: 10 }}
                    showsVerticalScrollIndicator={false}>

                    <View style={{ flex: 1 }}>
                        <CongTrongThang SongayTrongThang={this.props.dsCTCong} />

                        {this.state.data_nghiphep.length > 0 ?
                            <CongNghiPhep data_nghiphep={this.state.data_nghiphep} /> : null}

                        <CongTangca SongayTrongThang={this.props.dsCTCong} />

                        {/* <View pointerEvents={SongayTrongThang.IsConfirm == true ? "none" : "auto"}
                            style={{ justifyContent: 'flex-end', marginBottom: 70 }} >
                            <View style={{ paddingVertical: 10, backgroundColor: colors.white, }}>
                                <TextInput

                                    placeholder={RootLang.lang.scbangcong.nhapnoidungghichu}
                                    multiline={true}
                                    textAlignVertical={"top"}
                                    ref={(ref) => { this.IpGhiChu = ref }}
                                    value={this.state.textGChu}
                                    style={[nstyles.ntextinput, { flex: 1, maxHeight: 150, height: 100 }]}
                                    onChangeText={(textGChu) => this.setState({ textGChu: textGChu })}
                                />
                            </View>
                            <View style={{ alignItems: 'center', paddingBottom: 30 }}>
                                <ButtonCom
                                    disabled={SongayTrongThang.IsConfirm == false && SelectEdit != '' || data_ghichu && data_ghichu.length == 0 ? false : true}
                                    onPress={this._GuiComment}
                                    text={RootLang.lang.scbangcong.guighichu}
                                    style={{
                                        backgroundColor: (SongayTrongThang.IsConfirm == false && SelectEdit != '') || data_ghichu && data_ghichu.length == 0 ? colors.colorButtomleft : colors.colorBtnGray,
                                        backgroundColor1: (SongayTrongThang.IsConfirm == false && SelectEdit != '') || data_ghichu && data_ghichu.length == 0 ? colors.colorButtomright : colors.colorBtnGray
                                        , marginTop: 15, width: nwidth * 0.4, fontSize: sizes.sText14,
                                        color: SongayTrongThang.IsConfirm == true ? colors.colorTextBack80 : colors.white,
                                    }}
                                />
                            </View>

                            <View style={[nstyles.nrow, {
                                paddingHorizontal: 15, paddingVertical: 10,
                                backgroundColor: colors.colorTabActive,
                                borderTopLeftRadius: 2, borderTopRightRadius: 2,
                            }]}>
                                <View style={{ flex: 6, }}>
                                    <Text style={{
                                        fontSize: sizes.sText14, lineHeight: sizes.sText16, fontFamily: fonts.Helvetica,
                                        color: colors.white
                                    }}>{RootLang.lang.scbangcong.noidung}</Text>
                                </View>
                                <View style={{ flex: 3 }}>
                                    <Text style={{
                                        fontSize: sizes.sText14, lineHeight: sizes.sText16, paddingLeft: 15,
                                        fontFamily: fonts.Helvetica, color: colors.white
                                    }}>{RootLang.lang.scbangcong.tinhtrang}</Text>
                                </View>
                            </View>
                            {
                                data_ghichu && data_ghichu.length > 0 ? <GhiChuChamCong data_ghichu={data_ghichu} onPressEdit={this._setEditComment} /> :
                                    <View style={{ backgroundColor: colors.white, paddingVertical: 10, width: '100%', paddingHorizontal: 15, marginBottom: paddingBotX + Width(13) }}>
                                        <Text style={{
                                            fontSize: sizes.sText12, lineHeight: sizes.sText16,
                                            fontFamily: fonts.Helvetica, color: colors.BackText
                                        }}>{RootLang.lang.scbangcong.khongcoghichu}</Text>
                                    </View>
                            }
                        </View> */}

                        <View style={{ backgroundColor: colors.white, paddingHorizontal: 10, paddingVertical: 15, marginBottom: 120 + paddingBotX, borderRadius: 10 }}>
                            <Text style={{ fontSize: reText(14), fontWeight: 'bold', color: colors.checkGreen }}>{RootLang.lang.scHomeSocial.comment}</Text>

                            <View style={{ marginTop: 10 }}>
                                {data_ghichu && data_ghichu.length > 0 ?
                                    data_ghichu.map(item => {
                                        return (
                                            <View style={{ flexDirection: 'row', marginTop: 5 }}>
                                                <Image source={item.Imagenv ? { uri: item.Imagenv } : Images.icAva} style={{ width: Width(8), height: Width(8), borderRadius: 99 }} resizeMode={'cover'} />
                                                <View>
                                                    <View style={{ backgroundColor: '#F2F1F6', paddingVertical: 10, paddingHorizontal: 10, width: Width(79), borderRadius: 5, marginLeft: Width(1) }}>
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <Text style={{ color: colors.blackJee, fontSize: reText(14), fontWeight: 'bold' }}>{item.tennv}</Text>
                                                            <Image source={item.IsProcessed ? Images.ImageJee.icBrowser : Images.ImageJee.ic_ChoDuyet} style={{ marginLeft: 5 }} />
                                                        </View>
                                                        <Text style={{ fontSize: reText(11), color: colors.blackJee }}>
                                                            {item.Noidung}
                                                        </Text>
                                                    </View>
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <Text style={{ fontSize: reText(11), color: colors.colorNoteJee, marginTop: 5 }}>
                                                            {moment(item.SendDate).format('DD/MM/YYYY HH:mm')}
                                                        </Text>
                                                        {data_ghichu && data_ghichu.length > 0 ?
                                                            <TouchableOpacity onPress={() => this._setEditComment(item)} style={{ marginLeft: 10, alignSelf: 'center', width: Width(20), marginTop: 5 }}>
                                                                <Text style={{ fontSize: reText(12), color: colors.black_60 }}>({RootLang.lang.scbangcong.sua})</Text>
                                                            </TouchableOpacity> : null}
                                                    </View>
                                                </View>
                                            </View>
                                        )
                                    })
                                    :
                                    <Text style={{ fontSize: reText(14), color: colors.colorNoteJee, fontWeight: 'bold', alignSelf: 'center' }}>{RootLang.lang.scbangcong.chuaconoidungbinhluan}</Text>
                                }
                                <View style={{ height: 0.5, width: '100%', backgroundColor: colors.colorLineJee, marginVertical: 15 }} />
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ paddingVertical: Platform.OS == 'ios' ? 10 : 0, backgroundColor: '#F2F1F6', width: Width(80), borderRadius: 15, paddingHorizontal: 10 }}>
                                        <TextInput
                                            placeholder={RootLang.lang.scbangcong.nhapnoidungbinhluan}
                                            ref={(ref) => { this.IpGhiChu = ref }}
                                            value={this.state.textGChu}
                                            style={{ flex: 1 }}
                                            onChangeText={(textGChu) => this.setState({ textGChu: textGChu })}
                                        />
                                    </View>
                                    <TouchableOpacity onPress={this._GuiComment} style={{ width: Width(10), justifyContent: 'center', alignItems: 'center' }}>
                                        <Image source={Images.ImageJee.icSend} style={{ width: Width(5), height: Width(5), tintColor: colors.checkGreen }} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                    {/* </ScrollView> */}
                </KeyboardAwareScrollView>
                <IsLoading />
                <View style={{ position: 'absolute', bottom: paddingBotX + 15, alignSelf: 'center', width: '100%', paddingHorizontal: 15 }}>
                    {this.ButtonXacNhanCong()}
                </View>
            </View >
        )
    }
}

const mapStateToProps = state => ({
    dsCTCong: state.dsCTCong,
    lang: state.changeLanguage.language
});

export default Utils.connectRedux(BangChamCongRoot, mapStateToProps, true)
