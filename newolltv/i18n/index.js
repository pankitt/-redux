import { setLocale, localeChanged } from '../actions/settings';
import moment from 'moment';
import reduce from 'lodash/reduce';
// @TODO async import chunk
import 'moment/locale/ru';
import 'moment/locale/uk';

let store;
let locale;
let i18n;

const uk = 'uk';
const ru = 'ru';
// const en = 'en';

moment.updateLocale(uk, {
    // monthsShort: ['січ', 'лют', 'бер', 'квіт', 'трав', 'черв', 'лип', 'серп', 'вер', 'жовт', 'лист', 'груд'], // uk locale has it
    weekdaysMin: ['НД', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ' ],
    relativeTime:{
        d: '1 день',
    },
});

moment.updateLocale(ru, {
    monthsShort: ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'],
    relativeTime:{
        d: '1 день',
    },
    weekdaysMin: ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ' ],
});

export const languages = {
    [uk]: {
        code: uk,
        name: 'Українська',
        shortName: 'Укр',
    },
    [ru]: {
        code: ru,
        name: 'Русский',
        shortName: 'Рус',
    },
    // [en]: {
    //     code: en,
    //     name: 'English',
    //     shortName: '',
    // },
};

export function connect(storeInstance, pathLocale) {
    store = storeInstance;
    locale = pathLocale; // localStorage.getItem('ollUserLocale');
    if (!languages[locale]) {
        locale = store.getState().settings.locale;
        localStorage.setItem('ollUserLocale', locale);
    } else {
        store.dispatch(setLocale(locale));
    }
    init();
    store.dispatch(localeChanged());
    store.subscribe(() => {
        if (locale !== store.getState().settings.locale) {
            locale = store.getState().settings.locale;
            localStorage.setItem('ollUserLocale', locale);
            init();
            store.dispatch(localeChanged());
        }
    });
}

const reLocaleWithoutTrailing = new RegExp('^/(' + Object.keys(languages).join('|') + ')$');
const reLocaleFullPath = new RegExp('^/(' + Object.keys(languages).join('|') + ')/');

export function getLocaleFromPathOrRedirect(defaultLocale) {
    let pathLocale, pathLocaleMatch, storedLocale;
    try {
        storedLocale = localStorage.getItem('ollUserLocale');
        if (!languages[storedLocale]) {
            storedLocale = null;
            localStorage.setItem('ollUserLocale', defaultLocale);
        }
    } catch (e) {
        console.error(e);
    }
    if (window.location.pathname === '/') {
        window.location.replace(window.location.origin + '/' + (storedLocale || defaultLocale) + '/');
        return;
    }
    if (window.location.pathname.length < 4) { // '/uk' for instance
        pathLocaleMatch = window.location.pathname.match(reLocaleWithoutTrailing);
        if (pathLocaleMatch) {
            pathLocale = pathLocaleMatch[1];
            // default language by root
            // if (pathLocale.toLowerCase() === defaultLocale) {
            //     window.location.replace(window.location.origin);
            //     return;
            // }
            if (pathLocale.toLowerCase() !== pathLocale) {
                window.location.replace(window.location.origin + '/' + pathLocale.toLowerCase());
                return;
            }
            return pathLocale;
        }
        window.location.replace(window.location.href + '/');
        return;
    }

    pathLocaleMatch = window.location.pathname.match(reLocaleFullPath);
    if (pathLocaleMatch) {
        return pathLocaleMatch[1];
    }
    window.location.replace(window.location.origin + '/' + (storedLocale || defaultLocale) + window.location.pathname);
}

function init() {
    moment.locale(locale);
    switch (locale) {
        case uk:
            i18n = require('./uk').default;
            break;
        case ru:
            i18n = require('./ru').default;
            break;
        default:
            i18n = {};
            break;
    }
}


export default function t(s, args) {
    return reduce(args, (result, value, key) => {
        return result.replace('{' + key + '}', value);
    }, i18n[s] || s);
}
