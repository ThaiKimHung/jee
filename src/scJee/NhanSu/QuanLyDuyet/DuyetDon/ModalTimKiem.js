import React, { Component } from 'react';
import { Animated, Image, Text, TextInput, TouchableOpacity, View, BackHandler, Platform } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { RootLang } from '../../../../app/data/locales';
import Utils from '../../../../app/Utils';
import { Images } from '../../../../images';
import { colors } from '../../../../styles';
import { reSize, reText, sizes } from '../../../../styles/size';
import { Height, nHeight, nstyles, paddingBotX, Width } from '../../../../styles/styles';
import HeaderModal from '../../../../Component_old/HeaderModal';
import { ButtomCustom, TouchDropNew } from '../../../../Component_old/itemcom/itemcom';

const InputDate = props => {
    const { icon, title, value, txtStyle = {}, style = {} } = props;
    return (
        <View style={[{ backgroundColor: colors.colorBGHome }, style]}>
            <View style={[{ flexDirection: 'row', alignItems: 'center' }]}>
                <Image source={icon} style={[, { marginLeft: 12, width: Width(3.7), height: Width(4.1), tintColor: colors.colorNoteJee }]} />
                <TextInput placeholderTextColor={'#828282'} placeholder={title} value={value} editable={false} style={[{ paddingVertical: Platform.OS == 'ios' ? 10 : 5, paddingLeft: 7, fontSize: reText(14), color: colors.blackJee }, txtStyle]} />
            </View>
        </View>
    )
}


