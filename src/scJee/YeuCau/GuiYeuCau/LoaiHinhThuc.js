import React, { Component } from 'react'
import { Text, View, SafeAreaView, FlatList, Image, BackHandler, StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Utils from '../../../app/Utils'
import HeaderComStackV3 from '../../../components/HeaderComStackV3'
import { Images } from '../../../images'
import { colors } from '../../../styles'
import { Width } from '../../../styles/styles'
import IsLoading from '../../../components/IsLoading'
import ListEmpty from '../../../components/ListEmpty'
import { ActivityIndicator } from 'react-native-paper'
import { getLoaiHinhThucCaNhan } from '../../../apis/JeePlatform/API_JeeRequest/apiGuiYeuCau'
import UtilsApp from '../../../app/UtilsApp'
import { RootLang } from '../../../app/data/locales'

export class LoaiHinhThuc extends Component {
    constructor(props) {
        super(props)
        this.reload = Utils.ngetParam(this, 'reload')
        this.state = {
            dsLoaiHinhThuc: [],

            refreshing: false,
            empty: false,
            showload: false,

            pageNumber: 1,
            pageSize: 9999,
            AllPage: 1,

            status: '',
            keys: ''
        }
        this.mang = [
            { position: true, type: true, url: Images.ImageJee.icGoBack, title: '', style: {}, onPress: () => { this._goback() } }, // type(true: icon, false:text) // postion(true: trái, false phải)
            { position: false, type: true, url: Images.ImageJee.icSearch, title: '', style: {}, onPress: (keySearch) => this.onSearch(keySearch), icSearch: true },
        ]
    }
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        nthisLoading.show()
        this._loadDS().then(res => {
            if (res == true) {
                nthisLoading.hide()
            }
        })
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton = () => {
        this._goback()
        return true
    };

    _goback() {
        Utils.goback(this)
    }
    _loadDS = async (page = this.state.pageNumber) => {
        const { pageSize, keys, status } = this.state

        this.setState({ empty: false })
        let res = await getLoaiHinhThucCaNhan(page, pageSize, keys, status);

        if (res.status == 1) {
            let temp = ''
            if (page != 1)
                temp = this.state.dsLoaiHinhThuc.concat(res.data)
            else
                temp = res.data
            temp = temp.length > 0 ? temp.map(obj => ({ ...obj, check: true })) : temp
            this.setState({ dsLoaiHinhThuc: temp, refreshing: false, empty: true, AllPage: res.page.AllPage, showload: false })
        }
        else
            UtilsApp.MessageShow('Thông báo', res.error ? res.error.message : RootLang.lang.JeeRequest.thongbao.loitruyxuatdulieu, 2)
        return true
    }
    _onRefresh = () => {
        this.setState({ refreshing: true, pageNumber: 1 }, () => this._loadDS())
    }
    onSearch = (keySearch) => {
        if (keySearch.length == 0) {
            this.setState({ keys: '', status: '', pageNumber: 1 }, () => this._loadDS())
        }
        else {
            this.setState({ keys: '&filter.keys=keyWord', status: '&filter.vals=' + keySearch, pageNumber: 1 }, () => this._loadDS())
        }
    }
    _checkDropdown(index) {
        const { dsLoaiHinhThuc } = this.state
        dsLoaiHinhThuc[index].check = !dsLoaiHinhThuc[index].check
        this.setState({ dsLoaiHinhThuc: dsLoaiHinhThuc })
    }
    _onLoadMore = () => {
        var { pageNumber, AllPage } = this.state
        if (pageNumber < AllPage) {
            this.setState({ showload: true, pageNumber: pageNumber + 1 }, () => this._loadDS());
        }
    }
    _loadDSNhom = ({ item, index }) => {
        return (
            <TouchableOpacity
                key={item.Id_LoaiYeuCau}
                style={styles.btnItem}
                onPress={() => Utils.goscreen(this, 'sc_GuiYC', {
                    id_loaiyeucau: item.Id_LoaiYeuCau,
                    reload: () => this.reload()
                })}>
                <Text>{item.TenLoaiYeuCau}</Text>
            </TouchableOpacity>
        )
    }
    _loadDSLoaiHinhThuc = ({ item, index }) => {
        return (
            <View key={item.Id_Nhom_LoaiYeuCau}>
                {item.Child.length > 0 ?
                    <View style={{ marginBottom: 5 }}>
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Width(2.5), backgroundColor: 'white', paddingVertical: 10, marginBottom: 1 }}
                            onPress={() => this._checkDropdown(index)}>
                            <Text style={{ color: colors.textTabActive, fontWeight: 'bold', fontSize: 16, maxWidth: Width(90) }}>{item.TenNhom}</Text>
                            <Image source={item.check ? Images.ImageJee.icDropdown : Images.ImageJee.icNoDropDown} style={{ tintColor: colors.textTabActive }}></Image>
                        </TouchableOpacity>
                        {item.Child.length > 0 && item.check ?
                            <FlatList
                                data={item.Child}
                                extraData={this.state}
                                renderItem={this._loadDSNhom}
                                showsVerticalScrollIndicator={false}
                                keyExtractor={(item, index) => item.toString()}
                            /> : null}
                    </View>
                    : null}
            </View>
        )
    }
    render() {
        const { dsLoaiHinhThuc, refreshing, empty, showload } = this.state
        return (
            <View style={{ flex: 1 }}>
                <HeaderComStackV3
                    title={RootLang.lang.JeeRequest.sc_LoaiHinhThuc.loaihinhthuc}
                    styleTitle={{ fontWeight: 'bold' }}
                    nthis={this}
                    mang={this.mang}>
                </HeaderComStackV3>
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={dsLoaiHinhThuc}
                        extraData={this.state}
                        renderItem={this._loadDSLoaiHinhThuc}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item, index) => index.toString()}
                        onRefresh={this._onRefresh}
                        refreshing={refreshing}
                        onEndReached={() => this._onLoadMore()}
                        onEndReachedThreshold={0.4}
                        ListEmptyComponent={dsLoaiHinhThuc.length == 0 && empty ? <ListEmpty style={{ justifyContent: 'center', alignItems: 'center', }} textempty={RootLang.lang.JeeRequest.dungchung.khongcodulieu} /> : null}
                        ListFooterComponent={showload ? <ActivityIndicator size='small' /> : null} />
                    <IsLoading></IsLoading>
                </View>
            </View>

        )
    }
}
const styles = StyleSheet.create({
    btnItem: {
        paddingHorizontal: Width(5), backgroundColor: 'white', paddingVertical: 10, marginBottom: 1, justifyContent: 'center'
    }
})
export default LoaiHinhThuc
