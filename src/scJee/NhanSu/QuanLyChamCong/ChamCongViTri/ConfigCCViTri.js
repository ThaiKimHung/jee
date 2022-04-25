import _ from 'lodash';
import moment from 'moment';
import React, { Component } from "react";
import {
  ActivityIndicator, Dimensions, Image, PermissionsAndroid, Platform,
  Text, TextInput, TouchableOpacity, View, RefreshControl
} from "react-native";
import * as Animatable from 'react-native-animatable';
import Geolocation from 'react-native-geolocation-service';
import { FlatList } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Add_ViTri, getAddressGG, Get_DSDiaDiamChamCong } from '../../../../apis/apiQLCC';
import { RootLang } from "../../../../app/data/locales";
import Utils from "../../../../app/Utils";
import ButtonCom from "../../../../components/Button/ButtonCom";
import IsLoading from "../../../../components/IsLoading";
import { Images } from "../../../../images";
import { colors } from "../../../../styles";
import { reSize, sizes } from "../../../../styles/size";
import { nstyles, Width } from "../../../../styles/styles";
import { ItemLineText, TouchDropNew } from "../../../../Component_old/itemcom/itemcom";
import { openSettings } from 'react-native-permissions';
import { Linking } from 'react-native';
import { appConfig } from '../../../../app/Config';
import apiViettelMaps from '../../../../apis/apiViettelMaps';
import UtilsApp from '../../../../app/UtilsApp';


const { width, height } = Dimensions.get('window')

const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.0922
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO


