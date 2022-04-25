import React, { Component } from 'react';
import { BackHandler, FlatList, Image, Platform, Text, TextInput, TouchableOpacity, View, StyleSheet } from "react-native";
import { GetDSUser_NotIn_InGroup, themThanhVien } from '../../../apis/JeePlatform/Api_JeeSocial/apiJeeSocial';
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import { RootLang } from '../../../app/data/locales';
import Utils from '../../../app/Utils';
import UtilsApp from '../../../app/UtilsApp';
import Header_TaoBaiDang from '../../../components/Header_TaoBaiDang';
import IsLoading from '../../../components/IsLoading';
import ListEmptyLottie_Social from '../../../components/NewComponents/ListEmptyLottie_Social';
import { Images } from '../../../images';
import { colors } from '../../../styles';
import { reText } from '../../../styles/size';
import { nstyles, paddingBotX } from '../../../styles/styles';
import ImageCus from '../../../components/NewComponents/ImageCus';
import ListEmpty from '../../../components/ListEmpty';

class ThemThanhVien extends Component {
    constructor(props) {
        super(props);
        this.data = Utils.ngetParam(this, 'data', '')
        this.homesocial = Utils.ngetParam(this, 'homesocial', false)
        this.state = {
            listUser: [],
            refreshing: false,
            selectedUser: [],
            searchText: '',
            filteredData: [],
            id: [],
            dsgroup: [],
            empty: false
        };
        this.nthis = this.props.nthis;
    }
    componentDidMount = async () => {
        BackHandler.addEventListener("hardwareBackPress", this._goback);
        await this._loadDsUser_Not_InGroup()
    }

    componentWillUnmount() {
        try {
            BackHandler.removeEventListener('hardwareBackPress', this._goback)
        }
        catch (error) {
        }
    }

    _loadDsUser_Not_InGroup = async () => {
        nthisLoading.show()
        let res = await GetDSUser_NotIn_InGroup(this.homesocial ? this.data?.Group[0]?.id_group : this.data?.ID_group);
        // Utils.nlog("list user not in group-------------------------", res)
        if (res.status == 1) {
            nthisLoading.hide()
            this.setState({ listUser: res.data.map(obj => ({ ...obj, check: false })), refreshing: false, empty: false })
        } else {
            nthisLoading.hide()
            this.setState({ refreshing: false, empty: true })
            // UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
        }
    }

    _search = (searchText) => {
        this.setState({ searchText: searchText });
        let filteredData = this.state.listUser.filter((item) =>
            Utils.removeAccents(item['Fullname'])
                .toUpperCase()
                .includes(Utils.removeAccents(searchText.toUpperCase())),
        );
        this.setState({ filteredData: filteredData });
    };

    _ChonUser = async (itemChoice) => {
        const { listUser, selectedUser, id } = this.state
        listUser.map((item) => {
            if (item === itemChoice) {
                item.check = !item.check
                if (item.check === true) {
                    selectedUser.push(item);
                    id.push({ "userId": item.UserId, "username": item.Username, "quyen_group": false, });
                } else if (item.check === false) {
                    const i = selectedUser.indexOf(item)
                    if (1 != -1) {
                        selectedUser.splice(i, 1)
                        id.splice(i, 1)
                        return selectedUser
                    }
                }
            }
        })
        this.setState({ listUser: listUser })
    }

    _xoaAll_selectedUser = () => {
        const { listUser, selectedUser, id } = this.state
        listUser.map((item) => {
            if (item.check === true) {
                item.check = !item.check
                const i = selectedUser.indexOf(item)
                if (1 != -1) {
                    selectedUser.splice(i, 1)
                    id.splice(i, 1)
                    return selectedUser
                }
            }
        })
        this.setState({ listUser: listUser })
    }

    _renderItem_MangChon = ({ item, index }) => {
        return (
            <TouchableOpacity style={{ backgroundColor: '#E7F3FF', flex: 1, flexDirection: 'row', padding: 10, borderRadius: 10, marginRight: 5, }}
                onPress={() => this._ChonUser(item)}>
                <View style={[{}]}>
                    <Text style={{ fontSize: reText(12), color: '#0E72D8' }}>{item.Fullname}</Text>
                </View>
            </TouchableOpacity>
        );
    }
    _goback = () => {
        Utils.goback(this, '');
        return true
    }


