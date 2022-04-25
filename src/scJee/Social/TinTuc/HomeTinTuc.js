import moment from 'moment';
import React, { Component } from 'react';
import { Animated, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { constructStyles } from 'react-native-render-html';
import { getDS_TinTuc } from '../../../apis/JeePlatform/Api_JeeSocial/apiJeeSocial';
import { RootLang } from '../../../app/data/locales';
import Utils from '../../../app/Utils';
import UtilsApp from '../../../app/UtilsApp';
import IsLoading from '../../../components/IsLoading';
import ListEmptyLottie_Social from '../../../components/NewComponents/ListEmptyLottie_Social';
import { colors } from '../../../styles';
import { reText } from '../../../styles/size';
import { Height, nstyles, Width } from '../../../styles/styles';


class HomeTinTuc extends Component {
    constructor(props) {
        super(props);
        this.nthis = this.props.nthis;
        this.refLoading = React.createRef()
        this.state = {
            opacity: new Animated.Value(0),
            stateBangtin: true,
            stateThongbao: false,
            listTinTuc: [],
            empty: false,
        }

    }

    componentDidMount = async () => {
        this.refLoading.current.show()
        await this._loadDanhSach_TinTuc().then(res => {
            if (res == true) {
                this.refLoading.current.hide()
            }
        });
    }

    _loadDanhSach_TinTuc = async (page = 1) => {
        const { listTinTuc } = this.state
        let strbody = JSON.stringify({
            "paginator": {
                "total": 0,
                "totalpage": 0,
                "page": 1,
                "pageSize": 10,
                "pageSizes": [
                    0
                ]
            },
        })
        let res = await getDS_TinTuc(strbody);
        // Utils.nlog("list tin tức-------------------------", res)
        if (res.status == 1) {
            this.refLoading.current.hide()
            this.setState({ listTinTuc: res.data, empty: true })
        } else {
            this.setState({ empty: false })
            // UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
        }
        return true
    }

    _goChiTiet = (item) => {
        Utils.goscreen(this.nthis, 'sc_ChiTietTinTuc', { nthis: this.nthis, data: item })
    }

    _renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity style={{ backgroundColor: colors.white, marginBottom: 10 }}
                onPress={() => this._goChiTiet(item.id_tintuc)}
            >
                <View style={{ flex: 1, padding: 10 }}>
                    <Image source={{ uri: item?.hinhanh }} resizeMode='contain' style={[{ height: Height(25), width: Width(95), alignItems: 'center', marginTop: 4, marginRight: 5 }]} />

                    <View style={{ flex: 1 }}>
                        <View style={{ paddingTop: 10, paddingBottom: 10 }}>
                            <Text numberOfLines={2} style={{ fontWeight: 'bold', fontSize: reText(15), }}>{item?.tieude}</Text>
                        </View>
                        <View style={{}}>
                            <Text numberOfLines={3} style={{}}>{item?.noidung}</Text>
                        </View>
                    </View>
                    <View style={{ paddingTop: 5 }}>
                        <Text style={{ color: '#B3B3B3' }}>
                            {item.CreatedDate ? moment(item.CreatedDate).format("DD/MM/YYYY - HH:mm") : null}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity >
        );
    }

    render() {
        const { stateBangtin, stateThongbao, listTinTuc, empty, refreshing } = this.state

        return (
            <View style={[nstyles.ncontainer, { backgroundColor: '#E4E6EB', paddingBottom: 5 }]}>
                <View style={{ backgroundColor: '#E4E6EB', flex: 1, marginTop: 10 }}>
                    <FlatList
                        ref={ref => { this.TinTuc = ref }}
                        extraData={this.state}
                        // onScroll={this._onScroll}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        // refreshing={refreshing}
                        data={listTinTuc}
                        renderItem={this._renderItem}
                        // contentContainerStyle={{ paddingTop: HEIGHT_BUTTON }}
                        // onEndReached={() => {
                        //     if (!this.onEndReachedCalledDuringMomentum) {
                        //         this.onLoadMore()
                        //         this.onEndReachedCalledDuringMomentum = true;
                        //     }
                        // }}
                        onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
                        onEndReachedThreshold={0.01}
                        // initialNumToRender={5}
                        maxToRenderPerBatch={10}
                        windowSize={7}
                        updateCellsBatchingPeriod={100}
                        // onRefresh={this._onRefresh}
                        keyExtractor={(item, index) => index.toString()}
                        initialNumToRender={2}
                        maxToRenderPerBatch={10}
                        ListEmptyComponent={listTinTuc.length == 0 ? <ListEmptyLottie_Social style={{ justifyContent: 'center', alignItems: 'center', marginTop: 60 }} textempty={empty == false ? RootLang.lang.JeeSocial.khongcobaidang : null} styleText={{ marginTop: -50 }} /> : null}
                    // ListFooterComponent={showload ? <ActivityIndicator size='small' /> : null}
                    />
                </View>
                <IsLoading ref={this.refLoading} />
            </View >
        )
    }
}


const mapStateToProps = state => ({
    lang: state.changeLanguage.language,
});
export default Utils.connectRedux(HomeTinTuc, mapStateToProps, true)