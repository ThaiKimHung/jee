import React from 'react';
import {
    FlatList, Image, Modal, StyleSheet,
    Text, TouchableOpacity, View
} from 'react-native';
import Utils from '../app/Utils';
import { Images } from '../images';
import { colors } from '../styles/color';
import { sizes } from '../styles/size';
import { nColors, nstyles, nwidth } from '../styles/styles';

let widthItem = nwidth * 0.94;
if (widthItem > 560)
    widthItem = 560;
if (widthItem < 310)
    widthItem = 310;
widthItem = (widthItem - 16) / 7;


//styles màn hình popupMore
const stDatePick = StyleSheet.create({
    containMain: {
        justifyContent: 'center', alignItems: 'center',
        backgroundColor: '#EBEBEB', borderRadius: 5, shadowColor: "#000000",
        width: '94%',
        maxWidth: 560,
        minWidth: 310,
        shadowOpacity: 0.1, shadowRadius: 2, shadowOffset: {
            height: 2,
            width: 0
        }, elevation: 3,
        paddingBottom: 3
    },
    textNum: {
        fontSize: sizes.sText17,
        color: nColors.textMain,
        fontWeight: '500'
    },
    textDay: {
        fontSize: sizes.sText17,
        color: colors.brownishGrey,
        fontWeight: '600',
    },
    containerDate: {
        flex: 1,
        height: widthItem * (3 / 4),
        justifyContent: 'center',
        alignItems: 'center'
    },
    containerItem: {
        justifyContent: 'center',
        alignItems: 'center',
        width: widthItem,
        height: widthItem,
        marginRight: 2,
        marginBottom: 2,
        backgroundColor: 'white'
    },
    containeryear: {
        justifyContent: 'center',
        alignItems: 'center',
        height: widthItem,
        marginRight: 2,
        backgroundColor: 'white'
    },

    title: {
        color: 'white',
        fontSize: 19,
        fontWeight: '700'
    },
});


export default class DatePick extends React.PureComponent {
    constructor(props) {
        super(props);
        let dateNow = new Date();
        year = dateNow.getFullYear();
        month = dateNow.getMonth();
        date = dateNow.getDate();
        //--Load date default
        let ivalue = this.props.value;

        Utils.nlog("gia tri picker", ivalue)

        if (ivalue != undefined)
            ivalue = new Date(Date.parse(ivalue.toString()));
        defYear = year;
        defMonth = month;
        defDate = date;
        if (!isNaN(ivalue)) {
            defYear = ivalue.getFullYear();
            defMonth = ivalue.getMonth();
            defDate = ivalue.getDate();
        }
        //--
        language = this.props.language;
        // default language = en
        arrayDay = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
        arrayMonth = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        // language = vi
        if (language == 'vi') {
            arrayDay = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
            arrayMonth = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
                'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
        }
        this.state = {
            modalVisible: false,
            yearmodalVisible: true,
            month: defMonth,
            year: defYear,
            dataYears: [],
            dataDates: [],
            dateSelected: { date: defDate, month: defMonth, year: defYear },
            // dataSelecYear: { year: dataYear }
        };
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
        // this._onChangeMonth = this._onChangeMonth.bind();
    }

    componentWillUnmount() {
        this.loadDataYear();
        this._onChangeMonth(0);
    }

    loadDataYear = () => {
        var { year, dataYears } = this.state;
        let yearMin = 1970, yearMax = year + 30;
        for (let i = yearMin; i <= yearMax; i++) {
            dataYears.push(i);
        }
        this.setState({ dataYears });
    }

