import { SEARCH_SUGGEST_REQUEST, SEARCH_SUGGEST_SUCCESS, SEARCH_SUGGEST_FAILURE, SEARCH_REQUEST, SEARCH_SUCCESS, SEARCH_FAILURE, SEARCH_CLEAR, SEARCH_BY_CATEGORY_SUCCESS } from '../actions/search';

const initialState = {
    isLoading: false,
    suggestions: null,
    result: null,
};

export default function search(state = initialState, action) {
    switch (action.type) {
        case SEARCH_SUGGEST_REQUEST:
            return { ...state, isSuggestLoading: true };
        case SEARCH_REQUEST:
            return { ...state, isLoading: true };

        case SEARCH_SUGGEST_SUCCESS:
            return {
                ...state,
                isSuggestLoading: false,
                suggestions: action.response.data,
            };
        case SEARCH_SUCCESS:
            return {
                ...state,
                isLoading: false,
                result: action.response,
                noResult: Array.isArray(action.response) && action.params.query.length > 0,
                query: action.params.query,
            };
        case SEARCH_BY_CATEGORY_SUCCESS:
            return {
                ...state,
                result: {
                    ...state.result,
                    [action.params.category]: {
                        ...state.result[action.params.category],
                        hasMore: action.response.hasMore,
                        page: action.params.page,
                        items: [...state.result[action.params.category].items, ...action.response.items],
                    },
                },
            };

        case SEARCH_CLEAR:
            return initialState;

        case SEARCH_SUGGEST_FAILURE:
            return { ...state, isSuggestLoading: false };
        case SEARCH_FAILURE:
            return { ...state, isLoading: false };
        default:
            return state;
    }
}
