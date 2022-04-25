import React, { Component } from "react";
import { ActivityIndicator, FlatList, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ActionSheet from "react-native-actions-sheet";
import { getDSGuiYeuCau, postDanhDau, postDanhDauYeuCauGui } from '../../../apis/JeePlatform/API_JeeRequest/apiGuiYeuCau';
import { RootLang } from "../../../app/data/locales";
import Utils from "../../../app/Utils";
import UtilsApp from "../../../app/UtilsApp";
import HeaderComStackV3 from "../../../components/HeaderComStackV3";
import IsLoading from "../../../components/IsLoading";
import ListEmpty from '../../../components/ListEmpty';
import nAvatar from '../../../components/pickChartColorofAvatar';
import HeaderModalCom from '../../../Component_old/HeaderModalCom';
import { Images } from "../../../images";
import { colors } from "../../../styles";
import { reText } from "../../../styles/size";
import { nstyles, nWidth, paddingBotX, Width } from "../../../styles/styles";
class GuiYeuCau extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dsYeuCau: [],
            showload: false,
            refreshing: false,

            pageNumber: 1,
            allPage: 1,
            pageSize: 10,

            values: 0,
            empty: true,
        };
        this.mang = [
            { position: true, type: true, url: Images.ImageJee.icGoBack, title: '', style: {}, onPress: () => { Utils.goback(this) } }, // type(true: icon, false:text) // postion(true: trái, false phải)
            { position: false, type: true, url: Images.ImageJee.icFilterr, title: '', style: {}, onPress: () => { this.refs.chonMenuDropdown.show() } },

        ]
        this.arrFilter = [
            { title: RootLang.lang.JeeRequest.boloc.tatca, values: 0 },
            { title: RootLang.lang.JeeRequest.boloc.daduyet, values: 1 },
            { title: RootLang.lang.JeeRequest.boloc.choduyet, values: 3 },
            { title: RootLang.lang.JeeRequest.boloc.khongduyet, values: 2 },
            { title: RootLang.lang.JeeRequest.boloc.quahan, values: 4 },
            { title: RootLang.lang.JeeRequest.boloc.dadanhdau, values: 5 },
        ]
    }
    componentDidMount() {
        this.isLoading.show()
        this._loadDS().then(res => {
            if (res) {
                this.isLoading.hide()
            }
        })
    }

    _loadDS = async (pageNumber = this.state.pageNumber, keys = '', values = this.state.values) => {
        const { pageSize } = this.state
        this.refs.chonMenuDropdown.hide()
        this.setState({ empty: true })

        let res = await getDSGuiYeuCau(pageNumber, pageSize, keys, values);
        if (res.status == 1) {
            let temp = '';
            if (pageNumber != 1)
                temp = this.state.dsYeuCau.concat(res.data)
            else
                temp = res.data;
            this.setState({ dsYeuCau: temp, allPage: res.page.AllPage, showload: false, refreshing: false, empty: false, })
        }
        else {
            this.setState({ showload: false, refreshing: false, empty: false })
            UtilsApp.MessageShow(RootLang.lang.JeeRequest.thongbao.thongbao, res?.error?.message || RootLang.lang.JeeRequest.thongbao.loitruyxuatdulieu, 2)
        }
        return true
    }
    _onLoadMore = () => {
        var { pageNumber, allPage } = this.state
        if (pageNumber < allPage) {
            this.setState({ showload: true, pageNumber: pageNumber + 1 }, () => this._loadDS());
        }
    }
    _onTick = async (value, danhdau, index) => {
        const { dsYeuCau } = this.state
        dsYeuCau[index].DanhDau = dsYeuCau[index].DanhDau == 0 ? -1 : 0
        this.setState({ dsYeuCau: dsYeuCau }) //thay đổi trên giao diện rồi mới thay đổi trên server để load nhanh hơn

        let res = await postDanhDauYeuCauGui(value, danhdau)
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
    _handleReloadData = async (pageNumber = this.state.pageNumber, keys = '', values = this.state.values) => {
        const { pageSize } = this.state

        this.refs.chonMenuDropdown.hide()
        this.setState({ empty: true })

        let res = await getDSGuiYeuCau(pageNumber, pageSize, keys, values);
        if (res.status == 1) {
            return res.data
        }
        else {
            UtilsApp.MessageShow(RootLang.lang.JeeRequest.thongbao.thongbao, res?.error?.message || RootLang.lang.JeeRequest.thongbao.loitruyxuatdulieu, 2)
            return ''
        }
    }
    _handleReload = (type, index, item) => { //type: 1-xoá, 2-sửa, 3-thêm, 4-thêm ở vị trí
        //replace item when item change
        let { pageNumber, allPage, dsYeuCau } = this.state
        if (type == 1) {
            if (pageNumber < allPage) { //Xoá khi chưa load hết danh sách
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
            typeScreen: 1,//typeScreen: 1-List gửi yêu cầu, 2-List duyệt yêu cầu
            rowid: item.RowID,
            index: index,
            chitietyc: item,
            reload: (type, index, item) => this._handleReload(type, index, item),
            valuesFilter: this.state.values
        })
    }
    _renderListFilter = () => {
        const { values } = this.state
        return (
            this.arrFilter.map(obj =>
                <TouchableOpacity style={styles.buttondropdown} onPress={() => this.setState({ values: obj.values, pageNumber: 1 }, () => { this.Flatlist.scrollToOffset({ animated: true, offset: 0 }), this._loadDS() })}>
                    <Text style={{ color: obj.values == values ? colors.redStar : colors.black, fontSize: 14, fontWeight: obj.values == values ? 'bold' : null }}>{obj.title}</Text>
                </TouchableOpacity>)
        )
    }
    _loadDSYeuCau = ({ item, index }) => {
        var txtStatus = RootLang.lang.JeeRequest.boloc.khongduyet
        var colorStatus = colors.redtext
        if (item.Id_TinhTrang == 0) {
            txtStatus = RootLang.lang.JeeRequest.boloc.choduyet
            colorStatus = colors.orangeSix
        }
        else if (item.Id_TinhTrang == 1) {
            txtStatus = RootLang.lang.JeeRequest.boloc.daduyet
            colorStatus = colors.greenTab
        }
        return (
            <TouchableOpacity
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
                            {item.NguoiDuyet?.length > 0 ?
                                !item.NguoiDuyet[item.NguoiDuyet?.length - 1].Image ?
                                    <View style={[nstyles.nAva40, { backgroundColor: nAvatar(item.NguoiDuyet[item.NguoiDuyet?.length - 1].HoTen).color, justifyContent: 'center', alignItems: 'center' }]}>
                                        <Text style={styles.textAvatar}>{nAvatar(item.NguoiDuyet[item.NguoiDuyet?.length - 1].HoTen).chart}</Text>
                                    </View>
                                    : <Image source={{ uri: item.NguoiDuyet[item.NguoiDuyet?.length - 1].Image }} style={[nstyles.nAva40]}></Image>
                                : null
                            }
                            <TouchableOpacity style={{ marginLeft: 5 }} onPress={() => this._onTick(item.DanhDau, item.RowID, index)}>
                                <Image source={item.DanhDau == '0' ? Images.ImageJee.icNoStar : Images.ImageJee.icStar} style={nstyles.nIcon22}></Image>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 }}>
                        <Text numberOfLines={1} style={{ color: colors.textGray, fontSize: 12, flex: 1 }}>{item.MoTa}</Text>
                        <Text style={{ color: '#404040' }}>{Utils.formatTimeAgo(item.NgayTao + 'Z', 1, true)}</Text>
                    </View>
                </View>
            </TouchableOpacity >
        )
    }
    render() {
        const { dsYeuCau, refreshing, showload, empty, values } = this.state
        return (
            <View style={{ flex: 1, paddingBottom: paddingBotX }}>
                <HeaderComStackV3
                    nthis={this}
                    title={RootLang.lang.JeeRequest.sc_GuiYeuCau.yeucau}
                    mang={this.mang}
                />
                <View style={{ alignItems: 'center', flex: 1 }}>
                    <FlatList
                        ref={ref => this.Flatlist = ref}
                        data={dsYeuCau}
                        renderItem={this._loadDSYeuCau}
                        onRefresh={this._onRefresh}
                        refreshing={refreshing}
                        onEndReached={() => this._onLoadMore()}
                        onEndReachedThreshold={0.3}
                        initialNumToRender={10}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item, index) => index.toString()}
                        ListEmptyComponent={dsYeuCau.length == 0 && !empty ? <ListEmpty style={{ justifyContent: 'center', alignItems: 'center', }} textempty={RootLang.lang.JeeRequest.dungchung.khongcodulieu} /> : null}
                        ListFooterComponent={showload ? <ActivityIndicator size='small' /> : null} />
                    <IsLoading ref={ref => this.isLoading = ref} />
                </View>
                <TouchableOpacity
                    style={styles.btnCreateRequest}
                    onPress={() =>
                        Utils.goscreen(this, 'sc_LoaiHinhThuc', {
                            reload: () => {
                                this.Flatlist.scrollToOffset({ animated: true, offset: 0 })
                                this.setState({ pageNumber: 1 }, this._loadDS)
                            }
                        })
                    }>
                    <Text style={styles.txtCreateRequest}>Tạo yêu cầu mới</Text>
                </TouchableOpacity>
                <ActionSheet ref={'chonMenuDropdown'}>
                    <View style={{ paddingHorizontal: 10, marginBottom: Platform.OS == 'ios' ? 15 : 0 }}>
                        <HeaderModalCom title={RootLang.lang.JeeRequest.boloc.locyeucau} onPress={() => this.refs.chonMenuDropdown.hide()}></HeaderModalCom>
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
    textAvatar: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold'
    },
    textMoTa: {
        color: colors.textGray,
        fontSize: 12
    },
    txtTenYeuCau: {
        maxWidth: '70%',
        fontSize: 14
    },
    txtNgayTao: {
        color: colors.textGray,
        fontSize: 10
    },
    txtTinhTrang: {
        fontWeight: 'bold',
        fontSize: 14
    },
    txtDropdown: {
        fontSize: 14
    },
    btnCreateRequest: {
        width: Width(90), borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', paddingVertical: 10,
        borderColor: colors.black_20, elevation: Platform.OS == "android" ? 5 : 0, marginHorizontal: Width(5),
        borderWidth: 0.5, backgroundColor: colors.white, position: 'absolute', bottom: Platform.OS == 'ios' ? 20 : 10, left: 0,
        shadowColor: "rgba(0, 0, 0, 0.2)", shadowOffset: { width: 0, height: 0 }, shadowRadius: 2, shadowOpacity: 1, margin: 0,
    },
    txtCreateRequest: {
        fontSize: reText(14), color: colors.colorJeeNew.colorBlueHome, fontWeight: 'bold'
    }
});

export default GuiYeuCau;
