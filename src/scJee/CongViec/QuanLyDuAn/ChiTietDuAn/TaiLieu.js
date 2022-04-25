import React, { Component } from 'react';
import { FlatList, Image, Linking, Platform, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { GetTaiLieuDuAn } from '../../../../apis/JeePlatform/API_JeeWork/apiDuAn';
import { RootLang } from '../../../../app/data/locales';
import Utils from '../../../../app/Utils';
import { Images } from '../../../../images';
import { colors } from '../../../../styles';
import { reText, sizes } from '../../../../styles/size';
import { Height, nstyles, Width } from '../../../../styles/styles';
import { ActionSheetCustom } from '@alessiocancian/react-native-actionsheet'
import UtilsApp from '../../../../app/UtilsApp';
import { DeleteXoaFileDinhKem, UpdateFileDinhkem } from '../../../../apis/JeePlatform/API_JeeWork/apiCongViecCaNhan';
import ImageCropPicker from 'react-native-image-crop-picker';
import DocumentPicker from 'react-native-document-picker';
import ActionSheet from '@alessiocancian/react-native-actionsheet'
import { nkey } from '../../../../app/keys/keyStore';
import ListEmptyLottie from '../../../../components/NewComponents/ListEmptyLottie';
var RNFS = require('react-native-fs');

const CANCEL_INDEX = 0
const DESTRUCTIVE_INDEX = 4

// const title = RootLang.lang.JeeWork.bancomuonthuchien

class TaiLieu extends Component {
    constructor(props) {
        super(props);
        this.nthis = this.props.nthis

        this.state = {
            item: Utils.ngetParam(this.nthis, "item", {}),
            isLoading: false,
            listStatus: [],
            refreshing: false,
            empty: true,
            showload: false,
            listTaiLieu: [],
            goFirst: true,
            option:
                [
                    RootLang.lang.JeeWork.huy,
                    RootLang.lang.JeeWork.taifilexuong,
                    RootLang.lang.JeeWork.xoafiledinhkem
                ],
            indexRed: 2
        };
    }

    async componentDidMount() {

        this.setState({ isLoading: true })

        await this._TaiLieuDuAn().then(res => {
            if (res == true) {
                this.setState({ isLoading: false })
            }
        });

    }

    _onFrist = () => {
        this.setState({ goFirst: false })
    }
    _TaiLieuDuAn = async () => {
        // var { item } = this.state
        this.setState({ empty: true })
        const res = await GetTaiLieuDuAn(this.nthis.item?.id_row)
        if (res.status == 1) {
            this.setState({
                listTaiLieu: res.data,
                refreshing: false,
                empty: true,
                showload: false,
            })
        }
        else {
            this.setState({ refreshing: false, showload: false, empty: true })
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
        }
        return true
    }

    handlePress = (indexAt) => {
        var item = this.ActionSheet.state.item
        var rowID = this.ActionSheet.state.rowID
        var index = this.ActionSheet.state.index
        var path = this.ActionSheet.state.path
        var checkImageVideo = this.ActionSheet.state.haveImageVideo
        var haveMusic = this.ActionSheet.state.haveMusic
        var isVideo = this.ActionSheet.state.isVideo
        var link_cloud = this.ActionSheet.state.link_cloud
        if (checkImageVideo) {
            if (indexAt == 2) {
                try {
                    Linking.openURL(path)
                } catch (error) {
                    UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, error, 2)
                }

            }
            if (indexAt == 3) {
                this._XoaFileDinhkem(rowID, index)
            }
            if (indexAt == 1) {
                UtilsApp.showImageZoomViewer(this.nthis, path)
            }
            else null
        }
        else if (haveMusic || isVideo) {

            if (indexAt == 2) {
                try {
                    Linking.openURL(path)
                } catch (error) {
                    UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, error, 2)
                }

            }
            if (indexAt == 3) {
                this._XoaFileDinhkem(rowID, index)
            }
            if (indexAt == 1) {
                Utils.goscreen(this.nthis, 'Modal_PlayMedia', { source: encodeURI(String(path)) })
            }
            else null
        }
        else if (link_cloud) {
            if (indexAt == 2) {
                this._XoaFileDinhkem(rowID, index)
            }
            if (indexAt == 1) {
                if (Utils.isUrlCus(item.link_cloud))
                    Utils.openUrl(item.link_cloud)
                else
                    UtilsApp.MessageShow("Thông báo", "Đường dẫn tài liệu không đúng", 3)
            }
            else null
        }
        else {
            if (indexAt == 1) {
                try {
                    Linking.openURL(path)
                } catch (error) {
                    UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, error, 2)
                }

            }
            if (indexAt == 2) {
                this._XoaFileDinhkem(rowID, index)
            }
            else null
        }

    }

    _XoaFileDinhkem = async (id, index) => {
        var { listTaiLieu } = this.state

        this.setState({ isLoading: true })
        const res = await DeleteXoaFileDinhKem(id)

        if (res.status == 1) {
            await this._TaiLieuDuAn().then(res => {
                if (res == true) {
                    UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, RootLang.lang.JeeWork.xoafiledinhkemthanhcong, 1)
                }
            });

        }
        else {
            this.setState({ isLoading: false })
            UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, res.error ? res.error.message : RootLang.lang.JeeWork.xoathatbaivuilong, 2)
        }
    }

    _uploadFile = (indexAt) => {
        if (indexAt == 1) {
            setTimeout(() => {
                this._open_ImageGallery().then(res => {
                    if (this.state.imagePicked) {
                        this._updateFileDinhKem(this.state.images)
                    }
                    else null
                })
            }, 500);
        }
        if (indexAt == 2) {
            setTimeout(() => {
                this.MultiFilePicker().then(res => {
                    if (this.state.filePicked) {
                        this._updateFileDinhKem(this.state.file)
                    }
                })
            }, 500);
        }
    }


    _open_ImageGallery = async () => {
        await ImageCropPicker.openPicker({
            multiple: false,
            waitAnimationEnd: false,
            sortOrder: 'asc',
            includeExif: true,
            forceJpg: true,
            compressImageQuality: 0.2,
            includeBase64: true,
            mediaType: 'photo'
        })
            .then((images) => {
                var imageMap = {
                    filename: Platform.OS == 'ios' ? images.filename : images.path.substring(images.path.lastIndexOf('/') + 1),
                    strBase64: images.data
                };
                this.setState({ images: imageMap }, () => {
                    this.setState({ imagePicked: true })
                })
            }).catch((e) => this.setState({ imagePicked: false }));
    }

    _updateFileDinhKem = async (data) => {
        var { Attachments, ChiTietCongViec, item } = this.state
        this.setState({ isLoading: true })
        var body = {
            item: data,
            object_type: 4,
            // 1: work,2: topic, 3:comment,
            object_id: item.id_row,
            id_user: await Utils.ngetStorage(nkey.UserId, ''),
        }
        body = JSON.stringify(body)
        const res = await UpdateFileDinhkem(body)
        if (res.status == 1) {
            this.setState({ isLoading: false }, () => {
                UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, RootLang.lang.JeeWork.uploadfilethanhcong, 1)
                this._TaiLieuDuAn()
            })
        }
        else {
            this.setState({ isLoading: false }, () => {
                UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, res.error ? res.error.message : RootLang.lang.JeeWork.uploadfilethatbaivuilong, 2)
            })
        }
        return true
    }

    MultiFilePicker = async () => {
        try {
            const results = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });
            // this.SWIPE_HEIGHT = this.SWIPE_HEIGHT + 20
            // this.setState({ files: this.state.files.concat(results) })
            const filePath = Platform.OS == "android" ? results.uri : results.uri.replace("file://", "")
            const strBase64 = await RNFS.readFile(filePath, "base64")
            var file = ({
                filename: results.name,
                strBase64: strBase64
            })
            this.setState({ file: file }, () => { this.setState({ filePicked: true }) })
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                this.setState({ filePicked: false })
            }
        }
    }

    _renderTaiLieuTrongCongViec = ({ item, index }) => {
        return (
            <TouchableOpacity key={index} style={{
                backgroundColor: colors.white, flex: 1, height: Height(7), justifyContent: 'space-between', paddingHorizontal: 10,
                flexDirection: 'row', borderBottomWidth: 0.8, borderColor: '#D1D1D1', width: Width(100)
            }}
                onPress={() => {
                    var duoiFile = String(item.filename).split('.').slice(-1).toString()
                    if (duoiFile == 'jpg' || duoiFile == 'png' || duoiFile == 'PNG' || duoiFile == 'JPG' || duoiFile == 'HEIC' || duoiFile == 'JPEG' || duoiFile == 'jpeg') {

                        this.setState({
                            option: [
                                RootLang.lang.JeeWork.huy,
                                RootLang.lang.JeeWork.xem,
                                RootLang.lang.JeeWork.taifilexuong,
                                RootLang.lang.JeeWork.xoafiledinhkemthanhcong
                            ],
                            indexRed: 3
                        }, () => {
                            this.ActionSheet.setState({ item: item, rowID: item.id_row, index: index, path: item.path, haveImageVideo: true, haveMusic: false, isVideo: false }, () => {
                                this.ActionSheet.show()
                            })
                        })
                    }
                    else if (duoiFile == 'mp3') {

                        this.setState({
                            option: [
                                RootLang.lang.JeeWork.huy,
                                RootLang.lang.JeeWork.nghe,
                                RootLang.lang.JeeWork.taifilexuong,
                                RootLang.lang.JeeWork.xoafiledinhkem
                            ],
                            indexRed: 3
                        }, () => {
                            this.ActionSheet.setState({ item: item, rowID: item.id_row, index: index, path: item.path, haveMusic: true, isVideo: false, haveImageVideo: false, link_cloud: '' }, () => {
                                this.ActionSheet.show()
                            })
                        })
                    }
                    else if (duoiFile == 'mp4' || duoiFile == 'MP4' || duoiFile == 'mov' || duoiFile == 'MOV') {

                        this.setState({
                            option: [
                                RootLang.lang.JeeWork.huy,
                                RootLang.lang.JeeWork.xem,
                                RootLang.lang.JeeWork.taifilexuong,
                                RootLang.lang.JeeWork.xoafiledinhkem
                            ],
                            indexRed: 3
                        }, () => {
                            this.ActionSheet.setState({ item: item, rowID: item.id_row, index: index, path: item.path, isVideo: true, haveMusic: false, haveImageVideo: false, link_cloud: '' }, () => {
                                this.ActionSheet.show()
                            })
                        })
                    }
                    else if (item.link_cloud) {
                        // Utils.openUrl(item.link_cloud)
                        this.setState({
                            option: [
                                RootLang.lang.JeeWork.huy,
                                RootLang.lang.JeeWork.molink,
                                RootLang.lang.JeeWork.xoafiledinhkem
                            ],
                            indexRed: 2
                        }, () => {
                            this.ActionSheet.setState({ item: item, rowID: item.id_row, index: index, link_cloud: item.link_cloud, isVideo: false, haveMusic: false, haveImageVideo: false }, () => {
                                this.ActionSheet.show()
                            })
                        })
                    }
                    else {
                        this.setState({
                            option: [
                                RootLang.lang.JeeWork.huy,
                                RootLang.lang.JeeWork.taifilexuong,
                                RootLang.lang.JeeWork.xoafiledinhkem
                            ],
                            indexRed: 2
                        }, () => {
                            this.ActionSheet.setState({ rowID: item.id_row, index: index, path: item.path, haveImageVideo: false, isVideo: false, link_cloud: '' }, () => {
                                this.ActionSheet.show()
                            })
                        })
                    }
                }}
            >
                <View style={{ justifyContent: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', width: Width(68), }}>
                        <Image source={UtilsApp._returnImageFile(item.filename)} style={{ width: Width(7), height: Width(7) }} />
                        <Text style={{ fontSize: sizes.sText14, paddingLeft: 10, width: Width(60), color: colors.colorTitleNew }}>{item.filename ? item.filename : "..."}</Text>
                    </View>
                </View>
                <View style={{ justifyContent: 'center', width: Width(32), alignItems: 'center' }}>
                    <Text style={{ fontSize: sizes.sText11, color: colors.black_50, paddingTop: 5 }}>{item.CreatedDate ? item.CreatedDate : "..."}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        const { showload, refreshing, listTaiLieu, empty, goFirst } = this.state;
        return (
            <TouchableWithoutFeedback
                delayLongPress={0}
                // onPressOut={() => { this.setState({ editable: false }) }}
                style={[nstyles.ncontainer, { backgroundColor: colors.white, width: Width(100), }]}>

                <ScrollView
                    ref={ref => { this.scrollView = ref }}
                    onContentSizeChange={() => goFirst ? null : this.scrollView.scrollToEnd({ animated: true })}
                    nestedScrollEnabled={true} keyboardShouldPersistTaps={"handled"} style={{ backgroundColor: colors.white, marginTop: 3, flex: 1 }}>
                    {/* <View style={{ backgroundColor: colors.white, paddingLeft: 10, flexDirection: 'row', width: Width(100), paddingVertical: 5 }}>
                        <View style={{ justifyContent: 'center' }}>
                            <TouchableOpacity
                                onPress={() => {
                                    this.ActionSheetDinhKem.show()
                                }}

                                style={{ backgroundColor: '#0E72D8', flexDirection: 'row', width: Width(75), padding: 10, alignItems: 'center', justifyContent: 'center', borderRadius: 20, }}>
                                <Image source={Images.ImageJee.icThemMoi} resizeMode='contain' style={[{}]} />
                                <Text style={{ fontSize: sizes.sText12, color: colors.white, textAlign: 'center', fontWeight: 'bold', paddingLeft: 10 }}>Thêm mới</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <TouchableOpacity
                                style={{ padding: 5, alignItems: 'center', justifyContent: 'center', }}>
                                <Image source={Images.ImageJee.icTimKiemTheMoi} resizeMode='contain' style={[{}]} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ padding: 5, alignItems: 'center', justifyContent: 'center', }}>

                                <Image source={Images.ImageJee.icLoc} resizeMode='contain' style={[{}]} />

                            </TouchableOpacity>
                        </View>
                    </View> */}

                    <View style={{ backgroundColor: colors.white }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, backgroundColor: colors.white, height: Height(5) }}>
                            <View style={{ justifyContent: 'center' }}>
                                <Text style={{ fontSize: sizes.sText12, color: '#65676B', fontWeight: 'bold', paddingLeft: 10, }}>{RootLang.lang.JeeWork.tailieuchung}</Text>
                            </View>
                            <View style={{ justifyContent: 'center', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 999, borderWidth: 0.5, width: Width(7), height: Width(7), alignSelf: 'center', borderColor: colors.colorTitleNew }}>
                                <Text style={{ fontSize: reText(15), color: colors.colorTitleNew }}>{listTaiLieu.length}</Text>
                                {/* <Image source={Images.ImageJee.icIconDropDown} resizeMode='contain' /> */}
                            </View>
                        </View>
                        <View style={{ width: Width(100), height: 0.5, backgroundColor: colors.black_50 }} />
                        <View>
                            <FlatList
                                extraData={this.state}
                                refreshing={refreshing}
                                style={{ flex: 1 }}
                                data={listTaiLieu}
                                renderItem={this._renderTaiLieuTrongCongViec}
                                onEndReachedThreshold={0.01}
                                initialNumToRender={5}
                                maxToRenderPerBatch={10}
                                windowSize={7}
                                updateCellsBatchingPeriod={100}
                                onRefresh={this._onRefresh}
                                keyExtractor={(item, index) => index.toString()}
                                ListEmptyComponent={listTaiLieu.length == 0 ? <ListEmptyLottie style={{ justifyContent: 'center', alignItems: 'center', }} textempty={RootLang.lang.JeeWork.khongcodulieu} /> : null}
                                ListFooterComponent={showload ? <ActivityIndicator size='small' /> : null}
                            />
                            <View style={{ height: 50 }}>

                            </View>
                        </View>
                        <ActionSheet
                            ref={o => { this.ActionSheet = o }}
                            title={RootLang.lang.JeeWork.bancomuonthuchien}
                            options={this.state.option}
                            cancelButtonIndex={CANCEL_INDEX}
                            destructiveButtonIndex={this.state.indexRed}
                            onPress={this.handlePress}
                        />
                        <ActionSheet
                            ref={o => { this.ActionSheetDinhKem = o }}
                            title={RootLang.lang.JeeWork.bancomuonthuchien}
                            options={[
                                RootLang.lang.JeeWork.huy,
                                RootLang.lang.JeeWork.uploadhinhanh,
                                RootLang.lang.JeeWork.uploadfile,
                            ]}
                            cancelButtonIndex={CANCEL_INDEX}
                            destructiveButtonIndex={3}
                            onPress={this._uploadFile}
                        />
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback >

        );
    }
};


const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});


export default Utils.connectRedux(TaiLieu, mapStateToProps, true)


