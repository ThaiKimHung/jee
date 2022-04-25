import Utils from "../../../app/Utils";
import { appConfig } from '../../../app/ConfigJeePlatform'
import moment from 'moment'

let domainJeeAdmin = appConfig.domainJeeAdmin

//https://jeeadmin-api.jee.vn/api/datphonghop/DS_DatPhongHop?sortOrder=asc&sortField=&page=1&record=10&more=true
//https://jeeadmin-api.jee.vn/api/datphonghop/Get_DSDatPhongHop?sortOrder=asc&sortField=&page=1&record=10&more=true&filter.keys=RoomID|TuNgay|DenNgay&filter.vals=2|20/12/2021|27/12/2021

//Này của nhân viên đăng ký lên
async function Get_DSDatPhongHop(RowID, StatusID = -1, date, month = true) {
    let tuday = month ? moment(date).startOf('month').format('DD/MM/YYYY') : moment(date).startOf('week').format('DD/MM/YYYY')
    let denngay = month ? moment(date).add(1, 'month').endOf('month').format('DD/MM/YYYY') : moment(date).endOf('week').format('DD/MM/YYYY')
    let params = `api/datphonghop/Get_DSDatPhongHop?filter.keys=RoomID|StatusID|TuNgay|DenNgay&filter.vals=${RowID}|${StatusID == -1 ? '' : StatusID}|${tuday}|${denngay}`
    let res = await Utils.CallAPI(domainJeeAdmin + params, "GET")
    return res
}

//check bên meet
async function CheckTaiSan(date) {
    // let tuday = month ? moment(date).startOf('month').format('DD/MM/YYYY') : moment(date).startOf('week').format('DD/MM/YYYY')
    // let denngay = month ? moment(date).add(1, 'month').endOf('month').format('DD/MM/YYYY') : moment(date).endOf('week').format('DD/MM/YYYY')
    let _date = moment(date, 'DD/MM/YYYY').format('YYYY/MM/DD')
    let params = `api/datphonghop/Get_DSDatPhongHop?filter.keys=StatusID|TuNgay|DenNgay&filter.vals=${'|'}${_date}|${_date}`
    console.log("params:", params)
    let res = await Utils.CallAPI(domainJeeAdmin + params, "GET")
    return res
}

//Này của admin duyệt
async function DS_DatPhongHop(RowID, StatusID = -1, date, month = true) {
    let tuday = month ? moment(date).startOf('month').format('DD/MM/YYYY') : moment(date).startOf('week').format('DD/MM/YYYY')
    let denngay = month ? moment(date).add(1, 'month').endOf('month').format('DD/MM/YYYY') : moment(date).endOf('week').format('DD/MM/YYYY')
    let params = `api/datphonghop/DS_DatPhongHop?filter.keys=RoomID|StatusID|TuNgay|DenNgay&filter.vals=${RowID}|${StatusID == -1 ? '' : StatusID}|${tuday}|${denngay}`
    let res = await Utils.CallAPI(domainJeeAdmin + params, "GET")
    return res
}

//https://jeeadmin-api.jee.vn/api/taisan/Get_ListTaiSan
async function Get_ListTaiSan() {
    let res = await Utils.CallAPI(domainJeeAdmin + 'api/taisan/Get_ListTaiSan', "GET")
    return res
}


//https://jeeadmin-api.jee.vn/api/lite/Get_ListDepartment
async function Get_ListDepartment() {
    let res = await Utils.CallAPI(domainJeeAdmin + 'api/lite/Get_ListDepartment', "GET")
    return res
}

//https://jeeadmin-api.jee.vn/api/lite/GetUser_ByDepartment?departmentID=14
async function GetUser_ByDepartment(departmentID) {
    let res = await Utils.CallAPI(domainJeeAdmin + `api/lite/GetUser_ByDepartment?departmentID=${departmentID}`, "GET")
    return res
}

//https://jeeadmin-api.jee.vn/api/lite/Get_GioDatPhongHop?gio=


//https://jeeadmin-api.jee.vn/api/datphonghop/Insert_DatPhongHop
// BookingDate: "2021-12-25T17:00:00.000Z"
// FromTime: "07:30"
// MeetingContent: "test"
// NVID: "6"
// RoomID: "3"
// ToTime: "08:00"
async function Insert_DatPhongHop(BookingDate, FromTime, ToTime, MeetingContent, RoomID) {
    let strBody = JSON.stringify({
        BookingDate: BookingDate,
        FromTime: FromTime,
        MeetingContent: MeetingContent,
        RoomID: RoomID,
        ToTime: ToTime,
    })
    let res = await Utils.CallAPI(domainJeeAdmin + `api/datphonghop/Insert_DatPhongHop`, "POST", strBody)
    return res
}

//https://jeeadmin-api.jee.vn/api/datphonghop/Confirm_DatPhongHop
//{RowID: "10247", Status: 1}

//https://jeeadmin-api.jee.vn/api/datphonghop/Confirm_DatPhongHop
//{RowID: "10261", Status: 2, LyDo: "Từ chối"}

async function Confirm_DatPhongHop(RowID, Status, LyDo = '') {
    let strBody
    if (Status == 1) {
        strBody = JSON.stringify({
            RowID: RowID,
            Status: Status
        })
    } else {
        strBody = JSON.stringify({
            RowID: RowID,
            Status: Status,
            LyDo: LyDo
        })
    }
    let res = await Utils.CallAPI(domainJeeAdmin + `api/datphonghop/Confirm_DatPhongHop`, "POST", strBody)
    return res
}


//https://jeeadmin-api.jee.vn/api/datphonghop/Delete_DatPhongHop
async function Delete_DatPhongHop(RowID, LyDo = '') {
    let strBody = JSON.stringify({
        RowID: RowID,
        LyDo: LyDo
    })
    let res = await Utils.CallAPI(domainJeeAdmin + `api/datphonghop/Delete_DatPhongHop`, "POST", strBody)
    return res
}

//https://jeeadmin-api.jee.com.vn/api/datphonghop/DatPhong_Detail?Id=
async function DatPhong_Detail(id) {
    let res = await Utils.CallAPI(domainJeeAdmin + `api/datphonghop/DatPhong_Detail?Id=${id}`, "GET")
    return res
}

async function DKDatPhong_Detail(id) {
    let res = await Utils.CallAPI(domainJeeAdmin + `api/datphonghop/DKDatPhong_Detail?Id=${id}`, "GET")
    return res
}
export { DS_DatPhongHop, Get_ListTaiSan, Get_ListDepartment, GetUser_ByDepartment, Insert_DatPhongHop, Confirm_DatPhongHop, Delete_DatPhongHop, DatPhong_Detail, Get_DSDatPhongHop, DKDatPhong_Detail, CheckTaiSan }
