import { GET_VIDEO_ITEMS_REQUEST, GET_VIDEO_ITEMS_SUCCESS, GET_VIDEO_ITEMS_FAILURE, UPDATE_VIDEO_ITEMS_REQUEST, UPDATE_VIDEO_ITEMS_SUCCESS, UPDATE_VIDEO_ITEMS_FAILURE  } from '../actions/videoItems';
import {
    GET_VIDEO_ITEM_SUCCESS,
    GET_VIDEO_ITEM_FAILURE,
    // GET_RECOMMENDATIONS_REQUEST,
    GET_RECOMMENDATIONS_SUCCESS,
} from '../actions/videoItem';
import { GET_CAROUSEL_SUCCESS } from '../actions/carousels';
import { VIDEO_POSITION_CHANGED } from '../actions/videoItem';
import { createName } from '../helpers/createName';
import { normalize, schema } from 'normalizr';
import { GET_VIEW_HISTORY_ITEMS_SUCCESS } from '../actions/viewHistory';
import { VH_TYPE_FOOTBALL } from '../containers/account/ViewHistory';

const initialState = {
    isLoading: false,
    error: null,
    lists: {},
    items: {},
    seasons: {},
    series: {},
};

export default function videoItems(state = initialState, action) {
    let normalizedEntities, entity;
    switch (action.type) {
        case GET_VIDEO_ITEMS_REQUEST:
        case UPDATE_VIDEO_ITEMS_REQUEST:
            return { ...state, isLoading: true, error: null };
        case GET_VIDEO_ITEMS_FAILURE:
        case GET_VIDEO_ITEM_FAILURE:
        case UPDATE_VIDEO_ITEMS_FAILURE:
            return { ...state, isLoading: false, error: action.error };
        case GET_VIDEO_ITEMS_SUCCESS:
        case GET_CAROUSEL_SUCCESS:
            return {
                ...state,
                isLoading: false,
                error: null,
                items: mergeItems(state.items, action.response.items, action.response.ids),
                lists: {
                    ...state.lists,
                    [createName(action.params.action, action.params.id, action.params.type, action.params.genre, action.params.order, action.params.collection)]: {
                        title: action.response.title.length ? action.response.title : action.params.title,
                        ids: [...action.response.ids],
                        page: action.params.page,
                        hasMore: action.response.hasMore,
                        totalFound: action.response.totalFound,
                        collectionUrl: action.response.collectionUrl,
                    },
                },
            };
        case UPDATE_VIDEO_ITEMS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                error: null,
                items: mergeItems(state.items, action.response.items, action.response.ids),
                lists: {
                    ...state.lists,
                    [createName(action.params.action, action.params.id, action.params.type, action.params.genre, action.params.order, action.params.collection)]: {
                        ids: [
                            ...state.lists[createName(action.params.action, action.params.id, action.params.type, action.params.genre, action.params.order, action.params.collection)].ids,
                            ...action.response.ids,
                        ],
                        page: action.params.page,
                        hasMore: action.response.hasMore,
                        totalFound: action.response.totalFound,
                        title: action.response.title,
                        collectionUrl: action.response.collectionUrl,
                    },
                },
            };
        case GET_VIDEO_ITEM_SUCCESS:
            normalizedEntities = getNormalizedEntities(action.response);
            return {
                ...state,
                error: null,
                items: {
                    ...state.items,
                    [action.response.id] : state.items[action.response.id] ? {
                        ...state.items[action.response.id],
                        ...normalizedEntities.item[action.response.id],
                    } : normalizedEntities.item[action.response.id],
                },
                seasons: !normalizedEntities.seasons ? { ...state.seasons } : { ...state.seasons, ...normalizedEntities.seasons },
                series: !normalizedEntities.series ? { ...state.series } : { ...state.series, ...normalizedEntities.series },
            };
        // case GET_RECOMMENDATIONS_REQUEST:
        //     return {
        //         ...state,
        //         items: {
        //             ...state.items,
        //             [action.params.id]: {
        //                 ...state.items[action.params.id],
        //             },
        //         },
        //     };
        case GET_RECOMMENDATIONS_SUCCESS:
            return {
                ...state,
                error: null,
                items: {
                    ...state.items,
                    ...action.response.items,
                    [action.params.id]: {
                        ...state.items[action.params.id],
                        recommendations: action.response.ids,
                    },
                },
            };
        case VIDEO_POSITION_CHANGED:
            entity = (action.id in state.items) ? 'items' : 'series';
            return {
                ...state,
                [entity]: {
                    ...state[entity],
                    [action.id]: {
                        ...state[entity][action.id],
                        seekTime: action.seekTime,
                        viewPercentage: action.percentage,
                    },
                },
            };
        case GET_VIEW_HISTORY_ITEMS_SUCCESS:
            return action.params.type === VH_TYPE_FOOTBALL ? { ...state } : {
                ...state,
                items: mergeItems(state.items, action.response.items, action.response.ids),
            };
        default:
            return state;
    }
}

export function mergeItems(stateItems, responseItems, responseItemsIds) {
    if (responseItemsIds && responseItemsIds.length) {
        const itemsForAddOrUpdate = {};
        responseItemsIds.forEach(id => {
            itemsForAddOrUpdate[id] = stateItems[id] ? { ...stateItems[id], ...responseItems[id] } : responseItems[id];
        });
        return { ...stateItems, ...itemsForAddOrUpdate };
    }
    return stateItems;
}

function getNormalizedEntities(itemData) {
    if (itemData.seriesInfo) {
        const episode = new schema.Entity('series');
        const season = new schema.Entity('seasons', {
            series: [episode],
        });
        const item = new schema.Entity('item', {
            seriesInfo: {
                seasons: [season],
                series: [episode],
            },
        });
        const normalizedData = normalize(itemData, item);
        return normalizedData.entities;
    }

    return { item: { [itemData.id]: itemData } };
}
