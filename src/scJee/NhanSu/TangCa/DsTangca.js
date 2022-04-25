import React, { Component } from 'react';
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { getDSTangca, getHuyTangCa } from '../../../apis/apiTangca';
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import { RootLang } from '../../../app/data/locales';
import Utils from '../../../app/Utils';
import UtilsApp from '../../../app/UtilsApp';
import HeaderComStack from '../../../components/HeaderComStack';
import { Images } from '../../../images/index';
import { colors } from '../../../styles/color';
import { fonts } from '../../../styles/font';
import { sizes } from '../../../styles/size';
import { nstyles } from '../../../styles/styles';

class DsTangCa extends Component {
    constructor(props) {
        super(props);
        this.nthis = this.props.nthis ? this.props.nthis : this;
        this.state = {
            DSTangca: [],
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
    }
    componentDidMount() {
        this._getDSTangca();
        ROOTGlobal.dataAppGlobal.reloadDSTangCa = this._getDSTangca;

    }
    loadMoreData = async () => {
        var { _page, _allPage } = this.state;
        if (_page < _allPage) {
            this.setState({ showload: true }, () => this._getDSTangca(_page + 1));
        }
    }
    _DeteleDonTangCa = async (ID_Row) => {
        Utils.showMsgBoxYesNo(this.nthis, RootLang.lang.thongbaochung.thongbao, RootLang.lang.thongbaochung.banmuonxoadonnay,
            RootLang.lang.thongbaochung.xoa, RootLang.lang.thongbaochung.thoat, async () => {
                const res = await getHuyTangCa(ID_Row)
                Utils.nlog('_DeteleDonTangCa', res)
                if (res.status == 1) {
                    UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.thongbaochung.thuchienthanhcong, 1)
                    this._onRefresh()
                } else
                    UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.thuchienthatbai, 2)

            }, () => { }, true)
    }
    _getDSTangca = async (nextPage = 1) => {

        var {
            DSTangca, _page,
            _allPage, record,
        } = this.state;
        if (nextPage == 1) {
            DSTangca = [];
        }
        let res = await getDSTangca(nextPage, record)
        // Utils.nlog("DS của Hoàng:", res)
        if (res.status == 1) {
            var { data = [], page = {} } = res;
            if (Array.isArray(data) && data.length > 0) {
                DSTangca = DSTangca.concat(data);
            } else {
                DSTangca = []
            }
            var { Page = 1, AllPage = 1 } = page;
            _page = Page;
            _allPage = AllPage;
        } else
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
        this.setState({ DSTangca, _page, _allPage, refreshing: false, showload: false })
    }

    _onRefresh = () => {
        this.setState({ refreshing: true }, this._getDSTangca);
    }

    _renderItemThang = ({ item, index }) => {
        var { DSTangca } = this.state
        return (
            <View key={index}>
                {
                    index == 0 || DSTangca[index - 1].Title != item.Title ?
                        <Text style={{
                            fontSize: sizes.sText14, color: colors.textblack,
                            paddingVertical: 5, marginTop: 10
                        }}>{RootLang.lang.common.thang + " " + item.Title}</Text> : null
                }
                {
                    item.Data.map(this._renderItem)
                }
            </View>
        )
    }
    _renderItem = (item, index) => {
        var { DSTangca } = this.state
        var { Approved } = item
        let giatri = `${item.TuGio ? item.TuGio : ''}-${item.DenGio ? item.DenGio : ''} (${item.SoGio ? Math.round(item.SoGio * 100) / 100 : ''}h)`
        return (
            <View key={index.toString()}

                style={{
                    flex: 1, flexDirection: 'row', marginTop: 2, paddingHorizontal: 10, paddingVertical: 15,
                    justifyContent: "space-between", backgroundColor: colors.white, height: 'auto'
                }}
            >
                <View style={{ flexDirection: 'row', }}>
                    <Image
                        source={Images.icCalendar}
                        style={{ marginTop: 10, marginLeft: 10, tintColor: colors.orangeSix, width: 20, height: 20 }}
                    />
                    <View style={{ marginLeft: 20 }}>
                        <Text style={{ fontSize: sizes.sText16, marginTop: 10, marginBottom: 5 }}>{item.NgayTangCa}</Text>
                        <Text style={{
                            fontSize: sizes.sText12, lineHeight: 16, paddingBottom: 5,
                            fontFamily: fonts.Helvetica, color: colors.black_20
                        }}
                            numberOfLines={3}
                        >{giatri}</Text>
                    </View>
                </View>
                <View>
                    <View style={{ flex: 1 }}>
                        <Text
                            style={{
                                fontSize: sizes.sText16, fontWeight: "bold",
                                fontFamily: fonts.Helvetica, marginTop: 10, paddingRight: 10,
                                color: color(item)
                            }}
                            numberOfLines={3}>
                            {item.TinhTrang}
                        </Text>
                    </View>
                    {
                        item.Approved == null ? <TouchableOpacity onPress={() => { this._DeteleDonTangCa(item.ID_Row) }} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{
                                fontSize: sizes.sText16,
                                fontFamily: fonts.Helvetica, paddingRight: 10, color: colors.redStar
                            }}>{RootLang.lang.thongbaochung.xoa}</Text>
                        </TouchableOpacity> : null
                    }
                </View>
            </View>
        );
    }
    _ItemSeparatorComponent = () => {
        return (
            <View style={{ height: 3, backgroundColor: '#fff', }} />
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
        const { DSTangca } = this.state
        return (
            <View style={{ flex: 1, backgroundColor: colors.colorBGHome, paddingBottom: 15, paddingHorizontal: 15 }}>
                {!this.props.nthis ?
                    <HeaderComStack onPressLeft={() => { Utils.goback(this, null) }}
                        nthis={this} title={RootLang.lang.sctangca.title} />
                    : null}
                <FlatList
                    data={DSTangca}
                    ListEmptyComponent={this.renderListEmpty}
                    initialNumToRender={2}
                    refreshing={this.state.refreshing}
                    style={{ width: '100%', }}
                    ItemSeparatorComponent={this._ItemSeparatorComponent}
                    onRefresh={this._onRefresh}
                    renderItem={this._renderItemThang}
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

const color = (item) => {
    if (item.Approved == null) {
        return colors.colorBtnChuaDuyet
    }
    else if (item.Approved == false) {
        return colors.redStar
    }
    else if (item.Approved == true) {
        return colors.textTabActive
    }
}
export default Utils.connectRedux(DsTangCa, mapStateToProps, true)
