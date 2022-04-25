import React, { Component } from 'react';
import {
    Animated,
    BackHandler,
    FlatList, StyleSheet, Text,
    TouchableOpacity, View, Image
} from 'react-native';
import Dash from 'react-native-dash';
import { RootLang } from '../../../app/data/locales';
import Utils from '../../../app/Utils';
import ButtonCom from '../../../components/Button/ButtonCom';
import ListEmpty from '../../../components/ListEmpty';
import { colors } from '../../../styles/color';
import { reSize, sizes } from '../../../styles/size';
import { Height, nHeight, nstyles, Width, paddingBotX } from '../../../styles/styles';
import HeaderModalCom from '../../../Component_old/HeaderModalCom';
import { Images } from '../../../images';
import { color } from 'react-native-reanimated';


// style content 1: ngày thường; 2: thứ 7; 3: Chủ Nhật,  4: ngày lễ; 5: Là style xanh lá cây
const stNgayCong = StyleSheet.create({
    title: {
        flex: 1, textAlign: 'center', fontWeight: 'bold',
        fontSize: sizes.sText10, color: colors.black,
        paddingVertical: 15
    },
    title2: {
        flex: 1, alignItems: 'center', paddingVertical: 15
    },
    text: {
        fontSize: reSize(12), fontWeight: 'bold'
    },
    contentNgayThuong: {
        flex: 1, textAlign: 'center', fontWeight: '500',
        fontSize: sizes.sText12, color: colors.black,
        paddingVertical: 15, backgroundColor: colors.white
    },
    contentThuBay: {
        color: colors.emerald,
        backgroundColor: colors.buff
    },
    contentChuNhat: {
        color: colors.coral,
        backgroundColor: colors.white,

    },
    contentNgayLe: {
        color: colors.white,
        backgroundColor: colors.coral
    },
    contentDacBiet: {
        color: colors.emerald,
        backgroundColor: colors.brightCyan
    }
})

