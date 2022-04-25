import dayjs from "dayjs";
import range from "lodash/range";
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Utils from '../app/Utils';
import { Images } from '../images';
import { colors, nstyles } from '../styles';
import { sizes } from '../styles/size';
const weekDays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]

const Calanda = (props) => {
    const [dayObj, setDayObj] = useState(dayjs());

    const [dateF, SetdateF] = useState(props.dateF ? props.dateF : "05/05/2020");
    const [dateT, SetdateT] = useState(props.dateT ? props.dateT : "10/05/2020");
    const [isFrom, setisFrom] = useState(false)
    const [ischeck, setischeck] = useState(false)

    useEffect(() => {
        // Utils.nlog("vao use Efect")
    });


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

    Utils.nlog("gia tri arrold", arrold, arrdate, arrnext)

    const date = [].concat(arrold, arrdate, arrnext);
    const num = range(Math.ceil(date.length / 7));

    const setDateChoose = (item) => {
        if (isFrom == true) {
            if (moment(item, "DD/MM/YYYY").isAfter(moment(dateT, "DD/MM/YYYY"))) {
                SetdateT(item);
                SetdateF(item);
                setisFrom(false);
            } else {
                SetdateF(item);
                setisFrom(false);
            }
        } else {
            if (moment(item, "DD/MM/YYYY").isBefore(moment(dateF, "DD/MM/YYYY"))) {
                SetdateF(item);
                SetdateT(item);
                setisFrom(true);
            } else {
                SetdateT(item);
                setisFrom(true);
            }
        }
        // Utils.nlog("chose item", item);
        // SetdateF(item);
    }

    const setStyle = (item) => {
        if (moment(item, 'DD/MM/YYYY').isSame(moment(dateF, "DD/MM/YYYY")) || moment(item, 'DD/MM/YYYY').isSame(moment(dateT, "DD/MM/YYYY"))) {
            return { backgroundColor: colors.greenTab, borderRadius: 50, }
        }
        if (moment(item, 'DD/MM/YYYY').isBefore(moment(dateF, "DD/MM/YYYY")) || moment(item, 'DD/MM/YYYY').isAfter(moment(dateT, "DD/MM/YYYY"))) {
            return { backgroundColor: 'white', }
        } else {
            return { backgroundColor: "#b9d5ca" }
        }
    }
    const setStyleText = (item) => {
        if (moment(item, 'DD/MM/YYYY').isSame(moment(dateF, "DD/MM/YYYY")) || moment(item, 'DD/MM/YYYY').isSame(moment(dateT, "DD/MM/YYYY"))) {
            return { color: 'white', }
        }
        if (moment(item, 'DD/MM/YYYY').isBefore(moment(dateF, "DD/MM/YYYY")) || moment(item, 'DD/MM/YYYY').isAfter(moment(dateT, "DD/MM/YYYY"))) {
            return { color: 'black', }
        } else {
            return { color: 'white', }
        }
    }
    const setBGLR = (item, isL) => {

        if (moment(item, 'DD/MM/YYYY').isSame(moment(dateT, "DD/MM/YYYY")) && moment(item, 'DD/MM/YYYY').isSame(moment(dateF, "DD/MM/YYYY"))) {
            return { backgroundColor: "white", }
        } else if (moment(item, 'DD/MM/YYYY').isSame(moment(dateF, "DD/MM/YYYY"))) {
            if (!isL) {
                return { backgroundColor: "#b9d5ca" }
            } else {
                return { backgroundColor: "white", }
            }
        } else if (moment(item, 'DD/MM/YYYY').isSame(moment(dateT, "DD/MM/YYYY"))) {
            if (isL) {
                return { backgroundColor: "#b9d5ca", }
            } else {
                return { backgroundColor: "white", }
            }
        } else {
            if (moment(item, 'DD/MM/YYYY').isAfter(moment(dateF, "DD/MM/YYYY")) && moment(item, 'DD/MM/YYYY').isBefore(moment(dateT, "DD/MM/YYYY"))) {
                return { backgroundColor: "#b9d5ca" }
            }

        }
    }
    const renderRow = (i) => {
        var arr = date.slice(i * 7, i * 7 + 7);
        // Utils.nlog("gia tri mang ", arr);
        return (<View
            key={i}
            style={{
                flexDirection: 'row',
                flex: 1, color: "green"
            }}>
            {
                arr.map((item, index) =>
                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        paddingVertical: 5,

                        // alignItems: 'center'
                    }}>

                        <View style={[setBGLR(item, true), {
                            flex: 1,
                        }]}>

                        </View>
                        <TouchableOpacity
                            style={[setStyle(item), {
                                position: 'absolute',
                                top: 5, bottom: 5, left: 5, right: 5,
                                zIndex: 10,
                                // width: 40,
                                alignItems: 'center', justifyContent: 'center',

                            }]}
                            onPress={() => setDateChoose(item)}
                            key={index}>
                            <View>
                                <Text  style={[setStyleText(item), {
                                    fontSize: 16, fontWeight: 'bold',
                                }]}>
                                    {
                                        ` ${moment(item, 'DD/MM/YYYY').format('DD')}`
                                    }
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <View style={[setBGLR(item, false), {
                            flex: 1,
                        }]}>
                        </View>
                    </View>
                )
            }
        </View>)
    }
    const handlePrev = () => {
        setDayObj(dayObj.subtract(1, "month"))
    }

    const handleNext = () => {
        setDayObj(dayObj.add(1, "month"))
    }
    _goback = () => {
        Utils.goback();
    }
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
                    {/* <Text>{isFrom == true ? 'from' : "to"}</Text> */}
                    <View style={{ flexDirection: 'row', backgroundColor: colors.veryLightPinkTwo, paddingVertical: 12 }}>
                        <TouchableOpacity
                            // onPress={() => this._ChangeRoot(true)}
                            style={[styleT.stBtn, {
                            }]}>
                            <Text  style={{
                                color: isFrom == true ? colors.greenTab : colors.textblack,
                                fontSize: sizes.sText12, lineHeight: sizes.sText16
                            }}>{`Từ Ngày`}</Text>
                            <Text  style={{
                                color: isFrom == true ? colors.greenTab : colors.textblack,
                                fontSize: sizes.sText16, lineHeight: sizes.sText21
                            }}>{dateF ? dateF : `_`}</Text>
                            {/* <Text>{`${startDate ? startDate : "_"}`}</Text> */}
                        </TouchableOpacity>
                        <View style={{ height: 20, backgroundColor: colors.colorGrayLight, width: 1, alignContent: 'center', }}></View>
                        <TouchableOpacity
                            // onPress={() => this._ChangeRoot(false)}
                            style={[styleT.stBtn, {
                            }]}>
                            <Text  style={{
                                color: isFrom == false ? colors.greenTab : colors.textblack,
                                fontSize: sizes.sText12, lineHeight: sizes.sText16
                            }}>{`Đến ngày`}</Text>
                            <Text  style={{
                                color: isFrom == false ? colors.greenTab : colors.textblack,
                                fontSize: sizes.sText16, lineHeight: sizes.sText21
                            }}>{dateT ? dateT : `_`}</Text>

                        </TouchableOpacity>
                    </View>
                    <View style={{
                        paddingVertical: 10,
                        flexDirection: 'row',
                    }}>
                        <TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} onPress={handlePrev}>
                            <Image
                                source={Images.icCalandarLeft}
                                // style={{ height: 12, width: 50 }}
                                resizeMode={'cover'}>
                            </Image>
                        </TouchableOpacity>
                        <View style={{
                            flex: 1, alignItems: 'center',
                        }} >
                            <Text  style={{
                                color: colors.greenTab,
                                fontSize: 16, fontWeight: 'bold'
                            }} >{"Tháng " + dayObj.format("MM/YYYY")}</Text>
                        </View>

                        <TouchableOpacity onPress={handleNext} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Image
                                source={Images.icCalandarRight}
                                // style={{ height: 12, width: 50 }}
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
                                (<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text  style={{ fontSize: 16, color: colors.black_20 }}>{item}</Text>
                                </View>))
                        }
                    </View>

                    <View style={{ paddingVertical: 10, height: 350, backgroundColor: 'white', paddingBottom: 30 }}>
                        {
                            num.map(i =>
                                (<View key={i} style={{ flex: 1, width: '100%', }}  >
                                    {
                                        renderRow(i)
                                    }
                                </View>)
                            )
                        }
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
export default Calanda;
