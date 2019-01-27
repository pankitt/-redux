import fetch from 'isomorphic-fetch';

export function videoStatViewing(config, position) {
    sendStat(config.host, config.uniqid, 'viewing', position);
}

export function videoStatViewed(config, position) {
    sendStat(config.host, config.uniqid, 'viewed', position);
}

export function videoStatPaused(config, position) {
    sendStat(config.host, config.uniqid, 'paused', position);
}

function sendStat(host, uniqid, action, position) {
    fetch(`https://${host}/${action}/?uniqid=${uniqid}&position=${position}`)
        .catch(error => console.error(error));
}