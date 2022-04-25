import { LOAD_TTUSER } from '../actions/type';
import Utils from '../../app/Utils';

var initialState = {
    ttUser: {}
};
export default function (state = initialState, action) {
    switch (action.type) {
        case LOAD_TTUSER:
            // Utils.nlog("vao set redux thong tin user", action.data)
            return { ttUser: action.data };
        default:
            return state;
    }
}