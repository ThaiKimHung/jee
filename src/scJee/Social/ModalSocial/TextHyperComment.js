import React, { Component } from 'react';
import { FlatList, ImageBackground, StyleSheet, Text, TouchableOpacity, View, Linking } from "react-native";
import Hyperlink from 'react-native-hyperlink';
import RNUrlPreview from '../../Component/Common/RNUrlPreview'
import Utils from '../../../app/Utils';
import { Images } from '../../../images';
import { colors } from '../../../styles';
import { reText } from '../../../styles/size';
import { Height, nstyles, Width } from '../../../styles/styles';
import { RootLang } from '../../../app/data/locales';
class TextHyper extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    };

    //đầu vào: string tag phải đúng @ThânAnhTuấn hihi @NguyễnChíSanh  hi @HảiNguyee"
    _bienDoi = (text = '', tag) => {
        const retLines = text?.split("\n");
        const formattedText = [];
        retLines.forEach((retLine) => {
            const words = retLine.split(" ");
            var format = /[ !#@$%^&*()_+\-=\[\]{};':"\\|,.<>\/?\n]/;
            words.forEach((word, index) => {
                const mention = (<Text key={index} ref={ref => this.text = ref} style={{ color: colors.colorTabActive, fontWeight: 'bold' }}>{word}</Text>);
                if (word.startsWith("@") && !format.test(word.substr(1))) {
                    //Tìm trong arr tag nếu mà có thì add vô formattedText(1 tag) ngược là 1 từ bình thường
                    const findTag = tag.find(item => item.Display.replace(/\s/g, '') === word.substr(1))
                    if (findTag) {
                        formattedText.push(mention, ' ');
                    } else {
                        formattedText.push(word, ' ');
                    }
                }
                else {
                    formattedText.push(word, ' ');
                }
            })
        });
        return formattedText
    }

    render() {
        const { item, onPress, khongCheckXemThem = false } = this.props
        return (
            <View >
                {item?.Text?.length > 150 ? (
                    item.check == true ? (
                        <TouchableOpacity activeOpacity={0.5} style={{}}
                            onPress={() => onPress()}>
                            <Hyperlink onPress={(url, text) => Linking.openURL(url)} linkStyle={{ color: '#2D86FF', }}>
                                <Text selectable style={{ color: colors.black, fontSize: reText(14), marginRight: 4, }}>{this._bienDoi(item?.Text, item?.Tag)}</Text>
                            </Hyperlink>
                        </TouchableOpacity>
                    ) : (
                            <TouchableOpacity activeOpacity={0.5} style={{}} onPress={() => onPress()}>
                                <Hyperlink linkStyle={{ color: '#2D86FF', }}>
                                    {
                                        khongCheckXemThem ? // không hiện xem thêm
                                            <Text selectable style={{ color: colors.black, fontSize: reText(14), marginRight: 4, }}>{this._bienDoi(item.Text, item?.Tag)}</Text>
                                            :
                                            <Text selectable style={{ color: colors.black, fontSize: reText(14), marginRight: 4, }}>{this._bienDoi(item.Text.slice(0, 150), item?.Tag)}...</Text>
                                    }
                                </Hyperlink>
                                {
                                    khongCheckXemThem == false && <Text style={{ color: colors.black_20 }}>{RootLang.lang.JeeSocial.xemthem}</Text>
                                }
                            </TouchableOpacity>
                        )
                ) : (
                        <View>
                            <Hyperlink onPress={(url, text) => Linking.openURL(url)} linkStyle={{ color: '#2D86FF', }}>
                                <Text selectable style={{ color: colors.black, fontSize: reText(14), marginRight: 4, }}>{this._bienDoi(item?.Text, item?.Tag)}</Text>
                            </Hyperlink>
                        </View>
                    )}
                {item?.Text && Utils.isUrlCus(item.Text) != "" ?
                    <RNUrlPreview text={item.Text} /> : null}
            </View >
        );
    }
}

const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
const styles = StyleSheet.create({
    textInput: {
        margin: 2,
        paddingHorizontal: 20,
        width: '100%',
        paddingVertical: 15, backgroundColor: colors.white,
        textAlign: 'center', color: colors.black_70
    },
    khung_header: {
        padding: 10,
        height: Width(12),
        justifyContent: 'center'
    },
    khung_react: {

        width: Width(15),
        justifyContent: 'center',
        alignItems: 'center'
    },

});
export default Utils.connectRedux(TextHyper, mapStateToProps, true)

