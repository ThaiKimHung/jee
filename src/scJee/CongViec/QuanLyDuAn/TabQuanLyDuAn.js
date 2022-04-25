import React, { Component } from 'react';
import { Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SceneMap, TabView } from 'react-native-tab-view';
import { RootLang } from '../../../app/data/locales';
import Utils from '../../../app/Utils';
import HeaderComStack from '../../../components/HeaderComStack';
import IsLoading from '../../../components/IsLoading';
import { colors } from '../../../styles';
import { reText, sizes } from '../../../styles/size';
import { Height, nstyles, Width } from '../../../styles/styles';
import DangThamGia from './DangThamGia';
import DuocTaoBoiToi from './DuocTaoBoiToi';
import TatCa from './TatCa';

class TabQuanLyDuAn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            editable: false,
            tencongviec: '',
            routes: [
                { key: 'dangthamgia', title: RootLang.lang.JeeWork.toithamgia },
                { key: 'duocbaoboitoi', title: RootLang.lang.JeeWork.toiquanly },
                { key: 'tatca', title: RootLang.lang.JeeWork.quahan },
            ],
        };
    }

    _renderScene = SceneMap({
        dangthamgia: () => <DangThamGia nthis={this} />,
        duocbaoboitoi: () => <DuocTaoBoiToi nthis={this} />,
        tatca: () => <TatCa nthis={this} />,
    });

    _renderTabBar = props => {
        var { index = 0 } = props.navigationState
        return (
            <View style={[nstyles.shadowTabTop, {
                height: Height(6), flexDirection: 'row',
                width: Width(100),
            }]}>
                {
                    props.navigationState.routes.map((x, i) => {
                        return (
                            <TouchableOpacity
                                key={i.toString()}
                                onPress={() => { this.setState({ index: i }) }}
                                style={{
                                    flex: 1,
                                    backgroundColor: colors.white,
                                    flexDirection: 'row',
                                    // height: Height(6),
                                    borderBottomWidth: i == index ? 2 : 0,
                                    borderColor: i == index ? '#0E72D8' : colors.white,
                                    width: Width(100)

                                }}>
                                <View style={{ flex: 1, flexDirection: 'row', width: Width(100) }}>
                                    <View style={{ flex: 1 }}></View>
                                    <View style={{ justifyContent: 'center', alignItems: 'center', width: Width(25), maxWidth: Width(30) }}>

                                        {i == index ? (

                                            <Text style={{ fontWeight: 'bold', fontSize: reText(14), color: '#0E72D8', textAlign: 'center', }}>{x.title}</Text>

                                        ) : (
                                                <Text style={{ fontSize: reText(14), textAlign: 'center', color: colors.colorTitleNew }}>{x.title}</Text>
                                            )}
                                        <View style={{ height: 2, backgroundColor: i == index ? '#0E72D8' : '#fff' }}></View>
                                    </View>
                                    <View style={{ flex: 1 }}></View>
                                </View>
                            </TouchableOpacity>
                        )
                    })
                }
            </View >)
    }

    render() {
        return (
            <View style={[nstyles.ncontainer, { width: Width(100), backgroundColor: "white" }]}>
                <HeaderComStack onPressLeft={() => { Utils.goback(this, null) }}
                    nthis={this} title={RootLang.lang.JeeWork.quanlyduanphongban}
                />
                <TabView
                    lazy
                    navigationState={this.state}
                    renderScene={this._renderScene}
                    renderTabBar={this._renderTabBar}
                    onIndexChange={index => this.setState({ index })}
                    initialLayout={{ width: Dimensions.get('window').width }}
                />
            </View >
        );
    }
};

const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});

const styles = StyleSheet.create({
});

export default Utils.connectRedux(TabQuanLyDuAn, mapStateToProps, true)


