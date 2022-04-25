

import Utils from '../../app/Utils';
import produce from "immer";
import * as Types from '../actions/type'

var initialState = {
    isLoading: true,
    dataDSDuyet: [],
    dataDSLichSu: [],
    pageDSDuyet: {},
    pageDSLichSu: {},
    valueTypeDSDuyet: '',
    valueTypeLichSu: '',
    isNoitify: false,
    tong: 0,
    isRemove: false,
    itemFilterDuyet: {},
    itemFilterLichSu: {},
    isLoadmore: false


};
export default function DuyetDonReducer(state = initialState, action) {

    const { payload } = action;
    // Utils.nlog("gia tri action ,", action);
    return produce(state, draft => {
        switch (action.type) {
            case Types.SETDATADSDUYET: {
                const { page = {}, data = [] } = payload;
                draft.pageDSDuyet = page;
                draft.isLoading = false;
                draft.isLoadmore = false;

                if (page.Page == 1) {
                    if (page) {
                        draft.tong = page.TotalCount ? page.TotalCount : 0;
                    }
                    draft.dataDSDuyet = data;

                } else if (page.Page > state.pageDSDuyet.Page) {

                    draft.dataDSDuyet = state.dataDSDuyet.concat(data);
                }
                break;
            }
            case Types.SETDATADSLICHSU: {
                const { page = {}, data = [] } = payload;
                draft.pageDSLichSu = page;
                draft.isLoading = false;
                draft.isRemove = false;
                draft.isLoadmore = false;
                // Utils.nlog("page--------- va page state", page.Page, state.pageDSLichSu.Page)
                if (page.Page == 1) {
                    draft.dataDSLichSu = data;
                } else if (page.Page > state.pageDSLichSu.Page) {
                    // Utils.nlog("page--------- va page state", page.Page)
                    draft.dataDSLichSu = state.dataDSLichSu.concat(data);
                }
                break;
            }
            case Types.REMOVEITEMDUYUET: {
                const { RowID = -1 } = payload;
                if (RowID != -1 && state.dataDSDuyet) {
                    draft.dataDSDuyet = state.dataDSDuyet.filter(item => item.RowID != RowID);
                    draft.isRemove = true;
                    draft.tong = state.tong - 1;
                }
                break;
            }
            case Types.LOADING: {
                draft.isLoading = payload;
                break;
            }
            case Types.SETVALUETYPEDSDUYET: {
                draft.valueTypeDSDuyet = payload;
                break;
            }
            case Types.SETVALUETYPEDLICHSU: {
                draft.valueTypeLichSu = payload;
                break;
            }
            case Types.GETTONG: {
                const { page } = payload;
                if (page && page.TotalCount) {
                    draft.tong = page.TotalCount;
                }
            } break;
            case Types.isNoitify: {
                draft.isNoitify = payload;
                break;
            }
            case Types.SETFILTERDUYET: {
                // Utils.nlog("data ---------", payload)
                // const { keysearch, name, dayfrm, dayto } = payload
                // draft.itemFilterDuyet = { keysearch, name, dayfrm, dayto }
                draft.itemFilterDuyet = payload;
                break;
            }
            case Types.SETFILTERLICHSU: {
                // const { keysearch, name, dayfrm, dayto } = payload
                // draft.itemFilterLichSu = { keysearch, name, dayfrm, dayto }
                draft.itemFilterLichSu = payload;
                break;
            }
            case Types.SETLOADMORE: {
                draft.isLoadmore = payload;
            }
            default: { break; }
        }
    });
}