
import React, { useState, useRef, useEffect } from 'react'
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, Image, TextInput, ScrollView, Platform, SafeAreaView, Keyboard } from 'react-native'
import { RootLang } from '../../../app/data/locales'
import Utils from '../../../app/Utils'
import { Images } from '../../../images'
import { colors, fonts } from '../../../styles'
import { useNavigation } from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';
import { Controller, useForm } from 'react-hook-form';
import { Width, nstyles, Height } from '../../../styles/styles'
import { reText, sizes } from '../../../styles/size'
import DatePicker from 'react-native-datepicker';
import ButtonCom from '../../../components/Button/ButtonCom';
import { yupResolver } from '@hookform/resolvers/yup';
import { ResValidate } from './validation'
import { useSelector } from 'react-redux';
import RNFS from 'react-native-fs';
import * as Animatable from 'react-native-animatable';
import ActionSheet from "react-native-actions-sheet";
import { nkey } from "../../../app/keys/keyStore";
import { LoginJee, RegisterJee, CheckToken } from "../../../apis/JeePlatform/apiUser";
import { isIphoneX } from 'react-native-iphone-x-helper'
import UtilsApp from '../../../app/UtilsApp'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    styleAvarTar: {
        alignSelf: 'center',
        width: Width(30),
        height: Width(30),
        backgroundColor: colors.white,
        borderRadius: 100,
    },
    imgAvatar: {
        alignSelf: 'center',
        width: Width(30),
        height: Width(30),
    },
    txtInput: {
        color: colors.redStar,
    },
    styleInput: {
        fontSize: reText(16),
        fontFamily: fonts.Helvetica,
        paddingVertical: 10,
        paddingHorizontal: 10,
        flex: 1,
    },
    styleBtn: {
        width: Width(85),
        height: Width(10),
        alignItems: "center", justifyContent: "center", alignSelf: "center",
        backgroundColor: "#00B471",
    }
})
const dataForm = [
    {
        name: 'Fullname',
        placeholder: RootLang.lang.thongbaochung.hoten,
        keyboardType: 'default',
        img: Images.icName,

    },
    {
        name: 'Email',
        placeholder: RootLang.lang.thongbaochung.email,
        keyboardType: 'email-address',
        img: Images.icGmail,
    },
    {
        name: 'Username',
        placeholder: RootLang.lang.thongbaochung.taikhoan,
        keyboardType: 'default',
        img: Images.icUser,

    },
    {
        name: 'Password',
        placeholder: RootLang.lang.thongbaochung.matkhau,
        keyboardType: 'default',
        img: Images.icPasswords,

    },
    {
        name: 'PasswordConfirm',
        placeholder: RootLang.lang.thongbaochung.xacnhanmatkhau,
        keyboardType: 'default',
        img: Images.icPasswords,
    },
    {
        name: 'Phonemumber',
        placeholder: RootLang.lang.thongbaochung.sodienthoai,
        keyboardType: 'phone-pad',
        img: Images.icPhone,

    },
]
const Registration = (props) => {
    const [pathAvatar, setPathAvatar] = useState(null)
    const [showPassword, setShowPassword] = useState(false)
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
    const [date, setDate] = useState(null)
    const navigation = useNavigation();
    const datePickerRef = useRef(null)
    const ActionSheetRef = useRef(null)
    const lang = useSelector(state => state.changeLanguage.language)
    // const [isVisible, setIsVisible] = useState(false)  
    // const data = useMemo(() => [  // tối ưu Performance
    //     {
    //         name: 'Fullname',
    //         placeholder: 'Full Name',
    //         keyboardType: 'default',
    //         img: Images.icName,

    //     },
    //     {
    //         name: 'Email',
    //         placeholder: 'Email',
    //         keyboardType: 'email-address',
    //         img: Images.icGmail,
    //     },
    //     {
    //         name: 'Username',
    //         placeholder: 'User Name',
    //         keyboardType: 'default',
    //         img: Images.icUser,

    //     },
    //     {
    //         name: 'Password',
    //         placeholder: 'Password',
    //         keyboardType: 'default',
    //         img: Images.icPasswords,

    //     },
    //     {
    //         name: 'PasswordConfirm',
    //         placeholder: 'Password Confirm',
    //         keyboardType: 'default',
    //         img: Images.icPasswords,
    //     },
    //     {
    //         name: 'Phonemumber',
    //         placeholder: 'Phone',
    //         keyboardType: 'phone-pad',
    //         img: Images.icPhone,

    //     },
    // ], [])
    const _goBack = () => {
        return navigation.goBack();
    }
    const _OnImagePicker = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true,
            compressImageQuality: Platform.OS === 'ios' ? 0.8 : 1,// ios 0.8 sẽ giảm mb file ảnh
            cropperToolbarTitle: 'Chỉnh sửa ảnh',
            freeStyleCropEnabled: true, // cho phép sử dụng khung lưới cắt ảnh
        }).then(image => {
            setPathAvatar(image.path)
            ActionSheetRef?.current.hide();
        }).catch(err => {
            ActionSheetRef?.current.hide();
        });
    }
    const _OpenCamera = () => {
        ImagePicker.openCamera({
            width: 300,
            height: 400,
            cropping: true,
            useFrontCamera: true,
            compressImageQuality: Platform.OS === 'ios' ? 0.8 : 1,
            cropperToolbarTitle: 'Chỉnh sửa ảnh',
            freeStyleCropEnabled: true,
        }).then(image => {
            setPathAvatar(image.path)
            ActionSheetRef?.current.hide();
        }).catch(err => {
            ActionSheetRef?.current.hide();
        });
    }
    const _Base64 = () => {
        if (pathAvatar != null) {
            RNFS.readFile(pathAvatar, 'base64')
                .then(res => {
                    return res.toString();
                });
        }
    }
    const _onSubmit = async (val) => {
        setDate(null)
        reset();
        let username = 'congtytest.admin'
        let password = '123456'
        await LoginJee(username, password).then(async (res) => {
            if (res.status === 1) {
                // data api dang ki
                const data = {
                    Fullname: val.Fullname,
                    ImageAvatar: _Base64(),
                    Email: val.Email,
                    Username: val.Username,
                    Jobtitle: 'Developer',
                    JobtitleID: 1,
                    DepartmemtID: 14,
                    Departmemt: 'Phòng kỹ thuật',
                    Phonemumber: val.Phonemumber,
                    Password: val.Password,
                    AppCode: [
                        "LANDING",
                        "SOCIAL",
                        "ADMIN",
                        "REQUEST",
                        "WORK",
                        "WORKFLOW",
                        "OFFICE",
                        "DOC",
                        "ASSET",
                        "ACC",
                        "WMS",
                        "TEST",
                        "FLOW",
                        "CHAT",
                        "MEETING"
                    ],
                    AppID: [
                        3,
                        15,
                        2,
                        4,
                        8,
                        5,
                        7,
                        6,
                        11,
                        12,
                        9,
                        10,
                        16,
                        17,
                        18
                    ],
                    Birthday: val.Birthday
                }
                await Utils.nsetStorage(nkey.access_token, res.access_token)
                let temp0 = await CheckToken()
                await Utils.nsetStorage(nkey.access_token, temp0.access_token)
                let temp = await RegisterJee(data)
                if (temp.statusCode == 1) {
                    UtilsApp.MessageShow('Tạo tài khoản thành công!', 'Thông báo', 1)
                    Utils.replace({ props: props }, 'sc_login')
                }
                else
                    UtilsApp.MessageShow('Tạo tài khoản thất bại!', 'Thông báo', 4)
            }
        }
        )
    }
    const { control, reset, handleSubmit, setValue, setFocus, formState: { errors } } = useForm({
        resolver: yupResolver(ResValidate)
    });
    return (
        <ImageBackground style={styles.container} source={Images.ImageJee.backgroundLogin} >

            <TouchableOpacity style={{ paddingHorizontal: 20, width: Width(20), marginTop: isIphoneX() ? 35 : 10 }} onPress={_goBack} >
                <Image source={Images.ImageJee.icBack} style={{ width: Width(5), height: Width(7), tintColor: colors.white }} />
            </TouchableOpacity>


            <KeyboardAwareScrollView onTouchStart={Keyboard.dismiss}>
                <TouchableOpacity style={{
                    paddingVertical: 10, width: Width(40), height: Width(32), alignSelf: 'center'
                }} onPress={() => {
                    // setIsVisible(true)
                    ActionSheetRef.current?.show();
                }}>
                    {pathAvatar === null ? <View style={styles.styleAvarTar}>
                        <TouchableOpacity style={{ position: 'absolute', top: 65, left: 90, right: 0, bottom: 0 }}
                            onPress={() => {
                                // setIsVisible(true)
                                ActionSheetRef.current?.show();
                            }}
                        >
                            <Image source={Images.icCameras} resizeMode={'contain'} style={nstyles.nIcon40} />
                        </TouchableOpacity>
                    </View> :
                        <Image source={{ uri: pathAvatar }} style={styles.imgAvatar} resizeMode={'cover'} borderRadius={120} />
                    }
                </TouchableOpacity>
                <Animatable.View animation={'fadeInUpBig'} duration={3000} style={{ flex: 1, paddingVertical: 8, paddingHorizontal: 15 }}>
                    <View style={{ backgroundColor: colors.white, paddingHorizontal: 10, paddingVertical: 10, borderRadius: 15 }}  >
                        {dataForm.map((item, index, arr) => {
                            return (
                                <View key={index} style={{ paddingVertical: 5 }}>
                                    <View style={{ paddingHorizontal: 20, borderBottomWidth: 0.4, borderColor: colors.colorGrayLight, borderRadius: 8 }} >
                                        <Controller
                                            key={index.toString()}
                                            name={item.name}
                                            control={control}
                                            render={({
                                                field: { onChange, onBlur, value, ref },
                                            }) => (
                                                <View>
                                                    <Text style={{ fontSize: reText(18), color: colors.colorGrayLight }}>{item.placeholder}</Text>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                        <Image source={item.img} style={{ ...index === 0 ? nstyles.nIcon28 : nstyles.nIcon20, resizeMode: 'contain' }} />
                                                        <TextInput
                                                            style={styles.styleInput}
                                                            autoCapitalize={'none'}
                                                            ref={ref}
                                                            value={value}
                                                            onChangeText={onChange}
                                                            onBlur={onBlur}
                                                            autoCorrect={false}
                                                            autoFocus={false}
                                                            keyboardType={item.keyboardType}
                                                            secureTextEntry={item.name === 'Password' && !showPassword ? true : item.name === 'PasswordConfirm' && !showPasswordConfirm ? true : false}
                                                            onSubmitEditing={() => {
                                                                if (index >= dataForm.length - 1) {
                                                                    return;
                                                                }
                                                                else {
                                                                    setFocus(arr[index + 1].name)
                                                                }
                                                            }}
                                                            underlineColorAndroid={'transparent'}
                                                        />
                                                        {item.name === 'Password' ? <TouchableOpacity
                                                            style={{ paddingHorizontal: 10 }}
                                                            activeOpacity={0.5}
                                                            onPress={() => setShowPassword(!showPassword)}
                                                        >
                                                            <Image
                                                                source={showPassword === true ? Images.JeehrShowpass : Images.JeehrHidepass} style={{ tintColor: colors.black }} />
                                                        </TouchableOpacity> : null}
                                                        {item.name === 'PasswordConfirm' ? <TouchableOpacity
                                                            style={{ paddingHorizontal: 10 }}
                                                            activeOpacity={0.5}
                                                            onPress={() => setShowPasswordConfirm(!showPasswordConfirm)}
                                                        >
                                                            <Image
                                                                source={showPasswordConfirm === true ? Images.JeehrShowpass : Images.JeehrHidepass} style={{ tintColor: colors.black }} />
                                                        </TouchableOpacity> : null}
                                                    </View>

                                                </View>
                                            )}
                                        />
                                    </View>
                                    {errors.Username?.message && item.name === "Username" ?
                                        <View style={{ paddingVertical: 5, paddingHorizontal: 20 }}>
                                            <Text style={styles.txtInput}>{errors.Username.message}</Text>
                                        </View> : null}
                                    {errors.Email?.message && item.name === "Email" ?
                                        <View style={{ paddingVertical: 5, paddingHorizontal: 20 }}>
                                            <Text style={styles.txtInput} >{errors.Email.message}</Text>
                                        </View> : null}
                                    {errors.Password?.message && item.name === "Password" ?
                                        <View style={{ paddingVertical: 4, paddingHorizontal: 20 }}>
                                            <Text style={styles.txtInput} >{errors.Password.message}</Text>
                                        </View> : null}
                                    {errors.PasswordConfirm?.message && item.name === "PasswordConfirm" ?
                                        <View style={{ paddingVertical: 4, paddingHorizontal: 20 }}>
                                            <Text style={styles.txtInput}>{errors.PasswordConfirm.message}</Text>
                                        </View> : null}
                                    {errors.Phonemumber?.message && item.name === "Phonemumber" ?
                                        <View style={{ paddingVertical: 4, paddingHorizontal: 20 }}>
                                            <Text style={styles.txtInput} >{errors.Phonemumber.message}</Text>
                                        </View> : null}
                                </View>
                            )
                        })}
                        <Text style={{ marginLeft: 19, fontSize: reText(17), color: colors.black_70 }}>{RootLang.lang.thongbaochung.ngaysinh}</Text>
                        <TouchableOpacity onPress={() => datePickerRef.current.onPressDate()}>
                            <View >
                                <Controller
                                    name={'Birthday'}
                                    control={control}
                                    render={({
                                        field: { value },
                                    }) => (
                                        <View>
                                            <View style={{ flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 10 }}>

                                                <DatePicker
                                                    showIcon={false}
                                                    hideText={true}
                                                    ref={datePickerRef}
                                                    locale={lang === 'en' ? 'en' : 'vi'}
                                                    date={value}
                                                    mode="date"
                                                    format="DD/MM/YYYY"
                                                    confirmBtnText={RootLang.lang.scQuanLyNhanVien.xacnhan} // hoạt động trên ios
                                                    cancelBtnText={RootLang.lang.scQuanLyNhanVien.huy} // hoạt động trên ios
                                                    androidMode={'calendar'}
                                                    showIcon={true}
                                                    style={{ ...nstyles.nIcon22, marginLeft: 10, marginTop: -10 }}
                                                    onDateChange={(date) => { setDate(date), setValue('Birthday', date) }}
                                                ></DatePicker>
                                                <View style={{ paddingHorizontal: 6 }}></View>

                                                <Text
                                                    style={{ flex: 1, paddingVertical: 5, paddingVertical: 2, borderBottomWidth: 0.4, borderColor: colors.black_50, fontSize: reText(15) }}
                                                    value={date}
                                                >{value}
                                                </Text>
                                            </View>
                                            <View style={{ borderWidth: 0.5, width: Width(85), alignSelf: 'center', borderColor: colors.grayLineLight, marginTop: date ? 0 : 5 }}></View>
                                        </View>
                                    )}
                                >
                                </Controller>
                            </View>
                        </TouchableOpacity>
                        <View style={{ paddingVertical: 10 }}>
                            <ButtonCom
                                text={RootLang.lang.sclogin.dangky}
                                backgroundColor1={'gray'}
                                style={{ ...styles.styleBtn, backgroundColor1: 'gray' }}
                                onPress={handleSubmit(_onSubmit)}
                            />
                        </View>
                    </View>
                </Animatable.View>
                <View style={{ paddingVertical: 30 }}></View>
                <ActionSheet ref={ActionSheetRef}
                    delayActionSheetDraw={false}
                    delayActionSheetDrawTime={0}
                >
                    <View style={{ height: Height(35), paddingVertical: 20, paddingHorizontal: 20 }}>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: reText(24) }} >{RootLang.lang.thongbaochung.taianhlen}</Text>
                            <View style={{ paddingVertical: 4 }} />
                            <Text>{RootLang.lang.thongbaochung.chonanhcuaban} :</Text>
                        </View>
                        <View style={{ paddingVertical: 15 }}>
                            <ButtonCom
                                text={RootLang.lang.thongbaochung.chupanh}
                                backgroundColor1={'gray'}
                                style={{ ...styles.styleBtn, backgroundColor1: 'gray' }}
                                onPress={_OpenCamera}
                            />
                        </View>
                        <View style={{ paddingVertical: 15 }}>
                            <ButtonCom
                                text={RootLang.lang.thongbaochung.chontuthuvien}
                                backgroundColor1={'gray'}
                                style={{ ...styles.styleBtn, backgroundColor1: 'gray' }}
                                onPress={_OnImagePicker}
                            />
                        </View>
                        <View style={{ paddingVertical: 15 }}>
                            <ButtonCom
                                text={RootLang.lang.thongbaochung.huy}
                                backgroundColor1={'gray'}
                                style={{ ...styles.styleBtn, backgroundColor1: 'gray' }}
                                onPress={() => { ActionSheetRef.current?.hide(); }}
                            />
                        </View>
                    </View>
                </ActionSheet>
            </KeyboardAwareScrollView >
        </ImageBackground >
    )
}

export default Registration
