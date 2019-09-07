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
    get_pixel_size
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
            new Clip()
            .set(
                rect_background,
                Keyframe('position_y')(Easings.LINEAR, Easings.LINEAR, 0, 0.5),
                Keyframe('scale_x')(Easings.CUBIC, Easings.CUBIC, 0, 0.1),
                Keyframe('scale_y')(Easings.CUBIC, Easings.CUBIC, 0, 0.1),
                Keyframe('rotation')(Easings.CUBIC, Easings.CUBIC, 0, 0),
                Keyframe('position_y')(Easings.LINEAR, Easings.CUBIC, 2500, 0.5),            
                Keyframe('position_y')(Easings.CUBIC, Easings.CUBIC, 4000, 0),
                Keyframe('scale_x')(Easings.CUBIC, Easings.CUBIC, 4000, 1),
                Keyframe('scale_y')(Easings.CUBIC, Easings.CUBIC, 4000, 1),
            )
            .set(
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
            debugger;
            rect_background
                .at(width / 2, height/2)
                .width(width)
                .height(height);
            rect_exhibit
                .at(width / 2, 25)
                .width(width)
                .height(50);
        })
        .resize()
        .start();
}
