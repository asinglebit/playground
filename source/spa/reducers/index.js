/**
 * Libraries
 */

import {
    combineReducers
} from 'redux';
import {
    connectRouter
} from 'connected-react-router';

/**
 * Exports
 */

export default history => combineReducers({
    router: connectRouter(history)
});