class ConfigCCViTri extends Component {
  constructor(props) {
    super(props);
    this.nthis = this.props.nthis;
    this.state = {
      DSViTri: [],
      refreshing: true,
      showload: false,
      ToaDo: '',
      tendiadiem: '',
      ghichu: '',
      bankinhhieuluc: '',
      xacdinh: {},
      listXacDinh: [],
      initialPosition: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0,
        longitudeDelta: 0,
      },
      enableThemDiaDiem: false,
      findLocation: false,
      latlng: {},
      latlngtmp: {},

      listlatlng: {},
      diaDiem: '',
      toadoTB: '',
      toadoDB: '',
      toadoTN: '',
      toadoDN: '',
      latlong: '',




    };
    this.granted = '';


  }

  componentDidMount = async () => {
    this.GetListViTri()
    this._getListCachXacDinh()
  }



  callback = () => {
    this.setState({ refreshing: true }, () => this.GetListViTri());
  }






  GetListViTri = async () => {
    const res = await Get_DSDiaDiamChamCong()
    nthisLoading.show();
    if (res.status == 1) {
      nthisLoading.hide();

      this.setState({ DSViTri: res.data, refreshing: false })
    }
    else {
      nthisLoading.hide();
      UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.thuchienthatbai, 2)

    }
  }

  _getListCachXacDinh = () => {
    this.setState({
      listXacDinh: [
        { type: "Bán kính", row: 1 },
        // { type: "Khu vực", row: 2 }
      ],
    })
  }
  _XacDinh = () => {
    Utils.goscreen(this.nthis, 'Modal_ComponentSelectCom', { callback: this._callbackXacDinh, item: this.state.xacdinh, AllThaoTac: this.state.listXacDinh, ViewItem: this.ViewItemXacDinh })
  }
  _callbackXacDinh = (xacdinh) => {
    try {
      this.setState({ xacdinh });
    } catch (error) {

    }
  }



  ViewItemXacDinh = (item) => {
    return (
      <View key={item.row.toString()} >
        <Text style={{
          textAlign: "center", fontSize: sizes.sText16,
          color: this.state.xacdinh.row == item.row ? colors.textblack : colors.colorTextBTGray,
          fontWeight: this.state.xacdinh.row == item.row ? "bold" : 'normal'
        }}>{item.type ? item.type : ""}</Text>
      </View>
    )
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
    this.setState({ refreshing: true }, () => this.GetListViTri());
  }



  _renderItem = ({ item, index }) => {
    return (
      <View style={{ backgroundColor: colors.backgroundColor, }}>
        <TouchableOpacity
          onPress={() => {
            Utils.goscreen(this.nthis, "Modal_ChiTietConfigViTri", {
              item: item, callback: this.callback, listXacDinh: this.state.listXacDinh
            })
          }}
          style={nstyles.shadow, {
            flex: 1, flexDirection: 'row',
            backgroundColor: colors.white, paddingVertical: 15,
            height: 'auto', paddingHorizontal: 15,

          }}>
          <View style={{ flex: 1, flexDirection: 'row', height: '100%', alignItems: 'center' }}>
            <View style={{ flex: 1, paddingLeft: 10 }}>
              <ItemLineText title={RootLang.lang.scQuanLyChamCong.tendiadiem} value={item.TenDiaDiem ? item.TenDiaDiem : "..."} />
              <ItemLineText title={RootLang.lang.scQuanLyChamCong.toado} value={item.ToaDo ? item.ToaDo : "..."} />
              <ItemLineText title={RootLang.lang.scQuanLyChamCong.cachxacdinh} value={item.CachXacDinh ? item.CachXacDinh == 1 ?
                RootLang.lang.scQuanLyChamCong.bankinh : RootLang.lang.scQuanLyChamCong.khuvuc : "..."} />
              <ItemLineText title={RootLang.lang.scQuanLyChamCong.ngaycapnhat} value={item.NgayCapNhat ? moment(item.NgayCapNhat).format("DD-MM-YYYY") : "..."} />
              <ItemLineText style={{ marginBottom: 0 }} title={RootLang.lang.scQuanLyChamCong.soluongnhanvien} value={item.SoLuongNV >= 0 ? item.SoLuongNV : "..."} />
            </View>
          </View>
        </TouchableOpacity>
        {this.state.DSViTri.length - 1 != index ?
          <View style={{
            marginTop: 4,
            width: '100%', backgroundColor: colors.white,
            alignItems: 'center',
          }}>
          </View> : null}
      </View >
    );
  }

  getCurrentPosition = async (enableThemDiaDiem) => {
    Geolocation.setRNConfiguration({ skipPermissionRequests: true, authorizationLevel: 'whenInUse' });
    Geolocation.requestAuthorization();

    if (Platform.OS == 'android') {
      this.granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
        title: 'Tự động lấy vị trí',
        message: 'Bạn có muốn tự động lấy thông tin vị trí hiện tại của bạn?\n' +
          'Để tự động lấy vị trí thì bạn cần cấp quyền truy cập vị tri cho ứng dụng.',
        buttonNegative: 'Để sau',
        buttonPositive: 'Cấp quyền'
      })
      if (this.granted == PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(
          (position) => {
            Utils.nlog('geolocation-android', JSON.stringify(position));
            var { coords = {} } = position;
            var { latitude, longitude } = coords;
            let latlng = {
              latitude: latitude,
              longitude: longitude
            };
            this.setState({
              enableThemDiaDiem,
              latlng: latlng
            }, this.onPressFindLocation)
          },
          error => Utils.nlog('getCurrentPosition error: ', JSON.stringify(error)),
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
      }
    } else {
      Geolocation.getCurrentPosition(
        (position) => {
          Utils.nlog('geolocation-ios', JSON.stringify(position));
          var { coords = {} } = position;
          var { latitude, longitude } = coords;
          if (Platform.OS == 'ios' && (!latitude || !longitude)) {
            Utils.showMsgBoxYesNo(this.nthis,
              RootLang.lang.scchamcong.dichvuvitribitat, appConfig.TenAppHome + ' ' + RootLang.lang.scchamcong.cantruycapvitri_dienthoaicuaban,
              RootLang.lang.scchamcong.chuyentoicaidat, RootLang.lang.scchamcong.khongcamon,
              () => {
                Linking.openURL('app-settings:').catch((err) => {
                  Utils.nlog('app-settings:', err);
                });
              });
          } else {
            this.granted = 'granted';
            let latlng = {
              latitude: latitude,
              longitude: longitude
            }
            this.setState({
              enableThemDiaDiem,
              latlng: latlng
            }, this.onPressFindLocation)
          }
        },
        (error) => {
          let {
            code
          } = error;
          if (code == 1) {
            Utils.showMsgBoxYesNo(this.nthis, RootLang.lang.scchamcong.dichvuvitribitat, appConfig.TenAppHome + ' ' + RootLang.lang.scchamcong.cantruycapvitri_dienthoaicuaban,
              RootLang.lang.scchamcong.chuyentoicaidat, RootLang.lang.scchamcong.khongcamon,
              () => {
                Linking.openURL('app-settings:').catch((err) => {
                  nlog('app-settings:', err);
                });
              });
          }
          Utils.nlog('getCurrentPosition error: ', JSON.stringify(error))
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    }
  }

  callbackDataMapsMode0 = (listlatlng, diaDiem) => {
    this.setState({ listlatlng, diaDiem });
    this.setState({
      toadoTB: listlatlng[0] ? listlatlng[0].latitude + "," + listlatlng[0].longitude : null,
      toadoDB: listlatlng[1] ? listlatlng[1].latitude + "," + listlatlng[1].longitude : null,
      toadoTN: listlatlng[2] ? listlatlng[2].latitude + "," + listlatlng[2].longitude : null,
      toadoDN: listlatlng[3] ? listlatlng[3].latitude + "," + listlatlng[3].longitude : null,
    })
  }

  callbackDataMapsMode1 = (diaDiem, latlng) => {
    this.setState({ diaDiem, latlng });
  }
  onPressFindLocation = async () => {
    let { latlng } = this.state;
    var diaDiem = 'Đang lấy dữ liệu vị trí hiện tại';
    this.setState({
      findLocation: true,
      diaDiem: diaDiem,
    });

    //---
    let {
      latitude,
      longitude
    } = latlng

    if (appConfig.isServiceViettel) {
      let res = await apiViettelMaps.getAddressViettel(latitude, longitude)
      if (res) {
        this.setState({ findLocation: false, diaDiem: res.full_address })
      }
    }
    else {
      let res = await getAddressGG(latitude, longitude);
      var { results = [] } = res;
      let display_name = '';
      if (results[1] && this.state.findLocation == true) {
        display_name = results[1]?.formatted_address;
      }
      this.setState({ findLocation: false, diaDiem: display_name });
    }
    //---
  }

  onPressStopFindLocation = () => {
    this.setState({ findLocation: false, diaDiem: '' });
  }
  onPressClearLocation = () => {
    this.setState({
      diaDiem: '',
      latlng: {
        latitude: Latitude,
        longitude: Longitude
      }
    });
  }

  handleToaDo = async (latlong) => {
    let lat = String(latlong).split(",", 1).toString()
    let long = String(latlong).split(",").slice(1).toString()
    let latlng = {
      latitude: lat,
      longitude: long,
    }
    this.setState({ latlng: latlng })
    let res = await getAddressGG(lat, long);

    var { results = [] } = res;
    let display_name = '';
    if (results[1]) {
      display_name = results[1]?.formatted_address;
    }
    this.setState({ diaDiem: display_name });

  }
  AddDiaDiem = async () => {
    var { tendiadiem, ghichu, bankinhhieuluc, xacdinh, toadoTB, toadoTN, toadoDB, toadoDN, latlng } = this.state
    if (!latlng.latitude && !latlng.longitude) {
      return UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.scQuanLyChamCong.vuilongnhap, 3)
    }
    let latlongBody = latlng.latitude + "," + latlng.longitude
    var body = {
      "TenDiaDiem": tendiadiem,
      "ToaDo": latlongBody,
      "GhiChu": ghichu,
      "KhoangCachHieuLuc": bankinhhieuluc,
      "CachXacDinh": xacdinh.row,
      "HuongTayBac": toadoTB,
      "HuongTayNam": toadoTN,
      "HuongDongBac": toadoDB,
      "HuongDongNam": toadoDN
    }
    const res = await Add_ViTri(body);
    if (res.status == 1) {
      this.GetListViTri()
      Utils.showMsgBoxYesNo(this.nthis, RootLang.lang.thongbaochung.thongbao, RootLang.lang.scQuanLyChamCong.themwifithanhcong, RootLang.lang.scQuanLyChamCong.luuvadong, RootLang.lang.scQuanLyChamCong.luuvatieptuc,
        () => {
          this.setState({
            tendiadiem: "",
            latlng: {},
            ghichu: "",
            bankinhhieuluc: "",
            xacdinh: {},
            toadoTB: "",
            toadoTN: "",
            toadoDB: "",
            toadoDN: "",
            diaDiem: "",


          },
            this.props.nthis._setConfig()
          )
        },
        () => {
          this.setState({
            tendiadiem: "",
            latlng: {},
            ghichu: "",
            bankinhhieuluc: "",
            xacdinh: {},
            toadoTB: "",
            toadoTN: "",
            toadoDB: "",
            toadoDN: "",
            diaDiem: ""
          })
        }
      )
    }
    else
      UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
  }

  render() {
    const { DSViTri } = this.state
    var { ghichu, tendiadiem, xacdinh, diaDiem, findLocation, bankinhhieuluc,
      toadoTB,
      toadoDB,
      toadoTN,
      toadoDN,
      latlong,
      latlng,
    } = this.state
    latlong = latlng.latitude + "," + latlng.longitude
    { this.nthis.state.index == 0 ? this._onRefresh : null }
    return (
      <View style={{ flex: 1, backgroundColor: colors.backgroundColor, paddingHorizontal: 10 }}>
        <KeyboardAwareScrollView
          refreshControl={
            this.props.config == true ? null :
              <RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh} />}
          extraHeight={150}
          keyboardDismissMode='on-drag'
          showsVerticalScrollIndicator={false}
          style={{ flex: 1, paddingVertical: 10, height: 'auto' }}>
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
                placeholder={RootLang.lang.scQuanLyChamCong.tendiadiem}
                placeholderTextColor={colors.colorPlayhoder}
                onChangeText={(tendiadiem) => this.setState({ tendiadiem })}
                ref={ref => tendiadiem = ref}
              >
                {tendiadiem}
              </TextInput>
              {_.size(xacdinh) > 0 ?
                <>
                  <TextInput
                    style={{
                      marginVertical: 5,
                      paddingHorizontal: 20,
                      width: '100%',
                      flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                      paddingVertical: 15, backgroundColor: colors.white,
                    }}
                    placeholder={RootLang.lang.scQuanLyChamCong.toado}
                    placeholderTextColor={colors.colorPlayhoder}
                    onChangeText={(latlong) => this.handleToaDo(latlong)}
                    ref={ref => latlong = ref}
                  >
                    {_.size(latlng) > 0 ? latlong : null}
                  </TextInput>
                  {diaDiem && diaDiem.length > 1 ?
                    <TextInput
                      editable={false}
                      style={{
                        marginVertical: 5,
                        paddingHorizontal: 20,
                        width: "100%",
                        flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                        paddingVertical: 15, paddingTop: 15, backgroundColor: colors.white,
                      }}
                      placeholder={RootLang.lang.scQuanLyChamCong.toado}
                      placeholderTextColor={colors.colorPlayhoder}
                      multiline={true}
                      onChangeText={(diaDiem) => this.setState({ diaDiem })}
                      ref={ref => diaDiem = ref}
                    >
                      {diaDiem}
                    </TextInput>
                    : null}
                  <View style={{
                    alignItems: "center", marginVertical: 10,
                    alignSelf: "center", flexDirection: "row"
                  }}>
                    <ButtonCom
                      text={RootLang.lang.scQuanLyChamCong.tudonglaytoado}
                      style={{
                        backgroundColor: colors.colorButtomleft,
                        backgroundColor1: colors.colorButtomright,
                        fontSize: sizes.sText14,
                        width: reSize(140),
                      }}
                      onPress={() => { this.getCurrentPosition(true); }}
                    />
                    <View style={{ paddingHorizontal: 10 }} />
                    <ButtonCom
                      text={RootLang.lang.scQuanLyChamCong.chontrenbando}
                      style={{
                        backgroundColor: colors.colorButtomleft,
                        backgroundColor1: colors.colorButtomright,
                        fontSize: sizes.sText14,
                        width: reSize(140),
                      }}
                      onPress={() => {
                        Utils.goscreen(this.nthis, "Modal_BanDo", {
                          callbackDataMapsMode1: this.callbackDataMapsMode1,
                          mode: 1
                        })
                      }}
                    />
                  </View>
                </> : null}

              <TouchDropNew
                title={RootLang.lang.scQuanLyChamCong.cachxacdinh}
                value={xacdinh.type}
                required={true}
                styView={{ marginVertical: 5 }}
                _onPress={this._XacDinh} />
              {xacdinh && xacdinh.row == 1 ?
                <TextInput
                  keyboardType={"number-pad"}
                  style={{
                    marginVertical: 5,
                    paddingHorizontal: 20,
                    width: '100%',
                    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                    paddingVertical: 15, backgroundColor: colors.white,
                  }}
                  placeholder={RootLang.lang.scQuanLyChamCong.bankinhhieuluc}
                  placeholderTextColor={colors.colorPlayhoder}
                  onChangeText={(bankinhhieuluc) => this.setState({ bankinhhieuluc })}
                  ref={ref => bankinhhieuluc = ref}
                >
                  {bankinhhieuluc}
                </TextInput>
                : null}
              {xacdinh && xacdinh.row == 2 ?
                <>
                  <TextInput
                    style={{
                      marginVertical: 5,
                      paddingHorizontal: 20,
                      width: '100%',
                      flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                      paddingVertical: 15, backgroundColor: colors.white,
                    }}
                    placeholder={RootLang.lang.scQuanLyChamCong.toadoTB}
                    placeholderTextColor={colors.colorPlayhoder}
                    onChangeText={(toadoTB) => this.setState({ toadoTB })}
                    ref={ref => toadoTB = ref}
                  >
                    {toadoTB}
                  </TextInput>
                  <TextInput
                    style={{
                      marginVertical: 5,
                      paddingHorizontal: 20,
                      width: '100%',
                      flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                      paddingVertical: 15, backgroundColor: colors.white,
                    }}
                    placeholder={RootLang.lang.scQuanLyChamCong.toadoDB}
                    placeholderTextColor={colors.colorPlayhoder}
                    onChangeText={(toadoDB) => this.setState({ toadoDB })}
                    ref={ref => toadoDB = ref}
                  >
                    {toadoDB}
                  </TextInput>
                  <TextInput
                    style={{
                      marginVertical: 5,
                      paddingHorizontal: 20,
                      width: '100%',
                      flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                      paddingVertical: 15, backgroundColor: colors.white,
                    }}
                    placeholder={RootLang.lang.scQuanLyChamCong.toadoDN}
                    placeholderTextColor={colors.colorPlayhoder}
                    onChangeText={(toadoDN) => this.setState({ toadoDN })}
                    ref={ref => toadoDN = ref}
                  >
                    {toadoDN}
                  </TextInput>
                  <TextInput
                    style={{
                      marginVertical: 5,
                      paddingHorizontal: 20,
                      width: '100%',
                      flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                      paddingVertical: 15, backgroundColor: colors.white,
                    }}
                    placeholder={RootLang.lang.scQuanLyChamCong.toadoTN}
                    placeholderTextColor={colors.colorPlayhoder}
                    onChangeText={(toadoTN) => this.setState({ toadoTN })}
                    ref={ref => toadoTN = ref}
                  >
                    {toadoTN}
                  </TextInput>
                  {/* <View style={{
                    alignItems: "center", marginVertical: 10,
                    alignSelf: "center",
                  }}>
                    <ButtonCom
                      text={RootLang.lang.scQuanLyChamCong.chontrenbando}
                      style={{
                        backgroundColor: colors.colorButtomleft,
                        backgroundColor1: colors.colorButtomright,
                        fontSize: sizes.sText14,
                        width: reSize(140),
                      }}
                      onPress={() => {
                        Utils.goscreen(this.nthis, "Modal_BanDo", {
                          callbackDataMapsMode0: this.callbackDataMapsMode0,
                          mode: 0
                        })
                      }}
                    />
                  </View> */}
                </>

                : null}

              <TextInput
                style={{
                  marginVertical: 5,
                  paddingHorizontal: 20,
                  width: '100%',
                  flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                  paddingVertical: 15, backgroundColor: colors.white,
                }}
                placeholder={RootLang.lang.scQuanLyChamCong.ghichu}
                placeholderTextColor={colors.colorPlayhoder}
                onChangeText={(ghichu) => this.setState({ ghichu })}
                ref={ref => ghichu = ref}
              >
                {ghichu}
              </TextInput>
              <View style={{
                alignItems: "center", marginVertical: 10,
                alignSelf: "center",
              }}>
                <ButtonCom
                  text={RootLang.lang.scQuanLyChamCong.themdiadiem}
                  style={{
                    backgroundColor: colors.colorButtomleft,
                    backgroundColor1: colors.colorButtomright,
                    fontSize: sizes.sText14,
                    width: reSize(160),
                  }}
                  onPress={this.AddDiaDiem}
                />
              </View>
            </Animatable.View>
            : null}
          <Animatable.View animation={this.props.config ? "fadeOutRightBig" : "bounceInRight"} style={{ flex: 1 }} >
            <FlatList
              initialNumToRender={5}
              maxToRenderPerBatch={10}
              windowSize={5}
              data={DSViTri}
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
          </Animatable.View>
        </KeyboardAwareScrollView>
        {this.props.config ? null :
          <View style={{ padding: 20, justifyContent: "center", alignSelf: "center", position: 'absolute', bottom: 0, left: Width(26) }}>
            <ButtonCom
              text={RootLang.lang.scQuanLyChamCong.themmoivitri}
              style={{
                backgroundColor: colors.colorButtomleft,
                backgroundColor1: colors.colorButtomright,
                fontSize: sizes.sText14,
                width: reSize(160),
              }}
              onPress={() => { this.props.nthis._setConfig() }}
            />
          </View>}

      </View>
    );
  }
}


const mapStateToProps = state => ({
  lang: state.changeLanguage.language
});
export default Utils.connectRedux(ConfigCCViTri, mapStateToProps, true)