import React, { Component } from "react";
import {
    BackHandler,
    FlatList,
    Image, StyleSheet, Text, TextInput, TouchableOpacity, View
} from "react-native";
import { RootLang } from "../../../app/data/locales";
import Utils from '../../../app/Utils';
import HeaderComStackV2 from '../../../components/HeaderComStackV2';
import IsLoading from '../../../components/IsLoading';
import { Images } from '../../../images';
import { colors } from '../../../styles';
import { reText, sizes } from '../../../styles/size';
import { Height, nstyles, Width } from '../../../styles/styles';

class BoLoc extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchString: '',
            Type: [
                { id: "CreatedDate", title: RootLang.lang.JeeWork.theongaytao, choice: true },
                { id: "Deadline", title: RootLang.lang.thongbaochung.hanchot.toUpperCase(), choice: false, value: "" },
                { id: "StartDate", title: RootLang.lang.JeeWork.theongaybatdau, choice: false },
            ],
            typeChoice: 'CreatedDate',
            _dateDk: '',
            _dateKt: '',
            date: new Date(),
            HoanThanhCV: 0, //0: k bao gồm cv hoàn thành , 1 - lấy cv hoàn thành
            HanCV: 0, //0: tắt, 1: chỉ hiện cv đã/ sắp hết hạn
            TinhTrang: [
                { id: 0, title: RootLang.lang.thongbaochung.tatca.toUpperCase() },
                { id: 1, title: RootLang.lang.thongbaochung.moitao.toUpperCase() },
                { id: 2, title: RootLang.lang.thongbaochung.danglam.toUpperCase() },
                { id: 3, title: RootLang.lang.thongbaochung.hoanthanh.toUpperCase() }
            ],
            SelectTT: { id: 0, title: RootLang.lang.thongbaochung.tatca.toUpperCase() },
        }
        this.CallBackBoLoc = Utils.ngetParam(this, "callback")
        this.IdScreen = Utils.ngetParam(this, "IdScreen")
    }


    componentDidMount() {
        var { Type } = this.state
        this._backHandler = BackHandler.addEventListener('hardwareBackPress', this._backHandlerButton)
        Type.map((item) => {
            if (item.id === Utils.getGlobal("typeChoiceLocCongViec" + this.IdScreen, 'CreatedDate')) {
                item.choice = true
            }
            else {
                item.choice = false
            }
        })
        this.setState({
            Type: Type,
            typeChoice: Utils.getGlobal("typeChoiceLocCongViec" + this.IdScreen, 'CreatedDate'),
            _dateDk: Utils.getGlobal("_dateDkLocCongViec" + this.IdScreen, ''),
            _dateKt: Utils.getGlobal("_dateKtLocCongViec" + this.IdScreen, ''),
            searchString: Utils.getGlobal("searchStringCongViec" + this.IdScreen, ''),
            HoanThanhCV: Utils.getGlobal("hoanthanhcv" + this.IdScreen, this.state.HoanThanhCV),
            HanCV: Utils.getGlobal("hancv" + this.IdScreen, this.state.HanCV),
            SelectTT: Utils.getGlobal("_TinhTrangCV" + this.IdScreen, this.state.SelectTT),
        })
    }
    componentWillUnmount() {
        this._backHandler.remove()
    }
    _backHandlerButton = () => {
        this._goback()
        return true
    }
    _ChonType = async (itemChoice) => {
        var { Type } = this.state
        Type.map((item) => {

            if (item.choice == true) {
                item.choice = false
                if (item === itemChoice) {
                    item.choice = !item.choice
                }
            }
            else {
                if (item === itemChoice) {
                    item.choice = !item.choice
                }
            }


        })
        this.setState({ Type: Type })

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



    _renderType = ({ item, index }) => {
        return (
            <View style={{ flex: 1 }}>
                <TouchableOpacity
                    onPress={() => { this._ChonType(item), this.setState({ typeChoice: item.id }) }}
                    style={{ borderColor: item.choice == true ? '#0E72D8' : '#B3B3B3', borderWidth: 1, width: Width(30), height: Width(10), justifyContent: 'center', alignItems: 'center', borderRadius: 5, marginVertical: 10, alignContent: "center", alignSelf: "center" }}>
                    <Text style={{ fontWeight: item.choice == true ? "bold" : "400", fontSize: sizes.sText11, color: item.choice == true ? '#0E72D8' : '#B3B3B3' }}>{item.title}</Text>
                </TouchableOpacity>
            </View>
        )
    }


    _goback = () => {
        Utils.goback(this, null)
    }

    _CheckHoanThanhCV = (val) => {
        if (this.state.SelectTT.id != 3)
            this.setState({ HoanThanhCV: val })
    }

    _CheckHanCV = (val) => {
        if (this.state.SelectTT.id != 3)
            this.setState({ HanCV: val })
    }


    _renderTinhTrang = ({ item, index }) => {
        return (
            <TouchableOpacity key={index} onPress={() => this.clickTT(item)} style={{ width: Width(23), marginRight: Width(1), height: Width(10), justifyContent: 'center', alignItems: 'center', borderWidth: 0.5, borderColor: this.state.SelectTT.id == item.id ? '#0E72D8' : '#B3B3B3', borderRadius: 5 }}>
                <Text style={{ fontSize: sizes.sText11, color: this.state.SelectTT.id == item.id ? '#0E72D8' : '#B3B3B3', fontWeight: this.state.SelectTT.id == item.id ? 'bold' : '400', textAlign: 'center' }}>{item.title}</Text>
            </TouchableOpacity>
        )
    }

    clickTT = (item) => {
        this.setState({ SelectTT: item })
        if (item.id == 3) {
            this.setState({ HoanThanhCV: 1, HanCV: 0 })
        }
    }

    render() {
        const { chuyendoi, mota, _dateDk, _dateKt, Type, hienthi, typeChoice, hienthiChoice, HoanThanhCV, HanCV, TinhTrang, SelectTT } = this.state;
        var { searchString } = this.state
        // console.log("HoanThanhCV:", HoanThanhCV)
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: '#F2F3F5', width: Width(100), }]}>
                <HeaderComStackV2
                    nthis={this}
                    title={RootLang.lang.JeeWork.boloc}
                    iconLeft={Images.ImageJee.icArrowNext}
                    onPressLeft={this._goback}
                    styBorder={{
                        borderBottomColor: colors.black_20_2,
                        borderBottomWidth: 0.3
                    }}
                />
                <View style={{ backgroundColor: '#F2F3F5', flex: 1, justifyContent: 'space-between', paddingBottom: 20 }}>
                    <View style={{ backgroundColor: colors.white, flex: 1, padding: 10, width: Width(100) }}>
                        <View style={{ backgroundColor: "#F2F3F5", borderRadius: 20, marginBottom: 20, }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                <Image source={Images.icSearch} style={{ height: 15, width: 15, marginHorizontal: 10, }} />
                                <TextInput
                                    style={{ flex: 1, paddingTop: 10, paddingRight: 10, paddingBottom: 10, paddingLeft: 0, }}
                                    placeholder={RootLang.lang.JeeWork.timkiem}
                                    onChangeText={(searchString) => { this.setState({ searchString }) }}
                                    underlineColorAndroid="transparent"
                                    value={searchString}
                                />
                            </View>
                        </View>
                        {/* Images.JeeUnCheck */}
                        <TouchableOpacity onPress={() => this._CheckHoanThanhCV(HoanThanhCV == 0 ? 1 : 0)} style={{ flexDirection: 'row' }}>
                            <Image source={HoanThanhCV == 0 ? Images.JeeCheck : Images.ImageJee.UnCheckBlue} style={{ width: Width(5), height: Width(5), marginRight: 5, tintColor: '#0E72D8' }} />
                            <Text style={{ fontSize: reText(16), color: '#0E72D8' }}>{RootLang.lang.thongbaochung.khongbaogomcongviecdahoanthanh}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this._CheckHanCV(HanCV == 0 ? 1 : 0)} style={{ flexDirection: 'row', marginTop: 10 }}>
                            <Image source={HanCV == 1 ? Images.JeeCheck : Images.ImageJee.UnCheckBlue} style={{ width: Width(5), height: Width(5), marginRight: 5, tintColor: '#0E72D8' }} />
                            <Text style={{ fontSize: reText(16), color: '#0E72D8' }}>{RootLang.lang.thongbaochung.chibaogomcongviecdavasaphethan}</Text>
                        </TouchableOpacity>
                        <Text style={{ fontSize: sizes.sText15, fontWeight: 'bold', marginTop: 15 }}>{RootLang.lang.JeeWork.theothoigian}</Text>
                        <View style={{ marginTop: 5, maxHeight: "25%" }}>
                            <FlatList
                                data={Type}
                                style={{ flexGrow: 1 }}
                                numColumns={3}
                                renderItem={this._renderType}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </View>
                        <View style={{ padding: 10, justifyContent: 'space-evenly', flexDirection: 'row' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity
                                    onPress={() => this._selectDate(true)}
                                    style={{ backgroundColor: 'white', flexDirection: 'row' }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Image
                                            source={Images.ImageJee.icLichChiTietTQ}
                                            style={styles.iconDate}
                                            resizeMode={'contain'}>
                                        </Image>
                                        {!_dateDk ? (
                                            <Text style={styles.Textdate}>{RootLang.lang.JeeWork.tungay}  </Text>
                                        ) : null}
                                    </View>
                                    {
                                        _dateDk ? <Text numberOfLines={2} style={{}}>{_dateDk}</Text> : null

                                    }
                                </TouchableOpacity>
                            </View>
                            <Text style={{}}>-</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity
                                    onPress={() => this._selectDate(true)}
                                    style={{ backgroundColor: 'white', flexDirection: 'row' }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Image
                                            source={Images.ImageJee.icLichChiTietTQ}
                                            style={styles.iconDate}
                                            resizeMode={'contain'}>
                                        </Image>
                                        {!_dateDk ? (
                                            <Text style={styles.Textdate}>{RootLang.lang.JeeWork.denngay}  </Text>
                                        ) : null}
                                    </View>
                                    {
                                        _dateKt ? <Text numberOfLines={2} style={{}}>{_dateKt}</Text> : null
                                    }
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Text style={{ fontSize: sizes.sText15, fontWeight: 'bold', marginBottom: 15, marginTop: 10 }}>{RootLang.lang.thongbaochung.theotinhtrang}</Text>
                        <FlatList
                            data={TinhTrang}
                            horizontal
                            // style={{ flexGrow: 1 }}
                            renderItem={this._renderTinhTrang}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', paddingBottom: 10, padding: 10, justifyContent: 'center' }}>
                        <TouchableOpacity
                            onPress={() => {
                                var { Type, searchString, _dateDk, _dateKt } = this.state
                                Type.map((item) => {
                                    if (item.id == 'CreatedDate') {
                                        item.choice = true
                                    }
                                    else
                                        item.choice = false
                                })

                                this.setState({
                                    Type: Type, searchString: '', _dateDk: '',
                                    _dateKt: '', typeChoice: 'CreatedDate', HoanThanhCV: 0, HanCV: 0, SelectTT: { id: 0, title: RootLang.lang.thongbaochung.tatca.toUpperCase() },
                                })
                                Utils.setGlobal('searchStringCongViec' + this.IdScreen, '')
                                Utils.setGlobal('hoanthanhcv' + this.IdScreen, 0)
                                Utils.setGlobal('hancv' + this.IdScreen, false)
                                Utils.setGlobal('typeChoiceLocCongViec' + this.IdScreen, 'CreatedDate')
                                Utils.setGlobal('_dateDkLocCongViec' + this.IdScreen, '')
                                Utils.setGlobal('_dateKtLocCongViec' + this.IdScreen, '')
                                Utils.setGlobal('_TinhTrangCV' + this.IdScreen, { id: 0, title: RootLang.lang.thongbaochung.tatca.toUpperCase() })

                            }}
                            style={{ borderColor: '#0E72D8', borderWidth: 0.8, height: Height(6), width: Width(43), justifyContent: 'center', alignItems: 'center', marginRight: 10, backgroundColor: colors.white, borderRadius: 8 }}>
                            <Text style={{ fontSize: sizes.sText12, color: '#0E72D8', fontWeight: 'bold' }}>{RootLang.lang.JeeWork.xoaboloc}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                this.CallBackBoLoc({
                                    typeChoice,
                                    _dateDk,
                                    _dateKt,
                                    searchString,
                                    HoanThanhCV,
                                    HanCV,
                                    SelectTT
                                })
                                Utils.setGlobal('searchStringCongViec' + this.IdScreen, searchString)
                                Utils.setGlobal('hoanthanhcv' + this.IdScreen, HoanThanhCV)
                                Utils.setGlobal('hancv' + this.IdScreen, HanCV)
                                Utils.setGlobal('typeChoiceLocCongViec' + this.IdScreen, typeChoice)
                                Utils.setGlobal('_dateDkLocCongViec' + this.IdScreen, _dateDk)
                                Utils.setGlobal('_dateKtLocCongViec' + this.IdScreen, _dateKt)
                                Utils.setGlobal('_TinhTrangCV' + this.IdScreen, SelectTT)
                                Utils.goback(this, null)
                            }}
                            style={{ borderColor: '#0E72D8', borderWidth: 0.3, height: Height(6), width: Width(43), justifyContent: 'center', alignItems: 'center', marginLeft: 10, backgroundColor: '#0E72D8', borderRadius: 8 }}>
                            <Text style={{ fontSize: sizes.sText12, color: colors.white, fontWeight: 'bold' }}>{RootLang.lang.JeeWork.apdung}</Text>
                        </TouchableOpacity>
                    </View>

                    <IsLoading />
                </View>
            </View >
        );
    }
};


const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});

const styles = StyleSheet.create({
    viewDate: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        backgroundColor: colors.white, paddingVertical: 15,
        margin: 2,
        backgroundColor: colors.white,
        paddingHorizontal: 10
    },
    iconDate: { height: Width(5), width: Width(5), tintColor: colors.colorGrayIcon, marginRight: 5 },
    Textdate: {
        color: colors.black_20,
        // fontFamily: fonts.Helvetica,
        fontSize: sizes.sText14,
        lineHeight: reText(16), textAlign: 'center'
    },
    TextRight:
    {
        flex: 1, textAlign: 'right', color: colors.black,
        // fontFamily: fonts.Helvetica,
        fontSize: sizes.sText14,
        lineHeight: reText(18)
    },
    ViewTinhTrang: { flexDirection: 'row', width: Width(96), justifyContent: 'space-around', marginTop: 15 },
    TouchTT: { width: Width(23), paddingVertical: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 0.5, borderColor: '#B3B3B3', borderRadius: 5 },
    TextTT: { color: '#B3B3B3', fontSize: reText(14) }

});

export default Utils.connectRedux(BoLoc, mapStateToProps, true)


