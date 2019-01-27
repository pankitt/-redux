export const UPDATE_LIST_PAGE = 'UPDATE_LIST_PAGE';

export function updateListPage(ids) {
    return {
        type: UPDATE_LIST_PAGE, ids,
    };
}
