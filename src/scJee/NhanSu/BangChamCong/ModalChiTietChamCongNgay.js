import moment from 'moment';
import React, { Component } from 'react';
import { Animated, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { getDSChamCongNgay } from '../../../apis/apiTimesheets';
import { RootLang } from '../../../app/data/locales';
import Utils from '../../../app/Utils';
import ButtonCom from '../../../components/Button/ButtonCom';
import { colors, nstyles } from '../../../styles';
import { fonts } from '../../../styles/font';
import { reText, sizes } from '../../../styles/size';
import { nHeight, paddingBotX, Width } from '../../../styles/styles';
import HeaderModalCom from '../../../Component_old/HeaderModalCom';
import IsLoading from '../../../components/IsLoading';
import { Images } from '../../../images';

export class ModalChamCong extends Component {
    constructor(props) {
        super(props)
        this.pageAll = 0;
        this.state = {
            isVisible: true,
            ItemDulieu: Utils.ngetParam(this, 'item', {}),
            refreshing: true,
            data: [],
            isColum: 0,
            opacity: new Animated.Value(0)

        }

    }
    componentDidMount() {
        this._startAnimation(0.8)
        this._GetchamCong();
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


    _GetchamCong = async (page = 1) => {
        nthisLoading.show()
        const res = await getDSChamCongNgay(moment(this.state.ItemDulieu.ngaychuan).format('DD/MM/YYYY'), 1, 10);
        Utils.nlog('res _GetchamCong', res)
        if (res.status == 1) {
            nthisLoading.hide()
            this.setState({ data: res.dt_checkinout, refreshing: false, })
        } else {
            nthisLoading.hide()
            this.setState({ refreshing: false })
        }
    }
    render() {
        var { data, isColum, opacity } = this.state

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
                            <Text style={{ fontSize: reText(18), fontWeight: 'bold', color: colors.titleJeeHR }}>
                                {RootLang.lang.scbangcong.bangchamcong.toUpperCase()}
                            </Text>
                        </View>

                        {/* <HeaderModalCom onPress={this._goback} title={RootLang.lang.scbangcong.bangchamcong.toUpperCase()} /> */}


                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ flexGrow: 1, height: nHeight(86) }}
                        >
                            <View style={{ paddingVertical: 20, flex: 1, paddingHorizontal: 15 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: sizes.sText14, }}>{RootLang.lang.scbangcong.chamcongvao + " :"}</Text>
                                {
                                    this.state.data.length > 0 ?
                                        <View style={[{ paddingVertical: 20, }]}>
                                            <Image
                                                source={{ uri: data[0].Image }}
                                                style={{ width: 200, height: 200, alignSelf: 'center', borderRadius: 10 }}
                                                resizeMode={'cover'}>
                                            </Image>

                                            <Text style={[styler.titleRow]}>
                                                {RootLang.lang.scbangcong.vitri}
                                            </Text>
                                            <Text style={[styler.valueRow]}
                                                numberOfLines={2}
                                            >
                                                {`${this.state.data[0].Address ? this.state.data[0].Address : '--'}`}
                                            </Text>
                                            <Text style={[styler.titleRow]}>
                                                {RootLang.lang.scbangcong.thoigian}
                                            </Text>
                                            <Text style={[styler.valueRow]}
                                                multiline={true}
                                                numberOfLines={2}
                                            >
                                                {moment(this.state.data[0].Date).format("DD/MM/YYYY - HH:mm:ss")}
                                            </Text>
                                        </View> : <Text >{RootLang.lang.thongbaochung.chuacapnhat}</Text>
                                }
                                <Text
                                    style={{ fontWeight: 'bold', fontSize: sizes.sText14, }}>{RootLang.lang.scbangcong.chamcongra + " :"}</Text>
                                {
                                    this.state.data.length > 1 ?
                                        <View style={[{ paddingVertical: 20 }]}>
                                            <Image
                                                source={{ uri: data[this.state.data.length - 1].Image }}
                                                style={{ width: 200, height: 200, alignSelf: 'center', borderRadius: 10 }}
                                                resizeMode={'cover'}>
                                            </Image>

                                            <Text style={[styler.titleRow]}>
                                                {RootLang.lang.scbangcong.vitri}
                                            </Text>
                                            <Text style={[styler.valueRow]}
                                                numberOfLines={2}
                                            >
                                                {`${this.state.data[this.state.data.length - 1].Address ? this.state.data[this.state.data.length - 1].Address : '--'}`}
                                            </Text>
                                            <Text style={[styler.titleRow]}>
                                                {RootLang.lang.scbangcong.thoigian}
                                            </Text>
                                            <Text multiline={true}
                                                style={[styler.valueRow]}
                                                numberOfLines={2}
                                            >
                                                {moment(this.state.data[this.state.data.length - 1].Date).format("DD/MM/YYYY - HH:mm:ss")}
                                            </Text>
                                        </View> : <Text >{RootLang.lang.thongbaochung.chuacapnhat}</Text>
                                }

                            </View>
                            <ButtonCom
                                text={RootLang.lang.thongbaochung.dong}
                                style={{
                                    backgroundColor: colors.white,
                                    backgroundColor1: colors.white,
                                    color: colors.colorTextBack80,
                                    width: Width(95), borderRadius: 10, paddingVertical: 15

                                }}
                                styleButton={{ justifyContent: 'flex-end', alignSelf: 'center', }}
                                txtStyle={{ color: colors.black }}
                                onPress={this._goback}
                            />
                        </ScrollView>
                        <IsLoading></IsLoading>
                    </Animated.View>
                </View>
            </View>
        )
    }
}

