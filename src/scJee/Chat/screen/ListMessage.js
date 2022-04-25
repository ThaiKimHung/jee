import React, { Component } from 'react'
import { Text, StyleSheet, View, Image, TouchableHighlight, Platform, TouchableOpacity, TextInput, FlatList } from 'react-native'
import Utils from '../../../app/Utils';
import { Images } from '../../../images';
import { colors } from '../../../styles';
import { reText, sizes } from '../../../styles/size';
import { Width } from '../../../styles/styles';
import { SwipeListView } from 'react-native-swipe-list-view';
import LottieView from 'lottie-react-native';
import { Get_Contact_Chat, DeleteConverSation, UpdateDataUnreadInGroup, UpdateDataUnread } from '../../../apis/JeePlatform/API_JeeChat/apiJeeChat';
import { nkey } from '../../../app/keys/keyStore';
import moment from 'moment'
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import { showMessage } from 'react-native-flash-message';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import UtilsApp from '../../../app/UtilsApp';
import ConnectSocket from '../WebSocket/Connecttion';
import dataPresence from '../WebSocket/dataPresence';
import { store } from '../../../srcRedux/store';
import { Get_ThongBaoChat } from '../../../srcRedux/actions';
import IsLoading from '../../../components/IsLoading';
import { RootLang } from '../../../app/data/locales';
import HTMLView from 'react-native-htmlview';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { appConfig } from '../../../app/ConfigJeePlatform';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

export class ListMessage extends Component {
    constructor(props) {
        super(props);
        this.Username = ''
        this.idUser = ''
        this.state = {
            dataList: [],
            dataCopy: [],//Tạo data này để seach
            textSearch: '',
            refreshing: false,
            emptyData: false,
            checkTime: '',
            checkLoadding: false
        }
        this.now = moment(new Date())
        ROOTGlobal.GetListMessage.GetListMess = this.ReLoad // get list message
    }

    async componentDidMount() {
        this.idUser = await Utils.ngetStorage(nkey.UserId, '')
        this.Username = await Utils.ngetStorage(nkey.Username, '')
        this.Get_Contact_Chat()
    }

    ReLoad = async (type = 1) => {
        //timeS code hạn chế bắt tín hiệu từ socket
        let dateNew = moment().format("DD/MM/YYYY HH:mm:ss")
        if (this.state.checkTime == '' || type == 1) {
            var timeS = 5
        } else {
            var duration = moment(moment(dateNew, "DD/MM/YYYY HH:mm:ss").diff(moment(this.state.checkTime, "DD/MM/YYYY HH:mm:ss")))
            var timeS = duration.seconds()
        }
        if (timeS >= 5) {
            this.setState({ checkTime: dateNew })
            this.Get_Contact_Chat()
        }
        // this.Username = await Utils.ngetStorage(nkey.Username, '')
        // this.Get_Contact_Chat()
        // this.KetNoiPresence()
    }

    async KetNoiPresence() {
        let token = await Utils.ngetStorage(nkey.access_token, '');
        this.Presence = new HubConnectionBuilder()
            .withUrl(appConfig.domainJeeChat + "hubs" + '/presence?token=' + token
                , {
                }).withAutomaticReconnect()
            .build()
        this.Presence.start().catch(err => Utils.nlog(err));

        this.Presence.on('UserIsOnline', username => {
            // Utils.nlog('UserIsOnline', username)
            let array = this.state.dataList.map(item => {
                if (item.UserId == username.UserId) {
                    return { ...item, isOnline: true }
                } else {
                    return { ...item }
                }
            })
            this.setState({ dataList: array })
        })

        this.Presence.on('UserIsOffline', username => {
            // Utils.nlog('UserIsOffline', username)
            let array = this.state.dataList.map(item => {
                if (item.UserId == username.UserId) {
                    return { ...item, isOnline: false }
                } else {
                    return { ...item }
                }
            })
            this.setState({ dataList: array })
        })

        //xét danh sách online
        this.Presence.on('GetOnlineUsers', username => {
            let array = this.state.dataList.map(item => {
                let check = false
                username.map(val => {
                    if (item.UserId == val.UserId) {
                        check = true
                    }
                })
                return { ...item, isOnline: check }
            })
            this.setState({ dataList: array })

        })

        this.Presence.on('NewGroupChatReceived', data => {
            store.dispatch(Get_ThongBaoChat())
        })

        //lấy ra được ID người vừa nhắn cho mình
        this.Presence.on('NewMessageReceived', data => {
            this.ReLoad(0)
            store.dispatch(Get_ThongBaoChat())
        })
    }

