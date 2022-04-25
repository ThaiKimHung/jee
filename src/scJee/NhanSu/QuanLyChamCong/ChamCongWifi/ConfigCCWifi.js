import React, { Component } from "react";
import { Image, View, Text, TouchableOpacity, TextInput, RefreshControl } from "react-native";
import { colors, fonts } from "../../../../styles";
import IsLoading from "../../../../components/IsLoading";
import { Get_DSThietBiWiFi, Get_DSListDiaDiem, Add_Wifi } from '../../../../apis/apiQLCC'
import { FlatList } from "react-native-gesture-handler";
import { Images } from "../../../../images";
import { reSize, sizes } from "../../../../styles/size";
import { RootLang } from "../../../../app/data/locales";
import { nstyles } from "../../../../styles/styles";
import Utils from "../../../../app/Utils";
import moment from 'moment';
import { ItemLineText, TouchDropNew } from "../../../../Component_old/itemcom/itemcom";
import * as Animatable from 'react-native-animatable';
import ButtonCom from "../../../../components/Button/ButtonCom";
import { Permission, PERMISSION_TYPE } from '../../../../../AppPermission';
import NetInfo from "@react-native-community/netinfo";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import UtilsApp from "../../../../app/UtilsApp";

class ConfigCCWifi extends Component {
  constructor(props) {
    super(props);
    this.nthis = this.props.nthis;
    this.state = {
      DSThietBi: [],
      refreshing: true,
      showload: false,
      maNV: [],
      listNhanVienMinus: [],
      TenThietBi: '',
      bssid: '',
      diadiem: {},
      listDiaDiem: [],
    };

  }


