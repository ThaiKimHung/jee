import React, { Component, createRef } from 'react';
import {
    FlatList, Image, StyleSheet, Text,
    TextInput, TouchableOpacity, View
} from "react-native";
import { getListDuAnTaoCongViec } from '../../../apis/JeePlatform/API_JeeWork/apiDuAn';
import { RootLang } from '../../../app/data/locales';
import Utils from '../../../app/Utils';
import UtilsApp from '../../../app/UtilsApp';
import HeaderComStackV2 from '../../../components/HeaderComStackV2';
import IsLoading from '../../../components/IsLoading';
import ListEmptyLottie from '../../../components/NewComponents/ListEmptyLottie';
import { Images } from '../../../images';
import { colors } from '../../../styles';
import { sizes } from '../../../styles/size';
import { Height, nstyles, Width, paddingBotX } from '../../../styles/styles';



class ChonDuAn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listDuAn: [],
            noidung_Tk: '',
            refreshing: false,
            dataLoad: true
        };
        this.callback = Utils.ngetParam(this, 'callback');
    }

    componentDidMount = async () => {
        nthisLoading.show()
        await this._getDSDuAn().then(res => {
            if (res == true) {
                nthisLoading.hide()
                if (this.state.listDuAn?.length > 0) {
                    this.setState({ dataLoad: true })
                }
                else this.setState({ dataLoad: false })
            }
        });
    }

    _getDSDuAn = async () => {
        const { noidung_Tk } = this.state
        const res = await getListDuAnTaoCongViec(noidung_Tk)
        if (res.status == 1) {
            this.setState({ listDuAn: res.data, refreshing: false })
        }
        else {
            this.setState({ refreshing: false })
            UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, res.error ? res.error.message : RootLang.lang.JeeWork.laydulieuthatbai, 2)
        }

        return true
    }

    ChonDuAn = (item) => {
        this.callback(item);
        Utils.goback(this)
    }

    _renderItem = ({ item, index }) => {
        return (
            <View>
                <TouchableOpacity onPress={() => { this.ChonDuAn(item) }} style={{ padding: 22, paddingVertical: 20 }}>
                    <Text style={{ fontSize: sizes.sText14, fontWeight: 'bold', paddingLeft: 10 }}>{item.title}</Text>
                </TouchableOpacity>
                {index != this.state.listDuAn.length - 1 ? (
                    <View style={{ height: 1, backgroundColor: colors.veryLightPinkTwo, marginHorizontal: 20 }} />
                ) : <View style={{ paddingBottom: paddingBotX }} />}
            </View>
        );
    };


    _onRefresh = () => {
        this._getDSDuAn()
    }

    deleteSearch = () => {
        this.setState({ noidung_Tk: '' }, () => {
            this._getDSDuAn()
        })
    }

    render() {
        var { noidung_Tk, listDuAn, dataLoad, refreshing } = this.state;
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: '#E4E6EB', width: Width(100) }]}>

                <HeaderComStackV2
                    nthis={this}
                    title={RootLang.lang.JeeWork.chonduan}
                    // iconRight={Images.ImageJee.icBaCham}
                    iconLeft={Images.ImageJee.icArrowNext}
                    onPressLeft={() => {
                        Utils.goback(this, null)
                    }}

                    styBorder={{
                        borderBottomColor: colors.black_20_2,
                        borderBottomWidth: 0.3
                    }}
                />
                <View style={{ width: Width(100), height: Height(7), marginVertical: 10, backgroundColor: colors.white, flexDirection: 'row', padding: 10 }}  >

                    <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', borderWidth: 0.5, borderRadius: 20, backgroundColor: '#F2F3F5', borderColor: '#F2F3F5' }}>
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: 10 }}>
                            <Image source={Images.ImageJee.icTimKiemTextInput} resizeMode='cover' style={[{ marginLeft: 5 }]} />
                            <TextInput
                                placeholder={RootLang.lang.JeeWork.timkiem}
                                value={noidung_Tk}
                                autoCorrect={false}
                                numberOfLines={2}
                                onChangeText={(text) => this.setState({ noidung_Tk: text }, () => {
                                    this._getDSDuAn()
                                })}
                                style={[{
                                    paddingLeft: 11, fontSize: sizes.sText14,
                                    color: colors.black
                                }]}
                            />
                        </View>
                        <TouchableOpacity onPress={() => this.deleteSearch()} style={{ paddingRight: 10 }}>
                            <Image source={Images.ImageJee.icXoaLuaChon} resizeMode='cover' style={[, { marginRight: 10 }]} />
                        </TouchableOpacity>
                    </View>
                    {/* <TouchableOpacity style={{ padding: 6, alignItems: 'center', justifyContent: 'center', marginLeft: 5 }}>
                        <Image source={Images.ImageJee.icLoc} resizeMode='cover' style={[, { marginLeft: 5 }]} />

                    </TouchableOpacity> */}
                </View>
                <View style={{ flex: 1, backgroundColor: colors.white, }}>

                    <FlatList
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        data={listDuAn}
                        renderItem={this._renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        extraData={this.state}
                        refreshing={refreshing}
                        initialNumToRender={5}
                        maxToRenderPerBatch={10}
                        windowSize={7}
                        updateCellsBatchingPeriod={100}
                        onRefresh={this._onRefresh}
                        ListEmptyComponent={listDuAn.length == 0 && dataLoad == false ? <ListEmptyLottie style={{ justifyContent: 'center', alignItems: 'center', }} textempty={RootLang.lang.JeeWork.khongcodulieu} /> : null}
                    />
                </View>
                <IsLoading />
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

export default Utils.connectRedux(ChonDuAn, mapStateToProps, true)


