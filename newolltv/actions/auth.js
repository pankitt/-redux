import { CALL_API } from '../api';

export const CLEAR_AUTH = 'CLEAR_AUTH';

export const SMS_PASS_REQUEST = 'SMS_PASS_REQUEST';
export const SMS_PASS_SUCCESS = 'SMS_PASS_SUCCESS';
export const SMS_PASS_FAILURE = 'SMS_PASS_FAILURE';

export function smsPass(login) {
    return {
        [CALL_API]: {
            actions: [ SMS_PASS_REQUEST, SMS_PASS_SUCCESS, SMS_PASS_FAILURE ],
            entity: 'smsPass',
            params: { login },
        },
    };
}

export const SIGN_IN_REQUEST = 'SIGN_IN_REQUEST';
export const SIGN_IN_SUCCESS = 'SIGN_IN_SUCCESS';
export const SIGN_IN_FAILURE = 'SIGN_IN_FAILURE';

export function login(login, password) {
    return dispatch => {
        dispatch({
            [CALL_API]: {
                actions: [ SIGN_IN_REQUEST, SIGN_IN_SUCCESS, SIGN_IN_FAILURE ],
                entity: 'login',
                params: { login, password },
            },
        }).
            then(
                action => {
                    switch (action.type) {
                        case SIGN_IN_SUCCESS:
                            return dispatch(auth());
                    }
                }
            );
    };
}

export const AUTH_REQUEST = 'AUTH_REQUEST';
export const AUTH_SUCCESS = 'AUTH_SUCCESS';
export const AUTH_FAILURE = 'AUTH_FAILURE';

export function authAPICall(email, phone) {
    return {
        [CALL_API]: {
            actions: [ AUTH_REQUEST, AUTH_SUCCESS, AUTH_FAILURE ],
            entity: 'auth',
            params: { email, phone },
        },
    };
}

export function auth(email, phone) {
    return (dispatch, getState) => {
        const signed = getState().auth.signed;
        return dispatch(authAPICall(email, phone)).then(
            action => {
                if (!getState().app.initialized) return;
                switch (action.type) {
                    case AUTH_SUCCESS:
                    case AUTH_FAILURE:
                        if (getState().auth.user.redirectTo) {
                            window.location.href = getState().auth.user.redirectTo;
                            return;
                        }
                        if (getState().auth.signed !== signed) {
                            window.location.reload();
                        }
                }
            }
        );
    };
}

export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE';

export function logout() {
    return dispatch => {
        dispatch(logoutAPICall()).
            then(
                action => {
                    switch (action.type) {
                        case LOGOUT_SUCCESS:
                            return dispatch(auth());
                    }
                }
            );
    };
}

function logoutAPICall() {
    return {
        [CALL_API]: {
            actions: [LOGOUT_REQUEST, LOGOUT_SUCCESS, LOGOUT_FAILURE],
            entity: 'logout',
        },
    };
}
