import React, { Component } from "react";
import { ActivityIndicator, FlatList, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ActionSheet from "react-native-actions-sheet";
import { getChiTietConTrol, getDSDuyetYeuCau, postDanhDauYCDuyet } from '../../../apis/JeePlatform/API_JeeRequest/apiDuyetYeuCau';
import { RootLang } from "../../../app/data/locales";
import Utils from "../../../app/Utils";
import UtilsApp from "../../../app/UtilsApp";
import HeaderComStackV3 from "../../../components/HeaderComStackV3";
import IsLoading from "../../../components/IsLoading";
import ListEmpty from '../../../components/ListEmpty';
import nAvatar from '../../../components/pickChartColorofAvatar';
import HeaderModalCom from "../../../Component_old/HeaderModalCom";
import { Images } from "../../../images";
import { colors } from "../../../styles";
import { reText } from "../../../styles/size";
import { nstyles, nWidth, Width } from "../../../styles/styles";

class DSDuyetYeuCau extends Component {
    constructor(props) {
        super(props);
        this.refLoading = React.createRef()
        this.state = {
            dsYeuCau: [],
            showload: false,
            refreshing: false,
            empty: true,

            pageNumber: 1,
            pageSize: 10,
            AllPage: 1,

            values: 3,
            keys: 'status',
            arrFilter: [
                { titleName: RootLang.lang.JeeRequest.boloc.tatca, values: 0, totalCount: 0 },
                { titleName: RootLang.lang.JeeRequest.boloc.daduyet, values: 1, totalCount: 0 },
                { titleName: RootLang.lang.JeeRequest.boloc.choduyet, values: 3, totalCount: 0 },
                { titleName: RootLang.lang.JeeRequest.boloc.khongduyet, values: 2, totalCount: 0 },
                { titleName: RootLang.lang.JeeRequest.boloc.quahan, values: 4, totalCount: 0 },
                { titleName: RootLang.lang.JeeRequest.boloc.dadanhdau, values: 5, totalCount: 0 },
            ]
        };
        this.mang = [
            { position: true, type: true, url: Images.ImageJee.icGoBack, title: '', style: {}, onPress: () => Utils.goback(this) }, // type(true: icon, false:text) // postion(true: trái, false phải)
            { position: false, type: true, url: Images.ImageJee.icSearch, title: '', style: {}, onPress: (keySearch) => this.searchRequest(keySearch), icSearch: true },
            { position: false, type: true, url: Images.ImageJee.icFilterr, title: '', style: {}, onPress: () => { this.refchonMenuDropdown.show() } },
        ]
    }
    componentDidMount() {
        this.refLoading.current.show()
        this._loadDS().then(res => {
            if (res) {
                this.refLoading.current.hide()
            }
        })
        this._loadFilter()
    }

    _loadDS = async (pageNumber = this.state.pageNumber, pageSize = this.state.pageSize, sortField = '', keys = this.state.keys, values = this.state.values) => {
        this.refchonMenuDropdown.hide()
        keys == '' ? 'status' : keys
        this.setState({ empty: true })

        let res = await getDSDuyetYeuCau(pageNumber, pageSize, sortField, keys, values);
        if (res.status == 1) {
            let temp = '';
            if (pageNumber != 1)
                temp = this.state.dsYeuCau.concat(res.data)
            else
                temp = res.data;
            this.setState({
                dsYeuCau: temp, AllPage: res.page.AllPage,
                showload: false, refreshing: false, empty: false,
            })
        }
        else {
            UtilsApp.MessageShow(RootLang.lang.JeeRequest.thongbao.thongbao, res?.error?.message ?? RootLang.lang.JeeRequest.thongbao.loitruyxuatdulieu, 2)
            this.setState({ showload: false, refreshing: false, empty: false })
        }
        return true

    }
    _loadFilter = async () => {
        let res = await getChiTietConTrol()
        if (res.status == 1) {
            var newList = res.data.map((x, y) => ({ ...x, titleName: this.state.arrFilter[y].titleName }))
            this.setState({ arrFilter: newList })
        } else {
            UtilsApp.MessageShow(RootLang.lang.JeeRequest.thongbao.thongbao, res?.error?.message ?? RootLang.lang.JeeRequest.thongbao.loitruyxuatdulieu, 2)
        }
    }
    searchRequest = async (keySearch) => {
        keySearch == '' ? await this.setState({ keys: 'status', pageNumber: 1 }) : await this.setState({ keys: 'keyWord', pageNumber: 1 })
        this._loadDS(this.state.pageNumber, this.state.pageSize, '', this.state.keys, keySearch == '' ? this.state.values : keySearch)
    }
    _onTick = async (value, danhdau, index) => {
        const { dsYeuCau } = this.state
        dsYeuCau[index].DanhDau = dsYeuCau[index].DanhDau == 0 ? -1 : 0
        this.setState({ dsYeuCau: dsYeuCau })

        let res = await postDanhDauYCDuyet(value, danhdau)
        let temp = res.data[0]
        dsYeuCau.forEach((item, i) => {
            if (temp.RowID == item.RowID) {
                dsYeuCau[i] = temp
                return
            }
        })
        this.setState({ dsYeuCau: dsYeuCau })
    }
    _onRefresh = () => {
        this.setState({ refreshing: true, pageNumber: 1 }, () => this._loadDS());
    }
    _onLoadMore = async () => {
        const { pageNumber, AllPage } = this.state
        if (pageNumber < AllPage) {
            this.setState({ showload: true, pageNumber: pageNumber + 1 }, () => this._loadDS());
        }
    }
    _handleReloadData = async (pageNumber = this.state.pageNumber, pageSize = this.state.pageSize, sortField = '', keys = this.state.keys, values = this.state.values) => {
        this.refchonMenuDropdown.hide()
        this.setState({ empty: true })
        let res = await getDSDuyetYeuCau(pageNumber, pageSize, sortField, keys, values);
        if (res.status == 1) {
            return res.data
        }
        else {
            UtilsApp.MessageShow(RootLang.lang.JeeRequest.thongbao.thongbao, res?.error?.message || RootLang.lang.JeeRequest.thongbao.loitruyxuatdulieu, 2)
            return ''
        }
    }
    _handleReload = (type, index, item) => { //type: 1-xoá|duyệt|khôngduyet, 2-sửa, 3-thêm, 4-thêm ở vị trí
        //replace item when item change
        let { pageNumber, AllPage, dsYeuCau } = this.state
        this._loadFilter()
        if (type == 1) {
            if (pageNumber < AllPage) { //Xoá khi chưa load hết danh sách
                dsYeuCau.splice(index, 1)
                this.setState({ dsYeuCau }, () => this._handleReloadData().then((res) => {
                    if (res) {
                        dsYeuCau.push(res[res.length - 1])
                        this.setState({ dsYeuCau })
                    }
                }))
            } else {//Xoá khi load hết danh sách
                dsYeuCau.splice(index, 1)
                this.setState({ dsYeuCau })
            }
        }
        if (type == 2) {
            dsYeuCau[index] = item
            this.setState({ dsYeuCau })
        }
        if (type == 3) {
            this.Flatlist.scrollToOffset({ animated: true, offset: 0 })
            this.setState({ pageNumber: 1 }, this._loadDS)
        }
        if (type == 4) {
            dsYeuCau.splice(index, 0, item)
            this.setState({ dsYeuCau })
        }
    }
    _goDetailScreen = (item, index) => {
        Utils.goscreen(this, 'sc_ChiTietYeuCau', {
            typeScreen: 2, //typeScreen: 1-List gửi yêu cầu, 2-List duyệt yêu cầu
            rowid: item.RowID,
            index: index,
            chitietyc: item,
            reload: (type, index, item) => this._handleReload(type, index, item),
            valuesFilter: this.state.values,
            loaimanhinh: item.NodeID
        })
    }
    _reloadFilter = (values) => {
        this.setState({ values: values, pageNumber: 1 },
            () => {
                this.Flatlist.scrollToOffset({ animated: true, offset: 0 })
                this._loadDS()
            })
    }
    _loadDSYeuCau = ({ item, index }) => {
        var txtStatus = RootLang.lang.JeeRequest.boloc.khongduyet
        var colorStatus = colors.redtext
        if (item.TinhTrangDuyet == 0) {
            txtStatus = RootLang.lang.JeeRequest.boloc.choduyet
            colorStatus = colors.orangeSix
        }
        else if (item.TinhTrangDuyet == 1) {
            txtStatus = RootLang.lang.JeeRequest.boloc.daduyet
            colorStatus = colors.greenTab
        }
        return (
            <TouchableOpacity key={index}
                style={{
                    flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, borderBottomWidth: 2,
                    borderColor: colors.colorLineGray, paddingVertical: 15, backgroundColor: 'white', width: Width(100)
                }}
                onPress={() => this._goDetailScreen(item, index)}>
                <View style={{ backgroundColor: colorStatus, width: 10, height: 10, borderRadius: 5, marginRight: 10, marginTop: 4 }}></View>
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: reText(15), color: '#404040' }} numberOfLines={1}>{item.TenYeuCau}</Text>
                            <Text style={{ fontSize: reText(15), fontWeight: 'bold', color: colorStatus, marginTop: 5 }}>{txtStatus}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {item.NguoiTao ?
                                !item.NguoiTao[0]?.Image ?
                                    <View style={[nstyles.nAva40, { backgroundColor: nAvatar(item.NguoiTao[0]?.HoTen).color, justifyContent: 'center', alignItems: 'center' }]}>
                                        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>{nAvatar(item.NguoiTao[0]?.HoTen).chart}</Text>
                                    </View>
                                    : <Image source={{ uri: item.NguoiTao[0]?.Image }} style={[nstyles.nAva40]}></Image>
                                : null
                            }
                            <TouchableOpacity style={{ marginLeft: 5 }} onPress={() => this._onTick(item.DanhDau, item.RowID, index)}>
                                <Image source={item.DanhDau == '0' ? Images.ImageJee.icNoStar : Images.ImageJee.icStar} style={nstyles.nIcon22}></Image>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 }}>
                        <Text numberOfLines={1} style={{ color: colors.textGray, fontSize: 12, flex: 1 }}>{item.MoTa}</Text>
                        <Text style={{ color: colors.textGray, color: '#404040', fontSize: reText(14) }}>{Utils.formatTimeAgo(item.NgayTao + 'Z', 1, true)}</Text>
                    </View>
                </View>
            </TouchableOpacity >
        )
    }
    _renderFilter = ({ item, index }) => {
        const isActive = item.values == this.state.values
        return (
            <TouchableOpacity
                onPress={() => this._reloadFilter(item.values)}
                style={{
                    paddingVertical: 9, paddingHorizontal: 10, minWidth: nWidth(20), alignItems: 'center', justifyContent: 'center', borderRadius: 17,
                    backgroundColor: isActive ? '#18AB2C' : null
                }}>
                <Text style={{ color: isActive ? 'white' : null, fontWeight: '500' }}>{item.titleName} {`(${item.totalCount})`}</Text>
            </TouchableOpacity>
        )
    }
    _renderListFilter = () => {
        const { values } = this.state
        return (
            this.state.arrFilter.map(obj =>
                <TouchableOpacity style={styles.buttondropdown} onPress={() => this._reloadFilter(obj.values)}>
                    <Text style={{ color: obj.values == values ? colors.redStar : colors.black, fontWeight: obj.values == values ? 'bold' : null }}>{obj.titleName}</Text>
                </TouchableOpacity>)
        )
    }
    render() {
        const { dsYeuCau, refreshing, showload, empty, arrFilter } = this.state
        return (
            <View style={{ flex: 1 }}>
                <HeaderComStackV3
                    nthis={this}
                    title={RootLang.lang.JeeRequest.sc_DuyetYeuCau.duyetyeucau}
                    styleTitle={{ fontWeight: 'bold' }}
                    mang={this.mang}
                />
                <View>
                    <FlatList
                        contentContainerStyle={{ paddingHorizontal: 10 }}
                        style={{ paddingVertical: 15, backgroundColor: 'white', borderBottomColor: colors.textGray, borderBottomWidth: 0.5 }}
                        data={arrFilter}
                        // extraData={this.state}
                        renderItem={this._renderFilter}
                        horizontal
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item, index) => index.toString()} />
                </View>
                <View style={{ alignItems: 'center', flex: 1 }}>
                    <FlatList
                        ref={ref => this.Flatlist = ref}
                        data={dsYeuCau}
                        // extraData={this.state}
                        renderItem={this._loadDSYeuCau}
                        onRefresh={this._onRefresh}
                        refreshing={refreshing}
                        onEndReached={this._onLoadMore}
                        onEndReachedThreshold={0.2}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item, index) => index.toString()}
                        ListEmptyComponent={dsYeuCau.length == 0 && !empty ? <ListEmpty style={{ justifyContent: 'center', alignItems: 'center', }} textempty={RootLang.lang.JeeRequest.dungchung.khongcodulieu} /> : null}
                        ListFooterComponent={showload ? <ActivityIndicator size='small' /> : null} />
                    <IsLoading ref={this.refLoading} />
                </View>
                <ActionSheet ref={ref => this.refchonMenuDropdown = ref} style={{ flex: 1 }}>
                    <View style={{ paddingHorizontal: 10, marginBottom: Platform.OS == 'ios' ? 15 : 0 }}>
                        <HeaderModalCom title={RootLang.lang.JeeRequest.boloc.locyeucau} onPress={() => this.refchonMenuDropdown.hide()}></HeaderModalCom>
                        <View style={{ backgroundColor: 'white' }}>
                            {this._renderListFilter()}
                        </View>
                    </View>
                </ActionSheet>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    buttondropdown: {
        borderBottomWidth: 0.5,
        borderBottomColor: colors.lightBlack,
        paddingVertical: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
});

export default DSDuyetYeuCau;
