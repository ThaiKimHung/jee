import React, { Component } from 'react'
import { Animated, Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import * as Animatable from 'react-native-animatable'
import { Get_ChucNangByUser } from '../../../apis/JeePlatform/API_JeeWork/apiMenu'
import { RootLang } from '../../../app/data/locales'
import Utils from '../../../app/Utils'
import UtilsApp from '../../../app/UtilsApp'
import { Images } from '../../../images'
import { colors } from '../../../styles/color'
import { nstyles } from '../../../styles/styles'
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
const childrenWidth = width / 3 - 20
const childrenHeight = 48 * 4
const headerViewHeight = 160
const bottomViewHeight = 40


export class MDListMenu extends Component {
    constructor(props) {
        super(props)
        this.callback = Utils.ngetParam(this, 'callback');
        this.state = {
            opacity: new Animated.Value(0),
            EmptyMenu: [{}, {}, {}, {}, {}, {}],
            data: AUTO_TEST_DATA,
            listMenu: [],
            selectedMenu: [],
            menuCoSan: Utils.ngetParam(this, 'data', []),

        }
    }

    componentDidMount() {
        this._startAnimation(0.4)
        this._loadList_Menu()
    }


    _loadList_Menu = async () => {
        const res = await Get_ChucNangByUser()
        if (res.status == 1) {
            objectMenuGlobal.AllMenu.map(item => res?.data.map(item2 => {
                if (item.RowID == item2.RowID)
                    this.setState({ listMenu: this.state.listMenu.concat(item) })
            }))
            this.setState({ listMenu: this.state.listMenu.map(obj => ({ ...obj, check: this.state.menuCoSan ? (this._containsObject(this.state.menuCoSan, obj)) : false })) }, async () => await this._check(this.state.listMenu))
            // Utils.nlog('state', this.state.listMenu)
        } else {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
        }
    }
    _containsObject(obj, list) {
        let checkExit = obj.some((item) => item.RowID == list.RowID)
        return checkExit

    }
    _check = async (list) => {
        list.map((item) => {
            if (item.check === true) {
                this.state.selectedMenu.push(item);
                return this.state.selectedMenu
            }
        })
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
            <>
                {this.state.selectedMenu.length < 6 ? (
                    <TouchableOpacity style={[styles.item, { marginTop: 10 }]}
                        onPress={() => this._ChonMenu(item)}>
                        <View style={{ justifyContent: 'center' }}>
                            <Image source={item.check == true ? Images.ImageJee.icTouchDaChon : Images.ImageJee.icTouchChuaChon} resizeMode='cover' style={[{}]} />
                        </View>
                        {/* <View style={styles.item_icon_swipe}>
                      <Image style={styles.item_icon} source={require('../../images/imgAppJee/icMNCV_1.png')} />
                  </View> */}

                        <View style={styles.item_text_swipe}>
                            <Text numberOfLines={2} style={styles.item_text}>{item.Title}</Text>
                        </View>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={[styles.item, { marginTop: 10 }]}
                        onPress={() => this._ChonMenu(item)}
                    >
                        <View style={{ justifyContent: 'center' }}>
                            <Image source={item.check == true ? Images.ImageJee.icTouchDaChon : null} resizeMode='cover' style={[{}]} />
                        </View>
                        {/* <View style={styles.item_icon_swipe}>
                    <Image style={styles.item_icon} source={require('../../images/imgAppJee/icMNCV_1.png')} />
                </View> */}

                        <View style={styles.item_text_swipe}>
                            <Text numberOfLines={2} style={styles.item_text}>{item.Title}</Text>
                        </View>
                    </TouchableOpacity>
                )}

            </>
        )
    }
    _ChonMenu = async (itemChoice) => {
        var { listMenu, selectedMenu } = this.state
        listMenu.map((item) => {
            if (item === itemChoice) {
                if (selectedMenu.length >= 6 && item.check == false) {
                    UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.thongbaochung.chicothechonsaumenu, 3)
                }
                else {
                    item.check = !item.check
                    if (item.check === true) {
                        selectedMenu.push(item);
                    } else if (item.check === false) {
                        const i = this.state.selectedMenu.indexOf(item)
                        if (1 != -1) {
                            this.state.selectedMenu.splice(i, 1)
                            return this.state.selectedMenu
                        }
                    }
                }


            }
        })
        this.setState({ listMenu: listMenu })

    }
    _hoanTat = () => {
        this.callback(this.state.selectedMenu)
        // Utils.nlog('list sele', this.state.selectedMenu)
    }


    render() {
        let { opacity } = this.state
        const { EmptyMenu } = this.state
        return (
            <View style={[nstyles.ncontainer, {
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'transparent',

            }]}
            >
                <Animated.View onTouchEnd={this._goback} style={{
                    position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
                    backgroundColor: 'black', opacity, borderRadius: 15

                }} />

                <Animatable.View animation={'zoomInDown'} style={{
                    width: "90%",
                    height: "80%",
                    backgroundColor: colors.colorBGHome,
                    borderRadius: 15
                }}>
                    <View style={{
                        flex: 1, borderRadius: 15
                    }}>
                        <View style={{
                            flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 20, backgroundColor: "white", borderTopRightRadius: 15,
                            borderTopLeftRadius: 15,
                        }}>
                            <Text style={{ fontWeight: '600', fontSize: 20 }}>List menu</Text>
                            <TouchableOpacity style={{ backgroundColor: "#E7F3FF", paddingVertical: 5, borderRadius: 3, flexDirection: "row-reverse", paddingHorizontal: 5 }}
                                onPress={() => this._hoanTat()}>
                                <Text style={{ fontSize: 14, color: colors.colorJeeNew.colorBlueHomeBackground, marginLeft: 10 }}>{RootLang.lang.thongbaochung.hoantat}</Text>
                                <Image
                                    style={[nstyles.nIcon12, { alignSelf: 'center' }]}
                                    source={Images.ImageJee.icSave}
                                    resizeMode={'contain'} />
                            </TouchableOpacity>


                        </View>

                        <FlatList
                            // horizontal={}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            // scrollEnabled={false}
                            style={{
                                backgroundColor: 'white',
                                paddingHorizontal: 20,
                                borderBottomRightRadius: 15,
                                borderBottomLeftRadius: 15,
                                paddingBottom: 10
                                // paddingTop: 5
                            }}
                            // numColumns={3}
                            data={this.state.listMenu}
                            renderItem={this._renderItem}
                            keyExtractor={(item, index) => index.toString()}
                        />

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
        // width: 100,
        // height: 100,
        // justifyContent: 'space-around',
        alignItems: 'center',
        // backgroundColor: 'red',
        flexDirection: 'row'

    },
    item_icon_swipe: {
        width: childrenWidth * 0.2,
        height: childrenWidth * 0.2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    item_icon: {
        width: childrenWidth * 0.5,
        height: childrenWidth * 0.5,
        resizeMode: 'contain',
    },
    item_text_swipe: {
        backgroundColor: '#fff',
        // flex: 1,
        // width: 100,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10
    },
    item_text: {
        color: '#444',
        fontSize: 20,
        fontWeight: 'bold',
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
export default Utils.connectRedux(MDListMenu, mapStateToProps, true)


