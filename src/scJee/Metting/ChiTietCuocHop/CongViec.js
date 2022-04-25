import React, { Component } from 'react'
import { FlatList, StyleSheet, Text, View, Image, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native'
import ListEmpty from '../../../components/ListEmpty'
import nAvatar from '../../../components/pickChartColorofAvatar'
import { nstyles, Width, Height } from '../../../styles/styles'
import { Images } from '../../../images'
import { colors } from '../../../styles'
import ButtonCom from '../../../components/Button/ButtonCom'
import Utils from '../../../app/Utils';
import { postTaoCongViec } from '../../../apis/JeePlatform/API_JeeMeeting/apiChiTietCuocHop'
import UtilsApp from '../../../app/UtilsApp'
import { reText } from '../../../styles/size'
import IsLoading from '../../../components/IsLoading'
import { RootLang } from '../../../app/data/locales'
import HeaderAnimationJee from '../../../components/HeaderAnimationJee'
export class CongViec extends Component {
    constructor(props) {
        super(props)
        this.rowid = Utils.ngetParam(this, 'rowid')
        this.reload = Utils.ngetParam(this, 'reload')
        this.state = {
            tenCongViec: '',
            warning: false
        }
    }
    taoCongViec = async () => {
        const { tenCongViec } = this.state
        nthisLoading.show()
        if (tenCongViec == '') {
            nthisLoading.hide()
            this.setState({ warning: true })
            UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, RootLang.lang.JeeWork.tencongvieckhongdetrong, 4)
            nthisLoading.hide()
            return
        }
        let strBody = {
            title: tenCongViec,
            meetingid: this.rowid
        }
        let res = await postTaoCongViec(strBody)
        // let res = { status: 1 }
        // Utils.nlog('Tạo công việc: ', res)
        if (res.status == 1) {
            nthisLoading.hide()
            this.reload()
            this._goback()
            UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, RootLang.lang.JeeWork.taocongviecthanhcong, 1)
        }
        else {
            nthisLoading.hide()
            UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, res.error ? res.error.message : RootLang.lang.JeeWork.laydulieuthatbai, 2)
        }
    }
    _goback = () => {
        Utils.goback(this)
    }
    render() {
        const { warning } = this.state
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <>
                    <HeaderAnimationJee isGoBack={true} OnGoBack={this._goback} nthis={this} Screen={true} title={'Công việc'} />
                    <View style={[nstyles.ncontainer, { backgroundColor: colors.backgroudJeeHR }]} >
                        <View style={styles.viewCongViec}>
                            <Text style={styles.titleCongViec}>Công việc</Text>
                            <TextInput
                                placeholder={RootLang.lang.JeeWork.nhaptencongviec}
                                placeholderTextColor={warning ? 'red' : null} style={styles.inputCongViec}
                                onChangeText={(value) => this.setState({ tenCongViec: value })}></TextInput>
                        </View>
                        <ButtonCom
                            text={RootLang.lang.JeeWork.themcongviec}
                            styleButton={{
                                position: 'absolute', bottom: 30, width: Width(80), alignSelf: 'center',
                                shadowOffset: { width: 0, height: 1 },
                                shadowRadius: 2,
                                elevation: 2,
                                shadowOpacity: 0.4
                            }}
                            style={{ backgroundColor: colors.colorTabActive, backgroundColor1: colors.colorTabActive, borderRadius: 5 }}
                            txtStyle={{ color: colors.white, fontSize: reText(16) }}
                            onPress={() => this.taoCongViec()}
                        />
                        <IsLoading></IsLoading>
                    </View>
                </>
            </TouchableWithoutFeedback>
        )
    }
}
const styles = StyleSheet.create({
    viewList: {
        flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 15, backgroundColor: 'white', justifyContent: 'space-between', alignItems: 'center',
        borderBottomColor: colors.textGray, borderBottomWidth: 0.5
    },
    viewTitle: {
        flexDirection: 'row', alignItems: 'center'
    },
    viewColor: {
        ...nstyles.nIcon16, marginLeft: 5, marginRight: 15
    },
    viewCongViec: {
        paddingHorizontal: 15, marginTop: 15
    },
    titleCongViec: {
        fontSize: 16, fontWeight: '500', color: colors.colorTabActive
    },
    inputCongViec: {
        paddingVertical: 15, marginTop: 10, borderWidth: 1, borderColor: 'gray', paddingHorizontal: 10, borderRadius: 5,

        // shadowOffset: { width: 1, height: 1 }, shadowRadius: 8, elevation: 2, shadowOpacity: 0.2
    }
})
export default CongViec
