import React, { PureComponent } from 'react';
import {
    ActivityIndicator, Animated,
    FlatList, Image, ImageBackground, Linking,
    StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View
} from "react-native";
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import { RootLang } from '../../../app/data/locales';
import { nkey } from '../../../app/keys/keyStore';
import Utils from '../../../app/Utils';
import { Images } from '../../../images';
import { colors } from '../../../styles';
import { sizes, reText } from '../../../styles/size';
import { Height, nstyles, Width } from '../../../styles/styles';
class ButtonTaoBaiDang extends PureComponent {

    constructor(props) {
        super(props);
        this.nthis = this.props.nthis;
    };
    render() {
        const { title = '' } = this.props
        return (
            <View style={styles.container}  >
                <TouchableOpacity style={styles.tou}
                    onPress={this.props.onPress}>
                    <Image source={Images.ImageJee.icTouchSocail}
                        resizeMode='cover'
                        style={styles.image}>
                    </Image>
                    <Text style={styles.text}>{title ? title : RootLang.lang.JeeSocial.taobaidangmoi}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        paddingBottom: 5
    },
    tou: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: Width(100)
    },
    text: {
        color: colors.white,
        fontSize: reText(15),
        position: 'absolute'
    }
});


const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(ButtonTaoBaiDang, mapStateToProps, true)