import 'react-native-gesture-handler';
import * as React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { StackRoot } from './StackRoot';
import { Router } from './Router';



const StackModal = createStackNavigator();

export const MainApp = () => {
    return (
        <StackModal.Navigator
            mode={'modal'}
            headerMode={'none'}
            screenOptions={{
                gestureEnabled: false,
                cardStyle: { backgroundColor: 'transparent' },
                animationEnabled: true,
                cardStyleInterpolator: ({ current: { progress } }) => ({
                    cardStyle: {
                        opacity: progress.interpolate({
                            inputRange: [0, 0.5, 0.9, 1],
                            outputRange: [0, 0.25, 0.7, 1],
                        }),
                    },
                    overlayStyle: {
                        opacity: progress.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 0.2],
                            extrapolate: 'clamp',
                        }),
                    },

                }),
                ...TransitionPresets.FadeFromBottomAndroid,
            }}>
            <StackModal.Screen name={'Root'} component={StackRoot} />


            <StackModal.Screen name={'ModalChiTiet_NghiPhep'} component={Router.ModalChiTietNghiPhep} />
            <StackModal.Screen name={'Modal_ChiTietLoaiphep'} component={Router.ModalChiTietSophep} />

            <StackModal.Screen name={'Modal_ChiTietDoiCaLamViec'} component={Router.ModalChiTietDCLV} />

            <StackModal.Screen name={'Modal_ModalCongChiTiet'} component={Router.ModalCongChiTiet} />
            <StackModal.Screen name={"Modal_ModalNgayCongDangDung"} component={Router.ModalNgayCongDangDung} />
            <StackModal.Screen name={"Modal_ChamCong"} component={Router.ModalChamCong} />
            <StackModal.Screen name={"ModalCongNgay"} component={Router.ModalCongNgay} />

            <StackModal.Screen name={"Modal_Dktca"} component={Router.Dktca} />
            <StackModal.Screen name={"Modal_NghiPhep"} component={Router.NghiPhep} />
            <StackModal.Screen name={"Modal_GiaiTrinhChamCong"} component={Router.GTChamCong} />
            <StackModal.Screen name={"Modal_Doicalamviec"} component={Router.DoiCaLamViec} />

            <StackModal.Screen name={"Modal_ChiTietNhanVien"} component={Router.ModalChiTietNhanVien} />
            <StackModal.Screen name={"Modal_CTDS_PhepTon"} component={Router.ModalCTDSPhepTon} />

            <StackModal.Screen name={"Modal_GiaiTrinh"} component={Router.Modal_GiaiTrinh} />
            <StackModal.Screen name={"Modal_TimKiem"} component={Router.ModalTimKiem} />
            <StackModal.Screen name={"Modal_ThemNhomYeuCau"} component={Router.ThemNhom} />
            <StackModal.Screen name={"Modal_ThemLoaiYeuCau"} component={Router.ThemLoai} />
            <StackModal.Screen name={"Modal_MauYC"} component={Router.MauYC} />
            <StackModal.Screen name={"Modal_ChiTietConfigViTri"} component={Router.ModalChiTietConfigViTri} />
            <StackModal.Screen name={"Modal_BanDo"} component={Router.BanDo} />
            {/* <StackModal.Screen name={"Modal_ChiTietSocailNoti"} component={Router.ChiTietSocailNoti} /> */}
            <StackModal.Screen name={"TaoGiaoViec"} component={Router.TaoGiaoViec} />
            <StackModal.Screen name={"Modal_ShowUserTag"} component={Router.Modal_ShowUserTag} />
            <StackModal.Screen name={"Modal_ShowEmoji"} component={Router.Modal_ShowEmoji} />
            <StackModal.Screen name={"Modal_EditTenGroup"} component={Router.Modal_EditTenGroup} />

            <StackModal.Screen name={'sc_BinhLuanCon'} component={Router.BinhLuanCon} />

            {/* Khai báo màn hình modal thì ở đây nha */}

            <StackModal.Screen name={'Modal_CustomMenu'} component={Router.MDTuyChinhMenu} />
            <StackModal.Screen name={'Modal_MDListMenu'} component={Router.MDListMenu} />
            <StackModal.Screen name={'Modal_CalandaSingalComViTri'} component={Router.CalandaSingalComViTri} />
            <StackModal.Screen name={'Modal_ComponentSelectCom_Cus'} component={Router.ComponentSelectCom_Cus} />
            <StackModal.Screen name={"Modal_Select"} component={Router.ComponentSelect} />
            <StackModal.Screen name={"Modal_Calanda"} component={Router.CalandaCom} />
            <StackModal.Screen name={"Modal_CalandaTime"} component={Router.CalandaComTime} />

            <StackModal.Screen name={"Modal_GioPhutPicker"} component={Router.GioPhutPicker} />
            <StackModal.Screen name={"Modal_GioPhutPickerBasic"} component={Router.GioPhutPickerBasic} />
            <StackModal.Screen name={"Modal_MusicPlayer"} component={Router.MusicPlayer} />

            <StackModal.Screen name={"Modal_MsgBox"} component={Router.MsgBox} />
            <StackModal.Screen name={"Modal_CalandaSingalCom"} component={Router.CalandaSingalCom} />
            <StackModal.Screen name={"Modal_ComponentSelectCom"} component={Router.ComponentSelectCom} />
            <StackModal.Screen name={"Modal_UserTag"} component={Router.ModalUserTag} />
            <StackModal.Screen name={"Modal_GioPhutPickerSingal"} component={Router.GioPhutPickerSingal} />

            <StackModal.Screen name={"Modal_MonthYearPicker"} component={Router.MonthYearPicker} />
            <StackModal.Screen name={"Modal_ComponentSelectTree"} component={Router.ComponentSelectTree} />
            <StackModal.Screen name={"Modal_DropDownCus"} component={Router.DropDownCus} />
            <StackModal.Screen name={"Modal_NgayGioPhutPickerSingal"} component={Router.NgayGioPhutPickerSingal} />
            <StackModal.Screen name={"Modal_NgayGioPhutPicker"} component={Router.NgayGioPhutPicker} />
            <StackModal.Screen name={"Modal_ThongBaoUpdate"} component={Router.ThongBaoUpdate} />

            <StackModal.Screen name={"Modal_ViewImageListShow"} component={Router.ViewImageListShow} />
            <StackModal.Screen name={"Modal_ViewImageListShowBase64"} component={Router.ViewImageListShowBase64} />

            <StackModal.Screen name={'sc_ChonDuAnTaoCongViec'} component={Router.ChonDuAn} />
            <StackModal.Screen name={'sc_ChonNhanVienDuAn'} component={Router.NhanVienDuAn} />
            <StackModal.Screen name={"Modal_devoloping"} component={Router.Devoloping} />

            <StackModal.Screen name={'Modal_EditBinh_Luan'} component={Router.Modal_EditBinhLuan} />
            <StackModal.Screen name={'Modal_EditBaiDang'} component={Router.Modal_EditBaiDang} />
            <StackModal.Screen name={'Modal_EditCEOLetter'} component={Router.Modal_EditCEOLetter} />
            <StackModal.Screen name={'Modal_DownloadFile'} component={Router.DownloadFile} />

            <StackModal.Screen name={'CaiDatThongBao'} component={Router.CaiDatThongBao} />

            <StackModal.Screen name={'Modal_GopYBaoBug'} component={Router.GopYBaoBug} />
            <StackModal.Screen name={'Modal_ThongTinUngDung'} component={Router.ThongTinUngDung} />
            <StackModal.Screen name={'Modal_NgonNgu'} component={Router.ModalNgonNgu} />
            <StackModal.Screen name={'Modal_ChangePass'} component={Router.ModalChangePass} />
            <StackModal.Screen name={'Modal_MediaPicker'} component={Router.MediaPicker} />
            <StackModal.Screen name={'Modal_PlayMedia'} component={Router.PlayMedia} />
            <StackModal.Screen name={"Modal_ShowListImage"} component={Router.ViewImageListShow_PAHT} />
            <StackModal.Screen name={"Modal_ViewImageListShow_PAHT"} component={Router.ViewImageListShow_PAHT} />
            <StackModal.Screen name={"ModalCamVideoCus"} component={Router.CamVideoCus} />
            <StackModal.Screen name={"ModalThongBao"} component={Router.CamVideoCus} />

            <StackModal.Screen name={"Modal_TinNoiBat"} component={Router.ModalTinNoiBat} />

            <StackModal.Screen name={"ModalCreateGroup"} component={Router.ModalCreateGroup} />
            {/* Meeting */}
            <StackModal.Screen name={"Modal_TaoCuocHop"} component={Router.ModalTaoCuocHop} />
            <StackModal.Screen name={"Modal_DKPhongHop"} component={Router.ModalDKPhongHop} />
            <StackModal.Screen name={"Modal_NhanVien"} component={Router.ModalNhanVien} />
            <StackModal.Screen name={"Modal_DKTaiSan"} component={Router.ModalDKTaiSan} />
            <StackModal.Screen name={"Modal_EditText"} component={Router.ModalEditText} />
            <StackModal.Screen name={"ModalAddMember"} component={Router.ModalAddMember} />
            <StackModal.Screen name={"ModalEditHTML"} component={Router.ModalEditHTML} />
            <StackModal.Screen name={"Modal_EditHTML"} component={Router.EditHTML} />
            <StackModal.Screen name={"Modal_ForWard"} component={Router.ForWard} />
            <StackModal.Screen name={"Modal_ListUser"} component={Router.ListUser} />
            {/* Chat */}
            <StackModal.Screen name={"Modal_ImageFile"} component={Router.ImageFile} />
            <StackModal.Screen name={"Modal_ComponentSubmit"} component={Router.ComponentSubmit} />
            <StackModal.Screen name={"TaoGiaoViec_CVQT"} component={Router.TaoGiaoViec_CVQT} />
            <StackModal.Screen name={"Modal_ChonNhanVien"} component={Router.ChonNhanVien} />
            <StackModal.Screen name={'Modal_ChuyenGiaiDoan_QT'} component={Router.ChuyenGiaiDoan_QT} />
            <StackModal.Screen name={'Modal_GiaoNguoiThucHien'} component={Router.GiaoNguoiThucHien} />
            {/* JeeHanhChanh */}
            <StackModal.Screen name={"FormDangKyTS"} component={Router.FormDangKyTS} />
            <StackModal.Screen name={"FormChiTiet_Admin"} component={Router.FormChiTietAdmin} />
            <StackModal.Screen name={"FormChiTiet"} component={Router.FormChiTiet} />
            {/* JeeHR đổi UI */}
            <StackModal.Screen name={"ModalDoiCaLamViec"} component={Router.ModalDoiCaLamViec} />
            <StackModal.Screen name={"ModalNghiPhep"} component={Router.ModalNghiPhep} />
            <StackModal.Screen name={"Modal_ChiTietConfigWifi"} component={Router.ModalChiTietConfigWifi} />
            <StackModal.Screen name={"ModalTangCa"} component={Router.ModalTangCa} />
            <StackModal.Screen name={"Modal_DetailsDoiCa"} component={Router.DetailsDoiCa} />
            {/* công việc lặp lại*/}
            <StackModal.Screen name={"Modal_TaoCongViecMoi"} component={Router.TaoCongViecMoi} />
            <StackModal.Screen name={"Modal_PickDataChuKy"} component={Router.PickDataChuKy} />
            <StackModal.Screen name={"Modal_ThemCVCon"} component={Router.ThemCVCon} />
            <StackModal.Screen name={"Modal_ThemCVCuThe"} component={Router.ThemCVCuThe} />
            <StackModal.Screen name={"sc_PickUser"} component={Router.PickUser} />
            <StackModal.Screen name={"ModalCongViec"} component={Router.ModalCongViec} />
            <StackModal.Screen name={"ModalCongViecMeeting"} component={Router.ModalCongViecMeeting} />
            <StackModal.Screen name={"ModalDangKyChung"} component={Router.ModalDangKyChung} />
            <StackModal.Screen name={"Modal_DangKyTaiSan"} component={Router.DangKyTaiSan} />
        </StackModal.Navigator>
    )
}
