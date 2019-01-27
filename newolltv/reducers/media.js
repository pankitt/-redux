import { GET_MEDIA_REQUEST, GET_MEDIA_SUCCESS, GET_MEDIA_FAILURE, CLEAR_MEDIA  } from '../actions/media';
import { CLEAR_VIDEO_ITEM  } from '../actions/videoItem';
import {
    GET_IVI_MEDIA_REQUEST, GET_IVI_MEDIA_SUCCESS, GET_IVI_MEDIA_FAILURE,
    IVI_GEO_CHECK_WHO_AM_I_SUCCESS, IVI_GEO_CHECK_WHO_AM_I_FAILURE,
    GET_IVI_MEDIA_URL_SUCCESS, GET_IVI_MEDIA_URL_FAILURE,
    GET_IVI_TIME_STAMP_REQUEST, GET_IVI_TIME_STAMP_SUCCESS, GET_IVI_TIME_STAMP_FAILURE, CLEAR_IVI_TIME_STAMP,
} from '../actions/iviService';

const initialState = {
    id: null,
    isLoading: false,
    iviTimeTimestampLoading: false,
    error: null,
    item: {},
};

export default function media(state = initialState, action) {
    switch (action.type) {
        case GET_MEDIA_REQUEST:
        case GET_IVI_MEDIA_REQUEST:
            return { ...initialState, isLoading: true, id: action.params.id };
        case GET_MEDIA_FAILURE:
        case GET_IVI_MEDIA_FAILURE:
            return state.id === action.params.id ? { ...state, isLoading: false, error: action.error } : state;
        case GET_MEDIA_SUCCESS:
            return state.id === action.params.id ? { ...state, isLoading: false, item: action.response } : state;
        case GET_IVI_MEDIA_SUCCESS:
            return state.id === action.params.id ? { ...state, isLoading: !!action.response.iviData, item: action.response } : state;
        case IVI_GEO_CHECK_WHO_AM_I_SUCCESS:
            return state.id  ? { ...state, item: { ...state.item, iviData: { ...state.item.iviData, appVersion: action.appVersion } } } : state;
        case IVI_GEO_CHECK_WHO_AM_I_FAILURE:
            return state.id ? { ...state, isLoading: false, error: action.error } : state;
        case GET_IVI_TIME_STAMP_REQUEST:
            return { ...state, iviTimeTimestampLoading: true };
        case GET_IVI_TIME_STAMP_SUCCESS:
        case CLEAR_IVI_TIME_STAMP:
            return state.id ? { ...state, iviTimeTimestampLoading: false, item: { ...state.item, iviData: { ...state.item.iviData, timestamp: action.timestamp } } } : state;
        case GET_IVI_TIME_STAMP_FAILURE:
            return { ...state, iviTimeTimestampLoading: false };
        case GET_IVI_MEDIA_URL_SUCCESS:
            return state.isLoading ? { ...state, isLoading: false, item: { ...state.item,  mediaUrl: action.mediaUrl, watchId: action.watchId } } : state;
        case GET_IVI_MEDIA_URL_FAILURE:
            return state.isLoading ? { ...state, isLoading: false, error: action.error } : state;
        case CLEAR_VIDEO_ITEM:
        case CLEAR_MEDIA:
            return initialState;
        default:
            return state;
    }
}
