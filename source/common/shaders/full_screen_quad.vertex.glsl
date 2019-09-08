attribute vec4 v_position;
attribute vec2 aTextureCoord;

varying highp vec2 vTextureCoord;

void main() {
    gl_Position = v_position;
    vTextureCoord = aTextureCoord;
}  