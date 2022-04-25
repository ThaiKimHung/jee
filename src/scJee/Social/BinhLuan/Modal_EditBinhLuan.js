import React, { Component, createRef } from 'react';
import {
    Animated,
    BackHandler, Image,
    Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput,
    TouchableHighlight, TouchableOpacity, View, FlatList
} from "react-native";
import DocumentPicker from 'react-native-document-picker';
import { updateComment } from '../../../apis/JeePlatform/Api_JeeSocial/apiCommnet';
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import { RootLang } from '../../../app/data/locales';
import { nkey } from '../../../app/keys/keyStore';
import Utils from '../../../app/Utils';
import UtilsApp from '../../../app/UtilsApp';
import IsLoading from '../../../components/IsLoading';
import { Images } from '../../../images';
import { ImgComp } from '../../../images/ImagesComponent';
import { colors } from '../../../styles';
import { reText } from '../../../styles/size';
import { nstyles, Width, Height } from '../../../styles/styles';
import Video from 'react-native-video';
import ImageCus from '../../../components/NewComponents/ImageCus';
var RNFS = require('react-native-fs');

const actionSheetRef = createRef();
let start = 0
class Modal_EditBinhLuan extends Component {
    constructor(props) {
        super(props);
        this.data = Utils.ngetParam(this, 'item', '')
        this.idtoppic = Utils.ngetParam(this, 'idtoppic', '')
        this.idcmtcha = Utils.ngetParam(this, 'idcmtcha', '')
        this.cmtcon = Utils.ngetParam(this, 'cmtcon', false)
        this.callback = Utils.ngetParam(this, 'callback')
        this.cmtCha = Utils.ngetParam(this, 'cmtCha', '')
        this.refLoading = React.createRef()
        this.state = {
            opacity: new Animated.Value(0),
            msgtext: '',
            flagEmoji: false,
            numLine: 0,
            animationEmoji: new Animated.Value(0),
            showload: false,
            refreshing: false,
            listComment: [],
            _page: 1,
            id_User: '',
            item: [],
            onchange: false,
            avatar: "",
            images: [],
            dsFile: [],
            dsVideo: [],
            Tag: [],
            checkModalTag: false,
            ListMember: Utils.ngetParam(this, 'ListMember', []),
            filteredData: [],
            nameDn: '',
            chuoi: '',
            indexSplice: 0,
        }
        this.kitutruoc = ''//Lưu lại kí tự trước
        this.allPage = 1;
    }

    componentDidMount = async () => {
        this.refLoading.current.show()
        this._startAnimation(0.8)
        BackHandler.addEventListener("hardwareBackPress", this._goback);
        // Utils.nlog('data', this.data)
        let userID = await Utils.ngetStorage(nkey.UserId, '')
        let arrayImage = []
        let arrayVideo = []
        let arrayFile = []
        this.data?.Attachs.Images.map((item, index) => (
            arrayImage.push({ id: index, uri: item, type: 1 })
        ))
        this.data?.Attachs.Videos.map((item, index) => (
            arrayVideo.push({ id: index, uri: item, type: 2 })
        ))
        this.data?.Attachs.Files.map((item, index) => (
            arrayFile.push({ id: index, uri: item, type: 3 })
        ))

        let tag = []
        this.state.ListMember.map(item => {
            let findd = this.data?.Tag.find(x => x.Username == item.Username)
            if (findd) {
                tag.push(item)
            }
        })

        this.setState({
            id_User: userID,
            msgtext: this.data?.Text,
            avatar: this.data?.PersonalInfo.AvartarImgURL,
            images: arrayImage,
            dsFile: arrayFile,
            dsVideo: arrayVideo,
            Tag: tag,
            nameDn: await Utils.ngetStorage(nkey.Username, ''),
        },
            () => { this.refLoading.current.hide() }
        )
    }

