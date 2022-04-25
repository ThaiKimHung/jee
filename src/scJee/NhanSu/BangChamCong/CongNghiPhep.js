import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { RootLang } from '../../../app/data/locales';
import Utils from '../../../app/Utils';
import { colors } from '../../../styles/color';
import { sizes } from '../../../styles/size';
import { nstyles } from '../../../styles/styles';

class CongNghiPhep extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tong: 0,

        };
    }
    renderHeader = () => {
        return (
            <View>
                <View style={{ paddingVertical: 10 }} >
                    <Text style={{ fontWeight: 'bold', fontSize: sizes.sText16, }}>{RootLang.lang.bangchamcong.nghiphep}</Text>
                </View>
                <View style={{ height: 1, backgroundColor: colors.colorLineGray }} />
            </View>


        )
    }
    componentDidMount() {
        let { data_nghiphep = [] } = this.props
        console.log("DATA:", data_nghiphep)
        let tong = 0
        data_nghiphep.map(datum => {
            let gio = parseFloat(datum.SoNgayNghi)
            tong += gio
        })
        this.setState({ tong: tong })
    }

    render() {
        let { data_nghiphep = [] } = this.props
        return (

            <View style={[nstyles.shadowButTon, { paddingHorizontal: 10, paddingVertical: 10, borderRadius: 10, backgroundColor: colors.white, marginTop: 15 }]}>
                <View style={[nstyles.nrow, { justifyContent: 'space-between' }]}>
                    <Text style={[nstyles.txtBlack, { fontWeight: 'bold' }]}>{RootLang.lang.scbangcong.nghiphepcaps}</Text>
                    <Text style={[nstyles.txtBlack, { color: colors.colorTabActive, fontWeight: "bold" }]}>{this.state.tong ? this.state.tong : '0'}</Text>
                </View>
                <View style={{ height: 0.5, marginVertical: 10, backgroundColor: colors.grayLine }} />
                {
                    data_nghiphep.length > 0 && data_nghiphep.map((item, index) => {
                        return (<View key={index.toString()}>
                            <View style={[nstyles.nrow, { justifyContent: 'space-between' }]}>
                                <Text style={[nstyles.txtBlack,]}>{item.Title}</Text>
                                <Text style={[nstyles.txtBlack, { color: colors.orangeText }]}>{item.SoNgayNghi ? item.SoNgayNghi : '0'}</Text>
                            </View>
                        </View>)

                    })
                }

            </View>
        )
    }
}
const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(CongNghiPhep, mapStateToProps, true)