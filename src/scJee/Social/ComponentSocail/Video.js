import React, { useRef } from 'react';
import { Image, TouchableOpacity, StyleSheet } from 'react-native';
import Video from 'react-native-video';
import Utils from '../../../app/Utils';
import { ImgComp } from '../../../images/ImagesComponent';
import { colors } from '../../../styles';
import { nwidth, Width } from '../../../styles/styles';

const VideoComponent = (props) => {
    const key = props.key ? props.key : ''
    const uri = props.uri ? props.uri : ''
    const onpress = props.onpress ? props.onpress : () => { }
    const _video = useRef()
    return (
        <TouchableOpacity key={key}
            style={styles.container}
            onPress={() => onpress()}>
            <Video
                ref={_video}
                source={{ uri: uri }}   // Can be a URL or a local file.
                resizeMode="cover"           // Fill the whole screen at aspect ratio.
                paused={true}
                onError={(error) => Utils.nlog(error, uri)}// Callback when video cannot be loaded
                style={styles.video}
                hideShutterView={true}
                bufferConfig={{
                    minBufferMs: 0,
                    maxBufferMs: 0,
                    bufferForPlaybackMs: 0,
                    bufferForPlaybackAfterRebufferMs: 0
                }}
                minLoadRetryCount={5}
                maxBitRate={2000000}
                onLoad={() => { _video.current.seek(0) }} />
            <TouchableOpacity
                style={styles.touch}
                activeOpacity={0.9}
                onPress={() => onpress()}>
                <Image
                    style={styles.image}
                    resizeMode='contain'
                    source={ImgComp.mediaPlayButton}
                />
            </TouchableOpacity>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        width: (nwidth - 30) / 3, height: (nwidth - 30) / 3, marginRight: 5, marginTop: 5,
        borderColor: '#E8E8E9', borderWidth: 0.5, backgroundColor: colors.black_20_2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.25,
        shadowRadius: 1,
        elevation: 5,
    },
    image: {
        width: 35, height: 35
    },
    video: {
        width: (nwidth - 30) / 3, height: (nwidth - 30) / 3,
    },
    touch: {
        position: 'absolute', top: 0, right: 0, left: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'
    }
})

export default VideoComponent