import React, { Component } from 'react';
import { Animated, BackHandler, FlatList, Image, Platform, Text, TextInput, TouchableOpacity, View, StyleSheet } from "react-native";
import { isIphoneX } from 'react-native-iphone-x-helper';
import { getAllUser, taoNhomMoi } from '../../../apis/JeePlatform/Api_JeeSocial/apiJeeSocial';
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import { RootLang } from '../../../app/data/locales';
import Utils from '../../../app/Utils';
import UtilsApp from '../../../app/UtilsApp';
import IsLoading from '../../../components/IsLoading';
import ListEmpty from '../../../components/ListEmpty';
import { Images } from '../../../images';
import { colors } from '../../../styles';
import { reText, sizes } from '../../../styles/size';
import { nstyles, paddingBotX } from '../../../styles/styles';
import ImageCus from '../../../components/NewComponents/ImageCus';
class TaoNhom extends Component {
    constructor(props) {
        super(props);
        this.item = Utils.ngetParam(this, 'title', '')
        this.nthis = this.props.nthis;
        this.state = {
            opacity: new Animated.Value(0),
            tennhom: '',
            mangChon: [],
            searchText: '',
            listUser: [],
            refreshing: false,
            selectedUser: [],
            id: [],
            searchText: '',
            filteredData: [],
        }
    }

    componentDidMount = async () => {
        BackHandler.addEventListener("hardwareBackPress", this._goback);
        this._loadDsUser()
    }

