import { CALL_API } from '../api';

export const ADD_USER_REQUEST = 'ADD_USER_REQUEST';
export const ADD_USER_SUCCESS = 'ADD_USER_SUCCESS';
export const ADD_USER_FAILURE = 'ADD_USER_FAILURE';

export function postUser(name, username, phone, website) {
    return {
        [CALL_API]: {
            actions: [ ADD_USER_REQUEST, ADD_USER_SUCCESS, ADD_USER_FAILURE ],
            entity: 'postUser',
            params: { name, username, phone, website },
        }
    }
}