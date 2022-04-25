import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import React from 'react';
import JeeNew from '../../scJee/JeeNew';
import QuanLyChamCong from '../../scJee/NhanSu/QuanLyChamCong/QuanLyChamCong';
import QuanLyDuyet from '../../scJee/NhanSu/QuanLyDuyet/DuyetDon/QuanLyDuyet';
import { Router } from './Router';
import { TabMain } from './TabMain';
import RouterNameSceen from './RouterNameSceen';


const stack_DuyetYeuCau = createStackNavigator();
const StackDuyetYeuCau = () => {
    return (
        <stack_DuyetYeuCau.Navigator headerMode={'none'} initialRouteName={'sc_DSDuyetYeuCau'}>
            <stack_DuyetYeuCau.Screen name={'sc_DSDuyetYeuCau'} component={Router.DSDuyetYeuCau} />
            <stack_DuyetYeuCau.Screen name={'sc_ChiTietYeuCau'} component={Router.ChiTietYeuCau} />
            <stack_DuyetYeuCau.Screen name={'sc_GuiYC'} component={Router.GuiYeuCau} />
        </stack_DuyetYeuCau.Navigator>
    )
}
const stack_GuiYeuCau = createStackNavigator();
const StackGuiYeuCau = () => {
    return (
        <stack_GuiYeuCau.Navigator headerMode={'none'} initialRouteName={'sc_DSGuiYeuCau'}>
            <stack_GuiYeuCau.Screen name={'sc_DSGuiYeuCau'} component={Router.DSYeuCau} />
            <stack_GuiYeuCau.Screen name={'sc_LoaiHinhThuc'} component={Router.LoaiHinhThuc} />
            <stack_GuiYeuCau.Screen name={'sc_ChiTietYeuCau'} component={Router.ChiTietYeuCau} />
            <stack_GuiYeuCau.Screen name={'sc_GuiYC'} component={Router.GuiYeuCau} />
        </stack_GuiYeuCau.Navigator>
    )
}
const stack_CaiDatYeuCau = createStackNavigator();
const StackCaiDatYeuCau = () => {
    return (
        <stack_CaiDatYeuCau.Navigator headerMode={'none'} initialRouteName={'sc_LoaiYeuCau'}>
            <stack_CaiDatYeuCau.Screen name={'sc_LoaiYeuCau'} component={Router.LoaiYeuCau} />
            <stack_CaiDatYeuCau.Screen name={'sc_ChiTietLoaiYC'} component={Router.ChiTietLoaiYC} />
        </stack_CaiDatYeuCau.Navigator>
    )
}


const stackCCCaNhan = createStackNavigator();
const StackCCCaNhan = () => {
    return (
        <stackCCCaNhan.Navigator headerMode={'none'} initialRouteName={'sc_CongViecCaNhan'}>
            <stackCCCaNhan.Screen name={'sc_CongViecCaNhan'} component={Router.CongViecCaNhan} />
            <stackCCCaNhan.Screen name={'sc_BoLoc'} component={Router.BoLoc} />
            <stackCCCaNhan.Screen name={'sc_BoLocQuyTrinh'} component={Router.BoLocQuyTrinh} />
            <stackCCCaNhan.Screen name={'sc_ChiTietCongViecCaNhan'} component={Router.ChiTiet_TongQuan} />
            <stackCCCaNhan.Screen name={'sc_ChiTietCongViecCaNhanCon'} component={Router.ChiTiet_TongQuanCon} />
            <stackCCCaNhan.Screen name={'sc_ChiTietCongViecQuyTrinh'} component={Router.ChiTietCongViecQuyTrinh} />
            <stackCCCaNhan.Screen name={'sc_CongViecChiTiet_QT'} component={Router.CongViecChiTiet_QT} />
            <stackCCCaNhan.Screen name={'sc_TabCongViecChiTietQuyTrinh'} component={Router.TabCongViecChiTietQuyTrinh} />
            <stackCCCaNhan.Screen name={'sc_TabCongViecChiTiet'} component={Router.TabCongViecChiTiet} />
            <stackCCCaNhan.Screen name={'sc_HoatDong'} component={Router.HoatDong} />
        </stackCCCaNhan.Navigator>
    )
}

