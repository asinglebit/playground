import {
    Scene
} from 'common/core/scene';

/**
 * Compositor constructor
 */

export function Compositor(_scene) {
    this._scene = _scene;
    this._passes = [];
};

/**
 * Create new scene
 */

Compositor.prototype.pass = function(name) {

};