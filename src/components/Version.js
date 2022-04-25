import React, { Component } from 'react';
import { Text } from 'react-native';
import { nstyles } from '../styles/styles';


export default class Version extends Component {
    render() {
        return (
            <Text  style={[nstyles.ntextSma, { marginBottom: 10, fontSize: 12, alignSelf: 'center' }]}>{this.props.name}</Text>
        );
    }
}