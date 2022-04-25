import React, { Component } from "react";
import {
    FlatList,
    Image, StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView, BackHandler
} from "react-native";
import { GetDuAn_User, GetStatus_DuAn } from "../../../apis/JeePlatform/API_JeeWork/apiCongViecCaNhan";
import { RootLang } from "../../../app/data/locales";
import Utils from '../../../app/Utils';
import HeaderComStackV2 from '../../../components/HeaderComStackV2';
import IsLoading from '../../../components/IsLoading';
import { Images } from '../../../images';
import { colors } from '../../../styles';
import { reText, sizes } from '../../../styles/size';
import { Height, nstyles, Width } from '../../../styles/styles';


class BoLocGiaoViec extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchString: '',
            Type: [
                { id: "CreatedDate", title: RootLang.lang.JeeWork.theongaytao, choice: true },

                { id: "Deadline", title: RootLang.lang.JeeWork.theothoihan, choice: false, value: "" },

                { id: "StartDate", title: RootLang.lang.JeeWork.theongaybatdau, choice: false },


            ],

            typeChoice: 'CreatedDate',
            _dateDk: '',
            _dateKt: '',
            date: new Date(),

            dataDuAn: [],
            selectDuAn: {
                "id_row": "", "title": RootLang.lang.JeeWork.tatcaduan,
            },
            dataTrangThai: [],
            selectTrangThai: {
                "id_row": "", "statusname": RootLang.lang.JeeWork.chontrangthai,
            }
        }
        this.CallBackBoLoc = Utils.ngetParam(this, "callback")
        this.tab = Utils.ngetParam(this, "tab")
    }

    componentDidMount() {

        this._backHandler = BackHandler.addEventListener('hardwareBackPress', this._backHandlerButton)
        this._GetDuAn_Use()
        var { Type } = this.state
        Type.map((item) => {
            if (item.id === Utils.getGlobal(this.tab == 0 ? "typeChoiceLocGiaoViec" : "typeChoiceLocGiaoViec1", 'CreatedDate')) {
                item.choice = true
            }
            else {
                item.choice = false
            }
        })

        this.setState({
            Type: Type,
            typeChoice: Utils.getGlobal(this.tab == 0 ? "typeChoiceLocGiaoViec" : "typeChoiceLocGiaoViec1", 'CreatedDate'),
            _dateDk: Utils.getGlobal(this.tab == 0 ? "_dateDkLocGiaoViec" : "_dateDkLocGiaoViec1", ''),
            _dateKt: Utils.getGlobal(this.tab == 0 ? "_dateKtLocGiaoViec" : "_dateKtLocGiaoViec1", ''),
            searchString: Utils.getGlobal(this.tab == 0 ? "searchStringGiaoViec" : "searchStringGiaoViec1", ''),
            selectDuAn: Utils.getGlobal(this.tab == 0 ? "selectDuAn" : "selectDuAn1", {
                "id_row": "", "title": RootLang.lang.JeeWork.tatcaduan,
            }),
            selectTrangThai: Utils.getGlobal(this.tab == 0 ? "selectTrangThai" : "selectTrangThai1", {
                "id_row": "", "statusname": RootLang.lang.JeeWork.chontrangthai,
            })
        })
        let duan = Utils.getGlobal(this.tab == 0 ? "selectDuAn" : "selectDuAn1", {
            "id_row": "", "title": RootLang.lang.JeeWork.tatcaduan,
        })
        if (duan.id_row != "") {
            this._GetStatus_DuAn(duan.id_row)
        }

    }
    componentWillUnmount() {
        this._backHandler.remove()
    }
    _backHandlerButton = () => {
        this._goback()
        return true
    }

    _GetDuAn_Use = async () => {
        const res = await GetDuAn_User()
        if (res.status == 1) {
            this.setState({ dataDuAn: res.data })
        } else {
            this.setState({ dataDuAn: {} })
        }
    }
    _callbackDuAn = (item) => {
        this.setState({ selectDuAn: item }, () => {
            this.setState({
                selectTrangThai: {
                    "id_row": "", "statusname": RootLang.lang.JeeWork.chontrangthai,
                }
            })
            this._GetStatus_DuAn()
        })
    }

    ViewItemDuAn = (item) => {
        return (
            <View
                key={item.id_row.toString()}
            >
                <Text style={{
                    textAlign: "center", fontSize: sizes.sText16,
                    color: this.state.selectDuAn.id_row == item.id_row ? '#0E72D8' : 'black',
                    fontWeight: this.state.selectDuAn.id_row == item.id_row ? "bold" : 'normal'
                }}>{item.title ? item.title : ""}</Text>
            </View>
        )
    }
    // _GetStatus_DuAn

    _GetStatus_DuAn = async (id = this.state.selectDuAn.id_row) => {
        const res = await GetStatus_DuAn(id)
        if (res.status == 1) {
            this.setState({ dataTrangThai: res.data })
        } else {
            this.setState({ dataTrangThai: {} })
        }
    }
    _callbackStatus = (item) => {
        this.setState({ selectTrangThai: item })
    }

    ViewItemStatus = (item) => {
        return (
            <View
                key={item.id_row.toString()}
            >
                <Text style={{
                    textAlign: "center", fontSize: sizes.sText16,
                    color: this.state.selectTrangThai.id_row == item.id_row ? '#0E72D8' : 'black',
                    fontWeight: this.state.selectTrangThai.id_row == item.id_row ? "bold" : 'normal'
                }}>{item.statusname ? item.statusname : ""}</Text>
            </View>
        )
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
                    style={{
                        borderColor: item.choice == true ? '#0E72D8' : '#B3B3B3', borderWidth: 1.5, width: Width(40), height: Height(5), justifyContent: 'center',
                        alignItems: 'center', marginLeft: 20, borderRadius: 5, marginVertical: 10, alignContent: "center", alignSelf: "center"
                    }}>
                    <Text style={{ fontWeight: item.choice == true ? "bold" : "400", fontSize: sizes.sText12, color: item.choice == true ? '#0E72D8' : '#65676B' }}>{item.title}</Text>
                </TouchableOpacity>
            </View>
        )
    }


    _goback = () => {
        Utils.goback(this, null)
    }

    render() {
        const { chuyendoi, mota, _dateDk, _dateKt, Type, hienthi, typeChoice, hienthiChoice, selectDuAn, selectTrangThai } = this.state;
        var { searchString } = this.state
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: '#F2F3F5', width: Width(100), }]}>
                <HeaderComStackV2
                    nthis={this}
                    title={RootLang.lang.JeeWork.boloc}
                    // iconRight={Images.ImageJee.icBaCham}
                    // styIconRight={[nstyles.nIconH18W22, {}]}
                    iconLeft={Images.ImageJee.icArrowNext}
                    onPressLeft={this._goback}
                    // onPressRight={() => { Utils.goscreen(this, 'Modal_LocBaiDang') }}
                    styBorder={{
                        borderBottomColor: colors.black_20_2,
                        borderBottomWidth: 0.3
                    }}
                />
                <View style={{ backgroundColor: '#F2F3F5', marginTop: 10, flex: 1, justifyContent: 'space-between', paddingBottom: 20 }}>
                    <ScrollView style={{ backgroundColor: colors.white, flex: 1, padding: 10, width: Width(100) }}>
                        <View style={{
                            backgroundColor: "#F2F3F5",
                            borderRadius: 20,
                            marginBottom: 20,
                        }}>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                                <Image source={Images.icSearch} style={{ height: 15, width: 15, marginHorizontal: 10, }} />
                                <TextInput
                                    style={{
                                        flex: 1,
                                        paddingTop: 10,
                                        paddingRight: 10,
                                        paddingBottom: 10,
                                        paddingLeft: 0,
                                    }}
                                    placeholder={RootLang.lang.JeeWork.timkiem}
                                    onChangeText={(searchString) => {
                                        this.setState({ searchString })
                                    }}
                                    underlineColorAndroid="transparent"
                                    value={searchString}
                                />
                            </View>

                        </View>
                        <Text style={{ fontSize: sizes.sText15, fontWeight: 'bold' }}>{RootLang.lang.JeeWork.theothoigian}</Text>

                        <View style={{ backgroundColor: colors.white, padding: 10 }}>

                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ flex: 1, marginRight: 2, }}>

                                    <TouchableOpacity
                                        onPress={() => this._selectDate(true)}
                                        style={[{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            backgroundColor: colors.white, paddingVertical: 15,
                                            margin: 2,
                                            backgroundColor: colors.white,
                                            paddingHorizontal: 10
                                        }]}>
                                        <Image
                                            source={Images.ImageJee.icLichChiTietTQ}
                                            style={{ height: 14, width: 14, tintColor: colors.colorGrayIcon }}
                                            resizeMode={'contain'}>
                                        </Image>
                                        <Text style={[{
                                            color: colors.black_20,
                                            // fontFamily: fonts.Helvetica,
                                            fontSize: sizes.sText14,
                                            lineHeight: reText(16), textAlign: 'center'
                                        }]}>{RootLang.lang.JeeWork.tungay}</Text>
                                        {
                                            _dateDk ? <Text numberOfLines={2} style={[
                                                {
                                                    flex: 1, textAlign: 'right', color: colors.black,
                                                    // fontFamily: fonts.Helvetica,
                                                    fontSize: sizes.sText14,
                                                    lineHeight: reText(18)
                                                }]}>{_dateDk}</Text> : null
                                        }
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flex: 1, }}>
                                    <TouchableOpacity
                                        onPress={() => this._selectDate(true)}
                                        style={[{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            backgroundColor: colors.white, paddingVertical: 15,
                                            margin: 2,
                                            backgroundColor: colors.white,
                                            paddingHorizontal: 10
                                        }]}>
                                        <Image
                                            source={Images.ImageJee.icLichChiTietTQ}
                                            style={{ height: 14, width: 14, tintColor: colors.colorGrayIcon }}
                                            resizeMode={'contain'}>
                                        </Image>
                                        <Text style={[{
                                            color: colors.black_20,
                                            // fontFamily: fonts.Helvetica,
                                            fontSize: sizes.sText14,
                                            lineHeight: reText(16), textAlign: 'center'
                                        }]}>{RootLang.lang.JeeWork.denngay}</Text>
                                        {
                                            _dateKt ? <Text numberOfLines={2} style={[
                                                {
                                                    flex: 1, textAlign: 'right', color: colors.black,
                                                    // fontFamily: fonts.Helvetica,
                                                    fontSize: sizes.sText14,
                                                    lineHeight: reText(18)
                                                }]}>{_dateKt}</Text> : null

                                        }
                                    </TouchableOpacity>
                                </View>
                            </View>


                        </View>

                        <Text style={{ fontSize: sizes.sText15, fontWeight: 'bold' }}>{RootLang.lang.JeeWork.theoloai}</Text>
                        <View style={{ marginTop: 5, flex: 1 }}>
                            <FlatList
                                data={Type}
                                style={{ flexGrow: 1 }}
                                numColumns={2}
                                renderItem={this._renderType}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </View>
                        <Text style={{ fontSize: sizes.sText15, fontWeight: 'bold', marginTop: 10 }}>{RootLang.lang.JeeWork.duan}</Text>
                        <View style={{ marginTop: 5 }}>
                            <TouchableOpacity onPress={() => {
                                Utils.goscreen(this, 'Modal_ComponentSelectCom', {
                                    callback: this._callbackDuAn, item: selectDuAn,
                                    AllThaoTac: this.state.dataDuAn, ViewItem: this.ViewItemDuAn
                                })
                            }}
                                style={{ width: '100%', paddingVertical: 13, flexDirection: 'row', borderWidth: 1, borderColor: '#0E72D8', borderRadius: 5, paddingHorizontal: 10 }}>
                                <Text style={{ color: '#0E72D8', fontWeight: 'bold', flex: 1 }}>{selectDuAn.title}</Text>
                                <Image source={Images.ImageJee.icDropdown} style={{ tintColor: '#0E72D8' }} />
                            </TouchableOpacity>
                        </View>
                        {selectDuAn.id_row == "" ? null :
                            <>
                                <Text style={{ fontSize: sizes.sText15, fontWeight: 'bold', marginTop: 15 }}>{RootLang.lang.JeeWork.trangthaicongviec}</Text>
                                <View style={{ marginTop: 5 }}>
                                    <TouchableOpacity onPress={() => {
                                        Utils.goscreen(this, 'Modal_ComponentSelectCom', {
                                            callback: this._callbackStatus, item: selectTrangThai,
                                            AllThaoTac: this.state.dataTrangThai, ViewItem: this.ViewItemStatus
                                        })
                                    }}
                                        style={{ width: '100%', paddingVertical: 13, flexDirection: 'row', borderWidth: 1, borderColor: selectTrangThai.id_row == "" ? colors.black_50 : '#0E72D8', borderRadius: 5, paddingHorizontal: 10 }}>
                                        <Text style={{ color: selectTrangThai.id_row == "" ? colors.black_50 : '#0E72D8', fontWeight: 'bold', flex: 1 }}>{selectTrangThai.statusname}</Text>
                                        <Image source={Images.ImageJee.icDropdown} style={{ tintColor: selectTrangThai.id_row == "" ? colors.black_50 : '#0E72D8' }} />
                                    </TouchableOpacity>
                                </View>
                            </>}
                    </ScrollView>
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
                                    _dateKt: '', typeChoice: 'CreatedDate',
                                    selectDuAn: {
                                        "id_row": "", title: RootLang.lang.JeeWork.tatcaduan,
                                    },
                                    selectTrangThai: {
                                        "id_row": "", "statusname": RootLang.lang.JeeWork.chontrangthai,
                                    }
                                })
                                if (this.tab == 0) {
                                    Utils.setGlobal('_dateDkLocGiaoViec', '')
                                    Utils.setGlobal('typeChoiceLocGiaoViec', 'CreatedDate')
                                    Utils.setGlobal('_dateKtLocGiaoViec', '')
                                    Utils.setGlobal('searchStringGiaoViec', '')
                                    Utils.setGlobal('selectDuAn', '')
                                    Utils.setGlobal('selectTrangThai', '')
                                }
                                if (this.tab == 1) {
                                    Utils.setGlobal('_dateDkLocGiaoViec1', '')
                                    Utils.setGlobal('typeChoiceLocGiaoViec1', 'CreatedDate')
                                    Utils.setGlobal('_dateKtLocGiaoViec1', '')
                                    Utils.setGlobal('searchStringGiaoViec1', '')
                                    Utils.setGlobal('selectDuAn1', '')
                                    Utils.setGlobal('selectTrangThai1', '')
                                }
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
                                    selectDuAn,
                                    selectTrangThai
                                })
                                if (this.tab == 0) {
                                    Utils.setGlobal('_dateDkLocGiaoViec', _dateDk)
                                    Utils.setGlobal('typeChoiceLocGiaoViec', typeChoice)
                                    Utils.setGlobal('_dateKtLocGiaoViec', _dateKt)
                                    Utils.setGlobal('searchStringGiaoViec', searchString)
                                    Utils.setGlobal('selectDuAn', selectDuAn)
                                    Utils.setGlobal('selectTrangThai', selectTrangThai)
                                }
                                if (this.tab == 1) {
                                    Utils.setGlobal('_dateDkLocGiaoViec1', _dateDk)
                                    Utils.setGlobal('typeChoiceLocGiaoViec1', typeChoice)
                                    Utils.setGlobal('_dateKtLocGiaoViec1', _dateKt)
                                    Utils.setGlobal('searchStringGiaoViec1', searchString)
                                    Utils.setGlobal('selectDuAn1', selectDuAn)
                                    Utils.setGlobal('selectTrangThai1', selectTrangThai)
                                }


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
    card: {
        borderRadius: 30
    },
    list: {
        overflow: 'visible'
    },
    reactView: {
        width: (Width(100) - 24) / 7,
        height: 58,
        justifyContent: 'center',
        alignItems: 'center'
    },
    reaction: {
        width: Width(20),
        marginBottom: 4
    }
});

export default Utils.connectRedux(BoLocGiaoViec, mapStateToProps, true)


