import webGLManager from "../../../webGLManager.js";
import * as utils from "../../../../utils/exports.js";
import { Vec3 } from "../../../../utils/exports.js";
import { BaseNode } from "../baseNode.js";
import { CubeModel } from "./cube_model.js";
import Webgl2Cube from "../../webgl2_cube.js";
export class Webgl2CubeSystem {
    constructor() {
        this.webgl2CubeShader = new Webgl2Cube(this.getGL());
        this.node = new BaseNode();
        this.node.width = 100;
        this.node.position = new Vec3(0, 0, 0);
        this.model = new CubeModel();
    }
    getGL() {
        return webGLManager.getWebGLRenderingContext();
    }
    update(dt) {
        this.model.updateVertexData(this.node);
    }
    draw() {
        let camera = webGLManager.getCamera();
        let matWorld = makeTranslation(0, 0, 0);
        this.webgl2CubeShader.bindState();
        this.webgl2CubeShader.setBufferData(this.model.getVertexData());
        this.webgl2CubeShader.setBufferData(this.model.getIndicesData(), 2);
        this.webgl2CubeShader.setUniformAttribute(utils.Mat4.toArray([], camera.matViewProj), matWorld);
        this.webgl2CubeShader.draw();
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
//# sourceMappingURL=cubeSystem.js.map