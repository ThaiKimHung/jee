import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Alert, Image, PermissionsAndroid, Platform, Linking, BackHandler } from 'react-native'
import { RNCamera } from 'react-native-camera';
import CameraRoll from "@react-native-community/cameraroll";
import { reText } from '../../styles/size';
import { colors } from '../../styles';
import { nstyles } from '../../styles/styles';
import { isIphoneX } from 'react-native-iphone-x-helper';
import Utils from '../../app/Utils';
// import { ImgComp } from '../ImagesComponent';
import { ImgComp } from '../../images/ImagesComponent'

const MaxDuration = 60
export class CamVideoCus extends Component {
    constructor(props) {
        super(props);
        // this.callback = Utils.ngetParam(this,'callback')
        this.OptionsCam = Utils.ngetParam(this, 'OptionsCam', 0) // 0 cả video/camera ,1 là camera, 2 là video
        this.onResponse = Utils.ngetParam(this, 'onResponse', () => { });
        this.typeCamera = Utils.ngetParam(this, 'typeCamera', RNCamera.Constants.Type.back); //Default CAME: 1: là CAM sau, 2: là CAM trước
        this.typeCamera = [1, 2].includes(this.typeCamera) ? this.typeCamera : 1;
        this.state = {
            isSnap: true, // trạng thái chụp hình hay quay phim
            isRecording: false, // trạng thái chuyển giao diện button quay phim đang quay hay dừng quay
            urlSaved: '',
            isFlash: 'auto', // bật tắt flash máy ảnh
            second: MaxDuration,
            linkOpenGallary: '',
            typeCamera: this.typeCamera
        };
    }

    // componentDidMount = () => {
    //     // CameraRoll.getAlbums({ assetType: 'All' }).then(data => {
    //     //     Utils.nlog('getalll=======', data)

    //     //     CameraRoll.getPhotos({ first: 10, groupTypes: 'Album', groupName: data[0].title }).then(data2 => {
    //     //         Utils.nlog('img====', data2)
    //     //     })
    //     // })

    //     // CameraRoll.getPhotos({ first: 200, assetType: 'All' }).then(data => {
    //     //     Utils.nlog('photo', data)
    //     // })
    // }

    //Chuyen doi camera truoc  sau

    _switchCamera = () => {
        if (this.state.typeCamera == RNCamera.Constants.Type.back) {
            this.setState({ typeCamera: RNCamera.Constants.Type.front })
        } else {
            this.setState({ typeCamera: RNCamera.Constants.Type.back })
        }
    }

    //Hỏi quyền truy cập bộ lưu trữ
    hasAndroidPermission = async () => {
        const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

        const hasPermission = await PermissionsAndroid.check(permission);
        if (hasPermission) {
            return true;
        }

        const status = await PermissionsAndroid.request(permission);
        return status === 'granted';
    }

    //Hàm xử lý chụp hình
    takePicture = async () => {
        if (this.camera) {
            const options = { quality: 0.5, base64: false };
            const data = await this.camera.takePictureAsync(options);
            await this.saveImage(data)
            this.setState({ urlSaved: data.uri })
        }
    };

    //Hàm xử lý quay video
    _recordVideo = async () => {
        this.setState({ isRecording: true, second: MaxDuration })
        this.reduceSecond()
        try {
            const data = await this.camera.recordAsync({
                quality: "480p",
                orientation: "portrait",
                maxDuration: MaxDuration, // Thời gian tối đa
                mute: false,
            })
            //Hỏi quyền truy cập strogre
            if (Platform.OS === "android" && !(await this.hasAndroidPermission())) {
                return;
            }
            this.setState({ urlSaved: data.uri })
            await CameraRoll.save(data.uri, { type: 'video' }).then(link => {
                this.onResponse({ ...data, timePlay: 10, uri: link }, true);
                this.setState({ isRecording: false, linkOpenGallary: link })
                clearInterval(this.setTime)
            })

        } catch (error) {
            Utils.nlog('errrr====', error)
            clearInterval(this.setTime)
            this.setState({ isRecording: false, second: MaxDuration })
            Alert.alert('Thông báo', 'Có lỗi trong quá trình quay video, thử lại !')
        }

    }

