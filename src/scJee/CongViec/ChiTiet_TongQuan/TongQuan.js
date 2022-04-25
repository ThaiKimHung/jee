import _ from 'lodash';
import moment from 'moment';
import React, { Component } from 'react';
import {
    FlatList, Image, StyleSheet, Text, ScrollView,
    TouchableOpacity, View, Linking, Platform, BackHandler, Modal, TextInput
} from "react-native";
// import { ScrollView } from 'react-native-gesture-handler';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { CloseCV, DeleteXoaFileDinhKem, getByComponentName_Mobile, getChiTietComment, getCTCongViecCaNhan, InsertComment, UpdateChiTietCongViec, UpdateFileDinhkem } from '../../../apis/JeePlatform/API_JeeWork/apiCongViecCaNhan';
import Utils from '../../../app/Utils';
import { Images } from '../../../images';
import { colors } from '../../../styles';
import { reText, sizes } from '../../../styles/size';
import { Height, nstyles, Width } from '../../../styles/styles';
import { ActionSheetCustom } from '@alessiocancian/react-native-actionsheet'
import ActionSheet from '@alessiocancian/react-native-actionsheet'
import UtilsApp from '../../../app/UtilsApp';
import { nkey } from '../../../app/keys/keyStore';
import ImageCropPicker from 'react-native-image-crop-picker';
import DocumentPicker from 'react-native-document-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { RootLang } from '../../../app/data/locales';
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import HTML from 'react-native-render-html';
import IsLoading from '../../../components/IsLoading';
import Modal_BinhLuan from '../../Social/ModalSocial/Modal_BinhLuan';
import { nGlobalKeys } from '../../../app/keys/globalKey';
import * as Animatable from 'react-native-animatable'
import { Delete_tag, Insert_tag, lite_tag } from '../../../apis/JeePlatform/API_JeeWork/apiTaoCongViec';
import LottieView from 'lottie-react-native';

var RNFS = require('react-native-fs');
const CANCEL_INDEX = 0
const DESTRUCTIVE_INDEX = 4
// const title = RootLang.lang.JeeWork.bancomuonthuchien
// case "deadline": return 4;
// case "urgent": return 7;
// case "important": return 8;
// case "Tags": return 9;
// case "Attachments": return 10;
// case "start_date": return 11;
// case "id_group": return 12;
// case "Attachments_result": return 13;
// case "result": return 14;
// case "assign": return 15;
// case "description": return 16;
// case "title": return 17;
// case "subtasks": return 40;
// case "moved": return 41;
// case "dublicate": return 42;
// case "favorites": return 43;
// case "status": return 44;
// case "new_field": return 1;
// default: return 0;

const ColorTag = [
    { "id": '#848E9E' },
    { "id": 'rgb(29, 126, 236)' },
    { "id": 'rgb(250, 162, 140)' },
    { "id": 'rgb(14, 201, 204)' },
    { "id": 'rgb(11, 165, 11)' },
    { "id": 'rgb(123, 58, 245)' },
    { "id": 'rgb(238, 177, 8)' },
    { "id": 'rgb(236, 100, 27)' },
    { "id": 'rgb(124, 212, 8)' },
    { "id": 'rgb(240, 56, 102)' },
    { "id": 'rgb(255, 0, 0)' },
    { "id": 'rgb(0, 0, 0)' },
    { "id": 'rgb(255, 0, 255)' }
]

class TongQuan extends Component {
    constructor(props) {
        super(props);
        this.nthis = this.props.nthis
        this.refLoading = React.createRef()
        this.item = Utils.ngetParam(this.nthis, "item") // xet hoanthanh
        this.callback = Utils.ngetParam(this.nthis, 'callback', () => { });
        this.index = Utils.ngetParam(this.nthis, 'index')
        this.state = {
            chuyendoi: false,
            ChiTietCongViec: {},
            id_row: this.props.nthis.id_row, //ID quan trọng
            ListStatus: [],
            Status: '',
            dataLoad: false,
            refreshing: false,
            listPiority: [
                { row: 0, name: RootLang.lang.JeeWork.khongcodouutien, color: "grey" },
                { row: 1, name: RootLang.lang.JeeWork.douutienkhancap, color: "#DA3849" },
                { row: 2, name: RootLang.lang.JeeWork.douutiencao, color: '#F2C132' },
                { row: 3, name: RootLang.lang.JeeWork.douutienbinhthuong, color: '#6E47C9' },
                { row: 4, name: RootLang.lang.JeeWork.douutienthap, color: '#6F777F' },

            ],
            console: {},
            piority: {},
            nvDuAn: [],
            nvDuAnTheoDoi: [],
            images: [],
            Attachments: [],
            Attachments_Result: [],
            file: [],
            video: [],
            DateDeadline: '',
            DateStart: '',
            description: '',
            result: '',
            showDateStart: false,
            showDateDeadline: false,
            // isLoading: false,
            option:
                [
                    RootLang.lang.JeeWork.huy,
                    RootLang.lang.JeeWork.taifilexuong,
                    RootLang.lang.JeeWork.xoafiledinhkem
                ],
            filePicked: false,
            imagePicked: false,
            videoPicked: false,
            idtopic: '',
            isOpenModal: false,
            dataTagProJect: [],
            colorCerrent: { "id": 'rgb(255, 0, 0)' },
            Tags: undefined,
            id_project_team: '',
            TitleTag: '',
            Estimate: 0,
            isOpenInputTime: false
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
        this.backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            this.backAction
        );
    }

    backAction = () => {
        let statusGolbal = Utils.getGlobal(nGlobalKeys.saveStatusCV, undefined)
        let tagscv = Utils.getGlobal(nGlobalKeys.tagsCV, undefined)
        let prioritizeID = Utils.getGlobal(nGlobalKeys.prioritizeID, undefined)
        let deadlineCV = Utils.getGlobal(nGlobalKeys.deadlineCV, undefined)
        this.callback(0, this.index, statusGolbal, tagscv, '', prioritizeID, deadlineCV)
        Utils.goback(this.nthis)
        return true;
    };


