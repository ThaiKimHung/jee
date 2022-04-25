import { ActionSheetCustom as ActionSheet } from '@alessiocancian/react-native-actionsheet';
import moment from 'moment';
import React, { Component, createRef } from 'react';
import {
    Animated, FlatList, Image, ImageBackground, Platform, ScrollView, Text, TextInput, TouchableOpacity, View,
    KeyboardAvoidingView, TouchableHighlight, Linking, BackHandler, StyleSheet
} from "react-native";
import DocumentPicker from 'react-native-document-picker';
import ImageCropPicker from 'react-native-image-crop-picker';
import { addBaiDang, addKhenThuong, DsGroup, getAllUser } from '../../../apis/JeePlatform/Api_JeeSocial/apiJeeSocial';
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import { RootLang } from '../../../app/data/locales';
import { nkey } from '../../../app/keys/keyStore';
import Utils from '../../../app/Utils';
import Header_TaoBaiDang from '../../../components/Header_TaoBaiDang';
import IsLoading from '../../../components/IsLoading';
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

class TaoBaiVietMoi extends Component {
    constructor(props) {
        super(props);
        this.state = {
            opacity: new Animated.Value(0),
            data: Utils.ngetParam(this, 'data', ''),
            nhom: Utils.ngetParam(this, 'nhom', ''),
            objectType: '',
            msgtext: '',
            titile_NoiDung: '',
            noiDung: '',
            Listdatafile: [],// chứa cả file ảnh và video
            images: [],// chứa ảnh
            imageBG: {
                id: 1,
                name: 'bg1',
                image: Images.ImageJee.icBG1
            },
            title: '',
            ghimLenDau: false,
            dateSukien: moment(Date.now()).format("DD/MM/YYYY"),
            timeSukien: '',
            mota: '',
            dsgroup: [],
            id_User: '',
            userTag: [],
            nameuser: '',
            avatar: '',
            dsFile: [],// chứa file
            videos: [],
            dang: true,
            checkTinnoibat: false,
            toDo: true,
            listUser: []
        }
        this.nthis = this.props.nthis;
        this.calllback = Utils.ngetParam(this, 'callback', '')
    }

    componentDidMount = async () => {
        this._startAnimation(0.8)
        BackHandler.addEventListener("hardwareBackPress", this._goback);
        this._dsGroup();
        this._loadDsUser()
        await this.setState({
            id_User: await Utils.ngetStorage(nkey.UserId, ''),
            nameuser: await Utils.ngetStorage(nkey.nameuser, ''),
            avatar: await Utils.ngetStorage(nkey.avatar, ''),
            objectType: this.state.nhom
        })
    }

    componentWillUnmount() {
        try {
            BackHandler.removeEventListener('hardwareBackPress', this._goback)
        }
        catch (error) {
        }
    }

    _loadDsUser = async () => {
        var { listUser, } = this.state
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
        this._endAnimation(0)
        Utils.goback(this, null)
        return true
    }

