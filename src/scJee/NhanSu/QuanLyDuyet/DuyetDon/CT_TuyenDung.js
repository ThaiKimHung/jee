import React, { Component } from 'react'
import { ScrollView, TextInput, View } from 'react-native'
import HeaderComStack from '../../../../components/HeaderComStack'
import { Images } from '../../../../images'
import { colors } from '../../../../styles'
import { reSize } from '../../../../styles/size'
import { Height } from '../../../../styles/styles'
import { ButtomCustom, ItemLineText, ItemLineTextAva, ItemMultiLine } from '../../../../Component_old/itemcom/itemcom';

export class CT_TuyenDung extends Component {
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: colors.white }}>
                <HeaderComStack nthis={this} title={'CHI TIẾT'} />
                <ScrollView style={{ marginHorizontal: 15 }}>
                    <View style={{ marginTop: 29, marginBottom: 25 }}>
                        <ItemLineTextAva title='Người đề xuất' value='Nguyễn Minh Thông' avatar={Images.icAva} />
                        <ItemLineText title='Chức vụ' value='Nhân viên Kỹ thuật' />
                        <ItemLineText title='Hình thức' value='Tuyển dụng' stTextRight={{ fontWeight: 'bold', color: colors.greenTab }} />
                        <ItemLineText title='Thời gian tuyển dụng' value=' 01/08/2020 - 31/08/2020' />
                        <ItemLineText title='Ngày gửi' value='20/07/2020 - 13:20' />
                        <ItemLineText title='Số phiếu' value='TDT8001' />
                        <ItemLineText title='Vị trí' value='Nhân viên thiết kế' stTextRight={{ color: colors.yellowColor }} />
                        <ItemLineText title='Hình thức' value='Tuyển mới' />
                        <ItemLineText title='Số lượng' value='01' />
                        <ItemMultiLine title='Mô tả công việc' value='Lorem ipsum dolor sit amet, consec tetuer adi piscing elit, sed diam nonummy nibh euismod tincidunt, consec tetuer adi piscing elit, sed diam nonummy nibh euismod tincidunt' />
                        <ItemMultiLine title='Nội dung' value='Lorem ipsum dolor sit amet, consec tetuer adi piscing elit, sed diam nonummy nibh euismod tincidunt, consec tetuer adi piscing elit, sed diam nonummy nibh euismod tincidunt' />

                        <TextInput
                            multiline={true}
                            style={{ backgroundColor: colors.colorBGHome, height: reSize(70), paddingHorizontal: 15 }}
                            placeholder={'Ghi chú'}
                        />
                        <View style={{ flexDirection: 'row', marginTop: Height(5) }}>
                            <ButtomCustom title={'Không duyệt'} />
                            <View style={{ marginHorizontal: 2 }}></View>
                            <ButtomCustom title={'Duyệt'} stColor={{ backgroundColor: colors.colorTabActive }} />
                        </View>

                    </View>
                </ScrollView>
            </View>
        )
    }
}

export default CT_TuyenDung
