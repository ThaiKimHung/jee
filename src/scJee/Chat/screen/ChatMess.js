import LottieView from 'lottie-react-native';
import React, { Component, createRef } from 'react';
import {
    ActivityIndicator, Animated, FlatList, Image, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View, Linking, TouchableWithoutFeedback, Clipboard, BackHandler
} from "react-native";
// import Clipboard from '@react-native-clipboard/clipboard';
import ActionSheet from "react-native-actions-sheet";
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import ImageCropPicker from 'react-native-image-crop-picker';
import Video from 'react-native-video';
import { DeleteConverSation, GetInforUserChatWith, GetUserReaction, Get_ListMess, PushNotifiTagName, UpdateDataUnread, UpdateDataUnreadInGroup } from '../../../apis/JeePlatform/API_JeeChat/apiJeeChat';
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import { nkey } from '../../../app/keys/keyStore';
import Utils from '../../../app/Utils';
import HeaderChat from '../../../components/HeaderChat';
import EmojiBoard from '../../../components/NewComponents/Emoji/EmojisBoard';
import HeaderModal from '../../../Component_old/HeaderModal';
import { Images } from '../../../images';
import { colors } from '../../../styles';
import { reText, sizes } from '../../../styles/size';
import { Height, nstyles, paddingBotX, Width } from '../../../styles/styles';
import { ImgComp } from '../../../images/ImagesComponent';
import { default as ActionSheetBachBongLong } from '@alessiocancian/react-native-actionsheet';
import { default as ActionSheetHoang } from '@alessiocancian/react-native-actionsheet';
import UtilsApp from '../../../app/UtilsApp';
import FastImage from 'react-native-fast-image';
import moment from 'moment'
import { store } from '../../../srcRedux/store';
import { Get_ThongBaoChat } from '../../../srcRedux/actions';
import IsLoading from '../../../components/IsLoading';
import RNUrlPreview from '../../Component/Common/RNUrlPreview'
import { Card } from 'react-native-paper';
import { RootLang } from '../../../app/data/locales';
import HTMLView from 'react-native-htmlview';
import { appConfig } from '../../../app/ConfigJeePlatform';
import { HubConnectionBuilder } from '@microsoft/signalr'
import { Message } from '../WebSocket/SendMessage';
import { SeenMess } from '../WebSocket/SeenMess';
const actionSheetRef = createRef();

class ChatMess extends Component {
    constructor(props) {
        super(props);
        this.IdGroup = Utils.ngetParam(this, 'IdGroup') //item 
        this.IdChat = Utils.ngetParam(this, 'IdChat', 0)
        this.isDanhBa = Utils.ngetParam(this, 'isDanhBa', false)// đi từ luồng danh bạ qua chat sẽ có IdGroup nên phải tạo group/ xử lý sau
        this.isCheck = Utils.ngetParam(this, 'isCheck') //Check
        this.idUser = ''
        this.Username = ''
        this.refLoading = React.createRef()
        this.date = moment().format("DD/MM/YYYY")
        this.RefInput = createRef()
        this.flatListRef = createRef()
        this.animatedValue = new Animated.Value(1);
        this.animatedMargin = new Animated.Value(0);
        this.indexChat = 0
        this.types = [
            { key: '1', type: 'Like' },
            { key: '2', type: 'Love' },
            { key: '3', type: 'Haha' },
            { key: '4', type: 'Wow' },
            { key: '5', type: 'Sad' },
            { key: '6', type: 'Care' },
            { key: '7', type: 'Angry' }
        ];
        this.start = 0
        this.kitutruoc = ''//Lưu lại kí tự trước
        this.state = {
            checkInGroup: false,
            opacity: new Animated.Value(0),
            flagEmoji: false,
            animationEmoji: new Animated.Value(0),
            Attachment: [],
            Videos: [],
            // isLoading: false,
            openView: false,
            dataMessage: [],//data tin nhắn
            AllPage: 0, //khởi tạo all Page
            Page: 1, //Khởi tạo trang 1
            msgtext: '', //Nội dung tin nhắn
            Note: '', //Ghi chú ở tin nhắn
            composing: false,
            dataComposing: {},
            animableComposing: false,
            //GetCheck
            FullName: '',
            GroupName: '',
            isGroup: false,
            avatar: '',
            isOnline: false,
            UserId: '',
            isCheckReply: false,
            nameReply: '',
            messReply: '',
            showReact: null,
            animationReact: null,
            ListMember: [],
            checkModalTag: false,
            dataTag: [],
            indextag: 0,
            TimeTyping: "",//check thời gian Typing ss,
            // emptyChat: false,
            checkLoadLocal: true,
            checkLoadMessage: false, //check đã qua load api chưa.
            indexSplice: 0,
            chuoi: '',
            filteredData: undefined,//filter của dataTag khi search

        }
    }

    async componentDidMount() {
        this.Username = await Utils.ngetStorage(nkey.Username, '')
        this.idUser = await Utils.ngetStorage(nkey.UserId, '')
        let token = await Utils.ngetStorage(nkey.access_token, '');
        await this.KetNoiRoom(this.IdGroup, token)
        await this.KetNoiPresence(token)
        await this.GetInforUserChatWith()
        await this.Get_ListMess()
        this.setState({ checkInGroup: true })
        this._backHandler = BackHandler.addEventListener('hardwareBackPress', this._backHandlerButton)
        if (this.IdChat != 0) {
            this.refLoading.current.show()
            setTimeout(() => {
                this.refLoading.current.hide()
                this.flatListRef.scrollToIndex({ index: this.indexChat, animated: true })
            }, Platform.OS == 'ios' ? 2000 : 2500)
        }
    }

    _backHandlerButton = () => {
        this._goback()
        return true
    }

    _goback = async () => {
        if (this.state.dataMessage.length == 0 && !this.state.isGroup && this.state.checkLoadMessage) {
            let res = await DeleteConverSation(this.IdGroup)
            if (res.status != 1) {
                UtilsApp.MessageShow("Thông báo", res.error.message ? res.error.message : 'Error', 2)
            }
        }
        await Utils.nsetStorage(this.IdGroup + "keychat", this.state.dataMessage) //Set store dataMesss
        this.isDanhBa ? ROOTGlobal.GetListDanhBa.GetListDB() : ROOTGlobal.GetListMessage.GetListMess() //Luồng danh bạ
        store.dispatch(Get_ThongBaoChat()) // count noti
        this.setState({ checkInGroup: false }) //check khi out group
        this.isCheck ? Utils.goback(this, null) : Utils.goscreen(this, 'tab_Mesage', { screen: 'sc_ScreenMain' })
    }

    GetInforUserChatWith = async () => {
        let res = await GetInforUserChatWith(this.IdGroup)
        if (res.status == 1) {
            this.setState({ ListMember: res.data[0].ListMember, isGroup: res.data[0].isGroup, FullName: res.data[0].FullName, GroupName: res.data[0].GroupName, avatar: res.data[0]?.InfoGroupUser[0]?.Avatar ? res.data[0].InfoGroupUser[0].Avatar : '', UserId: res.data[0].UserId })
        } else {
            this.setState({ ListMember: [], isGroup: false, FullName: '', GroupName: '', avatar: '', UserId: '' })
        }
    }

