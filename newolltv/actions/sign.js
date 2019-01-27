import { CALL_API } from '../api';
import { auth } from './auth';
import { POPUP_TYPE_SIGN_UP_CONFIRM, POPUP_TYPE_SIGN_IN } from '../constants';

export const SHOW_SIGN_POPUP = 'SHOW_SIGN_POPUP';
export const HIDE_SIGN_POPUP = 'HIDE_SIGN_POPUP';

export function showSignPopup(popupType = POPUP_TYPE_SIGN_IN) {
    document.body.classList.add('ovh');
    return {
        type: SHOW_SIGN_POPUP, popupType,
    };
}

export function hideSignPopup() {
    document.body.classList.remove('ovh');
    return {
        type: HIDE_SIGN_POPUP,
    };
}

export const SIGN_UP_REQUEST = 'SIGN_UP_REQUEST';
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
export const SIGN_UP_FAILURE = 'SIGN_UP_FAILURE';

export function signup(phone, email) {
    return dispatch => {
        dispatch({
            [CALL_API]: {
                actions: [ SIGN_UP_REQUEST, SIGN_UP_SUCCESS, SIGN_UP_FAILURE ],
                entity: 'signup',
                params: { phone, email },
            },
        }).then(action => {
            switch (action.type) {
                case SIGN_UP_SUCCESS:
                    return dispatch(showSignPopup(POPUP_TYPE_SIGN_UP_CONFIRM));
            }
        });
    };
}

export const SIGN_UP_CONFIRM_REQUEST = 'SIGN_UP_CONFIRM_REQUEST';
export const SIGN_UP_CONFIRM_SUCCESS = 'SIGN_UP_CONFIRM_SUCCESS';
export const SIGN_UP_CONFIRM_FAILURE = 'SIGN_UP_CONFIRM_FAILURE';

export function signupConfirm(phone, code) {
    return dispatch => {
        dispatch({
            [CALL_API]: {
                actions: [ SIGN_UP_CONFIRM_REQUEST, SIGN_UP_CONFIRM_SUCCESS, SIGN_UP_CONFIRM_FAILURE ],
                entity: 'signupConfirm',
                params: { phone, code },
            },
        }).then(action => {
            switch (action.type) {
                case SIGN_UP_CONFIRM_SUCCESS:
                    return dispatch(auth());
            }
        });
    };
}
