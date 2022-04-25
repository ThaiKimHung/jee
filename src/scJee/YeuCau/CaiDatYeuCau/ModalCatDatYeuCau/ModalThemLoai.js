import React, { Component } from 'react';
import {
    Animated, BackHandler, Image, ScrollView, StyleSheet, Text,
    TextInput,
    TouchableOpacity, View
} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { FlatList } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { getDSNhanVien, getDSNhomYeuCau, getDSQuyTrinhDuyet, postTaoLoaiYC, postUpdateLoaiYeuCau } from '../../../../apis/JeePlatform/API_JeeRequest/apiCaiDatYeuCau';
import { RootLang } from '../../../../app/data/locales';
import Utils from '../../../../app/Utils';
import UtilsApp from '../../../../app/UtilsApp';
import nAvatar from '../../../../components/pickChartColorofAvatar';
import HeaderModalCom from '../../../../Component_old/HeaderModalCom';
import { Images } from '../../../../images';
import { colors } from '../../../../styles/color';
import { reText } from '../../../../styles/size';
import { Height, nstyles, Width } from '../../../../styles/styles';
class ModalThemLoai extends Component {
    constructor(props) {
        super(props);
        this.reload = Utils.ngetParam(this, '_load')
        this.ChiTietLoaiYeuCau = Utils.ngetParam(this, 'chiTietYeuCau')
        this.bangmau = [
            'rgb(187, 181, 181)',
            'rgb(29, 126, 236)',
            'rgb(250, 162, 140)',
            'rgb(14, 201, 204)',
            'rgb(11, 165, 11)',
            'rgb(123, 58, 245)',
            'rgb(238, 177, 8)',
            'rgb(236, 100, 27)',
            'rgb(124, 212, 8)',
            'rgb(240, 56, 102)',
            'rgb(255, 0, 0)',
            'rgb(0, 0, 0)',
            'rgb(255, 0, 255)',
        ];
        this.state = ({
            isVisible: true,
            refreshing: false,
            dsNhomYeuCau: [],
            dsQuyTrinhDuyet: [],
            dsBuocDuyet: [{ BuocDuyetTitle: "Bước duyệt cấp 1", CapDuyet: 1, Item: [] }],
            dsNguoiDuyet: [],
            dsFirst: [],

            viTriThemBuocDuyet: 0,
            tenNhom: '[chọn nhóm yêu cầu]',
            tenQuyTrinhDuyet: '[chọn quy trình duyệt]',

            idNhomYeuCau: '',
            idQuyTrinhDuyet: -1,
            thoiGianDuyet: 24,
            thoiGianDuyetHolder: RootLang.lang.JeeRequest.Modal_ThemLoaiYeuCau.thoigianduyet,
            tenLoaiYeuCau: '',
            tenLoaiYeuCauHolder: RootLang.lang.JeeRequest.Modal_ThemLoaiYeuCau.tenloai,
            thongTinMoTa: '',
            thongTinMoTaHolder: RootLang.lang.JeeRequest.Modal_ThemLoaiYeuCau.thongtinmota,

            bangmau: this.bangmau.map((item, index) => ({ color: item, check: index == 0 ? true : false })),
            colorChecked: 'rgb(187, 181, 181)',
            opacity: new Animated.Value(0),

            pageNumberNhom: 1,
            pageSizeNhom: 10,
            AllPageNhom: 1,
        })
    }
    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        this._startAnimation(0.8)
        this._loadDSNhomYeuCau()
        this._loadDSQuyTrinhDuyet()
        this._loadDSNguoiDuyet()
        this._editChiTietLoaiYeuCau()
    }
    componentWillUnmount() {
        this.backHandler.remove()
    }

    handleBackButton = () => {
        this._goBack()
        return true
    };
    _taoLoaiYeuCau = async () => {
        const { tenLoaiYeuCau, thoiGianDuyet, thongTinMoTa, idNhomYeuCau, idQuyTrinhDuyet, dsBuocDuyet, colorChecked } = this.state

        if (tenLoaiYeuCau.length == 0) {
            this.setState({ tenLoaiYeuCauHolder: 'Tên loại yêu cầu không được để trống' })
            this.refs.refTenLoai.focus()
            return
        }
        if (idNhomYeuCau == '') {
            UtilsApp.MessageShow('Thông báo', 'Nhóm yêu cầu không được để trống', 4)
            return
        }
        if (idQuyTrinhDuyet == -1) {
            UtilsApp.MessageShow('Thông báo', 'Quy trình duyệt không được để trống', 4)
            return
        }
        if (idQuyTrinhDuyet == 0 && dsBuocDuyet[0].Item.length == 0) {
            UtilsApp.MessageShow('Thông báo', 'Bạn chưa chọn người duyệt', 4)
            return
        }
        if (thoiGianDuyet == 0) {
            this.setState({ thoiGianDuyetHolder: 'Thời gian duyệt không được để trống' })
            this.refs.refThoiGianDuyet.focus()
            return
        }
        if (thongTinMoTa.length == 0) {
            this.setState({ thongTinMoTaHolder: 'Thông tin mô tả không được để trống' })
            this.refs.refThongTinMoTa.focus()
            return
        }
        let flagDsBuocDuyet = false
        dsBuocDuyet.forEach(item => {
            if (item.Item.length == 0)
                flagDsBuocDuyet = true
        })
        if (flagDsBuocDuyet) {
            UtilsApp.MessageShow('Thông báo', 'Bước duyệt không được để trống!', 4)
            return
        }

        let data = {
            dataLoaiYeuCau: [
                {
                    "tenLoaiYeuCau": tenLoaiYeuCau,
                    "thoiHan": parseInt(thoiGianDuyet),
                    "moTa": thongTinMoTa,
                    "nhomLoaiYeuCau": idNhomYeuCau,
                    "iD_QuyTrinh": idQuyTrinhDuyet,
                    "color": colorChecked,
                }
            ]
        }
        data = this.ChiTietLoaiYeuCau ? { dataLoaiYeuCau: [{ ...data.dataLoaiYeuCau[0], Id_LoaiYeuCau: this.ChiTietLoaiYeuCau.Id_LoaiYeuCau }] } : data
        if (idQuyTrinhDuyet == 0) {
            data = { ...data, dataDuyetTuyChon: dsBuocDuyet }
        }
        else
            data = { ...data, dataDuyetTuyChon: [] }
        let res = this.ChiTietLoaiYeuCau ? await postUpdateLoaiYeuCau(data) : await postTaoLoaiYC(data)
        if (res.status == 1) {
            this.reload().then(tes =>
                UtilsApp.MessageShow('Thông báo', this.ChiTietLoaiYeuCau ? 'Chỉnh sửa yêu cầu thành công' : 'Tạo loại yêu cầu thành công', 1),
                this._goBack()
            )
        }
        else
            UtilsApp.MessageShow('Thông báo', res.error ? res.error.message : 'Tạo loại yêu cầu thất bại', 4)
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
    _loadDSNhomYeuCau = async (npage = this.state.pageNumberNhom) => {
        let { pageSizeNhom, dsNhomYeuCau } = this.state
        let res = await getDSNhomYeuCau(npage, pageSizeNhom)
        // Utils.nlog('==> ds nhom yeu cau: ', res)
        if (res.status == 1) {
            if (npage != 1)
                dsNhomYeuCau = dsNhomYeuCau.concat(res.data)
            else
                dsNhomYeuCau = res.data
            this.setState({ dsNhomYeuCau: dsNhomYeuCau, AllPageNhom: res.page.AllPage })
        }
    }
    _loadDSQuyTrinhDuyet = async () => {
        let res = await getDSQuyTrinhDuyet('REQUEST')
        // Utils.nlog('==> ds quy trinh duyet: ', res)
        if (res.status == 1)
            this.setState({ dsQuyTrinhDuyet: res.data })
    }
    _loadDSNguoiDuyet = async () => {
        let res = await getDSNhanVien()
        // Utils.nlog('==> ds nhan vien: ', res)
        if (res.status == 1)
            this.setState({ dsNguoiDuyet: res.data, dsFirst: res.data })
    }
    _editChiTietLoaiYeuCau = () => {
        const temp = this.ChiTietLoaiYeuCau
        const { bangmau } = this.state
        let tempBangMau = []
        this.ChiTietLoaiYeuCau ?
            (
                tempBangMau = bangmau.map((item, index) => ({ color: item.color, check: item.color == temp.Color ? true : false })),
                this.setState({
                    tenLoaiYeuCau: temp.TenLoaiYeuCau, thoiGianDuyet: temp.ThoiGianXuLy, thongTinMoTa: temp.MoTa,
                    idNhomYeuCau: temp.Id_Nhom_LoaiYeuCau, tenNhom: temp.TenNhom, idQuyTrinhDuyet: temp.Id_QuyTrinh, tenQuyTrinhDuyet: temp.TenQuyTrinh,
                    dsBuocDuyet: temp.listValues, colorChecked: temp.Color, bangmau: tempBangMau
                })
            )
            : null
    }

    _loadDSNhomYC = ({ item, index }) => {
        return (
            <View>
                {item ?
                    <TouchableOpacity style={styles.touchDS}
                        onPress={() => this.setState({ idNhomYeuCau: item.Id_Nhom_LoaiYeuCau, tenNhom: item.TenNhom }, () => { this.refs.actionSheetRef.hide() })}>
                        <Text style={{ color: item.Id_Nhom_LoaiYeuCau == this.state.idNhomYeuCau ? 'red' : null }}>{item.TenNhom}</Text>
                    </TouchableOpacity>
                    :
                    null}
            </View>
        )
    }
    _loadDSQTD = ({ item, index }) => {
        return (
            <View>
                {item ?
                    <TouchableOpacity style={styles.touchDS}
                        onPress={() => this.setState({ idQuyTrinhDuyet: item.id, tenQuyTrinhDuyet: item.title }, () => { this.refs.refQuyTrinhDuyet.hide() })}>
                        <Text>{item.title}</Text>
                    </TouchableOpacity>
                    :
                    null}
            </View>
        )
    }
    _loadBuocDuyet = ({ item, index }) => {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                <Text>{item.BuocDuyetTitle} : </Text>
                <View style={{ flex: 1, flexDirection: 'row' }} >
                    {
                        item.Item.map((x, y) => {
                            return (
                                <View style={{ marginRight: 5, alignItems: 'center', justifyContent: 'center' }}>
                                    {
                                        x.Image ?
                                            <Image source={{ uri: x.Image }} style={nstyles.nAva32}></Image>
                                            :
                                            <View style={[nstyles.nAva32, { backgroundColor: nAvatar(x.HoTen).color, justifyContent: 'center', alignItems: 'center' }]}>
                                                <Text>{nAvatar(x.HoTen).chart}</Text>
                                            </View>
                                    }
                                    <TouchableOpacity style={{ position: 'absolute', right: -3, top: -3 }}
                                        onPress={() => this._removeBrower(index, y)}>
                                        <Image source={Images.ImageJee.icDelete} style={nstyles.nIcon15}></Image>
                                    </TouchableOpacity>
                                </View>
                            )
                        }
                        )
                    }
                    <TouchableOpacity onPress={() => this.setState({ viTriThemBuocDuyet: index, dsNguoiDuyet: this.state.dsFirst }, () => this.refs.refDSNguoiDuyet.show())}>
                        <Image source={Images.ImageJee.icIConThemNguoiVaoNhom} style={nstyles.nAva32}></Image>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => this._removeBrowsingStep(index)}>
                    <Image source={Images.ImageJee.icXoaLuaChon} style={[nstyles.nIcon15, { tintColor: 'red' }]}></Image>
                </TouchableOpacity>
            </View >
        )
    }
    _addBrowser = async (brower) => {
        this.refs.refDSNguoiDuyet.hide()
        const { viTriThemBuocDuyet, dsBuocDuyet } = this.state
        let temp = true
        dsBuocDuyet[viTriThemBuocDuyet].Item.forEach((item, index) => {
            if (item.idUser == brower.idUser) {
                temp = false
            }
        })
        if (temp)
            await dsBuocDuyet[viTriThemBuocDuyet].Item.push(brower)
        this.setState({ dsBuocDuyet: dsBuocDuyet })
    }
    _removeBrower = (buocduyet, nguoiduyet) => {
        const { dsBuocDuyet } = this.state
        dsBuocDuyet[buocduyet].Item.splice(nguoiduyet, 1)
        this.setState({ dsBuocDuyet: dsBuocDuyet })
    }
    _loadModal_DSNguoiDuyet = ({ item, index }) => {
        return (
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', height: 40, borderBottomWidth: 0.5, borderBottomColor: colors.lightBlack, paddingHorizontal: 10 }}
                onPress={() => this._addBrowser(item)}>
                {
                    item.Image ?
                        <Image source={{ uri: item.Image }} style={[nstyles.nAva26, { marginRight: 5 }]}></Image>
                        :
                        <View style={[nstyles.nAva26, { backgroundColor: nAvatar(item.HoTen).color, justifyContent: 'center', alignItems: 'center', marginRight: 5 }]}>
                            <Text>{nAvatar(item.HoTen).chart}</Text>
                        </View>
                }

                <Text>{item.HoTen}</Text>
            </TouchableOpacity>
        )
    }
    _addBrowsingStep = () => {
        const { dsBuocDuyet } = this.state
        let thuTuMoi = dsBuocDuyet[dsBuocDuyet.length - 1].CapDuyet + 1
        let item = { BuocDuyetTitle: "Bước duyệt cấp " + thuTuMoi, CapDuyet: thuTuMoi, Item: [] }
        dsBuocDuyet.push(item)
        this.setState({ dsBuocDuyet: dsBuocDuyet })
    }
    _removeBrowsingStep = (index) => {
        const { dsBuocDuyet } = this.state
        dsBuocDuyet.splice(index, 1)
        dsBuocDuyet.forEach((item, i) => {
            let thuTuMoi = i + 1
            let temp = { BuocDuyetTitle: "Bước duyệt cấp " + thuTuMoi, CapDuyet: thuTuMoi, Item: item.Item }
            dsBuocDuyet[i] = temp
        })
        dsBuocDuyet.length == 0 ? dsBuocDuyet.push({ BuocDuyetTitle: "Bước duyệt cấp 1", CapDuyet: 1, Item: [] }) : null
        this.setState({ dsBuocDuyet: dsBuocDuyet })
    }
    handleSearch = (keySearch) => {
        if (keySearch == '') {
            this.setState({ dsNguoiDuyet: this.state.dsFirst })
            return
        }
        let temp = this.state.dsNguoiDuyet.filter(item => Utils.removeAccents(item.HoTen).toUpperCase().includes(Utils.removeAccents(keySearch.toUpperCase())))
        this.setState({ dsNguoiDuyet: temp })
    }
    _goBack = () => {
        this._endAnimation(0)

        Utils.goback(this, null)
    };
    checkColor = (item, index) => {
        const { bangmau, colorChecked } = this.state
        let tempBangMau = bangmau.map((x, y) => ({ color: x.color, check: y == index ? true : false }))
        this.setState({ bangmau: tempBangMau, colorChecked: item.color })
    }
    onLoadmoreNhom = () => {
        const { AllPageNhom, pageNumberNhom } = this.state
        if (pageNumberNhom < AllPageNhom)
            this.setState({ pageNumberNhom: pageNumberNhom + 1 }, () => this._loadDSNhomYeuCau())
    }
    render() {
        const { opacity, dsNhomYeuCau, dsQuyTrinhDuyet, dsNguoiDuyet, dsBuocDuyet,
            tenNhom, tenQuyTrinhDuyet, idQuyTrinhDuyet,
            tenLoaiYeuCau, thoiGianDuyet, thongTinMoTa,
            tenLoaiYeuCauHolder, thoiGianDuyetHolder, thongTinMoTaHolder,
            bangmau,
        } = this.state

        return (
            <View style={[nstyles.ncontainer,
            { backgroundColor: `transparent`, justifyContent: 'flex-end', opacity: 1, }]}>
                <KeyboardAwareScrollView contentContainerStyle={{ flex: 1, justifyContent: 'flex-end' }}>
                    <Animated.View onTouchEnd={this._goBack} style={{
                        position: 'absolute', top: 0,
                        bottom: 0, left: 0, right: 0,
                        backgroundColor: colors.backgroundModal, opacity

                    }} />
                    <View style={{
                        backgroundColor: colors.white, flex: 1, marginTop: Height(20),
                        borderTopLeftRadius: 20, borderTopRightRadius: 20,
                        flexDirection: 'column', paddingHorizontal: 15, paddingBottom: 13
                    }}>
                        <HeaderModalCom
                            onPress={this._goBack}
                            title={this.ChiTietLoaiYeuCau ? RootLang.lang.JeeRequest.Modal_ThemLoaiYeuCau.sualoaiyeucau : RootLang.lang.JeeRequest.Modal_ThemLoaiYeuCau.themmoiloaiyeucau} />
                        <ScrollView style={{ flex: 1 }}>
                            <View style={styles.viewgroup}>
                                <Text style={styles.tieude}>{RootLang.lang.JeeRequest.Modal_ThemLoaiYeuCau.tenloai}<Text style={{ color: 'red' }}>*</Text></Text>
                                <TextInput
                                    ref={'refTenLoai'}
                                    placeholder={tenLoaiYeuCauHolder}
                                    style={styles.textinput}
                                    placeholderTextColor={tenLoaiYeuCauHolder == 'Tên loại yêu cầu không được để trống' ? colors.colorPink3 : null}
                                    fontStyle={tenLoaiYeuCau.length == 0 ? 'italic' : 'normal'}
                                    onChangeText={(value) => { this.setState({ tenLoaiYeuCau: value }), value.length == 0 ? this.setState({ tenLoaiYeuCauHolder: 'Tên loại yêu cầu không được để trống' }) : null }}>
                                    {tenLoaiYeuCau}
                                </TextInput>
                            </View>
                            <View style={styles.viewgroup}>
                                <Text style={styles.tieude}>{RootLang.lang.JeeRequest.Modal_ThemLoaiYeuCau.nhomyeucau}<Text style={{ color: 'red' }}>*</Text></Text>
                                <TouchableOpacity style={styles.touchDropDown}
                                    onPress={() => this.refs.actionSheetRef.show()}>
                                    <Text style={{ maxWidth: Width(90) }} numberOfLines={3}>{tenNhom}</Text>
                                    <Image source={Images.ImageJee.icDropdownn}></Image>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.viewgroup}>
                                <Text style={styles.tieude}>{RootLang.lang.JeeRequest.Modal_ThemLoaiYeuCau.quytrinhduyet}<Text style={{ color: 'red' }}>*</Text></Text>
                                <TouchableOpacity style={styles.touchDropDown}
                                    onPress={() => this.refs.refQuyTrinhDuyet.show()}>
                                    <Text>{tenQuyTrinhDuyet}</Text>
                                    <Image source={Images.ImageJee.icDropdownn}></Image>
                                </TouchableOpacity>
                            </View>
                            {idQuyTrinhDuyet == 0 ?
                                <View style={styles.viewgroup}>
                                    <Text style={styles.tieude}>Chọn người duyệt</Text>
                                    <FlatList
                                        data={dsBuocDuyet}
                                        extraData={this.state}
                                        renderItem={this._loadBuocDuyet}
                                        keyExtractor={(item, index) => index.toString()}>
                                    </FlatList>
                                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}
                                        onPress={() => this._addBrowsingStep()}>
                                        <View style={[nstyles.nAva26, { backgroundColor: colors.lightGreen, justifyContent: 'center', alignItems: 'center', marginRight: 5 }]}>
                                            <Text style={{ fontSize: reText(16), color: colors.colorTabActive, textAlign: 'center' }}>+</Text>
                                        </View>
                                        <Text style={{ fontSize: reText(12), color: colors.colorTabActive }}>Thêm bước duyệt</Text>
                                    </TouchableOpacity>
                                </View> : null}
                            <View style={styles.viewgroup}>
                                <Text style={styles.tieude}>{RootLang.lang.JeeRequest.Modal_ThemLoaiYeuCau.thoigianduyet}<Text style={{ color: 'red' }}>*</Text></Text>
                                <TextInput
                                    ref={'refThoiGianDuyet'}
                                    keyboardType={'numeric'}
                                    placeholder={thoiGianDuyetHolder}
                                    style={styles.textinput}
                                    placeholderTextColor={thoiGianDuyetHolder == 'Thời gian duyệt không được để trống' ? colors.colorPink3 : null}
                                    fontStyle={thoiGianDuyet == 0 ? 'italic' : 'normal'}
                                    onChangeText={(value) => {
                                        this.setState({ thoiGianDuyet: value }),
                                            value.length == 0 ? this.setState({ thoiGianDuyetHolder: 'Thời gian duyệt không được để trống' }) : null
                                    }}>
                                    {thoiGianDuyet}
                                </TextInput>
                            </View>
                            <View style={styles.viewgroup}>
                                <Text style={styles.tieude}>{RootLang.lang.JeeRequest.Modal_ThemLoaiYeuCau.thongtinmota}<Text style={{ color: 'red' }}>*</Text></Text>
                                <TextInput
                                    ref={'refThongTinMoTa'}
                                    placeholder={thongTinMoTaHolder}
                                    style={styles.textinput}
                                    placeholderTextColor={thongTinMoTaHolder == 'Thông tin mô tả không được để trống' ? colors.colorPink3 : null}
                                    fontStyle={thongTinMoTa.length == 0 ? 'italic' : 'normal'}
                                    onChangeText={(value) => {
                                        this.setState({ thongTinMoTa: value }),
                                            value.length == 0 ? this.setState({ thongTinMoTaHolder: 'Thông tin mô tả không được để trống' }) : null
                                    }}>
                                    {thongTinMoTa}
                                </TextInput>
                            </View>
                            <View style={styles.viewgroup}>
                                <Text style={styles.tieude}>{RootLang.lang.JeeRequest.Modal_ThemLoaiYeuCau.maudactrung}<Text style={{ color: 'red' }}>*</Text></Text>
                                <ScrollView style={styles.viewgroup} horizontal={true}>
                                    {bangmau.map((item, index) =>
                                        <TouchableOpacity style={[nstyles.nIcon30, { backgroundColor: item.color, justifyContent: 'center', alignItems: 'center' }]}
                                            onPress={() => this.checkColor(item, index)}>
                                            <Image source={item.check ? Images.ImageJee.icGhim : null} style={nstyles.nIcon20}></Image>
                                        </TouchableOpacity>
                                    )}
                                </ScrollView>
                            </View>
                            <View style={{ marginVertical: 30, flexDirection: 'row', justifyContent: 'space-around' }}>
                                <TouchableOpacity style={[{ backgroundColor: colors.colorInput }, styles.button]} onPress={this._goBack}>
                                    <Text style={{ color: colors.colorPlayhoder }}>{RootLang.lang.JeeRequest.Modal_ThemLoaiYeuCau.dong}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[{ backgroundColor: colors.colorTabActive }, styles.button]}
                                    onPress={this._taoLoaiYeuCau}>
                                    <Text style={{ color: 'white' }}>{this.ChiTietLoaiYeuCau ? RootLang.lang.JeeRequest.dungchung.luu : RootLang.lang.JeeRequest.Modal_ThemLoaiYeuCau.taoloai}</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </KeyboardAwareScrollView>
                <ActionSheet ref={'actionSheetRef'} >
                    <View style={{ height: Height(72), paddingHorizontal: 10 }} >
                        <HeaderModalCom onPress={() => this.refs.actionSheetRef.hide()} title={RootLang.lang.JeeRequest.boloc.danhsachnhomyeucau} />
                        <FlatList
                            data={dsNhomYeuCau}
                            extraData={this.state}
                            renderItem={this._loadDSNhomYC}
                            keyExtractor={(item, index) => index.toString()}
                            onEndReached={() => {
                                if (!this.onEndReachedCalledDuringMomentum) {
                                    this.onLoadmoreNhom()
                                    this.onEndReachedCalledDuringMomentum = true;
                                }
                            }}
                            onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false }}
                            onEndReachedThreshold={0.1}
                        />
                    </View>
                </ActionSheet>
                <ActionSheet ref={'refQuyTrinhDuyet'}>
                    <View style={{ height: Height(72), paddingHorizontal: 10 }} >
                        <HeaderModalCom onPress={() => this.refs.refQuyTrinhDuyet.hide()} title={RootLang.lang.JeeRequest.Modal_ThemLoaiYeuCau.quytrinhduyet} />
                        <ScrollView>
                            <TouchableOpacity style={styles.touchDS}
                                onPress={() => this.setState({ idQuyTrinhDuyet: 0, tenQuyTrinhDuyet: 'Quy trình duyệt tuỳ chọn' }, () => { this.refs.refQuyTrinhDuyet.hide() })}>
                                <Text>Quy trình duyệt tuỳ chọn</Text>
                            </TouchableOpacity>
                            <FlatList
                                data={dsQuyTrinhDuyet}
                                extraData={this.state}
                                renderItem={this._loadDSQTD}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </ScrollView>
                    </View>
                </ActionSheet>
                <ActionSheet ref={'refDSNguoiDuyet'}>
                    <View style={{ height: Height(72), paddingHorizontal: 10 }} >
                        <HeaderModalCom onPress={() => this.refs.refDSNguoiDuyet.hide()} title={RootLang.lang.JeeRequest.Modal_ThemLoaiYeuCau.danhsachnguoiduyet} />
                        <TextInput
                            style={{ margin: 10, paddingVertical: 12, paddingHorizontal: 5, borderWidth: 1, borderColor: colors.gray1, borderRadius: 5 }}
                            placeholder={'Tên nhân viên...'}
                            onChangeText={this.handleSearch}
                        />
                        <FlatList
                            data={dsNguoiDuyet}
                            extraData={this.state}
                            renderItem={this._loadModal_DSNguoiDuyet}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                </ActionSheet>
            </View >
        )
    }
}
const styles = StyleSheet.create({
    viewgroup: {
        paddingVertical: 10,
        // borderBottomWidth: 1,
        // borderColor: colors.colorButtonGray
    },
    tieude: {
        color: colors.colorText
    },
    button: {
        width: Width(40),
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5
    },
    textinput: {
        borderBottomWidth: 1,
        borderBottomColor: colors.colorButtonGray, padding: 0,
        marginTop: 5,
    },
    touchDropDown: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 7,
        borderBottomWidth: 1,
        borderBottomColor: colors.colorButtonGray,
    },
    touchDS: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        borderBottomWidth: 0.5,
        borderBottomColor: colors.lightBlack

    }
})
const mapStateToProps = state => ({
    lang: state.changeLanguage.language,
    reducerBangCong: state.reducerBangCong
});
export default Utils.connectRedux(ModalThemLoai, mapStateToProps, true)
