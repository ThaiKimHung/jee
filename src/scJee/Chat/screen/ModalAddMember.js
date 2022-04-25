
import React, { Component } from 'react'
import { Text, View, StyleSheet, TextInput, Image, TouchableOpacity, FlatList, Keyboard } from 'react-native'
import Utils from '../../../app/Utils';
import HeaderComStackV2 from '../../../components/HeaderComStackV2';
import { Images } from '../../../images';
import { colors } from '../../../styles';
import { reText } from '../../../styles/size';
import { paddingBotX, Width } from '../../../styles/styles';
import LottieView from 'lottie-react-native';
import { GetDSThanhVienNotInGroup, InsertThanhVienInGroup } from '../../../apis/JeePlatform/API_JeeChat/apiJeeChat';
import UtilsApp from '../../../app/UtilsApp';
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import IsLoading from '../../../components/IsLoading';
import ConnectSocket from '../WebSocket/Connecttion';
import { nkey } from '../../../app/keys/keyStore';
import { RootLang } from '../../../app/data/locales';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { appConfig } from '../../../app/ConfigJeePlatform';
import { Message } from '../WebSocket/SendMessage';

export class ModalAddMember extends Component {
    constructor(props) {
        super(props);
        this.IdGroup = Utils.ngetParam(this, 'IdGroup') //item 
        this.Username = ''
        this.state = {
            dataContactAll: [],
            dataCopy: [],//Tạo data này để seach
            textSearch: '',

            refreshing: false,
            listContactChecked: [],
        }
    }
    async componentDidMount() {
        this.Username = await Utils.ngetStorage(nkey.Username, '')
        this.GetDSThanhVienNotInGroup()
        let token = await Utils.ngetStorage(nkey.access_token, '');
        let access_token = "Bearer " + token
        this.hubConnection = new HubConnectionBuilder()
            .withUrl(appConfig.domainJeeChat + "hubs" + '/message?IdGroup=' + this.IdGroup + '&token=' + token
                , {
                }).withAutomaticReconnect()
            .build()
        this.hubConnection.start().catch(err => Utils.nlog(err));
    }
    GetDSThanhVienNotInGroup = async () => {
        nthisLoading.show()
        let res = await GetDSThanhVienNotInGroup(this.IdGroup)
        if (res.status == 1) {
            nthisLoading.hide()
            this.setState({ dataContactAll: res.data, dataCopy: res.data, refreshing: false })
        }
        else {
            nthisLoading.hide()
            this.setState({ dataContactAll: [], dataCopy: [], refreshing: false })
        }
    }

    SearchData = async () => {
        let { textSearch, dataCopy } = this.state
        let datanew = dataCopy.filter(item => Utils.removeAccents(item['Fullname']).toUpperCase().includes(Utils.removeAccents(textSearch.toUpperCase())))
        this.setState({ dataContactAll: datanew })
    }

    _addListCheck = async (item) => {
        let ListCheck = this.state.dataCopy.map(val => {
            if (val.UserID == item.UserID) {
                if (item.isCheck) {
                    return { ...item, isCheck: !item.isCheck }
                }
                return { ...item, isCheck: true }
            }
            return { ...val }
        })
        await this.setState({ dataContactAll: ListCheck, dataCopy: ListCheck }, () => {
            let ListChecked = []
            ListCheck.map(val => {
                if (val.isCheck == true)
                    return ListChecked.push(val)
            })
            this.setState({ listContactChecked: ListChecked })
        })
    }

