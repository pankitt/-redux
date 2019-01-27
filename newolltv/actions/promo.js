import { CALL_API } from '../api/index';

export const SUBMIT_PROMO_REQUEST = 'SUBMIT_PROMO_REQUEST';
export const SUBMIT_PROMO_SUCCESS = 'SUBMIT_PROMO_SUCCESS';
export const SUBMIT_PROMO_FAILURE = 'SUBMIT_PROMO_FAILURE';

export function submitPromo(code, subs) {
    return {
        [CALL_API]: {
            actions: [ SUBMIT_PROMO_REQUEST, SUBMIT_PROMO_SUCCESS, SUBMIT_PROMO_FAILURE ],
            entity: 'submitPromo',
            params: { code, subs },
        },
    };
}

export const UNDO_PROMO_REQUEST = 'UNDO_PROMO_REQUEST';
export const UNDO_PROMO_SUCCESS = 'UNDO_PROMO_SUCCESS';
export const UNDO_PROMO_FAILURE = 'UNDO_PROMO_FAILURE';

export function undoPromo() {
    return {
        [CALL_API]: {
            actions: [ UNDO_PROMO_REQUEST, UNDO_PROMO_SUCCESS, UNDO_PROMO_FAILURE ],
            entity: 'undoPromo',
        },
    };
}

export const CHANGE_PROMO_CODE = 'CHANGE_PROMO_CODE';

export function changePromo(code) {
    return {
        type: CHANGE_PROMO_CODE, code,
    };
}
