

import Utils from '../../app/Utils';
import produce from "immer";
import * as Types from '../actions/type'

var initialState = {
    dateBangCong: ''
};
export default function reducerBangCong(state = initialState, action) {
    const { payload } = action;
    return produce(state, draft => {
        switch (action.type) {
            case Types.SETDATE_BANGCONG: {
                draft.dateBangCong = payload;
                break;
            }
            default: { break; }
        }
    });
}