import React, { useState } from "react";
import {
    Image, Platform, StyleSheet, TextInput,
    TouchableOpacity, View
} from "react-native";
import { nstyles, sizes } from "../../styles";
const InputLogin = props => {
    const [isOnFocus, setIsOnFocus] = useState(
        false
    );
    const {
        // onChange = () => {},
        stContainerC = {},
        stContainerR = {},
        customStyle = {},
        colorUnline = '#fff',
        colorUnlineFoCus = '#fff',
        placeholderTextColor = "#fff",
        icon = undefined,
        showIcon = false,
        iconShowPass = undefined,
        icShowPass = false,
        colorPassOn = '#fff',
        isShowPassOn = false,
        showUnline = false,
        Fcref = () => { },
        iconStyle = {
            backgroundColor: 'transparent',
        }
    } = props;

    if (showIcon) {
        return (
            <View style={[{
                flexDirection: 'column', alignSelf: 'center'
            }, stContainerC]}>
                <View style={[{ flexDirection: 'row', alignItems: 'center' }, stContainerR]}>
                    <Image
                        source={icon}
                        style={[nstyles.nstyles.nIcon20, iconStyle,]}
                        resizeMode={"contain"}
                    />
                    <TextInput 
                        {...props}
                        ref={Fcref}
                        underlineColorAndroid={"transparent"}
                        style={[{ paddingVertical: 5, flex: 1, paddingHorizontal: 5, }, customStyle]}
                        placeholderTextColor={placeholderTextColor}
                        onEndEditing={() => setIsOnFocus(false)}
                    />
                    {
                        icShowPass == true ?
                            <TouchableOpacity onPress={props.setShowPass}><Image
                                source={iconShowPass}
                                style={[nstyles.nstyles.nIcon20, iconStyle]}
                                resizeMode={"contain"}
                            /></TouchableOpacity> : null
                    }
                </View>
                {
                    showUnline == true ? <View style={{ height: isOnFocus == true ? 1.5 : 0.5, width: '100%', backgroundColor: isOnFocus == true ? colorUnlineFoCus : colorUnline, justifyContent: 'flex-end' }}></View> : null

                }



            </View>

        );
    } else
        return (
            <View style={[stContainerC, { flexDirection: 'column', justifyContent: 'center', }]}>
                <TextInput 
                    {...props}
                    ref={Fcref}
                    underlineColorAndroid={"transparent"}
                    style={[styles.viewBorderRadius, customStyle]}
                    placeholderTextColor={placeholderTextColor}
                />
                {
                    showUnline == true ? <View style={{ height: isOnFocus == true ? 1.5 : 0.5, width: '100%', backgroundColor: isOnFocus == true ? colorUnlineFoCus : colorUnline, justifyContent: 'flex-end' }}></View> : null

                }
            </View>

        );
};
const styles = StyleSheet.create({
    viewBorderRadius: {
        paddingVertical: 10,
        fontSize: sizes.sizes.sText16,
        color: "rgba(0,0,0,0.6)",
        ...Platform.select({
            ios: {
                paddingVertical: 13
            },
            android: {
                paddingVertical: 9
            }
        })
    }
});
export default InputLogin;
