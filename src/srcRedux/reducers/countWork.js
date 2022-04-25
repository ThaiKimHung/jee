import { TABCOUNTWORK, TABCOUNTPROCEDURALWORK } from '../actions/type';

var initialState = {
    count: 0
};
var initialState_ProceduralWork = {
    count: 0
}

export default function (state = initialState, action) {
    switch (action.type) {
        case TABCOUNTWORK:
            return { count: action.data };
        default:
            return state;
    }
}
export function countProceduralWork(state = initialState_ProceduralWork, action) {
    switch (action.type) {
        case TABCOUNTPROCEDURALWORK:
            return { count: action.data };
        default:
            return state;
    }
}
