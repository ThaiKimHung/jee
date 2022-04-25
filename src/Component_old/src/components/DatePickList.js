import moment from 'moment';
import React, { Component, PureComponent } from 'react';
import {
    FlatList, Image,
    Platform, StyleSheet, Text, TouchableOpacity, View
} from 'react-native';
import Utils from '../../../../app/Utils';
import ButtonCom from '../../../../components/Button/ButtonCom';
import ListEmpty from '../../../../components/ListEmpty';
import { Images } from '../../../../images';
// import { getObjDateFormat } from '../app/data/dateLocales';
import { colors, nstyles } from '../../../../styles';
import { sizes } from '../../../../styles/size';
import { Height, nColors, nwidth, Width } from '../../../../styles/styles';
import HeaderModal from '../../HeaderModal';

const sizeContain = (nwidth - 20) / 7;
const sizeItemDay = nwidth / 7 * 0.70;
const sizeLeftRight = (sizeContain - sizeItemDay) / 2;
//styles màn hình popupMore
const reText = (val) => {
    return val;
}
const stDatePickList = StyleSheet.create({
    textNum: {
        fontSize: reText(14),
        fontWeight: '500',
        lineHeight: reText(18)

    },
    textThu: {
        fontSize: reText(12),
        fontWeight: 'bold',
        lineHeight: reText(16)
    },
    containerItem: {
        justifyContent: 'center',
        alignItems: 'center',
        width: sizeContain,
        backgroundColor: 'white',
        marginVertical: 2
    },
    containerItem2: {
        backgroundColor: colors.nocolor,
        width: sizeItemDay,
        height: sizeItemDay,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: sizeItemDay / 2
    },
    stTextCheckInOut: {
        fontSize: reText(12),
        color: nColors.main,
        lineHeight: reText(20),
        fontWeight: '500'
    },
    textDate: {
        fontSize: reText(14),
        lineHeight: reText(22),
        fontWeight: 'bold',
        color: nColors.main
    },
    btnmenuTour: {
        backgroundColor: colors.white,
        marginHorizontal: 6,
        borderRadius: 4,
        paddingHorizontal: 5,
        height: 50,
        justifyContent: 'center',
        paddingVertical: 0
    },
    txtmenuTour: {
        width: '100%',
        fontSize: reText(11),
        textAlign: 'center',
        color: colors.lightGreyBlue,
        fontWeight: 'bold',
        lineHeight: reText(14)
    },

});


function getObjDateFormat(lang) {
    switch (lang) {
        case 'en':
            return {
                d: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                ddd: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                M: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                MMM: ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December']
            }
        case 'vi':
            return {
                d: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
                ddd: ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'],
                M: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
                    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
                MMM: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
                    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12']
            }
        default:
            return {
                d: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                ddd: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                M: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                MMM: ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December']
            }
    }
}

class ItemNum extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let { dataItem, value1, value2, indexCha, item, _selectedDay } = this.props;
        // Utils.nlog('-- render ItemNum:' + dataItem.month + '-' + item.ngay);
        let isSelected = (value1.date == item.ngay && value1.month == item.thang &&
            value1.year == item.nam || value2.date == item.ngay && value2.month == item.thang &&
            value2.year == item.nam);
        let isDateChose = item.date >= value1.fullDate && item.date <= value2.fullDate && value2.date != -1
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={_selectedDay}
                disabled={item.disabled}
                style={stDatePickList.containerItem}
            >
                {
                    item.vitri < 0 ? null :
                        <View style={{ width: '100%', alignItems: 'center' }}>
                            <View style={[{
                                position: 'absolute', top: 0, left: -2, right: -2, height: '100%', opacity: 0.98,
                                backgroundColor: isDateChose ? '#b9d5ca' : colors.white
                            }, item.vitri == 1 || item.vitri == 3 || value1.date == item.ngay && value1.month == item.thang ? {
                                left: sizeLeftRight, borderBottomLeftRadius: sizeItemDay / 2 + 2,
                                borderTopLeftRadius: sizeItemDay / 2 + 2
                            } : {}, item.vitri == 2 || item.vitri == 3 || value2.date == item.ngay && value2.month == item.thang ? {
                                right: sizeLeftRight, borderBottomRightRadius: sizeItemDay / 2 + 2,
                                borderTopRightRadius: sizeItemDay / 2 + 2
                            } : {}]} />
                            <View style={[stDatePickList.containerItem2, isSelected ? { backgroundColor: colors.greenishTeal } : null]}>
                                <Text style={[stDatePickList.textNum,
                                isSelected ? { color: colors.white } :
                                    (item.ngayht ? { color: colors.orangeSix } : (isDateChose ? { color: colors.white } : { color: colors.black })), { opacity: item.disabled ? 0.3 : 1 }
                                ]}>{item.ngay}</Text>
                            </View>
                        </View>
                }
            </TouchableOpacity>
        );
    }
}

