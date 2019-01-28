import {GITHUB_LOADED, GITHUB_LOADED_SUCCESS, GITHUB_LOADED_FAILURE} from '../actions/github';

const initialState = {
    items: {},
    loading: false,
    error: null,
};

export default function github (state = initialState, action) {
    switch (action.type) {
        case GITHUB_LOADED:
            return { ...state, loading: true };
        case GITHUB_LOADED_SUCCESS:
            return { ...state, items: action.response.items };
        case GITHUB_LOADED_FAILURE:
            return { ...state, error: action.error };
        default:
            return state;
    }
}