import { GET_WORKERS_REQUEST, GET_WORKERS_SUCCESS, GET_WORKERS_FAILURE } from '../actions/workers';

const initialState = {
    items: {},
    ids: [],
    page: [],
    loading: false,
    error: null,
};
export default function workers(state = initialState, action) {
    switch (action.type) {
        case GET_WORKERS_REQUEST:
            return { ...state, loading: true };
        case GET_WORKERS_SUCCESS:
            return { ...state, items: action.response.items, ids: action.response.ids, page: action.response.page };
        case GET_WORKERS_FAILURE:
            return { ...state, error: action.error };
        default:
            return state;
    }
}