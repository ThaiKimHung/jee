import React, { Component } from 'react';
import {
    Text, TouchableOpacity, View, StyleSheet, Image, TextInput, Platform, FlatList
} from 'react-native';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { nstyles, Width, } from '../../../../styles/styles';
import { colors } from '../../../../styles';

export default class Loading extends Component {
    render() {
        const { soLuongRender } = this.props
        return (
            <View style={[{},]}>
                {
                    soLuongRender.map((index) => {
                        return (
                            <View style={{ backgroundColor: colors.white, height: Width(25), marginBottom: 10, borderBottomWidth: index == soLuongRender.length - 1 ? 0 : 0.3, borderColor: colors.gray1, marginHorizontal: 10 }}>
                                <SkeletonPlaceholder>
                                    <View style={{ marginTop: 10, flexDirection: 'row' }}>
                                        <View style={{ width: Width(5), height: Width(5), borderRadius: 20, marginRight: 5 }} />
                                        <View>
                                            <View style={{ width: Width(68), height: Width(4), borderRadius: 20, }}></View>
                                            <View style={{ width: Width(20), height: Width(3), borderRadius: 20, marginVertical: 15 }}></View>
                                            <View style={{ width: Width(30), height: Width(3), borderRadius: 20, }}></View>
                                        </View>
                                        <View style={{ alignItems: 'center' }}>
                                            <View style={[nstyles.nAva50, {}]} />
                                            <View style={{ width: Width(20), height: Width(3), borderRadius: 20, marginTop: 5 }}></View>
                                        </View>
                                    </View>
                                </SkeletonPlaceholder>
                            </View>
                        )
                    })
                }


            </View>
        )
    }
}
