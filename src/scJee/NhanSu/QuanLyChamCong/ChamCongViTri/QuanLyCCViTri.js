import React, { Component } from 'react';
import {
    Dimensions, Text, TouchableOpacity, View
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
import ConfigCCViTri from './ConfigCCViTri';
import QuanLyNhanVienCCViTri from './QuanLyNhanVienCCViTri';
import HeaderAnimationJee from '../../../../components/HeaderAnimationJee';
class QuanLyCCViTri extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 1,
            routes: [
                { key: 'ConfigCCViTri', title: 'danhsachvitri', },
                { key: 'QuanLyNhanVienCCViTri', title: 'danhsachnhanvien' },
            ],
            isChangedata: false,
            isRef: false,
            addNhanVien: false,
            config: false,
            isFilter: false,

        }
    }
    _setIndex = () => {
        this.setState({ index: 1, isRef: true })

    }
    _setConfig = () => {
        var { config } = this.state
        this.setState({ config: !config })
    }
    _AddNhanVienFalse = () => {
        this.setState({ addNhanVien: false })
    }
    _AddNhanVienTrue = () => {
        this.setState({ addNhanVien: true, isFilter: false })
    }

    renderScene = ({ route }) => {
        const { addNhanVien, config, isFilter } = this.state
        switch (route.key) {
            case 'QuanLyNhanVienCCViTri':
                return (
                    <QuanLyNhanVienCCViTri nthis={this}
                        addNhanVien={addNhanVien}
                        _AddNhanVienTrue={this._AddNhanVienTrue}
                        _AddNhanVienFalse={this._AddNhanVienFalse}
                        _setConfig={this._setConfig}
                        isFilter={isFilter}
                    />
                )
            case 'ConfigCCViTri':
                return (
                    <ConfigCCViTri nthis={this} config={config} setIndex={this._setIndex} />
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
        var { addNhanVien, config, isFilter } = this.state
        return (
            <View style={[nstyles.ncontainer, { flex: 1, backgroundColor: colors.white }]}>
                {/* <HeaderComStack onPressLeft={() => { Utils.goback(this) }}
                    nthis={this} title={RootLang.lang.scQuanLyChamCong.titlevitri}
                    iconRight={index == 1 ? Images.icFilterNew : Images.icSettingH}
                    styIconRight={{ width: 20, height: 20, tintColor: 'black' }}
                    onPressRight={() => { index == 1 ? this.setState({ isFilter: !isFilter }) : this.setState({ config: !config }) }}

                /> */}
                <HeaderAnimationJee onPressLeft={() => { Utils.goback(this) }}
                    nthis={this} title={RootLang.lang.scQuanLyChamCong.titlevitri}
                    iconRight={index == 1 ? Images.icFilterNew : Images.icSettingH}
                    styIconRight={{ width: 20, height: 20, tintColor: 'black' }}
                    onPressRight={() => { index == 1 ? this.setState({ isFilter: !isFilter }) : this.setState({ config: !config }) }}

                />
                <View style={{ flex: 1, backgroundColor: colors.white }}>
                    <TabView
                        lazy={false}
                        swipeEnabled={false}
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
export default Utils.connectRedux(QuanLyCCViTri, mapStateToProps, true)