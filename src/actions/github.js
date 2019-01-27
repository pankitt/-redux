import { CALL_API } from '../api';

export const GITHUB_LOADED = 'GITHUB_LOADED';
export const GITHUB_LOADED_SUCCESS = 'GITHUB_LOADED_SUCCESS';
export const GITHUB_LOADED_FAILURE = 'GITHUB_LOADED_FAILURE';

/*export const loadAll = () => (dispatch) =>
    new Promise((resolve, reject) => {
        fetch('https://api.github.com/repos/Yomguithereal/baobab/issues')
            .then(response => response.json())
            .then(data => {
                dispatch(addGithub(data));
                resolve();
            })
            .catch(reject);
    });*/

/*export const addGithub = data => {
    return {
        type: GITHUB_LOADED,
        data
    }
};*/


export function loadGithub(params) {
    return {
        [CALL_API]: {
            actions: [ GITHUB_LOADED, GITHUB_LOADED_SUCCESS, GITHUB_LOADED_FAILURE ],
            entity: 'github',
            params,
        },
    };
}