/**
 * Libraries
 */

import React from 'react';
import ReactDOM from 'react-dom';

/**
 * Store
 */

import {
    Provider
} from 'react-redux';
import {
    store
} from 'spa/store';

/**
 * Containers
 */

import {
    App
} from 'spa/containers';

/**
 * Entry point
 */

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
