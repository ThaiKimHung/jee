import dayjs from "dayjs";
import range from "lodash/range";
import moment from 'moment';
import React, { Component, useEffect, useState } from 'react';
import { Animated, Image, StyleSheet, Text, TouchableOpacity, View, BackHandler } from 'react-native';
import { RootLang } from '../app/data/locales';
import { nGlobalKeys } from '../app/keys/globalKey';
import Utils from '../app/Utils';
import { Images } from '../images';
import { colors, nstyles } from '../styles';
import ButtonCom from './Button/ButtonCom';

const Calanda = (props) => {
    const weekDaysVI = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]
    const weekDaysEN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const weekDays = Utils.getGlobal(nGlobalKeys.lang, 'vi') === 'vi' ? weekDaysVI : weekDaysEN
    const disable = Utils.ngetParam(props.nthis, "disable", false);
    const df = Utils.ngetParam(props.nthis, "date");
    const dm = Utils.ngetParam(props.nthis, "month");
    const dy = Utils.ngetParam(props.nthis, "years");
    const setTimeFC = Utils.ngetParam(props.nthis, "setTimeFC", () => { });
    const newDate = moment(new Date()).format('DD/MM/YYYY');
    const [dayObj, setDayObj] = df ? useState(dayjs(moment(df, "DD/MM/YYYY").format('MM/DD/YYYY'))) : useState(dayjs(moment(dm + '/' + dy, 'MM/YYYY')));
    const [dateF, SetdateF] = useState(df ? df : newDate);

    const thisYear = dayObj.year()
    const thisMonth = dayObj.month() // (January as 0, December as 11)
    const daysInMonth = dayObj.daysInMonth()

    const dayObjOf1 = dayjs(`${thisYear}-${thisMonth + 1}-1`)
    const weekDayOf1 = dayObjOf1.day() // (Sunday as 0, Saturday as 6)

    const dayObjOfLast = dayjs(`${thisYear}-${thisMonth + 1}-${daysInMonth}`)
    const weekDayOfLast = dayObjOfLast.day();

    const arrold = range(weekDayOf1).map(i => dayObjOf1.subtract(weekDayOf1 - i, "day").format('DD/MM/YYYY')
    );
    const arrdate = range(daysInMonth).map(i => moment(new Date(dayObj.format('YYYY'), dayObj.format('MM') - 1, i + 1)).format("DD/MM/YYYY")
    );
    const arrnext = range(6 - weekDayOfLast).map(i => dayObjOfLast.add(i + 1, "day").format("DD/MM/YYYY")
    );

    const date = [].concat(arrold, arrdate, arrnext);
    const num = range(Math.ceil(date.length / 7));
    const [opacity] = useState(new Animated.Value(0))

    const setDateChoose = (item) => {
        SetdateF(item);
    }

    const setStyle = (item) => {
        if (moment(item, 'DD/MM/YYYY').isSame(moment(dateF, "DD/MM/YYYY"))) {
            return { backgroundColor: colors.colorTabActiveJeeHR, borderRadius: 50, }
        }
    }
    const setStyleText = (item, isMonthFocus) => {
        if (moment(item, 'DD/MM/YYYY').isSame(moment(dateF, "DD/MM/YYYY"))) {
            return { color: 'white' }
        }
        return { color: 'black', opacity: isMonthFocus ? 1 : 0.35 }
    }

    const renderItemNum = (item, index) => {
        let tempDate = new Date(moment(item, 'DD/MM/YYYY').format('YYYY/MM/DD'));
        let isMonthFocus = tempDate.getMonth() == thisMonth;
        return (
            <View
                key={index}
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    paddingVertical: 5,
                }}>
                <TouchableOpacity
                    style={[setStyle(item), {
                        position: 'absolute',
                        top: 5, bottom: 5, left: 5, right: 5,
                        zIndex: 10,
                        // width: 40,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }]}
                    onPress={() =>
                        disable == true && isMonthFocus == false ? null :
                            setDateChoose(item)}>
                    <View>
                        <Text style={[setStyleText(item, isMonthFocus), {
                            fontSize: 16, fontWeight: 'bold',
                            textAlign: 'center', paddingRight: 3
                        }]}>
                            {
                                ` ${moment(item, 'DD/MM/YYYY').format('D')}`
                            }
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }


    const renderRow = (i, index) => {
        var arr = date.slice(i * 7, i * 7 + 7);
        return (<View
            key={index}
            style={{
                flexDirection: 'row',
                flex: 1, color: "green"
            }}>
            {
                arr.map(renderItemNum)
            }
        </View>)
    }
    const handlePrev = () => {
        setDayObj(dayObj.subtract(1, "month"))
    }

    const handleNext = () => {
        setDayObj(dayObj.add(1, "month"))
    }
    const _goback = () => {
        setTimeFC(dateF);
        endAnimation(0)
        Utils.goback(props.nthis);
    }
    const _gobackTemp = () => {
        endAnimation(0)
        Utils.goback(props.nthis);
    }
    const startAnimation = (value) => {
        setTimeout(() => {
            Animated.timing(opacity, {
                toValue: value,
                duration: 300
            }).start();
        }, 400);
    };

    const endAnimation = (value) => {
        setTimeout(() => {
            Animated.timing(opacity, {
                toValue: value,
                duration: 1
            }).start();
        }, 1);
    };
    const _backHandlerButton = () => {
        _goback()
        return true
    }
    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', _backHandlerButton)
        startAnimation(0.8)
        return () => {
            backHandler.remove()
        }
    }, [])
    const { nrow, nmiddle } = nstyles.nstyles
    return (
        <View style={[nstyles.nstyles.ncontainer, { backgroundColor: `transparent`, justifyContent: 'flex-end' }]}>
            <Animated.View onTouchEnd={_gobackTemp} style={{
                position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
                backgroundColor: colors.backgroundModal, alignItems: 'flex-end',
                opacity
            }} />
            <View style={{
                backgroundColor: colors.white,
                borderTopLeftRadius: 20, borderTopRightRadius: 20, zIndex: 1,
                paddingVertical: 20
            }}>
                <View >
                    <View style={{
                        paddingVertical: 10,
                        flexDirection: 'row',
                    }}>
                        <TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} onPress={disable ? null : handlePrev}>
                            <Image
                                source={Images.icCalandarLeft}
                                style={{ tintColor: colors.colorTabActiveJeeHR }}
                                resizeMode={'cover'}>
                            </Image>
                        </TouchableOpacity>
                        <View style={{
                            flex: 1, alignItems: 'center',
                        }} >
                            <Text style={{
                                color: colors.colorTabActiveJeeHR,
                                fontSize: 16, fontWeight: 'bold'
                            }} >{RootLang.lang.common.thang + " " + dayObj.format("MM/YYYY")}</Text>
                        </View>

                        <TouchableOpacity onPress={disable ? null : handleNext} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Image
                                source={Images.icCalandarRight}
                                style={{ tintColor: colors.colorTabActiveJeeHR }}
                                resizeMode={'cover'}>
                            </Image>
                        </TouchableOpacity>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        backgroundColor: colors.colorGrayBgr,
                        alignItems: 'center', justifyContent: 'center',
                        height: 50,

                    }}>
                        {

                            weekDays.map((item, index) =>
                            (<View key={index} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontSize: 16, color: colors.black_20 }}>{item}</Text>
                            </View>))
                        }
                    </View>

                    <View style={{ paddingVertical: 10, height: 350, backgroundColor: 'white', paddingBottom: 30 }}>
                        {
                            num.map((i, index) =>

                            (
                                <View key={i} style={{ flex: 1, width: '100%', }}  >
                                    {
                                        renderRow(i, index)
                                    }
                                </View>
                            )
                            )
                        }
                    </View>
                    <View style={[nrow, { marginHorizontal: 30, marginVertical: 30 }]}>
                        <ButtonCom
                            text={RootLang.lang.thongbaochung.thoat}
                            style={{
                                backgroundColor: colors.colorBtnGray,
                                backgroundColor1: colors.colorBtnGray,
                                color: colors.colorTextBack80,
                            }}
                            styleButton={{ flex: 1, marginRight: 10 }}
                            txtStyle={{ color: colors.black }}
                            onPress={_gobackTemp}
                        />
                        <ButtonCom
                            text={RootLang.lang.thongbaochung.xong}
                            style={{
                                backgroundColor: colors.colorButtonLeftJeeHR,
                                backgroundColor1: colors.colorButtomrightJeeHR,
                                color: colors.colorTextBack80,
                            }}
                            styleButton={{ flex: 1, marginLeft: 10 }}
                            txtStyle={{ color: colors.white }}
                            onPress={_goback}
                        />
                    </View>
                </View>
            </View>
        </View>
    );

}
const styleT = StyleSheet.create({
    stBtn: {
        flex: 1, marginHorizontal: 5,
        paddingVertical: 5, borderRadius: 5,
        // borderWidth: 1,
        alignItems: 'center'
    }
})

class CalandaSingalCom extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }
    render() {
        return (
            <View style={{ backgroundColor: 'transparent', flex: 1 }}>
                <Calanda nthis={this}
                />
            </View>
        );
    }
}
const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(CalandaSingalCom, mapStateToProps, true)
