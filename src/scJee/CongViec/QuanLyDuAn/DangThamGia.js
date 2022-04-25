import _ from 'lodash';
import LottieView from 'lottie-react-native';
import moment from 'moment';
import React, { Component } from 'react';
import {
    ActivityIndicator, FlatList, Image, Platform, Text, TextInput, TouchableOpacity, View
} from "react-native";
import Dash from 'react-native-dash';
import { GetActivityPhongBan, getDuAnPhongBanDangThamGia } from '../../../apis/JeePlatform/API_JeeWork/apiDuAn';
import { RootLang } from '../../../app/data/locales';
import Utils from '../../../app/Utils';
import UtilsApp from '../../../app/UtilsApp';
import IsLoading from '../../../components/IsLoading';
import FastImagePlaceholder from '../../../components/NewComponents/FastImageDefault';
import ListEmptyLottie from '../../../components/NewComponents/ListEmptyLottie';
import PercentageCircle from '../../../components/NewComponents/PercentageCircle';
import { Images } from '../../../images';
import { colors } from '../../../styles';
import { reText, sizes } from '../../../styles/size';
import { Width } from '../../../styles/styles';
moment.locale('vi');

class DangThamGia extends Component {
    constructor(props) {
        super(props);
        this.nthis = this.props.nthis
        this.refLoading = React.createRef()
        this.state = {
            dataLoad: true,
            searchString: '',
            allPage: 1,
            page: 1,
            loadmore: false,
            showload: false,
            refreshing: false,
            dataDuAnPhongBan: [],
            empty: true,
            hienthi: 0,
            type: '',
        };
        this.allPage = 1;
    }

    async componentDidMount() {
        this.refLoading.current.show()
        await this._DuAnPhongBan().then(res => {
            if (res == true) {
                this.refLoading.current.hide()
                if (this.state.dataDuAnPhongBan?.length > 0) {
                    this.setState({ dataLoad: true })
                }
                else this.setState({ dataLoad: false })
            }
        });


    }

    _DuAnPhongBan = async (page = 1) => {
        // this.refLoading.current.show()
        var { dataDuAnPhongBan, searchString, hienthi, type } = this.state
        const res = await getDuAnPhongBanDangThamGia(page, searchString, type, hienthi)
        this.setState({ empty: true })

        if (res.status == 1) {
            this.refLoading.current.hide()
            let tempData = dataDuAnPhongBan;
            this.allPage = res.page.AllPage;
            if (page == 1) {
                page = 2
                tempData = res.data;
            }
            else {
                tempData = [...tempData, ...res.data];
                page = res.page.Page + 1
            }
            this.setState({ dataDuAnPhongBan: tempData.map((obj, index) => ({ ...obj, dropDown: false, index: index, ActivityTemp: [] })), empty: false, page: page, refreshing: false, showload: false, })

        }
        else {
            this.refLoading.current.hide()
            this.setState({ refreshing: false, showload: false, empty: true })
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
        }
        return true

    }


    _Activity = async (item, indexTemp) => {
        var { dataDuAnPhongBan } = this.state
        const res = await GetActivityPhongBan(item.id_row)
        if (res.status == 1) {
            var ListDataDeletedIndex = dataDuAnPhongBan.filter(function (e, index) {
                return index !== indexTemp
            })
            var dataDeleted = dataDuAnPhongBan.filter(function (elem, index) {
                return indexTemp === index;
            });
            var ListActivity = []
            for (let i = 0; i < res.data.length; i++) {

                for (let z = 0; z < res.data[i].Activities.length; z++) {
                    ListActivity = ListActivity.concat({ ...res.data[i].Activities[z], TenCongViec: res.data[i].title })
                }
            }

            var Compare = ListActivity.sort(function (a, b) {
                return new Date(b.UpdatedDate ? b.UpdatedDate : b.CreatedDate) - new Date(a.UpdatedDate ? a.UpdatedDate : a.CreatedDate);
            }).reverse()
            if (Compare.length > 2) {
                Compare = Compare.splice(0, 2)
            }
            else Compare = Compare
            var newObject = (Object.assign({ ...dataDeleted[0], ActivityTemp: Compare }))
            var newListWithObject = ListDataDeletedIndex.concat(newObject)
            var dataDuAnPhongBanSort = newListWithObject.sort(function (a, b) {
                return a.index - b.index
            })
            this.setState({ dataDuAnPhongBan: dataDuAnPhongBanSort })
        }
        else {
            this.setState({})
        }
    }

    _onRefresh = () => {
        this._DuAnPhongBan(1);
        this.allPage = 1;
    }
    onLoadMore = async () => {
        if (this.state.page <= this.allPage) {
            this.setState({ showload: true }, () => this._DuAnPhongBan(this.state.page));
        }
        else { }
    }


