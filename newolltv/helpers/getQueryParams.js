export default function getQueryParams() {
    let query = {};
    window.location.href.replace(window.location.hash, '').replace(/[?&]+([^=&]+)=?([^&]*)?/gi, (m, key, value) => query[key] = value !== undefined ? value : '');
    return query;
}
