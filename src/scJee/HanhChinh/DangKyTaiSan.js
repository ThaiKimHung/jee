import React, { Component } from 'react'
import { Text, View, TouchableOpacity, ScrollView, Image, FlatList } from 'react-native'
import Utils from '../../app/Utils'
import HeaderComStackV2 from '../../components/HeaderComStackV2'
import { Images } from '../../images'
import { colors } from '../../styles'
import { Calendar } from 'react-native-big-calendar'
import vi from 'dayjs/locale/vi'
import en from 'dayjs/locale/en'
import moment from 'moment'
import { Height, nHeight, Width } from '../../styles/styles'
import { reText, sizes } from '../../styles/size'
import dayjs from 'dayjs'
import { Get_DSDatPhongHop, Get_ListTaiSan } from '../../apis/JeePlatform/API_JeeHanhChanh/apiJeeHanhChanh'
import UtilsApp from '../../app/UtilsApp'
import { nkey } from '../../app/keys/keyStore'
import { RootLang } from '../../app/data/locales'
import IsLoading from '../../components/IsLoading'
const darkTheme = {
    palette: {
        primary: {
            main: colors.colorBlue,
            contrastText: colors.white,
        },
        // evenCellBg: '#333',
        // oddCellBg: '#555',
        // gray: {
        //     '100': '#333',
        //     '200': '#666',
        //     '300': '#888',
        //     '500': '#aaa',
        //     '800': '#ccc',
        // },
    },
}
export class DangKyTaiSan extends Component {
    constructor(props) {
        super(props)
        this.idUser = ''
        this.refLoading = React.createRef()
        this.type = Utils.ngetParam(this, 'type', 0) //1 là luồng từ cuộc họp qua
        this.noiDungHop = Utils.ngetParam(this, 'noiDungHop', '');
        this._selectTaiSan = Utils.ngetParam(this, 'selectTaiSan')
        this.callbackItem = Utils.ngetParam(this, 'callbackItem')
        this.date = moment(Utils.ngetParam(this, 'date'), 'DD/MM/YYYY').format('YYYY/MM/DD')
        this.timeIn = moment(Utils.ngetParam(this, 'timeIn'), 'HH:mm').format('HH')
        this.InitTime = this.type == 1 ? (this.timeIn * 60) > 600 ? 600 : this.timeIn * 60 : 350
        this.state = {
            events: [],
            dataModeCalendar: [
                { id: 1, title: RootLang.lang.thongbaochung.ngaytitle, value: 'day', },
                { id: 2, title: RootLang.lang.thongbaochung.tuan, value: 'week', },
                { id: 3, title: RootLang.lang.thongbaochung.thang, value: 'month' },
                { id: 4, title: RootLang.lang.thongbaochung.lichbieu, value: 'keylichbieu', }
            ],
            modeCalendar: this.type == 1 ? 'day' : 'week',
            dateSelect: this.type == 1 ? this.date : moment().format('YYYY/MM/DD'),
            dataTaiSan: [],
            selectTaiSan: { "RowID": -1, "Title": RootLang.lang.thongbaochung.khongcodulieu },
            checkSelectTime: false,
        }
    }

    // eventNotes = () => {
    //     return (
    //         <View style={{ marginTop: 3 }}>
    //             <Text style={{ fontSize: 10, color: 'white' }}> Phone number: 555-123-4567 </Text>
    //             <Text style={{ fontSize: 10, color: 'white' }}> Arrive 15 minutes early </Text>
    //         </View>
    //     )
    // }

    async componentDidMount() {
        this.refLoading.current.show()
        this.idUser = await Utils.ngetStorage(nkey.UserId, '')
        this.nameuser = await Utils.ngetStorage(nkey.nameuser, '')
        this.Get_ListTaiSan()
    }

