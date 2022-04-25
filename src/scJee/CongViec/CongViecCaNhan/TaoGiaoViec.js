import _ from 'lodash';
import moment from 'moment';
import React, { Component, createRef } from 'react';
import {
    Animated,
    Image,
    Keyboard,
    LayoutAnimation, PanResponder,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity, View,
    ScrollView, BackHandler, Modal,
} from 'react-native';
import Dash from 'react-native-dash';
import DocumentPicker from 'react-native-document-picker';
import { FlatList } from 'react-native-gesture-handler';
import ImageCropPicker from 'react-native-image-crop-picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Insert_tag, lite_tag, postTaoCongViec, Delete_tag } from '../../../apis/JeePlatform/API_JeeWork/apiTaoCongViec';
import { RootLang } from '../../../app/data/locales';
import Utils from '../../../app/Utils';
import { Images } from '../../../images';
import { colors } from '../../../styles/color';
import { reText, sizes } from '../../../styles/size';
import { Height, nstyles, Width, paddingBotX, nHeight, nheight } from '../../../styles/styles';
import UtilsApp from '../../../app/UtilsApp';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ActionSheetCustom as ActionSheetCus } from '@alessiocancian/react-native-actionsheet'
import IsLoading from '../../../components/IsLoading';
import HTML from 'react-native-render-html'
import ActionSheet from '@alessiocancian/react-native-actionsheet'
import * as Animatable from 'react-native-animatable'
import LottieView from 'lottie-react-native';

var RNFS = require('react-native-fs');
const DEVICE_HEIGHT = Height(100);
const CANCEL_INDEX = 0

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

class TaoGiaoViec extends Component {
    constructor(props) {
        super(props);
        this.refLoading = React.createRef()
        this.state = ({
            animation: "easeInEaseOut",
            opacity: new Animated.Value(0),
            tencongviec: "",
            keyboardStatus: undefined,
            collapsed: true,
            themMoTa: false,
            themDinhKem: false,
            mota: '',
            scrollEnable: false,
            minumun: false,
            listDuAn: [],
            DuAn: {},
            nvDuAn: {},
            nvDuAnTheoDoi: [],
            images: [],
            Attachments: [],
            video: [],
            files: [],
            showDateStart: false,
            showDateDeadline: false,
            Added: false,
            DateStart: '',
            DateDeadline: '',
            _date: '',
            _dateKt: '',
            date: new Date(),
            isOpenModal: false,
            Tags: [],
            dataTagProJect: [],
            colorCerrent: { "id": 'rgb(255, 0, 0)' },
            id_project_team: '',
            TitleTag: '',
            listPiority: [
                { row: 0, name: RootLang.lang.JeeWork.khongcodouutien, color: "#B3B3B3" },
                { row: 1, name: RootLang.lang.JeeWork.douutienkhancap, color: "#DA3849" },
                { row: 2, name: RootLang.lang.JeeWork.douutiencao, color: '#F2C132' },
                { row: 3, name: RootLang.lang.JeeWork.douutienbinhthuong, color: '#6E47C9' },
                { row: 4, name: RootLang.lang.JeeWork.douutienthap, color: '#6F777F' },
            ],
            piority: { row: 0, name: RootLang.lang.JeeWork.khongcodouutien, color: "grey" },
            id_parent: Utils.ngetParam(this, 'id_parent'),
            project: Utils.ngetParam(this, 'project', undefined),
            itemChiTietCongViec: Utils.ngetParam(this, 'itemChiTietCongViec'),
            Child: Utils.ngetParam(this, 'Child', false),
            Estimate: 0, //Thời gian làm
            EstimateTemp: 0,
            isOpenInputTime: false, //Bật tắt modal InputTime
            keyboardHeight: 0,
        })
        this.callback = Utils.ngetParam(this, 'callback');
        this.FromDuAn = Utils.ngetParam(this, 'FromDuAn', false);
        this.disablePressToShow = true;
        this.SWIPE_HEIGHT = Height(33)
        this.keyboardHeight = 0;
        this._panResponder = null;
        this.top = this.SWIPE_HEIGHT;
        this.height = this.SWIPE_HEIGHT;
        this.customStyle = {
            style: {
                bottom: 0,
                top: this.top,
                height: this.height
            }
        };
        this.checkCollapsed = true;
        this.animation = "";
        this.showFull = this.showFull.bind(this);
    }


