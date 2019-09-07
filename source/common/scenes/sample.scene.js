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
 * Utilities
 */

import {
    deg_to_rad
} from 'common/utils/math';

/**
 * Scene
 */

export const init = container => {
    
    const scene = new Manager()
        .new(container, 'scene');

    const rect_background = new scene.factory.Rect();
    const rect_exhibit = new scene.factory.Rect().depth(1);

    scene
        .root()
        .append(rect_background)
        .append(rect_exhibit)
        .scene()
        .timeline()
        .clip(
            new Clip().set(
                rect_exhibit,
                Keyframe('position_y')(Easings.LINEAR, Easings.LINEAR, 0, 0.5),
                Keyframe('scale_x')(Easings.ELASTIC, Easings.ELASTIC, 0, 0.1),
                Keyframe('scale_y')(Easings.ELASTIC, Easings.ELASTIC, 0, 0.1),
                Keyframe('rotation')(Easings.ELASTIC, Easings.ELASTIC, 0, 0),
                Keyframe('position_y')(Easings.LINEAR, Easings.ELASTIC, 2500, 0.5),            
                Keyframe('position_y')(Easings.ELASTIC, Easings.ELASTIC, 4000, 0),
                Keyframe('scale_x')(Easings.ELASTIC, Easings.ELASTIC, 4000, 1),
                Keyframe('scale_y')(Easings.ELASTIC, Easings.ELASTIC, 4000, 1),
                Keyframe('rotation')(Easings.ELASTIC, Easings.ELASTIC, 4000, 360),
            )
        )
        .scene()
        .on_resize((width, height) => {
            rect_background
                .width(width)
                .height(height);
            rect_exhibit
                .width(width / 10)
                .height(width / 20);
        })
        .resize()
        .start();
}
