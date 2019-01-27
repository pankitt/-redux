import { APP_INITIALIZED } from '../actions';
import { AUTH_SUCCESS } from '../actions/auth';
const initialState = {
    initialized: false,
};

export default function app(state = initialState, action) {
    switch (action.type) {
        case APP_INITIALIZED:
            return {
                ...state,
                initialized: true,
            };
        case AUTH_SUCCESS:
            return {
                ...state,
                senderWidget: action.response.senderWidget,
                trial: { sec: action.response.trialDuration },
            };
        default:
            return state;
    }
}
