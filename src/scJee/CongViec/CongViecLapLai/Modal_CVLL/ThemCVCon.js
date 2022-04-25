import React, { useEffect, useState, useRef } from 'react';
import {
    Text, TouchableOpacity, View, StyleSheet, Image, TextInput, Platform, FlatList, Animated, ScrollView, BackHandler
} from 'react-native';
import { Images } from '../../../../images';
import { colors } from '../../../../styles';
import { reText, sizes } from '../../../../styles/size';
import { Height, nstyles, Width, paddingBotX, nHeight } from '../../../../styles/styles';
import IsLoading from "../../../../components/IsLoading";
import Utils from '../../../../app/Utils';
import UtilsApp from '../../../../app/UtilsApp';
import HeaderModalCom from '../../../../Component_old/HeaderModalCom';
import { RootLang } from '../../../../app/data/locales';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import _ from 'lodash';
import ImageCus from '../../../../components/NewComponents/ImageCus';

const ThemCVCon = (props) => {
    const opacity = new Animated.Value(0)
    const type = Utils.ngetParam({ props }, 'type', '')
    const dataCu = Utils.ngetParam({ props }, 'dataCu', [])
    const callback = Utils.ngetParam({ props }, 'callback', () => { })
    const callbackEdit = Utils.ngetParam({ props }, 'callbackEdit', () => { })
    const listNV = Utils.ngetParam({ props }, 'listNV', [])
    const [tenCV, setTenCV] = useState('')
    const [nvThucHien, setNvThucHien] = useState({})
    const [soGio, setSoGio] = useState(0)
    const refLoading = useRef(null)
    useEffect(() => {
        _startAnimation(0.4)
        BackHandler.addEventListener("hardwareBackPress", _goBack);
        // refLoading.current.show()
        GanData()
        return () => {
            BackHandler.removeEventListener("hardwareBackPress", _goBack);
        }
    }, [])

    const GanData = () => {
        // console.log('dataCu', dataCu)
        if (_.isEmpty(dataCu) == false) {
            setTenCV(dataCu.Title)
            setSoGio(dataCu.Deadline)
            let obj = []
            dataCu.UserID ? obj.push(dataCu.UserID) : obj.push(dataCu)
            setNvThucHien(obj)
        }
    }

    const _startAnimation = (value) => {
        setTimeout(() => {
            Animated.timing(opacity, {
                toValue: value,
                duration: 300
            }).start();
        }, 400);
    };

    const _endAnimation = (value) => {
        setTimeout(() => {
            Animated.timing(opacity, {
                toValue: value,
                duration: 1
            }).start();
        }, 1);
    };
    const _goBack = () => {
        _endAnimation(0)
        Utils.goback({ props })
        return true;
    }

    const hashCode = (str) => {
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return hash;
    }

    const intToRGB = (i) => {
        var c = (i & 0x00FFFFFF)
            .toString(16)
            .toUpperCase();
        return "#" + "00000".substring(0, 6 - c.length) + c;
    }

    const _toDo = () => {
        let dataToDo = {}
        let check = _CheckDataRong()
        if (check == true) {
            nvThucHien.map(item => {
                dataToDo = ({ ...item, 'Title': tenCV, 'Deadline': soGio })
            })
            if (_.isEmpty(dataCu) == false) {
                callbackEdit(dataToDo)
            }
            else {
                callback(dataToDo)
            }
            _goBack()
        }
    }

    const _CheckDataRong = () => {
        let check = true // true: data được nhập hết, false : data còn thiếu
        if (tenCV == '') {
            Utils.showMsgBoxOK({ props }, RootLang.lang.thongbaochung.thongbao, 'Tên công việc không được bỏ trống!!', RootLang.lang.thongbaochung.xacnhan,)
            check = false
        }
        else if (_.isEmpty(nvThucHien) == true) {
            Utils.showMsgBoxOK({ props }, RootLang.lang.thongbaochung.thongbao, 'Người thực hiện không được bỏ trống!!', RootLang.lang.thongbaochung.xacnhan,)
            check = false
        }
        return check
    }

    const tang_giam_ThoiGianHT = (tang) => {
        let thoigian = soGio
        if (tang) {
            if (thoigian == "" || thoigian == 0) {
                thoigian = 1
            }
            else {
                thoigian += 1
            }
        }
        else {
            thoigian -= 1
            if (thoigian < 0) {
                thoigian = 0
            }
        }
        setSoGio(thoigian)
    }

    const _ThemNguoiThucHien = () => {
        let dataNVChuyenqua = []
        listNV.map(item => {
            dataNVChuyenqua.push({ ...item, 'hoten': item.hoten, 'id_nv': item.id_nv, 'image': item.image, 'tenchucdanh': item.tenchucdanh })
        })
        Utils.goscreen({ props }, "sc_PickUser",
            {
                dataNV: dataNVChuyenqua, callback: _callback, onlyOne: true
            }
        )
    }
    const _callback = (list) => {
        let obj = []
        obj.push(list)
        setNvThucHien(obj)
    }


    return (
        <KeyboardAwareScrollView
            // extraScrollHeight={Platform.OS == 'ios' ? Height(14) : Height(16)}
            enableOnAndroid={true}
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps={"handled"}
            style={{}}
        // contentContainerStyle={{ height: nHeight(100) }}
        >
            <View style={[{ backgroundColor: colors.backgroundModal, justifyContent: 'flex-end', height: nHeight(100), paddingBottom: paddingBotX }]} >
                <Animated.View onTouchEnd={() => _goBack()}
                    style={{
                        position: 'absolute', top: 0,
                        bottom: 0, left: 0, right: 0,
                        backgroundColor: colors.backgroundModal,
                        opacity
                    }} />
                <View style={[styles.viewHome, {}]}>

                    <HeaderModalCom title={_.isEmpty(dataCu) ? RootLang.lang.JeeWork.taocongviecconmoi : RootLang.lang.JeeWork.chinhsuacongviecconlaplai} onPress={_goBack}></HeaderModalCom>
                    <View style={{ paddingTop: 10 }}>
                        <View>
                            <Text style={styles.title}>{RootLang.lang.JeeWork.tencongviec}</Text>
                            <View style={styles.viewSearch}>
                                <TextInput
                                    returnKeyType='next'
                                    style={styles.search}
                                    placeholder={RootLang.lang.JeeWork.nhaptencongviec}
                                    onChangeText={(tenCV) => {
                                        setTenCV(tenCV)
                                    }}
                                    value={tenCV}
                                    underlineColorAndroid="transparent"
                                    placeholderTextColor={colors.colorPlayhoder}
                                />
                            </View>
                        </View>

                        <View>
                            <Text style={styles.title}>{RootLang.lang.JeeWork.duocgiaoboi}</Text>
                            {nvThucHien.length > 0 ?
                                <View style={styles.khungScroll}>
                                    <ScrollView horizontal={true} style={{}} scrollEnabled={nvThucHien.length <= 2 ? false : true}>
                                        {nvThucHien.map((item, index) => {
                                            return (
                                                <TouchableOpacity onPress={() => { _ThemNguoiThucHien() }} style={styles.khungTouchThemNguoi}>
                                                    {
                                                        item?.image ?
                                                            <Image source={{ uri: item?.image }} resizeMode='cover' style={[nstyles.nAva35, {}]} />
                                                            :
                                                            <View
                                                                style={[nstyles.nAva35, {
                                                                    backgroundColor: intToRGB(hashCode(item.hoten ? item.hoten : '')), alignSelf: 'center',
                                                                    justifyContent: 'center', alignItems: 'center'
                                                                }]} key={index}>
                                                                <Text style={{ alignSelf: "center", fontWeight: "bold", fontSize: reText(12), color: colors.white }}> {String(item.hoten ? item.hoten : '').split(" ").slice(-1).toString().slice(0, 2).toString()}</Text>
                                                            </View>
                                                    }
                                                </TouchableOpacity>
                                            )

                                        })}
                                    </ScrollView>
                                </View>
                                :
                                <TouchableOpacity onPress={() => { _ThemNguoiThucHien() }} style={styles.khungTouchThemNguoi}>
                                    <Image source={Images.ImageJee.icChonNguoiThamGia} style={[nstyles.nAva35, {}]} />
                                </TouchableOpacity>
                            }
                        </View>
                        <View>
                            <Text style={styles.title}>{RootLang.lang.JeeWork.hanchot}</Text>
                            <View style={styles.khungthoigianhoanthanhFull}>
                                <View style={{ marginVertical: Platform.OS == 'ios' ? 10 : 0, flex: 1 }}>
                                    <TextInput
                                        style={[styles.textInput_khongWith, { paddingLeft: 10, }]}
                                        keyboardType='number-pad'
                                        placeholder={RootLang.lang.JeeWork.nhapsogio}
                                        placeholderTextColor={colors.colorPlayhoder}
                                        onChangeText={(sogio) => {
                                            setSoGio(Number(sogio))
                                        }}
                                        value={soGio.toString()}
                                    />
                                </View>
                                <View style={[styles.row_center, { justifyContent: 'flex-end', }]}>
                                    <TouchableOpacity style={{ padding: 6, backgroundColor: soGio == 0 ? colors.colorBtnGray : "#E4E6EB", marginRight: 8 }}
                                        onPress={() => { tang_giam_ThoiGianHT(false) }}
                                        disabled={soGio == 0 ? true : false} >
                                        <Image source={Images.ImageJee.icDropdown} style={[{}]} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ padding: 6, backgroundColor: "#E4E6EB", marginRight: 8 }}
                                        onPress={() => { tang_giam_ThoiGianHT(true) }}  >
                                        <Image source={Images.ImageJee.icDropdownReverse} style={[{}]} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        <View style={styles.viewTouchXong}>
                            <TouchableOpacity
                                onPress={() => { _toDo() }}
                                style={styles.touchXong}>
                                <Text style={styles.textXong}>
                                    {RootLang.lang.JeeWork.xong}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <IsLoading ref={refLoading} />
                    </View>

                </View>
            </View >
        </KeyboardAwareScrollView >
    )
}

