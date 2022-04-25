import CameraRoll from '@react-native-community/cameraroll';
import React, { Component } from 'react';
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import { RootLang } from '../app/data/locales';
import Utils from '../app/Utils';
import { Images } from '../images';
import { colors, nstyles, sizes } from '../styles';
import IsLoading from './IsLoading';

export default class ViewImageListShowBase64 extends Component {
    constructor(props) {
        super(props);
        this.nthis = this.props.nthis;
        this.state = {
            index: Utils.ngetParam(this, 'index', 0)
        };
        this.ListImages = Utils.ngetParam(this, 'ListImages', []);
    }
    _selectImage = (index) => () => {
        this.setState({ index });
    };

    _renderItemImage = ({ item, index }) => {
        return (
            <TouchableOpacity style={{ zIndex: 1 }} onPress={this._selectImage(index)}>
                <Image
                    defaultSource={Images.icPhotoBlack}
                    source={{ uri: item.url }}
                    style={{ height: sizes.reSize(80), width: sizes.reSize(80), marginRight: 2 }}
                    resizeMode="cover"
                />
            </TouchableOpacity>
        );
    };
    _renderFooter = () => {
        if (this.ListImages.length <= 1)
            return null;
        return (
            <View style={{ width: nstyles.Width(100), backgroundColor: 'transparent', marginBottom: nstyles.paddingBotX }}>
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

    _saveImage = async (url) => {
        // nthisIsLoading.show();
        const res = await CameraRoll.saveToCameraRoll(url, 'photo');
        // nthisIsLoading.hide();

        Utils.nlog(res)
    }

    renderHeaderCustom = (currentIndex = 0, allSize = 0) => {
        return (
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
                    paddingHorizontal: 20, marginTop: nstyles.paddingTopMul + 8
                }]}>
                    <View style={nstyles.nstyles.nIcon22} />
                    {
                        allSize == 1 ? null :
                            <Text style={{ color: colors.white, fontSize: sizes.reText(17), fontWeight: '600' }}>
                                {currentIndex}/{allSize}
                            </Text>
                    }
                    <TouchableOpacity onPress={this._goback} style={{ padding: 5 }}>
                        <Image
                            source={Images.icClose}
                            resizeMode="contain"
                            style={[nstyles.nstyles.nIcon17, { tintColor: colors.white }]}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    render() {
        return (
            <View style={[nstyles.nstyles.ncontainer, { backgroundColor: 'transparent' }]}>
                <ImageViewer
                    // onChange={this._onchangeImage}
                    swipeDownThreshold={200}
                    index={this.state.index}
                    loadingRender={() => <ActivityIndicator color="white" size="large" />}
                    enablePreload={true}
                    onSwipeDown={this._goback}
                    enableSwipeDown
                    imageUrls={this.ListImages}

                    renderIndicator={(currentIndex, allSize) => this.renderHeaderCustom(currentIndex, allSize)}
                    renderFooter={this._renderFooter}
                    menuContext={
                        {
                            saveToLocal: RootLang.lang.thongbaochung.luuhinh,
                            cancel: RootLang.lang.thongbaochung.xemlai
                        }}
                // onSave={url => this._saveImage(url)}
                />
                <IsLoading />
            </View>
        );
    }
}
