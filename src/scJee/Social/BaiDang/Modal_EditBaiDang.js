import moment from 'moment';
import React, { Component, createRef } from 'react';
import {
    Animated, FlatList, Image, ImageBackground, ScrollView, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView,
    TouchableHighlight, BackHandler, StyleSheet
} from "react-native";
import ActionSheet from "react-native-actions-sheet";
import DocumentPicker from 'react-native-document-picker';
import ImageCropPicker from 'react-native-image-crop-picker';
import { DsGroup, getChiTietBaiDang, UpdateBaiDang, updateKhenThuong, UpdateTagName, Update_FileBaiDang, getAllUser } from '../../../apis/JeePlatform/Api_JeeSocial/apiJeeSocial';
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import { RootLang } from '../../../app/data/locales';
import { nkey } from '../../../app/keys/keyStore';
import Utils from '../../../app/Utils';
import Header_TaoBaiDang from '../../../components/Header_TaoBaiDang';
import IsLoading from '../../../components/IsLoading';
import HeaderModal from '../../../Component_old/HeaderModal';
import { Images } from '../../../images';
import { colors } from '../../../styles';
import { sizes, reText } from '../../../styles/size';
import { Height, nstyles, Width, paddingBotX, nHeight, nwidth } from '../../../styles/styles';
import { ImgComp } from '../../../images/ImagesComponent';
import UtilsApp from '../../../app/UtilsApp';
import Video from 'react-native-video';
import ImageCus from '../../../components/NewComponents/ImageCus';
var RNFS = require('react-native-fs');

const actionSheetRef_Image = createRef();
const backGround = [
    {
        id: 1,
        name: 'bg1',
        image: Images.ImageJee.icBG1
    },
    {
        id: 2,
        name: 'bg2',
        image: Images.ImageJee.icBG2
    },
    {
        id: 3,
        name: 'bg3',
        image: Images.ImageJee.icBG3
    },
    {
        id: 4,
        name: 'bg4',
        image: Images.ImageJee.icBG4
    },
];

class Modal_EditBaiDang extends Component {
    constructor(props) {
        super(props);
        this.state = {
            opacity: new Animated.Value(0),
            data: Utils.ngetParam(this, 'data', ''),
            objectType: '',
            noiDung: '',
            images: [],
            numLine: '',
            imageBG: {},
            title: '',
            dateSukien: '',
            timeSukien: '',
            dsgroup: [],
            id_User: '',
            userTag: [],
            userTagCu: [],
            nameuser: '',
            avatar: '',
            listChitiet: [],
            templaete: '',
            khenthuong: [],
            newUser: [],
            deleteUser: [],
            dsFile: [],
            dsFileCu: [],
            imagesCu: [],
            deleteImage: [],
            deleteFile: [],
            videos: [],
            videosCu: [],
            deleteVideo: [],
            listUser: []
        }
        this.calllback = Utils.ngetParam(this, 'callback', '')
    }

    componentDidMount = async () => {
        BackHandler.addEventListener("hardwareBackPress", this._goback);
        nthisLoading.show()
        await this._loadDanhSach_ChiTietBD()
        this._dsGroup();
        this._loadDsUser()
        this.setState({
            id_User: await Utils.ngetStorage(nkey.UserId, ''),
            nameuser: await Utils.ngetStorage(nkey.nameuser, ''),
            avatar: await Utils.ngetStorage(nkey.avatar, ''),
        })
    }

    componentWillUnmount() {
        try {
            BackHandler.removeEventListener('hardwareBackPress', this._goback)
        }
        catch (error) { }
    }

    _loadDsUser = async () => {
        nthisLoading.show()
        let res = await getAllUser();
        // Utils.nlog("list user-------------------------", res)
        if (res.status == 1) {
            nthisLoading.hide()
            this.setState({ listUser: res.data })
        } else {
            nthisLoading.hide()
            // UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
        }
    }

    _goback = async () => {
        Utils.goback(this, null)
        return true
    }

    _loadDanhSach_ChiTietBD = async () => {
        let res = await getChiTietBaiDang(this.state.data.Id_BaiDang);
        // Utils.nlog("list chi tiết bài đăng-------------------------", res)
        if (res.status == 1) {
            await this.setState({
                listChitiet: res.data[0],
            }, async () => {
                await this.setState({
                    objectType: this.state.listChitiet.Group.length > 0 ? this.state.listChitiet.Group[0] : '',
                    noiDung: this.state.listChitiet.NoiDung,
                    userTag: this.state.listChitiet.TagName,
                    images: this.state.listChitiet.Attachment,
                    imagesCu: this.state.listChitiet.Attachment,
                    title: this.state.listChitiet.title,
                    dateSukien: this.state.listChitiet.timeline ? moment(this.state.listChitiet.timeline).format("DD/MM/YYYY") : '',
                    imageBG: this.state.listChitiet.template,
                    templaete: this.state.listChitiet.template,
                    khenthuong: this.state.listChitiet.KhenThuong?.length > 0 ? this.state.listChitiet.KhenThuong : [],
                    userTagCu: this.state.listChitiet.TagName,
                    dsFile: this.state.listChitiet.Attachment_File,
                    dsFileCu: this.state.listChitiet.Attachment_File,
                    videos: this.state.listChitiet.Videos,
                    videosCu: this.state.listChitiet.Videos
                }
                    , () => {
                        this.chuyendoi(this.state.images, 1)
                        this.chuyendoi(this.state.videos, 2)
                        this.chuyendoi(this.state.dsFile, 3)
                    }
                )
            })
            nthisLoading.hide()
        } else {
            nthisLoading.hide()
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
        }
    }


    chuyendoi = async (data, type) => {
        switch (type) {
            case 1:
                {
                    let datanew = data?.map(item => {
                        return { ...item, type: 1 }
                    })
                    await this.setState({
                        images: [...datanew]
                    })
                }
                break;
            case 2:
                {
                    let datanew = data.map(item => {
                        return { ...item, type: 2 }
                    })
                    this.setState({
                        videos: [...datanew]
                    })
                }
                break;
            case 3:
                {
                    let datanew = data?.map(item => {
                        return { ...item, type: 3 }
                    })
                    this.setState({
                        dsFile: [...datanew],
                    }
                    )
                }
                break;
            default:
                break;
        }
    }

    ViewItem = (item) => {
        return (
            <View
                key={item.id} >
                <Text style={{
                    textAlign: "center", fontSize: reText(16),
                    color: this.state.objectType?.Ten_Group == item.Ten_Group ? colors.colorTabActive : 'black',
                    fontWeight: this.state.objectType?.Ten_Group == item.Ten_Group ? "bold" : 'normal'
                }}>{item.Ten_Group ? item.Ten_Group : ""}</Text>
            </View>
        )
    }

    _callback = async (objectType) => {
        await this.setState({
            objectType,
        })
    }

