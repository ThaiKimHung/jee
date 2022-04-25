import React, { Component } from 'react';
import {
    Dimensions, SafeAreaView, Text, TouchableOpacity, View, BackHandler
} from 'react-native';
import { TabView } from 'react-native-tab-view';
import { RootLang } from '../../../app/data/locales';
import Utils from '../../../app/Utils';
import UtilsApp from '../../../app/UtilsApp'
import HeaderComStack from '../../../components/HeaderComStack';
import { Images } from '../../../images';
import { colors } from '../../../styles/color';
import { fonts } from '../../../styles/font';
import { reText, sizes } from '../../../styles/size';
import { nstyles, Width } from '../../../styles/styles';
import { Get_ListCVLL } from "../../../apis/JeePlatform/API_JeeWork/apiCongViecLapLai";
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import moment from 'moment';
import HangTuan from './HangTuan/HangTuan'
import HangThang from './HangThang/HangThang'

class TabCongViecCaNhan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            routes: [
                { key: 'HangTuan', title: RootLang.lang.thongbaochung.hangtuan },
                { key: 'HangThang', title: RootLang.lang.thongbaochung.hangthang }
            ],
        }
    }

    componentDidMount = () => {
        BackHandler.addEventListener("hardwareBackPress", this._goback);
        this.props.SetCounCVLapLaiTuan(0)
        this.props.SetCounCVLapLaiThang(0)
        this._getListCongViecLapLai()
    }

    componentWillUnmount() {
        try {
            BackHandler.removeEventListener('hardwareBackPress', this._goback)
        }
        catch (error) {
        }
    }

    _getListCongViecLapLai = async () => {
        let numTuan = 0
        let numThang = 0
        let res = await Get_ListCVLL()
        // console.log('res _getListCongViecLapLai_Tuan', res)
        if (res.status == 1) {
            res.data.map(item => {
                if (item.frequency == 1) {
                    numTuan += 1
                }
                else if (item.frequency == 2) {
                    numThang += 1
                }
            })
            this.props.SetCounCVLapLaiTuan(numTuan)
            this.props.SetCounCVLapLaiThang(numThang)
        }
        else {
            // UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, res.error ? res.error.message : RootLang.lang.JeeWork.laydulieuthatbai, 2)
        }
    }

    renderScene = ({ route }) => {
        switch (route.key) {
            case 'HangTuan':
                return (
                    <HangTuan nthis={this} />
                )
            case 'HangThang':
                return (
                    <HangThang nthis={this} />
                )
            default:
                return null;
        }
    }

    _renderTabBar = props => {
        var { index = 0 } = props.navigationState
        return (<View key={index.toString()} style={[nstyles.shadowTabTop, {
            height: 50,
            flexDirection: 'row', width: '100%', marginBottom: 1,
        }]}>
            {
                props.navigationState.routes.map((x, i) => {
                    let count = i == 0 ? this.props.countCVTuan : this.props.countCVThang
                    let check = (i == 0 && this.props.countCVTuan == 0) || (i == 1 && this.props.countCVThang == 0) ? true : false
                    return (
                        <TouchableOpacity
                            key={i.toString()}
                            onPress={() => { this.setState({ index: i }) }}
                            style={{ flex: 1, backgroundColor: 'white', flexDirection: 'row', paddingVertical: 5, }}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <View style={{ flex: 1 }}></View>
                                <View style={{ alignItems: 'center' }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text numberOfLines={1} style={{
                                            color: i == index ? colors.colorTabActiveJeeHR : colors.black_20,
                                            textAlign: 'center', paddingVertical: 6,
                                            fontFamily: fonts.Helvetica, fontSize: i == index ? reText(15) : reText(14),
                                            maxWidth: Width(42)
                                        }}>{x.title}</Text>
                                        <View style={{ width: count.length > 2 ? Width(8) : Width(6), height: Width(6), borderRadius: Width(5), backgroundColor: check ? colors.black_20 : colors.redtext, justifyContent: 'center', alignItems: 'center', marginLeft: 5, alignSelf: 'center' }}>
                                            <Text style={{ color: colors.white, fontSize: count.length > 2 ? reText(13) : reText(14) }}>{count}</Text>
                                        </View>
                                    </View>
                                    <View style={{ height: 2, backgroundColor: i == index ? colors.colorTabActiveJeeHR : '#fff', paddingHorizontal: 60 }}></View>
                                </View>
                                <View style={{ flex: 1 }}></View>
                            </View>
                        </TouchableOpacity>)
                })
            }
        </View >)
    }

    _goback = () => {
        Utils.goback(this, null)
        return true;
    }

    render() {
        const { index } = this.state
        return (
            <View style={[nstyles.ncontainer, { flex: 1, backgroundColor: colors.white }]}>
                <HeaderComStack
                    onPressLeft={() => { this._goback() }}
                    nthis={this}
                    title={RootLang.lang.scCongViecCaNhan.congvieclaplai}

                />
                <View style={{ flex: 1, backgroundColor: colors.white }}>
                    <TabView
                        ref={ref => this.ref = ref}
                        lazy={true}
                        swipeEnabled={true}
                        navigationState={this.state}
                        renderScene={this.renderScene}
                        renderTabBar={this._renderTabBar}
                        onIndexChange={index => this.setState({ index })}
                        initialLayout={{ width: Dimensions.get('window').width }}
                    />
                </View>
            </View>
        );
    }
};
const mapStateToProps = state => ({
    lang: state.changeLanguage.language,
    countCVTuan: state.CountCVTuan.count,
    countCVThang: state.CountCVThang.count
});
export default Utils.connectRedux(TabCongViecCaNhan, mapStateToProps, true)