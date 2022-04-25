import moment from 'moment';
import React, { Component } from 'react';
import { ScrollView, Text, View, Animated, Image, TouchableOpacity } from 'react-native';
import { RootLang } from '../../../../app/data/locales';
import Utils from '../../../../app/Utils';
import { Images } from '../../../../images';
import { colors } from '../../../../styles';
import { reSize, reText } from '../../../../styles/size';
import { nHeight, nstyles, paddingBotX, Width } from '../../../../styles/styles';
import { ButtomCustom, ItemLineText, ItemMultiLine } from '../../../Component/itemcom/itemcom';

export class Modal_CTGiaiTrinh extends Component {
    constructor(props) {
        super(props);
        this.data = Utils.ngetParam(this, 'data')
        this.state = {
            opacity: new Animated.Value(0),
        }
    }

    componentDidMount() {
        this._startAnimation(0.8)
    }
    _startAnimation = (value) => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: value,
                duration: 400
            }).start();
        }, 300);
    };

    _endAnimation = (value) => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: value,
                duration: 1
            }).start();
        }, 1);
    };
    _goback = () => {
        this._endAnimation(0)
        Utils.goback(this);
    }
    render() {
        var item = this.data;
        let { opacity } = this.state
        return (
            <View style={{ flex: 1, backgroundColor: `transparent`, height: nHeight(100) }} keyboardShouldPersistTaps='handled'>
                <View style={[nstyles.ncontainer, { backgroundColor: `transparent`, justifyContent: 'flex-end', height: nHeight(100) }]}>
                    <Animated.View onTouchEnd={this._goback} style={{
                        position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
                        alignItems: 'flex-end', backgroundColor: colors.backgroundModal, opacity
                    }} />
                    <Animated.View style={{ backgroundColor: colors.backgroudJeeHR, width: '100%', borderTopLeftRadius: 15, borderTopRightRadius: 15, paddingBottom: 20 + paddingBotX }}>
                        <View style={{ alignSelf: 'center', width: 300, height: 25, justifyContent: 'center' }}>
                            <Image source={Images.icTopModal} style={{ alignSelf: 'center' }} />
                        </View>
                        <View style={{ flexDirection: 'row', paddingHorizontal: 15 }}>
                            <TouchableOpacity onPress={this._goback} style={{ width: Width(12), height: nHeight(3), justifyContent: 'center' }}>
                                <Text style={{ fontSize: reText(14), color: colors.checkAwait }}>{RootLang.lang.sckhac.huy}</Text>
                            </TouchableOpacity>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: reText(18), fontWeight: 'bold', color: colors.titleJeeHR }}>
                                    {RootLang.lang.scgiaitrinhchamcong.chitietgiaitrinh}
                                </Text>
                            </View>
                            <View style={{ width: Width(12) }} />
                        </View>
                        <Text style={{ color: colors.colorTitleJee, fontSize: reText(14), paddingHorizontal: 20, marginTop: 15 }}>{RootLang.lang.thongbaochung.thongtingiaitrinh.toUpperCase()}</Text>


                        <View style={{ backgroundColor: colors.white, paddingVertical: 15, paddingHorizontal: 10, marginHorizontal: 10, borderRadius: 10, marginTop: 5 }}>
                            <ItemLineText title={RootLang.lang.common.ngay} value={moment(item.Ngay).format('DD/MM/YYYY')} styteTitle={{ fontSize: reText(14), color: colors.colorNoteJee }} stTextRight={{ fontSize: reText(14), color: colors.blackJee }} />
                            <View style={{ height: 0.5, backgroundColor: colors.colorLineJee, marginBottom: 15 }} />
                            <ItemLineText title={RootLang.lang.scgiaitrinhchamcong.giochamcong} value={item.GioChamCong} styteTitle={{ fontSize: reText(14), color: colors.colorNoteJee }} stTextRight={{ fontSize: reText(14), color: colors.blackJee }} />
                            <View style={{ height: 0.5, backgroundColor: colors.colorLineJee, marginBottom: 15 }} />
                            <ItemLineText title={RootLang.lang.scgiaitrinhchamcong.giovaodung} value={(item && item.GioVaoDung) ? (item.GioVaoDung) : '... '} styteTitle={{ fontSize: reText(14), color: colors.colorNoteJee }} stTextRight={{ fontSize: reText(14), color: colors.blackJee }} />
                            <View style={{ height: 0.5, backgroundColor: colors.colorLineJee, marginBottom: 15 }} />
                            <ItemLineText title={RootLang.lang.scgiaitrinhchamcong.gioradung} value={(item && item.GioRaDung) ? (item.GioRaDung) : ' ...'} styteTitle={{ fontSize: reText(14), color: colors.colorNoteJee }} stTextRight={{ fontSize: reText(14), color: colors.blackJee }} />
                            <View style={{ height: 0.5, backgroundColor: colors.colorLineJee, marginBottom: 15 }} />
                            <ItemMultiLine title={RootLang.lang.scgiaitrinhchamcong.lydo} value={item.LyDo} styteTitle={{ fontSize: reText(14), color: colors.colorNoteJee }} stTextRight={{ fontSize: reText(14), color: colors.blackJee }} />
                        </View>
                        <TouchableOpacity onPress={() => this._goback()} style={{ backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center', paddingVertical: 15, borderRadius: 10, marginTop: 30, marginHorizontal: 10 }}>
                            <Text style={{ fontSize: reText(14), color: colors.checkAwait }}>{RootLang.lang.thongbaochung.dong}</Text>
                        </TouchableOpacity>


                    </Animated.View>
                </View>
            </View >

        )
    }
}

export default Modal_CTGiaiTrinh
