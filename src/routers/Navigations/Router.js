//Công Việc Cá Nhân

import CongViecCaNhan from '../../scJee/CongViec/CongViecCaNhan/TabCongViecCaNhan'
import HomeGiaoViec from '../../scJee/CongViec/GiaoViec/HomeGiaoViec'
import LichSuHoanThanh from '../../scJee/CongViec/GiaoViec/LichSuHoanThanh'
import AllMenu from '../../scJee/home/AllMenu/AllMenu'
import MDTuyChinhMenu from '../../scJee/home/MenuSetting/MDTuyChinhMenu'
import CalandaSingalComViTri from '../../components/CalandaSingalComViTri'
import MDListMenu from '../../scJee/home/MenuSetting/MDListMenu'
import CustomMenu from '../../scJee/home/MenuSetting/CustomMenu'
import ChuaHoanThanh from '../../scJee/CongViec/CongViecCaNhan/ChuaHoanThanh/ChuaHoanThanh'
import HetHan_DenHan from '../../scJee/CongViec/CongViecCaNhan/HetHan_DenHan/DenHan_HetHan'
import TatCa from '../../scJee/CongViec/QuanLyDuAn/TatCa'


// Yêu Cầu 
import DSYeuCau from '../../scJee/YeuCau/GuiYeuCau/DSYeuCau'
import ChiTietYeuCau from '../../scJee/YeuCau/GuiYeuCau/ChiTietYeuCau'
import LoaiHinhThuc from '../../scJee/YeuCau/GuiYeuCau/LoaiHinhThuc'
import LoaiYeuCau from '../../scJee/YeuCau/CaiDatYeuCau/LoaiYeuCau'
import ChiTietLoaiYC from '../../scJee/YeuCau/CaiDatYeuCau/ChiTietLoaiYC'
import GuiYeuCau from '../../scJee/YeuCau/GuiYeuCau/GuiYeuCau'
import DSDuyetYeuCau from '../../scJee/YeuCau/DuyetYeuCau/DSDuyetYeuCau'
import MauYC from '../../scJee/YeuCau/CaiDatYeuCau/ModalCatDatYeuCau/ModalMauYeuCau'
import ThemNhom from '../../scJee/YeuCau/CaiDatYeuCau/ModalCatDatYeuCau/ModalThemNhom'
import ThemLoai from '../../scJee/YeuCau/CaiDatYeuCau/ModalCatDatYeuCau/ModalThemLoai'

//Nhân sự

/* Nghỉ phép công tác */
import NghiPhep from '../../scJee/NhanSu/GuiPhep/NghiPhep'
import ModalChiTietNghiPhep from '../../scJee/NhanSu/GuiPhep/ModalChiTietNghiPhep'
import ModalChiTietSophep from '../../scJee/NhanSu/GuiPhep/ModalChiTietSophep'
import ModalNghiPhep from '../../scJee/NhanSu/GuiPhep/ModalNghiPhep'

/* Tăng ca */
import Dktca from '../../scJee/NhanSu/TangCa/Dktca'
import DsTangca from '../../scJee/NhanSu/TangCa/DsTangca'
import ModalTangCa from '../../scJee/NhanSu/TangCa/ModalTangCa'
import DetailsDoiCa from '../../scJee/NhanSu/TangCa/DetailsDoiCa'
/* Đổi ca */
import DoiCaLamViec from '../../scJee/NhanSu/DoiCaLamViec/DoiCaLamViec'
import ModalChiTietDCLV from '../../scJee/NhanSu/DoiCaLamViec/ModalChiTietDCLV'
import ModalDoiCaLamViec from '../../scJee/NhanSu/DoiCaLamViec/ModalDoiCaLamViec'
/* Bảng Công  */
import BangChamCongRoot from '../../scJee/NhanSu/BangChamCong/BangChamCongRoot'
import ModalCongChiTiet from '../../scJee/NhanSu/BangChamCong/ModalCongChiTiet'
import ModalNgayCongDangDung from '../../scJee/NhanSu/BangChamCong/ModalNgayCongDangDung'
import ModalChamCong from '../../scJee/NhanSu/BangChamCong/ModalChiTietChamCongNgay'
import ModalCongNgay from '../../scJee/NhanSu/BangChamCong/ModalCongNgay'


