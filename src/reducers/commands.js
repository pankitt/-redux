import {LOADED_COMMAND} from '../actions/commands';

const initialState = {
    commands: null,
};

export default function commands(state = initialState, action) {
    switch (action.type) {
        case LOADED_COMMAND:
            return {
                ...state,
                commands: action.data
            };
        default:
            return state;
    }
}