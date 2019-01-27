import { APP_INITIALIZED } from '../actions';
const initialState = {
    initialized: false,
};

export default function app(state = initialState, action) {
    switch (action.type) {
        case APP_INITIALIZED:
            return {
                ...state,
                initialized: true,
            };
        default:
            return state;
    }
}
