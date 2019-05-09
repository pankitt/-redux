import { combineReducers } from 'redux';
import counter from './counter';
import issues from './issues';
import github from './github';
import users from './users';
import app from './app';
import addUser from './addUser';
import workers from './workers';
import bets from './bets';
import broadcastTeasers from './broadcastTeasers';

export default combineReducers({
    counter,
    issues,
    github,
    users,
    app,
    addUser,
    workers,
    bets,
    broadcastTeasers,
});