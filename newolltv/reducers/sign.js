import { SHOW_SIGN_POPUP, HIDE_SIGN_POPUP, SIGN_UP_SUCCESS } from '../actions/sign';
import { PASSWORD_RESTORE_REQUEST, PASSWORD_RESTORE_SUCCESS, PASSWORD_RESTORE_FAILURE, CHECK_PASSWORD_KEY_SUCCESS } from '../actions/password';

const initialState = {
    popupType: null,
    login: '',
};

export default function sign(state = initialState, action) {
    switch (action.type) {
        case SHOW_SIGN_POPUP:
            return { ...state, popupType: action.popupType };
        case HIDE_SIGN_POPUP:
            return { ...state, popupType: null };
        case SIGN_UP_SUCCESS:
            return { ...state, login: action.params.phone };

        case PASSWORD_RESTORE_REQUEST:
            return { ...state, restoreError: null };
        case PASSWORD_RESTORE_SUCCESS:
            return { ...state, restoreError: null, login: action.params.login };
        case PASSWORD_RESTORE_FAILURE:
            return { ...state, restoreError: action.error };

        case CHECK_PASSWORD_KEY_SUCCESS:
            return { ...state, token: action.params.token };
        default:
            return state;
    }
}
