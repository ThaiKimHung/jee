import React, { Component } from 'react';
import { BackHandler, Image, LayoutAnimation, Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { SceneMap, TabView } from 'react-native-tab-view';
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import { RootLang } from '../../../app/data/locales';
import { nkey } from '../../../app/keys/keyStore';
import Utils from '../../../app/Utils';
import HeaderComStackV2 from '../../../components/HeaderComStackV2';
import { Images } from '../../../images';
import { colors } from '../../../styles';
import { nstyles, Width } from '../../../styles/styles';
import HomeCongTy from '../CongTy/HomeCongTy';
import HomeSocial from '../Home/HomeSocial';
import HomeNhom from '../Nhom/HomeNhom';
import HomeTinTuc from '../TinTuc/HomeTinTuc';

class TabHomeSocial extends Component {
    constructor(props) {
        super(props);

        this.state = {
            thongtin_tab: '',
            index: 0,
            routes: [
                { key: 'home', title: 'Home', icon: Images.ImageJee.icHomeSocial },
                { key: 'congty', title: 'Cong Ty', icon: Images.ImageJee.icCongTySocial },
                { key: 'nhom', title: 'Nhom', icon: Images.ImageJee.icNhomSocial },
                { key: 'tintuc', title: 'Tin Tuc', icon: Images.ImageJee.icTinTucSocial },
                // { key: 'timkiem', title: 'Tim Kiem', icon: Images.ImageJee.icTimKiemSocial },
            ],
            re: [],
            listMenu: [],
            scrollToTop: false,
            appCode: [],
            check: false,
        };
        ROOTGlobal.setIndexTab.setIndex = this.checkIndex;
    }

    componentDidMount = async () => {
        BackHandler.addEventListener("hardwareBackPress", this._goback);

        this.setState({
            check: await Utils.ngetStorage(nkey.checkAppCode, false)
        })
    }
    componentWillUnmount() {
        try {
            BackHandler.removeEventListener('hardwareBackPress', this._goback)
        }
        catch (error) {

        }
    }

    _goback = async () => {
        // this.props.navigation.reset({
        //     index: 0,
        //     routes: [{ name: 'sw_HomePage' }],
        // });
        Utils.goback(this, null)
        return true;
    }

    checkIndex = async (item = 0) => {
        await this.setState({ index: item })
    }


    _renderScene = SceneMap({
        home: () => <HomeSocial nthis={this} />,
        congty: () => <HomeCongTy nthis={this} />,
        nhom: () => <HomeNhom nthis={this} />,
        tintuc: () => <HomeTinTuc nthis={this} />,
        // timkiem: () => <TimKiemSocial nthis={this} />

    });



    _renderTabBar = props => {
        LayoutAnimation.easeInEaseOut()
        var { index = 0 } = props.navigationState
        return (<View style={[nstyles.shadowTabTop, {
            height: 50, flexDirection: 'row',
            width: '100%', margin: 1
        }]}>
            {
                props.navigationState.routes.map((x, i) => {
                    return (
                        <TouchableOpacity
                            key={i.toString()}
                            onPress={() => {
                                this.setState({ index: i, scrollToTop: true })

                            }}
                            style={{
                                flex: 1,
                                backgroundColor: colors.white,
                                flexDirection: 'row',
                                height: '100%',
                                borderBottomWidth: i == index ? 2 : 0,
                                borderColor: i == index ? colors.colorTabActiveJeeHR : colors.white

                            }}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <View style={{ flex: 1 }}></View>
                                <View style={{ justifyContent: 'center', alignItems: 'center', width: '60%', }}>
                                    {i == index ? (
                                        <Image
                                            style={[{ tintColor: colors.colorTabActiveJeeHR }]}
                                            source={x.icon}
                                        />
                                    ) : (
                                            <Image
                                                style={[{}]}
                                                source={x.icon}
                                            />
                                        )}
                                    <View style={{ height: 2, backgroundColor: i == index ? colors.colorTabActiveJeeHR : '#fff', }}></View>
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
        var { index } = this.state
        return (
            <>
                {this.state.check == true ? (
                    <View style={[nstyles.ncontainer, { paddingTop: index != 0 && Platform.OS == 'ios' ? 35 : 0, backgroundColor: "white" }]}>
                        {index == 0 ? (
                            <HeaderComStackV2
                                nthis={this} title={RootLang.lang.JeeSocial.tatcabaidang}
                                iconRight={Images.ImageJee.icBoLocSocial}
                                iconLeft={Images.ImageJee.icBack}
                                onPressLeft={() => { this._goback() }}
                                styIconRight={[nstyles.nIconH18W22, {}]}
                                onPressRight={() => { Utils.goscreen(this, 'sc_LocBaiDang') }}
                                styBorder={{
                                    borderBottomColor: colors.black_20_2,
                                    borderBottomWidth: 0.3,

                                }}
                            />
                        ) : (null)}

                        <TabView
                            lazy
                            navigationState={this.state}
                            renderScene={this._renderScene}
                            renderTabBar={this._renderTabBar}
                            onIndexChange={index => this.setState({ index })}
                            initialLayout={{ width: Width(100), padding: 10, }}

                        />
                    </View >
                ) : (
                        Utils.showMsgBoxOK(this, RootLang.lang.thongbaochung.thongbao, RootLang.lang.JeeSocial.bankhongcoquyentruycap, RootLang.lang.thongbaochung.xacnhan, () => this._goback())
                    )}
            </>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabBar: {
        flexDirection: 'row',
        paddingTop: 50,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        padding: 16,
    },
    iconTab: {

        tintColor: 'black'
    }
});

const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});

export default Utils.connectRedux(TabHomeSocial, mapStateToProps, true)

