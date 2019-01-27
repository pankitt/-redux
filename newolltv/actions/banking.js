/* global BANKPUBLICKEY */

import forge from '../utils/forge';
import { CALL_API } from '../api';

const cipherAlgorithm =  'AES-CBC';
const publicKey = BANKPUBLICKEY || '-----BEGIN PUBLIC KEY-----MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAypNcbMjwFU5MFQ5WlK4OuMiVeub3rROb2djng4SB9VWJd7BOSQ7j3hzFfOPDTGktWYMMIUaDJPLtn/lCb6BoayJCX7DILT1WISQl4a9V58hS6+X7inmYp0a8Q3rDwjtWdPYVOvnJd9og+aFpuFpcHbz7liYifBT6OqO69r3/bcDr45fZCL9DYLCGa1HbqeCZfWCNXWg4k8aVUlTJvbHgGIQFviKZ0Asb/dG0Jb5sxL2vIyAyvWNodLZXwgr+oBtcnFIlcJEMwKNdfMFSiELInjDmvjPQhEDIJy8PNbbDABSdettNZWYuMpO4mLJywft0oAbiSZgea8SVIHRKNwI1PryxSTkaxMISaqWgLkipzskmKHK1VP9iaCvr0AWTvyEYRUg1Gkx8Ouaf0cUrwmAzwEuSksaO3I7iApycngb0QW7vbPq5MpFx0PZEhgxlmD4SLq15G6JG0iJCuQ7MxrDnycwuAvqupB7tyb/B1jYkBSORMrYFeeE9LPQgvKZXVeNGHE6Eh+IlT5nBXfPx/gYq1KJycQVrUMoFe8bbAB2h1jU3j/w4fLEtS4irnf6VyuuUqUcFzlYBNeFfarpQ7ipNtSz63XtHunDLnXRCZk4SG/ZMByCvWc8lc08LF0VUg0k2XrjN4jgJVpY7M8OgerY7g9SRZZsDQWGZV9YQ197H7g8CAwEAAQ==-----END PUBLIC KEY-----';

export const BOUND_BANK_CARD_REQUEST = 'BOUND_BANK_CARD_REQUEST';
export const BOUND_BANK_CARD_SUCCESS = 'BOUND_BANK_CARD_SUCCESS';
export const BOUND_BANK_CARD_FAILURE = 'BOUND_BANK_CARD_FAILURE';

export function boundBankCard(card) {
    return prepareBankData(card);
}

function callBoundCardAPI(data) {
    return {
        [CALL_API]: {
            actions: [ BOUND_BANK_CARD_REQUEST, BOUND_BANK_CARD_SUCCESS, BOUND_BANK_CARD_FAILURE ],
            entity: 'boundCard',
            params: data,
        },
    };
}


export const PAYMENT_TRANSACTION_BEGIN = 'PAYMENT_TRANSACTION_BEGIN';
export const PAYMENT_TRANSACTION_PROGRESS = 'PAYMENT_TRANSACTION_PROGRESS';
export const PAYMENT_TRANSACTION_COMPLETE = 'PAYMENT_TRANSACTION_COMPLETE';

export const PAYMENT_REQUEST = 'PAYMENT_REQUEST';
export const PAYMENT_SUCCESS = 'PAYMENT_SUCCESS';
export const PAYMENT_FAILURE = 'PAYMENT_FAILURE';

export function pay(card, amount, subs, autoProlong) {
    return dispatch => {
        dispatch({ type: PAYMENT_TRANSACTION_BEGIN });
        return dispatch(prepareBankData(card, amount, subs, autoProlong)).then(
            action => {
                if (action.type === PAYMENT_SUCCESS && action.response.data.status === 'progress') {
                    return dispatch(checkPaymentStatus(action.response.data.transactionId));
                }
                dispatch({ type: PAYMENT_TRANSACTION_COMPLETE });
            },
            error => {
                dispatch({ type: PAYMENT_TRANSACTION_COMPLETE, error });
            }
        );
    };
}

