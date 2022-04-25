import Utils from "../../../app/Utils";
import { appConfig } from '../../../app/ConfigJeePlatform'
import { FlashMessageTransition } from "react-native-flash-message";

const domainJeeChat = appConfig.domainJeeChat
const conversation = 'api/conversation/'
const chat = 'api/chat/'

//Lấy danh sách user  chưa tạo conversation
async function Get_DanhBa_NotConversation() {
    // let paramres = `pageNumber=${pageNumber}&pageSize=${pageSize}&sortField=${sortField}&filter.keys=${keys}&filter.vals=${val}`;
    let paramres = ''
    let res = await Utils.CallAPI(domainJeeChat + conversation + 'Get_DanhBa_NotConversation' + paramres, "GET")
    return res
}

// Danh bạ all
async function GetAllUser() {
    let res = await Utils.CallAPI(domainJeeChat + conversation + 'GetAllUser', "GET")
    return res
}

//Danh sách chat theo tk user
async function Get_Contact_Chat() {
    let res = await Utils.CallAPI(domainJeeChat + chat + 'Get_Contact_Chat', "GET")
    return res
}

//Tạo group https://jeechat-api.jee.vn/api/conversation/CreateConversation
async function CreateConversation(nameGroup, ListMember, IsGroup = true) {
    let array = []
    array.push(ListMember)
    let strBody = JSON.stringify({
        GroupName: nameGroup,
        IsGroup: IsGroup,
        ListMember: IsGroup ? ListMember : array
    })
    let res = await Utils.CallAPI(domainJeeChat + conversation + 'CreateConversation', "POST", strBody)
    return res
}

//Xoá cuộc hội thoại https://jeechat-api.jee.vn/api/conversation/DeleteConverSation?IdGroup=4176 POST
async function DeleteConverSation(IdGroup) {
    let res = await Utils.CallAPI(domainJeeChat + conversation + `DeleteConverSation?IdGroup=${IdGroup}`, "POST", {})
    return res
}

//API load tin nhắn ở group https://jeechat-api.jee.vn/api/chat/Get_ListMess?IdGroup=4185&sortOrder=&sortField=&page=1&record=10
async function Get_ListMess(IdGroup, sortOrder = "", sortField = "", page = 1, record = 10) {
    let res = await Utils.CallAPI(domainJeeChat + chat + `Get_ListMess?IdGroup=${IdGroup}&sortOrder=${sortOrder}&sortField=${sortField}&page=${page}&record=${record}`, "GET")
    return res
}

//API đọc tin nhắn ... https://jeechat-api.jee.vn/api/chat/UpdateDataUnreadInGroup?IdGroup=4171&userUpdateRead=mobile.hoang&key=read
//https://jeechat-api.jee.vn/api/chat/UpdateDataUnread?IdGroup=4185&UserID=77188&key=read
// của group
async function UpdateDataUnreadInGroup(IdGroup, user, key = "read") {
    let res = await Utils.CallAPI(domainJeeChat + chat + `UpdateDataUnreadInGroup?IdGroup=${IdGroup}&userUpdateRead=${user}&key=${key}`, "POST", {})
    return res
}
// của user
async function UpdateDataUnread(IdGroup, iduser, key = "read") {
    let res = await Utils.CallAPI(domainJeeChat + chat + `UpdateDataUnread?IdGroup=${IdGroup}&UserID=${iduser}&key=${key}`, "POST", {})
    return res
}

//Thành viên không co trong Group . https://jeechat-api.jee.vn/api/conversation/GetDSThanhVienNotInGroup?IdGroup=4181
async function GetDSThanhVienNotInGroup(IdGroup) {
    let res = await Utils.CallAPI(domainJeeChat + conversation + `GetDSThanhVienNotInGroup?IdGroup=${IdGroup}`, "GET")
    return res
}

//Get thành viên group https://jeechat-api.jee.vn/api/conversation/GetThanhVienGroup?IdGroup=4181
async function GetThanhVienGroup(IdGroup) {
    let res = await Utils.CallAPI(domainJeeChat + conversation + `GetThanhVienGroup?IdGroup=${IdGroup}`, "GET")
    return res
}

