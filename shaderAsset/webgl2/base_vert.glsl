//基础着色器，顶点和片元都直接通过属性注入。
attribute vec3 position;
uniform mat4 matViewProj;
uniform mat4 matWorld;
uniform mat4 matWorld2;

void main(){
    vec4 pos = vec4(position,1);
    pos =  matViewProj * matWorld * pos;
    gl_Position = pos;
}
