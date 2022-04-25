import React, { Component } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { RootLang } from '../../../app/data/locales';
import Utils from '../../../app/Utils';
import { Images } from '../../../images/index';
import { colors } from '../../../styles/color';
import { fonts } from '../../../styles/font';
import { sizes } from '../../../styles/size';

class GhiChuChamCong extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    _renderItem = (item, index) => {
        Utils.nlog("gia tri item ghi chu--------", item)
        const { onPressEdit } = this.props
        return (
            <View key={index.toString()} style={{ backgroundColor: colors.white, marginBottom: 50 }} >
                <View style={{ flexDirection: 'row', paddingVertical: 20, paddingHorizontal: 10 }}>
                    <View style={{ flex: 6, }}>
                        <Text
                            style={{
                                fontSize: sizes.sText14, lineHeight: sizes.sText19, fontFamily: fonts.Helvetica,
                                color: colors.colorTextBack80
                            }}>{item.Noidung}</Text>
                    </View>
                    <View style={{ flex: 4, }}>
                        {
                            item.IsProcessed == true ? <Text
                                style={{
                                    fontSize: sizes.sText14, lineHeight: sizes.sText19, paddingLeft: 15,
                                    fontFamily: fonts.Helvetica, color: colors.colorTextBack80
                                }}>{RootLang.lang.scbangcong.daxuly}</Text> :
                                <TouchableOpacity onPress={() => onPressEdit(item)} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                    <Image source={Images.iconEdit}>

                                    </Image>
                                    <Text
                                        style={{
                                            fontSize: sizes.sText14, lineHeight: sizes.sText19, paddingLeft: 15,
                                            fontFamily: fonts.Helvetica, color: colors.colorTextBack80
                                        }}>{item.IsProcessed == false ? RootLang.lang.scbangcong.choxuly : RootLang.lang.scbangcong.daxuly}</Text>
                                </TouchableOpacity>
                        }



                    </View>

                </View>
                <View style={{ height: 1, marginHorizontal: 10, backgroundColor: colors.colorBtnGray }} />
            </View>
        );
    }
    render() {
        var { data_ghichu = [] } = this.props
        return (
            data_ghichu.map(this._renderItem)
        )
    }
}
const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(GhiChuChamCong, mapStateToProps, true)