const stackCVLapLai = createStackNavigator();
const StackCVLapLai = () => {
    return (
        <stackCVLapLai.Navigator headerMode={'none'} initialRouteName={'sc_CongViecLapLai'}>
            <stackCVLapLai.Screen name={'sc_CongViecLapLai'} component={Router.CongViecLapLai} />
        </stackCVLapLai.Navigator>
    )
}


const stackCCCaNhanQuaHan = createStackNavigator();
const StackCCCaNhanQuaHan = () => {
    return (
        <stackCCCaNhanQuaHan.Navigator headerMode={'none'} initialRouteName={'sc_QuaHan'}>
            <stackCCCaNhanQuaHan.Screen name={'sc_QuaHan'} component={Router.HetHan_DenHan} />
            <stackCCCaNhanQuaHan.Screen name={'sc_BoLoc'} component={Router.BoLoc} />
            <stackCCCaNhanQuaHan.Screen name={'sc_ChiTietCongViecCaNhan'} component={Router.ChiTiet_TongQuan} />
            <stackCCCaNhanQuaHan.Screen name={'sc_ChiTietCongViecCaNhanCon'} component={Router.ChiTiet_TongQuanCon} />
        </stackCCCaNhanQuaHan.Navigator>
    )
}

const stackCCCaNhanChuaHT = createStackNavigator();
const StackCCCaNhanChuaHT = () => {
    return (
        <stackCCCaNhanChuaHT.Navigator headerMode={'none'} initialRouteName={'sc_ChuaHoanThan'}>
            <stackCCCaNhanChuaHT.Screen name={'sc_ChuaHoanThan'} component={Router.ChuaHoanThanh} />
            <stackCCCaNhanChuaHT.Screen name={'sc_BoLoc'} component={Router.BoLoc} />
            <stackCCCaNhanChuaHT.Screen name={'sc_ChiTietCongViecCaNhan'} component={Router.ChiTiet_TongQuan} />
            <stackCCCaNhanChuaHT.Screen name={'sc_ChiTietCongViecCaNhanCon'} component={Router.ChiTiet_TongQuanCon} />
        </stackCCCaNhanChuaHT.Navigator>
    )
}

const stackCVHetHanTrongNgay = createStackNavigator();
const StackCVHetHanTrongNgay = () => {
    return (
        <stackCVHetHanTrongNgay.Navigator headerMode={'none'} initialRouteName={'sc_CVHetHanTrongNgay'}>
            <stackCVHetHanTrongNgay.Screen name={'sc_CVHetHanTrongNgay'} component={Router.CVHetHanTrongNgay} />
            <stackCVHetHanTrongNgay.Screen name={'sc_ChiTietCongViecCaNhan'} component={Router.ChiTiet_TongQuan} />
            <stackCVHetHanTrongNgay.Screen name={'sc_ChiTietCongViecCaNhanCon'} component={Router.ChiTiet_TongQuanCon} />
        </stackCVHetHanTrongNgay.Navigator>
    )
}


const stackGiaoViec = createStackNavigator();
const StackGiaoViec = () => {
    return (
        <stackGiaoViec.Navigator headerMode={'none'} initialRouteName={'sc_GiaoViec'}>
            <stackGiaoViec.Screen name={'sc_GiaoViec'} component={Router.HomeGiaoViec} />
            <stackGiaoViec.Screen name={'sc_LichSuHoanThanh'} component={Router.LichSuHoanThanh} />
            {/* <stackGiaoViec.Screen name={'sc_BoLocGiaoViec'} component={Router.BoLocGiaoViec} /> */}
            <stackGiaoViec.Screen name={'sc_BoLoc'} component={Router.BoLoc} />
            <stackGiaoViec.Screen name={'sc_ChiTietCongViecCaNhan'} component={Router.ChiTiet_TongQuan} />
            <stackGiaoViec.Screen name={'sc_ChiTietCongViecCaNhanCon'} component={Router.ChiTiet_TongQuanCon} />
        </stackGiaoViec.Navigator>
    )


}
// const stackChiTietDuan = createStackNavigator();
// const StackCTDuAn = () => {
//     return (
//         <stackChiTietDuan.Navigator headerMode={'none'} initialRouteName={'sc_ChiTietDuAn'}>
//             <stackChiTietDuan.Screen name={'sc_ChiTietDuAn'} component={Router.ChiTietDuAn} />
//         </stackChiTietDuan.Navigator>
//     )
// }


