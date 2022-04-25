import React, { Component } from 'react';
import {
    Image, ImageBackground, StatusBar, Text, TextInput, TouchableOpacity, View
} from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper';
import Utils from '../app/Utils';
import { Images } from '../images';
import WebViewCus from '../Component_old/WebViewCus';
import { nColors, nstyles } from '../styles/styles';

//Deep link Test
htmlTest = `
<html>
    <body>
        <a style="font-size: 50px;" href="tripu123123://app/root/drawer/hotels/confirm/2">Open Appp</a>
    </body>
</html>`;

export default class BrowserInApp extends Component {
    constructor(props) {
        super(props);
        link = this.props.navigation.getParam('link', '');
        istitle = this.props.navigation.getParam('istitle', false);
        isEditUrl = this.props.navigation.getParam('isEditUrl', true);
        title = this.props.navigation.getParam('title', '');
        isHtml = this.props.navigation.getParam('isHtml', false);
        if (isHtml) {
            isEditUrl = false;
            istitle = true;
        }
        this.state = {
            //data globle
            isLoading: false,
            editlink: link
        };
        StatusBar.setHidden(false);
    }

    onBack = () => {
        Utils.goback(this);
        //callback gọi lại để set status bar bên welcome
        let oncallBack = this.props.navigation.getParam('callback', null);
        if (oncallBack != null)
            oncallBack();
    }

    render() {
        return (
            <View style={nstyles.ncontainerX}>
                <View style={[nstyles.nhead]}>
                    <ImageBackground source={isIphoneX() ? Images.JeeHrbackgroundtopX : Images.JeeHrbackgroundtop}
                        style={[nstyles.nHcontent, {
                            paddingHorizontal: 15,
                            height: isIphoneX() ? 80 : 60,
                            width: '100%',
                        }]} resizeMode='cover' >
                        <View style={nstyles.nHleft}>
                            <TouchableOpacity
                                style={{
                                    paddingRight: 20, height: isIphoneX() ? 80 : 60,
                                    alignItems: 'center', justifyContent: 'center'
                                }}
                                activeOpacity={0.5}
                                onPress={this.onBack}>
                                {
                                    <Image
                                        source={Images.icGoBackWhite}
                                        resizeMode={'cover'}
                                        style={{ width: 26, height: 20, borderRadius: 16 }}
                                    />
                                }
                            </TouchableOpacity>
                            {/* <TouchableOpacity onPress={this.onBack} style={{ paddingLeft: 5 }}>
                                <Image source={Images.icGoBackWhite} style={[nstyles.nIcon20]} resizeMode='contain' />
                            </TouchableOpacity> */}
                        </View>
                        <View style={nstyles.nHmid}>
                            {
                                istitle ?
                                    <Text style={[nstyles.ntitle, { color: nColors.main }]}>{title}</Text> :
                                    <View style={{ backgroundColor: 'white', borderRadius: 25, paddingVertical: 3 }}>
                                        <TextInput editable={isEditUrl}
                                            placeholder={this.state.editlink}
                                            value={this.state.editlink}
                                            style={nstyles.ntextinput}
                                        />
                                    </View>
                            }
                        </View>
                        <View style={nstyles.nHright} />
                    </ImageBackground>
                </View>
                <View style={nstyles.nbody}>
                    {
                        isHtml ?
                            <WebViewCus
                                originWhitelist={['*']}
                                source={{ html: link }}
                            /> :
                            <WebViewCus source={{ uri: link }}
                                startInLoadingState={true}
                            />
                    }
                </View>
            </View>
        );
    }
}

