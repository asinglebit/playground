/**
 * Easings
 */

import * as EasingCurves from 'common/utils/easings';

/**
 * Enumerations
 */

import {
    Easings
} from 'common/enumerations';

/**
 * Timeline constructor
 *
 * _layers = [
 *     {
 *         weight: 0.2,
 *         objects: [
 *             {
 *                 reference: window,
 *                 tracks: {
 *                     'position-x': [0,,,,,1],
 *                     'position-y': [0,,,,,1]
 *                 }
 *             }
 *         ]
 *     }
 * ]
 */

export function Timeline() {
    this._time_difference = new Date().getTime();
    this._time = 0;
    this._layers = [];
    this._time_blurred = (document.visibilityState === 'visible')
        && new Date().getTime()
        || 0;

    /**
     * On visibility change event
     */

    this.onVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
            const time_blurred_difference =
                this._time_blurred &&
                new Date().getTime() - this._time_blurred ||
                0;
            this._time_difference += time_blurred_difference;
            this._time_blurred = 0;
        } else {
            this._time_blurred = new Date().getTime();
        }
    };

    /**
     * Bind events
     */

    document.addEventListener('visibilitychange', this.onVisibilityChange);
}

/**
 * Destructor
 */

Timeline.prototype.destroy = function () {

    /**
     * Release references
     */

    this.reset();
    this.empty();

    /**
     * Unbind events
     */

    window.removeEventListener('visibilitychange', this.onVisibilityChange);
};

/**
 * Reset the time difference
 */

Timeline.prototype.reset = function () {
    this._time_difference = new Date().getTime();
    this._time = 0;
};

/**
 * Set a clip
 */

Timeline.prototype.clip = function (clip) {
    const objects = clip.get();

    this._layers.map(layer => {
        layer.deletion_time =
            layer.deletion_time === 0 &&
            this._time + layer.transition ||
            layer.deletion_time;
    });

    const layer = {
        weight: 0,
        objects: [],
        effects_track: [],
        start: 0,
        end: 0,
        duration: 0,
        in_curve: Easings.QUADRATIC,
        out_curve: Easings.QUADRATIC,
        transition: 500,
        deletion_time: 0
    };

    objects.map(objekt => {
        const reference = objekt.reference;
        const tracks = [];
        objekt.keyframes.map(keyframe => {
            const path = keyframe.path.join('-');
            const track = tracks[path] = tracks[path] || [];
            const time = this._time + keyframe.time;
            track[time] = keyframe;
            if (keyframe.effects) {
                layer.effects_track[time] = layer.effects_track[time] || [];
                layer.effects_track[time].push(keyframe.effects);
            }
        });
        layer.start = this._time;
        layer.end = this._time + Object.values(tracks).reduce((accumulator, track) => {
            track[0] = track[0] || {
                value: 0,
                in_curve: Easings.LINEAR,
                out_curve: Easings.LINEAR
            };
            return accumulator > track.length && accumulator || track.length;
        }, 0);
        layer.duration = layer.end - layer.start;
        layer.objects.push({
            reference,
            tracks
        });
    });

    this._layers.push(layer);
    this.update();
    return this;
};

/**
 * Seek to the given time or to current if not supplied
 */

