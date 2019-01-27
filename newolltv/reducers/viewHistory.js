import {
    GET_VIEW_HISTORY_AMOUNTS_FAILURE,
    GET_VIEW_HISTORY_AMOUNTS_REQUEST,
    GET_VIEW_HISTORY_AMOUNTS_SUCCESS,
    GET_VIEW_HISTORY_ITEMS_FAILURE,
    GET_VIEW_HISTORY_ITEMS_REQUEST,
    GET_VIEW_HISTORY_ITEMS_SUCCESS,
    CLEAR_VIEW_HISTORY_ITEMS_FAILURE,
    CLEAR_VIEW_HISTORY_ITEMS_REQUEST,
    CLEAR_VIEW_HISTORY_ITEMS_SUCCESS,
} from '../actions/viewHistory';
import moment from 'moment';

/**
 * @type {{initialized: boolean, isLoading: boolean, amounts: {}, data: {}}}
 *
 * amounts: {movies: {total: 30, recent: 5, old: 25}, series: {...}, football: {...}}
 * data: {movies: {page: 2, ids: {recent: [1,2,3,4,5], old: [6,7,8,...]}}, series: {...}, football: {...}}
 */
const initialState = {
    initialized: false,
    isLoading: false,
    amounts: {},
    data: {},
};

function addIds(state, action) {
    const now = moment();
    let newIds = {
        recent: [],
        old: [],
    };
    action.response.ids.forEach(id => {
        let item = action.response.items[id],
            section = now.diff(moment(item.viewDate), 'month') === 0 ? 'recent' : 'old';
        newIds[section].push(id);
    });
    let result;
    if (!(action.params.type in state.data)) {
        result = newIds;
    } else {
        result = {
            recent: state.data[action.params.type].ids.recent.concat(newIds.recent),
            old: state.data[action.params.type].ids.old.concat(newIds.old),
        };
    }
    return result;
}

function getZeroAmounts(state) {
    let zeroAmounts = {};
    Object.keys(state.amounts).forEach(type => {
        zeroAmounts[type] = {};
        Object.keys(state.amounts[type]).forEach(section => {
            zeroAmounts[type][section] = 0;
        });
    });
    return zeroAmounts;
}

function clearViewHistorySuccess(state, action) {
    let data, amounts;

    if ('itemId' in action.params) {
        data = { ...state.data };
        amounts = { ...state.amounts };
        let ind;
        Object.keys(state.data).forEach(type => {
            Object.keys(state.data[type].ids).forEach(section => {
                ind = state.data[type].ids[section].indexOf(action.params.itemId);
                if (ind !== -1) {
                    data[type].ids[section].splice(ind, 1);
                    amounts[type][section]--;
                    amounts[type].total--;
                }
            });
        });
    } else {
        amounts = getZeroAmounts(state);
        data = {};
    }

    return {
        ...state,
        isLoading: false,
        amounts,
        data,
    };
}

export default function viewHistory(state = initialState, action) {
    switch (action.type) {
        case GET_VIEW_HISTORY_AMOUNTS_REQUEST:
            return {
                ...state,
                initialized: false,
                isLoading: true,
            };
        case GET_VIEW_HISTORY_AMOUNTS_SUCCESS:
            return {
                ...state,
                initialized: true,
                isLoading: false,
                amounts: action.response,
            };
        case GET_VIEW_HISTORY_AMOUNTS_FAILURE:
            return {
                ...state,
                initialized: false,
                isLoading: false,
            };
        case GET_VIEW_HISTORY_ITEMS_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case GET_VIEW_HISTORY_ITEMS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                data: {
                    ...state.data,
                    [action.params.type]: {
                        ...state.data[action.params.type],
                        page: parseInt(action.params.page, 10),
                        ids: addIds(state, action),
                    },
                },
            };
        case GET_VIEW_HISTORY_ITEMS_FAILURE:
            return {
                ...state,
                isLoading: false,
            };
        case CLEAR_VIEW_HISTORY_ITEMS_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case CLEAR_VIEW_HISTORY_ITEMS_SUCCESS:
            return clearViewHistorySuccess(state, action);
        case CLEAR_VIEW_HISTORY_ITEMS_FAILURE:
            return {
                ...state,
                isLoading: false,
            };
        default:
            return state;
    }
}