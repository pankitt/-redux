import { CALL_API } from '../api';

export const GET_ALL_RADIO_REQUEST = 'GET_ALL_RADIO_REQUEST';
export const GET_ALL_RADIO_SUCCESS = 'GET_ALL_RADIO_SUCCESS';
export const GET_ALL_RADIO_FAILURE = 'GET_ALL_RADIO_FAILURE';

export function getAllChannels() {
    return {
        [CALL_API]: {
            actions: [ GET_ALL_RADIO_REQUEST, GET_ALL_RADIO_SUCCESS, GET_ALL_RADIO_FAILURE ],
            entity: 'radio',
        },
    };
}

