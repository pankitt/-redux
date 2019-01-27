import fetch from 'isomorphic-fetch';
import videoItemsDataMap from './videoItemsDataMap';
import configDataMap from './configDataMap';
import bundlesDataMap from './bundlesDataMap';
import { searchSuggestDataMap, searchDataMap, searchChannelsDataMap, searchFootballDataMap, searchEPGDataMap, searchSeriesDataMap } from './searchDataMap';
import paymentDataMap from './paymentDataMap';
import promoCodeDataMap from './promoCodeDataMap';
import mainDataMap from './football/mainDataMap';
import { vodItemDataMap, mediaDataMap } from './vodItemDataMap';
import { channelsDataMap, radioDataMap, epgDataMap, channelNextThreeProgramDataMap } from './channelsDataMap';
import matchesDataMap, { matchDataMap } from './football/matchesDataMap';
import tournamentDataMap from './football/tournamentDataMap';
import clubsDataMap from './football/clubsDataMap';
import highlightsDataMap from './football/highlightsDataMap';
import leaguesDataMap from './football/leaguesDataMap';
import authDataMap from './authDataMap';
// import bankCardsDataMap from './bankCardsDataMap';
import bankingDataMap from './bankingDataMap';
import vhItemsDataMap from './view-history/vhItemsDataMap';
import forEach from 'lodash/forEach';
import { VH_TYPE_FOOTBALL } from '../containers/account/ViewHistory';
const API_ROOT = API_URL + 'api/';
const POST = 'POST';

export const CALL_API = Symbol('Call API');

