import _ from "lodash";
import React, { Component } from "react";
import { Image, RefreshControl, Text, TextInput, TouchableOpacity, View } from "react-native";
import * as Animatable from 'react-native-animatable';
import DatePicker from 'react-native-datepicker';
import { FlatList } from "react-native-gesture-handler";
import { Add_NhanVienViTri, Delete_NhanVienViTri, Get_DSDiaDiamChamCong, Get_DSNhanVienMinusTmp, Get_DSNhanVienViTri, UpdateStatusNV, GetDSTinhTrangChamCongDD } from '../../../../apis/apiQLCC';
import { RootLang } from "../../../../app/data/locales";
import Utils from "../../../../app/Utils";
import ButtonCom from "../../../../components/Button/ButtonCom";
import IsLoading from "../../../../components/IsLoading";
import { Images } from "../../../../images";
import { colors, fonts } from "../../../../styles";
import { reSize, reText, sizes } from "../../../../styles/size";
import { nstyles, Width } from "../../../../styles/styles";
import { ItemLineText, TouchDropNew, TouchTextInput } from "../../../../Component_old/itemcom/itemcom";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import UtilsApp from "../../../../app/UtilsApp";
import apiAI from "../../../../apis/apiAI";
import { nGlobalKeys } from "../../../../app/keys/globalKey";
import momemt from 'moment'
import { nkey } from "../../../../app/keys/keyStore";

class QuanLyNhanVienCCViTri extends Component {
  constructor(props) {
    super(props);
    this.nthis = this.props.nthis;
    this.state = {
      DSnhanvien: [],
      Snhanvien: {},
      refreshing: false,
      showload: false,
      _page: 1,
      _allPage: 1,
      record: 10,
      maNV: [],
      listDiaDiem: [],
      diaDiem: {},
      search: false,
      nhanvien: '',//search nhân viên
      listTrangThai: [],//List trạng thái
      IdTrangThai: {
        "RowID": -1,
        "Title": "Tất cả"
      },//search theo trạng thái
      _TuNgay: '',
      addNV: false,
      listNhanVienMinus: [],
      stHieuLuc: false,
      hieuluc: {},
      listHieuLuc: [
        { name: "Hiệu Lực", status: 1 },
        { name: "Hết Hiệu Lực", status: 2 }
      ],
      nhanvienhieuluc: [],
      ngayhethieuluc: ''


    };

  }


  componentDidMount = async () => {
    // await this._getStatus()
    await this._getListNhanVien()
    await this._GetDiaDiem()
    this.GetDSTinhTrangChamCongDD()

  }

  GetDSTinhTrangChamCongDD = async () => {
    let lang = await Utils.getGlobal(nGlobalKeys.lang, 'vi');
    let res = await GetDSTinhTrangChamCongDD(lang)
    if (res && res.status == 1) {
      this.setState({
        listTrangThai: [{
          ...{
            "RowID": -1,
            "Title": "Tất cả"
          }
        }, ...res.data]
      })
    }
    else {
      this.setState({ listTrangThai: [] })
    }
  }


