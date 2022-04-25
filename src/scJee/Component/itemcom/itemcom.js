import React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, TextInput } from 'react-native';
import { Images } from '../../../images';
import { colors, nstyles, sizes } from '../../../styles';
import { fonts } from '../../../styles/font';
import { reSize, reText } from '../../../styles/size';
import { Width } from '../../../styles/styles';

const styStyle = StyleSheet.create({
    stTouch: {
        paddingVertical: 15,
        margin: 2,
        backgroundColor: colors.white,
        paddingHorizontal: 10
    },
    stTouchInput: {
        paddingVertical: 15,
        margin: 2,
        backgroundColor: colors.white,
        paddingHorizontal: 5
    },
    stValue: {
        color: colors.black,
        fontFamily: fonts.Helvetica,
        fontSize: sizes.sizes.sText14,
        lineHeight: reText(18)
    },

    ntext: {
        color: colors.black_20,
        fontFamily: fonts.Helvetica,
        fontSize: sizes.sizes.sText14,
        lineHeight: reText(16)
    },
    ntext2: {
        fontFamily: fonts.Helvetica,
        fontSize: sizes.sizes.sText14,
        lineHeight: reText(14), color: colors.black_20
    },

    stValueItem: {
        color: colors.black,
        fontFamily: fonts.Helvetica,
        fontSize: sizes.sizes.sText14,
        lineHeight: reText(18)
    },
    ntextItem: {
        color: colors.colorGrayText,
        fontFamily: fonts.Helvetica,
        fontSize: sizes.sizes.sText12,
        lineHeight: reText(17)
    },
    ntextItem2: {
        color: colors.colorGrayText,
        fontFamily: fonts.Helvetica,
        fontSize: sizes.sizes.sText14,
        lineHeight: reText(17)
    },

    value: {
        color: colors.black_70,
        fontFamily: fonts.Helvetica,
        fontSize: sizes.sizes.sText16
    },
    ndropDown: {
        alignItems: 'center', justifyContent: 'space-between',
        flexDirection: 'row',
        paddingTop: 5, paddingBottom: 5
    },
    timeContainer: {
        justifyContent: 'center', alignItems: 'center', flex: 1, flexDirection: 'column',
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0
    },
    timegoback: {
        opacity: 0.3, position: 'absolute',
        left: 0, top: 0, bottom: 0, right: 0, backgroundColor: 'black'
    },
    timeViewCenter: {
        alignItems: 'center',
        backgroundColor: colors.white, elevation: 6,
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 6,
        shadowOpacity: 0.5,
        shadowColor: colors.blackShadow
    },
    dropgoback: {
        opacity: 0.3, position: 'absolute', left: 0, top: 0, bottom: 0, right: 0, backgroundColor: colors.white
    },
    dropdownCenter: {
        width: '90%', backgroundColor: colors.white, elevation: 6,
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 6,
        shadowOpacity: 0.5,
        shadowColor: colors.blackShadow
    },

})
const TouchCom_t1 = (props) => {
    const {
        title = '',
        _onPress = () => { },
        value = '', icon = undefined, isShow = true } = props
    return (
        <View style={[{ flex: 3, width: '100%' }]}>
            <Text style={styStyle.ntext}>{title}</Text>
            <TouchableOpacity onPress={_onPress}
                style={[styStyle.stTouch, {
                    flexDirection: 'row', flex: 1,
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }]}>
                <Text numberOfLines={1} style={styStyle.stValue}>{value}</Text>
                {
                    icon ? <Image
                        source={icon}
                        style={{ height: 12, width: 12 }}
                        resizeMode={'contain'}>
                    </Image> : null
                }

            </TouchableOpacity>
            {isShow == true ?
                <View style={{ height: 1, backgroundColor: colors.BackBorder }} /> : null}
        </View>
    )
}
const ItemCom_t1 = (props) => {
    const { title = '', value = '' } = props
    return (
        <View style={{ flex: 1 }}>
            <Text style={styStyle.ntext}>{title}</Text>
            <Text style={styStyle.stValue}>{value}</Text>
            <View style={{ height: 1, backgroundColor: colors.BackBorder }} />
        </View>
    )
}
const TitleList_t1 = (props) => {
    const { title = '', numf = 1 } = props
    return (
        <View style={{ flex: numf, }}>
            <Text style={{
                fontSize: sizes.sizes.sText14, lineHeight: reText(19), fontFamily: fonts.Helvetica,
                color: colors.colorTextBack80,
            }}>{title}</Text>
        </View>
    )
}
const TouchDrop = (props) => {
    const { value = '', title = '', _onPress } = props
    return (
        <View style={{
            width: '100%',
            paddingVertical: 10
        }}>
            <Text style={styStyle.ntext}>{title}</Text>
            <TouchableOpacity
                onPress={_onPress}
                style={[styStyle.ndropDown]}>
                <View style={{
                    flexDirection: 'row', justifyContent: 'space-between',
                    alignItems: 'center', flex: 1,
                }}>
                    <Text numberOfLines={2}
                        style={[{ flex: 1 }, styStyle.stValue]}>{value}</Text>
                    <Image source={Images.icDownBlue}
                        style={[nstyles.nstyles.nIcon14]}
                        resizeMode={'contain'} />
                </View>
            </TouchableOpacity>
            <View style={{ height: 1, backgroundColor: colors.BackBorder }} />
        </View>
    )
}

