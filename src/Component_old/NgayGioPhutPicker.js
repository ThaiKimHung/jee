// import Picker from 'react-native-wheel-picker'
import Picker from '@gregfrench/react-native-wheel-picker'
// import {Picker} from '@react-native-community/picker';

import React, { Component } from 'react'
import { Animated, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { RootLang } from '../app/data/locales'
import Utils from '../app/Utils'
import ButtonCom from '../components/Button/ButtonCom'
import { colors, nstyles, sizes } from '../styles'
import { Height, Width } from '../styles/styles'
var PickerItem = Picker.Item;

class NgayGioPhutPicker extends Component {
    constructor(props) {
        super(props)
        var currentHours = new Date().getHours();
        var currentMinutes = Math.floor(new Date().getMinutes() / 5) * 5;
        var Minutes = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"],
            Hours = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"];
        var DateTime = Utils.ngetParam(this, 'DateTime')

        this._setGoPhut = Utils.ngetParam(this, '_setGoPhut', () => { });
        this.TimeFrom = Utils.ngetParam(this, 'timeFrom')
        this.TimeTo = Utils.ngetParam(this, 'timeTo')
        this.isFrom = Utils.ngetParam(this, 'isFrom', true);
        this.isCheck = Utils.ngetParam(this, 'isCheck', false);

        if (this.isFrom == true) {
            if (this.TimeFrom) {
                var time = this.TimeFrom.split(":")
                currentHours = time[0]
                currentMinutes = time[1]
            } else {
                currentHours = new Date().getHours();
                currentMinutes = Math.floor(new Date().getMinutes() / 5) * 5;
            }

        } else {
            if (this.TimeTo) {
                var time = this.TimeTo.split(":")
                currentHours = time[0]
                currentMinutes = time[1]
            } else {
                currentHours = new Date().getHours();
                currentMinutes = Math.floor(new Date().getMinutes() / 5) * 5;
            }

        }
        this.state = {
            opacity: new Animated.Value(0),
            selectedHours: Number(currentHours),
            selectedMinutes: currentMinutes / 5,
            itemListMinutes: Minutes,
            itemListHours: Hours,
            selectTimeDate: 1,
            itemdateTime: DateTime,
            valueMinutes: currentMinutes,
            valueHours: currentHours,
            TimeFrom: this.TimeFrom,
            TimeTo: this.TimeTo,
            isFrom: this.isFrom,
            textTitleF: Utils.ngetParam(this, 'textTitleF', RootLang.lang.common.tugio),
            textTitleT: Utils.ngetParam(this, 'textTitleT', RootLang.lang.common.dengio)
        }
    }
    _setUpStart = (val) => {
        const { TimeTo, TimeFrom } = this.state;
        if (val == true) {
            if (TimeFrom) {
                let time2 = TimeFrom.split(":")
                this.setState({
                    selectedHours: Number(time2[0]),
                    selectedMinutes: time2[1] / 5,
                })
            } else {
                this.setState({
                    selectedHours: Number(new Date().getHours()),
                    selectedMinutes: Math.floor(new Date().getMinutes() / 5)
                })
            }

        } else {

            if (TimeTo) {
                let time3 = TimeTo.split(":")
                this.setState({
                    selectedHours: Number(time3[0]),
                    selectedMinutes: time3[1] / 5,
                })
            } else {
                this.setState({
                    selectedHours: Number(new Date().getHours()),
                    selectedMinutes: Math.floor(new Date().getMinutes() / 5)
                })
            }

        }

    }
    selectMonthYearUpdate = () => {
        var { itemListHours, itemListMinutes, selectedHours, selectedMinutes, isFrom, itemdateTime, selectTimeDate } = this.state;
        var str = itemdateTime[selectTimeDate].toString() + " " + itemListHours[selectedHours].toString() + ':' + itemListMinutes[selectedMinutes].toString();

        if (isFrom == true) {
            this.setState({ TimeFrom: str, })
        } else {
            this.setState({ TimeTo: str, })
        }

    }
    selectMonthYear = () => {
        var { itemListHours, itemListMinutes, selectedHours, selectedMinutes, isFrom, itemdateTime, selectTimeDate } = this.state;
        var str = itemdateTime[selectTimeDate].toString() + " " + itemListHours[selectedHours].toString() + ':' + itemListMinutes[selectedMinutes].toString();

        if (isFrom == true) {
            this.setState({ TimeFrom: str, isFrom: false }, () => this._setUpStart(false))
        } else {
            this.setState({ TimeTo: str, isFrom: true }, () => this._setUpStart(true))
        }

    }
    _Goback = async () => {
        const { TimeFrom,
            TimeTo } = this.state
        this._endAnimation(0)
        Utils.goback(this);
        await this._setGoPhut(TimeFrom, TimeTo);



    }
    onPickerSelectMonth(index) {
        this.setState({
            selectedMinutes: index,
        }, this.selectMonthYearUpdate)
    }
    onPickerSelectYear(index) {
        this.setState({
            selectedHours: index,
        }, this.selectMonthYearUpdate)
    }

    onPickerSelectTimeDate(index) {

        this.setState({
            selectTimeDate: index
        }, this.selectMonthYearUpdate)
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
            valueMinutes,
            valueHours,
            TimeFrom,
            TimeTo,
            isFrom,
            textTitleF,
            textTitleT, itemdateTime, selectTimeDate } = this.state;
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
                                onPress={() => this.setState({ isFrom: true }, () => this._setUpStart(true))}
                                style={[styleT.stBtn, {
                                }]}>
                                <Text style={{
                                    color: isFrom == true ? colors.colorTabActive : colors.textblack,
                                    fontSize: sizes.sizes.sText12, lineHeight: sizes.sizes.sText16
                                }}>{textTitleF}</Text>
                                <Text style={{
                                    color: isFrom == true ? colors.colorTabActive : colors.textblack,
                                    fontSize: sizes.sizes.sText16, lineHeight: sizes.sizes.sText21
                                }}>{TimeFrom ? TimeFrom : `_`}</Text>
                            </TouchableOpacity>
                            <View style={{ height: 20, backgroundColor: colors.colorGrayLight, width: 1 }}></View>
                            <TouchableOpacity
                                onPress={() => this.setState({ isFrom: false }, () => this._setUpStart(false))}
                                style={[styleT.stBtn, {
                                }]}>
                                <Text style={{
                                    color: isFrom == false ? colors.colorTabActive : colors.textblack,
                                    fontSize: sizes.sizes.sText12, lineHeight: sizes.sizes.sText16
                                }}>{textTitleT}</Text>
                                <Text style={{
                                    color: isFrom == false ? colors.colorTabActive : colors.textblack,
                                    fontSize: sizes.sizes.sText16, lineHeight: sizes.sizes.sText21
                                }}>{TimeTo ? TimeTo : `_`}</Text>

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
                                    <PickerItem label={value.toString()}
                                        value={i} key={"time" + value} color={'black'} />
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
                            text={RootLang.lang.common.huy}
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
                            text={!TimeFrom || !TimeTo ? RootLang.lang.common.chon : RootLang.lang.common.xong}
                            style={{
                                backgroundColor: colors.colorButtomleft,
                                backgroundColor1: colors.colorButtomright,
                                color: colors.colorTextBack80,
                            }}
                            styleButton={{ flex: 1, marginLeft: 10 }}
                            txtStyle={{ color: colors.white }}
                            onPress={!TimeFrom || !TimeTo ? this.selectMonthYear : this._Goback}
                        />
                    </View>
                </View>
            </View >
        )
    }
}
const styleT = StyleSheet.create({
    stBtn: {
        flex: 1, marginHorizontal: 5,
        paddingVertical: 5, borderRadius: 5,
        alignItems: 'center'
    }
})
// export default GioPhutPicker

const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(NgayGioPhutPicker, mapStateToProps, true)
