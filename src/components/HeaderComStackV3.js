import React, { Component } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { RootLang } from '../app/data/locales';
import Utils from '../app/Utils';
import { Images } from '../images';
import { colors } from '../styles';
import { nstyles, paddingTopMul } from '../styles/styles';
// this.mang = [
//     { position: true, type: true, url: '', title: '', style: {}, onPress: () => { } }, 
//     position: true-trái, false-phải
//     type: true-icon, false-text || url: link icon || title: title text
//     onPress
// ]
class HeaderComStackV3 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            vitriNutSearch: 0,
            tatSearch: false
        }
    }
    componentDidMount = () => {
        let temp = 0;
        this.props.mang.forEach((item, index) => {
            if (item.icSearch)
                temp = index
        })
        this.setState({ vitriNutSearch: temp })
    }
    _tatSearch = () => {
        this.setState({ tatSearch: !this.state.tatSearch })
    }
    _onPress = (item) => {
        if (item.icSearch)
            this.setState({ tatSearch: !this.state.tatSearch }, () => { !this.state.tatSearch ? item.onPress('') : null })
        else
            item.onPress()
    }
    _renderButton = (type, item, typePositon) => { //typePositon: 1-trái, 2-phải
        // const margin = typePositon == 1 ? { marginRight: 5 } : { marginLeft: 5 }
        return (
            <TouchableOpacity onPress={() => this._onPress(item)} style={{ padding: 7 }}>
                {type && item.icSearch && this.state.tatSearch ?
                    <Image source={Images.ImageJee.icXoaLuaChon} style={[styles.button, item.style]}></Image> :
                    type ?
                        <Image source={item.url} style={[styles.button, item.style]}></Image>
                        :
                        <Text style={item.style}>{item.title}</Text>
                }
            </TouchableOpacity>
        )
    }
    _renderItem = (list, typePositon) => {
        return (
            <View style={{ zIndex: 1, elevation: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                {list.map((item, index) => {
                    if (item.position && typePositon == 1)
                        return this._renderButton(item.type, item, typePositon)
                    if (!item.position && typePositon == 2)
                        return this._renderButton(item.type, item, typePositon)
                })}
            </View>
        )
    }

    render() {
        let { vitriNutSearch, tatSearch } = this.state
        var { title = '', styleTitle = {}, mang = [] } = this.props;
        return (
            <View style={{
                height: isIphoneX() ? 80 : 50, backgroundColor: 'white', width: '100%',
                borderColor: colors.textGray, borderBottomWidth: 0.5, paddingTop: paddingTopMul
            }}>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 5 }}>
                    {this._renderItem(mang, 1)}
                    {tatSearch ?
                        <View style={{ flex: 1, backgroundColor: colors.textInputComment, justifyContent: 'center', borderRadius: 40, marginVertical: 3, paddingHorizontal: 10 }}>
                            <TextInput
                                placeholder={RootLang.lang.JeeRequest.dungchung.noidungtimkiem + '...'}
                                onChangeText={(value) => { mang[vitriNutSearch].onPress(value) }}
                                style={{ fontSize: 14, height: 45, paddingVertical: 0 }}></TextInput>
                        </View>
                        :
                        <View style={{
                            position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
                            alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                        }}>
                            <Text style={[styleTitle, { fontSize: 16, fontWeight: 'bold', textAlign: 'center' }]}>
                                {title}
                            </Text>
                        </View>
                    }
                    {this._renderItem(mang, 2)}
                </View>
            </View >
        );
    }
}
const styles = StyleSheet.create({
    button: {
        ...nstyles.nIcon24, tintColor: 'black'
    }
})
const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(HeaderComStackV3, mapStateToProps, true)



