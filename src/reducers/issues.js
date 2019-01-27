import {LOADED_ISSUES} from '../actions/issues';

export default function issues (state = [], action) {
    switch (action.type) {
        case LOADED_ISSUES:
            return [...state, ...action.payload];
        default:
            return state;
    }
}