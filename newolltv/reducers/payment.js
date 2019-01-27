import {
    GET_PAYMENT_REQUEST, GET_PAYMENT_SUCCESS, GET_PAYMENT_FAILURE,
    BALANCE_PAY_REQUEST, BALANCE_PAY_SUCCESS, BALANCE_PAY_FAILURE,
    CLEAR_PAYMENT_DATA,
} from '../actions/payment';
import { SUBMIT_PROMO_REQUEST, SUBMIT_PROMO_SUCCESS, SUBMIT_PROMO_FAILURE, CHANGE_PROMO_CODE, UNDO_PROMO_REQUEST, UNDO_PROMO_FAILURE, UNDO_PROMO_SUCCESS } from '../actions/promo';
import { PAYMENT_SUCCESS } from '../actions/banking';

const initialState = {
    isLoading: false,
    discount: null,
    error: null,
    promoCode: {
        value: '',
        isLoading: false,
        error: null,
    },
};

export default function payment(state = initialState, action) {
    switch (action.type) {
        case GET_PAYMENT_REQUEST:
            return { ...state, isLoading: true, error: null, valueForBanking: null };
        case GET_PAYMENT_FAILURE:
            return { ...state, isLoading: false, error: action.response.error };
        case GET_PAYMENT_SUCCESS:
            return { ...state, ...action.response, isLoading: false };
        case PAYMENT_SUCCESS:
            return { ...state, data: { subs: action.params.data.subs }, isLoading: false };

        case CLEAR_PAYMENT_DATA:
            return { ...state, subs: null, promoCode: initialState.promoCode };


        case UNDO_PROMO_REQUEST:
            return { ...state, promoCode: { ...state.promoCode, error: null, isLoading: true } };
        case UNDO_PROMO_FAILURE:
            return { ...state, promoCode: { ...state.promoCode, error: action.error, isLoading: true } };
        case UNDO_PROMO_SUCCESS:
            return { ...state, promoCode: { ...state.promoCode }, discount: null };

        case SUBMIT_PROMO_REQUEST:
            return { ...state, promoCode: { ...state.promoCode, error: null, isLoading: true } };
        case SUBMIT_PROMO_FAILURE:
            return { ...state, promoCode: { ...state.promoCode, error: action.error, isLoading: false } };
        case SUBMIT_PROMO_SUCCESS:
            return {
                ...state,
                promoCode: initialState.promoCode,
                discount: action.response.data,
            };

        case CHANGE_PROMO_CODE:
            return { ...state, promoCode: { ...state.promoCode, value: action.code, error: null } };

        case BALANCE_PAY_REQUEST:
            return { ...state, isLoading: true, error: null, data: null };
        case BALANCE_PAY_FAILURE:
            return { ...state, isLoading: false, error: action.response.error };
        case BALANCE_PAY_SUCCESS:
            return { ...state, ...action.response, isLoading: false, error: null };

        default:
            return state;
    }
}
