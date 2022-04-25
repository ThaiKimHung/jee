import React from 'react';
import { Image, Text, View } from 'react-native';
import { reText } from '../../../styles/size';
import { colors } from '../../../styles';
const ModalTop = (props) => {
    const { title = '', imgHeaderLine = {}, colorTitle = colors.textBlackCharcoal, colorHeaderLine = colors.colorHeaderLineGray } = props
    return (
        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 7 }}>
            <Image source={imgHeaderLine} style={{ tintColor: colorHeaderLine }}></Image>
            <Text style={{ marginTop: 20, fontSize: reText(18), color: colorTitle, fontWeight: 'bold' }}>{title}</Text>
        </View >
    )
}
export { ModalTop };