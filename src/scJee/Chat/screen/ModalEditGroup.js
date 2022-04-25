import React, { Component } from 'react'
import { Keyboard, Text, View, StyleSheet, Image, TextInput, TouchableOpacity, FlatList, Modal } from 'react-native'
import * as Animatable from 'react-native-animatable'
import Utils from '../../../app/Utils'
import HeaderComStackV2 from '../../../components/HeaderComStackV2'
import { Images } from '../../../images'
import { colors } from '../../../styles'
import { reText } from '../../../styles/size'
import { Width } from '../../../styles/styles'
import { DeleteThanhVienInGroup, GetAllFile, GetImage, GetInforUserChatWith, GetThanhVienGroup, UpdateAdminGroup, UpdateGroupName } from '../../../apis/JeePlatform/API_JeeChat/apiJeeChat';
import UtilsApp from '../../../app/UtilsApp'
import { ROOTGlobal } from '../../../app/data/dataGlobal'
import { nkey } from '../../../app/keys/keyStore'
import ConnectSocket from '../WebSocket/Connecttion'
import { RootLang } from '../../../app/data/locales'
import { HubConnectionBuilder } from '@microsoft/signalr'
import { appConfig } from '../../../app/ConfigJeePlatform'
import { Message } from '../WebSocket/SendMessage'
import IsLoading from '../../../components/IsLoading'

export class ModalEditGroup extends Component {
    constructor(props) {
        super(props)
        this.IdGroup = Utils.ngetParam(this, 'IdGroup') //item 
        this.IsGroup = Utils.ngetParam(this, 'isGroup') //item 
        this.Username = ""
        this.nameuser = ""
        this.refLoading = React.createRef()
        this.state = {
            NameGroup: '', // xin api api load tên group
            NameGroupCopy: '',
            ListMember: [],
            isAdmin_Me: false,
            isChangName: false,
            listUserThamGiaChat: [],
            Count: 0,
        }
        ROOTGlobal.GetMemberGroup.GetMember = this.GetThanhVienGroup
    }

    async componentDidMount() {
        this.refLoading.current.show()
        this.GetThanhVienGroup()
        this.GetInforUserChatWith()
        let token = await Utils.ngetStorage(nkey.access_token, '')
        this.hubConnection = new HubConnectionBuilder()
            .withUrl(appConfig.domainJeeChat + "hubs" + '/message?IdGroup=' + this.IdGroup + '&token=' + token
                , {
                }).withAutomaticReconnect()
            .build()
        this.hubConnection.start().catch(err => Utils.nlog(err));
        this.CountImageFile()
    }