const stack_AllMenu = createStackNavigator();
const StackAllMenu = () => {
    return (
        <stack_AllMenu.Navigator headerMode={'none'} initialRouteName={'sc_AllMenu'}>
            <stack_AllMenu.Screen name={'sc_AllMenu'} component={Router.AllMenu} />
            <stack_AllMenu.Screen name={'CustomMenu'} component={Router.CustomMenu} />
        </stack_AllMenu.Navigator>
    )
}

const stack_NghiPhep = createStackNavigator();
const StackNghiPhep = () => {
    return (
        <stack_NghiPhep.Navigator headerMode={'none'} initialRouteName={'sc_NghiPhep'}>
            <stack_NghiPhep.Screen name={'sc_NghiPhep'} component={Router.NghiPhep} />
            <stack_NghiPhep.Screen name={'Modal_ChiTietNghiPhep'} component={Router.ModalChiTietNghiPhep} />
        </stack_NghiPhep.Navigator>
    )
}

const stack_TangCa = createStackNavigator();
const StackTangca = () => {
    return (
        <stack_TangCa.Navigator headerMode={'none'} initialRouteName={'sc_Tangca'}>
            <stack_TangCa.Screen name={'sc_Tangca'} component={Router.Dktca} />
            <stack_TangCa.Screen name={'dstangca'} component={Router.DsTangca} />
            <stack_TangCa.Screen name={'DetailsDoiCa'} component={Router.DetailsDoiCa} />
        </stack_TangCa.Navigator>
    )
}

const stack_DoiCa = createStackNavigator();
const StackDoiCa = () => {
    return (
        <stack_DoiCa.Navigator headerMode={'none'} initialRouteName={'sc_DoiCaLamViec'}>
            <stack_DoiCa.Screen name={'sc_DoiCaLamViec'} component={Router.DoiCaLamViec} />
            <stack_DoiCa.Screen name={'ModalChiTietDCLV'} component={Router.ModalChiTietDCLV} />
        </stack_DoiCa.Navigator>
    )
}

const stack_ModalChiTietDCLV = createStackNavigator();
const StackModalChiTietDCLV = () => {
    return (
        <stack_ModalChiTietDCLV.Navigator headerMode={'none'} initialRouteName={'sc_ChiTietDoiCaLV'}>
            <stack_ModalChiTietDCLV.Screen name={'sc_ChiTietDoiCaLV'} component={Router.ModalChiTietDCLV} />
        </stack_ModalChiTietDCLV.Navigator>
    )
}

const stack_BangCong = createStackNavigator();
const StackBangCong = () => {
    return (
        <stack_BangCong.Navigator headerMode={'none'} initialRouteName={'sc_BangCong'}>
            <stack_BangCong.Screen name={'sc_BangCong'} component={Router.BangChamCongRoot} />
        </stack_BangCong.Navigator>
    )
}

const stack_BangLuong = createStackNavigator();
const StackBangLuong = () => {
    return (
        <stack_BangLuong.Navigator headerMode={'none'} initialRouteName={'sc_BangLuongChiTiet'}>
            <stack_BangLuong.Screen name={'sc_BangLuongChiTiet'} component={Router.BangLuongChiTiet} />
        </stack_BangLuong.Navigator>
    )
}

const stack_QuanLyNhanVien = createStackNavigator();
const StackQuanLyNhanVien = () => {
    return (
        <stack_QuanLyNhanVien.Navigator headerMode={'none'} initialRouteName={'sc_QuanLyNhanVien'}>
            <stack_QuanLyNhanVien.Screen name={'sc_QuanLyNhanVien'} component={Router.QuanLyNhanVien} />
        </stack_QuanLyNhanVien.Navigator>
    )
}


const stack_PhepTonNhanVien = createStackNavigator();
const StackPhepTonNhanVien = () => {
    return (
        <stack_PhepTonNhanVien.Navigator headerMode={'none'} initialRouteName={'sc_PhepTonNhanVien'}>
            <stack_PhepTonNhanVien.Screen name={'sc_PhepTonNhanVien'} component={Router.DSPhepTon} />
        </stack_PhepTonNhanVien.Navigator>
    )
}


const stack_GiaiTrinhChamChong = createStackNavigator();
const StackGiaiTrinhChamCong = () => {
    return (
        <stack_GiaiTrinhChamChong.Navigator headerMode={'none'} initialRouteName={'sc_GTChamCong'}>
            <stack_GiaiTrinhChamChong.Screen name={'sc_GTChamCong'} component={Router.GTChamCong} />
            <stack_GiaiTrinhChamChong.Screen name={"sc_EditGiaiTrinh"} component={Router.EditGiaiTrinh} />
            <stack_GiaiTrinhChamChong.Screen name={"sc_ChiTietGiaiTrinh"} component={Router.ChiTietGiaiTrinh} />
        </stack_GiaiTrinhChamChong.Navigator>
    )
}


