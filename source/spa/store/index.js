/**
 * Libraries
 */

import {
    applyMiddleware,
    createStore,
    compose
} from 'redux';
import {
    createLogger
} from 'redux-logger';
import {
    createBrowserHistory
} from 'history';
import {
    routerMiddleware
} from 'connected-react-router';

/**
 * Reducers
 */

import rootReducer from 'spa/reducers';

/**
 * History
 */

export const history = createBrowserHistory();

/**
 * Middleware
 */

const middlewares = [];

/**
 * Development mode
 */

if (process.env.NODE_ENV === 'development') {
    const logger = createLogger();
    middlewares.push(logger);
}

/**
 * All modes
 */

middlewares.push(routerMiddleware(history));

/**
 * Exports
 */

export const store = createStore(
    rootReducer(history),
    compose(
        applyMiddleware(...middlewares)
    )
);
