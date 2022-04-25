import _ from 'lodash'
import React, { Component } from 'react'
import { Animated, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import * as Animatable from 'react-native-animatable'
import { AutoDragSortableView } from 'react-native-drag-sort'
import Utils from '../../../app/Utils'
import { colors } from '../../../styles/color'
import { nstyles, Width } from '../../../styles/styles'
import { Update_ChucNangThuongDung } from "../../../apis/JeePlatform/API_JeeWork/apiMenu"
import { RootLang } from '../../../app/data/locales'
import { Images } from '../../../images'
import { fonts } from '../../../styles'
import { sizes } from '../../../styles/size'
import { objectMenuGlobal } from '../AllMenu/MenuGlobal'

const AUTO_TEST_DATA = [
    { icon: Images.ImageJee.icMNCV_1, txt: 1 },
    { icon: Images.ImageJee.icMNCV_2, txt: 2 },
    { icon: Images.ImageJee.icMNCV_3, txt: 3 },
    { icon: Images.ImageJee.icMNCV_4, txt: 4 },
    { icon: Images.ImageJee.icMNCV_5, txt: 5 },
    { icon: Images.ImageJee.icMNCV_6, txt: 6 },

]
const { width } = Dimensions.get('window')

const parentWidth = width
const childrenWidth = width / 4
const childrenHeight = 48 * 4
const headerViewHeight = 160
const bottomViewHeight = 40

export class MDTuyChinhMenu extends Component {
    constructor(props) {
        super(props)
        this.callback = Utils.ngetParam(this, 'callback');
        this.state = {
            opacity: new Animated.Value(0),
            EmptyMenu: [{}, {}, {}, {}, {}, {}],
            data: AUTO_TEST_DATA,
            listData: [
                { icon: Images.ImageJee.icMNCV_1, txt: 1 },
                { icon: Images.ImageJee.icMNCV_2, txt: 2 },
                { icon: Images.ImageJee.icMNCV_3, txt: 3 },
                { icon: Images.ImageJee.icMNCV_4, txt: 4 },
                { icon: Images.ImageJee.icMNCV_5, txt: 5 },
                { icon: Images.ImageJee.icMNCV_6, txt: 6 },
            ],
            menuCu: [],
            listDataMoi: [],
        }
        this.ListMenuThuongDung = Utils.getGlobal("ListMenuThuongDung", [])
    }

    componentDidMount() {
        this._startAnimation(0.4)
        this._ganDsMenuCoSan()
    }

    _ganDsMenuCoSan = () => {
        this.setState({
            listData: this.state.listData.map((obj, index) => this.ListMenuThuongDung.find((item2, index2) => index == index2) || obj),
        },
            //  () => Utils.nlog('hello', this.state.listData)
            // this.setState({ listDataMoi: this.state.listData })
        )
    }

    _Update_ChucNangThuongDung = async () => {
        let dsmenu = [];
        await this.state.listData.map((item, index) => {
            // Utils.nlog("item", index)
            item.RowID ? dsmenu.push({ "RowID": item.RowID, "Position": index }) : null

        })
        // Utils.nlog("ds menu", dsmenu)
        let strbody = dsmenu
        let res = await Update_ChucNangThuongDung(JSON.stringify(strbody))
        if (res.status == 1) {
            Utils.setGlobal("ListMenuThuongDung", this.state.listData)
            Utils.showMsgBoxOK(this, RootLang.lang.thongbaochung.thongbao, RootLang.lang.thongbaochung.luuthanhcong, RootLang.lang.thongbaochung.xacnhan, () => { Utils.goback(this, null), this.callback() });
        } else {
            Utils.showMsgBoxOK(this, RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, RootLang.lang.thongbaochung.xacnhan);
        }
    }

    _XoaMenu = async (index) => {
        await this.setState({
            listData: this.state.listData.filter((i, index1) => index1 != index).concat({ "icon": Images.ImageJee.icMNHC_6, "txt": "6" }),
        })
        // await Utils.nlog('listDataMoi', this.state.listDataMoi)
    }


    _checkExists = (list, obj) => {
        let checkExit = list.some((item) => item.RowID == obj.RowID)
        return checkExit
    }

    _callback = async (item) => {
        await this.setState({
            menuCu: this.state.listData,
            listDataMoi: [],
        })
        await objectMenuGlobal.AllMenu.map(i => item.map(item2 => {
            if (i.RowID == item2.RowID) {
                this.setState({ listDataMoi: this.state.listDataMoi.concat(i) })
            }
        }))
        // Utils.nlog('listDataMoi', this.state.listDataMoi)
        // await this.setState({
        //     listData: this.state.listData.map((obj, index) => this.state.listDataMoi.find((item2, index2) => index == index2) || obj)
        // })
        await this.setState({
            listData: this.state.listDataMoi
        })
        if (this.state.listData.length < 6) {
            for (let i = this.state.listData.length; i < 6; i++) {
                await this.setState({
                    listData: this.state.listData.concat({ "icon": Images.ImageJee.icMNCV_6, "txt": "6" }),
                })
            }
        }
        // await Utils.nlog('listData', this.state.listData)

        await Utils.goback(this, null)

    }
    _startAnimation = (value) => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: value,
                duration: 300
            }).start();
        }, 350);
    };

    _goback = () => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: 0,
                duration: 250
            }).start(() => {
                Utils.goback(this)
            });
        }, 100);
    }


    _renderItem = ({ item, index }) => {
        return (
            <View>
                {_.size(item) > 0 ?
                    <>
                    </> :
                    <View>
                        <TouchableOpacity
                            // onPress={() => this._onPres(item)}
                            style={{
                                width: '33.33%',
                                // backgroundColor: 'blue',
                                paddingHorizontal: 5, marginTop: 10, marginTop: 20,

                            }}>
                            <Image
                                style={[{ alignSelf: 'center', width: Width(30), height: Width(14) }]}
                                source={Images.icMenuEmpty}
                                resizeMode={'contain'} />
                            <Text
                                numberOfLines={3}
                                style={{
                                    fontFamily: fonts.Helvetica, color: colors.textblack,
                                    fontSize: sizes.sText12, textAlign: 'center', marginTop: 10
                                }}>
                                .......
                            </Text>
                        </TouchableOpacity>
                    </View>}
            </View>
        )
    }

    renderItem(item, index) {
        return (
            <>
                {item.txt ? (
                    <TouchableOpacity
                        onPress={this._go_Cong} style={styles.item}>
                        <View style={styles.item_icon_swipe}>
                            <Image style={styles.item_icon} source={Images.ImageJee.icPlus} />
                        </View>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.item}>
                        <TouchableOpacity
                            onPress={() => { this._XoaMenu(index) }}
                            style={{ position: 'absolute', top: 0, right: 5 }}>
                            <Image source={Images.ImageJee.icXoaAnh} style={{ height: 30, width: 20 }} resizeMode='contain' />
                        </TouchableOpacity>
                        <View style={styles.item_icon_swipe}>
                            <Image style={styles.item_icon} source={item.linkicon} />
                        </View>
                        <View style={styles.item_text_swipe1}>
                            <Text style={[styles.item_text1, { textAlign: "center" }]}>{item.Title}</Text>
                        </View>
                    </View>
                )}

            </>
        )
    }

    _go_Cong = () => {
        Utils.goscreen(this, 'Modal_MDListMenu', { callback: this._callback, data: this.state.listData })
    }

    render() {
        let { opacity } = this.state
        const { EmptyMenu } = this.state
        return (
            <View style={[nstyles.ncontainer, {
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'transarent',

            }]}>
                <Animated.View onTouchEnd={this._goback} style={{
                    position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
                    backgroundColor: 'black', opacity, borderRadius: 15

                }} />
                <Animatable.View animation={'zoomInDown'} style={{
                    width: "90%",
                    height: Width(110),
                    backgroundColor: colors.colorBGHome,
                    borderRadius: 15
                }}>
                    <View style={{ flex: 1, borderRadius: 15 }}>
                        <View style={{
                            flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 20, backgroundColor: "white", borderTopRightRadius: 15,
                            borderTopLeftRadius: 15, paddingBottom: 10
                        }}>
                            <Text style={{ fontWeight: '600', fontSize: 20 }}>{RootLang.lang.thongbaochung.ungdungthuongdung}</Text>
                            <TouchableOpacity
                                onPress={this._Update_ChucNangThuongDung}
                                style={{
                                    backgroundColor: "#E7F3FF", paddingVertical: 5, borderRadius: 3, flexDirection: "row-reverse", paddingHorizontal: 10,
                                    width: "25%"
                                }}>
                                <Text style={{ fontSize: 16, color: colors.colorJeeNew.colorBlueHomeBackground, marginLeft: 10, fontWeight: "700" }}>{RootLang.lang.thongbaochung.luu}</Text>
                                <Image
                                    style={[nstyles.nIcon14, { alignSelf: 'center' }]}
                                    source={Images.ImageJee.icSave}
                                    resizeMode={'contain'} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 1, paddingTop: 10, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10 }}>
                            {/* <AutoDragSortableView
                                keyExtractor={(item, index) => index.toString()}
                                dataSource={this.state.listData}
                                parentWidth={Width(85)}
                                childrenWidth={childrenWidth}
                                childrenHeight={120}
                                marginChildrenTop={10}
                                marginChildrenRight={10}
                                marginChildrenBottom={5}
                                renderItem={(item, index) => {
                                    return this.renderItem(item, index)
                                }}
                                onDataChange={(data) => { this.setState({ listData: data }, () => Utils.nlog('data', this.state.listData)) }}
                            /> */}
                        </View>
                    </View >
                </Animatable.View>
            </View >
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    header: {
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomColor: '#2ecc71',
        borderBottomWidth: 2,
    },
    header_title: {
        color: '#333',
        fontSize: 24,
        fontWeight: 'bold'
    },
    item: {
        width: childrenWidth,
        height: 120,
        justifyContent: 'space-around',
        alignItems: 'center',
        // backgroundColor: 'red',
        borderColor: colors.black_20,
        borderWidth: 0.5,
        marginHorizontal: 10
    },
    item_icon_swipe: {
        width: childrenWidth * 0.2,
        height: childrenWidth * 0.2,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10
    },
    item_icon: {
        // width: childrenWidth * 0.5,
        // height: childrenWidth * 0.5,
        width: childrenWidth * 0.5 - 20,
        height: childrenWidth * 0.5,
        resizeMode: 'contain',
    },
    item_text_swipe: {
        backgroundColor: '#fff',
        width: 56,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    item_text_swipe1: {
        // backgroundColor: '#fff',
        // flex: 1,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
    },
    item_text: {
        color: '#444',
        fontSize: 20,
        fontWeight: 'bold',
    },
    item_text1: {

        fontSize: 14,

    },

    aheader: {
        height: headerViewHeight,
        flexDirection: 'row',
        borderBottomColor: '#2ecc71',
        borderBottomWidth: 2,
        zIndex: 100,
        backgroundColor: '#fff'
    },
    aheader_img: {
        width: headerViewHeight * 0.6,
        height: headerViewHeight * 0.6,
        resizeMode: 'cover',
        borderRadius: headerViewHeight * 0.3,
        marginLeft: 16,
        marginTop: 10,
    },
    aheader_context: {
        marginLeft: 8,
        height: headerViewHeight * 0.4,
        marginTop: 10
    },
    aheader_title: {
        color: '#333',
        fontSize: 20,
        marginBottom: 10,
        fontWeight: 'bold'
    },
    aheader_desc: {
        color: '#444',
        fontSize: 16,
        width: width - headerViewHeight * 0.6 - 32
    },
    abottom: {
        justifyContent: 'center',
        alignItems: 'center',
        height: bottomViewHeight,
        backgroundColor: '#fff',
        zIndex: 100,
        borderTopColor: '#2ecc71',
        borderTopWidth: 2,
    },
    abottom_desc: {
        color: '#333',
        fontSize: 20,
        fontWeight: 'bold'
    }
})

const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(MDTuyChinhMenu, mapStateToProps, true)


