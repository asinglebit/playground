/**
 * Libraries
 */

import {
    vec2
} from 'gl-matrix';

/**
 * Utilities
 */

import {
    inherit
} from 'common/utils/helper';
import * as UtilitiesColors from 'common/utils/colors';
import * as UtilitiesWebGL from 'common/utils/webgl';

/**
 * Enumerations
 */

import {
    ShadingBackground,
    ShadingBorder
} from 'common/enumerations';

/**
 * Constructors
 */

import {
    BBox
} from 'common/core/bbox';

/**
 * Shaders
 */

import VertexShader from 'common/shaders/texture.vertex.glsl';
import FragmentShader from 'common/shaders/texture.fragment.glsl';

/**
 * Rect constructor
 */

export function Rect(_scene, Primitive) {

    /**
     * Extends the Primitive prototype
     */

    inherit(Rect, Primitive);

    /**
     * Rect constructor
     */

    function Rect() {
        Primitive.call(this);

        /**
         * Visual representation of the _points array indices:
         *
         * (0)------(1)
         *  | (rect) |
         * (2)------(3)
         */

        this._points = [];

        /**
         * Initialize points
         */

        for (let i = 0; i < 4; ++i) {
            this._points.push({
                x: 0,
                y: 0
            });
        };

        /**
         * Width of the rectangle
         */

        this._width = 0;

        /**
         * Height of the rectangle
         */

        this._height = 0;

        /**
         * Background
         */

        this._texture = null;

        /**
         * Background
         */

        this._background = {
            type: ShadingBackground.COLOR,
            data: {
                color: UtilitiesColors.get_random_color(),
                texture: null
            }
        };

        /**
         * Border
         */

        this._border = {
            type: ShadingBorder.NONE,
            data: {
                width: 0,
                color: UtilitiesColors.get_random_color(),
                radius: 0
            }
        };

        /**
         * Create and compile shader
         */

        this.compile_shader();
    };

    /**
     * Configure, setup and compile the rect shader
     */

    Rect.prototype.compile_shader = function() {
        this._shader_program = _scene._context.createProgram();
        const vertex_shader = _scene._context.createShader(_scene._context.VERTEX_SHADER);
        const fragment_shader = _scene._context.createShader(_scene._context.FRAGMENT_SHADER);
        _scene._context.shaderSource(vertex_shader, VertexShader);
        _scene._context.shaderSource(fragment_shader, FragmentShader);
        _scene._context.compileShader(vertex_shader);
        _scene._context.compileShader(fragment_shader);
        _scene._context.attachShader(this._shader_program, vertex_shader);
        _scene._context.attachShader(this._shader_program, fragment_shader);
        _scene._context.linkProgram(this._shader_program);
    }

    /**
     * Set the background
     */

    Rect.prototype.background = function(type, ...args) {
        switch (type) { 
            case ShadingBackground.COLOR: {
                this._background.type = type;
                this._background.data.color = args[0];
            };
            case ShadingBackground.URL: { 
                this._background.type = type;
                this._background.data.texture = UtilitiesWebGL.load_texture(_scene._context, args[0]); 
                break; 
            } 
        } 
        return this;
    };

    /**
     * Set border
     */
    
    Rect.prototype.border = function(type, ...args) {
        switch (type) { 
            case ShadingBorder.NONE: {
                this._border.type = type;
            };
            case ShadingBorder.SOLID: { 
                this._border.type = type;
                this._border.data.width = args[0];
                this._border.data.color = args[1];
                break; 
            } 
        } 
        return this;
    };

    /**
     * Set border radius
     */
    
    Rect.prototype.border_radius = function(radius) {
        this._border.data.radius = radius;
        return this;
    }

    /**
     * Get or set the upper left point of the rect
     */

    Rect.prototype.at = function (x, y) {
        if (x !== undefined || y !== undefined) {
            if (x !== undefined) {
                this._at.x = (x !== undefined) && x || this._at.x;
                const half_width = this._width / 1;
                this._points[0].x = this._points[2].x = this._at.x - half_width;
                this._points[1].x = this._points[3].x = this._at.x + half_width;
            }
            if (y !== undefined) {
                this._at.y = (y !== undefined) && y || this._at.y;
                const half_height = this._height / 2;
                this._points[0].y = this._points[1].y = this._at.y + half_height;
                this._points[2].y = this._points[3].y = this._at.y - half_height;
            }
            return this;
        } else {
            return this._at;
        }
    };

    /**
     * Get or set the upper left point of the rect on the x axis
     */

    Rect.prototype.atX = function (x) {
        return this.at(x, undefined);
    };

    /**
     * Get or set the upper left point of the rect on the y axis
     */

    Rect.prototype.atY = function (y) {
        return this.at(undefined, y);
    };

    /**
     * Get or set width of the rect and return it
     */

    Rect.prototype.width = function (width) {
        if (width) {
            this._width = width;
            const half_width = width / 2;
            this._points[0].x = this._points[2].x = this._at.x - half_width;
            this._points[1].x = this._points[3].x = this._at.x + half_width;
            return this;
        } else {
            return this._width;
        }
    };

    /**
     * Get or set height of the rect and return it
     */

    Rect.prototype.height = function (height) {
        if (height) {
            this._height = height;
            const half_height = height / 2;
            this._points[0].y = this._points[1].y = this._at.y + half_height;
            this._points[2].y = this._points[3].y = this._at.y - half_height;
            return this;
        } else {
            return this._height;
        }
    };

    /**
     * Get the bounding box of the current node only
     */

    Rect.prototype._bbox = function () {

        /**
         * Transformed points
         */

        const xValues = [];
        const yValues = [];

        /**
         * Transformations
         */

        const transformed3DVector = vec2.create();

        for (let i = 0; i < this._points.length; ++i) {
            vec2.transformMat3(transformed3DVector, vec2.fromValues(this._points[i].x, -this._points[i].y), this._matrix_cascaded);
            xValues.push(transformed3DVector[0]);
            yValues.push(transformed3DVector[1]);
        }

        /**
         * Returning the newly created bouding box
         */

        return BBox.prototype.from(xValues, yValues);
    };

    /**
     * Render the current rect
     */

    Rect.prototype.render = function () {

        /**
         * Render only if primitive is not hidden
         */

        if (this._hidden === false) {

            /**
             * Get locations
             */

            _scene._context.useProgram(this._shader_program);
            const a_position = _scene._context.getAttribLocation(this._shader_program, 'a_position');
            const a_texture_coord = _scene._context.getAttribLocation(this._shader_program, 'a_texture_coord');
            const u_matrix_cascaded = _scene._context.getUniformLocation(this._shader_program, 'u_matrix_cascaded');
            const u_sampler = _scene._context.getUniformLocation(this._shader_program, 'u_sampler');
            const u_resolution = _scene._context.getUniformLocation(this._shader_program, "u_resolution");
            const u_dimensions = _scene._context.getUniformLocation(this._shader_program, "u_dimensions");
            const u_background_color = _scene._context.getUniformLocation(this._shader_program, 'u_background_color');
            const u_border_color = _scene._context.getUniformLocation(this._shader_program, 'u_border_color');
            const u_border_width = _scene._context.getUniformLocation(this._shader_program, 'u_border_width');
            const u_border_radius = _scene._context.getUniformLocation(this._shader_program, 'u_border_radius');
            const u_ShadingBackground = _scene._context.getUniformLocation(this._shader_program, "ShadingBackground");
            const u_ShadingBorder = _scene._context.getUniformLocation(this._shader_program, "ShadingBorder");

            /**
             * Layout
             */
            
            _scene._context.uniformMatrix3fv(u_matrix_cascaded, false, this._matrix_cascaded);
            _scene._context.uniform2f(u_resolution, _scene._viewport.width, _scene._viewport.height);	
            _scene._context.uniform2f(u_dimensions, this._width, this._height);

            /**
             * Texture coordinates
             */

            const texture_coordinates_buffer = _scene._context.createBuffer();
            _scene._context.bindBuffer(_scene._context.ARRAY_BUFFER, texture_coordinates_buffer);            
            const texture_coordinates = [
                1.0,  1.0,
                1.0,  0.0,
                0.0,  1.0,
                0.0,  1.0,
                1.0,  0.0,
                0.0,  0.0,
            ];
            _scene._context.bufferData(_scene._context.ARRAY_BUFFER, new Float32Array(texture_coordinates), _scene._context.STATIC_DRAW);
            _scene._context.bindBuffer(_scene._context.ARRAY_BUFFER, texture_coordinates_buffer);
            _scene._context.vertexAttribPointer(a_texture_coord, 2, _scene._context.FLOAT, false, 0, 0);
            _scene._context.enableVertexAttribArray(a_texture_coord);

            /** 
             * Background 
             */ 
        
            switch (this._background.type) { 
                case ShadingBackground.COLOR: { 
                    _scene._context.uniform1i(u_ShadingBackground, ShadingBackground.COLOR); 
                    _scene._context.uniform4f(u_background_color, ...this._background.data.color); 
                    _scene._context.activeTexture(_scene._context.TEXTURE0); 
                    _scene._context.bindTexture(_scene._context.TEXTURE_2D, this._background.data.texture); 
                    break; 
                } 
                case ShadingBackground.URL: { 
                    _scene._context.uniform1i(u_sampler, 0); 
                    _scene._context.uniform1i(u_ShadingBackground, ShadingBackground.URL); 
                    _scene._context.uniform4f(u_background_color, 0.0, 0.0, 0.0, 1.0); 
                    _scene._context.activeTexture(_scene._context.TEXTURE0); 
                    _scene._context.bindTexture(_scene._context.TEXTURE_2D, this._background.data.texture); 
                    break; 
                } 
            } 
        
            /** 
             * Border 
             */ 
        
            _scene._context.uniform1f(u_border_radius, this._border.data.radius); 
            switch (this._border.type) { 
                case ShadingBorder.NONE: { 
                    _scene._context.uniform1i(u_ShadingBorder, ShadingBorder.NONE); 
                    _scene._context.uniform1f(u_border_width, 0); 
                    _scene._context.uniform4f(u_border_color, 0.0, 0.0, 0.0, 1.0); 
                    break; 
                } 
                case ShadingBorder.SOLID: { 
                    _scene._context.uniform1i(u_ShadingBorder, ShadingBorder.SOLID); 
                    _scene._context.uniform1f(u_border_width, this._border.data.width); 
                    _scene._context.uniform4f(u_border_color, ...this._border.data.color); 
                    break; 
                } 
            } 

            /**
             * Mesh
             */

            const MeshQuad = new Float32Array([ 
                this._points[3].x, this._points[3].y, this._depth,
                this._points[1].x, this._points[1].y, this._depth,
                this._points[2].x, this._points[2].y, this._depth,
                this._points[2].x, this._points[2].y, this._depth,
                this._points[1].x, this._points[1].y, this._depth,
                this._points[0].x, this._points[0].y, this._depth
            ]);
            const quad_vertex_buffer = _scene._context.createBuffer();
            _scene._context.bindBuffer(_scene._context.ARRAY_BUFFER, quad_vertex_buffer);
            _scene._context.bufferData(_scene._context.ARRAY_BUFFER, MeshQuad, _scene._context.STATIC_DRAW);
            _scene._context.vertexAttribPointer(a_position, 3, _scene._context.FLOAT, false, 0, 0);
            _scene._context.enableVertexAttribArray(a_position);
            _scene._context.drawArrays(_scene._context.TRIANGLES, 0, 6);
        }
    };

    return Rect;
};