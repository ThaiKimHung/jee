import LottieView from 'lottie-react-native';
import moment from 'moment';
import React, { Component, createRef } from 'react';
import {
    ActivityIndicator, Animated, FlatList, Image, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text,
    TextInput, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, View
} from "react-native";
import ActionSheet from "react-native-actions-sheet";
import DocumentPicker from 'react-native-document-picker';
import { Card } from 'react-native-paper';
import { addComment, deleteComment, LoadDanhSachComment, postReactionComment, PushNotifi, GetListAccountManagemen, PushNotifiTagNameComment } from '../../../apis/JeePlatform/Api_JeeSocial/apiCommnet';
import { luu_log_comment } from '../../../apis/JeePlatform/API_JeeWork/apiCongViecCaNhan';
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import { RootLang } from '../../../app/data/locales';
import { nkey } from '../../../app/keys/keyStore';
import Utils from '../../../app/Utils';
import UtilsApp from '../../../app/UtilsApp';
import IsLoading from '../../../components/IsLoading';
import EmojiBoard from '../../../components/NewComponents/Emoji/EmojisBoard';
import FBGridImageComment from '../../../components/NewComponents/FBGridImageComment';
import ListEmptyLottie_SocialComment from '../../../components/NewComponents/ListEmptyLottie_SocialComment';
import HeaderModal from '../../../Component_old/HeaderModal';
import { Images } from '../../../images';
import { ImgComp } from '../../../images/ImagesComponent';
import { colors } from '../../../styles';
import { reText, sizes } from '../../../styles/size';
import { Height, nstyles, paddingBotX, Width } from '../../../styles/styles';
import dataComment from '../../Chat/WebSocket/dataComment';
import TextHyperComment from '../ModalSocial/TextHyperComment';
import Video from '../ComponentSocail/Video'
import ImageCus from '../../../components/NewComponents/ImageCus';
import FuncSocail from '../Functionn/FuncSocial'

const { connectionComment } = dataComment;
var RNFS = require('react-native-fs');
const actionSheetRef = createRef();
const actionSheetRef_ChonLoc = createRef();
const actionSheetRef_Pick = createRef();
let start = 0
class Modal_BinhLuan extends Component {
    constructor(props) {
        super(props);
        this.id_Baidang = this.props.topicId
        this.nthis = this.props.nthis
        this.request = this.props.request ? this.props.request : false
        this.socail = this.props.social ? this.props.social : false
        this.idnoti = this.props.idnoti ? this.props.idnoti : ''
        this.jeeWork = this.props.jeeWork ? this.props.jeeWork : false
        this.tatTextInput = this.props.tatTextInput ? this.props.tatTextInput : false
        this.onToDo = this.props.onToDo
        this.refLoading = React.createRef()
        this.kitutruoc = ''//Lưu lại kí tự trước
        this.state = {
            opacity: new Animated.Value(0),
            flagEmoji: false,
            numLine: '',
            animationEmoji: new Animated.Value(0),
            noidung_CMT: '',
            msgtext: '',
            showload: false,
            refreshing: false,
            listComment: [],
            _page: 1,
            id_User: '',
            item: [],
            images: [],
            avatar: '',
            showReact: null,
            animationReact: null,
            item_idcmt: '',
            dsFile: [],
            oldreact: '',
            empty: false,
            showChonLoc:
                { key: '2', type: 'Bình luận gần đây nhất', mieuta: "Hiển thị bình luận từ mới nhất đến cũ nhất", api: 'desc', check: false },
            dataLonHon10: '',
            scrollToBottom: false,
            fullname: '',
            nameDn: '',
            customerID: '',
            dsVideo: [],
            showReact_Chill: null,
            item_idcmt_Chill: '',
            oldreact_Chill: '',
            item_idcmt_Cha: '',
            checkModalTag: false,
            ListMember: [],
            Tag: [],
            username: '',
            filteredData: [],
            chuoi: '',
            indexSplice: 0,
        }
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
        this.dataLoc = [
            { key: '1', type: 'Tất cả bình luận', mieuta: "Hiển thị tất cả câu trả lời theo thứ tự thời gian", api: true, check: true },
            { key: '2', type: 'Bình luận gần đây nhất', mieuta: "Hiển thị bình luận từ mới nhất đến cũ nhất", api: 'desc', check: false },
            // { key: '3', type: 'Bình luận cũ nhất', mieuta: "Hiển thị bình luận từ cũ nhất đến mới nhất", api: 'asc', check: false },
        ]
        this.animatedValue = new Animated.Value(1);
        this.animatedMargin = new Animated.Value(0);
        ROOTGlobal.LoadDanhSach_Comment.LoadDSCMT = this._loadDanhSachComment
        this.reqTimer = 0;
        this.inputRef = React.createRef();
    }

    componentDidMount = async () => {
        this.refLoading.current.show()
        await this.setState({
            id_User: await Utils.ngetStorage(nkey.UserId, ''),
            avatar: await Utils.ngetStorage(nkey.avatar, ''),
            fullname: await Utils.ngetStorage(nkey.nameuser, ''),
            nameDn: await Utils.ngetStorage(nkey.Username, ''),
            customerID: await Utils.ngetStorage(nkey.customerID, ''),
        })
        this._loadDanhSachComment().then(res => {
            this._getListAccountManagemen().then(resAcc => {
                if (res == true && resAcc == true) {
                    this.refLoading.current.hide()
                }
            })
        })
        await this.KetNoiComment(this.id_Baidang).then(res => {
            if (res) {
                // Utils.nlog("Xử lý")
            }
        }).catch(e => Utils.nlog(e))
    }

