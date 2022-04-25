import moment from 'moment';
import React, { Component } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View, TouchableHighlight } from 'react-native';
import { Get_DSGiaiTrinh, HuyGiaiTrinh } from '../../../../apis/apiGiaiTrinh';
import { ROOTGlobal } from '../../../../app/data/dataGlobal';
import { RootLang } from '../../../../app/data/locales';
import Utils from '../../../../app/Utils';
import UtilsApp from '../../../../app/UtilsApp';
import HeaderAnimationJee from '../../../../components/HeaderAnimationJee';
import IsLoading from '../../../../components/IsLoading';
import { Images } from '../../../../images';
import { colors } from '../../../../styles';
import { reText, sizes } from '../../../../styles/size';
import { nHeight, nstyles, paddingBotX, Width } from '../../../../styles/styles';
import ItemGTDanhSach from '../components/ItemGTDanhSach';
import Swipeable from '../../../../components/Swipeable';


class GTChamCong extends Component {
    constructor(props) {
        super(props)
        this.Month = ''
        this.refLoading = React.createRef()
        this.state = {
            listGiaiTrinh: [],
            tenNguoiDuyet: '',
            dataChitietGT: [],
            _page: 1,
            _allPage: 1,
            record: 10,
            refreshing: false,
            RowID: 0,
            listRef: [],
            indexRefopen: '',
            ngayThem: moment(new Date()).format('YYYY-MM-DD'),
            Timestr: '',
            isBack: Utils.ngetParam(this, "isBack", true),
            checkEmpty: false
        }
        ROOTGlobal.GTChamCong.getDSGT = this._getDSGiaiTrinh;
    }

    componentDidMount() {
        this.refLoading.current.show()
        this._getDSGiaiTrinh()
    }

    _getDSGiaiTrinh = async (nextPage = 1) => {
        const { _page,
            _allPage } = this.state
        if (nextPage == 1) {
            listGiaiTrinh = [];
        }
        const res = await Get_DSGiaiTrinh(false, nextPage, 10);
        if (res.status == 1) {
            this.refLoading.current.hide()
            var { data = [], page = {} } = res;
            if (Array.isArray(data) && data.length > 0) {
                if (data && data.length > 0) {
                    var arrdata = []
                    for (let index = 0; index < data.length; index++) {
                        const element = data[index];
                        if (element.Data && element.Data.length > 0) {

                            arrdata = arrdata.concat(element.Data);
                        }
                    }
                }

                listGiaiTrinh = listGiaiTrinh.concat(arrdata);
            } else {

                listGiaiTrinh = []

            }
            const { Page = 1, AllPage = 1 } = page;
            this.setState({ listGiaiTrinh: listGiaiTrinh, _page: Page, _allPage: AllPage, refreshing: false, checkEmpty: true })
        } else {
            this.refLoading.current.hide()
            this.setState({ refreshing: false, checkEmpty: true })
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
        }
    }
    _onRefresh = () => {
        this.setState({ refreshing: true }, () => this._getDSGiaiTrinh());
    }
    loadMoreData = async () => {
        const { _page, _allPage } = this.state;
        if (_page < _allPage) {
            this.setState({ showload: true, _page: _page + 1 }, () => this._getDSGiaiTrinh(_page + 1));
        }
    }

