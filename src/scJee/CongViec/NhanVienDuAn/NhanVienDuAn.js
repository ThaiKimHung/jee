import React, { Component } from 'react';
import { FlatList, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { getListNhanVien, getListNhanVienTheoDuAn } from '../../../apis/JeePlatform/API_JeeWork/apiDSNhanVien';
import { RootLang } from '../../../app/data/locales';
import Utils from '../../../app/Utils';
import Header_TaoBaiDang from '../../../components/Header_TaoBaiDang';
import ListEmptyLottie from '../../../components/NewComponents/ListEmptyLottie';
import { Images } from '../../../images';
import { colors } from '../../../styles';
import { reText, sizes } from '../../../styles/size';
import { Height, nstyles, Width, paddingBotX } from '../../../styles/styles';
import _ from 'lodash'
import UtilsApp from '../../../app/UtilsApp';
import IsLoading from '../../../components/IsLoading';
class NhanVienDuAn extends Component {
    constructor(props) {
        super(props);
        this.dataSelect = Utils.ngetParam(this, 'selectedUser', [])
        this.callback = Utils.ngetParam(this, 'callback');
        this.idDuAn = Utils.ngetParam(this, 'idDuAn');
        this.onlyOne = Utils.ngetParam(this, 'onlyOne', false);
        this.loai = Utils.ngetParam(this, 'loai', 0)
        this.hideCheckBoxOnly = Utils.ngetParam(this, 'hideCheckBoxOnly', false)
        this.create = Utils.ngetParam(this, 'create', false)
        this.nthis = this.props.nthis;
        this.state = {
            noidung_Tk: '',
            listUser: [],
            listUserSearch: [],
            refreshing: false,
            selectedUser: this.onlyOne && !this.create ? Utils.ngetParam(this, 'nvCoSan', []) : this.dataSelect.length > 0 ? this.dataSelect : [],
            dataLoad: true,
            nvCoSan: this.dataSelect.length > 0 ? this.dataSelect : Utils.ngetParam(this, 'nvCoSan', [])
        };

    }
    componentDidMount = async () => {
        nthisLoading.show()
        await this._loadDsNhanVien().then(res => {
            if (res == true) {
                nthisLoading.hide()
                if (this.state.listUser?.length > 0) {
                    this.setState({ dataLoad: true })
                }
                else this.setState({ dataLoad: false })
            }
        });
    }

    _loadDsNhanVien = async () => {
        var { nvCoSan } = this.state
        const res = await getListNhanVien(this.idDuAn)
        if (res.status == 1) {
            this.setState({
                listUser: res.data.map((obj, index) => ({ ...obj, check: nvCoSan ? this._containsObject(nvCoSan, obj) : false, loai: this.loai })),
                listUserSearch: res.data.map((obj, index) => ({ ...obj, check: nvCoSan ? this._containsObject(nvCoSan, obj) : false, loai: this.loai })),
                refreshing: false,
            })
        }
        else {
            this.setState({ refreshing: false })
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
        }
        return true
    }

    _containsObject(obj, list) {
        let checkExit = obj.some((item) => item.id_nv == list.id_nv)
        return checkExit
    }

    hashCode = (str) => {
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return hash;
    }

    intToRGB = (i) => {
        var c = (i & 0x00FFFFFF)
            .toString(16)
            .toUpperCase();

        return "#" + "00000".substring(0, 6 - c.length) + c;
    }

    _ChonUser = async (itemChoice) => {
        var { listUser, selectedUser } = this.state
        listUser.map((item) => {
            if (item.id_nv === itemChoice.id_nv) {
                item.check = !item.check
                if (item.check === true) {
                    selectedUser.push(item);
                } else if (item.check === false) {
                    // const i = this.state.selectedUser.indexOf(item.id_nv)
                    let i = -1
                    this.state.selectedUser.map((val, index) => {
                        if (item.id_nv == val.id_nv)
                            i = index
                    })
                    this.state.selectedUser.splice(i, 1)
                    return this.state.selectedUser
                }
            }
        }
        )

        // })
        this.setState({ listUser: listUser })

    }
    _onRefresh = () => {
        this._loadDsNhanVien()
    }

    _renderItem_MangChon = ({ item, index }) => {
        return (
            <TouchableOpacity style={{ flex: 1, flexDirection: 'row', borderRadius: 10, }}
                onPress={() => this.onlyOne == true ? this._goBackOnlyOne(item) : this._ChonUser(item)}>
                <View style={[{ flexDirection: 'row', }]}>
                    {item.image ? <Image source={{ uri: item.image }} resizeMode='cover' style={[nstyles.nAva40, {}]} /> :
                        <View
                            style={{
                                borderRadius: 99999,
                                width: Width(10),
                                height: Width(10),
                                backgroundColor: this.intToRGB(this.hashCode(item.hoten)),
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <Text style={{ fontWeight: "bold", fontSize: reText(14), color: colors.white }}> {String(item.hoten).split(" ").slice(-1).toString().slice(0, 2).toString()}</Text>
                        </View>}
                </View>
            </TouchableOpacity>
        )
    }

    _goBackOnlyOne = (item) => {
        this.callback(item);
        Utils.goback(this);
    }

    _goback = () => {
        const { selectedUser } = this.state
        this.callback(selectedUser);
        Utils.goback(this);
    }

    _renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity style={{ backgroundColor: colors.white, flex: 1, flexDirection: 'row', marginVertical: 8, maxWidth: '90%', paddingBottom: index != this.state.listUser.length - 1 ? 0 : paddingBotX + 10 }}
                onPress={() => this.onlyOne == true ? this._goBackOnlyOne(item) : this._ChonUser(item)}>
                {this.hideCheckBoxOnly ? null :
                    <View style={{ marginRight: 20, justifyContent: 'center' }}>
                        <Image source={item.check == true ? Images.ImageJee.icTouchDaChon : Images.ImageJee.icTouchChuaChon} resizeMode='cover' style={[{}]} />
                    </View>}
                <View style={[{ flexDirection: 'row', }]}>
                    {item.image ? <Image source={{ uri: item.image }} resizeMode='cover' style={[nstyles.nAva40, {}]} /> :
                        <View
                            style={{
                                marginRight: 10,
                                borderRadius: 99999,
                                width: Width(10),
                                height: Width(10),
                                backgroundColor: this.intToRGB(this.hashCode(item.hoten)),
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <Text style={{ fontWeight: "bold", fontSize: reText(14), color: colors.white }}> {String(item.hoten).split(" ").slice(-1).toString().slice(0, 2).toString()}</Text>
                        </View>}
                    <View style={[{ marginLeft: 12, justifyContent: 'center' }]}>
                        <Text style={{ fontWeight: 'bold', fontSize: sizes.sText14 }}>{item.hoten}</Text>
                    </View>
                </View>
            </TouchableOpacity >
        );
    }

    SearchData = async (textSearch) => {
        let datanew = this.state.listUserSearch.filter(item => Utils.removeAccents(item['hoten']).toUpperCase().includes(Utils.removeAccents(textSearch.toUpperCase())))
        this.setState({ listUser: datanew })
    }


    render() {
        var { noidung_Tk, listUser, selectedUser, dataLoad, refreshing } = this.state
        return (
            <View style={{ flex: 1, height: Height(100), backgroundColor: colors.white, }}>

                <Header_TaoBaiDang
                    nthis={this}
                    textRight={this.onlyOne == true ? "" : RootLang.lang.JeeWork.xong}
                    styTextRight={[{ fontSize: sizes.sText15, color: '#0E72D8' }]}
                    iconLeft={Images.ImageJee.icArrowNext}
                    styIconLeft={{ tintColor: colors.black }}
                    onPressLeft={() => { Utils.goback(this) }}
                    onPressRight={() => { this.onlyOne == true ? null : this._goback() }}
                    textleft={RootLang.lang.thongbaochung.trolai}
                    styTextLeft={{ fontSize: sizes.sText15, }}
                />
                <View style={{ flex: 1 }}>
                    <View style={{ width: Width(100), borderBottomWidth: 0.3, borderColor: colors.black_20, }} >
                        {this.state.selectedUser != '' ? (

                            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
                                <FlatList
                                    ref={ref => this.selectedUser = ref}
                                    onContentSizeChange={() => this.selectedUser.scrollToEnd({ animated: true })}
                                    showsHorizontalScrollIndicator={false}
                                    showsVerticalScrollIndicator={false}
                                    horizontal={true}
                                    style={{ maxWidth: '100%', paddingBottom: 15, backgroundColor: 'white', }}
                                    data={selectedUser}
                                    renderItem={this._renderItem_MangChon}
                                    keyExtractor={(item, index) => index.toString()}
                                    contentContainerStyle={{}}
                                />
                                {/* {this.onlyOne == true ? null : */}
                                {/* <TouchableOpacity style={{ position: 'absolute', right: 10, paddingRight: 5, }}
                                onPress={() => this.setState({ selectedUser: [] }, () => {
                                    this._loadDsNhanVien()
                                })}>
                                <Image source={Images.ImageJee.icDelete_TimKiem} resizeMode='cover' style={[nstyles.nIcon12, { tintColor: '#000000', justifyContent: 'center', alignItems: 'center' }]} />
                            </TouchableOpacity> */}
                            </View>
                        ) : null}

                        <View style={{ justifyContent: 'center', paddingBottom: 15, backgroundColor: 'white' }}>
                            <View style={{ alignItems: 'center', marginHorizontal: 10, flexDirection: 'row', backgroundColor: '#F2F3F5', borderRadius: 20, paddingLeft: 10 }}>
                                <Image source={Images.ImageJee.icTimKiemSocial} resizeMode='cover' style={[nstyles.nIcon26, {}]} />
                                <TextInput
                                    placeholder={RootLang.lang.JeeWork.timkiem}
                                    value={noidung_Tk}
                                    autoCorrect={false}
                                    numberOfLines={2}
                                    onChangeText={(text) => {
                                        this.setState({ noidung_Tk: text })
                                        this.SearchData(text)
                                    }
                                    }
                                    style={[{
                                        paddingVertical: Platform.OS == 'ios' ? 10 : 3, paddingLeft: 10, fontSize: reText(16),
                                        color: colors.black, flex: 1
                                    }]}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={{ flex: 1 }}>
                        <View style={{ marginHorizontal: 10 }}>
                            <FlatList
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                                style={{}}
                                data={listUser}
                                keyExtractor={(item, index) => index.toString()}
                                extraData={this.state}
                                refreshing={refreshing}
                                initialNumToRender={5}
                                maxToRenderPerBatch={10}
                                windowSize={7}
                                updateCellsBatchingPeriod={100}
                                onRefresh={this._onRefresh}
                                renderItem={this._renderItem}
                                keyExtractor={(item, index) => index.toString()}
                                ListEmptyComponent={listUser.length == 0 && dataLoad == false ? <ListEmptyLottie style={{ justifyContent: 'center', alignItems: 'center', }} textempty={RootLang.lang.JeeWork.khongcodulieu} /> : null}
                            />
                        </View>
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
export default Utils.connectRedux(NhanVienDuAn, mapStateToProps, true)


