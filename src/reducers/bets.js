import { GET_BETS_REQUEST, GET_BETS_SUCCESS, GET_BETS_FAILURE } from '../actions/bets';

const initialState = {
    items: {},
    loading: false,
    error: null,
};

export default function bets (state = initialState, action) {
    switch (action.type) {
        case GET_BETS_REQUEST:
            return { ...state, loading: true };
        case GET_BETS_SUCCESS:
            return { ...state, items: action.response.items };
        case GET_BETS_FAILURE:
            return { ...state, error: action.error };
        default:
            return state;
    }
}