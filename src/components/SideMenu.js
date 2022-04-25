import React, { Component } from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { appConfig } from '../app/Config';
import { RootLang } from '../app/data/locales';
import Utils from '../app/Utils';
import { Images } from '../images/index';
import { colors } from '../styles/color';
import { sizes } from '../styles/size';
import { Height, nstyles, Width } from '../styles/styles';

const stSideMenu = StyleSheet.create({
    btnTab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textTab: {
        fontSize: sizes.sText10,
        color: colors.colorGrayIcon
    },
    text: {
        fontSize: sizes.sText14,
        color: colors.colorSapphireTwo
    },
    logoTripU: {
        width: sizes.nImgSize88,
        height: sizes.nImgSize31
    },
    blog: {
        position: 'absolute',
        right: 0,
        top: 0,
        left: Width(50),
        paddingVertical: Height(1),
        backgroundColor: 'white',
        paddingLeft: Width(5),
        ...Platform.select({
            ios: {
                shadowColor: 'gray',
                shadowOffset: { width: -2, height: 3 },
                shadowOpacity: 0.2,
                shadowRadius: 5
            },
            android: {
                elevation: 8, // = shadowRadius: 2
                // position:'relative',
            },
        }),
    }

});

export default class SideMenu extends Component {
    constructor(props) {
        super(props);
        search = '';
        this.index = -1;
        this.state = {
            loading: false,
            blogToogle: false
        }
        this.dataMenu = [
            { title: RootLang.lang.flights, route: 'side_Flightxxx', icon: Images.icFlight },
            { title: RootLang.lang.hotels, route: 'side_Hotels', icon: Images.icHotels },
            // { title: 'Tranfers', route: 'side_Flightxxx', icon: Images.icCarSoftBlue },
            { title: RootLang.lang.visaservices, route: 'side_Flightxxx', icon: Images.icGroundeServices },
            // { title: 'Deals', route: 'side_Flightxxx', icon: Images.icDealsSoftBlue },
            { title: RootLang.lang.blog, route: 'side_Blog', icon: Images.icBlogs, toggle: true },
        ];
        this.dataBlog = [
            { title: 'See & Do', route: 'side_SeeDo' },
            { title: 'Guide & Tips', route: 'side_SeeDo' },
            { title: 'Food & Drink', route: 'side_SeeDo' },
            { title: 'Inspiration', route: 'side_SeeDo' },
            { title: 'Travel', route: 'side_SeeDo', icon: Images.icU },
            { title: 'Lifestyle', route: 'side_SeeDo' },
        ];
        this.dataST_US = [
            {
                title: RootLang.lang.settings, blog: 'true', child: [
                    { title: RootLang.lang.changelanguage, route: 'sc_ChangeLanguage' },
                    // { title: 'Change currency', route: 'sc_ChangeCurrency' },
                    // { title: 'Sign in/Create account', route: 'sc_SignInAccount' },
                ]
            },
            {
                title: RootLang.lang.USEFULLINKS, child: [
                    // { title: 'Download our free app', route: 'sc_ChangeLanguage' },
                    { title: RootLang.lang.contactus, route: 'sc_ContactUS' },
                    { title: RootLang.lang.aboutus, route: 'sc_AboutUS' },
                    { title: RootLang.lang.FAQs, route: 'side_FAQMain' },
                    { title: RootLang.lang.privacypolicy, route: 'sc_PrivacyPolicy' },
                    { title: RootLang.lang.cookiepolicy, route: 'sc_CookiePolicy' },
                    // { title: 'Terms & Conditions', route: 'openWeb1', link: 'https://github.com/facebook/react-native' },
                ]
            },

        ]
    };



    _ClickMenu = (screen, index, param) => () => {
        if (screen == 'side_Blog') this.setState({ blogToogle: !this.state.blogToogle });
        else {
            this.index = index;
            setTimeout(() => {
                if (screen == 'openWeb1') {
                    Utils.openWeb(this, param, { isHtml: true, istitle: true, title: 'Terms & Conditions' });
                }
                else {
                    Utils.goscreen(this, screen, { param });
                }
            }, 100);
            this.setState({ blogToogle: false });
            Utils.toggleDrawer(this, true, '');
        };
    };

    _clearSearch = () => {
        search = '';
    };

    _renderBlog = (item, index) => {
        return <TouchableOpacity key={index} style={[nstyles.nrow, { paddingVertical: Height(1.2) }]}>
            {item.icon == undefined ? null : <Image source={item.icon} style={[nstyles.nIcon14, { marginRight: Width(2) }]} resizeMode='contain' />}
            <Text  style={[nstyles.txtGray, { color: colors.colorSapphireTwo }]}>{item.title}</Text>
        </TouchableOpacity>
    };

