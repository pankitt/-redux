import { GET_CONFIG_REQUEST, GET_CONFIG_SUCCESS, GET_CONFIG_FAILURE } from '../actions/config';

const initialState = {
    isLoading: false,
};

export default function config(state = initialState, action) {
    switch (action.type) {
        case GET_CONFIG_REQUEST:
            return { ...state, isLoading: true };
        case GET_CONFIG_SUCCESS:
            return { ...state, isLoading: false, ...action.response };
        case GET_CONFIG_FAILURE:
            return { ...state, isLoading: false };
        default:
            return state;
    }
}
