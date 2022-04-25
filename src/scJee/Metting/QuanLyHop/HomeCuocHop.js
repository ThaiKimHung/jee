import React, { Component } from 'react'
import { Dimensions, Text, View, TouchableOpacity, Image } from 'react-native'
import { Height, nstyles, Width } from '../../../styles/styles'
import HeaderAnimationJee from '../../../components/HeaderAnimationJee'
import Utils from '../../../app/Utils'
import { TabView, SceneMap } from 'react-native-tab-view'
import { Images } from '../../../images'
import HopDaTao from './HopDaTao'
import { colors } from '../../../styles'
import { reText, sizes } from '../../../styles/size'
import { RootLang } from '../../../app/data/locales'
export default class HomeCuocHop extends Component {
    constructor(props) {
        super(props)
        this.state = {
            index: 0,
            routes: [
                { key: 'hopdatao', title: RootLang.lang.JeeMeeting.cuochopcuatoi },
                { key: 'hopthamgia', title: RootLang.lang.JeeMeeting.cuochoptoithamgia },
            ],
        }
    }
    _renderScene = SceneMap({ //type 1 Cuộc họp của tôi, type 2 Cuộc họp tôi tham gia
        hopdatao: () => <HopDaTao nthis={this} type={1} />,
        hopthamgia: () => <HopDaTao nthis={this} type={2} />,
    });
    _renderTabBar = props => {
        var { index = 0 } = props.navigationState
        return (
            <View style={[nstyles.shadowTabTop, { flexDirection: 'row', marginHorizontal: 12, backgroundColor: colors.white, borderRadius: 10, marginTop: 10 }]}>
                {
                    props.navigationState.routes.map((x, i) => {
                        return (
                            <TouchableOpacity
                                key={i.toString()}
                                onPress={() => { this.setState({ index: i }) }}
                                style={{ flex: 1, backgroundColor: i == index ? colors.checkGreen : colors.white, flexDirection: 'row', justifyContent: 'center', borderRadius: 10, paddingVertical: 15 }}>
                                <View
                                    style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontSize: reText(14), color: i == index ? colors.white : colors.colorNoteJee, textAlign: 'center', }}>{x.title}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    })
                }
            </View >)
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: colors.backgroudJeeHR }}>
                <HeaderAnimationJee
                    iconLeft={Images.ImageJee.icGoBack}
                    onPressLeft={() => { Utils.goback(this, null) }}
                    nthis={this} title={RootLang.lang.JeeMeeting.quanlycuochop} />
                <TabView
                    lazy
                    navigationState={this.state}
                    renderScene={this._renderScene}
                    renderTabBar={this._renderTabBar}
                    onIndexChange={index => this.setState({ index })}

                // initialLayout={{ width: Width(100) }}
                />
            </View >
        )
    }
}
