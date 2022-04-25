import { Image, View } from 'react-native'
import React, { Component } from 'react'
import * as Animatable from 'react-native-animatable'
import { Images } from '../../images/index'
import { Width } from '../../styles/styles'

export class LogoAnimation extends Component {
    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}  >
                {/* <Animatable.View animation={'zoomIn'} collapsable={false} easing="ease-out" duration={700} > */}
                <Animatable.View animation={'pulse'} collapsable={false} easing="ease-out" iterationCount="infinite">
                    <Image source={Images.ImageJee.iclogoApp} style={{ width: Width(110), height: Width(110) }}></Image>
                </Animatable.View>
                {/* </Animatable.View> */}
            </View >
        )
    }
}

export default LogoAnimation