/* Bảng Lương */
import BangLuongChiTiet from '../../scJee/NhanSu/BangLuong/BangLuongChiTiet'

/* Quản Lý Nhân Viên */
import QuanLyNhanVien from '../../scJee/NhanSu/QuanLyNhanVien/QuanLyNhanVien'
import ModalChiTietNhanVien from '../../scJee/NhanSu/QuanLyNhanVien/ModalChiTietNhanVien'

/* Phép Tồn Nhân Viên */
import DSPhepTon from '../../scJee/NhanSu/PhepTonNhanVien/DSPhepTon'
import ModalCTDSPhepTon from '../../scJee/NhanSu/PhepTonNhanVien/ModalCTPhepTon'

/*Giải trình chấm công */
import GTChamCong from '../../scJee/NhanSu/GiaiTrinh/GuiGiaiTrinh/GTChamCong'
import EditGiaiTrinh from '../../scJee/NhanSu/GiaiTrinh/GuiGiaiTrinh/EditGiaiTrinh'
import Modal_GiaiTrinh from '../../scJee/NhanSu/GiaiTrinh/GuiGiaiTrinh/Modal_GiaiTrinh'
import ChiTietGiaiTrinh from '../../scJee/NhanSu/GiaiTrinh/GuiGiaiTrinh/ChiTietGiaiTrinh'

/* Quản lý chấm công */
import QuanLyChamCong from '../../scJee/NhanSu/QuanLyChamCong/QuanLyChamCong'
import QuanLyCCWifi from '../../scJee/NhanSu/QuanLyChamCong/ChamCongWifi/QuanLyCCWifi'
import QuanLyCCViTri from '../../scJee/NhanSu/QuanLyChamCong/ChamCongViTri/QuanLyCCViTri'

import QuanLyDuyet from '../../scJee/NhanSu/QuanLyDuyet/DuyetDon/QuanLyDuyet'
import DSDuyet from '../../scJee/NhanSu/QuanLyDuyet/DuyetDon/DSDuyetDon'
import ModalChiTietConfigViTri from '../../scJee/NhanSu/QuanLyChamCong/ChamCongViTri/ModalChiTietConfigViTri'
import BanDo from '../../scJee/NhanSu/QuanLyChamCong/ChamCongViTri/BanDo'
/* Quan Ly Duyet */
import CT_DoiCalamViec from '../../scJee/NhanSu/QuanLyDuyet/DuyetDon/CT_DoiCaLamViec'
import CT_GiaiTrinhChamCong from '../../scJee/NhanSu/QuanLyDuyet/DuyetDon/CT_GiaiTrinhChamCong'
import CT_NghiPhepNam from '../../scJee/NhanSu/QuanLyDuyet/DuyetDon/CT_NghiPhepNam'
import CT_TangCa from '../../scJee/NhanSu/QuanLyDuyet/DuyetDon/CT_TangCa'
import CT_ThoiViec from '../../scJee/NhanSu/QuanLyDuyet/DuyetDon/CT_ThoiViec'
import CT_TuyenDung from '../../scJee/NhanSu/QuanLyDuyet/DuyetDon/CT_TuyenDung'
import ModalTimKiem from '../../scJee/NhanSu/QuanLyDuyet/DuyetDon/ModalTimKiem'
// Chấm công
import DSDangKyFace from '../../scJee/NhanSu/ChamCong/ChamCongUser/DSDangKyFace'
import ModalTongHopNgay from '../../scJee/NhanSu/TongHop/ModalTongHopNgay'
{/* Social*/ }
import BinhLuan from '../../scJee/Social/BinhLuan/BinhLuan'
import LocBaiDang from '../../scJee/Social/LocBaiDang/LocBaiDang'
import TaoBaiDangTheoLoai from '../../scJee/Social/BaiDang/TaoBaiDangTheoLoai'
import TaoBaiVietMoi from '../../scJee/Social/BaiDang/TaoBaiVietMoi'
import ComponentSelectCom_Cus from '../../Component_old/ComponentSelectCom_Cus'
import ModalUserTag from '../../scJee/Social/BaiDang/Modal_UserTag'
import HomeSuKien from '../../scJee/Social/SuKien/HomeSuKien'
import ChiTietSuKien from '../../scJee/Social/SuKien/ChiTietSuKien'
import TaoBaiDang_CEO from '../../scJee/Social/CongTy/TaoBaiDang_CEO'
import XemBaiDangTrongNhom from '../../scJee/Social/Nhom/XemBaiDangTrongNhom'
import TimKiem_ThanVienNhom from '../../scJee/Social/Nhom/TimKiem_ThanVienNhom'
import TimKiemNhom from '../../scJee/Social/Nhom/TimKiemNhom'
import TaoNhom from '../../scJee/Social/Nhom/TaoNhom'
import HomeTinTuc from '../../scJee/Social/TinTuc/HomeTinTuc'
import ChiTiet_CEO_Letter from '../../scJee/Social/CongTy/ChiTiet_CEO_Letter'
import ThemThanhVien from '../../scJee/Social/Nhom/ThemThanhVien'
import XemBaiDangLoc from '../../scJee/Social/LocBaiDang/XemBaiDangLoc'
import Modal_EditBinhLuan from '../../scJee/Social/BinhLuan/Modal_EditBinhLuan'
import Modal_EditBaiDang from '../../scJee/Social/BaiDang/Modal_EditBaiDang'
import ChiTietTinTuc from '../../scJee/Social/TinTuc/ChiTietTinTuc'
import Modal_EditCEOLetter from '../../scJee/Social/CongTy/Modal_EditCEOLetter'
import HomeSocial from '../../scJee/Social/Home/HomeSocial'
import BinhLuanCon from '../../scJee/Social/BinhLuan/BinhLuanCon'
import ChiTietSocailNoti from '../../scJee/Social/ChiTietNoti/ChiTietSocialNoti'
import Modal_ShowUserTag from '../../scJee/Social/ModalSocial/Modal_ShowUserTag'
import ModalTinNoiBat from '../../scJee/home/ModalTinNoiBat'
import Modal_ShowEmoji from '../../scJee/Social/ModalSocial/Modal_ShowEmoji'
import XemAnh_File from '../../scJee/Social/Nhom/XemAnh_File'
import Modal_EditTenGroup from '../../scJee/Social/Nhom/Modal_EditTenGroup'