    _containsObject(obj) {
        return this.state.listComment.some(item => obj === item.Id);
    }

    //Kết nối khi vào comment (Socket())
    async KetNoiComment(topicObjectID) {
        let token = await Utils.ngetStorage(nkey.access_token, '');

        //Kết nối vô Comment
        connectionComment().invoke("JoinGroup", topicObjectID, token).then(() => {
            // Utils.nlog("OK->JoinGroup-COmment")
        });
        //Nhận data khi bên kia comment
        connectionComment().on('changeComment', data => {
            const { listComment } = this.state
            let dataNew = JSON.parse(data)
            // Utils.nlog('data trả về modal bình luận', dataNew)
            if (dataNew.LstCreate?.length > 0) {
                let array = []

                dataNew?.LstCreate.map(i => {
                    if (i?.parentObjectID == this.id_Baidang) {
                        if (this.state.listComment?.length > 0) {
                            let check = ''
                            i?.LstChange.map(itemTd => {
                                let check = this._containsObject(itemTd.Id)
                                if (check == false) {
                                    array = [...this.state.listComment, itemTd]
                                    this.setState({
                                        listComment: array.map(obj => ({ ...obj, check: false }))
                                    })
                                }
                            })
                        }
                        else {
                            i?.LstChange.map(item => {
                                array = [item]
                            })
                            this.setState({
                                listComment: array.map(obj => ({ ...obj, check: false }))
                            })
                        }
                    }
                })
            }
            if (dataNew.LstEdit?.length > 0) {
                this.state.listComment.forEach((item, index) => {
                    dataNew?.LstEdit[0]?.LstChange?.some(itemTd => {
                        if (itemTd.Id == item.Id) {
                            this.state.listComment[index] = { ...itemTd }
                        }
                    });
                });
                this.setState({
                    listComment: this.state.listComment.map(obj => ({ ...obj, check: false }))
                })
            }

            if (dataNew.LstDelete?.length > 0) {
                if (dataNew?.LstDelete[0]?.parentObjectID == this.id_Baidang) {
                    this.state.listComment.map((item, index) => {
                        dataNew?.LstDelete[0].LstChange.map(itemTd => {
                            if (itemTd.Id == item.Id) {
                                this.state.listComment.splice(index, 1)
                            }
                        })
                    })
                }
                this.setState({
                    listComment: this.state.listComment.map(obj => ({ ...obj, check: false }))
                })
            }
        })

        return true;
    }

    //Khi thoát ra khỏi Room comment (Socket()).
    // async disconnectToken(topicObjectID) {
    //     let token = await Utils.ngetStorage(nkey.access_token, '');
    //     connectionComment().invoke('LeaveGroup', topicObjectID, token);
    //     return true;
    // }
    async disconnectToken(topicObjectID) {
        let token = await Utils.ngetStorage(nkey.access_token, '');
        connectionComment().invoke('LeaveGroup', topicObjectID, token).then(() => {
            // Utils.nlog("DISCN:", topicObjectID)
        });;
        return true;
    }

