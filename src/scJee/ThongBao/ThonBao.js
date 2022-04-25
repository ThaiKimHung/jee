import moment from 'moment'
import React, { Component } from 'react'
import {
    FlatList, Image,
    StyleSheet, Text,
    TouchableOpacity, View
} from 'react-native'
import { GetListTypeNotify } from '../../apis/apiControllergeneral'
import { GetThongBao } from '../../apis/apithongbaonhansupersonal'
import { RootLang } from '../../app/data/locales'
import Utils from '../../app/Utils'
import HeaderComStack from '../../components/HeaderComStack'
import { Images } from '../../images'
import { colors } from '../../styles'
import { sizes } from '../../styles/size'
import { nstyles } from '../../styles/styles'
import { TouchDropNew } from '../Component/itemcom/itemcom'

export class DanhSachThongBao extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataListThongBao: [],
            refreshing: true,
            SelectLoai:
            {
                ID: 0,
                Title: RootLang.lang.scthongbaocv.tatca
            },
            listType: [
                {
                    ID: 0,
                    Title: RootLang.lang.scthongbaocv.tatca
                }]
        }
    }
    _ViewItem = (item) => {
        return (
            <Text key={item.ID} style={{
                fontSize: sizes.sText16,
                color: this.state.SelectLoai.ID == item.ID ? colors.colorTabActive : 'black',
                textAlign: 'center'
            }}>{`${item.Title}`}</Text>)
    }
    _callback = (SelectLoai) => {
        this.setState({ SelectLoai }, this._getListThongBao);
    }
    _DropDown = () => {
        Utils.goscreen(this, 'Modal_ComponentSelectCom', { callback: this._callback, item: this.state.SelectLoai, AllThaoTac: this.state.listType, ViewItem: this._ViewItem })
    }
    _chiTietThongBao = (item = {}) => {

        Utils.goscreen(this, 'Modal_ChiTietThongBao', { RowID: item.ID })
    }
    //--api
    componentDidMount() {
        this._GetListTypeThongBao();

    }
    _getListThongBao = async () => {
        this.setState({ refreshing: true })
        const { SelectLoai } = this.state;
        let res = await GetThongBao(SelectLoai ? SelectLoai.ID : '');
        if (res.status == 1) {
            this.setState({
                dataListThongBao: res.Data, refreshing: false
            })
        } else {
            this.setState({ refreshing: false })
        }
    }
    _GetListTypeThongBao = async () => {
        const res = await GetListTypeNotify();

        if (res.status == 1 && res.data) {
            this.setState({
                listType: [{
                    ID: 0,
                    Title: RootLang.lang.scthongbaocv.tatca
                }, ...res.data],
            }, this._getListThongBao)
        }
    }
    _renderThongBao = ({ item, index }) => {
        return (
            <View style={{ marginHorizontal: 15, marginTop: 3, borderRadius: 3 }}>
                <TouchableOpacity
                    onPress={() => this._chiTietThongBao(item)}
                    key={index} style={{
                        flexDirection: 'row', paddingVertical: 20, backgroundColor: colors.white,
                    }}>
                    <Image source={item.Is_Read == true ? Images.icThongBaoDaXem : Images.icThongBaoChuaXem} style={{ marginLeft: 10, marginRight: 20 }} />
                    <View>
                        <Text allowFontScaling={false} style={{ fontSize: sizes.sText16, marginRight: 60, color: "black", fontWeight: item.Is_Read == true ? 'normal' : 'bold' }}>{item.Title}</Text>
                        <View style={{ flexDirection: 'row', marginTop: 5 }}>
                            <Text style={{ color: "#65676B" }}>{moment(item.LastModified).format('DD/MM/YYYY hh:mm')}</Text>
                            <Text style={{ color: "#65676B" }}> - </Text>
                            <Text style={{ color: "#65676B" }}>{RootLang.lang.scthongbaocv.title}</Text>
                        </View>
                    </View>

                </TouchableOpacity>
                <View style={{ backgroundColor: colors.veryLightPinkFive, height: 1, marginHorizontal: 10 }} />
            </View>

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

    _goback = async () => {

        this.props.navigation.reset({
            index: 0,
            routes: [{ name: 'sw_HomePage' }],
        });
    }
    render() {
        var { SelectLoai, dataListThongBao } = this.state;
        return (
            <View style={nstyles.ncontainer}>
                <HeaderComStack nthis={this} title={RootLang.lang.scthongbaocv.title} onPressLeft={() => { this._goback() }} />

                <TouchDropNew value={SelectLoai ? SelectLoai.Title : ''}
                    title={RootLang.lang.scthongbaocv.loai}
                    _onPress={this._DropDown} />
                <FlatList
                    data={dataListThongBao}
                    renderItem={this._renderThongBao}
                    keyExtractor={(item, index) => index.toString()}
                    ListEmptyComponent={this.renderListEmpty}

                    refreshing={this.state.refreshing}
                    onRefresh={this._getListThongBao}
                />
            </View>
        )
    }
}


const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(DanhSachThongBao, mapStateToProps, true)

const styles = StyleSheet.create({
    txtGreen: {
        color: colors.colorTabActive
    }
})