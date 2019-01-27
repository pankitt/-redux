import { CALL_API } from '../../api';

export const GET_NATIONAL_TEAMS_REQUEST = 'GET_NATIONAL_TEAMS_REQUEST';
export const GET_NATIONAL_TEAMS_SUCCESS = 'GET_NATIONAL_TEAMS_SUCCESS';
export const GET_NATIONAL_TEAMS_FAILURE = 'GET_NATIONAL_TEAMS_FAILURE';

export default function getNationslTeams() {
    return {
        [CALL_API]: {
            actions: [ GET_NATIONAL_TEAMS_REQUEST, GET_NATIONAL_TEAMS_SUCCESS, GET_NATIONAL_TEAMS_FAILURE ],
            entity: 'nationalTeams',
        },
    };
}