    async KetNoiRoom(idGroup, token) {
        this.hubConnection = new HubConnectionBuilder()
            .withUrl(appConfig.domainJeeChat + "hubs" + '/message?IdGroup=' + idGroup + '&token=' + token
                , {
                }).withAutomaticReconnect()
            .build()
        this.hubConnection.start().catch(err => Utils.nlog(err));
        this.hubConnection.on('ReceiveMessageThread', messages => {
        })
        ////Nhận được tin nhắn mới
        this.hubConnection.on('NewMessage', async (data) => {
            if (data[0].IdGroup == this.IdGroup) {
                this.setState({
                    dataMessage: data.concat(this.state.dataMessage)
                })
            }
            //Đang nhắn tin thì luôn là đã xem
            if (this.Username != data[0].UserName && this.state.checkInGroup) {
                this.seenMess(parseInt(this.idUser), parseInt(data[0].IdChat), this.Username, parseInt(data[0].IdGroup))
            }
            //Push notifi khi Tags mention
            // Utils.nlog("DATA:", this.state.dataTag)
            if (this.state.dataTag.length > 0) {
                let ListTagname = []
                for (let i = 0; i < this.state.dataTag.length; i++) {
                    ListTagname.push(this.state.dataTag[i].id)
                }
                let res = await PushNotifiTagName(this.state.GroupName, "", data[0].IdChat, this.IdGroup, data[0].Content_mess, ListTagname)
                if (res) {
                    this.setState({ dataTag: [], indextag: 0 })
                }
            }

        })
        this.hubConnection.on('HidenMessage', data => {
            this._HideMess(data)
        })

        this.hubConnection.on('Composing', data => {
            let dateNew = moment().format("DD/MM/YYYY HH:mm:ss")
            if (this.state.TimeTyping == "") {
                var resss = 5
            } else {
                var duration = moment(moment(dateNew, "DD/MM/YYYY HH:mm:ss").diff(moment(this.state.TimeTyping, "DD/MM/YYYY HH:mm:ss")))
                var resss = duration.seconds()
            }
            if (data.UserId != this.idUser && data.IdGroup == this.IdGroup && resss && resss > 3) {
                this.setState({
                    composing: true,
                    dataComposing: data,
                    animableComposing: true,
                    TimeTyping: dateNew
                }, () => {
                    setTimeout(() => {
                        this.setState({ composing: false })
                    }, 3000, () => {
                        setTimeout(() => {
                            this.setState({ animableComposing: false, })
                        }, 2000);
                    });

                })

            }
        })

        this.hubConnection.on('ReactionMessage', data => {
            // Utils.nlog("ReactionMessage", data)
            let array = this.state.dataMessage.map(item => {
                if (item.IdChat == data.data[0].IdChat) {
                    return { ...item, ReactionChat: data.data[0].ReactionChat, ReactionUser: data.data[0].ReactionUser }
                }
                return { ...item }
            })
            this.setState({ dataMessage: array })
        })

        this.hubConnection.on('SeenMessage', data => {
            // Utils.nlog("SeenMessage", data)
            let dataNew = []
            this.state.dataMessage.map(item => {
                if (item.IdChat == data.data[0].id_chat) {
                    dataNew.push({ ...item, Seen: data.data })
                } else {
                    dataNew.push(item)
                }
            })
            this.setState({ dataMessage: dataNew })
        })
        this.hubConnection.on('LastTimeMessage', data => {
            // Utils.nlog("LastTimeMessage", data)
        })
        return true;
    }

    urlify = (text) => {
        var urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.replace(urlRegex, function (url) {
            return '<a href="' + url + '">' + url + '</a>';
        })
    }

    send = async (IdGroup, Content_mess, UserName, Note, IsDelAll = false, IsVideoFile = false, Attachment = [], isInsertMember = false) => {
        var item = new Message()
        item.Content_mess = Content_mess; // Nội dung chat 
        item.UserName = UserName; // UserName
        item.IdGroup = IdGroup; // Group 
        item.Note = Note; /// note
        item.IsDelAll = IsDelAll; /// xoá
        item.IsVideoFile = IsVideoFile; /// Có phải video ko 
        item.Attachment = Attachment; // base 64 
        isInsertMember ? item.isInsertMember = true : null
        let token = await Utils.ngetStorage(nkey.access_token, '');
        let access_token = "Bearer " + token
        return this.hubConnection.invoke('SendMessage', access_token, item, parseInt(IdGroup)).then(Utils.nlog("Thành công SendMessage")).catch((e) => { Utils.nlog("=-=-=", e) })
    }

    seenMess = async (UserId, id_chat, username, IdGroup) => {
        let itemSeen = new SeenMess()
        let CustomerId = await Utils.ngetStorage(nkey.IDKH_DPS, 0)
        let Fullname = await Utils.ngetStorage(nkey.nameuser, '')
        let avatar = await Utils.ngetStorage(nkey.avatar, '')
        itemSeen.Avatar = avatar;
        itemSeen.CreatedBy = UserId;
        itemSeen.CustomerId = parseInt(CustomerId)
        itemSeen.Fullname = Fullname;
        itemSeen.id_chat = id_chat;
        itemSeen.username = username;
        itemSeen.IdGroup = IdGroup;
        return this.hubConnection.invoke('SeenMessage', itemSeen).catch((e) => { Utils.nlog("Error", e) })
    }

    sendReaction = async (IdGroup, idchat, type) => {
        let token = await Utils.ngetStorage(nkey.access_token, '');
        let typeNew = parseInt(type)
        // let access_token = "Bearer " + token
        return this.hubConnection.invoke('ReactionMessage', token, parseInt(IdGroup), idchat, typeNew).then(Utils.nlog("Thành công ReactionMessage")).catch((e) => { Utils.nlog("=-=-=ReactionMessage", e) })
    }

    HidenMessage = async (IdChat, IdGroup) => {
        let token = await Utils.ngetStorage(nkey.access_token, '');
        let access_token = "Bearer " + token
        return this.hubConnection.invoke('DeleteMessage', access_token, IdChat, parseInt(IdGroup)).then(Utils.nlog("==-=Thành công ")).catch(error => Utils.nlog(error));
    }

    Composing = async (IdGroup) => {
        let token = await Utils.ngetStorage(nkey.access_token, '');
        let access_token = "Bearer " + token
        return this.hubConnection.invoke('ComposingMessage', access_token, parseInt(IdGroup)).catch(error => Utils.nlog(error));
    }

    _like = async (IdGroup, idChat, type) => {
        this.setState({ showReact: null })
        this.sendReaction(IdGroup, idChat, type)
    }


    Get_ListMess = async () => {
        if (this.state.checkLoadLocal) {
            let dataLocal = await Utils.ngetStorage(this.IdGroup + "keychat", [])
            if (dataLocal.length == 0) {
                this.refLoading.current.show()
            }
            this.setState({ dataMessage: dataLocal })
        }
        const { Page } = this.state
        let res = await Get_ListMess(this.IdGroup, "", "", Page, this.IdChat == 0 ? 30 : 200)
        if (res.status == 1) {
            let data = []
            if (Page == 1) {
                data = res.data.reverse()
            } else {
                data = this.state.dataMessage.concat(res.data.reverse())
            }

            if (Page == 1 && res.data[0].UserName != this.Username) {
                this.seenMess(parseInt(this.idUser), parseInt(res.data[0].IdChat), this.Username, parseInt(res.data[0].IdGroup))
            }
            if (this.IdChat != 0) {
                data.map((item, index) => {
                    if (item.IdChat == this.IdChat) {
                        this.indexChat = index
                        return;
                    }
                })
            }
            this.refLoading.current.hide()
            this.setState({ dataMessage: data, AllPage: res.page.AllPage, checkLoadLocal: false })
        }
        else {
            this.refLoading.current.hide()
            if (res.error.code == "101")
                this.setState({ checkLoadLocal: false, checkLoadMessage: true })
        }
        return true
    }

    async KetNoiPresence(token) {
        this.Presence = new HubConnectionBuilder()
            .withUrl(appConfig.domainJeeChat + "hubs" + '/presence?token=' + token, {})
            .withAutomaticReconnect()
            .build()
        this.Presence.start().catch(err => Utils.nlog(err));

        this.Presence.on('UserIsOnline', username => {
            // Utils.nlog('UserIsOnline', username)
            if (username.UserId == this.state.UserId)
                this.setState({ isOnline: true })
        })

        this.Presence.on('UserIsOffline', username => {
            // Utils.nlog('UserIsOffline', username)
            if (username.UserId == this.state.UserId)
                this.setState({ isOnline: false })
        })
        //xét danh sách online
        this.Presence.on('GetOnlineUsers', data => {
            data.map(item => {
                if (item.UserId == this.state.UserId) {
                    this.setState({ isOnline: true })
                    return
                }
            })
        })
        return true;
    }

    //UserId
    loadMore = () => {
        if (this.state.Page < this.state.AllPage) {
            this.setState({ Page: this.state.Page + 1 }, () => this.Get_ListMess())
        }
    }

