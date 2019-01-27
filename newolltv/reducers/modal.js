import { SET_MODAL_ORIGIN } from '../actions/modal';
import { GET_VIDEO_ITEM_REQUEST, GET_VIDEO_ITEM_SUCCESS, GET_VIDEO_ITEM_FAILURE, CLEAR_VIDEO_ITEM  } from '../actions/videoItem';

const initialState = {
    origin: {
        x: 'center',
        y: 'center',
    },
    transform: false,
    isLoading: false,
    item: {},
    error: null,
};

export default function modal(state = initialState, action) {
    switch (action.type) {
        case SET_MODAL_ORIGIN:
            return { ...state, origin: { x: action.origin.x, y: action.origin.y }, transform: action.transform };
        case GET_VIDEO_ITEM_REQUEST:
            return { ...state, isLoading: true, error: null };
        case GET_VIDEO_ITEM_FAILURE:
            return { ...state, isLoading: false, error: action.error };
        case GET_VIDEO_ITEM_SUCCESS:
            return { ...state, isLoading: false, item: action.response, error: null };
        case CLEAR_VIDEO_ITEM:
            return { ...state, item: initialState.item };
        default:
            return state;
    }
}
