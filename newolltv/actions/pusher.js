export const PUSHER_UPDATE_MATCH = 'PUSHER_UPDATE_MATCH';

export function pushUpdateMatch(match, highlight) {
    return { type: PUSHER_UPDATE_MATCH, match, highlight };
}