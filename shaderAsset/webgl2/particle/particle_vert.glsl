

attribute vec3 a_position;
attribute vec2 a_texcoord;
attribute vec3 a_initialVelocity;
attribute vec3 a_acceleratedVelocity;
attribute float a_lifeTime;
attribute float a_createTime;
//初始每毫秒逆时针旋转弧度
attribute float a_initialRotationRate;
//逆时针旋转弧度的随机波动范围
attribute float a_rotationRateRange;
attribute float randSeed;
attribute vec3 a_worldPos;

uniform mat4 matViewProj;
uniform mat4 matWorld;
uniform float u_curTime;

varying vec2 v_texcoord;
varying float fontEnable;

//绕Z轴旋转矩阵
void makeRotationZMat4(inout mat4 outMat,in float rotationRad){
    vec4 xVec = vec4(cos(rotationRad),sin(rotationRad),0.0,0.0);
    vec4 yVec = vec4(-sin(rotationRad),cos(rotationRad),0.0,0.0);
    vec4 zVec = vec4(0.0,0.0,1.0,0.0);
    vec4 wVec = vec4(0.0,0.0,0.0,1.0);
    outMat[0] = xVec;
    outMat[1] = yVec;
    outMat[2] = zVec;
    outMat[3] = wVec;
}

/**平移一个矩阵*/
void translationMat(inout mat4 outMat,in float x,in float y,in float z){
    outMat[3][0] = x;
    outMat[3][1] = y;
    outMat[3][2] = z;
}

//根据速度和随机种子产生的随机速度计算当前走过的总路程
float getTotalSByRandomV(inout float resultS,in float initV,in float rangeV,in float t,in float lifeTime,in float randSeed){
    if(rangeV <=0.0){
        return initV*t;
    }
    float random1 = randSeed;
    float random2 = randSeed;
    if(random2 > 0.5){
        random2 -=0.5;
    }
    random2 *=  2.0;
    float range = rangeV / 2.0;
    float a1 = random1 * lifeTime + 1.0;
    float a2 = random2 * lifeTime + 1.0;
    a1 = random2 > 0.5 ? a1 : 1.0 / a1;
    a2 = random1 > 0.5 ? a2 : 1.0 / a2;
    // f1 = 25sin(t*a1) f2=25sin(t*a2)
    //原函数 F1 = -(range/a1)cos(t*a1) F2 = -(range/a2)cos(t*a2)
    //当前总路程 s1=F1(t)-F1(0) s2=F2(t)-F2(0)
    float initS = initV * t;
    float s1 = -(range / a1) * cos(t * a1) - (-(range / a1) * cos(0.0));
    float s2 = -(range / a2) * cos(t * a2) - (-(range / a2) * cos(0.0));
    float s = initS + s1 + s2;
    return s;
}

void main(){
    fontEnable = 0.0;
    v_texcoord = a_texcoord;

    float dt = (u_curTime - a_createTime)/1000.0;
    vec3 offsetPos = (a_initialVelocity+a_initialVelocity+(a_acceleratedVelocity*dt))*0.5*dt;
    vec3 finalPosition = a_worldPos + offsetPos;
    vec4 localPos = vec4(a_position,1.0);
    vec4 worldPos = vec4(finalPosition,1.0);
    mat4 worldMat = mat4(1.0);
    translationMat(worldMat,worldPos.x,worldPos.y,worldPos.z);
    // translationMat(worldMat,50.0,50.0,50.0);
    mat4 rotationMat = mat4(1.0);
    if(a_initialRotationRate !=0.0 || a_rotationRateRange>0.0){
        float rad = 4.0;
        rad = getTotalSByRandomV(rad,a_initialRotationRate,a_rotationRateRange,dt,a_lifeTime/1000.0,randSeed);
        makeRotationZMat4(rotationMat,rad);
    }
    vec4 pos =  matViewProj * matWorld * worldMat * rotationMat * localPos;
    gl_Position = pos;

    //调试输出
    if(a_lifeTime == 9999999.0){
        pos = vec4(0.5,0.5,0.5,1.0);
        if(a_texcoord.x ==0.0){
            pos.x = 0.5;
        }else{
            pos.x = 1.0;
        }
        if(a_texcoord.y==0.0){
            pos.y = 1.0;
        }else{
            pos.y = 0.5;
        }
        fontEnable = 1.0;
        gl_Position = pos;
    }
}

