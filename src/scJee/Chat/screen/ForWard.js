import React, { Component } from 'react'
import { Text, View, StyleSheet, TextInput, Image, TouchableOpacity, FlatList, Keyboard } from 'react-native'
import Utils from '../../../app/Utils';
import HeaderComStackV2 from '../../../components/HeaderComStackV2';
import { Images } from '../../../images';
import { colors } from '../../../styles';
import { reText } from '../../../styles/size';
import { nstyles, paddingBotX, Width } from '../../../styles/styles';
import { Get_Contact_Chat } from '../../../apis/JeePlatform/API_JeeChat/apiJeeChat';
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import UtilsApp from '../../../app/UtilsApp';
import { store } from '../../../srcRedux/store';
import { Get_ThongBaoChat } from '../../../srcRedux/actions'
import IsLoading from '../../../components/IsLoading';
import { RootLang } from '../../../app/data/locales';
import HTMLView from 'react-native-htmlview';

export class ForWard extends Component {
    constructor(props) {
        super(props);
        this.callbackForWard = Utils.ngetParam(this, 'callbackForWard')
        this.Content_mess = Utils.ngetParam(this, 'Content_mess')
        this.Attachment = Utils.ngetParam(this, 'Attachment')
        this.Attachment_File = Utils.ngetParam(this, 'Attachment_File')
        this.Videos = Utils.ngetParam(this, 'Videos')
        this.state = {
            NameGroup: '',
            dataContactAll: [],
            dataCopy: [],//Tạo data này để seach
            textSearch: '',
            refreshing: false,
            listContactChecked: [],
        }
    }
    componentDidMount() {
        this.Get_DanhBa_ALL()
    }
    Get_DanhBa_ALL = async () => {
        nthisLoading.show()
        let res = await Get_Contact_Chat()
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
            if (val.IdGroup == item.IdGroup) {
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
                    {
                        item.isGroup ? <Image source={Images.ImageJee.icGroup} style={{ width: Width(10), height: Width(10), borderRadius: 99999, tintColor: colors.greenTab }} /> :
                            item.InfoGroupUser[0].Avatar != "" && item.InfoGroupUser[0].Avatar ?
                                <Image source={{ uri: item.InfoGroupUser[0].Avatar ? item.InfoGroupUser[0].Avatar : '' }} style={{ width: Width(10), height: Width(10), borderRadius: 99999 }} />
                                :
                                <Image source={Images.icAva} style={{ width: Width(10), height: Width(10), borderRadius: 99999 }} />}
                </View>
                <View style={styles.containerName}>
                    <Text style={styles.text}>{item.isGroup ? item.GroupName : item.Fullname}</Text>
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
                    {
                        item.isGroup ? <Image source={Images.ImageJee.icGroup} style={{ width: Width(12), height: Width(12), borderRadius: 99999, tintColor: colors.greenTab }} /> :
                            item.InfoGroupUser[0].Avatar != "" && item.InfoGroupUser[0].Avatar ?
                                <Image source={{ uri: item.InfoGroupUser[0].Avatar ? item.InfoGroupUser[0].Avatar : '' }} style={{ width: Width(12), height: Width(12), borderRadius: 99999 }} />
                                :
                                <Image source={Images.icAva} style={{ width: Width(12), height: Width(12), borderRadius: 99999 }} />}
                </View>
                <Image source={Images.ImageJee.icXoaAnh} style={{ ...nstyles.nIcon19, position: 'absolute', top: 0, right: 3 }}></Image>
            </TouchableOpacity>
        )
    }

    _ForWard = () => {
        this.callbackForWard(this.state.listContactChecked)
        Utils.goback(this)
    }