    Get_Contact_Chat = async () => {
        let dataContactStore = await Utils.ngetStorage(nkey.dataContact, [])
        if (dataContactStore.length == 0) {
            this.setState({ checkLoadding: true })
        }
        this.setState({ dataList: dataContactStore, dataCopy: dataContactStore, refreshing: false })
        let res = await Get_Contact_Chat()
        if (res.status == 1) {
            let listNew = res.data.map(val => {
                return { ...val, seach: val.GroupName ? val.GroupName : val.Fullname }
            })
            this.setState({ checkLoadding: false })
            this.setState({ dataList: listNew, dataCopy: listNew, refreshing: false }, () => {
                this.KetNoiPresence()
            })
            Utils.nsetStorage(nkey.dataContact, listNew)
            if (res.data.length == 0) {
                this.setState({ emptyData: true })
            }
        }
        else {
            this.setState({ checkLoadding: false })
            // this.setState({ dataList: [], dataCopy: [], refreshing: false })
            // Utils.nsetStorage(nkey.dataContact, [])
            UtilsApp.MessageShow(RootLang.lang.JeeChat.thongbao, res.error ? res.error.message : RootLang.lang.JeeChat.laydulieuthatbai, 2)
        }
    }

    SearchData = async () => {
        let { textSearch, dataCopy } = this.state
        let datanew = dataCopy.filter(item => Utils.removeAccents(item['seach']).toUpperCase().includes(Utils.removeAccents(textSearch.toUpperCase())))
        this.setState({ dataList: datanew })
    }

    _onRefresh = () => {
        this.setState({ refreshing: true, checkTime: '' }, () => this.ReLoad())
    }

    UpdateDataUnreadInGroup = async (IdGroup, Username, read = "read") => {
        let res = await UpdateDataUnreadInGroup(IdGroup, Username, read)
        if (res.status == 1) {
            // Utils.nlog("THANH CONG read group:", res, IdGroup, Username)
        }
    }

    UpdateDataUnread = async (IdGroup, UserId, read = "read") => {
        let res = await UpdateDataUnread(IdGroup, UserId, read)
        if (res.status == 1) {
            // Utils.nlog("THANH CONG read user:", res, IdGroup, UserId)
        }
    }

    _goRomm = async (item) => {
        if (item.isGroup) {
            //group
            this.UpdateDataUnreadInGroup(item.IdGroup, this.Username)
        } else {
            //user
            this.UpdateDataUnread(item.IdGroup, item.UserId)
        }
        Utils.goscreen(this.props.nthis, 'ChatMess', { IdGroup: item.IdGroup, isCheck: true })
    }

    _renderItemLoad = () => {
        return (
            <View style={{ marginTop: 20, width: Width(100) }}>
                <SkeletonPlaceholder>
                    <View style={{ flexDirection: 'row', paddingHorizontal: 15, width: Width(100) }}>
                        <View style={{ width: 50, height: 50, borderRadius: 50, alignSelf: 'center' }} />
                        <View style={{ marginLeft: 10, flex: 1 }}>
                            <View style={{ width: Width(40), height: Width(3), borderRadius: 5, marginTop: 10 }} />
                            <View style={{ width: Width(65), height: Width(2.5), borderRadius: 5, marginTop: 5 }} />
                        </View>
                    </View>
                </SkeletonPlaceholder>
            </View>
        )
    }

