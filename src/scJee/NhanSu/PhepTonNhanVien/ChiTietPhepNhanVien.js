import Moment from 'moment';
import React, { Component } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { getChiTietPhepTon, getListNam } from '../../../apis/apiPhepTon';
import { RootLang } from '../../../app/data/locales';
import Utils from '../../../app/Utils';
import HeaderComStack from '../../../components/HeaderComStack';
import ListEmpty from '../../../components/ListEmpty';
import { Images } from '../../../images/index';
import { colors } from '../../../styles/color';
import { fonts } from '../../../styles/font';
import { sizes } from '../../../styles/size';
import { nstyles } from '../../../styles/styles';

class ChiTietPhepNhanVien extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: Utils.ngetParam(this, 'itemchon', {}),
            DsHanMuc: [],
            SoNgayPhepThamNien: '',
            TongNgayPhepNam: '',
            listNam: [],
            Selectnam: null,
            _page: 1,
            _allPage: 1,
            record: 10,
            refreshing: true,
            TenNV: '',
            listNam: [],
            Selectnam: Utils.ngetParam(this, 'itemchon', {}).year,
            date: Moment().year().toString(),
        }
        this.showChiTietPhepTon = this.showChiTietPhepTon.bind(this);
    }
    componentDidMount() {
        this._getNam()
        this._getDsHanMuc();
    }
    _getNam = async () => {
        let res = await getListNam();
        if (res.status == 1) {
            var { data = [] } = res;
            if (Array.isArray(data) && data.length > 0) {
                let nam;
                listNam = res.data.map((item) => {
                    if (item.Title == this.state.date) {
                        nam = {
                            name: item.Title,
                            value: item.ID_Row
                        }
                    }
                    return {
                        name: item.Title,
                        value: item.ID_Row
                    }
                })
                this.setState({ listNam }, () => this._getDsHanMuc())
            }

        }

    }
    _getDsHanMuc = async (nextPage = 1) => {
        var { DsHanMuc, TongNgayPhepNam,
            SoNgayPhepThamNien, Selectnam,
            _page, _allPage, record } = this.state

        if (nextPage == 1) {
            DsHanMuc = [];
        }
        let value = `${Selectnam.value}|${this.state.data.ID_NV}`
        let res = await getChiTietPhepTon(value, nextPage, record);
        if (res.status == 1) {
            var { data = [], SoNgayPhepThamNien = '', TongNgayPhepNam = '', page = {} } = res;
            if (Array.isArray(data) && data.length > 0) {
                DsHanMuc = DsHanMuc.concat(data);
                TongNgayPhepNam = res.TongNgayPhepNam;
                SoNgayPhepThamNien = res.SoNgayPhepThamNien;
            } else {
                DsHanMuc = []
            }
            var { Page = 1, AllPage = 1 } = page;
            _page = Page;
            _allPage = AllPage;
        }
        this.setState({ DsHanMuc, _page, _allPage, SoNgayPhepThamNien, refreshing: false, TongNgayPhepNam })
    }
    _onRefresh = () => {
        this.setState({ refreshing: true }, () => this._getDsHanMuc());

    }
    _goBack = () => {
        Utils.goback(this)
    };

    _goback = async () => {
        Utils.goback(this, null)
    }
    showChiTietPhepTon = (item) => {
        item.Year = this.state.Selectnam;
        Utils.goscreen(this, 'Modal_CTDS_PhepTon', { itemchon: item })
    }
    _renderItem = ({ item, index }) => {

        var { DSphep } = this.state

        return (
            <TouchableOpacity
                onPress={() => { this.showChiTietPhepTon(item) }}
            >
                <View style={[nstyles.nrow, { paddingTop: 15, paddingBottom: 15, alignItems: 'flex-start' }]}>
                    <View style={{ flex: 4, }}>
                        <Text  style={{
                            fontSize: sizes.sText12, lineHeight: 16, paddingRight: 30,
                            fontFamily: fonts.Helvetica, color: colors.colorTextBack80
                        }}
                            numberOfLines={2}
                        >
                            {item.LoaiPhep}
                        </Text>
                    </View>
                    <View style={{ flex: 4, }}>
                        <Text  style={{
                            fontSize: sizes.sText12, lineHeight: 16, paddingRight: 30,
                            fontFamily: fonts.Helvetica, color: colors.colorTextBack80,
                            textAlign: 'center'
                        }}
                            numberOfLines={2}
                        >
                            {item.Tong}
                        </Text>
                    </View>

                    <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
                        <TouchableOpacity
                            onPress={() => { this.showChiTietPhepTon(item) }}
                        >
                            <Image source={Images.icGoBackGreen}
                                resizeMode='contain'
                                style={{ width: 20, height: 20 }} />
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity >
        )
    }


    ItemSeparatorComponent = () => {
        return (<View style={{ height: 1, backgroundColor: colors.BackBorder }} />)
    }
    render() {
        var { DSphep, tinhtrangSelect } = this.state;
        var { HoTen = "" } = this.state.data
        return (
            <View style={nstyles.ncontainer}>
                {/* Header  */}
                <HeaderComStack nthis={this} title={HoTen} Screen={true} />
                {/* BODY */}
                <View style={{ flex: 1, backgroundColor: colors.white }}>

                    <View style={{ flex: 1, backgroundColor: colors.white, paddingBottom: 15 }}>

                        <View style={{
                            flex: 5, backgroundColor: colors.white,
                            paddingHorizontal: 15, paddingTop: 15
                        }}>
                            <View style={[{ flex: 1, borderRadius: 6 }]}>
                                <View style={[nstyles.nrow, { marginTop: 5, }]}>
                                    <View style={{ flex: 4, }}>
                                        <Text  style={{
                                            fontSize: sizes.sText12, lineHeight: 16, fontFamily: fonts.Helvetica,
                                            color: colors.colorTextBack80
                                        }}>{RootLang.lang.guidonxinnghiphep.loaiphep}</Text>
                                    </View>
                                    <View style={{ flex: 4 }}>
                                        <Text  style={{
                                            fontSize: sizes.sText12, lineHeight: 16,
                                            fontFamily: fonts.Helvetica, color: colors.colorTextBack80,

                                        }}>{RootLang.lang.guidonxinnghiphep.tongsongay}</Text>
                                    </View>
                                    <View style={{ flex: 1 }}>

                                    </View>
                                </View>
                                <View style={{ height: 1, backgroundColor: colors.colorLineGreen, marginTop: sizes.sText10 }} />
                                <FlatList
                                    ListEmptyComponent={<ListEmpty textempty={RootLang.lang.thongbaochung.khongcodulieu} />}
                                    data={this.state.DsHanMuc}
                                    refreshing={this.state.refreshing}
                                    onRefresh={this._onRefresh}
                                    ItemSeparatorComponent={this.ItemSeparatorComponent}
                                    style={{ backgroundColor: 'white' }}
                                    renderItem={this._renderItem}
                                    showsVerticalScrollIndicator={false}
                                    keyExtractor={(item, index) => index.toString()} />
                            </View>
                        </View>


                    </View>
                </View>
            </View >
        );
    }
};

const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(ChiTietPhepNhanVien, mapStateToProps, true)
