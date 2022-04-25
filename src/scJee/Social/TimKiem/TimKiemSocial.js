import React, { Component } from 'react';
import { FlatList, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { RootLang } from '../../../app/data/locales';
import Utils from '../../../app/Utils';
import ListEmpty from '../../../components/ListEmpty';
import { Images } from '../../../images';
import { colors } from '../../../styles';
import { reText, sizes } from '../../../styles/size';
import { Height, nstyles, Width } from '../../../styles/styles';
const data = [
    {
        id: 1,
        tennguoidang: "Nguyễn Hoàng",
        tenphong: "Phòng lao công",

        avatar: "https://lwlies.com/wp-content/uploads/2017/04/avatar-2009-1108x0-c-default.jpg",

    },
    {
        id: 2,
        tennguoidang: "Đỗ Hoàng",
        tenphong: "Phòng bảo vệ",

        avatar: "https://lwlies.com/wp-content/uploads/2017/04/avatar-2009-1108x0-c-default.jpg",

    },
    {
        id: 3,
        tennguoidang: "Trưởng phòng",
        tenphong: "Phòng lao công",

        avatar: "https://lwlies.com/wp-content/uploads/2017/04/avatar-2009-1108x0-c-default.jpg",

    },
    {
        id: 4,
        tennguoidang: "Đỗ Hoàng",
        tenphong: "Phòng bảo vệ",

        avatar: "https://lwlies.com/wp-content/uploads/2017/04/avatar-2009-1108x0-c-default.jpg",

    },
];
// toDay: Utils.getGlobal(nGlobalKeys.TimeNow, '') ? moment(Utils.getGlobal(nGlobalKeys.TimeNow, '')).format("DD/MM/YYYY") : moment(Date.now()).format("DD/MM/YYYY"),
class TimKiemSocial extends Component {
    constructor(props) {
        super(props);
        this.state = {
            noidung_Tk: ''
        };
        this.nthis = this.props.nthis;
    }
    async componentDidMount() {
    }

    _renderItem = ({ item, index }) => {
        return (
            <View style={{ backgroundColor: colors.white, flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8 }}>
                <View style={[{ flexDirection: 'row', }]}>
                    <Image source={{ uri: item.avatar }} resizeMode='cover' style={[nstyles.nAva40, {}]} />
                    <View style={[{ marginLeft: 12, justifyContent: 'center' }]}>
                        <Text style={{ fontWeight: 'bold', fontSize: sizes.sText12 }}>{item.tennguoidang}</Text>
                        <Text style={{ fontSize: sizes.sText12, color: '#65676B' }}>{item.tenphong}</Text>
                    </View>
                </View>
                <View style={{ marginRight: 20, justifyContent: 'center' }}>
                    <Image source={Images.ImageJee.icDelete_TimKiem} resizeMode='cover' style={[nstyles.nIcon12, {}]} />
                </View>
            </View >
        );
    }

    render() {
        var { noidung_Tk } = this.state
        return (
            <View style={{ flex: 1, height: Height(100), backgroundColor: '#E4E6EB', }}>
                <KeyboardAwareScrollView
                    keyboardDismissMode='on-drag'
                    scrollEnabled={false}
                    showsVerticalScrollIndicator={false}>
                    <View style={{ width: Width(100), height: Height(5), marginTop: 1, }}  >
                        <TouchableOpacity style={{ height: Height(5), backgroundColor: colors.white, justifyContent: 'center' }}>
                            <View style={{ alignItems: 'center', marginHorizontal: 10, flexDirection: 'row', }}>
                                <Image source={Images.ImageJee.icTimKiemTextInput} resizeMode='cover' style={[nstyles.nIcon14, {}]} />
                                <TextInput
                                    placeholder={"Tìm kiếm..."}
                                    value={noidung_Tk}
                                    autoCorrect={false}
                                    numberOfLines={2}
                                    onChangeText={(text) => this.setState({ noidung_Tk: text })}
                                    style={[{
                                        paddingVertical: 11, paddingLeft: 11, fontSize: reText(14),
                                        color: colors.black
                                    }]}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, backgroundColor: colors.white, }}>
                        <View style={{ width: Width(100), marginTop: 1, backgroundColor: colors.white, height: Height(5), justifyContent: 'center', borderBottomWidth: 0.5, borderTopWidth: 0.5, borderColor: '#D1D1D1' }} >
                            <Text style={{ fontSize: sizes.sText15, marginLeft: 16 }}>GẦN ĐÂY</Text>
                        </View>
                        <View style={{ marginLeft: 16 }}>
                            <FlatList
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                                // scrollEnabled={false}
                                style={{ marginTop: 5 }}
                                data={data}
                                renderItem={this._renderItem}
                                keyExtractor={(item, index) => index.toString()}
                                ListEmptyComponent={<ListEmpty style={{ justifyContent: 'center', alignItems: 'center' }} textempty={RootLang.lang.thongbaochung.khongcodulieu} />}
                            />
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </View >
        );
    }
};


const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(TimKiemSocial, mapStateToProps, true)