class ItemList extends Component {
    // -- Hàm này sẽ tối ưu không render lại quá nhiều đặc biệt là FlatList, List
    shouldComponentUpdate(nextProps) {
        if ((nextProps.dataItem.month == nextProps.value1.month && nextProps.dataItem.year == nextProps.value1.year
            || nextProps.dataItem.month == this.props.value1.month && nextProps.dataItem.year == this.props.value1.year)
            || (nextProps.dataItem.month == nextProps.value2.month && nextProps.dataItem.year == nextProps.value2.year
                || nextProps.dataItem.month == this.props.value2.month && nextProps.dataItem.year == this.props.value2.year)
            || (nextProps.value2.date != -1 && this.props.dataItem.fullDate > nextProps.value1.fullDate
                && this.props.dataItem.fullDate < nextProps.value2.fullDate)
            || (nextProps.value2.date == -1 && this.props.value2.fullDate != -1 && this.props.dataItem.fullDate > this.props.value1.fullDate
                && this.props.dataItem.fullDate < this.props.value2.fullDate) || this.props.dateType != nextProps.dateType
        ) {
            return true;
        }
        return false;
    }
    // --

    constructor(props) {
        super(props);

    }


    render() {
        let { dataItem, value1, value2, indexCha, onSelectedDay } = this.props;
        // Utils.nlog('-- render ItemList:' + dataItem.month + ' --');
        return (
            <View style={{
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
            }} >
                <View style={[nstyles.nrow, { justifyContent: 'center', alignItems: 'center' }]}>
                    <Image source={Images.icCalendarPicker} style={nstyles.nIcon14} resizeMode='contain' />
                    <Text style={{ textAlign: 'center', fontSize: reText(14), lineHeight: reText(20), marginVertical: 8, fontWeight: 'bold', marginLeft: 8, color: colors.greenishTeal }}>
                        {arrayMonth[dataItem.month]}, {dataItem.year}
                    </Text>
                </View>
                <View
                    style={[{ justifyContent: 'space-around', flexDirection: 'row', backgroundColor: '#f9f9f9', paddingHorizontal: 20, paddingVertical: 10 }]}
                >
                    {
                        this.props.arrayDay.map((item, index) =>
                            <View key={item} style={{ backgroundColor: '#f9f9f9', }}>
                                <Text style={[stDatePickList.textThu, { color: colors.textGray, backgroundColor: '#f9f9f9', }]}>{item}</Text>
                                {/* {
                                    index == 6 ? null :
                                        <View style={{ backgroundColor: '#f9f9f9', width: 0.8, height: 10, opacity: 0.3 }} />
                                } */}
                            </View>
                        )
                    }
                </View>
                <FlatList
                    style={{
                        backgroundColor: 'white', padding: 10, borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                    }}
                    data={dataItem.dataDates}
                    extraData={this.state}
                    renderItem={({ item, index }) =>
                        <ItemNum item={item} value1={value1} value2={value2}
                            _selectedDay={() => onSelectedDay(item, indexCha)} dataItem={dataItem} />
                    }
                    scrollEnabled={false}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item, index) => index.toString()
                    }
                    numColumns={7}
                />
            </View>
        );
    }
}
const defaultLoadMonth = Platform.OS == 'ios' ? 4 : 3;
export default class DatePickList extends PureComponent {
    constructor(props) {
        super(props);

        let defaultOptions = {
            // title: 'Chọn ngày',
            // textFrom: 'CHECK IN',
            textTo: 'CHECK OUT',
            mode: 0, //0 Hotels, 1 Flights, 2 - Tour
            disableDateOld: true,
            dateFrom: undefined,
            dateTo: undefined,
            dateType: -1
        };
        defaultOptions = { ...defaultOptions, ...props.options }
        this.optionsCus = defaultOptions;


        this.onValueChange = props.onValueChange;
        //--
        // default language = en
        this.lang = '';
        arrayMonth = [];
        arrayMonth2 = [];
        this.loadLanguage();
        // --Data main
        let dateNow = new Date();
        year = dateNow.getFullYear();
        month = dateNow.getMonth();
        date = dateNow.getDate();

        // //--
        this.sttempMonth = month - 1;
        this.sttempYear = year;
        indexFocus = 0;
        this.state = {
            modalVisible: false,
            showLimit: false,
            dataMonths: [], // default load 12 month next
            dateSelected: { date: -1, month: month, year: year, fullDate: dateNow },
            dateSelected2: { date: -1, month: month, year: year + 1, fullDate: dateNow },
            isFocus: 1, // 1: focus select date 1 | 2: forcus select date 2 | -1: no forcus
            dateType: this.optionsCus.dateType // dùng cho tour có 3 option
        }
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
    }

