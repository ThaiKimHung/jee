import React, { Component } from 'react';
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { getDSTangca, getHuyTangCa } from '../../../apis/apiTangca';
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import { RootLang } from '../../../app/data/locales';
import Utils from '../../../app/Utils';
import UtilsApp from '../../../app/UtilsApp';
import HeaderAnimationJee from '../../../components/HeaderAnimationJee';
import { Images } from '../../../images/index';
import { colors } from '../../../styles/color';
import { fonts } from '../../../styles/font';
import { reText, sizes } from '../../../styles/size';
import { nstyles, paddingBotX, Width } from '../../../styles/styles';
import moment from 'moment'
import IsLoading from '../../../components/IsLoading';

const color = (item) => {
    if (item.Approved == null) {
        return colors.checkAwait
    }
    else if (item.Approved == false) {
        return colors.checkCancle
    }
    else if (item.Approved == true) {
        return colors.checkGreen
    }
}

class Dktca extends Component {
    constructor(props) {
        super(props);
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
            checkEmpty: false
        };
        ROOTGlobal.dataAppGlobal.reloadDSTangCa = this._getDSTangca;
    }

    componentDidMount() {
        nthisLoading.show();
        this._getDSTangca();

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
            nthisLoading.hide();
        } else
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
        this.setState({ DSTangca, _page, _allPage, refreshing: false, showload: false, checkEmpty: true })
        nthisLoading.hide();
    }

    _onRefresh = () => {
        this.setState({ refreshing: true }, this._getDSTangca);
    }

    _renderItemThang = ({ item, index }) => {
        var { DSTangca } = this.state
        return (
            <View key={index} style={{ marginBottom: index == this.state.DSTangca.length - 1 ? 116 + paddingBotX : 0 }}>
                {
                    index == 0 || DSTangca[index - 1].Title != item.Title ?
                        <Text style={{
                            fontSize: reText(14), color: colors.colorTitleJee, marginHorizontal: 20, marginTop: index == 0 ? 0 : 20
                        }}>{RootLang.lang.common.thang + " " + item.Title}</Text> : null
                }
                {
                    <View style={{ marginHorizontal: 10, backgroundColor: colors.white, marginTop: 5, borderRadius: 10 }}>
                        {item.Data.map((val, index) => this._renderItem(val, index, item.Data.length ? item.Data.length : 0))}
                    </View>
                }
            </View>
        )
    }
    _renderItem = (item, index, length) => {
        let giatri = `${item.TuGio ? item.TuGio : ''}-${item.DenGio ? item.DenGio : ''} (${item.SoGio ? Math.round(item.SoGio * 100) / 100 : ''}h)`
        let icon = item.Approved ? Images.ImageJee.icBrowser : item.Approved == false ? Images.ImageJee.icUnBrowser : Images.ImageJee.ic_ChoDuyet
        return (
            <>
                <View key={index.toString()}
                    style={{
                        flex: 1, flexDirection: 'row', justifyContent: "space-between", paddingHorizontal: 10, paddingVertical: 15
                    }}>
                    <TouchableOpacity onPress={() => Utils.goscreen(this, 'Modal_DetailsDoiCa', {
                        deeplink: true,
                        itemId: item.ID_Row
                    })} style={{ flexDirection: 'row', flex: 1 }}>
                        <Image
                            source={icon}
                            style={{}}
                        />
                        <View style={{ marginLeft: 10, flex: 1 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ fontSize: reText(14), marginBottom: 5 }}>{moment(item.NgayTangCa, 'DD/MM/YYYY').format('ddd, DD')}{' Thg '}{moment(item.NgayTangCa, 'DD/MM/YYYY').format('MM')}</Text>
                                <Text
                                    style={{
                                        fontSize: sizes.sText16, fontWeight: "bold",
                                        fontFamily: fonts.Helvetica, color: color(item)
                                    }}
                                    numberOfLines={1}>
                                    {item.SoGio.toString().length > 2 ? parseFloat(item.SoGio).toFixed(2) : item.SoGio}{'h'}
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text numberOfLines={1} style={{ fontSize: sizes.sText12, fontFamily: fonts.Helvetica, color: colors.colorNoteJee, width: Width(55) }}>{item.LyDo ? item.LyDo : '--'}</Text>
                                <Text numberOfLines={1} style={{ fontSize: sizes.sText12, fontFamily: fonts.Helvetica, color: colors.blackJee, maxWidth: Width(30) }}>{item.TuGio} - {item.DenGio}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>{
                    index == length - 1 ? null :
                        <View style={{ height: 0.5, backgroundColor: colors.colorLineJee, marginLeft: 40, marginRight: 10 }} />}
            </>
        );
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
        const { DSTangca, checkEmpty } = this.state
        return (
            <View style={[nstyles.ncontainer, { flex: 1, backgroundColor: colors.white }]}>
                <HeaderAnimationJee onPressLeft={() => { Utils.goback(this, null) }}
                    nthis={this} title={RootLang.lang.sctangca.lamthemgio} />
                <View style={{ flex: 1, backgroundColor: colors.backgroudJeeHR }}>
                    <FlatList
                        data={DSTangca}
                        ListEmptyComponent={checkEmpty ? this.renderListEmpty : null}
                        initialNumToRender={10}
                        refreshing={this.state.refreshing}
                        style={{ width: '100%', }}
                        onRefresh={this._onRefresh}
                        renderItem={this._renderItemThang}
                        showsVerticalScrollIndicator={false}
                        onEndReached={this.loadMoreData}
                        onEndReachedThreshold={0.2}
                        ListFooterComponent={this.state.showload ?
                            <ActivityIndicator size='small' /> : null}
                        keyExtractor={(item, index) => index.toString()} />
                </View>
                <View style={{
                    backgroundColor: colors.backgroudJeeHR, position: 'absolute', bottom: 0, left: 0, paddingBottom: 15 + paddingBotX,
                    margin: 0, width: Width(100), paddingTop: 15
                }}>
                    <TouchableOpacity onPress={() => {
                        Utils.goscreen(this, "ModalTangCa")
                    }}
                        style={styles.create} >
                        <Text style={{ fontSize: reText(14), color: colors.greenButtonJeeHR, fontWeight: 'bold' }}> {RootLang.lang.sckhac.taomoi} </Text>
                    </TouchableOpacity>
                </View>
                <IsLoading />
            </View>
        );
    }
};

const styles = StyleSheet.create({
    create: {
        borderRadius: 10, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', paddingVertical: 15,
        borderColor: colors.black_20, marginHorizontal: 10,
        backgroundColor: colors.white, width: Width(95)
    }
});

const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(Dktca, mapStateToProps, true)