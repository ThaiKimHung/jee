import { CHANGELANGUAGE, SHOWNOTIFICATION } from '../actions/type';
import { appConfig } from '../../app/Config';
import Utils from '../../app/Utils';

var initialState = {
    notification: ''
};

export default function (state = initialState, action) {
    switch (action.type) {
        case SHOWNOTIFICATION:
            // Utils.nlog("vao set redux", action.data)
            return { notification: action.data ? action.data : '' };
        default:
            return state;
    }
}