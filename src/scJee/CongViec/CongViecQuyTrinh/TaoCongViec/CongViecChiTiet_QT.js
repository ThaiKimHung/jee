import ActionSheet, { ActionSheetCustom } from '@alessiocancian/react-native-actionsheet';
import moment from 'moment';
import React, { Component } from 'react';
import {
    BackHandler, FlatList, Image,
    Linking, Platform, ScrollView, StyleSheet, Text,
    TouchableOpacity, View
} from "react-native";
import DocumentPicker from 'react-native-document-picker';
import ImageCropPicker from 'react-native-image-crop-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import HTML from 'react-native-render-html';
import {
    GetCongViecChiTiet, getToppicIDCTCV, UpdateMoTaCongViec,
    UpdateNVTheoDoi, UpdateStatusToDo, UpdatTaiLieuCongViec
} from '../../../../apis/JeePlatform/API_JeeWork/apiCongViecQuyTrinh';
import { RootLang } from '../../../../app/data/locales';
import Utils from '../../../../app/Utils';
import UtilsApp from '../../../../app/UtilsApp';
import IsLoading from '../../../../components/IsLoading';
import FastImagePlaceholder from "../../../../components/NewComponents/FastImageDefault";
import { Images } from '../../../../images';
import { colors } from '../../../../styles';
import { reText, sizes } from '../../../../styles/size';
import { Height, nstyles, paddingBotX, Width } from '../../../../styles/styles';
import Modal_BinhLuan from '../../../Social/ModalSocial/Modal_BinhLuan';
import { store } from '../../../../srcRedux/store';

var RNFS = require('react-native-fs');
const CANCEL_INDEX = 0
const DESTRUCTIVE_INDEX = 4

class CongViecChiTiet_QT extends Component {
    constructor(props) {
        super(props);
        this.nthis = this.props.nthis
        this.refLoading = React.createRef()
        this.state = {
            ChiTietCongViec: {},
            listPiority: [
                { row: 0, name: RootLang.lang.JeeWork.khongcodouutien, color: "grey" },
                { row: 1, name: RootLang.lang.JeeWork.douutienkhancap, color: "#DA3849" },
                { row: 2, name: RootLang.lang.JeeWork.douutiencao, color: '#F2C132' },
                { row: 3, name: RootLang.lang.JeeWork.douutienbinhthuong, color: '#6E47C9' },
                { row: 4, name: RootLang.lang.JeeWork.douutienthap, color: '#6F777F' },

            ],
            images: [],
            Attachments: [],
            Attachments_Result: [],
            file: [],
            description: '',
            result: '',
            option:
                [
                    RootLang.lang.JeeWork.huy,
                    RootLang.lang.JeeWork.taifilexuong,
                    <Text style={{ color: 'red', fontSize: 18 }}>{RootLang.lang.JeeWork.xoafiledinhkem}</Text>,
                ],
            filePicked: false,
            imagePicked: false,
            idtopic: '',
            rowid: Utils.ngetParam(this.nthis, "rowid", ''),
            isEdit: false,
            Status: '',
            nvTheodoi: [],
            videoPicked: false,
            video: []
        };
    }

    async componentDidMount() {
        this.refLoading.current.show()
        await this.getIdTopicJW()
        await this._GetCTCongViec().then(res => {
            if (res == true) {
                this.refLoading.current.hide()
            }
        });

        BackHandler.addEventListener(
            "hardwareBackPress",
            this._goback
        );
    }
    componentWillUnmount() {
        try {
            BackHandler.removeEventListener('hardwareBackPress', this._goback)
        }
        catch (error) { }
    }

    _goback = () => {
        Utils.goback(this.nthis)
        return true;
    }

