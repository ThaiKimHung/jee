import React, { Component } from 'react';
import {
    Dimensions, ImageStore, Text, TouchableOpacity, View
} from 'react-native';
import { TabView } from 'react-native-tab-view';
import { RootLang } from '../../../../app/data/locales';
import Utils from '../../../../app/Utils';
import HeaderComStack from '../../../../components/HeaderComStack';
import { Images } from '../../../../images';
import { colors } from '../../../../styles/color';
import { fonts } from '../../../../styles/font';
import { sizes } from '../../../../styles/size';
import { nstyles } from '../../../../styles/styles';
import ConfigCCWifi from './ConfigCCWifi';
import QuanLyNhanVienCCWifi from './QuanLyNhanVienCCWifi';
import HeaderAnimationJee from '../../../../components/HeaderAnimationJee';
class QuanLyCCWifi extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 1,
            routes: [
                { key: 'danhsachwifi', title: 'danhsachwifi', },
                { key: 'danhsachnhanvien', title: 'danhsachnhanvien' },
            ],
            isChangedata: false,
            isRef: false,
            addNhanVien: false,
            config: false,
        }
    }
    _setIndex = () => {
        this.setState({ index: 1, isRef: true })

    }
    _setConfig = () => {
        var { config } = this.state
        this.setState({ config: !config })
    }

    renderScene = ({ route }) => {
        const { addNhanVien, config } = this.state
        switch (route.key) {
            case 'danhsachwifi':
                return (
                    <ConfigCCWifi nthis={this} config={config} _setState={this._setConfig} />
                )
            case 'danhsachnhanvien':
                return (
                    <QuanLyNhanVienCCWifi nthis={this} addNhanVien={addNhanVien} setIndex={this._setIndex} />
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
                            onPress={() => { this.setState({ index: i, config: false, addNhanVien: false }) }}
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
                                        fontFamily: fonts.Helvetica, fontSize: sizes.sText15,
                                    }}>{RootLang.lang.scQuanLyChamCong[`${x.title}`]}</Text>
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
        const { index } = this.state
        var { addNhanVien, config } = this.state
        return (
            <View style={[nstyles.ncontainer, { flex: 1, backgroundColor: colors.white }]}>
                {/* <HeaderComStack nthis={this} title={RootLang.lang.scQuanLyChamCong.titlewifi}
                    onPressLeft={() => { Utils.goback(this) }}
                    iconRight={index == 1 ? Images.icAddH : Images.icSettingH}
                    styIconRight={{ width: 20, height: 20, tintColor: "black" }}
                    onPressRight={() => { index == 1 ? this.setState({ addNhanVien: !addNhanVien }) : this.setState({ config: !config }) }}
                /> */}
                <HeaderAnimationJee nthis={this} title={RootLang.lang.scQuanLyChamCong.titlewifi}
                    onPressLeft={() => { Utils.goback(this) }}
                    iconRight={index == 1 ? Images.icAddH : Images.icSettingH}
                    styIconRight={{ width: 20, height: 20, tintColor: "black" }}
                    onPressRight={() => { index == 1 ? this.setState({ addNhanVien: !addNhanVien }) : this.setState({ config: !config }) }}
                />
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
export default Utils.connectRedux(QuanLyCCWifi, mapStateToProps, true)