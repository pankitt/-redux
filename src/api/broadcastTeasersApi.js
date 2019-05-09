import { getBroadcastTeasers } from '../actions/broadcastTeasers';

export function fetchBroadcastTeasers(body) {
    return fetch(`http://localhost:3005/broadcast-teasers`, {
        method: 'get',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({...body, language:"en"}),
    })
        .then(res => res.json())
        .then(data => getBroadcastTeasers(data))
}

// export const fetchBroadcastTeasers = () => (dispatch) =>
//     new Promise((resolve, reject) => {
//         fetch('http://localhost:3005/broadcast-teasers')
//             .then(response => response.json())
//             .then(data => {
//                 dispatch(getBroadcastTeasers(data));
//                 resolve();
//             })
//             .catch(reject);
//     });