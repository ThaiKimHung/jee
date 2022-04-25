import React, { Component } from "react";
import { FlatList, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, Modal, TouchableWithoutFeedback } from "react-native";
import { RootLang } from "../../../app/data/locales";
import Utils from "../../../app/Utils";
import { Images } from "../../../images";
import { colors } from "../../../styles";
import { Height, nHeight, nstyles, Width, paddingBotX } from "../../../styles/styles";
import { getListQuyTrinh, getListWorkQuyTrinh } from '../../../apis/JeePlatform/API_JeeWork/apiCongViecQuyTrinh'
import UtilsApp from '../../../app/UtilsApp'
import HTML from "react-native-render-html";
import moment from "moment";
import nAvatar from '../../../components/pickChartColorofAvatar'
import ListEmptyLottie from "../../../components/NewComponents/ListEmptyLottie";
import HeaderComStack from "../../../components/HeaderComStack";
import { reText } from "../../../styles/size";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

class ListCVQuyTrinh extends Component {
    constructor(props) {
        super(props);
        this.type = Utils.ngetParam(this.props.nthis || this, 'type', 0)
        this.state = {
            searchString: '',
            listWorkQuyTrinh: [],
            listQuyTrinh: [],
            refreshing: false,
            showListNull: false,
            showload: false,
            page: 1,
            record: 20,
            AllPage: 1,
            isprocess: true,
            processid: '',
            idType: 4,
            typeid: '',
            from: moment().add(-6, 'months').format('DD/MM/YYYY'),
            to: moment().format('DD/MM/YYYY'),
            keyword: '',
            isHoanThanh: this.type == 0 || this.type == 1 ? true : false,
            isHetHan: this.type == 0 || this.type == 1 ? false : true,

            dataSort: [
                { id: 0, title: 'Ngày nhận giảm', sortField: 'assigndate', sortOrder: 'desc' },
                { id: 1, title: 'Ngày nhận tăng', sortField: 'assigndate', sortOrder: 'asc' },
                { id: 2, title: 'Ngày tạo giảm', sortField: 'createddate', sortOrder: 'desc' },
                { id: 3, title: 'Ngày tạo tăng', sortField: 'createddate', sortOrder: 'asc' },
                // { id: 2, title: 'Ưu tiên cao' }, //BE yet
                // { id: 3, title: 'Ưu tiên thấp' }, //BE yet
                { id: 4, title: 'Hạn chót giảm', sortField: 'deadline', sortOrder: 'desc' },
                { id: 5, title: 'Hạn chót tăng', sortField: 'deadline', sortOrder: 'asc' },
            ],
            selectSort: { id: 0, title: 'Ngày nhận giảm', sortField: 'assigndate', sortOrder: 'desc' },
            showModal: false,
            checkLoadding: false //Check loadding list
        };
        this.nthis = this.props.nthis
    }