    _onChangeMonth = (val = 1) => {
        // -- render month and year --
        let iMonth = this.state.month;
        let iYear = this.state.year;
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
        // -- Lấy thứ của ngày 1 và thứ của ngáy Cuối tháng đang chọn
        let daysNow = dateTemp2.getDate();
        let dayonWeekEnd = dateTemp2.getDay() - 1;
        if (dayonWeekEnd == -1)
            dayonWeekEnd = 6;
        dateTemp2.setDate(1);
        let dayonWeekStart = dateTemp2.getDay() - 1;
        if (dayonWeekStart == -1)
            dayonWeekStart = 6;

        dataDatesTemp = [];
        // -- Xử lý add ngày của tháng đang chọn
        for (let i = 1; i <= daysNow; i++) {
            let idataTemp = { ngay: i, vitri: 0, thang: tempMonth, nam: tempYear };
            if (i == date && tempMonth == month && tempYear == year)
                idataTemp.ngayht = true;
            dataDatesTemp.push(idataTemp);
        }
        // add thêm ngày của tháng trước
        while (dayonWeekStart != 0) {
            // xử lý ngày hiện tại của nếu tháng chọn ở trước tháng hiện tại
            let kMonth = tempMonth - 1, kYear = tempYear;
            if (kMonth == -1) {
                kMonth = 11;
                kYear--;
            }
            let idataTemp = { ngay: days1, vitri: -1, thang: kMonth, nam: kYear };
            if (days1 == date && kMonth == month && kYear == year)
                idataTemp.ngayht = true;

            dataDatesTemp.unshift(idataTemp); //add Item Date
            days1--;
            dayonWeekStart--;
        }
        // add thêm ngày của tháng sau. Add đủ 42 item trong
        let temi = 1;
        while (dataDatesTemp.length < 42) {
            let kMonth = tempMonth + 1, kYear = tempYear;
            if (kMonth == 12) {
                kMonth = 0;
                kYear++;
            }
            let idataTemp = { ngay: temi, vitri: 1, thang: kMonth, nam: kYear };
            if (temi == date && kMonth == month && kYear == year)
                idataTemp.ngayht = true;

            dataDatesTemp.push(idataTemp);  //add Item Date
            temi++;
        }
        this.setState({ dataDates: dataDatesTemp, month: tempMonth, year: tempYear });
    }

    show() {
        this.setState({
            modalVisible: true
        });
    }
    yearShow = () => {
        this.setState({ yearmodalVisible: false });
    }
    yearhide = () => {
        this.setState({ yearmodalVisible: true });
    }

    hide() {
        this.setState({ modalVisible: false });
    }

    _selectedDay = (item, onValueChange = () => { }) => () => {
        dateTemp = item.ngay;
        monthTemp = item.thang;
        yearTemp = item.nam;
        this.setState({ dateSelected: { date: dateTemp, month: monthTemp, year: yearTemp } });
        onValueChange(new Date(yearTemp, monthTemp, dateTemp));
    }
    // _selectedyear = (item, onValueChangeYear = () => { }) => () => {
    //     yearTemp = item.nam;
    //     this.setState({ dateSelected: { year: yearTemp } });
    //     onValueChangeYear(new Date(yearTemp));
    // }

    render() {
        let { style = {}, onValueChange, format, value, disableDateOld = false, isVisible = false } = this.props;
        if (format == undefined) { // default
            format = 'll'; //en
            if (language == 'vi')
                format = 'DD/MM/YYYY'; //en
        }

        if (value != undefined)
            value = new Date(Date.parse(value.toString()));
        let kyear = this.state.dateSelected.year;
        let kmonth = this.state.dateSelected.month;
        let kdate = this.state.dateSelected.date;

        if (!isNaN(value)) {
            kyear = value.getFullYear();
            kmonth = value.getMonth();
            kdate = value.getDate();
        }
        return (
            <TouchableOpacity disabled={isVisible} style={!isVisible ? [{ flex: 1, justifyContent: 'center', alignItems: 'flex-start', }, { ...style }] : {}} onPress={this.show} >
                {
                    isVisible ? null :
                        <View style={[nstyles.nrow, { width: '100%', justifyContent: 'space-between' }]}>
                            <Text style={{ color: style.color, fontSize: style.fontSize, fontWeight: style.fontWeight, fontFamily: style.fontFamily ? style.fontFamily : 'Roboto-Medium' }}>
                                {Utils.formatDate(new Date(kyear, kmonth, kdate), format)}
                            </Text>
                            <Image source={Images.icCalendar} resizeMode='contain' style={[nstyles.nIcon13, { tintColor: colors.black }]} />
                        </View>
                }
                <Modal
                    animationType='fade'
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        //Utils.nlog('DatePick has been closed.');
                    }}>
                    <View style={{
                        justifyContent: 'center', alignItems: 'center', flex: 1
                    }}>
                        <View style={{
                            opacity: 0.7, position: 'absolute', left: 0, top: 0, bottom: 0, right: 0,
                            backgroundColor: 'black'
                        }} onTouchEnd={() => this.hide()} />
                        <View style={[stDatePick.containMain]}>
                            {/* Thang nam */}
                            <View style={[nstyles.nrow, {
                                justifyContent: 'space-between',
                                alignItems: 'center', backgroundColor: nColors.main2, width: '100%', height: 50,
                                paddingHorizontal: 10, borderTopLeftRadius: 5, borderTopRightRadius: 5
                            }]}>
                                <TouchableOpacity
                                    style={{ width: 30, height: 40, alignItems: 'flex-start', justifyContent: 'center' }}
                                    onPress={() => this._onChangeMonth(-1)}
                                >
                                    <Image style={nstyles.nIcon20} source={Images.btnPre} resizeMode="contain" />
                                </TouchableOpacity>
                                <View style={nstyles.nrow}>
                                    <Text style={stDatePick.title}>{arrayMonth[this.state.month]}</Text>
                                    <Text style={stDatePick.title}> - </Text>
                                    <TouchableOpacity onPress={this.yearShow} >
                                        <Text style={stDatePick.title}>{this.state.year}</Text>
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity
                                    onPress={() => this._onChangeMonth(1)}
                                    style={{ width: 30, height: 40, alignItems: 'flex-end', justifyContent: 'center' }}
                                >
                                    <Image style={nstyles.nIcon20} resizeMode="contain" source={Images.btnNext} />
                                </TouchableOpacity>
                            </View>