    _GetCTCongViec = async () => {
        const res = await GetCongViecChiTiet(this.state.rowid)
        // Utils.nlog('res _GetCTCongViec', res)
        if (res.status == 1) {
            this.setState({
                ChiTietCongViec: res.data,
                Attachments: res.data.filelist,
                Attachments_Result: res.data.filelistresult,
                result: res.data.DescriptionResult,
                description: res.data.Description,
                Status: res?.data.Status,
                isEdit: res.data.IsEdit,
                nvTheodoi: res.data.Data_Follower
            })
        }
        else {
            UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, res.error ? res.error.message : RootLang.lang.JeeWork.laydulieuthatbai, 2)
        }
        return true
    }

    getIdTopicJW = async () => {
        let res = await getToppicIDCTCV(this.state.id_row)
        // Utils.nlog("res getIdTopicJW", res)
        if (res) {
            this.setState({ idtopic: res })
        }
        else {
            this.setState({ idtopic: '' })
        }
    }

    _returnImageFile = (item) => {
        switch (item) {
            case 'jpg':
                return Images.ImageJee.icjpg
                break;
            case 'js':
                return Images.ImageJee.icjavacript
                break;
            case 'mp4':
                return Images.ImageJee.icmp4
                break;
            case 'pdf':
                return Images.ImageJee.icpdf
                break;
            case 'xml':
                return Images.ImageJee.icxml
                break;
            case 'zip':
                return Images.ImageJee.iczip
                break;
            case 'html':
                return Images.ImageJee.ichtml
                break;
            case 'doc':
                return Images.ImageJee.icdoc
                break;
            case 'docx':
                return Images.ImageJee.icdoc
                break;
            case 'csv':
                return Images.ImageJee.iccsv
                break;
            case 'css':
                return Images.ImageJee.iccss
                break;
            default:
                return Images.ImageJee.icfileDefault
                break;
        }
    }

    hashCode = (str) => {
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return hash;
    }

    intToRGB = (i) => {
        var c = (i & 0x00FFFFFF)
            .toString(16)
            .toUpperCase();
        return "#" + "00000".substring(0, 6 - c.length) + c;
    }

    _XoaFileDinhkem = async (id, index, item, ketqua = false) => {
        //type 1: Đính kèm tài liệu ; 2: Đính kèm tài liệu kết quả ; 3:Cập nhật kết quả
        this.refLoading.current.show()
        let body = {
            "DescriptionFileDelete": item.filename_full,
            "RowID": id,
            "Type": ketqua ? 2 : 1,
            "isAdd": false
        }
        // Utils.nlog('body', body)
        const res = await UpdatTaiLieuCongViec(body)
        // Utils.nlog('res _XoaFileDinhkem', res)
        if (res.status == 1) {
            UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, RootLang.lang.JeeWork.xoafiledinhkemthanhcong, 1)
            await this._GetCTCongViec().then(res => {
                if (res == true) {
                    this.refLoading.current.hide()
                }
            });
        }
        else {
            this.refLoading.current.hide()
            UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, res.error ? res.error.message : RootLang.lang.JeeWork.xoathatbaivuilong, 2)
        }
    }

    handlePress = (indexAt) => {
        var rowID = this.state.rowid
        var item = this.ActionSheet.state.item
        var index = this.ActionSheet.state.index
        var path = this.ActionSheet.state.path
        var ketqua = this.ActionSheet.state.ketqua
        var checkImageVideo = this.ActionSheet.state.haveImageVideo
        var haveMusic = this.ActionSheet.state.haveMusic
        var isVideo = this.ActionSheet.state.isVideo
        if (checkImageVideo) {
            if (indexAt == 2) {
                try {
                    Linking.openURL(path)
                } catch (error) {
                    UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, error, 2)
                }
            }
            if (indexAt == 3) {
                this._XoaFileDinhkem(rowID, index, item, ketqua)
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
                this._XoaFileDinhkem(rowID, index, item, ketqua)
            }
            if (indexAt == 1) {
                Utils.goscreen(this.nthis, 'Modal_PlayMedia', { source: encodeURI(String(path)) })
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
                this._XoaFileDinhkem(rowID, index, item, ketqua)
            }
            else null
        }
    }

    _open_Video = async () => {
        await ImageCropPicker.openPicker({
            multiple: false,
            waitAnimationEnd: false,
            sortOrder: 'asc',
            includeExif: true,
            forceJpg: true,
            compressImageQuality: 0.2,
            includeBase64: true,
            mediaType: 'video'
        })
            .then(async (video) => {
                // console.log('video', video)
                const filePath = Platform.OS == "android" ? video.path : video.path.replace("file://", "")
                const strBase64 = await RNFS.readFile(filePath, "base64")
                var videocus = ({
                    filename: Platform.OS == 'ios' ? video.filename : video.path.substring(video.path.lastIndexOf('/') + 1),
                    strBase64: strBase64,
                    type: video.mime
                })
                this.setState({ video: videocus }, () => { this.setState({ videoPicked: true }) })
            }).catch((e) => this.setState({ videoPicked: false }));
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
                    strBase64: images.data,
                    type: images.mime
                };
                this.setState({ images: imageMap }, () => {
                    this.setState({ imagePicked: true })
                })

            }).catch((e) => this.setState({ imagePicked: false }));
    }

    MultiFilePicker = async () => {
        try {
            const results = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });
            // this.SWIPE_HEIGHT = this.SWIPE_HEIGHT + 20
            // this.setState({ files: this.state.files.concat(results) })
            const filePath = Platform.OS == "android" ? results.uri : results.uri.replace("file://", "")
            const type = results.type
            const strBase64 = await RNFS.readFile(filePath, "base64")
            var file = ({
                filename: results.name,
                strBase64: strBase64,
                type: type
            })
            this.setState({ file: file }, () => { this.setState({ filePicked: true }) })
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                this.setState({ filePicked: false })
            }
        }
    }

    _uploadFile = (indexAt, type, ketqua = false) => {
        // Utils.nlog("indexAt:", indexAt, type)
        if (indexAt == 1) {
            setTimeout(() => {
                this._open_ImageGallery().then(res => {
                    if (this.state.imagePicked) {
                        this._updateFileDinhKem(this.state.images, type, ketqua)
                    }
                    else null
                })
            }, 500);
        }
        if (indexAt == 2) {
            setTimeout(() => {
                this._open_Video().then(res => {
                    if (this.state.videoPicked) {
                        this._updateFileDinhKem(this.state.video, type, ketqua)
                    }
                })
            }, 500);

        }
        if (indexAt == 3) {
            setTimeout(() => {
                this.MultiFilePicker().then(res => {
                    if (this.state.filePicked) {
                        this._updateFileDinhKem(this.state.file, type, ketqua)
                    }
                })
            }, 500);
        }
    }

    _updateMoTaCV = async (data) => {
        this.refLoading.current.show()
        const res = await UpdateMoTaCongViec(data)
        // Utils.nlog('res _updateMoTaCV', res)
        if (res.status == 1) {
            this.setState({ filePicked: false }, async () => {
                await this._GetCTCongViec().then(res => {
                    if (res == true) {
                        this.refLoading.current.hide()
                    }
                });
            })
        }
        else {
            this.refLoading.current.hide()
            UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, res.error ? res.error.message : RootLang.lang.JeeWork.capnhatthatbaivuilong, 2)
        }
        return true
    }

    _updateKetQuaCV = async (data) => {
        //type 1: Đính kèm tài liệu ; 2: Đính kèm tài liệu kết quả ; 3:Cập nhật kết quả
        this.refLoading.current.show()
        const res = await UpdatTaiLieuCongViec(data)
        // Utils.nlog('res _updateKetQuaCV', res)
        if (res.status == 1) {
            this.setState({ filePicked: false }, async () => {
                await this._GetCTCongViec().then(res => {
                    if (res == true) {
                        this.refLoading.current.hide()
                    }
                });
            })
        }
        else {
            this.refLoading.current.hide()
            UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, res.error ? res.error.message : RootLang.lang.JeeWork.capnhatthatbaivuilong, 2)
        }
        return true
    }

    _updateFileDinhKem = async (data, type, ketqua = false) => {
        //type 1: Đính kèm tài liệu ; 2: Đính kèm tài liệu kết quả ; 3:Cập nhật kết quả
        this.refLoading.current.show()
        let body = {}
        let tailieu = {}
        tailieu = {
            "ContentType": data.type,
            "File": data.strBase64,
            "FileName": data.filename
        }
        body = {
            "DescriptionFileList": [tailieu],
            "RowID": this.state.rowid,
            "Type": ketqua ? 2 : 1,
            "isAdd": true,
        }
        // Utils.nlog('body', body)
        const res = await UpdatTaiLieuCongViec(body)
        // Utils.nlog('res _updateFileDinhKem', res)
        if (res.status == 1) {
            UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, RootLang.lang.JeeWork.uploadfilethanhcong, 1)
            await this._GetCTCongViec().then(res => {
                if (res == true) {
                    this.refLoading.current.hide()
                }
            });
        }
        else {
            this.refLoading.current.hide()
            UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, res.error ? res.error.message : RootLang.lang.JeeWork.uploadfilethatbaivuilong, 2)
        }
        return true
    }

    _ThemNguoiTheoDoi = () => {
        Utils.goscreen(this.nthis, 'Modal_ChonNhanVien', {
            callback: this._callBackNhanVien, nvCoSan: this.state.nvTheodoi
        })
    }

    _callBackNhanVien = (nvTheodoi) => {
        try {
            this.setState({ nvTheodoi }, async () => {
                await this._updateNhanVienTheoDoi()
            });
        } catch (error) { }
    }

    _updateNhanVienTheoDoi = async () => {
        //WorkType: 1 công việc, 2 công việc con, 3 quy trình
        // Type: 1 người thực hiện, 2 người theo dõi quy trình, 3 người theo dõi giai đoạn
        this.refLoading.current.show()
        let body = {}
        let nhanVien = []
        this.state.nvTheodoi.map(i => {
            nhanVien.push(i.UserId)
        })
        body = {
            "ID": this.state.rowid,
            "NVIDList": nhanVien,
            "Type": 3,
            "WorkType": 2,
        }
        // Utils.nlog('body', body)
        const res = await UpdateNVTheoDoi(body)
        // Utils.nlog('res _updateNhanVienTheoDoi', res)
        if (res.status == 1) {
            UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, RootLang.lang.JeeWork.capnhatthanhcong, 1)
            await this._GetCTCongViec().then(res => {
                if (res == true) {
                    this.refLoading.current.hide()
                }
            });
        }
        else {
            this.refLoading.current.hide()
            UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, res.error ? res.error.message : RootLang.lang.JeeWork.uploadfilethatbaivuilong, 2)
        }
        return true
    }

    hashCode = (str) => {
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return hash;
    }

    intToRGB = (i) => {
        var c = (i & 0x00FFFFFF)
            .toString(16)
            .toUpperCase();
        return "#" + "00000".substring(0, 6 - c.length) + c;
    }

    _goGetLyDo = () => {
        const temp = [{ key: "Lý do", value: '', type: 'string', keyNotNull: true }]
        Utils.goscreen(this.nthis, 'Modal_ComponentSubmit', {
            object: temp,
            title: 'Cập nhật thông tin',
            titleButton: 'Lưu & đóng',
            key: 'key',
            value: 'value',
            keyNotNull: 'keyNotNull',
            callback: this.callback,
        })
    }

    callback = async (list) => {
        // Utils.nlog('list', list)
        await this._updateStatusToDo('', true, list[0]?.value)
    }

    _updateStatusToDo = async (data, tamdung = false, note = '') => {
        this.refLoading.current.show()
        let strbody = {}
        if (data.id_row == 0 || tamdung) {
            strbody = { "ID": this.state.rowid, "Status": data.id_row ? data.id_row : 0, Note: note }
        }
        else {
            strbody = { "ID": this.state.rowid, "Status": data.id_row }
        }
        // Utils.nlog('body', strbody)
        const res = await UpdateStatusToDo(strbody)
        // Utils.nlog('res _updateStatusToDo', res)
        if (res.status == 1) {
            // this.refLoading.current.hide()
            this.setState({ filePicked: false }, async () => {
                await this._GetCTCongViec().then(res => {
                    if (res == true) {
                        this.refLoading.current.hide()
                    }
                });
            })
        }
        else {
            this.refLoading.current.hide()
            UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, res.error ? res.error.message : RootLang.lang.JeeWork.capnhatthatbaivuilong, 2)
        }
        return true
    }

    _Status = () => {
        // let ListStatus = [
        //     { "id_row": 0, "statusname": 'Tạm dừng', "color": "#DA3849" },
        //     { "id_row": 1, "statusname": 'Đang thực hiện, "color": colors.orange1 },
        //     { "id_row": 2, "statusname": 'Hoàn thành', "color": colors.colorTabActive }]
        let ListStatus = []
        if (this.state.ChiTietCongViec?.Status == null) {
            ListStatus = [
                { "id_row": 1, "statusname": 'Đang thực hiện', "color": colors.orange1 },
                { "id_row": 2, "statusname": 'Hoàn thành', "color": colors.colorTabActive }]
        }
        else if (this.state.ChiTietCongViec?.Status == 1) {
            ListStatus = [
                { "id_row": 0, "statusname": 'Đang tạm dừng', "color": "#DA3849" },
                { "id_row": 2, "statusname": 'Hoàn thành', "color": colors.colorTabActive }]
        }
        else if (this.state.ChiTietCongViec?.Status == 0 || this.state.ChiTietCongViec?.Status == 2) {
            ListStatus = [
                { "id_row": 1, "statusname": 'Đang thực hiện', "color": colors.orange1 }]
        }
        Utils.goscreen(this.nthis, 'Modal_ComponentSelectCom', { callback: this._callbackStatus, item: this.state.Status, AllThaoTac: ListStatus, ViewItem: this.ViewItemStatus })
    }

    _callbackStatus = (Status) => {
        try {
            setTimeout(() => {
                let name = ''
                if (Status.statusname == 'Đang thực hiện') {
                    name = 'Thực hiện'
                }
                else if (Status.statusname == 'Đang tạm dừng') {
                    name = 'Tạm dừng'
                }
                else name = Status.statusname
                Utils.showMsgBoxYesNo(this.nthis, RootLang.lang.thongbaochung.thongbao, "Bạn có chắc chắn muốn " + name.toLowerCase() + " công việc? ", RootLang.lang.thongbaochung.co, RootLang.lang.thongbaochung.khong,
                    () => {
                        this.setState({ Status: Status.id_row })
                        if (Status.id_row == 0) {
                            setTimeout(() => {
                                this._goGetLyDo()
                            }, 500);
                        }
                        else {
                            this._updateStatusToDo(Status)
                        }
                    })
            }, 500);


        } catch (error) { }
    }

    ViewItemStatus = (item) => {
        return (
            <View key={item.id_row.toString()} style={{ flexDirection: "row", alignSelf: "center" }}>
                <Text style={{
                    textAlign: "center", fontSize: reText(16),
                    alignSelf: "center",
                    color: item.color,
                    fontWeight: this.state.Status == item.id_row ? "bold" : 'normal'
                }}>{item.statusname ? item.statusname : ""}</Text>
            </View>
        )
    }

    _renderItem = ({ item, index }) => {
        return (
            <View style={{ justifyContent: 'space-between', height: Height(5), flexDirection: 'row', paddingHorizontal: 10 }}>
                <View style={{ flexDirection: "row", flex: 1 }}>
                    <Image style={[nstyles.nIcon24, { marginRight: 5 }]} source={UtilsApp._returnImageFile(item.filename)} />
                    <Text numberOfLines={1} style={{ marginLeft: 10, maxWidth: Width(70), fontSize: sizes.sText15, color: '#65676B' }}>{item.filename}</Text>
                </View>
                <TouchableOpacity style={{ marginTop: 5 }}
                    onPress={() => {
                        var duoiFile = String(item.filename).split('.').slice(-1).toString()
                        if (duoiFile == 'jpg' || duoiFile == 'png' || duoiFile == 'PNG' || duoiFile == 'JPG' || duoiFile == 'HEIC') {
                            this.setState({
                                option: [
                                    RootLang.lang.JeeWork.huy,
                                    RootLang.lang.JeeWork.xem,
                                    RootLang.lang.JeeWork.taifilexuong,
                                    <Text style={{ color: 'red', fontSize: 18 }}>{RootLang.lang.JeeWork.xoafiledinhkem}</Text>,
                                ]
                            }, () => {
                                this.ActionSheet.setState({ item: item, index: index, path: item.link, haveImageVideo: true }, () => {
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
                                    <Text style={{ color: 'red', fontSize: 18 }}>{RootLang.lang.JeeWork.xoafiledinhkem}</Text>,
                                ]
                            }, () => {
                                this.ActionSheet.setState({ item: item, index: index, path: item.link, haveMusic: true, isVideo: false }, () => {
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
                                    <Text style={{ color: 'red', fontSize: 18 }}>{RootLang.lang.JeeWork.xoafiledinhkem}</Text>,
                                ]
                            }, () => {
                                this.ActionSheet.setState({ item: item, index: index, path: item.link, isVideo: true, haveMusic: false }, () => {
                                    this.ActionSheet.show()
                                })
                            })
                        }
                        else {
                            this.setState({
                                option: [
                                    RootLang.lang.JeeWork.huy,
                                    RootLang.lang.JeeWork.taifilexuong,
                                    <Text style={{ color: 'red', fontSize: 18 }}>{RootLang.lang.JeeWork.xoafiledinhkem}</Text>,
                                ]
                            }, () => {
                                this.ActionSheet.setState({ index: index, path: item.link, haveImageVideo: false }, () => {
                                    this.ActionSheet.show()
                                })
                            })
                        }
                    }} >
                    <Image source={Images.ImageJee.icBaCham} resizeMode='cover' style={[{}]} />
                </TouchableOpacity>
            </View >
        );
    };

    _renderItemKQCV = ({ item, index }) => {
        return (
            <View style={{ justifyContent: 'space-between', height: Height(5), flexDirection: 'row', paddingHorizontal: 10 }}>
                <View style={{ flexDirection: "row", flex: 1 }}>
                    <Image style={[nstyles.nIcon24, { marginRight: 5 }]} source={UtilsApp._returnImageFile(item.filename)} />
                    <Text numberOfLines={1} style={{ marginLeft: 10, maxWidth: Width(70), fontSize: sizes.sText15, color: '#65676B' }}>{item.filename}</Text>
                </View>
                <TouchableOpacity style={{ marginTop: 5 }}
                    onPress={() => {
                        var duoiFile = String(item.filename).split('.').slice(-1).toString()
                        if (duoiFile == 'jpg' || duoiFile == 'png' || duoiFile == 'PNG' || duoiFile == 'JPG' || duoiFile == 'HEIC') {
                            this.setState({
                                option: [
                                    RootLang.lang.JeeWork.huy,
                                    RootLang.lang.JeeWork.xem,
                                    RootLang.lang.JeeWork.taifilexuong,
                                    <Text style={{ color: 'red', fontSize: 18 }}>{RootLang.lang.JeeWork.xoafiledinhkem}</Text>,
                                ]
                            }, () => {
                                this.ActionSheet.setState({ item: item, index: index, path: item.link, haveImageVideo: true, ketqua: true }, () => {
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
                                    <Text style={{ color: 'red', fontSize: 18 }}>{RootLang.lang.JeeWork.xoafiledinhkem}</Text>,
                                ]
                            }, () => {
                                this.ActionSheet.setState({ item: item, index: index, path: item.link, haveMusic: true, isVideo: false, ketqua: true }, () => {
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
                                    <Text style={{ color: 'red', fontSize: 18 }}>{RootLang.lang.JeeWork.xoafiledinhkem}</Text>,
                                ]
                            }, () => {
                                this.ActionSheet.setState({ item: item, index: index, path: item.link, isVideo: true, haveMusic: false, ketqua: true }, () => {
                                    this.ActionSheet.show()
                                })
                            })
                        }
                        else {
                            this.setState({
                                option: [
                                    RootLang.lang.JeeWork.huy,
                                    RootLang.lang.JeeWork.taifilexuong,
                                    <Text style={{ color: 'red', fontSize: 18 }}>{RootLang.lang.JeeWork.xoafiledinhkem}</Text>,
                                ]
                            }, () => {
                                this.ActionSheet.setState({ index: index, path: item.link, haveImageVideo: false, ketqua: true }, () => {
                                    this.ActionSheet.show()
                                })
                            })
                        }
                    }} >
                    <Image source={Images.ImageJee.icBaCham} resizeMode='cover' style={[{}]} />
                </TouchableOpacity>
            </View >
        );
    };

    scrollToBot = () => {
        setTimeout(() => { this.scroll?.props?.scrollToEnd(true) }, Platform.OS == 'ios' ? 1200 : 2200)
    }

    render() {
        const { description, Attachments, ChiTietCongViec, result, Attachments_Result, idtopic, isEdit } = this.state
        let textThucHien = 'Đang cập nhật'
        let colorThucHien = colors.orange1
        if (ChiTietCongViec?.Status == null) {
            textThucHien = 'Chưa thực hiện'
            colorThucHien = colors.gray1
        }
        else if (ChiTietCongViec?.Status == 1) {
            textThucHien = 'Đang thực hiện'
            colorThucHien = colors.orange1
        }
        else if (ChiTietCongViec?.Status == 0) {
            textThucHien = 'Đang tạm dừng'
            colorThucHien = "#DA3849"
        }
        else {
            textThucHien = 'Hoàn thành'
            colorThucHien = colors.colorTabActive
        }
        return (
            <View style={{ flex: 1 }}>
                {/* <HeaderComStackV2
                    nthis={this.nthis} title={RootLang.lang.JeeWork.chitietcongviec}
                    // iconRight={Images.ImageJee.icBoLocSocial}
                    styIconRight={[nstyles.nIconH18W22, {}]}
                    iconLeft={Images.ImageJee.icBack}
                    onPressLeft={this._goback}
                    // onPressRight={() => { Utils.goscreen(this, 'Modal_LocBaiDang') }}
                    styBorder={{
                        borderBottomColor: colors.black_20_2,
                        borderBottomWidth: 0.5
                    }}
                /> */}
                <View style={{ flex: 1, paddingBottom: paddingBotX }}>
                    <KeyboardAwareScrollView
                        innerRef={ref => {
                            this.scroll = ref
                        }}
                        enableAutomaticScroll={true}
                        extraScrollHeight={Platform.OS == 'ios' ? Height(4) : Height(16)}
                        enableOnAndroid={true}
                        onScrollEndDrag={() => { this._GetCTCongViec() }}
                        nestedScrollEnabled={true}
                        keyboardShouldPersistTaps={"handled"} style={{ backgroundColor: '#F4F4F4', flex: 1 }}>
                        <View style={{ backgroundColor: colors.white, }}>
                            <View style={styles.paddingHorizontal}>
                                <Text style={styles.fonsize12} > {ChiTietCongViec?.Process && ChiTietCongViec?.Stage ? ChiTietCongViec?.Process + " / " + ChiTietCongViec?.Stage : '--'}</Text>
                                <Text style={styles.TaskName}>{ChiTietCongViec?.Tasks}</Text>
                                <View style={styles.row_center}>
                                    <Text style={styles.textCreateBy}> {RootLang.lang.JeeWork.taoboi}:  </Text>
                                    <Text style={styles.textDataLeft}> {ChiTietCongViec?.CreatedBy ? ChiTietCongViec?.CreatedBy : "--"}  </Text>
                                </View>

                            </View>
                            <View style={[styles.row_center, { paddingLeft: 10 }]}>
                                <View style={styles.khungImage}>
                                    <Image source={Images.ImageJee.ic_Thoigiannhan} style={[nstyles.nIcon12]} />
                                </View>
                                <View >
                                    <Text style={styles.fonsize}> {RootLang.lang.JeeWork.thoigiannhan}: </Text>
                                </View>
                                <Text style={styles.textDataLeft}>{ChiTietCongViec?.CreatedDate ? Utils.formatTimeAgo(moment(ChiTietCongViec?.CreatedDate).format('MM/DD/YYYY HH:mm:ss'), 2, true) : "--"}  </Text>
                            </View>

                            <View style={[styles.row_center, { paddingLeft: 10 }]}>
                                <View style={styles.khungImage}>
                                    <Image source={Images.ImageJee.ic_Batdauluc} style={[nstyles.nIcon12, {}]} />
                                </View>
                                <View style={styles.colum_paddingLeft}>
                                    <Text style={styles.fonsize}>{RootLang.lang.JeeWork.batdauluc}: </Text>
                                </View>
                                <Text style={styles.textDataLeft}> {ChiTietCongViec?.NgayBatDau ? Utils.formatTimeAgo(moment(ChiTietCongViec?.NgayBatDau).format('MM/DD/YYYY HH:mm:ss'), 2, true) : "--"}  </Text>
                            </View>
                            <View style={[styles.row_center, { paddingLeft: 10 }]}>
                                <View style={styles.khungImage}>
                                    <Image source={Images.ImageJee.ic_Hoanthanh} style={[nstyles.nIcon12, {}]} />
                                </View>
                                <View style={styles.colum_paddingLeft}>
                                    <Text style={styles.fonsize}>{RootLang.lang.JeeWork.hoanthanh}: </Text>
                                </View>
                                <Text style={styles.textDataLeft}> {ChiTietCongViec?.CompleteDate ? Utils.formatTimeAgo(moment(ChiTietCongViec?.CompleteDate).format('MM/DD/YYYY HH:mm:ss'), 2, true) : "--"}  </Text>
                            </View>

                            <View style={[styles.row_center, { paddingLeft: 10 }]}>
                                <View style={styles.khungImage}>
                                    <Image source={Images.ImageJee.ic_Dalam} style={[nstyles.nIcon12, {}]} />
                                </View>
                                <View >
                                    <Text style={styles.fonsize}> {RootLang.lang.JeeWork.dalam}: </Text>
                                </View>
                                <Text style={styles.textDataLeft}>{ChiTietCongViec?.TGLam ? Number(ChiTietCongViec?.TGLam).toFixed(1) + '(h)' : "--"}  </Text>
                            </View>
                            <View style={[styles.row]}>
                                <View style={[styles.chiadoi, {}]}>
                                    <View style={[]}>
                                        <TouchableOpacity
                                            disabled={ChiTietCongViec?.IsEditStatus ? false : true}
                                            onPress={() => { this._Status() }}
                                            style={[styles.khungdanglam, {}]}>
                                            <View style={[styles.danglam, { backgroundColor: colorThucHien }]}>
                                                <Text style={styles.textDanglam}>{textThucHien}</Text>
                                            </View>
                                        </TouchableOpacity>
                                        {
                                            ChiTietCongViec?.Data_Implementer?.length > 0 ? (
                                                <ScrollView horizontal={true} style={{ paddingVertical: 5, paddingLeft: 5, }} contentContainerStyle={{}}>
                                                    <View style={styles.khungAvaCvChiTiet}>
                                                        {
                                                            ChiTietCongViec?.Data_Implementer.map(i => {
                                                                return (
                                                                    i.Image != '' ? (
                                                                        <FastImagePlaceholder
                                                                            style={nstyles.nAva32}
                                                                            source={{ uri: i?.Image }} resizeMode={"cover"}
                                                                            placeholder={Images.icAva}
                                                                        />
                                                                    ) : (
                                                                        <View style={{
                                                                            backgroundColor: this.intToRGB(this.hashCode(i.ObjectName)),
                                                                            width: 32, height: 32, flexDirection: "row", borderRadius: 99, marginRight: 5, justifyContent: 'center'
                                                                        }}>
                                                                            <Text style={styles.textName}>
                                                                                {String(i.ObjectName).split(" ").slice(-1).toString().slice(0, 2).toString()}</Text>
                                                                        </View>
                                                                    )
                                                                )
                                                            })
                                                        }
                                                    </View>
                                                </ScrollView>
                                            ) : null
                                        }
                                    </View>
                                </View>
                                <View style={[styles.chiadoi, {}]}>
                                    <View style={styles.row_center}>
                                        <View style={styles.colum_paddingLeft}>
                                            <Text style={styles.textDeadline}>{RootLang.lang.JeeWork.deadline}:</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.textDeadline1}> {ChiTietCongViec?.HanChot ? Utils.formatTimeAgo(moment(ChiTietCongViec.HanChot).format('MM/DD/YYYY HH:mm:ss'), 2, true) : "--"}  </Text>
                                </View>
                            </View>
                            <View style={[styles.row_center, { paddingLeft: 10 }]}>
                                <View style={styles.khungImage}>
                                    <Image source={Images.ImageJee.ic_People} style={[nstyles.nIcon16, { tintColor: colors.colorBlue }]} />
                                </View>
                                <View style={styles.colum_paddingLeft}>
                                    <Text style={styles.fonsize}>{RootLang.lang.JeeWork.theodoi}: </Text>
                                </View>
                                <View style={[styles.row_center, { marginBottom: 5 }]}>
                                    <View style={{ maxWidth: Width(65) }}>
                                        <ScrollView horizontal={true} style={{ paddingVertical: 5, paddingLeft: 5, }} contentContainerStyle={{}}>
                                            <View style={styles.khungAvaCvChiTiet}>
                                                {
                                                    ChiTietCongViec?.Data_Follower?.length > 0 ?
                                                        ChiTietCongViec?.Data_Follower.map((i, index) => {
                                                            return (
                                                                i.Image != '' ? (
                                                                    <FastImagePlaceholder
                                                                        style={nstyles.nAva32}
                                                                        source={{ uri: i?.Image }} resizeMode={"cover"}
                                                                        placeholder={Images.icAva}
                                                                    />
                                                                ) : (
                                                                    <View style={{
                                                                        backgroundColor: index > 4 ? "pink" : this.intToRGB(this.hashCode(i.ObjectName)),
                                                                        width: 32, height: 32, flexDirection: "row", borderRadius: 99, marginRight: 5, justifyContent: 'center'
                                                                    }}>
                                                                        <Text style={styles.textName}>
                                                                            {index > 4 ? "+" + `${ChiTietCongViec?.Data_Follower.length - 5}` : String(i.ObjectName).split(" ").slice(-1).toString().slice(0, 2).toString()}</Text>
                                                                    </View>
                                                                )
                                                            )
                                                        })
                                                        : null
                                                }
                                            </View>
                                        </ScrollView>
                                    </View>
                                    {isEdit && <TouchableOpacity onPress={this._ThemNguoiTheoDoi}>
                                        <Image source={Images.ImageJee.icChonNguoiThamGia} style={[{}]} />
                                    </TouchableOpacity>}
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={() => Utils.goscreen(this.nthis, 'Modal_EditHTML', {
                                title: 'Mô tả công việc',
                                isEdit: true,
                                content: description,
                                isVoice: false,
                                callback: (html) => {
                                    this.setState({ description: html })
                                    this._updateMoTaCV({
                                        Description: html,
                                        RowID: this.state.rowid,
                                        TaskName: ChiTietCongViec?.Tasks,
                                    })
                                }
                            })}
                            disabled={isEdit ? false : true}
                            style={{ marginTop: 3, backgroundColor: colors.white, padding: 10 }}>

                            <Text style={{ fontSize: sizes.sText16, color: '#206EC0', marginBottom: 5 }}>{RootLang.lang.JeeWork.motacongviec}</Text>
                            {description ?
                                <View style={{ backgroundColor: '#F7F8FA' }}>
                                    <HTML
                                        source={{ html: `<div>${description}</div>` }}
                                        containerStyle={{ paddingHorizontal: 10, paddingVertical: 10 }}
                                        tagsStyles={{
                                            div: { fontSize: reText(18) },
                                        }}
                                    />
                                </View> :
                                <View style={{ height: Height(10), backgroundColor: '#F7F8FA', justifyContent: 'center', alignItems: 'center' }}>
                                    <View style={{ borderWidth: 1, borderColor: colors.textGray, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5 }}>
                                        <Text style={{ fontSize: reText(15), color: colors.textGray }}>{RootLang.lang.JeeWork.chuaconoidungmota}</Text>
                                    </View>
                                </View>}
                        </TouchableOpacity>

                        <View style={{ marginTop: 3, backgroundColor: colors.white, padding: 10, width: Width(100) }}>
                            <View>
                                <View style={{ marginVertical: 10, flexDirection: "row", paddingBottom: 10 }}>
                                    <Text style={{ alignSelf: "center", fontSize: sizes.sText16, color: '#206EC0', flex: 1 }}>{RootLang.lang.JeeWork.tailieudinhkem}</Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.ActionSheetDinhKem.show()
                                        }}
                                        disabled={isEdit ? false : true}
                                        style={{ alignSelf: "center", marginRight: 10 }}>
                                        <Image style={{ width: 20, height: 20 }} source={Images.ImageJee.icThemLuaChon} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ marginTop: 5, flex: 1 }}>
                                    <FlatList
                                        data={Attachments}
                                        nestedScrollEnabled={true}
                                        renderItem={this._renderItem}
                                        keyExtractor={(item, index) => index.toString()}
                                    />
                                </View>
                            </View>
                        </View>

                        <TouchableOpacity
                            onPress={() => Utils.goscreen(this.nthis, 'Modal_EditHTML', {
                                title: RootLang.lang.thongbaochung.ketquacongviec,
                                isEdit: true,
                                content: result,
                                isVoice: false,
                                callback: (html) => {
                                    this.setState({ result: html })
                                    this._updateKetQuaCV({
                                        Description: html,
                                        RowID: this.state.rowid,
                                        Type: 3
                                    })
                                }
                            })}
                            disabled={isEdit ? false : true}
                            style={{ marginTop: 3, backgroundColor: colors.white, padding: 10 }}>
                            <Text style={{ fontSize: sizes.sText16, color: '#206EC0', marginBottom: 5 }}>{RootLang.lang.JeeWork.capnhatketquacongviec}</Text>
                            {result ?
                                <View style={{ backgroundColor: '#F7F8FA' }}>
                                    <HTML
                                        source={{ html: `<div>${result}</div>` }}
                                        containerStyle={{ paddingHorizontal: 10, paddingVertical: 10 }}
                                        tagsStyles={{
                                            div: { fontSize: reText(18) },
                                        }}
                                    />
                                </View> :
                                <View style={{ height: Height(10), backgroundColor: '#F7F8FA', justifyContent: 'center', alignItems: 'center' }}>
                                    <View style={{ borderWidth: 1, borderColor: colors.textGray, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5 }}>
                                        <Text style={{ fontSize: reText(15), color: colors.textGray }}>{RootLang.lang.JeeWork.chuaconoidungketqua}</Text>
                                    </View>
                                </View>}
                        </TouchableOpacity>
                        <View style={{ marginTop: 3, backgroundColor: colors.white, padding: 10, width: Width(100) }}>
                            <View>
                                <View style={{ marginVertical: 10, flexDirection: "row", paddingBottom: 10 }}>
                                    <Text style={{ alignSelf: "center", fontSize: sizes.sText16, color: '#206EC0', flex: 1 }}>{RootLang.lang.JeeWork.tailieucapnhatketquacongviec}</Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.ActionSheetKetQua.show()
                                        }}
                                        disabled={isEdit ? false : true}
                                        style={{ alignSelf: "center", marginRight: 10 }}>
                                        <Image style={{ width: 20, height: 20 }} source={Images.ImageJee.icThemLuaChon} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ marginTop: 5, flex: 1 }}>
                                    <FlatList
                                        data={Attachments_Result}
                                        nestedScrollEnabled={true}
                                        renderItem={this._renderItemKQCV}
                                        keyExtractor={(item, index) => index.toString()}
                                    />
                                </View>
                            </View>

                        </View>
                        <View style={[styles.groupview, { paddingHorizontal: 0, flex: 1 }]}>
                            <View style={{ backgroundColor: colors.white, paddingHorizontal: 10, paddingTop: 10 }}>
                                <Text style={{ fontSize: sizes.sText16, color: '#206EC0', flex: 1 }}>{RootLang.lang.JeeWork.binhluan}</Text>
                            </View>
                            {
                                idtopic ? (
                                    <Modal_BinhLuan topicId={idtopic} nthis={this.nthis} request={true} jeeWork={true} onToDo={this.scrollToBot} />
                                ) : (null)
                            }
                        </View>
                    </KeyboardAwareScrollView>
                    <IsLoading ref={this.refLoading} />
                    <ActionSheetCustom
                        ref={o => { this.ActionSheet = o }}
                        title={RootLang.lang.JeeWork.bancomuonthuchien}
                        options={this.state.option}
                        cancelButtonIndex={CANCEL_INDEX}
                        destructiveButtonIndex={DESTRUCTIVE_INDEX}
                        onPress={this.handlePress}
                    />
                    <ActionSheet
                        ref={o => { this.ActionSheetDinhKem = o }}
                        title={RootLang.lang.JeeWork.bancomuonthuchien}
                        options={[
                            RootLang.lang.JeeWork.huy,
                            RootLang.lang.JeeWork.uploadhinhanh,
                            RootLang.lang.JeeWork.uploadvideo,
                            RootLang.lang.JeeWork.uploadfile,
                        ]}
                        cancelButtonIndex={CANCEL_INDEX}
                        destructiveButtonIndex={4}
                        onPress={(indexAt) => this._uploadFile(indexAt, 1)}
                    />
                    <ActionSheet
                        ref={o => { this.ActionSheetKetQua = o }}
                        title={RootLang.lang.JeeWork.bancomuonthuchien}
                        options={[
                            RootLang.lang.JeeWork.huy,
                            RootLang.lang.JeeWork.uploadhinhanh,
                            RootLang.lang.JeeWork.uploadvideo,
                            RootLang.lang.JeeWork.uploadfile,
                        ]}
                        cancelButtonIndex={CANCEL_INDEX}
                        destructiveButtonIndex={4}
                        onPress={(indexAt) => this._uploadFile(indexAt, 1, true)}
                    />
                </View>
            </View >
        );
    }
};


