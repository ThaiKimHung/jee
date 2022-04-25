import React, { Component } from 'react';
import { View, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import { Width } from '../../styles/styles';
import { colors } from '../../styles';

export default class ListEmptyLottie_SocialComment extends Component {
    render() {
        const { textempty, style = {} } = this.props;
        return (
            <View style={{
                justifyContent: 'center', alignItems: 'center'
            }}>
                <LottieView style={{ height: Width(75) }} source={require('../../images/lottieJee/EmptyComment.json')} autoPlay loop />
                <Text style={{ textAlign: "center", fontSize: 20, fontWeight: "500", color: colors.black_20 }}>{this.props.textempty}</Text>
            </View>
        );
    }
}
