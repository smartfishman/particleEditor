import { Vec3 } from "../../../../utils/exports.js";

export class Particle {
    public width: number = 100;
    public height: number = 100;
    public position: Vec3 = new Vec3(0, 0, 0);
    public worldPos: Vec3 = new Vec3(0, 0, 0);
    public initialVelocity: Vec3 = new Vec3(0, 0, 0);
    public acceleratedVelocity: Vec3 = new Vec3(0, 0, 0);
    public lifeTime: number = 10;
    public createTime: number = 0;
    /**初始旋转速率 rad/ms */
    public initialRotationRate: number = 0;
    /**随机旋转速率范围 rad/ms */
    public rotationRateRange: number = 0;
    public randomSeed: number = 0;
}