precision mediump float;
uniform sampler2D u_image2;

uniform vec3 lightColor;

varying vec2 v_texcoord;

void main(){
    float ambientStrength = 0.1;
    vec3 ambient = ambientStrength * lightColor;
    vec3 objectColor = texture2D(u_image2,v_texcoord).rgb;
    vec3 result = ambient * objectColor;
    vec4 color = vec4(result, 1.0);

    gl_FragColor = color;
    // gl_FragColor = vec4(0.5,0.5,0.0,1.0);
}