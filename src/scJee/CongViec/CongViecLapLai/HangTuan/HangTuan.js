import React, { Component, createRef } from 'react';
import {
    Text, TouchableOpacity, View, StyleSheet, Image, TextInput, Platform, FlatList, ActivityIndicator
} from 'react-native';
import { Images } from '../../../../images';
import { colors } from '../../../../styles';
import { reText, sizes } from '../../../../styles/size';
import { Height, nstyles, Width, paddingBotX, nHeight } from '../../../../styles/styles';
import IsLoading from "../../../../components/IsLoading";
import Dash from 'react-native-dash';
import { Get_ListCVLL, Get_DetailCongViec, DeleteCongViec, Repeated } from "../../../../apis/JeePlatform/API_JeeWork/apiCongViecLapLai";
import { RootLang } from '../../../../app/data/locales';
import Utils from '../../../../app/Utils';
import UtilsApp from '../../../../app/UtilsApp';
import ButtonCom from '../../../../components/Button/ButtonCom';
import HeaderComStack from '../../../../components/HeaderComStack';
import FastImagePlaceholder from "../../../../components/NewComponents/FastImageDefault";
import ListEmptyLottie from '../../../../components/NewComponents/ListEmptyLottie';
import ImageCus from '../../../../components/NewComponents/ImageCus';
import Loading from '../ComponentsCVLL/Loading'
import ActionSheet from "react-native-actions-sheet";
import HeaderModal from '../../../../Component_old/HeaderModal';
import { ROOTGlobal } from '../../../../app/data/dataGlobal';
import ListData from '../ComponentsCVLL/ListData';
const actionSheetRef_Pick = createRef();

class HangTuan extends Component {
    constructor(props) {
        super(props);
        this.nthis = this.props.nthis
        this.refLoading = React.createRef()
        this.state = {
            searchString: '',
            refreshing: false,
            loadmore: false,
            checkLoad: false, //ban đầu false nếu call done api sẽ set true -> check load
            dataCV: [],
            loading: false,
            item: {},
            dataCopy: [],
            searchText: '',
        };
        ROOTGlobal.GetCongViecLapLaiTuan.GetCVLapLaiTuan = this._getListCongViecLapLai_Tuan
    }

    componentDidMount = () => {
        this._getListCongViecLapLai_Tuan()
    }

