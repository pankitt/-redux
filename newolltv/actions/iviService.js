import fetch from 'isomorphic-fetch';
import * as Blowfish from '../iviService/Blowfish';
import { CALL_API } from '../api';


const URL__APP_VERSION = 'https://api.ivi.ru/mobileapi/geocheck/whoami/v6/';
const URL__TIMESTAMP = 'https://api.ivi.ru/light/';
const URL__CONTENT = 'https://api.ivi.ru/light/';
const URL__WATCHED = 'https://api.ivi.ru/light/';
const URL__LOGGER__TIME = 'https://logger.ivi.ru/logger/content/time/';

export function getIviMedia(id) {
    let uid, key, k1, k2, appVersion, session, iviId;
    return (dispatch, getState) => {
        dispatch(getMedia(id)).then(
            action => {
                if (action.type === GET_IVI_MEDIA_SUCCESS && action.response.iviData) {
                    iviId = action.response.iviId;
                    uid = action.response.iviData.uid;
                    key = action.response.iviData.key;
                    k1 = action.response.iviData.k1;
                    k2 = action.response.iviData.k2;
                    appVersion = action.response.iviData.appVersion;
                    session = action.response.iviData.session;
                    console.time('initializeBlowfish');
                    Blowfish.initializeBlowfish(key, k1, k2);
                    console.timeEnd('initializeBlowfish');
                    return geoCheckWhoAmI(appVersion);
                }
                return Promise.reject();
            })
            .then(
                realAppVersion => {
                    if (getState().media.item.iviId === iviId) {
                        appVersion = realAppVersion;
                        dispatch(iviGeoCheckWhoAmISuccess(appVersion));
                        return getTimestamp(dispatch, getState);
                    }
                    return Promise.reject();
                },
                error => {
                    if (getState().media.item.iviId === iviId) {
                        dispatch(iviGeoCheckWhoAmIError(error));
                    }
                    return Promise.reject();
                }
            )
            .then(timestamp => dispatch(getContentData(iviId, timestamp, uid, session, appVersion)))
            .catch(error => console.log(error));
    };
}


export const GET_IVI_MEDIA_REQUEST = 'GET_IVI_MEDIA_REQUEST';
export const GET_IVI_MEDIA_SUCCESS = 'GET_IVI_MEDIA_SUCCESS';
export const GET_IVI_MEDIA_FAILURE = 'GET_IVI_MEDIA_FAILURE';

function getMedia(id) {
    return {
        [CALL_API]: {
            actions: [ GET_IVI_MEDIA_REQUEST, GET_IVI_MEDIA_SUCCESS, GET_IVI_MEDIA_FAILURE ],
            entity: 'media',
            params: { id },
        },
    };
}


function geoCheckWhoAmI(appVersion) {
    return fetch(URL__APP_VERSION + '?app_version=' + appVersion)
        .then(data => data.json())
        .then(
            responseJson => {
                if (responseJson.error) {
                    return Promise.reject(responseJson.message);
                }
                return Promise.resolve(responseJson.result.actual_app_version);
            },
            () => Promise.reject('Parse response error')
        );
}

export const IVI_GEO_CHECK_WHO_AM_I_REQUEST = 'IVI_GEO_CHECK_WHO_AM_I_REQUEST';
export const IVI_GEO_CHECK_WHO_AM_I_SUCCESS = 'IVI_GEO_CHECK_WHO_AM_I_SUCCESS';
export const IVI_GEO_CHECK_WHO_AM_I_FAILURE = 'IVI_GEO_CHECK_WHO_AM_I_FAILURE';


function iviGeoCheckWhoAmIError(error) {
    return { type: IVI_GEO_CHECK_WHO_AM_I_FAILURE, error };
}

function iviGeoCheckWhoAmISuccess(appVersion) {
    return { type: IVI_GEO_CHECK_WHO_AM_I_SUCCESS, appVersion };
}

function getContentData(iviMediaId, timestamp, uid, session, appVersion) {
    return dispatch => {
        dispatch({ type: GET_IVI_MEDIA_URL_REQUEST });
        let postParams = JSON.stringify({
            method: 'da.content.get',
            params: [
                iviMediaId,
                { uid, session, app_version: appVersion },
            ],
        });

        return fetch(URL__CONTENT + '?' + getSign(timestamp, postParams, appVersion), { method: 'post', body: postParams })
            .then(response => response.json())
            .then(
                data => {
                    if (data.error || !data.result || !data.result.files || !data.result.files.length) {
                        dispatch({ type: GET_IVI_MEDIA_URL_FAILURE });
                        return;
                    }
                    let mediaUrl = data.result.files[0].url.replace('http:', '');
                    let watchId = data.result.watchid;
                    dispatch({ type: GET_IVI_MEDIA_URL_SUCCESS, mediaUrl, watchId });
                },
                () => dispatch({ type: GET_IVI_MEDIA_URL_FAILURE })
            );
    };
}

