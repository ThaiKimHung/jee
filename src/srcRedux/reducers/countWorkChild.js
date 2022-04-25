import { TABCOUNTWORKCHILD } from '../actions/type';

var initialState = {
    countChild: 0
};

export default function (state = initialState, action) {
    switch (action.type) {
        case TABCOUNTWORKCHILD:
            return { countChild: action.data };
        default:
            return state;
    }
}
