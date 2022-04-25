// import Picker from 'react-native-wheel-picker'
import Picker from '@gregfrench/react-native-wheel-picker'
// import {Picker} from '@react-native-community/picker';
import React, { Component } from 'react'
import { Animated, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Utils from '../app/Utils'
import ButtonCom from '../components/Button/ButtonCom'
import { colors, fonts, nstyles, sizes } from '../styles'
import { Height, Width } from '../styles/styles'
var PickerItem = Picker.Item;

export class NgayGioPhutPickerSingal extends Component {
    constructor(props) {
        super(props)
        var currentHours = new Date().getHours();
        var currentMinutes = Math.floor(new Date().getMinutes() / 5) * 5;
        var Minutes = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"],
            Hours = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"];
        var DateTime = Utils.ngetParam(this, 'DateTime')
        this._setGoPhut = Utils.ngetParam(this, '_setGoPhut', () => { });
        this.Time = Utils.ngetParam(this, 'Time')
        if (this.Time) {
            var time = this.Time.split(":")
            currentHours = time[0]
            currentMinutes = Math.floor(time[1] / 5) * 5;
        } else {
            currentHours = new Date().getHours();
            currentMinutes = Math.floor(new Date().getMinutes() / 5) * 5;
        }
        this.state = {
            opacity: new Animated.Value(0),
            selectedHours: Number(currentHours),
            selectedMinutes: currentMinutes / 5,
            selectTimeDate: 1,
            itemListMinutes: Minutes,
            itemListHours: Hours,
            itemdateTime: DateTime,
            valueMinutes: currentMinutes,
            valueHours: currentHours,
            Time: this.Time,
            textTitle: Utils.ngetParam(this, 'textTitle', "Chọn giờ")
        }
    }

    selectMonthYear = () => {
        var { itemListHours, itemListMinutes, selectedHours, selectedMinutes, isFrom, selectTimeDate, itemdateTime } = this.state;
        var str = itemdateTime[selectTimeDate]?.toString() + " " + itemListHours[selectedHours]?.toString() + ':' + itemListMinutes[selectedMinutes]?.toString();
        this.setState({ Time: str })

    }
    _Goback = async () => {
        const { Time } = this.state
        await this._setGoPhut(Time);
        this._endAnimation(0)
        Utils.goback(this);
    }

    onPickerSelectMonth(index) {
        this.setState({
            selectedMinutes: index,
        }, this.selectMonthYear)
    }
    onPickerSelectYear(index) {
        this.setState({
            selectedHours: index,
        }, this.selectMonthYear)
    }

    onPickerSelectTimeDate(index) {

        this.setState({
            selectTimeDate: index
        }, this.selectMonthYear)
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
        this._startAnimation(0.8)
    }

    render() {
        const { opacity,
            selectedHours,
            selectedMinutes,
            itemListMinutes,
            itemListHours,
            Time, textTitle, itemdateTime, selectTimeDate } = this.state;
        const { nrow, nmiddle } = nstyles.nstyles
        return (
            <View style={[nstyles.nstyles.ncontainer, { backgroundColor: `transparent`, justifyContent: 'flex-end' }]}>
                <Animated.View onTouchEnd={this.goback} style={{
                    position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
                    backgroundColor: colors.backgroundModal, alignItems: 'flex-end',
                    opacity
                }} />
                <View style={{
                    backgroundColor: colors.white, borderTopLeftRadius: 20,
                    borderTopRightRadius: 20, zIndex: 1, paddingBottom: 30
                }}>
                    <View style={{ width: Width(100), paddingHorizontal: 20, paddingVertical: 20 }}>
                        <View style={[nrow, { backgroundColor: colors.veryLightPinkTwo, paddingVertical: 12 }]}>
                            <TouchableOpacity
                                style={[styleT.stBtn, {
                                }]}>

                                <Text style={{
                                    color: Time ? colors.greenTab : colors.textblack,
                                    fontSize: sizes.sizes.sText12, lineHeight: sizes.sizes.sText16
                                }}>{textTitle ? textTitle : `Thời gian`}</Text>
                                <View style={{ flexDirection: "row" }}>

                                    <Text style={{
                                        color: Time ? colors.greenTab : colors.textblack, fontFamily: fonts.HelveticaBold, marginTop: 10,
                                        fontSize: sizes.sizes.sText16, lineHeight: sizes.sizes.sText22
                                    }}>{Time ? Time : `_`}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{
                        width: '100%', minHeight: Height(30)
                    }}>
                        <View
                            style={{
                                alignSelf: 'center',
                                height: Platform.OS == 'android' ? 35 : 48,
                                width: Width(95),
                                marginTop: Platform.OS == 'android' ? 82.5 : 85,
                                backgroundColor: parseInt(Platform.Version) >= 14 && Platform.OS == "ios" ? null : colors.borderGray,
                                borderWidth: 1,
                                borderColor: 'white',
                                // marginHorizontal: Platform.OS == 'android' ? 50 : 0
                            }} />
                        <View style={{
                            // backgroundColor: 'red',
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            alignItems: 'center',
                            marginHorizontal: 10,
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            // height: 200
                        }}>
                            <Picker style={{
                                flex: 1,
                                height: 200
                            }}
                                selectedValue={selectTimeDate}
                                itemStyle={{ color: "black", fontSize: 16 }}
                                onValueChange={(index) => this.onPickerSelectTimeDate(index)}>
                                {itemdateTime.map((value, i) => (
                                    <PickerItem label={value.toString()} value={i} key={"time" + value} color={'black'} />
                                ))}
                            </Picker>
                            <View style={{
                                width: 10, height: 200,
                                alignItems: 'center', justifyContent: 'center'
                            }}>
                                <Text >{':'}</Text>
                            </View>
                            <Picker style={{
                                flex: 1,
                                height: 200
                            }}
                                selectedValue={selectedHours}
                                itemStyle={{ color: "black", fontSize: 24 }}
                                onValueChange={(index) => this.onPickerSelectYear(index)}>
                                {itemListHours.map((value, i) => (
                                    <PickerItem label={value.toString()} value={i} key={"time" + value} color={'black'} />
                                ))}
                            </Picker>
                            <View style={{
                                width: 10, height: 200,
                                alignItems: 'center', justifyContent: 'center'
                            }}>
                                <Text >{':'}</Text>
                            </View>
                            <Picker style={{ flex: 1, height: 200 }}
                                selectedValue={selectedMinutes}
                                itemStyle={{ color: "black", fontSize: 24 }}
                                onValueChange={(index) => this.onPickerSelectMonth(index)}>
                                {itemListMinutes.map((value, i) => (
                                    <PickerItem label={value.toString()} value={i} key={"money" + value} color={'black'} />
                                ))}
                            </Picker>

                        </View>

                    </View>


                    <View style={[nrow, {
                        marginHorizontal: 30,
                        paddingVertical: 20,
                    }]}>
                        <ButtonCom
                            text={'Hủy'}
                            style={{
                                backgroundColor: colors.colorBtnGray,
                                backgroundColor1: colors.colorBtnGray,
                                color: colors.colorTextBack80,

                            }}
                            styleButton={{ flex: 1, marginRight: 10, }}
                            txtStyle={{ color: colors.black }}
                            onPress={this.goback}
                        />

                        <ButtonCom
                            text={'Xong'}
                            style={{
                                backgroundColor: colors.colorTabActive,
                                backgroundColor1: colors.colorTabActive,
                                color: colors.colorTextBack80,
                            }}
                            styleButton={{ flex: 1, marginLeft: 10 }}
                            txtStyle={{ color: colors.white }}
                            onPress={this._Goback}
                        />
                    </View>
                </View>
            </View>
        )
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
export default NgayGioPhutPickerSingal
