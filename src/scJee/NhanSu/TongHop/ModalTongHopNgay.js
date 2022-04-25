import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import {
    TouchableOpacity, View, Animated, FlatList, Text, Image
} from 'react-native';
import { RootLang } from '../../../app/data/locales';
import Utils from '../../../app/Utils';
import HeaderComStack from '../../../components/HeaderComStack';
import { Images } from '../../../images';
import { colors, fonts } from '../../../styles';
import { nstyles, Width } from '../../../styles/styles';
import { getDuLieuTongHop } from '../../../apis/apiDuLieuChamCong';
import IsLoading from '../../../components/IsLoading';
import { reText, sizes } from '../../../styles/size';
import ListEmpty from '../../../components/ListEmpty';
import { nGlobalKeys } from '../../../app/keys/globalKey';
import moment from 'moment';
import { TouchDropNewVer2 } from '../../Component/itemcom/itemcom';
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import HeaderAnimationJee from '../../../components/HeaderAnimationJee';
const RowID = [1, 2, 3, 4, 5]
class ModalTongHopNgay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            animationValue: new Animated.Value(0),
            animationValueCongTac: new Animated.Value(0),
            animationValueDiLam: new Animated.Value(0),
            animationValueNghiPhep: new Animated.Value(0),
            animationValueDiTre: new Animated.Value(0),
            animationValueVang: new Animated.Value(0),

            viewStateCongTac: false,
            viewStateDiLam: false,
            viewStateNghiPhep: false,
            viewStateDiTre: false,
            viewStateVang: false,

            dataCongTac: [],
            dataDiLam: [],
            dataNghiPhep: [],
            dataDiTre: [],
            dataVang: [],

            toDay: Utils.getGlobal(nGlobalKeys.TimeNow, '') ? moment(Utils.getGlobal(nGlobalKeys.TimeNow, '')).add(-7, "hours").format("DD/MM/YYYY") : moment(Date.now()).format("DD/MM/YYYY"),
            _dateDk: moment(new Date()).format('DD/MM/YYYY'),

            expandedAll: false

        }
        this.type = Utils.ngetParam(this, 'type', 0)
        this.isMonth = Utils.ngetParam(this, 'isMonth', 12);
        this.isTimeYear = Utils.ngetParam(this, 'isTimeYear', 2020);
        this.title = Utils.ngetParam(this, 'title', '');
        let temp = new Date(this.isTimeYear, this.isMonth);
        this.isError = false;
    }

    _getDuLieuTongHop = async () => {
        nthisLoading.show();
        let res = await getDuLieuTongHop(this.state.toDay);
        if (res.status == 1) {
            nthisLoading.hide();
            this.setState({
                refreshing: false,
                dataCongTac: res.dataCongTac, dataDiLam: res.dataDiLam, dataDiLam: res.dataDiLam,
                dataNghiPhep: res.dataNghiPhep, dataTre: res.dataTre, dataVang: res.dataVang
            })
        }
        else nthisLoading.hide();


    }
    componentDidMount = async () => {
        this.toggleAnimationTHdataVang()
        this.toggleAnimationTHdataDiTre()
        this.toggleAnimationTHdataNghiPhep()
        this.toggleAnimationTHdataCongTac()
        this.toggleAnimationTHdataDiLam()
        this._getDuLieuTongHop()
    }
    renderItemDesign = (row) => {
        const { dataCongTac,
            dataDiLam,
            dataNghiPhep,
            dataDiTre,
            dataVang } = this.state
        let rowId = RowID.map((rowId) => rowId);
        let index = rowId.findIndex(d => d === row);
        if (index >= 0) {
            switch (row) {
                case 1:
                    return this.renderDataVang(dataVang)
                case 2:
                    return this.renderDataDiTre(dataDiTre)
                case 3:
                    return this.renderDataDiNghiPhep(dataNghiPhep)
                case 4:
                    return this.renderDataCongTac(dataCongTac)
                case 5:
                    return this.renderDataDiLam(dataDiLam)
                default:
                    return null;
            }
        } else {
            return null;
        }
    }


    toggleAnimationTHdataVang = async () => {
        await this._getDuLieuTongHop()
        if (this.state.viewStateVang == true) {
            Animated.timing(this.state.animationValueVang, {
                toValue: this.state.dataVang.length > 0 ? this.state.dataVang.length * 74 : 50,
                duration: this.state.dataVang.length > 0 ? 500 : 250
            }).start(() => {
                this.setState({ viewStateVang: false })
            });
        }
        else {
            Animated.timing(this.state.animationValueVang, {
                toValue: 0,
                duration: 250

            }).start(this.setState({ viewStateVang: true })
            );
        }
    }
    toggleAnimationTHdataDiTre = async () => {
        await this._getDuLieuTongHop()
        if (this.state.viewStateDiTre == true) {
            Animated.timing(this.state.animationValueDiTre, {
                toValue: this.state.dataDiTre.length > 0 ? this.state.dataDiTre.length * 77 : 50,
                duration: this.state.dataDiTre.length > 0 ? 500 : 250
            }).start(() => {
                this.setState({ viewStateDiTre: false })
            });
        }
        else {
            Animated.timing(this.state.animationValueDiTre, {
                toValue: 0,
                duration: 250

            }).start(this.setState({ viewStateDiTre: true })
            );
        }
    }
    toggleAnimationTHdataNghiPhep = async () => {
        await this._getDuLieuTongHop()
        if (this.state.viewStateNghiPhep == true) {
            Animated.timing(this.state.animationValueNghiPhep, {
                toValue: this.state.dataNghiPhep.length > 0 ? this.state.dataNghiPhep.length * 100 : 50,
                duration: this.state.dataNghiPhep.length > 0 ? 500 : 250
            }).start(() => {
                this.setState({ viewStateNghiPhep: false })
            });
        }
        else {
            Animated.timing(this.state.animationValueNghiPhep, {
                toValue: 0,
                duration: 250

            }).start(this.setState({ viewStateNghiPhep: true })
            );
        }
    }


    toggleAnimationTHdataCongTac = async () => {
        await this._getDuLieuTongHop()
        if (this.state.viewStateCongTac == true) {
            Animated.timing(this.state.animationValueCongTac, {
                toValue: this.state.dataCongTac.length > 0 ? this.state.dataCongTac.length * 100 : 50,
                duration: this.state.dataCongTac.length > 0 ? 500 : 250
            }).start(() => {
                this.setState({ viewStateCongTac: false })
            });
        }
        else {
            Animated.timing(this.state.animationValueCongTac, {
                toValue: 0,
                duration: 250

            }).start(this.setState({ viewStateCongTac: true })
            );
        }
    }
    toggleAnimationTHdataDiLam = async () => {
        await this._getDuLieuTongHop()
        if (this.state.viewStateDiLam == true) {
            Animated.timing(this.state.animationValueDiLam, {
                toValue: this.state.dataDiLam.length > 0 ? this.state.dataDiLam.length * 77 : 50,
                duration: this.state.dataDiLam.length > 0 ? 500 : 250
            }).start(() => {
                this.setState({ viewStateDiLam: false })
            });
        }
        else {
            Animated.timing(this.state.animationValueDiLam, {
                toValue: 0,
                duration: 250

            }).start(this.setState({ viewStateDiLam: true })
            );
        }
    }



    //Vắng
    renderDataVang = (item) => {
        const animatedStyle = {
            height: this.state.animationValueVang
        }

        const { viewStateVang } = this.state
        return (
            <View style={nstyles.shadow, { backgroundColor: colors.white, height: 'auto', marginHorizontal: 15, marginBottom: 7, borderRadius: 5 }}>
                <TouchableOpacity style={{ flexDirection: "row", paddingHorizontal: 10, paddingVertical: 10 }} onPress={() => this.toggleAnimationTHdataVang()}>
                    <Text style={{
                        fontSize: sizes.sText16, flex: 1, alignSelf: 'center',
                        color: colors.colorTabActive
                    }}>{RootLang.lang.scTongHopNgay.nhanvienvang.toUpperCase()}</Text>
                    <View style={{
                        height: Width(7.5), width: Width(7.5), borderRadius: 99, backgroundColor: "#c42e3c", borderColor: colors.grey,
                        borderWidth: 0, justifyContent: "center", marginHorizontal: 3
                    }}>
                        <Text style={{ textAlign: "center", color: colors.white }}>{item.length}</Text>
                    </View>
                </TouchableOpacity>
                <Animated.View style={[animatedStyle, { flex: 1, width: "100%", borderRadius: 10 }]} >
                    {

                        <FlatList
                            nestedScrollEnabled={true}
                            style={{ flex: 1 }}
                            contentContainerStyle={{ paddingBottom: 10 }}
                            ListEmptyComponent={
                                <ListEmpty textempty={RootLang.lang.scTongHopNgay.nhanvienvang.toUpperCase} />
                            }
                            data={item}
                            extraData={this.state}
                            renderItem={this.renderVangData}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(item, index) => index.toString()}
                        />

                    }
                </Animated.View>

            </View>
        )
    }

    renderVangData = ({ item, index }) => {
        return (
            <View style={{ backgroundColor: colors.colorBGHome, }}>
                <View
                    style={nstyles.shadow, {
                        flex: 1, flexDirection: 'row',
                        backgroundColor: colors.white, paddingVertical: 15,
                        height: 'auto', paddingHorizontal: 10,

                    }}>
                    <View style={{ flex: 1, flexDirection: 'row', height: '100%', alignItems: 'center' }}>
                        <ImageAva ShowImage={item.ShowImage} Ten={item.Ten} backColor={item.BgColor} itemUri={item?.Image} ></ImageAva>
                        <View style={{ flex: 1, paddingLeft: 10 }}>
                            <View style={{ flex: 1 }}>
                                <View style={{ flex: 1, flexDirection: 'row', marginRight: 20 }}>
                                    <Text style={{
                                        fontSize: sizes.sText16, lineHeight: sizes.sText17, flex: 1,
                                        fontFamily: fonts.Helvetica, color: colors.colorTextBack80
                                    }}
                                        numberOfLines={2}
                                    >{item.HoTen}</Text>
                                    <Text style={{ color: colors.textTabActive, fontSize: sizes.sText16, }}>{item.MaNV}</Text>
                                </View>

                                <View style={{ flex: 1, marginTop: 6, flexDirection: 'row', marginRight: 20 }}>
                                    <Text style={{
                                        fontStyle: 'italic',
                                        fontFamily: fonts.Helvetica,
                                        color: colors.colorGrayLight,
                                        fontSize: sizes.sText12, lineHeight: sizes.sText16,
                                    }}>{item.ChucVu}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {this.state.dataVang.length - 1 == index ? null :
                    <View style={{
                        width: '100%', backgroundColor: colors.white,
                        height: 1, alignItems: 'center'
                    }}>
                        <View style={{ width: '90%', backgroundColor: colors.veryLightPink, height: 1 }}></View>
                    </View>
                }
            </View >

        )
    }


    //Vào Trễ
    renderDataDiTre = (item) => {
        const animatedStyle = {
            height: this.state.animationValueDiTre
        }
        const { viewStateDiTre } = this.state
        return (
            <View style={nstyles.shadow, { backgroundColor: colors.white, height: 'auto', marginHorizontal: 15, marginBottom: 7, borderRadius: 5 }}>
                <TouchableOpacity style={{ flexDirection: "row", paddingHorizontal: 10, paddingVertical: 10 }} onPress={() => this.toggleAnimationTHdataDiTre()}>
                    <Text style={{
                        fontSize: sizes.sText16, flex: 1, alignSelf: 'center',
                        color: colors.colorTabActive
                    }}>{RootLang.lang.scTongHopNgay.vaotre.toUpperCase()}</Text>
                    <View style={{
                        height: Width(7.5), width: Width(7.5), borderRadius: 99, backgroundColor: "#fbc248",
                        borderColor: colors.grey,
                        borderWidth: 0, justifyContent: "center", marginHorizontal: 3
                    }}>
                        <Text style={{ textAlign: "center", color: colors.white }}>{item.length}</Text>
                    </View>
                </TouchableOpacity>
                <Animated.View style={[animatedStyle, { flex: 1, width: "100%", borderRadius: 10 }]} >
                    {

                        <FlatList
                            ListEmptyComponent={
                                <ListEmpty textempty={RootLang.lang.scTongHopNgay.khongconhanvienvaotre.toUpperCase()} />
                            }
                            data={item}
                            nestedScrollEnabled={true}
                            style={{ flex: 1 }}
                            contentContainerStyle={{ paddingBottom: 10 }}
                            extraData={this.state}
                            renderItem={this.renderDiTreData}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(item, index) => index.toString()}
                        />

                    }
                </Animated.View>
            </View>
        )
    }

    renderDiTreData = ({ item, index }) => {
        return (
            <View style={{ backgroundColor: colors.colorBGHome, }}>
                <View
                    style={nstyles.shadow, {
                        flex: 1, flexDirection: 'row',
                        backgroundColor: colors.white, paddingVertical: 15,
                        paddingHorizontal: 10,
                    }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
                        <ImageAva ShowImage={item.ShowImage} Ten={item.Ten} backColor={item.BgColor} itemUri={item?.Image} ></ImageAva>
                        <View style={{ flex: 1, paddingLeft: 10 }}>
                            <View style={{ flex: 1 }}>
                                <View style={{ flex: 1, flexDirection: 'row', marginRight: 20 }}>
                                    <Text style={{
                                        fontSize: sizes.sText16, lineHeight: sizes.sText17, flex: 1,
                                        fontFamily: fonts.Helvetica, color: colors.colorTextBack80
                                    }}
                                        numberOfLines={2}
                                    >{item.HoTen}</Text>
                                    <Text style={{ color: colors.textTabActive, fontSize: sizes.sText16, }}> {moment(item.TuNgay).format("DD/MM/YYYY")} - {item.DenNgay ? moment(item.DenNgay).format("DD/MM/YYYY") : "..."}</Text>
                                </View>

                                <View style={{ flex: 1, paddingTop: 10, flexDirection: 'row', marginRight: 20, justifyContent: 'space-between' }}>
                                    <Text style={{
                                        fontStyle: 'italic',
                                        fontFamily: fonts.Helvetica,
                                        color: colors.colorGrayLight,
                                        fontSize: sizes.sText12, lineHeight: sizes.sText16,
                                    }}>{item.ChucVu}</Text>
                                    <Text style={{
                                        fontStyle: 'italic',
                                        fontFamily: fonts.Helvetica,
                                        color: colors.colorGrayLight,
                                        fontSize: sizes.sText12,
                                    }}>{RootLang.lang.scTongHopNgay.cong}: {item.Cong}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                {this.state.dataDiTre.length - 1 == index ? null :
                    <View style={{
                        width: '100%', backgroundColor: colors.white,
                        height: 1, alignItems: 'center'
                    }}>
                        <View style={{ width: '90%', backgroundColor: colors.veryLightPink, height: 1 }}></View>
                    </View>
                }
            </View >
        )
    }

    //Nghi Phép

    renderDataDiNghiPhep = (item) => {
        const animatedStyle = {
            height: this.state.animationValueNghiPhep
        }
        const { viewStateNghiPhep } = this.state
        return (
            <View style={nstyles.shadow, { backgroundColor: colors.white, marginHorizontal: 15, marginBottom: 7, borderRadius: 5 }}>
                <TouchableOpacity style={{ flexDirection: "row", paddingHorizontal: 10, paddingVertical: 10 }} onPress={() => this.toggleAnimationTHdataNghiPhep()}>
                    <Text style={{
                        fontSize: sizes.sText16, flex: 1, alignSelf: 'center',
                        color: colors.colorTabActive
                    }}>{RootLang.lang.scTongHopNgay.nghiphep.toUpperCase()}</Text>
                    <View style={{
                        height: Width(7.5), width: Width(7.5), borderRadius: 99, backgroundColor: "#ed8c32",
                        borderColor: colors.grey,
                        borderWidth: 0, justifyContent: "center", marginHorizontal: 3
                    }}>
                        <Text style={{ textAlign: "center", color: colors.white }}>{item.length}</Text>
                    </View>
                </TouchableOpacity>
                <Animated.View style={[animatedStyle, { flex: 1, borderRadius: 10 }]} >
                    {
                        <FlatList
                            ListEmptyComponent={
                                <ListEmpty textempty={RootLang.lang.scTongHopNgay.khongconhanviennghiphep.toUpperCase()} />
                            }
                            data={item}
                            nestedScrollEnabled={true}
                            style={{ flex: 1 }}
                            contentContainerStyle={{ paddingBottom: 10 }}
                            extraData={this.state}
                            renderItem={this.renderNghiPhepData}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    }
                </Animated.View>

            </View>
        )
    }

    renderNghiPhepData = ({ item, index }) => {
        return (
            <View style={{ backgroundColor: colors.colorBGHome, }}>
                <View
                    style={nstyles.shadow, {
                        flex: 1, flexDirection: 'row',
                        backgroundColor: colors.white, paddingVertical: 15,
                        paddingHorizontal: 10,
                    }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <ImageAva ShowImage={item.ShowImage} Ten={item.Ten} backColor={item.BgColor} itemUri={item?.Image} ></ImageAva>
                        <View style={{ flex: 1, paddingLeft: 10 }}>
                            <View style={{ flex: 1 }}>
                                <View style={{ flex: 1, flexDirection: 'row', marginRight: 20 }}>
                                    <Text style={{
                                        fontSize: sizes.sText16, lineHeight: sizes.sText17, flex: 1,
                                        fontFamily: fonts.Helvetica, color: colors.colorTextBack80
                                    }}
                                        numberOfLines={2}
                                    >{item.HoTen}</Text>
                                    <Text style={{ color: colors.textTabActive, fontSize: sizes.sText16, }}>{item.SoNgay} {RootLang.lang.scTongHopNgay.ngay}</Text>
                                </View>

                                <View style={{ flex: 1, marginTop: 6, marginRight: 20 }}>
                                    <View>
                                        <Text style={{
                                            flex: 1, fontSize: sizes.sText13, lineHeight: sizes.sText17,
                                            fontFamily: fonts.Helvetica, color: colors.colorGrayLight,
                                        }}>{Utils.ThuNgayGio(item?.TuNgay)} - {Utils.ThuNgayGio(item?.DenNgay)} </Text>
                                    </View>
                                    <Text style={{
                                        flex: 1, fontSize: sizes.sText13, lineHeight: sizes.sText17,
                                        fontFamily: fonts.Helvetica, color: colors.colorGrayLight, paddingTop: 5
                                    }}>{RootLang.lang.scTongHopNgay.lydo}: {item.LyDo}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {this.state.dataNghiPhep.length - 1 == index ? null :
                    <View style={{
                        width: '100%', backgroundColor: colors.white,
                        height: 1, alignItems: 'center'
                    }}>
                        <View style={{ width: '90%', backgroundColor: colors.veryLightPink, height: 1 }}></View>
                    </View>
                }
            </View >
        )
    }


    //Công Tác
    renderDataCongTac = (item) => {
        const animatedStyle = {
            height: this.state.animationValueCongTac
        }
        const { viewStateCongTac } = this.state
        return (
            <View style={nstyles.shadow, { backgroundColor: colors.white, height: 'auto', marginHorizontal: 15, marginBottom: 7, borderRadius: 5 }}>
                <TouchableOpacity style={{ flexDirection: "row", paddingHorizontal: 10, paddingVertical: 10 }} onPress={() => this.toggleAnimationTHdataCongTac()}>
                    <Text style={{
                        fontSize: sizes.sText16, flex: 1, alignSelf: 'center',
                        color: colors.colorTabActive
                    }}>{RootLang.lang.scTongHopNgay.congtac.toUpperCase()}</Text>
                    <View style={{
                        height: Width(7.5), width: Width(7.5), borderRadius: 99, backgroundColor: "#7cb54f",
                        borderColor: colors.grey,
                        borderWidth: 0, justifyContent: "center", marginHorizontal: 3
                    }}>
                        <Text style={{ textAlign: "center", color: colors.white }}>{item.length}</Text>
                    </View>
                </TouchableOpacity>
                <Animated.View style={[animatedStyle, { flex: 1, width: "100%", borderRadius: 10 }]} >
                    {
                        <FlatList
                            ListEmptyComponent={
                                <ListEmpty textempty={RootLang.lang.scTongHopNgay.khongconhanviencongtac.toUpperCase()} />
                            }
                            data={item}
                            nestedScrollEnabled={true}
                            style={{ flex: 1 }}
                            contentContainerStyle={{ paddingBottom: 10 }}
                            extraData={this.state}
                            renderItem={this.renderCongTacData}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    }
                </Animated.View>

            </View>
        )
    }

    renderCongTacData = ({ item, index }) => {
        return (
            <View style={{ backgroundColor: colors.colorBGHome, }}>
                <View
                    style={nstyles.shadow, {
                        flex: 1, flexDirection: 'row',
                        backgroundColor: colors.white, paddingVertical: 15,
                        paddingHorizontal: 10,
                    }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <ImageAva ShowImage={item.ShowImage} Ten={item.Ten} backColor={item.BgColor} itemUri={item?.Image} ></ImageAva>
                        <View style={{ flex: 1, paddingLeft: 10 }}>
                            <View style={{ flex: 1 }}>
                                <View style={{ flex: 1, flexDirection: 'row', marginRight: 20 }}>
                                    <Text style={{
                                        fontSize: sizes.sText16, lineHeight: sizes.sText17, flex: 1,
                                        fontFamily: fonts.Helvetica, color: colors.colorTextBack80
                                    }}
                                        numberOfLines={2}
                                    >{item.HoTen}</Text>
                                    <Text style={{ color: colors.textTabActive, fontSize: sizes.sText16, }}>{item.SoNgay} {RootLang.lang.scTongHopNgay.ngay}</Text>
                                </View>

                                <View style={{ flex: 1, marginTop: 6, marginRight: 20 }}>
                                    <Text style={{
                                        flex: 1, fontSize: sizes.sText13, lineHeight: sizes.sText17,
                                        fontFamily: fonts.Helvetica, color: colors.colorGrayLight,
                                    }}>{Utils.ThuNgayGio(item?.TuNgay)} - {Utils.ThuNgayGio(item?.DenNgay)} </Text>
                                    <Text style={{
                                        flex: 1, fontSize: sizes.sText13, lineHeight: sizes.sText17,
                                        fontFamily: fonts.Helvetica, color: colors.colorGrayLight, paddingTop: 5
                                    }}>{RootLang.lang.scTongHopNgay.lydo}: {item.LyDo}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                {this.state.dataCongTac.length - 1 == index ? null :
                    <View style={{
                        width: '100%', backgroundColor: colors.white,
                        height: 1, alignItems: 'center'
                    }}>
                        <View style={{ width: '90%', backgroundColor: colors.veryLightPink, height: 1 }}></View>
                    </View>
                }
            </View >
        )
    }
    //Nhân viên đi làm

    renderDataDiLam = (item) => {
        const animatedStyle = {
            height: this.state.animationValueDiLam
        }
        const { viewStateDiLam } = this.state
        return (
            <View style={nstyles.shadow, { backgroundColor: colors.white, height: 'auto', marginHorizontal: 15, marginBottom: 7, borderRadius: 5 }}>
                <TouchableOpacity style={{ flexDirection: "row", paddingHorizontal: 10, paddingVertical: 10 }} onPress={() => this.toggleAnimationTHdataDiLam()}>
                    <Text style={{
                        fontSize: sizes.sText16, flex: 1, alignSelf: 'center',
                        color: colors.colorTabActive
                    }}>{RootLang.lang.scTongHopNgay.nhanviendilam.toUpperCase()}</Text>
                    <View style={{
                        height: Width(7.5), width: Width(7.5), borderRadius: 99, backgroundColor: "#197eb8",
                        borderColor: colors.grey,
                        borderWidth: 0, justifyContent: "center", marginHorizontal: 3
                    }}>
                        <Text style={{ textAlign: "center", color: colors.white }}>{item.length}</Text>
                    </View>
                </TouchableOpacity>
                <Animated.View style={[animatedStyle, { flex: 1, width: "100%", borderRadius: 10 }]} >
                    {

                        <FlatList
                            ListEmptyComponent={
                                <ListEmpty textempty={RootLang.lang.scTongHopNgay.khongconhanviendilam.toUpperCase()} />
                            }
                            data={item}
                            extraData={this.state}
                            nestedScrollEnabled={true}
                            style={{ flex: 1 }}
                            contentContainerStyle={{ paddingBottom: 10 }}
                            renderItem={this.renderDiLamData}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(item, index) => index.toString()}
                        />

                    }
                </Animated.View>
            </View>
        )
    }

    renderDiLamData = ({ item, index }) => {
        return (
            <View style={{ backgroundColor: colors.colorBGHome, }}>
                <View
                    style={nstyles.shadow, {
                        flex: 1, flexDirection: 'row',
                        backgroundColor: colors.white, paddingVertical: 15,
                        paddingHorizontal: 10,
                    }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
                        <ImageAva ShowImage={item.ShowImage} Ten={item.Ten} backColor={item.BgColor} itemUri={item?.Image} ></ImageAva>
                        <View style={{ flex: 1, paddingLeft: 10 }}>
                            <View style={{ flex: 1 }}>
                                <View style={{ flex: 1, flexDirection: 'row', marginRight: 20 }}>
                                    <Text style={{
                                        fontSize: sizes.sText16, lineHeight: sizes.sText17, flex: 1,
                                        fontFamily: fonts.Helvetica, color: colors.colorTextBack80
                                    }}
                                        numberOfLines={2}
                                    >{item.HoTen}</Text>
                                    <Text style={{ color: colors.textTabActive, fontSize: sizes.sText16, }}>{moment(item?.BatDau).format("HH:mm")} - {item?.KetThuc ? moment(item?.KetThuc).format("HH:mm") : "..."}</Text>
                                </View>

                                <View style={{ flex: 1, paddingTop: 10, flexDirection: 'row', marginRight: 20, justifyContent: 'space-between' }}>
                                    <Text style={{
                                        fontStyle: 'italic',
                                        fontFamily: fonts.Helvetica,
                                        color: colors.colorGrayLight,
                                        fontSize: sizes.sText12, lineHeight: sizes.sText16,
                                    }}>{item.ChucVu}</Text>
                                    <Text style={{
                                        fontStyle: 'italic',
                                        fontFamily: fonts.Helvetica,
                                        color: colors.colorGrayLight,
                                        fontSize: sizes.sText12,
                                    }}>{RootLang.lang.scTongHopNgay.cong}: {item.Cong}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                {this.state.dataDiLam.length - 1 == index ? null :
                    <View style={{
                        width: '100%', backgroundColor: colors.white,
                        height: 1, alignItems: 'center'
                    }}>
                        <View style={{ width: '90%', backgroundColor: colors.veryLightPink, height: 1 }}></View>
                    </View>
                }
            </View >
        )
    }


    _selectDate = () => {
        var { toDay } = this.state;
        Utils.goscreen(this, "Modal_CalandaSingalCom", {
            date: toDay,
            setTimeFC: this._setDate

        })
    }
    _setDate = (date) => {
        this.setState({
            toDay: date,
            viewStateCongTac: false,
            viewStateDiLam: false,
            viewStateNghiPhep: false,
            viewStateDiTre: false,
            viewStateVang: false,
        }, () => {
            this._getDuLieuTongHop()
            this.toggleAnimationTHdataVang()
            this.toggleAnimationTHdataDiTre()
            this.toggleAnimationTHdataNghiPhep()
            this.toggleAnimationTHdataCongTac()
            this.toggleAnimationTHdataDiLam()
        }, () => {

        })
    }
    render() {
        var { toDay, expandedAll } = this.state

        return (
            <View style={nstyles.ncontainer}>
                {/* Header  */}
                <HeaderAnimationJee nthis={this}
                    title={RootLang.lang.scTongHopNgay.tonghoptrongngay}
                    onPressLeft={() => {
                        ROOTGlobal.GetSoLuongTongHop.GetSLTongHop()
                        Utils.goback(this)
                    }}
                    onPressRight={async () => {
                        await this.setState({ expandedAll: !expandedAll }, () => {
                            this.toggleAnimationTHdataVang(),
                                this.toggleAnimationTHdataDiTre(),
                                this.toggleAnimationTHdataNghiPhep(),
                                this.toggleAnimationTHdataCongTac(),
                                this.toggleAnimationTHdataDiLam()
                        }
                        )
                    }}
                />
                {/* BODY */}
                <View style={{ flex: 1, backgroundColor: colors.colorBGHome, }}>
                    <ScrollView
                        style={{ backgroundColor: colors.backgroudJeeHR, flex: 1 }}>
                        <TouchDropNewVer2
                            styView={{ marginHorizontal: 15 }}
                            styTouch={{ margin: 0, marginVertical: 10, borderRadius: 5 }}
                            styText={{
                                color: colors.textTabActive, fontWeight: "800",
                                fontSize: reText(16), textAlign: "right", marginRight: -15,
                            }}
                            styTitle={{ marginLeft: 0, fontSize: reText(13) }}
                            title={RootLang.lang.scTongHopNgay.tonghoppnhanvientrongngay}
                            _onPress={() => this._selectDate()}
                            value={toDay ? toDay : ''}
                        />

                        {this.renderItemDesign(1)}
                        {this.renderItemDesign(2)}
                        {this.renderItemDesign(3)}
                        {this.renderItemDesign(4)}
                        {this.renderItemDesign(5)}

                        <View style={{ marginBottom: 20 }} />
                    </ScrollView>
                    <IsLoading />
                </View>
            </View >
        );
    }
}

const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(ModalTongHopNgay, mapStateToProps, true)

class ImageAva extends Component {
    render() {
        let { ShowImage, Ten, backColor, itemUri } = this.props
        return (
            <>
                {
                    ShowImage ? (
                        <Image source={{ uri: itemUri }} style={[nstyles.nAva40]} />
                    ) : (
                        <View style={[nstyles.nAva40, {
                            flexDirection: "row",
                            justifyContent: 'center',
                            backgroundColor: backColor,
                        }]} >
                            <Text style={{ alignSelf: "center", fontWeight: "bold", fontSize: reText(18), color: colors.white }}>{Ten}</Text>
                        </View>
                    )
                }
            </>
        )
    }
}