    CountImageFile = async () => {
        let resFile = await GetAllFile(this.IdGroup)
        let resImage = await GetImage(this.IdGroup)
        if (resFile.status == 1 && resImage.status == 1) {
            let dem = resFile.data.length + resImage.data.length
            this.setState({ Count: dem })
            this.refLoading.current.hide()
        }
        else {
            this.setState({ Count: 0 })
            this.refLoading.current.hide()
        }
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
    GetThanhVienGroup = async () => {
        this.Username = await Utils.ngetStorage(nkey.Username, '')
        this.nameuser = await Utils.ngetStorage(nkey.nameuser, '')
        let res = await GetThanhVienGroup(this.IdGroup)
        // Utils.nlog("Ress:", res)
        if (res.status == 1) {
            let check = false
            res.data.map(item => {
                // Utils.nlog("LOG:", item.InforUser[0].Username, item.isAdmin, this.Username, item.InforUser[0].Username == this.Username && item.isAdmin == true)
                if (item.InforUser[0].Username == this.Username && item.isAdmin == true)
                    check = true
            }
            )
            this.setState({ ListMember: res.data, isAdmin_Me: check })
        }
        else {
            this.setState({ ListMember: [] })
        }
    }
    GetInforUserChatWith = async () => {
        let res = await GetInforUserChatWith(this.IdGroup)
        if (res.status == 1) {
            let listThamGia = []
            res.data[0].ListMember.map(item => {
                listThamGia.push({
                    ChucVu: "",
                    HoTen: item.Fullname,
                    Image: item.InfoMemberUser[0].Avatar,
                    check: true,
                    idUser: item.ID_user,
                    username: item.Username
                })
            })
            this.setState({ NameGroup: res.data[0].GroupName, NameGroupCopy: res.data[0].GroupName, listUserThamGiaChat: listThamGia })
        } else {
            this.setState({ NameGroup: '' })
        }
    }
    _goback = () => {
        // Keyboard.dismiss()
        Utils.goback(this, null)
    }

    _deleteItem = async (item) => {
        // Utils.nlog("ITEM:", item)
        Utils.showMsgBoxYesNo(this, RootLang.lang.JeeChat.thongbao, RootLang.lang.JeeChat.xoathanhvienkhoinhom, RootLang.lang.JeeChat.chapnhan, RootLang.lang.JeeChat.huy, async () => {
            let res = await DeleteThanhVienInGroup(this.IdGroup, item.UserId)
            if (res.status == 1) {
                this.send(parseInt(this.IdGroup), RootLang.lang.JeeChat.daxoa, this.Username, item.InforUser[0]?.Fullname, false, false, [], true)
                UtilsApp.MessageShow(RootLang.lang.JeeChat.thongbao, RootLang.lang.JeeChat.xoathanhcong, 1)
                this.GetThanhVienGroup()
            }
            else {
                UtilsApp.MessageShow(RootLang.lang.JeeChat.thongbao, RootLang.lang.JeeChat.thatbaivuilongthulai, 2)
            }
        })
        // DeleteThanhVienInGroup

    }

    _updateAdmin = async (item) => {
        // Utils.nlog("ITEM:", item)
        Utils.showMsgBoxYesNo(this, RootLang.lang.JeeChat.thongbao, item.isAdmin ? RootLang.lang.JeeChat.goquyenquantri : RootLang.lang.JeeChat.themquyenquantri, RootLang.lang.JeeChat.chapnhan, RootLang.lang.JeeChat.huy, async () => {
            let res = await UpdateAdminGroup(this.IdGroup, item.UserId, item.isAdmin ? 0 : 1)
            if (res.status == 1) {
                UtilsApp.MessageShow(RootLang.lang.JeeChat.thongbao, RootLang.lang.JeeChat.thanhcong, 1)
                this.GetThanhVienGroup()
            }
            else {
                UtilsApp.MessageShow(RootLang.lang.JeeChat.thongbao, RootLang.lang.JeeChat.thatbaivuilongthulai, 2)
            }
        })



    }

    _renderItem = ({ item, index }) => {
        return (
            <View key={item.UserId} style={styles.item}>
                <View style={styles.containerAva}>
                    {item.InforUser[0]?.Avatar != "" && item.InforUser[0]?.Avatar ?
                        <View>
                            <Image source={{ uri: item.InforUser[0]?.Avatar }} style={{ width: Width(10), height: Width(10), borderRadius: 99999 }} />
                            {item.isAdmin ? <View style={{ width: Width(5), height: Width(5), borderRadius: Width(5), backgroundColor: "#403F3B", position: 'absolute', bottom: 0, right: 0, justifyContent: 'center', alignItems: "center" }}>
                                <Image source={Images.ImageJee.icKey} style={{ width: Width(3), height: Width(3), tintColor: "#F7CB1B" }} />
                            </View>
                                : null}
                        </View>
                        :
                        <View>
                            <Image source={Images.icAva} style={{ width: Width(10), height: Width(10), borderRadius: 99999 }} />
                            {item.isAdmin ? <View style={{ width: Width(5), height: Width(5), borderRadius: Width(5), backgroundColor: "#403F3B", position: 'absolute', bottom: 0, right: 0, justifyContent: 'center', alignItems: "center" }}>
                                <Image source={Images.ImageJee.icKey} style={{ width: Width(3), height: Width(3), tintColor: "#F7CB1B" }} />
                            </View>
                                : null}
                        </View>
                    }

                </View>
                <View style={styles.containerName}>
                    <View>
                        <Text style={styles.text}>{item.InforUser[0]?.Fullname}</Text>
                        <Text style={styles.Chucvu}>{item.InforUser[0]?.ChucVu}</Text>
                    </View>
                </View>
                {this.state.isAdmin_Me ?
                    <>
                        <TouchableOpacity onPress={() => this._deleteItem(item)}
                            style={{ width: Width(10), height: Width(10), justifyContent: 'center', alignItems: 'center' }}>
                            <Image source={Images.ImageJee.icminumum} style={{ width: Width(4), height: Width(4), tintColor: colors.redStar }} />
                        </TouchableOpacity>
                        {item.isAdmin ?
                            <TouchableOpacity onPress={() => this._updateAdmin(item)}
                                style={{ width: Width(10), height: Width(10), justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ width: Width(5), height: Width(5), borderRadius: Width(5), backgroundColor: "#403F3B", position: 'absolute', justifyContent: 'center', alignItems: "center" }}>
                                    <Image source={Images.ImageJee.icKey} style={{ width: Width(3), height: Width(3), tintColor: colors.redStar }} />
                                </View>
                            </TouchableOpacity> :
                            <TouchableOpacity onPress={() => this._updateAdmin(item)}
                                style={{ width: Width(10), height: Width(10), justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ width: Width(5), height: Width(5), borderRadius: Width(5), backgroundColor: "#403F3B", position: 'absolute', justifyContent: 'center', alignItems: "center" }}>
                                    <Image source={Images.ImageJee.icKey} style={{ width: Width(3), height: Width(3), tintColor: "#F7CB1B" }} />
                                </View>
                            </TouchableOpacity>}
                    </>
                    : null
                }
            </View>
        )
    }

    _EditNameGroup = async () => {
        let res = await UpdateGroupName(this.IdGroup, this.state.NameGroup)
        if (res.status == 1) {
            this.setState({ isChangName: false })
            UtilsApp.MessageShow(RootLang.lang.JeeChat.thongbao, RootLang.lang.JeeChat.doitenthanhcong, 1)
        } else {
            this.setState({ isChangName: false })
            UtilsApp.MessageShow(RootLang.lang.JeeChat.thongbao, RootLang.lang.JeeChat.doitenthatbai, 2)
        }
    }

    _LeaveRoom = async () => {
        Utils.showMsgBoxYesNo(this, RootLang.lang.JeeChat.thongbao, RootLang.lang.JeeChat.bancomuonroikhoinhom, RootLang.lang.JeeChat.chapnhan, RootLang.lang.JeeChat.huy, async () => {
            let idUserMe = 0
            this.state.ListMember.map(item =>
                item.InforUser[0].Username == this.Username ? idUserMe = item.InforUser[0].UserId : null
            )
            let res = await DeleteThanhVienInGroup(this.IdGroup, idUserMe)
            if (res.status == 1) {
                this.send(parseInt(this.IdGroup), "", this.Username, "", false, false, [], true)
                UtilsApp.MessageShow(RootLang.lang.JeeChat.thongbao, RootLang.lang.JeeChat.roikhoinhomthanhcong, 1)
                ROOTGlobal.GetListMessage.GetListMess()
                Utils.goscreen(this, 'sc_ScreenMain')
            } else {
                UtilsApp.MessageShow(RootLang.lang.JeeChat.thongbao, RootLang.lang.JeeChat.roikhoinhomthatbai, 2)
            }
        })
    }

    render() {
        const { NameGroup, ListMember, isChangName, listUserThamGiaChat } = this.state
        return (
            <View style={styles.container}>
                <HeaderComStackV2
                    styIconRight={{ width: Width(6), height: Width(6), tintColor: colors.greenTab }}
                    // textleft={'Huỷ'}
                    nthis={this}
                    title={RootLang.lang.JeeChat.tuychon}
                    iconLeft={Images.ImageJee.icBack}
                    iconRight={this.IsGroup ? Images.ImageJee.icOptionChat : null}
                    onPressLeft={this._goback}
                    onPressRight={() => Utils.goscreen(this, 'ModalAddMember', { IdGroup: this.IdGroup })}
                />
                {this.IsGroup ?
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                        <Image source={Images.ImageJee.icGroup} style={{ width: Width(12), height: Width(12), tintColor: colors.greenTab }} />
                        <View style={{ flexDirection: "row", width: Width(80), justifyContent: 'center' }}>
                            <Text style={{ fontWeight: 'bold', fontSize: reText(20) }}>{NameGroup}</Text>
                            {/* this._EditNameGroup() */}
                            <TouchableOpacity onPress={() => this.setState({ isChangName: true })} style={{ alignSelf: 'center', marginLeft: 5, paddingHorizontal: 10, paddingVertical: 5 }}>
                                <Image source={Images.ImageJee.icEditMessage} style={{ width: Width(4), height: Width(4), tintColor: colors.greenTab }} />
                            </TouchableOpacity>
                        </View>
                    </View> : null}
                <Modal
                    animationType='fade'
                    visible={isChangName}
                    transparent={true}>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.black_20_2 }}>
                        <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, right: 0, elevation: 1 }} onTouchEnd={() => this.setState({ isChangName: false, NameGroup: this.state.NameGroupCopy })}></View>
                        <Animatable.View
                            style={{
                                width: Width(90), backgroundColor: 'white', borderRadius: 5, padding: 15, elevation: 3, shadowRadius: 3,
                            }}
                            animation={'zoomIn'}
                            duration={500}
                            useNativeDriver={true}>
                            <Text style={{ fontSize: reText(16), color: colors.black_50 }}>Tên nhóm</Text>
                            <View style={{ borderWidth: 0.4, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 5, marginTop: 5 }}>
                                <TextInput value={NameGroup} onChangeText={(text => this.setState({ NameGroup: text }))} style={{ fontWeight: 'bold', fontSize: reText(20) }} />
                            </View>
                            <TouchableOpacity onPress={() => this._EditNameGroup()} style={{ backgroundColor: colors.greenTab, width: Width(40), paddingVertical: 10, borderRadius: 5, marginTop: 20, alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: reText(16), fontWeight: 'bold', color: colors.white }}> Đổi tên nhóm</Text>
                            </TouchableOpacity>
                        </Animatable.View>
                    </View>
                </Modal>
                <View style={{ width: Width(100), height: 5, backgroundColor: colors.BackgroundHome, marginVertical: 10 }} />
                <View style={{}}>
                    <TouchableOpacity onPress={() => Utils.goscreen(this, 'Modal_ImageFile', { IdGroup: this.IdGroup })}
                        style={{ flexDirection: 'row', marginHorizontal: 15 }}>
                        <Image source={Images.ImageJee.icKhoLuu} style={{ width: Width(6), height: Width(6), alignSelf: 'center', tintColor: colors.black_70 }} />
                        <Text style={{ fontSize: reText(15), alignSelf: 'center', flex: 1, marginHorizontal: 10, color: colors.black_70 }}>Kho lưu trữ <Text style={{ color: this.state.Count ? colors.blueColor : null }}>({this.state.Count})</Text></Text>
                        <Image source={Images.ImageJee.icIconDropDownNamNgang} style={{ width: Width(1.5), height: Width(2), alignSelf: 'center', tintColor: colors.black_70 }} />
                    </TouchableOpacity>
                    <View style={{ width: Width(88), height: 0.5, backgroundColor: colors.black_20_2, alignSelf: 'flex-end', marginVertical: 10 }} />
                    <TouchableOpacity onPress={() => {
                        Utils.goscreen(this, 'Modal_TaoCuocHop', {
                            // rowid: this.item.RowID,
                            // index: this.index,
                            // item: this.item,
                            // rowid: dataChiTiet.RowID,
                            // reload: (type, index, item) => this.callback(type, index, item),
                            // type: 1
                            listUserThamGiaChat: this.state.listUserThamGiaChat
                        })
                    }} style={{ flexDirection: 'row', marginHorizontal: 15 }}>
                        <Image source={Images.ImageJee.icMeetingChat} style={{ width: Width(6), height: Width(6), alignSelf: 'center', tintColor: colors.black_70 }} />
                        <Text style={{ fontSize: reText(15), alignSelf: 'center', flex: 1, marginHorizontal: 10, color: colors.black_70 }}>Tạo cuộc họp</Text>
                        <Image source={Images.ImageJee.icIconDropDownNamNgang} style={{ width: Width(1.5), height: Width(2), alignSelf: 'center', tintColor: colors.black_70 }} />
                    </TouchableOpacity>

                </View>
                <View style={{ width: Width(100), height: 5, backgroundColor: colors.BackgroundHome, marginVertical: 10 }} />
                <View style={{ flex: 1 }}>
                    <Text style={{ marginHorizontal: 10, fontSize: reText(15), color: colors.black_50 }}>{this.IsGroup ? RootLang.lang.JeeChat.thongtinthanhvien : 'Thông tin'}</Text>
                    <FlatList
                        style={{ marginTop: 5 }}
                        data={ListMember}
                        renderItem={this._renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        extraData={this.state}
                        // refreshing={refreshing}
                        // onRefresh={this._onRefresh}
                        initialNumToRender={5}
                        maxToRenderPerBatch={10}
                        windowSize={7}
                        updateCellsBatchingPeriod={100}
                    />
                </View>
                <View style={{ width: Width(100), height: Width(15), }}>
                    <TouchableOpacity onPress={() => this._LeaveRoom()} style={{
                        width: Width(45), height: Width(9), borderRadius: 10, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                        backgroundColor: "#BA0909", flexDirection: 'row'
                    }}>
                        <Image source={Images.ImageJee.icLeave} style={{ width: Width(5), height: Width(5), marginRight: 5, tintColor: colors.white }} />
                        <Text style={{ fontWeight: 'bold', fontSize: reText(15), color: colors.white }}>{RootLang.lang.JeeChat.roikhoinhom}</Text>
                    </TouchableOpacity>
                </View>
                <IsLoading ref={this.refLoading} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: colors.white,
    },
    item: {
        width: Width(100), marginTop: 5, flexDirection: 'row', paddingHorizontal: Width(5), height: Width(12)
    },
    containerAva: {
        width: Width(12)
    },
    containerName: {
        width: Width(60), justifyContent: 'center', paddingHorizontal: 10, borderBottomWidth: 0.5, borderColor: colors.lightBlack
    },
    text: {
        fontSize: reText(15), fontWeight: 'bold'
    },
    Chucvu: {
        fontSize: reText(12), color: colors.black_50
    }
})
export default ModalEditGroup
