import webGLManager from "../../../webGLManager.js";
import * as utils from "../../../../utils/exports.js";
import Webgl2Particle from "../../shader/webgl2_particle.js";
import { timeManager } from "../../../../utils/timeManager.js";
import { ParticleBatchModel } from "../../model/particle_batch_model.js";
import { Vec3 } from "../../../../utils/exports.js";
import { BaseRenderableComp } from "../../../baseRenderableComp.js";
export class WebGl2ParticleSystem extends BaseRenderableComp {
    constructor() {
        super();
        this.isEmitConfigChanged = true;
        /**每秒发射粒子数量 */
        this.emitRate = 10;
        /**粒子生成范围 */
        this.emitRange = 100;
        this.position = new Vec3(0, 100, 0);
        this.particleWidth = 10;
        this.particleHeight = 10;
        this.initialVelocity = new Vec3(0, -20, 0);
        this.acceleratedVelocity = new Vec3(0, 0, 0);
        /**粒子存活时间 */
        this.lifeTime = 5000;
        this.initialRotationRate = 0.2;
        this.rotationRateRange = 0.1;
        this._lastCacheCount = 0;
        this._enableShaderDebug = false;
        this.webGl2ParticleShader = new Webgl2Particle(this.getGL());
    }
    getGL() {
        return webGLManager.getWebGLRenderingContext();
    }
    update(dt) {
        if (this.isEmitConfigChanged) {
            this.reBuild();
        }
        this.model.updateParticles();
        this._emit(dt);
    }
    _emit(dt) {
        let shouldEmitCount = this.emitRate / 1000 * dt;
        let emitCount = shouldEmitCount + this._lastCacheCount;
        if (emitCount >= 1) {
            this.emit(Math.floor(emitCount));
            this._lastCacheCount = emitCount - Math.floor(emitCount);
        }
        else {
            this._lastCacheCount = emitCount;
        }
    }
    emit(count) {
        let nowTime = timeManager.getTime();
        for (let i = 0; i < count; i++) {
            let rand = Math.random();
            let particle = this.model.getFreeParticle();
            let randPos = Math.floor((rand - 0.5) * 2 * this.emitRange * this.emitRange);
            particle.position.x = this.position.x + Math.floor(randPos / this.emitRange);
            particle.position.y = this.position.y;
            particle.position.z = this.position.z + (((Math.abs(randPos) % this.emitRange) - (this.emitRange >> 1)) * 2);
            particle.initialVelocity = this.initialVelocity;
            particle.acceleratedVelocity = this.acceleratedVelocity;
            particle.lifeTime = this.lifeTime;
            particle.createTime = nowTime;
            particle.width = this.particleWidth;
            particle.height = this.particleHeight;
            particle.initialRotationRate = this.initialRotationRate;
            particle.rotationRateRange = this.rotationRateRange;
            particle.randomSeed = Math.random();
            this.model.addParticleVertexData(particle);
            //输出调试粒子
            if (this._enableShaderDebug) {
                this._enableShaderDebug = false;
                particle.lifeTime = 9999999;
                this.model.addParticleVertexData(particle);
            }
        }
    }
    /**根据当前参数配置重置所有粒子 */
    reBuild() {
        this.isEmitConfigChanged = false;
        this.model = new ParticleBatchModel(Math.ceil(this.emitRate * this.lifeTime / 1000) + 1);
    }
    draw() {
        let camera = webGLManager.getCamera();
        let matWorld = makeTranslation(0, 0, 0);
        this.webGl2ParticleShader.bindState();
        this.webGl2ParticleShader.setBufferData(this.model.getVertexData());
        this.webGl2ParticleShader.setBufferData(this.model.getIndicesData(), 2);
        this.webGl2ParticleShader.setUniformAttribute(utils.Mat4.toArray([], camera.matViewProj), matWorld, timeManager.getTime());
        this.webGl2ParticleShader.draw();
    }
    updateConfig() {
        let valueComp = document.getElementById("particleWidth");
        this.particleWidth = Number(valueComp.value);
        this.particleWidth = this.particleWidth > 0 ? this.particleWidth : 10;
        valueComp = document.getElementById("particleHeight");
        this.particleHeight = Number(valueComp.value);
        this.particleHeight = this.particleHeight > 0 ? this.particleHeight : 10;
        valueComp = document.getElementById("emitRate");
        this.emitRate = Number(valueComp.value);
        this.emitRate = this.emitRate > 0 ? this.emitRate : 10;
        valueComp = document.getElementById("lifeTime");
        this.lifeTime = Number(valueComp.value);
        this.lifeTime = this.lifeTime > 0 ? this.lifeTime : 5000;
        valueComp = document.getElementById("initialVelocityX");
        this.initialVelocity.x = Number(valueComp.value);
        this.initialVelocity.x = this.initialVelocity.x !== NaN ? this.initialVelocity.x : 0;
        valueComp = document.getElementById("initialVelocityY");
        this.initialVelocity.y = Number(valueComp.value);
        this.initialVelocity.y = this.initialVelocity.y !== NaN ? this.initialVelocity.y : -20;
        valueComp = document.getElementById("initialVelocityZ");
        this.initialVelocity.z = Number(valueComp.value);
        this.initialVelocity.z = this.initialVelocity.z !== NaN ? this.initialVelocity.z : 0;
        valueComp = document.getElementById("acceleratedVelocityX");
        this.acceleratedVelocity.x = Number(valueComp.value);
        this.acceleratedVelocity.x = this.acceleratedVelocity.x !== NaN ? this.acceleratedVelocity.x : 0;
        valueComp = document.getElementById("acceleratedVelocityY");
        this.acceleratedVelocity.y = Number(valueComp.value);
        this.acceleratedVelocity.y = this.acceleratedVelocity.y !== NaN ? this.acceleratedVelocity.y : 0;
        valueComp = document.getElementById("acceleratedVelocityZ");
        this.acceleratedVelocity.z = Number(valueComp.value);
        this.acceleratedVelocity.z = this.acceleratedVelocity.z !== NaN ? this.acceleratedVelocity.z : 0;
        valueComp = document.getElementById("initialRotationRate");
        this.initialRotationRate = Number(valueComp.value);
        this.initialRotationRate = this.initialRotationRate !== NaN ? this.initialRotationRate : 0.2;
        valueComp = document.getElementById("rotationRateRange");
        this.rotationRateRange = Number(valueComp.value);
        this.rotationRateRange = this.rotationRateRange !== NaN ? this.rotationRateRange : 0.1;
        valueComp = document.getElementById("emitRange");
        this.emitRange = Number(valueComp.value);
        this.emitRange = this.emitRange > 0 ? this.emitRange : 100;
        this.isEmitConfigChanged = true;
    }
}
function makeTranslation(tx, ty, tz) {
    return [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        tx, ty, tz, 1
    ];
}
//# sourceMappingURL=webGL2ParticleSystem.js.map