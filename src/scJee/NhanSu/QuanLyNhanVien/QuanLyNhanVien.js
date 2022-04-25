import React, { Component } from 'react';
import {
    Dimensions, Text, TouchableOpacity, View
} from 'react-native';
import { TabView } from 'react-native-tab-view';
import { RootLang } from '../../../app/data/locales';
import { nGlobalKeys } from '../../../app/keys/globalKey';
import Utils from '../../../app/Utils';
import HeaderComStack from '../../../components/HeaderComStack';
import { colors } from '../../../styles/color';
import { fonts } from '../../../styles/font';
import { sizes } from '../../../styles/size';
import { nstyles } from '../../../styles/styles';
import DsNhanVien from './DsNhanVien';
import ModalThemNhanVien from './ModalThemNhanVien';
import HeaderAnimationJee from '../../../components/HeaderAnimationJee';
class QuanLyNhanVien extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 1,
            routes: [
                { key: 'themnhanvien', title: 'themnhanvien', },
                { key: 'danhsachnhanvien', title: 'danhsachnhanvien' },
            ],
            isChangedata: false,
            isRef: false
        }
    }
    _setIndex = () => {
        this.setState({ index: 1, isRef: true })

    }

    renderScene = ({ route }) => {
        switch (route.key) {
            case 'themnhanvien':
                return (
                    <ModalThemNhanVien nthis={this} setIndex={this._setIndex} />
                )
            case 'danhsachnhanvien':
                return (
                    <DsNhanVien nthis={this} />
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
        return (<View key={index.toString()} style={[nstyles.shadowTabTop, {
            height: 50,
            flexDirection: 'row', width: '100%', marginBottom: 1,
        }]}>

            {
                props.navigationState.routes.map((x, i) => {
                    return (
                        <TouchableOpacity
                            key={i.toString()}
                            onPress=
                            {() => {
                                this.setState({ index: i }, i == 0 && Utils.getGlobal(nGlobalKeys.ThemNhanVien, false) == false ? Utils.showMsgBoxOK(this, RootLang.lang.thongbaochung.thongbao, RootLang.lang.menu.khongcoquyen, RootLang.lang.thongbaochung.xacnhan, () => {
                                    this.setState({ index: 1 })
                                }) : null)
                            }}
                            style={{
                                flex: 1, backgroundColor: 'white',
                                flexDirection: 'row', paddingVertical: 5
                            }}>
                            <View style={{ height: 40, width: 0.5, backgroundColor: colors.veryLightPinkTwo }}></View>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <View style={{ flex: 1 }}></View>
                                <View style={{}}>
                                    <Text numberOfLines={1} style={{
                                        color: i == index ? colors.colorTabActive : colors.black_20,
                                        textAlign: 'center', paddingVertical: 6, flex: 1,
                                        fontFamily: fonts.Helvetica, fontSize: sizes.sText16,
                                    }}>{RootLang.lang.scQuanLyNhanVien[`${x.title}`]}</Text>
                                    <View style={{ height: 2, backgroundColor: i == index ? colors.colorTabActive : '#fff', }}></View>
                                </View>
                                <View style={{ flex: 1 }}></View>
                            </View>
                            <View style={{ height: 40, width: 0.5, backgroundColor: colors.veryLightPinkTwo }}></View>
                        </TouchableOpacity>)
                })
            }
        </View >)
    }
    render() {
        return (
            <View style={[nstyles.ncontainer, { flex: 1, backgroundColor: colors.white }]}>
                {/* <HeaderComStack onPressLeft={() => { Utils.goback(this, null) }} nthis={this} title={RootLang.lang.scQuanLyNhanVien.title} /> */}
                <HeaderAnimationJee onPressLeft={() => { Utils.goback(this, null) }} nthis={this} title={RootLang.lang.scQuanLyNhanVien.title} />
                <View style={{ flex: 1, backgroundColor: colors.white }}>
                    <TabView
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
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(QuanLyNhanVien, mapStateToProps, true)