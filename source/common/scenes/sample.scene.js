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
        .background(ShadingBackground.COLOR, UtilitiesColors.hex_to_rgba('#444444'));
    const rect_header = new scene.factory.Rect()
        .background(ShadingBackground.COLOR, UtilitiesColors.hex_to_rgba('#cdcdcd'));
    const react_search_bar = new scene.factory.Rect()
        .background(ShadingBackground.COLOR, UtilitiesColors.hex_to_rgba('#707070'));
    const react_search_input = new scene.factory.Rect()
        .background(ShadingBackground.COLOR, UtilitiesColors.hex_to_rgba('#ffffff'))
        .border(ShadingBorder.SOLID, 15, UtilitiesColors.hex_to_rgba('#2F2300'))
        .border_radius(15)
        .depth(5);

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
        .on_resize((width, height) => {
            rect_background
                .at(width / 2, height / 2)
                .width(width)
                .height(height);
            rect_header
                .at(width / 2, 250 / 2)
                .width(width)
                .height(250);
            react_search_bar
                .at(width / 2, 150 / 2 + 200)
                .width(width)
                .height(150)
            react_search_input
                .at(width - 120, 60 / 2 + 270)
                .width(200)
                .height(50)
        })
        .resize()
        .start();

        let scroll = 0;
        document.addEventListener('wheel', function(event) {
            if (event.deltaY > 0) {
                scroll = scroll - 0.08;
            } else {
                scroll = scroll + 0.08;
            }
            rect_header.position_y = scroll;
            react_search_bar.position_y = scroll;
        });
}
