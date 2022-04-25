import { getApprovalRequest, getApprovalRequestTong } from '../../apis/apileaveapproval';
import { Get_DSThongBao } from '../../apis/apiNotificaion';
import Utils from '../../app/Utils';
import {
    CHANGELANGUAGE, DECREASE, GET_MENUAPP, INCREASE, LOADING, LOADTANGCA, LOAD_CTCHAMCONG, LOAD_TTUSER, REMOVEITEMDUYUET, SETDATADSDUYET, SETDATADSLICHSU,
    SETDATE_BANGCONG, SETDATE_DKPHEP, SETFILTERDUYET, SETFILTERLICHSU, SETISNOTIFY, SETLOADMORE, SETLOAIHINHMENU, SETTONG, SETVALUETYPEDLICHSU, SETVALUETYPEDSDUYET,
    SHOWNOTIFICATION, HIDECAMERA, Action_Loading_ThongBao, Action_ThongBao_Success, Action_ThongBaoChat_Success, TABCOUNTWORK, TABCOUNTWORKCHILD, TABCOUNTPROCEDURALWORK,
    TABCOUNTCongViecLapLaiTuan, TABCOUNTCongViecLapLaiThang
} from './type';
import _ from 'lodash'
import { getDsThongBao } from '../../apis/apiThongBao';
import { Get_Contact_Chat } from '../../apis/JeePlatform/API_JeeChat/apiJeeChat'
export const counterIncrease = () => ({ type: INCREASE });
export const counterDecrease = () => ({ type: DECREASE });
export const loadCTChamCong = (val) => ({ type: LOAD_CTCHAMCONG, data: val });
export const ChangeLanguage = (val) => ({ type: CHANGELANGUAGE, data: val });
export const Show_Notification = (val) => ({ type: SHOWNOTIFICATION, data: val });
export const hide_Camera = (val) => ({ type: HIDECAMERA, data: val });
export const loadTangCa = (val) => ({ type: LOADTANGCA, data: val });
export const LoadTTUser = (val) => ({ type: LOAD_TTUSER, data: val });
export const GetMenuApp = (val) => ({ type: GET_MENUAPP, data: val });
export const show_A = () => {
    return async (dispatch) => {
        let res = await Get_DSThongBao();
        // Utils.nlog("gia tri get ds thông báo-----------------------------", res)
        if (res.status == 1) {
            var { TongSoLuong = 0 } = res;
            dispatch(Show_Notification(TongSoLuong))
        } else {
            dispatch(Show_Notification('0'))
        }
    }

}
// export const SETVALUETYPEDSDUYET = 'SETVALUETYPEDSDUYET';
// export const SETVALUETYPEDLICHSU = 'SETVALUETYPEDLICHSU';
// export const SETISNOTIFY = 'SETISNOTIFY';

export const SetDSDuyet = (val) => ({ type: SETDATADSDUYET, payload: val });
export const SetDSLichSu = (val) => ({ type: SETDATADSLICHSU, payload: val });
export const SetLoading = (val) => ({ type: LOADING, payload: val });
export const RemoveItemDuyet = (val) => ({ type: REMOVEITEMDUYUET, payload: val });

export const SetValueTypeDSDuyet = (val) => ({ type: SETVALUETYPEDSDUYET, payload: val });
export const SetValueTypeLichSu = (val) => ({ type: SETVALUETYPEDLICHSU, payload: val });
export const SetIsNotify = (val) => ({ type: SETISNOTIFY, payload: val });

export const SetTong = (val) => ({ type: SETTONG, payload: val });
export const SetFilterDuyet = (val) => ({ type: SETFILTERDUYET, payload: val })
export const setFilterLichSu = (val) => ({ type: SETFILTERLICHSU, payload: val })
export const SetLoadmore = (val) => ({ type: SETLOADMORE, payload: val });

export const SetCountWork = (val) => ({ type: TABCOUNTWORK, data: val });
export const SetCountWorkChild = (val) => ({ type: TABCOUNTWORKCHILD, data: val });
export const SetCountProceduralWork = (val) => ({ type: TABCOUNTPROCEDURALWORK, data: val });