const stack_QuanLyChamCong = createBottomTabNavigator();
const StackQuanLyChamCong = ({ navigation, route }) => {
    return (
        <stack_QuanLyChamCong.Navigator tabBar={props => (<QuanLyChamCong {...props} />)} initialRouteName={'sc_ccvitri'}>
            <stack_QuanLyChamCong.Screen name="sc_ccwifi" component={Router.QuanLyCCWifi} />
            <stack_QuanLyChamCong.Screen name="sc_ccvitri" component={Router.QuanLyCCViTri} />
        </stack_QuanLyChamCong.Navigator>
    )
}





const stack_QuanLyDuyetBottom = createBottomTabNavigator();
const StackQuanLyDuyetBottom = ({ navigation, route }) => {
    return (
        <stack_QuanLyDuyetBottom.Navigator tabBar={props => (<QuanLyDuyet {...props} />)} initialRouteName={'sc_homeduyet'}>
            <stack_QuanLyDuyetBottom.Screen name="sc_homeduyet" component={Router.DSDuyet} />
            <stack_QuanLyDuyetBottom.Screen name="sc_homelichsu" component={Router.DSDuyet} />
        </stack_QuanLyDuyetBottom.Navigator>
    )
}
// const stact_ChamCongUser = createStackNavigator();
// const stackChamCongCamera = () => {
//     return (
//         <stact_ChamCongUser.Navigator headerMode={'none'} initialRouteName={'sc_ChamCongCamera'}>
//             <stact_ChamCongUser.Screen name={'sc_ChamCongCamera'} component={Router.CameraDiemDanhNew} />
//         </stact_ChamCongUser.Navigator>
//     )
// }

// const stack_ChamCongWifi = createStackNavigator();
// const stackChamCongWifi = () => {
//     return (
//         <stack_ChamCongWifi.Navigator headerMode={'none'} initialRouteName={'sc_ChamCongWifi'}>
//             <stack_ChamCongWifi.Screen name={'sc_ChamCongWifi'} component={Router.ChamCongWifi} />
//         </stack_ChamCongWifi.Navigator>
//     )
// }




const stack_QuanLyDuyetNotifi = createStackNavigator(); //Phần này chỉ là luồng notifi. fix lỗi init
const stackQuanLyDuyetNotifi = () => {
    return (
        <stack_QuanLyDuyetNotifi.Navigator headerMode={'none'} initialRouteName={'sc_homeduyetNotifi'}>
            <stack_QuanLyDuyetNotifi.Screen name={'sc_homeduyetNotifi'} component={StackQuanLyDuyetBottom} />
            <stack_QuanLyDuyetNotifi.Screen name={"sc_CTDuyetTangCa"} component={Router.CT_TangCa} />
            <stack_QuanLyDuyetNotifi.Screen name={"sc_CTDuyetPhep"} component={Router.CT_NghiPhepNam} />
            <stack_QuanLyDuyetNotifi.Screen name={"sc_ChiTietDuyetGiaiTrinh"} component={Router.CT_GiaiTrinhChamCong} />
            <stack_QuanLyDuyetNotifi.Screen name={"sc_ChiTietThoiViec"} component={Router.CT_ThoiViec} />
            <stack_QuanLyDuyetNotifi.Screen name={"sc_chitietDuyetDoiCa"} component={Router.CT_DoiCalamViec} />
            <stack_QuanLyDuyetNotifi.Screen name={"Modal_CTGiaiTrinh"} component={Router.Modal_CTGiaiTrinh} />
        </stack_QuanLyDuyetNotifi.Navigator>
    )
}

