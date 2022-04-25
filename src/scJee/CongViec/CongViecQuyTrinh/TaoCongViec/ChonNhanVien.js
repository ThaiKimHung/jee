import React, { Component } from 'react';
import { FlatList, Image, Text, TextInput, TouchableOpacity, View, StyleSheet } from "react-native";
import { GetListNhanVien, } from '../../../../apis/JeePlatform/API_JeeWork/apiCongViecQuyTrinh';
import { RootLang } from '../../../../app/data/locales';
import Utils from '../../../../app/Utils';
import Header_TaoBaiDang from '../../../../components/Header_TaoBaiDang';
import ListEmptyLottie from '../../../../components/NewComponents/ListEmptyLottie';
import { Images } from '../../../../images';
import { colors } from '../../../../styles';
import { reText, sizes } from '../../../../styles/size';
import { Height, nstyles, Width } from '../../../../styles/styles';
import _ from 'lodash'
import UtilsApp from '../../../../app/UtilsApp';
import IsLoading from '../../../../components/IsLoading';

class ChonNhanVien extends Component {
    constructor(props) {
        super(props);
        this.state = {
            noidung_Tk: '',
            listUser: [],
            refreshing: false,
            selectedUser: [],
            dataLoad: true,
            nvCoSan: Utils.ngetParam(this, 'nvCoSan', []),
            searchText: '',
            filteredData: [],
        };
        this.callback = Utils.ngetParam(this, 'callback');

        this.nthis = this.props.nthis;
    }
    componentDidMount = async () => {
        nthisLoading.show()
        await this._loadDsNhanVien().then(res => {
            if (res == true) {
                nthisLoading.hide()
                if (this.state.listUser?.length > 0) {
                    this.setState({ dataLoad: true })
                }
                else this.setState({ dataLoad: false })
            }
        });
    }

    _loadDsNhanVien = async () => {
        var { nvCoSan } = this.state
        const res = await GetListNhanVien()
        // Utils.nlog(' res _loadDsNhanVien', res)
        if (res.status == 1) {
            this.setState({
                listUser: res.data.map((obj, index) => ({ ...obj, check: nvCoSan ? this._containsObject(nvCoSan, obj) : false, })),
                refreshing: false,
            }, () => {
                this._check(this.state.listUser)
            })
        }
        else {
            this.setState({ refreshing: false })
            UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
        }
        return true
    }

    _containsObject(obj, list) {
        let checkExit = obj.some((item) => item?.UserId ? item?.UserId == list.UserId : item?.ObjectID == list.UserId)
        return checkExit
    }

    _check = async (list) => {
        list.map((item) => {
            if (item.check === true) {
                this.state.selectedUser.push(item);
                this.setState({
                    selectedUser: this.state.selectedUser
                })
            }
        })
    }

    hashCode = (str) => {
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return hash;
    }

    intToRGB = (i) => {
        var c = (i & 0x00FFFFFF)
            .toString(16)
            .toUpperCase();
        return "#" + "00000".substring(0, 6 - c.length) + c;
    }

    _ChonUser = async (itemChoice) => {
        var { listUser, selectedUser } = this.state
        listUser.map((item) => {
            if (item === itemChoice) {
                item.check = !item.check
                if (item.check === true) {
                    selectedUser.push(item);
                } else if (item.check === false) {
                    const i = this.state.selectedUser.indexOf(item)
                    if (1 != -1) {
                        this.state.selectedUser.splice(i, 1)
                        return this.state.selectedUser
                    }
                }
            }
        })
        this.setState({ listUser: listUser })
    }

    _onRefresh = () => {
        this._loadDsNhanVien()
    }

