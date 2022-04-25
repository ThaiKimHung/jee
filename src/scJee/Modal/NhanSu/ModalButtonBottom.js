import React from 'react';
import { Image, Text, View, TouchableOpacity } from 'react-native';
import { reText } from '../../../styles/size';
import { colors } from '../../../styles';
const ModalButtonBottom = (props) => {
    const { textButton = '', colorTextButton = colors.checkGreen, _onPress = {}, _onLongPress, _fontWeight = null } = props
    return (
        <View >
            <TouchableOpacity onPress={_onPress} onLongPress={_onLongPress} style={{ alignItems: 'center', borderRadius: 10, backgroundColor: 'white', paddingVertical: 15 }}>
                <Text style={{ fontSize: reText(14), color: colorTextButton, fontWeight: _fontWeight }}>{textButton}</Text>
            </TouchableOpacity >
        </View >
    )
}
export { ModalButtonBottom };