import { GET_CHANNEL_EPG_REQUEST, GET_CHANNEL_EPG_FAILURE, GET_CHANNEL_EPG_SUCCESS, GET_ALL_CHANNELS_SUCCESS } from '../actions/channels';
const initialState = {
    channelId: 0,
    currentChannel: {
        epg: {},
    },
    epgIsLoading : false,
};

export default function channelsPage(state = initialState, action) {
    switch (action.type) {
        case GET_CHANNEL_EPG_REQUEST:
            return { ...state, epgIsLoading: true };
        case GET_CHANNEL_EPG_FAILURE:
            return { ...state, epgIsLoading: false };
        case GET_ALL_CHANNELS_SUCCESS:
            return {
                ...state,
                currentChannel: { ...action.response.channels[state.channelId], epg: state.currentChannel.epg },
            };
        case GET_CHANNEL_EPG_SUCCESS:
            return {
                ...state,
                currentChannel: { ...state.currentChannel, epg: action.response.items },
                epgIsLoading: false,
            };
        default:
            return state;
    }
}
