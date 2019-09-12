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

float sdEquilateralTriangle(vec2 p)
{
    const float k = sqrt(3.0);
    p.x = abs(p.x) - 1.0;
    p.y = p.y + 1.0/k;
    if( p.x + k*p.y > 0.0 ) p = vec2( p.x - k*p.y, -k*p.x - p.y )/2.0;
    p.x -= clamp( p.x, -2.0, 0.0 );
    return -length(p)*sign(p.y) - 30.1;
}

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
      // && (
      //    coordinate.x < u_border_radius
      //    && coordinate.y < u_border_radius
      //    && length(coordinate - vec2(u_border_radius, u_border_radius)) > u_border_radius
      // ) || (
      //    coordinate.x > u_dimensions.x - u_border_radius
      //    && coordinate.y > u_dimensions.y - u_border_radius
      //    && length(coordinate - u_dimensions + vec2(u_border_radius, u_border_radius)) > u_border_radius
      // ) || (
      //    coordinate.x > u_dimensions.x - u_border_radius
      //    && coordinate.y < u_border_radius
      //    && length(coordinate - vec2(u_dimensions.x - u_border_radius, u_border_radius)) > u_border_radius
      // ) || (
      //    coordinate.x < u_border_radius
      //    && coordinate.y > u_dimensions.y - u_border_radius
      //    && length(coordinate - vec2(u_border_radius, u_dimensions.y - u_border_radius)) > u_border_radius
      // )
   ) {
      vec2 p = coordinate * 0.01 - u_dimensions / 200.0;
      float d = sdRoundBox(p, u_dimensions / 500.0, 0.1);
      color = -sign(d) * vec4(1.0,1.0,1.0,1.0);
      color = mix(color, vec4(1.0), 1.0 - smoothstep(0.0, 0.02, abs(d)));
}

   gl_FragColor = color;
}