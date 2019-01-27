import { CALL_API } from '../api/index';

export const SUBSCRIBE_REQUEST = 'SUBSCRIBE_REQUEST';
export const SUBSCRIBE_SUCCESS = 'SUBSCRIBE_SUCCESS';
export const SUBSCRIBE_FAILURE = 'SUBSCRIBE_FAILURE';

export function subscribe(id) {
    return {
        [CALL_API]: {
            actions: [ SUBSCRIBE_REQUEST, SUBSCRIBE_SUCCESS, SUBSCRIBE_FAILURE ],
            entity: 'subscribe',
            params: { id },
        },
    };
}