    _callback_UserTag = async (userTag) => {
        await this.setState({
            userTag,
        })
        let newUser = this.state.userTag.filter(({ Username: id1 }) => !this.state.userTagCu.some(({ Username: id2 }) => id2 === id1))
        // Utils.nlog('newUser', newUser)
        let deleteUser = this.state.userTagCu.filter(({ Username: id1 }) => !this.state.userTag.some(({ Username: id2 }) => id2 === id1))
        // Utils.nlog('deletee', deleteUser)
        this.setState({
            newUser: newUser,
            deleteUser: deleteUser,
        })
    }

    _callback_Khenthuong = async (khenthuong) => {
        await this.setState({
            khenthuong: khenthuong,
        })
    }

    _callbackImage = async (images) => {
        await this.setState({
            images,
        })
    }

    _dsGroup = async () => {
        let res = await DsGroup();
        // Utils.nlog(' res group', res)
        if (res.status == 1) {
            let obj = [{ "ID_group": 0, "Ten_Group": "Công khai" }]
            res.data.map(i => {
                obj.push(i)
            })
            this.setState({ dsgroup: obj })
        }
    }

    _DropDown = () => {
        Utils.goscreen(this, 'Modal_ComponentSelectCom', {
            callback: this._callback, item: this.state.dsgroup,
            AllThaoTac: this.state.dsgroup, ViewItem: this.ViewItem,
        })
    }

    _go_UserTag = (idloaibaidang) => {
        const { listUser } = this.state
        let dataNVChuyenqua = []
        listUser.map(item => {
            dataNVChuyenqua.push({ ...item, 'hoten': item.Fullname, 'id_nv': item.UserId, 'image': item.Avatar, 'tenchucdanh': item.ChucVu })
        })
        if (idloaibaidang == 2) {
            Utils.goscreen(this, "sc_PickUser", {
                dataNV: dataNVChuyenqua, callback: this._callback_Khenthuong, onlyFive: true, nvCoSan: this.state.khenthuong
            })
        }
        else {
            let data = this.state.userTag.map(item => {
                return { ...item, id_nv: item.userid }
            })
            Utils.goscreen(this, "sc_PickUser", {
                dataNV: dataNVChuyenqua, callback: this._callback_UserTag, nvCoSan: data
            })
        }
    }

    _go_PickImage = () => {
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
        let options = {
            assetType: 'Videos',//All,Videos,Photos - default
            multi: true,// chọn 1 or nhiều item
            response: (data) => this.response(data, 2), // callback giá trị trả về khi có chọn item
            limitCheck: -1, //gioi han sl media chon: -1 la khong co gioi han, >-1 la gioi han sl =  limitCheck
            groupTypes: 'All',
        };
        Utils.goscreen(this, 'Modal_MediaPicker', options);
    }

    pickFiles = async () => {
        try {
            const results = await DocumentPicker.pickMultiple({
                type: [DocumentPicker.types.allFiles],

            });
            Utils.nlog("=-results", results)
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
            Utils.nlog('err', err)
            if (DocumentPicker.isCancel(err)) {
            } else {
                throw err;
            }
        }
    }

    _SetNgayThang = (dateDk) => {

        this.setState({ dateSukien: dateDk })
    }
    _setGioPhutA = (time) => {
        this.setState({ timeSukien: time })

    }
    _selectTime = (val) => {
        var { timeSukien } = this.state;
        Utils.goscreen(this, "Modal_GioPhutPickerSingal", {
            _setGoPhut: this._setGioPhutA,
            Time: timeSukien,
            textTitle: "Chọn giờ"
        })
    }

    _selectDate = (val) => {
        var { dateSukien } = this.state;
        Utils.goscreen(this, "Modal_CalandaSingalCom", {
            date: dateSukien,
            setTimeFC: this._SetNgayThang
        })
    }

    _updateTagName = async (idbaidang) => {
        let newU = [];
        let check = false;
        this.state.newUser?.map((item) => {
            return newU.push({ "userId": item.UserId, "id_baidang": idbaidang, "username": item.Username, "customerID": item.CustomerID, "fullname": item.Fullname, "avatar": item.Avatar })
        });
        let deleteU = [];
        this.state.deleteUser?.map((item) => {
            return deleteU.push({ "id_tag": item.id_tag, "userId": item.userid, "id_baidang": idbaidang, "username": item.Username, "customerID": 0, "fullname": item.Fullname, "avatar": item.Avatar })
        });
        let strbody = JSON.stringify({
            "tagName": newU,
            "deleteTagName": deleteU,
        })
        // Utils.nlog('body update tag', strbody)
        let res = await UpdateTagName(idbaidang, strbody)
        // Utils.nlog('res update TagName =--=-=-==-=-=-=-', res)
        if (res.status == 1) {
            check = true
        }
        else check = false
        return check
    }

    _goBack_Dung = () => {
        if (this.calllback == '') {
            { Utils.goscreen(this, 'sc_TabHomeSocial'), ROOTGlobal.setIndexTab.setIndex(0), ROOTGlobal.LoadDanhSachBaiDang.LoadDSBaiDang() }
        }
        else {
            this.calllback()
        }
    }

