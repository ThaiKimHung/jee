import _ from 'lodash';
import moment from 'moment';
import React, { Component, createRef } from 'react';
import {
    Animated,
    Image,
    Keyboard,
    LayoutAnimation, PanResponder,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity, View,
    ScrollView, BackHandler, FlatList
} from 'react-native';
import Dash from 'react-native-dash';
import { RootLang } from '../../../../app/data/locales';
import Utils from '../../../../app/Utils';
import { Images } from '../../../../images';
import { colors } from '../../../../styles/color';
import { reText, sizes } from '../../../../styles/size';
import { Height, nstyles, Width } from '../../../../styles/styles';
import UtilsApp from '../../../../app/UtilsApp';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ActionSheetCustom as ActionSheet } from '@alessiocancian/react-native-actionsheet'
import IsLoading from '../../../../components/IsLoading';
import HTML from 'react-native-render-html';
import { TaoCongViec } from '../../../../apis/JeePlatform/API_JeeWork/apiCongViecQuyTrinh'

var RNFS = require('react-native-fs');
const DEVICE_HEIGHT = Height(100);
const CANCEL_INDEX = 0

class TaoGiaoViec_CVQT extends Component {
    constructor(props) {
        super(props);
        this.refLoading = React.createRef()
        this.state = ({
            animation: "easeInEaseOut",
            opacity: new Animated.Value(0),
            tencongviec: "",
            keyboardStatus: undefined,
            collapsed: true,
            mota: '',
            scrollEnable: false,
            minumun: false,
            nguoiTH: [],
            nguoiTheoDoi: [],
            listPiority: [
                { row: 0, name: RootLang.lang.JeeWork.khongcodouutien, color: "grey" },
                { row: 1, name: RootLang.lang.JeeWork.douutienkhancap, color: "#DA3849" },
                { row: 2, name: RootLang.lang.JeeWork.douutiencao, color: '#F2C132' },
                { row: 3, name: RootLang.lang.JeeWork.douutienbinhthuong, color: '#6E47C9' },
                { row: 4, name: RootLang.lang.JeeWork.douutienthap, color: '#6F777F' },
            ],
            piority: {},
            thoigianhoanthanh: 0,
            stageid: Utils.ngetParam(this, 'stageid', ''),
            data: Utils.ngetParam(this, 'item', ''),
            chinhsua: Utils.ngetParam(this, 'chinhsua', false),
        })
        this.callback = Utils.ngetParam(this, 'callback');
        this.disablePressToShow = true;
        this.SWIPE_HEIGHT = Height(33)
        this.keyboardHeight = 0;
        this._panResponder = null;
        this.top = this.SWIPE_HEIGHT;
        this.height = this.SWIPE_HEIGHT;
        this.customStyle = {
            style: {
                bottom: 0,
                top: this.top,
                height: this.height
            }
        };
        this.checkCollapsed = true;
        this.animation = "";
        this.showFull = this.showFull.bind(this);
    }


