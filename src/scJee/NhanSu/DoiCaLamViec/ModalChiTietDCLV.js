import moment from 'moment';
import React, { Component } from 'react';
import { Animated, BackHandler, Text, View, Image, TouchableOpacity } from 'react-native';
import { Del_ChangeShift, Get_ChangeShiftList } from '../../../apis/apiChangeshiftnv';
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import { RootLang } from '../../../app/data/locales';
import Utils from '../../../app/Utils';
import { colors, } from '../../../styles';
import { reText, sizes } from '../../../styles/size';
import { nHeight, nstyles, paddingBotX, Width } from '../../../styles/styles';
import UtilsApp from '../../../app/UtilsApp';
import { Images } from '../../../images';

class ModalChiTietDCLV extends Component {
    constructor(props) {
        super(props);
        this.refresh = Utils.ngetParam(this, 'refresh', () => { Utils.nlog('del') });
        this.state = {
            isVisible: true,
            RowID: Utils.ngetParam(this, "RowID", ''),
            opacity: new Animated.Value(0),
            item: {},
            isGoBak: Utils.ngetParam(this, "isGoBak", false),
            checkAPI: false
        }
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this._backHandlerButton)
        this._startAnimation(0.8)
        this._Get_ChangeShiftList();
    }

    componentWillUnmount() {
        this.backHandler.remove()
    }

    _goback = async () => {
        if (this.props.navigation.canGoBack()) {
            this._endAnimation(0)
            Utils.goback(this)
        }
        else {
            Utils.replace(this, 'sw_HomePage')
        }
    }

    _Get_ChangeShiftList = async (nextPage = 1) => {
        var { RowID } = this.state
        var { record,
        } = this.state;
        let res = await Get_ChangeShiftList(nextPage, record, RowID)
        if (res.status == 1 && res.data && res.data.length > 0) {
            this.setState({ item: res.data[0], checkAPI: true })
        } else {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
            this._endAnimation(0)
            Utils.goback(this);
        }
    }

    _DeteleDonPhep = async () => {
        Utils.showMsgBoxYesNo(this,
            RootLang.lang.thongbaochung.thongbao,
            RootLang.lang.thongbaochung.banmuonxoadonnay,
            RootLang.lang.thongbaochung.xacnhan,
            RootLang.lang.thongbaochung.thoat, async () => {
                var { RowID } = this.state.item
                const res = await Del_ChangeShift(RowID);
                if (res.status == 1) {
                    UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.thongbaochung.thuchienthanhcong, 1)
                    if (ROOTGlobal.QLDoiCa.refreshDSDoiCa) {
                        ROOTGlobal.QLDoiCa.refreshDSDoiCa();
                    }
                    this._endAnimation(0)
                    Utils.goback(this);
                } else {
                    UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.thuchienthatbai, 2)
                    this._endAnimation(0)
                    Utils.goback(this);
                }
            })
    }

    _startAnimation = (value) => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: value,
                duration: 300
            }).start();
        }, 400);
    };

    _backHandlerButton = () => {
        this._goback()
        return true
    }

    _endAnimation = (value) => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: value,
                duration: 1
            }).start();
        }, 1);
    };

    renderInfo = (item) => {
        let colorBg = item.Valid ? colors.bgGreen : item.Valid == false ? colors.bgRed : colors.bgYellow
        let colorText = item.Valid ? colors.checkGreen : item.Valid == false ? colors.checkCancle : colors.checkAwait
        let Icon = item.Valid ? Images.ImageJee.icBrowser : item.Valid == false ? Images.ImageJee.icUnBrowser : Images.ImageJee.ic_ChoDuyet
        let ngDuyet = item.NguoiDuyet ? item.NguoiDuyet : ''
        return (
            <View style={{ flexDirection: 'row', backgroundColor: colorBg, marginHorizontal: 10, paddingHorizontal: 10, paddingVertical: 15, borderRadius: 10, marginTop: 15 }}>
                <Image source={Icon} style={{ tintColor: item.Valid == null ? colors.checkAwait : null }} />
                {item.Valid ?
                    <Text style={{ fontSize: reText(13), color: colorText, marginLeft: 10, alignSelf: 'center', flex: 1 }}>
                        {RootLang.lang.thongbaochung.yeucauduocduyetvao} {item.NgayDuyet ? Utils.formatTimeAgo(moment(item.NgayDuyet, 'YYYY-MM-DD HH:mm:ssZ'), 1, true) : ''} {RootLang.lang.thongbaochung.boi} <Text style={{ fontWeight: 'bold' }}>{ngDuyet}</Text>
                    </Text> :
                    item.Valid == false ?
                        <Text style={{ fontSize: reText(13), color: colorText, marginLeft: 10, alignSelf: 'center', flex: 1 }}>
                            <Text style={{ fontWeight: 'bold' }}>{ngDuyet}</Text> {RootLang.lang.thongbaochung.datuchoiyeucauvao} {item.NgayDuyet ? Utils.formatTimeAgo(moment(item.NgayDuyet, 'YYYY-MM-DD HH:mm:ssZ'), 1, true) + '.' : ''} {item.ghichuduyet ? RootLang.lang.thongbaochung.lydo + ' ' + item.ghichuduyet : ''}
                        </Text> :
                        <Text style={{ fontSize: reText(13), color: colorText, marginLeft: 10, alignSelf: 'center', flex: 1 }}>
                            {RootLang.lang.thongbaochung.yeucaudangduocchopheduyet}
                        </Text>}
            </View>
        )
    }

    render() {
        const { item, data, opacity, checkAPI } = this.state
        return (
            <View style={{ flex: 1, backgroundColor: `transparent`, height: nHeight(100) }}>
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
                        <View style={{ flexDirection: 'row', paddingHorizontal: 15, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: reText(18), fontWeight: 'bold', color: colors.titleJeeHR }}>
                                {RootLang.lang.scdoicalamviec.chitietdoicalamviec}
                            </Text>
                        </View>
                        <Text style={{ alignSelf: 'center', fontSize: reText(12), color: colors.colorNoteJee, marginTop: 5 }}>
                            {item.NgayGui ? Utils.formatTimeAgo(moment(item.NgayGui, 'YYYY-MM-DD HH:mm:ssZ'), 1, true) : RootLang.lang.thongbaochung.chuacapnhat}
                        </Text>

                        {checkAPI ? this.renderInfo(item) : null}

                        <Text style={{ color: colors.colorTitleJee, fontSize: reText(14), paddingHorizontal: 20, marginTop: 25 }}>{RootLang.lang.thongbaochung.thongtindangky.toUpperCase()}</Text>
                        <View style={{ backgroundColor: colors.white, paddingHorizontal: 10, paddingVertical: 15, marginHorizontal: 10, borderRadius: 10, marginTop: 5 }}>
                            {item.Data ? item.Data.map((val, index) => {
                                let caLam = val.CaLamViec ? val.CaLamViec.split(' (', 1) : '---'
                                let caDoi = val.CaThayDoi ? val.CaThayDoi.split(' (', 1) : '---'
                                let colorText = item.Valid ? colors.checkGreen : item.Valid == false ? colors.checkCancle : colors.checkAwait
                                return (
                                    <>
                                        {
                                            index != 0 ? <View style={{ width: '100%', height: 0.5, backgroundColor: colors.colorLineJee, marginVertical: 15 }}></View> : null
                                        }
                                        <View style={{ flexDirection: 'row', }}>
                                            <Text style={{ fontSize: reText(14), color: colors.titleJeeHR, flex: 1 }}>
                                                {moment(val.NgayLamViec).format('ddd, DD/MM')} - {moment(val.ToDate).format('ddd, DD/MM')}
                                            </Text>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={{ fontSize: reText(14), color: colorText, fontWeight: 'bold' }}>
                                                    {caLam}
                                                </Text>
                                                <Image source={Images.ImageJee.icArrowRight} style={{ alignSelf: 'center', marginHorizontal: Width(2), tintColor: colorText }} />
                                                <Text style={{ fontSize: reText(14), color: colorText, fontWeight: 'bold' }}>
                                                    {caDoi}
                                                </Text>
                                            </View>
                                        </View>
                                    </>
                                )
                            }) : null}
                        </View>
                        <Text style={{ color: colors.colorTitleJee, fontSize: reText(14), paddingHorizontal: 20, marginTop: 25 }}>{RootLang.lang.thongbaochung.lydo.toUpperCase()}</Text>
                        <View style={{ backgroundColor: colors.white, paddingHorizontal: 10, paddingTop: 15, paddingBottom: 20, marginHorizontal: 10, borderRadius: 10, marginTop: 5 }}>
                            <Text style={{ fontSize: reText(14), color: colors.black }}>{item.LyDo ? item.LyDo : '---'}</Text>
                        </View>

                        <View style={{
                            width: '100%',
                            alignItems: 'center', marginTop: 40,
                            flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15,
                        }}>


                            <TouchableOpacity onPress={() => this._goback()} style={{ width: item.Valid == null ? '49%' : '100%', backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center', paddingVertical: 15, borderRadius: 10 }}>
                                <Text style={{ fontSize: reText(14), color: colors.checkAwait }}>{RootLang.lang.thongbaochung.dong}</Text>
                            </TouchableOpacity>
                            {
                                item.Valid == null ?
                                    <TouchableOpacity onPress={this._DeteleDonPhep} style={{ width: '49%', backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center', paddingVertical: 15, borderRadius: 10 }}>
                                        <Text style={{ fontSize: reText(14), color: colors.checkCancle, fontWeight: 'bold' }}>{RootLang.lang.thongbaochung.xoa}</Text>
                                    </TouchableOpacity>
                                    : null
                            }
                        </View>

                    </Animated.View>
                </View>
            </View >
        );
    }
}

// export default ModalChiTietNghiPhep;
const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(ModalChiTietDCLV, mapStateToProps, true)