    toggleAnimationEmoji = async () => {
        if (this.state.flagEmoji == true) {
            Animated.spring(this.state.animationEmoji, {
                toValue: Platform.OS == 'ios' ? Width(100) / 1.7 + 20 : Width(100) / 1.3,
                duration: 500
            }).start(Keyboard.dismiss())
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
        }, () => {
            if (this.state.msgtext.length > 0) {
                this.Composing(this.IdGroup)
            }
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
            }, () => {
                if (this.state.msgtext.length > 0) {
                    this.Composing(this.IdGroup)
                }
            });
        } else this.setState({ msgtext: msgtext.slice(0, -1) }, () => {
            if (this.state.msgtext.length > 0) {
                this.Composing(this.IdGroup)
            }
        });
    };

    _open_ImageGallery = async () => {
        await ImageCropPicker.openPicker({
            multiple: true,
            waitAnimationEnd: false,
            sortOrder: 'asc',
            includeExif: true,
            includeBase64: true,
            mediaType: 'photo',
        })
            .then((images) => {
                // actionSheetRef_Image.current?.hide();
                var imageMap = images.map((i) => {

                    return {
                        filename: Platform.OS == 'ios' ? i.filename : i.path.substring(i.path.lastIndexOf('/') + 1),
                        type: i.mime,
                        size: i.size,
                        strBase64: i.data
                    };
                })
                actionSheetRef.current?.hide()
                this.setState({ Attachment: this.state.Attachment.concat(imageMap) }, () => this._sendMessage())
            }, async () => {
            }).catch((e) => Utils.nlog(e));
    }

    _open_VideoGallery = async () => {
        await ImageCropPicker.openPicker({
            multiple: true,
            waitAnimationEnd: false,
            sortOrder: 'asc',
            includeExif: true,
            includeBase64: true,
            mediaType: 'video',
        })
            .then(async (Video) => {
                // actionSheetRef_Image.current?.hide();
                var VideoMap = await Promise.all(Video.map(async (i) => {
                    const realPath = i.path
                    const strBase64 = await RNFS.readFile(realPath, "base64")
                    return {
                        filename: Platform.OS == 'ios' ? i.filename : i.path.substring(i.path.lastIndexOf('/') + 1),
                        type: i.mime,
                        size: i.size,
                        strBase64: strBase64
                    };
                }))
                actionSheetRef.current?.hide()
                this.setState({ Attachment: this.state.Attachment.concat(VideoMap) }, () => this._sendMessage())

            }, async () => {
            }).catch((e) => Utils.nlog(e));
    }

    copyToClipboard = (string) => {
        let str = String(string).replace('<p>', '').replace('</p>', '')
        Clipboard.setString(str)
    }

    handlePress = (indexAt) => {
        let IdChat = this.ActionSheet.state.IdChat
        let Content_mess = this.ActionSheet.state.Content_mess
        if (indexAt == 0) {
            this.HidenMessage(IdChat, this.IdGroup)
        }
        if (indexAt == 1) {
            if (Content_mess == undefined || Content_mess == "<p></p>" || String(Content_mess).includes("<span") || String(Content_mess).includes("<a")) { //<span  <a
                UtilsApp.MessageShow(RootLang.lang.JeeChat.thongbao, "Chỉ cho phép sao chép văn bản", 4)
                return
            }
            this.copyToClipboard(Content_mess)
            UtilsApp.MessageShow(RootLang.lang.JeeChat.thongbao, RootLang.lang.JeeChat.dasaochep, 1)
        }
        else null


    }

    handlePressF = async (indexAt) => {
        let Content_mess = this.ActionSheetF.state.Content_mess
        let Fullname = this.ActionSheetF.state.Fullname
        let Attachment = this.ActionSheetF.state.Attachment || []
        let Attachment_File = this.ActionSheetF.state.Attachment_File || []
        let Videos = this.ActionSheetF.state.Videos || []
        let File = []

        Attachment.length > 0 ? Attachment.map(async (item) => {
            Image.getSize(item.hinhanh, async (width, height) => {
                File.push({
                    filename: item.filename,
                    type: item.type,
                    size: item.size,
                    strBase64: await Utils.parseBase64_PAHT(item.hinhanh, height, width, 1)
                })
            });

        }) : null
        Attachment_File.length > 0 ? Attachment_File.map(async (item) => {
            let baseCus = ''
            baseCus = await Utils.getBase64FromUrl(item.Link ? item.Link : item.path)
            File.push({
                filename: item.filename,
                type: item.type,
                size: item.size,
                strBase64: baseCus.substring(baseCus.indexOf(",")).replace(',', '')
            })
        }) : null

        Videos.length > 0 ? Videos.map(async (item) => {
            let baseCus = ''
            baseCus = await Utils.getBase64FromUrl(item.path)
            File.push({
                filename: item.filename,
                type: item.type,
                size: item.size,
                strBase64: baseCus.substring(baseCus.indexOf(",")).replace(',', '')
            })
        }) : null

        if (indexAt == 0) {
            this.setState({ isCheckReply: true, nameReply: Fullname, messReply: Content_mess })
            this.RefInput.focus()
        }
        if (indexAt == 1) {
            if (Content_mess == undefined || Content_mess == "<p></p>" || String(Content_mess).includes("<span") || String(Content_mess).includes("<a")) { //<span  <a
                UtilsApp.MessageShow(RootLang.lang.JeeChat.thongbao, "Chỉ cho phép sao chép văn bản", 4)
                return
            }
            this.copyToClipboard(Content_mess)
            UtilsApp.MessageShow(RootLang.lang.JeeChat.thongbao, RootLang.lang.JeeChat.dasaochep, 1)
        }
        if (indexAt == 2) {
            Utils.goscreen(this, 'Modal_ForWard', {
                Content_mess: Content_mess,
                Attachment,
                Attachment_File,
                Videos,
                callbackForWard: (item) => {
                    item.map(val => {
                        this._sendMessage(Content_mess, val.IdGroup, File, true)
                    })
                    UtilsApp.MessageShow(RootLang.lang.JeeChat.thongbao, "Chuyển tiếp tin nhắn thành công")

                }
            })
        }
        else null

    }

    _HideMess = async (data) => {
        var { dataMessage } = this.state
        dataMessage.map((item) => {
            if (item.IdChat === data) {
                item.IsHidenAll = !item.IsHidenAll
            }
        })
        this.setState({ dataMessage: dataMessage })
    }

    pickFiles = async () => {
        try {
            const results = await DocumentPicker.pickMultiple({
                type: [DocumentPicker.types.allFiles],
            });
            var mang = await Promise.all(results.map(async (i) => {
                const split = i.fileCopyUri.split('/');
                const name = split.pop();
                const inbox = split.pop();
                const realPath = Platform.OS == 'android' ? i.uri : `file://${RNFS.TemporaryDirectoryPath}/${inbox}/${decodeURI(name)}`;
                const strBase64 = await RNFS.readFile(realPath, "base64")
                return {
                    filename: i.name,
                    type: i.type,
                    size: i.size,
                    strBase64: strBase64
                }
            }))
            actionSheetRef.current?.hide()
            this.setState({ Attachment: mang }, () => { this._sendMessage() })
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
            }
        }
    }

    UpdateDataUnreadInGroup = async (IdGroup, Username, read = "read") => {
        let res = await UpdateDataUnreadInGroup(IdGroup, Username, read)
        if (res.status == 1) {
            // Utils.nlog("THANH CONG read group:", res, IdGroup, Username)
        }
        else {
            Utils.nlog("Lỗi UpdateDataUnreadInGroup")
        }
    }

    UpdateDataUnread = async (IdGroup, UserId, read = "read") => {
        let res = await UpdateDataUnread(IdGroup, UserId, read)
        if (res.status == 1) {
            // Utils.nlog("THANH CONG read user:", res, IdGroup, UserId)
        } else {
            Utils.nlog("Lỗi UpdateDataUnread")
        }
    }

    setDuration(data) {
        this.setState({ totalLength: Math.floor(data.duration) });
    }

    setTime(data) {
        this.setState({ currentPosition: Math.floor(data.currentTime) });
    }

    Reactions = (index) => {
        this.state.showReact == null ? this.setState({ showReact: index }) : this.setState({ showReact: null })
    }

    renderItemReaction = ({ item, index }, idChat, IdGroup) => {
        return (
            <TouchableWithoutFeedback key={index} onPress={() => { this._like(IdGroup, idChat, item.key) }}>
                <Animated.View style={{ width: Width(13), height: 58, justifyContent: 'center', alignItems: 'center' }}>
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

    getReactionJson = type => {
        switch (type) {
            case 'Like':
                return require('../../Social/Home/LottieEmotion/like.json');
            case 'Love':
                return require('../../Social/Home/LottieEmotion/love.json');
            case 'Haha':
                return require('../../Social/Home/LottieEmotion/haha.json');
            case 'Wow':
                return require('../../Social/Home/LottieEmotion/wow.json');
            case 'Sad':
                return require('../../Social/Home/LottieEmotion/sad.json');
            case 'Care':
                return require('../../Social/Home/LottieEmotion/care.json');
            case 'Angry':
                return require('../../Social/Home/LottieEmotion/angry.json');
        }
    };

    _showMemberReaction = async (ReactionChat, idchat) => {
        let array = []
        for (let i = 0; i < ReactionChat.length; i++) {
            let res = await GetUserReaction(idchat, ReactionChat[i].ID_like)
            array = array.concat(res.data)
        }
        Utils.goscreen(this, 'Modal_ComponentSelectCom',
            {
                callback: () => { },
                AllThaoTac: array,
                ViewItem: this._ViewItem
            })

    }

    _ViewItem = (item) => {
        return (
            <View key={item.CreatedBy} style={{ flexDirection: 'row' }}>
                <Image source={{ uri: item.linkicon }} style={{ width: Width(4), height: Width(4), marginRight: 15, alignSelf: 'center' }} />
                <Image source={item.user[0].Avatar ? { uri: item.user[0].Avatar } : Images.icAva} style={{ width: Width(7), height: Width(7), borderRadius: 999 }} />
                <Text style={{ fontSize: reText(14), alignSelf: 'center', marginLeft: 5 }}>{item.user[0].Fullname}</Text>
            </View>
        )
    }

    _renderItem = ({ item, index }) => {
        let tong = 0
        item.ReactionChat ? item.ReactionChat.map(item => {
            tong += item.tong
        }) : null
        let { isGroup } = this.state
        let time = UtilsApp.convertDatetimeChat(item.CreatedDate, "HH:mm")
        let date = UtilsApp.convertDatetimeChat(item.CreatedDate, "DD/MM/YYYY")
        let dateTop = index < this.state.dataMessage.length - 1 ? UtilsApp.convertDatetimeChat(this.state.dataMessage[index + 1].CreatedDate, "DD/MM/YYYY") : null
        let seenMess = item.Seen.length > 0 ? true : false
        return (
            <TouchableWithoutFeedback key={index} onPress={() => this.setState({ showReact: null })} >
                <View>
                    {
                        dateTop == date ? null :
                            <View style={styles.ViewTime}>
                                {this.date == date ?
                                    <Text style={styles.dateTime}>Hôm nay, {moment(date, 'DD/MM/YYYY').format('DD/MM')}</Text> :
                                    <Text style={styles.dateTime}>{moment(date, 'DD/MM/YYYY').format('ddd, DD/MM/YYYY')}</Text>}
                            </View>
                    }
                    {/* //Khi thông báo ai vừa xoá hoặc thêm vào Group */}
                    {item.Note != "" && (item.IsDelAll || item.isInsertMember) ?
                        <View style={styles.ViewNote}>
                            <Text style={styles.TextNote}>{moment(date, 'DD/MM/YYYY').format('ddd, DD/MM/YYYY')}</Text>
                            <Text style={styles.TextNoteChild}>{item.InfoUser[0].ID_user == this.idUser ? RootLang.lang.JeeChat.ban : item.InfoUser[0].Fullname}
                                <Text style={styles.FontNote}> {item.Content_mess} </Text>{item.Note}</Text>
                        </View>
                        :
                        //rời nhóm
                        item.Note == "" && item.Content_mess == "" && item.Attachment_File.length == 0 && item.Attachment.length == 0 && item.isFile == false ?
                            <View style={styles.ViewNote}>
                                <Text style={styles.TextNote}>{moment(date, 'DD/MM/YYYY').format('ddd, DD/MM/YYYY')}</Text>
                                <Text style={styles.TextNoteChild}>{item.InfoUser[0].ID_user == this.idUser ? RootLang.lang.JeeChat.ban : item.InfoUser[0].Fullname}
                                    <Text style={styles.FontNote}> {RootLang.lang.JeeChat.daroinhom}</Text></Text>
                            </View> : null
                    }
                    {item.Note != "" && (item.IsDelAll || item.isInsertMember) ? null :
                        <>
                            {item.UserName == this.Username && item.IsHidenAll == false ? //true - chat của bạn và hiện
                                <>
                                    {/* Chứa view bên ngừoi chat và action chat */}
                                    {(item.Content_mess != "<p></p>" && item.Content_mess != "" && item.Content_mess != "<p><p></p></p>") || item.Attachment.length > 0 || item.Attachment_File.length > 0 || item.Videos.length ?
                                        <>
                                            <TouchableOpacity

                                                onLongPress={() => { this.ActionSheet.setState({ IdChat: item.IdChat, Content_mess: item.Content_mess }, () => { this.ActionSheet.show() }) }}
                                                style={styles.ViewChatMe}>
                                                {item.Attachment.length > 0 ? //Hình ảnh
                                                    <View style={{ flexDirection: 'row', }}>
                                                        {item.Attachment.map((val, index) => this._renderImage(val, index, item.Attachment.length, item.Attachment, 1))}
                                                    </View> : null}
                                                {item.Attachment_File.length > 0 ? //File
                                                    <View style={styles.marGin}>
                                                        {item.Attachment_File.map((val, index) => this._renderFile(val, index, item.Attachment_File.length, 1, item.IdChat))}
                                                    </View> : null}

                                                {item.Videos.length > 0 ? //Video
                                                    <View style={styles.marGinRow}>
                                                        {item.Videos.map((val, index) => this._renderVideo(val, index, item.Videos.length, 1, item.IdChat))}
                                                    </View> : null}

                                                {item.Content_mess != "<p></p>" && item.Content_mess != "" && item.Content_mess != "<p><p></p></p>" ? //Tin nhắn
                                                    <View style={styles.marGin} >
                                                        {item.Content_mess && Utils.isUrlCus(item.Content_mess) != "" ? <RNUrlPreview text={item.Content_mess} /> : null}
                                                        {item.Note ?
                                                            <View style={styles.ViewChatMeNote}>
                                                                <Image source={Images.ImageJee.icReply} style={styles.ImgChatMeNote} />
                                                                <HTMLView
                                                                    value={`<div>${item.Note}</div>`}
                                                                    stylesheet={{
                                                                        div: styles.HTMLView,
                                                                        a: styles.FontA,
                                                                        p: styles.HTMLView,
                                                                        span: styles.FontSpan
                                                                    }}
                                                                />
                                                            </View>
                                                            : null}
                                                        <HTMLView
                                                            value={`<div>${item.Content_mess}</div>`}
                                                            stylesheet={{
                                                                div: styles.HTMLView,
                                                                a: styles.FontA,
                                                                p: styles.HTMLView,
                                                                span: styles.FontSpan
                                                            }}
                                                        />
                                                    </View> : null}
                                                <View style={styles.Time}>
                                                    <Text style={styles.TextTime}>{time}</Text>
                                                </View>
                                            </TouchableOpacity>
                                            {item.ReactionChat.length > 0 ?
                                                <View style={styles.ReactMe}>
                                                    <TouchableOpacity onPress={() => this._showMemberReaction(item.ReactionChat, item.IdChat)} style={styles.TouReactMe}>
                                                        {item.ReactionChat.map((item, index) => {
                                                            return (
                                                                <View style={{ marginRight: 1 }}>
                                                                    <Image source={{ uri: item.icon }} style={{ width: Width(3.5), height: Width(3.5) }} />
                                                                </View>
                                                            )
                                                        })}
                                                        <Text style={styles.TongMe}>{tong}</Text>
                                                    </TouchableOpacity>
                                                </View> : null}
                                        </> : null}
                                    {/* Đã xem */}
                                    {index == 0 ? seenMess ?
                                        <View style={{ alignSelf: 'flex-end', flexDirection: 'row' }}>
                                            {item.Seen.map(item => {
                                                return (
                                                    <View style={styles.ViewSeen}>
                                                        <Image source={item.Avatar ? { uri: item.Avatar } : Images.icAva} style={styles.ImgSeen} />
                                                    </View>
                                                )
                                            })}
                                        </View>
                                        :
                                        <View style={styles.ViewUserSeen}>
                                            <Image source={Images.ImageJee.icDoubleSeen} style={styles.AvaUserSeen} />
                                            <Text style={styles.TextSeen}>{'Đã nhận'}</Text>
                                        </View> : null}
                                </>
                                :
                                item.UserName == this.Username && item.IsHidenAll == true
                                    ?
                                    <View style={styles.ViewHide}>
                                        <View >
                                            <Text style={{ color: colors.white, fontSize: reText(16) }}>{RootLang.lang.JeeChat.dathuhoi}</Text>
                                        </View>
                                        <View style={styles.Time}>
                                            <Text style={styles.TextTimeWhite}>{time}</Text>
                                        </View>
                                    </View>
                                    :
                                    item.UserName != this.Username && item.IsHidenAll == false
                                        ?
                                        // Phần này của khách chát
                                        <>
                                            {/* Tin nhắn */}
                                            {(item.Content_mess != "<p></p>" && item.Content_mess != "" && item.Content_mess != "<p><p></p></p>") || item.Attachment.length > 0 || item.Attachment_File.length > 0 || item.Videos.length > 0 ?
                                                <>
                                                    <View style={styles.ChatYour}>
                                                        <View style={styles.ChatYourChild}>
                                                            {item?.InfoUser[0]?.Avatar ?
                                                                <FastImage source={{ uri: item.InfoUser[0]?.Avatar }} style={styles.AvatarYour} />
                                                                : <Image source={Images.icAva} style={styles.AvatarYour} />}
                                                            <View>
                                                                {/* Này là hiện tên phía trên -chỉ group mới cần */}
                                                                {isGroup ? <Text style={styles.NameYour}>{item.InfoUser[0]?.Fullname?.split(' ').slice(-1).join(' ')}</Text> : null}
                                                                <TouchableOpacity
                                                                    onLongPress={() => { this.ActionSheetF.setState({ Attachment: item.Attachment, Attachment_File: item.Attachment_File, Videos: item.Videos, IdChat: item.IdChat, Content_mess: item.Content_mess, Fullname: item.InfoUser[0]?.Fullname }, () => { this.ActionSheetF.show() }) }}
                                                                    style={styles.TouYour}>
                                                                    {item.Note ?
                                                                        <View style={styles.ViewNoteYour}>
                                                                            <Image source={Images.ImageJee.icReply} style={styles.ImgChatMeNote} />
                                                                            <HTMLView value={`<div>${item.Note}</div>`}
                                                                                stylesheet={{
                                                                                    div: styles.HTMLView,
                                                                                    a: styles.FontA,
                                                                                    p: styles.HTMLView,
                                                                                    span: styles.FontSpan
                                                                                }}
                                                                            />
                                                                        </View>
                                                                        : null}
                                                                    {item.Attachment.length > 0 ? //Dạng hình ảnh
                                                                        <View style={{ flexDirection: 'row' }}>
                                                                            {item.Attachment.map((val, index) => this._renderImage(val, index, item.Attachment.length, item.Attachment, 2, item.Content_mess, item.InfoUser[0]?.Fullname, item.Attachment, item.Attachment_File, item.Videos))}
                                                                        </View>
                                                                        : null}
                                                                    {item.Attachment_File.length > 0 ? //Dạng file
                                                                        <View style={styles.marGin} >
                                                                            {item.Attachment_File.map((val, index) => this._renderFile(val, index, item.Attachment_File.length, 2, item.IdChat, item.Content_mess, item.InfoUser[0]?.Fullname, item.Attachment, item.Attachment_File, item.Videos))}
                                                                        </View> : null}
                                                                    {item.Videos.length > 0 ?  //Dạng video
                                                                        <View style={styles.marGinRow}>
                                                                            {item.Videos.map((val, index) => this._renderVideo(val, index, item.Videos.length, 2, item.IdChat, item.Content_mess, item.InfoUser[0]?.Fullname, item.Attachment, item.Attachment_File, item.Videos))}
                                                                        </View> : null}

                                                                    {item.Content_mess != "<p></p>" && item.Content_mess != "" && item.Content_mess != "<p><p></p></p>" ? //Tin nhắn
                                                                        <View style={{ marginTop: 5, marginBottom: -5 }}>
                                                                            <HTMLView value={`<div>${item.Content_mess}</div>`}
                                                                                stylesheet={{
                                                                                    div: styles.HTMLView,
                                                                                    a: styles.FontA,
                                                                                    p: styles.HTMLView,
                                                                                    span: styles.FontSpan
                                                                                }}
                                                                            /></View> : null}

                                                                    {/* </Hyperlink> */}
                                                                    <View style={styles.ViewT}>
                                                                        <Text style={styles.TextT}>{time}</Text>
                                                                    </View>
                                                                </TouchableOpacity>
                                                                {item.ReactionChat.length > 0 ?
                                                                    <TouchableOpacity onPress={() => this._showMemberReaction(item.ReactionChat, item.IdChat)} style={styles.TouReaction}>
                                                                        <View style={styles.ViewReaction}>
                                                                            {item.ReactionChat.map((item, index) => {
                                                                                return (
                                                                                    <View style={{ marginRight: 1 }}>
                                                                                        <Image source={{ uri: item.icon }} style={styles.sizeReaction} />
                                                                                    </View>
                                                                                )
                                                                            })}
                                                                            <Text style={styles.Tong}>{tong}</Text>
                                                                        </View>
                                                                    </TouchableOpacity> : null}
                                                            </View>
                                                        </View>
                                                        <TouchableOpacity onPress={() => this.Reactions(index)} style={styles.ViewMatCuoi}>
                                                            <Image source={Images.ImageJee.icSmile} style={styles.MatCuoi} />
                                                        </TouchableOpacity>
                                                    </View>
                                                    {this.state.showReact == index ?
                                                        <Card style={[{ borderRadius: 30 }]}>
                                                            <FlatList
                                                                data={this.types}
                                                                horizontal
                                                                renderItem={(val) => this.renderItemReaction(val, item.IdChat, item.IdGroup)}
                                                                keyExtractor={item => item.key.toString()}
                                                                bounces={false}
                                                                style={{ overflow: 'visible' }}
                                                            />
                                                        </Card> : null}
                                                </> : null}
                                        </>
                                        :
                                        <View style={styles.ViewTH}>
                                            {item?.InfoUser[0]?.Avatar ?
                                                <FastImage source={{ uri: item.InfoUser[0]?.Avatar }} style={styles.Ava} />
                                                : <Image source={Images.icAva} style={styles.Ava} />}
                                            <View>
                                                {/* Này là hiện tên phía trên -chỉ group mới cần */}
                                                {isGroup ? <Text style={styles.NameUserGroup}>{item.InfoUser[0]?.Fullname?.split(' ').slice(-1).join(' ')}</Text> : null}
                                                <TouchableOpacity style={styles.ViewNameG}>
                                                    <Text style={styles.TextThuHoi}>{RootLang.lang.JeeChat.dathuhoi}</Text>
                                                    <View style={styles.ViewThuHoi}>
                                                        <Text style={styles.TimeThuHoi}>{time}</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                            }
                        </>}
                </View>
            </ TouchableWithoutFeedback >
        )
    }

    _renderImage = (item, index, length, arrIamge = [], type, Content_mess, Fullname, Attachment, Attachment_File, Videos) => {
        var arrImageUp3 = arrIamge.length > 2 ? arrIamge.slice(2) : arrIamge
        return (
            index < 2 ?
                <TouchableOpacity key={index}
                    onLongPress={type == 1 ? () => { this.ActionSheet.setState({ IdChat: item.id_chat }, () => { this.ActionSheet.show() }) }
                        :
                        () => { this.ActionSheetF.setState({ Attachment: Attachment, Attachment_File: Attachment_File, Videos: Videos, IdChat: item.id_chat, Content_mess: Content_mess, Fullname: Fullname }, () => { this.ActionSheetF.show() }) }
                    }
                    onPress={() => { UtilsApp.showImageZoomViewerChat(this, arrIamge) }} key={index} style={styles.TouImage}>
                    <FastImage source={{ uri: item.hinhanh }} style={styles.sizeImage} resizeMode={'cover'} />
                </TouchableOpacity> :
                index == 2 ?
                    <TouchableOpacity key={index}
                        onLongPress={type == 1 ? () => { this.ActionSheet.setState({ IdChat: item.id_chat }, () => { this.ActionSheet.show() }) }
                            :
                            () => { this.ActionSheetF.setState({ Attachment: Attachment, Attachment_File: Attachment_File, Videos: Videos, IdChat: item.id_chat, Content_mess: Content_mess, Fullname: Fullname }, () => { this.ActionSheetF.show() }) }
                        }
                        onPress={() => { UtilsApp.showImageZoomViewerChat(this, arrImageUp3) }} style={styles.TouImage}>
                        <View style={styles.sizeImage}>
                            <FastImage source={{ uri: item.hinhanh }} style={styles.sizeImage} resizeMode={'cover'} />
                        </View>
                        <View style={styles.CountImage}>
                            <Text style={styles.TextCountImage}>+{length - 2}</Text>
                        </View>
                    </TouchableOpacity>
                    : null
        )
    }

    _renderFile = (item, index, length, type = 1, idChat, Content_mess, Fullname, Attachment, Attachment_File, Videos) => {
        return (
            <TouchableOpacity
                onLongPress={type == 1 ?
                    () => { this.ActionSheet.setState({ IdChat: idChat }, () => { this.ActionSheet.show() }) }
                    :
                    () => { this.ActionSheetF.setState({ Attachment: Attachment, Attachment_File: Attachment_File, Videos: Videos, IdChat: item.idChat, Content_mess: Content_mess, Fullname: Fullname }, () => { this.ActionSheetF.show() }) }
                }
                key={index} onPress={() => Utils.openUrl(item.Link)} style={{ flexDirection: 'row', width: Width(65), marginTop: index == 0 ? 0 : 7, }}>
                <View style={styles.ViewFile}>
                    <Image source={UtilsApp._returnImageFile(item.Link)} style={styles.SizeIconFile} />
                </View>
                <Text numberOfLines={1} style={styles.NameFile}>{item.filename}</Text>
            </TouchableOpacity>
        )

    }

    _renderVideo = (item, index, length, type = 1, idChat, Content_mess, Fullname, Attachment, Attachment_File, Videos) => {
        // var duoiFile = String(item.filename).split('.').slice(-1).toString()
        return (
            /* {duoiFile == 'mp4' || duoiFile == 'MP4' || duoiFile == 'MOV' ? */
            <TouchableOpacity key={index}
                style={{ borderRadius: 10, marginLeft: 3 }}
                onPress={() => { Utils.goscreen(this, 'Modal_PlayMedia', { source: item.Link ? item.Link : encodeURI(item.path) }) }}
                onLongPress={
                    type == 1 ?
                        () => { this.ActionSheet.setState({ IdChat: idChat }, () => { this.ActionSheet.show() }) }
                        :
                        () => { this.ActionSheetF.setState({ Attachment: Attachment, Attachment_File: Attachment_File, Videos: Videos, IdChat: item.idChat, Content_mess: Content_mess, Fullname: Fullname }, () => { this.ActionSheetF.show() }) }
                }
            >
                <Video
                    source={{ uri: item.Link ? item.Link : encodeURI(item.path) }} // Can be a URL or a local file.
                    resizeMode="cover"           // Fill the whole screen at aspect ratio.
                    paused={true}
                    onError={(error) => Utils.nlog(error)}   // Callback when video cannot be loaded
                    style={styles.SizeVideo} />
                <Image style={styles.SizePlay} source={ImgComp.icPlay} />
            </TouchableOpacity>
        )

    }

    changeText = (text) => {
        let dem = 0
        let check = false //Kiểm tra đúng vị trí @, do 1 câu nhiều @
        let checkAndroid = true //do android chưa fix được nên luôn để bằng true / xử lý thêm sau
        if (this.state.indexSplice == 0) {
            check = true
        }
        const retLines = text.split("\n");
        retLines.forEach((retLine) => {
            const words = retLine.split(" ");
            var format = /[ !#@$%^&*()_+\-=\[\]{};':"\\|,.<>\/?\n]/;
            words.forEach((word, index) => {
                dem = dem + word.length + 1
                if (word.startsWith("@") && !format.test(word.substr(1)) && (Platform.OS == 'ios' ? check : checkAndroid)) {
                    //text có @ bật modal
                    this.setState({ msgtext: text, chuoi: word.substr(1) }, () => {
                        if (this.state.msgtext.length > 0) {
                            this.Composing(this.IdGroup)
                        }
                    }
                    )
                    // hiện tại msgTextShow đang là string
                    let searchText = word.substr(1)
                    let filteredData = this.state.ListMember.filter((item) =>
                        Utils.removeAccents(item['Fullname'])
                            .toUpperCase()
                            .includes(Utils.removeAccents(searchText.toUpperCase())),
                    );
                    this.setState({ filteredData: filteredData });
                } else {
                    this.setState({ msgtext: text, }, () => {
                        if (this.state.msgtext.length > 0) {
                            this.Composing(this.IdGroup)
                        }
                    }
                    )
                }
                if (dem == this.state.indexSplice) { //Xét vị trí @ đúng cụm
                    check = true
                } else {
                    check = false
                }
            });
        });
    }

    _handleTag = async (item) => {
        // await Keyboard.dismiss
        let { indexSplice } = this.state
        let str = ''
        let index = this.state.indextag
        let id = item.Username
        let name = item.Fullname
        let tagcustom = `<span class="mention" data-index=${index} data-denotation-char="" data-id=${id} data-value=${name}><span contenteditable="false"><span class="ql-mention-denotation-char"></span>${name}</span></span>`
        let data = this.state.dataTag.concat({ name: `@${name}`, tag: tagcustom, id: id })


        let lengthChuoi = this.state.chuoi.length
        let textDau = this.state.msgtext.substring(0, indexSplice - 1)
        let textCuoi = this.state.msgtext.substring(indexSplice + 1, this.state.msgtext.length)
        str = (textDau ? textDau + ' @' : textDau + '@') + name + textCuoi.substring(lengthChuoi, textCuoi.length)

        this.setState({ checkModalTag: false, msgtext: str + " ", indextag: index + 1, dataTag: data, chuoi: '' })
    }

    _sendMessage = async (msgtext = this.state.msgtext, IdGroup = this.IdGroup, Attachment = this.state.Attachment, checkForward = false) => {
        let { nameReply, messReply, dataTag } = this.state;
        let Note = ""
        let mgs = checkForward ? this.urlify(msgtext) : `<p>${this.urlify(msgtext)}</p>`
        if (dataTag.length > 0) {
            for (let i = 0; i < dataTag.length; i++) {
                mgs = mgs.replace(dataTag[i].name, dataTag[i].tag)
                // ListTagname.push(dataTag[i].id)
            }
        }
        if (this.state.isCheckReply) //nếu là Reply
        {
            Note = nameReply + ':' + messReply
            this.setState({ isCheckReply: false })
            this.send(parseInt(IdGroup), mgs, this.Username, Note, false, false, Attachment)
        }
        else {
            this.send(parseInt(IdGroup), mgs, this.Username, Note, false, false, Attachment)
        }

        this.setState({
            msgtext: "",
            Attachment: [],
            chuoi: '',
            checkModalTag: false,
            indextag: 0
        })
        this.flatListRef.scrollToOffset({ animated: true, offset: 0 })
        // Keyboard.dismiss() // vì có nhiều họ gởi họ không đóng bàn phím 
        this.state.isGroup ? this.UpdateDataUnreadInGroup(this.IdGroup, this.Username, "read") : this.UpdateDataUnread(this.IdGroup, this.state.UserId, "unread")
    }

    _ListMemberTag = ({ item, index }) => {
        return (
            item.Username != this.Username ?
                < TouchableOpacity onPress={() => this._handleTag(item)
                } style={{ flexDirection: "row", paddingHorizontal: 10, marginTop: 5 }}>
                    {item.Username == 'All' ?
                        <View style={{ width: Width(9), height: Width(9), marginRight: 5 }}>
                            <Image source={Images.ImageJee.icMentions} style={{ width: Width(9), height: Width(9), tintColor: colors.greenTab }} />
                        </View>
                        :
                        <View style={{ width: Width(9), height: Width(9), marginRight: 5 }}>
                            <Image source={item.InfoMemberUser[0]?.Avatar ? { uri: item.InfoMemberUser[0].Avatar } : Images.icAva} style={{ width: Width(9), height: Width(9), borderRadius: 9999, }} />
                        </View>}
                    <View style={{ width: Width(85), justifyContent: "center" }}>
                        <Text numberOfLines={1} style={{ fontSize: reText(18), }}>{item.Username == 'All' ? 'Nhắc cả nhóm @All' : item.Fullname}</Text>
                        {/* <View style={{ height: 0.5, backgroundColor: "#99E378", width: '100%', marginTop: 10 }} /> */}
                    </View>
                </TouchableOpacity > : null
        )
    }

    renderListEmpty = () => {
        return (
            <View style={{ flex: 1, marginTop: "50%", alignItems: 'center' }}>
                <Image source={Images.icListEmpty} style={{ width: sizes.nImgSize200, height: sizes.nImgSize200 }} resizeMode={'cover'} />
                <Text style={{ fontSize: sizes.sText16, color: colors.brownGreyTwo }}>{'Chưa có tin nhắn'}</Text>
            </View>
        )
    }

    selectionChangeHandler = (e) => {
        this.start = e.nativeEvent.selection.start
    };


    handleKeyPress = ({ nativeEvent: { key: keyValue } }) => {
        if (this.state.isGroup) {
            if (keyValue === '@') {
                this.setState({ checkModalTag: true, indexSplice: this.start })
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

        }
        this.kitutruoc = keyValue

    }

    render() {
        const { opacity, msgtext, dataMessage, Page, AllPage, loadMess, animationEmoji,
            isOnline, FullName, GroupName, isGroup, avatar, ListMember } = this.state
        const animatedStyle = { marginBottom: animationEmoji }
        const { composing, dataComposing, animableComposing, filteredData } = this.state
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: `transparent`, justifyContent: 'flex-end', opacity: 1, }]}>

                <Animated.View onTouchEnd={this._goback} style={{
                    position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
                    backgroundColor: colors.backgroundModal, alignItems: 'flex-end',
                    opacity
                }} />
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : null}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 5 : 0}
                    style={{ backgroundColor: colors.white, flex: 1, lexDirection: 'column', }}
                >
                    <HeaderChat
                        nthis={this}
                        checkTextOn={isGroup ? null : isOnline ? true : false}
                        avatar={isGroup ? false : avatar ? avatar : false}
                        title={isGroup ? GroupName : FullName ? FullName : FullName}
                        iconRight={Images.ImageJee.icBaCham}
                        iconLeft={Images.ImageJee.icArrowNext}
                        onPressLeft={this._goback}
                        onPressRight={() => {
                            Utils.goscreen(this, 'ModalEditGroup', { IdGroup: this.IdGroup, isGroup: isGroup })
                        }}
                        onPressMain={() => {
                            Utils.goscreen(this, 'ModalEditGroup', { IdGroup: this.IdGroup, isGroup: isGroup })
                        }}
                        styBorder={{ shadowOffset: { width: 1, height: 1 }, shadowRadius: 2, shadowOpacity: 0.4, shadowColor: 'gray', elevation: 5, }}
                        isNhom={isGroup}
                        checkOn={!isGroup && isOnline ? true : false}
                        onPressCall={() => alert("Chức năng call đang phát triển")}
                    />
                    <View style={{ flex: 1, justifyContent: "space-between", paddingBottom: 15 }}>
                        <View style={{ flex: 1, paddingHorizontal: 10, paddingTop: 10 }} >
                            <FlatList
                                style={{
                                    flex: 1,
                                    paddingHorizontal: 5,
                                    backgroundColor: 'white', paddingTop: 5
                                }}
                                onScroll={() => {
                                    Keyboard.dismiss()
                                    this._hideEmoji()
                                }}
                                onTouchStart={() => { this._hideEmoji() }}
                                ref={(ref) => this.flatListRef = ref}
                                renderItem={this._renderItem}
                                data={dataMessage}
                                inverted={true}
                                keyExtractor={(item, index) => index.toString()}
                                // onEndReached={this.loadMore}
                                onEndReached={() => {
                                    if (!this.onEndReachedCalledDuringMomentum) {
                                        this.loadMore()
                                        this.onEndReachedCalledDuringMomentum = true;
                                    }
                                }}
                                onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
                                onEndReachedThreshold={0.1}
                                removeClippedSubviews={true} // Unmount components when outside of window 
                                initialNumToRender={20} // Reduce initial render amount
                                maxToRenderPerBatch={20} // Reduce number in each render batch
                                updateCellsBatchingPeriod={100} // Increase time between renders
                                windowSize={7} // Reduce the window size
                                ListFooterComponent={
                                    <>{Page < AllPage ? <ActivityIndicator size="small" /> : null}</>
                                }
                            // ListEmptyComponent={emptyChat ? this.renderListEmpty : null}
                            />
                            {this.state.isCheckReply ?
                                <View style={{ width: Width(95), backgroundColor: colors.colorChat, flexDirection: 'row', borderRadius: 10 }}>
                                    <View style={{ width: Width(85), padding: 10 }}>
                                        <Text style={{ fontSize: reText(14), color: colors.black }}>{RootLang.lang.JeeChat.dangtraloi}  <Text style={{ fontSize: reText(14), fontWeight: 'bold' }}>{this.state.nameReply}</Text></Text>
                                        <HTMLView value={`<div>${this.state.messReply}</div>`}
                                            stylesheet={{
                                                div: styles.HTMLView,
                                                a: styles.FontA,
                                                p: styles.HTMLView,
                                                span: styles.FontSpan
                                            }}
                                        />
                                        {/* <Text style={{ fontSize: reText(12), color: colors.white }}> {this.state.messReply}</Text> */}
                                    </View>
                                    <TouchableOpacity onPress={() => this.setState({ isCheckReply: false })} style={{ width: Width(10), justifyContent: 'center', alignItems: 'center' }}>
                                        <Image source={Images.ImageJee.icDelete} style={{ width: Width(4), height: Width(4) }} />
                                    </TouchableOpacity>
                                </View>
                                : null}
                        </View>

                        {/* đang soạn tin nhắn */}
                        <View style={{ height: 17, width: Width(100) }}>
                            {animableComposing && composing && dataComposing.UserId != this.idUser && (<View style={{ flexDirection: "row" }}>
                                <Text style={{ marginLeft: 20, color: colors.black_50, fontSize: reText(12) }}>
                                    {`${dataComposing.Name} ${RootLang.lang.JeeChat.dangnhaptinnhan}`}
                                </Text>
                                <LottieView
                                    style={{ height: Width(5) }} source={require('../../../images/lottieJee/typing')}
                                    autoPlay
                                    speed={1.5}
                                    loop />
                            </View>)}
                        </View>

                        <View style={{ justifyContent: 'flex-end', bottom: 0, paddingHorizontal: 5 }}>
                            {this.state.checkModalTag && isGroup ?
                                <View style={{ width: Width(100), maxHeight: Height(25), borderTopLeftRadius: 10, borderTopRightRadius: 10, backgroundColor: colors.white, }}>
                                    <FlatList
                                        showsVerticalScrollIndicator={true}
                                        keyboardShouldPersistTaps="always"
                                        style={{}}
                                        contentContainerStyle={{ paddingTop: 5, paddingBottom: 2 }}
                                        // data={ListMember.concat({ "Fullname": "@All", "Username": "All", "ID_user": -1, "InfoMemberUser": [] }).reverse()}

                                        data={filteredData == undefined ? ListMember.concat({ "Fullname": "@All", "Username": "All", "ID_user": -1, "InfoMemberUser": [] }).reverse() :
                                            (filteredData.length == 0 ? filteredData : filteredData.concat({ "Fullname": "@All", "Username": "All", "ID_user": -1, "InfoMemberUser": [] }).reverse())
                                        }
                                        renderItem={this._ListMemberTag}
                                        keyExtractor={(item, index) => index.toString()}
                                    />
                                </View> : null}
                            <View style={[{ flexDirection: "row", justifyContent: 'space-between' }]}>
                                <View style={{ flexDirection: "row", paddingTop: 5, flex: 1 }}>
                                    <TouchableOpacity
                                        onPress={() => { actionSheetRef.current?.show() }}
                                        style={{ justifyContent: 'flex-end', }}>
                                        <Image style={{ width: Width(6), height: Width(6), tintColor: colors.colorTabActive, marginBottom: Platform.OS == 'ios' ? 0 : 5 }} source={Images.ImageJee.icOptionChat} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ justifyContent: 'flex-end', marginHorizontal: 10 }}
                                        onPress={() => { this._open_ImageGallery() }}>
                                        <Image source={Images.ImageJee.icPictureChat} style={{ width: Width(6), height: Width(6), tintColor: colors.colorTabActive, marginBottom: Platform.OS == 'ios' ? 0 : 5 }} />
                                    </TouchableOpacity >
                                    <View style={{ backgroundColor: "#f1f0f5", borderRadius: 15, paddingLeft: 5, flex: 1 }}>
                                        <TextInput
                                            ref={ref => this.RefInput = ref}
                                            onTouchStart={this._HandleFocusInput}
                                            style={{
                                                color: "black",
                                                fontSize: 14,
                                                paddingVertical: Platform.OS == 'ios' ? 10 : 5,
                                                marginHorizontal: 5,
                                                marginTop: Platform.OS == 'ios' ? 5 : 0
                                            }}
                                            placeholder={RootLang.lang.JeeChat.nhapnoidungtinnhan}
                                            autoCorrect={false}
                                            multiline={true}
                                            underlineColorAndroid="rgba(0,0,0,0)"
                                            //Xử lý
                                            onSelectionChange={this.selectionChangeHandler}
                                            onKeyPress={this.handleKeyPress}
                                            onChangeText={(text) => this.changeText(text)}
                                        >
                                            {msgtext}
                                        </TextInput>
                                    </View>
                                    <View style={{ flexDirection: "row", alignItems: 'flex-end' }}>
                                        <TouchableOpacity onPress={() => { this._HandleEmojiBoard() }} style={{ width: Width(6), alignSelf: 'flex-end', marginHorizontal: 10, marginBottom: Platform.OS == 'ios' ? 0 : 5 }} >
                                            <Image source={Images.ImageJee.icSmileChat}
                                                resizeMode='contain' style={{ width: Width(6), height: Width(6), tintColor: colors.colorTabActive }} />
                                        </TouchableOpacity >
                                        {msgtext ?
                                            <TouchableOpacity style={{ width: Width(8), height: Width(8) }}
                                                onPress={() => this._sendMessage()}
                                            >
                                                <Image source={Images.ImageJee.icSendChat}
                                                    resizeMode='contain' style={{ width: Width(7), height: Width(7), tintColor: colors.colorTabActive, marginRight: 5, marginBottom: Platform.OS == 'ios' ? 0 : 5 }} />
                                            </TouchableOpacity>
                                            :
                                            <TouchableOpacity style={{ width: Width(8), height: Width(8) }}
                                                onPress={() => {
                                                    this.setState({ msgtext: `👍` }, () => {
                                                        this._sendMessage()
                                                    })
                                                }}
                                            >
                                                <Image source={Images.ImageJee.icLikeChat}
                                                    resizeMode='contain' style={{ width: Width(7), height: Width(7), tintColor: colors.colorTabActive, marginRight: 5, marginBottom: Platform.OS == 'ios' ? 0 : 5 }} />
                                            </TouchableOpacity >}
                                        {/* <TouchableOpacity style={{}} >
                                            <Image source={Images.ImageJee.icLink}
                                                resizeMode='contain' style={{ width: Width(6), height: Width(6) }} />
                                        </TouchableOpacity > */}
                                    </View>
                                </View>
                            </View >
                        </View >

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
                        <IsLoading />
                    </View >
                </KeyboardAvoidingView >
                <View style={{ height: Platform.OS == 'android' ? 0 : 20, width: Width(100), backgroundColor: colors.white }} />
                <ActionSheet ref={actionSheetRef}>
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
                <ActionSheetBachBongLong
                    ref={o => this.ActionSheet = o}
                    title={RootLang.lang.JeeChat.banmuon}
                    // options={['Xoá tin nhắn', 'Ẩn tin nhắn', 'Sao chép', 'Huỷ']}
                    options={[RootLang.lang.JeeChat.thuhoitinnhan, RootLang.lang.JeeChat.saochep, RootLang.lang.JeeChat.huy]}
                    cancelButtonIndex={2}
                    destructiveButtonIndex={0}
                    onPress={this.handlePress}
                />
                <ActionSheetHoang
                    ref={o => this.ActionSheetF = o}
                    title={RootLang.lang.JeeChat.banmuon}
                    options={[RootLang.lang.JeeChat.traloi, RootLang.lang.JeeChat.saochep, RootLang.lang.JeeChat.chuyentiep, RootLang.lang.JeeChat.huy]}
                    cancelButtonIndex={3}
                    onPress={this.handlePressF}
                />
            </View >
        )
    }
}