    _loadDanhSachComment = async (page = 1, khongdoisate = false, load = false, loadlai = false) => {
        const { listComment } = this.state
        let res = ''
        // if (this.state.showChonLoc.key === "2") {
        //     res = await LoadDanhSachComment(this.id_Baidang, false, "desc", page, 10)
        // }
        // else if (this.state.showChonLoc.key === "1") {
        //     res = await LoadDanhSachComment(this.id_Baidang, true, "desc")
        // }
        // else if (this.state.showChonLoc.key === "3") {
        //     res = await LoadDanhSachComment(this.id_Baidang, false, "asc", page, 30)
        // }
        res = await LoadDanhSachComment(this.id_Baidang, true, "asc")
        // Utils.nlog(" res _loadDanhSachComment", res)

        if (res.status == 1) {
            let tempData = listComment;
            this.allPage = res.panigator.AllPage;
            let data10 = []
            // if (page == 1) {
            //     tempData = res.data.Comments;
            // }
            // else {
            //     tempData = [...tempData, ...res.data.Comments];
            // }

            if (loadlai == true) {
                tempData = res.data.Comments;
            }
            else {

                tempData = res.data.Comments;
                if (khongdoisate != true) {
                    if (res.data.Comments.length > 10) {
                        this.setState({
                            dataLonHon10: true,
                        })
                    }
                }

            }

            await this.setState({
                listComment: tempData.map(obj => ({ ...obj, check: false })),
                _page: res.panigator.Page,
                refreshing: false,
                showload: false,
                empty: res.data?.Comments.length == 0 ? true : false,
                username: res.data.Username,
            })
        } else {
            this.setState({ refreshing: false, showload: false, empty: true })
        }
        if (load == true) { this.refLoading.current.hide() }
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

    _onRefresh = () => {
        this._loadDanhSachComment(1);
    }

    _onRefreshKhongDoiState = () => {
        this._loadDanhSachComment(1, true);
    }

    onLoadMore = async () => {
        if (this.state.showChonLoc.key != "1") {
            if (this.state._page < this.allPage) {
                this.setState({ showload: true, _page: this.state._page + 1 }, () => this._loadDanhSachComment(this.state._page));
            }
            else { }
        }
    }

    _goback = async () => {
        this._endAnimation(0)
        this.disconnectToken(this.id_Baidang)
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

    _like = async (idcmt, reacttion = "Like", oldreaction = "") => {
        this.setState({ showReact: null, })
        let strbody = {
            "TopicCommentID": this.id_Baidang,
            "CommentID": idcmt,
            "ReplyCommentID": "",
            "UserReaction": reacttion,
            "UserOldReaction": oldreaction
        }
        // Utils.nlog('body', strbody)
        // this.refLoading.current.show()
        let res = await postReactionComment(strbody)
        // Utils.nlog('res postReactionComment =--=-=-==-=-=-=-', res)
        if (res.status == 1) {
            const { listComment } = this.state
            listComment.forEach((item, index) => {
                // Utils.nlog('item', item)
                if (res.Id == item.Id) {
                    listComment[index] = { ...listComment[index], UserReaction: res.UserReaction, MostTypeReaction: res.MostTypeReaction, UserReactionColor: res.UserReactionColor, MostLengthReaction: res.MostLengthReaction }
                }
            })
            this.setState({ listComment: listComment })
        } else {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
        }
    }

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
                onPress={async () => { this._like(this.state.item_idcmt, item.type, this.state.oldreact) }}
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

    _paresAnh = async (list) => {
        let anhParse = []
        for (let index = 0; index < list.length; index++) {
            let item = list[index];
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

        const retLines = this.state.msgtext.split("\n")
        // console.log('retLines', retLines)
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

        let strbody = {
            "TopicCommentID": this.id_Baidang,
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
            if (this.jeeWork) {
                let strBody = JSON.stringify({
                    id_topic: res.Id,
                    comment: this.state.msgtext ? this.state.msgtext : 'has comment',
                    id_parent: 0,
                    object_type: 0,
                    object_id_new: this.id_Baidang
                })
                let resLuuLog = await luu_log_comment(strBody) // Này lưu lại log comment của JeeWork
            }
            if (tag.length > 0 && this.socail) {
                this._pushNotifiTagNameComment()
            }
            this.setState({
                scrollToBottom: true,
                msgtext: '',
                images: [],
                dsFile: [],
                dsVideo: [],
                Tag: [],
                checkModalTag: false
            })
            this._HandleFocusInput()
            Keyboard.dismiss()
            this._loadDanhSachComment(1, '', true)
            this.socail == true ? this._pushNoti() : null
            this.refLoading.current.hide()
        }
        else if (res.status == -1) {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res?.title ? res?.title : RootLang.lang.thongbaochung.loilaydulieu, 2)
            this.refLoading.current.hide()
        }
        else {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
            this.refLoading.current.hide()
        }
    }

    _pushNoti = async () => {
        let strbody = {
            "fullname": this.state.fullname,
            "id_BaiDang": this.idnoti,
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
            "Id_BaiDang": this.idnoti,
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

    _xoaComment = async () => {
        this.refLoading.current.show()
        actionSheetRef.current?.hide();
        Utils.showMsgBoxYesNo(this.nthis, RootLang.lang.thongbaochung.thongbao, RootLang.lang.JeeSocial.banmuonxoabinhluannay, RootLang.lang.scchamcong.dongy, RootLang.lang.scchamcong.huy,
            async () => {
                let res = await deleteComment(this.id_Baidang, this.state.item.Id);
                // Utils.nlog("res _xoaComment-------------------------", res)
                if (res.status == 1) {
                    UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.JeeSocial.xoathanhcong, 1)
                    this._onRefreshKhongDoiState()
                    this.refLoading.current.hide()
                }
                else {
                    this.refLoading.current.hide()
                    UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.JeeSocial.xoathatbai, 2)
                }
            }
        )
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
                    this.inputRef.focus()
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
                    this.inputRef.focus()
                }
                break;
            default:
                break;
        }
    }


