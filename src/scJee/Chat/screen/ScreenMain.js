import React, { Component } from 'react'
import { Text, StyleSheet, View, TouchableOpacity, Image, Keyboard } from 'react-native'
import Utils from '../../../app/Utils';
import HeaderComStackV2 from '../../../components/HeaderComStackV2';
import { Images } from '../../../images';
import { colors } from '../../../styles';
import { reText } from '../../../styles/size';
import { paddingBotX, Width } from '../../../styles/styles';
import { DanhBa } from './DanhBa';
import { ListMessage } from './ListMessage';
import { store } from '../../../srcRedux/store';
import { Get_ThongBaoChat } from '../../../srcRedux/actions';
import { RootLang } from '../../../app/data/locales';

export class ScreenMain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isTab: 0, //0- messege 1- danh bạ
            numberNoti: 0
        }
    }
    _goback = () => {
        // this.callback_home()
        Keyboard.dismiss()
        this.setState({ isTab: 0 })
        // Utils.goscreen(this, 'sw_HomePage')
        Utils.goback(this, null)
        return true;
    }

    componentDidMount() {
        this._countNoti()
    }
    _countNoti = async () => {
        // this.props.GetThongBaoChat();
        store.dispatch(Get_ThongBaoChat())
    }

    render() {
        const { isTab } = this.state;
        return (
            <View style={stScreenMain.container}>
                <HeaderComStackV2
                    nthis={this}
                    title={isTab == 0 ? RootLang.lang.JeeChat.chat : RootLang.lang.JeeChat.chatvoi}
                    iconLeft={Images.ImageJee.icBack}
                    onPressLeft={this._goback}
                    iconRight={isTab == 0 ? Images.ImageJee.icEditMessage : null}
                    styIconRight={{ width: Width(5), height: Width(5) }}
                    onPressRight={() => { Utils.goscreen(this, 'ModalCreateGroup') }}
                />
                <View style={stScreenMain.Screen}>
                    {isTab == 0 ? <ListMessage nthis={this} /> : <DanhBa nthis={this} />}
                    {/* Chứa màn hình */}
                </View>
                <View style={stScreenMain.TabBottom}>
                    {/* Chứa màn hình */}
                    <TouchableOpacity onPress={() => this.setState({ isTab: 0 })} style={stScreenMain.Touch}>
                        <View style={stScreenMain.ViewItem}>
                            <Image source={Images.ImageJee.icMessage} style={[stScreenMain.icon, { tintColor: isTab == 0 ? colors.colorTabActiveJeeHR : colors.textGray }]} />
                            <Text style={[stScreenMain.Title, { color: isTab == 0 ? colors.colorTabActiveJeeHR : colors.textGray }]}>{RootLang.lang.JeeChat.chat}</Text>
                        </View>
                        {this.props.ListThongBaoChat > 0 ?
                            <View style={{
                                width: 20, height: 20, backgroundColor: colors.redStar, position: 'absolute', top: 0, right: Width(20), borderRadius: 20,
                                borderWidth: 2, borderColor: colors.lightBlack, justifyContent: 'center', alignItems: 'center'
                            }}>
                                <Text style={{ fontSize: reText(10), color: colors.white, fontWeight: 'bold', alignSelf: 'center' }}>{this.props.ListThongBaoChat}</Text>
                            </View> : null}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.setState({ isTab: 1 })} style={stScreenMain.Touch}>
                        <View style={stScreenMain.ViewItem}>
                            <Image source={Images.ImageJee.icDanhBa} style={[stScreenMain.icon, { tintColor: isTab == 1 ? colors.colorTabActiveJeeHR : colors.textGray }]} />
                            <Text style={[stScreenMain.Title, { color: isTab == 1 ? colors.colorTabActiveJeeHR : colors.textGray }]}>{RootLang.lang.JeeChat.moinguoi}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const stScreenMain = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: colors.white
    },
    Screen: {
        flex: 1
    },
    TabBottom: {
        height: 50 + paddingBotX, width: Width(100), backgroundColor: colors.backgroudJeeHR, flexDirection: 'row', paddingBottom: paddingBotX
    },
    Touch: {
        width: Width(50), height: '100%', alignItems: 'center', justifyContent: 'center'
    },
    ViewItem: {
        justifyContent: 'center', alignItems: 'center',
    },
    Title: {
        fontSize: reText(11)
    },
    icon: {
        width: Width(6), height: Width(6)
    }
})


const mapStateToProps = state => ({
    lang: state.changeLanguage.language,
    ListThongBaoChat: state.ThongBaoChat.numChat
});

export default Utils.connectRedux(ScreenMain, mapStateToProps, true)