const mapStateToProps = state => ({
    lang: state.changeLanguage.language,
});
const styles = StyleSheet.create({
    textInput: { margin: 2, paddingHorizontal: 20, width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 15, backgroundColor: colors.white, },
    container: { height: 300, justifyContent: 'flex-end', paddingTop: 100 },
    suggestionsRowContainer: { flexDirection: 'row', },
    userAvatarBox: { width: 35, paddingTop: 2 },
    userIconBox: { height: 45, width: 45, alignItems: 'center', justifyContent: 'center', backgroundColor: '#54c19c' },
    usernameInitials: { color: '#fff', fontWeight: '800', fontSize: 14 },
    userDetailsBox: { flex: 1, justifyContent: 'center', paddingLeft: 10, paddingRight: 15 },
    displayNameText: { fontSize: 13, fontWeight: '500' },
    usernameText: { fontSize: 12, color: 'rgba(0,0,0,0.6)' },
    actiocnSheet: { paddingBottom: paddingBotX, },
    actionSheet_con: { borderBottomWidth: 0.3, borderColor: '#E4E6EB', justifyContent: 'center', padding: 10, },
    ViewTime: { alignSelf: 'center', marginVertical: 12 },
    dateTime: { color: colors.black_60, fontSize: reText(12) },
    ViewNote: { alignSelf: 'center', marginBottom: 10, marginTop: 10 },
    TextNote: { color: colors.black_60, fontSize: reText(12), alignSelf: 'center', marginBottom: 5 },
    TextNoteChild: { fontWeight: 'bold', fontSize: reText(12), textAlign: 'center' },
    ViewChatMe: {
        backgroundColor: colors.black_10, alignSelf: 'flex-end', paddingHorizontal: 10, borderTopRightRadius: 10, borderTopLeftRadius: 10, borderBottomLeftRadius: 10,
        paddingTop: 8, maxWidth: Width(75), marginTop: 5
    },
    ViewChatMeNote: { backgroundColor: colors.colorChat, padding: 5, borderRadius: 5, flexDirection: 'row', marginBottom: 5, maxWidth: Width(70), paddingRight: 20 },
    ImgChatMeNote: { width: Width(3), height: Width(3), marginRight: 5, tintColor: colors.black },
    Time: { paddingVertical: 5, width: Width(9), borderRadius: 5, alignSelf: 'flex-end', marginTop: -5 },
    TextTime: { fontSize: reText(9), color: colors.black, alignSelf: 'flex-end' },
    TextTimeWhite: { fontSize: reText(9), color: colors.white, alignSelf: 'flex-end' },
    ViewHide: {
        backgroundColor: "grey", alignSelf: 'flex-end', paddingHorizontal: 10, borderTopRightRadius: 10, borderTopLeftRadius: 10, borderBottomLeftRadius: 10,
        paddingTop: 8, maxWidth: Width(65), marginTop: 5
    },
    ChatYour: { flexDirection: 'row', maxWidth: Width(80), alignSelf: 'flex-start', },
    ChatYourChild: { alignSelf: 'flex-start', flexDirection: 'row', marginTop: 5 },
    AvatarYour: { width: Width(6), height: Width(6), borderRadius: Width(6), alignSelf: 'flex-end' },
    NameYour: { marginLeft: Width(3), fontSize: reText(10), color: colors.black_60, marginBottom: 2 },
    TouYour: {
        backgroundColor: colors.colorChat, marginLeft: 10, paddingHorizontal: 10, paddingTop: 8, justifyContent: 'center', maxWidth: Width(75),
        borderTopLeftRadius: 10, borderTopRightRadius: 10, borderBottomRightRadius: 10
    },
    ViewNoteYour: { backgroundColor: "#EBEBEB", padding: 5, borderRadius: 5, flexDirection: 'row', marginBottom: 5, maxWidth: Width(70), paddingRight: 20 },
    Ava: { width: Width(6), height: Width(6), borderRadius: Width(6), alignSelf: 'flex-end' },
    NameUserGroup: { marginLeft: Width(3), fontSize: reText(10), color: colors.black_60, marginBottom: 2 },
    ViewNameG: {
        backgroundColor: "grey", marginLeft: 10, paddingHorizontal: 10, paddingTop: 8, justifyContent: 'center', maxWidth: Width(65),
        borderTopLeftRadius: 10, borderTopRightRadius: 10, borderBottomRightRadius: 10
    },
    TextThuHoi: { color: "white", fontSize: reText(16) },
    ViewThuHoi: { paddingVertical: 5, width: Width(7), borderRadius: 5, alignSelf: 'flex-end' },
    TimeThuHoi: { color: "white", fontSize: reText(9), alignSelf: 'flex-end' },
    ViewTH: { alignSelf: 'flex-start', flexDirection: 'row', marginTop: 5 },
    MatCuoi: { width: Width(4), height: Width(4), tintColor: colors.black_50 },
    ViewMatCuoi: { width: Width(5), justifyContent: 'flex-end', alignItems: 'flex-end' },
    Tong: { fontSize: reText(10), color: colors.white, fontWeight: 'bold', marginLeft: 2 },
    sizeReaction: { width: Width(3.5), height: Width(3.5) },
    ViewReaction: { flexDirection: 'row', backgroundColor: '#BFBFBF', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 10 },
    TouReaction: { flexDirection: 'row', marginLeft: Width(3), marginTop: -7 },
    TextT: { fontSize: reText(9), alignSelf: 'flex-end', color: colors.black },
    ViewT: { paddingVertical: 5, width: Width(9), borderRadius: 5, alignSelf: 'flex-end' },
    HTMLView: { fontSize: reText(15), color: colors.black },
    FontA: { fontStyle: 'italic', fontSize: reText(15), color: colors.blueColor },
    FontSpan: {
        borderRadius: 5, fontWeight: 'bold', color: colors.greenTab
    },
    ReactMe: { flexDirection: 'row', marginTop: -5, alignSelf: 'flex-end' },
    TouReactMe: { flexDirection: 'row', backgroundColor: "#BFBFBF", paddingHorizontal: 5, paddingVertical: 2, borderRadius: 10 },
    TongMe: { fontSize: reText(10), color: colors.white, fontWeight: 'bold', marginLeft: 2 },
    ViewSeen: { width: Width(4), height: Width(4), borderRadius: Width(4), marginTop: 3 },
    ImgSeen: { width: Width(4), height: Width(4), borderRadius: Width(4) },
    ViewUserSeen: { backgroundColor: colors.colorChat, alignSelf: 'flex-end', marginTop: 5, padding: 4, borderRadius: 5, flexDirection: 'row' },
    AvaUserSeen: { width: Width(3), height: Width(3), marginRight: 3, tintColor: colors.black_70 },
    TextSeen: { fontSize: reText(11), color: colors.black_70 },
    sizeImage: { width: Width(23), height: Width(23), borderRadius: 10 },
    TouImage: { width: Width(23), height: Width(23), marginRight: 2, borderRadius: 10 },
    CountImage: { width: Width(23), height: Width(23), backgroundColor: colors.black_60, position: 'absolute', top: 0, left: 0, justifyContent: 'center', alignItems: 'center', borderRadius: 10 },
    TextCountImage: { color: colors.white, fontSize: reText(30), fontWeight: 'bold' },
    ViewFile: { marginRight: 5, backgroundColor: colors.white, width: Width(6), height: Width(6), justifyContent: 'center', alignItems: 'center', borderRadius: 5 },
    NameFile: { width: Width(55), fontSize: reText(14), color: colors.black, alignSelf: 'center' },
    SizeIconFile: { width: Width(5), height: Width(5) },
    SizePlay: { position: "absolute", width: 30, height: 30, top: Width(8), left: Width(8) },
    SizeVideo: { height: Width(23), width: Width(23), borderRadius: 10 },
    FontNote: { fontWeight: '200' },
    marGin: { marginTop: 5 },
    marGinRow: { marginTop: 5, flexDirection: 'row' }

});

export default Utils.connectRedux(ChatMess, mapStateToProps, true)