export class ModalTimKiem extends Component {
    constructor(props) {
        super(props)
        this._callback = Utils.ngetParam(this, '_callback');
        this.state = {
            date: new Date(),
            _dateDk: '',
            _dateKt: '',
            keyword: '',
            nhanvien: '',
            idtab: Utils.ngetParam(this, "idtab", 0),
            value: '',
            listStatus: [
                { nameStatus: RootLang.lang.common.tatca, id: 3 },
                { nameStatus: RootLang.lang.common.daduyet, id: 1 },
                { nameStatus: RootLang.lang.common.khongduyet, id: 0 },
            ],
            status: { nameStatus: RootLang.lang.common.tatca, id: 3 },
            nameStatus: '',
            opacity: new Animated.Value(0)

        }
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this._backHandlerButton)
        this._startAnimation(0.8)
        this._SetFilterData()
    }
    componentWillUnmount() {
        this.backHandler.remove()
    }
    _backHandlerButton = () => {
        this._goback()
        return true
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



    ViewItemStatus = (item) => {
        return (
            <View key={item.id.toString()} >
                <Text style={{
                    textAlign: "center", fontSize: sizes.sText16,
                    color: this.state.status.id == item.id ? colors.colorTabActive : 'black',
                    fontWeight: this.state.status.id == item.id ? "bold" : 'normal'
                }}>{item.nameStatus ? item.nameStatus : ""}</Text>
            </View>
        )
    }
    _Status = () => {
        Utils.goscreen(this, 'Modal_ComponentSelectCom', {
            callback: this._callbackStatus, item: this.state.status,
            AllThaoTac: this.state.listStatus, ViewItem: this.ViewItemStatus
        })
    }
    _callbackStatus = (status) => {
        try {
            this.setState({ status }
            );
        } catch (error) {

        }
    }

    _goback = () => {
        this._endAnimation(0)
        Utils.goback(this);
    }
    _SetNgayThang = (dateDk, dateKt) => {
        this.setState({ _dateDk: dateDk, _dateKt: dateKt })
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
    _refreshData = () => {
        this.setState({
            _dateDk: '',
            _dateKt: '',
            keyword: '',
            nhanvien: '',
            status: {},
            nameStatus: '',

        })
    }
    _SetFilterData = () => {
        const { DuyetDonReducer = {} } = this.props;
        const { idtab } = this.state
        this.setState({
            keyword: idtab == 0 ? DuyetDonReducer.itemFilterDuyet.keysearch : DuyetDonReducer.itemFilterLichSu.keysearch,
            nhanvien: idtab == 0 ? DuyetDonReducer.itemFilterDuyet.name : DuyetDonReducer.itemFilterLichSu.name,
            _dateDk: idtab == 0 ? DuyetDonReducer.itemFilterDuyet.dayfrm : DuyetDonReducer.itemFilterLichSu.dayfrm,
            _dateKt: idtab == 0 ? DuyetDonReducer.itemFilterDuyet.dayto : DuyetDonReducer.itemFilterLichSu.dayto,
            nameStatus: DuyetDonReducer.itemFilterLichSu.status ? DuyetDonReducer.itemFilterLichSu.status.nameStatus : null,
        })
    }
    _SearchDuyet = async () => {
        const { DuyetDonReducer = {} } = this.props;
        const { _dateDk, _dateKt, keyword, nhanvien, idtab, status } = this.state;
        let filter = { keysearch: keyword, name: nhanvien, dayfrm: _dateDk, dayto: _dateKt, status: status }
        this.props.SETFILTER(filter, idtab, DuyetDonReducer);
        this._endAnimation(0)
        Utils.goback(this)

    }

    render() {

        const { _dateDk, _dateKt, keyword, nhanvien, status, idtab, nameStatus, opacity, listStatus } = this.state

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
                                    {RootLang.lang.sckhac.boloc}
                                </Text>
                            </View>
                            <View style={{ width: Width(12) }} />
                        </View>
                        <View style={{ marginHorizontal: 15, marginTop: 20 }}>
                            <View style={[{ flexDirection: 'row', alignItems: 'center', marginBottom: 15, backgroundColor: colors.white, borderRadius: 10 }]}>
                                <Image source={Images.icSearch} style={[, { marginLeft: 10, width: Width(4), height: Width(4) }]} />
                                <TextInput
                                    placeholderTextColor={'#828282'}
                                    placeholder={RootLang.lang.sckhac.timkiem}
                                    value={keyword}
                                    autoCorrect={false}
                                    onChangeText={(text) => this.setState({ keyword: text })}
                                    style={[{ paddingVertical: Platform.OS == 'ios' ? 15 : 10, paddingLeft: 7, fontSize: reText(14), flex: 1, color: colors.blackJee }]} />
                            </View>

                            <View style={[{ flexDirection: 'row', alignItems: 'center', marginBottom: 15, backgroundColor: colors.white, borderRadius: 10 }]}>
                                <Image source={Images.ImageJee.icUserJee} style={[{ marginLeft: 10, width: Width(5), height: Width(5) }]} />
                                <TextInput
                                    placeholderTextColor={'#828282'}
                                    placeholder={RootLang.lang.sckhac.nhanvien}
                                    value={nhanvien}
                                    autoCorrect={false}
                                    onChangeText={(text) => this.setState({ nhanvien: text })}
                                    style={[{
                                        paddingVertical: Platform.OS == 'ios' ? 15 : 10, paddingLeft: 7, fontSize: reText(14),
                                        borderRadius: 10, flex: 1
                                    }]}
                                />
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <TouchableOpacity onPress={() => this._selectDate(true)} style={{ width: Width(45) }}>
                                    <InputDate isEdit={false} value={_dateDk ? _dateDk : ''} icon={Images.ImageJee.icAddTimeJee} title={RootLang.lang.common.tungay} style={{ width: Width(45), backgroundColor: colors.white, borderRadius: 10, paddingVertical: 5 }} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this._selectDate(false)} style={{ width: Width(45) }}>
                                    <InputDate isEdit={false} value={_dateKt ? _dateKt : ''} icon={Images.ImageJee.icAddTimeJee} title={RootLang.lang.common.denngay} style={{ width: Width(45), backgroundColor: colors.white, borderRadius: 10, paddingVertical: 5 }} />
                                </TouchableOpacity>
                            </View>


                            {idtab == 0 ? null :
                                <TouchableOpacity onPress={this._Status} style={{ backgroundColor: colors.white, flexDirection: 'row', paddingVertical: 15, paddingHorizontal: 10, marginTop: 15, borderRadius: 10 }}>
                                    <Image source={Images.ImageJee.jwTinhTrang} style={{ width: Width(4.5), height: Width(4.5) }} />
                                    <Text style={{ fontSize: reText(14), marginLeft: 7, color: '#828282', flex: 1 }}>{RootLang.lang.common.trangthai}</Text>
                                    <View style={{ flexDirection: 'row', }}>
                                        <Text style={{ fontSize: reText(14), marginLeft: 7, color: colors.blackJee }}>{status.nameStatus}</Text>
                                        <Image source={Images.ImageJee.icDropdown} style={{ width: Width(2), height: Width(2), alignSelf: 'center', marginLeft: 5, tintColor: colors.blackJee }} />
                                    </View>
                                </TouchableOpacity>}
                        </View>
                        <View style={{ flexDirection: 'row', marginHorizontal: 15, marginTop: 36, marginBottom: paddingBotX, justifyContent: 'space-between' }}>
                            <TouchableOpacity onPress={() => this._refreshData()} style={{ width: Width(45), paddingVertical: 15, borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.white }}>
                                <Text style={{ color: colors.checkAwait, fontSize: reText(14), fontWeight: 'bold' }}>{RootLang.lang.sckhac.xoaboloc}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this._SearchDuyet()} style={{ width: Width(45), paddingVertical: 15, borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.white }}>
                                <Text style={{ color: colors.checkGreen, fontSize: reText(14), fontWeight: 'bold' }}>{RootLang.lang.sckhac.capnhat}</Text>
                            </TouchableOpacity>
                            {/* <ButtomCustom title={(RootLang.lang.sckhac.xoaboloc).toUpperCase()}
                                stColor={{ backgroundColor: '#D4D4D4', width: reSize(170), alignSelf: 'center', marginRight: 10, }}
                                onpress={() => this._refreshData()} />

                            <ButtomCustom title={(RootLang.lang.sckhac.capnhat.toUpperCase())}
                                stColor={{ backgroundColor: colors.colorTabActive, width: reSize(170), alignSelf: 'center' }}
                                onpress={this._SearchDuyet} /> */}
                        </View>

                    </Animated.View>
                </View>
            </KeyboardAwareScrollView>
        )
    }
}

// export default
const mapStateToProps = state => ({
    lang: state.changeLanguage.language,
    DuyetDonReducer: state.DuyetDonReducer
});
export default Utils.connectRedux(ModalTimKiem, mapStateToProps, true)