import moment from 'moment';
import React from 'react';
import {
    StyleSheet, Text,
    TouchableOpacity, View
} from 'react-native';
import { RootLang } from '../../../app/data/locales';
import Utils from '../../../app/Utils';
import { colors, fonts, sizes } from '../../../styles';
import { reText } from '../../../styles/size';
import { nstyles } from '../../../styles/styles';

const ItemDuyetGiaiTrinh = (props) => {
    const {
        item,
        onPress = () => { },
    } = props;

    let color = colors.apricot;
    let status = item.TinhTrang;
    const tmp = item.Valid;
    switch (tmp) {
        case null:
            status = RootLang.lang.scduyetgiaitrinhchamcong.choduyet;
            color = colors.orangeSix;
            break;
        case true:
            status = RootLang.lang.scduyetgiaitrinhchamcong.duyet;
            color = colors.bluishGreen;
            break;
        case false:
            status = RootLang.lang.scduyetgiaitrinhchamcong.khongduyet;
            color = colors.coralTwo;
            break;
        default:
            break;
    }

    return (
        <TouchableOpacity
            onPress={onPress}
            key={item.ID_Row}
            style={[nstyles.nrow, {
                flex: 1,
                paddingVertical: 15, backgroundColor: colors.white,
                paddingHorizontal: 10,
                alignItems: 'center', justifyContent: 'center'
            }]}>
            <View style={{ flex: 1, flexDirection: 'row', height: '100%', }}>
                <View style={{ alignItems: 'center', }}>
                    <Text  style={{
                        fontFamily: fonts.HelveticaBold,
                        color: colors.orangeSix,
                        fontSize: sizes.sText16, lineHeight: reText(22),
                    }}>
                        {item.NgayGui ? moment(item.NgayGui).format('DD') : '...'}
                    </Text>
                    <View style={{ height: 1, backgroundColor: colors.orangeSix, width: '100%' }}></View>
                    <Text  style={{
                        fontFamily: fonts.Helvetica,

                        color: colors.orangeSix,
                        fontFamily: fonts.HelveticaBold,
                        fontSize: sizes.sizes.sText10, lineHeight: reText(16),
                    }}>
                        {item.Thu ? item.Thu : '...'}
                    </Text>

                </View>
                <View style={{ flex: 1, paddingLeft: 10 }}>
                    <View style={{ flex: 1 }}>
                        <View style={{ flex: 1, flexDirection: 'row', }}>
                            <Text  style={{
                                fontSize: sizes.sText14, lineHeight: reText(17), flex: 1,
                                fontFamily: fonts.Helvetica, color: colors.colorTextBack80
                            }}
                                numberOfLines={2}
                            >{item.NhanVien}</Text>
                            <Text  style={{
                                fontFamily: fonts.HelveticaBold,
                                color: color,
                                fontSize: sizes.sText12, lineHeight: reText(14),
                            }}>{item.TinhTrang}</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row', }}>
                            <Text  style={{
                                flex: 1,
                                fontFamily: fonts.Helvetica,
                                color: colors.colorGrayLight,
                                fontSize: sizes.sText12, lineHeight: reText(14),
                            }}>{item.ChucVu}</Text>

                        </View>
                    </View>

                </View>
            </View>
        </TouchableOpacity>


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
export default Utils.connectRedux(ItemDuyetGiaiTrinh, mapStateToProps, true)