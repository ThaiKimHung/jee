import React, { Component, createRef } from 'react';
import { Animated, FlatList, Image, Platform, ScrollView, Text, TextInput, TouchableOpacity, View, BackHandler, StyleSheet } from "react-native";
import ActionSheet from "react-native-actions-sheet";
import Dash from 'react-native-dash';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { deleteGroup, deleteMember_InGroup, getDSGroupMember, Update_Quyen_Member } from '../../../apis/JeePlatform/Api_JeeSocial/apiJeeSocial';
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import { RootLang } from '../../../app/data/locales';
import { nkey } from '../../../app/keys/keyStore';
import Utils from '../../../app/Utils';
import IsLoading from '../../../components/IsLoading';
import ListEmpty from '../../../components/ListEmpty';
import HeaderModal from '../../../Component_old/HeaderModal';
import { Images } from '../../../images';
import { colors } from '../../../styles';
import { sizes, reText } from '../../../styles/size';
import { Height, nstyles, Width, paddingBotX } from '../../../styles/styles';
import ListEmptyLottie_Social_Group from '../../../components/NewComponents/ListEmptyLottie_Social_Group';
import UtilsApp from '../../../app/UtilsApp';
import ImageCus from '../../../components/NewComponents/ImageCus';

const actionSheetRef_Admin = createRef();
const actionSheetRef_User = createRef();
const actionSheetRef_Roinhom = createRef();
class TimKiem_ThanVienNhom extends Component {
    constructor(props) {
        super(props);
        this.data = Utils.ngetParam(this, 'data', '')
        this.homesocial = Utils.ngetParam(this, 'homesocial', false)
        this.state = {
            opacity: new Animated.Value(0),
            listDsMember: [],
            item_Admin: [],
            item_User: [],
            id_User: '',
            refreshing: false,
            searchText: '',
            filteredData: [],
            id: [],
        };
        this.nthis = this.props.nthis;
        ROOTGlobal.LoadDanhSach_Member.LoadDSMember = this._loadDanhSachMember;
    }

    componentDidMount = async () => {
        BackHandler.addEventListener("hardwareBackPress", this._goback);
        await this.setState({
            id_User: await Utils.ngetStorage(nkey.UserId, '')
        })
        await this._loadDanhSachMember()
    }

    componentWillUnmount() {
        try {
            BackHandler.removeEventListener('hardwareBackPress', this._goback)
        }
        catch (error) {

        }
    }

    _goback = async () => {
        Utils.goback(this, null)
        return true
    }


    _loadDanhSachMember = async () => {
        const { listDsMember } = this.state
        nthisLoading.show()
        let res = await getDSGroupMember(this.homesocial ? this.data?.Group[0]?.id_group : this.data?.ID_group);
        // Utils.nlog("list thành viên-------------------------", res)
        if (res.status == 1) {
            nthisLoading.hide()
            this.setState({ listDsMember: res?.data, refreshing: false })
        } else {
            nthisLoading.hide()
            this.setState({ refreshing: false })
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
        }
    }

    _onRefresh = () => {
        this._loadDanhSachMember(1);
    }

