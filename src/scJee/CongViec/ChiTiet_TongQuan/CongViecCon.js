import _ from "lodash";
import LottieView from 'lottie-react-native';
import moment from "moment";
import React, { Component } from 'react';
import {
    FlatList, Platform, StyleSheet, Text, TouchableOpacity, View, Image
} from "react-native";
import Dash from 'react-native-dash';
import { DeleteCTCongViecCaNhan, getCTCongViecCaNhan } from '../../../apis/JeePlatform/API_JeeWork/apiCongViecCaNhan';
import { RootLang } from "../../../app/data/locales";
import Utils from '../../../app/Utils';
import UtilsApp from "../../../app/UtilsApp";
import ButtonCom from '../../../components/Button/ButtonCom';
import IsLoading from "../../../components/IsLoading";
import FastImagePlaceholder from "../../../components/NewComponents/FastImageDefault";
import ListEmptyLottie from "../../../components/NewComponents/ListEmptyLottie";
import { Images } from '../../../images';
import { colors } from '../../../styles';
import { reText, sizes } from '../../../styles/size';
import { Height, nstyles, Width } from '../../../styles/styles';


class CongViecCon extends Component {
    constructor(props) {
        super(props);
        this.nthis = this.props.nthis
        this.refLoading = React.createRef()
        this.state = {
            id_row: Utils.ngetParam(this.nthis, "id_row", ''),
            Childs: [],
            newChilds: [],
            // isLoading: false,
            ChiTietCongViec: [],
            // ListStatus: Utils.ngetParam(this.nthis, "ListStatus"),
            empty: true,
            refreshing: false
        };
    }


    async componentDidMount() {
        this.refLoading.current.show()
        await this._GetCTHoatDong().then(res => {
            if (res == true) {
                this.refLoading.current.hide()
            }

        });
    }

    _GetCTHoatDong = async () => {
        this.setState({
            newChilds: [],
            Childs: [],
        })
        this.setState({ empty: true })
        var { id_row } = this.state
        const res = await getCTCongViecCaNhan(id_row)
        if (res.status == 1) {
            this.props.SetCountWorkChild(res.data.Childs.length)
            this.setState({
                Childs: res.data.Childs,
                ChiTietCongViec: res.data,
                empty: false,
                refreshing: false
            })

            for (let z = 0; z < _.size(this.state.Childs); z++) {
                res.data.DataStatus.filter(res => {
                    if (this.state.Childs[z].status == res.id_row) {
                        var CongViecConMoi = ({ ...this.state.Childs[z], StatusCVC: res })
                        this.setState({ newChilds: this.state.newChilds.concat(CongViecConMoi) })
                        return { ...this.state.Childs[z], StatusCVC: res }
                    }
                })
            }
            // this.setState({ Childs: this.state.newChilds })
        }
        else {
            this.setState({ refreshing: false, empty: true, })
            UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, res.error ? res.error.message : RootLang.lang.JeeWork.laydulieuthatbai, 2)
        }

