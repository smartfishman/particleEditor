import webGLManager from "../../../webGLManager.js"
import * as utils from "../../../../utils/exports.js"
import Webgl2Particle from "../../shader/webgl2_particle.js";
import { timeManager } from "../../../../utils/timeManager.js";
import { ParticleBatchModel } from "../../model/particle_batch_model.js";
import { Particle } from "./particle.js";
import { Vec3 } from "../../../../utils/exports.js";
import { BaseRenderableComp } from "../../../baseRenderableComp.js";

export class WebGl2ParticleSystem extends BaseRenderableComp {
    private webGl2ParticleShader: Webgl2Particle;
    private model: ParticleBatchModel;

    private isEmitConfigChanged: boolean = true;

    /**每秒发射粒子数量 */
    public emitRate: number = 10;
    /**粒子生成范围 */
    public emitRange: number = 100;
    public position: Vec3 = new Vec3(0, 100, 0);

    public particleWidth: number = 10;
    public particleHeight: number = 10;
    public initialVelocity: Vec3 = new Vec3(0, -20, 0);
    public acceleratedVelocity: Vec3 = new Vec3(0, 0, 0);
    /**粒子存活时间 */
    public lifeTime: number = 5000;
    public initialRotationRate: number = 0.2;
    public rotationRateRange: number = 0.1;

    constructor() {
        super();
        this.webGl2ParticleShader = new Webgl2Particle(this.getGL());
    }

    public getGL(): WebGLRenderingContext {
        return webGLManager.getWebGLRenderingContext();
    }

    public update(dt: number): void {
        if (this.isEmitConfigChanged) {
            this.reBuild();
        }
        this.model.updateParticles();
        this._emit(dt);
    }

    private _lastCacheCount: number = 0;
    private _emit(dt: number): void {
        let shouldEmitCount = this.emitRate / 1000 * dt;
        let emitCount = shouldEmitCount + this._lastCacheCount;
        if (emitCount >= 1) {
            this.emit(Math.floor(emitCount));
            this._lastCacheCount = emitCount - Math.floor(emitCount);
        } else {
            this._lastCacheCount = emitCount;
        }
    }

    private _enableShaderDebug = false;
    private emit(count: number): void {
        let nowTime = timeManager.getTime();
        for (let i = 0; i < count; i++) {
            let rand = Math.random();
            let particle: Particle = this.model.getFreeParticle();
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
    private reBuild(): void {
        this.isEmitConfigChanged = false;
        this.model = new ParticleBatchModel(Math.ceil(this.emitRate * this.lifeTime / 1000) + 1);
    }

    public draw(): void {
        let camera = webGLManager.getCamera();
        let matWorld = makeTranslation(0, 0, 0);
        this.webGl2ParticleShader.bindState();
        this.webGl2ParticleShader.setBufferData(this.model.getVertexData());
        this.webGl2ParticleShader.setBufferData(this.model.getIndicesData(), 2);
        this.webGl2ParticleShader.setUniformAttribute(utils.Mat4.toArray([], camera.matViewProj), matWorld, timeManager.getTime());
        this.webGl2ParticleShader.draw();
    }

    public updateConfig(): void {
        let valueComp = document.getElementById("particleWidth") as HTMLInputElement;
        this.particleWidth = Number(valueComp.value);
        this.particleWidth = this.particleWidth > 0 ? this.particleWidth : 10;

        valueComp = document.getElementById("particleHeight") as HTMLInputElement;
        this.particleHeight = Number(valueComp.value);
        this.particleHeight = this.particleHeight > 0 ? this.particleHeight : 10;

        valueComp = document.getElementById("emitRate") as HTMLInputElement;
        this.emitRate = Number(valueComp.value);
        this.emitRate = this.emitRate > 0 ? this.emitRate : 10;

        valueComp = document.getElementById("lifeTime") as HTMLInputElement;
        this.lifeTime = Number(valueComp.value);
        this.lifeTime = this.lifeTime > 0 ? this.lifeTime : 5000;

        valueComp = document.getElementById("initialVelocityX") as HTMLInputElement;
        this.initialVelocity.x = Number(valueComp.value);
        this.initialVelocity.x = this.initialVelocity.x !== NaN ? this.initialVelocity.x : 0;

        valueComp = document.getElementById("initialVelocityY") as HTMLInputElement;
        this.initialVelocity.y = Number(valueComp.value);
        this.initialVelocity.y = this.initialVelocity.y !== NaN ? this.initialVelocity.y : -20;

        valueComp = document.getElementById("initialVelocityZ") as HTMLInputElement;
        this.initialVelocity.z = Number(valueComp.value);
        this.initialVelocity.z = this.initialVelocity.z !== NaN ? this.initialVelocity.z : 0;


        valueComp = document.getElementById("acceleratedVelocityX") as HTMLInputElement;
        this.acceleratedVelocity.x = Number(valueComp.value);
        this.acceleratedVelocity.x = this.acceleratedVelocity.x !== NaN ? this.acceleratedVelocity.x : 0;

        valueComp = document.getElementById("acceleratedVelocityY") as HTMLInputElement;
        this.acceleratedVelocity.y = Number(valueComp.value);
        this.acceleratedVelocity.y = this.acceleratedVelocity.y !== NaN ? this.acceleratedVelocity.y : 0;

        valueComp = document.getElementById("acceleratedVelocityZ") as HTMLInputElement;
        this.acceleratedVelocity.z = Number(valueComp.value);
        this.acceleratedVelocity.z = this.acceleratedVelocity.z !== NaN ? this.acceleratedVelocity.z : 0;

        valueComp = document.getElementById("initialRotationRate") as HTMLInputElement;
        this.initialRotationRate = Number(valueComp.value);
        this.initialRotationRate = this.initialRotationRate !== NaN ? this.initialRotationRate : 0.2;

        valueComp = document.getElementById("rotationRateRange") as HTMLInputElement;
        this.rotationRateRange = Number(valueComp.value);
        this.rotationRateRange = this.rotationRateRange !== NaN ? this.rotationRateRange : 0.1;

        valueComp = document.getElementById("emitRange") as HTMLInputElement;
        this.emitRange = Number(valueComp.value);
        this.emitRange = this.emitRange > 0 ? this.emitRange : 100;

        this.isEmitConfigChanged = true;
    }
}

function makeTranslation(tx, ty, tz): number[] {
    return [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        tx, ty, tz, 1
    ];
}