//công việc
import ChiTiet_TongQuan from '../../scJee/CongViec/ChiTiet_TongQuan/ChiTiet_TongQuan'
import ChiTiet_TongQuanCon from '../../scJee/CongViec/ChiTiet_TongQuan/ChiTiet_TongQuanCon'

import ChonDuAn from '../../scJee/CongViec/DuAn/ChonDuAn'
import NhanVienDuAn from '../../scJee/CongViec/NhanVienDuAn/NhanVienDuAn'
import TaoGiaoViec from '../../scJee/CongViec/CongViecCaNhan/TaoGiaoViec'
import BoLoc from '../../scJee/CongViec/ChiTiet_TongQuan/BoLoc'
import TabQuanLyDuAn from '../../scJee/CongViec/QuanLyDuAn/TabQuanLyDuAn'
import BoLocDuAn from '../../scJee/CongViec/QuanLyDuAn/BoLocDuAn'
import BoLocGiaoViec from '../../scJee/CongViec/GiaoViec/BoLocGiaoViec'
import ChiTietDuAn from '../../scJee/CongViec/QuanLyDuAn/ChiTietDuAn/ChiTietDuAn'
import ViecNhanVienCapDuoi from '../../scJee/CongViec/ViecNhanVienCapDuoi/ViecNhanVienCapDuoi'
import BoLocViecTheoDoi from '../../scJee/CongViec/CongViecTheoDoi/BoLocViecTheoDoi'
import BoLocNVCapDuoi from '../../scJee/CongViec/ViecNhanVienCapDuoi/BoLocNVCapDuoi'
import CongViecTheoDoi from '../../scJee/CongViec/CongViecTheoDoi/CongViecTheoDoi'
import BoLocChiTietDuAn from '../../scJee/CongViec/QuanLyDuAn/ChiTietDuAn/BoLocChiTietDuAn'
import BoLocQuyTrinh from '../../scJee/CongViec/CongViecQuyTrinh/BoLocQuyTrinh'

import CVHetHanTrongNgay from '../../scJee/CongViec/CVHetHanTrongNgay/DanhSachHetHan'
import ChiTietCongViecQuyTrinh from '../../scJee/CongViec/CongViecQuyTrinh/ChiTietCongViecQuyTrinh'
// Component
import ComponentSelect from '../../Component_old/ComponentSelect'
import CalandaCom from '../../components/CalandaCom'
import CalandaComTime from '../../components/CalandaComTime'

