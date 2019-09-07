import {
    Node
} from 'common/core/node';
import {
    DepthBuffer
} from 'common/core/depth_buffer';
import {
    Primitive
} from 'common/core/primitive';
import {
    Rect
} from 'common/primitives/rect';
import {
    Timeline
} from './timeline';
import {
    Timer
} from './timer';
import {
    get_projection
} from 'common/utils/math';

/**
 * Scene constructor
 */

export function Scene(container, name, width, height) {

    /**
     * Timer bound to the current scene
     */

    this._timer = new Timer();

    /**
     * Frames per second
     */

    this._fps = 60;

    /**
     * Request animation frame id
     */

    this._request_animation_frame_id = null;

    /**
     * Name of the scene, also used as canvas id
     */

    this._name = name;

    /**
     * Constructor factory
     */
    
    this.factory = {};
    this.factory.Node = Node(this);
    this.factory.Primitive = Primitive(this, this.factory.Node);
    this.factory.Rect = Rect(this, this.factory.Primitive),

    /**
     * Depth buffer that contains all renderable assets sorted by depth
     */

    this._depthbuffer = new DepthBuffer();

    /**
     * Timeline that contains all of the keyframes related to current scene
     */

    this._timeline = new Timeline(this);

    /**
     * Root node of the scene
     */

    this._root = new this.factory.Node();

    /**
     * Canvas, bound to the scene
     */

    this._canvas = container.appendChild(document.createElement('canvas'));
    this._canvas.id = this._name;

    /**
     * Rendering context
     */

    this._context = this._canvas.getContext('webgl2');
    this._context.enable(this._context.DEPTH_TEST);
    this._context.depthFunc(this._context.LEQUAL);

    /**
     * Resizing the scene
     */

    this.resize(width, height);

    /**
     * User defined callback
     */

    this._user_logic;

    /**
     * Add automatic resizing
     */
    
    window.addEventListener('resize', () => {
        this.resize();
    });
};

/**
 * Resize the scene
 */

Scene.prototype.resize = function(width, height) {

    /**
     * Set dimensions to the values that have been supplied to the constructor,
     * if none were passed set the width and height to the maximum of
     * the available area
     */

    if (width !== undefined && height !== undefined) {
        this._canvas.width = width;
        this._canvas.height = height;
    } else {
        this._canvas.style.width = '100%';
        this._canvas.style.height = '100%';
        this._canvas.width = this._canvas.offsetWidth;
        this._canvas.height = this._canvas.offsetHeight;
    }

    /**
     * Resize WebGL context
     */

    this._context.viewport(0.0, 0.0, this._canvas.width, this._canvas.height)
    this._proj_matrix = get_projection(40, this._canvas.width / this._canvas.height, 1, 100);
    this._proj_matrix = get_projection(40, this._canvas.width / this._canvas.height, 1, 100);
    this._view_matrix = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,-20,1];

    /**
     * Resize the root node of the tree
     */

    const scale = this._root.scale();
    const rotate = this._root.rotate();
    this._root
        .reset()
        .translate(0, 0)
        .scale(scale.x, scale.y)
        .rotate(rotate);

    return this;
};

/**
 * Get the scene's timer
 */

Scene.prototype.timer = function() {
    return this._timer;
};

/**
 * Get the scene's timeline
 */

Scene.prototype.timeline = function() {
    return this._timeline;
};

/**
 * Get or set fps
 */

Scene.prototype.fps = function(fps) {
    if (fps !== undefined) {
        this._fps = fps;
        return this;
    } else {
        return this._fps;
    }
};

/**
 * Get the scene's name
 */

Scene.prototype.name = function() {
    return this._name;
};

/**
 * Get the root node
 */

Scene.prototype.root = function() {
    return this._root;
};

/**
 * Get the canvas
 */

Scene.prototype.canvas = function() {
    return this._canvas;
};

/**
 * Get the context
 */

Scene.prototype.context = function() {
    return this._context;
};

/**
 * Get the depth buffer
 */

Scene.prototype.depthbuffer = function() {
    return this._depthbuffer;
};

/**
 * Set the context ready for rendering
 */

Scene.prototype.clear = function() {
    this._context.clearColor(0.5, 0.5, 0.5, 0.9);
    this._context.clearDepth(1.0);
    this._context.clear(this._context.COLOR_BUFFER_BIT | this._context.DEPTH_BUFFER_BIT);
}

/**
 * Render all of the primitives that are in the depth buffer
 */

Scene.prototype.render = function() {

    // Detect dirty nodes and cascade their transformations

    const dirty = this.root().reachDirty();
    for (let i = 0; i < dirty.length; ++i) {
        dirty[i].cascade();
    }

    // Clear the context

    this.clear();

    // Iterate over the depth buffer and render all of the primitives

    const primitives = this._depthbuffer.primitives();
    for (let i = 0; i < primitives.length; ++i) {
        primitives[i].render();
    }
    
    return this;
};

/**
 * Rendering loop
 */

Scene.prototype.loop = function() {
    setTimeout(() => {
        if (this._request_animation_frame_id) {
            this._request_animation_frame_id = requestAnimationFrame(() => this.loop.bind(this)());
            this._timeline.seek(this._timer.delta());
            this._user_logic && this._user_logic();
            this.render();
        }
    }, 1000 / this._fps);
};

/**
 * Start rendering
 */

Scene.prototype.start = function(user_logic) {
    this.timer().reset();
    this._user_logic = user_logic;
    this._request_animation_frame_id = requestAnimationFrame(() => this.loop.bind(this)());
};

/**
 * Resume rendering
 */

Scene.prototype.resume = function() {
    this.timer().resume();
    this._request_animation_frame_id = requestAnimationFrame(() => this.loop.bind(this)());
};

/**
 * Pause rendering
 */

Scene.prototype.pause = function() {
    this.timer().pause();
    this._request_animation_frame_id &&
        window.cancelAnimationFrame(this._request_animation_frame_id);
    this._request_animation_frame_id = null;
};

/**
 * Empty the scene
 */

Scene.prototype.empty = function() {
    this.stop();
    this._timeline.empty();
    this._depthbuffer.empty();
    this._root.detachChildren();
};
