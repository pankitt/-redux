export function fetchBroadcastTeasers(body) {
    return fetch(`http://localhost:3005/broadcast-teasers`, {
        method: 'get',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    })
        .then(res => res.json())
}