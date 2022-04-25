import React from 'react';
import {
    Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View
} from 'react-native';

let animatedValue = new Animated.Value(0);
let currentValue = 0;

animatedValue.addListener(({ value }) => {
    currentValue = value;
});

const flipAnimation = () => {
    if (currentValue >= 90) {
        Animated.spring(animatedValue, {
            toValue: 0,
            tension: 10,
            friction: 8,
            useNativeDriver: false,
        }).start();
    } else {
        Animated.spring(animatedValue, {
            toValue: 180,
            tension: 10,
            friction: 8,
            useNativeDriver: false,
        }).start();
    }
};

const setInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['360deg', '180deg'],
});

const rotateYAnimatedStyle = {
    transform: [{ rotateY: setInterpolate }],
};

const AlbumArt = ({
    url,
    onPress,

}) => (
    <View style={styles.container}>
        <TouchableOpacity onPress={flipAnimation}>
            <View
                style={[styles.image, {
                    elevation: 10, shadowColor: '#d9d9d9',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 1,
                    shadowRadius: 2,
                    borderRadius: 20,
                    backgroundColor: '#ffffff'
                }]}
            >
                <Animated.Image
                    style={[rotateYAnimatedStyle, styles.image, { borderRadius: 20 }]}
                    source={{ uri: url }}
                    resizeMode={"cover"}
                />
            </View>
        </TouchableOpacity>

    </View >
);

export default AlbumArt;

const { width, height } = Dimensions.get('window');
const imageSize = width - 100;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop: 30,
        paddingLeft: 24,
        paddingRight: 24,
    },
    image: {
        width: imageSize,
        height: imageSize,
    },
    titleText: {
        fontSize: 22,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    buttonStyle: {
        fontSize: 16,
        color: 'white',
        backgroundColor: 'green',
        padding: 5,
        marginTop: 32,
        minWidth: 250,
    },
    buttonTextStyle: {
        padding: 5,
        color: 'white',
        textAlign: 'center',
    },
    imageStyle: {
        width: 150,
        height: 150,
        borderRadius: 6,
    },
})
