import {createStore, applyMiddleware, compose} from 'redux'
import thunk from 'redux-thunk';
import api from './api';
import todoApp from './reducers';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
let initialState = {};
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['commands']
};
const persistedReducer = persistReducer(persistConfig, todoApp);
export default () => {
    let store = createStore(
        persistedReducer,
        initialState,
        composeEnhancers(applyMiddleware(thunk, api))
    );
    let persistor = persistStore(store);
    return { store, persistor };
}