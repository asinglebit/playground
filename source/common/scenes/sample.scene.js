/**
 * Constructors
 */

import {
    Manager
} from 'common/core/manager';
import {
    Clip
} from 'common/core/clip';
import {
    Keyframe
} from 'common/core/keyframe';

/**
 * Enumerations
 */

import {
    Easings
} from 'common/enumerations';

/**
 * Scene
 */

export const init = container => {
    
    const scene = new Manager()
        .new(container, 'scene');

    const rect = new scene.factory.Rect()
        .width(1.0)
        .height(4.0);

    scene
        .root()
        .append(rect)
        .scene()
        .timeline()
        .clip(
            new Clip().set(
                rect,
                Keyframe('position_y')(Easings.LINEAR, Easings.LINEAR, 0, 0.5),
                Keyframe('scale_x')(Easings.ELASTIC, Easings.ELASTIC, 0, 1),
                Keyframe('scale_y')(Easings.ELASTIC, Easings.ELASTIC, 0, 1),
                Keyframe('rotation')(Easings.ELASTIC, Easings.ELASTIC, 0, 90),
                Keyframe('position_y')(Easings.LINEAR, Easings.ELASTIC, 2500, 0.5),            
                Keyframe('position_y')(Easings.ELASTIC, Easings.ELASTIC, 4000, 0),
                Keyframe('scale_x')(Easings.ELASTIC, Easings.ELASTIC, 4000, 2),
                Keyframe('scale_y')(Easings.ELASTIC, Easings.ELASTIC, 4000, 2),
                Keyframe('rotation')(Easings.ELASTIC, Easings.ELASTIC, 4000, -270),
            )
        )
        .scene()
        .start();
}
