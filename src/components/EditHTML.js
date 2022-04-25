import React, { Component } from 'react'
import { BackHandler, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, Platform, Keyboard } from 'react-native'
import * as Animatable from 'react-native-animatable'
import { actions, RichEditor, RichToolbar } from '../components/Pell_Rich_Editor/src'
import Utils from '../app/Utils'
import { Images } from '../images'
import { colors } from '../styles'
import HeaderComStackV2 from './HeaderComStackV2'
import Voice from '@react-native-community/voice';
import LottieView from 'lottie-react-native';
import { check, request, PERMISSIONS } from 'react-native-permissions';
import UtilsApp from '../app/UtilsApp';
import { Height, nstyles, Width, paddingBotX, nHeight, nWidth } from '../styles/styles';
import ActionSheet from '@alessiocancian/react-native-actionsheet';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export class EditHTML extends Component {
    constructor(props) {
        super(props)
        this.content = Utils.ngetParam(this, 'content', ' ') //html truyền vào
        this.callback = Utils.ngetParam(this, 'callback')
        this.title = Utils.ngetParam(this, 'title') ?? 'Chỉnh sửa văn bản'
        this.isEdit = Utils.ngetParam(this, 'isEdit') //true: chỉnh sửa, false: ko chỉnh sửa
        this.isVoice = Utils.ngetParam(this, 'isVoice', true) // true: bật voice, false : tắt voice
        this.ActionSheet = React.createRef()
        this.state = {
            html: this.content,
            isInsertLink: false,
            isLoading: false,
            voice: '',
            lengthText: 0,
        }
        // code voice
        Voice.onSpeechEnd = this.onSpeechEndHandler.bind(this);
        Voice.onSpeechResults = this.onSpeechResultsHandler.bind(this);
        Voice.onSpeechError = this.onSpeechError.bind(this);
        this.newContent = '';
        this.oldContent = '';
    }
    componentDidMount() {
        this.setState({ lengthText: this.state.html.length })
        this._handlerBack = BackHandler.addEventListener('hardwareBackPress', this._handlerBackButton)
    }
    _handlerBackButton = () => {
        this._goback()
        return true
    }
    _goback = () => {
        if (this.state.html.length != this.state.lengthText) {
            this.ActionSheet.show()
        } else {
            Utils.goback(this)
        }
    }
    _save = () => {
        this.callback(this.state.html)
        Utils.goback(this)
    }
    _onChange = (value) => {
        this.setState({ html: value })
    }
    _showInsertLink = () => {
        this.setState({ isInsertLink: !this.state.isInsertLink })
    }

    onSpeechError = async (e) => { // sự kiện khi không thu âm được giọng nói
        const result = await check(PERMISSIONS.ANDROID.RECORD_AUDIO);
        if (e.error.message === '9/Insufficient permissions' && result === 'granted') { // Trường hợp quyền mircophone bị tắt dưới app Google
            Utils.showMsgBoxYesNo(this, 'Thông báo', 'Bạn cần cấp quyền nhận dạng giọng nói Google để sử dụng chức năng này.', 'Đến cài đặt', 'Đóng', () => { OpenSetting.openSetting('com.google.android.googlequicksearchbox') });
        }
    }

    onSpeechEndHandler = (e) => { // sự kiện lắng nghe khi  ngừng nói
        const { isLoading } = this.state
        if (isLoading)
            this.setState({ isLoading: false })
    }

    stringToHTML = (str) => {
        var dom = document.createElement('div');
        dom.innerHTML = str;
        return dom;
    };

    componentWillUnmount = () => {
        Voice.destroy().then(Voice.removeAllListeners);
    }
    onSpeechResultsHandler = async (e) => { // sự kiện lắng nghe khi ngừng nói và xuất ra dữ liệu
        const { isLoading, html } = this.state;
        let text = e.value[0]
        this.newContent = text;
        if (Platform.OS == 'ios') {
            if (this.oldContent === '') {
                this.setState({ html: this.oldContent + ' ' + this.newContent.toLocaleLowerCase() })
            } else {
                this.setState({ html: this.oldContent + ' ' + this.newContent })
            }
        }
        else {
            if (this.oldContent === '') {
                let txtNew = this.newContent.slice(0, 1).toUpperCase() + this.newContent.slice(1).toLowerCase();
                this.setState({ html: this.oldContent + ' ' + txtNew })
            }
            else {
                let txtNew = this.oldContent + ' ' + this.newContent.toLowerCase()
                this.setState({ html: txtNew });
            }
        }
        await this?.richtext?.setContentHTML(this.state.html)

    }

    startRecording = async () => {
        Keyboard.dismiss()
        this.setState({ isLoading: true });
        await UtilsApp.StartVoice(this, false, 'html');
        // Utils.nlog('startRecording html', this.state.html)

    }
    stopRecording = async () => {
        this.setState({ isLoading: false });
        // await this._changVoice()
        await UtilsApp.StartVoice(this, true, 'html');
        // setTimeout(() => {
        //     this._changVoice()
        // }, Platform.OS == 'ios' ? 1000 : 100)
    }

    handlePressF = async (indexAt) => {
        if (indexAt == 1) {
            this._save()
        }
        if (indexAt == 2) {
            Utils.goback(this)
        }
        else null

    }
    render() {
        const { isInsertLink, isLoading } = this.state
        return (
            <View style={nstyles.ncontainer}>
                <HeaderComStackV2
                    title={this.title}

                    iconRight={Images.ImageJee.icSave}
                    styIconRight={{ ...nstyles.nIcon20 }}
                    onPressRight={this._save}

                    iconLeft={Images.ImageJee.icGoBack}
                    styIconLeft={{ tintColor: 'black' }}
                    onPressLeft={this._goback}>
                </HeaderComStackV2>
                <RichToolbar
                    actions={arrListIcon.concat([
                        // 'actionCustom', //iconCustom
                    ])}
                    iconMap={{
                        actionCustom: Images.icClose,
                    }}
                    // ref={this.richtext2}
                    // onInsertLink={this._showInsertLink}
                    // onPressAddImage={() => alert(2)}
                    // actionCustom={() => alert(3)} //tên trùng với iconMap                
                    style={{ marginVertical: 2 }}
                    iconTint={'#404040'}
                    unselectedButtonStyle={{ backgroundColor: 'white' }}
                    selectedButtonStyle={{ backgroundColor: colors.colorLineGray }}
                    selectedIconTint={colors.blueColor}
                    // renderAction={true}
                    disabled={!this.isEdit}
                    disabledIconTint={'gray'}
                    // disabledButtonStyle={{ backgroundColor: 'red' }}
                    getEditor={() => this.richtext}
                ></RichToolbar>
                <KeyboardAwareScrollView style={{ backgroundColor: colors.black_5, flex: 1, }}>
                    <RichEditor
                        useContainer={true}
                        initialContentHTML={this.state.html}
                        onChange={(value) => this._onChange(value)}
                        // initialHeight={50}
                        // placeholder={'123'}
                        disabled={!this.isEdit}
                        ref={(ref) => this.richtext = ref}
                        // onMessage={() => alert(5)}
                        // editorInitializedCallback={() => alert(5)}
                        initialFocus={(this.isVoice || Platform.OS == 'android') ? false : true} //Bật bàn phím lên
                    />
                </KeyboardAwareScrollView>
                {
                    this.isVoice ? (
                        <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', paddingBottom: paddingBotX, backgroundColor: colors.white }}>
                            {isLoading ? <LottieView source={require('../images/lottieJee/voice.json')} autoPlay loop style={{ height: Height(12) / 1.5, alignItems: 'center', justifyContent: 'center' }} /> : null}
                            <TouchableOpacity
                                onPressIn={this.startRecording}
                                onPressOut={this.stopRecording}
                                style={{ paddingVertical: 10, flexDirection: 'row', }}
                            >
                                <Image
                                    source={Images.ImageJee.icMicro}
                                    style={nstyles.nIcon32}
                                />
                            </TouchableOpacity>
                            {isLoading ? <LottieView source={require('../images/lottieJee/voice.json')} autoPlay loop style={{ height: Height(12) / 1.5, alignItems: 'center', justifyContent: 'center' }} /> : null}
                        </View>
                    ) : null
                }
                <Modal
                    animationType='fade'
                    visible={isInsertLink}
                    transparent={true}>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, right: 0 }} onTouchEnd={this._showInsertLink}></View>
                        <Animatable.View
                            style={{
                                width: nWidth(80), height: 150, backgroundColor: 'white', borderRadius: 15, padding: 15,
                                elevation: 3, shadowOffset: { width: 3, height: 3 }, shadowColor: 'black', shadowOpacity: 0.8, shadowRadius: 3,
                            }}
                            animation={'zoomIn'}
                            duration={500}
                            useNativeDriver={true}>
                            <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 10 }}>link: </Text>
                            <TextInput style={{ padding: 0, paddingHorizontal: 10, flexWrap: 1, borderWidth: 1, borderRadius: 5, height: 40 }}></TextInput>
                            <TouchableOpacity
                                style={{
                                    alignItems: 'center', justifyContent: 'center', backgroundColor: 'blue', borderRadius: 5, width: '35%', height: 35,
                                    alignSelf: 'center', bottom: 10, position: 'absolute'
                                }} >
                                <Text style={{ fontSize: 16, fontWeight: '500', color: 'white' }}>Save</Text>
                            </TouchableOpacity>
                        </Animatable.View>
                    </View>
                </Modal>
                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    options={[
                        'Huỷ',
                        'Lưu thay đổi',
                        'Bỏ các thay đổi',
                    ]}
                    cancelButtonIndex={0}
                    destructiveButtonIndex={2}
                    onPress={this.handlePressF}
                />
            </View >
        )
    }
}
const styles = StyleSheet.create({
    main: {
        flex: 1, paddingBottom: 1, alignItems: 'stretch', marginTop: 5
    },
    toolbarButton: {
        fontSize: 20,
        width: 28,
        height: 28,
        textAlign: 'center'
    },
    italicButton: {
        fontStyle: 'italic'
    },
    boldButton: {
        fontWeight: 'bold'
    },
    underlineButton: {
        textDecorationLine: 'underline'
    },
    lineThroughButton: {
        textDecorationLine: 'line-through'
    },
});
const arrListIcon = [
    // actions.content,
    // actions.updateHeight,
    actions.keyboard,
    actions.undo,
    actions.redo,
    actions.setBold,
    actions.setItalic,
    actions.setUnderline,
    actions.insertBulletsList,
    actions.insertOrderedList,
    actions.indent,
    actions.outdent,
    // actions.checkboxList,
    // actions.setStrikethrough,
    actions.alignLeft,
    actions.alignCenter,
    actions.alignRight,
    actions.alignFull,

    actions.line,
    // actions.heading1,
    // actions.heading2,
    // actions.heading3,
    // actions.heading4,
    // actions.heading5,
    // actions.heading6,
    // actions.insertLine,
    // actions.setParagraph,
    actions.removeFormat,
    actions.insertLink,
    // actions.insertText,
    // actions.insertHTML,
    // actions.insertImage,
    // actions.insertVideo,
    // actions.fontSize,
    // actions.fontName,
    // actions.setSubscript,
    // actions.setSuperscript,
    // actions.setHR,

    // actions.undo,
    // actions.redo,
    // actions.code,
    // actions.table,
    // actions.foreColor,
    // actions.hiliteColor,
    // actions.blockquote,
    // actions.setTitlePlaceholder,
    // actions.setContentPlaceholder,
    // actions.setTitleFocusHandler,
    // actions.setContentFocusHandler,
    // actions.prepareInsert,
    // actions.restoreSelection,
    // actions.setCustomCSS,
    // actions.setTextColor,
    // actions.setBackgroundColor,
    // actions.init,
    // actions.setEditorHeight,
    // actions.setFooterHeight,
    // actions.setPlatform,
]
export default EditHTML
