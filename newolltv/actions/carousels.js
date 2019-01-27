import { CALL_API } from '../api';

export const GET_CAROUSEL_REQUEST = 'GET_CAROUSEL_REQUEST';
export const GET_CAROUSEL_SUCCESS = 'GET_CAROUSEL_SUCCESS';
export const GET_CAROUSEL_FAILURE = 'GET_CAROUSEL_FAILURE';

export default function getCarousel(action, id, type, title) {
    return {
        [CALL_API]: {
            actions: [ GET_CAROUSEL_REQUEST, GET_CAROUSEL_SUCCESS, GET_CAROUSEL_FAILURE ],
            entity: 'videoItems',
            params: { action, id, type, title },
        },
    };
}

export const REMOVE_FROM_CONTINUE_VIEW_REQUEST = 'REMOVE_FROM_CONTINUE_VIEW_REQUEST';
export const REMOVE_FROM_CONTINUE_VIEW_SUCCESS = 'REMOVE_FROM_CONTINUE_VIEW_SUCCESS';
export const REMOVE_FROM_CONTINUE_VIEW_FAILURE = 'REMOVE_FROM_CONTINUE_VIEW_FAILURE';

export function removeFromContinueView(itemId) {
    return {
        [CALL_API]: {
            actions: [ REMOVE_FROM_CONTINUE_VIEW_REQUEST, REMOVE_FROM_CONTINUE_VIEW_SUCCESS, REMOVE_FROM_CONTINUE_VIEW_FAILURE],
            entity: 'removeFromContinueView',
            params: { itemId },
        },
    };
}