    onPressItem = (item, index) => {
        switch (item.type) {
            case 1:
                Utils.goscreen(this.nthis, 'Modal_ViewImageListShow_PAHT', { ListImages: this.state.images, index: index });
                break;
            case 2:
                Utils.goscreen(this.nthis, 'Modal_PlayMedia', { source: encodeURI(item.uri) })
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
        Utils.goscreen(this.nthis, 'Modal_MediaPicker', options);
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
        Utils.goscreen(this.nthis, 'Modal_MediaPicker', options);
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
        Utils.goscreen(this.nthis, 'Modal_EditBinh_Luan', { nthis: this, item: this.state.item, idtoppic: this.id_Baidang, callback: this._callback, ListMember: this.state.ListMember })
    }

    _callback = async () => {
        this._loadDanhSachComment(this.state._page).then(res => {
            if (res == true) {
                this.refLoading.current.hide()
            }
        })
    }

    _goBinhLuanCon = async (item, focus = false) => {
        // await this.disconnectToken(this.id_Baidang)
        Utils.goscreen(this.nthis, 'sc_BinhLuanCon', { nthis: this.nthis, commentid: item, topicid: this.id_Baidang, focus: focus, isBinhLuanAll: true, reload: this._callback, idnoti: this.idnoti, social: this.socail })
    }

    _like_cmtChild = async (idcmtcha, idcmtchild, reacttion = "Like", oldreaction = "") => {
        const { listComment, item_idcmt_Cha } = this.state
        this.setState({ showReact: null, showReact_Chill: null })
        let strbody = {
            "TopicCommentID": this.id_Baidang,
            "CommentID": idcmtcha,
            "ReplyCommentID": idcmtchild,
            "UserReaction": reacttion,
            "UserOldReaction": oldreaction
        }
        // console.log('body', strbody)
        let res = await postReactionComment(strbody)
        // console.log('res postReactionComment =--=-=-==-=-=-=-', res)
        if (res.status == 1) {
            listComment.map((i) => {
                if (i.Id == item_idcmt_Cha) {
                    i.Replies.forEach((item, index) => {
                        if (res.Id == item.Id) {
                            i.Replies[index] = { ...i.Replies[index], UserReaction: res.UserReaction, MostTypeReaction: res.MostTypeReaction, UserReactionColor: res.UserReactionColor, MostLengthReaction: res.MostLengthReaction }
                        }
                    })
                }
            })
            this.setState({ listComment: listComment })
        } else {
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

    onPlayVideo = (suri) => {
        Utils.goscreen(this.nthis, 'Modal_PlayMedia', { source: suri });
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

    renderItemChild = ({ item, index }) => {
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
                onPress={async () => { this._like_cmtChild(this.state.item_idcmt_Cha, this.state.item_idcmt_Chill, item.type, this.state.oldreact_Chill) }}>
                <Animated.View style={[styles.reactViewChild, index == this.state.animationReact ? animatedStyle : animatedStyleDefault]}>
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

    _showMore = async (itemChoice) => {
        var { listComment } = this.state
        listComment.map((item) => {
            if (item === itemChoice) {
                item.check = !item.check
                if (item.check === true) {
                    item.check == !item.check
                } else if (item.check === false) {
                    item.check == !item.check
                }
            }
        })
        this.setState({ listComment: listComment })
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

    _HandleFocusInput = async () => {
        this.setState({
            flagEmoji: false,
        }, () => { this.toggleAnimationEmoji() })
    };

    _HandleEmojiBoard = () => {
        Keyboard.dismiss();
        const { flagEmoji } = this.state;
        this.setState({
            flagEmoji: !flagEmoji,
        }, () => { this.toggleAnimationEmoji() });

        this.request || this.jeeWork ? this.onToDo() : null
    };
    _OnClick = (emoji) => {
        Keyboard.dismiss();
        const { msgtext } = this.state;
        this.setState({
            msgtext: msgtext + emoji.code,
        });
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

    renderItem_ChonLoc = ({ item, index }) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    this.refLoading.current.show()
                    actionSheetRef_ChonLoc.current?.hide(),
                        this.setState({
                            showChonLoc: item,
                            listComment: []
                        }, () => { this._loadDanhSachComment(1, true) })
                }}
                style={{ borderBottomWidth: 0.3, borderColor: '#E4E6EB', justifyContent: 'center', alignItems: 'center', padding: 10, marginTop: 2, flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ borderWidth: 1, borderColor: item.type == this.state.showChonLoc.type ? 'green' : colors.black_20, borderRadius: 20, backgroundColor: colors.black_5, height: Height(3), width: Width(6.5), justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ borderRadius: 20, backgroundColor: item.type == this.state.showChonLoc.type ? 'green' : null, height: Height(2), width: Width(4), justifyContent: 'center', }}></View>
                </View>
                <View style={{ flex: 1, paddingLeft: 10 }}>
                    <Text style={{ fontSize: sizes.sText15, fontWeight: '600', paddingBottom: 5 }}>{item.type}</Text>
                    <Text style={{}}>{item.mieuta}</Text>
                </View>
            </TouchableOpacity>
        );
    };

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

    // formatText = (text) => {
    //     const retLines = text.split("\n");
    //     // console.log('retLines', retLines)
    //     const formattedText = [];
    //     retLines.forEach((retLine) => {
    //         const words = retLine.split(" ");
    //         // console.log('words', words)
    //         const contentLength = words.length;
    //         // console.log('contentLength', contentLength)
    //         var format = /[ !#@$%^&*()_+\-=\[\]{};':"\\|,.<>\/?\n]/;
    //         words.forEach((word, index) => {
    //             // console.log('word', word)
    //             let space = (<Text style={{ color: colors.black }}> </Text>);
    //             // console.log('word.substr(1)', word.substr(1))

    //             if (word.startsWith("@") && !format.test(word.substr(1))) {

    //                 const mention = (<Text key={index} style={{ color: colors.colorTabActive }}>{word}</Text>);
    //                 // push vào text
    //                 if (index !== contentLength - 1) {
    //                     // console.log('vào index !== contentLength - 1')
    //                     formattedText.push(mention, space);
    //                 }
    //                 else {
    //                     // console.log('vào  formattedText.push(mention)')
    //                     formattedText.push(mention);
    //                 }
    //             } else {
    //                 if (index !== contentLength - 1) {
    //                     formattedText.push(word, space);
    //                 }
    //                 else {
    //                     formattedText.push(word);
    //                 }
    //             }
    //         });
    //     });
    //     this.setState({ msgTextShow: formattedText }, () => {
    //         // console.log('msgtext', this.state.msgtext)
    //     })
    // }

    _renderItem = ({ item, index }) => {
        return (
            <TouchableWithoutFeedback style={{ backgroundColor: colors.white, flex: 1, }} onTouchEnd={this._HandleFocusInput} onPress={() => { this.setState({ showReact: null, showReact_Chill: null }), this._HandleFocusInput() }} >
                <View style={{ flex: 1, }}>
                    <View style={[{ flexDirection: 'row', justifyContent: 'space-between' }]}>
                        <View style={[{ flexDirection: 'row', flex: 1 }]}>
                            <View>
                                {item?.PersonalInfo?.AvartarImgURL ?
                                    <ImageCus
                                        style={[nstyles.nAva35, {}]}
                                        source={{ uri: item?.PersonalInfo?.AvartarImgURL }}
                                        resizeMode={"cover"}
                                        defaultSourceCus={Images.icAva}
                                    /> :
                                    <Image source={Images.icAva} resizeMode={"contain"} style={[nstyles.nAva32, {}]} />
                                }
                            </View>
                            <View style={{ flexDirection: 'column', flex: 1 }}>
                                <TouchableOpacity
                                    onPress={() => { this.setState({ showReact: null }) }}
                                    onLongPress={() => { actionSheetRef.current?.show(); this.setState({ item: item }); }}
                                    style={{ backgroundColor: '#F2F3F5', marginLeft: 8, padding: 10, borderRadius: 10, flex: 1 }}>
                                    <Text style={{ fontWeight: 'bold', }}>{item?.PersonalInfo?.FullName}</Text>
                                    <View>
                                        <TextHyperComment item={item} onPress={() => { this._showMore(item) }}></TextHyperComment>
                                    </View>

                                </TouchableOpacity>
                                {item.Attachs?.Images?.length > 0 ? (
                                    <View style={{ paddingVertical: 3 }}>
                                        <FBGridImageComment
                                            nthis={this.nthis}
                                            images={item.Attachs?.Images}
                                            imageOnPress={() => { }}
                                        />
                                    </View>
                                ) : (null)}
                                {item.Attachs?.Files?.length > 0 ? (
                                    <View style={{ paddingVertical: 3 }}>
                                        <View style={{
                                            flexWrap: 'wrap',
                                            width: '100%',
                                            flexDirection: 'row',

                                        }}>
                                            {item.Attachs?.Files?.map((itemFile, indexFile) => {
                                                let mang = itemFile.split('/')
                                                let tenFile = mang[mang.length - 1]
                                                return (
                                                    <TouchableOpacity onPress={() => Utils.openUrl(itemFile)}
                                                        key={indexFile}
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
                                                                    {tenFile}</Text>
                                                            </View>
                                                        </View>

                                                    </TouchableOpacity >
                                                )
                                            })}
                                        </View>
                                    </View>
                                ) : (null)}
                                {
                                    item.Attachs?.Videos?.length > 0 ? (
                                        <View style={{
                                            flexWrap: 'wrap',
                                            width: '100%',
                                            flexDirection: 'row',
                                        }}>
                                            { item.Attachs?.Videos.map((i, index) => {
                                                return (
                                                    <Video key={index} uri={encodeURI(i)} onpress={() => this.onPlayVideo(encodeURI(i))} > </Video>
                                                )
                                            })}
                                        </View>
                                    ) : (null)
                                }
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
                                <View style={[{ flexDirection: 'row', marginLeft: 8, paddingTop: 5, paddingBottom: 10, justifyContent: 'space-between' }]}>
                                    <View style={{ flexDirection: 'row', }}>
                                        {item.UserReaction ? ( //có tốn tại like
                                            <TouchableOpacity style={{ justifyContent: "center", alignContent: "center", paddingHorizontal: 10 }}
                                                onPress={() => this._like(item.Id, "", item.UserReaction)}
                                                onLongPress={() => { this.setState({ showReact: index, item_idcmt: item.Id, oldreact: item.UserReaction, showReact_Chill: null }) }}
                                            >
                                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                    <Text style={{ marginLeft: 5, color: item.UserReactionColor, }}>{item.UserReaction && FuncSocail.Title_Emoji_Comment(item.UserReaction)}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        ) : (
                                                <TouchableOpacity style={{ justifyContent: "center", alignContent: "center", paddingHorizontal: 10 }}
                                                    onPress={() => this._like(item.Id, "Like", "")}
                                                    onLongPress={() => { this.setState({ showReact: index, item_idcmt: item.Id, oldreact: item.UserReaction, showReact_Chill: null }) }}
                                                >
                                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                        <Text style={{ marginLeft: 5, color: colors.black, }}>{RootLang.lang.JeeSocial.like}</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            )}

                                        <TouchableOpacity
                                            onPress={() => this._goBinhLuanCon(item.Id, true)}
                                            style={[{ justifyContent: 'center', paddingLeft: 5 }]}>
                                            <Text style={{}}>{RootLang.lang.JeeSocial.traloi}</Text>
                                        </TouchableOpacity>
                                        <Text style={{ color: colors.colorTextBTGray, marginLeft: 15, fontSize: reText(13), alignSelf: 'center' }}>
                                            {UtilsApp.convertDatetime(item.DateCreated)}
                                        </Text>
                                    </View>

                                    <View style={{ flexDirection: 'row' }}>
                                        {item.MostTypeReaction.map((i, index) => {
                                            return (
                                                <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 3 }}>
                                                    <Image
                                                        source={this._icon_Emoji(i)}
                                                        resizeMode='contain' style={[nstyles.nIcon14, {}]} />
                                                </View>
                                            )
                                        })}
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={{ marginLeft: 50, }}>
                        <View>
                            {
                                item.Replies.length > 0 ? (
                                    <TouchableWithoutFeedback style={{ backgroundColor: colors.white, flex: 1, }} onTouchEnd={this._HandleFocusInput} onPress={() => { this.setState({ showReact: null, showReact_Chill: null }) }} >
                                        <View style={{ flex: 1, }}>
                                            <View style={[{ flexDirection: 'row', justifyContent: 'space-between', }]}>
                                                <View style={[{ flexDirection: 'row', flex: 1 }]}>
                                                    <View>
                                                        {item.Replies[0]?.PersonalInfo?.AvartarImgURL ?
                                                            <ImageCus
                                                                style={[nstyles.nAva32, {}]}
                                                                source={{ uri: item.Replies[0]?.PersonalInfo?.AvartarImgURL, }}
                                                                resizeMode={"cover"}
                                                                defaultSourceCus={Images.icAva}
                                                            /> :
                                                            <Image source={Images.icAva} resizeMode={"contain"} style={[nstyles.nAva32, {}]} />
                                                        }
                                                    </View>
                                                    <View style={{ flexDirection: 'column', flex: 1, }}>
                                                        <View style={{ marginLeft: 8, padding: 10, borderRadius: 10, maxWidth: Width(73), backgroundColor: '#F2F3F5' }}>
                                                            <Text style={{ fontWeight: 'bold' }}>{item.Replies[0]?.PersonalInfo.FullName + " "}</Text>
                                                            <View>
                                                                <TextHyperComment item={item.Replies[0]} onPress={() => { }}></TextHyperComment>
                                                            </View>
                                                        </View>
                                                        {this.state.showReact_Chill == index ?
                                                            <Card style={[styles.card, { position: "absolute", bottom: 30 }]}>
                                                                <FlatList
                                                                    data={this.types}
                                                                    horizontal
                                                                    renderItem={this.renderItemChild}
                                                                    keyExtractor={item => item.key}
                                                                    bounces={false}
                                                                    style={styles.list}
                                                                />
                                                            </Card>
                                                            : null}
                                                        <View style={[{ flexDirection: 'row', marginLeft: 8, paddingTop: 5, paddingBottom: 10, justifyContent: 'space-between' }]}>
                                                            <View style={{ flexDirection: 'row', }}>
                                                                {item.Replies[0]?.UserReaction ? ( //có tốn tại like
                                                                    <TouchableOpacity style={{ justifyContent: "center", alignContent: "center" }}
                                                                        onPress={() => this.setState({
                                                                            item_idcmt_Cha: item.Id
                                                                        }, () => {
                                                                            this._like_cmtChild(item.Id, item.Replies[0]?.Id, "", item.Replies[0]?.UserReaction)
                                                                        })}
                                                                        onLongPress={() => { this.setState({ showReact_Chill: index, item_idcmt_Cha: item.Id, item_idcmt_Chill: item.Replies[0]?.Id, oldreact_Chill: item.Replies[0].UserReaction, showReact: null }) }}
                                                                    >
                                                                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                                            <Text style={{ marginLeft: 5, color: item.Replies[0]?.UserReactionColor, }}>{item.Replies[0]?.UserReaction && FuncSocail.Title_Emoji_Comment(item.Replies[0]?.UserReaction)}</Text>
                                                                        </View>
                                                                    </TouchableOpacity>
                                                                ) : (
                                                                        <TouchableOpacity style={{ justifyContent: "center", alignContent: "center" }}
                                                                            // onPress={() => this._like_cmtChild(item.Id, item.Replies[0]?.Id, "Like", "")}
                                                                            onPress={() => this.setState({
                                                                                item_idcmt_Cha: item.Id
                                                                            }, () => {
                                                                                this._like_cmtChild(item.Id, item.Replies[0]?.Id, "Like", "")
                                                                            })}
                                                                            onLongPress={() => { this.setState({ showReact_Chill: index, item_idcmt_Cha: item.Id, item_idcmt_Chill: item.Replies[0]?.Id, oldreact_Chill: item.Replies[0]?.UserReaction, showReact: null }) }}
                                                                        >
                                                                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                                                <Text style={{ marginLeft: 5, color: colors.black, }}>{RootLang.lang.JeeSocial.like}</Text>
                                                                            </View>
                                                                        </TouchableOpacity>
                                                                    )}
                                                                <TouchableOpacity
                                                                    onPress={() => this._goBinhLuanCon(item.Id, true)}
                                                                    style={[{ marginLeft: 8, justifyContent: 'center' }]}>
                                                                    <Text style={{}}>{RootLang.lang.JeeSocial.traloi}</Text>
                                                                </TouchableOpacity>

                                                                <Text style={{ color: colors.colorTextBTGray, marginLeft: 10, fontSize: reText(13), alignSelf: 'center' }}>
                                                                    {UtilsApp.convertDatetime(item.Replies[0]?.DateCreated)}
                                                                </Text>
                                                            </View>
                                                            <View style={{ flexDirection: 'row', paddingRight: 15 }}>
                                                                {item.Replies[0]?.MostTypeReaction.map((i) => {
                                                                    return (
                                                                        <View>
                                                                            <Image
                                                                                source={this._icon_Emoji(i)}
                                                                                resizeMode='contain' style={[nstyles.nIcon14, {}]} />
                                                                        </View>
                                                                    )
                                                                })}
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>

                                    </TouchableWithoutFeedback >
                                ) : null
                            }
                            {item.Replies?.length >= 2 ? (
                                <TouchableOpacity
                                    onPress={() => this._goBinhLuanCon(item.Id, false)}
                                    style={{ paddingBottom: 15, }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: reText(15) }}>{RootLang.lang.JeeSocial.xemthemphanhoikhac}</Text>
                                </TouchableOpacity>
                            ) : (null)}
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback >
        );
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

    render() {
        const { opacity, msgtext, flagEmoji, numLine, animationEmoji, listComment, refreshing, showload, item, id_User, images, empty, scrollToBottom, ListMember } = this.state
        const animatedStyle = { marginBottom: animationEmoji }
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: '#E4E6EB', }]}>
                { this.tatTextInput == true ? (
                    <View style={{ flex: 1, backgroundColor: colors.white }}>
                        {
                            listComment.length > 5 ? (
                                this.state.dataLonHon10 == true ? (
                                    <TouchableOpacity style={{ flexDirection: 'row', paddingLeft: 15, paddingTop: 15, alignItems: 'center', paddingBottom: 5, justifyContent: 'space-between', paddingRight: 10 }}
                                        onPress={() => { this.setState({ dataLonHon10: false }, () => { Utils.setGlobal('dataLonHon10', this.state.dataLonHon10) }) }}>
                                        <Text style={{ fontSize: reText(15), fontWeight: '500', paddingRight: 10 }}>{RootLang.lang.JeeSocial.xemtatcabinhluan}</Text>
                                    </TouchableOpacity>
                                ) : (
                                        <TouchableOpacity style={{ flexDirection: 'row', paddingLeft: 15, paddingTop: 15, alignItems: 'center', paddingBottom: 5, justifyContent: 'space-between', paddingRight: 10 }}
                                            onPress={() => { this.setState({ dataLonHon10: true }, () => { Utils.setGlobal('dataLonHon10', this.state.dataLonHon10) }) }}>
                                            <Text style={{ fontSize: reText(15), fontWeight: '500', paddingRight: 10 }}>{RootLang.lang.JeeSocial.thugon}</Text>
                                        </TouchableOpacity>
                                    )
                            ) : (null)
                        }
                        <View style={{ flex: 1, paddingHorizontal: 10, paddingTop: 5 }}>
                            <FlatList
                                // inverted
                                ref={(ref) => { this.myFlatListRef = ref }}
                                extraData={this.state}
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                                refreshing={refreshing}
                                data={this.state.dataLonHon10 == true ? listComment.slice(-5) : listComment}
                                renderItem={this._renderItem}
                                onEndReached={() => {
                                    if (!this.onEndReachedCalledDuringMomentum) {
                                        // this.onLoadMore() 
                                        this.onEndReachedCalledDuringMomentum = true;
                                    }
                                }}
                                onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
                                onEndReachedThreshold={0.01}
                                maxToRenderPerBatch={10}
                                windowSize={7}
                                updateCellsBatchingPeriod={100}
                                onRefresh={this._onRefresh}
                                keyExtractor={(item, index) => index.toString()}
                                removeClippedSubviews={true}
                                initialNumToRender={5}
                                ListEmptyComponent={this.state.listComment?.length == 0 ? <ListEmptyLottie_SocialComment style={{ justifyContent: 'center', alignItems: 'center', }} textempty={this.state.empty == true ? this.socail ? RootLang.lang.JeeSocial.khongcobinhluannao : RootLang.lang.JeeSocial.chuacobinhluan : null} /> : null}
                                ListFooterComponent={showload ? <ActivityIndicator size='small' /> : null}
                            />
                        </View>
                    </View>

                ) : (
                        <KeyboardAvoidingView
                            keyboardVerticalOffset={this.request != true ? Platform.select({ ios: this.socail ? 80 : 120, android: 500 }) : null}
                            behavior={this.request != true ? Platform.OS === "ios" ? "padding" : null : null}
                            style={{ flex: 1 }} >
                            <View style={{ flex: 1, backgroundColor: colors.white }}>
                                {
                                    listComment.length > 5 ? (
                                        this.state.dataLonHon10 == true ? (
                                            <TouchableOpacity style={{ flexDirection: 'row', paddingLeft: 15, paddingTop: 15, alignItems: 'center', paddingBottom: 5, justifyContent: 'space-between', paddingRight: 10 }}
                                                onPress={() => {
                                                    this.setState({ dataLonHon10: false }, () => {
                                                        setTimeout(() => { this.myFlatListRef.scrollToEnd({ animated: true }) }, 1200)
                                                    })
                                                }}>
                                                <Text style={{ fontSize: reText(15), fontWeight: '500', paddingRight: 10 }}>{RootLang.lang.JeeSocial.xemtatcabinhluan}</Text>
                                            </TouchableOpacity>
                                        ) : (
                                                <TouchableOpacity style={{ flexDirection: 'row', paddingLeft: 15, paddingTop: 15, alignItems: 'center', paddingBottom: 5, justifyContent: 'space-between', paddingRight: 10 }}
                                                    onPress={() => { this.setState({ dataLonHon10: true }) }}>
                                                    <Text style={{ fontSize: reText(15), fontWeight: '500', paddingRight: 10 }}>{RootLang.lang.JeeSocial.thugon}</Text>
                                                </TouchableOpacity>
                                            )
                                    ) : (null)

                                }
                                <View style={{ flex: 1, paddingHorizontal: 10, paddingTop: 5 }}>
                                    <FlatList
                                        // inverted
                                        ref={(ref) => { this.myFlatListRef = ref }}
                                        extraData={this.state}
                                        showsHorizontalScrollIndicator={false}
                                        showsVerticalScrollIndicator={false}
                                        refreshing={refreshing}
                                        data={this.state.dataLonHon10 == true ? listComment.slice(-5) : listComment}
                                        renderItem={this._renderItem}
                                        onEndReached={() => {
                                            if (!this.onEndReachedCalledDuringMomentum) {
                                                // this.onLoadMore() 
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
                                        ListEmptyComponent={this.state.listComment?.length == 0 ? <ListEmptyLottie_SocialComment style={{ justifyContent: 'center', alignItems: 'center', }} textempty={this.state.empty == true ? this.socail ? RootLang.lang.JeeSocial.khongcobinhluannao : RootLang.lang.JeeSocial.chuacobinhluan : null} /> : null}
                                        ListFooterComponent={showload ? <ActivityIndicator size='small' /> : null}
                                        // onContentSizeChange={() => { this.myFlatListRef.scrollToEnd({ animated: true }) }}
                                        onLayout={() => { this.myFlatListRef.scrollToEnd({ animated: true }) }}
                                    />
                                </View>
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
                                                    onPress={() => { actionSheetRef_Pick.current?.show(), Keyboard.dismiss() }}
                                                    style={{ justifyContent: this.state.numLine == 17 ? 'center' : 'flex-end', }}>
                                                    <Image style={{ width: Width(6), height: Width(6), tintColor: colors.colorTabActive, marginBottom: Platform.OS == 'ios' ? 0 : 5 }} source={Images.ImageJee.icOptionChat} />
                                                </TouchableOpacity>
                                                <View style={{ justifyContent: "center", justifyContent: this.state.numLine == 17 ? 'center' : 'flex-end', marginHorizontal: 5 }}>
                                                    <ImageCus
                                                        style={nstyles.nAva32}
                                                        source={{ uri: this.state.avatar }}
                                                        resizeMode={"cover"}
                                                        defaultSourceCus={Images.icAva}
                                                    />
                                                </View>
                                                <View style={{ backgroundColor: "#f1f0f5", borderRadius: 15, paddingLeft: 5, flex: 1 }}>
                                                    <TextInput
                                                        ref={ref => this.inputRef = ref}
                                                        onTouchStart={this._HandleFocusInput}
                                                        style={{
                                                            color: "black",
                                                            fontSize: 14,
                                                            paddingVertical: Platform.OS == 'ios' ? 10 : 5,
                                                            maxHeight: Height(15),
                                                            marginHorizontal: 5,
                                                            marginTop: Platform.OS == 'ios' ? 5 : 0
                                                        }}
                                                        onContentSizeChange={e =>
                                                            this.setState({ numLine: e.nativeEvent.contentSize.height },
                                                            )
                                                        }
                                                        placeholder={RootLang.lang.JeeSocial.nhapnoidungbinhluan}
                                                        autoCorrect={false}
                                                        multiline={true}
                                                        underlineColorAndroid="rgba(0,0,0,0)"
                                                        //Code xử lý
                                                        onSelectionChange={this.selectionChangeHandler}
                                                        onKeyPress={this.handleKeyPress}
                                                        onChangeText={(text) => this.changeText(text)}

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
                            </View>
                        </KeyboardAvoidingView>
                    )}
                <ActionSheet ref={actionSheetRef}>
                    <View style={{ maxHeight: Height(50), paddingBottom: paddingBotX, }}>
                        <HeaderModal />
                        {
                            item?.PersonalInfo?.UserId == id_User ? (
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
                <IsLoading ref={this.refLoading} />
            </View >
        )
    }
}


const mapStateToProps = state => ({
    lang: state.changeLanguage.language,
});
const styles = StyleSheet.create({
    textInput: {
        margin: 2,
        paddingHorizontal: 20,
        width: '100%',
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
        paddingVertical: 15, backgroundColor: colors.white,
    },
    container: {
        height: 300,
        justifyContent: 'flex-end',
        paddingTop: 100
    },
    suggestionsRowContainer: {
        flexDirection: 'row',
    },
    userAvatarBox: {
        width: 35,
        paddingTop: 2
    },
    userIconBox: {
        height: 45,
        width: 45,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#54c19c'
    },
    usernameInitials: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 14
    },
    userDetailsBox: {
        flex: 1,
        justifyContent: 'center',
        paddingLeft: 10,
        paddingRight: 15
    },
    displayNameText: {
        fontSize: 13,
        fontWeight: '500'
    },
    usernameText: {
        fontSize: 12,
        color: 'rgba(0,0,0,0.6)'
    },
    reactView: {
        width: (Width(100) - 80) / 7,
        height: 58,
        justifyContent: 'center',
        alignItems: 'center'
    },
    reactViewChild: {
        width: (Width(100) - 80) / 7.5,
        height: 58,
        justifyContent: 'center',
        alignItems: 'center'
    },
    card: {
        borderRadius: 30
    },
    list: {
        overflow: 'visible'
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

export default Utils.connectRedux(Modal_BinhLuan, mapStateToProps, true)