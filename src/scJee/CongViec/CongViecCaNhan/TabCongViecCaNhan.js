import React, { Component } from 'react';
import {
    Dimensions, SafeAreaView, Text, TouchableOpacity, View
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
import ChuaHoanThanh from './ChuaHoanThanh/ChuaHoanThanh';
import ListCVQuyTrinh from '../CongViecQuyTrinh/ListCVQuyTrinh';
import { getListWorkQuyTrinh } from '../../../apis/JeePlatform/API_JeeWork/apiCongViecQuyTrinh'
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import moment from 'moment';

class TabCongViecCaNhan extends Component {
    constructor(props) {
        super(props);
        this.type = Utils.ngetParam(this, 'type', 0)
        this.state = {
            index: 0,
            routes: [
                { key: 'ChuaHoanThanh', title: 'congviecduocgiao', }, //Giữ tên cũ, hiện tại là cv được giao
                { key: 'ListCVQuyTrinh', title: 'congviectheoquitrinh' } //Công việc theo quy trình
            ],
            isRef: false,
        }
    }

    componentDidMount = () => {
        this._loadListWorkQuyTrinh()
    }
    _loadListWorkQuyTrinh = async () => {
        var params = {
            isHoanThanh: this.type == 0 || this.type == 1 ? true : false,
            isHetHan: this.type == 0 || this.type == 1 ? false : true,
            idType: 4,
            from: moment().add(-6, 'months').format('DD/MM/YYYY'),
            to: moment().format('DD/MM/YYYY'),
        }
        Utils.nlog(params);
        const res = await getListWorkQuyTrinh(params) //get để lấy totalcount, không quan trọng mấy phần khác
        if (res.status == 1) {
            this.props.SetCountProceduralWork(res?.page?.TotalCount || 0)
        } else {
            UtilsApp.MessageShow('Thông báo', res?.error?.message || 'Lỗi truy xuất dữ liệu', 2)
        }
    }

    renderScene = ({ route }) => {
        switch (route.key) {
            case 'ChuaHoanThanh':
                return (
                    <ChuaHoanThanh nthis={this} />
                )
            case 'ListCVQuyTrinh':
                return (
                    <ListCVQuyTrinh nthis={this} />
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
                    let count = i == 0 ? this.props.count : this.props.count_proceduralWokd
                    let check = (i == 0 && this.props.count == 0) || (i == 1 && this.props.count_proceduralWokd == 0) ? true : false
                    return (
                        <TouchableOpacity
                            key={i.toString()}
                            onPress={() => { this.setState({ index: i }) }}
                            style={{
                                flex: 1, backgroundColor: 'white',
                                flexDirection: 'row', paddingVertical: 5
                            }}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <View style={{ flex: 1 }}></View>
                                <View style={{}}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text numberOfLines={1} style={{
                                            color: i == index ? colors.colorTabActiveJeeHR : colors.black_20,
                                            textAlign: 'center', paddingVertical: 6,
                                            fontFamily: fonts.Helvetica, fontSize: i == index ? reText(15) : reText(14),
                                            maxWidth: Width(42)
                                        }}>{RootLang.lang.scCongViecCaNhan[`${x.title}`]}</Text>
                                        <View style={{ width: count.length > 2 ? Width(8) : Width(6), height: Width(6), borderRadius: Width(5), backgroundColor: check ? colors.black_20 : colors.redtext, justifyContent: 'center', alignItems: 'center', marginLeft: 2, alignSelf: 'center' }}>
                                            <Text style={{ color: colors.white, fontSize: count.length > 2 ? reText(13) : reText(14) }}>{count}</Text>
                                        </View>
                                    </View>
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
                    onPressLeft={() => {
                        Utils.goback(this, null)
                        ROOTGlobal.GetSoLuongNhacNho.GetSLNhacNho()
                    }}
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
export default Utils.connectRedux(TabCongViecCaNhan, mapStateToProps, true)