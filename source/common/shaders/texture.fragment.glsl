precision highp float;

varying highp vec2 vTextureCoord;
varying highp vec3 vPosition;

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
      //gl_FragColor = texture2D(uSampler, vTextureCoord);
      gl_FragColor = vec4(vPosition.z, vPosition.z, vPosition.z, 1.0);
      //gl_FragColor = vec4(texture2D(uSampler, vTextureCoord).rgb / 2.0, 1.0) + vec4(vPosition.z, vPosition.z, vPosition.z, 0.0);
    } else {
      gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
  }
}