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
import {
    load_texture
} from 'common/utils/webgl';

/**
 * Constructors
 */

import {
    BBox
} from 'common/core/bbox';

/**
 * Shaders
 */

//import CubeVertexShader from 'common/shaders/cube.vertex.glsl';
//import CubeFragmentShader from 'common/shaders/cube.fragment.glsl';
//import CubeFragmentShader from 'common/shaders/full_screen_quad.fragment.glsl';
import VertexShader from 'common/shaders/texture.vertex.glsl';
import FragmentShader from 'common/shaders/texture.fragment.glsl';

/**
 * Textures
 */

import ImageButton from 'common/textures/tileset.png';

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
        this._texture = load_texture(_scene._context, ImageButton);
    };

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
             * Setup transformations and render
             */

            _scene._context.useProgram(this._shader_program);
            
            const vertexPositionAttribute = _scene._context.getAttribLocation(this._shader_program, 'position');
            var Pmatrix = _scene._context.getUniformLocation(this._shader_program, 'Pmatrix');
            var Vmatrix = _scene._context.getUniformLocation(this._shader_program, 'Vmatrix');
            var Mmatrix = _scene._context.getUniformLocation(this._shader_program, 'Mmatrix');

            const textureCoordBuffer = _scene._context.createBuffer();
            _scene._context.bindBuffer(_scene._context.ARRAY_BUFFER, textureCoordBuffer);
            const ratio = this._width / this._height;
            const textureCoordinates = [
                1.0,  1.0,
                1.0,  0.0,
                0.0,  1.0,
                
                0.0,  1.0,
                1.0,  0.0,
                0.0,  0.0,
            ]
            _scene._context.bufferData(_scene._context.ARRAY_BUFFER, new Float32Array(textureCoordinates), _scene._context.STATIC_DRAW);

            const textureCoord = _scene._context.getAttribLocation(this._shader_program, 'aTextureCoord');
            const uSampler = _scene._context.getUniformLocation(this._shader_program, 'uSampler');

            _scene._context.bindBuffer(_scene._context.ARRAY_BUFFER, textureCoordBuffer);
            _scene._context.vertexAttribPointer(textureCoord, 2, _scene._context.FLOAT, false, 0, 0);
            _scene._context.enableVertexAttribArray(textureCoord);
            _scene._context.activeTexture(_scene._context.TEXTURE0);
            _scene._context.bindTexture(_scene._context.TEXTURE_2D, this._texture);
            _scene._context.uniform1i(uSampler, 0);

            const MeshQuad = new Float32Array([ 
                this._points[3].x, this._points[3].y, 0.0,
                this._points[1].x, this._points[1].y, 0.0,
                this._points[2].x, this._points[2].y, 0.0,
                this._points[2].x, this._points[2].y, 0.0,
                this._points[1].x, this._points[1].y, 0.0,
                this._points[0].x, this._points[0].y, 0.0
            ]);
    
            const quad_vertex_buffer = _scene._context.createBuffer();
            _scene._context.bindBuffer(_scene._context.ARRAY_BUFFER, quad_vertex_buffer);
            _scene._context.bufferData(_scene._context.ARRAY_BUFFER, MeshQuad, _scene._context.STATIC_DRAW);
            _scene._context.vertexAttribPointer(vertexPositionAttribute, 3, _scene._context.FLOAT, false, 0, 0);
            _scene._context.enableVertexAttribArray(vertexPositionAttribute);
            _scene._context.drawArrays(_scene._context.TRIANGLES, 0, 6);
            _scene._context.uniformMatrix4fv(Pmatrix, false, _scene._proj_matrix);
            _scene._context.uniformMatrix4fv(Vmatrix, false, _scene._view_matrix);
            _scene._context.uniformMatrix4fv(Mmatrix, false, this._matrix_cascaded);			
        }
    };

    return Rect;
};