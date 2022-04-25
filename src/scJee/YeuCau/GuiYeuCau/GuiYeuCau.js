import moment from 'moment'
import React, { Component } from 'react'
import { BackHandler, FlatList, Image, ImageBackground, Platform, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native'
import ActionSheet from 'react-native-actions-sheet'
import DocumentPicker from 'react-native-document-picker'
import RNFS from 'react-native-fs'
import ImageCropPicker from 'react-native-image-crop-picker'
import RadioForm from 'react-native-simple-radio-button'
import { getChiTietGuiYeuCau, getChiTietItem, getControls, getLoadChiTietControls, postChinhSuaYeuCau, postGuiYeuCau } from '../../../apis/JeePlatform/API_JeeRequest/apiGuiYeuCau'
import { RootLang } from '../../../app/data/locales'
import Utils from '../../../app/Utils'
import UtilsApp from '../../../app/UtilsApp'
import HeaderComStackV3 from '../../../components/HeaderComStackV3'
import IsLoading from '../../../components/IsLoading'
import RadioButton from '../../../components/NewComponents/RadioButton'
import HeaderModalCom from '../../../Component_old/HeaderModalCom'
import { Images } from '../../../images'
import { colors } from '../../../styles'
import { reText } from '../../../styles/size'
import { Height, nstyles, Width } from '../../../styles/styles'

export class GuiYeuCau extends Component {
    constructor(props) {
        super(props)
        this.id_loaiyeucau = Utils.ngetParam(this, 'id_loaiyeucau')
        this.NhanBan = Utils.ngetParam(this, 'nhanbanyeucau') //nhanbanyeucau: 1-nhân bản, 2-chỉnh sửa, undefined-thêm mới
        this.ChiTietNhanBan = Utils.ngetParam(this, 'chitietnhanban')
        this.Reload = Utils.ngetParam(this, 'reload')
        this.mangFocus = []
        this.state = {
            chiTietYeuCau: [],
            dsControls: [],
            DataFields: [],
            titleItem: '',
            dsItem: [],
            indexItem: '', controlIDItem: '',
            DataYeuCau: [],
            dsNguoiDuyet: [],
            refreshing: true,
            showload: true,
            dataMang: [],
            TenYeuCauHolder: RootLang.lang.JeeRequest.sc_GuiYC.nhaptenyeucau,
            MoTaHolder: RootLang.lang.JeeRequest.sc_GuiYC.nhapmotayeucau,
            ChiTietControls: [],
            loiFocus: '',
            tenNguoiDuyet: '',
            vitriloi: -1,

            disabledButton: false
        }
        this.mang = [
            { position: true, type: true, url: Images.ImageJee.icGoBack, title: '', style: {}, onPress: () => this._goback() }, // type(true: icon, false:text) // postion(true: trái, false phải)
        ]
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.backHandlerButton)
        nthisLoading.show()
        this._load().then(res => {
            if (res)
                nthisLoading.hide()
        })
    }
    componentWillUnmount() {
        this.backHandler.remove()
    }
    backHandlerButton = () => {
        this._goback()
        return true
    }
    _goback() {
        Utils.goback(this)
    }
    _load = async () => {
        let res = [], ChiTietYC = []
        if (this.NhanBan == 1 || this.NhanBan == 2) { //nhân bản, chỉnh sửa
            res = await getLoadChiTietControls(this.ChiTietNhanBan.RowID)
        }
        else { //thêm mới
            ChiTietYC = await getChiTietGuiYeuCau(this.id_loaiyeucau)
            res = await getControls(this.id_loaiyeucau)
        }
        res.data = res.data.length > 0 ? res.data : []
        if (res.status == 1) {
            if (this.NhanBan == 1 || this.NhanBan == 2) { //nhân bản, chỉnh sửa
                var arrDSControl = await Promise.all(res.data.map(async (item, index) => ({  //Danh danh hiển thị
                    ...item,
                    check: false,
                    Item: await this.getChiTiet(item.RowID, item.ControlID, item.Value) //item.Value khi thêm mới thì rỗng
                })))
                var arrDataFields = arrDSControl.map((item, index) => ({ //Danh danh gửi đi
                    rowID: item.RowID,
                    controlID: item.ControlID,
                    Value: this.getValueUpdate(item.ControlID, item.Value)
                }))
                var arrDataYeuCau = [{
                    TenYeuCau: this.NhanBan == 1 ? this.ChiTietNhanBan.TenYeuCau + ' (Copy)' : this.ChiTietNhanBan.TenYeuCau,
                    MoTaYeuCau: this.ChiTietNhanBan.MoTa,
                    Id_LoaiYeuCau: this.id_loaiyeucau
                }]
            }
            else { //Thêm mới
                var arrDSControl = await Promise.all(res.data.map(async (item, index) => ({ //Danh danh hiển thị
                    ...item,
                    check: false,
                    Item: await this.getChiTiet(item.RowID, item.ControlID),
                })))
                var arrDataFields = await Promise.all(arrDSControl.map(async (item, index) => ({ //Danh danh gửi đi
                    rowID: item.RowID,
                    controlID: item.ControlID,
                    Value: await this.getValueDataFields(item.ControlID, item.RowID)
                })))
                var arrDataYeuCau = [{
                    TenYeuCau: "",
                    MoTaYeuCau: "",
                    Id_LoaiYeuCau: this.id_loaiyeucau
                }]
            }
            var _tenNguoiDuyet = RootLang.lang.JeeRequest.sc_GuiYC.khongtimthaynguoiduyet
            if (this.ChiTietNhanBan)
                _tenNguoiDuyet = this.ChiTietNhanBan.NguoiDuyet.map((x, y) => (y == 0 ? '' : ' ') + x.HoTen)
            else if (ChiTietYC.data[0].Id_QuyTrinh == 0)
                _tenNguoiDuyet = ChiTietYC.data[0].listValues[0].Item.map((x, y) => (y == 0 ? '' : ' ') + x.HoTen)
            else if (ChiTietYC.data[0].Checker[0])
                _tenNguoiDuyet = ChiTietYC.data[0].Checker.map((x, y) => (y == 0 ? '' : ' ') + x.HoTen)
            this.setState({
                dsControls: arrDSControl, DataFields: arrDataFields, DataYeuCau: arrDataYeuCau,
                chiTietYeuCau: this.ChiTietNhanBan ? this.ChiTietNhanBan : ChiTietYC.data[0],
                tenNguoiDuyet: _tenNguoiDuyet,
                refreshing: false, showload: false,
            })
            return true
        }
    }
    getChiTiet = async (rowid, controlID, value) => {
        if (this.NhanBan == 1 || this.NhanBan == 2) { //this.NhanBan: 1-Nhân bản, 2-Chỉnh sửa
            switch (controlID) {
                case 2:
                    return value.replace(/,/g, '')
                case 3:
                    return moment(new Date(value)).format('MM/DD/YYYY')
                case 5:
                case 6:
                case 9:
                    let res = await getChiTietItem(rowid)
                    if (res.status == 1 && (controlID == 5 || controlID == 9))
                        return res.data.map((x, y) => ({ ...x, check: x.RowID == value ? true : false }))
                    else if (res.status == 1 && controlID == 6)
                        return res.data.map((x, y) => ({ ...x, check: JSON.stringify(value).includes(x.RowID) }))
                    else
                        return []
                case 7:
                case 8:
                    return value == 'True' ? true : false
                case 10:
                case 12:
                case 13:
                case 14:
                    return JSON.parse(value)
                default:
                    return value;
            }
        }
        else { //Thêm mới
            switch (controlID) {
                case 3:
                    return moment(new Date()).format('MM/DD/YYYY')
                case 5:
                case 6:
                case 9:
                    let res = await getChiTietItem(rowid)
                    if (res.status == 1)
                        return res.data.map((x, y) => ({ ...x, check: y == 0 && controlID != 6 ? true : false }))
                    else
                        return []
                default:
                    return '';
            }
        }
    }
    getValueUpdate = (controlid, value) => {
        switch (controlid) {
            case 2:
                return value
            case 5:
                return parseInt(value)
            case 7:
            case 8:
                return value == 'True' ? true : false
            case 6:
            case 10:
            case 12:
            case 13:
            case 14:
                return JSON.parse(value)
            default:
                return value;
        }
    }
    getValueDataFields = async (controlID, rowid) => {
        switch (controlID) {
            case 3:
                return moment(new Date()).format('MM/DD/YYYY')
                break;
            case 5:
            case 9:
                let res = await getChiTietItem(rowid)
                if (res.status == 1)
                    return controlID == 5 ? res.data[0].RowID : res.data[0].RowID.toString()
                else
                    return []
            case 7:
            case 8:
                return false
            default:
                return '';
        }
    }

    onValueChange = (value, index, ControlID) => {
        let { DataFields, dsControls, dsItem } = this.state
        switch (ControlID) {
            case 2:
                value = value == '' ? '' : Utils.formatMoney(value)
                break;
            case 3:
                value = moment(value, 'DD/MM/YYYY').format('MM/DD/YYYY')
                dsControls[index].Item = value
                value = value + ' 00:00:00'
                break;
            case 5:
                dsItem.forEach((x, y) => {
                    if (x.RowID == value)
                        x.check = true
                    else
                        x.check = false
                })
                dsControls[index].Item = dsItem
                break
            case 9:
                value = value + ''
                break;
            case 7:
            case 8:
            case 15:
                dsControls[index].Item = value
                break;
        }
        if (ControlID == 14)
            DataFields[index].Value = DataFields[index].Value ? DataFields[index].Value.concat(value) : value
        else
            DataFields[index].Value = value
        this.setState({ DataFields: DataFields, dsControls: dsControls, dsItem: dsItem })
    }
    removeImage = (index, controlID, y) => {
        const { dsControls, DataFields } = this.state
        if (controlID == 10 || controlID == 13) {
            dsControls[index].Item = ''
            DataFields[index].Value = ''
        }
        if (controlID == 12 || controlID == 14) {
            dsControls[index].Item.splice(y, 1)
        }
        this.setState({ dsControls: dsControls, DataFields: DataFields })
    }
    _pickImage = async (index, ControlID, full) => {
        const { dsControls } = this.state
        await ImageCropPicker.openPicker({
            waitAnimationEnd: false,
            sortOrder: 'asc',
            includeExif: true,
            forceJpg: true,
            compressImageQuality: 0.2,
            includeBase64: true,
            mediaType: 'photo'
        })
            .then((i) => {
                // actionSheetRef_Image.current?.hide();
                var imageMap = [{
                    IsAdd: true,
                    Type: 1,
                    extension: i.path.split('.')[i.path.split('.').length - 1],
                    filename: i.filename == undefined ? i.path.split('/').slice(-1) + '' : i.filename,
                    strBase64: i.data,
                    type: i.mime,
                }]
                if (full == false) {
                    this.SWIPE_HEIGHT = _.size(imageMap) > 0 ? this.SWIPE_HEIGHT + 50 : this.SWIPE_HEIGHT
                }
                this.onValueChange(imageMap, index, ControlID)
                dsControls[index].Item = imageMap
                this.setState({ dsControls: dsControls })
            }, async () => {
            }).catch((e) => Utils.nlog(e));

    }
    _pickImages = async (index, ControlID, full) => {
        const { dsControls } = this.state
        await ImageCropPicker.openPicker({
            multiple: true,
            waitAnimationEnd: false,
            sortOrder: 'desc',
            includeExif: true,
            forceJpg: true,
            compressImageQuality: 0.2,
            includeBase64: true,
            mediaType: 'photo'
        })
            .then((images) => {
                // actionSheetRef_Image.current?.hide();
                var imageMap = images.map((i) => {
                    return {
                        IsAdd: true,
                        Type: 1,
                        extension: i.path.split('.')[i.path.split('.').length - 1],
                        filename: i.filename == undefined ? i.path.split('/').slice(-1) + '' : i.filename,
                        strBase64: i.data,
                        type: i.mime,
                    };
                })
                if (full == false) {
                    this.SWIPE_HEIGHT = _.size(imageMap) > 0 ? this.SWIPE_HEIGHT + 50 : this.SWIPE_HEIGHT
                }
                this.onValueChange(imageMap, index, ControlID)
                dsControls[index].Item = imageMap
                this.setState({ dsControls: dsControls })

            }, async () => {
            }).catch((e) => Utils.nlog(e));

    }
    pickFile = async (index, ControlID) => {
        const { dsControls } = this.state
        try {
            const results = await DocumentPicker.pick({ type: [DocumentPicker.types.allFiles], });
            const split = results.fileCopyUri.split('/');
            const name = split.pop();
            const inbox = split.pop();
            const realPath = Platform.OS == 'android' ? results.uri : `file://${RNFS.TemporaryDirectoryPath}/${inbox}/${decodeURI(name)}`;
            const strBase64 = await RNFS.readFile(realPath, "base64")
            var file = [{
                IsAdd: true,
                Type: 2,
                extension: results.name.split('.')[results.name.split('.').length - 1],
                filename: results.name,
                strBase64: strBase64,
                type: results.type,
            }]
            dsControls[index].Item = file
            this.setState({ dsControls: dsControls })
            this.onValueChange(file, index, ControlID)


        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                this.setState({ filePicked: false })
            }
        }
    }
    pickFiles = async (index, ControlID) => {
        const { dsControls } = this.state
        try {
            const results = await DocumentPicker.pickMultiple({ type: [DocumentPicker.types.allFiles], });
            // Utils.nlog("=-results", results)
            var mang = await Promise.all(results.map(async (i) => {
                const split = i.fileCopyUri.split('/');
                const name = split.pop();
                const inbox = split.pop();
                const realPath = Platform.OS == 'android' ? i.uri : `file://${RNFS.TemporaryDirectoryPath}/${inbox}/${decodeURI(name)}`;
                const strBase64 = await RNFS.readFile(realPath, "base64")
                return {
                    IsAdd: true,
                    Type: 2,
                    extension: i.name.split('.')[i.name.split('.').length - 1],
                    filename: i.name,
                    strBase64: strBase64,
                    type: i.type,
                }
            }))
            dsControls[index].Item = dsControls[index].Item ? dsControls[index].Item.concat(mang) : mang
            this.setState({ dsControls: dsControls })
            this.onValueChange(mang, index, ControlID)
        } catch (err) {
            Utils.nlog('err', err)
            if (DocumentPicker.isCancel(err)) {
                // this.setState({ filePicked: false })
            }
        }
    }
    _pickDatetime = (type, defaultTime, index, controlID) => { //type 1-date, 2-time
        if (type == 1) {
            Utils.goscreen(this, 'Modal_CalandaSingalCom', {
                date: moment(defaultTime, 'MM/DD/YYYY').format('DD/MM/YYYY') || moment(new Date()).format('DD/MM/YYYY'),
                setTimeFC: (time) => this.onValueChange(time, index, controlID)
            })
        }
        if (type == 2) {
            Utils.goscreen(this, 'Modal_GioPhutPickerBasic',
                {
                    time: defaultTime,
                    space5: true,
                    _setGioPhut: (time) => this.onValueChange(time, index, controlID)
                })
        }
    }
    dropDownMulti = (index) => {
        const { dsItem, indexItem, DataFields, dsControls } = this.state
        dsControls[indexItem].Item[index].check = !dsControls[indexItem].Item[index].check
        let mang = []
        dsItem.forEach(item => {
            if (item.check)
                mang.push(item.RowID.toString())

        })
        DataFields[indexItem].Value = mang
        this.setState({ dsControls: dsControls, DataFields: DataFields })
    }
    _renderControls = (controlID, item, index) => {
        switch (controlID) {
            case 1:
                return (
                    <View ref={index} style={styles.dongControl}>
                        <Text style={styles.txtTitleItem}>{item.Title} {item.IsRequired ? <Text style={{ color: 'red' }}>*</Text> : null}</Text>
                        <TextInput
                            style={[styles.txtinput, { marginTop: 5 }]}
                            placeholder={RootLang.lang.JeeRequest.sc_GuiYC.nhapnoidung + '...'}
                            onChangeText={(value) => this.onValueChange(value, index, controlID)}
                            placeholderTextColor={item.check ? 'red' : null}>
                            {item.Item}
                        </TextInput>
                    </View>
                )
            case 2:
                return (
                    <View ref={index} style={styles.dongControl}>
                        <Text style={styles.txtTitleItem}>{item.Title} {item.IsRequired ? <Text style={{ color: 'red' }}>*</Text> : null}</Text>
                        <TextInput
                            style={[styles.txtinput, { flex: 1, marginTop: 5 }]}
                            numberOfLines={1}
                            keyboardType={'numeric'}
                            placeholder={RootLang.lang.JeeRequest.sc_GuiYC.nhapnoidung + '...'}
                            onChangeText={(value) => this.onValueChange(value.length == '' ? 0 : value, index, item.ControlID)}
                            placeholderTextColor={item.check ? 'red' : null}>
                            {item.Item}
                        </TextInput>
                    </View>
                )
            case 3:
                return (
                    <TouchableOpacity
                        ref={index}
                        onPress={() => this._pickDatetime(1, item.Item, index, item.ControlID)}
                        style={[styles.dongControl, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                        <Text style={styles.txtTitleItem2}>{item.Title} {item.IsRequired ? <Text style={{ color: 'red' }}>*</Text> : null}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text>{moment(item.Item).format('DD/MM/YYYY') || 'Chọn ngày'}</Text>
                            <Image source={Images.ImageJee.icDate} style={[nstyles.nIcon17, { tintColor: 'black', marginLeft: 10 }]}></Image>
                        </View>
                    </TouchableOpacity>
                )
            case 4:
                return (
                    <View ref={index} style={styles.dongControl}>
                        <Text style={styles.txtTitleItem}>{item.Title} {item.IsRequired ? <Text style={{ color: 'red' }}>*</Text> : null}</Text>
                        <TextInput
                            style={styles.txtinput}
                            placeholder={RootLang.lang.JeeRequest.sc_GuiYC.nhapnoidung + '...'}
                            multiline={true}
                            onChangeText={(value) => this.onValueChange(value, index, item.ControlID)}>
                            {item.Item}
                        </TextInput>
                    </View>
                )
            case 5:
                return (
                    <TouchableOpacity
                        ref={index}
                        style={[styles.dongControl, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', maxWidth: Width(100) }]}
                        onPress={
                            () => this.setState({ dsItem: item.Item, titleItem: item.Title, indexItem: index, controlIDItem: item.ControlID },
                                () => this.refs.refDropdownSingle.show())
                        }>
                        <Text style={styles.txtTitleItem2} >{item.Title}{item.IsRequired ? <Text style={{ color: 'red' }}> *</Text> : null}</Text>
                        <Text >{item.Item ? item.Item.map(obj => obj.check ? obj.Title : null) : null} <Image source={Images.ImageJee.icDropdownn} style={{ height: 8, width: 10 }}></Image></Text>
                    </TouchableOpacity>
                )
            case 6:
                return (
                    <View ref={index} style={[styles.dongControl, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                        <Text style={styles.txtTitleItem2}>{item.Title}{item.IsRequired ? <Text style={{ color: 'red' }}> *</Text> : null}</Text>
                        <View style={{ alignItems: 'flex-end', maxWidth: '35%' }}>
                            <TouchableOpacity style={{ marginBottom: 5 }} onPress={() => this.setState({ dsItem: item.Item, titleItem: item.Title, indexItem: index, controlIDItem: item.ControlID }, () => this.refs.refDropdownMulti.show())}>
                                <Text style={styles.titleItem}>Nhấn để chọn <Image source={Images.ImageJee.icDropdownn} style={{ height: 8, width: 10 }}></Image></Text>
                            </TouchableOpacity>
                            <Text>{item?.Item?.map((obj, index) => obj.check ? (index != 0 ? ', ' : '') + obj.Title : null) || null}</Text>
                        </View>
                    </View>
                )
            case 7:
                return (
                    <View ref={index} style={[styles.dongControl, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                        <Text style={styles.txtTitleItem2}>{item.Title}{item.IsRequired ? <Text style={{ color: 'red' }}> *</Text> : null}</Text>
                        <Switch
                            style={{ transform: [{ scaleX: Platform.OS == 'ios' ? 0.8 : 1 }, { scaleY: Platform.OS == 'ios' ? 0.8 : 1 }] }}
                            trackColor={{ false: 'gray', true: 'teal' }}
                            thumbColor="white"
                            ios_backgroundColor="gray"
                            onValueChange={(value) => this.onValueChange(value, index, item.ControlID)}
                            value={item.Item}
                        />
                    </View>
                )
            case 8:
                return (
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => this.onValueChange(item.Item ? false : true, index, item.ControlID)} ref={index}
                        style={[styles.dongControl, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                        <Text style={styles.txtTitleItem2}>{item.Title}{item.IsRequired ? <Text style={{ color: 'red' }}> *</Text> : null}</Text>
                        <Image source={item.Item ? Images.ImageJee.icTouchDaChon : Images.ImageJee.icTouchChuaChon} style={nstyles.nIcon20}></Image>
                    </TouchableOpacity>
                )
            case 9:
                return (
                    <View ref={index} style={[styles.dongControl, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                        <Text style={styles.txtTitleItem2}>{item.Title}{item.IsRequired ? <Text style={{ color: 'red' }}> *</Text> : null}</Text>
                        <View style={{ maxWidth: '35%' }}>
                            {/* <RadioForm
                                radio_props={item.Item?.map(obj => ({ label: obj.Title, value: obj.RowID }))}
                                initial={item.Item?.length > 0 ? item.Item.findIndex(obj => obj.check == true) : 0}
                                borderWidth={10}
                                buttonSize={nstyles.nIcon12.width}
                                onPress={(value) => this.onValueChange(value, index, item.ControlID)}
                            /> */}
                            <RadioButton
                                listData={item.Item?.map(obj => ({ label: obj.Title, value: obj.RowID }))}
                                onPress={(value) => this.onValueChange(value, index, item.ControlID)}
                            />
                        </View>
                    </View>
                )
            case 10:
                return (
                    <View ref={index} style={[styles.dongControl, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                        <Text style={styles.txtTitleItem2} >{item.Title}{item.IsRequired ? <Text style={{ color: 'red' }}> *</Text> : null}</Text>
                        <View style={{ alignItems: 'flex-end' }}>
                            {/* {item.Item ? Utils.nlog(item.Item[0].IsAdd) : null} */}
                            {/* {item.Item ? <Image source={{ uri: 'data:image/gif;base64,' + item.Item[0].strBase64 }} style={{ width: 20, height: 40 }}></Image> : null} */}
                            <TouchableOpacity style={styles.buttonPick} onPress={() => this._pickImage(index, item.ControlID)}>
                                <Text style={styles.titleItem}>{RootLang.lang.JeeRequest.sc_GuiYC.chonanh}</Text>
                            </TouchableOpacity>
                            {item.Item ?
                                <TouchableOpacity style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center' }} onPress={() => UtilsApp.showImageZoomViewerBsse64(this, item.Item)}>
                                    <Text style={{ color: 'blue', fontSize: 12, maxWidth: Width(60), flex: 1 }} numberOfLines={1}>{item.Item[0].filename}</Text>
                                    <TouchableOpacity style={{ paddingLeft: 10 }} onPress={() => this.removeImage(index, item.ControlID)}>
                                        <Image source={Images.ImageJee.icXoaLuaChon} style={[nstyles.nIcon13, { tintColor: 'red' }]}></Image>
                                    </TouchableOpacity>
                                </TouchableOpacity>
                                : null}
                        </View>
                    </View>
                )
            case 12:
                return (
                    <View ref={index} style={[styles.dongControl, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                        <Text style={styles.txtTitleItem2} >{item.Title}{item.IsRequired ? <Text style={{ color: 'red' }}> *</Text> : null}</Text>
                        <View style={{ alignItems: 'flex-end' }}>
                            <TouchableOpacity style={styles.buttonPick} onPress={() => this._pickImages(index, item.ControlID)}>
                                <Text style={styles.titleItem}>{RootLang.lang.JeeRequest.sc_GuiYC.chonnhieuanh}</Text>
                            </TouchableOpacity>
                            <View style={{ alignItems: 'flex-end' }}>
                                {item.Item ? item.Item.map((x, y) =>
                                    <TouchableOpacity style={{ marginVertical: 5, flexDirection: 'row' }} onPress={() => UtilsApp.showImageZoomViewerBsse64(this, item.Item)}>
                                        <Text style={{ color: 'blue', marginRight: 5, fontSize: 12, maxWidth: Width(60), flex: 1 }} numberOfLines={1}>{x.filename}</Text>
                                        <TouchableOpacity style={{ paddingLeft: 10 }} onPress={() => this.removeImage(index, item.ControlID, y)}>
                                            <Image source={Images.ImageJee.icXoaLuaChon} style={[nstyles.nIcon13, { tintColor: 'red' }]}></Image>
                                        </TouchableOpacity>
                                    </TouchableOpacity>
                                ) : null}
                            </View>
                        </View>
                    </View>
                )
            case 13:
                return (
                    <View ref={index} style={[styles.dongControl, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                        <Text style={styles.txtTitleItem2}>{item.Title}{item.IsRequired ? <Text style={{ color: 'red' }}> *</Text> : null}</Text>
                        <View style={{ alignItems: 'flex-end' }}>
                            {/* {item.Item ? Utils.nlog(item.Item[0].IsAdd) : null} */}
                            <TouchableOpacity style={styles.buttonPick} onPress={() => this.pickFile(index, item.ControlID)}>
                                <Text style={styles.titleItem}>{RootLang.lang.JeeRequest.sc_GuiYC.chonfile}</Text>
                            </TouchableOpacity>
                            {item.Item ?
                                <TouchableOpacity style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ color: 'blue', fontSize: 12, maxWidth: Width(60), flex: 1 }} numberOfLines={1}>{item.Item[0].filename}</Text>
                                    <TouchableOpacity style={{ paddingLeft: 10 }} onPress={() => this.removeImage(index, item.ControlID)}>
                                        <Image source={Images.ImageJee.icXoaLuaChon} style={[nstyles.nIcon13, { tintColor: 'red' }]}></Image>
                                    </TouchableOpacity>
                                </TouchableOpacity> : null}
                        </View>
                    </View>
                )
            case 14:
                return (
                    <View ref={index} style={[styles.dongControl, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                        <Text style={styles.txtTitleItem2}>{item.Title}{item.IsRequired ? <Text style={{ color: 'red' }}> *</Text> : null}</Text>
                        <View style={{ alignItems: 'flex-end' }}>
                            <TouchableOpacity style={styles.buttonPick} onPress={() => this.pickFiles(index, item.ControlID)}>
                                <Text style={styles.titleItem}>{RootLang.lang.JeeRequest.sc_GuiYC.chonfiles}</Text>
                            </TouchableOpacity>
                            <View style={{ alignItems: 'flex-end' }}>
                                {item.Item ? item.Item.map((x, y) =>
                                    <TouchableOpacity style={{ marginVertical: 5, flexDirection: 'row' }} >
                                        <Text style={{ color: 'blue', marginRight: 5, fontSize: 12, maxWidth: Width(60), flex: 1 }} numberOfLines={1}>{x.filename}</Text>
                                        <TouchableOpacity style={{ paddingLeft: 10 }} onPress={() => this.removeImage(index, item.ControlID, y)}>
                                            <Image source={Images.ImageJee.icXoaLuaChon} style={[nstyles.nIcon13, { tintColor: 'red' }]}></Image>
                                        </TouchableOpacity>
                                    </TouchableOpacity>
                                ) : null}
                            </View>
                        </View>
                    </View>
                )
            case 15:
                return (
                    <TouchableOpacity
                        ref={index} style={[styles.dongControl, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}
                        onPress={() => this._pickDatetime(2, item.Item, index, item.ControlID)}>
                        <Text style={styles.txtTitleItem2}>{item.Title}{item.IsRequired ? <Text style={{ color: 'red' }}> *</Text> : null}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text>{item.Item || 'Chọn giờ'}</Text>
                            <Image source={Images.icTime} style={[nstyles.nIcon17, { tintColor: 'black', marginLeft: 10 }]}></Image>
                        </View>
                    </TouchableOpacity>
                )

            default:
                break;
        }
    }

    _loadControls = ({ item, index }) => {
        return (
            <View style={{ borderWidth: item.check ? 1.5 : null, borderColor: item.check ? 'red' : null }} ref={index}>
                {this._renderControls(item.ControlID, item, index)}
            </View >
        )

    }
    renderDSItem = ({ item, index }) => {
        return (
            <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 10, borderBottomColor: colors.lightBlack, borderBottomWidth: 0.5 }}
                onPress={() => { this.refs.refDropdownSingle.hide(), this.onValueChange(item.RowID, this.state.indexItem, this.state.controlIDItem) }}>
                <Text style={{ color: item.check ? 'red' : null }}>{item.Title}</Text>
            </TouchableOpacity>
        )
    }
    renderDSItemMulti = ({ item, index }) => {
        return (
            <TouchableOpacity onPress={() => this.dropDownMulti(index)} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomColor: colors.lightBlack, borderBottomWidth: 0.5, paddingHorizontal: 20 }}>
                <Text style={{ color: item.check ? 'red' : null }}>{item.Title}</Text>
                <TouchableOpacity onPress={() => this.dropDownMulti(index)}>
                    <Image source={item.check ? Images.ImageJee.icTouchDaChon : Images.ImageJee.icTouchChuaChon} style={nstyles.nIcon20}></Image>
                </TouchableOpacity>
            </TouchableOpacity>
        )
    }

    nhapTenYeuCau = (value) => {
        const { DataYeuCau } = this.state
        DataYeuCau[0].TenYeuCau = value
        this.setState({ DataYeuCau: DataYeuCau })
    }
    nhapMoTaYeuCau = (value) => {
        const { DataYeuCau } = this.state
        DataYeuCau[0].MoTaYeuCau = value
        this.setState({ DataYeuCau: DataYeuCau })
    }
    _onRefresh = () => {

    }
    gui = async () => {
        this.setState({ disabledButton: true })
        let { DataFields, DataYeuCau, dsControls } = this.state
        if (DataYeuCau[0].TenYeuCau.length == 0) {
            this.refTenYeuCau.focus()
            this.setState({ TenYeuCauHolder: 'Tên yêu cầu không được để trống' })
            this.setState({ disabledButton: false })
            return
        }
        if (DataYeuCau[0].MoTaYeuCau.length == 0) {
            this.refMoTaYeuCau.focus()
            this.setState({ MoTaHolder: 'Mô tả không được để trống' })
            this.setState({ disabledButton: false })
            return
        }
        let flag = 0
        try {
            for (let index = 0; index < dsControls.length; index++) {
                let item = dsControls[index]
                if (item.IsRequired) {
                    if (DataFields[index].Value === '') {

                        dsControls.map((x, y) => {
                            x.check = false
                        })
                        dsControls[index].check = true
                        this.setState({ dsControls: dsControls, loiFocus: dsControls[index].Title + ' không thể bỏ trống', vitriloi: index }, () => this.refs.refLoi.show())
                        flag = 1
                    }
                    if (flag == 1)
                        break
                }
            }
        } catch (error) {
            Utils.nlog('=> error: ', error)
        }
        if (flag == 1) {
            this.setState({ disabledButton: false })
            return
        }
        DataYeuCau = this.NhanBan == 2 ? [{ ...DataYeuCau[0], iD_YeuCau: this.ChiTietNhanBan.RowID }] : DataYeuCau
        let temp = { DataFields: DataFields, DataYeuCau: DataYeuCau }
        // Utils.nlog('==> gui yeu cau: ', temp)
        let res = this.NhanBan == 2 ? await postChinhSuaYeuCau(temp) : await postGuiYeuCau(temp)
        if (res.status == 1) {
            UtilsApp.MessageShow(RootLang.lang.JeeRequest.thongbao.thongbao, this.NhanBan == 2 ? RootLang.lang.JeeRequest.sc_GuiYC.chinhsuayeucauthanhcong : RootLang.lang.JeeRequest.sc_GuiYC.guiyeucauthanhcong, 1)
            this.Reload()
            Utils.goscreen(this, 'sc_DSGuiYeuCau')
        } else {
            UtilsApp.MessageShow(RootLang.lang.JeeRequest.thongbao.thongbao, res.error ? res.error.message : this.NhanBan == 2 ? RootLang.lang.JeeRequest.sc_GuiYC.chinhsuayeucauthatbai : RootLang.lang.JeeRequest.sc_GuiYC.guiyeucauthatbai, 2)
        }
        this.setState({ disabledButton: false })
    }
    render() {
        const {
            chiTietYeuCau, dsControls, refreshing, showload, dsNguoiDuyet, dsItem, titleItem, TenYeuCauHolder, DataYeuCau, loiFocus,
            tenNguoiDuyet, vitriloi, MoTaHolder
        } = this.state
        return (
            <View style={{ flex: 1 }}>
                <HeaderComStackV3
                    nthis={this}
                    title={RootLang.lang.JeeRequest.sc_GuiYC.guiyeucau}
                    mang={this.mang}
                />
                <View style={{ flex: 1 }}>
                    <ScrollView ref={ref => this.Scroll = ref} style={{ flex: 1 }} scrollToOverflowEnabled={true}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', paddingVertical: 15, paddingHorizontal: 10 }}>
                            <Text style={styles.tieude}>{RootLang.lang.JeeRequest.sc_GuiYC.hinhthuc}</Text>
                            <Text style={{ maxWidth: Width(70), fontSize: 14 }} numberOfLines={2}>{chiTietYeuCau?.TenLoaiYeuCau}</Text>
                        </View>
                        <Text style={{ color: colors.textGray, fontSize: reText(14), paddingHorizontal: 10, marginVertical: 10 }}>{chiTietYeuCau?.MoTa}</Text>
                        <View style={styles.canhngang}>
                            <Text style={[styles.tieude, { marginBottom: 5 }]}>{RootLang.lang.JeeRequest.sc_GuiYC.tenyeucau}<Text style={{ color: 'red' }}> *</Text></Text>
                            <TextInput
                                style={styles.txtinput}
                                ref={ref => this.refTenYeuCau = ref}
                                placeholder={TenYeuCauHolder}
                                placeholderTextColor={TenYeuCauHolder == 'Tên yêu cầu không được để trống' ? 'red' : null}
                                onChangeText={(value) => this.nhapTenYeuCau(value)}>
                                {DataYeuCau[0] ? DataYeuCau[0].TenYeuCau : null}
                            </TextInput>
                        </View>
                        <View style={styles.canhngang}>
                            <Text style={styles.tieude}>{RootLang.lang.JeeRequest.sc_GuiYC.motayeucau}<Text style={{ color: 'red' }}> *</Text></Text>
                            <TextInput
                                style={styles.txtinput}
                                ref={ref => this.refMoTaYeuCau = ref}
                                placeholder={MoTaHolder}
                                placeholderTextColor={MoTaHolder == 'Mô tả không được để trống' ? 'red' : 'null'}
                                onChangeText={(value) => this.nhapMoTaYeuCau(value)}>
                                {DataYeuCau[0] ? DataYeuCau[0].MoTaYeuCau : null}
                            </TextInput>
                        </View>
                        <FlatList
                            data={dsControls}
                            extraData={this.state}
                            renderItem={this._loadControls}
                            ref={(ref) => { this.flatListRef = ref; }}
                            onRefresh={this._onRefresh}
                            keyExtractor={(item, index) => index.toString()}
                            refreshing={refreshing} />
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableOpacity style={{ flex: 1 }} onPress={this.gui} disabled={this.state.disabledButton}>
                                <ImageBackground source={Images.ImageJee.icTouchRequest} style={{ width: Width(90), marginTop: 20, paddingVertical: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 80, paddingHorizontal: 5 }}>
                                    {
                                        this.state.disabledButton ?
                                            <ActivityIndicator size={'small'} color={'white'}></ActivityIndicator>
                                            :
                                            <Text style={{ color: 'white', fontStyle: 'italic' }}>
                                                {this.NhanBan == 2 ?
                                                    RootLang.lang.JeeRequest.sc_GuiYC.chinhsua :
                                                    RootLang.lang.JeeRequest.sc_GuiYC.gui
                                                }
                                                {this.NhanBan == 2 ?
                                                    null :
                                                    <Text style={{ fontWeight: 'bold', fontStyle: 'normal' }}> {' ' + tenNguoiDuyet}</Text>
                                                }
                                            </Text>
                                    }
                                </ImageBackground>
                            </TouchableOpacity>

                        </View>
                    </ScrollView >
                    <IsLoading ref={ref => this.refIsLoading = ref}></IsLoading>
                </View>
                <ActionSheet ref={'refDropdownSingle'}>
                    <View style={{ paddingHorizontal: 10, marginBottom: Platform.OS == 'ios' ? 15 : 0, height: Height(50) }}>
                        <HeaderModalCom title={titleItem} onPress={() => this.refs.refDropdownSingle.hide()}></HeaderModalCom>
                        <View style={{ backgroundColor: 'white' }}>
                            <FlatList
                                data={dsItem}
                                extraData={this.state}
                                renderItem={this.renderDSItem}
                                keyExtractor={(item, index) => index.toString()}></FlatList>
                        </View>
                    </View>
                </ActionSheet>
                <ActionSheet ref={'refDropdownMulti'} style={{ flex: 1 }}>
                    <View style={{ paddingHorizontal: 10, marginBottom: Platform.OS == 'ios' ? 15 : 0 }}>
                        <HeaderModalCom title={titleItem} onPress={() => this.refs.refDropdownMulti.hide()}></HeaderModalCom>
                        <View style={{ backgroundColor: 'white' }}>
                            <FlatList
                                data={dsItem}
                                extraData={this.state}
                                renderItem={this.renderDSItemMulti}
                                keyExtractor={(item, index) => index.toString()}></FlatList>
                        </View>
                    </View>
                </ActionSheet>
                <ActionSheet ref={'refLoi'} style={{ flex: 1 }}>
                    <View style={{ paddingHorizontal: 10, marginBottom: Width(10) }}>
                        <HeaderModalCom title={'THÔNG BÁO'} onPress={() => this.refs.refLoi.hide()}></HeaderModalCom>
                        <View style={{ backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 16 }}>{loiFocus}</Text>
                            <TouchableOpacity style={{ marginTop: 20, backgroundColor: colors.colorLineGreen, borderRadius: 20, paddingHorizontal: 30, paddingVertical: 7 }}
                                onPress={
                                    () => (
                                        this.Scroll.scrollTo(vitriloi * 50),
                                        this.refs.refLoi.hide()
                                    )}>
                                <Text style={{ color: 'white', fontWeight: 'bold' }}>Xác nhận</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ActionSheet>
            </View >
        )
    }
}
const styles = StyleSheet.create({
    tieude: {
        fontSize: reText(14),
        color: colors.textGray
    },
    canhngang: {
        justifyContent: 'space-between',
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginBottom: 5
    },
    dongControl: {
        backgroundColor: 'white',
        borderBottomColor: colors.lightBlack,
        borderBottomWidth: 0.5,
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    buttonPick: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        width: Width(30),
        backgroundColor: colors.black_10,
        borderRadius: 5
    },
    txtinput: {
        padding: 0, alignItems: 'center', justifyContent: 'center'
    },
    txtTitleItem: {
        color: colors.black_60,
    },
    txtTitleItem2: {
        color: colors.black_60,
        maxWidth: '65%'
    },
})
export default GuiYeuCau
