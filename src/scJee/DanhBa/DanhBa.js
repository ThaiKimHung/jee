import React, { Component } from "react";
import { Text, StyleSheet, View, } from "react-native";
import LottieView from 'lottie-react-native';
import { Height, Width } from "../../styles/styles";
import { reText } from "../../styles/size";
import { colors } from "../../styles";

export default class DanhBa extends Component {
    constructor() {
        super();
        this.state = {

        };
    }


    render() {
        return (
            <View style={{ flex: 1, marginTop: Height(20) }}>
                <View style={{ flex: 1 }}>
                    <LottieView style={{ bottom: 0, top: 0, height: Width(80), opacity: 1, alignSelf: "center" }} source={require('../../images/lottieJee/devoloping.json')} autoPlay loop />
                    <Text style={{ textAlign: "center", fontSize: reText(20), marginTop: 30, color: colors.textTabActive, paddingLeft: 20 }}>{"Tính năng đang phát triển."}</Text>

                </View>

            </View >
        );
    }
}