const checkPaymentStatus = transactionId => dispatch => {
    let attempt = 0, failure = 0;
    const checkStatus = () => {
        attempt++;
        dispatch({ type: PAYMENT_TRANSACTION_PROGRESS, transactionId, attempt, failure });
        dispatch(checkPaymentStatusAPI(transactionId))
            .then(
                action => {
                    if (action.type === GET_TRANSACTION_STATUS_FAILURE) {
                        failure++;
                        setTimeout(checkStatus, 5000);
                        return;
                    }
                    switch (action.response.data.status === 'ok') {
                        case 'ok':
                            return dispatch({ type: PAYMENT_TRANSACTION_COMPLETE });
                        case 'progress':
                            setTimeout(checkStatus, 5000);
                            return;
                    }
                }
            );
    };
    checkStatus();
};

export const GET_TRANSACTION_STATUS_REQUEST = 'GET_TRANSACTION_STATUS_REQUEST';
export const GET_TRANSACTION_STATUS_SUCCESS = 'GET_TRANSACTION_STATUS_SUCCESS';
export const GET_TRANSACTION_STATUS_FAILURE = 'GET_TRANSACTION_STATUS_FAILURE';

function checkPaymentStatusAPI(transactionId) {
    return {
        [CALL_API]: {
            actions: [ GET_TRANSACTION_STATUS_REQUEST, GET_TRANSACTION_STATUS_SUCCESS, GET_TRANSACTION_STATUS_FAILURE ],
            entity: 'getTransactionStatus',
            transactionId,
        },
    };
}

function callPayAPI(data) {
    return {
        [CALL_API]: {
            actions: [ PAYMENT_REQUEST, PAYMENT_SUCCESS, PAYMENT_FAILURE ],
            entity: 'pay',
            params: { data },
        },
    };
}

export const PREPARE_PAYMENT_DATA = 'PREPARE_PAYMENT_DATA';

function prepareBankData(card, amount, subs, autoProlong) {
    return dispatch => {
        dispatch({ type: PREPARE_PAYMENT_DATA });
        let key = forge.random.getBytesSync(32),
            cipher = forge.cipher.createCipher(cipherAlgorithm, key),
            pk = forge.pki.publicKeyFromPem(publicKey),
            iv = forge.random.getBytesSync(16);

        cipher.start({ iv });

        if (typeof card === 'string') {
            cipher.update(forge.util.createBuffer(
                JSON.stringify({
                    token: card,
                    t: Date.now(),
                })
            ));
        } else {
            cipher.update(forge.util.createBuffer(
                JSON.stringify({
                    ...card,
                    t: Date.now(),
                    // firstname: '',
                    // lastname: '',
                })
            ));
        }
        cipher.finish();

        let data = {
            key: forge.util.encode64(pk.encrypt(key)),
            data: forge.util.encode64(iv + cipher.output.bytes()),
        };

        if (process.env.NODE_ENV !== 'production') {
            data.sandbox = 1;
        }

        if (amount) {
            let remember = autoProlong === undefined ? 1 : +autoProlong;
            return dispatch(callPayAPI({ ...data, amount, remember, subs: [subs], autoProlong }));
        }

        return dispatch(callBoundCardAPI(data));
    };
}

export const GET_USER_BANK_CARD_REQUEST = 'GET_USER_BANK_CARD_REQUEST';
export const GET_USER_BANK_CARD_SUCCESS = 'GET_USER_BANK_CARD_SUCCESS';
export const GET_USER_BANK_CARD_FAILURE = 'GET_USER_BANK_CARD_FAILURE';

export function getUserBankCards() {
    return {
        [CALL_API]: {
            actions: [ GET_USER_BANK_CARD_REQUEST, GET_USER_BANK_CARD_SUCCESS, GET_USER_BANK_CARD_FAILURE ],
            entity: 'userBankCards',
        },
    };
}

export const CLEAR_BANKING = 'CLEAR_BANKING';

export function clearBanking() {
    return { type: CLEAR_BANKING };
}
