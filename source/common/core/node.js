import{
    vec3,
    mat4
} from 'gl-matrix';
import {
    BBox
} from 'common/core/bbox';
import {
    deg_to_rad,
    trim_angle
} from 'common/utils/math';

export function Node(_scene) {

    /**
     * Node constructor
     */

    function Node() {

        /**
         * Nodes pivot point
         */

        this._pivot = {
            x: 0,
            y: 0
        };

        /**
         * Current nodes position
         */

        this._position = {
            x: 0,
            y: 0
        };

        /**
         * Current nodes rotation in degrees
         */

        this._rotation = 0;

        /**
         * Current nodes scale
         */

        this._scale = {
            x: 1,
            y: 1
        };

        /**
         * Current nodes transformation matrix
         */

        this._matrix_own = mat4.create();

        /**
         * Current nodes cascaded transformation matrix
         */

        this._matrix_cascaded = mat4.create();

        /**
         * Child nodes of the current node
         */

        this._children = [];

        /**
         * Parent node of the current node
         */

        this._parent = null;

        /**
         * Indicates whether the current node should be iterated over
         * during rendering
         */

        this._active = true;

        /**
         * Indicates whether uncascaded transformations have been applied to the
         * current nodes children
         */

        this._dirty = false;

        /**
         * Setters
         */

        Object.defineProperty(this, 'rotation', {
            set: this.rotate
        });

        Object.defineProperty(this, 'scale_x', {
            set: x => this.scale(x, undefined)
        });

        Object.defineProperty(this, 'scale_y', {
            set: y => this.scale(undefined, y)
        });

        Object.defineProperty(this, 'position_x', {
            set: x => this.translate(x, undefined)
        });

        Object.defineProperty(this, 'position_y', {
            set: y => this.translate(undefined, y)
        });
    };

    /**
     * Get or set the position of the node
     */

    Node.prototype.reset = function() {
        this._matrix_own = mat4.create();
        this._pivot.x = 0;
        this._pivot.y = 0;
        this._position.x = 0;
        this._position.y = 0;
        this._rotation = 0;
        this._scale.x = 1;
        this._scale.y = 1;
        this._dirty = true;
        return this;
    };

    /**
     * Get or set the nodes pivot point
     */

    Node.prototype.pivot = function(x, y) {
        if (x !== undefined || y !== undefined) {
            this._pivot.x = (x !== undefined) && x || this._pivot.x;
            this._pivot.y = (y !== undefined) && -y || this._pivot.y;
            this._dirty = true;
            return this;
        } else {
            return {
                x: this._pivot.x,
                y: -this._pivot.y
            };
        }
    };

    /**
     * Get or set the pivot point of the node on the x axis
     */

    Node.prototype.pivotX = function(x) {
        return this.pivot(x, undefined);
    };

    /**
     * Get or set the pivot point of the node on the y axis
     */

    Node.prototype.pivotY = function(y) {
        return this.pivot(undefined, y);
    };

    /**
     * Get or set the position of the node
     */

    Node.prototype.translate = function(x, y) {
        if (x !== undefined || y !== undefined) {

            /**
             * Compensate for canvas specific y-axis direction
             */

            this._position.x = (x !== undefined) && x || this._position.x;
            this._position.y = (y !== undefined) && -y || this._position.y;
            this._matrix_own = mat4.create();
            mat4.translate(this._matrix_own, this._matrix_own, vec3.fromValues(this._position.x, this._position.y, 0));
            mat4.rotateZ(this._matrix_own, this._matrix_own, deg_to_rad(this._rotation));
            mat4.scale(this._matrix_own, this._matrix_own, vec3.fromValues(this._scale.x, this._scale.y, 1));
            this._dirty = true;
            return this;
        } else {
            return {
                x: this._position.x,
                y: -this._position.y
            };
        }
    };

    /**
     * Get or set the position of the node on the x axis
     */

    Node.prototype.translateX = function(x) {
        return this.translate(x, undefined);
    };

    /**
     * Get or set the position of the node on the y axis
     */

    Node.prototype.translateY = function(y) {
        return this.translate(undefined, y);
    };

    /**
     * Get or set the rotation of the node
     */

    Node.prototype.rotate = function(rotation) {
        if (rotation !== undefined) {
            this._rotation = trim_angle(rotation);
            this._matrix_own = mat4.create();
            mat4.translate(this._matrix_own, this._matrix_own, vec3.fromValues(this._position.x, this._position.y, 0));
            if (this._pivot.x !== 0 || this._pivot.y !== 0) {
                mat4.translate(this._matrix_own, this._matrix_own, vec3.fromValues(this._pivot.x, this._pivot.y, 0));
                mat4.rotateZ(this._matrix_own, this._matrix_own, deg_to_rad(this._rotation));
                mat4.scale(this._matrix_own, this._matrix_own, vec3.fromValues(this._scale.x, this._scale.y, 1));
                mat4.translate(this._matrix_own, this._matrix_own, vec3.fromValues(-this._pivot.x, -this._pivot.y, 0));
            } else {
                mat4.rotateZ(this._matrix_own, this._matrix_own, deg_to_rad(this._rotation));
                mat4.scale(this._matrix_own, this._matrix_own, vec3.fromValues(this._scale.x, this._scale.y, 1));
            }
            this._dirty = true;
            return this;
        } else {
            return this._rotation;
        }
    };

    /**
     * Get or set the scale of the node
     */

    Node.prototype.scale = function(x, y) {
        if (x !== undefined || y !== undefined) {
            this._scale.x = (x !== undefined) ? x : this._scale.x;
            this._scale.y = (y !== undefined) ? y : this._scale.y;
            this._matrix_own = mat4.create();
            mat4.translate(this._matrix_own, this._matrix_own, vec3.fromValues(this._position.x, this._position.y, 0));
            if (this._pivot.x !== 0 || this._pivot.y !== 0) {
                mat4.translate(this._matrix_own, this._matrix_own, vec3.fromValues(this._pivot.x, this._pivot.y, 1));
                mat4.rotateZ(this._matrix_own, this._matrix_own, deg_to_rad(this._rotation));
                mat4.scale(this._matrix_own, this._matrix_own, vec3.fromValues(this._scale.x, this._scale.y, 1));
                mat4.translate(this._matrix_own, this._matrix_own, vec3.fromValues(-this._pivot.x, -this._pivot.y, 0));
            } else {
                mat4.rotateZ(this._matrix_own, this._matrix_own, deg_to_rad(this._rotation));
                mat4.scale(this._matrix_own, this._matrix_own, vec3.fromValues(this._scale.x, this._scale.y, 1));
            }
            this._dirty = true;
            return this;
        } else {
            return {
                x: this._scale.x,
                y: this._scale.y
            };
        }
    };

    /**
     * Get or set the scale of the node by the x axis
     */

    Node.prototype.scaleX = function(x) {
        return this.scale(x, undefined);
    };

    /**
     * Get or set the scale of the node by the y axis
     */

    Node.prototype.scaleY = function(y) {
        return this.scale(undefined, y);
    };

    /**
     * Get the nodes transformation matrix
     */

    Node.prototype.matrixOwn = function() {
        return mat4.clone(this._matrix_own);
    };

    /**
     * Get the nodes cascaded transformation matrix
     */

    Node.prototype.matrixCascaded = function() {
        return mat4.clone(this._matrix_cascaded);
    };

    /**
     * Append one or more nodes as children of the current node
     */

    Node.prototype.append = function(...nodes) {

        /**
         * Check if the current node is linked to the root,
         * and update the depth buffer if that is the case
         */

        const linked = this.linked(_scene.root());
        for (let i = 0; i < nodes.length; ++i) {
            nodes[i].parent(this);
            nodes[i]._dirty = true;
            this._children.push(nodes[i]);
            linked === true && // Proceed if node is linked to the root
                nodes[i].active() && // Proceed if node is active
                nodes[i]._depth !== undefined && // Proceed if the node has depth
                _scene._depthbuffer.append(nodes[i]); // Append the current node to the depth buffer
        }

        return this;
    };

    /**
     * Get or set the current nodes parent
     */

    Node.prototype.parent = function(parent) {
        if (parent) {
            this._parent = parent;
            return this;
        } else {
            return this._parent;
        }
    };

    /**
     * List child nodes of the current node
     */

    Node.prototype.children = function() {
        const children = [];
        for (let i = 0; i < this._children.length; ++i) {
            children.push(this._children[i]);
        }
        return children;
    };

    /**
     * Unlink child nodes
     */

    Node.prototype.filicide = function() {
        this._children = [];
        return this;
    };

    /**
     * Check if the current nodes children contain the given node
     */

    Node.prototype.has = function(node) {
        if (this === node) return true;
        for (let i = 0; i < this._children.length; ++i) {
            if (this._children[i].has(node) === true) return true;
        }
        return false;
    };

    /**
     * Check if the current node is linked to the given node
     */

    Node.prototype.linked = function(node) {
        let current = this;
        while (current !== node && current.parent()) current = current.parent();
        return current === node;
    };

    /**
     * Get or set the current nodes activeness status
     */

    Node.prototype.active = function(active) {
        if (active !== undefined) {
            this._active = active;
            return this;
        } else {
            return this._active;
        }
    };

    /**
     * Get or set the current nodes dirtiness status
     */

    Node.prototype.dirty = function(value) {
        if (value !== undefined) {
            this._dirty = value;
            return this;
        } else {
            return this._dirty;
        }
    };

    /**
     * Get a selection of dirty nodes in straight reachability
     */

    Node.prototype.reachDirty = function() {
        if (this._dirty === true) {
            return [this];
        } else {
            const dirty = [];
            for (let i = 0; i < this._children.length; ++i) {
                const dirtyChildren = this._children[i].reachDirty();
                dirtyChildren.length > 0 && dirty.push(...dirtyChildren);
            }
            return dirty;
        }
    };

    /**
     * Cascades transformations down the hierarchy, cleaning the dirty flag
     */

    Node.prototype.cascade = function() {
        if (this.parent()) {
            mat4.multiply(this._matrix_cascaded, this.parent()._matrix_cascaded, this._matrix_own);
        } else {
            this._matrix_cascaded = mat4.clone(this._matrix_own);
        }
        for (let i = 0; i < this._children.length; ++i) {
            this._children[i].cascade();
        }
        this._dirty = false;
        return this;
    };

    /**
     * Get the bounding box of the current node only
     */

    Node.prototype._bbox = function() {
        return new BBox();
    };

    /**
     * Initiate recursive merge of all the child bboxes
     */

    Node.prototype.bbox = function() {
        const bbox = this._bbox();
        if (this._children.length > 0) {
            const bboxes = [];
            for (let i = 0; i < this._children.length; ++i) {
                bboxes.push(this._children[i].bbox());
            }
            bbox.merge(...bboxes);
        }
        return bbox;
    };

    return Node;
};