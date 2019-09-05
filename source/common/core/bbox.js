/**
 * Bounding box constructor
 */

export function BBox(x, y, width, height) {
    this._x = x || 0;
    this._y = y || 0;
    this._width = width || 0;
    this._height = height || 0;
};

/**
 * Get the current bounding boxes position on the x axis
 */

BBox.prototype.x = function x() {
    return this._x;
};

/**
 * Get the current bounding boxes position on the y axis
 */

BBox.prototype.y = function y() {
    return this._y;
};

/**
 * Get width of the current bounding box
 */

BBox.prototype.width = function width() {
    return this._width;
};

/**
 * Get height of the current bounding box
 */

BBox.prototype.height = function height() {
    return this._height;
};

/**
 * Concatenate given bbox with the current bbox
 */

BBox.prototype.merge = function merge(...bboxes) {

    /**
     *  (0,+)----------------------->(+,+)
     *    ^ (a1)----(b1)  (an)----(bn) ^
     *    |  | (this) |    | (that) |  |
     *    | (c1)------|   (cn)------|  |
     *  (0,0)----------------------->(+,0)
     */

    const ay = [];
    const cy = [];
    const ax = [];
    const bx = [];

    if (this._width !== 0 && this._height !== 0) {
        ay.push(this._y);
        cy.push(this._y - this._height);
        ax.push(this._x);
        bx.push(this._x + this._width);
    }

    for (let i = 0; i < bboxes.length; ++i) {
        if (bboxes[i].width() !== 0 && bboxes[i].height() !== 0) {
            ay.push(bboxes[i].y());
            cy.push(bboxes[i].y() - bboxes[i].height());
            ax.push(bboxes[i].x());
            bx.push(bboxes[i].x() + bboxes[i].width());
        }
    }

    if (ax.length > 0) {
        this._x = Math.min(...ax);
        this._y = Math.max(...ay);
        this._width = Math.max(...bx) - Math.min(...ax);
        this._height = Math.max(...ay) - Math.min(...cy);
    }

    return this;
};

/**
 * Construct a bounding box from a set of arbitrary points
 */

BBox.prototype.from = function from(xValues, yValues) {
    let x = 0;
    let y = 0;
    let width = 0;
    let height = 0;

    x = Math.min(...xValues);
    y = Math.max(...yValues);
    width = Math.abs(Math.max(...xValues) - x);
    height = Math.abs(Math.min(...yValues) - y);

    return new BBox(x, y, width, height);
};