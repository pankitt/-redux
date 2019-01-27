import { LOCALE_CHANGE, UPDATE_VOLUME_SETTINGS } from '../actions/settings';
const initialState = {
    locale: 'uk',
    sockets: SOCKETS,
};

export default function settings(state = initialState, action) {
    switch (action.type) {
        case LOCALE_CHANGE:
            return { ...state, locale: action.locale };
        case UPDATE_VOLUME_SETTINGS:
            return { ...state, volumeSettings: action.volumeSettings };
        default:
            return state;
    }
}