import moment from 'moment';
import React, { Component } from 'react';
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { getDSNghiPhep, getHuyDonPhep } from '../../../apis/apiPhep';
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import { RootLang } from '../../../app/data/locales';
import Utils from '../../../app/Utils';
import UtilsApp from '../../../app/UtilsApp';
import IsLoading from '../../../components/IsLoading';
import { Images } from '../../../images/index';
import { colors } from '../../../styles/color';
import { fonts } from '../../../styles/font';
import { sizes } from '../../../styles/size';
import { nstyles } from '../../../styles/styles';

class DSNghiPhep extends Component {
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
            refreshing: true,
            showload: false,
            timeline: 1000,
        }
        ROOTGlobal.QLCNPhep.refreshphep = this.getDSphep;
    }
    componentDidMount() {
        this.getDSphep()
    }
    _DeteleDonPhep = async (ID_Row) => {
        Utils.showMsgBoxYesNo(this.props.nthis, RootLang.lang.thongbaochung.thongbao, RootLang.lang.scphepthemdon.banmuonxoadonnay,
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
                showload: false,
            })
        } else {
            nthisLoading.hide();
            if (res && res.status == 1) {
                this.setState({
                    DSphep: [], refreshing: false,
                    showload: false,
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
    };
    handleColorStatus = (item) => {
        if (item.Valid == null && item.TinhTrangID == 2) {
            return colors.redStar
        }
        else if (item.Valid == null && item.TinhTrangID == -1) {
            return '#FF6A00'
        }
        else if (item.Valid == false && item.TinhTrangID == 0) {
            return colors.redStar
        }
        else if (item.Valid == true && item.TinhTrangID == 1) {
            return colors.textTabActive
        }
        return colors.redStar
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
        const { DSphep } = this.state
        var tg = item.ThoiGian.split('-')
        let thu = item?.ThoiGian.split(' ')
        let data = item?.ThoiGian.split('(')
        let ngay = data[data.length - 1]?.split(')')
        var dateCu = ''
        if (index != 0) {
            var itemCu = DSphep[index - 1];
            dateCu = moment(itemCu?.GioBatDau).format('MM/YYYY');
        }
        var dateMoi = item?.GioBatDau ? moment(item?.GioBatDau).format('MM/YYYY') : '...';
        let checkDay = this._checkDay(item?.GioBatDau, item?.GioKetThuc)
        return (
            <View style={{}}>
                {
                    dateMoi != dateCu || index == 0 ? <Text style={{
                        paddingVertical: 5, color: colors.textblack,
                        fontSize: sizes.sText14, marginTop: index == 0 ? 0 : 5
                    }}>{RootLang.lang.common.thang + " " + dateMoi}</Text> : null

                }
                <TouchableOpacity key={index}
                    style={[nstyles.shadowButTon, {
                        backgroundColor: colors.white,
                        paddingVertical: 20
                        //  marginVertical: 2
                    }]}
                    onPress={() => Utils.goscreen(this.props.nthis, "ModalChiTiet_NghiPhep", {
                        deeplink: true,
                        itemId: item.ID_Row,
                        _delete: () => { },
                        nthis: this
                    })}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 }}>
                        <View style={{ flexDirection: 'row', flex: 1 }}>
                            <Image
                                source={item?.TinhTrang == "Đã duyệt" ? Images.ImageJee.icBrowser : item?.TinhTrang == "Không duyệt" ? Images.ImageJee.icUnBrowser : item?.TinhTrang == "Đã hủy" ? Images.ImageJee.icDahuy : Images.ImageJee.ic_ChoDuyet}
                                style={[{ width: 20, height: 20 }]}
                            />
                            <Text style={{
                                marginLeft: 10,
                                fontSize: sizes.sText16, flex: 1, textDecorationLine: item?.TinhTrang == "Đã hủy" ? 'line-through' : 'none',
                                color: item?.TinhTrang == "Đã hủy" ? colors.red1 : null, textDecorationStyle: 'solid',
                            }}>{item.LoaiPhep}</Text>
                        </View>
                        <Text style={{
                            fontSize: sizes.sText16, lineHeight: 19,
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
                                    fontSize: sizes.sText14, lineHeight: 16, marginLeft: 10,
                                    fontFamily: fonts.Helvetica, color: '#808080', paddingLeft: 43
                                }}
                                    numberOfLines={1}
                                >{thu[0] + " " + moment(item?.GioBatDau).format('DD/MM/YYYY') + " " + thu[2] + " - " + thu[4]}</Text>
                            ) : (
                                    <Text style={{
                                        fontSize: sizes.sText14, lineHeight: 16, marginLeft: 10,
                                        fontFamily: fonts.Helvetica, color: '#808080', paddingLeft: 43
                                    }}
                                        numberOfLines={1}
                                    >{thu[0] + " " + moment(item?.GioBatDau).format('DD/MM/YYYY') + " " + thu[2] + " - " + thu[4] + " " + moment(item?.GioKetThuc).format('DD/MM/YYYY') + " " + thu[6]}</Text>
                                )
                        }
                    </View>
                </TouchableOpacity>
            </View>
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
    _ListFooterComponent = () => {
        if (this.state.page < this.pageAll)
            return <ActivityIndicator size='small' style={{ marginTop: 10 }} />;
        else return null
    }
    _ItemSeparatorComponent() {
        return <View style={{ height: 1.5, backgroundColor: colors.black_16 }} />
    }
    render() {
        return (

            <View style={{ flex: 1, backgroundColor: colors.colorBGHome, paddingBottom: 15, padding: 15 }}>
                <FlatList
                    data={this.state.DSphep}
                    ListEmptyComponent={this.renderListEmpty}
                    initialNumToRender={2}
                    refreshing={this.state.refreshing}
                    ItemSeparatorComponent={this._ItemSeparatorComponent}
                    onRefresh={this._onRefresh}
                    renderItem={this._renderItem}
                    showsVerticalScrollIndicator={false}
                    onEndReached={this.loadMoreData}
                    onEndReachedThreshold={0.2}
                    ListFooterComponent={this._ListFooterComponent}
                    keyExtractor={(item, index) => index.toString()} />
                <IsLoading />
            </View>
        );
    }
};
const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(DSNghiPhep, mapStateToProps, true)