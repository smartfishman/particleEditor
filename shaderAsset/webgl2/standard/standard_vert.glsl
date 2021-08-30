#version 300 es

precision highp float;

in vec3 a_position;
in vec2 a_texcoord;
//法向量
in vec3 a_normalVector;
layout(location = 3) in mat4 a_matWorld;

layout(std140) uniform AAACamera {
    mat4 matViewProj;
    vec3 lightColor;
    vec3 lightPos;
    vec3 viewPos;
};

layout(std140) uniform AAALocal {
    mat4 matWorld;
};

out vec2 v_texcoord;
out vec3 v_fragWorldPos;
out vec3 v_normalVector;

void main() {
    vec4 localPos = vec4(a_position, 1.0);
    vec4 pos = matViewProj * a_matWorld * localPos;
    gl_Position = pos;

    v_texcoord = a_texcoord;
    v_fragWorldPos = (a_matWorld * localPos).xyz;
    v_normalVector = a_normalVector;
}