import { CALL_API } from '../api';

export const GET_WORKERS_REQUEST = 'GET_WORKERS_REQUEST';
export const GET_WORKERS_SUCCESS = 'GET_WORKERS_SUCCESS';
export const GET_WORKERS_FAILURE = 'GET_WORKERS_FAILURE';

export function getWorkers(params) {
    return {
        [CALL_API]: {
            actions: [ GET_WORKERS_REQUEST, GET_WORKERS_SUCCESS, GET_WORKERS_FAILURE ],
            entity: 'getWorkers',
            params: {page: params},
        },
    };
}