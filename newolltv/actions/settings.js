import getMain from './main';
import { auth } from './auth';

export const LOCALE_CHANGE = 'LOCALE_CHANGE';
export const LOCALE_CHANGED = 'LOCALE_CHANGED';

export function setLocale(locale) {
    return { type: LOCALE_CHANGE, locale };
}

export function localeChanged() {
    return { type: LOCALE_CHANGED };
}

export function changeLocale(locale) {
    return (dispatch) => {
        dispatch(setLocale(locale));
        dispatch(auth());
        dispatch(getMain()).then(() => {
            return Promise.resolve();
        });
    };
}

export const ollPlayerVolumeSettings = 'ollPlayerVolumeSettings';
export const UPDATE_VOLUME_SETTINGS = 'UPDATE_VOLUME_SETTINGS';

export function saveVolumeSettings(volume, muted) {
    console.log('saveVolumeSettings', volume, muted);
    const volumeSettings = { volume, muted };
    try {
        localStorage.setItem(ollPlayerVolumeSettings, JSON.stringify(volumeSettings));
    } catch (e) {
        console.error('Can\'t save volume settings');
    }
    return { type: UPDATE_VOLUME_SETTINGS, volumeSettings };
}

export function restoreVolumeSettings() {
    return (dispatch) => {
        let volumeSettings;
        try {
            volumeSettings = localStorage.getItem(ollPlayerVolumeSettings);
            if (volumeSettings) {
                volumeSettings = JSON.parse(volumeSettings);
            }
        } catch (e) {
            console.error('Can\'t get volume settings');
        }

        if (!volumeSettings) {
            return dispatch(saveVolumeSettings(0.5, false));
        }
        dispatch({ type: UPDATE_VOLUME_SETTINGS, volumeSettings });
    };
}

const ollLastViewedChannel = 'ollLastViewedChannel';
export const SAVE_LAST_VIEWED_CHANNEL = 'SAVE_LAST_VIEWED_CHANNEL';

export function saveLastViewedChannel(id) {
    try {
        localStorage.setItem(ollLastViewedChannel, JSON.stringify({ id }));
    } catch (e) {
        console.error('Can\'t save volume settings');
    }
    return { type: SAVE_LAST_VIEWED_CHANNEL, id };
}

export function restoreLastViewedChannel() {
    return (dispatch) => {
        let lastViewedChannel;
        try {
            lastViewedChannel = localStorage.getItem(ollLastViewedChannel);
            if (lastViewedChannel) {
                lastViewedChannel = JSON.parse(lastViewedChannel);
            }
        } catch (e) {
            console.error('Can\'t get volume settings');
        }
        if (lastViewedChannel && lastViewedChannel.id) {
            dispatch({ type: SAVE_LAST_VIEWED_CHANNEL, id: lastViewedChannel.id });
        }
    };
}