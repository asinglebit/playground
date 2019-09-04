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
    initialize
} from 'common/scene';

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

    handleCanvasRef = canvasRef => {
        initialize(canvasRef)
    }

    /**
     * Markup
     */

    render() {
        return (
            <div 
                className="app-root"
            >
                <canvas
                    ref={this.handleCanvasRef}
                />
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