    _Update_FileBaiDang = async (idbaidang) => {
        let check = false;
        let newChung = [];
        let deleteChung = [];

        this.state.dsFile?.map((item) => {
            item?.id_att ? null : newChung.push({
                "strBase64": item.strBase64,
                "filename": item.filename,
                "src": item.uri,
                "isAdd": false,
                "isDel": false,
                "isImagePresent": false,
                "type": item.type,
                "size": 0
            })
        })

        this.state.deleteFile?.map((item) => {
            return deleteChung.push({
                "id_att": item.id_att,
                "strBase64": "",
                "filename": item.filename,
                "src": "",
                "isAdd": true,
                "isDel": true,
                "isImagePresent": true,
                "type": item.type,
                "size": 0,
            })
        })

        for (let index = 0; index < this.state.images.length; index++) {
            let item = this.state.images[index];
            let downSize = 1;

            if (item?.height >= 2000 || item?.width >= 2000) {
                downSize = 0.3;
            }
            let str64 = item?.id_baidang ? null : await Utils.parseBase64_PAHT(item.uri, item.height, item.width, downSize, item.timePlay != 0)
            item?.id_baidang ? null :
                newChung.push({
                    "strBase64": str64,
                    "filename": item.filename,
                    "src": item.uri,
                    "isAdd": false,
                    "isDel": false,
                    "isImagePresent": false,
                    "type": "image/png",
                    "size": 0,
                })
        }

        this.state.deleteImage?.map((item) => {
            deleteChung.push({
                "id_att": item.id_att,
                "strBase64": "",
                "filename": item.filename,
                "src": item.hinhanh,
                "isAdd": true,
                "isDel": true,
                "isImagePresent": true,
                "type": item.type,
                "size": 0,
            })
        })

        for (let index = 0; index < this.state.videos.length; index++) {
            let item = this.state.videos[index];
            let downSize = 1;
            if (item?.height >= 2000 || item?.width >= 2000) {
                downSize = 0.3;
            }
            let str64 = item?.id_baidang ? null : await Utils.getBase64FromUrl(item.uri,)
            item?.id_baidang ? null :
                newChung.push({
                    "strBase64": str64 ? str64.substring(str64.indexOf(",")).replace(',', '') : str64,
                    "filename": item.filename,
                    "src": item.uri,
                    "isAdd": false,
                    "isDel": false,
                    "isImagePresent": false,
                    "type": "image/png",
                    "size": 0,
                })
        }

        this.state.deleteVideo?.map((item) => {
            return deleteChung.push({
                "id_att": item.id_att,
                "strBase64": "",
                "filename": item.filename,
                "src": "",
                "isAdd": true,
                "isDel": true,
                "isImagePresent": true,
                "type": "video/mp4",
                "size": 0,
            })
        })

        let strbody = {
            "iD_BaiDang": idbaidang,
            "id_loaibaidang": 0,
            "title": "",
            "NoiDung": "",
            "Id_Group": 0,
            "id_khenthuong": 0,
            "typepost": "",
            "Timeline": "",
            "Attachment": newChung,
            "List_DeleteAttachment": deleteChung,
            "template": "",
            "TagName": []
        }
        // Utils.nlog('body update anh file', strbody)

        let res = await Update_FileBaiDang(strbody)
        // Utils.nlog('res Update_FileBaiDang =--=-=-==-=-=-=-', res)
        if (res.status == 1) {
            check = true
        }
        else check = false
        return check
    }

