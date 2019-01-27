import moment from 'moment';
import t from '../i18n';

export function getLongFormattedDate(date, format) {
    return moment(date, format).calendar(null, {
        sameDay: t('Today') + ', D MMMM, dd',
        lastDay: t('Yesterday') + ', D MMMM, dd',
        nextDay: t('Tomorrow') + ', D MMMM, dd',
        sameElse(now) {
            return this.isSame(now, 'year') ? 'D MMMM, dd' : 'D MMMM YYYY';
        },
        nextWeek: 'D MMMM, dd',
        lastWeek: 'D MMMM, dd',
    });
}
export function getSortFormattedDate(date, format) {
    return moment(date, format).calendar(null, {
        sameDay: 'D MMM, dd',
        lastDay: 'D MMM, dd',
        nextDay: 'D MMM, dd',
        sameElse(now) {
            return this.isSame(now, 'year') ? 'D MMM, dd' : 'D MMM YYYY';
        },
        nextWeek: 'D MMM, dd',
        lastWeek: 'D MMM, dd',
    });
}