    componentDidMount() {
        if (this.state.project) {
            this.getTagProject(this.state.project.id_project_team ? this.state.project.id_project_team : 0)
        }
        this._startAnimation(0.8)
        this._backHandler = BackHandler.addEventListener('hardwareBackPress', this._backHandlerButton)
        this.keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            this._keyboardDidShow,
        );
        this.keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            this._keyboardDidHide,
        );
    }
    componentWillUnmount() {
        this._backHandler.remove()
    }
    _backHandlerButton = () => {
        this._goBack()
        return true
    }

    getTagProject = async (id) => {
        let res = await lite_tag(id)
        //console.log("res_lite_tag:", res)
        if (res.status == 1) {
            this.setState({ dataTagProJect: res.data })
        }
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

    _FlagPiority = () => {
        Utils.goscreen(this, 'Modal_ComponentSelectCom', { callback: this._callbackFlagPiority, item: this.state.piority, AllThaoTac: this.state.listPiority, ViewItem: this.ViewItemlagPiority })
    }

    _callbackFlagPiority = (piority) => {
        try {
            this.setState({ piority });
        } catch (error) {

        }
    }

    _PickDuAn = () => {

        Utils.goscreen(this, 'sc_ChonDuAnTaoCongViec', { callback: this._callbackDuAn })
    }
    _callbackDuAn = (DuAn) => {
        this.setState({ dataTagProJect: [], Tags: [] })
        this.getTagProject(DuAn.id_row)
        this.setState({ id_project_team: DuAn.id_row })
        try {
            this.setState({
                DuAn, nvDuAn: [],
                nvDuAnTheoDoi: [],
            });
        } catch (error) {

        }
    }


    _ThemNhanVien = (loai) => {
        const { DuAn, Child, project } = this.state
        if (_.size(DuAn) > 0 && !Child) {
            Utils.goscreen(this, 'sc_ChonNhanVienDuAn', { callback: this._callBackNhanVien, idDuAn: DuAn.id_row, loai: loai, onlyOne: true, hideCheckBoxOnly: true, selectedUser: this.state.nvDuAn.id_nv ? Array(this.state.nvDuAn) : [], create: true })
        }
        if (Child) {
            Utils.goscreen(this, 'sc_ChonNhanVienDuAn', { callback: this._callBackNhanVien, idDuAn: project.id_project_team, loai: loai, onlyOne: true, hideCheckBoxOnly: true, selectedUser: this.state.nvDuAn.id_nv ? Array(this.state.nvDuAn) : [], create: true })
        }
        if (_.size(DuAn) <= 0 && !Child) {
            UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, RootLang.lang.JeeWork.vuilongchonduan, 3)
            this._PickDuAn()
        }
    }

    _ThemNhanVienTheoDoi = (loai) => {
        const { DuAn, Child, project } = this.state
        if (_.size(DuAn) > 0 && !Child) {
            Utils.goscreen(this, 'sc_ChonNhanVienDuAn', { callback: this._callBackNhanVienTheoDoi, idDuAn: DuAn.id_row, loai: loai, selectedUser: this.state.nvDuAnTheoDoi })
        }
        if (Child) {
            Utils.goscreen(this, 'sc_ChonNhanVienDuAn', { callback: this._callBackNhanVienTheoDoi, idDuAn: project.id_project_team, loai: loai, selectedUser: this.state.nvDuAnTheoDoi })
        }
        if (_.size(DuAn) <= 0 && !Child) {
            UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, RootLang.lang.JeeWork.vuilongchonduan, 3)
            this._PickDuAn()
        }
    }

    _callBackNhanVien = (nvDuAn) => {
        try {
            this.setState({ nvDuAn });
        } catch (error) {

        }
    }

    _callBackNhanVienTheoDoi = (nvDuAnTheoDoi) => {

        try {
            this.setState({ nvDuAnTheoDoi });
        } catch (error) {

        }
    }


    componentWillUnmount() {
        Keyboard.removeListener('keyboardDidShow', this._keyboardDidShow);
        Keyboard.removeListener('keyboardDidHide', this._keyboardDidHide);
    }

    UNSAFE_componentWillMount() {
        const { collapsed } = this.state
        this._panResponder = PanResponder.create({
            onMoveShouldSetPanResponder: (event, gestureState) => true,
            onPanResponderMove: this._onPanResponderMove.bind(this),
            onPanResponderRelease: this._onPanResponderRelease.bind(this)
        });
    }
    _keyboardDidShow = (e) => {
        const { collapsed } = this.state
        if (collapsed == true) {
            this.SWIPE_HEIGHT = Platform.OS == 'android' ? this.SWIPE_HEIGHT : this.SWIPE_HEIGHT + e.endCoordinates.height * 0.95
            this._panResponder = null
            this.keyboardHeight = e.endCoordinates.height
            this.setState({ keyboardStatus: 'Keyboard Show', keyboardHeight: e.endCoordinates.height, scrollEnable: true });

        }
    }

    _keyboardDidHide = () => {
        const { collapsed } = this.state

        if (collapsed == true) {
            this.SWIPE_HEIGHT = Height(33)
            this.keyboardHeight = 0
            this._panResponder = PanResponder.create({
                onMoveShouldSetPanResponder: (event, gestureState) => true,
                onPanResponderMove: this._onPanResponderMove.bind(this),
                onPanResponderRelease: this._onPanResponderRelease.bind(this)
            });
            this.setState({ keyboardStatus: 'Keyboard Hidden', keyboardHeight: 0, scrollEnable: false });
        }
    }

    MultiFilePicker = async () => {
        try {
            const results = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });
            const filePath = Platform.OS == "android" ? results.uri : results.uri.replace("file://", "")

            const strBase64 = await RNFS.readFile(filePath, "base64")

            var file = ({
                filename: results.name,
                strBase64: strBase64
            })
            this.setState({ Attachments: this.state.Attachments.concat(file), files: this.state.files.concat(file) })
            // createFile(file, res)

        } catch (err) {
            if (DocumentPicker.isCancel(err)) {

            } else {

                throw err;
            }
        }
    }

    _SetNgayThang = (dateDk, dateKt) => {

        this.setState({ _dateDk: dateDk, _dateKt: dateKt })
    }
    _selectDate = (val) => {
        var { _dateDk, _dateKt } = this.state;
        if (_dateDk && _dateKt) {
            Utils.goscreen(this, "Modal_CalandaTime", {
                dateF: _dateDk,
                dateT: _dateKt,
                isTimeF: val,
                setTimeFC: this._SetNgayThang,
                arrTitle: [RootLang.lang.scphepthemdon.tungay, RootLang.lang.scphepthemdon.denngay]

            })
        } else {
            Utils.goscreen(this, "Modal_CalandaTime", {
                dateF: _dateDk,
                dateT: _dateKt,
                isTimeF: val,
                setTimeFC: this._SetNgayThang,
                arrTitle: [RootLang.lang.scphepthemdon.tungay, RootLang.lang.scphepthemdon.denngay]
            })
        }
    }
    _renderVideo = ({ item, index }) => {
        //console.log("HOAG:", item)
        return (
            <View style={{ justifyContent: 'space-between', paddingHorizontal: 10, paddingBottom: 10, flexDirection: 'row' }}>
                <View style={{ flexDirection: 'row', width: Width(80) }}>
                    <Image source={UtilsApp._returnImageFile(item.filename)} style={{ width: Width(5), height: Width(5), marginRight: 5 }} />
                    <Text style={{ fontSize: reText(14), color: '#65676B', textAlign: 'center', maxWidth: Width(50), }}>{item.filename}</Text>
                </View>
                <View style={{ justifyContent: 'center', paddingRight: 10 }}>
                    <TouchableOpacity style={[{ marginTop: 4, width: Width(10) }]}
                        onPress={() => {
                            // this._XoaAnh(index)
                            this.ActionSheetDinhKemVideo.setState({ index: index }, () => {
                                this.ActionSheetDinhKemVideo.show()
                            })
                        }}
                    >
                        <Image source={Images.ImageJee.icBaCham} resizeMode='cover' style={[{}]} />
                    </TouchableOpacity>
                </View>

            </View>
        );
    };


    _renderItemFileMini = ({ item, index }) => {
        return (
            <View style={{ justifyContent: 'space-between', paddingHorizontal: 10, paddingBottom: 10, flexDirection: 'row' }}>
                <View style={{ flexDirection: 'row', width: Width(80) }}>
                    <Image source={UtilsApp._returnImageFile(item.filename)} style={{ width: Width(5), height: Width(5), marginRight: 5 }} />
                    <Text style={{ fontSize: reText(14), color: '#65676B', textAlign: 'center', maxWidth: Width(50), }}>{item.filename}</Text>
                </View>
                <View style={{ justifyContent: 'center', paddingRight: 10 }}>
                    <TouchableOpacity style={[{ marginTop: 4, width: Width(10) }]}
                        onPress={() => {
                            // this._XoaAnh(index)
                            this.ActionSheetDinhKem.setState({ index: index }, () => {
                                this.ActionSheetDinhKem.show()
                            })


                        }}
                    >
                        <Image source={Images.ImageJee.icBaCham} resizeMode='cover' style={[{}]} />
                    </TouchableOpacity>
                </View>

            </View>
        );
    };



    _startAnimation = (value) => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: value,
                duration: 300
            }).start();
        }, 400);
    };

    _endAnimation = (value) => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: value,
                duration: 1
            }).start();
        }, 1);
    };




    _onPanResponderRelease(event, gestureState) {
        if (gestureState.dy < 0.01 && this.state.collapsed == true) {
            this.showFull();
            //console.log("vào full")
        } else {
            this.showMini();
            //console.log("vào mini")
        }
    }



    showFull() {
        const { onShowFull, heighFull } = this.props;
        this.customStyle.style.top = DEVICE_HEIGHT * 0.08;
        this.customStyle.style.height = DEVICE_HEIGHT * 1;
        this.swipeIconRef &&
            this.swipeIconRef.setState({ icon: Images.icDropdownNew, showIcon: true });
        // LayoutAnimation.easeInEaseOut();
        this.viewRef.setNativeProps(this.customStyle);
        this.state.collapsed && this.setState({ collapsed: false });
        this.checkCollapsed = false;
        this.setState({ minumun: true })
    }

    showMini() {
        //console.log("height mini keyboard", this.state.keyboardHeight)
        this.customStyle.style.top = !this.state.collapsed
            ? 440 - this.state.keyboardHeight
            : this._goBackEnd();
        this.customStyle.style.height = 440;
        this.swipeIconRef && this.swipeIconRef.setState({ showIcon: false });
        LayoutAnimation.easeInEaseOut();
        this.viewRef.setNativeProps(this.customStyle);
        !this.state.collapsed && this.setState({ collapsed: true });
        this.checkCollapsed = true;
    }



    _onPanResponderMove(event, gestureState) {
        const { collapsed } = this.state
        //console.log("gesture", gestureState.dy)
        if (this.state.collapsed && gestureState.dy < 0) {
            //console.log("swipe up")
            // SWIPE UP
            this.customStyle.style.top = DEVICE_HEIGHT + gestureState.dy - 230;
            this.customStyle.style.height = -gestureState.dy + 230;
            this.swipeIconRef &&
                this.swipeIconRef.setState({ icon: Images.icTopModal, showIcon: true });
            if (this.customStyle.style.top <= DEVICE_HEIGHT / 2) {
                this.swipeIconRef &&
                    this.swipeIconRef.setState({
                        icon: Images.icDropdownNew,
                        showIcon: true
                    });
            }
            LayoutAnimation.easeInEaseOut();
            this.viewRef.setNativeProps(this.customStyle);
        }
        else if (this.state.collapsed && gestureState.dy > 0) {
            //console.log("swipe down")
            this.customStyle.style.top = this.top + gestureState.dy + Width(57.5);
            this.customStyle.style.height = DEVICE_HEIGHT - gestureState.dy;
            this.swipeIconRef && this.swipeIconRef.setState({ icon: Images.icTopModal });
            !this.state.collapsed && this.setState({ collapsed: true });
            LayoutAnimation.easeInEaseOut();
            this.viewRef.setNativeProps(this.customStyle);
        }
    }

    _goBack = () => {
        this._endAnimation(0)
        this.callback(0)
        Utils.goback(this)
    };
    _goBackEnd = () => {
        this._endAnimation(0)
        Utils.goback(this)
    };

    _open_ImageGallery = async (full) => {
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
                // actionSheetRef_Image.current?.hide();
                var imageMap = images.map((i) => {
                    return {
                        filename: Platform.OS == 'ios' ? i.filename : i.path.substring(i.path.lastIndexOf('/') + 1),
                        strBase64: i.data
                    };
                })
                if (full == false && this.state.Added == false) {
                    this.SWIPE_HEIGHT = _.size(imageMap) > 0 ? this.SWIPE_HEIGHT + Width(22) : this.SWIPE_HEIGHT
                    _.size(imageMap) > 0 ? this.setState({ Added: true }) : null
                }
                this.setState({ images: this.state.images.concat(imageMap), Attachments: this.state.Attachments.concat(imageMap) })
            }, async () => {
            }).catch((e) => Utils.nlog(e));

    }

    _open_Video = async (full) => {
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
                // actionSheetRef_Image.current?.hide();
                const filePath = Platform.OS == "android" ? video.path : video.path.replace("file://", "")
                const strBase64 = await RNFS.readFile(filePath, "base64")
                var videocus = ({
                    filename: Platform.OS == 'ios' ? video.filename : video.path.substring(video.path.lastIndexOf('/') + 1),
                    strBase64: strBase64
                })
                this.setState({ video: this.state.video.concat(videocus) })
            }).catch((e) => Utils.nlog(e));
    }

    _XoaAnh = async (index, full = false) => {
        var { images } = this.state
        await this.setState({ images: images.slice(0, index).concat(images.slice(index + 1, images.length)) }, () => {
            if (_.size(this.state.images) == 0 && full == false) {
                this.SWIPE_HEIGHT = this.SWIPE_HEIGHT - Width(22)
                this.setState({ Added: false })
            }
        })
    }

    _XoaFile = async (index, full = false) => {
        var { files } = this.state
        await this.setState({ files: files.slice(0, index).concat(files.slice(index + 1, files.length)) }, () => {
            if (_.size(this.state.files) == 0 && full == false) {
                this.SWIPE_HEIGHT = this.SWIPE_HEIGHT
                this.setState({ Added: false })
            }
        })
    }
    _XoaVideo = async (index, full = false) => {
        var { video } = this.state
        await this.setState({ video: video.slice(0, index).concat(video.slice(index + 1, video.length)) }, () => {
            if (_.size(this.state.video) == 0 && full == false) {
                this.SWIPE_HEIGHT = this.SWIPE_HEIGHT
                this.setState({ Added: false })
            }
        })
    }



    _renderItemImageMini = ({ item, index }) => {
        var { images } = this.state
        return (
            <TouchableOpacity

                onPress={() => {
                    UtilsApp.showImageZoomViewerBsse64(this, images)

                }}
                style={{ justifyContent: 'space-between', height: Height(10), flexDirection: 'row' }}>
                <View style={[{ paddingHorizontal: 10 }]}>
                    <Image
                        style={{ width: Width(20), height: Height(10) }}
                        source={{ uri: `data:image/gif;base64,${item.strBase64}` }}
                        resizeMode='stretch'
                    />
                    <TouchableOpacity onPress={() => {
                        this._XoaAnh(index)
                    }} style={{ position: 'absolute', top: 0, right: 10, marginTop: 5 }}>
                        <Image source={Images.ImageJee.icXoaAnh} resizeMode='cover' style={{ width: 25, height: 25 }} />
                    </TouchableOpacity>
                </View>

            </TouchableOpacity >
        );
    };



    _renderItemImageFull = ({ item, index }) => {
        var { images } = this.state
        return (
            <TouchableOpacity

                onPress={() => {
                    UtilsApp.showImageZoomViewerBsse64(this, images)

                }}
                style={{ justifyContent: 'space-between', height: Height(10), flexDirection: 'row', marginBottom: 10 }}>
                <View style={[{ paddingHorizontal: 10 }]}>
                    <Image
                        style={{ width: Width(20), height: Height(10) }}
                        source={{ uri: `data:image/gif;base64,${item.strBase64}` }}
                        resizeMode='stretch'
                    />
                    <TouchableOpacity onPress={() => {
                        this._XoaAnh(index, true)
                    }} style={{ position: 'absolute', top: 0, right: 10, marginTop: 5, }}>
                        <Image source={Images.ImageJee.icXoaAnh} resizeMode='cover' style={{ width: 25, height: 25 }} />
                    </TouchableOpacity>
                </View>

            </TouchableOpacity >
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


    ConfirmStartDate = (date) => {
        if (this.state.DateDeadline != '' && moment(date).format("YYYY-MM-DD HH:mm") > moment(this.state.DateDeadline, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm")) {
            UtilsApp.MessageShow('Thông báo', 'Ngày bắt đầu phải nhỏ hơn hạn chót', 4)
            return
        }
        this.setState({ DateStart: moment(date).format("YYYY-MM-DD HH:mm:ss") })
        this.hideStartDate();
    };

    hideStartDate = () => {
        this.setState({ showDateStart: false })
    };

    ConfirmDeadlineDate = (date) => {
        if (this.state.DateStart != '' && moment(date).format("YYYY-MM-DD HH:mm") < moment(this.state.DateStart, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm")) {
            UtilsApp.MessageShow('Thông báo', 'Hạn chót phải lớn hơn ngày bắt đầu', 4)
            return
        }
        this.setState({ DateDeadline: moment(date).format("YYYY-MM-DD HH:mm:ss") })
        this.hideDeadlineDate();
    };

    hideDeadlineDate = () => {
        this.setState({ showDateDeadline: false })
    };



    _itemMini = () => {
        var { tencongviec, scrollEnable, DuAn, nvDuAn, _dateDk,
            _dateKt, piority, showDateStart, showDateDeadline,
            DateDeadline, DateStart, Child, project, itemChiTietCongViec, nvDuAnTheoDoi, video

        } = this.state
        return (
            <View style={{
                paddingBottom: Platform.OS == 'ios' ? this.state.keyboardHeight + paddingBotX : paddingBotX
            }}>
                <View style={{ paddingLeft: 16, padding: 10, }}>
                    <View {...this._panResponder?.panHandlers}>
                        <View
                            style={{ flex: 1, alignItems: 'center', marginBottom: 10 }}>
                            <Image
                                source={Images.icTopModal}
                                resizeMode={'cover'} />
                        </View>
                        {Child && !this.FromDuAn ?
                            <Text style={{ fontSize: 18, color: colors.black, fontWeight: "600" }}>{RootLang.lang.JeeWork.congvieccon}</Text> :
                            <Text style={{ fontSize: 18, color: colors.black, fontWeight: "600" }}>{RootLang.lang.JeeWork.taocongviec}</Text>
                        }
                    </View>
                    <View
                        ref={ref => { this.scrollView = ref }}
                        //onContentSizeChange={() => this.scrollView.scrollToEnd({ animated: true })}
                        style={{}}>
                        <TextInput
                            style={{
                                marginVertical: 5,
                                width: '100%',
                                flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                                paddingVertical: 10, backgroundColor: colors.white,
                            }}
                            placeholder={Child && !this.FromDuAn ? RootLang.lang.JeeWork.tencongvieccon : RootLang.lang.JeeWork.tencongviec}
                            placeholderTextColor={colors.colorPlayhoder}
                            value={tencongviec}
                            onChangeText={(tencongviec) => this.setState({ tencongviec })}
                            ref={ref => tencongviec = ref}
                        />
                        <View style={{ flexDirection: "row" }}>
                            <ScrollView style={{ flexDirection: "row" }} horizontal >
                                <TouchableOpacity
                                    disabled={Child}
                                    onPress={() => { this._PickDuAn() }}
                                    style={{ borderColor: "#E4E6EB", borderWidth: 0.7, padding: 5, borderRadius: 5, marginRight: 10, justifyContent: 'center' }}>
                                    {_.size(DuAn) > 0 && !Child ?
                                        <Text numberOfLines={1} style={{ color: colors.black_70, maxWidth: Width(45) }}>{RootLang.lang.JeeWork.duan} <Text style={{ fontWeight: "600" }}>{DuAn.title} </Text> </Text> : (
                                            Child ? <Text style={{ color: colors.black_70, maxWidth: Width(45) }}>{RootLang.lang.JeeWork.duan} <Text style={{ fontWeight: "600" }}>{project.project_team} </Text> </Text> : <Text style={{ color: colors.black_70 }}>{RootLang.lang.JeeWork.themvao} <Text style={{ fontWeight: "600" }}>{RootLang.lang.JeeWork.duan} </Text> </Text>
                                        )
                                    }
                                </TouchableOpacity>
                                <TouchableOpacity style={{
                                    borderColor: "#E4E6EB", marginRight: 10, borderWidth: 0.7, padding: 5, borderRadius: 5, flexDirection: "row"
                                }}
                                    onPress={() => { this._ThemNhanVien(1) }}  >
                                    {
                                        nvDuAn.id_nv ?
                                            <View style={{ flexDirection: "row", alignItems: "center", width: Width(12) }}>
                                                <View style={{ position: "absolute" }}>
                                                    <Image source={Images.ImageJee.icAddPerson} style={{}} />
                                                </View>
                                                {nvDuAn.image ?
                                                    <View style={{ width: 25, height: 25, borderRadius: 25, marginLeft: 25, }}>
                                                        <Image source={{ uri: nvDuAn.image }} style={{ width: 25, height: 25, borderRadius: 25 }} />
                                                    </View>
                                                    :
                                                    <View style={{
                                                        flexDirection: "row", position: "absolute",
                                                        marginLeft: 25,
                                                        width: 25, height: 25, borderRadius: 99, backgroundColor: this.intToRGB(this.hashCode(nvDuAn.hoten)),
                                                    }} >
                                                        <Text style={{ left: 4, alignSelf: "center", fontWeight: "bold", fontSize: reText(12), color: colors.white }}>{String(nvDuAn.hoten).split(" ").slice(-1).toString().slice(0, 2).toString()}</Text>
                                                    </View>}

                                            </View>
                                            : <>
                                                <View style={{ flexDirection: "row", alignSelf: "center" }}>
                                                    <Image source={Images.ImageJee.icAddPerson} style={{ marginHorizontal: 5, marginTop: 2 }} />
                                                    <Text style={{ color: colors.black_70 }}>{RootLang.lang.thongbaochung.themnguoithuchien}</Text>
                                                </View>
                                            </>
                                    }
                                </TouchableOpacity>
                                <TouchableOpacity style={{ borderColor: "#E4E6EB", borderWidth: 0.7, padding: 5, borderRadius: 5, flexDirection: "row" }}
                                    onPress={() => { this._ThemNhanVienTheoDoi(2) }}  >
                                    {
                                        nvDuAnTheoDoi.length > 0 ?
                                            <View style={{ width: nvDuAnTheoDoi.length + 1 > 6 ? 27 * 6 : (nvDuAnTheoDoi.length + 1) * 27, flexDirection: "row", alignItems: "center" }}>
                                                <View style={{ position: "absolute" }}>
                                                    <Image source={Images.ImageJee.icGroup} style={{ marginHorizontal: 5, marginTop: 2, width: 15, height: 15, tintColor: "grey" }} />
                                                </View>
                                                {nvDuAnTheoDoi.map((item, index) => {
                                                    return (
                                                        <View style={{
                                                            flexDirection: "row", position: "absolute",
                                                            left: index > 4 ? 5 * 22 : index * 22,
                                                            marginLeft: 30,
                                                            width: 25, height: 25, borderRadius: 99, backgroundColor: index > 4 ? colors.blackTwo : this.intToRGB(this.hashCode(item.hoten)),
                                                        }} key={index}>
                                                            {item.image && index <= 4 ? <Image source={{ uri: item.image }} style={{ width: 25, height: 25, borderRadius: 25 }} /> :
                                                                <Text style={{ left: 4, alignSelf: "center", fontWeight: "bold", fontSize: reText(12), color: colors.white }}>{index > 4 ? "+" + `${nvDuAnTheoDoi.length - 5}` : String(item.hoten).split(" ").slice(-1).toString().slice(0, 2).toString()}</Text>}
                                                        </View>
                                                    )
                                                })}
                                            </View>
                                            : <>
                                                <View style={{ flexDirection: "row", alignSelf: "center" }}>
                                                    <Image source={Images.ImageJee.icGroup} style={{ marginHorizontal: 5, marginTop: 2, width: 15, height: 15, tintColor: "grey" }} />
                                                    <Text style={{ color: colors.black_70 }}>{RootLang.lang.thongbaochung.themnguoitheodoi} </Text>
                                                </View>
                                            </>
                                    }
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                        <View style={{ marginTop: 10 }}>
                            <Text style={{ marginBottom: 10, fontSize: 13 }}> {RootLang.lang.JeeWork.ngaybatdau}: <Text style={{ fontWeight: "600", fontSize: 14 }}>{DateStart ? moment(DateStart).format('DD/MM/YYYY HH:mm') : ""} </Text> </Text>

                            <Text style={{ fontSize: 13 }}> {RootLang.lang.JeeWork.hanchot}: <Text style={{ fontWeight: "600", fontSize: 14 }}>{DateDeadline ? moment(DateDeadline).format('DD/MM/YYYY HH:mm') : ""} </Text>  </Text>

                            {
                                this.state.files.length > 0 ?
                                    <View style={{ flex: 1, paddingTop: 10 }}>
                                        <FlatList
                                            showsHorizontalScrollIndicator={false}
                                            showsVerticalScrollIndicator={false}
                                            data={this.state.files}
                                            scrollEnabled={true}
                                            nestedScrollEnabled={true}
                                            renderItem={this._renderItemFileMini}
                                            keyExtractor={(item, index) => index.toString()}
                                        />
                                    </View>
                                    : null
                            }
                            {
                                video.length > 0 ?
                                    <View style={{ flex: 1, paddingTop: 10 }}>
                                        <FlatList
                                            showsHorizontalScrollIndicator={false}
                                            showsVerticalScrollIndicator={false}
                                            data={video}
                                            scrollEnabled={true}
                                            nestedScrollEnabled={true}
                                            renderItem={this._renderVideo}
                                            keyExtractor={(item, index) => index.toString()}
                                        />
                                    </View>
                                    : null
                            }
                            {
                                this.state.images.length > 0 ?
                                    <View style={{ flex: 1, paddingTop: 10 }}>
                                        <FlatList
                                            horizontal
                                            showsHorizontalScrollIndicator={false}
                                            showsVerticalScrollIndicator={false}
                                            data={this.state.images}
                                            scrollEnabled={true}
                                            nestedScrollEnabled={true}
                                            renderItem={this._renderItemImageMini}
                                            keyExtractor={(item, index) => index.toString()}
                                        />
                                    </View>
                                    : null
                            }
                        </View>

                    </View>

                </View >
                <View style={{}}>
                    <Dash
                        dashColor={"#E4E6EB"}
                        style={{ width: Width(100) }}
                        dashGap={0}
                        dashThickness={1} />
                    <View style={{ flexDirection: "row", paddingLeft: 10 }}>
                        <View style={{ flexDirection: "row", flex: 1, }}>
                            <TouchableOpacity style={{ padding: 13 }} onPress={() => {
                                this.MultiFilePicker()
                            }}>
                                <Image source={Images.ImageJee.icLink} resizeMode={"contain"} style={{ tintColor: "#B3B3B3", width: 20, height: 20 }} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => { this._open_ImageGallery(false) }}

                                style={{ padding: 13 }}>
                                <Image source={Images.ImageJee.icCamera} resizeMode={"contain"} style={{ tintColor: "#B3B3B3", width: 20, height: 20 }} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => { this._open_Video(false) }}

                                style={{ padding: 13 }}>
                                <Image source={Images.ImageJee.icVideoChat} resizeMode={"contain"} style={{ tintColor: "#B3B3B3", width: 20, height: 20 }} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => { this._FlagPiority() }}
                                style={{ padding: 13 }}>

                                <Image source={piority.row == 0 ? Images.JeeCloseModal : Images.ImageJee.icCoKhongUuTien} resizeMode={"contain"} style={{ tintColor: _.size(piority) > 0 ? piority.color : "#B3B3B3", width: 20, height: 20 }} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                if (_.size(DuAn) || Child) {
                                    this.setState({ showDateStart: true })
                                }
                                else {
                                    UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, RootLang.lang.JeeWork.vuilongchonduan, 3)
                                    this._PickDuAn()
                                }
                            }}
                                style={{ padding: 13 }}>
                                <Image source={Images.ImageJee.icCalenda} resizeMode={"contain"} style={{ tintColor: "green", width: 20, height: 20 }} />
                                <View style={{ position: "absolute", flexDirection: "row", width: 50 }}>
                                    <DateTimePickerModal
                                        isVisible={showDateStart}
                                        date={new Date()}
                                        mode="datetime"
                                        display="default"
                                        locale='vi'
                                        cancelTextIOS={RootLang.lang.JeeWork.huy}
                                        confirmTextIOS={RootLang.lang.JeeWork.dongy}
                                        headerTextIOS={'Chọn ngày bắt đầu công việc'}
                                        style={{ alignContent: "center", marginLeft: Width(18), marginTop: 20, marginBottom: 20 }}
                                        onConfirm={this.ConfirmStartDate}
                                        onCancel={this.hideStartDate}
                                    />
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => {
                                if (_.size(DuAn) || Child) {
                                    this.setState({ showDateDeadline: true })
                                }
                                else {
                                    UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, RootLang.lang.JeeWork.vuilongchonduan, 3)
                                    this._PickDuAn()
                                }
                            }}
                                style={{ padding: 13 }}>
                                <Image source={Images.ImageJee.icCalenda} resizeMode={"contain"} style={{ tintColor: "red", width: 20, height: 20 }} />
                                <View style={{ position: "absolute", flexDirection: "row", width: 50 }}>
                                    <DateTimePickerModal
                                        isVisible={showDateDeadline}
                                        mode="datetime"
                                        locale='vi'
                                        display="default"
                                        date={new Date()}
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
                        <View style={{ flexDirection: "row", justifyContent: "center", alignContent: "center", alignItems: "center" }}>
                            <Dash
                                dashColor={colors.colorTextBTGray}
                                style={{ height: Height(3), flexDirection: 'column' }}
                                dashGap={0}
                                dashThickness={1} />
                            <TouchableOpacity
                                disabled={tencongviec.length > 0 && (_.size(DuAn) > 0 || Child) && nvDuAn.id_nv ? false : true}
                                onPress={() => { this._CreateCongViec() }} style={{ padding: 13 }}>
                                <Image source={Images.ImageJee.icSend} resizeMode={"contain"} style={{ tintColor: tencongviec.length > 0 && (_.size(DuAn) > 0 || Child) && nvDuAn.id_nv ? "green" : "#B3B3B3", width: 20, height: 20 }} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View >
        )
    }

    _minimum = async () => {
        this._panResponder = await PanResponder.create({
            onMoveShouldSetPanResponder: (event, gestureState) => true,
            onPanResponderMove: this._onPanResponderMove.bind(this),
            onPanResponderRelease: this._onPanResponderRelease.bind(this)
        })
        return true

    }
    _uploadFile = (indexAt, type) => {
        // Utils.nlog("indexAt:", indexAt, type)
        if (indexAt == 1) {
            this._open_ImageGallery(true)

        }
        if (indexAt == 2) {
            this._open_Video(true)

        }
        if (indexAt == 3) {
            this.MultiFilePicker()
        }
    }

    ClickTag = (item) => {
        let data = this.state.Tags.concat(item)
        this.setState({ Tags: data, isOpenModal: false })
    }

    deleteTags = (item, index) => {
        let data = this.state.Tags
        data.splice(index, 1)
        this.setState({ Tags: data })

    }

    Deletetags = async (item) => {
        let res = await Delete_tag(item.id_row)
        if (res.status == 1) {
            UtilsApp.MessageShow('Thông báo', 'Xoá nhãn thành công', 1)
            this.getTagProject(this.state.id_project_team)
        }
        else {
            UtilsApp.MessageShow('Thông báo', 'Lỗi xoá nhãn', 2)
            this.getTagProject(this.state.id_project_team)
        }
    }


    _renderTagProJect = ({ item, index }) => {
        return (
            <TouchableOpacity key={index} onPress={() => this.ClickTag(item)} key={index} style={{ marginVertical: 5, flexDirection: 'row', }}>
                <View style={{ backgroundColor: item.color, width: Width(7), height: Width(7), marginRight: 5 }} />
                <Text style={{ fontSize: reText(16), color: item.color, marginRight: 10, width: Width(65), alignSelf: 'center' }}>{item.title}</Text>
                <TouchableOpacity onPress={() => this.Deletetags(item)} style={{ width: Width(10), height: Width(5), justifyContent: 'center' }}>
                    <Image source={Images.ImageJee.icDelete} style={{ width: 15, height: 15 }} />
                </TouchableOpacity>
            </TouchableOpacity>
        )

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
            this.getTagProject(this.state.id_project_team)
            this.ClickTag(res.data)
            this.setState({ TitleTag: '', colorCerrent: { "id": 'rgb(255, 0, 0)' } })
        }
        else {
            UtilsApp.MessageShow('Thông báo', res.error.message ? res.error.message : 'Lỗi hệ thống', 2)
        }

    }

    OpenModalInput = () => {
        this.setState({ isOpenInputTime: true })
    }

    SaveTime = () => {
        this.setState({ isOpenInputTime: false, Estimate: this.state.EstimateTemp })
    }

    _itemFull = () => {
        var { tencongviec, DuAn, DateDeadline, DateStart, piority,
            nvDuAn, showDateStart, showDateDeadline, Child, nvDuAnTheoDoi, mota, video, Tags, isOpenModal, colorCerrent, dataTagProJect, project, isOpenInputTime } = this.state
        return (
            <View onPress={Keyboard.dismiss} accessible={false} style={{ flex: 1 }}>

                <View style={{ marginVertical: 10, alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}>
                    <Image
                        source={Images.icTopModal}
                        resizeMode={'cover'} />
                </View>

                <View
                    style={{ backgroundColor: colors.white }}>
                    <View style={{ borderBottomWidth: 0.3, alignItems: 'center', paddingHorizontal: 15, borderColor: '#E4E6EB' }}>
                        <TextInput
                            style={{
                                fontSize: reText(18),
                                marginVertical: 5,
                                width: '100%',
                                flexDirection: 'row',
                                paddingVertical: 10,
                            }}
                            placeholder={Child && !this.FromDuAn ? RootLang.lang.JeeWork.tencongvieccon : RootLang.lang.JeeWork.tencongviec}
                            placeholderTextColor={colors.colorPlayhoder}
                            value={tencongviec}
                            onChangeText={(tencongviec) => this.setState({ tencongviec })}
                            ref={ref => tencongviec = ref}
                        />
                    </View>
                    <View style={{ backgroundColor: colors.white, marginVertical: 3 }}>
                        {Tags.length == 0 ?
                            <TouchableOpacity onPress={() => {
                                if (_.size(DuAn) > 0 || this.state.Child) {
                                    this.setState({ isOpenModal: true })
                                } else {
                                    UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, RootLang.lang.JeeWork.vuilongchonduan, 3)
                                    this._PickDuAn()
                                }
                            }}
                                style={{ height: Width(9), width: Width(14), paddingHorizontal: 10, marginTop: 5 }}>
                                <View style={{ borderWidth: 0.5, borderColor: colors.black_50, padding: 5, borderRadius: 100, marginLeft: 5, borderStyle: 'dashed' }}>
                                    <Image source={Images.ImageJee.tagcv} style={{ width: Width(5), height: Width(5), tintColor: colors.black_50 }} />
                                </View>
                            </TouchableOpacity> :
                            <View style={{ flexDirection: 'row', paddingVertical: 5, alignItems: 'center', paddingHorizontal: 10 }}>
                                <TouchableOpacity onPress={() => { this.setState({ isOpenModal: true }) }
                                } style={{ borderWidth: 0.5, borderColor: colors.black_50, padding: 5, borderRadius: 100, marginLeft: 5, borderStyle: 'dashed', marginRight: 10 }}>
                                    <Image source={Images.ImageJee.tagcv} style={{ width: Width(5), height: Width(5), tintColor: colors.black_50 }} />
                                </TouchableOpacity>
                                <ScrollView
                                    horizontal={true}
                                    ref={ref => this.Tags = ref}
                                    onContentSizeChange={() => this.Tags.scrollToEnd({ animated: true })}
                                >
                                    {Tags && Tags.map((item, index) => {
                                        return (
                                            <TouchableOpacity onPress={() => this.deleteTags(item, index)} style={{ backgroundColor: this.Opaciti_color(item.color), height: Width(7), paddingLeft: 5, paddingRight: 20, borderBottomRightRadius: 20, borderTopRightRadius: 20, justifyContent: 'center', marginRight: 5, borderTopLeftRadius: 3, borderBottomLeftRadius: 3 }}>
                                                <Text style={{ fontSize: reText(14), color: item.color == '#848E9E' ? colors.white : item.color }}>{item.title}</Text>
                                            </TouchableOpacity>
                                        )
                                    })}
                                </ScrollView>
                            </View>
                        }
                    </View>
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
                            <Text style={{ fontSize: reText(16), fontWeight: 'bold', color: '#206EC0' }}>{RootLang.lang.thongbaochung.chonnhan}</Text>
                            <FlatList
                                style={{ maxHeight: Height(30), marginTop: 10 }}
                                data={dataTagProJect}
                                renderItem={this._renderTagProJect}
                                keyExtractor={(item, index) => index.toString()}
                            />
                            <View style={{ flexDirection: 'row', marginTop: 15, borderWidth: 0.5, borderStyle: 'dashed', padding: 7 }}>
                                <View style={{ backgroundColor: colorCerrent.id, alignSelf: 'center' }} />


                                <View style={{ justifyContent: 'center', width: '75%', paddingHorizontal: 5 }}>
                                    <TextInput placeholder={RootLang.lang.thongbaochung.nhaptennhan} style={{ fontSize: reText(16), paddingVertical: Platform.OS == 'ios' ? 10 : 5 }} value={this.state.TitleTag} onChangeText={text => this.setState({ TitleTag: text })} />
                                </View>
                                <View style={{ width: '25%', justifyContent: 'center' }}>
                                    <TouchableOpacity onPress={() => this.SaveTags()} style={{ paddingVertical: 5, paddingHorizontal: 10, backgroundColor: '#206EC0', justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                                        <Text style={{ fontSize: reText(14), color: colors.white }}>{RootLang.lang.thongbaochung.tao}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <Text style={{ fontSize: reText(14), color: '#040404', marginTop: 10, marginBottom: 5 }}>{RootLang.lang.thongbaochung.chonmau}</Text>
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
                                    <TextInput autoFocus={true} keyboardType={'numeric'} placeholder={RootLang.lang.thongbaochung.nhapsogio} style={{ fontSize: reText(16), paddingVertical: Platform.OS == 'ios' ? 10 : 5, flex: 1 }} value={this.state.EstimateTemp} onChangeText={text => this.setState({ EstimateTemp: text })} />
                                    <TouchableOpacity onPress={() => { this.setState({ Estimate: 0, EstimateTemp: 0 }) }} style={{ width: Width(5), height: Width(5), borderRadius: Width(5), marginLeft: 10, backgroundColor: colors.redStar, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ color: colors.white }}>X</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </Animatable.View>
                    </View>
                </Modal>
                <ScrollView style={[nstyles.ncontainer, { backgroundColor: colors.black_10, width: Width(100) }]}>
                    <View style={{ backgroundColor: colors.white, marginHorizontal: 10, marginTop: 10, borderRadius: 10 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: Height(6), borderBottomWidth: 0.3, alignItems: 'center', paddingHorizontal: 10, borderColor: '#E4E6EB' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image source={Images.ImageJee.icProjectS} style={{ width: Width(6), height: Width(6), marginRight: 5 }} />
                                <Text style={{ fontSize: reText(15), color: '#65676B', textAlign: 'center', }}>{RootLang.lang.thongbaochung.duan}</Text>
                            </View>
                            <TouchableOpacity disabled={Child} onPress={() => { this._PickDuAn() }} style={{ backgroundColor: colors.black_5, paddingVertical: 8, borderRadius: 5 }}>
                                {_.size(DuAn) > 0 && !Child ?

                                    <Text numberOfLines={1} style={{ marginLeft: 5, color: colors.black_70, fontWeight: "600", paddingHorizontal: 15, fontSize: reText(15), maxWidth: Width(50), color: '#289FFB' }}>{DuAn.title}</Text>
                                    :
                                    <>
                                        {Child ?
                                            <Text style={{ color: colors.black_70, maxWidth: Width(45), fontWeight: "600", paddingHorizontal: 15, fontSize: reText(15), maxWidth: Width(50), color: '#289FFB' }}>{project.project_team} </Text>
                                            :
                                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingLeft: 20, paddingRight: 10 }}>
                                                <View style={{ width: Width(2.5) }} />
                                                <Text style={{ color: '#289FFB', fontSize: reText(15) }}>--{RootLang.lang.thongbaochung.chonduan}--</Text>
                                                <Image source={Images.icDropdown} style={{ width: Width(2.7), height: Width(1.5), marginLeft: 10, tintColor: '#65676B' }} />
                                            </View>

                                        }
                                    </>}
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: Height(6), borderBottomWidth: 0.3, alignItems: 'center', paddingHorizontal: 10, borderColor: '#E4E6EB' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image source={Images.ImageJee.icAccepter} style={{ width: Width(6), height: Width(6), marginRight: 5 }} />
                                <Text style={{ fontSize: reText(15), color: '#65676B', textAlign: 'center', }}>{RootLang.lang.thongbaochung.nguoithuchien}</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => { this._ThemNhanVien(1) }} style={{ flexDirection: 'row', width: Width(10), justifyContent: 'flex-end' }}>
                                {
                                    nvDuAn.id_nv ?
                                        <View style={{ flexDirection: "row", alignItems: "center", }}>
                                            <View style={{
                                                flexDirection: "row", justifyContent: 'center', alignItems: 'center',
                                                width: 25, height: 25, borderRadius: 99, backgroundColor: this.intToRGB(this.hashCode(nvDuAn.hoten)),
                                            }}>
                                                {nvDuAn.image ? <Image source={{ uri: nvDuAn.image }} style={{ width: 25, height: 25, borderRadius: 25 }} /> :
                                                    <Text style={{ alignSelf: "center", fontWeight: "bold", fontSize: reText(12), color: colors.white }}>{String(nvDuAn.hoten).split(" ").slice(-1).toString().slice(0, 2).toString()}</Text>}
                                            </View>
                                        </View>
                                        : <>
                                            <Image source={Images.ImageJee.icChonNguoiThamGia} style={{ tintColor: '#B5BDC2', marginRight: 5 }} />
                                        </>

                                }

                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: Height(6), borderBottomWidth: 0.3, alignItems: 'center', paddingHorizontal: 10, borderColor: '#E4E6EB' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image source={Images.ImageJee.icManyPeople} style={{ width: Width(6), height: Width(6), marginRight: 5 }} />
                                <Text style={{ fontSize: reText(15), color: '#65676B', textAlign: 'center', }}>{RootLang.lang.JeeWork.nguoitheodoi}</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => { this._ThemNhanVienTheoDoi(2) }} style={{ flexDirection: 'row' }}>
                                {
                                    nvDuAnTheoDoi.length > 0 ?
                                        <View style={{ width: Width(40), alignItems: 'flex-end', justifyContent: 'center' }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                {nvDuAnTheoDoi.map((item, index) => {
                                                    return (
                                                        index > 5 ? null :
                                                            <View style={{
                                                                flexDirection: "row",
                                                                width: 25, height: 25, borderRadius: 99, backgroundColor: index > 4 ? colors.orange : this.intToRGB(this.hashCode(item.hoten)),
                                                            }} key={index}>
                                                                {item.image && index <= 4 ? <Image source={{ uri: item.image }} style={{ width: 25, height: 25, borderRadius: 25 }} /> :
                                                                    <Text style={{ left: 4, alignSelf: "center", fontWeight: "bold", fontSize: reText(12), color: colors.white }}>{index > 4 ? "+" + `${nvDuAnTheoDoi.length - 5}` : String(item.hoten).split(" ").slice(-1).toString().slice(0, 2).toString()}</Text>}
                                                            </View>
                                                    )
                                                })}

                                            </View>
                                        </View>
                                        : <>

                                            <Image source={Images.ImageJee.icChonNguoiThamGia} style={{ tintColor: '#B5BDC2', marginRight: 5 }} />
                                        </>

                                }

                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: Height(6), borderBottomWidth: 0.3, alignItems: 'center', paddingHorizontal: 10, borderColor: '#E4E6EB' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image source={Images.ImageJee.jwTinhTrang} style={{ width: Width(6), height: Width(6), marginRight: 5 }} />
                                <Text style={{ fontSize: reText(15), color: '#65676B', textAlign: 'center', }}>{RootLang.lang.JeeWork.tinhtrang}</Text>
                            </View>
                            <View style={{ backgroundColor: '#B5BDC2', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 15 }}>
                                <Text style={{ fontSize: reText(15), color: colors.white, textAlign: 'center', }}>{RootLang.lang.JeeWork.moitao}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: Height(6), borderBottomWidth: 0.3, alignItems: 'center', paddingHorizontal: 10, borderColor: '#E4E6EB' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image source={Images.ImageJee.jwMucDo} style={{ width: Width(6), height: Width(6), marginRight: 5 }} />
                                <Text style={{ fontSize: reText(15), color: '#65676B', textAlign: 'center', }}>{RootLang.lang.JeeWork.mucdouutien}</Text>
                            </View>
                            <TouchableOpacity onPress={() => { this._FlagPiority() }} style={{ flexDirection: 'row', width: Width(15), height: Width(10), justifyContent: 'flex-end', alignItems: 'center' }}>
                                <Image source={piority.row == 0 ? Images.JeeCloseModal : Images.ImageJee.icCoKhongUuTien} style={[{ tintColor: _.size(piority) > 0 ? piority.color : "#B3B3B3", width: piority.row == 0 ? Width(5.5) : Width(4), height: piority.row == 0 ? Width(5.5) : Width(5) }]} />
                                <Text style={{ fontSize: sizes.sText12, color: '#65676B', textAlign: 'center', fontWeight: 'bold', alignSelf: "center" }}>{_.size(piority) > 0 ? '' : RootLang.lang.JeeWork.chonmucdouutien}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: Height(6), borderBottomWidth: 0.3, alignItems: 'center', paddingHorizontal: 10, borderColor: '#E4E6EB' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image source={Images.ImageJee.jwTime} style={{ width: Width(6), height: Width(6), marginRight: 5 }} />
                                <Text style={{ fontSize: reText(15), color: '#65676B', textAlign: 'center', }}>{RootLang.lang.JeeWork.ngaybatdau}</Text>
                            </View>

                            <TouchableOpacity onPress={() => this.setState({ showDateStart: true })} style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', minWidth: Width(15), minHeight: Width(7) }}>
                                {DateStart ?
                                    <Text style={{ fontSize: reText(15), textAlign: 'center' }}>{DateStart ? moment(DateStart).format('DD/MM/YYYY HH:mm') : ""}</Text> :
                                    <>
                                        <Image source={Images.ImageJee.jwAddTime} style={{ width: Width(6), height: Width(6) }} />
                                    </>
                                }
                                <DateTimePickerModal
                                    isVisible={showDateStart}
                                    date={new Date()}
                                    mode="datetime"
                                    display="default"
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

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: Height(6), borderBottomWidth: 0.3, alignItems: 'center', paddingHorizontal: 10, borderColor: '#E4E6EB' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image source={Images.ImageJee.icOClock} style={{ width: Width(6), height: Width(6), marginRight: 5 }} />
                                <Text style={{ fontSize: reText(15), color: '#65676B', textAlign: 'center', }}>{RootLang.lang.JeeWork.hanchot}</Text>
                            </View>
                            <TouchableOpacity onPress={() => this.setState({ showDateDeadline: true })} style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', minWidth: Width(15), minHeight: Width(7), }}>
                                {DateDeadline ?

                                    <Text style={{ fontSize: reText(15), textAlign: 'center', }}>{DateDeadline ? moment(DateDeadline).format('DD/MM/YYYY HH:mm') : ""}</Text> :
                                    <>
                                        <Image source={Images.ImageJee.jwAddTime} style={{ width: Width(6), height: Width(6) }} />
                                    </>
                                }
                                <View style={{ position: "absolute", flexDirection: "row", width: 50 }}>
                                    <DateTimePickerModal
                                        isVisible={showDateDeadline}
                                        mode="datetime"
                                        locale='vi'
                                        display="default"
                                        date={new Date()}
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
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: Height(6), borderBottomWidth: 0.3, alignItems: 'center', paddingHorizontal: 10, borderColor: '#E4E6EB' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image source={Images.ImageJee.icClock} style={{ width: Width(6), height: Width(6), marginRight: 5 }} />
                                <Text style={{ fontSize: reText(15), color: '#65676B', textAlign: 'center', }}>{RootLang.lang.thongbaochung.thoigianlam}</Text>
                            </View>
                            <TouchableOpacity onPress={() => this.OpenModalInput()} style={{ minWidth: Width(50), height: Width(8), justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row' }}>
                                <View style={{ minWidth: Width(10), maxWidth: Width(50), height: Width(8), borderWidth: 0.5, borderColor: colors.black_50, borderRadius: 5, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 5 }}>
                                    <Text style={{ color: this.state.Estimate == 0 ? colors.black_50 : colors.colorTitleNew, fontSize: reText(16) }}>{this.state.Estimate == 0 ? RootLang.lang.thongbaochung.nhapsogio : this.state.Estimate}</Text>
                                </View>
                                <Text style={{ marginLeft: 5, color: "grey", fontSize: reText(14) }}>{RootLang.lang.thongbaochung.gio}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{ marginTop: 10, backgroundColor: colors.white, padding: 10, marginHorizontal: 10, borderRadius: 10 }}>
                        <Text style={{ fontSize: sizes.sText16, color: colors.tabGreen, fontWeight: 'bold', marginLeft: 3 }}>{RootLang.lang.JeeWork.motacongviec}</Text>
                        {
                            <TouchableOpacity
                                onPress={() => Utils.goscreen(this, 'Modal_EditHTML', {
                                    title: 'Mô tả công việc',
                                    isEdit: true,
                                    content: mota,
                                    isVoice: false,
                                    callback: (html) => {
                                        this.setState({ mota: html })
                                    }
                                })}
                            >
                                {mota ?
                                    <HTML
                                        source={{ html: mota }}
                                        containerStyle={{ paddingHorizontal: 5, paddingVertical: 5 }}
                                        contentWidth={Width(90)}
                                        tagsStyles={{
                                            div: { fontSize: reText(18) },
                                        }}
                                    />
                                    :
                                    <View style={{ height: Height(7), justifyContent: 'center', alignItems: 'center' }}>
                                        <View style={{ borderWidth: 1, borderColor: colors.textGray, paddingHorizontal: Width(25), paddingVertical: 5, borderRadius: 5, borderStyle: 'dashed' }}>
                                            <Text style={{ fontSize: reText(15), color: colors.textGray }}>{RootLang.lang.thongbaochung.nhapmota}</Text>
                                        </View>
                                    </View>}
                            </TouchableOpacity>
                        }
                    </View>
                    <View style={{ marginTop: 10, backgroundColor: colors.white, marginBottom: 20, paddingTop: 10, marginHorizontal: 10, borderRadius: 10, paddingHorizontal: 10 }}>
                        <View style={{ marginVertical: 10, flexDirection: "row", paddingBottom: 10 }}>
                            <Text style={{ alignSelf: "center", fontSize: sizes.sText16, color: colors.tabGreen, fontWeight: 'bold', flex: 1, marginLeft: 3 }}>{RootLang.lang.JeeWork.tailieudinhkem}</Text>
                            <TouchableOpacity
                                onPress={() => {
                                    this.ActionSheet.show()
                                }}
                                style={{ alignSelf: "center", }}>
                                <Image style={{ width: 20, height: 20, }} source={Images.ImageJee.icThemLuaChon} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 1 }}>
                            {/* <View style={{ flexDirection: "row", justifyContent: "center" }}>
                                <TouchableOpacity
                                    onPress={() => { this._open_ImageGallery(true) }}
                                    style={{ padding: 13, flexDirection: "row" }}>
                                    <Image source={Images.ImageJee.icCamera} resizeMode={"contain"} style={{ tintColor: "#B3B3B3", width: 20, height: 20 }} />
                                    <Text style={{ paddingHorizontal: 10 }}>{RootLang.lang.JeeWork.hinhanh}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ padding: 13, flexDirection: "row" }} onPress={() => {
                                    this.MultiFilePicker()
                                }}>
                                    <Image source={Images.ImageJee.icLink} resizeMode={"contain"} style={{ tintColor: "#B3B3B3", width: 20, height: 20 }} />
                                    <Text style={{ paddingHorizontal: 10 }}>{RootLang.lang.JeeWork.filedinhkem}</Text>
                                </TouchableOpacity>
                            </View> */}
                            {
                                this.state.files.length > 0 ?
                                    <View style={{ flex: 1 }}>
                                        <FlatList
                                            showsHorizontalScrollIndicator={false}
                                            showsVerticalScrollIndicator={false}
                                            data={this.state.files}
                                            scrollEnabled={true}
                                            nestedScrollEnabled={true}
                                            renderItem={this._renderItemFileMini}
                                            keyExtractor={(item, index) => index.toString()}
                                        />
                                    </View>
                                    : null
                            }
                            {
                                video.length > 0 ?
                                    <View style={{ flex: 1 }}>
                                        <FlatList
                                            showsHorizontalScrollIndicator={false}
                                            showsVerticalScrollIndicator={false}
                                            data={video}
                                            scrollEnabled={true}
                                            nestedScrollEnabled={true}
                                            renderItem={this._renderVideo}
                                            keyExtractor={(item, index) => index.toString()}
                                        />
                                    </View>
                                    : null
                            }
                            {
                                this.state.images.length > 0 ?
                                    <View style={{ flex: 1, marginBottom: 5 }}>
                                        <FlatList
                                            horizontal
                                            showsHorizontalScrollIndicator={false}
                                            showsVerticalScrollIndicator={false}
                                            data={this.state.images}
                                            scrollEnabled={true}
                                            nestedScrollEnabled={true}
                                            renderItem={this._renderItemImageFull}
                                            keyExtractor={(item, index) => index.toString()}
                                        />
                                    </View>
                                    : null
                            }
                        </View>

                    </View>

                    <TouchableOpacity
                        disabled={tencongviec.length > 0 && (_.size(DuAn) > 0 || Child) && nvDuAn.id_nv ? false : true}
                        onPress={() => {
                            this._CreateCongViec()
                        }}
                        style={{
                            borderColor: '#D1D1D1', borderWidth: 0.3, marginBottom: Height(27),
                            marginLeft: 10, marginRight: 10, borderRadius: 10,
                            height: Height(6), justifyContent: 'center',
                            alignItems: 'center', backgroundColor: tencongviec.length > 0 && (_.size(DuAn) > 0 || Child) && nvDuAn.id_nv ? colors.colorJeeNew.colorChuDao : "#65676B",
                        }}>
                        {Child && !this.FromDuAn ? <Text style={{ fontSize: sizes.sText14, color: 'white', fontWeight: 'bold' }}>{RootLang.lang.JeeWork.taocongviecconmoi}</Text> :
                            <Text style={{ fontSize: sizes.sText14, color: 'white', fontWeight: 'bold' }}>{RootLang.lang.JeeWork.taocongviecmoi}</Text>}
                    </TouchableOpacity>
                    <ActionSheet
                        ref={o => { this.ActionSheet = o }}
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
                </ScrollView>
            </View >
        )
    }

    handlePress = (indexAt) => {
        var index = this.ActionSheetDinhKem.state.index
        if (indexAt == 1) {
            this._XoaFile(index)
        }
        else null
    }

    handlePressVideo = (indexAt) => {
        var index = this.ActionSheetDinhKemVideo.state.index
        if (indexAt == 1) {
            this._XoaVideo(index)
        }
        else null
    }

    _CreateCongViec = async () => {
        // this.setState({ isLoading: true })
        this.refLoading.current.show()

        var { DateDeadline, DateStart, DuAn, files, images, nvDuAn, mota, piority, tencongviec, Child, project, id_parent, nvDuAnTheoDoi, video, Tags, Estimate } = this.state
        var Attachments = [...images, ...files, ...video]
        var id_project_team = Child ? project.id_project_team : DuAn.id_row
        var id_parent = Child ? id_parent : 0
        var bodyNvDuAn = [{ loai: nvDuAn.loai, id_user: nvDuAn.id_nv }]
        var bodyNvDuAnTheoDoi = nvDuAnTheoDoi.map((x) => ({ loai: x.loai, id_user: x.id_nv, }))
        var Users = [...bodyNvDuAn, ...bodyNvDuAnTheoDoi]
        var DataTags = Tags.map((val, index) => {
            return {
                "id_row": index, "id_work": 0, "id_tag": val.id_row
            }
        })
        var body = {
            "title": tencongviec,
            "id_project_team": id_project_team,
            "Users": Users,
            "Attachments": Attachments,
            "description": mota,
            "clickup_prioritize": 1,
            "id_parent": id_parent,
            "prioritize": 0,
            "IsToDo": 1,
            "Tags": DataTags,

        }
        var deadline = { "deadline": moment(DateDeadline, "YYYY-MM-DD HH:mm:ss").add(-7, 'hours').format("YYYY-MM-DD HH:mm:ss") };
        var dateStart = { "start_date": moment(DateStart, "YYYY-MM-DD HH:mm:ss").add(-7, 'hours').format("YYYY-MM-DD HH:mm:ss") };
        var urgent = { "urgent": piority.row }
        var Est = { "estimates": Estimate }

        if (parseFloat(Estimate) > 0) {
            body = { ...body, ...Est }
        }
        if (DateDeadline) {
            body = { ...body, ...deadline }
        }
        if (DateStart)
            body = { ...body, ...dateStart }
        if (_.size(piority) > 0) {
            body = { ...body, ...urgent }
        }
        body = JSON.stringify(body)
        const res = await postTaoCongViec(body)
        if (res.status == 1) {
            // this.setState({ isLoading: false })
            this.refLoading.current.hide()
            Utils.showMsgBoxYesNo(this, RootLang.lang.JeeWork.thongbao, RootLang.lang.JeeWork.taocongviecmoithanhcongbancomuon, RootLang.lang.JeeWork.taocongviecmoi, RootLang.lang.JeeWork.thoat, () => {
                this.setState({
                    DateDeadline: '',
                    DateStart: '',
                    DuAn: [],
                    files: [],
                    video: [],
                    images: [],
                    nvDuAn: [],
                    nvDuAnTheoDoi: [],
                    mota: '',
                    piority: { row: 0, name: RootLang.lang.JeeWork.khongcodouutien, color: "grey" },
                    tencongviec: '',
                })
            }, () => { this._goBack() }
            )
        }
        else {
            // this.setState({ isLoading: false })
            this.refLoading.current.hide()
            this.setState({
                DateDeadline: '',
                DateStart: '',
                DuAn: [],
                files: [],
                images: [],
                video: [],
                nvDuAn: [],
                nvDuAnTheoDoi: [],
                mota: '',
                piority: { row: 0, name: RootLang.lang.JeeWork.khongcodouutien, color: "grey" },
                tencongviec: '',
            })
            UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, res.error ? res.error.message : RootLang.lang.JeeWork.loitaocongviecvuilong, 2)
        }
    }

    render() {
        const { opacity } = this.state
        const { collapsed } = this.state;
        return (
            <View style={{ flex: 1, backgroundColor: `transparent`, justifyContent: 'flex-end' }}>

                <Animated.View
                    onTouchEnd={this._goBackEnd}
                    style={{
                        position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
                        backgroundColor: colors.backgroundModal, alignItems: 'flex-end',
                        opacity

                    }} />

                <View
                    ref={ref => (this.viewRef = ref)}

                    style={[
                        styles.wrapSwipe,
                        {
                            backgroundColor: 'white',
                        },
                        // !this._itemMini() && collapsed && {},
                    ]}
                >
                    {collapsed ? (
                        this._itemMini()
                    ) : (
                        this._itemFull()
                    )}
                </View>
                <IsLoading ref={this.refLoading} />
                <ActionSheetCus
                    ref={o => { this.ActionSheetDinhKem = o }}
                    title={RootLang.lang.JeeWork.bancomuonthuchien}
                    options={[
                        RootLang.lang.JeeWork.huy,
                        <Text style={{ color: 'red', fontSize: 18 }}>{RootLang.lang.JeeWork.xoafiledinhkem}</Text>
                    ]}
                    cancelButtonIndex={CANCEL_INDEX}
                    destructiveButtonIndex={2}
                    onPress={this.handlePress}
                />
                <ActionSheetCus
                    ref={o => { this.ActionSheetDinhKemVideo = o }}
                    title={RootLang.lang.JeeWork.bancomuonthuchien}
                    options={[
                        RootLang.lang.JeeWork.huy,
                        <Text style={{ color: 'red', fontSize: 18 }}>{'Xoá video đính kèm'}</Text>
                    ]}
                    cancelButtonIndex={CANCEL_INDEX}
                    destructiveButtonIndex={2}
                    onPress={this.handlePressVideo}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    wrapSwipe: {
        backgroundColor: '#ccc',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    }
});

const mapStateToProps = state => ({
    lang: state.changeLanguage.language,
    reducerBangCong: state.reducerBangCong
});
export default Utils.connectRedux(TaoGiaoViec, mapStateToProps, true)
