import { ADD_USER_SUCCESS, ADD_USER_FAILURE } from '../actions/addUser';

const initialState = {
    name: '',
    username: '',
    phone: '',
    website: '',
};

export default function addUser(state = initialState, action) {
    switch (action.type) {
        case ADD_USER_SUCCESS:
            return { ...state,
                name: action.params.name,
                username: action.params.username,
                phone: action.params.phone,
                website: action.params.website
            };
        case ADD_USER_FAILURE:
            return { ...state, error: action.error };
        default:
            return state;
    }
}