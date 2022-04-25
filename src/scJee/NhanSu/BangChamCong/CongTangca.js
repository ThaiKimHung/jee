import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { RootLang } from '../../../app/data/locales';
import Utils from '../../../app/Utils';
import { colors } from '../../../styles/color';
import { nstyles } from '../../../styles/styles';

class CongTangca extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render() {
        var { SongayTrongThang = {} } = this.props
        return (
            <View style={[nstyles.shadowButTon, { paddingHorizontal: 10, paddingVertical: 10, borderRadius: 10, backgroundColor: colors.white, marginTop: 15, marginBottom: 15 }]}>
                <View style={[nstyles.nrow, { justifyContent: 'space-between' }]}>
                    <Text style={[nstyles.txtBlack, { fontWeight: 'bold' }]}>{RootLang.lang.scbangcong.lamthemgio.toUpperCase()}</Text>
                    <Text style={[nstyles.txtBlack, { color: colors.colorTabActive, fontWeight: "bold" }]}>{SongayTrongThang.TongGioTangCa ? SongayTrongThang.TongGioTangCa : '0'}</Text>
                </View>
                <View style={{ height: 0.5, marginVertical: 10, backgroundColor: colors.grayLine }} />
                <View style={[nstyles.nrow, { justifyContent: 'space-between' }]}>
                    <Text style={[nstyles.txtBlack,]}>{RootLang.lang.scbangcong.tangcangaythuong}</Text>
                    <Text style={[nstyles.txtBlack, { color: colors.orangeText }]}>{SongayTrongThang.TangCaNgayThuong ? SongayTrongThang.TangCaNgayThuong : '0'}</Text>
                </View>

                <View style={[nstyles.nrow, { justifyContent: 'space-between' }]}>
                    <Text style={[nstyles.txtBlack]}>{RootLang.lang.scbangcong.tangcangaynghi}</Text>
                    <Text style={[nstyles.txtBlack, { color: colors.orangeText }]}>{SongayTrongThang.TangCaNgayNghi ? SongayTrongThang.TangCaNgayNghi : '0'}</Text>
                </View>

                <View style={[nstyles.nrow, { justifyContent: 'space-between' }]}>
                    <Text style={[nstyles.txtBlack]}>{RootLang.lang.scbangcong.tangcangayle}</Text>
                    <Text style={[nstyles.txtBlack, { color: colors.orangeText }]}>{SongayTrongThang.TangCaNgayLe ? SongayTrongThang.TangCaNgayLe : '0'}</Text>
                </View>
            </View>

        )
    }
}
const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(CongTangca, mapStateToProps, true)