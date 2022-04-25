import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { RootLang } from '../../../app/data/locales';
import Utils from '../../../app/Utils';
import { colors } from '../../../styles/color';
import { nstyles } from '../../../styles/styles';

class CongTrongThang extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render() {
        var { SongayTrongThang = {} } = this.props
        return (

            <View style={[nstyles.shadowButTon, { paddingHorizontal: 10, paddingVertical: 10, borderRadius: 10, backgroundColor: colors.white, }]}>

                <View style={[nstyles.nrow, { justifyContent: 'space-between' }]}>
                    <Text style={[nstyles.txtBlack, { fontWeight: 'bold' }]}>{RootLang.lang.scbangcong.tongcongngay.toUpperCase()}</Text>
                    <Text style={[nstyles.txtBlack, { color: colors.colorTabActive, fontWeight: "bold" }]}>{SongayTrongThang.TongCongLam ? SongayTrongThang.TongCongLam : '0'}</Text>
                </View>
                <View style={{ height: 0.5, marginVertical: 10, backgroundColor: colors.grayLine }} />
                <View style={[nstyles.nrow, { justifyContent: 'space-between' }]}>
                    <Text style={[nstyles.txtBlack,]}>{RootLang.lang.scbangcong.sonngaydilam}</Text>
                    <Text style={[nstyles.txtBlack, { color: colors.orangeText }]}>{SongayTrongThang.SoNgayDiLam ? SongayTrongThang.SoNgayDiLam : '0'}</Text>
                </View>

                <View style={[nstyles.nrow, { justifyContent: 'space-between' }]}>
                    <Text style={[nstyles.txtBlack]}>{RootLang.lang.scbangcong.songaytrocapcadem}</Text>
                    <Text style={[nstyles.txtBlack, { color: colors.orangeText }]}>{SongayTrongThang.SoNgayTroCapCaDem ? SongayTrongThang.SoNgayTroCapCaDem : '0'}</Text>
                </View>

                <View style={[nstyles.nrow, { justifyContent: 'space-between' }]}>
                    <Text style={[nstyles.txtBlack]}>{RootLang.lang.scbangcong.songayle}</Text>
                    <Text style={[nstyles.txtBlack, { color: colors.orangeText }]}>{SongayTrongThang.SoNgayLe ? SongayTrongThang.SoNgayLe : '0'}</Text>
                </View>
            </View>


        )
    }
}
const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(CongTrongThang, mapStateToProps, true)