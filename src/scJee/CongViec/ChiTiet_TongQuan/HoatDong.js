import React, { Component, createRef } from 'react';
import {
    FlatList, Platform, StyleSheet, Text, View, Image, TouchableOpacity
} from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { getCTHoatDongCongViec } from '../../../apis/JeePlatform/API_JeeWork/apiCongViecCaNhan';
import Utils from '../../../app/Utils';
import FastImagePlaceholder from '../../../components/NewComponents/FastImageDefault';
import { Images } from '../../../images';
import { colors } from '../../../styles';
import { reText, sizes } from '../../../styles/size';
import { Height, nstyles, Width } from '../../../styles/styles';
import ListEmptyLottie from '../../../components/NewComponents/ListEmptyLottie';
import UtilsApp from '../../../app/UtilsApp';
import IsLoading from '../../../components/IsLoading';
import { RootLang } from '../../../app/data/locales';
import { nkey } from '../../../app/keys/keyStore';
import moment from 'moment'
import HTMLView from 'react-native-htmlview';

const ScrollComment = createRef();

class HoatDong extends Component {
    constructor(props) {
        super(props);
        this.nthis = this.props.nthis
        this.refLoading = React.createRef()
        this.idUser = ''
        this.state = {
            id_row: Utils.ngetParam(this.nthis, "id_row", ''),
            Activities: [],
            tuongtac: '',
            refreshing: false,
        };
    }

    componentDidMount = async () => {
        this.refLoading.current.show()
        this.idUser = await Utils.ngetStorage(nkey.UserId, '')
        await this._GetCTHoatDong().then(res => {
            if (res == true) {
                this.refLoading.current.hide()
            }
        });
    }

