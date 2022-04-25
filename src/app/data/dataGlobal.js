import { appConfig } from "../Config";
// import io from 'socket.io-client';


// -- Value data Global dùng để dùng như một biến state toàn cục của App.
// -- Biến rootGlobal sẽ tồn tại khi app Start và mất khi Skill App.


// Biến Gốc chứa giá trị con.
const ROOTGlobal = {
    "keys": { "a": 1, "b": 2 }, // key Demo
    loginToken: '',
    avatarUser: undefined,
    nameUser: '',
    //--khởi tạo socket
    // socket: appConfig.isSocketConnect ? io.connect('https://abc.com', {
    //     transports: ['websocket']
    // }) : {},
    //--end socket
    store: { state: {} },
    dataAppGlobal: {},
    Common: {
        checkversion: () => { },
    },
    QLCNPhep: {
        refreshphep: () => { },
    },
    Common: {
        checkversion: () => { },
    },
    QLDuyetPhep: {
        refreshphep: () => { },
    },
    QLCNTangCa: {
        refreshtangca: () => { },
    },
    QLDuyetTangCa: {
        refreshTangca: () => { },
    },
    QLDoiCa: {
        refreshDSDoiCa: () => { },
    },
    QLDuyetDoiCa: {
        refreshDSDoiCa: () => { },
    },
    GTChamCong: {
        getDSGTChiTiet: () => { },
        getDSGT: () => { }
    },
    QLGiaiTrinh: {
        getDSGiaiTrinh: () => {

        }
    },
    AuthSuccess: {
        authsuccess: () => { },
    },
    LoadDanhSachBaiDang: {
        LoadDSBaiDang: () => { },
    },
    setIndexTab: {
        setIndex: (item) => { },
    },
    LoadDanhSachBaiDang_Nhom: {
        LoadDSBaiDang_Nhom: () => { },
        LoadDSBaiDang_InNhom: () => { },
        LoadDSBaiDang_Loc: () => { },
        GetDSUser_Group: () => { }
    },
    LoadDanhSachGroup: {
        LoadDSGroup: () => { },
    },
    LoadDanhSach_Member: {
        LoadDSMember: () => { },
    },
    LoadDanhSach_Comment: {
        LoadDSCMT: () => { },
    },
    Test: {
        TestTest: () => { }
    },
    LoadDanhSach_CeoLetter: {
        LoadDSCeo: () => { },
        LoadDSChiTiet_Ceo: () => { },
    },
    GetMenuThuongDung: {
        GetMenuTD: () => { },
    },
    // GetDuLieuChamCong: {
    //     GetDLCC: () => { },
    // },
    GetDSCongViecDaGiao: {
        GetDSCVDG: () => { }
    },
    GetListMessage: {
        GetListMess: () => { }
    },
    GetListDanhBa: {
        GetListDB: () => { }
    },
    GetMemberGroup: {
        GetMember: () => { }
    },
    GetChiTietCuocHop: {
        LoadChiTietCuocHop: () => { }
    },
    GetSoLuongTongHop: {
        GetSLTongHop: () => { }
    },
    GetSoLuongNhacNho: {
        GetSLNhacNho: () => { }
    },
    GetTinNoiBat: {
        GetTinnoiBat: () => { }
    },
    GetCongViecLapLaiTuan: {
        GetCVLapLaiTuan: () => { }
    },
    GetCongViecLapLaiThang: {
        GetCVLapLaiThang: () => { }
    },
};

// -- Các hàm xử lý thao tác với biến gốc ROOTGlobal

// Hàm get giá trị theo keys - read only. Giá trị thay đổi không làm thay đổi giá trị root
function AppgetGlobal(keys, defaultValue) {
    let temmp = ROOTGlobal[keys];
    return temmp == undefined ? defaultValue : JSON.parse(JSON.stringify(temmp));
}

// Hàm get giá trị gốc theo keys - read write. Giá trị thay đổi làm thay đổi giá trị root
function AppgetRootGlobal(keys, defaultValue) {
    let temmp = ROOTGlobal[keys];
    return temmp == undefined ? defaultValue : temmp;
}

// Hàm khởi tạo một biến gốc, hay thay đổi một gốc.
function AppsetGlobal(keys, value) {
    ROOTGlobal[keys] = value;
}

export { AppgetGlobal, AppgetRootGlobal, AppsetGlobal, ROOTGlobal };