const stack_QuanLyDuyet = createStackNavigator();
const stackQuanLyDuyet = () => {
    return (
        <stack_QuanLyDuyet.Navigator headerMode={'none'} initialRouteName={'sc_homeduyet'}>
            <stack_QuanLyDuyet.Screen name={'sc_homeduyet'} component={Router.DSDuyet} />
            <stack_QuanLyDuyet.Screen name={"sc_CTDuyetTangCa"} component={Router.CT_TangCa} />
            <stack_QuanLyDuyet.Screen name={"sc_CTDuyetPhep"} component={Router.CT_NghiPhepNam} />
            <stack_QuanLyDuyet.Screen name={"sc_ChiTietDuyetGiaiTrinh"} component={Router.CT_GiaiTrinhChamCong} />
            <stack_QuanLyDuyet.Screen name={"sc_ChiTietThoiViec"} component={Router.CT_ThoiViec} />
            <stack_QuanLyDuyet.Screen name={"sc_chitietDuyetDoiCa"} component={Router.CT_DoiCalamViec} />
            <stack_QuanLyDuyet.Screen name={"Modal_CTGiaiTrinh"} component={Router.Modal_CTGiaiTrinh} />
        </stack_QuanLyDuyet.Navigator>
    )
}


const stack_Information = createStackNavigator();
const stackInformation = () => {
    return (
        <stack_Information.Navigator headerMode={'none'} initialRouteName={'sc_Information'}>
            <stack_Information.Screen name={'sc_Information'} component={Router.InfoUser} />
            <stack_Information.Screen name={'sc_ThoiViec'} component={Router.GuiDonThoiViec} />
        </stack_Information.Navigator>
    )
}

const stack_DKFaceNV = createStackNavigator();
const stackDKFaceNV = () => {
    return (
        <stack_DKFaceNV.Navigator headerMode={'none'} initialRouteName={'sc_DangkyFace'}>
            <stack_DKFaceNV.Screen name={'sc_DangkyFace'} component={Router.DSDangKyFace} />
        </stack_DKFaceNV.Navigator>
    )
}





const stackQuanLyDuAn = createStackNavigator();
const StackQuanLyDuAn = () => {
    return (
        <stackQuanLyDuAn.Navigator headerMode={'none'} initialRouteName={'sc_QuanLyDuAn'}>
            <stackQuanLyDuAn.Screen name={'sc_QuanLyDuAn'} component={Router.TabQuanLyDuAn} />
            <stackQuanLyDuAn.Screen name={'BoLocDuAn'} component={Router.BoLocDuAn} />
            <stackQuanLyDuAn.Screen name={'sc_ChiTietDuAn'} component={Router.ChiTietDuAn} />
            <stackQuanLyDuAn.Screen name={'sc_BoLocChiTietDuAn'} component={Router.BoLocChiTietDuAn} />

            <stackQuanLyDuAn.Screen name={'sc_ChiTietCongViecCaNhan'} component={Router.ChiTiet_TongQuan} />
            <stackQuanLyDuAn.Screen name={'sc_ChiTietCongViecCaNhanCon'} component={Router.ChiTiet_TongQuanCon} />

        </stackQuanLyDuAn.Navigator>
    )
}

const stackQuanLyDuAnQuaHan = createStackNavigator();
const StackQuanLyDuAnQuaHan = () => {
    return (
        <stackQuanLyDuAnQuaHan.Navigator headerMode={'none'} initialRouteName={'sc_DuAnQuaHan'}>
            <stackQuanLyDuAnQuaHan.Screen name={'sc_DuAnQuaHan'} component={Router.TatCa} />
            <stackQuanLyDuAnQuaHan.Screen name={'BoLocDuAn'} component={Router.BoLocDuAn} />
            <stackQuanLyDuAnQuaHan.Screen name={'sc_ChiTietDuAn'} component={Router.ChiTietDuAn} />
            <stackQuanLyDuAnQuaHan.Screen name={'sc_BoLocChiTietDuAn'} component={Router.BoLocChiTietDuAn} />
            <stackQuanLyDuAnQuaHan.Screen name={'sc_ChiTietCongViecCaNhan'} component={Router.ChiTiet_TongQuan} />
            <stackQuanLyDuAnQuaHan.Screen name={'sc_ChiTietCongViecCaNhanCon'} component={Router.ChiTiet_TongQuanCon} />

        </stackQuanLyDuAnQuaHan.Navigator>
    )
}



