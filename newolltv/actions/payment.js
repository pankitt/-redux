import { CALL_API } from '../api/index';

export const GET_PAYMENT_REQUEST = 'GET_PAYMENT_REQUEST';
export const GET_PAYMENT_SUCCESS = 'GET_PAYMENT_SUCCESS';
export const GET_PAYMENT_FAILURE = 'GET_PAYMENT_FAILURE';

export function getPayment(ids) {
    return {
        [CALL_API]: {
            actions: [ GET_PAYMENT_REQUEST, GET_PAYMENT_SUCCESS, GET_PAYMENT_FAILURE ],
            entity: 'payment',
            params: { ids },
        },
    };
}

export const BALANCE_PAY_REQUEST = 'BALANCE_PAY_REQUEST';
export const BALANCE_PAY_SUCCESS = 'BALANCE_PAY_SUCCESS';
export const BALANCE_PAY_FAILURE = 'BALANCE_PAY_FAILURE';

export function balancePay(data) {
    return {
        [CALL_API]: {
            actions: [ BALANCE_PAY_REQUEST, BALANCE_PAY_SUCCESS, BALANCE_PAY_FAILURE ],
            entity: 'balance',
            params: { data },
        },
    };
}

export const SET_VALUE_FOR_BANKING = 'SET_VALUE_FOR_BANKING';

export function setValueForBanking(value) {
    return {
        type: SET_VALUE_FOR_BANKING, value,
    };
}

export const CLEAR_PAYMENT_DATA = 'CLEAR_PAYMENT_DATA';

export function clearPaymentData() {
    return { type: CLEAR_PAYMENT_DATA };
}
