import moment from 'moment';
import React, { Component } from 'react';
import { Animated, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import HTML from 'react-native-render-html';
import { ChuyenGiaiDoan } from '../../../../apis/JeePlatform/API_JeeWork/apiCongViecQuyTrinh';
import { RootLang } from '../../../../app/data/locales';
import Utils from '../../../../app/Utils';
import UtilsApp from '../../../../app/UtilsApp';
import IsLoading from '../../../../components/IsLoading';
import HeaderModalCom from '../../../../Component_old/HeaderModalCom';
import { Images } from '../../../../images';
import { colors } from '../../../../styles';
import { reText } from '../../../../styles/size';
import { nHeight, nstyles, paddingBotX, Width } from '../../../../styles/styles';
class ChuyenGiaiDoan_QT extends Component {
    constructor(props) {
        super(props)
        this.callback = Utils.ngetParam(this, 'callback',),
            this.callbackGetData = Utils.ngetParam(this, 'callbackGetData',),
            this.state = {
                opacity: new Animated.Value(0),
                listData: this.Object || [],
                listNull: [],
                rowid: Utils.ngetParam(this, 'rowid', ''),
                data: Utils.ngetParam(this, 'data', []),
                nguoiTH: '',
                ketQua: ''
            }

    }

    componentDidMount() {
        // Utils.nlog('data', this.state.data)
        this._startAnimation(0.8)
        this._check()
    }

    _check = async () => {
        const { data } = this.state
        if (data[0]?.IsEdit == false) {
            this.setState({
                nguoiTH: data[0]?.NguoiThucHienList
            })
        }
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
    _goBack = () => {
        this._endAnimation(0)
        Utils.goback(this)
    }


    _Chonnguoi = () => {
        Utils.goscreen(this, 'Modal_ComponentSelectCom', { callback: this._callbackChonnguoi, item: this.state.nguoiTH, AllThaoTac: this.state.data[0] ? this.state.data[0]?.NguoiThucHien : this.state.data.NguoiThucHien, ViewItem: this.ViewItemChonnguoi })
    }

    _callbackChonnguoi = (item) => {
        try {
            this.setState({
                nguoiTH: item
            })
        } catch (error) { }
    }

    ViewItemChonnguoi = (item) => {
        return (
            <View key={item.ID.toString()} style={{ flexDirection: "row", alignSelf: "center" }}>
                <Text style={{
                    textAlign: "center", fontSize: reText(16),
                    alignSelf: "center",
                    color: item.color,
                    fontWeight: this.state.nguoiTH.ID == item.ID ? "bold" : 'normal'
                }}>{item.Title ? item.Title : ""}</Text>
            </View>
        )
    }

    _ChuyenGiaiDoan = async () => {
        nthisLoading.show()
        let body = {}
        let infoChuyenGiaiDoanData = {}
        infoChuyenGiaiDoanData = { "RowID": this.state.data[0]?.RowID, "NguoiThucHienID": this.state.nguoiTH.ID ? this.state.nguoiTH.ID : 0, "FieldNode": [] }
        body = {
            "InfoChuyenGiaiDoanData": [infoChuyenGiaiDoanData],
            "IsNext": true,
            "NodeID": this.state.rowid,
            "NodeListID": 0,
        }
        // Utils.nlog('body', body)
        let res = await ChuyenGiaiDoan(body)
        // Utils.nlog('res ChuyenGiaiDoan', res)
        if (res.status == 1) {
            nthisLoading.hide()
            this.callback()
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.JeeWork.chuyengiaidoanthanhcong, 1)
            this._goBack()
        }
        else {
            nthisLoading.hide()
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
        }

    }

    renderData0 = () => {
        const { opacity, data, nguoiTH } = this.state
        return (
            <View style={{ flex: 1 }}>
                <Text style={styles.title}>{data[0] ? data[0]?.GiaiDoanTiepTheo : data?.GiaiDoanTiepTheo}</Text>

                <View style={styles.padding}>
                    <Text style={styles.text_nor}>{RootLang.lang.JeeWork.cachgiaoviec}:</Text>
                    <Text style={styles.text_data}>{data[0] ? data[0]?.CachGiaoViec : data?.CachGiaoViec}</Text>
                </View>
                <View style={styles.padding}>
                    <Text style={styles.text_nor}>{RootLang.lang.JeeWork.yeucau}:</Text>
                    <Text style={styles.text_data}>{data[0] ? data[0]?.ThoiGian : data?.ThoiGian}</Text>
                </View>
                <View style={styles.padding}>
                    <Text style={styles.text_nor}>{RootLang.lang.JeeWork.hanchodukien}:</Text>
                    <Text style={styles.text_data}>{data[0] ? data[0]?.HanChot ? Utils.formatTimeAgo(moment(data[0]?.HanChot).format('MM/DD/YYYY HH:mm:ss'), 2, true) :
                        Utils.formatTimeAgo(moment(data?.HanChot).format('MM/DD/YYYY HH:mm:ss'), 2, true) : "--"}</Text>
                </View>
                <View style={styles.padding}>
                    <Text style={styles.text_nor}>{RootLang.lang.JeeWork.nguoithuchien}:</Text>
                    {
                        data[0]?.IsEdit ? (
                            <TouchableOpacity style={styles.touchNguoiTH}
                                onPress={() => { this._Chonnguoi() }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.text_data}>{nguoiTH?.Title}</Text>
                                </View>
                                <Image source={Images.ImageJee.icDropdown} style={[{ width: Width(2), height: Width(3), marginRight: 5 }]} />
                            </TouchableOpacity>
                        ) : (
                                <View style={styles.viewNguoiTH}>
                                    <Text style={styles.text_data}>{nguoiTH}</Text>
                                </View>
                            )
                    }
                </View>
                <TouchableOpacity style={styles.touchLuu}
                    onPress={() => { this._ChuyenGiaiDoan() }}>
                    <Text style={styles.textLuu}>{RootLang.lang.JeeWork.luuvadong}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    _chonKetQua = () => {
        Utils.goscreen(this, 'Modal_ComponentSelectCom', { callback: this._callbackKetQua, item: this.state.ketQua, AllThaoTac: this.state.data?.KetQua, ViewItem: this.ViewItemKetQua })
    }

    _callbackKetQua = (item) => {
        try {
            this.setState({
                ketQua: item
            }, async () => {
                this._callbackGetData(item)
            })
        } catch (error) { }
    }

    _callbackGetData = (item) => {
        this._goBack()
        this.callbackGetData(item)
    }

    ViewItemKetQua = (item) => {
        return (
            <View key={item.RowID.toString()} style={{ flexDirection: "row", alignSelf: "center" }}>
                <Text style={{
                    textAlign: "center", fontSize: reText(16),
                    alignSelf: "center",
                    color: item.color ? item.color : item.Title == 'Duyệt' ? '#0A9562' : '#FC0030',
                    fontWeight: this.state.nguoiTH.RowID == item.RowID ? "bold" : 'normal'
                }}>{item.Title ? item.Title : ""}</Text>
            </View>
        )
    }


    renderData() {
        const { opacity, data, ketQua } = this.state
        return (
            <View style={styles.flex}>
                <ScrollView style={{ flex: 1, }}>
                    <HTML source={{ html: data?.ContentStr ? `<div>${data?.ContentStr} </div>` : "<div></div>" }}
                        containerStyle={{ paddingHorizontal: 5, color: '#8F9294' }}
                        tagsStyles={{
                            div: { margin: 0, color: '#404040', paddingTop: 5, fontSize: reText(14) },
                        }} />
                    <Text style={styles.text_nor}>Chọn kết quả:</Text>
                    <TouchableOpacity style={styles.touchNguoiTH}
                        onPress={() => { this._chonKetQua() }}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.text_data}>{ketQua?.Title}</Text>
                        </View>
                        <Image source={Images.ImageJee.icDropdown} style={[{ width: Width(2), height: Width(3), marginRight: 5 }]} />
                    </TouchableOpacity>
                </ScrollView>
                <TouchableOpacity style={[styles.touchTroLai, {}]}
                    onPress={() => { this._goBack() }} >
                    <Text style={styles.text_nor}>{RootLang.lang.JeeWork.trolai}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        const { opacity, data, nguoiTH } = this.state

        return (
            <View style={[nstyles.ncontainer, { backgroundColor: 'transparent', justifyContent: 'flex-end', opacity: 1, }]} >
                <Animated.View onTouchEnd={() => this._goBack()}
                    style={{
                        position: 'absolute', top: 0,
                        bottom: 0, left: 0, right: 0,
                        backgroundColor: colors.backgroundModal, opacity
                    }} />
                <View style={styles.viewHome}>
                    <HeaderModalCom title={RootLang.lang.JeeWork.chuyengiaidoan} onPress={this._goBack}></HeaderModalCom>

                    {data && data[0] ? this.renderData0() : this.renderData()}

                    <IsLoading></IsLoading>
                </View>
            </View>

        );
    }
};


const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});

const styles = StyleSheet.create({
    viewHome: {
        backgroundColor: 'white', paddingHorizontal: 10, borderTopRightRadius: 15, borderTopLeftRadius: 15, paddingBottom: paddingBotX,
        maxHeight: nHeight(80), minHeight: nHeight(50),
    },
    title: {
        fontSize: reText(16), fontWeight: 'bold'
    },
    text_nor: {
        fontSize: reText(14),
    },
    text_data: {
        fontSize: reText(15), marginTop: 5
    },
    padding: {
        paddingTop: 10
    },
    touchNguoiTH: {
        paddingVertical: 2, flexDirection: 'row', borderBottomWidth: 0.5, borderColor: colors.colorGrayBgr, alignItems: 'center'
    },
    viewNguoiTH: {
        paddingBottom: 5, flexDirection: 'row', borderBottomWidth: 0.5, borderColor: colors.colorGrayBgr, alignItems: 'center'
    },
    touchLuu: {
        paddingVertical: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.greenButton, width: Width(50), alignSelf: 'center', marginTop: 20, borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.25,
        shadowRadius: 1,
        elevation: 5,
    },
    flex: {
        flex: 1
    },
    touchTroLai: {
        paddingVertical: 10, justifyContent: 'center', alignItems: 'center', width: Width(50), alignSelf: 'center', marginTop: 20, borderRadius: 20,
        backgroundColor: colors.white, borderWidth: 0.5, borderColor: colors.gray1, shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.25,
        shadowRadius: 1,
        elevation: 5,
    },
    textLuu: {
        fontSize: reText(14), color: colors.white
    }

});

export default Utils.connectRedux(ChuyenGiaiDoan_QT, mapStateToProps, true)


