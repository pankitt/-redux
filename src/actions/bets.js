import { CALL_API } from '../api';

export const GET_BETS_REQUEST = 'GET_BETS_REQUEST';
export const GET_BETS_SUCCESS = 'GET_BETS_SUCCESS';
export const GET_BETS_FAILURE = 'GET_BETS_FAILURE';

export function getBets(params) {
    return {
        [CALL_API]: {
            actions: [ GET_BETS_REQUEST, GET_BETS_SUCCESS, GET_BETS_FAILURE ],
            entity: 'getBets',
            params,
        },
    };
}