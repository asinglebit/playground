/**
 * Libraries
 */

import React, {
    Component
} from 'react';
import {
    bindActionCreators
} from 'redux';
import {
    connect
} from 'react-redux';
import {
    init
} from 'common/scenes/sample.scene';

/**
 * Actions
 */

import * as Actions from 'spa/actions';

/**
 * Styles
 */

import './app.container.scss';

/**
 * App container definition
 */

export class App extends Component {

    /**
     * Constructor
     */

    constructor(props: AppPropsType) {
        super(props);
    }

    /**
     * Hooks
     */

    handleRootReference = (container) => {
        init(container)
    }

    /**
     * Markup
     */

    render() {
        return (
            <div 
                className="app-root"
                ref={this.handleRootReference}
            >
            </div>
        );
    }
}

/**
 * Store bindings
 */

export default connect(
    (state) => {
        return {};
    },
    (dispatch) => {
        return {
            actions: bindActionCreators(Actions, dispatch)
        };
    }
)(App);
