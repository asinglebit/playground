attribute vec3 position;
attribute vec2 aTextureCoord;

uniform mat4 Pmatrix;
uniform mat4 Vmatrix;
uniform mat4 Mmatrix;
uniform vec2 u_resolution;

varying highp vec2 vTextureCoord;

void main(void) {
   vec2 zeroToOne = position.xy / u_resolution;
   vec2 zeroToTwo = zeroToOne * 2.0;
   vec2 clipSpace = zeroToTwo - 1.0;
   gl_Position = Mmatrix*vec4(clipSpace * vec2(1, -1), position.z, 1);
   vTextureCoord = aTextureCoord;
}