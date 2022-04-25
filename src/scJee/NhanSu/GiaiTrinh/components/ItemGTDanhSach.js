import moment from 'moment';
import React from 'react';
import {
    Image, StyleSheet, Text,
    TouchableOpacity, View
} from 'react-native';
import { RootLang } from '../../../../app/data/locales';
import Utils from '../../../../app/Utils';
import { Images } from '../../../../images';
import { colors } from '../../../../styles';
import { reText } from '../../../../styles/size';
import { nstyles, paddingBotX } from '../../../../styles/styles';


const color = (item) => {
    if (item.Approved == null) {
        if (item.NgayGui == null) {
            return '#828282'
        }
        return colors.checkAwait
    }
    else if (item.Approved == false) {
        return colors.checkCancle
    }
    else if (item.Approved == true) {
        return colors.checkGreen
    }
}

const ItemGTDanhSach = (props) => {
    const {
        item,
        isLast = false,
        onPress = () => { },
        showThang = false,
        checkBot = false,
        lengthGT = 0,
    } = props;
    return (
        <View style={{
            marginBottom: isLast ? 116 + paddingBotX : 0, borderTopLeftRadius: showThang || lengthGT == 1 ? 10 : 0, borderTopRightRadius: showThang || lengthGT == 1 ? 10 : 0, marginHorizontal: 10, backgroundColor: colors.white,
            borderBottomLeftRadius: checkBot ? 10 : 0, borderBottomRightRadius: checkBot ? 10 : 0,
        }}>
            <TouchableOpacity
                activeOpacity={1}
                style={{
                    borderTopLeftRadius: showThang || lengthGT == 1 ? 10 : 0, borderTopRightRadius: showThang || lengthGT == 1 ? 10 : 0, backgroundColor: colors.white,
                    borderBottomLeftRadius: checkBot ? 10 : 0, borderBottomRightRadius: checkBot ? 10 : 0,
                }}
                onPress={onPress}>
                <View style={{ paddingHorizontal: 10, paddingVertical: 15, flexDirection: 'row' }}>
                    <Image
                        source={item?.Approved ? Images.ImageJee.icBrowser : item?.Approved == false ? Images.ImageJee.icUnBrowser : Images.ImageJee.ic_ChoDuyet}
                        style={[{ width: 20, height: 20 }]}
                    />
                    <View style={styles.subBody}>
                        <View style={nstyles.nbody}>
                            <Text style={{ color: '#333333', fontSize: reText(14) }}>
                                {/* {item.NhanVien} */}
                                {RootLang.lang.scgiaitrinhchamcong.title}
                            </Text>
                            <Text style={{ marginTop: 5, color: colors.colorNoteJee, fontSize: reText(11) }}>
                                {/* chổ này api cần đưa về date Z (UTC) */}
                                {item.NgayGui ? moment(item.NgayGui).add(7, 'hours').format('HH:mm ddd, DD/MM/YYYY') : '--'}
                            </Text>
                        </View>
                        <View>
                            <Text style={{ marginBottom: 20, color: color(item), textAlign: 'right', fontSize: reText(14), fontWeight: 'bold' }}>
                                {item.TinhTrang}
                            </Text>

                        </View>
                    </View>
                </View>
                {checkBot == true ? null : <View style={{ height: 0.5, backgroundColor: colors.colorLineJee, width: '86%', alignSelf: 'flex-end', marginRight: 10 }} />}
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    viewContainer: {
        paddingHorizontal: 15,
        // paddingTop: 8,
    },
    viewBody: {
        ...nstyles.shadow,
        ...nstyles.nrow,
        // marginTop: 5,
        backgroundColor: colors.white,
        paddingVertical: 20,
        paddingLeft: 14,
        paddingRight: 10,
        shadowColor: colors.black_10
    },
    subBody: {
        ...nstyles.nbody,
        ...nstyles.nrow,
        justifyContent: 'space-between',
        marginLeft: 14,
        // backgroundColor: 'yellow'
    }
})

const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(ItemGTDanhSach, mapStateToProps, true)