const TouchDropNew = (props) => {
    const { value = '', title = '', _onPress, text = '', required = false, styView = {}, styteTouch, styTitle } = props
    return (
        <View style={styView}>
            <TouchableOpacity
                onPress={_onPress}
                style={[styStyle.stTouch, {
                    width: '100%',
                    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                    paddingVertical: 15, backgroundColor: colors.white, ...styteTouch

                }]}>
                <Text style={[styStyle.ntext, { marginLeft: 10, ...styTitle }]}>{title}</Text>
                <View style={{ flexDirection: 'row', marginHorizontal: 10, flex: 1, alignItems: 'center' }}>
                    <Text numberOfLines={2}
                        style={[styStyle.stValue,
                        { marginRight: 10, color: colors.black, flex: 1, textAlign: 'right' }]}>{value}</Text>
                    <Image source={Images.icDropdown}
                        style={[nstyles.nstyles.nIcon14, {}]}
                        resizeMode={'contain'} />
                </View>
            </TouchableOpacity>
        </View>
    )
}

const TouchDropNewTimKiem = (props) => {
    const { value = '', title = '', _onPress, text = '', required = false, styView = {}, styteTouch, styTitle } = props
    return (
        <View style={styView}>
            <TouchableOpacity
                onPress={_onPress}
                style={[styStyle.stTouch, {
                    width: '100%',
                    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                    paddingVertical: 15, backgroundColor: colors.colorBGHome, ...styteTouch

                }]}>
                <Text style={[styStyle.ntext, { marginLeft: 10, ...styTitle }]}>{title}</Text>
                <View style={{ flexDirection: 'row', marginHorizontal: 10, flex: 1, alignItems: 'center' }}>
                    <Text numberOfLines={2}
                        style={[styStyle.stValue,
                        { marginRight: 10, color: colors.black, flex: 1, textAlign: 'right' }]}>{value}</Text>
                    <Image source={Images.icDropdown}
                        style={[nstyles.nstyles.nIcon14, {}]}
                        resizeMode={'contain'} />
                </View>
            </TouchableOpacity>
        </View>
    )
}


const TouchDropNewVer2 = (props) => {
    const { value = '', title = '', _onPress, styText = {}, icon = {}, required = false, text = '', styView = {}, styTouch = {}, styTitle = {} } = props
    return (
        <View style={styView}>
            <TouchableOpacity
                onPress={_onPress}
                style={[styStyle.stTouch, {
                    width: '100%',
                    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                    paddingVertical: 15, backgroundColor: colors.white,

                }, styTouch]}>
                <Text style={[styStyle.ntext2, { marginLeft: 10 }, styTitle]}>{title}</Text>
                <View style={{ flexDirection: 'row', marginHorizontal: 10, flex: 1, alignItems: 'center' }}>
                    <Text numberOfLines={2}
                        style={[styStyle.stValue,
                        { marginRight: 10, color: colors.black, flex: 1, textAlign: 'right' }, styText]}>{value}</Text>
                    <Image source={icon}
                        style={[nstyles.nstyles.nIcon14, {}]}
                        resizeMode={'contain'} />
                </View>
            </TouchableOpacity>
        </View>
    )
}

const TouchDropNewModal = (props) => {
    const { value = '', title = '', _onPress } = props
    return (
        <TouchableOpacity
            onPress={_onPress}
            style={[styStyle.stTouch, {
                width: '100%', alignItems: 'center',
                flexDirection: 'row', justifyContent: 'center',
                paddingVertical: 18, backgroundColor: colors.white, paddingLeft: 0

            }]}
        >
            <Text style={[styStyle.stValue,]}>{title}</Text>
            <View style={{ flexDirection: 'row', marginHorizontal: 10, flex: 1 }}>
                <Text numberOfLines={2}
                    style={[styStyle.ntext, ,
                    { marginRight: 10, color: colors.black, flex: 1, textAlign: 'right' }]}>{value}</Text>
                <Image source={Images.icDropdown}
                    style={[nstyles.nstyles.nIcon14,]}
                    resizeMode={'contain'} />
            </View>

        </TouchableOpacity>
    )
}

