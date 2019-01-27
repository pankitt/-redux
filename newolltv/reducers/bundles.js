import { GET_BUNDLES_REQUEST, GET_BUNDLES_SUCCESS, GET_BUNDLES_FAILURE } from '../actions/bundles';

const initialState = {
    isLoading: false,
    items: {},
    ids: [],
    page: '',
    error: {},
    specialOffers: null,
};

export default function bundles(state = initialState, action) {
    switch (action.type) {
        case GET_BUNDLES_REQUEST:
            return { ...state, isLoading: true };
        case GET_BUNDLES_FAILURE:
            return { ...state, isLoading: false, error: action.response.error };
        case GET_BUNDLES_SUCCESS:
            return {
                ...state,
                isLoading: false,
                page: action.response.page,
                items: action.response.items,
                ids: action.response.ids,
                specialOffers: action.response.specialOffers,
            };
        default:
            return state;
    }
}
