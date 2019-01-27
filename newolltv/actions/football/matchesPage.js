export const SET_MATCHES_TIME_FILTER = 'SET_MATCHES_TIME_FILTER';
export const MATCHES_IN_FUTURE = 'MATCHES_IN_FUTURE';
export const MATCHES_IN_PAST = 'MATCHES_IN_PAST';

export function changeMatchesTimeFilter(filter) {
    return (dispatch) => {
        dispatch(setMatchesTimeFilter(filter));
    };
}

function setMatchesTimeFilter(filter) {
    return { type: SET_MATCHES_TIME_FILTER, filter };
}