    componentDidMount() {
        // Utils.nlog('data', this.state.data, this.state.chinhsua)
        this._startAnimation(0.8)
        this._backHandler = BackHandler.addEventListener('hardwareBackPress', this._backHandlerButton)
        this.keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            this._keyboardDidShow,
        );
        this.keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            this._keyboardDidHide,
        );
        this._checkData()
    }

    _checkData = () => {
        const { data, chinhsua } = this.state
        if (chinhsua) {
            let pior = ''
            this.state.listPiority.map(i => {
                if (i.row == data.Priority) {
                    pior = i
                }
            })
            this.setState({
                tencongviec: data.TaskName,
                mota: data.Description,
                nguoiTH: data.Data_Implementer,
                nguoiTheoDoi: data.Data_Follower,
                thoigianhoanthanh: data.NumberofTime ? data.NumberofTime : "0",
                piority: pior
            })
        }
    }

    componentWillUnmount() {
        this._backHandler.remove()
    }
    _backHandlerButton = () => {
        this._goBack()
        return true
    }
    ViewItemlagPiority = (item) => {
        return (
            <View key={item.row.toString()} style={{ flexDirection: "row", alignSelf: "center" }}>
                <View style={{ paddingHorizontal: 10 }}>
                    <Image source={item.row == 0 ? Images.JeeCloseModal : Images.ImageJee.icCoKhongUuTien} resizeMode={"contain"} style={{ tintColor: item.color, width: 20, height: 20 }} />
                </View>
                <Text style={{
                    textAlign: "center", fontSize: sizes.sText16,
                    alignSelf: "center",
                    color: this.state.piority.row == item.row ? colors.colorTabActive : 'black',
                    fontWeight: this.state.piority.row == item.row ? "bold" : 'normal'
                }}>{item.name ? item.name : ""}</Text>
            </View>
        )
    }

    _FlagPiority = () => {
        Utils.goscreen(this, 'Modal_ComponentSelectCom', { callback: this._callbackFlagPiority, item: this.state.piority, AllThaoTac: this.state.listPiority, ViewItem: this.ViewItemlagPiority })
    }

    _callbackFlagPiority = (piority) => {
        try {
            this.setState({ piority });
        } catch (error) { }
    }

    _ThemNguoiThucHien = () => {
        Utils.goscreen(this, 'Modal_ChonNhanVien', { callback: this._callBackNhanVien, nvCoSan: this.state.nguoiTH })
    }

    _ThemNhanVienTheoDoi = () => {
        Utils.goscreen(this, 'Modal_ChonNhanVien', { callback: this._callBackNhanVienTheoDoi, nvCoSan: this.state.nguoiTheoDoi })
    }

    _callBackNhanVien = (nguoiTH) => {
        try {
            this.setState({ nguoiTH });
        } catch (error) { }
    }

    _callBackNhanVienTheoDoi = (nguoiTheoDoi) => {
        try {
            this.setState({ nguoiTheoDoi });
        } catch (error) { }
    }

    componentWillUnmount() {
        Keyboard.removeListener('keyboardDidShow', this._keyboardDidShow);
        Keyboard.removeListener('keyboardDidHide', this._keyboardDidHide);
    }

    UNSAFE_componentWillMount() {
        const { collapsed } = this.state
        this._panResponder = PanResponder.create({
            onMoveShouldSetPanResponder: (event, gestureState) => true,
            onPanResponderMove: this._onPanResponderMove.bind(this),
            onPanResponderRelease: this._onPanResponderRelease.bind(this)
        });
    }
    _keyboardDidShow = (e) => {
        const { collapsed } = this.state
        if (collapsed == true) {
            this.SWIPE_HEIGHT = Platform.OS == 'android' ? this.SWIPE_HEIGHT : this.SWIPE_HEIGHT + e.endCoordinates.height * 0.95
            this._panResponder = null
            this.keyboardHeight = e.endCoordinates.height
            this.setState({ scrollEnable: true });
        }
    }

    _keyboardDidHide = () => {
        const { collapsed } = this.state
        if (collapsed == true) {
            this.SWIPE_HEIGHT = Height(33)
            this.keyboardHeight = 0
            this._panResponder = PanResponder.create({
                onMoveShouldSetPanResponder: (event, gestureState) => true,
                onPanResponderMove: this._onPanResponderMove.bind(this),
                onPanResponderRelease: this._onPanResponderRelease.bind(this)
            });
            this.setState({ keyboardStatus: 'Keyboard Hidden', scrollEnable: false });
        }
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

    _onPanResponderRelease(event, gestureState) {
        if (gestureState.dy < -100 || gestureState.dy < 100) {
            this.showFull();
        } else {
            this.showMini();
        }
    }

    showFull() {
        const { onShowFull, heighFull } = this.props;
        this.customStyle.style.top = DEVICE_HEIGHT * 0.08;
        this.customStyle.style.height = DEVICE_HEIGHT * 1;
        this.swipeIconRef &&
            this.swipeIconRef.setState({ icon: Images.icDropdownNew, showIcon: true });
        LayoutAnimation.easeInEaseOut();
        this.viewRef.setNativeProps(this.customStyle);
        this.state.collapsed && this.setState({ collapsed: false });
        this.checkCollapsed = false;
        this._panResponder = null
        this.setState({ minumun: true })
    }

    showMini() {
        this.customStyle.style.top = this._itemMini()
            ? DEVICE_HEIGHT - this.SWIPE_HEIGHT
            : DEVICE_HEIGHT;
        this.customStyle.style.height = this._itemMini() ? this.SWIPE_HEIGHT : 0;
        this.swipeIconRef && this.swipeIconRef.setState({ showIcon: false });
        LayoutAnimation.easeInEaseOut();
        this.viewRef.setNativeProps(this.customStyle);
        !this.state.collapsed && this.setState({ collapsed: true });
        this.checkCollapsed = true;
    }

    _onPanResponderMove(event, gestureState) {
        const { collapsed } = this.state
        if (gestureState.dy > 0 && !this.checkCollapsed) {
            // SWIPE DOWN

            this.customStyle.style.top = this.top + gestureState.dy;
            this.customStyle.style.height = DEVICE_HEIGHT - gestureState.dy;
            this.swipeIconRef && this.swipeIconRef.setState({ icon: Images.icTopModal });
            !this.state.collapsed && this.setState({ collapsed: true });
            LayoutAnimation.easeInEaseOut();
            this.viewRef.setNativeProps(this.customStyle);
        } else if (this.checkCollapsed && gestureState.dy < -60) {
            // SWIPE UP
            this.top = 0;
            this.customStyle.style.top = DEVICE_HEIGHT + gestureState.dy;
            this.customStyle.style.height = -gestureState.dy + 200;
            this.swipeIconRef &&
                this.swipeIconRef.setState({ icon: Images.icTopModal, showIcon: true });
            if (this.customStyle.style.top <= DEVICE_HEIGHT / 2) {
                this.swipeIconRef &&
                    this.swipeIconRef.setState({
                        icon: Images.icDropdownNew,
                        showIcon: true
                    });
            }
            LayoutAnimation.easeInEaseOut();
            this.viewRef.setNativeProps(this.customStyle);
        }
    }

    _goBack = () => {
        this._endAnimation(0)
        this.callback()
        Utils.goback(this)
    };

    _goBackEnd = () => {
        this._endAnimation(0)
        // this.callback()
        Utils.goback(this)
    };

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

    tang_giam_ThoiGianHT = (tang) => {
        let thoigian = this.state.thoigianhoanthanh
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
        this.setState({
            thoigianhoanthanh: thoigian
        })
    }

    _itemMini = () => {
        var { tencongviec, nguoiTH, piority, nguoiTheoDoi, thoigianhoanthanh, mota, chinhsua } = this.state
        return (
            <View style={[styles.khungMini, { marginBottom: Platform.OS == 'android' ? 10 : 20 + this.keyboardHeight }]}>
                <View style={styles.khungconMini}>
                    <View {...this._panResponder?.panHandlers}>
                        <View style={{ flex: 1, alignItems: 'center', marginBottom: 10 }}>
                            <Image source={Images.icTopModal} resizeMode={'cover'} />
                        </View>
                        <Text style={styles.taocongviec}>{chinhsua ? RootLang.lang.JeeWork.chinhsuacongviec : RootLang.lang.JeeWork.taocongviec}</Text>
                    </View>
                    <ScrollView
                        ref={ref => { this.scrollView = ref }}
                        onContentSizeChange={() => this.scrollView.scrollToEnd({ animated: true })}
                        style={styles.colum}>
                        <TextInput
                            style={styles.textInput}
                            placeholder={RootLang.lang.JeeWork.tencongviec}
                            placeholderTextColor={colors.colorPlayhoder}
                            onChangeText={(tencongviec) => this.setState({ tencongviec })}
                            value={this.state.tencongviec ? this.state.tencongviec : null}
                            ref={ref => this.tencongviec = ref}
                        />
                        <View style={styles.row} >
                            <ScrollView style={styles.row} horizontal >
                                <TouchableOpacity
                                    disabled={chinhsua ? true : false}
                                    style={styles.touchhNguoi}
                                    onPress={() => { this._ThemNguoiThucHien() }}  >
                                    {
                                        _.size(nguoiTH) > 0 ?
                                            <View style={{ width: _.size(nguoiTH) < 3 ? Width(_.size(nguoiTH) * 14) : Width(_.size(nguoiTH) * 9), flexDirection: "row", alignItems: "center", paddingVertical: 15 }}>
                                                <View style={{ position: "absolute" }}>
                                                    <Image source={Images.ImageJee.icChonNguoiThamGia} style={{}} />
                                                </View>
                                                {nguoiTH.map((item, index) => {
                                                    return (
                                                        <View style={{
                                                            flexDirection: "row", position: "absolute",
                                                            left: index > 4 ? 5 * 22 : index * 22,
                                                            marginLeft: 30,
                                                            width: 25, height: 25, borderRadius: 99, backgroundColor: item.BgColor ? item.BgColor : this.intToRGB(this.hashCode(item.FullName ? item.FullName : item.ObjectName)),
                                                        }} key={index}>
                                                            <Text style={{ left: 4, alignSelf: "center", fontWeight: "bold", fontSize: reText(12), color: colors.white }}>{index > 4 ? "+" + `${nguoiTH.length - 5}` : String(item.FullName ? item.FullName : item.ObjectName).split(" ").slice(-1).toString().slice(0, 2).toString()}</Text>
                                                        </View>
                                                    )
                                                })}
                                            </View>
                                            :
                                            <View style={styles.khungconTouchNguoi}>
                                                <Image source={Images.ImageJee.icChonNguoiThamGia} style={[{}]} />
                                                <Text style={styles.textNguoi}>{RootLang.lang.JeeWork.nguoithuchien}</Text>
                                            </View>
                                    }
                                </TouchableOpacity>
                                <TouchableOpacity
                                    disabled={chinhsua ? true : false}
                                    style={styles.touchhNguoi}
                                    onPress={() => { this._ThemNhanVienTheoDoi() }}  >
                                    {
                                        nguoiTheoDoi.length > 0 ?
                                            <View style={{ width: _.size(nguoiTheoDoi) < 3 ? Width(_.size(nguoiTheoDoi) * 14) : Width(_.size(nguoiTheoDoi) * 9), flexDirection: "row", alignItems: "center", paddingVertical: 15 }}>
                                                <View style={{ position: "absolute" }}>
                                                    <Image source={Images.ImageJee.icChonNguoiThamGia} style={[{}]} />
                                                </View>
                                                {nguoiTheoDoi.map((item, index) => {
                                                    return (
                                                        <View style={{
                                                            flexDirection: "row", position: "absolute",
                                                            left: index > 4 ? 5 * 22 : index * 22,
                                                            marginLeft: 30,
                                                            width: 25, height: 25, borderRadius: 99, backgroundColor: item.BgColor ? item.BgColor : this.intToRGB(this.hashCode(item.FullName ? item.FullName : item.ObjectName)),
                                                        }} key={index}>
                                                            <Text style={{ left: 4, alignSelf: "center", fontWeight: "bold", fontSize: reText(12), color: colors.white }}>{index > 4 ? "+" + `${nguoiTheoDoi.length - 5}` : String(item.FullName ? item.FullName : item.ObjectName).split(" ").slice(-1).toString().slice(0, 2).toString()}</Text>
                                                        </View>
                                                    )
                                                })}
                                            </View>
                                            :
                                            <View style={styles.khungconTouchNguoi}>
                                                <Image source={Images.ImageJee.icChonNguoiThamGia} style={[{}]} />
                                                <Text style={styles.textNguoi}>{RootLang.lang.JeeWork.nguoitheodoi} </Text>
                                            </View>
                                    }
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                        <View style={styles.khungthoigianhoanthanhMini}>
                            <View style={{ flex: 1 }}>
                                <TextInput
                                    style={styles.textInput_khongWith}
                                    keyboardType='numeric'
                                    placeholder={RootLang.lang.JeeWork.thoigianhoanthanh}
                                    placeholderTextColor={colors.colorPlayhoder}
                                    onChangeText={(text) => this.setState({ thoigianhoanthanh: Number(text) })}
                                    value={this.state.thoigianhoanthanh ? this.state.thoigianhoanthanh.toString() : null}
                                />
                            </View>
                            <View style={styles.row_center}>
                                <TouchableOpacity style={{ padding: 6, backgroundColor: thoigianhoanthanh == 0 ? colors.colorBtnGray : "#E4E6EB", marginRight: 8 }}
                                    onPress={() => { this.tang_giam_ThoiGianHT(false) }}
                                    disabled={thoigianhoanthanh == 0 ? true : false}
                                >
                                    <Image source={Images.ImageJee.icDropdown} style={[{}]} />

                                </TouchableOpacity>
                                <TouchableOpacity style={{ padding: 6, backgroundColor: "#E4E6EB", marginRight: 8 }}
                                    onPress={() => { this.tang_giam_ThoiGianHT(true) }}  >
                                    <Image source={Images.ImageJee.icDropdownReverse} style={[{}]} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>

                </View >
                <View style={{}}>
                    <Dash
                        dashColor={"#E4E6EB"}
                        style={{ width: Width(100) }}
                        dashGap={0}
                        dashThickness={1} />
                    <View style={styles.khungbottomMini}>
                        <View style={styles.khungbocTouchMini}>
                            <TouchableOpacity
                                onPress={() => { this._FlagPiority() }}
                                style={{ padding: 13 }}>

                                <Image source={piority.row == 0 ? Images.JeeCloseModal : Images.ImageJee.icCoKhongUuTien} resizeMode={"contain"} style={{ tintColor: _.size(piority) > 0 ? piority.color : "#B3B3B3", width: 20, height: 20 }} />
                            </TouchableOpacity>

                        </View>
                        <View style={styles.khungNutgui}>
                            <Dash
                                dashColor={colors.colorTextBTGray}
                                style={{ height: Height(3), flexDirection: 'column' }}
                                dashGap={0}
                                dashThickness={1} />
                            <TouchableOpacity
                                disabled={tencongviec.length > 0 ? false : true}
                                onPress={() => { this._CreateCongViec() }} style={{ padding: 13 }}>
                                <Image source={Images.ImageJee.icSend} resizeMode={"contain"} style={{ tintColor: tencongviec.length > 0 ? "green" : "#B3B3B3", width: 20, height: 20 }} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View >
        )
    }

    _minimum = async () => {
        this._panResponder = await PanResponder.create({
            onMoveShouldSetPanResponder: (event, gestureState) => true,
            onPanResponderMove: this._onPanResponderMove.bind(this),
            onPanResponderRelease: this._onPanResponderRelease.bind(this)
        })
        return true
    }

    _itemFull = () => {
        var { tencongviec, piority, nguoiTH, Child, nguoiTheoDoi, thoigianhoanthanh, mota, chinhsua } = this.state
        return (
            <View onPress={Keyboard.dismiss} accessible={false} style={{ flex: 1 }}>
                <View style={styles.taocongviecFull}>
                    <View style={styles.khungheader}>
                        <Image source={Images.icTopModal} resizeMode={'cover'} />
                    </View>
                    <Text style={styles.taocongviec}>{chinhsua ? RootLang.lang.JeeWork.chinhsuacongviec : RootLang.lang.JeeWork.taocongviec}</Text>
                </View>
                <KeyboardAwareScrollView
                    keyboardDismissMode="on-drag"
                    extraScrollHeight={Platform.OS == 'ios' ? Height(9) : Height(30)} enableOnAndroid={true}
                    style={[nstyles.ncontainer, { backgroundColor: '#E4E6EB', width: Width(100), marginBottom: Platform.OS === 'android' ? 5 : 10 }]}>
                    <View style={{ backgroundColor: colors.white, }}>
                        <View style={styles.khungnhaplieu}>
                            <View style={styles.khungnhaplieucon}>
                                <TextInput
                                    style={styles.textinput_tencv}
                                    placeholder={Child ? RootLang.lang.JeeWork.tencongvieccon : RootLang.lang.JeeWork.tencongviec}
                                    placeholderTextColor={colors.colorPlayhoder}
                                    value={tencongviec}
                                    onChangeText={(tencongviec) => this.setState({ tencongviec })}
                                    value={this.state.tencongviec ? this.state.tencongviec : null}
                                    ref={ref => this.tencongviec = ref}
                                />
                            </View>
                            <View style={styles.khungnhaplieucon}>
                                <Text style={styles.textNhaplieu}>{RootLang.lang.JeeWork.mucdouutien}</Text>
                                <TouchableOpacity onPress={() => { this._FlagPiority() }} style={{ flexDirection: 'row' }}>
                                    <Image source={piority.row == 0 ? Images.JeeCloseModal : Images.ImageJee.icCoKhongUuTien} style={[{ marginRight: 8, tintColor: _.size(piority) > 0 ? piority.color : "#B3B3B3", width: 20, height: 20 }]} />
                                    <Text style={{ fontSize: sizes.sText12, color: '#65676B', textAlign: 'center', fontWeight: 'bold', alignSelf: "center" }}>{_.size(piority) > 0 ? piority.name : RootLang.lang.JeeWork.chonmucdouutien}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.khungnhaplieucon}>
                                <Text style={styles.textNhaplieu}>{RootLang.lang.JeeWork.nguoithuchien}</Text>
                                <TouchableOpacity
                                    disabled={chinhsua ? true : false}
                                    onPress={() => { this._ThemNguoiThucHien() }} style={{ flexDirection: 'row' }}>
                                    {
                                        nguoiTH.length > 0 ?
                                            <View style={{ width: _.size(nguoiTH) > 5 ? Width(30) : _.size(nguoiTH) * Width(5), flexDirection: "row", alignItems: "center", }}>
                                                {nguoiTH.map((item, index) => {
                                                    return (
                                                        <View style={{
                                                            flexDirection: "row", position: "absolute",
                                                            left: index > 4 ? 5 * 22 : index * 22,
                                                            width: 25, height: 25, borderRadius: 99, backgroundColor: item.BgColor ? item.BgColor : this.intToRGB(this.hashCode(item.FullName ? item.FullName : item.ObjectName)),
                                                        }} key={index}>
                                                            <Text style={styles.textNV}>{index > 4 ? "+" + `${nguoiTH.length - 5}` : String(item.FullName ? item.FullName : item.ObjectName).split(" ").slice(-1).toString().slice(0, 2).toString()}</Text>
                                                        </View>
                                                    )
                                                })}
                                            </View>
                                            : <>
                                                <Image source={Images.ImageJee.icChonNguoiThamGia} style={[{}]} />
                                            </>
                                    }
                                </TouchableOpacity>
                            </View>
                            <View style={styles.khungnhaplieucon}>
                                <Text style={styles.textNhaplieu}>{RootLang.lang.JeeWork.nguoitheodoi}</Text>
                                <TouchableOpacity
                                    disabled={chinhsua ? true : false}
                                    onPress={() => { this._ThemNhanVienTheoDoi() }} style={{ flexDirection: 'row' }}>
                                    {
                                        nguoiTheoDoi.length > 0 ?
                                            <View style={{ width: _.size(nguoiTheoDoi) > 5 ? Width(30) : _.size(nguoiTheoDoi) * Width(5), flexDirection: "row", alignItems: "center", }}>
                                                {nguoiTheoDoi.map((item, index) => {
                                                    return (
                                                        <View style={{
                                                            flexDirection: "row", position: "absolute",
                                                            left: index > 4 ? 5 * 22 : index * 22,
                                                            width: 25, height: 25, borderRadius: 99, backgroundColor: item.BgColor ? item.BgColor : this.intToRGB(this.hashCode(item.FullName ? item.FullName : item.ObjectName)),
                                                        }} key={index}>
                                                            <Text style={styles.textNV}>{index > 4 ? "+" + `${nguoiTheoDoi.length - 5}` : String(item.FullName ? item.FullName : item.ObjectName).split(" ").slice(-1).toString().slice(0, 2).toString()}</Text>
                                                        </View>
                                                    )
                                                })}
                                            </View>
                                            : <>
                                                <Image source={Images.ImageJee.icChonNguoiThamGia} style={[{}]} />
                                            </>
                                    }
                                </TouchableOpacity>
                            </View>
                            <View style={styles.khungnhaplieucon}>
                                <Text style={styles.textNhaplieu}>{RootLang.lang.JeeWork.thoigianhoanthanh}</Text>
                                <View style={styles.khungthoigianhoanthanhFull}>
                                    <View style={{ width: thoigianhoanthanh ? Width(10) : Width(35) }}>
                                        <TextInput
                                            style={[styles.textInput_khongWith, { paddingLeft: 5 }]}
                                            keyboardType='numeric'
                                            placeholder={RootLang.lang.JeeWork.thoigianhoanthanh}
                                            placeholderTextColor={colors.colorPlayhoder}
                                            onChangeText={(text) => this.setState({ thoigianhoanthanh: Number(text) })}
                                            value={this.state.thoigianhoanthanh ? this.state.thoigianhoanthanh.toString() : null}
                                        />
                                    </View>
                                    <View style={styles.row_center}>
                                        <TouchableOpacity style={{ padding: 6, backgroundColor: thoigianhoanthanh == 0 ? colors.colorBtnGray : "#E4E6EB", marginRight: 8 }}
                                            onPress={() => { this.tang_giam_ThoiGianHT(false) }}
                                            disabled={thoigianhoanthanh == 0 ? true : false} >
                                            <Image source={Images.ImageJee.icDropdown} style={[{}]} />
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ padding: 6, backgroundColor: "#E4E6EB", marginRight: 8 }}
                                            onPress={() => { this.tang_giam_ThoiGianHT(true) }}  >
                                            <Image source={Images.ImageJee.icDropdownReverse} style={[{}]} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={{ marginTop: 10, backgroundColor: colors.white, padding: 10 }}>
                        <Text style={styles.motaCv}>{RootLang.lang.JeeWork.motacongviec}</Text>
                        {
                            <TouchableOpacity
                                onPress={() => Utils.goscreen(this, 'Modal_EditHTML', {
                                    title: 'Mô tả công việc',
                                    isEdit: true,
                                    content: mota,
                                    isVoice: false,
                                    callback: (html) => {
                                        this.setState({ mota: html })
                                    }
                                })}
                                style={{ borderColor: '#D1D1D1', borderWidth: 0.3, minHeight: Height(6), marginTop: 10, backgroundColor: '#F7F8FA' }}>
                                {mota ?
                                    <HTML source={{ html: mota }} containerStyle={{ paddingHorizontal: 10, paddingVertical: 10 }} /> :
                                    <Text style={styles.themmota}> {RootLang.lang.JeeWork.themmota}</Text>}
                            </TouchableOpacity>
                        }
                    </View>
                    <TouchableOpacity
                        disabled={tencongviec.length > 0 ? false : true}
                        onPress={() => {
                            this._CreateCongViec()
                        }}
                        style={{
                            borderColor: '#D1D1D1', borderWidth: 0.3,
                            marginLeft: 10, marginRight: 10, marginBottom: 100,
                            height: Height(6), justifyContent: 'center',
                            alignItems: 'center', backgroundColor: tencongviec.length > 0 ? colors.colorJeeNew.colorChuDao : "#65676B",
                        }}>
                        <Text style={{ fontSize: sizes.sText14, color: 'white', fontWeight: 'bold' }}>{chinhsua ? RootLang.lang.JeeWork.chinhsuacongviec : RootLang.lang.JeeWork.taocongviecmoi}</Text>
                    </TouchableOpacity>
                </KeyboardAwareScrollView>
            </View >
        )
    }

    _CreateCongViec = async () => {
        const { chinhsua } = this.state
        //Time_Type : 1 giờ, 3 không giớ hạn thời gian hoàn thành , NumberofTime: số giờ yêu cầu
        this.refLoading.current.show()
        let Data_Implementer = []
        this.state.nguoiTH.map(item => {
            Data_Implementer.push({
                "ObjectID": item.UserId,
                "ObjectType": "3"
            })
        })
        let Data_Follower = []
        this.state.nguoiTheoDoi.map(item => {
            Data_Follower.push({
                "ObjectID": item.UserId,
                "ObjectType": "3"
            })
        })
        let strbody = ''
        if (chinhsua) {
            strbody = {
                "Data_Implementer": Data_Implementer,
                "Data_Follower": Data_Follower,
                "RowID": this.state.data.RowID,
                "NodeID": this.state.stageid,
                "TaskName": this.state.tencongviec,
                "Time_Type": this.state.thoigianhoanthanh == 0 ? 3 : 1,
                "NumberofTime": this.state.thoigianhoanthanh != 0 ? this.state.thoigianhoanthanh : 0,
                "Priority": this.state.piority.row ? this.state.piority.row : 0,
                "Description": this.state.mota,
                "_isDeleted": false,
                "_isEditMode": false,
                "_isNew": false,
                "_isUpdated": false,
                "_prevState": null,
                "_userId": 0,
            }
        }
        else {
            strbody = {
                "Data_Implementer": Data_Implementer,
                "Data_Follower": Data_Follower,
                "RowID": 0,
                "NodeID": this.state.stageid,
                "TaskName": this.state.tencongviec,
                "Time_Type": this.state.thoigianhoanthanh == 0 ? 3 : 1,
                "NumberofTime": this.state.thoigianhoanthanh != 0 ? this.state.thoigianhoanthanh : 0,
                "Priority": this.state.piority.row ? this.state.piority.row : 0,
                "Description": this.state.mota
            }
        }
        // Utils.nlog('str', strbody)
        const res = await TaoCongViec(strbody)
        // Utils.nlog('res _CreateCongViec', res)
        if (res.status == 1) {
            this.refLoading.current.hide()
            if (chinhsua) {
                UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, RootLang.lang.JeeWork.chinhsuathanhcong, 1)
                this._goBack()
            }
            else {
                Utils.showMsgBoxYesNo(this, RootLang.lang.JeeWork.thongbao, RootLang.lang.JeeWork.taocongviecmoithanhcongbancomuon, RootLang.lang.JeeWork.taocongviecmoi, RootLang.lang.JeeWork.thoat, () => {
                    this.tencongviec.clear()
                    this.setState({
                        nguoiTH: [],
                        nguoiTheoDoi: [],
                        mota: '',
                        piority: {},
                        tencongviec: '',
                        thoigianhoanthanh: 0,
                    })
                }, () => { this._goBack() }
                )
            }
        }
        else {
            this.refLoading.current.hide()
            UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, res.error ? res.error.message : RootLang.lang.JeeWork.loitaocongviecvuilong, 2)
        }
    }

    render() {
        const { opacity, collapsed } = this.state
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: `transparent`, justifyContent: 'flex-end' }]}>
                <Animated.View
                    onTouchEnd={this._goBackEnd}
                    style={[styles.animated, { opacity, }]} />
                <View
                    ref={ref => (this.viewRef = ref)}
                    style={[
                        styles.wrapSwipe,
                        {
                            height: this.SWIPE_HEIGHT,
                            backgroundColor: 'white'
                        },
                        !this._itemMini() && collapsed && { marginBottom: -200 },
                    ]}
                >
                    {collapsed ? (
                        this._itemMini() ? (
                            <View
                                style={{ height: this.SWIPE_HEIGHT }}
                            >
                                {this._itemMini()}
                            </View>
                        ) : null
                    ) : (
                        this._itemFull()
                    )}
                </View>
                <IsLoading ref={this.refLoading} />
            </View >

        )
    }
}

