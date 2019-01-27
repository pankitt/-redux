import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
// import createHistory from 'history/createBrowserHistory';
// import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import * as reducers from './reducers';
import { connect as initI18n, getLocaleFromPathOrRedirect } from './i18n';
import { initPusherStore } from './sockets';
import App from './containers/App';
import { initializeApp } from './actions';
import api from './api';
import { restoreVolumeSettings, restoreLastViewedChannel } from './actions/settings';
// import moment from 'moment';

// Create a history of your choosing (we're using a browser history in this case)
// const history = createHistory();

// Build the middleware for intercepting and dispatching navigation actions
// const middleware = routerMiddleware(history);

const render = Component => {
    ReactDOM.render(
        <Provider store={store}>
            <BrowserRouter basename={lang ? '/' + lang : '/'}>
                <Component/>
            </BrowserRouter>
        </Provider>,
        document.getElementById('root')
    );
};

const composeEnhancers = process.env.NODE_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

let initialState = {};

const store = createStore(
    combineReducers({
        ...reducers,
        // router: routerReducer,
    })
    ,
    initialState,
    composeEnhancers(applyMiddleware(
        // middleware,
        thunk,
        api
    ))
);

store.dispatch(restoreVolumeSettings());
store.dispatch(restoreLastViewedChannel());

const lang = getLocaleFromPathOrRedirect(store.getState().settings.locale);

if (lang) {
    initI18n(store, lang);
    initPusherStore(store);
    render(App);
    store.dispatch(initializeApp());
}

// moment.locale(store.getState().settings.locale);

if (module.hot) {
    module.hot.accept('./containers/App', () => render(App));
}
