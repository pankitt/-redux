import { FEEDBACK_TOPICS_REQUEST, FEEDBACK_TOPICS_SUCCESS, FEEDBACK_TOPICS_FAILURE,
    SEND_FEEDBACK_REQUEST, SEND_FEEDBACK_SUCCESS, SEND_FEEDBACK_FAILURE } from '../actions/feedback';

const initialState = {
    isLoading: false,
};

export default function feedback(state = initialState, action) {
    switch (action.type) {
        case FEEDBACK_TOPICS_REQUEST:
        case SEND_FEEDBACK_REQUEST:
            return {
                ...state,
                isLoading: true,
                feedbackSent: false,
            };
        case FEEDBACK_TOPICS_SUCCESS:
            return {
                ...state,
                ...action.response,
                isLoading: false,
            };
        case SEND_FEEDBACK_SUCCESS:
            return {
                ...state,
                ...action.response,
                message: action.response.message,
                isLoading: false,
                feedbackSent: true,
            };
        case FEEDBACK_TOPICS_FAILURE:
            return {
                ...state,
                isLoading: false,
            };
        case SEND_FEEDBACK_FAILURE:
            return {
                ...state,
                ...action.response.data,
                errors: action.response.errors,
                message: action.response.message,
                isLoading: false,
            };
        default:
            return state;
    }
}
