import { CALL_API } from '../api';

export const GET_POSTERS_REQUEST = 'GET_POSTERS_REQUEST';
export const GET_POSTERS_SUCCESS = 'GET_POSTERS_SUCCESS';
export const GET_POSTERS_FAILURE = 'GET_POSTERS_FAILURE';

export function getPostersItems() {
    return {
        [CALL_API]: {
            actions: [ GET_POSTERS_REQUEST, GET_POSTERS_SUCCESS, GET_POSTERS_FAILURE ],
            entity: 'posterItems',
        },
    };
}