const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});

const styles = StyleSheet.create({
    paddingHorizontal: {
        paddingHorizontal: 5,
        paddingTop: 5
    },
    fonsize12: {
        fontSize: reText(12)
    },
    TaskName: {
        fontSize: reText(22), paddingVertical: 3, color: '#404040'
    },
    textCreateBy: {
        fontSize: reText(14), color: '#000000'
    },
    row_center: {
        flexDirection: 'row', alignItems: 'center',
    },
    khungImage: {
        width: Width(5), justifyContent: 'center', alignItems: 'center'
    },
    fonsize: {
        fontSize: reText(14), color: '#808080'
    },
    textDataLeft: {
        fontSize: reText(14), paddingVertical: 3, color: '#000000', fontWeight: 'bold'
    },
    row: {
        flexDirection: 'row'
    },
    chiadoi: {
        width: Width(50), paddingHorizontal: 5, paddingVertical: 5
    },
    khungdanglam: {
        paddingLeft: 10, alignItems: 'center', flexDirection: 'row'
    },
    danglam: {
        height: Height(3), justifyContent: 'center', alignItems: 'center', borderRadius: 4,
        maxWidth: Height(13.5), minWidth: Height(10)
    },
    textDanglam: {
        paddingHorizontal: 5, color: colors.white
    },
    hinhvuong: {
        height: Height(3), marginLeft: 5, justifyContent: 'center', alignItems: 'center', width: Height(3), borderRadius: 4,
    },
    colum_paddingLeft: {
        paddingLeft: 5
    },
    textDeadline: {
        color: '#FC0030'
    },
    textDeadline1: {
        color: '#FC0030', paddingLeft: 14, fontSize: reText(14), paddingVertical: 3,
    },
    textName: {
        alignSelf: "center", fontWeight: "bold", fontSize: reText(12), color: colors.white
    },
    khungAvaCvChiTiet: {
        flexDirection: 'row',
        // justifyContent: 'flex-end',
        // marginRight: 10
    },
    paddingLeft: {
        paddingRight: 10
    },
    groupview: {
        backgroundColor: colors.white,
        marginTop: 8,
        paddingHorizontal: 10,
        paddingTop: 5,
        paddingBottom: 10
    },
});

export default Utils.connectRedux(CongViecChiTiet_QT, mapStateToProps, true)