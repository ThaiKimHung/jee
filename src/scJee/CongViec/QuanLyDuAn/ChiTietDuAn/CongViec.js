import LottieView from 'lottie-react-native';
import React, { Component } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View, FlatList } from "react-native";
import { ChiTietDuAn } from '../../../../apis/JeePlatform/API_JeeWork/apiDuAn';
import { RootLang } from '../../../../app/data/locales';
import Utils from '../../../../app/Utils';
import { Images } from '../../../../images';
import { colors } from '../../../../styles';
import { reText, sizes } from '../../../../styles/size';
import { Height, nstyles, Width } from '../../../../styles/styles';
import Dash from 'react-native-dash'
import _ from 'lodash';
import moment from 'moment';
import FastImagePlaceholder from '../../../../components/NewComponents/FastImageDefault';
import { DeleteCTCongViecCaNhan } from '../../../../apis/JeePlatform/API_JeeWork/apiCongViecCaNhan';
import UtilsApp from '../../../../app/UtilsApp';
import IsLoading from '../../../../components/IsLoading';
import ListEmptyLottie from '../../../../components/NewComponents/ListEmptyLottie';

class CongViec extends Component {
    constructor(props) {
        super(props);
        this.nthis = this.props.nthis
        this.jeemeting = this.props?.jeemeting
        this.state = {
            item: Utils.ngetParam(this.nthis, "item", ''),
            id_row: Utils.ngetParam(this.nthis, "id_row", ''),
            itemprop: this.props?.item,
            listStatus: [],
            refreshing: false,
            empty: true,
            showload: false,
            listCongViec: [],
            hienthi: 'status',

            _dateDk: '',
            _dateKt: '',
            typeChoice: '',
            searchString: '',

        };

    }

    async componentDidMount() {
        if (!this.state.item) {
            this.setState({ item: this.nthis.item }, async () => {
                nthisLoading.show()
                await this._ChiTietDuAn().then(res => {
                    if (res == true) {
                        nthisLoading.hide()
                    }
                });
            })
        }
        else {
            nthisLoading.show()
            await this._ChiTietDuAn().then(res => {
                if (res == true) {
                    nthisLoading.hide()
                }
            });
        }
    }


    _ChiTietDuAn = async () => {
        var { item, listCongViec, hienthi, searchString, _dateDk, _dateKt, typeChoice, itemprop } = this.state
        this.setState({ empty: true })
        let res = ''
        if (this.jeemeting == true) {
            res = await ChiTietDuAn(searchString, itemprop.id_row, hienthi, searchString, _dateDk, _dateKt, typeChoice)
        }
        else {
            res = await ChiTietDuAn(searchString, item.id_row, hienthi, searchString, _dateDk, _dateKt, typeChoice)
        }
        // Utils.nlog('res _ChiTietDuAn', res)

        if (res.status == 1) {
            this.setState({
                // listStatus: res.data.Filter,
                refreshing: false,
                empty: true,
                showload: false,
                // listCongViec: res.data.Filter.map(obj => ({ ...obj, dataCongViec: res.data.datawork.filter(stres => stres.status == obj.id_row), dropdown: true }))
                listCongViec: res.data.map(obj => ({ ...obj, dropdown: true }))
            })

        }
        else {
            this.setState({ refreshing: false, showload: false, empty: true })
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
        }
        return true
    }

