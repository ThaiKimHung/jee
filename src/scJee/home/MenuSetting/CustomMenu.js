import React, { Component } from 'react'
import { Animated, Dimensions, Image, PanResponder, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { AutoDragSortableView } from 'react-native-drag-sort'
import { LayMenuChucNang_MobileApp, Update_ChucNangThuongDung } from "../../../apis/JeePlatform/API_JeeWork/apiMenu"
import { ROOTGlobal } from '../../../app/data/dataGlobal'
import { RootLang } from '../../../app/data/locales'
import Utils from '../../../app/Utils'
import UtilsApp from '../../../app/UtilsApp'
import HeaderAnimationJee from '../../../components/HeaderAnimationJee'
import HeaderComStackV2 from '../../../components/HeaderComStackV2'
import IsLoading from '../../../components/IsLoading'
import { Images } from '../../../images'
import { colors, fonts } from '../../../styles'
import { reText, sizes } from '../../../styles/size'
import { Height, nstyles, Width } from '../../../styles/styles'
import { objectMenuGlobal } from '../AllMenu/MenuGlobal'
import CustomMenuChildren from './CustomMenuChildren'


const stCustomMenu = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.colorGrayBgr
    },
    txtTitleThuongdung: {
        fontWeight: 'bold',
        fontSize: reText(18)
    },
})