  componentDidMount = async () => {
    await this.GetLisDiaDiem()
    await this.GetListWifi()
  }
  GetLisDiaDiem = async () => {
    const res = await Get_DSListDiaDiem()
    nthisLoading.show();
    if (res.status == 1) {
      nthisLoading.hide();
      this.setState({ listDiaDiem: res.data })
    }
    else {
      nthisLoading.hide();
      UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.thuchienthatbai, 2)
    }
  }

  GetListWifi = async () => {
    const res = await Get_DSThietBiWiFi()
    nthisLoading.show();

    if (res.status == 1) {
      nthisLoading.hide();

      this.setState({ DSThietBi: res.data, refreshing: false })
    }
    else {
      nthisLoading.hide();
      UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.thuchienthatbai, 2)
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
    this.setState({ refreshing: true }, () => this.GetListWifi());
  }

  _callback = () => {
    this.setState({ refreshing: true }, () => this.GetListWifi());
  }

  _renderItem = ({ item, index }) => {
    return (
      <View style={{ backgroundColor: colors.backgroundColor, }}>
        <TouchableOpacity
          onPress={() => {
            Utils.goscreen(this.nthis, "Modal_ChiTietConfigWifi", {
              item: item, callback:
                this._callback, listDiaDiem: this.state.listDiaDiem
            })
          }}
          style={nstyles.shadow, {
            flex: 1, flexDirection: 'row',
            backgroundColor: colors.white, paddingVertical: 15,
            height: 'auto', paddingHorizontal: 15,

          }}>
          <View style={{ flex: 1, flexDirection: 'row', height: '100%', alignItems: 'center' }}>
            <View style={{ flex: 1, paddingLeft: 10 }}>
              <ItemLineText title={RootLang.lang.scQuanLyChamCong.tenthietbi} value={item.TenThietBi ? item.TenThietBi : "..."} />
              <ItemLineText title={"BSSID"} value={item.DiaChiMac ? item.DiaChiMac : "..."} />
              <ItemLineText title={RootLang.lang.scQuanLyChamCong.ngaythem} value={item.NgayThem ? moment(item.NgayThem).format("DD-MM-YYYY") : "..."} />
              <ItemLineText style={{ marginBottom: 0 }} title={RootLang.lang.scQuanLyChamCong.diadiem} value={item.DiaDiem ? item.DiaDiem : "..."} numLine={1} />
            </View>
          </View>
        </TouchableOpacity>
        {this.state.DSThietBi.length - 1 != index ?
          <View style={{
            marginTop: 4,
            width: '100%', backgroundColor: colors.white,
            alignItems: 'center',
          }}>
          </View> : null}
      </View >
    );
  }
  _DiaDiem = () => {
    Utils.goscreen(this.nthis, 'Modal_ComponentSelectCom', {
      callback: this._callbackDiaDiem, item: this.state.diadiem,
      AllThaoTac: this.state.listDiaDiem, ViewItem: this.ViewItemDiaDiem
    })
  }
  _callbackDiaDiem = (diadiem) => {
    try {
      this.setState({ diadiem });
    } catch (error) {

    }
  }
  ViewItemDiaDiem = (item) => {
    return (
      <View
        key={item.id_row.toString()}
      >
        <Text style={{
          textAlign: "center", fontSize: sizes.sText16,
          color: this.state.diadiem.id_row == item.id_row ? colors.textblack : colors.colorTextBTGray,
          fontWeight: this.state.diadiem.id_row == item.id_row ? "bold" : 'normal'
        }}>{item.Tendiadiemlamviec ? item.Tendiadiemlamviec : ""}</Text>
      </View>
    )
  }

  getBSSID = async () => {
    Permission.checkPermisstion(PERMISSION_TYPE.location).then(result => {
      if (result == true) {
        NetInfo.fetch("wifi").then(state => {
          if (state.isWifiEnabled == false) {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.scQuanLyChamCong.thongbaowifi, 3)
          }
          else
            this.setState({ bssid: state.details.bssid })
        });
      }
    })
  }

  AddWifi = async () => {
    var { diadiem, bssid, TenThietBi } = this.state
    var body = {
      "TenThietBi": TenThietBi,
      "DiaChiMac": bssid,
      "DiaDiemID": diadiem ? diadiem.id_row : null,
    }
    const res = await Add_Wifi(body);
    // Utils.nlog('res Add_Wifi', res)
    if (res.status == 1) {
      this.GetListWifi()
      Utils.showMsgBoxYesNo(this.nthis, RootLang.lang.thongbaochung.thongbao, RootLang.lang.scQuanLyChamCong.themwifithanhcong, RootLang.lang.scQuanLyChamCong.luuvadong, RootLang.lang.scQuanLyChamCong.luuvatieptuc,
        () => {
          this.setState({
            TenThietBi: "",
            bssid: "",
            diadiem: {}
          },
            this.props._setState())
        },
        () => {
          this.setState({
            TenThietBi: "",
            bssid: "",
            diadiem: {}
          })
        }
      )
    }
    else
      UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
  }

  render() {
    const { DSThietBi } = this.state
    var { TenThietBi, bssid, diadiem } = this.state
    return (
      <View style={{ flex: 1, backgroundColor: colors.backgroundColor, paddingHorizontal: 10 }}>
        {this.props.config == true ?
          <Animatable.View animation={'fadeInLeftBig'} duration={1000} >
            <TextInput

              style={{
                marginVertical: 5,
                paddingHorizontal: 20,
                width: '100%',
                flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                paddingVertical: 15, backgroundColor: colors.white,
              }}
              placeholder={RootLang.lang.scQuanLyChamCong.themBSSID}
              placeholderTextColor={colors.colorPlayhoder}
              onChangeText={(bssid) => this.setState({ bssid })}
              ref={ref => bssid = ref}
            >
              {bssid}
            </TextInput>

            {
              bssid == '' ?
                <View style={{
                  alignItems: "center", marginVertical: 10,
                  alignSelf: "center",
                }}>
                  <ButtonCom
                    text={RootLang.lang.scQuanLyChamCong.layBSSIDDienThoai}
                    style={{
                      backgroundColor: colors.colorButtomleft,
                      backgroundColor1: colors.colorButtomright,
                      fontSize: sizes.sText14,
                      width: reSize(160),
                    }}
                    onPress={this.getBSSID}
                  />
                </View>
                : null
            }

            <TextInput
              style={{
                marginVertical: 5,
                paddingHorizontal: 20,
                width: '100%',
                flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                paddingVertical: 15, backgroundColor: colors.white,
              }}
              placeholder={RootLang.lang.scQuanLyChamCong.themtenthietbi}
              placeholderTextColor={colors.colorPlayhoder}
              onChangeText={(TenThietBi) => this.setState({ TenThietBi })}
              ref={ref => TenThietBi = ref}
            >
              {TenThietBi}
            </TextInput>

            <TouchDropNew
              title={RootLang.lang.scQuanLyChamCong.diadiem}
              value={diadiem.Tendiadiemlamviec}
              required={true}
              styView={{ marginVertical: 5 }}
              _onPress={this._DiaDiem} />

            <View style={{
              alignItems: "center", marginVertical: 10,
              alignSelf: "center",
            }}>
              <ButtonCom
                text={RootLang.lang.scQuanLyChamCong.themwifi}
                style={{
                  backgroundColor: colors.colorButtomleft,
                  backgroundColor1: colors.colorButtomright,
                  fontSize: sizes.sText14,
                  width: reSize(160),
                }}
                onPress={this.AddWifi}
              />
            </View>
          </Animatable.View> : null}
        <Animatable.View animation={this.props.config ? "fadeOutRightBig" : "bounceInRight"} style={{ flex: 1 }} >
          <KeyboardAwareScrollView
            refreshControl={
              this.props.config == true ? null :
                <RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh} />}>
            <FlatList
              initialNumToRender={5}
              maxToRenderPerBatch={10}
              windowSize={5}
              data={DSThietBi}
              ListEmptyComponent={this.renderListEmpty}
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
            <IsLoading />
          </KeyboardAwareScrollView>
          <View style={{ padding: 15, justifyContent: "center", alignSelf: "center", position: 'absolute', bottom: 0 }}>
            <ButtonCom
              text={RootLang.lang.scQuanLyChamCong.themmoiwifi}
              style={{
                backgroundColor: colors.colorButtomleft,
                backgroundColor1: colors.colorButtomright,
                fontSize: sizes.sText14,
                width: reSize(160),
              }}
              onPress={() => { this.props._setState() }}
            />
          </View>
        </Animatable.View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  lang: state.changeLanguage.language
});
export default Utils.connectRedux(ConfigCCWifi, mapStateToProps, true)