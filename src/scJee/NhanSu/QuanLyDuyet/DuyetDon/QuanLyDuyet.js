import React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RootLang } from '../../../../app/data/locales';
import Utils from '../../../../app/Utils';
import { Images } from '../../../../images';
import { colors } from '../../../../styles';
import { reText } from '../../../../styles/size';
const COLOR_ACTIVE = '#13807A'  // Màu mới của VHR
const COLOR_NONEACTIVE = '#777777'

const QuanLyDuyet = (props) => {
    const Screen = [
        {
            screen: "sc_homeduyet",
            id: 1,
            icon: Images.icDuyetPhep,
            title: RootLang.lang.thongbaochung.duyetphep
        },
        {
            screen: "sc_homelichsu",
            id: 2,
            icon: Images.icLichSu,
            title: RootLang.lang.thongbaochung.lichsu
        },

    ]
    const tabClick = (screen, index) => {
        const { DuyetDonReducer = {} } = props;
        //chuyển tab khởi tạo lại biến loading và loadmore
        props.SetLoadmore(false);
        props.SetLoading(false);
        // Utils.nlog("gia tri tong-----------------", DuyetDonReducer.tong)
        if (DuyetDonReducer.isRemove == true && index == 1 && DuyetDonReducer.valueTypeLichSu != '') {
            // Utils.nlog("vao get lai danh sách tab lich sử------------------")
            props.GET_DSDUYETDON(1, 10, `1|${DuyetDonReducer.valueTypeLichSu ? DuyetDonReducer.valueTypeLichSu : ''}`, index)
        }
        Utils.goscreen({ props }, screen, { idtab: index });
    }
    const renderItem = (item, index2) => {
        const { DuyetDonReducer = {} } = props;

        const { index } = props.state;
        let tempIndex = index;
        if (index == 0 || index >= Screen.length)
            tempIndex = 0;
        return (
            <TouchableOpacity
                onPress={() => tabClick(item.screen, index2)}
                key={item.id} style={{ flex: 1, paddingHorizontal: 10, alignItems: 'center', justifyContent: 'center', }}>
                <View>
                    <Image source={item.icon} resizeMode={'contain'} style={[styles.st_icon, { tintColor: index2 == tempIndex ? COLOR_ACTIVE : COLOR_NONEACTIVE }]} />
                    {
                        index2 == 0 && DuyetDonReducer.tong > 0 ? <View style={{
                            position: 'absolute',
                            top: -5, right: -5,
                            backgroundColor: colors.redFresh,
                            borderRadius: 10,
                        }}>
                            <Text style={{ fontSize: reText(8), padding: 3, paddingHorizontal: 5, color: colors.white, fontWeight: 'bold' }}>{DuyetDonReducer.tong}</Text>
                        </View> : null
                    }
                </View>
                <Text style={{ marginTop: 4, fontSize: reText(8), color: index2 == tempIndex ? COLOR_ACTIVE : COLOR_NONEACTIVE }}>{item.title}</Text>

            </TouchableOpacity >)
    }
    return (
        <View>
            <View style={{ width: '100%', height: 0.5, backgroundColor: colors.colorGrayBgr }}></View>
            <View style={[{ paddingVertical: 5, width: '100%', flexDirection: 'row', height: 70 - (Platform.OS == 'ios' ? 0 : 10), backgroundColor: colors.white }]}>
                {
                    Screen.map(renderItem)
                }
            </View>
        </View>

    )
}
const styles = StyleSheet.create({
    st_icon: {
        width: 26,
        height: 24
    }
})
// DuyetDonReducer
// export default TabBottom
const mapStateToProps = state => ({
    lang: state.changeLanguage.language,
    DuyetDonReducer: state.DuyetDonReducer
});
export default Utils.connectRedux(QuanLyDuyet, mapStateToProps, true)
