import {
    CLEAR_AUTH,
    SIGN_IN_REQUEST, SIGN_IN_SUCCESS, SIGN_IN_FAILURE,
    AUTH_REQUEST, AUTH_SUCCESS, AUTH_FAILURE,
    SMS_PASS_REQUEST, SMS_PASS_SUCCESS, SMS_PASS_FAILURE,
} from '../actions/auth';

import { SIGN_UP_FAILURE, SIGN_UP_CONFIRM_FAILURE } from '../actions/sign';

const initialState = {
    smsPasswordRequest: false,
    smsPasswordSent: 0,
    smsPasswordError: null,
    signInRequest: false,
    signInError: null,
    signUpRequest: false,
    signUpError: null,
    signUpConfirmRequest: false,
    signUpConfirmError: null,
    signed: false,
    authRequest: false,
    authError: null,
    user: {},
};

export default function app(state = { ...initialState, initialized: false }, action) {
    switch (action.type) {
        case CLEAR_AUTH:
            return initialState;
        case SMS_PASS_REQUEST:
            return { ...initialState, smsPasswordRequest: true, smsPasswordSent: state.smsPasswordSent };
        case SMS_PASS_SUCCESS:
            return { ...initialState, smsPasswordSent: Date.now() };
        case SMS_PASS_FAILURE:
            return { ...initialState, smsPasswordError: action.error };

        case SIGN_UP_CONFIRM_FAILURE:
            return { ...initialState, signUpConfirmError: action.error };

        case SIGN_IN_REQUEST:
            return { ...initialState, signInRequest: true };
        case SIGN_IN_SUCCESS:
            return { ...initialState };
        case SIGN_IN_FAILURE:
            return { ...initialState, signInError: action.error };
        case SIGN_UP_FAILURE:
            return { ...initialState, signUpError: action.error };

        case AUTH_REQUEST:
            return { ...state, authRequest: true, authError: false };
        case AUTH_FAILURE:
            return { ...state, authRequest: false, authError: action.error };
        case AUTH_SUCCESS:
            return { ...state, authRequest: false, user: action.response, signed : !!action.response.id  };

        default:
            return state;
    }
}