    _getListCongViecLapLai_Tuan = async () => {
        const { dataCV } = this.state
        let num = this.props.countCVTuan
        let numTong = 0
        let res = await Get_ListCVLL()
        // console.log('res _getListCongViecLapLai_Tuan', res)
        if (res.status == 1) {
            res.data.map(item => {
                if (item.frequency == 1) {
                    numTong += 1
                }
            })
            if (num != numTong) {
                this.props.SetCounCVLapLaiTuan(numTong)
            }
            await this.setState({
                dataCV: res.data,
                refreshing: false,
                loadmore: false,
                loading: true,
                dataCopy: res.data
            })
            this.refLoading.current.hide()
        }
        else {
            this.setState({ refreshing: false, dataCV: [], checkLoad: true, loadmore: false, loading: true })
            UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, res.error ? res.error.message : RootLang.lang.JeeWork.laydulieuthatbai, 2)
            this.refLoading.current.hide()
        }
    }

    _search = (searchText) => {
        const { dataCopy } = this.state
        this.setState({ searchText: searchText })
        let filteredData = dataCopy.filter((item) =>
            Utils.removeAccents(item['title'])
                .toUpperCase()
                .includes(Utils.removeAccents(searchText.toUpperCase())),
        );
        this.setState({ dataCV: filteredData })
    }


    _onRefresh = () => {
        this.setState({ refreshing: true }, () => {
            this.refLoading.current.show()
            this._getListCongViecLapLai_Tuan()

        });
    }

    hashCode = (str) => {
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return hash;
    }

    intToRGB = (i) => {
        var c = (i & 0x00FFFFFF)
            .toString(16)
            .toUpperCase();
        return "#" + "00000".substring(0, 6 - c.length) + c;
    }

    _DeleteCongViec = () => {
        actionSheetRef_Pick.current.hide()
        Utils.showMsgBoxYesNo(this.nthis, RootLang.lang.thongbaochung.thongbao, RootLang.lang.JeeWork.bancomuonxoacongviec, RootLang.lang.JeeWork.xoacongviec, RootLang.lang.JeeWork.dong,
            () => {
                this.Delete(this.state.item.id_row)
            },
            () => { }
        )
    }

    Delete = async (id_row) => {
        this.refLoading.current.show()
        let res = await DeleteCongViec(id_row)
        // console.log('res Delete', res)
        if (res.status == 1) {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.JeeWork.xoacongviecthanhcong, 1)
            this._getListCongViecLapLai_Tuan()
        }
        else {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.JeeWork.xoathatbaivuilong, 2)
            this.refLoading.current.hide()
        }
    }

    _renderItem = ({ item, index }) => {
        return (
            <>
                {
                    item.frequency == 1 ? (
                        <TouchableOpacity style={styles.containerTouchRender}
                            onPress={() => this._xemChiTiet_ChinhSua(item)}
                            onLongPress={() => { actionSheetRef_Pick.current?.show(), this.setState({ item }) }}
                        >
                            <View style={styles.itemContainer}>
                                <Image source={item.Locked == false ? Images.ImageJee.icCheckNhanSu : Images.ImageJee.icCloseNhanSu} style={nstyles.nIcon19}></Image>
                                <View style={styles.viewTouchContainer}>
                                    <View style={styles.itemContainerCon}>
                                        <Text style={styles.textTtile} numberOfLines={1}>{item.title}</Text>
                                        <Text style={styles.textRepeated_day}  >{item.repeated_day}</Text>
                                        <View style={styles.fromView}>
                                            <Text style={styles.textProject_team} numberOfLines={1}>{item.project_team}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.alignItems}>
                                        {
                                            item.Users.length > 0 ?
                                                (
                                                    item?.Users[0]?.image ?
                                                        <ImageCus
                                                            style={nstyles.nAva35}
                                                            source={{ uri: item?.Users[0]?.image }}
                                                            resizeMode={"cover"}
                                                            defaultSourceCus={Images.icAva}
                                                        /> :
                                                        <View style={[nstyles.nAva50, {
                                                            backgroundColor: this.intToRGB(this.hashCode(item.Users[0].hoten)),
                                                            flexDirection: "row", justifyContent: 'center'
                                                        }]}>
                                                            <Text style={styles.textName}>{String(item.Users[0].hoten).split(" ").slice(-1).toString().slice(0, 2).toString()}</Text>
                                                        </View>
                                                ) :
                                                (
                                                    <ImageCus
                                                        style={nstyles.nAva35}
                                                        source={{}}
                                                        resizeMode={"cover"}
                                                        defaultSourceCus={Images.ImageJee.icChonNguoiThamGia}
                                                    />
                                                )
                                        }
                                        <Text style={{ paddingTop: 8, color: '#9B9B9B' }}>{UtilsApp.convertDatetime(item.CreatedDate, 'DD/MM/YYYY HH:mm', 'DD/MM/YYYY')}</Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity >
                    ) : null
                }
            </>
        )
    }

    _touchTest = () => {
        // let dataNVChuyenqua = []
        // dataNV.map(item => {
        //     dataNVChuyenqua.push({ ...item, 'hoten': item.ht, 'id_nv': item.id_nv, 'image': item.image, 'tenchucdanh': item.tenchucdanh })
        // })
        // console.log('dataNVChuyenqua', dataNVChuyenqua)
        // Utils.goscreen(this.nthis, "sc_PickUser", {

        //     dataNV: dataNVChuyenqua, callback: this._callback
        // })
        // nvCoSan: [
        //     {
        //         "id_nv": 2324,
        //         "hoten": "Phan Thị Thanh Hằng",
        //         "username": "hangptt",
        //         "mobile": "0967704979",
        //         "tenchucdanh": "Trưởng nhóm phụ trách JeeHR",
        //         "image": "https://cdn.jee.vn/jee-hr/images/nhanvien/25/2324.jpg",
        //         "Email": "hangptt@dps.com.vn"
        //     },
        //     {
        //         "id_nv": 77048,
        //         "hoten": "Nguyễn Thanh Hoàng",
        //         "username": "dps.hoangnt",
        //         "mobile": "",
        //         "tenchucdanh": "Mobile app developer",
        //         "image": "https://cdn.jee.vn/jee-hr/images/nhanvien/25/2548.jpg",
        //         "Email": ""
        //     },
        //     {
        //         "id_nv": 77051,
        //         "hoten": "Thái Kim Hùng",
        //         "username": "dps.hungtk",
        //         "mobile": "",
        //         "tenchucdanh": "Mobile app developer",
        //         "image": "https://cdn.jee.vn/jee-hr/images/nhanvien/25/4533.jpg",
        //         "Email": "hungtk@dps.com.vn"
        //     },
        // ],
    }

    _xemChiTiet_ChinhSua = async (item) => {
        // this.refLoading.current.show()
        // let res = await Get_DetailCongViec(item.id_row)
        // // console.log('res _getDetailCV', res)
        // if (res.status == 1) {
        //     this.refLoading.current.hide()

        // }
        // else {
        //     UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.JeeWork.xoathatbaivuilong, 2)
        //     this.refLoading.current.hide()
        // }
        Utils.goscreen(this.nthis ? this.nthis : this, "Modal_TaoCongViecMoi", {
            type: 'Hàng tuần', onlyOne: false, nvCoSan: [], reLoad: this._getListCongViecLapLai_Tuan,
            chinhSua: true, rowid: item.id_row
        })
    }

    _callback = (list) => {

    }

    _taoCongViecMoi = () => {
        Utils.goscreen(this.nthis ? this.nthis : this, "Modal_TaoCongViecMoi", { type: 'Hàng tuần', onlyOne: false, nvCoSan: [], reLoad: this._getListCongViecLapLai_Tuan, })
    }

    _thucThiNgayTaoTuDong = () => {
        const { item } = this.state
        actionSheetRef_Pick.current?.hide()
        Utils.showMsgBoxYesNo(this.nthis ? this.nthis : this, RootLang.lang.thongbaochung.thongbao, 'Khởi tạo công việc lặp lại?', RootLang.lang.JeeWork.dongy, RootLang.lang.JeeWork.huy,
            async () => {
                this.refLoading.current.show()
                let res = await Repeated(item.id_row)
                // console.log('res _thucThiNgayTaoTuDong', res)
                if (res.status == 1) {
                    this.refLoading.current.hide()
                    UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.JeeWork.thuchienthanhcong, 1)
                }
                else {
                    this.refLoading.current.hide()
                    UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
                }
            },
            () => { })
    }

    _NhanBan = async () => {
        const { item } = this.state
        actionSheetRef_Pick.current?.hide()
        Utils.goscreen(this.nthis ? this.nthis : this, "Modal_TaoCongViecMoi", {
            type: 'Hàng tuần', onlyOne: false, nvCoSan: [], reLoad: this._getListCongViecLapLai_Tuan,
            rowid: item.id_row, nhanBan: true
        })
    }

    render() {
        const { searchString, refreshing, loadmore, checkLoad, loading, dataCV, searchText } = this.state
        return (
            <View style={styles.container}>
                {/* <View style={{ paddingVertical: 10, flexDirection: "row", paddingHorizontal: 10 }}>
                    <View style={styles.search}>
                        <Image source={Images.icSearch} />
                        <TextInput
                            value={searchText}
                            numberOfLines={1}
                            style={styles.textInput}
                            placeholder={RootLang.lang.JeeWork.timkiem}
                            onChangeText={searchText => {
                                this._search(searchText)
                            }} />
                        {searchText != "" ?
                            <TouchableOpacity onPress={() => {
                                // setTextSearch(''), setListNV(dataCopy)
                                this.setState({ searchText: "" }, this.setState({ dataCV: this.state.dataCopy }))
                            }} style={styles.xoa}>
                                <Text style={{ fontSize: reText(12), fontWeight: 'bold' }}>X</Text>
                            </TouchableOpacity> : null}
                    </View>
                </View>
                <View style={styles.constainerFlatList}>
                    {loading == false ?
                        <Loading soLuongRender={[0, 1, 2, 3, 4]}></Loading>
                        :
                        <>
                            <FlatList
                                contentContainerStyle={{ paddingBottom: nHeight(8) }}
                                data={dataCV}
                                renderItem={this._renderItem}
                                keyExtractor={(item, index) => index.toString()}
                                extraData={this.state}
                                refreshing={refreshing}
                                initialNumToRender={5}
                                maxToRenderPerBatch={10}
                                windowSize={7}
                                updateCellsBatchingPeriod={100}
                                onRefresh={this._onRefresh}
                                onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
                                onEndReachedThreshold={0.2}
                                ListFooterComponent={loadmore ? <ActivityIndicator size='small' style={{ marginTop: 15 }} /> : null}
                                ref={ref => { this.ref = ref }}
                                ListEmptyComponent={dataCV.length == 0 && checkLoad ? <ListEmptyLottie style={{ justifyContent: 'center', alignItems: 'center', }} textempty={RootLang.lang.JeeWork.khongcodulieu} /> : null}
                            />
                            <TouchableOpacity onPress={() => { this._taoCongViecMoi() }}
                                style={styles.create} >
                                <Text style={{ fontSize: reText(14), color: colors.colorJeeNew.colorBlueHome, fontWeight: 'bold' }}>{RootLang.lang.JeeWork.taocongviecmoi}</Text>
                            </TouchableOpacity>
                        </>
                    }
                </View>
                <IsLoading ref={this.refLoading}></IsLoading>
                <ActionSheet ref={actionSheetRef_Pick}>
                    <View style={[styles.actiocnSheet, {}]}>
                        <HeaderModal />
                        <View style={{}}>
                            <TouchableOpacity
                                onPress={() => this._thucThiNgayTaoTuDong()}
                                style={[styles.actionSheet_con, {}]}>
                                <Text style={{ fontSize: sizes.sText15, }}>{RootLang.lang.JeeWork.thucthingaytaotudong}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => this._NhanBan()}
                                style={[styles.actionSheet_con, {}]}>
                                <Text style={{ fontSize: sizes.sText15, }}>{RootLang.lang.JeeWork.nhanban}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => this._DeleteCongViec()}
                                style={[styles.actionSheet_con, {}]}>
                                <Text style={{ fontSize: sizes.sText15, }}>{RootLang.lang.JeeWork.xoacongviec}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ActionSheet> */}
                <ListData type={'Hàng tuần'} nthis={this.nthis}></ListData>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
    search: {
        flexDirection: 'row', backgroundColor: colors.black_5, paddingHorizontal: 10, borderRadius: 10,
        alignItems: 'center', flex: 1
    },
    textInput: {
        flex: 1, paddingVertical: Platform.OS == 'ios' ? 10 : 5, paddingHorizontal: 5, fontSize: reText(16)
    },
    xoa: {
        width: Width(5), backgroundColor: colors.black_20_2, height: Width(5), borderRadius: 10, justifyContent: 'center', alignItems: 'center'
    },
    constainerFlatList: {
        flex: 1,
        backgroundColor: colors.white,
        marginHorizontal: 5
    },
    create: {
        width: Width(90), borderRadius: 8, justifyContent: 'center', alignItems: 'center', paddingVertical: 10,
        borderColor: colors.black_20, elevation: Platform.OS == "android" ? 5 : 0, marginHorizontal: Width(5),
        borderWidth: 0.5, backgroundColor: colors.white, position: 'absolute', bottom: Platform.OS == 'ios' ? 20 : 10, left: 0,
        shadowColor: "rgba(0, 0, 0, 0.2)", shadowOffset: { width: 0, height: 0 }, shadowRadius: 2, shadowOpacity: 1, margin: 0,
    },
    containerTouchRender: {
        marginHorizontal: 5,
        backgroundColor: colors.white,
        marginTop: 10,
        // paddingHorizontal: 10,
        paddingVertical: 10,
        borderBottomWidth: 0.3,
        borderColor: colors.gray1
    },
    itemContainer: {
        flexDirection: 'row'
    },
    itemContainerCon: {
        flex: 1
    },
    viewTouchContainer: {
        paddingHorizontal: 5,
        justifyContent: 'space-between',
        flexDirection: 'row',
        flex: 1,
    },
    textTtile: {
        flex: 1,
    },
    fromView: {
        borderRadius: 10,
        borderWidth: 0.3,
        width: Width(30),
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 2,
        marginTop: 2,
        borderColor: '#D3D3D3'
    },
    alignItems: {
        alignItems: 'center'
    },
    textName: {
        alignSelf: "center", fontWeight: "bold", fontSize: reText(16), color: colors.white
    },
    textProject_team: {
        flex: 1, paddingHorizontal: 10, color: '#9B9B9B'
    },
    textRepeated_day: {
        flex: 1, paddingVertical: 8, color: '#9B9B9B'
    },
    actiocnSheet: {
        paddingBottom: paddingBotX,
    },
    actionSheet_con: {
        borderBottomWidth: 0.3,
        borderColor: '#E4E6EB',
        justifyContent: 'center',
        paddingHorizontal: 10,
        marginLeft: 10,
        paddingVertical: 20
    },
    touchBoLoc: {
        justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10
    }
});

const mapStateToProps = state => ({
    lang: state.changeLanguage.language,
    countCVTuan: state.CountCVTuan.count,
});

export default Utils.connectRedux(HangTuan, mapStateToProps, true)

