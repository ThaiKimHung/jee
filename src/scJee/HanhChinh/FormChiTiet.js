import React, { Component, Fragment } from 'react';
import { Animated, BackHandler, ScrollView, Text, TouchableOpacity, View, Image, TextInput, StyleSheet, Switch, Platform, Modal } from 'react-native';
import { RootLang } from '../../app/data/locales';
import Utils from '../../app/Utils';
import UtilsApp from '../../app/UtilsApp';
import { Images } from '../../images';
import { colors, nstyles, sizes } from '../../styles';
import { reText } from '../../styles/size';
import { Height, Width } from '../../styles/styles';
import moment from 'moment'
import * as Animatable from 'react-native-animatable'
import { DatPhong_Detail, Delete_DatPhongHop } from '../../apis/JeePlatform/API_JeeHanhChanh/apiJeeHanhChanh';
import { nkey } from '../../app/keys/keyStore';

const RenderThongTin = (props) => {
    let { title, val, mau, bold, nguoiduyet, ngayduyet } = props
    return (
        <View style={{ flexDirection: 'row', paddingHorizontal: 20, marginTop: 8, flexWrap: 'wrap' }}>
            <Text>
                <Text style={{ color: colors.colorTitleNew, fontSize: reText(14), marginRight: 5, }}>{title}:</Text>
                <Text style={{ color: mau ? mau : colors.colorTitleNew, fontSize: reText(14), fontWeight: bold ? 'bold' : null }}> {val}</Text>
                {nguoiduyet ? <Text style={{ fontSize: reText(14) }}> <Text style={{ color: colors.black_50 }}>{RootLang.lang.thongbaochung.boi}</Text> <Text style={{ fontWeight: 'bold' }}>{nguoiduyet}</Text> <Text style={{ color: colors.black_50, fontStyle: 'italic' }}>{RootLang.lang.thongbaochung.vao} {ngayduyet} </Text></Text> : null}</Text>
        </View>
    )
}

export class FormChiTiet extends Component {
    constructor(props) {
        super(props);
        this.callback = Utils.ngetParam(this, 'callback');
        this.event = Utils.ngetParam(this, 'event');
        this.requestid = Utils.ngetParam(this, 'requestid', -1);
        // this.idUser = ''
        this.state = {
            textempty: RootLang.lang.thongbaochung.khongcodulieu,
            opacity: new Animated.Value(0),
            heightCus: new Animated.Value(Height(50)),
            lydo: '',
            showModal: false,
            idUser: '',
            dataChiTiet: {}
        }
    };

