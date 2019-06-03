export const LOADED_COMMAND = 'LOADED_COMMAND';

export function setCommand (data)  {
    return {
        type: LOADED_COMMAND,
        data
    }
}