const stackViecNhanVienCapDuoi = createStackNavigator();
const StackViencNhanVienCapDuoi = () => {
    return (
        <stackViecNhanVienCapDuoi.Navigator headerMode={'none'} initialRouteName={'sc_ViecNhanVIenCapDuoi'}>
            <stackViecNhanVienCapDuoi.Screen name={'sc_ViecNhanVIenCapDuoi'} component={Router.ViecNhanVienCapDuoi} />
            <stackViecNhanVienCapDuoi.Screen name={'sc_ChiTietCongViecCaNhan'} component={Router.ChiTiet_TongQuan} />
            <stackViecNhanVienCapDuoi.Screen name={'sc_ChiTietCongViecCaNhanCon'} component={Router.ChiTiet_TongQuanCon} />
            <stackViecNhanVienCapDuoi.Screen name={'sc_BoLocNVCapDuoi'} component={Router.BoLocNVCapDuoi} />
        </stackViecNhanVienCapDuoi.Navigator>
    )
}

const stackCongViecTheoDoi = createStackNavigator();
const StackCongViecTheoDoi = () => {
    return (
        <stackCongViecTheoDoi.Navigator headerMode={'none'} initialRouteName={'sc_CongViecTheoDoi'}>
            <stackCongViecTheoDoi.Screen name={'sc_CongViecTheoDoi'} component={Router.CongViecTheoDoi} />
            {/* <stackCongViecTheoDoi.Screen name={'sc_BoLocCongViecTheoDOi'} component={Router.BoLocViecTheoDoi} /> */}
            <stackCongViecTheoDoi.Screen name={'sc_BoLoc'} component={Router.BoLoc} />
            <stackCongViecTheoDoi.Screen name={'sc_ChiTietCongViecCaNhan'} component={Router.ChiTiet_TongQuan} />
            <stackCongViecTheoDoi.Screen name={'sc_ChiTietCongViecCaNhanCon'} component={Router.ChiTiet_TongQuanCon} />
        </stackCongViecTheoDoi.Navigator>
    )


}


const StackQuanLyCuocHop = createStackNavigator();
const Stack_QuanLyCuocHop = () => {
    return (
        <StackQuanLyCuocHop.Navigator headerMode={'none'} initialRouteName={'sc_QuanLyCuocHop'}>
            <StackQuanLyCuocHop.Screen name={'sc_QuanLyCuocHop'} component={Router.HomeCuocHop} />
            <StackQuanLyCuocHop.Screen name={'sc_ChiTietCuocHop'} component={Router.HomeChiTiet} />
            <StackQuanLyCuocHop.Screen name={'sc_ChiTietCuocHopTouch'} component={Router.HomeChiTietTouch} />
            <StackQuanLyCuocHop.Screen name={'sc_DuAnQuaHan'} component={Router.TatCa} />
            <StackQuanLyCuocHop.Screen name={'BoLocDuAn'} component={Router.BoLocDuAn} />
            <StackQuanLyCuocHop.Screen name={'sc_ChiTietDuAn'} component={Router.ChiTietDuAn} />
            <StackQuanLyCuocHop.Screen name={'sc_BoLocChiTietDuAn'} component={Router.BoLocChiTietDuAn} />
            <StackQuanLyCuocHop.Screen name={'sc_ChiTietCongViecCaNhan'} component={Router.ChiTiet_TongQuan} />
            <StackQuanLyCuocHop.Screen name={'sc_ChiTietCongViecCaNhanCon'} component={Router.ChiTiet_TongQuanCon} />
        </StackQuanLyCuocHop.Navigator>
    )
}


// const StackNotiSocial = createStackNavigator();
// const Stack_NotiSocial = () => {
//     return (
//         <StackNotiSocial.Navigator headerMode={'none'} initialRouteName={"sc_ChiTietSocail"}  >
//             <StackNotiSocial.Screen name={'sc_ChiTietSocail'} component={Router.ChiTietSocailNoti} />
//         </StackNotiSocial.Navigator>
//     )
// }

