import moment from 'moment';
import React, { Component } from "react";
import { ActivityIndicator, FlatList, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View, Modal, TouchableWithoutFeedback } from "react-native";
import Dash from 'react-native-dash';
import { DeleteCTCongViecCaNhan, getDSCongViecCaNhan } from "../../../apis/JeePlatform/API_JeeWork/apiCongViecCaNhan";
import Utils from '../../../app/Utils';
import IsLoading from "../../../components/IsLoading";
import FastImagePlaceholder from "../../../components/NewComponents/FastImageDefault";
import ListEmptyLottie from '../../../components/NewComponents/ListEmptyLottie';
import { Images } from '../../../images';
import { colors } from '../../../styles';
import { reText, sizes } from '../../../styles/size';
import { Height, nstyles, Width } from '../../../styles/styles';
import UtilsApp from '../../../app/UtilsApp';
import { RootLang } from '../../../app/data/locales';
import { nGlobalKeys } from '../../../app/keys/globalKey';
import HeaderComStack from '../../../components/HeaderComStack';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

class CongViecTheoDoi extends Component {
    constructor(props) {
        super(props);
        this.nthis = this.props.nthis
        this.type = Utils.ngetParam(this.nthis || this, 'type', 0)
        this.state = {
            dataCV: [], // data lits main
            refreshing: false,
            empty: true,
            page: 1,
            allPage: 0,
            checkLoad: false, //ban đầu false nếu call done api sẽ set true -> check load
            loadmore: false,
            //Filter 
            searchString: '',
            HoanThanhCV: this.type == 2 ? 1 : 0, //0 - k bao gồm cv hoàn thành , 1- lấy cv hoàn thành
            HanCV: this.type == 2 ? 1 : 0,
            typeChoice: 'Deadline',
            _dateDk: moment().format('DD/MM/YYYY'),
            _dateKt: moment().format('DD/MM/YYYY'),
            SelectTT: { id: 0, title: 'TẤT CẢ' },
            dataSort: [
                { id: 0, title: 'Ngày tạo giảm', key: 'CreatedDate_Giam' },
                { id: 1, title: 'Ngày tạo tăng', key: 'CreatedDate_Tang' },
                { id: 2, title: 'Ưu tiên cao', key: 'Prioritize_Cao' },
                { id: 3, title: 'Ưu tiên thấp', key: 'Prioritize_Thap' },
                { id: 4, title: 'Hạn chót tăng', key: 'Deadline_Tang' },
                { id: 5, title: 'Hạn chót giảm', key: 'Deadline_Giam' },
            ],
            selectSort: { id: 0, title: 'Ngày tạo giảm', key: 'CreatedDate_Giam' },
            showModal: false,
            sort: '',
            loai: 1, //1- cv tôi 2- tôi giao 3- theo dõi 
            checkLoadding: true
        };
        this.IdScreen = 'hethan' // name màn hình đặt lưu Golbal
    }

    componentDidMount() {
        this.setState({ checkLoadding: true })
        this.ClearFilter()
        this.props.SetCountWork(0)
        this._GetDSCongViec()
    }

    ClearFilter = () => {
        // console.log("TYPE:", this.type)
        Utils.setGlobal('searchStringCongViec' + this.IdScreen, '')
        Utils.setGlobal('hoanthanhcv' + this.IdScreen, this.type == 2 ? 1 : 0)
        Utils.setGlobal('hancv' + this.IdScreen, this.type == 2 ? 1 : 0)
        Utils.setGlobal('typeChoiceLocCongViec' + this.IdScreen, 'CreatedDate')
        Utils.setGlobal('_dateDkLocCongViec' + this.IdScreen, this.state._dateDk)
        Utils.setGlobal('_dateKtLocCongViec' + this.IdScreen, this.state._dateKt)
        Utils.setGlobal('_TinhTrangCV' + this.IdScreen, { id: 0, title: 'TẤT CẢ' })

    }

