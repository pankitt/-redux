import io from 'socket.io-client';
import { pushUpdateMatch } from './actions/pusher';
import shuffle from 'lodash/shuffle';
import without from 'lodash/without';
import { matchSubstitutionsDataMap, matchCardDataMap, matchGoalDataMap } from './api/football/matchesDataMap';

let socket;
let dispatch;
let getState;
let pusherData;
let host;

export function initPusherStore(store) {
    dispatch = store.dispatch;
    getState = store.getState;
    store.subscribe(() => {
        const auth = store.getState().auth;
        if (auth.user.pusherData && pusherData !== auth.user.pusherData) {
            pusherData = auth.user.pusherData;
            init();
        }
    });
}

function init() {
    console.log('init new socket connection to pusher');
    if (socket) {
        socket.close();
    }
    socket = io.connect(getRandHost(), {
        transports: ['websocket'],
    });

    socket.on('connect', () => {
        console.log('socket connected');
        let lang = getState().settings.locale;
        if (lang === 'uk') {
            lang = 'ua';
        }
        socket.emit('auth', { ...getState().auth.user.pusherData, lang });
        socket.on('authSuccess', subscribe);
    });
    socket.on('connect_timeout', () => {
        console.log('socket connection timeout');
    });
    socket.on('connect_error', () => {
        console.log('socket connection error');
    });
    socket.on('error', () => {
        console.log('socket error');
    });
    socket.on('disconnect', (reason) => {
        console.log('socket disconnect: ' + reason);
    });
    socket.on('reconnect', () => {
        console.log('socket reconnect');
    });
    socket.on('reconnect_attempt', () => {
        socket.io.opts.transports = ['polling', 'websocket'];
        socket.io.uri = 'https://' + getRandHost();
        console.log('socket reconnect attempt');
    });
    socket.on('reconnecting', () => {
        console.log('socket reconnecting');
    });
    socket.on('reconnect_error', () => {
        console.log('socket reconnect error');
        init();
    });
    socket.on('reconnect_failed', () => {
        console.log('socket reconnect failed');
    });
}

function getRandHost() {
    let sockets = [ ...getState().settings.sockets ];
    if (host && sockets.length > 1) {
        sockets = without(sockets, host);
    }
    host = shuffle(sockets)[0];
    return host;
}

function subscribe() {
    if (!socket) {
        return;
    }
    socket.emit('subscribeTo', 'update');
    socket.on('update', data => {
        if (data && data.type) {
            switch (data.type) {
                case 'unbind_device':
                    console.log('unbind_device message received');
                    break;
                case 'list':
                    console.log('list message received');
                    break;
                case 'tvchannels':
                    console.log('tvchannels message received');
                    break;
                case 'purchase_update':
                    console.log('purchase_update message received');
                    break;
                case 'info_popup':
                    console.log('info_popup message received');
                    break;
                case 'subs_state_update':
                    break;
                case 'timeshift':
                    console.log('timeshift received' + data.timeshift);
                    break;
                default:
                    console.log('Unknown update type');
                    break;
            }
        }
    });

    socket.emit('subscribeTo', 'football');
    socket.on('football', data => {
        let match = getState().football.matches[data.match_id], highlight, highlightId;
        if (!match) {
            return;
        }
        let lang = getState().settings.locale;
        if (lang === 'uk') {
            lang = 'ua';
        }
        switch (data.type) {
            case 'status':
                match = {
                    ...match,
                    statusId: data.status_id,
                    homeTeamScored: '' + data.home_team_scored,
                    awayTeamScored: '' + data.away_team_scored,
                };
                if (data.started_at) {
                    match.startedAt = (new Date(data.started_at.replace(/-/g, '/'))).getTime();
                }
                break;
            case 'live_status':
                match = {
                    ...match,
                    liveStatus: data.live_status,
                };
                break;
            case 'goal':
                match = {
                    ...match,
                    homeTeamScored: '' + data.home_team_scored,
                    awayTeamScored: '' + data.away_team_scored,
                };
                break;
            case 'penalties_finished':
                // Окончание серии послематчевых пенальти
                match = {
                    ...match,
                    homeTeamPenaltiesScored: '' + data.home_team_penalties_scored,
                    awayTeamPenaltiesScored: '' + data.away_team_penalties_scored,
                };
                break;
            case 'highlight':
                highlightId = parseInt(data.id, 10);
                if (match.highlights.indexOf(highlightId) !== -1) {
                    break;
                }
                match = {
                    ...match,
                    highlights: [ highlightId, ...match.highlights ],
                };
                highlight = {
                    id: highlightId,
                    title: data['title_' + lang],
                    marker: data.marker,
                    cover: data.cover,
                    duration: data.duration,
                };

                if (+data.is_main_highlight) {
                    match.highlightId = highlightId;
                }
                break;
            case 'goal_data':
                match = {
                    ...match,
                    matchEvents: {
                        ...match.matchEvents,
                        goals: [...(match.matchEvents.goals ? match.matchEvents.goals : []), matchGoalDataMap(data)],
                    },
                };
                break;
            case 'card':
                match = {
                    ...match,
                    matchEvents: {
                        ...match.matchEvents,
                        cards: [...(match.matchEvents.cards ? match.matchEvents.cards : []), matchCardDataMap(data)],
                    },
                };
                break;
            case 'substitutions':
                match = {
                    ...match,
                    substitutions: matchSubstitutionsDataMap(data.substitutions),
                };
                break;
        }
        if (match !== getState().football.matches[data.match_id]) {
            dispatch(pushUpdateMatch(match, highlight));
        }
    });
}
