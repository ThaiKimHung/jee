import React, { Component } from 'react';
import {
    FlatList, Image,
    StyleSheet, Switch, Text,
    TouchableOpacity, View
} from 'react-native';
import TouchID from "react-native-touch-id";
import { appConfig } from '../../app/Config';
import { RootLang } from '../../app/data/locales';
import { nkey } from "../../app/keys/keyStore";
import Utils from '../../app/Utils';
import UtilsApp from '../../app/UtilsApp';
import HeaderComStack from '../../components/HeaderComStack';
import IsLoading from '../../components/IsLoading';
import { Images } from '../../images';
import { colors, fonts, sizes } from '../../styles';
import { Height, nstyles, Width } from '../../styles/styles';
import QuickActions from "react-native-quick-actions";
import { nGlobalKeys } from '../../app/keys/globalKey';
import { LogoutJee } from '../../apis/JeePlatform/apiUser';
import OneSignal from 'react-native-onesignal';
import HeaderAnimationJee from '../../components/HeaderAnimationJee';

class CaiDat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrMenu: [
                {
                    id: 1,
                    name: RootLang.lang.sccaidat.doimatkhau,
                    icon: Images.icDoiMatKhau,
                    screen: 'Modal_ChangePass',
                },
                {
                    id: 2,
                    name: RootLang.lang.sccaidat.ngonngu,
                    icon: Images.icNgonNgu,
                    screen: 'Modal_NgonNgu',
                },
                {
                    id: 3,
                    name: RootLang.lang.sccaidat.phienban,
                    icon: Images.icPhienban,
                    screen: 'Modal_ThongTinUngDung',
                    textLeft: `Version ${appConfig.version}`
                },
                {
                    id: 4,
                    name: RootLang.lang.sccaidat.gopybaoloi,
                    icon: Images.feedback,
                    screen: 'Modal_GopYBaoBug',
                }
            ],
            QuickID: false,
            QuickChamCong: false,
            biometryType: null,
        };
    }

    async componentDidMount() {
        // nthisLoading.show();
        TouchID.isSupported()
            .then(biometryType => {
                this.setState({ biometryType });
            })
        this.setState({
            QuickID: await Utils.ngetStorage(nkey.biometrics, false),
            QuickChamCong: await Utils.ngetStorage(nkey.quickChamCong, false),
        }
            // () => { nthisLoading.hide(); }
        )

    }
    logout = async () => {
        Utils.showMsgBoxYesNo(this, RootLang.lang.thongbaochung.thongbao, RootLang.lang.sccaidat.bancomuondangxuat, RootLang.lang.thongbaochung.xacnhan, RootLang.lang.thongbaochung.thoat, async () => {
            nthisLoading.show();
            OneSignal.removeExternalUserId((results) => {
                // Utils.nlog("Kết quả khi logout", results);
            });
            const res = await LogoutJee();
            if (res.status == 1) {
                nthisLoading.hide();
                await UtilsApp.SetStorageLogOut()
                Utils.replace(this, 'sc_login');

            } else {
                nthisLoading.hide();
                UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error.message ? res.error.message : 'Đăng xuất lỗi, vui lòng thử lai!', 2)
            }
            // QuickActions.clearShortcutItems();

        }, () => { }, false)

    }


    _goback = async () => {

        // this.props.navigation.reset({
        //     index: 0,
        //     routes: [{ name: 'sw_HomePage' }],
        // });
        Utils.goback(this, null)
    }

    render() {
        const { arrMenu, biometryType } = this.state
        let { fuctionHide } = this.state
        return (
            <View style={{ backgroundColor: colors.backgroudJeeHR, flex: 1 }}>
                <HeaderAnimationJee nthis={this} title={RootLang.lang.sccaidat.titile} onPressLeft={() => { this._goback() }} />
                <View style={{ flex: 1, marginHorizontal: fuctionHide == false ? 15 : 0, marginVertical: 5 }}>
                    <View>
                        <View style={[nstyles.shadowButTon, {

                            backgroundColor: colors.white, marginHorizontal: 10, borderTopLeftRadius: 10, borderTopRightRadius: 10, marginTop: 10,
                            borderBottomRightRadius: this.state.biometryType != null ? 0 : 10, borderBottomLeftRadius: this.state.biometryType != null ? 0 : 10
                        }]}>


                            <FlatList
                                scrollEnabled={false}
                                showsVerticalScrollIndicator={false}
                                numColumns={1}
                                data={arrMenu}
                                renderItem={({ item, index }) =>
                                (

                                    <View >
                                        <TouchableOpacity style={{ flexDirection: 'row', paddingLeft: 10 }}
                                            onPress={() => Utils.goscreen(this, item.screen)}>

                                            <Image
                                                style={[nstyles.nIcon20, { alignSelf: 'center', paddingHorizontal: 10, }]}
                                                source={item.icon}
                                                resizeMode={'contain'} />
                                            <View style={{ flex: 1, paddingLeft: 10, }}>
                                                <View style={styles.rowItem}>
                                                    <Text style={styles.nameItem}>{item.name}</Text>
                                                    {
                                                        item.textLeft ? <Text style={styles.textVS}>{item.textLeft}</Text> : <Image
                                                            style={[nstyles.nIcon10,
                                                            {}]}
                                                            source={Images.icGoScreen}
                                                            resizeMode={'contain'} />
                                                    }

                                                </View>
                                                {/* {index != 2 || this.state.biometryType != null ? */}
                                                <View style={{ height: 1, marginLeft: 11, backgroundColor: colors.veryLightPinkTwo, }} />
                                                {/* : null
                                                } */}
                                            </View>
                                        </TouchableOpacity>

                                    </View>
                                )}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </View>

                        {/* <TouchableOpacity style={{ flexDirection: "row", backgroundColor: colors.white, padding: 10, height: Height(6) }}
                            onPress={() => {
                                Utils.goscreen(this, 'Modal_devoloping')
                            }}>
                            <Image
                                style={[nstyles.nIcon20, { alignSelf: 'center', paddingHorizontal: 10, }]}
                                source={Images.clock}
                                resizeMode={'contain'} />
                            <Text style={{ flex: 1, alignSelf: "center", paddingLeft: 20 }}>
                                {RootLang.lang.scTouchID.chongionhacnhochamcong}
                            </Text>
                        </TouchableOpacity> */}
                        {/* <View style={{ height: 1, backgroundColor: colors.white, }} >
                            <View style={{ height: 1, marginLeft: 50, backgroundColor: colors.veryLightPinkTwo, }} />
                        </View> */}
                        {/* <View style={{ flexDirection: "row", backgroundColor: colors.white, padding: 10 }}>
                            <Image
                                style={[nstyles.nIcon20, { alignSelf: 'center', paddingHorizontal: 10, }]}
                                source={Images.icReviewFace}
                                resizeMode={'contain'} />
                            <Text style={{ flex: 1, alignSelf: "center", paddingLeft: 20 }}>
                                {RootLang.lang.sccaidat.chamcongbangkhuonmatnhanh}
                            </Text>
                            <Switch
                                style={{ alignContent: "flex-end", alignSelf: "center" }}
                                trackColor={{ false: 'gray', true: 'teal' }}
                                thumbColor="white"
                                ios_backgroundColor="gray"
                                onValueChange={(value) => this.setState({ QuickChamCong: value }, async () => {
                                    if (this.state.QuickChamCong == true) {
                                        await Utils.nsetStorage(nkey.quickChamCong, true)
                                    }
                                    else await Utils.nsetStorage(nkey.quickChamCong, false)

                                })}
                                value={this.state.QuickChamCong}
                            />
                        </View>
                        <View style={{ height: 1, backgroundColor: colors.white, }} >
                            <View style={{ height: 1, marginLeft: 50, backgroundColor: colors.veryLightPinkTwo, }} />
                        </View> */}

                        {this.state.biometryType != null ?
                            <View style={{ flexDirection: "row", backgroundColor: colors.white, padding: 10, marginHorizontal: 10, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                                <Image
                                    style={[nstyles.nIcon20, { alignSelf: 'center', paddingHorizontal: 10, }]}
                                    source={Images.icFinger}
                                    resizeMode={'contain'} />
                                <Text style={{ flex: 1, alignSelf: "center", paddingLeft: 20 }}>
                                    {biometryType == 'FaceID' ? RootLang.lang.scTouchID.faceID : RootLang.lang.scTouchID.touchID}
                                </Text>
                                <Switch
                                    style={{ alignContent: "flex-end", alignSelf: "center", transform: [{ scaleX: .8 }, { scaleY: .8 }] }}
                                    trackColor={{ false: 'gray', true: 'teal' }}
                                    thumbColor="white"
                                    ios_backgroundColor="gray"
                                    onValueChange={(value) => this.setState({ QuickID: value }, async () => {
                                        if (this.state.QuickID == true) {
                                            await Utils.nsetStorage(nkey.biometrics, true);
                                        }
                                        else await Utils.nsetStorage(nkey.biometrics, false);

                                    })}
                                    value={this.state.QuickID}
                                />
                            </View> : null}


                        <TouchableOpacity
                            onPress={this.logout}
                            style={[styles.rowDX, { marginTop: 20, marginHorizontal: 10, borderRadius: 10, paddingVertical: 15 }]}>
                            <Text style={styles.textDX}>{RootLang.lang.sccaidat.dangxuattaikhoan}</Text>
                        </TouchableOpacity>

                    </View>
                </View>
                <IsLoading />

            </View>
        );
    }
}
const styles = StyleSheet.create({
    rowDX: {
        paddingHorizontal: 10,
        backgroundColor: colors.white,
        paddingVertical: 12, alignItems: 'center'

    },

    textDX: {
        color: colors.orangeSix, fontFamily: fonts.Helvetica,
        fontSize: sizes.sText16, fontWeight: "bold",
    },
    textVS: {
        color: colors.textbrownGrey, fontFamily: fonts.Helvetica,
        fontSize: sizes.sText16,
    },
    nameItem: {
        color: colors.textblack, fontFamily: fonts.Helvetica,
        fontSize: sizes.sText16, textAlign: 'center', paddingHorizontal: 10

    },
    rowItem: {
        flex: 1, flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between', paddingRight: 10, paddingVertical: 21,
    }

})


const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(CaiDat, mapStateToProps, true)