    _themThanhVien = async () => {
        nthisLoading.show()
        let strbody = JSON.stringify({
            "list_Member": this.state.id
        })
        // Utils.nlog('body', strbody)
        let res = await themThanhVien(this.homesocial ? this.data?.Group[0]?.id_group : this.data?.ID_group, strbody)
        // Utils.nlog('res tạo nhóm', res)
        if (res.status == 1) {
            ROOTGlobal.LoadDanhSach_Member.LoadDSMember()
            this._goback()
            nthisLoading.hide()
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.JeeSocial.themthanhvienthanhcong, 1)
        } else {
            nthisLoading.hide()
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
        }
    }

    _renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity style={{ backgroundColor: colors.white, flex: 1, flexDirection: 'row', marginVertical: 8, maxWidth: '90%' }}
                onPress={() => this._ChonUser(item)}>
                <View style={{ marginRight: 20, justifyContent: 'center' }}>
                    <Image source={item.check == true ? Images.ImageJee.icTouchDaChon : Images.ImageJee.icTouchChuaChon} resizeMode='cover' style={[{}]} />
                </View>
                <View style={[{ flexDirection: 'row', }]}>
                    {
                        item?.Avatar ?
                            <ImageCus
                                style={nstyles.nAva35}
                                source={{ uri: item?.Avatar }}
                                resizeMode={"cover"}
                                defaultSourceCus={Images.icAva}
                            /> :
                            <View style={[nstyles.nAva35, {
                                backgroundColor: this.intToRGB(this.hashCode(item.Fullname)),
                                flexDirection: "row", justifyContent: 'center', alignItems: 'center'
                            }]}>
                                <Text style={styles.textName}>{String(item.Fullname).split(" ").slice(-1).toString().slice(0, 2).toString()}</Text>
                            </View>
                    }
                    <View style={[{ marginLeft: 12, justifyContent: 'center' }]}>
                        <Text style={{ fontWeight: 'bold', fontSize: reText(12) }}>{item.Fullname}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
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

    render() {
        const { searchText } = this.state
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: '#E4E6EB', }]}>
                <Header_TaoBaiDang
                    nthis={this}
                    title={RootLang.lang.JeeSocial.themthanhvien}
                    textRight={this.state.selectedUser.length > 0 ? RootLang.lang.JeeSocial.xong : ""}
                    styTextRight={[{ fontSize: reText(15), color: '#0E72D8' }]}
                    iconLeft={Images.ImageJee.icArrowNext}
                    styIconLeft={{ tintColor: colors.black }}
                    onPressLeft={this._goback}
                    onPressRight={this._themThanhVien}
                />
                <View style={{ flex: 1, backgroundColor: colors.white, paddingBottom: paddingBotX }}>
                    <View style={{ backgroundColor: colors.white, flex: 1 }}>
                        <View style={{ borderTopWidth: 0.3, borderBottomWidth: 0.3, borderColor: '#D1D1D1', justifyContent: 'center', }}>
                            {this.state.selectedUser.length > 0 ?
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ flex: 1 }}>
                                        <FlatList
                                            nestedScrollEnabled
                                            showsHorizontalScrollIndicator={false}
                                            showsVerticalScrollIndicator={false}
                                            horizontal={true}
                                            style={{ paddingVertical: 10, paddingHorizontal: 10 }}
                                            data={this.state.selectedUser}
                                            renderItem={this._renderItem_MangChon}
                                            keyExtractor={(item, index) => index.toString()}
                                        />
                                    </View>
                                    <TouchableOpacity style={{ paddingHorizontal: 10, }}
                                        onPress={this._xoaAll_selectedUser}>
                                        <Image source={Images.ImageJee.icDelete_TimKiem} resizeMode='cover' style={[nstyles.nIcon12, { tintColor: '#000000', justifyContent: 'center', alignItems: 'center' }]} />
                                    </TouchableOpacity>
                                </View>
                                : null}
                            <View style={{ alignItems: 'center', flexDirection: 'row', }}>
                                <Image source={Images.ImageJee.icTimKiemTextInput} resizeMode='cover' style={[nstyles.nIcon14, { marginHorizontal: 5 }]} />
                                <View style={{ flex: 1, paddingHorizontal: 10, paddingVertical: Platform.OS == 'ios' ? 15 : 3, }}>
                                    <TextInput
                                        style={{}}
                                        placeholder={RootLang.lang.JeeSocial.timkiem}
                                        onChangeText={this._search}
                                        underlineColorAndroid="transparent"
                                        value={searchText}
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={{ paddingHorizontal: 10, flex: 1, }}>
                            {
                                searchText ?
                                    <FlatList
                                        extraData={this.state}
                                        showsHorizontalScrollIndicator={false}
                                        showsVerticalScrollIndicator={false}
                                        style={{ paddingLeft: 10 }}
                                        data={this.state.filteredData}
                                        renderItem={this._renderItem}
                                        keyExtractor={(item, index) => index.toString()}
                                        ListEmptyComponent={this.state.filteredData.length == 0 ? <ListEmpty style={{ justifyContent: 'center', alignItems: 'center', }} textempty={'Không có dữ liệu'} /> : null}
                                    // ListEmptyComponent={this.state.listUser.length == 0 ? <ListEmptyLottie_Social_Group style={{ justifyContent: 'center', alignItems: 'center', }} textempty={RootLang.lang.JeeSocial.khongcothanhviennao} /> : null}
                                    />
                                    :
                                    <FlatList
                                        extraData={this.state}
                                        showsHorizontalScrollIndicator={false}
                                        showsVerticalScrollIndicator={false}
                                        style={{ paddingLeft: 10 }}
                                        data={this.state.listUser}
                                        renderItem={this._renderItem}
                                        keyExtractor={(item, index) => index.toString()}
                                        ListEmptyComponent={this.state.listUser.length == 0 ? <ListEmptyLottie_Social style={{ justifyContent: 'center', alignItems: 'center', }} textempty={this.state.empty ? RootLang.lang.JeeSocial.khongcothanhviennao : null} /> : null}
                                    // ListEmptyComponent={this.state.listUser.length == 0 ? <ListEmptyLottie_Social_Group style={{ justifyContent: 'center', alignItems: 'center', }} textempty={RootLang.lang.JeeSocial.khongcothanhviennao} /> : null}
                                    />
                            }

                        </View>
                    </View>
                </View>
                <IsLoading />
            </View >
        );
    }
};

const styles = StyleSheet.create({
    textName: {
        alignSelf: "center", fontWeight: "bold", fontSize: reText(16), color: colors.white
    },
});

const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(ThemThanhVien, mapStateToProps, true)
