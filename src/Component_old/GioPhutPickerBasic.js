import Picker from '@gregfrench/react-native-wheel-picker'
import React, { Component } from 'react'
import { Animated, BackHandler, Platform, StyleSheet, Text, View } from 'react-native'
import { RootLang } from '../app/data/locales'
import Utils from '../app/Utils'
import ButtonCom from '../components/Button/ButtonCom'
import { colors, nstyles } from '../styles'
import { Height, Width } from '../styles/styles'
var PickerItem = Picker.Item;

class GioPhutPicker extends Component {
    constructor(props) {
        super(props)
        this._setGioPhut = Utils.ngetParam(this, '_setGioPhut', () => { });
        this.timeDefault = Utils.ngetParam(this, 'time');
        this.space5 = Utils.ngetParam(this, 'space5');
        var currentHours = new Date().getHours();
        var currentMinutes = Math.floor(new Date().getMinutes() / 5) * 5 >= 10 ? Math.floor(new Date().getMinutes() / 5) * 5 : '0' + Math.floor(new Date().getMinutes() / 5) * 5;
        var MinutesTemp = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"]
        var Hours = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"];
        var Minutes = this.space5 ? String(Array(60)).split(',').map(function (el, i) { return i < 10 ? '0' + i : '' + i }) : MinutesTemp;
        if (this.timeDefault) {
            const time = this.timeDefault.split(":")
            currentHours = time[0]
            currentMinutes = time[1]
        }
        this.state = {
            opacity: new Animated.Value(0),
            selectedHours: Number(currentHours),
            selectedMinutes: currentMinutes / 5,
            itemListMinutes: Minutes,
            itemListHours: Hours,
            valueMinutes: currentMinutes,
            valueHours: currentHours,
            time: this.timeDefault || (currentHours + ':' + currentMinutes)
        }
    }
    _callback = async () => {
        const { time } = this.state
        this._endAnimation(0)
        Utils.goback(this);
        await this._setGioPhut(time);
    }
    _format = (type) => { //type: 1-Time, 2-Hourse
        var { itemListHours, itemListMinutes, selectedHours, selectedMinutes } = this.state;
        selectedHours = selectedHours || 0
        selectedMinutes = selectedMinutes || 0
        const strTime = itemListHours[selectedHours].toString() + ':' + itemListMinutes[selectedMinutes].toString();
        this.setState({ time: strTime })
    }
    onPickerSelectMinute(index) {
        this.setState({ selectedMinutes: index }, this._format)
    }
    onPickerSelectHour(index) {
        this.setState({ selectedHours: index }, this._format)
    }

    _goback = () => {
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
        this.handlerBack = BackHandler.addEventListener('hardwareBackPress', this._handlerBackButton)
        this._startAnimation(0.8)
    }
    componentWillUnmount() {
        this.handlerBack.remove()
    }
    _handlerBackButton = () => {
        this._callback()
        return true
    }

    render() {
        const { opacity, selectedHours, selectedMinutes, itemListMinutes, itemListHours, time } = this.state;
        const { nrow } = nstyles.nstyles
        return (
            <View style={[nstyles.nstyles.ncontainer, { backgroundColor: `transparent`, justifyContent: 'flex-end' }]}>
                <Animated.View
                    onTouchEnd={this._goback}
                    style={{
                        position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
                        backgroundColor: colors.backgroundModal, alignItems: 'flex-end',
                        opacity
                    }}
                />
                <View style={{ backgroundColor: colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, zIndex: 1, paddingBottom: 30 }}>
                    <View style={{ height: Height(7), flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        {/* <Text style={{ marginRight: 20 }}>Chọn giờ: </Text> */}
                        <Text style={{ fontSize: 30 }}>{time}</Text>
                    </View>
                    <View style={{ width: '100%', minHeight: Height(25) }}>
                        <View
                            style={{
                                alignSelf: 'center',
                                height: Platform.OS == 'android' ? 35 : 48,
                                width: Width(95),
                                marginTop: Platform.OS == 'android' ? 82.5 : 85,
                                backgroundColor: parseInt(Platform.Version) >= 14 && Platform.OS == "ios" ? null : colors.borderGray,
                                borderWidth: 1,
                                borderColor: 'white',
                            }} />
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginHorizontal: 10, position: 'absolute', top: 0, left: 0, }}>
                            <Picker
                                style={{ flex: 1, height: 200 }}
                                selectedValue={selectedHours}
                                itemStyle={{ color: "black", fontSize: 24 }}
                                onValueChange={(index) => this.onPickerSelectHour(index)}>
                                {itemListHours.map((value, i) => (
                                    <PickerItem label={value.toString()}
                                        value={i} key={"time" + value} color={'black'} />
                                ))}
                            </Picker>
                            <View style={{ width: 10, height: 200, alignItems: 'center', justifyContent: 'center' }}>
                                <Text >{':'}</Text>
                            </View>
                            <Picker
                                style={{ flex: 1, height: 200 }}
                                selectedValue={selectedMinutes}
                                itemStyle={{ color: "black", fontSize: 24 }}
                                onValueChange={(index) => this.onPickerSelectMinute(index)}>
                                {itemListMinutes.map((value, i) => (
                                    <PickerItem label={value.toString()} value={i} key={"money" + value} color={'black'} />
                                ))}
                            </Picker>
                        </View>
                    </View>
                    <View style={[nrow, { marginHorizontal: 30, paddingVertical: 20, }]}>
                        <ButtonCom
                            text={RootLang.lang.common.huy}
                            style={{ backgroundColor: colors.colorBtnGray, backgroundColor1: colors.colorBtnGray, color: colors.colorTextBack80, }}
                            styleButton={{ flex: 1, marginRight: 10, }}
                            txtStyle={{ color: colors.black }}
                            onPress={this._goback} />
                        <ButtonCom
                            text={RootLang.lang.common.chon}
                            style={{ backgroundColor: colors.colorButtonLeftJeeHR, backgroundColor1: colors.colorButtomrightJeeHR, color: colors.colorTextBack80, }}
                            styleButton={{ flex: 1, marginLeft: 10 }}
                            txtStyle={{ color: colors.white }}
                            onPress={this._callback}
                        />
                    </View>
                </View>
            </View >
        )
    }
}
const styleT = StyleSheet.create({
    stBtn: {
        flex: 1, marginHorizontal: 5, paddingVertical: 5, borderRadius: 5, alignItems: 'center'
    }
})

const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(GioPhutPicker, mapStateToProps, true)
