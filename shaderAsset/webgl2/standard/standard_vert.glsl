attribute vec3 a_position;
attribute vec2 a_texcoord;
//法向量
attribute vec3 a_normalVector;

uniform mat4 matViewProj;
uniform mat4 matWorld;

varying vec2 v_texcoord;

void main(){
    v_texcoord = a_texcoord;

    vec4 localPos = vec4(a_position,1.0);
    vec4 pos = matViewProj * matWorld * localPos;
    gl_Position = pos;
    
}