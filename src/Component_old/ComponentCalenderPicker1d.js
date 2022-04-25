import React, { Component } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Utils from '../app/Utils';
import { colors, nstyles } from '../styles';

export default class ComponentCalenderPicker1d extends Component {
    constructor(props) {
        super(props)
        this._setDate = Utils.ngetParam(this, "setDate", () => { })
        this.state = {
            date: Utils.ngetParam(this, "date"),
            opacity: new Animated.Value(0),
        }
    }
    _onDayPress = (date) => {
        Utils.nlog("giA TRI DATE", date)
        this.setState({ date: date.dateString });
    }
    goback = async () => {
        const { date } = this.state;
        await this._setDate(date)
        Utils.goback(this);
    }

    _startAnimation = (value) => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: value,
                duration: 250
            }).start();
        }, 250);
    };

    componentDidMount() {
        this._startAnimation(0.4)
    }
    componentDidMount() {

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
                    bottom: 0, left: 0, right: 0, backgroundColor: 'rgb(17,17,17)', opacity
                }} />
                <View style={{
                    backgroundColor: colors.white,
                    borderTopLeftRadius: 20, borderTopRightRadius: 20, zIndex: 1,
                    paddingVertical: 20
                }}>

                    <Calendar
                        onDayPress={this._onDayPress}
                        markedDates={markedDates}
                        markingType={'period'}
                    />
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
