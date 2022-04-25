import React, { Component } from 'react';
import { Animated, BackHandler, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { isIphoneX } from 'react-native-iphone-x-helper';
import { CountReaction, GetDSReaction } from '../../../apis/JeePlatform/Api_JeeSocial/apiJeeSocial';
import { RootLang } from '../../../app/data/locales';
import Utils from '../../../app/Utils';
import IsLoading from '../../../components/IsLoading';
import { Images } from '../../../images';
import { colors } from '../../../styles';
import { reText } from '../../../styles/size';
import { nstyles, Width } from '../../../styles/styles';
import ImageCus from '../../../components/NewComponents/ImageCus';

class Modal_ShowEmoji extends Component {
    constructor(props) {
        super(props);
        this.idbaidang = Utils.ngetParam(this, 'idbaidang', '')
        this.state = {
            opacity: new Animated.Value(0),
            refreshing: false,
            listReact: [],
            listUser_React: [],
            loai: { id_like: '0', title: 'Tất cả' },
        }
        this.menu = [
            { id_like: '0', title: 'Tất cả' },
            { id_like: '1', title: 'Like' },
            { id_like: '2', title: 'Love' },
            { id_like: '3', title: 'Haha' },
            { id_like: '4', title: 'Wow' },
            { id_like: '5', title: 'Sad' },
            { id_like: '6', title: 'Care' },
            { id_like: '7', title: 'Angry' }
        ];
    };

    _goback = () => {
        Utils.goback(this);
        return true
    }

    componentDidMount = () => {
        BackHandler.addEventListener("hardwareBackPress", this._goback);
        nthisLoading.show()
        this._countReaction().then(res => {
            if (res == true) {
                this._getDSReaction().then(res => {
                    if (res == true) (
                        nthisLoading.hide()
                    )
                })
            }
        });
    }


    componentWillUnmount() {
        try {
            BackHandler.removeEventListener('hardwareBackPress', this._goback)
        }
        catch (error) {
        }
    }

    _countReaction = async () => {
        let res = await CountReaction(this.idbaidang)
        // Utils.nlog('res _countReaction', res)
        if (res.status == 1) {
            let tempData = res.data;
            tempData.push({ id_like: 0, tong: 0, title: 'Tất cả' })
            this.menu.map(item => res.data.map(item2 => {
                if (item.id_like == item2.id_like) {
                    nthisLoading.hide()
                    this.setState({ listReact: this.state.listReact.concat(item) })
                }
            }))
        } else {
            this.setState({ refreshing: false, showload: false, empty: true, })
        }
        return true
    }

    _getDSReaction = async () => {
        let res = await GetDSReaction(this.idbaidang, this.state.loai.id_like)
        // Utils.nlog('res _getDSReaction', res)
        if (res.status == 1) {
            nthisLoading.hide()
            this.setState({
                listUser_React: res.data,
            })
        } else {
            this.setState({ refreshing: false, showload: false, empty: true })
        }
        return true
    }

    _icon_Emoji = (id) => {
        switch (id) {
            case 'Like': return Images.ImageJee.ic_DaLike;
            case 'Love': return Images.ImageJee.icLove;
            case 'Haha': return Images.ImageJee.icHaHa;
            case 'Wow': return Images.ImageJee.icWow;
            case 'Sad': return Images.ImageJee.icSad;
            case 'Care': return Images.ImageJee.icThuong;
            case 'Angry': return Images.ImageJee.icAngry;
        }
    }

    _icon_Emoji_anh = (id) => {
        switch (id) {
            case 1: return Images.ImageJee.ic_DaLike;
            case 2: return Images.ImageJee.icLove;
            case 3: return Images.ImageJee.icHaHa;
            case 4: return Images.ImageJee.icWow;
            case 5: return Images.ImageJee.icSad;
            case 6: return Images.ImageJee.icThuong;
            case 7: return Images.ImageJee.icAngry;
            default: return Images.ImageJee.icLike;
        }
    }

    _renderItem = ({ item, index }) => {
        return (
            <View style={{ flexDirection: 'row', paddingHorizontal: 10, padding: 10 }}>
                <View>
                    <ImageCus
                        style={nstyles.nAva35}
                        source={{ uri: item?.user[0]?.Avatar }}
                        resizeMode={"cover"}
                        defaultSourceCus={Images.icAva}
                    />
                    <View style={{
                        zIndex: 1, position: 'absolute', justifyContent: 'flex-end', right: 0, bottom: 0, shadowColor: '#000',
                        shadowOffset: { width: 2, height: 0 }, shadowOpacity: 1, shadowRadius: 5, elevation: 1,
                    }}>
                        <Image
                            source={this._icon_Emoji_anh(item.Id_Like)}
                            resizeMode='contain' style={[nstyles.nIcon16, {}]} />
                    </View>
                </View>

                <View style={{ justifyContent: 'center', paddingLeft: 10 }}>
                    <Text>{item?.user[0]?.Fullname}</Text>
                </View>
            </View>
        );
    }

    _renderItem_Loai = ({ item, index }) => {
        return (
            <View style={[styles.khung_header, { borderBottomWidth: 1, borderColor: this.state.loai.id_like == item.id_like ? colors.black_20 : colors.white }]}>
                <TouchableOpacity
                    onPress={() => {
                        nthisLoading.show()
                        this.setState({ loai: item }, () => { this._getDSReaction() })
                    }}
                    style={[styles.khung_react, {
                        shadowColor: '#000', shadowOffset: { width: 3, height: 0 }, shadowOpacity: 0.5, shadowRadius: 5, elevation: 1, padding: item.title == 'Tất cả' ? 0 : 10
                    }]}>
                    {
                        item.title == 'Tất cả' ? (
                            <Text style={{ fontSize: reText(16), paddingVertical: 5 }}>{item.title}</Text>

                        ) : (
                                <Image
                                    source={this._icon_Emoji(item.title)}
                                    resizeMode='contain' style={[nstyles.nIcon20, {}]} />
                            )
                    }
                </TouchableOpacity>
            </View>
        );
    }


    render() {
        const { opacity, refreshing, listReact, listUser_React } = this.state;
        const { data } = this.props
        return (
            <View style={[nstyles.ncontainer, {}]}>
                <View style={[nstyles.nHcontent, { paddingHorizontal: 15, height: isIphoneX() ? 85 : 65, width: '100%', borderBottomWidth: 0.3, borderColor: '#D1D1D1' }]} resizeMode='cover' >
                    <View style={[nstyles.nrow, {
                        flexDirection: 'row', flex: 1, height: isIphoneX() ? 85 : 65, justifyContent: 'center', alignItems: 'center'
                    }]}>
                        <TouchableOpacity
                            style={{
                                paddingRight: 20, height: isIphoneX() ? 85 : 65, alignItems: 'center', justifyContent: 'center'
                            }}
                            activeOpacity={0.5}
                            onPress={this._goback}>
                            <View style={{ flexDirection: 'row', }}>
                                <Image
                                    source={Images.ImageJee.icBack}
                                    resizeMode={'cover'}
                                    style={[{ tintColor: "#707070" }]}
                                />
                            </View>
                        </TouchableOpacity>
                        <View
                            style={{
                                flex: 1,
                                alignItems: 'center',
                                height: isIphoneX() ? 85 : 65,
                                flexDirection: 'row',
                            }} >
                            <View style={{ flex: 1, paddingVertical: Platform.OS == 'ios' ? 15 : 3, }}>
                                <Text style={{ fontSize: reText(16), fontWeight: '600' }}>{RootLang.lang.JeeSocial.nguoidabaytocamxuc}</Text>
                            </View>
                        </View>
                    </View>
                </View >

                <View style={{ flex: 1, backgroundColor: colors.white, paddingBottom: 15 }}>
                    <View>
                        <FlatList
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            horizontal
                            data={listReact}
                            renderItem={this._renderItem_Loai}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <FlatList
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            refreshing={refreshing}
                            onRefresh={this._onRefresh}
                            data={listUser_React}
                            renderItem={this._renderItem}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>

                </View>
                <IsLoading />
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
export default Utils.connectRedux(Modal_ShowEmoji, mapStateToProps, true)
