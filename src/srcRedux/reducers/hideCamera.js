import { HIDECAMERA } from '../actions/type';

var initialState = {
    camera: true
};

export default function (state = initialState, action) {
    switch (action.type) {
        case HIDECAMERA:
            return {camera: action.data}
        default:
            return state;
    }
}

