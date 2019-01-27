import { CALL_API } from '../../api';

export const GET_MAIN_REQUEST = 'GET_MAIN_REQUEST';
export const GET_MAIN_SUCCESS = 'GET_MAIN_SUCCESS';
export const GET_MAIN_FAILURE = 'GET_MAIN_FAILURE';

export default function getMain() {
    return {
        [CALL_API]: {
            actions: [ GET_MAIN_REQUEST, GET_MAIN_SUCCESS, GET_MAIN_FAILURE ],
            entity: 'footballMain',
        },
    };
}
