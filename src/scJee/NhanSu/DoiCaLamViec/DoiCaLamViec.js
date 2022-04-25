import React, { Component } from 'react';
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Get_ChangeShiftList } from '../../../apis/apiChangeshiftnv';
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import { RootLang } from '../../../app/data/locales';
import Utils from '../../../app/Utils';
import UtilsApp from '../../../app/UtilsApp';
import HeaderAnimationJee from '../../../components/HeaderAnimationJee';
import { Images } from '../../../images';
import { colors, fonts } from '../../../styles';
import { reText, sizes } from '../../../styles/size';
import { nHeight, nstyles, paddingBotX, Width } from '../../../styles/styles';
import moment from 'moment';
import IsLoading from '../../../components/IsLoading'

export class DoiCaLamViec extends Component {
    constructor(props) {
        super(props);
        this.refLoading = React.createRef()
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
            checkEmpty: false
        };
        ROOTGlobal.QLDoiCa.refreshDSDoiCa = this._onRefresh
    }

    componentDidMount() {
        this.refLoading.current.show()
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
        if (res.status == 1) {
            this.refLoading.current.hide()
            var { data = [], page = {} } = res;
            if (Array.isArray(data) && data.length > 0) {
                DSDoica = DSDoica.concat(data);
            } else {
                DSDoica = []
            }
            var { Page = 1, AllPage = 1 } = page;
            _page = Page;
            _allPage = AllPage;
        } else {
            this.refLoading.current.hide()
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error.message, 2)
        }
        this.setState({ DSDoica, _page, _allPage, refreshing: false, showload: false, checkEmpty: true })
    }

    _onRefresh = () => {
        this.setState({ refreshing: true }, this._Get_ChangeShiftList);
    }

    _renderItem = ({ item, index }) => {
        var { Valid } = item
        let checkMonthTop = index == 0 || moment(item.NgayGui).format('YYYY-MM') != moment(this.state.DSDoica[index - 1].NgayGui).format('YYYY-MM') ? true : false
        let checkMonthBot = index == this.state.DSDoica.length - 1 || moment(item.NgayGui).format('YYYY-MM') != moment(this.state.DSDoica[index + 1].NgayGui).format('YYYY-MM') ? true : false
        return (
            <View key={index} style={{ marginBottom: index == this.state.DSDoica.length - 1 ? 116 + paddingBotX : 0 }}>
                {checkMonthTop ? <Text style={{ color: colors.colorTitleJee, fontSize: reText(14), marginHorizontal: 10, marginBottom: 5, marginTop: index == 0 ? 0 : 20 }}>
                    {RootLang.lang.scdoicalamviec.thang} {moment(item.NgayGui).format('MM/YYYY')}</Text> : null}
                <TouchableOpacity key={index}
                    onPress={() => Utils.goscreen(this, "Modal_ChiTietDoiCaLamViec", {
                        RowID: item.RowID,
                        refresh: this._onRefresh,
                        nthis: this,
                        isGoBak: true
                    })}
                    style={{
                        flex: 1,
                        backgroundColor: colors.white, height: 'auto', paddingHorizontal: 10,
                        borderTopLeftRadius: checkMonthTop ? 10 : 0, borderTopRightRadius: checkMonthTop ? 10 : 0,
                        borderBottomLeftRadius: checkMonthBot ? 10 : 0, borderBottomRightRadius: checkMonthBot ? 10 : 0

                    }}>
                    <View style={{ flexDirection: 'row', marginTop: 15 }}>
                        <Image
                            source={Valid == true ? Images.ImageJee.icBrowser : (Valid == false ? Images.ImageJee.icUnBrowser : Images.ImageJee.ic_ChoDuyet)}
                            style={{}}
                        />
                        <View style={{ flex: 1 }}>
                            {item.Data.length > 0 ?
                                item.Data.map(item => {
                                    let caLam = item.CaLamViec ? item.CaLamViec.split(' (', 1) : '---'
                                    let caDoi = item.CaThayDoi ? item.CaThayDoi.split(' (', 1) : '---'
                                    return (
                                        <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                            <Text style={{ fontSize: reText(14), marginLeft: 10, flex: 1, color: colors.titleJeeHR }}>
                                                {moment(item.NgayLamViec).format('ddd, DD/MM')} - {moment(item.ToDate).format('ddd, DD/MM')}
                                            </Text>
                                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                <Text
                                                    style={{
                                                        fontSize: reText(14), fontWeight: "bold", fontFamily: fonts.Helvetica,
                                                        color: Valid == true ? colors.checkGreen : (Valid == false ? colors.checkCancle : colors.checkAwait),
                                                    }}>{caLam}</Text>
                                                <Image source={Images.ImageJee.icArrowRight} style={{ marginHorizontal: 5, tintColor: Valid == true ? colors.checkGreen : (Valid == false ? colors.checkCancle : colors.checkAwait), alignSelf: 'center' }} />
                                                <Text
                                                    style={{
                                                        fontSize: reText(14), fontWeight: "bold", fontFamily: fonts.Helvetica,
                                                        color: Valid == true ? colors.checkGreen : (Valid == false ? colors.checkCancle : colors.checkAwait),
                                                    }}>{caDoi}</Text>
                                            </View>
                                        </View>
                                    )
                                }) : null}

                        </View>
                    </View>
                    <Text style={{ fontSize: reText(11), marginBottom: item.LyDo ? 15 : 0, marginLeft: 35, color: colors.colorNoteJee }}>{item.LyDo ? item.LyDo : ''}</Text>
                    {checkMonthBot ? null : <View style={{ height: 0.5, backgroundColor: colors.colorLineJee, marginLeft: 35 }} />}
                </TouchableOpacity>
            </View>
        );

    }

    _ItemSeparatorComponent = () => {
        return (
            <View style={{ height: 3, backgroundColor: colors.white, }} />
        )
    }

    renderListEmpty = () => {
        return (
            <View style={{ Width: 100, justifyContent: 'center', alignItems: 'center', marginTop: nHeight(20) }}>
                <Image source={Images.icListEmpty} style={{ width: sizes.nImgSize200, height: sizes.nImgSize200 }} resizeMode={'cover'} />
                <Text style={{ fontSize: sizes.sText16, color: colors.brownGreyTwo }}>{RootLang.lang.thongbaochung.khongcodulieu}</Text>
            </View>
        )
    }

    render() {
        const { DSDoica, checkEmpty } = this.state
        return (
            <View style={[nstyles.ncontainer, { flex: 1, backgroundColor: colors.white }]}>
                <HeaderAnimationJee onPressLeft={() => { Utils.goback(this, null) }}
                    nthis={this} title={RootLang.lang.scdoicalamviec.title} />
                <View style={{ flex: 1, backgroundColor: colors.backgroudJeeHR }}>
                    <FlatList
                        data={DSDoica}
                        ListEmptyComponent={checkEmpty ? this.renderListEmpty : null}
                        initialNumToRender={10}
                        refreshing={this.state.refreshing}
                        style={{ paddingHorizontal: 10 }}
                        ListHeaderComponent={this._renderHeader}
                        onRefresh={this._onRefresh}
                        renderItem={this._renderItem}
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
                        Utils.goscreen(this, "ModalDoiCaLamViec")
                    }}
                        style={styles.create} >
                        <Text style={{ fontSize: reText(14), color: colors.greenButtonJeeHR, fontWeight: 'bold' }}> {RootLang.lang.sckhac.taomoi} </Text>
                    </TouchableOpacity>
                </View>
                <IsLoading ref={this.refLoading} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    create: {
        borderRadius: 10, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', paddingVertical: 15,
        borderColor: colors.black_20, marginHorizontal: 10,
        backgroundColor: colors.white, width: Width(95)
    }
});

// export default DoiCaLamViec
const mapStateToProps = state => ({
    lang: state.changeLanguage.language,
    loadtangca: state.LoadTC.loadtangca
});
export default Utils.connectRedux(DoiCaLamViec, mapStateToProps, true)