    async componentDidMount() {

        Utils.nlog('render DateList', this.optionsCus.dateFrom);
        //set default value
        var { dateSelected } = this.state;
        if (this.optionsCus.dateFrom) {
            Utils.nlog("gia tri đi mount 1", this.optionsCus.dateFrom)
            this.optionsCus.dateFrom = new Date(this.optionsCus.dateFrom);
            Utils.nlog("gia tri đi mount dateFrom 1", this.optionsCus.dateFrom.getDate());
            dateSelected = {
                date: this.optionsCus.dateFrom.getDate(),
                month: this.optionsCus.dateFrom.getMonth(),
                year: this.optionsCus.dateFrom.getFullYear(),
                fullDate: this.optionsCus.dateFrom
            }
            Utils.nlog("gia tri dateSelected2", dateSelected);
            await this.setState({
                dateSelected
            }, () => {
                Utils.nlog("vao set state dateSelected", this.state.dateSelected)
                this.loadListDate();
            })
            // this.onSelectedDay(this.optionsCus.dateFrom, 22);
        }

        if (this.optionsCus.dateFrom && this.optionsCus.dateTo) {
            Utils.nlog("vao ca 33333")
            this.optionsCus.dateFrom = new Date(this.optionsCus.dateFrom);
            this.optionsCus.dateTo = new Date(this.optionsCus.dateTo);
            this.setState({
                dateSelected: {
                    date: this.optionsCus.dateFrom.getDate(),
                    month: this.optionsCus.dateFrom.getMonth(),
                    year: this.optionsCus.dateFrom.getFullYear(),
                    fullDate: this.optionsCus.dateFrom
                },
                dateSelected2: {
                    date: this.optionsCus.dateTo.getDate(),
                    month: this.optionsCus.dateTo.getMonth(),
                    year: this.optionsCus.dateTo.getFullYear(),
                    fullDate: this.optionsCus.dateTo
                }
            }, this.loadListDate)
        }
        this.loadListDate();
        // setTimeout(() => {
        //     this.refFL.scrollToIndex({ animated: true, index: 1 });
        // }, 1000)

    }
    // RootLang
    loadLanguage = (first = false) => {
        // let language = RootLang._keys;
        // if (language == this.lang)
        //     return;
        // this.lang = language;
        let temp = getObjDateFormat('vi');
        this.arrayDay = temp.d;
        this.arrayDay2 = temp.ddd;
        arrayMonth = temp.M;
        arrayMonth2 = temp.MMM;
    }

    show() {
        // if (this.state.dataMonths.length != 0)
        //     this.setState({
        //         modalVisible: true
        //     });
        this.onClear();
        Utils.nlog('dataMonthsKKKKKKKKK:', this.state.dataMonths);
    }

    hide() {
        let tempData = this.state.dataMonths.slice(0, defaultLoadMonth);
        this.sttempMonth = tempData[defaultLoadMonth - 1].month;
        this.sttempYear = tempData[defaultLoadMonth - 1].year;;
        this.setState({ modalVisible: false, dataMonths: tempData });
    }


    loadListDate = (more = defaultLoadMonth) => {
        let arrayTemps = this.state.dataMonths.slice();
        // Utils.nlog("gia tri loadListDate111", arrayTemps);
        if (arrayTemps.length != 0 && Utils.datesDiff(arrayTemps[arrayTemps.length - 1].fullDate, new Date()) > 366)
            return;
        for (let i = 0; i < more + 1; i++) {

            // Utils.nlog("gia tri load---", i)
            let res = this._onChangeMonth(arrayTemps.length == 0 ? 0 : 1);
            // Utils.nlog("gia tri load---", res)
            // if(res)
            arrayTemps.push(res);
        }
        this.setState({ dataMonths: arrayTemps }, () => {
            // Utils.nlog("vao scrollto")
            setTimeout(() => {
                this.refFL.scrollToIndex({
                    animated: true,
                    index: 1,
                    // viewOffset: 1,
                    // viewPosition: 1
                });
            }, 1000);

        });
    }