import GioPhutPicker from '../../Component_old/GioPhutPicker'
import GioPhutPickerBasic from '../../Component_old/GioPhutPickerBasic'
import MsgBox from '../../components/MsgBox'
import CalandaSingalCom from '../../components/CalandaSingalCom'
import ComponentSelectCom from '../../Component_old/ComponentSelectCom'
import GioPhutPickerSingal from '../../Component_old/GioPhutPickerSingal'
import MonthYearPicker from '../../Component_old/MonthYearPicker'
import ComponentSelectTree from '../../Component_old/ComponentSelectTree'
import DropDownCus from '../../Component_old/DropDownCus'
import NgayGioPhutPicker from '../../Component_old/NgayGioPhutPicker'
import NgayGioPhutPickerSingal from '../../Component_old/NgayGioPhutPickerSingal'
import ThongBaoUpdate from '../../Modal/ThongBaoUpdate'
import ViewImageListShow from '../../components/ViewImageListShow'
import ViewImageListShowBase64 from '../../components/ViewImageListShowBase64'
import Devoloping from '../../scJee/Modal/Devoloping'
import MusicPlayer from '../../components/Music/MusicPlayer'
import DownloadFile from '../../components/DownloadFile'
import ChiTietThongBao from '../../scJee/ThongBao/ChiTietThongBao'
import Modal_CTGiaiTrinh from '../../scJee/NhanSu/QuanLyDuyet/DuyetDon/Modal_CTGiaiTrinh'

import MediaPicker from '../../components/MediaPicker'
import PlayMedia from '../../components/PlayMedia'
import ViewImageListShow_PAHT from '../../components/ViewImageListShow_PAHT'
import CamVideoCus from '../../components/CamVideo/CamVideoCus'
import ModalChiTietConfigWifi from '../../scJee/NhanSu/QuanLyChamCong/ChamCongWifi/ModalChiTietConfigWifi'
//chat
import ModalAddMember from '../../scJee/Chat/screen/ModalAddMember'
import ModalEditGroup from '../../scJee/Chat/screen/ModalEditGroup'
import ModalCreateGroup from '../../scJee/Chat/screen/ModalCreateGroup'
import ScreenMain from '../../scJee/Chat/screen/ScreenMain'
import ListMessage from '../../scJee/Chat/screen/ListMessage'
import DanhBa from '../../scJee/Chat/screen/DanhBa'
import ChatMess from '../../scJee/Chat/screen/ChatMess'
import CaiDatThongBao from '../../scJee/Chat/screen/CaiDatThongBao'
import CameraDiemDanhNew from '../../scJee/NhanSu/ChamCong/ChamCongUser/CameraDiemDanhNew'
import ChamCongWifi from '../../scJee/NhanSu/ChamCong/ChamCong-DiemDanh/ChamCongWifi'
import InfoUser from '../../scJee/User/ThongTinCaNhan/InfoUser'
import GuiDonThoiViec from '../../scJee/NhanSu/ThoiViec/GuiDonThoiViec'
import GopYBaoBug from '../../Modal/GopYBaoBug'
import ThongTinUngDung from '../../scJee/NhanSu/user/login/ThongTinUngDung'
import ModalNgonNgu from '../../scJee/NhanSu/user/login/ModalNgonNgu'
import ModalChangePass from '../../scJee/NhanSu/user/login/ModalChangePass'
import ModalChonLoaiThongBao from '../../scJee/ThongBao/ModalChonLoaiThongBao'
// import ModalTinNoiBat from '../../scJee/home/ModalTinNoiBat'
//Meeting
import HomeCuocHop from '../../scJee/Metting/QuanLyHop/HomeCuocHop'
import HomeChiTiet from '../../scJee/Metting/ChiTietCuocHop/HomeChiTiet'
import ModalTaoCuocHop from '../../scJee/Metting/QuanLyHop/TaoCuocHop/ModalTaoCuocHop'
import ModalDKPhongHop from '../../scJee/Metting/QuanLyHop/TaoCuocHop/ModalDKPhongHop'
import ModalNhanVien from '../../scJee/Metting/QuanLyHop/TaoCuocHop/ModalNhanVien'
import ModalDKTaiSan from '../../scJee/Metting/QuanLyHop/TaoCuocHop/ModalDKTaiSan'
import ModalEditText from '../../scJee/Metting/ChiTietCuocHop/Modal/ModalEditText'
import ModalEditHTML from '../../scJee/Modal/ConvertHTML/ModalEditHTML'
import EditHTML from '../../components/EditHTML'
import ForWard from '../../scJee/Chat/screen/ForWard'
import ImageFile from '../../scJee/Chat/screen/ImageFile'
import ListUser from '../../scJee/Metting/ChiTietCuocHop/ListUser'
import HomeChiTietTouch from '../../scJee/Metting/ChiTietCuocHop/HomeChiTietTouch'
//
import ComponentSubmit from '../../components/ComponentSubmit'
import ListCVQuyTrinh from '../../scJee/CongViec/CongViecQuyTrinh/ListCVQuyTrinh'
import TaoGiaoViec_CVQT from '../../scJee/CongViec/CongViecQuyTrinh/TaoCongViec/TaoGiaoViec_CVQT'
import ChonNhanVien from '../../scJee/CongViec/CongViecQuyTrinh/TaoCongViec/ChonNhanVien'
import CongViecChiTiet_QT from '../../scJee/CongViec/CongViecQuyTrinh/TaoCongViec/CongViecChiTiet_QT'
import TabCongViecChiTietQuyTrinh from '../../scJee/CongViec/CongViecQuyTrinh/TaoCongViec/TabCongViecChiTietQuyTrinh'
import ChuyenGiaiDoan_QT from '../../scJee/CongViec/CongViecQuyTrinh/TaoCongViec/ChuyenGiaiDoan_QT'
import GiaoNguoiThucHien from '../../scJee/CongViec/CongViecQuyTrinh/TaoCongViec/GiaoNguoiThucHien'
import HoatDong from '../../scJee/CongViec/CongViecQuyTrinh/TaoCongViec/HoatDong'
import DangKyTaiSan from '../../scJee/HanhChinh/DangKyTaiSan'
import FormDangKyTS from '../../scJee/HanhChinh/FormDangKyTS'
import FormChiTiet from '../../scJee/HanhChinh/FormChiTiet'
import TabCongViecChiTiet from '../../scJee/CongViec/CongViecQuyTrinh/TabCongViecChiTiet'
import QuanLiDangKyTS from '../../scJee/HanhChinh/AdminHanhChinh/QuanLiDangKyTS'
import FormChiTietAdmin from '../../scJee/HanhChinh/AdminHanhChinh/FormChiTietAdmin'
//Tim kiem
import TimKiem from '../../scJee/home/TImKiem/TimKiem'

