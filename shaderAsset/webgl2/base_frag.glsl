//基础着色器，顶点和片元都直接通过属性注入。
precision mediump float;
uniform vec4 color;

void main(){
    gl_FragColor = color;
}