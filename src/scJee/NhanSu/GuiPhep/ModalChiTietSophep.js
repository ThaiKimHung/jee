import React, { Component } from 'react';
import { Animated, View, Text, Image, TouchableOpacity } from 'react-native';
import { RootLang } from '../../../app/data/locales';
import Utils from '../../../app/Utils';
import { colors, nstyles } from '../../../styles';
import { nHeight, paddingBotX, Width } from '../../../styles/styles';
import { reText } from '../../../styles/size';
import { Images } from '../../../images';
import moment from 'moment'
const ItemInfoPhep = (props) => {
    const { title = '', value = '', styleContent = {} } = props
    return (
        <View style={[{
            flexDirection: 'row', justifyContent: 'space-between',
            alignItems: 'center', paddingVertical: 15,
        }, styleContent]}>
            <Text style={{ color: colors.colorNoteJee, fontSize: reText(14) }}>{title}</Text>
            <Text numberOfLines={1} style={{ fontSize: reText(14), fontWeight: 'bold', color: colors.checkGreen }}  >{value}</Text>
        </View >
    )
}

class ModalChiTietSophep extends Component {
    constructor(props) {
        super(props);
        this.item = Utils.ngetParam(this, 'item', {});
        this.state = {
            isVisible: true,
            opacity: new Animated.Value(0)

        }
    }

    _goback = async () => {
        this._endAnimation(0)
        Utils.goback(this, null)
    }
    _startAnimation = (value) => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: value,
                duration: 300
            }).start();
        }, 400);
    };

    _endAnimation = (value) => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: value,
                duration: 1
            }).start();
        }, 1);
    };
    componentDidMount() {
        this._startAnimation(0.8)
    }
    render() {
        var item = this.item
        const { opacity } = this.state
        return (
            <View style={{ flex: 1, backgroundColor: `transparent`, height: nHeight(100) }}>
                <View style={[nstyles.ncontainer, { backgroundColor: `transparent`, justifyContent: 'flex-end', height: nHeight(100) }]}>
                    <Animated.View onTouchEnd={this._goback} style={{
                        position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
                        alignItems: 'flex-end', backgroundColor: colors.backgroundModal,
                        opacity
                    }} />
                    <Animated.View style={{ backgroundColor: colors.backgroudJeeHR, width: '100%', borderTopLeftRadius: 15, borderTopRightRadius: 15, paddingBottom: 20 + paddingBotX }}>
                        <View style={{ alignSelf: 'center', width: 300, height: 25, justifyContent: 'center' }}>
                            <Image source={Images.icTopModal} style={{ alignSelf: 'center' }} />
                        </View>
                        <View style={{ flexDirection: 'row', paddingHorizontal: 15, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: reText(18), fontWeight: 'bold', color: colors.titleJeeHR, textAlign: 'center' }}>
                                {item.LoaiPhep} {moment().format('YYYY')}
                            </Text>
                        </View>
                        <View style={{ backgroundColor: colors.backgroudJeeHR }}>


                            <View style={{ backgroundColor: colors.white, marginHorizontal: 10, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5, marginTop: 20 }}>
                                <ItemInfoPhep title={RootLang.lang.scphepthemdon.pheptonnamtruoc}
                                    value={item.PhepTon ? item.PhepTon : '0'} />
                                <View style={{ height: 1, backgroundColor: colors.veryLightPink, width: '100%' }}></View>

                                <ItemInfoPhep title={RootLang.lang.scphepthemdon.ngayhethanphepton}
                                    value={item.NgayHetHan ? item.NgayHetHan : RootLang.lang.thongbaochung.chuacapnhat} />
                                <View style={{ height: 1, backgroundColor: colors.veryLightPink, width: '100%' }}></View>

                                <ItemInfoPhep title={RootLang.lang.scphepthemdon.songaynghitruphepton}
                                    value={item.NghiTruPhepTon ? item.NghiTruPhepTon : '0'} />
                                <View style={{ height: 1, backgroundColor: colors.veryLightPink, width: '100%' }}></View>

                                <ItemInfoPhep title={RootLang.lang.scphepthemdon.tongngayphepnam}
                                    value={item.Tong ? item.Tong : '0'} />
                                <View style={{ height: 1, backgroundColor: colors.veryLightPink, width: '100%' }}></View>
                                {item.IsPhepNam == false ? null :
                                    <>
                                        <ItemInfoPhep title={RootLang.lang.scphepthemdon.songaythamnien}
                                            value={item.soNgayPhepThamNien ? item.soNgayPhepThamNien : '0'} />
                                        <View style={{ height: 1, backgroundColor: colors.veryLightPink, width: '100%' }} />
                                    </>
                                }
                                <ItemInfoPhep title={RootLang.lang.scphepthemdon.sophepdanghitruphepnamdenhientai}
                                    value={item.NghiTruPhepNam ? item.NghiTruPhepNam : '0'} />
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => this._goback()}
                            style={{
                                width: Width(95), backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center', paddingVertical: 15, borderRadius: 10,
                                marginHorizontal: 10, marginTop: 36, marginBottom: 0 + paddingBotX
                            }}>
                            <Text style={{ fontSize: reText(14), color: colors.checkAwait }}>{RootLang.lang.thongbaochung.dong}</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </View>

        );
    }
}

const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(ModalChiTietSophep, mapStateToProps, true)