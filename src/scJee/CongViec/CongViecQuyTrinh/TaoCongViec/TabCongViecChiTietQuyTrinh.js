import React, { Component } from 'react';
import {
    Dimensions, SafeAreaView, Text, TouchableOpacity, View, BackHandler
} from 'react-native';
import { TabView } from 'react-native-tab-view';
import { RootLang } from '../../../../app/data/locales';
import Utils from '../../../../app/Utils';
import UtilsApp from '../../../../app/UtilsApp'
import HeaderComStack from '../../../../components/HeaderComStack';
import { Images } from '../../../../images';
import { colors } from '../../../../styles/color';
import { fonts } from '../../../../styles/font';
import { reText, sizes } from '../../../../styles/size';
import { nstyles } from '../../../../styles/styles';
import CongViecChiTiet_QT from './CongViecChiTiet_QT';
import HoatDong from './HoatDong';

class TabCongViecChiTietQuyTrinh extends Component {
    constructor(props) {
        super(props);
        this.type = Utils.ngetParam(this, 'type', 0)
        this.state = {
            index: 0,
            routes: [
                { key: 'ChiTiet', title: 'Chi tiết công việc', }, //Giữ tên cũ, hiện tại là cv được giao
                { key: 'HoatDong', title: 'Hoạt động' } //Công việc theo quy trình
            ],
            isRef: false,
        }
    }

    componentDidMount = () => {
        BackHandler.addEventListener("hardwareBackPress", this._goback);
    }

    componentWillUnmount() {
        try {
            BackHandler.removeEventListener('hardwareBackPress', this._goback)
        }
        catch (error) {

        }
    }

    _goback = async () => {
        Utils.goback(this, null)
        return true;
    }

    renderScene = ({ route }) => {
        switch (route.key) {
            case 'ChiTiet':
                return (
                    <CongViecChiTiet_QT nthis={this} />
                )
            case 'HoatDong':
                return (
                    <HoatDong nthis={this} />
                )
            default:
                return null;
        }
    }
    onTabChange = (val) => {
        var { isRef } = this.state
        if (isRef == true) {
            this.setState({ isRef: false })
        }
    }
    _renderTabBar = props => {
        var { index = 0 } = props.navigationState
        return (
            <View key={index.toString()} style={[nstyles.shadowTabTop, {
                height: 50,
                flexDirection: 'row', width: '100%', marginBottom: 1,
            }]}>
                {
                    props.navigationState.routes.map((x, i) => {
                        return (
                            <TouchableOpacity
                                key={i.toString()}
                                onPress={() => { this.setState({ index: i }) }}
                                style={{
                                    flex: 1, backgroundColor: colors.white,
                                    flexDirection: 'row', paddingVertical: 5
                                }}>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <View style={{ flex: 1 }}></View>
                                    <View style={{ justifyContent: 'center', }}>
                                        <Text numberOfLines={1} style={{
                                            color: i == index ? colors.colorTabActiveJeeHR : colors.black_20,
                                            textAlign: 'center', paddingTop: 10, flex: 1,
                                            fontFamily: fonts.Helvetica, fontSize: i == index ? reText(16) : reText(14), fontWeight: i == index ? 'bold' : null
                                        }}>{`${x.title}`}</Text>
                                        <View style={{ height: 2, backgroundColor: i == index ? colors.colorTabActiveJeeHR : '#fff', }}></View>
                                    </View>
                                    <View style={{ flex: 1 }}></View>
                                </View>
                            </TouchableOpacity>)
                    })
                }
            </View >)
    }
    render() {
        const { index } = this.state
        return (
            <View style={[nstyles.ncontainer, { flex: 1, backgroundColor: colors.white }]}>
                <HeaderComStack
                    onPressLeft={() => { this._goback() }}
                    nthis={this}
                    title={RootLang.lang.scCongViecCaNhan.congvieccanhan}

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
    count: state.CountWork.count,
    count_proceduralWokd: state.CountProceduralWork.count
});
export default Utils.connectRedux(TabCongViecChiTietQuyTrinh, mapStateToProps, true)