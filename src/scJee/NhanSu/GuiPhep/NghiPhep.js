import moment from 'moment';
import React, { Component } from 'react';
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View, StyleSheet, Platform } from 'react-native';
import { getDSHanMuc, getDSNghiPhep, getHuyDonPhep } from '../../../apis/apiPhep';
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import { RootLang } from '../../../app/data/locales';
import Utils from '../../../app/Utils';
import UtilsApp from '../../../app/UtilsApp';
import HeaderAnimationJee from '../../../components/HeaderAnimationJee';
import IsLoading from '../../../components/IsLoading';
import { Images } from '../../../images/index';
import { colors } from '../../../styles/color';
import { fonts } from '../../../styles/font';
import { reText, sizes } from '../../../styles/size';
import { nHeight, paddingBotX, Width } from '../../../styles/styles';

class NghiPhep extends Component {
    constructor(props) {
        super(props);
        this.page = 1;
        this.pageAll = 1
        this.state = {
            tabNP: 0,
            DSphep: [],
            _page: 1,
            _allPage: 1,
            record: 10,
            refreshing: false,
            showload: false,
            timeline: 1000,
            //Phần này của số phép còn lại
            DsHanMuc: [],
            Selectnam: moment(new Date()),
            checkEmpty: false
        }
        ROOTGlobal.QLCNPhep.refreshphep = this.getDSphep;
    }

    componentDidMount() {
        nthisLoading.show();
        this.getDSphep()
        this._getDsHanMuc()
    }

    _getDsHanMuc = async () => {
        var { Selectnam } = this.state;
        var nam = moment(Selectnam).format('YYYY');
        let res = await getDSHanMuc(nam, 1, 999); //Hiện tại lấy tất cả
        if (res.status == 1 && res.data.length > 0) {
            this.setState({ DsHanMuc: res.data })
        } else {
            this.setState({ DsHanMuc: [] })
            //UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.thongbaochung.loilaydulieu, 2)
        }
    }

