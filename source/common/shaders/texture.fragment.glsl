precision highp float;

varying highp vec2 v_texture_coord;
varying highp vec3 v_position;

uniform sampler2D u_sampler;
uniform vec2 u_dimensions;

void main(void) {
   vec2 clipSpace = u_dimensions * v_texture_coord;
   
   float maxX = u_dimensions.x - 10.0;
   float minX = 10.0;
   float maxY = u_dimensions.y - 10.0;
   float minY = 10.0;

   if (
      clipSpace.x < maxX
      && clipSpace.x > minX
      && clipSpace.y < maxY
      && clipSpace.y > minY
   ) {
      //gl_FragColor = texture2D(u_sampler, v_texture_coord);
      //gl_FragColor = vec4(v_position.z, v_position.z, v_position.z, 1.0);
      gl_FragColor = vec4(texture2D(u_sampler, v_texture_coord).rgb / 2.0, 1.0) + vec4(v_position.z, v_position.z, v_position.z, 0.0);
    } else {
      gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
  }
}