        return true
    }

    _containsObject(obj, list) {
        var i;
        for (i = 0; i < list.length; i++) {
            if (list[i] === obj) {
                return true;
            }
        }

        return false;
    }
    _DeleteCongViec = async (id, index) => {
        var { dataCV } = this.state
        const res = await DeleteCTCongViecCaNhan(id)
        if (res.status == 1) {
            UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, RootLang.lang.JeeWork.xoacongviecthanhcong, 1)
            this.setState({
                newChilds: this.state.newChilds.filter(function (elem, _index) {
                    return index != _index;
                })
            })
        }
        else {
            UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, res.error ? res.error.message : RootLang.lang.JeeWork.xoathatbaivuilong, 2)
        }
        return true
    }
    Opaciti_color = (color) => {
        if (!color) {
            color = 'rgb(0,0,0)';
        }
        var result = color.replace(')', ', 0.2)').replace('rgb', 'rgba');
        return result;
    }

    _renderItem = ({ item, index }) => {
        let creDate = moment(item.createddate, 'DD/MM/YYYY HH:mm').add(7, 'hours').format('MM/DD/YYYY HH:mm:ss')
        return (
            <TouchableOpacity
                key={index}
                onLongPress={() => {
                    Utils.showMsgBoxYesNo(this.nthis ? this.nthis : this, RootLang.lang.JeeWork.thongbao, RootLang.lang.JeeWork.bancomuonxoacongviec, RootLang.lang.JeeWork.xoacongviec, RootLang.lang.JeeWork.dong, () => { this._DeleteCongViec(item.id_row, index) })
                }}
                onPress={() => {
                    Utils.goscreen(this.nthis, "sc_ChiTietCongViecCaNhanCon", {
                        id_row: item.id_row,
                        // ListStatus: this.state.ListStatus,
                        // Status: item.StatusCVC,
                        callback: this.CallBack,
                        Child: true
                    })
                }}>
                <View style={{ padding: 2, marginBottom: 5, flexDirection: 'row', }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10 }}>
                        <FastImagePlaceholder
                            style={{ width: 50, height: 50, borderRadius: 50, }}
                            source={item.Users[0] ? { uri: item.Users[0].image } : Images.icAva}
                            resizeMode={"cover"}
                            placeholder={Images.icAva}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                        <View style={{ justifyContent: 'center', paddingVertical: 5, paddingLeft: 1, width: '70%' }}>
                            <Text style={{ fontSize: sizes.sText16, marginBottom: 5, color: '#404040' }}>{item.title ? item.title : '...'}</Text>
                            {item.Tags.length != 0 && <View style={{ flexWrap: 'wrap', flexDirection: 'row', marginBottom: 2, alignItems: 'center' }}>
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
                            <View style={{ flexDirection: 'row', }}>
                                <Text numberOfLines={1} style={{ maxWidth: "80%", fontSize: sizes.sText12, color: colors.colorGrayText }}>{item.project_team ? item.project_team : "..."}</Text>
                                {item.comments ? <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                                    <Image source={Images.ImageJee.icChat} resizeMode='contain' style={[nstyles.nIcon12, {}]} />
                                    <Text numberOfLines={1} style={{ fontSize: sizes.sText12, marginLeft: 5 }}>{item.comments ? item.comments : 0}</Text>
                                </View> : null}
                                {item.clickup_prioritize == 0 ? null :
                                    <View style={{ marginLeft: 10 }}>
                                        <Image source={Images.ImageJee.icCoKhongUuTien} style={{ width: Width(2.5), height: Width(3.5), tintColor: UtilsApp.colorPrioritize(item.clickup_prioritize) }} />
                                    </View>}
                                {item.deadline ?
                                    <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                                        <Image source={Images.ImageJee.icCalendarCheck} style={{ width: Width(3), height: Width(3), tintColor: UtilsApp.colorDeadline(item.deadline, true) }} />
                                        <Text style={{ fontSize: sizes.sText11, marginLeft: 3, alignSelf: 'center', color: UtilsApp.colorDeadline(item.deadline, true) }}>{moment(item.deadline, 'DD/MM/YYYY HH:mm').format('DD/MM/YYYY')}</Text>
                                    </View> : null}
                            </View>
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 5, paddingHorizontal: 5, width: "30%" }}>
                            <View style={{ backgroundColor: item.StatusCVC ? item.StatusCVC.color : null, borderRadius: 20, width: '100%', padding: 5, justifyContent: 'center', alignItems: 'center', marginBottom: 5 }}>
                                <Text numberOfLines={1} style={{ textAlign: "center", color: 'white', fontSize: sizes.sText12 }}>{item.StatusCVC.statusname ? item.StatusCVC.statusname : "...."}</Text>
                            </View>
                            {/* <Text style={{ color: colors.black_70, fontSize: sizes.sText12 }}>{item.createddate ? moment(item.createddate, 'YYYY/MM/DD').format('DD/MM/YYYY') : ''}</Text> */}
                            <Text style={{ color: colors.black_70, fontSize: sizes.sText14 }}>{Utils.formatTimeAgo(creDate, 1, false)}</Text>
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
    };

    _onRefresh = async () => {
        await this._GetCTHoatDong().then(res => {
        });
        return true
    }

    CallBack = async () => {
        this.refLoading.current.show()
        this.setState({ isLoading: true })
        this._onRefresh().then(res => {
            if (res == true) {
                this.refLoading.current.hide()
                // setTimeout(() => {
                //     this.ref.scrollToEnd({ animated: true })
                // }, 500);

            }
            else {
                this.refLoading.current.hide()
            }
        })

    }

    render() {
        const { listBaiDang, showload, refreshing, newChilds, Childs, ChiTietCongViec, empty } = this.state;
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1, backgroundColor: colors.white }}>
                    <View style={{
                        backgroundColor: colors.white,
                        height: Platform.OS == 'android' ? "82%" : "100%"
                    }}>
                        <FlatList
                            contentContainerStyle={{ paddingBottom: Height(10) }}
                            refreshing={refreshing}
                            onRefresh={this._onRefresh}
                            data={newChilds}
                            renderItem={this._renderItem}
                            keyExtractor={(item, index) => index.toString()}
                            ListEmptyComponent={newChilds.length == 0 && empty == false ? <ListEmptyLottie style={{ justifyContent: 'center', alignItems: 'center', }} textempty={RootLang.lang.JeeWork.khongcodulieu} /> : null}
                            ref={ref => { this.ref = ref }}
                        />
                    </View>
                    <TouchableOpacity onPress={() => {
                        Utils.goscreen(this.nthis, "TaoGiaoViec", {
                            id_parent: ChiTietCongViec.id_row,
                            project: {
                                project_team: ChiTietCongViec.project_team,
                                id_project_team: ChiTietCongViec.id_project_team,
                            },
                            callback: this.CallBack,
                            itemChiTietCongViec: ChiTietCongViec,
                            Child: true,
                        })
                    }}
                        style={{
                            width: Width(90), borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', paddingVertical: 10,
                            borderColor: colors.black_20, elevation: Platform.OS == "android" ? 5 : 0, marginHorizontal: Width(5),
                            borderWidth: 0.5, backgroundColor: colors.white, position: 'absolute', bottom: Platform.OS == 'ios' ? 40 : 180, left: 0,
                            shadowColor: "rgba(0, 0, 0, 0.2)", shadowOffset: { width: 0, height: 0 }, shadowRadius: 2, shadowOpacity: 1, margin: 0,
                        }}
                    >
                        <Text style={{ fontSize: reText(14), color: colors.colorJeeNew.colorBlueHome, fontWeight: 'bold' }}>{RootLang.lang.JeeWork.taocongvieccon}</Text>
                    </TouchableOpacity>

                </View>
                <IsLoading ref={this.refLoading} />
            </View >

        );
    }
};

const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});

const styles = StyleSheet.create({
    card: {
        borderRadius: 30
    },
    list: {
        overflow: 'visible'
    },
    reactView: {
        width: (Width(100) - 24) / 7,
        height: 58,
        justifyContent: 'center',
        alignItems: 'center'
    },
    reaction: {
        width: Width(20),
        marginBottom: 4
    }
});

export default Utils.connectRedux(CongViecCon, mapStateToProps, true)


