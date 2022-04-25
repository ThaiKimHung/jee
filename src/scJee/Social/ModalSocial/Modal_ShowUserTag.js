import React, { Component } from 'react';
import { Animated, BackHandler, FlatList, StyleSheet, Text, View } from "react-native";
import Utils from '../../../app/Utils';
import HeaderModal from '../../../Component_old/HeaderModal';
import { Images } from '../../../images';
import { colors } from '../../../styles';
import { nstyles } from '../../../styles/styles';
import ImageCus from '../../../components/NewComponents/ImageCus';
import { reText } from '../../../styles/size';

class Modal_ShowUserTag extends Component {
    constructor(props) {
        super(props);
        this.state = {
            opacity: new Animated.Value(0),
            data: []
        }
    };

    _goback = () => {
        this._endAnimation(0)
        Utils.goback(this);
        return true
    }

    componentDidMount = () => {
        this._startAnimation(0.8)
        BackHandler.addEventListener("hardwareBackPress", this._goback);
        this.setState({
            data: Utils.ngetParam(this, 'data', [])
        })
    }

    componentWillUnmount() {
        try {
            BackHandler.removeEventListener('hardwareBackPress', this._goback)
        }
        catch (error) {
        }
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

    hashCode = (str) => {
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return hash;
    }

    intToRGB = (i) => {
        var c = (i & 0x00FFFFFF)
            .toString(16)
            .toUpperCase();
        return "#" + "00000".substring(0, 6 - c.length) + c;
    }

    _renderItem = ({ item, index }) => {
        return (
            <View style={{ flexDirection: 'row', paddingHorizontal: 10, paddingTop: 10 }}>
                {
                    item?.Avatar ?
                        <ImageCus
                            style={nstyles.nAva35}
                            source={{ uri: item?.Avatar }}
                            resizeMode={"cover"}
                            defaultSourceCus={Images.icAva}
                        /> :
                        <View style={[nstyles.nAva35, {
                            backgroundColor: this.intToRGB(this.hashCode(item.Fullname)),
                            flexDirection: "row", justifyContent: 'center', alignItems: 'center'
                        }]}>
                            <Text style={styles.textName}>{String(item.Fullname).split(" ").slice(-1).toString().slice(0, 2).toString()}</Text>
                        </View>
                }
                <View style={{ justifyContent: 'center', paddingLeft: 10 }}>
                    <Text>{item?.Fullname}</Text>
                </View>
            </View>
        );
    }


    render() {
        const { opacity } = this.state;
        const { data } = this.props
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: `transparent`, justifyContent: 'flex-end' }]}>
                <Animated.View onTouchEnd={this._goback} style={{
                    position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
                    backgroundColor: colors.backgroundModal, alignItems: 'flex-end',
                    opacity
                }} />
                <View style={{ minHeight: '10%', maxHeight: '85%', backgroundColor: colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, zIndex: 1, paddingBottom: 15 }}>
                    <HeaderModal />
                    <View style={{ paddingHorizontal: 10 }}>
                        <FlatList
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            data={this.state.data}
                            renderItem={this._renderItem}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                </View>
            </View >
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
    },
    textName: {
        alignSelf: "center", fontWeight: "bold", fontSize: reText(16), color: colors.white
    },
});
export default Utils.connectRedux(Modal_ShowUserTag, mapStateToProps, true)
