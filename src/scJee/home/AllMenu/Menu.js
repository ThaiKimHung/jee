import React, { Component } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Utils from '../../../app/Utils';
import { colors, fonts } from '../../../styles';
import { sizes } from '../../../styles/size';
import { Width } from '../../../styles/styles';

class Menu extends Component {
    constructor(props) {
        super(props);
        this.nthis = this.props.nthis;
    };
    _goscreen = (item) => {
        if (item.screen) {
            Utils.goscreen(this.nthis, item.goscreen, { screen: item.screen, params: item.params })
            if (item.RowID == 1) {
                Utils.setGlobal('_dateDkLocCongViec', '')
                Utils.setGlobal('typeChoiceLocCongViec', 'CreatedDate')
                Utils.setGlobal('_dateKtLocCongViec', '')
                Utils.setGlobal('searchStringCongViec', '')
                Utils.setGlobal('hoanthanhcv', true)
                Utils.setGlobal('hancv', false)
            }
        }
        else if (item.params.isMode == 3) {
            Utils.showMsgBoxYesNo(this.nthis, RootLang.lang.thongbaochung.thongbao, RootLang.lang.thongbaochung.bancomuonchuyensangchedomaychamcongkhong, RootLang.lang.thongbaochung.xacnhan, RootLang.lang.thongbaochung.xemlai, () => {
                Utils.goscreen(this.nthis, item.goscreen, item.params)
            })
        }
        else {
            Utils.goscreen(this.nthis, item.goscreen, item.params)
        }
    }
    _renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity
                onPress={() => this._goscreen(item)}
                style={{
                    width: '33.33%',
                    // backgroundColor: 'blue',
                    paddingHorizontal: 10, marginTop: 20,

                }}>
                <Image
                    style={[{ alignSelf: 'center', width: Width(30), height: Width(9) }]}
                    source={item.linkicon}
                    resizeMode={'contain'} />
                <Text
                    numberOfLines={3}
                    style={{
                        fontFamily: fonts.Helvetica, color: colors.textblack,
                        fontSize: sizes.sText12, textAlign: 'center', marginTop: 10
                    }}>
                    {this.props.lang == "vi" ? item.Title : item.nameEN}
                </Text>
            </TouchableOpacity>
        )
    }

    render() {
        var { menu } = this.props


        return (
            <View style={styles.container}>
                <FlatList
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    scrollEnabled={false}
                    style={styles.child}
                    numColumns={3}
                    data={menu}
                    renderItem={this._renderItem}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View >
        );
    }
}

export const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    tieude: {
        fontSize: sizes.sText16,
        paddingHorizontal: 10,
        // paddingVertical: 13
    },
    container: {
        flex: 1,
        height: '100%',


    },
    child: {
        backgroundColor: 'white',
        width: Width(100) - 20,

    },
    text: {
        fontSize: width * 0.5,
        textAlign: 'center'
    }
});


const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(Menu, mapStateToProps, true)