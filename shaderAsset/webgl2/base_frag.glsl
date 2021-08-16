//基础着色器，顶点和片元都直接通过属性注入。
precision mediump float;
uniform sampler2D u_image;

uniform vec4 color;
uniform float USE_TEXTURE;

varying vec2 v_texcoord;

float near = 1.0;
float far = 1000.0;
float LinearizeDepth(float depth) {
    float z = depth * 2.0 - 1.0; // back to NDC 
    return (2.0 * near * far) / (far + near - z * (far - near));
}

void main() {
    if(USE_TEXTURE == 1.0) {
        // float depth = texture2D(u_image, v_texcoord).r;
        // depth = LinearizeDepth(depth) / far;
        // gl_FragColor = vec4(depth, depth, depth, 1.0);
        gl_FragColor = vec4(texture2D(u_image, v_texcoord).rgb, 1.0);
    } else {
        gl_FragColor = color;
    }
}