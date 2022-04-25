import React, { Component } from 'react';
import {
    ActivityIndicator, FlatList,
    PermissionsAndroid, Platform,
    Image, Linking, Platform, TouchableOpacity, View
} from 'react-native';
import Utils from '../../app/Utils';
// import CameraRoll from '@react-native-community/cameraroll';
// import ImageViewer from 'react-native-image-zoom-viewer';
import { colors, nstyles, sizes } from '../../styles';

import AnimatedTabs from "react-native-animated-tabs";

// import { Permission, PERMISSION_TYPE } from './PermisionStorage'
// import { ImgComp } from './ImagesComponent';

export default class ViewImageListShow extends Component {
    constructor(props) {
        super(props);
        let indexDefault = Utils.ngetParam(this, 'index', 0);
        this.ListImages = Utils.ngetParam(this, 'ListImages', []);
        this.link = Utils.ngetParam(this, "link", false)
        this.ListImages = Utils.cloneData(this.ListImages);
        //---Tự động format lại data theo chuẩn: [{ url: 'link....' }]
        //---Và tự bỏ link Video ra khỏi list - Nếu có thể dc
        for (let index = 0; index < this.ListImages.length; index++) {
            const itemTemp = this.ListImages[index];
            //--xử lý format data...
            if (!itemTemp.url)
                this.ListImages[index].url = this.link ? itemTemp.Link : itemTemp.uri;
            //--xử lý loại bỏ link Video
            if (Utils.checkIsVideo(this.ListImages[index].url)) {
                this.ListImages.splice(index, 1);
                if (index < indexDefault) {
                    indexDefault--;
                }
                index--;
            }
        }
        //--------
        this.state = {
            index: indexDefault
        };
        // Utils.nlog('XXXX:', this.ListImages)
    }

    _selectImage = (index) => () => {
        this.setState({ index });
    };

    _renderItemImage = ({ item, index }) => {
        return (
            <TouchableOpacity style={{ zIndex: 99 }} onPress={this._selectImage(index)}>
                <Image
                    // defaultSource={ImgComp.icPhotoBlack}
                    source={{ uri: item.url }}
                    // source={this.link ? { uri: this.link === true ? item.Link : item.url } : ImgComp.icPhotoBlack}
                    style={{ height: sizes.sizes.nImgSize80, width: sizes.sizes.nImgSize80, marginRight: 2 }}
                    resizeMode="cover"
                />
            </TouchableOpacity>
        );
    };

    _renderFooter = () => {
        if (this.ListImages.length == 1)
            return null;
        return (
            <View style={{ width: nstyles.Width(100), backgroundColor: 'transparent', marginBottom: nstyles.paddingBotX, marginTop: 4 }}>
                <FlatList
                    data={this.ListImages}
                    renderItem={this._renderItemImage}
                    keyExtractor={(item, index) => `${index}`}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    ref={(ref) => (this.FLATLIST = ref)}
                />
            </View>
        );
    };

    _goback = () => {
        Utils.goback(this);
    };

    _onchangeImage = (index) => {
        this.FLATLIST.scrollToIndex({ index });
        this.setState({ index });
    };


    // _saveImage = async (url) => {
    //     if (Platform.OS == 'android') {
    //         Linking.openURL(url)
    //     } else {
    //         const checkPermis = await Permission.checkPermissions(PERMISSION_TYPE.storage);
    //         Utils.nlog('permision', checkPermis)
    //         if (checkPermis) {
    //             nthisIsLoading.show();
    //             await CameraRoll.save(url, { type: 'auto' }).then(success => {
    //                 Utils.showMsgBoxOK(this, "Ảnh đã được tải xuống");
    //             }).catch(error => {
    //                 Utils.showMsgBoxOK(this, `${error.message}`);
    //             });
    //             nthisIsLoading.hide();
    //         } else {
    //             if (Platform.OS == 'ios') {
    //                 Utils.showMsgBoxOK(this, 'Thông báo', 'Bạn cần cấp quyền truy cập thư viện ảnh.', 'OK', () => { Linking.openURL('app-settings:') })
    //             }
    //         }

    //     }
    // }

    render() {
        return (
            <View style={[nstyles.nstyles.ncontainer, { backgroundColor: colors.black }]}>
                <View style={{ flex: 1 }}>

                    <AnimatedTabs
                        panelWidth={getPanelWidth()}
                        activePanel={this.state.activePanel}
                        onAnimateFinish={activePanel => this.setState({ activePanel })}
                    >
                        /**
                        Put your card here.
                         <View>
                            <Image source={...} />
                        </View>

                    </AnimatedTabs>
                    {/* <ImageViewer
                        resizeMode={"contain"}
                        onChange={this._onchangeImage}
                        swipeDownThreshold={200}
                        index={this.state.index}
                        loadingRender={() => <ActivityIndicator color="white" size="large" />}
                        enablePreload={true}
                        onSwipeDown={this._goback}
                        enableSwipeDown
                        imageUrls={this.ListImages}
                        // renderFooter={this._renderFooter}
                        menuContext={
                            {
                                saveToLocal: 'Lưu hình',
                                cancel: 'Huỷ'
                            }}
                        onSave={url => this._saveImage(url)}
                    />
                </View>
                {this._renderFooter()}
                <View
                    style={{
                        width: nstyles.Width(100),
                        paddingBottom: 10,
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        right: 0,
                        zIndex: 10
                    }}
                >
                    <View style={[nstyles.nstyles.nrow, {
                        alignItems: 'center', justifyContent: 'space-between',
                        paddingHorizontal: nstyles.khoangcach, marginTop: nstyles.paddingTopMul + 8
                    }]}>
                        <TouchableOpacity onPress={this._goback} style={{ padding: 10 }}>
                            <Image
                                source={ImgComp.icCloseWhite}
                                resizeMode="contain"
                                style={[nstyles.nstyles.nIcon28, { tintColor: colors.white }]}
                            />
                        </TouchableOpacity>
                        <View style={nstyles.nstyles.nIcon20} />
                    </View> */}
                </View>
            </View>
        );
    }
}
