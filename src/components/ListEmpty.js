import React, { Component } from 'react';
import { Text } from 'react-native';
import { colors } from '../styles/color';

export default class ListEmpty extends Component {
    render() {
        const { textempty, style = {} } = this.props;
        return (
            <Text  style={[{
                textAlign: 'center', marginVertical: 20, color: colors.black_70,
                width: '100%', fontWeight: 'bold', opacity: 0.7
            }, style]}>{textempty}</Text>
        );
    }
}
