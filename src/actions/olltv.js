import getConfig  from './config';

export const APP_INITIALIZED = 'APP_INITIALIZED';
export const APP_INITIALIZATION_ERROR = 'APP_INITIALIZATION_ERROR';

export function initializeApp() {
    return (dispatch, getState) => {
        return dispatch(getConfig())
            .then(() => Promise.resolve())
            .then(() => dispatch({type: APP_INITIALIZED}),
                error => dispatch({type: APP_INITIALIZATION_ERROR, error})
            );
    }
}

