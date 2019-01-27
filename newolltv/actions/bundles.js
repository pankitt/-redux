import { CALL_API } from '../api/index';

export const GET_BUNDLES_REQUEST = 'GET_BUNDLES_REQUEST';
export const GET_BUNDLES_SUCCESS = 'GET_BUNDLES_SUCCESS';
export const GET_BUNDLES_FAILURE = 'GET_BUNDLES_FAILURE';

export default function getBundles(type = '') {
    return {
        [CALL_API]: {
            actions: [ GET_BUNDLES_REQUEST, GET_BUNDLES_SUCCESS, GET_BUNDLES_FAILURE ],
            entity: 'getBundles',
            params: { type },
        },
    };
}
