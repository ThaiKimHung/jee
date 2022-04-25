import moment from 'moment'
import React, { Component } from 'react'
import {
    Linking, ScrollView, StyleSheet, Text,
    TouchableOpacity, View
} from 'react-native'
import AutoHeightWebView from 'react-native-autoheight-webview'
import { GetThongBao } from '../../apis/apithongbaonhansupersonal'
import { RootLang } from '../../app/data/locales'
import Utils from '../../app/Utils'
import HeaderComStack from '../../components/HeaderComStack'
import { colors } from '../../styles'
import { sizes } from '../../styles/size'
import { nstyles } from '../../styles/styles'
export class ChiTietThongBao extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataChiTietThongBao: "",
            RowID: Utils.ngetParam(this, 'RowID'),
            res: {}
        }
    }
    componentDidMount() {
        this._getListThongBao();
    }
    _getListThongBao = async () => {
        const { RowID } = this.state
        let res = await GetThongBao(0, RowID);
        Utils.nlog("gia tri item thông1111", res)
        if (res.status == 1) {
            if (res.Data && res.Data.length > 0) {
                this.setState({
                    dataChiTietThongBao: res.Data[0],
                    res: res
                })
            } else {
                Utils.showMsgBoxOK(this,
                    RootLang.lang.thongbaochung.thongbao,
                    RootLang.lang.thongbaochung.loilaydulieu,
                    RootLang.lang.thongbaochung.xacnhan);
            }

        } else {
            Utils.showMsgBoxOK(this, RootLang.lang.thongbaochung.thongbao,
                res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu,
                RootLang.lang.thongbaochung.xacnhan);
        }
    }
    render() {
        var { dataChiTietThongBao = {}, res = {} } = this.state
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: colors.white }]}>

                <HeaderComStack nthis={this} title={RootLang.lang.scthongbaocv.chitietthongbao}
                    Screen={true} isGoBack={true} OnGoBack={() => Utils.goback(this, null)} />
                <View style={{ paddingHorizontal: 15, paddingTop: 10 }}>
                    <Text style={{ fontSize: sizes.sText16, fontWeight: 'bold' }}>{dataChiTietThongBao.Title}</Text>
                    <View style={{ flexDirection: 'row', marginTop: 5 }}>
                        <Text style={styles.txtGreen}>{moment(dataChiTietThongBao.LastModified).format('DD/MM/YYYY hh:mm')}</Text>
                        <Text style={styles.txtGreen}>{' - '}</Text>
                        <Text style={styles.txtGreen}>{res.title}</Text>
                    </View>
                    <View style={{ backgroundColor: colors.veryLightPinkFive, height: 1, marginVertical: 20 }} />
                </View>

                <ScrollView style={{ marginHorizontal: 15, flex: 1 }}
                    showsVerticalScrollIndicator={false}
                >
                    {
                        dataChiTietThongBao.FileIn && dataChiTietThongBao.FileIn != '' ?
                            <TouchableOpacity onPress={() => {
                                Linking.openURL(dataChiTietThongBao.FileIn)
                            }}
                                style={{ width: 130, backgroundColor: colors.colorTabActive, justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}>
                                <Text style={{ paddingVertical: 8, color: colors.white }}>{RootLang.lang.scthongbaocv.taifile}</Text>
                            </TouchableOpacity> : null
                    }
                    <AutoHeightWebView

                        showsVerticalScrollIndicator={false}
                        style={{ width: '100%', marginTop: 10 }}
                        customScript={`document.body.style.background = 'white';`}
                        customStyle={`
      * {
        font-family: 'Times New Roman';
      }
      p {
        font-size: 16px;
      }
           
            .phieuluong_title {
                text-align: center;
                color: black;
                font-size: 16pt;
                font-weight: bold;
                border: 1px solid black;
                border-style: dotted;
            }
        
            .csscong {
                color: blue;
                height: 45px;
                font-size: 12pt;
            }
        
         .csscong0 {
                border: 1px solid black;
                padding-left: 5px;
                border-style: dotted;
            }
        
            .csscong1 {
                border: 1px solid black;
                text-align: right;
                padding-right: 5px;
                border-style: dotted;
            }
        
           .csskhoancong {
                color: rgb(22, 168, 80);
                height: 40px;
                background-color: #f0f0f0;
                font-size: 12pt;
                font-weight: bold;
            }
    
            .csskhoancong0 {
                border: 1px solid black;
                padding-left: 5px;
                border-style: dotted;
            }
        
            .csskhoancong1 {
                border: 1px solid black;
                text-align: right;
                padding-right: 5px;
                border-style: dotted;
            }
        
            .csstongtru {
                color: red;
                height: 40px;
                background-color: #f0f0f0;
                font-size: 12pt;
                font-weight: bold;
            }
        
            .csstongtru0 {
                border: 1px solid black;
                padding-left: 5px;
                border-style: dotted;
            }
        
           .csstongtru1 {
                border: 1px solid black;
                text-align: right;
                padding-right: 5px;
                border-style: dotted;
            }
        
            .cssthuclanh {
                color: rgb(22, 168, 80);
                height: 45px;
                background-color: #f0f0f0;
                font-size: 12pt;
                font-weight: bold;
            }
        
           .cssthuclanh0 {
                border: 1px solid black;
                padding-left: 5px;
                border-style: dotted;
            }
        
           .cssthuclanh1 {
                border: 1px solid black;
                text-align: right;
                padding-right: 5px;
                border-style: dotted;
            }
        
            .cssthongtin {
                color: black;
                height: 45px;
                font-size: 12pt;
            }
        
            .cssthongtin0 {
                border: 1px solid black;
                padding-left: 5px;
                border-style: dotted;
            }
        
            .cssthongtin1 {
                border: 1px solid black;
                text-align: left;
                font-weight: bold;
                padding-left: 5px;
                border-style: dotted;
            }
        
           .csstru {
                color: orangered;
                height: 45px;
                font-size: 12pt;
            }
        
            .csstru0 {
                border: 1px solid black;
                padding-left: 5px;
                border-style: dotted;
            }
        
            .csstru1 {
                border: 1px solid black;
                text-align: right;
                padding-right: 5px;
                border-style: dotted;
            }
    `}
                        // onSizeUpdated={({ size => Utils.nlog(size.height)})},
                        files={[{
                            href: 'cssfileaddress',
                            type: 'text/css',
                            rel: 'stylesheet'
                        }]}
                        source={{ html: dataChiTietThongBao.MoTa }}
                        scalesPageToFit={false}
                        viewportContent={'width=device-width, user-scalable=no'}
                    /*
                    other react-native-webview props
                    */
                    />
                    {/* <Text>{this.dataChiTietThongBao.MoTa}</Text> */}

                </ScrollView>
            </View >
        )
    }
}

const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(ChiTietThongBao, mapStateToProps, true)


const styles = StyleSheet.create({
    txtGreen: {
        color: colors.colorTabActive
    },
})