import LottieView from 'lottie-react-native';
import moment from 'moment';
import React, { Component, createRef } from 'react';
import {
    ActivityIndicator, Animated, FlatList, Image,
    ImageBackground, Linking, StyleSheet, Text, TouchableOpacity,
    TouchableWithoutFeedback, View, BackHandler, ScrollView
} from "react-native";
import ActionSheet from "react-native-actions-sheet";
import Dash from 'react-native-dash';
import { Card } from 'react-native-paper';
import {
    addGhimBaiDang, BaiDangLike, BaiDang_LuuTru, deleteBaiDang, LoadDanhSachBaiDang_InGroup, AddTinNoiBat,
    On_OffThongBao, GetDSUser_Group, GetMenu_Group, GetDSBaiDang_TypeIn_Group, deleteGroup, UpdateAvatarGroup, EditNameGroup,
    HuyTinNoiBat
} from '../../../apis/JeePlatform/Api_JeeSocial/apiJeeSocial';
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import { RootLang } from '../../../app/data/locales';
import { nkey } from '../../../app/keys/keyStore';
import Utils from '../../../app/Utils';
import HeaderComStackV2 from '../../../components/HeaderComStackV2';
import IsLoading from '../../../components/IsLoading';
import ListEmpty from '../../../components/ListEmpty';
import FbImages from '../../../components/NewComponents/FBGridImage';
import HeaderModal from '../../../Component_old/HeaderModal';
import { Images } from '../../../images';
import { colors } from '../../../styles';
import { reText, sizes } from '../../../styles/size';
import ButtonTaoBaiDang from '../ModalSocial/ButtonTaoBaiDang';
import ListEmptyLottie_Social from '../../../components/NewComponents/ListEmptyLottie_Social';
import UtilsApp from '../../../app/UtilsApp';
import { ImgComp } from '../../../images/ImagesComponent';
import TextHyper from '../ModalSocial/TextHyper'
import Video from '../ComponentSocail/Video'
import { Height, nstyles, Width, paddingBotX, nHeight, nwidth } from '../../../styles/styles';
import ImageCus from '../../../components/NewComponents/ImageCus';
import FuncSocail from '../Functionn/FuncSocial'

const actionSheetRef_Nhom = createRef();
const actionSheetRef_EditNhom = createRef();
const actionSheetRef_XemAnhVideo = createRef();
class XemBaiDangTrongNhom extends Component {
    constructor(props) {
        super(props);
        this.refLoading = React.createRef()
        this.item_truyenvao = Utils.ngetParam(this, 'title', '')
        this.homesocail = Utils.ngetParam(this, 'homesocail', false)
        this.nthis = this.props.nthis;
        this.state = {
            opacity: new Animated.Value(0),
            listBaiDangNhom: [],
            showload: false,
            refreshing: false,
            _page: 1,
            loadmore: false,
            showReact: null,
            animationReact: null,
            id_User: '',
            item: [],
            showMore_thaoluan: false,
            showMore_khenthuong1: false,
            showMore_khenthuong2: false,
            showMore_thongbao: false,
            // isLoading: false,
            empty: false,
            dsUserGroup: [],
            dsMenuGroup: [],
            editAnhBia: false,
            loaiMenu: {},
            listBaiDangNhomType: [],
            images: {},
        }
        this.item = [];
        this.allPage = 1;
        this.types = [
            { key: '1', type: 'Like' },
            { key: '2', type: 'Love' },
            { key: '3', type: 'Haha' },
            { key: '4', type: 'Wow' },
            { key: '5', type: 'Sad' },
            { key: '6', type: 'Care' },
            { key: '7', type: 'Angry' }
        ];
        this.nthis = this.props.nthis;
        this.animatedValue = new Animated.Value(1);
        this.animatedMargin = new Animated.Value(0);
        ROOTGlobal.LoadDanhSachBaiDang_Nhom.LoadDSBaiDang_InNhom = this._loadDanhSachBaiDang_InGroupLai;
        ROOTGlobal.LoadDanhSachGroup.GetDSUser_Group = this._getDSUser_Group;
    }


