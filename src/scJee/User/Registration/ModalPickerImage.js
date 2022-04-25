

import React, { useEffect, useRef } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Height, Width } from '../../../styles/styles'
import ActionSheet from "react-native-actions-sheet";
import { reText } from '../../../styles/size';
import ButtonCom from '../../../components/Button/ButtonCom';

const styles = StyleSheet.create({
    styleBtn: {
        width: Width(90), marginTop: 30,
        height: Width(10),
        alignItems: "center", justifyContent: "center", alignSelf: "center",
        backgroundColor: "#00B471",
    }
})

const ModalPickerImage = (props) => {
    const { onOpeCamera = () => { }, onOpenLibrary = () => { }, onPenModal = () => { }, SetIsVisible, isVisible = false } = props
    useEffect(() => {
        if (isVisible) {
            ref.current?.show();
        }
        else {
            ref.current?.hide();
        }
    }, [isVisible])
    const ref = useRef(null)
    return (
        <ActionSheet
            ref={ref}
            onClose={() => {
                SetIsVisible(false)
            }}
            closeOnTouchBackdrop
            delayActionSheetDraw={false}
            delayActionSheetDrawTime={0}
        >
            <View style={{ height: Height(40), paddingVertical: 20, paddingHorizontal: 20 }}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: reText(24) }} >{'Upload Photo'}</Text>
                    <View style={{ paddingVertical: 4 }} />
                    <Text>{'Choose Your Photos Pictures'}</Text>
                </View>
                <ButtonCom
                    text={'Take Photo'}
                    backgroundColor1={'gray'}
                    style={{ ...styles.styleBtn, backgroundColor1: 'gray' }}
                    onPress={onOpeCamera}
                />
                <ButtonCom
                    text={'Choose from the library'}
                    backgroundColor1={'gray'}
                    style={{ ...styles.styleBtn, backgroundColor1: 'gray' }}
                    onPress={onOpenLibrary}
                />
                <ButtonCom
                    text={'Cancel'}
                    backgroundColor1={'gray'}
                    style={{ ...styles.styleBtn, backgroundColor1: 'gray' }}
                    onPress={() => {
                        ref.current?.hide();
                        SetIsVisible(false)
                    }}
                />
            </View>
        </ActionSheet>
    )
}

export default ModalPickerImage