    _renderMenu = (item, index) => {
        const { txtGray } = stSideMenu;
        const { nrow, nIcon10, nIcon15 } = nstyles;
        return <TouchableOpacity
            key={index}
            onPress={this._ClickMenu(item.route, index)}
            style={[nrow, { alignItems: 'center', paddingVertical: Height(1.5), borderBottomWidth: index == this.dataMenu.length - 1 ? 0 : Height(0.05), borderBottomColor: 'rgba(112,112,112,0.4)', justifyContent: 'space-between' }]}>
            <View style={[nrow, { alignItems: 'center' }]}>
                <Image source={item.icon} style={[nIcon15, { tintColor: colors.colorSoftBlue }]} resizeMode='stretch' />
                <Text  style={[txtGray, { color: colors.colorSapphireTwo, marginLeft: Width(3) }]}>{item.title}</Text>
            </View>
            {item.toggle && !this.state.blogToogle ? <Image source={Images.icShowLessDown} style={[nIcon10, { tintColor: 'gray' }]} resizeMode='contain' />
                : item.toggle == undefined ? null : <Image source={Images.icShowLessUp} style={[nIcon10, { tintColor: 'gray' }]} resizeMode='contain' />
            }
        </TouchableOpacity>
    };
    _renderST_US = (item, index) => {
        const { txtGray, blog } = stSideMenu;
        const { nrow, txtSoftBlue, nIcon15 } = nstyles;
        return (
            <View key={index} >
                <View style={{ paddingVertical: Height(1), backgroundColor: colors.colorLightPeriwinkle, paddingLeft: Height(3) }}>
                    <Text  style={[txtSoftBlue, { fontSize: sizes.sText12 }]}>{item.title}</Text>
                </View>
                {
                    item.child.map((item2, index2) => <TouchableOpacity
                        key={index2}
                        onPress={this._ClickMenu(item2.route, index, item2.api)}
                        style={[nrow, { alignItems: 'center', paddingVertical: Height(1.5), borderBottomWidth: index2 == this.dataMenu.length - 1 ? 0 : Height(0.05), borderBottomColor: 'rgba(112,112,112,0.4)', justifyContent: 'space-between' }]}>
                        <View style={[nrow, { alignItems: 'center' }]}>
                            <Image source={item.icon} style={[nIcon15, { tintColor: colors.colorSoftBlue }]} resizeMode='stretch' />
                            <Text  style={[txtGray, { color: 'black', marginLeft: Width(3) }]}>{item2.title}</Text>
                        </View>
                    </TouchableOpacity>)
                }
            </View>
        )
    }
    render() {
        const { text, logoTripU, blog } = stSideMenu;
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: 'white', zIndex: 0 }]}>
                <View style={{ flex: 1 }}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ paddingTop: Height(5), alignItems: 'center', backgroundColor: 'white' }}>
                            <TouchableOpacity onPress={this._ClickMenu('side_Home', -1)}>
                                <Image source={Images.LogoTripU} style={logoTripU} resizeMode='cover' />
                            </TouchableOpacity>
                            <View style={[nstyles.nrow, {
                                borderColor: colors.colorSoftBlue,
                                paddingHorizontal: Height(2),
                                borderRadius: 24, backgroundColor: colors.ScrollView,
                                paddingVertical: Height(0.3), borderWidth: Height(0.1),
                                alignItems: 'center', marginVertical: Height(2), marginHorizontal: Height(3)
                            }]}>
                                <Image source={Images.icSearchGrey} resizeMode='contain' style={[nstyles.nIcon16, { tintColor: colors.colorSoftBlue }]} />
                                {/* TextInput - cách sử dụng tối ưu ko set lại state mỗi khi TextChange
                         - giá trị vẫn được lưu bằng biến thường 
                         - trường hợp sử dụng lấy giá trị khi nhập xong thì có thể onBLur, onEndEditing,...
                         */}
                                <TextInput 
                                    ref={refs => this.inputSearch = refs}
                                    onChangeText={keyWord => {
                                        search = keyWord;
                                    }}
                                    placeholderTextColor={`${colors.colorSoftBlue}`}
                                    style={[nstyles.ntextinput, { flex: 1 }]}
                                    placeholder='Search'>{search}</TextInput>
                                {
                                    this.state.loading ?
                                        <ActivityIndicator size='small' />
                                        : <TouchableOpacity onPress={this._clearSearch}>
                                            <Image source={Images.icCloseGrey} resizeMode='contain' style={[nstyles.nIcon16, { opacity: 0.5 }]} />
                                        </TouchableOpacity>
                                }
                            </View>
                        </View>
                        <View style={{ backgroundColor: colors.colorLightPeriwinkle, height: Height(4) }} />
                        <View style={{ paddingHorizontal: Height(3) }}>
                            {
                                this.dataMenu.map((item, index) => this._renderMenu(item, index))
                            }
                        </View>
                        <View>
                            {
                                this.dataST_US.map((item, index) => this._renderST_US(item, index))
                            }
                            {
                                this.state.blogToogle ?
                                    <View style={blog}>
                                        {
                                            this.dataBlog.map((item1, index1) => this._renderBlog(item1, index1))
                                        }
                                    </View> : null
                            }
                        </View>
                    </ScrollView>
                    <View
                        style={{
                            width: '100%', backgroundColor: 'white', alignItems: 'flex-end', shadowColor: 'black', shadowOpacity: 0.3, shadowRadius: 4, elevation: 15,
                        }}>
                        <Text  style={[stSideMenu.text, { padding: 20, paddingVertical: 8 }]}>Version {appConfig.version}</Text>
                    </View>
                </View>
            </View>
        );
    }
}