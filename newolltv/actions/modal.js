export const SET_MODAL_ORIGIN = 'SET_MODAL_ORIGIN';

export function setModalOrigin(origin, transform) {
    return { type: SET_MODAL_ORIGIN, origin, transform };
}
