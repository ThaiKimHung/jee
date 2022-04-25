import React, { Component } from 'react';
import { FlatList, Image, ScrollView, Text, TextInput, TouchableOpacity, View, Platform, BackHandler } from "react-native";
import { getAllUser } from '../../../apis/JeePlatform/Api_JeeSocial/apiJeeSocial';
import { RootLang } from '../../../app/data/locales';
import Utils from '../../../app/Utils';
import Header_TaoBaiDang from '../../../components/Header_TaoBaiDang';
import IsLoading from '../../../components/IsLoading';
import ListEmpty from '../../../components/ListEmpty';
import { Images } from '../../../images';
import { colors } from '../../../styles';
import { reText, sizes } from '../../../styles/size';
import { nstyles, Width, paddingBotX } from '../../../styles/styles';
import ListEmptyLottie_Social_Group from '../../../components/NewComponents/ListEmptyLottie_Social_Group';
import _ from 'lodash'
import UtilsApp from '../../../app/UtilsApp';
import ImageCus from '../../../components/NewComponents/ImageCus';
class Modal_UserTag extends Component {
    constructor(props) {
        super(props);
        this.callback = Utils.ngetParam(this, 'callback');
        // this.khenthuong = Utils.ngetParam(this, 'khenthuong', '');
        this.idloaibaidang = Utils.ngetParam(this, 'idloaibdaidang', 0);
        this.gioihan = Utils.ngetParam(this, 'gioihan', false);
        this.state = {
            noidung_Tk: '',
            listUser: [],
            refreshing: false,
            nvCoSan: Utils.ngetParam(this, 'userTag', []),
            selectedUser: [],
            searchText: '',
            filteredData: [],
        };
        this.nthis = this.props.nthis;
    }
    componentDidMount = async () => {
        BackHandler.addEventListener("hardwareBackPress", this._goback);
        this._loadDsUser()
    }

    componentWillUnmount() {
        try {
            BackHandler.removeEventListener('hardwareBackPress', this._goback)
        }
        catch (error) { }
    }

    _loadDsUser = async () => {
        var { listUser, nvCoSan, selectedUser } = this.state
        nthisLoading.show()
        let res = await getAllUser();
        // Utils.nlog("list user-------------------------", res)
        if (res.status == 1) {
            nthisLoading.hide()
            this.setState({ listUser: res.data.map(obj => ({ ...obj, check: nvCoSan ? (this._containsObject(nvCoSan, obj)) : false })), refreshing: false }, async () => await this._check(this.state.listUser))
        } else {
            nthisLoading.hide()
            this.setState({ refreshing: false, })
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
        }
    }

    _containsObject(obj, list) {
        let checkExit = ""
        this.idloaibaidang == 2 ?
            checkExit = obj.some((item) => item.userId == list.UserId)
            : checkExit = obj.some((item) => item.Username == list.Username)
        return checkExit
    }

