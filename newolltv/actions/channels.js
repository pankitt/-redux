import { CALL_API } from '../api';
import forEach from 'lodash/forEach';
import moment from 'moment';

export const GET_ALL_CHANNELS_REQUEST = 'GET_ALL_CHANNELS_REQUEST';
export const GET_ALL_CHANNELS_SUCCESS = 'GET_ALL_CHANNELS_SUCCESS';
export const GET_ALL_CHANNELS_FAILURE = 'GET_ALL_CHANNELS_FAILURE';

export const GET_CHANNEL_EPG_REQUEST = 'GET_CHANNEL_EPG_REQUEST';
export const GET_CHANNEL_EPG_SUCCESS = 'GET_CHANNEL_EPG_SUCCESS';
export const GET_CHANNEL_EPG_FAILURE = 'GET_CHANNEL_EPG_FAILURE';

export function getAllChannels() {
    return (dispatch, getState) => {
        dispatch(getChannelsCallAPI())
            .then(
                action => {
                    if (action.type === GET_ALL_CHANNELS_SUCCESS) {
                        return updateCurrentEpg(dispatch, getState);
                    }
                }
            );
    };
}

function getChannelsCallAPI() {
    return {
        [CALL_API]: {
            actions: [ GET_ALL_CHANNELS_REQUEST, GET_ALL_CHANNELS_SUCCESS, GET_ALL_CHANNELS_FAILURE ],
            entity: 'channels',
        },
    };
}

export function getChannelEpg(id, date) {
    return getChannelEpgCallAPI(id, date || moment().startOf('day').format('YYYY-MM-DD'));
    // if (date) {
    //     return getChannelEpgCallAPI(id, date);
    // }
    // return (dispatch, getState) => {
    //     dispatch(getChannelEpgCallAPI(id, date))
    //         .then(
    //             action => {
    //                 if (action === GET_CHANNEL_EPG_SUCCESS) {
    //                     return updateCurrentEpg(dispatch, getState);
    //                 }
    //             }
    //         );
    // };
}

export function getChannelEpgCallAPI(id, date = '') {
    return {
        [CALL_API]: {
            actions: [ GET_CHANNEL_EPG_REQUEST, GET_CHANNEL_EPG_SUCCESS, GET_CHANNEL_EPG_FAILURE ],
            entity: 'channelEpg',
            params: { id, date },
        },
    };
}


export const GET_CHANNELS_NEXT_THREE_PROGRAM_REQUEST = 'GET_CHANNELS_NEXT_THREE_PROGRAM_REQUEST';
export const GET_CHANNELS_NEXT_THREE_PROGRAM_SUCCESS = 'GET_CHANNELS_NEXT_THREE_PROGRAM_SUCCESS';
export const GET_CHANNELS_NEXT_THREE_PROGRAM_FAILURE = 'GET_CHANNELS_NEXT_THREE_PROGRAM_FAILURE';

function getChannelsNextThreeProgram() {
    return {
        [CALL_API]: {
            actions: [ GET_CHANNELS_NEXT_THREE_PROGRAM_REQUEST, GET_CHANNELS_NEXT_THREE_PROGRAM_SUCCESS, GET_CHANNELS_NEXT_THREE_PROGRAM_FAILURE ],
            entity: 'channelsNextThreeProgram',
        },
    };
}

let updateCurrentEpgTimeout;

function updateCurrentEpg(dispatch, getState) {
    if (updateCurrentEpgTimeout) {
        clearTimeout(updateCurrentEpgTimeout);
    }
    let nextUpdate = 0;
    const now = Date.now();
    let l, next;
    let currentProgramId;
    let updated = 0;
    forEach(getState().channels.items, channel => {
        // if (!channel.epg) {
        //     return;
        // }
        // const channelEpg = Object.keys(channel.epg);
        // l = channelEpg.length;
        if (!channel.nextThree) {
            return;
        }
        currentProgramId = 0;
        // let nextId;
        l = channel.nextThree.length;
        while (l) {
            // nextId = +channelEpg[--l];
            // next = channel.epg[nextId];
            next = channel.nextThree[--l];
            if (next.start <= now && now < next.stop) {
                currentProgramId = next.id;
                if (currentProgramId !== channel.currentProgramId) {
                    dispatch(switchChannelCurrentProgram(channel.id, currentProgramId, channel.currentProgramId));
                    updated++;
                }
                if (!nextUpdate || next.stop < nextUpdate) {
                    nextUpdate = next.stop;
                }
                break;
            }
        }
        if (!currentProgramId && channel.currentProgramId) {
            dispatch(switchChannelCurrentProgram(channel.id, 0, channel.currentProgramId));
        }
    });
    console.log('Updated: ' + updated + ' Next update: ' + (nextUpdate - now));
    if (nextUpdate) {
        dispatch(getChannelsNextThreeProgram());
        updateCurrentEpgTimeout = setTimeout(updateCurrentEpg, nextUpdate - now, dispatch, getState);
    }
}

export const SWITCH_CHANNEL_CURRENT_PROGRAM = 'SWITCH_CHANNEL_CURRENT_PROGRAM';

function switchChannelCurrentProgram(channelId, currentProgramId, previousProgramId) {
    return {
        type: SWITCH_CHANNEL_CURRENT_PROGRAM,
        channelId,
        currentProgramId,
        previousProgramId,
    };
}
