import { CALL_API } from '../../api';

export const GET_TOURNAMENT_REQUEST = 'GET_TOURNAMENT_REQUEST';
export const GET_TOURNAMENT_SUCCESS = 'GET_TOURNAMENT_SUCCESS';
export const GET_TOURNAMENT_FAILURE = 'GET_TOURNAMENT_FAILURE';

export function getTournamentTable(id) {
    return {
        [CALL_API]: {
            actions: [ GET_TOURNAMENT_REQUEST, GET_TOURNAMENT_SUCCESS, GET_TOURNAMENT_FAILURE ],
            entity: 'tournamentTable',
            params: { id },
        },
    };
}

export const GET_CUPTREE_REQUEST = 'GET_CUPTREE_REQUEST';
export const GET_CUPTREE_SUCCESS = 'GET_CUPTREE_SUCCESS';
export const GET_CUPTREE_FAILURE = 'GET_CUPTREE_FAILURE';

export function getCupTree(id) {
    return {
        [CALL_API]: {
            actions: [ GET_CUPTREE_REQUEST, GET_CUPTREE_SUCCESS, GET_CUPTREE_FAILURE ],
            entity: 'cupTree',
            params: { id },
        },
    };
}
