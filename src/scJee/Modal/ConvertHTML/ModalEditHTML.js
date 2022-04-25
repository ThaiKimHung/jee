import React, { useState } from 'react';
import {
    SafeAreaView,
    View,
    StatusBar,
    Button,
    Text,
    Alert,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Image
} from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper';
import Utils from '../../../app/Utils';
import HeaderComStackV2 from '../../../components/HeaderComStackV2';
import { Images } from '../../../images';
import { colors } from '../../../styles';
import { reText } from '../../../styles/size';
import { Height, Width } from '../../../styles/styles';
import { RichEditor } from './rich-editor';

const ModalEditHTML = (props) => {

    const callback = Utils.ngetParam({ props: props }, "callback", () => { });
    const initialHtml = Utils.ngetParam({ props: props }, "content", "");
    const initialPlaceholder = 'Nhập nội dung ...';
    const [richEditorApi, setRichEditorApi] = useState({
        getHtml: () => { },
        setHtml: () => { },
        bold: () => { },
        italic: () => { },
        underline: () => { }

    })
    const setDate = () => {
        if (typeof richEditorApi !== 'undefined') {
            richEditorApi.setHtml(
                `<i>Current date:</i> <b>${new Date().toISOString()}</b>`,
            );
        }
    };
    const readHtml = async () => {
        if (typeof richEditorApi !== 'undefined') {
            const html = await richEditorApi.getHtml();
            callback(html);
            Utils.goback({ props: props });
            // Alert.alert(html);
        }
    };
    const bold = () => {
        if (typeof richEditorApi !== 'undefined') {
            richEditorApi.bold();
        }
    };
    const italic = () => {
        if (typeof richEditorApi !== 'undefined') {
            richEditorApi.italic();
        }
    };
    const underline = () => {
        if (typeof richEditorApi !== 'undefined') {
            richEditorApi.underline();
        }
    };
    // Utils.nlog("initialHtml:", initialHtml)
    return (
        <View style={{ flex: 1, backgroundColor: 'white', }}>
            <HeaderComStackV2
                title={'Nhập nội dung'}
                iconLeft={Images.ImageJee.icGoBack}
                onPressLeft={() => Utils.goback({ props: props })}
            // iconRight={Images.ImageJee.icSave}
            // onPressRight={() => this._callback()}
            // styIconRight={{ width: Width(5), height: Width(5), tintColor: colors.black_70 }}
            />
            {/* <Text style={{ backgroundColor: colors.BackgroundHome, fontSize: reText(12), paddingHorizontal: 15, paddingVertical: 10, fontWeight: 'bold', color: colors.colorBlueLight }}>Phủ khối để định dạng nội dung</Text> */}
            <View
                style={{
                    flexDirection: 'row', backgroundColor: colors.black_20_2, paddingHorizontal: 10, paddingVertical: 5
                }}
            >
                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity
                        style={{ padding: 10, flexDirection: 'row', backgroundColor: colors.white, borderRadius: 5, marginRight: 5 }}
                        onPress={() => bold()}>
                        <Image source={Images.ImageJee.icInDam} style={{ width: Width(5), height: Width(5) }} />
                    </TouchableOpacity>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity style={{ padding: 10, flexDirection: 'row', backgroundColor: colors.white, borderRadius: 5, marginRight: 5 }} onPress={() => italic()}>
                        <Image source={Images.ImageJee.icInNghien} style={{ width: Width(5), height: Width(5) }} />
                    </TouchableOpacity>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity style={{ padding: 10, flexDirection: 'row', backgroundColor: colors.white, borderRadius: 5, marginRight: 5 }} onPress={() => underline()}>
                        <Image source={Images.ImageJee.icGachChan} style={{ width: Width(5), height: Width(5) }} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.container}>
                <ScrollView contentContainerStyle={{ height: Height(1000) }} >
                    <RichEditor
                        initialHtml={initialHtml ? initialHtml : ''}
                        initialPlaceholder={initialPlaceholder}
                        onInitialized={(api) => {
                            setRichEditorApi(api);
                        }}
                    >
                    </RichEditor>

                    {/* <TouchableOpacity onPress={readHtml} style={{
                        paddingHorizontal: 15,
                        paddingVertical: 10,
                        backgroundColor: 'red',
                    }}>
                        <Text style={{}}>{'Lưu'}</Text>
                    </TouchableOpacity> */}
                </ScrollView>
                <TouchableOpacity onPress={readHtml} activeOpacity={0.5} style={{ marginBottom: isIphoneX() ? 25 : 5, padding: 10, alignItems: 'center', backgroundColor: colors.colorTabActive, marginHorizontal: 10 }}>
                    <Text style={{ color: colors.white, fontWeight: 'bold', fontSize: reText(14) }}>{'Xong'}</Text>
                </TouchableOpacity>
            </View>
        </View >
    );
};


const styles = {
    ...StyleSheet.create({
        container: { flex: 1 },
        row: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            paddingBottom: 36,
        },
        bold: { fontWeight: 'bold' },
        italic: { fontStyle: 'italic' },
        underline: { textDecorationLine: 'underline' },
    }),
};


export default ModalEditHTML;
