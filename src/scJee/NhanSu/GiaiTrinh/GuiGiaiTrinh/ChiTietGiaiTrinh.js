import moment from 'moment'
import React, { Component, Fragment } from 'react'
import { Image, ScrollView, StyleSheet, Text, View, BackHandler, TouchableOpacity } from 'react-native'
import { SwipeListView } from 'react-native-swipe-list-view'
import { Get_DSChiTietGiaiTrinhID, HuyGiaiTrinh } from '../../../../apis/apiGiaiTrinh'
import { ROOTGlobal } from '../../../../app/data/dataGlobal'
import { RootLang } from '../../../../app/data/locales'
import Utils from '../../../../app/Utils'
import ButtonCom from '../../../../components/Button/ButtonCom'
import HeaderAnimationJee from '../../../../components/HeaderAnimationJee'
import { Images } from '../../../../images'
import { colors } from '../../../../styles'
import { reText, sizes } from '../../../../styles/size'
import { nstyles, paddingBotX } from '../../../../styles/styles'
import ItemGiaiTrinh from '../components/ItemGiaiTrinh'
import IsLoading from '../../../../components/IsLoading';
import _ from 'lodash'
import UtilsApp from '../../../../app/UtilsApp'
export class ChiTietGiaiTrinh extends Component {
    constructor(props) {
        super(props)
        this.deeplink = Utils.ngetParam(this, "deeplink")
        this.state = {
            RowID: Utils.ngetParam(this, "RowID", {}),
            KhungDuyet: {},
            dataItem: [],
            DataTemp: {},
            isGoBak: Utils.ngetParam(this, "isGoBak", false),
            valid: '',
            checkAPI: false
        }
    }
    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this._backHandlerButton)
        this._getChiTietGiaiTrinh();
    }
    componentWillUnmount() {
        this.backHandler.remove()
    }
    _backHandlerButton = () => {
        this._goback()
        return true
    }
    _getChiTietGiaiTrinh = async () => {
        const { RowID } = this.state;
        nthisLoading.show();
        const res = await Get_DSChiTietGiaiTrinhID(RowID);
        if (res.status == 1) {
            nthisLoading.hide();
            var { KhungDuyet } = res;
            var KhungDuyetCT = KhungDuyet ? KhungDuyet[KhungDuyet.length - 1] : {}
            this.setState({ dataItem: res.data, KhungDuyet: KhungDuyetCT, DataTemp: res, valid: KhungDuyetCT ? KhungDuyetCT.Valid : {}, checkAPI: true })
        } else {
            nthisLoading.hide();
            Utils.goback(this);
        }
    }
    _HuyGiaiTrinh = async () => {
        const { RowID } = this.state;
        const res = await HuyGiaiTrinh(RowID);
        if (res.status == 1) {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.thongbaochung.thuchienthanhcong, 1)
            if (ROOTGlobal.GTChamCong.getDSGT) {
                ROOTGlobal.GTChamCong.getDSGT();
            }
            Utils.goback(this);
        } else {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.thuchienthatbai, 2)
        }
    }
    renderLine = () => {
        return (
            <View style={{ width: '95%', height: 0.5, backgroundColor: colors.brownGreyTwo, alignSelf: 'center' }}></View>
        )
    }
    renderContent = (title = '', content = '', showLine = true, statusColor = -1) => {
        let color = colors.black
        switch (statusColor) {
            case 0:
                color = colors.redStar;
                break;
            case 1:
                color = colors.bluishGreen;
                break;
            case 2:
                color = colors.coralTwo;
                break;
            default:
                color = colors.black
                break;
        }
        return (
            <Fragment>
                <View style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    paddingHorizontal: 10,
                    paddingVertical: 15
                }}>
                    <Text style={{ color: colors.brownGreyTwo, fontSize: sizes.sText12 }}>{title}</Text>
                    <Text style={{ color: color, fontSize: sizes.sText16 }}>{content}</Text>
                </View>
                {showLine == true ? this.renderLine() : null}
            </Fragment>
        )
    }
    renderListEmpty = () => {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Image source={Images.icListEmpty} style={{ width: sizes.nImgSize200, height: sizes.nImgSize200 }} resizeMode={'cover'} />
                <Text style={{ fontSize: sizes.sText16, color: colors.brownGreyTwo }}>{RootLang.lang.thongbaochung.khongcodulieu}</Text>
            </View>
        )
    }
    _goback = () => {
        if (!this.deeplink)
            Utils.goscreen(this, 'sw_HomePage')
        else {
            if (this.state.isGoBak) {
                Utils.goback(this);
            } else {
                Utils.goback(this, null);
                Utils.goscreen(this, "sc_GiaiTrinh", { isBack: false });
            }
        }
    }

    renderInfo = (item) => {
        let Valid = item.KhungDuyet ? item.KhungDuyet[0].Valid : ''
        let colorBg = Valid ? colors.bgGreen : Valid == false ? colors.bgRed : (item.TinhTrangID == 2 ? colors.bgRed : colors.bgYellow)
        let colorText = Valid ? colors.checkGreen : Valid == false ? colors.checkCancle : (item.TinhTrangID == 2 ? colors.checkCancle : colors.checkAwait)
        let Icon = Valid ? Images.ImageJee.icBrowser : Valid == false ? Images.ImageJee.icUnBrowser : (item.TinhTrangID == 2 ? Images.ImageJee.icDahuy : Images.ImageJee.ic_ChoDuyet)
        let ngDuyet = item.NguoiDuyet ? item.NguoiDuyet : ''
        let ngHuy = item.NguoiHuy ? item.NguoiHuy : ''
        return (
            <View style={{ flexDirection: 'row', backgroundColor: colorBg, marginHorizontal: 10, paddingHorizontal: 10, paddingVertical: 15, borderRadius: 10, marginTop: 20 }}>
                <Image source={Icon} style={{ tintColor: Valid == null ? colorText : null }} />
                {Valid ?
                    <Text style={{ fontSize: reText(13), color: colorText, marginLeft: 10, alignSelf: 'center', flex: 1 }}>
                        {RootLang.lang.thongbaochung.yeucauduocduyetvao} {item.NgayDuyet ? Utils.formatTimeAgo(moment(item.NgayDuyet).add(7, 'hours'), 1, true) : ''} {RootLang.lang.thongbaochung.boi} <Text style={{ fontWeight: 'bold' }}>{ngDuyet}</Text>
                    </Text> :
                    Valid == false ?
                        <Text style={{ fontSize: reText(13), color: colorText, marginLeft: 10, alignSelf: 'center', flex: 1 }}>
                            <Text style={{ fontWeight: 'bold' }}>{ngDuyet}</Text> {RootLang.lang.thongbaochung.datuchoiyeucauvao} {item.NgayDuyet ? Utils.formatTimeAgo(moment(item.NgayDuyet).add(7, 'hours'), 1, true) + '.' : ''} {item.LyDo ? RootLang.lang.thongbaochung.lydo + ' ' + item.LyDo : ''}
                        </Text> :
                        item.TinhTrangID == 2 ?
                            <Text style={{ fontSize: reText(13), color: colorText, marginLeft: 10, alignSelf: 'center', flex: 1 }}>
                                <Text style={{ fontWeight: 'bold' }}>{ngHuy}</Text> {RootLang.lang.thongbaochung.daxoadonvao}{item.NgayHuy ? Utils.formatTimeAgo(moment(item.NgayHuy).add(7, 'hours'), 1, true) + '.' : ''}
                            </Text> :
                            <Text style={{ fontSize: reText(13), color: colorText, marginLeft: 10, alignSelf: 'center', flex: 1 }}>
                                {RootLang.lang.thongbaochung.yeucaudangduocchopheduyet}
                            </Text>}
            </View>
        )
    }

    render() {
        var { KhungDuyet, dataItem, DataTemp, valid, checkAPI } = this.state;
        let Valid = DataTemp.KhungDuyet ? DataTemp.KhungDuyet[0].Valid : ''
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: colors.backgroudJeeHR }]}>
                {/* <HeaderComStack nthis={this} title={RootLang.lang.scgiaitrinhchamcong.chitietgiaitrinh} Screen={true} /> */}
                <HeaderAnimationJee isGoBack={true} OnGoBack={this._goback} nthis={this} Screen={true} title={RootLang.lang.scgiaitrinhchamcong.chitietgiaitrinh} />
                <Text style={{ fontSize: reText(11), color: colors.colorNoteJee, alignSelf: 'center', marginTop: -5 }}>
                    {DataTemp.SendDate ? Utils.formatTimeAgo(moment(DataTemp.SendDate).add(7, 'hours'), 1, true) : RootLang.lang.thongbaochung.chuacapnhat}
                </Text>
                {checkAPI ? this.renderInfo(DataTemp) : null}
                <ScrollView style={[nstyles.nbody]} showsVerticalScrollIndicator={false}>
                    <Text style={{ color: colors.colorTitleJee, fontSize: reText(14), paddingHorizontal: 20, marginTop: 25 }}>{RootLang.lang.thongbaochung.thongtingiaitrinh.toUpperCase()}</Text>
                    <SwipeListView
                        style={{ flex: 1, paddingBottom: 10 }}
                        contentContainerStyle={dataItem.length > 0 ? {} : { flex: 1 }}
                        disableRightSwipe
                        showsVerticalScrollIndicator={false}
                        onRowOpen={(rowKey, rowMap) => this.setState({ key: rowKey, map: rowMap })}
                        // data={dataTest}
                        data={dataItem}
                        renderItem={data => (
                            <ItemGiaiTrinh item={data.item} disable={true} valid={Valid} />
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        renderHiddenItem={(data, rowMap) => <View style={styles.rowBack}>
                            <View style={{ flex: 1, backgroundColor: colors.white, }}>
                            </View>
                        </View>}
                        disableLeftSwipe
                        leftOpenValue={75}
                        rightOpenValue={-75}
                        previewRowKey={dataItem.length > 0 ? `${dataItem[0].RowID}` : null}
                        previewOpenValue={-30}
                        previewOpenDelay={3000}
                        ListEmptyComponent={this.renderListEmpty}
                    />
                    <View style={{ height: 100 + paddingBotX }} />
                </ScrollView>
                <View style={{
                    width: '100%',
                    justifyContent: 'flex-end', alignItems: 'center',
                    flexDirection: 'row', justifyContent: 'space-evenly', paddingHorizontal: 10, position: 'absolute', bottom: 15 + paddingBotX, left: 0
                }}>
                    <TouchableOpacity onPress={() => this._goback()} style={{ width: valid == null ? '49%' : '100%', backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center', paddingVertical: 15, borderRadius: 10 }}>
                        <Text style={{ fontSize: reText(14), color: colors.checkAwait }}>{RootLang.lang.thongbaochung.dong}</Text>
                    </TouchableOpacity>
                    {
                        valid == null ? <TouchableOpacity onPress={this._HuyGiaiTrinh} style={{ width: '49%', backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center', paddingVertical: 15, borderRadius: 10 }}>
                            <Text style={{ fontSize: reText(14), color: colors.checkCancle, fontWeight: 'bold' }}>{RootLang.lang.thongbaochung.xoa}</Text>
                        </TouchableOpacity>
                            : null
                    }
                </View>
                <IsLoading />
            </View>
        )
    }
}

// export default ChiTietGiaiTrinh
const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(ChiTietGiaiTrinh, mapStateToProps, true)
const styles = StyleSheet.create({
    rowBack: {
        flex: 1,
        ...nstyles.nrow,
        justifyContent: 'flex-end',
        marginRight: 15,
        marginTop: 8
    },
    backRightBtn: {
        bottom: 0,
        ...nstyles.nmiddle,
        position: 'absolute',
        top: 0,
        width: 75,
    },
    backRightBtnLeft: {
        ...nstyles.nmiddle,
        backgroundColor: colors.redFresh,
        width: 75,
        height: '100%'
    },
    backRightBtnRight: {
        ...nstyles.nmiddle,
        backgroundColor: colors.colorOrange,
        width: 75,
        height: '100%'
    },
})
