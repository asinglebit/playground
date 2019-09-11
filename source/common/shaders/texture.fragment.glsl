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
    * Border and border radius
    */

   if (ShadingBorder == 2) {
      float min_x_or_y = u_border_width + u_border_radius; 
      float max_x = u_dimensions.x - min_x_or_y;
      float max_y = u_dimensions.y - min_x_or_y;
      if (
         coordinate.x > u_dimensions.x - u_border_width
         || coordinate.x < u_border_width
         || coordinate.y > u_dimensions.y - u_border_width
         || coordinate.y < u_border_width
         || (
            u_border_radius > 0.0
            && (
               coordinate.x < min_x_or_y
               && coordinate.y < min_x_or_y
               && length(coordinate - vec2(min_x_or_y, min_x_or_y)) > u_border_radius
            ) || (
               coordinate.x > max_x
               && coordinate.y > max_y
               && length(coordinate - u_dimensions + vec2(min_x_or_y, min_x_or_y)) > u_border_radius
            ) || (
               coordinate.x > max_x
               && coordinate.y < min_x_or_y
               && length(coordinate - vec2(max_x, min_x_or_y)) > u_border_radius
            ) || (
               coordinate.x < min_x_or_y
               && coordinate.y > max_y
               && length(coordinate - vec2(min_x_or_y, max_y)) > u_border_radius
            )
         )
      ) { 
         color = u_border_color; 
      }
   }
   
   /**
    * Border radius
    */

   if (
      u_border_radius > 0.0
      && (
         coordinate.x < u_border_radius
         && coordinate.y < u_border_radius
         && length(coordinate - vec2(u_border_radius, u_border_radius)) > u_border_radius
      ) || (
         coordinate.x > u_dimensions.x - u_border_radius
         && coordinate.y > u_dimensions.y - u_border_radius
         && length(coordinate - u_dimensions + vec2(u_border_radius, u_border_radius)) > u_border_radius
      ) || (
         coordinate.x > u_dimensions.x - u_border_radius
         && coordinate.y < u_border_radius
         && length(coordinate - vec2(u_dimensions.x - u_border_radius, u_border_radius)) > u_border_radius
      ) || (
         coordinate.x < u_border_radius
         && coordinate.y > u_dimensions.y - u_border_radius
         && length(coordinate - vec2(u_border_radius, u_dimensions.y - u_border_radius)) > u_border_radius
      )
   ) {
      discard;
   }

   
   gl_FragColor = color;
}