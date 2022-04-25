import moment from 'moment'
import React, { Component } from 'react'
import { StyleSheet, Text, TouchableHighlight, View, Image } from 'react-native'
import { RootLang } from '../../../../app/data/locales'
import Utils from '../../../../app/Utils'
import { Images } from '../../../../images'
import { colors } from '../../../../styles'
import { reText, sizes } from '../../../../styles/size'
import { nstyles, Width } from '../../../../styles/styles'

class ItemGiaiTrinh extends Component {
    constructor(props) {
        super(props)
        this.state = {
            key: 0
        }
    }

    componentDidMount() {
        this.setState({ key: this.props.item.key })
    }

    render() {
        var { item, styleItem, styleTitle, onPress = () => { }, disable, valid } = this.props
        var { key } = this.state
        let ChamVao = item.GioChamCong.split('-')[0].length > 1 ? true : false //xét có chấm vào 
        let ChamRa = item.GioChamCong.split('-')[1].length > 1 ? true : false //xét có chấm vào 
        let giochamcong = item.GioChamCong.replace('-', ' - ')
        let giovaodung = item.GioVaoDung
        let gioradung = item.GioRaDung

        return (
            <View style={{ backgroundColor: colors.white, marginHorizontal: 10, paddingHorizontal: 10, paddingVertical: 15, borderRadius: 10, marginTop: 7, flexDirection: 'row' }}>
                <View style={{ width: Width(6) }}>
                    <Image source={valid == null ? Images.ImageJee.ic_ChoDuyet : valid == false ? Images.ImageJee.icUnBrowser : item.IsDuyet ? Images.ImageJee.icBrowser : Images.ImageJee.icUnBrowser} />
                </View>
                <View>
                    <View style={{ flexDirection: 'row', width: Width(85), justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: reText(14), color: colors.checkGreen, fontWeight: 'bold' }}>{moment(item.Ngay).format('ddd, DD/MM/YYYY')}
                            <Text style={{ color: colors.checkAwait, fontSize: reText(14) }}> ({ChamVao ? '' : '#'}{giochamcong}{ChamRa ? '' : '#'})</Text>
                        </Text>
                        <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                            {giovaodung ?
                                <Text style={[styles.text_title, { color: '#828282', alignSelf: 'center', fontSize: reText(14) }, styleTitle]}>{giovaodung}</Text> :
                                ChamVao ? <Image source={Images.ImageJee.icClockJee} style={{ width: Width(5), height: Width(5), alignSelf: 'center' }} /> :
                                    <Text style={[styles.text_title, { color: '#828282', alignSelf: 'center', fontSize: reText(14) }, styleTitle]}>{'#'}</Text>
                            }
                            <Text style={{ fontSize: reText(14), color: colors.colorNoteJee, alignSelf: 'center' }}>{' - '}</Text>
                            {gioradung ?
                                <Text style={[styles.text_title, { color: '#828282', alignSelf: 'center', fontSize: reText(14) }, styleTitle]}>{gioradung}</Text> :
                                ChamRa ? <Image source={Images.ImageJee.icClockJee} style={{ width: Width(5), height: Width(5), alignSelf: 'center' }} /> :
                                    <Text style={[styles.text_title, { color: '#828282', alignSelf: 'center', fontSize: reText(14) }, styleTitle]}>{'#'}</Text>
                            }
                        </View>
                    </View>
                    <View style={{ marginTop: 5, width: Width(85) }}>
                        <Text style={{ fontSize: reText(12), color: colors.colorNoteJee }}>{item.LyDo ? item.LyDo : '--'}</Text>
                    </View>
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    containerItem: {
        padding: 15,
        marginHorizontal: 15,
        marginTop: 8,
        ...nstyles.shadowButTon,
        flex: 1
    },
    title: {
        justifyContent: 'space-between',
        ...nstyles.nrow
    },
    text_title: {
        fontSize: sizes.sText16,
        color: colors.white,
        fontWeight: 'bold'
    },
    title_mini: {
        marginTop: 14,
        justifyContent: 'space-between',
        ...nstyles.nrow
    },
    time: {
        fontSize: sizes.sText16,
        color: colors.white,
        fontWeight: 'bold'
    },
    content: {
        marginTop: 10,
        color: colors.white
    }
})
const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(ItemGiaiTrinh, mapStateToProps, true)
