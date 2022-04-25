import React, { Component, createRef } from 'react';
import { Animated, FlatList, ScrollView, Text, TouchableOpacity, View } from "react-native";
import ActionSheet from "react-native-actions-sheet";
import HTML from "react-native-render-html";
import { GetMenu_Left, InserItem_DanhMuc_MemuLeft } from '../../../apis/JeePlatform/Api_JeeSocial/apiJeeSocial';
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import { RootLang } from '../../../app/data/locales';
import { nkey } from '../../../app/keys/keyStore';
import Utils from '../../../app/Utils';
import UtilsApp from '../../../app/UtilsApp';
import IsLoading from '../../../components/IsLoading';
import ListEmptyLottie_Social from '../../../components/NewComponents/ListEmptyLottie_Social';
import HeaderModal from '../../../Component_old/HeaderModal';
import { colors } from '../../../styles';
import { reText } from '../../../styles/size';
import { Height, nstyles, paddingBotX, Width } from '../../../styles/styles';
import ButtonTaoBaiDang from '../ModalSocial/ButtonTaoBaiDang';
import ImageCus from "../../../components/NewComponents/ImageCus";
import { Images } from '../../../images';
const actionSheetRef = createRef();

const Item_Padding = 15;
const Item_Margin = 20;
const Item_size = Item_Padding * 2 + Item_Margin

class HomeCongTy extends Component {
    constructor(props) {
        super(props);
        this.refLoading = React.createRef()
        this.state = {
            opacity: new Animated.Value(0),
            loai: [],
            listDSThongDiep: [],
            refreshing: false,
            textShown: false,
            showMore: false,
            menuThongDiep: [],
            // isLoading: false,
            id_User: '',
            item: '',
            locaX: 0,
            locaY: 0,
            role: '',
            scrolly: new Animated.Value(0).current,
            empty: false,
        }
        this.nthis = this.props.nthis;
        ROOTGlobal.LoadDanhSach_CeoLetter.LoadDSCeo = this._getMenu_Left
    }

    componentDidMount = async () => {
        this.refLoading.current.show()
        await this.setState({
            id_User: await Utils.ngetStorage(nkey.UserId, ''),
            role: await Utils.ngetStorage(nkey.role, '')
        }, async () => { await this._checkRole() })
        await this._getMenu_Left().then(res => {
            if (res == true) {
                this.refLoading.current.hide()
            }
        });
    }

    _checkRole = async () => {
        let check = this.state.role.roles.includes('5')
        this.setState({ checkrole: check })
    }

    _getMenu_Left = async () => {
        this.setState({ empty: false })
        let res = await GetMenu_Left();
        // Utils.nlog("GetMenu Thong Diep-------------------------", res)
        if (res.status == 1) {
            this.setState({ menuThongDiep: res.data, refreshing: false, loai: res.data[0], empty: false })
        } else {
            this.setState({ refreshing: false, empty: true })
            // UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
        }
        return true
    }

    _goback = async () => {
        Utils.goback(this, null)
    }

    _onRefresh = () => {
        this._getMenu_Left();
    }

    _onScroll = (item, e) => {
        this.setState({ loai: item, })
        if (item.id_menu == '4') {
            this.scrollView.scrollToEnd({ animated: true })
        }
        if (item.id_menu == '1') {
            this.scrollView.scrollTo({ y: 0, animated: true })
        }
        if (item.id_menu == '3') {
            this.scrollView.scrollTo({ x: e.locationX + 80, y: 0, animated: true });
        }
        if (item.id_menu == '2') {
            this.scrollView.scrollTo({ x: e.locationX + 20, y: 0, animated: true });
        }
    }

    _renderThu = ({ item, index }) => {
        return (
            <Animated.View>
                <TouchableOpacity
                    onPress={(e) => {
                        this._onScroll(i, e.nativeEvent)
                    }}
                    style={{
                        justifyContent: 'center', alignItems: 'center',
                        backgroundColor: this.state.loai?.id_menu == item?.id_menu ? '#219B3C' : '#F2F3F5',
                        borderWidth: 0.3, borderRadius: 20, borderColor: '#F2F3F5', padding: Item_Padding,
                        shadowColor: '#000',
                        marginRight: Item_Margin,
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 0,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 1,
                        elevation: 5,
                    }} >
                    <Text
                        style={{
                            color: this.state.loai?.id_menu == item?.id_menu ? colors.white : colors.black, textAlign: 'center',
                        }}>{item?.title}</Text>
                </TouchableOpacity>
            </Animated.View>
        )
    }

