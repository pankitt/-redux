import { CALL_API } from '../api';

export const SEARCH_SUGGEST_REQUEST = 'SEARCH_SUGGEST_REQUEST';
export const SEARCH_SUGGEST_SUCCESS = 'SEARCH_SUGGEST_SUCCESS';
export const SEARCH_SUGGEST_FAILURE = 'SEARCH_SUGGEST_FAILURE';

export function getSearchSuggest(query) {
    return {
        [CALL_API]: {
            actions: [ SEARCH_SUGGEST_REQUEST, SEARCH_SUGGEST_SUCCESS, SEARCH_SUGGEST_FAILURE ],
            entity: 'searchSuggest',
            params: { query },
        },
    };
}

export const SEARCH_REQUEST = 'SEARCH_REQUEST';
export const SEARCH_SUCCESS = 'SEARCH_SUCCESS';
export const SEARCH_FAILURE = 'SEARCH_FAILURE';

export function getSearch(query) {
    return {
        [CALL_API]: {
            actions: [ SEARCH_REQUEST, SEARCH_SUCCESS, SEARCH_FAILURE ],
            entity: 'search',
            params: { query },
        },
    };
}

export const SEARCH_BY_CATEGORY_REQUEST = 'SEARCH_BY_CATEGORY_REQUEST';
export const SEARCH_BY_CATEGORY_SUCCESS = 'SEARCH_BY_CATEGORY_SUCCESS';
export const SEARCH_BY_CATEGORY_FAILURE = 'SEARCH_BY_CATEGORY_FAILURE';

export function getSearchByCategory(query, category, page) {
    return {
        [CALL_API]: {
            actions: [ SEARCH_BY_CATEGORY_REQUEST, SEARCH_BY_CATEGORY_SUCCESS, SEARCH_BY_CATEGORY_FAILURE ],
            entity: 'searchByCategory',
            params: { query, category, page },
        },
    };
}

export const SEARCH_CLEAR = 'SEARCH_CLEAR';
export function clearSearch() {
    return {
        type: SEARCH_CLEAR,
    };
}
