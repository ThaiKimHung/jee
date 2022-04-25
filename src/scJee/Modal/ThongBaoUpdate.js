import LottieView from 'lottie-react-native'
import React, { Component } from 'react'
import { Animated, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import * as Animatable from 'react-native-animatable'
import Dash from 'react-native-dash'
import { colors } from '../../../src/styles/color'
import { reText } from '../../../src/styles/size'
import { Height, nstyles, Width } from '../../../src/styles/styles'
import { RootLang } from '../../app/data/locales'
import InAppUpdate from '../../app/InAppUpdate'
import Utils from '../../../src/app/Utils'



export class ThongBaoUpdate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            opacity: new Animated.Value(0),
            item: Utils.ngetParam(this, 'item'),
            link: Utils.ngetParam(this, 'linkStore'),
            android: false
        }
    }

    componentDidMount() {
        this._startAnimation(0.4)
    }

    _startAnimation = (value) => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: value,
                duration: 300
            }).start();
        }, 350);
    };

    _goback = () => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: 0,
                duration: 250
            }).start(() => {
                Utils.goback(this)
            });
        }, 100);
    }

    _capNhat = (linkstore) => {
        let { android } = this.state
        if (android) {
            try {
                InAppUpdate.checkUpdate()
            } catch (error) {
            }

        }
        else
            Platform.OS == 'android' ? this.setState({ android: true }) : this.setState({ android: false }, () => { Utils.openUrl(linkstore); })
    }

    render() {
        let { opacity, item, android, link } = this.state
        return (
            <View style={[nstyles.ncontainer, {
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'transparent',

            }]}
            >
                <Animated.View onTouchEnd={this._goback} style={{
                    position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
                    backgroundColor: 'black', opacity,
                }} />

                <Animatable.View animation={'zoomInDown'} style={{
                    width: Width(80),
                    height: Width(110),
                    backgroundColor: colors.colorBGHome,
                    borderRadius: 15
                }}>

                    <View style={{ alignSelf: "center", }}>
                        <View style={{ flex: 1, height: Width(45), }}>
                            <Text style={{ position: "absolute", fontSize: reText(20), marginTop: 30, color: colors.textTabActive, paddingLeft: 20 }}>{RootLang.lang.thongbaochung.thongbaocapnhat}</Text>
                            <Text style={{ position: "absolute", fontSize: reText(12), marginTop: 60, opacity: 0.7, paddingLeft: 20 }}>{RootLang.lang.thongbaochung.phienban} {Platform.OS == 'ios' ? String(item.verSion).split(" ").slice(1).toString() : item.verSion}</Text>
                            <LottieView style={{ height: Width(70), opacity: 0.6, bottom: 15, alignSelf: "center" }} source={require('../../../src/images/lottie/city.json')} autoPlay loop />
                        </View>
                        <View style={{ flex: 1 }}>
                            <ScrollView
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ flexGrow: 1 }}
                                style={{ flex: 1, padding: 20, alignContent: "center", alignSelf: "center" }}>
                                {
                                    item.release.map((e) => {
                                        return <Text style={{ textAlignVertical: "center", fontSize: reText(14), lineHeight: 20 }}>{e}</Text>
                                    })}
                            </ScrollView>
                            <View style={{
                            }}>
                                <Dash
                                    dashColor={colors.colorTextBTGray}
                                    style={{ width: '90%', height: 0.8, paddingTop: 10, alignSelf: "center", }}
                                    dashGap={0}
                                    dashThickness={0.5} />
                                <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', }}>
                                    <TouchableOpacity onPress={() => android ? this._capNhat(link) : this._goback()} activeOpacity={0.5}
                                        style={{
                                            alignItems: 'center', justifyContent: 'center',
                                            width: Width(40),
                                        }}>
                                        <Text style={{ fontSize: reText(14), padding: 15, }}>{android ? RootLang.lang.thongbaochung.capnhattrongapp : RootLang.lang.thongbaochung.desau}</Text>
                                    </TouchableOpacity>

                                    <View style={{ alignSelf: "center" }}>
                                        <Dash
                                            dashColor={colors.colorTextBTGray}
                                            style={{ height: Height(4), flexDirection: 'column' }}
                                            dashGap={0}
                                            dashThickness={0.5} />
                                    </View>
                                    <TouchableOpacity onPress={() => android ? Utils.openUrl(link) : this._capNhat(link)} activeOpacity={0.5}
                                        style={{
                                            alignItems: 'center', justifyContent: 'center',
                                            width: Width(40),
                                        }}>
                                        <Text style={{ fontSize: reText(14), padding: 15, color: colors.textTabActive, fontWeight: '600' }}>{android ? RootLang.lang.thongbaochung.capnhatgoogle : RootLang.lang.thongbaochung.capnhat}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View >
                        </View>
                    </View >
                </Animatable.View>
            </View >
        )
    }
}

export default ThongBaoUpdate


