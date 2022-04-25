import { default as Moment, default as moment } from 'moment';
import React, { Component } from 'react';
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { getDSHanMuc, getListNam } from '../../../apis/apiPhep';
import { RootLang } from '../../../app/data/locales';
import Utils from '../../../app/Utils';
import UtilsApp from '../../../app/UtilsApp';
import IsLoading from '../../../components/IsLoading';
import { Images } from '../../../images/index';
import { colors } from '../../../styles/color';
import { fonts } from '../../../styles/font';
import { sizes } from '../../../styles/size';
import { nstyles } from '../../../styles/styles';

class SoPhep extends Component {
    constructor(props) {
        super(props);
        this.page = 1;
        this.pageAll = 1
        this.state = {
            DsHanMuc: [],
            SoNgayPhepThamNien: '0',
            TongNgayPhepNam: '0',
            listNam: [{ Title: 'Chọn năm', ID_Row: '-1' }],
            Selectnam: moment(new Date()),
            record: 10,
            refreshing: true,
            date: Moment().year().toString()
        }
    }
    componentDidMount() {
        this._getDsHanMuc();
    }
    _getDsHanMuc = async () => {
        // nthisLoading.show();
        var { Selectnam, record } = this.state;
        var nam = moment(Selectnam).format('YYYY');
        let res = await getDSHanMuc(nam, 1, record);
        var DsHanMuc = []
        var { data = [], SoNgayPhepThamNien = 0, TongNgayPhepNam = 0, page = {} } = res;
        if (res.status == 1 && data.length > 0) {
            // nthisLoading.hide();
            DsHanMuc = DsHanMuc.concat(data);
            TongNgayPhepNam = res.TongNgayPhepNam;
            SoNgayPhepThamNien = res.SoNgayPhepThamNien;
            var { Page = 1, AllPage = 1 } = page;
            this.page = Page;
            this.pageNumber = AllPage;
            this.setState({
                DsHanMuc: DsHanMuc,
                SoNgayPhepThamNien: SoNgayPhepThamNien,
                refreshing: false,
                TongNgayPhepNam: TongNgayPhepNam,
                showload: false,
            });

        } else {
            // nthisLoading.hide();
            this.setState({ refreshing: false, showload: false, }, () => {
                if (res.status == 1) {
                    this.setState({
                        DsHanMuc: [], SoNgayPhepThamNien: 0,
                        refreshing: false, TongNgayPhepNam: 0,
                        showload: false,
                    });

                } else {
                    UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.thongbaochung.loilaydulieu, 2)
                }
            })
        }
    }
    _onRefresh = () => {
        this.setState({ refreshing: true, showload: true, }, this._getDsHanMuc);
    }
    _getNam = async () => {
        const res = await getListNam();
        var { data = [] } = res;
        if (res.status == 1 && data.length > 0) {
            this.setState({ listNam: res.data, Selectnam: res.data[0] }, this._getDsHanMuc);
        } else {
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, RootLang.lang.thongbaochung.loilaydulieu, 2)
        }
        return

    }
    _onPressItem = (item) => {
        Utils.goscreen(this.props.nthis, "Modal_ChiTietLoaiphep", {
            item: item,
            _delete: this._DeteleDonPhep,
            nthis: this,
            IsPhepNam: item.IsPhepNam,
            tongNgayPhepNam: item.tongNgayPhepNam,
            soNgayPhepThamNien: item.soNgayPhepThamNien
        })
    }

    _renderItem = ({ item, index }) => {
        var { DsHanMuc, TongNgayPhepNam,
            SoNgayPhepThamNien } = this.state
        item.tongNgayPhepNam = TongNgayPhepNam
        item.soNgayPhepThamNien = SoNgayPhepThamNien
        return (

            <TouchableOpacity key={index}
                style={[nstyles.shadowButTon, nstyles.nrow, {
                    backgroundColor: colors.colorBGHome,

                }]}
                onPress={() => this._onPressItem(item)}
            >
                <View style={nstyles.shadow, {
                    flex: 1, flexDirection: 'row', justifyContent: "space-between",
                    paddingVertical: 20, backgroundColor: colors.white
                }}>
                    <View>
                        <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                            <Image
                                source={Images.icCalendar}
                                style={{
                                    marginLeft: 10, tintColor: colors.colorGreen,
                                    width: 20, height: 20
                                }}
                            />
                            <View style={{ marginLeft: 20 }}>
                                <Text style={{ fontSize: sizes.sText16 }}>{item.LoaiPhep}</Text>
                                <Text style={{
                                    fontSize: sizes.sText12, paddingBottom: 5,
                                    fontFamily: fonts.Helvetica, color: colors.black_20
                                }}
                                    numberOfLines={3}
                                >{RootLang.lang.scphepthemdon.tongsongayconlai + " : "}<Text style={{
                                    color: colors.colorTabActive,
                                    fontSize: sizes.sText16, fontWeight: "bold"
                                }}>{`${item.Tong} ${RootLang.lang.common.ngay}`}</Text></Text>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity >
        );
    }
    _ItemSeparatorComponent = () => {
        return (
            <View style={{ height: 5, backgroundColor: colors.colorBGHome }} />
        )
    }
    loadMoreData = async () => {
        var { Selectnam, record } = this.state
        await this.setState({ showload: true })
        const pageNumber = this.page + 1;
        if (this.page < this.pageAll) {
            const res = await getDSHanMuc(moment(Selectnam).format('YYYY'), pageNumber, record);
            var { data = [], SoNgayPhepThamNien = 0, TongNgayPhepNam = 0, page = {} } = res;
            if (res.status == 1 && data.length > 0) {
                TongNgayPhepNam = res.TongNgayPhepNam;
                SoNgayPhepThamNien = res.SoNgayPhepThamNien;
                var { Page = 1, AllPage = 1 } = page;
                this.page = Page;
                this.pageNumber = AllPage;
                this.setState({ DsHanMuc: this.state.DsHanMuc.concat(data), SoNgayPhepThamNien: SoNgayPhepThamNien, refreshing: false, TongNgayPhepNam: TongNgayPhepNam, showload: false, });
            } else {
                Utils.showMsgBoxOK(this.props.nthis, RootLang.lang.thongbaochung.thongbao, RootLang.lang.thongbaochung.loilaydulieu, RootLang.lang.thongbaochung.xacnhan);
            }
        };
        this.setState({ showload: false })
    };

    _onPressChoosNam = (val) => {
        var { Selectnam } = this.state
        if (val == true) {
            this.setState({ Selectnam: moment(Selectnam).add(1, 'year') }, this._getDsHanMuc)
        } else {
            this.setState({ Selectnam: moment(Selectnam).add(-1, 'year') }, this._getDsHanMuc)
        }
    }
    renderListEmpty = () => {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Image source={Images.icListEmpty} style={{ width: sizes.nImgSize200, height: sizes.nImgSize200 }} resizeMode={'cover'} />
                <Text style={{ fontSize: sizes.sText16, color: colors.brownGreyTwo }}>{RootLang.lang.thongbaochung.khongcodulieu}</Text>
            </View>
        )
    }
    render() {
        var { DsHanMuc, Selectnam } = this.state

        return (
            <View style={{ flex: 1, backgroundColor: colors.colorBGHome, padding: 15, }}>
                <View style={{ justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                    <TouchableOpacity
                        onPress={() => this._onPressChoosNam(false)}>
                        <Image
                            source={Images.btnPre}
                            style={{ tintColor: colors.colorTabActive }}
                        />
                    </TouchableOpacity>
                    <Text
                        style={{
                            color: colors.colorTabActive, paddingVertical: 10,
                            paddingLeft: 10, fontSize: sizes.sText16, fontWeight: "bold", marginHorizontal: 40
                        }}>{RootLang.lang.scphepthemdon.nam + " " + moment(Selectnam).format('YYYY')}</Text>
                    <TouchableOpacity
                        onPress={() => this._onPressChoosNam(true)}
                    >
                        <Image
                            source={Images.btnNext}
                            style={{ tintColor: colors.colorTabActive }}
                        />
                    </TouchableOpacity>
                </View>

                <FlatList
                    ListEmptyComponent={this.renderListEmpty}
                    data={DsHanMuc}
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh}
                    style={{ marginTop: 20 }}
                    renderItem={this._renderItem}
                    ItemSeparatorComponent={this._ItemSeparatorComponent}
                    onEndReached={this.loadMoreData}
                    showsVerticalScrollIndicator={false}
                    ListFooterComponent={this.state.showload ?
                        <ActivityIndicator size='small' /> : null}
                    keyExtractor={(item, index) => index.toString()} />
                <IsLoading>

                </IsLoading>
            </View>
        )
    }
}

const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(SoPhep, mapStateToProps, true)