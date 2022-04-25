/**
 * Styles for app
 * @type {string}
 * =====================================================================================================================
 */

import {
    Dimensions, Platform,
    StyleSheet, StatusBar
} from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { colors, fonts } from '../styles';
import { sizes } from './size';
import { getStatusBarHeight } from 'react-native-status-bar-height';

import ExtraDimensions from 'react-native-extra-dimensions-android';

export const versionIOS = Platform.OS == 'ios' && parseInt(Platform.Version, 10) < 14; //--IOS < 14 lanscape bị ngược
export const versionIOS_12 = Platform.OS == 'ios' && parseInt(Platform.Version, 10) < 12; //--IOS < 12 thì dành cho các iphone cũ
const height = Platform.OS == 'ios' ? Dimensions.get('window').height : ExtraDimensions.get('REAL_WINDOW_HEIGHT') + ExtraDimensions.get('SOFT_MENU_BAR_HEIGHT') + ExtraDimensions.get('STATUS_BAR_HEIGHT');
const mheight = Platform.OS == 'ios' ? (isIphoneX() ? Dimensions.get('window').height + 15 : Dimensions.get('window').height) : Dimensions.get('window').height
const width = Dimensions.get('window').width;
export const nwidth = width;
export const nheight = height
export const isIOS = Platform.OS == 'ios';
export const heightStatusBar = getStatusBarHeight()

export const Height = (num: number) => nheight * (num / 100);
export const Width = (num: number) => nwidth * (num / 100);

export const nHeight = (num: number) => mheight * (num / 100);
export const nWidth = (num: number) => nwidth * (num / 100);



//--Khai báo các thuộc tính chung
export const boldMax2 = '900';
export const boldMax = 'bold';
export const boldNom2 = '600';
export const boldNom = '400';
export const boldLow = '300';

//-- Khai báo các màu chủ đạo của app và gọi lại dùng.
export const nColors = {
    bgr: colors.BackgroundHome,
    main: colors.white,
    main2: colors.emerald,
    textMain: colors.black
};

//--Xử lý container iPhoneX
let safeHeighHead = 0;
let paddingTopMul = 0;
let paddingBotX = 0;
let heightHed = 30;
let heightBot = 50;
if (isIphoneX()) {
    safeHeighHead = 30;
    paddingTopMul = 30;
    heightBot = 80;
    heightHed = 80;
    paddingBotX = 15;
} else if (Platform.OS == 'ios') { //|| Platform.OS == 'android' && Platform.Version >= 20
    heightHed = 65;
    paddingTopMul = 15;
}
export { heightHed, paddingTopMul, paddingBotX, safeHeighHead, heightBot };