    _ImageForward = ({ item, index }) => {
        return (
            <TouchableOpacity key={index} onPress={() => UtilsApp.showImageZoomViewer(this, encodeURI(item.hinhanh))} style={{ marginRight: 5, borderRadius: 5 }}>
                <Image source={{ uri: item.hinhanh }} style={{ width: 65, height: 65, borderRadius: 5 }} />
            </TouchableOpacity>
        )
    }
    _renderFile = ({ item, index }) => {
        return (
            <TouchableOpacity key={index} onPress={() => Utils.openUrl(item.Link)} style={{ flexDirection: 'row' }}>
                <Image source={UtilsApp._returnImageFile(item.Link)} style={{ width: 25, height: 25, borderRadius: 5, }} />
                <Text numberOfLines={1} style={{ alignSelf: 'center', marginLeft: 5, width: Width(85) }}>{item.filename}</Text>
            </TouchableOpacity>
        )
    }
    _renderVideo = ({ item, index }) => {
        return (
            <TouchableOpacity key={index} onPress={() => Utils.openUrl(item.path)} style={{ flexDirection: 'row' }}>
                <Image source={Images.ImageJee.icVideo} style={{ width: 30, height: 30, borderRadius: 5, }} />
                <Text numberOfLines={1} style={{ alignSelf: 'center', marginLeft: 5, width: Width(85) }}>{item.filename}</Text>
            </TouchableOpacity>
        )
    }
    render() {
        const { textSearch, NameGroup, dataCopy, dataContactAll, refreshing, listContactChecked } = this.state
        let hContent = this.Content_mess ? 130 : 100
        let hAttachment = this.Attachment.length > 0 ? 50 : 0
        let hAttachment_File = this.Attachment_File.length > 0 ? 80 : 0
        let hVideos = this.Videos.length > 0 ? 70 : 0
        let heightcus = hContent + hAttachment + hAttachment_File + hVideos
        return (
            <View style={styles.container}>
                <HeaderComStackV2
                    // styIconLeft={{ tintColor: "#707070" }}
                    // textleft={'Huỷ'}
                    nthis={this}
                    title={'Chuyển tiếp tin nhắn'}
                    iconLeft={Images.ImageJee.icBack}
                    onPressLeft={this._goback}
                />
                <View style={styles.search}>
                    <Image source={Images.icSearch} />
                    <TextInput value={textSearch} numberOfLines={1} style={styles.textInput} placeholder={'Tìm cuộc trò chuyện..'}
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
                    contentContainerStyle={{ paddingBottom: 400 }}
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
                <View>
                    <View style={{ width: Width(100), backgroundColor: '#C6CFC9', height: heightcus, position: 'absolute', bottom: 0, left: 0, paddingBottom: paddingBotX, paddingHorizontal: 10 }}>
                        {this.Content_mess ?
                            <HTMLView
                                value={`<div>${this.Content_mess}</div>`}
                                stylesheet={{
                                    div: { fontSize: reText(15), color: colors.black, marginTop: 10 },
                                    a: { fontStyle: 'italic', fontSize: reText(15), color: colors.blueAvatar },
                                    p: { fontSize: reText(15), color: colors.black },
                                    span: {
                                        borderRadius: 5, fontWeight: 'bold',
                                    }
                                }}
                            // onLinkPress={(url) => Utils.nlog('clicked link: ', url)}
                            /> : null}
                        {this.Attachment.length > 0 ?
                            <View style={{ marginTop: 5 }}>
                                <Text style={{ marginBottom: 3 }}>Hình ảnh:</Text>
                                <FlatList
                                    horizontal={true}
                                    contentContainerStyle={{}}
                                    data={this.Attachment}
                                    renderItem={this._ImageForward}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                            </View> : null}
                        {this.Attachment_File.length > 0 ?
                            <View style={{ marginTop: 5 }}>
                                <Text style={{ marginBottom: 3 }}>File đính kèm:</Text>
                                <FlatList
                                    contentContainerStyle={{}}
                                    data={this.Attachment_File}
                                    renderItem={this._renderFile}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                            </View> : null}
                        {this.Videos.length > 0 ?
                            <View style={{ marginTop: 5 }}>
                                <Text style={{ marginBottom: 3 }}>Video:</Text>
                                <FlatList
                                    contentContainerStyle={{}}
                                    data={this.Videos}
                                    renderItem={this._renderVideo}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                            </View> : null}


                    </View>
                    <View style={{ width: Width(100), alignItems: 'center', height: 60 + paddingBotX, backgroundColor: '#C6CFC9', position: 'absolute', bottom: 0, left: 0, flexDirection: 'row', paddingBottom: paddingBotX, paddingHorizontal: 10 }}>
                        <FlatList
                            ref={ref => this.refListContactChecked = ref}
                            contentContainerStyle={{ marginRight: 10 }}
                            onContentSizeChange={() => this.refListContactChecked.scrollToEnd({ animated: true })}
                            horizontal={true}
                            data={listContactChecked}
                            renderItem={this._renderChild}
                            keyExtractor={(item, index) => index.toString()} />
                        <TouchableOpacity onPress={() => this._ForWard()} style={{ width: Width(12), height: Width(12), backgroundColor: colors.greenTab, justifyContent: 'center', alignItems: 'center', borderRadius: Width(20) }}>
                            <Image source={Images.ImageJee.icNextChat} style={{ width: Width(5), height: Width(5), tintColor: colors.white }} />
                        </TouchableOpacity>
                    </View>

                </View>
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
export default Utils.connectRedux(ForWard, mapStateToProps, true)
