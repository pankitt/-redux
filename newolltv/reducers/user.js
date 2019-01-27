import { LOGIN_IN_REQUEST, LOGIN_IN_SUCCESS, LOGIN_IN_FAILURE } from '../actions/auth';

export default function app(state = { initialized: false, signed: false, signRequest: false }, action) {
    switch (action.type) {
        case LOGIN_IN_REQUEST:
            return { ...state, signed: false, signRequest: true, signFailure: '' };
        case LOGIN_IN_SUCCESS:
            return { ...state, signed: true, signRequest: false, signFailure: '' };
        case LOGIN_IN_FAILURE:
            return { ...state, signed: false, signRequest: false, signFailure: action.message };
        default:
            return state;
    }
}