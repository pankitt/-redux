export const INCREMENT_COUNTER = 'INCREMENT_COUNTER';
export function plusCounter ()  {
    return { type: INCREMENT_COUNTER };
}

export const DECREMENT_COUNTER = 'DECREMENT_COUNTER';
export function minusCounter ()  {
    return { type: DECREMENT_COUNTER };
}

export const RESET_COUNTER = 'RESET_COUNTER';
export function clearCounter ()  {
    return { type: RESET_COUNTER };
}