import React from 'react';
import { ActivityIndicator, Dimensions, View, Text, Animated, Image } from 'react-native';
import { colors } from '../styles';
import LottieView from 'lottie-react-native';
import { nWidth, Width } from '../styles/styles';
import { Images } from '../images';

const { width, height } = Dimensions.get('window');
export default class IsLoading extends React.PureComponent {
    constructor(props) {
        super(props);
        nthisLoading = this;
        this.state = {
            isLoading: false,
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            animation: new Animated.Value(0)
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
    componentDidMount() {
        this.nhay(true)
    }
    nhay = (isNhay) => {
        Animated.timing(this.state.animation, {
            toValue: isNhay ? 10 : 0,
            duration: 500,
            useNativeDriver: true
        }).start(() => {
            this.nhay(!isNhay)
        })
    }
    render() {
        return (
            this.state.isLoading ?
                <View style={{
                    justifyContent: 'center', alignItems: 'center', position: 'absolute', backgroundColor: colors.black_10,
                    right: this.state.right, bottom: this.state.bottom, top: this.state.top, left: this.state.left,
                }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Animated.View style={{ transform: [{ translateY: this.state.animation }], elevation: 2, shadowColor: 'white', shadowOpacity: 0.5, shadowRadius: 3, shadowOffset: { height: 1, width: 0, }, }}>
                            <Image source={Images.ImageJee.iclogoText} style={{ width: 155, height: 22 }}></Image>
                        </Animated.View>
                        <LottieView speed={1} style={{ height: 70, marginTop: -2 }} source={require('../images/lottieJee/loaddingJee.json')} autoPlay loop />
                    </View>
                </View> : null
        );
    }
}