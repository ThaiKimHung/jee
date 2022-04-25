import React, { Component } from 'react'
import { View, StyleSheet, TouchableOpacity, Text, ScrollView, BackHandler } from 'react-native'
import { nstyles, paddingBotX, Width } from '../../../../styles/styles'
import HeaderComStackV2 from '../../../../components/HeaderComStackV2'
import Utils from '../../../../app/Utils'
import { Images } from '../../../../images'
import HTML from "react-native-render-html";
import { colors } from '../../../../styles'
import { reText } from '../../../../styles/size'
import { isIphoneX } from 'react-native-iphone-x-helper'
import { postCapNhatTomTatKetLuan } from '../../../../apis/JeePlatform/API_JeeMeeting/apiChiTietCuocHop'
import UtilsApp from '../../../../app/UtilsApp'
export class ModalEditText extends Component {
    constructor(props) {
        super(props)
        this.type = Utils.ngetParam(this, 'type')
        this.rowid = Utils.ngetParam(this, 'rowid')
        this.reload = Utils.ngetParam(this, 'reload')
        this.state = {
            text: Utils.ngetParam(this, 'text'),
            edit: Utils.ngetParam(this, 'edit')
        }
    }
    componentDidMount() {
        // if (!this.state.text) {
        //     Utils.goscreen(this, 'ModalConvertHTML', { html: this.text, callback: (html) => this.setState({ text: html }) })
        // }
        this._backHandler = BackHandler.addEventListener('hardwareBackPress', this._backHandlerButton)
    }
    _backHandlerButton = () => {
        this._goback()
        return true
    }
    _goback = () => {
        Utils.goback(this)
    }
    luu = async () => {
        const body = {
            "NoiDung": this.state.text,
            "meetingid": this.rowid,
            "type": this.type
        }
        let res = await postCapNhatTomTatKetLuan(body)
        if (res.status == 1) {
            UtilsApp.MessageShow('Thông báo', 'Cập nhật thành công', 1)
            Utils.goback(this)
            this.reload()
        }
        else {
            UtilsApp.MessageShow('Thông báo', 'Cập nhật không thành công', 2)
        }
    }
    _goScreen = () => {
        Utils.goscreen(this, 'Modal_EditHTML', {
            title: 'Chỉnh sửa văn bản',
            isEdit: true,
            content: this.state.text,
            callback: (html) => this.setState({ text: html })
        })
        // Utils.goscreen(this, 'ModalEditHTML', { content: this.state.text, callback: (html) => this.setState({ text: html }) })

    }

    render() {
        const { edit } = this.state
        return (
            <View style={nstyles.ncontainer}>
                <HeaderComStackV2 title={this.type == 1 ? 'Tóm tắt cuộc họp' : 'Kết luận cuộc họp'} iconLeft={Images.ImageJee.icGoBack} onPressLeft={() => Utils.goback(this)} />
                <ScrollView>
                    {
                        this.state.text ?
                            <HTML source={{ html: this.state.text }} containerStyle={{ paddingHorizontal: 10, paddingVertical: 10 }} />
                            : edit ?
                                <TouchableOpacity
                                    style={{ borderWidth: 1, borderColor: colors.colorTabActive, paddingVertical: 10, marginHorizontal: 10, alignSelf: 'center', marginTop: 50, paddingHorizontal: 10, borderRadius: 5 }}
                                    onPress={() => this._goScreen()}>
                                    <Text style={{ fontSize: reText(14), color: colors.colorTabActive, textAlign: 'center' }}>{'Cuộc họp đang chờ tóm tắt từ bạn.'} <Text style={{ fontWeight: 'bold' }}>{'Viết Ngay!'}</Text></Text>
                                </TouchableOpacity>
                                :
                                <Text style={{ fontWeight: '700', alignSelf: 'center', marginTop: 10, color: colors.textGray }}>Không có nội dung hiển thị</Text>
                    }
                </ScrollView>
                {
                    edit ?
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginBottom: paddingBotX + 10, marginTop: 10 }}>
                            <TouchableOpacity style={{ width: Width(40), backgroundColor: colors.colorTabActive, paddingVertical: 10, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.luu()}>
                                <Text style={{ color: colors.white, fontSize: reText(16), fontWeight: 'bold' }}>Lưu</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ width: Width(40), backgroundColor: colors.colorTabActive, paddingVertical: 10, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}
                                onPress={() => this._goScreen()}>
                                <Text style={{ color: colors.white, fontSize: reText(16), fontWeight: 'bold' }}>Chỉnh sửa</Text>
                            </TouchableOpacity>
                        </View>
                        : null
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main: {
        flex: 1, marginTop: 2, paddingBottom: 1, alignItems: 'stretch',
    },
    toolbarButton: {
        fontSize: 20,
        width: 28,
        height: 28,
        textAlign: 'center'
    },
    italicButton: {
        fontStyle: 'italic'
    },
    boldButton: {
        fontWeight: 'bold'
    },
    underlineButton: {
        textDecorationLine: 'underline'
    },
    lineThroughButton: {
        textDecorationLine: 'line-through'
    },
});
export default ModalEditText