    _goback = () => {
        this._endAnimation(0)
        this.requestid == -1 ? Utils.goback(this, null) : Utils.goscreen(this, 'sw_HomePage')
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
    async componentDidMount() {
        this.GetChiTiet()
        let id = await Utils.ngetStorage(nkey.UserId, '')
        this.handlerBack = BackHandler.addEventListener('hardwareBackPress', this._handlerBackButton)
        this._startAnimation(0.8)
        this.setState({ idUser: id })
    }

    componentWillUnmount() {
        this.handlerBack.remove()
    }
    _handlerBackButton = () => {
        this.requestid == -1 ? Utils.goback(this, null) : Utils.goscreen(this, 'sw_HomePage')
        return true
    }

    GetChiTiet = async () => {
        let res = await DatPhong_Detail(this.requestid != -1 ? this.requestid : this.event.requestid)
        console.log("DatPhong_Detail:", res)
        if (res.status == 1) {
            this.setState({ dataChiTiet: res.data })
        } else {
            if (res.error.code == 20) {
                UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.thongbaochung.thongtindangkytaisankhongtontaihoacdabihuy, 2)
                Utils.goscreen(this, 'sw_HomePage')
                return
            }
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error.msg ? res.error.msg : RootLang.lang.thongbaochung.loilaythongtinchitiet, 2)
            this.setState({ dataChiTiet: {} })
        }
    }

    TuChoi = async () => {
        Utils.showMsgBoxYesNo(this, RootLang.lang.thongbaochung.thongbao, RootLang.lang.thongbaochung.Bancochacmuonhuydangkysudungtaisankhong, RootLang.lang.thongbaochung.co, RootLang.lang.thongbaochung.khong, async () => {
            this.setState({ showModal: true })
        })
    }

    TuChoiXacNhan = async () => {
        if (this.state.lydo == '') {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.thongbaochung.vuilongnhaplido, 3)
            return
        }
        let res = await Delete_DatPhongHop(this.requestid != -1 ? this.requestid : this.event.requestid, this.state.lydo)
        if (res.status == 1) {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.thongbaochung.huythanhcong, 1)
            this.requestid == -1 ? Utils.goback(this, null) : Utils.goscreen(this, 'sw_HomePage')
            this.callback()
        } else {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error.msg ? res.error.msg : RootLang.lang.thongbaochung.loituchoi, 2)
        }
    }

    render() {
        const { opacity, idUser, dataChiTiet } = this.state
        return (
            <View style={[nstyles.nstyles.ncontainer, { backgroundColor: `transparent`, justifyContent: 'flex-end' }]}>
                <Animated.View onTouchEnd={this._goback} style={{
                    position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
                    opacity
                }} />
                <Animated.View style={{ backgroundColor: '#F1F4FB', width: '100%', borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                    <View style={{ alignSelf: 'center', width: 300, height: 25, justifyContent: 'center' }}>
                        <Image source={Images.icTopModal} style={{ alignSelf: 'center' }} />
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15, marginBottom: 10 }}>
                        <TouchableOpacity onPress={() => this._goback()} style={{ alignSelf: 'center' }} >
                            <Image source={Images.ImageJee.icCloseModal} style={{ width: Width(5), height: Width(5), alignSelf: 'center', tintColor: colors.black_70 }} />
                        </TouchableOpacity>
                        {dataChiTiet.subscriberid == idUser && moment(dataChiTiet.end, 'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DD') > moment().format('YYYY-MM-DD') ?
                            <TouchableOpacity onPress={() => this.TuChoi()} style={{ width: '30%', paddingVertical: 10, backgroundColor: colors.deleteItem, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: colors.white }}>{RootLang.lang.thongbaochung.xoa}</Text>
                            </TouchableOpacity> : null}
                    </View>
                    <Text style={{ color: colors.black_50, marginHorizontal: 20, fontSize: reText(12), fontStyle: 'italic', marginBottom: 3 }}>{`${RootLang.lang.thongbaochung.dagui}: ${moment().format("DD/MM/YYYY") == moment(dataChiTiet.createddate).format("DD/MM/YYYY") ? (this.props.lang == 'vi' ? 'hôm nay ' : 'today ') + moment(dataChiTiet.createddate).format("HH:mm") : moment(dataChiTiet.createddate).format("DD/MM/YYYY HH:mm")}`}</Text>
                    <Text style={{ color: colors.colorTitleNew, marginHorizontal: 20, fontSize: reText(22) }}>{dataChiTiet.title}</Text>
                    <RenderThongTin title={RootLang.lang.thongbaochung.dangkyboi} val={dataChiTiet.fullname} bold={true} />
                    <Text style={{ color: colors.colorTitleNew, marginHorizontal: 20, fontSize: reText(14), marginTop: 5 }}>{Utils.formatTimeAgo(dataChiTiet.start, 2, false) + ' ' + moment(dataChiTiet.start).format('HH:mm') + "-" + moment(dataChiTiet.end).format('HH:mm')}</Text>
                    <RenderThongTin title={RootLang.lang.thongbaochung.taisan} val={dataChiTiet.property} />
                    <RenderThongTin
                        title={RootLang.lang.thongbaochung.tinhtrang}
                        val={dataChiTiet.id == 0 ? RootLang.lang.thongbaochung.choxacnhan : dataChiTiet.id == 1 ? RootLang.lang.thongbaochung.daxacnhan : dataChiTiet.id == 2 ? RootLang.lang.thongbaochung.khongxacnhan : RootLang.lang.thongbaochung.daduocdat}
                        mau={dataChiTiet.id == 0 ? '#FB8343' : dataChiTiet.id == 1 ? '#3E8827' : dataChiTiet.id == 2 ? '#FF7676' : '#9699A2'}
                        nguoiduyet={dataChiTiet.id == 1 ? dataChiTiet.confirmby : undefined}
                        ngayduyet={dataChiTiet.id == 1 ? Utils.formatTimeAgo(dataChiTiet.confirmdate, 1, true) : undefined}
                    />

                    < View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 }}>
                    </View>
                    <Modal
                        animationType='fade'
                        visible={this.state.showModal}
                        transparent={true}>
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.black_20_2 }}>
                            <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, right: 0, elevation: 1 }}
                                onTouchEnd={() => this.setState({ showModal: false })} />
                            <Animatable.View
                                style={{
                                    width: Width(90), backgroundColor: 'white', borderRadius: 5, padding: 15, elevation: 3, shadowRadius: 3,
                                }}
                                animation={'zoomIn'}
                                duration={500}
                                useNativeDriver={true}>
                                <Text style={{ fontSize: reText(18), color: colors.greenTab, fontWeight: 'bold', marginBottom: 5 }}>{RootLang.lang.thongbaochung.huythongtindangky}</Text>
                                <View style={{ borderWidth: 0.5, borderColor: colors.black_50, paddingVertical: Platform.OS == 'ios' ? 10 : 0, paddingHorizontal: 10, marginTop: 5, borderRadius: 8 }}>
                                    <TextInput
                                        placeholder={RootLang.lang.thongbaochung.nhaplidohuy}
                                        value={this.state.lydo}
                                        onChangeText={(t) => this.setState({ lydo: t })}
                                        style={{}}
                                    />
                                </View>
                                <TouchableOpacity onPress={() => this.TuChoiXacNhan()} style={{ marginVertical: 15, width: Width(30), paddingVertical: 10, backgroundColor: colors.blueColor, borderRadius: 20, alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontSize: reText(16), color: colors.white }}>{RootLang.lang.thongbaochung.luu}</Text>
                                </TouchableOpacity>
                            </Animatable.View>
                        </View>
                    </Modal>
                    <View style={{ height: 30 }} />
                </Animated.View >
            </View >

        );
    }
}
const styles = StyleSheet.create({

})

const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});

export default Utils.connectRedux(FormChiTiet, mapStateToProps, true)