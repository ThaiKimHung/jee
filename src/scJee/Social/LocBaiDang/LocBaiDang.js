import React, { Component } from 'react';
import { Animated, BackHandler, FlatList, Text, TouchableOpacity, View } from "react-native";
// GetMenu_Left_Home
import { GetMenu_Left_Home } from '../../../apis/JeePlatform/Api_JeeSocial/apiJeeSocial';
import { RootLang } from '../../../app/data/locales';
import Utils from '../../../app/Utils';
import UtilsApp from '../../../app/UtilsApp';
import HeaderComStackV2 from '../../../components/HeaderComStackV2';
import IsLoading from '../../../components/IsLoading';
import ListEmpty from '../../../components/ListEmpty';
import { Images } from '../../../images';
import { colors } from '../../../styles';
import { reText } from '../../../styles/size';
import { nstyles, paddingBotX } from '../../../styles/styles';

class LocBaiDang extends Component {
    constructor(props) {
        super(props);

        this.state = {
            opacity: new Animated.Value(0),
            listMenu: [],
        };
    }

    componentDidMount = async () => {
        BackHandler.addEventListener("hardwareBackPress", this._goback);
        this._loadDanhSachMenu()
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

    _loadDanhSachMenu = async (page = 1) => {
        nthisLoading.show()
        let res = await GetMenu_Left_Home();
        // Utils.nlog("list menu-------------------------", res)
        if (res.status == 1) {
            nthisLoading.hide()
            this.setState({ listMenu: res.data })
        } else {
            nthisLoading.hide()
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
        }
    }

    _goXemBaiDangLoc = (item) => {
        Utils.goscreen(this, 'sc_XemBaiDangLoc', { data: item })
    }

    _renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity
                onPress={() => this._goXemBaiDangLoc(item)}
                style={{ backgroundColor: colors.white, flex: 1, flexDirection: 'row', padding: 15, alignItems: 'center', marginBottom: 1 }}>
                <Text style={{ fontSize: reText(15), }}>{item.title}</Text>
            </TouchableOpacity >
        );
    }

    render() {
        const { opacity, listMenu } = this.state
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: colors.white, }]}>
                <View style={{ flex: 1, }}>
                    <HeaderComStackV2
                        nthis={this} title={RootLang.lang.JeeSocial.tatcabaidang}
                        // iconRight={Images.ImageJee.icBoLocSocial}
                        // styIconRight={[nstyles.nIconH18W22, {}]}
                        iconLeft={Images.ImageJee.icBack}
                        onPressLeft={this._goback}
                    // onPressRight={() => { Utils.goscreen(this, 'Modal_LocBaiDang') }}
                    // styBorder={{
                    //     borderBottomColor: colors.black_20_2,
                    //     borderBottomWidth: 0.3
                    // }}
                    />

                    <View style={{ paddingBottom: paddingBotX, flex: 1 }}>
                        <View style={{ justifyContent: 'center', borderBottomWidth: 0.5, borderColor: '#D1D1D1', padding: 10 }} >
                            <Text style={{ fontSize: reText(15), fontWeight: 'bold' }}>{RootLang.lang.JeeSocial.locbaidang}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <FlatList
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                                style={{}}
                                data={listMenu}
                                renderItem={this._renderItem}
                                keyExtractor={(item, index) => index.toString()}
                                ListEmptyComponent={!listMenu ? <ListEmpty style={{ justifyContent: 'center', alignItems: 'center', }} textempty={RootLang.lang.thongbaochung.khongcodulieu} /> : null}
                            />
                        </View>
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
export default Utils.connectRedux(LocBaiDang, mapStateToProps, true)