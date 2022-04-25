import React, { Component } from 'react';
import { PermissionsAndroid, Platform, Text, View, StyleSheet, TouchableOpacity, TextInput, Linking } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import { RootLang } from '../app/data/locales';
import Utils from '../app/Utils';
import { colors } from '../styles';
import { reText } from '../styles/size';
import { Height, Width } from '../styles/styles';

class DownloadFile extends Component {
    constructor(props) {
        super(props);
        this.url = Utils.ngetParam(this, 'url')
        this.fileName = Utils.ngetParam(this, 'fileName')
        this.fileSize = Utils.ngetParam(this, 'fileSize')
        this.fileType = Utils.ngetParam(this, 'fileType')
        this.state = {
            luuTru: '',
            name: this.fileName,
            size: this.fileSize,
            type: this.fileType
        };
    }
    componentDidMount = async () => {
        let { name, size, type } = this.state
        const date = new Date()
        if (name == '')
            name = date.getHours() + '-' + date.getMinutes() + '-' + date.getSeconds()
        if (size == '')
            size = 'Không xác định'
        if (type == '')
            type = 'Không xác định'
        const { dirs } = RNFetchBlob.fs;
        const dirToSave = Platform.OS == 'ios' ? dirs.DocumentDir : dirs.DownloadDir
        let brow = dirToSave.split('/')
        this.setState({ luuTru: '.../' + brow[brow.length - 1] + "/TaiLieuJeePlatform", name: name, size: size, type: type })
    }
    downloadFile = async (typeBtn, url = this.url, fileName = this.state.name) => {
        if (typeBtn == 'Cancel') {
            Utils.goback(this)
        }
        else if (typeBtn == 'Seen') {
            Linking.openURL(url)
        }
        else {
            if (Platform.OS === 'android') {
                await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
                await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE)
            }
            const { dirs } = RNFetchBlob.fs;
            const dirToSave = Platform.OS == 'ios' ? dirs.DocumentDir : dirs.DownloadDir
            const configfb = {
                fileCache: true,
                useDownloadManager: true,
                notification: true,
                title: fileName,
                path: dirToSave + "/TaiLieuJeePlatform/" + fileName,
            }
            const configOptions = Platform.select({
                ios: configfb,
                android: { addAndroidDownloads: configfb },
            });
            RNFetchBlob.config(configOptions)
                .fetch('GET', url)
                .then(res => {
                    if (Platform.OS === "ios") {
                        RNFetchBlob.ios.openDocument(res.data);
                    }
                    // if (Platform.OS === "ios") {
                    //     RNFetchBlob.fs.writeFile(configfb.path, res.data, 'base64');
                    //     RNFetchBlob.ios.previewDocument(configfb.path);
                    // }
                    if (Platform.OS == 'android') {
                        Utils.goback(this)
                    }
                })
                .catch((err) => { console.warn('error' + err) })
        }
    }
    render() {
        const { luuTru, size, type } = this.state
        return (
            <View style={stDownloadFile.view}>
                <View style={stDownloadFile.view1}>
                    <Text style={stDownloadFile.txtChiTiet}>Chi tiết</Text>
                    <View style={stDownloadFile.view2}>
                        <Text style={stDownloadFile.txtTieuDe}>Tên tệp: </Text>
                        <TextInput style={stDownloadFile.textinput} onChangeText={value => this.setState({ name: value })}>{this.fileName}</TextInput>
                    </View>
                    <View style={stDownloadFile.view2}>
                        <Text style={stDownloadFile.txtTieuDe}>Lưu trữ:  </Text>
                        <Text>{luuTru}</Text>
                    </View>
                    <View style={stDownloadFile.view2}>
                        <Text style={stDownloadFile.txtTieuDe}>Kích thước:  </Text>
                        <Text>{size}</Text>
                    </View>
                    <View style={stDownloadFile.view2}>
                        <Text style={stDownloadFile.txtTieuDe}>Kiểu dữ liệu:  </Text>
                        <Text>{type}</Text>
                    </View>
                    <View style={stDownloadFile.view21}>
                        <TouchableOpacity style={stDownloadFile.btnTaiXuong} onPress={() => this.downloadFile('Cancel')}>
                            <Text style={stDownloadFile.textBtn}>Huỷ</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={stDownloadFile.btnTaiXuong} onPress={() => this.downloadFile('Seen')}>
                            <Text style={stDownloadFile.textBtn}>Xem</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={stDownloadFile.btnTaiXuong} onPress={() => this.downloadFile('Download')}>
                            <Text style={stDownloadFile.textBtn}>Tải xuống</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}
const stDownloadFile = StyleSheet.create({
    view: {
        flex: 1,
        backgroundColor: '#00000080',
        justifyContent: 'center',
        alignItems: 'center'
    },
    view1: {
        backgroundColor: 'white',
        borderRadius: 10,
        width: Width(90),
        height: Height(35),
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        paddingVertical: 10,
    },
    view2: {
        width: '100%',
        paddingHorizontal: 10,
        paddingVertical: 5
    },
    view21: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        paddingVertical: 10
    },
    btnTaiXuong: {
        width: Width(25),
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.colorLineGray,
        borderRadius: 5
    },
    textBtn: {
        // color: 'white'
    },
    textinput: {
        maxHeight: 25, fontSize: 14, paddingVertical: 5
    },
    txtTieuDe: {
        marginBottom: 2,
        color: colors.textGray
    },
    txtChiTiet: {
        paddingVertical: 5,
        fontWeight: 'bold',
        fontSize: reText(25)
    }
})
const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(DownloadFile, mapStateToProps, true)
