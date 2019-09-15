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
        .depth(3);
    const react_search_bar = new scene.factory.Rect()
        .depth(4);
    const react_search_input = new scene.factory.Rect()
        .border(ShadingBorder.SOLID, 5, UtilitiesColors.get_random_color())
        .border_radius(15)
        .depth(5);

    scene
        .root()
        .translate(100, 0)
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
        .on_resize((width, height) => {
            rect_background
                .at(width / 2, height / 2)
                .width(width)
                .height(height);
            rect_header
                .at(width / 2, 250 / 2)
                .translate(0, 0)
                .width(width)
                .height(250);
            react_search_bar
                .at(width / 2, 150 / 2 + 200)
                .translate(0, 0)
                .width(width)
                .height(150)
            react_search_input
                .at(width - 120, 60 / 2 + 270)
                .pivot(width - 120, 60 / 2 + 270)
                .translate(0, 0)
                .rotate(0)
                .width(100)
                .height(50)
        })
        .resize()
        .start();
}