    _renderItem_MangChon = ({ item, index }) => {
        return (
            <>
                {
                    item.check == true ?
                        <TouchableOpacity style={styles.khungTouch_Item_MangChon}
                            onPress={() => this.onlyOne == true ? this._goBackOnlyOne(item) : this._ChonUser(item)}>
                            <View style={[styles.row, {}]}>
                                {item.AvartarImgURL ? <Image source={{ uri: item.AvartarImgURL }} style={[nstyles.nAva40, {}]} /> :
                                    <View style={[styles.khungRGBColor, {
                                        backgroundColor: item.BgColor ? item.BgColor : this.intToRGB(this.hashCode(item.FullName)),
                                    }]} >
                                        <Text style={styles.textName}> {String(item.FullName).split(" ").slice(-1).toString().slice(0, 2).toString()}</Text>
                                    </View>}
                            </View>
                        </TouchableOpacity>
                        : null
                }
            </>
        );
    }

    _goback = () => {
        this.callback(this.state.selectedUser);
        Utils.goback(this);
    }

    _clearAll = () => {
        this.setState({ selectedUser: [] })
        this.state.listUser.map(item => {
            item.check = false
        })
        this.setState({ listUser: this.state.listUser })
    }

    _search = (searchText) => {
        this.setState({ searchText: searchText });
        let filteredData = this.state.listUser.filter((item) =>
            Utils.removeAccents(item['FullName'])
                .toUpperCase()
                .includes(Utils.removeAccents(searchText.toUpperCase())),
        );
        this.setState({ filteredData: filteredData });
    };