    _renderItem = ({ item, index }) => {
        let NgayHT = new Date;
        let date = item.LastMess[0]?.CreatedDate
        let songay = (moment(NgayHT)).add(-7, 'hours').diff(moment(date), "days")
        let sogio = (moment(NgayHT)).add(-7, 'hours').diff(moment(date), "hours")
        let sophut = (moment(NgayHT)).add(-7, 'hours').diff(moment(date), "minutes")
        return (
            <TouchableHighlight key={index} onPress={() => this._goRomm(item)}>
                <View key={item.UserId} style={stMessage.ViewMain}>
                    {
                        // là nhóm 2 người
                        item.isGroup && item.ListMember?.length == 2 ?
                            <View style={stMessage.ViewGroup}>
                                {item.ListMember[0]?.InfoMemberUser[0]?.Avatar != "" ?
                                    <Image
                                        source={{ uri: item.ListMember[0]?.InfoMemberUser[0]?.Avatar }}
                                        resizeMode="cover"
                                        style={stMessage.Ava2}
                                    /> :
                                    <Image
                                        source={Images.icAva}
                                        resizeMode="cover"
                                        style={stMessage.Ava2}
                                    />}
                                {item.ListMember[1]?.InfoMemberUser[0]?.Avatar ?
                                    <Image
                                        source={{ uri: item.ListMember[1]?.InfoMemberUser[0]?.Avatar }}
                                        resizeMode="cover"
                                        style={stMessage.Ava2_User}
                                    /> :
                                    <Image
                                        source={Images.icAva}
                                        resizeMode="cover"
                                        style={stMessage.Ava2_User}
                                    />}
                                {/* {item.isOnline ? < LottieView style={{ height: Width(8), position: 'absolute', bottom: 2, right: 0 }} source={require('../../../images/lottieJee/icOnline.json')} autoPlay loop /> : null} */}

                            </View> :
                            // là nhóm 3 người
                            item.isGroup && item.ListMember?.length == 3 ?
                                <View style={stMessage.ViewGroup}>
                                    {item.ListMember[0]?.InfoMemberUser[0]?.Avatar != "" ?
                                        <Image
                                            source={{ uri: item.ListMember[0]?.InfoMemberUser[0]?.Avatar }}
                                            resizeMode="cover"
                                            style={stMessage.Group}
                                        /> :
                                        <Image
                                            source={Images.icAva}
                                            resizeMode="cover"
                                            style={stMessage.Group}
                                        />

                                    }

                                    {item.ListMember[1].InfoMemberUser[0]?.Avatar != "" ?
                                        <Image
                                            source={{ uri: item.ListMember[1]?.InfoMemberUser[0]?.Avatar }}
                                            resizeMode="cover"
                                            style={stMessage.LeftUser}
                                        /> :
                                        <Image
                                            source={Images.icAva}
                                            resizeMode="cover"
                                            style={stMessage.LeftUser}
                                        />}
                                    {item.ListMember[2].InfoMemberUser[0]?.Avatar != "" ?
                                        <Image
                                            source={{ uri: item.ListMember[2]?.InfoMemberUser[0]?.Avatar }}
                                            resizeMode="cover"
                                            style={stMessage.RightUser}
                                        /> :
                                        <Image
                                            source={Images.icAva}
                                            resizeMode="cover"
                                            style={stMessage.RightUser}
                                        />}
                                    {/* {item.isOnline ? < LottieView style={{ height: Width(8), position: 'absolute', bottom: -2, right: 0 }} source={require('../../../images/lottieJee/icOnline.json')} autoPlay loop /> : null} */}
                                </View> :
                                // là nhóm trên 3 người
                                item.isGroup && item.ListMember?.length > 3 ?
                                    <View style={stMessage.ViewGroup}>
                                        {item.ListMember[1]?.InfoMemberUser[0]?.Avatar != "" ?
                                            <Image
                                                source={{ uri: item.ListMember[1]?.InfoMemberUser[0]?.Avatar }}
                                                resizeMode="cover"
                                                style={stMessage.Ava3}
                                            /> :
                                            <Image
                                                source={Images.icAva}
                                                resizeMode="cover"
                                                style={stMessage.Ava3}
                                            />
                                        }
                                        {item.ListMember[2].InfoMemberUser[0]?.Avatar != "" ?
                                            <Image
                                                source={{ uri: item.ListMember[2]?.InfoMemberUser[0]?.Avatar }}
                                                resizeMode="cover"
                                                style={stMessage.Ava3_User}
                                            /> :
                                            <Image
                                                source={Images.icAva}
                                                resizeMode="cover"
                                                style={stMessage.Ava3_User}
                                            />}
                                        <View style={stMessage.Ava3_User_Ora}>
                                            <Text style={stMessage.Count}>+{item.ListMember?.length - 2}</Text>
                                            {/* {item.isOnline ? < LottieView style={{ height: Width(8), position: 'absolute', bottom: -5, right: -1 }} source={require('../../../images/lottieJee/icOnline.json')} autoPlay loop /> : null} */}
                                        </View>

                                    </View>
                                    :
                                    <View style={{ width: Width(17), justifyContent: 'center', alignItems: 'center' }}>
                                        {item.InfoGroupUser[0]?.Avatar ?
                                            <Image
                                                source={{ uri: item.InfoGroupUser[0]?.Avatar }}
                                                resizeMode="cover"
                                                style={stMessage.AvaUser}
                                            /> :
                                            <Image
                                                source={Images.icAva}
                                                resizeMode="cover"
                                                style={stMessage.AvaUser}
                                            />}
                                        {/* OffLine || Online */}
                                        {item.isOnline ? < LottieView style={stMessage.Online} source={require('../../../images/lottieJee/icOnline.json')} autoPlay loop /> : null}


                                    </View>}
                    <View style={stMessage.ViewName}>
                        <View style={stMessage.ViewNameChild}>
                            <Text numberOfLines={1} style={stMessage.NameFull}>{item.isGroup ? item.GroupName : item.Fullname}</Text>
                            <View style={stMessage.ViewTime}>
                                <Text
                                    style={stMessage.TextTime}>
                                    {/* {songay<0 ?null} */}
                                    {sophut == 0 ? RootLang.lang.JeeChat.vaigiaytruoc : sophut < 0 ? null : songay == 0 && sogio < 1 ? sophut + RootLang.lang.JeeChat.phuttruoc : songay == 0 ? sogio + RootLang.lang.JeeChat.gio : songay <= 10 ? songay + RootLang.lang.JeeChat.ngay : moment(date).format('DD/MM/YYYY')}
                                    {/* {songay == 0 ? sogio + " giờ" : songay <= 10 ? songay + " ngày" : moment(date).format('DD/MM/YYYY')} */}
                                </Text>
                            </View>
                        </View>
                        <View style={{ width: Width(60), flexDirection: 'row', height: 20 }}>
                            <Text numberOfLines={1}
                                style={{
                                    fontSize: reText(14), color: item.UnreadMess > 0 ? colors.emerald : colors.black_20,
                                }}>
                                {this.Username == item.LastMess[0]?.UserName ? 'Bạn: ' : item.LastMess[0]?.InfoUser[0]?.Fullname ? item.LastMess[0]?.InfoUser[0]?.Fullname.split(' ').slice(-1).join(' ') + ": " : item.LastMess.length > 0 ? null : <Text style={{ color: colors.redtext, fontSize: reText(14) }}>{RootLang.lang.JeeChat.chuacotinnhannao}</Text>}
                                {/* {item.LastMess[0]?.Content_mess} */}
                            </Text>
                            {item.LastMess[0]?.isFile && !item.LastMess[0]?.isHiden ? <Text style={{ fontSize: reText(14), color: item.UnreadMess > 0 ? colors.emerald : colors.black_20, fontStyle: 'italic' }}>{RootLang.lang.JeeChat.daguifiledinhkem}</Text> : null}
                            {item.LastMess[0]?.isHiden == true ?
                                <Text style={{ fontSize: reText(14), color: item.UnreadMess > 0 ? colors.emerald : colors.black_20, fontStyle: 'italic', fontWeight: 'bold' }} >Đã thu hồi</Text> :
                                item.LastMess[0]?.Content_mess && !item.LastMess[0]?.isFile ?
                                    <HTMLView
                                        value={`<div>${item.LastMess[0]?.Content_mess}</div>`}
                                        stylesheet={{
                                            div: { fontSize: reText(14), color: item.UnreadMess > 0 ? colors.emerald : colors.black_20, },
                                            span: {
                                                backgroundColor: colors.black_20_2, borderRadius: 5, fontWeight: 'bold', color: item.UnreadMess > 0 ? colors.greenTab : colors.black_70
                                            },
                                            a: { fontSize: reText(14), color: item.UnreadMess > 0 ? colors.emerald : colors.black_20 }
                                        }}
                                        onLinkPress={(url) => this._goRomm(item)}
                                    /> : null}
                        </View>
                    </View>
                    {/* Có tin nhắn chưa đọc */}
                    {item.UnreadMess > 0 ?
                        <View style={stMessage.ViewUn}>
                            <View style={stMessage.ViewUnChild}>
                                <Text style={stMessage.TextUn}>{item.UnreadMess}</Text>
                            </View>
                        </View>
                        : null}
                </View>
            </TouchableHighlight>
        )
    }
    _renderItemDelete = ({ item, index }) => {
        return (
            <View key={index}
                style={stMessage.rowBack}>
                <TouchableOpacity
                    activeOpacity={0.5}
                    style={stMessage.backRightBtnLeft}
                    onPress={() => this._DeleteConverSation(item.IdGroup)}
                >
                    <Image source={Images.icRecycle} style={{ tintColor: 'white', width: 20, height: 20 }} />
                    <Text style={{ color: '#FFF', fontSize: reText(12), marginTop: 5 }}>{RootLang.lang.JeeChat.xoa}</Text>
                </TouchableOpacity>

            </View>
        )
    }
    _DeleteConverSation = async (id) => {
        Utils.showMsgBoxYesNo(this.props.nthis, RootLang.lang.JeeChat.thongbao, RootLang.lang.JeeChat.bancomuonxoacuochoithoainay, RootLang.lang.JeeChat.co, RootLang.lang.JeeChat.khong, async () => {
            let res = await DeleteConverSation(id)
            if (res.status == 1) {
                this.ReLoad()
                UtilsApp.MessageShow(RootLang.lang.JeeChat.thongbao, RootLang.lang.JeeChat.xoacuochoithoaithanhcong, 1)
            }
            else {
                UtilsApp.MessageShow(RootLang.lang.JeeChat.thongbao, RootLang.lang.JeeChat.xoacuochoithoaithatbai, 2)
            }
        })
    }

