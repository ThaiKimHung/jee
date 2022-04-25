import LottieView from 'lottie-react-native';
import moment from 'moment';
import React, { Component, createRef } from 'react';
import {
    Animated, BackHandler, FlatList, Image, Keyboard,
    KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput,
    TouchableHighlight, TouchableOpacity,
    TouchableWithoutFeedback, View
} from "react-native";
import ActionSheet from "react-native-actions-sheet";
import Dash from 'react-native-dash';
import DocumentPicker from 'react-native-document-picker';
import { Card } from 'react-native-paper';
import { addComment, LoadDanhSachComment, postReactionComment, PushNotifi, PushNotifiTagNameComment, GetListAccountManagemen } from '../../../apis/JeePlatform/Api_JeeSocial/apiCommnet';
import {
    addGhimBaiDang, AddTinNoiBat, BaiDangLike, BaiDang_LuuTru, deleteBaiDang, getChiTietBaiDang, On_OffThongBao, getTinNoiBat,
    HuyTinNoiBat
} from '../../../apis/JeePlatform/Api_JeeSocial/apiJeeSocial';
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import { RootLang } from '../../../app/data/locales';
import { nkey } from '../../../app/keys/keyStore';
import Utils from '../../../app/Utils';
import UtilsApp from '../../../app/UtilsApp';
import HeaderComStackV2 from '../../../components/HeaderComStackV2';
import IsLoading from '../../../components/IsLoading';
import EmojiBoard from '../../../components/NewComponents/Emoji/EmojisBoard';
import FbImages from '../../../components/NewComponents/FBGridImage';
import FBGridImageComment from '../../../components/NewComponents/FBGridImageComment';
import HeaderModal from '../../../Component_old/HeaderModal';
import { Images } from '../../../images';
import { ImgComp } from '../../../images/ImagesComponent';
import { colors } from '../../../styles';
import { reText, sizes } from '../../../styles/size';
import { Height, nstyles, nwidth, paddingBotX, Width } from '../../../styles/styles';
import RNUrlPreview from '../../Component/Common/RNUrlPreview';
import Modal_BinhLuan from '../ModalSocial/Modal_BinhLuan';
import TextHyper from '../ModalSocial/TextHyper';
import ImageCus from '../../../components/NewComponents/ImageCus';
import Loading from '../ComponentSocail/Loading'
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import FuncSocail from '../Functionn/FuncSocial'
import Video from '../ComponentSocail/Video'

var RNFS = require('react-native-fs');

const actionSheetRef = createRef();
const actionSheetRef_social = createRef();
const actionSheetRef_Pick = createRef();
let start = 0