    _GetDSCongViec = async () => {
        let { searchString, _dateDk, _dateKt, typeChoice, HanCV, HoanThanhCV, page, selectSort, SelectTT } = this.state
        const res = await getDSCongViecCaNhan(page = this.state.page, searchString, _dateDk, _dateKt, typeChoice, HoanThanhCV, HanCV, selectSort.key, SelectTT.id, this.state.loai)
        if (res.status == 1) {
            if (res.data == "" || res.data.length == 0) {
                this.props.SetCountWork(0)
                this.setState({ refreshing: false, dataCV: [], checkLoad: true, page: 1 })
            }
            this.setState({ checkLoadding: false })
            this.props.SetCountWork(res.page.TotalCount ? res.page.TotalCount : 0) // Đếm và set vô sl work
            this.setState({
                dataCV: [...this.state.dataCV, ...res.data],
                refreshing: false,
                allPage: res.page.AllPage,
                checkLoad: true,
                loadmore: false
            })
            // console.log("API:", page, this.state.allPage, this.state.dataCV, res)
        }
        else {
            this.props.SetCountWork(0)
            this.setState({ checkLoadding: false })
            this.setState({ refreshing: false, dataCV: [], checkLoad: true, loadmore: false })
            UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, res.error ? res.error.message : RootLang.lang.JeeWork.laydulieuthatbai, 2)
        }
        return true
    }

    _onRefresh = () => {
        this.setState({ dataCV: [], page: 1, checkLoad: false }, async () => {
            this.setState({ checkLoadding: true })
            this._GetDSCongViec()
        })
        return true
    }

    Opaciti_color = (color) => {
        if (!color) {
            color = 'rgb(0,0,0)';
        }
        var result = color.replace(')', ', 0.2)').replace('rgb', 'rgba');
        return result;
    }

    _DeleteCongViec = async (id, index) => {
        const res = await DeleteCTCongViecCaNhan(id)
        let { searchString, _dateDk, _dateKt, typeChoice, HanCV, HoanThanhCV, page, selectSort, SelectTT } = this.state
        if (res.status == 1) {
            UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, RootLang.lang.JeeWork.xoacongviecthanhcong, 1)
            let litsNew = this.state.dataCV
            litsNew.splice(index, 1)
            const res = await getDSCongViecCaNhan(page = this.state.page, searchString, _dateDk, _dateKt, typeChoice, HoanThanhCV, HanCV, selectSort.key, SelectTT.id, this.state.loai)
            if (res.status == 1) { //Xử lí cộng 1 item ở server vô mảng (page hiện tại)
                this.props.SetCountWork(res.page.TotalCount ? res.page.TotalCount : 0)
                let arrayNew = []
                if (res.data[9]) {
                    arrayNew = [...litsNew, res.data[9]]
                    this.setState({
                        dataCV: arrayNew,
                        allPage: res.page.AllPage,
                    })
                }
                else {
                    this.setState({
                        dataCV: litsNew
                    })
                }
            }
            else {
                this.setState({
                    dataCV: litsNew,
                })
            }
        }
        else {
            this.setState({ checkLoadding: false })
            UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, res.error ? res.error.message : RootLang.lang.JeeWork.xoathatbaivuilong, 2)
        }
    }

    CallBack = async (type = 0, index = 0, dataTemp = undefined, TagsTemp = undefined, ten = '', prioritizeID = undefined, deadlineCV = undefined) => {
        let litsNew = this.state.dataCV
        let dataNew = []
        let { searchString, _dateDk, _dateKt, typeChoice, HanCV, HoanThanhCV, page, selectSort, SelectTT } = this.state
        //Mỗi lần callback k get lại list mà xử lí item nào thay đổi replace lại.
        if (dataTemp || TagsTemp || ten != '' || prioritizeID || deadlineCV) {
            litsNew.map((item, indexcv) => {
                if (index == indexcv) {
                    dataNew.push({ ...item, status_info: dataTemp ? dataTemp : item.status_info, title: ten != '' ? ten : item.title, Tags: TagsTemp ? TagsTemp : item.Tags, clickup_prioritize: prioritizeID || prioritizeID == 0 ? prioritizeID : item.clickup_prioritize, deadline: deadlineCV ? deadlineCV : item.deadline })
                } else {
                    dataNew.push(item)
                }
            })
            this.setState({ dataCV: dataNew })
            Utils.setGlobal(nGlobalKeys.saveStatusCV, undefined)
            Utils.setGlobal(nGlobalKeys.tagsCV, undefined)
            Utils.setGlobal(nGlobalKeys.prioritizeID, undefined)
            Utils.setGlobal(nGlobalKeys.deadlineCV, undefined)
        }
        if (type == 2) {
            litsNew.splice(index, 1)
            const res = await getDSCongViecCaNhan(page = this.state.page, searchString, _dateDk, _dateKt, typeChoice, HoanThanhCV, HanCV, selectSort.key, SelectTT.id, this.state.loai)

            if (res.status == 1) {  //Xử lí cộng 1 item ở server vô mảng (page hiện tại)
                this.props.SetCountWork(res.page.TotalCount ? res.page.TotalCount : 0)
                let arrayNew = []
                if (res.data[9]) {
                    arrayNew = [...litsNew, res.data[9]]
                    this.setState({
                        dataCV: arrayNew,
                        allPage: res.page.AllPage,
                    })
                }
                else {
                    this.setState({
                        dataCV: litsNew
                    })
                }
            }
            else {
                this.setState({
                    dataCV: litsNew,
                })
            }
        }
    }

    CallBackBoLoc = async (item) => {
        this.setState({ checkLoadding: true })
        this.props.SetCountWork(0)
        this.setState({
            _dateDk: item._dateDk,
            _dateKt: item._dateKt,
            typeChoice: item.typeChoice,
            searchString: item.searchString,
            HoanThanhCV: item.HoanThanhCV,
            HanCV: item.HanCV,
            SelectTT: item.SelectTT,
            page: 1,
            dataCV: [],
            checkLoad: false
        }, () => {
            this._GetDSCongViec().then(res => {
                this.setState({ checkLoadding: false })
            })
        })
    }

    CallBackTaoCV = () => {
        this.setState({ dataCV: [], page: 1, checkLoad: false }, () => {
            this.setState({ checkLoadding: true })
            this._GetDSCongViec()
        })
    }

    _onLoadMore = () => {
        if ((this.state.page < this.state.allPage) && this.state.checkLoad) {
            this.setState({ page: this.state.page + 1, checkLoad: false, loadmore: true }, () => {
                this._GetDSCongViec()
            })
        }
    }

    _renderItem = ({ item, index }) => {
        let creDate = moment(item.createddate).add(7, 'hours').format('MM/DD/YYYY HH:mm:ss')
        let deadline = moment(item.deadline).add(7, 'hours').format('DD/MM/YYYY')
        let deadlineTime = moment(item.deadline).add(7, 'hours').format('DD/MM/YYYY HH:mm')

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
                    <View style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10 }}>
                        <FastImagePlaceholder
                            style={{ width: 50, height: 50, borderRadius: 50, }}
                            source={{ uri: item.UsersInfo[0]?.image ? item.UsersInfo[0].image : item.avatar }}
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
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                <Text numberOfLines={1} style={{ maxWidth: "80%", fontSize: sizes.sText12, color: colors.colorGrayText, marginRight: 10 }}>{item.project_team ? item.project_team : "..."}</Text>
                                {item.comments ? <View style={{ flexDirection: 'row', marginRight: 10 }}>
                                    <Image source={Images.ImageJee.icChat} resizeMode='contain' style={[nstyles.nIcon12, {}]} />
                                    <Text numberOfLines={1} style={{ fontSize: sizes.sText12, marginLeft: 5 }}>{item.comments ? item.comments : 0}</Text>
                                </View> : null}
                                {item.clickup_prioritize == 0 ? null :
                                    <View style={{ marginRight: 10 }}>
                                        <Image source={Images.ImageJee.icCoKhongUuTien} style={{ width: Width(2.5), height: Width(3.5), tintColor: UtilsApp.colorPrioritize(item.clickup_prioritize) }} />
                                    </View>}
                                {item.deadline ?
                                    <View style={{ flexDirection: 'row', marginRight: 10 }}>
                                        <Image source={Images.ImageJee.icCalendarCheck} style={{ width: Width(3), height: Width(3), tintColor: item.hoanthanh == 1 ? colors.colorGrayText : UtilsApp.colorDeadline(deadlineTime) }} />
                                        <Text style={{ fontSize: sizes.sText11, marginLeft: 3, alignSelf: 'center', color: item.hoanthanh == 1 ? colors.colorGrayText : UtilsApp.colorDeadline(deadlineTime) }}>{deadline}</Text>
                                    </View> : null}
                            </View>
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 5, paddingHorizontal: 5, width: "30%" }}>
                            <View style={{ backgroundColor: item.status_info ? item.status_info.color : null, borderRadius: 20, width: '100%', padding: 5, justifyContent: 'center', alignItems: 'center', marginBottom: 5 }}>
                                <Text numberOfLines={1} style={{ textAlign: "center", color: 'white', fontSize: sizes.sText12 }}>{item.status_info ? item.status_info.statusname : "...."}</Text>
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
    }


    _updatePosition(callback) {
        if (this._button && this._button.measure) {
            this._button.measure((fx, fy, width, height, px, py) => {
                this._buttonFrame = { x: px, y: py, w: width, h: height }
                callback && callback();
            });
        }
    }
    _onButtonPress = () => {
        this._updatePosition(() => {
            this.setState({ showModal: true });
        });
    };
    _calcPosition() {
        const positionStyle = { top: this._buttonFrame.y + this._buttonFrame.h };
        return positionStyle;
    }
    hideModal = () => {
        this.setState({ showModal: false })
    }

    _renderModal = () => {
        const { showModal } = this.state;
        if (showModal && this._buttonFrame) {
            const frameStyle = this._calcPosition();
            const animationType = 'fade'
            return (
                <Modal
                    animationType={animationType}
                    visible={true}
                    transparent={true}
                    // onRequestClose={this.hideModal}
                    supportedOrientations={['portrait', 'portrait-upside-down', 'landscape', 'landscape-left', 'landscape-right']}
                    style={{ backgroundColor: 'blue' }}>
                    <TouchableWithoutFeedback disabled={!showModal} onPress={this.hideModal}  >
                        <View style={{}} >
                            <View style={[frameStyle, { width: Width(100), height: Height(100) }]}>
                                <View style={{
                                    width: Width(45), marginLeft: Width(54), borderRadius: 5, marginTop: 3, paddingHorizontal: 10, backgroundColor: colors.white, borderRadius: 5,
                                    shadowColor: 'black', shadowOffset: { width: 2, height: 2 }, shadowOpacity: 2, shadowRadius: 5, elevation: 10
                                }}>
                                    <FlatList
                                        data={this.state.dataSort}
                                        renderItem={this._renderSort}
                                        keyExtractor={(item, index) => index.toString()}
                                    />
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            );
        } else {
            return null
        }
    }

    _renderSort = ({ item, index }) => {
        return (
            <View key={index} style={{}}>
                <View style={{ flexDirection: 'row' }}>
                    {this.state.selectSort.id == item.id ?
                        <Image source={Images.ImageJee.CheckSort} style={{ width: Width(3), height: Width(3), alignSelf: 'center', marginRight: 5 }} /> : null}
                    <TouchableOpacity onPress={() => this._actionSort(item)} style={{ paddingVertical: 10, flex: 1 }} >
                        <Text style={{ fontSize: reText(14), color: colors.colorTitleNew }}>{item.title}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ height: 1, width: '100%', backgroundColor: colors.black_10 }} />
            </View>
        )
    }

    _actionSort = (item) => {
        this.setState({ checkLoadding: true })
        this.setState({
            selectSort: item, showModal: false, page: 1,
            dataCV: [], checkLoad: false
        }, () => this._GetDSCongViec())
    }
    searchTitle = () => {
        this.setState({ checkLoadding: true })
        Utils.setGlobal('searchStringCongViec' + this.IdScreen, this.state.searchString)
        this.setState({
            page: 1,
            dataCV: [],
            checkLoad: false
        }, this._GetDSCongViec)
    }

    _renderItemLoad = () => {
        return (
            <View style={{ marginTop: 13, width: Width(100) }}>
                <SkeletonPlaceholder>
                    <View style={{ flexDirection: 'row', paddingHorizontal: 15, width: Width(100) }}>
                        <View style={{ width: 50, height: 50, borderRadius: 50 }} />
                        <View style={{ marginLeft: 7 }}>
                            <View style={{ width: Width(56), height: Width(3), borderRadius: 5 }} />
                            <View style={{ width: Width(56), height: Width(3), borderRadius: 5, marginTop: 5 }} />
                            <View style={{ width: Width(20), height: Width(2), borderRadius: 5, marginTop: 12 }} />
                        </View>
                        <View style={{ marginLeft: 5, marginTop: 3 }}>
                            <View style={{ width: Width(22), height: Width(5), borderRadius: 20 }} />
                            <View style={{ width: Width(12), height: Width(3), borderRadius: 20, alignSelf: 'center', marginTop: 5 }} />
                        </View>
                    </View>
                </SkeletonPlaceholder>
                <View style={{ height: 0.5, width: Width(95), backgroundColor: colors.black_20_2, marginTop: 13, alignSelf: 'flex-end' }} />
            </View>
        )
    }

    render() {
        var { dataCV, refreshing, dataLoad, searchString, page, allPage, checkLoad, loadmore, selectSort } = this.state
        return (
            <View style={{ flex: 1 }}>
                <HeaderComStack onPressLeft={() => { Utils.goback(this, null) }}
                    nthis={this} title={RootLang.lang.JeeWork.congviechethantrongngay}
                    count={this.props.count}
                />
                <View style={{ flex: 1, backgroundColor: "#F2F3F5" }}>
                    <View style={{ backgroundColor: colors.white, flex: 1 }}>


                        {/* <View style={{ borderBottomWidth: 0.5, borderColor: colors.black_20_2, paddingBottom: 5 }}>
                            <TouchableOpacity ref={button => this._button = button}
                                onPress={() => this._onButtonPress()} style={{ borderWidth: 0.5, borderColor: colors.black_50, paddingVertical: 5, alignSelf: 'flex-end', width: Width(45), marginRight: 5, borderRadius: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5 }}>
                                <Text style={{ fontSize: reText(13), color: colors.colorTitleNew }}>{'Xếp theo:'}</Text>
                                <Text numberOfLines={1} style={{ fontSize: reText(13), color: colors.colorTitleNew, flex: 1 }}> {selectSort.title}</Text>
                                <Image source={Images.ImageJee.icModal} style={{ tintColor: colors.black_50, marginLeft: 5, width: Width(2.6), height: Width(2) }} />
                            </TouchableOpacity>
                        </View> */}
                        {/* {
                            this._renderModal()
                        } */}
                        <View style={{ flex: 1 }}>
                            {this.state.checkLoadding ?
                                <FlatList
                                    data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                                    renderItem={this._renderItemLoad}
                                    keyExtractor={(item, index) => index.toString()}
                                /> :

                                <FlatList
                                    contentContainerStyle={{ paddingBottom: Height(7) }}
                                    data={dataCV}
                                    renderItem={this._renderItem}
                                    keyExtractor={(item, index) => index.toString()}
                                    extraData={this.state}
                                    refreshing={refreshing}
                                    initialNumToRender={5}
                                    maxToRenderPerBatch={10}
                                    windowSize={7}
                                    updateCellsBatchingPeriod={100}
                                    onRefresh={this._onRefresh}
                                    onEndReached={() => {
                                        // if (!this.onEndReachedCalledDuringMomentum) {
                                        this._onLoadMore()
                                        //     this.onEndReachedCalledDuringMomentum = true;
                                        // }
                                    }}
                                    onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
                                    onEndReachedThreshold={0.2}
                                    ListFooterComponent={loadmore ? <ActivityIndicator size='small' style={{ marginTop: 15 }} /> : null}
                                    ref={ref => { this.ref = ref }}
                                    ListEmptyComponent={dataCV.length == 0 && checkLoad ? <ListEmptyLottie style={{ justifyContent: 'center', alignItems: 'center', }} textempty={RootLang.lang.JeeWork.khongcodulieu} /> : null}
                                />}
                        </View>
                    </View>
                </View>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    search: {
        flex: 1,
        paddingTop: 10,
        paddingRight: 10,
        paddingBottom: 10,
        paddingLeft: 0,
    },
    create: {
        width: Width(90), borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', paddingVertical: 10,
        borderColor: colors.black_20, elevation: Platform.OS == "android" ? 5 : 0, marginHorizontal: Width(5),
        borderWidth: 0.5, backgroundColor: colors.white, position: 'absolute', bottom: Platform.OS == 'ios' ? 20 : 10, left: 0,
        shadowColor: "rgba(0, 0, 0, 0.2)", shadowOffset: { width: 0, height: 0 }, shadowRadius: 2, shadowOpacity: 1, margin: 0,
    }
});

const mapStateToProps = state => ({
    lang: state.changeLanguage.language,
    count: state.CountWork.count,
});

export default Utils.connectRedux(CongViecTheoDoi, mapStateToProps, true)
