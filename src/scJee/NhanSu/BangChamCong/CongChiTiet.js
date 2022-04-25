import moment from 'moment';
import React, { Component } from 'react';
import { Animated } from 'react-native';
import {
    ActivityIndicator, Alert, FlatList, StyleSheet, Text,
    TouchableOpacity, View, Image
} from 'react-native';
import { getDSChamCong } from '../../../apis/apiTimesheets';
import { RootLang } from '../../../app/data/locales';
import Utils from '../../../app/Utils';
import ListEmpty from '../../../components/ListEmpty';
import { Images } from '../../../images';
import { colors } from '../../../styles/color';
import { fonts } from '../../../styles/font';
import { sizes } from '../../../styles/size';
import { Height, nstyles, Width } from '../../../styles/styles';
import HeaderModalCom from '../../Component/HeaderModalCom';
import { TouchTimeVer3 } from '../../Component/itemcom/itemcom';


class CongChiTiet extends Component {
    constructor(props) {
        super(props);
        this.type = Utils.ngetParam(this, 'type', 0)
        this.isMonth = Utils.ngetParam(this, 'isMonth', 12);
        this.isTimeYear = Utils.ngetParam(this, 'isTimeYear', 2020);
        this.title = Utils.ngetParam(this, 'title', '');
        let temp = new Date(this.isTimeYear, this.isMonth);
        this.isError = false;
        this.state = {
            _dateFr: moment(temp).startOf('month').format('DD/MM/YYYY'),
            _dateTo: moment(temp).endOf('month').format('DD/MM/YYYY'),
            DSChiTiet: [],
            refreshing: false,
            showload: false,
            _page: 1,
            _allPage: 1,
            record: 10,
            isVisible: true,
            isgoback: false,
            years: this.isTimeYear,
            month: this.isMonth,
            MonthYear: 0,
            opacity: new Animated.Value(0)

        }
    }
    _goback = async () => {
        this._endAnimation(0)
        Utils.goback(this)
    }
    _startAnimation = (value) => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: value,
                duration: 300
            }).start();
        }, 400);
    };

    _endAnimation = (value) => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: value,
                duration: 1
            }).start();
        }, 1);
    };


    componentDidMount() {
        this._startAnimation(0.8)
        this._getCongChiTiet()
    }

    _getCongChiTiet = async (nextPage = 1) => {
        var { _dateTo, _dateFr, DSChiTiet, _page,
            _allPage, record } = this.state
        if (nextPage == 1) {
            DSChiTiet = [];
        }
        if (_dateFr && _dateTo) {
            var val = `${_dateFr}|${_dateTo}`;
            let res = await getDSChamCong(val, nextPage, record)
            Utils.nlog('_getCongChiTiet', res)
            if (res.status == 1) {
                var { data = [], page = {} } = res;
                if (Array.isArray(data) && data.length > 0) {
                    DSChiTiet = DSChiTiet.concat(data);
                } else {
                    DSChiTiet = []
                }
                var { Page = 1, AllPage = 1 } = page;
                _page = Page;
                _allPage = AllPage;

            } else Alert.alert(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu)
            this.setState({ DSChiTiet, _page, _allPage, refreshing: false, showload: false })
        }

    }
    _onRefresh = () => {
        this._getCongChiTiet();
    }
    loadMoreData = async () => {
        var { _page, _allPage } = this.state;
        if (_page < _allPage) {
            this.setState({ showload: true }, () => this._getCongChiTiet(_page + 1));
        }
    }

    _goChiTietChamcong = async (item) => {
        Utils.goscreen(this, 'Modal_ChamCong', {
            item: item
        });
    }



    _renderItem = ({ item, index }) => {
        let vaora = `${item.vao ? item.vao : ""} - ${item.ra ? item.ra : ""}`;
        var dayOfTheWeeks = moment(item.ngaychuan).day()
        var date = item.ngay
        if (String(item.ngay).length > 9) {
            date = String(item.ngay).replace(String(item.ngay).slice(-8), "").split(" ").slice(0, -1) + " / " + String(item.ngay).replace(String(item.ngay).slice(-8), "").split(" ").slice(1)
        }
        // Thứ 7 = 6 , Chủ nhật = 0
        return (
            <TouchableOpacity
                onPress={() => this._goChiTietChamcong(item)}
                style={{ flexDirection: 'column' }}>
                <View style={[nstyles.nrow, { paddingVertical: 20, paddingHorizontal: 20 }]}>
                    <Text style={[styles.textValue, { flex: 0.8, fontWeight: dayOfTheWeeks == 6 ? "bold" : dayOfTheWeeks == 0 ? "bold" : null, color: dayOfTheWeeks == 6 ? "#FFBE68" : dayOfTheWeeks == 0 ? "#F86252" : colors.black }]}>{date ? date : RootLang.lang.thongbaochung.chuacapnhat}</Text>
                    <View style={{ flex: 1, flexDirection: "row" }}>
                        <Text style={[styles.textValue, { fontWeight: dayOfTheWeeks == 6 ? "bold" : dayOfTheWeeks == 0 ? "bold" : null, color: dayOfTheWeeks == 6 ? "#FFBE68" : dayOfTheWeeks == 0 ? "#F86252" : colors.black }]}>{item.vao ? item.vao : ""}</Text>
                        <Text style={[styles.textValue, { marginLeft: item.vao == '' || item.vao == null ? Width(9.5) : null, fontWeight: dayOfTheWeeks == 6 ? "bold" : dayOfTheWeeks == 0 ? "bold" : null, color: dayOfTheWeeks == 6 ? "#FFBE68" : dayOfTheWeeks == 0 ? "#F86252" : colors.black }]}>{" - "}</Text>
                        <Text style={[styles.textValue, { fontWeight: dayOfTheWeeks == 6 ? "bold" : dayOfTheWeeks == 0 ? "bold" : null, color: dayOfTheWeeks == 6 ? "#FFBE68" : dayOfTheWeeks == 0 ? "#F86252" : colors.black }]}>{item.vao ? item.ra : ""}</Text>
                    </View>
                    <Text style={[styles.textValue, { flex: 0.75, fontWeight: dayOfTheWeeks == 6 ? "bold" : dayOfTheWeeks == 0 ? "bold" : null, color: dayOfTheWeeks == 6 ? "#FFBE68" : dayOfTheWeeks == 0 ? "#F86252" : colors.colorTabActive }]}>{item.tongtc ? item.tongtc : '0'}</Text>
                    <Text style={[styles.textValue, { flex: 0.45, fontWeight: dayOfTheWeeks == 6 ? "bold" : dayOfTheWeeks == 0 ? "bold" : null, color: colors.colorTabActive, color: dayOfTheWeeks == 6 ? "#FFBE68" : dayOfTheWeeks == 0 ? "#F86252" : colors.black }]}>{item.tongcong ? item.tongcong : '0.00'}</Text>
                </View>
                <View style={{ height: 1, backgroundColor: colors.veryLightPinkTwo }} />
            </TouchableOpacity >

        );
    }

    _selectDate = (val) => {
        let { _dateFr, _dateTo } = this.state;
        if (_dateFr && _dateTo) {

            Utils.goscreen(this, "Modal_Calanda", {
                dateF: _dateFr,
                dateT: _dateTo,
                isTimeF: val,
                setTimeFC: this._SetNgayThang,
                arrTitle: [RootLang.lang.scbangcong.tungay, RootLang.lang.scbangcong.denngay]
            })
        } else {
            Utils.goscreen(this, "Modal_Calanda", {
                dateF: _dateFr,
                dateT: _dateTo,
                isTimeF: val,
                setTimeFC: this._SetNgayThang,
                arrTitle: [RootLang.lang.scbangcong.tungay, RootLang.lang.scbangcong.denngay]
            })
        }


    }
    _SetNgayThang = (_dateFr, _dateTo) => {
        this.setState({ _dateFr, _dateTo }, this._getCongChiTiet)
    }

    _SetThoiGian = (item) => {
    }

    handlePrev = async () => {
        const { month, years, _dateFr, _dateTo } = this.state
        this.setState({ month: month - 1 })
        if (await month < 1) {
            this.setState({ years: years - 1, month: month + 11 })
        }
        let temp = new Date(years, month - 1);
        this.setState({
            _dateFr: moment(temp).startOf('month').format('DD/MM/YYYY'),
            _dateTo: moment(temp).endOf('month').format('DD/MM/YYYY'),
        })
        this._getCongChiTiet()


    }

    handleNext = async () => {
        const { month, years, } = this.state
        this.setState({ month: month + 1 })
        if (await month > 10) {
            this.setState({ years: years + 1, month: 0 })
        }
        let temp = new Date(years, month + 1);
        this.setState({
            _dateFr: moment(temp).startOf('month').format('DD/MM/YYYY'),
            _dateTo: moment(temp).endOf('month').format('DD/MM/YYYY'),
        })
        this._getCongChiTiet()

    }

    render() {
        var { _dateTo, _dateFr, DSChiTiet, month, years, MonthYear, opacity } = this.state
        let month1 = month + 1
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: `transparent`, justifyContent: 'flex-end' }]}>
                <Animated.View onTouchEnd={this._goback} style={{
                    position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
                    backgroundColor: colors.backgroundModal, alignItems: 'flex-end',
                    opacity
                }} />
                <View style={{
                    backgroundColor: colors.white, flex: 1, marginTop: Height(5), backgroundColor: colors.white,
                    borderTopLeftRadius: 20, borderTopRightRadius: 20,
                    flexDirection: 'column', paddingHorizontal: 15
                }}>
                    <HeaderModalCom onPress={this._goback} title={this.title} />

                    <View style={{ flex: 1 }}>
                        <View style={[{ backgroundColor: colors.white, flexDirection: "row" }]}>
                            {this.type == 1 ? <>
                                <TouchTimeVer3
                                    icon={Images.icCalendar}
                                    title={RootLang.lang.scbangcong.tungay}
                                    _onPress={() => this._selectDate(true)}
                                    value={_dateFr ? _dateFr : ''}
                                />

                                <TouchTimeVer3
                                    isShow={false}
                                    icon={Images.icCalendar}
                                    title={RootLang.lang.scbangcong.denngay}
                                    _onPress={() => this._selectDate(false)}
                                    value={_dateTo ? _dateTo : ''}
                                />
                            </> : null}
                            {this.type == 2 ?
                                <View style={{
                                    flex: 1,
                                    paddingVertical: 20,
                                    flexDirection: 'row',
                                }}>
                                    <TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                                        onPress={() => this.handlePrev()}
                                    >
                                        <Image
                                            source={Images.icCalandarLeft}
                                            style={{ tintColor: colors.colorTabActive }}
                                            resizeMode={'cover'}>
                                        </Image>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{
                                        flex: 1, alignItems: 'center',
                                    }}
                                    // onPress={() => {
                                    //     Utils.goscreen(this, "Modal_ThangNamPicker", {
                                    //         timeFrom: MonthYear,
                                    //         isTimeF: false,
                                    //         _setGoPhut: this._SetThoiGian,
                                    //         textTitle:"Chọn tháng năm"
                                    //     })
                                    // }}

                                    >
                                        <Text style={{
                                            width: Width(50),
                                            textAlign: "center",
                                            color: colors.colorTabActive,
                                            fontSize: 16, fontWeight: 'bold'
                                        }} >{RootLang.lang.common.thang + " "
                                            + month1 + "/" + years
                                            }</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => this.handleNext()}
                                        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                        <Image
                                            source={Images.icCalandarRight}
                                            style={{ tintColor: colors.colorTabActive }}
                                            resizeMode={'cover'}>
                                        </Image>
                                    </TouchableOpacity>
                                </View> : null}
                        </View>
                        <View style={[{ flex: 1 }]}>
                            <View style={[nstyles.nrow, styles.contentTitle, {
                                justifyContent: "space-around"
                            }]}>
                                <Text style={[styles.titletext, {}]}>{RootLang.lang.common.ngay}</Text>
                                <Text style={[styles.titletext, {}]}>{`${RootLang.lang.scbangcong.vao1} - ${RootLang.lang.scbangcong.ra1}`}</Text>
                                <Text style={[styles.titletext, {}]}>{RootLang.lang.scbangcong.tangca}</Text>
                                <Text style={[styles.titletext, {}]}>{RootLang.lang.scbangcong.tongcong}</Text>
                            </View>
                            <View style={{ flex: 1, borderColor: "#D4D4D4", borderWidth: 0.5 }}>
                                <FlatList
                                    style={{ flex: 1, marginTop: 3 }}
                                    data={DSChiTiet}
                                    ListEmptyComponent={<ListEmpty textempty={RootLang.lang.thongbaochung.khongcodulieu} />}
                                    initialNumToRender={2}
                                    refreshing={this.state.refreshing}
                                    onRefresh={this._onRefresh}
                                    renderItem={this._renderItem}
                                    showsVerticalScrollIndicator={false}
                                    onEndReached={this.loadMoreData}
                                    onEndReachedThreshold={0.2}
                                    ListFooterComponent={this.state.showload ?
                                        <ActivityIndicator size='small'
                                        /> : null}
                                    keyExtractor={(item, index) => index.toString()} />
                            </View>

                        </View>
                    </View>
                </View>
            </View>

        )
    }
}
const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(CongChiTiet, mapStateToProps, true)
const styles = StyleSheet.create({
    titletext: {
        color: colors.white,
        fontFamily: fonts.Helvetica,
        fontSize: sizes.sText14, lineHeight: sizes.sText18
    },
    contentTitle: {
        backgroundColor: colors.colorTabActive, paddingHorizontal: 1, paddingVertical: 15, marginTop: 10,
    },
    textValue: {
        fontSize: sizes.sText14, lineHeight: sizes.sText18, fontFamily: fonts.Helvetica
    },
    textValue2: {
        fontSize: sizes.sText14, lineHeight: sizes.sText18, fontFamily: fonts.Helvetica
    }
})

