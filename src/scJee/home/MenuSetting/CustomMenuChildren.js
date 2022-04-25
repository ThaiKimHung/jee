import React, { Component } from 'react'
import { Dimensions, Text, View, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import { Height, Width } from '../../../styles/styles'
import { sizes } from '../../../styles/size';
import Utils from '../../../app/Utils';
import { Images } from '../../../images';
import { fonts, colors } from '../../../styles'
import PropTypes from 'prop-types'
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window')

const styles = StyleSheet.create({
    tieude: {
        fontSize: sizes.sText16,
        paddingHorizontal: 10,
        // paddingVertical: 13
    },
    viewTitle: {
        width: 5,
        height: 20,
        borderRadius: 10
    },
    container: {
        marginBottom: 8,
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: colors.white
    },
    child: {
        backgroundColor: 'white',
        width: Width(100) - 30,

    },
    text: {
        fontSize: width * 0.5,
        textAlign: 'center'
    }
})

class CustomMenuChildren extends Component {
    _renderItem = ({ item, index }) => {
        const { onPress = () => { }, udd = '' } = this.props
        return (
            <TouchableOpacity
                onPress={onPress.bind(this, item, udd)}
                style={{
                    width: '33.33%',
                    // backgroundColor: 'blue',
                    paddingHorizontal: 10, marginTop: 20,
                }}>
                {item.check == true ?
                    <LottieView style={{ height: Width(7) }} source={require('../../../images/lottieJee/check.json')} autoPlay loop={false} />
                    :
                    <Image style={{ width: Width(4), height: Width(4), resizeMode: 'contain' }} source={Images.ImageJee.icCheckPlusTwo} />}
                <Image
                    style={[{ alignSelf: 'center', width: Width(30), height: Width(8) }]}
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
        const { colorTitle, txtTitle, data = [] } = this.props
        return (
            <View style={styles.container}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ ...styles.viewTitle, backgroundColor: colorTitle }} />
                    <View style={{ paddingHorizontal: 5 }} />
                    <Text style={{ fontSize: sizes.sText19, fontWeight: '600' }}>{txtTitle}</Text>
                </View>
                <FlatList
                    data={data}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    scrollEnabled={false}
                    style={styles.child}
                    numColumns={3}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={this._renderItem}
                />

            </View>
        )
    }
}

CustomMenuChildren.propTypes = {
    data: PropTypes.array,
    txtTitle: PropTypes.string,
    colorTitle: PropTypes.string,
}

CustomMenuChildren.defaultProps = {
    data: [],
    txtTitle: 'Công việc tạm thời',
    colorTitle: 'red'
};

const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});

export default Utils.connectRedux(CustomMenuChildren, mapStateToProps, true)