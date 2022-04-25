import React, { Component } from 'react';
import {
    Animated, BackHandler, FlatList, Image, Platform, ScrollView, StyleSheet, Text,
    TextInput, TouchableOpacity, View
} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { getConTrolsChiTietYC, getDSControls, postThemMauDeXuat, postUpdateViTriMau } from '../../../../apis/JeePlatform/API_JeeRequest/apiCaiDatYeuCau';
import { RootLang } from '../../../../app/data/locales';
import Utils from '../../../../app/Utils';
import UtilsApp from '../../../../app/UtilsApp';
import HeaderModalCom from '../../../../Component_old/HeaderModalCom';
import { Images } from '../../../../images';
import { colors } from '../../../../styles/color';
import { reText } from '../../../../styles/size';
import { Height, nstyles, Width } from '../../../../styles/styles';


class ModalMauYeuCau extends Component {
    constructor(props) {
        super(props);
        this.Id_LoaiYeuCau = Utils.ngetParam(this, 'id_loaiyeucau')
        this.RowID = Utils.ngetParam(this, 'rowid')
        this.callback = Utils.ngetParam(this, 'reloadControls')
        this.Mau = Utils.ngetParam(this, 'mau')
        this.ViTriThem = Utils.ngetParam(this, 'vitrithem')
        this.typeScreen = Utils.ngetParam(this, 'typescreen') //0 Thêm mẫu đề xuất lớn, 1 thêm mẫu đề xuất sau item, 2 sửa mẫu đề xuất
        this.state = ({
            isVisible: true,
            refreshing: false,
            dsControls: [],
            dsMau: [],
            tenTruongHolder: RootLang.lang.JeeRequest.Modal_MauYC.tentruong,
            tenTruong: '',
            giaiThichTruongDuLieu: '',
            loaiDuLieu: 'Văn bản (text - single-line)',
            idLoaiDuLieu: 1,
            cauHoiBatBuoc: 'Bắt buộc*',
            idCauHoiBatBuoc: true,
            opacity: new Animated.Value(0),
            dsValue: [{ Title: "" }],
            dungSau: '#1',
            viTriDungSau: -1,

            pageNumberMau: 1,
            pageSizeMau: 10,
            AllPageMau: 1,
        })
    }
    componentDidMount = async () => {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        this._startAnimation(0.8)
        await this.loadDSControls()
        this.loadDSMau().then(temp => {
            this.suaMau()
        })

    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton = () => {
        this._goBack()
        return true
    };
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

    _goBack = () => {
        this._endAnimation(0)
        this.callback()
        Utils.goback(this, null)
    };

    loadDSControls = async () => {
        let res = await getDSControls()
        if (res.status == 1)
            this.setState({ dsControls: res.data })
    }
    loadDSMau = async () => {
        const { pageNumberMau, pageSizeMau } = this.state
        let res = await getConTrolsChiTietYC(pageNumberMau, pageSizeMau, this.Id_LoaiYeuCau)
        // Utils.nlog('==> mau: ', res)
        if (res.status == 1) {
            const data = res.data == '' ? [] : res.data
            const tempDungSau = data.length > 0 ? data[data.length - 1]?.Title : '#1'
            this.setState({ dsMau: data, dungSau: tempDungSau, viTriDungSau: res.data.length - 1, AllPageMau: res.page.AllPage })
        }
    }
    suaMau = () => {
        const { dsMau, dsControls } = this.state
        //Thêm item trùng với item con
        if (this.typeScreen == 1) {
            let temp = dsMau[this.ViTriThem]
            this.setState({
                dungSau: temp.Title, viTriDungSau: this.ViTriThem,
                giaiThichTruongDuLieu: this.Mau.Description,
                idCauHoiBatBuoc: this.Mau.IsRequired, cauHoiBatBuoc: this.Mau.IsRequired ? RootLang.lang.JeeRequest.boloc.batbuoc + '*' : RootLang.lang.JeeRequest.boloc.khongbatbuoc,
                dsValue: this.Mau.Values.length > 0 ? this.Mau.Values : this.state.dsValue //Khi item k có con thì sẽ gán dữ liệu rỗng
            })
            dsControls.forEach((item, index) => {
                if (item.ID == this.Mau.ControlID) {
                    this.setState({ loaiDuLieu: item.Title, idLoaiDuLieu: this.Mau.ControlID })
                    return
                }
            })
            return
        }
        //Sửa item trùng với item con
        if (this.typeScreen == 2) {
            // Utils.nlog('==> ds mau:', this.Mau)
            this.setState({
                tenTruong: this.Mau.Title,
                giaiThichTruongDuLieu: this.Mau.Description,
                idCauHoiBatBuoc: this.Mau.IsRequired, cauHoiBatBuoc: this.Mau.IsRequired ? RootLang.lang.JeeRequest.boloc.batbuoc + '*' : RootLang.lang.JeeRequest.boloc.khongbatbuoc,
                dsValue: this.Mau.Values.length > 0 ? this.Mau.Values : this.state.dsValue
            })
            dsControls.forEach((item, index) => {
                if (item.ID == this.Mau.ControlID) {
                    this.setState({ loaiDuLieu: item.Title, idLoaiDuLieu: this.Mau.ControlID })
                    return
                }
            })
            dsMau.forEach((item, index) => {
                if (item.RowID == this.Mau.RowID) {
                    if (index == 0)
                        this.setState({ dungSau: '#1', viTriDungSau: -1 })
                    else
                        this.setState({ dungSau: dsMau[index - 1].Title, viTriDungSau: index - 1 })
                    return
                }
            })

        }
    }
    _renderDSControl = ({ item, index }) => {
        return (
            <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: colors.lightBlack }}
                onPress={() => this.setState({ dsValue: [{ Title: "" }], idLoaiDuLieu: item.ID, loaiDuLieu: item.Title }, () => this.refs.actionSheetRef.hide())}>
                <Text style={{ color: this.state.idLoaiDuLieu == item.ID ? 'red' : null, textAlign: 'center' }}>{item.Title}</Text>
            </TouchableOpacity>
        )
    }
    _renderDSMau = ({ item, index }) => {
        return (
            <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: colors.lightBlack }}
                onPress={() => this.setState({ viTriDungSau: index, dungSau: item.Title }, () => this.refs.refThuTu.hide())}>
                <Text style={{ color: this.state.viTriDungSau == index ? 'red' : null }}>{item.Title}</Text>
            </TouchableOpacity>
        )
    }
    _checkDuLieuRong = async () => {
        const { idLoaiDuLieu, giaiThichTruongDuLieu, idCauHoiBatBuoc, tenTruong, dsValue, dsMau, viTriDungSau } = this.state
        if (tenTruong.length == 0) {
            this.setState({ tenTruongHolder: 'Tên trường không được để trống' })
            this.refs.refTenTruong.focus()
            return
        }
        if (idLoaiDuLieu == 5 || idLoaiDuLieu == 6 || idLoaiDuLieu == 9) {
            let flag = false
            dsValue.forEach(element => {
                if (element.Title == '') {
                    flag = true
                    return
                }
            });
            if (flag) {
                UtilsApp.MessageShow(RootLang.lang.JeeRequest.thongbao.thongbao, RootLang.lang.JeeRequest.thongbao.loaidulieukhongduocdetrong, 4)
                return
            }
        }
        const temp = {
            ControlID: idLoaiDuLieu,
            Description: giaiThichTruongDuLieu,
            ID: this.RowID,
            Id_LoaiYeuCau: this.Id_LoaiYeuCau,
            IsRequired: idCauHoiBatBuoc,
            Title: tenTruong,
            Values: idLoaiDuLieu == 5 || idLoaiDuLieu == 6 || idLoaiDuLieu == 9 ? dsValue : []
        }
        return temp
    }
    _updateViTri = async (ID) => {
        const { dsMau, viTriDungSau } = this.state
        let vitrixoa = -1
        let mang = dsMau.map(obj => ({ RowID: obj.RowID, ten: obj.Title }))
        mang.map((x, y) => {
            if (x.RowID == ID) {
                mang.splice(y, 1)
                vitrixoa = y
            }
        })
        if (viTriDungSau >= vitrixoa && this.typeScreen == 2) // khi sửa thì mới sử dụng do trừ luôn vị trí CHÍNH NÓ
            mang.splice(viTriDungSau, 0, { RowID: ID })
        else
            mang.splice(viTriDungSau + 1, 0, { RowID: ID })
        const ress = await postUpdateViTriMau({ ViTri: mang })
        if (ress.status == 1) {
            this.loadDSMau()
            this.props.route.params.reloadControls()
        }
    }
    luu = async (type) => { //type: 1-luu_tieptuc, 2-luu-thoat
        this._checkDuLieuRong().then(async (temp) => {
            if (temp) {
                const res = await postThemMauDeXuat(temp)
                if (res.status == 1) {
                    var messageNotify = RootLang.lang.JeeRequest.thongbao.themmaudexuatthanhcong
                    if (this.typeScreen == 2)
                        messageNotify = RootLang.lang.JeeRequest.thongbao.suamaudexuatthanhcong
                    UtilsApp.MessageShow(RootLang.lang.JeeRequest.Modal_MauYC.loaidulieu, messageNotify, 1)
                    this.setState({ dsValue: [{ Title: "" }] })
                    await this._updateViTri(res.data.ID)
                    if (type == 1) {
                        this.setState({ tenTruong: '', giaiThichTruongDuLieu: '', tenTruongHolder: 'Tên trường' })
                    }
                    if (type == 2) {
                        this._goBack()
                    }
                }
                else {
                    UtilsApp.MessageShow(RootLang.lang.JeeRequest.Modal_MauYC.loaidulieu, res.error ? res.error.message : RootLang.lang.JeeRequest.thongbao.themmaudexuatthatbai, 2)
                }
            }
        })

    }
    addValue = () => {
        const { dsValue } = this.state
        dsValue.push({ Title: "" })
        this.setState({ dsValue: dsValue })
    }
    removeValue = (index) => {
        const { dsValue } = this.state
        if (dsValue.length == 1)
            return
        dsValue.splice(index, 1)
        this.setState({ dsValue: dsValue })
    }
    editValue = (value, index) => {
        const { dsValue } = this.state
        dsValue[index].Title = value
        this.setState({ dsValue: dsValue })
    }
    _onRefreshMau = () => {
        this.loadDSMau()
    }
    _onLoadMore = () => {
        let { pageNumberMau, AllPageMau } = this.state
        if (pageNumberMau < AllPageMau)
            this.setState({ pageNumberMau: pageNumberMau + 1 }, () => this.loadDSMau())
    }

    render() {
        const { opacity, dsControls, tenTruongHolder, tenTruong, giaiThichTruongDuLieu, loaiDuLieu, cauHoiBatBuoc, viTriDungSau, idLoaiDuLieu,
            dsValue, dsMau, dungSau, refreshing } = this.state

        return (
            <View style={[nstyles.ncontainer,
            { backgroundColor: `transparent`, justifyContent: 'flex-end', opacity: 1, }]}>
                <Animated.View onTouchEnd={this._goBack} style={{
                    position: 'absolute', top: 0,
                    bottom: 0, left: 0, right: 0,
                    backgroundColor: colors.backgroundModal, opacity

                }} />
                <View style={{
                    backgroundColor: colors.white, flex: 1, marginTop: Height(15),
                    borderTopLeftRadius: 20, borderTopRightRadius: 20,
                    flexDirection: 'column', paddingHorizontal: 15, paddingBottom: 13
                }}>
                    <HeaderModalCom onPress={this._goBack} title={RootLang.lang.JeeRequest.Modal_MauYC.mau} />
                    <ScrollView style={{ flex: 1 }}>
                        <View style={styles.viewgroup}>
                            <TextInput
                                style={styles.txtinput}
                                placeholder={tenTruongHolder}
                                placeholderTextColor={tenTruongHolder != 'Tên trường không được để trống' ? null : colors.colorPink3}
                                fontStyle={tenTruong.length == 0 && tenTruongHolder == 'Tên trường không được để trống' ? 'italic' : 'normal'}
                                ref={'refTenTruong'}
                                onChangeText={(value) => this.setState({ tenTruong: value })}>
                                {tenTruong}
                            </TextInput>
                        </View>
                        <View style={styles.viewgroup}>
                            <TextInput
                                style={styles.txtinput}
                                placeholder={RootLang.lang.JeeRequest.Modal_MauYC.giaithichtruongdulieu}
                                onChangeText={(value) => this.setState({ giaiThichTruongDuLieu: value })}>{giaiThichTruongDuLieu}</TextInput>
                        </View>
                        <TouchableOpacity style={[styles.viewgroup, { flexDirection: 'row' }]} onPress={() => { this.refs.actionSheetRef.show() }}>
                            <Text style={[styles.tieude, {}]}>{RootLang.lang.JeeRequest.Modal_MauYC.loaidulieu}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', width: '70%', justifyContent: 'flex-end' }}>
                                <Text>{loaiDuLieu} </Text>
                                <Image source={Images.ImageJee.icDropdownn}></Image>
                            </View>
                        </TouchableOpacity>
                        {idLoaiDuLieu == 5 || idLoaiDuLieu == 6 || idLoaiDuLieu == 9 ?
                            <View style={{ marginLeft: 10 }}>
                                {dsValue.map((item, index) =>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <TouchableOpacity onPress={() => this.removeValue(index)}>
                                            <Image source={Images.ImageJee.icDelete_TimKiem} style={{ tintColor: 'red', marginRight: 5 }}></Image>
                                        </TouchableOpacity>
                                        <View style={[styles.viewgroup, { flexDirection: 'row', flex: 1 }]}>
                                            <TextInput placeholder={RootLang.lang.JeeRequest.Modal_MauYC.loaidulieu}
                                                style={styles.txtinput}
                                                onChangeText={(value) => this.editValue(value, index)}>{item.Title}</TextInput>
                                        </View>
                                    </View>)
                                }
                                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, marginLeft: 20 }}
                                    onPress={() => this.addValue()}>
                                    <View style={[nstyles.nIcon19, { backgroundColor: colors.lightGreen, justifyContent: 'center', alignItems: 'center', borderRadius: 10, marginRight: 5 }]}>
                                        <Text style={{ fontSize: reText(13), textAlign: 'center', color: colors.colorTabActive }}>+</Text>
                                    </View>
                                    <Text style={{ fontSize: reText(12), color: colors.colorTabActive }}>{RootLang.lang.JeeRequest.Modal_MauYC.themgiatri}</Text>
                                </TouchableOpacity>
                            </View> : null
                        }
                        <TouchableOpacity style={[styles.viewgroup, { flexDirection: 'row' }]} onPress={() => { this.refs.refBatBuoc.show() }}>
                            <Text style={styles.tieude}>{RootLang.lang.JeeRequest.Modal_MauYC.cauhoibatbuoc}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text>{cauHoiBatBuoc} </Text>
                                <Image source={Images.ImageJee.icDropdownn}></Image>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.viewgroup, { flexDirection: 'row' }]} onPress={() => { this.refs.refThuTu.show() }}>
                            <Text style={styles.tieude}>{RootLang.lang.JeeRequest.Modal_MauYC.thutudungsau}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', maxWidth: '65%' }}>
                                <Text >{dungSau} </Text>
                                <Image source={Images.ImageJee.icDropdownn}></Image>
                            </View>
                        </TouchableOpacity>
                        <View style={{ marginVertical: 30, flexDirection: 'row', justifyContent: 'space-around' }}>
                            <TouchableOpacity style={[{ backgroundColor: colors.colorInput }, styles.button]} onPress={() => this._goBack()}>
                                <Text style={{ color: colors.colorPlayhoder }}>{RootLang.lang.JeeRequest.Modal_MauYC.dong}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[{ backgroundColor: colors.colorBtnlightOrange }, styles.button]} onPress={() => this.luu(1)}>
                                <Text style={{ color: 'white' }}>{RootLang.lang.JeeRequest.Modal_MauYC.luutieptuc}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[{ backgroundColor: colors.colorTabActive }, styles.button]} onPress={() => this.luu(2)}>
                                <Text style={{ color: 'white' }}>{RootLang.lang.JeeRequest.Modal_MauYC.luuthoat}</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
                <ActionSheet ref={'actionSheetRef'}>
                    <View style={{ height: Height(70), paddingHorizontal: 5, marginBottom: Platform.OS == 'ios' ? 15 : 0 }}>
                        <HeaderModalCom onPress={() => this.refs.actionSheetRef.hide()} title={RootLang.lang.JeeRequest.boloc.danhsachloaidulieu}></HeaderModalCom>
                        <ScrollView>
                            <FlatList
                                data={dsControls}
                                extraData={this.state}
                                renderItem={this._renderDSControl}
                                onRefresh={this._onRefreshMau}
                                refreshing={refreshing}
                                onEndReachedThreshold={0.1}
                                showsVerticalScrollIndicator={false}
                                keyExtractor={(item, index) => index.toString()} />
                        </ScrollView>
                    </View>
                </ActionSheet>
                <ActionSheet ref={'refBatBuoc'}>
                    <View style={{ marginBottom: Platform.OS == 'ios' ? 15 : 0, height: Height(30) }}>
                        <HeaderModalCom onPress={() => this.refs.refBatBuoc.hide()} title={RootLang.lang.JeeRequest.Modal_MauYC.cauhoibatbuoc}></HeaderModalCom>
                        <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: colors.lightBlack }}
                            onPress={() => this.setState({ idCauHoiBatBuoc: true, cauHoiBatBuoc: RootLang.lang.JeeRequest.boloc.batbuoc + '*' }, () => this.refs.refBatBuoc.hide())}>
                            <Text>Bắt buộc*</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: colors.lightBlack }}
                            onPress={() => this.setState({ idCauHoiBatBuoc: false, cauHoiBatBuoc: RootLang.lang.JeeRequest.boloc.khongbatbuoc }, () => this.refs.refBatBuoc.hide())}>
                            <Text>Không bắt buộc</Text>
                        </TouchableOpacity>
                    </View>
                </ActionSheet>
                <ActionSheet ref={'refThuTu'}>
                    <View style={{ height: Height(70) }}>
                        <HeaderModalCom onPress={() => this.refs.refThuTu.hide()} title={RootLang.lang.JeeRequest.Modal_MauYC.thutudungsau}></HeaderModalCom>
                        <ScrollView style={{ marginBottom: Platform.OS == 'ios' ? 15 : 0 }}>
                            <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: colors.lightBlack }}
                                onPress={() => this.setState({ viTriDungSau: -1, dungSau: '#1' }, () => this.refs.refThuTu.hide())}>
                                <Text style={{ color: this.state.viTriDungSau == -1 ? 'red' : null }}>#1 </Text>
                            </TouchableOpacity>
                            <FlatList
                                data={dsMau}
                                extraData={this.state}
                                renderItem={this._renderDSMau}
                                keyExtractor={(item, index) => index.toString()} />
                        </ScrollView>
                    </View>
                </ActionSheet>
            </View >
        )
    }
}
const styles = StyleSheet.create({
    viewgroup: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: colors.colorButtonGray
    },
    tieude: {
        flex: 1,
        color: colors.textGray
    },
    button: {
        width: Width(27),
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    txtinput: {
        padding: 0, width: '100%'
    }
})
const mapStateToProps = state => ({
    lang: state.changeLanguage.language,
    reducerBangCong: state.reducerBangCong
});
export default Utils.connectRedux(ModalMauYeuCau, mapStateToProps, true)
