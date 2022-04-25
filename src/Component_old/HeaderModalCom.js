import React, { Component } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Images } from '../images';
import { colors, fonts, sizes } from '../styles';
import { Width } from '../styles/styles';

class HeaderModalCom extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render() {
        const { onPress, title } = this.props
        return (
            <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', }}>
                <View style={{ flexDirection: 'row', paddingTop: 7 }}>
                    <TouchableOpacity onPress={onPress} >
                        <Image
                            source={Images.icGoBackback}
                            style={{
                                height: Width(7), width: Width(7),
                                // paddingHorizontal: 12,
                                tintColor: colors.colorGrayIcon
                            }}
                            resizeMode={'contain'}>
                        </Image>
                    </TouchableOpacity>
                    <View style={{
                        alignItems: 'center', flex: 1
                    }}>
                        <Image
                            source={Images.icTopModal}
                        // style={{ height: 12, width: 50 }}
                        // resizeMode={'cover'}
                        >
                        </Image>
                    </View>
                    <View style={{ width: Width(7) }} />
                </View>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center'
                }}>
                    <Text style={{
                        fontSize: sizes.sizes.sText18, fontFamily: fonts.HelveticaBold, marginTop: -10,
                        lineHeight: sizes.sizes.sText24, color: colors.colorTabActiveJeeHR, textAlign: 'center'
                    }}>
                        {title}</Text>
                </View>
            </View >
        );
    }
}

export default HeaderModalCom;
