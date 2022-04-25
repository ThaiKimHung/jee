import React, { Component } from 'react';
import { View, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import { Width } from '../../styles/styles';
import { colors } from '../../styles';

export default class ListEmptyLottie extends Component {
    render() {
        const { textempty, style = {} } = this.props;
        return (
            <View style={{

            }}>
                <LottieView style={{ height: Width(100) }} source={require('../../images/lottieJee/Empty.json')} autoPlay loop />
                <Text style={{ textAlign: "center", fontSize: 20, fontWeight: "500", color: colors.black_50 }}>{textempty}</Text>
            </View>
        );
    }
}
