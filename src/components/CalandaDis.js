import dayjs from "dayjs";
import range from "lodash/range";
import moment from 'moment';
import React, { Component, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';
import { RootLang } from '../app/data/locales';
import { nGlobalKeys } from '../app/keys/globalKey';
import Utils from '../app/Utils';
import { Images } from '../images';
import { colors, nstyles } from '../styles';
import { sizes } from '../styles/size';
import { Width } from "../styles/styles";
import ButtonCom from './Button/ButtonCom';

const Calanda = (props) => {
    const weekDaysVI = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]
    const weekDaysEN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const weekDays = Utils.getGlobal(nGlobalKeys.lang, 'vi') === 'vi' ? weekDaysVI : weekDaysEN
    const df = Utils.ngetParam(props.nthis, "dateF");
    const dt = Utils.ngetParam(props.nthis, "dateT");
    const isf = Utils.ngetParam(props.nthis, "isTimeF");
    const setTimeFC = Utils.ngetParam(props.nthis, "setTimeFC", () => { });

    const [dayObj, setDayObj] = df ? useState(dayjs(moment(df, "DD/MM/YYYY").format('MM/DD/YYYY'))) : useState(dayjs());
    const [dateF, SetdateF] = useState(df ? df : '');
    const [dateT, SetdateT] = useState(dt ? dt : '');
    const [isFrom, setisFrom] = useState(isf != undefined ? isf : true);

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

    const setDateChoose = (item) => {
        if (isFrom) {
            if (dateT != '')
                SetdateT('');
            SetdateF(item);
            setisFrom(false);
        } else {
            if (moment(item, "DD/MM/YYYY").isBefore(moment(dateF, "DD/MM/YYYY"))) {
                let tempF = dateF;
                SetdateF(item);
                SetdateT(tempF);
                setisFrom(true);
            } else {
                SetdateT(item);
                setisFrom(true);
            }
        }
    }

    const setStyle = (item) => {
        if (moment(item, 'DD/MM/YYYY').isSame(moment(dateF, "DD/MM/YYYY")) || moment(item, 'DD/MM/YYYY').isSame(moment(dateT, "DD/MM/YYYY"))) {
            return { backgroundColor: colors.colorTabActiveJeeHR, borderRadius: 50, }
        }
        if (moment(item, 'DD/MM/YYYY').isBefore(moment(dateF, "DD/MM/YYYY")) || moment(item, 'DD/MM/YYYY').isAfter(moment(dateT, "DD/MM/YYYY"))) {
            // return { backgroundColor: 'white', }
        } else {
            if (dateF == '' || dateT == '') {
                // return { backgroundColor: 'white' }
            }
            // return { backgroundColor: colors.colorCalendar }
        }
    }
    const setStyleColor = (item) => {
        if (moment(item, 'DD/MM/YYYY').isSame(moment(dateF, "DD/MM/YYYY")) || moment(item, 'DD/MM/YYYY').isSame(moment(dateT, "DD/MM/YYYY"))) {
            // return { color: 'white' }
        }
        if (moment(item, 'DD/MM/YYYY').isBefore(moment(dateF, "DD/MM/YYYY")) || moment(item, 'DD/MM/YYYY').isAfter(moment(dateT, "DD/MM/YYYY"))) {
            return { color: 'black', }
        } else {
            if (dateF == '' || dateT == '') {
                return { color: 'black', }
            }
            return { color: "white" }
        }
    }

    const setStyleText = (item, isMonthFocus) => {
        let datenow = moment(new Date());
        if (moment(item, 'DD/MM/YYYY').isSame(datenow, 'date')) {
            return { color: colors.orange }
        }

        if (moment(item, 'DD/MM/YYYY').isSame(moment(dateF, "DD/MM/YYYY")) || moment(item, 'DD/MM/YYYY').isSame(moment(dateT, "DD/MM/YYYY"))) {
            return { color: 'white' }
        }
        if (moment(item, 'DD/MM/YYYY').isBefore(moment(dateF, "DD/MM/YYYY")) || moment(item, 'DD/MM/YYYY').isAfter(moment(dateT, "DD/MM/YYYY"))) {
            return { color: 'black', opacity: isMonthFocus ? 1 : 0.35 }
        } else {
            if (dateF == '' || dateT == '') {
                return { color: 'black', opacity: isMonthFocus ? 1 : 0.35 }
            }
            // return { color: 'white' }
        }
    }
    const setBGLR = (item, isL) => {

        if (moment(item, 'DD/MM/YYYY').isSame(moment(dateT, "DD/MM/YYYY")) && moment(item, 'DD/MM/YYYY').isSame(moment(dateF, "DD/MM/YYYY"))) {
            return { backgroundColor: "white" }
        } else if (moment(item, 'DD/MM/YYYY').isSame(moment(dateF, "DD/MM/YYYY"))) {
            if (!isL) {
                // return { backgroundColor: colors.colorCalendar }
            } else {
                return { backgroundColor: "white" }
            }
        } else if (moment(item, 'DD/MM/YYYY').isSame(moment(dateT, "DD/MM/YYYY"))) {
            if (isL) {
                // return { backgroundColor: colors.colorCalendar }
            } else {
                return { backgroundColor: "white", }
            }
        } else {
            if (moment(item, 'DD/MM/YYYY').isAfter(moment(dateF, "DD/MM/YYYY")) && moment(item, 'DD/MM/YYYY').isBefore(moment(dateT, "DD/MM/YYYY"))) {
                if (dateF == '' || dateT == '') {
                    return { backgroundColor: 'white' }
                }
                // return { backgroundColor: colors.colorCalendar }
            }

        }
    }

    const renderItemNum = (item, index) => {
        let tempDate = new Date(moment(item, 'DD/MM/YYYY').format('YYYY/MM/DD'));

        let isMonthFocus = tempDate.getMonth() == thisMonth;
        return (
            <View key={index} style={{
                flex: 1,
                flexDirection: 'row',
                paddingVertical: 5
            }}>

                <View style={[setBGLR(item, true), {
                    flex: 1
                }]}>

                </View>
                <TouchableOpacity
                    style={[setStyle(item), {
                        position: 'absolute',
                        top: 1, bottom: 1, left: 5, right: 5,
                        zIndex: 10, width: Platform.OS == 'ios' ? 'auto' : Width(14),
                        alignItems: 'center', justifyContent: 'center', borderRadius: 100
                    }]}
                    onPress={() => setDateChoose(item)}>
                    <View>
                        <Text style={[setStyleText(item, isMonthFocus), {
                            fontSize: 16, fontWeight: 'bold',
                            textAlign: 'center', paddingRight: 3,

                        }]}>
                            {
                                ` ${moment(item, 'DD/MM/YYYY').format('D')}`
                            }
                        </Text>
                    </View>
                </TouchableOpacity>
                <View style={[setBGLR(item, false), {
                    flex: 1
                }]}>
                </View>
            </View>
        )
    }

    const renderRow = (i) => {
        var arr = date.slice(i * 7, i * 7 + 7);
        return (
            <View
                key={i}
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
        setTimeFC(dateF, dateT);
        Utils.goback(props.nthis);
    }
    const { nrow, nmiddle } = nstyles.nstyles
    return (
        <View style={[nstyles.nstyles.ncontainer, nstyles.nstyles.shadow,
        { backgroundColor: colors.backgroundModal, justifyContent: 'flex-end' }]}>
            <View onTouchEnd={_goback} style={{
                position: 'absolute', top: 0,
                bottom: 0, left: 0, right: 0, backgroundColor: 'transparent',
            }} />
            <View style={{
                backgroundColor: colors.white,
                borderTopLeftRadius: 20, borderTopRightRadius: 20, zIndex: 1,
                paddingVertical: 20
            }}>
                <View >

                    <View style={{ flexDirection: 'row', backgroundColor: colors.veryLightPinkTwo, paddingVertical: 12 }}>
                        <TouchableOpacity

                            style={[styleT.stBtn, {
                            }]}>
                            <Text style={{
                                color: false ? colors.greenTab : colors.textblack,
                                fontSize: sizes.sText12, lineHeight: sizes.sText16
                            }}>{RootLang.lang.common.tungay}</Text>
                            <Text style={{
                                color: true ? colors.colorTabActiveJeeHR : colors.textblack,
                                fontWeight: 'bold',
                                fontSize: sizes.sText16, lineHeight: sizes.sText21
                            }}>{dateF ? dateF : `--`}</Text>

                        </TouchableOpacity>
                        <View style={{
                            alignItems: 'center', justifyContent: 'center',
                            width: 30,
                        }}>
                            <View style={{ height: 20, backgroundColor: colors.colorGrayLight, width: 1, alignContent: 'center' }}></View>
                        </View>
                        <TouchableOpacity

                            style={[styleT.stBtn, {
                            }]}>
                            <Text style={{
                                color: false ? colors.colorTabActiveJeeHR : colors.textblack,
                                fontSize: sizes.sText12, lineHeight: sizes.sText16
                            }}>{RootLang.lang.common.denngay}</Text>
                            <Text style={{
                                color: true ? colors.colorTabActiveJeeHR : colors.textblack,
                                fontWeight: 'bold',
                                fontSize: sizes.sText16, lineHeight: sizes.sText21
                            }}>{dateT ? dateT : `--`}</Text>

                        </TouchableOpacity>
                    </View>
                    <View style={{
                        paddingVertical: 20,
                        flexDirection: 'row',
                    }}>
                        <TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} onPress={handlePrev}>
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

                        <TouchableOpacity onPress={handleNext} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
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
                            num.map(i =>
                            (<View key={i} style={{ flex: 1, width: '100%' }}  >
                                {
                                    renderRow(i)
                                }
                            </View>)
                            )
                        }
                    </View>
                    <View style={[nrow, { marginHorizontal: 30, marginBottom: 30 }]}>
                        <ButtonCom
                            text={RootLang.lang.thongbaochung.thoat}
                            style={{
                                backgroundColor: colors.colorBtnGray,
                                backgroundColor1: colors.colorBtnGray,
                                color: colors.colorTextBack80,
                            }}
                            styleButton={{ flex: 1, marginRight: 10 }}
                            txtStyle={{ color: colors.black }}
                            onPress={() => Utils.goback(props.nthis)}
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




class CalandaDis extends Component {
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

// export default CalandaCom;
const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(CalandaDis, mapStateToProps, true)



