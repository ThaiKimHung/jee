import React, { PureComponent } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Utils from '../../../app/Utils';
import { sizes } from '../../../styles/size';
import { Width } from '../../../styles/styles';
import Menu from './Menu';

class ComponentAllMenu extends PureComponent {

    constructor(props) {
        super(props);
        this.nthis = this.props.nthis;
    };
    render() {
        return (
            <View style={{ marginHorizontal: 10, }}>
                <View style={{ backgroundColor: "white", marginTop: 10, borderRadius: 10, paddingBottom: 20, }}>
                    <View style={{ flexDirection: "row", paddingHorizontal: 20, paddingTop: 20 }}>
                        <View style={{ width: 5, height: 20, backgroundColor: this.props.color, borderRadius: 10, marginRight: 5 }} />
                        <Text style={{ fontWeight: '600', fontSize: 18 }}>{this.props.text}</Text>
                    </View>
                    <Menu nthis={this.nthis} menu={this.props.menu} />
                </View>
            </View>
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
        width: Width(100) - 30,

    },
    text: {
        fontSize: width * 0.5,
        textAlign: 'center'
    }
});


const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(ComponentAllMenu, mapStateToProps, true)