    _onChangeMonth = (val = 1) => {
        // -- render month and year --
        let iMonth = this.sttempMonth;
        let iYear = this.sttempYear;
        iMonth += val;
        if (iMonth >= 12) {
            iYear++;
            iMonth = 0;
        }
        if (iMonth < 0) {
            iYear--;
            iMonth = 11;
        }
        // -- render Days --
        let tempMonth = iMonth, tempYear = iYear;
        let dateTemp = new Date(iYear, iMonth, 0);
        let days1 = dateTemp.getDate();
        iMonth++;
        if (iMonth == 12) {
            iMonth = 0;
            iYear = iYear + 1;
        }
        let dateTemp2 = new Date(iYear, iMonth, 0);
        // -- Lấy thứ của ngày 1 và thứ của ngày Cuối tháng đang chọn
        let daysNow = dateTemp2.getDate();
        let dayonWeekEnd = dateTemp2.getDay();
        // if (dayonWeekEnd == -1)
        //     dayonWeekEnd = 6;
        dateTemp2.setDate(1);
        let dayonWeekStart = dateTemp2.getDay();
        // if (dayonWeekStart == -1)
        //     dayonWeekStart = 6;

        let dataDatesTemp = [];
        // -- Xử lý add ngày của tháng đang chọn
        for (let i = 1; i <= daysNow; i++) {
            let dateTempNew = new Date(tempYear, tempMonth, i);
            let tempVitri = 0; // vi trí để hiện thị backgroud khi select. 0: vi tri giữa
            if (i == 1 || dateTempNew.getDay() == 0)
                tempVitri = 1;  // vi trí đầu
            if (i == daysNow || dateTempNew.getDay() == 6)
                tempVitri = tempVitri == 1 ? 3 : 2;  // vi trí cuối 
            let tempDisabled = false;
            //khoá dis
            // if (this.optionsCus.disableDateOld && dateTempNew < new Date(year, month, date))
            //     tempDisabled = true;
            let idataTemp = {
                ngay: i, vitri: tempVitri, thang: tempMonth, nam: tempYear,
                date: dateTempNew, disabled: tempDisabled
            };
            if (i == date && tempMonth == month && tempYear == year)
                idataTemp.ngayht = true;
            dataDatesTemp.push(idataTemp);
        }
        // add thêm ngày của tháng trước - add vào nhưng ẩn để ko bị bể giao diện
        while (dayonWeekStart != 0) {
            // xử lý ngày hiện tại của nếu tháng chọn ở trước tháng hiện tại
            let kMonth = tempMonth - 1, kYear = tempYear;
            if (kMonth == -1) {
                kMonth = 11;
                kYear--;
            }
            let idataTemp = { ngay: -1, vitri: -1, thang: -1, nam: -1, disabled: true };
            if (days1 == date && kMonth == month && kYear == year)
                idataTemp.ngayht = true;

            dataDatesTemp.unshift(idataTemp); //add Item Date
            days1--;
            dayonWeekStart--;
        }
        this.sttempMonth = tempMonth;
        this.sttempYear = tempYear;
        return { dataDates: dataDatesTemp, month: tempMonth, year: tempYear, fullDate: new Date(tempYear, tempMonth, 1) };
    }

    onSelectedDay = (item, index) => {
        Utils.nlog("vao set date remode")
        let tempFocus = this.state.isFocus;
        if (this.state.isFocus == -1 && this.optionsCus.textTo != null) {
            this.onClear();
            tempFocus = 1;
        }
        dateTemp = item.ngay;
        monthTemp = item.thang;
        yearTemp = item.nam;
        fullDate = item.date;
        if (tempFocus == 1)
            indexFocus = index;
        if (this.optionsCus.textTo == null) {
            // const { dateSelected2 = {} } = this.state
            // if (dateSelected2) {

            // }
            this.setState({ dateSelected: { date: dateTemp, month: monthTemp, year: yearTemp, fullDate } });

        }
        else {
            if (tempFocus == 1)
                this.setState({ dateSelected: { date: dateTemp, month: monthTemp, year: yearTemp, fullDate }, isFocus: 2 });
            if (tempFocus == 2) {
                let dateSelectedTemp = { date: dateTemp, month: monthTemp, year: yearTemp, fullDate };
                if (this.optionsCus.mode == 0 && Utils.datesDiff(this.state.dateSelected.fullDate, dateSelectedTemp.fullDate) > 30) {
                    this.setState({ showLimit: true });
                    return;
                }
                // Utils.nlog('aaaa', Utils.datesDiff(this.state.dateSelected.fullDate, dateSelectedTemp.fullDate));
                if (fullDate < this.state.dateSelected.fullDate) {
                    indexFocus = index;
                    dateSelectedTemp = { ...this.state.dateSelected };
                    this.setState({
                        dateSelected: { date: dateTemp, month: monthTemp, year: yearTemp, fullDate },
                        dateSelected2: dateSelectedTemp,
                        isFocus: -1
                    });
                }
                else
                    this.setState({ dateSelected2: dateSelectedTemp, isFocus: -1 });
                //---
            }
        }
    }


