import { stubTrue } from 'lodash-es'
import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, ActivityIndicator, LayoutAnimation, Dimensions, Modal, TouchableWithoutFeedback } from 'react-native'
import Utils from '../../../app/Utils'
import ListEmpty from '../../../components/ListEmpty'
import { Images } from '../../../images'
import { colors } from '../../../styles'
import { Height, nHeight, nstyles, paddingBotX, Width } from '../../../styles/styles'
import { postCHDaTao, postCHThamGia } from '../../../apis/JeePlatform/API_JeeMeeting/apiQLCuocHop'
import LottieView from 'lottie-react-native';
import moment from 'moment'
import 'moment/locale/vi';
import { reText } from '../../../styles/size'
import IsLoading from '../../../components/IsLoading'
import HTML from 'react-native-render-html'
import { RootLang } from '../../../app/data/locales'
import UtilsApp from '../../../app/UtilsApp'

export class HopDaTao extends Component {
    constructor(props) {
        super(props)
        this.type = this.props.type //1 - Cuộc họp của tôi, 2 - Cuộc họp tôi tham gia
        // this.page = 1
        // this.AllPage = 1
        // this.pageSize = 10
        this.state = {
            listDate: [],
            refreshing: false,
            showload: false,
            showModal: false,

            typeHop: 0, //0-Tat ca, 1-Sắp/đang diễn ra , 2- Đã diễn ra, 3- đã đóng, 4 - Chờ cập nhật nội dung
            MonthCurrent: moment(new Date()).format('DD/MM/YYYY'), // tháng chọn hiển thị
            displayMonth: moment(new Date()).format('MM'),

            page: 1,
            AllPage: 1,
            pageSize: 10
        }
    }
    componentDidMount() {
        this.refIsLoading.show()
        this.loadDS().then(res => {
            if (res)
                this.refIsLoading.hide()
        })
    }

