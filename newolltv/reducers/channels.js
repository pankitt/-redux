import forEach from 'lodash/forEach';
import {
    GET_ALL_CHANNELS_REQUEST,
    GET_ALL_CHANNELS_FAILURE,
    GET_ALL_CHANNELS_SUCCESS,
    GET_CHANNEL_EPG_REQUEST,
    GET_CHANNEL_EPG_FAILURE,
    GET_CHANNEL_EPG_SUCCESS,
    SWITCH_CHANNEL_CURRENT_PROGRAM,
    GET_CHANNELS_NEXT_THREE_PROGRAM_SUCCESS,
} from '../actions/channels';
import { SAVE_LAST_VIEWED_CHANNEL } from '../actions/settings';

const initialState = {
    genres: {},
    items: {},
    ids: [],
    availableChannelsIds: [],
    notAvailableChannelsIda: [],
    isLoading: false,
    lastViewedChannelId: null,
};

export default function channels(state = initialState, action) {
    switch (action.type) {
        case GET_ALL_CHANNELS_REQUEST:
            return { ...state, isLoading: true };
        case GET_ALL_CHANNELS_FAILURE:
            return { ...state, isLoading: false };
        case GET_ALL_CHANNELS_SUCCESS:
            return {
                ...state,
                items: action.response.channels,
                ids: action.response.ids,
                ...filterPurchasedChannels(action.response.channels, action.response.ids),
                genres: action.response.genres,
                genresIds: action.response.genresIds,
                isLoading: false,
            };
        case GET_CHANNEL_EPG_REQUEST:
            return {
                ...state,
                items: {
                    ...state.items,
                    [action.params.id]: {
                        ...state.items[action.params.id],
                        epgIsLoading: true,
                    },
                },
            };
        case GET_CHANNEL_EPG_SUCCESS:
            return {
                ...state,
                items: {
                    ...state.items,
                    [action.params.id]: {
                        ...state.items[action.params.id],
                        epg: { ...state.items[action.params.id].epg, ...action.response.items },
                        epgByDate: { ...state.items[action.params.id].epgByDate, [action.params.date]: action.response.ids },
                        epgIsLoading: false,
                    },
                },
            };
        case GET_CHANNEL_EPG_FAILURE:
            return {
                ...state,
                items: {
                    ...state.items,
                    [action.params.id]: {
                        ...state.items[action.params.id],
                        epgIsLoading: false,
                    },
                },
            };
        case SWITCH_CHANNEL_CURRENT_PROGRAM:
            return { ...state, items: { ...state.items, [action.channelId]: { ...state.items[action.channelId], currentProgramId: action.currentProgramId } } };
        case SAVE_LAST_VIEWED_CHANNEL:
            return { ...state, lastViewedChannelId: action.id };
        case GET_CHANNELS_NEXT_THREE_PROGRAM_SUCCESS:
            return updateChannelNextThreeProgram(state, action.response.channelsNextTreeProgram);

        default:
            return state;
    }
}

function filterPurchasedChannels(channels, ids) {
    const purchasedChannelsIds = [], notPurchasedChannelsIds = [];
    let id;
    for (let i in ids) {
        id = ids[i];
        if (channels[id].isPurchased) {
            purchasedChannelsIds.push(id);
        } else {
            notPurchasedChannelsIds.push(id);
        }
    }

    return { purchasedChannelsIds, notPurchasedChannelsIds };
}

function updateChannelNextThreeProgram(state, channelsNextTreeProgram) {
    const items = { ...state.items };
    forEach(channelsNextTreeProgram, data => {
        const channel = items[data.id];
        if (channel) {
            items[data.id] = { ...channel, nextTree: data.nextThree };
        }
    });
    return { ...state, items };
}
