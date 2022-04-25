import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Animated, Dimensions, PanResponder, Platform, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper';
import Utils from '../app/Utils';
import { colors } from '../styles';
import { Height } from '../styles/styles';

const { width: deviceWidth } = Dimensions.get('window');
const CONTAINER_MARGIN_TOP = (
    Platform.OS === 'ios'
        ?
        isIphoneX() ? 44 : 20
        :
        10);//+ 10);  // Just to add a bit more padding

const slideOffsetYToTranslatePixelMapping = {
    inputRange: [0, 1],
    outputRange: [-150, 0]
};

const HORIZONTAL_MARGIN = 8;

export const swipeDirections = {
    SWIPE_UP: 'SWIPE_UP',
    SWIPE_DOWN: 'SWIPE_DOWN',
    SWIPE_LEFT: 'SWIPE_LEFT',
    SWIPE_RIGHT: 'SWIPE_RIGHT'
};
const swipeConfig = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 60,
    gestureIsClickThreshold: 5
};
function isValidSwipe(velocity, velocityThreshold, directionalOffset, directionalOffsetThreshold) {
    return Math.abs(velocity) > velocityThreshold && Math.abs(directionalOffset) < directionalOffsetThreshold;
}

const getAnimatedContainerStyle = ({ containerSlideOffsetY, containerDragOffsetY, containerScale, }) => {
    // Map 0-1 value to translateY value
    const slideInAnimationStyle = {
        transform: [
            // { translateY: containerSlideOffsetY.interpolate(slideOffsetYToTranslatePixelMapping) },
            { translateY: containerDragOffsetY },
            { scale: containerScale },
        ],
    };

    // Combine with original container style
    const animatedContainerStyle = [
        styles.popupContainer,
        slideInAnimationStyle,
    ];

    return animatedContainerStyle;
};

class ComponentModal extends Component {

    static propTypes = {
        renderPopupContent: PropTypes.func,
    }