    _GetDataTuanFull = (date) => { // Hàm check date có thuộc khoảng thời gian không? và trả về khoảng tuần tương ứng (Bắt đầu từ thứ 2 - kt chủ nhật)
        let { MonthCurrent } = this.state
        //lấy ra ngày đầu tiên và cuối cùng
        let first = moment(MonthCurrent, 'DD/MM/YYYY').startOf('month').format('ddd').toString()
        let firstF = moment(MonthCurrent, 'DD/MM/YYYY').startOf('month').format('DD/MM/YYYY')
        let end = moment(MonthCurrent, 'DD/MM/YYYY').endOf('month').format('ddd').toString()
        let endF = moment(MonthCurrent, 'DD/MM/YYYY').endOf('month').format('DD/MM/YYYY')

        //Đếm số ngày để tròn 1 tuần
        let addF = 0
        let addE = 0
        switch (first) {
            case 'CN': addF = 6
                break
            case 'T7': addF = 5
                break
            case 'T6': addF = 4
                break
            case 'T5': addF = 3
                break
            case 'T4': addF = 2
                break
            case 'T3': addF = 1
                break
        }
        switch (end) {
            case 'T7': addE = 1
                break
            case 'T6': addE = 2
                break
            case 'T5': addE = 3
                break
            case 'T4': addE = 4
                break
            case 'T3': addE = 5
                break
            case 'T2': addE = 6
                break
        }

        //Lấy ra các full tuần của 1 tháng chọn trước
        let TuNgay = moment(firstF, 'DD/MM/YYYY').add(`-${addF}`, 'days').format("DD/MM/YYYY")
        let DenNgay = moment(endF, 'DD/MM/YYYY').add(`+${addE}`, 'days').format("DD/MM/YYYY")
        let TuNgayCopy = moment(firstF, 'DD/MM/YYYY').add(`-${addF + 1}`, 'days').format("DD/MM/YYYY")

        //tính các mốc tuần
        let tuan1 = moment(TuNgay, 'DD/MM/YYYY').add(+6, 'days').format('DD/MM/YYYY')
        let tuan2 = moment(tuan1, 'DD/MM/YYYY').add(+7, 'days').format('DD/MM/YYYY')
        let tuan3 = moment(tuan2, 'DD/MM/YYYY').add(+7, 'days').format('DD/MM/YYYY')
        let tuan4 = moment(tuan3, 'DD/MM/YYYY').add(+7, 'days').format('DD/MM/YYYY')
        let tuan5 = moment(tuan4, 'DD/MM/YYYY').add(+7, 'days').format('DD/MM/YYYY')
        let tuan6 = moment(tuan5, 'DD/MM/YYYY').add(+7, 'days').format('DD/MM/YYYY')
        // Utils.nlog("Tuần 1,2,3,4,5:", tuan1, tuan2, tuan3, tuan4, tuan5, tuan6)

        var dateCheck = moment(date, 'DD/MM/YYYY'),//check ngày này
            tuanF1 = moment(TuNgayCopy, 'DD/MM/YYYY'),
            tuanE1 = moment(tuan1, 'DD/MM/YYYY').add(+1, 'days'),
            tuanF2 = moment(tuan1, 'DD/MM/YYYY'),
            tuanE2 = moment(tuan2, 'DD/MM/YYYY').add(+1, 'days'),
            tuanF3 = moment(tuan2, 'DD/MM/YYYY'),
            tuanE3 = moment(tuan3, 'DD/MM/YYYY').add(+1, 'days'),
            tuanF4 = moment(tuan3, 'DD/MM/YYYY'),
            tuanE4 = moment(tuan4, 'DD/MM/YYYY').add(+1, 'days'),
            tuanF5 = moment(tuan4, 'DD/MM/YYYY'),
            tuanE5 = moment(tuan5, 'DD/MM/YYYY').add(+1, 'days'),
            tuanF6 = moment(tuan5, 'DD/MM/YYYY'),
            tuanE6 = moment(tuan6, 'DD/MM/YYYY').add(+1, 'days'),
            dateEnd = moment(DenNgay, 'DD/MM/YYYY')

        if (dateCheck.isBetween(tuanF1, tuanE1))
            return {
                "tuan": 1,
                "tungay": moment(tuanF1).add(1, 'days').format('DD/MM'),
                "denngay": moment(tuanF1).add(7, 'days').format('DD/MM')
            }

        if (dateCheck.isBetween(tuanF2, tuanE2))
            return {
                "tuan": 2,
                "tungay": moment(tuanF2).add(1, 'days').format('DD/MM'),
                "denngay": moment(tuanF2).add(7, 'days').format('DD/MM')
            }
        if (dateCheck.isBetween(tuanF3, tuanE3))
            return {
                "tuan": 3,
                "tungay": moment(tuanF3).add(1, 'days').format('DD/MM'),
                "denngay": moment(tuanF3).add(7, 'days').format('DD/MM')
            }
        if (dateCheck.isBetween(tuanF4, tuanE4))
            return {
                "tuan": 4,
                "tungay": moment(tuanF4).add(1, 'days').format('DD/MM'),
                "denngay": moment(tuanF4).add(7, 'days').format('DD/MM')
            }
        if (dateCheck.isBetween(tuanF5, tuanE5) && dateEnd.isBetween(tuanF5, tuanE5))
            return {
                "tuan": 5,
                "tungay": moment(tuanF5).add(1, 'days').format('DD/MM'),
                "denngay": moment(tuanF5).add(7, 'days').format('DD/MM')
            }
        if (dateCheck.isBetween(tuanF6, tuanE6) && dateEnd.isBetween(tuanF6, tuanE6))
            return {
                "tuan": 6,
                "tungay": moment(tuanF6).add(1, 'days').format('DD/MM'),
                "denngay": moment(tuanF6).add(7, 'days').format('DD/MM')
            }
        return {
            "tuan": 0,
            "tungay": "",
            "denngay": ""
        }
    }
    _handleCompareDate = (date1, date2, type) => { //type: 1-bigger, 2-less
        let monthDate1 = moment(date1, 'DD/MM').format('MM'), dayDate1 = moment(date1, 'DD/MM').format('DD'),
            monthDate2 = moment(date2, 'DD/MM').format('MM'), dayDate2 = moment(date2, 'DD/MM').format('DD');
        if (type == 1) {
            if (monthDate1 > monthDate2)
                return true
            else if (monthDate1 == monthDate2 && dayDate1 > dayDate2)
                return true
            else
                return false
        }
        if (type == 2) {
            if (monthDate1 < monthDate2)
                return true
            else if (monthDate1 == monthDate2 && dayDate1 < dayDate2)
                return true
            else
                return false
        }
    }
    _handleCompleteWeek = (date) => {
        const tempFirst = moment(date).day()
        let minusDay = 0
        switch (tempFirst) {  //Bắt đầu 0-CN, 1-T2,...
            case 0: minusDay = 0
                break
            case 6: minusDay = 1
                break
            case 5: minusDay = 2
                break
            case 4: minusDay = 3
                break
            case 3: minusDay = 4
                break
            case 2: minusDay = 5
                break
            case 1: minusDay = 6
                break
        }
        const tempFromDate = moment(date).add(minusDay, 'days').format('DD/MM')
        return { fromDate: moment(tempFromDate, 'DD/MM').add(-6, 'days').format('DD/MM'), toDate: tempFromDate }
    }
    _handleDevidedByWeek = async (list, data) => {
        let week = await this._handleCompleteWeek(list[0].BookingDate)
        let newList = []
        list.forEach((item, index) => {
            if (index == 0 && !data.some(x => x.fromDate == week.fromDate)) {
                newList.push(week, item)
            }
            else if (this._handleCompareDate(moment(item.BookingDate).format('DD/MM'), week.fromDate, 2)) {
                newList.push(this._handleCompleteWeek(item.BookingDate), item)
                week = this._handleCompleteWeek(item.BookingDate)
            }
            else
                newList.push(item)
        })
        return newList
    }
    chooseMonthYear = () => {
        var { MonthCurrent } = this.state//format sang 'YYYY-MM-DD' do mặc định Modal_MonthYearPicker
        Utils.goscreen(this.props.nthis, 'Modal_MonthYearPicker', { MonthYear: moment(MonthCurrent, 'DD/MM/YYYY').format('YYYY-MM-DD'), _setMonthYear: this._setMonthYear })
    }