    _editBaiDang = async (loaibaidang, idbaidang) => {
        let strbody = JSON.stringify({
            "iD_BaiDang": idbaidang,
            "id_loaibaidang": loaibaidang,
            "title": loaibaidang == 1 ? this.state.title : "",
            "noiDung": this.state.noiDung ? this.state.noiDung : "",
            "id_Group": this.state.objectType?.ID_group ? this.state.objectType.ID_group : this.state.objectType?.id_group ? this.state.objectType?.id_group : 0,
            "id_khenthuong": 0,
            "typepost": "",
            "timeline": loaibaidang == 1 ? moment(this.state.dateSukien, "DD/MM/YYYY").format("YYYY/MM/DD") : "",
            "attachment": [],
            "template": "",
            "tagName": [],
        })
        // Utils.nlog('body', strbody)
        nthisLoading.show()
        let res = await UpdateBaiDang(strbody)
        // Utils.nlog('res update bài =--=-=-==-=-=-=-', res)
        let update = await this._updateTagName(idbaidang);
        let updatefile_anh = await this._Update_FileBaiDang(idbaidang);
        if (res.status == 1 && update == true && updatefile_anh == true) {
            nthisLoading.hide()
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.JeeSocial.capnhatthanhcong, 1)
            this._goBack_Dung()
        } else {
            nthisLoading.hide()
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
        }
    }

    _editBaiDang_Khenthuong = async (loaibaidang, idbaidang) => {
        nthisLoading.show()
        let user = [];
        user = this.state.khenthuong.map((item) => {
            return item.hoten ?? item.Fullname + ''
        })
        let dskhenthuong = [];
        this.state.khenthuong.map((item) => {
            return dskhenthuong.push({ "id_baidang": idbaidang, "userId": item.userId ?? item.UserId, "hoten": item.hoten ?? item.Fullname, "avatar": item.avatar ?? item.Avatar })
        })
        let strbody = JSON.stringify({
            "iD_BaiDang": idbaidang,
            "id_loaibaidang": loaibaidang,
            "title": user ? user.toString() : this.state.title,
            "noiDung": this.state.noiDung ? this.state.noiDung : "",
            "id_Group": this.state.objectType?.ID_group ? this.state.objectType.ID_group : this.state.objectType?.id_group ? this.state.objectType?.id_group : 0,
            "id_khenthuong": 0,
            "typepost": "",
            "timeline": "",
            "attachment": [
            ],
            "template": this.state.imageBG.name ? this.state.imageBG.name : this.state.templaete,
            "tagName": []
        })

        let strbody_khenThuong = JSON.stringify({
            "dsKhenThuong": dskhenthuong
        })
        // Utils.nlog('body', strbody)
        // Utils.nlog('strbody_khenThuong', strbody_khenThuong)
        let res = await UpdateBaiDang(strbody)
        // Utils.nlog('res update badi dang khen thuong =--=-=-==-=-=-=-', res)
        if (res.status == 1) {
            let res_Kt = await updateKhenThuong(idbaidang, strbody_khenThuong)
            // Utils.nlog('body khen thuong', strbody_khenThuong)
            // Utils.nlog('res  update khen thuong', res_Kt)
            if (res_Kt.status == 1) {
                nthisLoading.hide()
                UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.JeeSocial.capnhatthanhcong, 1)
                this._goBack_Dung()
            }
        } else {
            nthisLoading.hide()
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
        }
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
                        source={{ uri: item.hinhanh ? item.hinhanh : item.uri }}
                        style={{ width: '100%', height: '100%', borderRadius: 4 }}></Image>
                </View>
                <TouchableHighlight
                    onPress={() => { this.removeFileNew(item, index, 1) }}
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
                    onPress={() => { this.removeFileNew(item, index, 3) }}
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

    _renderItem_KhenThuong_Anh = ({ item, index }) => {
        return (
            <TouchableOpacity
                style={{ height: Height(10), alignItems: 'center', paddingHorizontal: 5 }}>
                <View style={[{ justifyContent: 'center', alignItems: 'center' }]}>
                    {
                        item?.Avatar || item.avatar ?
                            <ImageCus
                                style={nstyles.nAva32}
                                source={{ uri: item.avatar ? item.avatar : item.Avatar }}
                                resizeMode={"cover"}
                                defaultSourceCus={Images.icAva}
                            /> :
                            <View style={[nstyles.nAva32, {
                                backgroundColor: this.intToRGB(this.hashCode(item.hoten ? item.hoten : item.Fullname)),
                                flexDirection: "row", justifyContent: 'center', alignItems: 'center'
                            }]}>
                                <Text style={styles.textName}>{String(item.hoten ? item.hoten : item.Fullname).split(" ").slice(-1).toString().slice(0, 2).toString()}</Text>
                            </View>
                    }
                </View>
            </TouchableOpacity >
        );
    }

    _renderItem_KhenThuong = ({ item, index }) => {
        return (
            <TouchableOpacity
                style={{ height: Height(10), paddingTop: 10, paddingBottom: 10, alignItems: 'center', }}>
                <Text style={{ fontWeight: 'bold', color: this.state.imageBG?.name == 'bg1' || this.state.templaete == 'bg1' ? colors.black : colors.white, }}>{item.hoten ? item.hoten + ", " : item.Fullname + ", "}</Text>
            </TouchableOpacity >
        );
    }

    _setImageBG = (item) => {
        this.setState({ imageBG: item, templaete: item.name })
    }

    _renderItem_BackGround = ({ item, index }) => {
        return (
            <TouchableOpacity
                onPress={() => { this._setImageBG(item) }}
                style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10, }}>
                {
                    this.state.imageBG.id ? (
                        <View style={[{ borderColor: this.state.imageBG.id == item.id ? colors.colorTabActive : null, borderWidth: this.state.imageBG.id == item.id ? 3 : 0 }]}>
                            <Image source={item.image} resizeMode='cover' style={[nstyles.nIcon30, { backgroundColor: this.state.imageBG.id == item.id ? colors.colorTabActive : null }]} />
                        </View>
                    ) : (
                            <View style={[{ borderColor: this.state.imageBG == item.name ? colors.colorTabActive : null, borderWidth: this.state.imageBG == item.name ? 3 : 0 }]}>
                                <Image source={item.image} resizeMode='cover' style={[nstyles.nIcon30, { backgroundColor: this.state.imageBG == item.name ? colors.colorTabActive : null }]} />
                            </View>
                        )
                }
            </TouchableOpacity >
        );
    }

    onPressItem = (item, index) => {
        switch (item.type) {
            case 1:
                Utils.goscreen(this, 'Modal_ViewImageListShow_PAHT', { ListImages: this.state.images, index: index, objKeyURL: 'hinhanh' });
                break;
            case 2:
                Utils.goscreen(this, 'Modal_PlayMedia', { source: item.path ? item.path : item.uri });
                break;
            case 3:
                Utils.openUrl(item.Link)
                break;
            default:
                Utils.openUrl(item.Link) // Hiện tại type khi lưu của file chưa đúng, nên tạm thời vào file ở đây
                break;
        }
    }

    _containsObject(obj, list) {
        let checkExit = obj.some((item) => item.id_att == list.id_att)
        return checkExit
    }

    removeFileNew = (item, index, type) => {
        switch (type) {
            case 1:
                {
                    if (this.state.images.length >= 1) {
                        let dataFileNew = this.state.images.map(item => {
                            return item
                        })
                        let checkFileCu = this._containsObject(this.state.imagesCu, item)
                        if (checkFileCu == true) {
                            this.setState({
                                deleteImage: this.state.deleteImage.concat(this.state.images[index]),
                            }, () => {
                                dataFileNew.splice(index, 1);
                                this.setState({
                                    images: dataFileNew,
                                })
                            })
                        }
                        else {
                            dataFileNew.splice(index, 1)
                            this.setState({
                                images: dataFileNew,
                            })
                        }
                    } else {
                        this.setState({
                            images: [...this.state.images]
                        })
                    }
                }
                break;
            case 2:
                {
                    if (this.state.videos.length >= 1) {
                        let dataFileNew = this.state.videos.map(item => {
                            return item
                        })
                        let checkFileCu = this._containsObject(this.state.videosCu, item)
                        if (checkFileCu == true) {
                            this.setState({
                                deleteVideo: this.state.deleteVideo.concat(this.state.videos[index]),
                            }, () => {
                                dataFileNew.splice(index, 1);
                                this.setState({
                                    videos: dataFileNew,
                                })
                            })
                        }
                        else {
                            dataFileNew.splice(index, 1)
                            this.setState({
                                videos: dataFileNew,
                            })
                        }
                    } else {
                        this.setState({
                            videos: [...this.state.videos]
                        })
                    }
                }
                break;
            case 3:
                {
                    if (this.state.dsFile.length >= 1) {
                        let dataFileNew = this.state.dsFile.map(item => {
                            return item
                        })
                        let checkFileCu = this._containsObject(this.state.dsFileCu, item)
                        if (checkFileCu == true) {
                            this.setState({
                                deleteFile: this.state.deleteFile.concat(this.state.dsFile[index]),
                            }, () => {
                                dataFileNew.splice(index, 1);
                                this.setState({
                                    dsFile: dataFileNew,
                                })
                            })
                        }
                        else {
                            dataFileNew.splice(index, 1)
                            this.setState({
                                dsFile: dataFileNew,
                            })
                        }
                    } else {
                        this.setState({
                            dsFile: [...this.state.dsFile]
                        })
                    }
                }
                break;
            default:
                break;
        }
    }

    _pareImage = async (uri, height, width) => {
        let str64 = await Utils.parseBase64_PAHT(uri, height, width, 0.3)
        // Utils.nlog('str64', str64)
        return str64
    }

    response = (data, type) => {
        switch (type) {
            case 1:
                {
                    let datanew = []
                    data.iscancel == true ? (null) : (
                        datanew = data?.map((item) => {
                            return { ...item, type: 1 }
                        })
                    )
                    this.setState({
                        images: [...this.state.images, ...datanew],
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
                        videos: [...this.state.videos, ...datanew]
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

    _CusTom_Bottom = (check = false, idloaibaidang = 0) => {
        return (
            <View style={{ borderColor: '#707070', justifyContent: 'center', borderBottomWidth: 0.3, borderTopWidth: 0.3, paddingVertical: 15 }}>
                <View style={[{ flexDirection: "row", marginHorizontal: 15, justifyContent: 'space-between', }]}>
                    <Text style={{ textAlign: 'center' }}>{RootLang.lang.JeeSocial.themvaobaiviet}</Text>
                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: 'center' }}>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: 'center' }}>
                            {
                                check == true ? (null) : (
                                    <>
                                        <TouchableOpacity style={{ paddingHorizontal: 20 }}
                                            onPress={() => this._go_PickImage()} >
                                            <Image source={Images.ImageJee.icChonAnh}
                                                resizeMode='contain' style={nstyles.nIcon19} />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => this._open_VideoGallery()}
                                            style={{ paddingHorizontal: 20 }}>
                                            <Image source={Images.ImageJee.icVideo}
                                                resizeMode='contain' style={[nstyles.nIcon19, { paddingHorizontal: 2, }]} />
                                        </TouchableOpacity >
                                        <TouchableOpacity
                                            onPress={() => this.pickFiles()}
                                            style={{ paddingHorizontal: 20 }}>
                                            <Image source={Images.ImageJee.icLink}
                                                resizeMode='contain' style={[nstyles.nIcon19, { paddingHorizontal: 2, tintColor: '#FF3D2E' }]} />
                                        </TouchableOpacity >
                                    </>
                                )
                            }
                            <TouchableOpacity style={{ paddingHorizontal: 20 }} onPress={() => this._go_UserTag(idloaibaidang)} >
                                <Image source={Images.ImageJee.icUserTag}
                                    resizeMode='contain' style={[nstyles.nIcon20, { paddingHorizontal: 2 }]} />
                            </TouchableOpacity >
                        </View>
                    </View>

                </View>
            </View>
        )

    }
    renderImageBG = (item) => {
        switch (item) {
            case 'bg1': return Images.ImageJee.icBG1;
            case 'bg2': return Images.ImageJee.icBG2;
            case 'bg3': return Images.ImageJee.icBG3;
            case 'bg4': return Images.ImageJee.icBG4;
        }
    }

    _render_View = () => {
        const { objectType, images, noiDung, timeSukien, dateSukien, userTag, nameuser, avatar, title, listChitiet, dsFile, Listdatafile, videos } = this.state
        let item = this.state.data;
        switch (item?.Id_LoaiBaiDang) {
            case 3: // thảo luận
                return (
                    <View style={{ backgroundColor: colors.white, flex: 1 }}>
                        <Header_TaoBaiDang
                            nthis={this} title={RootLang.lang.JeeSocial.thaoluan}
                            textRight={noiDung ? RootLang.lang.JeeSocial.capnhat : null}
                            styTextRight={[{ fontSize: reText(15), color: '#0E72D8' }]}
                            iconLeft={Images.ImageJee.icBack}
                            onPressLeft={this._goback}
                            // textleft={"Gắn thẻ"}
                            onPressRight={() => { this._editBaiDang(item.Id_LoaiBaiDang, item.Id_BaiDang) }}
                            styBorder={{
                                borderBottomColor: colors.black_20,
                                borderBottomWidth: 0.5
                            }}
                        />
                        <KeyboardAvoidingView
                            keyboardVerticalOffset={Platform.select({ ios: 0, android: 500 })}
                            behavior={(Platform.OS === 'ios') ? "padding" : null}
                            style={{ flex: 1 }}
                        >
                            <View style={{ flexDirection: 'row', paddingVertical: 5, paddingHorizontal: 5, }}>
                                <ImageCus
                                    style={[nstyles.nAva40, {}]}
                                    source={{ uri: avatar }}
                                    resizeMode={"cover"}
                                    defaultSourceCus={Images.icAva}
                                />
                                <View style={{ flex: 1 }}>
                                    <View style={{ flexDirection: 'row', marginLeft: 5, paddingVertical: 2, }}>
                                        <Text style={{ fontWeight: 'bold', fontSize: reText(13) }}>{nameuser} </Text>
                                        {
                                            this.state.objectType == '' && this.state.userTag?.length > 0 ?
                                                (
                                                    <View style={{ flexDirection: 'row', marginRight: 10, flex: 1 }}>
                                                        <Text> {RootLang.lang.JeeSocial.voi} </Text>
                                                        <View style={{ flex: 1 }}>
                                                            <Text numberOfLines={1} style={{ fontWeight: 'bold', }}>{this.state.userTag?.length}{' ' + RootLang.lang.JeeSocial.nguoikhac}</Text>

                                                        </View>
                                                    </View>
                                                ) : (
                                                    null
                                                )
                                        }
                                    </View>
                                    <View style={{ flexDirection: 'row', padding: 5, alignItems: 'center' }}>
                                        <TouchableOpacity
                                            onPress={() => this._DropDown()}
                                            style={[{
                                                // width: '0%',
                                                maxWidth: '100%',
                                                flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                                                paddingVertical: 2, backgroundColor: colors.white, borderWidth: 0.3,
                                                borderBottomColor: '#707070', borderRadius: 20
                                            }]}>
                                            {
                                                this.state.objectType ? (

                                                    <Text numberOfLines={1} style={[{ paddingHorizontal: 10, color: '#707070', textAlign: 'right', fontSize: reText(11), }]}>{this.state.objectType.ten_group ? RootLang.lang.JeeSocial.dangvaophong + this.state.objectType.ten_group : RootLang.lang.JeeSocial.dangvaophong + this.state.objectType.Ten_Group}</Text>
                                                ) : (
                                                        <Text numberOfLines={1} style={[{ paddingHorizontal: 10, color: '#707070', textAlign: 'right', fontSize: reText(11), }]}>{RootLang.lang.JeeSocial.dangvaophong + " ...."}</Text>
                                                    )
                                            }
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>

                            <ScrollView style={{ flex: 1, }}>
                                <View style={{ paddingHorizontal: 5, }}>
                                    <View style={{}}>
                                        <TextInput
                                            style={{
                                                color: "black",
                                                fontSize: reText(15),
                                            }}
                                            onChangeText={(text) => {
                                                this.setState({ noiDung: text });
                                            }}
                                            placeholder={RootLang.lang.JeeSocial.bandangnghigi}
                                            autoCorrect={false}
                                            multiline={true}
                                            underlineColorAndroid="rgba(0,0,0,0)"
                                        >
                                            {noiDung}
                                        </TextInput>
                                    </View>
                                    <View style={{ paddingVertical: images?.length > 0 || dsFile.length > 0 ? 10 : 0, }}>
                                        {
                                            images?.length > 0 ?
                                                <View style={{
                                                    flexWrap: 'wrap',
                                                    width: '100%',
                                                    flexDirection: 'row',
                                                }}>
                                                    {
                                                        images.map((item, index) => this._renderImage(item, index))
                                                    }
                                                </View>
                                                : null
                                        }
                                        {
                                            dsFile?.length > 0 ? (
                                                <View style={{
                                                    flexWrap: 'wrap',
                                                    width: '100%',
                                                    flexDirection: 'row',
                                                }}>
                                                    {
                                                        dsFile.map((item, index) => this._renderImageFile(item, index))
                                                    }
                                                </View>
                                            ) : (null)
                                        }
                                        {
                                            videos.length > 0 ? (
                                                <View style={{
                                                    flexWrap: 'wrap',
                                                    width: '100%',
                                                    flexDirection: 'row',
                                                }}>
                                                    {videos.map((i, index) => {
                                                        return (
                                                            <TouchableOpacity key={index}
                                                                style={{
                                                                    width: (nwidth - 30) / 3, height: (nwidth - 30) / 3, marginRight: 5, marginTop: 5,
                                                                    borderColor: '#E8E8E9', borderWidth: 0.5
                                                                }}
                                                                onPress={() => { }} >
                                                                {
                                                                    i.path ? (
                                                                        <Video
                                                                            source={{ uri: encodeURI(i.path) }} // Can be a URL or a local file.
                                                                            resizeMode="cover"           // Fill the whole screen at aspect ratio.
                                                                            paused={true}
                                                                            onError={(error) => Utils.nlog(error)}   // Callback when video cannot be loaded
                                                                            style={{ width: (nwidth - 30) / 3, height: (nwidth - 30) / 3 }} />
                                                                    ) : (
                                                                            <Image
                                                                                style={{
                                                                                    width: (nwidth - 30) / 3,
                                                                                    height: (nwidth - 30) / 3,
                                                                                }}
                                                                                resizeMode='cover'
                                                                                source={{ uri: i.uri }}
                                                                            />
                                                                        )
                                                                }
                                                                <TouchableOpacity style={{
                                                                    position: 'absolute', top: 0, right: 0, left: 0, bottom: 0, justifyContent: 'center',
                                                                    alignItems: 'center'
                                                                }} activeOpacity={0.9}
                                                                    onPress={() => this.onPressItem(i, index)}
                                                                >
                                                                    <Image
                                                                        style={{ width: 35, height: 35 }}
                                                                        resizeMode='contain'
                                                                        source={ImgComp.mediaPlayButton}
                                                                    />
                                                                </TouchableOpacity>
                                                                <TouchableHighlight
                                                                    onPress={() => { this.removeFileNew(i, index, 2) }}
                                                                    underlayColor={colors.backgroundModal}
                                                                    style={{
                                                                        padding: 4, position: 'absolute', top: 5, right: 5, backgroundColor: colors.redDelete, borderRadius: 20
                                                                    }}>
                                                                    <Image resizeMode='contain'
                                                                        source={ImgComp.icCloseWhite}
                                                                        style={{
                                                                            width: 15, height: 15, tintColor: 'white',
                                                                        }}></Image>
                                                                </TouchableHighlight>
                                                            </TouchableOpacity>

                                                        )
                                                    })}
                                                </View>
                                            ) : (null)
                                        }
                                    </View>
                                    <View style={{ padding: 10, flex: 1 }}>
                                        {
                                            this.state.objectType && this.state.userTag?.length > 0 && this.state.userTag?.length >= 3 ?
                                                (
                                                    <View
                                                        style={{ flexDirection: 'row', flex: 1 }}>
                                                        <Text style={{ fontSize: reText(13), }}>{RootLang.lang.JeeSocial.voi}</Text>
                                                        <Text numberOfLines={1} style={{ fontSize: reText(13), fontWeight: 'bold', flex: 1 }}>{userTag?.length}{' ' + RootLang.lang.JeeSocial.nguoikhac}</Text>
                                                    </View>
                                                ) : (
                                                    null
                                                )
                                        }
                                    </View>
                                </View>
                            </ScrollView>

                            <View style={{ bottom: 0, paddingBottom: 15 }}>
                                {this._CusTom_Bottom()}
                            </View>
                        </KeyboardAvoidingView>
                    </View>
                )
            case 2: //Chào mừng,Sinh nhật, Khen thưởng
                return (
                    <View style={{ backgroundColor: colors.white, flex: 1 }}>
                        <Header_TaoBaiDang
                            nthis={this} title={RootLang.lang.JeeSocial.chaomungsinhnhatkhenthuong}
                            textRight={noiDung ? RootLang.lang.JeeSocial.capnhat : null}
                            styTextRight={[{ fontSize: reText(15), color: '#0E72D8' }]}
                            iconLeft={Images.ImageJee.icBack}
                            onPressLeft={this._goback}
                            khenthuong={true}
                            // textleft={"Gắn thẻ"}
                            onPressRight={() => { this._editBaiDang_Khenthuong(item.Id_LoaiBaiDang, item.Id_BaiDang) }}
                            styBorder={{
                                borderBottomColor: colors.black_20,
                                borderBottomWidth: 0.5
                            }}
                        />
                        <View >
                            <View style={{ flexDirection: 'row', paddingVertical: 5, paddingHorizontal: 5 }}>
                                <ImageCus
                                    style={[nstyles.nAva40, {}]}
                                    source={{ uri: avatar }}
                                    resizeMode={"cover"}
                                    defaultSourceCus={Images.icAva}
                                />
                                <View style={{}}>
                                    <View style={{ flexDirection: 'row', marginLeft: 5, }}>
                                        <Text style={{ fontWeight: 'bold', fontSize: reText(13) }}>{nameuser} </Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', padding: 5, alignItems: 'center' }}>
                                        <TouchableOpacity
                                            onPress={() => this._DropDown()}
                                            style={[{
                                                maxWidth: '100%',
                                                flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                                                paddingVertical: 2, backgroundColor: colors.white, borderWidth: 0.3,
                                                borderBottomColor: '#707070', borderRadius: 20
                                            }]}>
                                            {
                                                this.state.objectType ? (
                                                    <Text numberOfLines={1} style={[{ paddingHorizontal: 10, color: '#707070', textAlign: 'right', fontSize: reText(11), }]}>{this.state.objectType.ten_group ? RootLang.lang.JeeSocial.dangvaophong + this.state.objectType.ten_group : RootLang.lang.JeeSocial.dangvaophong + this.state.objectType.Ten_Group}</Text>
                                                ) : (
                                                        <Text numberOfLines={1} style={[{ paddingHorizontal: 10, color: '#707070', textAlign: 'right', fontSize: reText(11), }]}>{RootLang.lang.JeeSocial.dangvaophong + '....'}</Text>
                                                    )
                                            }
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{ flex: 1, justifyContent: "space-between", marginBottom: 15 }}>
                            <ScrollView nestedScrollEnabled style={{}}>
                                <ImageBackground source={this.renderImageBG(this.state.imageBG?.name ?? this.state.templaete)} style={{ height: nHeight(25), paddingBottom: 50, }}>
                                    <View style={{}}>
                                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                            {
                                                this.state.khenthuong?.length > 0 ? (
                                                    <View style={{ justifyContent: 'center', alignItems: 'center', height: Width(20) }}>
                                                        <FlatList
                                                            showsHorizontalScrollIndicator={false}
                                                            showsVerticalScrollIndicator={false}
                                                            style={{ marginTop: 5, }}
                                                            horizontal={true}
                                                            data={this.state.khenthuong}
                                                            renderItem={this._renderItem_KhenThuong_Anh}
                                                            keyExtractor={(item, index) => index.toString()}
                                                        />
                                                        <FlatList
                                                            showsHorizontalScrollIndicator={false}
                                                            showsVerticalScrollIndicator={false}
                                                            style={{ marginTop: 5, maxWidth: Width(90), }}
                                                            horizontal={true}
                                                            data={this.state.khenthuong}
                                                            renderItem={this._renderItem_KhenThuong}
                                                            keyExtractor={(item, index) => index.toString()}
                                                        />
                                                    </View>
                                                ) : (
                                                        null
                                                    )
                                            }
                                        </View>
                                        <View style={{ marginHorizontal: 15, }}>
                                            <View>
                                                <TextInput
                                                    style={{
                                                        color: this.state.imageBG?.name == ' bg1' || this.state.templaete == 'bg1' ? colors.black : colors.white,
                                                        fontSize: reText(15),
                                                        marginTop: 5,
                                                        marginRight: 5,
                                                        paddingBottom: 5,
                                                        maxHeight: Width(20)
                                                    }}
                                                    numberOfLines={3}
                                                    onChangeText={(text) => {
                                                        this.setState({ noiDung: text });
                                                    }}
                                                    maxLength={120}
                                                    placeholder={RootLang.lang.JeeSocial.noidungkhenthuong}
                                                    autoCorrect={false}
                                                    multiline={true}
                                                    underlineColorAndroid="rgba(0,0,0,0)" >
                                                    {this.state.noiDung}
                                                </TextInput>
                                            </View>
                                        </View>
                                    </View>
                                </ImageBackground>
                                <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                                    <Text style={{ color: colors.gray1 }}>( {this.state.noiDung.length}/120 )</Text>
                                </View>
                            </ScrollView>
                            <View style={{ justifyContent: 'flex-end', bottom: 0 }}>
                                <FlatList
                                    showsHorizontalScrollIndicator={false}
                                    showsVerticalScrollIndicator={false}
                                    style={{ borderTopWidth: 0.3, borderColor: '#707070', paddingVertical: 5 }}
                                    horizontal={true}
                                    data={backGround}
                                    renderItem={this._renderItem_BackGround}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                                {this._CusTom_Bottom(true, item.Id_LoaiBaiDang)}
                            </View>
                        </View>
                    </View>
                )
            case 1: // thông báo
                return (
                    <View style={{ backgroundColor: colors.white, flex: 1 }}>
                        <Header_TaoBaiDang
                            nthis={this} title={RootLang.lang.thongbaochung.thongbao}
                            textRight={noiDung && title ? RootLang.lang.JeeSocial.capnhat : null}
                            styTextRight={[{ fontSize: reText(15), color: '#0E72D8' }]}
                            iconLeft={Images.ImageJee.icBack}
                            onPressLeft={this._goback}
                            // textleft={"Gắn thẻ"}
                            onPressRight={() => { this._editBaiDang(item.Id_LoaiBaiDang, item.Id_BaiDang) }}
                            styBorder={{
                                borderBottomColor: colors.black_20,
                                borderBottomWidth: 0.5
                            }}
                        />
                        <View >
                            <View style={{ flexDirection: 'row', paddingVertical: 5, paddingHorizontal: 5 }}>
                                <ImageCus
                                    style={[nstyles.nAva40, {}]}
                                    source={{ uri: avatar }}
                                    resizeMode={"cover"}
                                    defaultSourceCus={Images.icAva}
                                />
                                <View style={{}}>
                                    <View style={{ flexDirection: 'row', marginLeft: 5, }}>
                                        <Text style={{ fontWeight: 'bold', fontSize: reText(13) }}>{nameuser} </Text>
                                        {
                                            this.state.objectType == '' && this.state.userTag?.length > 0 && this.state.userTag?.length >= 3 ?
                                                (
                                                    <View style={{ flexDirection: 'row', }}>
                                                        <Text style={{ fontSize: reText(13), }}> {RootLang.lang.JeeSocial.voi} </Text>
                                                        <Text style={{ fontSize: reText(13), fontWeight: 'bold' }}>{this.state.userTag[0]?.Fullname}</Text>
                                                        <Text style={{ fontSize: reText(13) }}> {RootLang.lang.JeeSocial.va} </Text>
                                                        <Text numberOfLines={1} style={{ fontSize: reText(13), fontWeight: 'bold', width: Width(20) }}>{this.state.userTag.length - 1}  {' ' + RootLang.lang.JeeSocial.nguoikhac}</Text>
                                                    </View>
                                                ) : (
                                                    this.state.objectType == '' && this.state.userTag?.length > 0 && this.state.userTag?.length <= 2 ? (
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <Text style={{ fontSize: reText(13), }}> {RootLang.lang.JeeSocial.voi} </Text>
                                                            <Text style={{ fontSize: reText(13), fontWeight: 'bold' }}>{this.state.userTag[0]?.Fullname}</Text>
                                                            {
                                                                this.state.userTag[1] ? (
                                                                    <View>
                                                                        <Text numberOfLines={1} style={{ fontSize: reText(13), fontWeight: 'bold', width: Width(22), }}>, {this.state.userTag[1]?.Fullname}</Text>
                                                                    </View>
                                                                ) : (null)
                                                            }
                                                        </View>
                                                    ) : (
                                                            null
                                                        )
                                                )
                                        }
                                    </View>
                                    <View style={{ flexDirection: 'row', padding: 5, alignItems: 'center' }}>
                                        <TouchableOpacity
                                            onPress={
                                                () => this._DropDown()
                                            }
                                            style={[{
                                                maxWidth: '100%',
                                                flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                                                paddingVertical: 2, backgroundColor: colors.white, borderWidth: 0.3,
                                                borderBottomColor: '#707070', borderRadius: 20
                                            }]}>
                                            {
                                                this.state.objectType ? (
                                                    <Text numberOfLines={1} style={[{ paddingHorizontal: 10, color: '#707070', textAlign: 'right', fontSize: reText(11), }]}>{this.state.objectType.ten_group ? RootLang.lang.JeeSocial.dangvaophong + this.state.objectType.ten_group : RootLang.lang.JeeSocial.dangvaophong + this.state.objectType.Ten_Group}</Text>
                                                ) : (
                                                        <Text numberOfLines={1} style={[{ paddingHorizontal: 10, color: '#707070', textAlign: 'right', fontSize: reText(11), }]}>{RootLang.lang.JeeSocial.dangvaophong + '....'}</Text>
                                                    )
                                            }
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{ flex: 1, justifyContent: "space-between", marginBottom: 15 }}>
                            <ScrollView nestedScrollEnabled style={{ flex: 1, }}>
                                <View style={{ paddingHorizontal: 5, paddingTop: 5 }}>
                                    <TouchableOpacity
                                        onPress={() => this._selectDate(true)}
                                        style={[{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            backgroundColor: colors.black_20_2,
                                            paddingVertical: 15,
                                            margin: 2,
                                            paddingHorizontal: 10,
                                            borderRadius: 20
                                        }]}>
                                        <Text style={[{ textAlign: 'center', color: colors.black_20, fontSize: reText(14), lineHeight: reText(15), }]}>{RootLang.lang.JeeSocial.thoihanden}</Text>
                                        <Text numberOfLines={2} style={[{
                                            textAlign: 'right', color: colors.black,
                                            fontSize: reText(14),
                                            lineHeight: reText(18)
                                        }]}> {this.state.dateSukien ? this.state.dateSukien : null}</Text>
                                    </TouchableOpacity>
                                    <View >
                                        <TextInput
                                            style={{
                                                color: "black",
                                                fontSize: reText(15),
                                                marginTop: 5,
                                                paddingBottom: 5,
                                                fontWeight: 'bold'
                                            }}
                                            onChangeText={(text) => {
                                                this.setState({ title: text });
                                            }}
                                            placeholder={RootLang.lang.JeeSocial.tieudethongbao}
                                            autoCorrect={false}
                                            multiline={true}
                                            underlineColorAndroid="rgba(0,0,0,0)"
                                        >
                                            {title}
                                        </TextInput>
                                    </View>
                                    <View>
                                        <TextInput
                                            style={{
                                                color: "black",
                                                fontSize: reText(15),
                                            }}
                                            onChangeText={(text) => {
                                                this.setState({ noiDung: text });
                                            }}
                                            placeholder={RootLang.lang.JeeSocial.noidungthongbao}
                                            autoCorrect={false}
                                            multiline={true}
                                            underlineColorAndroid="rgba(0,0,0,0)">
                                            {this.state.noiDung}
                                        </TextInput>
                                    </View>
                                    <View style={{ paddingVertical: images?.length > 0 || dsFile?.length > 0 ? 10 : 0, }}>
                                        {
                                            images?.length > 0 ?
                                                <View style={{
                                                    flexWrap: 'wrap',
                                                    width: '100%',
                                                    flexDirection: 'row',
                                                }}>
                                                    {
                                                        images.map((item, index) => this._renderImage(item, index))
                                                    }
                                                </View>
                                                : null
                                        }
                                        {
                                            dsFile?.length > 0 ? (
                                                <View style={{
                                                    flexWrap: 'wrap',
                                                    width: '100%',
                                                    flexDirection: 'row',
                                                }}>
                                                    {
                                                        dsFile.map((item, index) => this._renderImageFile(item, index))
                                                    }
                                                </View>
                                            ) : (null)
                                        }
                                        {
                                            videos.length > 0 ? (
                                                <View style={{
                                                    flexWrap: 'wrap',
                                                    width: '100%',
                                                    flexDirection: 'row',
                                                }}>
                                                    {videos.map((i, index) => {
                                                        return (
                                                            <TouchableOpacity key={index}
                                                                style={{
                                                                    width: (nwidth - 30) / 3, height: (nwidth - 30) / 3, marginRight: 5, marginTop: 5,
                                                                    borderColor: '#E8E8E9', borderWidth: 0.5
                                                                }}
                                                                onPress={() => { }}
                                                            >
                                                                {
                                                                    i.path ? (
                                                                        <Video
                                                                            source={{ uri: encodeURI(i.path) }}// Can be a URL or a local file.
                                                                            resizeMode="cover"           // Fill the whole screen at aspect ratio.
                                                                            paused={true}
                                                                            onError={(error) => Utils.nlog(error)}   // Callback when video cannot be loaded
                                                                            style={{ width: (nwidth - 30) / 3, height: (nwidth - 30) / 3 }} />
                                                                    ) : (
                                                                            <Image
                                                                                style={{
                                                                                    width: (nwidth - 30) / 3,
                                                                                    height: (nwidth - 30) / 3,
                                                                                }}
                                                                                resizeMode='cover'
                                                                                source={{ uri: i.uri }}
                                                                            />
                                                                        )
                                                                }
                                                                <TouchableOpacity style={{
                                                                    position: 'absolute', top: 0, right: 0, left: 0, bottom: 0, justifyContent: 'center',
                                                                    alignItems: 'center'
                                                                }} activeOpacity={0.9}
                                                                    onPress={() => this.onPressItem(i, index)}
                                                                >
                                                                    <Image
                                                                        style={{ width: 35, height: 35 }}
                                                                        resizeMode='contain'
                                                                        source={ImgComp.mediaPlayButton}
                                                                    />
                                                                </TouchableOpacity>
                                                                <TouchableHighlight
                                                                    onPress={() => { this.removeFileNew(i, index, 2) }}
                                                                    underlayColor={colors.backgroundModal}
                                                                    style={{
                                                                        padding: 4, position: 'absolute', top: 5, right: 5, backgroundColor: colors.redDelete, borderRadius: 20
                                                                    }}>
                                                                    <Image resizeMode='contain'
                                                                        source={ImgComp.icCloseWhite}
                                                                        style={{
                                                                            width: 15, height: 15, tintColor: 'white',
                                                                        }}></Image>
                                                                </TouchableHighlight>
                                                            </TouchableOpacity>
                                                        )
                                                    })}
                                                </View>
                                            ) : (null)
                                        }
                                    </View>
                                    <View style={{ padding: 10 }}>
                                        {
                                            this.state.objectType && this.state.userTag?.length > 0 && this.state.userTag?.length >= 3 ?
                                                (
                                                    <View style={{ flexDirection: 'row', }}>
                                                        <Text style={{ fontSize: reText(13) }}> {RootLang.lang.JeeSocial.voi} </Text>
                                                        <Text style={{ fontSize: reText(13), fontWeight: 'bold' }}>{this.state.userTag[0]?.Fullname}</Text>
                                                        <Text style={{ fontSize: reText(13) }}> {RootLang.lang.JeeSocial.va} </Text>
                                                        <Text numberOfLines={1} style={{ fontSize: reText(13), fontWeight: 'bold', width: Width(20) }}>{this.state.userTag.length - 1}  {' ' + RootLang.lang.JeeSocial.nguoikhac}</Text>
                                                    </View>
                                                ) : (
                                                    this.state.objectType && this.state.userTag?.length > 0 && this.state.userTag?.length <= 2 ? (
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <Text style={{ fontSize: reText(13), }}> {RootLang.lang.JeeSocial.voi} </Text>
                                                            <Text style={{ fontSize: reText(13), fontWeight: 'bold' }}>{this.state.userTag[0]?.Fullname}</Text>
                                                            {
                                                                this.state.userTag[1] ? (
                                                                    <View>
                                                                        <Text numberOfLines={1} style={{ fontSize: reText(13), fontWeight: 'bold', width: Width(22), }}>, {this.state.userTag[1]?.Fullname}</Text>
                                                                    </View>
                                                                ) : (null)
                                                            }
                                                        </View>
                                                    ) : (
                                                            null
                                                        )
                                                )
                                        }
                                    </View>
                                </View>
                            </ScrollView>
                            <View style={{ justifyContent: 'flex-end', bottom: 0 }}>
                                {this._CusTom_Bottom()}
                            </View>
                        </View>
                    </View>
                )
        }
    }


    render() {
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: colors.white, width: Width(100), }]} >
                { this._render_View()}
                < IsLoading />
            </View >
        )
    }
}

const styles = StyleSheet.create({
    textName: {
        alignSelf: "center", fontWeight: "bold", fontSize: reText(16), color: colors.white
    },
})

const mapStateToProps = state => ({
    lang: state.changeLanguage.language,
});
export default Utils.connectRedux(Modal_EditBaiDang, mapStateToProps, true)