    constructor(props) {
        super(props);
        this.swipeConfig = Object.assign(swipeConfig, props.config);
        // nthisPush = this;
        this.state = {
            containerSlideOffsetY: new Animated.Value(0),
            slideOutTimer: null,
            containerDragOffsetY: new Animated.Value(0),
            opacityT: new Animated.Value(1),
            containerScale: new Animated.Value(1),
            faceOpacity: new Animated.Value(1),
            onPressAndSlideOut: null,
            appIconSource: null,
            appTitle: null,
            timeText: null,
            title: null,
            body: null,
            slideOutTime: null,
        };
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (e, gestureState) => true,
            onMoveShouldSetPanResponder: (e, gestureState) => true,
            onPanResponderGrant: this._onPanResponderGrant,
            onPanResponderMove: this._onPanResponderMove,
            onPanResponderRelease: this._onPanResponderRelease,
        });
    }
    _onPanResponderGrant = (e, gestureState) => {
        this.onPressInFeedback();
    }
    _onPanResponderMove = (e, gestureState) => {
        const { containerDragOffsetY, faceOpacity } = this.state;
        if (gestureState.dy > 0) {
            containerDragOffsetY.setValue(gestureState.dy);
            Animated.timing(
                faceOpacity,
                {
                    toValue: 0.9,
                    duration: 0,
                }
            ).start();
        }
    }
    _onPanResponderRelease = (e, gestureState) => {
        Utils.nlog("gia tri state dx", gestureState)
        const swipeDirection = this._getSwipeDirection(gestureState);
        var kiemtra = this._triggerSwipeHandlers(swipeDirection, gestureState);
        const { onPressAndSlideOut, containerDragOffsetY, faceOpacity } = this.state;
        if (kiemtra != -1) {
            this.onPressOutFeedback();
            if (containerDragOffsetY._value > ((Height(100) - gestureState.y0) / 2)) {
                containerDragOffsetY.setValue(Height(100));
                Utils.goback(this);

            } else {
                containerDragOffsetY.setValue(0);
                Animated.timing(
                    faceOpacity,
                    {
                        toValue: 1,
                        duration: 0,
                    }
                ).start();
            }
        } else {
            containerDragOffsetY.setValue(1000);
            // Animated.parallel([

            // ])
            Animated.timing(
                faceOpacity,
                {
                    toValue: 0,
                    duration: 0,
                }
            ).start();
            Utils.goback(this);
        }
    }
    _triggerSwipeHandlers(swipeDirection, gestureState) {
        const { onSwipe, onSwipeUp, onSwipeDown, onSwipeLeft, onSwipeRight } = this.props;
        const { SWIPE_LEFT, SWIPE_RIGHT, SWIPE_UP, SWIPE_DOWN } = swipeDirections;
        onSwipe && onSwipe(swipeDirection, gestureState);
        if (swipeDirection == SWIPE_DOWN) {
            return -1;
        }
    }
    _getSwipeDirection(gestureState) {
        const { SWIPE_LEFT, SWIPE_RIGHT, SWIPE_UP, SWIPE_DOWN } = swipeDirections;
        const { dx, dy } = gestureState;
        if (this._isValidHorizontalSwipe(gestureState)) {
            return (dx > 0)
                ? SWIPE_RIGHT
                : SWIPE_LEFT;
        } else if (this._isValidVerticalSwipe(gestureState)) {
            return (dy > 0)
                ? SWIPE_DOWN
                : SWIPE_UP;
        }
        return null;
    }
    _isValidHorizontalSwipe(gestureState) {
        const { vx, dy } = gestureState;
        const { velocityThreshold, directionalOffsetThreshold } = this.swipeConfig;
        return isValidSwipe(vx, velocityThreshold, dy, directionalOffsetThreshold);
    }

    _isValidVerticalSwipe(gestureState) {
        const { vy, dx } = gestureState;
        const { velocityThreshold, directionalOffsetThreshold } = this.swipeConfig;
        return isValidSwipe(vy, velocityThreshold, dx, directionalOffsetThreshold);
    }

    render() {
        const {
            show,
            containerSlideOffsetY, containerDragOffsetY, containerScale,
            onPressAndSlideOut, faceOpacity
        } = this.state;
        return (
            < Animated.View style={[{ flex: 1, backgroundColor: colors.backgroundModal, opacity: faceOpacity, }]}
            // onTouchEnd={() => Utils.goback(this)}
            >
                <Animated.View
                    style={getAnimatedContainerStyle({ containerSlideOffsetY, containerDragOffsetY, containerScale })}
                    {...this._panResponder.panHandlers}>
                    <TouchableWithoutFeedback onPress={() => Utils.goback(this)} style={{ backgroundColor: 'white', }}>
                        <View style={{ backgroundColor: colors.white, height: 600, borderTopRightRadius: 20, borderTopLeftRadius: 20 }}>

                        </View>
                    </TouchableWithoutFeedback>
                </Animated.View>
            </Animated.View>
        );
    }

    onPressInFeedback = () => {
        // Show feedback as soon as user press down
        const { containerScale } = this.state;
        Animated.spring(containerScale, { toValue: 1, friction: 1 })
            .start();
    }

    onPressOutFeedback = () => {
        // Show feedback as soon as user press down
        const { containerScale } = this.state;
        Animated.spring(containerScale, { toValue: 1, friction: 1 })
            .start();
    }

    createOnPressWithCallback = (callback) => {
        // return () => {
        //     this.slideOutAndDismiss(200);
        //     if (callback) callback();
        // };
        // this.hide();
        // Utils.goback(this);
    }
    slideIn = (duration) => {
        const { containerSlideOffsetY } = this.state;  // Using the new one is fine
        Animated.timing(containerSlideOffsetY, { toValue: 1, duration: 100, })  // TODO: customize
            .start(({ finished }) => {
                // this.countdownToSlideOut();
            });
    }
    countdownToSlideOut = () => {
        const slideOutTimer = setTimeout(() => {
            this.slideOutAndDismiss();
        }, this.state.slideOutTime);
        this.setState({ slideOutTimer });
    }
    slideOutAndDismiss = (duration) => {
        const { containerSlideOffsetY } = this.state;
        Animated.timing(containerSlideOffsetY, { toValue: 0, duration: 100, })  // TODO: customize
            .start(({ finished }) => {
                // Reset everything and hide the popup
                this.setState({ show: false });
            });
    }
}

const styles = StyleSheet.create({
    popupContainer: {
        position: 'absolute',
        width: deviceWidth,
        left: 0,
        right: 0,
        // top: CONTAINER_MARGIN_TOP,
        bottom: 0,
    },
    popupContentContainer: {
        backgroundColor: 'white',  // TEMP
        borderRadius: 12,
        minHeight: 86,
        // === Shadows ===
        // Android
        elevation: 2,
        // iOS
        shadowColor: '#000000',
        shadowOpacity: 0.5,
        shadowRadius: 3,
        shadowOffset: {
            height: 1,
            width: 0,
        },
    },

    popupHeaderContainer: {
        height: 32,
        backgroundColor: '#F1F1F1',  // TEMP
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        paddingVertical: 6,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },



});





export default ComponentModal
