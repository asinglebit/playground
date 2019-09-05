precision highp float;

uniform float iTime;

void main() {
    vec2 uv = gl_FragCoord.xy * (1.0 + mod(iTime, 4.0));

    int x = int(uv.x);
    int y = int(uv.y);
    for (int i = 0; i < 60; i++)
    {
        if(int(mod(float(x), 3.0)) == 1 && int(mod(float(y), 3.0)) == 1)
        {
            gl_FragColor = vec4(sin(iTime), sin(iTime), 1.0, 0.0);
            return;
        }
        x = int(x / 3);
        y = int(y / 3);
    }
    gl_FragColor = vec4(1.0, 0.0, sin(iTime), 0.0);
}