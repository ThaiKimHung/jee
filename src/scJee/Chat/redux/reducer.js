import * as Types from './type';
import { produce } from 'immer';

const initStateGroupchat = {
    isLoading: true,
    IdGroup: -1,//current
    DataMessage: [],//current
    InFoGroup: {},//current
    DataFileSend: [],
    ObjectData: {

    },
    ObjectDataFileSend: {

    },
    ObjectListGroup: {
        page: {
            Page: -1
        },
        data: []
    },
    isLoading: true,
};
// export const ADDFILE_SENDOFGROUP = 'ADDFILE_SENDOFGROUP';
// export const UPDATEFILE_SENDOFGROUP = 'UPDATEFILE_SENDOFGROUP';
function ReducerGroupChat(state = initStateGroupchat, action) {
    return produce(state, draft => {
        switch (action.type) {
            case Types.SETLIST_GROUPCHAT: {
                draft.isLoading = false
                let { data } = action;
                if (data.page && data.page.Page == 1) {
                    draft.ObjectListGroup = action.data
                } else if (data.page && data.page.Page != 1 && data.page.Page != state.ObjectListGroup.page.Page) {
                    draft.ObjectListGroup = {
                        ...action.data,
                        data: state.ObjectListGroup.data.concat(data.data || [])

                    }
                } else {
                    draft;
                }
                break;
            };
            case Types.CHANGE_CURRENT_GROUP: {
                let { data } = action;
                // Save lại dữ liệu hiện tại
                if (state.DataMessage && state.DataMessage.length > 0) {
                    if (state.DataMessage.length >= 30) {
                        draft.ObjectData[`${state.IdGroup}`] = state.DataMessage.slice(0, 25)
                    } else {
                        draft.ObjectData[`${state.IdGroup}`] = state.DataMessage
                    }
                }
                if (state.DataFileSend && state.DataFileSend.length > 0) {
                    draft.ObjectDataFileSend[`${state.IdGroup}`] = state.DataFileSend ? state.DataFileSend : []
                }
                if (data == -1) {
                    draft.DataMessage = []
                    draft.IdGroup = -1
                    draft.DataFileSend = []
                } else {
                    //sét dữ liệu infogroup theo list ObjectListGroup;
                    let Itemfind = state.ObjectListGroup.data.find(item => item.IdGroup == data);
                    if (Itemfind) {
                        draft.InFoGroup = Itemfind;

                        let oldData = state.ObjectListGroup;
                        const dataGroup = oldData.data;
                        if (dataGroup && dataGroup.length > 0) {
                            let newDataList = dataGroup.map((item, index) => {
                                if (item.IdGroup == data) {
                                    return { ...item, NewMessInfo: { ...item.NewMessInfo, setNew: false, }, NumMessage: 0 }
                                } else {
                                    return { ...item }
                                }
                            })
                            draft.ObjectListGroup = { ...state.ObjectListGroup, data: [...newDataList] }
                        }
                    }
                    //Gán dữ liệu mới
                    draft.IdGroup = data
                    //TÌM DỮ LIỆU GROUP ĐỂ ĐỔI 
                    //data chat
                    if (state.ObjectData[`${data}`]) {
                        draft.isLoading = false
                        draft.DataMessage = state.ObjectData[`${data}`];
                    } else {
                        draft.isLoading = true
                        draft.DataMessage = []
                    }
                    draft.DataFileSend = []

                    if (state.ObjectDataFileSend[`${data}`]) {
                        draft.DataFileSend = state.ObjectDataFileSend[`${data}`];
                    } else {
                        draft.DataFileSend = []
                    }
                }

                break;

            };
            case Types.SETINFO_CURRENTGROUP: {
                if (state.IdGroup == action.data.IdGroup) {
                    draft.InFoGroup = action.data
                }
                break;
            };
            case Types.SETLIST_MESSAGE_OFGROUP: {
                draft.isLoading = false;
                if (action.data && action.data.length > 0) {
                    let { IdGroup } = action.data[0];
                    if (IdGroup == state.IdGroup) {
                        draft.DataMessage = action.data;
                    }
                }

                break;
            };
            case Types.SETITEM_MESSAGE_OFGROUP: {
                if (action.data.IsDelAll == true || action.data.IsHidenAll == true) {
                    break;
                } else {
                    //check đúng messahe của group mới add
                    const { IdGroup } = action.data;
                    let oldData = state.ObjectListGroup;
                    const { data = [] } = oldData;

                    if (!data || (data && data.length) == 0) {
                        // draft.ObjectListGroup = { ...state.ObjectListGroup, data: [action.data] }
                    } else {
                        let IndexCheck = data.findIndex(item => item.IdGroup == IdGroup);
                        if (IndexCheck) {
                            let newDataList = data.map((item, index) => {
                                if (item.IdGroup == IdGroup) {
                                    return { ...item, NewMessInfo: action.data }
                                } else {
                                    return { ...item }
                                }
                            })
                            draft.ObjectListGroup = { ...state.ObjectListGroup, data: [...newDataList] }
                        } else {
                            // Utils.nlog("==============xử lú k tồn tại group mà có tin nhắnn===========")
                            // draft.ObjectListGroup = { ...state.ObjectListGroup, data: [data,action.data] }
                        }

                    }




                    if (action.data.IdGroup == state.IdGroup) {
                        if (state.DataMessage && state.DataMessage.length > 0) {
                            let dataCopy = state.DataMessage.map(item => item);
                            let index = dataCopy.findIndex(
                                item => item.SendKey == action.data.SendKey
                            );

                            if (index >= 0) {
                                let isNew = dataCopy[index];
                                if (isNew.isLoadFile == true) {
                                    dataCopy[index] = {
                                        ...action.data
                                    }
                                } else {
                                    dataCopy[index] = {
                                        ...dataCopy[index],
                                        IdChat: action.data.IdChat
                                    }
                                }
                                draft.DataMessage = dataCopy
                            } else {
                                draft.DataMessage = [action.data, ...state.DataMessage]
                            }
                            break;
                        } else {
                            if (state.DataMessage && state.DataMessage.length == 0) {
                                draft.DataMessage = [action.data]
                            }
                            break;
                        }
                    }

                }
                break;
            };
            case Types.CHANGETYPE_ITEM_MESSAGE_OFGROUP: {
                if (action.data.IdGroup == state.IdGroup) {
                    if (state.DataMessage && state.DataMessage.length > 0) {
                        let dataCopy = state.DataMessage;
                        let index = dataCopy.findIndex(
                            item => item.SendKey == action.data.SendKey
                        );
                        if (index != -1) {
                            dataCopy.splice(index, 1, {
                                ...action.data
                            });
                        }
                        draft.DataMessage = dataCopy
                    }
                }

                break;
            }
            case Types.CHANGE_ITEM_ID: {
                if (action.data.IdGroup == state.IdGroup) {
                    if (state.DataMessage && state.DataMessage.length > 0) {
                        let dataCopy = state.DataMessage.map(item => item);
                        let index = dataCopy.findIndex(
                            item => item.SendKey == action.data.SendKey
                        );

                        if (index >= 0) {
                            let isNew = dataCopy[index];
                            if (isNew.isLoadFile == true) {
                                dataCopy[index] = {
                                    ...action.data
                                }
                            } else {
                                dataCopy[index] = {
                                    ...dataCopy[index],
                                    IdChat: action.data.IdChat
                                }
                            }

                            // xử lý lưu data newMessgae cho group;
                            // const { IdGroup } = dataCopy[index];
                            // let oldData = state.ObjectListGroup;
                            // const { data = [] } = oldData;
                            // if (data && data.length > 0) {
                            //     let newDataList = data.map((item, index) => {
                            //         if (item.IdGroup == IdGroup) {
                            //             return { ...item, NewMessInfo: dataCopy[index] }
                            //         } else {
                            //             return { ...item }
                            //         }
                            //     })
                            //     draft.ObjectListGroup = { ...state.ObjectListGroup, data: [...newDataList] }
                            // }

                        }
                        // Utils.nlog("giá trị data copy-----", dataCopy[index], index)
                        draft.DataMessage = dataCopy
                        break;
                    } else {
                        break;
                    }
                } else {
                    //xử lý change message khi khác group
                    // let dataCopy = state.DataMessage.map(item => item);
                    // let index = dataCopy.findIndex(
                    //     item => item.SendKey == action.data.SendKey
                    // );


                }
                break;

            };
            case Types.DELETE_ALL_MESSAGE_OFGROUP: {
                let { data } = action
                draft.DataMessage = [];
                draft.ObjectData[`${data}`] = []
                break;
            }
            case Types.DELETE_ITEM_MESSAGE_OFGROUP_BYSENDKEY: {
                draft.DataMessage = state.DataMessage.filter(item => item.SendKey != action.data.SendKey)
                break;
            }
            case Types.DELETE_ITEM_MESSAGE_OFGROUP_BYIDCHAT: {
                draft.DataMessage = state.DataMessage.filter(item => item.IdChat != action.data.IdChat);
                break;
            }
            case Types.SETDATA_SENDFILE: {
                draft.DataFileSend = [...state.DataFileSend, ...action.data]
                break;
            }
            case Types.UPDATEDATA_SENDFILE: {
                const { data = {} } = action
                if (data.value == 1) {//gửi file thành công
                    draft.DataFileSend = state.DataFileSend.filter(item => item.SendKey != data.file.SendKey)
                } else {//gửi file thất bại k xử lý xoá file.
                    // draft.DataFileSend = state.DataFileSend.filter(item => item.SendKey != data.file.SendKey)
                }
                break;
            }
            case Types.SET_ITEM_FILE_LOAD: {
                draft.DataMessage = [{ ...action.data }, ...state.DataMessage]
                break;
            }
            case Types.CHANGE_NEW_MESSAGE_OF_GROUP: {
                const dataNew = action.data;
                // const { IdGroup } = dataNew;
                // let oldData = state.ObjectListGroup;
                // const { data = [] } = oldData;
                // if (data && data.length > 0) {
                //     let newDataList = data.map((item, index) => {
                //         if (item.IdGroup == IdGroup) {
                //             return { ...item, NewMessInfo: dataNew }
                //         } else item
                //     })
                //     draft.ObjectListGroup = { ...oldData, data: newDataList }
                // }
                const { IdGroup } = action.data;
                let oldData = state.ObjectListGroup;
                const { data = [] } = oldData;
                if (data && data.length > 0) {
                    let newDataList = data.map((item, index) => {
                        if (item.IdGroup == IdGroup) {
                            return { ...item, NewMessInfo: { ...action.data, setNew: true, }, NumMessage: item.NumMessage + 1 }
                        } else {
                            return { ...item }
                        }
                    })
                    draft.ObjectListGroup = { ...state.ObjectListGroup, data: [...newDataList] }
                }
                // Utils.nlog("vao nha ---------1", dataNew)
            }
        }
    })
}







