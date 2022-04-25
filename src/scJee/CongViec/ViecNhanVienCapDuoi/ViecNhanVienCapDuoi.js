import LottieView from 'lottie-react-native';
import React, { Component } from 'react';
import {
    ActivityIndicator, FlatList, Image, Platform, Text, TextInput, TouchableOpacity, View
} from "react-native";
import Dash from 'react-native-dash';
import { getDuAnPhongBan } from '../../../apis/JeePlatform/API_JeeWork/apiDuAn';
import { getDSNhanVienCapDuoi, getListStaus } from '../../../apis/JeePlatform/API_JeeWork/apiViecChoNhanVienCapDuoi';
import { RootLang } from '../../../app/data/locales';
import Utils from '../../../app/Utils';
import HeaderComStack from '../../../components/HeaderComStack';
import IsLoading from '../../../components/IsLoading';
import ListEmptyLottie from '../../../components/NewComponents/ListEmptyLottie';
import PercentageCircle from '../../../components/NewComponents/PercentageCircle';
import { Images } from '../../../images';
import { colors } from '../../../styles';
import { reText, sizes } from '../../../styles/size';
import { nstyles, Width } from '../../../styles/styles';
import _ from 'lodash'
import FastImagePlaceholder from '../../../components/NewComponents/FastImageDefault';
import moment from 'moment';
import { DeleteCTCongViecCaNhan } from '../../../apis/JeePlatform/API_JeeWork/apiCongViecCaNhan';
import UtilsApp from '../../../app/UtilsApp';
class ViecNhanVienCapDuoi extends Component {
    constructor(props) {
        super(props);
        this.nthis = this.props.nthis
        this.refLoading = React.createRef()
        this.state = {

            dataLoad: true,
            refreshing: false,
            isLoading: false,
            searchString: '',
            typeChoice: '',
            _dateDk: moment().add(-1, 'month').format('DD/MM/YYYY'),
            _dateKt: moment().format('DD/MM/YYYY'),
            dataNhanVien: [],
            dataStatus: []

        };

    }

    async componentDidMount() {
        Utils.setGlobal('_dateDkLocCapDuoi', moment().add(-1, 'month').format('DD/MM/YYYY'))
        Utils.setGlobal('typeChoiceLocCapDuoi', 'CreatedDate')
        Utils.setGlobal('_dateKtLocCapDuoi', moment().format('DD/MM/YYYY'))
        Utils.setGlobal('searchStringCapDuoi', '')
        this.refLoading.current.show()
        await this._GetDSNhanVienCapDuoi().then(res => {
            if (res == true) {
                this.refLoading.current.hide()
                if (this.state.dataNhanVien?.length > 0) {
                    this.setState({ dataLoad: true })
                }
                else this.setState({ dataLoad: false })
            }
        });

    }

    CallBackBoLoc = async (item) => {
        this.setState({ isLoading: true })
        this.setState({
            _dateDk: item._dateDk,
            _dateKt: item._dateKt,
            typeChoice: item.typeChoice,
            searchString: item.searchString
        }, () => {
            this._GetDSNhanVienCapDuoi().then(res => {
                this.setState({ isLoading: false })
            })
        })
    }

    _GetDSNhanVienCapDuoi = async () => {
        this.refLoading.current.show()
        var { searchString, _dateDk, _dateKt, typeChoice } = this.state
        const res = await getDSNhanVienCapDuoi(searchString, _dateDk, _dateKt, typeChoice)
        console.log("res:", res)
        const resStatus = await getListStaus()
        if (res.status == 1) {
            this.refLoading.current.hide()
            if (res.data.length == 0) {
                this.setState({ dataNhanVien: [], dataLoad: false })
            } else
                this.setState({ dataStatus: resStatus.data, refreshing: false, dataNhanVien: res.data.map((obj, index) => ({ ...obj, dropDown: false, })) }, () => {
                })
        }
        else {
            this.refLoading.current.hide()
            this.setState({ refreshing: false })
            UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, res.error ? res.error.message : RootLang.lang.JeeWork.laydulieuthatbai, 2)
        }

