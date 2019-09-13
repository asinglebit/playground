precision highp float;

varying highp vec2 v_texture_coord;
varying highp vec3 v_position;

uniform sampler2D u_sampler;
uniform vec2 u_dimensions;
uniform vec2 u_resolution;

uniform vec4 u_background_color;
uniform vec4 u_border_color;
uniform float u_border_width;
uniform float u_border_radius;

/**
 * Permutaion flags
 */

uniform int ShadingBackground;
uniform int ShadingBorder;

float sdRoundBox( vec2 p, vec2 b, float r ) 
{
    vec2 q = abs(p) - b;
    return min(max(q.x,q.y),0.0) + length(max(q,0.0)) - r;
}

void main(void) {
   
   vec2 coordinate = u_dimensions * v_texture_coord;

   /**
    * Background
    */
  
   vec4 color;
   if (ShadingBackground == 1) {
      color = u_background_color;
   } else {
      color = texture2D(u_sampler, v_texture_coord);
   }
   
   /**
    * Borders
    */

   vec2 half_dimensions = vec2(u_dimensions / 2.0);
   vec2 round_compensation = vec2(half_dimensions.x - u_border_radius, half_dimensions.y - u_border_radius);
   float distance = sdRoundBox(coordinate - half_dimensions, round_compensation, u_border_radius);
   vec4 color_distance = -sign(distance) * color;
   color = mix(color_distance, color, 1.0 - smoothstep(0.0, 2.0, abs(distance)));
   
   gl_FragColor = color;
}