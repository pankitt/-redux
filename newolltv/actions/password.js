import { CALL_API } from '../api';
// import { auth } from './auth';
import { showSignPopup } from './sign';

import {
    POPUP_TYPE_PASSWORD_CHANGE,
    POPUP_TYPE_PASSWORD_CONFIRM,
    POPUP_TYPE_PASSWORD_EMAIL,
} from '../constants';

export const PASSWORD_RESTORE_REQUEST = 'PASSWORD_RESTORE_REQUEST';
export const PASSWORD_RESTORE_SUCCESS = 'PASSWORD_RESTORE_SUCCESS';
export const PASSWORD_RESTORE_FAILURE = 'PASSWORD_RESTORE_FAILURE';

export function passwordRestore(login) {
    return dispatch => dispatch({
        [CALL_API]: {
            actions: [ PASSWORD_RESTORE_REQUEST, PASSWORD_RESTORE_SUCCESS, PASSWORD_RESTORE_FAILURE ],
            entity: 'passwordRestore',
            params: { login },
        },
    }).then(action => {
        switch (action.type) {
            case PASSWORD_RESTORE_SUCCESS:
                if (login.indexOf('@') < 0) {
                    return dispatch(showSignPopup(POPUP_TYPE_PASSWORD_CONFIRM));
                }
                return dispatch(showSignPopup(POPUP_TYPE_PASSWORD_EMAIL));
        }
    });
}

export const PASSWORD_CONFIRM_REQUEST = 'PASSWORD_CONFIRM_REQUEST';
export const PASSWORD_CONFIRM_SUCCESS = 'PASSWORD_CONFIRM_SUCCESS';
export const PASSWORD_CONFIRM_FAILURE = 'PASSWORD_CONFIRM_FAILURE';

export function passwordConfirm(login, password) {
    return dispatch => dispatch({
        [CALL_API]: {
            actions: [ PASSWORD_CONFIRM_REQUEST, PASSWORD_CONFIRM_SUCCESS, PASSWORD_CONFIRM_FAILURE ],
            entity: 'passwordConfirm',
            params: { login, password },
        },
    }).then(action => {
        switch (action.type) {
            case PASSWORD_CONFIRM_SUCCESS:
                // dispatch(auth());
                window.location.reload();
                break;
        }
    });
}

export const CHECK_PASSWORD_KEY_REQUEST = 'CHECK_PASSWORD_KEY_REQUEST';
export const CHECK_PASSWORD_KEY_SUCCESS = 'CHECK_PASSWORD_KEY_SUCCESS';
export const CHECK_PASSWORD_KEY_FAILURE = 'CHECK_PASSWORD_KEY_FAILURE';

export function checkPasswordToken(token) {
    return dispatch => dispatch({
        [CALL_API] : {
            actions: [ CHECK_PASSWORD_KEY_REQUEST, CHECK_PASSWORD_KEY_SUCCESS, CHECK_PASSWORD_KEY_FAILURE ],
            entity: 'passwordCheckToken',
            params: { token },
        },
    }).then(action => {
        switch (action.type) {
            case CHECK_PASSWORD_KEY_SUCCESS:
                return dispatch(showSignPopup(POPUP_TYPE_PASSWORD_CHANGE));
        }
    });
}

export const CHANGE_PASSWORD_REQUEST = 'CHANGE_PASSWORD_REQUEST';
export const CHANGE_PASSWORD_SUCCESS = 'CHANGE_PASSWORD_SUCCESS';
export const CHANGE_PASSWORD_FAILURE = 'CHANGE_PASSWORD_FAILURE';

export function passwordChange(token, password) {
    return dispatch => dispatch({
        [CALL_API]: {
            actions: [ CHANGE_PASSWORD_REQUEST, CHANGE_PASSWORD_SUCCESS, CHANGE_PASSWORD_FAILURE ],
            entity: 'passwordChange',
            params: { token, password },
        },
    }).then(action => {
        switch (action.type) {
            case CHANGE_PASSWORD_SUCCESS:
                // dispatch(hideSignPopup());
                // dispatch(auth());
                window.location.reload();
                break;
        }
    });
}