const TouchTime = (props) => {
    const {
        title = '',
        _onPress = () => { },
        value = '', icon = {} } = props
    return (
        <TouchableOpacity
            onPress={_onPress}
            style={[styStyle.stTouch, {
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: colors.white
            }]}>
            <Text style={[styStyle.ntext, { textAlign: 'center' }]}>{title}</Text>
            {
                value ? <Text numberOfLines={2} style={[styStyle.stValue,
                { flex: 1, textAlign: 'right' }]}>{value}</Text> :
                    icon ? <Image
                        source={icon}
                        style={{ height: 14, width: 14, tintColor: colors.colorGrayIcon }}
                        resizeMode={'contain'}>
                    </Image> : null
            }
        </TouchableOpacity>



    )
}

const TouchTimeVer2 = (props) => {
    const {
        title = '',
        _onPress = () => { },
        value = '', icon = {}, isShow = false } = props
    return (

        <TouchableOpacity
            onPress={_onPress}
            style={[styStyle.stTouch, {
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: colors.white
            }]}>
            <Text style={[styStyle.ntext, { textAlign: 'center' }]}>{title}</Text>
            {
                <View style={{ flexDirection: 'row', marginHorizontal: 10, flex: 1 }}>
                    <Text numberOfLines={2} style={[styStyle.stValue,
                    { flex: 1, textAlign: 'right', fontWeight: "bold", color: colors.colorTabActive, marginRight: 10 }]}>{value}</Text>
                    <Image
                        source={icon}
                        style={[nstyles.nstyles.nIcon14,]}
                        resizeMode={'contain'}>
                    </Image>
                </View>
            }
        </TouchableOpacity >



    )
}

const TouchTimeVer3 = (props) => {
    const {
        title = '',
        _onPress = () => { },
        value = '', icon = {}, isShow = false } = props
    return (

        <TouchableOpacity
            onPress={_onPress}
            style={[styStyle.stTouch, {
                flexDirection: 'column',
                backgroundColor: colors.white,
                height: Width(18),
                width: "50%",
                flex: 1,
                paddingVertical: Width(2),
            }]}>
            <Text style={[styStyle.ntext, { textAlign: 'center', fontWeight: "normal", color: colors.black, paddingBottom: Width(3) }]}>{title}</Text>
            <Text numberOfLines={2} style={[styStyle.stValue,
            { flex: 1, textAlign: 'right', fontSize: reText(16), textAlign: 'center' }]}>{value}</Text>
        </TouchableOpacity >



    )
}
const TouchTextInput = (props) => {
    const { styView = {} } = props
    var { textInput } = props

    return (
        <View style={styView}>
            {textInput}
        </View>
    )
}
const ItemChiTietCom = (props) => {
    const { title = '', value = '', styleContent = {} } = props
    return (
        <View style={[{
            flexDirection: 'row', justifyContent: 'space-between',
            alignItems: 'center', paddingVertical: 23, width: '100%'
        }, styleContent]}>
            <Text style={[styStyle.stValueItem,]}>{title}</Text>
            <Text numberOfLines={3} style={[styStyle.ntextItem, { textAlign: 'right', flex: 1, }]}  >{value}</Text>
        </View >
    )
}
const ItemChiTietComSize14 = (props) => {
    const { title = '', value = '', styleContent = {} } = props
    return (
        <View style={[{
            flexDirection: 'row', justifyContent: 'space-between',
            alignItems: 'center', paddingVertical: 23, width: '100%'
        }, styleContent]}>
            <Text style={[styStyle.stValueItem2, { color: colors.grayText }]}>{title}</Text>
            <Text numberOfLines={3} style={[styStyle.ntextItem2, { textAlign: 'right', flex: 1, }]}  >{value}</Text>
        </View >
    )
}
const ItemChiTietComAvatar = (props) => {
    const { title = '', value = '', avatar = '', styleContent = {} } = props
    return (
        <View style={{
            flexDirection: 'row', justifyContent: 'space-between',
            alignItems: 'center', paddingVertical: 18, width: '100%'
        }}>
            <Text style={[styStyle.stValueItem,]}>{title}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Image source={avatar} style={{ alignSelf: 'center', width: reSize(30), height: reSize(30), borderRadius: reSize(15), marginRight: 10 }} />
                <Text style={{ fontSize: reText(14) }}>{value}</Text>
            </View>

        </View>
    )
}

