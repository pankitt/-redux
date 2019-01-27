import { STATIC_PAGE_REQUEST, STATIC_PAGE_SUCCESS, STATIC_PAGE_FAILURE } from '../actions/pages';

const initialState = {
    isLoading: false,
};

export default function pages(state = initialState, action) {
    switch (action.type) {
        case STATIC_PAGE_REQUEST:
            return { ...state, isLoading: true };
        case STATIC_PAGE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                [action.params.id]: { ...action.response },
            };
        case STATIC_PAGE_FAILURE:
            return { ...state, isLoading: false };
        default:
            return state;
    }
}
