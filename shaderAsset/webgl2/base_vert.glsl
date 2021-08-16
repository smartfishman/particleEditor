//基础着色器，顶点和片元都直接通过属性注入。
attribute vec3 position;
attribute vec2 a_texcoord;

uniform mat4 matViewProj;
uniform mat4 matWorld;
uniform mat4 matWorld2;

varying vec2 v_texcoord;

void main() {
    v_texcoord = a_texcoord;
    vec4 pos = vec4(position, 1);
    pos = matViewProj * matWorld * pos;
    gl_Position = pos;
}
