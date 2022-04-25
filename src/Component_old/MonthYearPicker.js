// import Picker from 'react-native-wheel-picker'
import Picker from '@gregfrench/react-native-wheel-picker'
// import {Picker} from '@react-native-community/picker';
import moment from 'moment'
import React, { Component } from 'react'
import { Animated, BackHandler, Platform, Text, View } from 'react-native'
import { RootLang } from '../app/data/locales'
import Utils from '../app/Utils'
import ButtonCom from '../components/Button/ButtonCom'
import { colors, nstyles } from '../styles'
import { Height, Width } from '../styles/styles'
var PickerItem = Picker.Item;

class MonthYearPicker extends Component {
    constructor(props) {
        super(props)
        var currentYear = new Date().getFullYear()
        var currentMonth = new Date().getMonth()
        var years = [], months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        var startYear = 1980;
        for (var i = currentYear; i >= startYear; i--) {
            years.push(currentYear--);
        }
        this._setMonthYear = Utils.ngetParam(this, '_setMonthYear', () => { })
        this.MonthYear = Utils.ngetParam(this, 'MonthYear')
        let month = currentMonth, year = currentYear
        if (this.MonthYear != undefined) {
            month = moment(this.MonthYear, 'YYYY-MM-DD').format('MM')
            year = moment(this.MonthYear, 'YYYY-MM-DD').format('YYYY')
        }

        this.state = {
            opacity: new Animated.Value(0),
            selectedMonth: this.MonthYear != undefined ? Number.parseInt(month) - 1 : currentMonth,
            selectedYear: this.MonthYear != undefined ? years.findIndex(y => y === Number.parseInt(year)) : 0,
            itemListMonth: months,
            itemListYear: years.sort((a, b) => a < b),
            valueMonth: month,
            valueYear: year
        }
    }
    selectMonthYear = async () => {
        const { itemListMonth, itemListYear, selectedMonth, selectedYear } = this.state;
        var str = itemListYear[selectedYear].toString() + '-' + itemListMonth[selectedMonth].toString()
        await this._setMonthYear(str)
        this._endAnimation(0)
        Utils.goback(this);
    }

    onPickerSelectMonth(index) {
        this.setState({
            selectedMonth: index,
        })
    }
    onPickerSelectYear(index) {
        this.setState({
            selectedYear: index,
        })
    }
    goback = () => {
        // const { date } = this.state;
        // await this._setDate(date)
        this._endAnimation(0)
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
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this._backHandlerButton)
        this._startAnimation(0.8)
    }
    componentWillUnmount() {
        this.backHandler.remove()
    }
    _backHandlerButton = () => {
        this.goback()
        return true
    }

    render() {
        const { opacity, selectedMonth, selectedYear, itemListMonth, itemListYear } = this.state;
        const { nrow, nmiddle } = nstyles.nstyles
        return (
            <View style={[nstyles.nstyles.ncontainer, { backgroundColor: `transparent`, justifyContent: 'flex-end' }]}>
                <Animated.View onTouchEnd={this._goback} style={{
                    position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
                    backgroundColor: colors.backgroundModal, alignItems: 'flex-end',
                    opacity
                }} />
                <View style={{
                    backgroundColor: colors.white,
                    borderTopLeftRadius: 20, borderTopRightRadius: 20, zIndex: 1,
                    paddingVertical: 20, paddingHorizontal: 10, maxHeight: Height(50), flex: 1
                }}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        borderBottomWidth: 0.5,
                        paddingBottom: 10,
                        borderBottomColor: colors.brownGreyTwo,
                        marginHorizontal: 10
                    }}>
                        <Text style={{ flex: 1, textAlign: 'center', fontSize: 16 }}>{RootLang.lang.common.thang}</Text>
                        <Text style={{ flex: 1, textAlign: 'center', fontSize: 16 }}>{RootLang.lang.common.nam}</Text>
                    </View>
                    <View
                        style={{
                            alignSelf: 'center',
                            height: Platform.OS == 'android' ? 42 : 50,
                            width: Width(90),
                            marginTop: Platform.OS == 'android' ? 87 : 93,
                            borderWidth: 1,
                            borderColor: 'white',
                            backgroundColor: parseInt(Platform.Version) >= 14 && Platform.OS == "ios" ? null : colors.borderGray
                            // marginHorizontal: Platform.OS == 'android' ? 50 : 0
                        }} />
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        marginHorizontal: 10,
                        position: 'absolute',
                        top: 60,
                        left: 10,
                    }}>
                        <Picker style={{ flex: 1, height: 200 }}
                            selectedValue={selectedMonth}
                            itemStyle={{ color: "black", fontSize: 24 }}
                            onValueChange={(index) => this.onPickerSelectMonth(index)}>
                            {itemListMonth.map((value, i) => (
                                <PickerItem label={value.toString()} value={i} key={"money" + value} color={'black'} />
                            ))}
                        </Picker>
                        <Picker style={{ flex: 1, height: 200 }}
                            selectedValue={selectedYear}
                            itemStyle={{ color: "black", fontSize: 24 }}
                            onValueChange={(index) => this.onPickerSelectYear(index)}>
                            {itemListYear.map((value, i) => (
                                <PickerItem label={value.toString()} value={i} key={"time" + value} color={'black'} />
                            ))}
                        </Picker>
                    </View>
                    <View style={[nrow, { marginHorizontal: 30, flex: 1, marginTop: 80 }]}>
                        <ButtonCom
                            text={RootLang.lang.common.huy}
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
                            text={RootLang.lang.common.chon}
                            style={{
                                backgroundColor: colors.colorButtonLeftJeeHR,
                                backgroundColor1: colors.colorButtomrightJeeHR,
                                color: colors.colorTextBack80,
                            }}
                            styleButton={{ flex: 1, marginLeft: 10 }}
                            txtStyle={{ color: colors.white }}
                            onPress={this.selectMonthYear}
                        />
                    </View>
                </View>
            </View>
        )
    }
}

// export default MonthYearPicker
const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(MonthYearPicker, mapStateToProps, true)