    _DaDocTatCa = async () => {
        let { dataList } = this.state
        Utils.showMsgBoxYesNo(this.props.nthis, RootLang.lang.JeeChat.thongbao, 'Bạn có muốn đánh dấu đã xem tất cả tin nhắn?', "Chấp nhận", 'Huỷ', async () => {
            for (let i = 0; i < dataList.length; i++) {
                if (dataList[i].UnreadMess > 0) {
                    // Utils.nlog("Chưa đọc:", dataList[i], dataList[i].Username, dataList[i].IdGroup, dataList[i].UnreadMess, dataList[i].isGroup, this.Username, this.idUser)
                    if (dataList[i].isGroup) {
                        //xử lý đã đọc group
                        this.UpdateDataUnreadInGroup(dataList[i].IdGroup, this.Username)
                    } else {
                        this.UpdateDataUnread(dataList[i].IdGroup, dataList[i].UserId)
                    }

                    UtilsApp.MessageShow(RootLang.lang.JeeChat.thongbao, "Xử lý thành công")
                    store.dispatch(Get_ThongBaoChat())
                    this.ReLoad()

                }
            }
        })
    }

    renderListEmpty = () => {
        return (
            <View style={{ flex: 1, marginTop: "50%", alignItems: 'center' }}>
                <Image source={Images.icListEmpty} style={{ width: sizes.nImgSize200, height: sizes.nImgSize200 }} resizeMode={'cover'} />
                <Text style={{ fontSize: reText(16), color: colors.brownGreyTwo }}>{RootLang.lang.thongbaochung.khongcodulieu}</Text>
            </View>
        )
    }

