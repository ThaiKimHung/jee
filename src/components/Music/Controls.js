import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
} from 'react-native';
import { Images } from '../../images';
import { colors } from '../../styles';

const Controls = ({
    paused,
    shuffleOn,
    repeatOn,
    onPressPlay,
    onPressPause,
    onBack,
    onForward,
    onPressShuffle,
    onPressRepeat,
    forwardDisabled,
}) => (
    <View style={styles.container}>
        <View style={{ width: 40 }} />
        <TouchableOpacity onPress={onBack}>

            <Image style={{ tintColor: colors.black, width: 50, height: 50 }} source={Images.ImageJee.icLeftArrowMusic} />
        </TouchableOpacity>
        <View style={{ width: 20 }} />
        {!paused ?
            <TouchableOpacity onPress={onPressPause}>
                <View style={styles.playButton}>
                    <Image style={{ tintColor: colors.black, width: 50, height: 50 }} source={Images.ImageJee.icPauseMusic} />
                </View>
            </TouchableOpacity> :
            <TouchableOpacity onPress={onPressPlay}>
                <View style={styles.playButton}>
                    <Image style={{ tintColor: colors.black, width: 50, height: 50 }} source={Images.ImageJee.icPlay} />
                </View>
            </TouchableOpacity>
        }
        <View style={{ width: 20 }} />
        <TouchableOpacity onPress={onForward}
            disabled={forwardDisabled}>
            <Image style={{ tintColor: colors.black, width: 50, height: 50 }} source={Images.ImageJee.icRightArrowMusic} />

        </TouchableOpacity>
        <View style={{ width: 40 }} />

    </View>
);

export default Controls;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 8,
    },
    playButton: {
        height: 80,
        width: 80,
        borderRadius: 72 / 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondaryControl: {
        height: 18,
        width: 18,
    },
    off: {
        opacity: 0.30,
    }
})
