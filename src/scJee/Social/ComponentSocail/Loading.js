import React, { Component, createRef } from 'react';
import { View } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { Width, nHeight } from '../../../styles/styles';
import { colors } from '../../../styles';

export default class Loading extends Component {
    render() {
        const { soLuongRender, stylesLoading } = this.props
        return (
            <View style={[{}, stylesLoading]}>
                {
                    soLuongRender.map(() => {
                        return (
                            <View style={{ backgroundColor: colors.white, height: Width(50), marginBottom: 10 }}>
                                <SkeletonPlaceholder>
                                    <View style={{ marginTop: 20, paddingHorizontal: 10 }}>
                                        <View style={{ flexDirection: 'row', marginBottom: 15 }}>
                                            <View style={{ width: Width(10), height: Width(10), borderRadius: 20, marginRight: 5 }} />
                                            <View >
                                                <View style={{ width: Width(50), height: Width(3), borderRadius: 10, marginBottom: 5 }} />
                                                <View style={{ width: Width(20), height: Width(3), borderRadius: 10 }} />
                                            </View>

                                        </View>
                                        <View style={{ width: '80%', height: Width(3), borderRadius: 10, marginBottom: 15 }} />
                                        <View style={{ width: '90%', height: Width(3), borderRadius: 10, marginBottom: 15 }} />
                                        <View style={{ width: '70%', height: Width(3), borderRadius: 10, marginBottom: 10 }} />
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
