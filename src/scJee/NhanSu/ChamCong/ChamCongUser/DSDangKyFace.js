import React, { Component } from 'react';
import {
    ActivityIndicator, FlatList, Image,
    RefreshControl, StyleSheet, Text,
    TextInput, TouchableOpacity, View, Platform
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import apiAI from '../../../../apis/apiAI';
import { getListJuniorEmployeeByManager_PT } from '../../../../apis/apiDuLieuChamCong';
import { ROOTGlobal } from '../../../../app/data/dataGlobal';
import { RootLang } from '../../../../app/data/locales';
import { nGlobalKeys } from '../../../../app/keys/globalKey';
import Utils from '../../../../app/Utils';
import UtilsApp from '../../../../app/UtilsApp';
import HeaderComStack from '../../../../components/HeaderComStack';
import IsLoading from '../../../../components/IsLoading';
import { Images } from '../../../../images';
import { TouchDropNew, TouchDropNew2 } from '../../../../Component_old/itemcom/itemcom';
import { colors, fonts } from '../../../../styles';
import { sizes } from '../../../../styles/size';
import { nstyles, Width, paddingBotX } from '../../../../styles/styles';
import { nkey } from '../../../../app/keys/keyStore';
import HeaderAnimationJee from '../../../../components/HeaderAnimationJee';
class DSDangKyFace extends Component {
    constructor(props) {
        super(props);
        this.menu = [{
            name: RootLang.lang.scdangkykhuonmat.tatca,
            ID_type: ''
        }, {
            name: RootLang.lang.scdangkykhuonmat.chuadangky,
            ID_type: '0'
        }, {
            name: RootLang.lang.scdangkykhuonmat.dadangky,
            ID_type: '1'
        }]
        this.nthis = this.props.nthis;
        this.dataSearch = '';
        this.dataRoot = [];
        this.CountTime = 9;
        this._page = 1;
        this.state = {
            DSNhanVien: [],
            _allPage: 1,
            refreshing: true,
            showload: false,
            SelectType: this.menu[0],
            listType: this.menu
        };
        ROOTGlobal.QLDuyetDoiCa.refreshDSDoiCa = this._onRefresh;
    }

    componentDidMount() {
        this._Get_DSDuyetDonXinDoiCa();
        this._setInterval();
    }

    _Get_DSDuyetDonXinDoiCa = async (page = 1, search = '') => {
        let res = await getListJuniorEmployeeByManager_PT(page, search, this.state.SelectType.ID_type);
        // Utils.nlog("DS Nhan Vien:", res.data);
        if (res < 0 || !res || res.status == 0) {
            // this.dataRoot = [];
            this._page = page
            this.setState({ DSNhanVien: [], _allPage: 1, refreshing: false, showload: false });
            return;
        }

        if (res.status == 1) {
            let tempData = this.state.DSNhanVien;
            if (page == 1)
                tempData = res.data;
            else
                tempData = [...tempData, ...res.data];

            // this.dataRoot = res.data;
            this._page = page;
            this.setState({ DSNhanVien: tempData, _allPage: res.page.AllPage, refreshing: false, showload: false });
        }
    }

    onSearch = (val = '') => {
        // val = Utils.change_alias(val).toUpperCase();
        // let temp = this.dataRoot.filter((item) => Utils.change_alias(item.hoten).toUpperCase().includes(val)
        //     || item.manv.toUpperCase().includes(val));
        // this.setState({ DSNhanVien: temp });
        this.CountTime = 0;
        this.dataSearch = val;
    }

    _setInterval = () => {
        this.interval = setInterval(async () => {
            this.CountTime = this.CountTime + 1;
            if (this.CountTime == 5) {
                //--Code
                this._Get_DSDuyetDonXinDoiCa(1, this.dataSearch)
            };
            if (this.CountTime > 1000000)
                this.CountTime = 10;
        }, 100);

    }

    _onRefresh = () => {
        this.setState({ refreshing: true }, () => this._Get_DSDuyetDonXinDoiCa(1, this.dataSearch));
    }

    onLoadMore = () => {
        if (this._page == this.state._allPage || this.state.showload)
            return;
        let tempPage = this._page + 1;
        this.setState({ showload: true }, () => this._Get_DSDuyetDonXinDoiCa(tempPage, this.dataSearch));
    }

    _callback = (itemDrop = this.state.SelectType) => {
        // Utils.nlog("vao call back");
        this.setState({ SelectType: itemDrop }, this._onRefresh);
    }

    // onShowFaceImg = async (IdNV = 0) => {
    //     this.waitting.show();
    //     let res = await apiAI.getFaceRegister(IdNV, Utils.getGlobal(nGlobalKeys.IDKH_DPS, 0));
    //     if (res && res.status == "1" && res.data.frames.length != 0) {
    //         UtilsApp.showImageZoomViewer(this, ['data:image/jpg;base64,' + res.data.frames[0].face]);
    //     } else
    //         Utils.showMsgBoxOK(this, RootLang.lang.thongbaochung.canhbao, RootLang.lang.thongbaochung.khongcodulieu)

    //     this.waitting.hide();
    // }

    onShowFaceImg = async (IdNV) => {
        this.waitting.show();
        let res = await apiAI.getFaceRegister(IdNV, await Utils.ngetStorage(nkey.IDKH_DPS, 0));
        if (res && res.status == "1" && res.data.frames.length != 0) {
            UtilsApp.showImageZoomViewer(this, ['data:image/jpg;base64,' + res.data.frames[0].face]);
        } else
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.canhbao, RootLang.lang.thongbaochung.khongcodulieu, 3);
        this.waitting.hide();
    }

    _renderItem = ({ item, index }) => {
        return (
            <View style={{ backgroundColor: colors.colorBGHome, }}>
                <TouchableOpacity
                    onPress={() => Utils.goscreen(this, "sc_ChamCongCamera", { callback: this._callback, IdNV: item.id_nv, isMode: 1 })}
                    style={nstyles.shadow, {
                        flex: 1, flexDirection: 'row',
                        backgroundColor: colors.white, paddingVertical: 15,
                        height: 'auto', paddingHorizontal: 10,
                        marginBottom: index != this.state.DSNhanVien.length - 1 ? 0 : paddingBotX + 10,
                        borderTopLeftRadius: index == 1 ? 0 : 5, borderTopRightRadius: index == 1 ? 0 : 5,
                        borderBottomLeftRadius: index != this.state.DSNhanVien.length - 1 ? 0 : 5, borderBottomRightRadius: index != this.state.DSNhanVien.length - 1 ? 0 : 5,
                    }}>
                    <View style={{ flex: 1, flexDirection: 'row', height: '100%', alignItems: 'center' }}>
                        <Image source={item.Image ? { uri: item.Image } : Images.JeeAvatarBig} style={[nstyles.nAva28]} />
                        <View style={{ flex: 1, paddingLeft: 10 }}>
                            <View style={{ flex: 1 }}>
                                <View style={{ flex: 1, flexDirection: 'row', }}>
                                    <Text style={{
                                        fontSize: sizes.sText14, lineHeight: sizes.sText17, flex: 1,
                                        fontFamily: fonts.Helvetica, color: colors.colorTextBack80
                                    }}
                                        numberOfLines={2}
                                    >{item.hoten}</Text>
                                    <Text style={{
                                        fontFamily: fonts.HelveticaBold,
                                        color: !item.isdangkyfaceid ? colors.coralTwo : colors.greenTab,
                                        fontSize: sizes.sText12, lineHeight: sizes.sText17,
                                    }}>{!item.isdangkyfaceid ? RootLang.lang.scdangkykhuonmat.chuadangky : RootLang.lang.scdangkykhuonmat.dadangky}</Text>
                                </View>
                                <View style={{ flex: 1, marginTop: 6, flexDirection: 'row' }}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{
                                            flex: 1,
                                            fontFamily: fonts.Helvetica,
                                            color: colors.colorGrayLight,
                                            fontSize: sizes.sText12, lineHeight: sizes.sText16,
                                        }}>{item.ngaysinh ? Utils.formatDate(item.ngaysinh, "DD/MM/YYYY") : '--'}   <Text style={{ color: colors.orangeSix }}>{item.manv}</Text></Text>
                                        <Text style={{
                                            flex: 1, opacity: 0.7, fontStyle: 'italic',
                                            fontFamily: fonts.Helvetica,
                                            color: colors.colorGrayLight,
                                            fontSize: sizes.sText12, lineHeight: sizes.sText16,
                                        }}>{item.phongban}</Text>
                                    </View>
                                    <TouchableOpacity style={{ paddingHorizontal: 15 }} onPress={() => this.onShowFaceImg(item.id_nv)}>
                                        <Image source={Images.icReviewFace} style={[nstyles.nIcon30]} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
                {index != this.state.DSNhanVien.length - 1 ? (
                    <View style={{
                        width: '100%', backgroundColor: colors.white,
                        height: 1, alignItems: 'center'
                    }}>
                        <View style={{ width: '90%', backgroundColor: colors.veryLightPink, height: 1 }}></View>
                    </View>

                ) : null
                }

            </View >
        );
    }

    _ViewItem = (item) => {
        return (
            <Text key={item.ID_type} style={{ fontSize: sizes.sText16, color: this.state.SelectType.ID_type == item.ID_type ? colors.textblack : colors.colorTextBTGray, textAlign: 'center', fontWeight: this.state.SelectType.ID_type == item.ID_type ? 'bold' : 'normal' }}>{`${item.name}`}</Text>)
    }

    _DropDown = () => {
        Utils.goscreen(this, 'Modal_ComponentSelectCom', { callback: this._callback, item: this.state.SelectType, AllThaoTac: this.state.listType, ViewItem: this._ViewItem })
    }

    renderListEmpty = () => {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Image source={Images.icListEmpty} style={{ width: sizes.nImgSize200, height: sizes.nImgSize200 }} resizeMode={'cover'} />
                <Text style={{ fontSize: sizes.sText16, color: colors.brownGreyTwo }}>{RootLang.lang.thongbaochung.khongcodulieu}</Text>
            </View>
        )
    }

    render() {
        const { DSNhanVien, SelectType } = this.state
        return (
            <View style={nstyles.ncontainer}>

                {/* <HeaderComStack nthis={this} title={RootLang.lang.scdangkykhuonmat.title} onPressLeft={() => Utils.goback(this)} /> */}
                <HeaderAnimationJee onPressLeft={() => { Utils.goback(this, null) }} nthis={this} title={RootLang.lang.scdangkykhuonmat.title} />
                <TouchDropNew2 value={SelectType.name}
                    title={RootLang.lang.scdangkykhuonmat.tinhtrang}
                    _onPress={this._DropDown} />

                <View style={{
                    flex: 1, paddingHorizontal: 15, paddingTop: 5, backgroundColor: colors.backgroundColor
                }}>
                    <TextInput
                        underlineColorAndroid={"transparent"}
                        style={[{
                            color: colors.textblack, backgroundColor: colors.white,
                            fontSize: sizes.sText15, marginBottom: 5, paddingVertical: Platform.OS ? 10 : 15, paddingHorizontal: 10, fontFamily: fonts.Helvetica,
                            borderRadius: 5
                        }]}
                        onChangeText={this.onSearch}
                        placeholder={RootLang.lang.scdangkykhuonmat.textsearch}
                    >{this.dataSearch}</TextInput>
                    <KeyboardAwareScrollView
                        refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh} />}>

                        <FlatList
                            style={{ flex: 1 }}
                            showsVerticalScrollIndicator={false}
                            data={DSNhanVien}
                            // refreshing={this.state.refreshing}
                            // onRefresh={this._onRefresh}
                            ListEmptyComponent={<View style={{ flex: 1, alignItems: 'center' }}>
                                <Text >{RootLang.lang.thongbaochung.khongcodulieu}</Text>
                            </View>}
                            renderItem={this._renderItem}
                            onEndReached={this.onLoadMore}
                            // onEndReachedThreshold={0.3}
                            keyExtractor={(item, index) => index.toString()}
                            ListFooterComponent={this.state.showload ?
                                <ActivityIndicator size='small' /> : null}
                            ListEmptyComponent={this.renderListEmpty}
                        />
                    </KeyboardAwareScrollView>
                </View>
                <IsLoading ref={refs => this.waitting = refs} />
            </View>

        );
    }
}
const mapStateToProps = state => ({
    lang: state.changeLanguage.language,
    loadtangca: state.LoadTC.loadtangca
});
const styles = StyleSheet.create({
    containerTab: {
        backgroundColor: colors.white,
        padding: 5,
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: colors.borderGray
    },
    tabStyle: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 15
    },
    tabLineActive: {
        paddingVertical: 1,
        width: '30%',
        marginTop: 15,
        borderRadius: 5
    },
    datePickStyle: {
        backgroundColor: colors.white,
        marginHorizontal: 15,
        marginVertical: 10,
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        ...nstyles.nrow,
        ...nstyles.shadow
    },
    rowBack: {
        flex: 1,
        flexDirection: 'row',
        width: Width(50),
        alignSelf: 'flex-end'
    },
    backRightBtn: {
        bottom: 0,
        ...nstyles.nmiddle,
        position: 'absolute',
        top: 0,
        width: 75,
    },
    backRightBtnLeft: {
        ...nstyles.nmiddle,
        backgroundColor: colors.apricot,
        height: '100%', flex: 1
    },
    backRightBtnRight: {
        ...nstyles.nmiddle,
        backgroundColor: colors.greenishTeal,
        flex: 1,
        height: '100%'
    },
})

export default Utils.connectRedux(DSDangKyFace, mapStateToProps, true)
