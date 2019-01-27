import { combineReducers } from 'redux';
import counter from './counter';
import issues from './issues';
import github from './github';
import users from './users';
import app from './app';

export default combineReducers({
    counter,
    issues,
    github,
    users,
    app,
});