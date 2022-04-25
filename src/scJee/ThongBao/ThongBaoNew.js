import { useNavigation, useFocusEffect } from '@react-navigation/native'
import React, { useState, useRef } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Linking } from 'react-native'
import { getDsThongBao, PostDsRead, PostDsReadAll } from '../../apis/apiThongBao'
import UtilsApp from '../../app/UtilsApp'
import HeaderComStackV2 from '../../components/HeaderComStackV2'
import { Images } from '../../images'
import { colors } from '../../styles'
import { Width, nstyles, Height } from '../../styles/styles'
import { reText, sizes } from '../../styles/size'
import IsLoading from '../../components/IsLoading'
import { useSelector, useDispatch } from 'react-redux'
import { Get_ThongBao } from '../../srcRedux/actions'
import Utils from '../../app/Utils'
import LottieView from 'lottie-react-native';
import moment from 'moment'
import { RootLang } from '../../app/data/locales'
import { nkey } from '../../app/keys/keyStore'
import ImageCus from '../../components/NewComponents/ImageCus'
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import HeaderAnimationJee from '../../components/HeaderAnimationJee'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
    txtNoiDungThongBao: {
        fontSize: reText(14),
        lineHeight: 20,
        // textAlign: 'justify',
    },
    textTime: {
        color: colors.greenTab,
        fontSize: reText(12),
        width: Width(70),
        fontStyle: 'italic'
    },
    item: {
        flexDirection: 'row',
        paddingVertical: 15,
        paddingHorizontal: 10,
        // borderBottomWidth: 0.5,
        // borderBottomColor: colors.black_20,
    },
    imgAvatar: {
        ...nstyles.nAva60,
        alignSelf: 'center',
        marginRight: 5
    }
})


