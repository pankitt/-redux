/* global GET_CDN_TOKEN_URL */
import { CALL_API } from '../api';
import { auth } from './auth';
import fetch from 'isomorphic-fetch';

export const GET_MEDIA_REQUEST = 'GET_MEDIA_REQUEST';
export const GET_MEDIA_SUCCESS = 'GET_MEDIA_SUCCESS';
export const GET_MEDIA_FAILURE = 'GET_MEDIA_FAILURE';

export function getMedia(id) {
    return getMediaAPICall(id);
}

export function getDVRMedia(id) {
    return getMediaAPICall(id, 'DVRMedia');
}

function getMediaAPICall(id, entity = 'media') {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            if (getState().auth.user.hasLocalCDN) {
                dispatch({ type: GET_MEDIA_REQUEST, params: { id } });
                fetch(GET_CDN_TOKEN_URL, {
                    mode: 'cors',
                    // credentials: 'include',
                })
                    .then(
                        response => response.json(),
                    )
                    .then(
                        json => {
                            if (getState().media.id === id) {
                                return resolve(json.data.token);
                            }
                        }
                    )
                    .catch(reject);
            } else {
                return resolve();
            }
        }).then(
            cdnToken => {
                dispatch(
                    {
                        [CALL_API]: {
                            actions: [GET_MEDIA_REQUEST, GET_MEDIA_SUCCESS, GET_MEDIA_FAILURE],
                            entity,
                            params: { id, cdnToken },
                        },
                    })
                    .then(action => {
                        if (action.type === GET_MEDIA_SUCCESS) {
                            if (!action.response.isPurchased && !getState().auth.authRequest) {
                                dispatch(auth());
                            }
                        }
                        return Promise.resolve(action);
                    });
            },
            error => dispatch({ type: GET_MEDIA_FAILURE, params: { id }, error })
        );
    };
}

export const CLEAR_MEDIA = 'CLEAR_MEDIA';

export function clearMedia() {
    return { type: CLEAR_MEDIA };
}