const styles = StyleSheet.create({
    viewHome: {
        backgroundColor: 'white', paddingHorizontal: 10, borderTopRightRadius: 15, borderTopLeftRadius: 15, paddingBottom: paddingBotX
    },
    textXong: {
        fontSize: reText(16), color: colors.white, textAlign: 'center',
    },
    search: {
        paddingVertical: Platform.OS == 'ios' ? 6 : 0, fontSize: reText(16),
    },
    title: {
        fontSize: reText(16),
    },
    viewSearch: {
        paddingVertical: 10, paddingBottom: 5,
    },
    khungScroll: {
        alignItems: 'flex-start',
    },
    khungTouchThemNguoi: {
        paddingVertical: 10
    },
    viewTouchXong: {
        justifyContent: 'center', alignItems: 'center', marginTop: 20
    },
    touchXong: {
        justifyContent: 'center', alignItems: 'center', backgroundColor: '#207FF9', width: Width(40), paddingVertical: 15, borderRadius: 20
    },
    row_center: {
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
    },
    khungnhaplieucon: {
        flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 0.3, alignItems: 'center', paddingHorizontal: 10, borderColor: '#E4E6EB',
    },
    khungthoigianhoanthanhFull: {
        flexDirection: 'row', borderColor: "#E4E6EB", borderWidth: 0.7, borderRadius: 10, marginTop: 5, justifyContent: 'space-between'
    },
    textInput_khongWith: {
        marginVertical: 5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
        paddingVertical: 5, backgroundColor: colors.white,
    },
});

const mapStateToProps = state => ({
    lang: state.changeLanguage.language,
});

export default Utils.connectRedux(ThemCVCon, mapStateToProps, true)