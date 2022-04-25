import React, { Component, createRef } from 'react';
import {
    Animated, BackHandler, StyleSheet,
    View
} from "react-native";
import { RootLang } from '../../../app/data/locales';
import { nkey } from '../../../app/keys/keyStore';
import Utils from '../../../app/Utils';
import HeaderComStackV2 from '../../../components/HeaderComStackV2';
import { Images } from '../../../images';
import { colors } from '../../../styles';
import { sizes } from '../../../styles/size';
import { nstyles, Width } from '../../../styles/styles';
import Modal_BinhLuan from '../ModalSocial/Modal_BinhLuan';
var RNFS = require('react-native-fs');

const actionSheetRef = createRef();
const actionSheetRef_ChonLoc = createRef();


class BinhLuan extends Component {
    constructor(props) {
        super(props);
        this.id_Baidang = Utils.ngetParam(this, 'idbaidang', '')
        this.idnoti = Utils.ngetParam(this, 'idnoti', '')
        this.state = {
            opacity: new Animated.Value(0),
        }
    }

    componentDidMount = async () => {
        BackHandler.addEventListener("hardwareBackPress", this._goback);
        nthisLoading.show()
        await this.setState({
            id_User: await Utils.ngetStorage(nkey.UserId, ''),
            avatar: await Utils.ngetStorage(nkey.avatar, ''),
        })
    }

    componentWillUnmount() {
        try {
            BackHandler.removeEventListener('hardwareBackPress', this._goback)
        }
        catch (error) {

        }
    }

    _goback = async () => {
        this._endAnimation(0)
        Utils.goback(this, null)
        return true
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

    render() {
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: '#E4E6EB', }]}>
                <HeaderComStackV2
                    nthis={this} title={RootLang.lang.JeeSocial.traloi}
                    // iconRight={Images.ImageJee.icBoLocSocial}
                    // styIconRight={[nstyles.nIconH18W22, {}]}
                    iconLeft={Images.ImageJee.icBack}
                    onPressLeft={this._goback}
                    // onPressRight={() => { Utils.goscreen(this, 'Modal_LocBaiDang') }}
                    styBorder={{
                        borderBottomColor: colors.black_20,
                        borderBottomWidth: 0.5
                    }}
                />
                <View style={{ flex: 1 }}>
                    <Modal_BinhLuan topicId={this.id_Baidang} nthis={this} social={true} idnoti={this.idnoti} ></Modal_BinhLuan>
                </View>

            </View >
        )
    }
}


const stStyle = StyleSheet.create({
    textTitle: {
        fontSize: sizes.sText12, lineHeight: sizes.sText17, paddingRight: 10,
        color: colors.colorTextBack80
    },
    stDatepick: {
        fontSize: sizes.sText12, lineHeight: sizes.sText17,
        color: colors.white,
    },
    stDate: {
        fontSize: 14, color: '#141414'
    },
    valueDate: {
        flexDirection: 'row',
        alignItems: 'center', justifyContent: 'space-between',
        paddingTop: 7, paddingBottom: 5, paddingHorizontal: 5,
    }
})
const mapStateToProps = state => ({
    lang: state.changeLanguage.language,
});
const styles = StyleSheet.create({
    textInput: {
        margin: 2,
        paddingHorizontal: 20,
        width: '100%',
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
        paddingVertical: 15, backgroundColor: colors.white,
    },
    container: {
        height: 300,
        justifyContent: 'flex-end',
        paddingTop: 100
    },
    suggestionsRowContainer: {
        flexDirection: 'row',
    },
    userAvatarBox: {
        width: 35,
        paddingTop: 2
    },
    userIconBox: {
        height: 45,
        width: 45,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#54c19c'
    },
    usernameInitials: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 14
    },
    userDetailsBox: {
        flex: 1,
        justifyContent: 'center',
        paddingLeft: 10,
        paddingRight: 15
    },
    displayNameText: {
        fontSize: 13,
        fontWeight: '500'
    },
    usernameText: {
        fontSize: 12,
        color: 'rgba(0,0,0,0.6)'
    },
    reactView: {
        width: (Width(100) - 80) / 7,
        height: 58,
        justifyContent: 'center',
        alignItems: 'center'
    },
    card: {
        borderRadius: 30
    },
    list: {
        overflow: 'visible'
    },
});

export default Utils.connectRedux(BinhLuan, mapStateToProps, true)