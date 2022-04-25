import React, { useEffect, useState, useRef } from 'react';
import {
    Text, TouchableOpacity, View, StyleSheet, Image, TextInput, Platform, FlatList, Animated, BackHandler
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


const PickDataChuKy = (props) => {
    const opacity = new Animated.Value(0)
    const type = Utils.ngetParam({ props }, 'type', '')
    const dataCu = Utils.ngetParam({ props }, 'dataCu', [])
    const callback = Utils.ngetParam({ props }, 'callback', () => { })
    const ngayTrongTuan = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật']
    const ngayTrongThang = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
    const [data, setData] = useState([])
    const [pickAll, setPickAll] = useState(false)
    const refLoading = useRef(null)
    useEffect(() => {
        _startAnimation(0.4)
        BackHandler.addEventListener("hardwareBackPress", _goBack);
        refLoading.current.show()
        _thayDoiDataa()
        return () => {
            BackHandler.removeEventListener("hardwareBackPress", _goBack);
        }
    }, [])

    const _thayDoiDataa = () => {
        let dataChange = []
        if (type.id == 1) {
            ngayTrongTuan.map(item => {
                let ngayRutGon = ''
                if (item == 'Thứ 2') {
                    ngayRutGon = 'T2'
                }
                else if (item == 'Thứ 3') {
                    ngayRutGon = 'T3'
                }
                else if (item == 'Thứ 4') {
                    ngayRutGon = 'T4'
                }
                else if (item == 'Thứ 5') {
                    ngayRutGon = 'T5'
                }
                else if (item == 'Thứ 6') {
                    ngayRutGon = 'T6'
                }
                else if (item == 'Thứ 7') {
                    ngayRutGon = 'T7'
                }
                else if (item == 'Chủ nhật') {
                    ngayRutGon = 'CN'
                }
                dataChange.push({ 'ngay': item, 'ngayRutgon': ngayRutGon, 'check': false })
            })
        }
        else {
            ngayTrongThang.map(item => {
                dataChange.push({ 'ngay': item, 'check': false })
            })
        }
        if (dataCu.length > 0) {
            _chonLaiDataCu(dataChange)
        }
        else {
            refLoading.current.hide()
            setData(dataChange)
        }
    }

    const _chonLaiDataCu = (data) => {
        let dataHoanChinh = []
        dataHoanChinh = data.map(item => {
            return { ...item, check: dataCu ? _containsObject(dataCu, item) : false }
        })
        setData(dataHoanChinh)
        refLoading.current.hide()
    }

    const _containsObject = (obj, list) => {
        let checkExit = ""
        checkExit = obj.some((item) => item.ngay == list.ngay)
        return checkExit
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

    const chooseData = (ngay) => {
        let dataNgay = []
        dataNgay = data.map((item, index) => {
            if (item === ngay) {
                let check = !item.check
                return { ...item, check: check }
            }
            else {
                return { ...item }
            }
        })
        setData(dataNgay)
    }

    const _Done = () => {
        let dataChuyenVe = []
        let dataNgay = []
        dataNgay = data.map((item, index) => {
            if (item.check === true) {
                dataChuyenVe.push(item)
            }
        })
        callback(dataChuyenVe)
        _goBack()
    }

    const _renderItem = ({ item, index }) => {
        return (
            <View style={styles.viewItemNgay}>
                <TouchableOpacity onPress={() => { chooseData(item) }}
                    style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, }}>
                    <Image source={item.check == true ? Images.ImageJee.icTouchDaChon : Images.ImageJee.icTouchChuaChon} style={[nstyles.nIcon24, {}]} />
                    <Text style={{ fontSize: reText(16), marginLeft: 5 }}>{item.ngay}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    const _renderItemThang = ({ item, index }) => {
        return (
            <View style={{ marginBottom: 10, flex: 1, alignItems: 'center' }}>
                <TouchableOpacity onPress={() => { chooseData(item) }} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, }}>
                    <Image source={item.check == true ? Images.ImageJee.icTouchDaChon : Images.ImageJee.icTouchChuaChon} style={[nstyles.nIcon24, {}]} />
                    <Text style={{ fontSize: reText(16), marginLeft: 5 }}>{item.ngay}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    const PickAll = () => {
        let dataNgay = []
        dataNgay = data.map((item, index) => {
            let check = true
            return { ...item, check: check }
        })
        setData(dataNgay)
        setPickAll(true)
    }

    const CancelPickAll = () => {
        let dataNgay = []
        dataNgay = data.map((item, index) => {
            let check = false
            return { ...item, check: check }
        })
        setData(dataNgay)
        setPickAll(false)
    }

    return (
        <View style={[nstyles.ncontainer, { backgroundColor: colors.backgroundModal, justifyContent: 'flex-end', }]} >
            <Animated.View onTouchEnd={() => _goBack()}
                style={{
                    position: 'absolute', top: 0,
                    bottom: 0, left: 0, right: 0,
                    backgroundColor: colors.backgroundModal,
                    opacity
                }} />
            <View style={[styles.viewHome, {}]}>
                <HeaderModalCom title={RootLang.lang.JeeWork.chonngay} onPress={_goBack}></HeaderModalCom>
                <View style={{}}>
                    {
                        type.id == 1 ? (
                            <View style={{}}>
                                <FlatList
                                    data={data}
                                    renderItem={_renderItem}
                                    keyExtractor={(item, index) => index.toString()}
                                    numColumns={2}
                                />
                                <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                    {
                                        pickAll == false ?
                                            <TouchableOpacity
                                                onPress={() => { PickAll() }}
                                                style={styles.touchChonAll}>
                                                <Text style={styles.textXong}>Chọn tất cả</Text>
                                            </TouchableOpacity> :
                                            <TouchableOpacity
                                                onPress={() => { CancelPickAll() }}
                                                style={styles.touchChonAll}>
                                                <Text style={styles.textXong}>Huỷ chọn tất cả</Text>
                                            </TouchableOpacity>
                                    }
                                    <TouchableOpacity
                                        onPress={() => { _Done() }}
                                        style={styles.touchXong}>
                                        <Text style={styles.textXong}>
                                            {RootLang.lang.JeeWork.xong}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : (
                                <View style={{}}>
                                    <FlatList
                                        data={data}
                                        renderItem={_renderItemThang}
                                        keyExtractor={(item, index) => index.toString()}
                                        numColumns={4}
                                        style={{}}
                                        contentContainerStyle={{}}
                                    />
                                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20, flexDirection: 'row' }}>
                                        {
                                            pickAll == false ?
                                                <TouchableOpacity
                                                    onPress={() => { PickAll() }}
                                                    style={styles.touchChonAll}>
                                                    <Text style={styles.textXong}>Chọn tất cả</Text>
                                                </TouchableOpacity> :
                                                <TouchableOpacity
                                                    onPress={() => { CancelPickAll() }}
                                                    style={styles.touchChonAll}>
                                                    <Text style={styles.textXong}>Huỷ chọn tất cả</Text>
                                                </TouchableOpacity>
                                        }
                                        <TouchableOpacity
                                            onPress={() => { _Done() }}
                                            style={styles.touchXong}>
                                            <Text style={styles.textXong}>
                                                {RootLang.lang.JeeWork.xong}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>

                                </View>
                            )
                    }
                    <IsLoading ref={refLoading} />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    viewHome: {
        backgroundColor: 'white', paddingHorizontal: 10, borderTopRightRadius: 15, borderTopLeftRadius: 15, paddingBottom: paddingBotX + 10,
    },
    textXong: {
        fontSize: reText(16), color: colors.white, textAlign: 'center',
    },
    viewItemNgay: {
        marginBottom: 10, flex: 1,
    },
    touchXong: {
        justifyContent: 'center', alignItems: 'center', backgroundColor: '#207FF9', width: Width(40), paddingVertical: 15, borderRadius: 20
    },
    touchChonAll: {
        justifyContent: 'center', alignItems: 'center', backgroundColor: colors.colorKellyGreen, width: Width(40), paddingVertical: 15, borderRadius: 20, marginRight: 10
    }
});

const mapStateToProps = state => ({
    lang: state.changeLanguage.language,
});

export default Utils.connectRedux(PickDataChuKy, mapStateToProps, true)