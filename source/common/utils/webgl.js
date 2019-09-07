/**
 * Utilities
 */

import {
    is_power_of_two
} from 'common/utils/math';

/**
 * Initialize a texture and load an image.
 * When the image finished loading copy it into the texture.
 */

export function load_texture(context, url) {
    const texture = context.createTexture();
    context.bindTexture(context.TEXTURE_2D, texture);
  
    /**
     * Until the image is downloaded, put a single pixel in the texture so we can
     * use it immediately. When the image has finished downloadin, we update the image
     */

    const image = new Image();
    context.texImage2D(context.TEXTURE_2D, 0, context.RGBA, 1, 1, 0, context.RGBA, context.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
    image.onload = () => {
        context.bindTexture(context.TEXTURE_2D, texture);
        context.texImage2D(context.TEXTURE_2D, 0, context.RGBA, context.RGBA, context.UNSIGNED_BYTE, image);
    
        /**
         * WebGL1 has different requirements for power of 2 images
         * vs non power of 2 images so check if the image is a power of 2 in both dimensions.
         */
        
        if (is_power_of_two(image.width) && is_power_of_two(image.height)) {
            context.generateMipmap(context.TEXTURE_2D);
        } else {
            context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_T, context.CLAMP_TO_EDGE);
            context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_S, context.CLAMP_TO_EDGE);
            context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.LINEAR);
        }
    };
    image.src = url;

    return texture;
}
