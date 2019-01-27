import {
    GET_USER_BANK_CARD_REQUEST, GET_USER_BANK_CARD_SUCCESS, GET_USER_BANK_CARD_FAILURE,
    PAYMENT_REQUEST, PAYMENT_SUCCESS, PAYMENT_FAILURE,
    PAYMENT_TRANSACTION_BEGIN, PAYMENT_TRANSACTION_COMPLETE,
    CLEAR_BANKING,
} from '../actions/banking';
import  { SET_VALUE_FOR_BANKING } from '../actions/payment';

const initialState = {
    userBankCards: [],
    userBankCardsRequest: false,
    userBankCardsError: null,
    paymentRequest: false,
    paymentStatus: {},
    transactionInProgress: false,
};

export default function banking(state = initialState, action) {
    switch (action.type) {
        case SET_VALUE_FOR_BANKING:
            return { ...initialState, valueForBanking: action.value };
        case GET_USER_BANK_CARD_REQUEST:
            return { ...state, userBankCards: [], userBankCardsRequest: true, userBankCardsError: null };
        case GET_USER_BANK_CARD_SUCCESS:
            return { ...state, userBankCards: action.response.cards, userBankCardsRequest: false };
        case GET_USER_BANK_CARD_FAILURE:
            return { ...state, userBankCardsRequest: false, userBankCardsError: action.response.error };
        case PAYMENT_TRANSACTION_BEGIN:
            return { ...state, transactionInProgress: true };
        case PAYMENT_TRANSACTION_COMPLETE:
            return { ...state, transactionInProgress: false };
        case PAYMENT_REQUEST:
            return { ...state, paymentRequest: true, paymentStatus: {} };
        case PAYMENT_SUCCESS:
            return { ...state, paymentRequest: false, paymentStatus: action.response.data };
        case PAYMENT_FAILURE:
            return { ...state, paymentRequest: false, paymentStatus: { error: action.error } };
        case CLEAR_BANKING:
            return initialState;
        default:
            return state;
    }
}