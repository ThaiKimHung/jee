import React, { Component } from 'react'
import { BackHandler, FlatList, Image, Platform, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native'
import ActionSheet from 'react-native-actions-sheet'
import { ActivityIndicator } from 'react-native-paper'
import { getLoaiHinhThuc, postDanhDauLoaiYC, postDongMoLoaiYC } from '../../../apis/JeePlatform/API_JeeRequest/apiCaiDatYeuCau'
import { RootLang } from '../../../app/data/locales'
import Utils from '../../../app/Utils'
import UtilsApp from '../../../app/UtilsApp'
import HeaderComStackV3 from '../../../components/HeaderComStackV3'
import IsLoading from '../../../components/IsLoading'
import ListEmpty from '../../../components/ListEmpty'
import HeaderModalCom from '../../../Component_old/HeaderModalCom'
import { Images } from '../../../images'
import { colors } from '../../../styles'
import { reText } from '../../../styles/size'
import { nstyles, Width } from '../../../styles/styles'
export class LoaiYeuCau extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dsLoaiHinhThuc: [],

            empty: true,
            showload: false,
            refreshing: false,

            status: 2,
            keys: 'status',
        }
        this.mang = [
            { position: true, type: true, url: Images.ImageJee.icGoBack, title: '', style: {}, onPress: () => { this._goBack() } }, // type(true: icon, false:text) // postion(true: trái, false phải)
            { position: false, type: true, url: Images.ImageJee.icSearch, title: '', style: {}, onPress: (value) => this.onSeacrch(value), icSearch: true },
            { position: false, type: true, url: Images.ImageJee.icFilterr, title: '', style: {}, onPress: () => { this.refs.chonMenuDropdown.show() } },
        ]
        this.arrFilter = [
            { title: RootLang.lang.JeeRequest.boloc.tatca, id: 2 },
            { title: RootLang.lang.JeeRequest.boloc.dangapdung, id: 1 },
            { title: RootLang.lang.JeeRequest.boloc.dangdong, id: 0 },
            { title: RootLang.lang.JeeRequest.boloc.dadanhdau, id: 3 },
        ]
    }
    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        nthisLoading.show()
        this._load().then(res => {
            if (res)
                nthisLoading.hide()
        })
    }
    componentWillUnmount() {
        this.backHandler.remove()
    }

    handleBackButton = () => {
        this._goBack()
        return true
    };
    _goBack = () => {
        Utils.goback(this)
    }
    _load = async () => {
        const { status, keys } = this.state

        this.setState({ empty: true, refreshing: true })
        let res = await getLoaiHinhThuc('', '', keys, status)
        if (res.status == 1) {

            let temp = res.data
            temp = temp.length > 0 ? temp.map(obj => ({ ...obj, check: true })) : temp
            this.setState({ dsLoaiHinhThuc: temp, empty: false, refreshing: false, showload: false })
        }
        else {
            UtilsApp.MessageShow(RootLang.lang.JeeRequest.thongbao.thongbao, res?.error?.mesage || RootLang.lang.JeeRequest.thongbao.loitruyxuatdulieu, 2)
        }
        return true
    }
    onSeacrch = (keySearch) => {
        this.setState({ showload: true })
        if (keySearch.length == 0) {
            this.setState({ keys: 'status', status: 2 }, () => this._load())
        }
        else {
            this.setState({ keys: 'keyWord', status: keySearch }, () => this._load())
        }
    }
    _tat = async (status, id, index, temp) => {
        const { dsLoaiHinhThuc } = this.state
        dsLoaiHinhThuc[temp].Child[index].Status = !dsLoaiHinhThuc[temp].Child[index].Status
        this.setState({ dsLoaiHinhThuc: dsLoaiHinhThuc }) //change on interface for optimization

        let res = await postDongMoLoaiYC(status, id)
        if (res.status == 1) {
            dsLoaiHinhThuc[temp].Child[index].Status = res.data[0].Child[0].Status
            this.setState({ dsLoaiHinhThuc: dsLoaiHinhThuc }) //change on infrastructure
        }
    }
    onTick = async (values, rowid, index, temp) => {
        const { dsLoaiHinhThuc } = this.state
        dsLoaiHinhThuc[temp].Child[index].DanhDau = dsLoaiHinhThuc[temp].Child[index].DanhDau == '0' ? -1 : '0'
        this.setState({ dsLoaiHinhThuc: dsLoaiHinhThuc })

        let res = await postDanhDauLoaiYC(values, rowid)
        if (res.status == 1) {
            dsLoaiHinhThuc[temp].Child[index].DanhDau = res.data[0].Child[0].DanhDau
            this.setState({ dsLoaiHinhThuc: dsLoaiHinhThuc })
        }
    }
    _onRefresh = () => {
        this._load()
    }
    // _onLoadMore = () => {
    //     var { pageNumber, AllPage } = this.state
    //     Utils.nlog(pageNumber, AllPage)
    //     if (pageNumber < AllPage) {
    //         this.setState({ showload: true, pageNumber: pageNumber + 1 }, () => this._load());
    //     }
    // }
    _loadCTLoaiYC = (item, index, temp) => {
        return (
            <View>
                <TouchableOpacity style={{ paddingVertical: 10, borderBottomColor: '#F4F4F4', borderBottomWidth: 2, width: Width(100), backgroundColor: 'white', paddingHorizontal: Width(5), justifyContent: 'center' }}
                    onPress={() => Utils.goscreen(this, 'sc_ChiTietLoaiYC', {
                        Id_LoaiYeuCau: item.Id_LoaiYeuCau,
                        reloadLoaiYC: () => this._load()
                    })}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => this._danhDau(item.DanhDau, item.Id_LoaiYeuCau, index, temp)}>
                            <Image source={item.DanhDau == '0' ? Images.ImageJee.icNoStar : Images.ImageJee.icStar} style={[nstyles.nIcon19, { marginRight: 5 }]}></Image>
                        </TouchableOpacity>
                        <Text style={{ textAlign: 'center' }}> {item.TenLoaiYeuCau}</Text>
                        <View style={{ flex: 1 }} />
                        <Switch
                            style={{ transform: [{ scaleX: Platform.OS == 'ios' ? 0.8 : 0.5 }, { scaleY: Platform.OS == 'ios' ? 0.8 : 0.5 }] }}
                            trackColor={{ false: 'gray', true: 'teal' }}
                            thumbColor="white"
                            ios_backgroundColor="gray"
                            onValueChange={() => this._tat(!item.Status, item.Id_LoaiYeuCau, index, temp)}
                            value={item.Status}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', marginVertical: 10, alignItems: 'center' }}>
                        <Text style={{ color: 'orange', fontSize: reText(12) }}> {item.TenLoaiYeuCau} - </Text>
                        <Text style={{ fontSize: reText(12) }}>{item.ThoiGianXuLy}h</Text>
                    </View>
                    <Text style={{ color: colors.colorText, fontSize: reText(12) }}> {item.MoTa}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    _openDropdown = (index) => {
        const { dsLoaiHinhThuc } = this.state
        dsLoaiHinhThuc[index].check = !dsLoaiHinhThuc[index].check
        this.setState({ dsLoaiHinhThuc: dsLoaiHinhThuc })
    }
    _loadDSLoaiYC = ({ item, index }) => {
        var temp = index
        if (item.Child.length == 0)
            return
        return (
            <View>
                <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 5 }}>
                    <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', height: 39, alignItems: 'center', width: Width(100), paddingHorizontal: Width(2.5), marginBottom: 10, backgroundColor: 'white', marginBottom: 2 }}
                        onPress={() => { this._openDropdown(index) }}>
                        <Text style={{ color: colors.greenTab, fontWeight: 'bold', maxWidth: Width(90) }}><Image source={Images.ImageJee.icIconMuc} style={nstyles.nIcon12}></Image> {item.TenNhom}</Text>
                        <TouchableOpacity >
                            <Image source={item.check ? Images.ImageJee.icDropdown : Images.ImageJee.icNoDropDown} style={[nstyles.nIcon12, { tintColor: colors.greenTab }]}></Image>
                        </TouchableOpacity>
                    </TouchableOpacity>
                    {item.check ?
                        <FlatList
                            data={item.Child}
                            extraData={this.state}
                            renderItem={({ item, index }) => this._loadCTLoaiYC(item, index, temp)}
                            scrollEnabled={false}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(item, index) => index.toString()} />
                        : null}
                </View>
            </View>
        )
    }
    _loadCTLoaiYC = (item, index, temp) => {
        return (
            <View>
                <TouchableOpacity style={{ paddingVertical: 10, borderBottomColor: '#F4F4F4', borderBottomWidth: 2, width: Width(100), backgroundColor: 'white', paddingHorizontal: Width(5), justifyContent: 'center' }}
                    onPress={() => Utils.goscreen(this, 'sc_ChiTietLoaiYC', { Id_LoaiYeuCau: item.Id_LoaiYeuCau, reloadLoaiYC: () => this._load() })}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => this.onTick(item.DanhDau, item.Id_LoaiYeuCau, index, temp)}>
                            <Image source={item.DanhDau == '0' ? Images.ImageJee.icNoStar : Images.ImageJee.icStar} style={[nstyles.nIcon19, { marginRight: 5 }]}></Image>
                        </TouchableOpacity>
                        <Text style={{ width: Width(70) }} numberOfLines={2}> {item.TenLoaiYeuCau}</Text>
                        <View style={{ flex: 1 }} />
                        <Switch
                            style={{ transform: [{ scaleX: Platform.OS == 'ios' ? 0.8 : 1 }, { scaleY: Platform.OS == 'ios' ? 0.8 : 1 }] }}
                            trackColor={{ false: 'gray', true: 'teal' }}
                            thumbColor="white"
                            ios_backgroundColor="gray"
                            onValueChange={() => this._tat(!item.Status, item.Id_LoaiYeuCau, index, temp)}
                            value={item.Status}
                        />
                    </View>

                    <View style={{ flexDirection: 'row', marginVertical: 10, alignItems: 'center' }}>
                        <Text style={{ color: 'orange', fontSize: reText(12) }}> {item.TenQuyTrinh} - </Text>
                        <Text style={{ fontSize: reText(12) }}>{item.ThoiGianXuLy}h</Text>
                    </View>

                    <Text style={{ color: colors.colorText, fontSize: reText(12) }} numberOfLines={2}> {item.MoTa}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        const { dsLoaiHinhThuc, empty, showload, refreshing, status } = this.state
        return (
            <View style={{ flex: 1 }}>
                <HeaderComStackV3
                    mang={this.mang}
                    title={RootLang.lang.JeeRequest.sc_CaiDatYeuCau.loaiyeucau}
                    styleTitle={{ fontSize: reText(17), fontWeight: 'bold' }}
                    this={this}
                ></HeaderComStackV3>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', marginVertical: 10, alignItems: 'center' }}>
                        <TouchableOpacity style={{ backgroundColor: colors.lightPurple, width: Width(40), height: 36, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', borderRadius: 20, marginHorizontal: 10 }}
                            onPress={() => Utils.goscreen(this, 'Modal_ThemLoaiYeuCau', { _load: () => this._load() })}>
                            <Image source={Images.ImageJee.icImportKind} style={[nstyles.nIcon16, { marginRight: 5 }]}></Image>
                            <Text style={{ color: colors.purpleColor }}>{RootLang.lang.JeeRequest.sc_CaiDatYeuCau.themloai}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ backgroundColor: colors.colorsBrowser, width: Width(40), height: 36, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', borderRadius: 20, marginHorizontal: 10 }}
                            onPress={() => Utils.goscreen(this, 'Modal_ThemNhomYeuCau', { _load: () => this._load() })}>
                            <Image source={Images.ImageJee.icImportGroup} style={{ marginRight: 5, height: 14, width: 17 }}></Image>
                            <Text style={{ color: colors.colorTabActive }}>{RootLang.lang.JeeRequest.sc_CaiDatYeuCau.themnhom}</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={dsLoaiHinhThuc}
                        extraData={this.state}
                        renderItem={this._loadDSLoaiYC}
                        onRefresh={this._onRefresh}
                        refreshing={refreshing}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item, index) => index.toString()}
                        ListEmptyComponent={dsLoaiHinhThuc.length == 0 && !empty ? <ListEmpty style={{ justifyContent: 'center', alignItems: 'center', }} textempty={RootLang.lang.JeeRequest.dungchung.khongcodulieu} /> : null}
                        ListFooterComponent={showload ? <ActivityIndicator size='small' /> : null} />
                    <ActionSheet ref={'chonMenuDropdown'} style={{ flex: 1 }}>
                        <View style={{ paddingHorizontal: 10, marginBottom: Platform.OS == 'ios' ? 15 : 0 }}>
                            <HeaderModalCom onPress={() => this.refs.chonMenuDropdown.hide()} title={RootLang.lang.JeeRequest.boloc.locloaiyeucau} />
                            <View style={{ backgroundColor: 'white' }}>
                                {
                                    this.arrFilter.map((item, index) => {
                                        return (
                                            <TouchableOpacity style={styles.buttondropdown} onPress={() => { this.refs.chonMenuDropdown.hide(), this.setState({ status: item.id }, () => this._load()) }}>
                                                <Text style={{ fontWeight: item.id == status ? 'bold' : 'normal', color: item.id == status ? colors.redStar : null }}>{item.title}</Text>
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </View>
                        </View>
                    </ActionSheet>
                    <IsLoading></IsLoading>
                </View>
            </View>
        )
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
})
export default LoaiYeuCau