    _ChonUser = async (itemChoice) => {
        var { listUser, selectedUser } = this.state
        if (this.gioihan == true) {
            if (selectedUser.length < 5) {
                listUser.map((item) => {
                    if (item === itemChoice) {
                        item.check = !item.check
                        if (item.check === true) {
                            selectedUser.push(item);
                        } else if (item.check === false) {
                            const i = this.state.selectedUser.indexOf(item)
                            if (1 != -1) {
                                this.state.selectedUser.splice(i, 1)
                                return this.state.selectedUser
                            }
                        }
                    }
                })
            }
            else {
                if (itemChoice.check == true) {
                    listUser.map((item) => {
                        if (item === itemChoice) {
                            item.check = !item.check
                            if (item.check === true) {
                                selectedUser.push(item);
                            } else if (item.check === false) {
                                const i = this.state.selectedUser.indexOf(item)
                                if (1 != -1) {
                                    this.state.selectedUser.splice(i, 1)
                                    return this.state.selectedUser
                                }
                            }
                        }
                    })
                }
                else {
                    UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, 'Chỉ có thể chọn tối đa 5 người!!', 3)
                }
            }
        }
        else {
            listUser.map((item) => {
                if (item === itemChoice) {
                    item.check = !item.check
                    if (item.check === true) {
                        selectedUser.push(item);
                    } else if (item.check === false) {
                        const i = this.state.selectedUser.indexOf(item)
                        if (1 != -1) {
                            this.state.selectedUser.splice(i, 1)
                            return this.state.selectedUser
                        }
                    }
                }
            })
        }
        this.setState({ listUser: listUser })
    }

    _check = async (list) => {
        list.map((item) => {
            if (item.check === true) {
                this.state.selectedUser.push(item);
                this.setState({
                    selectedUser: this.state.selectedUser
                })
            }
        })
    }

    _renderItem_MangChon = ({ item, index }) => {
        return (
            <>
                {
                    item.check == true ?
                        <TouchableOpacity style={{ backgroundColor: '#E7F3FF', flex: 1, flexDirection: 'row', padding: 10, borderRadius: 10, marginRight: 5, }}
                            onPress={() => this._ChonUser(item)}>
                            <View style={[{}]}>
                                <Text style={{ fontSize: reText(12), color: '#0E72D8' }}>{item.Fullname}</Text>
                            </View>
                        </TouchableOpacity>
                        : null}
            </>
        );
    }

    _goback = () => {
        Utils.goback(this, null);
        return true
    }

    _select = (item) => () => {
        this.callback(item);
        this._goback();
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

    _xoaAll_selectedUser = () => {
        const { listUser, selectedUser, id } = this.state
        listUser.map((item) => {
            if (item.check === true) {
                item.check = !item.check
                const i = selectedUser.indexOf(item)
                if (1 != -1) {
                    selectedUser.splice(i, 1)
                    return selectedUser
                }
            }
        })
        this.setState({ listUser: listUser })
    }

    _renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity style={{ backgroundColor: colors.white, flex: 1, flexDirection: 'row', marginVertical: 8, maxWidth: '90%' }}
                onPress={() => this._ChonUser(item)}>
                <View style={{ justifyContent: 'center' }}>
                    <Image source={item.check == true ? Images.ImageJee.icTouchDaChon : Images.ImageJee.icTouchChuaChon} resizeMode='cover' style={[{}]} />
                </View>
                <View style={[{ flexDirection: 'row', paddingLeft: 10 }]}>
                    {item.Avatar ? <ImageCus
                        style={[nstyles.nAva32, {}]}
                        source={{ uri: item.Avatar }}
                        resizeMode={"cover"}
                        defaultSourceCus={Images.icAva}
                    /> :
                        <Image source={Images.icAva} resizeMode={"contain"} style={[nstyles.nAva32, {}]} />
                    }
                    <View style={[{ marginLeft: 12, justifyContent: 'center' }]}>
                        <Text style={{ fontWeight: 'bold', fontSize: reText(12) }}>{item.Fullname}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    render() {
        const { noidung_Tk, listUser, selectedUser } = this.state
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: '#E4E6EB', }]}>
                <Header_TaoBaiDang
                    nthis={this}
                    // title={}
                    textRight={this.state.selectedUser.length > 0 ? RootLang.lang.JeeWork.xong : ""}
                    styTextRight={[{ fontSize: sizes.sText15, color: '#0E72D8' }]}
                    iconLeft={Images.ImageJee.icArrowNext}
                    styIconLeft={{ tintColor: colors.black }}
                    onPressLeft={this._goback}
                    textleft={RootLang.lang.JeeSocial.ganthe}
                    styTextLeft={{ fontSize: reText(15), }}
                    onPressRight={this._select(this.state.selectedUser)}
                />

                <View style={{ flex: 1, backgroundColor: colors.white, }}>
                    <View style={{ backgroundColor: colors.white, flex: 1 }}>
                        <View style={{ borderTopWidth: 0.3, borderBottomWidth: 0.3, borderColor: '#D1D1D1', justifyContent: 'center', }}>
                            {_.size(this.state.selectedUser) > 0
                                ?
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
                                    {
                                        this.gioihan == true ?
                                            <Text> {this.state.selectedUser.length}/5</Text>
                                            : null
                                    }
                                    <TouchableOpacity style={{ paddingHorizontal: 10, }}
                                        onPress={() => this._xoaAll_selectedUser()}>
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
                                    />
                                </View>
                            </View>

                        </View>
                        <View style={{ paddingHorizontal: 10, flex: 1, paddingBottom: paddingBotX }}>
                            <FlatList
                                extraData={this.state}
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                                style={{ paddingLeft: 10 }}
                                data={this.state.filteredData && this.state.filteredData.length > 0
                                    ? this.state.filteredData
                                    : this.state.listUser}
                                renderItem={this._renderItem}
                                keyExtractor={(item, index) => index.toString()}
                                ListEmptyComponent={this.state.listUser.length == 0 ? <ListEmptyLottie_Social_Group style={{ justifyContent: 'center', alignItems: 'center', }} textempty={RootLang.lang.JeeSocial.khongcothanhviennao} /> : null}
                            />
                        </View>
                    </View>
                </View>
                <IsLoading />
            </View >
        );
    }
};


const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(Modal_UserTag, mapStateToProps, true)


