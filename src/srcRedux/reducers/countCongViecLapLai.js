import { TABCOUNTCongViecLapLaiTuan, TABCOUNTCongViecLapLaiThang } from '../actions/type';

var initialState_CVTuan = {
    count: 0
};
var initialState_CVThang = {
    count: 0
}

export default function (state = initialState_CVTuan, action) {
    switch (action.type) {
        case TABCOUNTCongViecLapLaiTuan:
            return { count: action.data };
        default:
            return state;
    }
}
export function countCVThang(state = initialState_CVThang, action) {
    switch (action.type) {
        case TABCOUNTCongViecLapLaiThang:
            return { count: action.data };
        default:
            return state;
    }
}
