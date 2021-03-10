
import * as utils from "../utils/exports.js";
import { Event, eventManager, DefaultEventType, DIRECT } from "../event/eventManager.js";


export class Camera {
    private readonly _step: number = 30 / 60;
    private _aspect: number;
    private _fov: number;
    private _near: number = 1;
    private _far: number = 1000;

    private _euler: utils.Vec3;
    private _rot: utils.Quat;
    private _pos: utils.Vec3;
    private _scale: utils.Vec3;
    /**透视投影矩阵 */
    private _projMat4: utils.Mat4;
    /**仿射变换矩阵 */
    private _matView: utils.Mat4;
    /**透视变换矩阵(_projMat4*_matView) */
    private _matViewProj: utils.Mat4;

    public forward: utils.Vec3;
    public dirtyFlag: boolean = true;

    constructor() {
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

    public update(): void {
        if (this.dirtyFlag) {
            this.dirtyFlag = false;
            utils.Quat.fromRTS(this._matView, this._rot, this._pos, this._scale);
            utils.Mat4.invert(this._matView, this._matView);
            utils.Mat4.perspective(this._projMat4, this._fov, this._aspect, this._near, this._far);
            utils.Mat4.multiply(this._matViewProj, this._projMat4, this._matView);
        }
    }

    public get matView(): utils.Mat4 {
        utils.Quat.fromRTS(this._matView, this._rot, this._pos, this._scale);
        utils.Mat4.invert(this._matView, this._matView);
        return this._matView;
    }

    public get matViewProj(): utils.Mat4 {
        return this._matViewProj.clone();
    }

    private _up: utils.Vec3;
    /**相机上朝向 */
    public get up(): utils.Vec3 {
        let vec = new utils.Vec4();
        utils.Vec4.transformQuat(vec, new utils.Vec4(0, 1, 0, 0), this._rot);
        this._up.x = vec.x;
        this._up.y = vec.y;
        this._up.z = vec.z;
        return this._up;
    }

    public set up(value: utils.Vec3) {
        this._up = value;
    }

    private _right: utils.Vec3;
    /**相机右朝向 */
    public get right(): utils.Vec3 {
        let vec = new utils.Vec4();
        utils.Vec4.transformQuat(vec, new utils.Vec4(1, 0, 0, 0), this._rot);
        this._right.x = vec.x;
        this._right.y = vec.y;
        this._right.z = vec.z;
        return this._right;
    }

    public set right(value: utils.Vec3) {
        this._right = value;
    }

    /**按步数变化位置 */
    private onKeyStepDown(event: Event): void {
        let forwardNormallized: utils.Vec3;
        let rightNormallized: utils.Vec3;
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
    private onRightMouseMove(event: Event): void {
        let vector = event.data;
        const arg = 400;
        let radY = vector.x / arg * Math.PI;
        let radX = vector.y / arg * Math.PI;
        utils.Quat.rotateAround2(this._rot, this._rot, new utils.Vec3(0, 1, 0), -radY);
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
    public setRotationFromEuler(x: number, y: number, z: number): void {
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
    public getRotation(out?: utils.Quat): utils.Quat {
        return utils.Quat.set(out, this._rot.x, this._rot.y, this._rot.z, this._rot.w);
    }

    private updateForward(): void {
        this.forward.x = -this.matView.m02;
        this.forward.y = -this._matView.m06;
        this.forward.z = -this._matView.m10;
    }

    public getPos():utils.Vec3{
        return this._pos.clone();
    }
}