import React, { Component, Fragment } from 'react';
import { TextInput } from 'react-native';
import { Animated, ScrollView, TouchableOpacity, View, StyleSheet } from 'react-native';
import { RootLang } from '../app/data/locales';
import Utils from '../app/Utils';
import ListEmpty from '../components/ListEmpty';
import { colors, nstyles } from '../styles';
import { reText } from '../styles/size';
import { Width, Height } from '../styles/styles';
import HeaderModal from './HeaderModal';

class ComponentSelectCom_Cus extends Component {
    constructor(props) {
        super(props);
        this.callback = Utils.ngetParam(this, 'callback');
        this.item = Utils.ngetParam(this, 'item');
        this.AllThaoTac = Utils.ngetParam(this, 'AllThaoTac');
        this.ViewItem = Utils.ngetParam(this, 'ViewItem', () => { });
        this.Height = Utils.ngetParam(this, 'height');
        this.Search = Utils.ngetParam(this, 'search')
        this.Key = Utils.ngetParam(this, 'key', 'Name');
        this.minHeight = Utils.ngetParam(this, 'minHeight')
        this.vitri = Utils.ngetParam(this, 'vitri')
        this.state = {
            textempty: RootLang.lang.thongbaochung.khongcodulieu,
            opacity: new Animated.Value(0),
            listSearch: [],
            keySearch: '',
            data: [],

        }

    };
    _select = (item) => () => {
        this._endAnimation(0)
        this.callback(item);
        this._goback();
    }

    _goback = () => {
        this._endAnimation(0)
        Utils.goback(this);
    }
    componentDidMount = () => {
        this._startAnimation(0.8)
        this.setState({ data: this.AllThaoTac })
    }
    _renderItem = (item, index) => {
        return (
            <Fragment
                key={index.toString()}
            >
                <TouchableOpacity onPress={this._select(item)} style={{ padding: 10, paddingVertical: 10 }}>
                    {
                        this.ViewItem(item)
                    }
                </TouchableOpacity>
                <View style={{ height: 1, backgroundColor: colors.veryLightPinkTwo, marginHorizontal: 20 }} />
            </Fragment>
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
    onChangeText = (val) => {
        this.setState({ keySearch: val })
        let datanew = this.AllThaoTac.filter(item => Utils.removeAccents(item[this.Key]).toUpperCase().includes(Utils.removeAccents(val.toUpperCase())))
        this.setState({
            data: datanew
        })
    }

    render() {
        const { opacity } = this.state;
        var { keySearch, data } = this.state;
        return (
            <View style={[nstyles.nstyles.ncontainer, { backgroundColor: `transparent`, width: '100%' }]}>
                <Animated.View onTouchEnd={this._goback} style={{
                    position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
                    backgroundColor: colors.backgroundModal,
                    opacity
                }} />
                <View style={{
                    height: 'auto', maxHeight: '85%', backgroundColor: colors.white, zIndex: 1,
                    position: 'absolute', top: '18.2%', right: '26%', width: '42.5%'
                }}>
                    {/* <HeaderModal /> */}
                    <View style={{ flexDirection: 'row', }}>
                        <View style={{ flex: 1 }}>
                            {
                                this.Search == true ?
                                    <View>
                                        <TextInput
                                            style={styles.textInput}
                                            placeholder={"Tìm kiếm "}
                                            placeholderTextColor={colors.colorPlayhoder}
                                            onChangeText={this.onChangeText}
                                            ref={ref => keySearch = ref}
                                        >
                                            {keySearch}
                                        </TextInput>
                                        <View style={{ height: 1.5, backgroundColor: colors.black_50, marginHorizontal: 50 }} />

                                    </View> : null
                            }
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingBottom: nstyles.paddingBotX + 15 }}>
                                {
                                    <View>

                                        {
                                            data.length > 0 ? data.map(this._renderItem) : <ListEmpty textempty={RootLang.lang.thongbaochung.khongcodulieu} />
                                        }
                                    </View>
                                }
                            </ScrollView>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}
const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
const styles = StyleSheet.create({
    textInput: {
        margin: 2,
        paddingHorizontal: 20,
        width: '100%',
        paddingVertical: 15, backgroundColor: colors.white,
        textAlign: 'center', color: colors.black_70
    }
});
export default Utils.connectRedux(ComponentSelectCom_Cus, mapStateToProps, true)