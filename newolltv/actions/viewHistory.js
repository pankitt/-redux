import { CALL_API } from '../api';

export const GET_VIEW_HISTORY_AMOUNTS_REQUEST = 'GET_VIEW_HISTORY_AMOUNTS_REQUEST';
export const GET_VIEW_HISTORY_AMOUNTS_SUCCESS = 'GET_VIEW_HISTORY_AMOUNTS_SUCCESS';
export const GET_VIEW_HISTORY_AMOUNTS_FAILURE = 'GET_VIEW_HISTORY_AMOUNTS_FAILURE';

export function getViewHistoryAmounts() {
    return {
        [CALL_API]: {
            actions: [GET_VIEW_HISTORY_AMOUNTS_REQUEST, GET_VIEW_HISTORY_AMOUNTS_SUCCESS, GET_VIEW_HISTORY_AMOUNTS_FAILURE],
            entity: 'viewHistoryAmounts',
            params: {},
        },
    };
}

export const GET_VIEW_HISTORY_ITEMS_REQUEST = 'GET_VIEW_HISTORY_ITEMS_REQUEST';
export const GET_VIEW_HISTORY_ITEMS_SUCCESS = 'GET_VIEW_HISTORY_ITEMS_SUCCESS';
export const GET_VIEW_HISTORY_ITEMS_FAILURE = 'GET_VIEW_HISTORY_ITEMS_FAILURE';

export function getViewHistoryItems(type, page) {
    return {
        [CALL_API]: {
            actions: [ GET_VIEW_HISTORY_ITEMS_REQUEST, GET_VIEW_HISTORY_ITEMS_SUCCESS, GET_VIEW_HISTORY_ITEMS_FAILURE ],
            entity: 'viewHistoryItems',
            params: { type, page },
        },
    };
}

export const CLEAR_VIEW_HISTORY_ITEMS_REQUEST = 'CLEAR_VIEW_HISTORY_ITEMS_REQUEST';
export const CLEAR_VIEW_HISTORY_ITEMS_SUCCESS = 'CLEAR_VIEW_HISTORY_ITEMS_SUCCESS';
export const CLEAR_VIEW_HISTORY_ITEMS_FAILURE = 'CLEAR_VIEW_HISTORY_ITEMS_FAILURE';

export function clearViewHistoryItems(itemId) {
    let params = itemId === null ? {} : { itemId };
    return {
        [CALL_API]: {
            actions: [ CLEAR_VIEW_HISTORY_ITEMS_REQUEST, CLEAR_VIEW_HISTORY_ITEMS_SUCCESS, CLEAR_VIEW_HISTORY_ITEMS_FAILURE ],
            entity: 'clearViewHistoryItems',
            params,
        },
    };
}
