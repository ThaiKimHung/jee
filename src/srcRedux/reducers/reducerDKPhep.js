

import Utils from '../../app/Utils';
import produce from "immer";
import * as Types from '../actions/type'

var initialState = {
    dateDKPhep: '',
    isGoSreen: true
};
export default function reducerDKPhep(state = initialState, action) {
    const { payload } = action;
    return produce(state, draft => {
        switch (action.type) {
            case Types.SETDATE_DKPHEP: {
                draft.dateDKPhep = payload;
                break;
            }
            default: { break; }
        }
    });
}