    _stopRecord = () => {
        this.camera.stopRecording()
        clearInterval(this.setTime)
    }

    saveImage = async (data) => {
        try { // Chức năng không bắt buộc khi chụp hình ảnh
            if (Platform.OS === "android" && !(await this.hasAndroidPermission())) {
                return;
            }
            await CameraRoll.save(data.uri, { type: "photo" }).then(link => {
                this.onResponse({ ...data, uri: link }, true);
                this.setState({ linkOpenGallary: link })
                // Toast.show('Ảnh đã được lưu.');
                Utils.goback(this)
            })
        } catch (error) {
            this.onResponse({ ...data, uri: data.uri }, true);
            Utils.goback(this)
        }
    }

    handleRecordOrSnap = (isSnap) => {
        this.setState({ isSnap })
    }

    //xử lý Chụp, quay
    handleCamera = async () => {
        let { isRecording, isSnap } = this.state
        if (isSnap) {
            //true: Đang ở chế độ chụp hình
            this.takePicture();
        }
        else {
            //false: Đang ở chế độ quay phim
            if (!isRecording) {
                //true: Camera đang quay
                this._recordVideo()
            }
            else {
                // Dừng quay, và lưu video
                this._stopRecord()
            }
        }
    }

    handleFlash = () => {
        //Chuyển chế độ Flash Camera
        switch (this.state.isFlash) {
            case 'auto':
                this.setState({ isFlash: 'on' })
                break;
            case 'on':
                this.setState({ isFlash: 'off' })
                break;
            case 'off':
                this.setState({ isFlash: 'torch' })
                break;
            case 'torch':
                this.setState({ isFlash: 'auto' })
                break;
            default:
                break;
        }
    }

    setTime = () => {
        var { second } = this.state
        if (second > 0)
            this.setState({ second: second - 1 })
        else {
            this._stopRecord()
        }
    }

    reduceSecond = () => {
        setInterval(this.setTime, 1000);
    }

    _clearInterval = () => {
        clearInterval(this.setTime)
    }

    secondsToMMSS = (seconds) => {
        let m = Math.floor(seconds / 60);
        let s = Math.floor(seconds % 60);

        let mDisplay = m < 10 ? `0${m}` : `${m}`;
        let sDisplay = s < 10 ? `0${s}` : `${s}`;
        return `${mDisplay}:${sDisplay}`;
    };

    _openGallary = () => {
        try {
            Linking.openURL(this.state.linkOpenGallary).then(value => {
                //
            }).catch(res => {
                //Xử lý trường hợp nếu mở ảnh xem rồi người dùng xóa đi
                Linking.openURL('content://media/external/images/media/')
            })
        } catch (error) {
            Linking.openURL('content://media/external/images/media/')
        }
    }

    backAction = () => {
        this.onResponse({}, false);
        return false;
    };