export const SetCounCVLapLaiTuan = (val) => ({ type: TABCOUNTCongViecLapLaiTuan, data: val });
export const SetCounCVLapLaiThang = (val) => ({ type: TABCOUNTCongViecLapLaiThang, data: val });

//tâm viết mới
export const GET_DSDUYETDON = (page = 1, record = 10, datafilter = {}, DuyetDonReducer = {}, idScreen = 0, filtervals = '2|', filterkeys = 'StatusID|TypeID|keyword|HoTen|StartDate|EndDate') => {
    return async (dispatch) => {
        let status = datafilter.status !== undefined && idScreen == 1 && _.size(datafilter.status) > 0 ? `${datafilter.status.id}` : `${idScreen == 0 ? 2 : 3}`
        filtervals = status + `|${idScreen == 0 ? DuyetDonReducer && DuyetDonReducer.valueTypeDSDuyet : DuyetDonReducer && DuyetDonReducer.valueTypeLichSu}|${datafilter && datafilter.keysearch ? datafilter.keysearch : ''}|${datafilter && datafilter.name ? datafilter.name : ''}|${datafilter && datafilter.dayfrm ? datafilter.dayfrm : ''}|${datafilter && datafilter.dayto ? datafilter.dayto : ''}`
        const res = await getApprovalRequest(page, record, filtervals, filterkeys, idScreen == 0 ? "" : "");
        Utils.nlog('res GET_DSDUYETDON', res)
        if (res && res.status == 1) {
            nthisLoading.hide();
            if (idScreen == 0) {
                dispatch(SetDSDuyet(res))
            } else {
                dispatch(SetDSLichSu(res))
            }
        } else {
            dispatch(SetLoading(false))
        }
    }


}

export const GET_TONG = () => {
    return async (dispatch) => {
        const res = await getApprovalRequestTong();
        // Utils.nlog("gai tri ress danh sach:" + filtervals + "," + idScreen, res)
        if (res && res.status == 1) {
            dispatch(SetTong(res))

        } else {

            //làm thêm màn hình trả về lỗi goscreen tói
        }
    }
}
export const SETFILTER = (datafilter, istab, DuyetDonReducer) => {
    return async (dispatch) => {
        // Utils.nlog("Dũ liêu,", datafilter)
        if (istab == 0) {
            dispatch(SetFilterDuyet(datafilter))
            Utils.nlog("gia tri reux DuyetDonReducer------------------------------ ", datafilter)
            dispatch(GET_DSDUYETDON(1, 10, datafilter, DuyetDonReducer, istab))
        } else {
            dispatch(setFilterLichSu(datafilter))
            Utils.nlog("gia tri reux DuyetDonReducer ", datafilter)
            dispatch(GET_DSDUYETDON(1, 10, datafilter, DuyetDonReducer, istab))
            //làm thêm màn hình trả về lỗi goscreen tói
        }
    }
}

export const SetDateBangCong = (val) => ({ type: SETDATE_BANGCONG, payload: val });
export const SetDateDKPhep = (val) => ({ type: SETDATE_DKPHEP, payload: val });
export const SetLOAIHINHMENU = (val) => ({ type: SETLOAIHINHMENU, payload: val });

// Thông báo
export const Get_ThongBao = (status = '') => async dispatch => {
    dispatch(Loading_ThongBao());
    getDsThongBao('unread').then(
        res => {
            dispatch(ThongBao_Success(res))
        }
    ).catch(
        err => Utils.nlog(err)
    )
}

export const Loading_ThongBao = () => {
    return {
        type: Action_Loading_ThongBao,
    }
}

export const ThongBao_Success = (data) => {
    return {
        type: Action_ThongBao_Success,
        payload: data
    }
}

//Thông báo chat
export const Get_ThongBaoChat = () => async dispatch => {
    Get_Contact_Chat().then(
        res => {
            let dem = 0
            res.data.map(val => {
                val.UnreadMess && val.UnreadMess > 0 ? dem++ : null
            })
            dispatch(ThongBaoChat_Success(dem))
        }
    ).catch(
        err => Utils.nlog(err)
    )

}

export const ThongBaoChat_Success = (data) => {
    return {
        type: Action_ThongBaoChat_Success,
        payload: data
    }
}