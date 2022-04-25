import { CHANGELANGUAGE } from '../actions/type';

var initialState = {
    language: 'vi' //Utils.getGlobal(nGlobalKeys.lang, 'vi')
};
export default function (state = initialState, action) {
    switch (action.type) {
        case CHANGELANGUAGE:
            return { language: action.data };
        default:
            return state;
    }
}