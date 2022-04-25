import { Dimensions, Platform, StyleSheet } from 'react-native';
import { colors } from '../../../styles/color';
const { width, height } = Dimensions.get('window');

export const radius = 6;
export const Styles = StyleSheet.create({
    btnStyle: {
        height: height * 0.045,
        width: width * 0.28,
        // backgroundColor: isToggle ? colors.btnSoftBlue : 'white', 
        borderRadius: (height * 0.5) / 2,
        // justifyContent: 'center', alignItems: 'center' 
    },
    txtStyle: {
        // width: width * 0.7,
        ...Platform.select({
            ios: {
                paddingBottom: 0
            },
            android: {
                paddingVertical: 0
            },
        }),
    },
    boxSearchHome: {
        borderColor: colors.softBlue,
        borderRadius: 6,
        borderWidth: 1,
        marginBottom: 0
    },
    containerTab: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    containerTabSignIn: {
        marginHorizontal: 15,
        paddingVertical: 10,
        borderBottomWidth: 3,
        alignItems: 'center',
    },
    containerList: {
        borderColor: colors.white,
        borderWidth: 1,
        borderBottomColor: colors.colorBrownishGrey
    },
    boxSearchHome: {
        marginHorizontal: 15,
        borderColor: colors.BackText,
        borderWidth: 0.5,
        marginBottom: 0
    },
})