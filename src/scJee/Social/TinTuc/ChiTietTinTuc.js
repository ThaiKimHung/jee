import React, { Component } from 'react';
import { FlatList, Image, Text, TextInput, TouchableOpacity, View, ScrollView, BackHandler } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { GetDetail_TinTuc } from '../../../apis/JeePlatform/Api_JeeSocial/apiJeeSocial';
import { RootLang } from '../../../app/data/locales';
import Utils from '../../../app/Utils';
import Header_TaoBaiDang from '../../../components/Header_TaoBaiDang';
import ListEmpty from '../../../components/ListEmpty';
import { Images } from '../../../images';
import { colors } from '../../../styles';
import { reText, sizes } from '../../../styles/size';
import { Height, nstyles, Width } from '../../../styles/styles';
import IsLoading from '../../../components/IsLoading';
import moment from 'moment';
import UtilsApp from '../../../app/UtilsApp';

// toDay: Utils.getGlobal(nGlobalKeys.TimeNow, '') ? moment(Utils.getGlobal(nGlobalKeys.TimeNow, '')).format("DD/MM/YYYY") : moment(Date.now()).format("DD/MM/YYYY"),
class ChiTietTinTuc extends Component {
    constructor(props) {
        super(props);
        this.data = Utils.ngetParam(this, 'data', '');
        this.state = {
            noidung_Tk: '',
            listTinTuc: [],
            refreshing: false,
            selectedUser: []
        };
        this.nthis = this.props.nthis;
    }
    componentDidMount = async () => {
        BackHandler.addEventListener("hardwareBackPress", this._goback);
        this._loadChiTietTinTuc()
    }

    componentWillUnmount() {
        try {
            BackHandler.removeEventListener('hardwareBackPress', this._goback)
        }
        catch (error) { }
    }

    _loadChiTietTinTuc = async () => {
        var { listTinTuc } = this.state
        nthisLoading.show()
        let res = await GetDetail_TinTuc(this.data);
        // Utils.nlog("list chi tiết tin tức-----------------------", res)
        if (res.status == 1) {
            nthisLoading.hide()
            this.setState({ listTinTuc: res.data[0] })
        } else {
            nthisLoading.hide()
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
        }
    }

    _goback = () => {
        Utils.goback(this, null);
        return true
    }


    render() {
        const { noidung_Tk, listUser, selectedUser, listTinTuc } = this.state
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: colors.white, }]}>
                <View style={{ backgroundColor: colors.white, flex: 1 }}>
                    <Header_TaoBaiDang
                        nthis={this}
                        title={RootLang.lang.JeeSocial.chitiettinhtuc}
                        // textRight={"XONG"}
                        // styTextRight={[{ fontSize: sizes.sText15, color: '#0E72D8' }]}
                        iconLeft={Images.ImageJee.icArrowNext}
                        styIconLeft={{ tintColor: colors.black }}
                        onPressLeft={this._goback}
                        // textleft={"Gắn thẻ"}
                        // styTextLeft={{ fontSize: sizes.sText15, }}
                        // onPressRight={this._select(this.state.selectedUser)}
                        styBorder={{
                            borderBottomColor: colors.black_20,
                            borderBottomWidth: 0.5
                        }}
                    />

                    <View style={{ flex: 1, paddingBottom: 15 }}>
                        <ScrollView nestedScrollEnabled style={{ flex: 1, }}>
                            <View style={{ padding: 10 }}>
                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <Image source={{ uri: listTinTuc?.hinhanh }} resizeMode='contain' style={[{ height: Height(25), width: Width(100), alignItems: 'center', marginTop: 4, marginRight: 5 }]} />
                                </View>
                                <View style={{ flex: 1, paddingTop: 10 }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: reText(18), }}>{listTinTuc?.tieude}</Text>
                                    <Text style={{ fontSize: reText(15), paddingTop: 10 }}>{listTinTuc?.noidung}</Text>
                                    <Text style={{ fontSize: reText(13), color: '#B3B3B3' }}>
                                        {listTinTuc?.CreatedDate ? UtilsApp.convertDatetime(listTinTuc?.CreatedDate) : null}
                                    </Text>
                                </View>
                            </View>
                        </ScrollView>
                        <IsLoading />
                    </View>
                </View>
            </View >
        );
    }
};


const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(ChiTietTinTuc, mapStateToProps, true)


