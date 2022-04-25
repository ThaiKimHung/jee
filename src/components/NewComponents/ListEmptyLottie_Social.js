import React, { Component } from 'react';
import { View, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import { Width } from '../../styles/styles';
import { colors } from '../../styles';

export default class ListEmptyLottie_Social extends Component {
    render() {
        const { textempty, style = {}, styleText = {} } = this.props;
        return (
            <View style={[style, {
                justifyContent: 'center', alignItems: 'center',
            }]}>
                <LottieView style={{ height: Width(100) }} source={require('../../images/lottieJee/emptySocial.json')} autoPlay loop />
                <Text style={[styleText, { textAlign: "center", fontSize: 20, fontWeight: "500", color: colors.gray1, }]}>{this.props.textempty}</Text>
            </View>
        );
    }
}
