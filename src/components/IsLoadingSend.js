import React from 'react';
import { ActivityIndicator, Dimensions, View, Text, Animated } from 'react-native';
import { colors } from '../styles';
import LottieView from 'lottie-react-native';
import { Width } from '../styles/styles';

const { width, height } = Dimensions.get('window');
export default class IsLoadingSend extends React.PureComponent {
    constructor(props) {
        super(props);
        nthisLoading = this;
        this.state = {
            isLoading: false,
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
        };
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
    }
    show(marginVer = 0, marginHor = 0) {
        this.setState({
            isLoading: true,
            top: marginVer,
            bottom: marginVer,
            left: marginHor,
            right: marginHor
        });
    }

    hide = () => {
        this.setState({ isLoading: false });
    }

    render() {
        return (
            this.state.isLoading ?
                <View style={{
                    justifyContent: 'center', alignItems: 'center',
                    position: 'absolute', left: this.state.left,
                    right: this.state.right, bottom: this.state.bottom, top: this.state.top
                }}>
                    <View style={{
                        opacity: 0.3, position: 'absolute', left: 0, top: 0, bottom: 0, right: 0,
                        backgroundColor: colors.black_50
                    }} />
                    <View style={{
                        justifyContent: 'center', alignItems: 'center', width: 100, height: 100,
                        borderRadius: 9999,
                    }}>
                        <LottieView style={{ height: Width(50) }} source={require('../images/lottieJee/loadingSend.json')} autoPlay loop />
                    </View>
                </View> : null
        );
    }
}