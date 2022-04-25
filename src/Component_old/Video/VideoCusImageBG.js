import React, { Component, useState } from 'react';
import { Text, View, ActivityIndicator, Image } from 'react-native';
import Video from 'react-native-video';
import Utils from '../../app/Utils';
import { colors } from '../../styles';
import { Height, Width } from '../../styles/styles';
import LottieView from 'lottie-react-native';
const VideoCusImageBG = React.forwardRef((props, ref) => {
    const [loading, setloading] = useState(true)
    return (
        <View style={{ ...props.style }}>
            <Video
                onLoadStart={e => {
                    // Utils.nlog('giá tị onload <<>><<<<<>><<<<>>><<<<<<>', e);
                }}
                ref={ref}
                onReadyForDisplay={e => {
                    setloading(false)
                }}
                style={{
                    width: 100,
                    height: 100,
                    borderRadius: 5
                }}
                // resizeMode="cover"
                paused={true}
                {...props}
            />
            <View
                style={{
                    backgroundColor: colors.backgroundModal,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 100,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 10
                }}
            >
                <Image source={{ uri: props.url }} style={{ width: Width(100), height: Height(40) }}></Image>
                <LottieView
                    source={require('../../src/images/playmusic.json')}
                    style={{ width: Width(50) }}
                    loop={true}
                    autoPlay={true}
                />
            </View>
        </View>
    );

})

export default VideoCusImageBG;
