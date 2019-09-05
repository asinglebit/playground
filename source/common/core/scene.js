import {
    Node
} from "common/core/node";
import {
    DepthBuffer
} from "common/core/depth_buffer";
import {
    Primitive
} from "common/core/primitive";
import {
    Rect
} from "common/primitives/rect";

/**
 * Shaders
 */

import QuadVertexShader from "common/shaders/full_screen_quad.vertex.glsl";
import QuadFragmentShader from "common/shaders/full_screen_quad.fragment.glsl";

/**
 * Meshes
 */

import {
    MeshQuad
} from "common/meshes/quad";

/**
 * Scene constructor
 */

export function Scene(container, name, width, height) {

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

    this._factory = null;

    /**
     * Depth buffer that contains all renderable assets sorted by depth
     */

    this._depthbuffer = new DepthBuffer();

    /**
     * Root node of the scene
     */

    this._root = new(this.factory()).Node();

    /**
     * Canvas, bound to the scene
     */

    this._canvas = container.appendChild(document.createElement("canvas"));
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
     * TODO: move this out of here
     */

    // const shader_program = this._context.createProgram();
    // const vertex_shader = this._context.createShader(this._context.VERTEX_SHADER);
    // const fragment_shader = this._context.createShader(this._context.FRAGMENT_SHADER);
    // this._context.shaderSource(vertex_shader, QuadVertexShader);
    // this._context.shaderSource(fragment_shader, QuadFragmentShader);
    // this._context.compileShader(vertex_shader);
    // this._context.compileShader(fragment_shader);
    // this._context.attachShader(shader_program, vertex_shader);
    // this._context.attachShader(shader_program, fragment_shader);
    // this._context.linkProgram(shader_program);
    // this._context.useProgram(shader_program);

    // const uniformLocation = this._context.getUniformLocation(shader_program, "iTime");    
    // const vertexPositionAttribute = this._context.getAttribLocation(shader_program, "v_position");

    // const quad_vertex_buffer = this._context.createBuffer();
    // this._context.bindBuffer(this._context.ARRAY_BUFFER, quad_vertex_buffer);
    // this._context.bufferData(this._context.ARRAY_BUFFER, MeshQuad, this._context.STATIC_DRAW);
    // this._context.vertexAttribPointer(vertexPositionAttribute, 3, this._context.FLOAT, false, 0, 0);
    // this._context.enableVertexAttribArray(vertexPositionAttribute);
    // this._context.drawArrays(this._context.TRIANGLES, 0, 6);
    // this._context.uniform1f(uniformLocation, (+new Date()) * 0.001);

    function get_projection(angle, a, zMin, zMax) {
        var ang = Math.tan((angle*.5)*Math.PI/180);
        return [
           0.5/ang, 0 , 0, 0,
           0, 0.5*a/ang, 0, 0,
           0, 0, -(zMax+zMin)/(zMax-zMin), -1,
           0, 0, (-2*zMax*zMin)/(zMax-zMin), 0 
        ];
     }
        
    this._proj_matrix = get_projection(40, this._canvas.width / this._canvas.height, 1, 100);
    this._view_matrix = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,-20,1];

    /**
     * User defined callback
     */

    this._user_logic;
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
    this._context.clearColor(0.5, 0.5, 0.5, 0.9);
    this._context.clearDepth(1.0);
    function get_projection(angle, a, zMin, zMax) {
        var ang = Math.tan((angle*.5)*Math.PI/180);
        return [
           0.5/ang, 0 , 0, 0,
           0, 0.5*a/ang, 0, 0,
           0, 0, -(zMax+zMin)/(zMax-zMin), -1,
           0, 0, (-2*zMax*zMin)/(zMax-zMin), 0 
        ];
     }
        
    this._proj_matrix = get_projection(40, this._canvas.width / this._canvas.height, 1, 100);

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
 * Get or set the material of the current scene
 */

Scene.prototype.material = function(material) {
    if (material) {
        this._material = material;
        return this;
    } else {
        return this._material;
    }
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
 * Get the constructor factory
 */

Scene.prototype.factory = function() {
    this._factory = this._factory || function(scene) {
        const _Node = Node(scene);
        const _Primitive = Primitive(scene, _Node);
        const _Rect = Rect(scene, _Primitive);

        return {
            Node: _Node,
            Primitive: _Primitive,
            Rect: _Rect
        };
    }(this);

    return this._factory;
};

/**
 * Render all of the primitives that are in the depth buffer
 */

Scene.prototype.render = function() {

    // Detect dirty nodes and cascade their transformations

    const dirty = this.root().reachDirty();
    for (let i = 0; i < dirty.length; ++i) {
        dirty[i].cascade();
    }

    // Clear

    this._context.clearColor(0.5, 0.5, 0.5, 0.9);
    this._context.clearDepth(1.0);
    this._context.clear(this._context.COLOR_BUFFER_BIT | this._context.DEPTH_BUFFER_BIT);

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
            this._user_logic && this._user_logic();
            this.render();
        }
    }, 1000 / this._fps);
};

/**
 * Start rendering
 */

Scene.prototype.start = function(user_logic) {
    this._user_logic = user_logic;
    this._request_animation_frame_id = requestAnimationFrame(() => this.loop.bind(this)());
};

/**
 * Empty the scene
 */

Scene.prototype.empty = function() {
    this._depthbuffer.empty();
    this._root.detachChildren();
};