const ItemChiTietComColumn = (props) => {
    const { title = '', value = '', } = props
    return (
        <View style={[{
            justifyContent: 'center',
            paddingVertical: 23
        }]}>
            <Text style={[styStyle.stValueItem]}>{title}</Text>
            <Text numberOfLines={3} style={[styStyle.ntextItem, { flex: 1, }]}  >{value}</Text>
        </View >
    )
}

const ItemLineText = (props) => {
    const { title = '', value = '', stTextRight = {}, style = {}, numLine = 9999, edit = false, styteTitle } = props
    var { component } = props
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, ...style }}>
            <Text style={{ fontSize: reText(14), color: colors.colorTextBTGray, ...styteTitle }}>{title}</Text>
            {edit == true ? component : null}
            {edit == false ? <Text numberOfLines={numLine} style={[{ fontSize: reText(14), flex: 1, textAlign: 'right', paddingLeft: 20 }, stTextRight]}>{value}</Text> : null}
        </View>
    )
}

const ItemLineWebView = (props) => {
    const { title = '' } = props
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
            <Text style={{ fontSize: reText(14), color: colors.colorTextBTGray }}>{title}</Text>
        </View>
    )
}

const ItemLineTextAva = (props) => {
    const { title = '', value = '', avatar = '' } = props
    return (
        <View style={{ flexDirection: 'row', marginBottom: 15, justifyContent: 'space-between' }}>
            <Text style={{ fontSize: reText(14), color: colors.colorTextBTGray, alignSelf: 'center', }}>{title}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Image source={avatar} style={{ alignSelf: 'center', width: reSize(30), height: reSize(30), borderRadius: reSize(15), marginRight: 10 }} />
                <Text style={{ fontSize: reText(14) }}>{value}</Text>
            </View>

        </View>
    )
}
const ItemMultiLine = (props) => {
    const { title = '', value = '' } = props
    return (
        <View style={{ justifyContent: 'space-between', marginBottom: 25 }}>
            <Text style={{ fontSize: reText(14), color: colors.colorTextBTGray }}>{title}</Text>
            <Text style={{ fontSize: reText(14) }}>{value}</Text>
        </View>
    )
}

const ButtomCustom = (props) => {
    const { title = '', stColor = {}, onpress } = props;
    return (
        <TouchableOpacity onPress={onpress} style={[{ backgroundColor: colors.orangeColor, paddingVertical: 14, borderRadius: 2, flex: 1 }, stColor]}>
            <Text style={{ color: colors.white, fontSize: reText(12), fontWeight: 'bold', alignSelf: 'center' }}>{title}</Text>
        </TouchableOpacity>
    )
}
const InputRegister = (props) => {
    const { img, placeholder } = props;
    return (
        <View
            style={{
                marginTop: 20, backgroundColor: colors.colorInput, borderColor: 'transparent',
                borderBottomColor: colors.colorInput, borderWidth: 0.5, flexDirection: 'row',
                alignItems: 'center', borderRadius: 30, paddingHorizontal: 20
            }}>
            <Image style={[nstyles.nstyles.nIcon16, { justifyContent: 'flex-start' }]} resizeMode={'contain'} source={img} />
            <TextInput
                {...props}
                allowFontScaling={false}
                autoCapitalize={'none'}
                autoCorrect={false}
                placeholder={placeholder}
                placeholderTextColor={colors.colorPlayhoder}
                style={{
                    color: colors.textblack,
                    fontSize: sizes.sText16, alignSelf: 'center',
                    justifyContent: 'center', textAlign: 'center',
                    padding: 10, flex: 1, fontFamily: fonts.Helvetica, marginRight: 16
                }}

                underlineColorAndroid={'transparent'}
            />
        </View>
    )
}
export {
    ItemCom_t1, TouchCom_t1, TitleList_t1, TouchDrop, TouchDropNewModal, ItemLineWebView, ItemChiTietComAvatar, TouchDropNewVer2, TouchTimeVer3, TouchTextInput, InputRegister,
    TouchTime, TouchDropNew, ItemChiTietCom, ItemChiTietComColumn, ItemLineText, ItemLineTextAva, ItemMultiLine, ButtomCustom, TouchTimeVer2, ItemChiTietComSize14, TouchDropNewTimKiem

};