    _startAnimation = (value) => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: value,
                duration: 300
            }).start();
        }, 400);
    };

    _endAnimation = (value) => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: value,
                duration: 1
            }).start();
        }, 1);
    };

    ViewItem = (item) => {
        return (
            <View
                key={item.id} >
                <Text style={{
                    textAlign: "center", fontSize: sizes.sText16,
                    color: this.state.objectType.Ten_Group == item.Ten_Group ? colors.colorTabActive : 'black',
                    fontWeight: this.state.objectType.Ten_Group == item.Ten_Group ? "bold" : 'normal'
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

    _go_UserTag = (check = false) => {
        const { listUser } = this.state
        let dataNVChuyenqua = []
        listUser.map(item => {
            dataNVChuyenqua.push({ ...item, 'hoten': item.Fullname, 'id_nv': item.UserId, 'image': item.Avatar, 'tenchucdanh': item.ChucVu })
        })
        if (check == true) {
            Utils.goscreen(this, "sc_PickUser", {
                dataNV: dataNVChuyenqua, callback: this._callback_UserTag, onlyFive: true, nvCoSan: this.state.userTag
            })
        }
        else {
            Utils.goscreen(this, "sc_PickUser", {
                dataNV: dataNVChuyenqua, callback: this._callback_UserTag, nvCoSan: this.state.userTag
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

    _goBack_Dung = () => {
        if (this.calllback == '') {
            Utils.goscreen(this, 'sc_TabHomeSocial')
            ROOTGlobal.LoadDanhSachBaiDang.LoadDSBaiDang()
            ROOTGlobal.setIndexTab.setIndex(0)
        }
        else {
            this.calllback()
        }
    }

    _paresAnh = async (list, video = false) => {
        let anhParse = []
        for (let index = 0; index < list.length; index++) {
            let item = list[index];
            let downSize = 1;
            if (item?.height >= 2000 || item?.width >= 2000) {
                downSize = 0.3;
            }
            let str64 = await Utils.parseBase64_PAHT(item.uri, item.height, item.width, downSize, item.timePlay != 0)
            anhParse.push({
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
        return anhParse
    }

    _paresVideo = async (list) => {
        let anhParse = []
        for (let index = 0; index < list.length; index++) {
            let item = list[index];
            let str64 = await Utils.getBase64FromUrl(item.uri)
            // console.log('str64', str64.substring(str64.indexOf(",")).replace(',', ''))
            anhParse.push({
                "strBase64": str64.substring(str64.indexOf(",")).replace(',', ''),
                "filename": item.filename,
                "src": item.uri,
                "isAdd": false,
                "isDel": false,
                "isImagePresent": false,
                "type": "video/mp4",
                "size": 0,
            })
        }
        return anhParse
    }

    _taoBaiDang = async (loaibaidang) => {
        this.setState({
            dang: false
        })
        nthisLoading.show()
        let datachung = []
        let user = [];
        this.state.userTag.map((item) => {
            return user.push({ "userId": item.UserId, "username": item.Username, "customerID": item.CustomerID, "fullname": item.Fullname, })
        })
        let anh = [];
        anh = await this._paresAnh(this.state.images)
        datachung = datachung.concat(anh)
        this.state.dsFile.map((item) => {
            return datachung.push({
                // "id_att": 0,
                "strBase64": item.strBase64,
                "filename": item.filename,
                "src": item.uri,
                "isAdd": true,
                "isDel": true,
                "isImagePresent": true,
                "type": item.typeFile,
                "size": 0
            })
        })
        let video = []
        video = await this._paresVideo(this.state.videos)
        datachung = datachung.concat(video)

        // console.log('datachung', datachung)
        // console.log('user', user)
        let strbody = ''
        if (loaibaidang == 1) {
            strbody = JSON.stringify({
                "id_loaibaidang": loaibaidang,
                "title": this.state.title,
                "noiDung": this.state.noiDung ? this.state.noiDung : "",
                "id_Group": this.state.objectType?.ID_group ? this.state.objectType.ID_group : 0,
                "id_khenthuong": 0,
                "typepost": "",
                "timeline": moment(this.state.dateSukien, "DD/MM/YYYY").format("YYYY/MM/DD"),
                "attachment": datachung,
                "template": "",
                "tagName": user,
                'isNoiBat': this.state.checkTinnoibat,
            })
        }
        else {
            strbody = JSON.stringify({
                "id_loaibaidang": loaibaidang,
                "title": "",
                "noiDung": this.state.noiDung ? this.state.noiDung : "",
                "id_Group": this.state.objectType?.ID_group ? this.state.objectType.ID_group : 0,
                "id_khenthuong": 0,
                "typepost": "",
                "timeline": "",
                "attachment": datachung,
                "template": "",
                "tagName": user,
            })
        }

        // console.log('body', strbody)
        let res = await addBaiDang(strbody)
        // console.log('res đăng bài =--=-=-==-=-=-=-', res)
        if (res.status == 1) {
            if (this.state.checkTinnoibat) {
                ROOTGlobal.GetTinNoiBat.GetTinnoiBat()
            }
            nthisLoading.hide()
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.JeeSocial.dangbaithanhcong, 1)
            this._goBack_Dung()
        }
        else if (res.status == -1) {
            this.setState({ dang: true })
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res?.title ? res?.title : RootLang.lang.thongbaochung.loilaydulieu, 2)
            nthisLoading.hide()
        } else {
            this.setState({ dang: true })
            nthisLoading.hide()
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
        }
    }

    _taoBaiDang_KhenThuong = async (loaibaidang) => {
        this.setState({
            dang: false
        })
        nthisLoading.show()
        let user = [];
        user = this.state.userTag.map((item) => {
            return item.Fullname + ''
        })
        let dskhenthuong = [];
        this.state.userTag.map((item) => {
            return dskhenthuong.push({ "userId": item.UserId, "hoten": item.Fullname, "avatar": item.Avatar })
        })
        let strbody = {
            "id_loaibaidang": loaibaidang,
            "title": user.toString(),
            "noiDung": this.state.noiDung ? this.state.noiDung : "",
            "id_Group": this.state.objectType?.ID_group ? this.state.objectType.ID_group : 0,
            "id_khenthuong": 0,
            "typepost": "",
            "timeline": "",
            "attachment": [],
            "template": this.state.imageBG.name,
            "tagName": []
        }

        let strbody_khenThuong = JSON.stringify({
            "dsKhenThuong": dskhenthuong
        })
        // Utils.nlog('body', strbody)
        let res = await addBaiDang(JSON.stringify(strbody))
        // Utils.nlog('res đăng bài =--=-=-==-=-=-=-', res)
        if (res.status == 1) {
            let res_Kt = await addKhenThuong(strbody_khenThuong)
            // Utils.nlog('res khen thuong', res_Kt)
            if (res_Kt.status == 1) {
                nthisLoading.hide()
                UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.JeeSocial.dangbaithanhcong, 1)
                this._goBack_Dung()
            }
        } else {
            this.setState({ dang: true })
            nthisLoading.hide()
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
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
                    if (this.state.videos.length > 1) {
                        let video = this.state.videos.map(item => {
                            return item
                        })
                        video.splice(index, 1);
                        this.setState({
                            videos: video
                        })
                    } else {
                        this.setState({
                            videos: []
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

    _XoaFile = async (index) => {
        var { dsFile } = this.state
        await this.setState({
            deleteFile: this.state.deleteFile.concat(this.state.dsFile[index]),
            dsFile: dsFile.slice(0, index).concat(dsFile.slice(index + 1, dsFile.length))
        })
    }

    onPressItem = (item, index) => {
        switch (item.type) {
            case 1:
                Utils.goscreen(this, 'Modal_ViewImageListShow_PAHT', { ListImages: this.state.images, index: index });
                break;
            case 2:
                Utils.goscreen(this, 'Modal_PlayMedia', { source: item.uri });
                break;
            case 3:
                Utils.openUrl(item.uri)
                break;
            default:
                break;
        }
    }

    _renderItem_File = (item, index) => {
        return (
            <TouchableOpacity onPress={() => this.onPressItem(item, index)}
                key={index}
                style={{
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 0,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 1,
                    elevation: 5, backgroundColor: 'white',
                    padding: 0, alignItems: 'center', borderRadius: 4, marginBottom: 5, flexDirection: 'row', marginRight: 5
                }
                }>
                <View style={{ padding: 5, alignItems: 'center', justifyContent: 'center', }}>
                    <Text style={{ color: '#2D86FF' }}>{item.filename} </Text>
                </View>
                <TouchableHighlight
                    onPress={() => { this.removeFileNew(index, 3) }}
                    underlayColor={colors.backgroundModal}
                    style={{
                        padding: 4, backgroundColor: colors.redDelete, borderRadius: 20
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

    _renderItem_KhenThuong_Anh = ({ item, index }) => {
        return (
            <TouchableOpacity
                style={{ alignItems: 'center', paddingHorizontal: 5 }}>
                <View style={[{ justifyContent: 'center', alignItems: 'center' }]}>
                    {
                        item?.Avatar ?
                            <ImageCus
                                style={nstyles.nAva32}
                                source={{ uri: item?.Avatar }}
                                resizeMode={"cover"}
                                defaultSourceCus={Images.icAva}
                            /> :
                            <View style={[nstyles.nAva32, {
                                backgroundColor: this.intToRGB(this.hashCode(item.Fullname)),
                                flexDirection: "row", justifyContent: 'center', alignItems: 'center'
                            }]}>
                                <Text style={styles.textName}>{String(item.Fullname).split(" ").slice(-1).toString().slice(0, 2).toString()}</Text>
                            </View>
                    }
                </View>
            </TouchableOpacity >
        );
    }

    _renderItem_KhenThuong = ({ item, index }) => {
        return (
            <TouchableOpacity
                style={{ paddingTop: 10, paddingBottom: 10, alignItems: 'center', }}>
                <Text style={{ fontWeight: 'bold', color: this.state.imageBG.id == 1 ? colors.black : colors.white, }}>{item.Fullname + ", "}</Text>
            </TouchableOpacity >
        );
    }

    _renderItem_BackGround = ({ item, index }) => {
        return (
            <TouchableOpacity
                onPress={() => { this.setState({ imageBG: item }) }}
                style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10, }}>
                <View style={[{ borderColor: this.state.imageBG.id == item.id ? colors.colorTabActive : null, borderWidth: this.state.imageBG.id == item.id ? 3 : 0 }]}>
                    <Image source={item.image} resizeMode='cover' style={[nstyles.nIcon30, { backgroundColor: this.state.imageBG.id == item.id ? colors.colorTabActive : null }]} />
                </View>
            </TouchableOpacity >
        );
    }

    _CusTom_Bottom = (check = false) => {
        const { ListHinhAnh, ListHinhAnhDelete } = this.state
        return (
            <View style={{
                borderColor: '#707070', justifyContent: 'center', borderBottomWidth: 0.3, borderTopWidth: 0.3, paddingVertical: 15
            }}>
                <View style={[{ flexDirection: "row", marginHorizontal: 15, justifyContent: 'space-between', }]}>
                    <Text style={{ textAlign: 'center', fontSize: reText(15) }}>{RootLang.lang.JeeSocial.themvaobaiviet}</Text>
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
                                                resizeMode='contain' style={[nstyles.nIcon19, { paddingHorizontal: 2, }]} />
                                        </TouchableOpacity >
                                    </>
                                )
                            }
                            <TouchableOpacity style={{ paddingHorizontal: 20 }} onPress={() => this._go_UserTag(check)} >
                                <Image source={Images.ImageJee.icUserTag}
                                    resizeMode='contain' style={[nstyles.nIcon20, { paddingHorizontal: 2 }]} />
                            </TouchableOpacity >
                        </View>
                    </View>

                </View>
            </View>
        )
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

    _render_View = () => {
        const { objectType, images, noiDung, timeSukien, dateSukien, userTag, nameuser, avatar, title, dsFile, Listdatafile, videos, dang, checkTinnoibat } = this.state
        let item = this.state.data;
        switch (item.Id_LoaiDang) {
            case 3: // thảo luận
                return (
                    <View style={{ backgroundColor: colors.white, flex: 1 }}>
                        <Header_TaoBaiDang
                            nthis={this} title={item.TenLoaiDang}
                            textRight={noiDung && dang ? RootLang.lang.JeeSocial.dang : null}
                            styTextRight={[{ fontSize: reText(15), color: '#0E72D8' }]}
                            iconLeft={Images.ImageJee.icBack}
                            onPressLeft={this._goback}
                            // textleft={"Gắn thẻ"}
                            onPressRight={() => { this._taoBaiDang(item.Id_LoaiDang) }}
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
                                            objectType == '' && userTag.length > 0 ?
                                                (
                                                    <View style={{ flexDirection: 'row', marginRight: 10, flex: 1 }}>
                                                        <Text> {RootLang.lang.JeeSocial.voi}</Text>
                                                        <View style={{ flex: 1 }}>
                                                            <Text numberOfLines={1} style={{ fontWeight: 'bold', }}>{userTag?.length}{' ' + RootLang.lang.JeeSocial.nguoikhac}</Text>
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
                                                maxWidth: '100%',
                                                flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                                                paddingVertical: 2, backgroundColor: colors.white, borderWidth: 0.3,
                                                borderBottomColor: '#707070', borderRadius: 20
                                            }]}>
                                            <Text numberOfLines={1}
                                                style={[{ paddingHorizontal: 10, color: '#707070', textAlign: 'right', fontSize: reText(12), }]}>
                                                {objectType.Ten_Group ? RootLang.lang.JeeSocial.dangvaophong + objectType.Ten_Group : RootLang.lang.JeeSocial.dangvaophong + " ..."}</Text>
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
                                    <View style={{ paddingVertical: images.length > 0 || dsFile.length > 0 ? 10 : 0, }}>
                                        {
                                            images.length > 0 ?
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
                                            dsFile.length > 0 ? (
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
                                                                    borderColor: '#E8E8E9', borderWidth: 0.5, borderRadius: 4
                                                                }}
                                                                onPress={() => { }}
                                                            >
                                                                <Image
                                                                    style={{
                                                                        width: (nwidth - 30) / 3,
                                                                        height: (nwidth - 30) / 3, borderRadius: 4
                                                                    }}
                                                                    resizeMode='cover'
                                                                    source={{ uri: i.uri }}
                                                                />
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
                                                                    onPress={() => { this.removeFileNew(index, 2) }}
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
                                            objectType && userTag.length > 0 ?
                                                (
                                                    <View
                                                        style={{ flexDirection: 'row', flex: 1 }}>
                                                        <Text style={{}}> {RootLang.lang.JeeSocial.voi} </Text>
                                                        <Text numberOfLines={1} style={{ fontWeight: 'bold', flex: 1 }}>{userTag.length}{' ' + RootLang.lang.JeeSocial.nguoikhac}</Text>
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
                        <IsLoading />
                    </View>

                )
            case 2: //Chào mừng,Sinh nhật, Khen thưởng
                return (
                    <View style={{ backgroundColor: colors.white, flex: 1 }}>
                        <Header_TaoBaiDang
                            nthis={this} title={item.TenLoaiDang}
                            textRight={noiDung && dang ? RootLang.lang.JeeSocial.dang : null}
                            styTextRight={[{ fontSize: reText(15), color: '#0E72D8' }]}
                            iconLeft={Images.ImageJee.icBack}
                            onPressLeft={this._goback}
                            // textleft={"Gắn thẻ"}
                            onPressRight={() => { this._taoBaiDang_KhenThuong(item.Id_LoaiDang) }}
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
                                        <Text style={{ fontWeight: 'bold', fontSize: sizes.sText13 }}>{nameuser} </Text>
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
                                            <Text numberOfLines={1}
                                                style={[{ paddingHorizontal: 10, color: '#707070', textAlign: 'right', fontSize: reText(12), }]}>
                                                {objectType.Ten_Group ? RootLang.lang.JeeSocial.dangvaophong + objectType.Ten_Group : RootLang.lang.JeeSocial.dangvaophong + " ..."}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>

                            <ScrollView style={{ flex: 1 }}>
                                <ImageBackground source={this.state.imageBG.image} resizeMode='cover' style={{ height: nHeight(25), paddingBottom: 50, }}>
                                    <View style={{}}>
                                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                            {
                                                userTag.length > 0 ? (
                                                    <View style={{ justifyContent: 'center', alignItems: 'center', height: Width(20) }}>
                                                        <FlatList
                                                            showsHorizontalScrollIndicator={false}
                                                            showsVerticalScrollIndicator={false}
                                                            style={{ marginTop: 5, }}
                                                            horizontal={true}
                                                            data={userTag}
                                                            renderItem={this._renderItem_KhenThuong_Anh}
                                                            keyExtractor={(item, index) => index.toString()}
                                                        />
                                                        <FlatList
                                                            showsHorizontalScrollIndicator={false}
                                                            showsVerticalScrollIndicator={false}
                                                            style={{ marginTop: 5, maxWidth: Width(90), }}
                                                            horizontal={true}
                                                            data={userTag}
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
                                            <View style={{}}>
                                                <TextInput
                                                    style={{
                                                        color: this.state.imageBG.id == 1 ? colors.black : colors.white,
                                                        fontSize: reText(15),
                                                        paddingVertical: 5,
                                                        paddingHorizontal: 5,
                                                        maxHeight: Width(20),
                                                    }}
                                                    numberOfLines={3}
                                                    maxLength={120}
                                                    onChangeText={(text) => {
                                                        this.setState({ noiDung: text });
                                                    }}
                                                    placeholder={RootLang.lang.JeeSocial.noidungkhenthuong}
                                                    autoCorrect={false}
                                                    multiline={true}
                                                    underlineColorAndroid="rgba(0,0,0,0)" >
                                                    {noiDung}
                                                </TextInput>
                                            </View>
                                        </View>
                                    </View>
                                </ImageBackground>
                                <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                                    <Text style={{ color: colors.gray1 }}>( {noiDung.length}/120 )</Text>
                                </View>
                            </ScrollView>

                            <View style={{ bottom: 0, paddingBottom: 15 }}>
                                <FlatList
                                    showsHorizontalScrollIndicator={false}
                                    showsVerticalScrollIndicator={false}
                                    style={{ borderTopWidth: 0.3, borderColor: '#707070', paddingVertical: 5 }}
                                    horizontal={true}
                                    data={backGround}
                                    renderItem={this._renderItem_BackGround}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                                {this._CusTom_Bottom(true)}
                            </View>
                        </KeyboardAvoidingView>
                        <IsLoading />
                    </View >
                )
            case 1: // thông báo
                return (
                    <View style={{ backgroundColor: colors.white, flex: 1 }}>
                        <Header_TaoBaiDang
                            nthis={this} title={item.TenLoaiDang}
                            textRight={noiDung && dang ? RootLang.lang.JeeSocial.dang : null}
                            styTextRight={[{ fontSize: reText(15), color: '#0E72D8' }]}
                            iconLeft={Images.ImageJee.icBack}
                            onPressLeft={this._goback}
                            // textleft={"Gắn thẻ"}
                            onPressRight={() => { this._taoBaiDang(item.Id_LoaiDang) }}
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
                                            objectType == '' && userTag.length > 0 ?
                                                (
                                                    <View style={{ flexDirection: 'row', marginRight: 10, flex: 1 }}>
                                                        <Text> {RootLang.lang.JeeSocial.voi}</Text>
                                                        <View style={{ flex: 1 }}>
                                                            <Text numberOfLines={1} style={{ fontWeight: 'bold', }}>{userTag?.length}{' ' + RootLang.lang.JeeSocial.nguoikhac}</Text>
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
                                                maxWidth: '100%',
                                                flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                                                paddingVertical: 2, backgroundColor: colors.white, borderWidth: 0.3,
                                                borderBottomColor: '#707070', borderRadius: 20
                                            }]}>
                                            <Text numberOfLines={1}
                                                style={[{ paddingHorizontal: 10, color: '#707070', textAlign: 'right', fontSize: reText(12), }]}>
                                                {objectType.Ten_Group ? RootLang.lang.JeeSocial.dangvaophong + objectType.Ten_Group : RootLang.lang.JeeSocial.dangvaophong + " ..."}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>

                            <ScrollView style={{ flex: 1, }}>
                                <View style={{ paddingHorizontal: 5, }}>
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
                                        }]}> {dateSukien ? dateSukien : null}</Text>
                                    </TouchableOpacity>
                                    <View style={{ paddingVertical: Platform.OS == 'ios' ? 10 : 0, }}>
                                        <TextInput
                                            style={{
                                                color: "black",
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
                                    <View style={{ paddingVertical: Platform.OS == 'ios' ? 10 : 0, }}>
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
                                            underlineColorAndroid="rgba(0,0,0,0)"
                                        >
                                            {noiDung}
                                        </TextInput>
                                    </View>
                                    <View style={{ paddingVertical: images.length > 0 || dsFile.length > 0 ? 10 : 0, }}>
                                        {
                                            images.length > 0 ?
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
                                            dsFile.length > 0 ? (
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
                                                                <Image
                                                                    style={{
                                                                        width: (nwidth - 30) / 3,
                                                                        height: (nwidth - 30) / 3, borderRadius: 4
                                                                    }}
                                                                    resizeMode='cover'
                                                                    source={{ uri: i.uri }}
                                                                />
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
                                                                    onPress={() => { this.removeFileNew(index, 2) }}
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
                                            objectType && userTag.length > 0 ?
                                                (
                                                    <View
                                                        style={{ flexDirection: 'row', flex: 1 }}>
                                                        <Text style={{}}> {RootLang.lang.JeeSocial.voi}</Text>
                                                        <Text numberOfLines={1} style={{ fontWeight: 'bold', flex: 1 }}>{userTag.length}{' ' + RootLang.lang.JeeSocial.nguoikhac}</Text>
                                                    </View>
                                                ) : (
                                                    null
                                                )
                                        }
                                    </View>
                                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', }}
                                        onPress={() => this.setState({ checkTinnoibat: !checkTinnoibat })}>
                                        <Image source={checkTinnoibat == true ? Images.ImageJee.icTouchDaChon : Images.ImageJee.icTouchChuaChon} resizeMode='cover' style={[{ padding: 10, marginRight: 5 }]} />
                                        <Text style={{ fontSize: reText(15) }}>{RootLang.lang.JeeSocial.tinnoibat}</Text>
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>

                            <View style={{ bottom: 0, paddingBottom: 15 }}>
                                {this._CusTom_Bottom()}
                            </View>
                        </KeyboardAvoidingView>
                        <IsLoading />
                    </View>
                )
        }
    }

    _renderItem_actionuser = ({ item, index }) => {
        return (
            <TouchableOpacity style={{ backgroundColor: colors.white, marginVertical: 8, maxWidth: '90%', padding: 10 }}>
                <View style={[{ flexDirection: 'row', }]}>
                    <ImageCus
                        style={[nstyles.nAva40, {}]}
                        source={{ uri: item.Avatar }}
                        resizeMode={"cover"}
                        defaultSourceCus={Images.icAva}
                    />
                    <View style={[{ marginLeft: 12, justifyContent: 'center' }]}>
                        <Text style={{ fontWeight: 'bold', fontSize: reText(12) }}>{item.Fullname}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    render() {
        var { opacity } = this.state
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: colors.white, }]}>
                {this._render_View()}
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
export default Utils.connectRedux(TaoBaiVietMoi, mapStateToProps, true)