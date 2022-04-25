import React, { Component } from 'react';
import {
    BackHandler,
    FlatList,
    Image, StyleSheet, Text, TextInput, TouchableOpacity, View
} from "react-native";
import { RootLang } from '../../../../app/data/locales';
import Utils from '../../../../app/Utils';
import HeaderComStackV2 from '../../../../components/HeaderComStackV2';
import IsLoading from '../../../../components/IsLoading';
import { Images } from '../../../../images';
import { colors } from '../../../../styles';
import { reText, sizes } from '../../../../styles/size';
import { Height, nstyles, Width } from '../../../../styles/styles';




class BoLocChiTietDuAn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchString: '',
            Type: [
                { id: 'CreatedDate', title: RootLang.lang.JeeWork.theongaytao, choice: true },
                { id: "Deadline", title: RootLang.lang.JeeWork.theothoihan, choice: false },
                { id: "StartDate", title: RootLang.lang.JeeWork.theongaybatdau, choice: false },
            ],
            hienthi: [
                { id: "status", title: RootLang.lang.JeeWork.trangthaiboloc, choice: true },
                { id: "assignee", title: RootLang.lang.JeeWork.giaochoboloc, choice: false },
                { id: "groupwork", title: RootLang.lang.JeeWork.nhomcongviecboloc, choice: false },
            ],
            typeChoice: 'CreatedDate',
            hienthiChoice: 0,
            _dateDk: '',
            _dateKt: '',
            date: new Date(),
        }
        this.callback = Utils.ngetParam(this, "callback")

    }


    componentDidMount() {
        var { Type, hienthi } = this.state
        this._backHandler = BackHandler.addEventListener('hardwareBackPress', this._backHandlerButton)
        Type.map((item) => {
            if (item.id === Utils.getGlobal(`typeChoiceChiTietDuAN`, 'CreatedDate')) {
                item.choice = true
            }
            else {
                item.choice = false
            }
        })
        hienthi.map((item) => {
            if (item.id === Utils.getGlobal(`hienthiChoiceChiTietDuAN`, 0)) {
                item.choice = true
            }
            else {
                item.choice = false
            }
        })
        this.setState({ Type: Type, typeChoice: Utils.getGlobal(`typeChoiceChiTietDuAN`, 'CreatedDate'), _dateDk: Utils.getGlobal("_dateDkChiTietDuAn", ''), _dateKt: Utils.getGlobal("_dateKtChiTietDuAn", ''), hienthiChoice: Utils.getGlobal(`hienthiChoiceChiTietDuAN`, ''), hienthi: hienthi, searchString: Utils.getGlobal(`searchStringChiTietDuAN`, '') })
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

    _ChonHienThi = async (itemChoice) => {
        var { hienthi } = this.state
        hienthi.map((item) => {
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
        this.setState({ hienthi: hienthi })
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
                    style={{ borderColor: item.choice == true ? '#0E72D8' : '#B3B3B3', borderWidth: 1.5, width: Width(40), height: Height(5), justifyContent: 'center', alignItems: 'center', marginLeft: 20, borderRadius: 5, marginVertical: 10, alignContent: "center", alignSelf: "center" }}>
                    <Text style={{ fontWeight: item.choice == true ? "bold" : "400", fontSize: sizes.sText12, color: item.choice == true ? '#0E72D8' : '#65676B' }}>{item.title}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    _renderHienThi = ({ item, index }) => {
        return (
            <View style={{ flex: 1 }}>
                <TouchableOpacity
                    onPress={() => { this._ChonHienThi(item), this.setState({ hienthiChoice: item.id }) }}
                    style={{ borderColor: item.choice == true ? '#0E72D8' : '#B3B3B3', borderWidth: 1.5, width: Width(40), height: Height(5), justifyContent: 'center', alignItems: 'center', marginLeft: 20, borderRadius: 5, marginVertical: 10 }}>
                    <Text style={{ fontWeight: item.choice == true ? "bold" : "400", fontSize: sizes.sText12, color: item.choice == true ? '#0E72D8' : '#65676B' }}>{item.title}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    _goback = () => {
        Utils.goback(this, null)
    }

    render() {
        const { chuyendoi, mota, _dateDk, _dateKt, Type, hienthi, typeChoice, hienthiChoice } = this.state;
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
                    <View style={{ backgroundColor: colors.white, flex: 1, padding: 10, width: Width(100) }}>
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

                            <View style={{ padding: 10, justifyContent: 'space-evenly', flexDirection: 'row' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity
                                        onPress={() => this._selectDate(true)}
                                        style={{ backgroundColor: 'white', flexDirection: 'row' }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Image
                                                source={Images.ImageJee.icLichChiTietTQ}
                                                style={{ height: Width(5), width: Width(5), tintColor: colors.colorGrayIcon, marginRight: 5 }}
                                                resizeMode={'contain'}>
                                            </Image>
                                            {!_dateDk ? (
                                                <Text>{RootLang.lang.JeeWork.tungay}  </Text>
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
                                                style={{ height: Width(5), width: Width(5), tintColor: colors.colorGrayIcon, marginRight: 5 }}
                                                resizeMode={'contain'}>
                                            </Image>
                                            {!_dateDk ? (
                                                <Text>{RootLang.lang.JeeWork.denngay}  </Text>
                                            ) : null}
                                        </View>
                                        {
                                            _dateKt ? <Text numberOfLines={2} style={{}}>{_dateKt}</Text> : null
                                        }
                                    </TouchableOpacity>
                                </View>
                            </View>


                        </View>

                        <Text style={{ fontSize: sizes.sText15, fontWeight: 'bold' }}>{RootLang.lang.JeeWork.theoloai}</Text>
                        <View style={{ marginTop: 5, flex: 1, maxHeight: "25%" }}>
                            <FlatList
                                data={Type}
                                style={{ flexGrow: 1 }}
                                numColumns={2}
                                renderItem={this._renderType}
                                keyExtractor={(item, index) => index.toString()}

                            />
                        </View>

                        {/* <Text style={{ fontSize: sizes.sText15, fontWeight: 'bold' }}>Lọc theo nhóm</Text>
                        <View style={{ marginTop: 5, flex: 1, }}>
                            <FlatList
                                data={hienthi}
                                numColumns={2}
                                style={{ flexGrow: 1 }}
                                renderItem={this._renderHienThi}
                                keyExtractor={(item, index) => index.toString()}

                            />
                        </View> */}
                    </View>
                    <View style={{ flexDirection: 'row', paddingBottom: 10, padding: 10, justifyContent: 'center' }}>
                        <TouchableOpacity
                            onPress={() => {
                                var { Type, hienthi, searchString } = this.state
                                Type.map((item) => {
                                    if (item.id == "CreatedDate") {
                                        item.choice = true
                                    }
                                    else
                                        item.choice = false
                                })
                                hienthi.map((item) => {
                                    if (item.id == 0)
                                        item.choice = true
                                    else
                                        item.choice = false
                                }),
                                    this.setState({ Type: Type, hienthi: hienthi, searchString: '', typeChoice: 'CreatedDate', hienthiChoice: 0, _dateDk: "", _dateKt: "" })
                                Utils.setGlobal(`typeChoiceChiTietDuAN`, 'CreatedDate')
                                Utils.setGlobal(`hienthiChoiceChiTietDuAN`, 0)
                                Utils.setGlobal(`searchStringChiTietDuAN`, '')
                                Utils.setGlobal('_dateDkChiTietDuAn', '')
                                Utils.setGlobal('_dateKtChiTietDuAn', '')
                            }}
                            style={{ borderColor: '#0E72D8', borderWidth: 0.8, height: Height(6), width: Width(43), justifyContent: 'center', alignItems: 'center', marginRight: 10, backgroundColor: colors.white, borderRadius: 8 }}>
                            <Text style={{ fontSize: sizes.sText12, color: '#0E72D8', fontWeight: 'bold' }}>{RootLang.lang.JeeWork.xoaboloc}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                this.callback({
                                    typeChoice,
                                    hienthiChoice,
                                    searchString,
                                    _dateDk,
                                    _dateKt
                                })
                                Utils.setGlobal(`typeChoiceChiTietDuAN`, typeChoice)
                                Utils.setGlobal(`hienthiChoiceChiTietDuAN`, hienthiChoice)
                                Utils.setGlobal(`searchStringChiTietDuAN`, searchString)
                                Utils.setGlobal('_dateDkChiTietDuAn', _dateDk)
                                Utils.setGlobal('_dateKtChiTietDuAn', _dateKt)
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
});

export default Utils.connectRedux(BoLocChiTietDuAn, mapStateToProps, true)



