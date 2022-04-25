import React, { Component } from 'react';
import { Dimensions, Platform, Text, TouchableOpacity, View, BackHandler, Modal, TextInput, StyleSheet, Image } from "react-native";
import { SceneMap, TabView } from 'react-native-tab-view';
import { DetailDuAn, getDuAnPhongBan, postUploadTaiLieu } from '../../../../apis/JeePlatform/API_JeeWork/apiDuAn';
import { RootLang } from '../../../../app/data/locales';
import Utils from '../../../../app/Utils';
import UtilsApp from '../../../../app/UtilsApp';
import HeaderComStackV2 from '../../../../components/HeaderComStackV2';
import IsLoading from '../../../../components/IsLoading';
import { Images } from '../../../../images';
import { colors } from '../../../../styles';
import { reText, sizes } from '../../../../styles/size';
import { Height, nstyles, Width, paddingBotX } from '../../../../styles/styles';
import BaoCao from './BaoCao';
import * as Animatable from 'react-native-animatable'
import CongViec from './CongViec';
import TaiLieu from './TaiLieu';
import ActionSheet from 'react-native-actions-sheet'
import ImageCropPicker from 'react-native-image-crop-picker';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
class ChiTietDuAn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            editable: false,
            tencongviec: '',
            routes: [
                { key: 'congviec', title: RootLang.lang.JeeWork.congviec },
                { key: 'tailieu', title: RootLang.lang.JeeWork.tailieu },
                // { key: 'baocao', title: 'Báo cáo' },
            ],
            item: '',
            isInsertLink: false,
            link: '',
            nfile: { filename: '', strBase64: '' },
            nimage: { imagename: '', strBase64: '' }
        };
        this.item = Utils.ngetParam(this, "item", '')
        this.check = Utils.ngetParam(this, "item") //Biến này check thôi
        this.id_row = Utils.ngetParam(this, "id_row", '')

    }


    async componentWillMount() {
        this.backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            this.backAction
        );
        if (!this.item) {
            const res = await DetailDuAn(this.id_row)
            if (res.status == 1) {
                this.item = res.data
                this.setState({ item: res.data })
            }
            else {
                UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, res.error ? res.error.message : RootLang.lang.JeeWork.laydulieuthatbai, 2)
            }
        }
        else {
            return -1;
        }


    }

    componentWillUnmount() {
        this.backHandler.remove();
    }

    backAction = () => {
        this.check ? Utils.goback(this) : Utils.goscreen(this, 'sw_HomePage')
        return true;
    };

    _renderScene = SceneMap({

        congviec: () => <CongViec nthis={this} item={this.item ? this.item : this.state.item} />,
        tailieu: () => <TaiLieu nthis={this} ref={ref => this.refTaiLieu = ref} />,
        // baocao: () => <BaoCao nthis={this} item={this.item} />,

    });

    _renderTabBar = props => {
        var { index = 0 } = props.navigationState
        return (<View style={[nstyles.shadowTabTop, {
            height: Height(6), flexDirection: 'row',
            width: Width(100),
        }]}>
            {
                props.navigationState.routes.map((x, i) => {
                    return (
                        <TouchableOpacity
                            key={i.toString()}
                            onPress={() => { this.setState({ index: i }) }}
                            style={{
                                flex: 1,
                                backgroundColor: colors.white,
                                flexDirection: 'row',
                                // height: Height(6),
                                borderBottomWidth: i == index ? 2 : 0,
                                borderColor: i == index ? '#0E72D8' : colors.white,
                                width: Width(100)

                            }}>
                            {/* <View style={{ height: 40, width: 0.5, backgroundColor: colors.veryLightPinkTwo }}></View> */}
                            <View style={{ flex: 1, flexDirection: 'row', width: Width(100) }}>
                                <View style={{ flex: 1 }}></View>
                                <View style={{ justifyContent: 'center', alignItems: 'center', width: Width(25), maxWidth: Width(30) }}>
                                    {i == index ? (
                                        <Text style={{ fontWeight: 'bold', fontSize: reText(14), color: '#0E72D8', textAlign: 'center', }}>{x.title}</Text>
                                    ) : (
                                        <Text style={{ fontSize: reText(14), textAlign: 'center', color: colors.colorTitleNew }}>{x.title}</Text>
                                    )}
                                    <View style={{ height: 2, backgroundColor: i == index ? '#0E72D8' : '#fff', }}></View>
                                </View>
                                <View style={{ flex: 1 }}></View>
                            </View>
                        </TouchableOpacity>
                    )
                })
            }
        </View >)
    }
    _upload = async (type) => { //type: 1-link
        const { link, nfile, nimage } = this.state
        var tempLink = ''
        if (type == 1) {
            if (link == '') {
                UtilsApp.MessageShow('Thông báo', 'Link không được để trống!', 4)
                return
            }
            tempLink = Utils.isUrlCus(link)
            Utils.nlog(tempLink)
            if (tempLink == '') {
                UtilsApp.MessageShow('Thông báo', 'Link không đúng cú pháp!', 4)
                return
            }
        }
        this.setState({ isInsertLink: false })
        const body = {
            "_isEditMode": false,
            "_userId": 0,
            "object_type": 4,
            "object_id": this.id_row,
            "item": {
                "_isEditMode": false,
                "_userId": 0,
                "strBase64": nfile.strBase64 ? nfile.strBase64 : nimage.strBase64 ? nimage.strBase64 : '',
                "link_cloud": tempLink,
                "filename": tempLink ? tempLink : nfile.filename ? nfile.filename : nimage.imagename ? nimage.imagename : '',
                "IsAdd": true
            }
        }
        const res = await postUploadTaiLieu(body)
        if (res.status == 1) {
            this.refTaiLieu._TaiLieuDuAn()
            this.refTaiLieu._onFrist()
            UtilsApp.MessageShow('Thông báo', 'Thêm tài liệu thành công', 1)
        }
        else {
            UtilsApp.MessageShow('Thông báo', res?.error?.message ?? 'Lỗi truy xuất dữ liệu!', 2)
        }
        this.setState({ link: '', nfile: { filename: '', strBase64: '' }, nimage: { imagename: '', strBase64: '' } })
    }
    _pickImage = async () => {
        this.refChonDuLieu.hide()
        setTimeout(async () => {
            await ImageCropPicker.openPicker({
                multiple: false,
                waitAnimationEnd: false,
                sortOrder: 'asc',
                includeExif: true,
                forceJpg: true,
                compressImageQuality: 0.2,
                includeBase64: true,
                mediaType: 'any'
            })
                .then(async (images) => {
                    let videoBase64 = await Utils.getBase64FromUrl(images.path)
                    var imageMap = {
                        imagename: Platform.OS == 'ios' ? images.filename : images.path.substring(images.path.lastIndexOf('/') + 1),
                        strBase64: images.data ? images.data : videoBase64.substring(videoBase64.indexOf(",")).replace(',', '')
                    };
                    this.setState({ nimage: imageMap }, () => this._upload())
                }).catch()
        }, 400);
    }
    _pickFile = async () => {
        this.refChonDuLieu.hide()
        setTimeout(async () => {
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
                this.setState({ nfile: { filename: mang[0].filename, strBase64: mang[0].strBase64 } }, () => this._upload())
            } catch (err) {
                if (DocumentPicker.isCancel(err)) {
                }
            }
        }, 400);
    }
    _insertLink = (value) => {
        this.setState({ link: value })
    }
    _showInsertLink = async () => {
        this.refChonDuLieu.hide()
        setTimeout(() => {
            this.setState({ isInsertLink: !this.state.isInsertLink })
        }, 400);
    }
    render() {
        const { listBaiDang, showload, refreshing, isInsertLink } = this.state;
        return (
            <View style={[nstyles.ncontainer, { width: Width(100), paddingTop: Platform.OS == 'ios' ? 10 : 5, backgroundColor: "white" }]}>
                <View style={{ flexGrow: 1, backgroundColor: '#E4E6EB', height: Height(100) }}>
                    <HeaderComStackV2
                        nthis={this} title={this.item.title}
                        // iconRight={Images.ImageJee.icBoLocSocial}
                        iconLeft={Images.ImageJee.icBack}
                        onPressLeft={() => { this.check ? Utils.goback(this) : Utils.goscreen(this, 'sw_HomePage') }}
                        // styIconRight={[nstyles.nIconH18W22, {}]}
                        styBorder={{
                            borderBottomColor: colors.black_20_2,
                            borderBottomWidth: 0.3,

                        }}
                        iconRight={this.state.index == 1 ? Images.ImageJee.icAddFile : null}
                        styIconRight={{ width: Width(6), height: Width(6), tintColor: colors.colorTitleNew }}
                        // onPressRight={this._showInsertLink}
                        onPressRight={() => this.refChonDuLieu.show()}
                    />
                    {this.item || this.state.item ?
                        <TabView
                            lazy
                            navigationState={this.state}
                            renderScene={this._renderScene}
                            renderTabBar={this._renderTabBar}
                            onIndexChange={index => this.setState({ index })}
                            initialLayout={{ width: Dimensions.get('window').width }}
                        />
                        : null}
                </View>
                <Modal
                    animationType='fade'
                    visible={isInsertLink}
                    transparent={true}>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
                        <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, right: 0, elevation: 1 }} onTouchEnd={() => this.setState({ isInsertLink: false })}></View>
                        <Animatable.View
                            style={{
                                width: Width(80), height: 150, backgroundColor: 'white', borderRadius: 15, padding: 15,
                                elevation: 3, shadowOffset: { width: 3, height: 3 }, shadowColor: 'black', shadowOpacity: 0.8, shadowRadius: 3,
                            }}
                            animation={'zoomIn'}
                            duration={500}
                            useNativeDriver={true}>
                            <Text style={{ fontWeight: 'bold', fontSize: reText(13), marginBottom: 10 }}>Đường dẫn chứa tài liệu: </Text>
                            <TextInput
                                style={{ padding: 0, paddingHorizontal: 10, borderWidth: 0.5, borderColor: colors.black_70, borderRadius: 5, height: 40 }}
                                onChangeText={(value) => this._insertLink(value)}
                                placeholder={'Đường dẫn chứa tài liệu'}
                            >

                            </TextInput>
                            <TouchableOpacity
                                style={{
                                    alignItems: 'center', justifyContent: 'center', backgroundColor: '#2CBBFF', borderRadius: 5, height: 35,
                                    alignSelf: 'center', bottom: 10, position: 'absolute', paddingHorizontal: 10
                                }}
                                onPress={() => this._upload(1)}
                            >
                                <Text style={{ fontSize: 16, fontWeight: '500', color: 'white' }}>Lưu và đóng</Text>
                            </TouchableOpacity>
                        </Animatable.View>
                    </View>
                </Modal>
                <IsLoading />
                <ActionSheet ref={ref => this.refChonDuLieu = ref}>
                    <View style={{ paddingBottom: paddingBotX }}>
                        <TouchableOpacity style={styles.btnChonDuLieu} onPress={() => this._showInsertLink()}>
                            <Image source={Images.ImageJee.icCloud} style={[nstyles.nIcon24, { marginHorizontal: 10, tintColor: colors.blueColor }]} resizeMode={'contain'}></Image>
                            <Text style={styles.txtChonDuLieu}>{RootLang.lang.thongbaochung.themtuduongdan}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnChonDuLieu} onPress={this._pickFile}>
                            <Image source={Images.ImageJee.icLink} style={[nstyles.nIcon20, { marginHorizontal: 10, tintColor: colors.blueColor }]} resizeMode={'contain'}></Image>
                            <Text style={styles.txtChonDuLieu}>{RootLang.lang.thongbaochung.themteptailieu}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnChonDuLieu} onPress={this._pickImage}>
                            <Image source={Images.ImageJee.icPictureChat} style={[nstyles.nIcon20, { marginHorizontal: 10, tintColor: colors.blueColor }]} resizeMode={'contain'}></Image>
                            <Text style={styles.txtChonDuLieu}>{RootLang.lang.thongbaochung.themhinhvavideotailieu}</Text>
                        </TouchableOpacity>

                    </View>
                </ActionSheet>
            </View >
        );
    }
};
const styles = StyleSheet.create({
    btnChonDuLieu: {
        paddingVertical: 15, borderBottomColor: colors.veryLightPinkTwo, borderBottomWidth: 0.5, flexDirection: 'row', alignItems: 'center'
    },
    txtChonDuLieu: {
        fontSize: reText(16), color: colors.colorTitleNew
    }
})

const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});


export default Utils.connectRedux(ChiTietDuAn, mapStateToProps, true)