    _colorPercent = (item) => {
        if (item < 50) return "orange";
        else if (item < 100) return "#266BCB";
        else return "#30A64A";
    }

    callBack = (item) => {
        this.refLoading.current.show()
        this.setState({
            hienthi: item.hienthiChoice,
            type: item.typeChoice,
            searchString: item.searchString
        }, () => {
            this._DuAnPhongBan(1).then(res => {
                this.refLoading.current.hide()
            })
        })
    }

    _DropDown = async (itemChoice) => {
        var { dataDuAnPhongBan } = this.state

        dataDuAnPhongBan.map((item) => {
            if (item === itemChoice) {
                item.dropDown = !item.dropDown
            }
        })
        this.setState({ dataDuAnPhongBan: dataDuAnPhongBan })

    }

    _renderItem = ({ item, index }) => {
        var { dataLoad, dataDuAnPhongBan } = this.state
        return (
            <TouchableOpacity
                key={index}
                onPress={() => {
                    Utils.goscreen(this.nthis, "sc_ChiTietDuAn", {
                        item: item,
                        id_row: item.id_row,
                    })
                }}>
                <View style={{ padding: 2, marginBottom: 5, flexDirection: 'row', }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10 }}>
                        <PercentageCircle borderWidth={1} radius={25} percent={item.Count.percentage} color={this._colorPercent(item.Count.percentage)} />
                    </View>
                    <View style={{ flexDirection: "row", flex: 1 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                            <View style={{ justifyContent: 'center', paddingVertical: 5, paddingLeft: 1, width: '80%' }}>
                                <Text style={{ fontSize: sizes.sText15, fontWeight: '500', marginBottom: 5 }}>{item.title ? item.title : '...'}</Text>
                                <View style={{ flexDirection: 'row', }}>
                                    <Text numberOfLines={1} style={{ maxWidth: "50%", fontSize: sizes.sText12, color: colors.colorGrayText, marginRight: 5 }}>{item.description ? item.description : "..."}</Text>
                                    <Text numberOfLines={1} style={{ maxWidth: "70%", fontSize: sizes.sText12, color: colors.colorGrayText, marginRight: 5 }}>{"- Cập nhật " + item.UpdatedDate}</Text>
                                </View>
                            </View>
                            <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 5, paddingHorizontal: 5, width: "40%", }}>
                                <View style={{ backgroundColor: item.StatusCongViec ? item.StatusCongViec.color : null, borderRadius: 20, width: '100%', padding: 5, justifyContent: 'center', alignItems: 'center', marginBottom: 5 }}>
                                    <Text style={{ textAlign: "center", color: 'white', fontSize: sizes.sText12 }}>{item.StatusCongViec ? item.StatusCongViec.statusname : "...."}</Text>
                                </View>
                                <Text style={{ color: colors.black_70, fontSize: sizes.sText12 }}>{item.createddate ? moment(item.createddate, 'YYYY/MM/DD').format('DD/MM/YYYY') : ''}</Text>
                            </View>
                        </View>
                        <TouchableOpacity

                            onPress={() => {
                                this._DropDown(item),
                                    item.dropDown == true ?
                                        this._Activity(item, index)
                                        : null

                            }}
                            style={{ alignSelf: "center", marginRight: 20, width: 25, height: 25, justifyContent: 'center', alignItems: 'center' }}>
                            <Image style={{ width: 10, height: 10 }} resizeMode={"contain"} source={item.dropDown == false ? Images.ImageJee.icIconDropDownNamNgang : Images.ImageJee.icDropdownColor} />
                        </TouchableOpacity>
                    </View>
                </View>

                {item.dropDown == true ?
                    <View style={{ marginHorizontal: 20, backgroundColor: "#F2F3F5" }}>

                        <FlatList
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            data={dataDuAnPhongBan[index]?.ActivityTemp}
                            renderItem={this._renderChild}
                            keyExtractor={(item, index) => index.toString()}
                            extraData={this.state}
                            initialNumToRender={5}
                            maxToRenderPerBatch={10}
                            windowSize={7}
                            updateCellsBatchingPeriod={100}
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
                        dashThickness={0.8} />
                </View>
            </TouchableOpacity>

        );
    }
    _renderChild = ({ item, index }) => {

        var { } = this.state
        return (
            <View key={index} >
                <View style={{ padding: 2, marginBottom: 5, flexDirection: 'row', }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10 }}>
                        <FastImagePlaceholder
                            style={{ width: 40, height: 40, borderRadius: 40, }}
                            source={{ uri: item.NguoiTao.image ? item.NguoiTao.image : item.avatar }}
                            resizeMode={"cover"}
                            placeholder={Images.icAva}
                        />
                    </View>
                    <View style={{ justifyContent: 'space-between', paddingVertical: 5, paddingLeft: 1, flex: 1, flexDirection: "row" }}>
                        <Text numberOfLines={99} style={{ fontSize: sizes.sText12, fontWeight: '500', marginBottom: 5, flex: 1, maxWidth: "80%" }}>{item.TenCongViec ? item.TenCongViec : '...'}</Text>
                        <Text numberOfLines={1} style={{ fontSize: sizes.sText12, fontWeight: '400', marginBottom: 5, marginRight: 20 }}>{item.UpdatedDate ? moment(item.UpdatedDate, 'DD/MM/YYYY HH:mm').startOf('minus').fromNow() : moment(item.CreatedDate, 'DD/MM/YYYY HH:mm').startOf('minus').fromNow()}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: "row", width: Width(96) }}>
                    <View style={{ width: Width(90) }}>
                        <Text style={{ fontSize: reText(14) }}>
                            <Text style={{ fontSize: reText(14), color: colors.black_50 }}>
                                {item?.action.replace(' {0} ', ' ') + ' '}
                            </Text>
                            {item.oldvalue && item.newvalue && item.id_action != 16 && item.id_action != 14 ?
                                <>
                                    <Text style={{ color: colors.black_90, fontSize: reText(14) }}>
                                        {RootLang.lang.JeeWork.tu + " "}
                                    </Text>
                                    {item.colorold ? <Text style={{ color: item.colorold }}>
                                        {" "}■{" "}
                                    </Text> : null}
                                    <Text style={{ color: item.colorold ? item.colorold : "#DB5D37", fontWeight: "bold" }}>
                                        {item?.oldvalue} {' '}
                                    </Text>
                                    <Text style={{ color: colors.black_90, fontSize: reText(14) }}>
                                        {RootLang.lang.JeeWork.thanh + " "}
                                        {item.colornew ? <Text style={{ color: item.colornew }}>
                                            {" "}■{" "}
                                        </Text> : null}
                                        <Text style={{ color: item.colornew ? item.colornew : '#10CCAA', fontWeight: "bold", fontSize: reText(14) }}>
                                            {item?.newvalue}
                                        </Text>
                                    </Text>
                                </> : null}
                        </Text>
                    </View>
                </View>
            </View >
        )
    }



    render() {
        var { refreshing, dataDuAnPhongBan, showload, empty } = this.state
        return (
            <View style={{ flex: 1 }}>
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
                                        value={this.state.searchString}
                                        returnKeyType='search'
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
                                        onSubmitEditing={() => this._DuAnPhongBan(1)}
                                        underlineColorAndroid="transparent"
                                    />
                                </View>

                            </View>
                            <TouchableOpacity style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                                onPress={() => {
                                    Utils.goscreen(this.nthis, "BoLocDuAn", {

                                        callback: this.callBack,
                                        tab: 1

                                    })
                                }}
                            >
                                <Image source={Images.ImageJee.icLoc} style={{ padding: 10, }} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 1, marginBottom: Platform.OS == 'ios' ? 20 : 5 }}>
                            <FlatList
                                extraData={this.state}
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                                refreshing={refreshing}
                                style={{ marginTop: 5, flexGrow: 1 }}
                                data={dataDuAnPhongBan}
                                renderItem={this._renderItem}
                                onEndReached={() => {
                                    if (!this.onEndReachedCalledDuringMomentum) {
                                        this.onLoadMore()
                                        this.onEndReachedCalledDuringMomentum = true;
                                    }
                                }}
                                onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
                                onEndReachedThreshold={0.01}
                                removeClippedSubviews={true}
                                initialNumToRender={2}
                                maxToRenderPerBatch={5}
                                updateCellsBatchingPeriod={100}
                                windowSize={7}
                                onRefresh={this._onRefresh}
                                keyExtractor={(item, index) => index.toString()}
                                ListEmptyComponent={dataDuAnPhongBan.length == 0 && !empty ? <ListEmptyLottie style={{ justifyContent: 'center', alignItems: 'center', }} textempty={RootLang.lang.JeeWork.khongcodulieu} /> : null}
                                ListFooterComponent={showload ? <ActivityIndicator size='small' /> : null}
                            />
                        </View>
                    </View>
                </View >
                <IsLoading ref={this.refLoading} />
            </View>
        );
    }
};

const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});

export default Utils.connectRedux(DangThamGia, mapStateToProps, true)


