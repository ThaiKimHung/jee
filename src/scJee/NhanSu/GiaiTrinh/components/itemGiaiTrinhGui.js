import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, TouchableHighlight, Image } from 'react-native'
import { colors } from '../../../../styles'
import { reText, sizes } from '../../../../styles/size'
import { nstyles, Width } from '../../../../styles/styles'
import moment from 'moment'
import Utils from '../../../../app/Utils'
import { RootLang } from '../../../../app/data/locales'
import { Images } from '../../../../images'
import { color } from 'react-native-reanimated'

class ItemGiaiTrinhGui extends Component {
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
        var { item, styleItem, styleTitle, onPress = () => { }, checkLast = false } = this.props
        var { key } = this.state
        let ChamVao = item.GioChamCong.split('-')[0].length > 1 ? true : false //xét có chấm vào 
        let ChamRa = item.GioChamCong.split('-')[1].length > 1 ? true : false //xét có chấm vào 
        let giochamcong = item.GioChamCong.replace('-', ' - ')
        let giovaodung = item.GioVaoDung
        let gioradung = item.GioRaDung
        return (
            <TouchableHighlight underlayColor={colors.brownGreyTwo} onPress={onPress} activeOpacity={1} style={[{
                backgroundColor: colors.white, borderRadius: 10, marginHorizontal: 10, paddingHorizontal: 10, paddingVertical: 15, marginTop: 7,
            }, styleItem]}>
                <View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={[styles.text_title, { color: colors.checkGreen }, styleTitle]}>{item.Ngay ? moment(item.Ngay).format('ddd, DD/MM/YYYY') : '...'}</Text>
                            <Text style={[styles.time, { color: colors.checkAwait }]}> ({ChamVao ? '' : '#'}{giochamcong}{ChamRa ? '' : '#'})</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                            {giovaodung ?
                                <Text style={[styles.text_title, { color: '#828282', alignSelf: 'center' }, styleTitle]}>{giovaodung}</Text> :
                                ChamVao ? <Image source={Images.ImageJee.icClockJee} style={{ width: Width(5), height: Width(5), alignSelf: 'center' }} /> :
                                    <Text style={[styles.text_title, { color: '#828282', alignSelf: 'center' }, styleTitle]}>{'#'}</Text>
                            }
                            <Text style={{ fontSize: reText(14), color: colors.colorNoteJee, alignSelf: 'center' }}>{' - '}</Text>
                            {gioradung ?
                                <Text style={[styles.text_title, { color: '#828282', alignSelf: 'center' }, styleTitle]}>{gioradung}</Text> :
                                ChamRa ? <Image source={Images.ImageJee.icClockJee} style={{ width: Width(5), height: Width(5), alignSelf: 'center' }} /> :
                                    <Text style={[styles.text_title, { color: '#828282', alignSelf: 'center' }, styleTitle]}>{'#'}</Text>
                            }
                        </View>
                    </View>
                    <View style={{ height: 0.5, backgroundColor: colors.colorLineJee, marginVertical: 12 }} />
                    {item.LyDo ?
                        <Text style={{ color: colors.black, fontSize: reText(14) }} numberOfLines={2}>{item.LyDo}</Text> :
                        <Text style={{ color: '#BDBDBD', fontSize: reText(14) }} numberOfLines={2}>{'--'}</Text>}
                    {/* BDBDBD */}
                </View>
            </TouchableHighlight >
        )
    }
}

const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(ItemGiaiTrinhGui, mapStateToProps, true)
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
        fontSize: reText(14),
        color: colors.white,
        fontWeight: 'bold'
    },
    title_mini: {
        marginTop: 14,
        justifyContent: 'space-between',
        ...nstyles.nrow
    },
    time: {
        fontSize: reText(14),
        color: colors.white,
        fontWeight: 'bold'
    },
    content: {
        marginTop: 10,
        color: colors.white
    }
})
