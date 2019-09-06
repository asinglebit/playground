import {
    Manager
} from 'common/core/manager';

/**
 * Constructors
 */

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

    const manager = new Manager();
    const scene = manager.new(container, 'scene');
    const root = scene.root();
    const Rect = scene.factory().Rect;

    const rect = new Rect()
        .width(1.0)
        .height(4.0)
        .rotate(90)
    
    root
        .append(rect)

    const rect_rotation = Keyframe('rotation');
    const clip = new Clip()
        .set(
            rect,
            rect_rotation(Easings.ELASTIC, Easings.ELASTIC, 0, 0),
            rect_rotation(Easings.ELASTIC, Easings.ELASTIC, 10000, 1000)
        );

    scene
        .timeline()
        .clip(clip);
    
    window.addEventListener('resize', function() {
        scene.resize();
    });
        
    scene.start();
}