Timeline.prototype.seek = function (time) {
    this._time = time || Math.max(0, new Date().getTime() - this._time_difference);
    const weighted_objects = [];
    let total_weight = 0;

    /**
     * Calculate weighted values of the objects
     */

    this._layers.map(layer => {

        /**
         * Carry out side effects
         */

        for (let key in layer.effects_track) {
            if (layer.effects_track.hasOwnProperty(key)) {
                if (this._time >= key) {
                    layer.effects_track[parseInt(key)].map(effect => effect());
                    delete layer.effects_track[parseInt(key)];
                } else {
                    continue;
                }
            }
        }

        /**
         * Calculate contribution to the weighted value
         */

        total_weight += layer.weight;
        layer.objects.map(objekt => {
            Object.entries(objekt.tracks).forEach(([name, track]) => {
                const path = name.split('-');

                const reference = path.reduce((accumulator, property, index, self) => {
                    return (index + 1) === self.length &&
                        accumulator ||
                        accumulator[property];
                }, objekt.reference);
                const last_property = path[path.length - 1];

                /**
                 * Get surrounding timestamps
                 */

                let previous_timestamp;
                let next_timestamp;
                for (let key in track) {
                    if (track.hasOwnProperty(key)) {
                        if (this._time >= key) {
                            next_timestamp = parseInt(key);
                            previous_timestamp = next_timestamp;
                        } else {
                            next_timestamp = parseInt(key);
                            break;
                        }
                    }
                }


                /**
                 * Get the object reference
                 */

                let weighted_objekt = weighted_objects.find(objekt => objekt.reference === reference);
                let weighted_objekt_property;
                if (!weighted_objekt) {
                    weighted_objekt_property = {
                        last_property: last_property,
                        value: 0
                    };
                    weighted_objekt = {
                        reference,
                        properties: [weighted_objekt_property]
                    };
                    weighted_objects.push(weighted_objekt);
                } else {
                    weighted_objekt_property = weighted_objekt.properties.find(property => property.last_property === last_property);
                    if (!weighted_objekt_property) {
                        weighted_objekt_property = {
                            last_property: last_property,
                            value: 0
                        };
                        weighted_objekt.properties.push(weighted_objekt_property);
                    }
                }

                /**
                 * Calculate the eased value
                 */

                if (previous_timestamp !== next_timestamp) {

                    /**
                     * Get surrounding keyframes
                     */

                    const previous_keyframe = track[previous_timestamp];
                    const next_keyframe = track[next_timestamp];
                    weighted_objekt_property.value += EasingCurves[
                        `in_${Easings[previous_keyframe.out_curve].toLowerCase()}_out_${Easings[next_keyframe.in_curve].toLowerCase()}`
                    ](
                        this._time - previous_timestamp,
                        previous_keyframe.value,
                        next_keyframe.value - previous_keyframe.value,
                        next_timestamp - previous_timestamp
                    ) * layer.weight;
                } else {
                    const next_keyframe = track[next_timestamp];
                    weighted_objekt_property.value += next_keyframe.value * layer.weight;
                }
            });
        });

        /**
         * Remove inactive layers
         */

        this._layers = this._layers.filter(layer => (
            layer.deletion_time === 0 ||
            layer.weight !== 0
        ));

        /**
         * Ease the layer weights
         */

        if (layer.deletion_time === 0) {
            if (
                this._time > layer.start &&
                this._time < layer.start + layer.transition &&
                this._layers.length > 1
            ) {
                layer.weight = EasingCurves[
                    `in_${Easings[layer.in_curve].toLowerCase()}_out_${Easings[layer.out_curve].toLowerCase()}`
                ](
                    this._time - layer.start,
                    0,
                    1,
                    layer.transition
                );
            } else {
                layer.weight = 1;
            }
        } else if (
            this._time > layer.deletion_time - layer.transition &&
            this._time < layer.deletion_time
        ) {
            layer.weight = 1 - EasingCurves[
                `in_${Easings[layer.in_curve].toLowerCase()}_out_${Easings[layer.out_curve].toLowerCase()}`
            ](
                this._time - layer.deletion_time + layer.transition,
                0,
                1,
                layer.transition
            );
        } else {
            layer.weight = 0;
        }
    });

    /**
     * Apply weighted values
     */

    weighted_objects.map(weighted_objekt => {
        weighted_objekt.properties.map(property => {
            weighted_objekt.reference[property.last_property] = !property.value ? 0 : property.value / total_weight;
            debugger;
        });
    });

    return this;
};

/**
 * Empty the timeline
 */

Timeline.prototype.empty = function () {
    this._layers = [];
    return this;
};

/**
 * Update dynamic keyframes
 */

Timeline.prototype.update = function () {
    this._layers.map(layer => {
        layer.objects.map(objekt => {
            Object.entries(objekt.tracks).forEach(([name, track]) => {
                for (let timestamp in track) {
                    if (track.hasOwnProperty(timestamp)) {
                        const keyframe = track[timestamp];
                        if (keyframe.updater) {
                            keyframe.value = keyframe.updater();
                        }
                    }
                }
            });
        });
    });

    return this;
};