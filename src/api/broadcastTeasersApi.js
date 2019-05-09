export function fetchBroadcastTeasers(body) {
    return fetch('http://localhost:3005/broadcast', {
        method: 'get',
        body: JSON.stringify(body),
    })
        .then(res => res.json())
}