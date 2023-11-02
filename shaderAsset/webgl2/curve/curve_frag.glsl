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

float near = 1.0f;
float far = 1000.0f;
float LinearizeDepth(float depth) {
    float z = depth * 2.0f - 1.0f; // back to NDC 
    return (2.0f * near * far) / (far + near - z * (far - near));
}

// void main() {
//     vec4 defaultColor = vec4(0.0f, 0.0f, 1.0f, 1.0f);
//     vec4 lineColor = vec4(1.0f, 1.0f, 0.0f, 1.0f);

//     float pi = 3.1415926f;

//     float nowX = v_fragLocalPos.x;
//     float nowZ = v_fragLocalPos.z;
//     float lineWidth = 0.5f;

//     //已知热扩散方程： cos((2n*PI/L)*x)*pow(e,-a*pow(2n*PI/L,2)*t
//     //n 为余弦周期数 PI=3.1415926 L为画布宽度  e为自然底数 a为变换系数 x为空间位置 t为时间位置
//     float n = 2.0f;
//     float L = v_rectWidth;
//     float e = exp(1.0f) * 1.0f;
//     float a = 0.5f;
//     float x = nowX;
//     float t = (gameTime.x - u_createTime) / 100.0f;

//     float expectZ = cos((2.0f * n * pi / L) * x) * pow(e, -a * pow(2.0f * n * pi / L, 2.0f) * t) * v_rectWidth / 2.0f;

//     // float expectZ = sin(2.0*pi*nowX/v_rectWidth)*v_rectWidth/2.0;

//     if(abs(nowZ - expectZ) < lineWidth) {
//         fragColor = lineColor;
//     } else {
//         fragColor = defaultColor;
//     }
// }

float callF(float x) {
    float pi = 3.1415926f;
    float e = exp(1.0f) * 1.0f;
    float L = v_rectWidth;

    float T = 2.0f;//待显示图像的周期
    float height = v_rectWidth / 2.0f;
    return sin(x / L * 2.0f * pi * T) * height;
}

void main() {
    vec4 defaultColor = vec4(0.0f, 0.0f, 1.0f, 1.0f);
    vec4 lineColor = vec4(1.0f, 1.0f, 0.0f, 1.0f);

    float nowX = v_fragLocalPos.x;
    nowX += v_rectWidth / 2.0f;//将nowX转换为一个大于0的数
    float nowZ = v_fragLocalPos.y;
    float lineWidth = 0.5f;

    float pi = 3.1415926f;
    float e = exp(1.0f) * 1.0f;
    float L = v_rectWidth; //画布宽度

    float T = 2.0f;//待显示图像的周期
    float height = v_rectWidth / 2.0f; //待显示图像的振幅高度

    float N = 50.0f; //计算轮数

    float x = nowX;
    float a = 0.5f; //衰减速度
    float t = (gameTime.x - u_createTime) / 100.0f; //当前时间

    float expectZ = 0.0f;

    for(float n = 0.0f; n < N; n++) {

        float an = 0.0f;
        float step = 1.0f;
        for(float xx = 0.0f; xx < L; xx = xx + step) {
            an += callF(xx) * cos(n * pi * xx / L) * step * (2.0f / L);
        }
        expectZ += an * cos(n * pi * x / L) * pow(e, -a * pow(n * pi / L, 2.0f) * t);
    }

    if(abs(nowZ - expectZ) < lineWidth) {
        fragColor = lineColor;
    } else {
        fragColor = defaultColor;
    }
}