export const GET_IVI_MEDIA_URL_REQUEST = 'GET_IVI_MEDIA_URL_REQUEST';
export const GET_IVI_MEDIA_URL_SUCCESS = 'GET_IVI_MEDIA_URL_SUCCESS';
export const GET_IVI_MEDIA_URL_FAILURE = 'GET_IVI_MEDIA_URL_FAILURE';

export function sendContentTime(position, mediaLength) {
    return function (dispatch, getState) {
        let seconds = 0,
            params, toSend;

        const iviData = getState().media.item.iviData;
        const iviId = getState().media.item.iviId;
        const watchId = getState().media.item.watchId;

        if (position > 0) {
            if (seconds === 0) {
                seconds = position;
            } else {
                seconds = ++seconds;
            }
        }

        toSend = (seconds > 0 && seconds <= 5) ||
            (seconds > 5 && seconds <= 15 && seconds % 3 === 0) ||
            (seconds > 15 && seconds <= 60 && seconds % 5 === 0) ||
            (mediaLength - position <= 60 && seconds % 5 === 0) ||
            (seconds > 60 && seconds % 60 === 0);

        if (toSend) {
            params = [
                'contentid=' + iviId,
                'watchid=' + watchId,
                'fromstart=' + position,
                'seconds=' + seconds,
                'app_version=' + iviData.appVersion,
                'session=' + iviData.session,
                'uid=' + iviData.uid,
                'iviuid=' + iviData.iviuid,
                'history_type=watch',
            ].join('&');

            fetch(URL__LOGGER__TIME, { method: 'post', data: params });
        }
    };
}

export function sendContentWatched() {
    return (dispatch, getState) => {
        const media = getState().media;
        if (media.iviTimeTimestampLoading) {
            return;
        }
        getTimestamp(dispatch, getState)
            .then(
                timestamp => {
                    const iviData = getState().media.item.iviData;
                    let postParams = JSON.stringify({
                        method: 'da.content.watched',
                        params: [
                            this.get('iviMediaId'),
                            {
                                uid: iviData.uid,
                                session: iviData.session,
                                app_version: iviData.appVersion,
                                watchid: iviData.watchId,
                            },
                        ],
                    });
                    fetch(URL__WATCHED + '?' + getSign(timestamp, postParams, iviData.appVersion), { method: 'post', body: postParams });
                },
                error => {
                    console.error(error);
                }
            );
    };
}

function clearExpiredTimestamsTimeout(dispatch, getState, timestamp) {
    if (getState().media.item.iviData && getState().media.item.iviData.timestamp && timestamp === getState().media.item.iviData.timestamp) {
        dispatch({ type: CLEAR_IVI_TIME_STAMP, timestamp: null });
    }
}

function getTimestamp(dispatch, getState) {
    let timestamp = getState().media.item.iviData.timestamp;

    if (timestamp) {
        return Promise.resolve(timestamp);
    }
    // if (expiredTimestamsTimeout) {
    //     clearTimeout(expiredTimestamsTimeout);
    // }
    let params = {
        method: 'da.timestamp.get',
        params: [],
    };
    dispatch({ type: GET_IVI_TIME_STAMP_REQUEST });
    const iviId = getState().media.item.iviId;
    return fetch(URL__TIMESTAMP, { method: 'post', body: JSON.stringify(params) })
        .then(
            response => response.json(),
            error => Promise.reject(error)
        )
        .then(
            data => {
                if (data.error || !data.result) {
                    return Promise.reject('ivi_get_timestamp_error');
                }
                if (iviId === getState().media.item.iviId) {
                    dispatch({ type: GET_IVI_TIME_STAMP_SUCCESS, timestamp: data.result });
                    setTimeout(clearExpiredTimestamsTimeout, 600000, dispatch, getState, timestamp);
                    return Promise.resolve(data.result);
                }
            },
            () => {
                if (iviId === getState().media.item.iviId) {
                    dispatch({ type: GET_IVI_TIME_STAMP_FAILURE });
                }
                return Promise.reject('ivi_get_timestamp_error');
            }
        );
}

export const GET_IVI_TIME_STAMP_REQUEST = 'IVI_TIME_STAMP_REQUEST';
export const GET_IVI_TIME_STAMP_SUCCESS = 'GET_IVI_TIME_STAMP_SUCCESS';
export const GET_IVI_TIME_STAMP_FAILURE = 'GET_IVI_TIME_STAMP_FAILURE';
export const CLEAR_IVI_TIME_STAMP = 'CLEAR_IVI_TIME_STAMP';

function getSign(timestamp, postParams, appVersion) {
    let getParams,
        sign = Blowfish.cmacbf(timestamp + postParams);
    getParams = [
        'app_version=' + appVersion,
        'ts=' + timestamp,
        'sign=' + sign,
    ].join('&');

    return getParams;
}