import LottieView from 'lottie-react-native'
import React, { Component } from 'react'
import { Animated, Platform, Text, View, BackHandler } from 'react-native'
import * as Animatable from 'react-native-animatable'
import Utils from '../../../src/app/Utils'
import { colors } from '../../../src/styles/color'
import { reText } from '../../../src/styles/size'
import { nstyles, Width } from '../../../src/styles/styles'
import { RootLang } from '../../app/data/locales'



export class Devoloping extends Component {
    constructor(props) {
        super(props)
        this.state = {
            opacity: new Animated.Value(0),
        }
    }

    componentDidMount() {
        this._startAnimation(0.4)
        this.backHander = BackHandler.addEventListener('hardwareBackPress', this.backHanderButton)
    }
    componentWillUnmount() {
        this.backHander.remove()
    }
    backHanderButton = () => {
        this._goback()
        return true
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
                            <LottieView style={{ height: Width(70), opacity: 1, alignSelf: "center" }} source={require('../../images/lottieJee/devoloping.json')} autoPlay loop />
                            <Text style={{ textAlign: "center", fontSize: reText(20), marginTop: 30, color: colors.textTabActive, paddingLeft: 20 }}>{"Tính năng đang phát triển."}</Text>

                        </View>

                    </View >
                </Animatable.View>
            </View >
        )
    }
}

export default Devoloping


