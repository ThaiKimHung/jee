import React, { Component } from 'react'
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from 'react-native'
import { RootLang } from '../app/data/locales'
import Utils from '../app/Utils'
import { Images } from '../images'
import { colors } from '../styles'
import { reText } from '../styles/size'
import { nstyles } from '../styles/styles'

class NoNetWork extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        const { onPressCheck = () => { }, onPressTroVe = () => { }, tryConnect = false } = this.props
        return (
            <View style={[nstyles.ncontainer, {
                backgroundColor: colors.backgroundModal,
                justifyContent: 'center', alignItems: 'center',
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                flex: 1
            }]}>
                <View style={{ backgroundColor: colors.white, padding: 30, }}>
                    <Image source={Images.icDisconnect} style={{ alignSelf: 'center', marginTop: 30 }} />
                    {
                        tryConnect == true ?
                            <ActivityIndicator color={'red'} /> : <Text style={{ color: colors.colorTextBTGray, fontWeight: 'bold', alignSelf: 'center', marginVertical: 10, fontSize: reText(16) }}>{RootLang.lang.thongbaochung.matketnoi}</Text>
                    }

                    <View style={{ flexDirection: 'row', }}>
                        <TouchableOpacity
                            style={{
                                width: 120, height: 40, backgroundColor: colors.black_20, alignSelf: 'center', justifyContent: 'center',
                                alignItems: 'center', borderRadius: 3, marginVertical: 50
                            }}
                            onPress={() => onPressTroVe()}>
                            <Text style={{ fontSize: reText(12), color: colors.white, fontWeight: 'bold' }}>{RootLang.lang.thongbaochung.quaylai}</Text>
                        </TouchableOpacity>
                        <View style={{ marginHorizontal: 5 }}></View>
                        <TouchableOpacity
                            style={{
                                width: 120, height: 40, backgroundColor: colors.greenTab, alignSelf: 'center', justifyContent: 'center',
                                alignItems: 'center', borderRadius: 3, marginVertical: 50
                            }}
                            onPress={onPressCheck}>
                            <Text style={{ fontSize: reText(12), color: colors.white, fontWeight: 'bold' }}>{RootLang.lang.thongbaochung.ketnoilai}</Text>
                        </TouchableOpacity>
                    </View >

                </View>
            </View >
        )
    }
}


export default NoNetWork


