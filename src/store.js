import {createStore, applyMiddleware, compose} from 'redux'
import thunk from 'redux-thunk';
import api from './api';
import todoApp from './reducers'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
let initialState = {};
export default createStore(
    todoApp,
    initialState,
    composeEnhancers(applyMiddleware(thunk, api))
);