    onDone = () => {
        Utils.nlog("vao ham done")
        let tempdateFrom = '';
        if (this.state.dateSelected.date != -1)
            tempdateFrom = this.state.dateSelected.fullDate;
        let tempdateTo = '';
        if (this.state.dateSelected2.date != -1)
            tempdateTo = this.state.dateSelected2.fullDate;
        let temp = {
            dateType: this.state.dateType,
            dateFrom: tempdateFrom,
            dateTo: tempdateTo,
            thuFrom: this.arrayDay2[this.state.dateSelected.fullDate.getDay()],
            thuTo: this.arrayDay2[this.state.dateSelected2.fullDate.getDay()]
        };
        this.setState({ showLimit: false });
        this.onValueChange(temp);
        this.hide();
    }

    onClear = () => {
        Utils.nlog("vao ham onClear ,this.state.dateSelected", this.state.dateSelected)
        temp_dateSelected = this.state.dateSelected;
        temp_dateSelected.date = -1;
        temp_dateSelected.fullDate = '';

        temp_dateSelected2 = this.state.dateSelected2;
        temp_dateSelected2.date = -1;
        temp_dateSelected2.fullDate = '';
        this.setState({
            modalVisible: true,
            dateSelected: temp_dateSelected,
            dateSelected2: temp_dateSelected2,
            isFocus: 1 // 1: focus select date 1 | 2: forcus select date 2 | -1: no forcus
        });
        indexFocus = 0;
    }

    _onRefresh = () => {
        Utils.nlog("vao ham _onRefresh")
        this.setState({ refreshing: true });
        // this.getZoneList(search).then(this.setState({ refreshing: false }));
    }

    onRenerList = ({ item, index }) => {
        return <ItemList arrayDay={this.arrayDay} onSelectedDay={this.onSelectedDay} dateType={this.state.dateType} indexCha={index} value1={this.state.dateSelected}
            value2={this.state.dateSelected2} dataItem={item} />
    }

