import React, { Component, Fragment } from 'react';
import { Animated, BackHandler, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { RootLang } from '../app/data/locales';
import Utils from '../app/Utils';
import ListEmpty from '../components/ListEmpty';
import { colors, nstyles, sizes } from '../styles';
import { Height } from '../styles/styles';
import HeaderModal from './HeaderModal';

export default class ComponentSelect extends Component {
    constructor(props) {
        super(props);
        this.callback = Utils.ngetParam(this, 'callback');
        this.item = Utils.ngetParam(this, 'item');
        this.AllThaoTac = Utils.ngetParam(this, 'AllThaoTac');
        this.state = {
            textempty: RootLang.lang.thongbaochung.khongcodulieu,
            opacity: new Animated.Value(0)
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
    _renderItem = (item) => {
        // Utils.nlog("gia tri item", item, this.item)
        return <Fragment key={item.ID_type}>
            <TouchableOpacity onPress={this._select(item)} style={{ padding: 22, paddingVertical: 20, flexDirection: 'row', justifyContent: "space-between" }}>
                <Text style={{ fontSize: sizes.sizes.sText16, color: this.item.ID_type === item.ID_type ? colors.textblack : colors.colorTextBTGray, fontWeight: this.item.ID_type === item.ID_type ? 'bold' : 'normal' }}>{`${item.title}`}</Text>
                <Text style={{ color: colors.checkGreen }}>{`${item.SoNgay ? `${item.SoNgay} ${RootLang.lang.common.ngay}` : ` 0 ${RootLang.lang.common.ngay}`}`}</Text>
            </TouchableOpacity>
            <View style={{ height: 1, backgroundColor: colors.colorlineJeeHr, marginHorizontal: 20 }} />
        </Fragment>
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
        this.handlerBack = BackHandler.addEventListener('hardwareBackPress', this._handlerBackButton)
        this._startAnimation(0.8)
    }
    componentWillUnmount() {
        this.handlerBack.remove()
    }
    _handlerBackButton = () => {
        this._goback()
        return true
    }

    render() {
        const { opacity } = this.state
        return (
            <View style={[nstyles.nstyles.ncontainer, { backgroundColor: `transparent`, justifyContent: 'flex-end' }]}>
                <Animated.View onTouchEnd={this._goback} style={{
                    position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
                    backgroundColor: colors.backgroundModal, alignItems: 'flex-end',
                    opacity
                }} />
                <View style={{
                    backgroundColor: colors.white, borderTopLeftRadius: 20,
                    borderTopRightRadius: 20, zIndex: 1, opacity: 1, marginTop: Height(15)
                }}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 1 }}>
                            <HeaderModal />
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingBottom: nstyles.paddingBotX }}>
                                {
                                    this.AllThaoTac.length > 0 ? this.AllThaoTac.map(this._renderItem) : <ListEmpty textempty={RootLang.lang.thongbaochung.khongcodulieu} />
                                }
                            </ScrollView>
                        </View>
                        {/* <View style={{ width: Width(15) }}>
                            <GestureRecognizer onSwipeDown={this._goback} style={{ borderTopRightRadius: 20 }} onPressIcon={this._goback} />
                        </View> */}
                    </View>
                </View>
            </View>
        );
    }
}
