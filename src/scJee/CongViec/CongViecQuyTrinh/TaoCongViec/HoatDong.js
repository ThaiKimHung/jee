import moment from 'moment';
import React, { Component, createRef } from 'react';
import { BackHandler, FlatList, StyleSheet, Text, View } from "react-native";
import { LoadDanhSachHoatDong } from '../../../../apis/JeePlatform/API_JeeWork/apiCongViecQuyTrinh';
import { RootLang } from '../../../../app/data/locales';
import Utils from '../../../../app/Utils';
import UtilsApp from '../../../../app/UtilsApp';
import HeaderComStackV2 from '../../../../components/HeaderComStackV2';
import IsLoading from '../../../../components/IsLoading';
import FastImagePlaceholder from '../../../../components/NewComponents/FastImageDefault';
import ListEmptyLottie from '../../../../components/NewComponents/ListEmptyLottie';
import { Images } from '../../../../images';
import { colors } from '../../../../styles';
import { reText } from '../../../../styles/size';
import { nstyles, paddingBotX, Width } from '../../../../styles/styles';
import { nkey } from '../../../../app/keys/keyStore';
const ScrollComment = createRef();

class HoatDong extends Component {
    constructor(props) {
        super(props);
        if (this.props && this.props.nthis) {
            this.nthis = this.props.nthis
        }
        else {
            this.nthis = this
        }
        this.refLoading = React.createRef()
        this.state = {
            id_row: Utils.ngetParam(this.nthis, "id_row", ''),
            stageid: Utils.ngetParam(this.nthis, "stageid", ''),
            Activities: [],
            tuongtac: '',
            refreshing: false,
            trangchinh: this.props.trangchinh,
            page: '',
            empty: false,
        };
        this.allPage = ""
        this.idUser = 0
    }

    componentDidMount = async () => {
        BackHandler.addEventListener("hardwareBackPress", this._goback);
        this.idUser = await Utils.ngetStorage(nkey.UserId, '')
        if (this.state.trangchinh) {
            this.refLoading.current.show()
            await this._loadDanhSachHoatDong().then(res => {
                if (res == true) {
                    this.refLoading.current.hide()
                }
            });
        }
    }

    componentWillUnmount() {
        try {
            BackHandler.removeEventListener('hardwareBackPress', this._goback)
        }
        catch (error) {

        }
    }

    _goback = async () => {
        Utils.goback(this.nthis, null)
        return true
    }

    _loadDanhSachHoatDong = async (page = 1) => {
        const { stageid, Activities } = this.state
        let res = await LoadDanhSachHoatDong(page, 100, stageid);
        // Utils.nlog("res _loadDanhSachHoatDong ", res)
        if (res.status == 1) {
            this.setState({
                Activities: res.data,
                refreshing: false,
                empty: true
            })
        } else {
            this.setState({ refreshing: false, Activities: [], empty: false })
            // UtilsApp.MessageShow(RootLang.lang.thongbaochung.thongbao, res.error ? res.error.message : RootLang.lang.thongbaochung.loilaydulieu, 2)
        }
        return true
    }

    _onRefresh = () => {
        this._loadDanhSachHoatDong(1);
    }

    _renderItem = ({ item, index }) => {
        return (
            <View key={index}>
                <View style={styles.khungbocActi}>
                    <View style={styles.with78}>
                        <Text style={{ fontSize: reText(14) }}>
                            <Text style={styles.textFullname}>{this.idUser == item?.user?.UserId ? 'Bạn' : item.user.FullName} </Text>
                            <Text style={styles.textAction}>
                                {`${item?.action.replace(' {0} ', ' ')}`.toLowerCase() + ' '}
                            </Text>
                            {item.old_value && item.new_value ?
                                <>
                                    <Text style={styles.textTu}>
                                        {RootLang.lang.JeeWork.tu + " "}
                                    </Text>
                                    {item.old_color ? <Text style={{ color: item.old_color }}>
                                        {" "}■{" "}
                                    </Text> : null}
                                    <Text style={{ color: item.old_color ? item.old_color : "#DB5D37", fontWeight: "bold" }}>
                                        {item?.old_value} {' '}
                                    </Text>
                                    <Text sstyle={styles.textTu}>
                                        {RootLang.lang.JeeWork.thanh + " "}
                                        {item.new_color ? <Text style={{ color: item.new_color }}>
                                            {" "}■{" "}
                                        </Text> : null}
                                        <Text style={{ color: item.new_color ? item.new_color : '#10CCAA', fontWeight: "bold", fontSize: reText(14) }}>
                                            {item?.new_value}
                                        </Text>
                                    </Text>
                                </> : null}
                        </Text>
                    </View>
                    <View style={styles.khungNgay}>
                        <Text style={styles.textNgay}>{UtilsApp.convertDatetime(item.date, 'YYYY/MM/DD HH:mm:ss', 'DD/MM/YYYY HH:mm')}</Text>
                    </View>
                </View>
            </View>
        );
    };

    render() {
        const { Activities, refreshing, empty, trangchinh } = this.state;
        return (
            <View style={styles.khung}>

                <View style={styles.body}>
                    <FlatList
                        data={Activities}
                        nestedScrollEnabled={true}
                        scrollEnabled={true}
                        renderItem={this._renderItem}
                        refreshing={refreshing}
                        extraData={this.state}
                        initialNumToRender={5}
                        maxToRenderPerBatch={10}
                        windowSize={7}
                        onRefresh={this._onRefresh}
                        ListEmptyComponent={Activities.length == 0 ? <ListEmptyLottie style={{ justifyContent: 'center', alignItems: 'center', }} textempty={empty ? RootLang.lang.JeeWork.khongcodulieu : null} /> : null}
                        updateCellsBatchingPeriod={100}
                        keyExtractor={(item, index) => index.toString()}
                    />
                    <IsLoading ref={this.refLoading} />
                </View>
            </View>
        );
    }
};


const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});

const styles = StyleSheet.create({
    khung: {
        flex: 1
    },
    body: {
        flex: 1, paddingBottom: paddingBotX, paddingHorizontal: 5
    },
    khungbocActi: {
        flexDirection: "row", width: Width(95), marginTop: 20
    },
    with78: {
        width: Width(61)
    },
    row: {
        flexDirection: 'row'
    },
    ava: {
        width: 35, height: 35, borderRadius: 40,
    },
    textFullname: {
        // fontSize: reText(14), fontWeight: "bold", color: '#404040', alignSelf: 'center', marginLeft: 5
        fontSize: reText(14)
    },
    fonsize14: {
        fontSize: reText(14)
    },
    textAction: {
        // fontSize: reText(14), color: colors.black_50, fontWeight: 'bold'
        fontSize: reText(14), color: colors.black_50
    },
    textTu: {
        color: colors.black_90, fontSize: reText(14)
    },
    khungNgay: {
        width: Width(35), alignItems: 'flex-end', paddingRight: 8
    },
    textNgay: {
        fontSize: reText(13), color: colors.black_50
    },
    fontWeight: {
        fontWeight: "bold", fontSize: reText(14)
    }
});

export default Utils.connectRedux(HoatDong, mapStateToProps, true)