const { width, height } = Dimensions.get('window')
const HEIGHT_VIEW = Height(30)
const HEIGHT_TOP = Height(27)
const HEIGHT_MAX = Height(30)
export class CustomMenu extends Component {
    constructor(props) {
        super(props);
        this.callback = Utils.ngetParam(this, 'callback');
        this.state = {
            opacity: new Animated.Value(0),
            listData: [
                { icon: Images.ImageJee.icMNCV_1, txt: 1 },  //Sửa lại Images.icABC, Images.imgACB, 
                { icon: Images.ImageJee.icMNCV_2, txt: 2 },
                { icon: Images.ImageJee.icMNCV_3, txt: 3 },
                { icon: Images.ImageJee.icMNCV_4, txt: 4 },
                { icon: Images.ImageJee.icMNCV_5, txt: 5 },
                { icon: Images.ImageJee.icMNCV_6, txt: 6 },
                // { icon: Images.ImageJee.icMNCV_4, txt: 7 },
                // { icon: Images.ImageJee.icMNCV_5, txt: 8 },
                // { icon: Images.ImageJee.icMNCV_6, txt: 9 },
                // { icon: Images.ImageJee.icMNCV_4, txt: 10 },
                // { icon: Images.ImageJee.icMNCV_5, txt: 11 },
                // { icon: Images.ImageJee.icMNCV_6, txt: 12 },
                // { icon: Images.ImageJee.icMNCV_4, txt: 13 },
                // { icon: Images.ImageJee.icMNCV_5, txt: 14 },
                // { icon: Images.ImageJee.icMNCV_6, txt: 15 },
                // { icon: Images.ImageJee.icMNCV_4, txt: 16 },
                // { icon: Images.ImageJee.icMNCV_5, txt: 17 },
                // { icon: Images.ImageJee.icMNCV_6, txt: 18 },
                // { icon: Images.ImageJee.icMNCV_4, txt: 19 },
                // { icon: Images.ImageJee.icMNCV_5, txt: 20 },
                // { icon: Images.ImageJee.icMNCV_6, txt: 21 },
            ],
            menuCu: [],
            listCongViec: [],
            listNhanSu: [],
            listYeuCau: [],
            listHanhChinh: [],
            listCuocHop: [],
            listDataMoi: [],
            animationFlex: new Animated.Value(HEIGHT_VIEW),
            animationTop: new Animated.Value(HEIGHT_TOP),
            animationRotate: new Animated.Value('0deg'),
            expanded: false,
            vitri: 0
        }
        this.ListMenuThuongDung = Utils.getGlobal("ListMenuThuongDung", [])
        this.addItem = React.createRef()
        this.addItemNew = this.addItemNew.bind(this)
        this.position.addListener(e => {
            let temp = e.y < 0 ? 0 : e.y
            if (temp >= HEIGHT_MAX)
                temp = HEIGHT_MAX
            this.firstPositon = { x: 0, y: temp }
            let heighView = HEIGHT_VIEW + temp
            let heighTop = HEIGHT_TOP + temp
            Animated.timing(this.state.animationFlex, {
                duration: 0,
                toValue: heighView
            }).start()
            Animated.timing(this.state.animationTop, {
                duration: 0,
                toValue: heighTop
            }).start()
        })
        this.rotateButton = this.state.animationFlex.interpolate({
            inputRange: [HEIGHT_VIEW, HEIGHT_MAX + HEIGHT_VIEW],
            outputRange: ['0deg', '180deg'],
            extrapolate: 'clamp'
        })
    }
    firstPositon = { x: 0, y: 0 }
    position = new Animated.ValueXY();
    pan = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: (e, ges) => {
            this.position.setOffset({ x: this.firstPositon.x, y: this.firstPositon.y })
        },
        onPanResponderMove: (e, ges) => {
            const newPostion = { x: 0, y: ges.dy }
            this.position.setValue(newPostion)
        },
        onPanResponderEnd: () => {
            this.position.flattenOffset()
        }
    })
    openMenu = () => {
        if (this.firstPositon.y == HEIGHT_MAX) {
            Animated.timing(this.state.animationFlex, {
                duration: 300,
                toValue: HEIGHT_VIEW,
            }).start();
            Animated.timing(this.state.animationTop, {
                duration: 300,
                toValue: HEIGHT_TOP,
            }).start();
            this.firstPositon = { x: 0, y: 0 }
        }
        else {
            Animated.timing(this.state.animationFlex, {
                duration: 300,
                toValue: HEIGHT_VIEW + HEIGHT_MAX
            }).start();
            Animated.timing(this.state.animationTop, {
                duration: 300,
                toValue: HEIGHT_TOP + HEIGHT_MAX
            }).start();
            this.firstPositon = { x: 0, y: HEIGHT_MAX }
        }
    }
    async componentDidMount() {
        // Utils.nlog("LOG XEM MENU:", Utils.getGlobal("ListMenuThuongDung", []))
        await this._layMenuChucNang_MobileApp();
        this._LoadMenuThuondung();
    }

    _XoaMenu = async (item, index) => {
        const { listCongViec, listHanhChinh, listNhanSu, listYeuCau, listCuocHop } = this.state
        // const dk = -1
        this.setState({
            listData: this.state.listData.filter((i, index1) => index1 != index).concat({ "icon": Images.ImageJee.icMNCV_1, "txt": "6" }),
        })
        let check
        let temp
        switch (item.udd) {
            case 1:
                {
                    check = listCongViec.findIndex(item2 => item.RowID == item2.RowID)
                    temp = [...listCongViec];
                    temp[check] = { ...temp[check], check: false }
                    this.setState({ listCongViec: temp })
                    return
                }
            case 2:
                {
                    check = listNhanSu.findIndex(item2 => item.RowID == item2.RowID)
                    temp = [...listNhanSu];
                    temp[check] = { ...temp[check], check: false }
                    this.setState({ listNhanSu: temp })
                    return
                }
            case 3:
                {
                    check = listYeuCau.findIndex(item2 => item.RowID == item2.RowID)
                    temp = [...listYeuCau];
                    temp[check] = { ...temp[check], check: false }
                    this.setState({ listYeuCau: temp })
                    return
                }
            case 4:
                {
                    check = listHanhChinh.findIndex(item2 => item.RowID == item2.RowID)
                    temp = [...listHanhChinh];
                    temp[check] = { ...temp[check], check: false }
                    this.setState({ listHanhChinh: temp })
                    return
                }
            case 5:
                {
                    check = listCuocHop.findIndex(item2 => item.RowID == item2.RowID)
                    temp = [...listCuocHop];
                    temp[check] = { ...temp[check], check: false }
                    this.setState({ listCuocHop: temp })
                    return
                }
            default:
                break;
        }
    }
    renderItem(item, index) {
        return (
            <View style={{ marginLeft: 7 }}>
                {item.txt ?
                    <TouchableOpacity style={{ width: Width(31), height: Width(15), justifyContent: 'center', alignItems: 'center', paddingVertical: 10 }}>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Image style={[nstyles.nIcon50, { resizeMode: 'contain' }]} source={Images.ImageJee.icMenuEmpty} />
                            <Image style={[nstyles.nIcon20, { resizeMode: 'contain', position: 'absolute', tintColor: colors.textGray }]} source={Images.ImageJee.icCheckPlusTwo} />
                        </View>
                    </TouchableOpacity> :
                    <View>
                        <View style={{ width: Width(30) }}>
                            <View>
                                <Image style={{ width: Width(30), height: Width(8), resizeMode: 'contain' }} source={item.linkicon} />
                            </View>
                            <TouchableOpacity
                                onPress={() => { this._XoaMenu(item, index) }}
                                style={{ position: 'absolute', top: -6, right: 3 }}>
                                <Image source={Images.ImageJee.icXoaAnh} style={{ height: Width(7), width: Width(5) }} resizeMode='contain' />
                            </TouchableOpacity>
                            <View style={{ paddingVertical: 10 }}>
                                <Text
                                    numberOfLines={3}
                                    style={{
                                        fontFamily: fonts.Helvetica, color: colors.textblack,
                                        fontSize: sizes.sText12, textAlign: 'center'
                                    }}>
                                    {this.props.lang == "vi" ? item.Title : item.nameEN}</Text>
                            </View>
                        </View>
                    </View >
                }
            </View>
        )
    }

    _goback = () => {
        Utils.goback(this, null)
    }

    _FindIndexUdd = (arr) => {
        let arrIndex = []
        for (let index = 0; index < arr.length; index++) {
            let vt = this.ListMenuThuongDung.findIndex(item => item.RowID == arr[index].RowID)
            if (vt != -1) {
                arrIndex = [...arrIndex, vt]
            }
        }
        return arrIndex
    }

    _LoadMenuThuondung = () => {
        let temp1 = objectMenuGlobal.MenuCongViec
        let temp2 = objectMenuGlobal.MenuNhanSu
        let temp3 = objectMenuGlobal.MenuYeuCau
        let temp4 = objectMenuGlobal.MenuHanhChinh
        let temp5 = objectMenuGlobal.MenuCuocHop
        let vt1 = this._FindIndexUdd(temp1)
        let vt2 = this._FindIndexUdd(temp2)
        let vt3 = this._FindIndexUdd(temp3)
        let vt4 = this._FindIndexUdd(temp4)
        let vt5 = this._FindIndexUdd(temp5)
        if (vt1.length > 0) {
            for (let index = 0; index < vt1.length; index++)
                this.ListMenuThuongDung[vt1[index]] = { ...this.ListMenuThuongDung[vt1[index]], udd: 1 }
        }
        if (vt2.length > 0) {
            for (let index = 0; index < vt2.length; index++)
                this.ListMenuThuongDung[vt2[index]] = { ...this.ListMenuThuongDung[vt2[index]], udd: 2 }
        }
        if (vt3.length > 0) {
            for (let index = 0; index < vt3.length; index++)
                this.ListMenuThuongDung[vt3[index]] = { ...this.ListMenuThuongDung[vt3[index]], udd: 3 }
        }
        if (vt4.length > 0) {
            for (let index = 0; index < vt4.length; index++)
                this.ListMenuThuongDung[vt4[index]] = { ...this.ListMenuThuongDung[vt4[index]], udd: 4 }
        }
        if (vt5.length > 0) {
            for (let index = 0; index < vt5.length; index++) {
                this.ListMenuThuongDung[vt5[index]] = { ...this.ListMenuThuongDung[vt5[index]], udd: 5 }
            }
        }

        this.setState({
            listData: this.state.listData.map((obj, index) => this.ListMenuThuongDung.find((item2, index2) => index == index2) || obj),
        })
    }

    _callback = async (item) => {
        await this.setState({
            menuCu: this.state.listData,
            listDataMoi: [],
        })
        await objectMenuGlobal.AllMenu.map(i => item.map(item2 => {
            if (i.RowID == item2.RowID) {
                this.setState({ listDataMoi: this.state.listDataMoi.concat(i) })
            }
        }))
        this.setState({
            listData: this.state.listDataMoi
        })
        if (this.state.listData.length < 6) {
            for (let i = this.state.listData.length; i < 6; i++) {
                await this.setState({
                    listData: this.state.listData.concat({ "icon": Images.ImageJee.icMNCV_6, "txt": "6" }),
                })
            }
        }
        Utils.goback(this, null)
    }
    _goback2 = () => {
        Utils.goback(this, null)
        // Utils.goscreen(this, 'sw_HomePage')
        ROOTGlobal.GetMenuThuongDung.GetMenuTD()
        return true;
    }

    _Update_ChucNangThuongDung = async () => {
        let dsmenu = [];
        await this.state.listData.map((item, index) => {
            item.RowID ? dsmenu.push({ "RowID": item.RowID, "Position": index }) : null
        })
        let strbody = dsmenu
        let res = await Update_ChucNangThuongDung(JSON.stringify(strbody))
        if (res.status == 1) {
            Utils.setGlobal("ListMenuThuongDung", this.state.listData)
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.thongbaochung.luuthanhcong, 1)
            this._goback2()
        } else {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
        }
    }

    _layMenuChucNang_MobileApp = async () => {
        nthisLoading.show()
        const res = await LayMenuChucNang_MobileApp()
        if (res.status == 1) {
            let temp = [], txt = 0
            res.data?.map((item, index) => {
                this.ganItem(item.RowID, item.Child)
                item.Child.forEach((x, y) => {
                    txt++
                    temp.push({ icon: Images.ImageJee.icMNCV_1, txt: txt },)
                });
            })
            this.setState({ listData: temp })
            nthisLoading.hide()
        } else {
            this.setState({ refreshing: false, })
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
            this._goback2()
        }
    }

    ganItem = (id, mang) => {
        const { listDataMoi } = this.state
        let temp = []
        if (id == 1) {
            temp = objectMenuGlobal.MenuCongViec
        }
        if (id == 2) {
            temp = objectMenuGlobal.MenuNhanSu
        }
        if (id == 3) {
            temp = objectMenuGlobal.MenuYeuCau
        }
        if (id == 4) {
            temp = objectMenuGlobal.MenuHanhChinh
        }
        if (id == 5) {
            temp = objectMenuGlobal.MenuCuocHop
        }
        mang.map(item => {
            for (let i = 0; i <= temp.length; ++i) {
                if (item.RowID == temp[i].RowID) {
                    if (id == 1) {
                        let checkexit = this.ListMenuThuongDung.find(item2 => item.RowID == item2.RowID);
                        if (checkexit)
                            this.setState({ listCongViec: this.state.listCongViec.concat({ ...item, ...temp[i], check: true }) })
                        else
                            this.setState({ listCongViec: this.state.listCongViec.concat({ ...item, ...temp[i], check: false }) })
                    }
                    if (id == 2) {
                        let checkexit = this.ListMenuThuongDung.find(item2 => item.RowID == item2.RowID);
                        if (checkexit)
                            this.setState({ listNhanSu: this.state.listNhanSu.concat({ ...item, ...temp[i], check: true }) })
                        else
                            this.setState({ listNhanSu: this.state.listNhanSu.concat({ ...item, ...temp[i], check: false }) })
                    }
                    if (id == 3) {
                        let checkexit = this.ListMenuThuongDung.find(item2 => item.RowID == item2.RowID);
                        if (checkexit)
                            this.setState({ listYeuCau: this.state.listYeuCau.concat({ ...item, ...temp[i], check: true }) })
                        else
                            this.setState({ listYeuCau: this.state.listYeuCau.concat({ ...item, ...temp[i], check: false }) })
                    }
                    if (id == 4) {
                        let checkexit = this.ListMenuThuongDung.find(item2 => item.RowID == item2.RowID);
                        if (checkexit) {
                            this.setState({ listHanhChinh: this.state.listHanhChinh.concat({ ...item, ...temp[i], check: true }) })
                        }
                        else {
                            this.setState({ listHanhChinh: this.state.listHanhChinh.concat({ ...item, ...temp[i], check: false }) })
                        }
                    }
                    if (id == 5) {
                        let checkexit = this.ListMenuThuongDung.find(item2 => item.RowID == item2.RowID);
                        if (checkexit) {
                            this.setState({ listCuocHop: this.state.listCuocHop.concat({ ...item, ...temp[i], check: true }) })
                        }
                        else {
                            this.setState({ listCuocHop: this.state.listCuocHop.concat({ ...item, ...temp[i], check: false }) })
                        }
                    }
                    return
                }
            }
        })
    }

    _checkMenu = (item) => {
        const { listData } = this.state
        let check = listData.find(item2 => item2.RowID == item.RowID)
        if (check) {
        }
        else {
            let data = [...listData, item]
            this.setState({ listData: data })
        }
    }

    addItemNew = (item, udd) => {
        const { listData, listCongViec, listHanhChinh, listNhanSu, listYeuCau, listCuocHop } = this.state
        let check = listData.find(item2 => item2.RowID == item.RowID)
        const checkLength = listData.filter(item3 => item3.txt)
        if (checkLength.length <= 0) {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.thongbaochung.bandadatsoluongtoidakhithemungdung, 4)
        }
        if (check) {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.thongbaochung.bandacochucnangnay, 4)
        }
        else {
            {
                let data = [...listData]
                let indexAdd = data.findIndex(item2 => item2.txt != null)
                if (indexAdd != -1) {
                    let check;
                    let datanew;
                    data[indexAdd] = { ...item, udd: udd }
                    this.setState({ listData: data })
                    switch (udd) {
                        case 1: {
                            check = listCongViec.findIndex(item2 => item2.RowID == item.RowID)
                            if (check != -1) {
                                datanew = [...listCongViec];
                                datanew[check] = { ...datanew[check], check: true }
                                this.setState({ listCongViec: datanew })
                            }
                            break;
                        }
                        case 2: {
                            check = listNhanSu.findIndex(item2 => item2.RowID == item.RowID)
                            if (check != -1) {
                                datanew = [...listNhanSu];
                                datanew[check] = { ...datanew[check], check: true }
                                this.setState({ listNhanSu: datanew })
                            }
                        }
                        case 3: {
                            check = listYeuCau.findIndex(item2 => item2.RowID == item.RowID)
                            if (check != -1) {
                                datanew = [...listYeuCau];
                                datanew[check] = { ...datanew[check], check: true }
                                this.setState({ listYeuCau: datanew })
                            }
                        }
                        case 4: {
                            check = listHanhChinh.findIndex(item2 => item2.RowID == item.RowID)
                            if (check != -1) {
                                datanew = [...listHanhChinh];
                                datanew[check] = { ...datanew[check], check: true }
                                this.setState({ listHanhChinh: datanew })
                            }
                        }
                        case 5: {
                            check = listCuocHop.findIndex(item2 => item2.RowID == item.RowID)
                            if (check != -1) {
                                datanew = [...listCuocHop];
                                datanew[check] = { ...datanew[check], check: true }
                                this.setState({ listCuocHop: datanew })
                            }
                        }
                        default:
                            return;
                    }
                }
            }
        }
    }


    render() {
        var { expanded, vitri, animationFlex, animationTop } = this.state
        return (
            <View style={stCustomMenu.container}>
                <HeaderAnimationJee
                    nthis={this}
                    title={RootLang.lang.thongbaochung.tuychinh}
                    iconLeft={Images.ImageJee.icBack}
                    onPressLeft={this._goback}
                    styBorder={{
                        borderBottomColor: colors.black_20,
                        borderBottomWidth: 0.5
                    }}
                />
                <View style={{ flex: 1 }}>
                    <Animated.View style={{ backgroundColor: colors.backgroudJeeHR, height: animationFlex }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, paddingHorizontal: 20, }}>
                            <Text style={stCustomMenu.txtTitleThuongdung}>{RootLang.lang.thongbaochung.ungdungthuongdung}</Text>
                            <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} onPress={() => this._Update_ChucNangThuongDung()}    >
                                <Text style={{ fontSize: reText(16) }}>{RootLang.lang.thongbaochung.luu}</Text>
                                <View style={{ paddingHorizontal: 5 }} />
                                <Image
                                    source={Images.ImageJee.icSave}
                                    style={{ ...nstyles.nIcon16 }}
                                    resizeMode={'cover'} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ paddingTop: 10, flex: 1 }}>
                            <AutoDragSortableView
                                keyExtractor={(item, index) => index.toString()}
                                dataSource={this.state.listData}
                                parentWidth={Width(100)}
                                childrenWidth={width / 4}
                                childrenHeight={Width(25)}
                                marginChildrenTop={2}
                                marginChildrenLeft={10}
                                marginChildrenRight={10}
                                renderItem={(item, index) => {
                                    return this.renderItem(item, index)
                                }}
                                onDataChange={(data) => {
                                    this.setState({ listData: data })
                                }}
                            />
                        </View>
                    </Animated.View>
                    <Animated.View style={[this.position.getLayout(), { position: 'absolute', backgroundColor: colors.black_10, top: animationTop, }]} {...this.pan.panHandlers}>
                        <View style={{ justifyContent: 'center', alignItems: 'center', width: Width(100), height: 27 }}>
                            <TouchableOpacity
                                style={{ width: 40 }}
                                onPress={() => this.openMenu()}>
                                <Animated.View style={{ transform: [{ rotate: this.rotateButton }], }}>
                                    <Image
                                        source={!expanded ? Images.icDropdown : Images.ImageJee.icDropdownReverse}
                                        style={[nstyles.nIcon21, { alignSelf: 'center', tintColor: colors.greenTab }]} resizeMode={'contain'} />
                                </Animated.View>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                    <ScrollView nestedScrollEnabled style={{
                        flex: 1,
                        // marginTop: 5
                    }}>
                        {this.state.listCongViec.length > 0 ? (
                            <CustomMenuChildren ref={this.addItem} data={this.state.listCongViec} txtTitle={RootLang.lang.thongbaochung.congviec} colorTitle={colors.colorJeeNew.colorOragneHome}
                                onPress={this.addItemNew} udd={1}
                            />
                        ) : (null)}

                        {this.state.listNhanSu.length > 0 ? (
                            <CustomMenuChildren data={this.state.listNhanSu} txtTitle={RootLang.lang.thongbaochung.nhansu} colorTitle={colors.colorJeeNew.colorRedHome}
                                udd={2}
                                onPress={this.addItemNew}
                            />
                        ) : (null)}
                        {this.state.listYeuCau.length > 0 ? (
                            <CustomMenuChildren data={this.state.listYeuCau} txtTitle={RootLang.lang.thongbaochung.yeucau} colorTitle={colors.colorJeeNew.colorBlueHome}
                                udd={3}
                                onPress={this.addItemNew}
                            />
                        ) : (null)}
                        {this.state.listHanhChinh.length > 0 ? (
                            <CustomMenuChildren data={this.state.listHanhChinh} txtTitle={RootLang.lang.thongbaochung.hanhchinh} colorTitle={colors.colorJeeNew.colorGreenHome}
                                udd={4}
                                onPress={this.addItemNew}
                            />
                        ) : (null)}
                        {this.state.listCuocHop.length > 0 ? (
                            <CustomMenuChildren data={this.state.listCuocHop} txtTitle={RootLang.lang.thongbaochung.quanlyhop} colorTitle={colors.colorJeeNew.colorPink2}
                                udd={5}
                                onPress={this.addItemNew}
                            />
                        ) : (null)}

                    </ScrollView>
                    <IsLoading />

                </View>
            </View>
        )
    }
}

const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});

export default Utils.connectRedux(CustomMenu, mapStateToProps, true)
