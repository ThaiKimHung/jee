import React, { Component } from 'react';
import { Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Image, Platform, TextInput, BackHandler, Animated } from "react-native";
import { SceneMap, TabView } from 'react-native-tab-view';
import Utils from '../../../app/Utils';
import IsLoading from '../../../components/IsLoading';
import { Images } from '../../../images';
import { colors } from '../../../styles';
import { sizes } from '../../../styles/size';
import { Height, nstyles, Width } from '../../../styles/styles';
import HoatDong from './HoatDong';
import TongQuan from './TongQuan';
import ActionSheet from '@alessiocancian/react-native-actionsheet'
import { DeleteCTCongViecCaNhan, getCTCongViecCaNhan, UpdateChiTietCongViec } from '../../../apis/JeePlatform/API_JeeWork/apiCongViecCaNhan';
import UtilsApp from '../../../app/UtilsApp';
import { RootLang } from '../../../app/data/locales';
const CANCEL_INDEX = 0
const DESTRUCTIVE_INDEX = 4

// const title = RootLang.lang.JeeWork.bancomuonthuchien

class ChiTiet_TongQuanCon extends Component {
    constructor(props) {
        super(props);
        // this.refLoading = React.createRef()
        this.state = {
            index: 0,
            editable: false,
            tencongviec: '',
            routes: [
                { key: 'tongquan', title: RootLang.lang.JeeWork.tongquan },
                { key: 'hoatdong', title: RootLang.lang.JeeWork.hoatdong },

            ],
        };
        this.id_row = Utils.ngetParam(this, "id_row")
        // this.ListStatus = Utils.ngetParam(this, "ListStatus")
        // this.Status = Utils.ngetParam(this, "Status")
        this.callback = Utils.ngetParam(this, 'callback');
        this.firstOnScroll = new Animated.Value(1)
        this.numberOfLinesHeaderCurrent = new Animated.Value(1)
        this.numberOfLinesHeader = this.firstOnScroll.interpolate({
            inputRange: [1, 400],
            outputRange: [20, Platform.OS == 'ios' ? 1 : 2],
            extrapolateLeft: 'clamp'
        });

    }
    _onScrollTongQuan = (e) => {
        Animated.timing(this.firstOnScroll, {
            toValue: e.nativeEvent.contentOffset.y > 400 ? 400 : e.nativeEvent.contentOffset.y,
            duration: 0
        }).start();
    }
    _handleChangeTab = (i) => {
        if (i == 0) {
            this.firstOnScroll.setValue(this.numberOfLinesHeaderCurrent._value)
        }
        else {
            this.numberOfLinesHeaderCurrent.setValue(this.firstOnScroll._value)
            this.firstOnScroll.setValue(400)
        }
        this.setState({ index: i })
    }

