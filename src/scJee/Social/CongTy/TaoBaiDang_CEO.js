import React, { Component } from 'react';
import { Animated, BackHandler, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { isIphoneX } from 'react-native-iphone-x-helper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { InserItem_DanhMuc_MemuLeft } from '../../../apis/JeePlatform/Api_JeeSocial/apiJeeSocial';
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import { RootLang } from '../../../app/data/locales';
import Utils from '../../../app/Utils';
import UtilsApp from '../../../app/UtilsApp';
import IsLoading from '../../../components/IsLoading';
import { Images } from '../../../images';
import { colors } from '../../../styles';
import { reText, sizes } from '../../../styles/size';
import { Height, nstyles, Width } from '../../../styles/styles';

class TaoBaiDang_CEO extends Component {
    constructor(props) {
        super(props);

        this.state = {
            opacity: new Animated.Value(0),
            images: '',
            noiDung: '',
            title: '',
            data: Utils.ngetParam(this, 'data', ''),
        };
    }

    componentDidMount = async () => {
        BackHandler.addEventListener("hardwareBackPress", this._goback);
    }

    componentWillUnmount() {
        try {
            BackHandler.removeEventListener('hardwareBackPress', this._goback)
        }
        catch (error) { }
    }

    _goback = async () => {
        Utils.goback(this, null)
        return true
    }

    _CusTom_Bottom = () => {
        return (
            <View style={{
                position: "absolute", bottom: 0, height: '6%', borderColor: '#707070',
                paddingTop: 5, width: "100%", justifyContent: 'center', borderBottomWidth: 0.3, borderTopWidth: 0.3
            }}>
                <View style={[{ flexDirection: "row", marginHorizontal: 15, justifyContent: 'space-between', }]}>
                    <View style={{}}>
                        <Text style={{ fontSize: reText(12), textAlign: 'center' }}>{RootLang.lang.JeeSocial.themvaobaiviet}</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: 'center' }}>

                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: 'center' }}>
                            <TouchableOpacity style={{ paddingRight: 20 }}
                                onPress={() => this._go_PickImage()}
                            >
                                <Image source={Images.ImageJee.icChonAnh}
                                    resizeMode='contain' style={nstyles.nIcon19} />
                            </TouchableOpacity>
                            <TouchableOpacity style={{ paddingRight: 20 }}>
                                <Image source={Images.ImageJee.icLink}
                                    resizeMode='contain' style={[nstyles.nIcon19, { paddingHorizontal: 2, tintColor: '#FF3D2E' }]} />
                            </TouchableOpacity >
                            <TouchableOpacity style={{}} onPress={() => this._go_UserTag()} >
                                <Image source={Images.ImageJee.icUserTag}
                                    resizeMode='contain' style={[nstyles.nIcon19, { paddingHorizontal: 2 }]} />
                            </TouchableOpacity >
                        </View>
                    </View>

                </View>
            </View>
        )
    }

    _callbackImage = async (images) => {
        await this.setState({
            images,
        })
    }

    _go_PickImage = () => {
        Utils.goscreen(this, 'Modal_SelectImageVideo', {
            callback: this._callbackImage,
        })
    }

    _renderItem_Anh = ({ item, index }) => {
        return (
            <TouchableOpacity
                style={{ height: Height(50), marginTop: 10 }}>
                <View style={[{}]}>
                    <Image
                        style={{ width: Width(100), height: Height(50) }}
                        source={item}
                        resizeMode='cover'
                    />
                    <TouchableOpacity style={{ position: 'absolute', top: 0, right: 0, marginRight: 5, marginTop: 5 }}>
                        <Image source={Images.ImageJee.icXoaAnh} resizeMode='cover' />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity >
        );
    }

    _taoDanhMuc = async (loaibaidang) => {
        let strbody = JSON.stringify({
            "list_itemsubMenu": [
                {
                    "title": this.state.title,
                    "id_menu": this.state.data?.id_menu,
                    "title_submenu": this.state.title,
                }
            ],
        })
        // Utils.nlog('body', strbody)
        nthisLoading.show()
        let res = await InserItem_DanhMuc_MemuLeft(strbody)
        // Utils.nlog('res đăng bài =--=-=-==-=-=-=-', res)
        if (res.status == 1) {
            nthisLoading.hide()
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.JeeSocial.taothanhcong, 1)
            this._goback()
            ROOTGlobal.LoadDanhSach_CeoLetter.LoadDSCeo()
        } else {
            nthisLoading.hide()
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
        }
    }

    render() {
        var { opacity, noiDung, images } = this.state
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: colors.white, }]}>
                <View
                    style={[nstyles.nHcontent, {
                        paddingHorizontal: 15,
                        height: isIphoneX() ? 80 : 60,
                        width: '100%',
                        borderBottomColor: colors.black_20_2,
                        borderBottomWidth: 0.3
                    }]} resizeMode='cover' >
                    <View style={[nstyles.nrow, {
                        flexDirection: 'row', flex: 1,
                        height: isIphoneX() ? 80 : 60,
                        justifyContent: 'center', alignItems: 'center'
                    }]}>
                        <TouchableOpacity
                            style={{
                                paddingRight: 20, height: isIphoneX() ? 80 : 60,
                                alignItems: 'center', justifyContent: 'center'
                            }}
                            activeOpacity={0.5}
                            onPress={this._goback}
                        >
                            <View style={{ flexDirection: 'row', }}>
                                <Image
                                    source={Images.ImageJee.icBack}
                                    resizeMode={'cover'}
                                    style={[{ tintColor: colors.black }]}
                                />
                            </View>
                        </TouchableOpacity>
                        <View
                            style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: this.state.title ? 0 : 50,
                                height: isIphoneX() ? 80 : 60,
                                marginLeft: 10
                            }}>
                            <Text style={{
                                lineHeight: sizes.sText24,
                                fontSize: reText(15),
                                color: '#65676B',
                                fontWeight: "bold"
                            }}>{this.state.data?.title}</Text>
                        </View>
                        {this.state.title ? (
                            <TouchableOpacity
                                onPress={() => this._taoDanhMuc()}
                                style={[{ paddingLeft: 20, paddingVertical: 5 }]}>
                                <Text style={{ color: '#0E72D8', fontSize: reText(15), fontWeight: 'bold' }}>{RootLang.lang.JeeSocial.luu} </Text>
                            </TouchableOpacity>
                        ) : (null)}
                    </View>
                </View >
                <KeyboardAwareScrollView >
                    <View style={{ flex: 1, paddingBottom: 10, }}>
                        <View style={{}}>
                            <TextInput
                                style={{
                                    color: "black",
                                    fontWeight: 'bold',
                                    flex: 1,
                                    paddingHorizontal: 10,
                                    paddingTop: 10
                                }}
                                onChangeText={(text) => {
                                    this.setState({ title: text, });
                                }}
                                placeholder={RootLang.lang.JeeSocial.tieudeCeo}
                                autoCorrect={false}
                                multiline={true}
                                underlineColorAndroid="rgba(0,0,0,0)"
                            >
                                {this.state.title}
                            </TextInput>
                        </View>
                    </View>
                    {/* {this._CusTom_Bottom()} */}
                </KeyboardAwareScrollView>
                <IsLoading />
            </View >
        )
    }
}

const mapStateToProps = state => ({
    lang: state.changeLanguage.language,
});
export default Utils.connectRedux(TaoBaiDang_CEO, mapStateToProps, true)