    _DeleteCongViec = async (id) => {
        var { } = this.state
        const res = await DeleteCTCongViecCaNhan(id)

        if (res.status == 1) {
            UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, RootLang.lang.JeeWork.xoacongviecthanhcong, 1)
            this._ChiTietDuAn()
        }
        else {
            UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, res.error ? res.error.message : RootLang.lang.JeeWork.xoathatbaivuilong, 2)
        }
        return true
    }

    hashCode = (str) => {
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return hash;
    }

    intToRGB = (i) => {
        var c = (i & 0x00FFFFFF)
            .toString(16)
            .toUpperCase();

        return "#" + "00000".substring(0, 6 - c.length) + c;
    }

    CallBack = (item) => {
        this._ChiTietDuAn()
    }

    CallBackBoLoc = async (item) => {
        nthisLoading.show()
        this.setState({
            _dateDk: item._dateDk,
            _dateKt: item._dateKt,
            typeChoice: item.typeChoice,
            searchString: item.searchString
        }, () => {
            this._ChiTietDuAn().then(res => {
                nthisLoading.hide()
            })
        })
    }
    Opaciti_color = (color) => {
        if (!color) {
            color = 'rgb(0,0,0)';
        }
        var result = color.replace(')', ', 0.2)').replace('rgb', 'rgba');
        return result;
    }
    // _renderItemChild({ item, index }, color, itemStatus) {
    _renderItemChild({ item, index }) {
        let creDate = moment(item.createddate).add(7, 'hours').format('MM/DD/YYYY HH:mm:ss')
        return (
            <TouchableOpacity
                key={index}
                onLongPress={() => {
                    Utils.showMsgBoxYesNo(this.nthis ? this.nthis : this, RootLang.lang.JeeWork.thongbao, RootLang.lang.JeeWork.bancomuonxoacongviec, RootLang.lang.JeeWork.xoacongviec, RootLang.lang.JeeWork.dong, () => { this._DeleteCongViec(item.id_row, index) })
                }}
                onPress={() => {
                    Utils.goscreen(this.nthis ? this.nthis : this, "sc_ChiTietCongViecCaNhan", {
                        callback: this.CallBack,
                        index: index,
                        id_row: item.id_row,
                    })
                }}>
                <View style={{ padding: 2, marginBottom: 5, flexDirection: 'row', }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10 }}>
                        <FastImagePlaceholder
                            style={{ width: 50, height: 50, borderRadius: 50, }}
                            source={{ uri: item.id_nv.image ? item.id_nv.image : item.avatar }}
                            resizeMode={"cover"}
                            placeholder={Images.icAva}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                        <View style={{ justifyContent: 'center', paddingVertical: 5, paddingLeft: 1, width: '70%' }}>
                            <Text style={{ fontSize: sizes.sText16, marginBottom: 5, color: '#404040' }}>{item.title ? item.title : '...'}</Text>
                            {item.Tags.length != 0 && <View style={{ flexWrap: 'wrap', flexDirection: 'row', marginBottom: 2, alignItems: 'center' }}>
                                <View style={{ borderWidth: 0.5, borderColor: colors.black_50, padding: 5, borderRadius: 100, borderStyle: 'dashed', marginRight: 3 }}>
                                    <Image source={Images.ImageJee.tagcv} style={{ width: Width(2.5), height: Width(2.5), tintColor: colors.black_50, }} />
                                </View>
                                {item.Tags.map((item, index) => {
                                    return (
                                        <View key={index} style={{
                                            backgroundColor: this.Opaciti_color(item.color), marginRight: 5, justifyContent: 'center', paddingRight: 10, borderBottomRightRadius: 20, borderTopRightRadius: 20,
                                            paddingLeft: 5, marginTop: 5, maxWidth: Width(50), borderBottomLeftRadius: 2, borderTopLeftRadius: 2
                                        }}>
                                            <Text numberOfLines={1} style={{ color: item.color == '#848E9E' ? colors.white : item.color, fontSize: reText(14) }}>{item.title}</Text>
                                        </View>
                                    )
                                })}
                            </View>}
                            <View style={{ flexDirection: 'row', }}>
                                <Text numberOfLines={1} style={{ maxWidth: "80%", fontSize: sizes.sText12, color: colors.colorGrayText }}>{item.project_team ? item.project_team : "..."}</Text>
                                {item.comments ? <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                                    <Image source={Images.ImageJee.icChat} resizeMode='contain' style={[nstyles.nIcon12, {}]} />
                                    <Text numberOfLines={1} style={{ fontSize: sizes.sText12, marginLeft: 5 }}>{item.comments ? item.comments : 0}</Text>
                                </View> : null}
                                {item.clickup_prioritize == 0 ? null :
                                    <View style={{ marginLeft: 10 }}>
                                        <Image source={Images.ImageJee.icCoKhongUuTien} style={{ width: Width(2.5), height: Width(3.5), tintColor: UtilsApp.colorPrioritize(item.clickup_prioritize) }} />
                                    </View>}
                                {item.deadline ?
                                    <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                                        <Image source={Images.ImageJee.icCalendarCheck} style={{ width: Width(3), height: Width(3), tintColor: item.end_date != null ? colors.colorGrayText : UtilsApp.colorDeadline(item.deadline) }} />
                                        <Text style={{ fontSize: sizes.sText11, marginLeft: 3, alignSelf: 'center', color: item.end_date != null ? colors.colorGrayText : UtilsApp.colorDeadline(item.deadline) }}>{moment(item.deadline).format('DD/MM/YYYY')}</Text>
                                    </View> : null}
                            </View>
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 5, paddingHorizontal: 5, width: "30%" }}>
                            {/* <View style={{ backgroundColor: item.status_info ? item.status_info.color : null, borderRadius: 20, width: '100%', padding: 5, justifyContent: 'center', alignItems: 'center', marginBottom: 5 }}>
                                <Text numberOfLines={1} style={{ textAlign: "center", color: 'white', fontSize: sizes.sText12 }}>{item.status_info ? item.status_info.statusname : "...."}</Text>
                            </View> */}
                            {/* <Text style={{ color: colors.black_70, fontSize: sizes.sText12 }}>{item.createddate ? moment(item.createddate, 'YYYY/MM/DD').format('DD/MM/YYYY') : ''}</Text> */}
                            <Text style={{ color: colors.black_70, fontSize: sizes.sText14 }}>{Utils.formatTimeAgo(creDate, 1, false)}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                    <View style={{}}></View>
                    <Dash
                        dashColor={colors.colorVeryLightPink}
                        style={{ width: Width(96), height: 1, }}
                        dashGap={0}
                        dashThickness={1} />
                </View>
            </TouchableOpacity >
        )

    }
    _DropDown = async (itemChoice) => {
        var { listCongViec } = this.state
        listCongViec.map((item) => {
            if (item === itemChoice) {
                item.dropdown = !item.dropdown
            }
        })
        this.setState({ listCongViec: listCongViec })

    }

    Opaciti_color = (color) => {
        if (!color) {
            color = 'rgb(0,0,0)';
        }
        var result = color.replace(')', ', 0.2)').replace('rgb', 'rgba');
        return result;
    }

    _renderItem = ({ item, index }) => {
        const { showload } = this.state;
        return (
            <View key={index} style={{ marginHorizontal: 3, marginVertical: 1 }}>
                <TouchableOpacity
                    onPress={() => {
                        this._DropDown(item)
                    }}
                    style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, backgroundColor: this.Opaciti_color(item.color), borderRadius: 5 }}>
                    <View style={{ justifyContent: 'center' }}>
                        <Text style={{ fontSize: sizes.sText16, color: item.color ? item.color : "black", fontWeight: 'bold', paddingLeft: 10, }}>{item.statusname ? item.statusname : '...'}</Text>

                    </View>
                    <View style={{ justifyContent: 'center', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: sizes.sText15, paddingRight: 5, color: item.color, fontWeight: 'bold' }}>{_.size(item.datawork)}</Text>
                        <Image source={item.dropdown == true ? Images.ImageJee.icIconDropDownNamNgang : Images.ImageJee.icDropdownColor} resizeMode='contain' style={{ width: 12, height: 12, tintColor: item.color }} />
                    </View>
                </TouchableOpacity>
                {!item.dropdown == true ?
                    <View style={{ flex: 1, paddingHorizontal: 10 }}>
                        <FlatList
                            // extraData={this.state}
                            initialNumToRender={5}
                            maxToRenderPerBatch={10}
                            windowSize={7}
                            updateCellsBatchingPeriod={100}
                            style={{ marginTop: 3 }}
                            data={item.datawork}
                            renderItem={(itemChild) => this._renderItemChild(itemChild)}
                            keyExtractor={(item, index) => index.toString()}
                            ListEmptyComponent={item.datawork.length == 0 ? <View style={{ width: '100%', height: 50, justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: colors.black_50, fontSize: reText(15) }}>{RootLang.lang.thongbaochung.khongcodulieu}</Text></View> : null}
                            ListFooterComponent={showload ? <ActivityIndicator size='small' /> : null}
                        />
                    </View>
                    : null}



            </View>
        );
    }


    render() {
        const { showload, refreshing, empty } = this.state;
        var { listStatus, listCongViec, item, itemprop } = this.state
        return (

            <TouchableWithoutFeedback
                delayLongPress={0}
                // onPressOut={() => { this.setState({ editable: false }) }}
                style={[nstyles.ncontainer, { backgroundColor: colors.white, width: Width(100), }]}>
                <View style={{ flex: 1 }}>
                    <ScrollView nestedScrollEnabled={true} keyboardShouldPersistTaps={"handled"} style={{ backgroundColor: colors.white, marginTop: 3, flex: 1 }}>
                        <View style={{ backgroundColor: colors.white, paddingLeft: 10, flexDirection: 'row', width: Width(100), paddingVertical: 5 }}>
                            <View style={{ justifyContent: 'center' }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        Utils.goscreen(this.nthis, "TaoGiaoViec", {
                                            callback: this.CallBack,
                                            project: {
                                                project_team: this.jeemeting == true ? itemprop.title : item.title,
                                                id_project_team: this.jeemeting == true ? itemprop.id_row : item.id_row,

                                            },
                                            itemChiTietCongViec: this.jeemeting == true ? itemprop : item,
                                            Child: true,
                                            FromDuAn: true
                                        })
                                    }}
                                    style={{ backgroundColor: '#0E72D8', flexDirection: 'row', width: Width(87), padding: 10, alignItems: 'center', justifyContent: 'center', borderRadius: 20, }}>
                                    <Image source={Images.ImageJee.icThemMoi} resizeMode='contain' style={[{}]} />
                                    <Text style={{ fontSize: sizes.sText12, color: colors.white, textAlign: 'center', fontWeight: 'bold', paddingLeft: 10 }}>{RootLang.lang.JeeWork.themmoi}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <TouchableOpacity
                                    onPress={() => { Utils.goscreen(this.nthis, "sc_BoLocChiTietDuAn", { callback: this.CallBackBoLoc }) }}
                                    style={{ padding: 5, alignItems: 'center', justifyContent: 'center', width: Width(10) }}>

                                    <Image source={Images.ImageJee.icLoc} resizeMode='contain' style={[{}]} />

                                </TouchableOpacity>
                            </View>
                        </View>


                        <View style={{ flex: 1, marginBottom: Platform.OS == 'ios' ? 20 : 5 }}>
                            <FlatList
                                // extraData={this.state}

                                refreshing={refreshing}
                                style={{ marginTop: 3, backgroundColor: colors.white }}
                                data={listCongViec}
                                renderItem={this._renderItem}
                                // onRefresh={this._onRefresh}
                                keyExtractor={(item, index) => index.toString()}
                                ListEmptyComponent={listStatus.length == 0 && !empty ? <ListEmptyLottie style={{ justifyContent: 'center', alignItems: 'center', }} textempty={RootLang.lang.JeeWork.khongcodulieu} /> : null}
                                ListFooterComponent={showload ? <ActivityIndicator size='small' /> : null}
                            />
                        </View>
                    </ScrollView>
                    {/* <IsLoading /> */}
                </View>

            </TouchableWithoutFeedback >

        );
    }
};


const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});


export default Utils.connectRedux(CongViec, mapStateToProps, true)