    componentDidMount = async () => {
        this.refLoading.current.show()
        BackHandler.addEventListener("hardwareBackPress", this._goback);
        await this.setState({
            id_User: await Utils.ngetStorage(nkey.UserId, '')
        })
        let getDSUser_Group = false
        let loadDanhSachBaiDang_InGroup = false
        let getDSMenu_Group = false
        if (this.item_truyenvao) {
            getDSUser_Group = await this._getDSUser_Group()
            loadDanhSachBaiDang_InGroup = await this._loadDanhSachBaiDang_InGroup()
            getDSMenu_Group = await this._getDSMenu_Group()
            if (getDSUser_Group == true && loadDanhSachBaiDang_InGroup == true && getDSMenu_Group == true) {
                this.refLoading.current.hide()
            }
            else {
                UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.thongbaochung.loilaydulieu, 2)
                this.goback()
            }
        }
        else {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.thongbaochung.loilaydulieu, 2)
            this.goback()
        }
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

    onPressIn = (index) => {
        this.setState({ animationReact: index })
        Animated.spring(this.animatedValue, {
            toValue: 2
        }).start();
        Animated.spring(this.animatedMargin, {
            toValue: 16
        }).start();
    };

    onPressOut = () => {
        Animated.spring(this.animatedValue, {
            toValue: 1
        }).start();
        Animated.spring(this.animatedMargin, {
            toValue: 0
        }).start();
    };

    _loadDanhSachBaiDang_InGroup = async (page = 1) => {
        const { listBaiDangNhom } = this.state
        let data = this.homesocail ? this.item_truyenvao?.Group[0]?.id_group : this.item_truyenvao?.ID_group;
        let res = await LoadDanhSachBaiDang_InGroup(data, '', '', page);
        // Utils.nlog("list bài đăng trong nhóm -------------------------", res)
        if (res.status == 1) {
            let tempData = listBaiDangNhom;
            this.allPage = res.page.AllPage;
            if (page == 1) {
                page = 2
                tempData = res.data;
            }
            else {
                tempData = [...tempData, ...res.data];
                page = res.page.Page + 1
            }
            await this.setState({ listBaiDangNhom: tempData.map(obj => ({ ...obj, check: false })), _page: page, refreshing: false, showload: false, empty: true })
        } else {
            this.setState({ refreshing: false, showload: false, empty: false })
            // if (res.error.message != "Không có dữ liệu!") {
            //     UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
            // }
        }
        return true
    }

    _loadDanhSachBaiDang_InGroupLai = async (page = 1) => {
        this.refLoading.current.show()
        const { listBaiDangNhom } = this.state
        let data = this.homesocail ? this.item_truyenvao?.Group[0]?.id_group : this.item_truyenvao?.ID_group;
        this.setState({ loaiMenu: {} })
        let res = await LoadDanhSachBaiDang_InGroup(data, '', '', page);
        // Utils.nlog("list bài đăng trong nhóm -------------------------", res)
        if (res.status == 1) {
            this.refLoading.current.hide()
            let tempData = listBaiDangNhom;
            this.allPage = res.page.AllPage;
            if (page == 1) {
                page = 2
                tempData = res.data;
            }
            else {
                tempData = [...tempData, ...res.data];
                page = res.page.Page + 1
            }
            await this.setState({ listBaiDangNhom: tempData.map(obj => ({ ...obj, check: false })), _page: page, refreshing: false, showload: false, empty: true })
        } else {
            this.refLoading.current.hide()
            this.setState({ refreshing: false, showload: false, empty: false })
            // if (res.error.message != "Không có dữ liệu!") {
            //     UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
            // }
        }
        return true
    }

    _getDSUser_Group = async () => {
        let data = this.homesocail ? this.item_truyenvao?.Group[0]?.id_group : this.item_truyenvao?.ID_group;
        let res = await GetDSUser_Group(data);
        // Utils.nlog("res GetDSUser_Group", res)
        if (res.status == 1) {
            await this.setState({ dsUserGroup: res.data[0], })
        } else {
        }
        return true
    }

    _getDSMenu_Group = async () => {
        let data = this.homesocail ? this.item_truyenvao?.Group[0]?.id_group : this.item_truyenvao?.ID_group;
        let res = await GetMenu_Group(data);
        // Utils.nlog("res _getDSMenu_Group", res)
        if (res.status == 1) {
            await this.setState({ dsMenuGroup: res.data })
        } else {

        }
        return true
    }

    _getDSBaiDang_TypeIn_Group = async (typeBaiDang, page = 1) => {
        this.refLoading.current.show()
        const { listBaiDangNhom } = this.state
        this.setState({
            listBaiDangNhom: [],
        })
        let type = '' // 1: thảo luận, 2 : thông báo
        if (typeBaiDang == 1) {
            type = 'thao-luan'
        }
        else type = 'thong-bao'
        let data = this.homesocail ? this.item_truyenvao?.Group[0]?.id_group : this.item_truyenvao?.ID_group;
        this.setState({ empty: false })
        let res = await GetDSBaiDang_TypeIn_Group(data, type, page, 10);
        // Utils.nlog("res GetDSBaiDang_TypeIn_Group", res)
        if (res.status == 1) {
            this.refLoading.current.hide()
            let tempData = listBaiDangNhom;
            this.allPage = res.page.AllPage;
            if (page == 1) {
                page = 2
                tempData = res.data;
            }
            else {
                tempData = [...tempData, ...res.data];
                page = res.page.Page + 1
            }
            await this.setState({ listBaiDangNhom: tempData.map(obj => ({ ...obj, check: false })), _page: page, refreshing: false, showload: false })
        } else {
            this.refLoading.current.hide()
            this.setState({ refreshing: false, showload: false, empty: true })
            // if (res.error.message != "Không có dữ liệu!") {
            //     UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
            // }
        }
    }

    callback = () => {
        ROOTGlobal.LoadDanhSachBaiDang_Nhom.LoadDSBaiDang_InNhom()
        ROOTGlobal.LoadDanhSachBaiDang.LoadDSBaiDang()
        ROOTGlobal.LoadDanhSachBaiDang_Nhom.LoadDSBaiDang_Loc()
        Utils.goscreen(this, 'sc_XemBaiDangTrongNhom', { nthis: this })
    }

    _go_XemThanhVien = () => {
        Utils.goscreen(this, 'sc_TimKiem_ThanVienNhom', { nthis: this, data: this.item_truyenvao, homesocial: this.homesocail })
    }

    _taoBaiDang = () => {
        Utils.goscreen(this, 'sc_TaoBaiDangTheoLoai', { nthis: this, data: this.item_truyenvao, callback: this.callback })
    }

    _onRefresh = () => {
        this._loadDanhSachBaiDang_InGroup(1);
        this.allPage = 1;
    }

    onLoadMore = async () => {
        if (this.state._page <= this.allPage) {
            this.setState({ showload: true }, () => {
                if (this.state.loaiMenu?.ID_menu) {
                    this._getDSBaiDang_TypeIn_Group(this.state.loaiMenu.ID_menu, this.state._page)
                }
                else {
                    this._loadDanhSachBaiDang_InGroup(this.state._page)
                }
            });
        }
        else { }
    }

    _like = async (idbaidang, type = 1) => {
        this.setState({ showReact: null })
        let res = await BaiDangLike(idbaidang, type);
        // Utils.nlog('ress like', res)
        if (res.status == 1) {
            let temp = res ? res.data[0] : []
            const { listBaiDangNhom } = this.state
            listBaiDangNhom.forEach((item, index) => {
                if (temp.Id_BaiDang == item.Id_BaiDang) {
                    listBaiDangNhom[index] = { ...listBaiDangNhom[index], Like: temp.Like, Like_BaiDang: temp.Like_BaiDang }
                }
            })
            this.setState({ listBaiDangNhom: listBaiDangNhom, })
        }
        else {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
        }
    }

    _luuTru = async (idbaidang) => {
        const { listBaiDangNhom } = this.state
        this.refLoading.current.show()
        let res = await BaiDang_LuuTru(idbaidang);
        // Utils.nlog('ress luu trữ', res)
        if (res.status == 1) {
            if (res.data.length > 0) {
                let temp = res.data[0]
                this.refLoading.current.hide()
                listBaiDangNhom.forEach((item, index) => {
                    if (temp.Id_baidang == item.Id_BaiDang) {
                        listBaiDangNhom[index] = { ...listBaiDangNhom[index], Save_: res.data }
                    }
                })
                await this.setState({ listBaiDangNhom: listBaiDangNhom })
                UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.JeeSocial.luutruthanhcong, 1)
            }
            else {
                this.refLoading.current.hide()
                listBaiDangNhom.forEach((item, index) => {
                    if (idbaidang == item.Id_BaiDang) {
                        listBaiDangNhom[index] = { ...listBaiDangNhom[index], Save_: res.data }
                    }
                })
                await this.setState({ listBaiDangNhom: listBaiDangNhom })
                UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.JeeSocial.daxoabailuutru, 1)
            }
        }
        else {
            this.refLoading.current.hide()
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
        }
    }

    _xoaBaiDang_Nhom = async () => {
        actionSheetRef_Nhom.current?.hide();
        Utils.showMsgBoxYesNo(this, RootLang.lang.thongbaochung.thongbao, RootLang.lang.JeeSocial.banmuonxoabaidangnay, RootLang.lang.scchamcong.dongy, RootLang.lang.scchamcong.huy,
            async () => {
                this.refLoading.current.show()
                let res = await deleteBaiDang(this.state.item.Id_BaiDang);
                // Utils.nlog("delete bài đăng nhóm-------------------------", res)
                if (res.status == 1) {
                    this.refLoading.current.hide()
                    let someArray = this.state.listBaiDangNhom;
                    someArray = someArray.filter(data => data.Id_BaiDang != this.state.item.Id_BaiDang)
                    this.setState({ listBaiDangNhom: someArray })
                    UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.JeeSocial.xoathanhcong, 1)
                }
                else {
                    this.refLoading.current.hide()
                    UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.JeeSocial.xoathatbai, 2)
                }
            }
        )
    }

    _ghimBaiDAng = async (type = false) => {
        this.refLoading.current.show()
        let res = await addGhimBaiDang(this.state.item.Id_BaiDang);
        // Utils.nlog('ress ghim', res)
        if (res.status == 1) {
            actionSheetRef_Nhom.current?.hide()
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, type == true ? RootLang.lang.JeeSocial.huyghimthanhcong : RootLang.lang.JeeSocial.ghimthanhcong, 1)
            await this._onRefresh()
            this.refLoading.current.hide()
        }
        else {
            this.refLoading.current.hide()
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
        }
    }

    _callback = () => {
        ROOTGlobal.LoadDanhSachBaiDang_Nhom.LoadDSBaiDang_InNhom()
        Utils.goscreen(this, 'sc_XemBaiDangTrongNhom')
    }

    _editBaiDang = async () => {
        actionSheetRef_Nhom.current?.hide();
        Utils.goscreen(this, 'Modal_EditBaiDang', { nthis: this, data: this.state.item, callback: this._callback })
    }

    _mauLike = (id) => {
        switch (id) {
            case 1: return '#2D86FF' //like
            case 2: return '#EF415A' //love
            case 3: return '#F6B039' //haha
            case 4: return '#F6B039' //wow
            case 5: return '#F6B039' //sad
            case 6: return '#F6B039' //care
            case 7: return '#E77125' //angry
            default: colors.black
        }
    }

    getReactionJson = type => {
        switch (type) {
            case 'Like':
                return require('../Home/LottieEmotion/like.json');
            case 'Love':
                return require('../Home/LottieEmotion/love.json');
            case 'Haha':
                return require('../Home/LottieEmotion/haha.json');
            case 'Wow':
                return require('../Home/LottieEmotion/wow.json');
            case 'Sad':
                return require('../Home/LottieEmotion/sad.json');
            case 'Care':
                return require('../Home/LottieEmotion/care.json');
            case 'Angry':
                return require('../Home/LottieEmotion/angry.json');
        }
    };

    getReactionJsonStyle = type => {
        switch (type) {
            case 'Like':
                return {
                    width: Width(20),
                    marginBottom: 4
                }
            case 'Love':
                return {
                    width: Platform.OS == 'ios' ? Width(10) : Width(20),
                    marginBottom: 4
                }
            case 'Haha':
                return {
                    width: Width(10),
                    marginBottom: 4
                }
            case 'Wow':
                return {
                    width: Width(10),
                    marginBottom: 4
                }
            case 'Sad':
                return {
                    width: Width(12),
                    marginBottom: 4
                }
            case 'Care':
                return {
                    width: Width(13),
                    marginBottom: 4
                }
            case 'Angry':
                return {
                    width: Width(12),
                    marginBottom: 4
                }
        }
    };

    renderItem = ({ item, index }) => {
        var animatedStyleDefault = {
            transform: [{ scale: new Animated.Value(1) }],
            paddingBottom: new Animated.Value(0)
        };
        var animatedStyle = {
            transform: [{ scale: this.animatedValue }],
            paddingBottom: this.animatedMargin
        };
        return (
            <TouchableWithoutFeedback
                onPressIn={() => this.onPressIn(index)}
                onPressOut={() => this.onPressOut()}
                onPress={async () => { this._like(this.state.item_idbaidang, item.key) }}
            >
                <Animated.View style={[styles.reactView, index == this.state.animationReact ? animatedStyle : animatedStyleDefault]}>
                    <LottieView
                        autoPlay
                        loop
                        style={this.getReactionJsonStyle(item.type)}
                        source={this.getReactionJson(item.type)}
                    />
                </Animated.View>
            </TouchableWithoutFeedback>
        );
    };

    _icon_Emoji = (id) => {
        switch (id) {
            case 1: return Images.ImageJee.ic_DaLike;
            case 2: return Images.ImageJee.icLove;
            case 3: return Images.ImageJee.icHaHa;
            case 4: return Images.ImageJee.icWow;
            case 5: return Images.ImageJee.icSad;
            case 6: return Images.ImageJee.icThuong;
            case 7: return Images.ImageJee.icAngry;
            default: return Images.ImageJee.icLike;
        }
    }
    _goModalBinhLuan = (item) => {
        Utils.goscreen(this, 'sc_BinhLuan', { nthis: this.nthis, idbaidang: item })
        // Utils.goscreen(this, 'Modal_devoloping')
    }

    renderImageBG = (item) => {
        switch (item) {
            case 'bg1': return Images.ImageJee.icBG1;
            case 'bg2': return Images.ImageJee.icBG2;
            case 'bg3': return Images.ImageJee.icBG3;
            case 'bg4': return Images.ImageJee.icBG4;
        }
    }

    _tinNoiBat = async () => {
        actionSheetRef_Nhom.current?.hide()
        this.refLoading.current.show()
        let res = await AddTinNoiBat(this.state.item.Id_BaiDang);
        // Utils.nlog('ress _tinNoiBat', res)
        if (res.status == 1) {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.JeeSocial.gantinnoibat, 1)
            await this._onRefresh()
            this.refLoading.current.hide()
        }
        else {
            this.refLoading.current.hide()
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
        }
    }

    _HuyTinNoiBat = async () => {
        actionSheetRef_Nhom.current?.hide()
        this.refLoading.current.show()
        let res = await HuyTinNoiBat(this.state.item.Id_BaiDang);
        // Utils.nlog('ress _HuyTinNoiBat', res)
        if (res.status == 1) {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.JeeSocial.huygantinnoibat, 1)
            await this._onRefresh()
            ROOTGlobal.GetTinNoiBat.GetTinnoiBat()
            ROOTGlobal.LoadDanhSachBaiDang_Nhom.LoadDSBaiDang_InNhom()
            ROOTGlobal.LoadDanhSachBaiDang_Nhom.LoadDSBaiDang_Nhom()
            ROOTGlobal.LoadDanhSachBaiDang.LoadDSBaiDang()
            this.refLoading.current.hide()
        }
        else {
            this.refLoading.current.hide()
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
        }
    }

    _onOffThongBao = async () => {
        this.refLoading.current.show()
        let res = await On_OffThongBao(this.state.item.Id_BaiDang);
        // Utils.nlog('ress On_OffThongBao', res)
        if (res.status == 1) {
            actionSheetRef_Nhom.current?.hide()
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, this.state.item?.ThongBao.isThongBao == false ? RootLang.lang.JeeSocial.batthongbao : RootLang.lang.JeeSocial.tatthongbao, 1)
            await this._onRefresh()
            this.refLoading.current.hide()
        }
        else {
            this.refLoading.current.hide()
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
        }
    }
    _showMore = async (itemChoice) => {
        const { listBaiDangNhom } = this.state
        listBaiDangNhom.map((item) => {
            if (item === itemChoice) {
                item.check = !item.check
                if (item.check === true) {
                    item.check == !item.check
                } else if (item.check === false) {
                    item.check == !item.check
                }
            }
        })
        this.setState({ listBaiDangNhom: listBaiDangNhom })
    }

    _renderItem_KhenThuong_Anh = ({ item, index }) => {
        return (
            <TouchableOpacity
                style={{ alignItems: 'center', paddingHorizontal: 5, justifyContent: 'center' }}>
                <ImageCus
                    style={[nstyles.nAva32, {}]}
                    source={{ uri: item.avatar }}
                    resizeMode={"cover"}
                    defaultSourceCus={Images.icAva}
                />
            </TouchableOpacity >
        );
    }

    _goModalShowUserTag = (item) => {
        Utils.goscreen(this, 'Modal_ShowUserTag', { data: item })
    }

    onPlayVideo = (suri) => {
        Utils.goscreen(this, 'Modal_PlayMedia', { source: suri });
    }

    _renderItem = ({ item, index }) => {
        const { showMore_thaoluan, showMore_khenthuong1, showMore_khenthuong2, showMore_thongbao } = this.state;
        let fileanh = item.Attachment.length > 0 ? item.Attachment.map((i) => {
            return i.hinhanh
        }) : []

        fileanh = fileanh.filter((el) => {
            return el != ''
        })
        return (
            <TouchableWithoutFeedback onPress={() => { this.setState({ showReact: null }) }}>
                <View style={styles.container}>
                    <View style={styles.con_khunglon}>
                        <View style={styles.con_khungava}>
                            <ImageCus
                                style={nstyles.nAva32}
                                source={{ uri: item.User_DangBai[0].avatar }}
                                resizeMode={"contain"}
                                defaultSourceCus={Images.icAva}
                            />
                            <View style={styles.con_khungnhom}>
                                <View style={{ flex: 1 }}>
                                    <View style={styles.con_khungten}>
                                        <Text style={styles.text_name}>{item.User_DangBai[0].Fullname}</Text>
                                        {
                                            item.Group.length > 0 ? (
                                                <View style={{ flex: 1, }}>
                                                    <TouchableOpacity onPress={() => this._goModalXemBaiDangNhom(item)} style={styles.con_khungchung_row}>
                                                        <Image source={Images.ImageJee.icMetroplay} resizeMode='contain' style={nstyles.nIcon8, styles.img_tamgiac} />
                                                        <View style={{ flex: 1 }}>
                                                            <Text numberOfLines={1} style={styles.text_tengroup} >{item.Group[0].ten_group}</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                </View >
                                            ) : (
                                                    <View style={{ flex: 1 }}>
                                                        {
                                                            item.TagName.length > 0 && item.TagName.length >= 3 ? (
                                                                <TouchableOpacity onPress={() => { this._goModalShowUserTag(item.TagName) }} style={styles.con_khungchung_rowtext}>
                                                                    <Text> {RootLang.lang.JeeSocial.voi}</Text>
                                                                    <View style={{ flex: 1 }}>
                                                                        <Text numberOfLines={1} style={styles.text_tenNguoiDcTagNhieu}>{item.TagName.length}{' ' + RootLang.lang.JeeSocial.nguoikhac}</Text>
                                                                    </View>
                                                                </TouchableOpacity>
                                                            ) : (
                                                                    null
                                                                )
                                                        }
                                                    </View>
                                                )
                                        }
                                    </View>
                                    <View style={styles.con_khungchung_row}>
                                        <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
                                            <Text style={{ color: colors.colorTextBTGray }}>
                                                {UtilsApp.convertDatetime(item.CreatedDate)}
                                            </Text>
                                            {
                                                item.Ghim ? (
                                                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                                        <Image source={Images.ImageJee.icGhim} resizeMode='contain' style={[nstyles.nIcon12, { marginLeft: 5 }]} />
                                                    </View>
                                                ) : (null)
                                            }
                                            {
                                                item?.ThongBao.isThongBao == true ? (
                                                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                                        <Image source={Images.ImageJee.icTurnOnNoti} resizeMode='contain' style={[nstyles.nIcon12, { marginLeft: 5 }]} />
                                                    </View>
                                                ) : (
                                                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                                            <Image source={Images.ImageJee.icTurnOffNoti} resizeMode='contain' style={[nstyles.nIcon12, { marginLeft: 5 }]} />
                                                        </View>
                                                    )
                                            }
                                        </View>
                                    </View>
                                </View>
                                {
                                    item.CreatedBy == this.state.id_User ? (
                                        <TouchableOpacity style={[{ alignItems: 'center', justifyContent: 'center', height: Height(3), width: Width(6), paddingBottom: 10, }]}
                                            onPress={() => { actionSheetRef_Nhom.current?.show(), this.setState({ item: item }) }} >
                                            <Image source={Images.ImageJee.icBaCham} resizeMode='contain' style={[nstyles.nIconH4W18, {}]} />
                                        </TouchableOpacity>
                                    ) : (null)
                                }
                            </View>
                        </View>

                        <View style={{ flex: 1, paddingVertical: 5, marginBottom: 5 }}>
                            <View style={{ marginBottom: 5 }}>
                                <TextHyper item={item} onPress={() => this._showMore(item)} ></TextHyper>
                            </View>

                            <View>
                                {
                                    item.Attachment_File.length > 0 ? (
                                        <View style={{
                                            flexWrap: 'wrap',
                                            width: '100%',
                                            flexDirection: 'row',
                                        }}>
                                            {item.Attachment_File.map((i, index) => {
                                                return (
                                                    <TouchableOpacity onPress={() => i?.Link ? Utils.openUrl(i.Link) : Utils.openUrl('https://cdn.jee.vn/jee-social/UploadFile/' + i.filename)}
                                                        key={index}
                                                        style={{
                                                            width: Width(21), shadowColor: "#000",
                                                            height: Width(21),
                                                            shadowOffset: {
                                                                width: 0,
                                                                height: 0,
                                                            },
                                                            shadowOpacity: 0.25,
                                                            marginHorizontal: Width(1.3),
                                                            shadowRadius: 1,
                                                            elevation: 5, backgroundColor: 'white',
                                                            padding: 0, alignItems: 'center', borderRadius: 4, marginBottom: 5
                                                        }}>
                                                        <View style={{ padding: 0, width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                                                            <Image resizeMode={'contain'}
                                                                source={UtilsApp._returnImageFile(i.filename)}
                                                                style={{ width: Width(10), height: Width(10), borderRadius: 4 }}></Image>
                                                            <View style={{ flex: 1, paddingHorizontal: 10, position: 'absolute', bottom: 5 }}>
                                                                <Text style={{ fontSize: reText(10), color: colors.black_80 }} numberOfLines={1}>
                                                                    {i.filename}</Text>
                                                            </View>
                                                        </View>
                                                    </TouchableOpacity >
                                                )
                                            })}
                                        </View>
                                    ) : (null)
                                }
                                {item.Attachment.length > 0 ? (
                                    <FbImages
                                        nthis={this}
                                        images={fileanh}
                                        imageOnPress={() => { }}
                                    />
                                ) : (null)}
                                {
                                    item.Videos.length > 0 ? (
                                        <View style={{
                                            flexWrap: 'wrap',
                                            width: '100%',
                                            flexDirection: 'row',
                                        }}>
                                            {item.Videos.map((i, index) => {
                                                return (
                                                    <Video key={index} uri={encodeURI(i.path)} onpress={() => this.onPlayVideo(encodeURI(i.path))} > </Video>
                                                )
                                            })}
                                        </View>
                                    ) : (null)
                                }
                                {
                                    item.Group.length > 0 && item.TagName.length > 0 ? (
                                        <TouchableOpacity onPress={() => { this._goModalShowUserTag(item.TagName) }} style={[styles.con_khungchung_rowtext, { marginTop: 5 }]}>
                                            <Text> {RootLang.lang.JeeSocial.voi}</Text>
                                            <View style={{ flex: 1 }}>
                                                <Text numberOfLines={1} style={styles.text_tenNguoiDcTagNhieu}>{item.TagName.length}{' ' + RootLang.lang.JeeSocial.nguoikhac}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    ) : (
                                            null
                                        )
                                }
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1, marginBottom: 7 }}>
                            <TouchableOpacity
                                onPress={() => { Utils.goscreen(this, "Modal_ShowEmoji", { idbaidang: item.Id_BaiDang }) }}
                                style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                {item.Like_BaiDang?.length > 0 ? (
                                    item.Like_BaiDang.map((i) =>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Image
                                                source={this._icon_Emoji(i.ID_like)}
                                                resizeMode='contain' style={[nstyles.nIcon14, {}]} />
                                            <Text style={{ color: colors.colorTextBTGray, paddingLeft: 3 }} >{i.tong}  </Text>
                                        </View>
                                    )
                                ) : null}
                            </TouchableOpacity>
                            <View>
                                {
                                    item.lengthComment > 0 ? (
                                        <Text style={{ color: colors.colorTextBTGray }}>{item.lengthComment}{' ' + RootLang.lang.JeeSocial.comment}</Text>
                                    ) : null
                                }
                            </View>
                        </View>
                    </View>
                    <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                        <Dash
                            dashColor={colors.colorVeryLightPink}
                            style={{ width: Width(95), height: 1, }}
                            dashGap={0}
                            dashThickness={1} />
                    </View>
                    {this.state.showReact == index ?
                        <Card style={[styles.card, { position: "absolute", bottom: 30 }]}>
                            <FlatList
                                data={this.types}
                                horizontal
                                renderItem={this.renderItem}
                                keyExtractor={item => item.key}
                                bounces={false}
                                style={styles.list}
                            />
                        </Card>
                        : null}
                    <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between', height: Height(4) }}>
                        {item.Like ? ( //có tốn tại like
                            <TouchableOpacity style={{ width: Width(32), justifyContent: "center", alignContent: "center" }}
                                onPress={() => this._like(item.Id_BaiDang, 0)}
                                onLongPress={() => { this.setState({ showReact: index, item_idbaidang: item.Id_BaiDang }) }}
                            >
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    <Image
                                        source={this._icon_Emoji(item.Like?.ID_like)}
                                        resizeMode='contain' style={[nstyles.nIcon14, {}]} />
                                    <Text style={{ marginLeft: 5, color: this._mauLike(item.Like?.ID_like) }}>{item.Like && FuncSocail.Title_Emoji(item.Like.ID_like)}</Text>
                                </View>
                            </TouchableOpacity>
                        ) : (
                                <TouchableOpacity style={{ width: Width(32), justifyContent: "center", alignContent: "center" }}
                                    onPress={() => this._like(item.Id_BaiDang, 1)}
                                    onLongPress={() => { this.setState({ showReact: index, item_idbaidang: item.Id_BaiDang }) }}
                                >
                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>

                                        <Image
                                            source={this._icon_Emoji(item.Like?.ID_like)}
                                            resizeMode='contain' style={[nstyles.nIcon14, {}]} />
                                        <Text style={{ marginLeft: 5, color: this._mauLike(item.Like?.ID_like) }}>{RootLang.lang.JeeSocial.like}</Text>
                                    </View>

                                </TouchableOpacity>
                            )}

                        <TouchableOpacity onPress={() => this._goModalBinhLuan(item.objectid)} style={{ width: Width(32), justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <Image source={Images.ImageJee.icBinhLuan} resizeMode='cover' style={[nstyles.nIcon11, {}]} />
                                <Text style={{ marginLeft: 5 }}>{RootLang.lang.JeeSocial.comment}</Text>
                            </View>
                        </TouchableOpacity>
                        {item.Save_?.length > 0 ? (
                            <TouchableOpacity
                                onPress={() => this._luuTru(item.Id_BaiDang)}
                                style={{ width: Width(32), justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    <Image source={Images.ImageJee.icLuuTru} resizeMode='cover' style={[{ tintColor: '#32AC48' }]} />
                                    <Text style={{ marginLeft: 5, color: '#32AC48' }}>{RootLang.lang.JeeSocial.share}</Text>
                                </View>
                            </TouchableOpacity>
                        ) : (
                                <TouchableOpacity
                                    onPress={() => this._luuTru(item.Id_BaiDang)}
                                    style={{ width: Width(32), justifyContent: 'center', alignItems: 'center' }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                        <Image source={Images.ImageJee.icLuuTru} resizeMode='cover' style={[{}]} />
                                        <Text style={{ marginLeft: 5 }}>{RootLang.lang.JeeSocial.share}</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }

    _paresAnh = async (list) => {
        let anhParse = []
        let downSize = 1;
        if (list?.height >= 2000 || list?.width >= 2000) {
            downSize = 0.3;
        }
        let str64 = await Utils.parseBase64_PAHT(list.uri, list.height, list.width, downSize, list.timePlay != 0)
        anhParse.push({
            "strbase64": str64,
            "filename": list.filename,

        })
        return anhParse
    }

    _updateAnh = async () => {
        this.refLoading.current.show()
        let anh = {};
        anh = await this._paresAnh(this.state.images)
        let data = this.homesocail ? this.item_truyenvao?.Group[0]?.id_group : this.item_truyenvao?.ID_group;
        // Utils.nlog('anh', anh)
        let anhparse = anh[0]
        let res = await UpdateAvatarGroup(data, anhparse)
        if (res.status == 1) {
            this.setState({
                editAnhBia: false,
            },
                async () => {
                    let load = await this._getDSUser_Group()
                    if (load == true) {
                        this.refLoading.current.hide()
                    }
                })
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.JeeSocial.capnhatanhthanhcong, 1)
        } else {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
        }
    }

    renameTenNhom = async () => {
        actionSheetRef_EditNhom.current?.hide();
        let data = this.homesocail ? this.item_truyenvao?.Group[0]?.id_group : this.item_truyenvao?.ID_group;
        let name = this.state.dsUserGroup.Ten_Group
        Utils.goscreen(this, 'Modal_EditTenGroup', { idgroup: data, tengroup: name, focus: true })
    }

    _editAnhNhom = async () => {
        actionSheetRef_EditNhom.current?.hide();
        this.setState({
            editAnhBia: true,
        }, () => {
            this._go_PickImage()
        })
    }

    _xoaNhom = () => {
        actionSheetRef_EditNhom.current?.hide();
        let data = this.homesocail ? this.item_truyenvao?.Group[0]?.id_group : this.item_truyenvao?.ID_group;
        Utils.showMsgBoxYesNo(this, RootLang.lang.thongbaochung.thongbao, RootLang.lang.JeeSocial.banmuonxoanhomnay, RootLang.lang.scchamcong.dongy, RootLang.lang.scchamcong.huy,
            async () => {
                this.refLoading.current.show()
                let res = await deleteGroup(data);
                // Utils.nlog("delete nhóm-------------------------", res)
                if (res.status == 1) {
                    this.refLoading.current.hide()
                    UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.JeeSocial.xoathanhcong, 1)
                    Utils.goscreen(this, 'sc_TabHomeSocial')
                    ROOTGlobal.setIndexTab.setIndex(2)
                    ROOTGlobal.LoadDanhSachGroup.LoadDSGroup()
                    ROOTGlobal.LoadDanhSachBaiDang_Nhom.LoadDSBaiDang_Nhom()
                }
                else {
                    this.refLoading.current.hide()
                    UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.JeeSocial.xoathatbai, 2)
                }
            }
        )
    }

    _loadBaiDang = async () => {
        this.setState({
            listBaiDangNhom: [],
        }, () => {
            this._loadDanhSachBaiDang_InGroupLai(1)
        })
    }

    _goXemAnh_File = (title = '', id) => {
        actionSheetRef_XemAnhVideo.current.hide()
        let data = this.homesocail ? this.item_truyenvao?.Group[0]?.id_group : this.item_truyenvao?.ID_group;
        Utils.goscreen(this, 'sc_XemAnh_File', { title: title, idgroup: data, menu: id })
    }

    _go_PickImage = () => {
        actionSheetRef_EditNhom.current?.hide();
        let options = {
            assetType: 'Photos',//All,Videos,Photos - default
            multi: true,// chọn 1 or nhiều item
            response: (data) => this.response(data, 1), // callback giá trị trả về khi có chọn item
            limitCheck: 1, //gioi han sl media chon: -1 la khong co gioi han, >-1 la gioi han sl =  limitCheck
            groupTypes: 'All',
        };
        Utils.goscreen(this, 'Modal_MediaPicker', options);
    }

    response = async (data, type) => {
        switch (type) {
            case 1:
                {
                    if (data?.iscancel) {
                        this.setState({
                            editAnhBia: false
                        })
                    }
                    else {
                        let datanew = data.map(item => {
                            return { ...item, type: 1 }
                        })
                        await this.setState({
                            images: datanew[0]
                        })
                    }
                }
                break;
            default:
                break;
        }
    }

    _renderItemMenuGroup = ({ item, index }) => {
        switch (item.ID_menu) {
            case 1: // bài đăng thảo luận
                return (
                    <RenderTouch item={item} itemState={this.state.loaiMenu} onPress={() => {
                        this.setState({
                            loaiMenu: this.state.loaiMenu?.ID_menu != item.ID_menu ? item : {}
                        }, () => {
                            this.state.loaiMenu?.ID_menu ? this._getDSBaiDang_TypeIn_Group(1) : (this._loadBaiDang())
                        })
                    }} ></RenderTouch>
                )
            case 2:// bài đăng thông báo
                return (
                    <RenderTouch item={item} itemState={this.state.loaiMenu} onPress={() => {
                        this.setState({
                            loaiMenu: this.state.loaiMenu?.ID_menu != item.ID_menu ? item : {}
                        }, () => {
                            this.state.loaiMenu?.ID_menu ? this._getDSBaiDang_TypeIn_Group(2) : (this._loadBaiDang())
                        })
                    }}></RenderTouch>
                )
            case 3:// thành viên
                return (
                    <RenderTouch item={item} itemState={this.state.loaiMenu} onPress={() => {
                        // this.setState({
                        //     loaiMenu: this.state.loaiMenu?.ID_menu != item.ID_menu ? item : {}
                        // }, () => {
                        //     this.state.loaiMenu?.ID_menu ? this._go_XemThanhVien() : (this._loadBaiDang())
                        // })
                        this._go_XemThanhVien()
                    }}  ></RenderTouch>
                )
            case 4://Ảnh/Video
                return (
                    <RenderTouch item={item} itemState={this.state.loaiMenu} onPress={() => {
                        // this.setState({
                        //     loaiMenu: this.state.loaiMenu?.ID_menu != item.ID_menu ? item : {}
                        // }, () => {
                        //     this.state.loaiMenu?.ID_menu ? this._goXemAnh_File('Ảnh', 4) : (this._loadBaiDang())
                        // })
                        actionSheetRef_XemAnhVideo.current.show()
                    }}></RenderTouch>
                )
            case 5://File/Link
                return (
                    <RenderTouch item={item} itemState={this.state.loaiMenu} onPress={() => {
                        // this.setState({
                        //     loaiMenu: this.state.loaiMenu?.ID_menu != item.ID_menu ? item : {}
                        // }, () => {
                        //     this.state.loaiMenu?.ID_menu ? this._goXemAnh_File('File', 5) : (this._loadBaiDang())
                        // })
                        this._goXemAnh_File('File', 5)
                    }} ></RenderTouch>
                )
        }
    }

    render() {
        const { opacity, listBaiDangNhom, showload, refreshing, id_User, item, empty, dsMenuGroup, dsUserGroup, editAnhBia, listBaiDangNhomType, loaiMenu, images } = this.state
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: '#E4E6EB', }]}>
                <View style={{ backgroundColor: colors.white, flex: 1, }}>
                    <View style={{ flexGrow: 1, }}>
                        <HeaderComStackV2
                            nthis={this}
                            title={dsUserGroup.Ten_Group}
                            iconRight={Images.ImageJee.icIConThemNguoiVaoNhom}
                            styIconRight={[, {}]}
                            iconLeft={Images.ImageJee.icBack}
                            onPressLeft={this._goback}
                            onPressRight={() => { this._go_XemThanhVien() }}
                            styBorder={{
                                borderBottomColor: colors.black_20_2,
                                borderBottomWidth: 0.3
                            }}
                        />

                        <View style={{ flex: 1, backgroundColor: '#E4E6EB', paddingBottom: paddingBotX }}>
                            <ScrollView nestedScrollEnabled style={{ flex: 1 }}>
                                <View style={{ backgroundColor: colors.white, }}>
                                    {
                                        editAnhBia == false ? (
                                            <View>
                                                {
                                                    dsUserGroup.Avatar_group != null ? (
                                                        <>
                                                            <Image source={{ uri: dsUserGroup.Avatar_group }} resizeMode={'cover'} style={{ height: Width(50) }} />
                                                            {
                                                                dsUserGroup.quyen_group == true &&
                                                                <TouchableOpacity style={{ zIndex: 1, position: 'absolute', right: 0, padding: 10, }}
                                                                    onPress={() => actionSheetRef_EditNhom.current.show()}>
                                                                    <Image source={Images.ImageJee.icBaChamdoc} resizeMode='contain' style={[nstyles.nIcon14, { tintColor: colors.black }]} />
                                                                </TouchableOpacity>
                                                            }
                                                        </>
                                                    ) : (
                                                            <>
                                                                <Image source={Images.ImageJee.icBackGroundMD} resizeMode={'cover'} style={{ height: Width(50), width: '100%' }} />
                                                                {
                                                                    dsUserGroup.quyen_group == true &&
                                                                    <TouchableOpacity style={{ zIndex: 1, position: 'absolute', right: 0, padding: 10, }}
                                                                        onPress={() => actionSheetRef_EditNhom.current.show()}>
                                                                        <Image source={Images.ImageJee.icBaChamdoc} resizeMode='contain' style={[nstyles.nIcon14, { tintColor: colors.black }]} />
                                                                    </TouchableOpacity>
                                                                }
                                                            </>
                                                        )
                                                }
                                            </View>
                                        ) : (
                                                <View>
                                                    <Image source={{ uri: images.uri }} resizeMode={'cover'} style={{ height: Width(50) }} />
                                                    <View style={{ zIndex: 1, position: 'absolute', right: 0, padding: 10, flexDirection: 'row' }}>
                                                        <TouchableOpacity style={{ backgroundColor: '#E4E6EB', paddingVertical: 6, paddingHorizontal: 20, marginRight: 10, borderRadius: 10 }}
                                                            onPress={() => { this.setState({ editAnhBia: false }) }}  >
                                                            <Text style={{ color: colors.gray1 }}>{RootLang.lang.scchamcong.huy}</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity style={{ backgroundColor: 'green', paddingVertical: 6, paddingHorizontal: 30, borderRadius: 10 }}
                                                            onPress={() => { this._updateAnh() }}  >
                                                            <Text style={{ color: colors.white }}>{RootLang.lang.JeeSocial.luu}</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            )
                                    }
                                    <View>
                                        <View style={{ padding: 10, flexDirection: 'row', alignItems: 'center' }}>
                                            <View style={{ width: Width(2), height: Width(2), borderRadius: 20, backgroundColor: colors.black_20, alignItems: 'center', marginRight: 5 }}></View>
                                            <Text style={{ fontSize: reText(16), fontWeight: '600' }}>{dsUserGroup.Group_member?.length + ' ' + RootLang.lang.JeeSocial.thanhvien}</Text>
                                        </View>
                                        <View style={{ paddingBottom: dsMenuGroup.length > 0 ? 10 : 0, paddingLeft: 15 }}>
                                            <FlatList
                                                showsHorizontalScrollIndicator={false}
                                                showsVerticalScrollIndicator={false}
                                                horizontal
                                                data={dsMenuGroup}
                                                renderItem={this._renderItemMenuGroup}
                                                keyExtractor={(item, index) => index.toString()}
                                            />
                                        </View>
                                    </View>
                                </View>
                                <ButtonTaoBaiDang onPress={this._taoBaiDang}></ButtonTaoBaiDang>
                                <View style={{ flex: 1 }}>
                                    <FlatList
                                        extraData={this.state}
                                        showsHorizontalScrollIndicator={false}
                                        showsVerticalScrollIndicator={false}
                                        refreshing={refreshing}
                                        style={{}}
                                        data={listBaiDangNhom}
                                        renderItem={this._renderItem}
                                        onEndReached={() => {
                                            if (!this.onEndReachedCalledDuringMomentum) {
                                                this.onLoadMore()
                                                this.onEndReachedCalledDuringMomentum = true;
                                            }
                                        }}
                                        onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
                                        onEndReachedThreshold={0.01}
                                        initialNumToRender={5}
                                        maxToRenderPerBatch={10}
                                        windowSize={7}
                                        updateCellsBatchingPeriod={100}
                                        onRefresh={this._onRefresh}
                                        keyExtractor={(item, index) => index.toString()}
                                        removeClippedSubviews={true}
                                        ListEmptyComponent={this.state.listBaiDangNhom.length == 0 ? <ListEmptyLottie_Social style={{ justifyContent: 'center', alignItems: 'center', }} textempty={empty == false ? RootLang.lang.JeeSocial.khongcobaidang : null} styleText={{ marginTop: -60 }} /> : null}
                                        ListFooterComponent={showload ? <ActivityIndicator size='small' /> : null}
                                    />
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                    <ActionSheet ref={actionSheetRef_Nhom}>
                        <View style={{ maxHeight: Height(50), paddingBottom: paddingBotX, width: Width(100) }}>
                            <HeaderModal />
                            {
                                item.CreatedBy == id_User ? (
                                    <View>
                                        <TouchableOpacity
                                            onPress={() => this._editBaiDang()}
                                            style={{ height: Height(5), borderBottomWidth: 0.3, borderColor: '#E4E6EB', width: Width(100), justifyContent: 'center', alignItems: 'center', padding: 10, marginTop: 2 }}>
                                            <Text style={{ fontSize: reText(15), }}>{RootLang.lang.JeeSocial.suabaidang}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => this._xoaBaiDang_Nhom()}
                                            style={{ height: Height(6), width: Width(100), justifyContent: 'center', alignItems: 'center', padding: 10, marginTop: 1, borderBottomWidth: 0.3, borderColor: '#E4E6EB' }}>
                                            <Text style={{ fontSize: reText(15) }}>{RootLang.lang.JeeSocial.xoabaidang}</Text>

                                        </TouchableOpacity>
                                        {
                                            item?.Ghim ?
                                                (
                                                    <TouchableOpacity
                                                        onPress={() => this._ghimBaiDAng(true)}
                                                        style={{ height: Height(5), borderBottomWidth: 0.3, borderColor: '#E4E6EB', width: Width(100), justifyContent: 'center', alignItems: 'center', padding: 10, marginTop: 2 }}>
                                                        <Text style={{ fontSize: reText(15) }}>{RootLang.lang.JeeSocial.huyghimbaidang}</Text>
                                                    </TouchableOpacity>
                                                ) : (
                                                    <TouchableOpacity
                                                        onPress={() => this._ghimBaiDAng(false)}
                                                        style={{ height: Height(5), borderBottomWidth: 0.3, borderColor: '#E4E6EB', width: Width(100), justifyContent: 'center', alignItems: 'center', padding: 10, marginTop: 2 }}>
                                                        <Text style={{ fontSize: reText(15) }}>{RootLang.lang.JeeSocial.ghimbaidang}</Text>
                                                    </TouchableOpacity>
                                                )
                                        }
                                        {
                                            item.Id_LoaiBaiDang == 1 && item.isNoiBat == false ? (
                                                <TouchableOpacity
                                                    onPress={() => this._tinNoiBat()}
                                                    style={{ height: Height(5), borderBottomWidth: 0.3, borderColor: '#E4E6EB', width: Width(100), justifyContent: 'center', alignItems: 'center', padding: 10, marginTop: 2 }}>
                                                    <Text style={{ fontSize: reText(15) }}>{RootLang.lang.JeeSocial.tinnoibat}</Text>
                                                </TouchableOpacity>
                                            ) : (null)
                                        }
                                        {
                                            item.Id_LoaiBaiDang == 1 && item.isNoiBat == true ? (
                                                <TouchableOpacity
                                                    onPress={() => this._HuyTinNoiBat()}
                                                    style={{ height: Height(5), borderBottomWidth: 0.3, borderColor: '#E4E6EB', width: Width(100), justifyContent: 'center', alignItems: 'center', padding: 10, marginTop: 2 }}>
                                                    <Text style={{ fontSize: reText(15) }}>{RootLang.lang.JeeSocial.bodanhdautinnoibat}</Text>
                                                </TouchableOpacity>
                                            ) : (null)
                                        }
                                        {
                                            item?.ThongBao.isThongBao == true ?
                                                (
                                                    <TouchableOpacity
                                                        onPress={() => this._onOffThongBao()}
                                                        style={{ height: Height(5), borderBottomWidth: 0.3, borderColor: '#E4E6EB', width: Width(100), justifyContent: 'center', alignItems: 'center', padding: 10, marginTop: 2 }}>
                                                        <Text style={{ fontSize: reText(15) }}>{RootLang.lang.JeeSocial.tatthongbaobaidang}</Text>
                                                    </TouchableOpacity>
                                                ) : (
                                                    <TouchableOpacity
                                                        onPress={() => this._onOffThongBao()}
                                                        style={{ height: Height(5), borderBottomWidth: 0.3, borderColor: '#E4E6EB', width: Width(100), justifyContent: 'center', alignItems: 'center', padding: 10, marginTop: 2 }}>
                                                        <Text style={{ fontSize: reText(15) }}>{RootLang.lang.JeeSocial.batthongbaobaidang}</Text>
                                                    </TouchableOpacity>
                                                )
                                        }
                                    </View>
                                ) : (
                                        <View>
                                            {
                                                null
                                            }
                                        </View>
                                    )
                            }
                        </View>
                    </ActionSheet>
                    <ActionSheet ref={actionSheetRef_EditNhom}>
                        <View style={{ maxHeight: Height(50), paddingBottom: paddingBotX, width: Width(100) }}>
                            <HeaderModal />
                            <View>
                                <TouchableOpacity
                                    onPress={() => this._editAnhNhom()}
                                    style={{ height: Height(5), borderBottomWidth: 0.3, borderColor: '#E4E6EB', width: Width(100), justifyContent: 'center', alignItems: 'center', padding: 10, marginTop: 2, flexDirection: 'row' }}>
                                    <Image source={Images.ImageJee.icEditPhoto} resizeMode='contain' style={[nstyles.nIcon17, { marginRight: 5 }]}></Image>
                                    <Text style={{ fontSize: reText(15) }}>{RootLang.lang.JeeSocial.taianhnhom}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => this.renameTenNhom()}
                                    style={{ height: Height(6), width: Width(100), justifyContent: 'center', alignItems: 'center', padding: 10, marginTop: 1, borderBottomWidth: 0.3, borderColor: '#E4E6EB', flexDirection: 'row' }}>
                                    <Image source={Images.ImageJee.icPen} resizeMode='contain' style={[nstyles.nIcon17, { marginRight: 5 }]}></Image>
                                    <Text style={{ fontSize: reText(15), }}>{RootLang.lang.JeeSocial.doitennhom}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => this._xoaNhom()}
                                    style={{ height: Height(6), width: Width(100), justifyContent: 'center', alignItems: 'center', padding: 10, marginTop: 1, borderBottomWidth: 0.3, borderColor: '#E4E6EB', flexDirection: 'row' }}>
                                    <Image source={Images.ImageJee.icDeleteRequest} resizeMode='contain' style={[nstyles.nIcon17, { marginRight: 5 }]}></Image>
                                    <Text style={{ fontSize: reText(15), }}>{RootLang.lang.JeeSocial.xoanhom}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ActionSheet>
                    <ActionSheet ref={actionSheetRef_XemAnhVideo}>
                        <View style={{ maxHeight: Height(50), paddingBottom: paddingBotX, width: Width(100) }}>
                            <HeaderModal />
                            <View>
                                <TouchableOpacity
                                    onPress={() => this._goXemAnh_File('Ảnh', 4)}
                                    style={{ height: Height(5), borderBottomWidth: 0.3, borderColor: '#E4E6EB', width: Width(100), justifyContent: 'center', alignItems: 'center', padding: 10, marginTop: 2, flexDirection: 'row' }}>
                                    <Image source={Images.ImageJee.icEditPhoto} resizeMode='contain' style={[nstyles.nIcon17, { marginRight: 5 }]}></Image>
                                    <Text style={{ fontSize: reText(15) }}>{RootLang.lang.JeeSocial.xemanh}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => this._goXemAnh_File('Video', 6)}
                                    style={{ height: Height(6), width: Width(100), justifyContent: 'center', alignItems: 'center', padding: 10, marginTop: 1, borderBottomWidth: 0.3, borderColor: '#E4E6EB', flexDirection: 'row' }}>
                                    <Image source={Images.ImageJee.icVideo} resizeMode='contain' style={[nstyles.nIcon17, { marginRight: 5 }]}></Image>
                                    <Text style={{ fontSize: reText(15), }}>{RootLang.lang.JeeSocial.xemvideo}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ActionSheet>

                </View>
                <IsLoading ref={this.refLoading} />
            </View >
        )
    }
}