    _renderItem_Loai = ({ item, index }) => {
        return (
            <ScrollView
                ref={ref => this.scrollView = ref}
                scrollToOverflowEnabled={true}
                horizontal={true}
                style={{ paddingVertical: this.state.menuThongDiep.length > 0 ? 12 : 0, flexDirection: 'row', backgroundColor: colors.white }}>
                {this.state.menuThongDiep.map((i, ind) => {
                    return (
                        <TouchableOpacity
                            onPress={(e) => {
                                this._onScroll(i, e.nativeEvent)
                            }}
                            style={{
                                justifyContent: 'center', alignItems: 'center',
                                backgroundColor: this.state.loai?.id_menu == i?.id_menu ? '#219B3C' : '#F2F3F5',
                                borderWidth: 0.3, borderRadius: 20, borderColor: '#F2F3F5', padding: Item_Padding - 3,
                                shadowColor: '#000',
                                shadowOffset: { width: 1, height: 2 }, shadowOpacity: 0.3, shadowRadius: 5,
                                marginRight: Item_Margin,
                                elevation: 2
                            }} >
                            <Text style={{
                                color: this.state.loai?.id_menu == i?.id_menu ? colors.white : colors.black, textAlign: 'center',
                            }}>{i?.title}</Text>
                        </TouchableOpacity>
                    )
                })}
            </ScrollView>
        );
    }
    toggleNumberOfLines = index => {
        this.setState({
            textShown: this.state.textShown === index ? -1 : index,
        });
    };

    _renderItem_QuyCheNoiBo = ({ item, index }) => {
        const { showMore } = this.state
        return (
            <TouchableOpacity style={{ backgroundColor: colors.white, paddingHorizontal: 10, marginBottom: 8, paddingVertical: 15 }}
                onLongPress={() => { actionSheetRef.current?.show(), this.setState({ item }) }}
                onPress={() => this._goChiTiet_CEOLetter(item)}
            // onPress={() => Utils.goscreen(this.nthis, 'Modal_devoloping')}
            >
                <View style={{ flex: 1, }}>
                    <View style={{ flexDirection: 'row', }}>
                        <ImageCus
                            style={[nstyles.nAva32, {}]}
                            source={{ uri: item.Created[0]?.avatar }}
                            resizeMode={"cover"}
                            defaultSourceCus={Images.icAva}
                        />
                        <View style={{ paddingLeft: 5, }}>
                            <Text style={{ fontWeight: 'bold', }}>{item?.Created[0]?.FullName ? item?.Created[0]?.FullName : " -- "}</Text>
                            <Text style={{ color: colors.colorTextBTGray }}>
                                {item?.created_date ? UtilsApp.convertDatetime(item?.created_date) : " -- "}
                            </Text>
                        </View>
                    </View>
                    <View style={{ paddingTop: 10 }}>
                        <Text style={{ fontWeight: 'bold', }}>{item?.title_submenu}</Text>
                    </View>
                </View>
            </TouchableOpacity >
        );
    }

    _renderItem_CEOLetter = ({ item, index }) => {
        return (
            <TouchableOpacity style={{ backgroundColor: colors.white, paddingHorizontal: 10, marginBottom: 8, paddingVertical: 15 }}
                onLongPress={() => { actionSheetRef.current?.show(), this.setState({ item }) }}
                onPress={() => this._goChiTiet_CEOLetter(item)} >
                <Text style={{ fontWeight: 'bold', }}>{item?.title}</Text>
                {item?.noidung ? (
                    <HTML source={{ html: `${item?.noidung.slice(0, 200)} ... ` }} />
                ) : (null)}
            </TouchableOpacity >
        );
    }

    _goChiTiet_CEOLetter = (item) => {
        Utils.goscreen(this.nthis, 'sc_ChiTietCEOLetter', { nthis: this.nthis, idthongdiep: item })
    }

    _taoBaiDang = (item) => {
        Utils.goscreen(this.nthis, 'sc_TaoBaiDang_CEO', { nthis: this.nthis, data: item, })
    }

