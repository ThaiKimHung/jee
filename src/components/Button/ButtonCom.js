import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, Image, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { fonts } from '../../styles';
import { colors } from '../../styles/color';
import { sizes } from '../../styles/size';
import { nColors, Width } from '../../styles/styles';

/*
    - style:
      + ...style Dùng cho contain button
      + color, fontSize, fontWeight dùng cho Text.
    - shadow (bool):
      + true: button có đổ bóng
      + false: button không có đổ bóng
*/
const ButtonCom = (props) => {
    let { onPress, text, shadow = true, style, disabled = false, Linear = false, txtStyle = {}, styleButton = {}, img, onLongPress, check = false } = props;

    if (style == undefined)
        style = {};
    let { color = colors.white, fontSize = sizes.sText14, backgroundColor = nColors.main2, backgroundColor1 = nColors.main2, } = style;
    return (
        <TouchableOpacity
            style={[styleButton, {}]}
            disabled={disabled}
            onLongPress={() => { onLongPress ? onLongPress() : null }}
            onPress={() => {
                if (disabled == true) {

                }
                else {
                    onPress()
                }
            }}>
            <LinearGradient

                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                colors={Linear ? [colors.colorBlue, colors.waterBlue] : [backgroundColor, backgroundColor1]}
                style={[stButtonCom.containerBtn, shadow == true ? stButtonCom.containShadow : {}, { ...style }]}
            >
                {img > 0 ?
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <View style={{ flex: check ? 0 : 0.3 }}>
                            <Image
                                source={img}
                                resizeMode={'contain'}
                                style={{ width: Width(5.5), height: Width(5) }}
                            />
                        </View>
                        <Text style={[{ color, fontSize, fontFamily: fonts.Helvetica, fontSize: sizes.sText14 }, txtStyle]}>{text}</Text>
                    </View> : <Text style={[{ color, fontSize, textAlign: 'center', fontFamily: fonts.Helvetica, fontSize: sizes.sText14 }, txtStyle]}>{text}</Text>
                }
            </LinearGradient>
        </TouchableOpacity >
    );
}
const stButtonCom = StyleSheet.create({
    containerBtn: {
        alignItems: 'center',
        paddingVertical: 10,
        borderRadius: 24
    },
    containShadow: {
        shadowColor: "rgba(0, 0, 0, 0.2)",
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 2,
        shadowOpacity: 1,
        margin: 0,
        elevation: Platform.OS == "android" ? 5 : 0
    }
});

export default ButtonCom;
