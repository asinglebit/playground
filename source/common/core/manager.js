import {
    Scene
} from 'common/core/scene';

/**
 * Scene manager constructor
 */

export function Manager(...elements) {
    this._scenes = [];
};

/**
 * Create new scene
 */

Manager.prototype.new = function(name, width, height) {

    /**
     * Check if a scene with the supplied name already exists
     */

    for (let i = 0; i < this._scenes.length; ++i) {
        if (this._scenes[i].name() === name) return null;
    }

    /**
     * Pass supplied arguments to the scene constructor
     */

    let scene = new Scene(name, width, height);
    this._scenes.push(scene);
    return scene;
};

/**
 * List available scenes
 */

Manager.prototype.scenes = function() {
    return this._scenes.slice();
};

/**
 * Render available scenes
 */

Manager.prototype.render = function() {
    for (let i = 0; i < this._scenes.length; ++i) {
        this._scenes[i].render();
    }
    return this;
};