import React, { Component } from 'react';
import { View, ScrollView, Platform, BackHandler } from "react-native";
import Utils from '../../../app/Utils';
import { Images } from '../../../images';
import { colors } from '../../../styles';
import { nstyles } from '../../../styles/styles';
import ComponentAllMenu from './ComponentAllMenu';
import { objectMenuGlobal } from './MenuGlobal';
import { LayMenuChucNang_MobileApp } from '../../../apis/JeePlatform/API_JeeWork/apiMenu';
import IsLoading from '../../../components/IsLoading';
import { RootLang } from '../../../app/data/locales';
import { nkey } from '../../../app/keys/keyStore';
import { nGlobalKeys } from '../../../app/keys/globalKey';
import UtilsApp from '../../../app/UtilsApp';
import HeaderAnimationJee from '../../../components/HeaderAnimationJee';

class AllMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listCongViec: [],
            listNhanSu: [],
            listYeuCau: [],
            listHanhChinh: [],
            listCuocHop: [],
        }
        this.listCongViec = []
        this.listNhanSu = []
        this.listYeuCau = []
        this.listHanhChinh = []
        this.listCuocHop = []
    }

    async componentDidMount() {
        nthisLoading.show()
        this.backHandler = BackHandler.addEventListener("hardwareBackPress", this._goback);

        let isConected = Utils.getGlobal(nGlobalKeys.isConnected, true);
        isConected && this.listCongViec.length == 0 && this.listHanhChinh.length == 0 && this.listNhanSu.length == 0 && this.listYeuCau.length == 0 && this.listCuocHop.length == 0 ?
            this._layMenuChucNang_MobileApp()
            : (
                this.listCongViec = await Utils.ngetStorage(nkey.menuCongViec, []),
                this.listHanhChinh = await Utils.ngetStorage(nkey.menuHanhChinh, []),
                this.listNhanSu = await Utils.ngetStorage(nkey.menuNhanSu, []),
                this.listYeuCau = await Utils.ngetStorage(nkey.menuYeuCau, []),
                this.listCuocHop = await Utils.ngetStorage(nkey.menuCuocHop, [])
            )
        if (!isConected) {
            nthisLoading.hide()
            UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, RootLang.lang.thongbaochung.vuilongkiemtraketnoiinternet, 2)
        }
    }

    componentWillUnmount() {
        if (this.backHandler)
            this.backHandler.remove();
    }
    ganItem = (id, mang) => {
        let temp = []
        if (id == 1)
            temp = objectMenuGlobal.MenuCongViec
        if (id == 2) {
            temp = objectMenuGlobal.MenuNhanSu
        }
        if (id == 3) {
            temp = objectMenuGlobal.MenuYeuCau
        }
        if (id == 4) {
            temp = objectMenuGlobal.MenuHanhChinh
        }
        if (id == 5) {
            temp = objectMenuGlobal.MenuCuocHop
        }
        mang.map(item => {
            for (let i = 0; i <= temp.length; ++i) {
                if (item.RowID == temp[i].RowID) {
                    if (id == 1)
                        this.setState({ listCongViec: this.state.listCongViec.concat({ ...item, ...temp[i], check: true }) })
                    if (id == 2)
                        this.setState({ listNhanSu: this.state.listNhanSu.concat({ ...item, ...temp[i], check: true }) })
                    if (id == 3)
                        this.setState({ listYeuCau: this.state.listYeuCau.concat({ ...item, ...temp[i], check: true }) })
                    if (id == 4)
                        this.setState({ listHanhChinh: this.state.listHanhChinh.concat({ ...item, ...temp[i], check: true }) })
                    if (id == 5)
                        this.setState({ listCuocHop: this.state.listCuocHop.concat({ ...item, ...temp[i], check: true }) })
                    return
                } else {
                    if (i == temp.length - 1)
                        return
                }

            }
        })
    }

    _layMenuChucNang_MobileApp = async () => {
        const res = await LayMenuChucNang_MobileApp()
        // Utils.nlog('res: ', res)
        if (res.status == 1) {
            nthisLoading.hide()
            await res.data?.map(item => {
                this.ganItem(item.RowID, item.Child)
            })
            await Utils.nsetStorage(nkey.menuCongViec, this.state.listCongViec)
            await Utils.nsetStorage(nkey.menuHanhChinh, this.state.listHanhChinh)
            await Utils.nsetStorage(nkey.menuNhanSu, this.state.listNhanSu)
            await Utils.nsetStorage(nkey.menuYeuCau, this.state.listYeuCau)
            await Utils.nsetStorage(nkey.menuCuocHop, this.state.listCuocHop)
        } else {
            nthisLoading.hide()
            // UtilsApp.MessageShow(RootLang.lang.JeeWork.thongbao, res.error ? res.error.message : RootLang.lang.JeeWork.laydulieuthatbai, 2)
        }

    }

    _goback = () => {
        Utils.goback(this, null)
        return true;
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: colors.backgroudJeeHR }}>
                <HeaderAnimationJee
                    nthis={this}
                    title={RootLang.lang.thongbaochung.tatcachucnang}
                    iconLeft={Images.ImageJee.icBack}
                    onPressLeft={this._goback}
                    styBorder={{
                        borderBottomColor: colors.black_20,
                        borderBottomWidth: 0.5
                    }}
                />
                <ScrollView style={{ marginBottom: Platform.OS == 'ios' ? 10 : 0, flex: 1, }} contentContainerStyle={{ flexGrow: 1 }}>
                    {this.state.listCongViec.length > 0 || this.listCongViec.length > 0 ? (
                        <ComponentAllMenu nthis={this} text={RootLang.lang.thongbaochung.congviec} menu={this.listCongViec.length > 0 ? this.listCongViec : this.state.listCongViec} color={colors.colorJeeNew.colorOragneHome} />
                    ) : (null)}
                    {this.state.listNhanSu.length > 0 || this.listNhanSu.length > 0 ? (
                        <ComponentAllMenu nthis={this} text={RootLang.lang.thongbaochung.nhansu} menu={this.listNhanSu.length > 0 ? this.listNhanSu : this.state.listNhanSu} color={colors.colorJeeNew.colorRedHome} />
                    ) : (null)}
                    {this.state.listYeuCau.length > 0 || this.listYeuCau.length > 0 ? (
                        <ComponentAllMenu nthis={this} text={RootLang.lang.thongbaochung.yeucau} menu={this.listYeuCau.length > 0 ? this.listYeuCau : this.state.listYeuCau} color={colors.colorJeeNew.colorBlueHome} />
                    ) : (null)}
                    {this.state.listHanhChinh.length > 0 || this.listHanhChinh.length > 0 ? (
                        <ComponentAllMenu nthis={this} text={RootLang.lang.thongbaochung.hanhchinh} menu={this.listHanhChinh.length > 0 ? this.listHanhChinh : this.state.listHanhChinh} color={colors.colorJeeNew.colorGreenHome} />
                    ) : (null)}
                    {this.state.listCuocHop.length > 0 || this.listCuocHop.length > 0 ? (
                        <ComponentAllMenu nthis={this} text={RootLang.lang.thongbaochung.quanlyhop} menu={this.listCuocHop.length > 0 ? this.listCuocHop : this.state.listCuocHop} color={colors.colorJeeNew.colorPink2} />
                    ) : (null)}
                    <IsLoading />
                </ScrollView>
            </View >
        );
    }
};


const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(AllMenu, mapStateToProps, true)

