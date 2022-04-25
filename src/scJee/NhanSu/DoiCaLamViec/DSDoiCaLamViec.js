import moment from 'moment';
import React, { Component } from 'react';
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { Get_ChangeShiftList } from '../../../apis/apiChangeshiftnv';
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import { RootLang } from '../../../app/data/locales';
import Utils from '../../../app/Utils';
import UtilsApp from '../../../app/UtilsApp';
import { Images } from '../../../images';
import { colors, fonts } from '../../../styles';
import { reText, sizes } from '../../../styles/size';
import { nstyles } from '../../../styles/styles';

class DSDoiCaLamViec extends Component {
    constructor(props) {
        super(props);
        this.nthis = this.props.nthis;
        this.state = {
            DSDoica: [],
            _page: 1,
            record: 10,
            refreshing: false,
            showload: false,
            isShowTimeFrom: true,
            isFemale: false,
            ngDuyet: [],
            _dateDk: new Date,
            listgio: [],
            isTimeFr: '08:00',
            isTimeTo: '17:00',
            giotc: '',
            textGChu: '',
            isChangedata: false,
        };
        ROOTGlobal.QLDoiCa.refreshDSDoiCa = this._onRefresh
    }
    componentDidMount() {
        this._Get_ChangeShiftList();
    }
    loadMoreData = async () => {
        var { _page, _allPage } = this.state;
        if (_page < _allPage) {
            this.setState({ showload: true }, () => this._Get_ChangeShiftList(_page + 1));
        }
    }

    _Get_ChangeShiftList = async (nextPage = 1) => {
        var {
            DSDoica, _page,
            _allPage, record,
        } = this.state;
        if (nextPage == 1) {
            DSDoica = [];
        }
        let res = await Get_ChangeShiftList(nextPage, record)
        Utils.nlog('Get_ChangeShiftList', res)
        if (res.status == 1) {
            var { data = [], page = {} } = res;
            if (Array.isArray(data) && data.length > 0) {
                DSDoica = DSDoica.concat(data);
            } else {
                DSDoica = []
            }
            var { Page = 1, AllPage = 1 } = page;
            _page = Page;
            _allPage = AllPage;
        } else
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error.message, 2)
        this.setState({ DSDoica, _page, _allPage, refreshing: false, showload: false })
    }

    _onRefresh = () => {
        this.setState({ refreshing: true }, this._Get_ChangeShiftList);
    }


    _renderItem = ({ item, index }) => {
        var { DSTangca } = this.state
        var { Valid } = item

        return (

            <TouchableOpacity
                onPress={() => Utils.goscreen(this.props.nthis, "Modal_ChiTietDoiCaLamViec", {
                    RowID: item.RowID,
                    refresh: this._onRefresh,
                    nthis: this,
                    isGoBak: true
                })}
                style={nstyles.shadow, {
                    flex: 1,
                    backgroundColor: colors.white, height: 'auto', paddingHorizontal: 10
                }}>
                <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
                    <View style={{ flexDirection: "row" }}>
                        <Image
                            source={Images.icCalendar}
                            style={{ marginTop: 25, marginLeft: 10, tintColor: colors.orangeSix, width: 20, height: 20 }}
                        />
                        <Text style={{ fontSize: sizes.sText16, marginTop: 25, marginBottom: 5, marginLeft: 20 }}>{RootLang.lang.scdoicalamviec.title}</Text>
                    </View>

                    <Text
                        style={{
                            fontSize: sizes.sText16, fontWeight: "bold",
                            fontFamily: fonts.Helvetica, marginTop: 25,
                            color: Valid == true ? colors.greenishTeal : (Valid == false ? colors.colorRed : colors.apricot),
                        }}
                    >
                        {item.TinhTrang}
                    </Text>
                </View>
                <View style={{ marginLeft: 50, flex: 1 }}>
                    <Text style={{
                        fontSize: sizes.sText12, lineHeight: reText(16), paddingBottom: 5,
                        fontFamily: fonts.Helvetica, color: colors.black_20
                    }}
                        numberOfLines={3}
                    >{item.NgayGui ? moment(item.NgayGui).format('DD/MM/YYYY HH:mm') : '...'}</Text>
                    {
                        item.Data ? <View>
                            {
                                item.Data.map((item2, index2) => {
                                    var vals = `${moment(item2.NgayLamViec).format('DD/MM/YYYY')} -  ${moment(item2.ToDate).format('DD/MM/YYYY')}`
                                    if (index2 <= 1) {
                                        return <Text key={item2.NgayLamViec.toString()} style={{
                                            fontSize: sizes.sText12, lineHeight: reText(16), paddingBottom: 5,
                                            fontFamily: fonts.Helvetica
                                        }}
                                            numberOfLines={1}
                                        >{vals}</Text>
                                    } else {
                                        return null;
                                    }

                                })

                            }
                            {
                                item.Data.length > 1 ? <Text style={{
                                    fontSize: sizes.sText12, lineHeight: reText(16), paddingBottom: 5,
                                    fontFamily: fonts.Helvetica
                                }}
                                    numberOfLines={1}
                                >{`...`}</Text> : null
                            }
                        </View> : null

                    }
                </View>
                <View style={{ height: 1, backgroundColor: colors.black_10, marginTop: 20 }} />
            </TouchableOpacity>

            // </TouchableOpacity>

        );
    }

    _ItemSeparatorComponent = () => {
        return (
            <View style={{ height: 3, backgroundColor: colors.white, }} />
        )
    }

    renderListEmpty = () => {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Image source={Images.icListEmpty} style={{ width: sizes.nImgSize200, height: sizes.nImgSize200 }} resizeMode={'cover'} />
                <Text style={{ fontSize: sizes.sText16, color: colors.brownGreyTwo }}>{RootLang.lang.thongbaochung.khongcodulieu}</Text>
            </View>
        )
    }

    render() {
        const { DSDoica } = this.state
        return (
            <View style={{ flex: 1, backgroundColor: colors.black_10, paddingBottom: 15, padding: 15 }}>
                <FlatList
                    data={DSDoica}

                    ListEmptyComponent={this.renderListEmpty}
                    initialNumToRender={2}
                    refreshing={this.state.refreshing}
                    style={{ width: '100%', }}
                    ListHeaderComponent={this._renderHeader}
                    ItemSeparatorComponent={this._ItemSeparatorComponent}
                    onRefresh={this._onRefresh}
                    renderItem={this._renderItem}
                    showsVerticalScrollIndicator={false}
                    onEndReached={this.loadMoreData}
                    onEndReachedThreshold={0.2}
                    ListFooterComponent={this.state.showload ?
                        <ActivityIndicator size='small' /> : null}
                    keyExtractor={(item, index) => index.toString()} />
            </View>
        );
    }
}
const mapStateToProps = state => ({
    lang: state.changeLanguage.language,
    loadtangca: state.LoadTC.loadtangca
});
export default Utils.connectRedux(DSDoiCaLamViec, mapStateToProps, true)
