
//******CHÚ Ý ********/
//Xem file Note_FixCAM_IosAndroid.js và kiểm tra trước khi build.
//********************/

import LottieView from 'lottie-react-native';
import React, { PureComponent } from 'react';
import {
    ActivityIndicator, BackHandler, Dimensions,
    Image, Linking, PermissionsAndroid, Platform, StyleSheet, Text, TouchableOpacity, View
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import RNFS from 'react-native-fs';
import Geolocation from 'react-native-geolocation-service';
import OneSignal from 'react-native-onesignal';
import { openSettings } from 'react-native-permissions';
import Tts from 'react-native-tts';
import apiAI from '../../../../apis/apiAI';
import { CheckToken, updateCheDoMCC } from '../../../../apis/apiControllergeneral';
import { getAddressGG, updateStatusFaceID, updateStatusFaceID_EM } from '../../../../apis/apiDuLieuChamCong';
import { CheckInOutDetect, CheckInOut_Location, CheckInOut_LocationCCNV, CheckInOut_LocationMCC, CheckLocation, WriteLog } from '../../../../apis/apiUser';
import { appConfig } from '../../../../app/Config';
import { RootLang } from '../../../../app/data/locales';
import { nGlobalKeys } from '../../../../app/keys/globalKey';
import { nkey } from '../../../../app/keys/keyStore';
import Utils from '../../../../app/Utils';
import UtilsApp from '../../../../app/UtilsApp';
import { Images } from '../../../../images';
import { colors } from '../../../../styles';
import { nstyles, paddingTopMul, Width } from '../../../../styles/styles';
import ModalConfirmPass from './ModalConfirmPass';
import apiViettelMaps from '../../../../apis/apiViettelMaps';
import { ROOTGlobal } from '../../../../app/data/dataGlobal';
import { isIphoneX } from 'react-native-iphone-x-helper';
import moment from 'moment'




const Permissions = require('react-native-permissions');
const { width, height } = Dimensions.get('screen');
const ASPECT_RATIO = width / height;
const LONGITUDE = 106.6228077;
const LATITUDE = 10.8123274;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const TIME_FRAME = Platform.OS == 'ios' ? 800 : 800;
const TIMEOUT_SEND = 7;
const MODE_TEST_DEV = false;

//--StatusFace: SMILE, CLOSE_EYES, TILT_LEFT, TILT_RIGHT, ROTATE_LEFT, ROTATE_RIGHT


class CameraDiemDanhNew extends PureComponent {
    constructor(props) {
        super(props)
        StatusFace = {
            "SMILE": RootLang.lang.scchamcong.cuoi,
            "NOSMILE": RootLang.lang.scchamcong.khongcuoi,
            "CLOSE_EYES": RootLang.lang.scchamcong.nhammat,
            "OPEN_EYES": RootLang.lang.scchamcong.nhammat,
            // "TILT_LEFT": 'Nghiêng đầu TRÁI',
            // "TILT_RIGHT": 'Nghiêng đầu PHẢI',
            "ROTATE_LEFT": RootLang.lang.scchamcong.quaydauquatrai,
            "ROTATE_RIGHT": RootLang.lang.scchamcong.quaydauquaphai
        }
        //isMode 1: Chấm công 1 người | 2: Chấm công nhân viên 
        this.isMode = Utils.ngetParam(this, 'isMode', 1);
        this.callback = Utils.ngetParam(this, 'callback', null);
        this.CapNhatLaiDuLieu = Utils.ngetParam(this, 'CapNhatLaiDuLieu', () => { })
        this.IdNV = 0;
        this.IdCty = 0;
        this.IdNVNew = Utils.ngetParam(this, 'IdNV', undefined)
        this.allowRegister = Utils.getGlobal(nGlobalKeys.allowRegister, true);
        this.sessionCheck = Date.now() + '_' + this.IdNV;
        this.isAlert = false;
        this.granted = '';
        this.dataFaceTemp = {};
        this.statusFace = '';
        this.isTimeOutFace = false; // hết thời gian check mặt mà ko đc thì cho thử lại
        this.countProcessing = []; // biến tạm để check khi nào chạy send hết frame cuối
        this.resultCount = 0; // biến kết quả để kiểm trả 2 hàm chạy 2 luồng.
        //--
        this.isCheckLocal = false;
        this.latlongLocation = '';
        this.latlongAddress = '';
        this.lat = '';
        this.long = '';
        //--
        this.isLoadApiLocation = false;
        this.onRunTimer = false;
        this.isHaveFace = false;
        this.isLoadHaveFace = 0;
        //--Gửi fame liên tục ko cần biết có Face hay ko. Sử dụng cho IOS do cam sau ko Hoạt động. (Hiện tại đã hoạt động nên = false)
        this.noFaceDetected = false //this.isMode == 2 && Platform.OS == 'ios' ? true : false;
        this.firstLoad = false;
        this.regisType = ""; //register - register
        this.frameNow = "";
        //--
        this.Rules_CheckCapcha = Utils.getGlobal(nGlobalKeys.isCheckCapcha, true); //*
        this.isReCapcha = false;
        this.arrSaveCapchaTemp = [];
        this.TimeNow = Utils.getGlobal(nGlobalKeys.DateUTCNow, '')
        //--
        this.state = {
            User: {
                HoTen: '',
                Image: undefined,
                MaNV: ''
            },
            latitude: LATITUDE,
            longitude: LONGITUDE,
            cameraType: this.isMode == 2 ? true : false, // Nếu true - back , false - front 
            mirrorMode: true,
            delRegister: false,
            textGoiY: RootLang.lang.scchamcong.vuilongdatkhuonmattrongkhungxanh,
            isCheckFace: 0, //-1: trang thai dk, -2: trang thai cham cong, 0: tắt, 1: đăng ký, 2: check chấm công
            isLoad: false,
            isShowRefreshLocation: false,
            showLocation: false,
            status: "",
            isRecord: true,
            isDangKy: false,
            nameLocation: '',
            DateUTCNow: undefined
        }
        //tắt chấm công nhanh
        // this.Shorcut_ChuyenVao = Utils.ngetParam(this, 'Shorcut_ChuyenVao', false);
        // this.CN_chamcong = Utils.getGlobal(nGlobalKeys.CN_chamcong, false);
        // this.ChamCongNhanh = false;
    }

    async componentDidMount() {
        if (this.IdNVNew) {
            this.IdNV = this.IdNVNew
        } else {
            this.IdNV = await Utils.ngetStorage(nkey.Id_nv, '')
        }
        this.IdCty = await Utils.ngetStorage(nkey.IDKH_DPS, 0)
        //tắt chấm công nhanh
        // this.ChamCongNhanh = await Utils.ngetStorage(nkey.quickChamCong, false)
        this.isMode == 3 ? null : Utils.nsetStorage(nkey.isModeMayChamCong, false);
        await Permissions.check('ios.permission.CAMERA')
            .then(res => {
                if (res == 'blocked')
                    return this.onGoSetingCamera()
                else null
            });
        // alert(Object.keys(StatusFace)[0])

        Platform.OS == 'ios' ? await Permissions.request('ios.permission.LOCATION_WHEN_IN_USE').then(async res => {
            if (res == "blocked") {
                this.onGoSeting()
            }
            else this.onGetFrame(null)

        }) : this.onGetFrame(null)
        this.kiemTraQuyenViTri();
        this.backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            this.backAction
        );
        this.setState({})
        // await this.onGetFrame(null)
        if (this.isMode == 3) {
            let res = await updateCheDoMCC();
            Utils.nsetStorage(nkey.isModeMayChamCong, true);
            //-removeOnsignal khi chuyển qua chế độ Máy chấm công.
            // UtilsApp.logOutOneSignal(this, false);
            // OneSignal.init('000000-0000000-000000');
            // OneSignal.removeEventListener('received');
            // OneSignal.removeEventListener('opened');
            // OneSignal.removeEventListener('ids');
        }
        Tts.setDefaultLanguage('en-US');

    }

    backAction = () => {
        // ROOTGlobal.GetDuLieuChamCong.GetDLCC()
        this.callback == null ? null : this.callback()
        this.CapNhatLaiDuLieu()
    };

    async componentWillUnmount() {

        this.backHandler.remove();
        this.onClearTimer();
    }

    onGoSetingCamera = () => {
        Utils.showMsgBoxYesNo(this, RootLang.lang.scchamcong.xinquyencamera, RootLang.lang.scchamcong.chophepsudungcamera,
            RootLang.lang.scchamcong.chuyentoicaidat, RootLang.lang.scchamcong.khongcamon,
            async () => {
                if (Platform.OS == 'ios') {
                    Linking.openURL('app-settings:').catch((err) => {
                        Utils.nlog('app-settings:', err);
                    });
                }
                else
                    openSettings();
            })
    }


    onSpeaker = (text) => {
        if (!text || text == '' || this.isMode == 1)
            return;
        Tts.getInitStatus().then(async () => {
            Tts.setDucking(true);
            Tts.speak(text, {
                rate: 0.58 //IOS only
            });
        });
    }

    onClearTimer = () => {
        clearInterval(this.camtake);
        this.onRunTimer = false;
    }

    onGetFrame = async (isRegis = false) => {
        var { isRecord } = this.state
        if (this.isLoadHaveFace == 0 && isRegis == false && !this.noFaceDetected || this.frameNow == "" && isRegis != null) {
            return;
        }
        if (this.regisType == "register" && this.countProcessing.length != 0 && isRegis)
            return;
        if (MODE_TEST_DEV) {
            this.setState({ imgTemp: "data:image/png;base64," + this.frameNow });
        }
        this.isLoadHaveFace = 0;
        if (this.countProcessing.length + 1 >= TIMEOUT_SEND && !isRegis)
            this.isTimeOutFace = true;
        if (this.isTimeOutFace) {
            this.onClearTimer();
        }
        if (this.camera) {
            // const options = { quality: 0.16, base64: false, mirrorImage: true };
            if (isRegis != null && this.state.status == 'not_existed' && isRecord == true) { //--xử lý get Frame IMG để gửi đi
                //--Xử lý send Frame face các lần sau.
                this.setState({ isDangKy: true })
                this.countProcessing.push(1);
                let indexTemp = this.countProcessing.length;
                const { uri, codec = 'mp4' } = await this.camera.recordAsync({
                    maxDuration: 5,
                    orientation: "portrait",
                    mute: true,
                    quality: "720p",
                })
                RNFS.readFile(uri, 'base64')
                    .then(res => {
                        this.onSendAPI_Face(isRegis, res, indexTemp - 1);
                    })
                    .catch(err => {
                        Utils.nlog('read error')
                        Utils.nlog(err)
                    })

                //----
                return;
            }
            else {
                this.countProcessing.push(1);
                let indexTemp = this.countProcessing.length;
                this.onSendAPI_Face(isRegis, this.frameNow, indexTemp - 1);
                //----
                return;
            }

            //--Xử lý check lần đầu xem đã ĐK chưa
            // this.onSendAPI_Face(isRegis, '');
        }
    };

    reCheckRegister = async (timeout = 10) => {
        this.sessionCheck = Date.now() + '_' + this.IdNV;
        let resFace = {};
        //--api check or SendSocket
        resFace = await apiAI.sendFrameForm(this.sessionCheck, "",
            (this.isMode == 1 ? this.IdNV : -1), this.IdCty, 'recognizer');
        if (resFace < 0 || resFace.status == "0")
            return 0;

        if (resFace.status == "1" && resFace.data.status == "on-register") {
            await Utils.PendingPromise(1000);
            if (timeout == 0)
                return -1;
            return this.reCheckRegister(timeout - 1);
        }
        if (resFace.status == "1" && (resFace.data.status == "not_existed"
            || resFace.data.status == "not_existed_company"))
            return 0;
        return 1;
    }

    onSendAPI_Face = async (isRegis, dataImg = "", indexProcessing = 0) => {
        let resFace = {};
        //--api check or SendSocket
        // console.log("BASE64:", dataImg)
        resFace = await apiAI.sendFrameForm(this.sessionCheck, dataImg,
            (this.isMode == 1 ? this.IdNV : -1), this.IdCty, (isRegis && this.state.isRecord == true ? "register" : isRegis && this.state.isRecord == false ? "register_image" : 'recognizer'));
        console.log("DETTECT_AI:", resFace)
        this.firstLoad = true;
        if (this.countProcessing.length != 0)
            this.countProcessing[indexProcessing] = 0;

        try {
            Utils.nlog('FACE - OK:', resFace.data.status);
        } catch (error) {
        }

        if (resFace < 0 || resFace.status == "0") {
            // this.onClearTimer();
            if (this.isMode != 1 || !this.isRegis && this.state.isCheckFace == 2) {
                this.statusFace = RootLang.lang.scchamcong.coloixayrakhixacthuckhuonmat;
                this.setState({ a: Date.now() });
            }
            else
                this.onResultCheck(RootLang.lang.thongbaochung.canhbao, RootLang.lang.scchamcong.coloixayrakhixacthuckhuonmat,
                    RootLang.lang.thongbaochung.thoat);
            return;
        }

        if (resFace.status == "1") {
            if (resFace.data.status == "received" && isRegis != null) {
                this.onResultCheck("", "");
                return;
            }
            this.onClearTimer();
            if (isRegis) { //--Đăng ký Face
                setTimeout(async () => {
                    switch (resFace.data.status) {
                        case "register_done":
                            this.setState({ status: '' })
                            if (this.isAlert)
                                break;
                            //----code
                            if (this.regisType == 'register') {
                                let isReCheckRegis = await this.reCheckRegister();
                                if (isReCheckRegis <= 0) {
                                    this.setState({ isCheckFace: -1 });
                                    WriteLog('[DK]' + 'Try_again');
                                    if (isReCheckRegis == 0) {

                                        this.onResultCheck(RootLang.lang.scchamcong.xinvuilongguidangkylai,
                                            this.state.isRecord == true ? "Vui lòng xoay khuôn mặt từ từ để có thể lấy được nhiều góc" : RootLang.lang.scchamcong.khongthenhandienkhuonmat,
                                            'OK', false, true);

                                        let kqDelFace = await apiAI.delRegisFace(this.IdNV, this.IdCty);
                                        Utils.nlog("delRegisFace:", kqDelFace);
                                        if (kqDelFace && kqDelFace.status == "1") {
                                            this.setState({ cameraType: !this.state.cameraType, isDangKy: false }, () => {
                                                this.onGetFrame(null)
                                                setTimeout(() => {
                                                    this.setState({ cameraType: !this.state.cameraType })
                                                }, 500);

                                            })
                                        }


                                    }
                                    if (isReCheckRegis == -1) {
                                        this.onResultCheck(RootLang.lang.thongbaochung.canhbao,
                                            RootLang.lang.scchamcong.quatrinh_giaylat, 'OK', false, true);
                                        this.setState({ cameraType: !this.state.cameraType }, () => {
                                            this.onGetFrame(null)
                                            setTimeout(() => {
                                                this.setState({ cameraType: !this.state.cameraType })
                                            }, 500);
                                        })
                                    }
                                    setTimeout(() => {
                                        this.setState({ isCheckFace: -1 });
                                        this.frameNow = "";
                                        this.isHaveFace = false;
                                        this.isLoadHaveFace = 0;
                                    }, 500);
                                    return;
                                }
                                WriteLog('[DK]' + 'OK');
                            }
                            this.isAlert = true;
                            let kqDK = await this.updateDaDangKy(this.IdNV);
                            //--Xoa face AI khi update trang thai that bai
                            if (!kqDK) {
                                let kqDelFace = false;
                                kqDelFace = await apiAI.delRegisFace(this.IdNV, this.IdCty);
                                Utils.nlog('kqDelFace:', kqDelFace);
                                if (kqDelFace && kqDelFace.status == "1" && kqDelFace.data.status == "success")
                                    kqDelFace = true;
                                if (!kqDelFace)
                                    alert(RootLang.lang.scchamcong.xoadangkykhuonmatthatbai);
                            }
                            //---
                            this.statusFace = (this.callback == null || !kqDK) ? this.state.textGoiY : '';
                            if (kqDK) {
                                this.setState({ cameraType: !this.state.cameraType }, () => {
                                    setTimeout(() => {
                                        this.setState({ cameraType: !this.state.cameraType })
                                    }, 500);
                                })
                                this.setState({ isCheckFace: this.callback == null ? -2 : 0 });
                                if (this.callback == null) {
                                    this.kiemTraQuyenViTri();
                                }
                                this.onGetFrame(null)
                            } else {
                                this.setState({ isCheckFace: -1 });
                            }
                            break;
                        case "existed":
                            try {
                                this.onResultCheck(RootLang.lang.thongbaochung.canhbao, RootLang.lang.scchamcong.nhanviennaydaduocdangky);
                                this.setState({ cameraType: !this.state.cameraType }, () => {
                                    setTimeout(() => {
                                        this.onGetFrame(null)
                                        this.setState({ cameraType: !this.state.cameraType })
                                    }, 500);
                                })
                            } catch (error) {
                                Utils.nlog('errro', error)
                            }


                            break;
                        default:
                            try {
                                this.setState({ cameraType: !this.state.cameraType }, () => {
                                    setTimeout(() => {
                                        this.onGetFrame(null)
                                        this.setState({ cameraType: !this.state.cameraType })
                                    }, 500);
                                })
                            }
                            catch (error) {
                                Utils.nlog('errro', error)
                            }
                            break;



                    }
                }, this.regisType == 'register' ? 3000 : 200);
                return;
            }
            //--Check Face đã đăng ký chưa. Check lần đầu khi mở app
            if (isRegis == null) {
                this.statusFace = '[textGoiY]';
                var tempIsCheckRegis = true;
                if ((resFace.data.status == "not_existed" || resFace.data.status == "not_existed_company") && this.isMode == 1) {
                    tempIsCheckRegis = (this.allowRegister && this.callback == null || this.callback != null);
                    if (tempIsCheckRegis) {
                        this.regisType = "register"; //register -or- register;
                        this.setState({
                            isCheckFace: -1,
                            textGoiY:
                                this.regisType == "register" && this.state.isRecord == true
                                    ? RootLang.lang.thongbaochung.vuilongtronglucdangkyxoaymatnhieuhuongdecothedenhanrakhichamcong
                                    : this.regisType == "register" && this.state.isRecord == false
                                        ? RootLang.lang.scchamcong.vuilonggiuthangkhuonmattrongkhungxanh
                                        : RootLang.lang.scchamcong.vuilongxoaykhuonmattrongkhungxanh
                        }); // chế độ đăng ký
                        if (resFace.data.status == "not_existed") {
                            this.setState({ status: "not_existed" })
                        }
                    }
                    else {
                        UtilsApp.MessageShow("Thông báo", "Bạn không có quyền đăng ký khuôn mặt", 4)
                        Utils.goback(this, null)
                    }
                    return resFace.data.status

                }
                else {
                    //--Cập nhât JEEHR nếu đã ĐK AI lần đầu mở 
                    if (this.isMode == 1)
                        this.updateDaDangKy(this.IdNV, true, true);
                    //----
                    this.setState({
                        isCheckFace: -2, textGoiY: RootLang.lang.scchamcong.vuilongdatkhuonmattrongkhungxanh,
                        delRegister: true
                    },
                        //tắt chấm công nhanh
                        // await this.ChamCongNhanh == true || this.Shorcut_ChuyenVao == true || this.CN_chamcong == true ? this.onChamCongFace : null
                    ); // chế độ chấm công
                    if (Platform.OS == 'ios')
                        this.kiemTraQuyenViTri();
                    else
                        this.onTimer_Locations(1);
                }
                if (tempIsCheckRegis)
                    return;


            }
            //--Send frame kiểm tra chấm công
            switch (resFace.data.status) {
                case "recognizer_done":
                    if (this.isAlert || this.isCheckLocal)
                        break;

                    this.isReCapcha = true && this.Rules_CheckCapcha && this.isMode == 1; //--code phân quyền ở đây(nếu có)
                    this.resultCount++;
                    await WriteLog('[CC]' + 'OK');
                    this.onResultCheck("", "");
                    //-- //resFace.data.recognized_id
                    if (this.isMode == 1)
                        this.onCheckLocation(isRegis, dataImg, 1) // Check kết quả local bất đồng bộ 
                    else
                        this.onCheckLocation(isRegis, dataImg, this.isMode, resFace.data.recognized_id) // Check kết quả local bất đồng bộ 
                    //--
                    break;
                default:
                    if (this.isMode == 1) {
                        this.statusFace = '[textGoiY]';
                        this.setState({ isCheckFace: -2 });
                    }
                    let textMsg = "";
                    if (resFace.data.status == "not_existed" || resFace.data.status == "not_existed_company") {
                        textMsg = RootLang.lang.scchamcong.taikhoannaychuadkkhuonmatchamcong;
                    }
                    if (resFace.data.status == "mask_detected")
                        textMsg = RootLang.lang.scchamcong.khongthenhandienkhibandeokhautrang;
                    if (resFace.data.status == "cheat_detected")
                        textMsg = RootLang.lang.scchamcong.canhbaophathienbandanggianlan;

                    if (textMsg != "")
                        this.onResultCheck(RootLang.lang.thongbaochung.canhbao, textMsg, 'OK', this.isMode == 1 ? true : false);
                    else
                        this.onResultCheck(RootLang.lang.scchamcong.chamcongthatbai, RootLang.lang.scchamcong.khongthenhandienkhuonmatnay, 'OK', false);
                    break;
            }
        }

    }

    updateDaDangKy = async (IdNV, isDK = true, isBackground = false) => {
        let res = {};
        if (this.callback == null)
            res = await updateStatusFaceID_EM(isDK);
        else
            res = await updateStatusFaceID(IdNV, isDK);
        if (isBackground) //Chế độ chạy ngầm
            return;
        Utils.nlog("updateStatusFaceID:", res);
        if (res < 0 || !res || res.status == 0) {
            this.onResultCheck(RootLang.lang.thongbaochung.canhbao,
                RootLang.lang.scchamcong.capnhattrangthaidangkythatbai, 'OK', this.callback == null ? false : true, true);
            return false;
        }
        if (res.status == 1) {
            if (isDK) {
                //--Cho xem lại ảnh đã Đăng Kỹ
                Utils.PendingPromise(500);
                let res2 = await apiAI.getFaceRegister(IdNV, this.IdCty);
                // dóng code dòng 520- 531
                Utils.nlog('getFaceRegister', res2);
                this.dataMsgBox = {};
                if (res2 && res2.status == "1" && res2.data.frames.length != 0)
                    this.dataMsgBox.img = 'data:image/jpg;base64,' + res2.data.frames[0].face;
                else
                    this.dataMsgBox.img = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Image_of_none.svg/1200px-Image_of_none.svg.png';
                //--------
                this.onResultCheck(RootLang.lang.thongbaochung.thongbao,
                    RootLang.lang.scchamcong.dangkykhuonmatthanhcong, 'OK', this.callback == null ? false : true, true);
            }

            return true;
        }
    }

    onCheckCapcha = (keyCapcha, tempIndex, apiSaveChamCong = () => { }, limidCheck = 7) => {
        //Tối đa limidCheck: 7 = 3.5s
        if (limidCheck == 0) {
            //--code: Xác thực thất bại
            if (!this.isXT_OK)
                this.statusFace = RootLang.lang.scchamcong.xacthucthatbai;
            this.isReCapcha = false;
            this.isTimeOutFace = true;
            this.isLoadApiLocation = false;
            this.countProcessing[tempIndex] = 0;
            this.setState({ a: Date.now() });
            setTimeout(() => {
                this.onRestartChamCong(true);
            }, 500);
            //--
            return;
        }
        setTimeout(async () => {
            //--Code Capcha
            let isChopMat = keyCapcha == "CLOSE_EYES" || keyCapcha == "OPEN_EYES";
            let isXacThuc = isChopMat ? this.arrSaveCapchaTemp.includes("CLOSE_EYES") && this.arrSaveCapchaTemp.includes("OPEN_EYES")
                : this.arrSaveCapchaTemp.includes(keyCapcha)
            if (isXacThuc) {
                this.isXT_OK = true;
                this.statusFace = RootLang.lang.scchamcong.xacthucthanhcong;
                this.isReCapcha = false;
                apiSaveChamCong();
            }
            //--end capcha--
            if (!this.isXT_OK)
                this.onCheckCapcha(keyCapcha, tempIndex, apiSaveChamCong, limidCheck - 1);
        }, 500);
    }

    onCheckLocation = async (isRegis, base64, mode = 1, IdNV_AI = -1) => {
        //--Code Capcha
        this.statusFace = RootLang.lang.scchamcong.daxacthuckhuonmat;
        let keyCapcha = "";
        if (this.isReCapcha) {
            while (true) {
                let tempRandom = Math.floor(Math.random() * Object.keys(StatusFace).length);
                keyCapcha = Object.keys(StatusFace)[tempRandom];
                if (!this.detectionFaceStatusNow.includes(keyCapcha))
                    break;
            }

            this.statusFace = RootLang.lang.scchamcong.xacthuc_vuilong + StatusFace[keyCapcha].toUpperCase();
        }
        //--
        this.setState({ isCheckFace: 0 });
        if (!this.isCheckLocal && isRegis == false && this.isMode == mode) { // Check kết quả local bất đồng bộ 
            //--impotant - Bắt đầu lưu API JeeHR
            this.isCheckLocal = true;
            this.countProcessing.push(1);
            let tempIndex = this.countProcessing.length - 1;
            this.isLoadApiLocation = true;
            //-----
            //--Khai báo để dùng chung
            let apiSaveChamCong = async () => {
                await this.onCheckLocal(base64, this.latlongLocation, tempIndex, IdNV_AI);
                this.isLoadApiLocation = false;
                this.setState({ a: Date.now() });
            }
            //--
            if (this.isReCapcha)
                //tắt chấm công nhanh
                // this.onCheckCapcha(keyCapcha, tempIndex, apiSaveChamCong, this.ChamCongNhanh == true || this.Shorcut_ChuyenVao == true || this.CN_chamcong == true ? 10 : null);
                this.onCheckCapcha(keyCapcha, tempIndex, apiSaveChamCong);
            else {
                apiSaveChamCong();
            }
        }
    }

    onRestartChamCong = (isXacThuc = false) => {
        if (this.isTimeOutFace && !this.countProcessing.includes(1) && this.countProcessing.length != 0 && this.resultCount < 3) {
            this.onClearTimer();
            this.statusFace = RootLang.lang.scchamcong.xinvuilongthulai;
            if (!isXacThuc)
                WriteLog('[CC]' + 'Try_again');
            this.onSpeaker('Please try again');
            this.setState({ a: Date.now(), isCheckFace: this.isMode == 1 || this.noFaceDetected ? -2 : 2 });
            if (this.isMode != 1 && !this.noFaceDetected)
                setTimeout(() => {
                    this.onChamCongFace();
                }, 1800);
        }
    }

    onResultCheck = (title, msg, btnOK = 'OK', isBack = true, allwayShow = false) => {
        if (title == "" && msg == "") {
            if (this.resultCount >= 3 && !this.isAlert) {
                this.isAlert = true;
                this.statusFace = '';
                if (this.noFaceDetected) {
                    this.statusFace = '...';
                    this.setState({ isCheckFace: -2 });
                }
                else
                    this.setState({ a: Date.now() });
                this.onSpeaker('OK Thank you');
                this.onShowAlert((this.isMode == 1 ? '' : this.dataName + ' ') + RootLang.lang.scchamcong.daguichamcong,
                    RootLang.lang.thongbaochung.xacnhan, btnOK, this.isMode == 1 ? true : false);
            }

            this.onRestartChamCong();
            return;
        }
        if (!this.isAlert || allwayShow) {
            this.isAlert = true;
            if (title != "" && msg != "")
                this.onShowAlert(title, msg, btnOK, isBack);
        }
    }

    onShowAlert = (title, msg, btnOK = 'OK', isBack = true, status = 1) => {
        if (this.Shorcut_ChuyenVao == true) {
            Utils.showMsgBoxOKScreen(this, title, msg, btnOK,
                () => {
                    if (isBack && this.isMode != 3) {
                        this.CapNhatLaiDuLieu()
                        // ROOTGlobal.GetDuLieuChamCong.GetDLCC()
                        this.Shorcut_ChuyenVao == true ? Utils.goscreen(this, "sw_HomePage") : Utils.goback(this);
                        if (this.callback != null)
                            this.callback();
                    }
                })
        } else {
            if (title == 'Cảnh báo' || status != 1) {
                UtilsApp.MessageShow(title, msg, 2)
            } else {
                UtilsApp.MessageShow(title, msg, 1)
            }
            if (isBack && this.isMode != 3) {
                this.CapNhatLaiDuLieu()
                // ROOTGlobal.GetDuLieuChamCong.GetDLCC()
                this.Shorcut_ChuyenVao == true ? Utils.goscreen(this, "sw_HomePage") : Utils.goback(this);
                if (this.callback != null)
                    this.callback();
            }
        }
        if (!isBack && this.isMode != 1 && !this.noFaceDetected)
            setTimeout(() => {
                this.onChamCongFace();
                if (this.isMode == 1)
                    Utils.goscreen(this, 'sc_ChamCongCamera', { isMode: 1 });
                if (this.isMode == 2)
                    Utils.goscreen(this, 'sc_ChamCongNhanVien', { isMode: 2 });
                if (this.isMode == 3)
                    Utils.goscreen(this, 'sc_MayChamCong');
            }, 2200);
    }

    onSendFrame = async (isRegis = false) => {
        this.sessionCheck = Date.now() + '_' + this.IdNV;
        this.resultCount = 0;
        this.countProcessing = [];
        if (this.camera) {
            this.isAlert = false;
            this.isTimeOutFace = false;
            this.statusFace = '...';
            this.setState({ isCheckFace: isRegis ? 1 : 2, a: Date.now() }, () => {
                this.onGetFrame(isRegis);
                this.camtake = setInterval(() => this.onGetFrame(isRegis), TIME_FRAME);
            });
        }
    };
    onDangKyFace = () => {
        this.onSendFrame(true);
    };

    onChamCongFace = async () => {
        if (this.state.isCheckFace == 1 || this.state.isCheckFace == -1)
            return;
        if (this.onRunTimer && !this.countProcessing.includes(1) && this.countProcessing.length != 0)
            this.onRunTimer = false;
        if (this.onRunTimer)
            return;
        this.onClearTimer();
        this.onRunTimer = true;
        this.isCheckLocal = false;
        this.onSendFrame();
    };

    onTakePicture = async () => { // Chức năng để test tạm ko XOÁ
        if (MODE_TEST_DEV) {
            this.setState({ imgTemp: "data:image/png;base64," + this.frameNow });
        }
        //--or--
        // this.isLoadHaveFace = 1;
        // this.onGetFrame();
    };

    getTimeServer = async () => {
        let res = await CheckToken();
        // console.log("RES--------:", res)
        if (res.status == 1) {
            Utils.setGlobal(nGlobalKeys.DateUTCNow, res.DateUTCNow);
            this.setState({ DateUTCNow: res.DateUTCNow })
        } else {
            this.setState({ DateUTCNow: undefined })
        }
        return true
    }
    onCheckLocal = async (strBase64, stLocation, indexProcessing = -1, IdNV_AI = -1) => {
        this.getTimeServer().then(async (val) => {
            if (val) {
                let timeDate = this.state.DateUTCNow ? this.state.DateUTCNow : this.TimeNow
                let checkSum = `{"IdNV":${this.isMode == 1 ? this.IdNV : IdNV_AI},"DateTime":"${timeDate}"}` + appConfig.codeDetect
                // console.log("checkSum:---------:", checkSum)
                if (stLocation != '') {
                    let res = {};
                    if (this.isMode == 1) {
                        res = await CheckInOutDetect(strBase64, stLocation, this.IdNV, this.state.nameLocation, timeDate, checkSum, false);
                    }
                    if (this.isMode == 2)
                        res = await CheckInOutDetect(strBase64, stLocation, IdNV_AI, this.state.nameLocation, timeDate, checkSum, false);
                    if (this.isMode == 3)
                        res = await CheckInOutDetect(strBase64, stLocation, IdNV_AI, this.state.nameLocation, timeDate, checkSum, true);
                    if (indexProcessing >= 0)
                        this.countProcessing[indexProcessing] = 0;
                    if (res.status == 1) {
                        this.dataName = res.data ? res.data : ''
                        this.resultCount += 2;
                        this.onResultCheck("", "");
                    } else {
                        this.onSpeaker('Please try again');
                        this.onShowAlert((res.error && res.error.message ? res.error.message :
                            RootLang.lang.scchamcong.guichamcongthatbai), "", RootLang.lang.scchamcong.dongy, this.isMode == 1 ? true : false, res.status == 1 ? 1 : 0)
                    }
                }
            }
        })


    }

    onTimer_Locations = (time = 0) => {
        if (time == 0 || this.granted != "")
            return;
        setTimeout(() => {
            if (this.granted != "")
                return;
            //--code xu ly
            this.kiemTraQuyenViTri();
            //---------
            this.onTimer_Num(time - 1);
        }, 2000);
    }

    isCheckLocation = async () => {
        let res = await CheckLocation(this.latlongLocation, this.IdNV);
        Utils.nlog('CheckLocation:', res, this.latlongLocation)

        if (!res || res < 0)
            return true;
        if (res.status == 1) {
            let resMap = await apiViettelMaps.getAddressViettel(this.lat, this.long)
            if (resMap) {
                this.setState({ nameLocation: resMap.full_address })
            }

            return res;
        } else {
            try {
                UtilsApp.MessageShow(RootLang.lang.thongbaochung.canhbao, res.error.message, 4)
            } catch (error) {
                UtilsApp.MessageShow(RootLang.lang.thongbaochung.canhbao, RootLang.lang.thongbaochung.loilaydulieu, 2)
            }
            return res;
        }
    }

    kiemTraQuyenViTri = async () => {
        if (this.isMode == 3) {
            this.latlongLocation = '0,0';
            this.setState({ a: Date.now() });
            return;
        }
        this.setState({ isLoad: true, isShowRefreshLocation: true });
        Geolocation.setRNConfiguration({ skipPermissionRequests: true, authorizationLevel: 'whenInUse' });
        Geolocation.requestAuthorization();
        if (Platform.OS == 'android') {
            this.granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
                title: RootLang.lang.scchamcong.cungcapvitri,
                message: RootLang.lang.scchamcong.dethuchienchamcong_hientaicuaban,
                buttonPositive: 'OK'
            })
            if (this.granted == 'never_ask_again') {
                this.onBack_Logout(50);
                setTimeout(() => {
                    this.onGoSeting();
                }, 1100);
            }
            if (this.granted == PermissionsAndroid.RESULTS.GRANTED) {
                Geolocation.getCurrentPosition(
                    async (position) => {
                        this.latlongLocation = `${position.coords.latitude},${position.coords.longitude}`;
                        this.lat = position.coords.latitude;
                        this.long = position.coords.longitude;
                        let istempCheck = await this.isCheckLocation();
                        if (this.state.showLocation)
                            this.onShowLocation(true);
                        else
                            this.setState({ isLoad: false, isCheckLocation: istempCheck });
                    },
                    error => {
                        Utils.nlog('error Location:', error);
                        this.latlongLocation = '';
                        this.setState({ isLoad: false });
                    },
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
                );
            } else {
                this.granted = 'off';
                this.latlongLocation = '';
            }
            // Utils.nlog('this.granted:', this.granted);
        }
        else {
            Geolocation.getCurrentPosition(
                async (position) => {
                    // Utils.nlog('geolocation-ios', JSON.stringify(position));
                    var { coords = {} } = position;
                    var { latitude, longitude } = coords;
                    if (!latitude || !longitude) {
                        this.onGoSeting();
                        this.latlongLocation = '';
                    } else {
                        this.granted = 'granted';
                        this.latlongLocation = `${latitude},${longitude}`;
                        this.lat = latitude;
                        this.long = longitude;
                        let istempCheck = await this.isCheckLocation();
                        if (this.state.showLocation)
                            this.onShowLocation(true);
                        else
                            this.setState({ isLoad: false, isCheckLocation: istempCheck });
                    }
                },
                (error) => {
                    this.onGoSeting();
                    Utils.nlog('error Location:', error);
                    this.latlongLocation = '';
                    this.setState({ error: error.message, isLoad: false });
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
            );
        }
    }

    onGoSeting = () => {
        this.granted = 'off';
        Utils.showMsgBoxYesNo(this, RootLang.lang.scchamcong.dichvuvitribitat, appConfig.TenAppHome + ' ' + RootLang.lang.scchamcong.cantruycapvitri_dienthoaicuaban,
            RootLang.lang.scchamcong.chuyentoicaidat, RootLang.lang.scchamcong.khongcamon,
            () => {
                if (Platform.OS == 'ios') {
                    this.onBack_Logout(200);
                    Linking.openURL('app-settings:').catch((err) => {
                        Utils.nlog('app-settings:', err);
                    });
                }
                else
                    openSettings();
            });
    }

    changeCameraType() {
        if (this.state.cameraType === true) {
            // this.noFaceDetected = false;
            this.setState({
                cameraType: false,
                mirrorMode: true
            });
        } else {
            // this.noFaceDetected = Platform.OS == 'ios';
            this.setState({
                cameraType: true,
                mirrorMode: false
            });
        }
    }

    onCheckEndFace_Android = (valFace = {}, timeOut = 0, isTrue = false, isIOS = false) => {
        if (Platform.OS == 'android' || isIOS) {
            setTimeout(() => {
                if (valFace.origin.x == this.dataFaceTemp.origin.x && valFace.origin.y == this.dataFaceTemp.origin.y
                    && valFace.size.width == this.dataFaceTemp.size.width && valFace.size.height == this.dataFaceTemp.size.height &&
                    (this.isLoadHaveFace == 1 && isIOS || this.isLoadHaveFace == 0 && !isIOS)) {
                    this.isHaveFace = false;

                    if (!(this.isMode == 1 && this.statusFace == RootLang.lang.scchamcong.xinvuilongthulai) && !this.isReCapcha) {
                        this.statusFace = '...';
                    }
                    this.setState({ a: this.isLoadHaveFace + '_' + this.isHaveFace });

                    this.onTimer_Num(10);
                    //-----------
                    // ko XOÁ
                    // this.setState({
                    //     dataFace: {
                    //         origin: { x: 0, y: 0 }, size: { width: 0, height: 0 }
                    //     }
                    // });
                }
                else if (isTrue)
                    this.onTimer_Num(1);
            }, timeOut);
        }
    }

    onCheckFaceStatus = (dataFace = {}) => {
        let resultCheck = [];
        if (dataFace.smilingProbability > 0.55)
            resultCheck.push('SMILE');
        else
            resultCheck.push('NOSMILE');

        if (dataFace.rightEyeOpenProbability < 0.4 && dataFace.leftEyeOpenProbability < 0.4)
            resultCheck.push('CLOSE_EYES');
        else
            resultCheck.push('OPEN_EYES');

        //Tạm bỏ do ko có tác dụng trong check Ảnh
        // if (dataFace.rollAngle < - 15)
        //     resultCheck.push(StatusFace.TILT_LEFT);
        // if (dataFace.rollAngle > 15)
        //     resultCheck.push(StatusFace.TILT_RIGHT);

        if (dataFace.yawAngle < -20)
            resultCheck.push(Platform.OS == 'ios' ? 'ROTATE_LEFT' : 'ROTATE_RIGHT');
        if (dataFace.yawAngle > 20)
            resultCheck.push(Platform.OS == 'ios' ? 'ROTATE_RIGHT' : 'ROTATE_LEFT');
        return resultCheck;
    }

    checkFace_GanNhat = (arrFace = []) => {
        let indexMax = -1;
        for (let i = 0; i < arrFace.length; i++) {
            const item = arrFace[i].bounds;
            let s1 = item.size.width * item.size.height;
            //--Xử lý FACE: Không lấy mặt quá xa
            if (Platform.OS == 'ios') {
                //IOS : Smin = 20000
                if (s1 <= 15000 * (this.state.cameraType == true ? 0.2 : 1))
                    continue;
            }
            else {  //ANDROID : Smin = 30000
                if (s1 <= 23000 * (this.state.cameraType == true ? 0.2 : 1))
                    continue;
            }
            let s2 = arrFace[indexMax < 0 ? 0 : indexMax].bounds.size.width * arrFace[indexMax < 0 ? 0 : indexMax].bounds.size.height;
            if (s1 >= s2)
                indexMax = i;
        }
        return indexMax;
    }

    onFacesDetected = (faces) => {
        let tempdataFace = faces.faces;
        //--Xử lý FACE: lấy mặt gần nhất; Không lấy mặt quá xa
        let indexMax = this.checkFace_GanNhat(tempdataFace);
        //--tình trạng Face gần nhất(Cười, nhắm măt, nghiêng,....)
        if (indexMax >= 0)
            this.detectionFaceStatusNow = this.onCheckFaceStatus(tempdataFace[indexMax]);
        else
            this.detectionFaceStatusNow = [];
        if (this.isReCapcha)
            this.arrSaveCapchaTemp = [...this.arrSaveCapchaTemp, ...this.detectionFaceStatusNow]
        else
            this.arrSaveCapchaTemp = [];

        // Utils.nlog('XXX:', this.detectionFaceStatusNow, this.arrSaveCapchaTemp);
        //----CODE ở dưới đoạn này---

        // if (faces.faces.length > 0) {
        // let restemp = this.onCheckFaceStatus(faces.faces[0]);
        // if (restemp.length != 0)
        //     Utils.nlog('XXX:', restemp, faces.faces[0]);
        // }
        if (MODE_TEST_DEV) {
            if (tempdataFace.length > 0) {
                Utils.nlog("Size Frame:", this.frameNow.length);
            }
            this.frameNow = faces.frame;
        }
        if (this.noFaceDetected)
            return;
        if (this.camtake == undefined || this.state.isCheckFace == -1
            || this.state.isCheckFace == -2 || this.state.isCheckFace == 0)
            return;

        if (tempdataFace.length > 0) {
            this.isHaveFace = true;
            if (indexMax < 0) {
                this.statusFace = RootLang.lang.scchamcong.vuilongdatkhuonmatganhon;
                this.setState({ a: this.isLoadHaveFace + '_' + this.isHaveFace });
                //--Xoá khung Android khi không có mặt
                // tempdataFace = tempdataFace[0].bounds;
                this.dataFaceTemp = tempdataFace[0].bounds;
                this.onCheckEndFace_Android(tempdataFace[0].bounds, 800, this.isMode == 1 ? false : true, Platform.OS == 'ios');
                this.isLoadHaveFace = 0;
                return;
            }
            this.frameNow = faces.frame; // base64 1 Frame tại thời điểm hiện tại.
            this.isLoadHaveFace = 1;

            if (this.statusFace != RootLang.lang.scchamcong.xinvuilongthulai);
            this.statusFace = '...'
            let temprotateFace = { rotateX: tempdataFace[indexMax].yawAngle, rotateZ: tempdataFace[indexMax].rollAngle };

            // tempdataFace = tempdataFace[indexMax].bounds;
            this.dataFaceTemp = tempdataFace[indexMax].bounds;
            this.setState({ a: this.isLoadHaveFace + '_' + this.isHaveFace });
            // this.setState({ dataFace: tempdataFace, rotateFace: temprotateFace }); // ko XOÁ

            //--Xoá khung Android khi không có mặt
            this.onCheckEndFace_Android(tempdataFace[indexMax].bounds, 800);
        }
        else { //--Xoá khung IOS khi không có mặt
            if (!this.countProcessing.includes(1) && this.countProcessing.length != 0) {
                //--code
                this.statusFace = '...';
                this.onChamCongFace();
                this.isLoadHaveFace = 0;
                // this.setState({ a: Date.now() })
            }
            if (this.isHaveFace) {
                this.isHaveFace = false;
                this.statusFace = '...';
                this.setState({ a: Date.now() })
            }

            // this.setState({
            //     dataFace: {
            //         origin: { x: 0, y: 0 }, size: { width: 0, height: 0 }
            //     }
            // });
        }
    }

    onTimer_Num = (time = 0) => {
        if (time == 0)
            return;
        setTimeout(() => {
            //--code xu ly
            if (this.isMode == 1 && this.state.isCheckFace == -2 || this.state.isCheckFace == 0) return;
            if (!this.countProcessing.includes(1) && this.countProcessing.length != 0 && this.state.isCheckFace != 1) {
                //--code
                this.statusFace = '...';
                this.onChamCongFace();
                // this.isLoadHaveFace = 0;
                return;
            }
            //--
            this.onTimer_Num(time - 1);
        }, 350);
    }

    onDelRegisFace = () => {
        Utils.showMsgBoxYesNo(this, RootLang.lang.thongbaochung.thongbao, RootLang.lang.scchamcong.bancochacmuonxoa_khuonmatnay,
            RootLang.lang.thongbaochung.xoa, RootLang.lang.thongbaochung.xemlai, async () => {
                let kqDelFace = await apiAI.delRegisFace(this.IdNV, this.IdCty);
                Utils.nlog("delRegisFace:", kqDelFace);
                if (kqDelFace && kqDelFace.status == "1") {
                    this.setState({ isDangKy: false })
                    this.onGetFrame(null)
                }
                if (kqDelFace && kqDelFace.status == "1" && kqDelFace.data.status == "success") {
                    await this.updateDaDangKy(this.IdNV, false);
                    setTimeout(() => {
                        UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.scchamcong.dahuydangkykhuonmatthanhcong, 1)
                        Utils.goback(this);
                        this.callback();
                    }, 200);
                } else
                    setTimeout(() => {
                        UtilsApp.MessageShow(RootLang.lang.thongbaochung.canhbao, RootLang.lang.scchamcong.huydangkykhuonmatthatbai_xinthulai, 2)
                    }, 200);
            })
    }

    onGetLocation = () => {
        this.latlongLocation = "";
        this.kiemTraQuyenViTri();
    }

    onBack_Logout = (timeOut = 0) => {
        if (this.isMode == 1) {
            this.onClearTimer();
            this.camtake = undefined;
            setTimeout(() => {
                this.CapNhatLaiDuLieu()
                // ROOTGlobal.GetDuLieuChamCong.GetDLCC()
                this.callback == null ? null : this.callback()
                Utils.nsetStorage(nkey.isModeMayChamCong, false);
                // Utils.goscreen(this, "sw_HomePage")
                Utils.goback(this)
            }, timeOut);
        }
        else if (this.isMode == 3) {
            Utils.showMsgBoxYesNo(this, RootLang.lang.thongbaochung.thongbao, RootLang.lang.scchamcong.bancomuonthoaikhoichedoMCCkhong,
                RootLang.lang.thongbaochung.thoat, RootLang.lang.thongbaochung.xemlai,
                () => {
                    this.onClearTimer();
                    this.camtake = undefined;
                    this.refConfirmPass.onShow_Hide_Modal();
                },
                () => { }, false)
        }
        else {
            this.onClearTimer();
            this.camtake = undefined;
            setTimeout(() => {
                Utils.goback(this);
            }, timeOut);
        }
    }

    onShowLocation = async (isShow = null) => {
        if (this.latlongAddress != this.latlongLocation)
            this.addressCC = '--' + RootLang.lang.scchamcong.vitrikhongxacdinh + '--';
        if (appConfig.isServiceViettel) {
            if (this.latlongLocation != '' && (!this.state.showLocation || isShow)
                && this.latlongAddress != this.latlongLocation) {
                this.latlongAddress = this.latlongLocation;
                let res = await apiViettelMaps.getAddressViettel(this.lat, this.long)
                // Utils.nlog("LOG:", res)
                if (res) {
                    this.addressCC = res.full_address ? res.full_address : '---'
                }
            }
        }
        else {
            if (this.latlongLocation != '' && (!this.state.showLocation || isShow)
                && this.latlongAddress != this.latlongLocation) {
                this.latlongAddress = this.latlongLocation;
                let resTemp = await getAddressGG(this.latlongLocation);
                if (resTemp && resTemp.status == 'OK' && resTemp.results.length > 0)
                    this.addressCC = resTemp.results[0].formatted_address;
                // Utils.nlog('getAddressGG', resTemp);
            }
        }
        this.setState({ isLoad: false, showLocation: isShow == null ? !this.state.showLocation : isShow });

    }

    render() {
        // Utils.nlog('--RENDER--');
        var {
            isLoad, isCheckLocation = false, modalVisible = true, isCheckFace, rotateFace = { rotateX: 0, rotateZ: 0 }, delRegister,
            dataFace = { origin: { x: 0, y: 0 }, size: { width: 0, height: 0 } }, showLocation
        } = this.state;
        let tempRotate = [
            { rotateX: "0deg" },
            { rotateZ: rotateFace.rotateZ + "deg" }];
        return (
            <View style={styles.container} >
                <RNCamera
                    ref={ref => {
                        this.camera = ref;
                    }}
                    style={styles.preview}
                    type={this.state.cameraType == true ? "back" : "front"}
                    flashMode={RNCamera.Constants.FlashMode.off}
                    captureAudio={false}
                    androidCameraPermissionOptions={{
                        title: RootLang.lang.scchamcong.xinquyencamera,
                        message: RootLang.lang.scchamcong.chophepsudungcamera,
                        buttonPositive: RootLang.lang.scchamcong.dongy,
                        buttonNegative: RootLang.lang.scchamcong.huy,
                    }}
                    androidRecordAudioPermissionOptions={{
                        title: RootLang.lang.scchamcong.xinquyenaudio,
                        message: RootLang.lang.scchamcong.xinquyenaudio,
                        buttonPositive: RootLang.lang.scchamcong.dongy,
                        buttonNegative: RootLang.lang.scchamcong.huy,
                    }}
                    onFacesDetected={this.onFacesDetected}
                    faceDetectionLandmarks={RNCamera.Constants.FaceDetection.Landmarks.all}
                    faceDetectionClassifications={RNCamera.Constants.FaceDetection.Classifications.all}
                    faceDetectionMode={RNCamera.Constants.FaceDetection.Mode.accurate}
                // onFaceDetectionError={error => Utils.nlog('FDError:', error)}

                >

                    {/* Không XOÁ code này */}
                    {/* <View style={{
                            position: 'absolute', top: dataFace.origin.y, left: dataFace.origin.x - (Platform.OS == 'ios' ? 0 : Width(9.5)),
                            height: dataFace.size.height, width: dataFace.size.width, borderRadius: dataFace.size.width / 2,
                            borderWidth: 1, borderColor: colors.greenButton, transform: tempRotate
                        }} /> */}

                    {this.state.status == 'not_existed' && this.state.isRecord == true ?
                        <View style={{
                            justifyContent: 'center', alignItems: 'center', height: Width(90), width: Width(90), top: 10
                        }}>
                            <LottieView style={{ height: Width(130) }} source={require('../../../../images/lottieJeeHR/faceID.json')} autoPlay loop speed={0.4} />
                        </View> :
                        <View style={{
                            height: Width(90), width: Width(90), borderRadius: 6, marginBottom: 40,
                            borderWidth: 1, borderColor: colors.greenButton
                        }} />

                    }
                </RNCamera>

                {
                    !MODE_TEST_DEV ? null :
                        <Image source={{
                            uri: this.state.imgTemp
                        }}
                            style={{
                                width: 300, height: 300, backgroundColor: 'red',
                                position: 'absolute', top: 0, left: 0
                            }} resizeMode='contain' />
                }

                <View style={{
                    flex: 0, flexDirection: 'row', position: 'absolute',
                    bottom: isIphoneX() ? 170 : 110, alignSelf: 'center', justifyContent: 'space-between',
                    alignItems: 'center', zIndex: 0
                }}>
                    <View>
                        <View style={{}}>
                            {

                                this.state.isDangKy == true && this.state.isRecord == true && this.state.status == "not_existed" ?
                                    <ActivityIndicator color={colors.white} /> :
                                    (this.statusFace == '...' || isLoad || this.isLoadApiLocation || this.isHaveFace || this.isLoadHaveFace == 1)
                                        && (this.isLoadHaveFace == 1 || this.isHaveFace || this.isLoadApiLocation) || (this.noFaceDetected && this.state.isCheckFace > 0) ?
                                        (this.statusFace == '...' && !this.countProcessing.includes(1)
                                            && this.isLoadHaveFace == 0 && !this.noFaceDetected || this.isMode == 1 && this.state.isCheckFace < 0 ?
                                            <Text style={{
                                                color: colors.white, fontWeight: 'bold', lineHeight: 30,
                                                fontSize: 18, marginHorizontal: 30, textAlign: 'center'
                                            }}>{RootLang.lang.scchamcong.sansang}</Text> : <ActivityIndicator color={colors.white} />) :
                                        <Text style={{
                                            color: colors.white, fontWeight: 'bold',
                                            fontSize: 18, marginHorizontal: 30, textAlign: 'center', lineHeight: 30,
                                        }}>{this.latlongLocation == '' ? '' : RootLang.lang.scchamcong.sansang} </Text>
                            }
                        </View>
                        {
                            this.statusFace != '...' ?
                                <View>
                                    <Text style={[{
                                        color: colors.white, fontWeight: 'bold',
                                        fontSize: 16, marginHorizontal: 30, textAlign: 'center'
                                    }]}>{this.latlongLocation == '' && !isLoad && isCheckFace != -1 ?
                                        (this.firstLoad ? RootLang.lang.scchamcong.khongthechamcong_vuilongkiemlaidichvuvitri : RootLang.lang.scchamcong.dangketnoiAIchamcong)
                                        : (isLoad ? RootLang.lang.scchamcong.danglaydulieuvitrihientai : this.state.textGoiY)}</Text>
                                </View>
                                :
                                <Text style={{
                                    color: colors.white, fontWeight: 'bold',
                                    fontSize: 16, marginHorizontal: 30, textAlign: 'center'
                                }}>{this.state.textGoiY}</Text>
                        }
                    </View>
                </View>

                {
                    isCheckFace > 0 ? null :
                        <View style={{
                            position: 'absolute', bottom: 0, top: 0, right: 0, left: 0, zIndex: 3,
                            justifyContent: 'center', alignItems: 'center', backgroundColor: colors.black_5
                        }}>
                            {
                                isCheckFace == -2 && !isLoad && this.latlongLocation != '' && !this.isLoadApiLocation ?
                                    <TouchableOpacity onPress={this.onChamCongFace} style={[styles.capture, nstyles.shadow]}>
                                        <Image
                                            style={[nstyles.nIcon50]}
                                            source={Images.icSnapCamera}
                                            resizeMode={'contain'}>
                                        </Image>
                                        <Text
                                            style={{ color: colors.white, fontWeight: 'bold', fontSize: 18 }}>{RootLang.lang.scchamcong.chamcong}</Text>
                                    </TouchableOpacity> : null
                            }
                            {
                                isCheckFace != -1 ? null :
                                    <TouchableOpacity onPress={this.onDangKyFace} style={[nstyles.shadow,
                                    {
                                        padding: 10, paddingHorizontal: 20, marginTop: 25, borderRadius: 85,
                                        backgroundColor: colors.black_50, height: 170, width: 170, alignItems: 'center', justifyContent: 'center'
                                    }]}>
                                        <Text
                                            style={{
                                                color: colors.white, fontWeight: 'bold',
                                                fontSize: 16, textAlign: 'center'
                                            }}><Text style={{ fontSize: 22, color: colors.greenishTeal }}>
                                                {'\n'}{this.state.isRecord == true ? RootLang.lang.thongbaochung.quayvideo.toUpperCase() : RootLang.lang.scchamcong.chuphinh}</Text>{'\n\n' + RootLang.lang.scchamcong.dangky}</Text>
                                    </TouchableOpacity>
                            }
                        </View>
                }

                <View style={{
                    flex: 0, flexDirection: 'row', position: 'absolute',
                    bottom: 0, alignSelf: 'center', justifyContent: 'space-between',
                    alignItems: 'center', zIndex: 4
                }}>
                    <TouchableOpacity onPress={() => this.onBack_Logout()}
                        style={[styles.btnBack_Switch, { padding: 10, backgroundColor: colors.black_5 },]}>
                        <View>
                            <Image
                                resizeMode='contain'
                                style={[nstyles.nIcon40]}
                                source={Images.icBackCamera}
                                resizeMode={'contain'}>
                            </Image>
                        </View>
                    </TouchableOpacity>
                    {
                        !MODE_TEST_DEV ? null :
                            <TouchableOpacity onPress={this.onTakePicture}>
                                <Image
                                    style={[nstyles.nIcon56]}
                                    source={Images.icSnapCamera}
                                    resizeMode={'contain'}>
                                </Image>
                            </TouchableOpacity>
                    }
                    {
                        !this.state.isShowRefreshLocation ? null :
                            <TouchableOpacity style={{ marginHorizontal: 10, backgroundColor: colors.black_5 }} disabled={this.state.isLoad}
                                onPress={this.onGetLocation}>
                                <Image
                                    style={[nstyles.nIcon30, { tintColor: isCheckLocation ? colors.greenButton : colors.redFresh }]}
                                    source={Images.icLocationRefresh}
                                    resizeMode={'contain'}>
                                </Image>
                            </TouchableOpacity>
                    }
                    {
                        !delRegister || this.callback == null ? null :

                            // this.state.status != 'not_existed' ?
                            <TouchableOpacity style={{ marginHorizontal: 10, backgroundColor: colors.black_5 }} onPress={this.onDelRegisFace}>
                                <Image
                                    style={[nstyles.nIcon30, { tintColor: colors.redStar }]}
                                    source={Images.icDelFace}
                                    resizeMode={'contain'}>
                                </Image>
                            </TouchableOpacity>

                        // : null
                    }
                    <TouchableOpacity onPress={() => this.changeCameraType()}
                        style={styles.btnBack_Switch}>
                        <View>
                            <Image
                                resizeMode='contain'
                                style={[nstyles.nIcon40]}
                                source={Images.icChangeCamera}
                                resizeMode={'contain'}>
                            </Image>
                        </View>
                    </TouchableOpacity>
                </View>
                {
                    !this.state.isShowRefreshLocation ? null :
                        <View style={{
                            position: 'absolute', left: 0, top: paddingTopMul + 10, alignSelf: 'center',
                            justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10,
                            flexDirection: 'row', zIndex: 5
                        }}>
                            <Text
                                numberOfLines={1}
                                style={{ color: isCheckLocation ? colors.greenButton : colors.redFresh, fontStyle: 'italic', maxWidth: '92%', fontSize: 12 }}>
                                {showLocation ? this.addressCC : ''}
                            </Text>
                            <TouchableOpacity disabled={isLoad} style={{ padding: 5, borderRadius: 15 }}
                                onPress={() => this.onShowLocation()}>
                                <Image
                                    resizeMode='contain'
                                    style={[nstyles.nIcon24, { tintColor: isCheckLocation ? colors.greenButton : colors.redStar }]}
                                    source={Images.icShowLocation} />
                            </TouchableOpacity>
                        </View>
                }


                {
                    this.isReCapcha ?
                        <View style={{
                            backgroundColor: 'red', borderRadius: 8, paddingVertical: 6,
                            position: 'absolute', top: "18%", alignSelf: 'center',
                            justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10,
                            flexDirection: 'row', zIndex: 5, marginHorizontal: 10
                        }}>
                            <Text style={[{
                                color: colors.white, fontWeight: 'bold',
                                fontSize: 16, marginHorizontal: 30, textAlign: 'center'
                            }]}>{this.statusFace == '[textGoiY]' ? this.state.textGoiY : this.statusFace}</Text>
                        </View>
                        :
                        null
                }
                {
                    this.state.status == 'not_existed' && this.state.isDangKy == false ?
                        <View style={{
                            position: 'absolute', right: 10, top: paddingTopMul + 10, alignSelf: 'center',
                            justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10,
                            flexDirection: 'row', zIndex: 5
                        }}>

                            <TouchableOpacity disabled={isLoad} style={{ padding: 15, borderRadius: 15, backgroundColor: colors.black_50 }}
                                onPress={() => this.setState({ isRecord: !this.state.isRecord }, () => {
                                    this.onSendAPI_Face(null)
                                })}>
                                <Text style={{ fontSize: 15, color: colors.greenishTeal }}>
                                    {this.state.isRecord == true ? "Đăng ký bằng hình ảnh" : "Đăng ký bằng video"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        : null
                }
                {/* xxx */}
                <ModalConfirmPass nthis={this} modalVisible={modalVisible} ref={(refs) => this.refConfirmPass = refs} />
            </View >
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
    },
    preview: {
        flex: 4,
        justifyContent: 'center',
        alignItems: 'center'
    },
    capture: {
        opacity: 0.8,
        borderRadius: 15,
        height: Width(45),
        width: Width(45),
        borderRadius: Width(45) / 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.greenButton
    },
    btnBack_Switch: {
        opacity: 0.8,
        borderRadius: 5,
        padding: 6,
        margin: 20
    }
});
// export default CameraDiemDanh
const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(CameraDiemDanhNew, mapStateToProps, true)