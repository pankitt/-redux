import { GET_ALL_RADIO_REQUEST, GET_ALL_RADIO_SUCCESS, GET_ALL_RADIO_FAILURE } from '../actions/radio';
const initialState = {
    genres: {},
    items: {},
    ids: [],
    isLoading: false,
};

export default function radio(state = initialState, action) {
    switch (action.type) {
        case GET_ALL_RADIO_REQUEST:
            return { ...state, isLoading: true };
        case GET_ALL_RADIO_FAILURE:
            return { ...state, isLoading: false };
        case GET_ALL_RADIO_SUCCESS:
            return {
                ...state,
                items: action.response.radio,
                ids: action.response.ids,
                genres: action.response.genres,
                genresIds: action.response.genresIds,
                isLoading: false,
            };
        default:
            return state;
    }
}
