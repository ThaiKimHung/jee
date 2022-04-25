import React, { Component } from 'react'
import { Text, View, StyleSheet, TextInput, Image, TouchableOpacity, FlatList, Keyboard, Linking } from 'react-native'
import Utils from '../../../app/Utils';
import HeaderComStackV2 from '../../../components/HeaderComStackV2';
import { Images } from '../../../images';
import { colors } from '../../../styles';
import { reText } from '../../../styles/size';
import { nstyles, paddingBotX, Width } from '../../../styles/styles';
import { CreateConversation, GetAllUser } from '../../../apis/JeePlatform/API_JeeChat/apiJeeChat';
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import UtilsApp from '../../../app/UtilsApp';
import { store } from '../../../srcRedux/store';
import { Get_ThongBaoChat } from '../../../srcRedux/actions'
import IsLoading from '../../../components/IsLoading';
import { RootLang } from '../../../app/data/locales';

export class ModalCreateGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            NameGroup: '',
            dataContactAll: [],
            dataCopy: [],//Tạo data này để seach
            textSearch: '',
            // isLoading: true,
            refreshing: false,
            listContactChecked: [],
        }
    }
    componentDidMount() {
        this.Get_DanhBa_ALL()
    }
    Get_DanhBa_ALL = async () => {
        nthisLoading.show()
        let res = await GetAllUser()
        // Utils.nlog("RESSSS:", res)
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
            if (val.UserId == item.UserId) {
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
    _goback = async () => {
        Keyboard.dismiss()
        await store.dispatch(Get_ThongBaoChat())
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
                <Image source={Images.ImageJee.icXoaAnh} style={{ ...nstyles.nIcon19, position: 'absolute', top: 0, right: 3 }}></Image>
            </TouchableOpacity>
        )
    }

    _createGroup = async () => {
        const { NameGroup, listContactChecked } = this.state
        if (NameGroup == "")
            UtilsApp.MessageShow(RootLang.lang.JeeChat.thongbao, RootLang.lang.JeeChat.chuadattennhom, 3)
        else {
            let res = await CreateConversation(NameGroup, listContactChecked)
            if (res.status == 1) {
                if (res.data[0]?.IdGroup) {
                    Linking.openURL(`jeeplatform://app/root/jeenew/chat/message/${res.data[0].IdGroup}/0`)
                }
                UtilsApp.MessageShow(RootLang.lang.JeeChat.thongbao, RootLang.lang.JeeChat.themnhomthanhcong, 1)
                ROOTGlobal.GetListMessage.GetListMess()
                this._goback()
            }
            else {
                UtilsApp.MessageShow(RootLang.lang.JeeChat.thongbao, RootLang.lang.JeeChat.themnhomthatbai, 1)
                this._goback()
            }
        }
    }
    render() {
        const { textSearch, NameGroup, dataCopy, dataContactAll, refreshing, listContactChecked } = this.state
        return (
            <View style={styles.container}>
                <HeaderComStackV2
                    // styIconLeft={{ tintColor: "#707070" }}
                    // textleft={'Huỷ'}
                    nthis={this}
                    title={RootLang.lang.JeeSocial.taonhom}
                    iconLeft={Images.ImageJee.icBack}
                    onPressLeft={this._goback}
                />
                <View style={{ flexDirection: 'row', width: Width(90), alignSelf: 'center', marginTop: 10 }}>
                    <Image source={Images.ImageJee.icGroup} style={{ width: Width(9), height: Width(9), tintColor: NameGroup != "" ? colors.greenTab : colors.black_70 }} />
                    <TextInput value={NameGroup} onChangeText={text => this.setState({ NameGroup: text })} numberOfLines={1} placeholder={RootLang.lang.JeeChat.dattennhom} style={{ flex: 1, paddingHorizontal: 10, fontSize: reText(20) }} />
                    {NameGroup != "" ?
                        <View style={{ width: Width(10), height: Width(10), justifyContent: 'center', alignItems: 'center' }}>
                            <Image source={Images.checkNew} style={{ width: Width(3), height: Width(3) }} />
                        </View> : null}
                </View>
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
export default Utils.connectRedux(ModalCreateGroup, mapStateToProps, true)
