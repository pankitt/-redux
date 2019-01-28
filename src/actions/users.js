import { CALL_API } from '../api';

export const GET_USERS_REQUEST = 'GET_USERS_REQUEST';
export const GET_USERS_SUCCESS = 'GET_USERS_SUCCESS';
export const GET_USERS_FAILURE = 'GET_USERS_FAILURE';

export function getUsers(params) {
    return {
        [CALL_API]: {
            actions: [ GET_USERS_REQUEST, GET_USERS_SUCCESS, GET_USERS_FAILURE ],
            entity: 'getUsers',
            params,
        },
    };
}