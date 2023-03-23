#version 300 es

//每个顶点里传入颜色信息


precision highp float;

in vec3 a_position;
//法向量
in vec3 a_normalVector;
layout(location = 3) in mat4 a_matWorld;
layout(location = 7) in vec3 a_color;
layout(location = 8) in float a_rectWidth;

layout(std140) uniform AAACamera {
    mat4 matViewProj;
    vec3 lightColor;
    vec3 lightPos;
    vec3 viewPos;
};

layout(std140) uniform AAALocal {
    mat4 matWorld;
};

out vec3 v_fragWorldPos;
out vec3 v_normalVector;
out vec3 v_specialColor;
out vec3 v_fragLocalPos;
out float v_rectWidth;

void main() {
    vec4 localPos = vec4(a_position, 1.0);
    vec4 pos = matViewProj * a_matWorld * localPos;
    gl_Position = pos;

    v_specialColor = a_color;
    v_fragWorldPos = (a_matWorld * localPos).xyz;
    v_normalVector = a_normalVector;
    v_fragLocalPos = a_position;
    v_rectWidth = a_rectWidth;
}