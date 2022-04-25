import React, { Component } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { RootLang } from '../../../app/data/locales';
import Utils from '../../../app/Utils';
import { colors, nstyles } from '../../../styles';
import { fonts } from '../../../styles/font';
import { sizes } from '../../../styles/size';
import { Height } from '../../../styles/styles';
import HeaderModalCom from '../../Component/HeaderModalCom';
import { ButtomCustom } from '../../Component/itemcom/itemcom';

class TaoGhiChu extends Component {
    constructor(props) {
        super(props)
        this.state = {
            note: ''
        }

    }
    componentDidMount() {
    }
    _goback = async () => {
        Utils.goback(this)
    }

    handleSaveNote = () => {

    }

    render() {
        const { note } = this.state
        return (
            <View style={[nstyles.ncontainer,
            {
                flex: 1,
                backgroundColor: colors.backgroundModal,
                opacity: 1,
            }]}>
                <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }} style={{}}>
                    <View style={{
                        backgroundColor: colors.white,
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        flexDirection: 'column',
                        paddingHorizontal: 15,
                        paddingVertical: 13,
                        justifyContent: 'flex-end',
                        paddingBottom: 25,
                    }}>
                        <View >
                            <HeaderModalCom onPress={() => Utils.goback(this)} title={RootLang.lang.scbangcong.taoghichu.toUpperCase()} />
                            <View>
                                <Text style={{ paddingVertical: 5, color: colors.textGray }}>{RootLang.lang.scbangcong.ghichu}</Text>
                                <TextInput
                                    style={{ maxHeight: Height(10), padding: 10, borderWidth: 0.5, height: Height(10), borderColor: colors.brownGreyThree }}
                                    multiline={true}
                                    value={note}
                                    placeholder={RootLang.lang.scbangcong.nhapnoidungghichu}
                                    onChangeText={(note) => this.setState({ note })}
                                />
                                <View style={{ flexDirection: 'row', marginTop: 20 }}>
                                    <ButtomCustom
                                        onpress={() => { }}
                                        title={RootLang.lang.thongbaochung.xacnhan}
                                    />
                                    <View style={{ marginHorizontal: 2 }}></View>
                                    <ButtomCustom
                                        onpress={this._goback}
                                        title={RootLang.lang.thongbaochung.thoat}
                                        stColor={{ backgroundColor: colors.greenTab }}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </View>
        )
    }
}

export default TaoGhiChu
var styler = StyleSheet.create({
    row: {
        flex: 4, flexDirection: 'row'
    },
    titleRow: { color: colors.colorTextBack80, }
    ,
    textDot: {
        fontSize: sizes.sText14, lineHeight: sizes.sText19,
        fontFamily: fonts.Helvetica, color: colors.colorTextBack80
    },
    valueRow: {
        fontSize: sizes.sText14, lineHeight: sizes.sText19, paddingRight: 30,
        marginLeft: 10,
        fontFamily: fonts.Helvetica, color: colors.colorTextBack80
    }
})
