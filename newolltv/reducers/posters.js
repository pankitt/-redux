import {
    GET_POSTERS_REQUEST,
    GET_POSTERS_SUCCESS,
    GET_POSTERS_FAILURE,
} from '../actions/posters';

const INITIAL_STATE = {
    isLoading: false,
    items: [],
};

export default function posters(state = INITIAL_STATE, action) {
    switch (action.type) {
        case GET_POSTERS_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case GET_POSTERS_FAILURE:
            return {
                ...state,
                isLoading: false,
            };
        case GET_POSTERS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                items: action.response,
            };
        default:
            return state;
    }
}
