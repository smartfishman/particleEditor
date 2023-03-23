import * as utils from "../utils/exports.js";
import { eventManager, DefaultEventType, DIRECT } from "../event/eventManager.js";
import webGLManager from "../render/webGLManager.js";
import * as webglUtils from "../render/webglUtils.js";
export class Camera {
    constructor() {
        this._step = 100 / 60;
        this._near = 1;
        this._far = 1000;
        this.screenWidth = 800;
        this.screenHeight = 450;
        this.dirtyFlag = true;
        this.enableFrameBufferFeature = true;
        /**启用帧缓存渲染后，标识当前渲染阶段 */
        this._curRenderPhase = 0;
        this.forward = new utils.Vec3(0, 0, -1);
        this.up = new utils.Vec3(0, 1, 0);
        this.right = new utils.Vec3(1, 0, 0);
        this._aspect = this.screenWidth / this.screenHeight;
        this._fov = Math.PI / 4;
        this._euler = new utils.Vec3();
        this._rot = new utils.Quat();
        this._pos = new utils.Vec3(0, 200, 200);
        this._scale = new utils.Vec3(1, 1, 1);
        this._matView = new utils.Mat4();
        this._projMat4 = new utils.Mat4();
        this._matViewProj = new utils.Mat4();
        this.setRotationFromEuler(-60, 0, 0);
        eventManager.addEventListener(DefaultEventType.UP_KEY_DOWN, this.onKeyStepDown, this);
        eventManager.addEventListener(DefaultEventType.DOWN_KEY_DOWN, this.onKeyStepDown, this);
        eventManager.addEventListener(DefaultEventType.RIGHT_KEY_DOWN, this.onKeyStepDown, this);
        eventManager.addEventListener(DefaultEventType.LEFT_KEY_DOWN, this.onKeyStepDown, this);
        eventManager.addEventListener(DefaultEventType.RIGHT_MOUSE_DOWN_AND_MOVE, this.onRightMouseMove, this);
        if (this.enableFrameBufferFeature) {
            this.createFrameBuffer();
        }
    }
    get near() {
        return this._near;
    }
    get far() {
        return this._far;
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
    getPos() {
        return this._pos.clone();
    }
    createFrameBuffer() {
        if (this.enableFrameBufferFeature) {
            let gl = webGLManager.getWebGLRenderingContext();
            this.frameBufferObject = gl.createFramebuffer();
            this.targetTexture = gl.createTexture();
            this.depthStencilTexture = gl.createTexture();
            this.depthTexture = gl.createTexture();
            this.depthStencilBuffer = gl.createRenderbuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBufferObject);
            gl.activeTexture(gl.TEXTURE0);
            // gl.bindTexture(gl.TEXTURE_2D, this.depthStencilTexture);
            // gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH24_STENCIL8, 800, 450, 0, gl.DEPTH_STENCIL, gl.UNSIGNED_INT_24_8, null);
            // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            // gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.TEXTURE_2D, this.depthStencilTexture, 0);
            // gl.bindTexture(gl.TEXTURE_2D, null);
            gl.bindTexture(gl.TEXTURE_2D, this.depthTexture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT32F, 800, 450, 0, gl.DEPTH_COMPONENT, gl.FLOAT, null);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this.depthTexture, 0);
            gl.bindTexture(gl.TEXTURE_2D, null);
            gl.bindTexture(gl.TEXTURE_2D, this.targetTexture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 800, 450, 0, gl.RGB, gl.UNSIGNED_BYTE, null);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.targetTexture, 0);
            gl.bindTexture(gl.TEXTURE_2D, null);
            // gl.bindRenderbuffer(gl.RENDERBUFFER, this.depthStencilBuffer);
            // gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT24, 800, 450);
            // gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.depthStencilBuffer);
            // gl.bindRenderbuffer(gl.RENDERBUFFER, null);
            webGLManager.checkFrameBuffStatus();
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            this.frameBufferObjectForDepth = gl.createFramebuffer();
            this.targetTextureForSecond = gl.createTexture();
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBufferObjectForDepth);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.targetTextureForSecond);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, 800, 450, 0, gl.RGBA, gl.FLOAT, null);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.targetTextureForSecond, 0);
            gl.bindTexture(gl.TEXTURE_2D, null);
            webGLManager.checkFrameBuffStatus();
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }
    }
    /**
     *
     * @param phase 表示当前渲染阶段 0=第一次渲染 1=第二次渲染 2=最终渲染
     */
    bindFrameBuffer(phase) {
        let gl = webGLManager.getWebGLRenderingContext();
        if (this.enableFrameBufferFeature) {
            this._curRenderPhase = phase;
            switch (phase) {
                case webglUtils.FRAME_BUFFER_RENDER_PHASE.THE_FRIST_RENDER:
                    gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBufferObject);
                    gl.enable(gl.DEPTH_TEST);
                    gl.depthFunc(gl.LESS);
                    gl.disable(gl.STENCIL_TEST);
                    gl.enable(gl.BLEND);
                    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
                    break;
                case webglUtils.FRAME_BUFFER_RENDER_PHASE.THE_SECOND_RENDER:
                    gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBufferObjectForDepth);
                    gl.disable(gl.DEPTH_TEST);
                    gl.disable(gl.STENCIL_TEST);
                    gl.disable(gl.BLEND);
                    break;
                case webglUtils.FRAME_BUFFER_RENDER_PHASE.THE_LAST_RENDER:
                    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
                    gl.disable(gl.DEPTH_TEST);
                    gl.disable(gl.STENCIL_TEST);
                    gl.disable(gl.BLEND);
                    break;
                default:
                    console.error("渲染阶段参数错误：", phase);
                    break;
            }
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, null);
        }
        else {
            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(gl.LESS);
            gl.disable(gl.STENCIL_TEST);
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        }
        gl.clearColor(1, 1, 1, 1);
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
    }
    getCurRenderTarget() {
        if (this._curRenderPhase === webglUtils.FRAME_BUFFER_RENDER_PHASE.THE_SECOND_RENDER) {
            return this.depthTexture;
        }
        else if (this._curRenderPhase === webglUtils.FRAME_BUFFER_RENDER_PHASE.THE_LAST_RENDER) {
            return this.targetTexture;
        }
        else {
            return this.targetTexture;
        }
    }
    resetViewPos() {
        this._pos = new utils.Vec3(100, 400, -300);
        this._rot = new utils.Quat();
        let radY = 0;
        let radX = Math.PI / 2;
        utils.Quat.rotateAround2(this._rot, this._rot, new utils.Vec3(0, 1, 0), -radY);
        // utils.Quat.rotateY(this._rot, this._rot, -radY);
        utils.Quat.rotateX(this._rot, this._rot, -radX);
        this.updateForward();
        this.dirtyFlag = true;
    }
}
//# sourceMappingURL=camera.js.map