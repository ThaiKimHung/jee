import React, { Component } from 'react';
import { FlatList, ImageBackground, Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Hyperlink from 'react-native-hyperlink';
import { RootLang } from '../../../app/data/locales';
import Utils from '../../../app/Utils';
import { Images } from '../../../images';
import { colors } from '../../../styles';
import { reText } from '../../../styles/size';
import { Height, nstyles, Width } from '../../../styles/styles';
import RNUrlPreview from '../../Component/Common/RNUrlPreview';
import ImageCus from '../../../components/NewComponents/ImageCus';
class TextHyper extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    };

    renderImageBG = (item) => {
        switch (item) {
            case 'bg1': return Images.ImageJee.icBG1;
            case 'bg2': return Images.ImageJee.icBG2;
            case 'bg3': return Images.ImageJee.icBG3;
            case 'bg4': return Images.ImageJee.icBG4;
        }
    }

    _renderItem_KhenThuong_Anh = ({ item, index }) => {
        return (
            <TouchableOpacity
                style={{ alignItems: 'center', paddingHorizontal: 5, justifyContent: 'center' }}>
                <ImageCus
                    style={[nstyles.nAva32, {}]}
                    source={{ uri: item.avatar }}
                    resizeMode={"cover"}
                    defaultSourceCus={Images.icAva}
                />
            </TouchableOpacity >
        );
    }

    render() {
        const { item, onPress, chitiet = false } = this.props
        if (chitiet == false) {
            return (
                <View >
                    {
                        item.Id_LoaiBaiDang == 1 ? (// thông báo
                            <View style={{ paddingHorizontal: 5, paddingVertical: 5 }}>
                                {item.NoiDung.length > 150 ? (
                                    item.check == true ? (
                                        <TouchableOpacity
                                            style={{}} activeOpacity={0.5}
                                            onPress={() => onPress()}>
                                            <Text selectable style={{ fontSize: reText(16), fontWeight: 'bold', marginBottom: 5 }}>{item.title}</Text>
                                            {
                                                item.NoiDung ?
                                                    <Hyperlink onPress={(url, text) => Linking.openURL(url)} linkStyle={{ color: '#2D86FF', }}>
                                                        <Text selectable style={{ color: colors.black, fontSize: reText(14) }}>{item.NoiDung}</Text>
                                                    </Hyperlink>
                                                    : null
                                            }
                                        </TouchableOpacity>
                                    ) : (
                                            <TouchableOpacity
                                                style={{}} activeOpacity={0.5} onPress={() => onPress()}>
                                                <Text selectable style={{ fontSize: reText(16), fontWeight: 'bold', marginBottom: 5 }}>{item.title}</Text>
                                                <Hyperlink linkStyle={{ color: '#2D86FF', }}>
                                                    <Text selectable style={{ color: colors.black, fontSize: reText(14) }}>
                                                        {`${item.NoiDung.slice(0, 150)} ... `}
                                                    </Text>
                                                </Hyperlink>
                                                <Text style={{ color: colors.black_20 }}>{RootLang.lang.JeeSocial.xemthem}</Text>
                                            </TouchableOpacity>
                                        )
                                ) : (
                                        <View>
                                            <Text selectable style={{ fontSize: reText(16), fontWeight: 'bold', marginBottom: 5 }}>{item.title}</Text>
                                            {
                                                item.NoiDung ?
                                                    <Hyperlink onPress={(url, text) => Linking.openURL(url)} linkStyle={{ color: '#2D86FF', }}>
                                                        <Text selectable style={{ color: colors.black, fontSize: reText(14) }}>{item.NoiDung}</Text>
                                                    </Hyperlink>
                                                    : null
                                            }
                                        </View>
                                    )}

                            </View>
                        ) : (//Chào mừng,Sinh nhật, Khen thưởng
                                item.Id_LoaiBaiDang == 2 ? (
                                    <ImageBackground source={this.renderImageBG(item.template)} imageStyle={{ height: Height(30), }} resizeMode='cover' style={{ height: Height(30) }}>
                                        <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 20 }}>
                                            <FlatList
                                                showsHorizontalScrollIndicator={false}
                                                showsVerticalScrollIndicator={false}
                                                style={{ maxWidth: Width(90), height: Height(5), }}
                                                horizontal={true}
                                                data={item.KhenThuong}
                                                renderItem={this._renderItem_KhenThuong_Anh}
                                                keyExtractor={(item, index) => index.toString()}
                                            />
                                            <View style={{ paddingHorizontal: 5 }}>
                                                {item.NoiDung.length > 150 ? (
                                                    item.check == true ? (
                                                        <TouchableOpacity
                                                            style={{}} activeOpacity={0.5}
                                                            onPress={() => onPress()}>
                                                            <Text selectable style={{ fontSize: reText(16), fontWeight: 'bold', textAlign: 'center', color: item.template != "bg1" ? colors.white : colors.black }}>{item.title}</Text>
                                                            <Text selectable style={{ color: colors.black, textAlign: 'center', color: item.template != "bg1" ? colors.white : colors.black }}>{item.NoiDung}</Text>
                                                        </TouchableOpacity>
                                                    ) : (
                                                            <TouchableOpacity
                                                                style={{}} activeOpacity={0.5} onPress={() => onPress()}>
                                                                <Text selectable style={{ fontSize: reText(16), textAlign: 'center', fontWeight: 'bold', color: item.template != "bg1" ? colors.white : colors.black }}>{item.title}</Text>
                                                                <Hyperlink
                                                                    onPress={(url, text) => Linking.openURL(url)} linkStyle={{ color: '#2D86FF', }}>
                                                                    <Text selectable style={{ color: item.template != "bg1" ? colors.white : colors.black }}> {`${item.NoiDung.slice(0, 150)} ... `} </Text>
                                                                </Hyperlink>
                                                                <Text style={{ color: colors.black_20 }}>{RootLang.lang.JeeSocial.xemthem}</Text>
                                                            </TouchableOpacity>
                                                        )
                                                ) : (
                                                        <View>
                                                            <Text selectable style={{ fontSize: reText(16), textAlign: 'center', fontWeight: 'bold', color: item.template != "bg1" ? colors.white : colors.black }}>{item.title}</Text>
                                                            <Hyperlink onPress={(url, text) => Linking.openURL(url)} linkStyle={{ color: '#2D86FF', }}>
                                                                <Text selectable style={{ color: item.template != "bg1" ? colors.white : colors.black }}>{item.NoiDung}</Text>
                                                            </Hyperlink>
                                                        </View>
                                                    )}
                                            </View>
                                        </View>
                                    </ImageBackground>
                                ) : (// thảo luận
                                        item.Id_LoaiBaiDang == 3 ? (
                                            <View style={{ paddingHorizontal: 5, paddingVertical: 5 }}>
                                                {item.NoiDung.length > 150 ? (
                                                    item.check == true ? (
                                                        <TouchableOpacity
                                                            activeOpacity={0.5}
                                                            onPress={() => onPress()}>
                                                            <Hyperlink
                                                                onPress={(url, text) => Linking.openURL(url)}
                                                                linkStyle={{ color: '#2D86FF', }}>
                                                                <Text selectable style={{ color: colors.black }}>{item.NoiDung}</Text>
                                                            </Hyperlink>
                                                        </TouchableOpacity>
                                                    ) : (
                                                            <TouchableOpacity
                                                                activeOpacity={0.5}
                                                                onPress={() => onPress()}>
                                                                <Hyperlink
                                                                    onPress={(url, text) => Linking.openURL(url)}
                                                                    linkStyle={{ color: '#2D86FF', }}>
                                                                    <Text selectable style={{ color: colors.black }}>
                                                                        {`${item.NoiDung.slice(0, 150)} ... `}
                                                                    </Text>
                                                                </Hyperlink>
                                                                <Text style={{ color: colors.black_20 }}>{RootLang.lang.JeeSocial.xemthem} </Text>
                                                            </TouchableOpacity>
                                                        )
                                                ) : (
                                                        <View>
                                                            {
                                                                item.NoiDung ? (
                                                                    <Hyperlink onPress={(url, text) => Linking.openURL(url)} linkStyle={{ color: '#2D86FF', }}>
                                                                        <Text selectable style={{ color: colors.black }}>{item.NoiDung}</Text>
                                                                    </Hyperlink>
                                                                ) : (null)
                                                            }
                                                        </View>
                                                    )}
                                            </View>
                                        ) : (null)
                                    )
                            )
                    }
                    {
                        item.NoiDung && Utils.isUrlCus(item.NoiDung) != "" ?
                            <RNUrlPreview text={item.NoiDung} /> : null
                    }
                </View >
            );
        }
        else {
            return (
                <View >
                    {
                        item.Id_LoaiBaiDang == 1 ? (
                            <View style={{ paddingHorizontal: 5, paddingVertical: 5 }}>
                                <Text selectable style={{ fontSize: reText(16), fontWeight: 'bold', marginBottom: 5 }}>{item.title}</Text>
                                {
                                    item.NoiDung ?
                                        <Hyperlink onPress={(url, text) => Linking.openURL(url)} linkStyle={{ color: '#2D86FF', }}>
                                            <Text selectable style={{ color: colors.black, fontSize: reText(14) }}>{item.NoiDung}</Text>
                                        </Hyperlink>
                                        : null
                                }
                            </View>
                        ) : (
                                item.Id_LoaiBaiDang == 2 ? (
                                    <ImageBackground source={this.renderImageBG(item.template)} imageStyle={{ height: Height(30), }} resizeMode='cover' style={{ height: Height(30) }}>
                                        <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 20 }}>
                                            <FlatList
                                                showsHorizontalScrollIndicator={false}
                                                showsVerticalScrollIndicator={false}
                                                // scrollEnabled={false}
                                                style={{ maxWidth: Width(90), height: Height(5), }}
                                                horizontal={true}
                                                data={item.KhenThuong}
                                                renderItem={this._renderItem_KhenThuong_Anh}
                                                keyExtractor={(item, index) => index.toString()}
                                            />

                                            <View>
                                                <Text selectable style={{ fontSize: reText(16), textAlign: 'center', fontWeight: 'bold', color: item.template != "bg1" ? colors.white : colors.black }}>{item.title}</Text>
                                                <Hyperlink onPress={(url, text) => Linking.openURL(url)} linkStyle={{ color: '#2D86FF', }}>
                                                    <Text selectable style={{ color: item.template != "bg1" ? colors.white : colors.black }}>{item.NoiDung}</Text>
                                                </Hyperlink>
                                            </View>

                                        </View>
                                    </ImageBackground>
                                ) : (
                                        item.Id_LoaiBaiDang == 3 ? (
                                            <View style={{ paddingHorizontal: 5, paddingVertical: 5 }}>
                                                {
                                                    item.NoiDung ? (
                                                        <Hyperlink onPress={(url, text) => Linking.openURL(url)} linkStyle={{ color: '#2D86FF', }}>
                                                            <Text selectable style={{ color: colors.black }}>{item.NoiDung}</Text>
                                                        </Hyperlink>
                                                    ) : (null)
                                                }
                                            </View>
                                        ) : (null)
                                    )
                            )
                    }
                    {item.NoiDung && Utils.isUrlCus(item.NoiDung) != "" ?
                        <RNUrlPreview text={item.NoiDung} /> : null}
                </View >
            );
        }

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

