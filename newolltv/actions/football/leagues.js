import { CALL_API } from '../../api';

export const GET_LEAGUES_REQUEST = 'GET_LEAGUES_REQUEST';
export const GET_LEAGUES_SUCCESS = 'GET_LEAGUES_SUCCESS';
export const GET_LEAGUES_FAILURE = 'GET_LEAGUES_FAILURE';

export default function getLeagues() {
    return {
        [CALL_API]: {
            actions: [ GET_LEAGUES_REQUEST, GET_LEAGUES_SUCCESS, GET_LEAGUES_FAILURE ],
            entity: 'leagues',
        },
    };
}