    componentWillUnmount() {
        try {
            BackHandler.removeEventListener('hardwareBackPress', this._goback)
        }
        catch (error) {
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

    toggleAnimationEmoji = async () => {
        if (this.state.flagEmoji == true) {
            Animated.timing(this.state.animationEmoji, {
                toValue: Platform.OS == 'ios' ? Width(100) / 1.7 + 20 : Width(100) / 1.3 + 30,
                duration: 500
            }).start(Keyboard.dismiss());
        }
        else {
            Animated.timing(this.state.animationEmoji, {
                toValue: 0,
                duration: 500
            }).start();
        }
    }

    _HandleFocusInput = async () => {
        await this._keyboardDidShow,
            this.setState({
                flagEmoji: false,
            }, () => { this.toggleAnimationEmoji() })
    };

    _HandleEmojiBoard = () => {
        const { flagEmoji } = this.state;
        this.setState({
            flagEmoji: !flagEmoji,
        });
        Keyboard.dismiss();
    };
    _OnClick = (emoji) => {
        const { msgtext } = this.state;
        this.setState({
            msgtext: msgtext + emoji.code,
        });
        Keyboard.dismiss;
    };
    _BackSpace = () => {
        const regEx = new RegExp(
            "^[a-z0-9A-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶ" +
            "ẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợ" +
            "ụủứừỬỮỰỲỴÝỶỸửữựỳỵỷ\\s*~!@#$%^&*()+={}\\-;<>,.?/:]+$"
        );
        const { msgtext } = this.state;
        if (regEx.test(msgtext.slice(-1)) == false) {
            this.setState({
                msgtext: msgtext.slice(0, -2),
            });
        } else this.setState({ msgtext: msgtext.slice(0, -1) });
    };


    _updateComment = async () => {
        this.refLoading.current.show()
        // Utils.nlog('image', this.state.images)
        // Utils.nlog('file', this.state.dsFile)
        let anh = [];
        anh = await this._paresAnh(this.state.images)
        // Utils.nlog('anh update', anh)
        let file = [];
        file = await this._paresFile(this.state.dsFile)
        // Utils.nlog('file update', file)
        let video = []
        video = await this._paresAnh(this.state.dsVideo)
        // Utils.nlog('video', video)
        let filename = []
        let filebase64 = []
        file.map(item => {
            filename = [...filename, item.filename]
            filebase64 = [...filebase64, item.base64]
        })
        let res = '';
        let tag = []
        const retLines = this.state.msgtext.split("\n")
        retLines.forEach((retLine) => {
            const words = retLine.split(" ");
            var format = /[ !#@$%^&*()_+\-=\[\]{};':"\\|,.<>\/?\n]/;
            words.forEach((word, index) => {
                if (word.startsWith("@") && !format.test(word.substr(1))) {
                    let wordd = word.substr(1)
                    this.state.Tag.map(i => {
                        if (wordd === i.FullName.replace(/\s/g, '')) {
                            tag.push({ "Display": i.FullName, "Username": i.Username })
                        }
                    })
                }
            })
        });

        if (this.cmtcon == true) {
            let strbody = {

                'TopicCommentID': this.idtoppic,
                'CommentID': this.idcmtcha,
                'ReplyCommentID': this.data.Id,
                'Text': this.state.msgtext,
                'Username': this.data.Username,
                "Tag": tag,
                'Attachs': {
                    'Images': anh,
                    'Files': filebase64,
                    'Videos': video,
                    'FileNames': filename
                },
            }
            res = await updateComment(strbody)
        }
        else {
            let strbody = {

                'TopicCommentID': this.idtoppic,
                'CommentID': this.cmtCha ? this.cmtCha : this.data.Id,
                'ReplyCommentID': "",
                'Text': this.state.msgtext,
                'Username': this.data.Username,
                "Tag": tag,
                'Attachs': {
                    'Images': anh,
                    'Files': filebase64,
                    'Videos': video,
                    'FileNames': filename
                },
            }
            // console.log('body', strbody)
            res = await updateComment(strbody)
        }
        // Utils.nlog('res update comment =--=-=-==-=-=-=-', res)
        if (res.status == 1) {
            Keyboard.dismiss()
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.JeeSocial.capnhatthanhcong, 1)
            this._goback()
            this.callback()
            ROOTGlobal.LoadDanhSach_Comment.LoadDSCMT()
            this.refLoading.current.hide()
        } else {
            this.refLoading.current.hide()
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
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
                    let datanew = data.map(item => {
                        return { ...item, type: 2 }
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

    _paresAnh = async (list) => {
        let anhParse = []
        for (let index = 0; index < list.length; index++) {
            let item = list[index];
            if (item?.filename) {
                let downSize = 1;
                if (item?.height >= 2000 || item?.width >= 2000) {
                    downSize = 0.3;
                }
                let str64 = await Utils.parseBase64_PAHT(item.uri, item.height, item.width, downSize, item.timePlay != 0)
                anhParse = [...anhParse, str64]
            }
            else {
                let anh = await Utils.getBase64FromUrl(item.uri)
                let linkPasre = anh.split(',');
                anhParse = [...anhParse, linkPasre[linkPasre.length - 1]]
            }
        }
        return anhParse
    }

    _paresFile = async (list) => {
        let fileParse = []
        for (let index = 0; index < list.length; index++) {
            let item = list[index];
            if (item?.filename) {
                let file = {};
                file = { filename: item.filename, base64: item.strBase64 }
                fileParse = [...fileParse, file]
            }
            else {
                let mang = item?.split('/')
                let tenFile = mang[mang.length - 1]
                let filefromBase64 = await Utils.getBase64FromUrl(item)
                let linkPasre = filefromBase64.split(',');
                let file = {}
                file = { filename: tenFile, base64: linkPasre[linkPasre.length - 1] }
                fileParse = [...fileParse, file]
            }
        }
        return fileParse
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
        let mang = []
        let tenFile = ''
        if (!item.filename) {
            mang = item?.split('/')
            tenFile = mang[mang.length - 1]
        }
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
                            {item.filename ? item.filename : tenFile}</Text>
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

    onPlayVideo = (suri) => {
        Utils.goscreen(this, 'Modal_PlayMedia', { source: suri });
    }

    _renderVideos = (item, index) => {
        return (
            <TouchableOpacity
                // onPress={() => this.onPressItem(item, index)}
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

    _cancel = () => {
        Utils.showMsgBoxYesNo(this, RootLang.lang.thongbaochung.thongbao, RootLang.lang.JeeSocial.tieptuchinhsua, RootLang.lang.scchamcong.dongy, RootLang.lang.scchamcong.huy, {}
            , () => { this._goback() }
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

    render() {
        const { opacity, msgtext, animationEmoji, onchange } = this.state
        const animatedStyle = { marginBottom: animationEmoji }
        return (
            <View style={[nstyles.ncontainer, {
                flexGrow: 1,
                backgroundColor: `transparent`,
                opacity: 1,
            }]}>
                <Animated.View onTouchEnd={this._goback}
                    style={{
                        backgroundColor: colors.backgroundModal, flex: 1, opacity
                    }} />
                <View style={{ height: '70%', backgroundColor: colors.white, flexDirection: 'column', paddingBottom: 15, justifyContent: 'flex-end', }}>
                    <View style={{ flex: 1, }}>
                        <View
                            style={[{
                                paddingHorizontal: 15,
                                borderBottomColor: colors.black_20,
                                borderBottomWidth: 0.3,
                                paddingVertical: 15
                            }]} >
                            <View style={[nstyles.nrow, { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }]}>
                                <TouchableOpacity
                                    style={{ alignItems: 'center', justifyContent: 'center' }}
                                    activeOpacity={0.5}
                                    onPress={this._goback}>
                                    <Image
                                        source={Images.ImageJee.icBack}
                                        resizeMode={'cover'}
                                        style={[nstyles.nIconH16W8, { tintColor: colors.black }]}
                                    />
                                </TouchableOpacity>
                                <View
                                    style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
                                    <Text style={{
                                        fontSize: reText(15), color: colors.black, fontWeight: "bold"
                                    }}>{RootLang.lang.JeeSocial.chinhsua}</Text>
                                </View>
                            </View>
                        </View >
                        <KeyboardAvoidingView
                            keyboardVerticalOffset={Platform.select({ ios: 0, android: 500 })}
                            behavior={(Platform.OS === 'ios') ? "padding" : null}
                            style={{ flex: 1 }}>
                            <View style={{ flex: 1, padding: 10, }}>
                                <View style={[{ flexDirection: "row", }]}>
                                    <View style={{ paddingRight: 5 }}>
                                        <ImageCus
                                            style={[nstyles.nAva35, {}]}
                                            source={{ uri: this.state.avatar }}
                                            resizeMode={"cover"}
                                            defaultSourceCus={Images.icAva}
                                        />
                                    </View>
                                    <View style={{ flex: 1, paddingHorizontal: Platform.OS == 'ios' ? 10 : 0, justifyContent: "center", paddingVertical: Platform.OS == 'ios' ? 10 : 0, backgroundColor: "#f1f0f5", borderRadius: 20, }}>
                                        <TextInput
                                            ref={ref => this.inputRef = ref}
                                            style={{
                                                color: "black",
                                                fontSize: 14,

                                            }}
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
                                            underlineColorAndroid="rgba(0,0,0,0)"                                                    >
                                            {msgtext}
                                        </TextInput>
                                    </View>
                                </View>
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
                                {
                                    this.state.checkModalTag ?
                                        <View style={{
                                            width: Width(100), maxHeight: Height(25), borderTopLeftRadius: 10, borderTopRightRadius: 10,
                                            backgroundColor: "#E1E6E1", marginLeft: -10
                                        }}>
                                            <FlatList
                                                keyboardShouldPersistTaps="always"
                                                style={{}}
                                                contentContainerStyle={{ paddingTop: 5, paddingBottom: 2 }}
                                                data={this.state.filteredData && this.state.filteredData.length > 0
                                                    ? this.state.filteredData : this.state.ListMember}
                                                // data={ListMember.concat({ "FullName": "All", "Username": "All", "ID_user": -1, "InfoMemberUser": [] }).reverse()}
                                                renderItem={this._ListMemberTag}
                                                keyExtractor={(item, index) => index.toString()}
                                            />
                                        </View> :
                                        <View style={{
                                            borderColor: '#707070', justifyContent: 'center', borderBottomWidth: 0.3, borderTopWidth: 0.3, marginTop: 10
                                        }}>
                                            <View style={{ flexDirection: "row", justifyContent: 'space-between' }}>
                                                <TouchableOpacity style={{ paddingHorizontal: 20, justifyContent: "center", alignItems: 'center', paddingVertical: 10 }}
                                                    onPress={() => this._go_PickImage()} >
                                                    <Image source={Images.ImageJee.icChonAnh}
                                                        resizeMode='contain' style={nstyles.nIcon19} />
                                                </TouchableOpacity>
                                                <TouchableOpacity style={{ paddingHorizontal: 20, justifyContent: "center", alignItems: 'center', paddingVertical: 10 }}
                                                    onPress={() => this._open_VideoGallery()} >
                                                    <Image source={Images.ImageJee.icVideo}
                                                        resizeMode='contain' style={nstyles.nIcon19} />
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    onPress={() => this.pickFiles()}
                                                    style={{ paddingHorizontal: 20, justifyContent: "center", alignItems: 'center', paddingVertical: 10 }}>
                                                    <Image source={Images.ImageJee.icLink}
                                                        resizeMode='contain' style={[nstyles.nIcon19, { paddingHorizontal: 2, tintColor: '#FF3D2E' }]} />
                                                </TouchableOpacity >
                                            </View>
                                        </View>
                                }
                                <View style={{ justifyContent: 'flex-end', flexDirection: 'row', paddingVertical: 10 }}>
                                    <TouchableOpacity
                                        onPress={() => this._cancel()}
                                        style={{ paddingHorizontal: 15, paddingVertical: 10, borderRadius: 10, backgroundColor: colors.black_20, marginRight: 5 }} >
                                        <Text style={{ fontSize: reText(15), color: colors.white, fontWeight: "bold" }}>{RootLang.lang.scchamcong.huy}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => this._updateComment()}
                                        style={{ paddingHorizontal: 15, paddingVertical: 10, borderRadius: 10, backgroundColor: '#2D86FF', justifyContent: 'center', alignItems: 'center', }} >
                                        <Text style={{ fontSize: reText(15), color: colors.white, fontWeight: "bold", textAlign: 'center' }}>{RootLang.lang.JeeSocial.capnhat}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </KeyboardAvoidingView>
                    </View>
                </View>
                <IsLoading ref={this.refLoading} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    textInput: {
        margin: 2,
        paddingHorizontal: 20,
        width: '100%',
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
        paddingVertical: 15, backgroundColor: colors.white,
    }
});


const mapStateToProps = state => ({
    lang: state.changeLanguage.language,
});
export default Utils.connectRedux(Modal_EditBinhLuan, mapStateToProps, true)