import React from 'react';
import { ActivityIndicator, Dimensions, View, Text, Animated } from 'react-native';
import { colors } from '../styles';
import LottieView from 'lottie-react-native';
import { Width } from '../styles/styles';

const { width, height } = Dimensions.get('window');
export default class IsLoadingBasic extends React.PureComponent {
    constructor(props) {
        super(props);
        // isLoading = this;
        nthisIsLoading = this;
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
    hide() {
        this.setState({ isLoading: false });
    }

    render() {
        return (
            this.state.isLoading ?
                <View style={{
                    alignItems: 'center', position: 'absolute', paddingTop: 5,
                    left: this.state.left, right: this.state.right, bottom: this.state.bottom, top: this.state.top
                }}>
                    <LottieView
                        speed={3}
                        style={{ height: 60 }}
                        source={require('../images/lottieJee/loadingBasic.json')}
                        autoPlay loop />
                </View> : null
        );
    }
}