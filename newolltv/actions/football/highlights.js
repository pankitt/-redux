import { CALL_API } from '../../api';

export const GET_HIGHLIGHTS_REQUEST = 'GET_HIGHLIGHTS_REQUEST';
export const GET_HIGHLIGHTS_SUCCESS = 'GET_HIGHLIGHTS_SUCCESS';
export const GET_HIGHLIGHTS_FAILURE = 'GET_HIGHLIGHTS_FAILURE';

export function getHighlights(params) {
    return {
        [CALL_API]: {
            actions: [ GET_HIGHLIGHTS_REQUEST, GET_HIGHLIGHTS_SUCCESS, GET_HIGHLIGHTS_FAILURE ],
            entity: 'highlights',
            params,
        },
    };
}
