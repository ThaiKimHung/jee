import moment from 'moment'
import React, { Component } from 'react'
import { Animated, FlatList, Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import RNFS from 'react-native-fs'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Utils from '../app/Utils'
import IsLoading from '../components/IsLoading'
import HeaderModalCom from '../Component_old/HeaderModalCom'
import { Images } from '../images'
import { colors } from '../styles'
import { Height, nHeight, nstyles, paddingBotX } from '../styles/styles'
import DocumentPicker from 'react-native-document-picker'
import UtilsApp from '../app/UtilsApp'
import { sizes } from '../styles/size'
import { RootLang } from '../app/data/locales'
export class ComponentSubmit extends Component {
    constructor(props) {
        super(props)
        this.Object = Utils.ngetParam(this, 'object')
        this.title = Utils.ngetParam(this, 'title')
        this.titleButton = Utils.ngetParam(this, 'titleButton')
        this.callback = Utils.ngetParam(this, 'callback')
        this.key = Utils.ngetParam(this, 'key')
        this.value = Utils.ngetParam(this, 'value')
        this.keyNotNull = Utils.ngetParam(this, 'keyNotNull')
        this.state = {
            opacity: new Animated.Value(0),
            listData: this.Object || [],
            listNull: []
        }
    }
    componentDidMount() {
        this._startAnimation(0.8)
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
    _goBack = () => {
        this._endAnimation(0)
        Utils.goback(this)
    }
    _submit = async () => {
        var { listData } = this.state
        // Utils.nlog('listData: ', listData);
        var isNull = false, listNull = []
        listData.forEach((x, y) => {
            if (x[this.keyNotNull] && !x[this.value]) {
                isNull = true
                listNull.push({ children: false, index: y })
                return
            }
            if (x.type == 'list' && x[this.value].some(i => i[this.keyNotNull] && !i[this.value])) {
                isNull = true
                listNull.push({ children: true, index: x[this.value].findIndex(i => i[this.keyNotNull] && !i[this.value]) })
                return
            }
        });
        this.setState({ listNull })
        if (!isNull) {
            this.callback(listData)
            this._goBack()
        }
    }

    _pickDateTime = (type, item, index, children = false) => {
        if (type == 1) {
            Utils.goscreen(this, 'Modal_CalandaSingalCom', {
                date: item[this.value] || moment(new Date()).format('DD/MM/YYYY'),
                setTimeFC: (date) => this._setDatTime(type, index, date, children)
            })
        }
        if (type == 2) {
            Utils.goscreen(this, 'Modal_GioPhutPickerBasic', {
                time: item[this.value] || moment(new Date()).format('HH:mm'),
                _setGioPhut: (time) => this._setDatTime(type, index, time, children)
            })
        }
    }
    _pickImage = (type, index, item, children, isAdd) => { //type: 1-image, 2-images | isAdd: true-thêm vào, false^undefined-thêm mới
        let options = {
            assetType: 'Photos',//All,Videos,Photos - default
            multi: type == 1 ? false : true,// chọn 1 or nhiều item
            limitCheck: -1, //gioi han sl media chon: -1 la khong co gioi han, >-1 la gioi han sl =  limitCheck
            groupTypes: 'All',
            response: (data) => this._setImage(type, index, data, children, isAdd),// callback giá trị trả về khi có chọn item
        }
        Utils.goscreen(this, 'Modal_MediaPicker', options);
    }
    _pickFile = async (type, index, item, children, isAdd) => { //type: 1-file, 2-files | isAdd: true-thêm vào, false^undefined-thêm mới
        let { listData } = this.state
        var newList = null
        if (type == 1) {
            newList = await this.pickFile()
        } else {
            newList = await this.pickFiles()
        }
        if (isAdd) {
            if (children)
                listData[children][this.value][index][this.value] = listData[children][this.value][index][this.value].concat(newList || [])
            else
                listData[index][this.value] = listData[index][this.value].concat(newList || [])
        }
        else {
            if (children)
                listData[children][this.value][index][this.value] = newList || []
            else
                listData[index][this.value] = newList || []
        }
        this.setState({ listData })
    }
    pickFile = async () => {
        try {
            const results = await DocumentPicker.pick({ type: [DocumentPicker.types.allFiles], });
            const split = results.fileCopyUri.split('/');
            const name = split.pop();
            const inbox = split.pop();
            const realPath = Platform.OS == 'android' ? results.uri : `file://${RNFS.TemporaryDirectoryPath}/${inbox}/${decodeURI(name)}`;
            const strBase64 = await RNFS.readFile(realPath, "base64")
            var file = [{
                IsAdd: true,
                Type: 2,
                extension: results.name.split('.')[results.name.split('.').length - 1],
                filename: results.name,
                strBase64: strBase64,
                type: results.type,
            }]
            return file
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                this.setState({ filePicked: false })
            }
        }
    }
    pickFiles = async () => {
        try {
            const results = await DocumentPicker.pickMultiple({ type: [DocumentPicker.types.allFiles], });
            // Utils.nlog("=-results", results)
            var mang = await Promise.all(results.map(async (i) => {
                const split = i.fileCopyUri.split('/');
                const name = split.pop();
                const inbox = split.pop();
                const realPath = Platform.OS == 'android' ? i.uri : `file://${RNFS.TemporaryDirectoryPath}/${inbox}/${decodeURI(name)}`;
                const strBase64 = await RNFS.readFile(realPath, "base64")
                return {
                    IsAdd: true,
                    Type: 2,
                    extension: i.name.split('.')[i.name.split('.').length - 1],
                    filename: i.name,
                    strBase64: strBase64,
                    type: i.type,
                }
            }))
            return mang
        } catch (err) {
            Utils.nlog('err', err)
            if (DocumentPicker.isCancel(err)) {
                // this.setState({ filePicked: false })
            }
        }
    }
    _setImage = async (type, index, data, children, isAdd) => {
        var { listData } = this.state
        var newList = []
        newList = await Promise.all(data?.map(async (item, index) => ({
            ...item,
            strBase64: await Utils.parseBase64_PAHT(item.uri, item.height, item.width, 0.3)
        })))
        if (isAdd) {
            if (children)
                listData[children][this.value][index][this.value] = listData[children][this.value][index][this.value].concat(newList)
            else {
                listData[index][this.value] = listData[index][this.value].concat(newList)
            }
        } else {
            if (children)
                listData[children][this.value][index][this.value] = newList
            else
                listData[index][this.value] = newList
        }
        this.setState({ listData })
    }
    _setDatTime = (type, index, datetime, children = false) => {
        var { listData } = this.state
        if (children) {
            if (type == 1) { //date
                listData[children][this.value][index][this.value] = datetime
            }
            if (type == 2) { //time
                listData[children][this.value][index][this.value] = datetime
            }
        }
        else {
            if (type == 1) { //date
                listData[index][this.value] = datetime
            }
            if (type == 2) { //time
                listData[index][this.value] = datetime
            }
        }
        this.setState({ listData })
    }

    _onChangeValue = (item, index, value, children) => {
        var { listData } = this.state
        if (children)
            listData[children][this.value][index][this.value] = value
        else
            listData[index][this.value] = value
        this.setState({ listData })
    }
    _removeImage = (type, index, children, y) => {
        var { listData } = this.state
        if (type == 1) {
            if (children)
                listData[children][this.value][index][this.value] = ''
            else
                listData[index][this.value] = ''
        }
        if (type == 2) {
            if (children)
                listData[children][this.value][index][this.value].splice(y, 1)
            else
                listData[index][this.value].splice(y, 1)
        }
        this.setState({ listData })
    }
    _removeFile = (type, index, children, y) => {
        var { listData } = this.state
        if (type == 1) {
            if (children)
                listData[children][this.value][index][this.value] = ''
            else
                listData[index][this.value] = ''
        }
        if (type == 2) {
            if (children)
                listData[children][this.value][index][this.value].splice(y, 1)
            else
                listData[index][this.value].splice(y, 1)
        }
        this.setState({ listData })
    }

    _renderItem = ({ item, index }, children) => {
        const isChildren = children ? true : false
        const isNull = this.state.listNull.some(x => x.children == isChildren && x.index == index)
        switch (item?.type) {
            case 'number':
                return (
                    <View style={styles.viewLayout(isChildren)}>
                        {item[this.key] ? <Text style={styles.txtTitleItem(isNull)}>{item[this.key]}</Text> : null}
                        <TextInput
                            onChangeText={(value) => this._onChangeValue(item, index, value, children)}
                            style={styles.inputNumber(isNull)}
                            keyboardType={'numeric'}>
                            {item[this.value]}
                        </TextInput>
                    </View>
                )
            case 'string':
                return (
                    <View style={styles.viewLayout(isChildren)}>
                        {item[this.key] ? <Text style={styles.txtTitleItem(isNull)}>{item[this.key]}</Text> : null}
                        <TextInput
                            onChangeText={(value) => this._onChangeValue(item, index, value, children)}
                            style={styles.inputString(isNull)}>
                            {item[this.value]}
                        </TextInput>
                    </View>
                )
            case 'date':
                return (
                    <View style={styles.viewLayout(isChildren)}>
                        {item[this.key] ? <Text style={styles.txtTitleItem(isNull)}>{item[this.key]}</Text> : null}
                        <TouchableOpacity style={styles.btnDatetime(isNull)} onPress={() => this._pickDateTime(1, item, index, children)}>
                            <Text>{item[this.value]}</Text>
                            <Image source={Images.ImageJee.icDate} style={styles.icon(isNull)}></Image>
                        </TouchableOpacity>
                    </View>
                )
            case 'time':
                return (
                    <View style={styles.viewLayout(isChildren)}>
                        {item[this.key] ? <Text style={styles.txtTitleItem(isNull)}>{item[this.key]}</Text> : null}
                        <TouchableOpacity style={styles.btnTime(isNull)} onPress={() => this._pickDateTime(2, item, index, children)}>
                            <Text>{item[this.value]}</Text>
                            <Image source={Images.icTime} style={styles.icon(isNull)}></Image>
                        </TouchableOpacity>

                    </View>
                )
            case 'image':
                return (
                    <View style={styles.viewLayout(isChildren)}>
                        {item[this.key] ? <Text style={styles.txtTitleItem(isNull)}>{item[this.key]}</Text> : null}
                        {item[this.value][0]?.filename ?
                            <TouchableOpacity onPress={() => UtilsApp.showImageZoomViewer(this, encodeURI(item[this.value][0].link ? item[this.value][0].link : item[this.value][0].uri))} style={{ marginTop: 10, marginRight: 10, width: 80 }}>
                                <Image source={{ uri: item[this.value][0].link ? encodeURI(item[this.value][0].link) : item[this.value][0].uri }} style={{ width: 80, height: 80 }}></Image>
                                <TouchableOpacity
                                    style={{ position: 'absolute', right: -7, top: -10, zIndex: 1, elevation: 1 }}
                                    onPress={() => this._removeImage(1, index, children)}>
                                    <Image source={Images.ImageJee.icXoaAnh} style={[nstyles.nAva26, { borderColor: 'white', borderWidth: 2 }]}></Image>
                                </TouchableOpacity>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity style={styles.btnImage(isNull)} onPress={() => this._pickImage(1, index, item, children)}>
                                <Text style={styles.txtImage(isNull)}>-- {RootLang.lang.thongbaochung.chonhinhanh} --</Text>
                            </TouchableOpacity>}
                        {/* {
                                    item[this.value][0]?.filename ?
                                        <TouchableOpacity onPress={() => this._removeImage(1, index, children)}>
                                            <Image source={Images.ImageJee.icXoaAnh} style={nstyles.nIcon20}></Image>
                                        </TouchableOpacity>
                                        : null} */}

                    </View>
                )
            case 'images':
                return (
                    <View style={styles.viewLayout(isChildren)}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                            {item[this.key] ? <Text style={styles.txtTitleItemS(isNull)}>{item[this.key]}</Text> : null}
                            {
                                item[this.value].length > 0 ?
                                    <TouchableOpacity
                                        style={{ paddingHorizontal: 10, paddingVertical: 5, alignItems: 'center' }}
                                        onPress={() => this._pickImage(2, index, item, children, true)}>
                                        <Image source={Images.ImageJee.icThemLuaChon} style={{ ...nstyles.nIcon26, tintColor: 'green' }}></Image>
                                    </TouchableOpacity> : null
                            }
                        </View>
                        {Utils.nlog(item[this.value])}
                        {item[this.value].length > 0 ?
                            <ScrollView horizontal style={{ borderBottomWidth: 1, borderBottomColor: colors.veryLightPinkTwo }}>
                                {item[this.value]?.map((x, y) =>
                                    // <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, }}>
                                    //     <TouchableOpacity onPress={() => this._pickImage(2, index, item, children)}>
                                    //         <Text >{x?.filename || '-- Chọn nhiều hình ảnh --'}</Text>
                                    //     </TouchableOpacity>
                                    //     <TouchableOpacity onPress={() => this._removeImage(2, index, children, y)}>
                                    //         <Image source={Images.ImageJee.icXoaAnh} style={nstyles.nIcon20}></Image>
                                    //     </TouchableOpacity>
                                    // </View>
                                    <View style={{ marginRight: 10 }}>
                                        <TouchableOpacity onPress={() => UtilsApp.showImageZoomViewer(this, encodeURI(x.link ? x.link : x.uri))} style={{ marginTop: 10, marginRight: 10, width: 80 }}>
                                            <Image source={{ uri: x.link ? encodeURI(x.link) : x.uri }} style={{ width: 80, height: 80 }}></Image>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={{ position: 'absolute', right: 0, top: 0 }}
                                            onPress={() => this._removeImage(2, index, children, y)}>
                                            <Image source={Images.ImageJee.icXoaAnh} style={[nstyles.nAva26, { borderColor: 'white', borderWidth: 2 }]}></Image>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </ScrollView>
                            :
                            <TouchableOpacity style={styles.btnImage(isNull)} onPress={() => this._pickImage(2, index, item, children)}>
                                <Text style={styles.txtImage(isNull)}>-- {RootLang.lang.thongbaochung.chonnhieuhinhanh} --</Text>
                            </TouchableOpacity>
                        }
                    </View >
                )
            case 'file':
                return (
                    <View style={styles.viewLayout(isChildren)}>
                        {item[this.key] ? <Text style={styles.txtTitleItem(isNull)}>{item[this.key]}</Text> : null}
                        <TouchableOpacity style={styles.btnImage(isNull)}
                            onPress={() => item[this.value][0]?.filename ? (item[this.value][0]?.link ? Utils.openUrl(item[this.value][0]?.link) : null) : this._pickFile(1, index, item, children)}>
                            <Text style={styles.txtImage(isNull)}>{item[this.value][0]?.filename || `-- ${RootLang.lang.thongbaochung.chontaptin} --`}</Text>
                            {
                                item[this.value][0]?.filename ?
                                    <TouchableOpacity onPress={() => this._removeFile(1, index, children)}>
                                        <Image source={Images.ImageJee.icXoaAnh} style={nstyles.nIcon20}></Image>
                                    </TouchableOpacity>
                                    : null}
                        </TouchableOpacity>

                    </View>
                )
            case 'files':
                return (
                    <View style={styles.viewLayout(isChildren)}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                            {item[this.key] ? <Text style={styles.txtTitleItemS(isNull)}>{item[this.key]}</Text> : null}
                            {
                                item[this.value].length > 0 ?
                                    <TouchableOpacity
                                        style={{ paddingHorizontal: 10, paddingVertical: 5, alignItems: 'center' }}
                                        onPress={() => this._pickFile(2, index, item, children, true)}>
                                        <Image source={Images.ImageJee.icThemLuaChon} style={{ ...nstyles.nIcon26, tintColor: 'green' }}></Image>
                                    </TouchableOpacity> : null
                            }
                        </View>
                        {item[this.value]?.length > 0 ?
                            <View style={{ borderBottomWidth: 1, borderBottomColor: colors.veryLightPinkTwo }}>
                                {item[this.value]?.map((x, y) =>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, }}>
                                        <TouchableOpacity onPress={() => x?.link ? Utils.openUrl(x?.link) : null}>
                                            <Text >{x?.filename || `-- ${RootLang.lang.thongbaochung.chonnhieutaptin} --`}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => this._removeFile(2, index, children, y)}>
                                            <Image source={Images.ImageJee.icXoaAnh} style={nstyles.nIcon20}></Image>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                            :
                            <TouchableOpacity style={styles.btnImage(isNull)} onPress={() => this._pickFile(2, index, item, children)}>
                                <Text style={styles.txtImage(isNull)}>{RootLang.lang.thongbaochung.chonnhieutaptin}</Text>
                            </TouchableOpacity>
                        }
                    </View>
                )
            case 'list':
                return (
                    <View style={styles.viewLayout(isChildren)}>
                        {item[this.key] ? <Text style={styles.txtTitleItem(isNull)}>{item[this.key]}</Text> : null}
                        <FlatList
                            data={item[this.value]}
                            //  extraData={this.state}
                            renderItem={(temp) => this._renderItem(temp, index)}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item, index) => index.toString()} />
                    </View>
                )
        }
    }
    render() {
        const { opacity, listData } = this.state
        const { title, titleButton } = this.props.route.params
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: 'transparent', justifyContent: 'flex-end', opacity: 1, }]} >
                <Animated.View onTouchEnd={() => Utils.goback(this)}
                    style={{
                        position: 'absolute', top: 0,
                        bottom: 0, left: 0, right: 0,
                        backgroundColor: colors.backgroundModal, opacity
                    }} />
                <KeyboardAwareScrollView
                    extraScrollHeight={Platform.OS == 'ios' ? Height(12) : Height(16)}
                    enableOnAndroid={true}
                    nestedScrollEnabled={true} keyboardShouldPersistTaps={"handled"}
                    style={styles.viewHome}>
                    <HeaderModalCom title={title} onPress={this._goBack}></HeaderModalCom>
                    <FlatList
                        data={listData}
                        //  extraData={this.state}
                        renderItem={this._renderItem}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item, index) => index.toString()} />
                    <TouchableOpacity style={styles.btnSubmit} onPress={this._submit}>
                        <Text style={styles.txtSubmit}>{titleButton}</Text>
                    </TouchableOpacity>
                    <IsLoading></IsLoading>
                </KeyboardAwareScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    viewHome: {
        backgroundColor: 'white', paddingHorizontal: 10, borderTopRightRadius: 15, borderTopLeftRadius: 15, paddingBottom: paddingBotX,
        maxHeight: nHeight(80)
    },
    btnSubmit: {
        paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5, alignSelf: 'center', alignItems: 'center', justifyContent: 'center',
        backgroundColor: colors.textTabActive, marginVertical: 20
    },
    txtSubmit: {
        fontWeight: '500', color: 'white'
    },
    viewLayout: (isChildren) => ({
        marginBottom: !isChildren ? 20 : 5
    }),
    inputString: (isNull) => ({
        padding: 0, paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: isNull ? 'red' : colors.veryLightPinkTwo
    }),
    inputNumber: (isNull) => ({
        padding: 0, paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: isNull ? 'red' : colors.veryLightPinkTwo
    }),
    txtTitleItem: (isNull) => ({
        fontSize: 12, color: isNull ? 'red' : colors.gray1, marginBottom: 5
    }),
    txtTitleItemS: (isNull) => ({
        fontSize: 12, color: isNull ? 'red' : colors.gray1
    }),
    btnDatetime: (isNull) => ({
        paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: isNull ? 'red' : colors.veryLightPinkTwo,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    }),
    btnTime: (isNull) => ({
        paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: isNull ? 'red' : colors.veryLightPinkTwo,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    }),
    btnImage: (isNull) => ({
        paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: isNull ? 'red' : colors.veryLightPinkTwo,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
    }),
    icon: (isNull) => ({
        tinColor: isNull ? 'red' : colors.veryLightPinkTwo, ...nstyles.nIcon17
    }),
    txtImage: (isNull) => ({
        color: isNull ? 'red' : null
    }),
})
export default ComponentSubmit