//Công việc lặp lại
import CongViecLapLai from '../../scJee/CongViec/CongViecLapLai/TabCongViecLapLai'
import TaoCongViecMoi from '../../scJee/CongViec/CongViecLapLai/Modal_CVLL/TaoCongViecMoi'
import PickDataChuKy from '../../scJee/CongViec/CongViecLapLai/Modal_CVLL/PickDataChuKy'
import ThemCVCon from '../../scJee/CongViec/CongViecLapLai/Modal_CVLL/ThemCVCon'
import ThemCVCuThe from '../../scJee/CongViec/CongViecLapLai/Modal_CVLL/ThemCVCuThe'

import PickUser from '../../components/PickUser/PickUser'
import ModalCongViec from '../../scJee/Metting/ChiTietCuocHop/CongViec'
import ModalCongViecMeeting from '../../scJee/CongViec/QuanLyDuAn/ChiTietDuAn/CongViecMeeting'
import ModalDangKyChung from '../../scJee/Metting/QuanLyHop/TaoCuocHop/ModalDangKyChung'

export const Router = {
    CongViecCaNhan, HomeGiaoViec, AllMenu, MDTuyChinhMenu, CustomMenu, CalandaSingalComViTri, DSYeuCau, ChiTietYeuCau, LoaiHinhThuc, ModalChiTietDCLV,
    LoaiYeuCau, NghiPhep, ComponentSelect, GioPhutPicker, GioPhutPickerBasic, MsgBox, ModalChiTietNghiPhep, ModalChiTietSophep, Dktca, DoiCaLamViec,
    ChiTietLoaiYC, BinhLuan, LocBaiDang, TaoBaiDangTheoLoai, TaoBaiVietMoi, ComponentSelectCom_Cus, CalandaCom, CalandaSingalCom,
    ComponentSelectCom, BangChamCongRoot, ModalCongChiTiet, ModalNgayCongDangDung, ModalUserTag, GioPhutPickerSingal,
    HomeSuKien, ChiTietSuKien, TaoBaiDang_CEO, XemBaiDangTrongNhom, TimKiem_ThanVienNhom, TimKiemNhom,
    MauYC, GuiYeuCau, ModalChamCong, MonthYearPicker, ModalCongNgay
    , BangLuongChiTiet, QuanLyNhanVien, ComponentSelectTree, ModalChiTietNhanVien, DSPhepTon, ModalCTDSPhepTon,
    TaoNhom, HomeTinTuc, DSDuyetYeuCau, ThemNhom, ThemLoai, GTChamCong, EditGiaiTrinh, Modal_GiaiTrinh, DropDownCus, NgayGioPhutPicker,
    NgayGioPhutPickerSingal, ChiTietGiaiTrinh, QuanLyCCWifi, QuanLyCCViTri, QuanLyChamCong, ThongBaoUpdate, QuanLyDuyet, DSDuyet,
    CT_DoiCalamViec, CT_GiaiTrinhChamCong, CT_NghiPhepNam, CT_TangCa, CT_ThoiViec, CT_TuyenDung, ModalTimKiem, ChiTiet_CEO_Letter,
    ChiTiet_TongQuan, ChonDuAn, TaoGiaoViec, BoLoc, CalandaComTime, NhanVienDuAn, ThemThanhVien, ViewImageListShow, ViewImageListShowBase64, ChiTiet_TongQuanCon, XemBaiDangLoc, Modal_EditBinhLuan,
    Devoloping, Modal_EditBaiDang, ChiTietTinTuc, TabQuanLyDuAn, ChiTietDuAn, Modal_EditCEOLetter, HomeSocial, BoLocDuAn, BoLocGiaoViec, MusicPlayer,
    ViecNhanVienCapDuoi, BoLocViecTheoDoi, BoLocNVCapDuoi, CongViecTheoDoi, BoLocChiTietDuAn, BinhLuanCon, MDListMenu, ChatMess, CaiDatThongBao,
    DownloadFile, ModalChiTietConfigViTri, BanDo, CameraDiemDanhNew, ChamCongWifi, ChiTietThongBao, InfoUser, Modal_CTGiaiTrinh, GuiDonThoiViec,
    GopYBaoBug, ThongTinUngDung, ModalNgonNgu, ModalChangePass, MediaPicker, ViewImageListShow_PAHT, CamVideoCus, PlayMedia, ModalChonLoaiThongBao, ModalTinNoiBat, ChuaHoanThanh, CVHetHanTrongNgay,
    TatCa, HetHan_DenHan, ChiTietSocailNoti, Modal_ShowUserTag, LichSuHoanThanh, DsTangca, ModalDoiCaLamViec, ListMessage, DanhBa, ScreenMain, ModalCreateGroup, ModalEditGroup, ModalAddMember,
    Modal_ShowEmoji, XemAnh_File, Modal_EditTenGroup, BoLocQuyTrinh,
    HomeCuocHop, HomeChiTiet, ModalTaoCuocHop, ModalDKPhongHop, ModalNhanVien, ModalDKTaiSan, ModalEditText, ModalEditHTML, EditHTML, ForWard, DSDangKyFace, ModalTongHopNgay, ChiTietCongViecQuyTrinh,
    ImageFile, ComponentSubmit, ListCVQuyTrinh, TaoGiaoViec_CVQT, ChonNhanVien, CongViecChiTiet_QT, TabCongViecChiTietQuyTrinh, DangKyTaiSan, FormDangKyTS, FormChiTiet, ChuyenGiaiDoan_QT,
    GiaoNguoiThucHien, HoatDong, TabCongViecChiTiet, ModalChiTietConfigWifi, ListUser, HomeChiTietTouch, TimKiem, QuanLiDangKyTS, FormChiTietAdmin, CongViecLapLai, TaoCongViecMoi, PickDataChuKy, ThemCVCon, PickUser, ThemCVCuThe,
    ModalNghiPhep, ModalTangCa, DetailsDoiCa, ModalCongViec, ModalCongViecMeeting, ModalDangKyChung
}
//modal