class ModalNgayCongDangDung extends Component {
    constructor(props) {
        super(props);
        this.dataCong = Utils.ngetParam(this, 'dataCong', [])
        this.month = Utils.ngetParam(this, 'month', 12);
        this.state = ({
            isVisible: true,
            refreshing: false,
            opacity: new Animated.Value(0),
            month: this.month,
        })
    }
    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this._backHandlerButton)
        this._startAnimation(0.8)
    }
    componentWillUnmount() {
        this.backHandler.remove()
    }
    _backHandlerButton = () => {
        this._goBack()
        return true
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

    renderStyle = (idStyle) => {
        var style = {};
        switch (idStyle) {
            case '1':
                style = stNgayCong.contentNgayThuong;
                break;
            case '2':
                style = stNgayCong.contentThuBay;
                break;
            case '3':
                style = stNgayCong.contentChuNhat;
                break;
            case '4':
                style = stNgayCong.contentNgayLe
                break;
            case '5':
                style = stNgayCong.contentDacBiet;
                break;
            default:
                style = stNgayCong.contentNgayThuong;
                break;
        }
        return style;
    }
    renderMonthEN = (month) => {
        var monthEN = {};
        switch (month) {
            case '1':
                monthEN = 'Jan';
                break;
            case '2':
                monthEN = 'Feb';
                break;
            case '3':
                monthEN = 'Mar';
                break;
            case '4':
                monthEN = 'Apr';
                break;
            case '5':
                monthEN = 'May';
                break;
            case '6':
                monthEN = 'Jun';
                break;
            case '7':
                monthEN = 'July';
                break;
            case '8':
                monthEN = 'Aug';
                break;
            case '9':
                monthEN = 'Sep';
                break;
            case '10':
                monthEN = 'Oct';
                break;
            case '11':
                monthEN = 'Nov';
                break;
            case '12':
                monthEN = 'Dec';
                break;
            default:
                monthEN = '';
                break;
        }
        return monthEN;
    }
    _renderItem = (item, index) => {
        // var styleBorder = {}
        // if (index == this.dataCong.length - 1) {
        //     styleBorder = {
        //         borderBottomRightRadius: 4,
        //         borderBottomLeftRadius: 4
        //     }
        // }
        return (
            <TouchableOpacity onPress={() => {
                // alert(1)
                Utils.goscreen(this, "ModalCongNgay", { data: item, index: index + 1 })
            }} style={{ marginBottom: index == this.dataCong.length - 1 ? 10 + paddingBotX : 0, borderBottomWidth: index == this.dataCong.length - 1 ? 0.5 : null, borderColor: colors.black_70 }}>
                <View style={[nstyles.nrow, {
                    borderColor: colors.black_70, alignItems: 'center',
                    borderWidth: 0.5, borderLeftWidth: 0.7, borderRightWidth: 0.7
                }]}>
                    <Text style={[stNgayCong.contentNgayThuong, { backgroundColor: colors.white, }]}>
                        {index + 1}
                    </Text>
                    {/* <Dash
                        dashColor={colors.black_70}
                        style={{ width: 1, height: '100%', flexDirection: 'column' }}
                        dashGap={0}
                        dashThickness={1} /> */}
                    <View style={{ width: 1, height: '100%', backgroundColor: colors.black_70, }} />
                    <Text style={[stNgayCong.contentNgayThuong, this.renderStyle(item.LoaiNgay_CongNgayThuong)]}>
                        {item.CongNgayThuong}
                    </Text>
                    <Text style={[stNgayCong.contentNgayThuong, this.renderStyle(item.LoaiNgay_TangCa)]}>
                        {item.TangCa}
                    </Text>
                    <Text style={[stNgayCong.contentNgayThuong, this.renderStyle(item.LoaiNgay_TangCaNB)]}>
                        {item.TangCaNB}
                    </Text>
                    <Text style={[stNgayCong.contentNgayThuong, this.renderStyle(item.LoaiNgay_TangCaDem)]}>
                        {item.TangCaDem}
                    </Text>
                    <Text style={[stNgayCong.contentNgayThuong, this.renderStyle(item.LoaiNgay_Phep)]}>
                        {item.Phep}
                    </Text>
                    <Text style={[stNgayCong.contentNgayThuong, this.renderStyle(item.LoaiNgay_CaLamViec)]}>
                        {item.CaLamViec ? item.CaLamViec : '--'}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }
    _goBack = () => {
        this._endAnimation(0)

        Utils.goback(this, null)
    };
    HeaderModalComNew = (onPress, title) => {
        return (
            <View>
                <View style={{ alignItems: 'center', paddingTop: 7 }}>
                    <Image source={Images.ImageJee.ic_LineTop}></Image>
                </View>
                <View style={{ paddingTop: 20 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ justifyContent: 'center', width: Width(15) }}>
                            <TouchableOpacity onPress={onPress} style={{ alignSelf: 'flex-start' }}>
                                <Text style={{ color: colors.orangeText, fontSize: reSize(14) }}>{RootLang.lang.JeeWork.trolai}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{
                                fontSize: reSize(18), color: colors.textBlackCharcoal, textAlign: 'center', fontWeight: 'bold'
                            }}>
                                {this.props.lang != 'en' ? `${title} (T${this.state.month})` : ` ${title} (${this.renderMonthEN(this.state.month)})`}
                            </Text>
                        </View>
                        <View style={{ width: Width(15) }} />
                    </View>
                </View>
            </View >
        )
    }
    render() {
        const { opacity } = this.state

        return (
            <View style={[nstyles.ncontainer,
            { backgroundColor: `transparent`, justifyContent: 'flex-end', opacity: 1, }]}>
                <Animated.View onTouchEnd={this._goBack} style={{
                    position: 'absolute', top: 0,
                    bottom: 0, left: 0, right: 0,
                    backgroundColor: colors.backgroundModal, opacity

                }} />
                <View style={{
                    backgroundColor: colors.backgroundColor, flex: 1, marginTop: Height(5),
                    flexDirection: 'column', paddingHorizontal: 15,
                    borderTopLeftRadius: 20, borderTopRightRadius: 20
                }}>
                    {this.HeaderModalComNew(this._goBack, RootLang.lang.scbangcong.bangchamcong.toUpperCase())}
                    <View style={{ flex: 1, marginTop: 25 }}>
                        <View style={{ flex: 1, backgroundColor: colors.backgroundColor, borderTopLeftRadius: 5, borderTopRightRadius: 5 }}>
                            <View style={{ borderWidth: 0.5, borderTopLeftRadius: 5, borderTopRightRadius: 5, borderColor: colors.black_70, backgroundColor: colors.white }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={stNgayCong.title2}>
                                        <Text style={stNgayCong.text}>{RootLang.lang.common.ngay}</Text>
                                    </View>
                                    <View style={{ width: 0.75, backgroundColor: colors.black_70 }} />
                                    <View style={stNgayCong.title2}>
                                        <Text style={stNgayCong.text}>{RootLang.lang.scbangcong.cong}</Text>
                                    </View>
                                    <View style={stNgayCong.title2}>
                                        <Text style={stNgayCong.text}>{RootLang.lang.scbangcong.ot}</Text>
                                    </View>
                                    <View style={stNgayCong.title2}>
                                        <Text style={stNgayCong.text}>{RootLang.lang.scbangcong.otbn}</Text>
                                    </View>
                                    <View style={stNgayCong.title2}>
                                        <Text style={stNgayCong.text}>{RootLang.lang.scbangcong.cdem}</Text>
                                    </View>
                                    <View style={stNgayCong.title2}>
                                        <Text style={stNgayCong.text}>{RootLang.lang.scbangcong.phep}</Text>
                                    </View>
                                    <View style={stNgayCong.title2}>
                                        <Text style={stNgayCong.text}>{RootLang.lang.scbangcong.ca}</Text>
                                    </View>
                                </View>
                            </View>
                            <FlatList
                                ListEmptyComponent={
                                    <View style={{ borderLeftWidth: 0.5, borderRightWidth: 0.5, borderBottomWidth: 0.5, borderColor: colors.black_70, backgroundColor: colors.white, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
                                        <ListEmpty textempty={RootLang.lang.thongbaochung.khongcodulieu} />
                                    </View>
                                }
                                data={this.dataCong}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item, index }) => this._renderItem(item, index)}
                                refreshing={this.state.refreshing}
                                onRefresh={this._onRefresh}
                                keyExtractor={(item, index) => index.toString()}
                            // ListFooterComponent={
                            //     <ButtonCom
                            //         text={RootLang.lang.thongbaochung.quaylai}
                            //         style={{
                            //             backgroundColor: colors.colorBtnGray,
                            //             backgroundColor1: colors.colorBtnGray,
                            //             color: colors.colorTextBack80,
                            //             paddingHorizontal: Width(15)
                            //         }}
                            //         styleButton={{ justifyContent: 'flex-end', paddingVertical: 30, alignSelf: 'center', }}
                            //         txtStyle={{ color: colors.black }}
                            //         onPress={this._goBack}
                            //     />
                            // }
                            />
                        </View>
                    </View>

                </View>
            </View>
        )
    }
}
const mapStateToProps = state => ({
    lang: state.changeLanguage.language,
    reducerBangCong: state.reducerBangCong
});
export default Utils.connectRedux(ModalNgayCongDangDung, mapStateToProps, true)