//làm 1 bản copy của Chat để deeplink 
const StackMessage = createStackNavigator();
const Stack_Message = () => {
    return (
        <StackMessage.Navigator headerMode={'none'} initialRouteName={"sc_ScreenMainCopy"}  >
            {/* {Màn hình chính Messge} */}
            <StackMessage.Screen name={'sc_ScreenMainCopy'} component={Router.ScreenMain} />
            {/* <stackMessage.Screen name={'StackChat'} component={Stack_Chat} /> */}
            <StackMessage.Screen name={'sc_DanhBa'} component={Router.DanhBa} />
            <StackMessage.Screen name={'sc_Message'} component={Router.ListMessage} />
            <StackMessage.Screen name={'ChatMessCopy'} component={Router.ChatMess} />
            <StackMessage.Screen name={'ModalEditGroup'} component={Router.ModalEditGroup} />
        </StackMessage.Navigator>
    )
}
const StackJeeWorkFlow = createStackNavigator();
const Stack_JeeWorkFlow = () => {
    return (
        <StackJeeWorkFlow.Navigator headerMode={'none'} initialRouteName={"sc_ListWorkFlow"}  >
            <StackJeeWorkFlow.Screen name={'sc_ListWorkFlow'} component={Router.ListCVQuyTrinh} />
            <StackJeeWorkFlow.Screen name={'sc_ChiTietCongViecQuyTrinh'} component={Router.ChiTietCongViecQuyTrinh} />
            <StackJeeWorkFlow.Screen name={'sc_BoLocQuyTrinh'} component={Router.BoLocQuyTrinh} />
        </StackJeeWorkFlow.Navigator>
    )
}

const StackJeeHanhChanh = createStackNavigator();
const Stack_JeeHanhChanh = () => {
    return (
        <StackJeeHanhChanh.Navigator headerMode={'none'} initialRouteName={"sc_DangKyTaiSan"}  >
            <StackJeeHanhChanh.Screen name={'sc_DangKyTaiSan'} component={Router.DangKyTaiSan} />
            <StackJeeHanhChanh.Screen name={"chitiet_ts"} component={Router.FormChiTiet} />
        </StackJeeHanhChanh.Navigator>
    )
}

const StackJeeHanhChanhAdmin = createStackNavigator();
const Stack_JeeHanhChanhAdmin = () => {
    return (
        <StackJeeHanhChanhAdmin.Navigator headerMode={'none'} initialRouteName={"sc_QuanLiTaiSan"}  >
            <StackJeeHanhChanhAdmin.Screen name={'sc_QuanLiTaiSan'} component={Router.QuanLiDangKyTS} />
            <StackJeeHanhChanh.Screen name={"chitiet_Admin"} component={Router.FormChiTietAdmin} />
        </StackJeeHanhChanhAdmin.Navigator>
    )
}

