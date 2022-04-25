import { LOAD_CTCHAMCONG } from '../actions/type';

const initialState = [];

export default function (state = initialState, action) {
    switch (action.type) {
        case LOAD_CTCHAMCONG:
            return action.data;
        default:
            return state;
    }
}