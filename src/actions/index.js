//import {getUsers} from "./users";

export const APP_INITIALIZED = 'APP_INITIALIZED';
export const APP_INITIALIZATION_ERROR = 'APP_INITIALIZATION_ERROR';


export function initializeApp() {
    return (dispatch) =>  dispatch({ type: APP_INITIALIZED },
                error => dispatch({ type: APP_INITIALIZATION_ERROR, error })
            );
}