    componentDidMount() {
        // CameraRoll.getAlbums({ assetType: 'All' }).then(data => {
        //     Utils.nlog('getalll=======', data)
        // })
        this.backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            this.backAction
        );
        if (this.OptionsCam == 2) {
            this.setState({ isSnap: false })
        }
    }

    componentWillUnmount() {
        this.backHandler.remove();
    }

    _goback = () => {
        this.onResponse({}, false);
        Utils.goback(this);
    }

    render() {
        const { isSnap, isRecording, isFlash, second, urlSaved, typeCamera } = this.state
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={this._goback} activeOpacity={0.5} style={{ position: 'absolute', top: isIphoneX() ? 45 : 20, left: 15, zIndex: 100, padding: 5 }}>
                    <Image source={ImgComp.icBack} style={[nstyles.nIcon24, { tintColor: 'white' }]} resizeMode='contain' />
                </TouchableOpacity>
                <TouchableOpacity onPress={this._switchCamera} activeOpacity={0.5} style={{ position: 'absolute', top: isIphoneX() ? 45 : 20, right: 15, zIndex: 100, padding: 5 }}>
                    <Image source={ImgComp.icSwitchCamera} style={[nstyles.nIcon30, { tintColor: 'white' }]} />
                </TouchableOpacity>
                <RNCamera
                    ref={ref => {
                        this.camera = ref;
                    }}
                    // playSoundOnCapture={true}
                    captureAudio={this.OptionsCam != 1}
                    useNativeZoom={true}
                    // onRecordingStart={this._onRecordingStart}
                    // onRecordingEnd={this._onRecordingEnd}
                    style={styles.preview}
                    type={typeCamera} // Chuyển đổi cameara trước sau nếu cần
                    flashMode={isFlash}
                    androidCameraPermissionOptions={{
                        title: 'Permission to use camera',
                        message: 'We need your permission to use your camera',
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel',
                    }}
                    androidRecordAudioPermissionOptions={{
                        title: 'Permission to use audio recording',
                        message: 'We need your permission to use your audio',
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel',
                    }}
                    onGoogleVisionBarcodesDetected={({ barcodes }) => {
                        // Utils.nlog(barcodes);
                    }}
                />

                {/* {Footer Camera} */}
                <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.backgroundModal, paddingVertical: 10, paddingBottom: isIphoneX() == true ? 30 : 10 }}>
                    {isRecording ?
                        <View style={{ justifyContent: 'center', alignItems: 'center', paddingBottom: 10 }}>
                            <Text allowFontScaling={false} style={{ color: 'white', fontWeight: 'bold', fontSize: reText(14) }}>{this.secondsToMMSS(second)}</Text>
                        </View> :
                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', paddingBottom: 10 }}>
                            {
                                this.OptionsCam == 0 || this.OptionsCam == 1 ?
                                    <TouchableOpacity
                                        onPress={() => this.handleRecordOrSnap(true)}
                                        activeOpacity={0.5}
                                        style={[styles.typeCamera, { backgroundColor: isSnap ? "#FFF" : "transparent" }]}
                                    >
                                        <Text allowFontScaling={false} style={{ fontSize: reText(14), color: !isSnap ? "white" : "black" }}>{'Chụp hình'}</Text>
                                    </TouchableOpacity>
                                    : null
                            }
                            {
                                this.OptionsCam == 0 || this.OptionsCam == 2 ?
                                    <TouchableOpacity
                                        onPress={() => this.handleRecordOrSnap(false)}
                                        activeOpacity={0.5}
                                        style={[styles.typeCamera, { backgroundColor: !isSnap ? "#FFF" : "transparent", }]}
                                    >
                                        <Text allowFontScaling={false} style={{ fontSize: reText(14), color: isSnap ? "white" : "black" }}>{'Quay phim'}</Text>
                                    </TouchableOpacity>
                                    : null
                            }
                        </View>
                    }
                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            {Platform.OS == 'ios' ? null :
                                <TouchableOpacity onPress={this._openGallary} activeOpacity={0.5} style={{}}>
                                    <Image source={{ uri: urlSaved ? urlSaved : undefined }} style={[nstyles.nAva50]} resizeMode='cover' />
                                </TouchableOpacity>
                            }
                        </View>
                        <TouchableOpacity onPress={this.handleCamera} style={styles.capture}>
                            {
                                !isSnap ?
                                    <View style={isRecording ? { backgroundColor: 'black', padding: 5 } : { backgroundColor: 'red', padding: 5, borderRadius: 10 }} />
                                    : <View style={{ padding: 5 }} />
                            }
                        </TouchableOpacity>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableOpacity onPress={this.handleFlash} activeOpacity={0.5} style={{ padding: 20, flexDirection: 'row' }}>
                                <Image source={isFlash == 'off' ? ImgComp.icFlashOff : ImgComp.icFlashOn} style={[nstyles.nIcon22, { tintColor: 'white' }]} />
                                <Text allowFontScaling={false} style={{ color: 'white' }}>{isFlash}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
    },
    preview: {
        flex: 1,
        // height: 300,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    capture: {
        backgroundColor: '#979797',
        padding: 25,
        borderRadius: 50,
        borderWidth: 5,
        borderColor: '#FFF'
    },
    typeCamera: {
        padding: 5,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default CamVideoCus
