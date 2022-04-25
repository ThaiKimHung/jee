import React, { Component } from 'react';
import { ActivityIndicator, FlatList, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { getNhanVien } from '../../../apis/apiNhanVien';
import { RootLang } from '../../../app/data/locales';
import Utils from '../../../app/Utils';
import UtilsApp from '../../../app/UtilsApp';
import IsLoading from '../../../components/IsLoading';
import { Images } from '../../../images/index';
import { fonts } from '../../../styles';
import { colors } from '../../../styles/color';
import { sizes } from '../../../styles/size';
import { nstyles } from '../../../styles/styles';

class DsNhanVien extends Component {
    constructor(props) {
        super(props);
        this.nthis = this.props.nthis;
        this.state = {
            DSNhanVien: [],
            refreshing: false,
            showload: false,
            nhanvien: '',
            search: false
        };
    }
    componentDidMount() {
        this._getDSNhanVien();

    }

    _getDSNhanVien = async () => {
        var { nhanvien } = this.state
        let res = await getNhanVien(nhanvien)
        // Utils.nlog('res getNhanVien', res)
        nthisLoading.show();

        if (res.status == 1) {
            nthisLoading.hide();

            this.setState({
                DSNhanVien: res.data,
                refreshing: false
            })
        }
        else if (res.status == 0 && res.error.message === "Không có dữ liệu") {
            nthisLoading.hide();
            this.setState({
                DSNhanVien: []
            })
        }
        else {
            nthisLoading.hide();
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
        }
        this.setState({ efreshing: false, showload: false })

    }

    _onRefresh = () => {
        this.setState({ refreshing: true }, this._getDSNhanVien);
    }

    _renderItem = ({ item, index }) => {
        return (
            <View style={{ backgroundColor: colors.backgroundColor, }}>
                <TouchableOpacity
                    onPress={() => Utils.goscreen(this.props.nthis, "Modal_ChiTietNhanVien", {
                        RowID: item.ID_NV,
                        refresh: this._onRefresh,
                        nthis: this,
                        isGoBak: true
                    })}
                    style={nstyles.shadow, {
                        flex: 1, flexDirection: 'row',
                        backgroundColor: colors.white, paddingVertical: 15,
                        height: 'auto', paddingHorizontal: 10,

                    }}>
                    <View style={{ flex: 1, flexDirection: 'row', height: '100%', alignItems: 'center' }}>
                        <Image source={item.Image ? { uri: item.Image } : Images.JeeAvatarBig} style={[nstyles.nAva40]} />
                        <View style={{ flex: 1, paddingLeft: 10 }}>
                            <View style={{ flex: 1 }}>
                                <View style={{ flex: 1, flexDirection: 'row', marginRight: 20 }}>
                                    <Text style={{
                                        fontSize: sizes.sText16, lineHeight: sizes.sText17, flex: 1,
                                        fontFamily: fonts.Helvetica, color: colors.colorTextBack80
                                    }}
                                        numberOfLines={2}
                                    >{item.HoTen}</Text>
                                    <Text style={{ color: colors.textTabActive, fontSize: sizes.sText16, }}>{item.MaNV}</Text>

                                </View>

                                <View style={{ flex: 1, marginTop: 6, flexDirection: 'row', marginRight: 20 }}>
                                    <Text style={{
                                        fontFamily: fonts.Helvetica,
                                        color: colors.colorGrayLight,
                                        fontSize: sizes.sText12, lineHeight: sizes.sText16, flex: 1
                                    }}>{item.NgaySinh}
                                    </Text>
                                    <Text style={{
                                        fontStyle: 'italic',
                                        fontFamily: fonts.Helvetica,
                                        color: colors.colorGrayLight,
                                        fontSize: sizes.sText12, lineHeight: sizes.sText16,
                                    }}>{item.TenChucVu}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
                <View style={{
                    width: '100%', backgroundColor: colors.white,
                    height: 1, alignItems: 'center'
                }}>
                    <View style={{ width: '90%', backgroundColor: colors.veryLightPink, height: 1 }}></View>
                </View>

            </View >
        );
    }

    _ItemSeparatorComponent = () => {
        return (
            <View style={{ height: 3, backgroundColor: '#fff', }} />
        )
    }

    renderListEmpty = () => {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Image source={Images.icListEmpty} style={{ width: sizes.nImgSize200, height: sizes.nImgSize200 }} resizeMode={'cover'} />
                <Text style={{ fontSize: sizes.sText16, color: colors.brownGreyTwo }}>{RootLang.lang.thongbaochung.khongcodulieu}</Text>
            </View>
        )
    }

    handleViewRef = ref => this.view = ref;

    bounce = () => {
        const { search } = this.state
        search === false ? this.view.slideInDown(500) : this.view.slideInUp(500)
    };

    render() {
        const { DSNhanVien } = this.state
        var { nhanvien, search } = this.state

        return (
            <View style={{ flex: 1, backgroundColor: colors.backgroundColor, paddingBottom: 15, paddingHorizontal: 15 }}>
                {search == true ?
                    <Animatable.View animation={'slideInLeft'} delay={100}  >
                        <TextInput
                            style={{
                                marginVertical: 5,
                                paddingHorizontal: 20,
                                width: '100%',
                                flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                                paddingVertical: 15, backgroundColor: colors.white,
                            }}
                            placeholder={RootLang.lang.scQuanLyNhanVien.timkiemnhanvien}
                            placeholderTextColor={colors.colorPlayhoder}
                            onChangeText={(nhanvien) => this.setState({ nhanvien }, this._getDSNhanVien)}
                            ref={ref => nhanvien = ref}
                        >
                            {nhanvien}
                        </TextInput>
                    </Animatable.View> : null}
                <Animatable.View ref={this.handleViewRef} style={{ marginTop: search == true ? 5 : 10 }} >
                    <FlatList
                        data={DSNhanVien}
                        ListEmptyComponent={this.renderListEmpty}
                        initialNumToRender={2}
                        refreshing={this.state.refreshing}
                        style={{ width: '100%', }}
                        ItemSeparatorComponent={this._ItemSeparatorComponent}
                        onRefresh={this._onRefresh}
                        renderItem={this._renderItem}
                        showsVerticalScrollIndicator={false}
                        onEndReachedThreshold={0.2}
                        ListFooterComponent={this.state.showload ?
                            <ActivityIndicator size='small' /> : null}
                        keyExtractor={(item, index) => index.toString()} />
                    <IsLoading />
                </Animatable.View>
                <TouchableOpacity
                    onPress={() => {
                        this.setState({ search: !search })
                        this.bounce()
                    }}
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 60,
                        position: 'absolute',
                        bottom: 5,
                        right: 0,
                        height: 70,
                        borderRadius: 100,
                    }}
                >
                    <Image source={Images.searchGreen} style={{ width: 40, height: 40 }} />
                </TouchableOpacity>
                <IsLoading />
            </View>
        );
    }
}
const mapStateToProps = state => ({
    lang: state.changeLanguage.language,
    loadtangca: state.LoadTC.loadtangca
});
export default Utils.connectRedux(DsNhanVien, mapStateToProps, true)
