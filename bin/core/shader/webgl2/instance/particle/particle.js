import { Vec3 } from "../../../../utils/exports.js";
export class Particle {
    constructor() {
        this.width = 100;
        this.height = 100;
        this.position = new Vec3(0, 0, 0);
        this.worldPos = new Vec3(0, 0, 0);
        this.initialVelocity = new Vec3(0, 0, 0);
        this.acceleratedVelocity = new Vec3(0, 0, 0);
        this.lifeTime = 10;
        this.createTime = 0;
        /**初始旋转速率 rad/ms */
        this.initialRotationRate = 0;
        /**随机旋转速率范围 rad/ms */
        this.rotationRateRange = 0;
        this.randomSeed = 0;
    }
}
//# sourceMappingURL=particle.js.map