    render() {
        const { dataList, refreshing, dataCopy, textSearch, emptyData } = this.state
        return (
            <View style={stMessage.container}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={stMessage.search}>
                        <Image source={Images.icSearch} />
                        <TextInput value={textSearch} numberOfLines={1} style={stMessage.textInput} placeholder={RootLang.lang.JeeChat.timkiem}
                            onChangeText={text => { this.setState({ textSearch: text }, () => this.SearchData()) }} />
                        {textSearch != "" ?
                            <TouchableOpacity onPress={() => {
                                this.setState({ textSearch: "", dataList: dataCopy })
                            }} style={stMessage.xoa}>
                                <Text style={{ fontSize: reText(12), fontWeight: 'bold' }}>X</Text>
                            </TouchableOpacity> : null}
                    </View>
                    <TouchableOpacity onPress={() => this._DaDocTatCa()} style={{ width: Width(10), height: Width(9), alignSelf: 'center', justifyContent: 'center', marginTop: 10 }}>
                        <Image source={Images.ImageJee.icDoubleCheck} style={{ width: Width(6), height: Width(6), }} />
                    </TouchableOpacity>
                </View>
                {this.state.checkLoadding ?
                    <FlatList
                        data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                        renderItem={this._renderItemLoad}
                        keyExtractor={(item, index) => index.toString()}
                    /> :
                    <SwipeListView
                        refreshing={refreshing}
                        onRefresh={this._onRefresh}
                        style={{ flex: 1 }}
                        contentContainerStyle={dataList.length > 0 ? {} : { flex: 1 }}
                        disableRightSwipe
                        showsVerticalScrollIndicator={false}
                        // onRowOpen={(rowKey, rowMap) => this.setState({ key: rowKey, map: rowMap })}
                        onRowOpen={(rowKey, rowMap) => {
                            setTimeout(() => {
                                rowMap[rowKey].closeRow()
                            }, 2000)
                        }}
                        data={dataList}
                        renderItem={this._renderItem}
                        keyExtractor={item => item.IdGroup}
                        renderHiddenItem={this._renderItemDelete}
                        leftOpenValue={75}
                        rightOpenValue={-75}
                        previewRowKey={dataList.length > 0 ? `${dataList[0].IdGroup}` : null}
                        previewOpenValue={-30}
                        previewOpenDelay={3000}
                        extraData={this.state}
                        removeClippedSubviews={true}
                        initialNumToRender={2}
                        maxToRenderPerBatch={5}
                        updateCellsBatchingPeriod={100}
                        windowSize={7}
                        ListEmptyComponent={emptyData ? this.renderListEmpty : null}
                    />}
            </View>
        )
    }
}

