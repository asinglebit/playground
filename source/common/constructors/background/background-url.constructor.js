/**
 * Enumerations
 */

import {
    ShadingBackground
} from 'common/enumerations';

/**
 * Background url
 */

export const construct_background_url = function(url) {
    return {
        type: ShadingBackground.URL,
        data: {
            url
        }
    };
}
