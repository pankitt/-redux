import { GET_USERS_REQUEST, GET_USERS_SUCCESS, GET_USERS_FAILURE } from '../actions/users';

const initialState = {
    items: {},
    ids: [],
    loading: false,
    error: null,
};
export default function users(state = initialState, action) {
    switch (action.type) {
        case GET_USERS_REQUEST:
            return { ...state, loading: true };
        case GET_USERS_SUCCESS:
            return { ...state, items: action.response.items, ids: action.response.ids };
        case GET_USERS_FAILURE:
            return { ...state, error: action.error };
        default:
            return state;
    }
}