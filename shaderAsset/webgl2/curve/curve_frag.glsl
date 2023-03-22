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

out vec4 fragColor;

float near = 1.0;
float far = 1000.0;
float LinearizeDepth(float depth) {
    float z = depth * 2.0 - 1.0; // back to NDC 
    return (2.0 * near * far) / (far + near - z * (far - near));
}

void main() {
    //环境光
    float ambientStrength = 0.1;
    vec3 ambient = ambientStrength * lightColor;

    //漫反射光
    vec3 norm = normalize(v_normalVector);
    vec3 lightDir = normalize(lightPos - v_fragWorldPos);
    float diff = max(dot(norm, lightDir), 0.0);         // 点乘
    vec3 diffuse = diff * lightColor;

    //镜面反射光
    float specularStrength = 0.5;
    vec3 viewDir = normalize(viewPos - v_fragWorldPos);    // 视线方向坐标
    vec3 reflectDir = reflect(-lightDir, norm);         // 使用reflect函数计算反射光坐标
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
    vec3 specular = specularStrength * spec * lightColor;

    //vec3 objectColor = texture(u_image2, v_texcoord).rgb;
    vec3 result = (ambient + diffuse + specular) * v_specialColor.rgb;
    vec4 color = vec4(result, 1.0);

    fragColor = v_specialColor;
}