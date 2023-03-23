#version 300 es

precision highp float;

uniform sampler2D u_image2;

layout(std140) uniform AAACamera {
    mat4 matViewProj;
    vec3 lightColor;
    vec3 lightPos;
    vec3 viewPos;
};

layout(std140) uniform AAALocal {
    mat4 matWorld;
};

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

    float expectZ = sin(2.0*pi*nowX/v_rectWidth)*v_rectWidth/2.0;

    if(abs(nowZ - expectZ)<lineWidth){
        fragColor = lineColor;
    }else{
        fragColor = defaultColor;
    }
}