import React, { Component } from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, FlatList } from 'react-native';
import { appConfig } from '../app/Config';
import { RootLang } from '../app/data/locales';
import Utils from '../app/Utils';
import { colors } from '../styles/color';
import { sizes } from '../styles/size';
import { Height, nstyles, Width } from '../styles/styles';
import FBCollage from 'react-native-fb-collage';
import FastImage from 'react-native-fast-image'
import LottieView from 'lottie-react-native';
export default class Render_Images extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false
        };
    }

    render() {

        var { defaultImage, ImageNetWork, styImages, resizeModeFastImage, resizeModeIamge } = this.props
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: colors.white, }]}>


                {defaultImage == null || defaultImage == '' ? (
                    <View style={{ justifyContent: "center", alignItems: "center", height: Height(25), width: Width(100), }}>
                        <LottieView style={{ height: Width(60) }} source={require('../images/lottieJee/404.json')} autoPlay loop />
                    </View>
                ) : (
                        <View >
                            {ImageNetWork &&
                                <FastImage
                                    style={[{ width: Width(100), height: Height(10) }, styImages]}
                                    source={{
                                        uri: ImageNetWork,
                                        // priority: FastImage.priority.high,
                                    }}
                                    resizeMode={resizeModeFastImage ? resizeModeFastImage : FastImage.resizeMode.contain}
                                    onError={() => { this.setState({ error: !this.state.error }) }}
                                    fallback={this.state.error == false ? false : true}
                                ></FastImage>
                            }
                        </View>
                    )}
            </View>
        );
    }
}