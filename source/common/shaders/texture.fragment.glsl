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

float sd_rounded_rect( vec2 p, vec2 b, float r ) 
{
   vec2 q = abs(p) - b;
   return min(max(q.x,q.y),0.0) + length(max(q,0.0)) - r;
}

float op_subtract( float d1, float d2 )
{
   return max(-d1,d2);
}

float sd_rounded_border( vec2 p, vec2 b, float r, float border )
{
   vec2 half_dimensions = vec2(u_dimensions / 2.0) - vec2(border, border);
   vec2 round_compensation = vec2(half_dimensions.x - u_border_radius , half_dimensions.y - u_border_radius);
   return op_subtract(sd_rounded_rect(p, round_compensation, r), sd_rounded_rect(p, b, r));
}


vec4 draw_background(vec2 coordinate, vec4 color) {
   vec2 half_dimensions = vec2(u_dimensions / 2.0);
   vec2 round_compensation = vec2(half_dimensions.x - u_border_radius, half_dimensions.y - u_border_radius);
   float distance = sd_rounded_rect(coordinate - half_dimensions, round_compensation, u_border_radius);
   vec4 color_distance = -sign(distance) * color;
   return mix(color_distance, u_border_color, 1.0 - smoothstep(0.0, 1.0, abs(distance)));
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
   
   color = draw_background(coordinate, color);
   
   float inner_radius = u_border_radius / 1.6;
   vec2 half_dimensions = vec2(u_dimensions / 2.0);
   vec2 round_compensation = vec2(half_dimensions.x - inner_radius, half_dimensions.y - inner_radius);
   float distance = sd_rounded_border(coordinate - half_dimensions, round_compensation, inner_radius, u_border_radius - inner_radius / 1.6);
   vec4 color_distance = -sign(distance) * u_border_color;
   color_distance = mix(color_distance, u_border_color, 1.0 - smoothstep(0.0, 1.0, abs(distance)));

   color = mix(color, color_distance, color_distance.a * color.a);


   gl_FragColor = color;
}