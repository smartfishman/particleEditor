import * as utils from "../utils/exports.js";
import { eventManager, DefaultEventType, DIRECT } from "../event/eventManager.js";
export class Camera {
    constructor() {
        this._step = 30 / 60;
        this._near = 1;
        this._far = 1000;
        this.dirtyFlag = true;
        this.forward = new utils.Vec3(0, 0, -1);
        this.up = new utils.Vec3(0, 1, 0);
        this.right = new utils.Vec3(1, 0, 0);
        this._aspect = 16 / 9;
        this._fov = Math.PI / 4;
        this._euler = new utils.Vec3();
        this._rot = new utils.Quat();
        this._pos = new utils.Vec3(0, 200, 200);
        this._scale = new utils.Vec3(1, 1, 1);
        this._matView = new utils.Mat4();
        this._projMat4 = new utils.Mat4();
        this._matViewProj = new utils.Mat4();
        this.setRotationFromEuler(-30, 0, 0);
        eventManager.addEventListener(DefaultEventType.UP_KEY_DOWN, this.onKeyStepDown, this);
        eventManager.addEventListener(DefaultEventType.DOWN_KEY_DOWN, this.onKeyStepDown, this);
        eventManager.addEventListener(DefaultEventType.RIGHT_KEY_DOWN, this.onKeyStepDown, this);
        eventManager.addEventListener(DefaultEventType.LEFT_KEY_DOWN, this.onKeyStepDown, this);
        eventManager.addEventListener(DefaultEventType.RIGHT_MOUSE_DOWN_AND_MOVE, this.onRightMouseMove, this);
    }
    update() {
        if (this.dirtyFlag) {
            this.dirtyFlag = false;
            utils.Quat.fromRTS(this._matView, this._rot, this._pos, this._scale);
            utils.Mat4.invert(this._matView, this._matView);
            utils.Mat4.perspective(this._projMat4, this._fov, this._aspect, this._near, this._far);
            utils.Mat4.multiply(this._matViewProj, this._projMat4, this._matView);
        }
    }
    get matView() {
        utils.Quat.fromRTS(this._matView, this._rot, this._pos, this._scale);
        utils.Mat4.invert(this._matView, this._matView);
        return this._matView;
    }
    get matViewProj() {
        return this._matViewProj.clone();
    }
    /**相机上朝向 */
    get up() {
        let vec = new utils.Vec4();
        utils.Vec4.transformQuat(vec, new utils.Vec4(0, 1, 0, 0), this._rot);
        this._up.x = vec.x;
        this._up.y = vec.y;
        this._up.z = vec.z;
        return this._up;
    }
    set up(value) {
        this._up = value;
    }
    /**相机右朝向 */
    get right() {
        let vec = new utils.Vec4();
        utils.Vec4.transformQuat(vec, new utils.Vec4(1, 0, 0, 0), this._rot);
        this._right.x = vec.x;
        this._right.y = vec.y;
        this._right.z = vec.z;
        return this._right;
    }
    set right(value) {
        this._right = value;
    }
    /**按步数变化位置 */
    onKeyStepDown(event) {
        let forwardNormallized;
        let rightNormallized;
        switch (event.data) {
            case DIRECT.UP:
                forwardNormallized = this.forward.clone().normalize();
                this._pos.add(forwardNormallized.multiplyScalar(this._step));
                break;
            case DIRECT.DOWN:
                forwardNormallized = this.forward.clone().normalize();
                this._pos.add(forwardNormallized.multiplyScalar(-this._step));
                break;
            case DIRECT.RIGHT:
                rightNormallized = this.right.clone().normalize();
                this._pos.add(rightNormallized.multiplyScalar(this._step));
                break;
            case DIRECT.LEFT:
                rightNormallized = this.right.clone().normalize();
                this._pos.add(rightNormallized.multiplyScalar(-this._step));
                break;
        }
        this.dirtyFlag = true;
    }
    /**根据鼠标的移动轨迹旋转摄像机 */
    onRightMouseMove(event) {
        let vector = event.data;
        const arg = 400;
        let radY = vector.x / arg * Math.PI;
        let radX = vector.y / arg * Math.PI;
        utils.Quat.rotateAround(this._rot, this._rot, new utils.Vec3(0, 1, 0), -radY);
        // utils.Quat.rotateY(this._rot, this._rot, -radY);
        utils.Quat.rotateX(this._rot, this._rot, -radX);
        this.updateForward();
        this.dirtyFlag = true;
    }
    /**
     * @en Set rotation in local coordinate system with euler angles
     * @zh 用欧拉角设置本地旋转
     * @param x X axis rotation
     * @param y Y axis rotation
     * @param z Z axis rotation
     */
    setRotationFromEuler(x, y, z) {
        utils.Vec3.set(this._euler, x, y, z);
        utils.Quat.fromEuler(this._rot, x, y, z);
        this.updateForward();
        this.dirtyFlag = true;
    }
    /**
     * @en Get rotation as quaternion in local coordinate system, please try to pass `out` quaternion and reuse it to avoid garbage.
     * @zh 获取本地旋转，注意，尽可能传递复用的 [[Quat]] 以避免产生垃圾。
     * @param out Set the result to out quaternion
     * @return If `out` given, the return value equals to `out`, otherwise a new quaternion will be generated and return
     */
    getRotation(out) {
        return utils.Quat.set(out, this._rot.x, this._rot.y, this._rot.z, this._rot.w);
    }
    updateForward() {
        this.forward.x = -this.matView.m02;
        this.forward.y = -this._matView.m06;
        this.forward.z = -this._matView.m10;
    }
}
//# sourceMappingURL=camera.js.map