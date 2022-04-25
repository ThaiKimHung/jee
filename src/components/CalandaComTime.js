import Picker from "@gregfrench/react-native-wheel-picker";
import dayjs from "dayjs";
import range from "lodash/range";
import moment from 'moment';
import React, { Component, useState, useEffect } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, Platform, Animated, ScrollView, SafeAreaView } from 'react-native';
import { RootLang } from '../app/data/locales';
import { nGlobalKeys } from '../app/keys/globalKey';
import Utils from '../app/Utils';
import { Images } from '../images';
import { colors, nstyles } from '../styles';
import { sizes } from '../styles/size';
import { Height, Width } from "../styles/styles";
import ButtonCom from './Button/ButtonCom';
var PickerItem = Picker.Item;

const Calanda = (props) => {
    const Minutes = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"]
    const Hours = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"]


    const currentHours = new Date().getHours()
    const currentMinutes = Math.floor(new Date().getMinutes() / 5) * 5

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
    const [opacity] = useState(new Animated.Value(0))
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
            return { backgroundColor: colors.colorJeeNew.colorChuDao, borderRadius: 50, }
        }
        if (moment(item, 'DD/MM/YYYY').isBefore(moment(dateF, "DD/MM/YYYY")) || moment(item, 'DD/MM/YYYY').isAfter(moment(dateT, "DD/MM/YYYY"))) {
            return { backgroundColor: 'white', }
        } else {
            if (dateF == '' || dateT == '') {
                return { backgroundColor: 'white' }
            }
            return { backgroundColor: colors.colorJeeNew.colorButtonLeft }
        }
    }
    const setStyleColor = (item) => {
        if (moment(item, 'DD/MM/YYYY').isSame(moment(dateF, "DD/MM/YYYY")) || moment(item, 'DD/MM/YYYY').isSame(moment(dateT, "DD/MM/YYYY"))) {
            return { color: 'white' }
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
            return { color: 'white' }
        }
    }
    const setBGLR = (item, isL) => {

        if (moment(item, 'DD/MM/YYYY').isSame(moment(dateT, "DD/MM/YYYY")) && moment(item, 'DD/MM/YYYY').isSame(moment(dateF, "DD/MM/YYYY"))) {
            return { backgroundColor: "white" }
        } else if (moment(item, 'DD/MM/YYYY').isSame(moment(dateF, "DD/MM/YYYY"))) {
            if (!isL) {
                return { backgroundColor: colors.colorJeeNew.colorButtonLeft }
            } else {
                return { backgroundColor: "white" }
            }
        } else if (moment(item, 'DD/MM/YYYY').isSame(moment(dateT, "DD/MM/YYYY"))) {
            if (isL) {
                return { backgroundColor: colors.colorJeeNew.colorButtonLeft }
            } else {
                return { backgroundColor: "white", }
            }
        } else {
            if (moment(item, 'DD/MM/YYYY').isAfter(moment(dateF, "DD/MM/YYYY")) && moment(item, 'DD/MM/YYYY').isBefore(moment(dateT, "DD/MM/YYYY"))) {
                if (dateF == '' || dateT == '') {
                    return { backgroundColor: 'white' }
                }
                return { backgroundColor: colors.colorJeeNew.colorButtonLeft }
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
                        top: 5, bottom: 5, left: 5, right: 5,
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
        return (<View
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
    const { nrow, nmiddle } = nstyles.nstyles
    useEffect(() => {
        startAnimation(0.8)
    })
    return (
        <View style={[nstyles.nstyles.ncontainer, { backgroundColor: `transparent`, justifyContent: 'flex-end' }]}>
            <Animated.View onTouchEnd={_goback} style={{
                position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
                backgroundColor: colors.backgroundModal, alignItems: 'flex-end',
                opacity
            }} />
            <View style={{
                backgroundColor: colors.white,
                borderTopLeftRadius: 20, borderTopRightRadius: 20, zIndex: 1,
                paddingVertical: 20
            }}>
                <ScrollView >
                    <SafeAreaView />


                    <View style={{ flexDirection: 'row', backgroundColor: colors.veryLightPinkTwo, paddingVertical: 12 }}>
                        <TouchableOpacity

                            style={[styleT.stBtn, {
                            }]}>
                            <Text style={{
                                color: false ? colors.greenTab : colors.textblack,
                                fontSize: sizes.sText12, lineHeight: sizes.sText16
                            }}>{RootLang.lang.common.tungay}</Text>
                            <Text style={{
                                color: true ? colors.colorJeeNew.colorChuDao : colors.textblack,
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
                                color: false ? colors.colorJeeNew.colorChuDao : colors.textblack,
                                fontSize: sizes.sText12, lineHeight: sizes.sText16
                            }}>{RootLang.lang.common.denngay}</Text>
                            <Text style={{
                                color: true ? colors.colorJeeNew.colorChuDao : colors.textblack,
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
                                style={{ tintColor: colors.colorJeeNew.colorChuDao }}
                                resizeMode={'cover'}>
                            </Image>
                        </TouchableOpacity>
                        <View style={{
                            flex: 1, alignItems: 'center',
                        }} >
                            <Text style={{
                                color: colors.colorJeeNew.colorChuDao,
                                fontSize: 16, fontWeight: 'bold'
                            }} >{RootLang.lang.common.thang + " " + dayObj.format("MM/YYYY")}</Text>
                        </View>

                        <TouchableOpacity onPress={handleNext} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Image
                                source={Images.icCalandarRight}
                                style={{ tintColor: colors.colorJeeNew.colorChuDao }}
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
                    <View style={{
                        backgroundColor: colors.white, borderTopLeftRadius: 20,
                        borderTopRightRadius: 20, zIndex: 1
                    }}>
                        <View style={{ width: Width(100), paddingHorizontal: 20, paddingVertical: 20 }}>
                            <View style={[nrow, { backgroundColor: colors.veryLightPinkTwo, paddingVertical: 12 }]}>
                                <TouchableOpacity
                                    onPress={() => this.setState({ isFrom: true }, () => this._setUpStart(true))}
                                    style={[styleT.stBtn, {
                                    }]}>
                                    <Text style={{
                                        color: isFrom == true ? colors.colorTabActiveJeeHR : colors.textblack,
                                        fontSize: sizes.sText12, lineHeight: sizes.sText16
                                    }}>{"Thời gian "}</Text>
                                    <Text style={{
                                        color: isFrom == true ? colors.colorTabActiveJeeHR : colors.textblack,
                                        fontSize: sizes.sText16, lineHeight: sizes.sText21
                                    }}>
                                        {/* {TimeFrom ? TimeFrom : `_`} */}
                                    </Text>
                                </TouchableOpacity>
                                <View style={{ height: 20, backgroundColor: colors.colorGrayLight, width: 1 }}></View>
                                <TouchableOpacity
                                    onPress={() => this.setState({ isFrom: false }, () => this._setUpStart(false))}
                                    style={[styleT.stBtn, {
                                    }]}>
                                    <Text style={{
                                        color: isFrom == false ? colors.colorTabActiveJeeHR : colors.textblack,
                                        fontSize: sizes.sText12, lineHeight: sizes.sText16
                                    }}>
                                        {/* {textTitleT} */}
                                    </Text>
                                    <Text style={{
                                        color: isFrom == false ? colors.colorTabActiveJeeHR : colors.textblack,
                                        fontSize: sizes.sText16, lineHeight: sizes.sText21
                                    }}>
                                        {/* {TimeTo ? TimeTo : `_`} */}

                                    </Text>

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
                                    selectedValue={Number(currentHours)}
                                    itemStyle={{ color: "black", fontSize: 24 }}
                                // onValueChange={(index) => this.onPickerSelectYear(index)}

                                >
                                    {Hours.map((value, i) => (
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
                                    selectedValue={currentMinutes / 5}
                                    itemStyle={{ color: "black", fontSize: 24 }}
                                // onValueChange={(index) => this.onPickerSelectMonth(index)}

                                >
                                    {Minutes.map((value, i) => (
                                        <PickerItem label={value.toString()} value={i} key={"money" + value} color={'black'} />
                                    ))}
                                </Picker>

                            </View>

                        </View>


                        <View style={[nrow, {
                            marginHorizontal: 30,
                            paddingVertical: 20,
                        }]}>
                            {/* <ButtonCom
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
                                    backgroundColor: colors.colorButtonLeftJeeHR,
                                    backgroundColor1: colors.colorButtomrightJeeHR,
                                    color: colors.colorTextBack80,
                                }}
                                styleButton={{ flex: 1, marginLeft: 10 }}
                                txtStyle={{ color: colors.white }}
                                onPress={!TimeFrom || !TimeTo ? this.selectMonthYear : this._Goback}
                            /> */}
                        </View>
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
                            onPress={_gobackTemp}
                        />
                        <ButtonCom
                            text={RootLang.lang.thongbaochung.xong}
                            style={{
                                backgroundColor: colors.colorJeeNew.colorButtonLeft,
                                backgroundColor1: colors.colorJeeNew.colorButtomRight,
                                color: colors.colorTextBack80,
                            }}
                            styleButton={{ flex: 1, marginLeft: 10 }}
                            txtStyle={{ color: colors.white }}
                            onPress={_goback}
                        />
                    </View>
                </ScrollView>
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




class CalandaCom extends Component {
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
export default Utils.connectRedux(CalandaCom, mapStateToProps, true)



