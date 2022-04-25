import LottieView from 'lottie-react-native';
import moment from 'moment';
import React, { Component, createRef } from 'react';
import {
    ActivityIndicator, Animated, FlatList, Image, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity,
    TouchableWithoutFeedback, View
} from "react-native";
import ImageCropPicker from 'react-native-image-crop-picker';
import { Card } from 'react-native-paper';
import HTML from "react-native-render-html";
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import { RootLang } from '../../../app/data/locales';
import { nkey } from '../../../app/keys/keyStore';
import Utils from '../../../app/Utils';
import ListEmpty from '../../../components/ListEmpty';
import HeaderModal from '../../../Component_old/HeaderModal';
import { Images } from '../../../images';
import { colors } from '../../../styles';
import { sizes } from '../../../styles/size';
import { Height, nstyles, Width } from '../../../styles/styles';
import ActionSheet from "react-native-actions-sheet";
import DocumentPicker from 'react-native-document-picker';
import HeaderComStackV2 from '../../../components/HeaderComStackV2';
import _ from "lodash";

const data = [
    {
        id: 1,
        name: 'Tất cả tin nhắn mới',
        check: true
    },
    {
        id: 2,
        name: 'Báo tin nhắn nhắc tên @',
        check: false
    },
    {
        id: 3,
        name: 'Tắt thông báo',
        check: false
    },

];


class CaiDatThongBao extends Component {
    constructor(props) {
        super(props);
        this.state = {
            opacity: new Animated.Value(0),
            data: Utils.ngetParam(this, 'data'),
            nhom: Utils.ngetParam(this, 'nhom'),
            objectType: '',
            numLine: 0,
            msgtext: '',
            titile_NoiDung: '',
            noiDung: '',
            images: [],
            numLine: '',
            imageBG: {
                id: 1,
                image: Images.ImageJee.icBG1
            },
            title: '',
            ghimLenDau: false,
            luachon: '',
            dateSukien: moment(Date.now()).format("DD/MM/YYYY"),
            timeSukien: '',
            mota: '',
            dsgroup: [],
            id_User: '',
            userTag: [],
            nameuser: '',
            avatar: '',
            dsFile: [],
            data: [
                {
                    id: 1,
                    name: 'Tất cả tin nhắn mới',
                    check: true
                },
                {
                    id: 2,
                    name: 'Báo tin nhắn nhắc tên @',
                    check: false
                },
                {
                    id: 3,
                    name: 'Tắt thông báo',
                    check: false
                },

            ],
        }
        this.calllback = Utils.ngetParam(this, 'callback', '')
    }

    _chonThongBao = async (itemChon, index) => {
        let checktrue = 0;
        await this.state.data.map(async (item, indexx) => {

            if (item.check == false) {
                checktrue = checktrue + 1
            }
        })
        await this.state.data.map(async (item, indexx) => {
            if (item === itemChon) {
                if (item.check == false) {
                    item.check = true
                }
            }
            else {
                item.check = false
            }
            this.setState({
                data: this.state.data
            })
        })
    }
    _renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity
                onPress={() => { this._chonThongBao(item, index) }}
                style={{ flexDirection: 'row', padding: 10, alignItems: 'center', borderBottomWidth: 1, borderColor: colors.black_10, paddingVertical: 15 }}>
                <View style={{ height: 20, width: 20, marginHorizontal: 5, borderRadius: 10, borderColor: item.check == true ? 'blue' : colors.black_20, borderWidth: 2, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{
                        height: 12, width: 12, backgroundColor: item.check == true ? 'blue' : null, borderRadius: 10,
                    }}></View>
                </View>
                <Text style={{ fontSize: sizes.sText15, }}>{item.name}</Text>
            </TouchableOpacity>
        )
    }

    render() {
        var { opacity } = this.state
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: colors.white, }]}>
                {/* <HeaderModal /> */}
                <HeaderComStackV2
                    nthis={this} title={'Cài đặt thông báo'}
                    // iconRight={Images.ImageJee.icBoLocSocial}
                    // styIconRight={[nstyles.nIconH18W22, {}]}
                    iconLeft={Images.ImageJee.icBack}
                    onPressLeft={this._goback}
                    // onPressRight={() => { Utils.goscreen(this, 'Modal_LocBaiDang') }}
                    styBorder={{
                        borderBottomColor: colors.black_20_2,
                        borderBottomWidth: 0.3
                    }}
                />
                {/* <IsLoading /> */}
                < View style={[styles.container_Flatlist, {}]}>
                    <FlatList
                        // ref={ref => { this.HomeSocial = ref }}
                        extraData={this.state}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        // refreshing={refreshing}
                        style={{ marginTop: 5, flex: 1, flexGrow: 1 }}
                        data={this.state.data}
                        renderItem={this._renderItem}
                        keyExtractor={(item, index) => index.toString()}
                    // ListEmptyComponent={!listBaiDang ? <ListEmpty style={{ justifyContent: 'center', alignItems: 'center', }} textempty={'Không có dữ liệu'} /> : null}
                    // ListFooterComponent={showload ? <ActivityIndicator size='small' /> : null}
                    />
                </View >

                {/* <ActionSheet ref={actionSheetRef_Image}>
                <View style={{ height: Height(30), maxHeight: Height(100), paddingBottom: 40, width: Width(100) }}>
                    <HeaderModal />
                    <TouchableOpacity
                        onPress={() => this._open_ImageGallery()}
                        style={{ height: Height(5), borderBottomWidth: 0.3, borderColor: '#E4E6EB', width: Width(100), justifyContent: 'center', alignItems: 'center', padding: 10, marginTop: 2 }}>
                        <Text style={{ fontSize: sizes.sText15, }}>Chọn ảnh</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this._open_Camera()}
                        style={{ height: Height(6), width: Width(100), justifyContent: 'center', alignItems: 'center', padding: 10, marginTop: 1, borderBottomWidth: 0.3, borderColor: '#E4E6EB' }}>
                        <Text style={{ fontSize: sizes.sText15, }}>Chụp ảnh</Text>

                    </TouchableOpacity>

                </View>
            </ActionSheet> */}
                {/* <ActionSheet ref={actionSheetRef_User}>
                <View style={{ maxHeight: Height(50), paddingBottom: 40, width: Width(100) }}>
                    <HeaderModal />
                    <FlatList
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        style={{ marginTop: 5, paddingBottom: 20 }}
                        data={this.state.userTag}
                        renderItem={this._renderItem_actionuser}
                        keyExtractor={(item, index) => index.toString()}
                        ListEmptyComponent={<ListEmpty style={{ justifyContent: 'center', alignItems: 'center' }} textempty={RootLang.lang.thongbaochung.khongcodulieu} />}
                    />
                </View>
            </ActionSheet> */}
            </View >
        )
    }
}

const mapStateToProps = state => ({
    lang: state.changeLanguage.language,
});


const styles = StyleSheet.create({
    container_Flatlist: {
        flex: 1,
        paddingBottom: 5,
    },
});
export default Utils.connectRedux(CaiDatThongBao, mapStateToProps, true)