    componentDidMount() {
        this.setState({ checkLoadding: true })
        this._loadListWorkQuyTrinh().then(res => {
            if (res)
                this.setState({ checkLoadding: false })
        })
        this._loadListQuyTrinh()
    }
    _loadListWorkQuyTrinh = async () => {
        const { page, record, isprocess, processid, idType, from, to, keyword, isHoanThanh, isHetHan, selectSort, typeid } = this.state
        const paramester = { page, record, isprocess, processid, idType, from, to, keyword, isHoanThanh, isHetHan, sortField: selectSort.sortField, sortOrder: selectSort.sortOrder, typeid }
        const res = await getListWorkQuyTrinh(paramester)
        if (res.status == 1) {
            var temp = []
            if (this.state.page == 1)
                temp = res.data
            else
                temp = this.state.listWorkQuyTrinh.concat(res.data)
            this.props.SetCountProceduralWork(res?.page?.TotalCount || 0)
            this.setState({ showListNull: true, refreshing: false, showload: false, listWorkQuyTrinh: temp || [] })
        } else {
            UtilsApp.MessageShow('Thông báo', res?.error?.message || 'Lỗi truy xuất dữ liệu', 2)
            this.setState({ showListNull: true, refreshing: false, showload: false, listWorkQuyTrinh: [] })
        }
        return true
    }
    _loadListQuyTrinh = async () => {
        const res = await getListQuyTrinh()
        if (res.status == 1) {
            this.setState({ listQuyTrinh: [{ rowid: '', title: "Tất cả" }, ...res.data] })
        } else {
            UtilsApp.MessageShow('Thông báo', res?.error?.message || 'Lỗi truy xuất dữ liệu', 2)
        }
    }
    _filter = () => {
        const { idType, from, to, keyword, listQuyTrinh, processid, isHoanThanh, isHetHan, typeid } = this.state
        Utils.goscreen(this.props.nthis || this, "sc_BoLocQuyTrinh", {
            type: 1,
            idType: idType,
            from: from,
            to: to,
            keyword: keyword,
            listQuyTrinh: listQuyTrinh,
            processid: processid,
            hoanthanh: isHoanThanh,
            hethan: isHetHan,
            typeid: typeid,
            callback: (obj) => this._callbackFilter(obj)
        })
    }
    _callbackFilter = ({ idQuyTrinh, idType, from, to, keyword, hoanthanh, hethan, typeid } = {}) => {
        // console.log('typeid: ', typeid);
        if (idQuyTrinh || idType || keyword == '' || keyword || typeid) {
            this.Flatlist.scrollToOffset({ animated: true, offset: 1 })
            this.setState({ page: 1, processid: idQuyTrinh, idType, from, to, keyword, isHoanThanh: hoanthanh, isHetHan: hethan, typeid }, this._loadListWorkQuyTrinh)
        }
    }
    _onLoadMore = () => {
        if (this.state.page < this.state.AllPage) {
            this.setState({ showload: true, page: this.state.page + 1 }, this._loadListWorkQuyTrinh)
        }
    }
    _onRefresh = () => {
        this.setState({ refreshing: true, page: 1 }, this._loadListWorkQuyTrinh)
    }
    _renderTask = ({ item, index }) => {
        const colorTitle = item.stage_statusid == 2 ? colors.colorTabActive :
            item.stage_statusid == 0 || item.stage_statusid == 1 ? colors.orange1 : colors.gray1
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                <View style={[nstyles.nIcon10, { backgroundColor: colorTitle, marginHorizontal: 5, borderRadius: nstyles.nIcon10.height / 2 }]}></View>
                <Text>{item.stage}</Text>
            </View>
        )
    }

    _renderItemLoad = () => {
        return (
            <View style={{ marginTop: 13, width: Width(100) }}>
                <SkeletonPlaceholder>
                    <View style={{ flexDirection: 'row', paddingHorizontal: 15, width: Width(100) }}>
                        <View style={{ width: 50, height: 50, borderRadius: 50 }} />
                        <View style={{ marginLeft: 7 }}>
                            <View style={{ width: Width(58), height: Width(3), borderRadius: 5 }} />
                            <View style={{ width: Width(58), height: Width(2), borderRadius: 5, marginTop: 10 }} />
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
                                <View style={{ width: Width(3), height: Width(3), borderRadius: Width(3), marginHorizontal: 5 }} />
                                <View style={{ width: Width(20), height: Width(2), borderRadius: 5 }} />
                            </View>
                        </View>
                        <View style={{ marginLeft: 5, marginTop: 3 }}>
                            <View style={{ width: Width(20), height: Width(2), borderRadius: 20 }} />
                        </View>
                    </View>
                </SkeletonPlaceholder>
                <View style={{ height: 0.5, width: Width(95), backgroundColor: colors.black_20_2, marginTop: 20, alignSelf: 'flex-end' }} />
            </View>
        )
    }

    _renderItem = ({ item, index }) => {
        const colorTitle = item.stage_statusid == 2 ? colors.colorTabActive :
            item.stage_statusid == 0 || item.stage_statusid == 1 ? colors.orange1 : colors.gray1
        return (
            <View key={index}>
                <TouchableOpacity
                    onPress={() => Utils.goscreen(this.props.nthis || this, 'sc_TabCongViecChiTiet', { stageid: item.stageid, taskid: item.taskid, loadLaiData: this._loadListWorkQuyTrinh })}
                    style={{ flexDirection: 'row', padding: 10, backgroundColor: 'white', justifyContent: 'center' }}>
                    <View style={{ marginRight: 10 }}>
                        <View>
                            {
                                item.stage_implementer?.AvartarImgURL ?
                                    <View>
                                        <Image source={{ uri: item.stage_implementer?.AvartarImgURL }} style={nstyles.nAva50}></Image>
                                    </View>
                                    :
                                    <View style={[nstyles.nAva50, { backgroundColor: nAvatar(item?.stage_implementer?.FullName).color, justifyContent: 'center', alignItems: 'center' }]}>
                                        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>{nAvatar(item?.stage_implementer?.FullName).chart}</Text>
                                    </View>
                            }
                            {item.IsQuaHan ? <Image source={Images.ImageJee.icQuaHan} style={styles.icQuaHan}></Image> : null}
                        </View>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'space-around' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={{ flex: 1, color: colorTitle, fontSize: 16, fontWeight: 'bold' }} numberOfLines={1}>{item.task}</Text>
                            <Text style={{ marginLeft: 5, fontSize: 12 }}>{moment(item.stage_assigndate).format('DD/MM/YYYY')}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
                            <Text style={{ flex: 1, fontWeight: '500' }}>{item.stage} [{item.process}]</Text>
                            {item?.stage_deadline ? <Text style={{ marginLeft: 5, fontSize: 12, color: colors.red1, }}>{moment(item.stage_deadline).format('HH:mm DD/MM')}</Text> : null}
                        </View>
                        {
                            item.task_description ?
                                <HTML
                                    source={{ html: `<div>${item.task_description}</div>` }}
                                    containerStyle={{ maxHeight: nHeight(10), marginBottom: item?.todo?.length > 0 ? 10 : 0 }}
                                    renderers={{
                                        p: (_, children) => <Text numberOfLines={1}>{children}</Text>,
                                        div: (_, children) => <Text numberOfLines={1}>{children}</Text>,
                                        p1: (_, children) => <Text numberOfLines={1}>{children}</Text>,
                                        p2: (_, children) => <Text numberOfLines={1}>{children}</Text>,
                                        p3: (_, children) => <Text numberOfLines={1}>{children}</Text>,
                                        p4: (_, children) => <Text numberOfLines={1}>{children}</Text>,
                                        p5: (_, children) => <Text numberOfLines={1}>{children}</Text>,
                                    }}
                                    tagsStyles={{
                                        p: { margin: 0, color: colors.gray1 },
                                        div: { margin: 0, color: colors.gray1 },
                                        h1: { margin: 0, color: colors.gray1 },
                                        h2: { margin: 0, color: colors.gray1 },
                                        h3: { margin: 0, color: colors.gray1 },
                                        h4: { margin: 0, color: colors.gray1 },
                                        h5: { margin: 0, color: colors.gray1 }
                                    }}
                                />
                                : null
                        }
                        {
                            item?.todo?.length > 0 ?
                                <FlatList
                                    data={item.todo}
                                    renderItem={this._renderTask}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                                : null
                        }
                    </View>

                </TouchableOpacity >
                {index != this.state.listWorkQuyTrinh.length - 1 ? (
                    <View style={{ height: 0.5, width: Width(95), backgroundColor: colors.black_20_2, alignSelf: 'flex-end' }} />
                )
                    :
                    (
                        <View style={{ paddingBottom: paddingBotX + 10 }} />
                    )}
            </View>
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
    _handleClickSelectSort = (item) => {
        this.setState({ selectSort: item, showModal: false }, this._loadListWorkQuyTrinh)
    }
    _renderSort = ({ item, index }) => {
        return (
            <View key={index} style={{}}>
                <View style={{ flexDirection: 'row' }}>
                    {this.state.selectSort.id == item.id ?
                        <Image source={Images.ImageJee.CheckSort} style={{ width: Width(3), height: Width(3), alignSelf: 'center', marginRight: 5 }} /> : null}
                    <TouchableOpacity onPress={() => this._handleClickSelectSort(item)} style={{ paddingVertical: 10, flex: 1 }} >
                        <Text style={{ fontSize: reText(14), color: colors.colorTitleNew }}>{item.title}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ height: 1, width: '100%', backgroundColor: colors.black_10 }} />
            </View>
        )
    }

    render() {
        const { searchString, listWorkQuyTrinh, refreshing, showload, showListNull, keyword, selectSort, dataSort } = this.state
        return (
            <View style={{ flex: 1, backgroundColor: colors.white }}>
                {
                    this.props.nthis ?
                        null :
                        <HeaderComStack onPressLeft={() => { Utils.goback(this, null) }}
                            nthis={this} title={'Nhiệm vụ đang phụ trách'}
                        />
                }
                <View style={styles.viewFilter}>
                    <View style={styles.viewSearch}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                            <Image source={Images.icSearch} style={{ height: 15, width: 15, marginHorizontal: 10, }} />
                            <TextInput
                                returnKeyType='search'
                                style={styles.inputSearch}
                                placeholder={RootLang.lang.JeeWork.timkiem}
                                onChangeText={(keyword) => {
                                    this.setState({ keyword }, this._loadListWorkQuyTrinh)
                                }}
                                // onSubmitEditing={this._GetDSCongViec}
                                value={keyword}
                                underlineColorAndroid="transparent"
                            />
                        </View>
                    </View>
                    <TouchableOpacity style={styles.touchFilter} onPress={this._filter}>
                        <Image source={Images.ImageJee.icLoc} style={{ padding: 10, }} />
                    </TouchableOpacity>
                </View>
                <View style={{ borderBottomWidth: 0.5, borderColor: colors.black_20_2, paddingBottom: 5 }}>
                    <TouchableOpacity ref={button => this._button = button}
                        onPress={() => this._onButtonPress()} style={{ borderWidth: 0.5, borderColor: colors.black_50, paddingVertical: 5, alignSelf: 'flex-end', width: Width(45), marginRight: 5, borderRadius: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5 }}>
                        <Text style={{ fontSize: reText(13), color: colors.colorTitleNew }}>{RootLang.lang.thongbaochung.xeptheo}:</Text>
                        <Text numberOfLines={1} style={{ fontSize: reText(13), color: colors.colorTitleNew, flex: 1 }}> {selectSort.title}</Text>
                        <Image source={Images.ImageJee.icModal} style={{ tintColor: colors.black_50, marginLeft: 5, width: Width(2.6), height: Width(2) }} />
                    </TouchableOpacity>
                </View>
                {
                    this._renderModal()
                }
                {this.state.checkLoadding ?
                    <FlatList
                        data={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
                        renderItem={this._renderItemLoad}
                        keyExtractor={(item, index) => index.toString()}
                    /> :
                    <FlatList
                        // contentContainerStyle={{ paddingBottom: 15 }}
                        // style={{ paddingTop: 10, marginTop: 5 }}
                        // extraData={this.state}
                        data={listWorkQuyTrinh}
                        renderItem={this._renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        refreshing={refreshing}
                        onRefresh={this._onRefresh}
                        onEndReached={this._onLoadMore}
                        onEndReachedThreshold={0.1}
                        // initialNumToRender={5}
                        // maxToRenderPerBatch={10}
                        // windowSize={7}
                        // updateCellsBatchingPeriod={100}
                        ref={ref => this.Flatlist = ref}
                        ListEmptyComponent={listWorkQuyTrinh?.length == 0 && showListNull ? <ListEmptyLottie style={{ justifyContent: 'center', alignItems: 'center', }} textempty={RootLang.lang.JeeWork.khongcodulieu} /> : null}
                        ListFooterComponent={showload ? <ActivityIndicator size='small' style={{ marginVertical: 10 }} /> : null}
                    />}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    viewFilter: { marginVertical: 10, flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20 },
    viewSearch: {
        backgroundColor: "#F2F3F5",
        borderRadius: 20,
        width: "90%"
    },
    inputSearch: {
        flex: 1,
        paddingTop: 10,
        paddingRight: 10,
        paddingBottom: 10,
        paddingLeft: 0,
    },
    touchFilter: {
        justifyContent: 'center', alignItems: 'center'
    },
    viewAvatar: {
        ...nstyles.nAva40, justifyContent: 'center', alignItems: 'center'
    },
    icQuaHan: {
        ...nstyles.nIcon17, position: 'absolute', bottom: 0, right: 0,
    }
});

const mapStateToProps = state => ({
    lang: state.changeLanguage.language,
});

export default Utils.connectRedux(ListCVQuyTrinh, mapStateToProps, true)