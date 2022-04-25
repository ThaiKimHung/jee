import React, { Component } from 'react';
import {
    Image,
    ImageBackground, StyleSheet, Text, TouchableOpacity, View
} from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper';
import {
    Menu,

    MenuOption, MenuOptions,

    MenuTrigger, renderers
} from 'react-native-popup-menu';
import { appConfig } from '../app/Config';
import { changeLangue, RootLang } from '../app/data/locales';
import { nGlobalKeys } from '../app/keys/globalKey';
import Utils from '../app/Utils';
import { Images } from '../images';
import { colors, sizes } from '../styles';
import { nstyles } from '../styles/styles';


class HeaderCom extends Component {
    constructor(props) {
        super(props);
        var { nthis } = this.props;
        this.state = {
            User: {}
        }
        this.nthis = nthis;
    }
    componentDidMount() {
        let User = Utils.getGlobal(nGlobalKeys.Get_HinhNhanVien, {});
        let version = appConfig.version;
        User.version = version ? version : "Đang cập nhật"
        Utils.nlog('nGlobalKeys.Get_HinhNhanVien', User);
        this.CheckAvatar(User);

    }
    _onPressLeftDefault = () => {
        try {
            Utils.toggleDrawer(this.nthis, false, 'toggleDrawer');
        } catch (error) {
            Utils.nlog('_onPressLeftDefault', error);
        }
    }


    logoutFromAvatar = async () => {
        Utils.showMsgBoxYesNo(this.nthis, "Thông báo", "Bạn có muốn đăng xuất", "Xác nhận", "Thoát", () => {
            // dang xuat
        }, () => { }, false)
    }

    changePassword = async () => {
        Utils.goscreen(this.nthis, 'Modal_ChangePassword');
    }

    switchlanguge = (val) => {
        changeLangue(val);
        this.props.ChangeLanguage(val);
        Utils.nlog('ngon ngu ', this.props.lang)
        //this.menuRef.hide();
    }

