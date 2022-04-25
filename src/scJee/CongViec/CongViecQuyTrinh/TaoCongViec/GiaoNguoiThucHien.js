import React, { Component } from 'react';
import { Animated, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GetNguoiThucHienDuKien, UpdateNVTheoDoi } from '../../../../apis/JeePlatform/API_JeeWork/apiCongViecQuyTrinh';
import { RootLang } from '../../../../app/data/locales';
import Utils from '../../../../app/Utils';
import UtilsApp from '../../../../app/UtilsApp';
import IsLoading from '../../../../components/IsLoading';
import HeaderModalCom from '../../../../Component_old/HeaderModalCom';
import { Images } from '../../../../images';
import { colors } from '../../../../styles';
import { reText } from '../../../../styles/size';
import { nHeight, nstyles, paddingBotX, Width } from '../../../../styles/styles';
class GiaoNguoiThucHien extends Component {
    constructor(props) {
        super(props)
        this.callback = Utils.ngetParam(this, 'callback',),
            this.state = {
                opacity: new Animated.Value(0),
                id: Utils.ngetParam(this, 'id', ''),
                listnguoiTH: [],
                nguoiTH: ''
            }
        this.callback = Utils.ngetParam(this, 'callback',)
    }

    componentDidMount() {
        this._startAnimation(0.8)
        this._getNguoiThucHienDuKien()
        nthisLoading.show()
    }

    _getNguoiThucHienDuKien = async () => {
        let res = await GetNguoiThucHienDuKien(this.state.id)
        // Utils.nlog('res _getNguoiThucHienDuKien', res)
        if (res.status == 1) {
            this.setState({
                listnguoiTH: res.data
            })
            nthisLoading.hide()
        }
        else {
            nthisLoading.hide()
            UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, res.error ? res.error.message : RootLang.lang.JeeWork.uploadfilethatbaivuilong, 2)
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


    _ChonNguoi = () => {

        Utils.goscreen(this, 'Modal_ComponentSelectCom', { callback: this._callbackChonNguoi, item: this.state.nguoiTH, AllThaoTac: this.state.listnguoiTH, ViewItem: this.ViewItemChonNguoi })
    }

    _callbackChonNguoi = (nguoiTH) => {
        try {
            setTimeout(() => {
                this.setState({
                    nguoiTH
                })
            }, 500);
        } catch (error) { }
    }

    ViewItemChonNguoi = (item) => {
        return (
            <View key={item.RowID.toString()} style={{ flexDirection: "row", alignSelf: "center" }}>
                <Text style={{
                    textAlign: "center", fontSize: reText(16),
                    alignSelf: "center",
                    color: item.color,
                    fontWeight: this.state.nguoiTH.RowID == item.RowID ? "bold" : 'normal'
                }}>{item.Title ? item.Title : ""}</Text>
            </View>
        )
    }

    _updateNhanVienTheoDoi = async () => {
        //WorkType: 1 công việc, 2 công việc con, 3 quy trình
        // Type: 1 người thực hiện, 2 người theo dõi quy trình, 3 người theo dõi giai đoạn
        nthisLoading.show()
        let body = {
            "ID": this.state.id,
            "NVIDList": [this.state.nguoiTH.RowID],
            "Type": 1,
            "WorkType": 1
        }
        // Utils.nlog('body', body)
        const res = await UpdateNVTheoDoi(body)
        // Utils.nlog('res _updateNhanVienTheoDoi', res)
        if (res.status == 1) {
            UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, RootLang.lang.JeeWork.capnhatthanhcong, 1)
            nthisLoading.hide()
            this._done()
        }
        else {
            nthisLoading.hide()
            UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, res.error ? res.error.message : RootLang.lang.JeeWork.uploadfilethatbaivuilong, 2)
        }
        // return true
    }

    _done = () => {
        this.callback()
        this._goBack()
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
                    <HeaderModalCom title={RootLang.lang.JeeWork.giaonguoithuchien} onPress={this._goBack}></HeaderModalCom>
                    <View style={{ flex: 1 }}>
                        <View style={styles.padding}>
                            <Text style={styles.text_nor}>{RootLang.lang.JeeWork.nguoithuchien}:</Text>
                            <TouchableOpacity style={styles.touchNguoiTH}
                                onPress={() => { this._ChonNguoi() }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.text_data}>{nguoiTH?.Title}</Text>
                                </View>
                                <Image source={Images.ImageJee.icDropdown} style={[{ width: Width(2), height: Width(3), marginRight: 5 }]} />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.touchLuu} onPress={() => { this._updateNhanVienTheoDoi() }}>
                            <Text style={styles.textLuu}>{RootLang.lang.JeeWork.luuvadong}</Text>
                        </TouchableOpacity>
                    </View>
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
        maxHeight: nHeight(80), minHeight: nHeight(40)
    },
    title: {
        fontSize: reText(16), fontWeight: 'bold'
    },
    text_nor: {
        fontSize: reText(14),
    },
    text_data: {
        fontSize: reText(15),
    },
    padding: {
        paddingTop: 10
    },
    touchNguoiTH: {
        paddingVertical: 10, flexDirection: 'row', borderBottomWidth: 0.5, borderColor: colors.colorGrayBgr, alignItems: 'center'
    },
    touchLuu: {
        paddingVertical: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.greenButton, width: Width(50), alignSelf: 'center', marginTop: 20, borderRadius: 20
    },
    textLuu: {
        fontSize: reText(14), color: colors.white
    }
});

export default Utils.connectRedux(GiaoNguoiThucHien, mapStateToProps, true)


