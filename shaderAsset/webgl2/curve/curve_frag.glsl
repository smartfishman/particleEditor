#version 300 es

precision highp float;

uniform sampler2D u_image2;

layout(std140) uniform AAACamera {
    mat4 matViewProj;
    vec3 lightColor;
    vec3 lightPos;
    vec3 viewPos;
};

layout(std140) uniform AAAGlobal {
    vec4 gameTime;
};

layout(std140) uniform AAALocal {
    mat4 matWorld;
};

uniform float u_createTime;

in vec3 v_fragWorldPos;
in vec3 v_normalVector;
in vec3 v_specialColor;
in vec3 v_fragLocalPos;
in float v_rectWidth;

out vec4 fragColor;

float near = 1.0;
float far = 1000.0;
float LinearizeDepth(float depth) {
    float z = depth * 2.0 - 1.0; // back to NDC 
    return (2.0 * near * far) / (far + near - z * (far - near));
}

void main() {
    vec4 defaultColor = vec4(0.0,0.0,1.0,1.0);
    vec4 lineColor = vec4(1.0,1.0,0.0,1.0);

    float pi = 3.1415926;

    float nowX = v_fragLocalPos.x;
    float nowZ = v_fragLocalPos.z;
    float lineWidth = 0.5;

    //已知热扩散方程： cos((2n*PI/L)*x)*pow(e,-a*pow(2n*PI/L,2)*t
    //n 为余弦周期数 PI=3.1415926 L为画布宽度  e为自然底数 a为变换系数 x为空间位置 t为时间位置
    float n = 2.0;
    float L = v_rectWidth;
    float e = exp(1.0) * 1.0;
    float a = 0.5;
    float x = nowX;
    float t = (gameTime.x - u_createTime)/100.0;

    float expectZ = cos((2.0*n*pi/L) * x) * pow(e,-a * pow(2.0*n*pi/L,2.0)* t) * v_rectWidth/2.0;


    // float expectZ = sin(2.0*pi*nowX/v_rectWidth)*v_rectWidth/2.0;

    if(abs(nowZ - expectZ)<lineWidth){
        fragColor = lineColor;
    }else{
        fragColor = defaultColor;
    }
}