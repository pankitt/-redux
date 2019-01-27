import { CALL_API } from '../api';

export const ORDER_CALLBACK_REQUEST = 'ORDER_CALLBACK_REQUEST';
export const ORDER_CALLBACK_SUCCESS = 'ORDER_CALLBACK_SUCCESS';
export const ORDER_CALLBACK_FAILURE = 'ORDER_CALLBACK_FAILURE';

export function orderCallback(phone) {
    return dispatch => dispatch({
        [CALL_API]: {
            actions: [ ORDER_CALLBACK_REQUEST, ORDER_CALLBACK_SUCCESS, ORDER_CALLBACK_FAILURE ],
            entity: 'orderCallback',
            params: { phone },
        },
    });
}
