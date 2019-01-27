import {
    GET_CAROUSEL_REQUEST,
    GET_CAROUSEL_SUCCESS,
    GET_CAROUSEL_FAILURE,
    REMOVE_FROM_CONTINUE_VIEW_FAILURE,
    REMOVE_FROM_CONTINUE_VIEW_REQUEST,
    REMOVE_FROM_CONTINUE_VIEW_SUCCESS,
} from '../actions/carousels';
import { createName } from '../helpers/createName';
import { CONTINUE_VIEW_CAROUSEL_PRESET_ID } from '../constants';

const initialState = {
    isLoading: false,
    isRemovingItem: false,
};

export default function carousels(state = initialState, action) {
    switch (action.type) {
        case GET_CAROUSEL_REQUEST:
            return { ...state, isLoading: true };
        case GET_CAROUSEL_FAILURE:
            return { ...state, isLoading: false };
        case GET_CAROUSEL_SUCCESS:
            return {
                ...state,
                isLoading: false,
                [createName(action.params.action, action.params.id, action.params.type)]: {
                    title: action.params.title,
                    ids: [...action.response.ids],
                },
            };
        case REMOVE_FROM_CONTINUE_VIEW_REQUEST:
            return { ...state, isRemovingItem: true };
        case REMOVE_FROM_CONTINUE_VIEW_FAILURE:
            return { ...state, isRemovingItem: false };
        case REMOVE_FROM_CONTINUE_VIEW_SUCCESS:
            return removeFromContinueView(state, action);
        default:
            return state;
    }
}

function removeFromContinueView(state, action) {
    const listName = createName('list', CONTINUE_VIEW_CAROUSEL_PRESET_ID);
    return {
        ...state,
        [listName]: {
            ...state[listName],
            ids: state[listName].ids.filter(id => id !== action.params.itemId),
        },
        isRemovingItem: false,
    };
}