import React, { Component } from 'react'
import { Image, Text, TouchableOpacity, View, ScrollView, FlatList, Animated, SafeAreaView, TextInput } from "react-native";
import Utils from '../../../app/Utils';
import { Images } from '../../../images';
import { colors } from '../../../styles';
import { Height, nstyles, Width } from '../../../styles/styles';
import { RootLang } from '../../../app/data/locales';
import { TabView, SceneMap } from 'react-native-tab-view';
import { sizes, reSize, reText } from '../../../styles/size';
import moment from 'moment';
import Dash from 'react-native-dash';
import IsLoading from '../../../components/IsLoading';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ListEmpty from '../../../components/ListEmpty';
import HeaderComStackV2 from '../../../components/HeaderComStackV2';


const data = [
    {
        id: 1,
        thoigian: "Thời gian",
        tensukien: "Tên sự kiện",
        điaiem: "Địa điểm"
    },
    {
        id: 2,
        thoigian: "T7, 6 THÁNG 4, 2020",
        tensukien: "Tiệc gặp gỡ và kết nối thân mật cùng sinh nhật lần thứ 3 diễn đàn ... Tiệc gặp gỡ và kết nối thân mật cùng sinh nhật lần thứ 3 diễn đàn ...",
        điaiem: "66 Trần Tấn, phường Tân Sơn Nhì, quận Tân Phú"
    },
    {
        id: 3,
        thoigian: "T7, 6 THÁNG 4, 2020",
        tensukien: "Tiệc gặp gỡ và kết nối thân mật cùng sinh nhật lần thứ 3 diễn đàn ...",
        điaiem: "66 Trần Tấn, phường Tân Sơn Nhì, quận Tân Phú"
    },
];

const loai = [
    {
        id: 1,
        loai: "Tất cả",
    },
    {
        id: 2,
        loai: "Tuần này",
    },
    {
        id: 3,
        loai: "Nhóm",
    },
    {
        id: 4,
        loai: "Đang theo dõi",
    },
];


class HomeSuKien extends Component {
    constructor(props) {
        super(props);

        this.state = {
            opacity: new Animated.Value(0),
            loai: {
                id: 1,
                loai: "Tất cả",
            },
        }

    }

    componentDidMount = async () => { this._startAnimation(0.8) }

    _goback = async () => {
        this._endAnimation(0)
        Utils.goback(this, null)
    }

    _startAnimation = (value) => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: value,
                duration: 300
            }).start();
        }, 400);
    };

    _endAnimation = (value) => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: value,
                duration: 1
            }).start();
        }, 1);
    };


    _renderItem_Loai = ({ item, index }) => {
        return (
            <TouchableOpacity
                onPress={() => { this.setState({ loai: item }) }}
                style={{
                    justifyContent: 'center', width: Width(26), padding: 10, maxWidth: Width(30),
                    backgroundColor: this.state.loai.id == item.id ? '#219B3C' : '#F2F3F5', borderWidth: 0.3, marginRight: 10, borderRadius: 20, alignItems: 'center'
                }} >
                <Text style={{ fontSize: sizes.sText13, color: this.state.loai.id == item.id ? colors.white : colors.black }}>{item.loai}</Text>
            </TouchableOpacity >
        );
    }
    _renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity style={{
                height: Height(14), backgroundColor: colors.white, marginVertical: 5, marginHorizontal: 10,
                paddingLeft: 10, paddingVertical: 10,
            }}
                onPress={() => { Utils.goscreen(this, 'sc_ChiTietSuKien') }}>
                <Text style={{ fontSize: sizes.sText11, color: '#EE2D41', paddingVertical: 10 }}>{item.thoigian}</Text>
                <Text numberOfLines={2} style={{ fontWeight: 'bold', fontSize: sizes.sText13, width: '96%', paddingVertical: 5, height: '45%' }}>{item.tensukien}</Text>
                <Text style={{ fontSize: sizes.sText11, color: '#65676B', paddingVertical: 10, }}>{item.điaiem}</Text>
            </TouchableOpacity>
        );
    }


    render() {
        var { opacity, noidung_CMT, sizeInput, msgtext, flagEmoji, numLine, animationEmoji } = this.state
        var animatedStyle = { marginBottom: animationEmoji }
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: '#E4E6EB', width: Width(100), }]}>
                <HeaderComStackV2
                    nthis={this} title={RootLang.lang.JeeSocial.sukien}
                    iconRight={Images.ImageJee.icBoLocSocial}
                    styIconRight={[nstyles.nIconH18W22, {}]}
                    iconLeft={Images.ImageJee.icBack}
                    onPressLeft={this._goback}
                    onPressRight={this._goback}
                    styBorder={{
                        borderBottomColor: colors.black_20_2,
                        borderBottomWidth: 0.3
                    }}
                />
                <View style={{ width: Width(100) }}>
                    <View style={{ height: Height(7) }}>
                        <FlatList
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            // scrollEnabled={false}
                            horizontal={true}
                            style={{ height: Height(6), padding: 10, backgroundColor: colors.white }}
                            data={loai}
                            renderItem={this._renderItem_Loai}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                    <View>
                        <FlatList
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            // scrollEnabled={false}
                            // horizontal={true}
                            style={{ marginTop: 5, height: Height(100), backgroundColor: '#E4E6EB' }}
                            data={data}
                            renderItem={this._renderItem}
                            keyExtractor={(item, index) => index.toString()}
                            ListEmptyComponent={<ListEmpty style={{ justifyContent: 'center', alignItems: 'center', }} textempty={RootLang.lang.thongbaochung.khongcodulieu} />}
                        />
                    </View>
                </View>


            </View >
        )
    }
}






const mapStateToProps = state => ({
    lang: state.changeLanguage.language,
});
export default Utils.connectRedux(HomeSuKien, mapStateToProps, true)