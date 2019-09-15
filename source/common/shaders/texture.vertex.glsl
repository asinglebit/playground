attribute vec3 a_position;
attribute vec2 a_texture_coord;

uniform mat3 u_matrix_cascaded;
uniform vec2 u_resolution;

varying highp vec2 v_position;
varying highp vec2 v_texture_coord;

void main(void) {
   vec3 pos = u_matrix_cascaded * a_position;
   vec2 clip_space = vec2(pos.xy) / u_resolution * 2.0 - 1.0;
   gl_Position = vec4(clip_space * vec2(1, -1), a_position.z, 1.0);
   v_texture_coord = a_texture_coord;
}