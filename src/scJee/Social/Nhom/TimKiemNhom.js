import React, { Component } from 'react';
import { Animated, BackHandler, FlatList, Image, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import { isIphoneX } from 'react-native-iphone-x-helper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { DsGroup } from '../../../apis/JeePlatform/Api_JeeSocial/apiJeeSocial';
import { RootLang } from '../../../app/data/locales';
import Utils from '../../../app/Utils';
import UtilsApp from '../../../app/UtilsApp';
import IsLoading from '../../../components/IsLoading';
import ListEmpty from '../../../components/ListEmpty';
import { Images } from '../../../images';
import { colors } from '../../../styles';
import { reText } from '../../../styles/size';
import { nstyles, paddingBotX } from '../../../styles/styles';

class TimKiemNhom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            noidung_Tk: '',
            opacity: new Animated.Value(0),
            searchText: '',
            filteredData: [],
            dsgroup: [],
        };
        this.nthis = this.props.nthis;
    }
    componentDidMount = async () => {
        BackHandler.addEventListener("hardwareBackPress", this._goback);
        await this._dsGroup()
    }

    componentWillUnmount() {
        try {
            BackHandler.removeEventListener('hardwareBackPress', this._goback)
        }
        catch (error) {
        }
    }

    _goback = async () => {
        Utils.goback(this, null)
        return true
    }

    _dsGroup = async () => {
        nthisLoading.show()
        let res = await DsGroup();
        // Utils.nlog(' res group', res)
        if (res.status == 1) {
            nthisLoading.hide()
            this.setState({ dsgroup: res.data })
        }
        else {
            nthisLoading.hide()
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
        }
    }

    _search = (searchText) => {
        this.setState({ searchText: searchText });
        let filteredData = this.state.dsgroup.filter((item) =>
            Utils.removeAccents(item['Ten_Group'])
                .toUpperCase()
                .includes(Utils.removeAccents(searchText.toUpperCase())),
        );
        this.setState({ filteredData: filteredData });
    };

    _goModalXemBaiDangNhom = (item) => {
        Utils.goscreen(this, 'sc_XemBaiDangTrongNhom', { nthis: this, title: item })
    }

    _renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity
                onPress={() => this._goModalXemBaiDangNhom(item)}
                style={{ backgroundColor: colors.white, padding: 10 }}>
                <Text style={{ fontSize: reText(12), color: '#65676B' }}>{item.Ten_Group}</Text>
            </TouchableOpacity >
        );
    }

    render() {
        var { searchText, dsgroup, filteredData } = this.state
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: '#E4E6EB', }]}>
                <View style={[nstyles.nHcontent, { paddingHorizontal: 15, height: isIphoneX() ? 85 : 65, width: '100%', borderBottomWidth: 0.3, borderColor: '#D1D1D1', }]} resizeMode='cover' >
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
                            <Image source={Images.ImageJee.icTimKiemTextInput} resizeMode='cover' style={{ marginRight: 5 }} />
                            <View style={{ flex: 1, paddingVertical: Platform.OS == 'ios' ? 15 : 3, }}>
                                <TextInput
                                    style={{}}
                                    placeholder={RootLang.lang.JeeSocial.timkiem}
                                    onChangeText={this._search}
                                    underlineColorAndroid="transparent"
                                />
                            </View>
                        </View>
                    </View>
                </View >

                <View style={{ flex: 1, backgroundColor: colors.white, paddingBottom: paddingBotX }}>
                    <View style={{ backgroundColor: colors.white, flex: 1 }}>
                        <KeyboardAwareScrollView
                            keyboardDismissMode='on-drag'
                            scrollEnabled={false}
                            showsVerticalScrollIndicator={false}>

                            <View style={{ flex: 1, backgroundColor: colors.white, }}>
                                <FlatList
                                    showsHorizontalScrollIndicator={false}
                                    showsVerticalScrollIndicator={false}
                                    style={{}}
                                    data={filteredData && filteredData.length > 0
                                        ? filteredData
                                        : dsgroup}
                                    renderItem={this._renderItem}
                                    keyExtractor={(item, index) => index.toString()}
                                    ListEmptyComponent={<ListEmpty style={{ justifyContent: 'center', alignItems: 'center', }} textempty={RootLang.lang.thongbaochung.khongcodulieu} />}
                                />
                                <IsLoading />
                            </View>
                        </KeyboardAwareScrollView>
                    </View>
                    <IsLoading />
                </View>
            </View >
        );
    }
};


const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(TimKiemNhom, mapStateToProps, true)


