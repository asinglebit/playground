precision highp float;

varying highp vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform vec2 u_dimensions;

void main(void) {
   vec2 clipSpace = u_dimensions * vTextureCoord;
   
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
     gl_FragColor = texture2D(uSampler, vTextureCoord);
   } else {
     gl_FragColor = texture2D(uSampler, vTextureCoord) - vec4(0.6, 0.6, 0.6, 0.0);
   }
}