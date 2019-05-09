import { BROADCAST_TEASERS } from '../actions/broadcastTeasers';

const initialState = {
    items: {},
};
export default function users(state = initialState, action) {
    switch (action.type) {
        case BROADCAST_TEASERS:
            return { ...state, items: action.data };
        default:
            return state;
    }
}