                            {/* Ngay trong tuan */}
                            <View style={[nstyles.nrow, { backgroundColor: '#EBEBEB', marginHorizontal: 2 }]}>
                                {
                                    arrayDay.map((item) =>
                                        <View key={item} style={stDatePick.containerDate}>
                                            <Text style={stDatePick.textDay}>{item}</Text>
                                        </View>)
                                }
                            </View>
                            <FlatList
                                data={this.state.dataDates}
                                extraData={this.state}
                                renderItem={({ item, index }) => <TouchableOpacity
                                    activeOpacity={0.9}
                                    onPressIn={this._selectedDay(item, onValueChange)}
                                    onPressOut={this.hide}
                                    disabled={disableDateOld && (item.ngay < date && item.thang == month && item.nam <= year || item.thang < month && item.nam <= year || item.nam < year)}
                                    style={[stDatePick.containerItem, {
                                        backgroundColor: item.ngayht ? nColors.main2 : 'white',
                                        borderWidth: this.state.dateSelected.date == item.ngay && this.state.dateSelected.month == item.thang &&
                                            this.state.dateSelected.year == item.nam ? 2 : 0
                                        , borderColor: nColors.main2,
                                        opacity: (disableDateOld && (item.ngay < date && item.thang == month && item.nam <= year
                                            || item.thang < month && item.nam <= year || item.nam < year)) ? 0.7 : 1
                                    }]}
                                >
                                    <Text style={[stDatePick.textNum, {
                                        color: item.ngayht ? colors.white :
                                            ((item.vitri != 0 || disableDateOld && (item.ngay < date && item.thang == month &&
                                                item.nam <= year || item.thang < month && item.nam <= year || item.nam < year)) ? colors.brownGreyTwo : colors.black)
                                    }]}>{item.ngay}</Text>
                                </TouchableOpacity>
                                }
                                scrollEnabled={false}
                                showsVerticalScrollIndicator={false}
                                keyExtractor={(item, index) => index.toString()}
                                numColumns={7}
                            />
                            {
                                this.state.yearmodalVisible ? null :
                                    <View style={{
                                        justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0
                                    }}  >
                                        <View style={{
                                            justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                            backgroundColor: colors.black, opacity: 0.5
                                        }} onTouchEnd={this.yearhide} />
                                        <View style={{ width: 100, height: 300, backgroundColor: colors.white, borderRadius: 6 }}>
                                            <FlatList
                                                data={this.state.dataYears}
                                                style={{ borderRadius: 6 }}
                                                extraData={this.state}
                                                renderItem={({ item, index }) => <TouchableOpacity
                                                    // onPressIn={this._selectedDay(item, onValueChange)}
                                                    // onPressOut={this.yearhide}
                                                    onPress={() => {
                                                        this.setState({ year: item, yearmodalVisible: true }, () => this._onChangeMonth(0));
                                                        // this._onChangeMonth(0, false)
                                                    }}
                                                    activeOpacity={0.9}
                                                    style={[stDatePick.containeryear, {
                                                        borderWidth: this.state.year == item ? 2 : 0.5,
                                                        borderColor: this.state.year == item ? nColors.main2 : colors.colorBrownLine, width: '100%'
                                                    }]}
                                                >
                                                    <Text style={[stDatePick.textNum]}>{item}</Text>
                                                </TouchableOpacity>
                                                }
                                                showsVerticalScrollIndicator={false}
                                                keyExtractor={(item, index) => index.toString()}
                                            />
                                        </View>
                                    </View>
                            }
                        </View>
                    </View>
                </Modal>
            </TouchableOpacity>
        );
    }
}