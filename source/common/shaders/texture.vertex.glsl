attribute vec3 a_position;
attribute vec2 a_texture_coord;

uniform mat4 u_matrix_cascaded;
uniform vec2 u_resolution;

varying highp vec3 v_position;
varying highp vec2 v_texture_coord;

void main(void) {
   vec2 clip_space = a_position.xy / u_resolution * 2.0 - 1.0;
   gl_Position = u_matrix_cascaded * vec4(clip_space * vec2(1, -1), a_position.z, 1);

   v_position = a_position;
   v_texture_coord = a_texture_coord;
}