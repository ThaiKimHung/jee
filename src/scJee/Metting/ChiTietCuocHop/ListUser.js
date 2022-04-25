import LottieView from 'lottie-react-native'
import React, { Component } from 'react'
import { Animated, Platform, ScrollView, Text, TouchableOpacity, View, FlatList, StyleSheet, Image } from 'react-native'
import * as Animatable from 'react-native-animatable'
import Dash from 'react-native-dash'
import { colors } from '../../../../src/styles/color'
import { reText } from '../../../../src/styles/size'
import { Height, nstyles, Width } from '../../../../src/styles/styles'
import { RootLang } from '../../../app/data/locales'
import InAppUpdate from '../../../app/InAppUpdate'
import Utils from '../../../../src/app/Utils'
import { Images } from '../../../images';
import HeaderModal from '../../../Component_old/HeaderModal';

export class ListUser extends Component {
    constructor(props) {
        super(props)
        this.state = {
            opacity: new Animated.Value(0),
            data: Utils.ngetParam(this, 'data'),
            open: true
        }
    }

    componentDidMount() {
        this._startAnimation(0.4)
    }

    _startAnimation = (value) => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: value,
                duration: 300
            }).start();
        }, 350);
    };

    _goback = () => {
        Utils.goback(this, null)
        return true;
    }

    _renderItem = ({ item, index }) => {
        return (
            <View key={index} style={styles.item} >
                <View style={styles.containerAva}>
                    {item.Image != "" && item.Image ?
                        <Image source={{ uri: item.Image ? item.Image : '' }} style={{ width: Width(10), height: Width(10), borderRadius: 99999 }} />
                        :
                        <Image source={Images.icAva} style={{ width: Width(10), height: Width(10), borderRadius: 99999 }} />}
                </View>
                <View style={styles.containerName}>
                    <Text style={styles.text}>{item.HoTen ? item.HoTen : ''}</Text>
                    <Text style={styles.Chucvu}>{item.ChucVu ? item.ChucVu : ''}</Text>
                </View>
            </View>
        )
    }

    render() {
        let { opacity, data } = this.state
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: `transparent`, justifyContent: 'flex-end' }]}>
                <Animated.View onTouchEnd={this._goback} style={{
                    position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
                    backgroundColor: colors.backgroundModal, alignItems: 'flex-end',
                    opacity
                }} />
                <View style={{ backgroundColor: colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, zIndex: 1, paddingBottom: 30, maxHeight: Height(60), minHeight: Height(10) }}>
                    <HeaderModal />

                    <FlatList
                        style={{ marginTop: 5 }}
                        data={data}
                        renderItem={this._renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        extraData={this.state}
                        // refreshing={refreshing}
                        // onRefresh={this._onRefresh}
                        initialNumToRender={5}
                        maxToRenderPerBatch={10}
                        windowSize={7}
                        updateCellsBatchingPeriod={100}
                    />
                </View>
            </View >
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: colors.white
    },
    search: {
        flexDirection: 'row', backgroundColor: colors.black_5, marginHorizontal: 15, marginTop: 10, paddingHorizontal: 10, borderRadius: 10,
        alignItems: 'center',
    },
    textInput: {
        flex: 1, paddingVertical: Platform.OS == 'ios' ? 10 : 5, paddingHorizontal: 5, fontSize: reText(16)
    },
    xoa: { width: Width(5), backgroundColor: colors.black_20_2, height: Width(5), borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
    item: {
        width: Width(100), marginTop: 5, flexDirection: 'row', paddingHorizontal: Width(5), height: Width(12)
    },
    containerAva: {
        width: Width(12)
    },
    containerName: {
        width: Width(70), justifyContent: 'center', paddingHorizontal: 10, borderBottomWidth: 0.5, borderColor: colors.lightBlack
    },
    touch: {
        width: Width(8), justifyContent: 'center', alignItems: 'center'
    },
    text: {
        fontSize: reText(15), fontWeight: 'bold'
    },
    Chucvu: {
        fontSize: reText(12), color: colors.black_50
    }
})

export default ListUser