    _openActionc_Admin = (item) => {
        const { id_User } = this.state;
        if (item.UserId == id_User) {
            actionSheetRef_Admin.current?.show();
            this.setState({ item_Admin: item })
        }
        else {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.JeeSocial.bankhongcoquyenthuchienchucnangnay, 3)
        }
    }

    _openActionc_RoiNhom = (item) => {
        actionSheetRef_Roinhom.current?.show()
        this.setState({ item_User: item })
    }

    _openActionc_User = (item) => {
        const { id_User } = this.state;
        actionSheetRef_User.current?.show();
        this.setState({ item_User: item })
    }

    _xoaNhom = () => {
        actionSheetRef_Admin.current?.hide();
        Utils.showMsgBoxYesNo(this, RootLang.lang.thongbaochung.thongbao, RootLang.lang.JeeSocial.banmuonxoanhomnay, RootLang.lang.scchamcong.dongy, RootLang.lang.scchamcong.huy,
            async () => {
                nthisLoading.show()
                let res = await deleteGroup(this.homesocial ? this.data?.Group[0]?.id_group : this.data?.ID_group);
                // Utils.nlog("delete nhóm-------------------------", res)
                if (res.status == 1) {
                    UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.JeeSocial.xoathanhcong, 1)
                    Utils.goscreen(this, 'sc_TabHomeSocial', { index: 2 })
                    ROOTGlobal.setIndexTab.setIndex(), ROOTGlobal.LoadDanhSachGroup.LoadDSGroup()
                    ROOTGlobal.LoadDanhSachBaiDang_Nhom.LoadDSBaiDang_Nhom()
                    nthisLoading.hide()
                }
                else {
                    nthisLoading.hide()
                    UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.JeeSocial.xoathatbai, 2)
                }
            }
        )
    }

    _themThanhVien = () => {
        Utils.goscreen(this, 'sc_ThemThanhVien', { nthis: this, data: this.data, homesocial: this.homesocial })
    }

    _updateQuyenTV = async () => {
        nthisLoading.show()
        let res = await Update_Quyen_Member(this.homesocial ? this.data?.Group[0]?.id_group : this.data?.ID_group, this.state.item_User?.UserId)
        // Utils.nlog('res _updateQuyenTV', res)
        if (res.status == 1) {
            actionSheetRef_User.current?.hide();
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.thongbaochung.capnhatthanhcong, 1)
            this._onRefresh()
            nthisLoading.hide()
            this.setState({ searchText: '' })
        } else {
            nthisLoading.hide()
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
        }
    }

    _xoaThanhVien = async (roinhom = false) => {
        if (roinhom == true) {
            actionSheetRef_Roinhom.current?.hide()
        }
        else {
            actionSheetRef_User.current?.hide();
        }
        Utils.showMsgBoxYesNo(this, RootLang.lang.thongbaochung.thongbao, roinhom == true ? RootLang.lang.JeeSocial.banmuonroinhom : RootLang.lang.JeeSocial.banmuonxoathanhviennay, RootLang.lang.scchamcong.dongy, RootLang.lang.scchamcong.huy,
            async () => {
                nthisLoading.show()
                let res = await deleteMember_InGroup(this.homesocial ? this.data?.Group[0]?.id_group : this.data?.ID_group, this.state.item_User?.UserId)
                // Utils.nlog("delete thành viên-------------------------", res)
                if (res.status == 1) {
                    this.setState({ searchText: '' })
                    UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, roinhom == true ? RootLang.lang.JeeSocial.roinhomthanhcong : RootLang.lang.JeeSocial.xoathanhcong, 1)
                    if (roinhom == true) {
                        nthisLoading.hide()
                        Utils.goscreen(this, 'sc_TabHomeSocial')
                        ROOTGlobal.LoadDanhSachGroup.LoadDSGroup()
                        ROOTGlobal.LoadDanhSachBaiDang.LoadDSBaiDang()
                        ROOTGlobal.LoadDanhSachBaiDang_Nhom.LoadDSBaiDang_Nhom()
                        ROOTGlobal.LoadDanhSachBaiDang_Nhom.LoadDSBaiDang_Loc()
                        ROOTGlobal.setIndexTab.setIndex(2)
                    }
                    else {
                        this._onRefresh()
                        nthisLoading.hide()
                    }
                }
                else {
                    nthisLoading.hide()
                    UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.JeeSocial.xoathatbai, 2)
                }
            }
        )
    }

    _search = (searchText) => {
        this.setState({ searchText: searchText });
        let filteredData = this.state.listDsMember[0]?.Member.filter((item) =>
            Utils.removeAccents(item['Fullname'])
                .toUpperCase()
                .includes(Utils.removeAccents(searchText.toUpperCase())),
        );
        this.setState({ filteredData: filteredData });
    };

    _renderItem = ({ item, index }) => {
        return (
            <View style={{ backgroundColor: colors.white, flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8 }}>
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
                    <View style={[{ marginLeft: 12, justifyContent: 'center', }]}>
                        <Text style={{ fontWeight: 'bold', fontSize: reText(12) }}>{item.Fullname}</Text>
                        {item.quyen_group == true ? (
                            <Text style={{ fontSize: reText(12), color: '#65676B' }}>Quản trị viên</Text>
                        ) : (
                                <Text style={{ fontSize: reText(12), color: '#65676B' }}>Thành viên</Text>
                            )}
                    </View>
                </View>
                {
                    item.UserId == this.state.id_User || item.quyen_group == true ? (
                        <TouchableOpacity
                            onPress={() => { this._openActionc_Admin(item) }}
                            style={{ justifyContent: 'center', paddingHorizontal: 20, alignItems: 'center', flexDirection: 'row' }}>
                            <Image source={Images.ImageJee.icBaCham} resizeMode='cover' style={[{}]} />
                        </TouchableOpacity>
                    ) : (
                            null
                        )
                }
            </View >
        );
    }

    _renderItem_all = ({ item, index }) => {
        return (
            <View style={{ backgroundColor: colors.white, flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8 }}>
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
                        {item.quyen_group == true ? (
                            <Text style={{ fontSize: reText(12), color: '#65676B' }}>{RootLang.lang.JeeSocial.quantrivien}</Text>
                        ) : (
                                <Text style={{ fontSize: reText(12), color: '#65676B' }}>{RootLang.lang.JeeSocial.thanhviennhom}</Text>
                            )}
                    </View>
                </View>
                {
                    this.state.listDsMember[0]?.quyen_group == true ? (
                        <TouchableOpacity
                            onPress={() => { this._openActionc_User(item) }}
                            style={{ justifyContent: 'center', paddingHorizontal: 20, alignItems: 'center', flexDirection: 'row' }}>
                            <Image source={Images.ImageJee.icBaCham} resizeMode='cover' style={[{}]} />
                        </TouchableOpacity>
                    ) : (
                            null
                        )
                }
            </View >
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
        const { searchText, listDsMember, id_User, item, refreshing, filteredData, item_User } = this.state
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: '#E4E6EB', }]}>
                <View style={[nstyles.nHcontent, { paddingHorizontal: 15, height: isIphoneX() ? 85 : 65, width: '100%', borderBottomWidth: 0.3, borderColor: '#D1D1D1' }]} resizeMode='cover' >
                    <View style={[nstyles.nrow, {
                        flexDirection: 'row', flex: 1, height: isIphoneX() ? 85 : 65, justifyContent: 'center', alignItems: 'center'
                    }]}>
                        <TouchableOpacity
                            style={{
                                paddingRight: 20, height: isIphoneX() ? 85 : 65, alignItems: 'center', justifyContent: 'center'
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
                                height: isIphoneX() ? 85 : 65,
                                flexDirection: 'row',
                            }} >
                            <Image source={Images.ImageJee.icTimKiemTextInput} resizeMode='cover' style={{ marginRight: 5 }} />
                            <View style={{ flex: 1, paddingVertical: Platform.OS == 'ios' ? 15 : 3, }}>
                                <TextInput
                                    style={{}}
                                    placeholder={RootLang.lang.JeeSocial.timkiemthanhvien}
                                    onChangeText={this._search}
                                    underlineColorAndroid="transparent"
                                />
                            </View>
                        </View>
                    </View>
                </View >

                <View style={{ flex: 1, backgroundColor: colors.white, paddingBottom: paddingBotX }}>
                    <View style={{ paddingHorizontal: 5, backgroundColor: colors.white, justifyContent: 'center', borderBottomWidth: 0.5, borderTopWidth: 0.5, borderColor: '#D1D1D1', }} >
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 16 }}>
                            <View style={{ paddingLeft: 10, justifyContent: 'center' }}>
                                <Text style={{ fontSize: reText(15), fontWeight: '600' }}>{RootLang.lang.JeeSocial.tongsothanhvien} {listDsMember[0]?.Member?.length ? listDsMember[0]?.Member.length + 1 : ""}</Text>
                            </View>
                            {this.state.listDsMember[0]?.quyen_group == true ? (
                                <TouchableOpacity
                                    onPress={() => this._themThanhVien()}
                                    style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 15, }}>
                                    <Image source={Images.ImageJee.icPlusThemTV} resizeMode='contain' style={[nstyles.nIcon16, { padding: 12, marginRight: 8 }]} />
                                </TouchableOpacity>
                            ) : (null)}

                        </View>
                    </View>
                    <View style={{ backgroundColor: colors.white, flex: 1 }}>
                        {
                            searchText.length > 0 ? (
                                <View style={{ paddingHorizontal: 10, }}>
                                    <FlatList
                                        extraData={this.state}
                                        showsHorizontalScrollIndicator={false}
                                        showsVerticalScrollIndicator={false}
                                        refreshing={refreshing}
                                        // style={{ marginTop: 5, }}
                                        onRefresh={this._onRefresh}
                                        data={filteredData}
                                        renderItem={this._renderItem_all}
                                        keyExtractor={(item, index) => index.toString()}
                                        ListEmptyComponent={filteredData ? <ListEmpty style={{ justifyContent: 'center', alignItems: 'center', }} textempty={'Không có dữ liệu'} /> : null}
                                    />
                                </View>
                            ) : (
                                    <View style={{ backgroundColor: colors.white, flex: 1 }}>
                                        <View style={{ paddingHorizontal: 10, flex: 1 }}>
                                            <View>
                                                {listDsMember.map(item => {
                                                    return (
                                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8 }}>
                                                            <View style={[{ flexDirection: 'row', }]}>
                                                                {
                                                                    item?.Avatar ?
                                                                        <ImageCus
                                                                            style={nstyles.nAva40}
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
                                                                <View style={[{ marginLeft: 12, justifyContent: 'center', }]}>
                                                                    <Text style={{ fontWeight: 'bold', fontSize: reText(12) }}>{item.Fullname}</Text>
                                                                    {item.quyen_group == true ? (
                                                                        <Text style={{ fontSize: reText(12), color: '#65676B' }}>{RootLang.lang.JeeSocial.quantrivien}</Text>
                                                                    ) : (
                                                                            <Text style={{ fontSize: reText(12), color: '#65676B' }}>{RootLang.lang.JeeSocial.thanhviennhom}</Text>
                                                                        )}
                                                                </View>
                                                            </View>
                                                            {
                                                                item.quyen_group == true ? (
                                                                    <TouchableOpacity
                                                                        onPress={() => { this._openActionc_Admin(item) }}
                                                                        style={{ justifyContent: 'center', paddingHorizontal: 20, alignItems: 'center', flexDirection: 'row' }}>
                                                                        <Image source={Images.ImageJee.icBaCham} resizeMode='cover' style={[{}]} />
                                                                    </TouchableOpacity>
                                                                ) : (
                                                                        <TouchableOpacity
                                                                            onPress={() => { this._openActionc_RoiNhom(item) }}
                                                                            style={{ justifyContent: 'center', paddingHorizontal: 20, alignItems: 'center', flexDirection: 'row' }}>
                                                                            <Image source={Images.ImageJee.icBaCham} resizeMode='cover' style={[{}]} />
                                                                        </TouchableOpacity>
                                                                    )
                                                            }
                                                        </View >
                                                    )
                                                })}
                                                <Dash
                                                    dashColor={"#E4E6EB"}
                                                    style={{ width: Width(100), marginVertical: 5 }}
                                                    dashGap={0}
                                                    dashThickness={1} />
                                            </View>
                                            <FlatList
                                                extraData={this.state}
                                                showsHorizontalScrollIndicator={false}
                                                showsVerticalScrollIndicator={false}
                                                refreshing={refreshing}
                                                onRefresh={this._onRefresh}
                                                data={listDsMember[0]?.Member}
                                                renderItem={this._renderItem_all}
                                                keyExtractor={(item, index) => index.toString()}
                                                ListEmptyComponent={listDsMember.length == 0 ? <ListEmptyLottie_Social_Group style={{ justifyContent: 'center', alignItems: 'center', }} textempty={'Không có thành viên nào'} /> : null}
                                            />
                                        </View>
                                    </View>
                                )
                        }
                    </View>
                    <IsLoading />
                </View>
                <ActionSheet ref={actionSheetRef_Admin}>
                    <View style={{ maxHeight: Height(50), paddingBottom: paddingBotX, width: Width(100) }}>
                        <HeaderModal />
                        <TouchableOpacity
                            onPress={() => this._xoaNhom()}
                            style={{ height: Height(6), width: Width(100), justifyContent: 'center', alignItems: 'center', padding: 10, marginTop: 1, }}>
                            <Text style={{ fontSize: reText(15), }}>{RootLang.lang.JeeSocial.xoanhom}</Text>
                        </TouchableOpacity>
                        <Dash
                            dashColor={"#E4E6EB"}
                            style={{ width: Width(100), marginVertical: 5 }}
                            dashGap={0}
                            dashThickness={1} />
                    </View>
                </ActionSheet>
                <ActionSheet ref={actionSheetRef_User}>
                    <View style={{ maxHeight: Height(50), paddingBottom: paddingBotX, width: Width(100) }}>
                        <HeaderModal />
                        {
                            item_User.quyen_group == false ? (
                                <TouchableOpacity
                                    onPress={() => this._updateQuyenTV()}
                                    style={{ height: Height(5), borderBottomWidth: 0.3, borderColor: '#E4E6EB', width: Width(100), justifyContent: 'center', alignItems: 'center', padding: 10, marginTop: 2 }}>
                                    <Text style={{ fontSize: reText(15), }}>{RootLang.lang.JeeSocial.themlamQtv}</Text>
                                </TouchableOpacity>
                            ) : (
                                    <TouchableOpacity
                                        onPress={() => this._updateQuyenTV()}
                                        style={{ height: Height(5), borderBottomWidth: 0.3, borderColor: '#E4E6EB', width: Width(100), justifyContent: 'center', alignItems: 'center', padding: 10, marginTop: 2 }}>
                                        <Text style={{ fontSize: reText(15), }}>{RootLang.lang.JeeSocial.xoaquyenQtv}</Text>
                                    </TouchableOpacity>
                                )
                        }
                        <TouchableOpacity
                            onPress={() => this._xoaThanhVien()}
                            style={{ height: Height(6), width: Width(100), justifyContent: 'center', alignItems: 'center', padding: 10, marginTop: 1, borderBottomWidth: 0.3, borderColor: '#E4E6EB' }}>
                            <Text style={{ fontSize: reText(15) }}>{RootLang.lang.JeeSocial.xoathanhvien}</Text>
                        </TouchableOpacity>
                    </View>
                </ActionSheet>
                <ActionSheet ref={actionSheetRef_Roinhom}>
                    <View style={{ maxHeight: Height(50), paddingBottom: paddingBotX, width: Width(100) }}>
                        <HeaderModal />
                        <TouchableOpacity
                            onPress={() => this._xoaThanhVien(true)}
                            style={{ height: Height(6), width: Width(100), justifyContent: 'center', alignItems: 'center', padding: 10, marginTop: 1, }}>
                            <Text style={{ fontSize: reText(15), }}>{RootLang.lang.JeeSocial.roinhom}</Text>
                        </TouchableOpacity>
                        <Dash
                            dashColor={"#E4E6EB"}
                            style={{ width: Width(100), marginVertical: 5 }}
                            dashGap={0}
                            dashThickness={1} />
                    </View>
                </ActionSheet>
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
export default Utils.connectRedux(TimKiem_ThanVienNhom, mapStateToProps, true)
