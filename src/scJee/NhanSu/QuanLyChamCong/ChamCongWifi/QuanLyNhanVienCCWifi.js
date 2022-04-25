import React, { Component } from "react";
import { Image, View, Text, TouchableOpacity, TextInput, RefreshControl } from "react-native";
import { colors, fonts } from "../../../../styles";
import IsLoading from "../../../../components/IsLoading";
import { Get_DSNhanVienWifi, Get_DSNhanVienMinus, Delete_NhanVienWifi, Add_NhanVien } from '../../../../apis/apiQLCC'
import { FlatList } from "react-native-gesture-handler";
import { Images } from "../../../../images";
import { sizes } from "../../../../styles/size";
import { RootLang } from "../../../../app/data/locales";
import { nstyles, Width } from "../../../../styles/styles";
import Utils from "../../../../app/Utils";
import moment from 'moment';
import * as Animatable from 'react-native-animatable';
import { TouchDropNew } from "../../../../Component_old/itemcom/itemcom";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import UtilsApp from "../../../../app/UtilsApp";


class QuanLyNhanVienCCWifi extends Component {
  constructor(props) {
    super(props);
    this.nthis = this.props.nthis;
    this.state = {
      DSnhanvien: [],
      Snhanvien: {},
      refreshing: true,
      showload: false,
      _page: 1,
      _allPage: 1,
      record: 10,
      maNV: [],
      listNhanVienMinus: [],
      search: true,
      nhanvien: '',


    };

  }


  componentDidMount = async () => {
    await this.Get_DSNhanVien()
    await this._getListNhanVien()
  }

  Get_DSNhanVien = async () => {
    var { maNV, nhanvien } = this.state
    const res = await Get_DSNhanVienWifi(nhanvien)
    nthisLoading.show();

    if (res.status == 1) {
      nthisLoading.hide();
      this.setState({ DSnhanvien: res.data, refreshing: false })
      for (let i = 0; i < res.data.length; i++) {
        this.setState({ maNV: maNV.push(res.data ? res.data[i].ID_NV : null) })
      }
      this.setState({ maNV: maNV })
    }
    else {
      nthisLoading.hide();
      UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.thuchienthatbai, 2)
    }
  }

  _getListNhanVien = async () => {
    const { maNV } = this.state
    const res = await Get_DSNhanVienMinus(maNV.toString());
    if (res.status == 1) {
      this.setState({
        listNhanVienMinus: res.data,
      })
    } else {
      UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
    }
  }

  renderListEmpty = () => {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Image source={Images.icListEmpty} style={{ width: sizes.nImgSize200, height: sizes.nImgSize200 }} resizeMode={'cover'} />
        <Text style={{ fontSize: sizes.sText16, color: colors.brownGreyTwo }}>{RootLang.lang.thongbaochung.thongbao}</Text>
      </View>
    )
  }
  _onRefresh = () => {
    this.setState({ refreshing: true }, () => this.Get_DSNhanVien());
  }
  loadMoreData = async () => {
    var { _page, _allPage } = this.state;
    if (_page < _allPage) {
      this.setState({ showload: true }, () => this.Get_DSNhanVien(_page + 1));
    }
  }

  _Delete = async (RowID, Ten) => {
    const res = await Delete_NhanVienWifi(RowID)
    nthisLoading.show();

    if (res.status == 1) {
      nthisLoading.hide();
      UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.scQuanLyChamCong.daxoanhanvien + " " + Ten, 1)
      this.Get_DSNhanVien()
    }
    else {
      nthisLoading.hide();
      UtilsApp.MessageShow()
      UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.thuchienthatbai, 2)
    }
  }


  _renderItem = ({ item, index }) => {
    return (
      <View style={{ backgroundColor: colors.backgroundColor, }}>
        <TouchableOpacity
          onLongPress={() => {
            Utils.showMsgBoxYesNo(this.nthis, RootLang.lang.thongbaochung.thongbao, RootLang.lang.scQuanLyChamCong.bancomuonxoanhanvien + "\n\n" + item.HoTen, RootLang.lang.scQuanLyChamCong.xacnhanxoa, RootLang.lang.scQuanLyChamCong.huy,
              () => {
                this._Delete(item.RowID, item.HoTen)
              },

            )
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

                <View style={{ flex: 1, marginTop: 6, flexDirection: 'row', marginRight: 20 }}>
                  <Text style={{
                    fontFamily: fonts.Helvetica,
                    color: colors.colorGrayLight,
                    fontSize: sizes.sText12, lineHeight: sizes.sText16, flex: 1
                  }}>{RootLang.lang.scQuanLyChamCong.ngaydangky}: {item.NgayThem ? moment(item.NgayThem).format("DD/MM/YYYY") : ""}
                  </Text>
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

  handleViewRef = ref => this.view = ref;

  _AddNhanVien = () => {
    Utils.goscreen(this.nthis, 'Modal_ComponentSelectCom', {
      callback: this._callbackThemNhanVien, item: this.state.Snhanvien,
      AllThaoTac: this.state.listNhanVienMinus, ViewItem: this.ViewItemNhanVien
    })
  }

  _callbackThemNhanVien = (Snhanvien) => {
    try {
      this.setState({ Snhanvien }, () => { this._addNhanVien() });
    } catch (error) {

    }
  }

  _addNhanVien = async () => {
    const { Snhanvien } = this.state
    const res = await Add_NhanVien(Snhanvien.IDNV);
    if (res.status == 1) {
      UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.scQuanLyChamCong.themnhanvien + " " + Snhanvien.HoTen, 1)
      this.Get_DSNhanVien()
    }
    else
      UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.thuchienthatbai, 2)
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




  render() {
    const { addNhanVien } = this.props
    const { DSnhanvien } = this.state
    var { nhanvien, search } = this.state

    return (
      <View style={{ flex: 1, backgroundColor: colors.backgroundColor, paddingHorizontal: 10 }}>
        {search == true ?
          <Animatable.View animation={'slideInLeft'} delay={100}  >
            <TextInput
              style={{
                marginVertical: 5,
                paddingHorizontal: 20,
                width: '100%',
                flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                paddingVertical: 15, backgroundColor: colors.white,
              }}
              placeholder={RootLang.lang.scQuanLyNhanVien.timkiemnhanvien}
              placeholderTextColor={colors.colorPlayhoder}
              onChangeText={(nhanvien) => this.setState({ nhanvien }, this.Get_DSNhanVien)}
              ref={ref => nhanvien = ref}
            >
              {nhanvien}
            </TextInput>
          </Animatable.View> : null}
        {addNhanVien == false ?
          <Animatable.View animation={'slideInLeft'} delay={100}  >
            <TouchDropNew
              title={RootLang.lang.scQuanLyChamCong.themnhanvien}
              styView={{ marginVertical: 5 }}
              _onPress={this._AddNhanVien} />
          </Animatable.View> : null}
        <Animatable.View ref={this.handleViewRef}
          animation={this.props.addNhanVien ? "slideInDown" : "slideInUp"}
          duration={500}
          style={{ flex: 1 }} >
          <KeyboardAwareScrollView
            refreshControl={
              <RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh} />}>
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
        </Animatable.View >
        <IsLoading />
      </View >
    );
  }
}
const mapStateToProps = state => ({
  lang: state.changeLanguage.language
});
export default Utils.connectRedux(QuanLyNhanVienCCWifi, mapStateToProps, true)