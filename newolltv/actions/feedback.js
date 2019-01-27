import { CALL_API } from '../api';

export const FEEDBACK_TOPICS_REQUEST = 'FEEDBACK_TOPICS_REQUEST';
export const FEEDBACK_TOPICS_SUCCESS = 'FEEDBACK_TOPICS_SUCCESS';
export const FEEDBACK_TOPICS_FAILURE = 'FEEDBACK_TOPICS_FAILURE';

export function getTopics() {
    return {
        [CALL_API]: {
            actions: [ FEEDBACK_TOPICS_REQUEST, FEEDBACK_TOPICS_SUCCESS, FEEDBACK_TOPICS_FAILURE ],
            entity: 'feedbackTopics',
        },
    };
}

export const SEND_FEEDBACK_REQUEST = 'SEND_FEEDBACK_REQUEST';
export const SEND_FEEDBACK_SUCCESS = 'SEND_FEEDBACK_SUCCESS';
export const SEND_FEEDBACK_FAILURE = 'SEND_FEEDBACK_FAILURE';

export function submit(params) {
    return {
        [CALL_API]: {
            actions: [SEND_FEEDBACK_REQUEST, SEND_FEEDBACK_SUCCESS, SEND_FEEDBACK_FAILURE],
            entity: 'sendFeedback',
            params,
        },
    };
}
