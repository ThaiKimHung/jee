import { default as Moment, default as moment } from 'moment';
import React, { Component } from 'react';
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { getDSTypeLeave } from '../../../apis/apiDanhSachNghiPhep';
import { getDSPhepTon } from '../../../apis/apiPhepTon';
import { RootLang } from '../../../app/data/locales';
import Utils from '../../../app/Utils';
import HeaderComStack from '../../../components/HeaderComStack';
import { Images } from '../../../images/index';
import { colors } from '../../../styles/color';
import { fonts } from '../../../styles/font';
import { sizes } from '../../../styles/size';
import { nstyles } from '../../../styles/styles';
import { TouchTime } from '../../../Component_old/itemcom/itemcom';
import UtilsApp from '../../../app/UtilsApp';
import HeaderAnimationJee from '../../../components/HeaderAnimationJee';
class DSPhepTon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabNP: 0,
            _dateFr: Moment().add(-3, 'M'),
            _dateTo: Moment().add(3, 'M'),
            DSphep: [],
            _page: 1,
            _allPage: 1,
            record: 10,
            refreshing: true,
            showload: false,
            data: [],
            TenNV: '',
            listNam: [],
            Selectnam: moment(new Date()),
            date: Moment().year().toString(),
            time: '',
            listType: [],
            SelectType: {}

        }
        this.showChiTietPhepTon = this.showChiTietPhepTon.bind(this);
    }
    componentDidMount() {
        this._getListType();
    }
    _getListType = async () => {

        const res = await getDSTypeLeave();
        // Utils.nlog('res getDSTypeLeave', res)
        var { data = [] } = res
        if (res.status == 1 && data.length > 0) {
            this.setState({ listType: data, SelectType: data[0] }, this.getDSphep)
        } else {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.thongbaochung.loilaydulieu, 2)
        }
        return
    }

    showChiTietPhepTon = (item) => {
        item.Year = this.state.Selectnam;
        item.ID_HinhThuc = this.state.SelectType.ID_type
        Utils.goscreen(this, 'Modal_CTDS_PhepTon', { itemchon: item })

    }
    getDSphep = async (nextPage = 1) => {
        var {
            DSphep, _page,
            _allPage, record, Selectnam, SelectType
        } = this.state;
        if (nextPage == 1) {
            DSphep = [];
        }
        let value = `${moment(Selectnam).format('YYYY')}|${SelectType.ID_type}`
        let res = await getDSPhepTon(value, nextPage, record);
        // Utils.nlog('res getDSPhepTon', res)
        if (res.status == 1) {
            var { data = [], page = {} } = res;
            if (Array.isArray(data) && data.length > 0) {
                DSphep = DSphep.concat(data);
            } else {
                DSphep = []
            }
            var { Page = 1, AllPage = 1 } = page;
            _page = Page;
            _allPage = AllPage;

        }
        this.setState({ DSphep, _page, _allPage, refreshing: false, showload: false })
    }
    _onRefresh = () => {
        this.setState({ refreshing: true }, () => this.getDSphep());

    }
    loadMoreData = async () => {
        var { _page, _allPage } = this.state;
        if (_page < _allPage) {
            this.setState({ showload: true }, () => this.getDSphep(_page + 1));
        }
    }
    _renderItem = ({ item, index }) => {
        var { DSphep, Selectnam } = this.state
        item.year = Selectnam
        return (
            <TouchableOpacity
                onPress={() => { this.showChiTietPhepTon(item) }}
                style={{
                    paddingHorizontal: 15, marginVertical: 2.5,
                    paddingVertical: 22, backgroundColor: colors.white
                }}>
                <View style={{ flexDirection: 'row' }}>
                    <View >
                        <Image source={Images.icCalendar} style={{ padding: 10 }} />
                    </View>
                    <View style={{ flex: 1, paddingHorizontal: 10 }}>
                        <Text style={{ fontSize: sizes.sText16, fontFamily: fonts.Helvetica }}>{item.HoTen}</Text>
                        <Text style={{ fontSize: sizes.sText12, color: colors.brownGreyTwo }}>{item.ChucVu}</Text>
                    </View>
                    <View>
                        <Text style={{
                            fontSize: sizes.sText16,
                            fontFamily: fonts.HelveticaBold, color: colors.colorTabActive
                        }}>{item.Tong}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    _callback = (SelectType) => {

        this.setState({ SelectType }, this._onRefresh);
    }
    _ViewItem = (item) => {
        return (
            <Text key={item.ID_type} style={{ fontSize: sizes.sText16, color: this.state.SelectType.ID_type == item.ID_type ? colors.textblack : colors.colorTextBTGray, textAlign: 'center', fontWeight: this.state.SelectType.ID_type == item.ID_type ? 'bold' : 'normal' }}>{`${item.title}`}</Text>)
    }
    _DropDown = () => {
        Utils.goscreen(this, 'Modal_ComponentSelectCom', { callback: this._callback, item: this.state.SelectType, AllThaoTac: this.state.listType, ViewItem: this._ViewItem })
    }

    _onPressChoosNam = (val) => {
        var { Selectnam } = this.state
        if (val == true) {
            this.setState({ Selectnam: moment(Selectnam).add(1, 'year') }, this.getDSphep)
        } else {
            this.setState({ Selectnam: moment(Selectnam).add(-1, 'year') }, this.getDSphep)
        }
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
        var { DSphep, tinhtrangSelect, Selectnam, time, SelectType } = this.state;
        return (

            <View style={nstyles.ncontainer}>
                {/* Header  */}
                {/* <HeaderComStack onPressLeft={() => { Utils.goback(this, null) }}

                    nthis={this} title={RootLang.lang.scquanlyphepton.title} /> */}
                <HeaderAnimationJee onPressLeft={() => { Utils.goback(this, null) }} nthis={this} title={RootLang.lang.scquanlyphepton.title} />
                <TouchTime
                    isShow={false}
                    icon={Images.icDownBlue}
                    title={RootLang.lang.scquanlyphepton.hinhthuc + '*'}
                    _onPress={this._DropDown}
                    value={SelectType.title}
                />
                {/* BODY */}
                <View style={{ flex: 1, paddingHorizontal: 15, backgroundColor: colors.backgroundColor }}>
                    <View style={{
                        justifyContent: "center",
                        alignItems: "center", flexDirection: "row",
                    }}>
                        <TouchableOpacity
                            style={{ padding: 20, }}
                            onPress={() => this._onPressChoosNam(false)}
                        >
                            <Image
                                source={Images.btnPre}
                                style={{ tintColor: colors.colorTabActive }}
                            />
                        </TouchableOpacity>
                        <Text
                            style={{
                                color: colors.colorTabActive,
                                paddingLeft: 10, fontSize: sizes.sText16, fontWeight: "bold", marginHorizontal: 40
                            }}>{RootLang.lang.common.nam + " " + moment(Selectnam).year()}</Text>
                        <TouchableOpacity
                            style={{ padding: 20, }}
                            onPress={() => this._onPressChoosNam(true)}
                        >
                            <Image
                                source={Images.btnNext}
                                style={{ tintColor: colors.colorTabActive }}
                            />
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={DSphep}

                        ListEmptyComponent={this.renderListEmpty}
                        initialNumToRender={2}
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                        renderItem={this._renderItem}
                        showsVerticalScrollIndicator={false}
                        onEndReached={this.loadMoreData}
                        onEndReachedThreshold={0.2}
                        ListFooterComponent={this.state.showload ?
                            <ActivityIndicator size='small' /> : null}
                        keyExtractor={(item, index) => index.toString()} />
                </View>
            </View >
        );
    }
};

const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(DSPhepTon, mapStateToProps, true)