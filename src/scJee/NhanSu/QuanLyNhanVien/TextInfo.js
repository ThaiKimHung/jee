import React from 'react';
import {
    StyleSheet, Text, View
} from 'react-native';
import { colors, fonts } from '../../../styles';
import { sizes } from '../../../styles/size';


const TextInFo = (props) => {

    let { text,
        text1,
        style,
        isShow = true,
        stContainer = {},
        stText = {},
        stText1 = {},
    } = props;
    if (style == undefined)
        style = {};
    return (

        <View style={{ flex: 1, backgroundColor: colors.white, }}>
            <View style={[{ paddingVertical: 17, flexDirection: 'row', justifyContent: "space-between" }, stContainer]} >
                <Text style={[{ fontSize: sizes.sText14, color: colors.textblack, lineHeight: sizes.sText16 }, stText]}>{text}</Text>
                <Text style={[{
                    fontSize: sizes.sText12, fontFamily: fonts.Helvetica,
                    color: colors.textGray, lineHeight: sizes.sText14, flex: 1, textAlign: 'right'
                }, stText1]}>{text1}</Text>
            </View>
            {isShow == true ?
                <View style={{ height: 1, backgroundColor: colors.colorlineJeeHr }} />
                :
                null}
        </View>




    );
}
export default TextInFo;