    hideMenu = () => this.menuRef.hide();
    showMenu = () => this.menuRef.show(this.textRef, stickTo = Position.BOTTOM_LEFT, { left: -15, top: 0 });
    onPress = () => this.showMenu();
    _Diemdanh = () => {
        // this.kiemTraQuyenViTri();

        Utils.goscreen(this.nthis, 'cm');
    }
    CheckAvatar = async (User) => {
        try {
            let res = await fetch(User.JeeAvatar)
            if (res.status == 200) {
                User.isUrl = true;
                this.setState({ User: User });
            } else {
                User.isUrl = false;
                this.setState({ User: User });
            }
        } catch (error) {
            User.isUrl = false;
            this.setState({ User: User });
        }

    }
    render() {
        const {
            onPressMenu = this._onPressLeftDefault,
        } = this.props;

        var { User } = this.state;
        this.textRef = React.createRef();

        return (

            <View style={[{ marginBottom: 4, }]}>
                <ImageBackground source={isIphoneX() ? Images.JeeHrbackgroundtopX : Images.JeeHrbackgroundtop}
                    style={[nstyles.nHcontent, {
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexDirection: 'row',
                        paddingHorizontal: 15
                    }]}>
                    <View style={[nstyles.nrow, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                        <Menu
                            renderer={renderers.Popover}
                            rendererProps={{ placement: 'bottom' }} >
                            <MenuTrigger >{User.isUrl == true ? <Image
                                ref={ref => this.textRef = ref}
                                source={{ uri: User.Image }}
                                resizeMode={'cover'}
                                style={{ width: 26, height: 26, borderRadius: 16 }}
                            /> : <Image
                                source={Images.JeeAvatar}
                                resizeMode={'cover'}
                                style={{ width: 26, height: 26, marginRight: 15, borderRadius: 16 }}
                            />}</MenuTrigger>
                            <MenuOptions  >
                                <MenuOption value={1} onSelect={this._Diemdanh} >
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'flex-start', alignItems: 'center',
                                        paddingVertical: 9, paddingHorizontal: 10
                                    }}>
                                        <Image
                                            source={Images.icCamera}
                                            resizeMode={'contain'}
                                            style={styler.iconMenu}
                                        /><Text style={[styler.textMenu, {
                                            fontSize: sizes.sizes.sText14,
                                            lineHeight: sizes.sizes.sText20,
                                        }]}>{RootLang.lang.jeehr.diemdanh}</Text>
                                    </View>

                                </MenuOption>

                                <MenuOption value={1} onSelect={this.changePassword} >
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'flex-start', alignItems: 'center',
                                        paddingVertical: 9, paddingHorizontal: 10
                                    }}>
                                        <Image
                                            source={Images.icDoiMatKhau}
                                            resizeMode={'contain'}
                                            style={styler.iconMenu}
                                        /><Text style={[styler.textMenu, {
                                            fontSize: sizes.sizes.sText14,
                                            lineHeight: sizes.sizes.sText20,
                                        }]}>{RootLang.lang.jeehr.doimatkhau}</Text>
                                    </View>
                                </MenuOption>
                                <MenuOption value={1} onSelect={() => Utils.goscreen(this.nthis, "Modal_NgonNgu")} >
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'flex-start', alignItems: 'center',
                                        paddingVertical: 9, paddingHorizontal: 10
                                    }}>
                                        <Image
                                            source={Images.icNgonNgu}
                                            resizeMode={'contain'}
                                            style={styler.iconMenu}
                                        /><Text style={[styler.textMenu, {
                                            fontSize: sizes.sizes.sText14,
                                            lineHeight: sizes.sizes.sText20,
                                        }]}>{RootLang.lang.jeehr.ngonngu}</Text>
                                    </View>
                                </MenuOption>
                                <MenuOption value={1} onSelect={() => Utils.goscreen(this.nthis, "Modal_ThongTinUngDung")} >
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'flex-start', alignItems: 'center',
                                        paddingVertical: 9, paddingHorizontal: 10
                                    }}>
                                        <Image

                                            source={Images.icThongTin}
                                            resizeMode={'contain'}
                                            style={styler.iconMenu}
                                        /><Text style={[styler.textMenu, {
                                            fontSize: sizes.sizes.sText14,
                                            lineHeight: sizes.sizes.sText20,
                                        }]}>{RootLang.lang.jeehr.thongtinungdung}</Text>
                                    </View>
                                </MenuOption>
                                <MenuOption value={1} onSelect={this.logoutFromAvatar} >
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'flex-start', alignItems: 'center',
                                        paddingVertical: 9,
                                        paddingHorizontal: 10
                                    }}>
                                        <Image

                                            source={Images.icDangXuat}
                                            resizeMode={'contain'}
                                            style={styler.iconMenu}
                                        /><Text style={[styler.textMenu, {
                                            fontSize: sizes.sizes.sText14,
                                            lineHeight: sizes.sizes.sText20,
                                        }]}>{RootLang.lang.jeehr.dangxuat}</Text>
                                    </View>
                                </MenuOption>
                            </MenuOptions>
                        </Menu>

                        <TouchableOpacity
                            activeOpacity={0.5}
                            style={{ justifyContent: 'center', flex: 1, alignItems: 'center', marginLeft: -15 }}
                            onPress={() => Utils.goscreen(this.nthis, 'sw_HomePage')}>
                            <Image source={Images.JeeHricTop}
                                resizeMode='contain'
                                style={{
                                    width: sizes.sizes.nImgSize111,
                                    height: sizes.sizes.nImgSize26,
                                    justifyContent: 'center'
                                }} />
                        </TouchableOpacity>
                        <View style={nstyles.nrow}>

                        </View>
                    </View>

                </ImageBackground>
            </View>




        );
    }
}
const styler = StyleSheet.create({
    textMenu: {
        color: colors.colorTextBack80,
    },
    iconMenu: {
        width: sizes.sizes.nImgSize16,
        height: sizes.sizes.nImgSize16,
        marginRight: 7
    }
})
const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(HeaderCom, mapStateToProps, true)



