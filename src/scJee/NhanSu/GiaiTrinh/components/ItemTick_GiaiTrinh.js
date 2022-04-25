import moment from 'moment';
import React, { Fragment } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Utils from '../../../app/Utils';
import { Images } from '../../../images';
import { colors } from '../../../styles';
import { sizes } from '../../../styles/size';
import { nstyles } from '../../../styles/styles';

const ItemTick_GiaiTrinh = (props) => {
    let {
        item,
        index,
        onClick = () => { },
        onPressDetail = () => { }
    } = props;

    const onPress = () => {
        onClick(item);
    }

    return (
        <View
            key={index}
            style={[nstyles.nrow, { justifyContent: 'space-between' }]}>
            <TouchableOpacity onPress={onPress} style={{ paddingRight: 15, paddingVertical: 25 }}>
                <Image source={item.IsDuyet == true ? Images.icCheck : Images.icUnCheck} style={nstyles.nIcon16} resizeMode={'cover'} />
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1 }}
                onPress={onPressDetail}>
                <View underlayColor={colors.brownGreyTwo} onPress={onPress} activeOpacity={1} style={[styles.containerItem, { backgroundColor: colors.white }]}>
                    <Fragment>
                        <View style={[styles.title]}>
                            <Text  style={[styles.text_title, { color: colors.colorTabActive }]}>{item.Ngay ? `${item.Thu ? item.Thu : '...'} - ` + moment(item.Ngay).format('DD/MM/YYYY') : '...'}</Text>
                            <Text  style={{ color: colors.black, fontSize: sizes.sText12 }}>{item.GioChamCong}</Text>
                        </View>
                        <View style={styles.title_mini}>
                            <Text  style={{ fontSize: sizes.sText12, color: colors.brownGreyTwo }}>{item.GioCanSua + " đúng"}</Text>
                            <Text  style={[styles.time, { color: colors.colorOrange }]}>{`${item.GioVaoDung ? moment(item.GioVaoDung).format('HH:mm') : ""} - ${item.GioRaDung ? moment(item.GioRaDung).format('HH:mm') : ''}`}</Text>
                        </View>
                        <Text  style={[styles.content, { color: colors.black }]} numberOfLines={2}>{item.LyDo}</Text>
                    </Fragment>
                </View>
            </TouchableOpacity>
        </View >
    )
}
const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(ItemTick_GiaiTrinh, mapStateToProps, true)
const styles = StyleSheet.create({
    containerItem: {
        padding: 15,
        // marginHorizontal: 15,
        marginRight: 25,
        marginTop: 8,
        ...nstyles.shadow
    },
    title: {
        justifyContent: 'space-between',
        ...nstyles.nrow
    },
    text_title: {
        fontSize: sizes.sText16,
        color: colors.white,
        fontWeight: 'bold'
    },
    title_mini: {
        marginTop: 14,
        justifyContent: 'space-between',
        ...nstyles.nrow
    },
    time: {
        fontSize: sizes.sText16,
        color: colors.white,
        fontWeight: 'bold'
    },
    content: {
        marginTop: 10,
        color: colors.white
    }
})
