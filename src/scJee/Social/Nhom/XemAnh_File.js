import React, { Component } from 'react';
import {
    BackHandler, Image, TextInput, StyleSheet, Text, TouchableOpacity, View, FlatList, Linking
} from "react-native";
import { GetFile_inGroup, GetImage_inGroup, GetVideo_inGroup } from '../../../apis/JeePlatform/Api_JeeSocial/apiJeeSocial';
import { RootLang } from '../../../app/data/locales';
import Utils from '../../../app/Utils';
import UtilsApp from '../../../app/UtilsApp';
import HeaderComStackV2 from '../../../components/HeaderComStackV2';
import IsLoading from '../../../components/IsLoading';
import { Images } from '../../../images';
import { ImgComp } from '../../../images/ImagesComponent';
import { colors } from '../../../styles';
import { reText } from '../../../styles/size';
import { nstyles, paddingBotX, Width, nwidth } from '../../../styles/styles';
import Video from '../ComponentSocail/Video'

class XemAnh_File extends Component {
    constructor(props) {
        super(props);
        this.title = Utils.ngetParam(this, 'title', '')
        this.data = Utils.ngetParam(this, 'idgroup', '')
        this.menu = Utils.ngetParam(this, 'menu', '')
        this.state = {
            listImage_File: [],
            filteredData: [],
            searchText: ''
        }
    }

    componentDidMount = async () => {
        nthisLoading.show()
        BackHandler.addEventListener("hardwareBackPress", this._goback);
        this._LoadAnh_File()
    }

    componentWillUnmount() {
        try {
            BackHandler.removeEventListener('hardwareBackPress', this._goback)
        }
        catch (error) {
        }
    }

    _LoadAnh_File = async () => {
        let res = ''
        if (this.menu == 4) {
            res = await GetImage_inGroup(this.data)
            // Utils.nlog('res GetImage_inGroup', res)
        }
        else if (this.menu == 5) {
            res = await GetFile_inGroup(this.data)
            // Utils.nlog('res GetFile_inGroup', res)
        }
        else {
            res = await GetVideo_inGroup(this.data)
            // Utils.nlog('res GetVideo_inGroup', res)
        }
        if (res.status == 1) {
            if (this.menu == 4) {
                let data = []
                res.data.map(item => {
                    if (item.hinhanh != '')
                        data.push(item)
                })
                this.setState({
                    listImage_File: data
                })
            }
            else {
                this.setState({
                    listImage_File: res.data
                })
            }
            nthisLoading.hide()
        }
        else {
            nthisLoading.hide()
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.thongbaochung.loilaydulieu, 2)
            this.goback()
        }
        return true
    }

    _goback = async () => {
        Utils.goback(this, null)
        return true
    }

    _renderImage = ({ item, index }) => {
        return (
            <TouchableOpacity onPress={() => this.onPressItem(item, 1)}
                key={index} style={{
                    width: Width(30), shadowColor: "#000",
                    height: Width(30),
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
                        source={{ uri: item.hinhanh }}
                        style={{ width: '100%', height: '100%', borderRadius: 4 }}></Image>
                </View>
            </TouchableOpacity >
        );
    }

    onPressItem = (item, loai = 1) => {
        switch (loai) {
            case 1:
                Utils.goscreen(this, 'Modal_ShowListImage', { ListImages: [{ url: item.hinhanh }], index: 0 });
                break;
            case 2:
                Utils.goscreen(this, 'Modal_PlayMedia', { source: encodeURI(item.path) });
                break;
            case 3:
                Linking.openURL(item.link)
                // Utils.openUrl(item.link)
                break;
            default:
                break;
        }
    }

    _renderImageFile = ({ item, index }) => {
        return (
            <TouchableOpacity onPress={() => this.onPressItem(item, 3)}
                key={index}
                style={{
                    width: Width(30), shadowColor: "#000",
                    height: Width(30),
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
                    <Image source={UtilsApp._returnImageFile(item.link)} style={{ width: Width(10), height: Width(10), borderRadius: 4 }} />
                    <View style={{ flex: 1, paddingHorizontal: 10, position: 'absolute', bottom: 5 }}>
                        <Text style={{ fontSize: reText(10), color: colors.black_80 }} numberOfLines={1}>
                            {item.filename}</Text>
                    </View>
                </View>
            </TouchableOpacity >
        );
    }

    _renderVideo = ({ item, index }) => {
        return (
            <Video key={index} uri={encodeURI(item.path)} onpress={() => this.onPlayVideo(encodeURI(item.path))} > </Video>
        )
    }

    SearchData = async (searchText) => {
        this.setState({ searchText: searchText });
        let filteredData = this.state.listImage_File.filter((item) =>
            Utils.removeAccents(item['filename'])
                .toUpperCase()
                .includes(Utils.removeAccents(searchText.toUpperCase())),
        );
        this.setState({ filteredData: filteredData });
    }

    render() {
        const { listImage_File, filteredData, searchText } = this.state
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: '#E4E6EB', }]}>
                <HeaderComStackV2
                    nthis={this}
                    title={this.title}
                    iconLeft={Images.ImageJee.icBack}
                    onPressLeft={this._goback}
                    styBorder={{
                        borderBottomColor: colors.black_20,
                        borderBottomWidth: 0.5
                    }}
                />
                <View style={[styles.container_con, { paddingBottom: paddingBotX, }]}>
                    {
                        this.menu == 5 && <View style={styles.search}>
                            <Image source={Images.icSearch} />
                            <TextInput value={searchText}
                                numberOfLines={1}
                                style={styles.textInput}
                                placeholder={RootLang.lang.JeeWork.timkiem}
                                onChangeText={this.SearchData} />
                            {searchText != "" ?
                                <TouchableOpacity onPress={() => {
                                    this.setState({ searchText: "", filteredData: [] })
                                }} style={styles.xoa}>
                                    <Text style={{ fontSize: reText(12), fontWeight: 'bold' }}>X</Text>
                                </TouchableOpacity> : null}
                        </View>
                    }
                    <FlatList
                        extraData={this.state}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        style={[styles.khung, {}]}
                        data={filteredData && filteredData.length > 0
                            ? filteredData
                            : listImage_File}
                        renderItem={this.menu == 4 ? this._renderImage : this.menu == 6 ? this._renderVideo : this._renderImageFile}
                        keyExtractor={(item, index) => index.toString()}
                        numColumns={3}
                    // ListEmptyComponent={this.state.listUser.length == 0 ? <ListEmptyLottie_Social_Group style={{ justifyContent: 'center', alignItems: 'center', }} textempty={RootLang.lang.JeeSocial.khongcothanhviennao} /> : null}
                    />
                </View>
                <IsLoading />
            </View >

        )
    }
}

const styles = StyleSheet.create({
    container_con: {
        flex: 1, backgroundColor: colors.white
    },
    khung: {
        paddingTop: 10, paddingLeft: 5,
    },
    search: {
        flexDirection: 'row', backgroundColor: colors.black_5, marginHorizontal: 15, marginTop: 10, paddingHorizontal: 10, borderRadius: 10,
        alignItems: 'center',
    },
    textInput: {
        flex: 1, paddingVertical: Platform.OS == 'ios' ? 10 : 5, paddingHorizontal: 5, fontSize: reText(16)
    },
    xoa: { width: Width(5), backgroundColor: colors.black_20_2, height: Width(5), borderRadius: 10, justifyContent: 'center', alignItems: 'center' },

});
const mapStateToProps = state => ({
    lang: state.changeLanguage.language,
});
export default Utils.connectRedux(XemAnh_File, mapStateToProps, true)