const ThongBaoNew = (props) => {
    const navigation = useNavigation();
    const [dsThongBao, setDsThongBao] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [checkLoadding, setCheckLoadding] = useState(false)
    const dispatch = useDispatch()
    const _GoBack = () => {
        // navigation.reset({
        //     index: 0,
        //     routes: [{ name: 'sw_HomePage' }],
        // });
        Utils.goback({ props: props }, null)
    }
    useFocusEffect(
        React.useCallback(() => {
            _GetDsThongBao();
        }, [])
    );  // mỗi khi khỏi tạo screen sẽ get api 

    const _GetDsThongBao = async () => {
        let dataThongBao = await Utils.ngetStorage(nkey.dataThongBao, [])
        if (dataThongBao.length == 0) {
            setCheckLoadding(true)
        }
        setDsThongBao(dataThongBao);
        let data = await getDsThongBao();
        // Utils.nlog('res _GetDsThongBao', data)
        if (data.status === 1) {
            let a = Object.values(data)
            a.splice(a.length - 3, 3)
            setDsThongBao(a);
            setIsLoading(false)
            Utils.nsetStorage(nkey.dataThongBao, a)
            setCheckLoadding(false)
        }
        else {
            setIsLoading(false)
            setCheckLoadding(false)
            UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, data.error ? data.error.message : RootLang.lang.JeeWork.laydulieuthatbai, 2)
        }
    }
    const _CheckRead = async (item) => {
        item.osAppURL == "null" || !item.osAppURL ?
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, 'Không thể xem!', 3) : Linking.openURL(item.osAppURL)
        let check = dsThongBao.filter(item => item.isRead === false)
        if (check.length > 0) {
            await PostDsRead(item._id);
            _GetDsThongBao();
            dispatch(Get_ThongBao())
            // Linking.openURL(item.osAppURL)
            return
        }
        return;
        // return Utils.showMsgBoxOK({ props: props }, RootLang.lang.thongbaochung.thongbao, 'Đã đọc tin này', RootLang.lang.thongbaochung.xacnhan);
    }


    const _CheckReadAll = async () => {
        Utils.showMsgBoxYesNo({ props: props }, 'Thông báo', 'Bạn có muốn đánh dấu là đã xem tất cả', 'Chấp nhận', 'Huỷ', async () => {
            setCheckLoadding(true)
            let data = await PostDsReadAll();
            if (data.status == 1) {
                _GetDsThongBao();
                dispatch(Get_ThongBao())
                return;
            }
        })

    }
    const _onRefresh = async () => {
        setIsLoading(true)
        _GetDsThongBao();
    }

    const _renderItemLoad = () => {
        return (
            <View style={{ marginTop: 20, width: Width(100) }}>
                <SkeletonPlaceholder>
                    <View style={{ flexDirection: 'row', paddingHorizontal: 10, width: Width(100) }}>
                        <View style={{ width: sizes.nImgSize60, height: sizes.nImgSize60, borderRadius: 50 }} />
                        <View style={{ marginLeft: 7 }}>
                            <View style={{ width: Width(40), height: Width(3), borderRadius: 5, marginTop: 5 }} />
                            <View style={{ width: Width(56), height: Width(3), borderRadius: 5, marginTop: 5 }} />
                            <View style={{ width: Width(70), height: Width(2), borderRadius: 5, marginTop: 10 }} />
                        </View>
                    </View>
                </SkeletonPlaceholder>
                <View style={{ height: 0.5, width: Width(100), backgroundColor: colors.black_20_2, marginTop: 13, alignSelf: 'flex-end' }} />
            </View>
        )
    }

    const renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity onPress={() => _CheckRead(item)} style={[styles.item, { backgroundColor: !item.isRead ? '#CEF6EC' : colors.white, width: Width(100), justifyContent: 'center' }]}>
                <View style={{ width: Width(15), height: Width(15), justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                    {item?.message_json?.Img != "" ?
                        <ImageCus
                            defaultSourceCus={Images.JeeAvatarBig}
                            source={{ uri: item.message_json.Img }}
                            style={styles.imgAvatar}
                            resizeMode='cover'
                        />
                        :
                        <Image source={Images.JeeAvatarBig} style={styles.imgAvatar} />}
                    {item?.osIcon ?
                        <ImageCus
                            defaultSourceCus={Images.JeeAvatarBig}
                            source={{ uri: item.osIcon }}
                            style={{ width: 20, height: 20, position: 'absolute', bottom: 0, right: 0 }}
                            resizeMode='cover'
                        />
                        : null}
                </View>
                <View style={{ paddingHorizontal: 10, width: Width(77) }}>
                    <View style={{ paddingVertical: 5 }}>
                        <Text numberOfLines={2} lineBreakMode={'head'} style={styles.txtNoiDungThongBao} >{item?.message_text}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.textTime}>{moment(item?.createdDate).format('DD/MM/YYYY') == moment().format('DD/MM/YYYY') ? moment(item?.createdDate).format('HH:mm') + ' - Hôm nay' : moment(item?.createdDate).format('HH:mm - DD/MM/YYYY')}</Text>
                        {/* <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end' }} >
                            {!item.isRead ? <View style={{ width: 10, height: 10, backgroundColor: colors.greenTab, borderRadius: 10 }}></View> : null}
                        </View> */}
                        {/* {!item.isRead ?
                            <LottieView
                                source={require('../../images/lottieJee/noti.json')}
                                style={{ width: Width(6) }}
                                loop={true}
                                autoPlay={true}
                            /> : null} */}
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    // Utils.nlog('bi render')
    return (
        <View style={styles.container} >
            <HeaderAnimationJee
                title={'Thông báo'}
                iconLeft={Images.ImageJee.icBack}
                onPressLeft={_GoBack}
                styBorder={{
                    borderBottomColor: colors.black_20,
                    borderBottomWidth: 0.5
                }}
                iconRight={Images.ImageJee.icDoubleCheck}
                onPressRight={_CheckReadAll}
                styIconRight={{ width: Width(6), height: Width(6) }}
            />
            {checkLoadding ?
                <FlatList
                    data={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
                    renderItem={_renderItemLoad}
                    keyExtractor={(item, index) => index.toString()}
                /> :
                <FlatList
                    // ItemSeparatorComponent={() => { return <View style={{ height: 0.5, backgroundColor: colors.black_10 }} /> }}
                    key={(item) => item.id}
                    keyExtractor={(item, index) => index.toString()}
                    data={dsThongBao}
                    renderItem={renderItem}
                    onEndReachedThreshold={0.01}
                    onRefresh={_onRefresh}
                    refreshing={isLoading}
                    removeClippedSubviews={true}
                    initialNumToRender={2}
                    maxToRenderPerBatch={5}
                    updateCellsBatchingPeriod={100}
                    windowSize={7}
                />}
        </View>
    )
}

export default ThongBaoNew