const RootStack = createStackNavigator();
const StackMain = () => {
    return (
        <RootStack.Navigator
            initialRouteName={'sw_Root'}
            headerMode={'none'}
            screenOptions={{
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
                ...TransitionPresets.ScaleFromCenterAndroid,
            }}
        >
            {/* Chức năng HomeScreen */}
            <RootStack.Screen name={"sw_Root"} component={JeeNew} />
            <RootStack.Screen name={"sw_HomePage"} component={TabMain} />
            <RootStack.Screen name={"sc_AllMenu"} component={Stack.StackAllMenu} />

            {/* Chức năng của Công Việc  */}
            <RootStack.Screen name={"ManHinh_CongViecCaNhan"} component={Stack.StackCCCaNhan} />
            <RootStack.Screen name={"ManHinh_CongViecLapLai"} component={Stack.StackCVLapLai} />
            <RootStack.Screen name={"sc_QuaHan"} component={Stack.StackCCCaNhanQuaHan} />
            <RootStack.Screen name={"sc_ChuaHoanThanh"} component={Stack.StackCCCaNhanChuaHT} />

            <RootStack.Screen name={"sc_GiaoViec"} component={Stack.StackGiaoViec} />
            <RootStack.Screen name={"sc_QuanLyDuAn"} component={Stack.StackQuanLyDuAn} />
            <RootStack.Screen name={"sc_QuanLyDuAnQuaHan"} component={Stack.StackQuanLyDuAnQuaHan} />
            <RootStack.Screen name={"sc_ViecNhanVIenCapDuoi"} component={Stack.StackViencNhanVienCapDuoi} />
            <RootStack.Screen name={"sc_CongViecTheoDoi"} component={Stack.StackCongViecTheoDoi} />

            <RootStack.Screen name={"sc_CVHetHanTrongNgay"} component={Stack.StackCVHetHanTrongNgay} />

            {/* <RootStack.Screen name={"sc_CVHetHanHomNay"} component={Stack.StackCongViecHetHanHomNay} /> */}




            {/* Chức năng Nhân Sự  */}
            <RootStack.Screen name={"sc_NghiPhep"} component={Stack.StackNghiPhep} />
            <RootStack.Screen name={"sc_TangCa"} component={Stack.StackTangca} />
            <RootStack.Screen name={"sc_DoiCaLamViec"} component={Stack.StackDoiCa} />
            <RootStack.Screen name={"sc_ChiTietDoiCaLV"} component={Stack.StackModalChiTietDCLV} />
            <RootStack.Screen name={"sc_BangChamCong"} component={Stack.StackBangCong} />
            <RootStack.Screen name={"sc_BangLuongChiTiet"} component={Stack.StackBangLuong} />
            <RootStack.Screen name={"sc_QuanLyNhanVien"} component={Stack.StackQuanLyNhanVien} />
            <RootStack.Screen name={"sc_PhepTonNhanVien"} component={Stack.StackPhepTonNhanVien} />
            <RootStack.Screen name={"sc_GTChamCong"} component={Stack.StackGiaiTrinhChamCong} />
            <RootStack.Screen name={"sc_QuanLyChamCong"} component={Stack.StackQuanLyChamCong} />
            <RootStack.Screen name={"sc_QuanLyDuyet"} component={Stack.stackQuanLyDuyet} />
            <RootStack.Screen name={"sc_QuanLyDuyetNotifi"} component={Stack.stackQuanLyDuyetNotifi} />
            <RootStack.Screen name={"sc_ChamCongCamera"} component={Router.CameraDiemDanhNew} />
            <RootStack.Screen name={"sc_ChamCongWifi"} component={Router.ChamCongWifi} />
            <RootStack.Screen name={"sc_Information"} component={Stack.stackInformation} />
            {/* <RootStack.Screen name={"sc_CTDuyetTangCa"} component={Router.CT_TangCa} /> */}

            <RootStack.Screen name={"sc_DKFaceNV"} component={Stack.stackDKFaceNV} />

            <RootStack.Screen name={"sc_MayChamCong"} component={Router.CameraDiemDanhNew} />
            <RootStack.Screen name={"sc_ChamCongNhanVien"} component={Router.CameraDiemDanhNew} />
            <RootStack.Screen name={"sc_TongHopTrongNgay"} component={Router.ModalTongHopNgay} />
            {/* Request */}
            <RootStack.Screen name={"sc_GuiYeuCau"} component={Stack.StackGuiYeuCau} />
            <RootStack.Screen name={"sc_DuyetYeuCau"} component={Stack.StackDuyetYeuCau} />
            <RootStack.Screen name={"sc_CaiDatYeuCau"} component={Stack.StackCaiDatYeuCau} />

            {/* Meeting */}
            <RootStack.Screen name={"sc_HomeCuocHop"} component={Stack.Stack_QuanLyCuocHop} />

            {/* Chat */}
            <RootStack.Screen name={"sc_Chat"} component={Stack.Stack_Message} />
            {/* Noti scocial */}
            <RootStack.Screen name={"sc_ChiTietSocail"} component={Router.ChiTietSocailNoti} />
            {/* Chi tiết công việc quy trình*/}
            <RootStack.Screen name={'sc_JeeWorkFlow'} component={Stack.Stack_JeeWorkFlow} />
            <RootStack.Screen name={'sc_JeeHanhChanh'} component={Stack.Stack_JeeHanhChanh} />
            <RootStack.Screen name={'sc_JeeHanhChanhAdmin'} component={Stack.Stack_JeeHanhChanhAdmin} />
            <RootStack.Screen name={'sc_TimKiem'} component={Router.TimKiem} />
        </RootStack.Navigator>
    )


}









export const Stack = {
    StackCCCaNhan, StackGiaoViec, StackAllMenu,
    StackDuyetYeuCau, StackGuiYeuCau, StackCaiDatYeuCau,
    StackNghiPhep, StackTangca, StackDoiCa, StackBangCong, StackQuanLyChamCong,
    StackBangLuong, StackQuanLyNhanVien, StackPhepTonNhanVien, StackGiaiTrinhChamCong,
    stackQuanLyDuyet, StackQuanLyDuAn, StackViencNhanVienCapDuoi, StackCongViecTheoDoi, StackMain,
    stackInformation, StackCCCaNhanQuaHan, StackCVHetHanTrongNgay,
    StackQuanLyDuAnQuaHan, StackCCCaNhanChuaHT, StackModalChiTietDCLV, Stack_QuanLyCuocHop, Stack_Message, stackDKFaceNV,
    Stack_JeeWorkFlow, Stack_JeeHanhChanh, stackQuanLyDuyetNotifi, Stack_JeeHanhChanhAdmin, StackCVLapLai
}
