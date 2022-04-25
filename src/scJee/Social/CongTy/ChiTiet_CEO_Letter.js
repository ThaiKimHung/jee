import React, { Component } from 'react';
import { Animated, BackHandler, ScrollView, Text, TouchableOpacity, View } from "react-native";
import HTML from "react-native-render-html";
import { getDetailDSThongDiep } from '../../../apis/JeePlatform/Api_JeeSocial/apiJeeSocial';
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import { RootLang } from '../../../app/data/locales';
import { nkey } from '../../../app/keys/keyStore';
import Utils from '../../../app/Utils';
import UtilsApp from '../../../app/UtilsApp';
import HeaderComStackV2 from '../../../components/HeaderComStackV2';
import IsLoading from '../../../components/IsLoading';
import ImageCus from "../../../components/NewComponents/ImageCus";
import { Images } from '../../../images';
import { colors } from '../../../styles';
import { Height, nstyles, paddingBotX, Width } from '../../../styles/styles';
import { reText } from '../../../styles/size';

class ChiTiet_CEO_Letter extends Component {
    constructor(props) {
        super(props);

        this.state = {
            opacity: new Animated.Value(0),
            loai: {
                id: 3,
                loai: "CEO Letter",
            },
            refreshing: false,
            chiTietThongDiep: [],
            role: {},
            checkrole: false,
            id_User: '',
        }
        this.nthis = this.props.nthis;
        this.idthongdiep = Utils.ngetParam(this, 'idthongdiep', '')
        ROOTGlobal.LoadDanhSach_CeoLetter.LoadDSChiTiet_Ceo = this._loadChiTiet_CEOLetter
    }

    componentDidMount = async () => {
        BackHandler.addEventListener("hardwareBackPress", this._goback);
        await this.setState({
            id_User: await Utils.ngetStorage(nkey.UserId, ''),
            role: await Utils.ngetStorage(nkey.role, '')
        }, async () => {
            await this._checkRole()
        })
        await this._loadChiTiet_CEOLetter()
    }
    componentWillUnmount() {
        try {
            BackHandler.removeEventListener('hardwareBackPress', this._goback)
        }
        catch (error) {
        }
    }

    _checkRole = async () => {
        let check = this.state.role.roles.includes('5')
        this.setState({ checkrole: check })
    }

    _goback = async () => {
        Utils.goback(this, null)
        return true
    }

    _loadChiTiet_CEOLetter = async () => {
        nthisLoading.show()
        let res = await getDetailDSThongDiep(this.idthongdiep?.id_submenu);
        // Utils.nlog("chi tiết Thong Diep-------------------------", res)
        if (res.status == 1) {
            nthisLoading.hide()
            this.setState({ chiTietThongDiep: res.data, refreshing: false, })
        } else {
            nthisLoading.hide()
            this.setState({ refreshing: false, })
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
        }
    }

    _goEdit = () => {
        Utils.goscreen(this, 'Modal_EditCEOLetter', { idthongdiep: this.idthongdiep })
    }

    render() {
        var { opacity, chiTietThongDiep } = this.state
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: colors.white, }]}>
                <View style={{ flex: 1, paddingBottom: paddingBotX }}>
                    <HeaderComStackV2
                        nthis={this}
                        title={RootLang.lang.JeeSocial.chitiet}
                        // iconRight={Images.ImageJee.icBoLocSocial}
                        // styIconRight={[nstyles.nIconH18W22, {}]}
                        iconLeft={Images.ImageJee.icBack}
                        onPressLeft={this._goback}
                        // onPressRight={() => { Utils.goscreen(this, 'Modal_LocBaiDang') }}
                        styBorder={{
                            borderBottomColor: colors.black_20,
                            borderBottomWidth: 0.5
                        }}
                    />

                    <View style={{ flex: 1, justifyContent: "space-between", paddingHorizontal: 5, paddingTop: 10 }}>
                        <ScrollView nestedScrollEnabled style={{ flex: 1, }}>
                            <View style={{ flexDirection: 'row', }}>
                                <ImageCus
                                    style={[nstyles.nAva32, {}]}
                                    source={{ uri: chiTietThongDiep[0]?.Created[0]?.avatar }}
                                    resizeMode={"cover"}
                                    defaultSourceCus={Images.icAva}
                                />
                                <View style={{ paddingLeft: 5, }}>
                                    <Text style={{ fontWeight: 'bold', }}>{chiTietThongDiep && chiTietThongDiep[0]?.Created[0]?.FullName ? chiTietThongDiep[0]?.Created[0]?.FullName : " -- "}</Text>
                                    <Text style={{ color: colors.colorTextBTGray }}>
                                        {chiTietThongDiep && chiTietThongDiep[0]?.CreatedDate ? UtilsApp.convertDatetime(chiTietThongDiep[0]?.CreatedDate) : " -- "}
                                    </Text>
                                </View>
                            </View>
                            <View style={{}}>

                                <Text style={{ fontWeight: 'bold', fontSize: reText(18), paddingHorizontal: 5, paddingTop: 5 }}>
                                    {chiTietThongDiep[0]?.title ? chiTietThongDiep[0]?.title : " --"}
                                </Text>
                                {
                                    chiTietThongDiep[0]?.noidung ? (
                                        <HTML source={{ html: chiTietThongDiep[0]?.noidung }} containerStyle={{ paddingHorizontal: 5 }} />
                                    ) : (null)
                                }
                            </View>
                        </ScrollView>
                        <View style={{ justifyContent: 'flex-end', bottom: 0 }}>
                            {this.state.checkrole == true
                                //  && this.state.chiTietThongDiep[0]?.Created[0]?.ID_user == this.state.id_User 
                                ? (
                                    <View style={{
                                        marginTop: 5, backgroundColor: '#F2F3F5', height: Height(6), justifyContent: 'center', alignItems: 'center',
                                    }}>
                                        <TouchableOpacity
                                            onPress={() => this._goEdit()}
                                            style={{
                                                padding: 10, backgroundColor: colors.white, width: Width(90), justifyContent: 'center', alignItems: 'center', borderColor: '#D1D1D1', shadowColor: "#000",
                                                shadowOffset: {
                                                    width: 0,
                                                    height: 0,
                                                },
                                                shadowOpacity: 0.25,
                                                shadowRadius: 1,
                                                shadowColor: "#000",
                                                elevation: 5,
                                            }}>
                                            <Text style={{ color: colors.black, fontWeight: 'bold', color: '#65676B' }}>{RootLang.lang.JeeSocial.chinhsua}</Text>
                                        </TouchableOpacity>
                                    </View>
                                ) : (null)}
                        </View>
                        <IsLoading />
                    </View>
                </View>
            </View >
        )
    }
}

const mapStateToProps = state => ({
    lang: state.changeLanguage.language,
});
export default Utils.connectRedux(ChiTiet_CEO_Letter, mapStateToProps, true)