    Get_ListTaiSan = async () => {
        let res = await Get_ListTaiSan()
        if (res.status == 1 && res.data) {
            this.setState({
                dataTaiSan: res.data, selectTaiSan: this.type == 1 ? this._selectTaiSan : res.data[0]
            }, () => {
                this.GetCalendarTaiSan()
            })
        }
        else {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error.msg ? res.error.msg : RootLang.lang.thongbaochung.loihethong, 2)
        }
    }

    GetCalendarTaiSan = async (month = true) => {
        this.refLoading.current.show()
        this.setState({ events: [] })
        let res = await Get_DSDatPhongHop(this.state.selectTaiSan.RowID, -1, this.state.dateSelect, month)
        if (res.status == 1) {
            this.refLoading.current.hide()
            let list = []
            res.data != null && res.data.map(item => {
                item.id != 2 && list.push({
                    "title": item.title,
                    "start": dayjs(moment(item.start).format('YYYY/MM/DD')).set('hour', moment(item.start).format('HH')).set('minute', moment(item.start).format('mm')).toDate(),
                    "end": dayjs(moment(item.end).format('YYYY/MM/DD')).set('hour', moment(item.end).format('HH')).set('minute', moment(item.end).format('mm')).toDate(),
                    "type": item.id,
                    "fullname": item.fullname,
                    "department": item.department,
                    "property": item.property,
                    "requestid": item.requestid,
                    "subscriberid": item.subscriberid,
                    "createddate": item.createddate
                    //0:đang chờ xác nhận, 1:đã đặt, 2: đã huỷ
                })

            })
            this.setState({ events: month ? list : list.reverse(), checkSelectTime: false })
        }
        else {
            this.refLoading.current.hide()
            this.setState({ events: [], checkSelectTime: false })
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error.msg ? res.error.msg : RootLang.lang.thongbaochung.loilaydulieu, 2)
        }
    }


    _goback = () => {
        Utils.goback(this)
    }

    _selectDate = () => {
        const { dateSelect } = this.state
        Utils.goscreen(this, 'Modal_CalandaSingalCom', {
            date: moment(dateSelect, 'YYYY/MM/DD').format('DD/MM/YYYY') || moment(new Date()).format('DD/MM/YYYY'),
            setTimeFC: (time) => {
                this.setState({ checkSelectTime: true })
                let timeNew = moment(time, 'DD/MM/YYYY').format('YYYY/MM/DD')
                this.setState({ dateSelect: timeNew }, () => this.state.modeCalendar == 'keylichbieu' ? this.GetCalendarTaiSan(false) : this.GetCalendarTaiSan())
            }
        })
    }

    renderEvent = (event, touchableOpacityProps) => {
        return (
            <TouchableOpacity key={event.start + event.title} {...touchableOpacityProps}
                onPress={() => Utils.goscreen(this, 'FormChiTiet', { event: event, callback: () => this.state.modeCalendar == 'keylichbieu' ? this.GetCalendarTaiSan(false) : this.GetCalendarTaiSan() })}>
                <Text numberOfLines={this.state.modeCalendar == 'month' ? 1 : null} style={{ fontSize: reText(10), color: colors.white }}>{event.subscriberid != this.idUser ? event.fullname : event.title}</Text>
            </TouchableOpacity>
        )
    }


    ViewTaiSan = (item) => {
        return (
            <View key={item.RowID} >
                <Text style={{
                    textAlign: "center", fontSize: reText(16),
                    color: this.state.selectTaiSan.RowID == item.RowID ? colors.orange1 : 'black',
                    fontWeight: this.state.selectTaiSan.RowID == item.RowID ? "bold" : 'normal'
                }}>{item.Title ? item.Title : ""}</Text>
            </View>
        )
    }

    _DropDown = () => {
        Utils.goscreen(this, 'Modal_ComponentSelectCom', {
            callback: this._callback, item: this.state.selectTaiSan,
            AllThaoTac: this.state.dataTaiSan, ViewItem: this.ViewTaiSan
        })
    }

    _callback = (item) => {
        this.setState({ selectTaiSan: item }, () => {
            this.state.modeCalendar == 'keylichbieu' ? this.GetCalendarTaiSan(false) : this.GetCalendarTaiSan()
        })
    }

    SetIdTab = (item) => {
        this.setState({ modeCalendar: item.value })
        item.id == 4 ? this.GetCalendarTaiSan(false) : this.GetCalendarTaiSan()
    }

    renderLichBieu = ({ item, index }) => {
        let thu = UtilsApp.RenderThu(item.start, this.props.lang, 2)
        let ngay = moment(item.start).format('DD/MM/YYYY')
        let timeIn = moment(item.start).format('HH:mm')
        let timeOut = moment(item.end).format('HH:mm')
        let check = index == 0 || (index != 0 && moment(this.state.events[index - 1].start).format('DD/MM/YYYY').toString() != ngay.toString()) ? true : false
        return (
            <View key={index} style={{ marginBottom: index == (this.state.events.length - 1) ? 30 : 0 }}>
                {check ?
                    <View style={{ backgroundColor: colors.black_10, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 5, paddingVertical: 8, marginTop: 10 }}>
                        <Text style={{ color: colors.blueColor, fontSize: reText(16), fontWeight: 'bold' }}>{thu}</Text>
                        <Text style={{ color: colors.blueColor, fontSize: reText(16), fontWeight: 'bold' }}>{ngay}</Text>
                    </View> : null}
                <TouchableOpacity onPress={() => Utils.goscreen(this, 'FormChiTiet', {
                    event: item,
                    callback: () => this.state.modeCalendar == 'keylichbieu' ? this.GetCalendarTaiSan(false) : this.GetCalendarTaiSan()
                })} style={{ flexDirection: 'row', paddingHorizontal: 5, marginTop: 5 }}>
                    <Text style={{ fontSize: reText(15), width: Width(30), color: colors.colorTitleNew }}>{timeIn} - {timeOut}</Text>
                    <View style={{ width: 20, height: 20, backgroundColor: this.renderColor(item), borderRadius: 20 }} />
                    <Text style={{ fontSize: reText(16), width: Width(60), marginLeft: 10, color: colors.colorTitleNew }}><Text style={{ color: colors.black }}>{item.fullname}</Text> : {item.title}</Text>
                </TouchableOpacity>
            </View >
        )
    }
    renderColor = (item) => {
        if (item.subscriberid != this.idUser) {
            return '#9699A2'
        } else {
            if (item.type == 0)
                return '#E7C270'
            if (item.type == 1)
                return '#77BBEE'
        }

    }

    renderListEmpty = () => {
        return (
            <View style={{ flex: 1, marginTop: "50%", alignItems: 'center' }}>
                <Image source={Images.icListEmpty} style={{ width: sizes.nImgSize200, height: sizes.nImgSize200 }} resizeMode={'cover'} />
                <Text style={{ fontSize: sizes.sText16, color: colors.brownGreyTwo }}>{RootLang.lang.thongbaochung.khongcodulieu}</Text>
            </View>
        )
    }

    goFormDK = (e) => {
        Utils.goscreen(this, 'FormDangKyTS', {
            type: this.type, noiDungHop: this.noiDungHop, selectTaiSan: this.state.selectTaiSan, valDate: e,
            callback: (type, item) => {
                if (type == 1) {
                    this._goback()
                    this.callbackItem(item)
                } else {
                    this.state.modeCalendar == 'keylichbieu' ? this.GetCalendarTaiSan(false) : this.GetCalendarTaiSan()
                }
            }
        })
    }

    changeWeek = (val) => {
        if (val == 1)
            this.setState({ dateSelect: moment(this.state.dateSelect).add(-1, 'week').format("YYYY/MM/DD") }, () => this.GetCalendarTaiSan(false))
        if (val == 2)
            this.setState({ dateSelect: moment(this.state.dateSelect).add(1, 'week').format("YYYY/MM/DD") }, () => this.GetCalendarTaiSan(false))
    }

    render() {
        const { events, modeCalendar, dataModeCalendar, dateSelect, selectTaiSan, checkSelectTime } = this.state
        let DateStartWeek = moment(dateSelect).startOf('week').format('DD') + '/' + moment(dateSelect).startOf('week').format('MM/YYYY')
        let DateEndWeek = moment(dateSelect).endOf('week').format('DD') + '/' + moment(dateSelect).endOf('week').format('MM/YYYY')
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1, backgroundColor: colors.white }}>
                    <HeaderComStackV2
                        nthis={this}
                        title={RootLang.lang.thongbaochung.dangkysudungtaisan}
                        iconLeft={Images.ImageJee.icBack}
                        onPressLeft={this._goback}
                    />
                    <View style={{ flexDirection: 'row', height: Width(8), justifyContent: 'space-between', paddingHorizontal: 10, marginBottom: 5 }}>
                        <TouchableOpacity onPress={() => this._DropDown()} style={{ flexDirection: 'row', alignItems: 'center', }}>
                            <Text style={{ fontSize: reText(18), color: selectTaiSan.RowID == -1 ? '#404040' : colors.orange1, marginRight: 5, fontWeight: selectTaiSan.RowID == -1 ? null : 'bold' }}>{selectTaiSan.Title}</Text>
                            <Image source={Images.ImageJee.icDropdown} style={{ width: 10, height: 10, tintColor: '#404040', }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this._selectDate()} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontSize: reText(18), color: '#404040', marginRight: 5 }}>{UtilsApp.changeMonthEnAbbreviation_Full(dateSelect, this.props.lang)}</Text>
                            <Image source={Images.ImageJee.icDropdown} style={{ width: 10, height: 10, tintColor: '#404040', }} />
                        </TouchableOpacity>

                    </View>
                    <View style={{ width: '100%', height: Width(8), flexDirection: 'row', justifyContent: 'space-around', backgroundColor: colors.black_10 }}>
                        {dataModeCalendar.map((item, index) => {
                            return (
                                <TouchableOpacity onPress={() => this.SetIdTab(item)} style={{
                                    width: Width(22), height: Width(8), backgroundColor: item.value == modeCalendar ? colors.blueColor : null, marginRight: Width(1), justifyContent: 'center', alignItems: 'center', borderRadius: 7
                                }}>
                                    <Text style={{ fontSize: reText(16), color: item.value == modeCalendar ? colors.white : colors.black_50 }}>{item.title}</Text>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                    {modeCalendar == 'keylichbieu' ?
                        <ScrollView style={{ flex: 1, backgroundColor: colors.white }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, alignItems: 'center' }}>
                                <TouchableOpacity onPress={() => this.changeWeek(1)} style={{ height: nHeight(3.5), width: Width(12), justifyContent: 'flex-end', alignSelf: 'center' }}>
                                    <Image source={Images.ImageJee.icBack} style={{ width: Width(2.5), height: Width(4.3), tintColor: colors.black_50 }} />
                                </TouchableOpacity>
                                <Text style={{ fontSize: reText(14), alignSelf: 'center', color: colors.colorTitleNew, marginTop: 10 }}>{DateStartWeek} - {DateEndWeek}</Text>
                                <TouchableOpacity onPress={() => this.changeWeek(2)} style={{ height: nHeight(3.5), width: Width(12), justifyContent: 'flex-end', alignItems: 'flex-end', alignSelf: 'center' }}>
                                    <Image source={Images.ImageJee.icIconDropDownNamNgang} style={{ width: Width(2.5), height: Width(4.3), tintColor: colors.black_50 }} />
                                </TouchableOpacity>
                            </View>
                            <FlatList
                                data={events}
                                renderItem={this.renderLichBieu}
                                keyExtractor={(item, index) => index.toString()}
                                ListEmptyComponent={this.state.events.length == 0 ? this.renderListEmpty : null}
                            />
                        </ScrollView> :
                        <ScrollView style={{ flex: 1 }}>
                            <Calendar
                                // mode={true}
                                onChangeDate={(val) => {
                                    if (moment(val[0]).format('MM') != moment(this.state.dateSelect).format('MM') && !checkSelectTime)
                                        this.setState({ dateSelect: moment(val[0]).format('YYYY/MM/DD') }, () => this.GetCalendarTaiSan())
                                }}
                                weekStartsOn={1}
                                events={events}
                                height={Height(100)}
                                theme={darkTheme}
                                locale={this.props.lang == 'vi' ? vi : en}
                                onPressCell={(e) => this.goFormDK(e)}
                                // onPressDateHeader={(e) => alert(moment(e).format('DD/MM/YYYY HH:mm'))}
                                onPressEvent={(e) => Utils.nlog("Log:", e)}
                                eventCellStyle={(item) => {
                                    return (
                                        {
                                            backgroundColor: this.renderColor(item)
                                        }
                                    )
                                }}
                                renderEvent={this.renderEvent}
                                mode={modeCalendar == 'keylichbieu' ? 'week' : modeCalendar}
                                swipeEnabled={true}
                                date={dateSelect}
                                hourStyle={{ color: colors.blueColor, fontSize: reText(13) }}
                                scrollOffsetMinutes={this.InitTime}
                            // showTime={false}
                            // activeDate={}
                            // activeDate={'2021/12/24 10:00'}
                            // hourRowHeight={100}
                            />

                        </ScrollView>}
                </View>
                <TouchableOpacity onPress={() => this.goFormDK()}
                    style={{
                        width: Width(13), height: Width(13), backgroundColor: '#04B486', borderRadius: Width(13), position: 'absolute',
                        bottom: 15, right: 10, justifyContent: 'center', alignItems: 'center'
                    }}>
                    <Image source={Images.ImageJee.daucong} style={{ width: Width(7), height: Width(7), tintColor: colors.white }} />
                </TouchableOpacity>
                <IsLoading ref={this.refLoading} />
            </View>
        )
    }
}
const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(DangKyTaiSan, mapStateToProps, true)