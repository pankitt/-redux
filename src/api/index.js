import fetch from 'isomorphic-fetch';
import usersDataMap from "./usersDataMap";
import githubDataMap from "./githubDataMap";

const POST = 'POST';
const API_ROOT = 'https://jsonplaceholder.typicode.com/';

export const CALL_API = Symbol('Call API');

/* eslint-disable complexity*/
export default store => next => action => {

    const callAPI = action[CALL_API];
    if (typeof callAPI === 'undefined') {
        return next(action);
    }

    const { entity, actions, params } = callAPI;

    let endpoint, schema, method, data;
    let getParams = {};

    switch (entity) {
        case 'getUsers':
            endpoint = 'users';
            schema = usersDataMap;
            break;
        case 'github':
            endpoint = 'https://api.github.com/repos/Yomguithereal/baobab/issues';
            schema = githubDataMap;
            break;
        case 'postUser':
            endpoint = 'addUser';
            method = POST;
            data = new FormData();
            data.append('phone', params.name);
            data.append('email', params.username);
            data.append('email', params.phone);
            data.append('email', params.website);
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
            /*mode: 'cors',
            credentials: 'include',*/
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
    const otherUrl = endpoint.match( /github/ig );
    if (otherUrl) {
        queryUrl = endpoint;
    }
    // console.log('queryUrl - ', queryUrl);
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