const mapStateToProps = state => ({
    lang: state.changeLanguage.language,
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
    },
    container: {
        backgroundColor: colors.white,
        marginBottom: 5,
        paddingHorizontal: 5
    },
    con_khunglon: {
        marginTop: 10
    },
    con_khungava: {
        flexDirection: 'row',
        flex: 1
    },
    con_khungnhom: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        flex: 1,
        paddingLeft: 6
    },
    con_khungten: {
        flexDirection: 'row',
        flex: 1
    },
    con_khungchung_row: {
        flexDirection: 'row',
    },
    con_khungchung_rowtext: {
        flexDirection: 'row',
        marginRight: 10,
    },
    text_name: {
        fontWeight: 'bold',
    },
    text_tengroup: {
        fontWeight: 'bold',
        marginLeft: 6
    },
    text_tenNguoiDcTagNhieu: {
        fontWeight: 'bold',
    },
    text_tenNguoiDcTagIt: {
        fontWeight: 'bold',
        width: Width(20),
    },
    img_tamgiac: {
        alignItems: 'center',
        marginTop: 4,
        marginLeft: 6
    },
});
export default Utils.connectRedux(XemBaiDangTrongNhom, mapStateToProps, true)

class RenderTouch extends Component {
    render() {
        const { item, itemState, onPress } = this.props
        return (
            <TouchableOpacity
                onPress={onPress}
                style={{
                    justifyContent: 'center', alignItems: 'center',
                    backgroundColor: itemState?.ID_menu == item?.ID_menu ? '#219B3C' : '#F2F3F5',
                    borderWidth: 0.3, borderRadius: 50, borderColor: '#F2F3F5',
                    paddingHorizontal: 15,
                    paddingVertical: 10,
                    marginRight: 15,

                }} >
                <Text style={{ color: itemState?.ID_menu == item?.ID_menu ? colors.white : colors.black, textAlign: 'center', }}>
                    {item?.title}</Text>
            </TouchableOpacity>
        )
    }
}