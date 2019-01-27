import { CALL_API } from '../../api';

export const GET_CLUBS_REQUEST = 'GET_CLUBS_REQUEST';
export const GET_CLUBS_SUCCESS = 'GET_CLUBS_SUCCESS';
export const GET_CLUBS_FAILURE = 'GET_CLUBS_FAILURE';

export default function getClubs() {
    return {
        [CALL_API]: {
            actions: [ GET_CLUBS_REQUEST, GET_CLUBS_SUCCESS, GET_CLUBS_FAILURE ],
            entity: 'clubs',
        },
    };
}