    _renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity key={index} style={styles.item}
                onPress={() => this._addListCheck(item)}
            >
                <View style={styles.containerAva}>
                    {item.Avatar != "" && item.Avatar ?
                        <Image source={{ uri: item.Avatar ? item.Avatar : '' }} style={{ width: Width(10), height: Width(10), borderRadius: 99999 }} />
                        :
                        <Image source={Images.icAva} style={{ width: Width(10), height: Width(10), borderRadius: 99999 }} />}
                </View>
                <View style={styles.containerName}>
                    <Text style={styles.text}>{item.Fullname ? item.Fullname : ''}</Text>
                    <Text style={styles.Chucvu}>{item.ChucVu ? item.ChucVu : ''}</Text>
                </View>
                <View style={styles.touch}>
                    <Image source={item.isCheck ? Images.ImageJee.icCheckChat : Images.ImageJee.icUnCheckChat} style={{ width: Width(5), height: Width(5), tintColor: colors.greenTab }} />
                </View>
            </TouchableOpacity>
        )
    }
    _goback = () => {
        Keyboard.dismiss()
        Utils.goback(this, null)
        return true;
    }
    _renderChild = ({ item, index }) => {
        return (
            <TouchableOpacity onPress={() => this._addListCheck(item)} key={index} >
                <View style={{ width: Width(12), height: Width(12), borderRadius: Width(15), marginRight: 7 }}>
                    {item.Avatar && item.Avatar != "" ?
                        <Image source={{ uri: item.Avatar }} style={{ width: Width(12), height: Width(12), borderRadius: Width(12) }} resizeMode={'cover'} /> :
                        <Image source={Images.icAva} style={{ width: Width(12), height: Width(12), borderRadius: Width(12) }} resizeMode={'cover'} />}
                </View>
                <View style={{ width: 15, height: 15, backgroundColor: colors.white, borderRadius: 999, position: 'absolute', top: 5, right: 5, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: reText(7), color: colors.black_60, fontWeight: 'bold' }}>X</Text>
                </View>
            </TouchableOpacity>
        )
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

    _createGroup = async () => {
        let { listContactChecked } = this.state
        let name = ''
        listContactChecked.map((item, index) => {
            name += (index !== 0 ? ", " : "") + item.Fullname
        })
        let res = await InsertThanhVienInGroup(this.IdGroup, listContactChecked)
        if (res.status == 1) {
            this.send(parseInt(this.IdGroup), RootLang.lang.JeeChat.dathem, this.Username, name, false, false, [], true)
            UtilsApp.MessageShow(RootLang.lang.JeeChat.thongbao, RootLang.lang.JeeChat.themthanhcong, 1)
            ROOTGlobal.GetMemberGroup.GetMember()
            Utils.goback(this)
        }
        else {
            UtilsApp.MessageShow(RootLang.lang.JeeChat.thongbao, RootLang.lang.JeeChat.themthatbai, 2)
        }
    }
    render() {
        const { textSearch, NameGroup, dataCopy, dataContactAll, refreshing, isLoading, listContactChecked } = this.state
        return (
            <View style={styles.container}>
                <HeaderComStackV2
                    // styIconLeft={{ tintColor: "#707070" }}
                    // textleft={'Huỷ'}
                    nthis={this}
                    title={RootLang.lang.JeeChat.themthanhvien}
                    iconLeft={Images.ImageJee.icBack}
                    onPressLeft={this._goback}
                />
                <View style={styles.search}>
                    <Image source={Images.icSearch} />
                    <TextInput value={textSearch} numberOfLines={1} style={styles.textInput} placeholder={RootLang.lang.JeeChat.timkiembanbe}
                        onChangeText={text => { this.setState({ textSearch: text }, () => this.SearchData()) }} />
                    {textSearch != "" ?
                        <TouchableOpacity onPress={() => {
                            this.setState({ textSearch: "" }, this.setState({ dataContactAll: dataCopy }))
                        }} style={styles.xoa}>
                            <Text style={{ fontSize: reText(12), fontWeight: 'bold' }}>X</Text>
                        </TouchableOpacity> : null}
                </View>
                <FlatList
                    style={{ paddingTop: 10, marginTop: 5 }}
                    contentContainerStyle={{ paddingBottom: 110 }}
                    data={dataContactAll}
                    renderItem={this._renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    extraData={this.state}
                    refreshing={refreshing}
                    onRefresh={this._onRefresh}
                    initialNumToRender={5}
                    maxToRenderPerBatch={10}
                    windowSize={7}
                    updateCellsBatchingPeriod={100}

                // ref={ref => { this.ref = ref }}
                // ListEmptyComponent={dataCV.length == 0 && dataLoad == false ? <ListEmptyLottie style={{ justifyContent: 'center', alignItems: 'center', }} textempty={'Không có dữ liệu'} /> : null}
                />
                {listContactChecked.length > 0 ?
                    <View style={{ width: Width(100), alignItems: 'center', height: 60 + paddingBotX, backgroundColor: '#C6CFC9', position: 'absolute', bottom: 0, left: 0, flexDirection: 'row', paddingBottom: paddingBotX, paddingHorizontal: 10 }}>
                        <FlatList
                            // style={{ paddingTop: 10, marginTop: 5 }}
                            ref={ref => this.refListContactChecked = ref}
                            contentContainerStyle={{ marginRight: 10 }}
                            onContentSizeChange={() => this.refListContactChecked.scrollToEnd({ animated: true })}
                            horizontal={true}
                            data={listContactChecked}
                            renderItem={this._renderChild}
                            keyExtractor={(item, index) => index.toString()} />
                        <TouchableOpacity onPress={() => this._createGroup()} style={{ width: Width(12), height: Width(12), backgroundColor: colors.greenTab, justifyContent: 'center', alignItems: 'center', borderRadius: Width(20) }}>
                            <Image source={Images.ImageJee.icNextChat} style={{ width: Width(5), height: Width(5), tintColor: colors.white }} />
                        </TouchableOpacity>
                    </View> : null}
                <IsLoading />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: colors.white
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
        width: Width(70), justifyContent: 'center', paddingHorizontal: 10, borderBottomWidth: 0.5, borderColor: colors.lightBlack
    },
    touch: {
        width: Width(8), justifyContent: 'center', alignItems: 'center'
    },
    text: {
        fontSize: reText(15), fontWeight: 'bold'
    },
    Chucvu: {
        fontSize: reText(12), color: colors.black_50
    }
})


const mapStateToProps = state => ({
    lang: state.changeLanguage.language,
});

export default Utils.connectRedux(ModalAddMember, mapStateToProps, true)