const styles = StyleSheet.create({
    animated: {
        position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
        backgroundColor: colors.backgroundModal, alignItems: 'flex-end',
    },
    wrapSwipe: {
        backgroundColor: '#ccc',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    hinhtron: {
        height: Height(3),
        width: Height(3),
        padding: 0,
        borderStyle: 'dashed',
        borderWidth: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20
    },
    touchhNguoi: {
        borderColor: "#E4E6EB", marginRight: 10, borderWidth: 0.7, padding: 5, borderRadius: 5, flexDirection: "row"
    },
    khungconTouchNguoi: {
        flexDirection: "row", justifyContent: 'center', alignItems: 'center'
    },
    textNguoi: {
        color: colors.black_70, marginLeft: 5
    },
    khungbottomMini: {
        flexDirection: "row", paddingLeft: 10
    },
    khungbocTouchMini: {
        flexDirection: "row", flex: 1,
    },
    khungNutgui: {
        flexDirection: "row", justifyContent: "center", alignContent: "center", alignItems: "center"
    },
    row: {
        flexDirection: 'row'
    },
    colum: {
        flexDirection: 'column'
    },
    textInput: {
        marginVertical: 5,
        width: '100%',
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
        paddingVertical: 10, backgroundColor: colors.white,
    },
    textInput_khongWith: {
        marginVertical: 5,
        width: '100%',
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
        paddingVertical: 10, backgroundColor: colors.white,
    },
    taocongviec: {
        fontSize: 18, color: colors.black, fontWeight: "600"
    },
    khungMini: {
        flex: 1,
    },
    khungconMini: {
        paddingLeft: 16, padding: 10, flex: 1,
    },
    taocongviecFull: {
        paddingLeft: 16, padding: 10,
    },
    khungheader: {
        flex: 1, alignItems: 'center', marginBottom: 10,
    },
    khungnhaplieu: {
        backgroundColor: '#F7F8FA', marginHorizontal: 16, marginVertical: 12
    },
    khungnhaplieucon: {
        flexDirection: 'row', justifyContent: 'space-between', height: Height(6), borderBottomWidth: 0.3, alignItems: 'center', paddingHorizontal: 10, borderColor: '#E4E6EB'
    },
    textNhaplieu: {
        fontSize: reText(12), color: '#65676B', textAlign: 'center'
    },
    textinput_tencv: {
        marginVertical: 5,
        width: '100%',
        flexDirection: 'row',
        paddingVertical: 10,
    },
    textNV: {
        left: 4, alignSelf: "center", fontWeight: "bold", fontSize: reText(12), color: colors.white
    },
    khungthoigianhoanthanhMini: {
        flexDirection: 'row', borderColor: "#E4E6EB", borderWidth: 0.7, width: Width(75), borderRadius: 10, marginTop: 5
    },
    khungthoigianhoanthanhFull: {
        flexDirection: 'row', borderColor: "#E4E6EB", borderWidth: 0.7, borderRadius: 10, marginTop: 5
    },
    row_center: {
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
    },
    motaCv: {
        color: '#65676B', fontSize: reText(12), fontWeight: 'bold'
    },
    themmota: {
        fontSize: sizes.sText12, color: '#65676B', fontWeight: 'bold', alignSelf: 'center', marginTop: Height(2)
    }
});

const mapStateToProps = state => ({
    lang: state.changeLanguage.language,
    reducerBangCong: state.reducerBangCong
});
export default Utils.connectRedux(TaoGiaoViec_CVQT, mapStateToProps, true)