    _setMonthYear = (date) => {
        this.setState({ MonthCurrent: moment(date, 'YYYY-MM').format('DD/MM/YYYY'), displayMonth: moment(date, 'YYYY-MM').format('MM') }, () => this.loadDS())
    }
    _handleAddMonth = (newList, oldList) => {
        let tempList = [], tempMonth = moment(newList[0]?.BookingDate).format('MM'), tempYear = moment(newList[0]?.BookingDate).format('YYYY')
        newList.forEach((item, index) => {
            if (index == 0 && !oldList.some(x => x.Thang == tempMonth && x.Nam == tempYear)) {
                tempList.push({ Thang: tempMonth, Nam: tempYear }, item)
            }
            else if (moment(item.BookingDate).format('MM') < tempMonth || moment(item.BookingDate).format('YYYY') < tempYear) {
                tempList.push({ Thang: moment(item.BookingDate).format('MM'), Nam: moment(item.BookingDate).format('YYYY') }, item)
                tempMonth = moment(item.BookingDate).format('MM')
                tempYear = moment(item.BookingDate).format('YYYY')
            }
            else
                tempList.push(item)
        })
        return tempList
    }
    loadDS = async (page = this.state.page) => {
        let { listDate, typeHop, pageSize } = this.state
        const body = {
            "filter": {
                "status": typeHop
            },
            "paginator": {
                "page": page,
                "pageSize": pageSize
            },
            "sorting": {
                "column": "BookingDate",
                "direction": "desc"
            }
        }
        let res = ''
        if (this.type == 1)
            res = await postCHDaTao(body)
        else
            res = await postCHThamGia(body)
        if (res.status == 1) {
            // let arrayCus = []
            // if (res.data) {
            //     res.data.map(item => {
            //         if (this._GetDataTuanFull(moment(item.BookingDate).format('DD/MM/YYYY')).tuan != 0) {
            //             arrayCus.push({ ...item, check: false })
            //         }
            //     })
            // }
            // const temp = await this._handleDevidedByWeek(res.data, listDate
            // this.page = res.page.Page
            // this.AllPage = res.page.AllPage
            const temp = await this._handleAddMonth(res.data || [], page == 1 ? [] : this.state.listDate)
            if (page != 1)
                listDate = this.state.listDate.concat(temp)
            else
                listDate = temp;
            this.setState({ listDate: listDate, AllPage: res.page.AllPage, refreshing: false, showload: false })
        } else {
            UtilsApp.MessageShow(RootLang.lang.JeeMeeting.thongbao.thongbao, res?.error?.message || RootLang.lang.JeeRequest.thongbao.loitruyxuatdulieu, 2)
            this.setState({ listDate: [], showload: false, refreshing: false })
        }
        return true
    }
    _handleReloadData = async (page = this.state.page) => {
        let { typeHop, pageSize } = this.state
        const body = {
            "filter": {
                "status": typeHop
            },
            "paginator": {
                "page": page,
                "pageSize": pageSize
            },
            "sorting": {
                "column": "BookingDate",
                "direction": "desc"
            }
        }
        let res = ''
        if (this.type == 1)
            res = await postCHDaTao(body)
        else
            res = await postCHThamGia(body)
        if (res.status == 1) {
            const temp = await this._handleAddMonth(res.data || [], this.state.listDate)
            return temp
        }
        else {
            UtilsApp.MessageShow(RootLang.lang.JeeMeeting.thongbao, res?.error?.message || RootLang.lang.JeeMeeting.loitruyxuatdulieu, 2)
            return ''
        }
    }
    _handleReload = (type, index, item) => {//type: 1-xoá, 2-sửa, 3-thêm
        let { page, AllPage, listDate } = this.state
        if (type == 1) {
            if (page < AllPage) { //Xoá khi chưa load hết danh sách
                this.refIsLoading.show()
                listDate.splice(index, 1)
                this.setState({ listDate }, () => this._handleReloadData().then((res) => {
                    if (res) {
                        listDate.push(res[res.length - 1])
                        this.setState({ listDate })
                    }
                }))
                this.refIsLoading.hide()
            } else {//Xoá khi load hết danh sách
                listDate.splice(index, 1)
                this.setState({ listDate })
            }
        }
        if (type == 2) {
            listDate[index] = item
            this.setState({ listDate })
        }
        if (type == 3) {
            this.FlatList.scrollToOffset({ animated: true, offset: 0 })
            this.setState({ page: 1 }, this.loadDS)
        }
    }
    show = (index) => {
        LayoutAnimation.easeInEaseOut()
        let { listDate } = this.state
        listDate[index].check = !listDate[index].check
        LayoutAnimation.easeInEaseOut()
        this.setState({ listDate })
    }
    _updatePosition(callback) {
        if (this._button && this._button.measure) {
            this._button.measure((fx, fy, width, height, px, py) => {
                this._buttonFrame = { x: px, y: py, w: width, h: height }
                callback && callback();
            });
        }
    }
    _onButtonPress = () => {
        this._updatePosition(() => {
            this.setState({ showModal: true });
        });
    };
    _calcPosition() {
        const positionStyle = { top: this._buttonFrame.y + this._buttonFrame.h };
        return positionStyle;
    }
    hideModal = () => {
        this.setState({ showModal: false })
    }
    _goscreen = (item, index) => {
        if (item.Status == -1)
            Utils.goscreen(this.props.nthis, 'Modal_TaoCuocHop', {
                rowid: item.RowID,
                index: index,
                item: item,
                reload: (type, index, item) => this._handleReload(type, index, item),
                type: 1
            })
        else
            Utils.goscreen(this.props.nthis, 'sc_ChiTietCuocHopTouch', {
                rowid: item.RowID,
                index: index,
                item: item,
                reload: (type, index, item) => this._handleReload(type, index, item)
            })
    }
    _renderModal = () => {
        const { showModal } = this.state;
        if (showModal && this._buttonFrame) {
            const frameStyle = this._calcPosition();
            const animationType = 'fade'
            return (
                <Modal
                    animationType={animationType}
                    visible={true}
                    transparent={true}
                    // onRequestClose={this.hideModal}
                    supportedOrientations={['portrait', 'portrait-upside-down', 'landscape', 'landscape-left', 'landscape-right']}
                    style={{ backgroundColor: 'blue' }}>
                    <TouchableWithoutFeedback disabled={!showModal} onPress={this.hideModal}>
                        <View >
                            <View style={[frameStyle, { height: Height(100), width: Width(100), alignItems: 'center' }]}>
                                {this._renderDropdown()}
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            );
        } else {
            return null
        }
    }
    _onLoadMore = () => {
        if (this.state.page < this.state.AllPage) {
            this.setState({ showload: true, page: this.state.page + 1 }, () => this.loadDS())
        }
    }
    _handleClick = (typeHop) => {
        this.FlatList.scrollToOffset({ animated: true, offset: 0 });
        this.setState({ typeHop: typeHop, showModal: false, page: 1, AllPage: 1 }, () => this.loadDS())
    }
    _renderDropdown = () => {
        return (
            <View
                style={{
                    height: Height(25), width: '90%', backgroundColor: colors.white, borderRadius: 5,
                    shadowColor: colors.black_10, shadowOffset: { width: 2, height: 2 }, shadowOpacity: 2, shadowRadius: 5, elevation: 10
                }}>
                {[0, 1, 2, 3, 4].map(item =>
                    <TouchableOpacity style={{ flex: 1, paddingHorizontal: 15, justifyContent: 'center', marginHorizontal: 12 }} onPress={() => this._handleClick(item)}>
                        <Text style={{ fontSize: reText(14), fontWeight: this.state.typeHop == item ? 'bold' : null, color: this.state.typeHop == item ? null : colors.colorNoteJee }}>
                            {item == 0 ? RootLang.lang.JeeMeeting.tatca : item == 1 ? RootLang.lang.JeeMeeting.sapdangdienra : item == 2 ? RootLang.lang.JeeMeeting.dadienra : item == 3 ? RootLang.lang.JeeMeeting.dadong : RootLang.lang.JeeMeeting.chocapnhatnoidung}
                        </Text>
                    </TouchableOpacity>
                )}
            </View >
        )
    }

