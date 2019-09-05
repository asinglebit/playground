attribute vec3 position;
attribute vec2 aTextureCoord;

uniform mat4 Pmatrix;
uniform mat4 Vmatrix;
uniform mat4 Mmatrix;

varying highp vec2 vTextureCoord;

void main(void) {
   gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1.);
   vTextureCoord = aTextureCoord;
}