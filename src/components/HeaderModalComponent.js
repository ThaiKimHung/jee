import React, { Component } from 'react';
import {
    Image, Text, TouchableOpacity,
    View
} from 'react-native';
import Utils from '../app/Utils';
import { Images } from '../images';
import { colors } from '../styles/color';
import { sizes } from '../styles/size';
import { nstyles } from '../styles/styles';

export default class HeaderModalComponent extends Component {

    render() {
        var { title = 'Title', nthis } = this.props;
        var { onPress = () => Utils.goback(nthis) } = this.props
        return (
            <View style={{ backgroundColor: colors.white }}>
                <View style={[nstyles.nrow, {
                    paddingTop: 9, paddingBottom: 15,
                    justifyContent: 'space-between', alignItems: 'center'
                }]}>
                    <Text  style={{ fontSize: sizes.sText18, fontWeight: 'bold', color: colors.emerald }}>
                        {title}
                    </Text>
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={onPress}>
                        <Image
                            style={nstyles.nIcon24}
                            resizeMode={'contain'}
                            source={Images.JeeCloseModal} />
                    </TouchableOpacity>
                </View>
                <View style={{ backgroundColor: colors.emerald, opacity: 0.3, height: 1 }} />
            </View>
        )
    }
}

