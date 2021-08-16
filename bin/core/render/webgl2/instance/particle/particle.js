import { Vec3 } from "../../../../utils/exports.js";
import { BaseNode } from "../baseNode.js";
export class Particle extends BaseNode {
    constructor() {
        super(...arguments);
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