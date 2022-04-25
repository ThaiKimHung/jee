import React, { Component } from 'react';
import { View, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import { Width } from '../../styles/styles';

export default class ListEmptyLottie_Social_Group extends Component {
    render() {
        const { textempty, style = {} } = this.props;
        return (
            <View style={{
                justifyContent: 'center', alignItems: 'center'
            }}>
                <LottieView style={{ height: Width(80) }} source={require('../../images/lottieJee/EmptySocialGroup.json')} autoPlay loop />
                <Text style={{ textAlign: "center", fontSize: 20, fontWeight: "500" }}>{this.props.textempty} </Text>
            </View>
        );
    }
}
