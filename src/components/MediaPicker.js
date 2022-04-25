import React, { Component, PureComponent } from 'react';
import {
    Image, View, StyleSheet, Text, Platform,
    Alert, TouchableOpacity, Dimensions, PermissionsAndroid,
    FlatList, RefreshControl, ScrollView, Linking, BackHandler
} from 'react-native';

import { ImgComp } from '../images/ImagesComponent'
import HeaderCus from './HeaderCus';
import ButtonCom from './Button/ButtonCom';

import CameraRoll from "@react-native-community/cameraroll";
import { nstyles, nwidth } from '../styles/styles';
import Utils from '../app/Utils';
import { colors } from '../styles';

const stMediaPicker = StyleSheet.create({

});

export default class MediaPicker extends Component {
    constructor(props) {
        super(props);
        this.options = { //DEFAULT OPTIONS
            assetType: 'All',//All,Videos,Photos - default
            multi: false,// chọn 1 or nhiều item
            response: () => { }, // callback giá trị trả về khi có chọn item
            limitCheck: -1, //gioi han sl media chon: -1 la khong co gioi han, >-1 la gioi han sl =  limitCheck
            groupTypes: 'All',
            showTakeCamera: true
        }
        this.options = {
            ...this.options,
            ...this.props.route.params //--this.options media
        };
        this.isend = true;
        //----
        this.state = {
            //data globle
            isLoading: false,
            //data local
            missingPermission: false,
            permissionLib: false,
            photos: [],
            countChoose: 0,
            permissionIOS: true,
            indexNow: -1,
            sl: 51,
            opacityMain: 1
        }
        if (Platform.OS == 'android') {
            this.androidRequestPermissionAndLoadMedia();
        }
    }

