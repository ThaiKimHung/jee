import React, { Component } from 'react';
import {
    Dimensions, Text,
    TouchableOpacity, View
} from 'react-native';
import { TabView } from 'react-native-tab-view';
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import { RootLang } from '../../../app/data/locales';
import Utils from '../../../app/Utils';
import HeaderComStack from '../../../components/HeaderComStack';
import { colors, fonts, nstyles } from '../../../styles';
import { sizes } from '../../../styles/size';
import DSDoiCaLamViec from './DSDoiCaLamViec';
import ModalDoiCaLamViec from './ModalDoiCaLamViec';

export class DoiCaLamViec extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            routes: [
                { key: 'themdon', title: 'themdon', },
                { key: 'danhsach', title: 'danhsach' },
            ],
            isChangedata: false,
            isRef: false,
            isBack: Utils.ngetParam(this, "isBack", true),
        }
    }
    _setIndex = () => {
        this.setState({ index: 1, isRef: true })
    }
    renderScene = ({ route }) => {
        switch (route.key) {
            case 'themdon':
                return (
                    <ModalDoiCaLamViec nthis={this} setIndex={this._setIndex} />
                )
            case 'danhsach':
                return (
                    <DSDoiCaLamViec nthis={this} />
                )
            default:
                return null;
        }
    }
    onTabChange = (val) => {
        var { isRef } = this.state
        if (isRef == true) {
            ROOTGlobal.dataAppGlobal.reloadDSTangCa();
            this.setState({ isRef: false })
        }
    }
    _renderTabBar = props => {
        var { index = 0 } = props.navigationState
        return (<View style={{ height: 50, flexDirection: 'row', width: '100%' }}>
            {
                props.navigationState.routes.map((x, i) => {
                    return (<TouchableOpacity
                        key={i.toString()}
                        onPress={() => { this.setState({ index: i }) }}
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
                                }}>{RootLang.lang.tabtop[`${x.title}`]}</Text>

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
        const { isBack } = this.state;
        return (
            <View style={[nstyles.ncontainer, { flex: 1, backgroundColor: colors.white }]}>
                <HeaderComStack onPressLeft={() => { Utils.goback(this, null) }}

                    nthis={this} title={RootLang.lang.scdoicalamviec.title} />
                <View style={{ flex: 1, backgroundColor: colors.white }}>
                    <TabView
                        navigationState={this.state}
                        renderScene={this.renderScene}
                        renderTabBar={this._renderTabBar}
                        swipeEnabled={false}
                        onIndexChange={index => this.setState({ index })}
                        initialLayout={{ width: Dimensions.get('window').width }}
                    />
                </View>
            </View>
        )
    }
}

// export default DoiCaLamViec
const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(DoiCaLamViec, mapStateToProps, true)