  Get_DSNhanVien = async () => {
    const { maNV, nhanvien, diaDiem, IdTrangThai } = this.state
    nthisLoading.show();
    const res = await Get_DSNhanVienViTri(nhanvien, _.size(diaDiem) > 0 ? diaDiem.RowID : '', IdTrangThai.RowID)
    // Utils.nlog('res Get_DSNhanVien', res)
    if (res.status == 1) {
      // Utils.nlog(res)
      nthisLoading.hide();
      this.setState({ DSnhanvien: res.data, refreshing: false })
      let ds = [];
      for (let i = 0; i < res.data.length; i++) {
        ds.push(res.data[i].MaNV)
        // this.setState({ maNV: maNV.push(res.data ? res.data[i].ID_NV : null) }) code cũ
      }
      Utils.nlog(ds)
      this.setState({ DSnhanvien: res.data, refreshing: false, maNV: ds })
      // this.setState({ maNV: maNV }) code cũ
    }
    else {
      nthisLoading.hide();
      UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.thuchienthatbai, 2)
    }
  }
  componentDidUpdate = async () => {
    await this._onRefresh
  }

  _GetDiaDiem = async () => {
    const res = await Get_DSDiaDiamChamCong();
    // Utils.nlog('res _GetDiaDiem', res)
    nthisLoading.show();
    if (res.status == 1) {
      nthisLoading.hide();
      this.setState({
        listDiaDiem: res.data
      })
    } else {
      nthisLoading.hide();
      UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
    }
  }

  _getListNhanVien = async () => {
    // const { maNV } = this.state
    const res = await Get_DSNhanVienMinusTmp();
    // Utils.nlog('res _getListNhanVien', res)
    nthisLoading.show();
    if (res.status == 1) {
      nthisLoading.hide();
      this.setState({
        listNhanVienMinus: res.data,
      })
    } else {
      nthisLoading.hide();
      UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
    }
  }


  renderListEmpty = () => {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Image source={Images.icListEmpty} style={{ width: sizes.nImgSize200, height: sizes.nImgSize200 }} resizeMode={'cover'} />
        <Text style={{ fontSize: sizes.sText16, color: colors.brownGreyTwo }}>{_.size(this.state.diaDiem) == 0 ? RootLang.lang.scQuanLyChamCong.chonvitri : RootLang.lang.scQuanLyChamCong.khongconhanvienchamcong}</Text>
      </View>
    )
  }
  _onRefresh = () => {
    this.setState({ refreshing: true }, () => (this.Get_DSNhanVien(), this._GetDiaDiem));
  }
  loadMoreData = async () => {
    var { _page, _allPage } = this.state;
    if (_page < _allPage) {
      this.setState({ showload: true }, () => this.Get_DSNhanVien(_page + 1));
    }
  }

  _Delete = async (RowID, Ten) => {
    Utils.showMsgBoxYesNo(this.nthis, RootLang.lang.thongbaochung.thongbao, RootLang.lang.thongbaochung.bancochac, RootLang.lang.thongbaochung.co, RootLang.lang.thongbaochung.khong, async () => {

      const res = await Delete_NhanVienViTri(RowID)
      nthisLoading.show();

      if (res.status == 1) {
        nthisLoading.hide();

        UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.scQuanLyChamCong.daxoanhanvien + " " + Ten, 1)
        this.Get_DSNhanVien()
      }
      else {
        nthisLoading.hide();
        UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.thuchienthatbai, 2)
      }

    })
  }




  handleViewRef = ref => this.view = ref;

  bounce = () => {
    const { search } = this.state
    search === false ? this.view.slideInDown(500) : this.view.slideInUp(500)
  };

  _SortNhanVienDD = () => {
    this._GetDiaDiem()
    Utils.goscreen(this.nthis, 'Modal_ComponentSelectCom', {
      callback: this._callbackSortDiaDiem, item: this.state.diaDiem,
      AllThaoTac: this.state.listDiaDiem, ViewItem: this.ViewItemDiaDiem
    })
  }

  _AddNhanVienDropDown = () => {
    Utils.goscreen(this.nthis, 'Modal_ComponentSelectCom', {
      callback: this._callbackThemNhanVien, item: this.state.Snhanvien,
      AllThaoTac: this.state.listNhanVienMinus, ViewItem: this.ViewItemNhanVien
    })
  }

  ViewItemNhanVien = (item) => {

    return (
      <View
        key={item.IDNV.toString()}
      >
        <Text style={{
          textAlign: "center", fontSize: sizes.sText16,
          color: this.state.Snhanvien.IDNV == item.IDNV ? colors.textblack : colors.colorTextBTGray,
          fontWeight: this.state.Snhanvien.IDNV == item.IDNV ? "bold" : 'normal'
        }}>{item.HoTen ? item.HoTen : ""}</Text>
      </View>
    )
  }
  _callbackThemNhanVien = (Snhanvien) => {
    try {
      this.setState({ Snhanvien });
    } catch (error) {

    }
  }

  _addNhanVien = async () => {
    const { Snhanvien, _TuNgay, diaDiem } = this.state
    const res = await Add_NhanVienViTri(Snhanvien.IDNV, diaDiem.RowID, _TuNgay.replace(/-/g, "/"), diaDiem.TenDiaDiem);
    if (res.status == 1) {
      UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.scQuanLyChamCong.themnhanvien + " " + Snhanvien.HoTen + "\n" + RootLang.lang.scQuanLyChamCong.thanhcong, 1)
      this._onRefresh()
      this.nthis._AddNhanVienFalse()
    }
    else
      UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.thuchienthatbai, 2)
  }

  _addTrangThai = async (item) => {
    const { diaDiem } = this.state
    const res = await Add_NhanVienViTri(item.IdNV, diaDiem.RowID, momemt().format('DD/MM/YYYY'), diaDiem.TenDiaDiem);
    if (res.status == 1) {
      UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.scQuanLyChamCong.themnhanvien + " " + item.HoTen + " " + RootLang.lang.scQuanLyChamCong.thanhcong, 1)
      this._onRefresh()
      this.nthis._AddNhanVienFalse()
    }
    else
      UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.thuchienthatbai, 2)
  }


  _callbackSortDiaDiem = (diaDiem) => {
    try {
      this.setState({ diaDiem }, () => { this.Get_DSNhanVien(diaDiem) });
    } catch (error) {

    }
  }


  ViewItemDiaDiem = (item) => {
    return (
      <View
        key={item.RowID.toString()}
      >
        <Text style={{
          textAlign: "center", fontSize: sizes.sText16,
          color: this.state.diaDiem.RowID == item.RowID ? colors.textblack : colors.colorTextBTGray,
          fontWeight: this.state.diaDiem.RowID == item.RowID ? "bold" : 'normal'
        }}>{item.TenDiaDiem ? item.TenDiaDiem : ""}</Text>
      </View>
    )
  }
  onShowFaceImg = async (IdNV) => {

    let res = await apiAI.getFaceRegister(IdNV, await Utils.ngetStorage(nkey.IDKH_DPS, 0));
    if (res && res.status == "1" && res.data.frames.length != 0) {
      UtilsApp.showImageZoomViewer(this.nthis, ['data:image/jpg;base64,' + res.data.frames[0].face]);
    } else
      Utils.showMsgBoxYesNo(this.nthis, RootLang.lang.thongbaochung.canhbao, RootLang.lang.scQuanLyChamCong.thongbaokhuonmat,
        RootLang.lang.scQuanLyChamCong.dangkykhuonmat, RootLang.lang.scQuanLyChamCong.desau, () => {
          Utils.goscreen(this.nthis, "sc_ChamCongCamera", { callback: this._onRefresh, IdNV: IdNV, isMode: 1 })
        })
  }


  _renderItem = ({ item, index }) => {
    var { stHieuLuc } = this.state
    return (
      <View style={{ backgroundColor: colors.backgroundColor, }}>
        <TouchableOpacity
          onPress={item.TinhTrangID == 3 ? () =>
            UtilsApp.MessageShow('Thông báo', 'Nhân viên này chưa được thêm tình trạng', 3)
            : () => {
              this.setState({ nhanvienhieuluc: item, stHieuLuc: !stHieuLuc })
            }}
          onLongPress={() => {
            item.TinhTrangID == 3 ? null : this._Delete(item.RowID, item.HoTen)
          }}
          style={nstyles.shadow, {
            flex: 1, flexDirection: 'row',
            backgroundColor: colors.white, paddingVertical: 15,
            height: 'auto', paddingHorizontal: 10,

          }}>
          <View style={{ flex: 1, flexDirection: 'row', height: '100%', alignItems: 'center' }}>
            <Image source={item.Image ? { uri: item.Image } : Images.JeeAvatarBig} style={[nstyles.nAva40]} />
            <View style={{ flex: 1, paddingLeft: 10 }}>
              <View style={{ flex: 1 }}>
                <View style={{ flex: 1, flexDirection: 'row', marginRight: 20 }}>
                  <Text style={{
                    fontSize: sizes.sText16, lineHeight: sizes.sText17, flex: 1,
                    fontFamily: fonts.Helvetica, color: colors.colorTextBack80
                  }}
                    numberOfLines={2}
                  >{item.HoTen}</Text>
                  <Text style={{ color: colors.textTabActive, fontSize: sizes.sText16, }}>{item.MaNV}</Text>

                </View>

                <View style={{ flex: 1, marginTop: 5, flexDirection: 'row', marginRight: 20 }}>
                  <View style={{ flexDirection: "row", flex: 1, }}>
                    <Text style={{
                      fontFamily: fonts.Helvetica,
                      color: colors.colorGrayLight, marginRight: 3,
                      fontSize: sizes.sText12, lineHeight: sizes.sText16, alignSelf: 'center'
                    }}>{RootLang.lang.scQuanLyChamCong.tinhtrang} :
                    </Text>
                    {item.TinhTrangID == 3 ?
                      <TouchableOpacity onPress={() => this._addTrangThai(item)} style={{ flexDirection: "row", borderWidth: 0.5, paddingHorizontal: 5, borderColor: colors.greenButton, paddingVertical: 3, justifyContent: 'center', alignItems: 'center', borderRadius: 3 }}>
                        <Image source={Images.icAddH} style={{ tintColor: colors.greenButton, width: Width(4), height: Width(4), marginRight: 5 }} />
                        <Text style={{ fontSize: reText(13), color: colors.greenButton }}>{RootLang.lang.thongbaochung.them}</Text>
                      </TouchableOpacity> :
                      <Text style={{
                        fontFamily: fonts.Helvetica,
                        color: item.TinhTrangID == 1 ? colors.blueColor : colors.redFresh,
                        fontSize: sizes.sText12, lineHeight: sizes.sText16
                      }}>{item.TinhTrang ? item.TinhTrang : "..."}
                      </Text>}

                  </View>
                  <Text
                    numberOfLines={2}
                    style={{
                      textAlign: "right",
                      width: Width(35),
                      fontStyle: 'italic',
                      fontFamily: fonts.Helvetica,
                      color: colors.colorGrayLight,
                      fontSize: sizes.sText12, lineHeight: sizes.sText16,
                    }}>{item.PhongBan}</Text>
                </View>

                <View style={{ flexDirection: "row", marginTop: 5 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{
                      fontFamily: fonts.HelveticaBold,
                      color: !item.IsDangKyFaceID ? colors.coralTwo : colors.greenTab,
                      fontSize: sizes.sText12, lineHeight: sizes.sText17,
                    }}>{!item.IsDangKyFaceID ? RootLang.lang.scdangkykhuonmat.chuadangkykhuonmat : RootLang.lang.scdangkykhuonmat.dadangkykhuonmat}</Text>

                  </View>
                  <TouchableOpacity style={{ marginRight: 20 }} onPress={() => this.onShowFaceImg(item.IdNV)}>
                    <Image source={Images.icReviewFace} style={[nstyles.nIcon30]} />
                  </TouchableOpacity>
                </View>
                {item.TinhTrangID == 3 ? null :
                  <TouchableOpacity onPress={() => this._Delete(item.RowID, item.HoTen)} style={{ flexDirection: "row", borderWidth: 0.5, width: Width(16), borderColor: colors.deleteItem, paddingVertical: 3, justifyContent: 'center', alignItems: 'center', borderRadius: 3 }}>
                    <Image source={Images.icDeleteItem} style={{ tintColor: colors.deleteItem, width: Width(4), height: Width(4), marginRight: 5 }} />
                    <Text style={{ fontSize: reText(13), color: colors.deleteItem }}>{RootLang.lang.thongbaochung.xoa}</Text>
                  </TouchableOpacity>
                }
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <View style={{
          width: '100%', backgroundColor: colors.white,
          height: 1, alignItems: 'center'
        }}>
          <View style={{ width: '90%', backgroundColor: colors.veryLightPink, height: 1 }}></View>
        </View>
      </View >
    );
  }

  // _getStatus = async () => {
  //   this.setState({
  //     listHieuLuc: [
  //       { name: "Hiệu Lực", status: 1 },
  //       { name: "Hết Hiệu Lực", status: 2 }

  //     ],
  //   })
  // }
  ViewItemStatus = (item) => {
    return (
      <View key={item.status.toString()} >
        <Text style={{
          textAlign: "center", fontSize: sizes.sText16,
          color: this.state.hieuluc.status == item.status ? colors.textblack : colors.colorTextBTGray,
          fontWeight: this.state.hieuluc.status == item.status ? "bold" : 'normal'
        }}>{item.name ? item.name : ""}</Text>
      </View>
    )
  }
  _Status = () => {
    Utils.goscreen(this.nthis, 'Modal_ComponentSelectCom', {
      callback: this._callbackStatus,
      item: this.state.hieuluc, AllThaoTac: this.state.listHieuLuc, ViewItem: this.ViewItemStatus
    })
  }
  _callbackStatus = (hieuluc) => {
    try {
      this.setState({ hieuluc });
    } catch (error) {

    }
  }

  _updateStatus = async () => {
    const { ngayhethieuluc, nhanvienhieuluc, hieuluc } = this.state
    if (_.size(hieuluc) == 0) {
      UtilsApp.MessageShow("Thông Báo", "Bạn chưa chọn tình trạng", 3)
    }
    const res = await UpdateStatusNV(nhanvienhieuluc.RowID, hieuluc.status, ngayhethieuluc.replace(/-/g, "/"))
    if (res.status == 1) {
      UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.scQuanLyChamCong.capnhattrangthai + "\n\n" + nhanvienhieuluc.HoTen + RootLang.lang.scQuanLyChamCong.thanhcong, 1)
      this.Get_DSNhanVien()
      this.setState({ stHieuLuc: false })
    }
    else
      UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.thuchienthatbai, 2)
  }


  _callbackTrangThai = (item) => {
    this.setState({ IdTrangThai: item }, () => this.Get_DSNhanVien())
  }
  ViewItemTrangThai = (item) => {
    return (
      <View key={item.RowID.toString()} >
        <Text style={{
          textAlign: "center", fontSize: sizes.sText16,
          color: this.state.IdTrangThai.RowID == item.RowID ? colors.textBlack : colors.colorTextBTGray,
          fontWeight: this.state.IdTrangThai.RowID == item.RowID ? "bold" : 'normal'
        }}>{item.Title ? item.Title : ""}</Text>
      </View>
    )
  }


  render() {
    const { addNhanVien, isFilter } = this.props
    const { DSnhanvien } = this.state
    var { nhanvien, search, diaDiem, _TuNgay, Snhanvien, stHieuLuc, nhanvienhieuluc, hieuluc, ngayhethieuluc, listTrangThai, IdTrangThai } = this.state
    { addNhanVien == true && _.size(diaDiem) == 0 ? Utils.showMsgBoxOK(this.nthis, RootLang.lang.thongbaochung.thongbao, RootLang.lang.scQuanLyChamCong.vuilongchondiadiemchamcong, "OK", () => { this.nthis._AddNhanVienFalse() }) : null }
    return (
      <View style={{ flex: 1, backgroundColor: colors.backgroundColor, paddingHorizontal: 10 }}>
        <Animatable.View animation={'slideInLeft'} delay={100}  >
          <TouchDropNew
            title={RootLang.lang.scQuanLyChamCong.loctheovitri}
            value={diaDiem.TenDiaDiem}
            styView={{ marginVertical: 5 }}
            _onPress={this._SortNhanVienDD} />
        </Animatable.View>
        {isFilter ?
          <Animatable.View animation={'slideInLeft'} delay={100}  >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TextInput
                style={{
                  marginVertical: 5,
                  paddingHorizontal: 20,
                  width: '49%',
                  flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                  paddingVertical: 15, backgroundColor: colors.white,
                }}
                placeholder={RootLang.lang.scQuanLyNhanVien.timkiemnhanvien}
                placeholderTextColor={colors.colorPlayhoder}
                onChangeText={(nhanvien) =>
                  _.size(diaDiem) == 0 ?
                    UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.scQuanLyChamCong.vuilongchondiadiemchamcong, 3)
                    : this.setState({ nhanvien }, this.Get_DSNhanVien)}
                ref={ref => nhanvien = ref}
              >
                {nhanvien}
              </TextInput>
              <TouchableOpacity
                onPress={() =>
                  _.size(diaDiem) == 0 ?
                    UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.scQuanLyChamCong.vuilongchondiadiemchamcong, 3)
                    :
                    Utils.goscreen(this.nthis, 'Modal_ComponentSelectCom', {
                      callback: this._callbackTrangThai, item: IdTrangThai,
                      AllThaoTac: listTrangThai, ViewItem: this.ViewItemTrangThai
                    })}
                style={{
                  marginVertical: 5,
                  paddingHorizontal: 20,
                  width: '49%',
                  flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                  paddingVertical: 15, backgroundColor: colors.white,
                }}
              >
                <Text style={{ fontSize: reText(14) }}>{IdTrangThai.Title}</Text>
                <Image source={Images.icDropDownU} style={{ width: Width(3), height: Width(2), tintColor: colors.colorPlayhoder }} />
              </TouchableOpacity>
            </View>
          </Animatable.View>
          : null}
        {addNhanVien == true ?
          <Animatable.View animation={'slideInLeft'} delay={100}  >
            <TouchTextInput
              styView={{ marginVertical: 5, backgroundColor: colors.white, marginLeft: 3 }}
              textInput={
                <View style={{ flexDirection: "row", marginLeft: 20 }}>
                  <TextInput
                    style={{
                      textInput: {
                        margin: 5,
                        paddingHorizontal: 20,
                        width: '100%',
                        flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                        paddingVertical: 15, backgroundColor: colors.white,
                      }
                    }}
                    placeholder={RootLang.lang.scQuanLyChamCong.tungay}
                    placeholderTextColor={colors.colorPlayhoder}

                    onChangeText={(_TuNgay) => this.setState({ _TuNgay })}
                    ref={ref => _TuNgay = ref}
                  >
                    {_TuNgay}
                  </TextInput>

                  <TouchableOpacity style={{ position: "absolute", alignSelf: "center", marginLeft: "91%" }}
                    onPress={() => this.datePickerRef.onPressDate()}>
                    <Image source={Images.icCalandaS} style={[nstyles.nIcon20, {}]} />
                  </TouchableOpacity>
                  <View>
                    <DatePicker
                      showIcon={false}
                      hideText={true}
                      ref={(ref) => this.datePickerRef = ref}
                      locale={this.props.lang == 'en' ? 'en' : 'vi'}
                      date={_TuNgay}
                      mode="date"
                      format="DD/MM/YYYY"
                      confirmBtnText={RootLang.lang.scQuanLyNhanVien.xacnhan}
                      cancelBtnText={RootLang.lang.scQuanLyNhanVien.huy}
                      androidMode={'spinner'}
                      iconSource={null}
                      allowFontScaling={false}
                      customStyles={{
                        datePicker: {
                          backgroundColor: '#d1d3d8',
                          justifyContent: "center"
                        },
                        dateInput: {
                          borderColor: colors.white,
                          backgroundColor: colors.white,
                        },

                      }}
                      onDateChange={(date) => { this.setState({ _TuNgay: date }) }}
                    />
                  </View>
                </View>
              }
              required={true}
            />
            <TouchDropNew
              title={RootLang.lang.scQuanLyChamCong.themnhanvien}
              value={Snhanvien.HoTen}
              styView={{ marginVertical: 5 }}
              _onPress={this._AddNhanVienDropDown} />
            <View style={{
              alignItems: "center", marginVertical: 10,
              alignSelf: "center",
            }}>
              <View style={{ flexDirection: 'row' }}>
                <ButtonCom
                  text={RootLang.lang.scQuanLyChamCong.huy}
                  style={{
                    backgroundColor: colors.black_20,
                    backgroundColor1: colors.black_20,
                    fontSize: sizes.sText14,
                    width: reSize(160),
                  }}
                  onPress={() => { this.nthis._AddNhanVienFalse() }}
                />
                <View style={{ width: Width(5) }} />
                <ButtonCom
                  text={RootLang.lang.scQuanLyChamCong.themnhanvien}
                  style={{
                    backgroundColor: colors.colorButtomleft,
                    backgroundColor1: colors.colorButtomright,
                    fontSize: sizes.sText14,
                    width: reSize(160),
                  }}
                  onPress={this._addNhanVien}
                />
              </View>
            </View>

          </Animatable.View> : null}
        {addNhanVien == true || stHieuLuc == true ? null :
          <>
            <Animatable.View ref={this.handleViewRef}
              animation={this.props.addNhanVien || stHieuLuc == true ? "slideInDown" : "slideInUp"}
              duration={500}
              style={{ flex: 1 }} >
              <KeyboardAwareScrollView
                refreshControl={
                  <RefreshControl refreshing={this.state.refreshing} onRefresh={_.size(diaDiem) > 0 ? this._onRefresh : null} />}>
                <FlatList
                  data={DSnhanvien}
                  ListEmptyComponent={this.renderListEmpty}
                  initialNumToRender={2}
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh}
                  renderItem={this._renderItem}
                  style={{ flex: 1, marginVertical: 3 }}
                  showsVerticalScrollIndicator={false}
                  onEndReached={this.loadMoreData}
                  onEndReachedThreshold={0.2}
                  ListFooterComponent={this.state.showload ?
                    <ActivityIndicator size='small' /> : null}
                  keyExtractor={(item, index) => index.toString()} />

              </KeyboardAwareScrollView>
              {addNhanVien == false && _.size(diaDiem) == 0 ? null :
                <View style={{ justifyContent: "center", alignSelf: "center", marginVertical: 5, position: 'absolute', bottom: 12, left: Width(28) }}>
                  <ButtonCom
                    text={RootLang.lang.scQuanLyChamCong.themmoinhanvien}
                    style={{
                      backgroundColor: colors.colorButtomleft,
                      backgroundColor1: colors.colorButtomright,
                      fontSize: sizes.sText14,
                      width: reSize(160),
                    }}
                    onPress={() => { this.props._AddNhanVienTrue() }}
                  />
                </View>
              }
            </Animatable.View>
          </>}
        {stHieuLuc == true && this.props.addNhanVien == false ?
          <Animatable.View animation={'slideInLeft'} delay={100}  >
            <View style={{ backgroundColor: colors.colorBGHome, height: 100 }}>

              <View style={{
                flex: 1, flexDirection: 'row', height: '100%', alignItems: 'center', flexDirection: 'row',
                backgroundColor: colors.white, paddingVertical: 15,
                height: 'auto', paddingHorizontal: 10,
              }}>
                <Image source={nhanvienhieuluc.Image ? { uri: nhanvienhieuluc.Image } : Images.JeeAvatarBig} style={[nstyles.nAva40]} />
                <View style={{ flex: 1, paddingLeft: 10 }}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flex: 1, flexDirection: 'row', marginRight: 20 }}>
                      <Text style={{
                        fontSize: sizes.sText16, lineHeight: sizes.sText17, flex: 1,
                        fontFamily: fonts.Helvetica, color: colors.colorTextBack80
                      }}
                        numberOfLines={2}
                      >{nhanvienhieuluc.HoTen}</Text>
                      <Text style={{ color: colors.textTabActive, fontSize: sizes.sText16, }}>{nhanvienhieuluc.MaNV}</Text>

                    </View>

                    <View style={{ flex: 1, marginTop: 6, flexDirection: 'row', marginRight: 20 }}>
                      <View style={{ flexDirection: "row", flex: 1, }}>
                        <Text style={{
                          fontFamily: fonts.Helvetica,
                          color: colors.colorGrayLight, marginRight: 3,
                          fontSize: sizes.sText12, lineHeight: sizes.sText16
                        }}>{RootLang.lang.scQuanLyChamCong.tinhtrang} :
                        </Text>
                        <Text style={{
                          fontFamily: fonts.Helvetica,
                          color: nhanvienhieuluc.TinhTrangID == 1 ? colors.blueColor : colors.redFresh,
                          fontSize: sizes.sText12, lineHeight: sizes.sText16
                        }}>{nhanvienhieuluc.TinhTrang ? nhanvienhieuluc.TinhTrang : "..."}
                        </Text>
                      </View>
                      <Text style={{
                        fontStyle: 'italic',
                        fontFamily: fonts.Helvetica,
                        color: colors.colorGrayLight,
                        fontSize: sizes.sText12, lineHeight: sizes.sText16,
                      }}>{nhanvienhieuluc.PhongBan}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View >
            <TouchDropNew
              value={hieuluc.name}
              styView={{ marginVertical: 5 }}
              title={RootLang.lang.scQuanLyChamCong.tinhtrang}
              required={true}
              _onPress={this._Status} />
            {hieuluc.status == 2 ?
              <TouchTextInput
                styView={{ marginVertical: 5, backgroundColor: colors.white, marginLeft: 3 }}
                textInput={
                  <View style={{ flexDirection: "row", marginLeft: 20 }}>
                    <TextInput
                      style={{
                        textInput: {
                          margin: 5,
                          paddingHorizontal: 20,
                          width: '100%',
                          flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                          paddingVertical: 15, backgroundColor: colors.white,
                        }
                      }}
                      placeholder={RootLang.lang.scQuanLyChamCong.ngayhethieuluc}
                      placeholderTextColor={colors.colorPlayhoder}

                      onChangeText={(ngayhethieuluc) => this.setState({ ngayhethieuluc })}
                      ref={ref => ngayhethieuluc = ref}
                    >
                      {ngayhethieuluc}
                    </TextInput>

                    <TouchableOpacity style={{ position: "absolute", alignSelf: "center", marginLeft: "91%" }}
                      onPress={() => this.datePickerRef.onPressDate()}>
                      <Image source={Images.icCalandaS} style={[nstyles.nIcon20, {}]} />
                    </TouchableOpacity>
                    <View>
                      <DatePicker
                        showIcon={false}
                        hideText={true}
                        ref={(ref) => this.datePickerRef = ref}
                        locale={this.props.lang == 'en' ? 'en' : 'vi'}
                        date={ngayhethieuluc}
                        mode="date"
                        format="DD/MM/YYYY"
                        confirmBtnText={RootLang.lang.scQuanLyNhanVien.xacnhan}
                        cancelBtnText={RootLang.lang.scQuanLyNhanVien.huy}
                        androidMode={'spinner'}
                        iconSource={null}
                        allowFontScaling={false}
                        customStyles={{
                          datePicker: {
                            backgroundColor: '#d1d3d8',
                            justifyContent: "center"
                          },
                          dateInput: {
                            borderColor: colors.white,
                            backgroundColor: colors.white,
                          },

                        }}
                        onDateChange={(date) => { this.setState({ ngayhethieuluc: date }) }}
                      />
                    </View>
                  </View>
                }
                required={true}
              /> : null}
            <View style={{
              alignItems: "center", marginVertical: 10,
              alignSelf: "center", flexDirection: "row"
            }}>
              <ButtonCom
                text={RootLang.lang.scQuanLyChamCong.huy}
                style={{
                  backgroundColor: colors.black_20,
                  backgroundColor1: colors.black_20,
                  fontSize: sizes.sText14,
                  width: reSize(140),
                }}
                onPress={() => {
                  this.setState({
                    stHieuLuc: false,
                    hieuluc: {},
                    // listHieuLuc: {},
                    nhanvienhieuluc: [],
                    ngayhethieuluc: ''
                  })
                }}
              />
              <View style={{ paddingHorizontal: 10 }} />
              <ButtonCom
                text={RootLang.lang.scQuanLyChamCong.capnhat}
                style={{
                  backgroundColor: colors.colorButtomleft,
                  backgroundColor1: colors.colorButtomright,
                  fontSize: sizes.sText14,
                  width: reSize(140),
                }}
                onPress={this._updateStatus}
              />
            </View>
          </Animatable.View>
          : null}
        <IsLoading />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  lang: state.changeLanguage.language
});
export default Utils.connectRedux(QuanLyNhanVienCCViTri, mapStateToProps, true)
