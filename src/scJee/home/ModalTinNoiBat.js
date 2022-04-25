import React, { Component } from 'react';
import ActionSheet from 'react-native-actions-sheet';
import Utils from '../../app/Utils';
import HeaderModalCom from '../../Component_old/HeaderModalCom';
import { Images } from '../../images';
import { colors } from '../../styles/color';
import { Height, nstyles, Width } from '../../styles/styles';
import moment from 'moment';
import {
    FlatList, Image, ScrollView, Text, TouchableOpacity, View, StyleSheet, Platform, Animated, BackHandler,
    TextInput, Linking
} from "react-native";
import { ROOTGlobal } from '../../app/data/dataGlobal';
import { RootLang } from '../../app/data/locales';
import { nGlobalKeys } from '../../app/keys/globalKey';
import { nkey } from '../../app/keys/keyStore';
import { reText, sizes } from '../../styles/size';
import IsLoading from '../../components/IsLoading';
// import ListEmpty from '../../../components/ListEmpty';
import HeaderComStackV2 from '../../components/HeaderComStackV2';
import { getTinNoiBat } from '../../apis/JeePlatform/Api_JeeSocial/apiJeeSocial'
import FbImages from '../../components/NewComponents/FBGridImage';
import ImageCus from '../../components/NewComponents/ImageCus';
class ModalTinNoiBat extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            item: [],
        })
    }
    componentDidMount = async () => {
        this._getTinNoiBat()
    }

    _getTinNoiBat = async () => {
        nthisLoading.show()
        const res = await getTinNoiBat()
        if (res.status == 1) {
            nthisLoading.hide()
            this.setState({ item: res.data[0] })
        }
        else {
            nthisLoading.hide()
            this.setState({ item: [] })
        }
    }

    _goBack = () => {
        Utils.goback(this, null)
    };

    render() {
        const { item, IsLoaddingcus } = this.state
        let fileanh = item.Attachment?.length > 0 ? item.Attachment?.map((i) => {
            return i.hinhanh
        }) : []
        fileanh = fileanh.filter((el) => {
            return el != ''
        })
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: colors.white, }]}>
                <HeaderComStackV2
                    nthis={this}
                    title={RootLang.lang.thongbaochung.tinnoibat}
                    // iconRight={Images.ImageJee.icIConThemNguoiVaoNhom}
                    styIconRight={[, {}]}
                    iconLeft={Images.ImageJee.icBack}
                    onPressLeft={this._goBack}
                    // onPressRight={() => { }}
                    styBorder={{
                        borderBottomColor: colors.black_20_2,
                        borderBottomWidth: 0.3
                    }}
                />
                <ScrollView style={{ flex: 1 }}>

                    <View style={styles.container}>
                        <View style={styles.con_khunglon}>
                            <View style={styles.con_khungava}>
                                <ImageCus
                                    style={nstyles.nAva32}
                                    source={{ uri: item?.User_DangBai ? item?.User_DangBai[0]?.avatar : "" }}
                                    resizeMode={"cover"}
                                    defaultSourceCus={Images.icAva}
                                />
                                <View style={styles.con_khungnhom}>
                                    <View style={{ flex: 1 }}>
                                        <View style={styles.con_khungten}>
                                            <Text style={styles.text_name}>{item?.User_DangBai ? item?.User_DangBai[0].Fullname : null}</Text>
                                            {
                                                item.Group?.length > 0 ? (
                                                    <View style={styles.con_khungchung_row}>
                                                        <Image source={Images.ImageJee.icMetroplay} resizeMode='contain' style={nstyles.nIcon8, styles.img_tamgiac} />
                                                        <Text style={styles.text_tengroup} >{item?.Group ? item?.Group[0].ten_group : null}</Text>
                                                    </View>
                                                ) : (
                                                    <View style={{}}>
                                                        {
                                                            item.TagName?.length > 0 && item.TagName?.length >= 3 ? (
                                                                <View style={styles.con_khungchung_rowtext}>
                                                                    <Text> {RootLang.lang.JeeSocial.voi} </Text>
                                                                    <Text style={{ fontWeight: 'bold' }}>{item?.TagName ? item?.TagName[0]?.Fullname : null}</Text>
                                                                    <Text> {RootLang.lang.JeeSocial.va} </Text>
                                                                    <View style={{ flex: 1 }}>
                                                                        <Text numberOfLines={1} style={styles.text_tenNguoiDcTagNhieu}>{item.TagName?.length - 1}  {' ' + RootLang.lang.JeeSocial.nguoikhac}</Text>

                                                                    </View>
                                                                </View>
                                                            ) : (
                                                                item.TagName?.length > 0 && item.TagName?.length <= 2 ? (
                                                                    <View style={styles.con_khungchung_row}>
                                                                        <Text style={{ fontSize: sizes.sText13, }}> {RootLang.lang.JeeSocial.voi} </Text>
                                                                        <Text style={{ fontSize: sizes.sText13, fontWeight: 'bold' }}>{item?.TagName ? item?.TagName[0]?.Fullname : null}</Text>
                                                                        {
                                                                            item?.TagName[1] ? (
                                                                                <View style={{}}>
                                                                                    <Text numberOfLines={1} style={styles.text_tenNguoiDcTagIt}>, {item?.TagName ? item?.TagName[1]?.Fullname : null}</Text>
                                                                                </View>
                                                                            ) : (null)
                                                                        }
                                                                    </View>
                                                                ) : (null)
                                                            )
                                                        }
                                                    </View>
                                                )
                                            }
                                        </View>
                                        <View style={styles.con_khungchung_row}>
                                            <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
                                                <Text style={{ color: colors.colorTextBTGray }}>
                                                    {item.CreatedDate ? moment(item.CreatedDate).format("DD/MM/YYYY - HH:mm") : null}
                                                </Text>

                                            </View>

                                        </View>
                                    </View>
                                </View>




                            </View>
                            <View style={{ flex: 1, paddingVertical: 5, }}>


                                <Text style={{ fontSize: sizes.sText15, fontWeight: 'bold' }}>{item.title}</Text>
                                {
                                    item.NoiDung ?
                                        <Text style={{ color: colors.black }}>{item.NoiDung}</Text>

                                        : null
                                }


                            </View>
                            <View>
                                {
                                    item.Attachment_File?.length > 0 ? (
                                        <View>
                                            {item.Attachment_File.map((i) => {
                                                return (
                                                    <TouchableOpacity onPress={() => Linking.openURL(i.Link)}>
                                                        <Text style={{ color: '#2a91d6' }}>{i.filename}</Text>
                                                    </TouchableOpacity>
                                                )
                                            })}
                                        </View>
                                    ) : (null)
                                }
                                {item.Attachment?.length > 0 ? (
                                    <FbImages
                                        nthis={this}
                                        images={fileanh}
                                        imageOnPress={() => { }}
                                    />
                                ) : (null)}
                                {
                                    item.Group?.length > 0 && item.TagName?.length > 0 && item.TagName?.length >= 3 ? (

                                        <View style={styles.con_khungchung_rowtext}>
                                            <Text> {RootLang.lang.JeeSocial.voi} </Text>
                                            <Text style={{ fontWeight: 'bold' }}>{item?.TagName ? item?.TagName[0]?.Fullname : null}</Text>
                                            <Text> {RootLang.lang.JeeSocial.va} </Text>
                                            <View style={{ flex: 1 }}>
                                                <Text numberOfLines={1} style={styles.text_tenNguoiDcTagNhieu}>{item?.TagName.length - 1}  {' ' + RootLang.lang.JeeSocial.nguoikhac}</Text>

                                            </View>
                                        </View>

                                    ) : (
                                        item.Group?.length > 0 && item.TagName?.length > 0 && item.TagName?.length <= 2 ? (
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={{ fontSize: sizes.sText13, }}> {RootLang.lang.JeeSocial.voi} </Text>
                                                <Text style={{ fontSize: sizes.sText13, fontWeight: 'bold' }}>{item?.TagName ? item?.TagName[0]?.Fullname : null}</Text>
                                                {
                                                    item?.TagName[1] ? (
                                                        <View style={{ flex: 1 }}>
                                                            <Text style={{ fontSize: sizes.sText13, fontWeight: 'bold' }}>, {item?.TagName ? item?.TagName[1]?.Fullname : null}</Text>
                                                        </View>
                                                    ) : (null)
                                                }
                                            </View>
                                        ) : (null)
                                    )
                                }
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <IsLoading />
            </View >
        )
    }
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        width: 200,
        marginBottom: 10,
        paddingTop: 15,
        paddingBottom: 15,
        textAlign: 'center',
        color: '#fff',
        backgroundColor: '#38f'
    },
    card: {
        borderRadius: 30
    },
    list: {
        overflow: 'visible'
    },
    reactView: {
        width: (Width(100) - 24) / 7,
        height: 58,
        justifyContent: 'center',
        alignItems: 'center'
    },
    reaction: {
        width: Width(20),
        marginBottom: 4
    },
    container: {
        backgroundColor: colors.white,
        marginBottom: 5,
        paddingHorizontal: 5,
        flex: 1
    },
    con_khunglon: {
        marginTop: 10,
        flex: 1
    },
    con_khungava: {
        flexDirection: 'row',

    },
    con_khungnhom: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        flex: 1,
        paddingLeft: 6
    },
    con_khungten: {
        flexDirection: 'row',

    },
    con_khungchung_row: {
        flexDirection: 'row',
    },
    con_khungchung_rowtext: {
        flexDirection: 'row',
        marginRight: 10,
    },
    text_name: {
        fontWeight: 'bold',
    },
    text_tengroup: {
        fontWeight: 'bold',
        marginLeft: 6
    },
    text_tenNguoiDcTagNhieu: {
        fontWeight: 'bold',
    },
    text_tenNguoiDcTagIt: {
        fontWeight: 'bold',
        width: Width(20),
    },
    img_tamgiac: {
        alignItems: 'center',
        marginTop: 4,
        marginLeft: 6
    },

});


const mapStateToProps = state => ({
    lang: state.changeLanguage.language,
    reducerBangCong: state.reducerBangCong
});
export default Utils.connectRedux(ModalTinNoiBat, mapStateToProps, true)
