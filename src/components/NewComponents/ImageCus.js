import React, { Component } from 'react';
import { ActivityIndicator, View, StyleSheet, Image } from 'react-native';
import PropTypes from 'prop-types';
import FastImage, { FastImageProps } from 'react-native-fast-image';

export default class ImageCus extends Component<FastImageProps> {
    constructor(props) {
        super(props);
        this.state = {
            isLoadError: false,
            isLoadEnd: false
        }
    }

    render() {
        const { defaultSourceCus, defaultSourceLoading, source = {}, colorLoading = '#36bfbf', } = this.props;
        const { isLoadError, isLoadEnd } = this.state;
        const { uri = '' } = source;
        const tintColor = this.props?.tintColor || this.props?.style?.tintColor || undefined;
        const borderRadius = this.props?.borderRadius || this.props?.style?.borderRadius || undefined;
        return (
            <View  {...this.props}>
                {/* {Một số style của Image (RN) là 1 props của thẻ FastImage } */}
                {
                    uri && uri.includes('ph://') ? // Hình ảnh local IOS từ CameraScroll phải dùng thẻ Image mới hiển thị
                        <Image
                            {...this.props}
                            source={isLoadError || uri == "" ? defaultSourceCus : source}
                            onError={() => this.setState({ isLoadError: true })}
                            onLoadEnd={() => this.setState({ isLoadEnd: true })}
                        /> :
                        <FastImage
                            tintColor={tintColor ? tintColor : undefined}
                            borderRadius={borderRadius}
                            {...this.props}
                            source={isLoadError || uri == "" ? (defaultSourceCus || source) : source}
                            onError={() => this.setState({ isLoadError: true })}
                            onLoadEnd={() => this.setState({ isLoadEnd: true })}
                        />
                }
                {isLoadEnd || uri == "" ? null : <ActivityIndicator style={{ ...StyleSheet.absoluteFillObject }} size={'small'} color={colorLoading} />}
            </View>
        );
    }
}

ImageCus.defaultProps = {
    defaultSourceCus: undefined,
    defaultSourceLoading: undefined,
    colorLoading: '#0B9363'
};

ImageCus.propTypes = {
    defaultSourceCus: PropTypes.any,
    defaultSourceLoading: PropTypes.any,
    colorLoading: PropTypes.string
};