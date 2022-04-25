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


class ChiTietSuKien extends Component {
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
                    onPressRight={() => Utils.goscreen(this, 'sc_LocBaiDang')}
                    styBorder={{
                        borderBottomColor: colors.black_20_2,
                        borderBottomWidth: 0.3
                    }}
                />
                <View style={{ width: Width(100), height: Height(100) }}>
                    <View style={{ backgroundColor: colors.white, marginVertical: 10, paddingHorizontal: 10, paddingVertical: 10 }}>
                        <Text style={{ fontSize: sizes.sText12, color: '#EE2D41', fontWeight: 'bold' }} >16:00 THÚ TƯ, 5 THÁNG 5, 2021</Text>
                        <Text style={{ fontSize: sizes.sText20, color: colors.black, fontWeight: 'bold' }} >Tên sự kiện</Text>
                        <Text style={{ fontSize: sizes.sText12, color: colors.black }} >Vị trí</Text>
                        <View style={{ backgroundColor: '#F2F3F5', justifyContent: 'center', padding: 10 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image source={{ uri: "https://lwlies.com/wp-content/uploads/2017/04/avatar-2009-1108x0-c-default.jpg" }} resizeMode='cover' style={[nstyles.nAva26, {}]} />
                                <Text style={{ fontSize: sizes.sText12, paddingLeft: 10 }}>Tùng Nguyễn đã mời bạn</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 10, flexWrap: 'wrap', }}>
                                <TouchableOpacity style={{ borderWidth: 0.3, borderColor: '#D1D1D1', padding: 10, borderRadius: 10, backgroundColor: '#E4E6EB', flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
                                    <Image source={Images.ImageJee.icTickCheckThamGia} resizeMode='cover' style={[{ marginRight: 5 }]} />
                                    <Text style={{ fontSize: sizes.sText11, fontWeight: 'bold', color: '#65676B' }}>Sẽ tham gia</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ borderWidth: 0.3, borderColor: '#D1D1D1', padding: 10, borderRadius: 10, backgroundColor: '#E4E6EB', flexDirection: 'row', alignItems: 'center', }}>
                                    <Image source={Images.ImageJee.icDauHoi} resizeMode='cover' style={[{ marginRight: 5 }]} />
                                    <Text style={{ fontSize: sizes.sText11, fontWeight: 'bold', color: '#65676B' }}>Có thể tham gia</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ borderWidth: 0.3, borderColor: '#D1D1D1', padding: 10, borderRadius: 10, backgroundColor: '#E4E6EB', flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                                    <Image source={Images.ImageJee.icKhongThamGia} resizeMode='cover' style={[{ marginRight: 5 }]} />
                                    <Text style={{ fontSize: sizes.sText11, fontWeight: 'bold', color: '#65676B' }}>Không tham gia</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ borderWidth: 0.3, borderColor: '#D1D1D1', padding: 10, borderRadius: 10, backgroundColor: '#E4E6EB', flexDirection: 'row', alignItems: 'center', marginRight: 10, marginTop: 10 }}>
                                    <Image source={Images.ImageJee.icIconionic_ios_mail} resizeMode='cover' style={[{ marginRight: 5 }]} />
                                    <Text style={{ fontSize: sizes.sText11, fontWeight: 'bold', color: '#65676B' }}>Mời</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                    </View>
                    <View style={{ backgroundColor: colors.white, marginHorizontal: 10, padding: 10 }}>
                        <Text style={{ fontSize: sizes.sText15, fontWeight: 'bold', }}>Chi tiết</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 10 }}>
                            <Image source={Images.ImageJee.icIconmaterial_people} resizeMode='cover' style={[{ marginRight: 5 }]} />
                            <Text style={{ fontSize: sizes.sText11, color: '#65676B' }}> xx Người đã tham gia, bao gồm Tùng Nguyễn</Text>
                        </View>
                        <Image source={{ uri: "https://lwlies.com/wp-content/uploads/2017/04/avatar-2009-1108x0-c-default.jpg" }} resizeMode='cover' style={[nstyles.nAva26, { marginTop: 10 }]} />
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 10 }}>
                            <Image source={Images.ImageJee.icIconmaterial_location_on} resizeMode='cover' style={[{ marginRight: 5 }]} />
                            <Text style={{ fontSize: sizes.sText11, fontWeight: 'bold' }}> Địa điểm</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 10 }}>
                            <Image source={Images.ImageJee.icIconawesome_clock} resizeMode='cover' style={[{ marginRight: 5 }]} />
                            <Text style={{ fontSize: sizes.sText11, color: '#65676B' }}> Thời gian</Text>
                        </View>
                        <Text style={{ fontSize: sizes.sText11, color: '#65676B', marginTop: 10 }}>Thời gian xx Người đã tham gia, bao gồm Tùng Nguyễn xx Người đã tham gia, bao gồm Tùng Nguyễnxx Người đã tham gia, bao gồm Tùng Nguyễn xx Người đã tham gia, bao gồm Tùng Nguyễn
                        xx Người đã tham gia, bao gồm Tùng Nguyễn xx Người đã tham gia, bao gồm Tùng Nguyễn</Text>
                    </View>


                    <View style={{ backgroundColor: colors.white, marginHorizontal: 10, padding: 10, marginTop: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 10, justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: sizes.sText15, color: '#65676B', fontWeight: 'bold' }}> Danh sách tham gia</Text>
                            <Text style={{ fontSize: sizes.sText11, color: '#65676B' }}> Xem tất cả</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 10, justifyContent: 'center' }}>
                            <View style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 20 }}>
                                <Text style={{ fontSize: sizes.sText14, fontWeight: 'bold' }}> 12</Text>
                                <Text style={{ fontSize: sizes.sText10, color: '#65676B' }}> Sẽ tham gia</Text>
                            </View>
                            <View style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 20 }}>
                                <Text style={{ fontSize: sizes.sText14, fontWeight: 'bold' }}> 12</Text>
                                <Text style={{ fontSize: sizes.sText10, color: '#65676B' }}> Có thể tham gia</Text>
                            </View>
                            <View style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 20 }}>
                                <Text style={{ fontSize: sizes.sText14, fontWeight: 'bold' }}> 12</Text>
                                <Text style={{ fontSize: sizes.sText10, color: '#65676B' }}> Đã mời</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={{ uri: "https://lwlies.com/wp-content/uploads/2017/04/avatar-2009-1108x0-c-default.jpg" }} resizeMode='cover' style={[nstyles.nAva26, {}]} />
                            <View style={{ paddingHorizontal: 10 }}>
                                <Text style={{ fontSize: sizes.sText11, }}>Tùng Nguyễn </Text>
                                <Text style={{ fontSize: sizes.sText10, color: '#B3B3B3' }}>Người tổ chức</Text>
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity style={{ height: Height(5), backgroundColor: '#32AC48', justifyContent: 'center', alignItems: 'center', marginTop: Height(5) }}
                        onPress={() => { this._taoBaiDang() }}>
                        <Text style={{ color: colors.white, fontSize: sizes.sText15 }}>{RootLang.lang.JeeSocial.taobaidangmoi}</Text>
                    </TouchableOpacity>
                </View>


            </View >
        )
    }
}






const mapStateToProps = state => ({
    lang: state.changeLanguage.language,
});
export default Utils.connectRedux(ChiTietSuKien, mapStateToProps, true)