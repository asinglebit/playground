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
 * Textures
 */

import ImageBackground from 'common/textures/tileset.png';

/**
 * Enumerations
 */

import {
    ShadingBackground,
    ShadingBorder
} from 'common/enumerations';

/**
 * Utilities
 */

import * as UtilitiesColors from 'common/utils/colors';
import * as UtilitiesMath from 'common/utils/math';

/**
 * Scene
 */

export const init = container => {
    
    const scene = new Manager()
        .new(container, 'scene');
    const rect_background = new scene.factory.Rect()
        .depth(1);
    const rect_header = new scene.factory.Rect()
        .depth(1);
    const react_search_bar = new scene.factory.Rect()
        .depth(1);
    const react_search_input = new scene.factory.Rect()
        .border(ShadingBorder.SOLID, 5, UtilitiesColors.get_random_color())
        .border_radius(15)
        .depth(1);

    scene
        .root()
        .append(
            rect_background
            .append(rect_header)
            .append(
                react_search_bar
                .append(
                    react_search_input
                )
            )
        )
        .scene()
        .timeline()
        .clip(
            new Clip()
            .set(
                scene.root(),
                Keyframe('position_y')(Easings.LINEAR, Easings.LINEAR, 0, scene._canvas.height),
                Keyframe('scale_y')(Easings.LINEAR, Easings.LINEAR, 0, 5),
                Keyframe('position_y')(Easings.ELASTIC, Easings.ELASTIC, 2500, 0),
                Keyframe('scale_y')(Easings.ELASTIC, Easings.ELASTIC, 2500, 1),
            )
            .set(
                react_search_input,
                Keyframe('rotation')(Easings.LINEAR, Easings.LINEAR, 0, 0),
                Keyframe('rotation')(Easings.ELASTIC, Easings.ELASTIC, 10000, 3600),
            )
        )
        .scene()
        .on_resize((width, height) => {
            rect_background
                .translate(width / 2, height / 2)
                .rotate(0)
                .width(width)
                .height(height);
            rect_header
                .translate(0, - height / 2 + 250 / 2)
                .width(width)
                .height(250);
            react_search_bar
                .translate(0, - height / 2 + 250 + 150 / 2)
                .width(width)
                .height(150)
            react_search_input
                .translate(- width / 2 + 200 , 0)
                .width(200)
                .height(100)
        })
        .resize()
        .start();
}