// export default ModalChamCong

const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(ModalChamCong, mapStateToProps, true)
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
// import React, { Component } from 'react';
// import {
//     Image, View, Text, TouchableHighlight,
//     TouchableOpacity, StyleSheet


// } from 'react-native';
// import { colors } from '../../styles';
// import Utils from '../../app/Utils';
// import { Images } from '../../images';
// import { sizes } from '../../styles/size';
// import { RootLang } from '../../app/data/locales';
// import { fonts } from '../../styles/font';
// import ButtonCom from '../../components/Button/ButtonCom';


// export default class ModalChamCong extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//         }
//     }
//     _goback = async () => {
//         Utils.goback(this)
//     }
//     render() {
//         return (
//             <Modal
//                 isVisible={this.state.isVisible}
//                 style={{ margin: 0, justifyContent: 'flex-end' }}
//                 onBackdropPress={this._goback}
//                 onSwipeComplete={this._goback}
//                 swipeDirection="down">
//                 <View style={{
//                     height: '95%', backgroundColor: colors.white,
//                     borderTopLeftRadius: 20, borderTopRightRadius: 20,
//                     flexDirection: 'column', paddingHorizontal: 15, paddingVertical: 13
//                 }}>
//                     <View style={{ flex: 1 }}>
//                         <TouchableOpacity onPress={() => Utils.goback(this)} >
//                             <Image
//                                 source={Images.icGoBackback}
//                                 style={{ height: 26, width: 26 }}
//                                 resizeMode={'contain'}>
//                             </Image>
//                         </TouchableOpacity>
//                         <View style={{
//                             flexDirection: 'row',
//                             justifyContent: 'center',
//                         }}>
//                             <Text style={{
//                                 fontSize: sizes.sText18, fontFamily: fonts.Helvetica,
//                                 lineHeight: 24, color: colors.colorTextGreen
//                             }}>
//                                 {`Thông tin Ứng dụng`.toUpperCase()}</Text>
//                         </View>
//                         <View style={{ marginLeft: 5, flex: 1 }}>
//                         </View>
//                         {/* <View style={{ width: '40%', justifyContent: 'center', alignSelf: 'center', marginBottom: 70 }}>
//                             <ButtonCom
//                                 text={RootLang.lang.guidonxinnghiphep.quaylai}
//                                 style={{

//                                     //  width: '100%',
//                                     backgroundColor: colors.colorButtomleft,
//                                     backgroundColor1: colors.colorButtomright,
//                                 }}
//                             // onPress={() => Utils.goback(this)} 
//                             />
//                         </View> */}

//                     </View>
//                 </View>
//             </Modal>

//         )


//     }
// }
