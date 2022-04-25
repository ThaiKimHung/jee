import moment from 'moment';
import React, { Component } from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import Utils from '../app/Utils';
import ButtonCom from '../components/Button/ButtonCom';
import { colors, nstyles } from '../styles';
import { sizes } from '../styles/size';
import { Width } from '../styles/styles';
import HeaderModal from './HeaderModal';

export default class CalendarPickerSingle extends Component {
    constructor(props) {
        super(props)
        this._setDate = Utils.ngetParam(this, "setDate", () => { })
        this.state = {
            date: Utils.ngetParam(this, "date"),
            opacity: new Animated.Value(0),
        }
        LocaleConfig.locales['vi'] = {
            monthNames: ['Tháng 1 /', 'Tháng 2 /', 'Tháng 3 /', 'Tháng 4 /', 'Tháng 5 /', 'Tháng 6 /', 'Tháng 7 /', 'Tháng 8 /', 'Tháng 9 /', 'Tháng 10 /', 'Tháng 11 /', 'Tháng 12 /'],
            monthNamesShort: ['Thg 1', 'Thg 2', 'Thg 3', 'Thg 4', 'Thg 5', 'Thg 6', 'Thg 7', 'Thg 8', 'Thg 9', 'Thg 10', 'Thg 11', 'Thg 12'],
            dayNames: ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ 6', 'Thứ bảy'],
            dayNamesShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
            today: 'Aujourd\'hui'
        };
        LocaleConfig.defaultLocale = 'vi';
    }
    _onDayPress = (date) => {
        Utils.nlog("giA TRI DATE", date)
        this.setState({ date: date.dateString });
    }
    goback = () => {
        // const { date } = this.state;
        // await this._setDate(date)
        this._endAnimation(0)
        Utils.goback(this);
    }

    selectDate = async () => {
        const { date } = this.state;
        await this._setDate(date)
        Utils.goback(this);
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
    }

    chooseMonthYear = () => {
        var { date } = this.state
        Utils.goscreen(this, 'Modal_MonthYearPicker', { MonthYear: date, _setMonthYear: this._setMonthYear })
    }

    _setMonthYear = (date) => {
        Utils.nlog('date', date)
        this.setState({ date: moment(date, 'YYYY-MM').format('YYYY-MM') })
    }
    render() {
        const { date, opacity } = this.state;
        var markedDates = {
            [date]: { startingDay: true, endingDay: true, color: colors.greenTab, textColor: 'white', },
            // [date]: { color: colors.colorButtonLeftJeeHR, textColor: 'red', endingDay: true },
        }
        const { nrow, nmiddle } = nstyles.nstyles
        return (

            <View style={[nstyles.nstyles.ncontainer, nstyles.nstyles.shadow,
            { backgroundColor: colors.backgroundModal, justifyContent: 'flex-end' }]}>
                <Animated.View onTouchEnd={this.goback} style={{
                    position: 'absolute', top: 0,
                    bottom: 0, left: 0, right: 0, backgroundColor: 'rgb(17,17,17)', opacity,

                }} />
                <View style={{
                    backgroundColor: colors.white,
                    borderTopLeftRadius: 20, borderTopRightRadius: 20, zIndex: 1,
                    paddingVertical: 20, paddingHorizontal: 10,
                }}>
                    <HeaderModal />
                    <Calendar
                        ref={ref => this.refCalender = ref}
                        onDayPress={this._onDayPress}
                        markedDates={markedDates}
                        markingType={'period'}
                        current={date}
                        theme={{
                            textDayFontSize: sizes.sText18,
                            todayTextColor: colors.colorOrange,
                            textDayHeaderFontSize: sizes.sText18,
                            dayTextColor: colors.black,
                            monthTextColor: colors.greenTab,
                            arrowColor: colors.greenTab,
                            textMonthFontWeight: 'bold',
                            'stylesheet.calendar.header': {
                                week: {
                                    // marginTop: 5,
                                    flexDirection: 'row',
                                    justifyContent: 'space-around',
                                    backgroundColor: '#F0F0F0',
                                    paddingTop: 10,
                                },
                            },
                        }}

                        onMonthChange={(month) => { this.setState({ date: month.dateString }) }}
                    />
                    <TouchableOpacity
                        onPress={() => this.chooseMonthYear()}
                        style={{
                            padding: 15,
                            width: Width(35),
                            position: 'absolute',
                            top: 30,
                            left: Width(32),
                            backgroundColor: 'transparent'
                        }} />
                    <View style={[nrow, { marginHorizontal: 30, marginVertical: 30 }]}>
                        <ButtonCom
                            text={'Hủy'}
                            style={{
                                backgroundColor: colors.colorBtnGray,
                                backgroundColor1: colors.colorBtnGray,
                                color: colors.colorTextBack80,
                            }}
                            styleButton={{ flex: 1, marginRight: 10 }}
                            txtStyle={{ color: colors.black }}
                            onPress={this.goback}
                        />
                        <ButtonCom
                            text={'Chọn'}
                            style={{
                                backgroundColor: colors.colorButtonLeftJeeHR,
                                backgroundColor1: colors.greenTab,
                                color: colors.colorTextBack80,
                            }}
                            styleButton={{ flex: 1, marginLeft: 10 }}
                            txtStyle={{ color: colors.white }}
                            onPress={this.selectDate}
                        />
                    </View>
                </View >
            </View >
        )
    }
}
const styleT = StyleSheet.create({
    stBtn: {
        flex: 1, marginHorizontal: 5,
        backgroundColor: colors.white, paddingVertical: 5, borderRadius: 5,
        borderWidth: 1,
        alignItems: 'center'
    }
})