const stMessage = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: colors.white
    },
    Search: {
        flexDirection: 'row', paddingVertical: 10, width: Width(90), backgroundColor: colors.black_5, borderRadius: 10,
        alignSelf: 'center', marginTop: 10, paddingHorizontal: 10
    },
    // input: { flex: 1, fontSize: reText(15) }
    textSearch: {
        fontSize: reText(14), marginLeft: 5, color: colors.black_50
    },
    backRightBtnLeft: {
        // ...nstyles.nmiddle,
        backgroundColor: colors.redStar,
        width: 75,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    rowBack: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    search: {
        flexDirection: 'row', backgroundColor: colors.black_5, marginHorizontal: 15, marginTop: 10, paddingHorizontal: 10, borderRadius: 10,
        alignItems: 'center', flex: 1
    },
    textInput: {
        flex: 1, paddingVertical: Platform.OS == 'ios' ? 10 : 5, paddingHorizontal: 5, fontSize: reText(16)
    },
    xoa: { width: Width(5), backgroundColor: colors.black_20_2, height: Width(5), borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
    ViewMain: { backgroundColor: colors.white, flexDirection: 'row', paddingHorizontal: 5, height: 80 },
    ViewGroup: { width: Width(17), paddingHorizontal: 5, marginTop: 5 },
    Ava2: { width: 40, height: 40, borderRadius: 999, borderColor: colors.white, borderWidth: 4, alignSelf: 'flex-end' },
    Ava2_User: {
        width: 40, height: 40, borderRadius: 999, borderColor: colors.white, borderWidth: 4,
        alignSelf: 'flex-start', position: 'absolute', top: 25, left: 5
    },
    Ava3: {
        width: 40, height: 40, borderRadius: 999, borderColor: colors.white, borderWidth: 4, alignSelf: 'center'
    },
    Ava3_User: {
        width: 40, height: 40, borderRadius: 999, borderColor: colors.white, borderWidth: 4,
        alignSelf: 'flex-start', position: 'absolute', top: 28, left: 0
    },
    Ava3_User_Ora: {
        width: 40, height: 40, borderRadius: 999, borderColor: colors.white, borderWidth: 4, justifyContent: 'center', alignItems: 'center',
        alignSelf: 'flex-start', position: 'absolute', top: 28, right: 0, backgroundColor: colors.orangeApp
    },
    Count: { color: colors.white, fontWeight: 'bold', fontSize: reText(14) },
    Group: { width: 40, height: 40, borderRadius: 999, borderColor: colors.white, borderWidth: 4, alignSelf: 'center' },
    LeftUser: {
        width: 40, height: 40, borderRadius: 999, borderColor: colors.white, borderWidth: 4,
        alignSelf: 'flex-start', position: 'absolute', top: 28, left: 0
    },
    RightUser: {
        width: 40, height: 40, borderRadius: 999, borderColor: colors.white, borderWidth: 4,
        alignSelf: 'flex-start', position: 'absolute', top: 28, right: 0
    },
    AvaUser: { width: 50, height: 50, borderRadius: 999 },
    ViewName: { marginTop: 10, width: Width(75), paddingTop: 10 },
    ViewNameChild: { width: Width(75), flexDirection: 'row' },
    NameFull: { fontSize: reText(17), width: Width(60) },
    ViewTime: { width: Width(20), alignItems: 'flex-end', justifyContent: 'center' },
    TextTime: {
        fontSize: reText(11), color: colors.black_50
    },
    Online: { height: Width(8), position: 'absolute', bottom: 1, right: 0 },
    ViewUn: { position: 'absolute', bottom: 20, right: 10 },
    ViewUnChild: { backgroundColor: colors.redStar, height: 17, borderRadius: 99, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 5 },
    TextUn: { fontSize: reText(12), color: colors.white, fontWeight: 'bold' }
})

const mapStateToProps = state => ({
    lang: state.changeLanguage.language,
});
export default Utils.connectRedux(ListMessage, mapStateToProps, true)


