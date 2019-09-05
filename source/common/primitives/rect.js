import {
    vec2,
    vec3,
    mat4,
    quat
} from 'gl-matrix';
import {
    BBox
} from 'common/core/bbox';
import {
    inherit
} from "common/utils/helper";
import {
    deg_to_rad
} from "common/utils/math";

/**
 * Meshes
 */

import {
    CubeVertices,
    CubeIndices
} from "common/meshes/cube";

/**
 * Shaders
 */

import CubeVertexShader from "common/shaders/cube.vertex.glsl";
import CubeFragmentShader from "common/shaders/cube.fragment.glsl";

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


        // Create and store data into vertex buffer
        const vertex_buffer = _scene._context.createBuffer();
        _scene._context.bindBuffer(_scene._context.ARRAY_BUFFER, vertex_buffer);
        _scene._context.bufferData(_scene._context.ARRAY_BUFFER, new Float32Array(CubeVertices), _scene._context.STATIC_DRAW);
        // Create and store data into index buffer
        this._index_buffer = _scene._context.createBuffer();
        _scene._context.bindBuffer(_scene._context.ELEMENT_ARRAY_BUFFER, this._index_buffer);
        _scene._context.bufferData(_scene._context.ELEMENT_ARRAY_BUFFER, new Uint16Array(CubeIndices), _scene._context.STATIC_DRAW);
        const vertShader = _scene._context.createShader(_scene._context.VERTEX_SHADER);
        _scene._context.shaderSource(vertShader, CubeVertexShader);
        _scene._context.compileShader(vertShader);
        const fragShader = _scene._context.createShader(_scene._context.FRAGMENT_SHADER);
        _scene._context.shaderSource(fragShader, CubeFragmentShader);
        _scene._context.compileShader(fragShader);
        this._shaderProgram = _scene._context.createProgram();
        _scene._context.attachShader(this._shaderProgram, vertShader);
        _scene._context.attachShader(this._shaderProgram, fragShader);
        _scene._context.linkProgram(this._shaderProgram);

        _scene._context.bindBuffer(_scene._context.ARRAY_BUFFER, vertex_buffer);
        var position = _scene._context.getAttribLocation(this._shaderProgram, "position");
        _scene._context.vertexAttribPointer(position, 3, _scene._context.FLOAT, false,0,0) ;
        _scene._context.enableVertexAttribArray(position);
        _scene._context.useProgram(this._shaderProgram);

    };

    /**
     * Get or set the upper left point of the rect
     */

    Rect.prototype.at = function (x, y) {
        if (x !== undefined || y !== undefined) {
            if (x !== undefined) {
                this._at.x = (x !== undefined) && x || this._at.x;
                const half_width = this._width >>> 1;
                this._points[0].x = this._points[2].x = this._at.x - half_width;
                this._points[1].x = this._points[3].x = this._at.x + half_width;
            }
            if (y !== undefined) {
                this._at.y = (y !== undefined) && y || this._at.y;
                const half_height = this._height >>> 1;
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
            const half_width = width >>> 1;
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
            const half_height = height >>> 1;
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
            var Pmatrix = _scene._context.getUniformLocation(this._shaderProgram, "Pmatrix");
            var Vmatrix = _scene._context.getUniformLocation(this._shaderProgram, "Vmatrix");
            var Mmatrix = _scene._context.getUniformLocation(this._shaderProgram, "Mmatrix");

            _scene._context.enable(_scene._context.DEPTH_TEST);
            _scene._context.depthFunc(_scene._context.LEQUAL);
            _scene._context.clearColor(0.5, 0.5, 0.5, 0.9);
            _scene._context.clearDepth(1.0);

            _scene._context.clear(_scene._context.COLOR_BUFFER_BIT | _scene._context.DEPTH_BUFFER_BIT);
            _scene._context.uniformMatrix4fv(Pmatrix, false, _scene._proj_matrix);
            _scene._context.uniformMatrix4fv(Vmatrix, false, _scene._view_matrix);
            _scene._context.uniformMatrix4fv(Mmatrix, false, this._matrix_cascaded);
            _scene._context.bindBuffer(_scene._context.ELEMENT_ARRAY_BUFFER, this._index_buffer);
            _scene._context.drawElements(_scene._context.TRIANGLES, CubeIndices.length, _scene._context.UNSIGNED_SHORT, 0);

			
        }
    };

    return Rect;
};