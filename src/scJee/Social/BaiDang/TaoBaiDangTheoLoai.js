import React, { Component } from 'react';
import { ActivityIndicator, Animated, FlatList, Image, Text, TouchableOpacity, View, BackHandler } from "react-native";
import { PhanQuyenLoaiBaiDang } from '../../../apis/JeePlatform/Api_JeeSocial/apiJeeSocial';
import { RootLang } from '../../../app/data/locales';
import Utils from '../../../app/Utils';
import UtilsApp from '../../../app/UtilsApp';
import HeaderComStackV2 from '../../../components/HeaderComStackV2';
import IsLoading from '../../../components/IsLoading';
import ListEmpty from '../../../components/ListEmpty';
import { Images } from '../../../images';
import { colors } from '../../../styles';
import { sizes } from '../../../styles/size';
import { nstyles, Width, paddingBotX } from '../../../styles/styles';

class TaoBaiDangTheoLoai extends Component {
    constructor(props) {
        super(props);
        this.state = {
            opacity: new Animated.Value(0),
            loaiBaiDang: [],
            vitri: 0,
            showload: false,
            refreshing: false,
            data: Utils.ngetParam(this, 'data', ''),
        }
        this.calllback = Utils.ngetParam(this, 'callback')
    }

    componentDidMount = async () => {
        BackHandler.addEventListener("hardwareBackPress", this._goback);
        this._loaiBaiDang()
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

    _loaiBaiDang = async () => {
        nthisLoading.show()
        let res = await PhanQuyenLoaiBaiDang()
        // Utils.nlog('res phân quyền loại bài dăng', res)
        if (res.status == 1) {
            nthisLoading.hide()
            this.setState({ loaiBaiDang: res.data, refreshing: false, showload: false, })
        } else {
            nthisLoading.hide()
            this.setState({ refreshing: false, showload: false, })
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
        }
    }

    _TaoBaiDang_TheoLoai = (item) => {
        Utils.goscreen(this, 'sc_TaoBaiVietMoi', { data: item, nhom: this.state.data, callback: this.calllback })
    }

    _onRefresh = () => {
        this._loaiBaiDang();
    }

    _renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity
                onPress={() => this._TaoBaiDang_TheoLoai(item)}
                style={{ marginTop: 10, backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center', height: Width(30) }}>
                <View style={[{ justifyContent: 'center', alignItems: 'center' }]}>
                    <Image source={Images.ImageJee.icTaoBaiDang} resizeMode='contain' style={[{}]} />
                    <Text style={{ fontWeight: 'bold', fontSize: sizes.sText15, paddingTop: 10 }}>{item.TenLoaiDang}</Text>
                </View>
            </TouchableOpacity >
        );
    }

    render() {
        const { loaiBaiDang, showload, refreshing, opacity } = this.state
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: colors.white, }]}>
                <View style={{ flex: 1, backgroundColor: '#E4E6EB', }}>
                    <HeaderComStackV2
                        nthis={this} title={RootLang.lang.JeeSocial.taobaidangmoi}
                        // iconRight={Images.ImageJee.icBoLocSocial}
                        // styIconRight={[nstyles.nIconH18W22, {}]}
                        iconLeft={Images.ImageJee.icBack}
                        onPressLeft={this._goback}
                        // onPressRight={() => { Utils.goscreen(this, 'Modal_LocBaiDang') }}
                        styBorder={{
                            borderBottomColor: colors.black_20,
                            borderBottomWidth: 0.5
                        }}
                    />

                    <View style={{ flex: 1, paddingBottom: paddingBotX }}>
                        <FlatList
                            extraData={this.state}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            refreshing={refreshing}
                            style={{}}
                            data={loaiBaiDang}
                            renderItem={this._renderItem}
                            onRefresh={this._onRefresh}
                            keyExtractor={(item, index) => index.toString()}
                            ListEmptyComponent={!loaiBaiDang ? <ListEmpty style={{ justifyContent: 'center', alignItems: 'center', }} textempty={RootLang.lang.thongbaochung.khongcodulieu} /> : null}
                            ListFooterComponent={showload ? <ActivityIndicator size='small' /> : null}
                        />
                        <IsLoading />
                    </View>
                </View>
            </View >
        )
    }
}

const mapStateToProps = state => ({
    lang: state.changeLanguage.language,
});
export default Utils.connectRedux(TaoBaiDangTheoLoai, mapStateToProps, true)