        return true
    }

    _onRefresh = async () => {
        this.refLoading.current.show()
        await this._GetDSNhanVienCapDuoi().then(res => {
            if (res == true) {
                this.refLoading.current.hide()
                if (this.state.dataNhanVien?.length > 0) {
                    this.setState({ dataLoad: true })
                }
                else this.setState({ dataLoad: false })
            }
        });
        return true
    }
    hashCode = (str) => {
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return hash;
    }

    intToRGB = (i) => {
        var c = (i & 0x00FFFFFF)
            .toString(16)
            .toUpperCase();

        return "#" + "00000".substring(0, 6 - c.length) + c;
    }

    _DeleteCongViec = async (id, index) => {
        var { dataNhanVien } = this.state
        const res = await DeleteCTCongViecCaNhan(id)
        if (res.status == 1) {
            UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, RootLang.lang.JeeWork.xoacongviecthanhcong, 1)
            this._GetDSNhanVienCapDuoi()
        }
        else {
            UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, res.error ? res.error.message : RootLang.lang.JeeWork.xoathatbaivuilong, 2)
        }
        return true
    }


    _DropDown = async (itemChoice) => {
        var { dataNhanVien } = this.state
        dataNhanVien.map((item) => {
            if (item === itemChoice) {
                item.dropDown = !item.dropDown
            }
        })
        this.setState({ dataNhanVien: dataNhanVien })

    }


    _renderItem = ({ item, index }) => {
        var { refreshing, dataLoad } = this.state

        return (
            item.data.length == 0 ? null :
                <View>
                    <TouchableOpacity
                        onPress={() => { this._DropDown(item) }}

                        style={{ padding: 2, margin: 5, flexDirection: 'row', backgroundColor: colors.white }}>
                        <View style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10 }}>
                            {/* Chổ này api đang thiếu */}
                            <FastImagePlaceholder
                                style={{ width: 40, height: 40, borderRadius: 40, }}
                                source={item.image ? { uri: item.image } : Images.icAva}
                                resizeMode={"cover"}
                                placeholder={Images.icAva}
                            />

                        </View>
                        <View style={{ alignContent: "center", alignSelf: "center", flex: 1, flexDirection: "row", justifyContent: "space-between" }}>
                            <View style={{ flexDirection: "row", alignContent: "center", alignSelf: "center", }}>
                                <Text style={{ flex: 1, color: this.intToRGB(this.hashCode(item.title)), fontSize: sizes.sText15, fontWeight: '700', marginBottom: 5, maxWidth: Width(45) }}>{item.title ? item.title : '...'} </Text>
                                <Text style={{ color: this.intToRGB(this.hashCode(item.title)), fontSize: sizes.sText15, fontWeight: '700', marginBottom: 5, maxWidth: Width(30), paddingRight: 10 }}>  {_.size(item.data) + " " + RootLang.lang.JeeWork.congviec} </Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => { this._DropDown(item) }}
                                style={{ alignSelf: "center", marginRight: 20 }}>
                                <Image style={{ width: 10, height: 10 }} resizeMode={"contain"} source={item.dropDown == false ? Images.ImageJee.icIconDropDownNamNgang : Images.ImageJee.icDropdownColor} />
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity >

                    {item.dropDown == true ?
                        <View style={{ marginHorizontal: 20 }}>

                            <FlatList
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                                data={item.data}
                                renderItem={this._renderChild}
                                keyExtractor={(item, index) => index.toString()}
                                extraData={this.state}
                                refreshing={refreshing}
                                initialNumToRender={10}
                                maxToRenderPerBatch={15}
                                windowSize={7}
                                updateCellsBatchingPeriod={100}
                                onRefresh={this._onRefresh}
                                ref={ref => { this.ref = ref }}
                                ListEmptyComponent={_.size(item.data) == 0 && dataLoad == false ? <ListEmptyLottie style={{ justifyContent: 'center', alignItems: 'center', }} textempty={RootLang.lang.JeeWork.khongcodulieu} /> : null}
                            />
                        </View>

                        : null}
                    <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                        <View style={{}}></View>
                        <Dash
                            dashColor={colors.colorVeryLightPink}
                            style={{ width: Width(96), height: 1, }}
                            dashGap={0}
                            dashThickness={1} />
                    </View>
                </View >

        );
    }


    CallBack = async (index = 0) => {
        // if (Number.isInteger(index)) {
        //     this.setState({ isLoading: true })
        //     this._onRefresh().then(res => {
        //         if (res == true) {
        //             this.setState({ isLoading: false }, () => {

        //             })
        //         }
        //         else {
        //             this.setState({ isLoading: false })
        //         }
        //     })
        // }
    }

    Opaciti_color = (color) => {
        if (!color) {
            color = 'rgb(0,0,0)';
        }
        var result = color.replace(')', ', 0.2)').replace('rgb', 'rgba');
        return result;
    }

    _renderChild = ({ item, index }) => {
        let creDate = item.createddate ? moment(item.createddate).add(7, 'hours').format('MM/DD/YYYY HH:mm:ss') : false
        return (
            <TouchableOpacity
                key={index}
                onLongPress={() => {
                    Utils.showMsgBoxYesNo(this.nthis ? this.nthis : this, RootLang.lang.JeeWork.thongbao, RootLang.lang.JeeWork.bancomuonxoacongviec, RootLang.lang.JeeWork.xoacongviec, RootLang.lang.JeeWork.dong, () => { this._DeleteCongViec(item.id_row, index) })
                }}
                onPress={() => {
                    Utils.goscreen(this.nthis ? this.nthis : this, "sc_ChiTietCongViecCaNhan", {
                        callback: this.CallBack,
                        index: index,
                        id_row: item.id_row,
                    })
                }}>
                <View style={{ padding: 2, marginBottom: 5, flexDirection: 'row', }}>
                    {/* <View style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10 }}>
                        <FastImagePlaceholder
                            style={{ width: 50, height: 50, borderRadius: 50, }}
                            source={{ uri: item.User[0]?.image ? item.User[0].image : item.avatar }}
                            resizeMode={"cover"}
                            placeholder={Images.icAva}
                        />
                    </View> */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                        <View style={{ justifyContent: 'center', paddingVertical: 5, paddingLeft: 1, width: creDate ? '70%' : '100%' }}>
                            <Text numberOfLines={2} style={{ fontSize: sizes.sText16, marginBottom: 5, color: '#404040' }}>{item.title ? item.title : '...'}</Text>
                            {item.Tags && item.Tags.length != 0 && <View style={{ flexWrap: 'wrap', flexDirection: 'row', marginBottom: 2, alignItems: 'center' }}>
                                <View style={{ borderWidth: 0.5, borderColor: colors.black_50, padding: 5, borderRadius: 100, borderStyle: 'dashed', marginRight: 3 }}>
                                    <Image source={Images.ImageJee.tagcv} style={{ width: Width(2.5), height: Width(2.5), tintColor: colors.black_50, }} />
                                </View>
                                {item.Tags.map((item, index) => {
                                    return (
                                        <View key={index} style={{
                                            backgroundColor: this.Opaciti_color(item.color), marginRight: 5, justifyContent: 'center', paddingRight: 10, borderBottomRightRadius: 20, borderTopRightRadius: 20,
                                            paddingLeft: 5, marginTop: 5, maxWidth: Width(50), borderBottomLeftRadius: 2, borderTopLeftRadius: 2
                                        }}>
                                            <Text numberOfLines={1} style={{ color: item.color == '#848E9E' ? colors.white : item.color, fontSize: reText(14) }}>{item.title}</Text>
                                        </View>
                                    )
                                })}
                            </View>}
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                <Text numberOfLines={1} style={{ maxWidth: "80%", fontSize: sizes.sText12, color: colors.colorGrayText, marginRight: 10 }}>{item.project_team ? item.project_team : "..."}</Text>
                                {item.comments ? <View style={{ flexDirection: 'row', marginRight: 10 }}>
                                    <Image source={Images.ImageJee.icChat} resizeMode='contain' style={[nstyles.nIcon12, {}]} />
                                    <Text numberOfLines={1} style={{ fontSize: sizes.sText12, marginLeft: 5 }}>{item.comments ? item.comments : 0}</Text>
                                </View> : null}
                                {!item.clickup_prioritize || item.clickup_prioritize == 0 ? null :
                                    <View style={{ marginRight: 10 }}>
                                        <Image source={Images.ImageJee.icCoKhongUuTien} style={{ width: Width(2.5), height: Width(3.5), tintColor: UtilsApp.colorPrioritize(item.clickup_prioritize) }} />
                                    </View>}
                                {item.deadline ?
                                    <View style={{ flexDirection: 'row', marginRight: 10 }}>
                                        <Image source={Images.ImageJee.icCalendarCheck} style={{ width: Width(3), height: Width(3), tintColor: item.hoanthanh == 1 ? colors.colorGrayText : UtilsApp.colorDeadline(item.deadline) }} />
                                        <Text style={{ fontSize: sizes.sText11, marginLeft: 3, alignSelf: 'center', color: item.hoanthanh == 1 ? colors.colorGrayText : UtilsApp.colorDeadline(item.deadline) }}>{moment(item.deadline).format('DD/MM/YYYY')}</Text>
                                    </View> : null}
                            </View>
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 5, paddingHorizontal: 5, width: "30%" }}>
                            {item.status_info ? <View style={{ backgroundColor: item.status_info ? item.status_info.color : null, borderRadius: 20, width: '100%', padding: 5, justifyContent: 'center', alignItems: 'center', marginBottom: 5 }}>
                                <Text numberOfLines={1} style={{ textAlign: "center", color: 'white', fontSize: sizes.sText12 }}>{item.status_info ? item.status_info.statusname : "...."}</Text>
                            </View> : null}
                            {/* <Text style={{ color: colors.black_70, fontSize: sizes.sText12 }}>{item.createddate ? moment(item.createddate, 'YYYY/MM/DD').format('DD/MM/YYYY') : ''}</Text> */}
                            {creDate ? <Text style={{ color: colors.black_70, fontSize: sizes.sText14 }}>{Utils.formatTimeAgo(creDate, 1, false)}</Text> : null}
                        </View>
                    </View>
                </View>
                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                    <View style={{}}></View>
                    <Dash
                        dashColor={colors.colorVeryLightPink}
                        style={{ width: Width(96), height: 1, }}
                        dashGap={0}
                        dashThickness={1} />
                </View>
            </TouchableOpacity >
        )
    }

    render() {
        var { refreshing, dataLoad, dataNhanVien } = this.state
        console.log("dataLoad:", dataLoad, dataNhanVien)
        return (
            <View style={{ flex: 1 }}>
                <HeaderComStack onPressLeft={() => { Utils.goback(this, null) }}
                    nthis={this} title={RootLang.lang.JeeWork.viecnhanviencapduoi}

                />
                <View style={{ flex: 1, backgroundColor: "#F2F3F5" }}>
                    <View style={{
                        backgroundColor: colors.white,
                        flex: 1
                    }}>

                        <View style={{ marginVertical: 10, flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20 }}>
                            <View style={{
                                backgroundColor: "#F2F3F5",
                                borderRadius: 20,
                                width: "90%"
                            }}>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}>
                                    <Image source={Images.icSearch} style={{ height: 15, width: 15, marginHorizontal: 20, }} />
                                    <TextInput
                                        returnKeyType='search'
                                        value={this.state.searchString}
                                        style={{
                                            flex: 1,
                                            paddingTop: 10,
                                            paddingRight: 10,
                                            paddingBottom: 10,
                                            paddingLeft: 0,

                                        }}
                                        placeholder={RootLang.lang.JeeWork.timkiem}
                                        onChangeText={(searchString) => {
                                            this.setState({ searchString })
                                        }}
                                        onSubmitEditing={this._GetDSNhanVienCapDuoi}
                                        underlineColorAndroid="transparent"
                                    />
                                </View>

                            </View>
                            <TouchableOpacity style={{
                                justifyContent: 'center',
                                alignItems: 'center',

                            }}
                                onPress={() => {
                                    Utils.goscreen(this, "sc_BoLocNVCapDuoi", {
                                        callback: this.CallBackBoLoc,
                                        tab: 0
                                    })
                                }}
                            >
                                <Image source={Images.ImageJee.icLoc} style={{ padding: 10, }} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 1, marginBottom: Platform.OS == 'ios' ? 20 : 5 }}>
                            <FlatList
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                                data={dataNhanVien}
                                renderItem={this._renderItem}
                                keyExtractor={(item, index) => index.toString()}
                                extraData={this.state}
                                refreshing={refreshing}
                                removeClippedSubviews={true}
                                initialNumToRender={2}
                                maxToRenderPerBatch={5}
                                updateCellsBatchingPeriod={100}
                                windowSize={7}
                                onRefresh={this._onRefresh}
                                ref={ref => { this.ref = ref }}
                                ListEmptyComponent={dataNhanVien.length == 0 && dataLoad == false ? <ListEmptyLottie style={{ justifyContent: 'center', alignItems: 'center', }} textempty={RootLang.lang.JeeWork.khongcodulieu} /> : null}
                            />
                        </View>
                    </View>
                    <IsLoading ref={this.refLoading} />
                </View >
            </View>
        );
    }
};


const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});



export default Utils.connectRedux(ViecNhanVienCapDuoi, mapStateToProps, true)