    _renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity style={styles.khungRenderItem}
                onPress={() => this.onlyOne == true ? this._goBackOnlyOne(item) : this._ChonUser(item)}>
                <View style={styles.khungImage}>
                    <Image source={item.check == true ? Images.ImageJee.icTouchDaChon : Images.ImageJee.icTouchChuaChon} resizeMode='cover' style={[{}]} />
                </View>
                <View style={[styles.row, {}]}>
                    {item.AvartarImgURL ? <Image source={{ uri: item.AvartarImgURL }} style={[nstyles.nAva40, {}]} /> :
                        <View style={[styles.khungRGBColor, {
                            backgroundColor: item.BgColor ? item.BgColor : this.intToRGB(this.hashCode(item.FullName)),
                        }]} >
                            <Text style={styles.textName}> {String(item.FullName).split(" ").slice(-1).toString().slice(0, 2).toString()}</Text>
                        </View>}
                    <View style={[styles.khungName, {}]}>
                        <Text style={[styles.textName, { color: colors.black }]}>{item.FullName}</Text>
                    </View>
                </View>
            </TouchableOpacity >
        );
    }

    render() {
        var { noidung_Tk, listUser, selectedUser, dataLoad, refreshing } = this.state
        return (
            <View style={styles.container}>
                <Header_TaoBaiDang
                    nthis={this}
                    textRight={selectedUser.length == 0 ? "" : RootLang.lang.JeeWork.xong}
                    styTextRight={[{ fontSize: reText(15), color: '#0E72D8' }]}
                    iconLeft={Images.ImageJee.icArrowNext}
                    styIconLeft={{ tintColor: colors.black }}
                    onPressLeft={() => { Utils.goback(this) }}
                    onPressRight={() => { this._goback() }}
                    textleft={RootLang.lang.JeeWork.ganthe}
                    styTextLeft={{ fontSize: reText(15), }}
                />
                <View style={styles.flex1}>
                    <View style={styles.khungheader} >
                        <View style={styles.khungselectUser}>
                            {
                                selectedUser.length > 0 ? (
                                    <>
                                        <View style={styles.khungflatlistSelectUser}>
                                            <FlatList
                                                showsHorizontalScrollIndicator={false}
                                                showsVerticalScrollIndicator={false}
                                                horizontal={true}
                                                style={{}}
                                                data={selectedUser}
                                                renderItem={this._renderItem_MangChon}
                                                keyExtractor={(item, index) => index.toString()}
                                            />
                                        </View>
                                        <TouchableOpacity style={styles.touchDeletSelectUser}
                                            onPress={() => this._clearAll()}>
                                            <Image source={Images.ImageJee.icDelete_TimKiem} resizeMode='cover' style={[nstyles.nIcon12, styles.imageDeletSelectUser, {}]} />
                                        </TouchableOpacity>
                                    </>
                                ) : null
                            }
                        </View>
                        <View style={[styles.khungtimkiem, { marginBottom: selectedUser.length > 0 ? 10 : 0 }]}>
                            <View style={[styles.khungTimkiem, {}]}>
                                <Image source={Images.ImageJee.icTimKiemSocial} resizeMode='cover' style={[nstyles.nIcon18, {}]} />
                                <View style={[styles.textinput, {}]}>
                                    <TextInput
                                        style={{ paddingVertical: Platform.OS == 'ios' ? 10 : 3, }}
                                        placeholder={RootLang.lang.JeeWork.timkiem}
                                        onChangeText={this._search}
                                        underlineColorAndroid="transparent"
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={{ flex: 1, backgroundColor: colors.white, paddingTop: 5 }}>
                        <View style={{ marginLeft: 10 }}>
                            <FlatList
                                extraData={this.state}
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                                style={{ marginTop: 5 }}
                                data={this.state.filteredData && this.state.filteredData.length > 0
                                    ? this.state.filteredData
                                    : this.state.listUser}
                                keyExtractor={(item, index) => index.toString()}
                                extraData={this.state}
                                refreshing={refreshing}
                                initialNumToRender={5}
                                maxToRenderPerBatch={10}
                                windowSize={7}
                                updateCellsBatchingPeriod={100}
                                onRefresh={this._onRefresh}
                                renderItem={this._renderItem}
                                keyExtractor={(item, index) => index.toString()}
                                ListEmptyComponent={listUser?.length == 0 && dataLoad == false ? <ListEmptyLottie style={{ justifyContent: 'center', alignItems: 'center', }} textempty={RootLang.lang.JeeWork.khongcodulieu} /> : null}
                            />
                        </View>
                    </View>
                    <IsLoading />
                </View>
            </View >
        );
    }
};
const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: colors.white
    },
    flex1: {
        flex: 1
    },
    khungheader: {
        maxHeight: Height(14), marginTop: 1, borderBottomWidth: 0.3, borderTopWidth: 0.3, borderColor: '#707070',
    },
    khungselectUser: {
        flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10
    },
    khungflatlistSelectUser: {
        maxWidth: '90%', paddingVertical: 10, paddingHorizontal: 10,
    },
    touchDeletSelectUser: {
        position: 'absolute', right: 10, paddingRight: 5,
    },
    imageDeletSelectUser: {
        tintColor: '#000000', justifyContent: 'center', alignItems: 'center'
    },
    khungtimkiem: {
        justifyContent: 'center', paddingVertical: 5
    },
    khungTouch_Item_MangChon: {
        flex: 1, flexDirection: 'row', borderRadius: 10,
    },
    row: {
        flexDirection: 'row'
    },
    khungRGBColor: {
        marginRight: 10,
        borderRadius: 99,
        width: Width(10),
        height: Width(10),
        justifyContent: 'center',
        alignItems: 'center'
    },
    textName: {
        fontWeight: "bold", fontSize: reText(14), color: colors.white
    },
    khungRenderItem: {
        backgroundColor: colors.white, flex: 1, flexDirection: 'row', marginVertical: 8,
    },
    khungImage: {
        marginRight: 10, justifyContent: 'center'
    },
    khungName: {
        marginLeft: 5, justifyContent: 'center'
    },
    khungTimkiem: {
        alignItems: 'center', marginHorizontal: 10, flexDirection: 'row',
    },
    textinput: {
        flex: 1, paddingHorizontal: 2, paddingVertical: Platform.OS == 'ios' ? 5 : 3,
    }
})
const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(ChonNhanVien, mapStateToProps, true)


