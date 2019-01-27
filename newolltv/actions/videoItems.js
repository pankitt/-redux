import { CALL_API } from '../api';

export const GET_VIDEO_ITEMS_REQUEST = 'GET_VIDEO_ITEMS_REQUEST';
export const GET_VIDEO_ITEMS_SUCCESS = 'GET_VIDEO_ITEMS_SUCCESS';
export const GET_VIDEO_ITEMS_FAILURE = 'GET_VIDEO_ITEMS_FAILURE';

export function getVideoItems(action, id, type, genre, order, page, collection) {
    return {
        [CALL_API]: {
            actions: [ GET_VIDEO_ITEMS_REQUEST, GET_VIDEO_ITEMS_SUCCESS, GET_VIDEO_ITEMS_FAILURE ],
            entity: 'videoItems',
            params: { action, id, type, genre, order, page, collection },
        },
    };
}

export const UPDATE_VIDEO_ITEMS_REQUEST = 'UPDATE_VIDEO_ITEMS_REQUEST';
export const UPDATE_VIDEO_ITEMS_SUCCESS = 'UPDATE_VIDEO_ITEMS_SUCCESS';
export const UPDATE_VIDEO_ITEMS_FAILURE = 'UPDATE_VIDEO_ITEMS_FAILURE';

export function updateVideoItems(action, id, type, genre, order, page, collection) {
    return {
        [CALL_API]: {
            actions: [ UPDATE_VIDEO_ITEMS_REQUEST, UPDATE_VIDEO_ITEMS_SUCCESS, UPDATE_VIDEO_ITEMS_FAILURE ],
            entity: 'videoItems',
            params: { action, id, type, genre, order, page, collection },
        },
    };
}
