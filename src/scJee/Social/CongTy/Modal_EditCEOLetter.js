import _ from 'lodash';
import React, { Component, createRef } from 'react';
import {
    Animated,
    BackHandler, Image, ScrollView, Text, TextInput, TouchableOpacity, View
} from "react-native";
import ImageCropPicker from 'react-native-image-crop-picker';
import { isIphoneX } from 'react-native-iphone-x-helper';
import HTML from 'react-native-render-html';
import { getDetailDSThongDiep, UpdateThongDiep } from '../../../apis/JeePlatform/Api_JeeSocial/apiJeeSocial';
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import { RootLang } from '../../../app/data/locales';
import { nkey } from '../../../app/keys/keyStore';
import Utils from '../../../app/Utils';
import UtilsApp from '../../../app/UtilsApp';
import IsLoading from '../../../components/IsLoading';
import { Images } from '../../../images';
import { colors } from '../../../styles';
import { reText, sizes } from '../../../styles/size';
import { Height, nstyles, paddingBotX, Width } from '../../../styles/styles';

const actionSheetRef_Image = createRef();

class Modal_EditCEOLetter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            opacity: new Animated.Value(0),
            data: Utils.ngetParam(this, 'data', ''),
            noiDung: '',
            images: [],
            title: '',
            id_User: '',
            userTag: [],
            nameuser: '',
            avatar: '',
            chiTietThongDiep: [],
            onEdit: false,
        }
        this.nthis = this.props.nthis;
        this.idthongdiep = Utils.ngetParam(this, 'idthongdiep', '')

    }

    componentDidMount = async () => {
        BackHandler.addEventListener("hardwareBackPress", this._goback);
        this._loadChiTiet_CEOLetter()
        await this.setState({
            id_User: await Utils.ngetStorage(nkey.UserId, ''),
            nameuser: await Utils.ngetStorage(nkey.nameuser, ''),
            avatar: await Utils.ngetStorage(nkey.avatar, ''),
        })
    }

    componentWillUnmount() {
        try {
            BackHandler.removeEventListener('hardwareBackPress', this._goback)
        }
        catch (error) { }
    }
    _goback = async () => {
        Utils.goback(this, null)
        return true
    }

    _loadChiTiet_CEOLetter = async () => {
        nthisLoading.show()
        let res = await getDetailDSThongDiep(this.idthongdiep?.id_submenu);
        // Utils.nlog("chi tiết Thong Diep edit-------------------------", res)
        if (res.status == 1) {
            nthisLoading.hide()
            this.setState({ chiTietThongDiep: res.data[0], noiDung: res.data[0]?.noidung, title: res.data[0]?.title, refreshing: false, })
        } else {
            nthisLoading.hide()
            this.setState({ refreshing: false, })
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
        }
    }

    _callback = async (objectType) => {
        await this.setState({
            objectType,
        })
    }

    _callback_UserTag = async (userTag) => {
        await this.setState({
            userTag,
        })
    }

    _callbackImage = async (images) => {
        await this.setState({
            images,
        })
    }

    _go_UserTag = () => {
        Utils.goscreen(this, 'Modal_UserTag', {
            callback: this._callback_UserTag, userTag: this.state.userTag
        })
    }

    _go_PickImage = () => {
        this._open_ImageGallery()
    }

    _open_ImageGallery = async () => {
        await ImageCropPicker.openPicker({
            multiple: true,
            waitAnimationEnd: false,
            sortOrder: 'asc',
            includeExif: true,
            forceJpg: true,
            compressImageQuality: 0.2,
            includeBase64: true,
            mediaType: 'photo'
        })
            .then((images) => {
                actionSheetRef_Image.current?.hide();
                this.setState({ images: [] })
                var imageMap = images.map((i) => {
                    Utils.nlog('received image', i);
                    return {
                        uri: i.path,
                        width: i.width,
                        height: i.height,
                        mime: i.mime,
                        base64: i.data,
                        name: i.path.split('/').slice(-1) + '',
                    };
                })
                this.setState({ images: this.state.images.concat(imageMap) }, () => Utils.nlog('image', this.state.images))
            }, async () => {
            }).catch((e) => Utils.nlog(e));
    }

    _XoaAnh = async (index) => {
        var { images } = this.state
        await this.setState({ images: images.slice(0, index).concat(images.slice(index + 1, images.length)) }, () => {
            if (_.size(this.state.images) == 0) {
                this.SWIPE_HEIGHT = this.SWIPE_HEIGHT - 50
            }
        })
    }

    _editCeoLetter = async () => {
        let strbody = JSON.stringify({
            "id_submenu": this.idthongdiep?.id_submenu,
            "title": this.state.title,
            "noidung": this.state.noiDung,
        })
        // Utils.nlog('body', strbody)
        nthisLoading.show()
        let res = await UpdateThongDiep(strbody)
        // Utils.nlog('res update bài =--=-=-==-=-=-=-', res)
        if (res.status == 1) {
            nthisLoading.hide()
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.JeeSocial.capnhatthanhcong, 1)
            this._goback()
            ROOTGlobal.LoadDanhSach_CeoLetter.LoadDSChiTiet_Ceo()
        } else {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
        }
    }

    _renderItem_ThaoLuan = ({ item, index }) => {
        return (
            <View style={{ justifyContent: 'space-between', height: Height(10), flexDirection: 'row' }}>
                <View style={[{ paddingRight: 10 }]}>
                    {
                        item.uri ? (<Image
                            style={{ width: Width(20), height: Height(10) }}
                            source={{ uri: item.uri }}
                            resizeMode='stretch'
                        />
                        ) : (
                                <Image
                                    style={{ width: Width(20), height: Height(10) }}
                                    source={{ uri: item.hinhanh }}
                                    resizeMode='stretch'
                                />
                            )
                    }
                    <TouchableOpacity onPress={() => {
                        this._XoaAnh(index)
                    }} style={{ position: 'absolute', top: 0, right: 10, marginTop: 5 }}>
                        <Image source={Images.ImageJee.icXoaAnh} resizeMode='contain' />
                    </TouchableOpacity>
                </View>

            </View >
        );
    }

    _CusTom_Bottom = (check = false) => {
        return (
            <View style={{ borderColor: '#707070', justifyContent: 'center', borderBottomWidth: 0.3, borderTopWidth: 0.3, paddingVertical: 15 }}>
                <View style={[{ flexDirection: "row", marginHorizontal: 15, justifyContent: 'space-between', }]}>
                    <View style={{}}>
                        <Text style={{ fontSize: reText(12), textAlign: 'center' }}>Thêm vào bài viết</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: 'center' }}>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: 'center' }}>
                            {
                                check == true ? (null) : (
                                    <TouchableOpacity style={{ paddingRight: 20 }}
                                        onPress={() => this._go_PickImage()} >
                                        <Image source={Images.ImageJee.icChonAnh}
                                            resizeMode='contain' style={nstyles.nIcon19} />
                                    </TouchableOpacity>
                                )
                            }
                            <TouchableOpacity
                                onPress={() => this.pickFiles()}
                                style={{ paddingRight: 20 }}>
                                <Image source={Images.ImageJee.icLink}
                                    resizeMode='contain' style={[nstyles.nIcon19, { paddingHorizontal: 2, tintColor: '#FF3D2E' }]} />
                            </TouchableOpacity >
                            <TouchableOpacity style={{}} onPress={() => this._go_UserTag()} >
                                <Image source={Images.ImageJee.icUserTag}
                                    resizeMode='contain' style={[nstyles.nIcon19, { paddingHorizontal: 2 }]} />
                            </TouchableOpacity >
                        </View>
                    </View>

                </View>
            </View>
        )
    }

    _render_View = () => {
        const { objectType, images, noiDung, timeSukien, dateSukien, userTag, nameuser, avatar, title, chiTietThongDiep } = this.state
        return (
            <View style={{ backgroundColor: colors.white, flex: 1 }}>
                <View
                    style={[nstyles.nHcontent, {
                        paddingHorizontal: 15,
                        height: isIphoneX() ? 80 : 60,
                        width: '100%',
                        borderBottomColor: colors.black_20_2,
                        borderBottomWidth: 0.3
                    }]} resizeMode='cover' >
                    <View style={[nstyles.nrow, {
                        flexDirection: 'row', flex: 1,
                        height: isIphoneX() ? 80 : 60,
                        justifyContent: 'center', alignItems: 'center'
                    }]}>
                        <TouchableOpacity
                            style={{
                                paddingRight: 20, height: isIphoneX() ? 80 : 60,
                                alignItems: 'center', justifyContent: 'center'
                            }}
                            activeOpacity={0.5}
                            onPress={this._goback}
                        >
                            <View style={{ flexDirection: 'row', }}>
                                <Image
                                    source={Images.ImageJee.icBack}
                                    resizeMode={'cover'}
                                    style={[{ tintColor: colors.black }]}
                                />
                            </View>
                        </TouchableOpacity>
                        <View
                            style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: 0,
                                height: isIphoneX() ? 80 : 60,
                                marginLeft: 10
                            }}>
                            <Text style={{
                                lineHeight: sizes.sText24,
                                fontSize: reText(15),
                                color: '#65676B',
                                fontWeight: "bold"
                            }}>{RootLang.lang.JeeSocial.thongdiepCeo}</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => this._editCeoLetter()}
                            style={[{ paddingLeft: 20, paddingVertical: 5 }]}>
                            <Text style={{ color: '#0E72D8', fontSize: reText(15), fontWeight: 'bold' }}>{RootLang.lang.JeeSocial.luu} </Text>
                        </TouchableOpacity>
                    </View>
                </View >

                <View style={{ flex: 1, justifyContent: "space-between", paddingBottom: paddingBotX }}>
                    <ScrollView style={{ flex: 1, }}>
                        <View style={{ paddingHorizontal: 5, }}>
                            <View style={{ padding: 10 }}>
                                <TextInput
                                    style={{
                                        color: "black",
                                        fontSize: reText(15),
                                        fontWeight: 'bold'
                                    }}
                                    onChangeText={(text) => {
                                        this.setState({ title: text, onEdit: true });
                                    }}
                                    placeholder={RootLang.lang.JeeSocial.tieudeCeo}
                                    autoCorrect={false}
                                    multiline={true}
                                    underlineColorAndroid="rgba(0,0,0,0)"
                                >
                                    {title}
                                </TextInput>
                            </View>
                            <View style={{}}>
                                <TouchableOpacity
                                    onPress={() => {
                                        Utils.goscreen(this, 'Modal_EditHTML', {
                                            content: noiDung,
                                            title: 'Nhập nội dung',
                                            isEdit: true,
                                            isVoice: false,
                                            callback: (html) => {
                                                this.setState({ noiDung: html })
                                            }
                                        })
                                    }}
                                    style={{ marginTop: 3, backgroundColor: colors.white, padding: 10 }}>
                                    <Text style={{ fontSize: sizes.sText12, color: '#65676B', fontWeight: 'bold', marginBottom: 5 }}>Nội dung</Text>
                                    {noiDung ?
                                        <View style={{ backgroundColor: '#F7F8FA' }}>
                                            <HTML source={{ html: noiDung }} containerStyle={{ paddingHorizontal: 10, paddingVertical: 10 }} />
                                        </View> :
                                        <View style={{ height: Height(10), backgroundColor: '#F7F8FA', justifyContent: 'center', alignItems: 'center' }}>
                                            <View style={{ borderWidth: 1, borderColor: colors.blueColor, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5 }}>
                                                <Text style={{ fontSize: reText(12), color: colors.blueColor }}>{RootLang.lang.JeeSocial.chuaconoidungmota}</Text>
                                            </View>
                                        </View>}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                    {/* <View style={{ justifyContent: 'flex-end', bottom: 0 }}>
                        {this._CusTom_Bottom()}
                    </View> */}
                </View>
            </View>
        )
    }

    render() {
        var { opacity } = this.state
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: colors.white, width: Width(100), }]}>
                {this._render_View()}
                <IsLoading />
            </View >
        )
    }
}

const mapStateToProps = state => ({
    lang: state.changeLanguage.language,
});
export default Utils.connectRedux(Modal_EditCEOLetter, mapStateToProps, true)