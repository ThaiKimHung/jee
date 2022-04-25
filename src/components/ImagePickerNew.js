import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { StyleSheet, Text, View, Image, TouchableHighlight, Animated, Easing, TouchableOpacity, Modal, Linking } from 'react-native'
import { colors, } from '../styles';
import DocumentPicker from 'react-native-document-picker';
import { Width } from '../styles/styles';
import { reText, reSize } from '../../src/styles/size'
import ImageViewer from 'react-native-image-zoom-viewer';
import VideoCus from '../Component_old/Video/VideoCus'
import { ImgComp } from '../images/ImagesComponent'
import Utils from '../app/Utils';

const dataMenu = [
    {
        id: 1,
        name: 'Photo',
        icon: ImgComp.icChoseImage
    },
    {
        id: 2,
        name: 'Video',
        icon: ImgComp.icChoseMedia
    },
    {
        id: 3,
        name: 'File',
        icon: ImgComp.icChoseFile
    }
]
const ImagePickerNew = forwardRef((props, ref) => {
    const [ShowSelect, setShowSelect] = useState(false)
    const [rotateValue, setRotateValue] = useState(new Animated.Value(0));
    const keyname = props.keyname ? props.keyname : 'uri'
    const [dataFile, setdataFile] = useState([]);
    const onDeleteFileOld = props.onDeleteFileOld ? props.onDeleteFileOld : (item) => { };
    const onAddFileNew = props.onAddFileNew ? props.onAddFileNew : () => { };
    const onUpdateDataOld = props.onUpdateDataOld ? props.onUpdateDataOld : (data) => { };
    const [NumberMax, setNumberMax] = useState(4)
    const [dataFileOld, setdataFileOld] = useState(props.data);
    const [indexHinhViewZoom, setIndexHinh] = useState(0);
    const [showFullImage, enableFullImage] = useState(false);
    const [showCloseImage, enableCloseImage] = useState(false);
    const [dataImageView, setdataImageView] = useState([])

    const { isPickOne = false } = props

    const [IsEdit, setIsEdit] = useState(props.isEdit == true ? true : false);

    const setData = (data) => {
        setdataFileOld(data)
        setNumberMax(8)
        setIndexHinh(0)
        enableFullImage(false)
        enableCloseImage(false)
        setdataImageView([])
        setdataFile([])
        // alert(1)
    }

    // Utils.nlog('props', props)
    useImperativeHandle(ref, () => ({
        refreshData: setData,
    }));
    useEffect(() => {
        setNumberMax(props.NumberMax)
    }, [props.NumberMax])
    useEffect(() => {
        setIsEdit(props.isEdit == true ? true : false)

    }, [props.isEdit])


    useEffect(() => {
        const { data } = props;
        // if (data.length != dataFile.length) {
        if (data && data.length > 0) {
            let datanew = data.map(item => {
                let typeItem = 3
                if (Utils.checkIsVideo(item[props.uniqueKey]) || Utils.checkIsVideo(item?.filename)) {
                    typeItem = 2
                } else if (Utils.checkIsImage(item[props.uniqueKey]) || Utils.checkIsImage(item?.filename) || item.timePlay == 0) {
                    typeItem = 1
                } else {
                    typeItem = 3
                }
                return { ...item, type: typeItem }
            })
            setdataFileOld(datanew)
        }
        // }

    }, [props.data.length])
    useEffect(() => {
        const { dataNew } = props;
        // if (data.length != dataFile.length) {
        if (dataNew && dataNew.length > 0) {
            let datanew = dataNew.map(item => {
                let typeItem = 3
                if (Utils.checkIsVideo(item[props.uniqueKey]) || Utils.checkIsVideo(item?.filename)) {
                    typeItem = 2
                } else if (Utils.checkIsImage(item[props.uniqueKey]) || Utils.checkIsImage(item?.filename) || item.timePlay == 0) {
                    typeItem = 1
                } else {
                    typeItem = 3
                }
                return { ...item, type: typeItem }
            })
            setdataFile([...dataFile, ...datanew]);
        }
        // }

    }, [props.dataNew.length])
    // dataNew

    useEffect(() => {
        if (dataFileOld.length > 0) {
            onUpdateDataOld(dataFileOld)
        } else {
            onUpdateDataOld([])
        }

    }, [dataFileOld])

    useEffect(() => {
        onAddFileNew(dataFile)
    }, [dataFile])

    function StartImageRotate() {
        rotateValue.setValue(0);

        Animated.timing(rotateValue, {
            toValue: 1,
            duration: 200,
            easing: Easing.linear,
        }).start();
    }
    const RotateData = rotateValue.interpolate({
        inputRange: [0, 1],
        outputRange: !ShowSelect ? ["0deg", "90deg"] : ["90deg", "0deg"],
    });

    const renderItem = (item, index) => {
        return (<TouchableHighlight key={item.id} underlayColor={colors.backgroundModal}
            onPress={() => requestCameraPermission(item.id)} style={{
                minHeight: 40,
                alignItems: 'center',
                justifyContent: 'center', flex: 1

            }}>
            <View style={{ flexDirection: 'row' }}>
                <Image resizeMode='contain'
                    source={item.icon}
                    style={{ width: 20, height: 20 }}></Image>
                <Text style={{ color: colors.coral, fontSize: reText(12), alignSelf: 'center', fontWeight: 'bold' }} > {item.name}</Text>
            </View>
        </TouchableHighlight>)
    }
    const removeFileNew = (index) => {
        if (dataFile.length > 1) {
            let dataFileNew = dataFile.map(item => {
                return item
            })
            dataFileNew.splice(index, 1);
            setdataFile(dataFileNew);
        } else {
            setdataFile([]);
        }


    }
    const removeFileOld = (item, index) => {
        if (item) {
            onDeleteFileOld(item);
        }
        if (dataFileOld.length > 1) {
            let dataFileNew = dataFileOld.map(item2 => {
                return item2
            })
            dataFileNew.splice(index, 1);
            setdataFileOld(dataFileNew);
        } else {
            setdataFileOld([]);
        }


    }
    const onPressItem = (item, index) => {
        switch (item.type) {
            case 1:
                // {
                //     let dataNew = dataFile.filter(item => item.type == 1).map(item => {
                //         return { ...item, url: item.uri }
                //     })
                //     let index = dataNew.findIndex(item2 => item2.uri == item.uri)
                //     setdataImageView(dataNew)
                //     setIndexHinh(index);
                //     enableFullImage(true);
                // }

                Utils.goscreen(props.nthis, 'Modal_ViewImageListShow_PAHT', { ListImages: [...dataFileOld, ...dataFile], index: dataFileOld.length + index });
                break;
            case 2:
                Utils.goscreen(props.nthis, 'Modal_PlayMedia', { source: item.uri });
                break;
            case 3:
                Utils.openUrl(item.uri)
                break;
            default:
                break;
        }
    }
    const onPressItemOld = (item, index) => {

        switch (item.type) {
            case 1:
                // {
                //     let dataNew = dataFileOld.filter(item => item.type == 1).map(item => {
                //         return { ...item, url: item[props.uniqueKey] }
                //     })

                //     let index = dataNew.findIndex(item2 => item2[props.keyname] == item[props.keyname])
                //     setdataImageView(dataNew)
                //     setIndexHinh(index);
                //     enableFullImage(true);
                // }
                Utils.goscreen(props.nthis, 'Modal_ShowListImage', { ListImages: [...dataFileOld, ...dataFile], index: index });
                break;
            case 2:
                Utils.goscreen(props.nthis, 'Modal_PlayMedia', { source: item[props.uniqueKey] });
                break;
            case 3:
                Utils.openUrl(item[props.uniqueKey])
                break;
            default:
                break;
        }
    }
    const renderImage = (item, index, type = 0) => {
        if (type == 0) {
            let typeItem = 3
            if (Utils.checkIsVideo(item[props.uniqueKey]) || Utils.checkIsVideo(item?.filename)) {
                typeItem = 2
            } else if (Utils.checkIsImage(item[props.uniqueKey]) || Utils.checkIsImage(item?.filename) || item.timePlay == 0) {
                typeItem = 1
            } else {
                typeItem = 3
            }

            return (<TouchableOpacity onPress={() => onPressItemOld(item, index)}
                key={index} style={{
                    width: Width(21), shadowColor: "#000",
                    height: Width(21),
                    shadowOffset: {
                        width: 0,
                        height: 0,
                    },
                    marginHorizontal: Width(1.3),
                    shadowOpacity: 0.25,
                    shadowRadius: 1,
                    elevation: 5, backgroundColor: 'white',
                    padding: 0, alignItems: 'center', borderRadius: 4, marginBottom: 5,
                }
                }>
                <View style={{ padding: typeItem == 3 ? 0 : 0, width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    {typeItem == 1 ?
                        <Image resizeMode={'cover'}
                            source={{ uri: item[props.uniqueKey] }}
                            style={{ width: '100%', height: '100%', borderRadius: 4 }} /> : null}
                    {typeItem == 2 ?
                        <VideoCus source={{ uri: item[props.uniqueKey] }}   // Can be a URL or a local file.
                            style={{ width: typeItem == 3 ? Width(12) : '100%', height: item.type == 3 ? Width(12) : '100%', borderRadius: 4 }}
                            resizeMode='cover'
                            paused={true} /> : null}
                    {/* {typeItem == 2 ?
                        <Image source={{ uri: item[props.uniqueKey] }}   // Can be a URL or a local file.
                            style={{ width: '100%', height: '100%', borderRadius: 4 }}
                            resizeMode='cover'
                        /> : null} */}
                    {typeItem == 3 ?
                        <Image resizeMode={'contain'}
                            source={ImgComp.icChoseFile}
                            style={{ width: Width(10), height: Width(10), borderRadius: 4 }} /> : null}
                    {typeItem == 2 ? <Image source={ImgComp.icVideoBlack} style={{ position: 'absolute', tintColor: colors.white }} /> : null}
                    {typeItem == 3 ?
                        <View style={{ flex: 1, paddingHorizontal: 10, position: 'absolute', bottom: 5 }}>
                            <Text style={{ fontSize: reText(10), color: colors.black_80 }} numberOfLines={1}>
                                {item[keyname] ? item[keyname] : item.name}</Text>
                        </View> : null}
                </View>


                {
                    IsEdit ?
                        <TouchableHighlight onPress={() => {
                            if (IsEdit == false) {

                            } else {
                                removeFileOld(item, index)
                            }


                        }} underlayColor={colors.backgroundModal} style={{
                            padding: 4, position: 'absolute', top: 0, right: 0, backgroundColor: colors.redDelete, borderRadius: 20

                        }}>
                            <Image resizeMode='contain'
                                source={ImgComp.icCloseWhite}
                                style={{
                                    width: 15,
                                    height: 15, tintColor: 'white',
                                }}></Image>
                        </TouchableHighlight>
                        : null
                }


            </TouchableOpacity >)
        } else {
            return (<TouchableOpacity onPress={() => onPressItem(item, index)}
                key={index} style={{
                    width: Width(21), shadowColor: "#000",
                    height: Width(21),
                    shadowOffset: {
                        width: 0,
                        height: 0,
                    },
                    shadowOpacity: 0.25,
                    marginHorizontal: Width(1.3),
                    shadowRadius: 1,
                    elevation: 5, backgroundColor: 'white',
                    padding: 0, alignItems: 'center', borderRadius: 4, marginBottom: 5
                }
                }>
                <View style={{ padding: item.type == 3 ? 0 : 0, width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    <Image resizeMode={item.type == 3 ? 'contain' : 'cover'}
                        source={item.type == 3 ? ImgComp.icChoseFile : { uri: item.uri }}
                        style={{ width: item.type == 3 ? Width(10) : '100%', height: item.type == 3 ? Width(10) : '100%', borderRadius: 4 }}></Image>
                    {item.type == 2 ? <Image source={ImgComp.icVideoBlack} style={{ position: 'absolute', tintColor: colors.white }} /> : null}
                    {item.type == 3 ?
                        <View style={{ flex: 1, paddingHorizontal: 10, position: 'absolute', bottom: 5 }}>
                            <Text style={{ fontSize: reText(10), color: colors.black_80 }} numberOfLines={1}>
                                {item.name}</Text>
                        </View> : null}
                </View>

                {
                    IsEdit ?
                        <TouchableHighlight onPress={() => {
                            // alert("" + IsEdit)
                            if (IsEdit == false) {

                            } else {
                                removeFileNew(index)
                            }
                        }} underlayColor={colors.backgroundModal} style={{
                            padding: 4, position: 'absolute', top: 0, right: 0, backgroundColor: colors.redDelete, borderRadius: 20


                        }}>
                            <Image resizeMode='contain'
                                source={ImgComp.icCloseWhite}
                                style={{
                                    width: 15,
                                    height: 15, tintColor: 'white',
                                }}></Image>
                        </TouchableHighlight> : null
                }


            </TouchableOpacity >)
        }

    }


    const response = (data, type) => {
        if (data && data.length >= 0) {
            if (dataFile.length + data.length > NumberMax) {
                Utils.showMsgBoxOK(this.nthis, "Thông báo", "Số file đã vượt quá số lượng cho phép,\n Vui lòng chọn lại", "Xác nhận");
                return;
            } else {
                switch (type) {
                    case 1:
                        {
                            let datanew = data.map(item => {
                                return { ...item, type: 1 }
                            })
                            setdataFile([...dataFile, ...datanew]);
                        }
                        break;
                    case 2:
                        {
                            let datanew = data.map(item => {
                                return { ...item, type: 2 }
                            })
                            setdataFile([...dataFile, ...datanew]);
                        }
                        break;
                    case 3:
                        {
                            setdataFile([...dataFile, ...data]);
                        }
                        break;
                    default:
                        break;
                }
            }
        } else {

        }
    }
    const requestCameraPermission = async (type) => {
        // Utils.nlog('type', type)
        switch (type) {
            case 1: {
                let options = {
                    assetType: 'Photos',//All,Videos,Photos - default
                    multi: true,// chọn 1 or nhiều item
                    response: (data) => response(data, 1), // callback giá trị trả về khi có chọn item
                    limitCheck: NumberMax - dataFile?.length, //gioi han sl media chon: -1 la khong co gioi han, >-1 la gioi han sl =  limitCheck
                    groupTypes: 'All',
                };
                Utils.goscreen(props.nthis, 'Modal_MediaPicker', options);
            }

                break;
            case 2: {
                let options = {
                    assetType: 'Videos',//All,Videos,Photos - default
                    multi: true,// chọn 1 or nhiều item
                    response: (data) => response(data, 2), // callback giá trị trả về khi có chọn item
                    limitCheck: NumberMax - dataFile?.length, //gioi han sl media chon: -1 la khong co gioi han, >-1 la gioi han sl =  limitCheck
                    groupTypes: 'All',
                };
                Utils.goscreen(props.nthis, 'Modal_MediaPicker', options);
            }

                break;
            case 3:
                try {
                    const results = await DocumentPicker.pickMultiple({
                        type: [DocumentPicker.types.allFiles],
                    });

                    Utils.nlog("giá trị res------------------------aaaaa", results)
                    if (results && results.length > 0) {
                        let resultsnew = results.map(item => {
                            let type = item.type.split('/')
                            if (type[0].includes('video')) {
                                return { ...item, type: 2 }
                            } else if (type[0].includes("image")) {
                                return { ...item, type: 1 }
                            } else {
                                return { ...item, type: 3, typeAplication: item.type }
                            }
                        })
                        response(resultsnew, 3)
                    }


                } catch (err) {
                    if (DocumentPicker.isCancel(err)) {
                    } else {
                        throw err;
                    }
                }

                break;

            default:
                break;
        }


    }

    // Utils.nlog("data---------", dataFile)
    return (
        <View style={{ padding: 10, borderRadius: 5 }} ref={ref}>

            {
                IsEdit ?
                    <View style={{

                        alignItems: 'center',
                        flexDirection: 'row',
                        backgroundColor: 'rgba(239,235,224,0.4)',
                        borderRadius: 5, paddingVertical: 0, borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.colorBlueLight,
                    }} pointerEvents={IsEdit ? 'auto' : 'none'}>
                        <View style={{ flex: 1, alignItems: 'center', }}>
                            {/* //show danh sách chọn file */}
                            {
                                ShowSelect || isPickOne ? <View style={{ flexWrap: 'wrap', flexDirection: 'row', paddingLeft: 10 }}>{
                                    dataMenu.map(renderItem)
                                }
                                </View> : <TouchableHighlight
                                    onPress={() => {

                                        if (IsEdit == false) {

                                        } else {
                                            StartImageRotate();
                                            setShowSelect(!ShowSelect)
                                        }

                                    }} underlayColor={colors.backgroundModal
                                    } style={{
                                        paddingVertical: 5,
                                        paddingHorizontal: 10,
                                        alignItems: 'center', width: '100%', justifyContent: 'center'
                                    }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 5 }}>
                                            <Image resizeMode='contain' source={ImgComp.icFileupload}
                                                style={{ width: 30, height: 30 }}></Image>
                                            <Text style={{ fontSize: 16, color: colors.coral, fontWeight: 'bold' }}>{'Upload file'}</Text>
                                        </View>


                                    </TouchableHighlight>
                            }
                        </View>
                        {/* khi dang chon thi hiện nút tắt */}
                        {
                            ShowSelect ? <TouchableHighlight onPress={() => {
                                if (IsEdit == false) {

                                } else {
                                    StartImageRotate();
                                    setShowSelect(!ShowSelect)
                                }
                            }} underlayColor={colors.backgroundModal}
                                style={{ width: 50, height: 50, alignItems: 'center', justifyContent: 'center' }}>
                                <Animated.Image
                                    style={{
                                        transform: [{ rotate: RotateData }],
                                        tintColor: colors.coral
                                    }}
                                    source={ShowSelect ? ImgComp.icCloseWhite : ImgComp.icDropDown} />
                            </TouchableHighlight> : null
                        }


                    </View>
                    : null
            }


            <View style={{
                flexWrap: 'wrap',
                width: '100%',
                flexDirection: 'row',
                marginTop: 10
            }}>
                {
                    dataFileOld.map((item, index) => renderImage(item, index))
                }
                {
                    dataFile.map((item, index) => renderImage(item, index, 1))
                }
            </View>
            {/* render data file old */}
            {/* {
                dataFileOld ? <View style={{ flexWrap: 'wrap', marginBottom: 10, flexDirection: 'row', marginTop: 10 }}>
                    {
                        dataFileOld.map((item, index) => renderImage(item, index))
                    }

                </View> : null
            } */}
            {/* render data file new */}
            {/* {
                dataFile ? <View style={{
                    flexWrap: 'wrap',
                    width: '100%',
                    flexDirection: 'row',

                }}>
                    {
                        dataFile.map((item, index) => renderImage(item, index, 1))
                    }
                </View> : null
            } */}
            <Modal
                animationType="slide"
                onRequestClose={() => {
                    enableFullImage(false);
                    enableCloseImage(false);
                }}
                visible={showFullImage}>
                <View style={{ flex: 1, backgroundColor: 'black' }}>
                    <ImageViewer
                        imageUrls={dataImageView}
                        enableSwipeDown={true}
                        index={indexHinhViewZoom}
                        onChange={index => setIndexHinh(index)}
                        onSwipeDown={() => enableFullImage(false)}
                        onClick={() => enableCloseImage(!showCloseImage)}
                    />
                    {showCloseImage ?
                        <TouchableOpacity
                            style={{
                                position: 'absolute', top: 0, right: 0,
                                backgroundColor: 'white', opacity: 0.5, borderRadius: 10, margin: 10
                            }}
                            activeOpacity={0.5}
                            onPress={() => {
                                enableFullImage(false);
                                enableCloseImage(false);
                            }}>
                            <Image
                                style={{ width: reSize(30), height: reSize(30), margin: 15, tintColor: 'white' }}
                                source={ImgComp.icCloseBlack} />
                        </TouchableOpacity> : null}
                </View>
            </Modal>
        </View >
    )
})

export default ImagePickerNew

const styles = StyleSheet.create({})
