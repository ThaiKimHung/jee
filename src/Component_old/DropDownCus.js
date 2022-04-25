import React, { Component } from 'react';
import { Animated, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { RootLang } from '../app/data/locales';
import Utils from '../app/Utils';
import ListEmpty from '../components/ListEmpty';
import { colors } from '../styles';
import { sizes } from '../styles/size';
import { Height, nstyles, paddingTopMul } from '../styles/styles';

class DropDownCus extends Component {
    constructor(props) {
        super(props);
        this.callback = Utils.ngetParam(this, 'callback');
        this.item = Utils.ngetParam(this, 'item');
        this.AllThaoTac = Utils.ngetParam(this, 'AllThaoTac');
        this.Key = Utils.ngetParam(this, 'Key'); // tên trường dữ liệu cần lấy,
        this.Value = Utils.ngetParam(this, 'Value'); // giá trị trường cần lấy
        this.state = {
            textempty: RootLang.lang.thongbaochung.khongcodulieu,
            opacity: new Animated.Value(0)
        }
    };

    _select = (item) => () => {
        this.callback(item);
        this._goback();
    }

    _goback = () => {
        this._endAnimation(0)

        Utils.goback(this);
    }

    _renderItem = (item, index) => {
        return (
            <View key={item[`${this.Key}`]} style={{ backgroundColor: this.item[`${this.Key}`] == item[`${this.Key}`] ? colors.greenTab_5 : colors.white }}>
                {/* <TouchableOpacity key={item[`${this.IdSap}`]} onPress={this._select(item)}> */}
                <TouchableOpacity onPress={this._select(item)}>
                    <View style={{ padding: 22, paddingVertical: 20, justifyContent: 'center', alignItems: 'center' }}>
                        <View>
                            <Text style={{
                                // fontFamily: this.item[`${this.Key}`] == item[`${this.Key}`] ? fonts.HelveticaBold : fonts.Helvetica,
                                fontSize: sizes.sText16, color: this.item[`${this.Key}`] == item[`${this.Key}`] ? colors.textblack : colors.colorTextBTGray, fontWeight: this.item[`${this.Key}`] == item[`${this.Key}`] ? 'bold' : 'normal'
                            }}>
                                {item[`${this.Value}`]}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <View style={{ height: 1, backgroundColor: colors.black_10, marginHorizontal: 20 }} />
            </View>

        )
    }

    _startAnimation = (value) => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: value,
                duration: 300
            }).start();
        }, 400);
    };

    _endAnimation = (value) => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: value,
                duration: 1
            }).start();
        }, 1);
    };

    componentDidMount() {

        this._startAnimation(0.8)
    }

    render() {
        const { opacity } = this.state;
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: `transparent`, justifyContent: 'flex-end' }]}>
                <Animated.View onTouchEnd={this._goback} style={{
                    position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
                    backgroundColor: colors.backgroundModal, alignItems: 'flex-end',
                    opacity
                }} />
                <View style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20, zIndex: 1, maxHeight: Height(50) }}>
                    <ScrollView style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }} contentContainerStyle={{ paddingBottom: paddingTopMul, backgroundColor: colors.white }}>
                        {
                            this.AllThaoTac.length > 0 ? this.AllThaoTac.map(this._renderItem) : <ListEmpty textempty={RootLang.lang.thongbaochung.khongcodulieu} />
                        }
                    </ScrollView>
                </View>
            </View >
        );
    }
}
const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(DropDownCus, mapStateToProps, true)