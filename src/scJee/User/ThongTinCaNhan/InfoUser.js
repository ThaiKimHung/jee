import React, { Component } from 'react';
import { FlatList, Image, RefreshControl, ScrollView, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Get_LyLich, Get_RowLyLich, Get_Info } from '../../../apis/searchemployee';
import { RootLang } from '../../../app/data/locales';
import { nGlobalKeys } from '../../../app/keys/globalKey';
import Utils from '../../../app/Utils';
import ButtonCom from '../../../components/Button/ButtonCom';
import HeaderAnimationJee from '../../../components/HeaderAnimationJee';
import HeaderComStack from '../../../components/HeaderComStack';
import IsLoading from '../../../components/IsLoading';
import ListEmpty from '../../../components/ListEmpty';
import { Images } from '../../../images';
import { colors } from '../../../styles/color';
import { fonts } from '../../../styles/font';
import { reSize, sizes, reText } from '../../../styles/size';
import { nstyles, Width } from '../../../styles/styles';
import TextInFo from './TextInFo';

class InfoUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabNP: 0,
            dataUser: '',
            rowID: [],
            index: 0,
            dDTTCB: true,
            dDTTCN: false,
            dDKhanCap: false,
            dDHopDong: false,
            dDNgoaiNgu: false,
            dBBangCap1: false,
            dBBangCap2: false,
            dBNguoiThan: false,
            dBHoSoDaNop: false,
            dBQTDaoTao: false,
            dBQuaTrinhBoiDuong: false,
            showThoiViec: false,
            showNoData: false,
            dataThoiViec: [],
        };
    }
    async componentDidMount() {
        await this.getLylich()
        await this.getRowLylich()
        await this.getInfoThoiViec()
        setTimeout(() => {
            this.setState({ showThoiViec: true })
        }, 500)
    }
    getLylich = async () => {
        nthisLoading.show();
        let res = await Get_LyLich();
        if (res.status == 1) {
            nthisLoading.hide();
            this.setState({ dataUser: res })
        }
        else nthisLoading.hide();
        this.setState({ showNoData: true })

    }
    getRowLylich = async () => {
        nthisLoading.show();
        let res = await Get_RowLyLich();
        // console.log('res getRowLylich', res)
        if (res.status == 1) {
            nthisLoading.hide();
            this.setState({ rowID: res.data })
        }
        else nthisLoading.hide();
    }

    getInfoThoiViec = async () => {
        nthisLoading.show();
        let res = await Get_Info();
        // console.log('res getInfoThoiViec', res)
        if (res.status == 1) {
            nthisLoading.hide();
            this.setState({ dataThoiViec: res })
        }
        else nthisLoading.hide();
    }

    renderItemDesign = (row, dataUser) => {
        const { rowID } = this.state
        let rowId = rowID.map((rowId) => rowId.RowID);
        let index = rowId.findIndex(d => d === row);
        if (index >= 0) {
            switch (row) {
                case 1:
                    return this.renderThongTinCoBan(dataUser)
                case 2:
                    return this.renderThongTinCaNhan(dataUser)
                case 3:
                    return this.renderThongTinKHan(dataUser)
                case 4:
                    return this.renderHopDong(dataUser)
                case 5:
                    return this.renderBangCapLoai1(dataUser)
                case 6:
                    return this.renderTrinhDoNgoaiNgu(dataUser)
                case 7:
                    return this.renderBangCapLoai2(dataUser)
                case 8:
                    return this.renderQuaTrinhDaoTao(dataUser)
                case 9:
                    return this.renderQuaTrinhBoiDuong(dataUser)
                case 10:
                    return this.renderNguoiThan(dataUser)
                case 11:
                    return this.renderHoSoDaNop(dataUser)


                default:
                    return null;
            }
        } else {
            return null;
        }
    }

    onRefesh = async () => {
        this.setState({ refreshing: true });
        await this.getLylich()
        await this.getRowLylich()
        this.setState({ refreshing: false });
    }

    renderThongTinCoBan = (item) => {
        const { dDTTCB } = this.state
        return (
            <View style={nstyles.shadowButTon, {
                backgroundColor: colors.white, height: 'auto', flex: 1,
                marginHorizontal: 12, borderRadius: 10
            }}>
                <TouchableOpacity style={{ flexDirection: "row", paddingHorizontal: 10, paddingVertical: 15 }} onPress={() => this.setState({ dDTTCB: !dDTTCB })}>
                    <Text style={{
                        fontSize: sizes.sText16, flex: 1,
                        color: colors.colorTabActive
                    }}>{RootLang.lang.scthongtincanhan.thongtincoban.toUpperCase()}</Text>
                    <Image
                        style={{
                            tintColor: colors.colorTabActive,
                            height: sizes.nImgSize10, width: sizes.nImgSize10, alignSelf: 'center'
                        }}
                        resizeMode={'contain'}
                        source={dDTTCB == true ? Images.icDropDownU : Images.icDropDownD} />
                </TouchableOpacity>
                {dDTTCB == true ?
                    <>
                        <View style={
                            {
                                paddingTop: 30, paddingBottom: 21,
                                alignItems: 'center',
                            }}>

                            <Image
                                source={{ uri: item.Image }}
                                defaultSource={Images.JeeAvatarBig}
                                style={{
                                    width: Width(20),
                                    height: Width(20),
                                    borderRadius: 150 / 2,
                                    overflow: "hidden",
                                }}

                            />
                        </View>
                        <View style={{ paddingHorizontal: 10 }}>
                            <TextInFo
                                text={RootLang.lang.scthongtincanhan.manv}
                                text1={item.MaNV} />
                            <TextInFo
                                text={RootLang.lang.scthongtincanhan.machamcong}
                                text1={item.MaCC} />
                            <TextInFo
                                text={RootLang.lang.scthongtincanhan.tendangnhap}
                                text1={item.TenDangNhap} />
                            <TextInFo
                                text={RootLang.lang.scthongtincanhan.hoten}
                                text1={item.HoTen} />

                            <TextInFo
                                text={RootLang.lang.scthongtincanhan.gioitinh}
                                text1={item.GioiTinh} />
                            <TextInFo
                                text={RootLang.lang.scthongtincanhan.ngaysinh}
                                text1={item.NgaySinh} />
                            <TextInFo
                                text={RootLang.lang.scthongtincanhan.noisinh}
                                text1={item.NoiSinh} />
                            <TextInFo
                                text={RootLang.lang.scthongtincanhan.quoctich}
                                text1={item.QuocTich} />
                            <TextInFo
                                text={RootLang.lang.scthongtincanhan.dienthoai}
                                text1={item.DiDong} />
                            <TextInFo
                                text={RootLang.lang.scthongtincanhan.emailcongty}
                                text1={item.EmailCongTy} />
                            <TextInFo
                                text={RootLang.lang.scthongtincanhan.emailcanhan}
                                text1={item.EmailCaNhan} />

                        </View>
                    </> : null}
            </View>
        )
    }

    renderThongTinCaNhan = (item) => {
        const { dDTTCN } = this.state
        return (
            <View style={nstyles.shadowButTon, {
                backgroundColor: colors.white, height: 'auto', flex: 1,
                marginHorizontal: 12, marginVertical: 7, borderRadius: 10
            }}>
                <TouchableOpacity style={{ flexDirection: "row", paddingHorizontal: 10, paddingVertical: 15 }} onPress={() => this.setState({ dDTTCN: !dDTTCN })}>
                    <Text style={{
                        fontSize: sizes.sText16, flex: 1,
                        color: colors.colorTabActive
                    }}>{RootLang.lang.scthongtincanhan.thongtincanhan.toUpperCase()}</Text>
                    <Image
                        style={{
                            tintColor: colors.colorTabActive,
                            height: sizes.nImgSize10, width: sizes.nImgSize10, alignSelf: 'center'
                        }}
                        resizeMode={'contain'}
                        source={dDTTCN == true ? Images.icDropDownU : Images.icDropDownD} />
                </TouchableOpacity>
                {dDTTCN == true ?
                    <>
                        <View style={{ paddingHorizontal: 10 }}>
                            <TextInFo
                                text={RootLang.lang.scthongtincanhan.cmnd}
                                text1={item.CMND} />
                            <TextInFo
                                text={RootLang.lang.scthongtincanhan.ngaycapcmnd}
                                text1={item.NgayCapCMND ? Utils.formatDate(item.NgayCapCMND, "DD/MM/YYYY") : ""} />
                            <TextInFo
                                text={RootLang.lang.scthongtincanhan.noicapcmnd}
                                text1={item.NoiCapCMND} />

                            <TextInFo
                                text={RootLang.lang.scthongtincanhan.sohochieu}
                                text1={item.SoHoChieu} />
                            <TextInFo
                                text={RootLang.lang.scthongtincanhan.ngaycaphochieu}
                                text1={item.NgayCapSoHoChieu ? Utils.formatDate(item.NgayCapSoHoChieu, "DD/MM/YYYY") : ""} />
                            <TextInFo
                                text={RootLang.lang.scthongtincanhan.ngayhethan}
                                text1={item.NgayHetHan ? Utils.formatDate(item.NgayHetHan, "DD/MM/YYYY") : ""} />
                            <TextInFo
                                text={RootLang.lang.scthongtincanhan.diachithuongtru}
                                text1={item.DiaChiThuongTru} />
                            <TextInFo
                                text={RootLang.lang.scthongtincanhan.diachitamtru}
                                text1={item.DiaChiTamTru} />
                            <TextInFo
                                text={RootLang.lang.scthongtincanhan.tinhtranghonnhan}
                                text1={item.TinhTrangHonNhan} />
                            <TextInFo
                                text={RootLang.lang.scthongtincanhan.dantoc}
                                text1={item.DanToc} />
                            <TextInFo
                                text={RootLang.lang.scthongtincanhan.tongiao}
                                text1={item.TonGiao} />
                            <TextInFo
                                text={RootLang.lang.scthongtincanhan.masothue}
                                text1={item.MaSoThue} />

                            <TextInFo
                                text={RootLang.lang.scthongtincanhan.ngaycapmasothue}
                                text1={item.NgayCapMST ? Utils.formatDate(item.NgayCapMST, "DD/MM/YYYY") : ""} />

                            <TextInFo
                                text={RootLang.lang.scthongtincanhan.sotaikhoan}
                                text1={item.SoTaiKhoan} />

                            <TextInFo
                                text={RootLang.lang.scthongtincanhan.chutaikhoan}
                                text1={item.ChuTaiKhoan} />

                            <TextInFo
                                text={RootLang.lang.scthongtincanhan.nganhang}
                                text1={item.ChiNhanhNganHang} />

                        </View>
                    </> : null}
            </View>
        )
    }

    renderThongTinKHan = (item) => {
        const { dDKhanCap } = this.state
        return (
            <View style={nstyles.shadowButTon, {
                backgroundColor: colors.white, height: 'auto', flex: 1,
                marginHorizontal: 12, marginBottom: 7, borderRadius: 10
            }}>
                <TouchableOpacity style={{ flexDirection: "row", paddingHorizontal: 10, paddingVertical: 15 }} onPress={() => this.setState({ dDKhanCap: !dDKhanCap })}>
                    <Text style={{
                        fontSize: sizes.sText16, flex: 1,
                        color: colors.colorTabActive
                    }}>{RootLang.lang.scthongtincanhan.lienhekhancap.toUpperCase()}</Text>
                    <Image
                        style={{
                            tintColor: colors.colorTabActive,
                            height: sizes.nImgSize10, width: sizes.nImgSize10, alignSelf: 'center'
                        }}
                        resizeMode={'contain'}
                        source={dDKhanCap == true ? Images.icDropDownU : Images.icDropDownD} />
                </TouchableOpacity>
                {dDKhanCap == true ?
                    <View style={{ paddingHorizontal: 10 }}>
                        <TextInFo
                            text={RootLang.lang.scthongtincanhan.hovaten}
                            text1={item.NguoiLienHe} />
                        <TextInFo
                            text={RootLang.lang.scthongtincanhan.quanhe}
                            text1={item.QuanHeNguoiLienHe} />
                        <TextInFo
                            text={RootLang.lang.scthongtincanhan.dienthoai}
                            text1={item.SoDienThoaiNguoiLienHe} />
                    </View>
                    : null}
            </View>
        )
    }

    renderHopDong = (item) => {
        const { dDHopDong } = this.state
        return (
            <View style={nstyles.shadow, { backgroundColor: colors.white, height: 'auto', marginHorizontal: 12, marginBottom: 7, borderRadius: 10 }}>
                <TouchableOpacity style={{ flexDirection: "row", paddingHorizontal: 10, paddingVertical: 15 }} onPress={() => this.setState({ dDHopDong: !dDHopDong })}>
                    <Text style={{
                        fontSize: sizes.sText16, flex: 1,
                        color: colors.colorTabActive
                    }}>{RootLang.lang.scthongtincanhan.hopdong.toUpperCase()}</Text>
                    <Image
                        style={{
                            tintColor: colors.colorTabActive,
                            height: sizes.nImgSize10, width: sizes.nImgSize10, alignSelf: 'center'
                        }}
                        resizeMode={'contain'}
                        source={dDHopDong == true ? Images.icDropDownU : Images.icDropDownD} />
                </TouchableOpacity>
                {dDHopDong == true ?
                    <>
                        {

                            item && item.length > 0 ? <FlatList
                                ListEmptyComponent={
                                    <ListEmpty textempty={RootLang.lang.scthongtincanhan.noData} />
                                }
                                data={item}
                                extraData={this.state}
                                renderItem={this.renderHopDongData}
                                showsVerticalScrollIndicator={false}
                                keyExtractor={(item, index) => index.toString()}
                            /> :
                                <Text style={{
                                    paddingVertical: 20, paddingHorizontal: 10,
                                    fontFamily: fonts.Helvetica, fontSize: sizes.sText14
                                }}>{RootLang.lang.thongbaochung.chuacapnhat}</Text>
                        }
                    </> : null
                }
            </View>
        )
    }

    renderHopDongData = ({ item, index }) => {
        return (
            <View>
                <View style={{
                    paddingHorizontal: 10,
                    paddingVertical: 15, borderRadius: 10
                }}>

                    <View style={{
                        flexDirection: 'row', paddingTop: 10,
                        justifyContent: 'center'
                    }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{
                                fontFamily: fonts.HelveticaBold,
                                fontSize: sizes.sText14,
                                color: colors.textblack,
                            }}>
                                {item.LoaiHD}
                            </Text>
                            <Text style={{
                                fontFamily: fonts.Helvetica,
                                color: colors.textGray,
                                fontSize: sizes.sText12,
                                marginTop: 10,
                                lineHeight: 14
                            }}>{`${Utils.formatDate(item.NgayCoHieuLuc, "DD/MM/YYYY")} - ${item.NgayHetHan ? Utils.formatDate(item.NgayHetHan, "DD/MM/YYYY") : '...'}`}</Text>
                        </View>

                    </View>

                </View>
                <View style={{ height: 1, backgroundColor: colors.colorlineJeeHr }} />
            </View>
        )
    }
    renderBangCapLoai1 = (item) => {
        const { dBBangCap1 } = this.state
        return (
            <View style={nstyles.shadowButTon, {
                backgroundColor: colors.white, height: 'auto', flex: 1,
                marginHorizontal: 12, marginBottom: 7, borderRadius: 10
            }}>
                <TouchableOpacity style={{ flexDirection: "row", paddingHorizontal: 10, paddingVertical: 15 }} onPress={() => this.setState({ dBBangCap1: !dBBangCap1 })}>
                    <Text style={{
                        fontSize: sizes.sText16, flex: 1,
                        color: colors.colorTabActive
                    }}>{RootLang.lang.scthongtincanhan.trinhdobangcap.toUpperCase()}</Text>
                    <Image
                        style={{
                            tintColor: colors.colorTabActive,
                            height: sizes.nImgSize10, width: sizes.nImgSize10, alignSelf: 'center'
                        }}
                        resizeMode={'contain'}
                        source={dBBangCap1 == true ? Images.icDropDownU : Images.icDropDownD} />
                </TouchableOpacity>

                {dBBangCap1 == true ?
                    <View style={{ paddingHorizontal: 10 }}>
                        <TextInFo
                            text={RootLang.lang.scthongtincanhan.trinhdohocvan}
                            text1={item.TrinhDoHocVan} />

                        <TextInFo
                            text={RootLang.lang.scthongtincanhan.truongtotnghiep}
                            text1={item.TruongTotNghiep} />
                        <TextInFo
                            text={RootLang.lang.scthongtincanhan.chuyenmon}
                            text1={item.ChuyenMon} />
                    </View> : null}
            </View>
        )
    }
    renderTrinhDoNgoaiNgu = (item) => {
        const { dDNgoaiNgu } = this.state
        return (
            <View style={nstyles.shadow, { backgroundColor: colors.white, height: 'auto', marginHorizontal: 12, marginBottom: 7, borderRadius: 10 }}>
                <TouchableOpacity style={{ flexDirection: "row", paddingHorizontal: 10, paddingVertical: 15 }} onPress={() => this.setState({ dDNgoaiNgu: !dDNgoaiNgu })}>
                    <Text style={{
                        fontSize: sizes.sText16, flex: 1,
                        color: colors.colorTabActive
                    }}>{RootLang.lang.scthongtincanhan.trinhdongoaingu.toUpperCase()}</Text>
                    <Image
                        style={{
                            tintColor: colors.colorTabActive,
                            height: sizes.nImgSize10, width: sizes.nImgSize10, alignSelf: 'center'
                        }}
                        resizeMode={'contain'}
                        source={dDNgoaiNgu == true ? Images.icDropDownU : Images.icDropDownD} />
                </TouchableOpacity>
                {dDNgoaiNgu == true ?
                    <>
                        {
                            item && item.length > 0 ? <FlatList
                                ListEmptyComponent={
                                    <ListEmpty textempty={RootLang.lang.scthongtincanhan.noData} />
                                }
                                data={item}
                                extraData={this.state}
                                renderItem={this.renderTrinhDoNgoaiNguData}
                                showsVerticalScrollIndicator={false}
                                keyExtractor={(item, index) => index.toString()}
                            /> :
                                <Text style={{
                                    paddingVertical: 20, paddingHorizontal: 10,
                                    fontFamily: fonts.Helvetica, fontSize: sizes.sText14
                                }}>{RootLang.lang.thongbaochung.chuacapnhat}</Text>

                        }
                    </> : null
                }
            </View>
        )
    }

    renderTrinhDoNgoaiNguData = ({ item, index }) => {
        return (
            <View >
                <View style={{ flexDirection: 'row', justifyContent: "space-between", marginHorizontal: 10 }}>
                    <Text style={[{
                        fontFamily: fonts.Helvetica,
                        fontSize: sizes.sText16, paddingTop: 10
                    }]}>{item.Bang ? item.Bang : "-"}</Text>
                    <Text style={[{
                        fontFamily: fonts.Helvetica,
                        fontSize: sizes.sText16, paddingTop: 10
                    }]}>{item.NgoaiNgu ? item.NgoaiNgu : '-'}</Text>
                </View>
                <Text style={[{
                    fontFamily: fonts.Helvetica,
                    fontSize: sizes.sText12,
                    color: colors.black_20, marginTop: 10, marginHorizontal: 10, marginBottom: 10
                }]}>Ghi chú: {item.GhiChu ? item.GhiChu : '-'}</Text>
                <View style={{ height: 1, backgroundColor: colors.colorlineJeeHr, marginTop: 20 }} />
            </View>
        )
    }

    renderBangCapLoai2 = (item) => {
        const { dBBangCap2 } = this.state
        return (
            <View style={nstyles.shadowButTon, {
                backgroundColor: colors.white, height: 'auto', flex: 1,
                marginHorizontal: 12, marginBottom: 7, borderRadius: 10
            }}>
                <TouchableOpacity style={{ flexDirection: "row", paddingHorizontal: 10, paddingVertical: 15 }} onPress={() => this.setState({ dBBangCap2: !dBBangCap2 })}>
                    <Text style={{
                        fontSize: sizes.sText16, flex: 1,
                        color: colors.colorTabActive
                    }}>{RootLang.lang.scthongtincanhan.trinhdobangcap.toUpperCase()}</Text>
                    <Image
                        style={{
                            tintColor: colors.colorTabActive,
                            height: sizes.nImgSize10, width: sizes.nImgSize10, alignSelf: 'center'
                        }}
                        resizeMode={'contain'}
                        source={dBBangCap2 == true ? Images.icDropDownU : Images.icDropDownD} />
                </TouchableOpacity>

                {dBBangCap2 == true ?
                    <View style={{ paddingHorizontal: 10 }}>
                        <TextInFo
                            text={RootLang.lang.scthongtincanhan.trinhdovanhoa}
                            text1={item.VanHoa} />
                        <TextInFo
                            text={RootLang.lang.scthongtincanhan.trinhdohocvan}
                            text1={item.TrinhDoHocVan} />
                        <TextInFo
                            text={RootLang.lang.scthongtincanhan.chuyennganh}
                            text1={item.ChuyenNganh} />
                        <TextInFo
                            text={RootLang.lang.scthongtincanhan.lyluanchinhtri}
                            text1={item.TenLyLuanChinhTri} />
                        <TextInFo
                            text={RootLang.lang.scthongtincanhan.quanlynhanuoc}
                            text1={item.TenQuanLyNhaNuoc} />
                        <TextInFo
                            text={RootLang.lang.scthongtincanhan.quanlygiaoduc}
                            text1={item.TenQuanLyGiaoDuc} />
                        <TextInFo
                            text={RootLang.lang.scthongtincanhan.tinhoc}
                            text1={item.TenTrinhDoTinHoc} />
                        <TextInFo
                            text={RootLang.lang.scthongtincanhan.trinhdonghiepvutheochuyenmon}
                            text1={item.TrinhDoNghiepVuTheoChuyenNganh} />
                        <TextInFo
                            text={RootLang.lang.scthongtincanhan.hocham}
                            text1={item.TenHocHam} />
                        <TextInFo
                            text={RootLang.lang.scthongtincanhan.namphong}
                            text1={item.HH_NamPhong ? Utils.formatDate(item.HH_NamPhong, "DD/MM/YYYY") : ""} />
                        <TextInFo
                            text={RootLang.lang.scthongtincanhan.hocvi}
                            text1={item.TenHocVi} />
                        <TextInFo
                            text={RootLang.lang.scthongtincanhan.namphong}
                            text1={item.HV_NamPhong ? Utils.formatDate(item.HV_NamPhong, "DD/MM/YYYY") : ""} />
                        <TextInFo
                            text={RootLang.lang.scthongtincanhan.chucdanhkhoahoc}
                            text1={item.ChucDanhKhoaHoc} />
                        <TextInFo
                            text={RootLang.lang.scthongtincanhan.namphong}
                            text1={item.CDKH_NamPhong ? Utils.formatDate(item.CDKH_NamPhong, "DD/MM/YYYY") : ""} />
                    </View>
                    : null}
            </View>
        )
    }
    renderQuaTrinhDaoTao = (item) => {
        const { dBQTDaoTao } = this.state
        return (
            <View style={nstyles.shadow, { backgroundColor: colors.white, height: 'auto', marginHorizontal: 12, marginBottom: 7, borderRadius: 10 }}>
                <TouchableOpacity style={{ flexDirection: "row", paddingHorizontal: 10, paddingVertical: 15 }} onPress={() => this.setState({ dBQTDaoTao: !dBQTDaoTao })}>
                    <Text style={{
                        fontSize: sizes.sText16, flex: 1,
                        color: colors.colorTabActive
                    }}>{RootLang.lang.scthongtincanhan.quatrinhdaotao.toUpperCase()}</Text>
                    <Image
                        style={{
                            tintColor: colors.colorTabActive,
                            height: sizes.nImgSize10, width: sizes.nImgSize10, alignSelf: 'center'
                        }}
                        resizeMode={'contain'}
                        source={dBQTDaoTao == true ? Images.icDropDownU : Images.icDropDownD} />
                </TouchableOpacity>
                {dBQTDaoTao == true ?
                    <>

                        {

                            item && item.length > 0 ? <FlatList
                                ListEmptyComponent={
                                    <ListEmpty textempty={RootLang.lang.scthongtincanhan.noData} />
                                }
                                data={item}
                                extraData={this.state}
                                renderItem={this.renderQuaTrinhDaoTaoData}
                                showsVerticalScrollIndicator={false}
                                keyExtractor={(item, index) => index.toString()}
                            /> :
                                <Text style={{
                                    paddingVertical: 20, paddingHorizontal: 10,
                                    fontFamily: fonts.Helvetica, fontSize: sizes.sText14
                                }}>{RootLang.lang.thongbaochung.chuacapnhat}</Text>
                        }
                    </> : null
                }


            </View>
        )
    }

    renderQuaTrinhDaoTaoData = ({ item, index }) => {
        return (
            <View>
                <View style={{
                    paddingHorizontal: 10,
                    paddingVertical: 15
                }}>
                    <TextInFo
                        stText1={{ fontWeight: "bold", fontSize: reSize(12), color: colors.black_90, }}
                        text={RootLang.lang.scthongtincanhan.noidungdaotao}
                        text1={item.NoiDung} />
                    <TextInFo
                        text={RootLang.lang.scthongtincanhan.noidaotao}
                        text1={item.NoiDaoTao} />
                    <TextInFo
                        text={RootLang.lang.scthongtincanhan.hinhthuc}
                        text1={item.HinhThuc} />
                    <TextInFo
                        text={RootLang.lang.scthongtincanhan.tungay}
                        text1={item.TuNgay ? Utils.formatDate(item.TuNgay, "DD/MM/YYYY") : ""} />
                    <TextInFo
                        text={RootLang.lang.scthongtincanhan.denngay}
                        text1={item.DenNgay ? Utils.formatDate(item.DenNgay, "DD/MM/YYYY") : ""} />
                    <TextInFo
                        text={RootLang.lang.scthongtincanhan.NhomBangCap}
                        text1={item.NhomBangCap} />
                    <TextInFo
                        text={RootLang.lang.scthongtincanhan.trinhdo}
                        text1={item.TrinhDo} />
                    <TextInFo
                        text={RootLang.lang.scthongtincanhan.danhhieu}
                        text1={item.DanhHieu} />
                    <TextInFo
                        text={RootLang.lang.scthongtincanhan.xeploai}
                        text1={item.XepLoai} />
                    <TextInFo
                        text={RootLang.lang.scthongtincanhan.ghiChu}
                        text1={item.GhiChu} />
                </View>
                <View style={{ height: 1, backgroundColor: colors.colorlineJeeHr }} />
            </View>
        )
    }

    renderQuaTrinhBoiDuong = (item) => {
        const { dBQuaTrinhBoiDuong } = this.state
        return (
            <View style={nstyles.shadow, { backgroundColor: colors.white, height: 'auto', marginHorizontal: 12, marginBottom: 7, borderRadius: 10 }}>
                <TouchableOpacity style={{ flexDirection: "row", paddingHorizontal: 10, paddingVertical: 15 }} onPress={() => this.setState({ dBQuaTrinhBoiDuong: !dBQuaTrinhBoiDuong })}>
                    <Text style={{
                        fontSize: sizes.sText16, flex: 1,
                        color: colors.colorTabActive
                    }}>{RootLang.lang.scthongtincanhan.boiduong.toUpperCase()}</Text>
                    <Image
                        style={{
                            tintColor: colors.colorTabActive,
                            height: sizes.nImgSize10, width: sizes.nImgSize10, alignSelf: 'center'
                        }}
                        resizeMode={'contain'}
                        source={dBQuaTrinhBoiDuong == true ? Images.icDropDownU : Images.icDropDownD} />
                </TouchableOpacity>
                {dBQuaTrinhBoiDuong == true ?
                    <>
                        {

                            item && item.length > 0 ? <FlatList
                                ListEmptyComponent={
                                    <ListEmpty textempty={RootLang.lang.scthongtincanhan.noData} />
                                }
                                data={item}
                                extraData={this.state}
                                renderItem={this.renderQuaTrinhBoiDuongData}
                                showsVerticalScrollIndicator={false}
                                keyExtractor={(item, index) => index.toString()}
                            /> :
                                <Text style={{
                                    paddingVertical: 20, paddingHorizontal: 10,
                                    fontFamily: fonts.Helvetica, fontSize: sizes.sText14
                                }}>{RootLang.lang.thongbaochung.chuacapnhat}</Text>
                        }
                    </> : null}
            </View>
        )
    }
    renderQuaTrinhBoiDuongData = ({ item, index }) => {
        return (
            <View>
                <View style={{
                    paddingHorizontal: 10,
                    paddingVertical: 15
                }}>
                    <TextInFo
                        stText1={{ fontWeight: "bold", fontSize: reSize(12), color: colors.black_90, }}
                        text={RootLang.lang.scthongtincanhan.noidungdaotao}
                        text1={item.NoiDungBoiDuong} />
                    <TextInFo
                        text={RootLang.lang.scthongtincanhan.noidaotao}
                        text1={item.NoiDaoTao} />
                    <TextInFo
                        text={RootLang.lang.scthongtincanhan.hinhthuc}
                        text1={item.HinhThuc} />
                    <TextInFo
                        text={RootLang.lang.scthongtincanhan.tungay}
                        text1={item.TuNgay ? Utils.formatDate(item.TuNgay, "DD/MM/YYYY") : ""} />
                    <TextInFo
                        text={RootLang.lang.scthongtincanhan.denngay}
                        text1={item.DenNgay ? Utils.formatDate(item.DenNgay, "DD/MM/YYYY") : ""} />
                </View>
                <View style={{ height: 1, backgroundColor: colors.colorlineJeeHr }} />
            </View>
        )
    }

    renderNguoiThan = (item) => {
        const { dBNguoiThan } = this.state
        return (
            <View style={nstyles.shadow, { backgroundColor: colors.white, height: 'auto', marginHorizontal: 12, marginBottom: 7, borderRadius: 10 }}>
                <TouchableOpacity style={{ flexDirection: "row", paddingHorizontal: 10, paddingVertical: 15 }} onPress={() => this.setState({ dBNguoiThan: !dBNguoiThan })}>
                    <Text style={{
                        fontSize: sizes.sText16, flex: 1,
                        color: colors.colorTabActive
                    }}>{RootLang.lang.scthongtincanhan.nguoithantitle.toUpperCase()}</Text>
                    <Image
                        style={{
                            tintColor: colors.colorTabActive,
                            height: sizes.nImgSize10, width: sizes.nImgSize10, alignSelf: 'center'
                        }}
                        resizeMode={'contain'}
                        source={dBNguoiThan == true ? Images.icDropDownU : Images.icDropDownD} />
                </TouchableOpacity>
                {dBNguoiThan == true ?
                    <>
                        {

                            item && item.length > 0 ? <FlatList
                                ListEmptyComponent={
                                    <ListEmpty textempty={RootLang.lang.scthongtincanhan.noData} />
                                }
                                data={item}
                                extraData={this.state}
                                renderItem={this.renderNguoiThanData}
                                showsVerticalScrollIndicator={false}
                                keyExtractor={(item, index) => index.toString()}
                            /> :
                                <Text style={{
                                    paddingVertical: 20, paddingHorizontal: 10,
                                    fontFamily: fonts.Helvetica, fontSize: sizes.sText14
                                }}>{RootLang.lang.thongbaochung.chuacapnhat}</Text>
                        }

                    </> : null}
            </View>
        )
    }
    renderNguoiThanData = ({ item, index }) => {
        return (
            <View >
                <View style={{ flexDirection: 'row', justifyContent: "space-between", marginHorizontal: 10 }}>
                    <Text style={[{
                        fontFamily: fonts.Helvetica,
                        fontSize: sizes.sText16, paddingTop: 20
                    }]}>{item.HoTen}</Text>
                    <Text style={[{
                        fontFamily: fonts.Helvetica,
                        fontSize: sizes.sText16, paddingTop: 20
                    }]}>{item.QuanHe ? item.QuanHe : '-'}</Text>
                </View>
                <Text style={[{
                    fontFamily: fonts.Helvetica,
                    fontSize: sizes.sText12,
                    color: colors.black_20, marginTop: 10, marginHorizontal: 10
                }]}>{item.NgaySinh ? item.NgaySinh : '-'}</Text>
                <View style={{ height: 1, backgroundColor: colors.colorlineJeeHr, marginTop: 20 }} />
            </View>
        )
    }

    renderHoSoDaNop = (item) => {
        const { dBHoSoDaNop } = this.state
        return (
            <View style={nstyles.shadow, { backgroundColor: colors.white, height: 'auto', marginHorizontal: 12, marginBottom: 7 }}>
                <TouchableOpacity style={{ flexDirection: "row", paddingHorizontal: 10, paddingVertical: 10 }}
                    onPress={() => this.setState({ dBHoSoDaNop: !dBHoSoDaNop })}>
                    <Text style={{
                        fontSize: sizes.sText16, flex: 1,
                        color: colors.colorTabActive
                    }}>{RootLang.lang.scthongtincanhan.hosodanop.toUpperCase()}</Text>
                    <Image
                        style={{
                            tintColor: colors.colorTabActive,
                            height: sizes.nImgSize10, width: sizes.nImgSize10, alignSelf: 'center'
                        }}
                        resizeMode={'contain'}
                        source={dBHoSoDaNop == true ? Images.icDropDownU : Images.icDropDownD} />
                </TouchableOpacity>
                {dBHoSoDaNop == true ?
                    <>
                        {
                            item && item.length > 0 ? <FlatList
                                ListEmptyComponent={
                                    <ListEmpty textempty={RootLang.lang.scthongtincanhan.noData} />
                                }
                                data={item}
                                extraData={this.state}
                                renderItem={this.renderHoSoDaNopData}
                                showsVerticalScrollIndicator={false}
                                keyExtractor={(item, index) => index.toString()}
                            /> :
                                <Text style={{
                                    paddingVertical: 20, paddingHorizontal: 10,
                                    fontFamily: fonts.Helvetica, fontSize: sizes.sText14
                                }}>{RootLang.lang.thongbaochung.chuacapnhat}</Text>

                        }
                    </> : null}
            </View>
        )
    }

    renderHoSoDaNopData = ({ item, index }) => {
        return (
            <View >
                <View style={{ flexDirection: 'row', justifyContent: "space-between", marginHorizontal: 10, paddingTop: 15 }}>
                    <Text style={[{
                        fontFamily: fonts.Helvetica,
                        fontSize: sizes.sText16
                    }]}>{item.Title ? item.Title : "-"}</Text>
                    <Image
                        style={{ height: sizes.nImgSize20, width: sizes.nImgSize20 }}
                        resizeMode={'contain'}
                        source={item.IsNop == 1 ? Images.icDaNop : Images.icChuaNop} />
                </View>
                <View style={{ height: 1, backgroundColor: colors.colorlineJeeHr, marginTop: 20 }} />
            </View>
        )
    }
    _renderThoIViec = () => {
        const { showThoiViec, dataThoiViec } = this.state
        return (
            <TouchableOpacity
                onPress={() => { Utils.goscreen(this, "sc_ThoiViec", { reLoad: this.getInfoThoiViec, deeplink: true }) }}
                style={[nstyles.shadowButTon, {
                    marginHorizontal: 12,
                    paddingVertical: 15, alignItems: 'center', borderRadius: 10,
                    borderWidth: 0.5, borderColor: colors.checkCancle, backgroundColor: colors.bgRed, marginBottom: 15
                }, { marginTop: 20 }]}>
                <Text style={{
                    color: colors.checkCancle, fontFamily: fonts.Helvetica,
                    fontSize: reText(15), fontWeight: 'bold'
                }}>{RootLang.lang.scthongtincanhan.xinthoiviec}</Text>
            </TouchableOpacity>
        )
    }

    render() {
        const { dataUser, showNoData, showThoiViec } = this.state
        return (
            <View style={{ flex: 1, backgroundColor: colors.backgroudJeeHR }}>
                {/* Header  */}
                <HeaderAnimationJee nthis={this} title={RootLang.lang.scthongtincanhan.thongtinnhanvien} />
                {/* BODY */}
                <View style={{ flex: 1, backgroundColor: colors.backgroudJeeHR, paddingTop: 10 }}>
                    <ScrollView
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={() => this.onRefesh()}
                            />
                        }
                        style={{ backgroundColor: colors.backgroudJeeHR }}>
                        {!dataUser && showNoData ?
                            <Text style={styles.txtNoData}>{RootLang.lang.thongbaochung.khongcodulieu}</Text>
                            :
                            <View>
                                {this.renderItemDesign(1, dataUser)}
                                {this.renderItemDesign(2, dataUser)}
                                {this.renderItemDesign(3, dataUser)}
                                {this.renderItemDesign(4, dataUser.HopDong)}
                                {this.renderItemDesign(5, dataUser)}
                                {this.renderItemDesign(6, dataUser.TrinhDoNgoaiNgu)}
                                {this.renderItemDesign(7, dataUser)}
                                {this.renderItemDesign(8, dataUser.QuaTrinhDaoTao)}
                                {this.renderItemDesign(9, dataUser.QuaTrinhBoiDuong)}
                                {this.renderItemDesign(10, dataUser.NguoiThan)}
                                {this.renderItemDesign(11, dataUser.HoSoDaNop)}
                            </View>
                        }

                        {showThoiViec ? this._renderThoIViec() : null}
                        <View style={{ marginBottom: 20 }} />
                    </ScrollView>
                    <IsLoading />
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    txtNoData: {
        textAlign: 'center'
    }
})
const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(InfoUser, mapStateToProps, true)