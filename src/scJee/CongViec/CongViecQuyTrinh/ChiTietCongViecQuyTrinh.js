import ActionSheet, { ActionSheetCustom } from '@alessiocancian/react-native-actionsheet'
import moment from 'moment'
import React, { Component } from 'react'
import { BackHandler, FlatList, Image, Linking, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import DocumentPicker from 'react-native-document-picker'
import ImageCropPicker from 'react-native-image-crop-picker'
// import ActionSheet from 'react-native-actions-sheet'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import HTML from 'react-native-render-html'
import {
    ChuyenGiaiDoan, delToDo, getByComponentName,
    Get_FieldsNode, Get_NodeDetail, Get_ProcessDetail, UpdateStatusNode, UpdateTaiLieu, UpdateThongTinCanNhap
} from '../../../apis/JeePlatform/API_JeeWork/apiCongViecQuyTrinh'
import { RootLang } from '../../../app/data/locales'
import Utils from '../../../app/Utils'
import UtilsApp from '../../../app/UtilsApp'
import IsLoading from '../../../components/IsLoading'
import FastImagePlaceholder from "../../../components/NewComponents/FastImageDefault"
import { Images } from '../../../images'
import { colors } from '../../../styles'
import { reText, sizes } from '../../../styles/size'
import { Height, nstyles, paddingBotX, Width } from '../../../styles/styles'
import Modal_BinhLuan from '../../Social/ModalSocial/Modal_BinhLuan'

const DESTRUCTIVE_INDEX = 4
const CANCEL_INDEX = 0
var RNFS = require('react-native-fs');

export class ChiTietCongViecQuyTrinh extends Component {
    constructor(props) {
        super(props)
        this.nthis = this.props.nthis
        this.refLoading = React.createRef()
        this.loadLaiData = Utils.ngetParam(this.nthis, 'loadLaiData')
        this.state = {
            dataNodeDetail: [],
            dataProcessDetail: [],
            topicId: '',
            option:
                [
                    RootLang.lang.JeeWork.huy,
                    RootLang.lang.JeeWork.taifilexuong,
                    <Text style={{ color: 'red', fontSize: 18 }}>{RootLang.lang.JeeWork.xoafiledinhkem}</Text>,
                ],
            filePicked: false,
            imagePicked: false,
            images: [],
            file: [],
            idtopic: '',
            rowID: '',
            taskid: Utils.ngetParam(this.nthis, 'taskid', ''), // rowid
            stageid: Utils.ngetParam(this.nthis, 'stageid', ''), // NodeID cho tạo công việc mới
            Status: '',
            chucNangkhac: [
                { "id": 0, "title": RootLang.lang.JeeWork.giaolaichonguoikhac, "icon": Images.ImageJee.ic_adduserCVCTQT, },
                { "id": 1, "title": RootLang.lang.JeeWork.chuyensanggiaidoanketiep, "icon": Images.ImageJee.icBrowser, },
                { "id": 2, "title": RootLang.lang.JeeWork.chuyenvegiaidoantruoc, "icon": Images.ImageJee.ic_backCVCTQT, }
            ],
            chucnang: '',
            videoPicked: false,
            video: [],
            cungngay: false, // false: chưa hết hạn, true: đã hết hạn
        }
    }
    componentDidMount = async () => {
        // Utils.nlog('taskid', this.state.taskid)
        // Utils.nlog('stageid', this.state.stageid)
        this.refLoading.current.show()
        BackHandler.addEventListener("hardwareBackPress", this._goback);
        if (this.state.taskid == '' && this.state.stageid == '') {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.thongbaochung.loilaydulieu, 2)
            this._goback()
        }
        else {
            // this._GetChiTiet()
            // this.getIdTopicJW()
            this._loadData()
        }
    }

    componentWillUnmount() {
        try {
            BackHandler.removeEventListener('hardwareBackPress', this._goback)
        }
        catch (error) {

        }
    }

    _goback = async () => {
        Utils.goback(this.nthis, null)
        return true
    }

    _loadData = async () => {
        let resChiTiet = ''
        let resGetToppic = ''
        await this._GetChiTiet().then(res => {
            if (res == true) {
                resChiTiet = true
            }
        });
        await this.getIdTopicJW().then(res => {
            if (res == true) {
                resGetToppic = true
            }
        });
        if (resChiTiet && resGetToppic) {
            this.refLoading.current.hide()
        }
        else {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.thongbaochung.loilaydulieu, 2)
        }
    }

    _GetChiTiet = async () => {
        // DataToDo: công việc chi tiết, DataFields: thông tin cần nhập. Api: workprocess/Get_NodeDetail
        // datafields: thông tin đầu vào, filelist: tài liệu đính kèm. Api: workprocess/Get_ProcessDetail
        let resNodeDetail = await Get_NodeDetail(this.state.stageid)
        // Utils.nlog('res Get_NodeDetail', resNodeDetail)
        let resProcessDetail = await Get_ProcessDetail(this.state.taskid)
        // Utils.nlog('res Get_ProcessDetail', resProcessDetail)
        // let hi = await GetControlList() // xem list control id
        // Utils.nlog('hi', hi)
        if (resNodeDetail.status == 1 && resProcessDetail.status == 1) {
            this.setState({
                dataNodeDetail: resNodeDetail.data,
                dataProcessDetail: resProcessDetail.data,
                Status: resNodeDetail.data.Status
            }, () => {
                this._checkDay()
            })
            this.refLoading.current.hide()
        }
        else {
            if (resNodeDetail.error) {
                UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, resNodeDetail.error ? resNodeDetail.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
            }
            else {
                UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, resProcessDetail.error ? resProcessDetail.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
            }
            setTimeout(() => {
                this.refLoading.current.hide()
                this._goback()
            }, 400);
        }
        return true
    }

    getIdTopicJW = async () => {
        //lấy toppic id bình luận
        let res = await getByComponentName(this.state.taskid)
        // Utils.nlog("res getIdTopicJW22", res.toString())
        if (res) {
            this.setState({ idtopic: res.toString() })
        }
        else {
            this.setState({ idtopic: '' })
        }
        return true
    }

    _uploadFile = (indexAt, type) => {
        if (indexAt == 1) {
            setTimeout(() => {
                this._open_ImageGallery().then(res => {
                    if (this.state.imagePicked) {
                        this._updateFileDinhKem(this.state.images, indexAt)
                    }
                    else null
                })
            }, 500);
            // alert('Chức năng đang phát triển !!')
        }
        if (indexAt == 2) {
            setTimeout(() => {
                this._open_Video().then(res => {
                    if (this.state.videoPicked) {
                        this._updateFileDinhKem(this.state.video, type)
                    }
                })
            }, 500);

        }
        if (indexAt == 3) {
            setTimeout(() => {
                this.MultiFilePicker().then(res => {
                    if (this.state.filePicked) {
                        this._updateFileDinhKem(this.state.file, indexAt)
                    }
                })
            }, 500);
            // alert('Chức năng đang phát triển !!')
        }
    }

    _updateFileDinhKem = async (data, indexAt) => {
        this.refLoading.current.show()
        let item = []
        if (indexAt == 1) {
            item.push({ ContentType: data.type, File: data.strBase64, FileName: data.filename })
        }
        else {
            item.push({ ContentType: data.type, File: data.strBase64, FileName: data.filename })
        }
        let strbody = {}
        strbody = { "RowID": this.state.taskid, "DescriptionFileList": item, "isAdd": true }
        let res = await UpdateTaiLieu(strbody)
        // Utils.nlog('res _updateFileDinhKem', res)
        if (res.status == 1) {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.JeeWork.uploadfilethanhcong, 1)
            this._loadData()
        }
        else {
            this.refLoading.current.hide()
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.JeeWork.uploadfilethatbaivuilong, 2)
        }
        this.setState({ imagePicked: false, filePicked: false, videoPicked: false })
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
            else {
                UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.JeeWork.uploadfilethatbaivuilong, 2)
            }
        }
    }


    handlePress = (indexAt) => {
        var item = this.ActionSheet.state.item
        var isMusic = this.ActionSheet.state.isMusic
        var isImage = this.ActionSheet.state.isImage
        var isVideo = this.ActionSheet.state.isVideo
        // Utils.nlog('indexAt', indexAt)
        if (isImage) {
            if (indexAt == 1) {
                UtilsApp.showImageZoomViewer(this.nthis, item.link)
            }
            if (indexAt == 2) {
                try {
                    Linking.openURL(item.link)
                } catch (error) {
                    UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, error, 2)
                }
            }
            if (indexAt == 3) {
                this._XoaFileDinhkem(this.state.taskid, item)
            }
            else null
        }
        else if (isMusic || isVideo) {
            if (indexAt == 2) {
                try {
                    Linking.openURL(item.link)
                } catch (error) {
                    UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, error, 2)
                }
            }
            if (indexAt == 3) {
                this._XoaFileDinhkem(this.state.taskid, item)
            }
            if (indexAt == 1) {
                Utils.goscreen(this.nthis, 'Modal_PlayMedia', { source: encodeURI(String(item.link)) })
            }
            else null
        }
        else {
            if (indexAt == 1) {
                try {
                    Linking.openURL(item.link)
                } catch (error) {
                    UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, error, 2)
                }
            }
            if (indexAt == 2) {
                this._XoaFileDinhkem(this.state.taskid, item)
            }
            else null
        }

    }

    _XoaFileDinhkem = async (rowID, item) => {
        this.refLoading.current.show()
        // Utils.nlog('item', item)
        let strbody = {}
        strbody = { "RowID": rowID, "DescriptionFileDelete": item.filename_full, "isAdd": false }
        // Utils.nlog('str', strbody)
        let res = await UpdateTaiLieu(strbody)
        // Utils.nlog('res _XoaFileDinhkem', res)
        if (res.status == 1) {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.JeeWork.xoafiledinhkemthanhcong, 1)
            this._loadData()
        }
        else {
            this.refLoading.current.hide()
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
        }
    }

    _goEditData = async (item) => {
        const temp = []
        // Utils.nlog('item', item)
        item.map(i => {
            if (i.IsFieldNode) {
                if (i.ControlID == 1 || i.ControlID == 4 || i.ControlID == 5) {
                    temp.push({ key: i.Title, value: i.Value[0], RowID: i.RowID, controlId: i.ControlID, type: 'string', keyNotNull: true })
                }
                else if (i.ControlID == 2) {
                    temp.push({ key: i.Title, value: i.Value[0], RowID: i.RowID, controlId: i.ControlID, type: 'number', keyNotNull: true })
                }
                else if (i.ControlID == 3) {
                    // console.log('hi', UtilsApp.convertTimeLocal(i.Value[0], "DD/MM/YYYY", 'YYYY-MM-DD' + 'T' + 'HH:mm:ss' + 'Z'))
                    let date = ''
                    if (UtilsApp.convertTimeLocal(i.Value[0], "DD/MM/YYYY", 'YYYY-MM-DD' + 'T' + 'HH:mm:ss' + 'Z') != 'Invalid date') {
                        date = UtilsApp.convertTimeLocal(i.Value[0], "DD/MM/YYYY", 'YYYY-MM-DD' + 'T' + 'HH:mm:ss' + 'Z')
                    }
                    temp.push({ key: i.Title, value: date, RowID: i.RowID, controlId: i.ControlID, type: 'date', keyNotNull: true })
                }
                else if (i.ControlID == 16) {
                    let data = JSON.parse(i.Value[0])
                    // console.log('data', data)
                    let obj = []
                    obj.push({ value: data[0][25], type: "string", keyNotNull: true }, { value: data[0][26], type: "date", keyNotNull: true })
                    // console.log('obj', obj)
                    temp.push({ key: i.Title, value: obj, RowID: i.RowID, controlId: i.ControlID, type: 'list' })
                }
                else if (i.ControlID == 10) {
                    // 1 hình ảnh
                    temp.push({ key: i.Title, value: i.Value, RowID: i.RowID, controlId: i.ControlID, type: 'image' })
                }
                else if (i.ControlID == 12) {
                    // nhiều hình ảnh
                    temp.push({ key: i.Title, value: i.Value, RowID: i.RowID, controlId: i.ControlID, type: 'images', })
                }
                else if (i.ControlID == 13) {
                    // 1 file
                    temp.push({ key: i.Title, value: i.Value, RowID: i.RowID, controlId: i.ControlID, type: 'file', })
                }
                else if (i.ControlID == 14) {
                    // nhiều file
                    temp.push({ key: i.Title, value: i.Value, RowID: i.RowID, controlId: i.ControlID, type: 'files', })
                }
            }
        })
        if (temp.length > 0) {
            Utils.goscreen(this.nthis, 'Modal_ComponentSubmit', {
                object: temp,
                title: RootLang.lang.thongbaochung.chinhsua,
                titleButton: RootLang.lang.thongbaochung.luuchinhsua,
                key: 'key',
                value: 'value',
                keyNotNull: 'keyNotNull',
                callback: this.callback,
            })
        }
        else {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.thongbaochung.khongcodulieu, 4)
        }
    }

    callback = async (list) => {
        this.refLoading.current.show()
        this._UpdateThongTinCanNhap(list)
    }

    _UpdateThongTinCanNhap = async (listData) => {
        // Utils.nlog('listData', listData)
        let strbody = []
        let image = {}
        let images = []
        let file = {}
        let files = []
        let extension = ''
        await listData.map(i => {
            if (i.value.length > 0) {
                if (i.type == 'list' && i.controlId == "16") {
                    let ten = ''
                    let ngaysinh = ''
                    ten = i.value[0]?.value
                    ngaysinh = i.value[1]?.value
                    let data = { "0": { "25": ten, "26": ngaysinh } }
                    strbody.push({ "RowID": i.RowID, "ControlID": i.controlId, "Value": JSON.stringify(data) })
                }
                else if (i.controlId == "10") {
                    extension = i?.value[0]?.type ? i?.value[0]?.type?.split('/') : i?.value[0]?.filename.split('.')
                    if (i?.value[0]?.IsAdd == false) {
                        image = {
                            IsAdd: false,
                            IsDel: false,
                            Type: 1,
                            extension: extension[extension.length - 1],
                            filename: i?.value[0]?.filename,
                            strBase64: i?.value[0]?.strBase64,
                            type: i?.value[0]?.type ? i?.value[0]?.type : i?.value[0]?.node.type,
                        }
                    }
                    else {
                        image = {
                            IsAdd: true,
                            Type: 1,
                            extension: extension[extension.length - 1],
                            filename: i?.value[0]?.filename,
                            strBase64: i?.value[0]?.strBase64,
                            type: i?.value[0]?.type ? i?.value[0]?.type : i?.value[0]?.node.type,
                        }
                    }
                    strbody.push({ "RowID": i.RowID, "ControlID": i.controlId, "Value": [image] })
                }
                else if (i.controlId == "12") {
                    i?.value.map(a => {
                        extension = a?.type ? a?.type?.split('/') : a?.filename.split('.')
                        if (a.IsAdd == false) {
                            images.push({
                                IsAdd: false,
                                IsDel: false,
                                Type: 1,
                                extension: extension,
                                filename: a?.filename,
                                strBase64: a?.strBase64,
                                type: a?.type ? a?.type : a?.node.type,
                            })
                        }
                        else {
                            images.push({
                                IsAdd: true,
                                Type: 1,
                                extension: extension,
                                filename: a?.filename,
                                strBase64: a?.strBase64,
                                type: a?.type ? a?.type : a?.node.type,
                            })
                        }
                    })
                    strbody.push({ "RowID": i.RowID, "ControlID": i.controlId, "Value": images })
                }
                else if (i.controlId == "13") {
                    extension = i?.value[0]?.filename.split('.')
                    if (i?.value[0]?.IsAdd == false) {
                        file = {
                            IsAdd: false,
                            IsDel: false,
                            Type: 1,
                            extension: extension[extension.length - 1],
                            filename: i?.value[0]?.filename,
                            strBase64: i?.value[0]?.strBase64,
                            type: i?.value[0]?.type ? i?.value[0]?.type : i?.value[0]?.node.type,
                        }
                    }
                    else {
                        file = {
                            IsAdd: true,
                            Type: 1,
                            extension: extension[extension.length - 1],
                            filename: i?.value[0]?.filename,
                            strBase64: i?.value[0]?.strBase64,
                            type: i?.value[0]?.type ? i?.value[0]?.type : i?.value[0]?.node.type,
                        }
                    }
                    strbody.push({ "RowID": i.RowID, "ControlID": i.controlId, "Value": [file] })
                }
                else if (i.controlId == "14") {
                    i?.value.map(a => {
                        extension = a?.filename.split('.')
                        if (a.IsAdd == false) {
                            files.push({
                                IsAdd: false,
                                IsDel: false,
                                Type: 1,
                                extension: extension,
                                filename: a?.filename,
                                strBase64: a?.strBase64,
                                type: a?.type ? a?.type : a?.node.type,
                            })
                        }
                        else {
                            files.push({
                                IsAdd: true,
                                Type: 1,
                                extension: extension,
                                filename: a?.filename,
                                strBase64: a?.strBase64,
                                type: a?.type ? a?.type : a?.node.type,
                            })
                        }
                    })
                    strbody.push({ "RowID": i.RowID, "ControlID": i.controlId, "Value": files })
                }
                else {
                    if (i.type == 'date') {
                        var now_utc = ""
                        if (UtilsApp.convertUTC(i.value) != 'Invalid date') {
                            now_utc = UtilsApp.convertUTC(i.value)
                        }
                        else {
                            now_utc = i.value
                        }
                        strbody.push({ "RowID": i.RowID, "ControlID": i.controlId, "Value": now_utc })
                    }
                    else {
                        strbody.push({ "RowID": i.RowID, "ControlID": i.controlId, "Value": i.value })
                    }
                }
            }
        })
        // await Utils.nlog('str', strbody)
        let res = await UpdateThongTinCanNhap(strbody)
        // Utils.nlog('res _UpdateThongTinCanNhap', res)
        if (res.status == 1) {
            this._loadData()
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.JeeWork.chinhsuathongtincannhapthanhcong, 1)
        }
        else {
            this.refLoading.current.hide()
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
        }
    }

    _taoCongViec = () => {
        Utils.goscreen(this.nthis, "TaoGiaoViec_CVQT", {
            callback: this.CallBack,
            stageid: this.state.stageid
        })
    }

    CallBack = async () => {
        this.refLoading.current.show()
        this._loadData()
        this.loadLaiData()
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

    _renderThongTinDauVao = ({ item, index }) => {
        const { dataProcessDetail } = this.state
        return (
            <View style={[styles.row, { borderBottomWidth: index === dataProcessDetail?.datafields.length - 1 ? 0 : 0.3, borderColor: '#E4E6EB' }]}>
                <View style={[styles.chiadoi1, {}]}>
                    <Text style={styles.textTinhtrang}>{item.Title}</Text>
                </View>
                <View style={[{ flex: 1, alignItems: 'flex-end', paddingHorizontal: 5, paddingVertical: 3, }]}>
                    <View style={{ paddingBottom: 5, }}>
                        {this._renderDataThongTin(item)}
                    </View>
                </View>
            </View>
        )
    }

    _renderThongTinCanNhap = ({ item, index }) => {
        const { dataNodeDetail } = this.state
        return (
            item.IsFieldNode ? (
                <View style={[styles.row, { borderBottomWidth: index === dataNodeDetail?.DataFields.length - 1 ? 0 : 0.3, borderColor: '#E4E6EB' }]}>
                    <View style={[styles.chiadoi1, {}]}>
                        <Text style={styles.textTinhtrang}>{item.Title}</Text>
                    </View>
                    <View style={[{ flex: 1, alignItems: 'flex-end', paddingHorizontal: 5, paddingVertical: 3, }]}>
                        <View style={{ paddingBottom: 5, }}>
                            {this._renderDataThongTin(item)}
                        </View>
                    </View>
                </View>
            ) : null
        )
    }

    _renderDataThongTin = (item) => {
        // Utils.nlog('item', item)
        switch (item.ControlID) {
            case 3:
                return (
                    <Text style={styles.textTinhtrang1}>{item?.Value[0] ? moment(item?.Value[0]).format("DD/MM/YYYY") : " -- "}</Text>
                )
            case 16:
                let ten = ''
                let ngaysinh = ''
                let obj = JSON.parse(item?.Value[0])
                ten = obj[0]["25"]
                ngaysinh = obj[0]["26"]
                return (
                    <View style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
                        <Text style={[styles.textTinhtrang1, {}]}>{ten ? ten : '--'}</Text>
                        <Text style={styles.textTinhtrang1}>{ngaysinh ? ngaysinh : '--'}</Text>
                    </View>
                )
            case 10: // hình
                return (
                    item.Value.length > 0 ?
                        <TouchableOpacity style={{ flexDirection: 'row', padding: 5 }}
                            onPress={() => { UtilsApp.showImageZoomViewer(this.nthis, item?.Value[0].link) }}  >
                            <Image source={{ uri: item.Value[0]?.icon }} style={[nstyles.nIcon24, {}]} />
                            <Text style={[styles.textTinhtrang1, { maxWidth: Width(45) }]} numberOfLines={1}>{item?.Value[0]?.filename}</Text>
                        </TouchableOpacity>
                        : null
                )
            case 13: //file
                return (
                    item.Value.length > 0 ?
                        <TouchableOpacity style={{ padding: 5, flexDirection: 'row' }}
                            onPress={() => { Linking.openURL(item?.Value[0].link) }}>
                            <Image source={{ uri: item.Value[0]?.icon }} style={[nstyles.nIcon24, {}]} />
                            <Text style={[styles.textTinhtrang1, { maxWidth: Width(45) }]} numberOfLines={1}>{item?.Value[0].filename}</Text>
                        </TouchableOpacity>
                        : null
                )
            case 12: // nhiều hình
                return (
                    item.Value.length > 0 ? (
                        <View style={{}}>
                            {
                                item.Value.map(i => {
                                    return (
                                        <TouchableOpacity style={{ flexDirection: 'row', padding: 2, }}
                                            onPress={() => { UtilsApp.showImageZoomViewer(this.nthis, i.link) }} >
                                            <Image source={{ uri: i?.icon }} style={[nstyles.nIcon24, {}]} />
                                            <Text style={[styles.textTinhtrang1, { maxWidth: Width(45) }]} numberOfLines={1}>{i.filename} </Text>
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </View>
                    ) : (null)
                )
            case 14: // nhiều file
                return (
                    item.Value.length > 0 ? (
                        <View style={{}}>
                            {
                                item.Value.map(i => {
                                    return (
                                        <TouchableOpacity style={{ flexDirection: 'row', padding: 2 }}
                                            onPress={() => { Linking.openURL(i.link) }} >
                                            <Image source={{ uri: i?.icon }} style={[nstyles.nIcon24, {}]} />
                                            <Text style={[styles.textTinhtrang1, { maxWidth: Width(45) }]} numberOfLines={1}>{i.filename}</Text>
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </View>
                    ) : (null)
                )
            default:
                return <Text style={styles.textTinhtrang1}>{item?.Value[0] ? item?.Value[0] : " -- "}</Text>
        }
    }

    _renderFiles = ({ item, index }) => {
        let data = item.filename_full.split("/")
        let filename = data[data.length - 1]
        return (
            <TouchableOpacity style={styles.row_spacebetween}
                onPress={() => {
                    var duoiFile = String(filename).split('.').slice(-1).toString()
                    if (duoiFile == 'jpg' || duoiFile == 'png' || duoiFile == 'PNG' || duoiFile == 'JPG' || duoiFile == 'HEIC') {
                        this.setState({
                            option: [
                                RootLang.lang.JeeWork.huy,
                                RootLang.lang.JeeWork.xem,
                                RootLang.lang.JeeWork.taifilexuong,
                                <Text style={{ color: 'red', fontSize: 18 }}>{RootLang.lang.JeeWork.xoafiledinhkem}</Text>,

                            ]
                        }, () => {
                            this.ActionSheet.setState({ item: item, isImage: true }, () => {
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
                            this.ActionSheet.setState({ item: item, isMusic: true }, () => {
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
                            this.ActionSheet.setState({ item: item, isVideo: true }, () => {
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
                            this.ActionSheet.setState({ item: item }, () => {
                                this.ActionSheet.show()
                            })
                        })
                    }
                }} >
                <View style={styles.khungFile}>
                    <Image style={[nstyles.nIcon24, { marginRight: 5 }]} source={UtilsApp._returnImageFile(item.filename_full)} />
                    <Text style={styles.filename} numberOfLines={1}>{filename}</Text>
                </View>
                <View style={styles.viewbacham} >
                    <Image source={Images.ImageJee.icBaCham} resizeMode='contain' style={[nstyles.nIcon14, {}]} />
                </View>
            </TouchableOpacity>
        )
    }

    _goCongViecChiTiet = (RowID) => {
        // Utils.goscreen(this, 'sc_CongViecChiTiet_QT', { rowid: RowID })
        Utils.goscreen(this.nthis, 'sc_TabCongViecChiTietQuyTrinh', { rowid: RowID })
    }

    _Status = (coStr = false) => {
        // let ListStatus = [
        //     { "id_row": 0, "statusname": 'Tạm dừng', "color": "#DA3849" },
        //     { "id_row": 1, "statusname": 'Đang thực hiện, "color": colors.orange1 },
        //     { "id_row": 2, "statusname": 'Hoàn thành', "color": colors.colorTabActive }]
        let ListStatus = []
        if (coStr == true) {
            if (this.state.dataNodeDetail?.Status == null) {
                ListStatus = [
                    { "id_row": 1, "statusname": 'Đang thực hiện', "color": colors.orange1 }]
            }
            else if (this.state.dataNodeDetail?.Status == 1) {
                ListStatus = [
                    { "id_row": 0, "statusname": 'Đang tạm dừng', "color": "#DA3849" }]
            }
            else if (this.state.dataNodeDetail?.Status == 0 || this.state.dataNodeDetail?.Status == 2) {
                ListStatus = [
                    { "id_row": 1, "statusname": 'Đang thực hiện', "color": colors.orange1 }]
            }
        }
        else {
            if (this.state.dataNodeDetail?.Status == null) {
                ListStatus = [
                    { "id_row": 1, "statusname": 'Đang thực hiện', "color": colors.orange1 },
                    { "id_row": 2, "statusname": 'Hoàn thành', "color": colors.colorTabActive }]
            }
            else if (this.state.dataNodeDetail?.Status == 1) {
                ListStatus = [
                    { "id_row": 0, "statusname": 'Đang tạm dừng', "color": "#DA3849" },
                    { "id_row": 2, "statusname": 'Hoàn thành', "color": colors.colorTabActive }]
            }
            else if (this.state.dataNodeDetail?.Status == 0 || this.state.dataNodeDetail?.Status == 2) {
                ListStatus = [
                    { "id_row": 1, "statusname": 'Đang thực hiện', "color": colors.orange1 }]
            }
        }

        Utils.goscreen(this.nthis, 'Modal_ComponentSelectCom', {
            callback: this._callbackStatus,
            item: this.state.Status, AllThaoTac: ListStatus, ViewItem: this.ViewItemStatus
        })
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
                            this._updateStatusNode(Status)
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

    _goGetLyDo = () => {
        const temp = [{ key: "Lý do", value: '', type: 'string', keyNotNull: true }]
        Utils.goscreen(this.nthis, 'Modal_ComponentSubmit', {
            object: temp,
            title: 'Cập nhật thông tin',
            titleButton: RootLang.lang.JeeWork.luuvadong,
            key: 'key',
            value: 'value',
            keyNotNull: 'keyNotNull',
            callback: this.callback_goGetLyDo,
        })
    }

    callback_goGetLyDo = async (list) => {
        // Utils.nlog('list', list)
        await this._updateStatusNode('', true, list[0]?.value)
    }

    _updateStatusNode = async (data, tamdung = false, note = '') => {
        this.refLoading.current.show()
        let strbody = {}
        // Utils.nlog('data', data)
        if (data.id_row == 0 || tamdung) {
            strbody = { "ID": this.state.stageid, "Status": data.id_row ? data.id_row : 0, Note: note }
        }
        else {
            strbody = { "ID": this.state.stageid, "Status": data.id_row }
        }
        // Utils.nlog('body', strbody)
        const res = await UpdateStatusNode(strbody)
        // Utils.nlog('res _updateStatusNode', res)
        if (res.status == 1) {
            // this.refLoading.current.hide()
            UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, RootLang.lang.JeeWork.capnhatthanhcong, 1)
            await this._loadData()
            await this.loadLaiData()
        }
        else if (res.status == 2) {
            this._get_FieldsNode()
        }
        else {
            this.refLoading.current.hide()
            UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, res.error ? res.error.message : RootLang.lang.JeeWork.capnhatthatbaivuilong, 2)
        }
        return true
    }

    _get_FieldsNode = async () => {
        let res = await Get_FieldsNode(this.state.stageid)
        // Utils.nlog('res _get_FieldsNode', res)
        if (res.status == 1) {
            this.refLoading.current.hide()
            setTimeout(() => {
                Utils.goscreen(this.nthis, 'Modal_ChuyenGiaiDoan_QT', {
                    rowid: this.state.stageid, data: res.data,
                    callback: this.callBackChuyenGiaoDoan
                })
            }, 500)
        }
        else {
            this.refLoading.current.hide()
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.JeeWork.uploadfilethatbaivuilong, 2)
        }
    }

    callBackChuyenGiaoDoan = () => {
        this.refLoading.current.show()
        this._loadData()
        this.loadLaiData()
    }

    _duyetYeuCau = async (Rowid) => {
        this.refLoading.current.show()
        let res = await Get_FieldsNode(Rowid)
        // Utils.nlog('res _duyetYeuCau', res)
        if (res.status == 1) {
            this.refLoading.current.hide()
            setTimeout(() => {
                Utils.goscreen(this.nthis, 'Modal_ChuyenGiaiDoan_QT', { rowid: Rowid, data: res.data ? res.data : res, callback: this.callBackChuyenGiaoDoan, callbackGetData: this.callbackGetData })
            }, 500)
        }
        else {
            this.refLoading.current.hide()
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.JeeWork.uploadfilethatbaivuilong, 2)
        }
    }

    callbackGetData = (data) => {
        setTimeout(() => {
            this._duyetYeuCau(data.RowID)
        }, 500)
    }

    _chucNangKhac = (coStr = false) => {
        Utils.goscreen(this.nthis, 'Modal_ComponentSelectCom', {
            callback: this._callbackchucNangKhac,
            item: this.state.chucnang, AllThaoTac: this.state.chucNangkhac, ViewItem: this.ViewItemChucNang
        })
    }

    _callbackchucNangKhac = async (chucnang) => {
        try {
            setTimeout(() => {
                if (chucnang.id == 0) {
                    Utils.goscreen(this.nthis, 'Modal_GiaoNguoiThucHien', { id: this.state.stageid, callback: this.CallBack })
                }
                else if (chucnang.id == 1) {
                    this._duyetYeuCau(this.state.stageid)
                }
                else {
                    this._ChuyenGiaiDoan()
                }
            }, 500)
        } catch (error) { }
    }

    ViewItemChucNang = (item) => {
        return (
            <View key={item.id.toString()} style={{ flexDirection: "row", alignSelf: "center", alignItems: 'center' }}>
                <Image source={item.icon} resizeMode='contain' style={[nstyles.nIcon14, { marginRight: 5, tintColor: item.id != 1 ? '#1A9463' : null }]} />
                <Text style={{
                    textAlign: "center", fontSize: reText(16),
                    alignSelf: "center",
                    color: item.color,
                    fontWeight: this.state.chucnang.id == item.id ? "bold" : 'normal'
                }}>{item.title ? item.title : ""}</Text>
            </View>
        )
    }

    _ChuyenGiaiDoan = async () => {
        this.refLoading.current.show()
        let body = {}
        body = {
            "InfoChuyenGiaiDoanData": [],
            "IsNext": false,
            "NodeID": this.state.stageid,
            "NodeListID": 0,
        }
        // Utils.nlog('body', body)
        let res = await ChuyenGiaiDoan(body)
        // Utils.nlog('res ChuyenGiaiDoan', res)
        if (res.status == 1) {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.JeeWork.chuyengiaidoanthanhcong, 1)
            this._loadData()
            this.loadLaiData()
        }
        else {
            this.refLoading.current.hide()
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
        }
    }

    _editCongViecChiTiet = (indexAt) => {
        var item = this.ActionSheetCongViec.state.item
        if (indexAt == 1) {
            //chỉnh sửa
            Utils.goscreen(this.nthis, "TaoGiaoViec_CVQT", {
                callback: this.CallBack,
                stageid: this.state.stageid,
                item: item,
                chinhsua: true
            })
        }
        if (indexAt == 2) {
            //xóa
            Utils.showMsgBoxYesNo(this.nthis, RootLang.lang.JeeWork.thongbao, RootLang.lang.JeeWork.bancomuonxoacongviec, RootLang.lang.thongbaochung.co, RootLang.lang.thongbaochung.khong, () => {
                this._deleteCongViec(item)
            }
            )
        }
    }

    _deleteCongViec = async (item) => {
        this.refLoading.current.show()
        // Utils.nlog('item', item)
        let res = await delToDo(item.RowID)
        // Utils.nlog('res _deleteCongViec', res)
        if (res.status == 1) {
            this.refLoading.current.hide()
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.JeeWork.xoacongviecthanhcong, 1)
            this.callBackChuyenGiaoDoan()
        }
        else {
            this.refLoading.current.hide()
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
        }
    }

    _xemHoatDong = () => {
        Utils.goscreen(this.nthis, "sc_HoatDong", { stageid: this.state.stageid, coHeader: true })
    }

    _checkDay = () => {
        // false: chưa hết hạn, true: đã hết hạn
        const { dataNodeDetail, } = this.state
        if (dataNodeDetail?.HanChot) {
            let ngayDeadline = moment(dataNodeDetail.HanChot).format('MM/DD/YYYY HH:mm:ss')
            // x : ngày deadline
            //y: ngày hiện tại
            const x = new Date(ngayDeadline);
            // hiện tại : 28/01/2022
            const y = new Date();
            //ngày hiện tại lớn hơn ngày deadline
            if ((x < y) == true) {
                this.setState({ cungngay: true })
            }
            else {
                this.setState({ cungngay: false })
            }
            // console.log('ngayDeadline', ngayDeadline)
            // console.log('x', x)
            // console.log('y', y)
            // console.log('x < y', x < y); // false
            // console.log('x > y', x > y); // false
            // console.log('+x === +y', +x === +y); // true
        }
    }

    _renderCongViecChiTiet = ({ item, index }) => {
        let colorThucHien = colors.orange1
        let corlorGiamMau = colors.orange1
        if (item?.Status == null) {
            colorThucHien = colors.gray1
            corlorGiamMau = colors.colorBtnGray
        }
        else if (item?.Status == 1 || item?.Status == 0) {
            colorThucHien = colors.orange1
            corlorGiamMau = colors.yellowColor
        }
        else {
            colorThucHien = colors.colorTabActive
            corlorGiamMau = '#7BC78E'
        }
        return (
            <TouchableOpacity
                disabled={item.IsEditStatus ? false : true}
                style={[styles.row, { paddingVertical: item.Data_Implementer.length > 0 ? 5 : 10, borderWidth: 0.3, borderColor: '#E4E6EB', marginRight: 3 }]}
                onPress={() => this._goCongViecChiTiet(item.RowID)}
                onLongPress={() => {
                    item.IsEdit ? (this.ActionSheetCongViec.setState({ item: item }, () => {
                        this.ActionSheetCongViec.show()
                    })) : (null)
                }} >
                <View style={[styles.khungTenCV, { flexDirection: 'row', borderRightWidth: 0.3, borderColor: '#E4E6EB', alignItems: 'center' }]}>
                    <View style={[styles.hinhvuong1, { backgroundColor: item.IsEditStatus ? colorThucHien : corlorGiamMau, }]}></View>
                    <Text style={styles.textTinhtrang}>{item.TaskName}</Text>
                </View>
                <View style={[styles.khungAvaCV, { justifyContent: 'flex-end' }]}>
                    <View style={styles.bocScrollView}>
                        <ScrollView horizontal={true} style={{}} contentContainerStyle={{}}>
                            <View onStartShouldSetResponder={() => true} style={styles.khungAvaCvChiTiet}>
                                {item.Data_Implementer.map((i, index) => {
                                    return (
                                        <View style={[styles.paddingLeft, {}]}>
                                            {
                                                i.AvartarImgURL != '' ?
                                                    <Image source={{ uri: i.AvartarImgURL }} style={[nstyles.nAva32, {}]} />
                                                    :
                                                    <View style={{
                                                        backgroundColor: this.intToRGB(this.hashCode(i.ObjectName)),
                                                        width: 32, height: 32, flexDirection: "row", borderRadius: 99, marginRight: 5, justifyContent: 'center'
                                                    }}>
                                                        <Text style={styles.textName}>{String(i.ObjectName).split(" ").slice(-1).toString().slice(0, 2).toString()}</Text>
                                                    </View>
                                            }
                                        </View>
                                    )
                                })}
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    scrollToBot = () => {
        setTimeout(() => { this.scroll?.props?.scrollToEnd(true) }, Platform.OS == 'ios' ? 1200 : 2200)
    }

    render() {
        const { topicId, dataNodeDetail, dataProcessDetail, idtopic, cungngay } = this.state
        let textThucHien = 'Đang cập nhật'
        let colorThucHien = colors.orange1
        if (dataNodeDetail?.Status == null) {
            textThucHien = 'Chưa thực hiện'
            colorThucHien = colors.gray1
        }
        else if (dataNodeDetail?.Status == 1) {
            textThucHien = 'Đang thực hiện'
            colorThucHien = colors.orange1
        }
        else if (dataNodeDetail?.Status == 0) {
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
                    // onPressRight={() => { Utils.goscreen( this.nthis, 'Modal_LocBaiDang') }}
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
                        nestedScrollEnabled={true}
                        keyboardShouldPersistTaps={"handled"} style={{ backgroundColor: '#F4F4F4', flex: 1 }}>
                        <View style={{ marginHorizontal: 10, marginTop: 10, }}>
                            <View style={styles.header}>
                                <View style={[styles.paddingHorizontal, { paddingLeft: 10 }]}>
                                    <Text style={styles.fonsize12} > {dataProcessDetail?.ProcessName && dataNodeDetail?.CongViec ? dataProcessDetail?.ProcessName + " / " + dataNodeDetail?.CongViec : '--'}</Text>
                                    <Text style={styles.TaskName}>{dataProcessDetail?.TaskName}</Text>
                                    <HTML source={{ html: dataProcessDetail?.Description ? `<div>${dataProcessDetail?.Description} </div>` : "<div></div>" }}
                                        containerStyle={{ paddingHorizontal: 5, color: '#8F9294' }}
                                        tagsStyles={{
                                            div: { margin: 0, color: '#404040', paddingTop: 5, fontSize: reText(14) },
                                        }} />
                                </View>
                                <View style={[styles.row, { paddingLeft: 10 }]}>
                                    {
                                        dataNodeDetail?.NguoiThucHien ?
                                            <FastImagePlaceholder
                                                style={nstyles.nAva32}
                                                source={{ uri: dataNodeDetail?.NguoiThucHien[0]?.Image }} resizeMode={"cover"}
                                                placeholder={Images.icAva}
                                            /> : null
                                    }
                                    <View style={styles.row_centerKhungChuathuchien}>
                                        <TouchableOpacity
                                            disabled={dataNodeDetail?.IsEditStatus ? false : true}
                                            onPress={() => { this._Status(dataNodeDetail?.stage_result?.length > 0 ? true : false) }}
                                            style={[styles.khungdanglam, {}]}>
                                            <View style={[styles.danglam, { backgroundColor: colorThucHien }]}>
                                                <Text style={styles.textDanglam}>{textThucHien}</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            disabled={dataNodeDetail?.IsEditStatus ? false : true}
                                            onPress={() => { this._chucNangKhac() }} >
                                            <View style={[styles.hinhvuong, { backgroundColor: colorThucHien }]}>
                                                <Image source={Images.ImageJee.ic_MuiTenDangLam} style={[{ width: Width(2), height: Width(3) }]} />
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={[styles.row_center, { marginTop: 10, borderBottomWidth: 0.3, borderColor: '#E4E6EB' }]}>
                                    <View style={styles.khungImage}>
                                        <Image source={Images.ImageJee.ic_Ngaynhan} style={[nstyles.nIcon24, { marginRight: 5 }]} />
                                    </View>
                                    <View >
                                        <Text style={styles.fonsize}> {RootLang.lang.JeeWork.thoigiannhan}: </Text>
                                    </View>
                                    <Text style={styles.textDataRight}> {dataNodeDetail.AssignDate ? Utils.formatTimeAgo(moment(dataNodeDetail.AssignDate).format('MM/DD/YYYY HH:mm:ss'), 1, true) : "--"}  </Text>
                                </View>

                                <View style={[styles.row_center, { borderBottomWidth: 0.3, borderColor: '#E4E6EB' }]}>
                                    <View style={styles.khungImage}>
                                        <Image source={Images.ImageJee.icClock} style={[nstyles.nIcon24, { marginRight: 5 }]} />
                                    </View>
                                    <View style={styles.colum_paddingLeft}>
                                        <Text style={styles.fonsize}>{RootLang.lang.JeeWork.batdauluc}: </Text>
                                    </View>
                                    <Text style={styles.textDataRight}> {dataNodeDetail.NgayBatDau ? Utils.formatTimeAgo(moment(dataNodeDetail.NgayBatDau).format('MM/DD/YYYY HH:mm:ss'), 1, true) : "--"}  </Text>
                                </View>
                                <View style={[styles.row_center, { borderBottomWidth: 0.3, borderColor: '#E4E6EB' }]}>
                                    <View style={styles.khungImage}>
                                        <Image source={Images.ImageJee.icOClock} style={[nstyles.nIcon24, { marginRight: 5 }]} />
                                    </View>
                                    <View style={styles.colum_paddingLeft}>
                                        <Text style={styles.fonsize}>{RootLang.lang.JeeWork.deadline}:</Text>
                                    </View>
                                    {
                                        cungngay == true ?
                                            <Text style={[styles.textDeadline1, { color: '#FC0030' }]}>{dataNodeDetail?.HanChot ? Utils.formatTimeAgo(moment(dataNodeDetail.HanChot).format('MM/DD/YYYY HH:mm:ss'), 2, true) : "--"}  </Text>
                                            :
                                            <Text style={[styles.textDeadline1, { color: colors.textTabActive }]}>{dataNodeDetail?.HanChot ? Utils.formatTimeAgo(moment(dataNodeDetail.HanChot).format('MM/DD/YYYY HH:mm:ss'), 1, true) : "--"}  </Text>
                                    }
                                </View>
                                <View style={[styles.row_center, { borderBottomWidth: 0.3, borderColor: '#E4E6EB' }]}>
                                    <View style={styles.khungImage}>
                                        <Image source={Images.ImageJee.jwTinhTrang} style={[nstyles.nIcon24, { marginRight: 5 }]} />
                                    </View>
                                    <View style={styles.colum_paddingLeft}>
                                        <Text style={styles.fonsize}>{RootLang.lang.JeeWork.hoanthanh}: </Text>
                                    </View>
                                    <Text style={styles.textDataRight}> {dataNodeDetail.CompleteDate ? Utils.formatTimeAgo(moment(dataNodeDetail.CompleteDate).format('MM/DD/YYYY HH:mm:ss'), 1, true) : "--"}  </Text>
                                </View>

                                <View style={[styles.row_center_Dalam, {}]}>
                                    <View style={styles.khungImage}>
                                        <Image source={Images.ImageJee.jwTime} style={[nstyles.nIcon24, { marginRight: 5 }]} />
                                    </View>
                                    <View >
                                        <Text style={styles.fonsize}> {RootLang.lang.JeeWork.dalam}: </Text>
                                    </View>
                                    <Text style={styles.textDataRight}>{dataNodeDetail.TGLam ? Number(dataNodeDetail?.TGLam).toFixed(2) + 'h' : "--"}  </Text>
                                </View>

                                {
                                    dataNodeDetail?.stage_result?.length > 0 && dataNodeDetail?.IsEditStatus == true ?
                                        <View style={styles.khungduyet}>
                                            <TouchableOpacity style={[styles.touchduyet, { backgroundColor: dataNodeDetail.stage_result[1]?.Title == 'Duyệt' ? '#0A9562' : '#FC0030' }]}
                                                onPress={() => { this._duyetYeuCau(dataNodeDetail.stage_result[1]?.RowID) }}
                                            >
                                                <Text style={styles.textDuỵet}>{dataNodeDetail.stage_result[1]?.Title}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={[styles.touchkhongduyet, { backgroundColor: dataNodeDetail.stage_result[0]?.Title == 'Không duyệt' ? '#FC0030' : '#0A9562' }]}
                                                onPress={() => { this._duyetYeuCau(dataNodeDetail.stage_result[0]?.RowID) }}>
                                                <Text style={styles.textDuỵet}>{dataNodeDetail.stage_result[0]?.Title}</Text>

                                            </TouchableOpacity>
                                        </View> : null
                                }
                                {
                                    !!dataNodeDetail?.ContentStr &&
                                    <View style={styles.khungphieuduyet}>
                                        <View style={styles.canhgiuatextPhieuDuyet}>
                                            <Text style={styles.textPhieuDuyet}>{RootLang.lang.JeeWork.phieuduyetyeucau}</Text>
                                        </View>
                                        <HTML source={{ html: `<div>${dataNodeDetail?.ContentStr} </div>` }} containerStyle={{ paddingHorizontal: 10 }} />
                                    </View>
                                }
                            </View>
                        </View>
                        <View style={styles.khungShadow}>
                            <Text style={styles.title} >{RootLang.lang.JeeWork.thongtindauvao}</Text>
                            <FlatList
                                data={dataProcessDetail?.datafields}
                                renderItem={this._renderThongTinDauVao}
                                keyExtractor={(item, index) => index.toString()}
                                ListEmptyComponent={dataProcessDetail?.datafields?.length == 0 ? <TextNull /> : null}
                            />
                        </View>

                        <View style={styles.khungShadow}>
                            <View style={styles.row_spacebetween}>
                                <Text style={styles.title}>{RootLang.lang.JeeWork.thongtincannhap}</Text>
                                {
                                    dataNodeDetail?.DataFields?.length != 0 ?
                                        <TouchableOpacity style={[styles.row_center, { paddingVertical: 6, paddingLeft: 10, }]}
                                            onPress={() => { this._goEditData(dataNodeDetail?.DataFields) }}>
                                            <Image source={Images.ImageJee.ic_Chinhsua} resizeMode={"contain"} style={[nstyles.nIcon14, {}]} />
                                            <Text style={styles.textChinhsua}>{RootLang.lang.JeeWork.chinhsua}</Text>
                                        </TouchableOpacity> : null
                                }
                            </View>
                            <FlatList
                                // style={{ flex: 1 }}
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                                nestedScrollEnabled={true}
                                scrollEnabled={true}
                                data={dataNodeDetail?.DataFields}
                                renderItem={this._renderThongTinCanNhap}
                                keyExtractor={(item, index) => index.toString()}
                                ListEmptyComponent={dataNodeDetail?.DataFields?.length == 0 ? <TextNull /> : null}
                            />

                        </View>

                        <View style={styles.khungShadow}>
                            <View style={styles.row_spacebetween}>
                                <Text style={styles.title} >{RootLang.lang.JeeWork.congvienchitiet}</Text>
                                {
                                    dataNodeDetail?.isedit_task ?
                                        <TouchableOpacity style={[styles.row_center, { paddingVertical: 6, paddingLeft: 10, }]}
                                            onPress={() => {
                                                this._taoCongViec()
                                            }}>
                                            <Image source={Images.ImageJee.ic_Themmoi} resizeMode={"contain"} style={[nstyles.nIcon12, {}]} />
                                            <Text style={styles.textThemmoicvct}>{RootLang.lang.JeeWork.themmoi}</Text>
                                        </TouchableOpacity> : null
                                }
                            </View>
                            <FlatList
                                data={dataNodeDetail.DataToDo}
                                renderItem={this._renderCongViecChiTiet}
                                keyExtractor={(item, index) => index.toString()}
                                ListEmptyComponent={dataNodeDetail?.DataToDo?.length == 0 ? <TextNull /> : null}
                            />
                        </View>
                        <View style={styles.khungShadow}>
                            <Text style={styles.title} >{RootLang.lang.JeeWork.tailieudinhkem}</Text>
                            <FlatList
                                data={dataProcessDetail?.filelist}
                                renderItem={this._renderFiles}
                                keyExtractor={(item, index) => index.toString()}
                                ListEmptyComponent={dataProcessDetail?.filelist?.length == 0 ? <TextNull /> : null}
                            />
                            <View style={styles.khungthemmoi}>
                                <TouchableOpacity
                                    onPress={() => { this.ActionSheetDinhKem.show() }}
                                    style={styles.touch_themmoi}>
                                    <Text style={styles.textThemmoi} > {RootLang.lang.JeeWork.themmoi}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.khungShadowBinhLuan}>
                            <View style={[styles.groupviewBinhluan, {}]}>
                                <Text style={[styles.title, { paddingLeft: 10 }]}>{RootLang.lang.JeeRequest.sc_ChiTietYeuCau.binhluan.toUpperCase()}</Text>
                                <View style={{ flex: 1, backgroundColor: 'red', }}>
                                    {
                                        idtopic != '' ? (
                                            <Modal_BinhLuan topicId={idtopic} nthis={this.nthis} request={true} onToDo={this.scrollToBot}></ Modal_BinhLuan>
                                        ) : (null)
                                    }
                                </View>
                            </View>
                        </View>
                    </KeyboardAwareScrollView>
                    <IsLoading ref={this.refLoading} />
                    <ActionSheet
                        //nút thêm mới
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
                    <ActionSheetCustom
                        //data tài liệu đính kèm
                        ref={o => { this.ActionSheet = o }}
                        title={RootLang.lang.JeeWork.bancomuonthuchien}
                        options={this.state.option}
                        cancelButtonIndex={CANCEL_INDEX}
                        destructiveButtonIndex={DESTRUCTIVE_INDEX}
                        onPress={this.handlePress}
                    />
                    <ActionSheet
                        //long press công việc chi tiết
                        ref={o => { this.ActionSheetCongViec = o }}
                        title={RootLang.lang.JeeWork.bancomuonthuchien}
                        options={[
                            RootLang.lang.JeeWork.huy,
                            RootLang.lang.JeeWork.chinhsuacongviec,
                            RootLang.lang.JeeWork.xoacongviec,
                        ]}
                        cancelButtonIndex={CANCEL_INDEX}
                        destructiveButtonIndex={3}
                        onPress={(indexAt) => this._editCongViecChiTiet(indexAt)}
                    />
                </View>
            </View >
        )
    }
}

const styles = StyleSheet.create({
    header: {
        justifyContent: 'center',
        backgroundColor: colors.white,
        paddingVertical: 10,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.25,
        shadowRadius: 1,
        elevation: 5,
    },
    groupview: {
        backgroundColor: colors.white,
        marginTop: 8,
        paddingHorizontal: 5,
        paddingTop: 5,
        paddingBottom: 10,
        borderRadius: 10,
        paddingLeft: 10
    },
    groupviewBinhluan: {
        backgroundColor: colors.white,
        // marginTop: 8,
        // paddingHorizontal: 5,
        paddingTop: 5,
        paddingBottom: 10,
        borderRadius: 10,

    },

    row_center: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingLeft: 10,
    },
    row_centerKhungChuathuchien: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    row_center_Dalam: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
        paddingLeft: 10,
    },
    row: {
        flexDirection: 'row'
    },
    row_paddingLeft: {
        flexDirection: 'row',
        paddingLeft: 10
    },
    colum_paddingLeft: {
        paddingLeft: 5
    },
    paddingLeft: {
        paddingRight: 10
    },
    danglam: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        paddingVertical: 1,
        paddingHorizontal: 5
    },
    hinhvuong: {
        height: Height(3),
        marginLeft: 5,
        justifyContent: 'center',
        alignItems: 'center',
        width: Height(3),
        borderRadius: 4,
    },
    textDeadline: {
        color: '#FC0030'
    },
    textDeadline1: {
        paddingLeft: 14,
        fontSize: reText(14),
        paddingVertical: 3,
        textAlign: 'right', flex: 1,
        paddingRight: 10
    },
    chiadoi: {
        width: Width(50),
        paddingHorizontal: 5,
        paddingVertical: 5
    },
    khungduyet: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 15
    },
    textDuỵet: {
        fontSize: reText(16),
        color: colors.white,
        fontWeight: 'bold'
    },
    textKhongduyet: {
        fontSize: reText(16),
        color: colors.white,
        fontWeight: 'bold',
    },
    touchduyet: {
        backgroundColor: '#0A9562',
        width: Height(18),
        height: Height(4.5),
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.25,
        shadowRadius: 1,
        elevation: 5,
        padding: 0,
        borderRadius: 4,
    },
    touchkhongduyet: {
        backgroundColor: '#FC0030',
        width: Height(18),
        height: Height(4.5),
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.25,
        shadowRadius: 1,
        elevation: 5,
        padding: 0,
        borderRadius: 4,
    },
    row_spacebetween: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center'
    },
    textTinhtrang: {
        fontSize: sizes.sText14,
        color: '#8F9294',
        paddingVertical: 3
    },
    textTinhtrang1: {
        fontSize: sizes.sText16,
        color: colors.black,
        paddingVertical: 3,
        // marginRight: 10
    },
    textChinhsua: {
        color: '#FFA800',
        fontSize: sizes.sText16,
        paddingHorizontal: 5
    },
    textThemmoicvct: {
        color: '#0A9562',
        fontSize: reText(14),
        paddingHorizontal: 5
    },
    hinhvuong1: {
        height: Height(2.5),
        marginRight: 5,
        width: Height(2.5),
        borderRadius: 4,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.25,
        shadowRadius: 1,
        elevation: 5,
        padding: 0,
    },
    khungthemmoi: {
        alignItems: 'center',
        paddingTop: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.25,
        shadowRadius: 1,
        elevation: 5,
    },
    touch_themmoi: {
        alignItems: "center",
        justifyContent: 'center',
        borderRadius: 4,
        borderWidth: 0.3,
        height: Height(3.6),
        width: Width(87),
        borderStyle: 'dashed',
        backgroundColor: '#F7F8FA'
    },
    textThemmoi: {
        color: '#65676B',
        fontSize: reText(12)
    },
    with50: {
        width: Width(50)
    },
    khungAvaCvChiTiet: {
        flexDirection: 'row',
        // justifyContent: 'flex-end',
        paddingHorizontal: 5
    },
    flexend: {
        justifyContent: 'flex-end'
    },
    title: {
        fontWeight: 'bold',
        paddingVertical: 5,
        fontSize: sizes.sText16,
        color: colors.tabGreen,
    },
    khungphieuduyet: {
        backgroundColor: '#F2F3F5',
        marginTop: 15,
        marginHorizontal: 10,
        borderRadius: 10
    },
    textPhieuDuyet: {
        fontSize: reText(14), fontWeight: 'bold', paddingTop: 12
    },
    canhgiuatextPhieuDuyet: {
        justifyContent: 'center', alignItems: 'center'
    },
    fonsize: {
        fontSize: sizes.sText16,
        color: colors.grey,
    },
    textDataLeft: {
        fontSize: reText(14),
        paddingVertical: 3,
        color: '#000000'
    },
    textDataRight: {
        fontSize: reText(14),
        paddingVertical: 3,
        color: '#000000',
        textAlign: 'right', flex: 1,
        paddingRight: 10
    },
    paddingHorizontal: {
        paddingHorizontal: 5
    },
    khungdanglam: {
        paddingLeft: 10,
        alignItems: 'center',
        flexDirection: 'row'
    },
    textDanglam: {
        paddingHorizontal: 5,
        color: colors.white,
        fontSize: sizes.sText16,
    },
    fonsize12: {
        fontSize: reText(12)
    },
    TaskName: {
        fontSize: reText(22),
        paddingTop: 5,
        color: '#404040'
    },
    khungFile: {
        flexDirection: 'row',
        alignItems: 'center',
        // width: Width(85)
    },
    filename: {
        fontSize: reText(14),
        color: '#8F9294',
        maxWidth: Width(75),
    },
    viewbacham: {
        paddingVertical: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight: 5
    },
    chiadoi1: {
        width: Width(50),
        paddingHorizontal: 5,
        paddingVertical: 3,
    },
    paddingLeft: {
        paddingLeft: 2
    },
    bocScrollView: {
        flex: 1,
        alignSelf: 'flex-end'
    },
    textName: {
        alignSelf: "center", fontWeight: "bold", fontSize: reText(12), color: colors.white
    },
    khungImage: {
        width: Width(5), justifyContent: 'center', alignItems: 'center'
    },
    khungShadow: {
        marginHorizontal: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.25,
        shadowRadius: 1,
        elevation: 5,
        backgroundColor: colors.white,
        borderRadius: 10,
        marginTop: 12,
        paddingHorizontal: 5,
        paddingBottom: 10,
        paddingLeft: 10
    },
    khungTenCV: {
        paddingLeft: 10,
        flex: 1
    },
    khungAvaCV: {
        width: Width(12),
    },
    khungShadowBinhLuan: {
        marginHorizontal: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.25,
        shadowRadius: 1,
        elevation: 5,
        backgroundColor: colors.white,
        borderRadius: 10,
        marginTop: 12,
        // paddingHorizontal: 5,
        paddingBottom: 10,

    },
})

export default ChiTietCongViecQuyTrinh


class TextNull extends Component {
    render() {
        return (
            <View style={styles.canhgiuatextPhieuDuyet}>
                <Text style={[styles.fonsize, { color: colors.gray1 }]}>{RootLang.lang.JeeWork.khongcodulieu}</Text>
            </View>
        )

    }
}