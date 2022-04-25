import React, { useRef, forwardRef, useImperativeHandle } from 'react'
import { useNavigation } from '@react-navigation/native'
import { View, Text, Image, TouchableOpacity, Animated, StyleSheet, Platform } from 'react-native'
import { Images } from '../../images'
import { sizes } from '../../styles/size'
import { heightHed, nstyles, paddingTopMul } from '../../styles/styles'

const HeaderAnimation = (props, ref) => {
    const {
        icLeft = Images.ImageJee.icGoBack, icRight, styleIconLeft, styleIconRight, label, heightOnScroll = 300, numberOfLines = 20,
        onPressLeft, onPressRight
    } = props
    const navigation = useNavigation()

    const firstOnScroll = useRef(new Animated.Value(1))
    const numberOfLinesHeader = firstOnScroll.current.interpolate({
        inputRange: [1, heightOnScroll],
        outputRange: [numberOfLines, 1],
        extrapolateLeft: 'clamp'
    });
    const _onScroll = (e) => {
        Animated.timing(firstOnScroll.current, {
            toValue: e.nativeEvent.contentOffset.y > heightOnScroll ? heightOnScroll : e.nativeEvent.contentOffset.y,
            duration: 0
        }).start();
    }
    useImperativeHandle(ref, () => ({
        onScroll: _onScroll,
    }));

    return (
        <View style={styles.container}>
            <View style={styles.containerChildren}>
                <TouchableOpacity style={styles.btnLeft} onPress={onPressLeft}>
                    <Image source={icLeft} style={[styles.icLeft, styleIconLeft]} />
                </TouchableOpacity>
                <Animated.Text
                    numberOfLines={numberOfLinesHeader}
                    style={styles.txtLable}
                >
                    {label}
                </Animated.Text>
                <TouchableOpacity style={styles.btnLeft} onPress={onPressRight}>
                    <Image source={icRight} style={[styles.icLeft, styleIconRight]} />
                </TouchableOpacity>
            </View>
        </View >
    )
}
const styles = StyleSheet.create({
    container: {
        paddingTop: paddingTopMul,
        backgroundColor: 'white'
    },
    containerChildren: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10
    },
    btnLeft: {
        padding: 5,
    },
    icLeft: {
        ...nstyles.nIcon30,
    },
    txtLable: {
        fontSize: sizes.sText15,
        lineHeight: sizes.sText24,
        textAlign: 'center',
        maxWidth: '70%',
    }
})
export default forwardRef(HeaderAnimation)