    UNSAFE_componentWillMount = async () => {
        if (Platform.OS == 'ios') {
            this.loadMedia();
        }
        else {
            // this.androidRequestPermissionAndLoadMedia();
        }
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.backAction)
    }

    backAction = () => {
        this.options.response({ iscancel: true }); Utils.goback(this);
        return true
    }

    componentWillUnmount = async () => {
        try {
            this.isend = true;
            BackHandler.removeEventListener('hardwareBackPress', this.backAction)
        } catch (error) {

        }
    }


    loadMedia = async (ssl = 0) => {
        if (!this.isend) {
            return;
        }
        let sl = this.state.sl;
        sl += ssl;
        let paramsCamera = {
            first: sl,
            assetType: this.options.assetType, //--set type - all, photos, videos,
            include: ["filename", "imageSize", "fileSize"]
        };
        paramsCamera.groupTypes = this.options.groupTypes;

        CameraRoll.getPhotos(paramsCamera)
            .then(r => {
                var mlid = [];
                // Utils.nlog('XXXXXXX:', r.edges);
                if (this.options.showTakeCamera && mlid.length == 0 && r.edges.length == 0) {
                    mlid.push({
                        uri: 'BTN_TakePhoto_x',
                    });
                }
                r.edges.map((item, index) => {
                    if (this.options.showTakeCamera && mlid.length == 0) {
                        mlid.push({
                            uri: 'BTN_TakePhoto_x',
                        });
                    }

                    mlid.push({
                        ...item,
                        uri: item.node.image.uri,
                        timePlay: item.node.type && item.node.type.split('/')[0] == 'video' ? 10 : 0,//item.node.image.playableDuration ? item.node.image.playableDuration : 0,  // =0: img, >0: videos
                        height: item.node.image.height,
                        width: item.node.image.width,
                        filename: item.node.image.filename,
                        ischoose: false,
                        size: item.node.image.fileSize / 1024
                    });
                });
                //-----
                this.isend = r.page_info.has_next_page;
                this.setState({ photos: mlid, sl: sl, permissionLib: true });

            }, (reason) => {
                Utils.nlog('no permission');
                if (reason.toString().includes('User denied access') && Platform.OS == 'ios')
                    this.setState({ permissionIOS: false });
            })
            .catch((err) => {
                Utils.nlog('no ok');
                //Error Loading Images
            });
    };

    hasAndroidPermission = async () => {
        const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
        const hasPermission = await PermissionsAndroid.check(permission);
        if (hasPermission) {
            return true;
        }
        const status = await PermissionsAndroid.request(permission);
        return status === 'granted';
    }

    androidRequestReadStoragePermission() {
        return new Promise((resolve, reject) => {
            if (
                PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE) ===
                PermissionsAndroid.RESULTS.GRANTED
            ) {
                return resolve();
            }
            PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE)
                .then(result => {
                    if (result === PermissionsAndroid.RESULTS.GRANTED) {
                        resolve();
                    } else {
                        reject();
                    }
                })
                .catch(err => {
                    reject();
                    alert(err);
                });
        });
    }

    androidRequestPermissionAndLoadMedia = async () => {
        let checkPer = await this.hasAndroidPermission();
        if (checkPer) {
            this.setState({ missingPermission: false });
            this.loadMedia();
        } else
            this.setState({ missingPermission: true })
    }

    chooseItem = (index) => {
        let i = this.state.indexNow;
        let mtemp = this.state.photos;
        let icount = this.state.countChoose;
        //--gioi han sl chon
        if (this.options.multi && this.options.limitCheck > -1 && this.state.countChoose >= this.options.limitCheck && !mtemp[index].ischoose) {
            return;
        }
        //-----
        if (mtemp[index].ischoose)
            icount--; else icount++;
        if (i != -1)
            mtemp[i] = { ...mtemp[i], ischoose: false };
        mtemp[index] = { ...mtemp[index], ischoose: !mtemp[index].ischoose };

        this.setState({ photos: mtemp, countChoose: icount });
        this.setState({ photos: mtemp, countChoose: icount, indexNow: this.options.multi ? -1 : index });
    }

    prevMedia = (suri) => {
        // const imagesURL = [
        //     {
        //         url: 'https://img2.infonet.vn/w490/Uploaded/2020/pjauldz/2018_06_19/5.jpg',
        //     },
        // ];
        Utils.goscreen(this, 'Modal_ShowListImage', { ListImages: [{ url: suri }], index: 0 });
    }

    onPlayVideo = (suri) => {
        Utils.goscreen(this, 'Modal_PlayMedia', { source: suri });
    }

    done = () => {
        let tdata = this.state.photos.slice();
        tdata = tdata.filter(item => item.ischoose);
        if (tdata.length == 0)
            this.options.response({ iscancel: true });
        else this.options.response(tdata);
        Utils.goback(this);
    }

    onResponse = (item, isok) => {
        if (isok) {
            Utils.goback(this);
            this.options.response([item]);
        } else {
            this.setState({ opacityMain: 1 });
        }
    }

    _openCamrera = () => {
        Utils.goscreen(this, 'ModalCamVideoCus', { onResponse: this.onResponse, showLeft: false, OptionsCam: this.options && this.options.assetType != 'All' ? this.options.assetType == 'Photos' || this.options.isAvatar ? 1 : 2 : 0 });
        this.setState({ opacityMain: 0 });
    }

    renderItem = ({ item, index }) => {
        if (index == 0 && this.options.showTakeCamera) return (
            <TouchableOpacity activeOpacity={0.9}
                style={[nstyles.nmiddle, {
                    backgroundColor: colors.black_50,
                    width: (nwidth - 30) / 3, height: (nwidth - 30) / 3, marginRight: 5, marginTop: 5,
                    borderColor: '#E8E8E9', borderWidth: 0.5
                }]} onPress={this._openCamrera}>
                <Image
                    style={{
                        width: 50,
                        height: 50,
                        tintColor: colors.white
                    }}
                    resizeMode='contain'
                    source={ImgComp.icCameraBlack}
                />
            </TouchableOpacity>
        )
        else return <ItemImage item={item} index={index} onPlayVideo={this.onPlayVideo}
            chooseItem={this.chooseItem} prevMedia={this.prevMedia} />
    }

    render() {
        return (
            <View style={[nstyles.ncontainerX, { opacity: this.state.opacityMain }]}>
                {/* Header  */}
                {/* <HeaderCom nthis={this}
                    onPressLeft={() => { this.options.response({ iscancel: true }); Utils.goback(this); }}
                    iconLeft={ImgComp.icCloseWhite}
                    tintColorRight={colors.blue}
                    hiddenIconRight={this.state.permissionLib}
                    titleText={this.options.assetType == 'Videos' ? 'Thư viện video' : 'Thư viện hình ảnh'}
                    iconRight={ImgComp.icSetTingBlack}
                    onPressRight={() => { Linking.openSettings() }}
                /> */}
                <HeaderCus
                    onPressLeft={() => { this.options.response({ iscancel: true }); Utils.goback(this); }}
                    iconLeft={ImgComp.icCloseWhite}
                    title={this.options.assetType == 'Videos' ? 'Thư viện video' : 'Thư viện hình ảnh'}
                    styleTitle={{ color: colors.white }}
                    iconRight={this.state.permissionLib ? null : ImgComp.icSetTingBlack}
                    Sright={{ tintColor: colors.white }}
                    onPressRight={() => { Linking.openSettings() }}
                />
                {/* <View style={nstyles.nhead}>
                    <View style={nstyles.nHcontent}>
                        <View style={nstyles.nHleft}>
                            <TouchableOpacity onPress={() => { this.options.response({ iscancel: true }); Utils.goback(this); }}>
                                <Image source={ImgComp.icCloseWhite} style={{ width: 28, height: 28 }} />
                            </TouchableOpacity>
                        </View>
                        <View style={nstyles.nHmid}>
                            <Text style={nstyles.ntitle}>Thư viện hình ảnh</Text>
                        </View>
                        <View style={nstyles.nHright}>

                        </View>
                    </View>
                </View> */}
                {/* BODY */}
                <View style={nstyles.nbody}>
                    { //--hiện thị hỏi quyền khi IOS ko có quyền truy cập ảnh
                        this.state.permissionIOS ?
                            <View style={{ flex: 1 }}>
                                {
                                    this.options.limitCheck > 0 && this.options.multi && this.state.countChoose == this.options.limitCheck ?
                                        <View style={{ paddingVertical: 4, alignItems: 'center' }}>
                                            <Text style={[nstyles.ntext, { color: 'black', fontSize: 14 }]}>Số lượng tối đa được chọn: {this.options.limitCheck}</Text>
                                        </View> : null
                                }
                                <FlatList
                                    data={this.state.photos}
                                    style={{ flex: 1, backgroundColor: colors.white, padding: 10, paddingRight: 5, paddingTop: 5, marginBottom: 60 }}
                                    ref={(ref) => { this.listCmts = ref; }}
                                    keyboardShouldPersistTaps='handled'
                                    keyboardDismissMode='interactive'
                                    onEndReachedThreshold={0.3}
                                    onEndReached={() => {
                                        if (this.state.photos.length != 0) {
                                            this.loadMedia(30);
                                        }
                                    }}
                                    ListHeaderComponent={
                                        this.state.permissionLib ? null :
                                            <TouchableOpacity
                                                onPress={() => { Linking.openSettings() }}
                                                activeOpacity={0.9}
                                                style={{ alignItems: 'center', justifyContent: 'center' }}>
                                                <Text style={{ textAlign: 'center', marginHorizontal: 30, marginBottom: 5 }}>Cho phép ứng dụng truy cập vào ảnh và video của bạn để có thể gửi phản ánh.</Text>
                                                <Text style={{ fontWeight: 'bold', color: colors.blue }}>Đi đến cài đặt</Text>
                                            </TouchableOpacity>}
                                    renderItem={this.renderItem}
                                    showsVerticalScrollIndicator={false}
                                    numColumns={3}
                                    keyExtractor={(item, index) => item.uri}
                                />

                                <View style={[nstyles.nrow, {
                                    position: 'absolute', bottom: 0, left: 0, right: 0, justifyContent: 'space-between', padding: 10,
                                    alignItems: 'center'
                                }]}>
                                    <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, top: 0 }} />
                                    {/* {
                                        this.options.multi ?
                                            <Text style={[nstyles.ntext, { color: colors.black, fontWeight: "400" }]}>Đã chọn: {this.state.countChoose}</Text> : <Text />
                                    } */}
                                    {/* <TouchableOpacity style={[nstyles.nbtn_Bgr, { backgroundColor: '#43C9AA', borderRadius: 4, paddingHorizontal: 18 }]} activeOpacity={0.9}
                                        onPress={() => { this.done() }}>
                                        <Text style={nstyles.ntextbtn_Bgr}>Chọn</Text>
                                    </TouchableOpacity> */}
                                    <ButtonCom
                                        onPress={() => { this.done() }}
                                        text={this.options.multi ? 'Chọn ( ' + this.state.countChoose + ' )' : 'Chọn'}
                                        style={{ borderRadius: 5, flex: 1, paddingHorizontal: 10 }}
                                    />
                                </View>
                            </View>
                            :
                            <TouchableOpacity style={[nstyles.nbtn_Bgr, {
                                borderRadius: 5, paddingHorizontal: 18, alignSelf: 'center',
                                paddingVertical: 5, backgroundColor: "#157EFB", marginTop: 20
                            }]} onPress={() => {
                                Linking.openURL('app-settings:').catch((err) => {
                                    Utils.nlog(err);
                                });
                            }}>
                                <Text style={[nstyles.ntextbtn_Bgr, { fontSize: 14 }]}>Đi đến cài đặt</Text>
                            </TouchableOpacity>
                    }
                </View>
                {/* <View style={{height:200,width:'100%',backgroundColor:'red'}}>
                    <PlayMedia />
                </View> */}
            </View>
        );
    }
}

