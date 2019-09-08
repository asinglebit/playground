precision highp float;

varying highp vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform vec2 u_resolution;

void main() {
    gl_FragColor = texture2D(uSampler, vTextureCoord);
    // gl_FragColor = (
    //     texture2D(uSampler, vTextureCoord) +
    //     texture2D(uSampler, vTextureCoord + vec2(2.0 / u_resolution.x, 0.0)) +
    //     texture2D(uSampler, vTextureCoord + vec2(-2.0 / u_resolution.x, 0.0))) / 5.0 +
    //     texture2D(uSampler, vTextureCoord + vec2(0.0, (2.0 / u_resolution.y))) / 5.0 +
    //     texture2D(uSampler, vTextureCoord + vec2(0.0, (-2.0 / u_resolution.y))) / 5.0;
}