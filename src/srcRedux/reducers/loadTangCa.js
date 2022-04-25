import { LOADTANGCA } from '../actions/type';
import { appConfig } from '../../app/Config';

var initialState = {
    loadtangca: false
};
export default function (state = initialState, action) {
    switch (action.type) {
        case LOADTANGCA:
            return { loadtangca: action.val };
        default:
            return state;
    }
}