    _renderDate = ({ item, index }) => {
        const typeColors = item.Status == 0 ? colors.checkGreen : item.Status == 1 ? colors.checkAwait : item.Status == 2 ? '#828282' : '#2F80ED'
        let date = moment(item.BookingDate).format('DD/MM')
        let thu = moment(item.BookingDate).format('ddd').replace('T', 'Thứ ')
        let timeStart = moment(item.FromTime).format('HH:mm')
        let timeEnd = moment(item.FromTime).add(item.TimeLimit, 'minutes').format('HH:mm')
        return (
            <View key={index} style={{}}>
                <View >
                    {item.Thang ?
                        <View style={[styles.viewDate, { marginTop: index == 0 ? 10 : 20 }]}>
                            <Text style={{ fontSize: reText(14), color: colors.colorTitleJee }}>{'Tháng ' + item.Thang + '/' + item.Nam}</Text>
                        </View>
                        :
                        <TouchableOpacity onPress={() => this._goscreen(item, index)} style={[styles.viewDetailDate, { marginTop: 5 }]}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <View style={{ flexDirection: 'row', }}>
                                    <View style={{ width: Width(1), backgroundColor: typeColors, borderTopLeftRadius: 2, borderBottomLeftRadius: 2 }} />
                                    <View style={{ width: Width(15), justifyContent: 'center', alignItems: 'center', paddingVertical: 12 }}>
                                        <Text style={{ color: colors.blackJee, fontSize: reText(14) }}>{thu}</Text>
                                        <Text style={{ color: colors.blackJee, fontSize: reText(14), fontWeight: 'bold' }}>{date}</Text>
                                    </View>
                                </View>
                                <View style={{ height: '85%', width: 0.5, backgroundColor: colors.grayLine, alignSelf: 'center' }} />
                                <View style={[styles.viewCuocHop, { flex: 1, marginLeft: 10 }]}>
                                    <View style={{ flex: 1, }}>
                                        <Text style={{ color: colors.blackJee, fontSize: reText(14) }} numberOfLines={1}>{item.MeetingContent || '---'}</Text>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ color: colors.colorNoteJee, fontSize: reText(11), alignSelf: 'center', marginTop: 5, marginRight: 2 }}>{timeStart} - {timeEnd} </Text>
                                            {item.GoogleMeet ?
                                                <Image source={Images.ImageJee.icGoogleMeet} style={{ alignSelf: 'center', marginTop: 3 }} /> :
                                                item.ZoomMeeting ?
                                                    <Image source={Images.ImageJee.icZoom} style={{ alignSelf: 'center', marginTop: 3 }} /> : null}
                                        </View>
                                    </View>
                                    <View
                                        style={{ height: '100%', justifyContent: 'center', alignItems: 'center', marginRight: 10 }}>
                                        <Image source={Images.ImageJee.icArrowBack} style={[styles.imgDropdown, { width: Width(1.2), height: Width(2), alignSelf: 'center' }]}></Image>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    }
                </View>
            </View >
        )
    }

    _onRefresh = () => {
        this.setState({ refreshing: true, page: 1, AllPage: 1, listDate: [] }, () => this.loadDS());
    }
    render() {
        const { listDate, refreshing, showload, showModal, typeHop, displayMonth } = this.state
        const { nthis } = this.props
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: colors.backgroudJeeHR }]}>
                <TouchableOpacity style={[styles.viewHeader, {
                    marginTop: 10, borderRadius: 10, marginHorizontal: 12, marginBottom: 10
                }]} ref={button => this._button = button} onPress={() => this._onButtonPress()}>
                    <View style={styles.viewThang} >
                        {/* <Image source={Images.icSearch} style={[nstyles.nIcon20, styles.imgSearch]}></Image> */}
                        <View style={{ flexDirection: 'row' }}>
                            <Image source={Images.ImageJee.icTinhTrangJee} />
                            <Text style={{ fontSize: reText(14), color: colors.colorNoteJee, marginLeft: 5 }}>{RootLang.lang.JeeMeeting.tinhtrang}</Text>
                        </View>
                        <View
                            // { backgroundColor: typeHop == 0 ? colors.colorRoyal : typeHop == 1 ? '#149562' : typeHop == 2 ? '#EE9D25' : typeHop == 3 ? '#939497' : colors.waterBlue, }
                            style={[styles.btnDaDienRa]}>
                            <Text style={styles.txtBtn}>
                                {typeHop == 0 ? RootLang.lang.JeeMeeting.tatca : typeHop == 1 ? RootLang.lang.JeeMeeting.sapdangdienra : typeHop == 2 ? RootLang.lang.JeeMeeting.dadienra : typeHop == 3 ? RootLang.lang.JeeMeeting.dadong : RootLang.lang.JeeMeeting.chocapnhatnoidung}
                            </Text>
                            <Image source={Images.ImageJee.icDropdown} style={{ tintColor: colors.blackJee, width: Width(2), height: Width(2) }}></Image>
                        </View>
                    </View>
                </TouchableOpacity>
                {
                    this._renderModal()
                }
                <FlatList
                    ref={ref => this.FlatList = ref}
                    data={listDate}
                    contentContainerStyle={{ paddingBottom: paddingBotX + 75 }}
                    renderItem={this._renderDate}
                    onRefresh={this._onRefresh}
                    refreshing={refreshing}
                    onEndReached={this._onLoadMore}
                    onEndReachedThreshold={0.1}
                    keyExtractor={(item, index) => index.toString()}
                    ListEmptyComponent={listDate.length == 0 ? <ListEmpty style={{ justifyContent: 'center', alignItems: 'center', }} textempty={'Không có dữ liệu'} /> : null}
                    ListFooterComponent={showload ? <ActivityIndicator size='small' style={{ marginVertical: 10 }} /> : null}
                />
                {
                    this.props.type == 1 ?
                        <TouchableOpacity onPress={() => Utils.goscreen(nthis, 'Modal_TaoCuocHop', { reload: (type) => this._handleReload(type) })} style={{ position: 'absolute', bottom: 10 + paddingBotX, right: 10, zIndex: 1, backgroundColor: colors.checkGreen, borderRadius: 9999, padding: 15 }}>
                            <Image source={Images.ImageJee.icAddgiaitrinh} style={{}}></Image>
                        </TouchableOpacity>
                        : null
                }
                <IsLoading ref={ref => this.refIsLoading = ref}></IsLoading>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    viewHeader: {
        backgroundColor: colors.white, marginTop: 2, paddingVertical: 12,
    },
    viewThang: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10
    },
    imgSearch: {
        marginRight: 10, tintColor: 'black'
    },
    txtThang: {
        fontSize: 16, fontWeight: '400', marginRight: 5
    },
    txtBtn: {
        fontSize: reText(14), color: colors.blackJee, marginRight: 5
    },
    btnDaDienRa: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', borderRadius: 7,
        paddingVertical: 5,
    },
    viewListDate: {
        flexDirection: 'row', alignItems: 'center'
    },
    viewGach: {
        flex: 1, borderColor: colors.colortext, borderWidth: 0.5
    },
    viewDate: {
        justifyContent: 'center', marginHorizontal: 22
    },
    viewDetailDate: {
        marginHorizontal: 12, backgroundColor: colors.white, borderRadius: 2
    },
    viewCuocHop: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: 5
    },
    viewThuThang: {
        width: Width(9), justifyContent: 'space-between', alignItems: 'center', borderRadius: 5, height: Height(6)
    },
    txtThu: {
        fontSize: reText(13)
    },
    txtNgay: {
        color: 'white', fontWeight: 'bold', fontSize: reText(10)
    },
    viewThu: {
        width: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white',
        borderTopStartRadius: 3, borderTopEndRadius: 3, paddingVertical: 2
    },
    viewNgay: {
        paddingVertical: 10
    },
    imgDropdown: {
        tintColor: colors.colorNoteJee
    }
})
export default HopDaTao
