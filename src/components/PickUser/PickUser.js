import React, { Component, useEffect, useRef, useState } from 'react';
import {
    StyleSheet, Text, View, FlatList, Dimensions, TouchableOpacity, Image, Modal, ScrollView, Alert, TextInput
} from 'react-native';
import Utils from '../../app/Utils';
import { Images } from '../../images';
import UtilsApp from "../../app/UtilsApp";
import { colors } from '../../styles';
import { nstyles, paddingTopMul, Height, Width, nHeight, paddingBotX } from '../../styles/styles'
import { reText } from '../../styles/size';
import { getListNhanVien } from '../../apis/JeePlatform/API_JeeWork/apiDSNhanVien';
import IsLoading from '../../components/IsLoading';
import HeaderComStackV2 from '../../components/HeaderComStackV2';
import { ROOTGlobal } from '../../app/data/dataGlobal';
import { RootLang } from '../../app/data/locales';
import ImageCus from '../../components/NewComponents/ImageCus';

const PickUser = (props) => {
    const refLoading = useRef(null)
    const [listNV, setListNV] = useState([])
    const [dataCopy, setDataCopy] = useState([])
    const [textSearch, setTextSearch] = useState('')
    const [listContactChecked, setListContactChecked] = useState([])
    const nvCoSan = Utils.ngetParam({ props }, 'nvCoSan', [])
    const callback = Utils.ngetParam({ props }, 'callback', () => { })
    const loai = Utils.ngetParam({ props }, 'loai', 0)
    const onlyOne = Utils.ngetParam({ props }, 'onlyOne', false);
    const onlyFive = Utils.ngetParam({ props }, 'onlyFive', false);
    const idDuAn = Utils.ngetParam({ props }, 'idDuAn', '');
    const dataNV = Utils.ngetParam({ props }, 'dataNV', [])

    useEffect(() => {
        refLoading.current.show()
        _loadDsNhanVien()
    }, [])

    useEffect(() => {
        _addListCheck_nvCoSan()
    }, [dataCopy])

    const _loadDsNhanVien = async () => {
        let nhanVien = dataNV.map(obj => (
            { ...obj, check: nvCoSan.length > 0 ? _containsObject(nvCoSan, obj) : false, loai: loai }
        ))
        setListNV(nhanVien)
        setDataCopy(nhanVien)
        nvCoSan.length == 0 && refLoading.current.hide()
    }

    const _containsObject = (obj, list) => {
        let checkExit = obj.some((item) => item.id_baidang ? item.userId == list.id_nv : item.id_nv == list.id_nv)
        return checkExit
    }

    const _addListCheck_nvCoSan = () => {
        let listUserCheck = []
        dataCopy.map(item => {
            if (item.check == true) {
                listUserCheck.push(item)
            }
        })
        setListContactChecked(listUserCheck)
        refLoading.current.hide()
    }

    const hashCode = (str) => {
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return hash;
    }

    const intToRGB = (i) => {
        var c = (i & 0x00FFFFFF)
            .toString(16)
            .toUpperCase();
        return "#" + "00000".substring(0, 6 - c.length) + c;
    }

    const _goBack = () => {
        Utils.goback({ props })
    }

    const _addListCheck = async (item) => {
        let listUserCheck = []
        let ListCheck = dataCopy.map(val => {
            if (val.id_nv == item.id_nv) {
                let check = !item.check
                return { ...item, check: check }
            }
            else {
                return { ...val }
            }
        })
        ListCheck.map(val => {
            if (val.check == true)
                return listUserCheck.push(val)
        })
        setListNV(ListCheck)
        setDataCopy(ListCheck)
        textSearch.length > 0 && setTextSearch('')
        setListContactChecked(listUserCheck)
    }

    const _addListCheckFive = async (item) => {
        let listUserCheck = []
        let ListCheck = []
        if (listContactChecked.length < 5) {
            ListCheck = dataCopy.map(val => {
                if (val.id_nv == item.id_nv) {
                    let check = !item.check
                    return { ...item, check: check }
                }
                else {
                    return { ...val }
                }
            })
            ListCheck.map(val => {
                if (val.check == true)
                    return listUserCheck.push(val)
            })
            setListNV(ListCheck)
            setDataCopy(ListCheck)
            textSearch.length > 0 && setTextSearch('')
            setListContactChecked(listUserCheck)
        }
        else {
            if (item.check == true) {
                ListCheck = dataCopy.map(val => {
                    if (val.id_nv == item.id_nv) {
                        let check = !item.check
                        return { ...item, check: check }
                    }
                    else {
                        return { ...val }
                    }
                })
                ListCheck.map(val => {
                    if (val.check == true)
                        return listUserCheck.push(val)
                })
                setListNV(ListCheck)
                setDataCopy(ListCheck)
                textSearch.length > 0 && setTextSearch('')
                setListContactChecked(listUserCheck)
            }
            else {
                UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, 'Chỉ có thể chọn tối đa 5 người!!', 3)
            }
        }
    }

    const _goBackOnlyOne = (item) => {
        callback(item);
        _goBack()
    }

    const _goBackWithManyUser = async () => {
        callback(listContactChecked)
        _goBack()
    }

    const _renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity key={index} style={styles.item}
                onPress={() => onlyOne == true ? _goBackOnlyOne(item) : _addListCheck(item)} >
                <View style={{}}>
                    {
                        item?.image ?
                            <ImageCus
                                style={nstyles.nAva50}
                                source={{ uri: item?.image }}
                                resizeMode={"cover"}
                                defaultSourceCus={Images.icAva}
                            /> :
                            <View style={[nstyles.nAva50, {
                                backgroundColor: intToRGB(hashCode(item.hoten)),
                                flexDirection: "row", justifyContent: 'center', alignItems: 'center'
                            }]}>
                                <Text style={styles.textName}>{String(item.hoten).split(" ").slice(-1).toString().slice(0, 2).toString()}</Text>
                            </View>
                    }
                </View>
                <View style={styles.containerName}>
                    <Text style={styles.text}>{item.hoten ? item.hoten : ''}</Text>
                    <Text style={styles.Chucvu}>{item.tenchucdanh ? item.tenchucdanh : ''}</Text>
                </View>
                {
                    onlyOne != true && <View style={styles.touch}>
                        <Image source={item.check ? Images.ImageJee.icCheckChat : Images.ImageJee.icUnCheckChat} style={{ width: Width(5), height: Width(5), tintColor: colors.greenTab }} />
                    </View>
                }
            </TouchableOpacity>
        )
    }

    const _renderItemFive = ({ item, index }) => {
        return (
            <TouchableOpacity key={index} style={styles.item}
                onPress={() => _addListCheckFive(item)} >
                <View >
                    {
                        item?.image ?
                            <ImageCus
                                style={nstyles.nAva50}
                                source={{ uri: item?.image }}
                                resizeMode={"cover"}
                                defaultSourceCus={Images.icAva}
                            /> :
                            <View style={[nstyles.nAva50, {
                                backgroundColor: intToRGB(hashCode(item.hoten)),
                                flexDirection: "row", justifyContent: 'center', alignItems: 'center'
                            }]}>
                                <Text style={styles.textName}>{String(item.hoten).split(" ").slice(-1).toString().slice(0, 2).toString()}</Text>
                            </View>
                    }
                </View>
                <View style={styles.containerName}>
                    <Text style={styles.text}>{item.hoten ? item.hoten : ''}</Text>
                    <Text style={styles.Chucvu}>{item.tenchucdanh ? item.tenchucdanh : ''}</Text>
                </View>
                {
                    <View style={styles.touch}>
                        <Image source={item.check ? Images.ImageJee.icCheckChat : Images.ImageJee.icUnCheckChat} style={{ width: Width(5), height: Width(5), tintColor: colors.greenTab }} />
                    </View>
                }
            </TouchableOpacity>
        )
    }

    const _renderChild = ({ item, index }) => {
        return (
            <TouchableOpacity onPress={() => _addListCheck(item)} key={index} >
                <View style={{ marginRight: 7 }}>
                    {
                        item?.image ?
                            <ImageCus
                                style={nstyles.nAva50}
                                source={{ uri: item?.image }}
                                resizeMode={"cover"}
                                defaultSourceCus={Images.icAva}
                            /> :
                            <View style={[nstyles.nAva50, {
                                backgroundColor: intToRGB(hashCode(item?.hoten)),
                                flexDirection: "row", justifyContent: 'center'
                            }]}>
                                <Text style={styles.textName}>{String(item?.hoten).split(" ").slice(-1).toString().slice(0, 2).toString()}</Text>
                            </View>
                    }
                </View>
                <Image source={Images.ImageJee.icXoaAnh} style={{ ...nstyles.nIcon19, position: 'absolute', top: 0, right: 3 }}></Image>
            </TouchableOpacity>
        )
    }

    const _search = (searchText) => {
        setTextSearch(searchText)
        let filteredData = dataCopy.filter((item) =>
            Utils.removeAccents(item['hoten'])
                .toUpperCase()
                .includes(Utils.removeAccents(searchText.toUpperCase())),
        );
        setListNV(filteredData)
    }

    return (
        <View style={[nstyles.ncontainer, { backgroundColor: colors.white }]} >
            <HeaderComStackV2
                nthis={this}
                title={'Chọn'}
                iconLeft={Images.ImageJee.icBack}
                onPressLeft={_goBack}
            />
            <View style={styles.search}>
                <Image source={Images.icSearch} />
                <TextInput
                    value={textSearch}
                    numberOfLines={1}
                    style={styles.textInput}
                    placeholder={RootLang.lang.JeeWork.timkiem}
                    onChangeText={text => {
                        _search(text)
                    }} />
                {textSearch != "" ?
                    <TouchableOpacity onPress={() => {
                        setTextSearch(''), setListNV(dataCopy)
                    }} style={styles.xoa}>
                        <Text style={{ fontSize: reText(12), fontWeight: 'bold' }}>X</Text>
                    </TouchableOpacity> : null}
            </View>
            <View style={{ flex: 1, }}>
                <FlatList
                    style={{ marginTop: 5 }}
                    contentContainerStyle={{ paddingBottom: listContactChecked.length > 0 ? 80 : 10 }}
                    data={listNV}
                    renderItem={onlyFive == true ? _renderItemFive : _renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    initialNumToRender={5}
                    maxToRenderPerBatch={10}
                    windowSize={7}
                    updateCellsBatchingPeriod={100}
                    ListEmptyComponent={<EmptySearch></EmptySearch>}
                />
                {listContactChecked.length > 0 && onlyOne == false ?
                    <View style={styles.viewlistContactChecked}>
                        <FlatList
                            contentContainerStyle={{ marginRight: 10 }}
                            horizontal={true}
                            data={listContactChecked}
                            renderItem={_renderChild}
                            keyExtractor={(item, index) => index.toString()} />
                        <TouchableOpacity onPress={() => _goBackWithManyUser()}
                            style={styles.touchDone}>
                            <Image source={Images.ImageJee.icNextChat} style={{ width: Width(5), height: Width(5), tintColor: colors.white }} />
                        </TouchableOpacity>
                    </View> : null}
                <IsLoading ref={refLoading}></IsLoading>
            </View>
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: colors.white
    },
    search: {
        flexDirection: 'row', backgroundColor: colors.black_5, marginHorizontal: 15, marginTop: 10, paddingHorizontal: 10, borderRadius: 10,
        alignItems: 'center',
    },
    textInput: {
        flex: 1, paddingVertical: Platform.OS == 'ios' ? 10 : 5, paddingHorizontal: 5, fontSize: reText(16)
    },
    xoa: {
        width: Width(5), backgroundColor: colors.black_20_2, height: Width(5), borderRadius: 10, justifyContent: 'center', alignItems: 'center'
    },
    item: {
        marginTop: 5, flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 10,
    },
    containerAva: {

    },
    containerName: {
        flex: 1, justifyContent: 'center', paddingHorizontal: 10, borderBottomWidth: 0.5, borderColor: colors.lightBlack, paddingBottom: 10
    },
    touch: {
        justifyContent: 'center', alignItems: 'center'
    },
    text: {
        fontSize: reText(15), fontWeight: 'bold'
    },
    Chucvu: {
        fontSize: reText(12), color: colors.black_50
    },
    touchDone: {
        width: Width(12), height: Width(12), backgroundColor: colors.greenTab, justifyContent: 'center', alignItems: 'center', borderRadius: Width(20)
    },
    viewlistContactChecked: {
        alignItems: 'center', backgroundColor: '#C6CFC9', position: 'absolute', bottom: 0, left: 0, flexDirection: 'row', paddingBottom: paddingBotX, paddingHorizontal: 10, paddingTop: 10
    },
    textName: {
        alignSelf: "center", fontWeight: "bold", fontSize: reText(16), color: colors.white
    },
})

const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(PickUser, mapStateToProps, true)

const EmptySearch = () => {
    return (
        <View style={{ justifyContent: 'center', alignItems: 'center', alignContent: 'center', flex: 1, }}>
            <Text> Không có dữ liệu</Text>
        </View>
    )
}
