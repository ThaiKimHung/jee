import moment from "moment";
import React, { Component } from "react";
import { BackHandler, FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { RootLang } from "../../../app/data/locales";
import Utils from '../../../app/Utils';
import HeaderComStackV2 from '../../../components/HeaderComStackV2';
import IsLoading from '../../../components/IsLoading';
import { Images } from '../../../images';
import { colors } from '../../../styles';
import { reText, sizes } from '../../../styles/size';
import { Height, nHeight, nstyles, paddingBotX, Width } from '../../../styles/styles';
import UtilsApp from '../../../app/UtilsApp'
class BocLocQuyTrinh extends Component {
    constructor(props) {
        super(props);
        this.Callback = Utils.ngetParam(this, "callback")
        this.typeScreen = Utils.ngetParam(this, "type") //type: 1-Bộ lọc công việc theo quy trình
        this.listQuyTrinh = Utils.ngetParam(this, "listQuyTrinh")
        this.processid = Utils.ngetParam(this, "processid")
        this.idType = Utils.ngetParam(this, "idType")
        this.from = Utils.ngetParam(this, "from")
        this.to = Utils.ngetParam(this, "to")
        this.keyword = Utils.ngetParam(this, "keyword")
        this.hoanthanh = Utils.ngetParam(this, "hoanthanh")
        this.hethan = Utils.ngetParam(this, "hethan")
        this.typeid = Utils.ngetParam(this, "typeid")
        this.state = {
            listType: [
                { id: 4, title: RootLang.lang.JeeWork.theongaynhan, choice: false },
                { id: 2, title: RootLang.lang.JeeWork.theothoihan, choice: false, },
                { id: 3, title: RootLang.lang.JeeWork.theongaybatdau, choice: false },
            ],
            searchString: this.keyword || '',
            searchStack: '',
            searhcStage: '',
            searchProccess: '',
            listQuyTrinh: this.listQuyTrinh ? this.listQuyTrinh : [],
            fromDate: this.from,
            toDate: this.to,
            isHoanThanh: this.hoanthanh || false, //true: k bao gồm cv hoàn thành
            isHetHan: this.hethan || false, //false: tắt, true: chỉ hiện cv đã/ sắp hết hạn
            idActiveQuyTrinh: this.processid || '',
            errFromTo: false,
            TinhTrang: [
                { id: 0, title: RootLang.lang.thongbaochung.tatca.toUpperCase(), value: '' },
                { id: 1, title: RootLang.lang.thongbaochung.moitao.toUpperCase(), value: 0 },
                { id: 2, title: RootLang.lang.thongbaochung.danglam.toUpperCase(), value: 1 },
                { id: 3, title: RootLang.lang.thongbaochung.hoanthanh.toUpperCase(), value: 3 }
            ],
            typeid: this.typeid,
        }
    }
    componentDidMount() {
        this._backHandler = BackHandler.addEventListener('hardwareBackPress', this._backHandlerButton)
        this._selectType(this.idType)
    }
    componentWillUnmount() {
        this._backHandler.remove()
    }
    _backHandlerButton = () => {
        this._goback()
        return true
    }
    _goback = () => {
        Utils.goback(this, null)
    }
    _selectType = async (idType) => {
        var { listType } = this.state
        listType.map(item => {
            if (idType == item.id && item.choice == false)
                item.choice = true
            else
                item.choice = false
        })
        this.setState({ listType })
    }
    _selectDate = (fromDate, toDate) => {
        this.setState({ fromDate, toDate, errFromTo: false })
    }
    _checkStatus = (type) => { //type: 1-isHoanThanh, 2-isHetHan
        if (type == 1)
            this.setState({ isHoanThanh: !this.state.isHoanThanh })
        if (type == 2)
            this.setState({ isHetHan: !this.state.isHetHan })
    }
    _pickDate = (val) => {
        var { fromDate, toDate } = this.state;
        Utils.goscreen(this, "Modal_Calanda", {
            dateF: fromDate || moment(new Date()).format('DD/MM/YYYY'),
            dateT: toDate || moment(new Date()).format('DD/MM/YYYY'),
            isTimeF: val,
            setTimeFC: this._selectDate,
            arrTitle: [RootLang.lang.scphepthemdon.tungay, RootLang.lang.scphepthemdon.denngay]
        })
    }
    _submit = () => {
        const { idActiveQuyTrinh, listType, fromDate, toDate, searchString, isHoanThanh, isHetHan, typeid } = this.state
        var str = {
            idQuyTrinh: idActiveQuyTrinh,
            keyword: searchString,
            hoanthanh: isHoanThanh,
            hethan: isHetHan,
            typeid: typeid
        }
        if (listType.some(x => x.choice == true)) {
            if (!fromDate || !toDate) {
                UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.thongbaochung.thoigiankhongduocdetrong, 4)
                this.setState({ errFromTo: true })
                return
            }
            str = {
                ...str,
                idType: listType[listType.findIndex(x => x.choice == true)].id,
                from: fromDate,
                to: toDate
            }
        }
        this.Callback(str)
        this._goback()
    }
    _cancel = async () => {
        const { listType } = this.state
        await listType.forEach((item, index) => { listType[index].choice = false })
        this.setState({ idActiveQuyTrinh: '', fromDate: null, toDate: null, searchString: '', listType })
    }
    _selectRowIDQuyTrinh = (item) => {
        this.setState({ idActiveQuyTrinh: item.rowid })
    }
    _handleChooseStatus = (item) => {
        if (item.value === 3) {
            this.setState({ isHetHan: false, isHoanThanh: false })
        }
        this.setState({ typeid: item.value })
    }
    _onChangeValueSearch = (typeSeach, value) => {
        switch (typeSeach) {
            case 1:
                this.setState({ searchString: value })
                break;
            case 2:
                this.setState({ searchStack: value })
                break;
            case 3:
                this.setState({ searhcStage: value })
                break;
            case 4:
                this.setState({ searchProccess: value })
                break;
        }
    }
    _renderListType = ({ item, index }) => {
        const color = item.choice == true ? '#0E72D8' : '#B3B3B3'
        return (
            <TouchableOpacity
                onPress={() => this._selectType(item.id)}
                style={{ borderColor: color, flex: 1, borderWidth: 1, paddingVertical: 10, marginHorizontal: 4, marginVertical: 10, justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}>
                <Text style={{ fontWeight: item.choice == true ? "bold" : "400", color: color, fontSize: sizes.sText12 }}>{item.title}</Text>
            </TouchableOpacity>
        )
    }
    _renderListQuyTrinh = ({ item, index }) => {
        const isActive = this.state.idActiveQuyTrinh == item.rowid
        return (
            <View>
                <TouchableOpacity
                    onPress={() => this._selectRowIDQuyTrinh(item)}
                    style={[styles.btnQuyTrinh, { alignItems: 'center' }]}>
                    <Text style={{ color: isActive ? '#0E72D8' : null, fontWeight: isActive ? 'bold' : null, fontSize: isActive ? reText(16) : reText(14) }}>{item.title}</Text>
                </TouchableOpacity>
                {/* {index != this.state.listQuyTrinh.} */}
                <View style={{ height: 0.5, backgroundColor: colors.colorTextBTGray }} />
            </View>
        )
    }

    _renderTinhTrang = ({ item, index }) => {
        return (
            <TouchableOpacity
                key={index}
                onPress={() => this._handleChooseStatus(item)}
                style={{
                    width: Width(23), marginRight: Width(1), height: Width(10), justifyContent: 'center', alignItems: 'center', borderWidth: 0.5,
                    borderColor: this.state.typeid === item.value ? '#0E72D8' : '#B3B3B3', borderRadius: 5
                }}>
                <Text style={{ fontSize: sizes.sText11, color: this.state.typeid === item.value ? '#0E72D8' : '#B3B3B3', fontWeight: this.state.typeid == item.value ? 'bold' : '400', textAlign: 'center' }}>{item.title}</Text>
            </TouchableOpacity>
        )
    }

    render() {
        const { fromDate, toDate, listType, isHoanThanh, isHetHan, searchString, errFromTo, TinhTrang } = this.state;
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: '#F2F3F5', width: Width(100), }]}>
                <HeaderComStackV2
                    nthis={this}
                    title={RootLang.lang.JeeWork.boloc}
                    iconLeft={Images.ImageJee.icArrowNext}
                    onPressLeft={this._goback}
                    styBorder={{ borderBottomColor: colors.black_20_2, borderBottomWidth: 0.3 }} />
                <View style={{ backgroundColor: colors.white, paddingHorizontal: 10, height: nHeight(80), justifyContent: 'space-between' }}>
                    <View style={{ backgroundColor: "#F2F3F5", borderRadius: 20, flexDirection: 'row', alignItems: 'center', marginVertical: 15, paddingVertical: 10 }}>
                        <Image source={Images.icSearch} style={[nstyles.nIcon15, { marginHorizontal: 10 }]} />
                        <TextInput
                            style={{ flex: 1, padding: 0 }}
                            placeholder={RootLang.lang.JeeWork.timkiem}
                            onChangeText={(searchString) => this.setState({ searchString })}
                            underlineColorAndroid="transparent"
                            value={searchString}
                        />
                    </View>
                    {/* <View>
                        <Text style={{ fontSize: sizes.sText15, fontWeight: 'bold', marginVertical: 5 }}>{RootLang.lang.JeeWork.timkiem}</Text>
                        <View style={{ paddingHorizontal: 10 }}>
                            {[1, 2, 3, 4].map(item => {
                                const text = item == 1 ? 'Từ khoá' : item == 2 ? 'Tên nhiệm vụ' : item == 3 ? 'Tên giai đoạn' : 'Tên quy trình'
                                const valueInput = item == 1 ? 'Từ khoá' : item == 2 ? 'Tên nhiệm vụ' : item == 3 ? 'Tên giai đoạn' : 'Tên quy trình'
                                return (
                                    <View style={styles.viewSearch}>
                                        <Text style={styles.txtSearch}>{text} :</Text>
                                        <TextInput
                                            style={styles.inputSearch}
                                            placeholder={RootLang.lang.JeeWork.timkiem}
                                            onChangeText={(value) => this._onChangeValueSearch(item, value)}
                                            underlineColorAndroid="transparent"
                                            value={searchString}
                                        />
                                    </View>
                                )
                            })}
                        </View>
                    </View> */}
                    <View>
                        <TouchableOpacity style={{ flexDirection: 'row', marginBottom: 10 }} disabled={this.state.typeid == 3} onPress={() => this._checkStatus(1)}>
                            <Image source={isHoanThanh ? Images.JeeCheck : Images.ImageJee.UnCheckBlue} style={styles.imgStatus} />
                            <Text style={{ fontSize: reText(16), color: '#0E72D8' }}>{RootLang.lang.thongbaochung.khongbaogomcongviecdahoanthanh}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flexDirection: 'row', marginBottom: 10 }} disabled={this.state.typeid == 3} onPress={() => this._checkStatus(2)}>
                            <Image source={isHetHan ? Images.JeeCheck : Images.ImageJee.UnCheckBlue} style={styles.imgStatus} />
                            <Text style={{ fontSize: reText(16), color: '#0E72D8' }}>{RootLang.lang.thongbaochung.chibaogomcongviecdavasaphethan}</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <Text style={{ fontSize: sizes.sText15, fontWeight: 'bold' }}>{RootLang.lang.JeeWork.theoloai}</Text>
                        <FlatList
                            data={listType}
                            numColumns={3}
                            renderItem={this._renderListType}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                    <View>
                        <Text style={{ fontSize: sizes.sText15, fontWeight: 'bold' }}>{RootLang.lang.JeeWork.theothoigian}</Text>
                        <View style={{ backgroundColor: colors.white }}>
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity onPress={() => this._pickDate(true)} style={[styles.btnTime, { borderWidth: errFromTo ? 1 : 0, borderColor: errFromTo ? 'red' : null }]}>
                                    <Image source={Images.ImageJee.icLichChiTietTQ} style={{ ...nstyles.nIcon20, tintColor: colors.colorGrayIcon }} resizeMode={'contain'} />
                                    <Text numberOfLines={2} style={styles.txtTime1(fromDate ? true : false)}> {fromDate || RootLang.lang.JeeWork.tungay} </Text>
                                </TouchableOpacity>
                                <Text style={{ alignSelf: 'center' }}>-</Text>
                                <TouchableOpacity onPress={() => this._pickDate(true)} style={[styles.btnTime, { borderWidth: errFromTo ? 1 : 0, borderColor: errFromTo ? 'red' : null }]}>
                                    <Image source={Images.ImageJee.icLichChiTietTQ} style={{ ...nstyles.nIcon20, tintColor: colors.colorGrayIcon }} resizeMode={'contain'} />
                                    <Text numberOfLines={2} style={styles.txtTime1(toDate ? true : false)}> {toDate || RootLang.lang.JeeWork.denngay} </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={{ marginBottom: 10 }}>
                        <Text style={{ fontSize: sizes.sText15, fontWeight: 'bold', marginBottom: 10 }}>{RootLang.lang.thongbaochung.theotinhtrang}</Text>
                        <FlatList
                            data={TinhTrang}
                            horizontal
                            renderItem={this._renderTinhTrang}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                    {this.typeScreen == 1 ?
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: sizes.sText15, fontWeight: 'bold', marginBottom: 10 }}>{RootLang.lang.thongbaochung.theoquytrinh}</Text>
                            <FlatList
                                data={this.listQuyTrinh}
                                extraData={this.state}
                                renderItem={this._renderListQuyTrinh}
                                showsVerticalScrollIndicator={true}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </View>
                        : null
                    }

                    <IsLoading />
                </View>
                <View style={{ flexDirection: 'row', paddingBottom: 10, padding: 10, justifyContent: 'center', height: nHeight(20) }}>
                    <TouchableOpacity
                        onPress={this._cancel}
                        style={{ borderColor: '#0E72D8', borderWidth: 0.8, height: Height(6), width: Width(43), justifyContent: 'center', alignItems: 'center', marginRight: 10, backgroundColor: colors.white, borderRadius: 8 }}>
                        <Text style={{ fontSize: sizes.sText12, color: '#0E72D8', fontWeight: 'bold' }}>{RootLang.lang.JeeWork.xoaboloc}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={this._submit}
                        style={{ borderColor: '#0E72D8', borderWidth: 0.3, height: Height(6), width: Width(43), justifyContent: 'center', alignItems: 'center', marginLeft: 10, backgroundColor: '#0E72D8', borderRadius: 8 }}>
                        <Text style={{ fontSize: sizes.sText12, color: colors.white, fontWeight: 'bold' }}>{RootLang.lang.JeeWork.apdung}</Text>
                    </TouchableOpacity>
                </View>
            </View >
        );
    }
};


const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});

const styles = StyleSheet.create({
    txtTime: {
        textAlign: 'right', color: colors.black, fontSize: sizes.sText14, lineHeight: reText(18)
    },
    txtTime1: (temp) => ({
        marginLeft: 5, color: temp ? 'black' : colors.black_20, fontSize: sizes.sText14, lineHeight: reText(16), textAlign: 'center'
    }),
    btnTime: {
        flexDirection: 'row', flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white,
        paddingVertical: 10,
        margin: 2,
        backgroundColor: colors.white,
        paddingHorizontal: 10
    },
    imgStatus: {
        width: Width(5), height: Width(5), marginRight: 5, tintColor: '#0E72D8'
    },
    btnQuyTrinh: {
        paddingVertical: 15, paddingHorizontal: 10, borderRadius: 10,
    },
    viewSearch: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5
    },
    inputSearch: {
        flex: 1, paddingHorizontal: 10, padding: 0, backgroundColor: "#F2F3F5", borderRadius: 20, height: nHeight(4)
    },
    txtSearch: {
        width: '30%', color: colors.gray1
    }
});

export default Utils.connectRedux(BocLocQuyTrinh, mapStateToProps, true)