class ItemImage extends PureComponent {

    render() {
        const { item, index, prevMedia, onPlayVideo, chooseItem } = this.props;
        // Utils.nlog("----------time paly", item)
        return (
            item.height == -1 ? null :
                <TouchableOpacity activeOpacity={0.9}
                    style={{
                        width: (nwidth - 30) / 3, height: (nwidth - 30) / 3, marginRight: 5, marginTop: 5,
                        borderColor: '#E8E8E9', borderWidth: 0.5
                    }} onPress={() => { prevMedia(item.uri) }}>
                    <Image
                        style={{
                            width: (nwidth - 30) / 3,
                            height: (nwidth - 30) / 3,
                        }}
                        resizeMode='cover'
                        source={{ uri: item.uri }}
                    />
                    {/* nút play video */}
                    {
                        item.timePlay > 0 ?
                            <TouchableOpacity style={{
                                position: 'absolute', top: 0, right: 0, left: 0, bottom: 0, justifyContent: 'center',
                                alignItems: 'center'
                            }} activeOpacity={0.9}
                                onPress={() => onPlayVideo(item.uri)}>
                                <Image
                                    style={{ width: 35, height: 35 }}
                                    resizeMode='contain'
                                    source={ImgComp.mediaPlayButton}
                                />
                            </TouchableOpacity> : null
                    }
                    {/* nút chọn media */}
                    <TouchableOpacity style={{
                        position: 'absolute', top: 5, right: 5,
                        elevation: 2, shadowOffset: { width: 1, height: 1 },
                        shadowColor: 'black'
                    }} activeOpacity={0.9}
                        onPress={() => { chooseItem(index) }}>
                        <Image
                            style={{ width: 30, height: 30 }}
                            resizeMode='cover'
                            source={item.ischoose ? ImgComp.icChooseItemGreen : ImgComp.icCheckboxWhite}
                        />
                    </TouchableOpacity>
                </TouchableOpacity>
        );
    }
}
