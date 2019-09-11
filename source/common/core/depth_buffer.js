/**
 * Depth buffer constructor
 */

function DepthBuffer() {
    this._primitives = [];
};

/**
 * Append the given primitive and all of its children to the depth buffer in
 * a sorted fashion
 */

DepthBuffer.prototype.append = function(primitive) {
    let children = primitive.children();
    for (let i = 0; i < children.length; ++i) {
        this.append(children[i]);
    }
    let start = 0;
    let end = this._primitives.length;
    while (start < end) {
        let middle = start + end >>> 1;
        if (this._primitives[middle].depth() < primitive.depth()) start = middle + 1;
        else end = middle;
    }
    this._primitives.splice(start, 0, primitive);
    return this;
};

/**
 * Relocate an element to a new position according to the supplied depth
 */

DepthBuffer.prototype.relocate = function(primitive, depth) {
    const primitive_index = this._primitives.indexOf(primitive);
    if (primitive._depth !== depth && primitive_index !== -1) {
        if (primitive._depth > depth) {

            /**
             * Iterate in negative direction over the depth buffer
             */

            for (let i = primitive_index; i > -1; --i) {
                if (depth > this._primitives[i]._depth) {
                    this._primitives.splice(primitive_index, 1);
                    this._primitives.splice(i + 1, 0, primitive);
                    break;
                } else if (i === 0) {
                    this._primitives.splice(primitive_index, 1);
                    this._primitives.splice(0, 0, primitive);
                    break;
                }
            }
        } else {

            /**
             * Iterate in positive direction over the depth buffer
             */

            for (let i = primitive_index + 1; i < this._primitives.length; ++i) {
                if (depth <= this._primitives[i]._depth) {
                    this._primitives.splice(i, 0, primitive);
                    this._primitives.splice(primitive_index, 1);
                    break;
                } else if (i === this._primitives.length - 1) {
                    this._primitives.splice(i + 1, 0, primitive);
                    this._primitives.splice(primitive_index, 1);
                    break;
                }
            }
        }
    }
};

/**
 * Empty the depth buffer
 */

DepthBuffer.prototype.empty = function() {
    this._primitives.length = 0;
    return this;
};

/**
 * List all the primitives currently in the depth buffer
 */

DepthBuffer.prototype.primitives = function() {
    return this._primitives;
};

exports.DepthBuffer = DepthBuffer;