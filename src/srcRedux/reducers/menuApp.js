import { LOAD_CTCHAMCONG, GET_MENUAPP } from '../actions/type';
const initialState = [];
export default function (state = initialState, action) {
    switch (action.type) {
        case GET_MENUAPP:
            return action.data;
        default:
            return state;
    }
}