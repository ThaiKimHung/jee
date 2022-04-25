import moment from 'moment'
import React, { Component } from 'react'
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View, BackHandler } from 'react-native'
import { GetListTypeApproval } from '../../../../apis/apiControllergeneral'
import { RootLang } from '../../../../app/data/locales'
import Utils from '../../../../app/Utils'
import IsLoading from '../../../../components/IsLoading'
import ListEmpty from '../../../../components/ListEmpty'
import { Images } from '../../../../images'
import { colors, fonts } from '../../../../styles'
import { reSize, reText, sizes } from '../../../../styles/size'
import { Height, nstyles, Width, paddingBotX, nHeight, nwidth } from '../../../../styles/styles';
import UtilsApp from '../../../../app/UtilsApp';
import HeaderAnimationJee from '../../../../components/HeaderAnimationJee'

export class DSDuyetDon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            LstHinhThucDuyet: [{ RowID: '', Title: RootLang.lang.sckhac.tatcahinhthuc }],
            selectedHinhThuc: { RowID: '', Title: RootLang.lang.sckhac.tatcahinhthuc },
            lstDS: [],
            idtab: Utils.ngetParam(this, "idtab", 0), // Phân biệt Tab danh sách hay Lịch Sử
            colorState: colors.black,
            refreshing: true,
            listTinhTrang: [
                { RowID: 0, Title: RootLang.lang.thongbaochung.chuaxuly },
                { RowID: 1, Title: RootLang.lang.thongbaochung.daxuly },
            ],
            selectTinhTrang: { RowID: 0, Title: RootLang.lang.thongbaochung.chuaxuly },
        };
    }
    // export const SetValueTypeDSDuyet = (val) => ({ type: SETVALUETYPEDSDUYET, payload: val });
    // export const SetValueTypeLichSu = (val) => ({ type: SETVALUETYPEDLICHSU, payload: val });
    async componentDidMount() {
        // Utils.nlog("ID HINH THUC:", this.idHinhThuc)
        this.state.idtab == 0 ? this.setState({ selectTinhTrang: this.state.listTinhTrang[0] }) : this.setState({ selectTinhTrang: this.state.listTinhTrang[1] })
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this._backHandlerButton)
        this._getDropdownHinhThuc();
    }
    componentWillUnmount() {
        this.backHandler.remove()
    }
    _backHandlerButton = () => {
        this._goback()
        return true
    }
    _goback = () => {
        Utils.goback(this)
    }
    _callback = async (selectedHinhThuc) => {
        const { idtab } = this.state;
        if (idtab == 0) {
            await this.props.SetValueTypeDSDuyet(selectedHinhThuc.RowID);
            this.setState({ selectedHinhThuc }, this._getApprovalRequest);
        } else {
            await this.props.SetValueTypeLichSu(selectedHinhThuc.RowID);
            this.setState({ selectedHinhThuc }, this._getApprovalRequest);
        }
    }
    _ViewItem = (item) => {
        return (
            <Text key={item.RowID} style={{
                fontSize: sizes.sText14, alignSelf: 'center', color: this.state.selectedHinhThuc.Title == item.Title ? colors.textblack : colors.colorTextBTGray,
                fontWeight: this.state.selectedHinhThuc.Title == item.Title ? 'bold' : 'normal'
            }}>{`${item.Title ? item.Title : ""}`}</Text>)
    }
    _DropDown = () => {
        Utils.goscreen(this, 'Modal_ComponentSelectCom',
            {
                callback: this._callback,
                item: this.state.selectedHinhThuc,
                AllThaoTac: this.state.LstHinhThucDuyet,
                ViewItem: this._ViewItem
            })
    }

    _callbackTT = async (selectTinhTrang) => {
        let { selectedHinhThuc } = this.state
        if (selectTinhTrang.RowID == 0)
            await this.props.SetValueTypeDSDuyet(selectedHinhThuc.RowID)
        else
            await this.props.SetValueTypeLichSu(selectedHinhThuc.RowID);
        this.setState({ selectTinhTrang: selectTinhTrang, idtab: selectTinhTrang.RowID }, this._getApprovalRequest)
    }
    _ViewItemTT = (item) => {
        return (
            <Text key={item.RowID} style={{
                fontSize: sizes.sText14, alignSelf: 'center', color: this.state.selectTinhTrang.Title == item.Title ? colors.textblack : colors.colorTextBTGray,
                fontWeight: this.state.selectTinhTrang.Title == item.Title ? 'bold' : 'normal'
            }}>{`${item.Title ? item.Title : ""}`}</Text>)
    }
    _DropDownTT = () => {
        Utils.goscreen(this, 'Modal_ComponentSelectCom',
            {
                callback: this._callbackTT,
                item: this.state.selectTinhTrang,
                AllThaoTac: this.state.listTinhTrang,
                ViewItem: this._ViewItemTT
            })
    }

    _getDropdownHinhThuc = async () => {
        const { DuyetDonReducer = {} } = this.props;
        const { idtab, selectedHinhThuc } = this.state;
        const res = await GetListTypeApproval();
        // Utils.nlog('res _getDropdownHinhThuc', res)
        if (res.status == 1) {

            const { data = [] } = res;
            if (DuyetDonReducer.valueTypeDSDuyet != '' && idtab == 0 && data.length > 0) {

                let index = res.data.findIndex(item => item.RowID == DuyetDonReducer.valueTypeDSDuyet);
                this.setState({ LstHinhThucDuyet: [{ RowID: '', Title: RootLang.lang.sckhac.tatcahinhthuc }].concat(res.data), refreshing: false, selectedHinhThuc: index >= 0 ? res.data[index] : selectedHinhThuc }, this._getApprovalRequest);
            } else if (DuyetDonReducer.valueTypeLichSu && idtab == 1 && data.length > 0) {

                let index = res.data.findIndex(item => item.RowID == DuyetDonReducer.valueTypeLichSu);
                this.setState({ LstHinhThucDuyet: [{ RowID: '', Title: RootLang.lang.sckhac.tatcahinhthuc }].concat(res.data), refreshing: false, selectedHinhThuc: index >= 0 ? res.data[index] : selectedHinhThuc }, this._getApprovalRequest);
            } else {

                this.setState({ LstHinhThucDuyet: [{ RowID: '', Title: RootLang.lang.sckhac.tatcahinhthuc }].concat(res.data), refreshing: false }, this._getApprovalRequest)
            }

        }
    }
    _getApprovalRequest = async (page = 1, record = 10) => {
        this.props.SetLoading(true);
        const { selectedHinhThuc, idtab } = this.state;
        const { DuyetDonReducer } = this.props
        //page = 1, record = 10, datafilter, DuyetDonReducer, idScreen = 0,
        this.props.GET_DSDUYETDON(page, record, idtab == 0 ? DuyetDonReducer.itemFilterDuyet : DuyetDonReducer.itemFilterLichSu, DuyetDonReducer, idtab)
    }
    _onRefresh = () => {
        this.props.SetLoading(true);
        this._getApprovalRequest()
    }
    onLoadmore = () => {
        const { idtab } = this.state;
        const { DuyetDonReducer } = this.props;

        if (idtab == 0) {
            const { pageDSDuyet = {} } = DuyetDonReducer;
            if (pageDSDuyet && pageDSDuyet.Page < pageDSDuyet.AllPage) {
                this.props.SetLoadmore(true);
                this._getApprovalRequest(pageDSDuyet.Page + 1)
            }
            else {
                // this.setState({ showload: false });
            }
        } else {
            const { pageDSLichSu = {} } = DuyetDonReducer;
            if (pageDSLichSu && pageDSLichSu.Page < pageDSLichSu.AllPage) {
                this.props.SetLoadmore(true);
                this._getApprovalRequest(pageDSLichSu.Page + 1)
            }
            else {
                // this.setState({ showload: false });
            }
        }
    }

    _renderItem = ({ item, index }) => {
        const { idtab } = this.state;
        const { DuyetDonReducer } = this.props
        let dateCu = '', dateMoi = '', dataOld = ''
        let lengthData = idtab == 0 ? DuyetDonReducer.dataDSDuyet.length - 1 : DuyetDonReducer.dataDSLichSu.length - 1
        // xử lý ẩn hiện Tháng trong DS Lịch xử
        if (index != 0) {
            let itemCu = idtab == 0 ? DuyetDonReducer.dataDSDuyet[index - 1] : DuyetDonReducer.dataDSLichSu[index - 1]
            dateCu = moment(itemCu.SendDate).format('MM/YYYY');
        }
        dateMoi = item.SendDate ? moment(item.SendDate).format('MM/YYYY') : '...';
        if (index < lengthData) {
            let itemOld = idtab == 0 ? DuyetDonReducer.dataDSDuyet[index + 1] : DuyetDonReducer.dataDSLichSu[index + 1]
            dataOld = moment(itemOld.SendDate).format('MM/YYYY');
        }
        let checkBot = index == lengthData || dataOld != dateMoi ? true : false
        // Utils.nlog("datmoi va date cu", dateCu, dateMoi
        //--Xử lý tối ưu hiển thị mô tả cho "Đổi ca làm việc"
        let Time_Temp = item.Time;
        let dataCaDoi = []
        if (item.TypeID === 18) {
            let count = Time_Temp.split("<br/>").length - 1
            for (let i = 0; i < count + 1; i++) {
                let item = Time_Temp.split("<br/>")[i]
                let dateTo = item.split(' ')[0]
                let dateForm = item.split(' ')[2]
                let caHT = item.split(' (')[1]
                let caDoi = item.split('-> ')[1].split('(')[0]
                dataCaDoi.push({ dateTo: dateTo, dateForm: dateForm, caHT: caHT, caDoi: caDoi })
            }
            Time_Temp = Time_Temp.split("<br/>").join("\n");
        }
        return (
            <View style={{}}>
                {
                    (dateMoi != dateCu || index == 0) ?
                        <Text style={{
                            color: colors.titleJeeHR, marginTop: index == 0 ? 5 : 15, marginBottom: 5, marginHorizontal: 10,
                            fontSize: reText(14),
                        }}>{RootLang.lang.common.thang + " " + dateMoi}</Text> : null
                }
                <View style={{
                    backgroundColor: colors.white, borderTopLeftRadius: dateMoi != dateCu || index == 0 ? 10 : 0, borderTopRightRadius: dateMoi != dateCu || index == 0 ? 10 : 0,
                    borderBottomLeftRadius: checkBot ? 10 : 0, borderBottomRightRadius: checkBot ? 10 : 0
                }}>
                    <TouchableOpacity style={{ paddingVertical: 15, paddingHorizontal: 12 }} onPress={() => this._chiTietDuyet(item)}>
                        <View key={index} style={{ flexDirection: 'row', }}>
                            {
                                <View style={{ width: Width(5), width: Width(8) }}>
                                    {item.Valid ? <Image source={Images.ImageJee.icBrowser} /> : item.Valid == false ? <Image source={Images.ImageJee.icUnBrowser} /> : <Image source={Images.ImageJee.ic_ChoDuyet} />}
                                </View>
                            }
                            <View style={{ marginBottom: 4, flex: 1 }}>
                                {
                                    item.TypeID != 19 ? (
                                        <Text numberOfLines={2} style={{ width: Width(65) }}>
                                            <Text numberOfLines={1} style={{ fontSize: reText(14), fontWeight: 'bold', color: this.returnColor(item.TypeID) }}>{item.Type}</Text>
                                            <Text style={{ fontSize: reText(14), color: colors.titleJeeHR }}>{' - '}{item.CreatedBy}</Text>
                                        </Text>
                                    ) : (
                                        <View style={{ width: Width(65) }}>
                                            <Text numberOfLines={1} style={{ fontSize: reText(14), fontWeight: 'bold', color: this.returnColor(item.TypeID), maxWidth: Width(60) }}>{item.Type + " " + moment(item.SendDate).format('MM')}</Text>
                                            <Text style={{ fontSize: reText(14), color: colors.titleJeeHR }}>{item.CreatedBy}</Text>
                                        </View>
                                    )
                                }
                                {
                                    item.TypeID != 13 ?
                                        (
                                            <View>
                                                {
                                                    item.TypeID != 19 && item.TypeID != 18 ?
                                                        <Text style={{ fontSize: reText(11), color: colors.blackJee, marginTop: 5, }}>{item.Time}</Text>
                                                        :
                                                        item.TypeID == 18 ?
                                                            dataCaDoi.map(val => {
                                                                return (
                                                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }} >
                                                                        <Text style={{ fontSize: reText(11), color: colors.blackJee, }}>{val.dateTo ? moment(val.dateTo, 'DD/MM/YYYY').format('ddd, DD/MM') : '--'} - {val.dateForm ? moment(val.dateForm, 'DD/MM/YYYY').format('ddd, DD/MM') : '--'}</Text>
                                                                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginLeft: 8 }}>
                                                                            <Text style={{ fontSize: reText(11), fontWeight: 'bold', color: colors.checkGreen, alignSelf: 'center' }}>{val.caHT && val.caHT != ')' ? val.caHT : '--'} </Text>
                                                                            <Image source={Images.ImageJee.icArrowRight} style={{ alignSelf: 'center' }} />
                                                                            <Text style={{ fontSize: reText(11), fontWeight: 'bold', color: colors.checkGreen, alignSelf: 'center' }}> {val.caDoi && val.caDoi != ')' ? val.caDoi : '--'}</Text>
                                                                        </View>
                                                                    </View>
                                                                )
                                                            })
                                                            : null
                                                }
                                            </View>
                                        )
                                        :
                                        <Text style={{ fontSize: reText(12), color: '#404040', marginTop: 5, }}>{RootLang.lang.sckhac.tungay + " " + UtilsApp.convertTimeLocal(item?.startdate, 'DD/MM/YYYY', 'YYYY-MM-DD HH:mm:ssZ')}</Text>
                                }
                                <View style={{}}>
                                    {
                                        (item.TypeID === 19 || item.TypeID === 13) ? null :
                                            <Text numberOfLines={1} style={{ fontSize: reText(11), color: colors.colorNoteJee, marginTop: 5, }}>{item.Note ? item.Note : '--'}</Text>
                                    }
                                </View>
                            </View>
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Image source={{ uri: item.Image }} style={{ width: 34, height: 34, borderRadius: 99999 }} />
                                <Text style={{ fontSize: reText(11), color: colors.colorNoteJee, marginTop: 5, }}> {item?.SendDate ? moment(item?.SendDate).format('ddd DD/MM') : "--"}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    {checkBot ? null : <View style={{ height: 0.5, backgroundColor: colors.colorLineJee, width: Width(79), alignSelf: 'flex-end', marginRight: 10 }} />}
                </View>
            </View >
        )
    }

    returnColor = (id) => {
        switch (id) {
            // Nghỉ phép năm
            case 1: return '#0A9562'; break;
            // Tăng ca
            case 12: return '#FF8C00'; break;
            // Đổi ca làm việc
            case 18: return '#5B66D5'; break;
            // Giải trình chấm công
            case 19: return '#6844BA'; break;
            // Đơn thôi việc
            case 13: return '#FF453B'; break;
            // Tuyển dụng
            case 6: return '#3979F3'; break;
            default: return colors.black; break;
        }
    }

    _chiTietDuyet = (item) => {
        const { idtab } = this.state
        // Utils.nlog("Kết quả: ", item)
        switch (item.TypeID) {
            case 1: { Utils.goscreen(this, 'sc_CTDuyetPhep', { itemId: item.RowID, idtab: idtab, isGoBak: true }) } break;
            case 12: { Utils.goscreen(this, 'sc_CTDuyetTangCa', { itemId: item.RowID, isGoBak: true }) } break;
            case 19: { Utils.goscreen(this, 'sc_ChiTietDuyetGiaiTrinh', { itemId: item.RowID, data: item, idtab: idtab, isGoBak: true }) } break;
            case 18: {
                Utils.goscreen(this, 'sc_chitietDuyetDoiCa', {
                    RowID: item.RowID,
                    isGoBak: true
                })
            } break;
            case 13: {
                Utils.goscreen(this, 'sc_ChiTietThoiViec', {
                    RowID: item.RowID,
                    isGoBak: true,
                    idtab: idtab
                })
            } break;
            case 6: {
                // Utils.goscreen(this, 'Modal_CTTuyenDung')
            } break;
            default: { '' } break;
        }
    }
    getDataFilter = () => {
        const { DuyetDonReducer = {} } = this.props;
        const filter = this.state.idtab == 0 && DuyetDonReducer ? DuyetDonReducer.itemFilterDuyet : DuyetDonReducer.itemFilterLichSu

    }
    render() {
        const { DuyetDonReducer } = this.props
        const { idtab } = this.state
        return (
            <View style={{
                flex: 1, backgroundColor: colors.backgroudJeeHR,
            }}>
                <HeaderAnimationJee nthis={this} title={RootLang.lang.thongbaochung.duyetphep}
                    iconRight={Images.ImageJee.icFilterJee}
                    onPressRight={() => Utils.goscreen(this, 'Modal_TimKiem', { idtab: idtab, _callback: this.getDataFilter })}
                    onPressLeft={() => { this.props.SetValueTypeDSDuyet(''), Utils.goback(this, null) }}
                    styIconRight={{ width: Width(5), height: Width(5), tintColor: '#0A0A0A' }}
                />
                <View style={{ marginHorizontal: 15, flex: 1 }}>
                    <View style={{ paddingHorizontal: 10, paddingVertical: 15, borderRadius: 10, backgroundColor: colors.white, marginVertical: 10 }}>
                        <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => this._DropDown()}>
                            <Image source={Images.ImageJee.icProjectS} style={{ width: Width(5), height: Width(5) }} />
                            <View style={{ alignSelf: 'center', marginLeft: 5, flex: 1, flexDirection: 'row' }}>
                                <Text style={{ color: colors.colorNoteJee, fontSize: reText(14), flex: 1 }}>{RootLang.lang.thongbaochung.hinhthuc}</Text>
                                <View style={{ flexDirection: 'row', }}>
                                    <Text style={{ color: colors.titleJeeHR, fontSize: reText(14) }}>{this.state.selectedHinhThuc ? this.state.selectedHinhThuc.Title : RootLang.lang.sckhac.tatcahinhthuc}</Text>
                                    <Image source={Images.ImageJee.icIconDropDownNamNgang} style={{ width: Width(1), height: Width(1.6), marginLeft: 3, alignSelf: 'center', tintColor: colors.titleJeeHR }} />
                                </View>
                            </View>
                        </TouchableOpacity>
                        <View style={{ height: 0.5, backgroundColor: colors.colorLineJee, width: Width(81.7), marginVertical: 10, alignSelf: 'flex-end' }} />
                        <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => this._DropDownTT()}>
                            <Image source={Images.ImageJee.icTinhTrangJee} style={{ width: Width(5), height: Width(5) }} />
                            <View style={{ alignSelf: 'center', marginLeft: 5, flex: 1, flexDirection: 'row' }}>
                                <Text style={{ color: colors.colorNoteJee, fontSize: reText(14), flex: 1 }}>{RootLang.lang.thongbaochung.tinhtrang}</Text>
                                <View style={{ flexDirection: 'row', }}>
                                    <Text style={{ color: colors.titleJeeHR, fontSize: reText(14) }}>{this.state.selectTinhTrang ? this.state.selectTinhTrang.Title : RootLang.lang.sckhac.tatcahinhthuc}</Text>
                                    <Image source={Images.ImageJee.icIconDropDownNamNgang} style={{ width: Width(1), height: Width(1.6), marginLeft: 3, alignSelf: 'center', tintColor: colors.titleJeeHR }} />
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, }}>
                        <FlatList
                            contentContainerStyle={{ flexGrow: 1, paddingBottom: paddingBotX + 20 }}
                            initialNumToRender={10}
                            maxToRenderPerBatch={5}
                            updateCellsBatchingPeriod={100}
                            windowSize={7}
                            showsVerticalScrollIndicator={false}
                            data={idtab == 0 ? DuyetDonReducer.dataDSDuyet : DuyetDonReducer.dataDSLichSu}
                            style={{ flex: 1, }}
                            renderItem={this._renderItem}
                            refreshing={DuyetDonReducer.isLoading}
                            onRefresh={this._onRefresh}
                            onEndReached={this.onLoadmore}
                            ListFooterComponent={DuyetDonReducer.isLoadmore ?
                                <ActivityIndicator size='small' /> : null}
                            ListEmptyComponent={<ListEmpty textempty={RootLang.lang.thongbaochung.khongcodulieu} />}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                </View >
                <IsLoading />
            </View >
        )
    }
}
// export default DSDuyetDon
const mapStateToProps = state => ({
    lang: state.changeLanguage.language,
    DuyetDonReducer: state.DuyetDonReducer
});
export default Utils.connectRedux(DSDuyetDon, mapStateToProps, true)