    _GetCTCongViec = async (type = 0) => {
        var { id_row, listPiority } = this.state
        const res = await getCTCongViecCaNhan(id_row)
        if (res.status == 1) {
            this.setState({
                ChiTietCongViec: res.data,
                Attachments: res.data.Attachments,
                Attachments_Result: res.data.Attachments_Result,
                result: res.data.result,
                nvDuAn: res.data.Users,
                nvDuAnTheoDoi: res.data.Followers,
                description: res.data.description,
                DateDeadline: res.data.deadline,
                DateStart: res.data.start_date,
                Status: await this.getStatus(res.data.status, res.data.DataStatus),
                listStatus: res.data.status,
                id_project_team: res.data.id_project_team,
                ListStatus: res.data.DataStatus,
                Tags: res.data.Tags,
                piority: await listPiority.filter(val => val.row == res.data.clickup_prioritize)[0],
                Estimate: res.data.estimates
            })
            if (type == 1 && !this.props.WorkChild) {
                Utils.setGlobal(nGlobalKeys.tagsCV, res.data.Tags)
                Utils.setGlobal(nGlobalKeys.prioritizeID, res.data.clickup_prioritize)
                Utils.setGlobal(nGlobalKeys.deadlineCV, res.data.deadline)
            }
            this.getTagProject(res.data.id_project_team, type)
        }
        else {
            this.setState({ refreshing: false, Tags: [] })
            UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, res.error ? res.error.message : RootLang.lang.JeeWork.laydulieuthatbai, 2)
        }
        return true
    }

    getTagProject = async (id) => {
        let res = await lite_tag(id)
        if (res.status == 1) {
            this.setState({ dataTagProJect: res.data })
        }
    }

    getIdTopicJW = async () => {
        let res = await getByComponentName_Mobile(this.state.id_row)
        // Utils.nlog("res", res)
        if (res.status == 1) {
            this.setState({ idtopic: res.data.id })
        }
        else {
            this.setState({ idtopic: '' })
        }
    }

    getStatus = async (status, listStatus) => {
        return listStatus.find(sta => {

            return sta.id_row === status
        })
    }



    ViewItemStatus = (item) => {
        return (
            <View key={item.id_row.toString()} style={{ flexDirection: "row", alignSelf: "center" }}>
                <Text style={{
                    textAlign: "center", fontSize: sizes.sText16,
                    alignSelf: "center",
                    color: item.color,
                    fontWeight: this.state.Status.id_row == item.id_row ? "bold" : 'normal'
                }}>{item.statusname ? item.statusname : ""}</Text>
            </View>
        )
    }


    ViewItemlagPiority = (item) => {
        return (
            <View key={item.row.toString()} style={{ flexDirection: "row", alignSelf: "center" }}>
                <View style={{ paddingHorizontal: 10 }}>
                    <Image source={item.row == 0 ? Images.JeeCloseModal : Images.ImageJee.icCoKhongUuTien} resizeMode={"contain"} style={{ tintColor: item.color, width: 20, height: 20 }} />
                </View>
                <Text style={{
                    textAlign: "center", fontSize: sizes.sText16,
                    alignSelf: "center",
                    color: this.state.piority.row == item.row ? colors.colorTabActive : 'black',
                    fontWeight: this.state.piority.row == item.row ? "bold" : 'normal'
                }}>{item.name ? item.name : ""}</Text>
            </View>
        )
    }

    _Status = () => {
        Utils.goscreen(this.nthis, 'Modal_ComponentSelectCom', { callback: this._callbackStatus, item: this.state.Status, AllThaoTac: this.state.ListStatus, ViewItem: this.ViewItemStatus })
    }
    _callbackStatus = (Status) => {
        const { ChiTietCongViec } = this.state
        if (!this.props.WorkChild) {
            Utils.setGlobal(nGlobalKeys.saveStatusCV, Status) // Lưu lại status mỗi lần thay đổi
        }
        try {
            this.setState({ Status }
                , () => {
                    this._updateChiTietCongViec(
                        {
                            id_row: ChiTietCongViec.id_row,
                            key: "status",
                            value: Status.id_row,
                            values: []
                        }
                    )
                }
            );
        } catch (error) {
        }
    }

    _FlagPiority = () => {
        Utils.goscreen(this.nthis, 'Modal_ComponentSelectCom', { callback: this._callbackFlagPiority, item: this.state.piority, AllThaoTac: this.state.listPiority, ViewItem: this.ViewItemlagPiority })
    }

    _callbackFlagPiority = (piority) => {
        const { ChiTietCongViec } = this.state
        try {
            this.setState({ piority }
                , () => {
                    this._updateChiTietCongViec(
                        {
                            id_row: ChiTietCongViec.id_row,
                            key: "clickup_prioritize",
                            value: piority.row,
                            values: []
                        }
                    )
                }
            )
        } catch (error) {

        }
    }

    _ThemNhanVien = (loai) => {
        const { nvDuAn, id_project_team } = this.state
        Utils.goscreen(this.nthis, 'sc_ChonNhanVienDuAn', { callback: this._callBackNhanVien, idDuAn: id_project_team, onlyOne: true, nvCoSan: nvDuAn, loai: loai, hideCheckBoxOnly: true })
    }

    _ThemNhanVienTheoDoi = (loai) => {
        const { nvDuAnTheoDoi, id_project_team } = this.state
        Utils.goscreen(this.nthis, 'sc_ChonNhanVienDuAn', { callback: this._callBackNhanVienTheoDoi, idDuAn: id_project_team, onlyOne: true, nvCoSan: nvDuAnTheoDoi, loai: loai })
    }

    _callBackNhanVien = (nvDuAn) => {
        const { ChiTietCongViec } = this.state
        try {
            this.setState({ nvDuAn }
                , () => {
                    this._updateChiTietCongViec(
                        {
                            id_row: ChiTietCongViec.id_row,
                            key: "assign",
                            value: nvDuAn.id_nv,
                            values: []
                        }
                    )
                }
            );
        } catch (error) {

        }
    }

    _callBackNhanVienTheoDoi = (nvDuAnTheoDoi) => {
        const { ChiTietCongViec } = this.state
        try {
            this.setState({ nvDuAnTheoDoi }
                , () => {
                    this._updateChiTietCongViec(
                        {
                            id_row: ChiTietCongViec.id_row,
                            key: "follower",
                            value: nvDuAnTheoDoi.id_nv,
                            values: []
                        }
                    )
                }
            );
        } catch (error) {
        }
    }

    ConfirmStartDate = (date) => {
        const { ChiTietCongViec } = this.state
        var DateTime = ''
        if (moment(ChiTietCongViec.start_date, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DDTHH:mm:ss.sssZ') == date || ChiTietCongViec.start_date == '') {
            DateTime = moment(date, 'YYYY-MM-DDTHH:mm:ss.sssZ').add(-7, 'hours').format("YYYY-MM-DD HH:mm:ss")
        }
        else {
            DateTime = moment(date).add(-7, 'hours').format("YYYY-MM-DD HH:mm:ss")
        }
        this.setState({ DateStart: DateTime }, () => {
            this.hideStartDate();
            this._updateChiTietCongViec(
                {
                    id_row: ChiTietCongViec.id_row,
                    key: "start_date",
                    value: this.state.DateStart,
                    values: []
                }
            )
        })

    };

    hideStartDate = () => {
        this.setState({ showDateStart: false })
    };

    ConfirmDeadlineDate = (date) => {
        const { ChiTietCongViec } = this.state
        var DateTime = ''
        if (moment(ChiTietCongViec.deadline, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DDTHH:mm:ss.sssZ') == date || ChiTietCongViec.deadline == '') {
            DateTime = moment(date, 'YYYY-MM-DDTHH:mm:ss.sssZ').add(-7, 'hours').format("YYYY-MM-DD HH:mm:ss")
        }
        else {
            DateTime = moment(date).add(-7, 'hours').format("YYYY-MM-DD HH:mm:ss")
        }
        this.setState({ DateDeadline: DateTime }, () => {
            this.hideDeadlineDate();
            this._updateChiTietCongViec(
                {
                    id_row: ChiTietCongViec.id_row,
                    key: "deadline",
                    value: this.state.DateDeadline,
                    values: []
                }
            )
        })
    };

    hideDeadlineDate = () => {
        this.setState({ showDateDeadline: false })
    };

    _renderItem = ({ item, index }) => {
        return (
            <View key={index} style={{ justifyContent: 'space-between', height: Height(5), flexDirection: 'row', paddingHorizontal: 10 }}>
                <View style={{ flexDirection: "row", flex: 1 }}>
                    <Image style={{ width: 15, height: 15, }} source={UtilsApp._returnImageFile(item.filename)} />
                    <Text numberOfLines={1} style={{ marginLeft: 10, maxWidth: Width(70), fontSize: sizes.sText15, color: '#65676B' }}>{item.filename}</Text>
                </View>
                <TouchableOpacity style={{ marginTop: 5 }}
                    onPress={() => {
                        var duoiFile = String(item.filename).split('.').slice(-1).toString()
                        if (duoiFile == 'jpg' || duoiFile == 'png' || duoiFile == 'PNG' || duoiFile == 'JPG' || duoiFile == 'HEIC' || duoiFile == 'heic') {

                            this.setState({
                                option: [
                                    RootLang.lang.JeeWork.huy,
                                    RootLang.lang.JeeWork.xem,
                                    RootLang.lang.JeeWork.taifilexuong,
                                    RootLang.lang.JeeWork.xoafiledinhkem
                                ],
                                numIndex: 3
                            }, () => {
                                this.ActionSheet.setState({ item: item, rowID: item.id_row, index: index, path: item.path, haveImageVideo: true }, () => {
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
                                numIndex: 3
                            }, () => {
                                this.ActionSheet.setState({ item: item, rowID: item.id_row, index: index, path: item.path, haveMusic: true, isVideo: false }, () => {
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
                                numIndex: 3
                            }, () => {
                                this.ActionSheet.setState({ item: item, rowID: item.id_row, index: index, path: item.path, isVideo: true, haveMusic: false }, () => {
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
                                numIndex: 2
                            }, () => {
                                this.ActionSheet.setState({ rowID: item.id_row, index: index, path: item.path, haveImageVideo: false }, () => {
                                    this.ActionSheet.show()
                                })
                            })
                        }
                    }}>
                    <Image source={Images.ImageJee.icBaCham} resizeMode='cover' style={[{}]} />
                </TouchableOpacity>
            </View >
        );
    };

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

    _XoaFileDinhkem = async (id, index) => {
        this.refLoading.current.show()
        const res = await DeleteXoaFileDinhKem(id)
        if (res.status == 1) {
            this.refLoading.current.hide()
            // await this.setState({ Attachments: Attachments.slice(0, index).concat(Attachments.slice(index + 1, Attachments.length)) }, () => {
            // }, () => {
            UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, RootLang.lang.JeeWork.xoafiledinhkemthanhcong, 1)
            this._GetCTCongViec()
            // })
        }
        else {
            this.refLoading.current.hide()
            UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, res.error ? res.error.message : RootLang.lang.JeeWork.xoathatbaivuilong, 2)
        }

    }

    handlePress = (indexAt) => {
        var rowID = this.ActionSheet.state.rowID
        var item = this.ActionSheet.state.item
        var index = this.ActionSheet.state.index
        var path = this.ActionSheet.state.path
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
                // Utils.goscreen(this.nthis, 'Modal_MusicPlayer', {
                //     url: String(path).replace(/ /g, "%20"),
                //     name: item.filename,
                //     isVideo: isVideo
                // });
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
                    strBase64: strBase64
                })
                this.setState({ video: videocus }, () => { this.setState({ videoPicked: true }) })
            }).catch((e) => this.setState({ videoPicked: false }));

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

    _uploadFile = (indexAt, type) => {
        // Utils.nlog("indexAt:", indexAt, type)
        if (indexAt == 1) {
            setTimeout(() => {
                this._open_ImageGallery().then(res => {
                    if (this.state.imagePicked) {
                        this._updateFileDinhKem(this.state.images, type)
                    }
                    else null
                })
            }, 500);

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
                        this._updateFileDinhKem(this.state.file, type)
                    }
                })
            }, 500);

        }
    }


    _updateChiTietCongViec = async (data) => {
        this.refLoading.current.show()
        var body = JSON.stringify(data)
        const res = await UpdateChiTietCongViec(body)
        if (res.status == 1) {
            this.refLoading.current.hide()
            this.setState({ filePicked: false }, () => {
                this._GetCTCongViec(1)
            })
        }
        else {
            this.refLoading.current.hide()
            this._GetCTCongViec(1)
            UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, res.error ? res.error.message : RootLang.lang.JeeWork.capnhatthatbaivuilong, 2)
        }
        return true

    }


    _updateFileDinhKem = async (data, type) => {
        var { ChiTietCongViec } = this.state
        this.refLoading.current.show()
        var body = {
            item: data,
            object_type: type,
            // 1: work,2: topic, 3:comment, 11: kết quả công việc, 4: dự án
            object_id: ChiTietCongViec.id_row,
            id_user: await Utils.ngetStorage(nkey.UserId, ''),
        }
        body = JSON.stringify(body)
        const res = await UpdateFileDinhkem(body)
        if (res.status == 1) {
            this.refLoading.current.hide()
            UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, RootLang.lang.JeeWork.uploadfilethanhcong, 1)
            this._GetCTCongViec()
        }
        else {
            this.refLoading.current.hide()
            UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, res.error ? res.error.message : RootLang.lang.JeeWork.uploadfilethatbaivuilong, 2)

        }
        return true

    }

    _closedWork = async (id) => {
        Utils.showMsgBoxYesNo(this.nthis, RootLang.lang.JeeWork.thongbao, 'Bạn đã xem xét và muốn đóng công việc này?', 'Chấp nhận', 'Trở lại', async () => {
            this.refLoading.current.show()
            let res = await CloseCV(id)
            if (res.status == 1) {
                this.refLoading.current.hide()
                UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, RootLang.lang.JeeWork.dongcongviecthanhcong, 1)
                // ROOTGlobal.GetDSCongViecDaGiao.GetDSCVDG()
                this.callback(2, this.index)
                Utils.goback(this.nthis)
            }
            else {
                this.refLoading.current.hide()
                UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, RootLang.lang.JeeWork.dongcongviecthatbaivuilong, 2)
                Utils.goback(this.nthis)
            }
        })
    }

    _renderTagProJect = ({ item, index }) => {
        return (
            <TouchableOpacity key={index} onPress={() => this.ClickTag(item)} key={index} style={{ marginTop: 10, flexDirection: 'row', }}>
                <View style={{ backgroundColor: item.color, width: Width(7), height: Width(7), marginRight: 5 }} />
                <Text style={{ fontSize: reText(16), color: item.color, marginRight: 10, width: Width(65), alignSelf: 'center' }}>{item.title}</Text>
                <TouchableOpacity onPress={() => this.Deletetags(item)} style={{ width: Width(10), height: Width(5), justifyContent: 'center' }}>
                    <Image source={Images.ImageJee.icDelete} style={{ width: 15, height: 15 }} />
                </TouchableOpacity>
            </TouchableOpacity>
        )

    }

    ClickTag = (item) => {
        this._updateChiTietCongViec({
            id_row: this.state.ChiTietCongViec.id_row,
            key: "Tags",
            value: item.id_row,
            values: []
        })
        this.setState({ isOpenModal: false })
    }

    Deletetags = async (item) => {
        let res = await Delete_tag(item.id_row)
        if (res.status == 1) {
            UtilsApp.MessageShow('Thông báo', 'Xoá nhãn thành công', 1)
            this._GetCTCongViec(1)
        }
        else {
            UtilsApp.MessageShow('Thông báo', 'Lỗi xoá nhãn', 2)
            this._GetCTCongViec(1)
        }
    }

    SaveTags = async () => {
        let strBody = JSON.stringify({
            color: this.state.colorCerrent.id,
            id_project_team: this.state.id_project_team,
            id_row: 0,
            project_team: "",
            title: this.state.TitleTag,
            _isEditMode: false,
            _userId: 0,
        })

        let res = await Insert_tag(strBody)
        if (res.status == 1) {
            this._GetCTCongViec(1)
            this.ClickTag(res.data)
            this.setState({ TitleTag: '', colorCerrent: { "id": 'rgb(255, 0, 0)' } })
        }
        else {
            UtilsApp.MessageShow('Thông báo', res.error.message ? res.error.message : 'Lỗi hệ thống', 2)
        }

    }

    _renderColorTag = ({ item, index }) => {
        return (
            <TouchableOpacity key={index} onPress={() => { this.setState({ colorCerrent: item }) }} style={{ width: Width(10), height: Width(10), borderRadius: Width(10), backgroundColor: item.id, marginLeft: Width(1.7), marginBottom: Width(2), justifyContent: 'center', alignItems: 'center' }}>
                {item.id == this.state.colorCerrent.id ?
                    <LottieView style={{ height: Width(7) }} source={require('../../../images/lottieJee/check.json')} autoPlay loop={false} /> : null}
            </TouchableOpacity>
        )

    }

    Opaciti_color = (color) => {
        if (!color) {
            color = 'rgb(0,0,0)';
        }
        var result = color.replace(')', ', 0.2)').replace('rgb', 'rgba');
        return result;
    }

    scrollToBot = () => {
        setTimeout(() => { this.scroll?.props?.scrollToEnd(true) }, Platform.OS == 'ios' ? 1200 : 2200)
    }


    OpenModalInput = () => {
        this.setState({ isOpenInputTime: true })
    }

    SaveTime = () => {
        // alert(1)
        if (this.state.Estimate) {
            this._updateChiTietCongViec({
                id_row: this.state.ChiTietCongViec.id_row,
                IsStaff: true,
                key: "estimates",
                value: this.state.Estimate,
                values: []
            })
        }
        this.setState({ isOpenInputTime: false })
    }

    render() {
        let { piority, nvDuAn, showDateStart, description, showDateDeadline, Attachments, Status,
            ChiTietCongViec, nvDuAnTheoDoi, result, Attachments_Result, idtopic, isOpenModal, dataTagProJect, colorCerrent, Tags, numIndex, Estimate, isOpenInputTime } = this.state
        const { onScrollTongQuan } = this.props
        let ngaybatdau = Utils.formatTimeAgo(moment(ChiTietCongViec.start_date).add(+7, 'hours'), 1, true)
        let ngaybatdau7 = moment(ChiTietCongViec.start_date).add(+7, 'hours').format('YYYY-MM-DDTHH:mm:ss')
        let ngaydeadline = ChiTietCongViec.deadline && ChiTietCongViec?.end_date ? Utils.formatTimeAgo(moment(ChiTietCongViec.deadline).add(+7, 'hours'), 1, true) : Utils.formatTimeAgo(moment(ChiTietCongViec.deadline).add(+7, 'hours'), 3, true)
        let ngaydeadline7 = moment(ChiTietCongViec.deadline).add(+7, 'hours').format('YYYY-MM-DDTHH:mm:ss')
        return (

            <View style={{ flex: 1 }}>
                {/* <ScrollView> */}
                <KeyboardAwareScrollView
                    innerRef={ref => {
                        this.scroll = ref
                    }}
                    enableAutomaticScroll={true}
                    // contentContainerStyle={{ flex: 1 }}
                    extraScrollHeight={Platform.OS == 'ios' ? Height(12) : Height(30)}
                    onScrollEndDrag={() => { this._GetCTCongViec() }}
                    enableOnAndroid={true}
                    nestedScrollEnabled={true}
                    keyboardShouldPersistTaps={"handled"}
                    onScroll={onScrollTongQuan}
                    style={{ backgroundColor: '#E4E6EB', flex: 1 }}>
                    {this.nthis.isGiaoViec == 1 && this.state.ChiTietCongViec?.end_date ?
                        <View style={{ backgroundColor: colors.white, marginTop: 3 }}>
                            <TouchableOpacity onPress={() => this._closedWork(this.state.id_row)} style={{ backgroundColor: colors.greenishTeal, width: Width(100), paddingVertical: 12, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderRadius: 5 }}>
                                <Text style={{ color: colors.white, fontSize: reText(15), fontWeight: 'bold' }}>{RootLang.lang.JeeWork.dongcongviec}</Text>
                            </TouchableOpacity>
                        </View> : null}
                    <View style={{ backgroundColor: colors.white }} horizontal={true}>
                        {Tags && Tags.length == 0 ?
                            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5 }}>
                                {/* <View style={{ backgroundColor: '#FA9BA3', paddingLeft: 5, paddingRight: 15, paddingVertical: 5, borderTopRightRadius: 10, borderBottomRightRadius: 10 }}>
                                    <Text style={{ fontSize: reText(13), color: '#E30719' }}>Thiếu thông tin</Text>
                                </View> */}
                                <TouchableOpacity onPress={() => this.setState({ isOpenModal: true })} style={{ borderWidth: 0.5, borderColor: colors.black_50, padding: 5, borderRadius: 100, borderStyle: 'dashed' }}>
                                    <Image source={Images.ImageJee.tagcv} style={{ width: Width(5), height: Width(5), tintColor: colors.black_50 }} />
                                </TouchableOpacity>
                            </View> :
                            <View style={{ flexDirection: 'row', paddingVertical: 5, alignItems: 'center', paddingHorizontal: 10 }}>
                                <TouchableOpacity onPress={() => this.setState({ isOpenModal: true })} style={{ borderWidth: 0.5, borderColor: colors.black_50, padding: 5, borderRadius: 100, borderStyle: 'dashed', marginRight: 10 }}>
                                    <Image source={Images.ImageJee.tagcv} style={{ width: Width(5), height: Width(5), tintColor: colors.black_50 }} />
                                </TouchableOpacity>
                                <ScrollView
                                    horizontal={true}
                                    ref={ref => this.Tags = ref}
                                    onContentSizeChange={() => this.Tags.scrollToEnd({ animated: true })}
                                >
                                    {Tags && Tags.map(item => {
                                        return (
                                            <TouchableOpacity onLongPress={() => Utils.showMsgBoxYesNo(this.nthis, "Thông báo", "Bạn có muốn xoá nhãn?", "Có", "Không", () => {
                                                this.ClickTag(item)
                                            })} style={{ backgroundColor: this.Opaciti_color(item.color), height: Width(7), paddingLeft: 5, paddingRight: 20, borderBottomRightRadius: 20, borderTopRightRadius: 20, justifyContent: 'center', marginRight: 5, borderTopLeftRadius: 3, borderBottomLeftRadius: 3 }}>
                                                <Text style={{ fontSize: reText(14), color: item.color == '#848E9E' ? colors.white : item.color }}>{item.title}</Text>
                                            </TouchableOpacity>
                                        )
                                    })}
                                </ScrollView>
                            </View>
                        }
                    </View>
                    <Modal
                        animationType='fade'
                        visible={isOpenModal}
                        transparent={true}>
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.black_20_2 }}>
                            <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, right: 0, elevation: 1 }} onTouchEnd={() => this.setState({ isOpenModal: false })}></View>
                            <Animatable.View
                                style={{ width: Width(90), backgroundColor: 'white', borderRadius: 5, padding: 15, elevation: 3, shadowRadius: 3 }}
                                animation={'zoomIn'}
                                duration={500}
                                useNativeDriver={true}>
                                <Text style={{ fontSize: reText(16), fontWeight: 'bold', color: '#206EC0' }}>Chọn nhãn</Text>
                                <FlatList
                                    style={{ maxHeight: Height(30) }}
                                    data={dataTagProJect}
                                    renderItem={this._renderTagProJect}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                                <View style={{ flexDirection: 'row', marginTop: 15, borderWidth: 0.5, borderStyle: 'dashed', padding: 7 }}>
                                    <View style={{ width: Width(7), height: Width(7), backgroundColor: colorCerrent.id, alignSelf: 'center' }} />


                                    <View style={{ justifyContent: 'center', width: Width(62), paddingHorizontal: 5 }}>
                                        <TextInput placeholder={'Nhập tên nhãn'} style={{ fontSize: reText(16), paddingVertical: Platform.OS == 'ios' ? 10 : 5 }} value={this.state.TitleTag} onChangeText={text => this.setState({ TitleTag: text })} />
                                    </View>
                                    <TouchableOpacity onPress={() => this.SaveTags()} style={{ width: Width(10), height: Width(7), backgroundColor: '#206EC0', justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                                        <Text style={{ fontSize: reText(14), color: colors.white }}>{RootLang.lang.thongbaochung.tao}</Text>
                                    </TouchableOpacity>
                                </View>
                                <Text style={{ fontSize: reText(14), color: '#040404', marginTop: 10, marginBottom: 5 }}>Chọn màu</Text>
                                <FlatList
                                    // horizontal={true}
                                    numColumns={7}
                                    data={ColorTag}
                                    renderItem={this._renderColorTag}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                            </Animatable.View>
                        </View>
                    </Modal>
                    <Modal
                        animationType='fade'
                        visible={isOpenInputTime}
                        transparent={true}>
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.black_20_2 }}>
                            <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, right: 0, elevation: 1 }} onTouchEnd={() => {
                                this._GetCTCongViec(1)
                                this.setState({ isOpenInputTime: false })
                            }
                            }></View>
                            <Animatable.View
                                style={{ width: Width(90), backgroundColor: 'white', borderRadius: 5, padding: 15, elevation: 3, shadowRadius: 3 }}
                                animation={'zoomIn'}
                                duration={500}
                                useNativeDriver={true}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{ fontSize: reText(18), fontWeight: 'bold' }}>Nhập thời gian làm</Text>
                                    <TouchableOpacity onPress={() => this.SaveTime()} style={{ backgroundColor: colors.greenButton, paddingHorizontal: 17, paddingVertical: 10, borderRadius: 25 }}>
                                        <Image source={Images.ImageJee.CheckSort} style={{ width: Width(4), height: Width(4), tintColor: colors.white }} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ width: '100%', height: 0.5, marginVertical: 5, backgroundColor: colors.black_20 }} />
                                <View style={{ marginTop: 5, borderWidth: 0.5, padding: 5, borderColor: colors.black_50, borderRadius: 10 }}>
                                    <View style={{ justifyContent: 'center', paddingHorizontal: 5, flexDirection: 'row', alignItems: 'center' }}>
                                        <TextInput autoFocus={true} keyboardType={'numeric'} placeholder={RootLang.lang.thongbaochung.nhapsogio} style={{ fontSize: reText(16), paddingVertical: Platform.OS == 'ios' ? 10 : 5, flex: 1 }} value={Estimate} onChangeText={text => this.setState({ Estimate: text })} />
                                        <TouchableOpacity onPress={() => { this.setState({ Estimate: 0 }) }} style={{ width: Width(5), height: Width(5), borderRadius: Width(5), marginLeft: 10, backgroundColor: colors.redStar, justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ color: colors.white }}>X</Text>
                                        </TouchableOpacity>
                                    </View>

                                </View>
                            </Animatable.View>
                        </View>
                    </Modal>
                    <View style={{ backgroundColor: colors.white, borderRadius: 10, marginTop: 7, marginHorizontal: 10 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: Height(6), borderBottomWidth: 0.3, alignItems: 'center', paddingHorizontal: 10, borderColor: '#E4E6EB' }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <Image source={Images.ImageJee.icAccepter} style={[nstyles.nIcon24, { marginRight: 5 }]} />
                                <Text style={{ fontSize: sizes.sText16, color: colors.grey, textAlign: 'center', }}>{RootLang.lang.JeeWork.nguoithamgia}</Text>
                            </View>
                            <TouchableOpacity onPress={() => { this._ThemNhanVien(1) }} style={{ flexDirection: 'row' }}>
                                {
                                    nvDuAn.length > 0 ?
                                        <View style={{ width: Width(8), flexDirection: "row", alignItems: "center", }}>
                                            {nvDuAn.map((item, index) => {
                                                return (
                                                    item.image ? <Image source={{ uri: item.image }} resizeMode='cover' style={{ width: Width(8), height: Width(8), borderRadius: Width(8) }} /> :
                                                        <View style={{
                                                            width: Width(8), height: Width(8), borderRadius: Width(8), backgroundColor: this.intToRGB(this.hashCode(item.hoten ? item.hoten : '')), justifyContent: 'center', alignItems: 'center'
                                                        }} key={index}>
                                                            <Text style={{ alignSelf: "center", fontWeight: "bold", fontSize: reText(12), color: colors.white }}>{index > 4 ? "+" + `${nvDuAn.length - 5}` : String(item.hoten ? item.hoten : '').split(" ").slice(-1).toString().slice(0, 2).toString()}</Text>
                                                        </View>
                                                )
                                            })}
                                        </View>
                                        : <>
                                            <Image source={Images.ImageJee.icChonNguoiThamGia} style={{ tintColor: colors.black_50 }} />
                                        </>
                                }
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: Height(6), borderBottomWidth: 0.3, alignItems: 'center', paddingHorizontal: 10, borderColor: '#E4E6EB' }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <Image source={Images.ImageJee.icManyPeople} style={[nstyles.nIcon22, { marginRight: 6 }]} />
                                <Text style={{ fontSize: sizes.sText16, color: colors.grey, textAlign: 'center', }}>{RootLang.lang.JeeWork.nguoitheodoi}</Text>
                            </View>

                            {nvDuAnTheoDoi.length > 0 ?
                                <View style={{ width: Width(45), alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                                    <ScrollView horizontal={true} tyle={{}}>
                                        {nvDuAnTheoDoi.map((item, index) => {
                                            return (
                                                <TouchableOpacity onPress={() => { this._ThemNhanVienTheoDoi(2) }} style={{ justifyContent: 'center', alignItems: 'center' }} >
                                                    {item.image ?
                                                        <Image source={{ uri: item.image }} resizeMode='cover' style={{ width: Width(8), height: Width(8), borderRadius: Width(8) }} /> :
                                                        <View style={{
                                                            width: Width(8), height: Width(8), borderRadius: Width(8), backgroundColor: this.intToRGB(this.hashCode(item.hoten ? item.hoten : '')), alignSelf: 'center', justifyContent: 'center', alignItems: 'center'
                                                        }} key={index}>
                                                            <Text style={{ alignSelf: "center", fontWeight: "bold", fontSize: reText(12), color: colors.white }}> {String(item.hoten ? item.hoten : '').split(" ").slice(-1).toString().slice(0, 2).toString()}</Text>
                                                        </View>}
                                                </TouchableOpacity>
                                            )
                                        })}

                                    </ScrollView>
                                </View>
                                :
                                <TouchableOpacity onPress={() => { this._ThemNhanVienTheoDoi(2) }} >
                                    <Image source={Images.ImageJee.icChonNguoiThamGia} style={{ tintColor: colors.black_50 }} />
                                </TouchableOpacity>

                            }

                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: Height(6), borderBottomWidth: 0.3, alignItems: 'center', paddingHorizontal: 10, borderColor: '#E4E6EB' }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <Image source={Images.ImageJee.jwTinhTrang} style={[nstyles.nIcon22, { marginRight: 6 }]} />
                                <Text style={{ fontSize: sizes.sText16, color: colors.grey, textAlign: 'center', }}>{RootLang.lang.JeeWork.tinhtrang}</Text>
                            </View>
                            <TouchableOpacity onPress={() => { this._Status() }} style={{ backgroundColor: Status?.color ? Status?.color : colors.white, height: Width(8), paddingHorizontal: 10, justifyContent: 'center', borderRadius: 12 }}>
                                <Text style={{ fontSize: sizes.sText16, color: colors.white, textAlign: 'center' }}>{Status?.statusname ? Status.statusname : ''}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: Height(6), borderBottomWidth: 0.3, alignItems: 'center', paddingHorizontal: 10, borderColor: '#E4E6EB' }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <Image source={Images.ImageJee.jwMucDo} style={[nstyles.nIcon24, { marginRight: 5 }]} />
                                <Text style={{ fontSize: sizes.sText16, color: colors.grey, textAlign: 'center', }}>{RootLang.lang.JeeWork.mucdouutien}</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => { this._FlagPiority() }}
                                style={{ flexDirection: 'row' }}>
                                <Image source={piority?.row == 0 ? Images.JeeCloseModal : Images.ImageJee.icCoKhongUuTien} style={[{ marginRight: 8, tintColor: piority?.color ? piority?.color : "red" }]} />

                                <Text style={{ fontSize: sizes.sText16, color: piority?.color, textAlign: 'center', alignSelf: "center" }}>{piority?.name}</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: Height(6), borderBottomWidth: 0.3, alignItems: 'center', paddingHorizontal: 10, borderColor: '#E4E6EB' }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <Image source={Images.ImageJee.jwTime} style={[nstyles.nIcon24, { marginRight: 5 }]} />
                                <Text style={{ fontSize: sizes.sText16, color: colors.grey, textAlign: 'center', }}>{RootLang.lang.JeeWork.ngaybatdau}</Text>
                            </View>
                            <View>
                                <TouchableOpacity onPress={() => this.setState({ showDateStart: true })} style={{ justifyContent: 'center', alignItems: 'flex-end', width: Width(45) }}>
                                    {ChiTietCongViec.start_date ?
                                        <Text style={{ fontSize: sizes.sText14, textAlign: 'center', alignSelf: 'flex-end' }}>{ChiTietCongViec.start_date ? ngaybatdau : ""}</Text> :
                                        <>
                                            <Image source={Images.ImageJee.jwAddTime} style={[nstyles.nIcon24, { alignSelf: 'flex-end' }]} />
                                        </>
                                    }
                                    <DateTimePickerModal
                                        // minimumDate={moment(DuAn.start_date, 'DD/MM/YYYY HH:mm').add(1, 'minutes').format('YYYY-MM-DDTHH:mm:ss.sssZ')}
                                        // maximumDate={moment(DuAn.end_date, 'DD/MM/YYYY HH:mm').add(1, 'minutes').format('YYYY-MM-DDTHH:mm:ss.sssZ')}
                                        isVisible={showDateStart}
                                        date={
                                            ChiTietCongViec.start_date ? new Date(moment(ngaybatdau7, 'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DDTHH:mm:ss.sssZ')) : new Date()
                                        }
                                        mode="datetime"
                                        display="default"
                                        timePickerModeAndroid='spinner'
                                        locale='vi'
                                        cancelTextIOS={RootLang.lang.JeeWork.huy}
                                        confirmTextIOS={RootLang.lang.JeeWork.dongy}
                                        headerTextIOS={RootLang.lang.JeeWork.chonngayketthuccongviec}
                                        style={{ alignContent: "center", marginLeft: Width(18), marginTop: 20, marginBottom: 20 }}
                                        onConfirm={this.ConfirmStartDate}
                                        onCancel={this.hideStartDate}
                                    />
                                </TouchableOpacity>

                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: Height(6), borderBottomWidth: 0.3, alignItems: 'center', paddingHorizontal: 10, borderColor: '#E4E6EB' }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <Image source={Images.ImageJee.icOClock} style={[nstyles.nIcon24, { marginRight: 6, marginLeft: 2 }]} />
                                <Text style={{ fontSize: sizes.sText16, color: colors.grey, textAlign: 'center', }}>{RootLang.lang.JeeWork.hanchot}</Text>
                            </View>
                            <View>
                                <TouchableOpacity onPress={() => this.setState({ showDateDeadline: true })} style={{ justifyContent: 'center', alignItems: 'flex-end', width: Width(45) }}>
                                    {ChiTietCongViec.deadline ?
                                        // <Text style={{ fontSize: sizes.sText14, textAlign: 'center', alignSelf: 'flex-end' }}>{ChiTietCongViec.deadline ? moment(ChiTietCongViec.deadline, 'YYYY-MM-DDTHH:mm:ss').format('DD/MM/YYYY HH:mm') : ""}</Text> 
                                        <Text style={{ fontSize: sizes.sText14, textAlign: 'center', alignSelf: 'flex-end', color: ChiTietCongViec.end_date != null ? colors.black : moment(ngaydeadline7, 'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DD HH:mm') < moment().format('YYYY-MM-DD HH:mm') ? colors.redStar : '#4FC62B' }}>
                                            {ngaydeadline}
                                        </Text>
                                        :
                                        <>
                                            <Image source={Images.ImageJee.jwAddTime} style={[nstyles.nIcon24, { alignSelf: 'flex-end' }]} />
                                            {/* <Text style={{ fontSize: sizes.sText15, color: '#B3B3B3', textAlign: 'center' }}>{'Chọn ngày'}</Text> */}
                                        </>
                                    }
                                    <View style={{ position: "absolute", flexDirection: "row", width: 50 }}>
                                        <DateTimePickerModal
                                            isVisible={showDateDeadline}
                                            mode="datetime"
                                            locale='vi'
                                            // minimumDate={moment(DuAn.start_date, 'DD/MM/YYYY HH:mm:ss').add(1, 'minutes').format('YYYY-MM-DDTHH:mm:ss.sssZ')}
                                            // maximumDate={moment(DuAn.end_date, 'DD/MM/YYYY HH:mm:ss').add(1, 'minutes').format('YYYY-MM-DDTHH:mm:ss.sssZ')}
                                            display="default"
                                            date={ChiTietCongViec.deadline ? new Date(moment(ngaydeadline7, 'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DDTHH:mm:ss.sss')) : new Date()}
                                            // date={moment(DuAn.end_date, 'DD/MM/YYYY HH:mm').add(1, 'minutes').format('YYYY-MM-DDTHH:mm:ss.sssZ')}
                                            cancelTextIOS={RootLang.lang.JeeWork.huy}
                                            headerTextIOS={RootLang.lang.JeeWork.chonngayketthuccongviec}
                                            style={{ alignContent: "center", marginLeft: Width(18), marginTop: 20, marginBottom: 20 }}
                                            confirmTextIOS={RootLang.lang.JeeWork.dongy}
                                            onConfirm={this.ConfirmDeadlineDate}
                                            onCancel={this.hideDeadlineDate}
                                        />
                                    </View>
                                </TouchableOpacity>

                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: Height(6), borderBottomWidth: 0.3, alignItems: 'center', paddingHorizontal: 10, borderColor: '#E4E6EB' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image source={Images.ImageJee.icClock} style={{ width: Width(6), height: Width(6), marginRight: 5 }} />
                                <Text style={{ fontSize: reText(15), color: '#65676B', textAlign: 'center', }}>{RootLang.lang.thongbaochung.thoigianlam}</Text>
                            </View>
                            <TouchableOpacity onPress={() => this.OpenModalInput()} style={{ maxWidth: Width(50), height: Width(8), justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row' }}>
                                <View style={{ minWidth: Width(10), maxWidth: Width(50), height: Width(8), borderWidth: 0.5, borderColor: colors.black_50, borderRadius: 5, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 5 }}>
                                    <Text style={{ color: Estimate > 0 && Estimate ? colors.colorTitleNew : colors.black_50, fontSize: reText(16) }}>{Estimate > 0 && Estimate ? Estimate : ''}</Text>
                                </View>
                                <Text numberOfLines={1} style={{ marginLeft: 5, color: "grey", fontSize: sizes.sText14 }}>{RootLang.lang.thongbaochung.gio}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: Height(6), borderBottomWidth: 0.3, alignItems: 'center', paddingHorizontal: 10, borderColor: '#E4E6EB' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image source={Images.ImageJee.icProjectS} style={{ width: Width(6), height: Width(6), marginRight: 5 }} />
                                <Text style={{ fontSize: reText(15), color: '#65676B', textAlign: 'center', }}>{RootLang.lang.thongbaochung.duan}</Text>
                            </View>
                            <Text style={{ fontSize: reText(15), color: colors.black, fontWeight: 'bold' }}>{ChiTietCongViec.project_team ? ChiTietCongViec.project_team : '---'}</Text>
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
                                this._updateChiTietCongViec({
                                    id_row: ChiTietCongViec.id_row,
                                    key: "description",
                                    value: html,
                                    values: []
                                })
                            }
                        })}
                        style={{ marginTop: 10, backgroundColor: colors.white, padding: 10, borderRadius: 10, marginHorizontal: 10 }}>

                        <Text style={{ fontSize: sizes.sText16, color: colors.tabGreen, fontWeight: 'bold', marginLeft: 3 }}>{RootLang.lang.JeeWork.motacongviec}</Text>
                        {description ?
                            <View >
                                <HTML
                                    source={{ html: `<div>${description}</div>` }}
                                    containerStyle={{ paddingHorizontal: 5, paddingVertical: 5 }}
                                    contentWidth={Width(90)}
                                    tagsStyles={{
                                        div: { fontSize: reText(18) },
                                    }}
                                />
                            </View> :
                            <View style={{ height: Height(7), justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ borderWidth: 1, borderColor: colors.textGray, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5, borderStyle: 'dashed' }}>
                                    <Text style={{ fontSize: reText(15), color: colors.textGray }}>{RootLang.lang.JeeWork.chuaconoidungmota}</Text>
                                </View>
                            </View>}
                    </TouchableOpacity>


                    <View style={{ marginTop: 10, backgroundColor: colors.white, paddingHorizontal: 10, borderRadius: 10, marginHorizontal: 10 }}>
                        <View>
                            <View style={{ marginVertical: 10, flexDirection: "row", paddingBottom: 10 }}>
                                <Text style={{ alignSelf: "center", fontSize: sizes.sText16, color: colors.tabGreen, fontWeight: 'bold', flex: 1, marginLeft: 3 }}>{RootLang.lang.JeeWork.tailieudinhkem}</Text>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.ActionSheetDinhKem.show()
                                    }}
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
                                this._updateChiTietCongViec({
                                    id_row: ChiTietCongViec.id_row,
                                    key: "result",
                                    value: html,
                                    values: []
                                })
                            }
                        })}
                        style={{ marginTop: 10, backgroundColor: colors.white, padding: 10, marginHorizontal: 10, borderRadius: 10 }}>
                        <Text style={{ fontSize: sizes.sText16, color: colors.tabGreen, fontWeight: 'bold', marginLeft: 3 }}>{RootLang.lang.JeeWork.capnhatketquacongviec}</Text>
                        {result ?
                            <View >
                                <HTML
                                    contentWidth={Width(90)}
                                    source={{ html: `<div>${result}</div>` }}
                                    containerStyle={{ paddingHorizontal: 5, paddingVertical: 5 }}
                                    tagsStyles={{
                                        div: { fontSize: reText(18) },
                                    }}
                                />
                            </View> :
                            <View style={{ height: Height(7), justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ borderWidth: 1, borderColor: colors.textGray, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5, borderStyle: 'dashed' }}>
                                    <Text style={{ fontSize: reText(15), color: colors.textGray }}>{RootLang.lang.JeeWork.chuaconoidungketqua}</Text>
                                </View>
                            </View>}
                    </TouchableOpacity>

                    <View style={{ marginTop: 10, backgroundColor: colors.white, marginHorizontal: 10, borderRadius: 10, paddingHorizontal: 10 }}>
                        <View>
                            <View style={{ marginVertical: 10, flexDirection: "row", paddingBottom: 10 }}>
                                <Text style={{ alignSelf: "center", fontSize: sizes.sText16, color: colors.tabGreen, fontWeight: 'bold', flex: 1, marginLeft: 3 }}>{RootLang.lang.JeeWork.tailieucapnhatketquacongviec}</Text>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.ActionSheetKetQua.show()
                                    }}
                                    style={{ alignSelf: "center", marginRight: 10 }}>
                                    <Image style={{ width: 20, height: 20 }} source={Images.ImageJee.icThemLuaChon} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ marginTop: 5, flex: 1 }}>
                                <FlatList
                                    data={Attachments_Result}
                                    nestedScrollEnabled={true}
                                    renderItem={this._renderItem}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                            </View>
                        </View>

                    </View>
                    <View style={{ marginHorizontal: 10, borderRadius: 10, backgroundColor: colors.white, marginTop: 10, paddingBottom: 5 }}>
                        <View style={{ backgroundColor: colors.white, paddingBottom: Platform.OS == 'android' ? 150 : 0, borderRadius: 10 }}>
                            <View style={{ backgroundColor: colors.white, paddingHorizontal: 10, paddingTop: 10, borderRadius: 10 }}>
                                <Text style={{ fontSize: sizes.sText16, color: colors.tabGreen, fontWeight: 'bold', flex: 1, marginLeft: 3 }}>{RootLang.lang.JeeWork.binhluan}</Text>
                            </View>
                            {/* 614984455e2313c1d17071e7 */}
                            {idtopic ? <Modal_BinhLuan topicId={idtopic} nthis={this.nthis} request={true} jeeWork={true} onToDo={this.scrollToBot} /> : null}
                            {/* <View style={{ paddingBottom: 150, backgroundColor: colors.white }} /> */}
                        </View>

                    </View>
                    <View style={{ height: Height(5) }} />
                    <ActionSheet
                        ref={o => { this.ActionSheet = o }}
                        title={RootLang.lang.JeeWork.bancomuonthuchien}
                        options={this.state.option}
                        cancelButtonIndex={CANCEL_INDEX}
                        destructiveButtonIndex={numIndex}
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
                        cancelButtonIndex={0}
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
                        onPress={(indexAt) => this._uploadFile(indexAt, 11)}
                    />
                </KeyboardAwareScrollView>
                <IsLoading ref={this.refLoading} />
            </View >

        );
    }
};


const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});

const styles = StyleSheet.create({
});

export default Utils.connectRedux(TongQuan, mapStateToProps, true)


