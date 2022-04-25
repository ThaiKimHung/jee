import React, { Component } from 'react'
import { Text, StyleSheet, View, Image, TouchableOpacity, TextInput, Platform, FlatList, Linking } from 'react-native'
import { CreateConversation, Get_Contact_Chat, Get_DanhBa_NotConversation } from '../../../apis/JeePlatform/API_JeeChat/apiJeeChat';
import Utils from '../../../app/Utils';
import { Images } from '../../../images';
import { colors } from '../../../styles';
import { reText, sizes } from '../../../styles/size';
import { Width } from '../../../styles/styles';
import LottieView from 'lottie-react-native';
import UtilsApp from '../../../app/UtilsApp';
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import { nkey } from '../../../app/keys/keyStore';
import dataPresence from '../WebSocket/dataPresence';
import IsLoading from '../../../components/IsLoading';
import { RootLang } from '../../../app/data/locales';
import { appConfig } from '../../../app/ConfigJeePlatform';
import { HubConnectionBuilder } from '@microsoft/signalr';
import ImageCus from '../../../components/NewComponents/ImageCus';
const { connectionPresence } = dataPresence;

export class DanhBa extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataContact: [],
            dataCopy: [],//Tạo data này để seach
            textSearch: '',
            // isLoading: true,
            refreshing: false,
            listChat: []
        }
        ROOTGlobal.GetListDanhBa.GetListDB = this.GetReLoad
    }
    async componentDidMount() {
        await this.Get_DanhBa_NotConversation()
        await this.KetNoiPresence().then(res => {
        }).catch(e => Utils.nlog(e))
        this.getListChat()

    }

    getListChat = async () => {
        nthisLoading.show()
        let res = await Get_Contact_Chat()
        // console.log("reS;", res)
        if (res.status == 1) {
            nthisLoading.hide()
            this.setState({ listChat: res.data })
        } else {
            nthisLoading.hide()
            this.setState({ listChat: [] })
        }
    }


    GetReLoad = async () => {
        await this.Get_DanhBa_NotConversation()
        await this.KetNoiPresence().then(res => {
        }).catch(e => Utils.nlog(e))
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
            let array = this.state.dataContact.map(item => {
                if (item.UserID == username.UserId) {
                    return { ...item, isOnline: true }
                } else {
                    return { ...item }
                }
            })
            this.setState({ dataContact: array })
        })

        this.Presence.on('UserIsOffline', username => {
            // Utils.nlog('UserIsOffline', username)
            let array = this.state.dataContact.map(item => {
                if (item.UserID == username.UserId) {
                    return { ...item, isOnline: false }
                } else {
                    return { ...item }
                }
            })
            this.setState({ dataContact: array })
        })

        //xét danh sách online
        this.Presence.on('GetOnlineUsers', username => {
            // Utils.nlog("getlisstuseronline:", username)
            let array = this.state.dataContact.map(item => {
                let check = false
                username.map(val => {
                    if (item.UserID == val.UserId) {
                        check = true
                    }
                })
                return { ...item, isOnline: check }
            })
            this.setState({ dataContact: array })

        })
        return true;
    }

    Get_DanhBa_NotConversation = async () => {
        nthisLoading.show()
        let res = await Get_DanhBa_NotConversation()
        if (res.status == 1) {
            nthisLoading.hide()
            this.setState({ dataContact: res.data, dataCopy: res.data, refreshing: false })
        }
        else {
            nthisLoading.hide()
            this.setState({ dataContact: [], dataCopy: [], refreshing: false })
            UtilsApp.MessageShow(RootLang.lang.JeeChat.thongbao, res.error ? res.error.message : RootLang.lang.JeeChat.laydulieuthatbai, 2)
        }
    }

    SearchData = async () => {
        let { textSearch, dataCopy } = this.state
        let datanew = dataCopy.filter(item => Utils.removeAccents(item['FullName']).toUpperCase().includes(Utils.removeAccents(textSearch.toUpperCase())))
        this.setState({ dataContact: datanew })
    }

    _renderItem = ({ item, index }) => {
        // console.log("ITEM:", item)
        return (
            <>
                <TouchableOpacity key={item.UserID} style={stDanhBa.item}
                    onPress={() => this._CreateConversation(item)}>
                    <View style={stDanhBa.containerAva}>
                        {item.Avatar != "" && item.Avatar ?
                            <>
                                <ImageCus
                                    defaultSourceCus={Images.JeeAvatarBig}
                                    source={{ uri: item.Avatar }}
                                    style={{ width: Width(10), height: Width(10), borderRadius: Width(5) }}
                                    resizeMode='cover'
                                />
                                {item.isOnline ? < LottieView style={{ height: Width(5), position: 'absolute', bottom: 1, right: 1 }} source={require('../../../images/lottieJee/icOnline.json')} autoPlay loop /> : null}
                            </>
                            :
                            <>
                                <Image source={Images.icAva} style={{ width: Width(10), height: Width(10), borderRadius: 99999 }} />
                                {item.isOnline ? < LottieView style={{ height: Width(5), position: 'absolute', bottom: 1, right: 1 }} source={require('../../../images/lottieJee/icOnline.json')} autoPlay loop /> : null}
                            </>}
                    </View>
                    <View style={stDanhBa.containerName}>
                        <Text style={stDanhBa.text}>{item.FullName}</Text>
                    </View>
                </TouchableOpacity>
            </>
        )
    }

    _onRefresh = () => {
        this.setState({ refreshing: true }, () => this.GetReLoad())
    }

    _CreateConversation = async (item) => {
        const found = this.state.listChat.find(element => element.UserId == item.UserID)
        if (found) {
            Linking.openURL(`jeeplatform://app/root/jeenew/chat/message/${found.IdGroup}/0`)
            return
        }
        else if (found == undefined) {
            Utils.showMsgBoxYesNo(this.props.nthis, RootLang.lang.JeeChat.thongbao, `Bạn có muốn nhắn tin với "${item.FullName}" không?`, RootLang.lang.JeeChat.co, RootLang.lang.JeeChat.khong, async () => {
                nthisLoading.show()
                let res = await CreateConversation(item.FullName, item, false)
                if (res.status == 1 && res.data[0]) {
                    nthisLoading.hide()
                    Utils.goscreen(this.props.nthis, 'ChatMess', { IdGroup: res.data[0].IdGroup, isDanhBa: true, isCheck: true })
                }
                else {
                    nthisLoading.hide()
                    UtilsApp.MessageShow(RootLang.lang.JeeChat.thongbao, RootLang.lang.JeeChat.danggapsucokhongthe, 2)
                }
            })
        }
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
        const { dataContact, textSearch, dataCopy, refreshing } = this.state
        return (
            <View style={stDanhBa.container}>
                <View style={stDanhBa.search}>
                    <Image source={Images.icSearch} />
                    <TextInput value={textSearch} numberOfLines={1} style={stDanhBa.textInput} placeholder={RootLang.lang.JeeChat.timkiembanbe}
                        onChangeText={text => { this.setState({ textSearch: text }, () => this.SearchData()) }} />
                    {textSearch != "" ?
                        <TouchableOpacity onPress={() => {
                            this.setState({ textSearch: "", dataContact: dataCopy })
                        }} style={stDanhBa.xoa}>
                            <Text style={{ fontSize: reText(12), fontWeight: 'bold' }}>X</Text>
                        </TouchableOpacity> : null}
                </View>
                <FlatList
                    contentContainerStyle={{ paddingBottom: 15 }}
                    style={{ paddingTop: 10, marginTop: 5 }}
                    data={dataContact}
                    renderItem={this._renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    extraData={this.state}
                    refreshing={refreshing}
                    onRefresh={this._onRefresh}
                    removeClippedSubviews={true}
                    initialNumToRender={2}
                    maxToRenderPerBatch={5}
                    updateCellsBatchingPeriod={100}
                    windowSize={7}
                    ListEmptyComponent={this.state.dataContact.length == 0 ? this.renderListEmpty : null}
                />
                <IsLoading />
            </View>
        )
    }
}

const stDanhBa = StyleSheet.create({
    container: {
        flex: 1
    },
    search: {
        flexDirection: 'row', backgroundColor: colors.black_5, marginHorizontal: 15, marginTop: 10, paddingHorizontal: 10, borderRadius: 10,
        alignItems: 'center',
    },
    textInput: {
        flex: 1, paddingVertical: Platform.OS == 'ios' ? 10 : 5, paddingHorizontal: 5, fontSize: reText(16)
    },
    xoa: { width: Width(5), backgroundColor: colors.black_20_2, height: Width(5), borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
    item: {
        width: Width(100), marginTop: 5, flexDirection: 'row', paddingHorizontal: Width(5), height: Width(12)
    },
    containerAva: {
        width: Width(12)
    },
    containerName: {
        width: Width(78), justifyContent: 'center', paddingHorizontal: 10, borderBottomWidth: 0.5, borderColor: colors.lightBlack
    },
    text: {
        fontSize: reText(15), fontWeight: 'bold'
    }
})

const mapStateToProps = state => ({
    lang: state.changeLanguage.language,
});
export default Utils.connectRedux(DanhBa, mapStateToProps, true)