    changeDateType = (val) => () => {
        this.onClear();
        switch (val) {
            case 1:
                this.optionsCus.textTo = 'To';
                break;
            case 2:
                this.optionsCus.textTo = null;
                break;
            case 3:
                break;
        }
        this.setState({ dateType: val });
    }
    render() {
        this.loadLanguage();
        // Utils.nlog('-- render DatePickList --');
        if (this.props.options != undefined && this.state.dateType != 2)
            this.optionsCus.textTo = this.props.options.textTo;
        const { ncontainerX, nbody, nrow, ntitle, nIcon30, nIcon24 } = nstyles;
        //--mặc định mode = 0 là Hotels
        let titleModal = "titleModal", titleLeft = "titleLeft", titleRight = "titleLeft";
        if (this.optionsCus.mode == 1) { //mode = 1 là Flight
            titleLeft = "titleLeft";
            titleRight = "titleRight";
        }
        if (this.optionsCus.mode == 2) { //mode = 2 là Flight
            titleLeft = "titleLeft";
            titleRight = "titleRight";
            if (this.state.dateType == 2) {
                titleLeft = "beforedate";
            }
        }
        var H = Height(20);
        var isTimeFr = true;
        var startDate = "startDate";
        var endDate = "endDate";
        var { dateSelected, dateSelected2 } = this.state;
        // Utils.nlog("gia tri dateSelected aaaaaa", dateSelected)
        return (
            <View style={[nstyles.nstyles.ncontainer, nstyles.nstyles.shadow,
            { backgroundColor: colors.backgroundModal, justifyContent: 'flex-end' }]}>
                <View onTouchEnd={this.goback} style={{
                    position: 'absolute', top: 0,
                    bottom: 0, left: 0, right: 0, backgroundColor: 'rgb(17,17,17)'
                }} />
                <View style={{
                    backgroundColor: 'white',
                    borderTopLeftRadius: 20,
                    marginTop: 450,
                    // maxHeight: H,
                    // height: H,
                    borderTopRightRadius: 20, paddingBottom: 30,
                }}>
                    <HeaderModal />
                    {
                        this.optionsCus.mode == 1 ? null :
                            <View style={{ width: Width(100), paddingHorizontal: 20, paddingVertical: 20 }}>

                                <View style={[{ backgroundColor: colors.veryLightPinkTwo, paddingVertical: 12, flexDirection: 'row', }]}>
                                    <TouchableOpacity
                                        // onPress={() => this._ChangeRoot(true)}
                                        style={[styleT.stBtn, {
                                        }]}>
                                        <Text style={{
                                            color: isTimeFr == true ? colors.greenTab : colors.textblack,
                                            fontSize: sizes.sText12, lineHeight: sizes.sText16
                                        }}>{this.arrTitle ? this.arrTitle[0] : `Từ Ngày`}</Text>
                                        <Text style={{
                                            color: isTimeFr == true ? colors.greenTab : colors.textblack,
                                            fontSize: sizes.sText16, lineHeight: sizes.sText21
                                        }}>{dateSelected.fullDate ? moment(dateSelected.fullDate.toString()).format('DD/MM/YYYY') : `_`}</Text>
                                        {/* <Text>{`${startDate ? startDate : "_"}`}</Text> */}
                                    </TouchableOpacity>
                                    <View style={{ height: 20, backgroundColor: colors.colorGrayLight, width: 1 }}></View>
                                    <TouchableOpacity
                                        // onPress={() => this._ChangeRoot(false)}
                                        style={[styleT.stBtn, {
                                        }]}>
                                        <Text style={{
                                            color: isTimeFr == false ? colors.greenTab : colors.textblack,
                                            fontSize: sizes.sText12, lineHeight: sizes.sText16
                                        }}>{this.arrTitle ? this.arrTitle[1] : `Đến ngày`}</Text>
                                        <Text style={{
                                            color: isTimeFr == false ? colors.greenTab : colors.textblack,
                                            fontSize: sizes.sText16, lineHeight: sizes.sText21
                                        }}>{dateSelected2.fullDate ? moment(dateSelected2.fullDate.toString()).format('DD/MM/YYYY') : `_`}</Text>

                                    </TouchableOpacity>
                                </View>
                            </View>

                    }
                    <View style={{ height: 400 }}>
                        <FlatList
                            style={{ flex: 1 }}
                            // initialNumToRender={4}
                            ref={ref => this.refFL = ref}
                            onScrollToIndexFailed={() => { Utils.nlog("vao scroll false") }}
                            // initialScrollIndex={1}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{
                            }}
                            ListEmptyComponent={<ListEmpty
                                textempty={'...'} />
                            }
                            onEndReached={() => this.loadListDate(3)}
                            onEndReachedThreshold={0.2}
                            data={this.state.dataMonths}
                            renderItem={this.onRenerList}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                    {
                        this.state.dateType != 3 ? null :
                            <View style={[nstyles.position, { bottom: 0, backgroundColor: colors.black, opacity: 0.4 }]} />
                    }
                    <View style={[{ marginHorizontal: 30, marginVertical: 30, flexDirection: 'row', }]}>
                        <ButtonCom
                            text={'Hủy'}
                            style={{
                                backgroundColor: colors.colorBtnGray,
                                backgroundColor1: colors.colorBtnGray,
                                color: colors.colorTextBack80,
                            }}
                            styleButton={{ flex: 1, marginRight: 10 }}
                            txtStyle={{ color: colors.black }}
                            onPress={() => Utils.goback(this)}
                        />
                        <ButtonCom
                            text={'Xong'}
                            style={{
                                backgroundColor: colors.colorButtonLeftJeeHR,
                                backgroundColor1: colors.greenTab,
                                color: colors.colorTextBack80,
                            }}
                            styleButton={{ flex: 1, marginLeft: 10 }}
                            txtStyle={{ color: colors.white }}
                            onPress={() => Utils.goback(this)}
                        />
                    </View>
                </View>
            </View >

        );
    }
}
const styleT = StyleSheet.create({
    stBtn: {
        flex: 1, marginHorizontal: 5,
        paddingVertical: 5, borderRadius: 5,
        // borderWidth: 1,
        alignItems: 'center'
    }
})



