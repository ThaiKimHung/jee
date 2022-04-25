import React, { Component } from 'react';
import { ScrollView, Text, View } from 'react-native';
import RNRestart from 'react-native-restart';
import { RootLang } from '../app/data/locales';
import { nkey } from '../app/keys/keyStore';
import Utils from '../app/Utils';
import ButtonCom from '../components/Button/ButtonCom';
import { colors } from '../styles';
// import { Images } from '../../images'
import { reSize, reText } from '../styles/size';
import { nstyles } from '../styles/styles';
import HeaderModal from 'Component/HeaderModal';

export class Modal_KTDangNhap extends Component {
    constructor(props) {
        super(props);
        // this.data = Utils.ngetParam(this, 'data')
        this.state = {
        }
    }
    render() {
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: `transparent`, justifyContent: 'flex-end', }]}>
                <View onTouchEnd={this._goback} style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: colors.backgroundModal, }} />
                <View style={{ backgroundColor: colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, zIndex: 1, paddingBottom: 25 }}>
                    <HeaderModal />
                    <ScrollView>
                        <Text style={{
                            fontSize: reText(16), color: colors.greenTab,
                            fontWeight: 'bold', alignSelf: 'center', marginTop: 30
                        }}>{(RootLang.lang.thongbaochung.thongbao)}</Text>
                        <Text style={{
                            fontSize: reText(14),
                            textAlign: 'center', marginVertical: 20
                        }}>
                            {RootLang.lang.thongbaochung.yeucaudangnhap}
                        </Text>
                        {/* <TouchableOpacity onPress={() => RNRestart.Restart()}>
                            <Text>touch</Text>
                        </TouchableOpacity> */}

                        <ButtonCom
                            text={RootLang.lang.thongbaochung.xacnhan}
                            style={{
                                width: reSize(160), marginBottom: 30,
                                alignItems: "center", justifyContent: "center", alignSelf: "center",
                                backgroundColor: colors.colorButtonLeftJeeHR,
                                backgroundColor1: colors.colorButtomrightJeeHR,
                            }}
                            onPress={async () => {
                                await Utils.nsetStorage(nkey.token, "");
                                await Utils.nsetStorage(nkey.biometrics, false);
                                RNRestart.Restart()
                            }} />
                    </ScrollView>
                </View>
            </View >

        )
    }
}


const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(Modal_KTDangNhap, mapStateToProps, true)
