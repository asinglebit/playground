/**
 * Constructors
 */

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

/**
 * Shaders
 */

import VertexShader from 'common/shaders/full_screen_quad.vertex.glsl';
import FragmentShader from 'common/shaders/full_screen_quad.fragment.glsl';

/**
 * Meshes
 */

import {
    MeshQuad
} from 'common/meshes/quad';

/**
 * Utilities
 */

import {
    get_projection_matrix,
    get_view_matrix
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
     * Camera setup
     */

    this._fov = 45;
    this._near_clip_plane = 0;
    this._far_clip_plane = 1000000;

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
     * Viewport
     */

    this._viewport = {
        width: 0,
        height: 0
    }

    /**
     * Render target
     */

    this._render_buffer = this._context.createFramebuffer();
    this._render_target = this._context.createTexture();

    /**
     * Material
     */

    this._material = null;

    /**
     * Screen quad rendering
     */

    this._shader_program = this._context.createProgram();
    const vertex_shader = this._context.createShader(this._context.VERTEX_SHADER);
    const fragment_shader = this._context.createShader(this._context.FRAGMENT_SHADER);
    this._context.shaderSource(vertex_shader, VertexShader);
    this._context.shaderSource(fragment_shader, FragmentShader);
    this._context.compileShader(vertex_shader);
    this._context.compileShader(fragment_shader);
    this._context.attachShader(this._shader_program, vertex_shader);
    this._context.attachShader(this._shader_program, fragment_shader);
    this._context.linkProgram(this._shader_program);

    /**
     * Add automatic resizing
     */
    
    window.addEventListener('resize', () => {
        this.resize();
    });
};

/**
 * Custom resize logic
 */

Scene.prototype.on_resize = function(_on_resize) {
    this._on_resize = _on_resize;
    return this;
}

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
        this._canvas.width = window.outerWidth;
        this._canvas.height = window.outerHeight;
        this._viewport.width = this._canvas.offsetWidth;
        this._viewport.height = this._canvas.offsetHeight;
    }

    /**
     * Resize WebGL context and render immediately, to fight the possible flicker
     */

    this._context.viewport(0.0, 0.0, window.outerWidth,window.outerHeight);
    this._proj_matrix = get_projection_matrix(this._fov, this._viewport.width / this._viewport.height, this._near_clip_plane, this._far_clip_plane);
    this._view_matrix = get_view_matrix(this._viewport.width, this._fov);
    this._on_resize && this._on_resize(this._viewport.width, this._viewport.height);
    this.render();

    /**
     * Apply external logic
     */

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

    /**
     * Switch to frame buffer
     */

    this._context.bindFramebuffer(this._context.FRAMEBUFFER, this._render_buffer);
    this._context.framebufferTexture2D(this._context.FRAMEBUFFER, this._context.COLOR_ATTACHMENT0, this._context.TEXTURE_2D, this._render_target, 0);
    this._context.bindTexture(this._context.TEXTURE_2D, this._render_target);
    this._context.texImage2D(this._context.TEXTURE_2D, 0, this._context.RGBA, this._canvas.width, this._canvas.height, 0, this._context.RGBA, this._context.UNSIGNED_BYTE, null);
    this._context.texParameteri(this._context.TEXTURE_2D, this._context.TEXTURE_MIN_FILTER, this._context.LINEAR);
    this._context.texParameteri(this._context.TEXTURE_2D, this._context.TEXTURE_WRAP_S, this._context.CLAMP_TO_EDGE);
    this._context.texParameteri(this._context.TEXTURE_2D, this._context.TEXTURE_WRAP_T, this._context.CLAMP_TO_EDGE);

    /**
     * Detect dirty nodes and cascade their transformations
     */

    const dirty = this.root().reachDirty();
    for (let i = 0; i < dirty.length; ++i) {
        dirty[i].cascade();
    }

    /**
     * Clear the context
     */

    this.clear();

    /**
     * Iterate over the depth buffer and render all of the primitives
     */

    const primitives = this._depthbuffer.primitives();
    for (let i = 0; i < primitives.length; ++i) {
        primitives[i].render();
    }

    /**
     * Render the content of the render target to the screen
     */

    this._context.bindFramebuffer(this._context.FRAMEBUFFER, null);
    this._context.useProgram(this._shader_program);
    const vertexPositionAttribute = this._context.getAttribLocation(this._shader_program, "v_position");
    const textureCoordBuffer = this._context.createBuffer();
    this._context.bindBuffer(this._context.ARRAY_BUFFER, textureCoordBuffer);
    const textureCoordinates = [
        0.0,  0.0,
        1.0,  0.0,
        0.0,  1.0,                
        0.0,  1.0,
        1.0,  0.0,
        1.0,  1.0,
    ]
    this._context.bufferData(this._context.ARRAY_BUFFER, new Float32Array(textureCoordinates), this._context.STATIC_DRAW);
    const textureCoord = this._context.getAttribLocation(this._shader_program, 'aTextureCoord');
    const uSampler = this._context.getUniformLocation(this._shader_program, 'uSampler');
    const resolutionUniformLocation = this._context.getUniformLocation(this._shader_program, "u_resolution");
    this._context.bindBuffer(this._context.ARRAY_BUFFER, textureCoordBuffer);
    this._context.vertexAttribPointer(textureCoord, 2, this._context.FLOAT, false, 0, 0);
    this._context.enableVertexAttribArray(textureCoord);
    this._context.activeTexture(this._context.TEXTURE0);
    this._context.bindTexture(this._context.TEXTURE_2D, this._render_target);
    this._context.uniform1i(uSampler, 0);
    const quad_vertex_buffer = this._context.createBuffer();
    this._context.bindBuffer(this._context.ARRAY_BUFFER, quad_vertex_buffer);
    this._context.bufferData(this._context.ARRAY_BUFFER, MeshQuad, this._context.STATIC_DRAW);
    this._context.vertexAttribPointer(vertexPositionAttribute, 3, this._context.FLOAT, false, 0, 0);
    this._context.enableVertexAttribArray(vertexPositionAttribute);
    this._context.uniform2f(resolutionUniformLocation, this._viewport.width, this._viewport.height);	
    this._context.drawArrays(this._context.TRIANGLES, 0, 6);
    
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
            this.render();
        }
    }, 1000 / this._fps);
};

/**
 * Start rendering
 */

Scene.prototype.start = function() {

    /**
     * Resizing the scene
     */

    this.resize();

    /**
     * Start the rendering process
     */

    this.timer().reset();
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