    renderListEmpty = () => {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View>
                    <Image source={Images.icListEmpty} style={{ width: sizes.nImgSize200, height: sizes.nImgSize200 }} resizeMode={'cover'} />
                    <Text style={{ fontSize: sizes.sText16, color: colors.brownGreyTwo, textAlign: 'center' }}>{RootLang.lang.thongbaochung.khongcodulieu}</Text>
                </View>
            </View>
        )
    }

    _addDate = () => {
        var { ngayThem } = this.state;
        Utils.goscreen(this, "Modal_CalendarPickerSingle", {
            date: ngayThem,
            setDate: this._setDate
        })
    }
    _setDate = (date) => {
        this.setState({ ngayThem: date }, () => { })
    }

    onPressChiTietGiaiTrinh = () => {
        Utils.goscreen(this, 'sc_ChiTietGiaiTrinh', { deeplink: true })
    }

    DeleteItem = async (id, listRef, indexRefopen) => {
        Utils.showMsgBoxYesNo(this, RootLang.lang.thongbaochung.thongbao, RootLang.lang.thongbaochung.banmuonxoadonnay, RootLang.lang.thongbaochung.xacnhan, RootLang.lang.thongbaochung.thoat, async () => {
            const res = await HuyGiaiTrinh(id);
            if (res.status == 1) {
                UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.thongbaochung.thuchienthanhcong, 1)
                this._getDSGiaiTrinh();
                listRef[indexRefopen].close()
            } else {
                UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.thuchienthatbai, 2)
            }
        })

    }

    renderItemDonGiaiTrinh(item, index) {
        let { listGiaiTrinh, listRef, indexRefopen } = this.state;
        const thang = moment(item.ThoiGian).format('MM/YYYY');
        let showThang = false;
        if (item.ThoiGian && this.Month != thang) {
            showThang = true;
            this.Month = thang;
        }
        let checkBot = index == listGiaiTrinh.length - 1 || moment(item.ThoiGian).format('YYYY-MM') != moment(listGiaiTrinh[index + 1].ThoiGian).format('YYYY-MM') ? true : false
        let isLast = index == listGiaiTrinh.length - 1 ? true : false
        const { HoTen = '', ChucDanh = '' } = this.props.ttUser
        const rightButtons = [
            <TouchableHighlight>
                <View
                    style={{
                        // backgroundColor: 'red'
                    }}
                >
                    <TouchableOpacity
                        activeOpacity={0.5}
                        style={[styles.backRightBtnLeft, { height: listGiaiTrinh.length == 1 ? nHeight(7) : '100%' }]}
                        onPress={() => (this.DeleteItem(item.RowID, listRef, indexRefopen))}
                    >
                        <Text style={{ color: '#FFF', fontSize: sizes.sText14 }}>{RootLang.lang.thongbaochung.xoa}</Text>
                    </TouchableOpacity>
                </View>
            </TouchableHighlight>

        ];
        return (
            <View>
                {showThang == true ?
                    <Text style={[{ fontSize: reText(14), color: colors.colorTitleJee, marginTop: index == 0 ? 0 : 20, marginHorizontal: 20, marginBottom: 5 }]}>
                        {RootLang.lang.common.thang + " " + thang}
                    </Text> : null}
                <Swipeable
                    onSwipeStart={() => {
                        // alert(index + "-" + indexRefopen);
                        if (indexRefopen >= 0 && listRef[indexRefopen]) {
                            listRef[indexRefopen].close();
                        }
                        this.setState({ indexRefopen: index })

                    }}

                    disable={item.Approved == true || item.Approved == false ? true : false}
                    onRef={
                        ref => {
                            listRef[index] = ref;
                            this.setState({ listRef: listRef }, () => {
                                // Utils.nlog("ref-------list", this.state.listRef);
                            })
                        }
                    } rightButtons={rightButtons}
                >
                    <ItemGTDanhSach
                        lengthGT={listGiaiTrinh.length}
                        showThang={showThang}
                        checkBot={checkBot}
                        item={item}
                        index={index}
                        isLast={isLast}
                        name={HoTen}
                        nhanVien={ChucDanh}
                        onPress={() => {
                            item.NgayGui == null ?
                                Utils.goscreen(this, "sc_EditGiaiTrinh", { date: item.ThoiGian, callBack: this._callBackReloadData, close: true }) :
                                Utils.goscreen(this, 'sc_ChiTietGiaiTrinh', {
                                    RowID: item.RowID, isGoBak: true, deeplink: true
                                })
                        }}
                    />
                </Swipeable>
            </View>
        )
    }

    _callBackReloadData = () => {
        this._getDSGiaiTrinh()
    }

    _goScreenEdit = () => {
        Utils.goscreen(this, "sc_EditGiaiTrinh", { callBack: this._callBackReloadData });
    }
    render() {
        var { listGiaiTrinh, isBack, checkEmpty } = this.state;
        return (
            <View style={nstyles.ncontainer}>
                <HeaderAnimationJee onPressLeft={() => { isBack ? Utils.goback(this, null) : Utils.goscreen(this, 'sw_HomePage') }} nthis={this} title={RootLang.lang.scgiaitrinhchamcong.title} />
                <View style={{ flex: 1, backgroundColor: colors.backgroudJeeHR }}>
                    <FlatList
                        style={{}}
                        data={listGiaiTrinh}
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                        onEndReached={this.loadMoreData}
                        renderItem={({ item, index }) => this.renderItemDonGiaiTrinh(item, index)}
                        keyExtractor={(item, index) => index.toString()}
                        ListEmptyComponent={checkEmpty ? this.renderListEmpty : null}
                    />
                </View>
                <View style={{
                    backgroundColor: colors.backgroudJeeHR, position: 'absolute', bottom: 0, left: 0, paddingBottom: 15 + paddingBotX,
                    margin: 0, width: Width(100), paddingTop: 15
                }}>
                    <TouchableOpacity onPress={this._goScreenEdit} style={styles.create} >
                        <Text style={{ fontSize: reText(14), color: colors.greenButtonJeeHR, fontWeight: 'bold' }}> {RootLang.lang.scgiaitrinhchamcong.themdongiaitrinh} </Text>
                    </TouchableOpacity>
                </View>
                <IsLoading ref={this.refLoading} />
            </View >
        )
    }
}
const styles = StyleSheet.create({
    backRightBtnLeft: {
        ...nstyles.nmiddle,
        backgroundColor: '#FF453B',
        width: 60,
        height: '100%',
        borderTopRightRadius: 10, borderBottomRightRadius: 10
    },
    rowBack: {
        flex: 1,
        ...nstyles.nrow,
        justifyContent: 'flex-end',
        marginRight: 15,
        // marginTop: 8
    },
    create: {
        borderRadius: 10, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', paddingVertical: 15,
        borderColor: colors.black_20, marginHorizontal: 10,
        backgroundColor: colors.white, width: Width(95)
    }
})
const mapStateToProps = state => ({
    ttUser: state.stateUser.ttUser,
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(GTChamCong, mapStateToProps, true)

