import fetch from 'isomorphic-fetch';
const pattern = /(\d+)\n(\d{2}):(\d{2}):(\d{2}),(\d{3}) --> (\d{2}):(\d{2}):(\d{2}),(\d{3})\n([\W\w]+)/;

export const GET_SUBTITLES_SUCCESS = 'GET_SUBTITLES_SUCCESS';

export function loadSubtitle(lang, url) {
    return dispatch => {
        fetch(url)
            .then(
                response => response.text()
            )
            .then(
                text => {
                    const subtitle = parse(text);
                    dispatch({ type: GET_SUBTITLES_SUCCESS, lang, subtitle });
                }
            )
            .catch(
                e => console.error('get subtitles error', lang, url, e)
            );
    };
}

function parse(data) {
    let result = [],
        items = data.replace(/\r\n/g, '\n').split('\n\n');

    items.forEach((item) => {
        let p = item.match(pattern);
        if (p) {
            let start = new Date(null),
                end = new Date(null);
            start.setUTCHours(p[2]);
            start.setUTCMinutes(p[3]);
            start.setUTCSeconds(p[4]);
            start.setUTCMilliseconds(p[5]);

            end.setUTCHours(p[6]);
            end.setUTCMinutes(p[7]);
            end.setUTCSeconds(p[8]);
            end.setUTCMilliseconds(p[9]);

            result.push({
                sn: p[1],
                start: start.getTime() / 1000,
                end: end.getTime() / 1000,
                duration: (end.getTime() - start.getTime()) / 1000,
                text: p[10],
            });
        }
    });

    return result;
}