    _GetCTHoatDong = async () => {
        var { id_row } = this.state
        const res = await getCTHoatDongCongViec(id_row)
        if (res.status == 1) {
            let array = res.data.reverse()
            this.setState({
                Activities: array,
                refreshing: false
            })
        }
        else {
            this.setState({ refreshing: false })
            UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, res.error ? res.error.message : RootLang.lang.JeeWork.laydulieuthatbai, 2)
        }
        return true
    }

    returnText = (val) => {
        return (
            <>
                <Text>{' '}</Text>
                <Image source={Images.ImageJee.icCoKhongUuTien} style={{ width: Width(3), height: Width(4), tintColor: val == 1 ? "#DA3849" : val == 2 ? "#F2C132" : val == 3 ? "#6E47C9" : val == 4 ? "#6F777F" : 'grey' }} />
                <Text style={{ color: val == 1 ? "#DA3849" : val == 2 ? "#F2C132" : val == 3 ? "#6E47C9" : val == 4 ? "#6F777F" : 'grey', fontWeight: 'bold' }}>
                    {val == 1 ? ' ' + RootLang.lang.JeeWork.douutienkhancap + ' ' : val == 2 ? ' ' + RootLang.lang.JeeWork.douutiencao + ' ' : val == 3 ? ' ' + RootLang.lang.JeeWork.douutienbinhthuong + ' '
                        : val == 4 ? ' ' + RootLang.lang.JeeWork.douutienthap + ' ' : ' ' + RootLang.lang.JeeWork.khongcodouutien + ' '}
                </Text>
            </>
        )
    }

    showInfo = (item) => {
        let array = []
        this.state.Activities.map(val => {
            if (val == item) {
                if (item.check)
                    array.push({ ...val, check: false })
                else
                    array.push({ ...val, check: true })
            } else {
                array.push({ ...val, check: false })
            }
        })
        this.setState({ Activities: array })
    }

    _renderItem = ({ item, index }) => {
        // console.log("ITEM:", item)
        return (
            <View key={index} style={{ marginHorizontal: Width(2) }}>
                {
                    item.id_action == 39 ?
                        <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', marginTop: 15, marginRight: 5, width: Width(96), backgroundColor: colors.white, paddingVertical: 10, borderRadius: 5 }}>
                            <View style={{ width: Width(59), flexDirection: 'row', paddingHorizontal: 10 }}>
                                <FastImagePlaceholder
                                    style={{ width: 30, height: 30, borderRadius: 30, }}
                                    source={{ uri: item.NguoiTao?.image }}
                                    resizeMode={"cover"}
                                    placeholder={Images.icAva}
                                />
                                <View style={{ alignSelf: 'center' }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 5 }}>
                                        <Text style={{ fontSize: reText(14) }}>{this.idUser == item.NguoiTao.id_nv ? 'Bạn' : item.NguoiTao.hoten} <Text style={{ fontSize: reText(14), color: colors.black_50 }}>{item.action}</Text></Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{ width: Width(35), alignItems: 'flex-end' }}>
                                <Text style={{ fontSize: reText(13), color: colors.black_50 }}>{UtilsApp.convertDatetime(item.CreatedDate, 'DD/MM/YYYY HH:mm', 'DD/MM/YYYY HH:mm')}</Text>
                            </View>
                        </View>
                        :
                        <View style={{ flexDirection: "row", width: Width(96), marginTop: 15 }}>
                            <View style={{ width: Width(61) }}>

                                {/* {item.oldvalue && item.newvalue && item.id_action != 16 && item.id_action != 14 ? */}
                                <Text style={{ fontSize: reText(14) }}>
                                    <Text style={{ fontSize: reText(14) }}>{this.idUser == item.NguoiTao.id_nv ? 'Bạn' : item.NguoiTao.hoten} </Text>
                                    <Text style={{ fontSize: reText(14), color: colors.black_50 }}>
                                        {item?.action.replace(' {0}', ' ') + ' '}
                                    </Text>
                                    {item.oldvalue && item.newvalue && item.id_action != 16 && item.id_action != 14 ?
                                        <>
                                            <Text style={{ color: colors.black_90, fontSize: reText(14) }}>
                                                {RootLang.lang.JeeWork.tu + " "}
                                            </Text>
                                            {item.colorold ? <Text style={{ color: item.colorold }}>
                                                {" "}■{" "}
                                            </Text> : null}
                                            {item.id_action == 8 ? this.returnText(item.oldvalue) :
                                                <Text style={{ color: item.colorold ? item.colorold : colors.black_50, fontWeight: "bold" }}>
                                                    {item.id_action == 4 || item.id_action == 11 ? moment(item?.oldvalue, 'DD/MM/YYYY HH:mm').add(7, 'hour').format('DD/MM/YYYY HH:mm') : item?.oldvalue} {' '}
                                                </Text>}
                                            <Text style={{ color: colors.black_90, fontSize: reText(14) }}>
                                                {RootLang.lang.JeeWork.thanh + " "}
                                                {item.colornew ? <Text style={{ color: item.colornew }}>
                                                    {" "}■{" "}
                                                </Text> : null}
                                                {item.id_action == 8 ? this.returnText(item.newvalue) :
                                                    <Text style={{ color: item.colornew ? item.colornew : colors.black, fontWeight: "bold", fontSize: reText(14) }}>
                                                        {item.id_action == 4 || item.id_action == 11 ? moment(item?.newvalue, 'DD/MM/YYYY HH:mm').add(7, 'hour').format('DD/MM/YYYY HH:mm') : item?.newvalue}{item.id_action == 58 ? ' ' + RootLang.lang.thongbaochung.gio + ' ' : ''}
                                                    </Text>}
                                            </Text>
                                        </> : null}
                                    {!item.oldvalue && item.newvalue && item.id_action == 58 || !item.oldvalue && item.newvalue && item.id_action == 11 || !item.oldvalue && item.newvalue && item.id_action == 4 ?
                                        <>
                                            <Text style={{ color: colors.black_90, fontSize: reText(14) }}>
                                                {"thành "}
                                            </Text>
                                            <Text style={{ color: item.colornew ? item.colornew : colors.black, fontWeight: "bold", fontSize: reText(14) }}>
                                                {item.id_action == 4 || item.id_action == 11 ? moment(item?.newvalue, 'DD/MM/YYYY HH:mm').add(7, 'hour').format('DD/MM/YYYY HH:mm') : item?.newvalue} {item.id_action == 58 ? RootLang.lang.thongbaochung.gio : ''}
                                            </Text>

                                        </> : null}
                                </Text>
                                {item.id_action == 14 || item.id_action == 16 ?
                                    <TouchableOpacity onPress={() => this.showInfo(item)} style={{ paddingVertical: 2 }}>
                                        <Text style={{ fontStyle: 'italic', color: item.check ? colors.black_20_2 : '#6FBCF7', fontSize: reText(12) }}>{item.check ? RootLang.lang.thongbaochung.donglai : RootLang.lang.thongbaochung.xemdaydu}</Text>
                                    </TouchableOpacity> : null}
                                {item.check ?
                                    <View style={{ backgroundColor: colors.white, padding: 5, width: Width(94), borderRadius: 5, flexDirection: 'row', flexWrap: 'wrap' }}>
                                        <Text style={{ color: colors.black_50, fontSize: reText(14) }}>{item.id_action == 16 ? RootLang.lang.thongbaochung.capnhatmotacongviec : RootLang.lang.thongbaochung.capnhatketquacongviec}: </Text>
                                        {item.oldvalue == null || item.oldvalue == "<div></div>" || item.oldvalue == "" ?
                                            <HTMLView
                                                value={`${item.newvalue}`}
                                                stylesheet={{
                                                    div: { fontSize: reText(14), color: colors.black_90 },
                                                }}
                                            /> :
                                            <>
                                                <HTMLView
                                                    value={`<Div><i>Từ:</i> ${item.oldvalue} </Div>`}
                                                    stylesheet={{
                                                        div: { fontSize: reText(14), color: colors.black_90 },
                                                        i: { fontSize: reText(14), color: '#6FBCF7' }
                                                    }}
                                                />
                                                <HTMLView
                                                    value={`<Div><i>Thành:</i> ${item.newvalue}</Div>`}
                                                    stylesheet={{
                                                        div: { fontSize: reText(14), color: colors.black_90 },
                                                        i: { fontSize: reText(14), color: '#6FBCF7' }
                                                    }}
                                                />
                                            </>}
                                    </View> : null
                                }
                            </View>
                            <View style={{ width: Width(35), alignItems: 'flex-end', paddingRight: 8 }}>
                                <Text style={{ fontSize: reText(13), color: colors.black_50 }}>{UtilsApp.convertDatetime(item.CreatedDate, 'DD/MM/YYYY HH:mm', 'DD/MM/YYYY HH:mm')}</Text>
                            </View>
                        </View>}
            </View>
        );
    };



    render() {
        const { listBaiDang, showload, refreshing } = this.state;
        var { tuongtac, Activities, edit } = this.state
        return (
            <View style={{ flex: 1 }}>
                <KeyboardAwareScrollView
                    ref={ScrollComment}
                    extraScrollHeight={Platform.OS == 'ios' ? Height(9) : Height(35)} enableOnAndroid={true}
                    style={[nstyles.ncontainer, { backgroundColor: colors.BackgroundHome, width: Width(100), marginBottom: Platform.OS === 'android' ? 5 : 10 }]}>
                    <View style={{ flex: 1, flexGrow: 1, marginTop: 4, paddingBottom: Platform.OS == 'android' ? Width(40) : 30, paddingHorizontal: 5 }}>
                        <FlatList
                            data={Activities}
                            nestedScrollEnabled={true}
                            scrollEnabled={true}
                            renderItem={this._renderItem}
                            refreshing={refreshing}
                            extraData={this.state}
                            initialNumToRender={5}
                            maxToRenderPerBatch={10}
                            windowSize={7}
                            onRefresh={this._onRefresh}
                            ListEmptyComponent={Activities.length == 0 ? <ListEmptyLottie style={{ justifyContent: 'center', alignItems: 'center', }} textempty={RootLang.lang.JeeWork.khongcodulieu} /> : null}
                            updateCellsBatchingPeriod={100}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                </KeyboardAwareScrollView >
                <IsLoading ref={this.refLoading} />
            </View>

        );
    }
};


const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});

const styles = StyleSheet.create({
    card: {
        borderRadius: 30
    },
    list: {
        overflow: 'visible'
    },
    reactView: {
        width: (Width(100) - 24) / 7,
        height: 58,
        justifyContent: 'center',
        alignItems: 'center'
    },
    reaction: {
        width: Width(20),
        marginBottom: 4
    }
});

export default Utils.connectRedux(HoatDong, mapStateToProps, true)


