/**
 * Common
 */

let canvas = null;
let gl = null;
let shader_program = null;
let uniformLocation;

/**
 * Shaders source
 */

const vertex_shader_source = `
    attribute vec4 v_position;

    void main() {
        gl_Position = v_position;
    }     
`;

const fragment_shader_source = `
    precision highp float;

    uniform float iTime;

    void main() {
        vec2 uv = gl_FragCoord.xy * (1.0 + mod(iTime, 4.0));

        int x = int(uv.x);
        int y = int(uv.y);
        for (int i = 0; i < 60; i++)
        {
            if(int(mod(float(x), 3.0)) == 1 && int(mod(float(y), 3.0)) == 1)
            {
                gl_FragColor = vec4(0.0 + iTime, 1.0, 1.0, 0.0);
                return;
            }
            x = int(x / 3);
            y = int(y / 3);
        }
        gl_FragColor = vec4(1.0, 0.0, 0.0, 0.0);
    }
`;

/**
 * Quad vertex buffer
 */

const quad_vertex_buffer_data = new Float32Array([ 
    -1.0, -1.0, 0.0,
    1.0, -1.0, 0.0,
    -1.0,  1.0, 0.0,
    -1.0,  1.0, 0.0,
    1.0, -1.0, 0.0,
    1.0,  1.0, 0.0
]);

/**
 * Initialize
 */

export const initialize = _canvas => {
    canvas = _canvas;
    gl = canvas.getContext('webgl2');
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;    

    shader_program = gl.createProgram();
    const vertex_shader = gl.createShader(gl.VERTEX_SHADER);
    const fragment_shader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertex_shader, vertex_shader_source);
    gl.shaderSource(fragment_shader, fragment_shader_source);
    gl.compileShader(vertex_shader);
    gl.compileShader(fragment_shader);
    gl.attachShader(shader_program, vertex_shader);
    gl.attachShader(shader_program, fragment_shader);
    gl.linkProgram(shader_program);
    uniformLocation = gl.getUniformLocation(shader_program, "iTime");
}
let now = + new Date();
export const render = () => {
    gl.useProgram(shader_program);
    var vertexPositionAttribute = gl.getAttribLocation(shader_program, "v_position");
    var quad_vertex_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad_vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, quad_vertex_buffer_data, gl.STATIC_DRAW);
    gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(vertexPositionAttribute);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.uniform1f(uniformLocation, (+new Date() - now) * 0.001);

    window.requestAnimationFrame(render);
}

window.requestAnimationFrame(render);