    componentDidMount = async () => {
        this.backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            this.backAction
        );
        await this._GetCTCongViec()

    }

    componentWillUnmount() {
        this.backHandler.remove();
    }

    backAction = () => {
        this.callback(true)
        Utils.goback(this, null)
        return true;
    };

    _GetCTCongViec = async () => {
        var { item } = this.state
        const res = await getCTCongViecCaNhan(this.id_row)
        if (res.status == 1) {
            this.setState({
                tencongviec: res.data.title,

            })
        }
        else {
            this.setState({ refreshing: false })
            UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, res.error ? res.error.message : RootLang.lang.JeeWork.laydulieuthatbai, 2)
        }

        return true
    }




    _renderScene = SceneMap({
        tongquan: () => <TongQuan nthis={this} WorkChild={true} onScrollTongQuan={this._onScrollTongQuan} />,
        hoatdong: () => <HoatDong nthis={this} />,
    });



    handlePress = (indexAt) => {

        if (indexAt == 1) {
            this.setState({ editable: true })
        }
        if (indexAt == 2) {
            this._DeleteCongViec(this.id_row)
        }
        else null


    }

    _updateChiTietCongViec = async (data) => {
        // this.refLoading.current.show()
        var body = JSON.stringify(data)
        const res = await UpdateChiTietCongViec(body)
        if (res.status == 1) {
            // this.refLoading.current.hide()
            this.setState({ editable: false, tencv: data.value })
        }
        else {
            // this.refLoading.current.hide()
            this.setState({ editable: false }, () => this._GetCTCongViec())
            UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, res.error ? res.error.message : RootLang.lang.JeeWork.capnhatthatbaivuilong, 2)
        }
        return true

    }

    _DeleteCongViec = async (id) => {
        const res = await DeleteCTCongViecCaNhan(id)
        if (res.status == 1) {
            UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, RootLang.lang.JeeWork.xoacongviecthanhcong, 1)
            this.callback(true)
            Utils.goback(this, null)
        }
        else {
            UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, res.error ? res.error.message : RootLang.lang.JeeWork.xoathatbaivuilong, 2)
        }
        return true
    }


    _renderTabBar = props => {
        var { index = 0 } = props.navigationState
        return (<View style={[nstyles.shadowTabTop, {
            height: Height(6), flexDirection: 'row',
            width: Width(100),
        }]}>
            {
                props.navigationState.routes.map((x, i) => {
                    return (
                        <TouchableOpacity
                            key={i.toString()}
                            onPress={() => this._handleChangeTab(i)}
                            style={{
                                flex: 1,
                                backgroundColor: colors.white,
                                flexDirection: 'row',
                                // height: Height(6),
                                borderBottomWidth: i == index ? 2 : 0,
                                borderColor: i == index ? '#0E72D8' : colors.white,
                                width: Width(100)

                            }}>
                            {/* <View style={{ height: 40, width: 0.5, backgroundColor: colors.veryLightPinkTwo }}></View> */}
                            <View style={{ flex: 1, flexDirection: 'row', width: Width(100) }}>
                                <View style={{ flex: 1 }}></View>
                                <View style={{ justifyContent: 'center', alignItems: 'center', width: Width(25), maxWidth: Width(30) }}>
                                    {/* <Text numberOfLines={1}
                                    style={{
                                        color: i == index ? colors.colorTabActive : colors.black_20,
                                        textAlign: 'center', paddingVertical: 6, flex: 1,
                                        fontFamily: fonts.Helvetica, fontSize: sizes.sText16,
                                    }}>{x.title}</Text> */}
                                    {i == index ? (
                                        // <Image
                                        //     style={[{ tintColor: colors.colorTabActiveJeeHR }]}
                                        //     source={x.icon}
                                        // />
                                        <Text style={{ fontWeight: 'bold', fontSize: sizes.sText16, color: '#0E72D8', textAlign: 'center', }}>{x.title}</Text>

                                    ) : (
                                        <Text style={{ fontSize: sizes.sText15, textAlign: 'center', }}>{x.title}</Text>
                                    )}
                                    <View style={{ height: 2, backgroundColor: i == index ? '#0E72D8' : '#fff', }}></View>
                                </View>
                                <View style={{ flex: 1 }}></View>
                            </View>
                            {/* <View style={{ height: 40, width: 0.5, backgroundColor: colors.veryLightPinkTwo }}></View> */}
                        </TouchableOpacity>
                    )
                })
            }
        </View >)
    }






    render() {
        const { listBaiDang, showload, refreshing } = this.state;
        var { tencongviec, editable } = this.state
        return (
            <View style={[nstyles.ncontainer, { width: Width(100), paddingTop: Platform.OS == 'ios' ? 10 : 5, backgroundColor: "white" }]}>
                <View style={{ flexGrow: 1, backgroundColor: '#E4E6EB', height: Height(100) }}>

                    <View
                        style={[nstyles.nHcontent, {
                            paddingHorizontal: 15,
                            width: '100%',
                            height: editable ? 100 : "auto",
                            borderBottomColor: colors.black_20_2,
                            borderBottomWidth: 0.3,
                            paddingBottom: 10,
                            flexDirection: 'row',
                            justifyContent: "space-between"
                        }]} resizeMode='cover' >

                        <TouchableOpacity
                            style={{
                                alignItems: 'flex-start', justifyContent: 'center', width: Width(12), height: Width(9)

                            }}
                            activeOpacity={0.5}
                            onPress={() => {
                                this.callback(true)
                                Utils.goback(this, null)

                            }}>
                            <Image
                                source={Images.ImageJee.icArrowNext}
                                resizeMode={'cover'}
                                style={[{ tintColor: "#707070" }]}
                            />
                        </TouchableOpacity>
                        <View
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center', width: Width(70)
                            }}
                        >
                            {this.state.editable == false ?
                                <Animated.Text
                                    numberOfLines={this.numberOfLinesHeader}
                                    style={{
                                        maxWidth: Width(75),
                                        lineHeight: sizes.sText24,
                                        fontSize: sizes.sText15,
                                        color: colors.black,
                                        fontWeight: "bold",
                                        textAlign: "center"
                                    }}>{this.state.tencongviec}</Animated.Text>
                                :
                                <View style={{ flex: 1, width: Width(100), marginTop: Platform.OS == 'ios' ? 0 : 10 }}>
                                    <TextInput
                                        onTouchStart={() => {
                                            this.setState({
                                                editable: true
                                            })
                                        }}
                                        style={{
                                            fontSize: sizes.sText14,
                                            backgroundColor: '#F7F8FA',
                                            padding: 2,
                                            height: 50,
                                            width: Width(75)

                                        }}
                                        numberOfLines={1}
                                        scrollEnabled={true}
                                        onChangeText={(tencongviec) => {
                                            this.setState({ tencongviec }, () => {
                                                this.setState({ editable: true })
                                            });
                                        }}

                                        placeholder={RootLang.lang.JeeWork.nhaptencongviec}
                                        autoCorrect={false}
                                        multiline={true}
                                        editable={editable}
                                        underlineColorAndroid="rgba(0,0,0,0)"
                                        // defaultValue={this.state.noiDung ? this.state.noiDung : null}
                                        value={tencongviec} />
                                </View>
                            }
                        </View>

                        {editable == true ?
                            <TouchableOpacity
                                onPress={() => {
                                    this._updateChiTietCongViec({
                                        id_row: this.id_row,
                                        key: "title",
                                        value: tencongviec,
                                        values: []
                                    })
                                }}
                                style={{ padding: 5, borderRadius: 10, position: "absolute", bottom: 0, top: Platform.OS == 'android' ? 30 : 50, right: 10, height: Width(8), backgroundColor: colors.colorJeeNew.colorBlueHome, justifyContent: 'center' }}>
                                <Text style={{ fontSize: 12, color: "white", textAlign: "center", alignSelf: "center" }}>Sửa</Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={() => { this.ActionSheetDinhKem.show() }} style={[{ padding: 10, width: Width(12), alignItems: 'flex-end', height: Width(9), justifyContent: 'center' }]}>
                                <Image source={Images.ImageJee.icBaCham} style={[{}]} />
                            </TouchableOpacity>
                        }
                    </View>

                    <TabView
                        lazy
                        navigationState={this.state}
                        renderScene={this._renderScene}
                        renderTabBar={this._renderTabBar}
                        onIndexChange={index => this._handleChangeTab(index)}
                        initialLayout={{ width: Dimensions.get('window').width }}
                    />
                </View>
                {/* <IsLoading ref={this.refLoading} /> */}
                <ActionSheet
                    ref={o => { this.ActionSheetDinhKem = o }}
                    title={RootLang.lang.JeeWork.bancomuonthuchien}
                    options={[
                        RootLang.lang.JeeWork.huy,
                        RootLang.lang.JeeWork.chinhsuacongvieccon,
                        RootLang.lang.JeeWork.xoacongviec
                    ]}
                    cancelButtonIndex={CANCEL_INDEX}
                    destructiveButtonIndex={2}
                    onPress={this.handlePress}

                />
            </View >
        );
    }
};


const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});

const styles = StyleSheet.create({
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
    }
});

export default Utils.connectRedux(ChiTiet_TongQuanCon, mapStateToProps, true)