export const nstyles = StyleSheet.create({
    nModalMagin: {
        marginTop: isIphoneX() ? 45 : 15
    },
    ncontainer: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: nColors.bgr
    },
    // style khung fix hiện thị ở bottom cho iphone X. screen nào cần thì dùng(thường là screen nằm ngoài TabHome)
    ncontainerX: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: nColors.bgr,
        paddingBottom: paddingBotX
    },
    ncol: {
        flexDirection: 'column'
    },
    nrow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    shadow: Platform.OS == 'android' ? {} : {
        elevation: 5,
        shadowOffset: {
            width: 1,
            height: 0
        },
        shadowRadius: 5,
        shadowOpacity: 0.4,
        shadowColor: colors.blackShadow
    },
    shadowButTon: Platform.OS == 'android' ? {} : {
        elevation: 5,
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowRadius: 1,
        shadowOpacity: 0.2,
        shadowColor: colors.colorGrayIcon
    },
    shadowTabTop: Platform.OS == 'android' ? {} : {
        elevation: 10,
        shadowOffset: {
            width: 1,
            height: 1
        },
        shadowRadius: 1,
        shadowOpacity: 0.1,
        shadowColor: colors.colorGrayIcon
    },
    //--styles chung cơ bản của text, bắt buộc phải có trong mỗi style của thẻ <Text...
    ntext: {
        color: nColors.textMain,
        fontWeight: boldNom,
        fontSize: sizes.sText13
    },
    ntextJHR: {
        color: nColors.textMain,
        fontWeight: boldNom,
        fontSize: sizes.sText14,
        lineHeight: 19,
        flex: 1,
        padding: 10,
        paddingLeft: 15,
        height: '100%',
    },
    ntextinput: {
        color: nColors.textMain,
        fontWeight: boldNom,
        fontSize: sizes.sText14,
        paddingVertical: 4,
        paddingHorizontal: 10
    },
    ntexttitle: {
        color: nColors.main2,
        fontWeight: boldNom,
        fontSize: sizes.sText17
    },
    ntextsub: {
        color: colors.colorGrayText,
        fontWeight: boldNom,
        fontSize: sizes.sText17
    },
    ntextSma: {
        color: nColors.textMain,
        fontWeight: boldNom,
        fontSize: sizes.sText14
    },
    ntextsubSma: {
        color: colors.colorGrayText,
        fontWeight: boldNom,
        fontSize: sizes.sText14
    },
    //--styles thanh header chung
    nhead: {
        height: heightHed,
        backgroundColor: nColors.main,
        borderColor: nColors.main2,
        borderBottomWidth: 1
    },
    nbody: {
        flex: 1,
    },
    nfooter: {
        height: heightBot,
        paddingBottom: paddingBotX
    },
    nbotttom: {
        height: 50,
        backgroundColor: colors.white
    },
    nHcontent: {
        height: heightHed,
        paddingTop: paddingTopMul + 8,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: nColors.main
    },
    nHleft: {
        flex: 0.14,
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    nHmid: {
        flex: 0.72,
        alignItems: 'center'
    },
    nHright: {
        flex: 0.2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    //--
    ntitle: {
        color: nColors.main,
        fontSize: sizes.sText16,
        fontWeight: '500'
    },
    nbtn_Bor_Ra: {
        backgroundColor: colors.white,
        borderColor: nColors.main,
        borderRadius: 5,
        borderWidth: 2,
        padding: 8,
        paddingHorizontal: 15,
        justifyContent: 'center'
    },
    nbtn_Bgr: {
        backgroundColor: nColors.main,
        padding: 8,
        paddingHorizontal: 12,
        justifyContent: 'center'
    },
    ntextbtn_Bor: {
        color: nColors.main,
        fontWeight: boldNom,
        textAlign: 'center',
        fontSize: sizes.sText17
    },
    ntextbtn_Bgr: {
        color: colors.white,
        fontWeight: boldNom2,
        textAlign: 'center',
        fontSize: sizes.sText17
    },
    nmiddle: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    nLineTextInput: {
        height: 1,
        backgroundColor: '#BCBBC1'
    },
    textRegular12: {
        fontSize: sizes.sText12,
        fontFamily: fonts.Helvetica
    },
    textRegular16: {
        fontSize: sizes.sText16,
        fontFamily: fonts.Helvetica
    },
    textBold16: {
        fontFamily: fonts.HelveticaBold,
        fontSize: sizes.sText16,
    },
    //----
    npopupContain: {
        position: 'absolute',
        left: 0, right: 0, bottom: 0, height: height,
        flexDirection: 'column'
    },
    npopupBgr: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: colors.black,
        opacity: 0.5
    },
    //--- IMG styles
    nIconH16W8: {
        width: sizes.nImgSize8,
        height: sizes.nImgSize16,
    },
    nIconH18W22: {
        width: sizes.nImgSize22,
        height: sizes.nImgSize18,
    },
    nIconH4W18: {
        width: sizes.nImgSize18,
        height: sizes.nImgSize4,
    },
    nIconH11W14: {
        width: sizes.nImgSize14,
        height: sizes.nImgSize11,
    },
    nIcon8: {
        width: sizes.nImgSize8,
        height: sizes.nImgSize8
    },
    nIcon10: {
        width: sizes.nImgSize10,
        height: sizes.nImgSize10
    },
    nIcon11: {
        width: sizes.nImgSize11,
        height: sizes.nImgSize11
    },
    nIcon12: {
        width: sizes.nImgSize12,
        height: sizes.nImgSize12
    },
    nIcon13: {
        width: sizes.nImgSize13,
        height: sizes.nImgSize13
    },
    nIcon14: {
        width: sizes.nImgSize14,
        height: sizes.nImgSize14,
    },
    nIcon15: {
        width: sizes.nImgSize15,
        height: sizes.nImgSize15,
    },
    nIcon16: {
        width: sizes.nImgSize16,
        height: sizes.nImgSize16,
    },
    nIcon17: {
        width: sizes.nImgSize17,
        height: sizes.nImgSize17,
    },
    nIcon18: {
        width: sizes.nImgSize18,
        height: sizes.nImgSize18,
    },
    nIcon19: {
        width: sizes.nImgSize19,
        height: sizes.nImgSize19
    },
    nIcon20: {
        width: sizes.nImgSize20,
        height: sizes.nImgSize20
    },
    nIcon21: {
        width: sizes.nImgSize21,
        height: sizes.nImgSize21
    },

    nIcon22: {
        width: sizes.nImgSize22,
        height: sizes.nImgSize22
    },
    nIcon24: {
        width: sizes.nImgSize24,
        height: sizes.nImgSize24
    },
    nIcon26: {
        width: sizes.nImgSize26,
        height: sizes.nImgSize26
    },
    nIcon28: {
        width: sizes.nImgSize28,
        height: sizes.nImgSize28
    },
    nIcon29: {
        width: sizes.nImgSize29,
        height: sizes.nImgSize29
    },
    nIcon30: {
        width: sizes.nImgSize30,
        height: sizes.nImgSize30
    },
    nIcon32: {
        width: sizes.nImgSize32,
        height: sizes.nImgSize32
    },
    nIcon33: {
        width: sizes.nImgSize33,
        height: sizes.nImgSize33
    },
    nIcon35: {
        width: sizes.nImgSize35,
        height: sizes.nImgSize35
    },
    nIcon38: {
        width: sizes.nImgSize38,
        height: sizes.nImgSize38
    },
    nIcon40: {
        width: sizes.nImgSize40,
        height: sizes.nImgSize40
    },
    nIcon50: {
        width: sizes.nImgSize50,
        height: sizes.nImgSize50
    },
    nIcon56: {
        width: sizes.nImgSize56,
        height: sizes.nImgSize56
    },
    nAva18: {
        width: sizes.nImgSize18,
        height: sizes.nImgSize18,
        borderRadius: sizes.nImgSize18 / 2
    },
    nAva26: {
        width: sizes.nImgSize26,
        height: sizes.nImgSize26,
        borderRadius: sizes.nImgSize26 / 2
    },
    nAva28: {
        width: sizes.nImgSize28,
        height: sizes.nImgSize28,
        borderRadius: sizes.nImgSize28 / 2
    },
    nAva32: {
        width: sizes.nImgSize32,
        height: sizes.nImgSize32,
        borderRadius: sizes.nImgSize32 / 2
    },
    nAva35: {
        width: sizes.nImgSize35,
        height: sizes.nImgSize35,
        borderRadius: sizes.nImgSize35 / 2
    },
    nAva40: {
        width: sizes.nImgSize40,
        height: sizes.nImgSize40,
        borderRadius: sizes.nImgSize40 / 2
    },
    nAva50: {
        width: sizes.nImgSize50,
        height: sizes.nImgSize50,
        borderRadius: sizes.nImgSize50 / 2
    },
    nAva60: {
        width: sizes.nImgSize60,
        height: sizes.nImgSize60,
        borderRadius: sizes.nImgSize60 / 2
    },
    nAva70: {
        width: sizes.nImgSize70,
        height: sizes.nImgSize70,
        borderRadius: sizes.nImgSize70 / 2
    },
    nAva80: {
        width: sizes.nImgSize80,
        height: sizes.nImgSize80,
        borderRadius: sizes.nImgSize80 / 2
    },
    nAva94: {
        width: sizes.nImgSize94,
        height: sizes.nImgSize94,
        borderRadius: sizes.nImgSize94 / 2
    },
    nbtnCir14: {
        width: sizes.nImgSize14,
        height: sizes.nImgSize14,
        borderRadius: sizes.nImgSize14 / 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    nbtnCir40: {
        width: sizes.nImgSize40,
        height: sizes.nImgSize40,
        borderRadius: sizes.nImgSize20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    //-- TripU styles chung
    containLinebot: {
        borderColor: colors.sapphire,
        borderBottomWidth: 0.5,
        paddingVertical: 5,
        marginVertical: 15,
        alignItems: 'center'
    },
    containWhite_BorBlue: {
        backgroundColor: colors.white, marginHorizontal: 20,
        padding: 12, paddingVertical: 25,
        marginBottom: Height(5)
    },
    txtGeneral: {
        fontSize: sizes.sText15,
        color: 'black',
        fontWeight: boldNom
    },
    txtGray: {
        fontSize: sizes.sText12,
        color: colors.colorGreyishBrown
    },
    txtSoftBlue: {
        fontSize: sizes.sText14,
        color: colors.softBlue
    },
    txtWhite: {
        fontSize: sizes.sText14,
        color: colors.black,
        paddingVertical: 10
    },
    txtBlack: {
        fontSize: sizes.sText14,
        color: colors.blackIcon,
        paddingVertical: 10
    },
    txtSapphire17: {
        fontSize: sizes.sText17,
        color: colors.colorSapphire
    },
    shadown: {
        elevation: 6,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 6,
        shadowOpacity: 0.2,
        shadowColor: colors.black_50
    },

});

//css khác tự định nghĩa
//---------------------

//Hiện sẽ copy style từng màn hình bỏ đây (nếu có).

//styles màn hình Feeds
export const stFeeds = StyleSheet.create({
    textLikes: {
        color: '#4A4A4A',
        fontSize: 14,
        fontWeight: '300'
    },
    loadios: { position: 'absolute', bottom: -50, left: 0, width: '100%', alignItems: 'center' },
    loadandroid: { width: '100%', alignItems: 'center', marginTop: 20 },
    imgFull: { borderWidth: 0.5, borderColor: colors.colorGrayText },
    imgLink: { width: 100, height: 100, borderWidth: 0.5, borderColor: colors.colorGrayText, marginLeft: -10 }
});

//styles màn hình Comment
export const stComment = StyleSheet.create({
    textCmt: {
        color: nColors.textMain,
        fontSize: 15,
        fontWeight: boldNom
    }
});

//styles màn hình Comment
export const stNewFeeds = StyleSheet.create({
    btnDelItem: {
        position: 'absolute',
        top: 5,
        right: 5
    }
});

// Styles màn hình Accomplishment
export const stAccomplishment = StyleSheet.create({
    bodyBgr: {
        backgroundColor: '#DADADB',
    },
    firstTittle: {
        fontSize: sizes.sText17,
        marginLeft: 10,
        marginTop: 20,
        marginBottom: 5,
        color: '#8E8E93'
    },
    txtTitle: {
        color: '#8E8E93',
        fontSize: sizes.sText17,
        marginLeft: 10,
        marginTop: 10,
        marginBottom: 5
    },
    txtContent: {
        fontSize: sizes.sText17,
        color: nColors.textMain,
        marginLeft: 10,
        marginVertical: 10
    },
    ContentBgr: {
        height: 44,
        backgroundColor: colors.white
    },
    containerTextArea: {
        height: 176,
        backgroundColor: colors.white
    },
    btnContainer: {
        backgroundColor: colors.white,
        height: 44,
        marginTop: 10,
        marginBottom: 12
    },
    txtBtn: {
        color: '#D0021B',
        fontSize: sizes.sText17
    },
    IconContainer: {
        position: 'absolute',
        right: 12
    },
})

// Styles màn hình Recommendation
export const stRecommendation = StyleSheet.create({
    txtContent: {
        fontSize: sizes.sText17,
        color: '#8E8E93',
        marginLeft: 10,
        marginTop: 10,
        marginBottom: 10
    },
})

// Styles màn hình Education
export const stEducation = StyleSheet.create({
    containerBox: {
        flexDirection: 'column',
        width: nwidth * 0.5 - 5
    },
})

// Styles màn hình Login
export const stLogin = StyleSheet.create({
    txtSma: {
        textAlign: 'center',
        fontSize: sizes.sText14,
        marginTop: 15
    },
    containerBtn: {
        padding: 12,
        backgroundColor: colors.colorPink3,
        width: nwidth - 80,
        borderRadius: 25
    },
    txtError: {
        color: colors.orange,
        fontSize: sizes.sText17,
        textAlign: 'center'
    },
    txtBtn: {
        textAlign: 'center',
        color: colors.white,
        fontSize: 20
    },
})

export const stUser = StyleSheet.create({
    containerTab: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    line: {
        height: 1,
        backgroundColor: '#696969',
        flex: 1
    },
    txtTab: {
        fontSize: sizes.sText14,
        fontWeight: '600',
        paddingVertical: 10
    },
    txtOr: {
        marginHorizontal: 10,
        fontSize: sizes.sText13,
        color: '#696969',
        fontWeight: '500',
    },
    containerTabSignIn: {
        paddingBottom: 3,
        borderBottomWidth: 2,
        alignItems: 'center'
    },
    labelTitle: {
        fontSize: sizes.sText13,
        color: colors.colorBrownishGrey,
        fontWeight: '500',
        marginTop: 20,
    },
    txtInput: {
        padding: 10,
        color: colors.black,
        fontWeight: '300',
        fontSize: sizes.sText16
    },
    containerInput: {
        borderRadius: 25,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.colorBrownishGrey,
        marginTop: 10
    },
    txtForgot: {
        alignSelf: 'flex-end',
        color: colors.softBlue,
        fontSize: sizes.sText14,
        fontWeight: '500',
    },
    inputBox: {
        width: '100%',
        paddingVertical: 8,
        backgroundColor: 'rgba(255, 255,255,0.2)',
        borderRadius: 18,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: "#4f80ff",
        paddingHorizontal: 20,



    },

})
export const dd = StyleSheet.create({
    container: {
        flex: 1
    },

    wrapper: {
    },

    slide: {
        height: '100%'
    },


    image: {
        height: '100%',
        width: '70%',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        marginHorizontal: 20,
        borderRadius: 10,
        flex: 1
    }
})

