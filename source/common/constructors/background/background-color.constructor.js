/**
 * Enumerations
 */

import {
    ShadingBackground
} from 'common/enumerations';

/**
 * Background color
 */

export const construct_background_color = function(color) {
    return {
        type: ShadingBackground.COLOR,
        data: {
            color
        }
    };
}
