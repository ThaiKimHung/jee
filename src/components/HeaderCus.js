import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import PropTypes from 'prop-types'
import { colors, nstyles } from '../styles';
import LinearGradient from 'react-native-linear-gradient'
import { sizes } from '../styles/size';
import { heightStatusBar } from '../styles/styles';
const height = (Platform.OS == 'android' ? nstyles.heightHed + heightStatusBar / 2 : nstyles.heightHed)

const HeaderCus = (props) => {

    const {
        Sleft,
        Smiddle,
        Sright,
        onPressLeft,
        onPressMiddle,
        onPressRight,
        iconLeft,
        iconRight,
        title,
        titleLeft,
        titleRight,
        styleContainer,
        styleTitle,
        colorChange,
        // theme,
        numberOfLines,
        componentTitle
    } = props;
    return (
        <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={colorChange}
            style={[nstyles.nstyles.shadown, {
                paddingTop: nstyles.paddingTopMul,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                height: height,
                // paddingBottom: Platform.OS == 'android' ? 30 : 0
            }, styleContainer]}>
            <View style={[styles.left, { alignItems: 'center', }]}>
                <TouchableOpacity
                    style={[{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10 }]}
                    onPress={onPressLeft}
                >
                    {
                        iconLeft ? <Image source={iconLeft} resizeMode={'contain'} style={[styles.st_icon, Sleft]} /> : null

                    }
                    {
                        titleLeft ?
                            <Text style={[styles.st_titleLeft, Sleft]}>{titleLeft}</Text>
                            : null
                    }
                </TouchableOpacity>
            </View>
            <View style={[styles.middle, { alignItems: 'center' }]}>
                <TouchableOpacity
                    disabled={onPressMiddle ? true : false}
                    style={[{ flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }, Smiddle]}
                    onPress={onPressMiddle}
                >
                    {componentTitle}
                    {
                        title ? <Text numberOfLines={numberOfLines} style={[styles.st_title, styleTitle]}>{title}</Text> : null
                    }
                </TouchableOpacity>


            </View>
            <View style={[styles.right,]}>
                <TouchableOpacity
                    style={[{ flex: 1, alignItems: 'center', justifyContent: 'center', }]}
                    onPress={onPressRight}
                >
                    {
                        iconRight ? <Image source={iconRight} resizeMode={'contain'} style={[styles.st_iconRight, Sright]} /> : null

                    }
                    {
                        titleRight ?
                            <Text style={[styles.st_titleLeft, Sright]}>{titleRight}</Text>
                            : null
                    }
                </TouchableOpacity>

            </View>
        </LinearGradient>
    );

}
const styles = StyleSheet.create({
    left: { maxWidth: 70, alignItems: 'center', justifyContent: 'center', width: 70 },
    middle: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    right: { maxWidth: 70, alignItems: 'center', justifyContent: 'center', width: 70 },
    st_title: {
        fontSize: sizes.sText16,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    st_icon: {
        width: 22,
        height: 22
    },
    st_iconRight: {
        width: 22,
        height: 22
    },
    st_titleLeft: {
        fontSize: sizes.sText14,
        fontWeight: 'bold',
        color: colors.white,
    },
    st_titleRight: {
        fontSize: sizes.sText12
    }
})
HeaderCus.propTypes = {
    Sleft: PropTypes.object,
    Smiddle: PropTypes.object,
    Sright: PropTypes.object,
    onPressLeft: PropTypes.func,
    onPressMiddle: PropTypes.func,
    onPressRight: PropTypes.func,
    iconLeft: PropTypes.any,
    iconRight: PropTypes.any,
    title: PropTypes.string,
    titleLeft: PropTypes.string,
    titleRight: PropTypes.string,
    styleContainer: PropTypes.string,
    styleTitle: PropTypes.object,
    colorChange: PropTypes.array,
    numberOfLines: PropTypes.number,
    componentTitle: PropTypes.any

}
HeaderCus.defaultProps = {
    Sleft: {},
    Smiddle: {},
    Sright: {},
    onPressLeft: () => { },
    onPressMiddle: () => { },
    onPressRight: () => { },
    iconLeft: '',
    iconRight: '',
    title: '',
    titleLeft: '',
    titleRight: '',
    styleContainer: '',
    styleTitle: '',
    colorChange: [colors.black_header, colors.black_header],
    numberOfLines: 2,
    componentTitle: null
};

export default HeaderCus