    _DeteleDonPhep = async (ID_Row) => {
        Utils.showMsgBoxYesNo(this, RootLang.lang.thongbaochung.thongbao, RootLang.lang.scphepthemdon.banmuonxoadonnay,
            RootLang.lang.scphepthemdon.xoadon, RootLang.lang.thongbaochung.thoat, async () => {
                const res = await getHuyDonPhep(ID_Row)
                if (res.status == 1) {
                    UtilsApp.MessageShow(RootLang.lang.thongbao, RootLang.lang.xoadonthanhcong, 1)
                    this._onRefresh()
                    return
                } else {
                    UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.scphepthemdon.dondaduyet, 1)
                }
            }, () => { }, true)
    }

    getDSphep = async (nextPage = 1) => {
        const { record, itemId } = this.state;
        var DSphep = [];
        let valphep = `|`;
        const res = await getDSNghiPhep(valphep, nextPage, record);
        var { data = [], page = {} } = res;
        if (res.status == 1 && data.length > 0) {
            nthisLoading.hide();
            DSphep = DSphep.concat(data);
            var { Page = 1, AllPage = 1 } = page;
            this.page = Page;
            this.pageAll = AllPage;
            this.setState({
                DSphep: DSphep, refreshing: false,
                showload: false, checkEmpty: true
            })
        } else {
            nthisLoading.hide();
            if (res && res.status == 1) {
                this.setState({
                    DSphep: [], refreshing: false,
                    showload: false, checkEmpty: true
                })
            } else {
                UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.thongbaochung.loilaydulieu, 2)
                this.setState({
                    refreshing: false,
                    showload: false,
                })
            }
        }
    }

    _onRefresh = () => {
        this.setState({ refreshing: true }, () => this.getDSphep());
    }

    loadMoreData = async () => {
        const pageNumber = this.page + 1;
        if (this.page < this.pageAll) {
            this.page = pageNumber;
            let valphep = `|`;
            const res = await getDSNghiPhep(valphep, pageNumber, 10);
            var { data = [] } = res;
            if (res.status == 1 && data.length > 0) {
                let DSphep = [...this.state.DSphep, ...res.data];
                this.setState({ DSphep: DSphep, page: pageNumber, showload: false });
            } else {

            }
        } else {
        }
    }

    handleColorStatus = (item) => {
        if (item.Valid == null && item.TinhTrangID == 2) {
            return colors.checkCancle
        }
        else if (item.Valid == null && item.TinhTrangID == -1) {
            return colors.checkAwait
        }
        else if (item.Valid == false && item.TinhTrangID == 0) {
            return colors.checkCancle
        }
        else if (item.Valid == true && item.TinhTrangID == 1) {
            return colors.checkGreen
        }
        return colors.checkCancle
    }

    _checkDay = (batdau, ketthuc) => {
        let ngayBD = moment(batdau).format('YYYY/MM/DD HH:mm:ss')
        let ngayKT = moment(ketthuc).format('YYYY/MM/DD HH:mm:ss')
        let kq = false
        if ((ngayBD === ngayKT) == true) {
            kq = true
        }
        return kq
    }

    _renderItem = ({ item, index }) => {
        let thu = item?.ThoiGian.split(' ')
        let data = item?.ThoiGian.split('(')
        let ngay = data[data.length - 1]?.split(')')
        var dateMoi = item?.GioBatDau ? moment(item?.GioBatDau).format('MM/YYYY') : '...';
        let checkDay = this._checkDay(item?.GioBatDau, item?.GioKetThuc)
        let checkMonthTop = index == 0 || moment(item.GioBatDau).format('YYYY-MM') != moment(this.state.DSphep[index - 1].GioBatDau).format('YYYY-MM') ? true : false
        let checkMonthBot = index == this.state.DSphep.length - 1 || moment(item.GioBatDau).format('YYYY-MM') != moment(this.state.DSphep[index + 1].GioBatDau).format('YYYY-MM') ? true : false
        return (
            <View style={{}}>
                {
                    checkMonthTop ?
                        <Text style={{
                            paddingVertical: 5, color: colors.colorTitleJee, marginHorizontal: 10, fontSize: sizes.sText14, marginTop: index == 0 ? 0 : 15
                        }}>{RootLang.lang.common.thang + " " + dateMoi}</Text> : null
                }

                <View style={{
                    backgroundColor: colors.white, borderTopLeftRadius: checkMonthTop ? 10 : 0, borderTopRightRadius: checkMonthTop ? 10 : 0,
                    borderBottomLeftRadius: checkMonthBot ? 10 : 0, borderBottomRightRadius: checkMonthBot ? 10 : 0,
                    marginBottom: index == this.state.DSphep.length - 1 ? 170 : null,
                }}>
                    <TouchableOpacity key={index}
                        style={{
                            backgroundColor: colors.white,
                            paddingVertical: 15, borderBottomLeftRadius: checkMonthBot ? 10 : 0, borderBottomRightRadius: checkMonthBot ? 10 : 0,
                            borderTopLeftRadius: checkMonthTop ? 10 : 0, borderTopRightRadius: checkMonthTop ? 10 : 0,
                        }}
                        onPress={() => Utils.goscreen(this, "ModalChiTiet_NghiPhep", {
                            deeplink: true, itemId: item.ID_Row, _delete: () => { }, nthis: this
                        })}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, backgroundColor: colors.white }}>
                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                <Image
                                    source={item?.TinhTrang == "Đã duyệt" ? Images.ImageJee.icBrowser : item?.TinhTrang == "Không duyệt" ? Images.ImageJee.icUnBrowser : item?.TinhTrang == "Đã hủy" ? Images.ImageJee.icDahuy : Images.ImageJee.ic_ChoDuyet}
                                    style={[{ width: 20, height: 20 }]}
                                />
                                <Text style={{
                                    marginLeft: 10,
                                    fontSize: reText(14), flex: 1, textDecorationLine: item?.TinhTrang == "Đã hủy" ? 'line-through' : 'none',
                                    color: item?.TinhTrang == "Đã hủy" ? colors.checkCancle : colors.titleJeeHR, textDecorationStyle: 'solid',
                                }}>{item.LoaiPhep}</Text>
                            </View>
                            <Text style={{
                                fontSize: reText(14),
                                marginLeft: 20, fontWeight: "bold",
                                fontFamily: fonts.Helvetica,
                                color: this.handleColorStatus(item),
                                textDecorationLine: item?.TinhTrang == "Đã hủy" ? 'line-through' : 'none',
                                textDecorationStyle: 'solid',
                            }}
                                numberOfLines={2}
                            >{ngay[0]}</Text>
                        </View>
                        <View style={{ marginTop: 5 }}>
                            {
                                checkDay ? (
                                    <Text style={{
                                        fontSize: reText(12), lineHeight: 16, marginLeft: 10,
                                        fontFamily: fonts.Helvetica, color: colors.colorNoteJee, paddingLeft: 30
                                    }}
                                        numberOfLines={1}
                                    >{thu[0] + " " + moment(item?.GioBatDau).format('DD/MM/YYYY') + " " + thu[2] + " - " + thu[4]}</Text>
                                ) : (
                                        <Text style={{
                                            fontSize: reText(12), lineHeight: 16, marginLeft: 10,
                                            fontFamily: fonts.Helvetica, color: colors.colorNoteJee, paddingLeft: 30
                                        }}
                                            numberOfLines={1}
                                        >{thu[0] + " " + moment(item?.GioBatDau).format('DD/MM/YYYY') + " " + thu[2] + " - " + thu[4] + " " + moment(item?.GioKetThuc).format('DD/MM/YYYY') + " " + thu[6]}</Text>
                                    )
                            }
                        </View>
                    </TouchableOpacity>
                    {checkMonthBot ? null :
                        <View style={{ height: 0.5, backgroundColor: colors.colorLineJee, width: Width(82), alignSelf: 'flex-end', marginRight: Width(3) }} />}
                </View>
            </View>
        );
    }

    renderListEmpty = () => {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: nHeight(20) }}>
                <Image source={Images.icListEmpty} style={{ width: sizes.nImgSize200, height: sizes.nImgSize200 }} resizeMode={'cover'} />
                <Text style={{ fontSize: sizes.sText16, color: colors.brownGreyTwo }}>{RootLang.lang.thongbaochung.khongcodulieu}</Text>
            </View>
        )
    }
    _ListFooterComponent = () => {
        if (this.state.page < this.pageAll)
            return <ActivityIndicator size='small' style={{ marginTop: 10 }} />;
        else return null
    }


    renderHanMuc = ({ item, index }) => {
        let lenghtHanMuc = this.state.DsHanMuc.length
        return (
            <>
                <TouchableOpacity onPress={() => Utils.goscreen(this, "Modal_ChiTietLoaiphep", { item: item })}
                    key={index} style={{ width: lenghtHanMuc == 1 ? Width(100) : lenghtHanMuc == 2 ? Width(50) : Width(43), justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ width: Width(35), justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: reText(12), color: colors.blackJee, textAlign: 'center' }}>{item.LoaiPhep}</Text>
                    </View>
                    <Text style={{ fontSize: reText(14), fontWeight: 'bold', color: colors.titleJeeHR, marginTop: 5 }}>{item.Tong ? item.Tong : '--'}</Text>
                </TouchableOpacity>
                {index + 1 == lenghtHanMuc ? null :
                    <View style={{ height: nHeight(3), width: 0.5, backgroundColor: '#C5C4C9', alignSelf: 'center' }} />}
            </>
        )
    }

    render() {
        let { DsHanMuc, DSphep, checkEmpty } = this.state
        return (
            <View style={{ flex: 1, backgroundColor: colors.backgroudJeeHR, paddingBottom: 15 }}>
                {/* Header  */}
                <HeaderAnimationJee onPressLeft={() => { Utils.goback(this, null) }} nthis={this} title={RootLang.lang.scphepthemdon.tieude} />
                {/* BODY */}

                <FlatList
                    style={{ paddingHorizontal: 10 }}
                    data={DSphep}
                    ListEmptyComponent={checkEmpty ? this.renderListEmpty : null}
                    initialNumToRender={10}
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh}
                    renderItem={this._renderItem}
                    showsVerticalScrollIndicator={false}
                    onEndReached={this.loadMoreData}
                    onEndReachedThreshold={0.2}
                    ListFooterComponent={this._ListFooterComponent}
                    keyExtractor={(item, index) => index.toString()} />
                <View style={{
                    backgroundColor: colors.white, position: 'absolute', bottom: 0, left: 0, paddingBottom: 15 + paddingBotX,
                    margin: 0, width: Width(100), paddingTop: 15,

                    elevation: Platform.OS == "android" ? 5 : 0,
                }}>
                    <FlatList
                        horizontal={true}
                        data={DsHanMuc}
                        renderItem={this.renderHanMuc}
                        keyExtractor={(item, index) => index.toString()}
                    />
                    <TouchableOpacity onPress={() => {
                        Utils.goscreen(this, "ModalNghiPhep")
                    }}
                        style={[styles.create, { marginTop: this.state.DsHanMuc.length == 0 ? 0 : 10 }]} >
                        <Text style={{ fontSize: reText(14), color: colors.checkGreen, fontWeight: 'bold' }}> {RootLang.lang.sckhac.taodonmoi} </Text>
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
        marginHorizontal: 10,
        backgroundColor: colors.bgGreenBtn, width: Width(95)
    }
});

const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});

export default Utils.connectRedux(NghiPhep, mapStateToProps, true)