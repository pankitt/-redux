import { CALL_API } from '../api';

export const GET_VIDEO_ITEM_REQUEST = 'GET_VIDEO_ITEM_REQUEST';
export const GET_VIDEO_ITEM_SUCCESS = 'GET_VIDEO_ITEM_SUCCESS';
export const GET_VIDEO_ITEM_FAILURE = 'GET_VIDEO_ITEM_FAILURE';

export function getVideoItem(id) {
    return {
        [CALL_API]: {
            actions: [ GET_VIDEO_ITEM_REQUEST, GET_VIDEO_ITEM_SUCCESS, GET_VIDEO_ITEM_FAILURE ],
            entity: 'videoItem',
            params: { id },
        },
    };
}

export const CLEAR_VIDEO_ITEM = 'CLEAR_VIDEO_ITEM';
export function clearVideoItem() {
    return {
        type: CLEAR_VIDEO_ITEM,
    };
}


export const GET_RECOMMENDATIONS_REQUEST = 'GET_RECOMMENDATIONS_REQUEST';
export const GET_RECOMMENDATIONS_SUCCESS = 'GET_RECOMMENDATIONS_SUCCESS';
export const GET_RECOMMENDATIONS_FAILURE = 'GET_RECOMMENDATIONS_FAILURE';

export function getRecommendations(id) {
    return {
        [CALL_API]: {
            actions: [ GET_RECOMMENDATIONS_REQUEST, GET_RECOMMENDATIONS_SUCCESS, GET_RECOMMENDATIONS_FAILURE ],
            entity: 'recommendationsForItem',
            params: { id },
        },
    };
}

export const VIDEO_POSITION_CHANGED = 'VIDEO_POSITION_CHANGED';

export function updateVideoPosition(id, seekTime, percentage) {
    return {
        id,
        seekTime,
        percentage,
        type: VIDEO_POSITION_CHANGED,
    };
}