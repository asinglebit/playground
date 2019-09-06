/**
 * Libraries
 */

import * as R from "ramda";

/**
 * Clip constructor
 *
 * _objects = [
 *     {
 *         reference: window,
 *         keyframes: [
 *             {
 *                 path: ['position', 'x'],
 *                 value: 0,
 *                 time: 0,
 *                 in: Easings.CUBIC,
 *                 out: Easings.CUBIC
 *             },{
 *                 path: ['position', 'x'],
 *                 value: 1,
 *                 time: 5,
 *                 in: Easings.CUBIC,
 *                 out: 'Easings.CUBIC
 *           }
 *         ]
 *     }
 * ]
 * _dynamic_keyframes = []
 *
 */

export function Clip() {
    this._objects = [];
    this._dynamic_keyframes = [];
}

/**
 * Set
 */

Clip.prototype.set = function(reference, ...keyframes) {

    /**
     * Get the object reference
     */

    let objekt = this._objects.find(objekt => objekt.reference === reference);
    if (!objekt) {
        objekt = {
            reference,
            keyframes: []
        };
        this._objects.push(objekt);
    }

    /**
     * Add keyframes to the object
     */

    objekt.keyframes.push(...keyframes);

    return this;
};

/**
 * Add
 */

Clip.prototype.add = function(...clips) {
    clips.map(clip => {
        const offset = this._objects.reduce((accumulator, objekt) => {
            return Math.max(accumulator, objekt.keyframes.reduce((_accumulator, _keyframe) => {
                return Math.max(_accumulator, _keyframe.time);
            }, 0));
        }, 0);
        const objects = clip.get();
        objects.map(objekt => {
            const {
                reference,
                keyframes
            } = objekt;
            const offset_keyframes = R.map(_keyframe => {
                return R.assoc('time', _keyframe.time + offset, _keyframe);
            }, keyframes);
            this.set(reference, ...offset_keyframes);
        });
    });

    return this;
};

/**
 * Merge
 */

Clip.prototype.merge = function(...clips) {
    clips.map(clip => {
        const objects = clip.get();
        objects.map(objekt => {
            const {
                reference,
                keyframes
            } = objekt;
            this.set(reference, ...keyframes);
        });
    });

    return this;
};

/**
 * Get the clip
 */

Clip.prototype.get = function() {
    return this._objects;
};