const initStateFile = {
    number: 0,
    message: ''
};
function ReducerListFileSend(state = initStateFile, action) {
    switch (action.type) {
        case Types.LIST_SENDFILE: {
            return {
                number: action.data,
                message: ''
            };
        }
        case Types.UPDATE_MESSAGEFILE: {
            // Utils.nlog('vao update sen file', action.data);
            return {
                number: state.number - 1,
                message: action.data
            };
        }
        default:
            return state;
    }
}
function GetIsChat(state = { isChat: false }, action) {
    switch (action.type) {
        case Types.SETISCHAT: {
            // Utils.nlog('vao set isChat ----------------------');
            return {
                isChat: action.data
            };
        }
        default:
            return state;
    }
}
//SETICONCHAT
function GetIconChat(state = { data: [] }, action) {
    switch (action.type) {
        case Types.SETICONCHAT: {
            // Utils.nlog('vao set icon Chat ----------------------');
            return {
                data: action.data
            };
        }
        default:
            return state;
    }
}
//STATUS_CONNECT
const initStateData = {
    status: -1,
    statusrun: ''
};
function DataChat(state = initStateData, action) {
    switch (action.type) {
        case Types.STATUS_CONNECT: {
            return {
                ...state,
                status: action.data
            };
        }
        case Types.STATUS_CONNECT_RUN: {
            return {
                ...state,
                statusrun: action.data
            };
        }
        default:
            return state;
    }
}
const initStateNotify = {
    status: -1,

};
function DataNotify(state = initStateNotify, action) {
    switch (action.type) {
        case Types.STATUS_NOTIFY: {
            return {
                status: action.data
            };
        }
        default:
            return state;
    }
}

const RootReducerChat = {
    ReducerListFileSend,
    GetIsChat,
    GetIconChat,
    DataChat,
    DataNotify,
    ReducerGroupChat
};
export default RootReducerChat