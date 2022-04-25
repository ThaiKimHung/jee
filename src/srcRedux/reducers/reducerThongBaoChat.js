import produce from "immer";
import * as Types from '../actions/type'

var initialState = {
    numChat: [],
};
export default reducerThongBaoChat = produce((state = initialState, action) => {

    const { payload, type } = action;
    switch (type) {
        case Types.Action_ThongBaoChat_Success:
            state.numChat = payload;
            break;
        default:
            return state;
    }

})