import webGLManager from "../../webGLManager.js";
import * as utils from "../../../utils/exports.js";
import Webgl2Particle from "../webgl2_particle.js";
import { Vec3 } from "../../../utils/exports.js";
export class WebGl2ParticleSystem {
    constructor() {
        this.particleWidth = 100;
        this.particleHeight = 100;
        this.particlePos = new Vec3(0, 0, 0);
        this.initGLData();
    }
    initGLData() {
        this.webGl2ParticleShader = new Webgl2Particle(this.getGL());
        let arr = [];
        let particleCount = 1;
        let texCoordDic = [0, 1];
        for (let i = 0; i < particleCount; i++) {
            for (let j = 0; j < 4; j++) {
                let offsetX = (j < 2 ? -1 : 1) * this.particleWidth >> 1;
                let offsetY = (j % 2 === 0 ? -1 : 1) * this.particleHeight >> 1;
                arr[arr.length] = this.particlePos.x + offsetX;
                arr[arr.length] = this.particlePos.y + offsetY;
                arr[arr.length] = this.particlePos.z;
                let texCoordXIndex = j < 2 ? 0 : 1;
                let texCoordYIndex = j % 2 === 0 ? 0 : 1;
                arr[arr.length] = texCoordDic[texCoordXIndex];
                arr[arr.length] = texCoordDic[texCoordYIndex];
            }
        }
        this.buffData = new Float32Array(arr);
        this.indicesData = new Int16Array([0, 1, 2, 1, 2, 3]);
    }
    getGL() {
        return webGLManager.getWebGLRenderingContext();
    }
    update() {
        let camera = webGLManager.getCamera();
        let matWorld = makeTranslation(0, 0, 0);
        this.webGl2ParticleShader.bindState();
        this.webGl2ParticleShader.setBufferData(this.buffData);
        this.webGl2ParticleShader.setBufferData(this.indicesData, 2);
        this.webGl2ParticleShader.setUniformAttribute(utils.Mat4.toArray([], camera.matViewProj), matWorld);
    }
    draw() {
        this.update();
        this.webGl2ParticleShader.draw();
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