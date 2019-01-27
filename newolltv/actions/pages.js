import { CALL_API } from '../api';

export const STATIC_PAGE_REQUEST = 'STATIC_PAGE_REQUEST';
export const STATIC_PAGE_SUCCESS = 'STATIC_PAGE_SUCCESS';
export const STATIC_PAGE_FAILURE = 'STATIC_PAGE_FAILURE';

export function getPage(id) {
    return {
        [CALL_API]: {
            actions: [ STATIC_PAGE_REQUEST, STATIC_PAGE_SUCCESS, STATIC_PAGE_FAILURE ],
            entity: 'staticPage',
            params: { id },
        },
    };
}