    componentWillUnmount() {
        try {
            BackHandler.removeEventListener('hardwareBackPress', this._goback)
        }
        catch (error) {

        }
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

    _goback = async () => {
        Utils.goback(this, null)
        return true
    }

    _go_XemThanhVien = () => {
        Utils.goscreen(this, 'sc_TimKiem_ThanVienNhom', { nthis: this.nthis })
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


    _loadDsUser = async () => {
        var { listUser } = this.state
        nthisLoading.show()
        let res = await getAllUser();
        // Utils.nlog("list user-------------------------", res)
        if (res.status == 1) {
            nthisLoading.hide()
            this.setState({ listUser: res.data.map(obj => ({ ...obj, check: false })), refreshing: false, })
        } else {
            nthisLoading.hide()
            this.setState({ refreshing: false, })
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
        }
    }

    _ChonUser = async (itemChoice) => {
        var { listUser, selectedUser, id } = this.state
        listUser.map((item) => {
            if (item === itemChoice) {
                item.check = !item.check
                if (item.check === true) {
                    selectedUser.push(item);
                    id.push({ "userId": item.UserId });
                } else if (item.check === false) {
                    const i = this.state.selectedUser.indexOf(item)
                    if (1 != -1) {
                        this.state.selectedUser.splice(i, 1)
                        this.state.id.splice(i, 1)
                        return this.state.selectedUser
                    }
                }
            }
        })
        this.setState({ listUser: listUser })
    }

    _xoaAll_selectedUser = () => {
        var { listUser, selectedUser, id } = this.state
        listUser.map((item) => {
            if (item.check === true) {
                item.check = !item.check
                const i = selectedUser.indexOf(item)
                if (1 != -1) {
                    this.state.selectedUser.splice(i, 1)
                    this.state.id.splice(i, 1)
                    return this.state.selectedUser
                }
            }
        })
        this.setState({ listUser: listUser })
    }

    _taoNhom = async () => {
        // Utils.nlog('id', this.state.id)
        let strbody = JSON.stringify({
            "ten_group": this.state.tennhom,
            "avatar_group": "",
            "listGR_Members": this.state.id
        })
        nthisLoading.show()
        // Utils.nlog('body', strbody)
        let res = await taoNhomMoi(strbody)
        // Utils.nlog('res tạo nhóm', res)
        if (res.status == 1) {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.JeeSocial.taonhomthanhcong, 1)
            ROOTGlobal.LoadDanhSachBaiDang_Nhom.LoadDSBaiDang_Nhom(), ROOTGlobal.LoadDanhSachGroup.LoadDSGroup()
            nthisLoading.hide()
            this._goback()
        } else {
            nthisLoading.hide()
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
        }
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


    _renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity style={{ backgroundColor: colors.white, flexDirection: 'row', marginVertical: 8, }}
                onPress={() => this._ChonUser(item)}>
                <View style={{ marginRight: 20, justifyContent: 'center' }}>
                    <Image source={item.check == true ? Images.ImageJee.icTouchDaChon : Images.ImageJee.icTouchChuaChon} resizeMode='cover' style={[{}]} />
                </View>
                <View style={[{ flexDirection: 'row', }]}>
                    {
                        item?.Avatar ?
                            <ImageCus
                                style={nstyles.nAva40}
                                source={{ uri: item?.Avatar }}
                                resizeMode={"cover"}
                                defaultSourceCus={Images.icAva}
                            /> :
                            <View style={[nstyles.nAva40, {
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

    render() {
        const { opacity, tennhom, searchText, selectedUser, listUser, filteredData } = this.state
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: '#E4E6EB', }]}>
                <View style={[nstyles.nHcontent, { paddingHorizontal: 15, height: isIphoneX() ? 80 : 60, width: '100%', borderBottomWidth: 0.3, borderColor: '#D1D1D1', }]} resizeMode='cover' >
                    <View style={[nstyles.nrow, {
                        flexDirection: 'row', flex: 1, height: isIphoneX() ? 80 : 60, justifyContent: 'center', alignItems: 'center'
                    }]}>
                        <TouchableOpacity
                            style={{
                                paddingRight: 20, height: isIphoneX() ? 80 : 60, alignItems: 'center', justifyContent: 'center'
                            }}
                            activeOpacity={0.5}
                            onPress={this._goback}>
                            <View style={{ flexDirection: 'row', }}>
                                <Image
                                    source={Images.ImageJee.icBack}
                                    resizeMode={'cover'}
                                    style={[{ tintColor: "#707070" }]}
                                />
                            </View>
                        </TouchableOpacity>
                        <View
                            style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: this.state.tennhom == '' ? 20 : 0,
                                height: isIphoneX() ? 80 : 60,
                                // backgroundColor: 'red',
                                marginLeft: this.state.tennhom == '' ? 0 : 30
                            }} >
                            <Text style={{
                                lineHeight: sizes.sText24,
                                fontSize: reText(15),
                                color: colors.black,
                                fontWeight: "bold"
                            }}>{RootLang.lang.JeeSocial.taonhom}</Text>

                        </View>
                        {this.state.tennhom != '' ? (<TouchableOpacity
                            onPress={() => this._taoNhom()}
                            style={[{ paddingLeft: 20, paddingVertical: 5 }]}>
                            <Text style={{ color: '#0E72D8', fontSize: sizes.sText15 }}>{RootLang.lang.JeeSocial.xong}</Text>
                        </TouchableOpacity>) : (null)}
                    </View>
                </View >
                <View style={{ flex: 1, paddingTop: 5, paddingBottom: paddingBotX }}>
                    <View style={{ borderTopmWidth: 0.3, borderColor: '#E4E6EB', backgroundColor: colors.white, }}>
                        <View style={[{ borderBottomWidth: 1, borderColor: '#D1D1D1', justifyContent: 'center', }]}>
                            <Text style={{ fontSize: reText(15), padding: 10, marginBottom: 2 }}>{RootLang.lang.JeeSocial.tennhom}</Text>
                        </View>
                        <View style={{ paddingHorizontal: 10, paddingVertical: Platform.OS == 'ios' ? 15 : 3, }}>
                            <TextInput
                                placeholder={RootLang.lang.JeeSocial.tennhom}
                                value={tennhom}
                                autoCorrect={false}
                                onChangeText={(text) => this.setState({ tennhom: text })}
                                style={[{}]}
                            />
                        </View>
                    </View>

                    <View style={{ flex: 1, paddingTop: 5, }}>
                        <View style={{ backgroundColor: colors.white, flex: 1, }}>
                            <View style={{ justifyContent: 'center', }}>
                                <View style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
                                    <Text style={{ fontSize: reText(16), fontWeight: '500' }}>{RootLang.lang.JeeSocial.moithanhvien}</Text>
                                </View>
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
                            </View>
                            <View style={{ paddingHorizontal: 10, flex: 1 }}>
                                {
                                    searchText ?
                                        <FlatList
                                            extraData={this.state}
                                            showsHorizontalScrollIndicator={false}
                                            showsVerticalScrollIndicator={false}
                                            style={{}}
                                            data={this.state.filteredData}
                                            renderItem={this._renderItem}
                                            keyExtractor={(item, index) => index.toString()}
                                            ListEmptyComponent={filteredData.length == 0 ? <ListEmpty style={{ justifyContent: 'center', alignItems: 'center', }} textempty={'Không có dữ liệu'} /> : null}
                                        />
                                        :
                                        <FlatList
                                            extraData={this.state}
                                            showsHorizontalScrollIndicator={false}
                                            showsVerticalScrollIndicator={false}
                                            style={{}}
                                            data={this.state.listUser}
                                            renderItem={this._renderItem}
                                            keyExtractor={(item, index) => index.toString()}
                                            ListEmptyComponent={!this.state.listUser ? <ListEmpty style={{ justifyContent: 'center', alignItems: 'center', }} textempty={'Không có dữ liệu'} /> : null}
                                        />
                                }
                            </View>
                        </View>
                    </View>
                    <IsLoading />
                </View>
            </View >
        )
    }
}

const styles = StyleSheet.create({
    textName: {
        alignSelf: "center", fontWeight: "bold", fontSize: reText(16), color: colors.white
    },
});

const mapStateToProps = state => ({
    lang: state.changeLanguage.language,
});
export default Utils.connectRedux(TaoNhom, mapStateToProps, true)