    _XoaThongDiep = async () => {
        actionSheetRef.current?.hide();
        Utils.showMsgBoxYesNo(this.nthis, RootLang.lang.thongbaochung.thongbao, RootLang.lang.JeeSocial.banmuonxoabaidangnay, RootLang.lang.scchamcong.dongy, RootLang.lang.scchamcong.huy,
            async () => {
                this.refLoading.current.show()
                let strbody = JSON.stringify({
                    "listRemove_itemsubMenu": [
                        {
                            "id_menu": this.state.loai.id_menu,
                            "id_submenu": this.state.item?.id_submenu ? this.state.item?.id_submenu : 0,
                            "id_thongdiep": this.state.item?.id_thongdiep ? this.state.item?.id_thongdiep : 0
                        }
                    ]
                })
                // Utils.nlog('body', strbody)
                let res = await InserItem_DanhMuc_MemuLeft(strbody)
                // Utils.nlog('res _XoaThongDiep', res)
                if (res.status == 1) {
                    UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.JeeSocial.xoathanhcong, 1)
                    await this._getMenu_Left()
                    this.refLoading.current.hide()
                }
                else {
                    this.refLoading.current.hide()
                    UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.JeeSocial.xoathatbai, 2)
                }
            }
        )
    }

    _render_View = ({ item, index }) => {
        return (
            <>
                {/* {
                    this.state.loai.id_menu == item.id_menu ?
                        <View style={{ flex: 1 }}>
                            <FlatList
                                ListHeaderComponent={() => {
                                    return (
                                        <ButtonTaoBaiDang onPress={() => this._taoBaiDang(item)}></ButtonTaoBaiDang>
                                    )
                                }}
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                                style={{ paddingBottom: 10 }}
                                data={item.id_menu != '1' ? item.submenu : item.thongdiepceoletter}
                                renderItem={item.id_menu != '1' ? this._renderItem_QuyCheNoiBo : this._renderItem_CEOLetter}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </View >
                        : null} */}
                {
                    this.state.loai.id_menu == item.id_menu ?
                        <View style={{ flex: 1, paddingTop: this.state.checkrole ? 0 : 8 }}>
                            <FlatList
                                ListHeaderComponent={() => {
                                    return (
                                        <>
                                            {
                                                this.state.checkrole == true ?
                                                    <ButtonTaoBaiDang title={RootLang.lang.JeeSocial.taotieude} onPress={() => this._taoBaiDang(item)}></ButtonTaoBaiDang>
                                                    : null
                                            }
                                        </>
                                    )
                                }}
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                                style={{ paddingBottom: 10 }}
                                data={item.submenu}
                                renderItem={this._renderItem_QuyCheNoiBo}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </View >
                        : null}
            </>
        )
    }

    render() {
        const { opacity, menuThongDiep, refreshing, empty } = this.state
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: '#E4E6EB', }]}>
                <View style={{ flex: 1, paddingBottom: paddingBotX }}>
                    <FlatList
                        ListHeaderComponent={this._renderItem_Loai}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        refreshing={refreshing}
                        onRefresh={this._onRefresh}
                        data={menuThongDiep}
                        renderItem={this._render_View}
                        keyExtractor={(item, index) => index.toString()}
                        // ListEmptyComponent={menuThongDiep.length == 0 ? <ListEmptyLottie_Social_Company style={{ justifyContent: 'center', alignItems: 'center', }} textempty={empty ? RootLang.lang.JeeSocial.khongcobaidang : null} /> : null}
                        ListEmptyComponent={menuThongDiep.length == 0 ? <ListEmptyLottie_Social style={{ marginTop: 60 }} textempty={empty == false ? RootLang.lang.JeeSocial.khongcobaidang : null} styleText={{ marginTop: -50 }} /> : null}
                    />
                </View >
                <ActionSheet ref={actionSheetRef}>
                    <View style={{ maxHeight: Height(50), paddingBottom: paddingBotX, width: Width(100) }}>
                        <HeaderModal />
                        {this.state.checkrole == true ? (
                            <TouchableOpacity
                                onPress={() => this._XoaThongDiep()}
                                style={{ height: Height(6), width: Width(100), justifyContent: 'center', alignItems: 'center', padding: 10, marginTop: 1, borderBottomWidth: 0.3, borderColor: '#E4E6EB' }}>
                                <Text style={{ fontSize: reText(15), }}>{RootLang.lang.JeeSocial.xoa} </Text>
                            </TouchableOpacity>
                        ) : (null)}
                    </View>
                </ActionSheet>
                <IsLoading ref={this.refLoading} />
            </View >
        )
    }
}

const mapStateToProps = state => ({
    lang: state.changeLanguage.language,
});
export default Utils.connectRedux(HomeCongTy, mapStateToProps, true)