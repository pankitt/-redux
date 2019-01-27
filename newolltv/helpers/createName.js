// import map from 'lodash/map';
import forEach from 'lodash/forEach';

export function createName(action, id, type, genre, order, collection) {
    let result = [];
    if (action) {
        result.push(action + '=' + id);
    }
    if (type) {
        result.push('type=' + type);
    }
    if (genre) {
        result.push('genre=' + genre);
    }
    if (order) {
        result.push('order=' + order);
    }
    if (collection) {
        result.push('collection=' + collection);
    }
    return result.join('_');
}

export function parseQuery(str) {
    let result = {};
    forEach(str.slice(1).split('&'), item => {
        result[item.split('=')[0]] = item.split('=')[1];
    });
    return result;
}