//add thành viên https://jeechat-api.jee.vn/api/conversation/InsertThanhVienInGroup?IdGroup=4212
async function InsertThanhVienInGroup(IdGroup, ListMember) {
    let strBody = {
        ListMember: ListMember
    }
    let res = await Utils.CallAPI(domainJeeChat + conversation + `InsertThanhVienInGroup?IdGroup=${IdGroup}`, "POST", JSON.stringify(strBody))
    return res
}

//update làm admin https://jeechat-api.jee.vn/api/conversation/UpdateAdminGroup?IdGroup=4181&UserId=77186&key=1 
async function UpdateAdminGroup(IdGroup, UserId, isAdmin = 1) {
    let res = await Utils.CallAPI(domainJeeChat + conversation + `UpdateAdminGroup?IdGroup=${IdGroup}&UserId=${UserId}&key=${isAdmin}`, "POST", {})
    return res
}

//Xoá user trong group- https://jeechat-api.jee.vn/api/conversation/DeleteThanhVienInGroup?IdGroup=4181&UserId=77187
async function DeleteThanhVienInGroup(IdGroup, UserId) {
    let res = await Utils.CallAPI(domainJeeChat + conversation + `DeleteThanhVienInGroup?IdGroup=${IdGroup}&UserId=${UserId}`, "POST", {})
    return res
}

//truyên IGroup -> get thông tin https://jeechat-api.jee.vn/api/chat/GetInforUserChatWith?IdGroup=4271
async function GetInforUserChatWith(IdGroup) {
    let res = await Utils.CallAPI(domainJeeChat + chat + `GetInforUserChatWith?IdGroup=${IdGroup}`, "GET")
    return res
}

async function GetUserReaction(idchat, type) {
    let res = await Utils.CallAPI(domainJeeChat + chat + `GetUserReaction?idchat=${idchat}&type=${type}`, "GET")
    return res
}

//https://jeechat-api.jee.vn/api/conversation/UpdateGroupName?IdGroup=5337&nameGroup=test777
async function UpdateGroupName(IdGroup, nameGroup) {
    let res = await Utils.CallAPI(domainJeeChat + conversation + `UpdateGroupName?IdGroup=${IdGroup}&nameGroup=${nameGroup}`, "POST", {})
    return res
}

//https://jeechat-api.jee.vn/api/notifi/PushNotifiTagName
async function PushNotifiTagName(TenGroup, Avatar, IdChat, IdGroup, Content, ListTagname = []) {
    let array =
    {
        "TenGroup": TenGroup,
        "Avatar": Avatar,
        "IdChat": IdChat,
        "IdGroup": IdGroup,
        "Content": Content,
        "ListTagname": ListTagname
    }
    let strbody = JSON.stringify(array)
    let res = await Utils.CallAPI(domainJeeChat + `api/notifi/PushNotifiTagName`, "POST", strbody, false, true, false)
    return res
}
// https://jeechat-api.jee.vn/api/chat/GetAllFile?IdGroup=5383
async function GetAllFile(IdGroup) {
    let res = await Utils.CallAPI(domainJeeChat + chat + `GetAllFile?IdGroup=${IdGroup}`, "GET")
    return res
}

// https://jeechat-api.jee.vn/api/chat/GetImage?IdGroup=5383
async function GetImage(IdGroup) {
    let res = await Utils.CallAPI(domainJeeChat + chat + `GetImage?IdGroup=${IdGroup}`, "GET")
    return res
}

export {
    Get_DanhBa_NotConversation, Get_Contact_Chat, GetAllUser, CreateConversation, DeleteConverSation, Get_ListMess, UpdateDataUnreadInGroup, UpdateDataUnread, GetDSThanhVienNotInGroup,
    GetThanhVienGroup, InsertThanhVienInGroup, UpdateAdminGroup, DeleteThanhVienInGroup, GetInforUserChatWith, GetUserReaction, UpdateGroupName, PushNotifiTagName,
    GetAllFile, GetImage
}
