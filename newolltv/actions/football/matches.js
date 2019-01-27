import { CALL_API } from '../../api';

export const GET_MATCHES_REQUEST = 'GET_MATCHES_REQUEST';
export const GET_MATCHES_SUCCESS = 'GET_MATCHES_SUCCESS';
export const GET_MATCHES_FAILURE = 'GET_MATCHES_FAILURE';

export function getMatches(params) {
    return {
        [CALL_API]: {
            actions: [ GET_MATCHES_REQUEST, GET_MATCHES_SUCCESS, GET_MATCHES_FAILURE ],
            entity: 'matches',
            params,
        },
    };
}

export const GET_LEAGUE_MATCHES_REQUEST = 'GET_LEAGUE_MATCHES_REQUEST';
export const GET_LEAGUE_MATCHES_SUCCESS = 'GET_LEAGUE_MATCHES_SUCCESS';
export const GET_LEAGUE_MATCHES_FAILURE = 'GET_LEAGUE_MATCHES_FAILURE';

export function getLeagueMatches(params) {
    return {
        [CALL_API]: {
            actions: [ GET_LEAGUE_MATCHES_REQUEST, GET_LEAGUE_MATCHES_SUCCESS, GET_LEAGUE_MATCHES_FAILURE ],
            entity: 'matches',
            params: { ...params, type: 'tournament' },
        },
    };
}

export const GET_CLUB_MATCHES_REQUEST = 'GET_CLUB_MATCHES_REQUEST';
export const GET_CLUB_MATCHES_SUCCESS = 'GET_CLUB_MATCHES_SUCCESS';
export const GET_CLUB_MATCHES_FAILURE = 'GET_CLUB_MATCHES_FAILURE';

export function getClubMatches(params) {
    return {
        [CALL_API]: {
            actions: [ GET_CLUB_MATCHES_REQUEST, GET_CLUB_MATCHES_SUCCESS, GET_CLUB_MATCHES_FAILURE ],
            entity: 'matches',
            params: { ...params, type: 'team' },
        },
    };
}

export const GET_MATCH_REQUEST = 'GET_MATCH_REQUEST';
export const GET_MATCH_SUCCESS = 'GET_MATCH_SUCCESS';
export const GET_MATCH_FAILURE = 'GET_MATCH_FAILURE';

export function getMatch(id) {
    return {
        [CALL_API]: {
            actions: [ GET_MATCH_REQUEST, GET_MATCH_SUCCESS, GET_MATCH_FAILURE ],
            entity: 'match',
            params: { id },
        },
    };
}

export const GET_TOP_MATCHES_REQUEST = 'GET_TOP_MATCHES_REQUEST';
export const GET_TOP_MATCHES_SUCCESS = 'GET_TOP_MATCHES_SUCCESS';
export const GET_TOP_MATCHES_FAILURE = 'GET_TOP_MATCHES_FAILURE';

export function getTopMatches() {
    return {
        [CALL_API]: {
            actions: [ GET_TOP_MATCHES_REQUEST, GET_TOP_MATCHES_SUCCESS, GET_TOP_MATCHES_FAILURE ],
            entity: 'topMatches',
        },
    };
}