/* eslint-disable complexity*/
export default store => next => action => {
    const callAPI = action[CALL_API];
    if (typeof callAPI === 'undefined') {
        return next(action);
    }

    const { entity, actions, params } = callAPI;

    let endpoint, schema, method, data;
    const settings = store.getState().settings;

    let getParams = {
        // 'mac':'010101010101',
        // 'serial_number': 'olltvbrowserdebug',
        // 'device_type':'stb',
        // 'ver': '2',
        lang: settings.locale,
    };

    switch (entity) {
        case 'config':
            endpoint = 'menu';
            schema = configDataMap;
            break;
        case 'posterItems':
            endpoint = 'posters';
            break;
        case 'videoItems':
            endpoint = 'vod/items';
            getParams.action = params.action;
            getParams.id = params.id;
            if (params.type) {
                getParams.type = params.type;
            }
            if (params.genre) {
                getParams.genre = params.genre;
            }
            if (params.order) {
                getParams.order = params.order;
            }
            if (params.page) {
                getParams.page = params.page;
            }
            if (params.collection) {
                getParams.collection = params.collection;
            }
            schema = videoItemsDataMap;
            break;
        case 'videoItem':
            endpoint = 'vod/item';
            getParams.id = params.id;
            schema = vodItemDataMap;
            break;
        case 'getBundles':
            endpoint = 'tariffs' + (params.type ? '/' + params.type : '');
            schema = bundlesDataMap;
            break;
        case 'searchSuggest':
            endpoint = 'search/suggest';
            getParams.query = params.query;
            schema = searchSuggestDataMap;
            break;
        case 'search':
            endpoint = 'search';
            getParams.query = params.query;
            schema = searchDataMap;
            break;
        case 'searchByCategory':
            endpoint = 'search';
            getParams.query = params.query;
            getParams.category = params.category;
            getParams.page = params.page;
            if (params.category === 'channels') {
                schema = searchChannelsDataMap;
            } else if (params.category === 'football') {
                schema = searchFootballDataMap;
            } else if (params.category === 'epg') {
                schema = searchEPGDataMap;
            } else if (params.category === 'series') {
                schema = searchSeriesDataMap;
            } else {
                schema = searchDataMap;
            }
            break;
        case 'payment':
            method = POST;
            endpoint = 'payment/' + params.ids;
            schema = paymentDataMap;
            break;
        case 'undoPromo':
            endpoint = 'promo/undo';
            break;
        case 'balance':
            method = POST;
            endpoint = 'payment/balance';
            data = new FormData();
            forEach(params.data, (value, key) => {
                if (Array.isArray(value)) {
                    const arrKey = key + '[]';
                    for (let i = 0; i < value.length; i++) {
                        data.append(arrKey, value[i]);
                    }
                } else {
                    data.append(key, value);
                }
            });
            break;
        case 'submitPromo':
            method = POST;
            endpoint = 'promo/submitCode';
            data = new FormData();
            data.append('code', params.code);
            data.append('subs', params.subs);
            schema = promoCodeDataMap;
            break;
        case 'recommendationsForItem':
            endpoint = 'vod/recommendationsForItem';
            getParams.id = params.id;
            schema = videoItemsDataMap;
            break;
        case 'channels':
            endpoint = 'tv/channels';
            schema = channelsDataMap;
            break;
        case 'radio':
            endpoint = 'radio/channels';
            schema = radioDataMap;
            break;
        case 'channelEpg':
            endpoint = 'tv/epg';
            schema = epgDataMap;
            getParams.id = params.id;
            if (params.date) {
                getParams.date = params.date;
            }
            break;
        case 'channelsNextThreeProgram':
            endpoint = 'tv/channels/epg-next-three';
            schema = channelNextThreeProgramDataMap;
            break;
        case 'media':
            endpoint = 'player/media';
            getParams.id = params.id;
            if (params.cdnToken) {
                getParams.cdnToken = params.cdnToken;
            }
            schema = mediaDataMap;
            break;
        case 'DVRMedia':
            endpoint = 'player/dvr';
            getParams.id = params.id;
            if (params.cdnToken) {
                getParams.cdnToken = params.cdnToken;
            }
            schema = mediaDataMap;
            break;
        case 'footballMain':
            endpoint = 'football/main';
            schema = mainDataMap;
            break;
        case 'topMatches':
            endpoint = 'football/carousel';
            schema = matchesDataMap;
            break;
        case 'leagues':
            endpoint = 'football/tournaments';
            schema = leaguesDataMap;
            break;
        case 'clubs':
            endpoint = 'football/clubs';
            schema = clubsDataMap;
            break;
        case 'nationalTeams':
            endpoint = 'football/nationalTeams';
            schema = clubsDataMap;
            break;
        case 'matches':
            endpoint = 'football/matches';
            schema = matchesDataMap;
            getParams = { ...getParams, ...params };
            break;
        case 'match':
            endpoint = 'football/match';
            schema = matchDataMap;
            getParams = { ...getParams, ...params };
            break;
        case 'highlights':
            endpoint = 'football/highlights';
            schema = highlightsDataMap;
            getParams.last_id = params.lastId;
            getParams.amount = params.amount;
            break;
        case 'tournamentTable':
            endpoint = 'football/tournamentTable';
            schema = tournamentDataMap;
            getParams = { ...getParams, ...params };
            break;
        case 'smsPass':
            endpoint = 'auth/otp';
            method = POST;
            data = new FormData();
            data.append('msisdn', params.login);
            break;
        case 'signup':
            endpoint = 'signup';
            method = POST;
            data = new FormData();
            data.append('phone', params.phone);
            data.append('email', params.email);
            break;
        case 'signupConfirm':
            endpoint = 'signup/confirm';
            method = POST;
            data = new FormData();
            data.append('phone', params.phone);
            data.append('code', params.code);
            break;
        case 'passwordRestore':
            endpoint = 'password/restore';
            method = POST;
            data = new FormData();
            data.append('login', params.login);
            break;
        case 'passwordConfirm':
            endpoint = 'password/confirm';
            method = POST;
            data = new FormData();
            data.append('login', params.login);
            data.append('password', params.password);
            break;
        case 'passwordChange':
            endpoint = 'password/change';
            method = POST;
            data = new FormData();
            data.append('token', params.token);
            data.append('password', params.password);
            break;
        case 'passwordCheckToken':
            endpoint = 'password/token/' + params.token + '/check';
            break;
        case 'login':
            endpoint = 'login';
            // schema = authDataMap;
            method = POST;
            data = new FormData();
            data.append('login', params.login);
            data.append('password', params.password);
            break;
        case 'auth':
            endpoint = 'auth';
            schema = authDataMap;
            break;
        case 'logout':
            endpoint = 'auth/logout';
            break;
        case 'subscribe':
            endpoint = 'subscribe';
            break;
        case 'staticPage':
            endpoint = 'staticPage';
            getParams.name = params.id;
            break;
        case 'feedbackTopics':
            endpoint = 'feedback/topics';
            break;
        case 'sendFeedback':
            endpoint = 'feedback';
            method = POST;
            data = new FormData();
            forEach(params, (value, key) => {
                data.append(key, value);
            });
            break;
        case 'orderCallback':
            endpoint = 'callback/order';
            method = POST;
            data = new FormData();
            data.append('phone', params.phone);
            break;
        case 'pay':
            endpoint = 'payment/bankcard';
            schema = bankingDataMap;
            method = POST;
            data = new FormData();
            forEach(params.data, (value, key) => {
                if (Array.isArray(value)) {
                    const arrKey = key + '[]';
                    for (let i = 0; i < value.length; i++) {
                        data.append(arrKey, value[i]);
                    }
                } else {
                    data.append(key, value);
                }
            });
            break;
        case 'boundCard':
            endpoint = 'payment/boundcard';
            method = POST;
            data = params.data;
            data = new FormData();
            forEach(params.data, (value, key) => {
                data.append(key, value);
            });
            break;
        case 'removeFromContinueView':
            endpoint = 'vod/removeFromContinueView';
            getParams = { ...params };
            break;
        case 'viewHistoryAmounts':
            endpoint = 'user/historyAmounts';
            break;
        case 'viewHistoryItems':
            endpoint = 'user/history';
            getParams = { ...params };
            schema = params.type === VH_TYPE_FOOTBALL ? highlightsDataMap : vhItemsDataMap;
            break;
        case 'clearViewHistoryItems':
            endpoint = 'user/historyRemove';
            getParams = { ...params };
            break;
        default:
            throw new Error('Unknown entity.');
    }

    if (!Array.isArray(actions) || actions.length !== 3) {
        throw new Error('Expected an array of three action types.');
    }

    function actionWith(data) {
        const finalAction = { ...action, ...data, params };
        delete finalAction[CALL_API];
        return finalAction;
    }

    const [ requestType, successType, failureType ] = actions;
    try {
        next(actionWith({ type: requestType }));
    } catch (e) {
        console.log(e);
    }

    return callApi(endpoint, schema, params, getParams, method, data).then(
        response => next(actionWith({
            response,
            type: successType,
        })),
        error => next(actionWith({
            type: failureType,
            error: {
                code: error.status,
                message: error.message || error.statusText || 'Something bad happened',
            },
            response: error,
        }))
    );
};

function callApi(endpoint, schema, params, getParams, method = 'GET', data) {
    let queryUrl = API_ROOT + endpoint,
        fetchAttributes = {
            mode: 'cors',
            credentials: 'include',
        };
    if (getParams) {
        queryUrl += '?' + Object.keys(getParams).map(param => encodeURI(param) + '=' + encodeURI(getParams[param])).join('&');
    }
    if (method === POST) {
        fetchAttributes = {
            ...fetchAttributes,
            // headers: {
            //     'Content-Type': 'application/json',
            // },
            method,
            body: data,
        };
    }
    // console.log(queryUrl);
    return fetch(queryUrl, fetchAttributes)
        .then(
            response => new Promise((resolve, reject) => response.json().then(json => resolve({ json, response }), error => reject(error))),
            error => {
                console.log(error);
                return Promise.reject({ status: error.status || 500, message: 'Request error' });
            }
        ).then(({ json, response }) => {
            // console.log(fullUrl);
            if (!response.ok || json.status === 'failure') {
                // console.log('Something wrong with response: status ' + json.status);
                return Promise.reject(json);
            }
            // console.log(Date.now() + ' fetch End');
            return Promise.resolve(typeof schema === 'function' ? schema(json, params) : json.data);
        });
}