class ChiTietSocialNoti extends Component {
    constructor(props) {
        super(props);
        this.id_baiDang = Utils.ngetParam(this, "idbaidang", '')
        this.tinnoibat = Utils.ngetParam(this, "tinnoibat", false)
        this.refLoading = React.createRef()
        this.state = ({
            item: [],
            animationReact: null,
            showReact: null,
            showReactCmt: null,
            item_idbaidang: '',
            itemCmt: [],
            showChonLoc:
                { key: '3', type: 'Bình luận cũ nhất', mieuta: "Hiển thị bình luận từ cũ nhất đến mới nhất", api: 'asc', check: false },
            msgtext: '',
            listComment: [],
            avatar: '',
            id_User: '',
            showload: false,
            refreshing: false,
            autofocus: false,
            topicid: '',
            images: [],
            dsFile: [],
            noidung: '',
            opacity: new Animated.Value(0),
            flagEmoji: false,
            numLine: '',
            animationEmoji: new Animated.Value(0),
            addCmt: false,
            username: '',
            nameDn: '',
            CheckSendCommet: false,//này khi send comment sẽ croll xuống cuối
            dsVideo: [],
            customerID: '',
            checkModalTag: false,
            ListMember: [],
            Tag: [],
            loading: false,
            filteredData: [],
            chuoi: '',
            indexSplice: 0,
        })
        this.types = [
            { key: '1', type: 'Like' },
            { key: '2', type: 'Love' },
            { key: '3', type: 'Haha' },
            { key: '4', type: 'Wow' },
            { key: '5', type: 'Sad' },
            { key: '6', type: 'Care' },
            { key: '7', type: 'Angry' }
        ];
        this.animatedValue = new Animated.Value(1);
        this.animatedMargin = new Animated.Value(0);

    }
    componentDidMount = async () => {
        // this.refLoading.current.show()
        BackHandler.addEventListener("hardwareBackPress", this._goback);
        await this.setState({
            id_User: await Utils.ngetStorage(nkey.UserId, ''),
            avatar: await Utils.ngetStorage(nkey.avatar, ''),
            fullname: await Utils.ngetStorage(nkey.nameuser, ''),
            nameDn: await Utils.ngetStorage(nkey.Username, ''),
            customerID: await Utils.ngetStorage(nkey.customerID, ''),
        })
        if (this.tinnoibat) {
            await this._getTinNoiBat()
        }
        else {
            this._loadDanhSach_ChiTietBD().then(res => {
                this._getListAccountManagemen().then(resAcc => {
                    if (res == true && resAcc == true) {
                        this.setState({
                            loading: true
                        })
                    }
                })
            })
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
        Utils.goscreen(this, 'sw_HomePage')
        return true
    }

    _getTinNoiBat = async () => {
        const res = await getTinNoiBat()
        // console.log('res tin nỗi bật', res)
        if (res.status == 1) {
            this.setState({
                item: res.data[0],
                topicid: res.data[0]?.objectid,
                noidung: res.data[0]?.NoiDung,
                username: res.data[0]?.User_DangBai[0]?.Username,
                loading: true
            })
        }
        else {
            this.setState({ item: [], loading: false })
        }
        return true
    }

    _loadDanhSach_ChiTietBD = async () => {
        let res = await getChiTietBaiDang(this.id_baiDang);
        // Utils.nlog("list chi tiết bài đăng-------------------------", res)
        if (res.status == 1) {
            this.setState({
                item: res.data[0],
                topicid: res.data[0]?.objectid,
                noidung: res.data[0]?.NoiDung,
                username: res.data[0]?.User_DangBai[0]?.Username,
            })
        } else {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
        }
        return true
    }

    _getListAccountManagemen = async () => {
        let res = await GetListAccountManagemen()
        // console.log('res getListAccountManagemen', res)
        if (res.status == 1) {
            this.setState({
                ListMember: res.data,
            })
        }
        return true
    }

    renderImageBG = (item) => {
        switch (item) {
            case 'bg1': return Images.ImageJee.icBG1;
            case 'bg2': return Images.ImageJee.icBG2;
            case 'bg3': return Images.ImageJee.icBG3;
            case 'bg4': return Images.ImageJee.icBG4;
        }
    }

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

    _icon_Emoji_Comment = (id) => {
        switch (id) {
            case 'Like': return Images.ImageJee.ic_DaLike;
            case 'Love': return Images.ImageJee.icLove;
            case 'Haha': return Images.ImageJee.icHaHa;
            case 'Wow': return Images.ImageJee.icWow;
            case 'Sad': return Images.ImageJee.icSad;
            case 'Care': return Images.ImageJee.icThuong;
            case 'Angry': return Images.ImageJee.icAngry;
            // default: return Images.ImageJee.icLike;
        }

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
                    width: Width(10),
                    marginBottom: 4
                }
            case 'Care':
                return {
                    width: Width(10),
                    marginBottom: 4
                }
            case 'Angry':
                return {
                    width: Width(10),
                    marginBottom: 4
                }
        }
    };

    getReactionJsonStyleCmt = type => {
        switch (type) {
            case 'Like':
                return {
                    width: Width(15),
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
                    width: Width(10),
                    marginBottom: 4
                }
            case 'Care':
                return {
                    width: Width(10),
                    marginBottom: 4
                }
            case 'Angry':
                return {
                    width: Width(10),
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

    _like = async (idbaidang, type = 1) => {
        this.setState({ showReact: null })
        let res = await BaiDangLike(idbaidang, type);
        // Utils.nlog('ress like', res)
        if (res.status == 1) {
            let temp = res ? res.data[0] : []

            if (temp.Id_BaiDang == this.state.item.Id_BaiDang) {
                this.state.item = { ...this.state.item, Like: temp.Like, Like_BaiDang: temp.Like_BaiDang }
            }

            this.setState({ item: this.state.item })
        }
        else {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
        }
    }

    _luuTru = async (idbaidang) => {
        this.refLoading.current.show()
        let res = await BaiDang_LuuTru(idbaidang);
        // Utils.nlog('ress luu trữ', res)
        if (res.status == 1) {
            if (res.data.length > 0) {
                this.refLoading.current.hide()
                let temp = res.data[0]
                if (temp.Id_baidang == this.state.item.Id_BaiDang) {
                    this.state.item = { ...this.state.item, Save_: res.data }
                }
                this.setState({ item: this.state.item })
                UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.JeeSocial.luutruthanhcong, 1)
            }
            else {
                this.refLoading.current.hide()
                if (idbaidang == this.state.item.Id_BaiDang) {
                    this.state.item = { ...this.state.item, Save_: res.data }
                }
                this.setState({ item: this.state.item })
                UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.JeeSocial.daxoabailuutru, 1)
            }
        }
        else {
            this.refLoading.current.hide()
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
        }
    }

    _paresAnh = async (list) => {
        let anhParse = []
        for (let index = 0; index < list.length; index++) {
            let item = list[index];
            // Utils.nlog('item', item)
            let downSize = 1;

            if (item?.height >= 2000 || item?.width >= 2000) {
                downSize = 0.3;
            }
            let str64 = await Utils.parseBase64_PAHT(item.uri, item.height, item.width, downSize, item.timePlay != 0)
            anhParse = [...anhParse, str64]
        }
        return anhParse
    }

    _addComment = async () => {
        this.refLoading.current.show()
        let anh = []
        anh = await this._paresAnh(this.state.images)
        let video = []
        video = await this._paresAnh(this.state.dsVideo)
        let file = []
        let filename = []
        await this.state.dsFile.map((item) => {
            file = [...file, item.strBase64],
                filename = [...filename, item.filename]
        })
        let tag = []
        await this.state.Tag.map(i => {
            tag.push({ "Display": i.FullName, "Username": i.Username })
        })
        let strbody = {
            "TopicCommentID": this.state.topicid,
            "CommentID": "",
            "ReplyCommentID": "",
            "Text": this.state.msgtext,
            "Tag": tag,
            "Attachs": {
                "Images": anh,
                "Files": file,
                "Videos": video,
                "FileNames": filename,
            }
        }
        // Utils.nlog('body', strbody)
        let res = await addComment(strbody)
        // Utils.nlog('res add comment =--=-=-==-=-=-=-', res)
        if (res.status == 1) {
            if (tag.length > 0) {
                this._pushNotifiTagNameComment()
            }
            this.setState({
                CheckSendCommet: true,
                msgtext: '',
                images: [],
                dsFile: [],
                dsVideo: [],
                Tag: []
            })
            Keyboard.dismiss()
            this._pushNoti()
            this.refLoading.current.hide()
        }
        else if (res.status == -1) {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res?.title ? res?.title : RootLang.lang.thongbaochung.loilaydulieu, 2)
            nthisLoading.hide()
        }
        else {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
        }
    }

    _pushNoti = async () => {
        let strbody = {
            "fullname": this.state.fullname,
            "id_BaiDang": this.id_baiDang,
            "content": this.state.fullname + " đã bình luận bài viết của bạn",
            "img": this.state.avatar,
            "username": this.state.username,
            "usernameCurent": this.state.username,
            "customerId": this.state.customerID,
            "tagComment": []
        }
        // Utils.nlog('body', strbody)
        if (this.state.nameDn != this.state.username) {
            let res = await PushNotifi(strbody)
            // Utils.nlog('res puhsnoti', res)
            if (res.status == 1) { }
        }
    }

    _pushNotifiTagNameComment = async () => {
        let tag = []
        await this.state.Tag.map(i => {
            tag.push({ "Display": i.FullName, "Username": i.Username })
        })
        let strbody = {
            "Content": this.state.fullname + " đã nhắc đến bạn trong một bài viết",
            "Fullname": this.state.fullname,
            "Id_BaiDang": this.id_baiDang,
            "Img": "",
            "TagComment": tag,
            "username": this.state.username,
            "usernameCurent": this.state.nameDn,
        }
        // Utils.nlog('body', strbody)
        let res = await PushNotifiTagNameComment(strbody)
        // Utils.nlog('res PushNotifiTagNameComment', res)
        //     if (res.status == 1) { }
    }

    response = async (data, type) => {
        switch (type) {
            case 1:
                {
                    let datanew = data.map(item => {
                        return { ...item, type: 1 }
                    })
                    await this.setState({
                        images: [...this.state.images, ...datanew]
                    })
                }
                break;
            case 2:
                {
                    let datanew = []
                    data.map(item => {
                        if (item.size >= 50000) {
                            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, 'Dung lượng video gửi lên quá lớn!!', 2)
                            return
                        }
                        else {
                            datanew.push({ ...item, type: 2 })
                        }
                    })
                    this.setState({
                        dsVideo: [...this.state.dsVideo, ...datanew]
                    })
                }
                break;
            case 3:
                {
                    this.setState({
                        dsFile: [...this.state.dsFile, ...data],
                    })
                }
                break;
            default:
                break;
        }
    }


    onPressItem = (item, index) => {
        switch (item.type) {
            case 1:
                Utils.goscreen(this, 'Modal_ViewImageListShow_PAHT', { ListImages: this.state.images, index: index });
                break;
            case 2:
                Utils.goscreen(this, 'Modal_PlayMedia', { source: encodeURI(item.uri) })
                break;
            case 3:
                Utils.openUrl(item.uri)
                break;
            default:
                break;
        }
    }

    removeFileNew = (index, type) => {
        switch (type) {
            case 1:
                {
                    if (this.state.images.length > 1) {
                        let dataFileNew = this.state.images.map(item => {
                            return item
                        })
                        dataFileNew.splice(index, 1);
                        this.setState({
                            images: dataFileNew
                        })
                    } else {
                        this.setState({
                            images: []
                        })
                    }
                }
                break;
            case 2:
                {
                    if (this.state.dsVideo.length > 1) {
                        let dataFileNew = this.state.dsVideo.map(item => {
                            return item
                        })
                        dataFileNew.splice(index, 1);
                        this.setState({
                            dsVideo: dataFileNew
                        })
                    } else {
                        this.setState({
                            dsVideo: []
                        })
                    }
                }
                break;
            case 3:
                {
                    if (this.state.dsFile.length > 1) {
                        let dataFileNew = this.state.dsFile.map(item => {
                            return item
                        })
                        dataFileNew.splice(index, 1);
                        this.setState({
                            dsFile: dataFileNew
                        })
                    } else {
                        this.setState({
                            dsFile: []
                        })
                    }
                }
                break;
            default:
                break;
        }

    }

    _open_ImageGallery = async () => {
        actionSheetRef_Pick.current?.hide()
        let options = {
            assetType: 'Photos',//All,Videos,Photos - default
            multi: true,// chọn 1 or nhiều item
            response: (data) => this.response(data, 1), // callback giá trị trả về khi có chọn item
            limitCheck: -1, //gioi han sl media chon: -1 la khong co gioi han, >-1 la gioi han sl =  limitCheck
            groupTypes: 'All',
        };
        Utils.goscreen(this, 'Modal_MediaPicker', options);
    }

    _open_VideoGallery = () => {
        actionSheetRef_Pick.current?.hide()
        let options = {
            assetType: 'Videos',//All,Videos,Photos - default
            multi: true,// chọn 1 or nhiều item
            response: (data) => this.response(data, 2), // callback giá trị trả về khi có chọn item
            limitCheck: -1, //gioi han sl media chon: -1 la khong co gioi han, >-1 la gioi han sl =  limitCheck
            groupTypes: 'All',
        };
        Utils.goscreen(this, 'Modal_MediaPicker', options);
        // UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, 'Chức năng đang phát triển', 3)

    }

    pickFiles = async () => {
        try {
            const results = await DocumentPicker.pickMultiple({
                type: [DocumentPicker.types.allFiles],
            });
            // Utils.nlog("=-results", results)
            var mang = await Promise.all(results.map(async (i) => {
                const split = i.fileCopyUri.split('/');
                const name = split.pop();
                const inbox = split.pop();
                const realPath = Platform.OS == 'android' ? i.uri : `file://${RNFS.TemporaryDirectoryPath}/${inbox}/${decodeURI(name)}`;
                const strBase64 = await RNFS.readFile(realPath, "base64")
                return {
                    filename: i.name,
                    strBase64: strBase64,
                    type: 3,
                    uri: i.uri,
                    typeFile: i.type
                }
            }))
            // Utils.nlog('-=-=-=-=-=-=', mang)
            this.response(mang, 3)
        } catch (err) {
            // Utils.nlog('err', err)
            if (DocumentPicker.isCancel(err)) {
            } else {
                throw err;
            }
        }
        await actionSheetRef_Pick.current?.hide()
    }

    _openEdit = () => {
        actionSheetRef.current?.hide()
        Utils.goscreen(this, 'Modal_EditBinh_Luan', { nthis: this, item: this.state.itemCmt, idtoppic: this.state.topicid })
    }

    onPlayVideo = (suri) => {
        Utils.goscreen(this, 'Modal_PlayMedia', { source: suri });
    }

    _renderVideos = (item, index) => {
        return (
            <TouchableOpacity
                //  onPress={() => this.onPressItem(item, index)}
                key={index} style={{
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
                }
                }>
                <View style={{ padding: 0, width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    <Image
                        style={{
                            width: Width(21),
                            height: Width(21),
                        }}
                        resizeMode='cover'
                        source={{ uri: item.uri }}
                    />
                    <TouchableOpacity style={{
                        position: 'absolute', top: 0, right: 0, left: 0, bottom: 0, justifyContent: 'center',
                        alignItems: 'center'
                    }} activeOpacity={0.9}
                        onPress={() => this.onPlayVideo(encodeURI(item.uri))}>
                        <Image
                            style={{ width: 35, height: 35 }}
                            resizeMode='contain'
                            source={ImgComp.mediaPlayButton}
                        />
                    </TouchableOpacity>
                </View>
                <TouchableHighlight
                    onPress={() => { this.removeFileNew(index, 2) }}
                    underlayColor={colors.backgroundModal}
                    style={{
                        padding: 4, position: 'absolute', top: 0, right: 0, backgroundColor: colors.redDelete, borderRadius: 20
                    }}>
                    <Image resizeMode='contain'
                        source={ImgComp.icCloseWhite}
                        style={{
                            width: 15,
                            height: 15, tintColor: 'white',
                        }}></Image>
                </TouchableHighlight>
            </TouchableOpacity >
        );
    }

    _renderImage = (item, index) => {
        return (
            <TouchableOpacity onPress={() => this.onPressItem(item, index)}
                key={index} style={{
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
                }
                }>
                <View style={{ padding: 0, width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    <Image resizeMode={'cover'}
                        source={{ uri: item.uri }}
                        style={{ width: '100%', height: '100%', borderRadius: 4 }}></Image>
                </View>
                <TouchableHighlight
                    onPress={() => { this.removeFileNew(index, 1) }}
                    underlayColor={colors.backgroundModal}
                    style={{
                        padding: 4, position: 'absolute', top: 0, right: 0, backgroundColor: colors.redDelete, borderRadius: 20
                    }}>
                    <Image resizeMode='contain'
                        source={ImgComp.icCloseWhite}
                        style={{
                            width: 15,
                            height: 15, tintColor: 'white',
                        }}></Image>
                </TouchableHighlight>
            </TouchableOpacity >
        );
    }

    callback = async () => {
        await this._loadDanhSach_ChiTietBD().then(res => {
            if (res == true) {
                this.refLoading.current.hide()
            }
        });
        Utils.goscreen(this, "sc_ChiTietSocail")
    }

    _editBaiDang = async () => {
        actionSheetRef_social.current?.hide();
        Utils.goscreen(this, 'Modal_EditBaiDang', { nthis: this, data: this.state.item, callback: this.callback })
        // Utils.goscreen(this.nthis, 'Modal_devoloping')
    }

    _ghimBaiDAng = async (type = false) => {
        this.refLoading.current.show()
        let res = await addGhimBaiDang(this.state.item.Id_BaiDang);
        // Utils.nlog('ress ghim', res)
        if (res.status == 1) {
            actionSheetRef_social.current?.hide()
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, type == true ? RootLang.lang.JeeSocial.huyghimthanhcong : RootLang.lang.JeeSocial.ghimthanhcong, 1)
            await this._onRefresh()
            this.refLoading.current.hide()
        }
        else {
            this.refLoading.current.hide()
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
        }
    }

    _tinNoiBat = async () => {
        actionSheetRef_social.current?.hide()
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
        actionSheetRef_social.current?.hide()
        this.refLoading.current.show()
        let res = await HuyTinNoiBat(this.state.item.Id_BaiDang);
        // Utils.nlog('ress _HuyTinNoiBat', res)
        if (res.status == 1) {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.JeeSocial.huygantinnoibat, 1)
            ROOTGlobal.GetTinNoiBat.GetTinnoiBat()
            ROOTGlobal.LoadDanhSachBaiDang_Nhom.LoadDSBaiDang_InNhom()
            ROOTGlobal.LoadDanhSachBaiDang_Nhom.LoadDSBaiDang_Nhom()
            ROOTGlobal.LoadDanhSachBaiDang.LoadDSBaiDang()
            this.refLoading.current.hide()
            this._goback()
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
            actionSheetRef_social.current?.hide()
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, this.state.item?.ThongBao?.isThongBao == false ? RootLang.lang.JeeSocial.batthongbao : RootLang.lang.JeeSocial.tatthongbao, 1)
            await this._onRefresh()
            this.refLoading.current.hide()
        }
        else {
            this.refLoading.current.hide()
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
        }
    }

    _xoaBaiDang = async () => {
        actionSheetRef_social.current?.hide();
        Utils.showMsgBoxYesNo(this, RootLang.lang.thongbaochung.thongbao, RootLang.lang.JeeSocial.banmuonxoabaidangnay, RootLang.lang.scchamcong.dongy, RootLang.lang.scchamcong.huy,
            async () => {
                this.refLoading.current.show()
                let res = await deleteBaiDang(this.state.item.Id_BaiDang);
                // Utils.nlog("delete bài đăng nhóm-------------------------", res)
                if (res.status == 1) {
                    // this.refLoading.current.hide()
                    // let someArray = this.state.listBaiDang;
                    // someArray = someArray.filter(data => data.Id_BaiDang != this.state.item.Id_BaiDang)
                    // this.setState({ listBaiDang: someArray, })
                    this._goback()
                    UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.JeeSocial.xoathanhcong, 1)
                }
                else {
                    this.refLoading.current.hide()
                    UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.JeeSocial.xoathatbai, 2)
                }
            }
        )
    }

    _onRefresh = () => {
        this._loadDanhSach_ChiTietBD(1);
        this.allPage = 1;
    }

    _renderImageFile = (item, index) => {
        return (
            <TouchableOpacity onPress={() => this.onPressItem(item, index)}
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
                        source={ImgComp.icChoseFile}
                        style={{ width: Width(10), height: Width(10), borderRadius: 4 }}></Image>
                    <View style={{ flex: 1, paddingHorizontal: 10, position: 'absolute', bottom: 5 }}>
                        <Text style={{ fontSize: reText(10), color: colors.black_80 }} numberOfLines={1}>
                            {item.filename}</Text>
                    </View>
                </View>
                <TouchableHighlight
                    onPress={() => { this.removeFileNew(index, 3) }}
                    underlayColor={colors.backgroundModal}
                    style={{
                        padding: 4, position: 'absolute', top: 0, right: 0, backgroundColor: colors.redDelete, borderRadius: 20
                    }}>
                    <Image resizeMode='contain'
                        source={ImgComp.icCloseWhite}
                        style={{
                            width: 15, height: 15, tintColor: 'white',
                        }}></Image>
                </TouchableHighlight>
            </TouchableOpacity >
        );
    }

    _ListMemberTag = ({ item, index }) => {
        return (
            item.Username != this.state.nameDn ?
                < TouchableOpacity onPress={() => this._handleTag(item)}
                    style={{ flexDirection: "row", paddingHorizontal: 10, marginTop: 5 }}>
                    {item.Username == 'All' ?
                        <View style={{ width: Width(9), height: Width(9), marginRight: 5 }}>
                            <Image source={Images.ImageJee.icMentions} style={{ width: Width(9), height: Width(9), tintColor: colors.greenTab }} />
                        </View>
                        :
                        <View style={{ width: Width(9), height: Width(9), marginRight: 5 }}>
                            <Image source={item.AvartarImgURL ? { uri: item.AvartarImgURL } : Images.icAva} style={{ width: Width(9), height: Width(9), borderRadius: 9999, }} />
                        </View>}
                    <View style={{ width: Width(85), justifyContent: "center" }}>
                        <Text numberOfLines={1} style={{ fontSize: reText(18), }}>{item.Username == 'All' ? 'Nhắc cả nhóm @All' : item.FullName}</Text>
                    </View>
                </TouchableOpacity > : null
        )
    }

    _handleTag = async (item) => {
        let { indexSplice } = this.state
        await Keyboard.dismiss
        let names = item.FullName.replace(/\s/g, '')
        let str = ''
        let lengthChuoi = this.state.chuoi.length
        let textDau = this.state.msgtext.substring(0, indexSplice - 1)
        let textCuoi = this.state.msgtext.substring(indexSplice + 1, this.state.msgtext.length)
        str = (textDau ? textDau + ' @' : textDau + '@') + names + textCuoi.substring(lengthChuoi, textCuoi.length)
        this.state.Tag.push(item)
        this.setState({ checkModalTag: false, msgtext: str + " ", Tag: this.state.Tag, chuoi: '' }, () => {
            // this.formatText(this.state.msgtext)
        })
    }

    changeText = (text) => {
        //changText => có @ => _handleTag => + tag vô chuỗi => formatText => format lại hiện lên
        let checkAndroid = true
        let dem = 0
        let check = false //Kiểm tra đúng vị trí @, do 1 câu nhiều @
        if (this.state.indexSplice == 0) {
            check = true
        }
        if (text == '') {
            this.setState({ checkModalTag: false, })
        }
        else {
            const retLines = text.split("\n");
            retLines.forEach((retLine) => {
                const words = retLine.split(" ");
                var format = /[ !#@$%^&*()_+\-=\[\]{};':"\\|,.<>\/?\n]/;
                words.forEach((word, index) => {
                    dem = dem + word.length + 1
                    if (word.startsWith("@") && !format.test(word.substr(1)) && (Platform.OS == 'ios' ? check : checkAndroid)) {
                        this.setState({ msgtext: text, chuoi: word.substr(1) })
                        let searchText = word.substr(1)
                        let filteredData = this.state.ListMember.filter((item) =>
                            Utils.removeAccents(item['FullName'])
                                .toUpperCase()
                                .includes(Utils.removeAccents(searchText.toUpperCase())),
                        );
                        this.setState({ filteredData: filteredData, });
                    } else {
                        this.setState({ msgtext: text, })
                    }
                    if (dem == this.state.indexSplice) { //Xét vị trí @ đúng cụm
                        check = true
                    } else {
                        check = false
                    }
                });
            });
        }
    }

    selectionChangeHandler = (e) => {
        start = e.nativeEvent.selection.start
    };

    handleKeyPress = ({ nativeEvent: { key: keyValue } }) => {
        if (keyValue === '@') {
            this.setState({ checkModalTag: true, indexSplice: start })
        }
        if (keyValue == ' ') {
            this.setState({ checkModalTag: false })
        }
        if (keyValue == 'Backspace' && this.state.msgtext.length == 1) {
            this.setState({ checkModalTag: false })
        }
        if (keyValue == 'Backspace' && this.kitutruoc == '@') {
            this.setState({ checkModalTag: false })
        }
        if (this.state.chuoi.length == 0 && keyValue == 'Backspace') {
            this.setState({ checkModalTag: false })
        }
        this.kitutruoc = keyValue
    }


    _goModalShowUserTag = (item) => {
        Utils.goscreen(this, 'Modal_ShowUserTag', { data: item })
    }

    _HandleFocusInput = async () => {
        this.setState({
            flagEmoji: false,
        }, () => { this.toggleAnimationEmoji() })
    };

    _HandleEmojiBoard = () => {
        const { flagEmoji } = this.state;
        this.setState({
            flagEmoji: !flagEmoji,
        }, () => { this.toggleAnimationEmoji() });
        Keyboard.dismiss();
    };

    _OnClick = (emoji) => {
        const { msgtext } = this.state;
        this.setState({
            msgtext: msgtext + emoji.code,
        });
        Keyboard.dismiss();
    };

    _hideEmoji = () => {
        if (this.state.flagEmoji) {
            this.setState({ flagEmoji: false })
            Animated.spring(this.state.animationEmoji, {
                toValue: 0,
                duration: 1000
            }).start();
        }
    }

    toggleAnimationEmoji = async () => {
        if (this.state.flagEmoji == true) {
            Animated.spring(this.state.animationEmoji, {
                toValue: Platform.OS == 'ios' ? Width(100) / 1.7 + 20 : Width(100) / 1.3,
                duration: 500
            }).start(Keyboard.dismiss());
        }
        else {
            Animated.spring(this.state.animationEmoji, {
                toValue: 0,
                duration: 500
            }).start();
        }
    }

    onPlayVideo = (suri) => {
        Utils.goscreen(this, 'Modal_PlayMedia', { source: suri });
    }

    render() {
        const { item, msgtext, numLine, listComment, showload, refreshing, id_User, itemCmt, noidung, animationEmoji, addCmt, ListMember, loading } = this.state
        let fileanh = item.Attachment?.length > 0 ? item.Attachment?.map((i) => {
            return i.hinhanh
        }) : []
        fileanh = fileanh.filter((el) => {
            return el != ''
        })
        const animatedStyle = { marginBottom: animationEmoji }
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: colors.white, }]}>
                <HeaderComStackV2
                    nthis={this}
                    title={this.tinnoibat ? "Tin nổi bật" : RootLang.lang.JeeSocial.chitietbaidang}
                    // iconRight={Images.ImageJee.icIConThemNguoiVaoNhom}
                    styIconRight={[, {}]}
                    iconLeft={Images.ImageJee.icBack}
                    onPressLeft={this._goback}
                    // onPressRight={() => { }}
                    styBorder={{
                        borderBottomColor: colors.black_20_2,
                        borderBottomWidth: 0.3
                    }}
                />
                <View style={{ flex: 1 }}>
                    {
                        loading == false ?
                            <View style={{ flex: 1 }}>
                                <Loading soLuongRender={[0]} stylesLoading={{}}  ></Loading>
                                <View style={{ flex: 1, justifyContent: 'flex-end', paddingHorizontal: 10, marginBottom: 5, }}>
                                    <View style={{ backgroundColor: colors.white, height: Width(15), flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderTopWidth: 0.3, borderColor: colors.black_20, }}>
                                        <SkeletonPlaceholder>
                                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                                                <View style={{ width: Width(6), height: Width(6), borderRadius: 20, marginRight: 10, marginBottom: 5 }} />
                                                <View style={[nstyles.nAva32, { marginRight: 5, marginBottom: 5 }]} />
                                                <View style={{ width: Width(55), height: Width(9), borderRadius: 20, marginRight: 5, marginBottom: 10 }} />
                                                <View style={{ width: Width(6), height: Width(6), borderRadius: 20, marginLeft: 5, marginBottom: 8 }} />
                                            </View>
                                        </SkeletonPlaceholder>
                                        <View style={{ marginLeft: 10 }}  >
                                            <Image source={Images.ImageJee.icSendChat}
                                                resizeMode='contain' style={{ width: Width(7), height: Width(7), tintColor: colors.black_10, marginRight: 5, marginBottom: Platform.OS == 'ios' ? 0 : 5 }} />
                                        </View>
                                    </View>
                                </View>
                            </View>
                            :
                            <>
                                <KeyboardAvoidingView
                                    keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
                                    behavior={(Platform.OS === 'ios') ? "padding" : null}
                                    style={{ flex: 1 }} >
                                    <ScrollView nestedScrollEnabled style={{ flex: 1, }}
                                        ref={ref => { this.scrollView = ref }}
                                        onContentSizeChange={() => {
                                            this.state.CheckSendCommet ? this.scrollView.scrollToEnd({ animated: true }) : null
                                        }} >
                                        <TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => this.setState({ showReact: null, showReact_cmtCha: null })}>
                                            <View style={styles.container}>
                                                <View style={styles.con_khunglon}>
                                                    <View style={styles.con_khungava}>
                                                        <ImageCus
                                                            style={[nstyles.nAva32]}
                                                            source={{ uri: item?.User_DangBai ? item?.User_DangBai[0]?.avatar : "" }}
                                                            resizeMode={"cover"}
                                                            defaultSourceCus={Images.icAva}
                                                        />
                                                        <View style={styles.con_khungnhom}>
                                                            <View style={{ flex: 1 }}>
                                                                <View style={styles.con_khungten}>
                                                                    <Text style={styles.text_name}>{item?.User_DangBai ? item?.User_DangBai[0].Fullname : null}</Text>
                                                                    {
                                                                        item.Group?.length > 0 ? (
                                                                            <View style={styles.con_khungchung_row}>
                                                                                <Image source={Images.ImageJee.icMetroplay} resizeMode='contain' style={nstyles.nIcon8, styles.img_tamgiac} />
                                                                                <View style={{ flex: 1 }}>
                                                                                    <Text numberOfLines={1} style={styles.text_tengroup} >{item?.Group ? item?.Group[0].ten_group : null}</Text>
                                                                                </View>
                                                                            </View>
                                                                        ) : (
                                                                                <View style={{ flex: 1, }}>
                                                                                    {
                                                                                        item.TagName?.length > 0 ? (
                                                                                            <TouchableOpacity onPress={() => { this._goModalShowUserTag(item.TagName) }} style={styles.con_khungchung_rowtext}>
                                                                                                <Text> {RootLang.lang.JeeSocial.voi}</Text>
                                                                                                <View style={{ flex: 1 }}>
                                                                                                    <Text numberOfLines={1} style={styles.text_tenNguoiDcTagNhieu}>{item.TagName?.length}{' ' + RootLang.lang.JeeSocial.nguoikhac}</Text>
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
                                                                            {item.CreatedDate ? UtilsApp.convertDatetime(item.CreatedDate) : "--"}
                                                                        </Text>
                                                                        {
                                                                            item.Ghim ? (
                                                                                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                                                                    <Image source={Images.ImageJee.icGhim} resizeMode='contain' style={[nstyles.nIcon12, { marginLeft: 5 }]} />
                                                                                </View>

                                                                            ) : (null)
                                                                        }
                                                                        {
                                                                            item?.ThongBao?.isThongBao == true ? (
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
                                                                        onPress={() => { actionSheetRef_social.current?.show(), this.setState({ item: item }) }} >
                                                                        <Image source={Images.ImageJee.icBaCham} resizeMode='contain' style={[nstyles.nIconH4W18, {}]} />
                                                                    </TouchableOpacity>
                                                                ) : (null)
                                                            }
                                                        </View>
                                                    </View>
                                                    <View style={{ paddingVertical: 5, }}>
                                                        <TextHyper item={item} onPress={() => this._showMore(item)} chitiet={true} ></TextHyper>
                                                    </View>
                                                    <View>
                                                        {
                                                            item.Attachment_File?.length > 0 ? (
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
                                                        {item.Attachment?.length > 0 ? (
                                                            <FbImages
                                                                nthis={this}
                                                                images={fileanh}
                                                                imageOnPress={() => { }}
                                                            />
                                                        ) : (null)}
                                                        {
                                                            item.Videos?.length > 0 ? (
                                                                <View style={{
                                                                    flexWrap: 'wrap',
                                                                    width: '100%',
                                                                    flexDirection: 'row',
                                                                    paddingBottom: 5
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
                                                            item.Group?.length > 0 && item.TagName?.length > 0 && item.TagName?.length >= 3 ? (
                                                                <View style={styles.con_khungchung_rowtext}>
                                                                    <Text> {RootLang.lang.JeeSocial.voi}</Text>
                                                                    <View style={{ flex: 1 }}>
                                                                        <Text numberOfLines={1} style={styles.text_tenNguoiDcTagNhieu}>{item?.TagName.length}{' ' + RootLang.lang.JeeSocial.nguoikhac}</Text>
                                                                    </View>
                                                                </View>
                                                            ) : (
                                                                    null
                                                                )
                                                        }
                                                    </View>
                                                </View>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1, marginBottom: 7 }}>
                                                    <TouchableOpacity
                                                        onPress={() => { Utils.goscreen(this, "Modal_ShowEmoji", { idbaidang: item.Id_BaiDang }) }}
                                                        style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingLeft: 5 }}>
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
                                                            item?.lengthComment > 0 ? (
                                                                <Text style={{ color: colors.colorTextBTGray }}>{item.lengthComment + ' ' + RootLang.lang.JeeSocial.comment}</Text>
                                                            ) : null
                                                        }
                                                    </View>
                                                </View>
                                                <Dash
                                                    dashColor={colors.colorVeryLightPink}
                                                    style={{ width: '100%', height: 1, }}
                                                    dashGap={0}
                                                    dashThickness={1} />
                                                {this.state.showReact == 0 ?
                                                    <Card style={[styles.card, { marginTop: 5 }]}>
                                                        <FlatList
                                                            data={this.types}
                                                            horizontal
                                                            renderItem={this.renderItem}
                                                            keyExtractor={(item, index) => item.key}
                                                            bounces={false}
                                                            style={styles.list}
                                                        />
                                                    </Card>
                                                    : null}
                                                <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between', height: Height(4) }}>
                                                    {item.Like ? ( //có tốn tại like
                                                        <TouchableOpacity style={{ width: Width(32), justifyContent: "center", alignContent: "center" }}
                                                            onPress={() => this._like(item.Id_BaiDang, 0)}
                                                            onLongPress={() => { this.setState({ showReact: 0, item_idbaidang: item.Id_BaiDang, showReactCmt: null }) }} >
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
                                                                onLongPress={() => { this.setState({ showReact: 0, item_idbaidang: item.Id_BaiDang, showReactCmt: null }) }}  >
                                                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                                    <Image
                                                                        source={this._icon_Emoji(item.Like?.ID_like)}
                                                                        resizeMode='contain' style={[nstyles.nIcon14, {}]} />
                                                                    <Text style={{ marginLeft: 5, color: this._mauLike(item.Like?.ID_like) }}>{RootLang.lang.JeeSocial.like}</Text>
                                                                </View>
                                                            </TouchableOpacity>
                                                        )}

                                                    <TouchableOpacity
                                                        onPress={() => this.setState({ autofocus: true, showReact: null })}
                                                        style={{ width: Width(32), justifyContent: 'center', alignItems: 'center' }}>
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

                                                <Dash
                                                    dashColor={colors.colorVeryLightPink}
                                                    style={{ width: '100%', height: 1, }}
                                                    dashGap={0}
                                                    dashThickness={1} />

                                                <View style={{ flex: 1 }}>
                                                    {this.state.topicid != '' ? (
                                                        < Modal_BinhLuan topicId={this.state.topicid} nthis={this} social={true} tatTextInput={true} idnoti={this.id_baiDang}></ Modal_BinhLuan>
                                                    ) : (null)}
                                                </View>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </ScrollView>
                                    <View style={{ bottom: 0, paddingBottom: paddingBotX, paddingHorizontal: 10, borderTopWidth: 0.3, borderColor: colors.black_20, }}>
                                        <View style={{ paddingVertical: this.state.images?.length > 0 || this.state.dsFile?.length > 0 || this.state.dsVideo?.length > 0 ? 10 : 0, }}>
                                            {
                                                this.state.images?.length > 0 ?
                                                    <View style={{
                                                        flexWrap: 'wrap',
                                                        width: '100%',
                                                        flexDirection: 'row',
                                                    }}>
                                                        {
                                                            this.state.images.map((item, index) => this._renderImage(item, index))
                                                        }
                                                    </View>
                                                    : null
                                            }
                                            {
                                                this.state.dsVideo?.length > 0 ?
                                                    <View style={{
                                                        flexWrap: 'wrap',
                                                        width: '100%',
                                                        flexDirection: 'row',
                                                    }}>
                                                        {
                                                            this.state.dsVideo.map((item, index) => this._renderVideos(item, index))
                                                        }
                                                    </View>
                                                    : null
                                            }
                                            {
                                                this.state.dsFile?.length > 0 ? (
                                                    <View style={{
                                                        flexWrap: 'wrap',
                                                        width: '100%',
                                                        flexDirection: 'row',
                                                    }}>
                                                        {
                                                            this.state.dsFile.map((item, index) => this._renderImageFile(item, index))
                                                        }
                                                    </View>
                                                ) : (null)
                                            }
                                        </View>
                                        {this.state.checkModalTag ?
                                            <View style={{
                                                width: Width(100), maxHeight: Height(25), borderTopLeftRadius: 10, borderTopRightRadius: 10,
                                                backgroundColor: "#E1E6E1", marginLeft: -10
                                            }}>
                                                <FlatList
                                                    keyboardShouldPersistTaps="always"
                                                    style={{}}
                                                    contentContainerStyle={{ paddingTop: 5, paddingBottom: 2 }}
                                                    data={this.state.filteredData && this.state.filteredData.length > 0
                                                        ? this.state.filteredData : ListMember}
                                                    renderItem={this._ListMemberTag}
                                                    keyExtractor={(item, index) => index.toString()}
                                                />
                                            </View> : null}
                                        <View style={{ justifyContent: 'flex-end', bottom: 0, paddingHorizontal: 5, paddingBottom: 5 }}>
                                            <View style={[{ flexDirection: "row", justifyContent: 'space-between', }]}>
                                                <View style={{ flexDirection: "row", paddingTop: 5, flex: 1 }}>
                                                    <TouchableOpacity
                                                        onPress={() => { actionSheetRef_Pick.current?.show() }}
                                                        style={{ justifyContent: this.state.numLine == 17 ? 'center' : 'flex-end', }}>
                                                        <Image style={{ width: Width(6), height: Width(6), tintColor: colors.colorTabActive, marginBottom: Platform.OS == 'ios' ? 0 : 5 }} source={Images.ImageJee.icOptionChat} />
                                                    </TouchableOpacity>
                                                    <View style={{ justifyContent: this.state.numLine == 17 ? 'center' : 'flex-end', marginHorizontal: 5 }}>
                                                        <ImageCus
                                                            style={[nstyles.nAva32, {}]}
                                                            source={{ uri: this.state.avatar }}
                                                            resizeMode={"cover"}
                                                            defaultSourceCus={Images.icAva}
                                                        />
                                                    </View>
                                                    <View style={{ backgroundColor: "#f1f0f5", borderRadius: 15, paddingLeft: 5, flex: 1 }}>
                                                        <TextInput
                                                            // autoFocus={true}
                                                            ref={ref => this.inputRef = ref}
                                                            // onTouchStart={this._HandleFocusInput}
                                                            style={{
                                                                color: "black",
                                                                fontSize: 14,
                                                                maxHeight: Height(15),
                                                                paddingVertical: Platform.OS == 'ios' ? 10 : 5,
                                                                maxHeight: Height(15),
                                                                marginHorizontal: 5,
                                                                marginTop: Platform.OS == 'ios' ? 5 : 0
                                                            }}
                                                            //Code xử lý
                                                            onSelectionChange={this.selectionChangeHandler}
                                                            onKeyPress={this.handleKeyPress}
                                                            onChangeText={(text) => this.changeText(text)}
                                                            onContentSizeChange={e =>
                                                                this.setState({ numLine: e.nativeEvent.contentSize.height },
                                                                )
                                                            }
                                                            placeholder={RootLang.lang.JeeSocial.nhapnoidungbinhluan}
                                                            autoCorrect={false}
                                                            multiline={true}
                                                            underlineColorAndroid="rgba(0,0,0,0)"
                                                        >
                                                            {msgtext}
                                                        </TextInput>
                                                    </View>
                                                    <View style={{ flexDirection: "row", alignItems: this.state.numLine == 17 ? 'center' : 'flex-end' }}>
                                                        <TouchableOpacity onPress={() => { this._HandleEmojiBoard() }} style={{ width: Width(6), alignSelf: this.state.numLine == 17 ? 'center' : 'flex-end', marginHorizontal: 10, marginBottom: Platform.OS == 'ios' ? 0 : 5 }} >
                                                            <Image source={Images.ImageJee.icSmileChat}
                                                                resizeMode='contain' style={{ width: Width(6), height: Width(6), tintColor: colors.colorTabActive }} />
                                                        </TouchableOpacity >
                                                        {msgtext || this.state.images.length > 0 || this.state.dsFile.length > 0 || this.state.dsVideo.length > 0 ?
                                                            <TouchableOpacity style={{}}
                                                                onPress={() => this._addComment()}
                                                            >
                                                                <Image source={Images.ImageJee.icSendChat}
                                                                    resizeMode='contain' style={{ width: Width(7), height: Width(7), tintColor: colors.colorTabActive, marginRight: 5, marginBottom: Platform.OS == 'ios' ? 0 : 5 }} />
                                                            </TouchableOpacity>
                                                            :
                                                            <View style={{}}  >
                                                                <Image source={Images.ImageJee.icSendChat}
                                                                    resizeMode='contain' style={{ width: Width(7), height: Width(7), tintColor: colors.black_10, marginRight: 5, marginBottom: Platform.OS == 'ios' ? 0 : 5 }} />
                                                            </View>}
                                                    </View>
                                                </View>
                                            </View >
                                        </View >
                                    </View>
                                    <Animated.View style={animatedStyle} />
                                    {
                                        this.state.flagEmoji == true ?
                                            <View onStartShouldSetResponder={() => true}>
                                                <EmojiBoard
                                                    onRemove={this._BackSpace}
                                                    showBoard={this.state.flagEmoji}
                                                    onClick={this._OnClick}
                                                />
                                            </View>
                                            : null
                                    }
                                </KeyboardAvoidingView>
                                <IsLoading ref={this.refLoading} />
                            </>
                    }


                </View>


                <ActionSheet ref={actionSheetRef}>
                    <View style={{ maxHeight: Height(50), paddingBottom: paddingBotX, }}>
                        <HeaderModal />
                        {
                            itemCmt?.PersonalInfo?.UserId == id_User ? (
                                <View>
                                    <TouchableOpacity
                                        onPress={() => this._openEdit()}
                                        style={{ height: Height(5), borderBottomWidth: 0.3, borderColor: '#E4E6EB', width: Width(100), justifyContent: 'center', alignItems: 'center', padding: 10, marginTop: 2 }}>
                                        <Text style={{ fontSize: reText(15), }}>{RootLang.lang.JeeSocial.suabinhluan}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => this._xoaComment()}
                                        style={{ height: Height(6), width: Width(100), justifyContent: 'center', alignItems: 'center', padding: 10, marginTop: 1, borderBottomWidth: 0.3, borderColor: '#E4E6EB' }}>
                                        <Text style={{ fontSize: reText(15), }}>{RootLang.lang.JeeSocial.xoabinhluan}</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                    null
                                )}
                    </View>
                </ActionSheet>
                <ActionSheet ref={actionSheetRef_social}>
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
                                        onPress={() => this._xoaBaiDang()}
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
                                        item?.ThongBao?.isThongBao == true ?
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
                <ActionSheet ref={actionSheetRef_Pick}>
                    <View style={[styles.actiocnSheet, {}]}>
                        <HeaderModal />
                        <View>
                            <TouchableOpacity
                                onPress={() => this._open_ImageGallery()}
                                style={[styles.actionSheet_con, {}]}>
                                <Text style={{ fontSize: sizes.sText15, }}>{RootLang.lang.JeeChat.anh}</Text>
                                <Text style={{ fontSize: sizes.sText12, }}>{RootLang.lang.JeeChat.chiaseanh}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => this._open_VideoGallery()}
                                style={[styles.actionSheet_con, {}]}>
                                <Text style={{ fontSize: sizes.sText15, }}>{RootLang.lang.JeeChat.video}</Text>
                                <Text style={{ fontSize: sizes.sText12, }}>{RootLang.lang.JeeChat.chiasevideo}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => this.pickFiles()}
                                style={[styles.actionSheet_con, {}]}>
                                <Text style={{ fontSize: sizes.sText15, }}>{RootLang.lang.JeeChat.tep}</Text>
                                <Text style={{ fontSize: sizes.sText12, }}>{RootLang.lang.JeeChat.chiasetep}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ActionSheet>
            </View >
        )
    }
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        width: 200,
        marginBottom: 10,
        paddingTop: 15,
        paddingBottom: 15,
        textAlign: 'center',
        color: '#fff',
        backgroundColor: '#38f'
    },
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
    reactViewCmt: {
        width: (Width(100) - 50) / 7,
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
        // paddingHorizontal: 5,
        flex: 1
    },
    con_khunglon: {
        marginTop: 10,
        flex: 1,
        paddingHorizontal: 5
    },
    con_khungava: {
        flexDirection: 'row',

    },
    con_khungnhom: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        flex: 1,
        paddingLeft: 6
    },
    con_khungten: {
        flexDirection: 'row',

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
    actiocnSheet: {
        paddingBottom: paddingBotX,
    },
    actionSheet_con: {
        // height: Height(5),
        borderBottomWidth: 0.3,
        borderColor: '#E4E6EB',
        // width: Width(100),
        justifyContent: 'center',
        padding: 10,
        // marginTop: 2
    },
});


const mapStateToProps = state => ({
    lang: state.changeLanguage.language,
    reducerBangCong: state.reducerBangCong
});
export default Utils.connectRedux(ChiTietSocialNoti, mapStateToProps, true)
