import _ from 'lodash';
import LottieView from 'lottie-react-native';
import moment from 'moment';
import React, { Component } from "react";
import { FlatList, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Dash from 'react-native-dash';
import { DeleteCTCongViecCaNhan, getDSCongViecDaGiao } from "../../../apis/JeePlatform/API_JeeWork/apiCongViecCaNhan";
import { RootLang } from '../../../app/data/locales';
import Utils from '../../../app/Utils';
import UtilsApp from '../../../app/UtilsApp';
import ButtonCom from '../../../components/Button/ButtonCom';
import HeaderComStack from '../../../components/HeaderComStack';
import IsLoading from '../../../components/IsLoading';
import FastImagePlaceholder from "../../../components/NewComponents/FastImageDefault";
import ListEmptyLottie from '../../../components/NewComponents/ListEmptyLottie';
import { Images } from '../../../images';
import { colors } from '../../../styles';
import { sizes } from '../../../styles/size';
import { heightHed, heightStatusBar, nstyles, Width } from '../../../styles/styles';
const height = (Platform.OS == 'android' ? heightHed + heightStatusBar / 2 : heightHed)

class LichSuHoanThanh extends Component {
    constructor(props) {
        super(props);
        this.refLoading = React.createRef()
        this.state = {
            dataCV: [],
            dataLoad: true,
            refreshing: false,
            searchString: '',
            typeChoice: '',
            _dateDk: '',
            _dateKt: '',
            selectDuAn: {
                "id_row": "", "title": RootLang.lang.JeeWork.tatcaduan,
            },
            selectTrangThai: {
                "id_row": "", "statusname": RootLang.lang.JeeWork.chontrangthai,
            }

        };
    }


    async componentDidMount() {
        this.refLoading.current.show()
        await this._GetDSCongViecDaGiao().then(res => {
            if (res == true) {
                this.refLoading.current.hide()
                if (this.state.dataCV?.length > 0) {
                    this.setState({ dataLoad: true })
                }
                else this.setState({ dataLoad: false })
            }
        });

    }


    _GetDSCongViecDaGiao = async () => {
        this.refLoading.current.show()
        this.setState({
            dataCV: [],
        })
        let dataCongViecTemp = []
        var { searchString, _dateDk, _dateKt, typeChoice, selectDuAn, selectTrangThai } = this.state
        const res = await getDSCongViecDaGiao(searchString, _dateDk, _dateKt, typeChoice, selectDuAn.id_row, selectTrangThai.id_row)
        if (res.status == 1) {
            for (let x = 0; x <= res.data.length; x++) {
                if (_.size(res.data[x]) > 0 && _.size(res.data[x].data) > 0) {
                    dataCongViecTemp = dataCongViecTemp.concat(res.data[x].data)
                }
            }
            this.setState({
                dataCV: dataCongViecTemp,
                refreshing: false
            })
            this.refLoading.current.hide()
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
        await this._GetDSCongViecDaGiao().then(res => {
            if (res == true) {
                this.refLoading.current.hide()
                if (this.state.dataCV?.length > 0) {
                    this.setState({ dataLoad: true })
                }
                else this.setState({ dataLoad: false })
            }
        });
        return true
    }
    _DeleteCongViec = async (id, index) => {
        var { dataCV } = this.state
        const res = await DeleteCTCongViecCaNhan(id)
        if (res.status == 1) {
            UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, RootLang.lang.JeeWork.xoacongviecthanhcong, 1)
            this.setState({
                dataCV: this.state.dataCV.filter(function (elem, _index) {
                    return index != _index;
                })
            })
        }
        else {
            UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, res.error ? res.error.message : RootLang.lang.JeeWork.xoathatbaivuilong, 2)
        }
        return true
    }

    _renderItem = ({ item, index }) => {
        return (
            item.closed == true ?
                <TouchableOpacity
                    onLongPress={() => {
                        Utils.showMsgBoxYesNo(this, RootLang.lang.JeeWork.thongbao, RootLang.lang.JeeWork.bancomuonxoacongviec, RootLang.lang.JeeWork.xoacongviec, RootLang.lang.JeeWork.dong, () => { this._DeleteCongViec(item.id_row, index) })
                    }}
                    onPress={() => {
                        Utils.goscreen(this, "sc_ChiTietCongViecCaNhan", {
                            // callback: this.CallBack,
                            index: index,
                            id_row: item.id_row,
                        })
                    }}>
                    <View style={{ padding: 2, marginBottom: 5, flexDirection: 'row', }}>
                        <View style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10 }}>
                            <FastImagePlaceholder
                                style={{ width: 50, height: 50, borderRadius: 40, }}
                                source={{ uri: item.User[0]?.image ? item.User[0].image : item.avatar }}
                                resizeMode={"cover"}
                                placeholder={Images.icAva}
                            />

                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                            <View style={{ justifyContent: 'center', paddingVertical: 5, paddingLeft: 1, width: '55%' }}>
                                <Text style={{ fontSize: sizes.sText15, fontWeight: '500', marginBottom: 5 }}>{item.title ? item.title : '...'}</Text>

                                <View style={{ flexDirection: 'row', }}>
                                    <Text numberOfLines={1} style={{ maxWidth: "80%", fontSize: sizes.sText12, color: colors.colorGrayText, marginRight: 5 }}>{item.project_team ? item.project_team : "..."}</Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        {item.comments ?
                                            <>
                                                <Image source={Images.ImageJee.icChat} resizeMode='contain' style={[nstyles.nIcon12, {}]} />
                                                <Text numberOfLines={1} style={{ fontSize: sizes.sText12 }}>{item.comments ? item.comments : 0}</Text>
                                            </>
                                            : null}
                                    </View>
                                </View>
                            </View>
                            <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 5, paddingHorizontal: 5, width: "40%", }}>

                                <View style={{ backgroundColor: item.status_info ? item.status_info.color : null, borderRadius: 20, width: '100%', padding: 5, justifyContent: 'center', alignItems: 'center', marginBottom: 5 }}>
                                    <Text style={{ textAlign: "center", color: 'white', fontSize: sizes.sText12 }}>{item.status_info ? item.status_info.statusname : "...."}</Text>
                                </View>

                                <Text style={{ color: colors.black_70, fontSize: sizes.sText12 }}>{item.createddate ? moment(item.createddate, 'YYYY/MM/DD').format('DD/MM/YYYY') : ''}</Text>
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
                </TouchableOpacity> : null

        );
    }

    CallBack = async (index = 0) => {
        if (Number.isInteger(index)) {
            this.refLoading.current.show()
            this._onRefresh().then(res => {
                if (res == true) {
                    this.refLoading.current.hide()
                    setTimeout(() => {
                        this.ref.scrollToIndex({ index: index, animated: true })
                    }, 300);

                }
                else {
                    this.refLoading.current.hide()
                }
            })
        }
    }

    CallBackBoLoc = async (item) => {
        this.refLoading.current.show()
        this.setState({
            _dateDk: item._dateDk,
            _dateKt: item._dateKt,
            typeChoice: item.typeChoice,
            searchString: item.searchString,
            selectDuAn: item.selectDuAn,
            selectTrangThai: item.selectTrangThai
        }, () => {
            this._GetDSCongViecDaGiao().then(res => {
                this.refLoading.current.hide()
            })
        })
    }


    render() {
        const { dataCV, refreshing, dataLoad } = this.state
        var { searchString } = this.state
        return (
            <View style={{ flex: 1 }}>
                <HeaderComStack onPressLeft={() => { Utils.goback(this, null) }}
                    nthis={this} title={RootLang.lang.JeeWork.congviechoanthanhdadong}
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
                                        style={{
                                            flex: 1,
                                            paddingTop: 10,
                                            paddingRight: 10,
                                            paddingBottom: 10,
                                            paddingLeft: 0,
                                        }}
                                        placeholder={RootLang.lang.JeeWork.timkiem}
                                        value={searchString}
                                        onChangeText={(searchString) => {
                                            this.setState({ searchString })
                                        }}
                                        onSubmitEditing={this._GetDSCongViecDaGiao}
                                        underlineColorAndroid="transparent"
                                    />
                                </View>


                            </View>
                            <TouchableOpacity style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                                onPress={() => {
                                    Utils.goscreen(this, "sc_BoLocGiaoViec", {
                                        callback: this.CallBackBoLoc,
                                        tab: 0
                                    })
                                }}
                            >
                                <Image source={Images.ImageJee.icLoc} style={{ padding: 10, }} />
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            data={dataCV}
                            renderItem={this._renderItem}
                            keyExtractor={(item, index) => index.toString()}
                            extraData={this.state}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            refreshing={refreshing}
                            initialNumToRender={5}
                            maxToRenderPerBatch={10}
                            windowSize={7}
                            updateCellsBatchingPeriod={100}
                            onRefresh={this._onRefresh}
                            ref={ref => { this.ref = ref }}
                            ListEmptyComponent={dataCV.length == 0 && dataLoad == false ? <ListEmptyLottie style={{ justifyContent: 'center', alignItems: 'center', }} textempty={RootLang.lang.JeeWork.khongcodulieu} /> : null}
                        />
                    </View>
                </View >
                <IsLoading ref={this.refLoading} />
            </View>

        );
    }
}

const styles = StyleSheet.create({
});

const mapStateToProps = state => ({
    lang: state.changeLanguage.language,
});

export default Utils.connectRedux(LichSuHoanThanh, mapStateToProps, true)