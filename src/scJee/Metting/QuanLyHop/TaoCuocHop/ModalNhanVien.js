import React, { Component } from 'react';
import { Animated, FlatList, Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { getDSNhanVien } from '../../../../apis/JeePlatform/API_JeeMeeting/apiTaoCuocHop';
import Utils from '../../../../app/Utils';
import ListEmpty from '../../../../components/ListEmpty';
import HeaderModalCom from '../../../../Component_old/HeaderModalCom';
import nAvatar from '../../../../components/pickChartColorofAvatar'
import IsLoading from '../../../../components/IsLoading'
import { Images } from '../../../../images';
import { colors, fonts, sizes } from '../../../../styles';
import { nHeight, nstyles, nWidth, paddingBotX, paddingTopMul, Width } from '../../../../styles/styles';
import { RootLang } from '../../../../app/data/locales';

const HEIGHT_HEADER = 120;
export class ModalNhanVien extends Component {
    constructor(props) {
        super(props);
        this.callback = Utils.ngetParam(this, 'callback')
        this.list = Utils.ngetParam(this, 'list')
        this.type = Utils.ngetParam(this, 'type')
        this.state = ({
            opacity: new Animated.Value(0),
            listNhanVien: [],
            listFirst: [],
            listBack: this.list,
            showEmpty: false,
            keySearch: '',
            animation: new Animated.Value(1),
            zoom: new Animated.Value(nHeight(10) + paddingTopMul),
        })
        this.scrollValue = 0;
        this.headerVisible = true;
        this.searchFocus = false;
        this.translateY = this.state.animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, HEIGHT_HEADER / 2 - 2],
        });
        this.inputTranslateY = this.state.animation.interpolate({
            inputRange: [0, 1],
            outputRange: [HEIGHT_HEADER / 4, 0],
        });
    }
    onScroll = e => {
        if (this.searchFocus) return;
        const y = e.nativeEvent.contentOffset.y;
        if (y > this.scrollValue && this.headerVisible && y > HEIGHT_HEADER / 2) {
            Animated.spring(this.state.animation, {
                toValue: 0,
                useNativeDriver: true,
                bounciness: 0,
            }).start();
            this.headerVisible = false;
        }
        if (y < this.scrollValue && !this.headerVisible) {
            Animated.spring(this.state.animation, {
                toValue: 1,
                useNativeDriver: true,
                bounciness: 0,
            }).start();
            this.headerVisible = true;
        }
        this.scrollValue = y;
    };
    setZoom = () => {
        Animated.timing(this.state.zoom, {
            duration: 300,
            toValue: this.state.zoom._value == nHeight(10) + paddingTopMul ? nHeight(0) + paddingTopMul : nHeight(10) + paddingTopMul
        }).start();
    }
    componentDidMount = async () => {
        this._startAnimation(0.8)
        nthisLoading.show()
        this.loadDSNhanVien().then(res => {
            if (res)
                nthisLoading.hide()
        })
    }
    _startAnimation = (value) => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: value,
                duration: 300
            }).start();
        }, 400);
    };

    _endAnimation = (value) => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: value,
                duration: 1
            }).start();
        }, 1);
    };
    loadDSNhanVien = async () => {
        const res = await getDSNhanVien()
        // Utils.nlog("%cDanh sách nhân viên: ", 'background:#baff00; color:red; padding:0 4px; font-size: 40px', res)
        if (res.status == 1) {
            let temp = res.data.map(item => {
                return { ...item, check: this.list.find(x => x.idUser == item.idUser) ? true : false }
            })
            this.setState({ listNhanVien: temp, listFirst: temp, showEmpty: true })
        }
        return true
    }
    pickNhanVien = async (item, index) => {
        let { listNhanVien, listBack } = this.state
        listNhanVien[index].check = !listNhanVien[index].check
        const temp = listBack.find(x => x.idUser == item.idUser)
        if (!temp)
            listBack.push(item)
        if (temp && !listNhanVien[index].check)
            listBack.forEach((element, number) => {
                if (element.idUser == item.idUser)
                    listBack.splice(number, 1)
            });
        this.setState({ listNhanVien, listBack })
    }
    chonTatCa = (type) => { //type: 1 - chọn tất cả, 2 - xoá tất cả
        let { listNhanVien, listBack } = this.state
        listBack = []
        if (type == 1) {
            listNhanVien.forEach((item, index) => {
                listBack.push(item)
                listNhanVien[index].check = true
            })
        }
        if (type == 2) {
            listNhanVien.forEach((item, index) => {
                listNhanVien[index].check = false
            })
        }
        this.setState({ listNhanVien, listBack })
    }
    _goback() {
        const { listBack } = this.state
        this.callback(listBack, this.type)
        Utils.goback(this)
    }
    chuyenUnicode = (key = '') => {
        return key.toLocaleUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    }
    search = (key) => {
        const { listNhanVien, listFirst } = this.state
        if (key == '') {
            this.setState({ listNhanVien: listFirst })
            return
        }
        // let temp = listFirst.filter(item => this.chuyenUnicode(item.HoTen).indexOf(this.chuyenUnicode(key)) != -1 || this.chuyenUnicode(key).indexOf(this.chuyenUnicode(item.HoTen)) != -1)
        let temp = listFirst.filter(item => Utils.removeAccents(item.HoTen).toUpperCase().includes(Utils.removeAccents(key.toUpperCase())))
        this.setState({ listNhanVien: temp, keySearch: key })
    }
    noSearch = () => {
        this.setState({ listNhanVien: this.state.listFirst, keySearch: '' })
    }
    xoa = (item, index) => {
        let { listBack, listNhanVien } = this.state
        let number = listNhanVien.findIndex(x => x.idUser == item.idUser)
        if (number != -1)
            listNhanVien[number].check = false
        listBack.splice(index, 1)
        this.setState({ listBack, listNhanVien })
    }
    _renderListNhanVien = ({ item, index }) => {
        return (
            <TouchableOpacity style={styles.btnNhanVien} onPress={() => this.pickNhanVien(item, index)} activeOpacity={0.5}>
                <View style={styles.viewNhanVien}>
                    {
                        item.Image ?
                            <Image source={{ uri: item.Image }} style={styles.viewAvatar}></Image>
                            :
                            <View style={[styles.viewAvatar, { backgroundColor: nAvatar(item.HoTen).color }]}>
                                <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>{nAvatar(item.HoTen).chart}</Text>
                            </View>
                    }

                    <View style={{ justifyContent: 'center' }}>
                        <Text>{item.HoTen}</Text>
                        <Text style={{ color: 'blue', fontSize: 12 }}>{item.ChucVu}</Text>
                    </View>
                </View>
                <Image source={item.check ? Images.ImageJee.icBrowser : Images.ImageJee.icTouchChuaChon} style={nstyles.nIcon20}></Image>
            </TouchableOpacity>
        )
    }
    _renderListSelect = ({ item, index }) => {
        return (
            <TouchableOpacity onPress={() => this.xoa(item, index)}>
                {
                    item.Image ?
                        <Image source={{ uri: item.Image }} style={styles.viewAvatar}></Image>
                        :
                        <View style={[styles.viewAvatar, { backgroundColor: nAvatar(item.HoTen).color }]}>
                            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>{nAvatar(item.HoTen).chart}</Text>
                        </View>
                }
                <Image source={Images.ImageJee.icXoaAnh} style={[nstyles.nAva18, { position: 'absolute', top: 0, right: 5, borderWidth: 2, borderColor: colors.veryLightPinkTwo }]}></Image>
            </TouchableOpacity>
        )
    }

    render() {
        const { opacity, listNhanVien, showEmpty, listBack, keySearch, zoom } = this.state
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: 'transparent', justifyContent: 'flex-end', opacity: 1, }]} >
                <Animated.View onTouchEnd={
                    () => {
                        this.callback(this.state.listBack, this.type)
                        Utils.goback(this)
                    }
                }
                    style={{
                        position: 'absolute', top: 0,
                        bottom: 0, left: 0, right: 0,
                        backgroundColor: colors.backgroundModal, opacity
                    }} />
                <Animated.View style={{ backgroundColor: colors.white, flex: 1, marginTop: zoom, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                    <View style={{ height: HEIGHT_HEADER / 2, width: '100%', backgroundColor: 'white', zIndex: 2, elevation: 2, paddingHorizontal: 10, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                        <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', }}>
                            <View style={{ flexDirection: 'row', paddingTop: 7 }}>
                                <TouchableOpacity onPress={() => Utils.goback(this)} >
                                    <Image source={Images.icGoBackback} style={{ height: Width(7), width: Width(7), tintColor: colors.colorGrayIcon }} resizeMode={'contain'}></Image>
                                </TouchableOpacity>
                                <View style={{ alignItems: 'center', flex: 1 }}>
                                    <Image source={Images.icTopModal}></Image>
                                </View>
                                <TouchableOpacity onPress={() => this.setZoom()} >
                                    <Image source={Images.collapse} style={{ ...nstyles.nIcon24, tintColor: colors.colorGrayIcon }} resizeMode={'contain'}></Image>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <Text style={{
                                    fontSize: sizes.sizes.sText18, fontFamily: fonts.HelveticaBold, marginTop: -10,
                                    lineHeight: sizes.sizes.sText24, color: colors.colorTabActiveJeeHR, textAlign: 'center'
                                }}>
                                    {RootLang.lang.JeeMeeting.danhsachnhanvien}
                                </Text>
                            </View>
                        </View >
                    </View>
                    <Animated.View
                        style={{
                            transform: [{ translateY: this.translateY }], height: HEIGHT_HEADER / 2, backgroundColor: 'white', borderTopLeftRadius: 10, borderTopRightRadius: 10,
                            width: '100%', position: 'absolute', padding: 10, paddingHorizontal: 15, zIndex: 1, elevation: 1,
                            shadowColor: 'black', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 5, overflow: 'hidden',
                        }}>
                        <Animated.View
                            style={{
                                paddingHorizontal: 10,
                                flex: 1, backgroundColor: '#eee', borderRadius: 5, justifyContent: 'center', flexDirection: 'row', alignItems: 'center',
                                opacity: this.state.animation, transform: [{ translateY: this.inputTranslateY }],
                            }}>
                            <Image source={Images.icSearch} style={nstyles.nIcon20}></Image>
                            <TextInput
                                style={{ flex: 1, padding: 0, alignItems: 'center', paddingHorizontal: 15, fontSize: 15 }}
                                placeholder={RootLang.lang.JeeMeeting.timkiem}
                                onChangeText={(value) => this.search(value)}
                                onFocus={() => (this.searchFocus = true)}
                                onBlur={() => (this.searchFocus = false)}>
                                {keySearch}
                            </TextInput>
                            <TouchableOpacity onPress={() => this.noSearch()}>
                                <Image source={Images.ImageJee.icXoaLuaChon} style={nstyles.nIcon20}></Image>
                            </TouchableOpacity>
                        </Animated.View>
                    </Animated.View>
                    <FlatList
                        onScroll={this.onScroll}
                        data={listNhanVien}
                        contentContainerStyle={{ paddingTop: HEIGHT_HEADER / 2 }}
                        extraData={this.state}
                        renderItem={this._renderListNhanVien}
                        onEndReachedThreshold={0.1}
                        initialNumToRender={10}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item, index) => index.toString()}
                        ListEmptyComponent={listNhanVien.length == 0 && showEmpty ? <ListEmpty style={{ justifyContent: 'center', alignItems: 'center', }} textempty={RootLang.lang.JeeMeeting.khongcodulieu} /> : null} />
                </Animated.View>
                <KeyboardAvoidingView
                    style={{ backgroundColor: colors.veryLightPinkTwo }}
                    keyboardVerticalOffset={Platform.select({ ios: 0, android: 500 })}
                    behavior={Platform.OS == 'ios' ? "padding" : null}>
                    <FlatList
                        onContentSizeChange={() => this.refListBack.scrollToEnd({ animated: true })}
                        ref={ref => this.refListBack = ref}
                        style={{ marginVertical: listBack.length == 0 ? 0 : 5, paddingRight: 30 }}
                        data={listBack}
                        extraData={this.state}
                        renderItem={this._renderListSelect}
                        horizontal
                        onEndReachedThreshold={0.1}
                        initialNumToRender={10}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item, index) => index.toString()}
                    // ListEmptyComponent={listBack.length == 0 && showEmpty ? <ListEmpty style={{ justifyContent: 'center', alignItems: 'center', }} textempty={'Không có dữ liệu'} /> : null} 
                    />
                </KeyboardAvoidingView>
                <View style={styles.viewButton}>
                    <TouchableOpacity style={[styles.btnChon, { borderColor: colors.dodgerBlue }]} onPress={() => this.chonTatCa(1)}>
                        <Text style={[styles.txtChon, { color: colors.dodgerBlue, }]}>{RootLang.lang.JeeMeeting.chontatca}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.btnChon, { borderColor: colors.colorOrangeMN }]} onPress={() => this.chonTatCa(2)}>
                        <Text style={[styles.txtChon, { color: colors.colorOrangeMN }]}>{RootLang.lang.JeeMeeting.xoatatca}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.btnChon, { borderColor: colors.greenTab }]} onPress={() => {
                        this.callback(this.state.listBack, this.type)
                        Utils.goback(this)
                    }} >
                        <Text style={[styles.txtChon, { color: colors.greenTab }]}>{RootLang.lang.JeeMeeting.luu}</Text>
                    </TouchableOpacity>
                </View>
                <IsLoading />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    btnNhanVien: {
        flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: colors.textGray, justifyContent: 'space-between',
        alignItems: 'center', paddingHorizontal: 20
    },
    viewAvatar: {
        ...nstyles.nAva40, marginRight: 10, justifyContent: 'center', alignItems: 'center'
    },
    viewNhanVien: {
        alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row'
    },
    viewButton: {
        height: nHeight(8), backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingBottom: paddingBotX
    },
    btnChon: {
        paddingVertical: 5, width: nWidth(30), alignItems: 'center', justifyContent: 'center', borderRadius: 10, borderWidth: 1
    },
    txtChon: {
        fontWeight: 'bold'
    },
})
export default ModalNhanVien
