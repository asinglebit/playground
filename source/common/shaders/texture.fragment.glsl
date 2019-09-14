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

float sd_rounded_border( vec2 center, vec2 outer_dimensions, vec2 inner_dimensions, float outer_radius, float inner_radius )
{
   return op_subtract(sd_rounded_rect(center, inner_dimensions, inner_radius), sd_rounded_rect(center, outer_dimensions, outer_radius));
}

void main(void) {
   
   vec2 coordinate = u_dimensions * v_texture_coord;
   vec2 half_dimensions = vec2(u_dimensions / 2.0);
   vec2 center = coordinate - half_dimensions;

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
    * Rect
    */
   
   float rect_sd = sd_rounded_rect(
      center,
      half_dimensions - vec2(u_border_radius),
      u_border_radius
   );
   vec4 rect_color = -sign(rect_sd) * color;
   vec4 rect_antialias_color = mix(
      rect_color,
      color,
      1.0 - smoothstep(
         0.0,
         1.0,
         abs(rect_sd)
      )
   );
   
   /**
    * Border
    */

   if (ShadingBorder == 1) {
      color = rect_antialias_color;
   } else {
      float u_inner_radius = u_border_radius - u_border_width;
      float border_sd = sd_rounded_border(
         center,
         half_dimensions - vec2(u_border_radius),
         half_dimensions - vec2(u_border_width + u_inner_radius),
         u_border_radius,
         u_inner_radius
      );
      vec4 border_color = -sign(border_sd) * u_border_color;
      vec4 border_antialias_color = mix(
         border_color,
         u_border_color,
         1.0 - smoothstep(0.0, 1.0, abs(border_sd))
      );
      color = mix(
         rect_antialias_color,
         border_antialias_color,
         rect_antialias_color.a * border_antialias_color.a
      );
   }

   gl_FragColor = color;
}