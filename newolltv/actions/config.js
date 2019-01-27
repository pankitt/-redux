import { CALL_API } from '../api';

export const GET_CONFIG_REQUEST = 'GET_CONFIG_REQUEST';
export const GET_CONFIG_SUCCESS = 'GET_CONFIG_SUCCESS';
export const GET_CONFIG_FAILURE = 'GET_CONFIG_FAILURE';

export default function getConfig() {
    return {
        [CALL_API]: {
            actions: [ GET_CONFIG_REQUEST, GET_CONFIG_SUCCESS, GET_CONFIG_FAILURE ],
            entity: 'config',
        },
    };
}
