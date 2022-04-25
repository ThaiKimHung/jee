import React, { Component } from 'react';
import {
    BackHandler,
    FlatList,
    Image, StyleSheet, Text, TextInput, TouchableOpacity, View
} from "react-native";
import { RootLang } from '../../../app/data/locales';
import Utils from '../../../app/Utils';
import HeaderComStackV2 from '../../../components/HeaderComStackV2';
import IsLoading from '../../../components/IsLoading';
import { Images } from '../../../images';
import { colors } from '../../../styles';
import { sizes } from '../../../styles/size';
import { Height, nstyles, Width } from '../../../styles/styles';

class BoLocDuAn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchString: '',
            Type: [
                { id: '', title: RootLang.lang.JeeWork.tatca, choice: true },

                { id: 1, title: RootLang.lang.JeeWork.dungtiendo, choice: false },

                { id: 2, title: RootLang.lang.JeeWork.chamtiendo, choice: false },

                { id: 3, title: RootLang.lang.JeeWork.ruirocao, choice: false },
            ],
            hienthi: [
                { id: 0, title: RootLang.lang.JeeWork.hoatdong, choice: true },
                { id: 1, title: RootLang.lang.JeeWork.dadong, choice: false },
            ],
            typeChoice: '',
            hienthiChoice: 0,
        }
        this.callback = Utils.ngetParam(this, "callback")
        this.tab = Utils.ngetParam(this, "tab")
    }


    componentDidMount() {
        this._backHandler = BackHandler.addEventListener('hardwareBackPress', this._backHandlerButton)
        var { Type, hienthi } = this.state
        Type.map((item) => {
            if (item.id === Utils.getGlobal(`typeChoiceDuAN${this.tab}`, '')) {
                item.choice = true
            }
            else {
                item.choice = false
            }
        })
        hienthi.map((item) => {
            if (item.id === Utils.getGlobal(`hienthiChoiceDuAN${this.tab}`, 0)) {
                item.choice = true
            }
            else {
                item.choice = false
            }
        })
        this.setState({ Type: Type, typeChoice: Utils.getGlobal(`typeChoiceDuAN${this.tab}`, ''), hienthiChoice: Utils.getGlobal(`hienthiChoiceDuAN${this.tab}`, ''), hienthi: hienthi, searchString: Utils.getGlobal(`searchStringDuAN${this.tab}`, '') })
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

    _renderType = ({ item, index }) => {
        return (
            <View style={{ flex: 1 }}>
                <TouchableOpacity

                    onPress={() => { this._ChonType(item), this.setState({ typeChoice: item.id }) }}
                    style={{ borderColor: item.choice == true ? '#0E72D8' : '#B3B3B3', borderWidth: 1.5, width: Width(40), height: Height(5), justifyContent: 'center', alignItems: 'center', marginLeft: 20, borderRadius: 5, marginVertical: 10 }}>
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
        const { Type, hienthi, typeChoice, hienthiChoice } = this.state;
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
                                <Image source={Images.icSearch} style={{ height: 15, width: 15, marginHorizontal: 20, }} />
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
                        <Text style={{ fontSize: sizes.sText15, fontWeight: 'bold' }}>{RootLang.lang.JeeWork.theotinhtrang}</Text>
                        <View style={{ marginTop: 5, flex: 1, maxHeight: "25%" }}>
                            <FlatList
                                data={Type}
                                style={{ flexGrow: 1 }}
                                numColumns={2}
                                renderItem={this._renderType}
                                keyExtractor={(item, index) => index.toString()}

                            />
                        </View>

                        <Text style={{ fontSize: sizes.sText15, fontWeight: 'bold' }}>{RootLang.lang.JeeWork.hienthi}</Text>
                        <View style={{ marginTop: 5, flex: 1, }}>
                            <FlatList
                                data={hienthi}
                                numColumns={2}
                                style={{ flexGrow: 1 }}
                                renderItem={this._renderHienThi}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', paddingBottom: 10, padding: 10, justifyContent: 'center' }}>
                        <TouchableOpacity
                            onPress={() => {
                                var { Type, hienthi, searchString } = this.state
                                Type.map((item) => {
                                    if (item.id == '') {

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
                                    this.setState({ Type: Type, hienthi: hienthi, searchString: '', typeChoice: '', hienthiChoice: 0 })
                                Utils.setGlobal(`typeChoiceDuAN${this.tab}`, '')
                                Utils.setGlobal(`hienthiChoiceDuAN${this.tab}`, 0)
                                Utils.setGlobal(`searchStringDuAN${this.tab}`, '')

                            }}
                            style={{ borderColor: '#0E72D8', borderWidth: 0.8, height: Height(6), width: Width(43), justifyContent: 'center', alignItems: 'center', marginRight: 10, backgroundColor: colors.white, borderRadius: 8 }}>
                            <Text style={{ fontSize: sizes.sText12, color: '#0E72D8', fontWeight: 'bold' }}>{RootLang.lang.JeeWork.xoaboloc}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                this.callback({
                                    typeChoice,
                                    hienthiChoice,
                                    searchString
                                })
                                Utils.setGlobal(`typeChoiceDuAN${this.tab}`, typeChoice)
                                Utils.setGlobal(`hienthiChoiceDuAN${this.tab}`, hienthiChoice)
                                Utils.setGlobal(`searchStringDuAN${this.tab}`, searchString)

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

export default Utils.connectRedux(BoLocDuAn, mapStateToProps, true)


